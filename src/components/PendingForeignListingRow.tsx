"use client";

import { useTransition } from "react";
import { approveForeignListing, rejectForeignListing } from "@/lib/adminActions";
import { ForeignListing } from "@/lib/types";

export default function PendingForeignListingRow({ listing }: { listing: ForeignListing }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-white border border-black/[0.12] rounded-xl p-4 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ink-navy text-manifest-cream uppercase tracking-wide">
            Foreign
          </span>
          <p className="font-bold text-sm">{listing.vehicle_title}</p>
        </div>
        <p className="text-[12px] text-port-steel font-mono">
          {listing.exporter?.company_name} · {listing.exporter?.country} · FOB KES{" "}
          {Number(listing.fob_price_kes).toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              approveForeignListing(listing.id);
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
              rejectForeignListing(listing.id);
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
