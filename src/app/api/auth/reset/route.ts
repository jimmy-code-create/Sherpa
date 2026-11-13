import { NextResponse } from "next/server";
import { z } from "zod";
import { fail } from "@/lib/api";
import { generateCode, hashPassword, isValidEmail, passwordStrength } from "@/lib/auth";
import { users } from "@/lib/store";

const RequestBody = z.object({ email: z.string().min(3) });
const ResetBody = z.object({ email: z.string().min(3), code: z.string().min(4), password: z.string().min(1) });

/** Step 1 — request a reset code. Always 200 (no account enumeration). */
export async function POST(request: Request) {
  const parsed = RequestBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Enter your email", 422);
  const email = parsed.data.email.trim().toLowerCase();
  if (!isValidEmail(email)) return fail("That email doesn't look right", 422);

  const user = await users.findByEmail(email);
  if (user) {
    await users.update(user.id, {
      verificationCode: generateCode(),
      verificationExpires: Date.now() + 15 * 60 * 1000,
    });
  }
  return NextResponse.json({
    ok: true,
    message: "If an account exists for that email, we've sent a reset code.",
    devCode: user && process.env.NODE_ENV !== "production" ? user.verificationCode : undefined,
  });
}

/** Step 2 — consume the code and set a new password. */
export async function PUT(request: Request) {
  const parsed = ResetBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Fill in every field", 422);

  const strength = passwordStrength(parsed.data.password);
  if (strength.problems.length > 0) return fail(strength.problems[0]!, 422);

  const user = await users.findByEmail(parsed.data.email.trim().toLowerCase());
  if (!user || user.verificationCode !== parsed.data.code.trim()) {
    return fail("That code doesn't match. Try again.", 400);
  }
  if (user.verificationExpires && user.verificationExpires < Date.now()) {
    return fail("That code expired. Request a new one.", 400);
  }

  await users.update(user.id, {
    passwordHash: hashPassword(parsed.data.password),
    verificationCode: null,
    verificationExpires: null,
    emailVerified: true,
  });
  return NextResponse.json({ ok: true });
}
