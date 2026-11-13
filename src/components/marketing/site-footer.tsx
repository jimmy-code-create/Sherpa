import Link from "next/link";
import { Logo } from "@/components/brand";
import { CookieSettingsButton } from "@/components/cookie-consent";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/demo/light-reflection-refraction", label: "Sample chapter" },
    ],
  },
  {
    title: "Subjects",
    links: [
      { href: "/subjects", label: "Browse subjects" },
      { href: "/demo/light-reflection-refraction", label: "CBSE Class 10 Science" },
      { href: "/demo/linear-equations-graphs", label: "US High School Algebra" },
      { href: "/demo/cell-biology", label: "GCSE Biology" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/about", label: "About & FAQ" },
      { href: "/about#faq", label: "Help centre" },
      { href: "/legal/acceptable-use", label: "Acceptable use" },
      { href: "/pricing#faq", label: "Billing questions" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/cookies", label: "Cookies" },
      { href: "/legal/dpa", label: "DPA (institutions)" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-surface)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-3 max-w-[22ch] text-[13.5px] leading-relaxed text-[var(--fg-secondary)]">
              A curriculum-aware study guide. Made for learners, not for ads.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-display text-[13px] font-extrabold uppercase tracking-[0.1em] text-[var(--fg-muted)]">
                {col.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[var(--fg-secondary)] hover:text-[var(--brand-primary)] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--border-default)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[var(--fg-muted)]">
            © {new Date().getFullYear()} Sherpa. Made for learners, not for ads.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <CookieSettingsButton />
            <label className="flex items-center gap-2 text-[13px] text-[var(--fg-secondary)]">
              <span className="sr-only">Language</span>
              <select
                className="min-h-11 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-[13px] font-semibold"
                defaultValue="en"
                aria-label="Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="bn">বাংলা</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </footer>
  );
}
