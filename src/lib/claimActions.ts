"use server";

import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

export interface ClaimResult {
  success: boolean;
  alreadyClaimed: boolean;
  message: string;
}

const CLAIM_WINDOW_HOURS = 48;

export async function isListingClaimed(listingId: string): Promise<boolean> {
  if (!supabase) return false;

  const { data } = await supabase
    .from("claims")
    .select("id")
    .eq("listing_id", listingId)
    .eq("status", "Pending")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  return Boolean(data);
}

// This is the actual fix for the race condition. Two things protect it:
// 1. We check first and return early if already claimed (fast path, good UX)
// 2. The database's partial unique index (claims_one_pending_per_listing)
//    is the real backstop — even if two requests hit this at the exact
//    same moment and both pass the check above, only one insert can
//    succeed; the second fails with a unique constraint violation, which
//    we catch and turn into the same friendly "already claimed" message.
export async function requestForeignListing(listingId: string): Promise<ClaimResult> {
  if (!supabaseAdmin) {
    return { success: false, alreadyClaimed: false, message: "Service temporarily unavailable." };
  }

  const alreadyClaimed = await isListingClaimed(listingId);
  if (alreadyClaimed) {
    return {
      success: false,
      alreadyClaimed: true,
      message: "This car has already been requested by another buyer.",
    };
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + CLAIM_WINDOW_HOURS);

  const { error } = await supabaseAdmin.from("claims").insert({
    listing_id: listingId,
    expires_at: expiresAt.toISOString(),
    status: "Pending",
  });

  if (error) {
    // Error code 23505 = unique constraint violation — this means someone
    // else's claim landed in the split second between our check above and
    // this insert. The database caught the race; we just report it.
    if (error.code === "23505") {
      return {
        success: false,
        alreadyClaimed: true,
        message: "This car has already been requested by another buyer.",
      };
    }
    return { success: false, alreadyClaimed: false, message: `Could not process request: ${error.message}` };
  }

  return {
    success: true,
    alreadyClaimed: false,
    message: "Request sent — we'll connect you with an agent shortly.",
  };
}
