import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { countProseWords, parseBody, type Block, type LessonBody } from "./blocks";
import { parseCourseFile, parseLessonFile, type CourseFile, type LessonFile, type Photo } from "./files";
import type { Question } from "./questions";

export type { Block, CalloutTone, Section } from "./blocks";
export type { Photo } from "./files";
export type { Question, QuestionOption } from "./questions";
export type { Scene } from "./scenes";

// A "## " heading in its Course's course.md, numbered from 1.
export type Part = { number: number; title: string };

// A Lesson without its body: what every list of Lessons shows.
export type LessonSummary = {
  // Its position in its Course, from 0, so it changes when Lessons move.
  number: number;
  slug: string;
  title: string;
  photo: Photo | null;
  // Null when its Course has no Parts.
  part: Part | null;
  minutes: number;
};

export type Lesson = LessonSummary &
  LessonBody & {
    // Its neighbours in its own Course.
    previous: LessonSummary | null;
    next: LessonSummary | null;
  };

// A folder in content/: a course.md and the Lessons it lists, in order.
export type Course = {
  slug: string;
  title: string;
  // Null when course.md has no "## " headings, so its Lessons read as one list.
  parts: Part[] | null;
  lessons: LessonSummary[];
};

// Only running text counts (see countProseWords).
export function countWords(lesson: LessonBody): number {
  return countProseWords(allBlocks(lesson));
}

export function allBlocks(lesson: LessonBody): Block[] {
  return [lesson.intro, ...lesson.sections.map((section) => section.blocks)].flat();
}

export function allQuestions(lesson: LessonBody): Question[] {
  return allBlocks(lesson).flatMap((block) =>
    block.type === "checkpoint" ? [block.question] : block.type === "finalTest" ? block.questions : [],
  );
}

const COURSE_FILE = "course.md";

// A Lesson's body is parsed the first time someone asks for the whole
// Lesson, since listing Lessons never needs it.
type Entry = { summary: LessonSummary; course: Course; file: string; body: string; parsed?: LessonBody };

type Content = { courses: Course[]; lessons: Map<string, Entry> };

// Deep-freezes what every caller shares, so a caller that sorts or edits what
// it was handed fails at once instead of changing it for everyone else.
function freeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
}

// Problems go into `problems` instead of being thrown; `where` names a file
// the way the messages show it.
async function readFolder(
  root: string,
  folder: string,
  where: (...names: string[]) => string,
  problems: string[],
): Promise<{ listing: CourseFile | null; files: Map<string, LessonFile> }> {
  const names = (await readdir(path.join(root, folder))).filter((name) => name.endsWith(".md")).sort();
  const texts = await Promise.all(names.map((name) => readFile(path.join(root, folder, name), "utf8")));
  let listing: CourseFile | null = null;
  const files = new Map<string, LessonFile>();
  for (const [i, name] of names.entries()) {
    try {
      if (name === COURSE_FILE) listing = parseCourseFile(where(folder, name), texts[i]);
      else files.set(name.slice(0, -".md".length), parseLessonFile(where(folder, name), texts[i]));
    } catch (error) {
      problems.push((error as Error).message);
    }
  }

  for (const [name, file] of files) {
    if (file.slug === name) continue;
    problems.push(
      `${where(folder, `${name}.md`)}: its slug is "${file.slug}", but a Lesson's file is named after its Slug: rename the file to ${file.slug}.md, or put the slug back if it's published (Comments point at it)`,
    );
  }
  if (!names.includes(COURSE_FILE)) {
    problems.push(
      `${where(folder)}: has no course.md: every folder in ${path.basename(root)}/ is a Course, so add a course.md that lists its Lessons`,
    );
  }
  if (!listing) return { listing, files };

  const courseMd = where(folder, COURSE_FILE);
  if (listing.slug !== folder) {
    problems.push(
      `${courseMd}: its slug is "${listing.slug}", but a Course's folder is named after its slug: rename the folder to ${listing.slug}`,
    );
  }
  for (const slug of listing.slugs) {
    if (names.includes(`${slug}.md`)) continue;
    problems.push(`${courseMd}: lists "${slug}", but there's no ${slug}.md beside it: add the Lesson, or remove the line`);
  }
  for (const [name, file] of files) {
    if (file.slug !== name || listing.slugs.includes(name)) continue;
    problems.push(
      `${where(folder, `${name}.md`)}: course.md doesn't list it: add "- ${name}" to course.md where it belongs in the reading order`,
    );
  }
  return { listing, files };
}

