import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { allBlocks, courses, coursesFrom, type Scene } from "@/lessons/lessons";
import { SceneRun } from "./scene";
import { LessonArticle } from "./section";

describe("every Lesson of every Course in content/", async () => {
  const all = await courses.listLessons();

  test.each(all.map((lesson) => [lesson.slug]))("%s renders", async (slug) => {
    const lesson = (await courses.getLesson(slug))!;
    const html = renderToStaticMarkup(<LessonArticle lesson={lesson} />);
    expect(html).toContain('<article class="lesson-article">');
  });
});

describe("the newer blocks", () => {
  const full = coursesFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));
  const article = async () => renderToStaticMarkup(<LessonArticle lesson={(await full.getLesson("full"))!} />);

  test("a remember callout is a callout with its own label", async () => {
    const box = /<aside class="callout callout--remember"[\s\S]*?<\/aside>/.exec(await article())?.[0] ?? "";
    expect(box).toContain("Remember</p>");
    expect(box).toContain("Grill first, then <strong>build</strong>.");
  });

  test("flashcards show both sides of every card until the page's code turns them into cards to flip", async () => {
    const cards = (await article()).match(/<li class="flashcard">[\s\S]*?<\/li>/g) ?? [];
    expect(cards).toEqual([
      '<li class="flashcard"><p class="flashcard-front"><strong>What does grilling produce?</strong></p><p class="flashcard-back">Decisions, not code.</p></li>',
      '<li class="flashcard"><p class="flashcard-front"><strong>Who owns the <code>details</code>?</strong></p><p class="flashcard-back">The agent.</p></li>',
    ]);
    expect(await article()).not.toContain("flip-card");
  });

  test("a diagram shows its caption", async () => {
    expect(await article()).toContain("Grill, then build.");
  });
});

describe("the margin for Quick checks", () => {
  const full = coursesFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));
  const sections = async () => {
    const html = renderToStaticMarkup(<LessonArticle lesson={(await full.getLesson("full"))!} />);
    return [...html.matchAll(/<section class="lesson-section[^"]*" id="([^"]+)"[^>]*>/g)].map(([tag, id]) => ({
      id,
      rail: tag.includes("data-quick-checks"),
    }));
  };

  test("only a Section with Quick checks and nothing else beside its text can lift them into the margin", async () => {
    // Chat has a Quick check but also a Scene; Remember has one and no
    // Scene; the others have none.
    expect((await sections()).filter((section) => section.rail).map((section) => section.id)).toEqual(["remember"]);
  });
});

describe("Scenes", () => {
  const full = coursesFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));

  async function scenes(): Promise<Scene[]> {
    const lesson = (await full.getLesson("full"))!;
    return allBlocks(lesson).flatMap((block) => (block.type === "scene" ? [block.scene] : []));
  }

  test("the fixture has one Scene of every kind", async () => {
    expect((await scenes()).map((scene) => scene.kind).sort()).toEqual(["chat", "files", "flow", "meter", "terminal"]);
  });

  test.each(["chat", "terminal", "flow", "files", "meter"])("a %s Scene renders every caption", async (kind) => {
    const scene = (await scenes()).find((s) => s.kind === kind)!;
    const html = renderToStaticMarkup(<SceneRun scene={scene} id="s" />);
    expect(html.match(/<li class="scene-step"/g)).toHaveLength(scene.steps.length);
  });

  test.each([
    [40, "smart"],
    [41, "dumb"],
  ])("a meter filled to %i with its zone at 40 is in the %s zone (past the line, not on it)", (fill, zone) => {
    const scene: Scene = {
      kind: "meter",
      title: null,
      zone: 40,
      steps: [{ captionHtml: "Reading", items: [{ fill, label: "Now" }] }],
    };
    const html = renderToStaticMarkup(<SceneRun scene={scene} id="s" />);
    expect(html).toContain(`data-zone="${zone}"`);
  });

  test("a meter whose steps add no reading still renders, at zero", () => {
    const scene: Scene = {
      kind: "meter",
      title: null,
      zone: 40,
      steps: [{ captionHtml: "Nothing yet", items: [] }],
    };
    const html = renderToStaticMarkup(<SceneRun scene={scene} id="s" />);
    expect(html).toContain('aria-valuenow="0"');
  });
});
