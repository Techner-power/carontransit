"use client";

import { useEffect, useState, useTransition } from "react";
import { getExporters, updateExporterQuota, approveExporter, getSignedDocumentUrl, ActionResult } from "@/lib/adminActions";
import { Exporter } from "@/lib/types";

export default function AdminExporterList() {
  const [exporters, setExporters] = useState<Exporter[]>([]);
  const [quotaInputs, setQuotaInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, ActionResult>>({});
  const [isPending, startTransition] = useTransition();

  const refresh = () => {
    getExporters().then((data) => {
      setExporters(data);
      const initial: Record<string, string> = {};
      data.forEach((e) => {
        initial[e.id] = String(e.listing_quota);
      });
      setQuotaInputs(initial);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleApprove = (exporterId: string) => {
    startTransition(async () => {
      const result = await approveExporter(exporterId);
      setResults((prev) => ({ ...prev, [exporterId]: result }));
      if (result.success) refresh();
    });
  };

  const handleUpdate = (exporterId: string) => {
    const formData = new FormData();
    formData.set("exporterId", exporterId);
    formData.set("quota", quotaInputs[exporterId] ?? "2");

    startTransition(async () => {
      const result = await updateExporterQuota(formData);
      setResults((prev) => ({ ...prev, [exporterId]: result }));
      if (result.success) refresh();
    });
  };

  const handleViewDocument = (exporterId: string, path: string | undefined) => {
    if (!path) {
      setResults((prev) => ({
        ...prev,
        [exporterId]: { success: false, message: "No document on file." },
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
          [exporterId]: { success: false, message: "Could not open document." },
        }));
      }
    });
  };

  if (exporters.length === 0) {
    return <p className="text-sm text-port-steel">No exporter accounts yet.</p>;
  }

  return (
    <div className="space-y-3">
      {exporters.map((e) => (
        <div key={e.id} className="bg-white border border-black/[0.12] rounded-xl p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm">{e.company_name}</p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    e.is_approved
                      ? "bg-verified-teal/[0.15] text-verified-teal"
                      : "bg-customs-amber/[0.15] text-customs-amber-dark"
                  }`}
                >
                  {e.is_approved ? "Approved" : "Pending Approval"}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    e.legal_document_path
                      ? "bg-verified-teal/[0.15] text-verified-teal"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {e.legal_document_path ? "Document ✓" : "No Document ⚠"}
                </span>
              </div>
              <p className="text-[12px] text-port-steel">
                {e.country} · {e.contact_whatsapp}
              </p>
              {e.email && <p className="text-[12px] text-port-steel">{e.email}</p>}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewDocument(e.id, e.legal_document_path ?? undefined)}
                disabled={isPending}
                className="bg-manifest-cream-2 text-ink-navy text-xs font-bold px-3 py-2 rounded-lg border border-black/[0.1] disabled:opacity-50"
              >
                View Document
              </button>
              {!e.is_approved ? (
                <button
                  onClick={() => handleApprove(e.id)}
                  disabled={isPending}
                  className="bg-verified-teal text-white text-xs font-bold px-3 py-2 rounded-lg disabled:opacity-50"
                >
                  Approve
                </button>
              ) : (
                <>
                  <label className="text-[12px] text-port-steel">Quota:</label>
                  <input
                    type="number"
                    value={quotaInputs[e.id] ?? ""}
                    onChange={(ev) =>
                      setQuotaInputs((prev) => ({ ...prev, [e.id]: ev.target.value }))
                    }
                    className="border border-black/[0.15] rounded-lg px-2 py-1.5 text-sm w-20"
                  />
                  <button
                    onClick={() => handleUpdate(e.id)}
                    disabled={isPending}
                    className="bg-customs-amber text-ink-navy text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50"
                  >
                    Update
                  </button>
                </>
              )}
            </div>
          </div>
          {results[e.id] && (
            <p
              className={`mt-2 text-[12px] ${
                results[e.id].success ? "text-verified-teal" : "text-red-600"
              }`}
            >
              {results[e.id].message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
