"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Library,
  RotateCcw,
  Settings,
  ShieldCheck,
  LogOut,
  BrainCircuit,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Today", icon: Home, exact: true },
  { href: "/app/subjects", label: "Subjects", icon: Library },
  { href: "/app/review", label: "Review", icon: RotateCcw },
  { href: "/app/tutor", label: "Tutor", icon: BrainCircuit },
  { href: "/app/settings/profile", label: "Profile", icon: UserRound },
] as const;

function LogoMark() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--brand-primary)] shadow-[var(--shadow-brand)]">
      <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 23L13 11l4.2 7.2L19.6 14 26 23H6z" fill="#fff" />
        <circle cx="13" cy="11" r="2.1" fill="#F59E0B" />
      </svg>
    </span>
  );
}

function useActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop: fixed left sidebar. Mobile: hidden — the bottom nav takes over. */
function DesktopSidebar({
  name,
  email,
  isAdmin,
  dueCount,
}: {
  name: string;
  email: string;
  isAdmin: boolean;
  dueCount: number;
}) {
  const isActive = useActive();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-[var(--border-default)] bg-[var(--bg-surface)] md:flex">
      <div className="flex h-16 items-center px-4">
        <Link href="/app" aria-label="Sherpa dashboard" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-[17px] font-extrabold text-[var(--fg-primary)]">Sherpa</span>
        </Link>
      </div>
      <nav aria-label="App" className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, "exact" in item ? item.exact : undefined);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-[14.5px] font-semibold transition-colors",
                active
                  ? "bg-[var(--brand-soft)] text-[var(--brand-primary)]"
                  : "text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)]",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {item.href === "/app/review" && dueCount > 0 ? (
                <span className="rounded-full bg-[var(--brand-primary)] px-1.5 py-0.5 text-[11px] font-extrabold text-white">
                  {dueCount > 99 ? "99+" : dueCount}
                  <span className="sr-only"> cards due</span>
                </span>
              ) : null}
            </Link>
          );
        })}
        {isAdmin ? (
          <Link
            href="/admin"
            className="flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-[14.5px] font-semibold text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)]"
          >
            <ShieldCheck className="size-[18px]" aria-hidden="true" />
            Admin
          </Link>
        ) : null}
      </nav>
      <div className="border-t border-[var(--border-default)] p-3">
        <div className="flex items-center gap-2.5 px-1 pb-2">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] font-display text-[13px] font-extrabold text-white"
            aria-hidden="true"
          >
            {(name || email)[0]?.toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[13.5px] font-extrabold text-[var(--fg-primary)]">
              {name || "Learner"}
            </span>
            <span className="block truncate text-[11.5px] text-[var(--fg-muted)]">{email}</span>
          </span>
        </div>
        <form action="/api/auth/sign-out" method="post">
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left text-[14px] font-semibold text-[var(--fg-secondary)] transition-colors hover:bg-[var(--bg-subtle)]"
          >
            <LogOut className="size-[18px]" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

/** Mobile: minimal top header — logo + settings gear only. */
function MobileTopBar() {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-3 md:hidden">
      <Link href="/app" aria-label="Sherpa dashboard" className="flex items-center gap-2">
        <LogoMark />
        <span className="font-display text-[16px] font-extrabold text-[var(--fg-primary)]">Sherpa</span>
      </Link>
      <Link
        href="/app/settings"
        aria-label="Settings"
        className="flex size-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--fg-secondary)] transition-colors hover:bg-[var(--bg-subtle)]"
      >
        <Settings className="size-5" aria-hidden="true" />
      </Link>
    </div>
  );
}

/** Mobile: fixed bottom navigation — Home, Subjects, Review, Tutor, Profile. */
function MobileBottomNav({ dueCount }: { dueCount: number }) {
  const isActive = useActive();
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-default)] bg-[var(--bg-surface)] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, "exact" in item ? item.exact : undefined);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition-colors",
                  active ? "text-[var(--brand-primary)]" : "text-[var(--fg-muted)] hover:text-[var(--fg-primary)]",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden="true" />
                  {item.href === "/app/review" && dueCount > 0 ? (
                    <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[9.5px] font-extrabold text-white">
                      {dueCount > 9 ? "9+" : dueCount}
                    </span>
                  ) : null}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Responsive app chrome. Renders exactly one navigation model per breakpoint:
 * desktop (md+) gets the fixed left sidebar, mobile gets top bar + bottom nav.
 * The two never coexist, so the sidebar can never bleed onto a phone screen.
 */
export function Sidebar(props: {
  name: string;
  email: string;
  isAdmin: boolean;
  dueCount: number;
}) {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileTopBar />
      <MobileBottomNav dueCount={props.dueCount} />
    </>
  );
}
