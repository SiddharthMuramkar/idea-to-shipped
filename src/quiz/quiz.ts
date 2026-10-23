import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { answers, testAttempts } from "@/db/schema";
import { lessons, type Question } from "@/lessons/lessons";
import type { Result } from "@/result";
import { passed } from "./limits";
import type {
  Checked,
  CourseProgress,
  LessonProgress,
  OptionId,
  Stats,
  TestResult,
} from "./types";

type Lessons = Pick<typeof lessons, "getQuestions">;
type Database = typeof db;

// Exact error strings, so tests and the UI can rely on them.
const fail = (error: string) => ({ ok: false, error }) as const;
const NOT_AN_OBJECT = fail("Request body must be a JSON object.");
const UNKNOWN_LESSON = fail("Unknown lesson.");
const UNKNOWN_QUESTION = fail("Unknown question.");
const UNKNOWN_OPTION = fail("Unknown option.");
const FINAL_TEST_QUESTION = fail("That question is in the Final test. Submit the whole test.");
const NO_FINAL_TEST = fail("This lesson has no Final test.");
const ANSWER_EVERY_QUESTION = fail("Answer every question in the Final test.");

function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

// The option's id if this question has it. Anything else (wrong case, a
// number, an option the question doesn't offer) is unknown.
function optionOf(question: Question, option: unknown): OptionId | null {
  return question.options.find((o) => o.id === option)?.id ?? null;
}

