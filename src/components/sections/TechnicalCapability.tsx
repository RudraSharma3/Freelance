"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { SKILL_AREAS, CORE_LANGUAGES } from "@/data/skills";
import { track } from "@/lib/analytics";

// fixed radial positions (percent of 400x400 viewbox) for the 5 category nodes
const POSITIONS = [
  { x: 200, y: 46 }, // top
  { x: 354, y: 150 }, // right-upper
  { x: 300, y: 330 }, // bottom-right
  { x: 100, y: 330 }, // bottom-left
  { x: 46, y: 150 }, // left-upper
];

export default function TechnicalCapability() {
  const [active, setActive] = useState(SKILL_AREAS[0].id);
  const activeArea = SKILL_AREAS.find((a) => a.id === active)!;

  function handleSelect(id: string) {
    setActive(id);
    track("service_selected", { service: `capability_${id}` });
  }

  return (
    <section id="capability" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Behind the work"
        title="Not just a resume/portfolio freelancer"
        description="Five areas, one engineer. Click a node to see what's actually behind it."
      />

      <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-[420px_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[420px]">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
            {SKILL_AREAS.map((area, i) => {
              const pos = POSITIONS[i];
              const isActive = active === area.id;
              return (
                <line
                  key={area.id}
                  x1={200}
                  y1={200}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isActive ? "var(--accent)" : "var(--border)"}
                  strokeWidth={isActive ? 1.5 : 1}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* center node */}
          <div
            className="absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/40 bg-bg-elevated font-display text-sm"
            style={{ left: "50%", top: "50%" }}
          >
            RUDRA
          </div>

          {SKILL_AREAS.map((area, i) => {
            const pos = POSITIONS[i];
            const isActive = active === area.id;
            return (
              <button
                key={area.id}
                onClick={() => handleSelect(area.id)}
                aria-pressed={isActive}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border px-2 py-2 text-center font-mono text-[10px] uppercase tracking-wide transition-all duration-300 sm:text-[11px]"
                style={{
                  left: `${(pos.x / 400) * 100}%`,
                  top: `${(pos.y / 400) * 100}%`,
                  width: "clamp(56px, 20vw, 84px)",
                  height: "clamp(56px, 20vw, 84px)",
                  borderColor: isActive ? "var(--accent)" : "var(--border)",
                  background: isActive ? "var(--accent-soft)" : "var(--bg-elevated)",
                  color: isActive ? "var(--accent-strong)" : "var(--text-secondary)",
                }}
              >
                {area.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeArea.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border bg-bg-elevated/60 p-7"
          >
            <p className="eyebrow mb-2">{activeArea.label}</p>
            <p className="text-sm leading-relaxed text-text-secondary">{activeArea.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {activeArea.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border px-3 py-1.5 text-[13px] text-text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-text-tertiary">
        <span className="eyebrow">Core languages</span>
        {CORE_LANGUAGES.map((l) => (
          <span key={l} className="font-mono text-xs text-text-secondary">
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}
