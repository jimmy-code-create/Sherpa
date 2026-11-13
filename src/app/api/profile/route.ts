import { z } from "zod";
import { guarded, json, UNAUTHENTICATED } from "@/lib/api";
import { profiles } from "@/lib/store";
import { getCurrentUser } from "@/lib/session";

const Body = z.object({
  displayName: z.string().max(80).optional(),
  countryCode: z.string().length(2).optional(),
  curriculumSlug: z.string().min(2).optional(),
  levelSlug: z.string().min(2).optional(),
  streamSlug: z.string().nullable().optional(),
  proficiency: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  weeklyHours: z.number().int().min(1).max(30).optional(),
  targetDate: z.string().nullable().optional(),
  language: z.string().min(2).optional(),
  onboardingComplete: z.boolean().optional(),
  plan: z.enum(["free", "pro"]).optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark", "system"]).optional(),
      reducedMotion: z.boolean().optional(),
      dyslexiaFont: z.boolean().optional(),
      highContrast: z.boolean().optional(),
      fontScale: z.union([z.literal(100), z.literal(115), z.literal(130)]).optional(),
      defaultDepth: z.enum(["quick", "standard", "deep"]).optional(),
      readingTheme: z.enum(["light", "sepia", "dark"]).optional(),
      noteFontSize: z.number().min(14).max(24).optional(),
    })
    .optional(),
});

export async function PATCH(request: Request) {
  return guarded(request, Body, {
    handler: async ({ user }, body) => {
      const merged = {
        ...body,
        preferences: { ...user.profile.preferences, ...body.preferences },
      };
      const saved = await profiles.upsert(user.session.userId, merged);
      return json({ profile: saved });
    },
  });
}

export async function GET() {
  const current = await getCurrentUser();
  if (!current) return UNAUTHENTICATED();
  return json({ profile: current.profile });
}
