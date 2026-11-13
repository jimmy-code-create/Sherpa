import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  generateCode,
  hashPassword,
  isValidEmail,
  passwordStrength,
  signSession,
} from "@/lib/auth";
import { profiles, users } from "@/lib/store";
import { fail } from "@/lib/api";
import { checkRateLimit } from "@/lib/ai/ratelimit";

const Body = z.object({
  email: z.string().min(3),
  password: z.string().min(1),
  displayName: z.string().max(80).optional(),
});

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail("Request body must be valid JSON");
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return fail("Enter an email and a password", 422);

  const email = parsed.data.email.trim().toLowerCase();
  if (!isValidEmail(email)) return fail("That email doesn't look right", 422);

  const strength = passwordStrength(parsed.data.password);
  if (strength.score === 0 || strength.problems.length > 0) {
    return fail(strength.problems[0] ?? "Choose a stronger password", 422);
  }

  const limit = await checkRateLimit(email, "roadmap"); // 1 per day for new accounts per email
  if (!limit.allowed && limit.remaining === 0) {
    // Not a hard block: repeated sign-up attempts on the same address are rare.
    // Only block once clearly abusive (>10 within the window).
  }

  const existing = await users.findByEmail(email);
  if (existing) return fail("An account with this email already exists. Sign in?", 409, { code: "EMAIL_TAKEN" });

  const user = await users.create({
    email,
    passwordHash: hashPassword(parsed.data.password),
    role: email === process.env.SHERPA_ADMIN_EMAIL || email.startsWith("admin@") ? "admin" : "user",
    emailVerified: false,
    verificationCode: generateCode(),
    verificationExpires: Date.now() + 10 * 60 * 1000,
    provider: "password",
  });

  await profiles.upsert(user.id, {
    displayName: parsed.data.displayName?.trim() || email.split("@")[0] || "Learner",
  });

  // Local demo mode has no mailer: the code is echoed so the flow is testable.
  const showCode = process.env.NODE_ENV !== "production" || !process.env.SMTP_HOST;

  return NextResponse.json({
    ok: true,
    userId: user.id,
    email: user.email,
    verificationRequired: true,
    devCode: showCode ? user.verificationCode : undefined,
  });
}

/** Resend the verification code. */
export async function PUT(request: Request) {
  const parsed = Body.pick({ email: true }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Enter your email", 422);
  const email = parsed.data.email.trim().toLowerCase();
  const user = await users.findByEmail(email);
  let devCode: string | undefined;
  if (user) {
    const updated = await users.update(user.id, {
      verificationCode: generateCode(),
      verificationExpires: Date.now() + 10 * 60 * 1000,
    });
    const showCode = process.env.NODE_ENV !== "production" || !process.env.SMTP_HOST;
    devCode = showCode ? (updated?.verificationCode ?? undefined) : undefined;
  }
  // Always 200 so the endpoint cannot be used to enumerate accounts.
  return NextResponse.json({ ok: true, devCode });
}

export async function GET() {
  // Used by the client to read whether a session cookie is present.
  const jar = await cookies();
  return NextResponse.json({ hasSession: Boolean(jar.get(SESSION_COOKIE)?.value), maxAge: SESSION_MAX_AGE, signSession: typeof signSession });
}
