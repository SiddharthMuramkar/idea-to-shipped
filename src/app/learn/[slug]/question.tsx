import type { ReactNode } from "react";
import type { Question } from "@/lessons/lessons";
import { PASS_PERCENT } from "@/quiz/limits";
import { Icon } from "./icons";

// Checkpoints and the Final test as plain server markup: native radios in a
// fieldset, a Check button and an empty status line. Ticket 05 makes them
// work in the browser; until then (and without JavaScript) nothing grades,
// and each Checkpoint offers its answer in a <details> instead.
//
// The forms use method="dialog": outside a <dialog>, submitting one does
// nothing at all, so pressing Check before the page's code runs can never
// reload the page. The buttons stay real submit buttons, marked
// aria-disabled until there's code to grade with.

// Ids and radio names are unique on the whole document, not just the Lesson:
// Next keeps up to three visited pages mounted, so two Lessons can be in the
// DOM at once. Slugs and question ids are kebab-case (single dashes), so "--"
// can't appear inside either and the parts never run together.
export function questionIds(slug: string, questionId: string) {
  const base = `q--${slug}--${questionId}`;
  return { name: base, option: (optionId: string) => `${base}--${optionId}`, status: `${base}--status` };
}

// One question: the prompt as the legend, then its options as radio cards.
export function QuestionFields({ question, slug, label }: { question: Question; slug: string; label?: string }) {
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

// The answer, for readers without JavaScript: the right option, then why
// each option is right or wrong.
function AnswerFallback({ question }: { question: Question }) {
  const right = question.options.find((option) => option.id === question.answer)!;
  return (
    <noscript>
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
    </noscript>
  );
}

// A Checkpoint: one question in the text column, its own <form>.
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
  const ids = questionIds(slug, question.id);
  return (
    <form className="question checkpoint" method="dialog" data-checkpoint={question.id} data-reveal>
      <p className="question-kicker">
        <Icon name="checkpoint" />
        Checkpoint{total > 1 && <span className="question-count">{` ${number} of ${total}`}</span>}
      </p>
      <QuestionFields question={question} slug={slug} />
      <div className="question-actions">
        <button type="submit" className="question-check" aria-disabled="true">
          Check
        </button>
        <p className="question-status" id={ids.status} role="status" />
      </div>
      <AnswerFallback question={question} />
    </form>
  );
}

// The score ring's slot, filled in by ticket 05. Until then it shows the
// size of the Final test and what it takes to pass.
function ScoreCard({ total }: { total: number }) {
  const needed = Math.ceil((total * PASS_PERCENT) / 100);
  return (
    <aside className="score-card" aria-label="Your score" data-score-card>
      <div className="score-ring" data-score-ring>
        <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          <circle className="score-ring-track" cx="60" cy="60" r="52" />
          <circle className="score-ring-fill" cx="60" cy="60" r="52" pathLength={100} />
        </svg>
        <p className="score-ring-label">
          <strong>{total}</strong> {total === 1 ? "question" : "questions"}
        </p>
      </div>
      <p className="score-pass">
        <strong>Pass mark: {PASS_PERCENT}%</strong>
        <span>
          {needed} of {total} right
        </span>
      </p>
    </aside>
  );
}

// The Final test: a full-width navy band with every `test` question in one
// form, a single "Check my answers" button, and the score card beside it
// (above it on phones). `children` are any blocks written before the
// questions in the same Section.
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
            Answer them all, then check your answers.
          </p>
        </header>
        <ScoreCard total={questions.length} />
        <div className="final-test-main">
          {children}
          <form className="final-test-form" method="dialog" data-final-test-form>
            <ol className="final-test-questions">
              {questions.map((question, i) => (
                <li key={question.id} className="question final-question" data-question={question.id}>
                  <QuestionFields
                    question={question}
                    slug={slug}
                    label={`Question ${i + 1} of ${questions.length}`}
                  />
                </li>
              ))}
            </ol>
            <div className="final-test-actions">
              <button type="submit" className="question-check final-test-check" aria-disabled="true">
                Check my answers
              </button>
              <p className="final-test-status" role="status" />
              <noscript>
                <p className="final-test-noscript">The Final test needs JavaScript to check your answers.</p>
              </noscript>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
