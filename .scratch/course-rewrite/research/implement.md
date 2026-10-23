# Research note: `implement` (Lesson 9: `/implement` and `/implement-spec`, AFK vs human-in-the-loop)

## Source map
All read on 2026-10-23.

| ID | Source | Date | What it covers | Timestamps / sections used |
|---|---|---|---|---|
| L1 | Local `skills/engineering/implement/SKILL.md` at `/Users/siddharth/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/` | plugin labelled 1.3.1 (matches main) | The five instructions | whole file |
| L2 | Same folder: `skills/engineering/implement-spec/SKILL.md` | same (identical to the v1.3.1 tag) | Nine steps: task graph, frontier, integration branch, subagents in worktrees | whole file |
| L3 | Same folder: `docs/engineering/implement.md` and `implement-spec.md` | same | When to use each, common questions, "It's working if" | whole files |
| L4 | https://www.aihero.dev/skills-implement and https://www.aihero.dev/skills-implement-spec | implement: published 2026-07-07, updated 2026-08-24; implement-spec: published 2026-10-05 | Public copies of L3 | as L3 |
| L5 | Same folder: `CHANGELOG.md`, 1.3.0 entry (#1120) | v1.3.0/1.3.1 released 2026-10-04 | `implement-spec` graduated; integration branch instead of PR; tracker pointer; each implementer uses `tdd` and fast-forward merges | 1.3.0 |
| L6 | https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md | updated 2026-10-05 | Three ways to loop over tickets; rough edges (one big branch; collisions at merge time) | "New: /implement-spec" |
| L7 | Same folder: `README.md` Reference; `skills/engineering/ask-matt/SKILL.md` and `PHASE-BOUNDARIES.md` | 1.3.1 | User- vs model-invoked; a user-invoked Skill can't call another user-invoked one; Main flow fork 3; clearing between tickets | sections named |
| L8 | GitHub v1.3.1 tag vs main; changesets `implement-ticket-reference` (#700) and `implement-skill-tool-wording` | 2026-10-06/07 | Newer-on-main changes | diff |
| L9 | GitHub issues #479, #498, #511, #858, #1014, #1215, #1277 (all open as of 2026-10-23) | 2026-07 to 2026-10 | Known rough edges | issue pages |
| V1 | "New Skills! v1.3 brings /pr, /implement-spec, and /retro", https://www.youtube.com/watch?v=BsJGo1wFTvQ | 2026-10-05 (14:33) | Why `/implement-spec` exists; three loops; read the Skill first | 0:25–1:08, 1:08–1:35, 1:35–2:15, 2:15–3:05, 3:05–3:30, 3:30–4:30, 4:30–4:54 |
| V2 | "mattpocock/skills: A complete AI Coding workflow, end-to-end", https://www.youtube.com/watch?v=M6mYodf0dJM (cached transcript is an auto-translated Arabic track) | 2026-07-16 (17:17) | `/implement` live: smart-zone budget; clear between tickets; review in subagents; commit | 10:15–11:00, 13:00–14:30, 14:30–16:30 |
| V3 | AI Engineer workshop, https://www.youtube.com/watch?v=-QFHIoCo-Ko | 2026-04-24 | Human-in-the-loop vs AFK; day shift/night shift; Ralph loop run once by hand, then AFK in a sandbox; review in a fresh context | 0:26:00–0:27:00, 0:40:00, 0:53:00–0:57:00, 1:05:00–1:06:00, 1:30:00–1:32:00 |
| D1 | AI Coding Dictionary entries: https://www.aihero.dev/ai-coding-dictionary/afk, /human-in-the-loop, /human-review | AFK and human review 2026-09-24; human-in-the-loop 2026-07-01 | Definitions; when each fits; AFK needs a permissive mode plus a sandbox | full entries |
| C1 | developer.tenten.co, "Matt Pocock Releases Skills 1.3…" | undated (after 2026-10-04) | Community routing advice (single-session fast path vs `/implement-spec`) | "Avoiding the Heavy-Pipeline Trap" |
| C2 | tim-kaa-py/ai-wiki summary of V1 (GitHub) | 2026-10-05 | Community summary; agrees with V1 | key takeaways |
| R1 | Repo: `content/lessons/12-main-flow.md`; PR #9 (30 commits); `.scratch/main-flow-and-redesign/spec.md` and issues 01–05 | 2026-10-22 | The author's `/implement-spec` run | as cited |

## Key facts (pinned to v1.3.1)

### `/implement` (L1, L3)
- **What it is.** Builds work that has already been decided: a ticket, a spec, or a plan just agreed in the conversation. It never reopens the plan: no interview, no alternative approach.
- **How you start it.** You type `/implement` (plus a ticket reference, a path, or nothing if the plan is in the thread). It is **user-invoked** (`disable-model-invocation: true`; Codex `allow_implicit_invocation: false`). The agent never starts it, and no other Skill can call it (L1, L7).
- **One run, in order** (L1, L3):
  1. If you passed a ticket reference, fetch it from the issue tracker and state its title (ask if it's ambiguous). *Newer on main; see below.*
  2. Drive `tdd` at pre-agreed seams ("call the Skill tool with tdd").
  3. Run typechecks and single test files often.
  4. Run the full suite once, at the end.
  5. Call `code-review`.
  6. Commit to the **current branch**.
- **What it produces:** commits on the branch you're on. It doesn't create a branch, open a PR, close the ticket, tick the acceptance criteria, or act on review findings (L3).
- **When to reach for it** (L3, L7):
  - one ticket per session, `/clear` between tickets;
  - directly against a small spec;
  - right in the same window when the plan only lives in the conversation and the job is small. Say so when you type it, because the Skill otherwise looks for a spec or ticket file.
- **When not to:**
  - nothing written down yet → `/grill-with-docs`;
  - one behaviour, no spec → `/tdd`;
  - already built, just check it → `/code-review`;
  - a whole spec in one run → `/implement-spec` (L3).

### `/implement-spec` (L2, L3, L5)
- **What it is.** Builds a whole spec and its tickets in one run. User-invoked. It graduated into the Engineering Skills in **v1.3.0** (released 2026-10-04 together with 1.3.1) (L5).
- **Key ideas:**
  - The tickets form a **task graph** with blocking edges.
  - The **frontier** is the tickets whose blockers have all landed; every frontier ticket runs at once.
  - Everything lands on one **integration branch**.
  - Subagents talk through sparse **context pointers** (the spec, the tickets, notes, earlier commits) rather than pasted summaries (L2).
- **Nine steps** (L2):
  1. Read the spec and tickets.
  2. Optionally, an exploration subagent saves notes **outside the repo** for every later subagent to read.
  3. Create the integration branch. Open a draft PR after the first merge only if the tracker closes work through PRs or you ask.
  4. Implementer subagents, each in its own worktree and branch, running in the background where possible. Each one checks it's based on the integration branch, builds its ticket with `tdd`, and merges the integration branch tip in before reporting done.
  5. A merger subagent lands each finished ticket.
  6. When the frontier changes, start more implementers.
  7. Once **all** tickets are done, `code-review` on the integration branch, and one implementer fixes everything it raised.
  8. Mark the draft PR ready, or resolve the tickets the way the tracker closes work.
  9. Clean up the worktrees.
- **Prerequisites** (L3):
  - a configured issue tracker (otherwise it tells you to run `/setup-matt-pocock-skills`);
  - tickets with blocking edges;
  - a harness that runs subagents in the background, each with its own worktree. If subagents run one at a time, it's just a slower `/implement`.
- **Trade-offs Matt names:** one big branch, and worktrees don't remove collisions, they move them to merge time (L6).

### How they connect, and AFK vs human-in-the-loop
- **Who can call what.** A user-invoked Skill may call model-invoked Skills (`tdd`, `code-review`) but never another user-invoked Skill (L7 README). So `/implement-spec`'s implementers call `tdd`, not `/implement`.
- **Main flow fork** (L7 ask-matt):
  - multi-session build → `/to-spec` → `/to-tickets` → `/implement` per ticket with `/clear` between, **or** `/implement-spec`;
  - small build → `/implement` in the same window.
  - Both drive `/tdd` and close with `/code-review`. `/implement` reviews per ticket; `/implement-spec` runs one review over the integration branch.
- **Definitions** (D1):
  - **Human-in-the-loop:** you're present during the session, steering in real time. It suits work that's ambiguous, irreversible, or hard to review afterwards. Grilling and prototyping are in-the-loop by nature.
  - **AFK** (away from keyboard): you start a session and leave. It usually needs a permissive permission mode plus a sandbox. The typical failure is coming back to coherent work built on a wrong early guess, so settle the ambiguity before (grilling, spec), let automated checks stand in during, and end in something reviewable (a PR, not merged changes).
- **Matt's three ways to loop over tickets** (V1 1:08–3:05; L6):
  1. **Manual:** you act as the for loop (implement ticket 1, clear, implement ticket 2…). Not much fun.
  2. **Deterministic script**, e.g. Sandcastle. What he recommends for most people: reliable and cheap, but slow to set up and tune, so out of range for beginners.
  3. **Agent loop** = `/implement-spec`. An agent babysits instead of you. Worse than a script because it isn't deterministic, but a good way into AFK work.
  - The docs add: for truly AFK work a deterministic loop is faster, cheaper and more reliable; `/implement-spec` needs no infrastructure and lets you watch and steer (L3).

### Newer on GitHub main
- The local copy matches main. Compared with the **v1.3.1 tag**, `implement/SKILL.md` on main adds two things (both unreleased changesets, 2026-10-06/07) (L8):
  - fetching a passed ticket reference and stating its title (#700);
  - wording the sub-skill calls as "call the Skill tool with tdd / code-review" instead of bare `/tdd`.
- `implement-spec/SKILL.md` is identical between the tag and main; its docs page is only reworded.
- **Open issues to know** (L9):
  - **#1215:** both Skills call `code-review` by its bare name, which in Claude Code can run Claude Code's own built-in review instead of Matt's. You can't fix that by typing the namespaced name, because the call comes from inside the Skill.
  - **#1277 and #511:** `/implement` asks for review before committing, so the review has nothing to diff.
  - **#479:** reports `/implement` skipping `/tdd` and `/code-review`.
  - **#498:** endless review-and-fix cycles.
  - **#1014:** `/implement-spec` step 7 has no defined stopping point.
  - **#858:** asks for a review-admission boundary.

## Day-to-day usage
- **Matt's own rhythm** (V2):
  - For a small job he types `/implement` right after grilling. He treats about 140k tokens as where his model starts losing sharpness, so he gives himself roughly a 100k-token budget per job (10:15–11:00).
  - For multi-session work: `/to-spec` and `/to-tickets` in the same session, then clear, implement one ticket, clear between each (13:00–14:30).
  - `/implement` ran the typechecks and build, then loaded `code-review`, whose two subagents checked against the spec and the standards. Then it committed to the current branch (14:30–16:30).
- **Day shift / night shift.** Humans plan by day (grilling, PRD, Kanban board of tickets with blocking edges, each tagged AFK or human-in-the-loop). Agents implement at night (V3 0:40:00, 0:53:00).
  - Planning must be human-in-the-loop; implementation can be AFK (V3 0:26:00–0:27:00).
  - He runs his loop **once, by hand, first** to watch and tune the prompt, then loops it AFK in a Docker sandbox (V3 0:54:00–0:57:00).
- **Review in a fresh context.** The implementer finishes deep in its context, so a review in the same session is done "in the dumb zone"; clear first (V3 1:05:00–1:06:00). He uses a cheaper model to implement and a stronger one to review (V3 1:32:00).
- **`/implement-spec` in practice.** He reaches for it more than he expected, especially in repos without a tuned script. It's a basic version: build your own, e.g. with stacked PRs (V1 3:30–4:54). Read any Skill before using it (V1 3:05–3:30).
- **Others:**
  - Users wanted subagents to implement tickets instead of opening a session per ticket by hand (quoted in L3).
  - A five-ticket feature's review-and-fix loop took about four hours (L3).
  - Two parallel tickets named the same field differently (L3).
  - Three `/implement` sessions sharing one checkout amended each other's commits and lost a stash (L3).
  - Community routing advice: don't run the full spec-and-tickets pipeline for small fixes; save `/implement-spec` for specs that genuinely split into several independent tickets (C1; their heuristic, not Matt's).

## Common mistakes
- Waiting for the agent to start `/implement` or `/implement-spec`. Only you can type them (L1, L7).
- Running `/implement` on `main` when you wanted a branch. It commits to whatever branch you're on (L3).
- Pointing `/implement` at several tickets, or running several sessions in one checkout (L3).
- Not clearing between tickets (L7; V2 13:45–14:30).
- Expecting tickets to close themselves. Close them and tick the criteria yourself. Otherwise the frontier never visibly moves (L3).
- Review sees nothing: it only diffs committed work. Commit first (L3; #1277).
- Running `code-review` mid-run during `/implement-spec`. Every unbuilt ticket reads as a failure, which triggers loops (L3).
- Parallel tickets touching one shared file. Add a blocking edge, or fix the names in the exploration notes (L3).
- Seams agreed nowhere: the run quietly becomes "just write the code". Name the seams in the spec (L3).
- One ticket using 150k+ tokens: split the ticket rather than raising effort (L3).
- Tests skipped inside a worktree because gitignored fixtures or credentials are missing (L3).

## Try it yourself (~15–20 min)
**Start from** the folder from the TDD exercise, where `readingTime` exists and the work is committed.
1. Type: `Create a new git branch called try-implement and switch to it.`
2. Type:
```
/implement The plan is in this message, not a file: add wordCount(text) next to readingTime. It counts words separated by any whitespace (spaces, tabs, new lines), and readingTime must use it. Test only at the public functions wordCount and readingTime.
```
3. When it finishes, type: `Show me git log --oneline -3 and which branch we're on.`
4. Reflect: which moments needed you (human-in-the-loop), and which could have run with you away (AFK)?

**It's working if:**
- [ ] It starts by restating what it will build instead of asking you what to build.
- [ ] You can see an actual `tdd` Skill call in the trace, not just tests appearing.
- [ ] Typechecks and single test files run during the work, and the full suite runs once near the end.
- [ ] A review runs. If it says there's nothing to review, that's the known commit-first issue.
- [ ] The commit is on `try-implement`, and `main` is unchanged.
- [ ] Nothing closed or ticked a ticket for you: that's your job.

## Site story (from the author's repo)
- **v1 never used `/implement`.** The author ran `/tdd` once per issue, then `/code-review` at the end. His Main flow Lesson's old-to-new table maps that to "`/implement` per ticket, or `/implement-spec`" today (R1: `12-main-flow.md`).
- **The Main flow PR used `/implement-spec`.** He typed `/to-spec`, `/to-tickets`, then `/implement-spec`, all in one session with no `/clear` (R1, "What I typed").
- **5 tickets with blocking edges:** 01 design, then 02 photos, then 03 home page and 04 Main flow Lesson **in parallel**, then 05 scroll motion. Each ran in its own worktree and was merged into the `main-flow-and-redesign` integration branch (R1; PR #9 commits show "Resolve ticket 0X" / "Merge ticket 0X" pairs).
- **A real merge collision.** Ticket 03 (home page) merged ticket 04's work into its branch. "The only conflict was in `unsplash.ts`" (the shared photo-credits file), resolved by keeping both sides' entries (R1: issue 03 notes). This is exactly the "worktrees move collisions to merge time" trade-off.
- **The spec named its seam up front** ("One seam: the Lessons module"), which is what the docs recommend for `/implement-spec` (R1: spec Testing Decisions).
- **An early review ran while ticket 05 was still being built.** The author had asked "do I run the code review now or after?" (R1: Lesson 12 "What happened" item 5; issue 04 notes). Then `/code-review` found about 15 problems, one fix-up agent fixed them, and the PR was written.
- **His regret:** typing the next Skill before answering the agent's open question, so the spec was written on the agent's best guess (R1).

## Candidate quiz questions
**Q1 [scenario]** Grilling just finished. The change is small and the session has used about 40k tokens. What do you type?
- A) `/to-spec`, then `/to-tickets`
- B) `/clear`, then `/implement`
- C) `/implement`, right here in the same window **(correct)**
- D) Nothing; the agent starts building on its own

*Why:* Small build → `/implement` in the same context window; clearing would throw away the reasoning. *Source:* L7 ask-matt step 3; V2 10:15–11:00.

**Q2 [scenario]** You have a spec split into 6 tickets with blocking edges, and you'd like one run to build them all in parallel while you watch. Which Skill?
- A) `/implement` with all six ticket numbers
- B) `/implement-spec` **(correct)**
- C) `/tdd`
- D) `/code-review`

