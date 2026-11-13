import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/legal-layout";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The agreement between you and Sherpa: eligibility, acceptable use, AI content, payments.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of these terms",
    body: (
      <p>
        By creating an account or using Sherpa you agree to these terms and to our{" "}
        <a href="/legal/privacy">Privacy Policy</a>. If you do not agree, do not use the service. If you are
        using Sherpa on behalf of an institution, you confirm you have authority to bind that institution.
      </p>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility",
    body: (
      <p>
        You must be at least 13 years old. If you are under 18, you confirm a parent or guardian has agreed
        to these terms on your behalf. Accounts for children under 13 require verifiable parental consent and
        are not self-service.
      </p>
    ),
  },
  {
    id: "account",
    heading: "Account responsibilities",
    body: (
      <ul>
        <li>Keep your password confidential and use a unique one.</li>
        <li>One account per person. Sharing a login defeats the personalisation that makes Sherpa useful.</li>
        <li>
          You are responsible for activity under your account. Tell us promptly at{" "}
          <a href="mailto:security@sherpa.study">security@sherpa.study</a> if you suspect a compromise.
        </li>
      </ul>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>scrape, crawl or bulk-export content except through the provided export tools;</li>
          <li>circumvent rate limits, paywalls or authentication;</li>
          <li>upload unlawful, harassing or infringing material anywhere in the service;</li>
          <li>use Sherpa to write work you then submit as your own where that is prohibited;</li>
          <li>resell, sublicense or rebrand the service without a written agreement.</li>
        </ul>
        <p>
          The full list, and how we handle violations, is in the{" "}
          <a href="/legal/acceptable-use">Acceptable Use Policy</a>.
        </p>
      </>
    ),
  },
  {
    id: "ai-disclaimer",
    heading: "AI-generated content disclaimer",
    body: (
      <p>
        Notes, roadmaps, quizzes and tutor replies are study aids, not professional instruction. They are
        generated and validated automatically and can contain errors. Every section has a report button —
        please use it. Sherpa is <strong>not a substitute for a qualified teacher</strong>, for your
        board&apos;s official syllabus, or for official exam guidance. Always confirm exam-critical facts
        against your board&apos;s published material.
      </p>
    ),
  },
  {
    id: "ip",
    heading: "Intellectual property",
    body: (
      <p>
        You own the notes you generate and the data you enter; you may export it at any time. We own the
        platform: the software, the design system, the authored chapter knowledge base and the Sherpa
        trademarks. We do not reproduce copyrighted textbook text — content is original or openly licensed,
        with citations. If you believe something infringes your rights, email{" "}
        <a href="mailto:legal@sherpa.study">legal@sherpa.study</a> and we will act.
      </p>
    ),
  },
  {
    id: "payments",
    heading: "Payments and refunds",
    body: (
      <p>
        Pro is billed monthly or annually through Razorpay (India) or Stripe (elsewhere). Prices include
        applicable taxes where required. You may cancel any time; cancellation stops the next renewal and you
        keep access until the period ends. If a renewal was charged in error, contact us within 14 days for a
        full refund. We do not use fake scarcity, countdown timers or pre-checked upsells.
      </p>
    ),
  },
  {
    id: "termination",
    heading: "Termination",
    body: (
      <p>
        You can delete your account at any time from Settings → Danger Zone. We may suspend or terminate an
        account that materially breaches these terms, that we are legally required to remove, or that
        threatens the security of other users. Where practical we will warn you first and explain why.
      </p>
    ),
  },
  {
    id: "disclaimers",
    heading: "Disclaimers",
    body: (
      <p>
        The service is provided “as is” and “as available”. To the extent permitted by law we disclaim
        implied warranties of merchantability, fitness for a particular purpose and non-infringement. We do
        not warrant that the service will be uninterrupted, or that any study outcome will be achieved.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <p>
        To the extent permitted by law, our aggregate liability arising from your use of Sherpa is limited to
        the greater of (a) the amount you paid us in the 12 months before the claim, or (b) ₹1,000 / $15. We
        are not liable for indirect or consequential losses. Nothing here limits liability for death, personal
        injury or fraud, or any liability that cannot lawfully be limited.
      </p>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of India, and the courts of Jaipur, Rajasthan have exclusive
        jurisdiction, except that consumers in the EU, UK or US retain the protection of the mandatory
        consumer law of their own country of residence.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    body: (
      <p>
        We may update these terms. For material changes we give at least 30 days&apos; notice in-app before
        they take effect. Continuing to use Sherpa after that date means you accept the updated terms.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteHeader signedIn={false} />
      <main>
        <LegalLayout
          title="Terms of Service"
          summary="The rules of the road: what you can expect from Sherpa, and what we expect from you."
          updated="2 November 2026"
          sections={SECTIONS}
        />
      </main>
      <SiteFooter />
    </>
  );
}
