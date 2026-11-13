import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { requireUser } from "@/lib/session";
import { progress } from "@/lib/store";
import { allSubjectsOnPath, resolveSubject } from "@/lib/curriculum/catalog";
import { SUBJECTS } from "@/lib/curriculum/chapters";
import { EmptyState } from "@/components/ui";
import { CommandPaletteTrigger } from "@/components/command-palette";
import { SubjectLibrary, type LibrarySubject } from "@/components/subject-library";

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

  function toLibrary(subject: NonNullable<ReturnType<typeof resolveSubject>>): LibrarySubject {
    const done = subject.chapters.filter((c) =>
      userProgress.some((p) => p.chapterSlug === c.slug && p.status === "mastered"),
    ).length;
    const started = subject.chapters.filter((c) =>
      userProgress.some((p) => p.chapterSlug === c.slug && p.status !== "not_started"),
    ).length;
    const videos = subject.chapters.reduce((n, c) => n + (c.videos?.length ?? 0), 0);
    return {
      slug: subject.slug,
      name: subject.name,
      color: subject.color,
      blurb: subject.blurb,
      meta: `${subject.curriculum.name} · ${subject.level.name} · ${subject.country.name}`,
      chapters: subject.chapters.length,
      videos,
      done,
      started,
      pct: subject.chapters.length ? Math.round((done / subject.chapters.length) * 100) : 0,
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Subject library</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          Everything on your path ({profile.curriculumSlug}), plus the rest of the catalogue — with lectures where we
          have them.
        </p>
      </div>

      <div className="max-w-md">
        <CommandPaletteTrigger />
        <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[var(--fg-muted)]">
          <Search className="size-3.5" aria-hidden="true" /> or press ⌘K anywhere to jump to a chapter
        </p>
      </div>

      {onPath.length > 0 ? (
        <SubjectLibrary onPath={onPath.map(toLibrary)} others={others.map(toLibrary)} />
      ) : (
        <EmptyState
          icon={<BookOpen className="size-8" aria-hidden="true" />}
          title="Your path isn't set yet"
          description="Onboarding picks a country, board and level. It takes under a minute and every step is skippable."
          action={<Link href="/onboarding/country" className="btn btn-primary">Set my path</Link>}
        />
      )}
    </div>
  );
}
