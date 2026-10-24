# Research note: `main-flow` (Lesson 12: the which-command-when capstone)

## Source map
All read on 2026-10-23.

| ID | Source | Date | What it covers | Timestamps / sections used |
|---|---|---|---|---|
| L1 | Local `skills/engineering/ask-matt/SKILL.md` at `/Users/siddharth/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/` | plugin labelled 1.3.1 (matches main; one line newer than the tag) | The Main flow, forks, on-ramps, context hygiene, smart zone, phase boundaries, standalones, precondition | whole file |
| L2 | Same folder: `ask-matt/PHASE-BOUNDARIES.md` | 1.3.1 (identical to the tag) | The five options and the ordered tree; primary vs secondary sources | whole file |
| L3 | Same folder: `docs/engineering/ask-matt.md`; https://www.aihero.dev/skills-ask-matt | published 2026-07-07, updated 2026-08-24 | Router behaviour; "says half the Skills aren't installed" bug; summary-vs-SKILL bug; "It's working if" | sections named |
| L4 | Same folder: `README.md` Reference, plus every `SKILL.md` frontmatter checked with `grep disable-model-invocation` | 1.3.1 | Who can start which Skill | full list below |
| L5 | Same folder: `docs/engineering/tdd.md`, `implement.md`, `implement-spec.md`, `code-review.md`, `pr.md` ("Where it fits") | 1.3.1 | The chain as the docs draw it | sections |
| L6 | https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md; `CHANGELOG.md` 1.3.0/1.3.1 | 2026-10-04/05 | `/retro` is now the last step; `/implement-spec` routed as the parallel option; after `/diagnosing-bugs`, run `/retro` | sections |
| V1 | "mattpocock/skills: A complete AI Coding workflow, end-to-end", https://www.youtube.com/watch?v=M6mYodf0dJM (auto-translated track) | 2026-07-16 (17:17) | The flow end to end; ask-matt; smart-zone budget; spec and tickets in one session; clear between tickets | 4:30–6:50, 6:52–8:30, 9:30–10:15, 10:15–11:00, 11:00–12:30, 13:45–14:30, 16:00–16:30 |
| V2 | "New Skills! v1.3 brings /pr, /implement-spec, and /retro", https://www.youtube.com/watch?v=BsJGo1wFTvQ | 2026-10-05 | Spec = destination, tickets = sessions; three loops; `/pr`; `/retro` | 0:25–1:08, 1:08–3:05, 5:28–5:40, 9:37–13:30 |
| V3 | AI Engineer workshop, https://www.youtube.com/watch?v=-QFHIoCo-Ko | 2026-04-24 | Smart zone / dumb zone; clear vs compact; human-in-the-loop vs AFK; day shift / night shift; QA | 0:03:00–0:04:00, 0:07:00–0:10:00, 0:26:00–0:27:00, 0:37:00–0:38:00, 0:53:00, 1:34:00 |
| D1 | AI Coding Dictionary: https://www.aihero.dev/ai-coding-dictionary/smart-zone, /clearing, /compaction, /afk, /human-in-the-loop | smart zone, clearing, compaction, AFK 2026-09-24; human-in-the-loop 2026-07-01 | Definitions; clear vs compact; compact at a phase boundary with an instruction | entries |
| C1 | developer.tenten.co v1.3 article | undated | Community mistake: running the whole pipeline for every task | "Avoiding the Heavy-Pipeline Trap" |
| R1 | Repo: `content/lessons/12-main-flow.md`; PR #9; `.scratch/main-flow-and-redesign/spec.md` and issues; `GLOSSARY.md` | 2026-10-22 | The author's Main flow run and his existing Lesson | as cited |

## Key facts (pinned to v1.3.1)

### The ordered map (L1)
0. **Once per repo:** `/setup-matt-pocock-skills` configures the issue tracker, triage labels and doc layout.
1. **`/grill-with-docs`:** sharpen the idea by interview. It keeps what it learns in `GLOSSARY.md` and ADRs. With **no working directory**, use `/grill-me` instead (it saves nothing). Both run the `/grilling` interview.
2. **Fork A: can every question be settled in conversation?** If one needs a runnable answer (state, business logic, a UI you have to see):
   - `/handoff` out;
   - open a fresh session and `/prototype` there;
   - `/handoff` back what you learned, and reference it from the original thread.
