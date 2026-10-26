import { NextResponse } from "next/server";
import { getStore, AnalyticsConfigError } from "@/lib/store";
import { rateLimit, getClientKey } from "@/lib/rate-limit";
import { sanitizeId, sanitizeUtm, sanitizeMeta } from "@/lib/sanitize";
import { getCountryFromRequest } from "@/lib/geo";
import type { TrackedEvent, EventName } from "@/types/analytics";

const VALID_EVENTS: EventName[] = [
  "page_view",
  "service_selected",
  "case_study_opened",
  "start_project_clicked",
  "linkedin_clicked",
  "github_clicked",
  "resume_downloaded",
  "form_started",
  "form_step_completed",
  "form_submitted",
];

const VALID_DEVICES = new Set(["desktop", "mobile", "tablet"]);

export async function POST(req: Request) {
  const key = getClientKey(req);
  if (!rateLimit(`track:${key}`, 60, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Every field below is validated/whitelisted individually — the request
  // body is never spread directly into the event we store, so a client
  // can't smuggle arbitrary extra fields into the database record.
  const name = body.name;
  if (typeof name !== "string" || !VALID_EVENTS.includes(name as EventName)) {
    return NextResponse.json({ error: "invalid_event_name" }, { status: 400 });
  }

  const rawPath = body.path;
  if (typeof rawPath !== "string" || rawPath.length === 0 || rawPath.length > 300 || rawPath[0] !== "/") {
    return NextResponse.json({ error: "invalid_path" }, { status: 400 });
  }

  const visitorId = typeof body.visitorId === "string" ? sanitizeId(body.visitorId) : null;
  const sessionId = typeof body.sessionId === "string" ? sanitizeId(body.sessionId) : null;
  if (!visitorId || !sessionId) {
    return NextResponse.json({ error: "invalid_ids" }, { status: 400 });
  }

  const device = typeof body.device === "string" && VALID_DEVICES.has(body.device)
    ? (body.device as TrackedEvent["device"])
    : "desktop";

  const event: TrackedEvent = {
    name: name as EventName,
    path: rawPath.slice(0, 300),
    visitorId,
    sessionId,
    timestamp: Date.now(),
    device,
    utm: sanitizeUtm(body.utm),
    country: getCountryFromRequest(req),
    meta: sanitizeMeta(body.meta),
    testMode: body.testMode === true,
  };

  try {
    await getStore().recordEvent(event);
  } catch (err) {
    if (err instanceof AnalyticsConfigError) {
      console.error("[analytics config error]", err.message);
      // Public-facing: don't leak infra details, don't 500 the visitor's page.
      return NextResponse.json({ ok: false }, { status: 202 });
    }
    console.error("track error", err);
    return NextResponse.json({ error: "store_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
