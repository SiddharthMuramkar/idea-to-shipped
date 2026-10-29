/**
 * Contract — questions.ts (one `checkpoint` / `test` fence body → Question).
 *
 * Inputs: `parseQuestion(file, kind, id, body)` where `kind` is
 * `"checkpoint" | "test"`, `id` is the fence's single argument (required),
 * and `body` is the raw text inside the fence. `file` is used only in errors.
 * Body grammar (see the worked example above parseQuestion): a one-paragraph
 * inline-text prompt first, then 3–4 options, each `- [ ] …` or `- [x] …`
 * starting at column 0, each followed by one or more `> …` feedback lines.
 *
 * Invariants an LLM / author can trust (ADR 0005):
 *   - Question ids are permanent, like Lesson slugs (ADR 0004): kebab-case
 *     (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`), at most 40 characters, unique within
 *     their Lesson across Checkpoints and the Final test combined
 *     (uniqueness is enforced by the caller, blocks.ts). Once published,
 *     never rename or reuse an id; changing what a question asks or which
 *     options it offers means a new id. Rewording is fine.
 *   - Options are known by position only — ids `a`–`d` in written order —
 *     never by text. Never reorder or remove a published question's options.
 *   - Exactly one option is `[x]`; `[X]` also counts. Every option must have
 *     non-empty feedback. The prompt must precede the options and must not
 *     contain block lines (bullets, numbered items, quotes, fences).
 *
 * Output: `Question = { id, kind, promptHtml, options, answer }` where each
 * option is `{ id: "a"…"d", html, feedbackHtml }` and `answer` is the correct
 * option's positional id. Prompt/option/feedback text is rendered inline.
 *
 * Errors: `throw new Error("<file>: <kind> \"<id>\": …")` for every rule
 * above (a missing id throws before the id is known). No defaults are invented.
 *
 * Fixture use: exercised through `lessonsFrom(__fixtures__/<case>)` in
 * lessons.test.ts (e.g. `questions`, `duplicate-question-id`,
 * `bad-question-id`, `two-answers`, `five-options`, `missing-feedback`,
 * `empty-prompt`). Add one fixture folder per new validation rule.
 */
import { renderInline } from "./markdown";

// Options are known by their position, never by their text (ADR 0005).
const OPTION_IDS = ["a", "b", "c", "d"] as const;

// Question ids are permanent, like slugs (ADR 0005): kebab-case, unique
// within their Lesson.
const QUESTION_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_ID_LENGTH = 40;

export type QuestionOption = { id: (typeof OPTION_IDS)[number]; html: string; feedbackHtml: string };

export type Question = {
  id: string;
  kind: "checkpoint" | "test";
  promptHtml: string;
  options: QuestionOption[];
  answer: QuestionOption["id"];
};

type DraftOption = { text: string; correct: boolean; feedback: string[] };

// A prompt line that Markdown would read as a block of its own: a bullet
// ("- ", "* ", "+ "), a numbered item ("1. "), a quote ("> ") or a code fence.
const BLOCK_LINE = /^(?:[-*+] |\d+[.)] |>|```|~~~)/;

// A question block reads:
//   The prompt: one paragraph of inline text, on one or more lines.
//   - [ ] A wrong option            (options start at the beginning of the line)
//     > Feedback shown when it's picked (one or more "> " lines).
//   - [x] The right option          ("[X]" works too)
//     > Feedback.
export function parseQuestion(
  file: string,
  kind: Question["kind"],
  id: string | undefined,
  body: string,
): Question {
  if (!id) throw new Error(`${file}: ${kind}: needs an id, as in "${kind} my-question"`);
  const fail = (problem: string) => new Error(`${file}: ${kind} "${id}": ${problem}`);
  if (!QUESTION_ID.test(id) || id.length > MAX_ID_LENGTH) {
    throw fail(
      `the id must be kebab-case (a-z, 0-9, single dashes), at most ${MAX_ID_LENGTH} characters`,
    );
  }

  const prompt: string[] = [];
  const drafts: DraftOption[] = [];
  for (const line of body.split("\n")) {
    if (line.trim() === "") continue;
    const option = /^- \[([ xX])\] (.*)$/.exec(line);
    const feedback = /^\s*> ?(.*)$/.exec(line);
    if (option) {
      if (option[2].trim() === "") throw fail(`option ${OPTION_IDS[drafts.length] ?? "?"} is empty`);
      drafts.push({ text: option[2].trim(), correct: option[1] !== " ", feedback: [] });
    } else if (/^\s+- \[/.test(line)) {
      // An indented option would otherwise be read as part of the prompt.
      throw fail(`"${line.trimEnd()}": options must start at the beginning of the line ("- [ ]" / "- [x]")`);
    } else if (line.startsWith("- [")) {
      throw fail(`"${line.trim()}": options start with "- [ ] " or "- [x] "`);
    } else if (drafts.length === 0 && BLOCK_LINE.test(line.trimStart())) {
      // The prompt renders as one line of inline text, so a list, quote or
      // code block in it would be flattened into a run-on sentence.
      throw fail(
        `"${line.trim()}": prompts are one paragraph of inline text; put orderings inside the options`,
      );
    } else if (feedback) {
      drafts[drafts.length - 1].feedback.push(feedback[1].trim());
    } else if (drafts.length > 0) {
      throw fail(`"${line.trim()}": after the options, every line is an option or "> " feedback`);
    } else {
      prompt.push(line.trim());
    }
  }

  if (prompt.length === 0) throw fail("needs a prompt before the options");
  if (drafts.length < 3 || drafts.length > OPTION_IDS.length) {
    throw fail(`needs 3 or 4 options (found ${drafts.length})`);
  }
  if (drafts.filter((d) => d.correct).length !== 1) throw fail("needs exactly one [x] option");
  drafts.forEach((draft, i) => {
    if (draft.feedback.join("").trim() === "") {
      throw fail(`option ${OPTION_IDS[i]} needs feedback: a "> " line under it`);
    }
  });

  const options = drafts.map((draft, i) => ({
    id: OPTION_IDS[i],
    html: renderInline(draft.text),
    feedbackHtml: renderInline(draft.feedback.join(" ")),
  }));
  const answer = options[drafts.findIndex((d) => d.correct)].id;
  return { id, kind, promptHtml: renderInline(prompt.join(" ")), options, answer };
}
