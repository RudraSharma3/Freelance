"use client";

import { track } from "@/lib/analytics";

export const PREFILL_EVENT = "intake:prefill";

/**
 * Every "Start a project" button goes through here: it records the click for
 * the dashboard funnel, optionally pre-selects a need in the form, and
 * scrolls to the form.
 */
export function startProject(need?: string, from?: string) {
  track("start_project_clicked", { ...(need ? { need } : {}), ...(from ? { from } : {}) });
  if (need) window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { need } }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("start")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
