"use client";

import { useState, useEffect, useTransition } from "react";
import { addDealer, addVehicle, getDealerOptions, ActionResult } from "@/lib/adminActions";

const STATUSES = ["On Water", "Docked", "Clearing", "Available at Yard"];

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
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
    formData.set("adminSecret", adminSecret);
    startTransition(async () => {
      const result = await addDealer(formData);
      setDealerResult(result);
      if (result.success) {
        refreshDealers();
      }
    });
  };

  const handleVehicleSubmit = (formData: FormData) => {
    formData.set("adminSecret", adminSecret);
    startTransition(async () => {
      const result = await addVehicle(formData);
      setVehicleResult(result);
    });
  };

  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold mb-1">Internal Admin</h1>
      <p className="text-sm text-port-steel mb-8">
        Add dealers and vehicles without touching Supabase directly. Not linked from anywhere on
        the public site.
      </p>

      <div className="mb-10">
        <label className="block text-xs font-bold uppercase tracking-wide text-port-steel mb-2">
          Access Code
        </label>
        <input
          type="password"
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value)}
          placeholder="Enter access code"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full max-w-xs"
        />
      </div>

      {/* Add Dealer */}
      <section className="bg-white border border-black/[0.12] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Add a Dealer</h2>
        <form action={handleDealerSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            className="sm:col-span-2 bg-ink-navy text-manifest-cream font-bold text-sm py-3 rounded-lg disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Add Dealer"}
          </button>
        </form>
        {dealerResult && (
          <p className={`mt-3 text-sm ${dealerResult.success ? "text-verified-teal" : "text-red-600"}`}>
            {dealerResult.message}
          </p>
        )}
      </section>

      {/* Add Vehicle */}
      <section className="bg-white border border-black/[0.12] rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Add a Vehicle</h2>
        <form action={handleVehicleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            name="dealerId"
            required
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm sm:col-span-2 bg-white"
            defaultValue=""
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
            placeholder="Vehicle title (e.g. 2019 Mazda CX-5)"
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm sm:col-span-2"
          />
          <input
            name="carMake"
            required
            placeholder="Make (e.g. Mazda)"
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
          />
          <input
            name="carModel"
            required
            placeholder="Model (e.g. CX-5)"
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
            placeholder="Photo URL (Supabase Storage link)"
            className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="sm:col-span-2 bg-customs-amber text-ink-navy font-bold text-sm py-3 rounded-lg disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Add Vehicle"}
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
