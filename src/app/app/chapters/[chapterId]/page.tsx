import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Map, BookOpen, GraduationCap, BrainCircuit, PenLine, BarChart3, Flag } from "lucide-react";
import { requireUser } from "@/lib/session";
import { progress, quizStore, reviewStore, roadmapStore } from "@/lib/store";
import { resolveChapter } from "@/lib/curriculum/catalog";
import { masteryLabel } from "@/lib/mastery";
import { Badge, ProgressBar } from "@/components/ui";
import { NotesTab } from "@/components/chapter/notes-tab";
import { RoadmapTab } from "@/components/chapter/roadmap-tab";
import { ResourcesTab } from "@/components/chapter/resources-tab";
import { TutorTab } from "@/components/chapter/tutor-tab";
import { PracticeTab } from "@/components/chapter/practice-tab";
import { ProgressTab } from "@/components/chapter/progress-tab";
import { ChapterPin } from "@/components/chapter-pin";

export const dynamic = "force-dynamic";

const TABS = [
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "resources", label: "Institutes", icon: GraduationCap },
  { id: "tutor", label: "Tutor", icon: BrainCircuit },
  { id: "practice", label: "Practice", icon: PenLine },
  { id: "progress", label: "Progress", icon: BarChart3 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default async function ChapterHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ chapterId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { chapterId } = await params;
  const { tab } = await searchParams;
  const resolved = resolveChapter(chapterId);
  if (!resolved) notFound();
  const { chapter, subject } = resolved;

  const { user, profile } = await requireUser(`/app/chapters/${chapterId}`);
  const userId = user.id;

  const [rec, attempts, dueCards, roadmap] = await Promise.all([
    progress.get(userId, chapterId),
    quizStore.forChapter(userId, chapterId),
    reviewStore.due(userId),
    roadmapStore.get(userId, chapterId),
  ]);

  const activeTab: TabId = (TABS.some((t) => t.id === tab) ? tab : "notes") as TabId;
  const mastery = rec?.masteryScore ?? 0;
  const status = rec?.status ?? "not_started";

  return (
    <div className="space-y-6">
      <ChapterPin url={`/app/chapters/${chapterId}?tab=notes`} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px] font-semibold text-[var(--fg-muted)]">
        <Link href="/app/subjects" className="hover:text-[var(--brand-primary)] hover:underline">Subjects</Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <Link href={`/app/subjects/${subject.slug}`} className="hover:text-[var(--brand-primary)] hover:underline">
          {subject.name}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-[var(--fg-primary)]">{chapter.name}</span>
      </nav>

      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-[1.7rem] font-extrabold leading-tight text-[var(--fg-primary)]">
              {chapter.name}
            </h1>
            <p className="mt-1 text-[14px] text-[var(--fg-secondary)]">
              {subject.curriculum.name} · {subject.level.name} · {chapter.topics.length} topics · ~
              {chapter.estimatedHours}h · weight:{" "}
              <Badge tone={chapter.syllabusWeight === "high" ? "danger" : chapter.syllabusWeight === "medium" ? "warning" : "neutral"}>
                {chapter.syllabusWeight}
              </Badge>
            </p>
          </div>
          <div className="w-44">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wide text-[var(--fg-muted)]">Mastery</span>
              <span className="text-[12.5px] font-extrabold tabular-nums">{mastery}%</span>
            </div>
            <ProgressBar value={mastery} className="mt-1" label={`Mastery for ${chapter.name}`} />
            <p className="mt-1 text-[12px] text-[var(--fg-muted)]">{masteryLabel(mastery)}</p>
          </div>
        </div>
      </div>

      {/* URL-synced tab bar */}
      <div role="tablist" aria-label="Chapter sections" className="scroll-x -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <Link
                key={t.id}
                role="tab"
                aria-selected={active}
                href={`/app/chapters/${chapterId}?tab=${t.id}`}
                className={`flex min-h-11 items-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] px-4 text-[14px] font-extrabold transition-colors ${
                  active
                    ? "bg-[var(--brand-primary)] text-white"
                    : "text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)]"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t.label}
                {t.id === "practice" && dueCards.length > 0 ? null : null}
              </Link>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" aria-label={TABS.find((t) => t.id === activeTab)!.label}>
        {activeTab === "notes" ? (
          <NotesTab chapterSlug={chapterId} chapterName={chapter.name} defaultDepth={profile.preferences.defaultDepth} />
        ) : null}
        {activeTab === "roadmap" ? <RoadmapTab chapterSlug={chapterId} chapterName={chapter.name} hasRoadmap={Boolean(roadmap)} /> : null}
        {activeTab === "resources" ? <ResourcesTab chapterSlug={chapterId} chapterName={chapter.name} /> : null}
        {activeTab === "tutor" ? <TutorTab chapterSlug={chapterId} chapterName={chapter.name} /> : null}
        {activeTab === "practice" ? <PracticeTab chapterSlug={chapterId} chapterName={chapter.name} /> : null}
        {activeTab === "progress" ? (
          <ProgressTab
            chapterSlug={chapterId}
            chapterName={chapter.name}
            progress={rec ?? null}
            attempts={attempts}
            dueCount={dueCards.filter((c) => c.chapterSlug === chapterId).length}
            targetDate={profile.targetDate}
          />
        ) : null}
      </div>

      <p className="flex items-center gap-1.5 text-[12.5px] text-[var(--fg-muted)]">
        <Flag className="size-3.5" aria-hidden="true" />
        Spot a mistake in generated content? Use “Report issue” on the Notes tab — it goes straight to the review queue.
      </p>
    </div>
  );
}
