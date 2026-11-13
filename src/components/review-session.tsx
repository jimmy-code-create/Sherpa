"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { Button, Card, EmptyState, ProgressBar } from "@/components/ui";

interface DueCard {
  id: string;
  chapterSlug: string;
  front: string;
  back: string;
  dueAt: string;
  interval: number;
  ease: number;
}

type Rating = "again" | "hard" | "good" | "easy";

const RATINGS: { id: Rating; label: string; tone: string }[] = [
  { id: "again", label: "Again", tone: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]" },
  { id: "hard", label: "Hard", tone: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]" },
  { id: "good", label: "Good", tone: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]" },
  { id: "easy", label: "Easy", tone: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]" },
];

export function ReviewSession() {
  const [cards, setCards] = React.useState<DueCard[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [done, setDone] = React.useState(0);
  const [recalled, setRecalled] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/review/due");
      const body = (await res.json()) as { due?: DueCard[]; total?: number };
      setCards(body.due ?? []);
      setTotal(body.total ?? 0);
      setIndex(0);
      setDone(0);
      setRecalled(0);
      setFinished((body.due ?? []).length === 0);
    } catch {
      setError("Couldn't load your review queue. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function rate(rating: Rating) {
    const card = cards[index]!;
    if (rating !== "again") setRecalled((r) => r + 1);
    setDone((d) => d + 1);
    try {
      await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, rating }),
      });
    } catch {
      setError("Couldn't save that review — it will be retried.");
    }
    if (index + 1 >= cards.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  if (loading) {
    return (
      <Card className="p-8 text-center text-[14.5px] text-[var(--fg-secondary)]">
        Loading your review queue…
      </Card>
    );
  }

  if (error && cards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p role="alert" className="text-[14.5px] font-semibold text-[#b91c1c]">{error}</p>
        <Button className="mt-4" onClick={() => void load()}>Retry</Button>
      </Card>
    );
  }

  if (finished || cards.length === 0) {
    return (
      <div className="space-y-4">
        {done > 0 ? (
          <Card className="p-6 text-center">
            <CheckCircle2 className="mx-auto size-10 text-[#059669]" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-extrabold text-[var(--fg-primary)]">Session complete</h2>
            <p className="mt-1.5 text-[14.5px] text-[var(--fg-secondary)]">
              Reviewed {done} card{done === 1 ? "" : "s"} · recalled {recalled} ({total ? Math.round((recalled / done) * 100) : 0}%)
            </p>
          </Card>
        ) : null}
        <EmptyState
          icon={<RotateCcw className="size-8" aria-hidden="true" />}
          title="Nothing due right now"
          description="Your next review is scheduled automatically. Ahead of schedule? Run a practice quiz to add more cards."
          action={<Link href="/app/subjects" className="btn btn-primary">Explore a chapter</Link>}
        />
      </div>
    );
  }

  const card = cards[index]!;
  const pct = Math.round((done / cards.length) * 100);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between text-[13.5px] font-bold text-[var(--fg-muted)]">
        <span>
          Card {index + 1} of {cards.length} due today
        </span>
        <span>{pct}% done</span>
      </div>
      <ProgressBar value={pct} label="Review session progress" />
      {error ? (
        <p role="alert" className="rounded-[var(--radius-md)] bg-[#fef2f2] px-3 py-2 text-[13px] font-semibold text-[#b91c1c]">
          {error}
        </p>
      ) : null}

      <Card
        className="min-h-[260px] cursor-pointer select-none p-8 text-center"
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Card back — press to see the front" : "Card front — press to reveal the answer"}
      >
        <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
          {flipped ? "Answer" : "Question"} · {card.chapterSlug.split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ")}
        </p>
        <div className="mt-4 font-display text-[1.35rem] font-extrabold leading-snug text-[var(--fg-primary)]">
          {card.front}
        </div>
        {flipped ? (
          <div className="mt-5 border-t border-[var(--border-default)] pt-4 text-[15px] leading-relaxed text-[var(--fg-secondary)]">
            {card.back}
          </div>
        ) : (
          <p className="mt-6 text-[13px] font-semibold text-[var(--fg-muted)]">Tap / press space to flip</p>
        )}
      </Card>

      {flipped ? (
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="How well did you recall it?">
          {RATINGS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => void rate(r.id)}
              className={`min-h-12 rounded-[var(--radius-md)] border-2 px-2 text-[14px] font-extrabold transition-transform hover:scale-[1.03] ${r.tone}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      ) : (
        <Button block onClick={() => setFlipped(true)}>
          Show answer
        </Button>
      )}
    </div>
  );
}
