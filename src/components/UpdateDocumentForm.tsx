"use client";

import { useState, useTransition } from "react";
import DocumentUploadField from "./DocumentUploadField";

interface ActionResult {
  success: boolean;
  message: string;
}

export default function UpdateDocumentForm({
  hasDocument,
  updateAction,
}: {
  hasDocument: boolean;
  updateAction: (formData: FormData) => Promise<ActionResult>;
}) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateAction(formData);
      setResult(res);
    });
  };

  return (
    <div className="bg-white border border-black/[0.12] rounded-xl p-6 mb-8">
      <h2 className="text-sm font-bold mb-2">Legal Document</h2>
      <p className="text-[13px] text-port-steel mb-4">
        {hasDocument
          ? "You have a document on file. Upload a new one below to replace it — for example, if your certificate has been renewed."
          : "No document on file yet. Please upload one."}
      </p>
      <form action={handleSubmit}>
        <DocumentUploadField label="Upload New Document" />
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 bg-customs-amber text-ink-navy font-bold text-sm px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Document"}
        </button>
      </form>
      {result && (
        <p className={`mt-3 text-sm ${result.success ? "text-verified-teal" : "text-red-600"}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}
