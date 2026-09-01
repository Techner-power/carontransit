import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealerForm from "@/components/DealerForm";
import { getVesselsDockingThisWeek, getVerifiedDealerCount } from "@/lib/queries";

export default async function ForDealersPage() {
  const [vesselsDockingCount, dealerCount] = await Promise.all([
    getVesselsDockingThisWeek(),
    getVerifiedDealerCount(),
  ]);

  return (
    <>
      <Header vesselsDockingCount={vesselsDockingCount} dealerCount={dealerCount} />

      <div className="bg-ink-navy text-manifest-cream">
        <div className="max-w-[820px] mx-auto px-6 py-16 text-center">
          <div className="font-mono text-[11px] font-semibold text-customs-amber uppercase tracking-widest mb-3">
            For Dealers &amp; Import Yards
          </div>
          <h1 className="text-[36px] font-extrabold tracking-tight mb-4">
            List your cars in transit for free. Get leads while they&apos;re still on the water.
          </h1>
          <p className="text-manifest-cream/75 leading-relaxed max-w-[560px] mx-auto">
            We track your incoming units and send serious buyers straight to your WhatsApp — before
            your car even reaches Mombasa. No listing fee. No commission. No middleman.
          </p>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-6 py-14">
        <h2 className="text-xl font-bold mb-6">What we need from you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            { t: "Photos", d: "Clear photos of 3-5 units currently on the water." },
            { t: "Specs", d: "Make, model, year, and your CIF cost per unit." },
            { t: "ETA & Vessel", d: "Vessel name and estimated arrival date at Mombasa." },
          ].map((item) => (
            <div key={item.t} className="bg-white border border-black/[0.12] rounded-xl p-5">
              <h3 className="font-bold text-sm mb-1.5">{item.t}</h3>
              <p className="text-[13px] text-port-steel leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-6">How leads reach you</h2>
        <p className="text-port-steel leading-relaxed mb-14">
          When a buyer sees your car, one tap opens WhatsApp directly to your number, with your
          business name and the unit already filled in. You negotiate and close the deal yourself —
          we never insert ourselves into the transaction or take a cut.
        </p>

        <div className="bg-ink-navy text-manifest-cream rounded-xl p-7 mb-6 text-center">
          <h2 className="text-lg font-bold mb-2">Ready to list your own cars?</h2>
          <p className="text-sm text-manifest-cream/70 mb-5">
            Create a free dealer account and add your units directly. New listings are reviewed
            before going live, usually within 24 hours.
          </p>
          <Link
            href="/dealer/signup"
            className="inline-block bg-customs-amber text-ink-navy font-bold text-sm px-6 py-3 rounded-lg"
          >
            Create Dealer Account
          </Link>
        </div>

        <div className="bg-manifest-cream-2 border border-black/[0.12] rounded-xl p-7">
          <h2 className="text-lg font-bold mb-2">Prefer to just message us first?</h2>
          <p className="text-sm text-port-steel mb-5">
            Send your details on WhatsApp and we&apos;ll set up your account for you.
          </p>
          <DealerForm />
        </div>
      </div>

      <Footer />
    </>
  );
}
