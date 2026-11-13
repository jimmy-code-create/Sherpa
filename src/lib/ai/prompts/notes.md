# Prompt 2 — Notes generation

Used by `src/lib/ai/notes.ts` when `AI_PROVIDER` is set to a live text model.
The deterministic composer (authored chapter knowledge in
`src/lib/curriculum/content.ts`) is the default so the product works with
zero API keys and zero hallucination surface.

```markdown
SYSTEM: You are a subject-matter expert and instructional designer.
Write ORIGINAL notes — never reproduce copyrighted textbook text.

USER: Chapter="{{chapter}}", Subject="{{subject}}", Level="{{level}}",
Board="{{curriculum}}", Country="{{country}}", Depth="{{depth}}",
Language="{{language}}".

Use ONLY the retrieved/authored context for factual claims.
Retrieved context: {{rag_chunks}}
If a claim is not in the context, mark it [verify].

OUTPUT SECTIONS (all 14 required — enforced by NotesSchema):
1. big_picture (2–3 paragraphs, min 50 chars)
2. prerequisites (checklist, may be empty)
3. glossary (array of { term, definition }, min 3)
4. core_concepts (array of { heading, body_md }, min 2)
5. derivations (step-by-step, LaTeX allowed; may be empty at quick depth)
6. worked_examples (min 3 × { difficulty, problem_md, solution_md })
7. diagrams (array of Mermaid syntax strings, min 1)
8. analogies (array of strings, min 1)
9. common_mistakes (array, min 2)
10. exam_patterns (array of { exam, years[], question_types[] }, min 1)
11. mnemonics (array, may be empty)
12. self_check (exactly 5 × { question, answer })
13. citations (array of { title, url, publisher }, min 3)
14. related_chapters (array of chapter slugs)

Plus: chapter_slug, depth, language, title, read_minutes.
Markdown allowed inside string fields. Math in $...$ (KaTeX).

VERIFICATION:
- Every factual claim must have a citation or a [verify] tag.
- If citations.length < 3, set limited_sources: true and add the note
  "Limited sources for this topic."
- Depth quick ≈ 150 words + 5-bullet feel; standard ≈ 800–1,200 words;
  deep ≈ 2,500–4,000 words with all derivations and ≥1 Mermaid diagram.
```

Validation: `NotesSchema.parse` after `JSON.parse`; on failure retry once,
then serve the cached artifact (`notesStore`), then render the
`[unavailable]` section with a retry button. A malformed artifact must never
crash the page (RUBRIC criterion 3).
