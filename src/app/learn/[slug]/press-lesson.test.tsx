import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, test } from "vitest";
import { lessons, type Lesson } from "@/lessons/lessons";
import LessonPage from "./page";

// Press Lesson pages for two real Lessons, rendered whole (header, article
// and Previous/Next) to static HTML: no database, no env files, no network.
// The Discussion only fetches inside an effect, so it never runs here.
//
// - `grilling` is the Scene-heavy pick: a flow Scene and a chat Scene sit
//   in-flow between long prose Sections.
// - `retro` is the prose-heavy pick: the longest running text of the
//   two-Scene Lessons, with the smallest Scene payload.

type PressCase = {
  slug: string;
  title: string;
  previousSlug: string;
  previousTitle: string;
  nextSlug: string;
  nextTitle: string;
  sectionTitles: string[];
};

const CASES: PressCase[] = [
  {
    slug: "grilling",
    title: "Grilling",
    previousSlug: "skills",
    previousTitle: "Skills",
    nextSlug: "domain-modeling",
    nextTitle: "Domain modeling",
    sectionTitles: [
      "Why it matters",
      "The idea: a tree of decisions, asked in rounds",
      "Which grilling Skill to type",
      "A session, step by step",
      "Your half of the interview",
      "What comes next",
      "How Matt and others use it",
      "Try it yourself",
      "Common mistakes",
      "Cheat sheet",
      "Final test",
    ],
  },
  {
    slug: "retro",
    title: "Retro",
    previousSlug: "architecture",
    previousTitle: "Architecture",
    nextSlug: "wayfinder",
    nextTitle: "Wayfinder",
    sectionTitles: [
      "Why it matters",
      "The idea: fix the environment, not the code",
      "A real retro, step by step",
      "Your part: when to run it, and how to judge the list",
      "Steering files, and why Matt never runs /init",
      "Writing for agents: the reference /retro loads",
      "How Matt and others use it",
      "Try it yourself",
      "Common mistakes",
      "Cheat sheet",
      "Final test",
    ],
  },
];

async function renderLessonPage(slug: string): Promise<string> {
  const element = await LessonPage({
    params: Promise.resolve({ slug }),
    searchParams: Promise.resolve({}),
  });
  return renderToStaticMarkup(element);
}

function occurrences(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0;
}

