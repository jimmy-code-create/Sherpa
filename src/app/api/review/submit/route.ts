import { z } from "zod";
import { guarded, json, fail } from "@/lib/api";
import { schedule } from "@/lib/srs";
import { masteryScore, statusFor } from "@/lib/mastery";
import { progress, reviewStore } from "@/lib/store";

const Body = z.object({
  cardId: z.string().min(1),
  rating: z.enum(["again", "hard", "good", "easy"]),
});

export async function POST(request: Request) {
  return guarded(request, Body, {
    handler: async ({ user }, body) => {
      const card = await reviewStore.get(body.cardId);
      if (!card || card.userId !== user.session.userId) return fail("Card not found", 404);

      const next = schedule(
        { ease: card.ease, interval: card.interval, repetitions: card.repetitions },
        body.rating,
      );

      const updated = await reviewStore.update(card.id, {
        ease: next.ease,
        interval: next.interval,
        repetitions: next.repetitions,
        dueAt: next.dueAt.toISOString(),
        lastReviewedAt: new Date().toISOString(),
      });

      const previous = await progress.get(user.session.userId, card.chapterSlug);
      const reviewsCompleted = (previous?.reviewsCompleted ?? 0) + 1;
      const newMastery = masteryScore({
        quizScore: previous?.quizScore ?? null,
        notesRead: previous?.notesRead ?? 0,
        reviewsCompleted,
      });
      await progress.upsert(user.session.userId, card.chapterSlug, {
        reviewsCompleted,
        masteryScore: newMastery,
        status: statusFor(newMastery, true),
        lastReviewedAt: new Date().toISOString(),
      });

      return json({ nextDue: updated?.dueAt, interval: next.interval, ease: next.ease });
    },
  });
}
