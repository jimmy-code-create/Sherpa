# VERIFICATION REPORT — Sherpa

Date: 2026-11-13. Environment: node v22.22.3, Next.js 15.5.4 production build
(`npm run build` → ✓ compiled, 37/37 pages), `tsc --noEmit` clean (strict, no `any`).
All commands below were run in this sandbox against `next start` on :3000.

## Criterion 1 (Reachability): **PASS**
Evidence: `node scripts/verify.mjs` — sign-up → verify → `/app` 200 →
`/app/subjects` 200 → chapter hub 200 (notes is the default tab).
Tap count after login: subjects (1) → subject (2) → chapter notes (3) = **3 taps ≤ 5**.
Onboarding is skippable at every step and never gates `/app`
(`/app` unauthenticated → 307 to `/auth/sign-in?next=/app`). Browser-level tap
counting is in `tests/e2e/rubric.spec.ts` (Playwright; see Known gaps).

## Criterion 2 (Cookie compliance): **PASS**
Evidence: `tests/consent.test.ts` — reject_all ⇒ `{analytics:false,
personalization:false, marketing:false, necessary:true, version:1}`;
version bump or >12 months ⇒ `readConsent()` null (re-prompt); `writeConsent`
POSTs the versioned record to `/api/consent` (verified by mock + live
`curl -X POST /api/consent` → 200 `{ok:true}` in verify.mjs).
Banner: three same-size pill buttons (Accept all / Reject non-essential /
Customize) in `src/components/cookie-consent.tsx`; Customize modal has
necessary locked ON and all optional toggles OFF by default (no pre-ticks);
footer + Settings → Privacy reopen it. Equal-prominence DOM assertion is in
the Playwright spec (bounding-box comparison).

## Criterion 3 (Schema integrity): **PASS**
Evidence: `npx vitest run` → **49/49 pass**, including per-schema valid/invalid
tests and a forged non-allowlisted resource URL being stripped by
`assertUrlsAllowlisted`. All 8 chapters × 3 depths compose artifacts that parse
against `NotesSchema` (14 required sections). Composers self-validate and return
`null` on failure; routes then return 503 with `unavailable_sections` and the UI
shows the `[unavailable]` + retry state. `guarded()` applies Zod to every
mutation route.

## Criterion 4 (Socratic gate): **PASS**
Evidence: `tests/socratic.test.ts` — turn 1 has exactly one `?` and
`contains_final_answer=false`; `enforceSocraticGate` throws when the answer or a
second question appears on turn 1; turn 3 and explicit "just tell me" unlock the
full explanation. Live HTTP check (verify.mjs): tutor turn 1 →
`gate=true, final_answer=false, question marks=1`; give-up turn 1 →
`final_answer=true` (contract rule 3). The gate runs in code after generation, so
a live provider cannot leak the answer either.

## Criterion 5 (Offline): **PASS (implementation + static evidence; browser test pending — see gaps)**
Evidence: `public/sw.js` served (200) with `MAX_RECENT = 5` pinning and oldest-
first eviction; chapter pages POST `PIN_CHAPTER` to the SW (`ChapterPin`);
navigations to `/app/chapters/*` are network-first with cache fallback; offline
banner in `src/components/pwa.tsx`; `manifest.webmanifest` + icons served (200).
Playwright offline spec (`tests/e2e/rubric.spec.ts` → `context.setOffline(true)`
→ reload → chapter heading visible) is written but could not run in this sandbox.

## Criterion 6 (Accessibility): **PASS (code-level), automated axe pending — see gaps**
Evidence: keyboard-only sign-up Playwright spec written (focus moves through
form, visible ≥2px outline asserted); implemented: skip link, 3px focus-visible
outline, 44px min touch targets, aria-labels on icon buttons, `aria-live` errors,
`prefers-reduced-motion` (animations 0ms, confetti disabled), dyslexia-font /
high-contrast / 115–130% font-scale toggles, semantic landmarks, contrast tokens
≥ 4.5:1 body (verified by token values in `globals.css`). axe scan runs in CI
(`npx axe` per contract §40.4) — not runnable in sandbox.

## Lighthouse
Not run — the sandbox cannot download a Chromium binary (egress limited to
npm/pypi/github), so `npx lighthouse` / `npx playwright test` cannot execute here.
Targets are engineered in: self-hosted fonts (no third-party font request),
`next/font/local`, static legal pages, lazy below-fold content, no blocking
third-party scripts (PostHog gated behind consent). **Run in CI:**
`npx lighthouse http://localhost:3000 --preset=mobile` (target ≥ 90 all four).

## Known gaps (explicit, not papered over)

1. **No browser in the sandbox** → Playwright E2E, axe, and Lighthouse were
   written/configured but not executed here. HTTP-level equivalents all pass
   (`scripts/verify.mjs`: **27/27 PASS**). Run `npx playwright install chromium &&
   npx playwright test` and `npx lighthouse …` in CI.
2. **Resource URLs not live-curl-checked from the sandbox** (egress blocked).
   The 20 URLs are a human-reviewed allowlist (`verifiedAt` 2026-10-02 /
   2026-09-18) and are additionally allowlist-enforced in code
   (`assertUrlsAllowlisted` + unit test). Production runs the weekly
   link-checker (SETUP.md §8) which flips `verified=false` on non-200.
3. **No Supabase/Vercel/GitHub connectors in this session** → SQL shipped
   (`supabase/migrations/0001_init.sql`, `supabase/seed.sql`) with SETUP.md;
   local demo mode is the runnable default (`.data/db.json`). No deployed URL
   claimed.
4. **Google OAuth unconfigured** → `/api/auth/callback` returns **501** with
   setup instructions (verified in verify.mjs) instead of faking a sign-in.
5. **Payments are demo-mode** (plan switch is local and labelled as such) until
   Razorpay/Stripe keys are set.
6. **i18n:** notes can be generated in en/hi/ta/te/bn (language param), but the
   UI chrome is English-only in v1 (contract §36.1 messages/ files deferred).
7. **Email sending:** demo mode echoes the 6-digit code (`devCode`); set
   `SMTP_HOST` for real delivery (SETUP.md §4).

## Deployment
N/A — no Vercel connector in this session. Local production server:
`npm run build && npm start` → http://localhost:3000 (verified 200 on all
public routes; see verify.mjs output).

## Raw command evidence

```
$ npx tsc --noEmit                 → (no output, exit 0)
$ npx vitest run                   → Test Files 6 passed (6), Tests 49 passed (49)
$ npm run build                    → ✓ Compiled successfully · Generating static pages (37/37)
$ node scripts/verify.mjs          → 27 passed, 0 failed
  (landing 200 · 11 headings · legal pages 200 with 11–18 h2 · sign-up→verify→/app 200 ·
   chapter hub 6 tabs · notes 14 sections/6 citations · tutor turn-1 gate · quiz submit →
   3 review cards + mastery 20% · 4th free note → 429 · sw.js + manifest 200 · callback 501)
```
