import { ResourceListSchema, assertUrlsAllowlisted, type ResourceList } from "../schemas/resource";
import { resolveChapter } from "../curriculum/catalog";
import { allowlistForSubject, ALLOWLIST_URLS } from "../curriculum/resources";

/**
 * Resource curator.
 *
 * Ranking (Section 21.2): curriculum fit → language → cost → quality → freshness.
 * Hard constraint: only allowlisted URLs can come out.
 */
export interface ResourceInput {
  chapterSlug: string;
  language?: string;
  freeOnly?: boolean;
  proficiency?: "beginner" | "intermediate" | "advanced";
  weakTopics?: string[];
}

function relevance(provider: string, subjectSlug: string): number {
  // Curriculum fit: NCERT/DIKSHA/SWAYAM are board-aligned for Indian curricula,
  // Khan/OpenStax/MIT are the strongest general-purpose matches elsewhere.
  const boardAligned = /ncert|diksha|swayam|physics wallah/i.test(provider);
  const isIndian = subjectSlug.startsWith("cbse");
  if (isIndian) return boardAligned ? 1 : 0.85;
  return boardAligned ? 0.6 : 0.95;
}

export function buildResources(input: ResourceInput): ResourceList {
  const resolved = resolveChapter(input.chapterSlug);
  if (!resolved) {
    return { chapter_slug: input.chapterSlug, resources: [], gaps: ["Unknown chapter"] };
  }
  const { chapter, subject } = resolved;
  const language = input.language ?? "en";

  const candidates = allowlistForSubject(subject.slug).filter(
    (r) => !input.freeOnly || r.cost === "free",
  );

  const ranked = candidates
    .map((r) => {
      const langMatch = r.language === language ? 1 : 0.75;
      const cost = r.cost === "free" ? 1 : r.cost === "freemium" ? 0.7 : 0.4;
      const fresh = r.verifiedAt && r.verifiedAt >= "2026-09-01" ? 1 : 0.85;
      const score =
        relevance(r.provider, subject.slug) * 0.35 +
        langMatch * 0.2 +
        cost * 0.2 +
        (r.qualityScore / 10) * 0.2 +
        fresh * 0.05;
      return { entry: r, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const difficultyHint =
    input.proficiency === "beginner"
      ? "starts from first principles, so you can build the idea before the algebra"
      : input.proficiency === "advanced"
        ? "goes straight to exam-level problems without warming up"
        : "sits at problem-solving level, right where you are";

  const weak = input.weakTopics?.[0];

  const candidate = {
    chapter_slug: input.chapterSlug,
    resources: ranked.map(({ entry }) => ({
      provider: entry.provider,
      title: entry.title,
      url: entry.url,
      type: entry.type,
      cost: entry.cost,
      language: entry.language,
      estimated_time: entry.estimatedTime,
      difficulty: entry.difficulty,
      quality_score: entry.qualityScore,
      why_this_fits: weak
        ? `Covers ${weak} early, the topic your last quiz flagged — and ${difficultyHint}.`.slice(0, 150)
        : `Best for ${chapter.name.toLowerCase()}: ${difficultyHint}.`.slice(0, 150),
      verified: entry.verified,
      disclosure: entry.disclosure,
    })),
    gaps:
      ranked.length < 3
        ? [`Only ${ranked.length} vetted resource${ranked.length === 1 ? "" : "s"} for ${chapter.name} in ${language}.`]
        : [],
  };

  const parsed = ResourceListSchema.safeParse(candidate);
  if (!parsed.success) {
    console.error("Resource composer produced an invalid artifact", parsed.error.issues);
    return { chapter_slug: input.chapterSlug, resources: [], gaps: ["Resource list failed validation"] };
  }

  // Belt and braces: nothing leaves this function that is not allowlisted.
  return assertUrlsAllowlisted(parsed.data, ALLOWLIST_URLS);
}
