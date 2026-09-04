"use server";

import { createServerSupabase } from "./supabase/serverClient";
import { supabaseAdmin } from "./supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { TransitVehicle, Exporter } from "./types";

export interface ActionResult {
  success: boolean;
  message: string;
}

function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

// Every admin action below calls this first — it confirms there's a real,
// logged-in Supabase session AND that the session's email is on the
// ADMIN_EMAILS allowlist, before anything touches the service-role client.
async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return null;
  }
  return user;
}

export async function adminSignIn(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { success: false, message: "Incorrect email or password." };
  }
  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { success: false, message: "This account does not have admin access." };
  }

  redirect("/admin/dashboard");
}

export async function adminSignOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getPendingVehicles(): Promise<TransitVehicle[]> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from("transit_inventory")
    .select("*, dealer:dealerships(*)")
    .eq("review_status", "Pending")
    .order("created_at", { ascending: true });

  return (data as TransitVehicle[]) ?? [];
}

export async function approveVehicle(vehicleId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { error } = await supabaseAdmin
    .from("transit_inventory")
    .update({ review_status: "Approved" })
    .eq("id", vehicleId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/dashboard");
  revalidatePath("/transit");
  revalidatePath("/");
  return { success: true, message: "Vehicle approved and now live." };
}

export async function rejectVehicle(vehicleId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { error } = await supabaseAdmin
    .from("transit_inventory")
    .update({ review_status: "Rejected" })
    .eq("id", vehicleId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Vehicle rejected." };
}

// Admin manually adding a dealer or vehicle directly — same as before, but
// gated by real login instead of a shared access code. Uses the service
// role client so it bypasses RLS entirely (admin has full control).
export async function getDealerOptions(): Promise<{ id: string; business_name: string }[]> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) return [];

  const { data } = await supabaseAdmin.from("dealerships").select("id, business_name").order("business_name");
  return data ?? [];
}

export async function addDealer(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const businessName = String(formData.get("businessName") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const kraPin = String(formData.get("kraPin") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();

  if (!businessName || !location || !kraPin || !whatsapp) {
    return { success: false, message: "All dealer fields are required." };
  }
  if (!/^254\d{9}$/.test(whatsapp)) {
    return { success: false, message: "WhatsApp number must be in the format 254XXXXXXXXX." };
  }

  const { error } = await supabaseAdmin.from("dealerships").insert({
    business_name: businessName,
    physical_location: location,
    kra_pin: kraPin,
    whatsapp_contact: whatsapp,
  });

  if (error) return { success: false, message: `Could not save dealer: ${error.message}` };

  revalidatePath("/admin/dashboard");
  return { success: true, message: `Dealer "${businessName}" added successfully.` };
}

export async function addVehicle(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const dealerId = String(formData.get("dealerId") ?? "");
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

  if (!dealerId || !vehicleTitle || !carMake || !carModel || !vessel || !eta || !chassis) {
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
    return { success: false, message: "Photo URL must start with http." };
  }

  const { error } = await supabaseAdmin.from("transit_inventory").insert({
    dealer_id: dealerId,
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
    review_status: "Approved", // admin-added cars are trusted immediately
    price_hidden: priceHidden,
  });

  if (error) return { success: false, message: `Could not save vehicle: ${error.message}` };

  revalidatePath("/admin/dashboard");
  revalidatePath("/transit");
  revalidatePath("/");
  return { success: true, message: `${vehicleTitle} added and live immediately.` };
}

export async function getExporters(): Promise<Exporter[]> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) return [];

  const { data } = await supabaseAdmin.from("exporters").select("*").order("company_name");
  return (data as Exporter[]) ?? [];
}

// The only way an exporter account becomes usable. Deliberately gated
// behind requireAdmin() — exporters have no way to approve themselves.
export async function approveExporter(exporterId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { error } = await supabaseAdmin
    .from("exporters")
    .update({ is_approved: true })
    .eq("id", exporterId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Exporter approved." };
}

// The only place an exporter's quota can change. Deliberately gated behind
// requireAdmin() and using the service-role client — exporters themselves
// have no update policy on their own row, so this is the sole path.
export async function updateExporterQuota(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin || !supabaseAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const exporterId = String(formData.get("exporterId") ?? "");
  const quotaRaw = String(formData.get("quota") ?? "");
  const quota = Number(quotaRaw);

  if (!exporterId || !quota || quota < 0) {
    return { success: false, message: "Invalid quota value." };
  }

  const { error } = await supabaseAdmin
    .from("exporters")
    .update({ listing_quota: quota })
    .eq("id", exporterId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Quota updated." };
}
