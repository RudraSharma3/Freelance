"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SITE } from "@/data/config";
import { useReduce } from "@/lib/motion";

function Word({ word, i, n, progress, accent, still }: { word: string; i: number; n: number; progress: MotionValue<number>; accent?: boolean; still: boolean }) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.14, 1]);
  return (
    <span className="relative inline-block">
      <motion.span style={{ opacity: still ? 1 : opacity }} className={accent ? "text-accent" : undefined}>
        {word}
      </motion.span>
      {" "}
    </span>
  );
}

/**
 * The one number we use, as a sentence that fills in word by word as you
 * scroll through it. Fully visible straight away for reduced-motion users.
 */
export default function Statement() {
  const reduce = useReduce();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const text = `${SITE.peopleHelped}+ people helped so far, with resumes, portfolios, college projects, messy data and the jobs nobody wants to do by hand. A small number, and a real one.`;
  const words = text.split(" ");

  return (
    <section id="proof" className="section">
      <div className="wrap">
        <p
          ref={ref}
          className="mx-auto max-w-[22ch] text-center font-display text-[clamp(2.1rem,5.2vw,4.4rem)] font-bold leading-[1.08] tracking-[-0.03em] sm:max-w-[24ch]"
        >
          {words.map((w, i) => (
            <Word key={i} word={w} i={i} n={words.length} progress={scrollYProgress} accent={i === 0} still={reduce} />
          ))}
        </p>
      </div>
    </section>
  );
}
