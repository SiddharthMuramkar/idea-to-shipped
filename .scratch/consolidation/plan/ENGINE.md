# Engine spec: the merged idea-to-shipped site

Repo: `/home/user/idea-to-shipped` (Next.js 16.4, React 19.3, marked, no CSS framework; read `AGENTS.md`: this Next.js has breaking changes, so read the relevant guide in `node_modules/next/dist/docs/` before writing Next code). Node 24: put it on PATH first with `export PATH=/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/node24bin:$PATH`.

Goal: turn the one-Course site into a multi-Course **reference library** where every Lesson has optional quick-check questions while reading and a **Final test** (≥5 questions) at the end. Submitting the Final test marks the Lesson **Done** (a green tick/label) whatever the score. Progress lives in the visitor's browser (localStorage): no accounts. The existing look (white, royal blue/navy, Inter, photo bands, scroll reveals, Scenes) stays; extend it, don't restyle it.

The content format is `plan/FORMAT.md` (same folder as this file). The content in `content/` (seven Course folders) is being rewritten in parallel by other agents; **never edit `content/`**. Checks you can run: `npx next typegen && npx tsc --noEmit`, `npm run lint`, `npm run test:content`, `npx vitest run --project content --project render`, and a build with `DATABASE_URL=postgresql://build:build@localhost:5432/build npx next build` (pages are static; only the comments API imports the db).

---

## E1. Parser, model and lint (`src/lessons/**`, plus the minimal `src/app` edits named here)

