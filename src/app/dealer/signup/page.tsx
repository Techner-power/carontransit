"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { dealerSignUp } from "@/lib/dealerActions";

export default function DealerSignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await dealerSignUp(formData);
      if (!result.success) {
        setError(result.message);
      }
    });
  };

  return (
    <div className="max-w-[480px] mx-auto px-6 py-16">
      <h1 className="text-2xl font-extrabold mb-1">Create your dealer account</h1>
      <p className="text-sm text-port-steel mb-8">
        List your own units in transit. New listings go into review before appearing publicly.
      </p>

      <form action={handleSubmit} className="space-y-3">
        <input
          name="businessName"
          required
          placeholder="Business name"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <input
          name="location"
          required
          placeholder="Yard location"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <input
          name="kraPin"
          required
          placeholder="KRA PIN"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <input
          name="whatsapp"
          required
          placeholder="WhatsApp: 254712345678"
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
        <Link href="/dealer/login" className="font-semibold text-ink-navy underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
