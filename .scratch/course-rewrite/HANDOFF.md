# The 20-Lesson course: handoff (2026-10-23)

Start here if you're picking up the course PR ("PR B") on a new machine. Everything you need is on GitHub. Branch `course-20-lessons` is `main` plus this folder.

## Paused mid-revision on 2026-10-24 (read this first)

The user paused the work to carry on from another machine. Everything is pushed: pull `course-20-lessons`.

**Done and pushed:**
- **0c47797, step 5:** two lint rules, test-first. The right answer is never longer than every wrong option, counting the text a reader sees (a tie passes), and no option says "all of the above" or "none of the above". They live in `src/lessons/course-lint.ts` with unit tests, run on Checkpoints and the Final test, and are listed in the authoring guide's lint table.
- **4137eaf:** all 75 `mattpocock/skills` links pinned from `main` to 49dd158 (all 42 linked paths exist there; the 3 links to this repo stay on `main`), and every `a && b` chain split into one command per line.
- **3376e95:** the revision workflow's output for all 20 Lessons, plus its records.
- **37d7a19, step 6:** `PENDING_REWRITE` and its two guard tests are deleted, so every per-Lesson rule runs on all 20. It isn't the last commit, as the plan said, because all 20 already pass the full bar.

**State:** `npm run test:content` passes 410 of 410, and the draft lint prints no `ERROR` on any of the 20. `grilling`'s question ids, option order and `[x]` positions match `main`.

**The revision workflow.** Its script is `tools/revision-workflow.js` and its input `tools/revision-workflow-args.json`. Per Lesson it runs: Review (only lenses that never ran) → Revise → Check (independent accuracy, reader and quiz checkers that try to break the revision) → Fix, for up to 3 check rounds, then two course-wide critics. It was stopped part-way. Each Lesson's full record is in `review/run-2026-10-24/<slug>.json`: `review` (new first-review findings), `revise` (summary, fixed, deferred, declined, words), and `rounds.r1`, `rounds.r2` (each with `checks` per lens and the `fix` that followed).

| Lessons | Reached | Left to do |
|---|---|---|
| start-here, skills, grilling, tdd, implement, code-review, pr-and-ship, wizard | check round 2 (no highs; 3 to 11 mediums each, **not fixed yet**) | fix round 2's mediums, then check round 3 |
| triage | check round 2 for accuracy and quiz (no highs) | reader round 2, fix, check round 3 |
| how-agents-work, context-window, domain-modeling, prototype, spec-and-issues, main-flow, diagnosing-bugs | check round 1 and its fix | check round 2, fix, check round 3 |
| architecture, retro, wayfinder, models-effort-ultracode | first review (7, 1, 5 and 7 highs) and revise | **never independently checked:** check round 1, fix, and so on |

The course-wide pass (a consistency critic and a coverage-and-links critic, then per-Lesson fixes) never ran.

**How to carry on.** A workflow run can only resume in the session that started it, so restart from the saved records:
1. Install the plugin first (`claude plugin install mattpocock-skills@claude-plugins-official`): the agents read the 1.3.1 Skills from `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/`.
2. Set `REPO` at the top of `revision-workflow.js` to the new clone's path.
3. Change the pipeline to skip Review and Revise, start each Lesson at the round in the table, and seed `declined` from the saved `revise.declined` and `rounds.*.fix.declined`, so the checkers don't re-raise what a fixer already rejected. For the 8 Lessons whose round 2 is done, start with a fix of the saved round 2 highs and mediums.
4. Keep the course-wide pass at the end.
5. Tell agents to put scratch files in their scratchpad, never `content/lessons/`. The grilling agent left a `04-grilling.md.ids` there; it was removed, not committed.

**Watch the word cap:** several Lessons sit near 3,000 words (implement 2,902, retro 2,911, diagnosing-bugs 2,932), so fixes there must cut as much as they add.

**Then the rest of the plan:**
- Log the deferred mediums and the lows in each Part's ticket under `## Comments`, from `revise.deferred` and the last round's findings. Not done yet.
- Step 7: commit per Part as the fixes land, with a two-axis `mattpocock-skills:code-review` per Part. The Lessons are already in one commit, so review each Part against main with a path filter, as in `git diff main...HEAD -- content/lessons/00-* content/lessons/01-* content/lessons/02-* content/lessons/03-*`. Standards: the writing guide, `docs/authoring-lessons.md` and `GLOSSARY.md`. Spec: `spec.md` plus the Part's ticket.
- Step 8: the full gate, the PR body with `mattpocock-skills:pr`, then `gh pr create`. Don't merge: the user checks the Vercel preview first.

## Progress on 2026-10-24, first session

