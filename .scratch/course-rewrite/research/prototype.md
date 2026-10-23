# Research: Lesson 6, prototype (`/prototype`, with `/handoff` as the bridge)

Read on 2026-10-23. Pinned to the local Skills copy at `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/`, which matches GitHub `main` at `5beb35b` (2026-10-19).

## Source map

| ID | Source | Published | Covers | Timestamps used |
|---|---|---|---|---|
| S1 | Local `skills/engineering/prototype/SKILL.md`, `LOGIC.md`, `UI.md` | last changed on main 2026-08-19 (`3216582`) | The Skill itself | n/a |
| S2 | Local `skills/productivity/handoff/SKILL.md` + `agents/openai.yaml` | last changed 2026-10-06 (`0f5e033`) | `/handoff` | n/a |
| S3 | Local `skills/in-progress/claude-handoff/SKILL.md` + `skills/in-progress/README.md` | 2026-10-06 (`4ec00d9`) | Beta background-agent handoff | n/a |
| S4 | Local `skills/engineering/ask-matt/SKILL.md` + `PHASE-BOUNDARIES.md` | 2026-10-06 (`954ee7f`) | Where prototype and handoff sit in the Main flow; the five options at a phase boundary | n/a |
| S5 | Local `README.md` (Reference section) and `CHANGELOG.md` (1.1.0 commit `850873c`, 1.2.0 #763) | 1.3.1 tagged 2026-10-04 | Who can start each Skill; history of the prototype rules | n/a |
| S6 | https://www.aihero.dev/skills-prototype (same text as local `docs/engineering/prototype.md`) | page undated | What it does, When to reach for it, Common questions, It's working if | n/a |
| S7 | https://www.aihero.dev/skills-handoff (same text as local `docs/productivity/handoff.md`) | updatedAt 2026-08-24 | Same four sections for `/handoff` | n/a |
| S8 | AI coding dictionary, https://www.aihero.dev/ai-coding-dictionary (entries: prototyping, handoff, handoff artifact, primary source, secondary source, compaction, clearing) | n/a | One-line definitions | n/a |
| V1 | Matt Pocock, "Don't waste time on specs: /prototype instead", https://www.youtube.com/watch?v=n0VhIVtviC0 | 2026-07-23, 10:59 | Fidelity; a UI-variant demo; iterating; logic prototypes | 0:00–1:04, 1:24–2:45, 2:45–3:46, 3:46–5:35, 5:35–5:57, 6:15–7:38, 7:15, 7:59–8:43, 8:53–9:44, 10:05–10:25 |
| V2 | Matt Pocock, "/handoff is my new favourite skill", https://www.youtube.com/watch?v=dtAJ2dOd3ko (date confirmed by moderncreator.app and dotzlaw.com) | 2026-05-21, 12:24 | Why handoff exists, how it differs from compact, the grill → prototype → handoff-back round trip | 1:40–3:06, 3:21–4:44, 5:03–7:16, 7:16–9:13, 9:31, 9:48–11:38 |
| V3 | Matt Pocock, "Building a REAL feature with Claude Code: every step explained", https://www.youtube.com/watch?v=hX7yG1KVYhI | 2026-03-18, 44:16 | Matt deciding *not* to prototype, then finding the gap in QA | 18:42–19:25, 38:52 |
| V4 | Matt Pocock, "mattpocock/skills: A complete AI Coding workflow, end-to-end", https://www.youtube.com/watch?v=M6mYodf0dJM (**Arabic auto-dub transcript**) | 2026-07-16, 17:16 | `ask-matt` naming the prototype detour, bridged by handoff | 7:54–8:22 |
| V5 | Matt Pocock, "New Skills! v1.1 brings /wayfinder, /research, /implement, /to-spec, /to-tickets", https://www.youtube.com/watch?v=A8mokin_YOs | 2026-07-08, 15:11 | Chapter list only (not transcribed) | 11:21 chapter "Supporting skills: research and prototype" |
| C1 | GitHub issue #1019, "Shorthand /prototype conflicts with hidden new Claude Code built-in skill" | 2026-09-03, closed | Name clash with a hidden Claude Code built-in | n/a |
| C2 | GitHub issue #1306, "prototype: a UI prototype's settled details never reach the implementers" | 2026-10-20, open | A real failure report | n/a |
| C3 | GitHub issue #1020, "throwaway research and prototype branches can never actually be deleted" | 2026-09-03, open | Old prototype branches pile up | n/a |
| C4 | GitHub issue #384, "prototype gets recommended-by-name" | 2026-06-27, closed 2026-10-06 | Agents suggesting `/prototype` at the wrong time | n/a |
| C5 | GitHub issue #631, "Could --fork-session simplify the handoff + prototype flow?" | 2026-07-20, closed | Matt's answer on fork-session versus handoff | n/a |
| C6 | GitHub issues #186 (2026-05-13), #306 (2026-06-06), #622 (2026-07-19), #1307 (2026-10-20) | as listed | Handoff losing rejected options, unverified claims, Codex temp folder, claude-handoff splitting decisions | n/a |
| C7 | Dotzlaw Consulting, "Your 1M-Token Context Window Is a Lie After 120K: Budgeting Sessions with /handoff", https://dotzlaw.com/insights/claude-code-14-context-lifecycle/ | 2026-07-30 | A practitioner's view of handoff and context budgets | n/a |
| C8 | SSD Nodes, "Matt Pocock's skills: which ones to install", https://www.ssdnodes.com/learn/matt-pocock-skills-for-coding-agents | 2026-10-11 | Prototype on a headless VPS; handoff for solo developers | n/a |
| A1 | Author: `content/lessons/05-prototype.md`, `content/lessons/11-main-flow.md` | 2026-10-21/22 | The site story | n/a |
| A2 | Author's repo: branch `prototype/lesson-page` (commit `8cdcfa1`, 2026-10-21 13:45 IST); `.scratch/lesson-site/issues/03-lesson-pages.md` and `06-comment-box.md` (the `## Comments` verdicts); commits `ae9ae38` and `e771bac` | 2026-10-21 | The site story | n/a |
| A3 | (Extra, not from the Lesson files) Author's Claude Code session log | 2026-10-21 | Exact command typed, timing, context size | n/a |

## Key facts (pinned to v1.3.1)

### `/prototype`

- **What it is.** The Skill defines a prototype as "throwaway code that answers a question" (S1). The question comes first and decides what gets built (S1, S6).
- **Who can start it: model-invoked.** There is no `disable-model-invocation` line, and the README lists it as model-invoked (S1, S5). So you can type it, or the agent can reach for it when the task fits. It was made model-invoked in 1.1.0 (S5, commit `850873c`). Before that it was user-invoked, which is why C4 (June 2026) describes it the old way.
- **How to start it.** Type `/prototype`. In Claude Code, if `/prototype` errors with "unknown skill", type `/mattpocock-skills:prototype` instead. A hidden Claude Code built-in with the same name breaks the short form, and Matt won't rename the Skill (C1). The author typed the long form (A3).
- **Step 1: pick a branch.** The question decides which kind of prototype gets built (S1):
  - **Logic** ("does this logic or state model feel right?"): see LOGIC.md below.
  - **UI** ("what should this look like?"): see UI.md below.
  - If it's unclear and the user isn't around, pick by the nearby code (a backend module means logic, a page means UI) and write that assumption at the top.
- **Six rules for both branches** (S1):
  1. Throwaway from day one, and clearly named as a prototype. Put it next to the code it's for, and follow the project's existing routing conventions.
  2. Trivial to run: one command for a UI prototype, a double-click for a logic demo.
  3. No persistence by default. State lives in memory. If the database *is* the question, use a scratch DB with a "PROTOTYPE, wipe me" name.
  4. Skip the polish: no tests, no error handling beyond what makes it run, no abstractions.
  5. Show the full state after every action, or on every variant switch.
  6. Capture it when done:
     - fold the validated decision into the real code;
     - commit the prototype to a throwaway branch, kept out of main;
     - leave a pointer to that branch on the implementation issue;
     - record the verdict and the question it settled.
- **Logic branch (LOGIC.md).** It produces one self-contained HTML file: plain HTML, CSS and JS, no framework, no bundler, no server. It opens by double-click and is written in domain language, so a non-developer can drive it. Steps:
  1. State the question in one visible paragraph at the top.
  2. Put the logic in a pure module inside a single `<script>` block, with no DOM code, so it can be lifted into the real code later. It can be a reducer, a state machine, a set of pure functions, or a small class.
  3. Lay the page out top to bottom: title and one-line explanation, a current-state panel (labelled fields, not raw JSON), free-play buttons, then tabbed guided walkthroughs. Each tab is one scenario with its buttons in order and resets to a known start. Include the happy path, a tricky edge case, and one illegal attempt.
  4. Hand it over. The useful moments are "wait, that shouldn't be possible".
  5. Capture: the pure module goes into the real code; the HTML shell goes to the throwaway branch.
  - Anti-patterns: tests, a real database, generalising, mixing logic with page code, frameworks, shipping the HTML shell.
- **UI branch (UI.md).** It produces several radically different variants on one route, switched by a `?variant=` URL parameter and a floating bottom bar. Details:
  - **Default 3 variants, capped at 5.**
  - **Sub-shape A (preferred):** render the variants on the existing page, keeping its data fetching. Use this even for something new that would naturally live inside an existing page.
  - **Sub-shape B (last resort):** a new throwaway route following project conventions, with "prototype" in the name.
  - Variants must differ in structure (layout, information hierarchy, main control), not colour. If two come out too alike, redo one with explicit "do not use a card grid" guidance.
  - **The switcher bar:** left and right arrows that wrap around, a label showing the variant key and name, and ← → keys that don't fire while typing in a field. It updates the URL so a variant can be shared and survives reload. It is visually distinct from the page and hidden in production builds.
  - **Capture:** fold the winning variant into main and rewrite it properly; move all the variants to the throwaway branch.
  - Anti-patterns: colour-only variants, sharing a layout between variants, wiring real writes to the database, promoting prototype code straight to production.
- **What it produces.** Throwaway code next to its target (a `?variant=` switcher plus `VariantA/B/C` components, or one HTML file). Then a `prototype/<name>` branch out of main that is never merged, plus a written verdict on the implementation issue, an ADR, or a commit (S1, S4, S6). The docs and `ask-matt` name the branch pattern `prototype/<name>` (S4, S6).
- **When to reach for it.** When a question can't be settled by talking: a state machine with edge cases you can't hold in your head, or a screen you can't picture until you see three versions. Grilling sessions get long on exactly these questions (S6). Matt's test: basic structure gets settled in discussion; anything you need to *see or feel working* gets a prototype (V1 1:24–2:45). Wayfinder's matching criterion is when "how should it look" or "how should it behave" is the key question (V1 2:45–3:46; S6).
- **When not to reach for it:**
  - Something already built is broken: use `/diagnosing-bugs` (S6).
  - The design is already settled: go to `/implement` (S6, C4).
  - "Prototype the whole app" is not one question, so it's out of scope (S6).
  - If it's still being built a day later, the question was too big; split it (S6).
- **Where it sits in the Main flow.** It is fork 1 of the Main flow (S4). After `/grill-with-docs`, ask: can every question be settled in conversation? If one needs a runnable answer (state, business logic, a UI you have to see), take the detour: `/handoff` out → `/prototype` in a fresh session → `/handoff` back the answer → reference it from the original thread. It's also a "reach for it anytime" Skill, and wayfinder files prototype tickets (S4, S6). Downstream, `/to-spec` and `/to-tickets` may quote a snippet from the prototype that captures a decision (state machine, reducer, schema, type shape), trimmed and marked as coming from a prototype (S1 via to-spec/to-tickets; S6).

### `/handoff`

- **What it is.** It writes a summary of the current conversation as a markdown file a fresh agent can pick up. The file goes in the OS temp folder (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows), not the workspace (S2).
- **Who can start it: user-invoked only.** `disable-model-invocation: true`, and in Codex `allow_implicit_invocation: false` (S2). The agent won't fire it on its own (S7).
- **How to start it.** `/handoff <what the next session is for>`. The hint is "What will the next session be used for?", and the document is tailored to it (S2).
- **What the document contains** (S2):
  - a "suggested skills" section naming the Skills the next agent should load;
  - no duplication: specs, plans, ADRs, issues, commits and diffs are referenced by path or URL;
  - API keys, passwords and personal information redacted.
- **When it's the right move.** What `/handoff` gives you is portability, so it fits exactly four situations (S4 PHASE-BOUNDARIES, S7):
  - a new harness (Claude to Codex);
  - a new directory or repo (a prototype folder is the common case);
  - a colleague;
  - forking a side task found mid-phase.
  - Anything else: stay in the session, `/clear`, use a subagent, or `/compact`. `/compact` is the default (S4).
- **The phase-boundary tree** (S4). At a boundary between two phases, go top to bottom; the first yes wins:
  1. Continue (this phase is the source material for the next, or there's room left in the smart zone, about 150k tokens).
  2. `/clear` (everything here is disposable).
  3. `/handoff` (something has to travel).
  4. Subagent (the task can run unattended).
  5. Otherwise `/compact`, ideally with an instruction.
  - Every option except Continue turns the conversation itself (a primary source) into a summary of it (a secondary source).
- **The prototype round trip.** This is the fork use people skip (S7). You stay in your planning session and hand a copy to a second agent. The work crosses over twice and the original thread stays live.
- **`/claude-handoff` (beta, not in the plugin).** It writes the same summary to temp, then launches a background agent with `claude --bg --name "<name>" -- "$(cat <file>)"`, managed with `claude agents`. It is user-invoked. It's excluded from the plugin, gets no docs page, and may change. Install it with `npx skills@latest add mattpocock/skills --skill=claude-handoff` (S3). Open issue C6/#1307: it can leave open decisions split between two sessions.

### Newer on GitHub main

- **Local copy versus `main`:** identical for every file in this note (checked by diff on 2026-10-23).
- **Local copy versus the tagged 1.3.1 release** (`2629ffc`, 2026-10-04). These changes are already in the local copy but unreleased (pending `.changeset/` files):
  - `handoff` now names the temp folder (`$TMPDIR`, else `/tmp`; `%TEMP%`). Commits `4f4e943`/`0f5e033`, 2026-10-06; changeset `handoff-temp-dir.md`.
  - `claude-handoff` now saves the summary to a file first and passes it with `$(cat …)`, so the shell can't mangle it (`07b7105`, 2026-10-06).
  - `ask-matt` now reads a Skill's SKILL.md before describing it (`954ee7f`).
  - `prototype` is unchanged since 2026-08-19.
- **Under discussion (open, not decided):**
  - #1306: record the decisions a UI prototype settled, not only the verdict.
  - #1020: keep prototypes on main in a folder instead of on branches.
- **Videos versus pinned behaviour:**
  - V1 (2026-07-23) shows the logic branch building a terminal app. Since 1.2.0 (#763, commit `6bcbcb0` on 2026-07-31) it's a single shareable HTML file.
  - V1 and earlier advice was "delete the prototype". Since 1.2.0 it's "keep it on a `prototype/<name>` branch as a primary source" (S5).

## Day-to-day usage

**Matt's patterns**

- **Raise the fidelity.** Simple structure gets settled in grilling. As soon as he needs to see or feel something working, he asks for a prototype. Producing code is now cheap enough that he wants more of his design discussions to happen at higher fidelity (V1 1:04–2:45).
- **React, then combine variants.** In his search-bar demo he flipped through A/B/C with the bottom picker and noted what he liked in each. He asked for A's search box with C's layout, and the agent produced a variant D (V1 3:57–7:38).
- **Prefer the live page.** He mounts variants on the real route rather than a throwaway one, because it's a more honest picture of how the code will work (V1 7:15). This matches sub-shape A.
- **Compact inside a long prototype session.** His prototype session reached about 100k tokens. He used `/compact` with a QA instruction, not `/handoff`, because he was staying in the same place in the codebase and needed the design decisions kept (V1 5:35–5:57). This matches question 5 of the tree (S4).
- **Afterwards: hand it to an implementer.** An unattended agent plugs the result in, deletes the prototype code from the working branch, and checks against the spec. The throwaway branch stays as reference (V1 7:59–8:43).
- **Not only UI.** Backend state models get logic prototypes too (V1 8:53–9:44). He credits Ryan Singer's *Shape Up* as an influence (V1 10:25).
- **The handoff round trip.**
  - Grilling reached question 13; he typed a handoff to prototype the hard parts (V2 7:16–8:06).
  - The prototype session grew to about 169k tokens, far more than would have fit in the grilling thread (V2 8:06).
  - He then handed the non-obvious learnings back to the planning session (V2 8:23–8:55) and calls this a do-it-yourself subagent (V2 8:55).
  - With the result he finished grilling and wrote the spec and issues (V2 9:13).
- **Forking a side task mid-grilling.** At question 2 he spotted an out-of-scope API idea and handed it off. That also sharpened the current grilling (V2 6:11–7:16).
- **Always pass the purpose.** He always says why he is handing off, and dictates it (V2 11:20–11:38). Plain markdown also travels to Codex or Copilot CLI (V2 9:31).
- **Choosing not to prototype.** While building a real feature he considered prototyping three to five UI versions but chose to implement, because he wanted to get to code (V3 18:42–19:25). In QA the UI choice felt wrong. He notes a prototype phase could have caught it, and fixed it in code instead (V3 38:52). Teaching point: it's a judgement call, not a rule.

**Others**

- **Settled details went missing.** One team ran four rounds of UI prototypes, then went through spec, tickets and an `implement-spec` build. They got 16 visible mismatches with the approved prototype, because only the verdict was written down and the prototype code was treated as throwaway (C2).
- **Old branches pile up.** Kept `prototype/<name>` and `research/<name>` branches are linked from tickets, so nobody can safely delete them (C3).
- **`--fork-session` instead of handoff.** Matt's answer: either works. `/handoff` works in any harness and keeps the prototype session small; fork carries the whole thread (C5).
- **Headless servers.** The UI branch is awkward on a headless VPS (you need port forwarding). The author there recommends `handoff` for solo developers (C8).
- **Context budgets.** A consultancy write-up uses handoff files to budget sessions, citing Matt's 120k "dumb zone" heuristic (C7).
- **Handoff gaps reported.** Handoff summaries drop rejected options (C6 #186). Matt replied there that past roughly 100k tokens summary quality can't be guaranteed. Others asked for "checked versus assumed" discipline (#306). Codex clears its temp folder (#622).

## Common mistakes

1. **Prototyping a question you could settle by talking, or the wrong question.** Write the question at the top first (S6, LOGIC.md step 1).
2. **Variants that differ only in colour or copy.** Real variants disagree about structure (UI.md; S6).
3. **Hardening the prototype** with tests, the real database, or generalising. At that point you've stopped prototyping (LOGIC.md anti-patterns; S6).
4. **Merging prototype code into main, or promoting it directly.** Rewrite it properly; losers and the switcher go to the throwaway branch (UI.md step 6, anti-patterns).
5. **Deleting the prototype** (the old advice). Keep it on `prototype/<name>` with a pointer from the issue (S1 rule 6; S5 1.2.0).
6. **Writing down only "we picked C".** Also write down what each control does and what each panel holds (C2).
7. **Judging UI on an empty throwaway route** when a real page exists. It hides design problems (UI.md sub-shape B warning; V1 7:15).
8. **Prototyping the whole app** (S6 Common questions).
9. **Following an agent's suggestion to `/prototype` after tickets exist** when nothing is left to decide. Go to `/implement` (S6; C4).
10. **Running a big prototype inside your planning thread** and pushing it past the smart zone. Hand off out and back instead (S4, S6, V2 8:06).
11. **`/prototype` says "unknown skill".** Use `/mattpocock-skills:prototype` (C1).
12. **Handoff mistakes:**
    - Using it when nothing travels (`/compact` instead; S4, S7).
    - Losing the temp file, or temp getting wiped (S7).
    - Pasting the summary into a shell command, where it gets silently cut short (S7).
    - Not passing the purpose (S2; V2 11:20).
    - Trusting things the summary states as fact that the session never checked (S7; C6 #306).

## Try it yourself (about 15–20 minutes)

**Goal:** settle one logic question with a throwaway HTML demo and capture the answer properly. No web framework is needed.

1. **Make an empty practice repo.** In a terminal: `mkdir book-loans && cd book-loans && git init && git commit --allow-empty -m "start"`. Then start Claude Code in that folder.
2. **Type the prompt.** If `/prototype` errors, use `/mattpocock-skills:prototype`.

   ```
   /prototype Does this state model feel right? A library book is Available, On loan, Overdue, or Returned. A borrower can renew a loan at most twice, but not once it's overdue. Returning an overdue book should record a late fee. I want to press buttons and watch the state change.
   ```

3. **Open the HTML file it made by double-clicking it.** Play with the free buttons, then run every walkthrough tab.
4. **Try to break it.** Can you renew an overdue book? Can you renew three times? If anything surprises you, tell the agent and let it add an action or scenario.
5. **Capture it.** Type:

   ```
   We're done. Write the verdict and the question it settled in a short DECISION.md on main, and commit the prototype to a prototype/book-loans branch, not main.
   ```

**It's working if:**

- [ ] The question is written in plain words at the top of the page, not only in a code comment.
- [ ] It opened by double-click, with no `npm install` and no server.
- [ ] A labelled state panel (not raw JSON) updates after every click.
- [ ] There are free-play buttons plus tabs of guided walkthroughs, and one walkthrough tries something illegal (like renewing an overdue book).
- [ ] The logic sits in its own `<script>` block that never mentions `document` or buttons.
- [ ] You hit at least one "wait, that shouldn't be possible" or "huh, I assumed…" moment.
- [ ] Afterwards `git branch` shows `prototype/book-loans`, main holds only the decision, and there are no tests in the prototype.

**Stretch: the handoff round trip (+10 minutes).** In any longer conversation, type `/handoff prototype the book-loan rules and report back what we learn`. Ask for the file path. Open a fresh session and say "Read <path> and continue". When done there, type `/handoff back to the planning session: the verdict and anything non-obvious`, and paste the path into the first session.

It's working if:

- [ ] The file is in your temp folder and is a small fraction of the conversation.
- [ ] It points at files instead of copying them.
- [ ] Its suggested-skills section names `prototype`.
- [ ] It contains no secrets.
- [ ] Your first session is untouched when you come back to it.

## Site story

From A1 and A2, with A3 marked where used.

- **When.** On 2026-10-21, after issue 02 (accounts) merged and before issue 03 built the Lesson page. The Lesson file shows `/prototype` (A1). The session log shows the author actually typed the namespaced `/mattpocock-skills:prototype` at about 13:44 IST (A3).
- **The question.** It named the question: what should a Lesson page with its comment box look like? (A1)
- **The variants.** It built 3 layouts using real Lesson 1 text and fake in-memory Comments (A1, A2):
  - A, "Document": one column, comments at the end;
  - B, "Outline sidebar": a section list on the left;
  - C, "Side-by-side discussion": the lesson on the left, a sticky discussion panel on the right.
- **How it fits the Skill's rules.** The Lesson page didn't exist yet, so this was sub-shape B. A throwaway route `/prototype/lesson` was started by one command (`npm run proto`), and the question was written in a header comment. The `PrototypeSwitcher` returns nothing in production builds (A2, commit `8cdcfa1`).
- **The pick.** The author picked C so comments stay visible while reading. The log's reply ("c lets go with c") came about 5 minutes after the command (A1, A3). The Lesson's takeaway: deciding by seeing took about 2 minutes, while imagining can take a day (A1).
- **The capture.**
  - Branch `prototype/lesson-page`, commit "Prototype: three lesson page layouts (throwaway, never merge)": 6 files (page, variants, CSS, switcher, a `proto` script, the `marked` dependency). It was pushed and never merged.
  - Verdicts were written as `## Comments` on issues 03 and 06, each pointing at the branch and `VariantC`. This is the "pointer on the implementation issue" rule (A2).
  - The real page was rebuilt with tests in issue 03 (`ae9ae38`) and issue 06 (`e771bac`) (A1, A2).
- **What the author did not do.** No `/handoff`: the prototype ran in the same session as grilling, the spec and the build. That session showed about 205k of 1M tokens right after the prototype started (A3), well past the ~150k smart zone (S4). This is exactly where Matt would hand off out and back (V2 8:06). Lesson 11 later says Matt bridges this trip with `/handoff` (A1).

## Candidate quiz questions

1. **Mid-grilling, you can't decide between three layouts for the Lesson page. What next?**
   A) Keep grilling until you can picture it · **B) Run `/prototype` to build several structurally different variants you can flip between** · C) `/to-spec` with all three described · D) `/diagnosing-bugs`.
   Why: a question you have to *see* gets a UI prototype (S6). Source: S1, S6.
2. **Your question is "can a refund be cancelled after a partial shipment?" What does `/prototype` build?**
   A) Three UI variants on a route · B) A terminal app · **C) One self-contained HTML file with a state panel, free-play buttons and guided walkthrough tabs** · D) A full page wired to the real database.
   Why: the logic branch produces a shareable HTML file. The terminal app was the old behaviour before 1.2.0 (S1 LOGIC.md; S5).
