import { z } from "zod";
import { guarded, json } from "@/lib/api";
import { masteryScore, statusFor } from "@/lib/mastery";
import { progress } from "@/lib/store";

const Body = z.object({
  chapterSlug: z.string().min(1),
  event: z.enum(["opened", "notes_read", "note_depth_read"]),
  depth: z.enum(["quick", "standard", "deep"]).optional(),
});

const DEPTH_INDEX = { quick: 1, standard: 2, deep: 3 } as const;

export async function POST(request: Request) {
  return guarded(request, Body, {
    handler: async ({ user }, body) => {
      const userId = user.session.userId;
      const previous = await progress.get(userId, body.chapterSlug);

      let notesRead = previous?.notesRead ?? 0;
      if (body.event === "notes_read" || body.event === "note_depth_read") {
        notesRead = Math.min(3, Math.max(notesRead, DEPTH_INDEX[body.depth ?? "standard"]));
      }

      const newMastery = masteryScore({
        quizScore: previous?.quizScore ?? null,
        notesRead,
        reviewsCompleted: previous?.reviewsCompleted ?? 0,
      });

      const updated = await progress.upsert(userId, body.chapterSlug, {
        notesRead,
        masteryScore: newMastery,
        status: statusFor(newMastery, true),
        lastReviewedAt: previous?.lastReviewedAt ?? null,
      });

      return json({ progress: updated });
    },
  });
}
