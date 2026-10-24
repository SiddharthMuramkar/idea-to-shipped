# 05: Part 3, When things go wrong

**What to build:** Lessons 13–15: `diagnosing-bugs`, `triage`*, `wizard`.

**Blocked by:** 02

**Status:** resolved

- [x] Three Lessons in the contract format, each passing the three lenses

## Comments

### 2026-10-24: revision finished (lean) and Part reviewed

Every Lesson here passes the draft lint and `npm run test:content`. The revision ran as the handoff's lean finish: each Lesson's pending issues got one more fix, with no further check rounds and no separate course-wide critics. Each Part instead had a two-axis `code-review` (Standards with the critics' quote, Site story and cross-Lesson checks folded in, and Spec): standards 0 high, 1 medium, 8 low; spec 0 high, 0 medium, 4 low. Highs were fixed in the main session; what's below stays open. Full records: `review/run-2026-10-24b/<slug>.json` (with `earlierRecord`), `lean-fix.json` and `part-review.json`.

**diagnosing-bugs**: pending issues of check round 2 fixed (lean finish). 25 fixes applied across this run and the resume run; 2 declined.
- declined: acc-skills medium, suggested rewrite of Scene hypothesis 3 as 'if the limit is in bytes, 26 é (52 bytes) will also fail' Why: The finding was right, but that wording would break the Scene's own Phase 2 result: 25 🌸 is 100 bytes in UTF-8, so a bytes limit would refuse it, yet the Scene shows 25 🌸 going green.
- declined: acc-sources low (Bonus), suggested adding 'you don't need the database env files for this check', and the draft's claim that a check printed 404 live and locally Why: Only the reviewer's own curl and code reading back these, not a repo fact, and task item 4 limits the Bonus to what the repo holds.
- low (accuracy, r2) Flow Scene caption: "The repro is gone" can be read as "the repro is deleted".
- low (accuracy, r2) Checkpoint pause-first: Read literally, this is false.
- low (accuracy, r2) Chat Scene: The caption says one tagged probe per prediction, but the Scene shows something else.
- low (accuracy, r2) The six phases: This overstates the rule.
- low (reader, r2) A session: This repeats a point the Lesson already makes four times: line 109, the Scene caption at line 138, the rerank feedback at line 160 and the cheat sheet at line 308.
- low (reader, r2) Try it yourself: Deleting the typed text is only said for the installed case.
- low (reader, r2) Try it yourself: With a tiny cart script, the agent may test its predictions with a debugger or by changing inputs, and add no debug logs at all.
- low (reader, r2) Steering it: Read literally, this contradicts the Lesson's central rule: the agent must also show you the red command and its output.
- low (reader, r2) The idea: a loop that goes red: no-loop-stop Checkpoint: The feedback relies on a rule the reader hasn't met yet.
- low (quiz, r2) Final test: This distractor depends on a fine wording difference.
- low (quiz, r2) Checkpoint minimise-cut option d: Weak distractor: few readers would decide something is the cause because removing it changed nothing.
- low (quiz, r2) Final test: Silly distractor: 'definitely ...
- low (quiz, r2) Final test: This isn't a mistake the agent made.
- low (quiz, r2) Final test: Goal 4 says 'decide when to reach for /diagnosing-bugs instead of /triage or a plain question'.
- [x] medium (review, standards) content/lessons/13-diagnosing-bugs.md: A cold reader meets 'permission prompt' here with no explanation. **Fixed** in 4c32dba: option c of pause-first reads "Choose No when it first asks permission to edit a file." (same meaning, so same id), and its feedback no longer says "prompt".
- low (review, standards) All three Lessons: 13-diagnosing-bugs.md: All three Lessons are past the writing guide's word aim, and diagnosing-bugs is 23 words under the lint's hard ceiling.
- low (review, standards) 13-diagnosing-bugs.md: Both steps have the reader type a slash and a word to check the menu.
- low (review, standards) 13-diagnosing-bugs.md: Both sentences mean this site's Comments, but they use the lower-case word.
- low (review, standards) 13-diagnosing-bugs.md:: A cold reader meets these terms with no explanation.
- low (review, standards) 13-diagnosing-bugs.md: A judgement call (possible Divergent Change).
- low (review, spec) diagnosing-bugs: All three Lessons use ideas that another Lesson owns, but never link to it.

**triage**: pending issues of check round 2 fixed (lean finish). 19 fixes applied across this run and the resume run; 1 declined.
- declined: reader-8 (low): the afk.sh line says it picks up what triage labelled ready-for-agent, overnight, which supposedly goes beyond the source Why: Discussion #1136 (fetched with gh api graphql) is titled 'afk.sh: chaining /implement over ready-for-agent tickets overnight, one fresh session per ticket', and its body says 'once /triage has labelled a batch ready-for-agent'.
- low (reader, r2) Try it yourself: The step never says not to press Enter, or to delete `/triage` from the prompt box once it shows in the list.
- low (reader, r2) A session: "Failed" here means the claim didn't hold up.
- low (reader, r2) Try it: The Lesson calls the `.out-of-scope/` file a "design note".
- low (reader, r2) Agent brief section:: A reader who barely uses a terminal takes `/learn/nope` for a file path, right after being told briefs never name one.
- low (reader, r2) Word budget: table row: The Lesson is at 2,913 prose words, above the guide's 2,800 target and 87 under the lint cap.
- low (review, spec) triage: This is the only place triage uses `/clear`, and it never says it's a Built-in command rather than a Skill.
- low (review, spec) triage: The brief asks for one honest line, but the box runs to three sentences (about 65 words) and adds a history of the first version's ticket statuses.
- low (review, spec) triage: Line 132 quotes triage SKILL.md twice: the stock phrase "please provide more info", and the disclaimer line, which the Lesson repeats at line 179.

**wizard**: pending issues of check round 3 fixed (lean finish). 32 fixes applied across this run and the resume run; 0 declined.
- low (accuracy, r3) Try it yourself: The prompt asks for a wizard that writes to `.env.practice`, but the default `.env` path lives in the library, which the agent may not edit.
- low (accuracy, r3) Running it: The body says only that the pauses get skipped.
- low (accuracy, r3) Running it: This sentence follows the cited docs page clause by clause and keeps its distinctive ending.
- low (accuracy, r3) Checkpoint verify-before-handoff: The Skill tells the agent not to run the wizard.
- low (reader, r3) Checkpoint verify-before-handoff: Two feedback lines say the agent can't, or never does, run a wizard.
- low (reader, r3) Running it: The prose at line 162 ("The opening banner says you can stop and re-run any time") and the next Checkpoint's stem at line 194 ("The banner said you could stop and re-run any time") both rely on the banner's re-run promise.
- low (reader, r3) Try it yourself: Stage 1 of the practice prompt asks for the real star count shown on GitHub (line 249), and the checklist expects that page to open before the number is asked for (line 277).
- low (reader, r3) Common mistakes: The Visitor is told to check what `.gitignore` covers but not how.
- low (reader, r3) How Matt and others use it: "Production" first appears here with no clause.
- low (quiz, r3) Final test: The right option repeats the stem's key word "chat", so a reader can match words instead of reasoning.
- low (quiz, r3) Final test: The round-2 fix overshot.
- low (quiz, r3) Final test: c misstates the stem.
- low (quiz, r3) goals: The goal says without exception that a wizard is deleted when the job is done.
- low (quiz, r3) Checkpoint public-ci-value: The Final test question copies the Checkpoint's shape.
- low (review, standards) 15-wizard.md: This is the only github.com/mattpocock/skills link in Part 3 that isn't pinned to commit 49dd158.
- low (review, standards) 13-diagnosing-bugs.md: A judgement call (possible Duplicated Code).
- low (review, standards) 15-wizard.md: A judgement call (possible Duplicated Code).
