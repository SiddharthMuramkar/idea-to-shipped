/**
 * Press shell — header/footer contract of the Root Layout.
 *
 * Seam choice: this renders the real RootLayout from ./layout directly.
 * RootLayout is `async` and its loadLessons() carries a "use cache"
 * directive, so the usual `renderToStaticMarkup(<RootLayout/>)` cannot be
 * used as-is: an async component must be awaited first. The seam used here
 * is therefore `await RootLayout({ children })` to obtain the element, then
 * `renderToStaticMarkup(element)`. That is still the real server markup
 * path — header, Main nav and footer all come from layout.tsx itself.
 *
 * The "use cache" directive needs no substitute in this project: outside
 * the Next compiler it is an inert string directive, so loadLessons() runs
 * as a plain async function and listLessons() reads the Markdown headers
 * under content/lessons from disk. No database, env file or network is
 * involved.
 *
 * The one stub is next/font/google (see vi.mock below). Font loading is a
 * Next build-time step that self-hosts font files; outside `next build` it
 * cannot run and it has no effect on the shell markup under test other
 * than the CSS-variable class names on <html>. Stubbing it keeps the test
 * on the real header/footer markup without a build or a network fetch.
 * next/link and the lessons store are the real implementations.
 */
import { createElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, test, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Source_Serif_4: () => ({
    variable: "mock-source-serif",
    className: "mock-source-serif",
  }),
  JetBrains_Mono: () => ({
    variable: "mock-jetbrains-mono",
    className: "mock-jetbrains-mono",
  }),
}));

import RootLayout from "./layout";

// The footer must list the whole course in course order (by the `order`
// header, rendered as the footer number). Pinned literally so a reordering
// of the store or the footer map fails here rather than passing by
// construction.
const EXPECTED_LESSONS = [
  { number: 0, slug: "start-here", title: "Start here" },
  { number: 1, slug: "how-agents-work", title: "How coding agents work" },
  { number: 2, slug: "context-window", title: "The context window" },
  { number: 3, slug: "skills", title: "Skills" },
  { number: 4, slug: "grilling", title: "Grilling" },
  { number: 5, slug: "domain-modeling", title: "Domain modeling" },
  { number: 6, slug: "prototype", title: "Prototype" },
  { number: 7, slug: "spec-and-issues", title: "Spec + tickets" },
  { number: 8, slug: "tdd", title: "TDD" },
  { number: 9, slug: "implement", title: "Implement" },
  { number: 10, slug: "code-review", title: "Code review" },
  { number: 11, slug: "pr-and-ship", title: "PR + ship" },
  { number: 12, slug: "main-flow", title: "The main flow" },
  { number: 13, slug: "diagnosing-bugs", title: "Diagnosing bugs" },
  { number: 14, slug: "triage", title: "Triage" },
  { number: 15, slug: "wizard", title: "Wizard" },
  { number: 16, slug: "architecture", title: "Architecture" },
  { number: 17, slug: "retro", title: "Retro" },
  { number: 18, slug: "wayfinder", title: "Wayfinder" },
  { number: 19, slug: "models-effort-ultracode", title: "Models, effort & ultracode" },
] as const;

type ShellProps = { children: ReactNode };

async function renderShell(): Promise<string> {
  const layout = RootLayout as unknown as (
    props: ShellProps,
  ) => Promise<ReactElement>;
  const element = await layout({
    children: createElement("p", null, "shell-child"),
  });
  return renderToStaticMarkup(element);
}

function segment(html: string, from: string, to: string): string {
  const start = html.indexOf(from);
  expect(start, `expected markup to contain ${from}`).toBeGreaterThanOrEqual(0);
  const end = html.indexOf(to, start);
  expect(end, `expected markup to contain ${to} after ${from}`).toBeGreaterThan(
    start,
  );
  return html.slice(start, end + to.length);
}

function decodeText(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function anchorsIn(fragment: string): { href: string; text: string }[] {
  return [...fragment.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    (match) => ({
      href: match[1],
      text: decodeText(match[2].replace(/<[^>]+>/g, " ")),
    }),
  );
}

describe("press shell (RootLayout)", () => {
  let html: string;

  beforeAll(async () => {
    html = await renderShell();
  });

  test("brand link points home with the wordmark", () => {
    const header = segment(html, "<header", "</header>");
    const brand = anchorsIn(header).find((a) => a.href === "/");
    expect(brand, "header should contain a brand link to /").toBeDefined();
    expect(brand?.text).toContain("Idea to Shipped");
    expect(header).toContain('class="brand"');
    expect(header).toContain('class="brand-word"');
  });

  test("Main nav links to the Lessons index and the main flow", () => {
    const header = segment(html, "<header", "</header>");
    const nav = segment(header, 'aria-label="Main"', "</nav>");
    expect(anchorsIn(nav)).toEqual([
      { href: "/#lessons", text: "Lessons" },
      { href: "/learn/main-flow", text: "The main flow" },
    ]);
  });

  test("renders children inside main", () => {
    const main = segment(html, '<main id="main">', "</main>");
    expect(main).toContain("shell-child");
  });

  test("footer lists all 20 Lessons in course order", () => {
    const footer = segment(html, "<footer", "</footer>");
    const nav = segment(footer, 'aria-label="Lessons"', "</nav>");
    expect(nav).toContain("Lessons");

    const items = [...nav.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
    expect(items).toHaveLength(20);

    const listed = items.map((item) => {
      const anchor = anchorsIn(item)[0];
      const number = item.match(/footer-number">(\d+)</);
      expect(anchor, "each footer Lesson should be a link").toBeDefined();
      expect(number, "each footer Lesson should show its number").not.toBeNull();
      return {
        number: Number(number?.[1]),
        slug: anchor.href.replace(/^\/learn\//, ""),
        // The anchor text is "<number> <title>"; drop the leading number.
        title: anchor.text.replace(/^\d+\s+/, ""),
        href: anchor.href,
      };
    });

    expect(listed.map(({ href }) => href)).toEqual(
      EXPECTED_LESSONS.map((l) => `/learn/${l.slug}`),
    );
    expect(listed.map(({ number, slug, title }) => ({ number, slug, title }))).toEqual(
      EXPECTED_LESSONS.map(({ number, slug, title }) => ({ number, slug, title })),
    );
  });

  test("footer repeats the brand link home", () => {
    const footer = segment(html, "<footer", "</footer>");
    const brand = anchorsIn(footer).find((a) => a.href === "/");
    expect(brand, "footer should contain a brand link to /").toBeDefined();
    expect(brand?.text).toContain("Idea to Shipped");
  });

  test("no /credits link anywhere in the shell", () => {
    expect(html).not.toContain("/credits");
    expect(html).not.toMatch(/href="\/credits/);
  });
});
