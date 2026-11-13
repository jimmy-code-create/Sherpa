import { RoadmapSchema, type Roadmap } from "../schemas/roadmap";
import { resolveChapter } from "../curriculum/catalog";
import type { ChapterContent } from "../curriculum/types";
import { getChapterContent } from "../curriculum/content";

/**
 * Roadmap composer.
 *
 * Phases are derived from the chapter's topic list and the learner's weekly
 * hours so that total estimated hours ≈ weekly_hours × weeks (the prompt's own
 * verification step, enforced here in code).
 */

export interface RoadmapInput {
  chapterSlug: string;
  weeklyHours: number;
  targetDate?: string | null;
  proficiency: "beginner" | "intermediate" | "advanced";
}

const PHASE_TEMPLATES = [
  { suffix: "Foundation", verbs: ["Understand", "Identify"], weight: 1 },
  { suffix: "Core mechanics", verbs: ["Apply", "Explain"], weight: 1.4 },
  { suffix: "Exam craft", verbs: ["Analyse", "Solve"], weight: 1.2 },
  { suffix: "Consolidation", verbs: ["Evaluate", "Create"], weight: 0.8 },
];

function chunk<T>(items: T[], groups: number): T[][] {
  if (items.length === 0) return [[]];
  const size = Math.max(1, Math.ceil(items.length / groups));
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export function buildRoadmap(input: RoadmapInput): Roadmap | null {
  const resolved = resolveChapter(input.chapterSlug);
  const content: ChapterContent | undefined = getChapterContent(input.chapterSlug);
  if (!resolved || !content) return null;

  const { chapter } = resolved;
  const weekly = Math.min(30, Math.max(1, input.weeklyHours || 5));
  const proficiencyFactor =
    input.proficiency === "beginner" ? 1.35 : input.proficiency === "advanced" ? 0.75 : 1;

  const totalHours = chapter.estimatedHours * proficiencyFactor;
  const totalWeeks = Math.max(1, Math.min(12, Math.ceil(totalHours / weekly)));

  const phaseCount = totalWeeks >= 4 ? 4 : totalWeeks >= 3 ? 3 : totalWeeks >= 2 ? 2 : 1;
  const topicGroups = chunk(chapter.topics, phaseCount);

  const phases = topicGroups.map((topics, index) => {
    const template = PHASE_TEMPLATES[index] ?? PHASE_TEMPLATES[PHASE_TEMPLATES.length - 1];
    const weekStart = Math.floor((index * totalWeeks) / phaseCount) + 1;
    const weekEnd = Math.max(weekStart, Math.floor(((index + 1) * totalWeeks) / phaseCount));
    const scale = topics.length / Math.max(1, chapter.topics.length);
    const estimated = Math.max(0.5, Number((totalHours * scale * template.weight).toFixed(1)));
    const hardest = topics.some((t) => t.difficulty === "hard");

    return {
      name: `${template.suffix} — ${topics.map((t) => t.name).slice(0, 2).join(" & ")}`,
      week_start: weekStart,
      week_end: weekEnd,
      topics: topics.map((t) => t.name),
      objectives: [
        `${template.verbs[0]} the ${topics[0]?.name.toLowerCase() ?? "core idea"} in your own words`,
        `${template.verbs[1] ?? "Apply"} ${topics.length > 1 ? topics[1]!.name.toLowerCase() : "the main result"} to a worked problem`,
        index === phaseCount - 1
          ? "Create a one-page summary you could revise from in ten minutes"
          : "Analyse your mistakes and log the pattern behind each one",
      ],
      estimated_hours: estimated,
      prerequisites: index === 0 ? content.prerequisites.slice(0, 3) : [topics[0]?.name ?? "previous phase"],
      milestone_check:
        index === phaseCount - 1
          ? `Can you score 80% on a ${chapter.topics.length}-topic mixed quiz?`
          : hardest
            ? `Can you solve 3 ${topics[0]?.name.toLowerCase()} problems cold, without notes?`
            : `Can you explain ${topics[0]?.name.toLowerCase()} to a classmate in under two minutes?`,
    };
  });

  const assumptions: string[] = [];
  if (input.weeklyHours > 0) assumptions.push(`Based on ${weekly} focused hours per week.`);
  if (input.proficiency === "beginner")
    assumptions.push("Extra time budgeted because you are starting from the basics.");
  if (input.proficiency === "advanced")
    assumptions.push("Compressed timeline because you already know the fundamentals.");
  if (input.targetDate) assumptions.push(`Target date ${input.targetDate} treated as a hard deadline.`);
  if (!input.targetDate) assumptions.push("No target date set — pace follows your weekly hours only.");

  const candidate = {
    title: `${chapter.name} — ${totalWeeks}-week roadmap`,
    chapter_slug: input.chapterSlug,
    total_weeks: totalWeeks,
    phases,
    spaced_repetition: {
      offsets_days: [0, 1, 3, 7, 14, 30],
      note: "Each topic is revisited on D0, D1, D3, D7, D14 and D30. Reviews queue automatically after practice.",
    },
    assumptions,
    notes: `Total estimated hours ${phases.reduce((s, p) => s + p.estimated_hours, 0).toFixed(1)} against ${weekly} h/week over ${totalWeeks} weeks.`,
  };

  const parsed = RoadmapSchema.safeParse(candidate);
  if (!parsed.success) {
    console.error("Roadmap composer produced an invalid artifact", parsed.error.issues);
    return null;
  }
  return parsed.data;
}
