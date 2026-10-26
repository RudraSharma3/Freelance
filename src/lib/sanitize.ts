import type { UtmParams } from "@/types/analytics";

const UTM_KEYS: (keyof UtmParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** Strips tags/control characters, trims, and hard-caps length. */
export function sanitizeString(input: string, maxLen: number): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLen);
}

/** Restricts to an id-safe charset (covers crypto.randomUUID and the Math.random fallback). */
export function sanitizeId(input: string, maxLen = 100): string | null {
  const trimmed = input.slice(0, maxLen);
  return /^[a-zA-Z0-9_-]{1,100}$/.test(trimmed) ? trimmed : null;
}

/** Only known utm_* keys survive, each capped and stripped. Unknown keys are dropped, not stored. */
export function sanitizeUtm(raw: unknown): UtmParams | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const input = raw as Record<string, unknown>;
  const out: UtmParams = {};
  let hasAny = false;
  for (const key of UTM_KEYS) {
    const value = input[key];
    if (typeof value === "string" && value.length > 0) {
      out[key] = sanitizeString(value, 120);
      hasAny = true;
    }
  }
  return hasAny ? out : undefined;
}

/**
 * `meta` is arbitrary-ish event context (e.g. { service: "resume" }), but it
 * still goes into a database column, so it's whitelisted by shape rather
 * than trusted as-is: only a small, flat, string/number/boolean bag with
 * safe key names. This is what keeps a client-supplied payload from being
 * able to smuggle unexpected structure into storage.
 */
export function sanitizeMeta(
  raw: unknown
): Record<string, string | number | boolean> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const input = raw as Record<string, unknown>;
  const out: Record<string, string | number | boolean> = {};
  let count = 0;

  for (const [key, value] of Object.entries(input)) {
    if (count >= 10) break;
    if (!/^[a-zA-Z0-9_]{1,40}$/.test(key)) continue;
    if (DANGEROUS_KEYS.has(key)) continue;

    if (typeof value === "string") {
      out[key] = sanitizeString(value, 200);
      count++;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      out[key] = value;
      count++;
    } else if (typeof value === "boolean") {
      out[key] = value;
      count++;
    }
    // objects, arrays, functions, undefined, null are silently dropped
  }

  return count > 0 ? out : undefined;
}
