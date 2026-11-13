import type { Metadata } from "next";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Set a new password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; code?: string }>;
}) {
  const params = await searchParams;
  return <ResetForm initialEmail={params.email ?? ""} initialCode={params.code ?? ""} />;
}
