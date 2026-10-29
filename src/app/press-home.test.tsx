import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { lessons } from "@/lessons/lessons";
import Home from "./page";

// Opening tags of every anchor in `html`, in document order.
function anchors(html: string): string[] {
  return html.match(/<a\b[^>]*>/g) ?? [];
}

function hrefOf(tag: string): string | null {
  return tag.match(/href="([^"]*)"/)?.[1] ?? null;
}

// The Lesson index entries: anchors rendered by LessonCard.
function lessonCardHrefs(html: string): string[] {
  return anchors(html)
    .filter((tag) => tag.includes('class="lesson-card'))
    .map((tag) => hrefOf(tag))
    .filter((href): href is string => href !== null);
}

describe("home journal index", async () => {
  const all = await lessons.listLessons();
  const html = renderToStaticMarkup(await Home());

  test("renders all 20 Lesson links", () => {
    expect(all).toHaveLength(20);
    const hrefs = lessonCardHrefs(html);
    expect(hrefs).toHaveLength(20);
    expect(hrefs).toEqual(all.map((lesson) => `/learn/${lesson.slug}`));
  });

  test("groups Lesson links by Part headings", () => {
    // Every Lesson has a Part, so the index renders one group per Part.
    const parts = [...new Map(all.map((lesson) => [lesson.part!.number, lesson.part!])).values()].sort(
      (a, b) => a.number - b.number,
    );
    expect(parts).toHaveLength(4);

    // Headings appear in Part order, each as "Part N" over its title.
    let previousIndex = -1;
    for (const part of parts) {
      const heading = `Part ${part.number}`;
      const headingIndex = html.indexOf(heading);
      expect(headingIndex).toBeGreaterThan(previousIndex);
      expect(html).toContain(`<h3 id="part-${part.number}">${part.title}</h3>`);
      previousIndex = headingIndex;
    }

    // Each Part group holds exactly that Part's Lesson links, in course order.
    const groups = html.split('<section class="part-group"').slice(1);
    expect(groups).toHaveLength(parts.length);
    groups.forEach((group, i) => {
      const expected = all
        .filter((lesson) => lesson.part!.number === parts[i].number)
        .map((lesson) => `/learn/${lesson.slug}`);
      expect(lessonCardHrefs(group)).toEqual(expected);
    });
  });

  test("renders no photo or hero markup", () => {
    expect(html).not.toContain("<img");
    expect(html.toLowerCase()).not.toContain("hero");
  });

  test("offers a start-course link to the first Lesson", () => {
    const first = all[0];
    const startLinks = anchors(html).filter(
      (tag) => hrefOf(tag) === `/learn/${first.slug}` && tag.includes('class="button"'),
    );
    expect(startLinks.length).toBeGreaterThan(0);
    expect(html).toContain(`Start with Lesson ${first.number}`);
  });
});
