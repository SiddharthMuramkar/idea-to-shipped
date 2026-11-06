"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CourseProgress } from "@/app/done";
import { doneCount, isDone, type CourseOutline } from "./progress";
import { progressStore } from "./store";
import { useHydrated, useProgress } from "./use-progress";

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

// Every Course with how much of it is Done, the Done Lessons with their
// Final test scores, and a way to forget it all (after a second "yes").
// It's all read from this browser, so nothing shows until the page runs.
export function ProgressView({ courses }: { courses: readonly CourseOutline[] }) {
  const progress = useProgress();
  const hydrated = useHydrated();
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState("");
  const resetButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const summary = useRef<HTMLParagraphElement>(null);

  if (!hydrated) return null;

  const all = courses.flatMap((course) => course.lessons);
  const total = doneCount(
    progress,
    all.map((lesson) => lesson.slug),
  );

  return (
    <div className="progress-view">
      <p className="progress-summary" ref={summary} tabIndex={-1}>
        {total === 0
          ? "Nothing is Done yet. Take a Lesson's Final test, and it shows up here."
          : `You've done ${total} of ${all.length} Lessons.`}
      </p>

      <ol className="progress-courses">
        {courses.map((course) => {
          const done = course.lessons.filter((lesson) => isDone(progress, lesson.slug));
          return (
            <li key={course.slug} className="progress-course">
              <h2>
                <Link href={`/courses/${course.slug}`}>{course.title}</Link>
              </h2>
              <CourseProgress slugs={course.lessons.map((lesson) => lesson.slug)} />
              {done.length > 0 && (
                <ul className="progress-lessons">
                  {done.map((lesson) => {
                    const entry = progress.lessons[lesson.slug];
                    return (
                      <li key={lesson.slug}>
                        <Link href={`/learn/${lesson.slug}`}>{lesson.title}</Link>
                        <span className="progress-score">
                          {entry.score} of {entry.total} · {shortDate(entry.doneAt)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <div className="progress-reset">
        {confirming ? (
          <div className="progress-confirm" role="group" aria-labelledby="progress-confirm-text">
            <p id="progress-confirm-text">
              Forget every Done Lesson and score in this browser? This can&apos;t be undone.
            </p>
            <div className="button-row">
              <button
                type="button"
                className="button-danger"
                onClick={() => {
                  progressStore.reset();
                  setConfirming(false);
                  setStatus("Your progress is reset.");
                  summary.current?.focus();
                }}
              >
                Yes, reset my progress
              </button>
              <button
                type="button"
                className="button-quiet button-quiet--light"
                ref={cancelButton}
                onClick={() => {
                  setConfirming(false);
                  requestAnimationFrame(() => resetButton.current?.focus());
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          total > 0 && (
            <button
              type="button"
              className="button-quiet button-quiet--light"
              ref={resetButton}
              onClick={() => {
                setStatus("");
                setConfirming(true);
                requestAnimationFrame(() => cancelButton.current?.focus());
              }}
            >
              Reset my progress
            </button>
          )
        )}
        <p className="progress-status" role="status">
          {status}
        </p>
      </div>
    </div>
  );
}
