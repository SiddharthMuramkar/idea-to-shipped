# Spec: The Lesson engine (Scenes, Checkpoints, a Final test and the scroll experience)

Status: ready-for-agent

Read first: `GLOSSARY.md` (use its terms exactly, including the new **Part**, **Checkpoint**, **Final test**, **Answer**, **Attempt**, **Scene** and **Site story**; never a bare "Test" or "quiz" in anything a Visitor reads), `docs/adr/0001`–`0007`, and `docs/authoring-lessons.md` (the authoring contract). The **Scroll experience** section below is self-contained: read it on its own to review how reading a Lesson looks and feels. This spec reverses user stories 26 and 34 and lines 74 and 130 of `.scratch/main-flow-and-redesign/spec.md` (see "What this reverses"); everything else in that spec still holds.

## Problem Statement

The course has 12 Lessons, and every one is a short build-journal entry: what the Skill is, when to use it, what I typed, what happened. That worked as a journal, but it doesn't teach a beginner. There are no goals, so a Visitor doesn't know what they should be able to do afterwards. There's no way to check yourself. And most Lessons say what I did, not how the Skill works or why it works that way.

Reading is flat, too. Blocks fade in as you scroll, but nothing on the page explains by moving. A grilling round, a terminal session or a context window filling up is described in a paragraph instead of shown.

The Lesson format can't fix either problem. A Lesson file is a header plus plain Markdown, so there's nowhere to write a goal list, a question with its right answer, or a picture that builds step by step. And the database only knows Comments, so there's nowhere to store an Answer or a pass.

I want a from-zero course: deep Lessons with goals, Checkpoints along the way and a Final test at the end. I want reading to feel alive: bold type, Scenes that build as you scroll, backgrounds that shift between Sections, and question cards that restyle the moment you answer.

## Solution

The work is split into two PRs, built in parallel on two branches:

- **PR A (this spec): the Lesson engine.** The format, the parser, the page, the scroll experience, the questions and their data. It ships with one real rewritten Lesson, `grilling`, as the pilot.
- **PR B (`.scratch/course-rewrite/` on its sibling branch): the course.** It writes the 20-Lesson course in four Parts against the authoring contract in `docs/authoring-lessons.md`, keeps every old slug, adds the new photos, and owns the README Lesson table.

PR A merges first. PR B then syncs with main and runs `npm run test:content` before it goes ready.

What PR A builds:

1. **A Lesson format with typed blocks.** Fenced code blocks whose first word names a kind (`goals`, `scene`, `checkpoint`, `test`, `callout`, `try`, `site-story`, `sources`) become parts of the page. The Lessons module parses and checks them at build time, and a broken Lesson fails the build with the file, the block and the id named.
2. **A course lint**, `npm run test:content`, that holds every rewritten Lesson to the course's size and quality rules. It needs no database or env file, so PR B's drafting agents can run it anywhere.
3. **A new Lesson page.** Bold type, each Section a column of text beside a sticky stage, a slim section bar, background tones, and the Scenes. See **Scroll experience**.
4. **Checkpoints and a Final test.** The browser grades instantly. The server re-grades and stores each Answer under an anonymous cookie. Crowd bars show how other Visitors answered, and ticks show which Lessons you've passed.
5. **The `grilling` pilot.** PR B writes it as a standalone commit, and PR A cherry-picks it, so the engine ships with one real Lesson that uses every part of it.

## User Stories

1. As a beginner Visitor, I want each Lesson to start with 3–4 goals, so that I know what I'll be able to do by the end.
2. As a beginner Visitor, I want a Lesson to teach how its Skill works and why before it shows how the author used it, so that I learn the Skill and not only one person's story.
3. As a Visitor, I want the author's own experience kept in a clearly marked Site story box, so that I can tell the teaching from the story.
4. As a Visitor, I want key ideas shown as Scenes that build step by step as I scroll past their captions, so that I see a session unfold instead of reading about it.
5. As a Visitor, I want a Scene to step back when I scroll back up, so that I can replay a moment I missed.
6. As a Visitor, I want chat Scenes that show what I'd type and how the agent replies, so that I know what a real session looks like.
7. As a Visitor, I want terminal Scenes that type each command out before its output appears, so that I can follow the exact commands in the right order.
8. As a Visitor, I want flow Scenes that light up where I am in a process, forks included, so that I can see what comes next.
9. As a Visitor, I want files Scenes that show which files a step adds or changes, so that I know what a Skill leaves behind in my repo.
10. As a Visitor, I want meter Scenes that show the context window filling up and leaving the Smart zone, so that "context" stops being abstract.
11. As a Visitor, I want a Checkpoint right after a key idea, so that I find out straight away whether I understood it.
12. As a Visitor, I want feedback the moment I press Check, with an explanation of the option I picked, right or wrong, so that a wrong answer still teaches me something.
13. As a Visitor, I want to see how other Visitors answered a Checkpoint, so that I know whether my mistake is a common one.
14. As one of the first Visitors to answer, I want to be told that instead of seeing "100% picked this", so that tiny numbers don't mislead me.
15. As a Visitor, I want Checkpoints never to count towards passing, so that I can guess freely while I'm learning.
16. As a Visitor, I want a Final test at the end of each Lesson that passes at 80%, so that I can prove to myself I've got it.
17. As a Visitor who failed a Final test, I want to see which answers were wrong and why, and to try again, so that failing is part of learning.
18. As a Visitor who passed, I want a score ring, a Passed badge and my goals ticked off, so that finishing feels like an achievement.
19. As a Visitor, I want ticks on the home page cards and on Previous/Next for the Lessons I've passed, so that I can see my progress through the course.
20. As a returning Visitor on the same browser, I want my Answers and my last Final test result restored without signing in, so that I can pick up where I left off.
21. As a privacy-minded Visitor, I want one plain line saying what is stored and why, so that I can decide whether to answer.
22. As a Visitor, I want big bold headings that rise into place as I reach them, so that the page feels alive and easy to scan.
23. As a Visitor, I want key phrases highlighted with a marker sweep as I reach them, so that the important words stand out.
24. As a Visitor, I want a slim section bar showing the Part, the Lesson, my current Section, my reading progress and my Checkpoints, so that I always know where I am.
25. As a Visitor, I want to jump to any Section from the section bar, so that I can go straight back to the part I need.
26. As a Visitor, I want the background to shift as I move between Sections and turn navy for the Final test, so that I feel the change of gear.
27. As a Visitor, I want the Discussion after the Final test as a full-width band, so that I can comment once I've finished, with room to read.
28. As a Visitor on a phone, I want at least half the screen left for text even while a Scene is pinned, and no sideways scrolling, so that Lessons are comfortable in my pocket.
29. As a Visitor, I want nothing on the page to jump while it loads or while I answer, so that I never lose my place.
30. As a Visitor with reduce motion turned on, I want no movement at all while Scenes still change step, so that I get the whole Lesson without discomfort.
31. As a Visitor whose browser lacks scroll-driven animations, I want the same content and working Scenes, so that I only miss decoration.
32. As a Visitor with JavaScript off, I want every Lesson fully readable, Scenes in their final state and each Checkpoint's answer behind a "Show the answer" toggle, so that nothing is ever stuck invisible.
33. As a keyboard Visitor, I want to answer every question with the keyboard, with grading only when I press Check, so that moving between options never grades by accident.
34. As a screen reader Visitor, I want feedback announced, whole Scenes readable, and right or wrong never shown by colour alone, so that I get the same Lesson as everyone else.
35. As the author, I want to write goals, Scenes and questions in the same Markdown file as the Lesson, so that adding a Lesson stays one file.
36. As the author, I want a typo in a block or a broken question to fail the build and name the file, the block and the id, so that I can't ship a broken Lesson.
37. As the author, or a drafting agent, I want `npm run test:content` to check every Lesson with no database or env file, so that a Lesson can be checked anywhere.
38. As the author, I want the course lint to hold every rewritten Lesson to the same size and quality rules, so that the course stays deep and consistent.
39. As the author, I want question ids to be permanent, and a fix to an answer key never to rewrite past results, so that crowd stats and passes stay honest.
40. As the author, I want to rewrite the old Lessons' text, so that the course teaches from zero instead of only recording what I did.

