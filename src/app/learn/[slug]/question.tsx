import type { Question } from "@/lessons/lessons";

// The parts of a question that work without JavaScript: native radios in a
// fieldset, and under them a "Show the answer" box. Quick checks and the
// Final test show these until the page's code is running (and for good if it
// never runs), then become interactive (quick-check.tsx, final-test.tsx).

// Ids and radio names are unique on the whole document, not just the Lesson:
// Next keeps up to three visited pages mounted, so two Lessons can be in the
// DOM at once. Slugs and question ids are kebab-case (single dashes), so "--"
// can't appear inside either and the parts never run together.
export function questionIds(slug: string, questionId: string) {
  const base = `q--${slug}--${questionId}`;
  return { name: base, option: (optionId: string) => `${base}--${optionId}` };
}

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

// The right answer, then why: the question's explanation (its "Why:" line),
// and each option's own feedback, for the options that have some.
export function AnswerReveal({ question }: { question: Question }) {
  const right = question.options.find((option) => option.id === question.correctOption)!;
  const withFeedback = question.options.filter((option) => option.feedbackHtml !== "");
  return (
    <details className="question-answer">
      <summary>Show the answer</summary>
      <p>
        <strong>Answer: </strong>
        <span dangerouslySetInnerHTML={{ __html: right.html }} />
      </p>
      {question.explanationHtml !== null && (
        <p className="question-explanation" dangerouslySetInnerHTML={{ __html: question.explanationHtml }} />
      )}
      {withFeedback.length > 0 && (
        <ul className="question-answer-list">
          {withFeedback.map((option) => (
            <li key={option.id} data-correct={option.id === question.correctOption ? "" : undefined}>
              <span className="question-answer-option" dangerouslySetInnerHTML={{ __html: option.html }} />{" "}
              <span dangerouslySetInnerHTML={{ __html: option.feedbackHtml }} />
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
