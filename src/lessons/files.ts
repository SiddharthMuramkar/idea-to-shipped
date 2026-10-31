import { countWordsIn } from "./markdown";

// The two kinds of file under content/: a Course's course.md, and its Lesson
// files. Both open with the same header of "key: value" lines between ---
// lines. A Lesson's body is parsed later, by parseBody (blocks.ts).

// A Lesson's photo, from Unsplash: its path under public/, a description for
// screen readers, and the photographer's name for the "Photo: <name> /
// Unsplash" credit.
export type Photo = { image: string; imageAlt: string; imageCredit: string };

// A Lesson file as it reads on its own, before its Course places it.
export type LessonFile = { slug: string; title: string; photo: Photo | null; minutes: number; body: string };

// A course.md: the Course's title and slug, then its Lessons' Slugs in
// reading order, grouped under each Part's title when it has Parts.
export type CourseFile = {
  slug: string;
  title: string;
  parts: { title: string; slugs: string[] }[] | null;
  slugs: string[];
};

// Slugs are kebab-case: a-z, 0-9 and single dashes. A Lesson's Slug is its
// address (/learn/<slug>) and its file's name, and the page's DOM ids join
// Slugs with "--", which a kebab-case Slug can never contain.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PHOTO_KEYS = ["image", "imageAlt", "imageCredit"];

// Reading speed for the "N min" label.
const WORDS_PER_MINUTE = 220;

// Editors on Windows save "\r\n" line endings and sometimes a byte-order mark
// at the very start. Neither is visible, so both are dropped before parsing.
function normalize(raw: string): string {
  return raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
}

// The header's fields and the text after it. `required` keys must be set;
// `optional` ones may be; any other key is an error.
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

// A photo takes all three keys, or a Lesson has none of them and no photo.
function parsePhoto(file: string, fields: Record<string, string>): Photo | null {
  const set = PHOTO_KEYS.filter((key) => fields[key]);
  if (set.length === 0) return null;
  const missing = PHOTO_KEYS.filter((key) => !fields[key]);
  if (missing.length > 0) {
    throw new Error(
      `${file}: a photo needs image, imageAlt and imageCredit together (missing ${missing.join(" and ")}): add ${missing.length > 1 ? "them" : "it"}, or remove ${set.join(" and ")} for a Lesson without a photo`,
    );
  }
  return { image: fields.image, imageAlt: fields.imageAlt, imageCredit: fields.imageCredit };
}

// A Lesson file's header:
//   title: Grilling
//   slug: grilling                      (permanent: Comments point at it)
//   image: /photos/grilling.jpg         (the photo is optional: set all
//   imageAlt: A woman questions a man.   three keys, or none)
//   imageCredit: Vitaly Gariev
// Its place in the course and its Part come from the Course's course.md.
export function parseLessonFile(file: string, raw: string): LessonFile {
  const { fields, body } = parseHeader(file, raw, ["title", "slug"], PHOTO_KEYS);
  if (!SLUG.test(fields.slug)) {
    throw new Error(
      `${file}: slug "${fields.slug}" isn't kebab-case: use a-z, 0-9 and single dashes (as in "spec-and-issues"), and name the file after it`,
    );
  }
  return {
    slug: fields.slug,
    title: fields.title,
    photo: parsePhoto(file, fields),
    minutes: Math.max(1, Math.ceil(estimateWords(body) / WORDS_PER_MINUTE)),
    body,
  };
}

// A course.md lists its Lessons by Slug, one "- <slug>" line each, in reading
// order. "## <title>" lines split them into Parts; with none, the Course has
// no Parts and its Lessons read as one list.
//   ---
//   title: Idea to shipped
//   slug: idea-to-shipped
//   ---
//
//   ## Foundations
//   - start-here
//   - how-agents-work
export function parseCourseFile(file: string, raw: string): CourseFile {
  const { fields, body } = parseHeader(file, raw, ["title", "slug"]);
  if (!SLUG.test(fields.slug)) {
    throw new Error(
      `${file}: slug "${fields.slug}" isn't kebab-case: use a-z, 0-9 and single dashes, and name the Course's folder after it`,
    );
  }
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
  return { slug: fields.slug, title: fields.title, parts: parts.length > 0 ? parts : null, slugs };
}
