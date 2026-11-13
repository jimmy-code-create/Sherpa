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
  Menu,
  X,
  Search,
} from "lucide-react";
import { Logo } from "./brand";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Today", icon: Home, exact: true },
  { href: "/app/subjects", label: "Subjects", icon: Library },
  { href: "/app/review", label: "Review", icon: RotateCcw },
  { href: "/app/progress", label: "Progress", icon: ShieldCheck },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav aria-label="App" className="flex flex-1 flex-col gap-0.5 px-2">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-[14.5px] font-semibold transition-colors",
              active
                ? "border-l-[3px] border-[var(--brand-primary)] bg-[#eef2ff] pl-[9px] text-[var(--brand-primary)]"
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
  );

  const footer = (
    <div className="border-t border-[var(--border-default)] p-2">
      <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] p-2">
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
          className="flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left text-[14px] font-semibold text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
        >
          <LogOut className="size-[18px]" aria-hidden="true" />
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh w-16 shrink-0 border-r border-[var(--border-default)] bg-[var(--bg-surface)] transition-[width] duration-200 hover:w-60 md:flex md:flex-col">
        <div className="flex h-16 items-center overflow-hidden px-3">
          <Link href="/app" aria-label="Sherpa dashboard" className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--brand-primary)]">
              <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M6 23L13 11l4.2 7.2L19.6 14 26 23H6z" fill="#fff" />
                <circle cx="13" cy="11" r="2.1" fill="#F59E0B" />
              </svg>
            </span>
            <span className="whitespace-nowrap font-display text-[17px] font-extrabold opacity-0 transition-opacity duration-200 group-hover:opacity-100 [aside:hover_&]:opacity-100">
              Sherpa
            </span>
          </Link>
        </div>
        {nav}
        {footer}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-3 md:hidden">
        <Link href="/app" aria-label="Sherpa dashboard">
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/app/search"
            className="flex size-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
            aria-label="Search"
          >
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex size-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[280px] flex-col bg-[var(--bg-surface)] shadow-xl">
            <div className="flex h-14 items-center justify-between px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-11 items-center justify-center rounded-[var(--radius-md)]"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            {nav}
            {footer}
          </div>
        </div>
      ) : null}
    </>
  );
}