3. **Fork B: is this a multi-session build?**
   - **Yes** → `/to-spec` → `/to-tickets` (tracer-bullet tickets with blocking edges). Then either:
     - `/implement` per ticket, with `/clear` between each; or
     - `/implement-spec` for the whole spec: parallel subagents across the frontier, one integration branch.
   - **No** → `/implement` right here, in the same context window.
   - **Either way**, the code is built by driving `/tdd` and closed out with `/code-review` (Standards + Spec). `/implement` runs both per ticket; `/implement-spec` runs one review over the integration branch.
   - When the work goes up as a PR, **`/pr`** shapes the body. It's model-invoked.
4. **`/retro`:** after the build, especially a messy one. It suggests changes to the agent's **environment** (navigation pointers, automated checks, coding standards, steering files, tooling), not the code.

### Other routes (L1)
- **On-ramps:**
  - `/triage`: only for issues **you didn't create**. Don't triage tickets `/to-tickets` made.
  - `/diagnosing-bugs` for hard bugs, then `/retro` in the same session.
  - `/wayfinder` for huge, foggy efforts. It hands off at **`/to-spec`**, not straight to `/implement`.
- **Codebase health:** `/improve-codebase-architecture`. Its findings re-enter the flow at `/grill-with-docs`.
- **Vocabulary underneath:** `/domain-modeling`, `/codebase-design`.
- **Standalones:** `/grill-me`, `/grilling`, `/prototype`, `/research`, `/to-questionnaire`, `/wizard`, `/wait-what`, `/teach`, `/writing-for-agents`.
- **Router:** `/ask-matt` names what to type and stops. Where it disagrees with a `SKILL.md`, the `SKILL.md` wins (L3).

### Context hygiene (L1, L2)
- **Keep steps 1–3 in one unbroken context window.** Don't `/compact` or `/clear` until after `/to-tickets`, so the grilling, spec and tickets build on the same thinking. `/to-spec` writes from the conversation; it doesn't interview you again.
- **Each `/implement` then starts fresh**, working from its ticket.
- **Run `/retro` in the session it's looking back on, before you clear.** After clearing, point it at that session's log.
- **Smart zone:** about **150k tokens** on state-of-the-art models (ask-matt). If a session nears it before `/to-tickets`, don't push on degraded: `/compact` at the nearest phase boundary.
  - Matt's own number has drifted: about 100k in April 2026 (V3 0:04:00), about 140k in July (V1 10:15–10:30). The limit tracks quality, not the context window's size (D1). A 1M-token window mostly adds dumb zone (V3 0:37:00–0:38:00).

### Phase boundaries: what to do with the context (L2)
Decide **at** a boundary; mid-phase, either continue or split the remaining work into subagents. Ask these in order; the first yes wins:
1. **Continue?** Yes if the next phase needs this one as a primary source (grilling → implementation is the standard case), or the smart zone has room. Costs nothing, so rule it out first.
2. **`/clear`?** If everything here is disposable. It's the cheapest move, and the old session stays resumable. Getting it wrong is one-way: you lose the *why*.
3. **`/handoff`?** Only for a new harness, a new directory, a colleague, or forking a side task mid-phase. What it buys is portability.
4. **Subagent?** If the task can run AFK with no steering (automated review is the standard case).
5. **Otherwise `/compact`**, with an instruction (e.g. "we're going to QA this area"). It's the **default, not the first reach**.

Every option except Continue turns a primary source (the session) into a secondary one (a summary) (L2; D1).

