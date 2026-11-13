"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Settings } from "lucide-react";
import { CHAPTERS, SUBJECTS } from "@/lib/curriculum/chapters";
import { resolveSubject } from "@/lib/curriculum/catalog";

interface Row {
  id: string;
  label: string;
  hint: string;
  href: string;
  kind: "chapter" | "subject" | "setting";
}

function buildRows(): Row[] {
  return [
    ...CHAPTERS.map((c) => {
      const s = resolveSubject(c.subjectSlug);
      return {
        id: `c-${c.slug}`,
        label: c.name,
        hint: s ? `${s.name} · ${s.curriculum.name} ${s.level.name}` : "Chapter",
        href: `/app/chapters/${c.slug}?tab=notes`,
        kind: "chapter" as const,
      };
    }),
    ...SUBJECTS.map((s) => {
      const r = resolveSubject(s.slug);
      return {
        id: `s-${s.slug}`,
        label: s.name,
        hint: r ? `${r.curriculum.name} · ${r.level.name}` : "Subject",
        href: `/app/subjects/${s.slug}`,
        kind: "subject" as const,
      };
    }),
    {
      id: "set-profile",
      label: "Profile settings",
      hint: "Name, board, level",
      href: "/app/settings/profile",
      kind: "setting" as const,
    },
    {
      id: "set-prefs",
      label: "Preferences",
      hint: "Theme, font, motion, reading",
      href: "/app/settings/preferences",
      kind: "setting" as const,
    },
    {
      id: "set-notifications",
      label: "Notifications",
      hint: "Email and push reminders",
      href: "/app/settings/notifications",
      kind: "setting" as const,
    },
    {
      id: "set-privacy",
      label: "Privacy & cookies",
      hint: "Consent, export, delete",
      href: "/app/settings/privacy",
      kind: "setting" as const,
    },
    {
      id: "set-billing",
      label: "Billing",
      hint: "Plan and invoices",
      href: "/app/settings/billing",
      kind: "setting" as const,
    },
    {
      id: "set-danger",
      label: "Danger zone",
      hint: "Delete account",
      href: "/app/settings/danger",
      kind: "setting" as const,
    },
  ];
}

export function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const rows = React.useMemo(buildRows, []);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows
      .map((r) => {
        const label = r.label.toLowerCase();
        const hint = r.hint.toLowerCase();
        let s = 0;
        if (label === q) s = 100;
        else if (label.startsWith(q)) s = 80;
        else if (label.includes(q)) s = 60;
        else if (hint.includes(q)) s = 30;
        else if (q.split(/\s+/).every((w) => label.includes(w) || hint.includes(w))) s = 40;
        return { r, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.r);
  }, [query, rows]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-muted)]" aria-hidden="true" />
        <label htmlFor="search-input" className="sr-only">
          Search chapters, subjects and settings
        </label>
        <input
          id="search-input"
          className="input w-full pl-10"
          placeholder="Try “light”, “trigonometry”, “billing”…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <p className="text-[13px] font-semibold text-[var(--fg-muted)]" aria-live="polite">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      <ul className="divide-y divide-[var(--border-default)] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
        {results.length === 0 ? (
          <li className="px-4 py-10 text-center text-[14px] text-[var(--fg-secondary)]">
            No matches for “{query}”.
          </li>
        ) : (
          results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => router.push(r.href)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--bg-subtle)]"
              >
                {r.kind === "setting" ? (
                  <Settings className="size-4 shrink-0 text-[var(--brand-primary)]" aria-hidden="true" />
                ) : (
                  <BookOpen className="size-4 shrink-0 text-[var(--brand-primary)]" aria-hidden="true" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-bold text-[var(--fg-primary)]">{r.label}</span>
                  <span className="block truncate text-[12.5px] text-[var(--fg-muted)]">{r.hint}</span>
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">{r.kind}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
