"use client";

/**
 * Motion primitives for the UI overhaul (framer-motion).
 *
 * All JS-driven animation respects prefers-reduced-motion (and the app's
 * own reducedMotion preference) via useReducedMotion; CSS transitions are
 * already neutered globally under prefers-reduced-motion / data-reduced-motion.
 */
import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** Fade/slide page transitions on every route change. Wrap once in the root layout. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Reveal-on-scroll wrapper: slides up and fades in the first time it enters the viewport. */
export function ScrollReveal({
  children,
  delay = 0,
  className,
  y = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Gentle infinite float for hero preview cards. */
export function Float({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -10, 0] }}
      transition={reduce ? undefined : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
