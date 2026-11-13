"use client";

import * as React from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import type { Quiz, Question } from "@/lib/schemas/quiz";
import { Markdown } from "@/components/markdown";
import { Badge, Button, Card, EmptyState, ProgressBar } from "@/components/ui";

type Phase = "config" | "quiz" | "results";

interface Results {
  score: number;
  total: number;
  scorePct: number;
  weakTopics: string[];
  missed: { question: string; correctAnswer: string; topic: string }[];
  mastery: { previous: number; current: number; delta: number };
  reviewCardsAdded: number;
}

export function PracticeTab({ chapterSlug, chapterName }: { chapterSlug: string; chapterName: string }) {
  const [phase, setPhase] = React.useState<Phase>("config");
  const [count, setCount] = React.useState(5);
  const [difficulty, setDifficulty] = React.useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [quiz, setQuiz] = React.useState<Quiz | null>(null);
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [current, setCurrent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [results, setResults] = React.useState<Results | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterSlug, count, difficulty }),
      });
      const body = (await res.json()) as Quiz & { error?: string };
      if (!res.ok || !body.questions) {
        setError(body.error ?? "Couldn't build a quiz. Try again.");
        setLoading(false);
        return;
      }
      setQuiz(body);
      setAnswers({});
      setIndex(0);
      setCurrent("");
      setPhase("quiz");
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  function answerCurrent() {
    if (!quiz) return;
    const q = quiz.questions[index]!;
    setAnswers((prev) => ({ ...prev, [q.id]: current }));
  }

  function next() {
    answerCurrent();
    if (!quiz) return;
    if (index + 1 >= quiz.questions.length) {
      void submit();
    } else {
      setIndex((i) => i + 1);
      setCurrent(answers[quiz.questions[index + 1]!.id] ?? "");
    }
  }

  async function submit() {
    if (!quiz) return;
    const finalAnswers = { ...answers, [quiz.questions[index]!.id]: current };
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterSlug, quiz, answers: finalAnswers }),
      });
      const body = (await res.json()) as Results & { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Couldn't grade the quiz. Try again.");
        setSubmitting(false);
        return;
      }
      setResults(body);
      setPhase("results");
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setPhase("config");
    setQuiz(null);
    setResults(null);
    setAnswers({});
    setIndex(0);
    setCurrent("");
    setError(null);
  }

  if (phase === "config") {
    return (
      <Card className="mx-auto max-w-xl p-6">
        <h2 className="font-display text-xl font-extrabold text-[var(--fg-primary)]">Practice — {chapterName}</h2>
        <p className="mt-1.5 text-[14px] text-[var(--fg-secondary)]">
          Auto-graded questions with step-by-step solutions. Every wrong answer lands in your spaced-repetition
          queue automatically.
        </p>
        {error ? (
          <p role="alert" className="mt-4 rounded-[var(--radius-md)] bg-[#fef2f2] px-3 py-2 text-[13.5px] font-semibold text-[#b91c1c]">
            {error}
          </p>
        ) : null}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="field-label">Questions</legend>
            <div className="flex gap-1.5">
              {[5, 10, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={count === n}
                  onClick={() => setCount(n)}
                  className="chip"
                  data-selected={count === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="field-label">Difficulty</legend>
            <div className="flex flex-wrap gap-1.5">
              {(["easy", "medium", "hard", "mixed"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={difficulty === d}
                  onClick={() => setDifficulty(d)}
                  className="chip capitalize"
                  data-selected={difficulty === d}
                >
                  {d}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <Button block className="mt-6" onClick={() => void start()} loading={loading}>
          Start quiz <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </Card>
    );
  }

  if (phase === "results" && results) {
    const passed = results.scorePct >= 70;
    return (
      <Card className="mx-auto max-w-2xl p-6">
        <div className="flex items-center gap-3">
          <Trophy className={`size-8 ${passed ? "text-[#059669]" : "text-[#f59e0b]"}`} aria-hidden="true" />
          <div>
            <h2 className="font-display text-2xl font-extrabold text-[var(--fg-primary)]">
              {results.score}/{results.total} ({results.scorePct}%)
            </h2>
            <p className="text-[13.5px] font-semibold text-[var(--fg-secondary)]">
              Mastery {results.mastery.previous}% → <strong>{results.mastery.current}%</strong>
              {results.mastery.delta !== 0 ? ` (${results.mastery.delta > 0 ? "+" : ""}${results.mastery.delta})` : ""}
            </p>
          </div>
        </div>

        {results.weakTopics.length > 0 ? (
          <div className="mt-5">
            <p className="text-[13px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">Weak topics</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {results.weakTopics.map((t) => (
                <Badge key={t} tone="danger">{t}</Badge>
              ))}
            </div>
            <p className="mt-2 text-[13.5px] text-[var(--fg-secondary)]">
              {results.reviewCardsAdded} review card{results.reviewCardsAdded === 1 ? "" : "s"} added to your queue.
            </p>
          </div>
        ) : (
          <p className="mt-5 flex items-center gap-2 rounded-[var(--radius-md)] bg-[#ecfdf5] px-3 py-2.5 text-[14px] font-semibold text-[#047857]">
            <CheckCircle2 className="size-4" aria-hidden="true" /> No weak topics — clean sheet.
          </p>
        )}

        {results.missed.length > 0 ? (
          <div className="mt-5 space-y-3">
            <p className="text-[13px] font-extrabold uppercase tracking-wide text-[var(--fg-muted)]">Review mistakes</p>
            {results.missed.map((m, i) => (
              <details key={i} className="rounded-[var(--radius-md)] border border-[var(--border-default)] p-3.5">
                <summary className="flex cursor-pointer items-center gap-2 text-[14px] font-bold text-[var(--fg-primary)]">
                  <XCircle className="size-4 shrink-0 text-[#dc2626]" aria-hidden="true" />
                  <span className="line-clamp-2">{m.question}</span>
                </summary>
                <div className="mt-2.5 pl-6">
                  <Badge tone="warning">{m.topic}</Badge>
                  <div className="mt-2 text-[14px]">
                    <Markdown source={`**Correct answer:** ${m.correctAnswer}`} />
                  </div>
                </div>
              </details>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={restart}>
            <RotateCcw className="size-4" aria-hidden="true" /> New quiz
          </Button>
          <a href="/app/review" className="btn btn-secondary">
            Review queue →
          </a>
          <a href={`/app/chapters/${chapterSlug}?tab=notes`} className="btn btn-ghost">
            Back to notes
          </a>
        </div>
      </Card>
    );
  }

  // quiz phase
  const q: Question | undefined = quiz?.questions[index];
  if (!quiz || !q) {
    return (
      <EmptyState
        title="Something went wrong"
        description="The quiz didn't load properly."
        action={<Button onClick={restart}>Start over</Button>}
      />
    );
  }

  return (
    <Card className="mx-auto max-w-2xl p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between text-[13px] font-bold text-[var(--fg-muted)]">
          <span>
            Question {index + 1} of {quiz.questions.length}
          </span>
          <Badge tone="neutral">{q.difficulty}</Badge>
        </div>
        <ProgressBar value={Math.round((index / quiz.questions.length) * 100)} className="mt-2" label="Quiz progress" />
      </div>

      <h2 className="font-display text-[17px] font-extrabold leading-snug text-[var(--fg-primary)]">
        <Markdown source={q.stem} />
      </h2>
      <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
        Topic: {q.topic_tag} · {q.source}
      </p>

      {error ? (
        <p role="alert" className="mt-4 rounded-[var(--radius-md)] bg-[#fef2f2] px-3 py-2 text-[13.5px] font-semibold text-[#b91c1c]">
          {error}
        </p>
      ) : null}

      <div className="mt-5">
        {q.type === "mcq" && q.options ? (
          <div role="radiogroup" aria-label="Answer options" className="space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={current === opt}
                onClick={() => setCurrent(opt)}
                className={`flex min-h-11 w-full items-start gap-2.5 rounded-[var(--radius-md)] border-2 px-3.5 py-2.5 text-left text-[14.5px] font-semibold ${
                  current === opt
                    ? "border-[var(--brand-primary)] bg-[#eef2ff] text-[var(--fg-primary)]"
                    : "border-[var(--border-default)] text-[var(--fg-secondary)] hover:border-[var(--border-strong)]"
                }`}
              >
                <span className={`mt-0.5 size-4 shrink-0 rounded-full border-2 ${current === opt ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]" : "border-[var(--border-strong)]"}`} aria-hidden="true" />
                <Markdown source={opt} />
              </button>
            ))}
          </div>
        ) : (
          <div>
            <label htmlFor="answer-free" className="field-label">
              Your answer
            </label>
            <textarea
              id="answer-free"
              className="input min-h-28 w-full"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Write your answer… (graded against the worked solution)"
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          Back
        </Button>
        <Button onClick={next} loading={submitting} disabled={q.type === "mcq" ? !current : !current.trim()}>
          {index + 1 >= quiz.questions.length ? "Submit quiz" : "Next"} <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}
