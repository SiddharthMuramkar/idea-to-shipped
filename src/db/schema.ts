import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// lesson_slug points at a Lesson file by its permanent Slug. There's no
// foreign key, because Lessons aren't in the database (ADR 0004).
export const comments = pgTable(
  "comments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    lessonSlug: text("lesson_slug").notNull(),
    name: text("name"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("comments_lesson_slug_created_at_idx").on(t.lessonSlug, t.createdAt)],
);
