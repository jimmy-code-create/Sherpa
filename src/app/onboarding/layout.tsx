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
          className="min-h-11 rounded-[var(--radius-pill)] px-3 py-2 text-[13px] font-bold text-[var(--fg-muted)] underline-offset-4 transition-colors hover:text-[var(--fg-primary)] hover:underline"
        >
          Skip to dashboard
        </Link>
      </header>
      {/* Full-screen card feel on mobile; centered max-width card on desktop */}
      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-2 sm:px-6 sm:pt-6">
        {children}
      </main>
    </div>
  );
}
