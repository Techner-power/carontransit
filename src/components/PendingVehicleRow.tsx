"use client";

import { useTransition } from "react";
import { approveVehicle, rejectVehicle } from "@/lib/adminActions";
import { TransitVehicle } from "@/lib/types";

export default function PendingVehicleRow({ vehicle }: { vehicle: TransitVehicle }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-white border border-black/[0.12] rounded-xl p-4 flex items-center justify-between gap-4">
      <div>
        <p className="font-bold text-sm">{vehicle.vehicle_title}</p>
        <p className="text-[12px] text-port-steel font-mono">
          {vehicle.dealer?.business_name} · Chassis ****{vehicle.chassis_masked_identifier} ·{" "}
          {vehicle.vessel_identifier}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              approveVehicle(vehicle.id);
            })
          }
          className="bg-verified-teal text-white text-xs font-bold px-3 py-2 rounded-lg disabled:opacity-50"
        >
          Approve
        </button>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              rejectVehicle(vehicle.id);
            })
          }
          className="bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-lg disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
