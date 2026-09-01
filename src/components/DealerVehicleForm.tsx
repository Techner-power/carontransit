"use client";

import { useState, useTransition } from "react";
import { dealerAddVehicle } from "@/lib/dealerActions";

const STATUSES = ["On Water", "Docked", "Clearing", "Available at Yard"];

export default function DealerVehicleForm() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await dealerAddVehicle(formData);
      setResult(res);
    });
  };

  return (
    <>
      <form action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="vehicleTitle"
          required
          placeholder="Vehicle title (e.g. 2019 Mazda CX-5)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm sm:col-span-2"
        />
        <input
          name="carMake"
          required
          placeholder="Make"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <input
          name="carModel"
          required
          placeholder="Model"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <input
          name="year"
          type="number"
          required
          placeholder="Year"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <select
          name="transitStatus"
          defaultValue="On Water"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          name="cif"
          type="number"
          required
          placeholder="CIF cost (KES)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <input
          name="duty"
          type="number"
          required
          placeholder="Est. KRA duty (KES)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <input
          name="vessel"
          required
          placeholder="Vessel name"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <input
          name="eta"
          type="date"
          required
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <input
          name="chassis"
          required
          maxLength={5}
          placeholder="Chassis (max 5 chars)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <input
          name="photoUrl"
          placeholder="Photo URL"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="sm:col-span-2 bg-customs-amber text-ink-navy font-bold text-sm py-3 rounded-lg disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
      {result && (
        <p className={`mt-3 text-sm ${result.success ? "text-verified-teal" : "text-red-600"}`}>
          {result.message}
        </p>
      )}
    </>
  );
}
