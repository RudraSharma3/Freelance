# Rudra Sharma — Freelance Site

A personal freelance/consultancy site for Rudra Sharma (AI, data & automation), built with
Next.js (App Router), TypeScript and Tailwind CSS. Includes a real, self-hosted analytics
pipeline — event tracking, first-touch UTM/LinkedIn attribution, a public visit counter, and a
password-protected `/admin/analytics` dashboard — backed by Supabase in production.

## What's real vs. placeholder

Every stat, skill, project and result on this site is pulled directly from Rudra's resume —
see `src/data/*.ts`. Nothing is invented. Two things are intentionally left as placeholders:

- Named client testimonials / before-after examples (Proof section) —
  `[PLACEHOLDER — ADD REAL INFORMATION]`
- The production domain (`NEXT_PUBLIC_SITE_URL`)

---

## 1. Local development

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and set at minimum `ADMIN_DASHBOARD_PASSWORD`. Leave `SUPABASE_URL` /
`SUPABASE_SERVICE_ROLE_KEY` blank for now — in development the app automatically falls back to
a local JSON-file store (`.data/` in the project root, gitignored).

```bash
npm run dev
```

Visit `http://localhost:3000`. The admin dashboard is at `http://localhost:3000/admin/analytics`.

> **Note:** running a real production build locally (`npm run build && npm start`) puts
> `NODE_ENV=production`, which means the Supabase-required check applies even on your machine.
> Either set the Supabase env vars first, or just use `npm run dev` for local testing.

---

## 2. Supabase setup (required for production)

**Production deployments require Supabase.** If `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
are missing when `NODE_ENV=production`, the app does **not** silently fall back to writing
analytics to the filesystem (Vercel's production filesystem is reset on every deploy/cold
start, which would quietly lose every visit and lead). Instead:

- `/api/track` degrades safely for the visitor (still returns success-ish, logs the
  misconfiguration server-side, doesn't break the page)
- `/api/lead` **fails loudly** (500 + clear error) — a project inquiry disappearing silently is
  worse than a visible error
- `/admin/analytics` shows an explicit "not configured" message instead of empty/fake charts

To configure it:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run:

```sql
create table events (
  id bigint generated always as identity primary key,
  name text not null,
  path text not null,
  visitor_id text not null,
  session_id text not null,
  ts timestamptz not null default now(),
  device text not null,
  utm jsonb,
  country text,
  meta jsonb
);
create index events_name_ts_idx on events (name, ts);
create index events_visitor_idx on events (visitor_id);

create table leads (
  id uuid primary key,
  ts timestamptz not null default now(),
  need text not null,
  details text not null,
  timeline text,
  name text not null,
  email text not null,
  contact text,
  utm jsonb,
  country text,
  session_id text
);

