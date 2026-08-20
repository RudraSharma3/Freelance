/**
 * Country-level geo, sourced from Vercel's edge network headers
 * (`x-vercel-ip-country`) rather than any client-supplied value or IP
 * geolocation lookup we'd have to run ourselves. This is aggregated,
 * country-only, and only populated when the app is actually deployed on
 * Vercel — locally it's always "Unknown".
 *
 * We deliberately do NOT read city/region/lat-long headers Vercel also
 * exposes — country is enough for "where is my LinkedIn traffic coming
 * from" without getting close to precise-location tracking.
 */
export function getCountryFromRequest(req: Request): string {
  const country = req.headers.get("x-vercel-ip-country");
  return country && /^[A-Z]{2}$/.test(country) ? country : "Unknown";
}
