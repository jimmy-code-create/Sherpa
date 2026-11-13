import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/legal-layout";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Every cookie Sherpa sets, what it is for, how long it lasts, and how to turn it off.",
};

const COOKIES = [
  { name: "sherpa_session", category: "Strictly necessary", purpose: "Keeps you signed in; signed, HTTP-only.", duration: "30 days", provider: "Sherpa" },
  { name: "sda_cookie_consent", category: "Strictly necessary", purpose: "Remembers your cookie choices so we don't ask again.", duration: "12 months", provider: "Sherpa (localStorage)" },
  { name: "sherpa_preferences", category: "Strictly necessary", purpose: "Theme, font size and accessibility settings.", duration: "Persistent", provider: "Sherpa (localStorage)" },
  { name: "sherpa_srs_queue", category: "Strictly necessary", purpose: "Offline queue for reviews and quiz answers submitted without a network.", duration: "Persistent", provider: "Sherpa (IndexedDB)" },
  { name: "ph_*", category: "Analytics", purpose: "Anonymised product analytics: which chapters are opened, where people get stuck.", duration: "12 months", provider: "PostHog" },
  { name: "sentry_*", category: "Analytics", purpose: "Error monitoring so we can fix crashes; PII is scrubbed.", duration: "Session", provider: "Sentry" },
  { name: "sherpa_last_path", category: "Personalization", purpose: "Remembers your board and level to rank chapters and resources.", duration: "6 months", provider: "Sherpa (localStorage)" },
];

const SECTIONS: LegalSection[] = [
  {
    id: "what-are-cookies",
    heading: "What cookies are",
    body: (
      <p>
        Cookies are small text files a site stores in your browser. Sherpa also uses related browser storage
        (localStorage and IndexedDB) for preferences and offline reading. We refer to all of it as
        &ldquo;cookies&rdquo; here for simplicity.
      </p>
    ),
  },
  {
    id: "categories",
    heading: "The four categories",
    body: (
      <ul>
        <li>
          <strong>Strictly necessary</strong> — required to sign in, keep the app secure and remember your
          choices. Always on; the toggle is locked because the app cannot work without them.
        </li>
        <li>
          <strong>Analytics</strong> — aggregate, anonymised usage. Off by default.
        </li>
        <li>
          <strong>Personalization</strong> — remembers your board, level and recent chapters so
          recommendations are relevant. Off by default.
        </li>
        <li>
          <strong>Marketing</strong> — reserved for future use. Off by default, never sold.
        </li>
      </ul>
    ),
  },
  {
    id: "table",
    heading: "Every cookie we set",
    body: (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <caption className="sr-only">Cookie inventory</caption>
          <thead>
            <tr className="bg-[var(--bg-subtle)]">
              <th scope="col" className="border border-[var(--border-default)] px-3 py-2 text-left">Name</th>
              <th scope="col" className="border border-[var(--border-default)] px-3 py-2 text-left">Category</th>
              <th scope="col" className="border border-[var(--border-default)] px-3 py-2 text-left">Purpose</th>
              <th scope="col" className="border border-[var(--border-default)] px-3 py-2 text-left">Duration</th>
              <th scope="col" className="border border-[var(--border-default)] px-3 py-2 text-left">Provider</th>
            </tr>
          </thead>
          <tbody>
            {COOKIES.map((c) => (
              <tr key={c.name}>
                <td className="border border-[var(--border-default)] px-3 py-2 font-mono text-[12px]">{c.name}</td>
                <td className="border border-[var(--border-default)] px-3 py-2">{c.category}</td>
                <td className="border border-[var(--border-default)] px-3 py-2">{c.purpose}</td>
                <td className="border border-[var(--border-default)] px-3 py-2 whitespace-nowrap">{c.duration}</td>
                <td className="border border-[var(--border-default)] px-3 py-2 whitespace-nowrap">{c.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "consent",
    heading: "How consent works",
    body: (
      <>
        <p>
          On your first visit you get three equally prominent choices: <strong>Accept all</strong>,{" "}
          <strong>Reject non-essential</strong> and <strong>Customize</strong>. Nothing optional is pre-ticked.
          The banner never covers the page or blocks reading, and it appears a couple of seconds after the
          content so it does not delay the first paint.
        </p>
        <p>
          Your choice is stored locally and on our servers with a version number and a timestamp. We only ask
          again if the policy version changes or after 12 months. The Reject button is the same size and
          colour weight as Accept — that is a hard product rule, not a style preference.
        </p>
      </>
    ),
  },
  {
    id: "geo",
    heading: "Regional differences",
    body: (
      <ul>
        <li>
          <strong>EU / UK / EEA</strong> — opt-in. No optional cookie is set until you positively act.
        </li>
        <li>
          <strong>California</strong> — opt-out, with a &ldquo;Do Not Sell or Share My Personal Information&rdquo;
          link in the footer. We do not sell personal information.
        </li>
        <li>
          <strong>Elsewhere</strong> — notice plus opt-out, with the same three-button banner.
        </li>
      </ul>
    ),
  },
  {
    id: "manage",
    heading: "How to change your choices",
    body: (
      <>
        <p>
          Click <strong>Cookie settings</strong> in the footer of any page, or go to Settings → Privacy →
          Cookie settings. You can flip any optional category at any time; the change takes effect
          immediately.
        </p>
        <p>
          You can also clear cookies in your browser settings, in which case we will ask again on your next
          visit. Blocking strictly necessary cookies will sign you out and may break the app.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about cookies: <a href="mailto:privacy@sherpa.study">privacy@sherpa.study</a>.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <SiteHeader signedIn={false} />
      <main>
        <LegalLayout
          title="Cookie Policy"
          summary="What we store in your browser, why, for how long, and how to turn any of it off."
          updated="2 November 2026"
          sections={SECTIONS}
        />
      </main>
      <SiteFooter />
    </>
  );
}
