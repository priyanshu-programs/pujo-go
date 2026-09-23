"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DHAK, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Rise distance in px. Defaults to the Hero's 30. */
  distance?: number;
  delay?: number;
  className?: string;
};

/**
 * Scroll-triggered reveal on the Hero's beat: fade, rise and a slight scale-up
 * that overshoots before settling. Honours prefers-reduced-motion by rendering
 * the content in its final state with no transition.
 */
export function Reveal({
  children,
  distance = 30,
  delay = 0,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewportOnce}
      transition={{ ...DHAK, delay }}
    >
      {children}
    </motion.div>
  );
}
