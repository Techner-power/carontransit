import Header from "@/components/Header";
import Footer from "@/components/Footer";

const checks = [
  {
    title: "Ask for the full chassis number",
    desc: "We only ever show the last 4 digits publicly, to stop competitors and scrapers from cloning listings. A genuine dealer will confirm the full chassis over WhatsApp or in person without hesitation.",
  },
  {
    title: "Match the vessel name",
    desc: "Every listing names a real vessel (e.g. MOL Grandeur, Hoegh Tracer). You can independently search vessel tracking sites for that ship's current position to sanity-check the ETA the dealer gave you.",
  },
  {
    title: "Confirm the dealer's KRA PIN in person",
    desc: "Every dealer on CarOnTransit has submitted a KRA PIN during onboarding. Ask to see it, and visit their physical yard before sending any deposit — a legitimate dealer will never discourage this.",
  },
  {
    title: "Never send money to CarOnTransit",
    desc: "We do not collect deposits, hold funds, or process payments of any kind. If anyone asks you to pay 'CarOnTransit' directly for a booking, it is not us — report it immediately.",
  },
];

import { getVesselsDockingThisWeek, getVerifiedDealerCount } from "@/lib/queries";

export default async function VerifyPage() {
  const [vesselsDockingCount, dealerCount] = await Promise.all([
    getVesselsDockingThisWeek(),
    getVerifiedDealerCount(),
  ]);
  return (
    <>
      <Header vesselsDockingCount={vesselsDockingCount} dealerCount={dealerCount} />
      <div className="max-w-[820px] mx-auto px-6 py-16">
        <div className="font-mono text-[11px] font-semibold text-customs-amber-dark uppercase tracking-widest mb-3">
          Trust & Safety
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight mb-4">How to verify a listing</h1>
        <p className="text-port-steel leading-relaxed mb-10">
          CarOnTransit checks every listing against shipping manifests before it goes live, but the
          final check is always yours — here is exactly what to do before you commit any money.
        </p>

        <div className="space-y-6">
          {checks.map((c, i) => (
            <div key={c.title} className="flex gap-4 bg-white border border-black/[0.12] rounded-xl p-5">
              <div className="font-mono text-customs-amber-dark font-bold text-sm shrink-0">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1.5">{c.title}</h3>
                <p className="text-[13px] text-port-steel leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-ink-navy text-manifest-cream rounded-xl p-6">
          <h3 className="font-bold text-sm mb-2">Suspect a fake listing?</h3>
          <p className="text-[13px] text-manifest-cream/70 leading-relaxed">
            Message us with the listing link and chassis digits shown, and we will take it down while
            we investigate with the dealer.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
