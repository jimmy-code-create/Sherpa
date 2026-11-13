"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. Every chapter gives you a roadmap, quick and standard notes, vetted resources and practice questions at no cost. Pro adds deep-dive notes, PYQs and unlimited generation. No credit card is needed to start.",
  },
  {
    q: "Which countries and boards do you support?",
    a: "India (CBSE, ICSE, state boards, JEE), the US (Common Core, AP), the UK (GCSE, A-Level) and IB. Eight countries are selectable today; more are added as chapters are authored, because a curriculum without real chapters is just a dropdown.",
  },
  {
    q: "How are the notes generated?",
    a: "From Sherpa's own authored chapter knowledge, composed to the depth you pick and validated against a strict schema before anything renders. Claims link to a curated allowlist of sources — never scraped textbook text.",
  },
  {
    q: "Are the institute recommendations sponsored?",
    a: "No. Ranking is by curriculum fit, language, cost, editorial quality and freshness. Providers cannot pay for placement, and any commercial relationship (for example a free-with-paid-tier platform) is disclosed on the card.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. After you open a chapter, its notes, roadmap and resources are cached so you can reload and read with no network. The last five chapters you viewed stay available; the app shows a banner while you're offline.",
  },
  {
    q: "Can I use it for competitive exams like JEE, NEET, SAT or GRE?",
    a: "JEE Main and AP are first-class curricula today. NEET, SAT and GRE reuse the same chapter structures, so their content lands as those pathways are authored. You can always study any chapter directly from the subject explorer.",
  },
  {
    q: "How is my data protected?",
    a: "Row-level security in the database, server-side API keys, and no third-party tracking before you consent. You can export everything as JSON and Markdown, and request deletion — accounts are hard-deleted within 30 days.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes, from Settings → Billing, with no retention flow. You keep read access to everything until the end of the paid period, and your notes remain exportable afterwards.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div className="divide-y divide-[var(--border-default)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
      {FAQS.map((item) => {
        const isOpen = open === item.q;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${encodeURIComponent(item.q)}`}
                onClick={() => setOpen(isOpen ? null : item.q)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-[15.5px] font-extrabold text-[var(--fg-primary)] hover:bg-[var(--bg-subtle)]"
              >
                {item.q}
                <ChevronDown
                  className={`size-5 shrink-0 text-[var(--fg-muted)] transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`faq-${encodeURIComponent(item.q)}`}
              hidden={!isOpen}
              className="px-5 pb-4 text-[15px] leading-relaxed text-[var(--fg-secondary)]"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
