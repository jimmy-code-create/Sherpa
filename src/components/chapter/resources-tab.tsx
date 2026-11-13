"use client";

import * as React from "react";
import { ExternalLink, ShieldCheck, AlertTriangle, GraduationCap } from "lucide-react";
import type { ResourceList } from "@/lib/schemas/resource";
import { Badge, Button, Card, EmptyState, ErrorState, SkeletonText } from "@/components/ui";

const TYPE_LABEL: Record<string, string> = {
  video: "Video",
  course: "Course",
  book: "Book",
  pdf: "PDF",
  practice: "Practice set",
};

export function ResourcesTab({ chapterSlug, chapterName }: { chapterSlug: string; chapterName: string }) {
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [list, setList] = React.useState<ResourceList | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/ai/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterSlug }),
      });
      const body = (await res.json()) as ResourceList & { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(body.error ?? "Couldn't load resources.");
        return;
      }
      setList(body);
      setStatus("ready");
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Check your connection and retry.");
    }
  }, [chapterSlug]);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading") {
    return (
      <Card className="p-6">
        <SkeletonText lines={1} />
        <div className="mt-4 space-y-3">
          <SkeletonText lines={2} />
          <SkeletonText lines={2} />
        </div>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <ErrorState
        title="Couldn't load resources"
        description={error ?? "Try again."}
        retry={<Button onClick={() => void load()}>Retry</Button>}
      />
    );
  }

  if (!list || list.resources.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap className="size-8" aria-hidden="true" />}
        title="We're curating more resources for this chapter"
        description={
          list?.gaps?.[0] ??
          "Only vetted, allowlisted providers are ever shown — nothing here is sponsored placement."
        }
        action={<Button variant="secondary" onClick={() => void load()}>Refresh</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[14px] text-[var(--fg-secondary)]">
        Ranked for <strong>{chapterName}</strong> by curriculum fit, language, cost and editorial quality.
        Every link below is from Sherpa&apos;s vetted allowlist — never scraped, never paid placement.
      </p>
      <ol className="space-y-3">
        {list.resources.map((r, i) => (
          <li key={r.url}>
            <Card className="p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] font-display text-[15px] font-extrabold text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-[16px] font-extrabold text-[var(--fg-primary)]">{r.title}</h3>
                    {r.verified ? (
                      <Badge tone="success" icon={<ShieldCheck className="size-3" aria-hidden="true" />}>
                        Verified
                      </Badge>
                    ) : (
                      <Badge tone="warning" icon={<AlertTriangle className="size-3" aria-hidden="true" />}>
                        Pending re-verification
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] font-semibold text-[var(--fg-muted)]">
                    {r.provider} · {TYPE_LABEL[r.type] ?? r.type} · {r.cost} · {r.language}
                    {r.estimated_time ? ` · ~${r.estimated_time}` : ""}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-secondary)]">{r.why_this_fits}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Open resource <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                    <span className="text-[12.5px] font-bold text-[var(--fg-muted)]">
                      Quality {r.quality_score.toFixed(1)}/10
                    </span>
                    {r.disclosure ? (
                      <span className="text-[12px] font-semibold text-[#b45309]">⚠ {r.disclosure}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>
      {list.gaps && list.gaps.length > 0 ? (
        <p className="rounded-[var(--radius-md)] bg-[#fffbeb] px-4 py-2.5 text-[13px] font-semibold text-[#92400e]">
          {list.gaps.join(" ")} Know a good source? Flag it via “Report issue” on the Notes tab and our curators will vet it.
        </p>
      ) : null}
    </div>
  );
}
