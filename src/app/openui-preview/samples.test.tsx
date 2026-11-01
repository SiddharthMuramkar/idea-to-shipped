import { expect, test } from "vitest";
import { createParser, type Library } from "@openuidev/react-lang";
import { openuiLibrary } from "@openuidev/react-ui/genui-lib";
import type { Course } from "@/lessons/lessons";
import { previewLibrary } from "./library";
import { chartLang, customCardsLang, flowLang, lessonsLang, quizLang } from "./samples";

// Server-render project (see vitest.config.mts): these check the Lang string
// builders only. The Renderer itself needs a browser, so panel rendering is
// verified manually and through the production build, not here.
const course: Course = {
  slug: "test-course",
  title: "Test course",
  parts: [
    { number: 1, title: "Start" },
    { number: 2, title: "Ship" },
  ],
  lessons: [
    { number: 1, slug: "one", title: "First `quoted` lesson", photo: null, part: { number: 1, title: "Start" }, minutes: 5 },
    { number: 2, slug: "two", title: 'Second "loud" lesson', photo: null, part: { number: 1, title: "Start" }, minutes: 7 },
    { number: 3, slug: "three", title: "Third lesson", photo: null, part: { number: 2, title: "Ship" }, minutes: 3 },
  ],
};

test("every sample starts at root = Stack(...) and references its title", () => {
  for (const lang of [flowLang(), lessonsLang(course), quizLang(), chartLang(course), customCardsLang(course)]) {
    expect(lang.startsWith("root = Stack(")).toBe(true);
    expect(lang).toContain("title = TextContent(");
  }
});

test("the lessons table carries real titles, escaped for Lang strings", () => {
  const lang = lessonsLang(course);
  expect(lang).toContain("1. First `quoted` lesson");
  // A raw double quote would end the Lang string early; it must be escaped.
  expect(lang).toContain('Second \\"loud\\" lesson');
  expect(lang).toContain("minutes = [5, 7, 3]");
});

test("the chart aggregates minutes and counts per Part", () => {
  const lang = chartLang(course);
  expect(lang).toContain('labels = ["Part 1", "Part 2"]');
  expect(lang).toContain('Series("Reading minutes", [12, 3])');
  expect(lang).toContain("counts = [2, 1]");
});

test("every sample parses with no validation errors or orphaned statements", () => {
  const cases: [string, Library][] = [
    [flowLang(), openuiLibrary],
    [lessonsLang(course), openuiLibrary],
    [quizLang(), openuiLibrary],
    [chartLang(course), openuiLibrary],
    [customCardsLang(course), previewLibrary],
  ];
  for (const [lang, library] of cases) {
    const result = createParser(library.toJSONSchema()).parse(lang);
    expect(result.root).not.toBeNull();
    expect(result.meta.errors).toEqual([]);
    expect(result.meta.orphaned).toEqual([]);
    expect(result.meta.unresolved).toEqual([]);
  }
});

test("the custom cards link to real lesson slugs", () => {
  const lang = customCardsLang(course);
  expect(lang).toContain('SiteLessonCard("Third lesson", "Lesson 3 · 3 min read", "/learn/three")');
});
