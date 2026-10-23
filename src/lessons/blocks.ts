import type { Token, Tokens } from "marked";
import { countWordsIn, htmlToText, lex, renderBlock, renderInline, renderTokens } from "./markdown";
import { parseQuestion, type Question } from "./questions";
import { parseScene, type Scene } from "./scenes";

export type Block =
  | { type: "prose"; html: string }
  | { type: "goals"; itemsHtml: string[] }
  | { type: "scene"; scene: Scene }
  | { type: "checkpoint"; question: Question }
  | { type: "finalTest"; questions: Question[] }
  | { type: "callout"; tone: "tip" | "watch-out" | "big-idea"; html: string }
  | { type: "try"; html: string }
  | { type: "siteStory"; html: string }
  | { type: "sources"; html: string };

export type Section = { id: string; title: string; titleHtml: string; blocks: Block[] };

export type LessonBody = { intro: Block[]; sections: Section[] };

// A code fence whose info string starts with one of these is a typed block.
const KINDS = [
  "goals",
  "scene",
  "checkpoint",
  "test",
  "callout",
  "try",
  "site-story",
  "sources",
] as const;
type Kind = (typeof KINDS)[number];

// Real code languages that sit close to a kind ("text" is one letter from
// "test", "ts" two from "try"). These are always ordinary code.
const LANGUAGES = new Set([
  "ts", "tsx", "js", "jsx", "mjs", "cjs", "json", "sh", "bash", "zsh", "shell", "console",
  "text", "txt", "sql", "diff", "css", "html", "md", "markdown", "yaml", "yml", "env",
  "ini", "toml", "py", "python",
]);

// How many single-letter edits turn one word into the other.
function editDistance(a: string, b: string): number {
  let row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    row = next;
  }
  return row[b.length];
}

// The kind a fence's first word asks for: a kind, null for ordinary code, or
// an error when it's a near miss such as "checkpiont".
function kindOf(file: string, word: string): Kind | null {
  if ((KINDS as readonly string[]).includes(word)) return word as Kind;
  if (LANGUAGES.has(word)) return null;
  const near = KINDS.find((kind) => editDistance(word, kind) <= 2);
  if (near) throw new Error(`${file}: "${word}" is not a block kind. Did you mean "${near}"?`);
  return null;
}

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

// The words a reader reads as running text: prose plus callout, try and Site
// story bodies. Headings and code don't count, and neither do goals, Scenes,
// questions or sources. The content lint holds each Lesson to a range.
export function countProseWords(blocks: Block[]): number {
  return blocks.reduce((total, block) => {
    if (!["prose", "callout", "try", "siteStory"].includes(block.type)) return total;
    const text = htmlToText(
      (block as { html: string }).html
        .replace(/<pre[\s\S]*?<\/pre>/g, " ")
        .replace(/<code[\s\S]*?<\/code>/g, " ")
        .replace(/<h[1-6][\s\S]*?<\/h[1-6]>/g, " ")
        .replace(/<[^>]*>/g, " "),
    );
    return total + countWordsIn(text);
  }, 0);
}

const CALLOUT_TONES = ["tip", "watch-out", "big-idea"] as const;
type CalloutTone = (typeof CALLOUT_TONES)[number];

// How many words each kind takes after its name: checkpoint <id>,
// test <id>, callout <tone>, scene <type>; the rest take none.
const ARGS: Record<Kind, number> = {
  goals: 0,
  scene: 1,
  checkpoint: 1,
  test: 1,
  callout: 1,
  try: 0,
  "site-story": 0,
  sources: 0,
};

function parseGoals(file: string, body: string): string[] {
  const tokens = lex(body).filter((t) => t.type !== "space");
  if (tokens.length !== 1 || tokens[0].type !== "list") {
    throw new Error(`${file}: goals: write the goals as a Markdown list`);
  }
  return (tokens[0] as Tokens.List).items.map((item) => renderInline(item.text.trim()));
}

function calloutTone(file: string, tone: string | undefined): CalloutTone {
  if (!(CALLOUT_TONES as readonly (string | undefined)[]).includes(tone)) {
    throw new Error(
      `${file}: callout: the tone must be tip, watch-out or big-idea (got "${tone ?? ""}")`,
    );
  }
  return tone as CalloutTone;
}

