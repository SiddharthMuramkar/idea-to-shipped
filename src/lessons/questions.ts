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

// A question block reads:
//   The prompt, on one or more lines.
//   - [ ] A wrong option
//     > Feedback shown when it's picked (one or more "> " lines).
//   - [x] The right option
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
    const option = /^- \[( |x)\] (.*)$/.exec(line);
    const feedback = /^\s*> ?(.*)$/.exec(line);
    if (option) {
      if (option[2].trim() === "") throw fail(`option ${OPTION_IDS[drafts.length] ?? "?"} is empty`);
      drafts.push({ text: option[2].trim(), correct: option[1] === "x", feedback: [] });
    } else if (line.startsWith("- [")) {
      throw fail(`"${line.trim()}": options start with "- [ ] " or "- [x] "`);
    } else if (feedback) {
      if (drafts.length === 0) throw fail(`"${line.trim()}": feedback comes after an option`);
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
