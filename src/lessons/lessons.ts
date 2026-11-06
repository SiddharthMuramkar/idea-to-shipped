import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseBody, type Block, type LessonBody } from "./blocks";
import { parseCredits, type Credit } from "./credits";
import { parseCourseFile, parseLessonFile, type CourseFile, type HeaderImage, type LessonFile } from "./files";
import type { Question } from "./questions";

export type { Block, CalloutTone, Flashcard, Section } from "./blocks";
export type { Credit } from "./credits";
export type { Diagram } from "./diagrams";
export type { Question, QuestionOption } from "./questions";
export type { Scene } from "./scenes";

// A header's image with its credit from content/image-credits.json: null when
// the manifest has none for it (the content lint asks for one).
export type Photo = HeaderImage & { credit: Credit | null };

// A "## " heading in its Course's course.md, numbered from 1.
export type Part = { number: number; title: string };

// Which Course something belongs to, enough to name it and link to it.
export type CourseRef = { slug: string; title: string };

// A Lesson without its body: what every list of Lessons shows.
export type LessonSummary = {
  // Its position in its Course, from 0, so it changes when Lessons move.
  number: number;
  slug: string;
  title: string;
  // One plain sentence for cards. The content lint asks every Lesson for one.
  summary: string | null;
  course: CourseRef;
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
  description: string;
  // Courses are listed by it; null sorts after every number.
  order: number | null;
  photo: Photo | null;
  // Null when course.md has no "## " headings, so its Lessons read as one list.
  parts: Part[] | null;
  lessons: LessonSummary[];
};

// Where an image shows: on a Course's own header (lesson null), or a Lesson's.
export type ImageUse = { course: CourseRef; lesson: { slug: string; title: string } | null };

// One image the headers use, with its credit, for the credits page.
export type ImageCredit = { image: string; imageAlt: string; credit: Credit | null; usedBy: ImageUse[] };

export function allBlocks(lesson: LessonBody): Block[] {
  return [lesson.intro, ...lesson.sections.map((section) => section.blocks)].flat();
}

export function allQuestions(lesson: LessonBody): Question[] {
  return allBlocks(lesson).flatMap((block) =>
    block.type === "checkpoint" ? [block.question] : block.type === "finalTest" ? block.questions : [],
  );
}

const COURSE_FILE = "course.md";
const CREDITS_FILE = "image-credits.json";

// A Lesson's body is parsed the first time someone asks for the whole
// Lesson, since listing Lessons never needs it.
type Entry = { summary: LessonSummary; course: Course; file: string; body: string; parsed?: LessonBody };

// `manifest` is every credit in image-credits.json, including images no
// header names (the home page's own photos).
type Content = {
  courses: Course[];
  lessons: Map<string, Entry>;
  credits: ImageCredit[];
  manifest: ReadonlyMap<string, Credit>;
};

// Deep-freezes what every caller shares, so a caller that sorts or edits what
// it was handed fails at once instead of changing it for everyone else.
function freeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
}

// By order, then by slug, so Courses without an order (or sharing one) still
// come out the same way every time.
function byOrder(a: Course, b: Course): number {
  const rank = (course: Course) => course.order ?? Number.POSITIVE_INFINITY;
  return rank(a) - rank(b) || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
}

// No manifest yet means no image has a credit, which the content lint
// reports per image. A manifest that's there but broken is a problem now.
async function readCredits(
  root: string,
  where: (...names: string[]) => string,
  problems: string[],
): Promise<Map<string, Credit>> {
  let raw: string;
  try {
    raw = await readFile(path.join(root, CREDITS_FILE), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Map();
    throw error;
  }
  try {
    return parseCredits(where(CREDITS_FILE), raw);
  } catch (error) {
    problems.push((error as Error).message);
    return new Map();
  }
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

// Every image the headers use, each Course's own first and then its
// Lessons', Course by Course. An image used twice is listed once.
function imageCredits(courses: Course[]): ImageCredit[] {
  const byImage = new Map<string, ImageCredit>();
  const shows = (photo: Photo | null, at: ImageUse) => {
    if (!photo) return;
    const entry = byImage.get(photo.image) ?? { ...photo, usedBy: [] };
    entry.usedBy.push(at);
    byImage.set(photo.image, entry);
  };
  for (const course of courses) {
    shows(course.photo, { course: { slug: course.slug, title: course.title }, lesson: null });
    for (const lesson of course.lessons) {
      shows(lesson.photo, { course: lesson.course, lesson: { slug: lesson.slug, title: lesson.title } });
    }
  }
  return [...byImage.values()];
}

// Throws every problem with the files and their headers at once, one per
// line, so an author can fix them all in one pass. A Lesson's body is only
// checked once it's parsed.
async function readContent(root: string): Promise<Content> {
  const where = (...names: string[]) => [path.basename(root), ...names].join("/");
  const problems: string[] = [];
  const courses: Course[] = [];
  const lessons = new Map<string, Entry>();

  const credits = await readCredits(root, where, problems);
  const photoOf = (image: HeaderImage | null): Photo | null =>
    image && { ...image, credit: credits.get(image.image) ?? null };

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
    const course: Course = {
      slug: listing.slug,
      title: listing.title,
      description: listing.description,
      order: listing.order,
      photo: photoOf(listing.image),
      parts,
      lessons: [],
    };
    const ref: CourseRef = { slug: course.slug, title: course.title };
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
        summary: lessonFile.summary,
        course: ref,
        photo: photoOf(lessonFile.image),
        part: parts?.[partIndex] ?? null,
        minutes: lessonFile.minutes,
      };
      course.lessons.push(summary);
      lessons.set(slug, { summary, course, file, body: lessonFile.body });
    }
    courses.push(course);
  }

  if (problems.length > 0) throw new Error(problems.join("\n"));
  courses.sort(byOrder);
  for (const credit of credits.values()) freeze(credit);
  return { courses: freeze(courses), lessons, credits: freeze(imageCredits(courses)), manifest: credits };
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
    // Every Course, by its order, then by slug.
    async listCourses(): Promise<Course[]> {
      return (await load()).courses;
    },

    async getCourse(slug: string): Promise<Course | null> {
      return (await load()).courses.find((course) => course.slug === slug) ?? null;
    },

    // Every Lesson of every Course, a Course at a time, in listCourses' order.
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

    // Every image a Course or Lesson header uses, in reading order, with its
    // credit (null when the manifest has none) and everywhere it shows.
    async listCredits(): Promise<ImageCredit[]> {
      return (await load()).credits;
    },

    // The manifest's credit for any image by its path, including one that no
    // header names, such as the home page's own photos. Null when it has none.
    async creditFor(image: string): Promise<Credit | null> {
      return (await load()).manifest.get(image) ?? null;
    },
  };
}

// The site's own Courses. Tests point coursesFrom at fixtures instead.
export const courses = coursesFrom(path.join(process.cwd(), "content"));
