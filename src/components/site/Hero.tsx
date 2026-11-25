"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SERVICES } from "@/data/services";
import StartButton, { LinkButton } from "@/components/site/StartButton";
import Marquee from "@/components/site/Marquee";
import { useReduce } from "@/lib/motion";

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

/** Each word sits in its own clipped box and slides up into place. */
function Words({ text, from, className }: { text: string; from: number; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="word">
            <span className={className} style={d(from + i * 0.07)}>
              {w}
            </span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

/**
 * Centred hero. On load the headline rises word by word; as you scroll away
 * it drifts up and softens, and the services band picks up speed.
 */
export default function Hero() {
  const reduce = useReduce();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-32 sm:pt-40">
      <motion.div style={reduce ? undefined : { y, opacity, scale }} className="wrap pb-16 text-center sm:pb-24">
        <p className="fade-up inline-flex items-center gap-2.5 rounded-full border border-border bg-bg-elevated px-4 py-2 text-[13px] font-medium text-text-secondary" style={d(0.15)}>
          <i className="ping relative h-2 w-2 rounded-full bg-signal text-signal" aria-hidden />
          Taking new projects · Working remotely
        </p>

        <h1 className="mx-auto mt-8 max-w-[13ch] font-display text-[clamp(3.1rem,9.6vw,8.6rem)] font-bold leading-[0.95] tracking-[-0.04em]">
          <Words text="You bring the problem." from={0.3} />
          <Words text="We build the fix." from={0.62} className="text-accent" />
        </h1>

        <p className="fade-up mx-auto mt-8 max-w-[36rem] text-lg leading-relaxed text-text-secondary sm:text-xl" style={d(1.05)}>
          A small freelance team. Design, development and testing under one roof, with AI and data work when a
          project needs it.
        </p>

        <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style={d(1.25)}>
          <StartButton size="lg" from="hero">
            Start a project
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </StartButton>
          <LinkButton href="#start-here" size="lg">
            What do you need?
          </LinkButton>
        </div>
      </motion.div>

      <div className="fade-up" style={d(1.45)}>
        <Marquee items={SERVICES.filter((s) => s.id !== "custom").map((s) => s.name)} />
      </div>
    </section>
  );
}
