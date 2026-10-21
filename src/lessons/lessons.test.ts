import path from "node:path";
import { describe, expect, test } from "vitest";
import { lessonsFrom } from "./lessons";

const fixtures = path.join(__dirname, "__fixtures__");
const lessons = lessonsFrom(path.join(fixtures, "valid"));

describe("listLessons", () => {
  test("returns every Lesson ordered by its number, not by file name", async () => {
    expect(await lessons.listLessons()).toEqual([
      { number: 1, slug: "first", title: "First lesson" },
      { number: 2, slug: "second", title: "Second lesson" },
      { number: 10, slug: "tenth", title: "Tenth lesson" },
    ]);
  });
});

describe("getLesson", () => {
  test("returns the Lesson with its text rendered as HTML", async () => {
    const lesson = await lessons.getLesson("second");
    expect(lesson?.title).toBe("Second lesson");
    expect(lesson?.number).toBe(2);
    expect(lesson?.html).toContain("<h2>Hello</h2>");
    expect(lesson?.html).toContain("<strong>bold</strong>");
  });

  test("returns null for a slug that doesn't exist", async () => {
    expect(await lessons.getLesson("nope")).toBeNull();
  });
});

describe("getLesson neighbours", () => {
  test("a middle Lesson links to the one before and after it", async () => {
    const lesson = await lessons.getLesson("second");
    expect(lesson?.previous).toEqual({ number: 1, slug: "first", title: "First lesson" });
    expect(lesson?.next).toEqual({ number: 10, slug: "tenth", title: "Tenth lesson" });
  });

  test("the first Lesson has no previous, the last has no next", async () => {
    expect((await lessons.getLesson("first"))?.previous).toBeNull();
    expect((await lessons.getLesson("tenth"))?.next).toBeNull();
  });
});

describe("lessonExists", () => {
  test("is true for a real slug and false for an unknown one", async () => {
    expect(await lessons.lessonExists("tenth")).toBe(true);
    expect(await lessons.lessonExists("nope")).toBe(false);
  });
});

describe("broken Lesson files", () => {
  test("a Lesson without a title fails loudly, naming the file", async () => {
    const broken = lessonsFrom(path.join(fixtures, "missing-title"));
    await expect(broken.listLessons()).rejects.toThrow("oops.md: missing title");
  });
});
