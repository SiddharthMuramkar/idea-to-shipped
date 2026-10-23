# Research: Lesson 7, spec and issues (`/to-spec` + `/to-tickets`, tracer-bullet tickets, blocking edges, the local `.scratch/` tracker)

Read on 2026-10-23. Pinned to the local Skills copy at `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/`, which matches GitHub `main` at `5beb35b` (2026-10-19).

## Source map

| ID | Source | Published | Covers | Timestamps used |
|---|---|---|---|---|
| S1 | Local `skills/engineering/to-spec/SKILL.md` + `agents/openai.yaml` | last changed 2026-08-19 (`5c89081`) | The Skill itself | n/a |
| S2 | Local `skills/engineering/to-tickets/SKILL.md` + `agents/openai.yaml` | last changed 2026-10-06 (`9e2abf8`) | The Skill itself | n/a |
| S3 | Local `skills/engineering/setup-matt-pocock-skills/SKILL.md`, `issue-tracker-local.md`, `issue-tracker-github.md`, `issue-tracker-gitlab.md`, `triage-labels.md` | 2026-10-07 (`5b7cade`) | Tracker setup and the local conventions | n/a |
| S4 | Local `skills/engineering/ask-matt/SKILL.md` + `PHASE-BOUNDARIES.md` | 2026-10-06 | Main flow fork 2, context hygiene, the smart zone | n/a |
| S5 | Local `README.md`, `GLOSSARY.md` (Issue, Issue tracker, Triage role), `CHANGELOG.md` (1.1.0 #464/#469, 1.2.0 #502/#734) | 1.3.1 tagged 2026-10-04 | History: to-prd → to-spec; to-plan + to-issues → to-tickets; tickets.md → one file per ticket | n/a |
| S6 | https://www.aihero.dev/skills-to-spec (same text as local `docs/engineering/to-spec.md`) | updatedAt 2026-08-24 | What it does, When to reach for it, Common questions, It's working if | n/a |
| S7 | https://www.aihero.dev/skills-to-tickets (same text as local `docs/engineering/to-tickets.md`) | page undated | Same, plus the wide-refactor exception | n/a |
| S8 | aihero post "v1.1: /wayfinder, /to-spec, /to-tickets, /grilling improvements, and much more", https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements | 2026-07-08 | Why the renames happened | n/a |
| S9 | AI coding dictionary entries "Spec" and "Ticket", https://www.aihero.dev/ai-coding-dictionary/spec and /ticket | n/a | Definitions. There is no entry for tracer bullet or vertical slice (71 entries checked) | n/a |
| V1 | Matt Pocock, "mattpocock/skills: A complete AI Coding workflow, end-to-end", https://www.youtube.com/watch?v=M6mYodf0dJM (**Arabic auto-dub transcript**) | 2026-07-16, 17:16 | Setup's tracker choice; fork 2; `/to-spec` then `/to-tickets` in one session; clearing between tickets | 4:55–5:31, 6:42, 9:40–10:16, 10:35, 11:11–12:08, 12:08–12:49, 12:49–13:34, 13:55–14:38 |
| V2 | Matt Pocock, "Building a REAL feature with Claude Code: every step explained", https://www.youtube.com/watch?v=hX7yG1KVYhI | 2026-03-18, 44:16 | The older names (write-a-PRD, PRD-to-issues): module sketch, blocking, merging tickets, day shift and night shift | 24:11–25:00, 25:45–27:56, 28:38–29:19, 29:19–30:02, 30:02–30:49, 30:49–31:32, 33:44 |
| V3 | Matt Pocock, "New Skills! v1.1 brings …", https://www.youtube.com/watch?v=A8mokin_YOs | 2026-07-08, 15:11 | Chapter list only | 0:37 chapter "/to-spec, /to-tickets" |
| C1 | GitHub issues #1078 (2026-09-13, open), #292 (2026-05-31, open), #1204 (2026-10-07, open), #1080 (2026-09-14, closed as a duplicate of #508), #554 and #513 (cited in S7) | as listed | Real failures: seams lost, parent spec still pickable, sub-issue wording, tickets never closed | n/a |
| C2 | SSD Nodes, "Matt Pocock's skills: which ones to install", https://www.ssdnodes.com/learn/matt-pocock-skills-for-coding-agents | 2026-10-11 | When to-tickets pays off for a solo developer | n/a |
| C3 | Helder Berto, "Why I Built TracerKit", https://dev.to/helderberto/why-i-built-tracerkit-fmo | 2026-04-06 | Tracer bullets (from *The Pragmatic Programmer*); hand-maintained checklists drifting | n/a |
| C4 | Third-party video, "Matt Pocock's Claude Code Skills Beat Superpowers Now", https://www.youtube.com/watch?v=8D8ewFBJfFM | 2026-08-07 | Description only: to-spec keeps code out of the spec; to-tickets slices by feature, not layer | n/a |
| A1 | Author: `content/lessons/03-spec-and-issues.md`, `content/lessons/11-main-flow.md` | 2026-10-21/22 | The site story | n/a |
| A2 | Author's repo: `.scratch/lesson-site/` (spec + issues 01–06), `.scratch/main-flow-and-redesign/` (spec + issues 01–05), `docs/agents/issue-tracker.md`, commits `d29cde9` (2026-10-22, plan) and `d21fc2c` (PR #9) | 2026-10-21/22 | The site story | n/a |
| A3 | (Extra, not from the Lesson files) Author's session logs `8230810b-….jsonl` (2026-10-21) and `8bf55acc-….jsonl` (2026-10-22) | as listed | Exact commands and timing | n/a |

## Key facts (pinned to v1.3.1)

### Glossary of the words involved

- **Spec:** a document describing a multi-session piece of work: what's being built, not how each session does its share (S9). The spec is the destination; the tickets are the steps that get there (S6, S8; V1 11:32–11:50).
- **Ticket:** scopes one session of work and can block, or be blocked by, sibling tickets (S9). The repo's own glossary prefers "Issue" as the domain term (S5); the Skill and docs say "ticket".
- **Tracer bullet / vertical slice:** a narrow but complete path through every layer (schema, API, UI, tests) that can be demoed on its own. The opposite is a horizontal slice that ships one layer (S2, S7). The term comes from *The Pragmatic Programmer* (C3). There is no aihero dictionary entry for it (S9).
- **Blocking edges / frontier:** the tickets that must finish before this one can start. The frontier is every ticket whose blockers are all done (S2, S7).

### Precondition: `/setup-matt-pocock-skills`

- It is user-invoked and run once per repo.
- It asks where the tracker is (GitHub, GitLab, local markdown, or a freeform description of something else). It asks about triage labels only if `/triage` is installed, and defaults to one glossary at the root.
- It writes an `## Agent skills` block into `CLAUDE.md` (or `AGENTS.md`), plus `docs/agents/issue-tracker.md` and friends (S3).
- Without a configured tracker, `/to-spec` and `/to-tickets` tell you to run it (S1, S2). Matt notes Jira or Linear work by describing them to setup (V1 4:55–5:31).

### The local tracker conventions (`issue-tracker-local.md`, S3)

- One feature per folder: `.scratch/<feature-slug>/`.
- The spec is `.scratch/<feature-slug>/spec.md`.
- Tickets are one file each: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never one combined file.
- Triage state is a `Status:` line near the top.
- Comments are appended under `## Comments` at the bottom of the file.

### `/to-spec`

- **Who can start it: user-invoked only.** `disable-model-invocation: true` (S1). The agent won't start it, so you must type `/to-spec` (S6). For a cleared wayfinder map, use `/to-spec #<map_issue>` (S6).
- **What it does.** It turns the current conversation into a spec. It does not interview you; it only puts together what has already been decided (S1). If the spec states something you never said, that's a defect (S6).
- **Steps** (S1):
  1. Explore the repo, using the glossary's words and respecting ADRs.
  2. Sketch the **seams** (where the feature will be tested): existing seams over new ones, the highest one possible, ideally just one. **Check them with the user.**
  3. Write the spec from the template, publish it to the tracker, and apply `ready-for-agent`.
- **Template sections:** Problem Statement · Solution · User Stories (a long numbered list of "As an <actor>, I want a <feature>, so that <benefit>") · Implementation Decisions · Testing Decisions (what makes a good test, which modules are tested, similar existing tests) · Out of Scope · Further Notes (S1).
- **No file paths or code snippets.** The one exception is a trimmed snippet from a prototype that captures a decision (S1).
- **What it produces.** One issue. On the local tracker that's `.scratch/<feature>/spec.md` with `Status: ready-for-agent` (S1, S3).
- **When to reach for it.** Only when the work is decided and spans several sessions. If you haven't decided yet, use `/grill-with-docs`. If it fits one context window, use `/implement` and skip the spec (S6).

### `/to-tickets`

- **Who can start it: user-invoked only** (S2). Arguments: `/to-tickets` reads the conversation, or pass a spec path or issue number (`/to-tickets #<spec_issue>`) and it fetches it (S2, S7).
- **Steps** (S2):
  1. Gather context.
  2. Explore (optional): glossary words, ADRs, and **prefactoring** ("make the change easy, then make the easy change"), which goes first.
  3. Draft vertical slices following four rules:
     - each slice is a complete path through every layer;
     - it can be demoed or verified on its own;
     - it fits one fresh context window;
     - prefactoring goes first.
     Then give each ticket its blocking edges.
  4. **Quiz the user** with a numbered list (Title / Blocked by / What it delivers). Is the granularity right? Are the edges correct? Should anything merge or split? Iterate until approved.
  5. Publish:
     - **Local:** one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from 01 with blockers first. The file template is `# <NN>: <Title>`, `**What to build:**` (end-to-end behaviour from the user's side), `**Blocked by:**` (or "None (can start immediately)"), `**Status:** ready-for-agent`, then checkbox acceptance criteria.
     - **Real tracker:** one issue per ticket, blockers first. Use native blocking links. Make each ticket a sub-issue of the source issue. Apply `ready-for-agent`. Use the Parent / What to build / Acceptance criteria / Blocked by sections, leaving out Blocked by when the edges are native.
     - Don't close or edit the parent.
     - No file paths or code, except a trimmed prototype snippet.
- **Wide refactors break the slicing rule** (S2, S7). A wide refactor is one mechanical change that breaks thousands of call sites at once, such as renaming a column. Sequence it as expand–contract:
  - **Expand:** add the new form beside the old.
  - **Migrate:** move call sites in batches, one ticket per batch, each blocked by the expand.
  - **Contract:** delete the old form, blocked by every migrate batch.
  - If even the batches can't stay green, they share an integration branch and all block a final integrate-and-verify ticket.
- **Working the tickets afterwards** (S4, S7):
  - **Local:** by hand, top to bottom (blockers first).
  - **Real tracker:** anything on the frontier can be picked up, possibly in parallel.
  - Two ways down: `/implement` per ticket with `/clear` between, or `/implement-spec` for the whole graph on one integration branch.
  - Don't run `/triage` on these tickets; they are agent-ready by construction (S4, S7).

### Where they sit in the Main flow

- **Fork 2 of the Main flow** (S4): is this a multi-session build? Yes → `/to-spec` → `/to-tickets` → work the tickets. No → `/implement` right here.
- **Context rule:** keep grilling, spec and tickets in one unbroken window. Don't compact or clear until after `/to-tickets`. Then each `/implement` starts fresh from its ticket (S4).
- **The exception is the smart zone** (~150k tokens). If you near it before `/to-tickets`, `/compact` at the nearest phase boundary (S4).
- **Another reason not to clear:** with a big spec on a real tracker, `/to-tickets` may get truncated output when fetching it back (S6, S7).

### Newer on GitHub main

- **Local copy versus `main`:** identical for all files in this note (diffed 2026-10-23).
- **Local copy versus the tagged 1.3.1 release** (`2629ffc`, 2026-10-04). Already in the local copy, but unreleased (pending changesets):
  - `to-tickets` makes each ticket a sub-issue of its source issue, and leaves out `## Blocked by` when blockers are native edges. Commits `cffab50`/`9e2abf8`, 2026-10-06; changeset `to-tickets-sub-issues.md`, fixing #554 and #262.
  - Setup creates missing triage labels on GitHub/GitLab, fixes the `glab` commands, and reads issues with `--json`. Commit `5b7cade`, 2026-10-07; changeset `setup-tracker-fixes.md`. Re-run setup to refresh `docs/agents/`.
  - `implement` fetches a passed ticket reference and states its title (changeset `implement-ticket-reference.md`).
  - `to-spec` is unchanged since 2026-08-19.
- **Agreed but not yet merged:** replace "Do NOT close or modify any parent issue" with a positive rule: leave the parent alone except for attaching sub-issues (C1 #1204).
- **Still open:**
  - #1078: tickets drop the seams `/to-spec` agreed.
  - #292: the parent spec stays pickable by agents.
- **Videos versus pinned behaviour:**
  - V1 (2026-07-16) shows local tickets going into one `tickets.md`. Since 1.2.0 (#502) it's one file per ticket (S5, S7).
  - V2 (2026-03-18) uses the old names `write-a-PRD` and `PRD to issues`. These were renamed `/to-spec` and merged into `/to-tickets` in 1.1.0 (S5, S8).

## Day-to-day usage

**Matt's patterns**

- **The fork: decide by size.** Matt usually runs `/implement` directly when the work fits his budget. He uses about 140k tokens as the smart-zone edge in this video and budgets about 100k (V1 10:16–10:52). For the demo he pretends the work is multi-session and types `/to-spec` instead (V1 11:11).
- **One session, no clearing.** `/to-spec` squeezed about 46k tokens of discussion into a spec (V1 11:11–11:32). Then, in the same session, he typed `/to-tickets` (V1 12:08). In the older video he notes the spec is already in context, so breaking it into issues straight away is cheap (V2 29:19).
- **Push back on granularity.** It proposed 3 slices; he said do it in 1 (V1 12:29–12:49). In V2 it proposed 6. He merged the tiny ones, because each ticket costs a whole agent start-up, and ended with 4 (V2 30:02–30:49). A ticket should be sized to one context window or smart zone (V1 12:29).
- **A real example.** A removal spec with 11 sub-issues, each one session. The tickets are short because most acceptance criteria live in the parent spec (V1 12:49–13:34).
- **Then clear and implement one ticket at a time,** clearing between tickets. Finish with code review against the spec (V1 13:55–14:38).
- **Modules and seams first.** The PRD step sketched the modules that would change and asked which ones need tests. Matt reasons about interfaces, not implementation (V2 25:45–28:38). This is the ancestor of today's seam check. He says testing decisions in the spec make TDD more likely (V2 31:32).
- **How much he reviews.** In March 2026 he didn't review the PRD or the issues, trusting the summary (V2 29:19, 30:49). The current docs say to at least read the seams and the out-of-scope section (S6). Teach the docs' advice to beginners.
- **Day shift and night shift.** Humans grill and write specs and tickets; agents implement unattended while you start the next grilling (V2 33:44).

**Others**

- **Solo developers.** `to-tickets` pays off most when several people or agents pick up tickets in parallel. `to-spec` with local markdown works fine solo (C2).
- **Tracer-bullet phases.** One developer's take: integration problems show up in phase 1, not at the end. Checklists ticked by hand drifted from reality (C3).
- **Seams lost between spec and tickets.** In one measured case `/tdd` never fired across 17 runs because tickets dropped the seams. Workaround: add the seam to each ticket by hand (C1 #1078). The author's ticket 02 did this: "Build the Lessons module change with /tdd" (A2).
- **Tickets don't close themselves.** `/implement` doesn't reliably close or tick off tickets (S7; C1 #1080 → #508). Update `Status:` yourself; the author marked tickets `resolved` (A2).
- **The parent spec can get picked up.** The parent spec keeps `ready-for-agent`, so an unattended agent can build the whole thing in one go (S6; C1 #292). Exclude it in your agent's prompt, or relabel it after `/to-tickets`.

## Common mistakes

1. **Clearing or compacting between grilling and `/to-tickets`.** The spec loses the reasons behind your answers, and big specs truncate when fetched back (S4, S6, S7).
2. **Writing a spec for single-session work.** Go from grilling straight to `/implement` (S6).
3. **Expecting `/to-spec` to ask more questions, or letting it invent to fill a section.** Every line should be something you decided (S6).
4. **Skipping the seam check** (the author did, see Site story). The seams feed `/tdd` and `/code-review` (S1, S6).
5. **Horizontal tickets** (all schema, then all API, then all UI). In one 26-ticket layer-sliced stack, roughly 20 agent runs went into each closed ticket, mostly rework. Ask "what can I demo when this is done?" (S7).
6. **Twelve tickets for a three-line change.** Merge at the quiz step, or skip tickets entirely (S7; V1 12:29; V2 30:02).
7. **Running `/triage` on `/to-tickets` output** (S4, S7).
8. **File paths, line numbers or code in tickets or the spec,** except a trimmed prototype snippet (S1, S2).
9. **Expecting one `tickets.md`** (pre-1.2.0 behaviour; S5, S7).
10. **Leaving the parent spec `ready-for-agent`** where an unattended agent can grab it (S6; C1 #292).
11. **Acceptance criteria that can't fail** (already true, only satisfiable by another ticket, or restating the request). For each one, name the observation that would prove it false (S7).
12. **Treating the spec as a living document.** It's a snapshot. Lasting decisions go in `GLOSSARY.md` and ADRs (S6).
13. **Waiting for the agent to start `/to-spec`.** It's user-invoked, so type it (S1, S6). The author's Lesson 11 makes the same point (A1).

## Try it yourself (about 15–20 minutes)

**Goal:** go from a tiny idea to a spec plus tracer-bullet tickets on the local tracker, without clearing.

1. **Set up a practice repo.** `mkdir todo-practice && cd todo-practice && git init`, then start Claude Code. Run `/setup-matt-pocock-skills` and choose **Local markdown** (accept the recommendations).
2. **Grill briefly (about 6–8 minutes).** Answer by accepting the recommendations unless you disagree.

   ```
   /grill-with-docs I want a single web page to-do list: add an item, tick it off, and the list survives a page reload. Keep it tiny: no accounts, no server.
   ```

3. **Turn it into a spec:** `/to-spec`. When it shows you the test seams, **answer that question** (accept, or ask for fewer) before typing anything else.
4. **Break it into tickets:** `/to-tickets`. At the numbered list, ask: "For each ticket, what can I demo when it's done?" Merge any ticket without a good answer. Approve.
5. **Inspect the files.** Open `.scratch/<feature>/spec.md` and the files in `.scratch/<feature>/issues/`. Do **not** `/clear` at any point before step 4 finishes.

**It's working if:**

- [ ] `/to-spec` started writing instead of starting a new interview, and showed you the seams first (ideally one).
- [ ] `spec.md` has Problem Statement, Solution, numbered user stories, Implementation Decisions, Testing Decisions and Out of Scope, uses your words ("item", "list"), and has no file paths.
- [ ] You remember making every decision in it, and Out of Scope lists real things you refused (accounts, server).
- [ ] Tickets are separate files, `01-…md`, `02-…md`, numbered blockers first. Each has **What to build**, **Blocked by**, **Status: ready-for-agent** and checkbox criteria.
- [ ] Ticket 01 says "None (can start immediately)".
- [ ] Every ticket delivers something you can try in the browser. None is "all the storage code" on its own.
- [ ] For an app this small you got about 2–3 tickets, not 10.

## Site story

From A1 and A2, with A3 marked where used.

**v1 (2026-10-21): plain words, not the Skills**

- **What was typed.** The author typed `write the spec` (A1; confirmed by A3). The agent followed `docs/agents/issue-tracker.md` and wrote `.scratch/lesson-site/spec.md` plus 6 ticket files (A1, A2).
- **The spec.** One page with an API table, the data, environments, the look and an Out of scope list. It flagged three things it had added on its own (comment length limits, rejecting unknown slugs, deploying the empty app early). The author approved all three (A1).
- **The tickets.** Each has a `Status:` (`ready-for-agent`, or `ready-for-human` for logins) and a `Blocked by:` line. The build order: 01 Scaffold → 02 Accounts and 03 Lesson pages; 02 → 04 Comments table; 03 + 04 → 05 API → 06 Comment box (A1, A2). The ticket format (`## What` / `## Done when`) is not the current `/to-tickets` template, and the spec contains a file path. Neither was made by `/to-spec` or `/to-tickets`.
- **Built.** One ticket per PR (#2–#5) via "build issue 01", then `/tdd` (A2, A3). The author's lesson: their job is writing or approving good "Done when" lists, then checking them (A1).
- **Teaching observation (my analysis, not the author's claim).** Tickets 04 → 05 → 06 (table → API → UI) are layer slices. A tracer-bullet version would be one ticket: "a Visitor can post a Comment and see it after reload", going through table, API and UI together.

**The redesign (2026-10-22): the real Skills**

- **The sequence.** Grilling → `/to-spec` → `/to-tickets` → `/implement-spec`, with no `/clear` in between (A1).
- **Typing ahead of the question.** `/to-spec` stopped to check one design choice (the seam check). The author typed `/to-tickets` instead of answering, so the spec went in with the agent's best guess (A1). The log shows `/to-tickets` was typed 46 seconds after `/to-spec` (A3). Next the author said no at first, then typed `/implement-spec`; the log has them asking whether the agent had converted the spec to tickets (A1, A3). Lesson 11's "what I'd do differently": answer the open question before typing the next Skill (A1).
- **The spec.** `.scratch/main-flow-and-redesign/spec.md` follows the template: Problem Statement, Solution, 35 user stories, Implementation Decisions, Testing Decisions with one seam (the Lessons module), Out of Scope, and Further Notes (A2).
- **The tickets.** 5 tickets in the current template (What to build / Blocked by / Status / checkboxes): 01 design (no blockers) → 02 Lesson photos → 03 home page and 04 Lesson 11 in parallel → 05 scroll motion. It was committed as `d29cde9` "Plan the main flow Lesson and GE-style redesign", together with two new glossary terms (A1, A2).
- **Built.** `/implement-spec` ran a helper per ready ticket, each in its own worktree, merged into the `main-flow-and-redesign` branch. Each ticket got a `## Comments` build note and `Status: resolved`. It shipped as PR #9 (`d21fc2c`) (A1, A2).

## Candidate quiz questions

1. **Grilling is done and the change fits in one session. Next?**
   A) `/to-spec` · B) `/to-tickets` · **C) `/implement` right here** · D) `/triage`.
   Source: S4, S6.
2. **Grilling is done; it's a multi-session build. Which order?**
   **A) `/to-spec`, then `/to-tickets`, in the same window** · B) `/to-tickets`, `/clear`, `/to-spec` · C) `/clear`, then `/to-spec` · D) `/implement-spec` first, `/to-spec` later.
   Source: S4.
3. **When is the first safe `/clear`?**
   A) Right after grilling · B) After `/to-spec` · **C) After `/to-tickets` (then between each `/implement`)** · D) Never.
   Source: S4.
