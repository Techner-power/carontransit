"use client";

import { Package, formatQuota } from "@/lib/packages";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/constants";

export default function PackagesSection({
  packages,
  currentQuota,
  accountName,
}: {
  packages: Package[];
  currentQuota: number;
  accountName: string;
}) {
  const handleRequest = (pkg: Package) => {
    const message = `Hi, I'd like to upgrade my account (${accountName}) on CarOnTransit.co.ke to the ${pkg.name} package (${formatQuota(pkg.quota)} listings, ${pkg.price}). How do I proceed with payment?`;
    const link = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-1">Packages</h2>
      <p className="text-[13px] text-port-steel mb-4">
        Pick whichever fits your budget — request a package and we&apos;ll confirm payment with
        you directly on WhatsApp.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {packages.map((pkg) => {
          const isCurrent = pkg.quota === currentQuota;
          return (
            <div
              key={pkg.name}
              className={`border rounded-xl p-4 ${
                isCurrent
                  ? "border-verified-teal bg-verified-teal/[0.06]"
                  : "border-black/[0.12] bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm">{pkg.name}</h3>
                {isCurrent && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-verified-teal/[0.15] text-verified-teal">
                    Current Plan
                  </span>
                )}
              </div>
              <p className="text-[13px] text-port-steel mb-1">{formatQuota(pkg.quota)} listings</p>
              <p className="font-mono text-sm font-bold text-customs-amber-dark mb-3">
                {pkg.price}
              </p>
              {!isCurrent && (
                <button
                  onClick={() => handleRequest(pkg)}
                  className="w-full bg-ink-navy text-manifest-cream text-xs font-bold py-2 rounded-lg"
                >
                  Request This Package
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
