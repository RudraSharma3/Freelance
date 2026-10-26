import { Resend } from "resend";
import type { LeadSubmission } from "@/types/analytics";

/**
 * Email notifications for a new project inquiry.
 *
 * Design constraints (deliberate):
 *   - Supabase is the source of truth for a lead. By the time these
 *     functions are called, the lead has ALREADY been saved successfully.
 *     Nothing in here can undo that, and nothing in here throws — a
 *     failure here is logged server-side and swallowed, never surfaced
 *     to the visitor as a failed submission.
 *   - RESEND_API_KEY / OWNER_EMAIL / RESEND_FROM_EMAIL are read from
 *     server-only environment variables. They are never imported into
 *     any "use client" file and never appear in a NextResponse body.
 *   - If email isn't configured at all (e.g. local dev without a Resend
 *     account), these functions no-op with a single clear server log
 *     instead of throwing on every lead submission.
 */

let client: Resend | null | undefined; // undefined = not yet checked, null = not configured

function getClient(): Resend | null {
  if (client !== undefined) return client;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipping email notifications. " +
        "Leads are still saved to Supabase; only the email step is skipped. " +
        "See README.md → 'Email notifications' to configure it."
    );
    client = null;
    return client;
  }

  client = new Resend(apiKey);
  return client;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Sends Rudra a notification email for a new project inquiry. Never throws. */
export async function sendOwnerNotificationEmail(lead: LeadSubmission): Promise<boolean> {
  const resend = getClient();
  const ownerEmail = process.env.OWNER_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resend || !ownerEmail || !fromEmail) {
    if (resend && (!ownerEmail || !fromEmail)) {
      console.warn("[email] OWNER_EMAIL or RESEND_FROM_EMAIL is not set — skipping owner notification.");
    }
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      replyTo: lead.email,
      subject: `New project inquiry — ${lead.need}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px;">
          <h2 style="margin-bottom: 4px;">New project inquiry</h2>
          <p style="color: #666; margin-top: 0;">via the freelance site intake form</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #666; width: 100px;">Need</td><td>${escapeHtml(lead.need)}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Timeline</td><td>${escapeHtml(lead.timeline || "—")}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Name</td><td>${escapeHtml(lead.name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Email</td><td>${escapeHtml(lead.email)}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Contact</td><td>${escapeHtml(lead.contact || "—")}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Source</td><td>${escapeHtml(lead.utm?.utm_source ?? "Direct")}${lead.utm?.utm_campaign ? ` / ${escapeHtml(lead.utm.utm_campaign)}` : ""}</td></tr>
          </table>
          <p style="margin-top: 16px; color: #666;">Details</p>
          <p style="white-space: pre-wrap; border-left: 3px solid #eee; padding-left: 12px;">${escapeHtml(lead.details)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[email] owner notification failed", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] owner notification threw", err);
    return false;
  }
}

/** Sends the visitor a short confirmation that their inquiry was received. Never throws. */
export async function sendClientConfirmationEmail(lead: LeadSubmission): Promise<boolean> {
  const resend = getClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resend || !fromEmail) return false;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: lead.email,
      subject: "Got it — I'll take a look",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px;">
          <p>Hi ${escapeHtml(lead.name.split(" ")[0] || lead.name)},</p>
          <p>Thanks for reaching out — I've received your project inquiry about
             <strong>${escapeHtml(lead.need)}</strong> and I'll take a look and get back to you,
             usually within a day or two depending on the timeline you gave.</p>
          <p>— Rudra</p>
        </div>
      `,
    });

    if (error) {
      console.error("[email] client confirmation failed", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] client confirmation threw", err);
    return false;
  }
}

/**
 * Fires both notification emails in parallel. Always resolves — never
 * rejects — so callers can await it without a try/catch and without any
 * risk of it turning a successful lead save into a failed request.
 */
export async function notifyNewLead(lead: LeadSubmission): Promise<void> {
  const [ownerResult, clientResult] = await Promise.allSettled([
    sendOwnerNotificationEmail(lead),
    sendClientConfirmationEmail(lead),
  ]);

  if (ownerResult.status === "rejected") {
    console.error("[email] owner notification promise rejected", ownerResult.reason);
  }
  if (clientResult.status === "rejected") {
    console.error("[email] client confirmation promise rejected", clientResult.reason);
  }
}
