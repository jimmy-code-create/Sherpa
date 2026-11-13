import { beforeEach, describe, expect, it, vi } from "vitest";

// Minimal browser stubs before importing the consent module.
const store = new Map<string, string>();
vi.stubGlobal("window", {
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
  dispatchEvent: () => true,
});
vi.stubGlobal("CustomEvent", class CustomEvent<T> {
  type: string;
  detail: T;
  constructor(type: string, init?: { detail?: T }) {
    this.type = type;
    this.detail = init?.detail as T;
  }
});
vi.stubGlobal("Event", class Event {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
});
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

import {
  ALL_OFF,
  CONSENT_KEY,
  CONSENT_VERSION,
  makeConsent,
  readConsent,
  writeConsent,
} from "@/components/cookie-consent";

describe("Cookie consent (rubric criterion 2)", () => {
  beforeEach(() => store.clear());

  it("Reject All sets every optional category to false", () => {
    const consent = makeConsent("reject_all", ALL_OFF);
    expect(consent.analytics).toBe(false);
    expect(consent.personalization).toBe(false);
    expect(consent.marketing).toBe(false);
    expect(consent.necessary).toBe(true); // strictly necessary is always on
    expect(consent.method).toBe("reject_all");
    expect(consent.version).toBe(CONSENT_VERSION);
  });

  it("Accept All sets every optional category to true", () => {
    const consent = makeConsent("accept_all", {
      analytics: true,
      personalization: true,
      marketing: true,
    });
    expect(consent.analytics && consent.personalization && consent.marketing).toBe(true);
  });

  it("consent round-trips through localStorage with version", () => {
    const consent = makeConsent("custom", { analytics: true, personalization: false, marketing: false });
    writeConsent(consent);
    const raw = store.get(CONSENT_KEY);
    expect(raw).toBeTruthy();
    const read = readConsent();
    expect(read).toEqual(consent);
    expect(read?.version).toBe(CONSENT_VERSION);
  });

  it("a bumped consent version invalidates the stored consent (re-prompt)", () => {
    writeConsent(makeConsent("accept_all", { analytics: true, personalization: true, marketing: true }));
    store.set(CONSENT_KEY, JSON.stringify({ ...JSON.parse(store.get(CONSENT_KEY)!), version: CONSENT_VERSION + 1 }));
    expect(readConsent()).toBeNull();
  });

  it("consent older than 12 months invalidates (re-prompt)", () => {
    const old = makeConsent("accept_all", { analytics: true, personalization: true, marketing: true });
    store.set(
      CONSENT_KEY,
      JSON.stringify({ ...old, timestamp: new Date(Date.now() - 366 * 86_400_000).toISOString() }),
    );
    expect(readConsent()).toBeNull();
  });

  it("writeConsent POSTs the versioned record to /api/consent", () => {
    writeConsent(makeConsent("reject_all", ALL_OFF));
    expect(fetch).toHaveBeenCalledWith(
      "/api/consent",
      expect.objectContaining({ method: "POST" }),
    );
    const calls = vi.mocked(fetch).mock.calls;
    const body = JSON.parse((calls[calls.length - 1]![1] as RequestInit).body as string);
    expect(body.method).toBe("reject_all");
    expect(body.analytics).toBe(false);
    expect(body.version).toBe(CONSENT_VERSION);
  });
});
