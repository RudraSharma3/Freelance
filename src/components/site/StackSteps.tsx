"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PROCESS_STEPS, type ProcessStep } from "@/data/process";
import Label from "@/components/site/Label";
import Reveal from "@/components/site/Reveal";
import RoleTag from "@/components/site/RoleTag";
import { useReduce } from "@/lib/motion";

function Card({ step, i, n, progress }: { step: ProcessStep; i: number; n: number; progress: MotionValue<number> }) {
  const reduce = useReduce();
  // once the cards after this one start piling on, ease it back a touch
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - i) * 0.025]);
  const dim = useTransform(progress, [i / n, 1], [1, 0.6]);
  return (
    <li className="sticky" style={{ top: `calc(6.5rem + ${i * 0.9}rem)` }}>
      <motion.div
        style={{ scale: reduce ? 1 : scale, transformOrigin: "50% 0%" }}
        className="mb-6 grid gap-6 rounded-[28px] border border-border bg-bg-elevated p-7 shadow-[0_-18px_50px_-40px_rgba(22,22,26,0.5)] sm:grid-cols-[7rem_1fr] sm:p-10"
      >
        <motion.span style={{ opacity: reduce ? 1 : dim }} className="font-display text-[3.2rem] font-bold leading-none tracking-[-0.05em] text-accent sm:text-[4.2rem]">
          {step.index}
        </motion.span>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-[1.7rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2rem]">{step.title}</h3>
            <span className="flex flex-wrap gap-1.5">
              {step.roles.map((r) => (
                <RoleTag key={r} id={r} />
              ))}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-text-secondary">{step.description}</p>
        </div>
      </motion.div>
    </li>
  );
}

/** The seven steps as cards that stack on top of each other while you scroll. */
export default function StackSteps() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.3", "end end"] });
  const n = PROCESS_STEPS.length;

  return (
    <section id="process" className="section">
      <div className="wrap">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Label>How we work</Label>
          <h2 className="mt-6 font-display text-[clamp(2.3rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.035em]">
            From first message to launch.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            Seven steps, and you always know which one you&apos;re in. Small jobs skip what they don&apos;t need: a resume
            doesn&apos;t need a test plan.
          </p>
        </Reveal>

        <ol ref={ref} className="mx-auto mt-14 max-w-4xl pb-[10vh]">
          {PROCESS_STEPS.map((s, i) => (
            <Card key={s.index} step={s} i={i} n={n} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
}
