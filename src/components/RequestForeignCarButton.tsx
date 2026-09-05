"use client";

import { useState, useTransition } from "react";
import { requestForeignListing } from "@/lib/claimActions";

export default function RequestForeignCarButton({
  listingId,
  whatsappLink,
  initialIsClaimed,
}: {
  listingId: string;
  whatsappLink: string;
  initialIsClaimed: boolean;
}) {
  const [isClaimed, setIsClaimed] = useState(initialIsClaimed);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await requestForeignListing(listingId);
      setMessage(result.message);
      if (result.alreadyClaimed) {
        setIsClaimed(true);
        return;
      }
      if (result.success) {
        window.open(whatsappLink, "_blank", "noopener,noreferrer");
      }
    });
  };

  if (isClaimed) {
    return (
      <div className="w-full bg-manifest-cream-2 text-port-steel font-bold text-sm py-4 rounded-xl border border-black/[0.1] flex items-center justify-center gap-2">
        Already Requested by Another Buyer
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="w-full bg-[#25D366] hover:bg-[#1ebd55] text-white font-bold text-sm py-4 rounded-xl shadow flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isPending ? "Processing..." : "Request This Car & Get an Agent"}
      </button>
      {message && !isClaimed && (
        <p className="text-[12px] text-verified-teal mt-2 text-center">{message}</p>
      )}
    </>
  );
}
