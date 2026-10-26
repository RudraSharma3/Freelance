import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { TrackedEvent, LeadSubmission } from "@/types/analytics";
import type { AnalyticsStore } from "./types";

/**
 * Durable analytics store. Used automatically when SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set (see .env.example). Requires two
 * tables — the SQL to create them is in README.md under "Database setup".
 *
 * The service role key is only ever used server-side (inside API routes),
 * never sent to the browser.
 */
export class SupabaseAnalyticsStore implements AnalyticsStore {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      { auth: { persistSession: false } }
    );
  }

  async recordEvent(event: TrackedEvent): Promise<void> {
    if (event.testMode) return;
    const { error } = await this.client.from("events").insert({
      name: event.name,
      path: event.path,
      visitor_id: event.visitorId,
      session_id: event.sessionId,
      ts: new Date(event.timestamp).toISOString(),
      device: event.device,
      utm: event.utm ?? null,
      country: event.country ?? null,
      meta: event.meta ?? null,
    });
    if (error) throw new Error(error.message);
  }

  async recordLead(lead: LeadSubmission): Promise<void> {
    const { error } = await this.client.from("leads").insert({
      id: lead.id,
      ts: new Date(lead.timestamp).toISOString(),
      need: lead.need,
      details: lead.details,
      timeline: lead.timeline,
      name: lead.name,
      email: lead.email,
      contact: lead.contact,
      utm: lead.utm ?? null,
      country: lead.country ?? null,
      session_id: lead.sessionId,
    });
    if (error) throw new Error(error.message);
  }

  async getEvents(range: { from: number; to: number }): Promise<TrackedEvent[]> {
    const { data, error } = await this.client
      .from("events")
      .select("*")
      .gte("ts", new Date(range.from).toISOString())
      .lte("ts", new Date(range.to).toISOString());
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      name: row.name,
      path: row.path,
      visitorId: row.visitor_id,
      sessionId: row.session_id,
      timestamp: new Date(row.ts).getTime(),
      device: row.device,
      utm: row.utm ?? undefined,
      country: row.country ?? undefined,
      meta: row.meta ?? undefined,
    }));
  }

  async getLeads(range: { from: number; to: number }): Promise<LeadSubmission[]> {
    const { data, error } = await this.client
      .from("leads")
      .select("*")
      .gte("ts", new Date(range.from).toISOString())
      .lte("ts", new Date(range.to).toISOString());
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      id: row.id,
      timestamp: new Date(row.ts).getTime(),
      need: row.need,
      details: row.details,
      timeline: row.timeline,
      name: row.name,
      email: row.email,
      contact: row.contact,
      utm: row.utm ?? undefined,
      country: row.country ?? undefined,
      sessionId: row.session_id,
    }));
  }

  async getPublicVisitCount(): Promise<number> {
    const { count, error } = await this.client
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("name", "page_view");
    if (error) throw new Error(error.message);
    return count ?? 0;
  }
}
