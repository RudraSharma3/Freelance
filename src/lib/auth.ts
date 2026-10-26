import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Lightweight, server-only session for the single-owner admin dashboard.
 *
 * There's no user table and no login "session store" — the cookie value
 * is a SHA-256 hash of ADMIN_DASHBOARD_PASSWORD, set only after the
 * correct password is supplied to /api/admin/login (server-side check;
 * the password itself is never sent back to the client, and never
 * readable from client-side JS since the cookie is httpOnly).
 *
 * This is intentionally simple for a one-owner dashboard. Rotating
 * ADMIN_DASHBOARD_PASSWORD invalidates every existing session immediately
 * (the stored cookie hash stops matching). Sessions also expire after 8
 * hours regardless.
 */

const COOKIE_NAME = "rudra_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function hash(input: string): Buffer {
  return crypto.createHash("sha256").update(input, "utf8").digest();
}

/** Constant-time comparison over fixed-length (32-byte) SHA-256 digests —
 *  avoids leaking input length or content via comparison timing. */
function constantTimeEqual(a: string, b: string): boolean {
  return crypto.timingSafeEqual(hash(a), hash(b));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!expected) return false;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return constantTimeEqual(token, hash(expected).toString("hex"));
}

export async function setAdminSession() {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD ?? "";
  const store = await cookies();
  store.set(COOKIE_NAME, hash(expected).toString("hex"), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Verifies a login attempt server-side. Never called from the client. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!expected) return false;
  return constantTimeEqual(input, expected);
}
