import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/db";
import { answers, testAttempts } from "@/db/schema";
import { lessons } from "@/lessons/lessons";
import { POST } from "./route";

// "grilling" is a real Lesson. Its Final test is read at test time, so
// rewriting the Lesson never breaks these tests.
const LESSON = "grilling";
const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

async function finalTest() {
  return (await lessons.getQuestions(LESSON))!.filter((q) => q.kind === "test");
}

// { [questionId]: optionId } with the right option for every question.
async function allRight(): Promise<Record<string, string>> {
  return Object.fromEntries((await finalTest()).map((q) => [q.id, q.answer]));
}

function post(body: unknown, cookie?: string) {
  return POST(
    new Request("http://localhost/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

beforeEach(async () => {
  await db.delete(answers);
  await db.delete(testAttempts);
});

describe("POST /api/attempts", () => {
  test("a full Final test returns 201 with the score and sets the visitor cookie", async () => {
    const total = (await finalTest()).length;
    const res = await post({ lesson: LESSON, answers: await allRight() });

    expect(res.status).toBe(201);
    const result = await res.json();
    expect(result).toMatchObject({ score: total, total, passed: true });
    expect(result.results).toHaveLength(total);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("set-cookie")).toMatch(
      new RegExp(`^visitor=${UUID}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax$`),
    );
  });

  test("a valid visitor cookie is kept and renewed", async () => {
    const visitor = crypto.randomUUID();
    const res = await post({ lesson: LESSON, answers: await allRight() }, `visitor=${visitor}`);
    expect(res.headers.get("set-cookie")).toMatch(new RegExp(`^visitor=${visitor};`));
  });

  test("a garbage visitor cookie is replaced with a new id", async () => {
    const res = await post({ lesson: LESSON, answers: await allRight() }, "visitor=1234");
    expect(res.status).toBe(201);
    expect(res.headers.get("set-cookie")).toMatch(new RegExp(`^visitor=${UUID};`));
  });

  test("all wrong fails, and every result still names the right option", async () => {
    const questions = await finalTest();
    const wrong = Object.fromEntries(
      questions.map((q) => [q.id, q.options.find((o) => o.id !== q.answer)!.id]),
    );
    const res = await post({ lesson: LESSON, answers: wrong });
    expect(res.status).toBe(201);
    const result = await res.json();
    expect(result).toMatchObject({ score: 0, total: questions.length, passed: false });
    expect(result.results.map((r: { answer: string }) => r.answer)).toEqual(
      questions.map((q) => q.answer),
    );
  });
});

describe("POST /api/attempts errors", () => {
  // Errors send no-store too, and never set a cookie.
  async function expectError(res: Response, status: number, error: string) {
    expect(res.status).toBe(status);
    expect(await res.json()).toEqual({ error });
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("set-cookie")).toBeNull();
  }

  test("a body that isn't JSON is rejected with 400", async () => {
    await expectError(await post("{oops"), 400, "Request body must be JSON.");
  });

  test("a body over 4,096 characters is rejected with 413", async () => {
    const body = { lesson: LESSON, answers: await allRight(), pad: "x".repeat(4096) };
    await expectError(await post(body), 413, "Request body is too large.");
  });

  test("an unknown Lesson is rejected with 400", async () => {
    await expectError(
      await post({ lesson: "nope", answers: await allRight() }),
      400,
      "Unknown lesson.",
    );
  });

  test("a Final test with a question missing is rejected with 400", async () => {
    const [first] = await finalTest();
    const picks = await allRight();
    delete picks[first.id];
    await expectError(
      await post({ lesson: LESSON, answers: picks }),
      400,
      "Answer every question in the Final test.",
    );
  });

  test("a Checkpoint id in a Final test is rejected with 400", async () => {
    const checkpoint = (await lessons.getQuestions(LESSON))!.find((q) => q.kind === "checkpoint")!;
    await expectError(
      await post({ lesson: LESSON, answers: { ...(await allRight()), [checkpoint.id]: "a" } }),
      400,
      "Unknown question.",
    );
  });
});
