import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { rateLimit, getClientKey } from "@/lib/rate-limit";
import { sanitizeString, sanitizeId, sanitizeUtm } from "@/lib/sanitize";
import { getCountryFromRequest } from "@/lib/geo";
import { notifyNewLead } from "@/lib/email";
import type { LeadSubmission } from "@/types/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const key = getClientKey(req);
  if (!rateLimit(`lead:${key}`, 5, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot field — bots fill every input, humans never see this one.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true }); // silently accept, do nothing
  }

  const need = typeof body.need === "string" ? sanitizeString(body.need, 60) : "";
  const details = typeof body.details === "string" ? sanitizeString(body.details, 2000) : "";
  const timeline = typeof body.timeline === "string" ? sanitizeString(body.timeline, 40) : "";
  const name = typeof body.name === "string" ? sanitizeString(body.name, 100) : "";
  const email = typeof body.email === "string" ? sanitizeString(body.email, 200) : "";
  const contact = typeof body.contact === "string" ? sanitizeString(body.contact, 200) : "";
  const sessionId = typeof body.sessionId === "string" ? (sanitizeId(body.sessionId) ?? "") : "";

  if (!need || !details || !name || !email) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const lead: LeadSubmission = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    need,
    details,
    timeline,
    name,
    email,
    contact,
    // First-touch UTM, captured client-side in localStorage and forwarded
    // here as-is — this is what lets a lead be traced back to the LinkedIn
    // post/DM/profile link that originally brought the visitor in.
    utm: sanitizeUtm(body.utm),
    country: getCountryFromRequest(req),
    sessionId,
  };

  // 1. Deliver the inquiry directly via email (Primary delivery)
  const emailResult = await notifyNewLead(lead);

  // 2. Best-effort backup save to local/database store (never blocks submission)
  try {
    await getStore().recordLead(lead);
  } catch (err) {
    console.warn("[lead backup store note]:", err instanceof Error ? err.message : err);
  }

  // 3. Return success if email was sent or in development fallback mode
  if (emailResult.sent) {
    return NextResponse.json({ ok: true });
  }

  // If email was explicitly configured but failed to deliver:
  return NextResponse.json(
    {
      error: "email_error",
      message: emailResult.reason || "Unable to send inquiry email right now. Please try again or reach out directly.",
    },
    { status: 502 }
  );
}
