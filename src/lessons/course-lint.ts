import type { Lesson, LessonSummary, Question } from "./lessons";
import { htmlToText } from "./markdown";

// Rules from the content lint (course.test.ts) that need their own tests: a
// lint rule that never fires on the real course would otherwise go unchecked.

// Lessons whose Part is lower than the Lesson before them, as "slug (Part n)
// comes after slug (Part m)". Lessons without a Part are skipped.
export function partsGoingBackwards(lessons: LessonSummary[]): string[] {
  const problems: string[] = [];
  lessons.forEach((lesson, i) => {
    const before = lessons[i - 1];
    if (!before?.part || !lesson.part || lesson.part.number >= before.part.number) return;
    problems.push(
      `${lesson.slug} (Part ${lesson.part.number}) comes after ${before.slug} (Part ${before.part.number})`,
    );
  });
  return problems;
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

// Every string in a value: HTML, captions, prompts, options and so on.
function allText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(allText).join("\n");
  if (value && typeof value === "object") return Object.values(value).map(allText).join("\n");
  return "";
}

// Everything a Lesson's own body says: the intro and every Section, with
// their HTML, captions, prompts and options. Not its header or its
// neighbours, whose titles belong to other Lessons.
export function bodyText(lesson: Pick<Lesson, "intro" | "sections">): string {
  return allText([lesson.intro, lesson.sections]);
}

// Every "Lesson <number>" in a Lesson's body. Numbers change when Lessons
// move, so the body names Lessons by title and links to /learn/<slug>.
export function lessonNumberMentions(lesson: Pick<Lesson, "intro" | "sections">): string[] {
  return bodyText(lesson).match(/Lesson \d+/g) ?? [];
}

// Questions whose right answer is longer than every wrong one, as "id: the
// right answer (b) has 61 characters, the longest wrong one 48". A guesser
// who always picks the longest option would get these right. Length is the
// text a reader sees; a tie gives nothing away, so it passes.
export function longestRightAnswers(questions: Question[]): string[] {
  const length = (html: string) => htmlToText(html).trim().length;
  return questions.flatMap((question) => {
    const right = question.options.find((option) => option.id === question.answer);
    if (!right) return [];
    const longestWrong = Math.max(
      ...question.options.filter((option) => option !== right).map((option) => length(option.html)),
    );
    if (length(right.html) <= longestWrong) return [];
    return [
      `${question.id}: the right answer (${right.id}) has ${length(right.html)} characters, the longest wrong one ${longestWrong}`,
    ];
  });
}

// Every "all of the above" or "none of the above" option, as "id (c)". Such
// an option tests ruling things out, not understanding.
export function allOrNoneOfTheAbove(questions: Question[]): string[] {
  return questions.flatMap((question) =>
    question.options
      .filter((option) => /\b(all|none) of the above\b/i.test(htmlToText(option.html)))
      .map((option) => `${question.id} (${option.id})`),
  );
}