## Implementation Decisions

- **Two PRs, one contract.** The authoring contract is written up in full in `docs/authoring-lessons.md` (v1.4, what the parser follows; it started as v1.1). PR B's v1.5 adds the `photos` Scene (ticket 08, not built yet) and the `PENDING_REWRITE` guard (built). PR B is already writing Lessons against it. Any change goes to PR B by message first, and `src/lessons/course.test.ts` catches any drift between the two. File ownership:
  - PR A owns `src/**` (except `src/app/credits/unsplash.ts`), `globals.css`, `drizzle/**`, `GLOSSARY.md`, `docs/adr/**`, `docs/authoring-lessons.md`, the README sections "Writing a Lesson", API, "How it works" and setup, and `content/lessons/01-grilling.md` (only through the pilot cherry-pick).
  - PR B owns every other Lesson file, the renumbering, new photos, `.scratch/course-rewrite/**`, the README Lesson table and the lessons badge.
- **The Lessons module stays the one seam.** Everything that reads a Lesson goes through its public functions.
  - **Header keys:** `title`, `slug`, `order`, `part`, `image`, `imageAlt`, `imageCredit`. `part` is optional (1–4). The Part names live in one constant: 1 Foundations, 2 The main flow, 3 When things go wrong, 4 Level up. Any other key fails loudly, naming the file and the key. A slug or order used twice fails, naming both files.
  - PR A doesn't add `part:` to the old Lesson files, which keeps PR B free of conflicts. The course lint requires `part` only on rewritten Lessons.
  - `minutes` (reading time) is computed at about 220 words per minute, never written by hand.
- **The parser** (`src/lessons/markdown.ts`, `blocks.ts`, `scenes.ts`, behind `lessons.ts`):
  - It uses a private `new Marked()` instance (never the global `marked`) with one inline extension: `==key phrase==` becomes `<mark>`. The `==` must touch non-space characters on the inside, so `a == b` and `===` stay as plain text.
  - It lexes the body once and walks the top-level tokens:
    - A `## ` heading opens a Section. Its id is the slugified heading text, made unique within the Lesson (`-2`, `-3`).
    - A `# ` heading in the body is an error, because the title is the page's only h1.
    - A code fence whose first word is a block kind is parsed as that block.
    - A first word within edit distance 2 of a kind is an error ("did you mean `checkpoint`?"), unless it's on the known-language allowlist (ts, tsx, js, jsx, json, sh, bash, zsh, shell, text, txt, sql, diff, css, html, md, markdown, yaml, yml, env, ini, toml, mjs, cjs, py, python, console).
    - Everything else is prose.
  - Every error names the file, the block kind and the id when there is one, e.g. `grilling.md: checkpoint "who-owns-details": needs exactly one [x] option`.
  - The parser checks syntax only. It never checks that a photo exists under `public/`. The API routes run the same parser on Vercel, where `public/` isn't part of the function, so a runtime check would fail only in production. Photo paths are checked in the course lint instead.
