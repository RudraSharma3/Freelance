"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE, LINKS } from "@/data/config";

const TRIGGER = "whoami";

export default function EasterEgg() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let buffer = "";
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key).slice(-TRIGGER.length);
      if (buffer === TRIGGER) {
        setOpen(true);
        buffer = "";
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="whoami"
            className="w-full max-w-md rounded-lg border border-border bg-bg-elevated font-mono text-sm shadow-2xl"
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs text-text-tertiary">zsh — whoami</span>
            </div>
            <div className="space-y-2 px-4 py-4 leading-relaxed">
              <p className="text-text-tertiary">$ whoami</p>
              <p className="text-accent-strong">{SITE.name.toLowerCase().replace(" ", "_")}</p>
              <p className="text-text-secondary">{SITE.role}</p>
              <p className="text-text-secondary">{SITE.location} · {SITE.peopleHelped}+ people helped</p>
              <p className="pt-2 text-text-tertiary">$ cat contact.txt</p>
              <p>
                <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="text-signal hover:underline">
                  linkedin
                </a>{" "}
                ·{" "}
                <a href={LINKS.github} target="_blank" rel="noreferrer" className="text-signal hover:underline">
                  github
                </a>{" "}
                ·{" "}
                <a href={`mailto:${LINKS.email}`} className="text-signal hover:underline">
                  email
                </a>
              </p>
              <p className="pt-2 text-xs text-text-tertiary">press esc or click outside to close</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
