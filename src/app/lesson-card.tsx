import Link from "next/link";
import type { LessonSummary } from "@/lessons/lessons";

// A Lesson as a Press ruled entry — the only way a Lesson appears in
// the Press index (see the module note in `page.tsx`). No photo, because
// Press renders none and Lesson headers no longer carry a photo.
//
// Entry anatomy, in render order (all inside one link to the Lesson):
//   1. Numeral — the plain Lesson number, decorative (`aria-hidden`).
//   2. Body — optional `label`, then the title, then the optional
//      outcome line, then the meta row ("Lesson N · M min read" plus
//      the tick slot).
//   3. Arrow — a decorative "→" marking the entry as a link.
//
// Used for the home page's index and for Previous/Next on a Lesson page,
// where `label` goes before the title (e.g. "Next"). `outcome` is
// optional: the home page derives it from the Lesson's first goal
// (`loadOutcomes` in `page.tsx`); Previous/Next pass none, so their
// entries render without an outcome line. The tick slot is always kept
// (empty for now) so the entry never shifts when the "passed" tick
// arrives.
export function LessonCard({
  lesson,
  label,
  outcome,
  className = "",
}: {
  lesson: LessonSummary;
  label?: string;
  outcome?: string;
  className?: string;
}) {
  return (
    <Link href={`/learn/${lesson.slug}`} className={`lesson-card ${className}`}>
      <span className="lesson-card-num" aria-hidden="true">
        {lesson.number}
      </span>
      <span className="lesson-card-body">
        {label && <span className="lesson-card-label">{label}</span>}
        <span className="lesson-card-title">{lesson.title}</span>
        {outcome && <span className="lesson-card-outcome">{outcome}</span>}
        <span className="lesson-card-meta">
          <span>
            Lesson {lesson.number} · {lesson.minutes} min read
          </span>
          <span className="lesson-card-tick" data-tick-slot={lesson.slug} aria-hidden="true" />
        </span>
      </span>
      <span className="lesson-card-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
