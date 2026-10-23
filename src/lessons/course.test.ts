import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { bodyText, lessonNumberMentions, partsGoingBackwards, unknownSlashNames } from "./course-lint";
import { countWords, lessons, type Block, type Lesson, type LessonSummary } from "./lessons";

// The content lint: the real course in content/lessons, checked against the
// authoring contract (docs/authoring-lessons.md). A failure names the Lesson
// and the rule, so an author can fix the file without reading this code.

const LESSONS_DIR = path.join(process.cwd(), "content/lessons");

// Lessons still in their old journal form. The per-Lesson rules skip them;
// each one leaves this list in the commit that rewrites it.
const PENDING_REWRITE = new Set([
  "start-here",
  "domain-modeling",
  "spec-and-issues",
  "wizard",
  "prototype",
  "tdd",
  "code-review",
  "pr-and-ship",
  "diagnosing-bugs",
  "models-effort-ultracode",
  "main-flow",
]);

// The 12 slugs the site launched with. Comments point at them (ADR 0004), so
// they must never disappear, and each of them tells its Site story.
const LEGACY_SLUGS = [
  "start-here",
  "grilling",
  "domain-modeling",
  "spec-and-issues",
  "wizard",
  "prototype",
  "tdd",
  "code-review",
  "pr-and-ship",
  "diagnosing-bugs",
  "models-effort-ultracode",
  "main-flow",
];

// Final test size by slug; every other Lesson has 8 to 10 questions.
const FINAL_TEST_SIZE: Record<string, [number, number]> = {
  "start-here": [5, 6],
  "main-flow": [8, 15],
};
const DEFAULT_FINAL_TEST_SIZE: [number, number] = [8, 10];

// Words of running text (see countWords).
const WORD_RANGE: Record<string, [number, number]> = { "start-here": [900, 1400] };
const DEFAULT_WORD_RANGE: [number, number] = [1800, 3000];

// Collected up front so each rewritten Lesson gets its own describe block. A
// broken course yields no Lessons here; "every Lesson file parses" says why.
const summaries: LessonSummary[] = await lessons.listLessons().catch(() => []);
const rewritten = summaries.filter((lesson) => !PENDING_REWRITE.has(lesson.slug));

function allBlocks(lesson: Lesson): Block[] {
  return [lesson.intro, ...lesson.sections.map((section) => section.blocks)].flat();
}

function blocksOf<T extends Block["type"]>(lesson: Lesson, type: T) {
  return allBlocks(lesson).filter((block): block is Extract<Block, { type: T }> => block.type === type);
}

async function load(slug: string): Promise<Lesson> {
  const lesson = await lessons.getLesson(slug);
  if (!lesson) throw new Error(`no Lesson "${slug}"`);
  return lesson;
}

function inRange(n: number, [min, max]: [number, number]) {
  return n >= min && n <= max;
}

