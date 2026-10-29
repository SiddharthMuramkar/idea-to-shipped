/**
 * Press cross-page accessibility contracts.
 *
 * Renders two real documents through the Root Layout shell — the home
 * page and one Lesson page (context-window, whose article contains a
 * meter, a flow and a chat Scene) — plus the Lesson article on its own
 * for the Scene checks. Everything is server markup via
 * `renderToStaticMarkup`: no database, env file or network.
 *
 * Seam: RootLayout and the page components are async, so each is
 * awaited to an element before rendering (as in press-shell.test.tsx).
 * `next/font/google` is stubbed because font loading is a Next
 * build-time step with no effect on the markup under test other than
 * the CSS-variable class names on <html>. The "use cache" directives
 * are inert strings outside the Next compiler, so the lessons store
 * simply reads the Markdown files under content/lessons from disk.
 */
import type { ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, test, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Source_Serif_4: () => ({ variable: "mock-source-serif", className: "mock-source-serif" }),
  JetBrains_Mono: () => ({ variable: "mock-jetbrains-mono", className: "mock-jetbrains-mono" }),
}));

import RootLayout from "./layout";
import Home from "./page";
import LessonPage from "./learn/[slug]/page";
import { LessonArticle } from "./learn/[slug]/section";
import { lessons } from "@/lessons/lessons";

const LESSON_SLUG = "context-window";

