import type { ReactNode } from "react";
import type { Question } from "@/lessons/lessons";
import { Icon } from "./icons";

// Checkpoints and the Final test as plain server markup: native radios in a
// fieldset, and under each question a "Show the answer" box. Nothing grades
// the choices, so there's no Check button to pretend otherwise: the Visitor
// picks an option, then opens the box to compare. It works the same with or
// without JavaScript.

// Ids and radio names are unique on the whole document, not just the Lesson:
// Next keeps up to three visited pages mounted, so two Lessons can be in the
// DOM at once. Slugs and question ids are kebab-case (single dashes), so "--"
// can't appear inside either and the parts never run together.
function questionIds(slug: string, questionId: string) {
  const base = `q--${slug}--${questionId}`;
  return { name: base, option: (optionId: string) => `${base}--${optionId}` };
}

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

function AnswerReveal({ question }: { question: Question }) {
  const right = question.options.find((option) => option.id === question.correctOption)!;
  return (
    <details className="question-answer">
      <summary>Show the answer</summary>
      <p>
        <strong>Answer: </strong>
        <span dangerouslySetInnerHTML={{ __html: right.html }} />
      </p>
      <ul className="question-answer-list">
        {question.options.map((option) => (
          <li key={option.id} data-correct={option.id === question.correctOption ? "" : undefined}>
            <span className="question-answer-option" dangerouslySetInnerHTML={{ __html: option.html }} />{" "}
            <span dangerouslySetInnerHTML={{ __html: option.feedbackHtml }} />
          </li>
        ))}
      </ul>
    </details>
  );
}

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
    <div className="question checkpoint" data-checkpoint={question.id} data-reveal>
      <p className="question-kicker">
        <Icon name="checkpoint" />
        Checkpoint{total > 1 && <span className="question-count">{` ${number} of ${total}`}</span>}
      </p>
      <QuestionFields question={question} slug={slug} />
      <AnswerReveal question={question} />
    </div>
  );
}

// `children` are any blocks written before the questions in the same Section.
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
