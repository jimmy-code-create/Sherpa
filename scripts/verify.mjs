#!/usr/bin/env node
/**
 * Sherpa verification script — run against a running server:
 *
 *   npm run build && npm start &        # http://localhost:3000
 *   node scripts/verify.mjs             # BASE_URL=http://localhost:3000 to override
 *
 * Exercises the 15 claims from DONE.md that are checkable over HTTP and
 * prints PASS/FAIL per claim. Exits non-zero if any claim fails.
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

let passed = 0;
let failed = 0;

function check(name, ok, detail = "") {
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
}

async function get(path, cookie) {
  const res = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    headers: cookie ? { Cookie: cookie } : {},
  });
  return { status: res.status, headers: res.headers, text: await res.text() };
}

async function post(path, body, cookie) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(body),
  });
  const setCookie = res.headers.get("set-cookie");
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }
  return { status: res.status, json, setCookie };
}

function cookieOf(setCookie) {
  return setCookie ? setCookie.split(";")[0] : null;
}

const results = [];

// ── 1–2. Landing page ──────────────────────────────────────────────────
const landing = await get("/");
check("1. GET / returns 200", landing.status === 200);
const h1h2 = (landing.text.match(/<h[12][\s>]/g) ?? []).length;
check("2. Landing has ≥ 8 sections (h1/h2)", h1h2 >= 8, `${h1h2} headings`);
check("2b. Landing shows repeated CTA", (landing.text.match(/Start learning free/g) ?? []).length >= 2);

// ── 4–6. Cookie banner markup + consent API ───────────────────────────
const signUpPage = await get("/auth/sign-up");
check("4. Sign-up page 200", signUpPage.status === 200);
const consent = await post("/api/consent", {
  version: 1,
  timestamp: new Date().toISOString(),
  necessary: true,
  analytics: false,
  personalization: false,
  marketing: false,
  method: "reject_all",
});
check("5/6. Reject-all consent POST is accepted", consent.status === 200 && consent.json?.ok === true);

// ── 6b. Legal pages ────────────────────────────────────────────────────
for (const p of ["/legal/privacy", "/legal/terms", "/legal/cookies", "/legal/acceptable-use", "/legal/dpa"]) {
  const r = await get(p);
  const sections = (r.text.match(/<h2/g) ?? []).length;
  check(`6. ${p} 200 with ≥ 10 sections`, r.status === 200 && sections >= 10, `${sections} h2`);
}

// ── 3/7. Sign-up → verify → dashboard → chapter (E2E over HTTP) ────────
const email = `verify-${Date.now()}@example.com`;
const password = "studyhard1";
const su = await post("/api/auth/sign-up", { email, password });
check("3. Sign-up returns verification code (demo mode)", su.status === 200 && Boolean(su.json?.devCode));
const cookie = cookieOf(su.setCookie);
const verify = await post("/api/auth/verify", { email, code: su.json?.devCode }, cookie);
check("3. Verify email creates session", verify.status === 200 && verify.json?.ok === true);
const sessionCookie = cookie || cookieOf(verify.setCookie);

const app = await get("/app", sessionCookie);
check("3. GET /app with session → 200", app.status === 200);
const unauth = await get("/app");
check("11. /app redirects to sign-in when unauthenticated", unauth.status === 307 && (unauth.headers.get("location") ?? "").includes("/auth/sign-in"));

const subjects = await get("/app/subjects", sessionCookie);
check("7. Subject explorer 200 authed", subjects.status === 200);
const chapter = await get("/app/chapters/light-reflection-refraction?tab=notes", sessionCookie);
check("7/8. Chapter hub (notes tab default) 200 authed", chapter.status === 200);
check("8. Hub renders all 6 tabs", ["Roadmap", "Notes", "Institutes", "Tutor", "Practice", "Progress"].every((t) => chapter.text.includes(t)));

// ── 9. Notes validate against schema (spot-check via API shape) ──────
const notes = await post("/api/ai/notes", { chapterSlug: "light-reflection-refraction", depth: "standard" }, sessionCookie);
const n = notes.json?.notes;
const requiredSections = ["big_picture", "prerequisites", "glossary", "core_concepts", "derivations", "worked_examples", "diagrams", "analogies", "common_mistakes", "exam_patterns", "mnemonics", "self_check", "citations", "related_chapters"];
check(
  "9. Notes response carries all 14 required sections",
  notes.status === 200 && requiredSections.every((k) => k in (n ?? {})),
  n ? `${n.citations.length} citations, ${n.worked_examples.length} examples` : "no notes",
);

// ── 10. Socratic gate over HTTP ────────────────────────────────────────
const t1 = await post("/api/ai/tutor", { chapterSlug: "light-reflection-refraction", message: "what is the mirror formula?" }, sessionCookie);
const c1 = t1.json?.content ?? "";
check(
  "10. Tutor turn 1: gate applied, exactly one question, no final answer",
  t1.status === 200 && t1.json?.socratic_gate_applied === true && t1.json?.contains_final_answer === false && (c1.match(/\?/g) ?? []).length === 1,
);

// ── 11. Quiz → review queue ────────────────────────────────────────────
const quiz = await post("/api/ai/quiz", { chapterSlug: "light-reflection-refraction", count: 5, difficulty: "mixed" }, sessionCookie);
const answers = Object.fromEntries(
  (quiz.json?.questions ?? []).map((q, i) => [q.id, i % 2 === 0 ? "deliberately wrong" : q.correct_answer]),
);
const submit = await post("/api/quiz/submit", { chapterSlug: "light-reflection-refraction", quiz: quiz.json, answers }, sessionCookie);
check(
  "11. Quiz submit auto-grades and feeds review queue",
  submit.status === 200 && submit.json?.reviewCardsAdded > 0 && Array.isArray(submit.json?.weakTopics),
  `score ${submit.json?.score}/${submit.json?.total}, ${submit.json?.reviewCardsAdded} cards, mastery ${submit.json?.mastery?.current}%`,
);
const due = await get("/api/review/due", sessionCookie);
const dueBody = JSON.parse(due.text);
check("11b. Review queue lists due cards", due.status === 200 && (dueBody.due?.length ?? 0) > 0, `${dueBody.due?.length ?? 0} due`);

// ── Rate limit (E3 gate: 4th free note in 24h → 429) ──────────────────
let codes = [];
for (let i = 0; i < 4; i++) {
  const r = await post("/api/ai/notes", { chapterSlug: "electricity", depth: "quick", refresh: true }, sessionCookie);
  codes.push(r.status);
}
check("E3. 4th free-tier note in 24h returns 429", codes[3] === 429, codes.join(","));

// ── 12/13. PWA assets ──────────────────────────────────────────────────
const manifest = await get("/manifest.webmanifest");
const sw = await get("/sw.js");
check("12. manifest.webmanifest served", manifest.status === 200 && manifest.text.includes("Sherpa"));
check("12b. sw.js served with last-5-chapters pinning", sw.status === 200 && sw.text.includes("MAX_RECENT = 5"));

// ── 13. Resource allowlist stays allowlisted over HTTP ────────────────
const resources = await post("/api/ai/resources", { chapterSlug: "light-reflection-refraction" }, sessionCookie);
const urls = (resources.json?.resources ?? []).map((r) => r.url);
const known = ["ncert.nic.in", "khanacademy.org", "openstax.org", "ocw.mit.edu", "nptel.ac.in", "youtube.com", "3blue1brown.com", "swayam.gov.in", "diksha.gov.in", "britannica.com", "desmos.com"];
check(
  "13. Every returned resource URL is from the vetted allowlist domains",
  resources.status === 200 && urls.length > 0 && urls.every((u) => known.some((d) => u.includes(d))),
  urls[0] ?? "none",
);

// ── OAuth callback honesty ─────────────────────────────────────────────
const cb = await get("/api/auth/callback");
check("OAuth callback returns 501 (not faked) when unconfigured", cb.status === 501);

// ── Demo chapter (public) ──────────────────────────────────────────────
const demo = await get("/demo/light-reflection-refraction");
check("Demo chapter readable without auth", demo.status === 200 && demo.text.includes("Big picture"));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
