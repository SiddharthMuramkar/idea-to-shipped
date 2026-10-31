import { allBlocks, allQuestions, countWords, type Block, type Lesson, type Question } from "./lessons";
import { htmlToText } from "./markdown";

// The content lint's rules for Lessons, which course.test.ts runs on every
// Course in content/. The loader already checks how a Course's files fit
// together, and the parser how each Lesson is written; these rules check what
// a Lesson says. Each check returns one message per problem, saying what's
// wrong and how to fix it, so an author can fix a Lesson from the message
// alone. Every Course follows checkLessonLinks; the EDITORIAL_RULES are the
// Idea to shipped Course's house style, and no other Course follows them.

type Range = [min: number, max: number];

function inRange(n: number, [min, max]: Range) {
  return n >= min && n <= max;
}

function blocksOf<T extends Block["type"]>(lesson: Lesson, type: T) {
  return allBlocks(lesson).filter((block): block is Extract<Block, { type: T }> => block.type === type);
}

// A question named the way its fence names it: checkpoint "my-id".
const label = (question: Question) => `${question.kind} "${question.id}"`;

function allText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(allText).join("\n");
  if (value && typeof value === "object") return Object.values(value).map(allText).join("\n");
  return "";
}

// Everything a Lesson's own body says, not its header or its neighbours,
// whose titles belong to other Lessons.
function bodyText(lesson: Pick<Lesson, "intro" | "sections">): string {
  return allText([lesson.intro, lesson.sections]);
}

