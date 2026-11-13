"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, BookOpen, ExternalLink, Settings, ArrowRight } from "lucide-react";
import { CHAPTERS, SUBJECTS } from "@/lib/curriculum/chapters";
import { resolveSubject } from "@/lib/curriculum/catalog";

interface Result {
  id: string;
  label: string;
  hint: string;
  href: string;
  kind: "chapter" | "subject" | "setting";
  external?: boolean;
}

function buildIndex(): Result[] {
  const chapters: Result[] = CHAPTERS.map((c) => {
    const subject = resolveSubject(c.subjectSlug);
    return {
      id: `c-${c.slug}`,
      label: c.name,
      hint: subject ? `${subject.name} · ${subject.level.name}` : "Chapter",
      href: `/app/chapters/${c.slug}`,
      kind: "chapter",
    };
  });
  const subjects: Result[] = SUBJECTS.map((s) => {
    const resolved = resolveSubject(s.slug);
    return {
      id: `s-${s.slug}`,
      label: s.name,
      hint: resolved ? `${resolved.curriculum.name} · ${resolved.level.name}` : "Subject",
      href: `/app/subjects/${s.slug}`,
      kind: "subject",
    };
  });
  const settings: Result[] = [
    { id: "set-profile", label: "Profile settings", hint: "Name, board, level", href: "/app/settings/profile", kind: "setting" },
    { id: "set-prefs", label: "Preferences", hint: "Theme, font, motion", href: "/app/settings/preferences", kind: "setting" },
    { id: "set-privacy", label: "Privacy & cookies", hint: "Consent, export, delete", href: "/app/settings/privacy", kind: "setting" },
    { id: "set-billing", label: "Billing", hint: "Plan and invoices", href: "/app/settings/billing", kind: "setting" },
    { id: "set-danger", label: "Danger zone", hint: "Delete account", href: "/app/settings/danger", kind: "setting" },
  ];
  return [...chapters, ...subjects, ...settings];
}

function score(query: string, result: Result): number {
  const q = query.toLowerCase();
  const label = result.label.toLowerCase();
  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;
  const words = q.split(/\s+/);
  if (words.every((w) => label.includes(w) || result.hint.toLowerCase().includes(w))) return 40;
  return 0;
}

const KIND_ICON = {
  chapter: BookOpen,
  subject: BookOpen,
  setting: Settings,
} as const;

export function CommandPalette({ openSignal = 0 }: { openSignal?: number }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const index = React.useMemo(buildIndex, []);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (openSignal > 0) setOpen(true);
  }, [openSignal]);

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results = React.useMemo(() => {
    if (!query.trim()) return index.slice(0, 6);
    return index
      .map((r) => ({ r, s: score(query, r) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.r);
  }, [index, query]);

  function go(result: Result) {
    setOpen(false);
    router.push(result.href);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 p-4 pt-[12vh]">
      <button type="button" aria-label="Close search" className="absolute inset-0" onClick={() => setOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Sherpa"
        className="relative w-full max-w-xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-[var(--border-default)] px-4">
          <Search className="size-4 shrink-0 text-[var(--fg-muted)]" aria-hidden="true" />
          <input
            ref={inputRef}
            className="min-h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--fg-muted)]"
            placeholder="Search chapters, subjects, settings…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(results.length - 1, i + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              }
              if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                go(results[active]!);
              }
            }}
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${results[active]!.id}` : undefined}
            role="combobox"
            aria-expanded="true"
          />
          <kbd className="hidden shrink-0 rounded border border-[var(--border-default)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--fg-muted)] sm:block">
            esc
          </kbd>
        </div>

        <ul id="palette-results" role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-8 text-center text-[14px] text-[var(--fg-secondary)]">
              No matches for “{query}”. Try a chapter name like “Light” or “Trigonometry”.
            </li>
          ) : (
            results.map((result, i) => {
              const Icon = KIND_ICON[result.kind];
              return (
                <li key={result.id} role="option" aria-selected={i === active} id={`palette-${result.id}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(result)}
                    className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left ${
                      i === active ? "bg-[#eef2ff]" : ""
                    }`}
                  >
                    <Icon className="size-4 shrink-0 text-[var(--brand-primary)]" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-semibold text-[var(--fg-primary)]">
                        {result.label}
                      </span>
                      <span className="block truncate text-[12.5px] text-[var(--fg-muted)]">{result.hint}</span>
                    </span>
                    {i === active ? <ArrowRight className="size-4 shrink-0 text-[var(--brand-primary)]" aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-[var(--border-default)] px-4 py-2 text-[11.5px] text-[var(--fg-muted)]">
          <span>↑↓ to navigate · ↵ to open</span>
          <Link href="/app/search" className="font-semibold text-[var(--brand-primary)] underline" onClick={() => setOpen(false)}>
            Full search page
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CommandPaletteTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
      className="flex min-h-11 w-full items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-[13.5px] text-[var(--fg-muted)] hover:border-[var(--border-strong)]"
    >
      <Search className="size-4" aria-hidden="true" />
      <span className="flex-1 text-left">Search…</span>
      <kbd className="rounded border border-[var(--border-default)] px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd>
    </button>
  );
}

export const ExternalIcon = ExternalLink;
