"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Search, Youtube, X } from "lucide-react";
import { Card, ProgressBar, Badge } from "@/components/ui";

export interface LibrarySubject {
  slug: string;
  name: string;
  color: string;
  blurb: string;
  meta: string;
  chapters: number;
  videos: number;
  done: number;
  started: number;
  pct: number;
}

function SubjectCard({ subject }: { subject: LibrarySubject }) {
  return (
    <Card hover className="p-4">
      <Link href={`/app/subjects/${subject.slug}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-[12px] text-white"
              style={{ background: subject.color }}
              aria-hidden="true"
            >
              <BookOpen className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-[16px] font-extrabold text-[var(--fg-primary)]">
                {subject.name}
              </h2>
              <p className="truncate text-[12px] font-semibold text-[var(--fg-muted)]">{subject.meta}</p>
            </div>
          </div>
          {subject.started > 0 ? (
            <Badge tone="warning">◐ {subject.started} started</Badge>
          ) : (
            <Badge tone="neutral">○ not started</Badge>
          )}
        </div>
        <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-relaxed text-[var(--fg-secondary)]">
          {subject.blurb}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={subject.pct} className="flex-1" label={`Progress in ${subject.name}`} />
          <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-[var(--fg-muted)]">
            {subject.done}/{subject.chapters}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-[12px] font-bold text-[var(--fg-muted)]">
          <span>{subject.chapters} chapters</span>
          {subject.videos > 0 ? (
            <span className="flex items-center gap-1 rounded-full bg-[#fef2f2] px-2 py-0.5 text-[#b91c1c]">
              <Youtube className="size-3" aria-hidden="true" /> {subject.videos} video{subject.videos === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
      </Link>
    </Card>
  );
}

/** Searchable subjects library — "On your path" first, then the full catalogue. */
export function SubjectLibrary({
  onPath,
  others,
}: {
  onPath: LibrarySubject[];
  others: LibrarySubject[];
}) {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const filter = (list: LibrarySubject[]) =>
    q
      ? list.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.blurb.toLowerCase().includes(q) ||
            s.meta.toLowerCase().includes(q),
        )
      : list;

  const filteredPath = filter(onPath);
  const filteredOthers = filter(others);
  const empty = filteredPath.length === 0 && filteredOthers.length === 0;

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-muted)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search subjects — try “physics” or “maths”…"
          aria-label="Search subjects"
          className="input w-full !pl-10"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-[var(--bg-subtle)]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {empty ? (
        <Card className="p-8 text-center">
          <p className="font-display text-lg font-extrabold text-[var(--fg-primary)]">
            No subjects match “{query}”
          </p>
          <p className="mt-1 text-sm text-[var(--fg-secondary)]">
            Try a broader term, or press ⌘K to jump straight to a chapter.
          </p>
        </Card>
      ) : (
        <>
          {filteredPath.length > 0 ? (
            <section aria-labelledby="lib-on-path">
              <h2
                id="lib-on-path"
                className="mb-3 font-display text-[13px] font-extrabold uppercase tracking-[0.12em] text-[var(--fg-muted)]"
              >
                On your path
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredPath.map((s) => (
                  <SubjectCard key={s.slug} subject={s} />
                ))}
              </div>
            </section>
          ) : null}

          {filteredOthers.length > 0 ? (
            <section aria-labelledby="lib-rest">
              <h2
                id="lib-rest"
                className="mb-3 font-display text-[13px] font-extrabold uppercase tracking-[0.12em] text-[var(--fg-muted)]"
              >
                Rest of the catalogue
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredOthers.map((s) => (
                  <SubjectCard key={s.slug} subject={s} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
