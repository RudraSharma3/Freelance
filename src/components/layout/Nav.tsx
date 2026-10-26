"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { SITE } from "@/data/config";

const LINKS_NAV = [
  { href: "#services", label: "Services" },
  { href: "#proof", label: "Proof" },
  { href: "#work", label: "Work" },
  { href: "#capability", label: "Capability" },
  { href: "#about", label: "About" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="font-display text-lg font-medium tracking-tight">
          {SITE.name}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS_NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button href="#start" size="md">
            Start a project →
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="text-text-secondary md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border-soft px-5 pb-6 md:hidden"
        >
          <div className="flex flex-col gap-4 pt-4">
            {LINKS_NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                {l.label}
              </a>
            ))}
            <Button href="#start" size="md" onClick={() => setOpen(false)} className="mt-2 w-fit">
              Start a project →
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
