import { z } from "zod";
import { buildQuiz } from "@/lib/ai/quiz";
import { guarded, json } from "@/lib/api";

const Body = z.object({
  chapterSlug: z.string().min(1),
  count: z.number().int().min(1).max(20).default(5),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"]).default("mixed"),
});

export async function POST(request: Request) {
  return guarded(request, Body, {
    rateLimit: "quiz",
    handler: async (_ctx, body) => {
      const quiz = buildQuiz({
        chapterSlug: body.chapterSlug,
        count: body.count,
        difficulty: body.difficulty,
      });
      if (!quiz) {
        return json({ error: "Couldn't build a quiz for this chapter.", retryable: true }, { status: 503 });
      }
      return json(quiz);
    },
  });
}
