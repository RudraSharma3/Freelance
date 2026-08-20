import type { TrackedEvent, LeadSubmission } from "@/types/analytics";

export interface AnalyticsStore {
  recordEvent(event: TrackedEvent): Promise<void>;
  recordLead(lead: LeadSubmission): Promise<void>;
  getEvents(range: { from: number; to: number }): Promise<TrackedEvent[]>;
  getLeads(range: { from: number; to: number }): Promise<LeadSubmission[]>;
  getPublicVisitCount(): Promise<number>;
}
