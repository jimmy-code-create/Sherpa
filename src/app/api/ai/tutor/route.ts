import { z } from "zod";
import { respondSocratically } from "@/lib/ai/tutor";
import { guarded, json, UNAUTHENTICATED } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import { quizStore, tutorStore } from "@/lib/store";

const Body = z.object({
  chapterSlug: z.string().min(1),
  message: z.string().min(1).max(4000),
  readingLevel: z.enum(["10", "15", "college"]).default("15"),
});

export async function POST(request: Request) {
  return guarded(request, Body, {
    rateLimit: "tutor",
    handler: async ({ user }, body) => {
      const userId = user.session.userId;
      const history = await tutorStore.forChapter(userId, body.chapterSlug);
      const priorTurns = history.filter((m) => m.role === "assistant").length;

      const attempts = await quizStore.forChapter(userId, body.chapterSlug);
      const mistakeLog = attempts.flatMap((a) => a.weakTopics).slice(-5);

      const response = respondSocratically({
        chapterSlug: body.chapterSlug,
        message: body.message,
        priorTurns,
        readingLevel: body.readingLevel,
        mistakeLog,
      });

      await tutorStore.add({
        userId,
        chapterSlug: body.chapterSlug,
        role: "user",
        content: body.message,
        turnNumber: priorTurns * 2 + 1,
      });
      await tutorStore.add({
        userId,
        chapterSlug: body.chapterSlug,
        role: "assistant",
        content: response.content,
        turnNumber: priorTurns * 2 + 2,
      });

      return json(response);
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const chapterSlug = url.searchParams.get("chapterSlug");
  if (!chapterSlug) return json({ error: "chapterSlug required" }, { status: 422 });
  const current = await getCurrentUser();
  if (!current) return UNAUTHENTICATED();
  const messages = await tutorStore.forChapter(current.session.userId, chapterSlug);
  return json({
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
      turnNumber: m.turnNumber,
    })),
  });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const chapterSlug = url.searchParams.get("chapterSlug");
  if (!chapterSlug) return json({ error: "chapterSlug required" }, { status: 422 });
  const current = await getCurrentUser();
  if (!current) return UNAUTHENTICATED();
  await tutorStore.clear(current.session.userId, chapterSlug);
  return json({ ok: true });
}
