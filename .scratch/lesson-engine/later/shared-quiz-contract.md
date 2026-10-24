
SHARED QUIZ CONTRACT (the API agent implements it; the UI in ticket 05 will consume it — keep EXACTLY these names):
- src/quiz/types.ts (client-safe: NO db or node imports): 
  export type OptionId = "a" | "b" | "c" | "d";
  export type Stats = { answered: number; picked: Partial<Record<OptionId, number>> }  // zero-filled for every option the question has; answered = number of distinct Visitors whose FIRST answer is counted
  export type Checked = { question: string; option: OptionId; correct: boolean; answer: OptionId; stats: Stats }
  export type TestResult = { score: number; total: number; passed: boolean; results: Checked[] }
  export type LessonProgress = { answers: Checked[]; test: { score: number; total: number; passed: boolean; at: string } | null }  // answers = this Visitor's LATEST answer per question (checkpoint and test), each with current stats
  export type CourseProgress = { passed: string[]; tried: string[] }  // slugs; tried = has any answer or attempt
- src/quiz/limits.ts (client-safe): PASS_PERCENT = 80, MAX_REQUEST_CHARS = 4096, MIN_CROWD = 5, and export function passed(score, total) { return total > 0 && score * 100 >= total * PASS_PERCENT }.
- Endpoints (Route Handlers that only speak HTTP; logic lives in src/quiz/quiz.ts):
  POST /api/answers  body {lesson, question, option} -> 201 Checked   (checkpoint questions only; a test question -> 400 "That question is in the Final test. Submit the whole test.")
  GET  /api/answers?lesson=<slug> -> 200 LessonProgress  (no cookie -> {answers: [], test: null}, no DB query)
  POST /api/attempts body {lesson, answers: {[questionId]: OptionId}} -> 201 TestResult (must contain exactly the Lesson's Final test question ids)
  GET  /api/progress -> 200 CourseProgress (no cookie -> {passed: [], tried: []}, no DB query)
  Errors: 400 {error: "<exact message>"}, 413 {error: "Request body is too large."}; messages: "Request body must be JSON.", "Request body must be a JSON object.", "Unknown lesson.", "Unknown question.", "Unknown option.", "That question is in the Final test. Submit the whole test.", "This lesson has no Final test.", "Answer every question in the Final test.". All four responses: Cache-Control: private, no-store. Cookie: visitor=<uuid>; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax; plus Secure when NODE_ENV === "production"; set (and refreshed) on every successful POST; never on GET; malformed cookie = missing (POST mints a new one).
