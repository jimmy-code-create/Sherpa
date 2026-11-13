import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMarkSvg } from "./logo-mark";

/** Sherpa wordmark + v2 mark (summit flag), drawn inline (no network fetch). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMarkSvg size={28} className="shrink-0" />
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