Picked up on the new Mac. Steps 1 and 2 of the plan below are done and pushed.

- **Step 1** (2cde45c): merged `origin/claude/course-rewrite-439267`. `04-grilling.md` is main's text with `order: 4`, and `01-grilling.md` is gone. In `README.md` the badge, About and Lesson table come from the course, but **Features stays main's**: the course's Features describe grading, the 80% pass mark, the progress cookie and Scenes that step, and none of those are built. Revisit Features when tickets 02, 04 and 05 ship.
- **Step 2** (0ecacb3): restored the 19 drafts from `wip/pr-b-2026-10-23`, then put main's grilling back, because the restore had overwritten it. All 20 Lessons have a unique `order` and a `part`, and the draft lint prints no `ERROR` lines.
- `npm run test:content`: 235 of 236 pass. The one failure is the `PENDING_REWRITE` guard, which is expected until step 6 deletes the list.
- **Step 3 is answered:** Site stories cite only facts the repo holds (commits, PRs, files). Rewrite or cut any claim that only a session log could back up, in `how-agents-work`, `context-window` and `skills`, and anywhere else one turns up.
- **How to run step 4:** the user chose one workflow over all 20 Lessons, replacing the "no big agent fan-outs" rule under "How the user works". Each Lesson's agent edits only its own file, and independent checkers try to break each revision. Lessons that were never reviewed get the review lenses first. Still commit and push per Part (step 7).
- **Checking against v1.3.1:** the installed plugin's SKILL.md files are in `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/`, the same content as commit `49dd158`.
- **Transcripts:** the machine-translated video transcripts aren't on this Mac. Paraphrase anything taken from videos LlgiOCmFG_w, gaDdrDdczO4 and M6mYodf0dJM unless a text source backs the exact words.
- **Env and links on this Mac:** `.env.local` came from `vercel env pull` (Neon `vercel-dev`). `.env.test.local` holds only `DATABASE_URL` for the Neon `test` branch. `neon link` pins `vercel-dev` in `.neon` and was run with `--no-env-pull`, so it never overwrites `.env.local`. All of these are git-ignored.

## Where things stand

- **`main` (7934668)** is live at https://idea-to-shipped.vercel.app. It has the first Lesson engine release (PR #10): the typed-block parser, the new Lesson page and the rewritten `grilling` Lesson. The other 11 Lessons are the old journal Lessons, listed in `PENDING_REWRITE` in `src/lessons/course.test.ts`.
- Questions show a "Show the answer" box with no grading. Scenes show their final state.
- **Not built yet:** quizzes (tickets 02 and 05), Scene stepping (04) and the `photos` Scene (08). So **don't use `scene photos`**. Contract v1.5 allows it, but the parser rejects it.
- **The course work so far** is on branch `origin/claude/course-rewrite-439267` (b5ad9b8). It's based on the old main (d21fc2c) and holds:
  - the spec, tickets 01–07 and contract v1.5 (`.scratch/course-rewrite/`)
  - research notes for all 20 Lessons
  - the writing guide
  - the grilling pilot as `04-grilling.md`, the renumbering and `part` headers
  - the new photos and the README rows
- **The 19 other drafts** are in the pushed tag `wip/pr-b-2026-10-23` (commit c1d7896, on top of b5ad9b8). They have never been revised, and all pass the lint.
- **Review of the drafts** is in `review/` in this folder:
  - `findings/<slug>.json`: first-pass findings per Lesson. Lenses are `reader`, `quiz`, `acc-sources` and `acc-skills`. Each finding has `severity`, `where`, `problem`, `evidence` and `fix`. 794 findings in total: 46 high, 322 medium, 426 low.
  - `briefs/<slug>.json`: what each Lesson must teach.
  - `finished-checks-by-lesson.txt`: which checks ran.
  - **Two more highs** exist only in dropped first runs:
    - `context-window`: the three wrong options in each "spot-" question share a wording tell.
    - `start-here`: a repeated wording tell across 5 of the 6 Final test questions.
  - **Never reviewed:** `wayfinder` and `models-effort-ultracode` (all four lenses), and `architecture` and `retro` (`acc-skills`, `acc-sources`).
- **Lint for drafts:** `tools/lint-lesson.mjs` here. Run it from the repo root:

  ```bash
  LINT_SLUGS=start-here,how-agents-work,context-window,skills,grilling,domain-modeling,prototype,spec-and-issues,tdd,implement,code-review,pr-and-ship,main-flow,diagnosing-bugs,triage,wizard,architecture,retro,wayfinder,models-effort-ultracode node .scratch/course-rewrite/tools/lint-lesson.mjs content/lessons/<file>.md
  ```

  It must print no `ERROR` lines. The real gate is still `npm run test:content`.

