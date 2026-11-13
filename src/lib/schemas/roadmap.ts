import { z } from "zod";

/**
 * RoadmapSchema — every AI roadmap must validate against this before it is
 * rendered. See RUBRIC.md criterion 3.
 */
export const RoadmapPhaseSchema = z
  .object({
    name: z.string().min(3).max(100),
    week_start: z.number().int().min(1),
    week_end: z.number().int().min(1),
    topics: z.array(z.string().min(1)).min(1),
    objectives: z
      .array(z.string().min(3))
      .min(1)
      .max(8)
      // Bloom's taxonomy verbs (Section 30.1 of the build contract)
      .refine(
        (objectives) =>
          objectives.every((o) =>
            /^(remember|understand|apply|analyse|analyze|evaluate|create|identify|describe|explain|solve|derive|compare|justify|design|construct|calculate|interpret|classify|summari[sz]e|illustrate|apply)\b/i.test(
              o.trim(),
            ),
          ),
        {
          message:
            "Every objective must begin with a Bloom's taxonomy verb (remember, understand, apply, analyse, evaluate, create, …)",
        },
      ),
    estimated_hours: z.number().positive(),
    prerequisites: z.array(z.string()).default([]),
    milestone_check: z.string().min(3),
  })
  .refine((p) => p.week_end >= p.week_start, {
    message: "week_end must be >= week_start",
  });

export const SpacedRepetitionScheduleSchema = z.object({
  offsets_days: z.array(z.number().int().min(0)).min(1),
  note: z.string().optional(),
});

export const RoadmapSchema = z.object({
  title: z.string().min(3),
  chapter_slug: z.string().min(1),
  total_weeks: z.number().int().min(1).max(52),
  phases: z.array(RoadmapPhaseSchema).min(1).max(6),
  spaced_repetition: SpacedRepetitionScheduleSchema,
  assumptions: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type RoadmapPhase = z.infer<typeof RoadmapPhaseSchema>;
export type Roadmap = z.infer<typeof RoadmapSchema>;

/** Human-facing label for a phase, e.g. "Phase 2 — Practice". */
export function phaseLabel(index: number): string {
  return `Phase ${index + 1}`;
}
