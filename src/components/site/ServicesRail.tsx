"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { SERVICE_GROUPS, serviceById, type ServiceGroup, type ServiceId } from "@/data/services";
import type { DisciplineId } from "@/data/disciplines";
import GroupFigure from "@/components/site/Figures";
import Label from "@/components/site/Label";
import Reveal from "@/components/site/Reveal";
import RoleTag from "@/components/site/RoleTag";
import Sheet from "@/components/site/Sheet";
import ServiceDetail from "@/components/site/ServiceDetail";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useReduce } from "@/lib/motion";

const TINT: Record<ServiceGroup["id"], string> = {
  build: "color-mix(in srgb, #c93d1b 9%, #ffffff)",
  data: "color-mix(in srgb, #2747c9 8%, #ffffff)",
  students: "color-mix(in srgb, #7a3fb0 8%, #ffffff)",
  testing: "color-mix(in srgb, #1f7a4d 9%, #ffffff)",
};
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Services as a rail. On wide screens the section pins and the four panels
 * slide sideways while you scroll down; on phones (or with reduced motion)
 * they simply stack.
 */
export default function ServicesRail() {
  const reduce = useReduce();
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<ServiceId | null>(null);
  const close = useCallback(() => setActive(null), []);
  const distance = useMotionValue(0);
  const n = SERVICE_GROUPS.length;

  // Decide the layout: sideways only on wide screens without reduced motion.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setHorizontal(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  // Once the sideways rail is on screen, measure how far it has to travel.
  useEffect(() => {
    if (!horizontal || !rail.current) return;
    const el = rail.current;
    const measure = () => distance.set(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [horizontal, distance]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());
  useMotionValueEvent(scrollYProgress, "change", (v) => setIndex(Math.min(n - 1, Math.round(v * (n - 1)))));

  const open = (id: ServiceId) => {
    setActive(id);
    track("service_selected", { service: id, from: "services" });
  };
  const service = active ? serviceById(active) : null;

  const header = (
    <div className="wrap flex flex-wrap items-end justify-between gap-6">
      <div>
        <Label>Services</Label>
        <h2 className="mt-6 font-display text-[clamp(2.3rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.035em]">
          Four kinds of work.
        </h2>
      </div>
      {horizontal && (
        <div className="flex items-center gap-4 pb-2 text-sm font-medium tabular-nums text-text-secondary" aria-hidden>
          <span>
            {pad(index + 1)} <span className="text-text-tertiary">/ {pad(n)}</span>
          </span>
          <span className="h-1 w-40 overflow-hidden rounded-full bg-border">
            <motion.span className="block h-full origin-left rounded-full bg-accent" style={{ scaleX: scrollYProgress }} />
          </span>
        </div>
      )}
    </div>
  );

  const panels = SERVICE_GROUPS.map((g, i) => {
    const roles = [...new Set(g.services.flatMap((s) => serviceById(s).roles))] as DisciplineId[];
    return (
      <article
        key={g.id}
        className={cn(
          "grid shrink-0 overflow-hidden rounded-[32px] border border-border bg-bg-elevated lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]",
          horizontal ? "h-[min(66vh,38rem)] w-[min(76vw,62rem)]" : "w-full"
        )}
      >
        <div className="flex flex-col p-7 sm:p-10">
          <p className="font-display text-sm font-bold tabular-nums text-accent">{pad(i + 1)}</p>
          <h3 className="mt-3 font-display text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">{g.title}</h3>
          <p className="mt-4 text-[16px] leading-relaxed text-text-secondary">{g.line}</p>
          <ul className="mt-6">
            {g.services.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => open(id)}
                  className="group flex w-full items-center justify-between gap-4 border-t border-border py-3.5 text-left"
                >
                  <span className="text-[16px] font-semibold transition-colors group-hover:text-accent-strong">{serviceById(id).name}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-sm transition-[background-color,border-color,color,transform] group-hover:translate-x-0.5 group-hover:border-accent group-hover:bg-accent group-hover:text-white" aria-hidden>
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
            {roles.map((r) => (
              <RoleTag key={r} id={r} />
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="relative order-first flex min-h-[22rem] items-center justify-center overflow-hidden p-6 lg:order-none lg:min-h-0"
          style={{ background: TINT[g.id] }}
        >
          <div className="w-full [@media(max-height:760px)]:scale-[0.88]">
            <div className="flex justify-center">
              <GroupFigure id={g.id} />
            </div>
          </div>
          <span className="absolute left-6 top-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">{g.figure}</span>
        </div>
      </article>
    );
  });

  return (
    <section
      id="services"
      ref={section}
      className="relative"
      style={horizontal ? { height: `${n * 95 + 40}vh` } : undefined}
    >
      {horizontal ? (
        <div className="sticky top-0 flex h-screen flex-col justify-center gap-10 overflow-hidden pt-16">
          {header}
          <motion.div ref={rail} style={{ x }} className="flex w-max gap-6 pl-[max(2.5rem,calc((100vw-76rem)/2+2.5rem))] pr-[8vw]">
            {panels}
          </motion.div>
        </div>
      ) : (
        <div className="section">
          {header}
          <div ref={rail} className="wrap mt-12 grid gap-6">
            {panels.map((p, i) => (
              <Reveal key={i}>{p}</Reveal>
            ))}
          </div>
        </div>
      )}

      <Sheet open={!!service} onClose={close} label={service?.name ?? ""}>
        {service && (
          <>
            <p className="eyebrow">{SERVICE_GROUPS.find((g) => g.services.includes(service.id))?.title}</p>
            <h3 className="mt-3 pr-16 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.025em]">
              {service.name}
            </h3>
            <div className="mt-6">
              <ServiceDetail service={service} onStart={close} />
            </div>
          </>
        )}
      </Sheet>
    </section>
  );
}