4. **`/to-spec` pauses and shows you proposed test seams. What do you do?**
   A) Type `/to-tickets` to keep moving · **B) Confirm or adjust the seams, then let it write** · C) `/clear` and retry · D) Ask it to add more seams to be safe.
   Why: checking seams with you is a step of the Skill, and fewer is better (S1, S6). The author's own slip shows what goes wrong (A1).
5. **Proposed tickets: 01 all DB tables, 02 all API routes, 03 all UI. What's wrong?**
   A) Nothing · **B) They're horizontal; each ticket should be a thin path through every layer you can demo alone** · C) Too few tickets · D) They need file paths.
   Source: S2, S7.
6. **On the local tracker, where does `/to-tickets` write ticket 3 of "comments"?**
   A) `tickets.md` at the root · B) `.scratch/comments/spec.md` · **C) `.scratch/comments/issues/03-<slug>.md`** · D) a GitHub issue.
   Source: S2, S3. A is the pre-1.2.0 behaviour.
7. **Tickets: 01 (no blockers), 02 blocked by 01, 03 and 04 each blocked by 02, 05 blocked by 02 and 03. After 01 and 02 are done, what's on the frontier?**
   A) Only 05 · **B) 03 and 04** · C) 03, 04 and 05 · D) Nothing.
   Why: the frontier is every ticket whose blockers are done. 05 still waits for 03 (S2, S7; matches A2).
