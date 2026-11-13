import { z } from "zod";
import { buildRoadmap } from "@/lib/ai/roadmap";
import { guarded, json, RATE_LIMITED } from "@/lib/api";
import { checkRateLimit } from "@/lib/ai/ratelimit";
import { roadmapStore } from "@/lib/store";

const Body = z.object({
  chapterSlug: z.string().min(1),
  regenerate: z.boolean().optional(),
});

export async function POST(request: Request) {
  return guarded(request, Body, {
    handler: async ({ user }, body) => {
      const existing = await roadmapStore.get(user.session.userId, body.chapterSlug);

      if (existing && !body.regenerate) {
        return json({ roadmap: existing.roadmap, version: existing.version, source: "stored" });
      }

      const rule = existing ? "roadmapRegen" : "roadmap";
      const limit = await checkRateLimit(`${user.session.userId}:${body.chapterSlug}`, rule);
      if (!limit.allowed) return RATE_LIMITED(limit.retryAfterSeconds, limit.limit);

      const roadmap = buildRoadmap({
        chapterSlug: body.chapterSlug,
        weeklyHours: user.profile.weeklyHours,
        targetDate: user.profile.targetDate,
        proficiency: user.profile.proficiency,
      });

      if (!roadmap) {
        return json(
          { error: "Couldn't generate a roadmap for this chapter.", retryable: true },
          { status: 503 },
        );
      }

      const saved = await roadmapStore.put(user.session.userId, body.chapterSlug, roadmap);
      return json({ roadmap: saved.roadmap, version: saved.version, source: "generated" });
    },
  });
}
