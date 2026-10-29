import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { lessonsFrom, type Question } from "@/lessons/lessons";
import { Checkpoint, FinalTest } from "./question";

// Press coverage for Checkpoints and the Final test: the journal restyle
// keeps the question markup exactly as question.tsx renders it today.
// Nothing grades yet (see question.tsx: ticket 05 adds checking later), so
// the grading contract pinned here is the honest one — no Check/submit
// affordance and no role="status" region pretending otherwise; the reader
// checks by opening the <details> answer box, with or without JavaScript.
// Markup only: rendered HTML on the server, no DB, no env files, no network.

const full = lessonsFrom(path.join(process.cwd(), "src/lessons/__fixtures__/full"));

async function questions(): Promise<{ checkpoint: Question; finalTest: Question[] }> {
  const all = (await full.getQuestions("full"))!;
  return { checkpoint: all[0], finalTest: all.slice(1) };
}

// Opening tags matching `pattern`, in document order.
function tags(html: string, pattern: RegExp): string[] {
  return html.match(pattern) ?? [];
}

function attr(tag: string, name: string): string | undefined {
  return new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1];
}

// Whole blocks, in document order.
function blocks(html: string, pattern: RegExp): string[] {
  return html.match(pattern) ?? [];
}

function answerBoxes(html: string): string[] {
  return blocks(html, /<details class="question-answer">[\s\S]*?<\/details>/g);
}

function fieldsets(html: string): string[] {
  return blocks(html, /<fieldset[^>]*>[\s\S]*?<\/fieldset>/g);
}

