"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PROBLEMS } from "@/data/problems";
import { serviceById, type ServiceId } from "@/data/services";
import Reveal from "@/components/site/Reveal";
import Sheet from "@/components/site/Sheet";
import RoleTag from "@/components/site/RoleTag";
import ServiceDetail from "@/components/site/ServiceDetail";
import { track } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;
/** Header and rows share one grid so the columns line up. */
const COLS = "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_8.5rem]";

/**
 * "Start here": the intro sticks on the left while a brief scrolls past on the
 * right. Each row is a problem in the visitor's words, what it becomes, and
 * who picks it up; the role stamps land a beat after the row.
 */
export default function Brief() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ServiceId | null>(null);
  const close = useCallback(() => setActive(null), []);

  const open = (id: ServiceId) => {
    setActive(id);
    track("service_selected", { service: id, from: "brief" });
  };

  const service = active ? serviceById(active) : null;

  return (
    <section id="start-here" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow">01 · Start here</p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              What are you trying to solve?
            </h2>
            <p className="mt-6 max-w-[30rem] text-lg leading-relaxed text-text-secondary">
              Find the line that sounds like you. Open it to see what we&apos;d do, what you get, and which part of the team
              picks it up.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <article className="overflow-hidden rounded-[24px] border border-border bg-bg-elevated">
              <header className={`${COLS} border-b border-border bg-bg px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary sm:px-6`}>
                <span>You say</span>
                <span className="hidden sm:block">What it becomes</span>
                <span className="text-right">Who picks it up</span>
              </header>
              <ol>
                {PROBLEMS.map((p, i) => (
                  <motion.li
                    key={p.id}
                    className="border-b border-border last:border-b-0"
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 0.5, delay: 0.05, ease }}
                  >
                    <button
                      type="button"
                      onClick={() => open(p.id)}
                      className={`group ${COLS} w-full items-start gap-y-2 px-4 py-5 text-left transition-colors hover:bg-bg sm:px-6`}
                    >
                      <span className="font-display text-[1.3rem] font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-accent-strong">
                        &ldquo;{p.question}&rdquo;
                      </span>
                      <span className="col-span-2 row-start-2 text-[15px] text-text-secondary sm:col-span-1 sm:row-start-auto sm:pt-1">
                        {p.label}
                        <span className="ml-1.5 inline-block text-accent transition-transform group-hover:translate-x-1" aria-hidden>
                          →
                        </span>
                      </span>
                      <motion.span
                        className="col-start-2 row-start-1 flex flex-wrap justify-end gap-1 sm:col-start-3 sm:pt-0.5"
                        initial={{ opacity: 0, scale: reduce ? 1 : 1.25 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                        transition={{ duration: 0.35, delay: 0.55 + (i % 3) * 0.05, ease }}
                      >
                        {p.roles.map((r) => (
                          <RoleTag key={r} id={r} />
                        ))}
                      </motion.span>
                    </button>
                  </motion.li>
                ))}
              </ol>
            </article>
          </Reveal>
        </div>
      </div>

      <Sheet open={!!service} onClose={close} label={service?.name ?? ""}>
        {service && (
          <>
            <p className="eyebrow">Service</p>
            <h3 className="mt-3 pr-16 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.025em]">
              {service.name}
            </h3>
            <div className="mt-6">
              <ServiceDetail service={service} onStart={close} />
            </div>
          </>
        )}
      </Sheet>
    </section>
  );
}
