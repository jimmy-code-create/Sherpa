import { json, UNAUTHENTICATED } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import { reviewStore } from "@/lib/store";

/** GET /api/review/due — cards due now (SM-2 queue head). */
export async function GET() {
  const current = await getCurrentUser();
  if (!current) return UNAUTHENTICATED();
  const due = await reviewStore.due(current.session.userId);
  const all = await reviewStore.forUser(current.session.userId);
  return json({
    due: due.map((c) => ({
      id: c.id,
      chapterSlug: c.chapterSlug,
      front: c.front,
      back: c.back,
      dueAt: c.dueAt,
      interval: c.interval,
      ease: c.ease,
    })),
    total: all.length,
    upcoming: all.filter((c) => new Date(c.dueAt).getTime() > Date.now()).length,
  });
}

export const dynamic = "force-dynamic";
