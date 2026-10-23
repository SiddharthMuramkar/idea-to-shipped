# 02: Question data and API

**What to build:** A Visitor's Answers and Attempts are stored in Neon under an anonymous cookie, re-graded by the server, and readable back through four REST endpoints.

- **Schema:** `test_attempts` and `answers` in `src/db/schema.ts`, as in the spec. The migration is generated as `drizzle/0001_create_quiz_answers.sql`. `answers` is append-only, with one index for crowd stats and one for a Visitor's progress.
- **Quiz module:** `src/quiz/quiz.ts`, a factory `quizFrom(lessons)` with `answerCheckpoint`, `submitTest` (one `db.batch` of the Attempt plus its Answers), `lessonProgress` and `courseProgress`.
  - It re-grades every Answer from `getQuestions`.
  - Crowd stats count each Visitor's first Answer.
  - Passed means the latest Attempt scored at least `PASS_PERCENT`.
  - Checkpoints never count towards passing.
  - Errors are exact strings.
- **Supporting files:**
  - `src/quiz/visitor.ts` reads the cookie from the `Cookie` header and builds `Set-Cookie`, without `cookies()` from `next/headers`.
  - `src/quiz/limits.ts` holds `PASS_PERCENT = 80`, `MAX_REQUEST_CHARS = 4096` and `MIN_CROWD = 5`.
  - `src/result.ts` holds the shared `Result` type.
- **Endpoints:** `POST /api/answers`, `GET /api/answers?lesson=`, `POST /api/attempts` and `GET /api/progress`, thin Route Handlers (ADR 0001).
- **Tracing:** `next.config.ts` traces `"/api/**": ["./content/lessons/**/*"]`.

See the spec's "Question data in Neon", "Rules for the data", "The quiz module" and "Endpoints" decisions, and ADRs 0005 and 0006.

**Blocked by:** 01 (Lesson format, parser and course lint)

**Status:** ready-for-agent

- [ ] Migration `0001` is generated from the schema and applied to the Neon `test` and `vercel-dev` branches
- [ ] `POST /api/answers` `{ lesson, question, option }` returns 201 with the graded Answer and crowd stats. A Final test question sent here is rejected with 400
- [ ] `GET /api/answers?lesson=<slug>` returns this Visitor's latest Answer per question and their latest Attempt. Without a cookie it returns empty data and runs no query
- [ ] `POST /api/attempts` `{ lesson, answers: { [questionId]: optionId } }` returns 201 with the score, total, passed and per-question results. A missing question or an extra id is rejected with 400
- [ ] `GET /api/progress` returns `{ passed, tried }`. Without a cookie it returns empty lists and runs no query
- [ ] All four send `Cache-Control: private, no-store`. A body that isn't JSON or isn't an object returns 400, and a body over 4,096 characters returns 413, each with an exact `{ error }`
- [ ] The `visitor` cookie is a UUID: HttpOnly, SameSite=Lax, `Path=/`, `Max-Age` one year, Secure in production. It's set (and renewed) only on POST, never on GET, and a malformed cookie is replaced with a new id
- [ ] The server stores what it graded, never what the client claims. Crowd stats use each Visitor's first Answer; "passed" uses the latest Attempt (5/5 and 4/5 pass, 3/5 fails)
- [ ] Module tests (`src/quiz/quiz.test.ts`) and route tests run against the Neon `test` branch with no mocks (ADR 0003), using a fixture Lesson with 2 Checkpoints and a 5-question Final test
- [ ] The README API section and ADRs 0005 and 0006 match what was built
- [ ] Existing tests, lint, `tsc --noEmit` and build pass