## Set up on a new machine

```bash
git clone https://github.com/SiddharthMuramkar/idea-to-shipped.git
cd idea-to-shipped
git fetch --tags
git switch course-20-lessons
npm ci
npx next typegen
npm run test:content
```

`npm run test:content` needs no env files.

For `npm test` and `npm run build` you need two git-ignored env files, which never go in git:
- `.env.local`: the Neon `vercel-dev` branch.
- `.env.test.local`: the Neon `test` branch, `DATABASE_URL` only.

Copy them from the old machine privately, or run `vercel link` then `vercel env pull .env.local` (that gives `vercel-dev`). Take the `test` branch URL from the Neon console. Never print them.

## The plan (one session, commit and push after every step)

1. **Bring the course in.** Run `git merge origin/claude/course-rewrite-439267`. Expect two conflicts:
   - `README.md`: keep main's sections below "How it works", and the course's Lesson table and About above them.
   - `content/lessons/01-grilling.md`: modify/delete. Use **main's** text, moved to `content/lessons/04-grilling.md` with the course's header (`order: 4`, `part: 2`). Then `git rm content/lessons/01-grilling.md`. Main's grilling has review fixes that the course branch's copy lacks: PowerShell-safe commands, pinned sources, newest-first comments, the flow Scene's side branch, and the quickstart link.
   - The question ids, option order and `[x]` positions of grilling are frozen; rewording is fine.
2. **Restore the drafts:**

   ```bash
   git restore --source='wip/pr-b-2026-10-23^{commit}' -- content/lessons/
   ```

   Then check that `04-grilling.md` is still main's version, and commit.
3. **Ask the user one question first:** may Site stories cite facts from session logs? The writing guide allows it; the old handoff banned it. It affects `how-agents-work`, `context-window` and `skills`.
4. **Revise:**
   - Fix the 48 highs and the accuracy mediums. Log the rest in the ticket's `## Comments`; don't chase all 794.
   - Stay under the word caps.
   - Pin `mattpocock/skills` links from `blob/main/` to `blob/49dd158d1076134a641b33efb035946536778336/`, the commit the installed mattpocock-skills 1.3.1 matches. Leave the 3 links to this repo alone.
   - Replace `&&` chains with one command per line (Windows PowerShell 5.1).
   - `main-flow` shows `/retro` as step 4.
5. **Make the lint stricter before revising quizzes.** Add "the right answer is not the longest option" and "no all/none of the above" to `src/lessons/course.test.ts`.
6. **Ship all 20 at once.** Each Lesson's `order` must be unique, and every Lesson needs a `part`. Delete `PENDING_REWRITE` and its uses from `course.test.ts` in the final commit.
7. **Per Part** (00–03, 04–12, 13–15, 16–19): commit, then a two-axis `mattpocock-skills:code-review` (Standards + Spec, spec = `.scratch/course-rewrite/spec.md` plus that Part's ticket).
8. **Finish:**
   - Run the gate: `npx next typegen && npx tsc --noEmit`, `npm run lint`, `npm run test:content`, `npm test` (one lane only: the Neon `test` branch is shared) and `npm run build`.
   - Write the PR body with `mattpocock-skills:pr`, then `gh pr create`.
   - The user previews the Vercel preview (behind Vercel login).
   - Squash-merge only on their OK.

## How the user works

- A rusty backend hobbyist (FastAPI/Postgres) on their first full-stack project. Explain new stack pieces by mapping them to what they know.
- Ask at most 1–2 questions at a time, only about architecture or scope, each with a recommendation. Decide small details yourself and say what you chose in a line.
- **Ship small.** One session and one worktree per PR. Commit and push after every step. No orchestration tooling, "cells", wave scripts or big agent fan-outs. That's what wrecked the first attempt.
- **Content rules:**
  - Quotes stay under 15 words, one per source.
  - Use `GLOSSARY.md` terms exactly.
  - Never write "Lesson <number>".
  - Quotes from the machine-translated transcripts (videos LlgiOCmFG_w, gaDdrDdczO4, M6mYodf0dJM) must be checked against the English video, or paraphrased. Those transcripts aren't in git.
- **Never edit an applied migration.** Stage explicit paths. Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, and PR bodies with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

## Also here, for later tickets

`.scratch/lesson-engine/later/` holds material for the quiz work, which is not part of the course PR:
- `shared-quiz-contract.md`: the API contract for tickets 02 and 05.
- `ticket-02-newer/`: two files newer than the ticket 02 code in tag `wip/pr-a-2026-10-23`:
  - a 413 body-size test, which fails until `readJson` checks the size before reading the body;
  - a `src/test/requests.ts` helper.
