import Image from "next/image";
import Link from "next/link";
import { Art } from "@/app/art";
import { DoneTick } from "@/app/done";
import type { LessonSummary } from "@/lessons/lessons";

// A Lesson as a card: its photo (or its Course's navy picture), then
// "Lesson N · M min" and the title, and its summary when `withSummary`.
// The corner shows a green Done tick once the Visitor has taken its Final
// test. `label` goes before the number (e.g. "Next"), and `sizes` tells the
// browser how wide the card is drawn, so phones don't download a
// desktop-sized photo.
export function LessonCard({
  lesson,
  tone,
  label,
  sizes,
  withSummary = false,
  className = "",
}: {
  lesson: LessonSummary;
  tone: string;
  label?: string;
  sizes: string;
  withSummary?: boolean;
  className?: string;
}) {
  return (
    <Link href={`/learn/${lesson.slug}`} className={`lesson-card ${className}`}>
      <span className="lesson-card-photo">
        {lesson.photo ? (
          <Image src={lesson.photo.image} alt={lesson.photo.imageAlt} fill sizes={sizes} />
        ) : (
          <Art tone={tone} numeral={lesson.number + 1} />
        )}
        <span className="lesson-card-tick" data-tick-slot={lesson.slug}>
          <DoneTick slug={lesson.slug} />
        </span>
      </span>
      <span className="lesson-card-body">
        <span className="eyebrow">
          {label && `${label} · `}Lesson {lesson.number + 1} · {lesson.minutes} min
        </span>
        <span className="lesson-card-title">{lesson.title}</span>
        {withSummary && lesson.summary && <span className="lesson-card-summary">{lesson.summary}</span>}
      </span>
    </Link>
  );
}
