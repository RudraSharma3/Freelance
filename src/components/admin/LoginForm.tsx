"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === "not_configured"
            ? "ADMIN_DASHBOARD_PASSWORD isn't set in the server environment yet."
            : "Wrong password."
        );
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-bg-elevated p-8"
      >
        <div className="mb-6 flex items-center gap-2 text-text-secondary">
          <Lock size={16} />
          <span className="eyebrow">Owner-only</span>
        </div>
        <h1 className="font-display text-xl font-medium">Analytics dashboard</h1>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm placeholder:text-text-tertiary focus:border-accent"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-full bg-accent py-2.5 text-sm font-medium text-[#161006] disabled:opacity-30"
        >
          {loading ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
