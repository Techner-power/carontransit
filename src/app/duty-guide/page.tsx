import Header from "@/components/Header";
import Footer from "@/components/Footer";

const terms = [
  {
    term: "CIF (Cost, Insurance & Freight)",
    def: "The price of the vehicle plus shipping insurance and freight to Mombasa Port. This is the base figure a dealer quotes before any duty is added.",
  },
  {
    term: "CRSP (Current Retail Selling Price)",
    def: "A KRA reference table listing the current retail price of each vehicle model. Duty is calculated as a percentage of the CRSP value, depreciated for the vehicle's age — not the price you actually paid.",
  },
  {
    term: "Import Duty & Excise",
    def: "A combination of import duty, excise duty, and VAT applied to the depreciated CRSP value. The exact rate depends on engine size and vehicle type.",
  },
  {
    term: "IDF (Import Declaration Fee) & Railway Development Levy",
    def: "Smaller statutory fees charged on top of duty, calculated as a percentage of the CIF value.",
  },
];

import { getVesselsDockingThisWeek, getVerifiedDealerCount } from "@/lib/queries";

export default async function DutyGuidePage() {
  const [vesselsDockingCount, dealerCount] = await Promise.all([
    getVesselsDockingThisWeek(),
    getVerifiedDealerCount(),
  ]);
  return (
    <>
      <Header vesselsDockingCount={vesselsDockingCount} dealerCount={dealerCount} />
      <div className="max-w-[780px] mx-auto px-6 py-16">
        <div className="font-mono text-[11px] font-semibold text-customs-amber-dark uppercase tracking-widest mb-3">
          Duty Guide
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight mb-4">
          How Kenyan vehicle import duty actually works
        </h1>
        <p className="text-port-steel leading-relaxed mb-10">
          Every listing on CarOnTransit shows an estimated duty figure so you can budget before you
          commit. Here is what goes into that number — and why it&apos;s always an estimate, never a
          final invoice.
        </p>

        <div className="space-y-5 mb-12">
          {terms.map((t) => (
            <div key={t.term} className="border-l-2 border-customs-amber pl-5">
              <h3 className="font-bold text-sm mb-1.5">{t.term}</h3>
              <p className="text-[13px] text-port-steel leading-relaxed">{t.def}</p>
            </div>
          ))}
        </div>

        <div className="bg-ink-navy text-manifest-cream rounded-xl p-6">
          <h3 className="font-bold text-sm mb-2">Why we don&apos;t show a duty calculator (yet)</h3>
          <p className="text-[13px] text-manifest-cream/70 leading-relaxed">
            CRSP values and depreciation bands change and vary by exact model variant. A wrong
            estimate would cost you more than no estimate at all. Every duty figure shown is a
            dealer-provided estimate — always confirm the final number with your dealer or a licensed
            clearing agent before paying a deposit.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
