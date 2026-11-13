import Link from "next/link";
import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

/** Sticky table of contents + reading column. Shared by all legal pages. */
export function LegalLayout({
  title,
  summary,
  updated,
  sections,
}: {
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-[13px] text-[var(--fg-muted)]">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-[var(--fg-secondary)]">{title}</span>
      </nav>

      <header className="max-w-2xl">
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight text-[var(--fg-primary)]">
          {title}
        </h1>
        <p className="mt-3 text-[16.5px] leading-relaxed text-[var(--fg-secondary)]">{summary}</p>
        <p className="mt-3 inline-flex rounded-[var(--radius-pill)] bg-[var(--bg-subtle)] px-3 py-1 text-[13px] font-semibold text-[var(--fg-secondary)]">
          Last updated: {updated}
        </p>
      </header>

      <div className="mt-9 grid gap-10 lg:grid-cols-[240px_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="font-display text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            On this page
          </h2>
          <ol className="mt-3 space-y-1.5 border-l border-[var(--border-default)] pl-3">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block py-1 text-[13.5px] leading-snug text-[var(--fg-secondary)] hover:text-[var(--brand-primary)] hover:underline"
                >
                  <span className="mr-1.5 tabular-nums text-[var(--fg-muted)]">{i + 1}.</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-[70ch]">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 pb-8">
              <h2 className="mb-3 border-l-4 border-[var(--brand-primary)] pl-3 font-display text-[21px] font-extrabold leading-snug text-[var(--fg-primary)]">
                {i + 1}. {section.heading}
              </h2>
              <div className="space-y-3 text-[15.5px] leading-relaxed text-[var(--fg-secondary)] [&_a]:font-semibold [&_a]:text-[var(--brand-primary)] [&_a]:underline [&_li]:mb-1.5 [&_strong]:text-[var(--fg-primary)] [&_ul]:list-disc [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
            <p className="text-[14.5px] leading-relaxed text-[var(--fg-secondary)]">
              Questions about this document? Email{" "}
              <a href="mailto:legal@sherpa.study" className="font-semibold text-[var(--brand-primary)] underline">
                legal@sherpa.study
              </a>{" "}
              and a human will answer. These pages are written to be read, not to be survived.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
