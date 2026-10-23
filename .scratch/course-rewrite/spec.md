# Spec: The from-zero course (20 Lessons, PR B)

Status: ready-for-agent

Read first: `GLOSSARY.md` (use its terms exactly: Lesson, Skill, Main flow, Built-in command, Visitor, Slug) and `docs/adr/0004` (Slugs never change). This spec covers the content half of the course rebuild. The engine half (the parser for typed blocks, scroll scenes, checkpoint quizzes and the final Test stored in Neon) is PR A, on branch `claude/lesson-content-scrolling-ux-2a9171`. Where this spec and `contract-v1.md` differ, the contract (latest version) wins on sizes, kinds and word counts. This spec deliberately reverses user story 34 and the "Lessons 0–10 text untouched" lines in `.scratch/main-flow-and-redesign/spec.md`.

## Problem Statement

The course is 12 short build-journal entries (250–550 words each). They say what I typed and what happened, but they assume you already know what a coding agent is, what a Skill is and why you'd reach for one. Someone who has never coded with an agent can't learn from them: there are no goals, no explanation of the idea behind each Skill, no exercise to try, and no way to check what they understood. They also follow the order I happened to build in, not Matt Pocock's current Main flow, and they miss Skills I didn't use (`/implement`, `/triage`, `/retro`, `/wayfinder` and more).

## Solution

Rebuild the course as **20 Lessons in 4 Parts**, from zero, each teaching one Skill (or one foundation idea) properly, with this site as the worked example.

- **Part 1, Foundations:** 0 `start-here`; 1 `how-agents-work`*; 2 `context-window`*; 3 `skills`*
- **Part 2, The main flow:** 4 `grilling`; 5 `domain-modeling`; 6 `prototype`; 7 `spec-and-issues`; 8 `tdd`; 9 `implement`*; 10 `code-review`; 11 `pr-and-ship`; 12 `main-flow`
- **Part 3, When things go wrong:** 13 `diagnosing-bugs`; 14 `triage`*; 15 `wizard`
- **Part 4, Level up:** 16 `architecture`*; 17 `retro`*; 18 `wayfinder`*; 19 `models-effort-ultracode`

(* = new Slug. Existing Slugs never change; their order, title and filename prefix do.)

Every Lesson follows one shape, written in PR A's typed-block format:

1. A one-line promise.
2. "By the end you'll be able to…", 3–4 checkable goals.
3. Why it matters: the failure the Skill fixes.
4. The idea, in plain words.
5. A step-by-step walkthrough of a real session, as scroll scenes.
6. How Matt and others use it day to day, cited.
7. Try it yourself: the exact prompt to type and an "it's working if" checklist.
8. Common mistakes.
9. "How I used it building this site": my real journal material.
10. A recap or cheat sheet.
11. 3–5 Checkpoints placed right after the sections they check.
12. A Final test of 8–10 questions (5–6 for Start here, up to 15 for The main flow), mixed kinds: at least 3 scenario, 2 spot-the-mistake and 1 sequence (80% to pass, retries allowed).
13. Sources, with dates.

## User Stories

1. As a Visitor who has never used a coding agent, I want the first Lessons to explain what an agent is, how it loops through tools and what permissions mean, so that the rest of the course makes sense.
2. As a beginner Visitor, I want to understand the context window and the smart zone before I meet any Skill, so that advice like "don't `/clear` until after `/to-tickets`" makes sense.
3. As a beginner Visitor, I want a Lesson on what a Skill is and how to install Matt's Skills, so that I can follow along in my own terminal.
4. As a Visitor, I want every Lesson to open with a one-line promise and 3–4 goals, so that I know what I'll be able to do by the end.
5. As a Visitor, I want each Lesson to start from the problem the Skill fixes, so that I know when I'd reach for it.
6. As a Visitor, I want the idea explained in plain words before any commands, so that I'm not copying prompts I don't understand.
7. As a Visitor, I want a step-by-step walkthrough of a real session, so that I can picture what using the Skill looks like.
8. As a Visitor, I want to see how Matt and other developers use each Skill day to day, with sources, so that I learn real habits and not just the docs.
9. As a Visitor, I want an exact prompt to type and an "it's working if" checklist, so that I can try the Skill myself and know whether it worked.
10. As a Visitor, I want the common mistakes listed, so that I can avoid them.
11. As a Visitor, I want a short box showing how the author used the Skill to build this site, mistakes included, so that every Lesson has an honest real example. (Required for the 12 original Slugs; the 8 new ones carry one only where real material exists.)
12. As a Visitor, I want Checkpoints as I read, so that I find out straight away whether a section landed.
13. As a Visitor, I want a Final test of scenario questions ("which Skill would you reach for…"), so that I check understanding, not memory.
14. As a Visitor, I want every quiz question to have one clear right answer and an explanation, so that a wrong answer teaches me something.
15. As a Visitor, I want a recap or cheat sheet at the end of each Lesson, so that I can come back later and skim it.
16. As a Visitor, I want sources with dates at the end of each Lesson, so that I can check the claims and know how fresh they are.
17. As a Visitor, I want the Lessons in Main flow order, grouped into 4 Parts, so that the course follows how work actually travels.
18. As a Visitor, I want a capstone Lesson that maps the whole Main flow with its forks, so that I know which command to type when.
19. As a Visitor, I want separate Lessons for when things go wrong (bugs, a messy backlog, steps only a human can do), so that I know the on-ramps.
20. As a Visitor, I want Level-up Lessons on architecture, retros and huge foggy projects, so that I have somewhere to go after the basics.
21. As a Visitor, I want `/implement` and `/implement-spec` taught side by side, with when to stay in the loop and when to let it run, so that I pick the right one.
22. As a Visitor, I want user-invoked and model-invoked Skills explained, so that I know which ones only I can start.
23. As a Visitor, I want Built-in commands kept separate from Skills, so that the vocabulary isn't confusing.
24. As a Visitor, I want each Lesson to cross-link the Lessons it builds on, so that I can go back when something is unfamiliar.
25. As a Visitor, I want facts pinned to Skills v1.3.1, with a short note where GitHub main has moved on, so that I'm not taught something stale.
26. As a Visitor, I want a tip about `/teach` in Start here, so that I know I can learn any topic with an agent.
27. As a returning Visitor, I want the old Lesson URLs (Slugs) to keep working, so that links and Comments still point at the right Lesson.
28. As a Visitor, I want every Lesson to keep its own topic-matched photo, so that the course still looks like the rest of the site.
29. As a photographer whose work is used, I want my name and links credited, so that the Unsplash credit convention is respected.
30. As the author, I want the research behind each Lesson kept as cited notes in `.scratch/course-rewrite/research/`, so that I can check or update a Lesson later.
31. As the author, I want each Lesson to take 1,800–3,000 words of reading, so that it's deep enough to learn from without being a book.
32. As the author, I want quotes kept short and everything else in my own words, so that the course respects Matt's and others' copyright.

