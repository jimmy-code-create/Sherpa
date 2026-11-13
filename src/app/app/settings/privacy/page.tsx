import Link from "next/link";
import { requireUser } from "@/lib/session";
import { consentStore } from "@/lib/store";
import { Card } from "@/components/ui";
import { CookieSettingsButton } from "@/components/cookie-consent";
import { ExportButton, DeleteAccountForm } from "@/components/privacy-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Privacy & cookies" };

export default async function PrivacySettingsPage() {
  const { user } = await requireUser("/app/settings/privacy");
  const consent = await consentStore.latest(user.id);

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">Cookie settings</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--fg-secondary)]">
          Your choices are stored in this browser (localStorage key{" "}
          <code className="font-mono text-[12.5px]">sda_cookie_consent</code>, version 1) and, when you&apos;re
          signed in, in our consent log. We re-ask only if the consent version changes or after 12 months.
        </p>
        {consent ? (
          <p className="mt-3 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] px-3 py-2 text-[13px] text-[var(--fg-secondary)]">
            Last recorded: method <strong>{consent.method}</strong> · analytics{" "}
            <strong>{consent.analytics ? "on" : "off"}</strong> · personalization{" "}
            <strong>{consent.personalization ? "on" : "off"}</strong> · marketing{" "}
            <strong>{consent.marketing ? "on" : "off"}</strong> · {new Date(consent.createdAt).toLocaleString()}
          </p>
        ) : (
          <p className="mt-3 text-[13px] text-[var(--fg-muted)]">No consent recorded server-side yet.</p>
        )}
        <div className="mt-4">
          <CookieSettingsButton />
        </div>
        <p className="mt-3 text-[13px] text-[var(--fg-secondary)]">
          Full inventory: <Link href="/legal/cookies" className="font-bold text-[var(--brand-primary)] underline">Cookie Policy</Link> ·{" "}
          <Link href="/legal/privacy" className="font-bold text-[var(--brand-primary)] underline">Privacy Policy</Link>
        </p>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">Your data</h2>
        <ul className="mt-3 space-y-2 text-[14px] text-[var(--fg-secondary)]">
          <li>
            <strong>Export:</strong> download everything — profile, progress, quizzes, review cards, roadmaps,
            consent history — as JSON, plus all your notes as Markdown. Delivered instantly here (the contract
            allows 24h; we do it in one click).
          </li>
          <li>
            <strong>Delete:</strong> hard delete within 30 days of request, immediate sign-out. See the{" "}
            <Link href="/app/settings/danger" className="font-bold text-[var(--brand-primary)] underline">Danger Zone</Link>.
          </li>
          <li>
            <strong>Analytics opt-out:</strong> works even if you previously accepted — flip the toggle in Cookie
            settings above.
          </li>
        </ul>
        <div className="mt-4">
          <ExportButton />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">Danger zone</h2>
        <p className="mt-1.5 text-[14px] text-[var(--fg-secondary)]">
          Deleting your account is permanent after the 30-day grace window. You&apos;ll need to type{" "}
          <code className="font-mono font-bold">DELETE</code> and your password.
        </p>
        <div className="mt-4">
          <DeleteAccountForm />
        </div>
      </Card>
    </div>
  );
}
