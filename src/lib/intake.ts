"use client";

import { track } from "@/lib/analytics";
import { scrollToId } from "@/lib/scroll";

export const PREFILL_EVENT = "intake:prefill";

/**
 * Every "Start a project" button goes through here: it records the click for
 * the dashboard funnel, optionally pre-selects a need in the form, and
 * glides to the form.
 */
export function startProject(need?: string, from?: string) {
  track("start_project_clicked", { ...(need ? { need } : {}), ...(from ? { from } : {}) });
  if (need) window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { need } }));
  scrollToId("start");
}