alter table events enable row level security;
alter table leads enable row level security;
-- No public policies are created on purpose. The app talks to Supabase
-- using the service_role key from server-only API routes, which bypasses
-- RLS. Nothing reaches these tables from the browser directly.
```

3. Go to Settings → API and copy:
   - **Project URL** → `SUPABASE_URL`
   - **`service_role` secret key** (not the `anon`/public key) → `SUPABASE_SERVICE_ROLE_KEY`
4. Add both to your environment (`.env.local` for local testing against real Supabase data, or
   your Vercel project settings for production).

### Already have a database from an earlier version of this project?

If you set up Supabase before the `country` column was added to the code, run
[`supabase/migrations/0002_add_country_column.sql`](./supabase/migrations/0002_add_country_column.sql)
in the SQL editor instead of the `create table` SQL above. It's purely additive
(`ADD COLUMN IF NOT EXISTS`) — it does not drop or touch any existing rows, and it's safe to
run more than once. This fixes the exact errors you'd see otherwise:

```
Could not find the 'country' column of 'events' in the schema cache
Could not find the 'country' column of 'leads' in the schema cache
```

...and, once PostgREST's schema cache picks up the change (the migration ends with
`notify pgrst, 'reload schema'` to force this immediately), the public visit counter and
`POST /api/track` / `POST /api/lead` 500s from the same cause resolve too.

If it still doesn't take effect immediately, go to Supabase Dashboard → Database → and click
**Reload schema** (same effect as the `NOTIFY`, as a UI fallback).

The store is selected automatically (`src/lib/store/index.ts`) — no code changes needed:

| Supabase creds present? | `NODE_ENV` | Store used |
|---|---|---|
| Yes | any | Supabase |
| No | `development` | Local file store (`.data/`) |
| No | `production` | **Throws a clear config error** |

---

## 3. Required environment variables

| Variable | Required when | Purpose |
|---|---|---|
| `ADMIN_DASHBOARD_PASSWORD` | Always, to use `/admin/analytics` | Owner login for the dashboard |
| `SUPABASE_URL` | Production (required); optional in dev | Durable analytics storage |
| `SUPABASE_SERVICE_ROLE_KEY` | Production (required); optional in dev | Server-only Supabase auth — never exposed to the browser |
| `NEXT_PUBLIC_SITE_URL` | Recommended before launch | Used in metadata, OpenGraph, sitemap, robots.txt, and the UTM link generator |
| `RESEND_API_KEY` | Optional | Enables email notifications on lead submission |
| `OWNER_EMAIL` | Optional (required if `RESEND_API_KEY` is set) | Where the "new project inquiry" email goes |
| `RESEND_FROM_EMAIL` | Optional (required if `RESEND_API_KEY` is set) | Verified sending address in your Resend account |

None of these need a `NEXT_PUBLIC_` prefix except the site URL — the rest are only ever read
server-side (API routes / server components), so they never end up in the browser bundle.

---

## 4. Database schema

See the SQL under **Supabase setup** above. Two tables: `events` (every tracked interaction)
and `leads` (project intake submissions). Both include `utm` and `country` columns for
attribution and aggregated geography. If you're upgrading an existing database rather than
creating one from scratch, use the migration in `supabase/migrations/` instead — see above.

---

## 4a. Email notifications (Resend)

When a project inquiry is submitted, `POST /api/lead` (`src/app/api/lead/route.ts`):

1. Validates and sanitizes the input.
2. Saves the lead to Supabase — **this is the source of truth**, and step 1 fully succeeding is
   what determines whether the visitor sees success.
3. Calls `notifyNewLead()` (`src/lib/email.ts`), which fires two emails in parallel via Resend:
   - An owner notification to `OWNER_EMAIL`, with `replyTo` set to the visitor's email so you
     can reply directly.
   - A short confirmation to the visitor.
4. Returns success to the visitor regardless of how step 3 went.

**Email is intentionally best-effort.** `notifyNewLead()` never throws — every failure (missing
config, invalid API key, Resend being down, etc.) is caught, logged server-side with
`console.error`, and swallowed. A lead that saved successfully to Supabase is never turned into
a failed request because an email didn't send. If `RESEND_API_KEY` isn't set at all, the app
logs one clear warning and skips email entirely — leads still save normally.

To enable it: create a account at [resend.com](https://resend.com), verify a sending domain (or
use their test domain while developing), and set `RESEND_API_KEY`, `OWNER_EMAIL`, and
`RESEND_FROM_EMAIL` in your environment. Nothing else needs to change.

---

## 5. Admin authentication

- `/admin/analytics` is gated server-side (`src/lib/auth.ts`) — there is no client-side password
  check to bypass.
- Logging in (`POST /api/admin/login`) verifies the password against `ADMIN_DASHBOARD_PASSWORD`
  using a constant-time comparison over fixed-length SHA-256 digests (avoids leaking password
  length or content via timing).
- On success, a session cookie is set: `httpOnly`, `secure`, `sameSite: lax`, 8-hour expiry. It
  never contains the password itself, and JavaScript in the browser can't read it.
- Login attempts are rate-limited (10/minute per IP).
- Rotating `ADMIN_DASHBOARD_PASSWORD` invalidates every existing session immediately.
- `robots.txt` disallows `/admin` and `/api`; the admin page also sets `noindex, nofollow`.

---

## 6. Production deployment on Vercel

1. Push this repo to GitHub.
2. Import it into Vercel.
3. In the Vercel project's Environment Variables, add: `ADMIN_DASHBOARD_PASSWORD`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` (your real domain), and
   optionally `RESEND_API_KEY` / `OWNER_EMAIL` / `RESEND_FROM_EMAIL`.
4. Deploy.
5. Add your custom domain under Vercel → Settings → Domains, and update
   `NEXT_PUBLIC_SITE_URL` to match if it changes.

If you deploy without the Supabase variables set, the site still works for visitors — it just
won't durably record analytics or accept leads (see section 2). You'll see this immediately:
`/admin/analytics` will show a "not configured" message instead of charts.

---

## 7. Analytics testing

Open the browser console on the live (or local) site and run:

```js
localStorage.setItem("rudra_analytics_test_mode", "1");
```

Every event fired after that is marked `testMode: true`, logged to the console
(`[analytics:test-mode] ...`), and **the server drops it instead of storing it**. Turn it back
off with:

```js
localStorage.removeItem("rudra_analytics_test_mode");
```

Use this to click through the problem selector, case studies, the intake form, and outbound
links, confirming each fires the expected event in the console — without touching the
dashboard's real numbers or production Supabase data.

**API-level smoke tests** (useful in CI or before a deploy):

