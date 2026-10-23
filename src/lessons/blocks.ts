import type { Token, Tokens } from "marked";
import { countWordsIn, htmlToText, lex, renderInline, renderTokens } from "./markdown";
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

// Real code languages, matched in any case. Some sit close to a kind ("text"
// is one letter from "test", "ts" and "r" two from "try"), so a fence that
// starts with one of these is always ordinary code, never a near miss.
const LANGUAGES = new Set([
  // Web and JavaScript
  "ts", "tsx", "js", "jsx", "mjs", "cjs", "json", "jsonc", "json5", "html", "css", "less",
  "scss", "sass", "vue", "svelte", "astro", "graphql", "gql", "http", "xml", "svg",
  "jest", "vitest",
  // Shells and terminals
  "sh", "bash", "zsh", "shell", "console", "ps1", "powershell", "bat", "cmd",
  // Plain text and output
  "text", "txt", "plaintext", "plain", "output", "log", "none", "tree", "diff",
  // Docs and data
  "md", "markdown", "tex", "latex", "csv", "tsv", "yaml", "yml", "toml", "ini", "env",
  "properties", "gitignore",
  // Databases
  "sql", "pgsql", "postgres", "psql", "prisma",
  // Other languages
  "py", "python", "rust", "rs", "rb", "ruby", "r", "go", "java", "kotlin", "kt", "swift",
  "c", "cpp", "h", "cs", "csharp", "php", "lua", "dart", "scala", "elixir", "ex", "exs",
  "hs", "haskell", "erl",
  // Build and infrastructure
  "dockerfile", "docker", "makefile", "make", "tf", "hcl", "nginx",
]);

// Words authors reach for instead of a kind: a callout tone or Scene type on
// its own, or a near synonym. "tip" is two letters from "try", so without
// these it would suggest "try".
const HINTS = new Map(Object.entries({
  tip: "callout tip",
  "watch-out": "callout watch-out",
  "big-idea": "callout big-idea",
  chat: "scene chat",
  terminal: "scene terminal",
  flow: "scene flow",
  files: "scene files",
  meter: "scene meter",
  story: "site-story",
  quiz: "checkpoint <id>",
  question: "checkpoint <id>",
}));

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
// an error when it's a near miss such as "checkpiont", "Goals" or "tip".
function kindOf(file: string, word: string): Kind | null {
  if ((KINDS as readonly string[]).includes(word)) return word as Kind;
  const lower = word.toLowerCase();
  if (LANGUAGES.has(lower)) return null;
  const near = HINTS.get(lower) ?? KINDS.find((kind) => editDistance(lower, kind) <= 2);
  if (near) throw new Error(`${file}: "${word}" is not a block kind: did you mean "${near}"?`);
  return null;
}

// A fence's info string split into words: "checkpoint my-id" gives
// ["checkpoint", "my-id"].
function infoWords(lang: string): string[] {
  return lang.trim().split(/\s+/);
}

// The blocks a list or blockquote holds, with what to call it in an error.
function nestedBlocks(token: Token): [Token[], string][] {
  if (token.type === "list") return (token as Tokens.List).items.map((item) => [item.tokens, "a list"]);
  if (token.type === "blockquote") return [[(token as Tokens.Blockquote).tokens, "a blockquote"]];
  return [];
}

// Typed blocks only work at the top level of a Lesson. One tucked inside a
// list, a blockquote or another block's body would quietly show as code, so
// it's an error instead. Near-miss kinds are caught here too.
function checkNested(file: string, tokens: Token[], where: string) {
  for (const token of tokens) {
    if (token.type === "code" && token.lang) {
      const kind = kindOf(file, infoWords(token.lang as string)[0]);
      if (kind) {
        throw new Error(`${file}: typed blocks must sit at the top level (found \`${kind}\` inside ${where})`);
      }
    }
    for (const [inner, place] of nestedBlocks(token)) checkNested(file, inner, place);
  }
}

// Lexes a callout, try, Site story or sources body and renders it, once
// it's checked that no typed block hides inside.
function renderBody(file: string, kind: Kind, text: string): string {
  const tokens = lex(text);
  checkNested(file, tokens, `a ${kind} block`);
  return renderTokens(tokens);
}

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

// The words a reader reads as running text: prose plus callout, try and Site
// story bodies. Headings and code (code blocks and inline `code` alike) don't
// count, and neither do goals, Scenes, questions or sources. The content lint
// holds each Lesson to a range.
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
  const { items } = tokens[0] as Tokens.List;
  // Each goal renders as one line, so a sub-list would run into its text.
  if (items.some((item) => item.tokens.some((token) => token.type === "list"))) {
    throw new Error(`${file}: goals: goals items can't contain nested lists`);
  }
  return items.map((item) => renderInline(item.text.trim()));
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
// everything else between them becomes one prose block. Typed blocks count
// only at the top level: one inside a list, a blockquote or another block's
// body is an error.
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
    } else if (sections.length === 0) {
      throw fail("the Final test goes in a Section (after a ## heading), not in the intro");
    } else {
      openTest = [question];
      hasFinalTest = true;
      blocks.push({ type: "finalTest", questions: openTest });
    }
  }

  function addTypedBlock(kind: Kind, args: string[], text: string) {
    if (args.length > ARGS[kind]) {
      // Named the way every other error names its block: checkpoint "my-id",
      // scene chat, callout tip, goals.
      const [arg] = args;
      const label = kind === "checkpoint" || kind === "test" ? `${kind} "${arg}"` : ARGS[kind] ? `${kind} ${arg}` : kind;
      throw new Error(`${file}: ${label}: unexpected "${args.slice(ARGS[kind]).join(" ")}"`);
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
        blocks.push({ type: "callout", tone: calloutTone(file, args[0]), html: renderBody(file, kind, text) });
        return;
      case "try":
        blocks.push({ type: "try", html: renderBody(file, kind, text) });
        return;
      case "site-story":
        blocks.push({ type: "siteStory", html: renderBody(file, kind, text) });
        return;
      case "sources":
        blocks.push({ type: "sources", html: renderBody(file, kind, text) });
        return;
      case "scene": {
        const scene = parseScene(file, args[0], text);
        // The intro is one column of text: there's no stage beside it.
        if (sections.length === 0) {
          throw new Error(`${file}: scene ${scene.kind}: Scenes go in a Section (after a ## heading), not in the intro`);
        }
        if (blocks.some((block) => block.type === "scene")) {
          const where = sections[sections.length - 1].title;
          throw new Error(`${file}: scene ${scene.kind}: one Scene per Section ("${where}" already has one)`);
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
      const [word, ...args] = infoWords(token.lang as string);
      const kind = kindOf(file, word);
      if (kind) {
        flushProse();
        if (kind !== "test") openTest = null;
        addTypedBlock(kind, args, (token as Tokens.Code).text);
        continue;
      }
    }
    for (const [inner, where] of nestedBlocks(token)) checkNested(file, inner, where);
    if (token.type !== "space") openTest = null;
    prose.push(token);
  }
  flushProse();
  return { intro, sections };
}
