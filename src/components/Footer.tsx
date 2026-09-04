import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink-navy-2 text-manifest-cream/50 px-6 pt-10 pb-6">
      <div className="max-w-[1180px] mx-auto">
        <div className="font-display font-extrabold text-manifest-cream text-base mb-3">
          CarOnTransit<span className="text-customs-amber">.</span>co.ke
        </div>
        <p className="text-sm max-w-md leading-relaxed">
          The first platform in Kenya tracking vehicles from the sea to your yard. Free for dealers.
          Direct to buyers.
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm mt-6">
          <Link href="/transit">Browse Transit</Link>
          <Link href="/foreign">Foreign Imports</Link>
          <Link href="/verify">Verify a Listing</Link>
          <Link href="/for-dealers">For Dealers</Link>
          <Link href="/dealer/login">Dealer Login</Link>
          <Link href="/exporter/signup">List as Exporter</Link>
          <Link href="/exporter/login">Exporter Login</Link>
          <Link href="/duty-guide">Duty Guide</Link>
          <Link href="/about">About</Link>
          <Link href="/legal">Legal</Link>
        </div>

        <div className="text-[11px] leading-relaxed border-t border-white/[0.18] pt-5 mt-7">
          CarOnTransit.co.ke is a software listing directory only. We do not own, sell, or take
          custody of any vehicle listed on this platform, and we do not process or hold buyer funds
          at any stage. All transactions, deposits, and contractual agreements are made directly
          between the buyer and the listing dealership. Duty and pricing figures shown are estimates
          for reference only and are not a substitute for confirmation from a licensed clearing agent
          or KRA.
        </div>
      </div>
    </footer>
  );
}
