import type { AnalyticsStore } from "./types";
import { FileAnalyticsStore } from "./file-store";
import { SupabaseAnalyticsStore } from "./supabase-store";

/**
 * Thrown when the store can't be initialized because required
 * configuration is missing. API routes catch this and surface a clear,
 * actionable error instead of silently falling back to a store that
 * won't actually persist data in production.
 */
export class AnalyticsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalyticsConfigError";
  }
}

let store: AnalyticsStore | null = null;

function hasSupabaseConfig(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Store selection rules:
 *
 * - Supabase credentials present  → always use Supabase (dev or prod).
 *   This lets you point local development at a real Supabase project if
 *   you want to test against production-like data.
 * - No Supabase credentials, NODE_ENV !== "production" → local JSON-file
 *   store. Fine for local dev; never durable enough for real traffic.
 * - No Supabase credentials, NODE_ENV === "production" → throw. A
 *   production deployment must not silently start writing analytics to
 *   a filesystem that Vercel resets on every cold start/deploy — that
 *   would quietly lose every visit and lead. Fail loud instead.
 */
export function getStore(): AnalyticsStore {
  if (store) return store;

  if (hasSupabaseConfig()) {
    store = new SupabaseAnalyticsStore();
    return store;
  }

  if (process.env.NODE_ENV === "production") {
    throw new AnalyticsConfigError(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production. " +
        "Without them, page views and leads would be written to a non-persistent " +
        "filesystem and lost on the next deploy or cold start. " +
        "See README.md → 'Supabase setup' to configure them."
    );
  }

  store = new FileAnalyticsStore();
  return store;
}

/** Exposed for the /api/analytics/summary route so it can tell the owner
 *  exactly which store is active without instantiating one. */
export function describeStoreConfig(): { backend: "supabase" | "file" | "unconfigured" } {
  if (hasSupabaseConfig()) return { backend: "supabase" };
  if (process.env.NODE_ENV === "production") return { backend: "unconfigured" };
  return { backend: "file" };
}
