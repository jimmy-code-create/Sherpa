import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import {
  users,
  profiles,
  progress,
  quizStore,
  reviewStore,
  notesStore,
  tutorStore,
  consentStore,
  reportStore,
} from "@/lib/store";
import { Card, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [
    allUsers,
    allProfiles,
    allProgress,
    allQuizzes,
    allCards,
    allNotes,
    allTutor,
    allConsents,
    allReports,
  ] = await Promise.all([
    users.all(),
    profiles.all(),
    progress.all(),
    quizStore.all(),
    reviewStore.all(),
    notesStore.all(),
    tutorStore.all(),
    consentStore.all(),
    reportStore.all(),
  ]);

  const openReports = allReports.filter((r) => r.status === "open").length;
  const verifiedUsers = allUsers.filter((u) => u.emailVerified).length;
  const onboarded = allProfiles.filter((p) => p.onboardingComplete).length;
  const mastered = allProgress.filter((p) => p.status === "mastered").length;
  const dueCards = allCards.filter((c) => new Date(c.dueAt).getTime() <= Date.now()).length;
  const acceptAll = allConsents.filter((c) => c.method === "accept_all").length;
  const rejectAll = allConsents.filter((c) => c.method === "reject_all").length;

  const stats = [
    { label: "Users", value: allUsers.length, detail: `${verifiedUsers} verified` },
    { label: "Onboarded", value: onboarded, detail: `of ${allProfiles.length} profiles` },
    { label: "Chapter progress rows", value: allProgress.length, detail: `${mastered} mastered` },
    { label: "Quiz attempts", value: allQuizzes.length, detail: "all time" },
    { label: "Review cards", value: allCards.length, detail: `${dueCards} due now` },
    { label: "Notes generated", value: allNotes.length, detail: "cached 30d" },
    { label: "Tutor messages", value: allTutor.length, detail: "all time" },
    { label: "Consent records", value: allConsents.length, detail: `${acceptAll} accept-all · ${rejectAll} reject-all` },
    { label: "Content reports", value: allReports.length, detail: `${openReports} open` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Admin overview</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          Local demo store. In production these numbers come from Supabase with RLS (see SETUP.md).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">{s.label}</p>
            <p className="mt-1 font-display text-[1.8rem] font-extrabold leading-none text-[var(--fg-primary)]">
              {s.value}
            </p>
            <p className="mt-1 text-[12px] text-[var(--fg-muted)]">{s.detail}</p>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/resources" className="btn btn-secondary btn-sm">
          Manage resource allowlist
        </Link>
        <Link href="/admin/reports" className="btn btn-secondary btn-sm">
          Review reports {openReports > 0 ? <Badge tone="danger">{openReports}</Badge> : null}
        </Link>
      </div>
    </div>
  );
}
