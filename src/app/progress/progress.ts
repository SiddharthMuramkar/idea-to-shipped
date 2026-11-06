// A Visitor's progress: for each Lesson whose Final test they've submitted,
// when they last did and what they scored. It lives in their own browser
// (there are no accounts), under one localStorage key; store.ts reads and
// writes it. Everything here is a pure function of the stored value.

// The version is in the key, so a later shape can live beside this one.
export const PROGRESS_KEY = "its-progress-v1";

export type LessonDone = { doneAt: string; score: number; total: number };

export type Progress = { lessons: Readonly<Record<string, LessonDone>> };

export const NOTHING_DONE: Progress = Object.freeze({ lessons: Object.freeze({}) });

const isCount = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0;

function isLessonDone(value: unknown): value is LessonDone {
  if (typeof value !== "object" || value === null) return false;
  const { doneAt, score, total } = value as Record<string, unknown>;
  return (
    typeof doneAt === "string" &&
    !Number.isNaN(Date.parse(doneAt)) &&
    isCount(score) &&
    isCount(total) &&
    total > 0 &&
    score <= total
  );
}

// Reads whatever the browser holds. Anything that isn't progress of this
// shape (nothing stored, a hand edit, a broken write) counts as nothing done,
// and a broken entry is dropped without losing the others.
export function parseProgress(raw: string | null): Progress {
  if (!raw) return NOTHING_DONE;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return NOTHING_DONE;
  }
  const lessons = (data as { lessons?: unknown } | null)?.lessons;
  if (typeof lessons !== "object" || lessons === null || Array.isArray(lessons)) return NOTHING_DONE;
  const kept: Record<string, LessonDone> = {};
  for (const [slug, entry] of Object.entries(lessons)) {
    if (isLessonDone(entry)) kept[slug] = { doneAt: entry.doneAt, score: entry.score, total: entry.total };
  }
  return { lessons: kept };
}

export function serializeProgress(progress: Progress): string {
  return JSON.stringify(progress);
}

// Submitting a Final test marks its Lesson Done, whatever the score. Taking
// it again keeps the newest score and date.
export function withLessonDone(progress: Progress, slug: string, score: number, total: number, now: Date): Progress {
  return { lessons: { ...progress.lessons, [slug]: { doneAt: now.toISOString(), score, total } } };
}

export function isDone(progress: Progress, slug: string): boolean {
  return Object.hasOwn(progress.lessons, slug);
}

export function doneCount(progress: Progress, slugs: readonly string[]): number {
  return slugs.filter((slug) => isDone(progress, slug)).length;
}

// A Course as the browser needs it: its Lessons in reading order.
export type LessonLink = { slug: string; title: string };
export type CourseOutline = { slug: string; title: string; lessons: LessonLink[] };

// Where "Continue where you left off" goes: the first Lesson not yet Done in
// the Course the Visitor was last active in (the one holding their newest
// Done Lesson). Once that Course is finished, the first not Done in the
// Courses after it, coming round to the first Course after the last. Null
// before anything is Done, and once everything is.
export function continueFrom(
  progress: Progress,
  courses: readonly CourseOutline[],
): { course: CourseOutline; lesson: LessonLink } | null {
  let from = -1;
  let latest = Number.NEGATIVE_INFINITY;
  for (const [i, course] of courses.entries()) {
    for (const { slug } of course.lessons) {
      const done = progress.lessons[slug];
      const at = done ? Date.parse(done.doneAt) : Number.NaN;
      if (at > latest) {
        latest = at;
        from = i;
      }
    }
  }
  if (from === -1) return null;
  for (let step = 0; step < courses.length; step++) {
    const course = courses[(from + step) % courses.length];
    const lesson = course.lessons.find(({ slug }) => !isDone(progress, slug));
    if (lesson) return { course, lesson };
  }
  return null;
}
