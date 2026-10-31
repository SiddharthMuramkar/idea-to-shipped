import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import { loadHomeCourse } from "@/app/home-course";
import { coursesFrom } from "@/lessons/lessons";
import Home from "./page";

vi.mock(import("@/app/home-course"), () => ({ loadHomeCourse: vi.fn() }));

// The valid fixture: a Course with Parts and a Course without, and Lessons
// with and without a photo.
const fixture = coursesFrom(path.join(process.cwd(), "src/lessons/__fixtures__/valid"));

async function homeShowing(slug: string) {
  vi.mocked(loadHomeCourse).mockResolvedValue((await fixture.getCourse(slug))!);
  return renderToStaticMarkup(await Home());
}

test("a Course with Parts lists its Lessons under a heading per Part", async () => {
  const html = await homeShowing("with-parts");
  const parts = html.match(/<section class="part-group"[\s\S]*?<\/section>/g) ?? [];
  // Each Part's heading, and how many Lesson cards sit under it.
  const headings = parts.map((part) => [
    /<span class="part-number">(Part \d+)<\/span> ([^<]+)/.exec(part)?.slice(1),
    part.match(/class="lesson-card /g)?.length,
  ]);
  expect(headings).toEqual([
    [["Part 1", "Getting started"], 2],
    [["Part 2", "Shipping"], 1],
  ]);
});

test("a Course without Parts lists its Lessons as one grid, with no Part headings", async () => {
  const html = await homeShowing("without-parts");
  expect(html).not.toContain("part-group");
  expect(html.match(/<ol class="lesson-grid"/g)).toHaveLength(1);
  expect(html.match(/class="lesson-card /g)).toHaveLength(2);
});

test("a Lesson without a photo gets a card without one, tick slot included", async () => {
  const html = await homeShowing("without-parts");
  const cards = html.match(/<a class="lesson-card [\s\S]*?<\/a>/g) ?? [];
  expect(cards.map((card) => card.includes("lesson-card-photo"))).toEqual([true, false]);
  expect(cards[1]).not.toContain("data-tick-slot");
});
