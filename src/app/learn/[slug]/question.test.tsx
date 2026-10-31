import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { coursesFrom, type Question } from "@/lessons/lessons";
import { Checkpoint, FinalTest } from "./question";

// Nothing grades the choices, so every question shows its own answer in a
// "Show the answer" box, with or without JavaScript, and nothing pretends it
// can be checked.

const full = coursesFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));

async function questions(): Promise<{ checkpoint: Question; finalTest: Question[] }> {
  const all = (await full.getQuestions("full"))!;
  return { checkpoint: all[0], finalTest: all.slice(1) };
}

function answerBoxes(html: string): string[] {
  return html.match(/<details class="question-answer">[\s\S]*?<\/details>/g) ?? [];
}

describe("Checkpoint", () => {
  test("shows its answer and why each option is right or wrong, outside <noscript>", async () => {
    const { checkpoint } = await questions();
    const html = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={1} total={1} />);

    expect(html).not.toContain("<noscript>");
    const boxes = answerBoxes(html);
    expect(boxes).toHaveLength(1);
    expect(boxes[0]).toContain("<summary>Show the answer</summary>");
    const right = checkpoint.options.find((option) => option.id === checkpoint.correctOption)!;
    expect(boxes[0]).toContain(`<strong>Answer: </strong><span>${right.html}</span>`);
    for (const option of checkpoint.options) expect(boxes[0]).toContain(option.feedbackHtml);
  });

  test("has no Check button or empty status line", async () => {
    const { checkpoint } = await questions();
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
    finalTest.forEach((question, i) => {
      const right = question.options.find((option) => option.id === question.correctOption)!;
      expect(boxes[i]).toContain(`<strong>Answer: </strong><span>${right.html}</span>`);
    });
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
