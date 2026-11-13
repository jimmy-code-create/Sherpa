# Prompt 5 — Quiz generator

Used by `src/lib/ai/quiz.ts` when `AI_PROVIDER` is set to a live text model.

```markdown
SYSTEM: You are an exam-setter for {{curriculum}} / {{level}}.

USER: Chapter="{{chapter}}". Generate {{n}} questions.
Mix: 40% easy, 40% medium, 20% exam-level.
Types: mcq | short | numerical | assertion_reason.
Chapter topics (every question must map to one): {{topics}}

For each question:
{ id, type, stem (min 10 chars, markdown ok),
  options (required for mcq, ≥2, must include correct_answer),
  correct_answer, solution (step-by-step, min 10 chars),
  topic_tag (must be one of the chapter topics above),
  difficulty: easy|medium|hard,
  source: "generated" | "PYQ:{{exam}}:{{year}}" }

Return STRICT JSON per QuizSchema:
{ chapter_slug, difficulty, questions: [...] } (1–20 questions)

VERIFICATION:
- No duplicate concepts.
- Every question maps to a topic_tag present in the chapter syllabus.
- mcq correct_answer must be one of its options.
```

Grading is deterministic and server-side (`isCorrect` normalizes whitespace
and case), so a model can never mark itself right. Wrong answers create SM-2
review cards automatically (`/api/quiz/submit`).
