import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/legal-layout";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "What you may and may not do with Sherpa, and how we handle violations.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "purpose",
    heading: "Purpose",
    body: (
      <p>
        Sherpa exists so a learner can understand a chapter without being sold something. This policy keeps
        it that way. It applies to every account, and to anyone using a shared or institution-issued login.
      </p>
    ),
  },
  {
    id: "permitted",
    heading: "What you may do",
    body: (
      <ul>
        <li>Study any chapter in any curriculum you have access to.</li>
        <li>Export your own notes, quizzes and progress at any time.</li>
        <li>Share a link to a public sample chapter.</li>
        <li>Quote short excerpts of your notes in schoolwork, with attribution to Sherpa.</li>
        <li>Report errors, suggest resources, and tell us what is confusing.</li>
      </ul>
    ),
  },
  {
    id: "prohibited",
    heading: "What you may not do",
    body: (
      <ul>
        <li>Automated scraping, crawling or bulk downloading of content or generated notes.</li>
        <li>Circumventing rate limits, paywalls, or authentication controls.</li>
        <li>Using the tutor to produce work you then present as entirely your own where your school prohibits it.</li>
        <li>Uploading malware, or attempting to exploit the service or other users&apos; accounts.</li>
        <li>Reselling, sublicensing or white-labelling Sherpa without a written agreement.</li>
        <li>Harassment, hate speech, or any unlawful use in tutor messages or reports.</li>
      </ul>
    ),
  },
  {
    id: "academic-integrity",
    heading: "Academic integrity",
    body: (
      <p>
        The tutor is designed to make you think, which is also why it will not hand you a finished answer on
        the first turn. Use it to check your reasoning. If your institution requires that submitted work be
        entirely your own, Sherpa notes are a study input, not a submission. We will not help you misrepresent
        authorship.
      </p>
    ),
  },
  {
    id: "enforcement",
    heading: "Enforcement",
    body: (
      <ul>
        <li>
          <strong>Low severity</strong> (accidental scraping, a rate-limit workaround): a warning and a
          temporary throttle.
        </li>
        <li>
          <strong>Medium severity</strong> (repeated abuse, harassment): suspension pending review.
        </li>
        <li>
          <strong>High severity</strong> (attacks, unlawful content, resale): immediate termination and, where
          required, referral to law enforcement.
        </li>
      </ul>
    ),
  },
  {
    id: "appeals",
    heading: "Appeals",
    body: (
      <p>
        If you believe an enforcement action was a mistake, email{" "}
        <a href="mailto:appeals@sherpa.study">appeals@sherpa.study</a> with your account email and what
        happened. A human reviews every appeal.
      </p>
    ),
  },
];

export default function AcceptableUsePage() {
  return (
    <>
      <SiteHeader signedIn={false} />
      <main>
        <LegalLayout
          title="Acceptable Use Policy"
          summary="A short, specific list of what keeps Sherpa useful for everyone — and what gets an account removed."
          updated="2 November 2026"
          sections={SECTIONS}
        />
      </main>
      <SiteFooter />
    </>
  );
}
