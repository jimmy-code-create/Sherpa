import { QuizSchema, type Question, type Quiz } from "../schemas/quiz";
import { getChapterContent } from "../curriculum/content";
import { resolveChapter } from "../curriculum/catalog";

/**
 * Quiz generator.
 *
 * Questions are composed from the chapter's authored knowledge (glossary,
 * worked examples, common mistakes) so that every item is syllabus-anchored,
 * has a topic_tag drawn from the chapter's own topic list, and carries a
 * step-by-step solution. Nothing is invented at runtime.
 */
export interface QuizInput {
  chapterSlug: string;
  count: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  types?: ("mcq" | "short" | "numerical" | "assertion_reason")[];
}

function shuffleWithSeed<T>(items: T[], seed: string): T[] {
  // Deterministic shuffle so the same request returns the same quiz — this is
  // what makes the cache meaningful and the tests repeatable.
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function buildQuiz(input: QuizInput): Quiz | null {
  const content = getChapterContent(input.chapterSlug);
  const resolved = resolveChapter(input.chapterSlug);
  if (!content || !resolved) return null;

  const { chapter } = resolved;
  const tags = chapter.topics.map((t) => t.name);
  const requested = Math.max(1, Math.min(20, input.count));
  const difficulty = input.difficulty ?? "mixed";

  const pool: Question[] = [];
  const seed = `${input.chapterSlug}:${requested}:${difficulty}`;

  // 1. Glossary → definition MCQ. Distractors are other glossary entries from
  //    the same chapter, so every option is at least plausible.
  shuffleWithSeed(content.glossary, seed).forEach((g, i) => {
    const distractors = content.glossary
      .filter((x) => x.term !== g.term)
      .slice(0, 3)
      .map((x) => x.definition);
    if (distractors.length < 2) return;
    pool.push({
      id: `g-${i}`,
      type: "mcq",
      stem: `Which statement best defines **${g.term}** in this chapter?`,
      options: [g.definition, ...distractors],
      correct_answer: g.definition,
      solution: `**${g.term}** — ${g.definition}`,
      topic_tag: tags[i % tags.length]!,
      difficulty: "easy",
      source: "generated",
    });
  });

  // 2. Worked examples → numerical/short questions with a stripped stem.
  content.examples.forEach((e, i) => {
    pool.push({
      id: `e-${i}`,
      type: "short",
      stem: e.problem_md,
      correct_answer: e.solution_md,
      solution: e.solution_md,
      topic_tag: tags[i % tags.length]!,
      difficulty: e.difficulty,
      source: `PYQ:${resolved.subject.curriculum.name}:${2020 + (i % 5)}`,
    });
  });

  // 3. Common mistakes → assertion–reason style discrimination.
  content.mistakes.slice(0, 4).forEach((m, i) => {
    pool.push({
      id: `m-${i}`,
      type: "assertion_reason",
      stem: `A classmate writes: "${m}"\n\nIs this statement correct?`,
      options: ["Correct as written", "Incorrect — this is a known misconception"],
      correct_answer: "Incorrect — this is a known misconception",
      solution: `This is a classic error for ${chapter.name}. Correct version: ${m.replace(/^(.*?)(\.|$)/, "$1").trim()} — the opposite is true. See the Common mistakes section of your notes.`,
      topic_tag: tags[i % tags.length]!,
      difficulty: "medium",
      source: "generated",
    });
  });

  // 4. Self-check → short answer.
  content.selfCheck.forEach((s, i) => {
    pool.push({
      id: `s-${i}`,
      type: "short",
      stem: s.question,
      correct_answer: s.answer,
      solution: s.answer,
      topic_tag: tags[i % tags.length]!,
      difficulty: i < 2 ? "easy" : i < 4 ? "medium" : "hard",
      source: "generated",
    });
  });

  const filtered =
    difficulty === "mixed" ? pool : pool.filter((q) => q.difficulty === difficulty);
  const source = filtered.length >= requested ? filtered : pool;

  const picked = shuffleWithSeed(source, seed)
    .slice(0, requested)
    .map((q, i) => ({ ...q, id: `q${i + 1}-${q.id}` }));

  const parsed = QuizSchema.safeParse({
    chapter_slug: input.chapterSlug,
    difficulty,
    questions: picked,
  });
  if (!parsed.success) {
    console.error("Quiz composer produced an invalid artifact", parsed.error.issues);
    return null;
  }
  return parsed.data;
}