3. **The three variants are all card grids in different colours. What's wrong?**
   A) Nothing, colour matters · **B) Variants must differ in structure; redo one with "no card grid"** · C) There should be 10 variants · D) They need tests first.
   Source: S1 UI.md.
4. **Variant C won. What happens to the code?**
   A) Merge C into main as-is · B) Delete everything · **C) Rewrite C properly in main, keep all variants on a never-merged `prototype/<name>` branch, and point to it from the implementation issue** · D) Leave the `/prototype` route in production.
   Source: S1 rule 6, UI.md step 6.
5. **The page you're redesigning already exists. Where do variants go?**
   A) A new `/prototype/x` route · **B) The same route, behind `?variant=`, keeping its data fetching** · C) A separate repo · D) Storybook.
   Why: sub-shape A is preferred; B is the last resort (S1 UI.md).
6. **Should a prototype have tests?**
   A) Yes, TDD always · B) Only for the switcher · **C) No: a prototype that needs tests is no longer a prototype** · D) Only if it touches the database.
   Source: S1 LOGIC.md anti-patterns.
7. **You're deep in a grilling thread you want to keep, and a question needs a prototype in its own folder. Which move?**
   A) `/compact`, then prototype here · B) `/clear` and re-explain · **C) `/handoff` out, `/prototype` in a fresh session, `/handoff` the answer back** · D) Keep going in the same thread.
   Source: S4, S7.
