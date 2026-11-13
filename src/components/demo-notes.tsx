import { Markdown } from "@/components/markdown";
import type { Notes } from "@/lib/schemas/notes";

/**
 * Read-only preview renderer for /demo/[chapterSlug]. Shows the same sections
 * as the in-app Notes tab, minus the toolbar (no auth, no saving).
 */
export function DemoNotes({ notes }: { notes: Notes }) {
  return (
    <article className="text-[17px] leading-[1.75] text-[var(--fg-primary)]">
      <section className="mb-8">
        <h2 className="mb-2 border-l-4 border-[var(--brand-primary)] pl-3 font-display text-[1.25rem] font-extrabold">
          Big picture
        </h2>
        <Markdown source={notes.big_picture} />
      </section>

      <section className="mb-8">
        <h2 className="mb-2 border-l-4 border-[var(--brand-primary)] pl-3 font-display text-[1.25rem] font-extrabold">
          Core concepts
        </h2>
        {notes.core_concepts.map((c) => (
          <div key={c.heading} className="mb-5">
            <h3 className="mb-1.5 font-display text-[1.1rem] font-extrabold">{c.heading}</h3>
            <Markdown source={c.body_md} />
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="mb-2 border-l-4 border-[var(--brand-primary)] pl-3 font-display text-[1.25rem] font-extrabold">
          Worked examples
        </h2>
        {notes.worked_examples.map((e, i) => (
          <details key={i} className="mb-3 rounded-[var(--radius-md)] border border-[var(--border-default)] p-4">
            <summary className="cursor-pointer font-display text-[15px] font-extrabold">
              Example {i + 1} ({e.difficulty}) — tap for solution
            </summary>
            <div className="mt-3">
              <Markdown source={e.problem_md} />
            </div>
            <div className="mt-3 border-t border-[var(--border-default)] pt-3">
              <Markdown source={e.solution_md} />
            </div>
          </details>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="mb-2 border-l-4 border-[var(--brand-primary)] pl-3 font-display text-[1.25rem] font-extrabold">
          Diagram
        </h2>
        {notes.diagrams.map((d, i) => (
          <Markdown key={i} source={d} />
        ))}
      </section>

      <section className="mb-8">
        <h2 className="mb-2 border-l-4 border-[var(--brand-primary)] pl-3 font-display text-[1.25rem] font-extrabold">
          Common mistakes
        </h2>
        <ul className="list-disc space-y-1.5 pl-6">
          {notes.common_mistakes.map((m, i) => (
            <li key={i}>
              <Markdown source={m} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-2">
        <h2 className="mb-2 border-l-4 border-[var(--brand-primary)] pl-3 font-display text-[1.25rem] font-extrabold">
          Citations
        </h2>
        <ol className="list-decimal space-y-1.5 pl-6 text-[14.5px]">
          {notes.citations.map((c, i) => (
            <li key={i}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--brand-primary)] underline">
                {c.title}
              </a>{" "}
              — {c.publisher}
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
