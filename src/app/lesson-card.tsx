import Image from "next/image";
import Link from "next/link";
import type { LessonSummary } from "@/lessons/lessons";

// A Lesson as a card: its photo, then "Lesson N" and the title. `label` goes
// before the number (e.g. "Next"), and `sizes` tells the browser how wide the
// card is drawn, so phones don't download a desktop-sized photo.
export function LessonCard({
  lesson,
  label,
  sizes,
  className = "",
}: {
  lesson: LessonSummary;
  label?: string;
  sizes: string;
  className?: string;
}) {
  return (
    <Link href={`/learn/${lesson.slug}`} className={`lesson-card ${className}`}>
      {lesson.photo && (
        <span className="lesson-card-photo">
          <Image src={lesson.photo.image} alt={lesson.photo.imageAlt} fill sizes={sizes} />
          <span className="lesson-card-tick" data-tick-slot={lesson.slug} aria-hidden="true" />
        </span>
      )}
      <span className="lesson-card-body">
        <span className="eyebrow">
          {label && `${label} · `}Lesson {lesson.number}
        </span>
        <span className="lesson-card-title">{lesson.title}</span>
      </span>
    </Link>
  );
}
