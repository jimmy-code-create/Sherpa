import Link from "next/link";
import { Flame, RotateCcw, Play, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/session";
import { progress, quizStore, reviewStore } from "@/lib/store";
import { allSubjectsOnPath, resolveSubject } from "@/lib/curriculum/catalog";
import { chaptersForSubject } from "@/lib/curriculum/chapters";
import { masteryLabel, statusFor } from "@/lib/mastery";
import { Card, ProgressBar, ProgressRing, Badge, EmptyState, ButtonLink } from "@/components/ui";

export const dynamic = "force-dynamic";

function statusIcon(status: string) {
  if (status === "mastered") return <span aria-hidden="true">✅</span>;
  if (status === "in_progress") return <span aria-hidden="true">◐</span>;
  return <span aria-hidden="true">○</span>;
}

export default async function DashboardPage() {
  const { user, profile } = await requireUser("/app");

  const userProgress = await progress.forUser(user.id);
  const due = await reviewStore.due(user.id);
  const subjects = allSubjectsOnPath(
    profile.countryCode,
    profile.curriculumSlug,
    profile.levelSlug,
  );

  const inProgress = userProgress
    .filter((p) => p.status !== "not_started")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const last = inProgress[0];

  // Streak from activity: consecutive days with a review or a quiz attempt.
  const attempts = await quizStore.forUser(user.id);
  const activityDays = new Set(
    [...userProgress.map((p) => p.lastReviewedAt), ...attempts.map((a) => a.createdAt)]
      .filter((d): d is string => Boolean(d))
      .map((d) => d.slice(0, 10)),
  );
  let streak = 0;
  for (let i = 0; ; i++) {
    const day = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    if (activityDays.has(day)) streak++;
    else if (i === 0) continue; // today may not have activity yet
    else break;
  }

  const todaysPlan = last
    ? [
        { label: `Read the ${last.chapterSlug === last.chapterSlug ? "notes" : "notes"} for your current chapter`, href: `/app/chapters/${last.chapterSlug}?tab=notes`, minutes: 10 },
        { label: "Answer 5 practice questions", href: `/app/chapters/${last.chapterSlug}?tab=practice`, minutes: 8 },
        { label: due.length > 0 ? `Review ${due.length} due card${due.length === 1 ? "" : "s"}` : "Skim your roadmap milestones", href: due.length > 0 ? "/app/review" : `/app/chapters/${last.chapterSlug}?tab=roadmap`, minutes: 6 },
      ]
    : [
        { label: "Pick your first subject", href: "/app/subjects", minutes: 2 },
        { label: "Open any chapter — notes are one tap in", href: "/app/subjects", minutes: 3 },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">
          {profile.displayName ? `Hi, ${profile.displayName}` : "Today"}
        </h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          {profile.curriculumSlug ? "Your path is set. Here is where you stand." : "Set up your path to get a personalised plan."}
        </p>
      </div>

      {/* Resume hero */}
      {last ? (
        <Card className="border-[var(--brand-primary)] bg-[linear-gradient(135deg,#EEF2FF_0%,#FAFAF9_100%)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                Resume learning
              </p>
              <p className="mt-1 truncate font-display text-[1.25rem] font-extrabold text-[var(--fg-primary)]">
                {last.chapterSlug.split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ")}
              </p>
              <p className="mt-1 text-[13.5px] text-[var(--fg-secondary)]">
                {masteryLabel(last.masteryScore)} · {last.masteryScore}% mastery
              </p>
            </div>
            <ButtonLink href={`/app/chapters/${last.chapterSlug}?tab=notes`}>
              Continue <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <ProgressBar value={last.masteryScore} className="mt-4" label={`Mastery for ${last.chapterSlug}`} />
        </Card>
      ) : (
        <Card className="bg-[linear-gradient(135deg,#EEF2FF_0%,#FAFAF9_100%)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                Start here
              </p>
              <p className="mt-1 font-display text-[1.25rem] font-extrabold text-[var(--fg-primary)]">
                Your first chapter is one tap away.
              </p>
            </div>
            <ButtonLink href="/app/subjects">
              Browse subjects <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="flex items-center gap-2 font-display text-[13px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
            <Sparkles className="size-4" aria-hidden="true" /> Today&apos;s plan
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {todaysPlan.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] px-1.5 py-1 text-[13.5px] font-semibold text-[var(--fg-primary)] hover:bg-[var(--bg-subtle)]"
                >
                  <span className="truncate">{item.label}</span>
                  <span className="shrink-0 text-[12px] text-[var(--fg-muted)]">{item.minutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <p className="flex items-center gap-2 font-display text-[13px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
            <Flame className="size-4 text-[#f59e0b]" aria-hidden="true" /> Streak
          </p>
          <p className="mt-2 font-display text-[1.7rem] font-extrabold leading-none text-[var(--fg-primary)]">
            {streak} <span className="text-[14px] font-bold text-[var(--fg-muted)]">day{streak === 1 ? "" : "s"}</span>
          </p>
          <p className="mt-1.5 text-[12.5px] text-[var(--fg-secondary)]">
            {streak === 0 ? "Today is a fresh start." : "Keep it going — review anything to hold it."}
          </p>
        </Card>
        <Card className="p-4">
          <p className="flex items-center gap-2 font-display text-[13px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
            <RotateCcw className="size-4" aria-hidden="true" /> Due for review
          </p>
          <p className="mt-2 font-display text-[1.7rem] font-extrabold leading-none text-[var(--fg-primary)]">
            {due.length}
          </p>
          <p className="mt-1.5 text-[12.5px] text-[var(--fg-secondary)]">
            {due.length === 0 ? (
              <>You&apos;re all caught up 🎉</>
            ) : (
              <Link href="/app/review" className="font-bold text-[var(--brand-primary)] underline">
                Start review →
              </Link>
            )}
          </p>
        </Card>
      </div>

      {/* Subject grid */}
      <section aria-labelledby="subjects-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="subjects-heading" className="font-display text-lg font-extrabold text-[var(--fg-primary)]">
            Your subjects
          </h2>
          <Link href="/app/subjects" className="text-[13.5px] font-bold text-[var(--brand-primary)] underline">
            View all
          </Link>
        </div>
        {subjects.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="size-8" aria-hidden="true" />}
            title="No subjects on this path yet"
            description="Pick a country, board and level in onboarding and subjects appear here."
            action={<ButtonLink href="/onboarding/country">Choose your path</ButtonLink>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {subjects.map((subject) => {
              const chapters = chaptersForSubject(subject.slug);
              const done = chapters.filter((c) =>
                userProgress.some((p) => p.chapterSlug === c.slug && p.status === "mastered"),
              ).length;
              const inProg = chapters.filter((c) =>
                userProgress.some((p) => p.chapterSlug === c.slug && p.status === "in_progress"),
              );
              const pct = chapters.length ? Math.round((done / chapters.length) * 100) : 0;
              return (
                <Card key={subject.slug} hover className="p-4">
                  <Link href={`/app/subjects/${subject.slug}`} className="block">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex size-9 items-center justify-center rounded-[10px] text-white"
                          style={{ background: subject.color }}
                          aria-hidden="true"
                        >
                          <BookOpen className="size-4" />
                        </span>
                        <div>
                          <h3 className="font-display text-[15.5px] font-extrabold text-[var(--fg-primary)]">
                            {subject.name}
                          </h3>
                          <p className="text-[12px] text-[var(--fg-muted)]">
                            {chapters.length} chapters · {subject.level.name}
                          </p>
                        </div>
                      </div>
                      <ProgressRing value={pct} size={44} stroke={5} label={`${pct}% of ${subject.name} mastered`} />
                    </div>
                    <ProgressBar value={pct} className="mt-3" label={`Progress in ${subject.name}`} />
                    {inProg.length > 0 ? (
                      <p className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--brand-primary)]">
                        <Play className="size-3.5" aria-hidden="true" /> Continue: {inProg[0]!.slug.split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ")}
                      </p>
                    ) : null}
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Chapter list with progress */}
      {inProgress.length > 0 ? (
        <section aria-labelledby="chapters-heading">
          <h2 id="chapters-heading" className="mb-3 font-display text-lg font-extrabold text-[var(--fg-primary)]">
            Chapters in progress
          </h2>
          <Card className="divide-y divide-[var(--border-default)]">
            {inProgress.slice(0, 6).map((p) => {
              const status = statusFor(p.masteryScore, true);
              return (
                <Link
                  key={p.chapterSlug}
                  href={`/app/chapters/${p.chapterSlug}?tab=notes`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-subtle)]"
                >
                  <span className="text-lg">{statusIcon(status)}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold text-[14.5px] text-[var(--fg-primary)]">
                    {p.chapterSlug.split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                  <Badge tone={status === "mastered" ? "success" : "warning"}>{masteryLabel(p.masteryScore)}</Badge>
                  <span className="w-16 text-right text-[12.5px] font-bold tabular-nums text-[var(--fg-muted)]">
                    {p.masteryScore}%
                  </span>
                </Link>
              );
            })}
          </Card>
        </section>
      ) : null}
    </div>
  );
}
