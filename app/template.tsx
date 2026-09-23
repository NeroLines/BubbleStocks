"use client";
import { motion, useReducedMotion } from "motion/react";

// Runs on every navigation (Next re-mounts template.tsx per route), so a soft
// cross-fade replaces the hard cut when switching tabs. Combined with a stable
// scrollbar gutter (globals.css) this stops the layout from jumping.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
