export type ShipmentStage = "On Water" | "Docked" | "Clearing" | "Available at Yard";

export interface Dealership {
  id: string;
  business_name: string;
  physical_location: string;
  kra_pin: string;
  whatsapp_contact: string; // format 2547XXXXXXXX
  is_premium_partner: boolean;
  rating_score: number;
  created_at: string;
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
