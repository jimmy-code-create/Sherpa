"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell, FieldError } from "@/components/auth-shell";
import { Button } from "@/components/ui";

export function SignInForm({ next, prefillEmail }: { next?: string; prefillEmail?: string }) {
  const router = useRouter();
  const [email, setEmail] = React.useState(prefillEmail ?? "");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [unverified, setUnverified] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setUnverified(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await res.json()) as {
        error?: string;
        next?: string;
        code?: string;
        verificationCode?: string;
        retryAfterSeconds?: number;
      };
      if (!res.ok) {
        if (body.code === "UNVERIFIED") {
          setUnverified(body.verificationCode ?? "");
        } else {
          setError(body.error ?? "That email and password don't match");
        }
        setPending(false);
        return;
      }
      router.push(next && next.startsWith("/") ? next : (body.next ?? "/app"));
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setPending(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Pick up where you left off."
      footer={
        <p className="text-center text-[14px] text-[var(--fg-secondary)]">
          New here?{" "}
          <Link href="/auth/sign-up" className="font-bold text-[var(--brand-primary)] underline">
            Create an account
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
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="field-label mb-0">
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-[13px] font-semibold text-[var(--brand-primary)] underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="input pr-12"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(error)}
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
        </div>

        <FieldError message={error ?? undefined} />

        {unverified !== null ? (
          <div className="rounded-[var(--radius-md)] border border-[#fde68a] bg-[#fffbeb] p-3 text-[13.5px] text-[#92400e]">
            <p className="font-semibold">Verify your email to continue.</p>
            {unverified ? (
              <p className="mt-1">
                Demo mode code: <span className="font-mono font-bold">{unverified}</span> —{" "}
                <Link href={`/auth/verify?email=${encodeURIComponent(email)}`} className="font-bold underline">
                  enter it here
                </Link>
                .
              </p>
            ) : (
              <Link href={`/auth/verify?email=${encodeURIComponent(email)}`} className="font-bold underline">
                Enter your code →
              </Link>
            )}
          </div>
        ) : null}

        <Button type="submit" block loading={pending}>
          Sign in →
        </Button>

        <p className="text-center text-[13px] text-[var(--fg-muted)]">
          Magic link and Google sign-in are configured in SETUP.md. Email + password works now.
        </p>
      </form>
    </AuthShell>
  );
}
