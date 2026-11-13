/**
 * Tiered cache: Upstash Redis when configured, in-memory Map otherwise.
 * Notes/roadmaps carry a 30-day TTL (Section 37.3: never cache indefinitely).
 */
const TTL_SECONDS = 60 * 60 * 24 * 30;

interface Entry {
  value: unknown;
  expiresAt: number;
}

const memory = new Map<string, Entry>();

function redisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN);
}

export async function setCached<T>(key: string, value: T, ttlSeconds = TTL_SECONDS): Promise<void> {
  if (redisConfigured()) {
    try {
      const url = `${process.env.UPSTASH_REDIS_URL}/set/${encodeURIComponent(key)}?EX=${ttlSeconds}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
        cache: "no-store",
      });
      if (res.ok) return;
    } catch {
      // fall through to memory
    }
  }
  memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function getCached<T>(key: string): Promise<T | null> {
  if (redisConfigured()) {
    try {
      const res = await fetch(`${process.env.UPSTASH_REDIS_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_TOKEN}` },
        cache: "no-store",
      });
      if (res.ok) {
        const body = (await res.json()) as { result?: string | null };
        if (body.result) return JSON.parse(body.result) as T;
      }
    } catch {
      // fall through to memory
    }
  }
  const hit = memory.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    memory.delete(key);
    return null;
  }
  return hit.value as T;
}

export function cacheKey(parts: (string | number)[]): string {
  return `sherpa:${parts.join(":")}`;
}

export function clearCache(): void {
  memory.clear();
}
