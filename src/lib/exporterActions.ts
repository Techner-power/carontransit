"use server";

import { createServerSupabase } from "./supabase/serverClient";
import { supabaseAdmin } from "./supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function exporterSignUp(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const companyName = String(formData.get("companyName") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();

  if (!email || !password || !companyName || !country || !whatsapp) {
    return { success: false, message: "All fields are required." };
  }
  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  const supabase = await createServerSupabase();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { success: false, message: authError?.message ?? "Could not create account." };
  }

  // Uses the service-role client for the same reason as dealer signup: the
  // session may not be active yet at this exact moment (Supabase's default
  // email confirmation timing), so an RLS-scoped insert could fail here.
  const { error: exporterError } = await supabaseAdmin!.from("exporters").insert({
    auth_user_id: authData.user.id,
    company_name: companyName,
    country,
    contact_whatsapp: whatsapp,
    // listing_quota defaults to 2 in the database — not set here, so an
    // exporter can never influence their own starting quota via this form.
  });

  if (exporterError) {
    return {
      success: false,
      message: `Account created, but exporter profile failed to save: ${exporterError.message}. Contact support.`,
    };
  }

  redirect("/exporter/dashboard");
}

export async function exporterSignIn(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: "Incorrect email or password." };
  }

  redirect("/exporter/dashboard");
}

export async function exporterSignOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/exporter/login");
}

export async function getMyExporterProfile() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("exporters")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();
  return data;
}

export async function getMyForeignListings() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: exporterRow } = await supabase
    .from("exporters")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();
  if (!exporterRow) return [];

  const { data } = await supabase
    .from("foreign_listings")
    .select("*")
    .eq("exporter_id", exporterRow.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

// Quota is enforced HERE, not just in the database — this gives the
// exporter a clear, specific message ("you've used 2 of 2") instead of a
// raw RLS rejection error if they somehow got past the UI.
export async function exporterAddForeignListing(formData: FormData): Promise<ActionResult> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in." };
  }

  const { data: exporterRow } = await supabase
    .from("exporters")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!exporterRow) {
    return { success: false, message: "No exporter profile found for this account." };
  }
  if (!exporterRow.is_approved) {
    return {
      success: false,
      message: "Your account is still awaiting approval. You can't list vehicles yet.",
    };
  }

  const { count } = await supabase
    .from("foreign_listings")
    .select("*", { count: "exact", head: true })
    .eq("exporter_id", exporterRow.id);

  if ((count ?? 0) >= exporterRow.listing_quota) {
    return {
      success: false,
      message: `You've used all ${exporterRow.listing_quota} of your listing slots. Contact us on WhatsApp to unlock more.`,
    };
  }

  const vehicleTitle = String(formData.get("vehicleTitle") ?? "").trim();
  const carMake = String(formData.get("carMake") ?? "").trim();
  const carModel = String(formData.get("carModel") ?? "").trim();
  const yearRaw = String(formData.get("year") ?? "");
  const fobRaw = String(formData.get("fob") ?? "");
  const photoUrl = String(formData.get("photoUrl") ?? "").trim();

  if (!vehicleTitle || !carMake || !carModel || !photoUrl) {
    return { success: false, message: "Please fill in all required fields, including a photo." };
  }
  const year = Number(yearRaw);
  const currentYear = new Date().getFullYear();
  if (!year || year < 1990 || year > currentYear + 1) {
    return { success: false, message: `Year must be between 1990 and ${currentYear + 1}.` };
  }
  const fob = Number(fobRaw);
  if (!fob || fob <= 0) {
    return { success: false, message: "FOB price must be a positive number." };
  }
  if (!photoUrl.startsWith("http")) {
    return { success: false, message: "Photo must be uploaded before submitting." };
  }

  const { error } = await supabase.from("foreign_listings").insert({
    exporter_id: exporterRow.id,
    vehicle_title: vehicleTitle,
    car_make: carMake,
    car_model: carModel,
    year_of_manufacture: year,
    fob_price_kes: fob,
    vehicle_hero_image: photoUrl,
    listing_status: "Active",
    review_status: "Pending",
  });

  if (error) {
    return { success: false, message: `Could not save listing: ${error.message}` };
  }

  revalidatePath("/exporter/dashboard");
  return {
    success: true,
    message: "Listing submitted for review. It will appear once approved.",
  };
}