8. **Same harness, same folder: you finished grilling, you're starting implementation, and you're near the smart zone. Is this a `/handoff`?**
   A) Yes, always hand off between phases · **B) No: nothing is travelling, so `/compact` (or continue if there's room)** · C) Yes, but only to Codex · D) Use `/claude-handoff`.
   Source: S4 PHASE-BOUNDARIES, S7.
9. **Your context is filling up. Will the agent run `/handoff` for you?**
   A) Yes, automatically · B) Yes, after 150k tokens · **C) No: it's user-invoked, so you must type it** · D) Only in Codex.
   Source: S2 (`disable-model-invocation: true`).
10. **Typing `/prototype` in Claude Code says "unknown skill". What do you type?**
    A) Reinstall the plugin · **B) `/mattpocock-skills:prototype`** · C) `/grill-me` · D) `/handoff prototype`.
    Source: C1.

## Open questions / uncertain

- **Which version to call "v1.3.1."** The local copy includes unreleased post-1.3.1 changes. The course should either say "1.3.1 as installed on 2026-10-23" or name the next release once it ships.
- **V4 is an Arabic auto-dub**, so its timestamps are approximate and my paraphrases come from a translation. Refetch it in English before quoting.
- **No English quotes were kept from V1–V3.** Everything above is paraphrased; check timestamps against the audio if exact wording is needed.
- **Whether the author chose sub-shape B or simply had no page yet** is my inference from timing. The Lesson file doesn't say.
- **The 205k-token figure** comes from the session log, not the Lesson file. Decide whether the course may use it.
- **The smart-zone number varies by source:** 120k (V2 2:51), ~140k (V4 10:35), ~150k (S4). Pin to S4.
- **#1306 and #1020** (open) may change what gets captured, and where.
