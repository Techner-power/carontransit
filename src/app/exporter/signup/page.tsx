"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { exporterSignUp } from "@/lib/exporterActions";

export default function ExporterSignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await exporterSignUp(formData);
      if (!result.success) {
        setError(result.message);
      }
    });
  };

  return (
    <div className="max-w-[480px] mx-auto px-6 py-16">
      <h1 className="text-2xl font-extrabold mb-1">Create your exporter account</h1>
      <p className="text-sm text-port-steel mb-8">
        List vehicles for Kenyan buyers to import through one of our verified local agents. New
        accounts start with 2 free listings.
      </p>

      <form action={handleSubmit} className="space-y-3">
        <input
          name="companyName"
          required
          placeholder="Company name"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <input
          name="country"
          required
          placeholder="Country (e.g. Japan)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <input
          name="whatsapp"
          required
          placeholder="WhatsApp number (with country code)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password (min 8 characters)"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-customs-amber text-ink-navy font-bold text-sm py-3 rounded-lg disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <p className="text-sm text-port-steel mt-6">
        Already have an account?{" "}
        <Link href="/exporter/login" className="font-semibold text-ink-navy underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
