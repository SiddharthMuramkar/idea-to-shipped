import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { db } from "@/db";
import { answers, testAttempts } from "@/db/schema";
import { lessons } from "@/lessons/lessons";
import { GET, POST } from "./route";

// "grilling" is a real Lesson. Slugs never change (ADR 0004), and its question
// ids are read at test time, so rewriting the Lesson never breaks these tests.
const LESSON = "grilling";
const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

async function questions(kind: "checkpoint" | "test") {
  return (await lessons.getQuestions(LESSON))!.filter((q) => q.kind === kind);
}

function post(body: unknown, cookie?: string) {
  return POST(
    new Request("http://localhost/api/answers", {
      method: "POST",
      headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

// The visitor id a response sets, or null when it sets no cookie.
function visitorSet(res: Response): string | null {
  return res.headers.get("set-cookie")?.match(new RegExp(`^visitor=(${UUID});`))?.[1] ?? null;
}

beforeEach(async () => {
  await db.delete(answers);
  await db.delete(testAttempts);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/answers", () => {
  test("a first Answer returns 201, graded, and sets a new visitor cookie", async () => {
    const [checkpoint] = await questions("checkpoint");
    const res = await post({ lesson: LESSON, question: checkpoint.id, option: checkpoint.answer });

    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({
      question: checkpoint.id,
      option: checkpoint.answer,
      correct: true,
      answer: checkpoint.answer,
      stats: { answered: 1 },
    });
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("set-cookie")).toMatch(
      new RegExp(`^visitor=${UUID}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax$`),
    );
  });

  test("in production the cookie is also Secure", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const [checkpoint] = await questions("checkpoint");
    const res = await post({ lesson: LESSON, question: checkpoint.id, option: "a" });
    expect(res.headers.get("set-cookie")).toMatch(/; HttpOnly; SameSite=Lax; Secure$/);
  });

  test("a valid visitor cookie is kept and renewed, among other cookies", async () => {
    const [checkpoint] = await questions("checkpoint");
    const visitor = crypto.randomUUID();
    const res = await post(
      { lesson: LESSON, question: checkpoint.id, option: "a" },
      `theme=dark; visitor=${visitor}; other=1`,
    );
    expect(res.status).toBe(201);
    expect(visitorSet(res)).toBe(visitor);
  });

  test("a garbage visitor cookie is replaced with a new id", async () => {
    const [checkpoint] = await questions("checkpoint");
    const res = await post(
      { lesson: LESSON, question: checkpoint.id, option: "a" },
      "visitor=not-a-uuid",
    );
    expect(res.status).toBe(201);
    expect(visitorSet(res)).not.toBeNull();
  });

  test("each new Visitor gets a different id", async () => {
    const [checkpoint] = await questions("checkpoint");
    const body = { lesson: LESSON, question: checkpoint.id, option: "a" };
    expect(visitorSet(await post(body))).not.toBe(visitorSet(await post(body)));
  });
});

describe("POST /api/answers errors", () => {
  // Errors send no-store too, and never set a cookie.
  async function expectError(res: Response, status: number, error: string) {
    expect(res.status).toBe(status);
    expect(await res.json()).toEqual({ error });
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("set-cookie")).toBeNull();
  }

  test("a body that isn't JSON is rejected with 400", async () => {
    await expectError(await post("not json{"), 400, "Request body must be JSON.");
  });

  test("JSON that isn't an object is rejected with 400", async () => {
    await expectError(await post("[1,2]"), 400, "Request body must be a JSON object.");
  });

  test("a body over 4,096 characters is rejected with 413", async () => {
    const [checkpoint] = await questions("checkpoint");
    const body = { lesson: LESSON, question: checkpoint.id, option: "a", pad: "x".repeat(4096) };
    await expectError(await post(body), 413, "Request body is too large.");
  });

  test("an unknown Lesson is rejected with 400", async () => {
    await expectError(
      await post({ lesson: "nope", question: "x", option: "a" }),
      400,
      "Unknown lesson.",
    );
  });

  test("a Final test question is rejected with 400", async () => {
    const [question] = await questions("test");
    await expectError(
      await post({ lesson: LESSON, question: question.id, option: question.answer }),
      400,
      "That question is in the Final test. Submit the whole test.",
    );
  });
});

function list(query: string, cookie?: string) {
  return GET(
    new Request(`http://localhost/api/answers?${query}`, {
      headers: cookie ? { cookie } : {},
    }),
  );
}

describe("GET /api/answers", () => {
  test("without a cookie it returns empty progress and sets no cookie", async () => {
    const res = await list(`lesson=${LESSON}`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ answers: [], test: null });
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  test("with the cookie from a POST it returns that Visitor's latest Answer", async () => {
    const [checkpoint] = await questions("checkpoint");
    const wrong = checkpoint.options.find((o) => o.id !== checkpoint.answer)!.id;
    const first = await post({ lesson: LESSON, question: checkpoint.id, option: wrong });
    const cookie = `visitor=${visitorSet(first)}`;
    await post({ lesson: LESSON, question: checkpoint.id, option: checkpoint.answer }, cookie);

    const res = await list(`lesson=${LESSON}`, cookie);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(await res.json()).toMatchObject({
      answers: [{ question: checkpoint.id, option: checkpoint.answer, correct: true }],
      test: null,
    });
  });

  test("an unknown or missing Lesson is rejected with 400", async () => {
    for (const query of ["lesson=nope", ""]) {
      const res = await list(query);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Unknown lesson." });
      expect(res.headers.get("cache-control")).toBe("private, no-store");
    }
  });
});
