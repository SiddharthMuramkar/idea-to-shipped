import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { allBlocks, lessonsFrom, type Scene } from "@/lessons/lessons";
import { SceneRun } from "./scene";

// Press Scenes: server-rendered in their FINAL state. Every step's items are
// in the HTML at once, nothing is hidden by step, and the captions beside the
// figure explain the complete picture. These tests pin that contract against
// the full fixture (one Scene of every kind), reusing the helpers from
// lesson-render.test.tsx.

const KINDS = ["chat", "terminal", "flow", "files", "meter"] as const;
type Kind = (typeof KINDS)[number];

// Fallback titles from scene.tsx: a Scene with no title is still a named figure.
const DEFAULT_TITLES: Record<Kind, string> = {
  chat: "Conversation",
  terminal: "Terminal",
  flow: "Flow",
  files: "Files",
  meter: "Meter",
};

const full = lessonsFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));

async function scenes(): Promise<Scene[]> {
  const lesson = (await full.getLesson("full"))!;
  return allBlocks(lesson).flatMap((block) => (block.type === "scene" ? [block.scene] : []));
}

async function sceneOf<K extends Kind>(kind: K): Promise<Extract<Scene, { kind: K }>> {
  const scene = (await scenes()).find((s) => s.kind === kind);
  if (!scene) throw new Error(`full fixture has no ${kind} Scene`);
  return scene as Extract<Scene, { kind: K }>;
}

function render(scene: Scene): string {
  return renderToStaticMarkup(<SceneRun scene={scene} id="s" />);
}

function count(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0;
}

// Opening tags matching `pattern`, in document order.
function tags(html: string, pattern: RegExp): string[] {
  return html.match(pattern) ?? [];
}

function attr(tag: string, name: string): string | undefined {
  return new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1];
}

describe("Press Scenes from the full fixture", () => {
  test("the fixture has one Scene of every kind", async () => {
    expect((await scenes()).map((scene) => scene.kind).sort()).toEqual(["chat", "files", "flow", "meter", "terminal"]);
  });

  test.each(KINDS)("%s Scene renders a figure with a figcaption", async (kind) => {
    const scene = await sceneOf(kind);
    const html = render(scene);

    expect(html).toContain('<div class="scene-run"');
    const figures = tags(html, /<figure[^>]*>/g);
    expect(figures).toHaveLength(1);
    expect(figures[0]).toContain(`class="scene scene--${kind}"`);
    expect(figures[0]).toContain(`data-scene="${kind}"`);
    expect(figures[0]).toContain(`data-steps="${scene.steps.length}"`);
    expect(figures[0]).toContain('id="s"');

    expect(count(html, /<figcaption[^>]*>/g)).toBe(1);
    expect(html).toContain('<figcaption id="s--title" class="scene-title">');
    const caption = /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/.exec(html)![1].replace(/<[^>]+>/g, "");
    expect(caption).toContain(scene.title ?? DEFAULT_TITLES[kind]);

    expect(html).toContain('<ol class="scene-steps"');
  });

  test.each(KINDS)("%s Scene renders every caption (caption count equals steps)", async (kind) => {
    const scene = await sceneOf(kind);
    const html = render(scene);

    expect(html.match(/<li class="scene-step"/g)).toHaveLength(scene.steps.length);
    for (const step of scene.steps) {
      expect(html).toContain(step.captionHtml);
    }
  });

  test.each(KINDS)("%s Scene hides nothing by step", async (kind) => {
    const scene = await sceneOf(kind);
    const html = render(scene);

    // No stepper is built for Press: no stepper hooks, no hidden attribute,
    // and no inline style hides an item until its step becomes active.
    expect(html).not.toContain("data-stepper");
    expect(html).not.toContain("data-active-step");
    expect(html).not.toMatch(/\shidden(?=[\s=>])/);
    expect(html).not.toMatch(/display\s*:\s*none/);
    expect(html).not.toMatch(/visibility\s*:\s*hidden/);
  });
});

