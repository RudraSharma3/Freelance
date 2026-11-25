"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const subscribe = () => () => {};

/**
 * "Does this visitor prefer reduced motion?", but hydration-safe: it answers
 * false on the server and during hydration (the server can't know), then the
 * real preference right after. Use this instead of framer's useReducedMotion
 * whenever the answer changes what gets rendered.
 */
export function useReduce(): boolean {
  const pref = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  return hydrated && !!pref;
}
