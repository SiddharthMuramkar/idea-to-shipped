import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import Credits from "./page";

// The page reads the valid fixture instead of content/: two Courses, with
// Lessons with and without a photo.
vi.mock(import("@/lessons/lessons"), async (importOriginal) => {
  const lessons = await importOriginal();
  return { ...lessons, courses: lessons.coursesFrom(`${process.cwd()}/src/lessons/__fixtures__/valid`) };
});

test("lists the photo of every Lesson that has one, in every Course, and skips the rest", async () => {
  const html = renderToStaticMarkup(await Credits());
  const lessonPhotos = /<h2>Lesson photos<\/h2>([\s\S]*?)<h2>/.exec(html)?.[1] ?? "";
  const linked = [...lessonPhotos.matchAll(/href="\/learn\/([^"]+)"/g)].map(([, slug]) => slug);
  expect(linked).toEqual(["welcome", "setup", "aside"]);
  expect(lessonPhotos).toContain('<span class="credit-by">Photo by Cy Aperture on Unsplash</span>');
});
