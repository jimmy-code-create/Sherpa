import { Youtube, ExternalLink, Clock3 } from "lucide-react";
import type { ChapterVideo } from "@/lib/curriculum/types";
import { Card, EmptyState } from "@/components/ui";

/**
 * Watch tab — curated video lectures for the chapter.
 *
 * HARD RULE (Session Engine spec): videos are rendered ONLY as YouTube
 * IFrame embeds of https://www.youtube.com/embed/{id}. We never download,
 * re-host, proxy or hotlink YouTube media, and every embed carries educator
 * attribution plus a "View on YouTube" link.
 */
export function WatchTab({
  chapterName,
  videos,
}: {
  chapterName: string;
  videos: ChapterVideo[];
}) {
  if (!videos || videos.length === 0) {
    return (
      <EmptyState
        icon={<Youtube className="size-8" aria-hidden="true" />}
        title="No vetted videos for this chapter yet"
        description="Our editors are reviewing lectures for this chapter. Notes, roadmap, practice and the tutor are ready right now."
      />
    );
  }

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--brand-soft)] px-4 py-3 text-[13.5px] font-semibold text-[var(--brand-dark)]">
        <Youtube className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Hand-picked lectures that match <span className="font-extrabold">{chapterName}</span>. They play inline via
        YouTube&apos;s official embed — we never re-host video, and the creator is credited under each one.
      </p>

      {videos.map((v, i) => (
        <Card key={v.youtubeId} className="overflow-hidden p-0">
          <div className="aspect-video w-full bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${v.youtubeId}`}
              title={`${v.title} — ${v.channel} (YouTube)`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="min-w-0">
              <p className="font-display text-[15px] font-extrabold text-[var(--fg-primary)]">
                {i + 1}. {v.title}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--fg-muted)]">
                <Clock3 className="size-3.5" aria-hidden="true" /> Lecture by{" "}
                <span className="font-bold text-[var(--fg-secondary)]">{v.channel}</span> · on YouTube
              </p>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] border-2 border-[var(--border-strong)] px-4 py-2 text-[13px] font-extrabold text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)]"
            >
              View on YouTube <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
