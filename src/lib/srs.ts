/**
 * SM-2 spaced repetition.
 *
 * Quality ratings map to the four UI buttons:
 *   again = 0, hard = 3, good = 4, easy = 5
 *
 * On a lapse (quality < 3) the interval resets to 1 day and repetitions to 0,
 * while the ease factor decays but never falls below 1.3.
 */
export type Rating = "again" | "hard" | "good" | "easy";

export const RATING_QUALITY: Record<Rating, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

export interface SrsState {
  ease: number;
  interval: number;
  repetitions: number;
}

export interface SrsResult extends SrsState {
  dueAt: Date;
}

export function schedule(state: SrsState, rating: Rating, now = new Date()): SrsResult {
  const q = RATING_QUALITY[rating];

  let { ease, interval, repetitions } = state;
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * ease);
  }

  interval = Math.max(1, Math.min(365, interval));
  const dueAt = new Date(now.getTime() + interval * 86_400_000);
  return { ease: Number(ease.toFixed(2)), interval, repetitions, dueAt };
}

export function isDue(dueAt: string | Date, now = new Date()): boolean {
  return new Date(dueAt).getTime() <= now.getTime();
}
