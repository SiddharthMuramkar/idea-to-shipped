"use client";

import { useState, type MouseEvent } from "react";
import { useHydrated } from "@/app/progress/use-progress";
import type { Flashcard } from "@/lessons/lessons";
import { htmlToText } from "@/lessons/markdown";
import { Icon } from "./icons";

function Label() {
  return (
    <p className="block-label">
      <Icon name="cards" />
      Flashcards
    </p>
  );
}

// A Lesson's flashcards as cards to flip: the question on the front, the
// answer on the back. A click anywhere on a card (but a link) turns it over,
// and so does its button, from the keyboard too. With reduce-motion on it
// turns over at once. Each flip is read out, since the other face can't be
// seen without looking.
//
// Until the page's code runs (and for good without JavaScript) every card
// shows both sides: the question in bold, the answer under it.
export function Flashcards({ cards }: { cards: Flashcard[] }) {
  const hydrated = useHydrated();
  const [flipped, setFlipped] = useState<ReadonlySet<number>>(new Set());
  const [said, setSaid] = useState("");

  if (!hydrated) {
    return (
      <div className="flashcards">
        <Label />
        <ul className="flashcard-list">
          {cards.map((card, i) => (
            <li key={i} className="flashcard">
              <p className="flashcard-front">
                <strong dangerouslySetInnerHTML={{ __html: card.frontHtml }} />
              </p>
              <p className="flashcard-back" dangerouslySetInnerHTML={{ __html: card.backHtml }} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function flip(i: number) {
    const turned = !flipped.has(i);
    const next = new Set(flipped);
    if (turned) next.add(i);
    else next.delete(i);
    setFlipped(next);
    const card = cards[i];
    setSaid(turned ? `Answer: ${htmlToText(card.backHtml)}` : `Question: ${htmlToText(card.frontHtml)}`);
  }

  return (
    <div className="flashcards" data-flip>
      <Label />
      <p className="flashcards-hint">Say the answer to yourself, then turn the card over to check.</p>
      <ul className="flip-cards">
        {cards.map((card, i) => {
          const turned = flipped.has(i);
          const onCard = (event: MouseEvent) => {
            if (!(event.target as Element).closest("a, button")) flip(i);
          };
          return (
            <li key={i} className="flip-card" data-flipped={turned || undefined} onClick={onCard}>
              <div className="flip-card-inner">
                <div className="flip-card-face flip-card-front" aria-hidden={turned} inert={turned}>
                  <p className="flip-card-side">Question</p>
                  <p className="flip-card-text" dangerouslySetInnerHTML={{ __html: card.frontHtml }} />
                </div>
                <div className="flip-card-face flip-card-back" aria-hidden={!turned} inert={!turned}>
                  <p className="flip-card-side">Answer</p>
                  <p className="flip-card-text" dangerouslySetInnerHTML={{ __html: card.backHtml }} />
                </div>
              </div>
              <button type="button" className="flip-card-button" onClick={() => flip(i)}>
                <Icon name="flip" />
                <span className="visually-hidden">{`Card ${i + 1} of ${cards.length}: `}</span>
                {turned ? "Show the question" : "Show the answer"}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="visually-hidden" aria-live="polite">
        {said}
      </p>
    </div>
  );
}
