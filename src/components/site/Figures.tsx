"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ServiceGroup } from "@/data/services";
import { useReduce } from "@/lib/motion";

/**
 * Small drawn illustrations for each service group. They're diagrams of the
 * kind of work, not screenshots of client projects. Parts arrive one after
 * another when the figure scrolls into view.
 */

function Part({ i, children, className }: { i: number; children: ReactNode; className?: string }) {
  const reduce = useReduce();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const Bar = ({ w, className = "" }: { w: string; className?: string }) => (
  <span className={`block h-2 rounded-full bg-border-strong/70 ${className}`} style={{ width: w }} />
);

function Browser() {
  return (
    <div className="w-full max-w-[25rem]">
      <Part i={0} className="overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[0_24px_50px_-30px_rgba(22,22,26,0.35)]">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="ml-3 rounded-full bg-bg px-3 py-1 text-[11px] text-text-tertiary">yourdomain.com</span>
        </div>
        <div className="p-5">
          <Part i={1} className="flex items-center justify-between">
            <Bar w="22%" className="bg-text-primary/80" />
            <span className="flex gap-2">
              <Bar w="2rem" />
              <Bar w="2rem" />
              <Bar w="2rem" />
            </span>
          </Part>
          <Part i={2} className="mt-7 space-y-2.5">
            <span className="block h-4 w-[78%] rounded-full bg-text-primary/85" />
            <span className="block h-4 w-[56%] rounded-full bg-text-primary/85" />
            <Bar w="64%" className="mt-4" />
            <Bar w="48%" />
          </Part>
          <Part i={3} className="mt-5 flex gap-2">
            <span className="h-7 w-24 rounded-full bg-accent" />
            <span className="h-7 w-20 rounded-full border border-border-strong" />
          </Part>
          <Part i={4} className="mt-6 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((k) => (
              <span key={k} className="h-14 rounded-lg bg-bg-elevated-2" />
            ))}
          </Part>
        </div>
      </Part>
      <Part i={5} className="mt-4 flex flex-wrap justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
        {[
          ["Designed", "#c93d1b"],
          ["Built", "#2747c9"],
          ["Tested", "#1f7a4d"],
          ["Live", "#16161a"],
        ].map(([t, c], k) => (
          <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-2.5 py-1 text-text-secondary">
            <i className="h-2 w-2 rounded-[2px]" style={{ background: c }} />
            {t}
            {k < 3 && <span className="text-text-tertiary">→</span>}
          </span>
        ))}
      </Part>
    </div>
  );
}

function Table() {
  const before = [
    ["blue tee", "12/03/24", "4,500"],
    ["BLUE TEE ", "2024-03-12", "4500"],
    ["Red cap", "", "3 200"],
    ["red cap", "13-03-2024", "n/a"],
  ];
  const after = [
    ["Blue tee", "2024-03-12", "4500"],
    ["Red cap", "2024-03-13", "3200"],
  ];
  const row = "grid grid-cols-[1.1fr_1.2fr_0.8fr] gap-2 px-3 py-2 text-[12px] tabular-nums";
  return (
    <div className="w-full max-w-[24rem] space-y-3">
      <Part i={0} className="overflow-hidden rounded-2xl border border-border bg-bg-elevated">
        <p className="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">Before</p>
        {before.map((r, k) => (
          <Part key={k} i={k + 1} className={`${row} border-b border-border-soft last:border-0 ${k % 2 ? "text-accent-strong line-through decoration-accent/50" : "text-text-secondary"}`}>
            {r.map((c, j) => (
              <span key={j} className={c === "" || c === "n/a" ? "rounded bg-accent-soft px-1 text-accent-strong no-underline" : ""}>
                {c === "" ? "missing" : c}
              </span>
            ))}
          </Part>
        ))}
      </Part>
      <Part i={5} className="flex justify-center text-text-tertiary" aria-hidden>
        ↓
      </Part>
      <Part i={6} className="overflow-hidden rounded-2xl border border-signal/40 bg-bg-elevated">
        <p className="flex justify-between border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-signal">
          After <span>Validated ✓</span>
        </p>
        {after.map((r, k) => (
          <div key={k} className={`${row} border-b border-border-soft text-text-primary last:border-0`}>
            {r.map((c, j) => (
              <span key={j}>{c}</span>
            ))}
          </div>
        ))}
      </Part>
    </div>
  );
}