// Every id="..." value in the HTML, in document order.
function domIds(html: string): string[] {
  return [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
}

// The DOM id question.tsx derives for one option (see questionIds there).
function optionId(slug: string, question: Question, optionId: string): string {
  return `q--${slug}--${question.id}--${optionId}`;
}

function radioName(slug: string, question: Question): string {
  return `q--${slug}--${question.id}`;
}

// Asserts one question's options render as labelled radios: one label and
// one radio per option, the label's `for` pointing at its input's id, all
// radios sharing the question's group name, in option order.
function expectLabelledOptions(html: string, slug: string, question: Question) {
  const inputs = tags(html, /<input[^>]*>/g);
  // Restrict to this question's group when several questions share a page.
  const mine = inputs.filter((tag) => attr(tag, "name") === radioName(slug, question));
  expect(mine).toHaveLength(question.options.length);

  const labelBlocks = blocks(html, /<label[^>]*>[\s\S]*?<\/label>/g).filter((block) =>
    block.includes(`name="${radioName(slug, question)}"`),
  );
  expect(labelBlocks).toHaveLength(question.options.length);

  question.options.forEach((option, i) => {
    const id = optionId(slug, question, option.id);

    expect(attr(mine[i], "type")).toBe("radio");
    expect(attr(mine[i], "id")).toBe(id);
    expect(attr(mine[i], "value")).toBe(option.id);

    const label = labelBlocks[i];
    expect(attr(label, "for")).toBe(id);
    expect(attr(label, "data-option")).toBe(option.id);
    // The label wraps its input and carries the option text.
    expect(label).toContain(`id="${id}"`);
    expect(label).toContain(`<span class="option-text">${option.html}</span>`);
  });
}

// Asserts one answer box shows the right answer and every option's feedback.
function expectAnswerBox(box: string, question: Question) {
  expect(box).toContain("<summary>Show the answer</summary>");
  const right = question.options.find((option) => option.id === question.answer)!;
  expect(box).toContain(`<strong>Answer: </strong><span>${right.html}</span>`);
  for (const option of question.options) expect(box).toContain(option.feedbackHtml);
  // Exactly the right option is marked correct.
  expect(box.match(/data-correct=""/g)).toHaveLength(1);
}

describe("Checkpoint (Press markup)", () => {
  test("renders one fieldset whose legend is the prompt", async () => {
    const { checkpoint } = await questions();
    const html = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={1} total={1} />);

    expect(html).toContain(`<div class="question checkpoint" data-checkpoint="${checkpoint.id}">`);
    const sets = fieldsets(html);
    expect(sets).toHaveLength(1);
    expect(sets[0]).toContain(`<fieldset class="question-fields" data-question="${checkpoint.id}">`);
    // The legend is the fieldset's prompt, first inside it.
    expect(sets[0]).toContain(
      `<legend class="question-prompt"><span>${checkpoint.promptHtml}</span></legend>`,
    );
    // A lone Checkpoint shows no "N of M" count.
    expect(html).not.toContain("question-count");
  });

  test("shows its position when it is one of several Checkpoints", async () => {
    const { checkpoint } = await questions();
    const html = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={2} total={3} />);

    expect(html).toContain('<span class="question-count"> 2 of 3</span>');
  });

  test("renders every option as a labelled radio input", async () => {
    const { checkpoint } = await questions();
    const html = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={1} total={1} />);

    expectLabelledOptions(html, "full", checkpoint);
    // One radio group for the question: every input shares its name.
    const names = tags(html, /<input[^>]*>/g).map((tag) => attr(tag, "name"));
    expect(new Set(names)).toEqual(new Set([radioName("full", checkpoint)]));
  });

  test("has no Check/submit grading affordance and no role=status region", async () => {
    const { checkpoint } = await questions();
    const html = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={1} total={1} />);

    expect(html).not.toContain("<button");
    expect(html).not.toContain('type="submit"');
    expect(html).not.toContain("<form");
    expect(html).not.toContain("aria-disabled");
    expect(html).not.toContain('role="status"');
  });

  test("shows the answer in a <details> box that works without JavaScript", async () => {
    const { checkpoint } = await questions();
    const html = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={1} total={1} />);

    expect(html).not.toContain("<noscript>");
    const boxes = answerBoxes(html);
    expect(boxes).toHaveLength(1);
    expectAnswerBox(boxes[0], checkpoint);
  });

  test("keeps question ids stable and namespaced in the DOM", async () => {
    const { checkpoint } = await questions();
    const render = () =>
      renderToStaticMarkup(<Checkpoint question={checkpoint} slug="full" number={1} total={1} />);
    const html = render();

    // Re-rendering yields byte-identical markup: no generated ids.
    expect(render()).toBe(html);

    // The only ids present are the option inputs, exactly as derived.
    const expected = checkpoint.options.map((option) => optionId("full", checkpoint, option.id));
    expect(domIds(html)).toEqual(expected);
    expect(new Set(domIds(html)).size).toBe(expected.length);
    // The permanent question id rides along verbatim.
    expect(html).toContain(`data-checkpoint="${checkpoint.id}"`);
    expect(html).toContain(`data-question="${checkpoint.id}"`);

    // Another Lesson's slug re-namespaces the ids; the question id is untouched.
    const other = renderToStaticMarkup(<Checkpoint question={checkpoint} slug="other-lesson" number={1} total={1} />);
    expect(domIds(other)).toEqual(
      checkpoint.options.map((option) => optionId("other-lesson", checkpoint, option.id)),
    );
    expect(other).toContain(`data-question="${checkpoint.id}"`);
    expect(other).not.toContain('id="q--full--');
  });
});