// Throws every problem with the files and their headers at once, one per
// line, so an author can fix them all in one pass. A Lesson's body is only
// checked once it's parsed.
async function readContent(root: string): Promise<Content> {
  const where = (...names: string[]) => [path.basename(root), ...names].join("/");
  const problems: string[] = [];
  const courses: Course[] = [];
  const lessons = new Map<string, Entry>();

  const items = await readdir(root, { withFileTypes: true });
  for (const item of items) {
    if (!item.isFile() || !item.name.endsWith(".md")) continue;
    problems.push(`${where(item.name)}: a Lesson file goes in its Course's folder, beside the course.md that lists it`);
  }
  const folders = items.filter((item) => item.isDirectory() && !item.name.startsWith(".")).map((item) => item.name);
  for (const folder of folders.sort()) {
    const { listing, files } = await readFolder(root, folder, where, problems);
    if (!listing) continue;
    const parts = listing.parts?.map((part, i) => ({ number: i + 1, title: part.title })) ?? null;
    const course: Course = { slug: listing.slug, title: listing.title, parts, lessons: [] };
    for (const slug of listing.slugs) {
      const lessonFile = files.get(slug);
      if (!lessonFile) continue;
      const file = where(folder, `${slug}.md`);
      const clash = lessons.get(slug);
      if (clash) {
        problems.push(
          `${clash.file} and ${file}: both use the slug "${slug}", but a Slug names one Lesson across every Course (its /learn/${slug} address, and what its Comments point at): rename the one that isn't published yet, its file and its slug together`,
        );
        continue;
      }
      const partIndex = listing.parts?.findIndex((part) => part.slugs.includes(slug)) ?? -1;
      const summary: LessonSummary = {
        number: course.lessons.length,
        slug,
        title: lessonFile.title,
        photo: lessonFile.photo,
        part: parts?.[partIndex] ?? null,
        minutes: lessonFile.minutes,
      };
      course.lessons.push(summary);
      lessons.set(slug, { summary, course, file, body: lessonFile.body });
    }
    courses.push(course);
  }

  if (problems.length > 0) throw new Error(problems.join("\n"));
  return { courses: freeze(courses), lessons };
}

export function coursesFrom(root: string) {
  let content: Promise<Content> | null = null;

  // Content never changes while the site runs, so it's read once per process.
  // Under `next dev` the author is editing it, and a hard reload re-runs every
  // "use cache" function, so there it's read again on every call.
  function load(): Promise<Content> {
    if (!content || process.env.NODE_ENV === "development") content = readContent(root);
    return content;
  }

  async function getLesson(slug: string): Promise<Lesson | null> {
    const entry = (await load()).lessons.get(slug);
    if (!entry) return null;
    entry.parsed ??= freeze(parseBody(entry.file, entry.body));
    const { lessons } = entry.course;
    const at = entry.summary.number;
    return {
      ...entry.summary,
      ...entry.parsed,
      previous: lessons[at - 1] ?? null,
      next: lessons[at + 1] ?? null,
    };
  }

  return {
    // Every Course, in folder-name order.
    async listCourses(): Promise<Course[]> {
      return (await load()).courses;
    },

    async getCourse(slug: string): Promise<Course | null> {
      return (await load()).courses.find((course) => course.slug === slug) ?? null;
    },

    // Every Lesson of every Course, a Course at a time.
    async listLessons(): Promise<LessonSummary[]> {
      return (await load()).courses.flatMap((course) => course.lessons);
    },

    // A Slug names one Lesson across every Course (ADR 0008), so it alone
    // finds it.
    getLesson,

    async getQuestions(slug: string): Promise<Question[] | null> {
      const lesson = await getLesson(slug);
      return lesson && allQuestions(lesson);
    },

    async lessonExists(slug: string): Promise<boolean> {
      return (await load()).lessons.has(slug);
    },
  };
}

// The site's own Courses. Tests point coursesFrom at fixtures instead.
export const courses = coursesFrom(path.join(process.cwd(), "content"));
