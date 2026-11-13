import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading, Card, Badge } from "@/components/ui";
import { resolveSubject } from "@/lib/curriculum/catalog";
import { SUBJECTS } from "@/lib/curriculum/chapters";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Browse subjects",
  description: "Every chapter Sherpa covers, by country, board and level. Preview any chapter without an account.",
};

export default async function BrowseSubjectsPage() {
  const session = await getSession();
  const resolved = SUBJECTS.map((s) => resolveSubject(s.slug)).filter(Boolean);

  const byCountry = new Map<string, typeof resolved>();
  for (const subject of resolved) {
    if (!subject) continue;
    const key = subject.country.name;
    const arr = byCountry.get(key) ?? [];
    arr.push(subject);
    byCountry.set(key, arr);
  }

  return (
    <>
      <SiteHeader signedIn={Boolean(session)} />
      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <SectionHeading
          as="h1"
          eyebrow="Catalogue"
          title="Every chapter, open to preview"
          description="No account needed to read a chapter's notes. Signing up saves your progress, roadmap and reviews."
        />

        <div className="mt-10 space-y-10">
          {[...byCountry.entries()].map(([country, subjects]) => (
            <section key={country}>
              <h2 className="mb-3 font-display text-[13px] font-extrabold uppercase tracking-[0.12em] text-[var(--fg-muted)]">
                {country}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {subjects.map((subject) =>
                  subject ? (
                    <Card key={subject.slug} hover className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-[17px] font-extrabold text-[var(--fg-primary)]">
                            {subject.name}
                          </h3>
                          <p className="mt-0.5 text-[13px] font-semibold text-[var(--fg-muted)]">
                            {subject.curriculum.name} · {subject.level.name}
                          </p>
                        </div>
                        <Badge tone="brand">{subject.chapters.length} ch</Badge>
                      </div>
                      <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-secondary)]">{subject.blurb}</p>
                      <ul className="mt-3 space-y-1.5">
                        {subject.chapters.map((chapter) => (
                          <li key={chapter.slug}>
                            <Link
                              href={`/demo/${chapter.slug}`}
                              className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-[14px] font-semibold text-[var(--fg-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--brand-primary)]"
                            >
                              <span>{chapter.name}</span>
                              <span className="text-[12px] font-bold text-[var(--fg-muted)]">Preview →</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ) : null,
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
