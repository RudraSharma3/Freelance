import { promises as fs } from "fs";
import path from "path";
import type { TrackedEvent, LeadSubmission } from "@/types/analytics";
import type { AnalyticsStore } from "./types";

/**
 * Default analytics store used out of the box so the site works with zero
 * external services configured.
 *
 * IMPORTANT — this writes to the local filesystem. That's fine for local
 * development and for testing the analytics/tracking flow end to end, but
 * Vercel's serverless filesystem is read-only outside of /tmp and is NOT
 * persistent across deployments or cold starts. For a real production
 * deployment, configure SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in your
 * environment (see .env.example and README.md) so lib/store/index.ts
 * switches to the durable Supabase-backed store instead.
 */

const DATA_DIR =
  process.env.VERCEL === "1" ? "/tmp/rudra-site-data" : path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");
const LEADS_FILE = path.join(DATA_DIR, "leads.jsonl");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function appendLine(file: string, obj: unknown) {
  await ensureDir();
  await fs.appendFile(file, JSON.stringify(obj) + "\n", "utf8");
}

async function readLines<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as T;
        } catch {
          return null;
        }
      })
      .filter((x): x is T => x !== null);
  } catch {
    return [];
  }
}

export class FileAnalyticsStore implements AnalyticsStore {
  async recordEvent(event: TrackedEvent): Promise<void> {
    if (event.testMode) return; // never contaminate the demo data with test events
    await appendLine(EVENTS_FILE, event);
  }

  async recordLead(lead: LeadSubmission): Promise<void> {
    await appendLine(LEADS_FILE, lead);
  }

  async getEvents(range: { from: number; to: number }): Promise<TrackedEvent[]> {
    const all = await readLines<TrackedEvent>(EVENTS_FILE);
    return all.filter((e) => e.timestamp >= range.from && e.timestamp <= range.to);
  }

  async getLeads(range: { from: number; to: number }): Promise<LeadSubmission[]> {
    const all = await readLines<LeadSubmission>(LEADS_FILE);
    return all.filter((l) => l.timestamp >= range.from && l.timestamp <= range.to);
  }

  async getPublicVisitCount(): Promise<number> {
    const all = await readLines<TrackedEvent>(EVENTS_FILE);
    return all.filter((e) => e.name === "page_view").length;
  }
}
