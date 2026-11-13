import { requireAdmin } from "@/lib/session";
import { reportStore } from "@/lib/store";
import { Badge, Card, EmptyState } from "@/components/ui";
import { ReportActions } from "@/components/report-actions";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  await requireAdmin();
  const reports = await reportStore.all();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Content reports</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          User flags from the Notes tab “Report issue” button. Open → in review → resolved / dismissed.
        </p>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="When learners flag generated content, it lands here with the chapter, section and reason."
        />
      ) : (
        <Card className="divide-y divide-[var(--border-default)] p-0">
          {reports.map((r) => (
            <div key={r.id} className="flex flex-wrap items-start gap-3 px-4 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-display text-[14.5px] font-extrabold text-[var(--fg-primary)]">
                  {r.chapterSlug} · {r.section}
                </p>
                <p className="mt-0.5 text-[13px] text-[var(--fg-secondary)]">
                  reason: <strong>{r.reason}</strong> {r.detail ? `— ${r.detail}` : ""} ·{" "}
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
              <Badge
                tone={
                  r.status === "open" ? "danger" : r.status === "in_review" ? "warning" : r.status === "resolved" ? "success" : "neutral"
                }
              >
                {r.status.replace("_", " ")}
              </Badge>
              <ReportActions id={r.id} status={r.status} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
