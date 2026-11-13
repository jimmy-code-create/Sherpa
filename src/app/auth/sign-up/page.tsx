import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession, safeNextForPage } from "@/lib/session";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  if (session) redirect(safeNextForPage(params.next));
  return <SignUpForm next={params.next} />;
}
