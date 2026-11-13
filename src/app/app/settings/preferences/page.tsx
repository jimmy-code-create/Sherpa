import { requireUser } from "@/lib/session";
import { PreferencesForm } from "@/components/settings-forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Preferences" };

export default async function PreferencesPage() {
  const { profile } = await requireUser("/app/settings/preferences");
  return <PreferencesForm profile={profile} />;
}
