import { renderInline, type Fail } from "./markdown";

// Options are known by their position, never by their text (ADR 0005).
const OPTION_IDS = ["a", "b", "c", "d", "e", "f"] as const;
// Two options make a true-or-false question; fewer isn't a choice.
const MIN_OPTIONS = 2;

// Question ids are permanent, like Slugs (ADR 0005).
const QUESTION_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_ID_LENGTH = 40;

export type QuestionOption = {
  id: (typeof OPTION_IDS)[number];
  html: string;
  // What picking this option tells the Visitor: "" when it has no "> " lines.
  feedbackHtml: string;
};

export type Question = {
  id: string;
  kind: "checkpoint" | "final-test";
  promptHtml: string;
  options: QuestionOption[];
  correctOption: QuestionOption["id"];
  // The "Why: …" line, explaining the answer. Null without one, when every
  // option has feedback of its own instead.
  explanationHtml: string | null;
};

type DraftOption = { text: string; correct: boolean; feedback: string[] };

// A prompt line that Markdown would read as a block of its own: a bullet
// ("- ", "* ", "+ "), a numbered item ("1. "), a quote ("> ") or a code fence.
const BLOCK_LINE = /^(?:[-*+] |\d+[.)] |>|```|~~~)/;

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
  let why: string | null = null;
  for (const line of body.split("\n")) {
    if (line.trim() === "") continue;
    const option = /^- \[([ xX])\] (.*)$/.exec(line);
    const feedback = /^\s*> ?(.*)$/.exec(line);
    const explanation = /^Why:(.*)$/.exec(line);
    if (why !== null) {
      // The Why: line ends the question, so nothing can be added to an
      // option after it, and a second line can't be told from a stray one.
      if (explanation) throw fail('has two "Why:" lines: keep one, and write the whole explanation on it');
      throw fail(
        option || feedback || line.startsWith("- [")
          ? `"${line.trim()}" comes after the "Why:" line: put every option and its feedback before it`
          : `"${line.trim()}" comes after the "Why:" line: write the whole explanation on that one line`,
      );
    }
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
    } else if (explanation) {
      if (drafts.length === 0) throw fail('the "Why:" line comes before the options: move it after the last one');
      why = explanation[1].trim();
      if (why === "") throw fail('"Why:" needs its explanation after it, on the same line');
    } else if (/^\s+Why:/.test(line)) {
      throw fail(`"${line.trim()}": the "Why:" line starts at the beginning of the line, not indented`);
    } else if (drafts.length === 0 && BLOCK_LINE.test(line.trimStart())) {
      // The prompt renders as one line of inline text, so a list, quote or
      // code block in it would be flattened into a run-on sentence.
      throw fail(
        `"${line.trim()}": prompts are one paragraph of inline text; put orderings inside the options`,
      );
    } else if (feedback) {
      drafts[drafts.length - 1].feedback.push(feedback[1].trim());
    } else if (drafts.length > 0) {
      throw fail(`"${line.trim()}": after the options, every line is an option, "> " feedback or the "Why: …" line`);
    } else {
      prompt.push(line.trim());
    }
  }

  if (prompt.length === 0) throw fail("needs a prompt before the options");
  if (drafts.length < MIN_OPTIONS || drafts.length > OPTION_IDS.length) {
    throw fail(`needs ${MIN_OPTIONS} to ${OPTION_IDS.length} options (found ${drafts.length})`);
  }
  if (drafts.filter((d) => d.correct).length !== 1) throw fail("needs exactly one [x] option");
  // After answering, the Visitor reads why: either the Why: line, or the
  // feedback under whichever option they picked.
  const quiet = drafts.findIndex((draft) => draft.feedback.join("").trim() === "");
  if (why === null && quiet !== -1) {
    throw fail(
      `needs a "Why: …" line after the options, explaining the answer, or "> " feedback under every option (option ${OPTION_IDS[quiet]} has none)`,
    );
  }

  const promptHtml = renderInline(prompt.join(" "), fail);
  const options = drafts.map((draft, i) => ({
    id: OPTION_IDS[i],
    html: renderInline(draft.text, fail),
    feedbackHtml: renderInline(draft.feedback.join(" "), fail),
  }));
  const correctOption = options[drafts.findIndex((d) => d.correct)].id;
  const explanationHtml = why === null ? null : renderInline(why, fail);
  return { id, kind, promptHtml, options, correctOption, explanationHtml };
}