### Who can type what (L4)
- **Only you can start these** (user-invoked, `disable-model-invocation: true`): `/ask-matt`, `/setup-matt-pocock-skills`, `/grill-with-docs`, `/grill-me`, `/handoff`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`, `/retro`, `/triage`, `/wayfinder`, `/improve-codebase-architecture`, `/wait-what`, `/teach`, `/to-questionnaire`.
- **The agent can also start these** (model-invoked): `/grilling`, `/domain-modeling`, `/prototype`, `/tdd`, `/code-review`, `/pr`, `/diagnosing-bugs`, `/research`, `/wizard`, `/codebase-design`, `/writing-for-agents`.
- A user-invoked Skill can call model-invoked ones, never another user-invoked one (L4 README).
- **Built-in commands** (Claude Code's own, not Skills): `/clear`, `/compact`. Claude Code's own `/code-review` is also a Built-in command, and it clashes with Matt's Skill (use `/mattpocock-skills:code-review`).
- **Known quirk:** some harnesses hide user-invoked Skills from the list the agent sees, so the agent may say they aren't installed. 16 of 27 plugin Skills carry the flag. They are installed; type them anyway (L3).

### How the docs draw the chain (L5)
`grill-with-docs → to-spec → to-tickets → implement → code-review → retro`, with `→ pr` before `retro` when shipping as a PR, and `implement-spec` as the parallel build step. The docs draw `code-review` as a step of its own; ask-matt nests it inside `/implement`.

### Newer on GitHub main
- `ask-matt/SKILL.md` on main (and locally) adds one line not in the v1.3.1 tag: read a Skill's `SKILL.md` before stating what it does or recommending a step be skipped. Unreleased changeset, 2026-10-07, fixes #614.
- `PHASE-BOUNDARIES.md` is unchanged.
- The ask-matt docs page still describes the summary-vs-SKILL bug as unfixed (L3); the Skill on main now addresses it.

## Day-to-day usage
- **Matt's habits** (V1):
  - Start with `/ask-matt` if you're unsure; it even tells you how to manage sessions (6:52–8:00).
  - His grilling sessions usually run around 20 questions (9:30).
  - He used auto mode, not plan mode (10:00).
  - After grilling he checks the token count against his smart-zone budget. Small → `/implement` straight away; multi-session → `/to-spec` and `/to-tickets` in the same session (10:15–12:30).
  - Then clear, and implement ticket by ticket, clearing between each (13:45–14:30).
- **Spec and tickets** (V2 0:25–1:08): the spec is the destination; the tickets are sessions sized so no single agent sinks into the dumb zone or hits auto-compact.
- **Clear vs compact** (V3 0:07:00–0:10:00): Matt says he dislikes compacting and prefers clearing, because a cleared session always starts from the same known state. That fits ask-matt, where `/compact` sits last in the tree.
- **Human-in-the-loop vs AFK across the flow** (V3 0:26:00–0:27:00, 0:53:00): planning must be human-in-the-loop; implementation can be AFK (day shift / night shift). QA is human and feeds new tickets back in (V3 1:34:00).
- **`/retro` should stay human-in-the-loop.** Don't automate it; run it on a sample of sessions, or on one that went wrong (V2 12:30–13:30).
- **Others:** the most common adoption mistake is running the whole pipeline for every task. Small, one-module changes skip `/to-spec`/`/to-tickets` (C1; matches ask-matt's "No → `/implement`").

## Common mistakes
- Clearing (or compacting) between grilling and `/to-spec`, which loses the *why* (L1, L2).
- Pushing on in the dumb zone instead of compacting at a boundary (L1; D1 smart zone).
- Compacting mid-phase, so the agent loses the thread (L2).
- Using `/handoff` as the general way to move between sessions. It's only for portability (L2, L3).
- Waiting for the agent to start a user-invoked Skill (L4).
- Saying "grill with docs" in plain words instead of typing `/grill-with-docs` (R1).
- Running `/triage` on `/to-tickets` output (L1).
- Running spec-and-tickets for a tiny change (C1, L1).
- Looping a wayfinder map straight into `/implement` instead of `/to-spec` (L1).
- Running `/retro` after clearing without pointing it at the old log (L1).
- Trusting ask-matt's one-line summaries over the Skill itself (L3).

## Try it yourself (~15–20 min)
1. In any repo, type:
```
/ask-matt I have a repo and a small idea: add a "copy link" button to each Lesson page. Just give me the sequence: what I type, in order, and where I should /clear or /compact.
```
2. Then type:
```
Now say the idea is a full quiz system with a database, too big for one session. Same question.
```
3. Without looking, draw the map on paper with both forks, then compare with this Lesson's diagram.

**It's working if:**
- [ ] Both answers start with `/grill-with-docs`.
- [ ] The small idea goes straight to `/implement` in the same window.
- [ ] The big idea goes `/to-spec` → `/to-tickets` → `/implement` per ticket with `/clear` between, or `/implement-spec`.
- [ ] It says not to clear or compact until after `/to-tickets`.
- [ ] It mentions `/pr` (automatic) and `/retro` (same session, before clearing).
- [ ] It stops after naming what to type, without starting the work.
- [ ] If you look at the trace, it reads the relevant `SKILL.md` before making claims (main-only behaviour).

## Site story (from the author's repo)
- **He built this very Lesson with the Main flow** (R1: `12-main-flow.md`, "What I typed"):
  1. "…you can start grilling with docs", typed in plain words;
  2. `/to-spec`, giving `.scratch/main-flow-and-redesign/spec.md`;
  3. `/to-tickets`, giving 5 tickets with blockers;
  4. `/implement-spec`, with helper agents in worktrees merged into the `main-flow-and-redesign` integration branch.
  - **He never typed `/clear`**: steps 1–3 stayed in one session, as the rule says.
- **What happened** (R1, "What happened"):
  - **The plain-words slip.** Because `/grill-with-docs` is user-invoked, the agent couldn't start it. It ran `/grilling` + `/domain-modeling` instead, the two halves `/grill-with-docs` is made of. Typing the Skill would have made it one step.
  - **Scope moved during grilling.** The Lesson's position changed (new Lesson 0 → last Lesson). Comments point at Slugs, so nothing broke. The redesign and the photos were added during grilling. Two new glossary terms came out of it: **Main flow** and **Built-in command**.
  - **He typed the next Skill instead of answering.** `/to-spec` asked him to confirm a design choice; he typed `/to-tickets` instead, so the spec used the agent's best guess. He then said no to the tickets at first, then typed `/implement-spec`. His regret: answer the open question first.
  - **The build ran itself.** Order: 01 → 02 → 03 and 04 together → 05. One merge conflict, in the shared credits file (issue 03 notes). An early review ran while 05 was still building.
  - **Review and PR.** About 15 review findings; one fix-up agent; then the PR. PR #9's body calls the door "two-way: content and CSS only".
- **His existing Lesson already has** a situation → command table, a who-starts-what list, the clear/compact rule, the smart zone (150k per ask-matt), and an old-to-new table mapping v1's `/grilling`, `/domain-modeling`, "write the spec", `/tdd` ×4, `/code-review`, `gh pr create` onto today's Skills (R1).

## Candidate quiz questions (up to 15 allowed)
**Q1 [sequence]** Put a multi-session build in order:
1. `/grill-with-docs`
2. `/to-spec`
3. `/to-tickets`
4. `/implement` per ticket, with `/clear` between
5. `/pr` writes the PR body
6. `/retro`

*Answer:* 1 → 2 → 3 → 4 → 5 → 6. *Source:* L1.

**Q2 [scenario]** You're planning a conference talk, with no repo involved. Which grilling Skill?
- A) `/grill-with-docs`
- B) `/grill-me` **(correct)**
- C) `/to-spec`
- D) `/wayfinder`

*Why:* With no working directory, use the version that saves nothing. *Source:* L1 step 1; Standalone.

**Q3 [scenario]** Mid-grilling, you realise you can't decide without seeing how a screen feels. What's the route?
- A) Keep grilling until you can decide
- B) `/handoff` out, `/prototype` in a fresh session, `/handoff` back **(correct)**
- C) `/to-spec`, then decide later
- D) `/implement` it and see

*Why:* A question that needs a runnable answer takes the prototype detour. *Source:* L1 fork A.

**Q4 [spot-the-mistake]** Right after grilling, someone types `/clear` "to start fresh", then `/to-spec`. What went wrong?
- A) Nothing; specs need a fresh window
- B) `/to-spec` writes from the conversation, so clearing threw away the reasoning it needed **(correct)**
- C) They should have used `/handoff`
- D) `/to-spec` must come before grilling

*Why:* Keep steps 1–3 in one unbroken window until after `/to-tickets`. *Source:* L1 Context hygiene; L2 Q2.

**Q5 [scenario]** You're still grilling, and the session is approaching the smart zone limit. What do you do?
- A) Push on and finish
- B) `/clear` and restart the grilling
- C) `/compact` at the nearest phase boundary, then carry on **(correct)**
- D) `/handoff` to a colleague

*Why:* Don't continue degraded; compact at a boundary, ideally with an instruction. *Source:* L1; L2 Q5.

**Q6 [scenario]** You just committed ticket 3 of 7 with `/implement`. What next?
- A) `/compact`
- B) `/clear`, then `/implement` ticket 4 **(correct)**
- C) `/handoff`
- D) `/retro`

*Why:* Tickets are self-contained, so the last one's context is disposable. *Source:* L1 step 3; V1 13:45–14:30.

**Q7 [scenario]** You're moving this work from Claude Code to Codex. Which option fits the boundary?
- A) Continue
- B) `/clear`
- C) `/handoff` **(correct)**
- D) `/compact`

*Why:* A new harness is one of the four reasons for `/handoff`. *Source:* L2 Q3.

**Q8 [sequence]** At a phase boundary, in what order do you ask?

*Answer:* Continue? → `/clear`? → `/handoff`? → subagent? → `/compact`. *Source:* L2 "The tree".

**Q9 [scenario]** Bug reports from Visitors are piling up. Which Skill?
- A) `/to-tickets`
- B) `/triage` **(correct)**
- C) `/implement-spec`
- D) `/grill-me`

*Why:* `/triage` is for issues you didn't create. `/to-tickets` output is already agent-ready. *Source:* L1 On-ramps.

**Q10 [scenario]** Which of these will the agent ever start on its own?
- A) `/to-spec`
- B) `/implement`
- C) `/tdd` **(correct)**
- D) `/retro`

*Why:* `/tdd` is model-invoked; the others are user-only. *Source:* L4.

**Q11 [scenario]** What kind of thing is `/compact`?
- A) One of Matt's Skills
- B) A Built-in command that comes with Claude Code **(correct)**
- C) A model-invoked Skill
- D) A git command

*Why:* `/clear` and `/compact` are Built-in commands, not Skills. *Source:* R1 `GLOSSARY.md`; L2.

**Q12 [scenario]** A build just finished and went sideways. When should you run `/retro`?
- A) Next week, in a new session
- B) In the same session, before you `/clear` **(correct)**
- C) Before grilling the next idea
- D) Only after `/triage`

*Why:* `/retro` reads the session it looks back on. After clearing, you'd have to point it at the log. *Source:* L1 Context hygiene.

**Q13 [scenario]** A `/wayfinder` map has cleared. Where do you merge onto the Main flow?
- A) `/implement`
- B) `/to-spec` **(correct)**
- C) `/grill-me`
- D) `/code-review`

*Why:* `/to-spec` collapses the map's decisions into a buildable plan. *Source:* L1 On-ramps.

**Q14 [spot-the-mistake]** The author typed "you can start grilling with docs" in plain words. What happened, and why?
- A) Nothing ran
- B) The agent couldn't start `/grill-with-docs` (user-only), so it ran `/grilling` + `/domain-modeling` instead **(correct)**
- C) It ran `/grill-me`
- D) It skipped straight to `/to-spec`

*Why:* User-invoked Skills need you to type them. *Source:* R1; L4.

**Q15 [spot-the-mistake]** `/to-spec` asked the author a question, and he typed `/to-tickets` instead of answering. What was the cost?
- A) The tickets were deleted
- B) The spec was written on the agent's best guess **(correct)**
- C) The session cleared
- D) Nothing

*Why:* Answer open questions before moving to the next Skill. *Source:* R1 "What happened" item 4.

## Open questions / uncertain
- **Smart-zone number.** The course uses ask-matt's ~150k. Matt said ~100k (April) and ~140k (July) in his videos. The Lesson could say "roughly the first 100–150k tokens; Matt's current Skill says ~150k".
- **Video date.** Matt's post on X announcing the end-to-end video is dated 2026-07-09; YouTube shows 2026-07-16 (Lesson 12 already uses the YouTube date).
- **Translated transcript.** The cached end-to-end transcript is an auto-translated Arabic track, so I paraphrased only meaning, not wording.
- **Where `code-review` sits.** ask-matt nests it inside `/implement`; the docs pages draw it as its own step. Pick one picture for the Lesson (the author's Lesson nests it).
