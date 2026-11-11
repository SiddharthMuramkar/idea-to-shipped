import type { Question, QuestionOption } from "@/lessons/lessons";

export type OptionId = QuestionOption["id"];

// The option picked for each question, by question id.
export type Answers = Readonly<Record<string, OptionId>>;

export type Grade = { score: number; total: number; right: ReadonlySet<string> };

// A Final test's score: one point per question answered with its right
// option. An unanswered question scores nothing.
export function grade(questions: readonly Question[], answers: Answers): Grade {
  const right = new Set(questions.filter((q) => answers[q.id] === q.correctOption).map((q) => q.id));
  return { score: right.size, total: questions.length, right };
}

// The first question still without an answer, as its index; -1 when every
// question has one, which is when the test can be submitted.
export function firstUnanswered(questions: readonly Question[], answers: Answers): number {
  return questions.findIndex((q) => answers[q.id] === undefined);
}

// A Final test result stands only while the store still holds the Done it
// saved. A reset (here, on /progress, or in another tab) or a newer test in
// another tab ends it, and the test starts fresh.
export function resultStands(result: { doneAt: string }, done: { doneAt: string } | null): boolean {
  return done?.doneAt === result.doneAt;
}
