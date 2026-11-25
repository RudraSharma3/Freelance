"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/config";
import StartButton from "@/components/site/StartButton";
import { cn } from "@/lib/utils";

const LINKS_NAV = [
  { href: "#services", label: "Services" },
  { href: "#team", label: "Team" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
];

/** Hides on the way down, comes back on the way up. A thin progress line sits on top. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const bar = useRef<HTMLSpanElement>(null);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      setScrolled(y > 8);
      if (!openRef.current) setHidden(y > lastY && y > 240);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["start-here", "services", "team", "work", "process", "start", "contact"].forEach((id) => {
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden>
        <span ref={bar} className="block h-full origin-left scale-x-0 bg-accent" />
      </div>
      <header
        onFocus={() => setHidden(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,border-color,background-color] duration-500 ease-soft",
          hidden && "-translate-y-full",
          scrolled || open ? "border-b border-border bg-bg/90 backdrop-blur-md" : "border-b border-transparent"
        )}
      >
        <nav className="wrap flex h-16 items-center justify-between gap-6" aria-label="Main">
          <a href="#top" className="font-display text-lg font-bold tracking-tight whitespace-nowrap">
            {SITE.shortName}
            <span className="text-accent">.</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS_NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "relative text-[15px] transition-colors hover:text-text-primary",
                  active === l.href ? "text-text-primary" : "text-text-secondary"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 right-0 h-[2px] origin-left rounded-full bg-accent transition-transform duration-300",
                    active === l.href ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <StartButton size="sm" from="nav" className="hidden sm:inline-flex">
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

        {open && (
          <div id="mobile-menu" className="wrap pb-6 md:hidden">
            {[...LINKS_NAV, { href: "#contact", label: "Contact" }].map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-border py-4 font-display text-xl font-semibold"
              >
                {l.label}
                <span className="font-sans text-sm font-normal text-text-tertiary">0{i + 1}</span>
              </a>
            ))}
            <StartButton from="menu" className="mt-5 w-full justify-center" onClick={() => setOpen(false)}>
              Start a project
            </StartButton>
          </div>
        )}
      </header>
    </>
  );
}
