"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { SITE } from "@/data/config";

const PRESETS = [
  { label: "LinkedIn post", source: "linkedin", medium: "social", campaign: "freelance" },
  { label: "LinkedIn DM", source: "linkedin", medium: "dm", campaign: "freelance" },
  { label: "LinkedIn profile", source: "linkedin", medium: "profile", campaign: "freelance" },
  { label: "Resume footer", source: "resume", medium: "document", campaign: "freelance" },
];

function buildUrl(source: string, medium: string, campaign: string) {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
  });
  return `${SITE.url}/?${params.toString()}`;
}

function CopyRow({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — nothing to do, the link is still selectable/visible
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-soft bg-bg px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="mt-0.5 truncate font-mono text-xs text-text-tertiary">{url}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary"
      >
        {copied ? <Check size={13} className="text-signal" /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function CampaignLinks() {
  const [source, setSource] = useState("linkedin");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("freelance");

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5">
      <p className="eyebrow mb-1">UTM campaign links</p>
      <p className="mb-4 text-xs text-text-tertiary">
        Use these when sharing the site so the dashboard can attribute traffic back to LinkedIn.
      </p>

      <div className="space-y-2">
        {PRESETS.map((p) => (
          <CopyRow key={p.label} label={p.label} url={buildUrl(p.source, p.medium, p.campaign)} />
        ))}
      </div>

      <div className="mt-6 border-t border-border-soft pt-5">
        <p className="eyebrow mb-3">Build a custom link</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="utm_source"
            className="rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-text-tertiary focus:border-accent"
          />
          <input
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="utm_medium"
            className="rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-text-tertiary focus:border-accent"
          />
          <input
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="utm_campaign"
            className="rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-text-tertiary focus:border-accent"
          />
        </div>
        <div className="mt-3">
          <CopyRow label="Custom link" url={buildUrl(source || "source", medium || "medium", campaign || "campaign")} />
        </div>
      </div>
    </div>
  );
}
