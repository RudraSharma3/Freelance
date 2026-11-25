"use client";

import type Lenis from "lenis";

/**
 * One shared smooth-scroll instance (set up by <SmoothScroll />). Everything
 * that scrolls the page or locks it goes through these helpers, so it works
 * the same with or without Lenis (Lenis is off for reduced-motion users).
 */
let lenis: Lenis | null = null;

/** Room for the floating nav. Lenis reads it from `scroll-padding-top` in globals.css; the fallback uses this. */
export const NAV_OFFSET = -96;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    const l = lenis;
    // A sheet or menu may have paused scrolling, and resuming cancels any glide
    // already in progress, so wait (a few frames at most) until it's running.
    let frames = 0;
    const go = () => {
      if (l.isStopped && frames++ < 30) {
        requestAnimationFrame(go);
        return;
      }
      l.scrollTo(el, { duration: 1.2, force: true }); // offset comes from scroll-padding-top
    };
    requestAnimationFrame(go);
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }
}

/** Freeze page scrolling while a sheet or menu is open. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
