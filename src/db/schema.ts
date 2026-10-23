import {
  boolean,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// One row per Comment. lesson_slug points at a Lesson file by its permanent
// Slug. There's no foreign key, because Lessons aren't in the database (ADR 0004).
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

// One row per Attempt: one Visitor submitting a Lesson's whole Final test.
// The id is made in TypeScript (crypto.randomUUID), so one db.batch can insert
// the Attempt and its Answers together. There's no visitors table: a Visitor
// is only a random id in a cookie (ADR 0006). score and total are stored as
// graded, so fixing an answer key never changes an old pass (ADR 0005).
export const testAttempts = pgTable(
  "test_attempts",
  {
    id: uuid("id").primaryKey(),
    visitorId: uuid("visitor_id").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    score: smallint("score").notNull(),
    total: smallint("total").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // A Visitor's latest Attempt per Lesson.
  (t) => [
    index("test_attempts_visitor_lesson_created_at_idx").on(
      t.visitorId,
      t.lessonSlug,
      t.createdAt,
    ),
  ],
);

// One row per Answer, every time a Visitor answers. Append-only: never updated.
// lesson_slug, question_id and option_id point into a Lesson file by permanent
// ids, with no foreign key (ADR 0004, ADR 0005). correct is graded by the
// server when the Answer arrives. attempt_id is null for a Checkpoint Answer.
export const answers = pgTable(
  "answers",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    visitorId: uuid("visitor_id").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    questionId: text("question_id").notNull(),
    optionId: text("option_id").notNull(),
    correct: boolean("correct").notNull(),
    attemptId: uuid("attempt_id").references(() => testAttempts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Crowd stats: each Visitor's first Answer to each question.
    index("answers_lesson_question_visitor_id_idx").on(
      t.lessonSlug,
      t.questionId,
      t.visitorId,
      t.id,
    ),
    // One Visitor's progress: their latest Answer per question.
    index("answers_visitor_lesson_id_idx").on(t.visitorId, t.lessonSlug, t.id),
  ],
);
