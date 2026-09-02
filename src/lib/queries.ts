import { supabase } from "./supabase";
import { mockVehicles } from "./mockData";
import { TransitVehicle, VesselManifestRow } from "./types";

export interface TransitFilters {
  make?: string;
  maxBudget?: number;
  status?: string;
}

export async function getTransitVehicles(filters: TransitFilters = {}): Promise<TransitVehicle[]> {
  if (!supabase) {
    return applyMockFilters(mockVehicles, filters).filter((v) => v.listing_status !== "Sold");
  }

  let query = supabase
    .from("transit_inventory")
    .select("*, dealer:dealerships(*)")
    .neq("listing_status", "Sold")
    .eq("review_status", "Approved")
    .order("estimated_arrival_date", { ascending: true });

  if (filters.make) query = query.eq("car_make", filters.make);
  if (filters.status) query = query.eq("current_transit_status", filters.status);
  if (filters.maxBudget) query = query.lte("cif_cost_kes", filters.maxBudget);

  const { data, error } = await query;
  if (error || !data) {
    console.error("Supabase query failed, falling back to mock data:", error);
    return applyMockFilters(mockVehicles, filters).filter((v) => v.listing_status !== "Sold");
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
  const vehicles = await getTransitVehicles();

  if (vehicles.length === 0) {
    return [];
  }

  // Group real vehicles by vessel, since multiple units can share one ship.
  const vesselGroups = new Map<string, TransitVehicle[]>();
  for (const v of vehicles) {
    const group = vesselGroups.get(v.vessel_identifier) ?? [];
    group.push(v);
    vesselGroups.set(v.vessel_identifier, group);
  }

  const today = new Date();

  const rows: VesselManifestRow[] = Array.from(vesselGroups.entries()).map(([vessel, units]) => {
    // If units on the same vessel have different transit statuses (unlikely
    // but possible), show whichever is furthest along — Docked/Clearing
    // matters more to a buyer than "On Water".
    const stagePriority: Record<string, number> = {
      "Available at Yard": 4,
      Clearing: 3,
      Docked: 2,
      "On Water": 1,
    };
    const furthestStage = units.reduce((furthest, u) =>
      stagePriority[u.current_transit_status] > stagePriority[furthest.current_transit_status]
        ? u
        : furthest
    ).current_transit_status;

    const eta = new Date(units[0].estimated_arrival_date);
    const daysUntilEta = Math.ceil((eta.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const etaLabel =
      furthestStage === "Available at Yard"
        ? "Arrived"
        : daysUntilEta <= 0
        ? "Arrived"
        : `${daysUntilEta} day${daysUntilEta === 1 ? "" : "s"}`;

    return {
      vessel_identifier: vessel,
      status: furthestStage as VesselManifestRow["status"],
      eta_label: etaLabel,
      unit_count: units.length,
    };
  });

  // Soonest-arriving vessels first, most relevant to a buyer browsing now.
  return rows.sort((a, b) => {
    const etaA = new Date(vehicles.find((v) => v.vessel_identifier === a.vessel_identifier)!.estimated_arrival_date);
    const etaB = new Date(vehicles.find((v) => v.vessel_identifier === b.vessel_identifier)!.estimated_arrival_date);
    return etaA.getTime() - etaB.getTime();
  });
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
  const message = `Hello ${dealer.business_name}, I saw your ${vehicle.vehicle_title} listed as currently in transit on CarOnTransit.co.ke (Stock ID: ****${vehicle.chassis_masked_identifier}). I'm interested in reserving this unit before it arrives at Mombasa. Is it still available, and how do I proceed with a booking deposit?`;
  return `https://wa.me/${dealer.whatsapp_contact}?text=${encodeURIComponent(message)}`;
}

// Counts distinct vessels with an estimated arrival within the next 7 days —
// this is the real number behind the top-bar "vessels docking this week" text.
export async function getVesselsDockingThisWeek(): Promise<number> {
  const vehicles = await getTransitVehicles();
  const today = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(today.getDate() + 7);

  const vesselsThisWeek = new Set(
    vehicles
      .filter((v) => {
        const eta = new Date(v.estimated_arrival_date);
        return eta >= today && eta <= weekFromNow;
      })
      .map((v) => v.vessel_identifier)
  );

  return vesselsThisWeek.size;
}

// Real count of dealers in the network, for the "Verified dealer network" line.
export async function getVerifiedDealerCount(): Promise<number> {
  if (!supabase) {
    return new Set(mockVehicles.map((v) => v.dealer_id)).size;
  }
  const { count, error } = await supabase
    .from("dealerships")
    .select("*", { count: "exact", head: true });

  if (error || count === null) {
    return new Set(mockVehicles.map((v) => v.dealer_id)).size;
  }
  return count;
}

// Returns every distinct car make actually in the database, sorted alphabetically.
// This replaces a hardcoded make list, so the Browse filter never falls behind
// what dealers have actually listed (e.g. a new brand like Subaru shows up
// automatically the moment it's entered, no code change needed).
export async function getAvailableMakes(): Promise<string[]> {
  const vehicles = await getTransitVehicles();
  const makes = new Set(vehicles.map((v) => v.car_make));
  return Array.from(makes).sort();
}
