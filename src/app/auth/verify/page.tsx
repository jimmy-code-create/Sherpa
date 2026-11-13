import type { Metadata } from "next";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  return <VerifyForm initialEmail={params.email ?? ""} />;
}
