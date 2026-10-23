# 05: Checkpoints, Final test, crowd bars and progress ticks

**What to build:** Questions work. A Visitor gets instant feedback, sees how others answered, takes the Final test, and sees ticks for the Lessons they've passed, all without an account.

- **`checkpoint.tsx`:** each Checkpoint is its own `<form>`: a `<fieldset>` and `<legend>` with native radios, ids and names from `useId()`.
  - Check grades in the browser at once, and feedback goes to `role="status"` with an icon plus a word.
  - The card restyles to `--good` or `--error`, with a drawn tick or cross and a pop.
  - The Answer is POSTed to `/api/answers` in the background. When stats return, crowd bars grow (`scaleX`, staggered), with "You're one of the first to answer" below `MIN_CROWD`.
  - Try again resets the card.
- **`final-test.tsx`:** one `<form>`, a counter, and "Check my answers".
  - Pressing it with questions unanswered names how many and moves focus to the first one.
  - On check: every card restyles, the score ring draws, focus moves to the score, and one Attempt is POSTed to `/api/attempts`.
  - A pass stamps the "Passed" badge, ticks the goals off, and gives the Next card its "unlocked" style. A fail offers Try again.
- **Restoring:** both read `GET /api/answers?lesson=` once on mount, to restore the latest Answers and the latest result.
- **`progress-tick.tsx` + `src/progress/visitor-progress.ts`:** a `useSyncExternalStore` store with an empty server snapshot. It reads `GET /api/progress` once and updates itself on answer. Ticks go in reserved slots on home cards and on Previous/Next, with visually hidden "Passed" text.
- **Section bar:** each Checkpoint's tick fills once it's answered.
- **Privacy line:** under the first Checkpoint.

See the spec's "Scroll experience" (Block by block: Checkpoint and Final test; Accessibility; Fallbacks) and the "Privacy line" decision.

**Blocked by:** 02 (Question data and API), 04 (Scroll engine, the five Scene kinds, section bar and tones)

**Status:** ready-for-agent

- [ ] Each question is a `<fieldset>` with a `<legend>` and native radios. Arrow keys move between options, and grading happens only on the Check button, never on `change`
- [ ] Check shows "Correct." or "Not quite." plus the picked option's feedback at once (no network wait), announced through `role="status"`, with an icon and a word as well as colour
- [ ] After the background POST, crowd bars grow under each option with percentages and "You". Below 5 Answers the line reads "You're one of the first to answer." and no bars show
- [ ] If the POST fails (e.g. offline), the feedback stays and the card shows "Couldn't save your answer."
- [ ] The Final test won't check until every question is answered, and says how many are left. Checking restyles every card, draws the score ring, and moves focus to the score heading
- [ ] A pass (80% or more) stamps the "Passed" badge, ticks the goals off, and gives the Next card its "unlocked" style. A fail shows the score needed and a working Try again. Each check is stored as one Attempt
- [ ] Reloading the page restores the latest Checkpoint Answers and the latest Final test result
- [ ] Ticks appear on home cards and on Previous/Next for passed Lessons, in reserved slots (CLS 0), and update after passing a Lesson and navigating back home (Activity re-show) with no reload
- [ ] The section bar's Checkpoint ticks fill as Checkpoints are answered
- [ ] The privacy line shows under the first Checkpoint
- [ ] With JavaScript off, each Checkpoint shows its `<details>` answer and the Final test shows its JavaScript note
- [ ] With reduce motion on, every state change still happens, without movement
- [ ] Existing tests, lint, `tsc --noEmit` and build pass. A keyboard-only pass through a Checkpoint and the Final test, and screenshots of a correct, a wrong, a passed and a failed state
