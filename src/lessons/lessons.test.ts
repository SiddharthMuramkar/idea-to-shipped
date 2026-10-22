import path from "node:path";
import { describe, expect, test } from "vitest";
import { lessonsFrom } from "./lessons";

const fixtures = path.join(__dirname, "__fixtures__");
const lessons = lessonsFrom(path.join(fixtures, "valid"));

// The fixture Lessons as the module should hand them out.
const first = {
  number: 1,
  slug: "first",
  title: "First lesson",
  image: "/photos/first.jpg",
  imageAlt: "A lighthouse at dawn.",
  imageCredit: "Ada Lens",
};
const second = {
  number: 2,
  slug: "second",
  title: "Second lesson",
  image: "/photos/second.jpg",
  imageAlt: "Two hikers on a ridge: one points ahead.",
  imageCredit: "Bo Shutter",
};
const tenth = {
  number: 10,
  slug: "tenth",
  title: "Tenth lesson",
  image: "/photos/tenth.jpg",
  imageAlt: "A rocket on the launch pad.",
  imageCredit: "Cy Aperture",
};

describe("listLessons", () => {
  test("returns every Lesson ordered by its number, not by file name", async () => {
    expect(await lessons.listLessons()).toEqual([first, second, tenth]);
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

  test("returns the Lesson's photo, its alt text and its credit", async () => {
    const lesson = await lessons.getLesson("second");
    expect(lesson?.image).toBe("/photos/second.jpg");
    expect(lesson?.imageAlt).toBe("Two hikers on a ridge: one points ahead.");
    expect(lesson?.imageCredit).toBe("Bo Shutter");
  });

  test("returns null for a slug that doesn't exist", async () => {
    expect(await lessons.getLesson("nope")).toBeNull();
  });
});

describe("getLesson neighbours", () => {
  test("a middle Lesson links to the one before and after it, photos included", async () => {
    const lesson = await lessons.getLesson("second");
    expect(lesson?.previous).toEqual(first);
    expect(lesson?.next).toEqual(tenth);
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

  test.each([
    ["missing-image", "no-photo.md: missing image"],
    ["missing-image-alt", "no-alt.md: missing imageAlt"],
    ["missing-image-credit", "no-credit.md: missing imageCredit"],
  ])("a Lesson in %s fails loudly, naming the file", async (folder, message) => {
    const broken = lessonsFrom(path.join(fixtures, folder));
    await expect(broken.listLessons()).rejects.toThrow(message);
  });
});
