"use client";

import * as React from "react";
import { CheckCircle2, Circle, Loader2, RefreshCw, CalendarClock } from "lucide-react";
import type { Roadmap } from "@/lib/schemas/roadmap";
import { Badge, Button, Card, EmptyState, ErrorState, SkeletonText } from "@/components/ui";

export function RoadmapTab({ chapterSlug, chapterName, hasRoadmap }: { chapterSlug: string; chapterName: string; hasRoadmap: boolean }) {
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [roadmap, setRoadmap] = React.useState<Roadmap | null>(null);
  const [version, setVersion] = React.useState<number | null>(null);
  const [source, setSource] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [regenerating, setRegenerating] = React.useState(false);

  const load = React.useCallback(
    async (regenerate = false) => {
      if (regenerate) setRegenerating(true);
      setStatus("loading");
      setError(null);
      try {
        const res = await fetch("/api/ai/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterSlug, regenerate }),
        });
        const body = (await res.json()) as { roadmap?: Roadmap; version?: number; source?: string; error?: string; retryAfterSeconds?: number };
        if (!res.ok || !body.roadmap) {
          setStatus("error");
          setError(
            res.status === 429
              ? `Roadmap regeneration is limited to 3 per day. Try again in ${Math.ceil((body.retryAfterSeconds ?? 0) / 60)} minutes.`
              : (body.error ?? "Couldn't generate a roadmap for this chapter."),
          );
          setRegenerating(false);
          return;
        }
        setRoadmap(body.roadmap);
        setVersion(body.version ?? null);
        setSource(body.source ?? "generated");
        setStatus("ready");
        setRegenerating(false);
      } catch {
        setStatus("error");
        setError("Couldn't reach the server. Check your connection and retry.");
        setRegenerating(false);
      }
    },
    [chapterSlug],
  );

  React.useEffect(() => {
    void load(false);
  }, [load]);

  if (status === "loading" && !roadmap) {
    return (
      <Card className="p-6">
        <p className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-[var(--fg-secondary)]">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Designing your phases…
        </p>
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1">
                <SkeletonText lines={3} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (status === "error" && !roadmap) {
    return (
      <ErrorState
        title="Couldn't generate roadmap"
        description={error ?? "Try again."}
        retry={<Button onClick={() => void load(false)}>Retry</Button>}
      />
    );
  }

  if (!roadmap) {
    return (
      <EmptyState
        title="No roadmap yet"
        description="Generate a week-by-week plan sized to your study hours."
        action={<Button onClick={() => void load(false)}>Generate roadmap</Button>}
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-extrabold text-[var(--fg-primary)]">{roadmap.title}</h2>
          {version ? <Badge tone="neutral">v{version}</Badge> : null}
          {source === "stored" ? <Badge tone="info">Saved plan</Badge> : <Badge tone="success">Fresh</Badge>}
          <span className="ml-auto">
            <Button variant="secondary" size="sm" onClick={() => void load(true)} loading={regenerating}>
              <RefreshCw className="size-4" aria-hidden="true" /> Regenerate (3/day)
            </Button>
          </span>
        </div>
        {error ? (
          <p role="alert" className="mb-4 rounded-[var(--radius-md)] bg-[#fef2f2] px-3 py-2 text-[13.5px] font-semibold text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        <ol className="relative space-y-4 border-l-2 border-[var(--border-default)] pl-6">
          {roadmap.phases.map((phase, i) => (
            <li key={i} className="relative">
              <span
                className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full border-2 border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--fg-muted)]"
                aria-hidden="true"
              >
                {i === 0 ? <Circle className="size-3" /> : <CheckCircle2 className="size-3 opacity-0" />}
              </span>
              <Card className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[16px] font-extrabold text-[var(--fg-primary)]">
                    Phase {i + 1} — {phase.name}
                  </h3>
                  <Badge tone="brand">
                    Week {phase.week_start}–{phase.week_end}
                  </Badge>
                  <Badge tone="neutral">{phase.estimated_hours}h</Badge>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">Objectives</p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[14px] text-[var(--fg-secondary)]">
                      {phase.objectives.map((o, j) => (
                        <li key={j}>{o}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">Topics</p>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {phase.topics.map((t) => (
                        <li key={t}><Badge tone="neutral">{t}</Badge></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-3 rounded-[var(--radius-sm)] bg-[#eef2ff] px-3 py-2 text-[13.5px] font-semibold text-[#312e81]">
                  🎯 Milestone: {phase.milestone_check}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </div>

      <aside className="space-y-4">
        <Card className="p-4">
          <p className="flex items-center gap-2 font-display text-[14px] font-extrabold text-[var(--fg-primary)]">
            <CalendarClock className="size-4 text-[var(--brand-primary)]" aria-hidden="true" /> Spaced repetition
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--fg-secondary)]">
            Topics are revisited on{" "}
            {roadmap.spaced_repetition.offsets_days.map((d) => `D${d}`).join(", ")}. Cards land in your review
            queue automatically after practice.
          </p>
        </Card>
        {roadmap.assumptions.length > 0 ? (
          <Card className="p-4">
            <p className="font-display text-[14px] font-extrabold text-[var(--fg-primary)]">Assumptions</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[var(--fg-secondary)]">
              {roadmap.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Card>
        ) : null}
        {roadmap.notes ? (
          <Card className="p-4">
            <p className="text-[13px] leading-relaxed text-[var(--fg-secondary)]">{roadmap.notes}</p>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className ?? ""}`} aria-hidden="true" />;
}
