/**
 * Token-bucket rate limiter. Upstash Redis when configured, in-memory otherwise.
 *
 * Contract limits (Section 37.3 / 39.1):
 *   - notes:          3/day free tier (10/day pro)
 *   - roadmap:        1 generation + 3 regenerations/day free
 *   - quiz generation 10/day free
 *   - tutor          12 messages / 10 minutes
 */
export interface RateLimitRule {
  windowSeconds: number;
  max: number;
}

export const RATE_LIMITS = {
  notes: { windowSeconds: 86_400, max: 3 },
  notesPro: { windowSeconds: 86_400, max: 10 },
  roadmap: { windowSeconds: 86_400, max: 1 },
  roadmapRegen: { windowSeconds: 86_400, max: 3 },
  quiz: { windowSeconds: 86_400, max: 10 },
  tutor: { windowSeconds: 600, max: 12 },
  resources: { windowSeconds: 86_400, max: 30 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitName = keyof typeof RATE_LIMITS;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfterSeconds: number;
}

const memory = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  identifier: string,
  ruleName: RateLimitName,
  rule: RateLimitRule = RATE_LIMITS[ruleName],
): Promise<RateLimitResult> {
  const key = `ratelimit:${ruleName}:${identifier}`;
  const now = Date.now();

  if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    try {
      const res = await fetch(`${process.env.UPSTASH_REDIS_URL}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, String(rule.windowSeconds), "NX"],
          ["TTL", key],
        ]),
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as { result: (number | string)[] }[];
        const count = Number(data[0]?.result ?? 1);
        const ttl = Number(data[2]?.result ?? rule.windowSeconds);
        return {
          allowed: count <= rule.max,
          remaining: Math.max(0, rule.max - count),
          limit: rule.max,
          resetAt: now + ttl * 1000,
          retryAfterSeconds: ttl,
        };
      }
    } catch {
      // fall through
    }
  }

  const hit = memory.get(key);
  if (!hit || hit.resetAt < now) {
    const resetAt = now + rule.windowSeconds * 1000;
    memory.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: rule.max - 1,
      limit: rule.max,
      resetAt,
      retryAfterSeconds: rule.windowSeconds,
    };
  }
  hit.count += 1;
  return {
    allowed: hit.count <= rule.max,
    remaining: Math.max(0, rule.max - hit.count),
    limit: rule.max,
    resetAt: hit.resetAt,
    retryAfterSeconds: Math.ceil((hit.resetAt - now) / 1000),
  };
}

export function resetRateLimits(): void {
  memory.clear();
}
