"use client";

import { useId, useRef, useState } from "react";
import { useHydrated } from "@/app/progress/use-progress";
import type { Question, QuestionOption } from "@/lessons/lessons";
import type { OptionId } from "./grade";
import { Icon } from "./icons";
import { AnswerReveal, QuestionFields } from "./question";

// A link can't sit inside a button, so an option's text keeps its words and
// loses its link. The HTML is the parser's own (Lessons can't hold raw HTML).
export const withoutLinks = (html: string) => html.replace(/<a\b[^>]*>/g, "<span>").replace(/<\/a>/g, "</span>");

// How an option looks once the Quick check is answered.
type Mark = "right" | "wrong" | "other";

function markOf(option: QuestionOption, question: Question, picked: OptionId | null): Mark | undefined {
  if (picked === null) return undefined;
  if (option.id === question.correctOption) return "right";
  return option.id === picked ? "wrong" : "other";
}

const MARK_WORDS = { right: "Right answer", picked: "Your pick: right", wrong: "Your pick" };

// A Quick check: one optional question in the text, right after the idea it
// checks. One tap answers it: the picked option is marked right or wrong,
// the right one is marked, and "Right." or "Not quite." comes with the
// option's feedback and the question's explanation. Nothing is saved, and
// "Try again" clears it. It sits after its block in the HTML, so a screen
// reader and a phone read the block first; on a wide screen QuickCheckRail
// lifts it into the margin, level with its block.
//
// Until the page's code runs (and for good without JavaScript) it's the
// plain version: radios, and a "Show the answer" box under them.
export function QuickCheck({ question, slug }: { question: Question; slug: string }) {
  const hydrated = useHydrated();
  const [picked, setPicked] = useState<OptionId | null>(null);
  const promptId = useId();
  const firstOption = useRef<HTMLButtonElement>(null);

  const answered = picked !== null;
  const right = picked === question.correctOption;
  const feedback = question.options.find((option) => option.id === picked)?.feedbackHtml ?? "";

  return (
    <div className="quick-check" data-quick-check={question.id} data-reveal>
      <p className="quick-check-eyebrow">
        <Icon name="checkpoint" />
        Quick check
      </p>
      {hydrated ? (
        <>
          <p id={promptId} className="quick-check-prompt" dangerouslySetInnerHTML={{ __html: question.promptHtml }} />
          <div className="quick-check-options" role="group" aria-labelledby={promptId}>
            {question.options.map((option, i) => {
              const mark = markOf(option, question, picked);
              const words = mark === "right" ? MARK_WORDS[right ? "picked" : "right"] : mark === "wrong" ? MARK_WORDS.wrong : null;
              return (
                <button
                  key={option.id}
                  ref={i === 0 ? firstOption : undefined}
                  type="button"
                  className="quick-check-option"
                  data-option={option.id}
                  data-mark={mark}
                  // Still focusable once answered, so the keyboard stays put.
                  aria-disabled={answered || undefined}
                  onClick={() => {
                    if (!answered) setPicked(option.id);
                  }}
                >
                  <span className="option-text" dangerouslySetInnerHTML={{ __html: withoutLinks(option.html) }} />
                  {words && (
                    <span className="option-mark">
                      <Icon name={mark === "right" ? "check" : "cross"} />
                      {words}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="quick-check-feedback" aria-live="polite">
            {answered && (
              <>
                <p>
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
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    setPicked(null);
                    firstOption.current?.focus();
                  }}
                >
                  Try again
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <QuestionFields question={question} slug={slug} />
          <AnswerReveal question={question} />
        </>
      )}
    </div>
  );
}
