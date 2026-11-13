import { z } from "zod";
import { getCached, setCached } from "../cache";

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly readonlyIssues?: z.ZodIssue[],
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ValidationError";
  }
}

export interface ValidationOptions {
  /** Cache key used as a fallback when both attempts fail. */
  cacheKey?: string;
  /** Attempts before falling back. Contract mandates 2 (one retry). */
  attempts?: number;
}

/**
 * Every AI output passes through here before anything renders.
 *
 * Flow (Rubric criterion 3):
 *   1. raw generator → JSON.parse → schema.parse
 *   2. on failure, retry exactly once
 *   3. on second failure, fall back to a cached artifact if one exists
 *   4. otherwise throw ValidationError so the UI can render an `[unavailable]`
 *      section instead of crashing
 */
export async function generateWithValidation<T>(
  rawGenerator: (attempt: number) => Promise<string>,
  schema: z.ZodType<T>,
  options: ValidationOptions = {},
): Promise<{ data: T; source: "generated" | "cache"; attempts: number }> {
  const attempts = options.attempts ?? 2;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const raw = await rawGenerator(attempt);
      const json: unknown = JSON.parse(raw);
      const data = schema.parse(json);
      return { data, source: "generated", attempts: attempt + 1 };
    } catch (err) {
      lastError = err;
    }
  }

  if (options.cacheKey) {
    const cached = await getCached<T>(options.cacheKey);
    if (cached) return { data: cached, source: "cache", attempts };
  }

  throw new ValidationError(
    "AI output failed schema validation after retry",
    lastError instanceof z.ZodError ? lastError.issues : undefined,
    { cause: lastError },
  );
}

/** Non-throwing variant for UI paths that must degrade gracefully. */
export async function tryValidate<T>(
  raw: string,
  schema: z.ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const parsed = schema.parse(JSON.parse(raw));
    return { ok: true, data: parsed };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Unknown validation error" };
  }
}

/** Persist a validated artifact so the cache fallback path has something to serve. */
export async function cacheValidated<T>(cacheKey: string, data: T): Promise<void> {
  await setCached(cacheKey, data);
}