1. **Questions** (`questions.ts`):
   - 2 to 6 options (option ids a–f), exactly one `[x]`.
   - Per-option feedback (`  > ` lines under an option) becomes optional.
   - New optional line after the options: `Why: <text>` (one line), the question's explanation. Store it as `explanationHtml: string | null`.
   - Rule: a question needs a `Why:` line, or feedback under every option. Error messages in the existing style (say what's wrong and how to fix it).
   - `QuestionOption.feedbackHtml` may be `""` when absent.
2. **Blocks** (`blocks.ts`):
   - Callout tone `remember` (label "Remember").
   - New kind `flashcards`: body is pairs of `Q: …` / `A: …` lines (inline Markdown), pairs separated by blank lines. Block `{ type: "flashcards"; cards: { frontHtml: string; backHtml: string }[] }`. Errors for a malformed pair, an empty block.
   - New kind `diagram`: call `parseDiagram(file, text)` from a NEW module `src/lessons/diagrams.ts`, which you create as a stub: `export type Diagram = { type: string; caption: string; source: string }` parsed minimally (type + caption lines), or throwing a clear error when either is missing. Block `{ type: "diagram"; diagram: Diagram }`. Another agent (D) will replace `diagrams.ts` wholesale with the real parser, keeping the export names `Diagram` and `parseDiagram`.
   - Add `flashcards`, `diagram` and `remember` to the near-miss hints table (e.g. `cards` → `flashcards`, `mermaid` → `diagram`).
   - Final test: still one run of consecutive `final-test` blocks in a Section. Keep the existing rules.
3. **Files** (`files.ts`):
   - Lesson header keys: `title`, `slug` (required), `summary` (optional in the parser; the lint requires it), `image` + `imageAlt` (optional, together). `imageCredit` is gone: credits come from a manifest (below).
   - `course.md` header keys: `title`, `slug`, `description` (required), `order` (optional integer), `image` + `imageAlt` (optional, together).
4. **Model** (`lessons.ts`):
   - `Photo = { image: string; imageAlt: string; credit: Credit | null }` where `Credit = { title: string; author: string; license: string; licenseUrl: string | null; source: string }`, looked up by `image` path in `content/image-credits.json` (a JSON object keyed by the image path, e.g. `"/images/lessons/tdd.jpg"`). A missing manifest file means no credits (not an error in the loader; the lint reports missing credits).
   - `Course` gains `description`, `order`, `photo`. `listCourses()` returns Courses by `order`, then slug.
   - `LessonSummary` gains `summary: string | null` and `course: { slug: string; title: string }`.
   - Add `listCredits()`: every image used by a Lesson or Course header with its credit and where it's used (for a /credits page).
5. **Lint** (`course-lint.ts`, `course.test.ts`, `course-lint.test.ts`): replace the Idea-to-shipped house rules (word counts, Final test 8–10, question-mix prefixes, Site story slugs, required goals/scenes/sources) with rules for **every** Course:
   - links to `/learn/<slug>` reach a Lesson (exists already);
   - a Final test with at least 5 questions, in the Lesson's last `##` Section, titled "Final test"; nothing but a `sources` block after the questions;
   - every Lesson has a `summary` (≤ 200 characters) and every Course a `description`;
   - no "all of the above" / "none of the above" (exists);
   - no "Lesson N" mentions (exists);
   - backticked `/name` slash names must be known: extend `SKILLS` with every folder name in `/home/user/skills/snapshot/skills/` (write them into the set; don't read that path at runtime) plus `orca-cli`, `orchestration`;
   - every header `image` exists under `public/` and has a credit in `content/image-credits.json` whose `license` matches CC0, Public domain / PD…, CC BY x.y or CC BY-SA x.y (any version), with non-empty `author` and an `https://` `source`.
   - Drop `checkLongestOption` (option order is shuffled on the page and the converted questions are already balanced).
   - The real-content tests may fail on content problems while the content agents work (e.g. a draft with 4 final-test questions). That's expected: don't edit content. Make sure your code is right with fixtures, and list in your final report which real-content files fail which rule.
6. **Fixtures and tests**: update `src/lessons/__fixtures__/` (the complete-example Course must show every block kind: flashcards, diagram, remember callout, Why lines, 2–6 options) and the tests to the new rules. Keep the suite green apart from real-content failures. Remove fixtures/tests for rules you deleted.
7. **Minimal `src/app` edits so everything still type-checks and renders**: `Photo` no longer has `imageCredit` (update `photo-band.tsx`'s credit text to use `credit`: "Image: <author> · <license>" linking to the source; `credits/page.tsx` and `credits/unsplash.ts` may be reduced to a simple list from `listCredits()`); `home-course.ts` keeps working with the `idea-to-shipped` Course; `BlockView` in `src/app/learn/[slug]/blocks.tsx` gets cases for `flashcards` (a simple static list for now: front in bold, back under it) and `diagram` (render `<DiagramView diagram={…} />` from a NEW file `src/app/learn/[slug]/diagram.tsx` that you create as a stub showing the caption and `<pre>` of the source; agent D replaces it). Remember-tone callouts reuse the callout styles with their own label/icon. Questions render the explanation under the answer in the existing "Show the answer" box. Don't do any other UI work: agent E2 does it next.
8. Update `docs/writing-guide.md` and `README.md`'s Content section to describe the new format briefly (or point to the fixture). Commit your work in your worktree branch with clear messages (end each commit message with the two attribution lines: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01ShQHGpLYqS32VXQuiLJanY`). Never push.

---

## D. Diagrams (port from the skills site)

Port the skills site's Diagram parser and renderer into this site:

- Sources: `/home/user/skills/src/course/diagrams.ts` (schemas, layout, `gitLayout`), `/home/user/skills/src/course/plain-text.ts` if needed, `/home/user/skills/src/app/diagram/*` (React components + CSS modules), and the spec in `/home/user/skills/content/README.md`, section "Diagrams". Read them; don't run anything in the skills repo.
- Target: replace `src/lessons/diagrams.ts` with the real parser (`export type Diagram`, `export function parseDiagram(file: string, source: string): Diagram`, throwing errors that name the file and say what to fix), and replace `src/app/learn/[slug]/diagram.tsx` with the real server-rendered renderer `DiagramView({ diagram })`, plus its CSS (CSS modules next to it are fine). Inline Markdown in Diagram strings renders with this repo's `renderInline` (marked) instead of the skills site's `InlineText`. Item links in strings are already rewritten to `/learn/<slug>`.
- Drop the "copied words" rule (Diagram text must appear in the Lesson); keep every other limit.
- Map the skills site's design tokens to this site's (see `src/app/globals.css` `:root`): royal blue accent, navy, the same fonts. Diagrams must look good in the lesson column, fit phones (no horizontal page scroll; let wide diagrams scroll inside their own box), and have an accessible name (the caption).
- Add `yaml` and `zod` (versions the skills repo uses) to package.json if you need them.
- Tests: parse every ```diagram block in `content/**/*.md` (there are ~110) without error, plus unit tests for errors and the git layout. Render a few in the render test.
- Commit in your worktree branch (same attribution lines as above). Never push. Don't touch other files beyond wiring.

---

## E2. Pages, interactivity, progress (after E1 is merged)

1. **Progress store** (client, `src/app/progress/…` or similar): localStorage key `its-progress-v1` → `{ lessons: { [slug]: { doneAt: string; score: number; total: number } } }`. Read/write wrapped in try/catch (private mode); `useSyncExternalStore` hook with a server snapshot of "nothing done" (no hydration mismatch); a `storage` event listener so other tabs update. Unit-test the pure parts.
2. **Quick checks (checkpoints) as in the skills site's Margin questions**: a compact card after its block ("Quick check" eyebrow, the prompt, options as buttons). One tap answers: the picked option is marked right/wrong, the right one is marked, and "Right." / "Not quite." plus the option's feedback and the explanation appear (aria-live). A "Try again" link resets it. Nothing is saved. On wide screens (≥1280px) lift them into a rail to the right of the text level with their block, never overlapping (see `/home/user/skills/src/app/margin-question.tsx`, `margin-rail.tsx` and `margin-question.module.css`), in Sections where that column is free; otherwise inline. Without JavaScript, keep today's "Show the answer" `<details>`.
3. **Final test** (navy band, as now) becomes a real test: each question's options are choosable; a "Submit test" button is enabled once every question has an answer; on submit, show the score ("You got 6 of 8"), mark each question right/wrong with the right answer, feedback and explanation, **mark the Lesson Done** in the progress store, and show a green **Done** banner with "Next lesson →" (next in its Course, or the next Course's first lesson at a Course's end) and "Retake the test". If the Lesson is already Done when the page loads, show the banner with the last score and date, above a fresh test.
4. **Option order**: shuffle options deterministically per question (seeded by slug + question id), on the server, so a reload keeps the order and the right answer's position gives nothing away.
5. **Done everywhere**: a green "Done ✓" pill in the Lesson hero; a green tick on every Lesson card (`data-tick-slot` exists); Course cards and Course pages show "N of M done" with a progress bar.
6. **Pages**:
   - `/`: the library home. A photo-band hero ("A free library for building software with coding agents" or better), a short "How it works" strip (Read → Quick checks (optional) → Final test → Done ✓), the Courses as cards in `order` (image, title, description, lesson count, progress), and a "Continue where you left off" link (the first not-Done lesson of the most recently active Course; hidden when nothing is started).
   - `/courses/[course]`: hero with the Course photo, description, progress, "Start"/"Continue" button, and its Parts with lesson cards (title, summary, minutes, Done tick).
   - `/learn/[slug]`: as now, plus a breadcrumb (Course › Part), the Done pill, the interactive questions, flashcards as flip cards (click/Enter flips, keyboard accessible, reduced-motion respected; without JS show both sides), and prev/next within the Course (and to the next Course at the end).
   - `/credits`: every image with thumbnail, title, author, license (linked) and source, grouped by Course.
   - `/progress`: every Course with its Done count, the Done lessons with scores, and a "Reset my progress" button (with confirm).
   - Header nav: "Courses" (→ `/#courses`), "Progress". Footer: the Courses list (not every lesson), and "Images: openly licensed, from Wikimedia Commons. Credits".
   - Permanent redirects in `next.config.ts`: `/learn/spec-and-issues` → `/learn/to-spec`, `/learn/pr-and-ship` → `/learn/pr`, `/learn/architecture` → `/learn/improve-codebase-architecture`.
   - Update `<title>`s and the site description ("Idea to Shipped" stays the site name).
7. **Remove** the Unsplash-only code and photos once nothing uses them (`public/photos/`, `home-photos.ts`, `credits/unsplash.ts`), replacing the home/CTA photos with Course images (new images arrive under `public/images/`).
8. **Comments** (Discussion) keep working unchanged on every Lesson.
9. Accessibility and phones: keyboard-usable everything, visible focus, colour never the only signal (Done also says "Done"), no horizontal scroll at 375px, `prefers-reduced-motion` respected.
10. Tests: update page/render tests; add tests for grading, the store, shuffling. Then run the build and check pages in Chromium with Playwright (`require('playwright')`, launch with no options) at 1440px and 390px: home, a course page, a lesson with a diagram and flashcards; answer a quick check; submit a final test; see Done on the card. Save screenshots to the scratchpad `shots/` folder.
11. Commit in your worktree branch (same attribution lines). Never push.
