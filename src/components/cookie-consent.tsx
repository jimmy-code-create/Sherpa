"use client";

import * as React from "react";
import Link from "next/link";
import { Cookie, X, ShieldCheck, BarChart3, Sparkles, Megaphone } from "lucide-react";
import { Button } from "./ui";

export const CONSENT_VERSION = 1;
export const CONSENT_KEY = "sda_cookie_consent";
const REPROMPT_AFTER_MS = 365 * 86_400_000;

export interface CookieConsent {
  version: number;
  timestamp: string;
  necessary: true;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  method: "accept_all" | "reject_all" | "custom";
}

export type OptionalCategory = "analytics" | "personalization" | "marketing";

export function makeConsent(
  method: CookieConsent["method"],
  optional: Record<OptionalCategory, boolean>,
): CookieConsent {
  return {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    necessary: true,
    analytics: optional.analytics,
    personalization: optional.personalization,
    marketing: optional.marketing,
    method,
  };
}

export const ALL_OFF: Record<OptionalCategory, boolean> = {
  analytics: false,
  personalization: false,
  marketing: false,
};

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    const age = Date.now() - new Date(parsed.timestamp).getTime();
    if (Number.isNaN(age) || age > REPROMPT_AFTER_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(consent: CookieConsent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    /* ignore */
  }
  void fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(consent),
  }).catch(() => {});
  window.dispatchEvent(new CustomEvent("sherpa:consent", { detail: consent }));
}

const CATEGORIES: {
  key: "necessary" | OptionalCategory;
  label: string;
  description: string;
  icon: React.ReactNode;
  locked: boolean;
}[] = [
  {
    key: "necessary",
    label: "Strictly necessary",
    description: "Sign-in, security and basic app function. These cannot be switched off.",
    icon: <ShieldCheck className="size-4" aria-hidden="true" />,
    locked: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Anonymised usage patterns so we know which chapters confuse people.",
    icon: <BarChart3 className="size-4" aria-hidden="true" />,
    locked: false,
  },
  {
    key: "personalization",
    label: "Personalization",
    description: "Remembers your board, level and recent chapters to rank recommendations.",
    icon: <Sparkles className="size-4" aria-hidden="true" />,
    locked: false,
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Reserved for future updates. Off by default and never sold.",
    icon: <Megaphone className="size-4" aria-hidden="true" />,
    locked: false,
  },
];

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors ${
        checked ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]" : "border-[var(--border-strong)] bg-[var(--bg-subtle)]"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);
  const [showCustomize, setShowCustomize] = React.useState(false);
  const [draft, setDraft] = React.useState<Record<OptionalCategory, boolean>>(ALL_OFF);

  React.useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      // Delay so the hero paints first — never block first contentful paint.
      const timer = window.setTimeout(() => setVisible(true), 2200);
      return () => window.clearTimeout(timer);
    }
    setDraft({
      analytics: existing.analytics,
      personalization: existing.personalization,
      marketing: existing.marketing,
    });
  }, []);

  React.useEffect(() => {
    const reopen = () => {
      const existing = readConsent();
      if (existing) {
        setDraft({
          analytics: existing.analytics,
          personalization: existing.personalization,
          marketing: existing.marketing,
        });
      } else {
        setDraft(ALL_OFF);
      }
      setShowCustomize(true);
      setVisible(true);
    };
    window.addEventListener("sherpa:open-cookie-settings", reopen);
    return () => window.removeEventListener("sherpa:open-cookie-settings", reopen);
  }, []);

  function finish(method: CookieConsent["method"], optional: Record<OptionalCategory, boolean>) {
    writeConsent(makeConsent(method, optional));
    setVisible(false);
    setShowCustomize(false);
  }

  if (!visible) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-description"
        className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-4xl rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-surface)] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 hidden size-9 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[var(--brand-primary)] sm:flex">
            <Cookie className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="cookie-title" className="font-display text-[15px] font-extrabold text-[var(--fg-primary)]">
              We use cookies to improve your learning experience
            </h2>
            <p id="cookie-description" className="mt-1 text-sm leading-relaxed text-[var(--fg-secondary)]">
              Essential cookies run the app. Optional cookies power analytics and personalization, and are
              off unless you turn them on. Change your choices any time in{" "}
              <Link href="/legal/cookies" className="font-semibold text-[var(--brand-primary)] underline">
                our Cookie Policy
              </Link>
              .
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => finish("accept_all", { analytics: true, personalization: true, marketing: true })}
                className="btn btn-primary btn-sm w-full justify-center"
                data-testid="cookie-accept-all"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => finish("reject_all", ALL_OFF)}
                className="btn btn-secondary btn-sm w-full justify-center"
                data-testid="cookie-reject-all"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="btn btn-secondary btn-sm w-full justify-center"
                data-testid="cookie-customize"
                aria-haspopup="dialog"
              >
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCustomize ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customize-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[var(--radius-xl)] bg-[var(--bg-surface)] p-5 shadow-xl sm:rounded-[var(--radius-xl)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="customize-title" className="font-display text-lg font-extrabold">
                  Cookie settings
                </h2>
                <p className="mt-1 text-sm text-[var(--fg-secondary)]">
                  Only essential cookies are on by default. Nothing optional is pre-ticked.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="rounded-full p-2 text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
                aria-label="Close cookie settings"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="mt-4 space-y-3">
              {CATEGORIES.map((cat) => {
                const checked = cat.locked ? true : draft[cat.key as OptionalCategory];
                return (
                  <li
                    key={cat.key}
                    className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] p-3"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-display text-sm font-extrabold text-[var(--fg-primary)]">
                        {cat.icon}
                        {cat.label}
                        {cat.locked ? <span className="text-[11px] font-bold text-[var(--fg-muted)]">(always on)</span> : null}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-[var(--fg-secondary)]">{cat.description}</p>
                    </div>
                    <Toggle
                      label={`${cat.label} cookies`}
                      checked={checked}
                      disabled={cat.locked}
                      onChange={(next) =>
                        setDraft((prev) => ({ ...prev, [cat.key as OptionalCategory]: next }))
                      }
                    />
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => finish("custom", draft)}
                data-testid="cookie-save-preferences"
              >
                Save my choices
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => finish("reject_all", ALL_OFF)}
              >
                Reject non-essential
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-[var(--fg-muted)]">
              You can reopen this at any time from Settings → Privacy.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Settings → Privacy control that reopens the granular modal. */
export function CookieSettingsButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => window.dispatchEvent(new Event("sherpa:open-cookie-settings"))}
    >
      Open cookie settings
    </Button>
  );
}
