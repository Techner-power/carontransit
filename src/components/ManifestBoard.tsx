import { VesselManifestRow, ShipmentStage } from "@/lib/types";

const statusColor: Record<ShipmentStage, string> = {
  "On Water": "bg-customs-amber",
  Docked: "bg-sky-400",
  Clearing: "bg-verified-teal",
  "Available at Yard": "bg-verified-teal",
};

export default function ManifestBoard({ rows }: { rows: VesselManifestRow[] }) {
  return (
    <div className="bg-ink-navy-2 border border-white/[0.18] rounded-[10px] overflow-hidden">
      <div className="flex items-center justify-between px-4.5 py-3.5 border-b border-white/[0.18]">
        <div className="font-mono text-[11px] tracking-wider uppercase text-customs-amber">
           Manifest Board — Kilindini Channel
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-manifest-cream/50">
          <span className="w-1.5 h-1.5 rounded-full bg-customs-amber pulse-dot" /> Live
        </div>
      </div>

      <div className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] px-4.5 py-2.5 text-[10px] font-mono uppercase tracking-wide text-manifest-cream/40 border-b border-white/[0.06]">
        <span>Vessel</span>
        <span>Status</span>
        <span>ETA</span>
        <span>Units</span>
      </div>

      {rows.map((row) => (
        <div
          key={row.vessel_identifier}
          className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] px-4.5 py-3 text-xs font-mono text-manifest-cream/85 border-b border-white/[0.06]"
        >
          <span>{row.vessel_identifier}</span>
          <span className="flex items-center gap-1.5 font-semibold">
            <span className={`w-1.5 h-1.5 rounded-full ${statusColor[row.status]}`} />
            {row.status}
          </span>
          <span>{row.eta_label}</span>
          <span>{row.unit_count}</span>
        </div>
      ))}
    </div>
  );
}
