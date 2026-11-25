"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useReduce } from "@/lib/motion";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * A band of service names drifting sideways. Scrolling speeds it up, and
 * scrolling back up reverses it. Static for reduced-motion users.
 */
export default function Marquee({ items, speed = 2.2 }: { items: string[]; speed?: number }) {
  const reduce = useReduce();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    let move = direction.current * speed * (delta / 1000);
    move += direction.current * Math.abs(move * b);
    baseX.set(baseX.get() - move);
  });

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center whitespace-nowrap px-6 font-display text-[clamp(1.6rem,3.2vw,2.6rem)] font-bold tracking-[-0.02em]">
          {t}
          <span className="ml-12 text-accent" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-border bg-bg-elevated py-5">
      <motion.div className="flex w-max" style={{ x: reduce ? 0 : x }}>
        {row(false)}
        {row(true)}
      </motion.div>
    </div>
  );
}
