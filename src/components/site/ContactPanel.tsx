"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LINKS } from "@/data/config";
import { startProject } from "@/lib/intake";
import { track } from "@/lib/analytics";
import { useReduce } from "@/lib/motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** A vermilion panel at the end: one big line, and three ways to reach us. */
export default function ContactPanel() {
  const reduce = useReduce();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${LINKS.email}`;
    }
  };

  const row =
    "group flex w-full items-center justify-between gap-4 border-t border-white/25 py-5 text-left text-[clamp(1.25rem,2.2vw,1.6rem)] font-display font-bold tracking-[-0.015em] transition-[padding] duration-300 hover:pl-2";
  const arrow =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-base transition-[background-color,color,transform] duration-300 group-hover:bg-white group-hover:text-accent";

  return (
    <section id="contact" className="px-3 pb-3 sm:px-4 sm:pb-4">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto grid max-w-[90rem] gap-12 overflow-hidden rounded-[36px] bg-accent px-6 py-14 text-white sm:px-12 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-16"
      >
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white">Contact</p>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,6.5vw,5.6rem)] font-bold leading-[0.95] tracking-[-0.04em]">
            Got a brief? Let&apos;s build it.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white">
            Tell us what&apos;s broken, slow or missing. We&apos;ll tell you honestly whether we can help, and what it would
            take.
          </p>
        </div>
        <div className="self-end border-b border-white/25">
          <button type="button" className={row} onClick={() => startProject(undefined, "contact")}>
            Start a project
            <span className={`${arrow} group-hover:translate-x-1`} aria-hidden>
              →
            </span>
          </button>
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noreferrer"
            className={row}
            onClick={() => track("start_project_clicked", { from: "whatsapp" })}
          >
            Message on WhatsApp
            <span className={`${arrow} group-hover:-rotate-45`} aria-hidden>
              →
            </span>
          </a>
          <div className={`${row} hover:pl-0`}>
            <a href={`mailto:${LINKS.email}`} className="min-w-0 truncate hover:underline">
              {LINKS.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-full border border-white/40 px-4 py-2 font-sans text-sm font-semibold transition-colors hover:bg-white hover:text-accent"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
