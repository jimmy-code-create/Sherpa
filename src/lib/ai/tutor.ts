import { getChapterContent } from "../curriculum/content";
import { resolveChapter } from "../curriculum/catalog";
import { TutorResponseSchema, type TutorResponse } from "../schemas/tutor";

/**
 * Socratic tutor.
 *
 * The gate is structural, not a matter of prompt wording:
 *
 *   turn 1            → exactly one guiding question, no answer, no solution
 *   turn 2            → a second, narrower hint (still no final answer)
 *   turn 3+ OR "just tell me" → full explanation permitted
 *
 * `enforceSocraticGate` re-checks the text before it is returned, so even a
 * future LLM provider cannot leak the answer on turn 1.
 */

export interface TutorInput {
  chapterSlug: string;
  message: string;
  /** Number of assistant turns already delivered. 0 = this is the first reply. */
  priorTurns: number;
  readingLevel?: "10" | "15" | "college";
  /** Topics the learner has recently got wrong, from quiz attempts. */
  mistakeLog?: string[];
}

const GIVE_UP_PATTERN =
  /\b(just\s+(tell|give|show)\s+me|tell\s+me\s+the\s+answer|give\s+me\s+the\s+answer|show\s+me\s+the\s+solution|what'?s\s+the\s+answer|i\s+give\s+up|no\s+idea|i\s+don'?t\s+know)\b/i;

const STOPWORDS = new Set([
  "the","a","an","is","are","was","were","of","to","in","on","for","and","or","but","what","why",
  "how","does","do","did","can","could","would","should","i","me","my","you","your","it","its",
  "this","that","these","those","with","from","about","tell","explain","help","please","not","no",
  "be","been","being","have","has","had","will","if","then","than","so","as","at","by","when","which",
]);

