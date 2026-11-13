import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { STEPS, type StepSlug } from "@/lib/onboarding-steps";

export const dynamic = "force-dynamic";

const VALID = new Set(STEPS.map((s) => s.slug));

export default async function OnboardingStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  if (!VALID.has(step as StepSlug)) notFound();

  const current = await getCurrentUser();
  if (!current) redirect("/auth/sign-in?next=/onboarding/welcome");
  if (step !== "welcome" && current.profile.onboardingComplete) {
    // Already done — don't trap them in the wizard.
    redirect("/app");
  }

  return <OnboardingWizard step={step as StepSlug} profile={current.profile} />;
}
