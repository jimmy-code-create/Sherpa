"use client";

import * as React from "react";
import Link from "next/link";
import { Map, BookOpen, GraduationCap, ExternalLink, Check } from "lucide-react";

/**
 * Interactive 3-tab product preview on the landing page.
 * Read-only, no auth, no network — a genuine slice of the product rendered
 * from the same content the app serves.
 */
const TABS = [
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "resources", label: "Institutes", icon: GraduationCap },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PHASES = [
  { name: "Phase 1 — Foundation", weeks: "Week 1", detail: "Laws of reflection · Understand the normal" },
  { name: "Phase 2 — Core mechanics", weeks: "Week 2–3", detail: "Spherical mirrors · Ray diagrams" },
  { name: "Phase 3 — Exam craft", weeks: "Week 4", detail: "Mirror formula · 3-ray problems" },
  { name: "Phase 4 — Consolidation", weeks: "Week 5–6", detail: "Mixed PYQs · Weak-topic drill" },
];

export function HeroPreview() {
  const [tab, setTab] = React.useState<TabId>("roadmap");

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
      <div
        role="tablist"
        aria-label="Product preview"
        className="flex gap-1 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] p-1"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] px-2 py-2 font-display text-[13px] font-extrabold transition-colors ${
                selected
                  ? "bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-sm"
                  : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-5">
        {tab === "roadmap" ? (
          <div role="tabpanel" id="panel-roadmap" aria-labelledby="tab-roadmap" className="fade-in">
            <p className="mb-3 font-display text-[13px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
              Class 10 Science · Light
            </p>
            <ol className="relative space-y-4 border-l-2 border-dashed border-[var(--border-default)] pl-5">
              {PHASES.map((p, i) => (
                <li key={p.name} className="relative">
                  <span
                    className={`absolute -left-[27px] top-1 flex size-[18px] items-center justify-center rounded-full border-2 ${
                      i === 0
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]"
                        : "border-[var(--border-strong)] bg-[var(--bg-surface)]"
                    }`}
                    aria-hidden="true"
                  >
                    {i === 0 ? <Check className="size-3 text-white" strokeWidth={3} /> : null}
                  </span>
                  <p className="font-display text-sm font-extrabold text-[var(--fg-primary)]">{p.name}</p>
                  <p className="mt-0.5 text-[13px] text-[var(--fg-secondary)]">
                    {p.weeks} · {p.detail}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded-[var(--radius-sm)] bg-[#eef2ff] px-3 py-2 text-[13px] font-semibold text-[#4338ca]">
              6 weeks at 3 h/week · reviews on D0, D1, D3, D7, D14, D30
            </p>
          </div>
        ) : null}

        {tab === "notes" ? (
          <div role="tabpanel" id="panel-notes" aria-labelledby="tab-notes" className="fade-in">
            <p className="font-display text-[15px] font-extrabold text-[var(--fg-primary)]">
              Why this chapter exists
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--fg-secondary)]">
              Light is where Class 10 physics stops naming things and starts predicting them. Four ideas
              carry the whole chapter: straight-line travel, predictable reflection, predictable
              refraction, and the shape of the surface deciding where the image lands.
            </p>
            <div className="mt-3 rounded-[var(--radius-md)] border border-[#c7d2fe] bg-[#eef2ff] p-3">
              <p className="text-[12px] font-bold uppercase tracking-wide text-[#4338ca]">Definition</p>
              <p className="mt-1 text-[13px] text-[#312e81]">
                <strong>Principal focus</strong> — the point on the axis where rays parallel to it
                converge after reflection.
              </p>
            </div>
            <div className="mt-3 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)]">
              <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-subtle)] px-3 py-1.5">
                <span className="font-mono text-[11px] font-semibold text-[var(--fg-secondary)]">
                  mermaid · image-position-flow
                </span>
                <span className="text-[11px] font-bold text-[var(--fg-muted)]">diagram</span>
              </div>
              <div className="p-3 font-mono text-[11.5px] leading-relaxed text-[var(--fg-secondary)]">
                Object beyond C <span className="text-[var(--brand-primary)]">→</span> real, inverted,
                diminished
                <br />
                Between C and F <span className="text-[var(--brand-primary)]">→</span> real, inverted,
                enlarged
                <br />
                Inside F <span className="text-[var(--brand-primary)]">→</span> virtual, erect, enlarged
              </div>
            </div>
            <p className="mt-3 text-[12px] text-[var(--fg-muted)]">
              14 required sections · 3+ citations · 3+ worked examples
            </p>
          </div>
        ) : null}

        {tab === "resources" ? (
          <div role="tabpanel" id="panel-resources" aria-labelledby="tab-resources" className="fade-in space-y-3">
            {[
              {
                rank: 1,
                name: "NCERT",
                meta: "PDF · Free · English",
                why: "The official board text — your syllabus is defined by it.",
                score: "9.6",
              },
              {
                rank: 2,
                name: "Khan Academy",
                meta: "Course · Free · English",
                why: "Best for ray-diagram intuition before you touch the formula.",
                score: "9.4",
              },
            ].map((r) => (
              <div
                key={r.name}
                className="rounded-[var(--radius-md)] border border-[var(--border-default)] p-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] font-display text-[13px] font-extrabold text-white">
                    {r.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-extrabold text-[var(--fg-primary)]">{r.name}</p>
                    <p className="text-[12px] text-[var(--fg-muted)]">{r.meta}</p>
                    <p className="mt-1 text-[13px] leading-snug text-[var(--fg-secondary)]">{r.why}</p>
                    <p className="mt-1.5 text-[11px] font-bold text-[#047857]">
                      Quality {r.score}/10 · verified
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p className="flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)]">
              <ExternalLink className="size-3" aria-hidden="true" />
              Allowlist only — no affiliate links, no sponsorship.
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[var(--border-default)] px-4 py-3">
        <span className="text-[12px] text-[var(--fg-muted)]">A real preview — no sign-up needed</span>
        <Link
          href="/demo/light-reflection-refraction"
          className="text-[13px] font-bold text-[var(--brand-primary)] underline decoration-2 underline-offset-2"
        >
          Open full chapter →
        </Link>
      </div>
    </div>
  );
}
