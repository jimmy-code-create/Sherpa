import { describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimits, RATE_LIMITS } from "@/lib/ai/ratelimit";

describe("Rate limiter (Section 37.3)", () => {
  it("11th pro notes request in 24h is rejected with retryAfter", async () => {
    resetRateLimits();
    const id = "rl-test-user";
    for (let i = 0; i < RATE_LIMITS.notesPro.max; i++) {
      const r = await checkRateLimit(id, "notesPro");
      expect(r.allowed).toBe(true);
    }
    const eleventh = await checkRateLimit(id, "notesPro");
    expect(eleventh.allowed).toBe(false);
    expect(eleventh.retryAfterSeconds).toBeGreaterThan(0);
    expect(eleventh.limit).toBe(10);
  });

  it("free tier allows 3 notes/day, 4th is rejected", async () => {
    resetRateLimits();
    const id = "rl-test-free";
    for (let i = 0; i < 3; i++) {
      expect((await checkRateLimit(id, "notes")).allowed).toBe(true);
    }
    expect((await checkRateLimit(id, "notes")).allowed).toBe(false);
  });

  it("limits are per identifier", async () => {
    resetRateLimits();
    await checkRateLimit("a", "quiz");
    expect((await checkRateLimit("b", "quiz")).allowed).toBe(true);
  });
});
