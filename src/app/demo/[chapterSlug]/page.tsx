import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { resolveChapter } from "@/lib/curriculum/catalog";
import { buildNotes } from "@/lib/ai/notes";
import { buildResources } from "@/lib/ai/resources";
import { NotesSchema, type NoteDepth } from "@/lib/schemas/notes";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { DemoNotes } from "@/components/demo-notes";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterSlug: string }>;
}): Promise<Metadata> {
  const { chapterSlug } = await params;
  const resolved = resolveChapter(chapterSlug);
  return {
    title: resolved ? `Sample: ${resolved.chapter.name}` : "Sample chapter",
    description: resolved
      ? `Read real Sherpa notes for ${resolved.chapter.name} (${resolved.subject.curriculum.name} ${resolved.subject.level.name}) — no account needed.`
      : "A sample Sherpa chapter.",
  };
}

export default async function DemoChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ chapterSlug: string }>;
  searchParams: Promise<{ depth?: string }>;
}) {
  const { chapterSlug } = await params;
  const { depth: depthParam } = await searchParams;
  const resolved = resolveChapter(chapterSlug);
  if (!resolved) notFound();
  const { chapter, subject } = resolved;

  const depth: NoteDepth = depthParam === "quick" || depthParam === "deep" ? depthParam : "standard";
  const notes = buildNotes(chapterSlug, depth, "en");
  const resources = buildResources({ chapterSlug, language: "en", freeOnly: true, proficiency: "beginner" });

  if (!notes || !NotesSchema.safeParse(notes).success) notFound();

  return (
    <>
      <SiteHeader signedIn={false} />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge tone="brand" icon={<Sparkles className="size-3" aria-hidden="true" />}>
            Free preview — no account needed
          </Badge>
          <Badge tone="neutral">
            {subject.country.name} · {subject.curriculum.name} · {subject.level.name}
          </Badge>
        </div>

        <h1 className="font-display text-[1.9rem] font-extrabold leading-tight text-[var(--fg-primary)]">
          {chapter.name}
        </h1>
        <p className="mt-2 text-[15px] text-[var(--fg-secondary)]">
          {subject.name} · {chapter.topics.length} topics · ~{chapter.estimatedHours}h ·{" "}
          {notes.read_minutes} min read ({depth})
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Preview depth">
          {(["quick", "standard", "deep"] as const).map((d) => (
            <Link
              key={d}
              href={`/demo/${chapterSlug}?depth=${d}`}
              aria-pressed={depth === d}
              className="chip capitalize"
              data-selected={depth === d}
            >
              {d}
            </Link>
          ))}
          <span className="ml-auto">
            <ButtonLink href={`/auth/sign-up?next=/app/chapters/${chapterSlug}?tab=notes`} size="sm">
              Save progress & unlock tutor <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </span>
        </div>

        <Card className="mt-6 p-5 sm:p-8">
          <DemoNotes notes={notes} />
        </Card>

        <Card className="mt-6 p-5">
          <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">
            Vetted resources for this chapter
          </h2>
          <ul className="mt-3 space-y-2">
            {resources.resources.slice(0, 4).map((r) => (
              <li key={r.url} className="flex flex-wrap items-center gap-2 text-[14px]">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--brand-primary)] underline"
                >
                  {r.title}
                </a>
                <span className="text-[var(--fg-muted)]">
                  {r.provider} · {r.type} · {r.cost}
                </span>
                {r.verified ? <Badge tone="success">verified</Badge> : null}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-6 border-[var(--brand-primary)] bg-[linear-gradient(135deg,#EEF2FF_0%,#FAFAF9_100%)] p-6 text-center">
          <p className="flex items-center justify-center gap-2 font-display text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
            <Lock className="size-3.5" aria-hidden="true" /> What you get with an account
          </p>
          <p className="mx-auto mt-2 max-w-lg text-[14.5px] leading-relaxed text-[var(--fg-secondary)]">
            A roadmap sized to your week, a Socratic tutor that never hands over the answer on turn one, adaptive
            quizzes that feed a spaced-repetition queue, and offline access to your last chapters.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <ButtonLink href={`/auth/sign-up?next=/app/chapters/${chapterSlug}?tab=notes`}>
              Create free account <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/subjects" variant="secondary">
              Browse all chapters
            </ButtonLink>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
