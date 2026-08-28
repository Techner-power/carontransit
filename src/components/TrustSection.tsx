const pillars = [
  {
    icon: "01",
    title: "We never touch your money",
    desc: "CarOnTransit is a listing directory. Every payment happens directly between you and the dealer — we hold nothing, and we say so on every page.",
  },
  {
    icon: "02",
    title: "Chassis-checked listings",
    desc: "Every unit is cross-referenced against shipping manifests before it goes live. We show you the last 4 digits so you can verify it yourself with the dealer.",
  },
  {
    icon: "03",
    title: "Verified dealer network only",
    desc: "Every dealer on this platform is KRA PIN-verified and has a physical yard you can visit. No anonymous sellers, ever.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-ink-navy text-manifest-cream">
      <div className="max-w-[1180px] mx-auto px-6 py-20">
        <div className="max-w-[600px] mb-8">
          <div className="font-mono text-[11px] font-semibold text-customs-amber uppercase tracking-widest mb-3">
            Why Trust This Platform
          </div>
          <h2 className="text-[34px] font-extrabold tracking-tight leading-tight">
            We built this to remove the two fears that stop people from buying in transit.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5">
          {pillars.map((p) => (
            <div key={p.title} className="border border-white/[0.18] rounded-xl p-6.5">
              <div className="text-customs-amber font-mono text-sm font-bold mb-4">
  {p.icon}
              </div>
              <h3 className="text-[15px] font-bold mb-2">{p.title}</h3>
              <p className="text-[13px] text-manifest-cream/65 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
