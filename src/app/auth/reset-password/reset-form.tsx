"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthShell, FieldError } from "@/components/auth-shell";
import { Button } from "@/components/ui";
import { passwordStrength } from "@/lib/password";

export function ResetForm({ initialEmail, initialCode }: { initialEmail: string; initialCode: string }) {
  const router = useRouter();
  const [email, setEmail] = React.useState(initialEmail);
  const [code, setCode] = React.useState(initialCode);
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const strength = passwordStrength(password);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    if (strength.problems.length > 0) {
      setError(strength.problems[0]!);
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Couldn't reset your password. Try again.");
        setPending(false);
        return;
      }
      router.push(`/auth/sign-in?email=${encodeURIComponent(email)}`);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setPending(false);
    }
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose something you haven't used before.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="code" className="field-label">
            Reset code
          </label>
          <input
            id="code"
            className="input font-mono"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">
            New password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="reset-hint"
            required
          />
          <p id="reset-hint" className="mt-1.5 text-[12.5px] text-[var(--fg-muted)]">
            {strength.problems.length > 0
              ? strength.problems.join(" · ")
              : `Strength: ${strength.label}`}
          </p>
        </div>
        <div>
          <label htmlFor="confirm" className="field-label">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            className="input"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <FieldError message={error ?? undefined} />

        <Button type="submit" block loading={pending}>
          Set new password
        </Button>
      </form>
    </AuthShell>
  );
}
