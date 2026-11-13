"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthShell, FieldError } from "@/components/auth-shell";
import { Button } from "@/components/ui";

export function VerifyForm({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = React.useState(initialEmail);
  const [digits, setDigits] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setInterval(() => setResendIn((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(t);
  }, [resendIn]);

  function setDigit(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < 5) refs.current[index + 1]?.focus();
  }

  function onPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    event.preventDefault();
    const next = text.split("");
    setDigits(Array.from({ length: 6 }, (_, i) => next[i] ?? ""));
    refs.current[Math.min(text.length, 5)]?.focus();
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: digits.join("") }),
      });
      const body = (await res.json()) as { error?: string; next?: string };
      if (!res.ok) {
        setError(body.error ?? "That code doesn't match. Try again.");
        setDigits(["", "", "", "", "", ""]);
        refs.current[0]?.focus();
        setPending(false);
        return;
      }
      router.push(body.next ?? "/onboarding/welcome");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setPending(false);
    }
  }

  async function resend() {
    await fetch("/api/auth/sign-up", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setResendIn(30);
  }

  const code = digits.join("");

  return (
    <AuthShell title="Check your inbox" subtitle="Enter the 6-digit code we sent you. It expires in 10 minutes.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email-verify" className="field-label">
            Email
          </label>
          <input
            id="email-verify"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <fieldset>
          <legend className="field-label">6-digit code</legend>
          <div className="flex gap-2">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                aria-label={`Digit ${i + 1} of 6`}
                className="input w-full text-center font-mono text-xl"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(e) => setDigit(i, e.target.value)}
                onPaste={onPaste}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digit && i > 0) refs.current[i - 1]?.focus();
                }}
              />
            ))}
          </div>
        </fieldset>

        <FieldError message={error ?? undefined} />

        <Button type="submit" block loading={pending} disabled={code.length !== 6}>
          Verify and continue →
        </Button>

        <button
          type="button"
          onClick={resend}
          disabled={resendIn > 0}
          className="min-h-11 w-full text-[13.5px] font-semibold text-[var(--brand-primary)] underline disabled:text-[var(--fg-muted)] disabled:no-underline"
        >
          {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
        </button>
      </form>
    </AuthShell>
  );
}
