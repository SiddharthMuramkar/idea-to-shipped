/**
 * Contract — markdown.ts (the course's private Markdown renderer).
 *
 * Inputs / outputs (all pure string transforms; no I/O, no Lesson knowledge):
 *   - `lex(src)` → marked `Token[]`; `renderTokens(tokens)` renders block
 *     tokens from `lex()` to HTML; `renderInline(src)` renders one line of
 *     inline Markdown to HTML with no wrapping `<p>` (prompts, captions).
 *   - `htmlToText(html)` strips tags and decodes exactly the entities in
 *     ENTITIES (`&amp; &lt; &gt; &quot; &#39; &nbsp;`); `countWordsIn(text)`
 *     counts whitespace-separated words containing a letter or digit
 *     (incl. Latin Extended), so stray punctuation never counts.
 *
 * Invariants an LLM / author can trust:
 *   - The renderer is a private `Marked` instance (GFM on, plus the `==mark==`
 *     extension and the checkbox renderer below). It never mutates the global
 *     `marked` instance or any other importer's renderer.
 *   - `==key phrase==` becomes `<mark>…</mark>` only when `==` touches a
 *     non-space character on the inside; `a == b` and `===` stay literal, and
 *     matching is lazy so `==8== of ==10==` is two highlights.
 *   - A checklist box (`- [ ] …` / `- [x] …`) renders as a decorative
 *     `<span class="task-box">` (with `data-checked` when ticked, hidden from
 *     screen readers), never as an interactive/disabled checkbox input.
 *   - This module knows nothing about slugs (ADR 0004), question ids
 *     (ADR 0005), header keys, or typed blocks (ADR 0007): callers in
 *     lessons.ts / blocks.ts / questions.ts / scenes.ts own those rules and
 *     pass already-validated text here.
 *
 * Errors: none thrown by design for string input — rendering is total;
 * malformed Markdown renders as literal text rather than failing. Parse and
 * validation errors belong to the caller modules above.
 *
 * Fixture use: unit-tested directly in markdown.test.ts against `lex` /
 * `renderTokens`; end-to-end (e.g. `==mark==` inside a Lesson) via the
 * `mark` fixture folder through `lessonsFrom(__fixtures__/mark)` in
 * lessons.test.ts.
 */
import { Marked, type Token, type TokenizerAndRendererExtension } from "marked";

// ==key phrase== becomes <mark>key phrase</mark>. The == has to touch a
// non-space character on the inside, so "a == b" and "===" stay as typed.
// The inner group is lazy (??), so "==8== of ==10==" is two highlights, not
// one running from the first == to the last.
const MARK = /^==([^\s=](?:[\s\S]*?[^\s])??)==(?!=)/;

const mark: TokenizerAndRendererExtension = {
  name: "mark",
  level: "inline",
  start(src) {
    const i = src.search(/==[^\s=]/);
    return i === -1 ? undefined : i;
  },
  tokenizer(src) {
    const match = MARK.exec(src);
    if (!match) return undefined;
    return {
      type: "mark",
      raw: match[0],
      tokens: this.lexer.inlineTokens(match[1]),
    };
  },
  renderer(token) {
    return `<mark>${this.parser.parseInline(token.tokens ?? [])}</mark>`;
  },
};

// The course's own Markdown renderer. It's a private instance, so the global
// `marked` (and anything else that imports it) is never changed. A checklist
// ("- [ ] …") is a list to read, not a form, so its boxes are drawn squares
// hidden from screen readers instead of disabled, unlabeled checkboxes.
const md = new Marked({
  gfm: true,
  extensions: [mark],
  renderer: {
    checkbox({ checked }) {
      return `<span class="task-box"${checked ? " data-checked" : ""} aria-hidden="true"></span>`;
    },
  },
});

export function lex(src: string): Token[] {
  return md.lexer(src);
}

// Renders block tokens taken from lex(): a run of paragraphs, or a whole
// callout, try, Site story or sources body.
export function renderTokens(tokens: Token[]): string {
  return md.parser(tokens);
}

// Renders one line of Markdown without a wrapping <p>: prompts, captions.
export function renderInline(src: string): string {
  return md.parseInline(src, { async: false });
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

// The text a reader sees in a piece of rendered HTML.
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => ENTITIES[entity]);
}

// How many words a piece of plain text holds. A "word" needs a letter or a
// digit, so stray punctuation such as "-" or ">" never counts.
export function countWordsIn(text: string): number {
  return text.split(/\s+/).filter((word) => /[A-Za-z0-9\u00C0-\u024F]/.test(word)).length;
}
