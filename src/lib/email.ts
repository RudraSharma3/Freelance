import { Resend } from "resend";
import nodemailer from "nodemailer";
import type { LeadSubmission } from "@/types/analytics";

/**
 * Direct Email delivery for project inquiries.
 * Supports:
 * 1. Resend (via RESEND_API_KEY)
 * 2. Nodemailer / Gmail SMTP (via EMAIL_USER & EMAIL_PASS / GMAIL_APP_PASSWORD)
 * 3. Safe fallback in development or when unconfigured (logs lead to server output)
 */

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getOwnerEmail(): string {
  return process.env.OWNER_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER || "naganobiea@gmail.com";
}

function getFromEmail(): string {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || process.env.GMAIL_USER;
  if (user) {
    return `"Rudra Sharma" <${user}>`;
  }
  return (
    process.env.RESEND_FROM_EMAIL ||
    "onboarding@resend.dev"
  );
}

// -----------------------------------------------------------------------------
// Provider Clients
// -----------------------------------------------------------------------------
let resendClient: Resend | null | undefined;

function getResendClient(): Resend | null {
  if (resendClient !== undefined) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    resendClient = null;
    return null;
  }
  resendClient = new Resend(apiKey);
  return resendClient;
}

function getNodemailerTransport() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || process.env.GMAIL_USER;
  const rawPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !rawPass) return null;
  const pass = rawPass.replace(/\s+/g, "");

  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT) || 465;
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Default to Gmail service
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY ||
      (process.env.EMAIL_USER && process.env.EMAIL_PASS) ||
      (process.env.SMTP_USER && process.env.SMTP_PASS) ||
      (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
  );
}

// -----------------------------------------------------------------------------
// Send Notification to Owner
// -----------------------------------------------------------------------------
export async function sendOwnerNotificationEmail(lead: LeadSubmission): Promise<{ sent: boolean; error?: string }> {
  const ownerEmail = getOwnerEmail();
  const fromEmail = getFromEmail();

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; padding: 24px; color: #111; line-height: 1.5;">
      <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">New Project Inquiry</h2>
      <p style="color: #666; margin: 0 0 20px 0; font-size: 13px;">Received via freelance site intake form</p>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tbody>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666; width: 110px;">Need:</td><td style="font-weight: 600;">${escapeHtml(lead.need)}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Timeline:</td><td>${escapeHtml(lead.timeline || "—")}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Name:</td><td style="font-weight: 600;">${escapeHtml(lead.name)}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Email:</td><td><a href="mailto:${escapeHtml(lead.email)}" style="color: #0969da;">${escapeHtml(lead.email)}</a></td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Contact:</td><td>${escapeHtml(lead.contact || "—")}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Country:</td><td>${escapeHtml(lead.country || "Unknown")}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Source:</td><td>${escapeHtml(lead.utm?.utm_source ?? "Direct")}${lead.utm?.utm_campaign ? ` / ${escapeHtml(lead.utm.utm_campaign)}` : ""}</td></tr>
        </tbody>
      </table>

      <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px; color: #444;">Project Details:</p>
      <div style="white-space: pre-wrap; background: #f6f8fa; border-left: 4px solid #2da44e; padding: 12px 16px; border-radius: 4px; font-size: 14px;">${escapeHtml(lead.details)}</div>
    </div>
  `;

  // 1. Try Nodemailer / Gmail SMTP if configured
  const transport = getNodemailerTransport();
  if (transport) {
    try {
      await transport.sendMail({
        from: fromEmail,
        to: ownerEmail,
        replyTo: lead.email,
        subject: `New project inquiry — ${lead.need} (${lead.name})`,
        html: htmlContent,
      });
      return { sent: true };
    } catch (err) {
      console.error("[email:smtp] owner notification exception:", err);
      return { sent: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  // 2. Try Resend if configured
  const resend = getResendClient();
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        replyTo: lead.email,
        subject: `New project inquiry — ${lead.need} (${lead.name})`,
        html: htmlContent,
      });
      if (error) {
        console.error("[email:resend] owner notification error:", error);
        return { sent: false, error: error.message };
      }
      return { sent: true };
    } catch (err) {
      console.error("[email:resend] exception:", err);
      return { sent: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  // 3. Fallback: Log to server stdout if no provider configured
  console.log("==================== NEW INQUIRY RECEIVED ====================");
  console.log(`To: ${ownerEmail}`);
  console.log(`From: ${lead.name} <${lead.email}>`);
  console.log(`Need: ${lead.need} | Timeline: ${lead.timeline || "N/A"}`);
  console.log(`Details: ${lead.details}`);
  console.log(`Contact: ${lead.contact || "N/A"} | Country: ${lead.country || "N/A"}`);
  console.log("==============================================================");

  return { sent: true };
}

// -----------------------------------------------------------------------------
// Send Confirmation to Client
// -----------------------------------------------------------------------------
export async function sendClientConfirmationEmail(lead: LeadSubmission): Promise<boolean> {
  const fromEmail = getFromEmail();

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; padding: 20px; line-height: 1.5;">
      <p style="font-size: 15px;">Hi ${escapeHtml(lead.name.split(" ")[0] || lead.name)},</p>
      <p style="font-size: 15px;">Thanks for reaching out! I've received your project inquiry about <strong>${escapeHtml(lead.need)}</strong>.</p>
      <p style="font-size: 15px;">I will review your requirements and follow up with you shortly${lead.timeline ? ` (timeline: ${escapeHtml(lead.timeline)})` : ""}.</p>
      <p style="margin-top: 24px; font-size: 15px; color: #555;">Best regards,<br><strong>Rudra Sharma</strong></p>
    </div>
  `;

  const transport = getNodemailerTransport();
  if (transport) {
    try {
      await transport.sendMail({
        from: fromEmail,
        to: lead.email,
        subject: "Got it — I'll review your project inquiry",
        html: htmlContent,
      });
      return true;
    } catch (err) {
      console.warn("[email:smtp] client confirmation skipped:", err);
      return false;
    }
  }

  const resend = getResendClient();
  if (resend) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: lead.email,
        subject: "Got it — I'll review your project inquiry",
        html: htmlContent,
      });
      return true;
    } catch (err) {
      console.warn("[email:resend] client confirmation skipped:", err);
      return false;
    }
  }

  return true;
}

// -----------------------------------------------------------------------------
// Main Dispatcher
// -----------------------------------------------------------------------------
export async function notifyNewLead(lead: LeadSubmission): Promise<{ configured: boolean; sent: boolean; reason?: string }> {
  const configured = isEmailConfigured();
  const ownerResult = await sendOwnerNotificationEmail(lead);

  // Send client confirmation non-blockingly
  sendClientConfirmationEmail(lead).catch((err) => {
    console.warn("[email] client confirmation non-fatal error:", err);
  });

  return {
    configured,
    sent: ownerResult.sent,
    reason: ownerResult.error,
  };
}
