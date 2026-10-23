import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/db";
import { answers, testAttempts } from "@/db/schema";
import { lessonsFrom } from "@/lessons/lessons";
import { quizFrom } from "./quiz";

// The fixture Lesson "quiz" has two Checkpoints (c1: b is right, c2: a is right)
// and a 5-question Final test (t1..t5: a, b, c, a, b are right; t1 has a d).
const quiz = quizFrom(lessonsFrom(path.join(__dirname, "__fixtures__", "lessons")));
const LESSON = "quiz";

// Each test makes its own Visitors, as the cookie would.
const newVisitor = () => crypto.randomUUID();

beforeEach(async () => {
  await db.delete(answers);
  await db.delete(testAttempts);
});

describe("answering a Checkpoint", () => {
  test("a right Answer is graded and comes back with the crowd stats", async () => {
    const result = await quiz.answerCheckpoint(newVisitor(), {
      lesson: LESSON,
      question: "c1",
      option: "b",
    });
    expect(result).toEqual({
      ok: true,
      value: {
        question: "c1",
        option: "b",
        correct: true,
        answer: "b",
        stats: { answered: 1, picked: { a: 0, b: 1, c: 0 } },
      },
    });
  });

  test("a wrong Answer is marked wrong and still says which option was right", async () => {
    const result = await quiz.answerCheckpoint(newVisitor(), {
      lesson: LESSON,
      question: "c1",
      option: "c",
    });
    expect(result).toMatchObject({ ok: true, value: { option: "c", correct: false, answer: "b" } });
  });

  test("crowd stats count only each Visitor's first Answer", async () => {
    const ada = newVisitor();
    const bo = newVisitor();
    await quiz.answerCheckpoint(ada, { lesson: LESSON, question: "c1", option: "b" });
    await quiz.answerCheckpoint(ada, { lesson: LESSON, question: "c1", option: "a" });
    const result = await quiz.answerCheckpoint(bo, { lesson: LESSON, question: "c1", option: "a" });
    expect(result).toMatchObject({
      ok: true,
      value: { stats: { answered: 2, picked: { a: 1, b: 1, c: 0 } } },
    });
  });

  test("input that isn't an object is rejected with an exact error", async () => {
    for (const input of [null, "c1", 42, ["quiz", "c1", "b"]]) {
      expect(await quiz.answerCheckpoint(newVisitor(), input)).toEqual({
        ok: false,
        error: "Request body must be a JSON object.",
      });
    }
  });

  test("an unknown or missing Lesson, question or option gets an exact error", async () => {
    const cases: [unknown, string][] = [
      [{ lesson: "nope", question: "c1", option: "b" }, "Unknown lesson."],
      [{ question: "c1", option: "b" }, "Unknown lesson."],
      [{ lesson: 7, question: "c1", option: "b" }, "Unknown lesson."],
      [{ lesson: LESSON, question: "nope", option: "b" }, "Unknown question."],
      [{ lesson: LESSON, option: "b" }, "Unknown question."],
      [{ lesson: LESSON, question: ["c1"], option: "b" }, "Unknown question."],
      [{ lesson: LESSON, question: "c1", option: "d" }, "Unknown option."],
      [{ lesson: LESSON, question: "c1", option: "B" }, "Unknown option."],
      [{ lesson: LESSON, question: "c1" }, "Unknown option."],
      [{ lesson: LESSON, question: "c1", option: 1 }, "Unknown option."],
    ];
    for (const [input, error] of cases) {
      expect(await quiz.answerCheckpoint(newVisitor(), input)).toEqual({ ok: false, error });
    }
  });

  test("a Final test question is rejected: the Final test is submitted whole", async () => {
    expect(
      await quiz.answerCheckpoint(newVisitor(), { lesson: LESSON, question: "t1", option: "a" }),
    ).toEqual({ ok: false, error: "That question is in the Final test. Submit the whole test." });
  });

  test("stats are per question: another question's Answers don't count", async () => {
    await quiz.answerCheckpoint(newVisitor(), { lesson: LESSON, question: "c1", option: "b" });
    const result = await quiz.answerCheckpoint(newVisitor(), {
      lesson: LESSON,
      question: "c2",
      option: "a",
    });
    expect(result).toMatchObject({
      ok: true,
      value: { stats: { answered: 1, picked: { a: 1, b: 0, c: 0 } } },
    });
  });
});

