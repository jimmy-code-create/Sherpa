import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Milo — Sherpa's persistent AI tutor persona.
 *
 * Pure presentational SVG + CSS idle animations (blink / breathe / bob).
 * All keyframe animations are neutered globally under prefers-reduced-motion
 * and the in-app reducedMotion preference (see globals.css), so no JS motion
 * guard is needed here.
 */

export function TutorAvatar({
  size = 56,
  className,
  mood = "happy",
}: {
  size?: number;
  className?: string;
  mood?: "happy" | "curious" | "proud";
}) {
  return (
    <div
      className={cn("milo-bob inline-flex shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Milo, your AI tutor"
    >
      <svg viewBox="0 0 96 96" width={size} height={size} aria-hidden="true" className="milo-breathe h-full w-full">
        {/* body / cloak */}
        <path
          d="M48 14c-17 0-26 12-26 30 0 16 8 30 26 30s26-14 26-30c0-18-9-30-26-30z"
          fill="#4F46E5"
        />
        {/* belly highlight */}
        <ellipse cx="48" cy="66" rx="14" ry="12" fill="#6366F1" opacity="0.85" />
        {/* eyes */}
        <g className="milo-eye" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <ellipse cx="38" cy="44" rx="4.6" ry="5.6" fill="#fff" />
          <ellipse cx="58" cy="44" rx="4.6" ry="5.6" fill="#fff" />
        </g>
        <circle cx="38.6" cy="45" r="2.4" fill="#1f2937" />
        <circle cx="58.6" cy="45" r="2.4" fill="#1f2937" />
        {/* brows — lift when curious */}
        <g className={mood === "curious" ? "milo-brow" : undefined}>
          <path d="M32 36q6-4 12-1" stroke="#312e81" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M52 35q6-3 12 1" stroke="#312e81" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>
        {/* smile */}
        {mood === "proud" ? (
          <path d="M38 56q10 10 20 0" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M40 55q8 7 16 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}
        {/* amber spark / graduation cap knot */}
        <circle cx="48" cy="16" r="4.5" fill="#F59E0B" />
        {/* arms */}
        <path d="M24 58q-6 4-4 10" stroke="#4338ca" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M72 58q6 4 4 10" stroke="#4338ca" strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

/** Speech bubble that visually belongs to Milo (tail points to the avatar). */
export function TutorBubble({
  children,
  className,
  tail = "left",
}: {
  children: React.ReactNode;
  className?: string;
  tail?: "left" | "none";
}) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {tail === "left" ? (
        <span
          aria-hidden="true"
          className="absolute -left-[7px] top-5 size-3.5 rotate-45 border-b border-l border-[var(--border-default)] bg-[var(--bg-surface)]"
        />
      ) : null}
      {children}
    </div>
  );
}

/** Step-aware Milo lines for onboarding. */
export function miloOnboardingLine(step: string, name?: string): string {
  const hi = name ? `Hi ${name}! I'm Milo.` : "Hi! I'm Milo.";
  switch (step) {
    case "welcome":
      return `${hi} To build your perfect roadmap, I just need to know a few things. Every step is skippable — takes under a minute.`;
    case "country":
      return "Where are you studying? This decides which boards and curricula I'll show you.";
    case "curriculum":
      return "Which board are you following? I'll tailor notes and practice to its exams.";
    case "level":
      return "Which class are you in? Roadmaps are written for this level.";
    case "stream":
      return "Pick your stream — it only shapes senior-secondary subjects.";
    case "proficiency":
      return "How much do you already know? Beginners get more foundation time.";
    case "goals":
      return "How many hours a week can you study? I'll size your roadmap to fit.";
    case "language":
      return "Which language should your notes be in?";
    case "complete":
      return `${hi} Your path is set — your first roadmap is ready. Let's go!`;
    default:
      return `${hi} Let's keep going.`;
  }
}

/** Dashboard guide-loop lines. */
export function miloDashboardLine(opts: {
  name?: string;
  chapterTitle?: string;
  minutes?: number;
  hasSubjects: boolean;
  dueCount: number;
}): string {
  const hi = opts.name ? `Hey ${opts.name}` : "Hey";
  if (!opts.hasSubjects) {
    return `${hi}! Your path is empty. Let's pick a subject so I can start teaching you.`;
  }
  if (opts.chapterTitle) {
    return `${hi}, let's conquer ${opts.chapterTitle} today. I've broken it down into a ${opts.minutes ?? 15}-minute session. Ready?`;
  }
  if (opts.dueCount > 0) {
    return `${hi}! You have ${opts.dueCount} card${opts.dueCount === 1 ? "" : "s"} due for review. Want to clear them first?`;
  }
  return `${hi}! Your plan is ready. Pick a chapter and I'll guide you through it.`;
}
