"use client";

import { useCallback, useState } from "react";
import { PenTool, CodeXml, Bug, ClipboardList, PenLine, BrainCircuit, type LucideIcon } from "lucide-react";
import { DISCIPLINES, DISCIPLINE_COLOR, type Discipline, type DisciplineId } from "@/data/disciplines";
import { SERVICES } from "@/data/services";
import Reveal from "@/components/site/Reveal";
import Sheet from "@/components/site/Sheet";

const ICON: Record<DisciplineId, LucideIcon> = {
  design: PenTool,
  dev: CodeXml,
  qa: Bug,
  data: BrainCircuit,
  content: PenLine,
  pm: ClipboardList,
};

const MARK: Record<DisciplineId, string> = { design: "UX", dev: "Dev", qa: "QA", data: "AI", content: "Aa", pm: "PM" };

function Tile({ d, size }: { d: Discipline; size: "card" | "sheet" }) {
  const Icon = ICON[d.id];
  const color = DISCIPLINE_COLOR[d.id];
  return (
    <div
      aria-hidden
      className={`relative flex items-center justify-center overflow-hidden rounded-[20px] ${size === "card" ? "aspect-[16/10] w-full" : "h-20 w-20 shrink-0"}`}
      style={{ background: `color-mix(in srgb, ${color} 9%, var(--bg-elevated))` }}
    >
      <Icon size={size === "card" ? 46 : 28} strokeWidth={1.4} style={{ color }} />
      {size === "card" && (
        <span
          className="absolute -bottom-3 -right-1 font-display text-[6rem] font-bold leading-none tracking-[-0.06em]"
          style={{ color: `color-mix(in srgb, ${color} 14%, transparent)` }}
        >
          {MARK[d.id]}
        </span>
      )}
    </div>
  );
}

/**
 * "Under one roof": the kinds of work the company does in-house. No people,
 * no profiles; each card opens a sheet about what that work covers.
 */
export default function Studio() {
  const [active, setActive] = useState<Discipline | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="studio" className="section">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">03 · Under one roof</p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              A small team, on purpose.
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-text-secondary">
              Design, development and testing sit in the same team, so nothing gets lost between them. Each project gets the
              parts it needs and nothing it doesn&apos;t.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {DISCIPLINES.map((d, i) => (
            <Reveal as="li" key={d.id} delay={(i % 3) * 0.06}>
              <button type="button" onClick={() => setActive(d)} className="group block w-full text-left">
                <div className="transition-transform duration-700 ease-soft group-hover:-translate-y-1">
                  <Tile d={d} size="card" />
                </div>
                <h3 className="mt-5 flex items-center gap-2.5 font-display text-[1.6rem] font-bold leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent-strong">
                  <i className="h-2.5 w-2.5 rounded-[3px]" style={{ background: DISCIPLINE_COLOR[d.id] }} aria-hidden />
                  {d.name}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{d.line}</p>
                <p className="mt-3 text-sm font-semibold text-accent-strong">
                  What it covers{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </p>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <Sheet open={!!active} onClose={close} label={active?.name ?? ""}>
        {active && (
          <>
            <div className="flex items-center gap-5 pr-16">
              <Tile d={active} size="sheet" />
              <div>
                <p className="eyebrow">Under one roof</p>
                <h3 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.025em]">
                  {active.name}
                </h3>
              </div>
            </div>
            <p className="mt-6 text-lg leading-relaxed">{active.line}</p>

            <p className="eyebrow mb-3 mt-8">On your project</p>
            <ul className="grid gap-2.5">
              {active.covers.map((c) => (
                <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-text-secondary">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: DISCIPLINE_COLOR[active.id] }} aria-hidden />
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-2.5">When it happens</p>
                <p className="text-[15px] text-text-secondary">{active.when}</p>
              </div>
              <div>
                <p className="eyebrow mb-2.5">Part of</p>
                <p className="text-[15px] text-text-secondary">
                  {SERVICES.filter((s) => s.roles.includes(active.id))
                    .map((s) => s.name)
                    .join(", ")}
                </p>
              </div>
            </div>
          </>
        )}
      </Sheet>
    </section>
  );
}
