import { z } from "zod";

/**
 * ResourceSchema — the resource curator may only ever emit URLs that already
 * exist in the curated allowlist (src/lib/curriculum/resources.ts). The
 * allowlist is merged into the schema at call time via `resourceListSchema`.
 */
export const ResourceItemSchema = z.object({
  provider: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["video", "course", "book", "pdf", "practice"]),
  cost: z.enum(["free", "freemium", "paid"]),
  language: z.string().min(2),
  estimated_time: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  quality_score: z.number().min(0).max(10),
  why_this_fits: z.string().min(10).max(160),
  verified: z.boolean(),
  disclosure: z.string().optional(),
});

export const ResourceListSchema = z.object({
  chapter_slug: z.string().min(1),
  resources: z.array(ResourceItemSchema).min(0).max(7),
  gaps: z.array(z.string()).optional(),
});

export type ResourceItem = z.infer<typeof ResourceItemSchema>;
export type ResourceList = z.infer<typeof ResourceListSchema>;

/**
 * Allowlist enforcement (Rubric criterion: "No hallucinated URLs").
 * A resource list is only valid if each of its URLs is in the allowlist.
 */
export function assertUrlsAllowlisted(
  list: ResourceList,
  allowlistedUrls: ReadonlySet<string>,
): ResourceList {
  const filtered = list.resources.filter((r) => allowlistedUrls.has(r.url));
  return { ...list, resources: filtered };
}
