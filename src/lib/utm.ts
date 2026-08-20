import type { UtmParams } from "@/types/analytics";

const STORAGE_KEY = "rudra_utm_attribution";
const VISITOR_KEY = "rudra_visitor_id";
const SESSION_KEY = "rudra_session_id";

const UTM_KEYS: (keyof UtmParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

/** Captures UTM params from the URL on first touch and persists them across the visit (localStorage = first-touch attribution). */
export function captureUtm(): UtmParams | undefined {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {};
  let found = false;
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      fromUrl[key] = value;
      found = true;
    }
  }

  const existing = window.localStorage.getItem(STORAGE_KEY);

  if (found) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  if (existing) {
    try {
      return JSON.parse(existing) as UtmParams;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function randomId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

/** Stable per-browser id, persisted in localStorage (no PII, no fingerprinting). */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = randomId();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/** Per-tab-session id, persisted in sessionStorage. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = randomId();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
