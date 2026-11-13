import { z } from "zod";
import { buildResources } from "@/lib/ai/resources";
import { guarded, json } from "@/lib/api";

const Body = z.object({
  chapterSlug: z.string().min(1),
});

export async function POST(request: Request) {
  return guarded(request, Body, {
    rateLimit: "resources",
    handler: async ({ user }, body) => {
      const list = buildResources({
        chapterSlug: body.chapterSlug,
        language: user.profile.language,
        freeOnly: user.profile.plan === "free",
        proficiency: user.profile.proficiency,
      });
      return json(list);
    },
  });
}
