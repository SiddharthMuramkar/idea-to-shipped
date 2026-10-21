import { beforeEach, describe, expect, test } from "vitest";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { GET, POST } from "./route";

// "grilling" is a real Lesson. Slugs never change (ADR 0004), so it's safe to use.
const LESSON = "grilling";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(async () => {
  await db.delete(comments);
});

describe("POST /api/comments", () => {
  test("a valid Comment is created and returned with 201", async () => {
    const res = await post({ lesson: LESSON, name: "Sid", body: "Great lesson" });
    expect(res.status).toBe(201);
    const created = await res.json();
    expect(created).toMatchObject({ name: "Sid", body: "Great lesson" });
    expect(typeof created.id).toBe("number");
    expect(typeof created.createdAt).toBe("string");
  });

  test("an empty or blank body is rejected with 400", async () => {
    const res = await post({ lesson: LESSON, body: "   " });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Comment can't be empty." });
  });

  test("a body of exactly 2000 characters is fine, 2001 is rejected", async () => {
    expect((await post({ lesson: LESSON, body: "x".repeat(2000) })).status).toBe(201);
    const res = await post({ lesson: LESSON, body: "x".repeat(2001) });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Comment must be 2000 characters or fewer." });
  });

  test("a name of exactly 50 characters is fine, 51 is rejected", async () => {
    expect((await post({ lesson: LESSON, name: "n".repeat(50), body: "hi" })).status).toBe(201);
    const res = await post({ lesson: LESSON, name: "n".repeat(51), body: "hi" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Name must be 50 characters or fewer." });
  });

  test("a Comment on a Lesson that doesn't exist is rejected with 400", async () => {
    const res = await post({ lesson: "nope", body: "hello?" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown lesson." });
  });

  test("a Comment with no lesson at all is rejected with 400", async () => {
    const res = await post({ body: "hello?" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown lesson." });
  });
});

function list(query: string) {
  return GET(new Request(`http://localhost/api/comments?${query}`));
}

describe("GET /api/comments", () => {
  test("lists a Lesson's Comments, newest first", async () => {
    await post({ lesson: LESSON, name: "A", body: "first" });
    await post({ lesson: LESSON, name: "B", body: "second" });
    await post({ lesson: "domain-modeling", name: "C", body: "other lesson" });

    const res = await list(`lesson=${LESSON}`);
    expect(res.status).toBe(200);
    const bodies = (await res.json()).map((c: { body: string }) => c.body);
    expect(bodies).toEqual(["second", "first"]);
  });
});

describe("GET /api/comments errors", () => {
  test("an unknown lesson is rejected with 400", async () => {
    const res = await list("lesson=nope");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown lesson." });
  });

  test("a missing lesson is rejected with 400", async () => {
    const res = await list("");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown lesson." });
  });
});

describe("edge cases", () => {
  test("a Comment with no name, or a blank one, shows as Anonymous", async () => {
    expect((await (await post({ lesson: LESSON, body: "hi" })).json()).name).toBe("Anonymous");
    expect((await (await post({ lesson: LESSON, name: "  ", body: "hi" })).json()).name).toBe(
      "Anonymous",
    );
  });

  test("a request body that isn't JSON is rejected with 400, not a crash", async () => {
    const res = await POST(
      new Request("http://localhost/api/comments", { method: "POST", body: "not json{" }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Request body must be JSON." });
  });

  test("JSON that isn't an object is rejected with 400, not a crash", async () => {
    for (const value of [null, "hi", 42]) {
      const res = await post(value);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Request body must be a JSON object." });
    }
  });

  test("a body or name that isn't text is rejected with 400, not a crash", async () => {
    const badBody = await post({ lesson: LESSON, body: 123 });
    expect(badBody.status).toBe(400);
    expect(await badBody.json()).toEqual({ error: "Comment must be text." });

    const badName = await post({ lesson: LESSON, name: 5, body: "hi" });
    expect(badName.status).toBe(400);
    expect(await badName.json()).toEqual({ error: "Name must be text." });
  });
});
