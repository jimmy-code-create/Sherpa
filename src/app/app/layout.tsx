import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { CommandPalette } from "@/components/command-palette";
import { requireUser } from "@/lib/session";
import { reviewStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const current = await requireUser("/app");
  const due = await reviewStore.due(current.session.userId);

  return (
    <div className="min-h-dvh bg-[var(--bg-page)] md:flex">
      <Sidebar
        name={current.profile.displayName}
        email={current.user.email}
        isAdmin={current.user.role === "admin"}
        dueCount={due.length}
      />
      <div className="min-w-0 flex-1">
        {/* pb-24 on mobile clears the fixed bottom nav; md:pb-8 restores normal padding */}
        <main id="main-content" className="mx-auto w-full max-w-5xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6 md:py-8">
          {children}
        </main>
      </div>
      <CommandPalette />
      {current.profile.onboardingComplete ? null : (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-4">
          <div className="pointer-events-auto rounded-[var(--radius-pill)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2.5 text-[13px] font-semibold text-[var(--fg-secondary)] shadow-md">
            Onboarding not finished —{" "}
            <a href="/onboarding/welcome" className="font-bold text-[var(--brand-primary)] underline">
              resume setup
            </a>{" "}
            (every step is skippable).
          </div>
        </div>
      )}
    </div>
  );
}
