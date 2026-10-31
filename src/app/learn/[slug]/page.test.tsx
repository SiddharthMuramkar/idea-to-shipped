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

test("a Lesson with a photo shows it and its credit in the header, under its Part", async () => {
  const header = hero(await lessonPage("setup"));
  expect(header).toContain('<div class="photo-band-photo">');
  expect(header).toContain('<p class="photo-credit">Photo: Bo Shutter / Unsplash</p>');
  expect(header).toContain("<span>Part 1 · Getting started</span>");
});

test("a Lesson without a photo has no photo or credit in its header", async () => {
  const header = hero(await lessonPage("deploy"));
  expect(header).not.toContain("photo-band-photo");
  expect(header).not.toContain("photo-credit");
  expect(header).toContain("<h1>Deploy</h1>");
});

test("as a neighbour, a Lesson without a photo gets a card without one", async () => {
  const html = await lessonPage("setup");
  const card = (side: "prev" | "next") => new RegExp(`<a class="lesson-card ${side}"[\\s\\S]*?</a>`).exec(html)?.[0] ?? "";
  // welcome has a photo; deploy doesn't.
  expect(card("prev")).toContain("lesson-card-photo");
  expect(card("next")).toContain("Deploy");
  expect(card("next")).not.toContain("lesson-card-photo");
});

test("a Lesson in a Course without Parts shows no Part, and its neighbours come from its own Course", async () => {
  const html = await lessonPage("aside");
  expect(hero(html)).not.toContain("Part ");
  expect(html).not.toContain('class="lesson-card prev"');
  expect(html).toContain('<a class="lesson-card next" href="/learn/recap">');
});