// Lexes a Lesson's body once and walks its top-level tokens. A ## heading
// opens a Section, a fence whose first word is a kind becomes that block, and
// everything else between them becomes one prose block.
export function parseBody(file: string, body: string): LessonBody {
  const intro: Block[] = [];
  const sections: Section[] = [];
  const sectionIds = new Set<string>();
  const questionIds = new Set<string>();
  let blocks = intro;
  let prose: Token[] = [];
  // The Final test while its test blocks are still arriving back to back.
  let openTest: Question[] | null = null;
  let hasFinalTest = false;

  function flushProse() {
    const html = renderTokens(prose);
    prose = [];
    if (html.trim() !== "") blocks.push({ type: "prose", html });
  }

  function openSection(token: Tokens.Heading) {
    const titleHtml = renderInline(token.text);
    const title = htmlToText(titleHtml);
    const base = slugify(title);
    let id = base;
    for (let n = 2; sectionIds.has(id); n++) id = `${base}-${n}`;
    sectionIds.add(id);
    blocks = [];
    sections.push({ id, title, titleHtml, blocks });
  }

  function addQuestion(kind: "checkpoint" | "test", id: string | undefined, text: string) {
    const question = parseQuestion(file, kind, id, text);
    const fail = (problem: string) => new Error(`${file}: ${kind} "${question.id}": ${problem}`);
    if (questionIds.has(question.id)) {
      throw fail("another question in this Lesson already uses this id");
    }
    questionIds.add(question.id);
    if (kind === "checkpoint") {
      blocks.push({ type: "checkpoint", question });
    } else if (openTest) {
      openTest.push(question);
    } else if (hasFinalTest) {
      throw fail(
        "test blocks must sit together (only blank lines between them) to form one Final test",
      );
    } else {
      openTest = [question];
      hasFinalTest = true;
      blocks.push({ type: "finalTest", questions: openTest });
    }
  }

  function addTypedBlock(kind: Kind, args: string[], text: string) {
    if (args.length > ARGS[kind]) {
      throw new Error(`${file}: ${kind}: unexpected "${args.slice(ARGS[kind]).join(" ")}" after "${kind}"`);
    }
    switch (kind) {
      case "goals":
        if (sections.length > 0) throw new Error(`${file}: goals: goals go before the first ## heading`);
        blocks.push({ type: "goals", itemsHtml: parseGoals(file, text) });
        return;
      case "checkpoint":
      case "test":
        addQuestion(kind, args[0], text);
        return;
      case "callout":
        blocks.push({ type: "callout", tone: calloutTone(file, args[0]), html: renderBlock(text) });
        return;
      case "try":
        blocks.push({ type: "try", html: renderBlock(text) });
        return;
      case "site-story":
        blocks.push({ type: "siteStory", html: renderBlock(text) });
        return;
      case "sources":
        blocks.push({ type: "sources", html: renderBlock(text) });
        return;
      case "scene": {
        const scene = parseScene(file, args[0], text);
        if (blocks.some((block) => block.type === "scene")) {
          const where = sections.length ? `"${sections[sections.length - 1].title}"` : "the intro";
          throw new Error(`${file}: scene ${scene.kind}: one Scene per Section (${where} already has one)`);
        }
        blocks.push({ type: "scene", scene });
        return;
      }
    }
  }

  for (const token of lex(body)) {
    if (token.type === "heading" && (token as Tokens.Heading).depth === 1) {
      throw new Error(
        `${file}: "${token.raw.trim()}": use ## for Sections; the title comes from the header`,
      );
    }
    if (token.type === "heading" && (token as Tokens.Heading).depth === 2) {
      flushProse();
      openSection(token as Tokens.Heading);
      openTest = null;
      continue;
    }
    if (token.type === "code" && token.lang) {
      const [word, ...args] = (token.lang as string).trim().split(/\s+/);
      const kind = kindOf(file, word);
      if (kind) {
        flushProse();
        if (kind !== "test") openTest = null;
        addTypedBlock(kind, args, (token as Tokens.Code).text);
        continue;
      }
    }
    if (token.type !== "space") openTest = null;
    prose.push(token);
  }
  flushProse();
  return { intro, sections };
}
