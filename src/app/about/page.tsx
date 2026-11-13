import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Ban, Wifi, BrainCircuit, BookOpen, Users } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading, Card, ButtonLink } from "@/components/ui";
import { FaqAccordion } from "@/components/marketing/faq";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "About",
  description: "Why Sherpa exists, what it will not do, and who it is for.",
};

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Curriculum-aware, not generic",
    body: "CBSE Class 10 Science and US AP Physics are different subjects with different exams. Sherpa models that difference instead of averaging it away.",
  },
  {
    icon: Ban,
    title: "No affiliate spam",
    body: "Resources come from a curated allowlist and are ranked by fit. Providers cannot buy placement, and commercial relationships are disclosed on the card.",
  },
  {
    icon: BrainCircuit,
    title: "Socratic by default",
    body: "The tutor's first reply is always a question. You get the full explanation after two genuine attempts, or when you explicitly ask for it.",
  },
  {
    icon: Wifi,
    title: "Useful on a bad connection",
    body: "Chapters cache for offline reading. On a train with no signal, your notes still open.",
  },
  {
    icon: BookOpen,
    title: "Original notes only",
    body: "Sherpa writes its own explanations. It does not scrape or reproduce textbook pages, and every factual claim carries a citation.",
  },
  {
    icon: Users,
    title: "No dark patterns",
    body: "Accept and Reject cookies are the same size. Onboarding can be skipped. Cancel is one click. These are product rules, not marketing copy.",
  },
];

export default async function AboutPage() {
  const session = await getSession();

  return (
    <>
      <SiteHeader signedIn={Boolean(session)} />
      <main>
        <section className="border-b border-[var(--border-default)] bg-[linear-gradient(135deg,#FAFAF9_0%,#EEF2FF_100%)] py-14">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <SectionHeading
              as="h1"
              eyebrow="About Sherpa"
              title="A study guide that knows what you're studying."
              description="Most study tools are either a content library that dumps videos, or a general chatbot that confidently invents facts. Sherpa sits in the gap: it knows your board, it writes original notes, and it teaches by asking."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/auth/sign-up">Start learning free</ButtonLink>
              <ButtonLink href="/demo/light-reflection-refraction" variant="secondary">
                Read a sample chapter
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border-default)] py-14">
          <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg-primary)]">The problem we kept hitting</h2>
              <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-[var(--fg-secondary)]">
                <p>
                  A Class 10 student in Jaipur opens YouTube to revise Light. Forty minutes later they have
                  watched three half-relevant videos, none of which mention the sign convention their board
                  marks them on. Nothing was wrong with the videos. Nothing was organised for their exam.
                </p>
                <p>
                  Meanwhile a student in California opens a general AI chatbot, asks about reflection, and gets
                  a confident answer using a convention their textbook does not use — with no citation.
                </p>
                <p>
                  Both problems are the same problem: no one connected <em>curriculum</em> to <em>explanation</em>.
                  Sherpa is that connection.
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg-primary)]">Who it is for</h2>
              <ul className="mt-4 space-y-3">
                {[
                  { who: "Aarav, 15, CBSE Class 10", need: "Pass boards and start JEE prep without drowning in random videos." },
                  { who: "Emily, 17, AP Calculus", need: "Exam-focused practice that explains the step she keeps missing." },
                  { who: "Priya, 22, PG Life Sciences", need: "One reliable guide through a module, not five contradictory ones." },
                  { who: "Omar, 19, IB HL", need: "A tool that actually understands IB assessment language." },
                  { who: "Mrs. Iyer, parent", need: "Verified content. No ads. No social feed." },
                ].map((p) => (
                  <li key={p.who} className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-3.5">
                    <p className="font-display text-[14.5px] font-extrabold text-[var(--fg-primary)]">{p.who}</p>
                    <p className="mt-0.5 text-[14px] text-[var(--fg-secondary)]">{p.need}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border-default)] bg-[var(--bg-surface)] py-14">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <SectionHeading title="Six rules we build against" align="center" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((p) => {
                const Icon = p.icon;
                return (
                  <Card key={p.title} className="p-5">
                    <Icon className="size-5 text-[var(--brand-primary)]" aria-hidden="true" />
                    <h3 className="mt-3 font-display text-[16.5px] font-extrabold text-[var(--fg-primary)]">{p.title}</h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--fg-secondary)]">{p.body}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 py-14">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <SectionHeading title="Frequently asked" align="center" />
            <div className="mt-8">
              <FaqAccordion />
            </div>
            <p className="mt-6 text-center text-[14px] text-[var(--fg-secondary)]">
              Still stuck?{" "}
              <Link href="/pricing" className="font-semibold text-[var(--brand-primary)] underline">
                Check pricing
              </Link>{" "}
              or email{" "}
              <a href="mailto:help@sherpa.study" className="font-semibold text-[var(--brand-primary)] underline">
                help@sherpa.study
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
