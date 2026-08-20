export type EventName =
  | "page_view"
  | "service_selected"
  | "case_study_opened"
  | "start_project_clicked"
  | "linkedin_clicked"
  | "github_clicked"
  | "resume_downloaded"
  | "form_started"
  | "form_step_completed"
  | "form_submitted";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface TrackedEvent {
  name: EventName;
  path: string;
  visitorId: string;
  sessionId: string;
  timestamp: number;
  device: "desktop" | "mobile" | "tablet";
  utm?: UtmParams;
  country?: string; // ISO 3166-1 alpha-2, or "Unknown" — see src/lib/geo.ts
  meta?: Record<string, string | number | boolean | undefined>;
  testMode?: boolean;
}

export interface LeadSubmission {
  id: string;
  timestamp: number;
  need: string;
  details: string;
  timeline: string;
  name: string;
  email: string;
  contact: string;
  utm?: UtmParams;
  country?: string;
  sessionId: string;
}
