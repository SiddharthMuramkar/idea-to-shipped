# 01: Lesson format, parser and course lint

**What to build:** Lesson files can hold goals, Scenes, Checkpoints, a Final test, callouts, exercises, a Site story and sources, and a broken one can't ship.

- **Header:** `title`, `slug`, `order`, `part` (optional, 1–4, named by one `PARTS` constant), `image`, `imageAlt`, `imageCredit`. Any other key, or a slug or order used twice, fails loudly and names the file(s). `minutes` is computed at about 220 words per minute.
- **Typed blocks:** fenced code blocks whose first word is a kind (`goals`, `scene <chat|terminal|flow|files|meter>`, `checkpoint <id>`, `test <id>`, `callout <tip|watch-out|big-idea>`, `try`, `site-story`, `sources`) are parsed into typed blocks. Everything else is prose. The grammar for each is in `docs/authoring-lessons.md`; implement it exactly (contract v1.1, frozen, already in use by PR B).
- **Parser:** `src/lessons/markdown.ts` (a private `new Marked()` with the inline `==mark==` extension), plus `blocks.ts` and `scenes.ts`, all behind `lessons.ts`. Lex once and walk the top-level tokens. A `## ` heading opens a Section with a slugified id, made unique within the Lesson. A `# ` heading in the body is an error. A near-miss kind is an error ("did you mean …?"), except for the known-language allowlist.
- **Types:** `Lesson` = the summary plus `intro`, `sections`, `previous` and `next`. `Block`, `Scene` (five kinds, each with `steps: { captionHtml, items }[]`) and `Question` (`options` with ids `a`–`d`, `answer`, per-option `feedbackHtml`). All plain and serialisable. New `getQuestions(slug)`.
- **Errors** always name the file, the block kind and the id, e.g. `grilling.md: checkpoint "who-owns-details": needs exactly one [x] option`.
- **Vitest projects:** `content` (no setup file) and `db` (`setup-env.ts`, `fileParallelism: false`). Add `npm run test:content`.
- **Course lint:** a new `src/lessons/course.test.ts` with every rule listed in `docs/authoring-lessons.md`. `PENDING_REWRITE` holds all 12 current slugs.

See the spec's "Lessons module", "The parser", "Types", "Question rules" and "The course lint" decisions.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `npm run test:content` passes with no `.env*` files present, and `npm test` runs both projects
- [ ] The header accepts `part` 1–4 or no `part`. An unknown key, a bad `part`, a duplicate slug or a duplicate order each fail with the file name(s) in the message
- [ ] `getLesson` returns the intro and Sections (ids slugified and de-duplicated) with typed blocks of every kind, all five Scene kinds included, and the Final test as one block built from the contiguous `test` fences
- [ ] `getQuestions(slug)` returns every Checkpoint and Final test question with positional option ids `a`–`d`, the answer and feedback per option, and `null` for an unknown slug
- [ ] There's one broken fixture per error, each asserting that the message names the file, the block kind and the id:
  - [ ] no `[x]`, or two `[x]`
  - [ ] missing feedback
  - [ ] fewer than 3 or more than 4 options
  - [ ] an empty prompt
  - [ ] a bad or duplicate question id (Checkpoints and the Final test share one set)
  - [ ] non-contiguous `test` fences
  - [ ] goals after the first `##`
  - [ ] two Scenes in one Section
  - [ ] a Scene with an unknown setting, an item before its first step, zero steps, or an item that doesn't fit its kind
  - [ ] a flow `at:` naming an undeclared node
  - [ ] a near-miss kind ("did you mean …?")
  - [ ] a `# ` heading in the body
- [ ] Fences tagged with an allowlisted language (e.g. `ts`, `text`, `txt`) stay ordinary code
- [ ] `==mark==` renders `<mark>`, while `a == b` and `===` stay literal. A four-backtick `try` or `site-story` holding a three-backtick code block parses
- [ ] The runtime parser does no `public/` checks. The course lint checks header photos exist under `public/`
- [ ] `course.test.ts` implements every course-wide and per-Lesson rule from `docs/authoring-lessons.md`, skips per-Lesson rules for `PENDING_REWRITE`, and passes on today's 12 Lessons
- [ ] All 12 current Lessons still parse and render exactly as before, and a deliberately broken Lesson fails `npm run build`
- [ ] The full example in `docs/authoring-lessons.md` parses without errors
- [ ] Existing tests, lint, `tsc --noEmit` and build pass
