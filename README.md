# Sherpa — a curriculum-aware AI study tutor

Pick your country → board → level → subject → chapter, and get a roadmap that
fits your week, original multi-depth notes, vetted institute recommendations, a
Socratic tutor that asks before it answers, adaptive quizzes, and spaced
repetition — as a Next.js 15 app with a Supabase backend.

## Quick start (zero config, Local Demo Mode)

```bash
npm install
npm run dev        # http://localhost:3000
```

No env vars needed. Auth works with email + a 6-digit code that is shown on
screen (demo mode has no mailer), progress persists to `.data/db.json`, and all
"AI" output is composed deterministically from authored curriculum content and
validated against Zod schemas before it renders.

```bash
npm run build && npm start     # production build on :3000
npm test                       # 49 Vitest unit tests (schemas, Socratic gate, consent, SM-2, rate limits)
node scripts/verify.mjs        # 27 HTTP checks against a running server (BASE_URL=... to override)
```

## What's inside

```
src/
  app/                  Next.js 15 App Router pages
    /                   marketing landing (11 sections, interactive 3-tab preview)
    /pricing /about /subjects /demo/[chapterSlug]
    /legal/*            privacy, terms, cookies, acceptable use, DPA
    /auth/*             sign-up (2-step), sign-in, verify, forgot/reset, callback
    /onboarding/[step]  9 steps, every one skippable
    /app                dashboard, subjects, chapter hub (6 URL-synced tabs), review, search, progress, settings
    /admin              overview, resource allowlist, content reports (role-gated)
    /api/*              auth, consent, AI pipelines, quiz/review/progress, profile, report, account
  components/           ui kit, cookie banner, theme provider, PWA, sidebar, command palette, chapter tabs…
  lib/
    schemas/            Zod contracts: notes, roadmap, quiz, resource, tutor
    curriculum/         taxonomy (8 countries/7 boards/9 levels), 7 subjects, 8 chapters, authored content, 20-URL allowlist
    ai/                 provider abstraction, deterministic composers, validate+retry+cache, rate limiter, prompts/*.md (5)
    store.ts            dual backend: Supabase Postgres or local .data/db.json
    auth.ts session.ts  scrypt password hashing, HMAC-signed 30-day session cookie
    srs.ts mastery.ts   SM-2, mastery = quiz 50% + notes 25% + reviews 25%
supabase/
  migrations/0001_init.sql   full schema + RLS policies
  seed.sql                   taxonomy + 20 allowlisted resources
tests/                Vitest unit tests + Playwright E2E specs (tests/e2e)
scripts/verify.mjs    HTTP verification of the DONE.md claims
public/               manifest.webmanifest, sw.js (last-5-chapters offline), icons
```

## The 6 rubric criteria (see RUBRIC.md / VERIFICATION_REPORT.md)

1. **Reachability** — sign-in → `/app` → subject → chapter; notes is the default tab (≤ 3 taps after login).
2. **Cookie compliance** — banner with 3 equally prominent buttons, no pre-ticks; consent versioned in localStorage (`sda_cookie_consent`) + `/api/consent` log; re-prompt on version bump or after 12 months.
3. **Schema integrity** — every AI artifact passes its Zod schema before render; retry once → cache → `[unavailable]` section.
4. **Socratic gate** — tutor turn 1 = exactly one guiding question, enforced in code (`enforceSocraticGate`) and unit-tested.
5. **Offline** — service worker pins the last 5 viewed chapters; app shell cached; offline banner.
6. **Accessibility** — WCAG 2.2 AA targets: focus-visible outlines, 44px targets, aria labels, skip link, reduced-motion respected, dyslexia-font/high-contrast toggles.

## Switching to production services

See **SETUP.md**: Supabase (run the migration + seed, set 3 env vars), a real
AI provider (`AI_PROVIDER=openai|anthropic|gemini` + key — the 5 prompt files in
`src/lib/ai/prompts/` are the contract), Upstash Redis for rate limits/cache,
SMTP for real verification emails, Google OAuth, Razorpay/Stripe checkout,
PostHog/Sentry, and the weekly resource link-checker.

## Local Demo Mode vs production

| Feature | Demo mode (default) | Production |
|---|---|---|
| Database | `.data/db.json` | Supabase Postgres + RLS |
| Auth | email + on-screen 6-digit code | email OTP via SMTP + Google OAuth |
| AI output | deterministic composers (Zod-valid by construction) | live model via `lib/ai/provider.ts` + same Zod validation |
| Cache / rate limits | in-memory | Upstash Redis |
| Payments | plan switch is local only | Razorpay/Stripe checkout |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `npm start` | production build / server |
| `npm run typecheck` | `tsc --noEmit` (strict, no `any`) |
| `npm test` | Vitest unit suite |
| `node scripts/verify.mjs` | HTTP verification of the DONE.md claims |
| `npx playwright test` | browser E2E (needs `npx playwright install chromium`) |

## License

MIT — see legal pages in-app for the terms that govern use of the product.
