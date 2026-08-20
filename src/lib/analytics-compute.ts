import type { TrackedEvent, LeadSubmission } from "@/types/analytics";

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  newVisitors: number;
  returningVisitors: number;
  leads: number;
  conversionRate: number; // leads / uniqueVisitors
  trafficSources: { source: string; visits: number }[];
  devices: { device: string; visits: number }[];
  ctas: { name: string; clicks: number; ctr: number }[];
  services: { service: string; interactions: number; share: number }[];
  funnel: { step: string; count: number }[];
  timeSeries: { date: string; visitors: number; pageViews: number }[];
  utmCampaigns: { campaign: string; medium: string; visits: number }[];
  linkedin: { visitors: number; funnel: { step: string; count: number }[] };
  geography: { country: string; visits: number }[];
  storeBackend: "supabase" | "file" | "unconfigured";
}

function classifySource(utmSource: string | undefined, allEventsForVisitor: TrackedEvent[]): string {
  if (utmSource) {
    if (isLinkedInSource(utmSource)) return "LinkedIn";
    if (utmSource.toLowerCase().includes("google")) return "Google";
    return "Other";
  }
  const referrerless = allEventsForVisitor.every((e) => !e.utm?.utm_source);
  return referrerless ? "Direct" : "Other";
}

function isLinkedInSource(utmSource: string | undefined): boolean {
  return Boolean(utmSource && utmSource.toLowerCase().includes("linkedin"));
}