describe("a Visitor's progress on a Lesson", () => {
  test("every Answer is kept: progress shows the latest, crowd stats the first", async () => {
    const ada = newVisitor();
    await quiz.answerCheckpoint(ada, { lesson: LESSON, question: "c1", option: "a" });
    await quiz.answerCheckpoint(ada, { lesson: LESSON, question: "c1", option: "b" });
    await quiz.answerCheckpoint(ada, { lesson: LESSON, question: "c2", option: "c" });

    expect(await quiz.lessonProgress(ada, LESSON)).toEqual({
      ok: true,
      value: {
        answers: [
          {
            question: "c1",
            option: "b",
            correct: true,
            answer: "b",
            stats: { answered: 1, picked: { a: 1, b: 0, c: 0 } },
          },
          {
            question: "c2",
            option: "c",
            correct: false,
            answer: "a",
            stats: { answered: 1, picked: { a: 0, b: 0, c: 1 } },
          },
        ],
        test: null,
      },
    });
  });

  test("a Visitor with no Answers yet has empty progress", async () => {
    expect(await quiz.lessonProgress(newVisitor(), LESSON)).toEqual({
      ok: true,
      value: { answers: [], test: null },
    });
  });

  test("an unknown Lesson is rejected with an exact error", async () => {
    for (const lesson of ["nope", ""]) {
      expect(await quiz.lessonProgress(newVisitor(), lesson)).toEqual({
        ok: false,
        error: "Unknown lesson.",
      });
    }
  });
});

// The right answer to every Final test question in the fixture.
const ALL_RIGHT = { t1: "a", t2: "b", t3: "c", t4: "a", t5: "b" };

describe("submitting the Final test", () => {
  test("5 of 5 passes, and every question comes back graded with its stats", async () => {
    const result = await quiz.submitTest(newVisitor(), { lesson: LESSON, answers: ALL_RIGHT });
    const one = (option: string, picked: Record<string, number>) => ({
      option,
      correct: true,
      answer: option,
      stats: { answered: 1, picked },
    });
    expect(result).toEqual({
      ok: true,
      value: {
        score: 5,
        total: 5,
        passed: true,
        results: [
          { question: "t1", ...one("a", { a: 1, b: 0, c: 0, d: 0 }) },
          { question: "t2", ...one("b", { a: 0, b: 1, c: 0 }) },
          { question: "t3", ...one("c", { a: 0, b: 0, c: 1 }) },
          { question: "t4", ...one("a", { a: 1, b: 0, c: 0 }) },
          { question: "t5", ...one("b", { a: 0, b: 1, c: 0 }) },
        ],
      },
    });
  });

  test("4 of 5 is exactly 80% and passes", async () => {
    const result = await quiz.submitTest(newVisitor(), {
      lesson: LESSON,
      answers: { ...ALL_RIGHT, t5: "c" },
    });
    expect(result).toMatchObject({ ok: true, value: { score: 4, total: 5, passed: true } });
    if (!result.ok) return;
    expect(result.value.results[4]).toMatchObject({
      question: "t5",
      option: "c",
      correct: false,
      answer: "b",
    });
  });

  test("3 of 5 fails", async () => {
    const result = await quiz.submitTest(newVisitor(), {
      lesson: LESSON,
      answers: { ...ALL_RIGHT, t4: "b", t5: "a" },
    });
    expect(result).toMatchObject({ ok: true, value: { score: 3, total: 5, passed: false } });
  });
});

describe("submitting the Final test: bad input", () => {
  test("a submission must hold exactly the Final test's questions", async () => {
    const missingOne = Object.fromEntries(Object.entries(ALL_RIGHT).filter(([id]) => id !== "t5"));
    const cases: [unknown, string][] = [
      [null, "Request body must be a JSON object."],
      [[ALL_RIGHT], "Request body must be a JSON object."],
      [{ lesson: "nope", answers: ALL_RIGHT }, "Unknown lesson."],
      [{ lesson: "no-final-test", answers: { only: "a" } }, "This lesson has no Final test."],
      [{ lesson: LESSON }, "Answer every question in the Final test."],
      [
        { lesson: LESSON, answers: ["a", "b", "c", "a", "b"] },
        "Answer every question in the Final test.",
      ],
      [{ lesson: LESSON, answers: missingOne }, "Answer every question in the Final test."],
      [{ lesson: LESSON, answers: { ...ALL_RIGHT, t6: "a" } }, "Unknown question."],
      [{ lesson: LESSON, answers: { ...ALL_RIGHT, c1: "b" } }, "Unknown question."],
      [{ lesson: LESSON, answers: { ...ALL_RIGHT, t2: "d" } }, "Unknown option."],
      [{ lesson: LESSON, answers: { ...ALL_RIGHT, t2: null } }, "Unknown option."],
    ];
    for (const [input, error] of cases) {
      expect(await quiz.submitTest(newVisitor(), input)).toEqual({ ok: false, error });
    }
  });

  test("a rejected submission stores nothing", async () => {
    const ada = newVisitor();
    await quiz.submitTest(ada, { lesson: LESSON, answers: { ...ALL_RIGHT, t6: "a" } });
    expect(await quiz.lessonProgress(ada, LESSON)).toEqual({
      ok: true,
      value: { answers: [], test: null },
    });
  });
});

// 3 of 5: a fail.
const FAILING = { ...ALL_RIGHT, t4: "b", t5: "a" };