// The quiz grades every Answer itself, from the Lesson file (ADR 0006). It
// asks the Lessons module for nothing but the questions.
export function quizFrom(source: Lessons, database: Database = db) {
  // Each Visitor's first Answer to each question, counted per option.
  function crowdQuery(lesson: string, questionIds: string[]) {
    const first = database
      .selectDistinctOn([answers.questionId, answers.visitorId], {
        question: answers.questionId,
        option: answers.optionId,
      })
      .from(answers)
      .where(and(eq(answers.lessonSlug, lesson), inArray(answers.questionId, questionIds)))
      .orderBy(answers.questionId, answers.visitorId, answers.id)
      .as("first");
    return database
      .select({ question: first.question, option: first.option, visitors: count() })
      .from(first)
      .groupBy(first.question, first.option);
  }

  type CrowdRow = { question: string; option: string; visitors: number };

  // Every option the question has, 0 when nobody picked it.
  function statsFor(question: Question, rows: CrowdRow[]): Stats {
    const picked: Partial<Record<OptionId, number>> = {};
    for (const option of question.options) picked[option.id] = 0;
    let answered = 0;
    for (const row of rows) {
      if (row.question !== question.id || !(row.option in picked)) continue;
      picked[row.option as OptionId] = row.visitors;
      answered += row.visitors;
    }
    return { answered, picked };
  }

  // The Lesson's questions, or null when the slug isn't a Lesson.
  async function questionsOf(lesson: unknown): Promise<Question[] | null> {
    if (typeof lesson !== "string" || lesson === "") return null;
    return source.getQuestions(lesson);
  }

  return {
    // { lesson, question, option } for one Checkpoint. Accepts whatever JSON
    // the request carried and checks every field against the Lesson file.
    async answerCheckpoint(visitor: string, input: unknown): Promise<Result<Checked>> {
      if (!isObject(input)) return NOT_AN_OBJECT;
      const questions = await questionsOf(input.lesson);
      if (!questions) return UNKNOWN_LESSON;
      const lesson = input.lesson as string;
      const question = questions.find((q) => q.id === input.question);
      if (!question) return UNKNOWN_QUESTION;
      if (question.kind === "test") return FINAL_TEST_QUESTION;
      const option = optionOf(question, input.option);
      if (!option) return UNKNOWN_OPTION;
      const correct = option === question.answer;

      const [, rows] = await database.batch([
        database.insert(answers).values({
          visitorId: visitor,
          lessonSlug: lesson,
          questionId: question.id,
          optionId: option,
          correct,
        }),
        crowdQuery(lesson, [question.id]),
      ]);
      return {
        ok: true,
        value: {
          question: question.id,
          option,
          correct,
          answer: question.answer,
          stats: statsFor(question, rows),
        },
      };
    },

    // { lesson, answers: { [questionId]: optionId } } for a whole Final test.
    // The Attempt and its Answers are written in one batch, so they commit
    // together, and the crowd stats are read in the same round trip.
    async submitTest(visitor: string, input: unknown): Promise<Result<TestResult>> {
      if (!isObject(input)) return NOT_AN_OBJECT;
      const questions = await questionsOf(input.lesson);
      if (!questions) return UNKNOWN_LESSON;
      const lesson = input.lesson as string;
      const finalTest = questions.filter((q) => q.kind === "test");
      if (finalTest.length === 0) return NO_FINAL_TEST;
      const picks = input.answers;
      if (!isObject(picks)) return ANSWER_EVERY_QUESTION;
      // Exactly the Final test's questions: no Checkpoints, nothing extra.
      for (const id of Object.keys(picks)) {
        if (!finalTest.some((q) => q.id === id)) return UNKNOWN_QUESTION;
      }

      const graded: { question: Question; option: OptionId; correct: boolean }[] = [];
      for (const question of finalTest) {
        if (!Object.hasOwn(picks, question.id)) return ANSWER_EVERY_QUESTION;
        const option = optionOf(question, picks[question.id]);
        if (!option) return UNKNOWN_OPTION;
        graded.push({ question, option, correct: option === question.answer });
      }
      const score = graded.filter((g) => g.correct).length;
      const total = finalTest.length;
      const attemptId = crypto.randomUUID();

      const [, , rows] = await database.batch([
        database
          .insert(testAttempts)
          .values({ id: attemptId, visitorId: visitor, lessonSlug: lesson, score, total }),
        database.insert(answers).values(
          graded.map((g) => ({
            visitorId: visitor,
            lessonSlug: lesson,
            questionId: g.question.id,
            optionId: g.option,
            correct: g.correct,
            attemptId,
          })),
        ),
        crowdQuery(lesson, finalTest.map((q) => q.id)),
      ]);
      return {
        ok: true,
        value: {
          score,
          total,
          passed: passed(score, total),
          results: graded.map((g) => ({
            question: g.question.id,
            option: g.option,
            correct: g.correct,
            answer: g.question.answer,
            stats: statsFor(g.question, rows),
          })),
        },
      };
    },

    // This Visitor's latest Answer to each question in the Lesson, in Lesson
    // order, with current crowd stats. correct is the grade stored when they
    // answered (ADR 0005). With no Visitor there's nothing to read, so no query.
    async lessonProgress(visitor: string | null, lesson: string): Promise<Result<LessonProgress>> {
      const questions = await questionsOf(lesson);
      if (!questions) return UNKNOWN_LESSON;
      if (!visitor) return { ok: true, value: { answers: [], test: null } };

      const [attempts, latest, rows] = await database.batch([
        database
          .select({
            score: testAttempts.score,
            total: testAttempts.total,
            createdAt: testAttempts.createdAt,
          })
          .from(testAttempts)
          .where(and(eq(testAttempts.visitorId, visitor), eq(testAttempts.lessonSlug, lesson)))
          .orderBy(desc(testAttempts.createdAt), desc(testAttempts.id))
          .limit(1),
        database
          .selectDistinctOn([answers.questionId], {
            question: answers.questionId,
            option: answers.optionId,
            correct: answers.correct,
          })
          .from(answers)
          .where(and(eq(answers.visitorId, visitor), eq(answers.lessonSlug, lesson)))
          .orderBy(answers.questionId, desc(answers.id)),
        crowdQuery(lesson, questions.map((q) => q.id)),
      ]);
      const byQuestion = new Map(latest.map((row) => [row.question, row]));
      const checked = questions.flatMap((question): Checked[] => {
        const row = byQuestion.get(question.id);
        if (!row) return [];
        return [
          {
            question: question.id,
            option: row.option as OptionId,
            correct: row.correct,
            answer: question.answer,
            stats: statsFor(question, rows),
          },
        ];
      });
      const attempt = attempts[0];
      const test = attempt
        ? {
            score: attempt.score,
            total: attempt.total,
            passed: passed(attempt.score, attempt.total),
            at: attempt.createdAt.toISOString(),
          }
        : null;
      return { ok: true, value: { answers: checked, test } };
    },

    // Slugs of the Lessons this Visitor has passed (their latest Attempt
    // passed) and tried (any Answer: every Attempt stores its Answers too).
    // With no Visitor there's nothing to read, so no query.
    async courseProgress(visitor: string | null): Promise<CourseProgress> {
      if (!visitor) return { passed: [], tried: [] };
      const [latestAttempts, tried] = await database.batch([
        database
          .selectDistinctOn([testAttempts.lessonSlug], {
            lesson: testAttempts.lessonSlug,
            score: testAttempts.score,
            total: testAttempts.total,
          })
          .from(testAttempts)
          .where(eq(testAttempts.visitorId, visitor))
          .orderBy(testAttempts.lessonSlug, desc(testAttempts.createdAt), desc(testAttempts.id)),
        database
          .selectDistinct({ lesson: answers.lessonSlug })
          .from(answers)
          .where(eq(answers.visitorId, visitor))
          .orderBy(answers.lessonSlug),
      ]);
      return {
        passed: latestAttempts.filter((a) => passed(a.score, a.total)).map((a) => a.lesson),
        tried: tried.map((t) => t.lesson),
      };
    },
  };
}

// The real course.
export const quiz = quizFrom(lessons);
