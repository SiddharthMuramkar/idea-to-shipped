# Handoff: paused 2026-11-06, resume on "go"

The goal: put the skills course, learn-matt-flow, the CI/CD lab and new GitHub lessons into idea-to-shipped as one reference library, shipped as **one PR with one Vercel build**. It has 7 Courses and 79 lessons, each with Quick checks, a Final test of at least 5 questions and a Done mark, plus Commons photos.

`vercel.json` skips Vercel builds for `claude/great-clarke-kc8pgo`, so pushes to it are free. Only the final commit removes it, together with this `.scratch/consolidation/` folder.

## What's in this folder

| Path | What it is | Where it lives in a running session |
|---|---|---|
| `plan/` | course map, FORMAT, STYLE, ENGINE, review notes, **cross-lesson-notes.md** (18 items) | `$SCRATCH/plan/` |
| `tools/` | validate-lesson.mjs, apply-images.py, fetch-image.sh, converters, review-batches.py | `$SCRATCH/tools/` (then run `npm i marked yaml` there) |
| `images/credits-img-*.json` | Commons credits for the 86 committed photos (not yet applied) | `$SCRATCH/images/` |
| `workflows/*.js.txt` | workflow scripts (renamed `.txt` so lint and tsc skip them) | pass as `script` or restore to `.js` |
| `journals/<run>.jsonl` | every workflow run's journal: each agent's full return value | `~/.claude/projects/<proj>/subagents/workflows/<run>/journal.jsonl` |
| `outputs/<task>.output` | final results of the finished workflows | n/a |
| `run-status.md` | per run: which agents finished (✓) and which were stopped (…) | n/a |

`$SCRATCH` = `/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad`. Node 24 was in `$SCRATCH/node24bin`; fetch it again if the container was reset.

## Runs (task id → run id)

| Batch | Task | Run | State |
|---|---|---|---|
| github-basics-1 | wwuz6glxu | wf_6d0b96a4-602 | done, committed |
| github-basics-2 | wuok6otrx | wf_f3457ad4-ff6 | done, committed |
| ci-cd-1 | wvgx0cl8v | wf_5a2c7159-a3b | done, committed |
| foundations-1 | w87ie30iw | wf_73aabad3-a1b | done, committed |
| idea-to-shipped-1 | wqsly7ram | wf_f11048c0-60e | done, committed |
| idea-to-shipped-2 | wkzpmn94y | wf_88b04637-f9e | stopped: all reviewed, fixes partial |
| idea-to-shipped-3 | wngo8mznj | wf_7772bf62-0d4 | stopped: all reviewed, fixes partial |
| on-ramps-1 | wsk1p8rdi | wf_3cbd32bb-c2f | stopped: all reviewed, fixes partial |
| codebase-health-1 | wnj3wk8nl | wf_2f9ab6d0-a27 | stopped: all reviewed, fixes partial |
| more-skills-1 | wy7nw86gx | wf_058fbc3e-c6e | stopped: all reviewed, fixes partial |
| more-skills-2 | wpkpqz1dg | wf_281e0836-79a | stopped: all reviewed, fixes partial |
| code: correctness | w53jqiu3p | wf_a1c6a3bf-e4b | **done: 5 confirmed findings, with fixes** |
| code: nextjs | w737xgj7p | wf_56f29c1f-860 | stopped: found; F1, F3, F6 verified; F2, F4 not verified |
| code: a11y | w4v7amkxb | wf_ecd75259-68f | stopped: found; 1 of 3 verified |
| code: ui | wy7nhdoz1 | wf_f2e32bae-380 | stopped: found; UI-1, UI-2 not verified |
| code: security-perf | w7tj2037e | wf_87b421d2-66d | stopped: found; 2 not verified |
| images: fix-ups | wvk2vernq | wf_fd4b1909-d68 | stopped: judged; 2 picks made but not saved |

## Lesson fix stage still to do (26 lessons)

Every lesson's **review** finished; its findings are in the journal (`review:<slug>` result). What's left is the verify-and-fix stage for these lessons.

**Fix ran but plan mode blocked its edits.** The result lists confirmed findings with planned edits. Apply them, and don't trust a cached replay.
- to-questionnaire
- ask-matt
- writing-for-agents
- wait-what
- orca-cli
- diagnosing-bugs
- prototype
- context-hygiene

