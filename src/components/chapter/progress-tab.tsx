import Link from "next/link";
import { BarChart3, BookOpen, RotateCcw, GraduationCap, Target } from "lucide-react";
import type { ProgressRecord, QuizAttemptRecord } from "@/lib/store";
import { masteryScore } from "@/lib/mastery";
import { Badge, ButtonLink, Card, EmptyState, ProgressBar, ProgressRing } from "@/components/ui";

export function ProgressTab({
  chapterSlug,
  chapterName,
  progress,
  attempts,
  dueCount,
  targetDate,
}: {
  chapterSlug: string;
  chapterName: string;
  progress: ProgressRecord | null;
  attempts: QuizAttemptRecord[];
  dueCount: number;
  targetDate: string | null;
}) {
  const p = progress;
  const mastery = p?.masteryScore ?? 0;

  const quizPart = Math.min(100, p?.quizScore ?? 0) * 0.5;
  const notesPart = Math.min(1, (p?.notesRead ?? 0) / 3) * 100 * 0.25;
  const reviewsPart = Math.min(1, (p?.reviewsCompleted ?? 0) / 20) * 100 * 0.25;

  let readiness: number | null = null;
  if (targetDate) {
    const total = Math.max(1, new Date(targetDate).getTime() - Date.now());
    const elapsed = Math.min(1, Math.max(0, 1 - total / (90 * 86_400_000)));
    readiness = Math.round(Math.min(100, mastery * 0.7 + elapsed * 30));
  }

  if (!p) {
    return (
      <EmptyState
        icon={<BarChart3 className="size-8" aria-hidden="true" />}
        title="No progress on this chapter yet"
        description="Read the notes, run a practice quiz and do your reviews — mastery builds from all three."
        action={<ButtonLink href={`/app/chapters/${chapterSlug}?tab=notes`}>Open notes</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
      <Card className="flex flex-col items-center p-6 text-center">
        <ProgressRing value={mastery} size={110} stroke={10} label={`${mastery}% mastery for ${chapterName}`} />
        <p className="mt-3 font-display text-lg font-extrabold text-[var(--fg-primary)]">
          {mastery >= 85 ? "Mastered" : mastery >= 50 ? "In progress" : "Getting there"}
        </p>
        <p className="mt-1 text-[13px] text-[var(--fg-secondary)]">
          Mastered at 85+. Quiz 50% · notes 25% · reviews 25%.
        </p>
        {targetDate ? (
          <div className="mt-4 w-full rounded-[var(--radius-md)] bg-[#eef2ff] p-3">
            <p className="flex items-center justify-center gap-1.5 text-[13px] font-extrabold text-[#312e81]">
              <Target className="size-4" aria-hidden="true" /> Exam readiness
            </p>
            <p className="mt-1 font-display text-xl font-extrabold text-[#312e81]">
              {readiness !== null ? `${readiness}%` : "—"}
            </p>
            <p className="text-[11.5px] text-[#4338ca]">target {targetDate} · {readiness !== null && readiness >= 70 ? "on track" : "keep going"}</p>
          </div>
        ) : null}
      </Card>

      <div className="space-y-4">
        <Card className="p-5">
          <h2 className="font-display text-[16px] font-extrabold text-[var(--fg-primary)]">Mastery breakdown</h2>
          <div className="mt-4 space-y-3.5">
            <Breakdown icon={<GraduationCap className="size-4" aria-hidden="true" />} label="Quiz (50%)" value={quizPart} max={50} detail={p.quizScore !== null ? `best ${p.quizScore}%` : "no attempts yet"} />
            <Breakdown icon={<BookOpen className="size-4" aria-hidden="true" />} label="Notes read (25%)" value={notesPart} max={25} detail={`${p.notesRead}/3 depths`} />
            <Breakdown icon={<RotateCcw className="size-4" aria-hidden="true" />} label="Reviews (25%)" value={reviewsPart} max={25} detail={`${p.reviewsCompleted} done · ${dueCount} due`} />
          </div>
          <p className="mt-4 text-[12.5px] text-[var(--fg-muted)]">
            Recomputed score: {masteryScore({ quizScore: p.quizScore, notesRead: p.notesRead, reviewsCompleted: p.reviewsCompleted })}%
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[16px] font-extrabold text-[var(--fg-primary)]">Quiz history</h2>
            <Badge tone="neutral">{attempts.length} attempt{attempts.length === 1 ? "" : "s"}</Badge>
          </div>
          {attempts.length === 0 ? (
            <p className="mt-2 text-[14px] text-[var(--fg-secondary)]">
              No quizzes yet.{" "}
              <Link href={`/app/chapters/${chapterSlug}?tab=practice`} className="font-bold text-[var(--brand-primary)] underline">
                Run one now
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--border-default)]">
              {attempts.slice(-6).reverse().map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5 text-[14px]">
                  <span className="font-display font-extrabold text-[var(--fg-primary)]">
                    {a.score}/{a.total}
                  </span>
                  <ProgressBar value={Math.round((a.score / a.total) * 100)} className="flex-1" label={`Quiz attempt score`} />
                  <span className="text-[12px] text-[var(--fg-muted)]">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                  {a.weakTopics.length > 0 ? <Badge tone="danger">{a.weakTopics.length} weak</Badge> : <Badge tone="success">clean</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-[16px] font-extrabold text-[var(--fg-primary)]">Status</h2>
          <p className="mt-2 text-[14px] text-[var(--fg-secondary)]">
            {p.status === "mastered" ? "✅ Mastered" : p.status === "in_progress" ? "◐ In progress" : "○ Not started"} ·
            last reviewed {p.lastReviewedAt ? new Date(p.lastReviewedAt).toLocaleDateString() : "never"}
          </p>
        </Card>
      </div>
    </div>
  );
}

function Breakdown({
  icon,
  label,
  value,
  max,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  detail: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-center gap-2 text-[13.5px] font-bold text-[var(--fg-primary)]">
        <span className="text-[var(--brand-primary)]">{icon}</span>
        {label}
        <span className="ml-auto text-[12.5px] font-semibold text-[var(--fg-muted)]">{detail}</span>
      </div>
      <ProgressBar value={pct} className="mt-1.5" label={label} />
    </div>
  );
}
