"use client";

import { useState, useTransition } from "react";
import { exporterAddForeignListing } from "@/lib/exporterActions";
import PhotoUploadField from "./PhotoUploadField";

export default function ExporterVehicleForm() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await exporterAddForeignListing(formData);
      setResult(res);
    });
  };

  return (
    <>
      <form action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="vehicleTitle"
          required
          placeholder="Vehicle title (e.g. 2020 Toyota Rav4)"
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
        <input
          name="fob"
          type="number"
          required
          placeholder="FOB price (KES)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm"
        />
        <PhotoUploadField />
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
