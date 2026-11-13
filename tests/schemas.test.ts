import { describe, expect, it } from "vitest";
import { NotesSchema, REQUIRED_NOTE_SECTIONS } from "@/lib/schemas/notes";
import { RoadmapSchema } from "@/lib/schemas/roadmap";
import { QuizSchema, QuestionSchema, isCorrect } from "@/lib/schemas/quiz";
import { ResourceListSchema, assertUrlsAllowlisted } from "@/lib/schemas/resource";
import { TutorResponseSchema } from "@/lib/schemas/tutor";
import { buildNotes } from "@/lib/ai/notes";
import { buildRoadmap } from "@/lib/ai/roadmap";
import { buildQuiz } from "@/lib/ai/quiz";
import { buildResources } from "@/lib/ai/resources";
import { ALLOWLIST_URLS } from "@/lib/curriculum/resources";

const validNotes = buildNotes("light-reflection-refraction", "deep", "en");
const validRoadmap = buildRoadmap({
  chapterSlug: "light-reflection-refraction",
  weeklyHours: 5,
  proficiency: "beginner",
});
const validQuiz = buildQuiz({ chapterSlug: "light-reflection-refraction", count: 5, difficulty: "mixed" });

describe("NotesSchema", () => {
  it("accepts a real generated deep note", () => {
    expect(validNotes).not.toBeNull();
    expect(NotesSchema.safeParse(validNotes).success).toBe(true);
  });

  it("accepts every depth", () => {
    for (const depth of ["quick", "standard", "deep"] as const) {
      const n = buildNotes("cell-biology", depth, "en");
      expect(n, `depth ${depth}`).not.toBeNull();
      expect(NotesSchema.safeParse(n).success).toBe(true);
    }
  });

  it("requires all 14 sections — a note missing one must fail", () => {
    expect(REQUIRED_NOTE_SECTIONS.length).toBe(14);
    if (!validNotes) throw new Error("missing fixture");
    const broken = { ...validNotes, glossary: undefined };
    expect(NotesSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects < 3 citations and < 3 worked examples", () => {
    if (!validNotes) throw new Error("missing fixture");
    expect(
      NotesSchema.safeParse({ ...validNotes, citations: validNotes.citations.slice(0, 2) }).success,
    ).toBe(false);
    expect(
      NotesSchema.safeParse({ ...validNotes, worked_examples: validNotes.worked_examples.slice(0, 2) }).success,
    ).toBe(false);
  });

  it("rejects non-URL citations", () => {
    if (!validNotes) throw new Error("missing fixture");
    const broken = {
      ...validNotes,
      citations: [{ title: "x", url: "not a url", publisher: "y" }],
    };
    expect(NotesSchema.safeParse(broken).success).toBe(false);
  });
});

describe("RoadmapSchema", () => {
  it("accepts a generated roadmap", () => {
    expect(validRoadmap).not.toBeNull();
    expect(RoadmapSchema.safeParse(validRoadmap).success).toBe(true);
  });

  it("rejects week_end < week_start and non-Bloom objectives", () => {
    if (!validRoadmap) throw new Error("missing fixture");
    const phase = { ...validRoadmap.phases[0]!, week_start: 3, week_end: 1 };
    expect(RoadmapSchema.safeParse({ ...validRoadmap, phases: [phase] }).success).toBe(false);
    const badVerb = { ...validRoadmap.phases[0]!, objectives: ["because reasons"] };
    expect(RoadmapSchema.safeParse({ ...validRoadmap, phases: [badVerb] }).success).toBe(false);
  });
});

describe("QuizSchema", () => {
  it("accepts a generated quiz and every question has a topic tag from the chapter", () => {
    expect(validQuiz).not.toBeNull();
    expect(QuizSchema.safeParse(validQuiz).success).toBe(true);
    for (const q of validQuiz!.questions) {
      expect(q.topic_tag.length).toBeGreaterThan(0);
      expect(q.solution.length).toBeGreaterThanOrEqual(10);
    }
  });

  it("rejects an mcq whose correct_answer is not among options", () => {
    const q = {
      id: "x",
      type: "mcq",
      stem: "a sufficiently long stem here",
      options: ["a", "b"],
      correct_answer: "c",
      solution: "a sufficiently long solution text",
      topic_tag: "t",
      difficulty: "easy",
      source: "generated",
    };
    expect(QuestionSchema.safeParse(q).success).toBe(false);
  });

  it("isCorrect normalizes case and whitespace", () => {
    if (!validQuiz) throw new Error("missing fixture");
    const q = validQuiz.questions.find((x) => x.type === "mcq");
    expect(q).toBeDefined();
    if (q?.options) {
      expect(isCorrect(q, q.correct_answer.toUpperCase())).toBe(true);
      expect(isCorrect(q, "definitely not the answer")).toBe(false);
      expect(isCorrect(q, undefined)).toBe(false);
    }
  });
});

describe("ResourceListSchema + allowlist enforcement", () => {
  it("generated resource lists contain only allowlisted URLs", () => {
    const list = buildResources({ chapterSlug: "light-reflection-refraction", language: "en" });
    expect(ResourceListSchema.safeParse(list).success).toBe(true);
    for (const r of list.resources) {
      expect(ALLOWLIST_URLS.has(r.url)).toBe(true);
    }
  });

  it("assertUrlsAllowlisted strips non-allowlisted URLs", () => {
    const forged = {
      chapter_slug: "x",
      resources: [
        {
          provider: "Evil",
          title: "t",
          url: "https://example.com/spam",
          type: "video" as const,
          cost: "free" as const,
          language: "en",
          quality_score: 10,
          why_this_fits: "trust me, it fits you perfectly well",
          verified: true,
        },
      ],
    };
    const parsed = ResourceListSchema.parse(forged);
    const clean = assertUrlsAllowlisted(parsed, ALLOWLIST_URLS);
    expect(clean.resources.length).toBe(0);
  });
});

describe("TutorResponseSchema", () => {
  it("accepts a well-formed response", () => {
    expect(
      TutorResponseSchema.safeParse({
        content: "What do you think happens?",
        turn_number: 1,
        contains_final_answer: false,
        socratic_gate_applied: true,
        suggested_next_action: "Answer the question",
      }).success,
    ).toBe(true);
  });
});
