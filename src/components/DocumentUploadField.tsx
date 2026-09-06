"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browserClient";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB — matches the bucket's server-side limit
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export default function DocumentUploadField({ label }: { label: string }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Checked here for a fast, clear error message — but the real
    // enforcement is server-side on the bucket itself, so this can't be
    // bypassed by editing the page or calling the upload API directly.
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, WEBP, or PDF file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("File is too large — please keep it under 10MB.");
      return;
    }

    setIsUploading(true);

    const supabase = createBrowserSupabase();
    const fileExt = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }

    setFileName(file.name);
    setFilePath(path);
    setIsUploading(false);
  };

  return (
    <div className="sm:col-span-2">
      <label className="block text-[13px] font-semibold text-port-steel mb-1.5">{label}</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,.pdf"
        onChange={handleFileChange}
        className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white w-full"
      />
      {/* This is what actually submits with the form — a private storage
          path, never a public URL, since this bucket has no public read
          access. */}
      <input type="hidden" name="legalDocumentPath" value={filePath ?? ""} />

      {isUploading && <p className="text-[12px] text-port-steel mt-2">Uploading...</p>}
      {error && <p className="text-[12px] text-red-600 mt-2">{error}</p>}
      {fileName && !isUploading && (
        <p className="text-[12px] text-verified-teal font-semibold mt-2">Uploaded: {fileName}</p>
      )}
    </div>
  );
}
