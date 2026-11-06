import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import Credits from "./page";

// The page reads the valid fixture instead of content/: two Courses, one with
// its own image, and Lessons with and without one, credited in its manifest
// except for one.
vi.mock(import("@/lessons/lessons"), async (importOriginal) => {
  const lessons = await importOriginal();
  return { ...lessons, courses: lessons.coursesFrom(`${process.cwd()}/src/lessons/__fixtures__/valid`) };
});

async function headerImages() {
  const html = renderToStaticMarkup(await Credits());
  return /<h2>Course and Lesson images<\/h2>([\s\S]*?)<h2>/.exec(html)?.[1] ?? "";
}

test("lists every image a Course or Lesson header uses, and where it shows", async () => {
  const list = await headerImages();
  const items = list.match(/<li class="credit">[\s\S]*?<\/li>/g) ?? [];
  expect(items.map((item) => /class="credit-lesson"[^>]*>([^<]+)</.exec(item)?.[1])).toEqual([
    "With parts",
    "With parts: Welcome",
    "With parts: Setup",
    "Without parts: An aside",
  ]);
  expect(items.every((item) => item.includes("<img"))).toBe(true);
  expect([...list.matchAll(/href="\/learn\/([^"]+)"/g)].map(([, slug]) => slug)).toEqual(["welcome", "setup", "aside"]);
});

test("credits each image's title, linked to its source, its author and its licence, linked when it has an address", async () => {
  const list = await headerImages();
  expect(list).toContain(
    '<span class="credit-by"><a href="https://commons.wikimedia.org/wiki/File:Two_hikers_on_a_ridge.jpg">Two hikers on a ridge</a> by Bo Shutter, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a></span>',
  );
  expect(list).toContain(
    '<span class="credit-by"><a href="https://commons.wikimedia.org/wiki/File:Trail_map.jpg">Trail map</a> by Di Atlas, CC0</span>',
  );
});

test("an image without a credit still shows, marked as waiting for one", async () => {
  const aside = /<li class="credit">(?:(?!<\/li>)[\s\S])*An aside[\s\S]*?<\/li>/.exec(await headerImages())?.[0] ?? "";
  expect(aside).toContain('<span class="credit-by">Credit to come.</span>');
});