interface TopicMatch {
  term: string;
  definition: string;
  score: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function findTopic(chapterSlug: string, message: string): TopicMatch | null {
  const content = getChapterContent(chapterSlug);
  if (!content) return null;
  const tokens = new Set(tokenize(message));

  const candidates: TopicMatch[] = content.glossary.map((g) => {
    const termTokens = tokenize(g.term);
    const hits = termTokens.filter((t) => tokens.has(t)).length;
    return { term: g.term, definition: g.definition, score: hits * 2 + (message.toLowerCase().includes(g.term.toLowerCase()) ? 4 : 0) };
  });

  for (const concept of content.concepts) {
    const headingTokens = tokenize(concept.heading);
    const hits = headingTokens.filter((t) => tokens.has(t)).length;
    candidates.push({
      term: concept.heading,
      definition: concept.body_md.split(/\n\s*\n/)[0]!.replace(/[*$]/g, "").slice(0, 400),
      score: hits * 2,
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] && candidates[0].score > 0 ? candidates[0]! : null;
}

function pick<T>(items: T[], seed: string): T | undefined {
  if (items.length === 0) return undefined;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return items[h % items.length];
}

const LEVEL_COPY = {
  "10": { open: "Let's keep this simple.", hint: "small step", solution: "Here it is, in plain words" },
  "15": { open: "Good question.", hint: "step", solution: "Here's the full picture" },
  college: { open: "Sure — let's work through it.", hint: "step", solution: "Full derivation" },
} as const;

/** Turn-1 probe: exactly one question, zero answers. */
function probe(match: TopicMatch | null, chapter: string, level: keyof typeof LEVEL_COPY, mistake?: string): string {
  const copy = LEVEL_COPY[level];
  const topic = match?.term ?? chapter;
  const angles = [
    `Before I say anything: in your own words, what do you already think **${topic.toLowerCase()}** means here?`,
    `Try this — is **${topic.toLowerCase()}** about what light *does*, or about the *shape* of the thing it hits? Which one would change the outcome more?`,
    `What would happen to **${topic.toLowerCase()}** if you doubled the distance involved — would the result double, halve, or stay the same? Have a guess.`,
    mistake
      ? `Your last quiz tripped on **${mistake}**. What rule do you remember about it — even a half-remembered version is useful.`
      : `Which piece of **${topic.toLowerCase()}** feels shakiest to you right now: the definition, the formula, or applying it to a problem?`,
  ];
  const question = pick(angles, `${chapter}:${topic}`)!;

  return [
    `${copy.open} I'm not going to hand you the answer yet — one quick question first.`,
    "",
    question,
    "",
    `Reply with whatever you've got and I'll take it from there.`,
  ].join("\n");
}

/** Turn-2 narrower hint: a nudge plus a single check question, still no answer. */
function hint(match: TopicMatch | null, chapter: string, level: keyof typeof LEVEL_COPY): string {
  const copy = LEVEL_COPY[level];
  const topic = match?.term ?? chapter;
  const definition = match?.definition ?? "";
  const keyword = definition.split(/[.;]/)[0]?.trim().slice(0, 110) ?? "the core relationship";

  return [
    `Closer. Here's a ${copy.hint} in the right direction — nothing more yet.`,
    "",
    `Think about **${topic.toLowerCase()}** in terms of *${keyword.toLowerCase()}*. Don't substitute numbers yet; first decide which quantity is fixed and which one you're changing.`,
    "",
    `If you're still stuck: which of these two is the **opposite** of what you expect — the direction, or the size?`,
  ].join("\n");
}

/** Turn-3 / explicit give-up: full explanation, permitted by the contract. */
function fullAnswer(
  match: TopicMatch | null,
  chapterSlug: string,
  level: keyof typeof LEVEL_COPY,
  reason: "attempts" | "explicit",
): string {
  const content = getChapterContent(chapterSlug);
  const copy = LEVEL_COPY[level];
  const topic = match?.term ?? "the key idea";
  const definition = match?.definition ?? "";
  const worked = content?.examples[0];

  const lines = [
    reason === "explicit"
      ? `${copy.solution}, since you asked directly.`
      : `You've had two goes at it — here's the full explanation.`,
    "",
    `**${topic}** — ${definition}`,
  ];

  if (worked) {
    lines.push("", `Worked through with the first example from your notes:`, "", worked.problem_md, "", worked.solution_md);
  }
  if (content?.mistakes.length) {
    lines.push("", `**Where people slip:** ${content.mistakes[0]}`);
  }
  lines.push(
    "",
    `Next action: open **Practice**, run a 5-question set on this chapter, and send me anything you get wrong.`,
  );

  return lines.join("\n");
}

function endsWithQuestionOrAction(text: string): boolean {
  const tail = text.trim().slice(-400);
  return tail.includes("?") || /next action:/i.test(tail) || /open \*\*practice\*\*/i.test(tail);
}

/**
 * Guard: on turn 1 the answer must not appear and there must be exactly one
 * question mark. Throws if a caller violates the contract.
 */
export function enforceSocraticGate(
  text: string,
  isFirstTurn: boolean,
  answerKey: string | null,
): void {
  if (!isFirstTurn) return;
  if (answerKey && answerKey.length > 8 && text.toLowerCase().includes(answerKey.toLowerCase().slice(0, 40))) {
    throw new Error("Socratic gate violated: turn 1 contains the final answer");
  }
  const questionCount = (text.match(/\?/g) ?? []).length;
  if (questionCount !== 1) {
    throw new Error(`Socratic gate violated: turn 1 must ask exactly one question (found ${questionCount})`);
  }
  if (/next action:/i.test(text) && !/\?/.test(text)) {
    throw new Error("Socratic gate violated: turn 1 gave an action without a guiding question");
  }
}

export function respondSocratically(input: TutorInput): TutorResponse {
  const level = input.readingLevel ?? "15";
  const resolved = resolveChapter(input.chapterSlug);
  const chapterName = resolved?.chapter.name ?? "this chapter";

  const match = findTopic(input.chapterSlug, input.message);
  const explicit = GIVE_UP_PATTERN.test(input.message);
  const isFirstTurn = input.priorTurns === 0;

  let content: string;
  let gateApplied = false;

  if (explicit) {
    content = fullAnswer(match, input.chapterSlug, level, "explicit");
  } else if (input.priorTurns >= 2) {
    content = fullAnswer(match, input.chapterSlug, level, "attempts");
  } else if (isFirstTurn) {
    gateApplied = true;
    content = probe(match, chapterName, level, input.mistakeLog?.[0]);
  } else {
    gateApplied = true;
    content = hint(match, chapterName, level);
  }

  // The gate applies to turn 1 *unless* the learner explicitly asked for the
  // answer ("just tell me") — contract rule 3 permits the full explanation
  // on request, even on turn 1.
  if (isFirstTurn && !explicit) {
    enforceSocraticGate(content, true, match?.definition ?? null);
  }

  if (!endsWithQuestionOrAction(content)) {
    content += "\n\nWhat's your best guess so far?";
  }

  const parsed = TutorResponseSchema.safeParse({
    content,
    turn_number: input.priorTurns + 1,
    contains_final_answer: !gateApplied,
    socratic_gate_applied: gateApplied,
    suggested_next_action: gateApplied
      ? "Answer the tutor's question in your own words"
      : "Open Practice and run a 5-question set",
  });

  if (!parsed.success) {
    return {
      content:
        "I couldn't put that together properly. Try rephrasing your question — or open the Notes tab and tell me which section confused you.",
      turn_number: input.priorTurns + 1,
      contains_final_answer: false,
      socratic_gate_applied: true,
      suggested_next_action: "Rephrase your question",
    };
  }
  return parsed.data;
}
