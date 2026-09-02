"use client";

import { useState, useTransition } from "react";
import { dealerUpdateVehicleStatus } from "@/lib/dealerActions";
import { TransitVehicle, ShipmentStage, ListingStatus } from "@/lib/types";

const TRANSIT_STATUSES: ShipmentStage[] = ["On Water", "Docked", "Clearing", "Available at Yard"];
const LISTING_STATUSES: ListingStatus[] = ["Active", "Reserved", "Sold"];

export default function DealerStatusControl({ vehicle }: { vehicle: TransitVehicle }) {
  const [transitStatus, setTransitStatus] = useState(vehicle.current_transit_status);
  const [listingStatus, setListingStatus] = useState(vehicle.listing_status);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    const formData = new FormData();
    formData.set("vehicleId", vehicle.id);
    formData.set("transitStatus", transitStatus);
    formData.set("listingStatus", listingStatus);

    startTransition(async () => {
      const result = await dealerUpdateVehicleStatus(formData);
      setMessage(result.message);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
      <select
        value={transitStatus}
        onChange={(e) => setTransitStatus(e.target.value as ShipmentStage)}
        className="border border-black/[0.15] rounded-lg px-2 py-1.5 text-xs bg-white"
      >
        {TRANSIT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={listingStatus}
        onChange={(e) => setListingStatus(e.target.value as ListingStatus)}
        className="border border-black/[0.15] rounded-lg px-2 py-1.5 text-xs bg-white"
      >
        {LISTING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={isPending}
        className="bg-ink-navy text-manifest-cream text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Update"}
      </button>
      {message && <span className="text-[11px] text-verified-teal">{message}</span>}
    </div>
  );
}
