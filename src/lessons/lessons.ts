import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

// Every place that shows a Lesson shows its photo, so the summary carries it:
// the photo's path under public/, a description for screen readers, and the
// photographer's name for the "Photo: <name> / Unsplash" credit.
export type LessonSummary = {
  number: number;
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
};

export type Lesson = LessonSummary & {
  html: string;
  previous: LessonSummary | null;
  next: LessonSummary | null;
};

type ParsedLesson = LessonSummary & { body: string };

// A Lesson file starts with a small header between --- lines:
//   title: Grilling
//   slug: grilling
//   order: 1
//   image: /photos/grilling.jpg
//   imageAlt: A woman in glasses questions a man across a desk.
//   imageCredit: Vitaly Gariev
const REQUIRED = ["title", "slug", "order", "image", "imageAlt", "imageCredit"];

function parseLesson(file: string, raw: string): ParsedLesson {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing the --- header`);
  const fields = Object.fromEntries(
    match[1].split("\n").map((line) => {
      const i = line.indexOf(":");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
  for (const key of REQUIRED) {
    if (!fields[key]) throw new Error(`${file}: missing ${key}`);
  }
  return {
    number: Number(fields.order),
    slug: fields.slug,
    title: fields.title,
    image: fields.image,
    imageAlt: fields.imageAlt,
    imageCredit: fields.imageCredit,
    body: match[2],
  };
}

function summarize(lesson: ParsedLesson): LessonSummary {
  const { number, slug, title, image, imageAlt, imageCredit } = lesson;
  return { number, slug, title, image, imageAlt, imageCredit };
}

export function lessonsFrom(dir: string) {
  async function readAll(): Promise<ParsedLesson[]> {
    const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
    const lessons = await Promise.all(
      files.map(async (f) => parseLesson(f, await readFile(path.join(dir, f), "utf8"))),
    );
    return lessons.sort((a, b) => a.number - b.number);
  }

  return {
    async listLessons(): Promise<LessonSummary[]> {
      return (await readAll()).map(summarize);
    },

    async getLesson(slug: string): Promise<Lesson | null> {
      const all = await readAll();
      const i = all.findIndex((l) => l.slug === slug);
      if (i === -1) return null;
      return {
        ...summarize(all[i]),
        html: await marked.parse(all[i].body),
        previous: i > 0 ? summarize(all[i - 1]) : null,
        next: i < all.length - 1 ? summarize(all[i + 1]) : null,
      };
    },

    async lessonExists(slug: string): Promise<boolean> {
      return (await readAll()).some((l) => l.slug === slug);
    },
  };
}

// The real course: the Markdown files in content/lessons.
export const lessons = lessonsFrom(path.join(process.cwd(), "content/lessons"));
