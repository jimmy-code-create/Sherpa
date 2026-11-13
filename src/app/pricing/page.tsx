import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ButtonLink, SectionHeading, Card, Badge } from "@/components/ui";
import { getSession } from "@/lib/session";
import { FaqAccordion } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Sherpa is free for every chapter's roadmap, standard notes and practice. Pro adds deep dives and PYQs.",
};

const ROWS = [
  { label: "Roadmap generation", free: "1 per chapter", pro: "Unlimited + regeneration" },
  { label: "Note depths", free: "Quick + Standard", pro: "All three, including Deep Dive" },
  { label: "Note generations", free: "3 per day", pro: "Unlimited" },
  { label: "Practice questions", free: "5 per day", pro: "Unlimited + PYQ bank" },
  { label: "Vetted resources", free: "Free-only first", pro: "Free, freemium and paid ranked together" },
  { label: "Offline chapters", free: "Last 3", pro: "Last 20" },
  { label: "PDF export", free: false, pro: true },
  { label: "Advanced analytics", free: false, pro: "Exam-readiness + weak-topic radar" },
  { label: "Socratic tutor", free: "12 messages / 10 min", pro: "Same rate, priority queue" },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "string") return <span className="text-[var(--fg-secondary)]">{value}</span>;
  return value ? (
    <span className="flex items-center gap-1.5 font-semibold text-[#047857]">
      <Check className="size-4" aria-hidden="true" strokeWidth={3} />
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-[var(--fg-muted)]">
      <Minus className="size-4" aria-hidden="true" />
      <span className="sr-only">Not included</span>
    </span>
  );
}

export default async function PricingPage() {
  const session = await getSession();

  return (
    <>
      <SiteHeader signedIn={Boolean(session)} />
      <main>
        <section className="border-b border-[var(--border-default)] bg-[linear-gradient(135deg,#FAFAF9_0%,#EEF2FF_100%)] py-14">
          <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
            <SectionHeading
              as="h1"
              eyebrow="Pricing"
              title="Free for the whole syllabus. Pro for the deep dives."
              description="Every chapter's roadmap, standard notes, vetted resources and practice sets are free. Pro adds the 25-minute deep dives, PYQs and advanced analytics."
              align="center"
            />
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto grid w-full max-w-4xl gap-6 px-4 sm:px-6 md:grid-cols-2">
            <Card className="flex flex-col p-6">
              <h2 className="font-display text-xl font-extrabold text-[var(--fg-primary)]">Free</h2>
              <p className="mt-1 text-sm text-[var(--fg-secondary)]">Everything you need for a first pass.</p>
              <p className="mt-4 font-display text-[2.2rem] font-extrabold leading-none text-[var(--fg-primary)]">
                ₹0 <span className="text-base font-bold text-[var(--fg-muted)]">/ forever</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-[14.5px] text-[var(--fg-secondary)]">
                {[
                  "Roadmap per chapter",
                  "Quick + Standard notes",
                  "Allowlist resources (free tier first)",
                  "Practice with step-by-step solutions",
                  "Spaced repetition reviews",
                  "Offline: last 3 chapters",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#047857]" aria-hidden="true" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/auth/sign-up" variant="secondary" block className="mt-6">
                Start free
              </ButtonLink>
            </Card>

            <Card className="relative flex flex-col border-[var(--brand-primary)] p-6">
              <Badge tone="brand" className="absolute right-5 top-5">
                Most chosen
              </Badge>
              <h2 className="font-display text-xl font-extrabold text-[var(--fg-primary)]">Pro</h2>
              <p className="mt-1 text-sm text-[var(--fg-secondary)]">For exam season, and for deep understanding.</p>
              <p className="mt-4 font-display text-[2.2rem] font-extrabold leading-none text-[var(--fg-primary)]">
                ₹199 <span className="text-base font-bold text-[var(--fg-muted)]">/ month India</span>
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[var(--fg-muted)]">or $4.99 elsewhere · cancel anytime</p>
              <ul className="mt-5 flex-1 space-y-2.5 text-[14.5px] text-[var(--fg-secondary)]">
                {[
                  "Everything in Free",
                  "Unlimited notes at all three depths",
                  "Unlimited roadmaps and regeneration",
                  "PYQ bank and exam-level practice",
                  "PDF export",
                  "Offline: last 20 chapters",
                  "Exam-readiness and weak-topic radar",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#047857]" aria-hidden="true" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/auth/sign-up" block className="mt-6">
                Start free, upgrade later
              </ButtonLink>
            </Card>
          </div>
        </section>

        <section className="border-y border-[var(--border-default)] bg-[var(--bg-surface)] py-12">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <h2 className="font-display text-xl font-extrabold text-[var(--fg-primary)]">What&apos;s in each plan</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-collapse text-[14.5px]">
                <caption className="sr-only">Feature comparison between Free and Pro</caption>
                <thead>
                  <tr className="bg-[var(--bg-subtle)]">
                    <th scope="col" className="border border-[var(--border-default)] px-4 py-3 text-left font-display font-extrabold">Feature</th>
                    <th scope="col" className="border border-[var(--border-default)] px-4 py-3 text-left font-display font-extrabold">Free</th>
                    <th scope="col" className="border border-[var(--border-default)] px-4 py-3 text-left font-display font-extrabold">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="border border-[var(--border-default)] px-4 py-3 text-left font-semibold text-[var(--fg-primary)]">
                        {row.label}
                      </th>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        <Cell value={row.free} />
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        <Cell value={row.pro} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13.5px] text-[var(--fg-muted)]">
              No countdown timers, no fake scarcity, no pre-checked add-ons. If a paywall ever appears, it
              appears after the free value, not before it.{" "}
              <Link href="/legal/terms" className="font-semibold text-[var(--brand-primary)] underline">
                Refund terms
              </Link>
              .
            </p>
          </div>
        </section>

        <section id="faq" className="py-14">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <SectionHeading title="Billing questions" align="center" />
            <div className="mt-7">
              <FaqAccordion />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
