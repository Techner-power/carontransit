import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LegalPage() {
  return (
    <>
      <Header />
      <div className="max-w-[720px] mx-auto px-6 py-16">
        <div className="font-mono text-[11px] font-semibold text-customs-amber-dark uppercase tracking-widest mb-3">
          Legal
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight mb-8">Terms &amp; Liability Disclaimer</h1>

        <div className="space-y-6 text-[14px] text-port-steel leading-relaxed">
          <div>
            <h3 className="font-bold text-ink-navy mb-1.5">1. Platform Role</h3>
            <p>
              CarOnTransit.co.ke is a software listing directory that aggregates vehicle transit
              information supplied by third-party dealerships. We do not own, sell, import, or take
              custody of any vehicle listed on this platform.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-ink-navy mb-1.5">2. No Handling of Funds</h3>
            <p>
              We do not process, collect, or hold any payment, deposit, or booking fee at any stage.
              All financial transactions occur directly between the buyer and the listing dealership.
              CarOnTransit accepts no liability for any payment made outside or in connection with the
              platform.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-ink-navy mb-1.5">3. Listing Accuracy</h3>
            <p>
              Vehicle details, pricing, and duty estimates are supplied by listing dealerships and are
              provided for reference only. CarOnTransit makes reasonable efforts to cross-check
              chassis and vessel information but does not guarantee the accuracy, availability, or
              condition of any listed vehicle.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-ink-navy mb-1.5">4. Duty & Pricing Estimates</h3>
            <p>
              All KRA duty and on-the-road price figures shown are estimates only and are not a
              substitute for confirmation from a licensed clearing agent or the Kenya Revenue
              Authority.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-ink-navy mb-1.5">5. Third-Party Contracts</h3>
            <p>
              CarOnTransit accepts no liability for any dispute, breach of contract, or loss arising
              from a transaction between a buyer and a listing dealership.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
