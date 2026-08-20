/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Good enough for a single-instance/serverless-per-region deployment of a
 * personal site. If traffic grows enough to need a shared limiter across
 * instances, swap this for an Upstash/Redis-backed one — the call sites
 * (api/track, api/lead) don't need to change.
 */

const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length <= limit;
}

export function getClientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() ?? "unknown";
}
