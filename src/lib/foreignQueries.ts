import { supabase } from "./supabase";
import { ForeignListing } from "./types";

export async function getForeignListings(): Promise<ForeignListing[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("foreign_listings")
    .select("*, exporter:exporters(*)")
    .eq("review_status", "Approved")
    .neq("listing_status", "Sold")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  // Fetch all live claims once, then mark each listing rather than
  // querying claims per-listing (N+1).
  const { data: liveClaims } = await supabase
    .from("claims")
    .select("listing_id")
    .eq("status", "Pending")
    .gt("expires_at", new Date().toISOString());

  const claimedIds = new Set((liveClaims ?? []).map((c) => c.listing_id));

  return (data as ForeignListing[]).map((l) => ({
    ...l,
    is_claimed: claimedIds.has(l.id),
  }));
}

export async function getForeignListingById(id: string): Promise<ForeignListing | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("foreign_listings")
    .select("*, exporter:exporters(*)")
    .eq("id", id)
    .eq("review_status", "Approved")
    .single();

  if (error || !data) return null;

  const { data: liveClaim } = await supabase
    .from("claims")
    .select("id")
    .eq("listing_id", id)
    .eq("status", "Pending")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  return { ...(data as ForeignListing), is_claimed: Boolean(liveClaim) };
}
