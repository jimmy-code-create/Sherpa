import { describe, expect, it } from "vitest";
import { respondSocratically, enforceSocraticGate } from "@/lib/ai/tutor";

const CHAPTER = "light-reflection-refraction";

describe("Socratic gate (rubric criterion 4)", () => {
  it("turn 1 asks exactly one question", () => {
    const res = respondSocratically({
      chapterSlug: CHAPTER,
      message: "What is the mirror formula?",
      priorTurns: 0,
    });
    expect(res.turn_number).toBe(1);
    expect(res.socratic_gate_applied).toBe(true);
    expect(res.contains_final_answer).toBe(false);
    expect((res.content.match(/\?/g) ?? []).length).toBe(1);
  });

  it("turn 1 never contains the final answer (gate throws on leak)", () => {
    const answerKey = "1/v + 1/u = 1/f, the mirror formula with sign convention";
    expect(() => enforceSocraticGate(`The answer is ${answerKey}.`, true, answerKey)).toThrow(
      /Socratic gate violated/,
    );
  });

  it("turn 1 with two questions is rejected", () => {
    expect(() => enforceSocraticGate("What is this? And why does it happen?", true, null)).toThrow(
      /exactly one question/,
    );
  });

  it("turn 1 without any question is rejected", () => {
    expect(() => enforceSocraticGate("Think about mirrors.", true, null)).toThrow();
  });

  it("turn 2 is still a hint, not the answer", () => {
    const res = respondSocratically({
      chapterSlug: CHAPTER,
      message: "I think it relates u, v and f somehow?",
      priorTurns: 1,
    });
    expect(res.socratic_gate_applied).toBe(true);
    expect(res.contains_final_answer).toBe(false);
  });

  it("turn 3 gives the full explanation (2 attempts rule)", () => {
    const res = respondSocratically({
      chapterSlug: CHAPTER,
      message: "I really can't figure out the sign convention",
      priorTurns: 2,
    });
    expect(res.contains_final_answer).toBe(true);
    expect(res.socratic_gate_applied).toBe(false);
  });

  it("explicit 'just tell me' unlocks the answer immediately", () => {
    const res = respondSocratically({
      chapterSlug: CHAPTER,
      message: "just tell me the answer please",
      priorTurns: 0,
    });
    expect(res.contains_final_answer).toBe(true);
  });

  it("every response ends with a question or a next action", () => {
    for (const priorTurns of [0, 1, 2, 3]) {
      const res = respondSocratically({
        chapterSlug: CHAPTER,
        message: "explain refraction",
        priorTurns,
      });
      const tail = res.content.trim().slice(-400);
      expect(tail.includes("?") || /next action:/i.test(tail)).toBe(true);
    }
  });
});
