import { readJson, reply } from "@/quiz/http";
import { quiz } from "@/quiz/quiz";
import { readVisitor } from "@/quiz/visitor";

// This file only speaks HTTP. Grading and SQL live in the quiz module.

// POST /api/attempts  { lesson, answers: { [questionId]: optionId } }
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body.ok) return body.response;
  // A Visitor's first Answer mints their id; every success renews the cookie.
  const visitor = readVisitor(request) ?? crypto.randomUUID();
  const result = await quiz.submitTest(visitor, body.value);
  if (!result.ok) return reply({ error: result.error }, 400);
  return reply(result.value, 201, visitor);
}
