"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { PenTool, CodeXml, Bug, ClipboardList, PenLine, BrainCircuit, type LucideIcon } from "lucide-react";
import { DISCIPLINES, DISCIPLINE_COLOR, type Discipline, type DisciplineId } from "@/data/disciplines";
import { SERVICES } from "@/data/services";
import Label from "@/components/site/Label";
import Reveal from "@/components/site/Reveal";
import Sheet from "@/components/site/Sheet";
import { cn } from "@/lib/utils";
import { useReduce } from "@/lib/motion";

const ICON: Record<DisciplineId, LucideIcon> = {
  design: PenTool,
  dev: CodeXml,
  qa: Bug,
  data: BrainCircuit,
  content: PenLine,
  pm: ClipboardList,
};

/** Tile sizes for the bento grid (4 columns on desktop). */
const SPAN: Record<DisciplineId, string> = {
  design: "lg:col-span-2",
  dev: "lg:col-span-2 lg:row-span-2",
  qa: "lg:col-span-1",
  data: "lg:col-span-1",
  content: "lg:col-span-2",
  pm: "lg:col-span-2",
};

function Icon({ id, big }: { id: DisciplineId; big?: boolean }) {
  const I = ICON[id];
  const color = DISCIPLINE_COLOR[id];
  return (
    <span
      className={cn("flex items-center justify-center rounded-2xl", big ? "h-16 w-16" : "h-12 w-12")}
      style={{ background: `color-mix(in srgb, ${color} 10%, #ffffff)`, color }}
      aria-hidden
    >
      <I size={big ? 30 : 22} strokeWidth={1.6} />
    </span>
  );
}

/**
 * "Under one roof": the six kinds of work, as a bento grid of different-sized
 * tiles. Each opens a sheet. No people, no profiles.
 */
export default function Bento() {
  const reduce = useReduce();
  const [active, setActive] = useState<Discipline | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="studio" className="section">
      <div className="wrap">
        <div className="grid items-end gap-6 lg:grid-cols-2">
          <Reveal>
            <Label>Under one roof</Label>
            <h2 className="mt-6 font-display text-[clamp(2.3rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.035em]">
              A small team, on purpose.
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-lg text-lg leading-relaxed text-text-secondary lg:ml-auto">
              Design, development and testing sit in the same team, so nothing gets lost between them. Each project gets the
              parts it needs and nothing it doesn&apos;t.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid auto-rows-[minmax(12.5rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISCIPLINES.map((d, i) => {
            const big = d.id === "dev";
            return (
              <motion.li
                key={d.id}
                className={SPAN[d.id]}
                initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setActive(d)}
                  className={cn(
                    "group relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-border bg-bg-elevated p-7 text-left transition-[transform,border-color,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_24px_60px_-40px_rgba(22,22,26,0.45)]",
                    big && "lg:p-10"
                  )}
                >
                  <Icon id={d.id} big={big} />
                  <span className="mt-auto pt-10">
                    <span className={cn("block font-display font-bold leading-tight tracking-[-0.02em]", big ? "text-[2.4rem]" : "text-[1.6rem]")}>
                      {d.name}
                    </span>
                    <span className={cn("mt-2 block leading-relaxed text-text-secondary", big ? "max-w-sm text-[17px]" : "text-[15px]")}>{d.line}</span>
                    {big && (
                      <span className="mt-6 grid max-w-md gap-2.5 border-t border-border pt-5">
                        {d.covers.slice(0, 3).map((c) => (
                          <span key={c} className="flex gap-2.5 text-[15px] leading-snug text-text-secondary">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: DISCIPLINE_COLOR[d.id] }} aria-hidden />
                            {c}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                  <span
                    className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm transition-[background-color,border-color,color,transform] duration-300 group-hover:rotate-[-45deg] group-hover:border-text-primary group-hover:bg-text-primary group-hover:text-white"
                    aria-hidden
                  >
                    →
                  </span>
                  {big && (
                    <span className="pointer-events-none absolute -bottom-6 -right-2 font-display text-[11rem] font-bold leading-none tracking-[-0.06em] text-[#2747c9]/[0.07]" aria-hidden>
                      {"</>"}
                    </span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <Sheet open={!!active} onClose={close} label={active?.name ?? ""}>
        {active && (
          <>
            <div className="flex items-center gap-5 pr-16">
              <Icon id={active.id} big />
              <h3 className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.025em]">{active.name}</h3>
            </div>
            <p className="mt-6 text-lg leading-relaxed">{active.line}</p>
            <p className="eyebrow mb-3 mt-8">On your project</p>
            <ul className="grid gap-3">
              {active.covers.map((c) => (
                <li key={c} className="flex gap-3 text-[15px] leading-relaxed">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: `color-mix(in srgb, ${DISCIPLINE_COLOR[active.id]} 12%, #ffffff)`, color: DISCIPLINE_COLOR[active.id] }}
                    aria-hidden
                  >
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
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
