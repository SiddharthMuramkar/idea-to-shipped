// The shapes the quiz API sends back. Plain types only, so the browser can
// import them without pulling in database code.

export type OptionId = "a" | "b" | "c" | "d";

// How Visitors answered one question. Each Visitor counts once, by their first
// Answer (Checkpoint or Final test). Every option the question has is listed,
// with 0 when nobody picked it, and answered is the sum of picked.
export type Stats = { answered: number; picked: Partial<Record<OptionId, number>> };

// One graded Answer. answer is the right option: it's in the page anyway (ADR 0006).
export type Checked = {
  question: string;
  option: OptionId;
  correct: boolean;
  answer: OptionId;
  stats: Stats;
};

// One graded Attempt at a Final test, with a Checked per question in Lesson order.
export type TestResult = { score: number; total: number; passed: boolean; results: Checked[] };

// One Visitor's state on one Lesson: their latest Answer to each question they've
// answered (Checkpoint and Final test, with current crowd stats) and their latest Attempt.
export type LessonProgress = {
  answers: Checked[];
  test: { score: number; total: number; passed: boolean; at: string } | null;
};

// Lesson slugs. passed: the latest Attempt passed. tried: any Answer or Attempt at all.
export type CourseProgress = { passed: string[]; tried: string[] };
