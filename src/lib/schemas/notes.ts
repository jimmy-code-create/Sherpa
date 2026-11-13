import { z } from "zod";

/**
 * NotesSchema — drives the Notes tab. The 14 required sections from Section
 * 19.4 of the build contract are all required fields here: a note that is
 * missing any of them fails validation and must not render as complete.
 */
export const CitationSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().min(1),
});

export const WorkedExampleSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
  problem_md: z.string().min(10),
  solution_md: z.string().min(10),
});

export const CoreConceptSchema = z.object({
  heading: z.string().min(3),
  body_md: z.string().min(20),
});

export const GlossaryEntrySchema = z.object({
  term: z.string().min(1),
  definition: z.string().min(3),
});

export const ExamPatternSchema = z.object({
  exam: z.string().min(1),
  years: z.array(z.number().int()).default([]),
  question_types: z.array(z.string()).min(1),
});

export const SelfCheckSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(1),
});

export const NoteDepthSchema = z.enum(["quick", "standard", "deep"]);
export type NoteDepth = z.infer<typeof NoteDepthSchema>;

export const NotesSchema = z.object({
  chapter_slug: z.string().min(1),
  depth: NoteDepthSchema,
  language: z.string().min(2),
  title: z.string().min(3),
  read_minutes: z.number().int().min(1),
  big_picture: z.string().min(50),
  prerequisites: z.array(z.string()).min(0),
  glossary: z.array(GlossaryEntrySchema).min(3),
  core_concepts: z.array(CoreConceptSchema).min(2),
  derivations: z.array(z.string()).min(0),
  worked_examples: z.array(WorkedExampleSchema).min(3),
  diagrams: z.array(z.string()).min(1),
  analogies: z.array(z.string()).min(1),
  common_mistakes: z.array(z.string()).min(2),
  exam_patterns: z.array(ExamPatternSchema).min(1),
  mnemonics: z.array(z.string()).min(0),
  self_check: z.array(SelfCheckSchema).length(5),
  citations: z.array(CitationSchema).min(3),
  related_chapters: z.array(z.string()).min(0),
  limited_sources: z.boolean().default(false),
});

export type Citation = z.infer<typeof CitationSchema>;
export type WorkedExample = z.infer<typeof WorkedExampleSchema>;
export type CoreConcept = z.infer<typeof CoreConceptSchema>;
export type Notes = z.infer<typeof NotesSchema>;

/**
 * Section keys used by the Notes UI, its TOC, and the "required sections"
 * test. Keeping this list next to the schema means the test can never drift
 * from the shape it is asserting on.
 */
export const REQUIRED_NOTE_SECTIONS = [
  "big_picture",
  "prerequisites",
  "glossary",
  "core_concepts",
  "derivations",
  "worked_examples",
  "diagrams",
  "analogies",
  "common_mistakes",
  "exam_patterns",
  "mnemonics",
  "self_check",
  "citations",
  "related_chapters",
] as const;

export const SECTION_LABELS: Record<(typeof REQUIRED_NOTE_SECTIONS)[number], string> = {
  big_picture: "Big picture",
  prerequisites: "Prerequisites",
  glossary: "Glossary",
  core_concepts: "Core concepts",
  derivations: "Derivations & logic",
  worked_examples: "Worked examples",
  diagrams: "Diagrams",
  analogies: "Analogies & real world",
  common_mistakes: "Common mistakes",
  exam_patterns: "Exam patterns",
  mnemonics: "Mnemonics",
  self_check: "Self-check",
  citations: "Citations",
  related_chapters: "Related chapters",
};
