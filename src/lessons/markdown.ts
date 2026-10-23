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
// `marked` (and anything else that imports it) is never changed.
const md = new Marked({ gfm: true, extensions: [mark] });

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
