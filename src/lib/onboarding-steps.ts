/**
 * Onboarding step registry — shared between the server page (route
 * validation) and the client wizard. Must stay free of "use client" so
 * server components can import it.
 */
export const STEPS = [
  { slug: "welcome", label: "Welcome" },
  { slug: "country", label: "Country" },
  { slug: "curriculum", label: "Board" },
  { slug: "level", label: "Level" },
  { slug: "stream", label: "Stream" },
  { slug: "proficiency", label: "Level of knowledge" },
  { slug: "goals", label: "Goals" },
  { slug: "language", label: "Language" },
  { slug: "complete", label: "Ready" },
] as const;

export type StepSlug = (typeof STEPS)[number]["slug"];

export const STEP_INDEX: Record<StepSlug, number> = Object.fromEntries(
  STEPS.map((s, i) => [s.slug, i]),
) as Record<StepSlug, number>;