**Fix stopped mid-way** (no edits landed):
- teach
- writing-beats
- chief-of-staff
- loop-me
- setup-pre-commit
- git-guardrails-claude-code
- wizard
- wayfinder
- handoff
- test-first
- implement
- review-spec-and-standards

**Fix never started:**
- writing-fragments
- orchestration
- wayfinder-first-session
- working-the-map
- answers-from-other-people
- after-the-map
- to-spec
- small-end-to-end-tickets
- to-tickets
- implement-spec
- tdd
- code-review
- pr
- spec-driven-build-loop
- retro

**Already fixed, committed in this checkpoint:**
- research
- writing-shape
- scaffold-exercises
- claude-handoff
- improve-codebase-architecture
- codebase-design
- migrate-to-shoehorn
- setup-ts-deep-modules
- triage
- domain-modeling

Best route: one new fix-only workflow. Give each of the 26 lessons its saved `review:<slug>` findings, plus the planned edits for the 8 blocked ones, using the verify/fix prompt from `review-lessons-lean`. This works the same whether or not the container survived. A plain `resumeFromRunId` would replay the 8 blocked fixes as if they were done. Budget is roughly 200–250k tokens per lesson.

## Steps on "go"

1. **Restore.**
   - If the container was reset: check out the branch, run `npm ci`, get Node 24, copy this folder back to `$SCRATCH`, and run `npm i marked yaml` in `tools/`.
2. **Lesson fixes**, as above.
   - After each batch: `node tools/validate-lesson.mjs <files>` and `npx vitest run --project content`, then commit and push a checkpoint.
3. **Code review.**
   - Build the current HEAD in a scratch worktree with a dummy `DATABASE_URL=postgresql://build:build@localhost:5432/build` and serve it on :3300.
   - Finish verifying the unverified findings above.
   - Then one fixer applies every confirmed fix, test-first where logic changes, and runs typegen, tsc, lint and the vitest content and render projects.
   - Top finding: `src/app/progress/store.ts:103`. `markDone` writes back a stale snapshot, so a page restored from the back/forward cache erases Done marks saved in other tabs. Fix: `sync()` before building the next value, plus a `pageshow` resync. Details are in `outputs/w53jqiu3p.output`.
4. **Images.**
   - Save the 2 picks:
     - setup-pre-commit: `File:Egg candling at Los Angeles Zoo (25534481404).jpg` (PD, USFWS);
     - to-questionnaire: `File:USMC-100914-M-0646Q-45.jpg` (PD; check its preview first).
   - Also do the remaining weak-image replacements in the judge result (journal `wf_fd4b1909-d68`, agent `judge`): context-window and the idea-to-shipped Course image were next. Use `tools/fetch-image.sh` with thumbnails only.
   - Then run `REPO=/home/user/idea-to-shipped python3 -I tools/apply-images.py`. It must print 0 problems and 0 missing. It writes `content/image-credits.json` and each lesson's `image`/`imageAlt`.
5. **Cross-lesson pass.**
   - Fix the items in `plan/cross-lesson-notes.md`.
   - Make start-here's description match the UI words ("Quick check", "Final test", "Done").
   - Make sure no old `public/photos` files or Unsplash code remain.
   - Update the README.
6. **Verify locally.**
   - `npx next typegen && npx tsc --noEmit`, `npm run lint`, `npx vitest run --project content --project render`, then `next build` with the dummy `DATABASE_URL`.
   - Playwright smoke test at desktop and phone width:
     - home, a Course page and a Lesson;
     - a Quick check;
     - Final test → Done on the lesson, the Course page and `/progress`;
     - `/credits`;
     - the 3 redirects.
7. **Ship.**
   - One commit deletes `vercel.json` and `.scratch/consolidation/`, then push. That is the single Vercel preview build.
   - Open ONE PR into `main`. The body notes that merging runs the production build.
   - Check the preview with list_deployments/get_deployment.
   - Ask whether to watch the PR.
8. **Clean up.** Remove the scratch `wt-build` worktree, the 3 agent worktrees under `.claude/worktrees/` and their local branches.
