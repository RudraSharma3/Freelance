import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The small pill that sits above each section heading. */
export default function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-[13px] font-medium text-text-secondary",
        className
      )}
    >
      <i className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {children}
    </span>
  );
}
