import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/db";
import { answers, testAttempts } from "@/db/schema";
import { lessons } from "@/lessons/lessons";
import { POST as postAnswer } from "../answers/route";
import { POST as postAttempt } from "../attempts/route";
import { GET } from "./route";

// "grilling" is a real Lesson. Its question ids are read at test time, so
// rewriting the Lesson never breaks these tests.
const LESSON = "grilling";

function progress(cookie?: string) {
  return GET(
    new Request("http://localhost/api/progress", { headers: cookie ? { cookie } : {} }),
  );
}

function post(handler: (request: Request) => Promise<Response>, url: string, body: unknown) {
  return handler(
    new Request(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

// The cookie a browser would send back after this response.
function cookieFrom(res: Response): string {
  return res.headers.get("set-cookie")!.split(";")[0];
}

beforeEach(async () => {
  await db.delete(answers);
  await db.delete(testAttempts);
});

describe("GET /api/progress", () => {
  test("without a cookie it returns empty lists and sets no cookie", async () => {
    const res = await progress();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ passed: [], tried: [] });
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  test("a garbage cookie counts as no cookie", async () => {
    const res = await progress("visitor=garbage");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ passed: [], tried: [] });
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  test("a passing Attempt shows up with the same cookie", async () => {
    const questions = (await lessons.getQuestions(LESSON))!;
    const allRight = Object.fromEntries(
      questions.filter((q) => q.kind === "test").map((q) => [q.id, q.answer]),
    );
    const attempt = await post(postAttempt, "http://localhost/api/attempts", {
      lesson: LESSON,
      answers: allRight,
    });
    expect(attempt.status).toBe(201);

    const res = await progress(cookieFrom(attempt));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ passed: [LESSON], tried: [LESSON] });
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  test("a Checkpoint Answer makes the Lesson tried, not passed", async () => {
    const questions = (await lessons.getQuestions(LESSON))!;
    const checkpoint = questions.find((q) => q.kind === "checkpoint")!;
    const answer = await post(postAnswer, "http://localhost/api/answers", {
      lesson: LESSON,
      question: checkpoint.id,
      option: checkpoint.answer,
    });

    const res = await progress(cookieFrom(answer));
    expect(await res.json()).toEqual({ passed: [], tried: [LESSON] });
  });
});
