import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { requireUser } from "@/lib/session";
import { progress } from "@/lib/store";
import { allSubjectsOnPath, resolveSubject } from "@/lib/curriculum/catalog";
import { SUBJECTS } from "@/lib/curriculum/chapters";
import { Card, ProgressBar, EmptyState, Badge } from "@/components/ui";
import { CommandPaletteTrigger } from "@/components/command-palette";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const { user, profile } = await requireUser("/app/subjects");
  const userProgress = await progress.forUser(user.id);

  const onPath = allSubjectsOnPath(profile.countryCode, profile.curriculumSlug, profile.levelSlug);
  const onPathSlugs = new Set(onPath.map((s) => s.slug));
  const others = SUBJECTS.map((s) => resolveSubject(s.slug)).filter(
    (s): s is NonNullable<ReturnType<typeof resolveSubject>> =>
      Boolean(s) && !onPathSlugs.has((s as NonNullable<ReturnType<typeof resolveSubject>>).slug),
  );

  function card(subject: NonNullable<ReturnType<typeof resolveSubject>>) {
    const done = subject.chapters.filter((c) =>
      userProgress.some((p) => p.chapterSlug === c.slug && p.status === "mastered"),
    ).length;
    const started = subject.chapters.filter((c) =>
      userProgress.some((p) => p.chapterSlug === c.slug && p.status !== "not_started"),
    ).length;
    const pct = subject.chapters.length ? Math.round((done / subject.chapters.length) * 100) : 0;
    return (
      <Card key={subject.slug} hover className="p-4">
        <Link href={`/app/subjects/${subject.slug}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex size-10 items-center justify-center rounded-[12px] text-white"
                style={{ background: subject.color }}
                aria-hidden="true"
              >
                <BookOpen className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-[16px] font-extrabold text-[var(--fg-primary)]">{subject.name}</h2>
                <p className="text-[12px] font-semibold text-[var(--fg-muted)]">
                  {subject.curriculum.name} · {subject.level.name} · {subject.country.name}
                </p>
              </div>
            </div>
            {started > 0 ? (
              <Badge tone="warning">◐ {started} started</Badge>
            ) : (
              <Badge tone="neutral">○ not started</Badge>
            )}
          </div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--fg-secondary)]">{subject.blurb}</p>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={pct} className="flex-1" label={`Progress in ${subject.name}`} />
            <span className="text-[12.5px] font-bold tabular-nums text-[var(--fg-muted)]">
              {done}/{subject.chapters.length}
            </span>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Subjects</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          Everything on your path ({profile.curriculumSlug}), plus the rest of the catalogue.
        </p>
      </div>

      <div className="max-w-md">
        <CommandPaletteTrigger />
        <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[var(--fg-muted)]">
          <Search className="size-3.5" aria-hidden="true" /> or press ⌘K anywhere to jump to a chapter
        </p>
      </div>

      {onPath.length > 0 ? (
        <section aria-labelledby="on-path">
          <h2 id="on-path" className="mb-3 font-display text-[13px] font-extrabold uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            On your path
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">{onPath.map((s) => card(s))}</div>
        </section>
      ) : (
        <EmptyState
          icon={<BookOpen className="size-8" aria-hidden="true" />}
          title="Your path isn't set yet"
          description="Onboarding picks a country, board and level. It takes under a minute and every step is skippable."
          action={<Link href="/onboarding/country" className="btn btn-primary">Set my path</Link>}
        />
      )}

      {others.length > 0 ? (
        <section aria-labelledby="rest">
          <h2 id="rest" className="mb-3 font-display text-[13px] font-extrabold uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            Rest of the catalogue
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">{others.map((s) => card(s))}</div>
        </section>
      ) : null}
    </div>
  );
}
