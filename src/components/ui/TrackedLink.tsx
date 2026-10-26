"use client";

import type { ReactNode } from "react";
import type { EventName } from "@/types/analytics";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function TrackedLink({
  href,
  children,
  event,
  meta,
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  event: EventName;
  meta?: Record<string, string>;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(className)}
      onClick={() => track(event, meta)}
    >
      {children}
    </a>
  );
}
