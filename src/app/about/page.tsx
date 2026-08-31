import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { getVesselsDockingThisWeek, getVerifiedDealerCount } from "@/lib/queries";

export default async function AboutPage() {
  const [vesselsDockingCount, dealerCount] = await Promise.all([
    getVesselsDockingThisWeek(),
    getVerifiedDealerCount(),
  ]);
  return (
    <>
      <Header vesselsDockingCount={vesselsDockingCount} dealerCount={dealerCount} />
      <div className="max-w-[720px] mx-auto px-6 py-16">
        <div className="font-mono text-[11px] font-semibold text-customs-amber-dark uppercase tracking-widest mb-3">
          About
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight mb-6">Why CarOnTransit exists</h1>
        <div className="space-y-5 text-port-steel leading-relaxed">
          <p>
            Every year, thousands of vehicles arrive in Kenya through the Port of Mombasa. Dealers
            have capital tied up for weeks while units sit on the water, and buyers who want to skip
            the showroom markup have no reliable way to see what&apos;s actually in transit — or to
            trust a deal enough to commit before the car lands.
          </p>
          <p>
            CarOnTransit.co.ke is a free listing directory that closes that gap. We track real
            shipping manifests, verify the dealers who list on the platform, and connect buyers
            directly to sellers over WhatsApp — with no fees, no funds held, and no middleman
            standing between the two of you.
          </p>
          <p>
            We are a software platform, not a dealership, a broker, or a payment processor. Every
            transaction happens directly between a buyer and a verified local dealer.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
