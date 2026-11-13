/**
 * Education taxonomy types.
 *
 * Country → Curriculum → Level → Stream → Subject → Chapter → Topic
 *
 * Slugs are the canonical identifiers used in URLs and in the Supabase
 * mirror (see supabase/migrations/0001_init.sql, `slug` columns).
 */

export type Stage =
  | "primary"
  | "middle"
  | "secondary"
  | "senior_secondary"
  | "ug"
  | "pg"
  | "doctorate"
  | "competitive";

export interface Country {
  code: string;
  name: string;
  flag: string;
  languages: string[];
  popular: boolean;
}

export interface Curriculum {
  slug: string;
  countryCode: string;
  name: string;
  description: string;
  isInternational: boolean;
}

export interface Level {
  slug: string;
  curriculumSlug: string;
  name: string;
  ordinal: number;
  stage: Stage;
}

export interface Stream {
  slug: string;
  levelSlug: string;
  name: string;
}

export interface Subject {
  slug: string;
  streamSlug: string;
  name: string;
  icon: string;
  color: string;
  blurb: string;
}

export type SyllabusWeight = "low" | "medium" | "high";

export interface Topic {
  name: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Chapter {
  slug: string;
  subjectSlug: string;
  name: string;
  order: number;
  syllabusWeight: SyllabusWeight;
  estimatedHours: number;
  prerequisites: string[];
  topics: Topic[];
}

/**
 * Authored chapter knowledge. The notes engine composes NotesSchema-valid
 * artifacts at three depths from this — nothing is scraped, everything is
 * written for Sherpa.
 */
export interface ChapterContent {
  slug: string;
  bigPicture: string;
  prerequisites: string[];
  glossary: { term: string; definition: string }[];
  concepts: { heading: string; body_md: string }[];
  derivations: string[];
  examples: {
    difficulty: "easy" | "medium" | "hard";
    problem_md: string;
    solution_md: string;
  }[];
  diagram: string;
  analogies: string[];
  mistakes: string[];
  examPatterns: { exam: string; years: number[]; question_types: string[] }[];
  mnemonics: string[];
  selfCheck: { question: string; answer: string }[];
  related: string[];
}

export interface SubjectWithChapters extends Subject {
  level: Level;
  curriculum: Curriculum;
  country: Country;
  chapters: Chapter[];
}