export function computeSummary(
  eventsInRange: TrackedEvent[],
  leadsInRange: LeadSubmission[],
  allEventsEver: TrackedEvent[],
  granularity: "day" | "week" | "month" = "day",
  storeBackend: AnalyticsSummary["storeBackend"] = "file"
): AnalyticsSummary {
  const pageViews = eventsInRange.filter((e) => e.name === "page_view");
  const uniqueVisitorIds = new Set(pageViews.map((e) => e.visitorId));

  // first-ever page_view per visitor, computed from the FULL event history
  const firstSeen = new Map<string, number>();
  for (const e of allEventsEver) {
    if (e.name !== "page_view") continue;
    const prev = firstSeen.get(e.visitorId);
    if (prev === undefined || e.timestamp < prev) firstSeen.set(e.visitorId, e.timestamp);
  }

  let newVisitors = 0;
  let returningVisitors = 0;
  for (const id of uniqueVisitorIds) {
    const first = firstSeen.get(id);
    const rangeStart = Math.min(...pageViews.map((e) => e.timestamp));
    if (first !== undefined && first >= rangeStart) newVisitors++;
    else returningVisitors++;
  }

  // traffic sources
  const eventsByVisitor = new Map<string, TrackedEvent[]>();
  for (const e of eventsInRange) {
    const list = eventsByVisitor.get(e.visitorId) ?? [];
    list.push(e);
    eventsByVisitor.set(e.visitorId, list);
  }
  const sourceCounts = new Map<string, number>();
  for (const e of pageViews) {
    const src = classifySource(e.utm?.utm_source, eventsByVisitor.get(e.visitorId) ?? []);
    sourceCounts.set(src, (sourceCounts.get(src) ?? 0) + 1);
  }

  // devices
  const deviceCounts = new Map<string, number>();
  for (const e of pageViews) {
    deviceCounts.set(e.device, (deviceCounts.get(e.device) ?? 0) + 1);
  }

  // CTAs
  const ctaEventNames = [
    "start_project_clicked",
    "linkedin_clicked",
    "github_clicked",
    "resume_downloaded",
  ] as const;
  const ctas = ctaEventNames.map((name) => {
    const clicks = eventsInRange.filter((e) => e.name === name).length;
    return {
      name,
      clicks,
      ctr: pageViews.length > 0 ? clicks / pageViews.length : 0,
    };
  });

  // services
  const serviceCounts = new Map<string, number>();
  const serviceEvents = eventsInRange.filter((e) => e.name === "service_selected");
  for (const e of serviceEvents) {
    const service = String(e.meta?.service ?? "unknown");
    serviceCounts.set(service, (serviceCounts.get(service) ?? 0) + 1);
  }
  const totalServiceInteractions = serviceEvents.length || 1;

  // funnel
  const funnelSteps: { step: string; name: TrackedEvent["name"] }[] = [
    { step: "Visitor", name: "page_view" },
    { step: "Service interaction", name: "service_selected" },
    { step: "CTA click", name: "start_project_clicked" },
    { step: "Form started", name: "form_started" },
    { step: "Form submitted", name: "form_submitted" },
  ];
  const funnel = funnelSteps.map(({ step, name }) => ({
    step,
    count: eventsInRange.filter((e) => e.name === name).length,
  }));

  // time series
  const bucketKey = (ts: number) => {
    const d = new Date(ts);
    if (granularity === "day") return d.toISOString().slice(0, 10);
    if (granularity === "month") return d.toISOString().slice(0, 7);
    // week: ISO week start (Monday)
    const day = d.getUTCDay() || 7;
    const monday = new Date(d);
    monday.setUTCDate(d.getUTCDate() - day + 1);
    return monday.toISOString().slice(0, 10);
  };
  const seriesMap = new Map<string, { visitors: Set<string>; pageViews: number }>();
  for (const e of pageViews) {
    const key = bucketKey(e.timestamp);
    const bucket = seriesMap.get(key) ?? { visitors: new Set(), pageViews: 0 };
    bucket.visitors.add(e.visitorId);
    bucket.pageViews += 1;
    seriesMap.set(key, bucket);
  }
  const timeSeries = Array.from(seriesMap.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, v]) => ({ date, visitors: v.visitors.size, pageViews: v.pageViews }));

  // UTM campaigns — how each LinkedIn post/DM/profile link (or anything
  // else with utm_campaign) is actually performing.
  const campaignCounts = new Map<string, { medium: string; visits: number }>();
  for (const e of pageViews) {
    if (!e.utm?.utm_campaign) continue;
    const campaign = e.utm.utm_campaign;
    const medium = e.utm.utm_medium ?? "unknown";
    const key = `${campaign}::${medium}`;
    const existing = campaignCounts.get(key);
    campaignCounts.set(key, { medium, visits: (existing?.visits ?? 0) + 1 });
  }
  const utmCampaigns = Array.from(campaignCounts.entries())
    .map(([key, v]) => ({ campaign: key.split("::")[0], medium: v.medium, visits: v.visits }))
    .sort((a, b) => b.visits - a.visits);

  // LinkedIn-specific funnel — answers "how many visitors came from
  // LinkedIn, and how many of those interacted / clicked / started / submitted".
  // A visitor counts as LinkedIn-attributed if ANY of their page_views in
  // range carried a linkedin utm_source (first-touch is what matters for
  // "did LinkedIn bring them here", not every single page load).
  const linkedinVisitorIds = new Set(
    pageViews.filter((e) => isLinkedInSource(e.utm?.utm_source)).map((e) => e.visitorId)
  );
  const linkedinFunnelSteps: { step: string; name: TrackedEvent["name"] }[] = [
    { step: "LinkedIn visitors", name: "page_view" },
    { step: "Service interaction", name: "service_selected" },
    { step: "CTA click", name: "start_project_clicked" },
    { step: "Form started", name: "form_started" },
    { step: "Form submitted", name: "form_submitted" },
  ];
  const linkedinFunnel = linkedinFunnelSteps.map(({ step, name }) => {
    if (name === "page_view") return { step, count: linkedinVisitorIds.size };
    const count = new Set(
      eventsInRange.filter((e) => e.name === name && linkedinVisitorIds.has(e.visitorId)).map((e) => e.visitorId)
    ).size;
    return { step, count };
  });

  // Geography — country only, sourced server-side from Vercel's edge geo
  // header (see src/lib/geo.ts). Always "Unknown" outside of Vercel.
  const countryCounts = new Map<string, number>();
  for (const e of pageViews) {
    const country = e.country ?? "Unknown";
    countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
  }
  const geography = Array.from(countryCounts.entries())
    .map(([country, visits]) => ({ country, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  return {
    totalVisits: pageViews.length,
    uniqueVisitors: uniqueVisitorIds.size,
    pageViews: pageViews.length,
    newVisitors,
    returningVisitors,
    leads: leadsInRange.length,
    conversionRate: uniqueVisitorIds.size > 0 ? leadsInRange.length / uniqueVisitorIds.size : 0,
    trafficSources: Array.from(sourceCounts.entries()).map(([source, visits]) => ({
      source,
      visits,
    })),
    devices: Array.from(deviceCounts.entries()).map(([device, visits]) => ({ device, visits })),
    ctas,
    services: Array.from(serviceCounts.entries()).map(([service, interactions]) => ({
      service,
      interactions,
      share: interactions / totalServiceInteractions,
    })),
    funnel,
    timeSeries,
    utmCampaigns,
    linkedin: { visitors: linkedinVisitorIds.size, funnel: linkedinFunnel },
    geography,
    storeBackend,
  };
}
