import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ManifestBoard from "@/components/ManifestBoard";
import TransitCard from "@/components/TransitCard";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import { getTransitVehicles, getManifestBoard, getVesselsDockingThisWeek, getVerifiedDealerCount } from "@/lib/queries";

export default async function Home() {
  const [vehicles, manifest, vesselsDockingCount, dealerCount] = await Promise.all([
    getTransitVehicles(),
    getManifestBoard(),
    getVesselsDockingThisWeek(),
    getVerifiedDealerCount(),
  ]);
  const preview = vehicles.slice(0, 3);

  return (
    <>
      <Header vesselsDockingCount={vesselsDockingCount} dealerCount={dealerCount} />

      <div className="max-w-[1180px] mx-auto px-6 pt-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start bg-ink-navy text-manifest-cream">
        <div>
          <div className="font-mono text-xs font-semibold text-customs-amber uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-customs-amber" /> Live Transit Marketplace · Kenya
          </div>
          <h1 className="text-[36px] sm:text-[52px] leading-[1.02] font-extrabold tracking-tight mb-5">
            Reserve your car
            <br />
            before it hits <span className="text-customs-amber">the ground.</span>
          </h1>
          <p className="text-base leading-relaxed text-manifest-cream/75 max-w-[460px] mb-8">
            Every car en route to Mombasa — Vitz, Note, CX-5, Prado — priced, tracked, and ready
            to reserve before it clears customs. No broker fees. No sending money abroad.
          </p>
          <div className="flex flex-wrap gap-3.5 mb-11">
            <Link
              href="/transit"
              className="bg-customs-amber text-ink-navy px-6.5 py-4 rounded-lg font-bold text-sm shadow-[0_8px_24px_rgba(232,147,74,0.25)]"
            >
              Browse Cars in Transit →
            </Link>
            <a
              href="#how-it-works"
              className="border border-white/[0.18] text-manifest-cream px-6.5 py-4 rounded-lg font-semibold text-sm"
            >
              See How It Works
            </a>
          </div>
          <div className="flex gap-7 pt-6 border-t border-white/[0.18]">
            <div>
              <div className="font-display text-[22px] font-extrabold">{vehicles.length}+</div>
              <div className="text-[11px] text-manifest-cream/55 uppercase tracking-wide mt-0.5">
                Units Tracked
              </div>
            </div>
            <div>
              <div className="font-display text-[22px] font-extrabold">{dealerCount}</div>
              <div className="text-[11px] text-manifest-cream/55 uppercase tracking-wide mt-0.5">
                Verified Dealers
              </div>
            </div>
            <div>
              <div className="font-display text-[22px] font-extrabold">0</div>
              <div className="text-[11px] text-manifest-cream/55 uppercase tracking-wide mt-0.5">
                Funds Held By Us
              </div>
            </div>
          </div>
        </div>

        <ManifestBoard rows={manifest} />
      </div>

      <div className="h-16 bg-ink-navy" />

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <section className="max-w-[1180px] mx-auto px-6 pb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="font-mono text-[11px] font-semibold text-customs-amber-dark uppercase tracking-widest mb-3">
              Currently In Transit
            </div>
            <h2 className="text-[26px] font-extrabold">Fresh off the manifest</h2>
          </div>
          <Link href="/transit" className="text-sm font-bold text-customs-amber-dark">
            View all {vehicles.length} units →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {preview.map((v) => (
            <TransitCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      <TrustSection />

      <Footer />
    </>
  );
}
