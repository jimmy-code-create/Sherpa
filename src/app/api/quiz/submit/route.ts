import { z } from "zod";
import { guarded, json } from "@/lib/api";
import { QuizSchema, isCorrect } from "@/lib/schemas/quiz";
import { masteryScore, statusFor } from "@/lib/mastery";
import { progress, quizStore, reviewStore } from "@/lib/store";
import { getChapterContent } from "@/lib/curriculum/content";

const Body = z.object({
  chapterSlug: z.string().min(1),
  quiz: QuizSchema,
  answers: z.record(z.string()),
});

export async function POST(request: Request) {
  return guarded(request, Body, {
    handler: async ({ user }, body) => {
      const userId = user.session.userId;
      let correct = 0;
      const weakTopics = new Set<string>();
      const missed: { question: string; correctAnswer: string; topic: string }[] = [];

      for (const question of body.quiz.questions) {
        const given = body.answers[question.id];
        if (isCorrect(question, given)) {
          correct += 1;
        } else {
          weakTopics.add(question.topic_tag);
          missed.push({
            question: question.stem,
            correctAnswer: question.correct_answer,
            topic: question.topic_tag,
          });
        }
      }

      const total = body.quiz.questions.length;
      const scorePct = total === 0 ? 0 : Math.round((correct / total) * 100);

      await quizStore.add({
        userId,
        chapterSlug: body.chapterSlug,
        quiz: body.quiz,
        answers: body.answers,
        score: correct,
        total,
        weakTopics: [...weakTopics],
      });

      // Every missed question becomes a spaced-repetition card (due now).
      const content = getChapterContent(body.chapterSlug);
      for (const item of missed) {
        const glossaryHit = content?.glossary.find(
          (g) => g.term.toLowerCase() === item.topic.toLowerCase(),
        );
        await reviewStore.add({
          userId,
          chapterSlug: body.chapterSlug,
          front: glossaryHit ? `Define: ${glossaryHit.term}` : item.question.slice(0, 240),
          back: glossaryHit ? glossaryHit.definition : item.correctAnswer.slice(0, 600),
          ease: 2.5,
          interval: 1,
          dueAt: new Date().toISOString(),
          lastReviewedAt: null,
          repetitions: 0,
        });
      }

      const previous = await progress.get(userId, body.chapterSlug);
      const bestQuiz = Math.max(previous?.quizScore ?? 0, scorePct);
      const newMastery = masteryScore({
        quizScore: bestQuiz,
        notesRead: previous?.notesRead ?? 0,
        reviewsCompleted: previous?.reviewsCompleted ?? 0,
      });

      const updated = await progress.upsert(userId, body.chapterSlug, {
        quizScore: bestQuiz,
        masteryScore: newMastery,
        status: statusFor(newMastery, true),
      });

      return json({
        score: correct,
        total,
        scorePct,
        weakTopics: [...weakTopics],
        missed,
        mastery: {
          previous: previous?.masteryScore ?? 0,
          current: updated.masteryScore,
          delta: updated.masteryScore - (previous?.masteryScore ?? 0),
        },
        reviewCardsAdded: missed.length,
      });
    },
  });
}
