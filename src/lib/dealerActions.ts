"use server";

import { createServerSupabase } from "./supabase/serverClient";
import { supabaseAdmin } from "./supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function dealerSignUp(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const businessName = String(formData.get("businessName") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const kraPin = String(formData.get("kraPin") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();

  if (!email || !password || !businessName || !location || !kraPin || !whatsapp) {
    return { success: false, message: "All fields are required." };
  }
  if (!/^254\d{9}$/.test(whatsapp)) {
    return {
      success: false,
      message: "WhatsApp number must be in the format 254XXXXXXXXX.",
    };
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

  // Create the dealership profile linked to this new auth account.
  // We use the service-role client here (not the RLS-scoped one) because
  // Supabase's default setting requires email confirmation before a new
  // signup gets an active session — at this exact moment, auth.uid() may
  // still be null even though the account was just created, which would
  // cause the RLS policy to reject the insert. The service role bypasses
  // that entirely, which is safe here since we're the ones who just
  // verified authData.user.id came from a real, just-created account.
  const { error: dealerError } = await supabaseAdmin!.from("dealerships").insert({
    auth_user_id: authData.user.id,
    business_name: businessName,
    physical_location: location,
    kra_pin: kraPin,
    whatsapp_contact: whatsapp,
  });

  if (dealerError) {
    return {
      success: false,
      message: `Account created, but dealer profile failed to save: ${dealerError.message}. Contact support.`,
    };
  }

  redirect("/dealer/dashboard");
}

export async function dealerSignIn(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: "Incorrect email or password." };
  }

  redirect("/dealer/dashboard");
}

export async function dealerSignOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/dealer/login");
}

// Dealer's own vehicle submission — always saved as Pending, never auto-approved.
// Uses the dealer's own authenticated session (not the service role key), so
// RLS enforces they can only ever insert under their own dealer_id.
export async function dealerAddVehicle(formData: FormData): Promise<ActionResult> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in." };
  }

  const { data: dealerRow } = await supabase
    .from("dealerships")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!dealerRow) {
    return { success: false, message: "No dealer profile found for this account." };
  }

  const vehicleTitle = String(formData.get("vehicleTitle") ?? "").trim();
  const carMake = String(formData.get("carMake") ?? "").trim();
  const carModel = String(formData.get("carModel") ?? "").trim();
  const yearRaw = String(formData.get("year") ?? "");
  const cifRaw = String(formData.get("cif") ?? "");
  const dutyRaw = String(formData.get("duty") ?? "");
  const vessel = String(formData.get("vessel") ?? "").trim();
  const eta = String(formData.get("eta") ?? "");
  const chassis = String(formData.get("chassis") ?? "").trim();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim();
  const transitStatus = String(formData.get("transitStatus") ?? "On Water");
  const priceHidden = formData.get("priceHidden") === "true";

  if (!vehicleTitle || !carMake || !carModel || !vessel || !eta || !chassis) {
    return { success: false, message: "Please fill in all required fields." };
  }
  if (chassis.length > 5) {
    return {
      success: false,
      message: `Chassis identifier must be 5 characters or fewer (you entered ${chassis.length}).`,
    };
  }
  const year = Number(yearRaw);
  const currentYear = new Date().getFullYear();
  if (!year || year < 1990 || year > currentYear + 1) {
    return { success: false, message: `Year must be between 1990 and ${currentYear + 1}.` };
  }
  const cif = Number(cifRaw);
  if (!cif || cif <= 0) {
    return { success: false, message: "CIF cost must be a positive number." };
  }
  const duty = Number(dutyRaw);
  if (!duty || duty <= 0) {
    return { success: false, message: "Estimated duty must be a positive number." };
  }
  if (photoUrl && !photoUrl.startsWith("http")) {
    return { success: false, message: "Photo URL must be a full http link." };
  }

  const { error } = await supabase.from("transit_inventory").insert({
    dealer_id: dealerRow.id,
    vehicle_title: vehicleTitle,
    car_make: carMake,
    car_model: carModel,
    year_of_manufacture: year,
    cif_cost_kes: cif,
    kra_duty_estimated: duty,
    vessel_identifier: vessel,
    estimated_arrival_date: eta,
    current_transit_status: transitStatus,
    chassis_masked_identifier: chassis,
    vehicle_hero_image: photoUrl || "",
    listing_status: "Active",
    review_status: "Pending", // always starts pending — admin must approve
    price_hidden: priceHidden,
  });

  if (error) {
    return { success: false, message: `Could not save vehicle: ${error.message}` };
  }

  revalidatePath("/dealer/dashboard");
  return {
    success: true,
    message: `${vehicleTitle} submitted for review. It will appear on the site once approved.`,
  };
}

export async function getMyDealerProfile() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("dealerships")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();
  return data;
}

export async function getMyVehicles() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: dealerRow } = await supabase
    .from("dealerships")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();
  if (!dealerRow) return [];

  const { data } = await supabase
    .from("transit_inventory")
    .select("*")
    .eq("dealer_id", dealerRow.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}
