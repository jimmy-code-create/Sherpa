"use client";

import * as React from "react";
import Link from "next/link";
import { AuthShell, FieldError } from "@/components/auth-shell";
import { Button } from "@/components/ui";

export function ForgotForm() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [devCode, setDevCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await res.json()) as { error?: string; devCode?: string };
      if (!res.ok) {
        setError(body.error ?? "Enter a valid email address");
        setPending(false);
        return;
      }
      setDevCode(body.devCode ?? null);
      setSent(true);
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="If an account exists for that address, we've sent a reset code. It expires in 15 minutes."
      >
        <div className="space-y-4">
          {devCode ? (
            <div className="rounded-[var(--radius-md)] border border-[#c7d2fe] bg-[#eef2ff] p-3 text-[13px] text-[#312e81]">
              <strong>Demo mode:</strong> no mailer is configured, so your reset code is{" "}
              <span className="font-mono font-bold">{devCode}</span>.
            </div>
          ) : null}
          <Link
            href={`/auth/reset-password?email=${encodeURIComponent(email)}${devCode ? `&code=${devCode}` : ""}`}
            className="btn btn-primary btn-block"
          >
            Enter reset code →
          </Link>
          <p className="text-center text-[13px] text-[var(--fg-muted)]">
            Didn&apos;t arrive? Check spam, or{" "}
            <button type="button" onClick={() => setSent(false)} className="font-semibold text-[var(--brand-primary)] underline">
              try another email
            </button>
            .
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send a code to set a new password."
      footer={
        <p className="text-center text-[14px] text-[var(--fg-secondary)]">
          Remembered it?{" "}
          <Link href="/auth/sign-in" className="font-bold text-[var(--brand-primary)] underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            required
          />
        </div>
        <FieldError message={error ?? undefined} />
        <Button type="submit" block loading={pending}>
          Send reset code
        </Button>
      </form>
    </AuthShell>
  );
}
