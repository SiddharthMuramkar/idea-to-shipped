import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import nextConfig, { RENAMED_LESSONS } from "../../next.config";
import { checkLessonLinks, checkPhoto, LESSON_RULES } from "./course-lint";
import { courses, type Course, type Lesson } from "./lessons";

// The content lint. Each failure says what's wrong and how to fix it, so an
// author can fix the file without reading this code.

// Every Slug the site has published. Comments in production point at them
// (ADR 0004), so each must always name a Lesson, in whichever Course or Part.
const PUBLISHED_SLUGS = [
  "start-here",
  "how-agents-work",
  "context-window",
  "skills",
  "grilling",
  "domain-modeling",
  "prototype",
  "spec-and-issues",
  "tdd",
  "implement",
  "code-review",
  "pr-and-ship",
  "main-flow",
  "diagnosing-bugs",
  "triage",
  "wizard",
  "architecture",
  "retro",
  "wayfinder",
  "models-effort-ultracode",
];

// Published Slugs whose Lessons now have new ones, against ADR 0004. Each old
// address needs a permanent redirect to the new one, and the Comments under
// the old Slug need moving to the new Slug, or they no longer show.
const RENAMED_SLUGS: Record<string, string> = {
  "spec-and-issues": "to-spec",
  "pr-and-ship": "pr",
  architecture: "improve-codebase-architecture",
};

// Collected up front so each Course and Lesson gets its own describe block.
// Content that doesn't load yields none here; "every Course loads" says why.
const all: Course[] = await courses.listCourses().catch(() => []);

const fileOf = (course: Course, slug: string) => `content/${course.slug}/${slug}.md`;

const inPublic = (image: string) => existsSync(path.join(process.cwd(), "public", image));

async function load(slug: string): Promise<Lesson> {
  const lesson = await courses.getLesson(slug);
  if (!lesson) throw new Error(`no Lesson "${slug}"`);
  return lesson;
}

describe("content/", () => {
  test("every Course loads: its course.md, file names, Slugs and image credits line up", async () => {
    const problems = await courses.listCourses().then(
      () => "",
      (error: Error) => error.message,
    );
    expect(problems).toBe("");
  });

  test("every Lesson in every Course parses", async () => {
    const problems: string[] = [];
    for (const { slug } of await courses.listLessons()) {
      await courses.getLesson(slug).catch((error: Error) => problems.push(error.message));
    }
    expect(problems).toEqual([]);
  });

  test("every published Slug still names a Lesson, or was renamed to one (Comments point at it, ADR 0004)", async () => {
    const missing: string[] = [];
    for (const slug of PUBLISHED_SLUGS) {
      const now = RENAMED_SLUGS[slug] ?? slug;
      if (!(await courses.lessonExists(now))) {
        missing.push(
          `"${now}" is a published Slug${now === slug ? "" : ` (renamed from "${slug}")`}, but no Lesson has it: put "slug: ${now}" back in its Lesson's header (a Lesson can change its title, Course or Part, but never its Slug)`,
        );
      }
      if (now !== slug && (await courses.lessonExists(slug))) {
        missing.push(
          `a Lesson has the slug "${slug}", which was renamed to "${now}": the redirect from /learn/${slug} would hide it, so give it a Slug of its own`,
        );
      }
    }
    expect(missing).toEqual([]);
  });

  test("every renamed Slug's old address redirects permanently to its new one (next.config.ts)", async () => {
    expect(RENAMED_LESSONS).toEqual(RENAMED_SLUGS);
    expect(await nextConfig.redirects?.()).toEqual(
      Object.entries(RENAMED_SLUGS).map(([from, to]) => ({
        source: `/learn/${from}`,
        destination: `/learn/${to}`,
        permanent: true,
      })),
    );
  });
});

describe.each(all)("Course $slug", (course) => {
  test("its image exists under public/, openly licensed and credited", () => {
    const problems = checkPhoto(course.photo, inPublic).map((problem) => `content/${course.slug}/course.md: ${problem}`);
    expect(problems).toEqual([]);
  });
});

const lessons = all.flatMap((course) => course.lessons.map(({ slug }) => ({ course, slug })));

describe.each(lessons)("Lesson $slug", ({ course, slug }) => {
  const problems = (found: string[]) => found.map((problem) => `${fileOf(course, slug)}: ${problem}`);

  test("links only to Lessons that exist", async () => {
    const slugs = new Set(lessons.map((lesson) => lesson.slug));
    expect(problems(checkLessonLinks(await load(slug), slugs))).toEqual([]);
  });

  test("its image exists under public/, openly licensed and credited", async () => {
    expect(problems(checkPhoto((await load(slug)).photo, inPublic))).toEqual([]);
  });

  test.each(LESSON_RULES)("$rule", async ({ check }) => {
    expect(problems(check(await load(slug)))).toEqual([]);
  });
});
