"use client";

import { useEffect, useState } from "react";

/** "Scroll" with a line that grows and drains. Fades away once you start scrolling. */
export default function ScrollCue() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const onScroll = () => setGone(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden
      className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 transition-opacity duration-500 sm:block"
      style={{ opacity: gone ? 0 : 1 }}
    >
      <div
        className="rise flex flex-col items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary"
        style={{ ["--d" as string]: "2.2s" }}
      >
        Scroll
        <span className="cue-line" />
      </div>
    </div>
  );
}
