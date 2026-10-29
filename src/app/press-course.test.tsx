import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { lessons } from "@/lessons/lessons";
import LessonPage from "./learn/[slug]/page";

// Press course coverage: every Lesson page, server-rendered only (no DB, no
// env files, no network). One render per Lesson carries all four checks, so
// the file stays fast: the article renders, its <h1> is the summary title,
// no photo markup leaks, and every internal /learn/<slug> link resolves.

// The text a reader sees in a fragment of rendered HTML: tags dropped, the
// entities React emits decoded (& in a title arrives as &amp;, ' as &#x27;).
function textOf(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Every /learn/<slug> target linked from `html`, in document order.
function learnTargets(html: string): string[] {
  return [...html.matchAll(/href="\/learn\/([^"#?/]+)/g)].map((match) => match[1]);
}

describe("Press course: every Lesson page", async () => {
  const summaries = await lessons.listLessons();
  const slugs = new Set(summaries.map((lesson) => lesson.slug));

  test("the course has 20 Lessons with unique slugs", () => {
    expect(summaries).toHaveLength(20);
    expect(slugs.size).toBe(20);
  });

  test.each(summaries)(
    "$slug renders its article under its summary title, with no photo markup and only live Lesson links",
    async (summary) => {
      const page = await LessonPage({
        params: Promise.resolve({ slug: summary.slug }),
      } as Parameters<typeof LessonPage>[0]);
      const html = renderToStaticMarkup(page);

      // The article renders, on the page for this Lesson.
      expect(html).toContain('<article class="lesson-article">');
      expect(html).toContain(`data-lesson="${summary.slug}"`);

      // The rendered title is the summary's title.
      const heading = /<h1>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "";
      expect(textOf(heading)).toBe(summary.title);

      // Press renders no photos: no image element, no photo asset or band.
      expect(html).not.toContain("<img");
      expect(html).not.toContain("/photos/");
      expect(html).not.toContain("photo-band");
      expect(html).not.toMatch(/class="[^"]*photo/);

      // Every internal Lesson link points at a Lesson that exists. The
      // Previous/Next cards guarantee at least one target per page, so
      // this check is never vacuous.
      const targets = learnTargets(html);
      expect(targets.length).toBeGreaterThan(0);
      expect(targets.filter((target) => !slugs.has(target))).toEqual([]);
    },
  );
});
