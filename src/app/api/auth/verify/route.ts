import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/auth";
import { profiles, users } from "@/lib/store";
import { fail } from "@/lib/api";

const Body = z.object({ email: z.string().min(3), code: z.string().min(4).max(8) });

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Enter the 6-digit code", 422);

  const email = parsed.data.email.trim().toLowerCase();
  const user = await users.findByEmail(email);
  if (!user) return fail("That code doesn't match. Try again.", 400, { code: "NO_USER" });

  if (user.emailVerified) {
    const profile = (await profiles.get(user.id)) ?? (await profiles.upsert(user.id, {}));
    const token = signSession({ userId: user.id, email: user.email, role: user.role, iat: Date.now() });
    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return NextResponse.json({ ok: true, next: profile.onboardingComplete ? "/app" : "/onboarding/welcome" });
  }

  if (user.verificationCode !== parsed.data.code.trim()) {
    return fail("That code doesn't match. Try again.", 400, { code: "BAD_CODE" });
  }
  if (user.verificationExpires && user.verificationExpires < Date.now()) {
    return fail("That code expired. Request a new one.", 400, { code: "EXPIRED" });
  }

  await users.update(user.id, { emailVerified: true, verificationCode: null, verificationExpires: null });
  const profile = (await profiles.get(user.id)) ?? (await profiles.upsert(user.id, {}));

  const token = signSession({ userId: user.id, email: user.email, role: user.role, iat: Date.now() });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ ok: true, next: profile.onboardingComplete ? "/app" : "/onboarding/welcome" });
}
