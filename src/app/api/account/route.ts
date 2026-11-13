import { z } from "zod";
import { guarded, json, fail } from "@/lib/api";
import { accountStore, consentStore, users } from "@/lib/store";
import { notesToMarkdown } from "@/lib/ai/notes";
import { notesStore, progress, quizStore, reviewStore, roadmapStore } from "@/lib/store";
import { verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

const Body = z.object({
  confirm: z.literal("DELETE"),
  password: z.string().min(1),
});

/** Data export (Section 37.4 — portability within 24h; instant here). */
export async function GET() {
  return guardedGet();
}

async function guardedGet() {
  const { getCurrentUser } = await import("@/lib/session");
  const current = await getCurrentUser();
  if (!current) return fail("Sign in to continue", 401);
  const userId = current.session.userId;

  const [exported, allNotes, userQuizzes, cards, chapterProgress] = await Promise.all([
    accountStore.fullExport(userId),
    notesStore.all(),
    quizStore.forUser(userId),
    reviewStore.forUser(userId),
    progress.forUser(userId),
  ]);
  const roadmaps = await Promise.all(
    chapterProgress.map((p) => roadmapStore.get(userId, p.chapterSlug)),
  );

  const markdown = allNotes
    .filter((n) => chapterProgress.some((p) => p.chapterSlug === n.chapterSlug))
    .map((n) => notesToMarkdown(n.notes))
    .join("\n\n---\n\n");

  return json({
    format: "sherpa-export-v1",
    json: {
      ...exported,
      quizAttempts: userQuizzes,
      reviewCards: cards,
      progress: chapterProgress,
      roadmaps: roadmaps.filter(Boolean),
    },
    markdown,
    consentHistory: await consentStore.all(),
  });
}

export async function DELETE(request: Request) {
  return guarded(request, Body, {
    handler: async ({ user }, body) => {
      const record = await users.findById(user.session.userId);
      if (!record?.passwordHash || !verifyPassword(body.password, record.passwordHash)) {
        return fail("Password doesn't match our records", 400, { code: "BAD_PASSWORD" });
      }
      await accountStore.deleteAccount(user.session.userId);
      const jar = await cookies();
      jar.delete(SESSION_COOKIE);
      return json({ ok: true, deleted: true });
    },
  });
}
