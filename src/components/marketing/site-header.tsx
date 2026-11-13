"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LogoLink } from "@/components/brand";
import { ButtonLink } from "@/components/ui";

const NAV = [
  { href: "/#how-it-works", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled
          ? "border-[var(--border-default)] bg-[rgba(250,250,249,0.86)] backdrop-blur-md dark:bg-[rgba(15,23,42,0.86)]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <LogoLink />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-pill)] px-3.5 py-2 text-[15px] font-semibold text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {signedIn ? (
            <ButtonLink href="/app" size="sm">
              Go to dashboard →
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/auth/sign-in" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/auth/sign-up" size="sm">
                Start free →
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 pb-5 pt-3 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="min-h-11 rounded-[var(--radius-md)] px-3 py-2.5 text-[15px] font-semibold text-[var(--fg-primary)] hover:bg-[var(--bg-subtle)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            {signedIn ? (
              <ButtonLink href="/app" block>
                Go to dashboard →
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/auth/sign-up" block>
                  Start free →
                </ButtonLink>
                <ButtonLink href="/auth/sign-in" variant="secondary" block>
                  Sign in
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
