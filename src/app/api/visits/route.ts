import { NextResponse } from "next/server";
import { getStore, AnalyticsConfigError } from "@/lib/store";

export async function GET() {
  try {
    const count = await getStore().getPublicVisitCount();
    // "count" is total recorded page views, not unique visitors — the UI
    // label must say "page views" to stay accurate (see VisitorCounter.tsx).
    return NextResponse.json({ pageViews: count });
  } catch (err) {
    if (err instanceof AnalyticsConfigError) {
      // Never leak configuration details to public visitors — just log it
      // loudly server-side so the owner notices in Vercel's function logs.
      console.error("[analytics config error]", err.message);
    } else {
      console.error("visits error", err);
    }
    return NextResponse.json({ pageViews: 0 });
  }
}
