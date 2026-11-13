import {
  COUNTRIES,
  CURRICULA,
  LEVELS,
  STREAMS,
} from "./taxonomy";
import { CHAPTERS, SUBJECTS, chaptersForSubject } from "./chapters";
import type {
  Chapter,
  Country,
  Curriculum,
  Level,
  Stream,
  Subject,
  SubjectWithChapters,
} from "./types";

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function curriculaForCountry(code: string): Curriculum[] {
  return CURRICULA.filter((c) => c.countryCode === code);
}

export function getCurriculum(slug: string): Curriculum | undefined {
  return CURRICULA.find((c) => c.slug === slug);
}

export function levelsForCurriculum(curriculumSlug: string): Level[] {
  return LEVELS.filter((l) => l.curriculumSlug === curriculumSlug).sort(
    (a, b) => a.ordinal - b.ordinal,
  );
}

export function getLevel(slug: string): Level | undefined {
  return LEVELS.find((l) => l.slug === slug);
}

export function streamsForLevel(levelSlug: string): Stream[] {
  return STREAMS.filter((s) => s.levelSlug === levelSlug);
}

export function getStream(slug: string): Stream | undefined {
  return STREAMS.find((s) => s.slug === slug);
}

export function getSubject(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function getChapter(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function subjectsForStream(streamSlug: string): Subject[] {
  return SUBJECTS.filter((s) => s.streamSlug === streamSlug);
}

/** Every stream reachable from a faculty — used by the subject explorer. */
export function subjectsForLevels(levelSlugs: string[]): Subject[] {
  const streams = new Set(STREAMS.filter((s) => levelSlugs.includes(s.levelSlug)).map((s) => s.slug));
  return SUBJECTS.filter((s) => streams.has(s.streamSlug));
}

/** Full resolved path: country → curriculum → level → stream for a subject. */
export function resolveSubject(subjectSlug: string): SubjectWithChapters | undefined {
  const subject = getSubject(subjectSlug);
  if (!subject) return undefined;
  const stream = getStream(subject.streamSlug);
  if (!stream) return undefined;
  const level = getLevel(stream.levelSlug);
  if (!level) return undefined;
  const curriculum = getCurriculum(level.curriculumSlug);
  if (!curriculum) return undefined;
  const country = getCountry(curriculum.countryCode);
  if (!country) return undefined;
  return {
    ...subject,
    level,
    curriculum,
    country,
    chapters: chaptersForSubject(subject.slug),
  };
}

/** Every subject reachable from a chapter slug. */
export function resolveChapter(chapterSlug: string) {
  const chapter = getChapter(chapterSlug);
  if (!chapter) return undefined;
  const subject = resolveSubject(chapter.subjectSlug);
  if (!subject) return undefined;
  return { chapter, subject };
}

export function allSubjectsOnPath(
  countryCode: string,
  curriculumSlug: string,
  levelSlug: string,
): SubjectWithChapters[] {
  const level = getLevel(levelSlug);
  if (!level || level.curriculumSlug !== curriculumSlug) return [];
  return STREAMS.filter((s) => s.levelSlug === levelSlug)
    .flatMap((s) => SUBJECTS.filter((sub) => sub.streamSlug === s.slug))
    .map((s) => resolveSubject(s.slug))
    .filter((s): s is SubjectWithChapters => Boolean(s))
    .filter((s) => s.country.code === countryCode);
}

export function breadcrumbForChapter(chapterSlug: string): string[] {
  const resolved = resolveChapter(chapterSlug);
  if (!resolved) return [];
  const { subject, chapter } = resolved;
  return [subject.country.name, subject.curriculum.name, subject.level.name, subject.name, chapter.name];
}
