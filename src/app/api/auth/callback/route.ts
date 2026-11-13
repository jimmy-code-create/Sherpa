import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/auth";
import { profiles, users } from "@/lib/store";
import { fail } from "@/lib/api";

/**
 * Google OAuth is not configured in this build (no client secret in the
 * environment), so the callback route returns a truthful, actionable message
 * rather than pretending to have signed someone in. See SETUP.md.
 */
const Body = z.object({ email: z.string().email() });

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      code: "OAUTH_NOT_CONFIGURED",
      message:
        "Google sign-in needs a Google OAuth client (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) plus a Supabase provider. See SETUP.md → Authentication. Use email sign-in for now.",
    },
    { status: 501 },
  );
}

/** Demo-mode federated sign-in used only when ALLOW_DEMO_OAUTH=true. */
export async function POST(request: Request) {
  if (process.env.ALLOW_DEMO_OAUTH !== "true") {
    return fail("Google sign-in is not configured. See SETUP.md.", 501);
  }
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Invalid email", 422);

  const email = parsed.data.email.toLowerCase();
  const existing = await users.findByEmail(email);
  const user =
    existing ??
    (await users.create({
      email,
      passwordHash: null,
      role: "user",
      emailVerified: true,
      verificationCode: null,
      verificationExpires: null,
      provider: "google",
    }));

  await profiles.upsert(user.id, {});
  const token = signSession({ userId: user.id, email: user.email, role: user.role, iat: Date.now() });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return NextResponse.json({ ok: true, next: "/onboarding/welcome" });
}