- **Types.** Everything the module returns is plain and serialisable, so it stays safe under `"use cache"`.
  - `Lesson` is the summary (number, slug, title, photo fields, `part`, `minutes`) plus `intro: Block[]`, `sections: Section[]` and `previous`/`next`.
  - `Section` is `{ id, title, blocks }`.
  - `Block` is one of: prose, goals, scene, checkpoint, finalTest (all the Lesson's `test` fences together), callout, try, siteStory, sources.
  - `Scene` is a union of the five kinds (chat, terminal, flow, files, meter). Each has an optional title, its settings, and `steps: { captionHtml, items }[]`, where `items` are what that step adds.
  - `Question` is `{ id, promptHtml, options: { id: "a" | "b" | "c" | "d", html, feedbackHtml }[], answer }`.
  - A new `getQuestions(slug)` returns every question in a Lesson (Checkpoints and Final test), or `null` for an unknown slug. It's the only thing the quiz module asks the Lessons module for.
- **Question rules.** Ids are kebab-case (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, at most 40 characters), unique within the Lesson, and permanent (ADR 0005). Each question has 3–4 options, exactly one `[x]`, and feedback on every option. Option ids are positions, `a` to `d`. The Final test is one run of contiguous `test` fences. The pass mark lives in one constant, `PASS_PERCENT = 80`, in `src/quiz/limits.ts`.
- **The course lint** (`src/lessons/course.test.ts`) reads the real Lessons through the module's public functions. Every rule is listed in `docs/authoring-lessons.md`. In short:
  - **Every Lesson:** it parses; slugs and orders are unique; the filename prefix `NN` equals `order`; all 12 legacy slugs exist (ADR 0004); the header photo exists under `public/`; once every Lesson has a `part`, `part` never goes down as `order` goes up.
  - **Every rewritten Lesson** (any Lesson not in `PENDING_REWRITE`): 3–4 goals; at least one Scene; 3–5 Checkpoints; a Final test of the right size (start-here 5–6, main-flow 8–15, all others 8–10) and, except start-here, the right mix of question kinds by id prefix (at least 3 `scenario-`, 2 `spot-` and 1 `sequence-`); a Site story for the 12 legacy slugs; sources with at least 3 linked items; a `part`; 1,800–3,000 words of teaching (start-here 900–1,400); no "Lesson <number>" in the body; every `/learn/<slug>` link resolves; every backticked `/name` is a known Skill or Built-in command.
  - `PENDING_REWRITE` starts as all 12 current slugs. The pilot removes `grilling`, and PR B empties the set as it rewrites each Lesson.
- **Vitest is split into projects.** `content` (the Lessons module and the course lint, no setup file, no env) and `db` (everything else, with `setup-env.ts` and `fileParallelism: false`). The first release added `render` (page components rendered on the server, no env). `npm run test:content` runs `content` and `render`, and `npm test` runs all of them.
- **The Lesson page** (`src/app/learn/[slug]/page.tsx`) stays a cached Server Component that never reads cookies, so it stays static. A Visitor's data arrives only through client fetches, the same pattern as `discussion.tsx` (ADR 0006).
  - **Rendered on the server:** prose, goals, callout, try, site story, sources, and each Scene's markup with every step and item rendered up front. Checkpoints and the Final test are server markup too, with their answers inside a `<details>` that only shows without JavaScript.
  - **Client islands, none with dependencies:**
    - `scene-stepper.tsx`: steps every Scene on the page
    - `lesson-nav.tsx`: the section bar, active Section, tone, and the stage pin state on phones
    - `checkpoint.tsx`
    - `final-test.tsx`
    - `copy-button.tsx`
    - `progress-tick.tsx`, backed by `src/progress/visitor-progress.ts`: a `useSyncExternalStore` store with an empty server snapshot, so hydration is safe. It fetches `GET /api/progress` once and updates itself when the Visitor answers.
  - **Safe under Activity** (Next 16 keeps hidden pages mounted):
    - Every query and observer is scoped to a root ref and disconnected in cleanup.
    - Each Checkpoint is its own `<form>`, and radio names and ARIA ids come from `useId()`, so two mounted pages never share a radio group or an id.
    - The tone goes on the `.lesson` wrapper, never on `<html>`.
- **Layout, type and motion** are specified in full under **Scroll experience**.
- **Discussion moves.** It leaves the sticky right column and becomes a full-width band after the Final test, before Previous/Next. `discussion.tsx` is no longer sticky. It behaves exactly as before. Scenes need the right column, and comments mean more once you've finished. This reverses user story 26 of the main-flow spec.
- **Question data in Neon** (`src/db/schema.ts`, migration `drizzle/0001_create_quiz_answers.sql`):
  - `test_attempts`: `id uuid` primary key (made in TypeScript, so one batch can insert an Attempt and its Answers), `visitor_id uuid`, `lesson_slug text`, `score smallint`, `total smallint`, `created_at`.
  - `answers`: `id` identity, `visitor_id uuid`, `lesson_slug`, `question_id`, `option_id`, `correct boolean`, `attempt_id uuid null` (references `test_attempts`, cascade on delete; null means a Checkpoint), `created_at`. Append-only, never updated. Indexed for crowd stats (`lesson_slug, question_id, visitor_id, id`) and for one Visitor's progress (`visitor_id, lesson_slug, id`).
  - No `visitors` table and no foreign key to a Lesson or question (ADR 0004, ADR 0005).
- **Rules for the data:**
  - Crowd stats count each Visitor's first Answer to each question, picked when read with `selectDistinctOn` ordered by `id`. Checkpoint and Final test Answers both count.
  - A Lesson is passed when the Visitor's latest Attempt has `score * 100 >= total * PASS_PERCENT`. The rule runs in TypeScript and is never stored, so changing it never leaves stale data.
  - Checkpoint Answers never affect passing.
  - Below `MIN_CROWD = 5` Answers, the page shows "You're one of the first to answer" instead of percentages.
- **The quiz module:**
  - `src/quiz/quiz.ts` is a factory, `quizFrom(lessons)`, exposing `answerCheckpoint`, `submitTest` (one `db.batch` of the Attempt plus its Answers), `lessonProgress` and `courseProgress`. It re-grades every Answer from `getQuestions`. Its errors are exact strings, so tests can assert them.
  - `src/quiz/visitor.ts` reads the cookie from the request's `Cookie` header and builds the `Set-Cookie` value. It deliberately doesn't use `cookies()` from `next/headers`, so the route tests can call handlers without a Next request scope.
  - `src/quiz/limits.ts` holds `PASS_PERCENT = 80`, `MAX_REQUEST_CHARS = 4096` and `MIN_CROWD = 5`, and is safe to import in the browser.
  - The shared `Result` type moves to `src/result.ts`.
- **Endpoints** (ADR 0001: handlers only speak HTTP):

  | Method | Path | Body | Success |
  |---|---|---|---|
  | POST | `/api/answers` | `{ lesson, question, option }` | `201`: the graded Answer plus crowd stats |
  | GET | `/api/answers?lesson=<slug>` | none | `200`: this Visitor's Answers and latest Attempt for that Lesson |
  | POST | `/api/attempts` | `{ lesson, answers: { [questionId]: optionId } }` | `201`: score, total, passed, and per-question results |
  | GET | `/api/progress` | none | `200`: `{ passed, tried }`, lists of slugs |

  - All four send `Cache-Control: private, no-store`.
  - Errors are `400 { error }` (not JSON, not an object, unknown Lesson, question or option, a Final test question sent to `/api/answers`, a Final test with a question missing) or `413` for a body over 4,096 characters.
  - The `visitor` cookie is a UUID: HttpOnly, SameSite=Lax, `Path=/`, Secure in production, one year, renewed on every POST. Only a POST sets it. A malformed cookie is treated as missing and replaced. A GET without the cookie returns empty data, sets no cookie and doesn't touch the database (ADR 0006).
  - `next.config.ts` changes its tracing include to `"/api/**": ["./content/lessons/**/*"]`. Without it, production returns 500 while local dev works.
- **Privacy line.** One line under the first Checkpoint: "Your answers are saved under a random ID in a cookie, so you can see your progress and how others answered. No account, nothing else about you."
- **Home page** (`src/app/page.tsx`):
  - The Lesson grid is grouped by Part, with a heading per Part, once every Lesson has a `part`. Until then it stays one flat grid.
  - Each `FLOW_STEPS` step links to its Lesson only if that slug exists.
  - Each card has a reserved slot for its progress tick.
- **Docs.** ADR 0005 (permanent question ids), ADR 0006 (anonymous cookie, grade twice) and ADR 0007 (typed Markdown blocks, CSS scroll effects). `GLOSSARY.md` gains Part, Checkpoint, Final test, Answer, Attempt, Scene, Site story, User-invoked Skill, Model-invoked Skill and Smart zone; Phase takes Matt Pocock's meaning; Visitor and Lesson are updated. `docs/authoring-lessons.md` holds the contract and a full example. It must not live under `content/lessons`, because every `.md` there is parsed as a Lesson. The README covers "Writing a Lesson", the four new endpoints and `test:content`.
- **What this reverses** in `.scratch/main-flow-and-redesign/spec.md`:
  - **User story 26** ("the Discussion panel restyled to match, with the same behaviour as today") and its layout lines 100 and 102: Discussion becomes a full-width band after the Final test. Its behaviour doesn't change; its place does.
  - **User story 34** ("the old Lessons' text left untouched") and **line 74** ("Old Lessons. Only their headers change… Their text is not edited."): the old Lessons get rewritten. PR A changes only `01-grilling.md` (the pilot); PR B rewrites the rest.
  - **Line 130** (out of scope: "Rewriting the text of Lessons 0–10"): it's now in scope, in PR B.
  - It also replaces **line 85** ("Headings become large and lighter-weight"): headings become bold. See **Bold type**.

## Scroll experience

This section is the whole reading experience in one place: what a Visitor sees as they scroll a Lesson, how each effect is built, and what happens when a browser can't do it. It stands on its own.

Everything here is progressive enhancement. The page is complete and readable before any of it runs.

### Principles

1. **The base style is the final state.** Each element's plain CSS is how it looks once its effect has finished. An effect only ever starts from an earlier state and arrives at the base. Nothing is hidden unless code is running and has chosen to hide it.
2. **The reader drives.** Motion is tied to scroll position or to an action (Check, Submit). Nothing autoplays and nothing loops.
3. **Motion explains.** A Scene steps because the caption beside it says what just changed. Decorative motion (rising headings, the mark sweep, parallax) stays small and short.
4. **It costs almost nothing.** No scroll listeners. Continuous effects run on the compositor. Under 8 KB of added client JavaScript.

### Layout

**At 1080px and wider:**

- The Lesson page is up to about 1440px wide (up from 1240px), with today's gutters. The photo band and title stay as they are.
- The intro (everything before the first `## `: the goals card and the opening prose) is one column at text width.
- **Each Section is a two-column grid:** text at `minmax(0, 44rem)` and a stage at `1fr`, with `--space-2xl` between them.
- **The stage pins within its own Section.** It's `position: sticky`, its top sits just under the section bar, and its height fills the viewport below the bar, less a margin top and bottom. Its containing block is its own Section, so it pins while you read that Section and the next Section pushes it away.
- **What the stage shows:**
  - The Section's Scene, if it has one (at most one per Section).
  - Otherwise, the Section's number as a huge outline numeral ("02"), decorative and `aria-hidden`, drifting slowly (parallax).
- **Scene captions** (each step's `# ` line) are cards in the text column, at the place the Scene was written. Each caption card has enough space around it that roughly one caption crosses the middle of the screen at a time.
- The Final test and the Discussion are full-width bands with their content at text width. They have no stage.

**Below 1080px:**

- One column at text width.
- **A Scene is one wrapper holding its stage and then its captions.** The stage is sticky at the top, under the header, at `min(34svh, 18rem)` tall. The captions scroll up past it. When the last caption leaves, the wrapper ends and the stage scrolls away with it. So a stage pins only across its own captions, never across the whole Section.
- Sections without a Scene have no stage and no numeral.
- **At least 55% of the viewport stays for text while a stage is pinned.** On a 390×844 phone: header about 64px plus stage at most 288px leaves about 490px, roughly 58%. The section bar tucks away while a stage is pinned (see **The section bar**).

**Everywhere:**

- Section and stage wrappers use `overflow: clip`, never `overflow: hidden`. `hidden` makes the wrapper the scroll container, which breaks `position: sticky` and freezes `view()` timelines (the gotcha recorded in ticket 05 of the main-flow work).
- There is no sideways scrolling at 390px.

### Bold type

- **Headings:** h1–h3 use Inter Tight at weight 750–800 (h1 and h2 at 800, h3 at 750), with `letter-spacing: -0.035em` and tight line-height. The display sizes (`--display-1/2/3`) stay.
- **`strong`** is 700.
- **It's site-wide:** the home page, the credits page, card titles and the Discussion headings (all weight 300 today) go bold too.
- **Font weight never animates.** A weight change alters text width, which shifts layout. Headings move with `transform` and `clip-path` only.

### Effects and how each is built

| Effect | What the Visitor sees | Technique | Without support |
|---|---|---|---|
| Reading progress line | A 3px blue line along the bottom of the section bar grows from left to right as you read. | `animation-timeline: scroll(root)`; `transform: scaleX(0 → 1)`, `transform-origin: left`. | Hidden: a full line would be a lie. |
| Section headings rise | Each `## ` heading rises about half a line and un-clips from the bottom up as it comes into view. It's settled by the time it's 70% of the way in. | `view()` timeline, `animation-range: entry 0% entry 70%`; `translateY` plus `clip-path: inset()`. Headings don't also get the Reveal fade. | Where `view()` isn't supported, headings use the existing Reveal fade instead. |
| `==mark==` sweep | The highlight paints across the phrase from left to right as it reaches the middle of the screen. | `view()` timeline, `animation-range: entry 100% cover 50%`; `background-size: 0% → 100%` on the `<mark>`. | Fully highlighted. |
| Section numeral parallax | The outline numeral in an empty stage drifts more slowly than the text. | `view()` on the Section, `translateY(12%) → translateY(-12%)` over `cover`. | Still. |
| Hero parallax | The photo band drifts, as today. | The existing `--band` timeline, plus `animation-duration: 1ms` after the shorthand so Firefox 159+ runs it. | Still. |
| Section tone | The page background and text colour shift as a new Section reaches the reader's eye line, and turn navy for the Final test. | `lesson-nav` IntersectionObserver sets `data-tone` on `.lesson`; CSS transitions `background-color` and `color` over 500ms. | No `data-tone`: the page stays white, and the Final test band is navy on its own. |
| Active Section | The bar's dot and title follow you. | The same observer (`rootMargin: -45% 0px -50% 0px`) sets `aria-current="location"`. | No marker; the dots are plain links. |
| Scene steps | The stage adds what each caption describes as that caption crosses the trigger line, and takes it away again when you scroll back. | `scene-stepper` (below). | Final state: every item shows. |
| Blocks entering | Paragraphs, lists, cards and callouts fade and rise once as they arrive. | The existing Reveal island, unchanged. | Visible. |
| Checkpoint answered | The card's border and background turn green or red, a tick or cross draws itself, and the card pops. | A state attribute; colours transition 200ms; the SVG mark draws with `stroke-dashoffset` over 400ms; `scale(1 → 1.02 → 1)` over 250ms. | The `<details>` answer. |
| Crowd bars | Under each option, a bar grows to the share of Visitors who picked it, one after another. | `transform: scaleX(var(--pct))` over 500ms, staggered 80ms. | None. |
| Final test result | A score ring draws round to your score, a "Passed" badge stamps in, the goals at the top tick off, and the Next card switches to its "unlocked" style. | Ring: `stroke-dasharray` over 900ms. Badge: `scale(1.4 → 1)` and `rotate(-12deg → -4deg)` over 300ms. Goal ticks: `stroke-dashoffset`, 80ms apart. | "The Final test needs JavaScript" note. |
| Progress ticks | A tick appears on each passed Lesson's card and on Previous/Next. | Fades in over 200ms into a slot that's always reserved. | No tick. |

**How a Scene steps (`scene-stepper`):**

- **One IntersectionObserver for every caption on the page.** The trigger is a line 55% down the viewport.
- **The current step is the last caption whose top is above the line.** Scroll down past a caption and the Scene steps forward. Scroll back up past it and the Scene steps back.
- **Before the first caption reaches the line, the Scene is at step 0.** That's its empty frame: the chat window with no bubbles, the terminal with just a prompt, the flow with every node as an outline, the file tree with no rows, the meter at zero.
- **On the page:**
  - The stepper sets `data-step` on the Scene root.
  - Every item carries the step it belongs to, and items at or before the current step get `data-on`.
  - Items from the current step also get `data-new`, which gives them a highlight until the next step arrives.
- **Items move with `transform` and `opacity` only, over 300ms.** Several items added at the same step enter 60ms apart. Stepping back plays the same transition in reverse.
- **CSS hides future items only inside `[data-step]`.** So with no JavaScript, every item shows: the final state.
- **After a reload mid-page, or when Next shows a hidden page again,** the observer's first callback reports where every caption is, so the step is right without any scrolling.

### Block by block

- **Goals.** A card before the first Section, headed "By the end of this Lesson" (each goal reads "You'll be able to …"). It lists 3–4 items, each with an empty tick circle. Items enter with the Reveal stagger. When the Visitor passes the Final test (now, or on an earlier visit), each circle draws a tick, 80ms apart, and the heading gains "Done".
- **Prose and headings.** Body text at reading width. `## ` headings are bold and rise as described above. Each Section's heading has a small numeral ("02") beside it. `strong` is 700.
- **Scene.** A `<figure>` in the stage with its `title` as the `<figcaption>`, plus caption cards in the text column (see **The five Scene kinds**).
- **Checkpoint.** A card in the text column, headed "Checkpoint", with the prompt as the `<legend>` and the options as large radio cards. The states are:
  - **Idle:** nothing selected.
  - **Selected:** the option's card is outlined in blue, and Check becomes the primary button.
  - **Checked:** the card turns green (`--good`) or red (`--error`), a tick or cross draws in, and the card pops. The status line reads "Correct." or "Not quite." followed by the picked option's feedback. The right option is marked "Answer". A "See why each option is right or wrong" disclosure shows every option's feedback.
  - **Stats:** when the background save returns, crowd bars grow under each option, with the percentage and "You" on the Visitor's pick. Below 5 Answers, the bars stay hidden and the line reads "You're one of the first to answer."
  - **Try again:** this resets the card to idle. Every Answer is stored, but the crowd bars count only each Visitor's first Answer.
  - **Couldn't save** (offline, or Neon down): the feedback still shows, because grading happened in the browser. One line under it reads "Couldn't save your answer." and there are no crowd bars.
  - **Revisit:** the Visitor's latest Answer is restored as checked.
  - **Section bar:** the Checkpoint's tick there fills once it's answered.
  - The privacy line sits under the first Checkpoint.
- **Final test.** A full-width band, navy, headed "Final test", showing "Pass with 80%" and a counter ("3 of 10 answered") that updates as the Visitor goes.
  - **The questions:** one `<form>` with a `<fieldset>` per question, styled as light cards on the navy band. Nothing is graded until "Check my answers".
  - **Unanswered questions:** pressing the button with questions left says "Answer every question first (7 of 10 answered)" and moves focus to the first unanswered one.
  - **Grading:** each card turns green or red with its feedback, and the score ring draws round to the score ("8 / 10"). Focus moves to the score heading.
  - **A pass** (80% or more): the "Passed" badge stamps in, the goals tick off, and the Next card in Previous/Next gets its "unlocked" style. Lessons are never actually locked: the style is a reward, not a gate.
  - **A fail:** the ring and line read "Not yet: 6 / 10. You need 8." A "Try again" button clears the answers and scrolls to the first question.
  - **Saving:** each submission is POSTed as one Attempt.
  - **Revisit:** the band opens with the latest result ("You passed with 9 / 10") and a "Take it again" button.
- **Callout.** Each callout is a word plus an icon, never colour alone, and enters with Reveal.
  - `tip`: a blue left rule, labelled "Tip".
  - `watch-out`: an amber background behind ink text, labelled "Watch out".
  - `big-idea`: a navy card with display-size `--on-dark` text, labelled "Big idea".
- **Try.** A "Your turn" box with a dashed blue border. Each code block in it gets a Copy button, which shows "Copied" for 2 seconds and announces it through `role="status"`. The button is added only after hydration, so without JavaScript the code is there to select by hand.
- **Site story.** A `--bg-soft` card with an amber left rule and the label "How I used it building this site". It may hold code blocks (four-backtick fence). It enters with Reveal. It always comes after the teaching it illustrates.
- **Sources.** A compact list in small type under a "Sources" label, each item a link. No motion.
- **`==mark==`.** A soft amber highlight behind ink text, swept in as described above.

### The five Scene kinds

**What every kind shares:**

- **The stage is a `<figure>`** with a fixed-height frame and the Scene's `title` as its `<figcaption>`.
- **Every item is in the HTML from the start, in step order.**
- **Captions** are inline Markdown, so **bold** works in them.
- **Future items are hidden with `opacity: 0`, never `visibility` or `display`.** A screen reader reads the whole Scene, and nothing reflows.

**chat**

- **The frame** is a chat window.
- **Bubbles:** `you:` bubbles sit on the right, in blue with white text; `agent:` bubbles sit on the left, on `--bg-soft`. Their text is inline Markdown.
- **Entering:** each bubble slides in 0.75rem from its own side as it fades up. The newest bubble has a 2px blue ring.
- **Overflow:** when the bubbles outgrow the frame, the column shifts up (`translateY(var(--shift))`, measured once per step) so the newest bubble stays in view. Older bubbles fade out under a mask at the top edge.

**terminal**

- **The frame** is a navy panel in the monospace font.
- **Commands:** a `$ command` line shows a `$` prompt and types itself out. The technique is `clip-path: inset(0 100% 0 0) → inset(0)` with `steps(n)`, where `n` is its length in characters, at about 30ms per character and never more than 1.2s.
- **The cursor** is a static block cursor at the end of the newest command. It doesn't blink.
- **Output:** the step's output lines fade in together once the typing finishes. Output is plain text exactly as written, so what you see is what you'd type and get.
- **Overflow:** long sessions shift up like chat.

**flow**

- **The frame** is a vertical SVG map built from the `node:` settings.
- **Nodes:** main nodes stack top to bottom in the order they're declared, joined by edges. A `side` node sits to the right of the main node declared just before it, joined by a dashed branch. That's how forks are drawn, e.g. "Small job? Skip the spec".
- **Before any `at:`,** every node is an outline.
- **When an `at:` reaches a node,** it fills blue with white text and grows slightly (`scale(1.04)`). It's the current node: the last `at:` reached so far.
- **Nodes reached earlier** keep a light fill and gain a tick.
- **Edges** draw in (`stroke-dashoffset` over 500ms) once both their ends have been reached.

**files**

- **The frame** is a file tree panel.
- **Rows:**
  - A `+ path` line adds a row with a green "added" badge and a green left rule.
  - A `~ path` line marks its row "changed" in amber (amber background behind ink text).
  - A `~` line for a path that's already in the tree re-badges that row with a short pulse, instead of adding a second row.
- **Paths:** the folder part is shown muted ("src/lessons/") and the file name in bold.
- **Entering:** rows fade in and slide 0.5rem.

**meter**

- **The frame** is a horizontal gauge, titled by the Scene (e.g. "Context window").
- **The fill:** a blue bar that grows with `transform: scaleX(fill / 100)` over 600ms. The label under the gauge shows the current step's text ("62% · after the grilling").
- **History:** earlier fills leave a faint notch on the track, so you can see how it grew.
- **The zone:** a `zone:` setting draws a marker line, with the part before it labelled "Smart zone". Once the fill passes the zone, the Scene gets `data-zone="dumb"`: the fill turns amber and a "Dumb zone" tag appears (a word, not just a colour). Stepping back below the zone removes both.

### The section bar

- **Where:** a slim bar (about 2.75rem tall) that sticks directly under the header on Lesson pages. It's a `<nav aria-label="Sections">`.
- **Left:** the label, "Part 2 · Grilling" (the Part shows only when the Lesson's header has a `part`), then the current Section's title, which crossfades when it changes.
- **Right:**
  - One dot per Section, each a link to `#<section-id>` named after its Section. Dots before the current one are filled. The current one is larger and has `aria-current="location"`.
  - Then one small tick slot per Checkpoint, which fills once that Checkpoint is answered.
- **Bottom edge:** the 3px reading progress line.
- **Jumping:** the bar's height is added to `scroll-padding-top`, so jumping to a Section never hides its heading under the bar.
- **On phones (below 720px):**
  - The dots collapse to "3 / 7".
  - While a Scene's stage is pinned, the bar slides up out of view, all but its progress line, and it slides back when the stage releases. `lesson-nav` learns the pin state from the stepper's observer, not from a scroll listener.
- **Without JavaScript:** the bar shows the label and the dots as plain links, with no current marker and no progress line.

### Tones

- **Where they live:** the `.lesson` wrapper carries `data-tone`, never `<html>`. The page's background and text colour follow it over 500ms.
- **The three tones:**
  - `paper` (`--bg` and `--text`): the intro and odd-numbered Sections.
  - `soft` (`--bg-soft` and `--text`): even-numbered Sections.
  - `navy` (`--navy` and `--on-dark`): while the Final test is in view.
  - The Discussion band and Previous/Next go back to `paper`.
- **When it changes:** when a Section, or the Final test, covers the band 45–50% down the viewport. So the background shifts as the new heading reaches the reader's eye line, not as it enters at the bottom edge.
- **Tones are derived, not written.** There's no header key or block for them.
- **Contrast never depends on the tone.** Cards (callouts, Checkpoints, Final test questions, the Site story, Scenes) keep their own surfaces. On `navy`, prose switches to `--on-dark`, and links switch to a light blue that keeps at least 4.5:1.
- **Without JavaScript,** there's no `data-tone`, so the page stays `paper`. The Final test band is navy in its base style, so it still reads as a distinct room.

### Fallbacks

| Situation | What happens |
|---|---|
| **Reduce motion** | Nothing moves: no heading rise, mark sweep, parallax, progress line, sliding bubbles, typing, drawing, pops, stamps or growing bars. Scenes still step, but each step swaps instantly, because changing state isn't motion. Tones change instantly. Reveal is off, as today. Every scroll-timeline rule lives inside `@media (prefers-reduced-motion: no-preference)`, and the existing global kill switch stays. |
| **No scroll-driven animations** (Firefox before 159, older Safari) | Every `view()`/`scroll()` rule lives inside `@supports (animation-timeline: view())`, so those effects simply rest at their final state, and the progress line is hidden. Everything built on IntersectionObserver still works: Scenes, tones, the section bar, and Reveal (which takes over the heading entrance). |
| **No JavaScript** | Fully readable. Scenes show their final state with every item, and their captions read as an ordered list. Checkpoints show their options as a list plus a "Show the answer" `<details>` with the right option and every option's feedback. The Final test shows its questions and the note "The Final test needs JavaScript to check your answers." The section bar is plain links. There are no tones (the Final test band is still navy), no crowd bars and no ticks. |
| **Page hidden and shown again** (Next keeps visited pages mounted) | Effects clean up when the page is hidden and re-run when it's shown. Observers work out the step, Section and tone from where things are on screen, and the progress store re-reads, so a home card shows its new tick right after a pass. |
| **Reload mid-page** | The first observer callback sets the right step, Section and tone. |
| **Saving fails** | Feedback still shows (graded in the browser), followed by "Couldn't save your answer." and no crowd bars. A failed Final test save says so but keeps the score on screen. |

### Performance budget

- **No `scroll`, `resize` or `wheel` listeners.** IntersectionObservers: Reveal (existing), one for `lesson-nav`, and one shared by every Scene on the page.
- **Continuous scroll-linked effects animate only `transform` and `opacity`,** which run on the compositor. There are two small, named exceptions: the heading `clip-path` and the `==mark==` `background-size` sweep (paint on small inline boxes only).
- **Nothing animates layout properties** (`width`, `height`, `top`, `margin`, `font-weight`). One-off state changes (tones, card states) may transition colours.
- **Layout reads happen once per step, never per frame.** The only one is the chat and terminal shift.
- **CLS is 0:**
  - Stages have fixed heights.
  - Every Scene item is in the HTML from the start, hidden with opacity.
  - The crowd-bar area, the status line and every tick slot are reserved before they fill.
  - The section bar is in the server HTML at its fixed height.
- **Under 8 KB of added client JavaScript, gzipped,** across all new islands, measured from the `next build` output against `main`.
- **No new dependencies.** No animation library, no Tailwind (ADR 0007).

### Accessibility

- **Questions:**
  - Each question is a `<fieldset>` with a `<legend>` and native radio buttons, styled as cards.
  - A focused option's card shows the focus ring (`label:has(:focus-visible)`), and arrow keys move between options natively.
  - Grading happens only on the Check button, never on `change`. Arrow keys change the selection, so grading on change would grade by accident.
  - Feedback goes to a `role="status"` region: "Correct." or "Not quite.", then the feedback, then the crowd line.
  - Right and wrong are never shown by colour alone: there's always an icon and a word.
  - After the Final test is checked, focus moves to the score heading (`tabIndex={-1}`), which reads, e.g., "8 out of 10. Passed."
  - While a save is pending, the options are locked with `aria-disabled`. Nothing is ever removed or `disabled` in a way that drops focus.
  - Radio names and ARIA ids come from `useId()`.
- **Scenes:**
  - Future items use `opacity: 0`, not `visibility: hidden`, so a screen reader reads the whole Scene.
  - The stage is a `<figure>` with a `<figcaption>`, and the captions are an ordered list.
- **Section bar:** a `nav` landmark. Its dots are links named after their Sections, and the current one has `aria-current="location"`.
- **Ticks:** each carries visually hidden text ("Passed", "Answered").
- **Contrast:**
  - A new token, `--good: #0f7a3d`, is at least 4.5:1 on white. `--error` already passes.
  - Amber is only ever a background behind ink text, never text on white.
  - Each tone is checked against its own text colour.
- **Focus:** every link, button and field shows a visible focus outline, and nothing traps the keyboard.
- **Reduce motion** is honoured as described under **Fallbacks**.

### Browser support

Checked on 2026-10-23 on caniuse and MDN:

- Scroll-driven animations work in Chrome and Edge 115+ and Safari / iOS Safari 26+, about 88% of users.
- Firefox ships them in 159, and stable Firefox doesn't have them yet.
- IntersectionObserver, `:has()`, `clip-path` and `svh` units work in every browser we target.
- **Gotcha:** Firefox needs a non-zero duration on a scroll-timeline animation. Write the `animation` shorthand, then `animation-duration: 1ms`, then `animation-timeline`, in that order.

## Testing Decisions

- **Seams.**
  - The Lessons module, read through its public functions (list Lessons, get a Lesson, get its questions, does a Slug exist), with small fixture folders. This is the existing seam.
  - The course lint reads the real Lessons through the same functions.
  - The quiz module is tested through `quizFrom(lessons)` pointed at a fixture Lesson.
  - The route handlers are tested by calling `GET`/`POST` with a plain `Request`, as the comments routes are today.
- **Good tests** check what a module returns and its exact error strings, not how it parses or which SQL it runs.
- **New Lessons module tests** (`content` project, no database):
  - One broken fixture per error, each asserting that the message names the file, the block kind and the id:
    - no `[x]`, or two `[x]`
    - missing feedback
    - too few or too many options
    - an empty prompt
    - a bad or duplicate question id
    - non-contiguous `test` fences
    - an unknown header key
    - a duplicate slug or order
    - goals after the first `##`
    - two Scenes in one Section
    - a Scene with an unknown setting, an item before its first step, no steps, or an item that doesn't fit its kind
    - a flow `at:` naming an undeclared node
    - a near-miss kind
  - A fixture proves the language allowlist (`ts`, `text` and friends stay code).
  - `==mark==` works, and `a == b` and `===` stay literal. Four-backtick nesting works inside `try` and `site-story`.
  - `getQuestions` returns options `a`–`d`, the answer and per-option feedback, and `null` for an unknown slug.
  - All 12 current Lessons still parse and render.
- **The course lint** (`src/lessons/course.test.ts`) is itself the test for content. It runs against the real `content/lessons/`.
- **New quiz module tests** (`src/quiz/quiz.test.ts`, `db` project, real Neon `test` branch, ADR 0003). The fixture Lesson has 2 Checkpoints and a 5-question Final test, so 4/5 is exactly 80%. The cases:
  - Crowd stats count first Answers only, and every Answer is stored.
  - The pass rule: 5/5 and 4/5 pass, 3/5 fails.
  - The latest Attempt wins (pass then fail is not passed, fail then pass is).
  - Final test Answers feed the crowd stats.
  - Visitors are isolated.
  - A Final test question sent as a Checkpoint is rejected.
  - Every error string is exact.
  - `courseProgress(null)` is empty and runs no query.
- **New route tests** (`src/app/api/{answers,attempts,progress}/route.test.ts`). Question ids are read at test time through `getQuestions`, so rewriting a Lesson never breaks them. The cases:
  - A POST without a cookie returns 201 with every cookie attribute.
  - A valid cookie is reused, and a garbage cookie gets a new id.
  - A body that isn't JSON returns 400, and one over 4,096 characters returns 413.
  - An unknown Lesson returns 400.
  - A GET without a cookie returns empty data and no `Set-Cookie`.
  - Every response sends `Cache-Control: private, no-store`.
  - A passing Attempt shows up in `GET /api/progress` with the same cookie.
- **Prior art:** the "broken Lesson files" tests in `src/lessons/lessons.test.ts` and the comments route tests in `src/app/api/comments/route.test.ts`.
- **Only PR A runs the `db` tests.** The Neon `test` branch is shared, and only PR A adds migration `0001`. PR B runs `npm run test:content` only.
- **The look and the scroll experience are checked by hand, not by tests:**
  - Screenshots of `grilling`, one old Lesson and the home page at 390px and 1440px, each mid-scroll at 3 points, with reduce motion off and on, and with the `@supports` block switched off (the Firefox path).
  - A keyboard-only pass through the Checkpoints and the Final test, listening for the `role="status"` announcements.
  - CLS read from the console, and no sideways scroll at 390px.
  - Merging PR B's branch locally (unpushed) to see the terminal, files and meter Scenes in real Lessons.
- **Existing tests keep passing**, including the Comments tests.

## Out of Scope

- Accounts, signing in, or syncing progress across devices or browsers.
- A "reset my progress" or delete-my-data endpoint.
- Rate limiting (a Vercel Firewall rule can be added later), leaderboards, or an admin page for stats.
- Timed Final tests, multi-select questions, free-text answers, or per-option "why people got this wrong" stats.
- Hiding the answer key from the page source (ADR 0006).
- Moving questions or Lessons into the database.
- MDX, Tailwind, or any animation or styling library (ADR 0007).
- A `photos` Scene kind (it would need new photo downloads).
- Part-coloured tones, and the Part headings on the home page (they ship once PR B gives every Lesson a `part`).
- Writing the other 19 Lessons, renumbering, new photos, and the README Lesson table: all PR B.
- Dark mode, search and a custom domain, as before.

## Further Notes

- **The pilot handoff.** PR B commits the `grilling` rewrite as one standalone commit: `01-grilling.md`, `order: 1`, `part: 2`, linking only to slugs that already exist. It sends PR A the SHA, and PR A cherry-picks it (ticket 06). Any mismatch with the contract goes back to PR B by message. PR A doesn't edit PR B's prose.
- **Merge order.** PR A first. Then PR B syncs with main, runs `npm run test:content`, and goes ready.
- **Env files.** This worktree needs `.env.local` and `.env.test.local` copied from the main checkout (`/Users/siddharth/Developer/trying`). Never print them.
- **The shared Neon `test` branch.** Never run `npm test` from two worktrees at once.
- **The migration** runs on the PR preview's own branch first (ADR 0002). The preview check is a real `POST /api/answers` that returns 201 with the cookie, plus progress that survives a reload.
- **Afterwards.** Suggest the user runs `/retro` once PR A merges. It's user-invoked, and its output is Site story material for the `retro` Lesson in PR B.
