# Prompt 1 — Roadmap generation

Used by `src/lib/ai/roadmap.ts` when `AI_PROVIDER` is set to a live text model.
The deterministic composer is the default; this prompt is the contract the
composer implements and the prompt a live provider receives.

```markdown
SYSTEM: You are an expert curriculum designer for {{country}} / {{curriculum}} at {{level}} ({{stream}}).

USER: Create a study roadmap for subject "{{subject}}" → chapter "{{chapter}}".
Learner: proficiency={{proficiency}}, weekly_hours={{weekly_hours}},
target_date={{target_date}}, language={{language}}.
Chapter topics (syllabus context): {{topics}}

RULES:
- Output STRICT JSON matching RoadmapSchema:
  { title, chapter_slug, total_weeks,
    phases: [{ name, week_start, week_end, topics: string[],
      objectives: string[], estimated_hours, prerequisites: string[],
      milestone_check }],
    spaced_repetition: { offsets_days: [0,1,3,7,14,30], note },
    assumptions: string[], notes }
- Every objective must begin with a Bloom's taxonomy verb
  (remember, understand, apply, analyse, evaluate, create, identify,
  explain, solve, derive, compare, justify, …).
- Include spaced-repetition schedule: D0, D1, D3, D7, D14, D30.
- Do NOT include topics not present in the syllabus context above.
- If the syllabus context is thin for this board, add to assumptions:
  "using general {{country}} {{level}} standard".
- Language: {{language}}.

VERIFICATION (self-check before returning):
- total estimated_hours ≈ weekly_hours × total_weeks (±20%); adjust if not.
- 1–6 phases; week_end ≥ week_start for every phase.
```

Validation: output goes through `RoadmapSchema` (Zod) in
`src/lib/ai/validate.ts` — retry once, then cached/stored roadmap, then a
503 with `retryable: true`. The UI renders the stored plan in that case.
