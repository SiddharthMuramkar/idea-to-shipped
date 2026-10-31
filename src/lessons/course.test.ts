import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { checkLessonLinks, EDITORIAL_RULES } from "./course-lint";
import { courses, type Course, type Lesson } from "./lessons";

// The content lint. Each failure says what's wrong and how to fix it, so an
// author can fix the file without reading this code.

// The Course whose house style the editorial rules are.
const IDEA_TO_SHIPPED = "idea-to-shipped";

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

// Collected up front so each Lesson gets its own describe block. Content
// that doesn't load yields no Courses here; "every Course loads" says why.
const all: Course[] = await courses.listCourses().catch(() => []);

const fileOf = (course: Course, slug: string) => `content/${course.slug}/${slug}.md`;

async function load(slug: string): Promise<Lesson> {
  const lesson = await courses.getLesson(slug);
  if (!lesson) throw new Error(`no Lesson "${slug}"`);
  return lesson;
}

describe("content/", () => {
  test("every Course loads: its course.md, file names and Slugs line up", async () => {
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

  test("every published Slug still names a Lesson (Comments point at it, ADR 0004)", async () => {
    const missing: string[] = [];
    for (const slug of PUBLISHED_SLUGS) {
      if (await courses.lessonExists(slug)) continue;
      missing.push(
        `"${slug}" is a published Slug, but no Lesson has it: put "slug: ${slug}" back in its Lesson's header (a Lesson can change its title, Course or Part, but never its Slug)`,
      );
    }
    expect(missing).toEqual([]);
  });

  test("every Lesson photo exists under public/", () => {
    const missing = all.flatMap((course) =>
      course.lessons.flatMap(({ slug, photo }) =>
        photo && !existsSync(path.join(process.cwd(), "public", photo.image))
          ? [`${fileOf(course, slug)}: its photo ${photo.image} isn't in public/: add the file, or fix the header's image: path`]
          : [],
      ),
    );
    expect(missing).toEqual([]);
  });

  test(`the ${IDEA_TO_SHIPPED} Course exists and is read in Parts`, () => {
    const course = all.find(({ slug }) => slug === IDEA_TO_SHIPPED);
    const problem = !course
      ? `content/${IDEA_TO_SHIPPED}/course.md is missing: the home page and the footer list this Course`
      : !course.parts
        ? `content/${IDEA_TO_SHIPPED}/course.md has no Parts: list its Lessons under "## <Part title>" headings, which the home page shows`
        : null;
    expect(problem).toBeNull();
  });
});

const lessons = all.flatMap((course) => course.lessons.map(({ slug }) => ({ course, slug })));

describe.each(lessons)("Lesson $slug", ({ course, slug }) => {
  const problems = (found: string[]) => found.map((problem) => `${fileOf(course, slug)}: ${problem}`);

  test("links only to Lessons that exist", async () => {
    const slugs = new Set(lessons.map((lesson) => lesson.slug));
    expect(problems(checkLessonLinks(await load(slug), slugs))).toEqual([]);
  });

  if (course.slug === IDEA_TO_SHIPPED) {
    test.each(EDITORIAL_RULES)("$rule", async ({ check }) => {
      expect(problems(check(await load(slug)))).toEqual([]);
    });
  }
});
