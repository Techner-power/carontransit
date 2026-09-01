"use server";

import { supabaseAdmin } from "./supabaseAdmin";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  message: string;
}

function checkAdminSecret(secret: string): boolean {
  return secret === process.env.ADMIN_SECRET;
}

export async function getDealerOptions(): Promise<{ id: string; business_name: string }[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("dealerships")
    .select("id, business_name")
    .order("business_name");
  if (error || !data) return [];
  return data;
}

export async function addDealer(formData: FormData): Promise<ActionResult> {
  const secret = String(formData.get("adminSecret") ?? "");
  if (!checkAdminSecret(secret)) {
    return { success: false, message: "Incorrect access code." };
  }
  if (!supabaseAdmin) {
    return { success: false, message: "Server is not connected to the database yet." };
  }

  const businessName = String(formData.get("businessName") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const kraPin = String(formData.get("kraPin") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();

  // Same validation rules that caused real errors during manual entry today.
  if (!businessName || !location || !kraPin || !whatsapp) {
    return { success: false, message: "All dealer fields are required." };
  }
  if (!/^254\d{9}$/.test(whatsapp)) {
    return {
      success: false,
      message: "WhatsApp number must be in the format 254XXXXXXXXX (12 digits, no +, no leading 0).",
    };
  }

  const { error } = await supabaseAdmin.from("dealerships").insert({
    business_name: businessName,
    physical_location: location,
    kra_pin: kraPin,
    whatsapp_contact: whatsapp,
  });

  if (error) {
    return { success: false, message: `Could not save dealer: ${error.message}` };
  }

  revalidatePath("/admin");
  return { success: true, message: `Dealer "${businessName}" added successfully.` };
}

export async function addVehicle(formData: FormData): Promise<ActionResult> {
  const secret = String(formData.get("adminSecret") ?? "");
  if (!checkAdminSecret(secret)) {
    return { success: false, message: "Incorrect access code." };
  }
  if (!supabaseAdmin) {
    return { success: false, message: "Server is not connected to the database yet." };
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

  // Required fields
  if (!dealerId || !vehicleTitle || !carMake || !carModel || !vessel || !eta || !chassis) {
    return { success: false, message: "Please fill in all required fields." };
  }

  // The exact chassis length error you hit today, caught before it ever reaches Supabase
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
    return {
      success: false,
      message: "Photo URL must start with http — paste the full Supabase Storage public URL.",
    };
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
  });

  if (error) {
    return { success: false, message: `Could not save vehicle: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/transit");
  revalidatePath("/");
  return { success: true, message: `${vehicleTitle} added successfully.` };
}
