"use client";

import * as React from "react";
import { Download, Flag, RefreshCw, Type, Contrast, BookOpen } from "lucide-react";
import type { Notes, NoteDepth } from "@/lib/schemas/notes";
import { notesToMarkdown } from "@/lib/ai/notes";
import { Markdown } from "@/components/markdown";
import { Badge, Button, Card, EmptyState, ErrorState, SkeletonText } from "@/components/ui";

const DEPTHS: { id: NoteDepth; label: string; minutes: string }[] = [
  { id: "quick", label: "Quick", minutes: "2-min read" },
  { id: "standard", label: "Standard", minutes: "10-min read" },
  { id: "deep", label: "Deep Dive", minutes: "25-min read" },
];

type Status = "loading" | "ready" | "error";

const SECTIONS: { id: string; label: string }[] = [
  { id: "big-picture", label: "Big picture" },
  { id: "prerequisites", label: "Prerequisites" },
  { id: "glossary", label: "Glossary" },
  { id: "core-concepts", label: "Core concepts" },
  { id: "derivations", label: "Derivations" },
  { id: "worked-examples", label: "Worked examples" },
  { id: "diagrams", label: "Diagrams" },
  { id: "analogies", label: "Analogies" },
  { id: "common-mistakes", label: "Common mistakes" },
  { id: "exam-patterns", label: "Exam patterns" },
  { id: "mnemonics", label: "Memory hooks" },
  { id: "self-check", label: "Self-check" },
  { id: "citations", label: "Citations" },
  { id: "related", label: "Related chapters" },
];

