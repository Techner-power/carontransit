"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browserClient";

export default function PhotoUploadField({ defaultUrl }: { defaultUrl?: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    const supabase = createBrowserSupabase();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("cars").upload(fileName, file);

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from("cars").getPublicUrl(fileName);
    setPreviewUrl(data.publicUrl);
    setIsUploading(false);
  };

  return (
    <div className="sm:col-span-2">
      <label className="block text-[13px] font-semibold text-port-steel mb-1.5">
        Vehicle Photo
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm bg-white w-full"
      />
      {/* This hidden field is what actually submits with the form — the
          visible file input above never touches the server action directly. */}
      <input type="hidden" name="photoUrl" value={previewUrl ?? ""} />

      {isUploading && <p className="text-[12px] text-port-steel mt-2">Uploading...</p>}
      {error && <p className="text-[12px] text-red-600 mt-2">{error}</p>}
      {previewUrl && !isUploading && (
        <div className="mt-2 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-black/[0.1]" />
          <span className="text-[12px] text-verified-teal font-semibold">Photo ready</span>
        </div>
      )}
    </div>
  );
}