describe("the latest Attempt decides", () => {
  test("pass then fail: the Lesson shows the failed Attempt", async () => {
    const ada = newVisitor();
    await quiz.submitTest(ada, { lesson: LESSON, answers: ALL_RIGHT });
    await quiz.submitTest(ada, { lesson: LESSON, answers: FAILING });
    expect(await quiz.lessonProgress(ada, LESSON)).toMatchObject({
      ok: true,
      value: { test: { score: 3, total: 5, passed: false } },
    });
  });

  test("fail then pass: the Lesson shows the passing Attempt, with when it happened", async () => {
    const ada = newVisitor();
    await quiz.submitTest(ada, { lesson: LESSON, answers: FAILING });
    const before = Date.now();
    await quiz.submitTest(ada, { lesson: LESSON, answers: ALL_RIGHT });
    const result = await quiz.lessonProgress(ada, LESSON);
    expect(result).toMatchObject({
      ok: true,
      value: { test: { score: 5, total: 5, passed: true } },
    });
    if (!result.ok || !result.value.test) throw new Error("expected an Attempt");
    // Allow for clock drift between this machine and the database.
    expect(Math.abs(Date.parse(result.value.test.at) - before)).toBeLessThan(60_000);
  });

  test("progress lists the latest Answer to each Final test question too", async () => {
    const ada = newVisitor();
    await quiz.submitTest(ada, { lesson: LESSON, answers: ALL_RIGHT });
    await quiz.submitTest(ada, { lesson: LESSON, answers: FAILING });
    const result = await quiz.lessonProgress(ada, LESSON);
    if (!result.ok) throw new Error(result.error);
    expect(result.value.answers.map((a) => [a.question, a.option, a.correct])).toEqual([
      ["t1", "a", true],
      ["t2", "b", true],
      ["t3", "c", true],
      ["t4", "b", false],
      ["t5", "a", false],
    ]);
  });
});

describe("a Visitor's progress across the course", () => {
  test("a Lesson counts as passed only while its latest Attempt passes", async () => {
    const ada = newVisitor();
    await quiz.submitTest(ada, { lesson: LESSON, answers: FAILING });
    await quiz.submitTest(ada, { lesson: LESSON, answers: ALL_RIGHT });
    expect(await quiz.courseProgress(ada)).toEqual({ passed: [LESSON], tried: [LESSON] });

    await quiz.submitTest(ada, { lesson: LESSON, answers: FAILING });
    expect(await quiz.courseProgress(ada)).toEqual({ passed: [], tried: [LESSON] });
  });

  test("Checkpoint Answers make a Lesson tried, never passed", async () => {
    const ada = newVisitor();
    await quiz.answerCheckpoint(ada, { lesson: LESSON, question: "c1", option: "b" });
    await quiz.answerCheckpoint(ada, { lesson: LESSON, question: "c2", option: "a" });
    await quiz.answerCheckpoint(ada, { lesson: "no-final-test", question: "only", option: "a" });
    expect(await quiz.courseProgress(ada)).toEqual({
      passed: [],
      tried: ["no-final-test", LESSON],
    });
  });

  test("with no Visitor, progress is empty and no query runs", async () => {
    // A real driver pointed at a host that can't exist: any query would fail.
    const nowhere = drizzle({ client: neon("postgresql://nobody:nothing@db.invalid/none") });
    const offline = quizFrom(lessonsFrom(path.join(__dirname, "__fixtures__", "lessons")), nowhere);
    await expect(offline.courseProgress(newVisitor())).rejects.toThrow();

    expect(await offline.courseProgress(null)).toEqual({ passed: [], tried: [] });
    expect(await offline.lessonProgress(null, LESSON)).toEqual({
      ok: true,
      value: { answers: [], test: null },
    });
  });
});

describe("crowd stats and Visitors", () => {
  test("Final test Answers feed the crowd stats, first Answer per Visitor", async () => {
    const ada = newVisitor();
    await quiz.submitTest(ada, { lesson: LESSON, answers: ALL_RIGHT });
    await quiz.submitTest(ada, { lesson: LESSON, answers: { ...ALL_RIGHT, t1: "b" } });
    const result = await quiz.submitTest(newVisitor(), {
      lesson: LESSON,
      answers: { ...ALL_RIGHT, t1: "d" },
    });
    if (!result.ok) throw new Error(result.error);
    expect(result.value.results[0].stats).toEqual({
      answered: 2,
      picked: { a: 1, b: 0, c: 0, d: 1 },
    });
  });

  test("Visitors are isolated: one Visitor never sees another's Answers or Attempts", async () => {
    const ada = newVisitor();
    const bo = newVisitor();
    await quiz.answerCheckpoint(ada, { lesson: LESSON, question: "c1", option: "b" });
    await quiz.submitTest(ada, { lesson: LESSON, answers: ALL_RIGHT });

    expect(await quiz.lessonProgress(bo, LESSON)).toEqual({
      ok: true,
      value: { answers: [], test: null },
    });
    expect(await quiz.courseProgress(bo)).toEqual({ passed: [], tried: [] });

    await quiz.answerCheckpoint(bo, { lesson: LESSON, question: "c2", option: "b" });
    const progress = await quiz.lessonProgress(bo, LESSON);
    if (!progress.ok) throw new Error(progress.error);
    expect(progress.value.answers.map((a) => a.question)).toEqual(["c2"]);
    expect(progress.value.test).toBeNull();
  });
});
