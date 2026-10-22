# 04: Lesson 11, "The main flow"

**What to build:** A new last Lesson: slug `main-flow`, title "The main flow", order 11, with its own topic-matched photo (a map, a route or a flow), using the same sections as every Lesson (What it is → When to use it → What I typed → What happened). It is a beginner's which-command-when map. Sources: Matt Pocock's video "mattpocock/skills: A complete AI Coding workflow, end-to-end" (2026-07-16, https://www.youtube.com/watch?v=M6mYodf0dJM) and the installed `ask-matt` Skill (read its SKILL.md). Use the glossary terms Main flow, Skill and Built-in command.

**Blocked by:** 02 (Lesson pages with photos)

**Status:** resolved

- [x] Shows the Main flow as an ordered path with its two forks: "can every question be settled by talking?" (if not, `/prototype`) and "is this a multi-session build?" (`/to-spec` → `/to-tickets` → `/implement` per ticket or `/implement-spec`, versus `/implement` right away)
- [x] A "you're in this situation → type this" table that includes `/ask-matt`, `/diagnosing-bugs`, `/triage`, `/pr` and `/retro`
- [x] Says which Skills only the human can start (`/ask-matt`, `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`) and which the agent picks up on its own
- [x] Explains the Built-in commands `/clear` and `/compact`, and the rule "keep grilling, spec and tickets in one session; `/clear` only after `/to-tickets`", in plain words (the smart zone)
- [x] An "old way → new command" table mapping Lessons 0–10 (`/grilling` + `/domain-modeling` → `/grill-with-docs`; "write the spec" → `/to-spec` + `/to-tickets`; `/tdd` ×4 + `/code-review` → `/implement` or `/implement-spec`)
- [x] "What I typed" lists the real steps used to build this PR (the grilling, `/to-spec`, `/to-tickets`, `/implement-spec`); "What happened" is drafted and marked to finish after the build
- [x] The Lesson appears last on the home page and its Previous link goes to Lesson 10; Lessons 0–10's text is untouched

## Comments

**Built (ticket 04, branch `ticket/04`):**

- `content/lessons/11-main-flow.md`: slug `main-flow`, title "The main flow", order 11, with the usual four sections. It contains:
  - "What it is": the Main flow as a numbered path with both forks (`/prototype`; `/to-spec` → `/to-tickets` → `/implement` per ticket or `/implement-spec`, versus `/implement` right away), plus a narrow text diagram that fits a phone.
  - "When to use it": the situation → Skill table (including `/ask-matt`, `/diagnosing-bugs`, `/triage`, `/pr`, `/retro`), who starts what, the Built-in commands `/clear` and `/compact`, the "`/clear` only after `/to-tickets`" rule, the smart zone, and the old way → new Skill table for Lessons 0–10.
  - "What I typed": the four real steps of this PR.
  - "What happened": drafted from the real session and marked *Draft* at the top, with a "Still to write" line at the end.
- Facts come from the installed `ask-matt` Skill (mattpocock-skills 1.3.1: `SKILL.md` and `PHASE-BOUNDARIES.md`) and the video's chapter list. Which Skills only the human can start was checked against each SKILL.md's `disable-model-invocation: true`. `/triage` and `/retro` are user-only too, and the Lesson says so. `/implement-spec` came out after the video (v1.3), so the Lesson names `ask-matt` as its source.
- "What I typed" and "What happened" come from this session's real messages. The user said "start grilling with docs" in plain words, so the agent ran `/grilling` + `/domain-modeling`. Then come `/to-spec`, `/to-tickets` and `/implement-spec`, the "Lesson 0 → last lesson" change of mind, "did you convert them to tickets?", and "do I run the code review now or after?".
- Photo: `public/photos/main-flow.jpg`, copied unchanged from the manifest (Denys Nevozhai). It's added to `src/app/credits/unsplash.ts`, so `/credits` shows Lesson 11 with both links. The manifest is unchanged.
- One new test, in `src/lessons/lessons.test.ts` ("the real course"). It runs against the real `content/lessons` through the public `lessons` export: the last Lesson is `main-flow`, number 11, with its photo, Previous is `models-effort-ultracode`, and there is no Next. It went red before the file existed and green after.
- No code changes beyond the credit entry. No CSS changes. Lessons 0–10 are untouched (`git diff main-flow-and-redesign -- content/lessons/0* content/lessons/10*` is empty).

**For later tickets:**

- The header's "The main flow" link (`/learn/main-flow`) now resolves.
- **Ticket 03:** the home Main flow band can link to `/learn/main-flow` and reuse the path's six steps: `/grill-with-docs` → (`/prototype`) → `/to-spec` + `/to-tickets` → `/implement` or `/implement-spec` → `/pr` → `/retro`.
- **Ticket 05:** the Lesson's blocks are plain `.prose` children (`h2`, `p`, `ol`/`ul`, `table`, `pre`), with no special markup.
- **Final step:** "What happened" still needs finishing once the build and `/code-review` are done. Look for the two italic *Draft* / *Still to write* lines.

**Verification:**

- At a true 390px width (a temporary iframe checker in `public/`, deleted afterwards), `scrollWidth` on `/learn/main-flow` was 390. The old way → new Skill table is 403px wide inside a 356px column. It scrolls inside itself, as ticket 02 set tables up to do, and doesn't push the page sideways. The Previous card is Lesson 10, and there is no Next.
- The home page lists `/learn/main-flow` last. `/credits` and the footer show Lesson 11.
- vitest (25 tests, including the Comments tests against Neon `test`), eslint, `tsc --noEmit` and `next build` all pass.

**Screenshots** (in `/private/tmp/claude-501/-Users-siddharth-Developer-trying/8bf55acc-42cf-45d9-a9eb-b4943908248f/scratchpad/implement-spec/screenshots/`):
- `04-main-flow-desktop.png`, `04-main-flow-phone.png` (the photo band: white text is readable over the interchange photo)
- `04-main-flow-desktop-tall.png` (the whole Lesson: tables, the Previous card to Lesson 10, the footer), `04-main-flow-phone-tall.png`
- `04-main-flow-desktop-reduced-motion.png`
- `04-credits-desktop-tall.png` (Lesson 11 credited)

**Not done / notes:**
- I didn't read the Next.js docs: this ticket writes no Next.js code (one Markdown file, one data entry).
- The video page gave only its chapter list, not a transcript, so the details of the path come from the `ask-matt` Skill.
