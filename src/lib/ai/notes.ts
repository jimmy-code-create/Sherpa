import { NotesSchema, type NoteDepth, type Notes } from "../schemas/notes";
import { getChapterContent } from "../curriculum/content";
import { resolveChapter } from "../curriculum/catalog";
import { allowlistForSubject } from "../curriculum/resources";

/**
 * Notes composer.
 *
 * Composition happens at three depths from one authored source of truth.
 * The output is always a complete NotesSchema object — every one of the 14
 * required sections is present at every depth, so the reading surface can
 * never render a half-built page.
 */

const READ_MINUTES: Record<NoteDepth, number> = { quick: 2, standard: 10, deep: 25 };

function firstParagraphs(text: string, count: number): string {
  return text
    .split(/\n\s*\n/)
    .slice(0, count)
    .join("\n\n")
    .trim();
}

function padToMinLength(text: string, min: number, filler: string): string {
  if (text.length >= min) return text;
  return `${text}\n\n${filler}`.slice(0, Math.max(min, text.length + filler.length));
}

export function buildNotes(
  chapterSlug: string,
  depth: NoteDepth,
  language = "en",
): Notes | null {
  const content = getChapterContent(chapterSlug);
  const resolved = resolveChapter(chapterSlug);
  if (!content || !resolved) return null;

  const { chapter, subject } = resolved;

  const sources = allowlistForSubject(subject.slug).slice(0, 6);
  const citations = sources.map((s) => ({
    title: s.title,
    url: s.url,
    publisher: s.provider,
  }));

  const depthCopy: Record<NoteDepth, { big: number; concepts: number; examples: number }> = {
    quick: { big: 1, concepts: 2, examples: 3 },
    standard: { big: 2, concepts: content.concepts.length, examples: Math.min(4, content.examples.length) },
    deep: { big: 3, concepts: content.concepts.length, examples: content.examples.length },
  };
  const plan = depthCopy[depth];

  const bigPicture = padToMinLength(
    firstParagraphs(content.bigPicture, plan.big),
    60,
    `This ${depth === "quick" ? "short" : "full"} note covers ${chapter.topics
      .map((t) => t.name)
      .join(", ")}.`,
  );

  const concepts = content.concepts.slice(0, plan.concepts).map((c) => {
    if (depth !== "quick") return { heading: c.heading, body_md: c.body_md };
    // Quick depth keeps the lead paragraph — but never shorter than the
    // schema's 20-char floor (a one-line lead like "The workhorse:" would
    // otherwise fail validation).
    const lead = firstParagraphs(c.body_md, 1);
    return { heading: c.heading, body_md: lead.length >= 20 ? lead : firstParagraphs(c.body_md, 2) };
  });

  // Deep notes carry the derivations; standard and quick keep the form
  // documented in the schema (an empty array is valid and renders an
  // explanatory empty state rather than a blank section).
  const derivations = depth === "deep" ? content.derivations : depth === "standard" ? content.derivations.slice(0, 2) : [];

  const candidate: Notes = {
    chapter_slug: chapterSlug,
    depth,
    language,
    title: `${chapter.name} — ${depth === "deep" ? "Deep Dive" : depth === "standard" ? "Standard Notes" : "Quick Summary"}`,
    read_minutes: READ_MINUTES[depth],
    big_picture: bigPicture,
    prerequisites: content.prerequisites,
    glossary: depth === "quick" ? content.glossary.slice(0, 5) : content.glossary,
    core_concepts: concepts,
    derivations,
    worked_examples: content.examples.slice(0, plan.examples),
    diagrams: [content.diagram],
    analogies: depth === "quick" ? content.analogies.slice(0, 1) : content.analogies,
    common_mistakes: content.mistakes,
    exam_patterns: content.examPatterns,
    mnemonics: depth === "quick" ? content.mnemonics.slice(0, 2) : content.mnemonics,
    self_check: content.selfCheck,
    citations,
    related_chapters: content.related,
    limited_sources: citations.length < 3,
  };

  const parsed = NotesSchema.safeParse(candidate);
  if (!parsed.success) {
    // A composer bug must never reach the reader. Returning null makes the
    // route render the `[unavailable]` section with a retry affordance.
    console.error("Notes composer produced an invalid artifact", parsed.error.issues);
    return null;
  }
  return parsed.data;
}

/** Markdown export used by "Export → Markdown" and the data-portability flow. */
export function notesToMarkdown(note: Notes): string {
  const lines: string[] = [
    `# ${note.title}`,
    "",
    `_${note.read_minutes} min read · ${note.depth} · ${note.language}_`,
    "",
    "## Big picture",
    "",
    note.big_picture,
    "",
    "## Prerequisites",
    "",
    ...(note.prerequisites.length ? note.prerequisites.map((p) => `- ${p}`) : ["_None — start here._"]),
    "",
    "## Glossary",
    "",
    "| Term | Definition |",
    "| --- | --- |",
    ...note.glossary.map((g) => `| ${g.term} | ${g.definition} |`),
    "",
    "## Core concepts",
    "",
    ...note.core_concepts.flatMap((c) => [`### ${c.heading}`, "", c.body_md, ""]),
    ...(note.derivations.length
      ? ["## Derivations & logic", "", ...note.derivations.flatMap((d) => [d, ""])]
      : []),
    "## Worked examples",
    "",
    ...note.worked_examples.flatMap((e, i) => [
      `### Example ${i + 1} (${e.difficulty})`,
      "",
      e.problem_md,
      "",
      e.solution_md,
      "",
    ]),
    "## Diagrams",
    "",
    ...note.diagrams.map((d) => ["```mermaid", d, "```", ""]).flat(),
    "## Common mistakes",
    "",
    ...note.common_mistakes.map((m) => `- ${m}`),
    "",
    "## Exam patterns",
    "",
    ...note.exam_patterns.map(
      (p) => `- **${p.exam}** (${p.years.join(", ") || "recent"}): ${p.question_types.join("; ")}`,
    ),
    "",
    "## Self-check",
    "",
    ...note.self_check.flatMap((s, i) => [`${i + 1}. ${s.question}`, `   - ${s.answer}`]),
    "",
    "## Citations",
    "",
    ...note.citations.map((c, i) => `[${i + 1}] ${c.publisher} — ${c.title} — ${c.url}`),
    "",
  ];
  return lines.join("\n");
}