// Every Course: links to /learn/<slug> must reach a Lesson, in any Course.
export function checkLessonLinks(lesson: Lesson, slugs: ReadonlySet<string>): string[] {
  return [...bodyText(lesson).matchAll(/href="\/learn\/([^"#?/]+)/g)]
    .map(([, slug]) => slug)
    .filter((slug) => !slugs.has(slug))
    .map((slug) => `links to /learn/${slug}, but no Lesson has the slug "${slug}": point the link at an existing Lesson's Slug`);
}

export function checkGoals(lesson: Lesson): string[] {
  const goals = blocksOf(lesson, "goals");
  if (goals.length === 0) return ["has no goals block: open the Lesson with a ```goals block listing 3 or 4 goals"];
  if (goals.length > 1) return [`has ${goals.length} goals blocks: keep one, before the first ## heading`];
  const count = goals[0].itemsHtml.length;
  return inRange(count, [3, 4]) ? [] : [`its goals block lists ${count} goals: list 3 or 4`];
}

export function checkScenes(lesson: Lesson): string[] {
  if (blocksOf(lesson, "scene").length > 0) return [];
  return ["has no Scene: picture an idea with a ```scene block (chat, terminal, flow, files or meter) in one of its Sections"];
}

export function checkCheckpoints(lesson: Lesson): string[] {
  const count = blocksOf(lesson, "checkpoint").length;
  if (inRange(count, [3, 5])) return [];
  return [`has ${count} Checkpoints: it needs 3 to 5, each a \`\`\`checkpoint <id> block right after the idea it checks`];
}

const FINAL_TEST_SIZE: Record<string, Range> = {
  "start-here": [5, 6],
  "main-flow": [8, 15],
};
const DEFAULT_FINAL_TEST_SIZE: Range = [8, 10];

export function checkFinalTest(lesson: Lesson): string[] {
  const [min, max] = FINAL_TEST_SIZE[lesson.slug] ?? DEFAULT_FINAL_TEST_SIZE;
  const [finalTest] = blocksOf(lesson, "finalTest");
  if (!finalTest) {
    return [`has no Final test: end it with a "## Final test" Section of ${min} to ${max} \`\`\`final-test <id> blocks`];
  }
  const count = finalTest.questions.length;
  return inRange(count, [min, max]) ? [] : [`its Final test has ${count} questions: it needs ${min} to ${max}`];
}

// The kinds of question a Final test mixes, told apart by how their ids
// start. Start here's short Final test doesn't mix them.
const QUESTION_MIX = [
  { prefix: "scenario-", min: 3, kind: "a situation to act in" },
  { prefix: "spot-", min: 2, kind: "a mistake to spot" },
  { prefix: "sequence-", min: 1, kind: "steps to put in order" },
];

export function checkQuestionMix(lesson: Lesson): string[] {
  if (lesson.slug === "start-here") return [];
  const ids = blocksOf(lesson, "finalTest").flatMap((block) => block.questions.map((question) => question.id));
  return QUESTION_MIX.flatMap(({ prefix, min, kind }) => {
    const count = ids.filter((id) => id.startsWith(prefix)).length;
    if (count >= min) return [];
    return [
      `its Final test has ${count} "${prefix}" questions (${kind}): it needs at least ${min}, each with an id that starts "${prefix}"`,
    ];
  });
}

// The 12 Slugs the site launched with. Each of them tells its Site story.
const SITE_STORY_SLUGS = new Set([
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
]);

export function checkSiteStory(lesson: Lesson): string[] {
  if (!SITE_STORY_SLUGS.has(lesson.slug) || blocksOf(lesson, "siteStory").length > 0) return [];
  return [
    "has no Site story: add a ```site-story block telling how the author really used it building this site (every Lesson the site launched with tells one)",
  ];
}

// Questions whose correct option is longer than every wrong one: a guesser
// who always picks the longest option gets them right. Length is the text a
// reader sees; a tie gives nothing away, so it passes.
export function checkLongestOption(lesson: Lesson): string[] {
  const length = (html: string) => htmlToText(html).trim().length;
  return allQuestions(lesson).flatMap((question) => {
    const correct = question.options.find((option) => option.id === question.correctOption);
    if (!correct) return [];
    const longestWrong = Math.max(
      ...question.options.filter((option) => option !== correct).map((option) => length(option.html)),
    );
    if (length(correct.html) <= longestWrong) return [];
    return [
      `${label(question)}: the correct option (${correct.id}) has ${length(correct.html)} characters and the longest wrong one ${longestWrong}, so picking the longest option gives it away: shorten the correct option or lengthen a wrong one`,
    ];
  });
}

// "All of the above" and "none of the above" test ruling options out, not
// understanding.
export function checkAllOrNone(lesson: Lesson): string[] {
  return allQuestions(lesson).flatMap((question) =>
    question.options
      .filter((option) => /\b(all|none) of the above\b/i.test(htmlToText(option.html)))
      .map(
        (option) =>
          `${label(question)}: option ${option.id} is "${htmlToText(option.html).trim()}": replace it with an answer of its own, since it tests ruling options out rather than understanding`,
      ),
  );
}

export function checkSources(lesson: Lesson): string[] {
  const sources = blocksOf(lesson, "sources");
  if (sources.length === 0) {
    return ["has no sources block: end it with a ```sources block listing at least 3 sources, each a Markdown link"];
  }
  if (sources.length > 1) return [`has ${sources.length} sources blocks: merge them into one`];
  const items = sources[0].html.match(/<li>[\s\S]*?<\/li>/g) ?? [];
  return [
    ...(items.length >= 3 ? [] : [`its sources block lists ${items.length} sources: list at least 3`]),
    ...items
      .filter((item) => !item.includes("<a href="))
      .map((item) => `source "${htmlToText(item).trim()}" has no link: write it as [title](https://…)`),
  ];
}

const WORD_RANGE: Record<string, Range> = { "start-here": [900, 1400] };
const DEFAULT_WORD_RANGE: Range = [1800, 3000];

export function checkWordCount(lesson: Lesson): string[] {
  const [min, max] = WORD_RANGE[lesson.slug] ?? DEFAULT_WORD_RANGE;
  const words = countWords(lesson);
  if (inRange(words, [min, max])) return [];
  return [
    `has ${words} words of running text: it needs ${min} to ${max} (prose, callouts, try and Site story blocks count; headings, code, goals, Scenes, questions and sources don't)`,
  ];
}

// Every "Lesson <number>" in a Lesson's body. Numbers change when Lessons
// move, so the body names Lessons by title and links to /learn/<slug>.
export function lessonNumberMentions(lesson: Pick<Lesson, "intro" | "sections">): string[] {
  return bodyText(lesson).match(/Lesson \d+/g) ?? [];
}

export function checkLessonNumbers(lesson: Lesson): string[] {
  return lessonNumberMentions(lesson).map(
    (mention) =>
      `says "${mention}": a Lesson's number changes whenever Lessons move, so name the Lesson by its title and link to /learn/<slug>`,
  );
}

// The Skills in mattpocock-skills 1.3.1. A Lesson may name one bare
// (`/grilling`) or by its full name (`/mattpocock-skills:grilling`).
export const SKILL_NAMESPACE = "mattpocock-skills";
export const SKILLS = new Set([
  "ask-matt", "grill-with-docs", "implement", "implement-spec", "improve-codebase-architecture",
  "retro", "setup-matt-pocock-skills", "to-spec", "to-tickets", "triage", "wayfinder",
  "code-review", "codebase-design", "diagnosing-bugs", "domain-modeling", "pr", "prototype",
  "research", "tdd", "wizard", "grill-me", "handoff", "teach", "to-questionnaire", "wait-what",
  "grilling", "writing-for-agents", "git-guardrails-claude-code", "setup-pre-commit",
  "migrate-to-shoehorn", "scaffold-exercises",
]);

// Claude Code's Built-in commands (and the Skills bundled with it), named bare.
export const BUILT_IN_COMMANDS = new Set([
  "clear", "compact", "context", "model", "effort", "fast", "rewind", "init", "help", "config",
  "permissions", "plan", "resume", "agents", "mcp", "hooks", "memory", "cost", "usage", "status",
  "doctor", "login", "logout", "plugin", "skills", "ultrareview", "review", "add-dir", "exit",
  "export", "terminal-setup", "vim", "btw", "reload-skills", "reload-plugins", "workflows",
  "autocompact", "simplify", "security-review", "loop", "schedule", "statusline",
]);

// Every backticked `/name` or `/namespace:name` in some rendered HTML that
// isn't a known Skill or Built-in command, in the order they appear. This
// catches stale names such as /to-prd. Paths such as /learn/grilling have a
// second "/", so they never match.
export function unknownSlashNames(html: string): string[] {
  return [...html.matchAll(/<code>\/([a-z][a-z0-9-]*)(?::([a-z][a-z0-9-]*))?<\/code>/g)]
    .filter(([, first, second]) =>
      second === undefined
        ? !SKILLS.has(first) && !BUILT_IN_COMMANDS.has(first)
        : first !== SKILL_NAMESPACE || !SKILLS.has(second),
    )
    .map(([, first, second]) => (second === undefined ? `/${first}` : `/${first}:${second}`));
}

export function checkSlashNames(lesson: Lesson): string[] {
  return unknownSlashNames(bodyText(lesson)).map(
    (name) =>
      `names \`${name}\`, which is neither a Skill in ${SKILL_NAMESPACE} 1.3.1 nor a Built-in command: use its current name, or add a new one to SKILLS or BUILT_IN_COMMANDS in src/lessons/course-lint.ts`,
  );
}

// The Idea to shipped Course's house style, one rule per test in
// course.test.ts.
export const EDITORIAL_RULES: { rule: string; check: (lesson: Lesson) => string[] }[] = [
  { rule: "opens with one goals block of 3 or 4 goals", check: checkGoals },
  { rule: "has at least one Scene", check: checkScenes },
  { rule: "has 3 to 5 Checkpoints", check: checkCheckpoints },
  { rule: "ends with a Final test of the right size", check: checkFinalTest },
  { rule: 'mixes "scenario-", "spot-" and "sequence-" questions in its Final test', check: checkQuestionMix },
  { rule: "tells its Site story, if the site launched with it", check: checkSiteStory },
  { rule: "never makes the correct option the longest one", check: checkLongestOption },
  { rule: 'has no "all of the above" or "none of the above" options', check: checkAllOrNone },
  { rule: "has one sources block of at least 3 linked sources", check: checkSources },
  { rule: "has the right amount of running text", check: checkWordCount },
  { rule: 'never says "Lesson <number>"', check: checkLessonNumbers },
  { rule: "names only real Skills and Built-in commands", check: checkSlashNames },
];