describe("Press Scenes render every step at once (final state)", () => {
  test("chat Scene renders all steps' messages at once (final state)", async () => {
    const scene = await sceneOf("chat");
    const html = render(scene);
    const expected = scene.steps.flatMap((step, i) => step.items.map((item) => ({ item, step: i + 1 })));

    const rows = tags(html, /<li class="chat-msg[^>]*>/g);
    expect(rows).toHaveLength(expected.length);
    expected.forEach(({ item, step }, i) => {
      expect(attr(rows[i], "data-step")).toBe(String(step));
      expect(rows[i]).toContain(`chat-msg--${item.from}`);
      expect(html).toContain(item.html);
      if (step === scene.steps.length) expect(rows[i]).toContain("data-new");
      else expect(rows[i]).not.toContain("data-new");
    });
    // Every step contributed at least the messages it adds: all steps are present.
    expect(new Set(rows.map((row) => attr(row, "data-step")))).toEqual(
      new Set(scene.steps.map((_, i) => String(i + 1))),
    );
  });

  test("terminal Scene renders all steps' lines at once (final state)", async () => {
    const scene = await sceneOf("terminal");
    const html = render(scene);
    const expected = scene.steps.flatMap((step, i) => step.items.map((item) => ({ item, step: i + 1 })));

    const rows = tags(html, /<(?:div|samp) class="term-line[^>]*>/g);
    expect(rows).toHaveLength(expected.length);
    expected.forEach(({ item, step }, i) => {
      expect(attr(rows[i], "data-step")).toBe(String(step));
      expect(rows[i]).toContain(item.type === "command" ? "term-cmd" : "term-out");
      expect(html).toContain(item.text);
      if (step === scene.steps.length) expect(rows[i]).toContain("data-new");
      else expect(rows[i]).not.toContain("data-new");
    });
    expect(new Set(rows.map((row) => attr(row, "data-step")))).toEqual(
      new Set(scene.steps.map((_, i) => String(i + 1))),
    );

    // The cursor sits on the last command in the final state, and nowhere else.
    const cursorAt = expected.findLastIndex(({ item }) => item.type === "command");
    expect(rows.filter((row) => row.includes("data-cursor"))).toHaveLength(1);
    expect(rows[cursorAt]).toContain("data-cursor");
  });

  test("flow Scene renders all nodes at once (final state)", async () => {
    const scene = await sceneOf("flow");
    const html = render(scene);
    const visits = scene.steps.flatMap((step, i) => step.items.map((item) => ({ at: item.at, step: i + 1 })));

    const firstReached = new Map<string, number>();
    const landings = new Map<string, number[]>();
    for (const { at, step } of visits) {
      if (!firstReached.has(at)) firstReached.set(at, step);
      landings.set(at, [...(landings.get(at) ?? []), step]);
    }
    const current = visits.at(-1)?.at ?? null;

    const boxes = tags(html, /<div class="flow-node[^>]*>/g);
    expect(boxes).toHaveLength(scene.nodes.length);
    for (const node of scene.nodes) {
      const box = boxes.find((b) => attr(b, "data-node") === node.id);
      expect(box, `node ${node.id} is rendered`).toBeDefined();
      const reached = firstReached.get(node.id);
      expect(attr(box!, "data-step")).toBe(reached === undefined ? undefined : String(reached));
      const landed = landings.get(node.id);
      expect(attr(box!, "data-at")).toBe(landed === undefined ? undefined : landed.join(" "));
      const state = node.id === current ? "current" : reached !== undefined ? "done" : "idle";
      expect(attr(box!, "data-state")).toBe(state);
      if (state === "current") expect(box).toContain('aria-current="step"');
      else expect(box).not.toContain("aria-current");
      expect(html).toContain(node.label);
    }
    // Exactly one node is current in the final state: the one visited last.
    expect(boxes.filter((box) => box.includes('aria-current="step"'))).toHaveLength(1);

    // Edges: one between consecutive main stops, plus one per side node.
    const stops: { sides: number }[] = [];
    for (const node of scene.nodes) {
      if (node.side && stops.length > 0) stops[stops.length - 1].sides += 1;
      else stops.push({ sides: 0 });
    }
    const expectedEdges = stops.length - 1 + stops.reduce((n, stop) => n + stop.sides, 0);
    const edges = tags(html, /<span class="flow-edge[^>]*>/g);
    expect(edges).toHaveLength(expectedEdges);
    // In the fixture every node is reached, so every edge is drawn.
    for (const edge of edges) {
      expect(edge).toContain("data-drawn");
      expect(attr(edge, "data-step")).toBeDefined();
    }
  });

  test("files Scene renders all steps' paths at once (final state)", async () => {
    const scene = await sceneOf("files");
    const html = render(scene);

    // One row per path, in first-appearance order; later steps re-badge a row.
    const expectedRows = new Map<string, { step: number; history: { step: number; change: string }[] }>();
    for (const { path: filePath, change, step } of scene.steps.flatMap((s, i) =>
      s.items.map((item) => ({ ...item, step: i + 1 })),
    )) {
      const row = expectedRows.get(filePath);
      if (row) row.history.push({ step, change });
      else expectedRows.set(filePath, { step, history: [{ step, change }] });
    }

    const rows = tags(html, /<li class="file-row"[^>]*>/g);
    expect(rows).toHaveLength(expectedRows.size);
    [...expectedRows].forEach(([filePath, { step, history }], i) => {
      expect(attr(rows[i], "data-step")).toBe(String(step));
      expect(attr(rows[i], "data-change")).toBe(history.at(-1)!.change);
      expect(attr(rows[i], "data-changes")).toBe(history.map((h) => `${h.step}:${h.change}`).join(" "));
      if (history.some((h) => h.step === scene.steps.length)) expect(rows[i]).toContain("data-new");
      else expect(rows[i]).not.toContain("data-new");
      const slash = filePath.replace(/\/$/, "").lastIndexOf("/");
      expect(html).toContain(filePath.slice(slash + 1));
      if (slash >= 0) expect(html).toContain(filePath.slice(0, slash + 1));
    });
  });

  test("meter Scene renders all steps' readings at once (final state)", async () => {
    const scene = await sceneOf("meter");
    const html = render(scene);
    const readings = scene.steps.flatMap((step, i) => step.items.map((item) => ({ item, step: i + 1 })));
    expect(readings.length).toBeGreaterThan(0);

    const readingTags = tags(html, /<li class="meter-reading"[^>]*>/g);
    const notchTags = tags(html, /<span class="meter-notch"[^>]*>/g);
    expect(readingTags).toHaveLength(readings.length);
    expect(notchTags).toHaveLength(readings.length);
    readings.forEach(({ item, step }, i) => {
      const isLast = i === readings.length - 1;
      expect(attr(readingTags[i], "data-step")).toBe(String(step));
      expect(attr(readingTags[i], "data-fill")).toBe(String(item.fill));
      expect(attr(notchTags[i], "data-step")).toBe(String(step));
      if (isLast) {
        expect(readingTags[i]).toContain("data-current");
        expect(notchTags[i]).toContain("data-current");
      } else {
        expect(readingTags[i]).not.toContain("data-current");
        expect(notchTags[i]).not.toContain("data-current");
      }
      expect(html).toContain(item.label);
      expect(html).toContain(`${item.fill}%`);
    });

    // The gauge shows the last reading in the final state.
    const now = readings.at(-1)!.item;
    expect(html).toContain('role="meter"');
    expect(html).toContain(`aria-valuenow="${now.fill}"`);
    expect(html).toContain(`aria-valuetext="${now.fill}%: ${now.label}"`);
    expect(html).toContain(`--fill:${now.fill / 100}`);
  });
});

describe("meter data-zone", () => {
  test("meter Scene in the full fixture is in the dumb zone (last fill past the zone line)", async () => {
    const scene = await sceneOf("meter");
    const html = render(scene);
    const figure = tags(html, /<figure[^>]*>/g)[0];

    expect(scene.zone).toBe(40);
    const lastFill = scene.steps.flatMap((step) => step.items).at(-1)!.fill;
    expect(lastFill).toBe(62);
    expect(lastFill).toBeGreaterThan(scene.zone!);
    expect(figure).toContain('data-zone="dumb"');
    expect(html).toContain(`--zone:${scene.zone! / 100}`);
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
    const html = render(scene);
    expect(tags(html, /<figure[^>]*>/g)[0]).toContain(`data-zone="${zone}"`);
  });

  test("a meter with no zone renders no data-zone", () => {
    const scene: Scene = {
      kind: "meter",
      title: null,
      zone: null,
      steps: [{ captionHtml: "Reading", items: [{ fill: 10, label: "Now" }] }],
    };
    const html = render(scene);
    expect(tags(html, /<figure[^>]*>/g)[0]).not.toContain("data-zone");
  });
});
