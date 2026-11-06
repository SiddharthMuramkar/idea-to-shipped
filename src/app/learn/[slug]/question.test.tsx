import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { coursesFrom, type Question } from "@/lessons/lessons";
import { Checkpoint, FinalTest } from "./question";

// Nothing grades the choices, so every question shows its own answer in a
// "Show the answer" box, with or without JavaScript, and nothing pretends it
// can be checked.

const full = coursesFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));

// The full fixture's questions: a Checkpoint with feedback on every option,
// one with only a Why: line, and a Final test that mixes both.
async function questions(): Promise<{ checkpoints: Question[]; finalTest: Question[] }> {
  const all = (await full.getQuestions("full"))!;
  return {
    checkpoints: all.filter((question) => question.kind === "checkpoint"),
    finalTest: all.filter((question) => question.kind === "final-test"),
  };
}

function answerBoxes(html: string): string[] {
  return html.match(/<details class="question-answer">[\s\S]*?<\/details>/g) ?? [];
}

const rightAnswer = (question: Question) =>
  `<strong>Answer: </strong><span>${question.options.find((option) => option.id === question.correctOption)!.html}</span>`;

describe("Checkpoint", () => {
  test("shows its answer and why each option is right or wrong, outside <noscript>", async () => {
    const [checkpoint] = (await questions()).checkpoints;
    const html = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={1} total={1} />);

    expect(html).not.toContain("<noscript>");
    const boxes = answerBoxes(html);
    expect(boxes).toHaveLength(1);
    expect(boxes[0]).toContain("<summary>Show the answer</summary>");
    expect(boxes[0]).toContain(rightAnswer(checkpoint));
    for (const option of checkpoint.options) expect(boxes[0]).toContain(option.feedbackHtml);
  });

  test("shows its Why: line under the answer, and lists no options when none has feedback", async () => {
    const [, why] = (await questions()).checkpoints;
    const [box] = answerBoxes(renderToStaticMarkup(<Checkpoint question={why} slug="full" number={2} total={2} />));

    expect(box).toContain(`${rightAnswer(why)}</p><p class="question-explanation">${why.explanationHtml}</p>`);
    expect(box).not.toContain("question-answer-list");
  });

  test("has no Check button or empty status line", async () => {
    const [checkpoint] = (await questions()).checkpoints;
    const html = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={1} total={1} />);

    expect(html).not.toContain("<button");
    expect(html).not.toContain("aria-disabled");
    expect(html).not.toContain('role="status"');
  });
});

describe("Final test", () => {
  test("gives every question its own answer box", async () => {
    const { finalTest } = await questions();
    const html = renderToStaticMarkup(
      <FinalTest questions={finalTest} slug="full" id="full--final-test" titleHtml="Final test" />,
    );

    const boxes = answerBoxes(html);
    expect(boxes).toHaveLength(finalTest.length);
    finalTest.forEach((question, i) => expect(boxes[i]).toContain(rightAnswer(question)));
  });

  test("lists only the options that have feedback, beside the explanation", async () => {
    const { finalTest } = await questions();
    const mixed = finalTest.find((question) => question.id === "pick-the-skill")!;
    const [box] = answerBoxes(
      renderToStaticMarkup(<FinalTest questions={[mixed]} slug="full" id="full--final-test" titleHtml="Final test" />),
    );

    expect(box).toContain(`<p class="question-explanation">${mixed.explanationHtml}</p>`);
    expect(box.match(/<li/g)).toHaveLength(1);
    expect(box).toContain("It reviews code once there is some.");
  });

  test("has no score card, Check button or JavaScript-only note", async () => {
    const { finalTest } = await questions();
    const html = renderToStaticMarkup(
      <FinalTest questions={finalTest} slug="full" id="full--final-test" titleHtml="Final test" />,
    );

    expect(html).not.toContain("score-card");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<noscript>");
    expect(html).not.toContain("needs JavaScript");
  });
});