export function NotesTab({
  chapterSlug,
  chapterName,
  defaultDepth,
}: {
  chapterSlug: string;
  chapterName: string;
  defaultDepth: NoteDepth;
}) {
  const [depth, setDepth] = React.useState<NoteDepth>(defaultDepth);
  const [status, setStatus] = React.useState<Status>("loading");
  const [notes, setNotes] = React.useState<Notes | null>(null);
  const [source, setSource] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [fontSize, setFontSize] = React.useState(17);
  const [readingTheme, setReadingTheme] = React.useState<"light" | "sepia" | "dark">("light");
  const [reporting, setReporting] = React.useState<string | null>(null);
  const [reportSent, setReportSent] = React.useState(false);

  const load = React.useCallback(
    async (d: NoteDepth, refresh = false) => {
      setStatus("loading");
      setError(null);
      try {
        const res = await fetch("/api/ai/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterSlug, depth: d, refresh }),
        });
        const body = (await res.json()) as { notes?: Notes; source?: string; error?: string };
        if (!res.ok || !body.notes) {
          setStatus("error");
          setError(body.error ?? "Couldn't generate notes for this chapter.");
          return;
        }
        setNotes(body.notes);
        setSource(body.source ?? "generated");
        setStatus("ready");
        void fetch("/api/progress/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterSlug, event: "note_depth_read", depth: d }),
        }).catch(() => {});
      } catch {
        setStatus("error");
        setError("Couldn't reach the server. Check your connection and retry.");
      }
    },
    [chapterSlug],
  );

  React.useEffect(() => {
    void load(depth);
  }, [depth, load]);

  function exportMarkdown() {
    if (!notes) return;
    const blob = new Blob([notesToMarkdown(notes)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chapterSlug}-${depth}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function reportIssue(section: string) {
    setReporting(section);
    setReportSent(false);
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterSlug, section, reason: "other", detail: "Flagged from notes tab" }),
      });
      setReportSent(true);
    } catch {
      setReportSent(false);
    }
  }

  const themeStyle =
    readingTheme === "sepia"
      ? { background: "#f6f1e3", color: "#3f3a2f" }
      : readingTheme === "dark"
        ? { background: "#10151f", color: "#e5e9f0" }
        : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* Sticky TOC (desktop) */}
      <aside className="hidden lg:block">
        <nav aria-label="Note sections" className="sticky top-24 max-h-[70vh] overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
          <p className="px-2 pb-2 font-display text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            On this page
          </p>
          <ul className="space-y-0.5">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#sec-${s.id}`}
                  className="block rounded-[var(--radius-sm)] px-2 py-1.5 text-[13px] font-semibold text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 space-y-4">
        {/* Toolbar */}
        <Card className="flex flex-wrap items-center gap-2 p-3">
          <div className="flex gap-1.5" role="group" aria-label="Note depth">
            {DEPTHS.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={depth === d.id}
                onClick={() => setDepth(d.id)}
                className={`chip ${depth === d.id ? "" : "bg-transparent"}`}
                data-selected={depth === d.id}
              >
                {d.label} <span className="font-medium opacity-80">{d.minutes}</span>
              </button>
            ))}
          </div>
          <span className="mx-1 hidden h-6 w-px bg-[var(--border-default)] sm:block" aria-hidden="true" />
          <div className="flex items-center gap-1" role="group" aria-label="Font size">
            <button type="button" aria-label="Smaller font" onClick={() => setFontSize((f) => Math.max(14, f - 1))} className="flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-[13px] font-bold hover:bg-[var(--bg-subtle)]">
              <Type className="size-3.5" aria-hidden="true" />−
            </button>
            <button type="button" aria-label="Larger font" onClick={() => setFontSize((f) => Math.min(24, f + 1))} className="flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-[15px] font-bold hover:bg-[var(--bg-subtle)]">
              <Type className="size-4" aria-hidden="true" />+
            </button>
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Reading theme">
            {(["light", "sepia", "dark"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={readingTheme === t}
                onClick={() => setReadingTheme(t)}
                className={`min-h-11 rounded-[var(--radius-pill)] px-3 text-[12.5px] font-bold capitalize ${readingTheme === t ? "bg-[var(--bg-subtle)] ring-2 ring-[var(--brand-primary)]" : "hover:bg-[var(--bg-subtle)]"}`}
              >
                <Contrast className="mr-1 inline size-3.5" aria-hidden="true" />
                {t}
              </button>
            ))}
          </div>
          <span className="mx-1 hidden h-6 w-px bg-[var(--border-default)] sm:block" aria-hidden="true" />
          <Button variant="secondary" size="sm" onClick={exportMarkdown} disabled={!notes}>
            <Download className="size-4" aria-hidden="true" /> Export .md
          </Button>
          <Button variant="secondary" size="sm" onClick={() => void load(depth, true)}>
            <RefreshCw className="size-4" aria-hidden="true" /> Regenerate
          </Button>
          {source === "cache" ? <Badge tone="info">Served from cache</Badge> : null}
        </Card>

        {status === "loading" ? (
          <Card className="p-6">
            <SkeletonText lines={2} />
            <div className="mt-6 space-y-4">
              <SkeletonText lines={5} />
              <SkeletonText lines={4} />
            </div>
          </Card>
        ) : null}

        {status === "error" ? (
          <ErrorState
            title="Couldn't generate notes"
            description={error ?? "Try again in a moment."}
            retry={<Button onClick={() => void load(depth, true)}>Retry</Button>}
          />
        ) : null}

        {status === "ready" && notes ? (
          <article
            className="rounded-[var(--radius-lg)] border border-[var(--border-default)] p-5 sm:p-8"
            style={{ ...themeStyle, fontSize: `${fontSize}px` }}
          >
            <header className="mb-6 border-b border-[var(--border-default)] pb-5">
              <h2 className="font-display text-[1.5rem] font-extrabold">{notes.title}</h2>
              <p className="mt-1 text-[13px] font-semibold opacity-70">
                {notes.read_minutes} min read · {notes.depth} depth · {notes.language}
                {notes.limited_sources ? " · limited sources for this topic" : ""}
              </p>
            </header>

            <Section id="big-picture" title="Big picture" onReport={() => void reportIssue("big_picture")} reporting={reporting} sent={reportSent}>
              <Markdown source={notes.big_picture} />
            </Section>

            <Section id="prerequisites" title="Prerequisites" onReport={() => void reportIssue("prerequisites")} reporting={reporting} sent={reportSent}>
              {notes.prerequisites.length === 0 ? (
                <p className="opacity-80">None — you can start this chapter right away.</p>
              ) : (
                <ul className="list-disc space-y-1.5 pl-6">
                  {notes.prerequisites.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </Section>

            <Section id="glossary" title="Glossary" onReport={() => void reportIssue("glossary")} reporting={reporting} sent={reportSent}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[0.92em]">
                  <thead>
                    <tr className="border-b border-[var(--border-default)]">
                      <th scope="col" className="py-2 pr-4 font-bold">Term</th>
                      <th scope="col" className="py-2 font-bold">Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.glossary.map((g) => (
                      <tr key={g.term} className="border-b border-[var(--border-default)] align-top">
                        <td className="py-2 pr-4 font-bold">{g.term}</td>
                        <td className="py-2">{g.definition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="core-concepts" title="Core concepts" onReport={() => void reportIssue("core_concepts")} reporting={reporting} sent={reportSent}>
              {notes.core_concepts.map((c, i) => (
                <div key={c.heading} className="mb-6">
                  <h3 className="mb-2 font-display text-[1.15em] font-extrabold">
                    {i + 1}. {c.heading}
                  </h3>
                  <Markdown source={c.body_md} />
                </div>
              ))}
            </Section>

            {notes.derivations.length > 0 ? (
              <Section id="derivations" title="Derivations & step-by-step logic" onReport={() => void reportIssue("derivations")} reporting={reporting} sent={reportSent}>
                {notes.derivations.map((d, i) => (
                  <div key={i} className="callout callout-formula mb-3">
                    <Markdown source={d} />
                  </div>
                ))}
              </Section>
            ) : null}

            <Section id="worked-examples" title="Worked examples" onReport={() => void reportIssue("worked_examples")} reporting={reporting} sent={reportSent}>
              {notes.worked_examples.map((e, i) => (
                <details key={i} className="group mb-3 rounded-[var(--radius-md)] border border-[var(--border-default)] p-4 open:bg-[var(--bg-subtle)]">
                  <summary className="flex cursor-pointer items-center gap-2 font-display text-[0.95em] font-extrabold">
                    Example {i + 1} · <Badge tone={e.difficulty === "easy" ? "success" : e.difficulty === "medium" ? "warning" : "danger"}>{e.difficulty}</Badge>
                    <span className="ml-auto text-[12px] font-bold opacity-60">tap to {null}reveal solution</span>
                  </summary>
                  <div className="mt-3">
                    <Markdown source={e.problem_md} />
                  </div>
                  <div className="mt-3 border-t border-[var(--border-default)] pt-3">
                    <Markdown source={e.solution_md} />
                  </div>
                </details>
              ))}
            </Section>

            <Section id="diagrams" title="Diagrams" onReport={() => void reportIssue("diagrams")} reporting={reporting} sent={reportSent}>
              {notes.diagrams.map((d, i) => (
                <Markdown key={i} source={d} />
              ))}
            </Section>

            <Section id="analogies" title="Analogies & real-world uses" onReport={() => void reportIssue("analogies")} reporting={reporting} sent={reportSent}>
              <ul className="list-disc space-y-1.5 pl-6">
                {notes.analogies.map((a, i) => (
                  <li key={i}><Markdown source={a} /></li>
                ))}
              </ul>
            </Section>

            <Section id="common-mistakes" title="Common mistakes" onReport={() => void reportIssue("common_mistakes")} reporting={reporting} sent={reportSent}>
              <ul className="list-disc space-y-1.5 pl-6">
                {notes.common_mistakes.map((m, i) => (
                  <li key={i}><Markdown source={m} /></li>
                ))}
              </ul>
            </Section>

            <Section id="exam-patterns" title="Exam patterns" onReport={() => void reportIssue("exam_patterns")} reporting={reporting} sent={reportSent}>
              <ul className="space-y-2">
                {notes.exam_patterns.map((p) => (
                  <li key={p.exam} className="rounded-[var(--radius-md)] border border-[var(--border-default)] p-3">
                    <p className="font-bold">{p.exam} {p.years.length ? `(${p.years.join(", ")})` : ""}</p>
                    <p className="mt-0.5 text-[0.92em] opacity-80">{p.question_types.join(" · ")}</p>
                  </li>
                ))}
              </ul>
            </Section>

            {notes.mnemonics.length > 0 ? (
              <Section id="mnemonics" title="Memory hooks" onReport={() => void reportIssue("mnemonics")} reporting={reporting} sent={reportSent}>
                <ul className="list-disc space-y-1.5 pl-6">
                  {notes.mnemonics.map((m, i) => (
                    <li key={i}><Markdown source={m} /></li>
                  ))}
                </ul>
              </Section>
            ) : null}

            <Section id="self-check" title="Self-check (5 questions)" onReport={() => void reportIssue("self_check")} reporting={reporting} sent={reportSent}>
              <ol className="space-y-2">
                {notes.self_check.map((s, i) => (
                  <li key={i}>
                    <details className="rounded-[var(--radius-md)] border border-[var(--border-default)] p-3">
                      <summary className="cursor-pointer font-semibold">{s.question}</summary>
                      <p className="mt-2 text-[0.92em] opacity-85">{s.answer}</p>
                    </details>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="citations" title="Citations" onReport={() => void reportIssue("citations")} reporting={reporting} sent={reportSent}>
              {notes.citations.length < 3 ? (
                <p className="mb-2 text-[0.9em] font-semibold text-[#b45309]">
                  Limited sources for this topic — treat claims with extra care.
                </p>
              ) : null}
              <ol className="list-decimal space-y-1.5 pl-6">
                {notes.citations.map((c, i) => (
                  <li key={i}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--brand-primary)] underline">
                      {c.title}
                    </a>{" "}
                    <span className="opacity-70">— {c.publisher}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="related" title="Related chapters" onReport={() => void reportIssue("related_chapters")} reporting={reporting} sent={reportSent}>
              {notes.related_chapters.length === 0 ? (
                <p className="opacity-80">No related chapters yet.</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {notes.related_chapters.map((slug) => (
                    <li key={slug}>
                      <a href={`/app/chapters/${slug}?tab=notes`} className="chip" data-selected={false}>
                        {slug.split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ")} →
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </article>
        ) : null}

        {status === "ready" ? (
          <Card className="p-4">
            <p className="flex flex-wrap items-center gap-2 text-[13.5px] text-[var(--fg-secondary)]">
              <BookOpen className="size-4" aria-hidden="true" />
              These notes are generated for your level and original to Sherpa.
              <Button variant="ghost" size="sm" onClick={() => void reportIssue("whole_note")}>
                <Flag className="size-4" aria-hidden="true" /> Report issue
              </Button>
              {reporting === "whole_note" && reportSent ? <Badge tone="success">Report logged — thank you</Badge> : null}
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
  onReport,
  reporting,
  sent,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  onReport: () => void;
  reporting: string | null;
  sent: boolean;
}) {
  return (
    <section id={`sec-${id}`} className="mb-10 scroll-mt-24">
      <div className="mb-3 flex items-center gap-2 border-l-4 border-[var(--brand-primary)] pl-3">
        <h2 className="font-display text-[1.25rem] font-extrabold">{title}</h2>
        <button
          type="button"
          onClick={onReport}
          aria-label={`Report an issue with the ${title} section`}
          className="ml-auto flex size-8 items-center justify-center rounded-[var(--radius-sm)] opacity-50 hover:bg-[var(--bg-subtle)] hover:opacity-100"
        >
          <Flag className="size-3.5" aria-hidden="true" />
        </button>
      </div>
      {reporting === id && sent ? (
        <p className="mb-2 rounded-[var(--radius-sm)] bg-[#ecfdf5] px-3 py-1.5 text-[13px] font-semibold text-[#047857]">
          Report logged — our editors review every flag.
        </p>
      ) : null}
      <div className="leading-[1.75]">{children}</div>
    </section>
  );
}
