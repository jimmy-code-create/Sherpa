import Link from "next/link";
import { Flame, RotateCcw, Play, BookOpen, ArrowRight, Sparkles, Clock3 } from "lucide-react";
import { requireUser } from "@/lib/session";
import { progress, quizStore, reviewStore } from "@/lib/store";
import { allSubjectsOnPath } from "@/lib/curriculum/catalog";
import { chaptersForSubject } from "@/lib/curriculum/chapters";
import { masteryLabel, statusFor } from "@/lib/mastery";
import { Card, ProgressBar, ProgressRing, Badge, ButtonLink } from "@/components/ui";
import { TutorAvatar, TutorBubble, miloDashboardLine } from "@/components/tutor-persona";

export const dynamic = "force-dynamic";

function statusIcon(status: string) {
  if (status === "mastered") return <span aria-hidden="true">✅</span>;
  if (status === "in_progress") return <span aria-hidden="true">◐</span>;
  return <span aria-hidden="true">○</span>;
}

function titleCase(slug: string) {
  return slug.split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ");
}

function greeting(name?: string): string {
  const h = new Date().getHours();
  const tod = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  return name ? `Good ${tod}, ${name}.` : `Good ${tod}.`;
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

  const masteredCount = userProgress.filter((p) => p.status === "mastered").length;

  const sessionMinutes = 15;
  const todaysPlan = last
    ? [
        { label: "Read the notes for your current chapter", href: `/app/chapters/${last.chapterSlug}?tab=notes`, minutes: 10 },
        { label: "Answer 5 practice questions", href: `/app/chapters/${last.chapterSlug}?tab=practice`, minutes: 8 },
        { label: due.length > 0 ? `Review ${due.length} due card${due.length === 1 ? "" : "s"}` : "Skim your roadmap milestones", href: due.length > 0 ? "/app/review" : `/app/chapters/${last.chapterSlug}?tab=roadmap`, minutes: 6 },
      ]
    : [
        { label: "Pick your first subject", href: "/app/subjects", minutes: 2 },
        { label: "Open any chapter — notes are one tap in", href: "/app/subjects", minutes: 3 },
      ];

  const heroChapter = last ? titleCase(last.chapterSlug) : null;
  const miloLine = miloDashboardLine({
    name: profile.displayName || undefined,
    chapterTitle: heroChapter ?? undefined,
    minutes: sessionMinutes,
    hasSubjects: subjects.length > 0,
    dueCount: due.length,
  });

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6">
      {/* ── Main column (2/3 on desktop): greeting, Milo hero, subjects, chapters ── */}
      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="font-display text-[1.8rem] font-extrabold leading-tight text-[var(--fg-primary)]">
            {greeting(profile.displayName)}
          </h1>
          <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
            {profile.curriculumSlug
              ? "Milo has your plan ready. Here is where you stand."
              : "Set up your path to get a personalised plan."}
          </p>
        </div>

        {/* Milo hero — resume or empty-state action card */}
        {last && subjects.length > 0 ? (
          <Card className="overflow-hidden border-[var(--brand-primary)]/40 bg-[linear-gradient(135deg,#EEF2FF_0%,#FAFAF9_100%)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <TutorAvatar size={64} mood={due.length > 0 ? "curious" : "happy"} className="shrink-0" />
              <TutorBubble tail="left" className="min-w-0 flex-1 border-transparent bg-white/80 shadow-none">
                <p className="text-[15px] font-semibold leading-relaxed text-[var(--fg-primary)]">{miloLine}</p>
              </TutorBubble>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 sm:pl-[80px]">
              <ButtonLink
                href={`/app/chapters/${last.chapterSlug}?tab=notes`}
                className="!min-h-[52px] !px-7 !py-3 !text-[17px] shadow-[var(--shadow-brand)]"
              >
                <Play className="size-5 fill-current" aria-hidden="true" /> Let&apos;s go
              </ButtonLink>
              <span className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--fg-muted)]">
                <Clock3 className="size-4" aria-hidden="true" /> {sessionMinutes} min session · {masteryLabel(last.masteryScore)} · {last.masteryScore}% mastery
              </span>
            </div>
            <ProgressBar value={last.masteryScore} className="mt-4 sm:ml-[80px] sm:w-[calc(100%-80px)]" label={`Mastery for ${heroChapter}`} />
          </Card>
        ) : (
          <Card className="bg-[linear-gradient(135deg,#EEF2FF_0%,#FAFAF9_100%)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <TutorAvatar size={72} mood="curious" className="shrink-0" />
              <TutorBubble tail="left" className="min-w-0 flex-1 border-transparent bg-white/80 shadow-none">
                <p className="text-[15px] font-semibold leading-relaxed text-[var(--fg-primary)]">{miloLine}</p>
              </TutorBubble>
            </div>
            <div className="mt-4 sm:pl-[88px]">
              <ButtonLink href={subjects.length > 0 ? "/app/subjects" : "/onboarding/country"} className="!min-h-[52px] !px-7 !py-3 !text-[17px] shadow-[var(--shadow-brand)]">
                {subjects.length > 0 ? (
                  <>Choose subject <ArrowRight className="size-5" aria-hidden="true" /></>
                ) : (
                  <>Choose your path <ArrowRight className="size-5" aria-hidden="true" /></>
                )}
              </ButtonLink>
            </div>
          </Card>
        )}

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
            <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <TutorAvatar size={56} mood="curious" />
              <h3 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">
                Your path is empty — let&apos;s pick a subject so I can start teaching.
              </h3>
              <p className="max-w-md text-sm text-[var(--fg-secondary)]">
                Pick a country, board and level in onboarding and subjects appear here.
              </p>
              <ButtonLink href="/onboarding/country" className="mt-1">
                Choose subject <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </Card>
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
                          <Play className="size-3.5" aria-hidden="true" /> Continue: {titleCase(inProg[0]!.slug)}
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
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-subtle)]"
                  >
                    <span className="text-lg">{statusIcon(status)}</span>
                    <span className="min-w-0 flex-1 truncate font-semibold text-[14.5px] text-[var(--fg-primary)]">
                      {titleCase(p.chapterSlug)}
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

      {/* ── Right rail (1/3 on desktop): today's session + unified stats ── */}
      <aside className="mt-6 space-y-4 lg:mt-0 lg:pt-[92px]">
        <Card className="p-5">
          <p className="flex items-center gap-2 font-display text-[13px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
            <Sparkles className="size-4 text-[var(--brand-primary)]" aria-hidden="true" /> Today&apos;s session
          </p>
          {last ? (
            <>
              <p className="mt-2 truncate font-display text-[17px] font-extrabold text-[var(--fg-primary)]">
                {heroChapter}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--fg-secondary)]">
                <Clock3 className="size-4" aria-hidden="true" /> ~{sessionMinutes} min · 3 steps
              </p>
              <ButtonLink href={`/app/chapters/${last.chapterSlug}?tab=notes`} block className="mt-3 !min-h-[48px]">
                <Play className="size-4 fill-current" aria-hidden="true" /> Start session
              </ButtonLink>
            </>
          ) : (
            <>
              <p className="mt-2 font-display text-[17px] font-extrabold text-[var(--fg-primary)]">
                No session yet
              </p>
              <p className="mt-0.5 text-[13px] font-semibold text-[var(--fg-secondary)]">
                Pick a subject to unlock your first 15-minute session.
              </p>
              <ButtonLink href="/app/subjects" block variant="secondary" className="mt-3 !min-h-[48px]">
                Browse subjects
              </ButtonLink>
            </>
          )}
          <ul className="mt-4 space-y-1 border-t border-[var(--border-default)] pt-3">
            {todaysPlan.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] px-1.5 py-1.5 text-[13px] font-semibold text-[var(--fg-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                >
                  <span className="truncate">{item.label}</span>
                  <span className="shrink-0 text-[11.5px] text-[var(--fg-muted)]">{item.minutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* Unified stats card */}
        <Card className="p-0">
          <div className="grid grid-cols-3 divide-x divide-[var(--border-default)]">
            <div className="p-4 text-center">
              <p className="flex items-center justify-center gap-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
                <Flame className="size-3.5 text-[#f59e0b]" aria-hidden="true" /> Streak
              </p>
              <p className="mt-1.5 font-display text-[1.45rem] font-extrabold leading-none text-[var(--fg-primary)]">
                {streak}
                <span className="ml-0.5 text-[12px] font-bold text-[var(--fg-muted)]">d</span>
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="flex items-center justify-center gap-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
                <RotateCcw className="size-3.5" aria-hidden="true" /> Due
              </p>
              <p className="mt-1.5 font-display text-[1.45rem] font-extrabold leading-none text-[var(--fg-primary)]">
                {due.length}
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="flex items-center justify-center gap-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
                <BookOpen className="size-3.5" aria-hidden="true" /> Mastered
              </p>
              <p className="mt-1.5 font-display text-[1.45rem] font-extrabold leading-none text-[var(--fg-primary)]">
                {masteredCount}
              </p>
            </div>
          </div>
          <div className="border-t border-[var(--border-default)] px-4 py-3">
            {due.length === 0 ? (
              <p className="text-center text-[12.5px] font-semibold text-[var(--fg-secondary)]">You&apos;re all caught up 🎉</p>
            ) : (
              <Link href="/app/review" className="block text-center text-[13px] font-bold text-[var(--brand-primary)] underline">
                Start review →
              </Link>
            )}
          </div>
        </Card>
      </aside>
    </div>
  );
}
