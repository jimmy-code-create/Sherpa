import { requireAdmin } from "@/lib/session";
import { RESOURCE_ALLOWLIST } from "@/lib/curriculum/resources";
import { Badge, Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  await requireAdmin();

  const verified = RESOURCE_ALLOWLIST.filter((r) => r.verified);
  const pending = RESOURCE_ALLOWLIST.filter((r) => !r.verified);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Resource allowlist</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          {RESOURCE_ALLOWLIST.length} curated resources · {verified.length} verified · {pending.length} pending.
          The curator pipeline may only emit URLs from this list; the weekly link-checker (SETUP.md) flags 404s.
        </p>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)] text-[11.5px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">
              <th scope="col" className="px-4 py-3">Provider</th>
              <th scope="col" className="px-4 py-3">Title</th>
              <th scope="col" className="px-4 py-3">Type / cost</th>
              <th scope="col" className="px-4 py-3">Quality</th>
              <th scope="col" className="px-4 py-3">Verified</th>
              <th scope="col" className="px-4 py-3">URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {RESOURCE_ALLOWLIST.map((r) => (
              <tr key={r.url}>
                <td className="px-4 py-3 font-bold text-[var(--fg-primary)]">{r.provider}</td>
                <td className="px-4 py-3 text-[var(--fg-secondary)]">{r.title}</td>
                <td className="px-4 py-3 text-[var(--fg-muted)]">
                  {r.type} · {r.cost}
                </td>
                <td className="px-4 py-3 font-bold tabular-nums">{r.qualityScore.toFixed(1)}</td>
                <td className="px-4 py-3">
                  {r.verified ? (
                    <Badge tone="success">✓ {r.verifiedAt ?? "verified"}</Badge>
                  ) : (
                    <Badge tone="warning">pending</Badge>
                  )}
                </td>
                <td className="max-w-[260px] px-4 py-3">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate font-mono text-[11.5px] text-[var(--brand-primary)] underline"
                  >
                    {r.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
