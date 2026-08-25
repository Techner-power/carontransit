import { supabase } from "./supabase";
import { mockVehicles, mockManifestBoard } from "./mockData";
import { TransitVehicle, VesselManifestRow } from "./types";

export interface TransitFilters {
  make?: string;
  maxBudget?: number;
  status?: string;
}

export async function getTransitVehicles(filters: TransitFilters = {}): Promise<TransitVehicle[]> {
  if (!supabase) {
    return applyMockFilters(mockVehicles, filters);
  }

  let query = supabase
    .from("transit_inventory")
    .select("*, dealer:dealerships(*)")
    .order("estimated_arrival_date", { ascending: true });

  if (filters.make) query = query.eq("car_make", filters.make);
  if (filters.status) query = query.eq("current_transit_status", filters.status);
  if (filters.maxBudget) query = query.lte("cif_cost_kes", filters.maxBudget);

  const { data, error } = await query;
  if (error || !data) {
    console.error("Supabase query failed, falling back to mock data:", error);
    return applyMockFilters(mockVehicles, filters);
  }
  return data as TransitVehicle[];
}

export async function getTransitVehicleById(id: string): Promise<TransitVehicle | null> {
  if (!supabase) {
    return mockVehicles.find((v) => v.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("transit_inventory")
    .select("*, dealer:dealerships(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return mockVehicles.find((v) => v.id === id) ?? null;
  }
  return data as TransitVehicle;
}

export async function getManifestBoard(): Promise<VesselManifestRow[]> {
  // The manifest board is a derived/aggregated view. In production this would
  // be a Postgres view or RPC grouping transit_inventory by vessel_identifier.
  // For now it's mock-driven; wire it to a real `vessel_manifest` view once
  // there's enough live inventory to make the aggregation meaningful.
  return mockManifestBoard;
}

function applyMockFilters(vehicles: TransitVehicle[], filters: TransitFilters): TransitVehicle[] {
  return vehicles.filter((v) => {
    if (filters.make && v.car_make !== filters.make) return false;
    if (filters.status && v.current_transit_status !== filters.status) return false;
    if (filters.maxBudget && Number(v.cif_cost_kes) > filters.maxBudget) return false;
    return true;
  });
}

export function calculateOnTheRoadPrice(vehicle: TransitVehicle): number {
  const localClearingBuffer = 65000;
  return Number(vehicle.cif_cost_kes) + Number(vehicle.kra_duty_estimated) + localClearingBuffer;
}

export function buildDealerWhatsAppLink(vehicle: TransitVehicle): string {
  const dealer = vehicle.dealer;
  if (!dealer) return "#";
  const message = `Hi ${dealer.business_name}, nimeona hii ${vehicle.vehicle_title} ikiwa kwa transit kwenye CarOnTransit.co.ke (Stock ID: ****${vehicle.chassis_masked_identifier}). Nataka kuishika ngeta chake kabla haijagusa ground Mombasa. Bado iko available nipitise booking deposit?`;
  return `https://wa.me/${dealer.whatsapp_contact}?text=${encodeURIComponent(message)}`;
}
