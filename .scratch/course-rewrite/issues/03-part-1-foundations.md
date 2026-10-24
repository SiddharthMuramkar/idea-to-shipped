# 03: Part 1, Foundations

**What to build:** Lessons 0–3: `start-here` (with a `/teach` tip), `how-agents-work`*, `context-window`*, `skills`*.

**Blocked by:** 02

**Status:** resolved

- [x] Four Lessons in the contract format, each passing the three lenses
- [x] Claude Code facts dated and sourced from its official docs
- [x] `/setup-matt-pocock-skills`, `/ask-matt` and `/handoff` taught where the course map places them

## Comments

### 2026-10-24: revision finished (lean) and Part reviewed

Every Lesson here passes the draft lint and `npm run test:content`. The revision ran as the handoff's lean finish: each Lesson's pending issues got one more fix, with no further check rounds and no separate course-wide critics. Each Part instead had a two-axis `code-review` (Standards with the critics' quote, Site story and cross-Lesson checks folded in, and Spec): standards 0 high, 3 medium, 8 low; spec 0 high, 1 medium, 3 low. Highs were fixed in the main session; what's below stays open. Full records: `review/run-2026-10-24b/<slug>.json` (with `earlierRecord`), `lean-fix.json` and `part-review.json`.

**start-here**: pending issues of check round 3 fixed (lean finish). 31 fixes applied across this run and the resume run; 5 declined.
- declined: Low: Part 1 bullet should gloss 'working memory' as the context window (+3 prose words) Why: This low was only saved, not pending.
- declined: Low: Try step 5 gaps (the trust prompt again, when to /exit, explaining ls and ~), about +25 prose words Why: This low was only saved, not pending.
- declined: Low: the Site story's last line should also say /to-spec then /to-tickets would replace row 3 Why: This low was only saved, not pending.
- declined: Low: the Site story should say 'a separate copy for my laptop, for tests, for each pull request and for the live site' (+6 words) Why: This low was only saved, not pending.
- declined: Low: the flow Scene build caption 'Either way, /implement' leaves out /implement-spec Why: This low was only saved, not pending.
- low (accuracy, r3) Try it yourself: `/teach` writes MISSION.md only once it has a clear reason from you, so it can take more than one answer to get there.
- low (accuracy, r3) How to read a Lesson: The label covers more than Skill sessions.
- low (accuracy, r3) The four Parts: In Matt's Main flow, `/handoff` bridges the prototype detour in both directions.
- low (reader, r3) Learn anything with `/teach`: The worked example doesn't follow the Lesson's own advice.
- low (reader, r3) What you need: Two problems in one place.
- low (reader, r3) The four Parts: I'm re-raising a declined low because its reason is wrong.
- low (reader, r3) How to read a Lesson: This Lesson's first Scene is "Setting up on a Mac (illustrative)".
- low (quiz, r3) Final test scenario-which-part: The prompt repeats the phrase that defines the right answer.
- low (review, standards) start-here: Possible Duplicated Code.
- low (review, standards) start-here line 26; how-agents-work lines 26 and 40; skills : Possible Duplicated Code.
- low (review, spec) start-here: goal 4: The spec, the ticket and the brief all ask for a tip.
- low (review, spec) start-here: Start here has no "Common mistakes" section and no "How Matt and others use it" section.

**how-agents-work**: next step was check round 3; not run (lean finish), as round 2's issues were all fixed. 26 fixes applied across this run and the resume run; 3 declined.
- declined: reader LOW (Try step 3): suggested naming `ls`, `find` and `grep` as commands the agent might ask to run in Manual mode Why: Those are on Claude Code's built-in read-only list and never ask in Manual (permission-modes docs; the Lesson says the same), so the examples would contradict the body.
- declined: quiz MEDIUM (claude-md-line): suggested replacement Checkpoint about a rule lost after /compact, with 'One line in the project's CLAUDE.md' as the answer Why: That answer would duplicate the Final test question scenario-repeat-correction.
- declined: acc-sources LOW (Try checklist): suggested `git clean -fd` to remove new files Why: Too risky for a Visitor who barely knows git (it permanently deletes untracked files).
- low (accuracy, r2) CLAUDE.md: standing instructions: The rule is incomplete, and the gap bites a reader who follows this same section.
- low (accuracy, r2) Rewind: stepping back: This leaves out what shell mode does next.
- low (accuracy, r2) Permission modes: The current docs put the desktop app's mode selector somewhere else.
- low (accuracy, r2) Permission modes: The claim is absolute, and the docs list exceptions.
- low (accuracy, r2) Tools: what the agent can reach: "Never" overclaims for searches.
- low (reader, r2) Whole Lesson: word budget: The Lesson is 25 words under the lint cap, so the medium fixes above (about +14 net) leave almost no margin.
- low (reader, r2) Permission modes:: A reader who has just left auto mode isn't told how to get back to it.
- low (reader, r2) CLAUDE.md table:: The Lesson says to keep the file out of git but not how.
- low (reader, r2) Rewind Scene:: The Scene shows six menu items, and the reader will meet the same six in Try step 7.
- low (reader, r2) Tools:: Two lines earlier the Lesson defines a plugin as "an add-on you install" (line 86).
- low (quiz, r2) Final test: The stem (line 449) says nothing about a new session or auto mode.
- low (quiz, r2) All ten Final test blocks: The answer key runs in a strict cycle.
- low (quiz, r2) Checkpoint fresh-session-edits: Half of this distractor is what the body teaches.
- low (quiz, r2) Final test: The three wrong options share one sentence pattern, "<claim>, so <consequence>": "…, so it cuts only the edit prompts", "…, so which mode she picked doesn't matter", "…, so she should have written more of them".
- low (quiz, r2) Final test: The right option rewords the body's bullet (line 225: "files changed only by shell commands").
- low (review, standards) how-agents-work Site story: Possible Duplicated Code.
- low (review, standards) how-agents-work lines 88: Part 1 spells the term two ways.
- low (review, standards) how-agents-work: The writing guide says to aim for 2,300–2,800 words, below the 3,000 lint cap, to leave margin.
- low (review, standards) how-agents-work: The writing guide says video sources need the title, URL, publish date and the timestamps used.
- medium (review, spec) how-agents-work: How coding agents work teaches sessions, tools, sub-agents, Built-in commands, auto memory and the three CLAUDE.md files.
- low (review, spec) how-agents-work: This Site story retells the HANDOFF.md move to a new machine.

**context-window**: pending issues of check round 2 fixed (lean finish). 21 fixes applied across this run and the resume run; 1 declined.
- declined: The MCP plug-ins issue also asked to change 01-how-agents-work.md:88, which still reads 'MCP servers (plug-ins that connect the agent to outside systems)'. Why: Out of scope: this fixer may edit only content/lessons/02-context-window.md.
- low (accuracy, r2) The idea: tokens and the window: The table's rows still don't add up to the total the text gives.
- low (accuracy, r2) Subagents paragraph: The example prompt names a function that doesn't exist in this site's code, and Try it has the Visitor clone that code.
- low (accuracy, r2) Scene meter caption: These percentages ignore the 33k autocompact buffer.
- low (accuracy, r2) Scene chat: The grilling agent doesn't ask questions in the 1.3.1 format: numbered rounds with a recommended answer on its own line.
- low (accuracy, r2) The idea: tokens and the window: This describes the film wrongly, and Matt doesn't put it that way.
- low (reader, r2) The idea: The round-1 fix said the numbers now add up, but they still don't.
- low (reader, r2) At a Phase boundary: Line 120 has just said `/resume` lets you switch back to the old conversation.
- low (reader, r2) /handoff section: reason 2: The prototype detour appears under two reasons: as the usual case of reason 2 (another folder) and as the example of reason 4 (fork a side task and keep working).
- low (reader, r2) Tools for a crowded window: Right after any compaction, Claude Code re-reads up to five of the files the session read and shows them as Read lines.
- low (reader, r2) Try it yourself: On Windows the file lands in %TEMP% (C:\Users\<name>\AppData\Local\Temp).
- low (quiz, r2) Checkpoint startup-tokens: The feedback says handoffs exist to carry the last session into the next one.
- low (quiz, r2) Final test spot-rule-in-chat: The logic is aimed at the wrong half.
- low (quiz, r2) Final test spot-louder-rule: It reuses the quality-not-size Checkpoint's situation almost word for word (a naming rule set early on, now ignored).
- low (quiz, r2) Final test spot-rule-in-chat: The scenario has a second Lesson-named mistake besides where the rule lives: running for hours and letting auto-compact pick the moment.
- medium (review, standards) context-window: The Checkpoint and the Final test question test the same idea: at a boundary, question 1 says yes, so carry on.
- medium (review, standards) context-window: A cold reader meets several terms before this Lesson explains them, or without it ever explaining them.

**skills**: pending issues of check round 3 fixed (lean finish); round 3's accuracy check not run. 35 fixes applied across this run and the resume run; 7 declined.
- declined: Lesson-specific note: the plain-words 'grilling with docs' slip and the author typing /mattpocock-skills:code-review were drafted from session logs and should be cut Why: The repo holds both, so I kept them, matched to the journal's wording.
- declined: acc-skills medium (plugin 'read-only'): remove the word 'read-only' everywhere Why: Partly applied.
- declined: low (savedR2Lows): explain ~ as the home folder after the Skills table Why: The Lesson is near the 2,850-word ceiling and this adds words for a low.
- declined: low (savedR2Lows): add '/reload-skills again after each later change' Why: Try it step 4 already has the reader restart Claude Code, so the folder is watched after that.
- declined: low (savedR2Lows): reword why-light-context's right option and make sequence-new-repo c test where setup writes Why: These are lows outside the pending list.
- declined: reader low: line 168, add 'and push them (send them to GitHub)' so a commit reaches clones Why: This adds 6 words for a low, and the Lesson is at 2,847, at the edge of the 2,850 ceiling.
- declined: quiz low: why-light-context overlaps the what-loads-early Checkpoint; rewrite it to test the flag's context cost Why: This is a low outside the pending list.
- low (reader, r3) Lost? Ask the router: The Lesson is at 2,846 prose words, above the guide's 2,800 target, and the three medium fixes above add 19 words.
- low (reader, r3) The idea: 'That March video' points back to a video the reader never met.
- low (reader, r3) Set up each repo once: Skills don't read CLAUDE.md.
- low (reader, r3) Set up each repo once: For a reader who barely uses Git, a commit (glossed at line 30 as 'a saved snapshot of your project in Git') stays on their own computer.
- low (reader, r3) Installing Matt: The list after the colon has no verb, so it reads as if Matt used both scopes.
- low (quiz, r3) Final test: The stem doesn't name an install route.
- low (quiz, r3) Final test: The feedback, and option c's own premise ('can't reach plugin Skills'), assume Kai installed Matt's Skills as the plugin.
- low (quiz, r3) Checkpoint what-loads-early: The Final test question re-asks the Checkpoint's fact (only name and description load until a Skill runs) with mirrored distractors.
- low (review, standards) skills: Possible Mysterious Name.
- low (review, standards) skills: "that video" refers back to the March 2026 video mentioned in the previous section (line 22), about 30 lines earlier.
