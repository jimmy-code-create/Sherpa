import { z } from "zod";
import { guarded, json } from "@/lib/api";
import { reportStore } from "@/lib/store";

const Body = z.object({
  chapterSlug: z.string().min(1),
  section: z.string().min(1),
  reason: z.enum(["incorrect", "offensive", "uncited", "other"]),
  detail: z.string().max(1000).default(""),
});

export async function POST(request: Request) {
  return guarded(request, Body, {
    handler: async ({ user }, body) => {
      const report = await reportStore.add({
        userId: user.session.userId,
        chapterSlug: body.chapterSlug,
        section: body.section,
        reason: body.reason,
        detail: body.detail,
      });
      return json({ ok: true, id: report.id });
    },
  });
}
