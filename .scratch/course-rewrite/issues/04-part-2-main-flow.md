# 04: Part 2, The main flow

**What to build:** Lessons 5–12: `domain-modeling`, `prototype`, `spec-and-issues`, `tdd`, `implement`*, `code-review`, `pr-and-ship`, `main-flow` (the capstone map). (`grilling` is ticket 02.)

**Blocked by:** 02

**Status:** resolved

- [x] Eight Lessons in the contract format, each passing the three lenses
- [x] The capstone matches the other Lessons on every fork and context rule

## Comments

### 2026-10-24: revision finished (lean) and Part reviewed

Every Lesson here passes the draft lint and `npm run test:content`. The revision ran as the handoff's lean finish: each Lesson's pending issues got one more fix, with no further check rounds and no separate course-wide critics. Each Part instead had a two-axis `code-review` (Standards with the critics' quote, Site story and cross-Lesson checks folded in, and Spec): standards 0 high, 7 medium, 6 low; spec 0 high, 4 medium, 4 low. Highs were fixed in the main session; what's below stays open. Full records: `review/run-2026-10-24b/<slug>.json` (with `earlierRecord`), `lean-fix.json` and `part-review.json`.

**grilling**: pending issues of check round 3 fixed (lean finish). 19 fixes applied across this run and the resume run; 3 declined.
- declined: acc-skills low (optional part): replace 'editing' in the flow Scene with a clearly independent question, because with no accounts 'who may edit' is a live question Why: Kept the Scene as it is.
- declined: acc-sources medium (Reddit): keep the 2026-06-03 date only if confirmed Why: Reddit can't be fetched from here (Firecrawl and WebFetch both refused).
- declined: reader medium (/handoff mechanics), the part of the suggested fix that keeps 'The prototype gets its own folder and a fresh session' Why: This contradicts the accuracy issue, which I confirmed.
- low (accuracy, r3) The idea: Rule 2 makes an empty frontier a condition for ending.
- low (accuracy, r3) The idea: The sentence credits 'about twenty' to the AI Hero docs, but that figure comes from the July 2026 video.
- low (accuracy, r3) Your half of the interview: The Skill says where to save the file (the OS temp folder, not the project).
- low (accuracy, r3) Your half of the interview: Claude Code's docs say a 'remember this' request goes to auto memory, and that you get the line into CLAUDE.md by asking for that file by name.
- low (accuracy, r3) Which grilling Skill to type: This gives one of three conditions as if it were the whole test.
- low (reader, r3) Try it yourself: There are two places where a reader starting from zero can get stuck.
- low (reader, r3) Try it yourself: The checklist makes a pass/fail test out of something the body calls an occasional, normal event that you fix by speaking up.
- low (reader, r3) Your half of the interview: A reader who barely uses a terminal doesn't know that a new terminal window opens in the home folder, not the project folder.
- low (reader, r3) Your half of the interview: The paragraph is aimed at a reader who is overwhelmed now, but the only fix it gives works from the next session on, because CLAUDE.md is read when a session starts.
- low (quiz, r3) Final test: The reason given contradicts the Lesson, which approves of stopping early (and so of leaving branches unvisited).
- low (quiz, r3) Final test: The feedback still answers the option as it read before round 1 ("It should be multiple choice").
- low (quiz, r3) Checkpoint steer-details: A sharp reader can argue for option a from rule 1 ("Decisions ...
- low (quiz, r3) Final test: This tests recognition, not transfer.
- low (quiz, r3) Final test: "Anywhere" goes too far, and the very next question's feedback contradicts it: inside a project folder the Lesson says `/grill-with-docs` is the better choice.
- low (review, standards) grilling line 58: The Part spells one term two ways, Lesson to Lesson.
- medium (review, spec) grilling: Part 2 Lessons teach the Smart zone, /clear, /compact and user-invoked vs model-invoked Skills, but only The main flow links The context window, and Grilling, TDD, Implement and Code review never link Skills.

**domain-modeling**: pending issues of check round 2 fixed (lean finish). 17 fixes applied across this run and the resume run; 1 declined.
- declined: quiz low: wait-what-reply option c's feedback argues about scope ('often bigger than one sentence') instead of the need for context Why: The installed docs say the same thing, almost word for word: docs/productivity/wait-what.md:19 'What lost you is usually bigger than one paragraph, so the agent decides how far back to go.' The feedback is accurate, so I kept it; only optio
- low (accuracy, r2) A session: The Scene is set in this site's repo.
- low (accuracy, r2) The glossary: Setup edits `CLAUDE.md` only when that file already exists.
- low (accuracy, r2) The glossary: The sample shows the header, then `## Discussion` and Visitor.
- low (reader, r2) Try it yourself: The colon comes straight after "run `claude` again", so a newcomer can read the code block that follows as the "run claude again" step.
- low (reader, r2) Try it yourself: The fallback leaves the reader stuck in the case the Lesson itself describes: both Skills loaded, but the agent is saving terms up instead of writing them as it goes.
- low (reader, r2) Try it yourself: A newcomer checking their result can't tell which "tables" and "pages" are meant (Markdown tables, database tables, web pages, book pages).
- low (reader, r2) A session: The Scene's ADR verdict mixes up undoing an action in the app (unhiding a Comment) with reversing the decision, which is what the "hard to reverse" test is about.
- low (reader, r2) Common mistakes: Both lines leave out the small-change path that the body teaches, so a reader who builds a small change with /implement and never runs /to-spec is told, in effect, never to clear.
- low (quiz, r2) Final test: The prompt still spells out the order of events, and the right option is the only one that opens by repeating it ("First term settled").
- low (quiz, r2) Final test: Mostly recall, not transfer.
- low (quiz, r2) Final test: A sharp reader could object that a newcomer is the worst person to be interviewed about what "ticket", "case" and "job" mean.
- low (quiz, r2) Checkpoint wait-what-reply: The right option repeats the Lesson's own phrasing: the body's "fewer words *and* the step you missed ...
- low (quiz, r2) Checkpoint earns-an-adr: "The council's system" (British local government) and "a data audit" aren't explained, so a cold or non-UK reader may not see why this is surprising, or what the trade-off is, until they read the feedback.

**prototype**: pending issues of check round 2 fixed (lean finish). 28 fixes applied across this run and the resume run; 6 declined.
- declined: reader high (Try step 1): the suggested fix chains the setup with && into one line Why: The override says one command per line, because PowerShell 5.1 has no &&.
- declined: reader medium (detour travel): the suggested sentence says that in Matt's map the prototype 'lives in its own folder' Why: prototype/SKILL.md:21 and UI.md sub-shape A put prototype code next to the real code or on the real route, so the Lesson gives only the forked-side-task reason (PHASE-BOUNDARIES.md:32), as acc-skills advised.
- declined: reader low (Site story 205k timing): check the session log and reword the timing Why: Override: Site stories cite only repo facts.
- declined: quiz medium (scenario-logic-question): rename the id to predict-logic-question Why: The question keeps its meaning (what /prototype builds for a logic question), so the id stays.
- declined: quiz medium (why-no-tests): the suggested option d pairs tests with a real database Why: The same review called that pairing unbelievable.
- declined: high (Site story capture): drop 'pushed' and 'started by one command, npm run proto', because the commit is supposedly not in this repo Why: The commit is in the repo on GitHub, just not fetched on this machine.
- low (accuracy, r2) Site story: What merged before the prototype was PR #1, a rename of the database branch in the spec and ADR.
- low (accuracy, r2) The idea: This says folding the answer into the real code started in 1.2.0.
- low (accuracy, r2) Six rules: Both lines present the `prototype/<name>` name as something the Skill does.
- low (accuracy, r2) The logic path: The aside tells a cold reader that all of the file's code is in the rules block.
- low (accuracy, r2) Final test spot-colour-variants: In the stem, all three variants are the same card grid.
- low (reader, r2) Try it yourself: The box still holds "/prot", so typing /exit gives "/prot/exit".
- low (reader, r2) The detour:: A new terminal window opens in the home folder.
- low (reader, r2) The idea:: The trailing phrase reads as if it describes the paths: "they ...
- low (reader, r2) Word budget: The Lesson sits at 2976 of the 3000-word lint cap.
- low (quiz, r2) Final test: "The rest" suggests the winning variant B stays off the branch.
- low (quiz, r2) Checkpoint compact-or-handoff: The right option is the only one with a gloss in brackets, and it is where the term QA first appears in the Lesson.
- low (quiz, r2) Checkpoint talk-or-build: The feedback says the account question can be settled by talking but doesn't say why.
- low (review, standards) prototype: Possible Divergent Change / Duplicated Code.
- low (review, standards) prototype line 183: GLOSSARY.md defines **Phase** as a course term, and the main flow writes it with a capital throughout ('Phase boundary', 'mid-Phase').
- low (review, spec) prototype: Prototype teaches the whole five-question Phase-boundary tree a third time, and spends a Checkpoint and a Final test question on it, without linking the Lesson that owns it.

**spec-and-issues**: pending issues of check round 2 fixed (lean finish). 28 fixes applied across this run and the resume run; 0 declined.
- low (accuracy, r2) The idea: This reads as if an existing AGENTS.md takes precedence.
- low (accuracy, r2) The idea: "Calls" presents "route" as Matt's own word, but he never says it.
- low (accuracy, r2) How Matt and others use it: The post was published on 19 October 2026 but never says when the build happened.
- low (accuracy, r2) `/to-tickets` section: The question is quoted word for word from the to-tickets docs page, and the cheat sheet puts it in quotation marks, but nowhere is it attributed.
- low (reader, r2) Final test spot-cleared-before-tickets: Round 1 swept the feedback to say "empties" instead of "throws away"/"loses", because the why-write-it-down feedback teaches that /clear doesn't delete the conversation for good.
- low (reader, r2) ## Try it yourself: For a to-do page this small, /to-tickets can fairly propose one ticket, or the reader can merge down to one at step 8, which is exactly what the Lesson praises Matt for doing.
- low (reader, r2) Unexplained terms: line 85: A Visitor who has never coded meets these without a clause.
- low (reader, r2) ## A session: The opening promise (line 11) says this kind of build is "too big for one sitting", and line 24 says it "won't fit in the room you have left".
- low (reader, r2) Checkpoint first-tracer-bullet: The Checkpoint tests tracer bullets against horizontal slices (lines 110–125), but the expand–contract subsection sits between that material and the question.
- low (quiz, r2) Final test: r1 replaced "throws away" and "loses" with "empties" in other feedback, because /clear doesn't destroy the conversation.
- low (quiz, r2) Checkpoint first-tracer-bullet: The Checkpoint tests tracer bullets against horizontal slices, which lines 110-125 explain.
- low (quiz, r2) Final test: Phrasing tell.
- low (quiz, r2) Final test: The key repeats the body's own example of the exception, line 186: "(...
- low (quiz, r2) Final test: This overstates what code-review does.
- medium (review, standards) spec-and-issues Final test scenario-fits-one-session: Possible Duplicated Code.
- low (review, standards) Site stories: spec-and-issues line 276: Possible Duplicated Code.
- low (review, standards) spec-and-issues Final test `test scenario-two-agents`: Possible Mysterious Name.
- low (review, spec) spec-and-issues: The parenthetical suggests setup writes its pointer to AGENTS.md whenever the repo has that file.
- low (review, spec) spec-and-issues: The tracer-bullet Checkpoint comes after the expand–contract subsection, so the last thing the reader saw before it is a different idea.

**tdd**: pending issues of check round 3 fixed (lean finish). 25 fixes applied across this run and the resume run; 1 declined.
- declined: quiz low 7: in scenario-clock, replace 'wait 31 days' with 'Nothing: use the real clock and today's date'. Why: The suggested replacement would create a second defensible answer: a test can use the real clock and simply create a task whose finished date is 31 days in the past, without faking anything.
- low (accuracy, r3) Why it matters: As written, this says any Skill can load when your request matches its description.
- low (accuracy, r3) Final test: This says the review does the refactoring.
- low (accuracy, r3) How Matt and others use it: The cited source, Discussion #1136 and Warshoow's comment there, only says the prompt "names the skills in full".
- low (accuracy, r3) Good tests and the three bad ones: The comment suggests the two tests differ in where their number comes from.
- low (accuracy, r3) The idea: red: "The test after next" means two tests ahead, so read literally it allows code for the very next test.
- low (reader, r3) A session: The prose sets up the Scene by saying the agent uses glossary words like Comment in test names.
- low (reader, r3) Why it matters: As a general definition, this says any Skill can start when your request matches its description.
- low (reader, r3) Good tests and the three bad ones: A reader applying line 135's test (where does the expected value come from?) to `expect(MAX_BODY).toBe(2000)` finds that its 2000 is the limit you asked for in the opening story.
- low (reader, r3) Fake only at the edges: Two sentences apart, the Lesson says the Lessons-module tests use folders of fake Lessons, then that 'the tests always' talk to Postgres.
- low (reader, r3) Common mistakes: Line 40 defines a slice as one behaviour, one test and one small piece of code.
- low (quiz, r3) Final test: Two problems in one stem.
- low (quiz, r3) Final test: Weak distractor.
- low (quiz, r3) Final test: The feedback answers a check the stem never describes.
- low (quiz, r3) Fake only at the edges: The stem marks only the payment and SMS services as "run by other companies".
- low (quiz, r3) Final test: Here "it" means the refactoring, so the feedback says the review refactors.
- low (review, spec) tdd: This is the only Part 2 Common mistakes list with no line pointing back to the mistakes the body teaches.

**implement**: next step was check round 3; not run (lean finish), as round 2's issues were all fixed. 30 fixes applied across this run and the resume run; 6 declined.
- declined: acc-skills 14 suggests writing that the author typed /mattpocock-skills:to-spec, /mattpocock-skills:to-tickets and /mattpocock-skills:implement-spec Why: Only the session log backs that, and the Site story rule allows repo facts only.
- declined: reader 19 suggests keeping '13 findings' if the session log or PR #9 confirms it Why: No repo file or commit holds 13.
- declined: spot-on-main option b (a review before /implement) is also weak (part of the medium spot-on-main issue) Why: The checker's fix only replaces d, and I did that.
- declined: low (saved, not pending): spot-midrun-review stem retells the body bullet; checker's new stem adds 'with two tickets still in their worktrees' Why: That stem puts the right answer's defining phrase ('two tickets still hadn't landed') into the prompt, which gives the answer away.
- declined: low (saved, not pending): Colin Eberhardt bullet dates the write-up, not the rebuild Why: The fix adds 2 words to a Lesson above 2,850 words, and the medium fixes needed the word room.
- declined: low (saved, not pending): cut 'checking one finished branch at the end suits you' from the scenario-pick-spec-run stem Why: Not needed: the stem doesn't count toward the word budget, and once the right answer was no longer the shortest option, the clause doesn't decide the answer.
- low (quiz, r2) Human-in-the-loop or AFK: This tests the same misconception as Final test scenario-afk-task option c ('on your laptop with every permission prompt off').
- low (quiz, r2) Final test: The stem retells the body's bullet step by step: missing features listed, extra work started, a second review.
- low (quiz, r2) Checkpoint `two-terminals`: Both are weak distractors.
- low (quiz, r2) Final test: The stem already rules out options b and d through the frontier, parallel helpers and 'rather not start each ticket yourself'.
- low (accuracy, r2) Building a whole spec: The docs give a two-part instruction: check only the fixed findings, then stop.
- low (accuracy, r2) Site story:: The one place /to-spec 1.3.1 stops to check with the user is its proposed seams.
- low (accuracy, r2) The idea: "just write the code" is a quote from the AI Hero /implement docs with no attribution.
- low (accuracy, r2) How Matt and others use it:: The blog post is dated 19 October 2026 but never says when the rebuild happened.
- low (reader, r2) Try it yourself: The condition misses the case where no two-axis review appeared at all, and then the checklist item "A review with two parts...
- low (reader, r2) Building a whole spec: The round 1 fix at line 69 defined "finished" inside `/implement-spec` as "landed (merged into the run's shared branch)".
- low (reader, r2) Try it yourself: The checklist asks the reader to confirm that "`main` still holds only the setup work".
- low (reader, r2) Cheat sheet:: "Commit" reads as a step the reader must do.
- low (reader, r2) Checkpoint ticket-still-open: `/triage` appears nowhere else in the Lesson, so a cold reader can't weigh this option.
- medium (review, standards) implement: A cold reader meets 'the model' with no explanation.

**code-review**: pending issues of check round 3 fixed (lean finish); round 3's accuracy check not run. 32 fixes applied across this run and the resume run; 10 declined.
- declined: quiz medium (scenario-fixed-point): suggested new feedback saying that with no fixed point the Skill 'falls back on one already mentioned in the conversation, as in the Site story' Why: SKILL.md:19 says 'If they didn't specify one, ask for it.' The fallback is only in a session log, so it can't be taught or cited.
- declined: acc-skills low 6: suggested Site story clause 'the Skill should have asked; the agent skipped that because it had suggested one earlier' Why: The evidence is session log 8230810b entry 2781, which the Site story rule forbids.
- declined: acc-skills low 7: suggested Scene source list taken from the session log's Standards brief (including docs/agents/domain.md) Why: What the real brief listed is LOG-only.
- declined: reader medium 9: suggested fix 'run `git add -A && git commit -m ...` yourself' Why: This conflicts with the one-command-per-line override (PowerShell 5.1 has no &&).
- declined: Suggested fix for the clean-session medium: introduce 'the main agent' in the body Why: I fixed the issue a cheaper way.
- declined: low (reader): rewrite the /retro sentence in the Standards section to say it is user-invoked Why: This wasn't in the pending list, and the fix adds words while the Lesson was above 2,850.
- declined: low (reader): Cheat sheet /retro row wording ('before you /clear' / 'old session's log') Why: This wasn't pending, and round 1 already chose this wording on purpose to match the course fact ('Run /retro in the session it reviews, before /clear').
- declined: low (reader): add 'git log --oneline' to 'Name the fixed point' Why: This wasn't pending, and it adds about 15 words while the Lesson was over the 2,850 threshold.
- declined: low (quiz): predict-wrong-feature b feedback should name no category Why: Option b itself says 'missing pickup', and no pickup path exists at all, so 'missing' is the right category.
- declined: medium (reader) part 3: in Manual mode a reviewer's `git diff` brings up a permission prompt, so step 7 should say 'If a reviewer asks to run a `git` command, choose Yes' Why: The evidence is wrong.
- low (reader, r3) The idea:: The prose gives one axis and stops.
- low (reader, r3) The Spec axis: The Lesson never says what `/setup-matt-pocock-skills` is: a Skill, something run once, or something the Visitor should have done.
- low (reader, r3) How Matt and others use it:: Three Final test stems depend on 'merge' ('Before merging', 'before merging', 'Raj merges'), and the Lesson never uses or explains the word in that sense.
- low (reader, r3) A session: 'Resolves' is Git jargon a cold reader won't know.
- low (reader, r3) The idea:: A beginner can't tell what would be spent: money, time or tokens.
- low (quiz, r3) Final test sequence-review-ticket: In both questions the right option is the strictly shortest.
- low (quiz, r3) Final test scenario-new-findings: The right option never says to act.
- low (quiz, r3) Final test spot-uncommitted: Two Final test questions, checked together on one page, use the same HEAD-versus-main misconception, and their feedback is nearly identical.
- low (quiz, r3) Final test scenario-bug-hunt: The feedback doesn't name the real error in c ("writes a test for every possible bug"), and it narrows /tdd to new behaviour.

**pr-and-ship**: pending issues of check round 3 fixed (lean finish). 27 fixes applied across this run and the resume run; 5 declined.
- declined: quiz low spot-merge-then-test: suggested distractor 'The preview's database branch is deleted the moment you merge', with feedback 'The preview is still there' Why: No repo fact or source in hand says whether this site's Neon/Vercel setup keeps or deletes preview branches on merge, so that feedback could teach something false.
- declined: quiz MEDIUM spot-claim-evidence: suggested Evidence text 'Fixed. Why: 'types clean' is jargon the Lesson never explains (reader lens), so I shortened it to 'Fixed.
- declined: medium, accuracy: 12-main-flow.md:322 and 09-implement.md:297 say flatly that `/pr` wrote PR #9's body, which conflicts with this Lesson's hedge. Why: The fix belongs in 12-main-flow.md and 09-implement.md.
- declined: medium, reader: duplicate of the item above. Why: Declined for the same reason.
- declined: Issue 4, the weaker part: options that open with "Nothing:" in spot-claim-evidence, spot-text-door and spot-merge-then-test are always wrong. Why: A "Spot the mistake." stem already says there is a mistake, so a "Nothing:" option is wrong by the stem itself, however it's worded.
- low (accuracy, r3) Idea section: These lines follow Matt's docs page sentence by sentence and only swap a few words.
- low (accuracy, r3) How Matt and others use it: The talk was given at AI Engineer Paris, which ran on 23–24 September 2026.
- low (accuracy, r3) Site story: The old journal Lesson backs this wording, but git history shows two exceptions.
- low (accuracy, r3) Site story: PR #6 doesn't fit.
- low (reader, r3) Your part: The Lesson tells the reader to check the agent's door call against the change, and the right answer to scenario-review-effort (line 360) is "a quick skim".
- low (reader, r3) Goals: This contradicts the Lesson itself.
- low (reader, r3) How a change ships: Two terms reach a cold reader without a clause.
- low (reader, r3) Your part: The glossary term "Built-in command" appears nowhere in the Lesson.
- low (reader, r3) Checkpoint door-lasting-fix: This is close to a straight lift from Matt's pr docs page, without quotation marks.
- low (quiz, r3) Checkpoint body-only: The reader meets "draft PR" here before the Lesson explains it at line 207 ("a draft (marked not ready for review)").
- low (quiz, r3) Final test scenario-stale-body: The stem repeats the trigger words of the Your part bullet at line 203 ("Ask for a rewrite after big changes"), and the right answer repeats its action ("rewrite the body").
- low (quiz, r3) Final test spot-prose-summary: Two of the three distractors make the same weak suggestion (keep the prose and add more: a screenshot per paragraph, or a fifth paragraph).

**main-flow**: pending issues of check round 2 fixed (lean finish). 27 fixes applied across this run and the resume run; 1 declined.
- declined: The quiz checker's suggested replacement for Checkpoint next-ticket, a messy ticket 2 where the right move is '/retro here, then /clear, then /implement ticket 3'. Why: It tests the same rule as the Final test question spot-retro-next-day (run /retro in the session before clearing).
- low (accuracy, r2) On-ramps: The Lesson says /diagnosing-bugs always adds a regression test.
- low (accuracy, r2) Who can type what: "Some harnesses" suggests Claude Code might not be one of them.
- low (accuracy, r2) The map: Fork A tells the reader to type the short name `/prototype`, which can hit Claude Code's hidden Built-in of the same name.
- low (accuracy, r2) Phase boundaries: The paragraph reads as Matt's definition, but PHASE-BOUNDARIES.md only says phases are fuzzy and end when you think "ok, we're done with that".
- low (accuracy, r2) How Matt and others use it: The post is dated 19 October 2026, but it doesn't say when the rebuild happened.
- low (reader, r2) Phase boundaries: The reader isn't shown how to give the instruction: typed on the same line, after `/compact`.
- low (reader, r2) Try it yourself: Step 1 runs `git init`, but the prerequisites name only Claude Code.
- low (reader, r2) Fork A: The reader is told to type `/prototype` 130 lines before learning that the short name can fail.
- low (reader, r2) Goal 4: "Side road" never appears in the body.
- low (reader, r2) Whole Lesson: the word budget: Lint counts 2,977 prose words against a 3,000 limit, so the medium fixes above (about +40 words) would fail lint unless something is cut.
- low (quiz, r2) Final test: The Visitor notices the bug, so nothing about it is in the grilling conversation, and a handoff file would carry nothing useful to the fix.
- low (quiz, r2) Final test: Option c tests the same misconception as spot-triaged-own-tickets, and its feedback (shown under "Show the answer") states that question's answer outright.
- low (quiz, r2) Final test: This is recall, not transfer.
- low (quiz, r2) Checkpoint mid-phase: Wording tell.
- low (quiz, r2) Final test: The two feedbacks pull against each other.
- medium (review, standards) main-flow: The main flow defines repo as a Git-tracked folder, then makes 'repo' the test for choosing `/grill-me` over `/grill-with-docs`.
- medium (review, standards) main-flow Final test sequence-multi-session: Possible Duplicated Code.
- low (review, standards) main-flow: The clause 'no spec has' drops its verb, so a cold reader stalls on the sentence that tells them what to do about seams on the short road.
