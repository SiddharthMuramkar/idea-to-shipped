import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

export type LessonSummary = { number: number; slug: string; title: string };

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
function parseLesson(file: string, raw: string): ParsedLesson {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing the --- header`);
  const fields = Object.fromEntries(
    match[1].split("\n").map((line) => {
      const i = line.indexOf(":");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
  for (const key of ["title", "slug", "order"]) {
    if (!fields[key]) throw new Error(`${file}: missing ${key}`);
  }
  return {
    number: Number(fields.order),
    slug: fields.slug,
    title: fields.title,
    body: match[2],
  };
}

function summarize({ number, slug, title }: ParsedLesson): LessonSummary {
  return { number, slug, title };
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
