"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check } from "lucide-react";
import { AuthShell, FieldError } from "@/components/auth-shell";
import { Button } from "@/components/ui";
import { passwordStrength } from "@/lib/password";

type Step = "credentials" | "verify";

export function SignUpForm({ next }: { next?: string }) {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("credentials");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [devCode, setDevCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);

  const strength = passwordStrength(password);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setInterval(() => setResendIn((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(t);
  }, [resendIn]);

  async function submitCredentials(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (strength.problems.length > 0) {
      setError(strength.problems[0]!);
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await res.json()) as { error?: string; devCode?: string; code?: string };
      if (!res.ok) {
        setError(
          body.code === "EMAIL_TAKEN"
            ? "An account with this email already exists. Sign in?"
            : (body.error ?? "Something went wrong. Try again."),
        );
        setPending(false);
        return;
      }
      setDevCode(body.devCode ?? null);
      if (body.devCode) setCode(body.devCode);
      setStep("verify");
      setResendIn(30);
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
    } finally {
      setPending(false);
    }
  }

  async function submitCode(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const body = (await res.json()) as { error?: string; next?: string };
      if (!res.ok) {
        setError(body.error ?? "That code doesn't match. Try again.");
        setPending(false);
        return;
      }
      const destination = next && next.startsWith("/") ? next : (body.next ?? "/onboarding/welcome");
      router.push(destination);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setPending(false);
    }
  }

  async function resend() {
    setError(null);
    await fetch("/api/auth/sign-up", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setResendIn(30);
  }

  if (step === "verify") {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`We sent a 6-digit code to ${email}. It expires in 10 minutes.`}
      >
        <form onSubmit={submitCode} className="space-y-4" noValidate>
          {devCode ? (
            <div className="rounded-[var(--radius-md)] border border-[#c7d2fe] bg-[#eef2ff] p-3 text-[13px] text-[#312e81]">
              <strong>Demo mode:</strong> this build has no mailer, so your code is{" "}
              <span className="font-mono font-bold">{devCode}</span> (already filled in).
            </div>
          ) : null}
          <div>
            <label htmlFor="code" className="field-label">
              6-digit code
            </label>
            <input
              id="code"
              className="input font-mono text-lg tracking-[0.4em]"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "verify-error" : undefined}
              required
            />
            <div id="verify-error">
              <FieldError message={error ?? undefined} />
            </div>
          </div>
          <Button type="submit" block loading={pending} disabled={code.length !== 6}>
            Verify and continue →
          </Button>
          <div className="flex flex-col gap-2 text-center">
            <button
              type="button"
              onClick={resend}
              disabled={resendIn > 0}
              className="min-h-11 text-[13.5px] font-semibold text-[var(--brand-primary)] underline disabled:text-[var(--fg-muted)] disabled:no-underline"
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="min-h-11 text-[13.5px] font-semibold text-[var(--fg-secondary)] underline"
            >
              Change email
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your free account"
      subtitle="Start with any chapter. No credit card."
      footer={
        <p className="text-center text-[14px] text-[var(--fg-secondary)]">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-bold text-[var(--brand-primary)] underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={submitCredentials} className="space-y-4" noValidate>
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

        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="input pr-12"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="password-hint"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </button>
          </div>
          <div id="password-hint" className="mt-2">
            <div className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    strength.score > i
                      ? strength.score >= 2
                        ? "bg-[#059669]"
                        : "bg-[#f59e0b]"
                      : "bg-[var(--border-default)]"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[12.5px] text-[var(--fg-muted)]" aria-live="polite">
              {password.length === 0
                ? "Use 8+ characters with a letter and a number."
                : strength.problems.length > 0
                  ? strength.problems.join(" · ")
                  : `Strength: ${strength.label}`}
            </p>
          </div>
        </div>

        <FieldError message={error ?? undefined} />

        <Button type="submit" block loading={pending}>
          Create account →
        </Button>

        <div className="relative my-2 text-center">
          <span className="relative z-10 bg-[var(--bg-page)] px-3 text-[12.5px] font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
            or
          </span>
          <span className="absolute left-0 top-1/2 h-px w-full bg-[var(--border-default)]" aria-hidden="true" />
        </div>

        <a
          href="/auth/callback"
          className="btn btn-secondary btn-block"
          onClick={(e) => {
            e.preventDefault();
            setError("Google sign-in needs an OAuth client in this build. Use email — see SETUP.md.");
          }}
        >
          Continue with Google
        </a>

        <p className="text-center text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
          By continuing you agree to our{" "}
          <Link href="/legal/terms" target="_blank" className="font-semibold text-[var(--brand-primary)] underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" target="_blank" className="font-semibold text-[var(--brand-primary)] underline">
            Privacy Policy
          </Link>
          .
        </p>
        <ul className="sr-only">
          <li>
            <Check aria-hidden="true" /> Account creation creates a cookie session only after email
            verification.
          </li>
        </ul>
      </form>
    </AuthShell>
  );
}
