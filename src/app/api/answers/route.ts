import { readJson, reply } from "@/quiz/http";
import { quiz } from "@/quiz/quiz";
import { readVisitor } from "@/quiz/visitor";

// This file only speaks HTTP. Grading and SQL live in the quiz module.

// GET /api/answers?lesson=<slug>
// This Visitor's latest Answers and Attempt. Reading never sets the cookie.
export async function GET(request: Request) {
  const lesson = new URL(request.url).searchParams.get("lesson") ?? "";
  const result = await quiz.lessonProgress(readVisitor(request), lesson);
  if (!result.ok) return reply({ error: result.error }, 400);
  return reply(result.value, 200);
}

// POST /api/answers  { lesson, question, option }  (Checkpoints only)
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body.ok) return body.response;
  // A Visitor's first Answer mints their id; every success renews the cookie.
  const visitor = readVisitor(request) ?? crypto.randomUUID();
  const result = await quiz.answerCheckpoint(visitor, body.value);
  if (!result.ok) return reply({ error: result.error }, 400);
  return reply(result.value, 201, visitor);
}
