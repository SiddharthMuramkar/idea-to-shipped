import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import Home from "./page";

// The home page reads the valid fixture instead of content/: two Courses,
// the first with a photo of its own, and a manifest that credits the home
// page's top photo but not its closing one.
vi.mock(import("@/lessons/lessons"), async (importOriginal) => {
  const lessons = await importOriginal();
  return { ...lessons, courses: lessons.coursesFrom(`${process.cwd()}/src/lessons/__fixtures__/valid`) };
});

const home = async () => renderToStaticMarkup(await Home());

test("lists every Course as a card, in order, linking to its page, with its length and a place for progress", async () => {
  const cards = (await home()).match(/<a class="course-card"[\s\S]*?<\/a>/g) ?? [];
  expect(cards.map((card) => /href="([^"]+)"/.exec(card)?.[1])).toEqual(["/courses/with-parts", "/courses/without-parts"]);
  expect(cards[0]).toContain('<span class="course-card-title">With parts</span>');
  expect(cards[0]).toContain('<span class="course-card-description">Getting started, then shipping.</span>');
  expect(cards[0]).toContain("3 Lessons · ");
  // Progress is read in the browser: on the server it holds its place, unseen.
  expect(cards[0]).toContain('<span class="course-progress" style="--done:0">');
});

test("a Course without a photo gets its navy picture in its own colour", async () => {
  const [, second] = (await home()).match(/<a class="course-card"[\s\S]*?<\/a>/g) ?? [];
  expect(second).toContain('<span class="art" style="--tone:#14b8a6" aria-hidden="true"><span class="art-numeral">02</span></span>');
});

test("explains how a Lesson works, from reading to Done", async () => {
  const strip = /<ol class="how-steps"[\s\S]*?<\/ol>/.exec(await home())?.[0] ?? "";
  expect([...strip.matchAll(/<h3>([^<]+)/g)].map(([, title]) => title)).toEqual(["Read", "Quick checks", "Final test", "Done"]);
  expect(strip).toContain("(optional)");
});

test("the top band uses the home page's own photo once it's credited", async () => {
  const band = /<section class="photo-band home-hero"[\s\S]*?<\/section>/.exec(await home())?.[0] ?? "";
  expect(band).toContain("hero.jpg");
  expect(band).toContain('Image: <a href="https://commons.wikimedia.org/wiki/File:Reading_room_at_night.jpg">Cy Stacks · CC BY 4.0</a>');
});

test("the closing band falls back to a Course's photo while its own isn't credited", async () => {
  const band = /<section class="photo-band home-cta"[\s\S]*?<\/section>/.exec(await home())?.[0] ?? "";
  expect(band).toContain("with-parts.jpg");
  expect(band).toContain("Di Atlas · CC0");
});

test("Continue where you left off waits for the browser: nothing is Done on the server", async () => {
  expect(await home()).not.toContain("Continue where you left off");
});
