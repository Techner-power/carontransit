export type ShipmentStage = "On Water" | "Docked" | "Clearing" | "Available at Yard";

// Separate from ShipmentStage: this tracks whether the unit is still up for
// grabs, not where it physically is in transit. A car can be "On Water" and
// "Reserved" at the same time (buyer has claimed it before it even docks).
export type ListingStatus = "Active" | "Reserved" | "Sold";

export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export interface Dealership {
  id: string;
  auth_user_id?: string | null;
  business_name: string;
  physical_location: string;
  kra_pin: string;
  whatsapp_contact: string; // format 2547XXXXXXXX
  is_premium_partner: boolean;
  rating_score: number;
  created_at: string;
}

// Foreign exporters — a separate trust category from local dealers. No KRA
// PIN, no physical yard, and manually approved by you (only exporters
// already known to you or your dealer network).
export interface Exporter {
  id: string;
  auth_user_id?: string | null;
  company_name: string;
  country: string;
  contact_whatsapp: string;
  listing_quota: number; // starts at 2 (free), raised manually after payment
  is_approved: boolean; // must be manually approved by admin before it's usable
  created_at: string;
}

export interface ForeignListing {
  id: string;
  exporter_id: string;
  vehicle_title: string;
  car_make: string;
  car_model: string;
  year_of_manufacture: number;
  fob_price_kes: number;
  vehicle_hero_image: string;
  listing_status: ListingStatus;
  review_status: ReviewStatus;
  created_at: string;
  exporter?: Exporter;
  // Computed at query time from the claims table, not a real database
  // column — true if a live (unexpired, Pending) claim exists.
  is_claimed?: boolean;
}

export interface TransitVehicle {
  id: string;
  dealer_id: string;
  vehicle_title: string;
  car_make: string;
  car_model: string;
  year_of_manufacture: number;
  cif_cost_kes: number;
  kra_duty_estimated: number;
  vessel_identifier: string;
  estimated_arrival_date: string;
  current_transit_status: ShipmentStage;
  listing_status: ListingStatus;
  review_status: ReviewStatus;
  // When true, the public site hides CIF/duty/OTR figures and shows
  // "Message dealer for pricing" instead — matches dealers who only
  // disclose price once a buyer reaches out directly, rather than
  // publishing it on the listing itself.
  price_hidden: boolean;
  // Only populated on the dealer's own dashboard (via getMyVehicles) — a
  // count of WhatsApp clicks this listing has generated. Not part of the
  // database row itself, computed at query time.
  lead_count?: number;
  chassis_masked_identifier: string;
  vehicle_hero_image: string;
  is_direct_foreign_listing: boolean;
  created_at: string;
  // joined at query time
  dealer?: Dealership;
}

export interface VesselManifestRow {
  vessel_identifier: string;
  status: ShipmentStage;
  eta_label: string;
  unit_count: number;
}
