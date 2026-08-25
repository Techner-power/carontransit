const steps = [
  {
    n: "01 — BROWSE",
    title: "Find your unit",
    desc: "Filter by make, budget, and arrival window while it's still on the water — before showroom markup applies.",
  },
  {
    n: "02 — VERIFY",
    title: "Check the manifest",
    desc: "Every listing shows its vessel, ETA, and a masked chassis number cross-checked against shipping logs.",
  },
  {
    n: "03 — BOOK",
    title: "Message the dealer direct",
    desc: "One tap opens WhatsApp with the dealer who holds the unit. You negotiate and pay them directly — never us.",
  },
  {
    n: "04 — CLEAR",
    title: "Track it to your yard",
    desc: "Watch status move from On Water → Docked → Clearing → Available, right up to collection.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-[1180px] mx-auto px-6 py-20">
      <div className="max-w-[560px] mb-13">
        <div className="font-mono text-[11px] font-semibold text-customs-amber-dark uppercase tracking-widest mb-3">
          The Process
        </div>
        <h2 className="text-[34px] font-extrabold tracking-tight leading-tight">
          Four steps from the sea to your driveway.
        </h2>
        <p className="text-[15px] text-port-steel mt-3 leading-relaxed">
          Every listing on CarOnTransit follows the same verified path — nothing skips a step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-black/[0.12] border border-black/[0.12] rounded-[10px] overflow-hidden">
        {steps.map((step) => (
          <div key={step.n} className="bg-manifest-cream p-7">
            <div className="font-mono text-xs text-customs-amber-dark font-bold mb-4">{step.n}</div>
            <h3 className="text-base font-bold mb-2">{step.title}</h3>
            <p className="text-[13px] text-port-steel leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