*Why:* `/implement-spec` works the ticket graph's frontier with parallel subagents. `/implement` takes one ticket per run. *Source:* L2; L3.

**Q3 [scenario]** After `/to-tickets`, you wait for the agent to start building, but nothing happens. Why?
- A) The tickets are broken
- B) `/implement` is user-invoked, so only you can start it **(correct)**
- C) The agent is out of tokens
- D) You need to run `/tdd` first

*Why:* `disable-model-invocation: true` means the agent never starts it. *Source:* L1 frontmatter; L3.

**Q4 [spot-the-mistake]** You run `/implement` on ticket 1, then ticket 2, then ticket 3, all in one long session. What's the mistake?
- A) Not running `/to-spec` between tickets
- B) Not clearing between tickets, so each one starts closer to the dumb zone **(correct)**
- C) Implementing tickets in order
- D) Not opening a PR per ticket

*Why:* Each ticket is self-contained and sized for one fresh window, so `/clear` between them. *Source:* L7; L3; V2 13:45–14:30.

**Q5 [scenario]** `/implement` committed the work, but the ticket file still says "ready" and its checkboxes are empty. What now?
- A) Run `/implement` again
- B) Report a bug
- C) Close the ticket and tick the criteria yourself **(correct)**
- D) Run `/triage` on it

