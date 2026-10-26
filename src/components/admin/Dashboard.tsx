"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { LogOut } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/analytics-compute";
import CampaignLinks from "@/components/admin/CampaignLinks";

type RangeKey = "today" | "yesterday" | "7d" | "30d" | "90d" | "all" | "custom";

function rangeToTimestamps(range: RangeKey, customFrom: string, customTo: string) {
  const now = Date.now();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = new Date();

  switch (range) {
    case "today":
      return { from: startOfDay(today), to: now };
    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { from: startOfDay(y), to: startOfDay(today) - 1 };
    }
    case "7d":
      return { from: now - 7 * 86400000, to: now };
    case "30d":
      return { from: now - 30 * 86400000, to: now };
    case "90d":
      return { from: now - 90 * 86400000, to: now };
    case "all":
      return { from: 0, to: now };
    case "custom":
      return {
        from: customFrom ? new Date(customFrom).getTime() : now - 30 * 86400000,
        to: customTo ? new Date(customTo).getTime() : now,
      };
  }
}

const RANGE_LABELS: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "all", label: "All time" },
  { key: "custom", label: "Custom" },
];

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-display text-3xl font-medium">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [range, setRange] = useState<RangeKey>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [granularity, setGranularity] = useState<"day" | "week" | "month">("day");
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { from, to } = useMemo(
    () => rangeToTimestamps(range, customFrom, customTo),
    [range, customFrom, customTo]
  );

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch triggered by range/granularity change
    setLoading(true);
    setError(null);
    fetch(`/api/analytics/summary?from=${from}&to=${to}&granularity=${granularity}`)
      .then(async (r) => {
        if (r.status === 401) {
          router.push("/admin/analytics");
          throw new Error("unauthorized");
        }
        const json = await r.json();
        if (!r.ok) throw new Error(json.message || json.error || "Couldn't load analytics.");
        return json;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't load analytics.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from, to, granularity, router]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Owner-only</p>
            <h1 className="mt-1 font-display text-2xl font-medium">Analytics dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {data && (
              <span
                className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${
                  data.storeBackend === "supabase"
                    ? "border-signal/30 text-signal"
                    : "border-border text-text-tertiary"
                }`}
                title={
                  data.storeBackend === "supabase"
                    ? "Durable storage — Supabase"
                    : "Local file store — fine for dev, not durable in production"
                }
              >
                {data.storeBackend === "supabase" ? "Supabase" : "File store (dev)"}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {RANGE_LABELS.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                range === r.key
                  ? "border-accent bg-accent-soft text-accent-strong"
                  : "border-border text-text-secondary hover:border-accent/40"
              }`}
            >
              {r.label}
            </button>
          ))}
          {range === "custom" && (
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-lg border border-border bg-bg-elevated px-2 py-1.5"
              />
              <span className="text-text-tertiary">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-lg border border-border bg-bg-elevated px-2 py-1.5"
              />
            </div>
          )}

          <div className="ml-auto flex gap-1 rounded-full border border-border p-1">
            {(["day", "week", "month"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                  granularity === g ? "bg-accent text-[#161006]" : "text-text-tertiary"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="mt-10 text-sm text-text-tertiary">Loading…</p>}
        {error && <p className="mt-10 text-sm text-red-400">{error}</p>}

        {data && (
          <div className="mt-8 space-y-10">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              <MetricCard label="Total visits" value={String(data.totalVisits)} />
              <MetricCard label="Unique visitors" value={String(data.uniqueVisitors)} />
              <MetricCard label="Page views" value={String(data.pageViews)} />
              <MetricCard label="New" value={String(data.newVisitors)} />
              <MetricCard label="Returning" value={String(data.returningVisitors)} />
              <MetricCard label="Leads" value={String(data.leads)} />
              <MetricCard label="Conversion" value={`${(data.conversionRate * 100).toFixed(1)}%`} />
            </div>

            <div>
              <p className="eyebrow mb-3">Visitors over time</p>
              <div className="h-64 rounded-2xl border border-border bg-bg-elevated p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.timeSeries}>
                    <defs>
                      <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border-soft)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} width={30} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-elevated-2)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="visitors" stroke="var(--accent)" fill="url(#visitorsGradient)" strokeWidth={2} name="Visitors" />
                    <Area type="monotone" dataKey="pageViews" stroke="var(--signal)" fill="transparent" strokeWidth={1.5} name="Page views" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-bg-elevated p-5">
                <p className="eyebrow mb-3">Traffic sources</p>
                <div className="space-y-2">
                  {data.trafficSources.length === 0 && <p className="text-xs text-text-tertiary">No data yet.</p>}
                  {data.trafficSources.map((s) => (
                    <div key={s.source} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{s.source}</span>
                      <span className="font-mono text-xs text-text-tertiary">{s.visits}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-bg-elevated p-5">
                <p className="eyebrow mb-3">Devices</p>
                <div className="space-y-2">
                  {data.devices.length === 0 && <p className="text-xs text-text-tertiary">No data yet.</p>}
                  {data.devices.map((d) => (
                    <div key={d.device} className="flex items-center justify-between text-sm capitalize">
                      <span className="text-text-secondary">{d.device}</span>
                      <span className="font-mono text-xs text-text-tertiary">{d.visits}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-bg-elevated p-5">
                <p className="eyebrow mb-3">What visitors are looking for</p>
                <div className="space-y-2">
                  {data.services.length === 0 && <p className="text-xs text-text-tertiary">No data yet.</p>}
                  {data.services.map((s) => (
                    <div key={s.service} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{s.service}</span>
                      <span className="font-mono text-xs text-text-tertiary">
                        {(s.share * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-bg-elevated p-5">
                <p className="eyebrow mb-3">CTA performance</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-text-tertiary">
                      <th className="pb-2 font-normal">CTA</th>
                      <th className="pb-2 font-normal">Clicks</th>
                      <th className="pb-2 font-normal">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ctas.map((c) => (
                      <tr key={c.name} className="border-t border-border-soft">
                        <td className="py-2 text-text-secondary">{c.name.replace(/_/g, " ")}</td>
                        <td className="py-2 font-mono text-xs">{c.clicks}</td>
                        <td className="py-2 font-mono text-xs">{(c.ctr * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl border border-border bg-bg-elevated p-5">
                <p className="eyebrow mb-3">Funnel</p>
                <div className="space-y-2">
                  {data.funnel.map((f, i) => {
                    const max = data.funnel[0]?.count || 1;
                    const pct = Math.max((f.count / max) * 100, 2);
                    return (
                      <div key={f.step}>
                        <div className="flex items-center justify-between text-xs text-text-tertiary">
                          <span>{i + 1}. {f.step}</span>
                          <span className="font-mono">{f.count}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-border-soft">
                          <div
                            className="h-1.5 rounded-full bg-accent transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-bg-elevated p-5 lg:col-span-1">
                <p className="eyebrow mb-1">LinkedIn funnel</p>
                <p className="mb-3 text-xs text-text-tertiary">
                  {data.linkedin.visitors} visitor{data.linkedin.visitors === 1 ? "" : "s"} arrived via a
                  linkedin utm_source
                </p>
                <div className="space-y-2">
                  {data.linkedin.funnel.map((f, i) => {
                    const max = data.linkedin.funnel[0]?.count || 1;
                    const pct = Math.max((f.count / max) * 100, 2);
                    return (
                      <div key={f.step}>
                        <div className="flex items-center justify-between text-xs text-text-tertiary">
                          <span>{i + 1}. {f.step}</span>
                          <span className="font-mono">{f.count}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-border-soft">
                          <div
                            className="h-1.5 rounded-full bg-signal transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-bg-elevated p-5">
                <p className="eyebrow mb-3">UTM campaigns</p>
                <div className="space-y-2">
                  {data.utmCampaigns.length === 0 && (
                    <p className="text-xs text-text-tertiary">No campaign traffic yet.</p>
                  )}
                  {data.utmCampaigns.map((c) => (
                    <div key={`${c.campaign}-${c.medium}`} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        {c.campaign} <span className="text-text-tertiary">· {c.medium}</span>
                      </span>
                      <span className="font-mono text-xs text-text-tertiary">{c.visits}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-bg-elevated p-5">
                <p className="eyebrow mb-1">Geography</p>
                <p className="mb-3 text-xs text-text-tertiary">Country-level, from Vercel&apos;s edge — Unknown locally</p>
                <div className="space-y-2">
                  {data.geography.length === 0 && <p className="text-xs text-text-tertiary">No data yet.</p>}
                  {data.geography.map((g) => (
                    <div key={g.country} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{g.country}</span>
                      <span className="font-mono text-xs text-text-tertiary">{g.visits}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <CampaignLinks />
          </div>
        )}
      </div>
    </div>
  );
}
