"use client";

import * as React from "react";
import { BrainCircuit, Send, Trash2, ShieldCheck } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import type { TutorResponse } from "@/lib/schemas/tutor";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  turnNumber?: number;
  gate?: boolean;
  givesAnswer?: boolean;
}

const LEVELS = [
  { id: "10", label: "Like I'm 10" },
  { id: "15", label: "Like I'm 15" },
  { id: "college", label: "College level" },
] as const;

export function TutorTab({ chapterSlug, chapterName }: { chapterSlug: string; chapterName: string }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [level, setLevel] = React.useState<(typeof LEVELS)[number]["id"]>("15");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryAfter, setRetryAfter] = React.useState<number | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    void fetch(`/api/ai/tutor?chapterSlug=${encodeURIComponent(chapterSlug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((body: { messages?: { role: "user" | "assistant"; content: string; turnNumber: number }[] }) => {
        if (body.messages && body.messages.length > 0) {
          setMessages(
            body.messages.map((m) => ({
              role: m.role,
              content: m.content,
              turnNumber: m.turnNumber,
              gate: m.role === "assistant" && m.turnNumber <= 2,
              givesAnswer: false,
            })),
          );
        }
      })
      .catch(() => {});
  }, [chapterSlug]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, pending]);

  React.useEffect(() => {
    if (retryAfter === null) return;
    if (retryAfter <= 0) {
      setRetryAfter(null);
      return;
    }
    const t = window.setTimeout(() => setRetryAfter((v) => (v === null ? null : v - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [retryAfter]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending || retryAfter !== null) return;
    setInput("");
    setError(null);
    setPending(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterSlug, message: text, readingLevel: level }),
      });
      const body = (await res.json()) as TutorResponse & { error?: string; retryAfterSeconds?: number };
      if (!res.ok) {
        setError(
          res.status === 429
            ? `Slow down a bit — try again in ${body.retryAfterSeconds ?? 30}s.`
            : (body.error ?? "The tutor couldn't reply. Try again."),
        );
        if (res.status === 429) setRetryAfter(body.retryAfterSeconds ?? 30);
        setMessages((prev) => prev.slice(0, -1));
        setPending(false);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: body.content,
          turnNumber: body.turn_number,
          gate: body.socratic_gate_applied,
          givesAnswer: body.contains_final_answer,
        },
      ]);
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setPending(false);
    }
  }

  async function clearChat() {
    await fetch(`/api/ai/tutor?chapterSlug=${encodeURIComponent(chapterSlug)}`, { method: "DELETE" }).catch(() => {});
    setMessages([]);
  }

  const assistantTurns = messages.filter((m) => m.role === "assistant").length;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <p className="flex items-center gap-2 font-display text-[14.5px] font-extrabold text-[var(--fg-primary)]">
          <BrainCircuit className="size-4 text-[var(--brand-primary)]" aria-hidden="true" />
          Tutor — {chapterName}
        </p>
        <Badge tone="brand" icon={<ShieldCheck className="size-3" aria-hidden="true" />}>
          Socratic mode: turn 1 always asks a question first
        </Badge>
        <div className="ml-auto flex items-center gap-1.5" role="group" aria-label="Explain like">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={level === l.id}
              onClick={() => setLevel(l.id)}
              className={`chip ${level === l.id ? "" : "bg-transparent"}`}
              data-selected={level === l.id}
            >
              {l.label}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => void clearChat()}>
          <Trash2 className="size-4" aria-hidden="true" /> Clear chat
        </Button>
      </Card>

      <Card className="p-0">
        <div ref={scrollRef} className="max-h-[55vh] min-h-[300px] overflow-y-auto p-4 sm:p-5" aria-live="polite" aria-label="Conversation">
          {messages.length === 0 && !pending ? (
            <EmptyState
              icon={<BrainCircuit className="size-8" aria-hidden="true" />}
              title="Ask the tutor anything about this chapter"
              description="It will not hand you the answer on the first turn — it asks one guiding question, then builds with you. After two tries (or if you say “just tell me”), you get the full explanation."
            />
          ) : (
            <ul className="space-y-4">
              {messages.map((m, i) => (
                <li key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-[var(--radius-lg)] px-4 py-3 text-[15px] leading-relaxed ${
                      m.role === "user"
                        ? "bg-[var(--brand-primary)] text-white"
                        : "border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--fg-primary)]"
                    }`}
                  >
                    {m.role === "assistant" ? <Markdown source={m.content} /> : <p>{m.content}</p>}
                    {m.role === "assistant" && m.gate ? (
                      <p className="mt-2 border-t border-[var(--border-default)] pt-1.5 text-[11.5px] font-bold uppercase tracking-wide opacity-60">
                        Turn {m.turnNumber} · guiding question (no answer yet)
                      </p>
                    ) : null}
                    {m.role === "assistant" && m.givesAnswer ? (
                      <p className="mt-2 border-t border-[var(--border-default)] pt-1.5 text-[11.5px] font-bold uppercase tracking-wide opacity-60">
                        Full explanation — unlocked after your attempts
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
              {pending ? (
                <li className="flex justify-start">
                  <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] px-4 py-3 text-[14px] text-[var(--fg-muted)]">
                    Thinking of a good question…
                  </div>
                </li>
              ) : null}
            </ul>
          )}
        </div>

        {error ? (
          <p role="alert" className="border-t border-[var(--border-default)] bg-[#fef2f2] px-4 py-2.5 text-[13.5px] font-semibold text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        <form onSubmit={send} className="flex items-end gap-2 border-t border-[var(--border-default)] p-3">
          <label htmlFor="tutor-input" className="sr-only">
            Message the tutor
          </label>
          <textarea
            id="tutor-input"
            className="input min-h-11 flex-1 resize-none py-2.5"
            rows={2}
            placeholder={`Ask about ${chapterName}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(e as unknown as React.FormEvent);
              }
            }}
            disabled={pending || retryAfter !== null}
          />
          <Button type="submit" loading={pending} disabled={!input.trim() || retryAfter !== null}>
            <Send className="size-4" aria-hidden="true" /> Send
          </Button>
        </form>
        <p className="border-t border-[var(--border-default)] px-4 py-2 text-[12px] text-[var(--fg-muted)]">
          {assistantTurns === 0
            ? "Turn 1: the tutor asks exactly one guiding question — never the answer."
            : assistantTurns < 2
              ? "Turn 2: a narrower hint. One more attempt, or say “just tell me”, unlocks the full explanation."
              : "You've had your attempts — the tutor can now explain fully."}
        </p>
      </Card>
    </div>
  );
}
