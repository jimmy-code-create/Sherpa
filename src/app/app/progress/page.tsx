import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { requireUser } from "@/lib/session";
import { progress, quizStore, reviewStore } from "@/lib/store";
import { resolveChapter } from "@/lib/curriculum/catalog";
import { masteryLabel } from "@/lib/mastery";
import { Badge, Card, EmptyState, ProgressBar, ProgressRing, ButtonLink } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const { user, profile } = await requireUser("/app/progress");
  const [records, attempts, cards] = await Promise.all([
    progress.forUser(user.id),
    quizStore.forUser(user.id),
    reviewStore.forUser(user.id),
  ]);

  const started = records.filter((r) => r.status !== "not_started");
  const mastered = records.filter((r) => r.status === "mastered").length;
  const avg = started.length
    ? Math.round(started.reduce((s, r) => s + r.masteryScore, 0) / started.length)
    : 0;
  const totalReviews = records.reduce((s, r) => s + r.reviewsCompleted, 0);
  const due = cards.filter((c) => new Date(c.dueAt).getTime() <= Date.now()).length;

  // Activity heatmap: last 12 weeks
  const weeks: { label: string; count: number }[] = [];
  const dayCounts = new Map<string, number>();
  for (const a of attempts) {
    const d = a.createdAt.slice(0, 10)!;
    dayCounts.set(d, (dayCounts.get(d) ?? 0) + 1);
  }
  for (const r of records) {
    if (r.lastReviewedAt) {
      const d = r.lastReviewedAt.slice(0, 10);
      dayCounts.set(d, (dayCounts.get(d) ?? 0) + 1);
    }
  }
  for (let w = 11; w >= 0; w--) {
    const start = new Date(Date.now() - (w * 7 + 6) * 86_400_000);
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(start.getTime() + i * 86_400_000).toISOString().slice(0, 10);
      count += dayCounts.get(d) ?? 0;
    }
    weeks.push({ label: start.toISOString().slice(8, 10) + "/" + start.toISOString().slice(5, 7), count });
  }
  const maxWeek = Math.max(1, ...weeks.map((w) => w.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Progress</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          Mastery = quiz 50% + notes 25% + reviews 25%. Mastered at 85+.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Chapters started" value={String(started.length)} />
        <Stat label="Mastered" value={String(mastered)} tone="success" />
        <Stat label="Average mastery" value={`${avg}%`} />
        <Stat label="Reviews done" value={`${totalReviews} (${due} due)`} />
      </div>

      <Card className="p-5">
        <h2 className="font-display text-[16px] font-extrabold text-[var(--fg-primary)]">Activity — last 12 weeks</h2>
        <div className="mt-4 flex items-end gap-1.5" role="img" aria-label={`Weekly activity chart. Busiest week: ${Math.max(...weeks.map((w) => w.count))} sessions.`}>
          {weeks.map((w, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-[4px] bg-[var(--brand-primary)]"
                style={{
                  height: `${Math.max(4, (w.count / maxWeek) * 64)}px`,
                  opacity: w.count === 0 ? 0.15 : 0.35 + (w.count / maxWeek) * 0.65,
                }}
                title={`Week of ${w.label}: ${w.count} session${w.count === 1 ? "" : "s"}`}
              />
              <span className="text-[10px] font-semibold text-[var(--fg-muted)]">{w.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {started.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="size-8" aria-hidden="true" />}
          title="Nothing tracked yet"
          description="Open a chapter, read its notes and run a quiz — progress appears here."
          action={<ButtonLink href="/app/subjects">Browse subjects</ButtonLink>}
        />
      ) : (
        <Card className="divide-y divide-[var(--border-default)] p-0">
          {started
            .sort((a, b) => b.masteryScore - a.masteryScore)
            .map((r) => {
              const resolved = resolveChapter(r.chapterSlug);
              const name = resolved?.chapter.name ?? r.chapterSlug;
              return (
                <Link
                  key={r.chapterSlug}
                  href={`/app/chapters/${r.chapterSlug}?tab=progress`}
                  className="flex items-center gap-4 px-4 py-3.5 hover:bg-[var(--bg-subtle)]"
                >
                  <ProgressRing value={r.masteryScore} size={44} stroke={5} label={`${r.masteryScore}% mastery for ${name}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[15px] font-extrabold text-[var(--fg-primary)]">{name}</span>
                    <span className="block text-[12.5px] text-[var(--fg-muted)]">
                      quiz {r.quizScore ?? "—"}% · {r.notesRead}/3 depths read · {r.reviewsCompleted} reviews
                    </span>
                  </span>
                  <ProgressBar value={r.masteryScore} className="hidden w-32 sm:block" label={`Mastery for ${name}`} />
                  <Badge tone={r.status === "mastered" ? "success" : "warning"}>{masteryLabel(r.masteryScore)}</Badge>
                </Link>
              );
            })}
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <Card className="p-4">
      <p className="text-[12px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">{label}</p>
      <p className={`mt-1.5 font-display text-[1.6rem] font-extrabold leading-none ${tone === "success" ? "text-[#059669]" : "text-[var(--fg-primary)]"}`}>
        {value}
      </p>
    </Card>
  );
}
