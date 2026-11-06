import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import Credits from "./page";

// The page reads the valid fixture instead of content/: two Courses, one with
// its own image, and Lessons with and without one, credited in its manifest
// except for one. The manifest also credits the home page's top photo.
vi.mock(import("@/lessons/lessons"), async (importOriginal) => {
  const lessons = await importOriginal();
  return { ...lessons, courses: lessons.coursesFrom(`${process.cwd()}/src/lessons/__fixtures__/valid`) };
});

async function groups() {
  const html = renderToStaticMarkup(await Credits());
  return [...html.matchAll(/<section class="credit-group"[\s\S]*?<\/section>/g)].map(([group]) => ({
    heading: /<h2[^>]*>(?:<a[^>]*>)?([^<]+)/.exec(group)?.[1],
    items: group.match(/<li class="credit">[\s\S]*?<\/li>/g) ?? [],
  }));
}

test("lists the home page's own photo, then every Course's images under the Course's name", async () => {
  expect((await groups()).map(({ heading, items }) => [heading, items.length])).toEqual([
    ["Home page", 1],
    ["With parts", 3],
    ["Without parts", 1],
  ]);
});

test("each image has a thumbnail and says where it's used", async () => {
  const [, withParts] = await groups();
  expect(withParts.items.every((item) => item.includes("<img"))).toBe(true);
  expect(withParts.items.map((item) => /Used on: [\s\S]*?<a href="([^"]+)"/.exec(item)?.[1])).toEqual([
    "/courses/with-parts",
    "/learn/welcome",
    "/learn/setup",
  ]);
});

test("credits each image's title, linked to its source, its author, its licence (linked when it has an address) and its source", async () => {
  const [, withParts] = await groups();
  const [trail, , hikers] = withParts.items;
  expect(hikers).toContain(
    '<a href="https://commons.wikimedia.org/wiki/File:Two_hikers_on_a_ridge.jpg" class="credit-title">Two hikers on a ridge</a><span class="credit-by">By Bo Shutter · <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a> · Source: <a href="https://commons.wikimedia.org/wiki/File:Two_hikers_on_a_ridge.jpg">commons.wikimedia.org</a></span>',
  );
  expect(trail).toContain('<span class="credit-by">By Di Atlas · CC0 · Source: ');
});

test("an image without a credit still shows, marked as waiting for one", async () => {
  const [, , withoutParts] = await groups();
  expect(withoutParts.items[0]).toContain('<span class="credit-by">Credit to come.</span>');
});
