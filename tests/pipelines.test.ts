import { describe, expect, it } from "vitest";
import { NotesSchema } from "@/lib/schemas/notes";
import { QuizSchema } from "@/lib/schemas/quiz";
import { RoadmapSchema } from "@/lib/schemas/roadmap";
import { buildNotes } from "@/lib/ai/notes";
import { buildQuiz } from "@/lib/ai/quiz";
import { buildRoadmap } from "@/lib/ai/roadmap";
import { buildResources } from "@/lib/ai/resources";
import { CHAPTERS } from "@/lib/curriculum/chapters";
import { ALLOWLIST_URLS } from "@/lib/curriculum/resources";

describe("All 8 chapters compose valid artifacts at every depth", () => {
  for (const chapter of CHAPTERS) {
    it(`${chapter.slug}`, () => {
      for (const depth of ["quick", "standard", "deep"] as const) {
        const notes = buildNotes(chapter.slug, depth, "en");
        expect(notes, `${chapter.slug} ${depth}`).not.toBeNull();
        const parsed = NotesSchema.safeParse(notes);
        expect(parsed.success, parsed.success ? "" : JSON.stringify(parsed.error.issues.slice(0, 3))).toBe(
          true,
        );
      }
      const quiz = buildQuiz({ chapterSlug: chapter.slug, count: 10, difficulty: "mixed" });
      expect(quiz).not.toBeNull();
      expect(QuizSchema.safeParse(quiz).success).toBe(true);

      const roadmap = buildRoadmap({
        chapterSlug: chapter.slug,
        weeklyHours: 6,
        proficiency: "intermediate",
        targetDate: "2026-12-01",
      });
      expect(roadmap).not.toBeNull();
      expect(RoadmapSchema.safeParse(roadmap).success).toBe(true);

      const resources = buildResources({ chapterSlug: chapter.slug, language: "en" });
      for (const r of resources.resources) {
        expect(ALLOWLIST_URLS.has(r.url)).toBe(true);
      }
    });
  }
});

describe("Roadmap hours sanity (prompt's own verification rule)", () => {
  it("total estimated hours ≈ weekly_hours × total_weeks within 35%", () => {
    const roadmap = buildRoadmap({
      chapterSlug: "light-reflection-refraction",
      weeklyHours: 5,
      proficiency: "beginner",
    });
    expect(roadmap).not.toBeNull();
    if (!roadmap) return;
    const total = roadmap.phases.reduce((s, p) => s + p.estimated_hours, 0);
    const expected = 5 * roadmap.total_weeks;
    expect(Math.abs(total - expected) / expected).toBeLessThan(0.35);
  });
});

describe("Quiz determinism (cache-friendly)", () => {
  it("same input → same quiz", () => {
    const a = buildQuiz({ chapterSlug: "electricity", count: 5, difficulty: "mixed" });
    const b = buildQuiz({ chapterSlug: "electricity", count: 5, difficulty: "mixed" });
    expect(a).toEqual(b);
  });
});
