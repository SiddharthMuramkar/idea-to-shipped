// Published Lessons whose Slugs changed. Their old addresses (in links and
// search results out in the world) go permanently to the new ones, and the
// Comments posted under an old Slug still show under the new one.
export const RENAMED_LESSONS: Record<string, string> = {
  "spec-and-issues": "to-spec",
  "pr-and-ship": "pr",
  architecture: "improve-codebase-architecture",
};

// The Slug a Lesson's Comments are stored under, with any old Slugs it had.
export function slugsOfLesson(slug: string): string[] {
  const olds = Object.entries(RENAMED_LESSONS)
    .filter(([, to]) => to === slug)
    .map(([from]) => from);
  return [slug, ...olds];
}
