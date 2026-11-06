import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import LessonPage from "./page";

// The page reads the valid fixture instead of content/: a Course with Parts
// and a Course without, and Lessons with and without a photo.
vi.mock(import("@/lessons/lessons"), async (importOriginal) => {
  const lessons = await importOriginal();
  return { ...lessons, courses: lessons.coursesFrom(`${process.cwd()}/src/lessons/__fixtures__/valid`) };
});

async function lessonPage(slug: string) {
  const page = await LessonPage({ params: Promise.resolve({ slug }), searchParams: Promise.resolve({}) });
  return renderToStaticMarkup(page);
}

// The page's header band, from its opening tag to its closing one.
const hero = (html: string) => /<header class="photo-band lesson-hero"[\s\S]*?<\/header>/.exec(html)?.[0] ?? "";

const card = (html: string, side: "prev" | "next") =>
  new RegExp(`<a class="lesson-card ${side}"[\\s\\S]*?</a>`).exec(html)?.[0] ?? "";

test("a Lesson with a photo shows it and its credit in the header, linked to its source", async () => {
  const header = hero(await lessonPage("setup"));
  expect(header).toContain('<div class="photo-band-photo">');
  expect(header).toContain(
    '<p class="photo-credit">Image: <a href="https://commons.wikimedia.org/wiki/File:Two_hikers_on_a_ridge.jpg">Bo Shutter · CC BY-SA 4.0</a></p>',
  );
});

test("the header's breadcrumb links the Lesson's Course, then its Part on the Course's page", async () => {
  const header = hero(await lessonPage("setup"));
  expect(header).toContain(
    '<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/courses/with-parts">With parts</a></li><li><a href="/courses/with-parts#part-1">Getting started</a></li></ol></nav>',
  );
  expect(header).toContain("<span>Lesson 2 of 3</span>");
  expect(header).toContain('<p class="lesson-hero-lead">Get everything installed.</p>');
});

test("a Lesson without a photo gets its Course's navy picture, numbered, and no credit", async () => {
  const header = hero(await lessonPage("deploy"));
  expect(header).not.toContain("photo-band-photo");
  expect(header).not.toContain("photo-credit");
  expect(header).toContain('<span class="art photo-band-art" style="--tone:#4f74ff" aria-hidden="true"><span class="art-numeral">03</span></span>');
  expect(header).toContain("<h1>Deploy</h1>");
});

test("Done isn't decided on the server: the header has no Done pill, and progress fills in in the browser", async () => {
  expect(hero(await lessonPage("setup"))).not.toContain("done-pill");
});

test("as a neighbour, a Lesson without a photo gets its Course's picture, with a corner for the Done tick", async () => {
  const html = await lessonPage("setup");
  // welcome has a photo; deploy doesn't.
  expect(card(html, "prev")).toContain("<img");
  expect(card(html, "next")).toContain("Deploy");
  expect(card(html, "next")).toContain('<span class="art"');
  expect(card(html, "next")).toContain('data-tick-slot="deploy"');
});

test("after a Course's last Lesson, Next goes to the next Course's first Lesson, in that Course's colour", async () => {
  const html = await lessonPage("deploy");
  expect(card(html, "next")).toContain('href="/learn/aside"');
  expect(card(html, "next")).toContain("Next Course · Lesson 1");
  expect(card(html, "prev")).toContain('href="/learn/setup"');
});

test("a Lesson in a Course without Parts shows no Part, and has no Previous at its Course's start", async () => {
  const html = await lessonPage("aside");
  expect(hero(html)).toContain('<ol><li><a href="/courses/without-parts">Without parts</a></li></ol>');
  expect(html).not.toContain('class="lesson-card prev"');
  expect(html).toContain('<a class="lesson-card next" href="/learn/recap">');
});

test("the very last Lesson has no Next", async () => {
  const html = await lessonPage("recap");
  expect(html).not.toContain('class="lesson-card next"');
  expect(html).toContain('<a class="lesson-card prev" href="/learn/aside">');
});

test("every Lesson keeps its Discussion", async () => {
  expect(await lessonPage("deploy")).toContain('<section class="discussion" aria-label="Discussion"');
});