8. **`/to-tickets` proposed 12 tickets for a three-line change. Best response?**
   A) Approve; more is safer · **B) Push back at the quiz step to merge them, or skip tickets and `/implement`** · C) `/triage` them · D) Re-run `/to-spec`.
   Source: S7; V1 12:29.
9. **Should you run `/triage` on tickets `/to-tickets` just made?**
   A) Yes, always · **B) No: they're agent-ready already; triage is for issues you didn't create** · C) Only on GitHub · D) Only the first one.
   Source: S4, S7.
10. **You must rename a database column used in thousands of places. How should tickets be sliced?**
    A) One giant ticket · B) One ticket per layer · **C) Expand–contract: add the new form, migrate call sites in batches, then delete the old form** · D) A prototype first.
    Source: S2, S7.

## Open questions / uncertain

- **V1 at about 10:08:** the English captions (`M6mYodf0dJM.en.json`) say the same as the Arabic dub: if the work needs multiple sessions, skip steps two and three and go straight to implement. So it isn't a translation error; Matt misspoke, since he then picks `/implement` because the work is small (10:31–10:52). Teach it the way `ask-matt` says: multi-session work gets `/to-spec` → `/to-tickets`; otherwise `/implement`.
- **Lesson 11's "I said no at first"** is ambiguous about what was refused. The log suggests the author was confused about whether `/to-spec` needed a yes first.
- **Calling the v1 tickets layer-sliced** is my analysis, not the author's view. Decide whether the course says this.
- **The 46-second gap** and the exact prompts come from the session logs, not the Lesson files.
- **#1204 and #1078** may soon change the ticket template; recheck before publishing.
