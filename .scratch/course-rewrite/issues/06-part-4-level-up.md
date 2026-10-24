# 06: Part 4, Level up

**What to build:** Lessons 16–19: `architecture`*, `retro`* (with `/writing-for-agents`), `wayfinder`* (with `/research` and `/to-questionnaire`), `models-effort-ultracode`.

**Blocked by:** 02

**Status:** resolved

- [x] Four Lessons in the contract format, each passing the three lenses
- [x] Model, effort and ultracode facts dated and sourced from Claude Code's docs

## Comments

### 2026-10-24: revision finished (lean) and Part reviewed

Every Lesson here passes the draft lint and `npm run test:content`. The revision ran as the handoff's lean finish: each Lesson's pending issues got one more fix, with no further check rounds and no separate course-wide critics. Each Part instead had a two-axis `code-review` (Standards with the critics' quote, Site story and cross-Lesson checks folded in, and Spec): standards 0 high, 2 medium, 8 low; spec 0 high, 2 medium, 5 low. Highs were fixed in the main session; what's below stays open. Full records: `review/run-2026-10-24b/<slug>.json` (with `earlierRecord`), `lean-fix.json` and `part-review.json`.

**architecture**: pending issues of check round 1 fixed (lean finish). 14 fixes applied across this run and the resume run; 0 declined.
- low (accuracy, r1) Checkpoint reference-not-driver: The note in the stem says to "finish designing the payment module", so designing interfaces is exactly what it asked for.
- low (accuracy, r1) Two tests for any design: The route also answers the GET request that lists a Lesson's Comments, so the caption describes only half of what it does.
- low (accuracy, r1) The words: The Skill gives consistency as its reason, not shorter conversations.
- low (reader, r1) Try it yourself: The step only covers a reader who starts in auto mode.
- low (reader, r1) Site story: In a Lesson where "Comment" is the glossary term for a Visitor's note, "its own comment" (a code comment, which the Lesson never explains) reads as if the route posted a Comment.
- low (reader, r1) How Matt and others use it: A cold reader will picture a human judge.
- low (reader, r1) Final test spot-removed-seam: The Lesson defines an interface as everything a caller must know (line 33), not a block of code you can delete.
- low (reader, r1) How Matt and others use it: The body never says what "1.3.1" is.
- low (quiz, r1) Final test spot-removed-seam stem: The stem uses "interface" in the TypeScript-keyword sense.
- low (quiz, r1) Final test scenario-settle-words stem: In the vocabulary being tested, a helper function is already a module ("at any size: a function"), so the stem contradicts the words it asks about.
- low (quiz, r1) Final test spot-all-speculative right option: The right option repeats the body's sentence ("it found nothing worth doing"), so it's a wording tell; the other options don't use that phrasing.
- low (quiz, r1) Checkpoint reference-not-driver right option: The option says the Skill has "no steps", but the body says the agent in issue #449 "reached for the design-it-twice steps".
- low (quiz, r1) Checkpoint shallow-library: The feedback's own definition cuts against it.
- medium (review, standards) architecture: This contradicts another Lesson.
- low (review, standards) architecture lines 106: The same term is spelled two ways within Part 4, and the glosses differ too ("a fresh memory" vs "its own fresh context window").
- low (review, standards) architecture: Possible Mysterious Name or Divergent Change (judgement call).
- medium (review, spec) architecture: Architecture links only to Start here, Diagnosing bugs, Wayfinder and The main flow.
- low (review, spec) architecture: Matt's router names `/grill-with-docs` as where a survey's idea joins the Main flow, and The main flow Lesson teaches that rule.
- low (review, spec) .scratch/course-rewrite/review/run-2026-10-24b/{architecture: The ticket's first acceptance item requires each Lesson to pass the three lenses.

**retro**: next step was check round 2; not run (lean finish), as round 1's issues were all fixed. 13 fixes applied across this run and the resume run; 4 declined.
- declined: acc-sources medium (Scene scope): suggested intro text 'across several of his projects' Why: Applied the batch-of-sessions fix but left out 'several projects'.
- declined: acc-skills low (Scene labels): suggested caption 'each still falls under one of the seven categories' Why: Not added.
- declined: quiz medium (predict-stale-init): the stem's 'written by /init' next to 'renamed two files' echoes the body sentence, so it tests recall Why: Only the option fix was applied.
- declined: quiz medium (scenario-which-skill), optional part: reword option c to avoid 'because an agent reads that file' Why: Not applied.
- low (accuracy, r1) How Matt and others use it: This sets a firmer limit than the Skill does, and Matt's own talk describes pointing retro at a PR with its session, or at a week of PRs and reviews.
- low (accuracy, r1) Writing for agents: This misreads the source.
- low (accuracy, r1) Why it matters: This clashes with the next sentences and with the docs.
- low (accuracy, r1) Final test: This reuses, without quotation marks, the AI Hero docs sentence the Lesson already quotes on line 55.
- low (accuracy, r1) Sources: The dates are right, but the cited CHANGELOG doesn't hold them.
- low (reader, r1) Steering files: This repeats the routing already given in goal 2, line 55, the flow Scene, Common mistakes and the Cheat sheet.
- low (reader, r1) Try it yourself: /retro may search the session logs, which sit outside the practice folder.
- low (reader, r1) Try checklist: Step 5 already loads /writing-for-agents in this same session, and step 4 can trigger it too, because it's model-invoked for CLAUDE.md edits.
- low (reader, r1) Your part: A Visitor who barely uses Git learns how to spot uncommitted changes but not what to do about them.
- low (reader, r1) Writing for agents: "Picks it up on its own" reads as a guarantee.
- low (quiz, r1) Checkpoint reviewer-has-room: The right option says the reviewer "only reads a diff", yet the question is about the reviewer reading 900 lines of rules.
- low (quiz, r1) Checkpoint untraceable-candidate: The stem rules out the session but says nothing about the repo, yet the right answer also claims the repo gives no support.
- low (quiz, r1) Checkpoint no-op-test: "Be careful" is the textbook weak leading word, the same as the Lesson's "be thorough".
- low (review, standards) all four Lessons: retro 2: All four Lessons are within the lint's 3,000-word limit but above the writing guide's 2,300–2,800 aim, which exists to leave margin.
- low (review, standards) retro: Possible Duplicated Code (judgement call).
- low (review, standards) retro: Possible Duplicated Code (judgement call).

**wayfinder**: next step was check round 2; not run (lean finish), as round 1's issues were all fixed. 12 fixes applied across this run and the resume run; 2 declined.
- declined: Issue 4's suggested Scene wording, 'Started a research agent on the Next.js ticket and marked it `Status: claimed`'. Why: In wayfinder/SKILL.md:115 (charting step 5), the agent starts the research subagents and records their findings on a branch, with no claim or assign step.
- declined: Issue 3's full suggested sentence for the Git requirement, about 40 extra words with the install steps for Mac and Windows. Why: Start here already gives those install steps, and the Lesson defines Git at line 38.
- low (accuracy, r1) Session one: The Skill runs a second grilling, breadth-first, and a grilling keeps asking rounds until its frontier is empty.
- low (accuracy, r1) Common mistakes: The duplicate is a nested agent that the background research agent started, not one your session started.
- low (reader, r1) The idea: A cold reader may think the map's own Notes already answer its Slug ticket, "Does a Spanish Lesson keep its English Slug?".
- low (reader, r1) Final test: In a Lesson where "ticket" means a tracker item, "ticket-booking app" (event tickets) adds needless confusion.
- low (reader, r1) How Matt and others use it: Line 219 tells the reader that AI Hero holds Matt's docs, "his teaching site".
- low (reader, r1) Try it yourself checklist:: By the end of step 8 the ticket says `Status: resolved`, so the claim has been overwritten.
- low (quiz, r1) Final test: The prompt points out the missing Status line only for 03, which is the answer, and says nothing about 01's status.
- low (quiz, r1) Final test: The feedback claims more than the Lesson and ask-matt support.
- low (quiz, r1) Final test: The prompt uses "fact", which echoes the Lesson's key phrase for `/research` (cheat sheet "An outside fact", goal 4 "send an outside fact to `/research`").
- low (quiz, r1) Final test: Weak distractor.
- low (quiz, r1) Checkpoint grill-the-send: A sharp reader can argue with this feedback, because tax rules are written down in public guidance.
- low (review, standards) wayfinder: The only `/exit` is inside an optional step.
- low (review, standards) wayfinder: This site's Comments appear in lowercase, while the GLOSSARY term is capitalised and the other Part 4 Lessons capitalise it ("posts a Comment", "every Comment").
- low (review, spec) wayfinder line 85: This is the same partial miss as Architecture, but milder.

**models-effort-ultracode**: next step was check round 2; not run (lean finish), as round 1's issues were all fixed. 9 fixes applied across this run and the resume run; 3 declined.
- declined: quiz medium: effort-low-means key 'more questions to you' (and body line 'Claude would rather ask you than dig on its own') said to be unsupported by the cited sources Why: The Lesson's cited Anthropic blog (https://claude.com/blog/claude-model-and-effort-level-in-claude-code, July 7, 2026) says nearly this: at lower effort Claude would rather ask you for more context than spend tokens working it out on its ow
- declined: acc-skills high fix suggestion: add 'That's ordinary sub-agents, not a dynamic workflow' about the /implement-spec run Why: I didn't add this.
- declined: reader medium: 'the best model' in the Grilling Lesson (content/lessons/04-grilling.md line 215) clashes with this Lesson's `best` alias, which means Fable. Why: The suggested fix is in content/lessons/04-grilling.md, and this task allows edits only to 19-models-effort-ultracode.md.
- low (accuracy, r1) Fast mode: Claude Code's own docs label `/code-review` as a bundled **Skill**.
- low (accuracy, r1) Cheat sheet:: Only Pro and Max accounts get the 3 free runs.
- low (accuracy, r1) Final test spot-ultracode-left-on: "Often several per request" overstates the docs, which say only that one request can turn into several workflows.
- low (accuracy, r1) Model or effort? Reading a bad result:: The edge-cases-versus-wrong-approach finding comes from his read of Anthropic's Terminal-Bench 3.0 runs, not from his own three test builds.
- low (reader, r1) ## Try it yourself: The comparison is confounded.
- low (reader, r1) ## Ultracode: A Pro reader is told the two ways to use ultracode (lines 164-165) before learning that neither works until a setting is changed.
- low (reader, r1) Checkpoint ultracode-one-task: This feedback says less than the truth, and it pulls against goal 1/2's saved-versus-session lesson.
- low (reader, r1) Sources: The timestamp is wrong.
- low (reader, r1) Opening promise line 11: A cold reader meets "Claude Code" in the first sentence, but it isn't defined until line 22.
- low (quiz, r1) Final test scenario-skipped-tests: The right option is the only hedged one: it names two levels where every distractor names one move.
- low (quiz, r1) Checkpoint ultracode-one-task: The feedback understates what typing a level does.
- low (quiz, r1) goals: No Final test question checks the first part of this goal, setting effort with `/effort`: typing a level versus pressing `s` in the slider, or `/effort auto`.
- low (quiz, r1) Checkpoint ultracode-one-task option b feedback: The Checkpoint still gives away the Final test answer.
- medium (review, standards) models-effort-ultracode: The Checkpoint and the Final test question are mirror images of the same choice: keyword for one task versus `/effort ultracode` for the session.
- low (review, standards) models-effort-ultracode: No Final test question checks the first clause, setting effort with `/effort`: typing a level saves it, while `s` in the slider is session-only.
- low (review, spec) models-effort-ultracode: The ticket asks for model, effort and ultracode facts that are dated.
- low (review, spec) models-effort-ultracode: `/code-review` is the only one of the Lesson's commands it calls a Built-in command (line 201).
