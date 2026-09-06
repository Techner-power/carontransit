"use client";

import { useEffect, useState, useTransition } from "react";
import { getDealers, approveDealer, getSignedDocumentUrl, ActionResult } from "@/lib/adminActions";
import { Dealership } from "@/lib/types";

export default function AdminDealerList() {
  const [dealers, setDealers] = useState<Dealership[]>([]);
  const [results, setResults] = useState<Record<string, ActionResult>>({});
  const [isPending, startTransition] = useTransition();

  const refresh = () => {
    getDealers().then(setDealers);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleApprove = (dealerId: string) => {
    startTransition(async () => {
      const result = await approveDealer(dealerId);
      setResults((prev) => ({ ...prev, [dealerId]: result }));
      if (result.success) refresh();
    });
  };

  const handleViewDocument = (dealerId: string, path: string | undefined) => {
    if (!path) {
      setResults((prev) => ({
        ...prev,
        [dealerId]: { success: false, message: "No document on file." },
      }));
      return;
    }
    startTransition(async () => {
      const url = await getSignedDocumentUrl(path);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        setResults((prev) => ({
          ...prev,
          [dealerId]: { success: false, message: "Could not open document." },
        }));
      }
    });
  };

  if (dealers.length === 0) {
    return <p className="text-sm text-port-steel">No dealer accounts yet.</p>;
  }

  return (
    <div className="space-y-3">
      {dealers.map((d) => (
        <div key={d.id} className="bg-white border border-black/[0.12] rounded-xl p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm">{d.business_name}</p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    d.is_approved
                      ? "bg-verified-teal/[0.15] text-verified-teal"
                      : "bg-customs-amber/[0.15] text-customs-amber-dark"
                  }`}
                >
                  {d.is_approved ? "Approved" : "Pending Approval"}
                </span>
              </div>
              <p className="text-[12px] text-port-steel">
                {d.physical_location} · KRA {d.kra_pin} · {d.whatsapp_contact}
              </p>
              {d.email && <p className="text-[12px] text-port-steel">{d.email}</p>}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewDocument(d.id, d.legal_document_path ?? undefined)}
                disabled={isPending}
                className="bg-manifest-cream-2 text-ink-navy text-xs font-bold px-3 py-2 rounded-lg border border-black/[0.1] disabled:opacity-50"
              >
                View Document
              </button>
              {!d.is_approved && (
                <button
                  onClick={() => handleApprove(d.id)}
                  disabled={isPending}
                  className="bg-verified-teal text-white text-xs font-bold px-3 py-2 rounded-lg disabled:opacity-50"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
          {results[d.id] && (
            <p
              className={`mt-2 text-[12px] ${
                results[d.id].success ? "text-verified-teal" : "text-red-600"
              }`}
            >
              {results[d.id].message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
