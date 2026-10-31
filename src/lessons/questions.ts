import { renderInline, type Fail } from "./markdown";

// Options are known by their position, never by their text (ADR 0005).
const OPTION_IDS = ["a", "b", "c", "d"] as const;

// Question ids are permanent, like slugs (ADR 0005): kebab-case, unique
// within their Lesson.
const QUESTION_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_ID_LENGTH = 40;

export type QuestionOption = { id: (typeof OPTION_IDS)[number]; html: string; feedbackHtml: string };

export type Question = {
  id: string;
  kind: "checkpoint" | "final-test";
  promptHtml: string;
  options: QuestionOption[];
  // The answer key: the one right option. (An Answer is a Visitor's pick.)
  correctOption: QuestionOption["id"];
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
  const fail: Fail = (problem) => new Error(`${file}: ${kind} "${id}": ${problem}`);
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
      if (option[2].trim() === "") {
        throw fail(`option ${OPTION_IDS[drafts.length] ?? "?"} is empty: write its text after the box`);
      }
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

  const promptHtml = renderInline(prompt.join(" "), fail);
  const options = drafts.map((draft, i) => ({
    id: OPTION_IDS[i],
    html: renderInline(draft.text, fail),
    feedbackHtml: renderInline(draft.feedback.join(" "), fail),
  }));
  const correctOption = options[drafts.findIndex((d) => d.correct)].id;
  return { id, kind, promptHtml, options, correctOption };
}