describe("Final test (Press markup)", () => {
  test("renders a ruled section landmark with heading and lead", async () => {
    const { finalTest } = await questions();
    const html = renderToStaticMarkup(
      <FinalTest questions={finalTest} slug="full" id="full--final-test" titleHtml="Final test" />,
    );

    expect(html).toContain('<section class="final-test" id="full--final-test"');
    expect(html).toContain('aria-labelledby="full--final-test--heading"');
    expect(html).toContain('<h2 id="full--final-test--heading">Final test</h2>');
    // The plain "Final test" title needs no eyebrow.
    expect(html).not.toContain('<p class="eyebrow">Final test</p>');
    expect(html).toContain(
      `<p class="final-test-lead">${finalTest.length} questions on everything above. ` +
        "Pick your answer, then open the box under it to check.</p>",
    );
    expect(html).toContain('<ol class="final-test-questions">');
  });

  test("keeps a custom title under the Final test eyebrow and counts one question", async () => {
    const { finalTest } = await questions();
    const html = renderToStaticMarkup(
      <FinalTest questions={[finalTest[0]]} slug="full" id="full--final-test" titleHtml="Check yourself" />,
    );

    expect(html).toContain('<p class="eyebrow">Final test</p>');
    expect(html).toContain('<h2 id="full--final-test--heading">Check yourself</h2>');
    expect(html).toContain('<p class="final-test-lead">One question on everything above.');
  });

  test("gives every question a fieldset whose legend carries its number and prompt", async () => {
    const { finalTest } = await questions();
    const html = renderToStaticMarkup(
      <FinalTest questions={finalTest} slug="full" id="full--final-test" titleHtml="Final test" />,
    );

    const sets = fieldsets(html);
    expect(sets).toHaveLength(finalTest.length);
    finalTest.forEach((question, i) => {
      expect(sets[i]).toContain(`<fieldset class="question-fields" data-question="${question.id}">`);
      expect(sets[i]).toContain(
        `<legend class="question-prompt"><span class="question-number">Question ${i + 1} of ${finalTest.length}</span>` +
          `<span>${question.promptHtml}</span></legend>`,
      );
      // Each question is one item of the ordered list, keyed by its id.
      expect(html).toContain(`<li class="question final-question" data-question="${question.id}">`);
    });
  });

  test("renders every option as a labelled radio input with per-question groups", async () => {
    const { finalTest } = await questions();
    const html = renderToStaticMarkup(
      <FinalTest questions={finalTest} slug="full" id="full--final-test" titleHtml="Final test" />,
    );

    for (const question of finalTest) expectLabelledOptions(html, "full", question);
    // Radio groups never bleed across questions.
    const names = tags(html, /<input[^>]*>/g).map((tag) => attr(tag, "name"));
    expect(new Set(names)).toEqual(new Set(finalTest.map((question) => radioName("full", question))));
  });

  test("has no Check/submit grading affordance, score card or role=status region", async () => {
    const { finalTest } = await questions();
    const html = renderToStaticMarkup(
      <FinalTest questions={finalTest} slug="full" id="full--final-test" titleHtml="Final test" />,
    );

    expect(html).not.toContain("<button");
    expect(html).not.toContain('type="submit"');
    expect(html).not.toContain("<form");
    expect(html).not.toContain("score-card");
    expect(html).not.toContain('role="status"');
    expect(html).not.toContain("needs JavaScript");
  });

  test("gives every question a <details> answer box that works without JavaScript", async () => {
    const { finalTest } = await questions();
    const html = renderToStaticMarkup(
      <FinalTest questions={finalTest} slug="full" id="full--final-test" titleHtml="Final test" />,
    );

    expect(html).not.toContain("<noscript>");
    const boxes = answerBoxes(html);
    expect(boxes).toHaveLength(finalTest.length);
    finalTest.forEach((question, i) => expectAnswerBox(boxes[i], question));
  });

  test("keeps question ids stable, unique and in order in the DOM", async () => {
    const { finalTest } = await questions();
    const render = () =>
      renderToStaticMarkup(
        <FinalTest questions={finalTest} slug="full" id="full--final-test" titleHtml="Final test" />,
      );
    const html = render();

    // Re-rendering yields byte-identical markup: no generated ids.
    expect(render()).toBe(html);

    // Ids appear in order: section, heading, then each question's options.
    const expected = [
      "full--final-test",
      "full--final-test--heading",
      ...finalTest.flatMap((question) =>
        question.options.map((option) => optionId("full", question, option.id)),
      ),
    ];
    expect(domIds(html)).toEqual(expected);
    expect(new Set(domIds(html)).size).toBe(expected.length);

    // Permanent question ids ride along verbatim, in reading order, on both
    // the list items and their fieldsets.
    const inOrder = [...html.matchAll(/<li class="question final-question" data-question="([^"]+)"/g)].map(
      (m) => m[1],
    );
    expect(inOrder).toEqual(finalTest.map((question) => question.id));
    const fieldsetOrder = fieldsets(html).map(
      (set) => /data-question="([^"]+)"/.exec(set)![1],
    );
    expect(fieldsetOrder).toEqual(finalTest.map((question) => question.id));
  });
});