*Why:* `/implement` has no completion step; it ends at the commit. *Source:* L3 common questions.

**Q6 [scenario]** You want the work on a feature branch. When do you create the branch?
- A) After `/implement` finishes
- B) Before typing `/implement`, because it commits to the current branch **(correct)**
- C) Never; `/implement` makes one for you
- D) Only if `/code-review` fails

*Why:* It doesn't create a branch or ask. *Source:* L3 prerequisites.

**Q7 [scenario]** In Matt's workflow, which step must stay human-in-the-loop?
- A) Implementing a ticket
- B) Running the tests
- C) Grilling to agree what to build **(correct)**
- D) Merging finished tickets into the integration branch

*Why:* Implementation can be AFK; planning and alignment can't. *Source:* V3 0:26:00–0:27:00; D1 human-in-the-loop.

**Q8 [spot-the-mistake]** During an `/implement-spec` run you trigger `/code-review` while ticket 05 is still being built. What goes wrong?
- A) Nothing; earlier is always better
- B) The unbuilt ticket reads as a failure against the whole spec, which can trigger build-and-review loops **(correct)**
- C) The review deletes ticket 05's worktree
- D) The review skips the Spec axis

*Why:* The run's one review belongs after every ticket has landed (step 7). *Source:* L2 step 7; L3; R1.

