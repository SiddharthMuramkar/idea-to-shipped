"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode, type RefObject } from "react";
import { flushSync } from "react-dom";
import type { LessonDone } from "@/app/progress/progress";
import { progressStore } from "@/app/progress/store";
import { useHydrated, useProgress } from "@/app/progress/use-progress";
import type { Question } from "@/lessons/lessons";
import { firstUnanswered, grade, resultStands, type Answers, type Grade, type OptionId } from "./grade";
import { Icon } from "./icons";
import { AnswerReveal, QuestionFields, questionIds, radioToFocus } from "./question";

// The Lesson the "Next lesson" button goes to: the next in its Course, or the
// first of the next Course. Null after the very last Lesson.
export type NextLesson = { slug: string; title: string } | null;

const smoothly = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

// The Final test: a navy band of its own at the end of the Lesson. Every
// question needs an answer before "Submit test" works. Submitting shows the
// score, marks each question right or wrong with its right answer and why,
// and marks the Lesson Done in this browser, whatever the score. A Lesson
// already Done shows its last score above a fresh test.
//
// Until the page's code runs (and for good without JavaScript) it's the
// plain version: each question with a "Show the answer" box, and nothing
// to submit. `children` are any blocks written before the questions in the
// same Section.
export function FinalTest({
  questions,
  slug,
  id,
  titleHtml,
  next,
  children,
}: {
  questions: Question[];
  slug: string;
  id: string;
  titleHtml: string;
  next: NextLesson;
  children?: ReactNode;
}) {
  const hydrated = useHydrated();
  const done = useProgress().lessons[slug] ?? null;
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<(Grade & { doneAt: string }) | null>(null);
  const [nudge, setNudge] = useState("");
  const banner = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  // This page stays mounted, hidden, while the Visitor is elsewhere, so a
  // reset on /progress (or in another tab) must end the result here too.
  if (result && !resultStands(result, done)) {
    setResult(null);
    setAnswers({});
  }

  const headingId = `${id}--heading`;
  const titled = titleHtml.trim().toLowerCase() !== "final test";
  const count = questions.length === 1 ? "One question" : `${questions.length} questions`;
  const answered = questions.filter((question) => answers[question.id] !== undefined).length;

  function focusQuestion(index: number) {
    const fieldset = list.current?.querySelectorAll("fieldset")[index];
    fieldset?.scrollIntoView({ block: "center", behavior: smoothly() });
    if (fieldset) radioToFocus(fieldset)?.focus({ preventScroll: true });
  }

  function submit() {
    const missing = firstUnanswered(questions, answers);
    if (missing !== -1) {
      setNudge(`Answer every question first: question ${missing + 1} has no answer yet.`);
      focusQuestion(missing);
      return;
    }
    const graded = grade(questions, answers);
    progressStore.markDone(slug, graded.score, graded.total);
    const doneAt = progressStore.getSnapshot().lessons[slug]?.doneAt ?? "";
    flushSync(() => {
      setResult({ ...graded, doneAt });
      setNudge("");
    });
    banner.current?.focus({ preventScroll: true });
    banner.current?.scrollIntoView({ block: "start", behavior: smoothly() });
  }

  function retake() {
    flushSync(() => {
      setAnswers({});
      setResult(null);
      setNudge("");
    });
    focusQuestion(0);
  }

  return (
    <section className="final-test" id={id} aria-labelledby={headingId} data-section data-final-test>
      <div className="final-test-inner">
        <header className="final-test-head">
          {titled && <p className="eyebrow">Final test</p>}
          <h2 id={headingId} dangerouslySetInnerHTML={{ __html: titleHtml }} />
          <p className="final-test-lead">
            {hydrated
              ? `${count} on everything above. Answer them all, then submit: taking the test marks this Lesson Done, whatever your score.`
              : `${count} on everything above. Pick your answer, then open the box under it to check.`}
          </p>
        </header>

        {hydrated && (result || done) && (
          <DoneBanner
            refEl={banner}
            result={result}
            done={done}
            next={next}
            onRetake={result ? retake : () => focusQuestion(0)}
          />
        )}

        <div className="final-test-main">
          {children}
          <ol className="final-test-questions" ref={list}>
            {questions.map((question, i) => {
              const label = `Question ${i + 1} of ${questions.length}`;
              return hydrated ? (
                <TestQuestion
                  key={question.id}
                  question={question}
                  slug={slug}
                  label={label}
                  picked={answers[question.id] ?? null}
                  result={result}
                  onPick={(option) => {
                    setAnswers((current) => ({ ...current, [question.id]: option }));
                    setNudge("");
                  }}
                />
              ) : (
                <li key={question.id} className="question final-question" data-question={question.id}>
                  <QuestionFields question={question} slug={slug} label={label} />
                  <AnswerReveal question={question} />
                </li>
              );
            })}
          </ol>

          {hydrated && (
            <div className="final-test-bar" data-submitted={result ? "" : undefined}>
              {result ? (
                <>
                  <p className="final-test-bar-text">
                    <Icon name="done" />
                    You got {result.score} of {result.total}. This Lesson is Done.
                  </p>
                  <div className="final-test-actions">
                    <NextLink next={next} />
                    <button type="button" className="button-quiet" onClick={retake}>
                      Retake the test
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="final-test-bar-text">
                    {answered} of {questions.length} answered
                  </p>
                  <button
                    type="button"
                    className="submit-test"
                    aria-disabled={answered < questions.length || undefined}
                    onClick={submit}
                  >
                    Submit test
                  </button>
                </>
              )}
              <p className="final-test-nudge" role="status">
                {nudge}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NextLink({ next }: { next: NextLesson }) {
  if (!next) {
    return (
      <Link href="/progress" className="button button-light">
        See your progress
      </Link>
    );
  }
  return (
    <Link href={`/learn/${next.slug}`} className="button button-light">
      Next lesson<span className="visually-hidden">: {next.title}</span>
    </Link>
  );
}

// The green "Done" banner over the questions: the score just earned, or the
// last one when the Lesson was already Done.
function DoneBanner({
  refEl,
  result,
  done,
  next,
  onRetake,
}: {
  refEl: RefObject<HTMLDivElement | null>;
  result: Grade | null;
  done: LessonDone | null;
  next: NextLesson;
  onRetake: () => void;
}) {
  const score = result ?? done!;
  return (
    <div className="done-banner" ref={refEl} tabIndex={-1}>
      <span className="done-banner-mark" aria-hidden="true">
        <Icon name="check" />
      </span>
      <div className="done-banner-text">
        <p className="done-banner-label">Done</p>
        <h3 className="done-banner-score">
          You got {score.score} of {score.total}
        </h3>
        <p>
          {result
            ? "This Lesson is marked Done in this browser. Read why each answer is right below."
            : `You took the Final test on ${longDate(done!.doneAt)}. The questions below start fresh, if you'd like another go.`}
        </p>
      </div>
      <div className="done-banner-actions">
        <NextLink next={next} />
        <button type="button" className="button-outline" onClick={onRetake}>
          Retake the test
        </button>
      </div>
    </div>
  );
}

type Mark = "right" | "wrong" | "other";

function TestQuestion({
  question,
  slug,
  label,
  picked,
  result,
  onPick,
}: {
  question: Question;
  slug: string;
  label: string;
  picked: OptionId | null;
  result: Grade | null;
  onPick: (option: OptionId) => void;
}) {
  const ids = questionIds(slug, question.id);
  const right = result?.right.has(question.id) ?? false;
  const feedback = result ? (question.options.find((option) => option.id === picked)?.feedbackHtml ?? "") : "";
  return (
    <li
      className="question final-question"
      data-question={question.id}
      data-result={result ? (right ? "right" : "wrong") : undefined}
    >
      <fieldset className="question-fields" disabled={result !== null}>
        <legend className="question-prompt">
          <span className="question-number">
            {label}
            {result && (
              <span className={`verdict-pill verdict-pill--${right ? "right" : "wrong"}`}>
                <Icon name={right ? "check" : "cross"} />
                {right ? "Right" : "Not quite"}
              </span>
            )}
          </span>
          <span dangerouslySetInnerHTML={{ __html: question.promptHtml }} />
        </legend>
        <div className="options">
          {question.options.map((option) => {
            const mark: Mark | undefined = !result
              ? undefined
              : option.id === question.correctOption
                ? "right"
                : option.id === picked
                  ? "wrong"
                  : "other";
            return (
              <label
                key={option.id}
                className="option"
                htmlFor={ids.option(option.id)}
                data-option={option.id}
                data-mark={mark}
              >
                <input
                  type="radio"
                  id={ids.option(option.id)}
                  name={ids.name}
                  value={option.id}
                  checked={picked === option.id}
                  onChange={() => onPick(option.id)}
                />
                <span className="option-text" dangerouslySetInnerHTML={{ __html: option.html }} />
                {(mark === "right" || mark === "wrong") && (
                  <span className="option-mark">
                    <Icon name={mark === "right" ? "check" : "cross"} />
                    {mark === "wrong" ? "Your answer" : option.id === picked ? "Your answer: right" : "Right answer"}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>
      {result && (
        <p className="question-review">
          <strong className={right ? "verdict verdict--right" : "verdict verdict--wrong"}>
            {right ? "Right." : "Not quite."}
          </strong>
          {feedback && (
            <>
              {" "}
              <span dangerouslySetInnerHTML={{ __html: feedback }} />
            </>
          )}
          {question.explanationHtml && (
            <>
              {" "}
              <span dangerouslySetInnerHTML={{ __html: question.explanationHtml }} />
            </>
          )}
        </p>
      )}
    </li>
  );
}