```bash
# page view
curl -X POST $URL/api/track -H "Content-Type: application/json" \
  -d '{"name":"page_view","path":"/","visitorId":"test","sessionId":"test","device":"desktop"}'

# lead submission
curl -X POST $URL/api/lead -H "Content-Type: application/json" \
  -d '{"need":"Resume","details":"testing","name":"Test","email":"test@example.com"}'

# public counter reflects it
curl $URL/api/visits
```

Prefer real Supabase test data over the tricks above when you want it to *not* count toward
production numbers — either point a local `.env.local` at a separate Supabase project, or just
rely on test mode, which the server unconditionally discards regardless of which store is active.

> **Known limitation:** test mode only covers `/api/track` events. `/api/lead` has no test-mode
> flag — every successful call to it saves a real row to whichever store is active and (if
> Resend is configured) sends real emails. When testing the lead form against your real
> production Supabase project, expect a real test lead and a real email. If you want to test
> the full form → email flow without that, either point `.env.local` at a second/staging
> Supabase project and a Resend sandbox/test-mode key, or delete the test row afterward in the
> Supabase table editor. This wasn't something the current architecture accounted for — flagging
> it rather than leaving it implicit.

---

## 7a. Testing the lead → email flow specifically

1. Fill out and submit the project intake form (or use the curl example above).
2. Confirm the response is `{"ok":true}`.
3. In Supabase → Table editor → `leads`, confirm the new row appears with a `country` value
   (a two-letter code in production on Vercel, `"Unknown"` in local dev).
4. If `RESEND_API_KEY` is configured, check `OWNER_EMAIL`'s inbox for the notification and the
   submitted email address for the confirmation. Check your terminal/Vercel function logs for
   any `[email] ... failed` or `[email] ... threw` lines — those mean the lead still saved, but
   the email didn't send (e.g. an unverified sending domain, an invalid key). This is expected,
   safe behavior, not a bug — see section 4a.

---

## 8. UTM campaign links (LinkedIn attribution)

The admin dashboard (`/admin/analytics`) includes a **UTM campaign links** panel with one-click
copy for the three LinkedIn variants plus a custom builder:

```
LinkedIn post:    ?utm_source=linkedin&utm_medium=social&utm_campaign=freelance
LinkedIn DM:      ?utm_source=linkedin&utm_medium=dm&utm_campaign=freelance
LinkedIn profile: ?utm_source=linkedin&utm_medium=profile&utm_campaign=freelance
```

Attribution is captured on first touch (`src/lib/utm.ts`), persisted in `localStorage` for the
whole visit, and attached to a lead if one is submitted — so a submitted project request can
always be traced back to the exact LinkedIn post/DM/profile link that brought the visitor in.

The dashboard's **LinkedIn funnel** panel directly answers:
- How many visitors came from LinkedIn (any `utm_source` containing "linkedin")
- How many of those interacted with a service
- How many clicked a CTA
- How many started the project form
- How many actually submitted it

The **UTM campaigns** panel breaks down visits by `utm_campaign` + `utm_medium` for everything
else (resume link, other channels, etc).

---

## 9. Public visitor counter

The footer shows a real, live number — e.g. "1.2K page views" — sourced from
`GET /api/visits`, which counts stored `page_view` events. It is:

- **Never hardcoded.** Starts at 0 on a fresh deployment.
- **Explicitly labeled "page views"**, not "unique visitors" — a hover tooltip spells out that
  it counts every page load, including repeat visits and refreshes. That's the honest,
  standard definition of "page views" (same distinction Google Analytics makes between
  Pageviews and Users) — refreshing the page genuinely is another page view, not an inflated
  fake number.
- For unique-visitor counts, see the admin dashboard's "Unique visitors" metric, which
  deduplicates by a persistent per-browser id.

---

## 10. How to access analytics

Go to `/admin/analytics`, enter `ADMIN_DASHBOARD_PASSWORD`. You'll see:

