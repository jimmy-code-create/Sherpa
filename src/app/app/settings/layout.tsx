import { requireUser } from "@/lib/session";
import { SettingsNav } from "@/components/settings-nav";

export const dynamic = "force-dynamic";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireUser("/app/settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Settings</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          Plan: <strong className="capitalize">{profile.plan}</strong>
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <SettingsNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
