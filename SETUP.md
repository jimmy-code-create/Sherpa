# Sherpa — SETUP.md (production wiring)

Everything runs with zero config in **Local Demo Mode**. This file wires the
real services. All commands assume the repo root.

## 1. Supabase (database + auth)

1. Create a project at https://supabase.com, then either:
   - `npx supabase link --project-ref <ref>` + `npx supabase db push`, or
   - paste `supabase/migrations/0001_init.sql` into the SQL editor, then
     `supabase/seed.sql`.
2. Enable **Email** provider (and **Google** if you want OAuth) under
   Authentication → Providers. For Google, add `http://localhost:3000/auth/callback`
   (and your production URL) to the OAuth client's redirect URIs.
3. Copy the project URL + anon key + service role key into `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server-only, never shipped to the client
SHERPA_SESSION_SECRET=<32+ random chars>
SHERPA_ADMIN_EMAIL=you@yourdomain.com   # first account with this email is admin
```

`src/lib/store.ts` exposes `useSupabase()` — when the two Supabase env vars
are set, the whole app database (users, profiles, progress, sessions, …) is
persisted to the `sherpa_kv` table via the PostgREST API with the service-role
key (service role bypasses RLS). Every request re-reads the row and every
mutation awaits the upsert, so it is safe on multi-instance serverless
(Vercel): sign-up on one invocation is visible to the next. Without the env
vars it falls back to the local `.data/db.json` file (Local Demo Mode).
The typed tables in `0001_init.sql` remain the source of truth for the
relational schema; RLS policies there restrict every user table to
`auth.uid()`.

## 2. AI provider

Default `AI_PROVIDER=local` needs no key: notes/roadmap/quiz/tutor/resources
are composed deterministically from `src/lib/curriculum/content.ts` and
validated with Zod (`src/lib/ai/validate.ts`). To use a live model:

```bash
AI_PROVIDER=openai        # | anthropic | gemini
OPENAI_API_KEY=sk-...
```

`src/lib/ai/provider.ts` is the only place that talks to a vendor; the 5 prompt
contracts live in `src/lib/ai/prompts/{roadmap,notes,resources,tutor,quiz}.md`.
Every provider response still goes through `generateWithValidation`:
Zod parse → retry once → cache fallback → `[unavailable]` section. Never render
raw model JSON.

## 3. Cache + rate limits (Upstash Redis)

```bash
UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...
```

Without these, `src/lib/cache.ts` and `src/lib/ai/ratelimit.ts` fall back to
in-memory (single-instance) implementations with the same contract:
notes 3/day free, 10/day pro; roadmap 1 + 3 regens/day; quiz 10/day;
tutor 12/10min; cache TTL 30 days, key = chapter + depth + language.

## 4. Email (verification codes, resets)

```bash
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM="Sherpa <no-reply@sherpa.study>"
```

With `SMTP_HOST` unset, codes are returned as `devCode` in API responses and
shown in the UI — demo mode only.

## 5. Google OAuth

Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (or the Supabase Google
provider) — until then `/auth/callback` honestly returns **501** with setup
instructions instead of faking a sign-in. `ALLOW_DEMO_OAUTH=true` mints a demo
session from the button for local testing only.

## 6. Payments (Razorpay India + Stripe global)

```bash
RAZORPAY_KEY_ID=... RAZORPAY_SECRET=...
STRIPE_SECRET_KEY=... STRIPE_WEBHOOK_SECRET=...
```

Without keys, Settings → Billing switches plans locally and says so in the UI.
Paywall rules (Section 39): free tier = 3 notes/day, 1 roadmap, quick+standard
depths, 5 questions/day, last 3 chapters offline. Pro = ₹199/mo or $4.99/mo.

## 7. Analytics / monitoring

```bash
NEXT_PUBLIC_POSTHOG_KEY=... NEXT_PUBLIC_POSTHOG_HOST=...
SENTRY_DSN=...
```

PostHog must only load **after** analytics consent (the cookie banner gates
this — see `src/components/cookie-consent.tsx`).

## 8. Weekly resource link-checker (Inngest or cron)

```bash
INNGEST_EVENT_KEY=... INNGEST_SIGNING_KEY=...
```

Job: `GET -I` every URL in `resources` where `verified = true`; on non-200 set
`verified = false` so `resources_public_read` RLS stops serving it and the
curator marks it pending. URLs are also allowlist-enforced in code
(`assertUrlsAllowlisted`), so a 404 or delisted URL can never render.

## 9. Verify

```bash
npm run typecheck
npm test                          # unit: schemas, Socratic gate, consent, SM-2, rate limits
npm run build && npm start &
node scripts/verify.mjs           # 27 HTTP checks (landing, legal, auth E2E, AI, PWA)
npx playwright install chromium && npx playwright test   # browser E2E incl. offline + keyboard
npx lighthouse http://localhost:3000 --preset=mobile --view   # target ≥ 90 all categories
```
