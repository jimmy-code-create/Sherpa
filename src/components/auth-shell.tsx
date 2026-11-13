import Link from "next/link";
import { Logo } from "./brand";
import { Check } from "lucide-react";

const POINTS = [
  "Roadmap sized to your study hours",
  "Notes at three depths, all original",
  "A tutor that asks before it answers",
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(380px,480px)]">
      <div className="hidden bg-[linear-gradient(135deg,#EEF2FF_0%,#FAFAF9_60%)] p-10 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" aria-label="Sherpa home">
          <Logo />
        </Link>
        <div className="max-w-md">
          <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
            Start free
          </p>
          <h2 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.15] text-[var(--fg-primary)]">
            Your syllabus, mapped to the days you actually have.
          </h2>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-[15px] text-[var(--fg-secondary)]">
                <Check className="mt-0.5 size-4 shrink-0 text-[#059669]" aria-hidden="true" strokeWidth={3} />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[13px] text-[var(--fg-muted)]">
          No credit card. No ads. Export or delete your data any time.
        </p>
      </div>

      <div className="flex flex-col justify-center px-5 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" aria-label="Sherpa home">
              <Logo />
            </Link>
          </div>
          <h1 className="font-display text-[1.7rem] font-extrabold leading-tight text-[var(--fg-primary)]">
            {title}
          </h1>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--fg-secondary)]">{subtitle}</p>
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="field-error" role="alert">
      <span aria-hidden="true">⚠</span>
      {message}
    </p>
  );
}
