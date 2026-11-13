# SYNTHESIS_NOTE.md — Phase D pick & graft

## Base track

**T1 — integrated Next.js 15 App Router monolith** (see JUDGE_REPORT.md).
Chosen because it is the design a future maintainer can extend most easily:
one validation pipeline, one store interface with two backends, prompts as
files, and the two hardest rubric criteria (offline, Socratic gate) enforced in
code rather than in vendor configuration.

## Grafts taken from the losing alternatives

| Graft | Source | How it was folded in |
|---|---|---|
| pgvector RAG as the production retrieval layer | T2 (Supabase-edge) | `vector` extension enabled in `supabase/migrations/0001_init.sql`; prompt files in `src/lib/ai/prompts/*.md` carry a `{{rag_chunks}}` slot; `lib/ai/provider.ts` is the only vendor touchpoint, and its output still passes `generateWithValidation`. |
| Edge-style separation of concerns | T2 | Route handlers are thin: every mutation goes through the single `guarded()` wrapper (auth → rate limit → Zod → handler) in `src/lib/api.ts`, mirroring edge-function isolation inside the monolith. |
| Hosted-auth ergonomics (one-tap OAuth) | T3 | Google OAuth is a first-class sign-in path with an honest 501 fallback until configured; demo mode flag `ALLOW_DEMO_OAUTH` for local testing. |

## Rejected items

- **Clerk/hosted auth (T3):** rejected — consent versioning and the admin role
  need direct control of the session and consent_log; bundled auth keeps the
  cookie story auditable.
- **Pinecone (T3):** rejected — pgvector ships with Supabase, one less vendor,
  RLS already in place.
- **Pages Router/SPA (T3):** rejected — App Router streaming and RSC are needed
  for streamed notes and a small client bundle (LCP < 2.5 s target).
- **Full Clerk-style onboarding gating:** rejected — every onboarding step is
  skippable (criterion 1).

## Convergence / dropout

No wild divergence between alternatives; the only dropout was T3's offline
story (score 2), which is why a custom service worker (`public/sw.js`) is part
of the base rather than an add-on.

## What remains for Phase E (all completed)

- **E1 auth + cookie + legal:** email sign-up/verify/reset, versioned 3-button
  cookie banner, 5 legal pages. ✅
- **E2 onboarding + hub:** 9-step skippable wizard; chapter hub with 6
  URL-synced tabs, notes as default. ✅
- **E3 AI pipelines:** 5 composers + 5 prompt files, Zod validation with
  retry/cache fallback, per-route rate limits (free 3 notes/day, pro 10/day). ✅
- **E4 progress + PWA:** mastery = quiz 50% + notes 25% + reviews 25%;
  SM-2 queue fed by quiz misses; SW pins last 5 chapters. ✅
