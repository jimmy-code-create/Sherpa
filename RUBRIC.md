# RUBRIC.md — Sherpa (Phase A)

Scoring scale: 5 = exceeds (verified + edge cases), 4 = meets (verified),
3 = partial, 2 = fails (attempted, no evidence), 1 = absent.

## Criterion 1 — Reachability

**Definition:** A brand-new user can go from login to a chapter's notes in ≤ 5 taps.
**Evidence required:** A manual click-trace or Playwright test that counts interactions.
**Failure mode:** Onboarding forces > 5 taps before showing any chapter.

**Implementation:** notes is the default tab of the chapter hub; the path is
sign-in → `/app` → subject → chapter = 3 taps after login. Onboarding is
skippable at every step and never gates the app.

## Criterion 2 — Cookie compliance

**Definition:** Cookie banner has three equally prominent buttons (Accept All /
Reject All / Customize). No pre-ticked toggles. Consent is versioned and stored
in both localStorage and the server (consent_log). Re-prompt only on version
bump or after 12 months.
**Evidence required:** DOM snapshot showing equal sizing + a test asserting
rejectAll sets all optional categories to false.
**Failure mode:** Accept is colored and Reject is grey; toggles pre-ticked;
consent only in localStorage.

**Implementation:** `src/components/cookie-consent.tsx` — three same-size pill
buttons, customize modal with necessary locked on / others off by default,
`sda_cookie_consent` v1 in localStorage + POST `/api/consent`, 365-day re-prompt.

## Criterion 3 — Schema integrity

**Definition:** Every AI output (Roadmap, Notes, Resources, Quiz, Tutor) validates
against its Zod schema before rendering. On validation failure: retry once, then
fall back to cached or `[unavailable]` section.
**Evidence required:** Unit test per schema; a deliberately broken output must not
crash the UI.
**Failure mode:** `JSON.parse` result rendered directly; empty sections on failure.

**Implementation:** `src/lib/schemas/*` + `src/lib/ai/validate.ts`
(`generateWithValidation`: parse → retry → cache → throw → route returns 503
with `unavailable_sections`). Composers self-validate and return `null` on
failure, which the route maps to the `[unavailable]` state with retry.

## Criterion 4 — Socratic gate

**Definition:** The tutor chat never gives the final answer on turn 1. It asks one
guiding question. After 2 learner attempts OR explicit "just tell me", a full
explanation is permitted.
**Evidence required:** Unit test: `expect(tutorTurn1).not.toContain(correctAnswer)`.
**Failure mode:** Turn 1 includes the answer / multiple questions / full solution.

**Implementation:** `enforceSocraticGate` in `src/lib/ai/tutor.ts` — turn 1 must
contain exactly one `?` and must not contain the answer key; enforced in code
after generation, so even a live provider cannot leak it. Unit-tested in
`tests/socratic.test.ts`; verified over HTTP in `scripts/verify.mjs`.

## Criterion 5 — Offline capability

**Definition:** After viewing a chapter, the user can disconnect the network,
reload, and read the chapter.
**Evidence required:** Service worker log shows cached resources; offline test
asserts the chapter renders.
**Failure mode:** Notes require network; blank page offline; no eviction.

**Implementation:** `public/sw.js` — network-first chapter pages with
cache fallback; the last 5 viewed chapters are pinned (`MAX_RECENT = 5`,
oldest evicted); app shell + static assets cached; offline banner via
`src/components/pwa.tsx`; `/app/chapters/*` POSTs `PIN_CHAPTER` to the SW.

## Criterion 6 — Accessibility

**Definition:** A keyboard-only user completes sign-up → open notes. WCAG 2.2 AA
contrast, focus visible, 44px minimum targets, reduced motion respected.
**Evidence required:** Manual keyboard trace + automated axe scan (0 critical).
**Failure mode:** Focus traps, grey-on-grey contrast, icon-only buttons without labels.

**Implementation:** skip link, `focus-visible` 3px brand outline, all icon buttons
labelled, `aria-live` for errors/toasts, 44px min targets (`.btn` min-height),
`prefers-reduced-motion` media query zeroes animations + confetti, dyslexia-font /
high-contrast / font-scale toggles in Settings → Preferences, semantic landmarks.
