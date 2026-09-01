"use client";

import { useState, useTransition } from "react";
import { adminSignIn } from "@/lib/adminActions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await adminSignIn(formData);
      if (!result.success) {
        setError(result.message);
      }
    });
  };

  return (
    <div className="max-w-[400px] mx-auto px-6 py-20">
      <h1 className="text-2xl font-extrabold mb-1">Admin Login</h1>
      <p className="text-sm text-port-steel mb-8">Internal access only.</p>

      <form action={handleSubmit} className="space-y-3">
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
          placeholder="Password"
          className="border border-black/[0.15] rounded-lg px-3 py-2.5 text-sm w-full"
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-ink-navy text-manifest-cream font-bold text-sm py-3 rounded-lg disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Log In"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
