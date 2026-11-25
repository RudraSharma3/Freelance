"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PROCESS_STEPS } from "@/data/process";
import Reveal from "@/components/site/Reveal";
import RoleTag from "@/components/site/RoleTag";

const ease = [0.22, 1, 0.36, 1] as const;

/** How a project goes: the intro sticks on the left; each step lands with who's responsible for it. */
export default function Process() {
  const reduce = useReducedMotion();
  return (
    <section id="process" className="section bg-bg-elevated">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow">05 · How we work</p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              Seven steps, and who owns each one.
            </h2>
            <p className="mt-6 max-w-[30rem] text-lg leading-relaxed text-text-secondary">
              You always know what stage you&apos;re in and who to ask. Small jobs skip the steps they don&apos;t need: a resume
              doesn&apos;t need a test plan.
            </p>
          </Reveal>
        </div>

        <ol className="relative lg:col-span-7">
          <span className="absolute bottom-4 left-[1.05rem] top-4 w-px bg-border" aria-hidden />
          {PROCESS_STEPS.map((s, i) => (
            <motion.li
              key={s.index}
              className="relative grid grid-cols-[2.25rem_1fr] gap-5 pb-10 last:pb-0"
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.5, ease }}
            >
              <span className="relative z-[1] flex h-[2.15rem] w-[2.15rem] items-center justify-center rounded-full border border-border-strong bg-bg-elevated text-[13px] font-semibold tabular-nums">
                {s.index}
              </span>
              <div className="pt-0.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="font-display text-[1.5rem] font-bold leading-tight tracking-[-0.015em]">{s.title}</h3>
                  <motion.span
                    className="flex flex-wrap gap-1"
                    initial={{ opacity: 0, scale: reduce ? 1 : 1.25 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                    transition={{ duration: 0.35, delay: 0.45 + (i % 2) * 0.05, ease }}
                  >
                    {s.roles.map((r) => (
                      <RoleTag key={r} id={r} />
                    ))}
                  </motion.span>
                </div>
                <p className="mt-2 max-w-[34rem] text-[16px] leading-relaxed text-text-secondary">{s.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
