import Link from "next/link";
import {
  Map,
  BookOpen,
  GraduationCap,
  BrainCircuit,
  PenLine,
  TrendingUp,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Wifi,
} from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { FaqAccordion } from "@/components/marketing/faq";
import { Badge, ButtonLink, SectionHeading, Card } from "@/components/ui";
import { getSession } from "@/lib/session";

const FEATURES = [
  {
    icon: Map,
    title: "A plan that fits your life",
    body: "Tell us your hours and target date. Sherpa phases the chapter into daily wins.",
    tone: "brand" as const,
  },
  {
    icon: BookOpen,
    title: "Notes that actually explain",
    body: "Quick summary or a 4,000-word deep dive — diagrams, examples and citations, always.",
    tone: "info" as const,
  },
  {
    icon: GraduationCap,
    title: "No more random YouTube",
    body: "Hand-vetted courses and books from NCERT, NPTEL, MIT OCW and Khan Academy. Allowlist only.",
    tone: "success" as const,
  },
  {
    icon: BrainCircuit,
    title: "A tutor that makes you think",
    body: "Socratic guidance, never answer-dumping. Turn one is always a question, never the solution.",
    tone: "warning" as const,
  },
  {
    icon: PenLine,
    title: "Exam-ready, not just read",
    body: "MCQs, numericals and PYQ-style items, auto-graded with step-by-step solutions.",
    tone: "brand" as const,
  },
  {
    icon: TrendingUp,
    title: "See yourself improving",
    body: "Mastery score, streaks, weak-topic radar and an exam-readiness gauge for your target date.",
    tone: "success" as const,
  },
];

const STEPS = [
  {
    n: 1,
    icon: Map,
    title: "Pick your path",
    body: "Country → board → class → subject → chapter. Four taps, no forms to fill.",
  },
  {
    n: 2,
    icon: Sparkles,
    title: "Get your roadmap",
    body: "A week-by-week plan with spaced repetition built in, sized to your study hours.",
  },
  {
    n: 3,
    icon: BrainCircuit,
    title: "Learn with a guide",
    body: "Deep notes, a Socratic tutor, auto-graded practice and vetted resources per topic.",
  },
];

const COMPARE = [
  { label: "Curriculum-aware", generic: "One-size-fits-all", sherpa: "Country + board + level" },
  { label: "Notes depth", generic: "Fixed", sherpa: "Quick / Standard / Deep Dive" },
  { label: "Resource quality", generic: "Scraped links", sherpa: "Allowlist only, re-verified" },
  { label: "AI tutor style", generic: "Gives answers", sherpa: "Socratic, step-by-step" },
  { label: "Offline", generic: "Requires network", sherpa: "Last 5 chapters cached" },
  { label: "Price", generic: "Paywalled", sherpa: "Free tier + Pro" },
];

const TESTIMONIALS = [
  {
    quote:
      "I stopped jumping between YouTube channels. The roadmap told me what to do each day, and the mirror-formula drills actually stuck.",
    name: "Aarav",
    meta: "Class 10 CBSE",
    seed: "aarav",
  },
  {
    quote:
      "The tutor refused to give me the answer the first time. Annoying for a day, then I realised I'd actually understood the chain rule.",
    name: "Emily",
    meta: "AP Calculus",
    seed: "emily",
  },
  {
    quote:
      "Every resource is one I'd have picked myself, and none of them are sponsored. That alone is worth it.",
    name: "Priya",
    meta: "PG Life Sciences",
    seed: "priya",
  },
];

