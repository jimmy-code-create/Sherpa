import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession, safeNextForPage } from "@/lib/session";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; email?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  if (session) redirect(safeNextForPage(params.next));
  return <SignInForm next={params.next} prefillEmail={params.email} />;
}
