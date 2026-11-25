"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { lockScroll } from "@/lib/scroll";
import { useReduce } from "@/lib/motion";

/**
 * The "click to see more" view: slides up over the page. Esc or the backdrop
 * closes it; focus moves in, stays in, and returns to whatever opened it.
 */
export default function Sheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const reduce = useReduce();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKey);
    lockScroll(true);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            aria-label="Close"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-[#16161a]/30 backdrop-blur-[3px]"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            aria-label={label}
            className="relative max-h-[90svh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-[28px] bg-bg-elevated px-5 pb-10 pt-6 shadow-[0_-20px_60px_-30px_rgba(22,22,26,0.35)] md:rounded-[28px] md:px-12 md:pb-12 md:pt-10"
            initial={{ y: reduce ? 0 : 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : 28, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sticky top-0 z-10 -mb-2 flex justify-end">
              <button
                ref={closeRef}
                onClick={onClose}
                className="rounded-full border border-border-strong bg-bg-elevated px-4 py-2 text-sm font-medium transition-colors hover:border-text-primary"
              >
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
