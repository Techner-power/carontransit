"use client";

import { logWhatsAppClick } from "@/lib/leadTracking";

export default function WhatsAppButton({
  href,
  vehicleId,
  dealerId,
  label,
  className,
}: {
  href: string;
  vehicleId: string;
  dealerId: string;
  label: string;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        // Fire-and-forget — doesn't block or delay the link opening.
        logWhatsAppClick(vehicleId, dealerId);
      }}
    >
      {label}
    </a>
  );
}
