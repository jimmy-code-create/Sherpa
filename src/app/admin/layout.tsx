import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { Logo } from "@/components/brand";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/resources", label: "Resource allowlist" },
  { href: "/admin/reports", label: "Content reports" },
];

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-dvh bg-[var(--bg-page)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" aria-label="Admin home">
              <Logo />
            </Link>
            <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--brand-primary)]">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/app" className="text-[13.5px] font-bold text-[var(--fg-secondary)] underline">
              Back to app
            </Link>
            <span className="text-[13px] text-[var(--fg-muted)]">{user.email}</span>
          </div>
        </div>
        <nav aria-label="Admin sections" className="mx-auto flex w-full max-w-6xl gap-1 px-4 pb-2 sm:px-6">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="min-h-9 rounded-[var(--radius-pill)] px-3.5 py-1.5 text-[13.5px] font-bold text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