## Implementation Decisions

- **Files.** One Markdown file per Lesson: `content/lessons/NN-<slug>.md`, with `order: NN` matching the prefix. Existing files are moved with `git mv` so their history follows. The header has exactly `title`, `slug`, `order`, `part` (1–4), `image`, `imageAlt` and `imageCredit`; any other key is a build error.
- **Block syntax.** PR A's authoring contract v1 (frozen, sent by the engine session on 2026-10-23): fenced blocks `goals`, `scene <chat|terminal|flow|files|meter>`, `checkpoint <id>`, `test <id>`, `callout <tip|watch-out|big-idea>`, `try`, `site-story` and `sources`, plus inline `==highlight==`. Question ids are permanent once published, and options are identified by position. This PR invents no syntax of its own.
- **Research first.** Each Lesson has a research note at `.scratch/course-rewrite/research/<slug>.md`: a source map (URL, timestamp, read-on date), key facts pinned to Skills v1.3.1, newer-on-main flags, day-to-day usage, common mistakes, an exercise idea and candidate quiz questions. Source trust order: the local v1.3.1 SKILL.md files, GitHub main, aihero.dev docs pages, Matt's videos (transcripts), community write-ups, and Claude Code's own docs for Part 1.
- **Copyright.** Raw transcripts stay in the session scratchpad and are never committed. Research notes paraphrase and cite. Lessons are in my own words, with quotes under 15 words and at most one per source.
- **Site story box.** It holds my real journal material (prompts and what happened) from today's Lesson files. New Slugs get one only where the repo holds real material (for example, PR #9's `/implement-spec` run for `implement`). Nothing is invented.
- **Checkpoints and the Final test.** 3–5 Checkpoints sit right after the sections they check. The Final test has 8–10 questions (Start here 5–6, The main flow up to 15): at least 3 scenario, 2 spot-the-mistake and 1 sequence, each with one unambiguous right answer, plausible distractors and an explanation. The pass mark (80%) and retries belong to PR A.
- **Photos.** The 8 new Slugs get topic-matched Unsplash photos at 2400px in `public/photos/<slug>.jpg`, credited in `src/app/credits/unsplash.ts`.
- **README.** The Lesson table lists all 20 Lessons by Part. The README's "Writing a Lesson" section belongs to PR A.
- **Ownership.** This PR touches only `content/lessons/**`, `.scratch/course-rewrite/**`, the new photos and their credits, and the README's Lesson table. Glossary, ADR or home-page changes (Parts grouping, `FLOW_STEPS`) go to the engine session.

## Testing Decisions

- **Verification lenses**, one agent each, per Lesson:
  - accuracy against primary sources (SKILL.md first);
  - a reader who has never used a coding agent: is every term explained, and could they do the exercise?
  - quiz quality: one right answer, no ambiguity, tests understanding.
- **A course-wide critic** after all 20: coverage of every promoted Skill, consistent cross-links, no contradictions between Lessons.
- **PR A's content-lint test** ("real course") must pass on all 20 files.
- **Rendering** is checked in the browser pane with the engine branch merged in locally (never pushed): a Part 1 Lesson, `grilling`, and the capstone, at phone and desktop widths.
- After PR A merges: `npm test`, `npm run lint` and `npm run build` pass on the synced branch.

## Out of Scope

- The parser, scroll scenes, quiz UI, quiz storage, progress and crowd stats (PR A).
- `GLOSSARY.md`, ADRs, `globals.css`, `drizzle/**`, the home page and any other `src/**` file (PR A), except `src/app/credits/unsplash.ts`.
- Full Lessons for Skills that are in-progress, misc or newer than v1.3.1 (they get at most a short mention).
- Video or audio content.

## Further Notes

- `grilling` is written first: PR A cherry-picks it as its pilot Lesson.
- This PR merges after PR A, because the new blocks only render once PR A's engine lands.
- Lesson text never says "Lesson <number>" (renumbering would break it); it links by title to `/learn/<slug>`. Every backticked `/name` is a real 1.3.1 Skill or a Built-in command.
- The pilot commit rewrites only `content/lessons/01-grilling.md` (keeping `order: 1`, adding `part: 2`) and links only to existing Slugs. The renumbering and links to new Slugs come in later commits.
- Don't run `npm test` here: it hits the shared Neon `test` branch. Run `npm run test:content` once PR A's branch is merged in locally.
