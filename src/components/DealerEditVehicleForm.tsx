"use client";

import { useState, useTransition } from "react";
import { dealerEditVehicle } from "@/lib/dealerActions";
import { TransitVehicle } from "@/lib/types";

export default function DealerEditVehicleForm({
  vehicle,
  onClose,
}: {
  vehicle: TransitVehicle;
  onClose: () => void;
}) {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    formData.set("vehicleId", vehicle.id);
    startTransition(async () => {
      const res = await dealerEditVehicle(formData);
      setResult(res);
    });
  };

  return (
    <div className="mt-3 bg-manifest-cream-2 border border-black/[0.12] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">Edit Details</h3>
        <button onClick={onClose} className="text-xs text-port-steel underline">
          Cancel
        </button>
      </div>
      <p className="text-[12px] text-port-steel mb-3">
        Saving changes sends this listing back for re-approval before it&apos;s public again.
      </p>
      <form action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="vehicleTitle"
          required
          defaultValue={vehicle.vehicle_title}
          placeholder="Vehicle title"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm sm:col-span-2 bg-white"
        />
        <input
          name="carMake"
          required
          defaultValue={vehicle.car_make}
          placeholder="Make"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <input
          name="carModel"
          required
          defaultValue={vehicle.car_model}
          placeholder="Model"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <input
          name="year"
          type="number"
          required
          defaultValue={vehicle.year_of_manufacture}
          placeholder="Year"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <input
          name="cif"
          type="number"
          required
          defaultValue={vehicle.cif_cost_kes}
          placeholder="CIF cost (KES)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <input
          name="duty"
          type="number"
          required
          defaultValue={vehicle.kra_duty_estimated}
          placeholder="Est. KRA duty (KES)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <input
          name="vessel"
          required
          defaultValue={vehicle.vessel_identifier}
          placeholder="Vessel name"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <input
          name="eta"
          type="date"
          required
          defaultValue={vehicle.estimated_arrival_date}
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <input
          name="chassis"
          required
          maxLength={5}
          defaultValue={vehicle.chassis_masked_identifier}
          placeholder="Chassis (max 5 chars)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <input
          name="photoUrl"
          defaultValue={vehicle.vehicle_hero_image}
          placeholder="Photo URL"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <label className="flex items-center gap-2 text-[13px] text-port-steel sm:col-span-2">
          <input type="checkbox" name="priceHidden" value="true" defaultChecked={vehicle.price_hidden} />
          Hide price publicly — buyer must message for it
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="sm:col-span-2 bg-customs-amber text-ink-navy font-bold text-sm py-2.5 rounded-lg disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {result && (
        <p className={`mt-3 text-sm ${result.success ? "text-verified-teal" : "text-red-600"}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}
