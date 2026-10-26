"use client";

import type { EventName, TrackedEvent } from "@/types/analytics";
import { captureUtm, getSessionId, getVisitorId } from "@/lib/utm";

function detectDevice(): TrackedEvent["device"] {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/** Set on window by the AnalyticsTestModeToggle in dev. Never true in production builds unless explicitly enabled. */
function isTestMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("rudra_analytics_test_mode") === "1";
}

/**
 * Fire a typed analytics event. This is the ONLY place that should ever
 * call the /api/track endpoint — keep every tracking call flowing through
 * here instead of scattering fetch() calls through components.
 */
export function track(name: EventName, meta?: TrackedEvent["meta"]) {
  if (typeof window === "undefined") return;

  const payload: TrackedEvent = {
    name,
    path: window.location.pathname,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    timestamp: Date.now(),
    device: detectDevice(),
    utm: captureUtm(),
    meta,
    testMode: isTestMode(),
  };

  const body = JSON.stringify(payload);

  // sendBeacon avoids blocking navigation (e.g. on outbound link clicks)
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
  } else {
    fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }

  if (isTestMode()) {
    console.info("[analytics:test-mode]", name, payload);
  }
}

export function setTestMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("rudra_analytics_test_mode", enabled ? "1" : "0");
}

export function getTestMode(): boolean {
  return isTestMode();
}
