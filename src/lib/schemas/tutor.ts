import { z } from "zod";

export const TutorMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
  turn_number: z.number().int().min(1),
});

export type TutorMessage = z.infer<typeof TutorMessageSchema>;

export const TutorRequestSchema = z.object({
  chapterSlug: z.string().min(1),
  message: z.string().min(1).max(4000),
  turnNumber: z.number().int().min(0),
  readingLevel: z.enum(["10", "15", "college"]).default("15"),
});

export const TutorResponseSchema = z.object({
  content: z.string().min(1),
  turn_number: z.number().int().min(1),
  contains_final_answer: z.boolean(),
  socratic_gate_applied: z.boolean(),
  suggested_next_action: z.string().min(3),
});

export type TutorResponse = z.infer<typeof TutorResponseSchema>;
