import Link from "next/link";
import { Logo } from "@/components/brand";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-page)]">
      <header className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Sherpa home">
          <Logo />
        </Link>
        <Link
          href="/app"
          className="min-h-11 rounded-[var(--radius-pill)] px-4 py-2.5 text-[14px] font-semibold text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
        >
          Skip to dashboard
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 sm:px-6">{children}</main>
    </div>
  );
}
