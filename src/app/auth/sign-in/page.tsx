import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, safeNextForPage } from "@/lib/session";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; email?: string }>;
}) {
  const params = await searchParams;
  // Redirect only when the cookie AND the user record both check out.
  // A stale cookie whose user row is gone must render the form — never
  // redirect to /app, or /app redirects back here and the browser dies with
  // ERR_TOO_MANY_REDIRECTS.
  const current = await getCurrentUser();
  if (current) redirect(safeNextForPage(params.next));
  return <SignInForm next={params.next} prefillEmail={params.email} />;
}