function Resume() {
  return (
    <div className="relative w-full max-w-[22rem]">
      <Part i={0} className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-[0_24px_50px_-30px_rgba(22,22,26,0.35)]">
        <span className="block h-4 w-1/2 rounded-full bg-text-primary/85" />
        <Bar w="70%" className="mt-2.5" />
        <div className="mt-6 space-y-5">
          {[0, 1].map((k) => (
            <Part key={k} i={k + 1}>
              <span className="block h-2.5 w-1/3 rounded-full bg-text-primary/60" />
              <div className="mt-3 space-y-2">
                <Bar w="92%" />
                <Bar w="84%" />
                {k === 0 && (
                  <span className="block rounded-lg border border-accent/30 bg-accent-soft px-2.5 py-2 text-[11.5px] leading-snug text-accent-strong">
                    Did X, measured by Y, by doing Z
                  </span>
                )}
                <Bar w="76%" />
              </div>
            </Part>
          ))}
        </div>
        <Part i={3} className="mt-6 flex flex-wrap gap-1.5">
          {["Python", "SQL", "React"].map((s) => (
            <span key={s} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-secondary">
              {s}
            </span>
          ))}
        </Part>
      </Part>
      <Part i={4} className="absolute -bottom-10 -right-3 w-[62%] rounded-2xl border border-border bg-bg-elevated p-3.5 shadow-[0_20px_40px_-25px_rgba(22,22,26,0.4)] sm:-right-8">
        <div className="flex items-center gap-2.5">
          <span className="h-8 w-8 shrink-0 rounded-full bg-bg-elevated-2" />
          <div className="flex-1 space-y-1.5">
            <span className="block h-2 w-3/4 rounded-full bg-text-primary/70" />
            <Bar w="90%" />
          </div>
        </div>
        <p className="mt-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">Headline, rewritten</p>
      </Part>
    </div>
  );
}

function Checklist() {
  const tests: [string, string, "pass" | "fixed"][] = [
    ["Sign up", "iPhone · Safari", "pass"],
    ["Checkout", "Android · Chrome", "fixed"],
    ["Contact form", "Windows · Edge", "pass"],
    ["Menu", "iPad · Safari", "pass"],
    ["Image upload", "Mac · Firefox", "fixed"],
  ];
  return (
    <div className="w-full max-w-[24rem]">
      <Part i={0} className="overflow-hidden rounded-2xl border border-border bg-bg-elevated">
        <p className="flex justify-between border-b border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
          Test run <span>Before launch</span>
        </p>
        {tests.map(([what, where, state], k) => (
          <Part key={what} i={k + 1} className="flex items-center gap-3 border-b border-border-soft px-4 py-3 last:border-0">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${state === "pass" ? "bg-signal" : "bg-accent"}`}
              aria-hidden
            >
              {state === "pass" ? "✓" : "!"}
            </span>
            <span className="flex-1 text-[13px]">
              <b className="font-semibold">{what}</b>
              <span className="block text-[12px] text-text-tertiary">{where}</span>
            </span>
            <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${state === "pass" ? "text-signal" : "text-accent-strong"}`}>
              {state === "pass" ? "Pass" : "Fixed · re-tested"}
            </span>
          </Part>
        ))}
      </Part>
    </div>
  );
}

export default function GroupFigure({ id }: { id: ServiceGroup["id"] }) {
  if (id === "build") return <Browser />;
  if (id === "data") return <Table />;
  if (id === "students") return <Resume />;
  return <Checklist />;
}