for (const pressCase of CASES) {
  describe(`Press Lesson page: ${pressCase.slug} (${pressCase.title})`, () => {
    let lesson: Lesson;
    let html: string;

    beforeAll(async () => {
      const found = await lessons.getLesson(pressCase.slug);
      expect(found, `real Lesson missing: ${pressCase.slug}`).not.toBeNull();
      lesson = found!;
      html = await renderLessonPage(pressCase.slug);
    });

    test("names the expected Lesson and neighbours in course order", () => {
      expect(lesson.slug).toBe(pressCase.slug);
      expect(lesson.title).toBe(pressCase.title);
      expect(lesson.previous?.slug).toBe(pressCase.previousSlug);
      expect(lesson.previous?.title).toBe(pressCase.previousTitle);
      expect(lesson.next?.slug).toBe(pressCase.nextSlug);
      expect(lesson.next?.title).toBe(pressCase.nextTitle);
      expect(lesson.sections.map((section) => section.title)).toEqual(pressCase.sectionTitles);
    });

    test("renders a single article and exactly one h1 naming the Lesson", () => {
      expect(occurrences(html, /<article\b/g)).toBe(1);
      expect(html).toContain('<article class="lesson-article">');
      expect(html).toContain(`data-lesson="${pressCase.slug}"`);
      expect(occurrences(html, /<h1\b/g)).toBe(1);
      expect(html).toContain(`<h1>${pressCase.title}</h1>`);
    });

    test("renders every Section once, in written order", () => {
      expect(occurrences(html, /data-section\b/g)).toBe(pressCase.sectionTitles.length);
      const positions = lesson.sections.map((section) => html.indexOf(`id="${section.id}"`));
      for (const position of positions) expect(position).toBeGreaterThanOrEqual(0);
      for (let i = 1; i < positions.length; i++) {
        expect(positions[i], `Section out of order: ${lesson.sections[i].title}`).toBeGreaterThan(positions[i - 1]);
      }
      // Each Section's heading travels with its own Section, not an earlier
      // mention of the same words in the intro or goals.
      lesson.sections.forEach((section, i) => {
        const end = positions[i + 1] ?? html.indexOf('class="discussion"');
        const slice = html.slice(positions[i], end === -1 ? undefined : end);
        expect(slice).toContain(section.titleHtml);
      });
    });

    test("shows the goals band in the intro, before the first Section", () => {
      const goals = lesson.intro.find((block) => block.type === "goals");
      if (!goals || goals.type !== "goals") throw new Error(`${pressCase.slug}: no goals block in the intro`);
      expect(goals.itemsHtml).toHaveLength(4);
      expect(html).toContain('data-goals');
      expect(html).toContain("By the end of this Lesson");
      for (const itemHtml of goals.itemsHtml) expect(html).toContain(itemHtml);
      const goalsAt = html.indexOf("data-goals");
      const firstSectionAt = html.indexOf(`id="${lesson.sections[0].id}"`);
      expect(goalsAt).toBeGreaterThanOrEqual(0);
      expect(goalsAt).toBeLessThan(firstSectionAt);
      const intro = html.slice(goalsAt, firstSectionAt);
      expect(occurrences(intro, /<li class="goal">/g)).toBe(goals.itemsHtml.length);
    });

    test("ends with ruled Previous/Next links naming the neighbouring Lessons", () => {
      expect(html).toContain('<nav class="prev-next" aria-label="More Lessons">');
      const navAt = html.indexOf('<nav class="prev-next"');
      const nav = html.slice(navAt, html.indexOf("</nav>", navAt));
      expect(nav).toContain('class="lesson-card prev"');
      expect(nav).toContain('class="lesson-card next"');
      expect(nav).toContain(`href="/learn/${pressCase.previousSlug}"`);
      expect(nav).toContain(`href="/learn/${pressCase.nextSlug}"`);
      expect(nav).toContain('<span class="lesson-card-label">Previous</span>');
      expect(nav).toContain('<span class="lesson-card-label">Next</span>');
      expect(nav).toContain(`<span class="lesson-card-title">${pressCase.previousTitle}</span>`);
      expect(nav).toContain(`<span class="lesson-card-title">${pressCase.nextTitle}</span>`);
      // Reading order: the article closes before the links, Previous first.
      expect(html.indexOf("</article>")).toBeLessThan(navAt);
      expect(nav.indexOf(`href="/learn/${pressCase.previousSlug}"`)).toBeLessThan(
        nav.indexOf(`href="/learn/${pressCase.nextSlug}"`),
      );
    });

    test("has no photo-band or img hero markup", () => {
      expect(html).not.toContain("photo-band");
      expect(html).not.toContain("photo-card");
      expect(html).not.toContain("/photos/");
      expect(html).not.toMatch(/<img[\s>]/);
      const hero = html.slice(html.indexOf('<header class="lesson-hero">'), html.indexOf("</header>"));
      expect(hero).toContain(`<h1>${pressCase.title}</h1>`);
      expect(hero).not.toMatch(/<img[\s>]/);
      expect(hero).not.toContain("photo-band");
    });
  });
}

describe("Press Lesson Scenes in-flow", () => {
  test("grilling keeps its flow and chat Scenes inside the single article", async () => {
    const html = await renderLessonPage("grilling");
    const article = html.slice(html.indexOf('<article class="lesson-article">'), html.indexOf("</article>"));
    expect(occurrences(article, /data-scene-run\b/g)).toBe(2);
    expect(article).toContain('data-scene="flow"');
    expect(article).toContain('data-scene="chat"');
  });
});
