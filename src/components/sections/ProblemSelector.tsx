"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PROBLEMS } from "@/data/problems";
import { SERVICES } from "@/data/services";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { track } from "@/lib/analytics";

export default function ProblemSelector() {
  const [openId, setOpenId] = useState<string | null>(null);

  function handleToggle(id: string) {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next) track("service_selected", { service: id });
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Start here"
        title="What are you trying to solve?"
        description="Pick the closest match. Each one expands into what I&apos;d actually do about it."
      />

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROBLEMS.map((problem) => {
          const service = SERVICES.find((s) => s.id === problem.id)!;
          const isOpen = openId === problem.id;
          return (
            <div
              key={problem.id}
              className="overflow-hidden rounded-2xl border border-border bg-bg-elevated/60 transition-colors hover:border-accent/30"
            >
              <button
                onClick={() => handleToggle(problem.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <div>
                  <p className="font-display text-lg font-medium">{problem.question}</p>
                  <p className="mt-1 text-sm text-text-tertiary">{problem.label}</p>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-text-tertiary transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-accent" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="border-t border-border-soft px-6 py-5">
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {service.problem}
                      </p>

                      <p className="eyebrow mb-2 mt-4">What you get</p>
                      <ul className="space-y-1.5">
                        {service.deliverables.map((d) => (
                          <li key={d} className="flex gap-2 text-sm text-text-secondary">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                            {d}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-4 text-sm text-text-tertiary">
                        <span className="text-text-secondary">Who it&apos;s for — </span>
                        {service.whoFor}
                      </p>

                      <div className="mt-5">
                        <Button href="#start" size="md">
                          {service.cta} <ArrowRight size={15} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
