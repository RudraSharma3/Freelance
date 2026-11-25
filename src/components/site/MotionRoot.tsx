"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Framer skips transform animations for visitors who ask for reduced motion. */
export default function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
