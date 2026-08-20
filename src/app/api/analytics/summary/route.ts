import { NextResponse } from "next/server";
import { getStore, describeStoreConfig, AnalyticsConfigError } from "@/lib/store";
import { isAdminAuthenticated } from "@/lib/auth";
import { computeSummary } from "@/lib/analytics-compute";

export async function GET(req: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { backend } = describeStoreConfig();
  if (backend === "unconfigured") {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set. Production requires Supabase — see README.md.",
      },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const from = Number(url.searchParams.get("from")) || Date.now() - 30 * 24 * 60 * 60 * 1000;
  const to = Number(url.searchParams.get("to")) || Date.now();
  const granularity = (url.searchParams.get("granularity") as "day" | "week" | "month") || "day";

  try {
    const store = getStore();
    const [eventsInRange, leadsInRange, allEventsEver] = await Promise.all([
      store.getEvents({ from, to }),
      store.getLeads({ from, to }),
      store.getEvents({ from: 0, to: Date.now() }),
    ]);

    const summary = computeSummary(eventsInRange, leadsInRange, allEventsEver, granularity, backend);
    return NextResponse.json(summary);
  } catch (err) {
    if (err instanceof AnalyticsConfigError) {
      return NextResponse.json({ error: "not_configured", message: err.message }, { status: 500 });
    }
    console.error("analytics summary error", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
