import { NextResponse } from "next/server";
import { z } from "zod";
import { buildNotes } from "@/lib/ai/notes";
import { NoteDepthSchema } from "@/lib/schemas/notes";
import { cacheKey, getCached, setCached } from "@/lib/cache";
import { guarded, json, RATE_LIMITED } from "@/lib/api";
import { checkRateLimit } from "@/lib/ai/ratelimit";
import { notesStore } from "@/lib/store";

const Body = z.object({
  chapterSlug: z.string().min(1),
  depth: NoteDepthSchema.default("standard"),
  language: z.string().min(2).default("en"),
  refresh: z.boolean().optional(),
});

export async function POST(request: Request) {
  return guarded(request, Body, {
    rateLimit: "notes",
    handler: async ({ user }, body) => {
      const key = cacheKey(["notes", body.chapterSlug, body.depth, body.language]);

      if (!body.refresh) {
        const cached = await getCached<unknown>(key);
        if (cached) return json({ notes: cached, source: "cache" });
      }

      const notes = buildNotes(body.chapterSlug, body.depth, body.language);
      if (!notes) {
        return json(
          {
            error: "Couldn't generate notes for this chapter.",
            retryable: true,
            unavailable_sections: ["big_picture", "core_concepts", "worked_examples"],
          },
          { status: 503 },
        );
      }

      await setCached(key, notes);
      await notesStore.put({
        chapterSlug: body.chapterSlug,
        depth: body.depth,
        language: body.language,
        notes,
      });
      void user;
      return json({ notes, source: "generated" });
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const chapterSlug = url.searchParams.get("chapterSlug");
  const depth = NoteDepthSchema.safeParse(url.searchParams.get("depth") ?? "standard");
  const language = url.searchParams.get("language") ?? "en";
  if (!chapterSlug || !depth.success) {
    return NextResponse.json({ error: "chapterSlug and depth are required" }, { status: 422 });
  }
  const record = await notesStore.get(chapterSlug, depth.data, language);
  if (!record) return NextResponse.json({ notes: null }, { status: 404 });
  return NextResponse.json({ notes: record.notes, generatedAt: record.generatedAt });
}
