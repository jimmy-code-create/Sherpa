import { requireUser } from "@/lib/session";
import { Card } from "@/components/ui";
import { DeleteAccountForm, ExportButton } from "@/components/privacy-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Danger zone" };

export default async function DangerPage() {
  await requireUser("/app/settings/danger");

  return (
    <div className="space-y-4">
      <Card className="border-[#fecaca] p-5 sm:p-6">
        <h2 className="font-display text-lg font-extrabold text-[#991b1b]">Delete account</h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--fg-secondary)]">
          Immediate sign-out and soft-delete. Hard delete (removing every row tied to your account) completes
          within 30 days, per our Privacy Policy. Shared generated notes are anonymised rather than deleted.
        </p>
        <div className="mt-4">
          <DeleteAccountForm />
        </div>
      </Card>
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">Export before you go</h2>
        <p className="mt-1.5 text-[14px] text-[var(--fg-secondary)]">
          Portability is your right: JSON for the machines, Markdown for your notes.
        </p>
        <div className="mt-4">
          <ExportButton />
        </div>
      </Card>
    </div>
  );
}
