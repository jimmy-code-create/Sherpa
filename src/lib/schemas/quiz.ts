import { z } from "zod";

export const QuestionTypeSchema = z.enum([
  "mcq",
  "short",
  "numerical",
  "assertion_reason",
]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const QuestionSchema = z
  .object({
    id: z.string().min(1),
    type: QuestionTypeSchema,
    stem: z.string().min(10),
    options: z.array(z.string().min(1)).optional(),
    correct_answer: z.string().min(1),
    solution: z.string().min(10),
    topic_tag: z.string().min(1),
    difficulty: z.enum(["easy", "medium", "hard"]),
    source: z
      .string()
      .regex(/^(generated|PYQ:[A-Za-z0-9 _-]+:(19|20)\d{2})$/),
  })
  .refine((q) => q.type !== "mcq" || (q.options && q.options.length >= 2), {
    message: "mcq questions require at least two options",
  })
  .refine((q) => q.type !== "mcq" || !!q.options?.includes(q.correct_answer), {
    message: "mcq correct_answer must be one of the options",
  });

export const QuizSchema = z.object({
  chapter_slug: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"]),
  questions: z.array(QuestionSchema).min(1).max(20),
});

export type Question = z.infer<typeof QuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;

export function isCorrect(question: Question, given: string | undefined): boolean {
  if (given === undefined) return false;
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  return norm(given) === norm(question.correct_answer);
}
