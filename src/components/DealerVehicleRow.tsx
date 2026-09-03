"use client";

import { useState } from "react";
import { TransitVehicle } from "@/lib/types";
import DealerStatusControl from "./DealerStatusControl";
import DealerEditVehicleForm from "./DealerEditVehicleForm";

const statusColor: Record<string, string> = {
  Pending: "bg-customs-amber/[0.15] text-customs-amber-dark",
  Approved: "bg-verified-teal/[0.15] text-verified-teal",
  Rejected: "bg-red-100 text-red-600",
};

export default function DealerVehicleRow({ vehicle }: { vehicle: TransitVehicle }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white border border-black/[0.12] rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-sm">{vehicle.vehicle_title}</p>
          <p className="text-[12px] text-port-steel font-mono">
            Chassis ****{vehicle.chassis_masked_identifier} · {vehicle.vessel_identifier}
          </p>
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
            statusColor[vehicle.review_status] ?? ""
          }`}
        >
          {vehicle.review_status}
        </span>
      </div>

      {typeof vehicle.lead_count === "number" && vehicle.review_status === "Approved" && (
        <p className="text-[12px] text-verified-teal font-semibold mt-2">
          {vehicle.lead_count} WhatsApp {vehicle.lead_count === 1 ? "click" : "clicks"} so far
        </p>
      )}

      {vehicle.review_status === "Approved" && <DealerStatusControl vehicle={vehicle} />}

      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-3 text-xs font-semibold text-ink-navy underline"
        >
          Edit Details
        </button>
      ) : (
        <DealerEditVehicleForm vehicle={vehicle} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}
