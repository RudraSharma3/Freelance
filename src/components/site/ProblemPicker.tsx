"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { PROBLEMS } from "@/data/problems";
import { serviceById } from "@/data/services";
import Reveal from "@/components/site/Reveal";
import Label from "@/components/site/Label";
import RoleTag from "@/components/site/RoleTag";
import StartButton from "@/components/site/StartButton";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useReduce } from "@/lib/motion";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * "What are you trying to solve?" Pick a line on the left; the answer on the
 * right swaps in place (no pop-up), with what you get and a button that
 * carries the choice into the project form.
 */
export default function ProblemPicker() {
  const reduce = useReduce();
  const [id, setId] = useState(PROBLEMS[0].id);
  const problem = PROBLEMS.find((p) => p.id === id)!;
  const service = serviceById(id);

  const pick = (next: typeof id) => {
    if (next === id) return;
    setId(next);
    track("service_selected", { service: next, from: "picker" });
  };

  return (
    <section id="start-here" className="section">
      <div className="wrap">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Label>Start here</Label>
          <h2 className="mt-6 font-display text-[clamp(2.3rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.035em]">
            What are you trying to solve?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            Pick the line that sounds most like you. We&apos;ll show you what we&apos;d do about it.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <Reveal className="min-w-0">
            <LayoutGroup>
              <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0" role="tablist" aria-label="Problems">
                {PROBLEMS.map((p) => {
                  const on = p.id === id;
                  return (
                    <li key={p.id} className="shrink-0">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-controls="picker-answer"
                        onClick={() => pick(p.id)}
                        className={cn(
                          "relative isolate flex w-full items-center justify-between gap-4 rounded-full px-5 py-3 text-left transition-colors lg:rounded-2xl lg:px-6 lg:py-4",
                          on ? "text-text-primary" : "border border-border text-text-secondary hover:text-text-primary lg:border-transparent"
                        )}
                      >
                        {on && (
                          <motion.span
                            layoutId="picker-active"
                            className="absolute inset-0 -z-[1] rounded-full border border-border-strong bg-bg-elevated shadow-[0_10px_30px_-20px_rgba(22,22,26,0.35)] lg:rounded-2xl"
                            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                          />
                        )}
                        <span className="whitespace-nowrap font-display text-[1.05rem] font-semibold tracking-[-0.01em] lg:whitespace-normal lg:text-[1.35rem]">
                          {p.question}
                        </span>
                        <span className={cn("hidden text-accent transition-[opacity,transform] lg:inline", on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")} aria-hidden>
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            <div className="lg:sticky lg:top-28">
              <div
                id="picker-answer"
                role="tabpanel"
                aria-live="polite"
                className="relative overflow-hidden rounded-[32px] border border-border bg-bg-elevated p-7 shadow-[0_30px_80px_-50px_rgba(22,22,26,0.4)] sm:p-10"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: reduce ? 0 : 14, filter: reduce ? "none" : "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: reduce ? 0 : -10, filter: reduce ? "none" : "blur(4px)" }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <p className="text-sm font-medium text-text-tertiary">We hear</p>
                    <h3 className="mt-1.5 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.025em]">
                      {problem.label}
                    </h3>
                    <p className="mt-5 text-[17px] leading-relaxed text-text-secondary">{service.problem}</p>

                    <ul className="mt-7 grid gap-3">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex gap-3 text-[15px] leading-relaxed">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent-strong" aria-hidden>
                            ✓
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                      <div className="flex flex-wrap gap-1.5">
                        {problem.roles.map((r) => (
                          <RoleTag key={r} id={r} />
                        ))}
                      </div>
                      <StartButton need={service.intake} from={`picker_${service.id}`}>
                        {service.cta}
                        <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                          →
                        </span>
                      </StartButton>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
