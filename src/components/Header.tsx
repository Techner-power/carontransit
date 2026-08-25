import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-ink-navy text-manifest-cream">
      <div className="flex items-center justify-between px-6 py-2.5 text-xs border-b border-white/[0.12] tracking-wide">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-customs-amber pulse-dot" />
          3 vessels docking this week · Mombasa Port
        </div>
        <div className="opacity-70 hidden sm:block">Verified dealer network · Nairobi</div>
      </div>

      <nav className="max-w-[1180px] mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-display font-extrabold text-[19px] tracking-tight">
          CarOnTransit<span className="text-customs-amber">.</span>co.ke
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium opacity-85">
          <Link href="/transit">Browse Transit</Link>
          <Link href="/verify">Verify a Listing</Link>
          <Link href="/for-dealers">For Dealers</Link>
          <Link href="/duty-guide">Duty Guide</Link>
        </div>
        <Link
          href="/for-dealers"
          className="bg-customs-amber text-ink-navy px-4.5 py-2.5 rounded-md font-bold text-[13px]"
        >
          List Your Cargo
        </Link>
      </nav>
    </header>
  );
}
