import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { allBlocks, lessons, lessonsFrom, type Scene } from "@/lessons/lessons";
import { SceneRun } from "./scene";
import { LessonArticle } from "./section";

describe("every Lesson in content/lessons", async () => {
  const all = await lessons.listLessons();

  test.each(all.map((lesson) => [lesson.slug]))("%s renders", async (slug) => {
    const lesson = (await lessons.getLesson(slug))!;
    const html = renderToStaticMarkup(<LessonArticle lesson={lesson} />);
    expect(html).toContain('<article class="lesson-article">');
  });
});

describe("Scenes", () => {
  const full = lessonsFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));

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
