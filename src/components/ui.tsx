import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Button ────────────────────────────────────────────────────────── */
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  block?: boolean;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  block,
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("btn", variantClass[variant], size === "sm" && "btn-sm", block && "btn-block", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  block?: boolean;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  block,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn("btn", variantClass[variant], size === "sm" && "btn-sm", block && "btn-block", className)}
      {...props}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}

/* ── Card ──────────────────────────────────────────────────────────── */
export function Card({
  className,
  hover,
  as: As = "div",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean; as?: React.ElementType }) {
  return <As className={cn("card", hover && "card-hover", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-3 p-5 pb-0", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-[17px] font-extrabold leading-snug text-[var(--fg-primary)]", className)}
      {...props}
    />
  );
}

/* ── Badges / pills ────────────────────────────────────────────────── */
type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-[var(--bg-subtle)] text-[var(--fg-secondary)]",
  brand: "bg-[#eef2ff] text-[#4338ca]",
  success: "bg-[#ecfdf5] text-[#047857]",
  warning: "bg-[#fffbeb] text-[#b45309]",
  danger: "bg-[#fef2f2] text-[#b91c1c]",
  info: "bg-[#eff6ff] text-[#1d4ed8]",
};

export function Badge({
  tone = "neutral",
  className,
  icon,
  children,
}: {
  tone?: Tone;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("pill", toneStyles[tone], className)}>
      {icon}
      {children}
    </span>
  );
}

/* ── Mastery ring ──────────────────────────────────────────────────── */
export function ProgressRing({
  value,
  size = 56,
  stroke = 6,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const tone = clamped >= 85 ? "#059669" : clamped >= 40 ? "#4f46e5" : "#9ca3af";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-default)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute font-display text-[13px] font-extrabold tabular-nums" aria-hidden="true">
        {clamped}
      </span>
      <span className="sr-only">{label ?? `${clamped} percent mastered`}</span>
    </div>
  );
}

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-[var(--border-default)]", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div
        className="h-full rounded-full bg-[var(--brand-primary)] transition-[width] duration-400"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* ── Empty / error states ──────────────────────────────────────────── */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] px-6 py-14 text-center">
      {icon ? <div className="mb-3 text-[var(--fg-muted)]">{icon}</div> : null}
      <h3 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-[var(--fg-secondary)]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  retry,
}: {
  title: string;
  description: string;
  retry?: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className="rounded-[var(--radius-lg)] border border-[#fecaca] bg-[#fef2f2] p-6 text-center"
    >
      <h3 className="font-display text-lg font-extrabold text-[#991b1b]">{title}</h3>
      <p className="mt-1.5 text-sm text-[#b91c1c]">{description}</p>
      {retry ? <div className="mt-4 flex justify-center">{retry}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/* ── Section shell ─────────────────────────────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-2 font-display text-[13px] font-extrabold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
          {eyebrow}
        </p>
      ) : null}
      <As className="font-display text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-[1.2] text-[var(--fg-primary)]">
        {title}
      </As>
      {description ? (
        <p className="mt-3 text-[17px] leading-relaxed text-[var(--fg-secondary)]">{description}</p>
      ) : null}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-t border-[var(--border-default)]", className)} />;
}
