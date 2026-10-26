"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { SITE } from "@/data/config";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16 sm:pt-24">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.14] blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-6 flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Available for freelance projects · {SITE.location} · Remote
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance font-display text-[2.6rem] font-medium leading-[1.08] tracking-tight sm:text-6xl"
          >
            You bring the problem.
            <br />
            <span className="text-accent-strong">I build the solution.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-balance text-[16px] leading-relaxed text-text-secondary"
          >
            I help students, professionals and small teams turn messy career, technical and
            business problems into usable solutions — across AI, data, automation, web and career
            technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button href="#start" size="lg">
              Start a project →
            </Button>
            <Button href="#work" variant="secondary" size="lg">
              See what I build →
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-8 text-sm text-text-tertiary"
          >
            <span className="text-accent-strong">{SITE.peopleHelped}+</span> people helped so far
            — resumes, portfolios, data pipelines, ML projects and automations.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[340px]"
        >
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[2rem] opacity-60 blur-2xl"
            style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }}
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-bg-elevated">
            <Image
              src="/images/rudra-avatar.jpg"
              alt={SITE.name}
              width={680}
              height={680}
              priority
              className="aspect-square w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
