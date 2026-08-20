"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { CASE_STUDIES } from "@/data/caseStudies";
import SectionHeading from "@/components/ui/SectionHeading";
import { track } from "@/lib/analytics";

const TAG_COLOR: Record<string, string> = {
  AI: "text-accent-strong border-accent/30",
  Data: "text-signal border-signal/30",
  Automation: "text-text-secondary border-border",
  Research: "text-text-secondary border-border",
};

export default function CaseStudies() {
  const [openSlug, setOpenSlug] = useState<string | null>(CASE_STUDIES[0]?.slug ?? null);

  function handleOpen(slug: string) {
    const next = openSlug === slug ? null : slug;
    setOpenSlug(next);
    if (next) track("case_study_opened", { case_study: slug });
  }

  return (
    <section id="work" className="border-t border-border-soft bg-bg-elevated/30">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Selected work"
          title="Real projects, real numbers"
          description="Drawn from internships, independent projects and research — not client testimonials I can't verify."
        />

        <div className="mt-10 divide-y divide-border-soft border-y border-border-soft">
          {CASE_STUDIES.map((c) => {
            const isOpen = openSlug === c.slug;
            return (
              <div key={c.slug}>
                <button
                  onClick={() => handleOpen(c.slug)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`hidden rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide sm:inline-block ${TAG_COLOR[c.tag]}`}
                    >
                      {c.tag}
                    </span>
                    <span className="font-display text-lg font-medium sm:text-xl">{c.title}</span>
                  </div>
                  <Plus
                    size={18}
                    className={`shrink-0 text-text-tertiary transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-accent" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-[1fr_1fr]">
                        <div>
                          <p className="eyebrow mb-2">Context</p>
                          <p className="text-sm text-text-secondary">{c.context}</p>
                          <p className="eyebrow mb-2 mt-5">Problem</p>
                          <p className="text-sm text-text-secondary">{c.problem}</p>
                        </div>
                        <div>
                          <p className="eyebrow mb-2">What I did</p>
                          <ul className="space-y-1.5">
                            {c.whatIDid.map((w) => (
                              <li key={w} className="flex gap-2 text-sm text-text-secondary">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                                {w}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {c.tech.map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-text-tertiary"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <p className="mt-4 rounded-lg border border-accent/20 bg-accent-soft px-4 py-3 text-sm text-accent-strong">
                            {c.result}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
