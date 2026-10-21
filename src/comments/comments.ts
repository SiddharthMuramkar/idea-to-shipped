import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { lessons } from "@/lessons/lessons";

const MAX_BODY = 2000;
const MAX_NAME = 50;

export type Comment = { id: number; name: string; body: string; createdAt: string };

type Row = typeof comments.$inferSelect;

function toComment(row: Row): Comment {
  return {
    id: row.id,
    name: row.name ?? "Anonymous",
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const UNKNOWN_LESSON = { ok: false, error: "Unknown lesson." } as const;

// No foreign key protects lesson_slug (ADR 0004), so check it here.
async function isLesson(slug: unknown): Promise<boolean> {
  return typeof slug === "string" && slug !== "" && (await lessons.lessonExists(slug));
}

export async function postComment(input: {
  lesson: string;
  name?: string;
  body: string;
}): Promise<Result<Comment>> {
  if (!(await isLesson(input.lesson))) return UNKNOWN_LESSON;
  const body = (input.body ?? "").trim();
  const name = (input.name ?? "").trim();
  if (!body) return { ok: false, error: "Comment can't be empty." };
  if (body.length > MAX_BODY) {
    return { ok: false, error: `Comment must be ${MAX_BODY} characters or fewer.` };
  }
  if (name.length > MAX_NAME) {
    return { ok: false, error: `Name must be ${MAX_NAME} characters or fewer.` };
  }

  const [row] = await db
    .insert(comments)
    .values({ lessonSlug: input.lesson, name: name || null, body })
    .returning();
  return { ok: true, value: toComment(row) };
}

export async function listComments(lesson: string): Promise<Result<Comment[]>> {
  if (!(await isLesson(lesson))) return UNKNOWN_LESSON;
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.lessonSlug, lesson))
    .orderBy(desc(comments.createdAt), desc(comments.id));
  return { ok: true, value: rows.map(toComment) };
}
