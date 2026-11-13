# DONE.md — what "done" means for Sherpa

The 15 claims from the build contract, each checkable in this repo.
`scripts/verify.mjs` exercises the HTTP-checkable ones (27 checks).

| # | Claim | How to verify |
|---|-------|----------------|
| 1 | `/` renders a fully sectioned marketing page | `curl -I localhost:3000/` → 200; verify.mjs counts 11 h1/h2 sections |
| 2 | Landing has ≥ 8 sections, repeated CTAs, interactive preview | verify.mjs checks heading count + CTA count; `src/components/marketing/hero-preview.tsx` (3 tabs) |
| 3 | Sign-up → email verify → dashboard works E2E | `node scripts/verify.mjs` (sign-up → verify → `/app` 200); Playwright spec `rubric.spec.ts` |
| 4 | Cookie banner has 3 equally prominent buttons | DOM: `Accept all` / `Reject non-essential` / `Customize` same-size pills; Playwright compares bounding boxes |
| 5 | Reject All sets all optional categories to false | `tests/consent.test.ts` + `scripts/verify.mjs` POST `/api/consent` with reject_all |
| 6 | Legal pages 200 with required sections | verify.mjs: 5 legal pages, 11–18 h2 each |
| 7 | New user reaches a chapter's notes in ≤ 5 taps | Playwright spec counts taps (sign-in → /app → subject → chapter = 3); notes is the default tab |
| 8 | Chapter hub renders all 6 tabs without error | verify.mjs asserts all 6 tab labels in HTML; Playwright opens each `?tab=` |
| 9 | Notes generation validates against Zod | `tests/schemas.test.ts` + `tests/pipelines.test.ts` (all 8 chapters × 3 depths) |
| 10 | Socratic tutor never answers on turn 1 | `tests/socratic.test.ts` (gate throws on leak; exactly one `?`) + HTTP check in verify.mjs |
| 11 | Quiz auto-grades and feeds spaced repetition | verify.mjs: submit → score, weakTopics, `reviewCardsAdded > 0`, `/api/review/due` lists cards |
| 12 | PWA loads last 5 chapters offline | `public/sw.js` pins `MAX_RECENT = 5`; Playwright offline reload spec; verify.mjs checks SW served |
| 13 | Every resource URL returns 200 | **Known gap:** sandbox egress cannot reach the internet — URLs are human-reviewed allowlist entries (see VERIFICATION_REPORT.md); production runs the weekly link-checker (SETUP.md §8) |
| 14 | Lighthouse ≥ 90 mobile, all four categories | **Not run in sandbox** (no browser download) — target config in place; run `npx lighthouse` in CI (see VERIFICATION_REPORT.md) |
| 15 | WCAG 2.2 AA — keyboard-only sign-up → notes | Keyboard Playwright spec + axe scan in CI; a11y features listed in RUBRIC.md criterion 6 |
