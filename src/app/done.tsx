"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/app/learn/[slug]/icons";
import { continueFrom, doneCount, isDone, type CourseOutline, type LessonLink } from "@/app/progress/progress";
import { useHydrated, useProgress } from "@/app/progress/use-progress";

// Done, shown wherever a Lesson or Course appears. Progress lives in the
// Visitor's browser, so the server always renders these as "nothing done"
// (or not at all), and they fill in once the page is running. Done always
// says "Done" as well as showing green and a tick, so colour is never the
// only sign.

// The tick in the corner of a Lesson's card.
export function DoneTick({ slug }: { slug: string }) {
  if (!isDone(useProgress(), slug)) return null;
  return (
    <span className="done-tick">
      <Icon name="check" />
      Done
    </span>
  );
}

// The pill in a Lesson's header.
export function DonePill({ slug }: { slug: string }) {
  if (!isDone(useProgress(), slug)) return null;
  return (
    <span className="done-pill">
      <Icon name="check" />
      Done
    </span>
  );
}

// "3 of 13 done" over a bar. Its place is kept but nothing shows until the
// page is running, so a returning Visitor never sees "0 of 13" first.
export function CourseProgress({ slugs }: { slugs: readonly string[] }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const done = doneCount(progress, slugs);
  return (
    <span
      className="course-progress"
      data-ready={hydrated || undefined}
      data-complete={(hydrated && done === slugs.length) || undefined}
      style={{ "--done": slugs.length ? done / slugs.length : 0 } as CSSProperties}
    >
      <span className="course-progress-bar" aria-hidden="true">
        <span className="course-progress-fill" />
      </span>
      <span className="course-progress-text">
        {done === slugs.length && hydrated && <Icon name="check" />}
        {done} of {slugs.length} done
      </span>
    </span>
  );
}

// The Course page's main button: Start, or Continue at the first Lesson
// not yet Done, or Read again once every Lesson is.
export function CourseStart({ lessons }: { lessons: readonly LessonLink[] }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const done = doneCount(progress, lessons.map((lesson) => lesson.slug));
  const next = lessons.find((lesson) => !isDone(progress, lesson.slug));
  const [first] = lessons;
  if (!hydrated || done === 0 || !next) {
    return (
      <Link href={`/learn/${first.slug}`} className="button button-light">
        {hydrated && done > 0 ? "Read it again" : "Start the Course"}
      </Link>
    );
  }
  return (
    <Link href={`/learn/${next.slug}`} className="button button-light">
      Continue: {next.title}
    </Link>
  );
}

// "Continue where you left off", on the home page: the first Lesson not
// Done in the Course the Visitor was last active in. Hidden until something
// is Done.
export function ContinueReading({ courses }: { courses: readonly CourseOutline[] }) {
  const target = continueFrom(useProgress(), courses);
  if (!target) return null;
  return (
    <Link href={`/learn/${target.lesson.slug}`} className="continue-card">
      <span className="continue-label">Continue where you left off</span>
      <span className="continue-title">{target.lesson.title}</span>
      <span className="continue-course">{target.course.title}</span>
    </Link>
  );
}
