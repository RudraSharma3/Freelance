-- ============================================================================
-- Migration: add `country` column to events and leads
-- ============================================================================
--
-- WHY: the app code (src/lib/store/supabase-store.ts) reads/writes a
-- `country` field on both tables (aggregated, country-only geo — see
-- src/lib/geo.ts). Your existing database predates that change, so
-- PostgREST rejects any insert that includes it with:
--
--   "Could not find the 'country' column of 'events' in the schema cache"
--   "Could not find the 'country' column of 'leads' in the schema cache"
--
-- This is the ONLY schema drift between your current database and what the
-- code expects — every other column the code uses (name, path, visitor_id,
-- session_id, ts, device, utm, meta / need, details, timeline, name, email,
-- contact, session_id) already exists in your tables.
--
-- SAFETY: this migration is purely additive.
--   - `ADD COLUMN IF NOT EXISTS` never touches existing rows or columns.
--   - It does NOT drop, truncate, or rename anything.
--   - It does NOT touch RLS policies or existing data.
--   - It is idempotent — safe to run more than once if you're unsure
--     whether a previous attempt partially succeeded.
--
-- Run this in Supabase → SQL Editor, then run it once (or click
-- Database → "Reload schema" in the dashboard as a UI-only alternative to
-- the NOTIFY at the bottom of this file).
-- ============================================================================

alter table public.events
  add column if not exists country text;

alter table public.leads
  add column if not exists country text;

-- Force PostgREST to pick up the new columns immediately. Supabase usually
-- does this automatically after a schema change, but the automatic reload
-- can lag by up to a minute or occasionally miss firing after a change made
-- outside Supabase's own migration tooling (e.g. pasted directly into the
-- SQL editor). This NOTIFY is the standard, documented way to force it —
-- it's a cache-refresh signal, not a data or schema change.
notify pgrst, 'reload schema';