// ---------------------------------------------------------------------------
// Small static-markup helpers. These read only the HTML string produced by
// renderToStaticMarkup; there is no DOM in the render project.
// ---------------------------------------------------------------------------

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** Text a screen reader would announce: aria-hidden subtrees and SVGs are out, visually-hidden text stays in. */
function visibleText(fragment: string): string {
  let out = fragment.replace(/<svg\b[\s\S]*?<\/svg>/g, " ");
  let previous: string;
  do {
    previous = out;
    out = out.replace(/<(\w+)\b[^>]*\baria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g, " ");
  } while (out !== previous);
  return decodeEntities(out.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function attr(attrs: string, name: string): string | null {
  return attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;
}

function anchors(html: string): { href: string; name: string }[] {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((match) => ({
    href: attr(match[1], "href") ?? "",
    name: attr(match[1], "aria-label") ?? visibleText(match[2]),
  }));
}

function headings(html: string): { level: number; text: string }[] {
  return [...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g)].map((match) => ({
    level: Number(match[1][1]),
    text: visibleText(match[2]),
  }));
}

function navLabels(html: string): (string | null)[] {
  return [...html.matchAll(/<nav\b([^>]*)>/g)].map((match) => attr(match[1], "aria-label"));
}

function openingTags(html: string, tag: string): string[] {
  return html.match(new RegExp(`<${tag}\\b[^>]*>`, "g")) ?? [];
}

// ---------------------------------------------------------------------------
// Rendering the two composed documents and the bare Lesson article.
// ---------------------------------------------------------------------------

async function renderInShell(children: ReactNode): Promise<string> {
  const layout = RootLayout as unknown as (props: { children: ReactNode }) => Promise<ReactElement>;
  return renderToStaticMarkup(await layout({ children }));
}

let homeDoc: string;
let lessonDoc: string;
let articleHtml: string;

beforeAll(async () => {
  const homePage = await Home();
  const lessonPage = await (
    LessonPage as unknown as (props: { params: Promise<{ slug: string }> }) => Promise<ReactElement>
  )({ params: Promise.resolve({ slug: LESSON_SLUG }) });
  homeDoc = await renderInShell(homePage);
  lessonDoc = await renderInShell(lessonPage);

  const lesson = await lessons.getLesson(LESSON_SLUG);
  expect(lesson, `lesson ${LESSON_SLUG} should exist`).not.toBeNull();
  articleHtml = renderToStaticMarkup(<LessonArticle lesson={lesson!} />);
});

const PAGES = [
  { name: "home", doc: () => homeDoc, h1: "From idea to shipped, one Skill at a time.", navs: ["Main", "Lessons"] },
  { name: "lesson", doc: () => lessonDoc, h1: "The context window", navs: ["Main", "More Lessons", "Lessons"] },
] as const;

// ---------------------------------------------------------------------------
// Landmarks
// ---------------------------------------------------------------------------

describe("landmarks", () => {
  for (const page of PAGES) {
    test(`${page.name}: one site header, one main and one site footer, in that order, under <html lang="en">`, () => {
      const html = page.doc();
      expect(html).toMatch(/^<html lang="en"/);
      // The single <main> carries id="main" as the skip-link target.
      expect(openingTags(html, "main")).toEqual(['<main id="main">']);
      expect(html.match(/<header class="site-header">/g)).toHaveLength(1);
      expect(html.match(/<footer class="site-footer">/g)).toHaveLength(1);
      const headerAt = html.indexOf('<header class="site-header">');
      const mainAt = html.indexOf('<main id="main">');
      const footerAt = html.indexOf('<footer class="site-footer">');
      expect(headerAt).toBeLessThan(mainAt);
      expect(mainAt).toBeLessThan(footerAt);
    });

    test(`${page.name}: every nav landmark has a unique, non-empty accessible name`, () => {
      const labels = navLabels(page.doc());
      expect(labels).toEqual(page.navs);
      expect(new Set(labels).size).toBe(labels.length);
      for (const label of labels) expect(label?.trim()).toBeTruthy();
    });

    test(`${page.name}: ids are unique and every aria-labelledby reference resolves`, () => {
      const html = page.doc();
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
      expect(new Set(ids).size, "duplicate id attributes").toBe(ids.length);
      const idSet = new Set(ids);
      const references = [...html.matchAll(/\baria-labelledby="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
      expect(references.length).toBeGreaterThan(0);
      for (const ref of references) expect(idSet.has(ref), `aria-labelledby="${ref}" has no matching id`).toBe(true);
    });
  }
});

// ---------------------------------------------------------------------------
// Heading order
// ---------------------------------------------------------------------------

describe("heading order", () => {
  for (const page of PAGES) {
    test(`${page.name}: exactly one <h1>, and it is the first heading`, () => {
      const found = headings(page.doc());
      expect(found.length).toBeGreaterThan(1);
      expect(found[0]).toEqual({ level: 1, text: page.h1 });
      expect(found.filter((h) => h.level === 1)).toHaveLength(1);
    });

    test(`${page.name}: heading levels never skip and every heading has text`, () => {
      const found = headings(page.doc());
      for (const heading of found) expect(heading.text, "heading with no accessible text").not.toBe("");
      for (let i = 1; i < found.length; i++) {
        expect(
          found[i].level,
          `"${found[i].text}" (h${found[i].level}) skips a level after "${found[i - 1].text}" (h${found[i - 1].level})`,
        ).toBeLessThanOrEqual(found[i - 1].level + 1);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Link accessible names
// ---------------------------------------------------------------------------

const GENERIC_NAMES = new Set(["click here", "here", "read more", "learn more", "more", "link", "this", "this page"]);

describe("link accessible names", () => {
  for (const page of PAGES) {
    test(`${page.name}: every link has an href and a non-empty, non-generic accessible name`, () => {
      const links = anchors(page.doc());
      expect(links.length).toBeGreaterThan(10);
      for (const link of links) {
        expect(link.href, "link with no href").not.toBe("");
        expect(link.name, `link to ${link.href} has no accessible name`).not.toBe("");
        expect(GENERIC_NAMES.has(link.name.toLowerCase()), `generic link name "${link.name}"`).toBe(false);
      }
    });

    test(`${page.name}: the same accessible name never points to two different destinations`, () => {
      const byName = new Map<string, Set<string>>();
      for (const link of anchors(page.doc())) {
        const key = link.name.toLowerCase();
        byName.set(key, (byName.get(key) ?? new Set<string>()).add(link.href));
      }
      const ambiguous = [...byName.entries()].filter(([, hrefs]) => hrefs.size > 1);
      expect(ambiguous, `ambiguous link names: ${JSON.stringify(ambiguous)}`).toEqual([]);
    });
  }
});

// ---------------------------------------------------------------------------
// Scene figure semantics (in the Lesson article)
// ---------------------------------------------------------------------------

type FigureInfo = { id: string; kind: string; steps: number; captionId: string; caption: string };

function sceneFigures(html: string): FigureInfo[] {
  const captions = [...html.matchAll(/<figcaption\b([^>]*)>([\s\S]*?)<\/figcaption>/g)].map((m) => ({
    id: attr(m[1], "id") ?? "",
    text: visibleText(m[2]),
  }));
  return [...html.matchAll(/<figure\b([^>]*)>/g)].map((match, i) => ({
    id: attr(match[1], "id") ?? "",
    kind: attr(match[1], "data-scene") ?? "",
    steps: Number(attr(match[1], "data-steps")),
    captionId: captions[i]?.id ?? "",
    caption: captions[i]?.text ?? "",
  }));
}

function sceneStepLists(html: string): { label: string; steps: { step: number; text: string }[] }[] {
  return [...html.matchAll(/<ol class="scene-steps" aria-label="([^"]*)">([\s\S]*?)<\/ol>/g)].map((list) => ({
    label: decodeEntities(list[1]),
    steps: [...list[2].matchAll(/<li class="scene-step" data-step="(\d+)">([\s\S]*?)<\/li>/g)].map((item) => ({
      step: Number(item[1]),
      text: visibleText(item[2]),
    })),
  }));
}

describe("Scene figure semantics", () => {
  test("the article's Scenes render as figures of the expected kinds, in order", () => {
    expect(articleHtml).toContain('<article class="lesson-article">');
    expect(sceneFigures(articleHtml).map((f) => f.kind)).toEqual(["meter", "flow", "chat"]);
  });

  test("every figure is named by its own figcaption, whose text is non-empty", () => {
    const figures = sceneFigures(articleHtml);
    expect(figures.length).toBeGreaterThan(0);
    for (const figure of figures) {
      expect(figure.id, "figure with no id").not.toBe("");
      expect(figure.captionId).toBe(`${figure.id}--title`);
      expect(figure.caption, `figure ${figure.id} has an empty figcaption`).not.toBe("");
      expect(articleHtml).toContain(`class="scene scene--${figure.kind}"`);
    }
    // Exactly one figcaption per figure.
    expect(articleHtml.match(/<figcaption\b/g)).toHaveLength(figures.length);
  });

  test("every figure's step captions are a sequential, labelled list matching data-steps", () => {
    const figures = sceneFigures(articleHtml);
    const lists = sceneStepLists(articleHtml);
    expect(lists).toHaveLength(figures.length);
    figures.forEach((figure, i) => {
      expect(lists[i].label).toBe(`${figure.caption}, step by step`);
      expect(lists[i].steps).toHaveLength(figure.steps);
      expect(lists[i].steps.map((s) => s.step)).toEqual(lists[i].steps.map((_, j) => j + 1));
      for (const step of lists[i].steps) expect(step.text, `step ${step.step} of ${figure.id} has no caption`).not.toBe("");
    });
  });

  test("the meter Scene exposes a meter gauge named by the figure's figcaption, with its value in range", () => {
    const meter = sceneFigures(articleHtml).find((f) => f.kind === "meter");
    expect(meter, "expected a meter Scene in this Lesson").toBeDefined();
    const gauge = articleHtml.match(/<div class="meter-gauge" role="meter"([^>]*)>/)?.[1] ?? "";
    expect(gauge, "meter Scene has no role=meter gauge").not.toBe("");
    expect(attr(gauge, "aria-labelledby")).toBe(meter!.captionId);
    expect(attr(gauge, "aria-valuemin")).toBe("0");
    expect(attr(gauge, "aria-valuemax")).toBe("100");
    const now = Number(attr(gauge, "aria-valuenow"));
    expect(now).toBeGreaterThanOrEqual(0);
    expect(now).toBeLessThanOrEqual(100);
    expect(attr(gauge, "aria-valuetext")).toContain(`${now}%`);
    // Decorative scene graphics are never left focusable.
    for (const svg of openingTags(articleHtml, "svg")) expect(svg).toContain('focusable="false"');
  });
});

// ---------------------------------------------------------------------------
// Focusable controls
// ---------------------------------------------------------------------------

describe("focusable controls", () => {
  test("home: the skip link is first, then the brand link, and lesson links are focusable anchors", () => {
    const links = anchors(homeDoc);
    expect(links[0]).toEqual({ href: "#main", name: "Skip to content" });
    expect(links[1]).toEqual({ href: "/", name: "Idea to Shipped" });
    expect(links.filter((l) => l.href.startsWith("/learn/")).length).toBeGreaterThanOrEqual(20);
  });

  test("lesson: radio answers, answer disclosures and the comment submit are present and focusable", () => {
    const radios = openingTags(lessonDoc, "input").filter((tag) => tag.includes('type="radio"'));
    expect(radios.length).toBeGreaterThan(0);
    const summaries = openingTags(lessonDoc, "summary");
    expect(summaries.length).toBeGreaterThan(0);
    expect(lessonDoc).toContain('<button type="submit">Post comment</button>');
    expect(openingTags(lessonDoc, "textarea")).toHaveLength(1);
    // Each disclosure's summary reads the same and leads its <details>.
    for (const block of lessonDoc.match(/<details class="question-answer">[\s\S]*?<\/details>/g) ?? []) {
      expect(block.startsWith('<details class="question-answer"><summary>Show the answer</summary>')).toBe(true);
    }
  });

  test("lesson: every radio has a labelled option, grouped in a fieldset with a legend prompt", () => {
    const labels = new Map(
      [...lessonDoc.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/g)].map((m) => [
        attr(m[1], "for") ?? "",
        visibleText(m[2]),
      ]),
    );
    const radios = [...lessonDoc.matchAll(/<input\b([^>]*\btype="radio"[^>]*)>/g)].map((m) => m[1]);
    expect(radios.length).toBeGreaterThan(0);
    for (const radio of radios) {
      const id = attr(radio, "id") ?? "";
      expect(id, "radio with no id").not.toBe("");
      expect(attr(radio, "name"), `radio ${id} with no group name`).toBeTruthy();
      expect(labels.get(id), `radio ${id} has no associated <label for>`).toBeTruthy();
    }
    const fieldsets = [...lessonDoc.matchAll(/<fieldset class="question-fields"[^>]*>([\s\S]*?)<\/fieldset>/g)];
    expect(fieldsets.length).toBeGreaterThan(0);
    for (const [, inner] of fieldsets) {
      const legend = inner.match(/<legend class="question-prompt">([\s\S]*?)<\/legend>/);
      expect(legend, "question fieldset with no legend").not.toBeNull();
      expect(visibleText(legend![1])).not.toBe("");
    }
  });

  for (const page of PAGES) {
    test(`${page.name}: nothing removes controls from, or reorders, the tab order`, () => {
      const html = page.doc();
      expect(html).not.toMatch(/\btabindex="-[1-9]"/);
      expect(html).not.toMatch(/\btabindex="[1-9]/);
      const interactive = [
        ...openingTags(html, "a"),
        ...openingTags(html, "button"),
        ...openingTags(html, "input"),
        ...openingTags(html, "textarea"),
        ...openingTags(html, "summary"),
      ];
      expect(interactive.length).toBeGreaterThan(0);
      for (const tag of interactive) expect(tag, `disabled control left in markup: ${tag}`).not.toContain(" disabled");
    });
  }
});
