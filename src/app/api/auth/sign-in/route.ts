import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifyPassword } from "@/lib/auth";
import { profiles, users } from "@/lib/store";
import { fail } from "@/lib/api";
import { checkRateLimit } from "@/lib/ai/ratelimit";

const Body = z.object({ email: z.string().min(3), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Enter your email and password", 422);

  const email = parsed.data.email.trim().toLowerCase();
  const gate = await checkRateLimit(`signin:${email}`, "tutor");
  if (!gate.allowed) {
    return fail(`Too many attempts. Try again in ${gate.retryAfterSeconds}s.`, 429, {
      retryAfterSeconds: gate.retryAfterSeconds,
    });
  }

  const user = await users.findByEmail(email);
  if (!user || !user.passwordHash || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return fail("That email and password don't match", 401, { code: "BAD_CREDENTIALS" });
  }

  if (!user.emailVerified) {
    return fail("Verify your email to continue", 403, {
      code: "UNVERIFIED",
      verificationCode: process.env.NODE_ENV !== "production" ? user.verificationCode : undefined,
    });
  }

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

  return NextResponse.json({
    ok: true,
    next: profile.onboardingComplete ? "/app" : "/onboarding/welcome",
  });
}
