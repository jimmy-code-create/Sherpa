/**
 * Mastery score (Section 24): quiz 50% + notes read 25% + reviews 25%.
 * Every input is clamped so a bug elsewhere cannot produce a score > 100.
 */
export interface MasteryInput {
  quizScore: number | null; // 0–100, best or latest attempt
  notesRead: number; // 0–3 depth levels read
  reviewsCompleted: number; // distinct reviews, capped at 20
}

export function masteryScore({ quizScore, notesRead, reviewsCompleted }: MasteryInput): number {
  const quiz = Math.min(100, Math.max(0, quizScore ?? 0)) * 0.5;
  const notes = Math.min(1, Math.max(0, notesRead / 3)) * 100 * 0.25;
  const reviews = Math.min(1, Math.max(0, reviewsCompleted / 20)) * 100 * 0.25;
  return Math.round(Math.min(100, quiz + notes + reviews));
}

export function statusFor(score: number, hasStarted: boolean): "not_started" | "in_progress" | "mastered" {
  if (!hasStarted && score === 0) return "not_started";
  if (score >= 85) return "mastered";
  return "in_progress";
}

export function masteryLabel(score: number): string {
  if (score >= 85) return "Mastered";
  if (score >= 50) return "In progress";
  if (score > 0) return "Getting there";
  return "Not started";
}
