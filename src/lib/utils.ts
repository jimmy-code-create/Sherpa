import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function relativeDate(iso: string | null | undefined): string {
  if (!iso) return "never";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const day = 86_400_000;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < day) return `${Math.floor(diff / 3_600_000)} h ago`;
  if (diff < day * 2) return "yesterday";
  if (diff < day * 30) return `${Math.floor(diff / day)} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function pct(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function plural(count: number, singular: string, pluralForm?: string): string {
  return count === 1 ? singular : (pluralForm ?? `${singular}s`);
}
