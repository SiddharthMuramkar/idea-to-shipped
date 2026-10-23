# 07: Verify, review, document and ship

**What to build:** PR A is checked end to end, reviewed, documented and opened as a pull request. Then it's checked again on its Vercel preview.

- **Checks:** `npm run test:content` (no env), `npm test` (Neon `test`), `npm run lint`, `npx tsc --noEmit` and `npm run build`.
- **By hand, in the browser pane:**
  - screenshots of `grilling`, one old Lesson and the home page at 390px and 1440px, each mid-scroll at 3 points, with reduce motion off and on, and with the `@supports` block switched off (the Firefox path)
  - a keyboard-only pass
  - a CLS read
  - a sideways-scroll check at 390px
- **Behaviour:**
  - Answer a Checkpoint and see the feedback, then the crowd bars.
  - Reload, and the Answer is restored.
  - Pass the Final test and see the ring, the badge, and a tick on the home card after navigating back.
  - Fail, then try again.
- **PR B's drafts:** merge PR B's branch locally (unpushed, then reset) to screenshot the terminal, files and meter Scenes in real Lessons and to run `course.test.ts` against real drafts.
- **Review:** the two-axis `/code-review` (Standards + Spec, against this spec and tickets 01–06), with an adversarial verifier per finding, then fixes.
- **Docs:** the README ("Writing a Lesson", API, "How it works", setup), `GLOSSARY.md`, `docs/authoring-lessons.md` and ADRs 0005–0007 match what was built. Each ticket gets a `## Comments` section saying what was built.
- **Ship:** push, then write the PR body with `/pr`. On the Vercel preview: the branch has migrated (ADR 0002), a real `POST /api/answers` returns 201 with the cookie, and progress survives a reload.

**Blocked by:** 05 (Checkpoints, Final test, crowd bars and progress ticks), 06 (Pilot: the rewritten `grilling` Lesson)

**Status:** ready-for-agent

- [ ] `npm run test:content`, `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build` all pass
- [ ] Screenshots of `grilling`, one old Lesson and the home page at 390px and 1440px: mid-scroll at 3 points, with reduce motion off and on, and with the `@supports` block off
- [ ] A keyboard-only pass through the Checkpoints and the Final test, with each `role="status"` announcement checked. A VoiceOver spot check of one Scene and one Checkpoint
- [ ] CLS reads 0 on `grilling`, and there's no sideways scroll at 390px
- [ ] The behaviour checks pass: feedback then crowd bars, an Answer restored after reload, a pass showing the ring, the badge and a home-card tick after navigating back, and a fail followed by a retry
- [ ] PR B's branch was merged locally (and not pushed) to screenshot the terminal, files and meter Scenes and run the course lint on real drafts. Any finding was sent to PR B
- [ ] The two-axis review ran, each finding was verified, and the confirmed ones are fixed
- [ ] README, GLOSSARY, `docs/authoring-lessons.md` and ADRs 0005–0007 match the code, and every ticket has a `## Comments` section
- [ ] The PR is open with a `/pr` body. On its preview, the Neon branch has migrated, `POST /api/answers` returns 201 with a `visitor` cookie, and progress survives a reload
- [ ] After the merge, the user is reminded that PR B can now sync with main, and that `/retro` is worth running
