import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Sign-in callback" };

export default function CallbackPage() {
  return (
    <AuthShell
      title="Google sign-in isn't configured yet"
      subtitle="This build runs with email + password. Wiring Google takes two environment variables."
    >
      <div className="rounded-[var(--radius-md)] border border-[#fde68a] bg-[#fffbeb] p-4">
        <p className="flex items-center gap-2 font-display text-[14px] font-extrabold text-[#92400e]">
          <AlertTriangle className="size-4" aria-hidden="true" />
          What&apos;s missing
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#92400e]">
          Set <code className="font-mono">GOOGLE_CLIENT_ID</code> and{" "}
          <code className="font-mono">GOOGLE_CLIENT_SECRET</code>, enable the Google provider in Supabase
          Auth, and add <code className="font-mono">/auth/callback</code> as a redirect URI. Full steps are in{" "}
          <strong>SETUP.md → Authentication</strong>.
        </p>
      </div>
      <Link href="/auth/sign-in" className="btn btn-primary btn-block mt-5">
        Use email instead →
      </Link>
    </AuthShell>
  );
}