**Q9 [scenario]** Two frontier tickets both edit the same credits file. What should you expect?
- A) Worktrees prevent any conflict
- B) A collision at merge time, so add a blocking edge between them or agree exact names up front **(correct)**
- C) `/implement-spec` refuses to start
- D) The second ticket is skipped

*Why:* Worktrees postpone collisions to merge time; in the author's run, that's exactly what happened in `unsplash.ts`. *Source:* L3; L6; R1 issue 03.

**Q10 [scenario]** Which way of looping over tickets does Matt recommend for most people once it's set up?
- A) The manual loop
- B) A deterministic script loop **(correct)**
- C) `/implement-spec`, always
- D) One giant session

*Why:* A script is reliable and cheap; `/implement-spec` is the middle ground while you don't have one. *Source:* V1 1:35–3:05; L6.

**Q11 [scenario]** `/implement`'s review says there's nothing to review. Most likely cause?
- A) Your code is perfect
- B) The work isn't committed, and the review only diffs committed changes **(correct)**
- C) The Skill isn't installed
- D) The spec is missing

*Why:* The review compares the fixed point with `HEAD`, which excludes staged and working-tree changes. *Source:* L3; #1277.

## Open questions / uncertain
- **Partial transcript.** The cached end-to-end transcript is an auto-translated Arabic track, and one line about the fork (10:00–10:15) reads garbled in translation. I followed ask-matt's wording (small → `/implement` directly). Check against the English captions if you quote that moment.
- **Which `code-review` actually ran in the author's build?** Issue #1215 suggests the bare-name call can run Claude Code's built-in review. Lesson 12 describes a Standards + Spec review, which suggests Matt's Skill ran, but I didn't check the session log.
- **Smart-zone numbers vary by source:** about 100k in the workshop (V3 0:04:00), about 140k in the end-to-end video (V2 10:15), about 150k in ask-matt (L7). Use ask-matt's figure for v1.3.1 and say that Matt's own number has drifted.
