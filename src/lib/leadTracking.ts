"use server";

import { supabase } from "./supabase";

// Fired the moment a buyer taps "Text Dealer on WhatsApp." This never blocks
// or delays the WhatsApp link from opening — it's a fire-and-forget log,
// not something the buyer waits on. If it fails silently, the WhatsApp
// button still works; the only thing lost is that one data point.
export async function logWhatsAppClick(vehicleId: string, dealerId: string): Promise<void> {
  if (!supabase || !vehicleId || !dealerId) return;
  try {
    await supabase.from("lead_events").insert({ vehicle_id: vehicleId, dealer_id: dealerId });
  } catch {
    // Never let a logging failure affect the buyer's experience.
  }
}