describe("the course", () => {
  test("every Lesson file parses", async () => {
    const problems: string[] = [];
    for (const { slug } of await lessons.listLessons()) {
      await lessons.getLesson(slug).catch((error: Error) => problems.push(error.message));
    }
    expect(problems).toEqual([]);
  });

  test("no two Lessons share a slug", async () => {
    const slugs = (await lessons.listLessons()).map((lesson) => lesson.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("no two Lessons share an order", async () => {
    const orders = (await lessons.listLessons()).map((lesson) => lesson.number);
    expect(new Set(orders).size).toBe(orders.length);
  });

  test("the 12 original slugs all still exist (Comments point at them, ADR 0004)", async () => {
    const slugs = (await lessons.listLessons()).map((lesson) => lesson.slug);
    expect(LEGACY_SLUGS.filter((slug) => !slugs.includes(slug))).toEqual([]);
  });

  test("each file name starts with its order, zero-padded (order 1 is 01-name.md)", async () => {
    const files = (await readdir(LESSONS_DIR)).filter((file) => file.endsWith(".md"));
    const mismatches: string[] = [];
    for (const file of files) {
      const raw = await readFile(path.join(LESSONS_DIR, file), "utf8");
      const order = /^order:\s*(\S+)\s*$/m.exec(raw.split(/\n---/)[0])?.[1] ?? "?";
      if (!file.startsWith(`${order.padStart(2, "0")}-`)) mismatches.push(`${file} has order ${order}`);
    }
    expect(mismatches).toEqual([]);
  });

  test("once every Lesson has a Part, Parts never go backwards as order goes up", async () => {
    const all = await lessons.listLessons();
    if (all.some((lesson) => lesson.part === null)) return;
    expect(partsGoingBackwards(all)).toEqual([]);
  });

  test("every Lesson's photo exists under public/", async () => {
    const missing = (await lessons.listLessons())
      .filter((lesson) => !existsSync(path.join(process.cwd(), "public", lesson.image)))
      .map((lesson) => `${lesson.slug}: ${lesson.image}`);
    expect(missing).toEqual([]);
  });

  test("PENDING_REWRITE names only Lessons that exist", async () => {
    const slugs = (await lessons.listLessons()).map((lesson) => lesson.slug);
    expect([...PENDING_REWRITE].filter((slug) => !slugs.includes(slug))).toEqual([]);
  });
});

describe.each(rewritten)("Lesson $slug", ({ slug }) => {
  test("belongs to a Part (part: 1 to 4 in the header)", async () => {
    expect((await load(slug)).part).not.toBeNull();
  });

  test("opens with exactly one goals block of 3 or 4 goals", async () => {
    const goals = blocksOf(await load(slug), "goals");
    expect(goals, "exactly one goals block").toHaveLength(1);
    expect(goals[0].itemsHtml.length).toBeGreaterThanOrEqual(3);
    expect(goals[0].itemsHtml.length).toBeLessThanOrEqual(4);
  });

  test("has at least one Scene", async () => {
    expect(blocksOf(await load(slug), "scene").length).toBeGreaterThanOrEqual(1);
  });

  test("has 3 to 5 Checkpoints", async () => {
    const count = blocksOf(await load(slug), "checkpoint").length;
    expect(count, `found ${count}`).toSatisfy((n: number) => inRange(n, [3, 5]));
  });

  test("ends with a Final test of the right size", async () => {
    const [finalTest, ...extra] = blocksOf(await load(slug), "finalTest");
    expect(finalTest, "no test blocks").toBeDefined();
    expect(extra).toEqual([]);
    const [min, max] = FINAL_TEST_SIZE[slug] ?? DEFAULT_FINAL_TEST_SIZE;
    const count = finalTest.questions.length;
    expect(count, `found ${count}, want ${min} to ${max}`).toSatisfy((n: number) => inRange(n, [min, max]));
  });

  if (slug !== "start-here") {
    test('mixes Final test questions: 3+ "scenario-", 2+ "spot-" and 1+ "sequence-" ids', async () => {
      const ids = blocksOf(await load(slug), "finalTest").flatMap((block) => block.questions.map((q) => q.id));
      const count = (prefix: string) => ids.filter((id) => id.startsWith(prefix)).length;
      expect({
        scenario: count("scenario-") >= 3,
        spot: count("spot-") >= 2,
        sequence: count("sequence-") >= 1,
      }).toEqual({ scenario: true, spot: true, sequence: true });
    });
  }

  if (LEGACY_SLUGS.includes(slug)) {
    test("tells its Site story (a site-story block)", async () => {
      expect(blocksOf(await load(slug), "siteStory").length).toBeGreaterThanOrEqual(1);
    });
  }

  test("has exactly one sources block, listing at least 3 sources, each with a link", async () => {
    const sources = blocksOf(await load(slug), "sources");
    expect(sources, "exactly one sources block").toHaveLength(1);
    const items = sources[0].html.match(/<li>[\s\S]*?<\/li>/g) ?? [];
    expect(items.length).toBeGreaterThanOrEqual(3);
    expect(items.filter((item) => !item.includes("<a href="))).toEqual([]);
  });

  test("has the right amount of running text", async () => {
    const [min, max] = WORD_RANGE[slug] ?? DEFAULT_WORD_RANGE;
    const words = countWords(await load(slug));
    expect(words, `${words} words, want ${min} to ${max}`).toSatisfy((n: number) => inRange(n, [min, max]));
  });

  test('never says "Lesson <number>" in its body (numbers change when Lessons move)', async () => {
    expect(lessonNumberMentions(await load(slug))).toEqual([]);
  });

  test("links only to Lessons that exist", async () => {
    const slugs = new Set(summaries.map((lesson) => lesson.slug));
    const targets = [...bodyText(await load(slug)).matchAll(/href="\/learn\/([^"#?/]+)/g)].map((m) => m[1]);
    expect(targets.filter((target) => !slugs.has(target))).toEqual([]);
  });

  test("names only real Skills and Built-in commands in backticks", async () => {
    expect(unknownSlashNames(bodyText(await load(slug)))).toEqual([]);
  });
});
