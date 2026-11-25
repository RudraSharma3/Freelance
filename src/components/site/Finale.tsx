"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { LINKS } from "@/data/config";
import StartButton, { LinkButton } from "@/components/site/StartButton";
import { track } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;

/** The closing screen. Its sequence plays once it's mostly on screen. */
export default function Finale() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const [copied, setCopied] = useState(false);

  const show = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay: reduce ? 0 : delay, ease },
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${LINKS.email}`;
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="flex min-h-svh flex-col justify-center border-t border-border py-24 text-center"
      style={{ background: "color-mix(in srgb, var(--accent-soft) 55%, var(--bg))" }}
    >
      <div className="wrap">
        <motion.p className="eyebrow" {...show(0.1)}>
          06 · Contact
        </motion.p>
        <motion.h2
          className="mx-auto mt-8 max-w-[14ch] font-display text-[clamp(3.2rem,10vw,8rem)] font-bold leading-[0.92] tracking-[-0.04em]"
          {...show(0.25)}
        >
          Bring us the problem.
        </motion.h2>
        <motion.div
          className="mx-auto mt-10 h-[3px] w-20 origin-center rounded-full bg-accent"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1, delay: reduce ? 0 : 0.9, ease }}
        />
        <motion.p className="mx-auto mt-10 max-w-[34rem] text-lg leading-relaxed text-text-secondary sm:text-xl" {...show(1.2)}>
          Tell us what&apos;s broken, slow or missing. We&apos;ll tell you honestly whether we can help, and what it would take.
        </motion.p>
        <motion.div className="mt-10 flex flex-wrap items-center justify-center gap-3" {...show(1.5)}>
          <StartButton size="lg" from="finale">
            Start a project
          </StartButton>
          <LinkButton href={LINKS.whatsapp} external size="lg" onClick={() => track("start_project_clicked", { from: "whatsapp" })}>
            Message on WhatsApp ↗
          </LinkButton>
        </motion.div>
        <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[15px]" {...show(1.8)}>
          <a href={`mailto:${LINKS.email}`} className="border-b border-accent pb-0.5 font-medium hover:text-accent-strong">
            {LINKS.email}
          </a>
          <button type="button" onClick={copy} className="rounded-full border border-border-strong px-3 py-1 text-sm font-medium hover:border-text-primary">
            {copied ? "Copied" : "Copy email"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
