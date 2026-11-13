import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { progress } from "@/lib/store";
import { resolveChapter } from "@/lib/curriculum/catalog";
import { TutorTab } from "@/components/chapter/tutor-tab";
import { TutorAvatar, TutorBubble } from "@/components/tutor-persona";
import { ButtonLink, Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tutor" };

export default async function TutorPage() {
  const { user, profile } = await requireUser("/app/tutor");

  const userProgress = await progress.forUser(user.id);
  const last = userProgress
    .filter((p) => p.status !== "not_started")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  const resolved = last ? resolveChapter(last.chapterSlug) : null;
  const chapter = resolved && "chapter" in resolved ? resolved.chapter : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TutorAvatar size={52} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[1.6rem] font-extrabold text-[var(--fg-primary)]">Ask Milo</h1>
          <p className="text-[14.5px] text-[var(--fg-secondary)]">
            A Socratic tutor — he asks before he answers, so you actually learn it.
          </p>
        </div>
      </div>

      {chapter ? (
        <div className="space-y-3">
          <TutorBubble tail="left" className="max-w-xl">
            <p className="text-[14.5px] font-semibold text-[var(--fg-primary)]">
              {profile.displayName ? `Hey ${profile.displayName}` : "Hey"}, want to dig into{" "}
              <span className="font-extrabold">{chapter.name}</span>? I&apos;ll ask, you answer — that&apos;s how it
              sticks.
            </p>
          </TutorBubble>
          <Card className="p-4 sm:p-5">
            <TutorTab chapterSlug={chapter.slug} chapterName={chapter.name} />
          </Card>
        </div>
      ) : (
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <TutorAvatar size={64} mood="curious" />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-extrabold text-[var(--fg-primary)]">
                No chapter yet — pick one and I&apos;ll start teaching.
              </h2>
              <p className="mt-1 text-[14.5px] text-[var(--fg-secondary)]">
                Open any chapter, or browse your subjects and Milo will meet you there with questions, not lectures.
              </p>
            </div>
            <ButtonLink href="/app/subjects">
              Browse subjects <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] px-4 py-3 text-[13px] font-semibold text-[var(--fg-secondary)]">
            <BookOpen className="mr-1.5 inline size-4 align-[-2px] text-[var(--brand-primary)]" aria-hidden="true" />
            Tip: the tutor tab lives inside every chapter too — same Milo, focused on that chapter.
          </div>
        </Card>
      )}
    </div>
  );
}
