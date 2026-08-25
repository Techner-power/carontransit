import Link from "next/link";
import { TransitVehicle } from "@/lib/types";
import { calculateOnTheRoadPrice, buildDealerWhatsAppLink } from "@/lib/queries";

const statusBadge: Record<string, string> = {
  "On Water": "🔥 On Water",
  Docked: "⚓ Docked",
  Clearing: "🛃 Clearing",
  "Available at Yard": "✅ At Yard",
};

export default function TransitCard({ vehicle }: { vehicle: TransitVehicle }) {
  const otrPrice = calculateOnTheRoadPrice(vehicle);
  const whatsappLink = buildDealerWhatsAppLink(vehicle);

  return (
    <div className="bg-white border border-black/[0.12] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/transit/${vehicle.id}`}>
        <div className="h-[150px] bg-gradient-to-br from-slate-200 to-slate-300 relative flex items-center justify-center text-port-steel text-xs">
          <span className="absolute top-3 left-3 bg-customs-amber text-ink-navy text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wide">
            {statusBadge[vehicle.current_transit_status]}
          </span>
          Vehicle photo
        </div>
      </Link>

      <div className="p-4.5">
        <Link href={`/transit/${vehicle.id}`}>
          <h4 className="text-base font-bold mb-1.5 hover:text-customs-amber-dark transition-colors">
            {vehicle.vehicle_title}
          </h4>
        </Link>

        <div className="flex justify-between text-[11px] font-mono text-port-steel pb-3 mb-3 border-b border-dashed border-black/[0.12]">
          <span>Chassis ****{vehicle.chassis_masked_identifier}</span>
          <span>{vehicle.vessel_identifier}</span>
        </div>

        <div className="flex justify-between items-baseline mb-3.5">
          <span className="text-[11px] text-port-steel">On-The-Road Est.</span>
          <span className="font-mono text-[15px] font-semibold text-verified-teal">
            KES {otrPrice.toLocaleString()}
          </span>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-ink-navy text-manifest-cream py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
        >
          Text Dealer on WhatsApp
        </a>
      </div>
    </div>
  );
}
