import { allQuestions, type Block, type Lesson, type Photo, type Question } from "./lessons";
import { htmlToText } from "./markdown";

// The content lint's rules, which course.test.ts runs on every Course in
// content/. The loader already checks how a Course's files fit together (a
// course.md without a description doesn't load), and the parser how each
// Lesson is written; these rules check what a Lesson says. Each check
// returns one message per problem, saying what's wrong and how to fix it, so
// an author can fix a Lesson from the message alone.

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

// Links to /learn/<slug> must reach a Lesson, in any Course.
export function checkLessonLinks(lesson: Lesson, slugs: ReadonlySet<string>): string[] {
  return [...bodyText(lesson).matchAll(/href="\/learn\/([^"#?/]+)/g)]
    .map(([, slug]) => slug)
    .filter((slug) => !slugs.has(slug))
    .map((slug) => `links to /learn/${slug}, but no Lesson has the slug "${slug}": point the link at an existing Lesson's Slug`);
}

// Submitting the Final test is what marks a Lesson Done, so every Lesson
// ends with one, big enough to cover what it taught.
export const FINAL_TEST_MIN = 5;

// What to call a block in a message, the way its fence names it.
const BLOCK_NAMES: Record<Block["type"], string> = {
  prose: "text",
  goals: "a goals block",
  scene: "a Scene",
  checkpoint: "a checkpoint",
  finalTest: "another Final test",
  callout: "a callout",
  try: "a try block",
  siteStory: "a site-story block",
  sources: "a sources block",
  flashcards: "a flashcards block",
  diagram: "a diagram",
};

// The parser has already made the Final test one run of final-test blocks
// in one Section. This checks where that Section is, and what follows it.
export function checkFinalTest(lesson: Pick<Lesson, "sections">): string[] {
  const { sections } = lesson;
  const at = sections.findIndex((section) => section.blocks.some((block) => block.type === "finalTest"));
  if (at === -1) {
    return [
      `has no Final test: end it with a "## Final test" Section of at least ${FINAL_TEST_MIN} \`\`\`final-test <id> blocks`,
    ];
  }
  const section = sections[at];
  const index = section.blocks.findIndex((block) => block.type === "finalTest");
  const finalTest = section.blocks[index] as Extract<Block, { type: "finalTest" }>;
  const problems: string[] = [];

  const count = finalTest.questions.length;
  if (count < FINAL_TEST_MIN) {
    problems.push(
      `its Final test has ${count} question${count === 1 ? "" : "s"}: it needs at least ${FINAL_TEST_MIN}, each a \`\`\`final-test <id> block`,
    );
  }
  if (at !== sections.length - 1) {
    problems.push(
      `its Final test is in "${section.title}", but it goes in the Lesson's last ## Section: move the Final test, and the sources after it, to the end`,
    );
  }
  if (section.title.trim().toLowerCase() !== "final test") {
    problems.push(`its Final test sits under "## ${section.title}": title that Section "Final test"`);
  }
  // Only the sources may follow: the questions are the Lesson's last word.
  let sources = 0;
  for (const block of section.blocks.slice(index + 1)) {
    if (block.type === "sources") {
      if (++sources === 2) problems.push("has two sources blocks after its Final test: merge them into one");
      continue;
    }
    problems.push(
      `has ${BLOCK_NAMES[block.type]} after its Final test's questions: only a sources block may follow them, so move it above the Final test`,
    );
  }
  return problems;
}

export const SUMMARY_MAX = 200;

// Cards show the summary, so it's one short plain sentence.
export function checkSummary(lesson: Pick<Lesson, "summary">): string[] {
  if (!lesson.summary) {
    return [
      `has no summary: add a "summary: …" line to its header, one plain sentence of at most ${SUMMARY_MAX} characters saying what it teaches (cards show it)`,
    ];
  }
  const length = [...lesson.summary].length;
  if (length <= SUMMARY_MAX) return [];
  return [`its summary has ${length} characters: shorten it to at most ${SUMMARY_MAX}`];
}

// "All of the above" and "none of the above" test ruling options out, not
// understanding. The site shuffles options too, so "above" means nothing.
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

// The Skills the Courses teach: every Skill in the skills Course's snapshot
// (mattpocock-skills 1.3.1, and the few others it covers). A Lesson may name
// one bare (`/grilling`), or one of Matt's by its full name
// (`/mattpocock-skills:grilling`).
export const SKILL_NAMESPACE = "mattpocock-skills";
export const SKILLS = new Set([
  "ask-matt", "chief-of-staff", "claude-handoff", "code-review", "codebase-design", "diagnosing-bugs",
  "domain-modeling", "git-guardrails-claude-code", "grill-me", "grill-with-docs", "grilling", "handoff",
  "implement", "implement-spec", "improve-codebase-architecture", "loop-me", "migrate-to-shoehorn",
  "orca-cli", "orchestration", "pr", "prototype", "research", "retro", "scaffold-exercises",
  "setup-matt-pocock-skills", "setup-pre-commit", "setup-ts-deep-modules", "tdd", "teach",
  "to-questionnaire", "to-spec", "to-tickets", "triage", "wait-what", "wayfinder", "wizard",
  "writing-beats", "writing-for-agents", "writing-fragments", "writing-shape",
]);

// Claude Code's Built-in commands and the Skills bundled with it, with their
// aliases, named bare, as the Claude Code docs' Commands page lists them
// (read 2026-11-05).
export const BUILT_IN_COMMANDS = new Set([
  "add-dir", "advisor", "agents", "artifact-capabilities", "artifact-diagramming", "artifacts",
  "auto-mode-setup", "autocompact", "autofix-pr", "background", "batch", "branch", "btw", "bug",
  "cd", "chrome", "claude-api", "claude-in-chrome", "clear", "code-review", "color", "compact",
  "config", "context", "copy", "cost", "dataviz", "debug", "deep-research", "design",
  "design-login", "design-sync", "desktop", "diff", "doctor", "effort", "exit", "export", "fast",
  "feedback", "fewer-permission-prompts", "focus", "fork", "goal", "heapdump", "help", "hooks",
  "ide", "import", "init", "insights", "install-github-app", "install-slack-app", "keybindings",
  "list-agents", "login", "logout", "loop", "mcp", "memory", "mobile", "model", "output-style",
  "passes", "permissions", "plan", "plugin", "plugin-authoring", "powerup", "pr-comments",
  "privacy-settings", "radio", "rate-limit-options", "recap", "release-notes", "reload-plugins",
  "reload-skills", "remote-control", "remote-env", "rename", "restart", "resume", "review",
  "rewind", "run", "run-skill-generator", "sandbox", "schedule", "scroll-speed",
  "security-review", "setup-bedrock", "setup-vertex", "simplify", "skill-doctor", "skills",
  "slides", "stats", "status", "statusline", "stickers", "stop", "subtask", "tasks",
  "team-onboarding", "teleport", "terminal-setup", "theme", "tui", "ultraplan", "ultrareview",
  "update-config", "upgrade", "usage", "usage-credits", "verify", "vim", "voice", "web-setup",
  "workflow-authoring", "workflows",
  // Aliases.
  "allowed-tools", "android", "app", "bashes", "checkpoint", "ios", "peers", "quit", "rc", "tp",
  "undo", "update",
]);

// Folders at the root of a Unix file system. `/tmp` is a path, not a name.
const ROOT_FOLDERS = new Set(["bin", "dev", "etc", "home", "opt", "tmp", "usr", "var"]);

// Every backticked `/name` or `/namespace:name` in some rendered HTML that
// isn't a known Skill or Built-in command, in the order they appear. This
// catches stale names such as /to-prd. Paths such as /learn/grilling have a
// second "/", so they never match.
export function unknownSlashNames(html: string): string[] {
  return [...html.matchAll(/<code>\/([a-z][a-z0-9-]*)(?::([a-z][a-z0-9-]*))?<\/code>/g)]
    .filter(([, first, second]) =>
      second === undefined
        ? !SKILLS.has(first) && !BUILT_IN_COMMANDS.has(first) && !ROOT_FOLDERS.has(first)
        : first !== SKILL_NAMESPACE || !SKILLS.has(second),
    )
    .map(([, first, second]) => (second === undefined ? `/${first}` : `/${first}:${second}`));
}

export function checkSlashNames(lesson: Lesson): string[] {
  return unknownSlashNames(bodyText(lesson)).map(
    (name) =>
      `names \`${name}\`, which is neither a Skill the Courses teach nor a Built-in command: use its current name, or add a new one to SKILLS or BUILT_IN_COMMANDS in src/lessons/course-lint.ts`,
  );
}

// The licences an image may have: CC0, public domain ("Public domain" or a
// "PD…" mark, as Wikimedia Commons names them), or CC BY or CC BY-SA in any
// version, with or without a country ("CC BY-SA 3.0 de").
const OPEN_LICENSE = /^(?:CC0(?: 1\.0)?|Public domain|PD\b.*|CC BY(?:-SA)? \d\.\d(?: [A-Za-z-]+)?)$/i;

const CREDITS = "content/image-credits.json";

// A header's image (a Lesson's or a Course's) must be a real file, openly
// licensed and credited. `exists` says whether a path is under public/.
export function checkPhoto(photo: Photo | null, exists: (image: string) => boolean): string[] {
  if (!photo) return [];
  const { image, credit } = photo;
  const problems: string[] = [];
  if (!exists(image)) problems.push(`its image ${image} isn't in public/: add the file, or fix the header's image: path`);
  if (!credit) {
    return [
      ...problems,
      `its image ${image} has no credit: add "${image}" to ${CREDITS}, with its title, author, license, licenseUrl and source`,
    ];
  }
  if (!OPEN_LICENSE.test(credit.license.trim())) {
    problems.push(
      `its image ${image} has the license "${credit.license}" in ${CREDITS}: use an image licensed CC0, Public domain (PD…), CC BY or CC BY-SA instead`,
    );
  }
  if (credit.author.trim() === "") {
    problems.push(
      `its image ${image} has no author in ${CREDITS}: name who made it, or write "Unknown author" for a public-domain work`,
    );
  }
  if (!/^https:\/\/\S+$/.test(credit.source)) {
    problems.push(
      `its image ${image} has the source "${credit.source}" in ${CREDITS}: link the page it comes from, starting https://`,
    );
  }
  return problems;
}

// The rules every Lesson of every Course follows, one test each in
// course.test.ts. Links and images need more than the Lesson, so they're
// checked on their own there.
export const LESSON_RULES: { rule: string; check: (lesson: Lesson) => string[] }[] = [
  { rule: `ends with a Final test of at least ${FINAL_TEST_MIN} questions`, check: checkFinalTest },
  { rule: `has a summary of at most ${SUMMARY_MAX} characters`, check: checkSummary },
  { rule: 'has no "all of the above" or "none of the above" options', check: checkAllOrNone },
  { rule: 'never says "Lesson <number>"', check: checkLessonNumbers },
  { rule: "names only real Skills and Built-in commands", check: checkSlashNames },
];
