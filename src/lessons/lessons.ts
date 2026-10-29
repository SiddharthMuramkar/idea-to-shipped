/**
 * Contract — lessons.ts (course entry point; see also blocks.ts, questions.ts,
 * scenes.ts, markdown.ts, and ADR 0004 / ADR 0005 / ADR 0007).
 *
 * Inputs:
 *   - `lessonsFrom(dir)` reads every `*.md` file in `dir`, sorted by filename.
 *     The production singleton `lessons` points it at `content/lessons`
 *     (resolved from `process.cwd()`); nothing else is hard-coded.
 *   - Each file is `---` header, then Markdown body (see parseLesson below).
 *     Header keys are exactly: `title`, `slug`, `order` (all required,
 *     non-empty) and optional `part` (1–4, see PARTS). Unknown keys, a key set
 *     twice, a missing required key, or a non-whole-number `order` throws.
 *   - BOM and CRLF/CR line endings are normalised before parsing.
 *
 * Invariants an LLM / author can trust:
 *   - Slugs are permanent (ADR 0004): `slug` and `order` come from the header,
 *     never the filename; the filename prefix (e.g. `01-grilling.md`) only
 *     sorts files on disk and should match `order`. Never rename a published
 *     slug and never embed the position number in it — Comments in the DB
 *     reference Lessons by this slug as plain text, with no foreign key.
 *   - `slug` and `order` (`number`) are each unique across the whole course;
 *     duplicates throw naming both files. Lessons are returned sorted by
 *     `number` ascending, and `previous`/`next` follow that order.
 *   - Question ids inside the body are permanent too (ADR 0005); uniqueness
 *     within a Lesson is enforced by blocks.ts / questions.ts, not here.
 *   - `listLessons()` is header-only and cheap (no body parsing); `minutes`
 *     is an estimate at 220 wpm, minimum 1. `getLesson(slug)` returns `null`
 *     for an unknown slug (never throws for that), as does `getQuestions`.
 *
 * Errors: every parse failure is `throw new Error("<file>: …")` — a broken
 * Lesson fails the build and names its file. No silent fallbacks.
 *
 * Fixture use: tests never touch the real course through this module's
 * singleton for parser cases — they call `lessonsFrom(<dir>)` with
 * `src/lessons/__fixtures__/<case>/` (e.g. `valid`, `full`, `duplicate-slug`,
 * `unknown-header-key`, `no-photo`). One fixture folder per behaviour or
 * failure mode. Keep new parser cases as new fixture folders, not edits to
 * `content/lessons`.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { countProseWords, parseBody, type Block, type LessonBody, type Section } from "./blocks";
import { countWordsIn } from "./markdown";
import type { Question } from "./questions";

export type { Block, CalloutTone, Section } from "./blocks";
export type { Question, QuestionOption } from "./questions";
export type { Scene } from "./scenes";

export type PartNumber = 1 | 2 | 3 | 4;

// The course is split into four Parts, in this order.
export const PARTS: Record<PartNumber, string> = {
  1: "Foundations",
  2: "The main flow",
  3: "When things go wrong",
  4: "Level up",
};

export type Part = { number: PartNumber; title: string };

// Parts show (the home page's headings, a Lesson's header) only once every
// Lesson has one. Until then the old Lessons are still being rewritten, and
// the course reads as one list.
export function courseHasParts(all: LessonSummary[]): boolean {
  return all.length > 0 && all.every((lesson) => lesson.part !== null);
}

export type LessonSummary = {
  number: number;
  slug: string;
  title: string;
  part: Part | null;
  minutes: number;
};

export type Lesson = LessonSummary & {
  intro: Block[];
  sections: Section[];
  previous: LessonSummary | null;
  next: LessonSummary | null;
};

type ParsedLesson = LessonSummary & { file: string; body: string };

// Reading speed for the "N min" label.
const WORDS_PER_MINUTE = 220;

// A cheap word count straight from the Markdown, so listing Lessons never has
// to parse their blocks. Fence lines, HTML tags, link targets and option
// boxes aren't read by anyone, so they don't count.
function estimateWords(body: string): number {
  return countWordsIn(
    body
      .split("\n")
      .filter((line) => !/^\s*(`{3,}|~{3,})/.test(line))
      .join(" ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\]\([^)]*\)/g, "] ")
      .replace(/\[[ xX]\]/g, " "),
  );
}

// A Lesson file starts with a small header between --- lines:
//   title: Grilling
//   slug: grilling
//   order: 1
//   part: 2              (optional: 1 to 4, see PARTS)
const REQUIRED = ["title", "slug", "order"];
const KNOWN_KEYS = new Set([...REQUIRED, "part"]);

function parsePart(file: string, value: string | undefined): Part | null {
  if (value === undefined) return null;
  const number = Number(value);
  if (number !== 1 && number !== 2 && number !== 3 && number !== 4) {
    throw new Error(`${file}: part must be 1, 2, 3 or 4 (got "${value}")`);
  }
  return { number, title: PARTS[number] };
}

// Editors on Windows save "\r\n" line endings and sometimes a byte-order mark
// at the very start. Neither is visible, so both are dropped before parsing.
function normalize(raw: string): string {
  return raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

function parseLesson(file: string, raw: string): ParsedLesson {
  const match = normalize(raw).match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing the --- header`);
  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    if (line.trim() === "") continue;
    const i = line.indexOf(":");
    const key = line.slice(0, i).trim();
    if (i === -1 || !KNOWN_KEYS.has(key)) {
      throw new Error(`${file}: unknown header key "${i === -1 ? line.trim() : key}"`);
    }
    if (key in fields) throw new Error(`${file}: header key "${key}" is set twice`);
    fields[key] = line.slice(i + 1).trim();
  }
  for (const key of REQUIRED) {
    if (!fields[key]) throw new Error(`${file}: missing ${key}`);
  }
  if (!/^\d+$/.test(fields.order)) {
    throw new Error(`${file}: order must be a whole number (got "${fields.order}")`);
  }
  const body = match[2];
  return {
    number: Number(fields.order),
    slug: fields.slug,
    title: fields.title,
    part: parsePart(file, fields.part),
    minutes: Math.max(1, Math.ceil(estimateWords(body) / WORDS_PER_MINUTE)),
    file,
    body,
  };
}

// Slugs and positions must be unique across the course (ADR 0004).
function checkUnique(lessons: ParsedLesson[]) {
  for (const [field, label] of [
    ["slug", "slug"],
    ["number", "order"],
  ] as const) {
    const seen = new Map<string | number, string>();
    for (const lesson of lessons) {
      const other = seen.get(lesson[field]);
      if (other) {
        const value = field === "slug" ? `"${lesson.slug}"` : lesson.number;
        throw new Error(`${other} and ${lesson.file}: both use ${label} ${value}`);
      }
      seen.set(lesson[field], lesson.file);
    }
  }
}

// The Lesson's running-text word count (see countProseWords). The content
// lint in course.test.ts holds every rewritten Lesson to a range.
export function countWords(lesson: LessonBody): number {
  return countProseWords(allBlocks(lesson));
}

// Every block of a Lesson in reading order: the intro, then each Section.
export function allBlocks(lesson: LessonBody): Block[] {
  return [lesson.intro, ...lesson.sections.map((section) => section.blocks)].flat();
}

function summarize(lesson: ParsedLesson): LessonSummary {
  const { number, slug, title, part, minutes } = lesson;
  return { number, slug, title, part, minutes };
}

export function lessonsFrom(dir: string) {
  async function readAll(): Promise<ParsedLesson[]> {
    const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();
    const lessons = await Promise.all(
      files.map(async (f) => parseLesson(f, await readFile(path.join(dir, f), "utf8"))),
    );
    checkUnique(lessons);
    return lessons.sort((a, b) => a.number - b.number);
  }

  async function getLesson(slug: string): Promise<Lesson | null> {
    const all = await readAll();
    const i = all.findIndex((l) => l.slug === slug);
    if (i === -1) return null;
    return {
      ...summarize(all[i]),
      ...parseBody(all[i].file, all[i].body),
      previous: i > 0 ? summarize(all[i - 1]) : null,
      next: i < all.length - 1 ? summarize(all[i + 1]) : null,
    };
  }

  return {
    // Header-only, so it stays cheap: no Lesson body is parsed.
    async listLessons(): Promise<LessonSummary[]> {
      return (await readAll()).map(summarize);
    },

    getLesson,

    // Every question in the Lesson, Checkpoints and Final test alike, in the
    // order a reader meets them. Null when there's no such Lesson. The quiz
    // grades Answers against this, so it never reads Lesson files itself.
    async getQuestions(slug: string): Promise<Question[] | null> {
      const lesson = await getLesson(slug);
      if (!lesson) return null;
      return allBlocks(lesson).flatMap((block) =>
        block.type === "checkpoint" ? [block.question] : block.type === "finalTest" ? block.questions : [],
      );
    },

    async lessonExists(slug: string): Promise<boolean> {
      return (await readAll()).some((l) => l.slug === slug);
    },
  };
}

// The real course: the Markdown files in content/lessons.
export const lessons = lessonsFrom(path.join(process.cwd(), "content/lessons"));
