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
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.DISABLE_SUPABASE !== "true"
  );
}

/**
 * Store selection rules:
 *
 * - Supabase credentials present and not disabled → use Supabase.
 * - Otherwise → local /tmp file store. Leads are sent directly via Email,
 *   so analytics storage never blocks visitors or fails the site.
 */
export function getStore(): AnalyticsStore {
  if (store) return store;

  if (hasSupabaseConfig()) {
    store = new SupabaseAnalyticsStore();
    return store;
  }

  store = new FileAnalyticsStore();
  return store;
}

/** Exposed for the /api/analytics/summary route */
export function describeStoreConfig(): { backend: "supabase" | "file" | "unconfigured" } {
  if (hasSupabaseConfig()) return { backend: "supabase" };
  return { backend: "file" };
}
