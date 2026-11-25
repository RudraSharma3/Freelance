"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/scroll";

/**
 * Inertial smooth scrolling for mouse wheels and trackpads. Touch scrolling
 * stays native. In-page anchor links glide to their section. Skipped
 * entirely for people who prefer reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      anchors: { duration: 1.2 }, // the nav offset comes from scroll-padding-top
      // let anything marked data-lenis-prevent (sheets, menus) scroll natively
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);
  return null;
}
