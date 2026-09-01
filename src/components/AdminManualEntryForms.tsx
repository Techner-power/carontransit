"use client";

import { useState, useEffect, useTransition } from "react";
import { addDealer, addVehicle, getDealerOptions, ActionResult } from "@/lib/adminActions";

const STATUSES = ["On Water", "Docked", "Clearing", "Available at Yard"];

export default function AdminManualEntryForms() {
  const [dealers, setDealers] = useState<{ id: string; business_name: string }[]>([]);
  const [dealerResult, setDealerResult] = useState<ActionResult | null>(null);
  const [vehicleResult, setVehicleResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const refreshDealers = () => {
    getDealerOptions().then(setDealers);
  };

  useEffect(() => {
    refreshDealers();
  }, []);

  const handleDealerSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await addDealer(formData);
      setDealerResult(result);
      if (result.success) refreshDealers();
    });
  };

  const handleVehicleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await addVehicle(formData);
      setVehicleResult(result);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="bg-white border border-black/[0.12] rounded-xl p-6">
        <h2 className="text-base font-bold mb-4">Manually Add a Dealer</h2>
        <form action={handleDealerSubmit} className="grid grid-cols-1 gap-3">
          <input
            name="businessName"
            required
            placeholder="Business name"
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
          />
          <input
            name="location"
            required
            placeholder="Yard location"
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
          />
          <input
            name="kraPin"
            required
            placeholder="KRA PIN"
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
          />
          <input
            name="whatsapp"
            required
            placeholder="254712345678"
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-ink-navy text-manifest-cream font-bold text-sm py-2.5 rounded-lg disabled:opacity-50"
          >
            Add Dealer
          </button>
        </form>
        {dealerResult && (
          <p className={`mt-3 text-sm ${dealerResult.success ? "text-verified-teal" : "text-red-600"}`}>
            {dealerResult.message}
          </p>
        )}
      </section>

      <section className="bg-white border border-black/[0.12] rounded-xl p-6">
        <h2 className="text-base font-bold mb-4">Manually Add a Vehicle</h2>
        <form action={handleVehicleSubmit} className="grid grid-cols-1 gap-3">
          <select
            name="dealerId"
            required
            defaultValue=""
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white"
          >
            <option value="" disabled>
              Select dealer
            </option>
            {dealers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.business_name}
              </option>
            ))}
          </select>
          <input
            name="vehicleTitle"
            required
            placeholder="Vehicle title"
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="cif"
              type="number"
              required
              placeholder="CIF cost"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
            />
            <input
              name="duty"
              type="number"
              required
              placeholder="Est. duty"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="vessel"
              required
              placeholder="Vessel"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
            />
            <input
              name="eta"
              type="date"
              required
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="chassis"
              required
              maxLength={5}
              placeholder="Chassis (max 5)"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
            />
            <input
              name="photoUrl"
              placeholder="Photo URL"
              className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-customs-amber text-ink-navy font-bold text-sm py-2.5 rounded-lg disabled:opacity-50"
          >
            Add Vehicle (goes live immediately)
          </button>
        </form>
        {vehicleResult && (
          <p className={`mt-3 text-sm ${vehicleResult.success ? "text-verified-teal" : "text-red-600"}`}>
            {vehicleResult.message}
          </p>
        )}
      </section>
    </div>
  );
}
