"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const scrollSpring = { type: "spring" as const, duration: 0.6, bounce: 0 };

/** Scroll-in: opacity 0→1, y 40→0, spring ~0.6s, once. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...scrollSpring, delay }}
    >
      {children}
    </motion.div>
  );
}
