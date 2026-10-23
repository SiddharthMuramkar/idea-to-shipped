# 06: Pilot: the rewritten `grilling` Lesson

**What to build:** The engine ships with one real rewritten Lesson. PR B writes `grilling` against the authoring contract and commits it on its own branch as a single standalone commit. This ticket cherry-picks that commit and makes sure it works.

- **The commit:** wait for PR B's commit SHA (sent by message). Then `git cherry-pick <sha>`. The commit should touch only `content/lessons/01-grilling.md`, with `order: 1` and `part: 2`, and link only to slugs that already exist.
- **The lint:** remove `grilling` from `PENDING_REWRITE` in `src/lessons/course.test.ts`, so the course lint now holds it to every rule.
- **Mismatches:** anything that doesn't match the contract (a parse error, a lint failure, a Scene that renders wrongly) goes back to PR B by message. PR B fixes it and sends a new SHA. Don't edit PR B's prose here.

See the spec's "Further Notes" (the pilot handoff).

**Blocked by:** 01 (Lesson format, parser and course lint), and PR B's `grilling` commit SHA

**Status:** resolved

- [x] PR B's `grilling` commit is cherry-picked as-is, and it touches only `content/lessons/01-grilling.md`
- [x] `grilling` is removed from `PENDING_REWRITE`, and `npm run test:content` passes with it linted
- [x] `npm run build` passes, and `/learn/grilling` renders every block it uses (goals, its Scenes, Checkpoints, the Final test, callouts, try, site story, sources)
- [x] Every link in it points at an existing slug, and its header has `order: 1` and `part: 2`
- [ ] Any contract mismatch was sent to PR B and fixed there, with the fixing SHA noted in this ticket
- [ ] Once tickets 04 and 05 are in: screenshots of `grilling` mid-Scene at 390px and 1440px, and its Final test passed and failed

## Comments

- 2026-10-23: Shipped in the first release (branch `lesson-page-v2`). tsc, lint, `npm run test:content` (140 tests, no env), `npm test` (153 tests incl. the Neon test lane) and `npm run build` all pass on the branch.
- **Edited here, not in PR B** (the scope change ships grilling first): a8cd975 (PowerShell-safe commands, pinned sources, three accuracy fixes), 87ac2d9 (the Scene matches the site's newest-first comments) and a20bc1c (the flow Scene's side branch, honest pointers to the old Lessons, the quickstart link). Question ids, option order and `[x]` positions are unchanged. **PR B's `04-grilling.md` must take the same edits** when it syncs with main, before "keep 04, `git rm` 01".
- Left open: box 5 (contract mismatches went into this branch instead), box 6 (waits for tickets 04 and 05).
