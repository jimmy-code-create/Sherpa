"use client";

import * as React from "react";
import type { ReportRecord } from "@/lib/store";

const NEXT: Record<ReportRecord["status"], { label: string; value: ReportRecord["status"] }[]> = {
  open: [
    { label: "Mark in review", value: "in_review" },
    { label: "Dismiss", value: "dismissed" },
  ],
  in_review: [
    { label: "Resolve", value: "resolved" },
    { label: "Dismiss", value: "dismissed" },
  ],
  resolved: [{ label: "Reopen", value: "open" }],
  dismissed: [{ label: "Reopen", value: "open" }],
};

export function ReportActions({ id, status }: { id: string; status: ReportRecord["status"] }) {
  const [current, setCurrent] = React.useState(status);
  const [pending, setPending] = React.useState(false);

  async function update(next: ReportRecord["status"]) {
    setPending(true);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (res.ok) setCurrent(next);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex gap-1.5">
      {NEXT[current].map((a) => (
        <button
          key={a.value}
          type="button"
          onClick={() => void update(a.value)}
          disabled={pending}
          className="min-h-9 rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-3 text-[12.5px] font-bold text-[var(--fg-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
