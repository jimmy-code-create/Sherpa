"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";

/**
 * Demo-mode plan switch. With payment keys unset (see SETUP.md) this flips the
 * plan locally so the paywall copy can be exercised end-to-end without a live
 * charge. With Razorpay/Stripe configured, /api/profile plan changes route
 * through the real checkout — the button copy stays honest either way.
 */
export function PlanSwitcher({ current }: { current: "free" | "pro" }) {
  const [plan, setPlan] = React.useState(current);
  const [state, setState] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function switchTo(next: "free" | "pro") {
    setState("saving");
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: next }),
      });
      if (!res.ok) {
        setError("Couldn't change plan. Try again.");
        setState("error");
        return;
      }
      setPlan(next);
      setState("saved");
      window.setTimeout(() => setState("idle"), 2500);
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setState("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {plan === "free" ? (
        <Button onClick={() => void switchTo("pro")} loading={state === "saving"}>
          Upgrade to Pro
        </Button>
      ) : (
        <Button variant="secondary" onClick={() => void switchTo("free")} loading={state === "saving"}>
          Downgrade to Free
        </Button>
      )}
      {state === "saved" ? (
        <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#047857]" aria-live="polite">
          <Check className="size-4" aria-hidden="true" /> Plan updated
        </span>
      ) : null}
      {state === "saving" ? (
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--fg-secondary)]">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Saving…
        </span>
      ) : null}
      {error ? (
        <p role="alert" className="text-[13px] font-semibold text-[#b91c1c]">
          {error}
        </p>
      ) : null}
      <p className="w-full text-[12px] text-[var(--fg-muted)]">
        Demo mode: no live payment is processed in this build. Production checkout wires Razorpay (IN) / Stripe
        (global) — see SETUP.md.
      </p>
    </div>
  );
}
