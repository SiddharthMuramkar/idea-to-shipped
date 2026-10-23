import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { lessons, lessonsFrom, type Lesson, type Scene } from "@/lessons/lessons";
import type { LessonContext } from "./blocks";
import { SceneRun } from "./scene";
import { LessonIntro, LessonSection } from "./section";

// The Lesson body as the page renders it (page.tsx itself is an async Server
// Component, so its parts are rendered here instead).
function renderBody(lesson: Lesson): string {
  const checkpoints = new Map<string, number>();
  for (const block of [lesson.intro, ...lesson.sections.map((s) => s.blocks)].flat()) {
    if (block.type === "checkpoint") checkpoints.set(block.question.id, checkpoints.size + 1);
  }
  const ctx: LessonContext = { slug: lesson.slug, checkpoints };
  return renderToStaticMarkup(
    <>
      <LessonIntro blocks={lesson.intro} ctx={ctx} />
      {lesson.sections.map((section, i) => (
        <LessonSection key={section.id} section={section} number={i + 1} ctx={ctx} />
      ))}
    </>,
  );
}

describe("every Lesson in content/lessons", async () => {
  const all = await lessons.listLessons();

  test.each(all.map((lesson) => [lesson.slug]))("%s renders", async (slug) => {
    const lesson = (await lessons.getLesson(slug))!;
    const html = renderBody(lesson);
    expect(html.length).toBeGreaterThan(0);
  });
});

describe("Scenes", () => {
  const full = lessonsFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));

  async function scenes(): Promise<Scene[]> {
    const lesson = (await full.getLesson("full"))!;
    return [lesson.intro, ...lesson.sections.map((s) => s.blocks)]
      .flat()
      .flatMap((block) => (block.type === "scene" ? [block.scene] : []));
  }

  test("the fixture has one Scene of every kind", async () => {
    expect((await scenes()).map((scene) => scene.kind).sort()).toEqual(["chat", "files", "flow", "meter", "terminal"]);
  });

  test.each(["chat", "terminal", "flow", "files", "meter"])("a %s Scene renders every caption", async (kind) => {
    const scene = (await scenes()).find((s) => s.kind === kind)!;
    const html = renderToStaticMarkup(<SceneRun scene={scene} id="s" />);
    expect(html.match(/<li class="scene-step"/g)).toHaveLength(scene.steps.length);
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
