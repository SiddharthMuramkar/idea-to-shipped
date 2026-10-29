import { readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

/** Return the text inside the braces that follow `marker`. */
function blockAfter(marker: string): string {
  const start = css.indexOf(marker);
  expect(start, `missing block: ${marker}`).toBeGreaterThanOrEqual(0);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  throw new Error(`unclosed block after: ${marker}`);
}

/** Parse `--name: value;` declarations from a CSS block. */
function tokens(block: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    map.set(match[1], match[2].trim());
  }
  return map;
}

const light = tokens(blockAfter(":root {"));
const dark = tokens(blockAfter("@media (prefers-color-scheme: dark)"));
const print = blockAfter("@media print");
const printRoot = tokens(blockAfter("@media print"));

// The token table: exact Press values, asserted against drift.
const LIGHT_TABLE: Array<[string, string]> = [
  ["--paper", "#edeae3"],
  ["--wash", "#f8f6f0"],
  ["--ink", "#1c1b18"],
  ["--muted", "#59564e"],
  ["--rule", "#d6d0bf"],
  ["--accent", "#1d5d78"],
  ["--good", "#256b3f"],
  ["--good-wash", "#e6f2ea"],
  ["--bad", "#9c3a28"],
  ["--bad-wash", "#f8e8e4"],
];

const DARK_TABLE: Array<[string, string]> = [
  ["--paper", "#171614"],
  ["--wash", "#22201d"],
  ["--ink", "#e8e5dd"],
  ["--muted", "#a29f96"],
  ["--rule", "#35332e"],
  ["--accent", "#86bdd7"],
  ["--good", "#78c596"],
  ["--good-wash", "#1b2a20"],
  ["--bad", "#e9937f"],
  ["--bad-wash", "#2f1f1b"],
];

describe("Press tokens in globals.css", () => {
  test.each(LIGHT_TABLE)("light %s is %s", (name, value) => {
    expect(light.get(name)).toBe(value);
  });

  test.each(DARK_TABLE)("dark %s is %s", (name, value) => {
    expect(dark.get(name)).toBe(value);
  });

  test("the one measure is 680px", () => {
    expect(light.get("--measure")).toBe("680px");
  });

  test("root follows the system colour scheme", () => {
    expect(blockAfter(":root {")).toContain("color-scheme: light dark;");
  });

  test("print forces light", () => {
    expect(print).toContain("color-scheme: light;");
    expect(print).not.toContain("color-scheme: light dark");
    expect(printRoot.get("--paper")).toBe("#fff");
    expect(printRoot.get("--ink")).toBe("#000");
  });

  test("no leftover --page-max governs reading surfaces", () => {
    expect(css).not.toContain("--page-max");
    // Every reading surface is governed by the one measure.
    expect(blockAfter(".measure {")).toContain("max-width: var(--measure);");
    for (const surface of [".site-header-inner", ".site-footer-inner"]) {
      expect(blockAfter(surface)).toContain("max-width: var(--measure);");
    }
    // No reading surface declares a wider fixed measure.
    expect(css).not.toMatch(/\.measure[^{]*\{[^}]*max-width:\s*(?!var\(--measure\))\d+px/);
  });

  test("a reading surface renders inside the measure", () => {
    const html = renderToStaticMarkup(
      <main className="measure">
        <p>Press</p>
      </main>,
    );
    expect(html).toContain('<main class="measure">');
    expect(html).toContain("<p>Press</p>");
  });
});
