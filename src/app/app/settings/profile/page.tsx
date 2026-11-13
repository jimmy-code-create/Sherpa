import { requireUser } from "@/lib/session";
import { ProfileForm } from "@/components/settings-forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile settings" };

export default async function ProfileSettingsPage() {
  const { user, profile } = await requireUser("/app/settings/profile");
  return <ProfileForm profile={profile} email={user.email} />;
}
