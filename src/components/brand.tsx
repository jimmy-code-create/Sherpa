import Link from "next/link";
import { cn } from "@/lib/utils";

/** Sherpa mark: a stylised peak with a trail, drawn inline (no network fetch). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="9" fill="#4F46E5" />
        <path d="M6 23L13 11l4.2 7.2L19.6 14 26 23H6z" fill="#fff" opacity="0.95" />
        <circle cx="13" cy="11" r="2.1" fill="#F59E0B" />
      </svg>
      <span className="font-display text-[19px] font-extrabold tracking-tight text-[var(--fg-primary)]">
        Sherpa
      </span>
    </span>
  );
}

export function LogoLink({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center rounded-lg py-1" aria-label="Sherpa home">
      <Logo />
    </Link>
  );
}
