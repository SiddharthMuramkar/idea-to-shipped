import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import CoursePage, { generateStaticParams } from "./page";

// The page reads the valid fixture instead of content/: a Course with Parts
// and a photo, and a Course without either.
vi.mock(import("@/lessons/lessons"), async (importOriginal) => {
  const lessons = await importOriginal();
  return { ...lessons, courses: lessons.coursesFrom(`${process.cwd()}/src/lessons/__fixtures__/valid`) };
});

async function coursePage(course: string) {
  const page = await CoursePage({ params: Promise.resolve({ course }), searchParams: Promise.resolve({}) });
  return renderToStaticMarkup(page);
}

const hero = (html: string) => /<header class="photo-band course-hero"[\s\S]*?<\/header>/.exec(html)?.[0] ?? "";

test("there's a page for every Course", async () => {
  expect(await generateStaticParams()).toEqual([{ course: "with-parts" }, { course: "without-parts" }]);
});

test("the band shows the Course's photo, place, description and length, and starts at its first Lesson", async () => {
  const band = hero(await coursePage("with-parts"));
  expect(band).toContain("with-parts.jpg");
  expect(band).toContain("Course 1 of 2");
  expect(band).toContain("<h1>With parts</h1>");
  expect(band).toContain('<p class="course-hero-lead">Getting started, then shipping.</p>');
  expect(band).toContain('<a class="button button-light" href="/learn/welcome">Start the Course</a>');
});

test("its Lessons sit under a heading per Part, each card with its summary and a corner for the Done tick", async () => {
  const html = await coursePage("with-parts");
  const parts = html.match(/<section class="part-group"[\s\S]*?<\/section>/g) ?? [];
  expect(
    parts.map((part) => [
      /<span class="part-number">(Part \d+)<\/span> ([^<]+)/.exec(part)?.slice(1),
      part.match(/class="lesson-card /g)?.length,
    ]),
  ).toEqual([
    [["Part 1", "Getting started"], 2],
    [["Part 2", "Shipping"], 1],
  ]);
  expect(parts[0]).toContain('id="part-1"');
  expect(parts[0]).toContain('<span class="lesson-card-summary">Where the Course starts.</span>');
  expect(parts[0]).toContain('data-tick-slot="welcome"');
});

test("a Course without Parts lists its Lessons as one grid, and a Course without a photo gets its navy picture", async () => {
  const html = await coursePage("without-parts");
  expect(html).not.toContain("part-group");
  expect(html.match(/<ol class="lesson-grid"/g)).toHaveLength(1);
  expect(hero(html)).toContain('<span class="art photo-band-art" style="--tone:#14b8a6" aria-hidden="true">');
});

test("the next Course follows the last Lesson; the last Course says it's the last", async () => {
  const first = await coursePage("with-parts");
  expect(/<section class="band-light next-course"[\s\S]*?<\/section>/.exec(first)?.[0]).toContain(
    'href="/courses/without-parts"',
  );
  expect(await coursePage("without-parts")).toContain("This is the last Course in the library.");
});
