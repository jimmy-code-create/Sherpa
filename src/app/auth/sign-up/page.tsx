import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, safeNextForPage } from "@/lib/session";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  // See sign-in page: only redirect when the user record actually exists,
  // otherwise a stale cookie creates a redirect loop with /app.
  const current = await getCurrentUser();
  if (current) redirect(safeNextForPage(params.next));
  return <SignUpForm next={params.next} />;
}