- Total visits, unique visitors, page views, new vs. returning, leads, conversion rate
- A visitors-over-time chart (day/week/month granularity)
- Traffic sources (LinkedIn / Direct / Google / Other), devices, geography (country-level,
  via Vercel's edge headers — always "Unknown" outside of a Vercel deployment)
- What visitors are looking for (by service)
- CTA click-through rates
- The visitor → lead conversion funnel, and the LinkedIn-specific version of it
- UTM campaign performance and the campaign link generator

Time filters: Today, Yesterday, Last 7/30/90 days, All time, Custom range. A small badge next
to the sign-out button shows which store is active (`Supabase` or `File store (dev)`).

---

## 11. How to update site content

Almost everything is data, not JSX:

| What | File |
|---|---|
| Name, tagline, "13+ people helped", site URL | `src/data/config.ts` |
| LinkedIn / GitHub / email / WhatsApp / resume links | `src/data/config.ts` |
| Services offered | `src/data/services.ts` |
| Case studies | `src/data/caseStudies.ts` |
| Technical skills graph | `src/data/skills.ts` |
| Process steps | `src/data/process.ts` |
| Problem-selector cards | `src/data/problems.ts` |

Changing `SITE.peopleHelped` in `config.ts`, for example, updates the hero, the proof section,
and the `whoami` easter egg all at once.

---

## 12. How to add case studies

Open `src/data/caseStudies.ts` and add an entry to the `CASE_STUDIES` array:

```ts
{
  slug: "unique-slug",
  title: "Project Title",
  tag: "AI" | "Data" | "Automation" | "Research",
  context: "One line — where/how this was built.",
  problem: "What problem this solved.",
  whatIDid: ["Bullet one", "Bullet two", "Bullet three"],
  tech: ["Tech", "Stack", "Used"],
  result: "The real, specific outcome — a number if you have one.",
}
```

Keep every fact real — this section explicitly does not use invented clients or results.

---

## 13. How to add testimonials

There's currently a placeholder line in the Proof section
(`src/components/sections/Proof.tsx`) marked `[PLACEHOLDER — ADD REAL INFORMATION]`. Once you
have real, permission-cleared testimonials:

1. Add a `TESTIMONIALS` array to a new `src/data/testimonials.ts` (name/role, quote, and
   optionally which service it relates to — keep quotes short and verifiable).
2. Replace the placeholder paragraph in `Proof.tsx` with a small rendered list.

Don't add anything here without explicit permission from the person being quoted.

---

## Analytics provider decision

The custom analytics system (typed events → Supabase → the admin dashboard) already covers the
full funnel, UTM/LinkedIn attribution, device/geo breakdowns, and lead tracking end to end — so
a second analytics SaaS wasn't added just to look more "production-grade."

**Vercel Analytics is included**, though, because it does something the custom pipeline
structurally can't: it collects at Vercel's edge/network layer rather than relying on a client-
side `fetch`/`sendBeacon` call succeeding. That makes it a genuine reliability cross-check — if
an ad-blocker or browser extension ever blocks the custom tracker, Vercel Analytics still shows
whether traffic is arriving at all. It's free on Vercel, adds effectively no bundle weight, and
is a no-op when not deployed on Vercel. It does not replace the dashboard — it has no UTM
attribution, no lead data, no funnel — it's purely a sanity-check signal.

PostHog and Plausible were considered and left out: both would either duplicate what the
custom system already does (Plausible) or add a meaningfully larger dependency and a second
piece of infrastructure to run (PostHog, which is really meant for product analytics at a
scale this single-owner freelance site doesn't have). Either can be added later without
touching the existing architecture if the need arises.

---

## Security notes

- Admin auth: server-side only, constant-time password comparison, `httpOnly`/`secure` session
  cookie, rate-limited login. See section 5.
- `/api/track` and `/api/lead` are rate-limited per IP (`src/lib/rate-limit.ts`) and validate
  every field individually — the request body is never spread directly into a stored record, so
  a client can't smuggle arbitrary fields into the database. `meta` and `utm` payloads are
  whitelisted by key pattern and type (`src/lib/sanitize.ts`), which also blocks prototype-
  pollution-style keys (`__proto__`, `constructor`, `prototype`).
- The intake form additionally sanitizes/length-limits every field server-side and includes an
  invisible honeypot field.
- Geography is country-only, sourced from Vercel's own edge header — no IP geolocation lookups,
  no city/lat-long, no client-supplied location data.
- `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_DASHBOARD_PASSWORD` are read only in server-side code
  (API routes / server components) and never appear in the client bundle.
- `RESEND_API_KEY` is read only inside `src/lib/email.ts`, which is never imported by any
  `"use client"` file — it's only ever called from the `/api/lead` route handler, server-side.
  It is never included in any API response body.

---

## Before going live — checklist

- [ ] Set a strong `ADMIN_DASHBOARD_PASSWORD`
- [ ] Run the Supabase migration if upgrading an existing database (section 2), or the full
      `create table` SQL if starting fresh
- [ ] Configure Supabase (section 2) — required, not optional, in production
- [ ] Optionally configure Resend (section 4a) for lead notification emails
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real domain
- [ ] Replace the Proof section placeholder with real, permission-cleared testimonials
- [ ] Run `npm run build` locally once with internet access (Google Fonts are fetched at build
      time) to confirm a clean production build
- [ ] Click through the site once in test mode to confirm every funnel event fires
- [ ] Generate and start using the LinkedIn UTM links from the admin dashboard
