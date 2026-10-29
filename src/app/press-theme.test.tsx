import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { LogoMark } from "./logo";

const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
const layout = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");

// The Press colour tokens. Dark must redefine every one; a token left out of
// the dark block silently keeps its light value on a dark ground.
const COLOR_TOKENS = [
  "--paper",
  "--wash",
  "--ink",
  "--muted",
  "--rule",
  "--accent",
  "--good",
  "--good-wash",
  "--bad",
  "--bad-wash",
] as const;

function tokenMap(block: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const match of block.matchAll(/(--[a-z-]+)\s*:\s*([^;]+);/g)) {
    map.set(match[1], match[2].trim());
  }
  return map;
}

const lightBlock = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const darkBlock =
  css.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([\s\S]*?)\}\s*\}/)?.[1] ?? "";
const lightTokens = tokenMap(lightBlock);
const darkTokens = tokenMap(darkBlock);

describe("Press theme", () => {
  test("dark token set is complete", () => {
    expect(lightBlock).not.toBe("");
    expect(darkBlock).not.toBe("");
    for (const token of COLOR_TOKENS) {
      expect(lightTokens.get(token), `light ${token}`).toMatch(/^#[0-9a-f]{6}$/i);
      expect(darkTokens.get(token), `dark ${token}`).toMatch(/^#[0-9a-f]{6}$/i);
    }
    const darkColorKeys = [...darkTokens.keys()].filter((key) =>
      (COLOR_TOKENS as readonly string[]).includes(key),
    );
    expect(darkColorKeys.sort()).toEqual([...COLOR_TOKENS].sort());
  });

  test("focus-visible uses accent with at least a 2px outline", () => {
    const block = css.match(/(?:^|\n):focus-visible\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(block).not.toBe("");
    const outline = block.match(/outline:\s*(\d+(?:\.\d+)?)px\s+solid\s+var\(--accent\)/);
    expect(outline, "global :focus-visible outline").not.toBeNull();
    expect(Number(outline![1])).toBeGreaterThanOrEqual(2);
    expect(block).toMatch(/outline-offset:\s*\d/);
  });

  test("reduced-motion block exists or stillness is documented", () => {
    const index = css.indexOf("@media (prefers-reduced-motion: reduce)");
    const block = index >= 0 ? css.slice(index, index + 600) : "";
    const hasBlock =
      index >= 0 && /transition\s*:\s*none/.test(block) && /animation\s*:\s*none/.test(block);
    const hasStillness = /nothing moves|Press is still|final state/i.test(css);
    expect(hasBlock || hasStillness).toBe(true);
  });

  test("layout themeColor literals match the paper tokens", () => {
    const light = layout.match(
      /\{\s*media:\s*"\(prefers-color-scheme:\s*light\)",\s*color:\s*"(#[0-9a-fA-F]+)"\s*\}/,
    )?.[1];
    const dark = layout.match(
      /\{\s*media:\s*"\(prefers-color-scheme:\s*dark\)",\s*color:\s*"(#[0-9a-fA-F]+)"\s*\}/,
    )?.[1];
    expect(light?.toLowerCase()).toBe(lightTokens.get("--paper")?.toLowerCase());
    expect(dark?.toLowerCase()).toBe(darkTokens.get("--paper")?.toLowerCase());
  });

  test("no Google Fonts @import anywhere in src", () => {
    const self = path.join(process.cwd(), "src/app/press-theme.test.tsx");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(css|ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) files.push(full);
      }
    };
    walk(path.join(process.cwd(), "src"));
    const offenders = files.filter((file) => {
      if (file === self) return false;
      const content = fs.readFileSync(file, "utf8");
      return /fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(content) || /@import[^\n;]*google/i.test(content);
    });
    expect(offenders).toEqual([]);
  });

  test("brand mark renders on the paper tokens", () => {
    const html = renderToStaticMarkup(<LogoMark className="brand-mark" />);
    expect(html).toContain("<svg");
    expect(html).toContain("var(--ink)");
    expect(html).toContain("var(--accent)");
    expect(html).toContain("var(--paper)");
  });
});
