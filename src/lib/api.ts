import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, type AuthedUser } from "./session";
import { checkRateLimit, type RateLimitName } from "./ai/ratelimit";

export function json<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>): NextResponse {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export const UNAUTHENTICATED = () =>
  NextResponse.json({ error: "Sign in to continue" }, { status: 401 });

export const RATE_LIMITED = (retryAfterSeconds: number, limit: number) =>
  NextResponse.json(
    {
      error: `Rate limit reached (${limit} per window). Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
      retryAfterSeconds,
      limit,
    },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );

export interface GuardedContext {
  user: AuthedUser;
}

/**
 * Wraps a route handler with auth + Zod body validation + rate limiting.
 * Every mutation route uses this so the three checks cannot be forgotten.
 */
export async function guarded<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
  options: { rateLimit?: RateLimitName; handler: (ctx: GuardedContext, body: z.output<S>) => Promise<NextResponse> },
): Promise<NextResponse> {
  const current = await getCurrentUser();
  if (!current) return UNAUTHENTICATED();

  if (options.rateLimit) {
    const result = await checkRateLimit(current.session.userId, options.rateLimit);
    if (!result.allowed) return RATE_LIMITED(result.retryAfterSeconds, result.limit);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail("Request body must be valid JSON", 400);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return fail("Invalid request", 422, {
      issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  try {
    return await options.handler({ user: current }, parsed.data);
  } catch (err) {
    console.error(`API error on ${new URL(request.url).pathname}:`, err);
    return fail("Something went wrong on our side. Try again.", 500);
  }
}
