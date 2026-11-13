import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Lock } from "lucide-react";
import { requireUser } from "@/lib/session";
import { progress } from "@/lib/store";
import { resolveSubject } from "@/lib/curriculum/catalog";
import { masteryLabel } from "@/lib/mastery";
import { Card, Badge, ProgressBar, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  if (status === "mastered") return <Badge tone="success">✅ Mastered</Badge>;
  if (status === "in_progress") return <Badge tone="warning">◐ In progress</Badge>;
  return <Badge tone="neutral">○ Not started</Badge>;
}

export default async function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const subject = resolveSubject(subjectId);
  if (!subject) notFound();

  const { user } = await requireUser(`/app/subjects/${subjectId}`);
  const userProgress = await progress.forUser(user.id);
  const byChapter = new Map(userProgress.map((p) => [p.chapterSlug, p]));

  const done = subject.chapters.filter((c) => byChapter.get(c.slug)?.status === "mastered").length;
  const pct = subject.chapters.length ? Math.round((done / subject.chapters.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px] font-semibold text-[var(--fg-muted)]">
        <Link href="/app/subjects" className="hover:text-[var(--brand-primary)] hover:underline">Subjects</Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-[var(--fg-primary)]">{subject.name}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">{subject.name}</h1>
          <p className="mt-1 text-[14.5px] text-[var(--fg-secondary)]">
            {subject.country.name} · {subject.curriculum.name} · {subject.level.name} · {subject.chapters.length} chapters
          </p>
        </div>
        <div className="w-48">
          <ProgressBar value={pct} label={`Subject progress`} />
          <p className="mt-1 text-right text-[12.5px] font-bold text-[var(--fg-muted)]">{pct}% mastered</p>
        </div>
      </div>

      <p className="max-w-2xl text-[14.5px] leading-relaxed text-[var(--fg-secondary)]">{subject.blurb}</p>

      {subject.chapters.length === 0 ? (
        <EmptyState
          title="No chapters yet"
          description="We're authoring this subject next. Try another subject on your path."
          action={<Link href="/app/subjects" className="btn btn-primary">All subjects</Link>}
        />
      ) : (
        <Card className="divide-y divide-[var(--border-default)]">
          {subject.chapters.map((chapter, index) => {
            const rec = byChapter.get(chapter.slug);
            const status = rec?.status ?? "not_started";
            const locked = index > 0 && !byChapter.get(subject.chapters[index - 1]!.slug);
            return (
              <div key={chapter.slug} className="flex items-center gap-3 px-4 py-3.5">
                <span className="w-6 text-center text-[15px]" aria-hidden="true">
                  {status === "mastered" ? "✅" : status === "in_progress" ? "◐" : locked ? "🔒" : "○"}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/app/chapters/${chapter.slug}?tab=notes`}
                    className="block truncate font-display text-[15px] font-extrabold text-[var(--fg-primary)] hover:text-[var(--brand-primary)] hover:underline"
                  >
                    Chapter {chapter.order} — {chapter.name}
                  </Link>
                  <p className="mt-0.5 text-[12.5px] text-[var(--fg-muted)]">
                    {chapter.topics.length} topics · ~{chapter.estimatedHours}h · weight: {chapter.syllabusWeight}
                    {locked ? " · complete the previous chapter first (or open it anyway)" : ""}
                  </p>
                </div>
                {statusBadge(status)}
                <span className="w-12 text-right text-[12.5px] font-bold tabular-nums text-[var(--fg-muted)]">
                  {rec ? `${rec.masteryScore}%` : ""}
                </span>
                <Link
                  href={`/app/chapters/${chapter.slug}?tab=notes`}
                  className="min-h-11 rounded-[var(--radius-pill)] border-2 border-[var(--border-strong)] px-4 py-2 text-[13px] font-extrabold text-[var(--brand-primary)] hover:border-[var(--brand-primary)]"
                >
                  {status === "not_started" ? "Open" : "Continue"}
                </Link>
              </div>
            );
          })}
        </Card>
      )}

      <p className="flex items-center gap-1.5 text-[12.5px] text-[var(--fg-muted)]">
        <Lock className="size-3.5" aria-hidden="true" /> Chapters never hard-block — you can always open the next one anyway.
      </p>
    </div>
  );
}
