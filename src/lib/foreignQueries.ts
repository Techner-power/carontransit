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
  return data as ForeignListing[];
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
  return data as ForeignListing;
}
