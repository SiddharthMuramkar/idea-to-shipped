import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { coursesFrom, type Question } from "@/lessons/lessons";
import { FinalTest } from "./final-test";
import { QuickCheck, withoutLinks } from "./quick-check";
import { LessonArticle } from "./section";

// What the server sends, which is also what a Visitor without JavaScript
// gets: every question with its own "Show the answer" box, outside
// <noscript>. In the browser the page's code then turns them into one-tap
// Quick checks and a Final test to submit.

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

const finalTest = (questions: Question[]) =>
  renderToStaticMarkup(
    <FinalTest questions={questions} slug="full" id="final-test" titleHtml="Final test" next={null} />,
  );

describe("a Quick check, as the server sends it", () => {
  test('is labelled "Quick check" and shows its answer and why each option is right or wrong, outside <noscript>', async () => {
    const [checkpoint] = (await questions()).checkpoints;
    const html = renderToStaticMarkup(<QuickCheck question={checkpoint} slug="full" />);

    expect(html).toContain("Quick check</p>");
    expect(html).not.toContain("<noscript>");
    const boxes = answerBoxes(html);
    expect(boxes).toHaveLength(1);
    expect(boxes[0]).toContain("<summary>Show the answer</summary>");
    expect(boxes[0]).toContain(rightAnswer(checkpoint));
    for (const option of checkpoint.options) expect(boxes[0]).toContain(option.feedbackHtml);
  });

  test("shows its Why: line under the answer, and lists no options when none has feedback", async () => {
    const [, why] = (await questions()).checkpoints;
    const [box] = answerBoxes(renderToStaticMarkup(<QuickCheck question={why} slug="full" />));

    expect(box).toContain(`${rightAnswer(why)}</p><p class="question-explanation">${why.explanationHtml}</p>`);
    expect(box).not.toContain("question-answer-list");
  });

  test("has no buttons until the page's code runs, so nothing on it is dead without JavaScript", async () => {
    const [checkpoint] = (await questions()).checkpoints;
    const html = renderToStaticMarkup(<QuickCheck question={checkpoint} slug="full" />);
    expect(html).not.toContain("<button");
    expect(html).toContain('type="radio"');
  });

  test("an option's link keeps its words but not its link, since options are buttons", () => {
    expect(withoutLinks('See <a href="/learn/handoff">handoff</a>, then <code>/x</code>')).toBe(
      "See <span>handoff</span>, then <code>/x</code>",
    );
  });
});

describe("the Final test, as the server sends it", () => {
  test("gives every question its own answer box, numbered", async () => {
    const { finalTest: all } = await questions();
    const html = finalTest(all);

    const boxes = answerBoxes(html);
    expect(boxes).toHaveLength(all.length);
    all.forEach((question, i) => expect(boxes[i]).toContain(rightAnswer(question)));
    expect(html).toContain(`Question 1 of ${all.length}`);
  });

  test("lists only the options that have feedback, beside the explanation", async () => {
    const mixed = (await questions()).finalTest.find((question) => question.id === "pick-the-skill")!;
    const [box] = answerBoxes(finalTest([mixed]));

    expect(box).toContain(`<p class="question-explanation">${mixed.explanationHtml}</p>`);
    expect(box.match(/<li/g)).toHaveLength(1);
    expect(box).toContain("It reviews code once there is some.");
  });

  test("has no Submit button, score or Done banner until the page's code runs", async () => {
    const html = finalTest((await questions()).finalTest);

    expect(html).not.toContain("<button");
    expect(html).not.toContain("Submit test");
    expect(html).not.toContain("done-banner");
    expect(html).not.toContain("<noscript>");
  });
});

describe("option order", () => {
  test("is shuffled on the server, the same way every time, keeping each option's id", async () => {
    const lesson = (await full.getLesson("full"))!;
    const html = renderToStaticMarkup(<LessonArticle lesson={lesson} />);
    const again = renderToStaticMarkup(<LessonArticle lesson={lesson} />);
    expect(again).toBe(html);

    // pick-the-skill is written a, b, c, d, e, f.
    const block = /<li class="question final-question" data-question="pick-the-skill">[\s\S]*?<\/li>/.exec(html)?.[0] ?? "";
    const order = [...block.matchAll(/data-option="([a-f])"/g)].map(([, id]) => id);
    expect([...order].sort()).toEqual(["a", "b", "c", "d", "e", "f"]);
    expect(order).not.toEqual(["a", "b", "c", "d", "e", "f"]);
  });
});
