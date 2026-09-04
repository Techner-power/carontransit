import Link from "next/link";
import { ForeignListing } from "@/lib/types";

export default function ForeignListingCard({ listing }: { listing: ForeignListing }) {
  return (
    <div className="bg-white border border-black/[0.12] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/foreign/${listing.id}`}>
        <div className="h-[150px] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.vehicle_hero_image}
            alt={listing.vehicle_title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-ink-navy text-manifest-cream text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wide">
            🌍 Foreign — Not Yet Shipped
          </span>
        </div>
      </Link>

      <div className="p-4.5">
        <Link href={`/foreign/${listing.id}`}>
          <h4 className="text-base font-bold mb-1.5 hover:text-customs-amber-dark transition-colors">
            {listing.vehicle_title}
          </h4>
        </Link>

        <p className="text-[11px] font-mono text-port-steel pb-3 mb-3 border-b border-dashed border-black/[0.12]">
          Listed by {listing.exporter?.company_name}
        </p>

        <div className="flex justify-between items-baseline mb-3.5">
          <span className="text-[11px] text-port-steel">FOB Price</span>
          <span className="font-mono text-[15px] font-semibold text-verified-teal">
            KES {Number(listing.fob_price_kes).toLocaleString()}
          </span>
        </div>

        <Link
          href={`/foreign/${listing.id}`}
          className="w-full bg-ink-navy text-manifest-cream py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
