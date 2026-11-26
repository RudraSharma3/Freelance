"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CASE_STUDIES, WORK_TAGS, type CaseStudy, type WorkTag } from "@/data/caseStudies";
import Reveal from "@/components/site/Reveal";
import Sheet from "@/components/site/Sheet";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Filter = "All" | WorkTag;
const FILTERS: Filter[] = ["All", ...WORK_TAGS];

/** Work by category: tabs cross-fade the list; each project opens a breakdown. */
export default function Work() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<CaseStudy | null>(null);
  const close = useCallback(() => setActive(null), []);
  const tabsRef = useRef<HTMLDivElement>(null);

  if (CASE_STUDIES.length === 0) return null;

  const list = CASE_STUDIES.filter((c) => filter === "All" || c.tag === filter);
  const count = (f: Filter) => CASE_STUDIES.filter((c) => f === "All" || c.tag === f).length;

  const open = (c: CaseStudy) => {
    setActive(c);
    track("case_study_opened", { case_study: c.slug });
  };

  const onTabKey = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = FILTERS.indexOf(filter);
    const n =
      e.key === "Home" ? 0 : e.key === "End" ? FILTERS.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + FILTERS.length) % FILTERS.length;
    setFilter(FILTERS[n]);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[n]?.focus();
  };

  return (
    <section id="work" className="section">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              Things we can point to.
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-text-secondary">
              Client projects, shown with permission. Every number comes from the project itself.
            </p>
          </Reveal>
        </div>

        <Reveal className="-mx-5 mt-12 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
          <div ref={tabsRef} role="tablist" aria-label="Filter work by type" className="flex w-max gap-2" onKeyDown={onTabKey}>
            {FILTERS.map((f) => {
              const on = f === filter;
              return (
                <button
                  key={f}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="work-list"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                    on ? "border-text-primary bg-text-primary text-white" : "border-border-strong hover:border-text-primary"
                  )}
                >
                  {f}
                  <span className={cn("font-normal tabular-nums", on ? "text-white/65" : "text-text-tertiary")}>{count(f)}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.ul
            key={filter}
            id="work-list"
            role="tabpanel"
            className="mt-8 grid gap-4 md:grid-cols-2"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {list.map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => open(c)}
                  className="group flex h-full w-full flex-col rounded-[22px] border border-border bg-bg-elevated p-6 text-left transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong sm:p-7"
                >
                  <span className="flex items-center justify-between gap-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                    {c.tag}
                    {c.links.some((l) => l.label.startsWith("Live")) && (
                      <span className="inline-flex items-center gap-1.5 text-signal">
                        <i className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                        Live
                      </span>
                    )}
                  </span>
                  <span className="mt-4 font-display text-[1.65rem] font-bold leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent-strong">
                    {c.title}
                  </span>
                  <span className="mt-2 text-[15px] leading-relaxed text-text-secondary">{c.line}</span>
                  <span className="mt-5 block rounded-xl bg-bg px-4 py-3 text-[14px] leading-relaxed">{c.result}</span>
                  <span className="mt-auto pt-5 text-sm font-semibold text-accent-strong">
                    Read the breakdown{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Sheet open={!!active} onClose={close} label={active?.title ?? ""}>
        {active && (
          <>
            <p className="eyebrow">{active.tag}</p>
            <h3 className="mt-3 pr-16 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.025em]">
              {active.title}
            </h3>
            <p className="mt-3 text-[15px] text-text-tertiary">{active.context}</p>
            <p className="mt-5 text-lg leading-relaxed">{active.line}</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-3">The problem</p>
                <p className="text-[15px] leading-relaxed text-text-secondary">{active.problem}</p>
              </div>
              <div>
                <p className="eyebrow mb-3">What was built</p>
                <ul className="grid gap-2.5">
                  {active.whatWeDid.map((w) => (
                    <li key={w} className="flex gap-3 text-[15px] leading-relaxed text-text-secondary">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-8 rounded-2xl border border-accent/25 bg-accent-soft px-5 py-4 text-[15px] font-medium leading-relaxed text-accent-strong">
              {active.result}
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {active.tech.map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1 text-sm text-text-secondary">
                  {t}
                </span>
              ))}
            </div>
            {active.links.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
                {active.links.map((l, k) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => (l.label === "Code" ? track("github_clicked", { case_study: active.slug }) : undefined)}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors",
                      k === 0 ? "bg-text-primary text-white hover:bg-black" : "border border-border-strong hover:border-text-primary"
                    )}
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-8 border-t border-border pt-6 text-sm text-text-tertiary">Built inside the company, so the code isn&apos;t public.</p>
            )}
          </>
        )}
      </Sheet>
    </section>
  );
}
