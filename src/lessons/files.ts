import { countWordsIn } from "./markdown";

// The two kinds of file under content/: a Course's course.md, and its Lesson
// files. Both open with the same header of "key: value" lines between ---
// lines. A Lesson's body is parsed later, by parseBody (blocks.ts).
// __fixtures__/complete-example/ is a whole Course written out, with every
// block kind and Scene kind.

// The image a header names: its path under public/ and a description for
// screen readers. Who made it and its licence come from the credits manifest
// (lessons.ts), never from the header, so one place holds every credit.
export type HeaderImage = { image: string; imageAlt: string };

// A Lesson file as it reads on its own, before its Course places it. The
// summary is optional here; the content lint asks every Lesson for one.
export type LessonFile = {
  slug: string;
  title: string;
  summary: string | null;
  image: HeaderImage | null;
  minutes: number;
  body: string;
};

// A course.md: the Course's header, then its Lessons' Slugs in reading
// order, grouped under each Part's title when it has Parts.
export type CourseFile = {
  slug: string;
  title: string;
  description: string;
  // Where the Course sits in the list of Courses; null for after the rest.
  order: number | null;
  image: HeaderImage | null;
  parts: { title: string; slugs: string[] }[] | null;
  slugs: string[];
};

// Slugs are kebab-case: a-z, 0-9 and single dashes. A Lesson's Slug is its
// address (/learn/<slug>) and its file's name, and the page's DOM ids join
// Slugs with "--", which a kebab-case Slug can never contain.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const IMAGE_KEYS = ["image", "imageAlt"];

const WORDS_PER_MINUTE = 220;

// Editors on Windows save "\r\n" line endings and sometimes a byte-order mark
// at the very start. Neither is visible, so both are dropped before parsing.
function normalize(raw: string): string {
  return raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
}

function parseHeader(file: string, raw: string, required: string[], optional: string[] = []) {
  const match = normalize(raw).match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(
      `${file}: missing the --- header: start the file with a "---" line, its "key: value" lines, then another "---" line`,
    );
  }
  const keys = [...required, ...optional];
  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    if (line.trim() === "") continue;
    const i = line.indexOf(":");
    const key = line.slice(0, i).trim();
    if (i === -1 || !keys.includes(key)) {
      throw new Error(
        `${file}: unknown header key "${i === -1 ? line.trim() : key}": remove it (the header's keys are ${keys.join(", ")})`,
      );
    }
    if (key in fields) throw new Error(`${file}: header key "${key}" is set twice: keep one`);
    fields[key] = line.slice(i + 1).trim();
  }
  for (const key of required) {
    if (!fields[key]) throw new Error(`${file}: missing ${key}: add a "${key}: …" line to the header`);
  }
  return { fields, body: match[2] };
}

// A cheap word count straight from the Markdown, so listing Lessons never has
// to parse their blocks. Fence lines, HTML tags, link targets and option
// boxes aren't read by anyone, so they don't count.
function estimateWords(body: string): number {
  return countWordsIn(
    body
      .split("\n")
      .filter((line) => !/^\s*(`{3,}|~{3,})/.test(line))
      .join(" ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\]\([^)]*\)/g, "] ")
      .replace(/\[[ xX]\]/g, " "),
  );
}

// `owner` names what a header without an image is: "a Lesson" or "a Course".
function parseImage(file: string, fields: Record<string, string>, owner: string): HeaderImage | null {
  const [set] = IMAGE_KEYS.filter((key) => fields[key]);
  if (!set) return null;
  const [missing] = IMAGE_KEYS.filter((key) => !fields[key]);
  if (missing) {
    throw new Error(
      `${file}: image and imageAlt go together (missing ${missing}): add it, or remove ${set} for ${owner} without an image`,
    );
  }
  return { image: fields.image, imageAlt: fields.imageAlt };
}

// Courses are listed by this number, so any whole number will do: gaps
// leave room to slot a Course in later.
function parseOrder(file: string, value: string | undefined): number | null {
  if (!value) return null;
  if (!/^-?\d+$/.test(value)) {
    throw new Error(
      `${file}: order "${value}" isn't a whole number: write one, as in "order: 3" (Courses are listed by order, then by slug)`,
    );
  }
  return Number(value);
}

// A Lesson's place and its Part come from its Course's course.md, never from
// its own header.
export function parseLessonFile(file: string, raw: string): LessonFile {
  const { fields, body } = parseHeader(file, raw, ["title", "slug"], ["summary", ...IMAGE_KEYS]);
  if (!SLUG.test(fields.slug)) {
    throw new Error(
      `${file}: slug "${fields.slug}" isn't kebab-case: use a-z, 0-9 and single dashes (as in "spec-and-issues"), and name the file after it`,
    );
  }
  return {
    slug: fields.slug,
    title: fields.title,
    summary: fields.summary || null,
    image: parseImage(file, fields, "a Lesson"),
    minutes: Math.max(1, Math.ceil(estimateWords(body) / WORDS_PER_MINUTE)),
    body,
  };
}

export function parseCourseFile(file: string, raw: string): CourseFile {
  const { fields, body } = parseHeader(file, raw, ["title", "slug", "description"], ["order", ...IMAGE_KEYS]);
  if (!SLUG.test(fields.slug)) {
    throw new Error(
      `${file}: slug "${fields.slug}" isn't kebab-case: use a-z, 0-9 and single dashes, and name the Course's folder after it`,
    );
  }
  const order = parseOrder(file, fields.order);
  const image = parseImage(file, fields, "a Course");
  const parts: { title: string; slugs: string[] }[] = [];
  const slugs: string[] = [];
  // Slugs listed before the first heading.
  const loose: string[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trimEnd();
    if (line === "") continue;
    const heading = /^## +(\S.*)$/.exec(line);
    const listed = /^- +(.*)$/.exec(line);
    if (heading) {
      parts.push({ title: heading[1], slugs: [] });
    } else if (listed) {
      const slug = listed[1];
      if (!SLUG.test(slug)) {
        throw new Error(
          `${file}: "${line}": list each Lesson by its Slug, the name of its file without ".md" (as in "- spec-and-issues")`,
        );
      }
      if (slugs.includes(slug)) throw new Error(`${file}: "${line}": "${slug}" is listed twice: list each Lesson once`);
      slugs.push(slug);
      const part = parts[parts.length - 1];
      if (part) part.slugs.push(slug);
      else loose.push(slug);
    } else {
      throw new Error(`${file}: "${line.trim()}": course.md holds only "## <Part title>" lines and "- <slug>" lines`);
    }
  }
  if (parts.length > 0 && loose.length > 0) {
    throw new Error(
      `${file}: "- ${loose[0]}" comes before the first "## " heading: in a Course with Parts every Lesson sits under one, so move it under a heading (or remove every heading for a Course without Parts)`,
    );
  }
  const empty = parts.find((part) => part.slugs.length === 0);
  if (empty) {
    throw new Error(`${file}: Part "${empty.title}" lists no Lessons: add "- <slug>" lines under it, or remove its heading`);
  }
  if (slugs.length === 0) {
    throw new Error(`${file}: lists no Lessons: add one "- <slug>" line per Lesson, in reading order`);
  }
  return {
    slug: fields.slug,
    title: fields.title,
    description: fields.description,
    order,
    image,
    parts: parts.length > 0 ? parts : null,
    slugs,
  };
}
