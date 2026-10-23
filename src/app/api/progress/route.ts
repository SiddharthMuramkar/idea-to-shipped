import { reply } from "@/quiz/http";
import { quiz } from "@/quiz/quiz";
import { readVisitor } from "@/quiz/visitor";

// This file only speaks HTTP. The rules for passing live in the quiz module.

// GET /api/progress  ->  { passed, tried }, lists of Lesson slugs.
// Without a cookie it's empty and touches no database. It never sets the cookie.
export async function GET(request: Request) {
  return reply(await quiz.courseProgress(readVisitor(request)), 200);
}
