# 07: Photos, README table, course critic and the draft PR

**What to build:**

- 8 Unsplash photos for the new Slugs in `public/photos/<slug>.jpg` (2400px), credited in `src/app/credits/unsplash.ts`; downloaded only after the user OKs the list.
- The README's Lesson table lists all 20 Lessons by Part, and the Lessons badge says 20.
- A course-wide critic pass: every promoted Skill covered, consistent cross-links, no contradictions.
- A draft PR against main, titled so it's clear it merges after PR A.

**Blocked by:** 03, 04, 05, 06

**Status:** ready-for-agent

- [x] Photos and credits in place; every Lesson header has `image`, `imageAlt`, `imageCredit` (2d24c65)
- [x] README table updated (d26a547; About and Features in 5c61923)
- [ ] Critic findings fixed: the separate course-wide critics never ran (lean finish, 2026-10-24); each Part's Standards review carried their quote, Site story and cross-Lesson checks instead (tickets 03–06)
- [x] ~~PR A's content-lint test passes with the engine merged in locally~~ Superseded: the engine shipped in PR #10, and the course's lint passes on top of it
- [x] `mattpocock-skills:code-review` per Part (fixed point = the commit before the Part; spec = that Part's ticket + spec.md; standards = contract-v1.md + writing-guide.md), findings fixed or answered; once more over the whole branch (fixed point main) before the PR goes ready. Per Part done 2026-10-24 (`review/run-2026-10-24b/part-review.json`); the whole-branch pass covered the non-Lesson diff only, reviewed in the main session
- [x] Source links pinned to the installed commit (`blob/49dd158d1076134a641b33efb035946536778336/`), not `blob/main`
- [x] Every quoted Matt line taken from an Arabic-translated transcript (LlgiOCmFG_w, gaDdrDdczO4, the original M6mYodf0dJM) checked against English or paraphrased (transcripts read by the checkers and the Part reviews)
- [x] The main-flow capstone and the retro Lesson show `/retro` as the last Main flow step (ask-matt step 4)
- [ ] ~~`photos` Scenes~~ Waits for engine ticket 08: the parser rejects `scene photos`. Not in this PR. The plan was: (contract v1.5) proposed for at most 5 Lessons; any new downloads OK'd by the user first and credited
- [x] ~~Engine previewed only on a throwaway branch~~ Superseded by PR #10. The plan was: (`git switch -c preview/engine`, merge `origin/claude/lesson-content-scrolling-ux-2a9171`, `npm run test:content`, screenshots, switch back, `git branch -D`); no fixes committed there
- [x] ~~`git log --merges main..HEAD` is empty until PR A merges~~ Superseded by PR #10
- [x] ~~After PR A's squash-merge, sync main~~ Superseded by PR #10; main was merged in 2cde45c. The plan was: on the grilling conflict keep `04-grilling.md`, carry over anything only main's `01-grilling.md` has, then `git rm` `01-grilling.md`
- [x] Final commit deletes `PENDING_REWRITE` (and its uses) from `src/lessons/course.test.ts`; `npm run test:content` shows a Lesson block for all 20 Slugs (37d7a19; not the last commit, since all 20 already passed)
- [x] ~~README screenshot and its alt text retaken from the preview branch~~ Not needed: the screenshot shows grilling, which is unchanged
- [x] PR open, ready rather than draft (the HANDOFF's later call): the user squash-merges after checking the Vercel preview
