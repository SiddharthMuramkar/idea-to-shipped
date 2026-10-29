import type { ReactNode } from "react";
import type { Question } from "@/lessons/lessons";
import { Icon } from "./icons";

// Checkpoints and the Final test as plain server markup: native radios in a
// fieldset, and under each question a "Show the answer" box. Nothing grades
// yet (ticket 05 adds checking, scores and crowd stats), so there's no Check
// button to pretend otherwise: the reader picks an option, then opens the box
// to compare. It works the same with or without JavaScript.

// Grading contract — Checkpoint vs Final test:
// - Shipped behaviour grades neither. Checkpoint and FinalTest share
//   QuestionFields (the radios) and AnswerReveal (the "Show the answer"
//   box with the right option and per-option feedbackHtml), so today
//   both are manual self-checks: pick, open the box, compare. There is
//   deliberately no Check button, score, or status line to fake it.
// - Checkpoint is one Question where it was written in the text column
//   (<div class="question checkpoint" data-checkpoint> with a
//   "Checkpoint [n of total]" kicker). By definition (GLOSSARY) it gives
//   instant feedback and never counts towards passing the Lesson.
// - FinalTest is every `test` Question of the Section together in one
//   ruled section (<section class="final-test" data-section
//   data-final-test>, "Question i of N" labels, any preceding blocks as
//   children). By definition its Questions are checked together and
//   80% or more passes; one whole submission is an Attempt and the
//   latest Attempt decides. None of that scoring exists yet — ticket 05
//   adds checking, scores and crowd stats without changing the markup
//   contract above, and Checkpoints stay uncounted when it lands.
//
// Ids and radio names are unique on the whole document, not just the Lesson:
// Next keeps up to three visited pages mounted, so two Lessons can be in the
// DOM at once. Slugs and question ids are kebab-case (single dashes), so "--"
// can't appear inside either and the parts never run together.
function questionIds(slug: string, questionId: string) {
  const base = `q--${slug}--${questionId}`;
  return { name: base, option: (optionId: string) => `${base}--${optionId}` };
}

// One question: the prompt as the legend, then its options as radio cards.
function QuestionFields({ question, slug, label }: { question: Question; slug: string; label?: string }) {
  const ids = questionIds(slug, question.id);
  return (
    <fieldset className="question-fields" data-question={question.id}>
      <legend className="question-prompt">
        {label && <span className="question-number">{label}</span>}
        <span dangerouslySetInnerHTML={{ __html: question.promptHtml }} />
      </legend>
      <div className="options">
        {question.options.map((option) => (
          <label key={option.id} className="option" htmlFor={ids.option(option.id)} data-option={option.id}>
            <input type="radio" id={ids.option(option.id)} name={ids.name} value={option.id} />
            <span className="option-text" dangerouslySetInnerHTML={{ __html: option.html }} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// The answer, closed until the reader opens it: the right option, then why
// each option is right or wrong.
function AnswerReveal({ question }: { question: Question }) {
  const right = question.options.find((option) => option.id === question.answer)!;
  return (
    <details className="question-answer">
      <summary>Show the answer</summary>
      <p>
        <strong>Answer: </strong>
        <span dangerouslySetInnerHTML={{ __html: right.html }} />
      </p>
      <ul className="question-answer-list">
        {question.options.map((option) => (
          <li key={option.id} data-correct={option.id === question.answer ? "" : undefined}>
            <span className="question-answer-option" dangerouslySetInnerHTML={{ __html: option.html }} />{" "}
            <span dangerouslySetInnerHTML={{ __html: option.feedbackHtml }} />
          </li>
        ))}
      </ul>
    </details>
  );
}

// A Checkpoint: one question in the text column.
export function Checkpoint({
  question,
  slug,
  number,
  total,
}: {
  question: Question;
  slug: string;
  number: number;
  total: number;
}) {
  return (
    <div className="question checkpoint" data-checkpoint={question.id}>
      <p className="question-kicker">
        <Icon name="checkpoint" />
        Checkpoint{total > 1 && <span className="question-count">{` ${number} of ${total}`}</span>}
      </p>
      <QuestionFields question={question} slug={slug} />
      <AnswerReveal question={question} />
    </div>
  );
}

// The Final test: a ruled section in the reading column with every `test`
// question in turn, each with its answer box. `children` are any blocks
// written before the questions in the same Section.
export function FinalTest({
  questions,
  slug,
  id,
  titleHtml,
  children,
}: {
  questions: Question[];
  slug: string;
  id: string;
  titleHtml: string;
  children?: ReactNode;
}) {
  const headingId = `${id}--heading`;
  const titled = titleHtml.trim().toLowerCase() !== "final test";
  return (
    <section className="final-test" id={id} aria-labelledby={headingId} data-section data-final-test>
      <div className="final-test-inner">
        <header className="final-test-head">
          {titled && <p className="eyebrow">Final test</p>}
          <h2 id={headingId} dangerouslySetInnerHTML={{ __html: titleHtml }} />
          <p className="final-test-lead">
            {questions.length === 1 ? "One question" : `${questions.length} questions`} on everything above.
            Pick your answer, then open the box under it to check.
          </p>
        </header>
        <div className="final-test-main">
          {children}
          <ol className="final-test-questions">
            {questions.map((question, i) => (
              <li key={question.id} className="question final-question" data-question={question.id}>
                <QuestionFields
                  question={question}
                  slug={slug}
                  label={`Question ${i + 1} of ${questions.length}`}
                />
                <AnswerReveal question={question} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
