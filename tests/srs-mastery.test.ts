import { describe, expect, it } from "vitest";
import { schedule, RATING_QUALITY, isDue } from "@/lib/srs";
import { masteryScore, statusFor } from "@/lib/mastery";

describe("SM-2 spaced repetition", () => {
  it("quality mapping is again=0 hard=3 good=4 easy=5", () => {
    expect(RATING_QUALITY).toEqual({ again: 0, hard: 3, good: 4, easy: 5 });
  });

  it("first good review → 1 day, second → 6 days", () => {
    const s0 = { ease: 2.5, interval: 1, repetitions: 0 };
    const r1 = schedule(s0, "good");
    expect(r1.repetitions).toBe(1);
    expect(r1.interval).toBe(1);
    const r2 = schedule(r1, "good");
    expect(r2.repetitions).toBe(2);
    expect(r2.interval).toBe(6);
  });

  it("lapse resets interval to 1 day and ease never drops below 1.3", () => {
    let state = { ease: 2.5, interval: 10, repetitions: 4 };
    for (let i = 0; i < 8; i++) {
      const r = schedule(state, "again");
      state = { ease: r.ease, interval: r.interval, repetitions: r.repetitions };
    }
    expect(state.interval).toBe(1);
    expect(state.repetitions).toBe(0);
    expect(state.ease).toBeGreaterThanOrEqual(1.3);
  });

  it("dueAt is in the future by interval days", () => {
    const now = new Date("2026-11-13T10:00:00Z");
    // repetitions: 1 → this is the second successful review → interval 6 days.
    const r = schedule({ ease: 2.5, interval: 1, repetitions: 1 }, "good", now);
    expect(r.interval).toBe(6);
    expect(r.dueAt.getTime() - now.getTime()).toBe(6 * 86_400_000);
    expect(isDue(r.dueAt, new Date(now.getTime() + 7 * 86_400_000))).toBe(true);
    expect(isDue(r.dueAt, now)).toBe(false);
  });
});

describe("Mastery score (quiz 50% + notes 25% + reviews 25%)", () => {
  it("perfect everything → 100", () => {
    expect(masteryScore({ quizScore: 100, notesRead: 3, reviewsCompleted: 20 })).toBe(100);
  });

  it("nothing → 0", () => {
    expect(masteryScore({ quizScore: null, notesRead: 0, reviewsCompleted: 0 })).toBe(0);
  });

  it("weights are 50/25/25", () => {
    expect(masteryScore({ quizScore: 80, notesRead: 0, reviewsCompleted: 0 })).toBe(40);
    expect(masteryScore({ quizScore: null, notesRead: 3, reviewsCompleted: 0 })).toBe(25);
    expect(masteryScore({ quizScore: null, notesRead: 0, reviewsCompleted: 20 })).toBe(25);
  });

  it("clamps out-of-range inputs", () => {
    expect(masteryScore({ quizScore: 500, notesRead: 99, reviewsCompleted: 999 })).toBe(100);
  });

  it("status thresholds: mastered at ≥85", () => {
    expect(statusFor(85, true)).toBe("mastered");
    expect(statusFor(84, true)).toBe("in_progress");
    expect(statusFor(0, false)).toBe("not_started");
  });
});
