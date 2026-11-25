"use client";

import type { ReactNode } from "react";
import { startProject } from "@/lib/intake";
import { cn } from "@/lib/utils";

const styles = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  dark: "bg-text-primary text-white hover:bg-black",
  quiet: "border border-border-strong text-text-primary hover:border-text-primary",
};

/** "Start a project" — tracks the click, optionally pre-fills the form, scrolls to it. */
export default function StartButton({
  children,
  need,
  from,
  variant = "primary",
  size = "md",
  className,
  onClick,
}: {
  children: ReactNode;
  need?: string;
  from?: string;
  variant?: keyof typeof styles;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  const sizes = { sm: "h-9 px-4 text-sm", md: "h-11 px-5 text-[15px]", lg: "h-[52px] px-6 text-base" };
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        startProject(need, from);
      }}
      className={cn(
        "group inline-flex items-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,border-color,transform] duration-200 active:scale-[0.98]",
        sizes[size],
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

/** The same look for ordinary links. */
export function LinkButton({
  href,
  children,
  variant = "quiet",
  size = "md",
  external,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  size?: "sm" | "md" | "lg";
  external?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const sizes = { sm: "h-9 px-4 text-sm", md: "h-11 px-5 text-[15px]", lg: "h-[52px] px-6 text-base" };
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,border-color,transform] duration-200 active:scale-[0.98]",
        sizes[size],
        styles[variant],
        className
      )}
    >
      {children}
    </a>
  );
}