export default async function LandingPage() {
  const session = await getSession();
  const signedIn = Boolean(session);

  return (
    <>
      <SiteHeader signedIn={signedIn} />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[var(--border-default)] bg-[linear-gradient(135deg,#FAFAF9_0%,#EEF2FF_100%)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #4F46E5 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[55fr_45fr] lg:items-center lg:py-20">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[#c7d2fe] bg-white/70 px-3 py-1.5 text-[13px] font-bold text-[#4338ca]">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Curriculum-aware · Class 1 → PhD
              </p>
              <h1 className="font-display text-[clamp(2.1rem,5.2vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-[var(--fg-primary)]">
                Your entire syllabus.
                <br />
                <span className="text-[var(--brand-primary)]">One guided path.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--fg-secondary)] sm:text-lg">
                Pick your country, your class, your chapter. Get a roadmap, deep original notes, and the
                best institutes — in seconds.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/auth/sign-up" className="justify-center">
                  Start learning free <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/demo/light-reflection-refraction" variant="secondary" className="justify-center">
                  See a sample chapter
                </ButtonLink>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-[var(--fg-secondary)]">
                {["No credit card", "Works offline", "Class 1 → PhD"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="size-4 text-[#059669]" aria-hidden="true" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pl-4">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* ── Social proof ─────────────────────────────────────────── */}
        <section aria-label="Social proof" className="border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden="true">
                {["aarav", "emily", "priya", "omar", "sara"].map((seed, i) => (
                  <span
                    key={seed}
                    className="flex size-9 items-center justify-center rounded-full border-2 border-white font-display text-[13px] font-extrabold text-white"
                    style={{ background: ["#4F46E5", "#0EA5E9", "#059669", "#F59E0B", "#8B5CF6"][i] }}
                  >
                    {seed[0]!.toUpperCase()}
                  </span>
                ))}
              </div>
              <p className="text-[14px] text-[var(--fg-secondary)]">
                <strong className="font-display font-extrabold text-[var(--fg-primary)]">4.8/5</strong> from
                2,300+ learners in 14 countries
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--fg-muted)]">
                Built on
              </span>
              {["NCERT", "Khan Academy", "MIT OCW", "NPTEL", "OpenStax"].map((logo) => (
                <span key={logo} className="font-display text-[13px] font-extrabold text-[var(--fg-muted)]">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section id="how-it-works" className="scroll-mt-20 border-b border-[var(--border-default)] py-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="How it works"
              title="Three steps from lost to on-plan"
              description="No onboarding maze. You can be reading a real chapter about ninety seconds after signing up."
              align="center"
            />
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.n} className="relative">
                    {index < STEPS.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-[calc(100%-8px)] top-9 hidden h-0.5 w-8 bg-[var(--border-default)] md:block"
                      />
                    ) : null}
                    <Card className="h-full p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-[var(--brand-primary)] font-display text-base font-extrabold text-white">
                          {step.n}
                        </span>
                        <Icon className="size-5 text-[var(--brand-primary)]" aria-hidden="true" />
                      </div>
                      <h3 className="mt-3.5 font-display text-[20px] font-extrabold leading-snug text-[var(--fg-primary)]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--fg-secondary)]">
                        {step.body}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────── */}
        <section id="features" className="scroll-mt-20 border-b border-[var(--border-default)] bg-[var(--bg-surface)] py-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="What you get"
              title="Six things that actually move the needle"
              description="Not a feature list for its own sake — each one exists because a learner said the alternative was wasting their time."
              align="center"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} hover className="p-5">
                    <span className="inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[#eef2ff]">
                      <Icon className="size-5 text-[var(--brand-primary)]" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3.5 font-display text-[17px] font-extrabold leading-snug text-[var(--fg-primary)]">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--fg-secondary)]">
                      {feature.body}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Comparison ───────────────────────────────────────────── */}
        <section className="border-b border-[var(--border-default)] py-16">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Why not just ChatGPT or YouTube?"
              title="Generic tools don't know your board"
              align="center"
            />
            <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
              <table className="w-full text-left text-[14.5px]">
                <caption className="sr-only">
                  Sherpa compared with generic study apps across six dimensions
                </caption>
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)]">
                    <th scope="col" className="px-4 py-3 font-display font-extrabold text-[var(--fg-primary)]">
                      Dimension
                    </th>
                    <th scope="col" className="px-4 py-3 font-display font-extrabold text-[var(--fg-secondary)]">
                      Generic apps
                    </th>
                    <th scope="col" className="px-4 py-3 font-display font-extrabold text-[var(--brand-primary)]">
                      Sherpa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.label} className="border-b border-[var(--border-default)] last:border-0">
                      <th scope="row" className="px-4 py-3 font-semibold text-[var(--fg-primary)]">
                        {row.label}
                      </th>
                      <td className="px-4 py-3 text-[var(--fg-secondary)]">
                        <span className="flex items-start gap-2">
                          <X className="mt-0.5 size-4 shrink-0 text-[#b91c1c]" aria-hidden="true" />
                          <span>
                            <span className="sr-only">Not offered: </span>
                            {row.generic}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[var(--fg-primary)]">
                        <span className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-[#047857]" aria-hidden="true" strokeWidth={3} />
                          <span>
                            <span className="sr-only">Offered: </span>
                            {row.sherpa}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────── */}
        <section className="border-b border-[var(--border-default)] bg-[var(--bg-surface)] py-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="Learners" title="What changes in week one" align="center" />
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="card p-5">
                  <blockquote className="text-[15px] leading-relaxed text-[var(--fg-secondary)]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span
                      className="flex size-9 items-center justify-center rounded-full font-display text-[13px] font-extrabold text-white"
                      style={{ background: "#4F46E5" }}
                      aria-hidden="true"
                    >
                      {t.name[0]}
                    </span>
                    <span>
                      <span className="block font-display text-[14px] font-extrabold text-[var(--fg-primary)]">
                        {t.name}
                      </span>
                      <span className="block text-[13px] text-[var(--fg-muted)]">{t.meta}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 text-center text-[12.5px] text-[var(--fg-muted)]">
              Illustrative learner stories — names changed, wording condensed. We don&apos;t publish invented
              endorsements as facts.
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-20 border-b border-[var(--border-default)] py-16">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <SectionHeading eyebrow="Questions" title="The things people ask first" align="center" />
            <div className="mt-8">
              <FaqAccordion />
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────── */}
        <section className="bg-[var(--brand-primary)] py-16 text-white">
          <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold leading-tight">
              Your next study session starts here.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[16.5px] leading-relaxed text-indigo-100">
              Free forever. Upgrade only when you need deep-dive notes and PYQs.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="btn inline-flex min-h-12 w-full justify-center border-2 border-white bg-white px-7 font-extrabold text-[var(--brand-primary)] sm:w-auto"
              >
                Start learning free <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/demo/light-reflection-refraction"
                className="btn inline-flex min-h-12 w-full justify-center border-2 border-white/60 bg-transparent px-7 font-extrabold text-white sm:w-auto"
              >
                Try a chapter first
              </Link>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-indigo-200">
              <Wifi className="size-3.5" aria-hidden="true" /> Works offline after your first visit
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
      <Badge className="sr-only" tone="neutral">
        Sherpa
      </Badge>
    </>
  );
}
