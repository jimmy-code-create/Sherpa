import { z } from "zod";
import { guarded, json, fail } from "@/lib/api";
import { reportStore } from "@/lib/store";

const Body = z.object({
  id: z.string().min(1),
  status: z.enum(["open", "in_review", "resolved", "dismissed"]),
});

/** Admin-only moderation of user content reports. */
export async function PATCH(request: Request) {
  return guarded(request, Body, {
    handler: async ({ user }, body) => {
      if (user.user.role !== "admin") return fail("Admin only", 403);
      const updated = await reportStore.update(body.id, body.status);
      if (!updated) return fail("Report not found", 404);
      return json({ report: updated });
    },
  });
}
