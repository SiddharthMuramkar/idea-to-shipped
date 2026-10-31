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

// Builds the error for a problem in some Markdown. The caller knows the file
// and the block, so the message can say where the problem is.
export type Fail = (problem: string) => Error;

// A Lesson's HTML goes onto the page as it is (dangerouslySetInnerHTML), so
// raw HTML written in a Lesson would too. Lessons are Markdown only. marked
// lexes every HTML block and tag as an "html" token, while code spans and
// code blocks are tokens of their own, so `<div>` in backticks stays legal.
function refuseHtml(tokens: Token[], fail: Fail) {
  md.walkTokens(tokens, (token) => {
    if (token.type !== "html") return;
    const html = token.raw.trim().split("\n")[0];
    throw fail(
      `raw HTML isn't allowed in a Lesson (found "${html}"): write it in Markdown, or put it in backticks to show it as code`,
    );
  });
}

export function lex(src: string, fail: Fail): Token[] {
  const tokens = md.lexer(src);
  refuseHtml(tokens, fail);
  return tokens;
}

// Renders block tokens taken from lex(): a run of paragraphs, or a whole
// callout, try, Site story or sources body.
export function renderTokens(tokens: Token[]): string {
  return md.parser(tokens);
}

// Renders one line of Markdown without a wrapping <p>: prompts, captions.
// It lexes and renders in two steps, not with md.parseInline, because marked
// appends "Please report this to …" to any error thrown inside parseInline.
export function renderInline(src: string, fail: Fail): string {
  const tokens = md.Lexer.lexInline(src, md.defaults);
  refuseHtml(tokens, fail);
  return md.Parser.parseInline(tokens, md.defaults);
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
