"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { CASE_STUDIES } from "@/data/caseStudies";
import Brand from "@/components/site/Brand";
import StartButton from "@/components/site/StartButton";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { useReduce } from "@/lib/motion";

const LINKS_NAV = [
  { href: "#start-here", label: "Start here" },
  { href: "#services", label: "Services" },
  { href: "#studio", label: "Studio" },
  ...(CASE_STUDIES.length ? [{ href: "#work", label: "Work" }] : []),
  { href: "#process", label: "Process" },
];

/**
 * A floating pill. It tightens once you leave the hero, and a soft highlight
 * slides to whichever section you're reading.
 */
export default function Nav() {
  const reduce = useReduce();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["top", ...LINKS_NAV.map((l) => l.href.slice(1)), "start", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      spy.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <div
        className={cn(
          "pointer-events-auto w-full rounded-[28px] border bg-bg-elevated/85 backdrop-blur-xl transition-[max-width,box-shadow,border-color] duration-700 ease-soft",
          compact ? "max-w-[52rem] border-border shadow-[0_12px_40px_-18px_rgba(22,22,26,0.28)]" : "max-w-[76rem] border-transparent"
        )}
      >
        <nav className="flex h-14 items-center justify-between gap-4 pl-5 pr-2" aria-label="Main">
          <a href="#top" className="whitespace-nowrap font-display text-[1.15rem] font-bold tracking-tight">
            <Brand />
          </a>

          <LayoutGroup>
            <div className="hidden items-center md:flex">
              {LINKS_NAV.map((l) => {
                const on = active === l.href;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative isolate rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                      on ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-[1] rounded-full bg-bg-elevated-2"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {l.label}
                  </a>
                );
              })}
            </div>
          </LayoutGroup>

          <div className="flex items-center gap-1.5">
            <StartButton size="sm" from="nav" className="max-[399px]:hidden">
              Start a project
            </StartButton>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-9 items-center rounded-full border border-border-strong px-4 text-sm font-medium md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="mobile-menu"
              data-lenis-prevent
              className="overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="px-5 pb-5 pt-1">
                {[...LINKS_NAV, { href: "#contact", label: "Contact" }].map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => {
                      // the menu pauses scrolling, so close it first and scroll ourselves
                      e.preventDefault();
                      setOpen(false);
                      scrollToId(l.href.slice(1));
                    }}
                    className="flex items-center justify-between border-t border-border py-3.5 font-display text-xl font-semibold"
                  >
                    {l.label}
                    <span className="text-text-tertiary" aria-hidden>
                      →
                    </span>
                  </a>
                ))}
                <StartButton from="menu" className="mt-3 w-full justify-center" onClick={() => setOpen(false)}>
                  Start a project
                </StartButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
