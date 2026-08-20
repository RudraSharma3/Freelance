"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";

export default function VisitorCounter() {
  const [pageViews, setPageViews] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visits")
      .then((r) => r.json())
      .then((data) => setPageViews(typeof data.pageViews === "number" ? data.pageViews : 0))
      .catch(() => setPageViews(null));
  }, []);

  if (pageViews === null) return null;

  return (
    <span
      className="eyebrow inline-flex items-center gap-1.5 text-text-tertiary"
      title="Total page views recorded across all visits, including repeat page loads — not a count of unique visitors."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
      {formatNumber(pageViews)} page views
    </span>
  );
}
