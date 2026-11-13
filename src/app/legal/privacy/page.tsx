import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, type LegalSection } from "@/components/legal-layout";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Sherpa collects, why, how long it keeps it, and how to get it deleted.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <p>
        Sherpa is a study application operated by the Sherpa team (“we”, “us”). For the purposes of the
        UK/EU GDPR we are the <strong>data controller</strong> for the account and learning data described
        here. Our contact address is{" "}
        <a href="mailto:privacy@sherpa.study">privacy@sherpa.study</a>.
      </p>
    ),
  },
  {
    id: "data-we-collect",
    heading: "Data we collect",
    body: (
      <ul>
        <li>
          <strong>Account data</strong> — email address, hashed password, display name, preferred language.
        </li>
        <li>
          <strong>Learning data</strong> — country, board, class level, study hours, chapters opened, note
          depth read, quiz answers and scores, spaced-repetition ratings and mastery scores.
        </li>
        <li>
          <strong>Tutor transcripts</strong> — messages you send to the tutor and the replies, so the
          conversation can continue across sessions.
        </li>
        <li>
          <strong>Device and usage data</strong> — browser type, approximate region from IP, page views and
          errors. Analytics only run with your consent.
        </li>
        <li>
          <strong>Cookie consent records</strong> — what you chose, when, and via which of the three buttons.
        </li>
      </ul>
    ),
  },
  {
    id: "how-we-use-data",
    heading: "How we use data",
    body: (
      <ul>
        <li>To generate roadmaps and notes appropriate to your board, level and study hours.</li>
        <li>To schedule reviews and compute mastery scores.</li>
        <li>To keep your tutor conversation coherent and personalised to your recent mistakes.</li>
        <li>To secure accounts, prevent abuse, and apply rate limits.</li>
        <li>To improve chapters where learners consistently report confusion — in aggregate.</li>
      </ul>
    ),
  },
  {
    id: "legal-bases",
    heading: "Legal bases (GDPR)",
    body: (
      <ul>
        <li>
          <strong>Contract</strong> — processing needed to give you the service you signed up for.
        </li>
        <li>
          <strong>Consent</strong> — analytics and personalisation cookies. Withdraw any time from Settings
          → Privacy.
        </li>
        <li>
          <strong>Legitimate interests</strong> — security, fraud prevention, and aggregated product
          improvement, balanced against your rights.
        </li>
        <li>
          <strong>Legal obligation</strong> — retaining billing records where tax law requires it.
        </li>
      </ul>
    ),
  },
  {
    id: "sharing",
    heading: "Sharing and sub-processors",
    body: (
      <ul>
        <li>
          <strong>Supabase</strong> — database, authentication and file storage (EU/US regions).
        </li>
        <li>
          <strong>Model providers</strong> (OpenAI, Anthropic or Google, depending on configuration) — only
          when a hosted model is enabled. Prompts contain chapter and proficiency context, never your email
          or password.
        </li>
        <li>
          <strong>Upstash</strong> — Redis cache and rate limiting.
        </li>
        <li>
          <strong>PostHog</strong> — product analytics, only after analytics consent.
        </li>
        <li>
          <strong>Sentry</strong> — error monitoring with PII scrubbing enabled.
        </li>
        <li>
          <strong>Razorpay / Stripe</strong> — payment processing for Pro. Card numbers never reach our
          servers.
        </li>
      </ul>
    ),
  },
  {
    id: "transfers",
    heading: "International transfers",
    body: (
      <p>
        Some sub-processors process data outside your country. Where that happens we rely on Standard
        Contractual Clauses or an equivalent transfer mechanism, and we keep the list of sub-processors on
        this page so you can see where your data goes.
      </p>
    ),
  },
  {
    id: "retention",
    heading: "Retention",
    body: (
      <ul>
        <li>Account and learning data: until you delete your account.</li>
        <li>Deleted accounts: hard-deleted within 30 days; soft-deleted and signed out immediately.</li>
        <li>Generated notes: cached with a 30-day TTL, then regenerated on demand.</li>
        <li>Consent logs: retained for 3 years as an audit record, then aggregated.</li>
        <li>Error logs: 90 days.</li>
      </ul>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: (
      <ul>
        <li>
          <strong>Access and portability</strong> — export everything as JSON plus Markdown from Settings →
          Privacy. The export is generated immediately.
        </li>
        <li>
          <strong>Erasure</strong> — delete your account in Settings → Danger Zone. Hard delete inside 30
          days.
        </li>
        <li>
          <strong>Objection and restriction</strong> — email us and we will stop the processing you object
          to, or explain why we cannot.
        </li>
        <li>
          <strong>Withdraw consent</strong> — reopen the cookie modal from any page footer.
        </li>
        <li>
          <strong>Complain</strong> — you may lodge a complaint with your local supervisory authority.
        </li>
      </ul>
    ),
  },
  {
    id: "children",
    heading: "Children's privacy",
    body: (
      <p>
        Sherpa is intended for learners aged 13 and over. Under COPPA and GDPR-K, accounts for children
        under 13 require verifiable parental consent; we do not knowingly collect data from a child under 13
        without it. If you believe a child under 13 has created an account, email us and we will remove it.
        We never show advertising to users under 13, and we never sell personal data at any age.
      </p>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies",
    body: (
      <p>
        Essential cookies keep you signed in and protect forms. Optional cookies cover analytics,
        personalisation and (in future) marketing, and are off until you turn them on. Full detail, including
        every cookie name and lifetime, is in our{" "}
        <Link href="/legal/cookies">Cookie Policy</Link>.
      </p>
    ),
  },
  {
    id: "security",
    heading: "Security",
    body: (
      <p>
        Passwords are hashed with scrypt and a per-user salt. Database tables use row-level security so one
        account cannot read another&apos;s rows. API keys live server-side only. All mutations are rate
        limited and CSRF-protected. We apply Content-Security-Policy and security headers at the edge.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <p>
        When we make a material change we bump the policy version and tell you in-app before it takes
        effect. Cookie consent is re-requested when its version changes, never silently.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Privacy questions: <a href="mailto:privacy@sherpa.study">privacy@sherpa.study</a>. Data protection
        officer: <a href="mailto:dpo@sherpa.study">dpo@sherpa.study</a>. We aim to reply within five working
        days.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader signedIn={false} />
      <main>
        <LegalLayout
          title="Privacy Policy"
          summary="A plain-language account of what we collect, why we need it, how long we keep it, and how to take it back."
          updated="2 November 2026"
          sections={SECTIONS}
        />
      </main>
      <SiteFooter />
    </>
  );
}
