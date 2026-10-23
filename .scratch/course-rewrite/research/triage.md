# Research: triage (Lesson 14)

## Source map
All read on 2026-10-23.

| ID | Source | Date | Covers / used |
|---|---|---|---|
| T1 | Local `skills/engineering/triage/SKILL.md` (same 1.3.1 install, commit `49dd158`) | 2026-10-09 | Roles, transitions, invocation, flow, quick override, needs-info template, resuming. Identical to main. |
| T2 | Same folder, `AGENT-BRIEF.md` | same | Brief principles, template, good and bad examples |
| T3 | Same folder, `OUT-OF-SCOPE.md` | same | The `.out-of-scope/` knowledge base |
| T4 | Same folder, `agents/openai.yaml` | same | `allow_implicit_invocation: false` |
| T5 | Local `setup-matt-pocock-skills/triage-labels.md` and `issue-tracker-local.md` | same | Label mapping; local tracker `Status:` line |
| T6 | Local `docs/engineering/triage.md`, same as https://www.aihero.dev/skills-triage and https://www.aihero.dev/burn-through-your-backlog-with-my-triage-skill | page front matter updatedAt 2026-05-05; /posts lists "The /triage Skill" on Jul 7, 2026 | What it does; state machine; verify before brief; PRs; Common questions; It's working if; Where it fits |
| T7 | Local `ask-matt/SKILL.md`, "On-ramps" | 1.3.1 | "Bugs and requests piling up"; don't triage `/to-tickets` output |
| T8 | Local `CHANGELOG.md` | 1.1.0–1.3.0 | PR triage (`e00eadb`); round-based grilling (#593); setup asks about labels only if triage is installed (#502); Skill-tool wording (#878/#880) |
| T9 | GitHub main `.changeset/setup-tracker-fixes.md` and `github-tracker-external-pr-list.md` | merged 2026-10-07 | Setup now creates missing labels (#616); external-PR list fix (#468). Unreleased. |
| T10 | Matt's repo infrastructure: `.github/workflows/triage-label.yml`, `needs-info.yml` (PR #1170, commit `423ed08`); `.out-of-scope/*.md` (10 files, e.g. `new-skills.md`, `harness-name-collisions.md`) | 2026-10-05/06 | Matt using the Skill's labels and knowledge base on his own repo |
| T11 | GitHub issues: #139 and #297 (open state requests), #200, #616, #812, #863, #1287, #124 (a real triage close comment) | various | User reports |
| T12 | Matt Pocock, "Burn through the backlog from hell with /triage", https://www.youtube.com/watch?v=MzWIIlx0Gpc | 2026-05-07 (10:16) | Timestamps cited below. English auto-captions. |
| T13 | topaiskills.com, "I Ran Matt Pocock's Triage Skill on a Stale Backlog of Issues", https://topaiskills.com/tutorials/guides/triage-backlog-narrative-experience | page metadata 2026-10-21 (search listing said 2026-08-19) | Community hands-on report |
| T14 | AI Coding Dictionary, "AFK", https://www.aihero.dev/ai-coding-dictionary/afk | 2026-09-24 | AFK pattern |
| T15 | Author's repo: `docs/agents/triage-labels.md`, `docs/agents/issue-tracker.md`, `.scratch/**`, `content/lessons/11-main-flow.md` (lines 63–79), `GLOSSARY.md`, `src/comments/comments.ts` | 2026-10-21/22 | Site story and exercise design |

## Key facts (pinned to v1.3.1 + commit 49dd158)

**What it is.** Triage moves issues, and optionally external PRs, on your issue tracker through a small state machine of triage roles. Each item ends in one of three ways (T1, T6):
- an agent-ready brief,
- specific questions for the reporter,
- or a closed issue with a recorded reason.

It is only for work you didn't create (T6, T7).

**Invocation.**
- Type `/triage` and describe what you want in plain language (T1 "Invocation"), for example:
  - "Show me anything that needs my attention"
  - "Let's look at #42"
  - "Move #42 to ready-for-agent"
  - "What's ready for agents to pick up?"
- **User-invoked.** The front matter has `disable-model-invocation: true`, and the Codex metadata has `allow_implicit_invocation: false`. The agent never starts it on its own (T1, T4, T6).

**Prerequisite.** Run `/setup-matt-pocock-skills` first. It writes the tracker config and the label mapping (`docs/agents/triage-labels.md`). Role names are canonical; the mapping translates them to your tracker's labels (T1, T5, T6).

**Roles** (T1, T5).
- Two category roles: `bug`, `enhancement`.
- Five state roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
- Exactly one category plus one state per triaged item. If states conflict, flag it and ask the maintainer first.

**Transitions** (T1).
- An unlabelled item normally goes to `needs-triage` first.
- From there it moves to `needs-info`, `ready-for-agent`, `ready-for-human` or `wontfix`.
- `needs-info` returns to `needs-triage` when the reporter replies.
- The maintainer can override at any time; unusual moves get flagged.

**"Show what needs attention"** lists three buckets, oldest first, with counts and a one-line summary each, and lets you pick (T1):
1. Unlabelled
2. `needs-triage`
3. `needs-info` with reporter activity since the last triage notes

**Triaging one item** (T1):
1. **Gather context.**
   - Read the full issue (for a PR, the diff too) and any prior triage notes. Explore the code using `GLOSSARY.md` and the ADRs.
   - **Redundancy check:** search by domain concept, not the request's wording, for an existing implementation, and report where it looked.
   - **Prior-rejection check:** read `.out-of-scope/*.md`.
2. **Recommend** a category and state with reasoning plus a short codebase summary, then *wait*.
3. **Verify the claim.** For a bug, reproduce it from the reporter's steps; for a PR, check it out and run the tests. The result is confirmed (with code path), failed, or insufficient detail. Insufficient detail is a strong `needs-info` signal.
4. **Grill if needed.** Call the `grilling` and `domain-modeling` Skills, one round of questions at a time, updating `GLOSSARY.md` and ADRs as decisions land.
5. **Apply the outcome:**
   - `ready-for-agent`: post an agent brief
   - `ready-for-human`: the same brief plus why it can't be delegated
   - `needs-info`: Triage Notes ("What we've established" / "What we still need from you")
   - `wontfix`, three cases:
     - already implemented: point to where it lives; **no** `.out-of-scope/` entry
     - rejected bug: a polite explanation, then close
     - rejected enhancement: write to `.out-of-scope/`, link it from the comment, close

**Quick override.** "Move #42 to ready-for-agent": triage trusts you, confirms what it's about to do, applies it, skips grilling, and asks whether you want a brief (T1).

**Disclaimer.** Every comment or issue triage posts starts with `> *This was generated by AI during triage.*` (T1).

**Agent brief (the contract)** (T2).
- Durability over precision: name types, signatures, config shapes and behavioural contracts. Never file paths or line numbers.
- Behavioural, not procedural: what the system should do, not how.
- Complete, independently testable acceptance criteria.
- Explicit out-of-scope list.
- Template: Category / Summary / Current behavior / Desired behavior / Key interfaces / Acceptance criteria / Out of scope.
- For a PR, "current behavior" describes the diff, and the brief covers what's left to do.

**`.out-of-scope/`** (T3).
- One file per *concept* (e.g. `dark-mode.md`), written like a short design doc: what was rejected, a substantive and durable reason, and a "Prior requests" list.
- Matching is by concept, not keyword.
- On a match, the maintainer can confirm (append the new issue and close), reconsider (delete or update the file), or disagree (continue normal triage).
- Only rejected *enhancements* are written here.

**PRs.** When the tracker config treats external PRs as a request surface (off by default), triage handles them with the same machine. The Skill's own phrase is "a PR is an issue with attached code." Discovery shows only external PRs, but a PR you name explicitly is always triaged (T1, T6).

**Local tracker (as in this repo).** Triage state is a `Status:` line near the top of each `.scratch/<feature>/issues/NN-slug.md`; comments are appended under `## Comments` (T5).

**When to reach for it, and when not** (T6).
- **Yes:** a tracker full of raw reports from other people; open-source repos; team-filed bugs.
- **No:**
  - your own idea (`/grill-with-docs`)
  - a settled conversation (`/to-spec`)
  - tickets from `/to-tickets`: already agent-ready, don't triage them
  - a confirmed bug needing a root cause (`/diagnosing-bugs`)

**How it connects to the Main flow.** Triage is an *on-ramp*, a parallel lane for incoming work. Both lanes end at an issue labelled `ready-for-agent` with a brief, which `/implement` (or an AFK runner) picks up (T6, T7).

### Newer on GitHub main / recently changed
- **Unreleased (T9, merged 2026-10-07):** `/setup-matt-pocock-skills` now *creates* missing triage labels on GitHub and GitLab (fixes #616), and reads issues with `--json` so labels come through. The aihero page still calls #616 an open bug (T6 vs T11).
- **Matt's repo now automates the edges of the state machine (T10, 2026-10-05/06):** new issues get `needs-triage` automatically. `needs-info` issues with no reply for 14 days are closed as not planned, and a reply sends them back to `needs-triage`. This is repo infrastructure, not part of the Skill.
- **Open:**
  - #1287: the Skill doesn't say to add the `needs-info` label *after* posting the notes, so the agent's own comment can un-stale the issue.
  - #863: a team found needs-info comments verbose and hard to read.
  - #139 / #297: proposed blocked and deferred states.
  - #200: local-markdown duplicate acceptance criteria.
  - #812: setup's label section never runs on the plugin channel, so `triage-labels.md` may never be written.
- **1.2.0 (#593):** grilling inside triage asks a round of questions at a time (T8).

## Day-to-day usage

**Matt (T12, 2026-05-07):**
- **0:00–0:31:** Most skill setups suit solo developers. Teams and other people's ideas need triage: is it worth building, is it a bug, does it need reproducing?
- **0:33–0:48:** He runs triage on every open-source repo he maintains, and says it plugs into GitHub issues, Jira or any backlog.
- **0:52–2:04:** The state machine lives in labels. He describes the categories and states as still evolving, and stresses the one-category, one-state rule.
- **2:09–2:36:** You can triage one issue, ask what needs attention, or move one to ready-for-agent. Moving to ready-for-agent means writing an agent brief from the bundled template.
- **3:04–3:35:** On his Sandcastle repo: a new Claude session, `/triage` "just the ones I haven't triaged". It found 9 untriaged issues, and he asked it to apply basic labels so he'd have fewer decisions to make.
- **3:45–4:29:** `.out-of-scope/` works like ADRs for features they won't build (e.g. Sandcastle won't abstract Dockerfile composition), so matching enhancement requests can be closed at once.
- **4:29–5:20:** Starting with the bugs: for #477 it recommended `ready-for-agent`, but he felt it trusted the reporter too much and had it diagnose the bug itself.
- **6:02–6:29:** Managing AFK agents is mostly queue management. You act as the translation layer between humans filing tickets and the AI implementing them. His Sandcastle runner only touches issues labelled `ready-for-agent`.
- **7:29–8:17:** He fixes small confirmed bugs right in the triage session. He usually prefers a PR that references the issue, so merging closes it.
- **8:40–9:05:** It's designed for AFK agents: labels stop the agent from stumbling onto tasks that aren't ready.

**Matt's repo today (T10, T11):**
- Issues carry `ready-for-human`, `ready-for-agent` and `needs-triage`.
- Closing comments carry the AI disclaimer. Example: #124 was closed as not planned on 2026-10-06 because it lacked an observed failure from a real session.
- `.out-of-scope/new-skills.md` groups five prior requests for new Skills under one concept file.

**Others:**
- The topaiskills author found the verification gate stopped the run until a claim was proven. They advise running setup first, then "show me anything that needs my attention" (T13).
- A developer pipes non-developer feedback (via Marker.io) into GitHub. His team finds the needs-info questions too long to read (#863).
- The docs report a bulk run that relied on the cheap listing, which shows issue bodies but not comments. Three issues already marked "already fixed" got fresh briefs (T6).
- People run it against Linear (via the `linear` CLI), GitLab, and local markdown (T6).

## Common mistakes
1. **Triaging tickets `/to-tickets` made.** They're already agent-ready, so you waste the work (T6, T7).
2. **Waiting for the agent to start it.** It's user-invoked; type `/triage` (T1, T6).
3. **Skipping `/setup-matt-pocock-skills`**, so there's no label mapping and labels may not exist. Fixed on main, unreleased (T6, T9, T13).
4. **Letting it label from the cheap listing** in a bulk pass. Tell it to read every issue's comments (T6).
5. **Agent briefs with file paths and line numbers.** They go stale (T2).
6. **Briefing before verifying.** It should reproduce, or check out and run the PR, first (T1, T6).
7. **Writing `.out-of-scope/` for already-implemented features.** That poisons the dedup check (T3).
8. **Vague needs-info questions** like "please provide more info" (T1).
9. **Two state labels at once**, e.g. `ready-for-human` plus `needs-triage` (T1).
10. **Expecting it to find root causes.** Its verification is shallow on purpose; use `/diagnosing-bugs` (T6).

## Try it yourself (~15–20 min, on this repo's local tracker)
This repo already has `docs/agents/triage-labels.md` and a local-markdown tracker (T15). On another repo, run `/setup-matt-pocock-skills` first and pick local files.

1. In a fresh session, create three incoming "Visitor reports". These are fake but realistic. Type:
   ```
   Create .scratch/visitor-reports/issues/ with three issue files, no Status line, written as if Visitors sent them through the Discussion panel:
   01-wrong-address-status.md: "My link checker says /learn/nope is fine (HTTP 200), but the page says not found."
   02-blank-comment.md: "I posted a comment that was only spaces and it showed up blank."
   03-edit-my-comments.md: "Please add accounts so I can log in and edit my old comments."
   Don't triage them.
   ```
2. Type `/clear`, so the reports look like they came from someone else.
3. Type:
   ```
   /triage Show me anything that needs my attention.
   ```
4. Then:
   ```
   Let's look at 01. Don't implement anything.
   ```
   Do the same for 02 and 03. Accept or override its recommendations.

What should happen:
- **01 should verify as confirmed.** The real 200-not-404 bug (`.scratch/lesson-site/issues/03-lesson-pages.md`).
- **02 should fail to reproduce.** `postComment` trims the body and rejects empty comments (`src/comments/comments.ts`). Expect needs-info or a rejected bug.
- **03 conflicts with the Glossary** (Visitors have no accounts; Comments can't be edited). Expect a `wontfix` with a new `.out-of-scope/` concept file.

**It's working if:**
- [ ] It lists the three items in a bucket (unlabelled), oldest first, with one-line summaries, and lets you pick.
- [ ] For each, it recommends exactly one category and one state with reasoning, then stops and waits.
- [ ] For 01 it reproduces the claim before recommending `ready-for-agent`.
- [ ] Any brief names behaviours and acceptance criteria, with an out-of-scope list and no file paths or line numbers.
- [ ] For 02 it reports a failed repro and asks specific questions, or proposes closing politely.
- [ ] For 03 it creates `.out-of-scope/<concept>.md` with a real reason and a Prior requests list.
- [ ] Every comment it adds starts with the AI-triage disclaimer.
- [ ] Each file ends with one `Status:` line.
- [ ] Clean up afterwards if you don't want the practice files.

## Site story
- **The author never ran `/triage`.** Every issue in this repo came from the author's own planning via `/to-tickets`: 6 tickets under `.scratch/lesson-site/issues/` and 5 under `.scratch/main-flow-and-redesign/issues/`. Both specs start `Status: ready-for-agent` (T15).
- **That is the correct use, per the Skill:** triage is for incoming work, and `/to-tickets` output is already agent-ready (T6, T7).
- **The repo is ready for it.** `docs/agents/triage-labels.md` keeps the five default labels unchanged, and the tracker records state as a `Status:` line (T15). Lesson 11 already tells readers that `/triage` is user-only and not for `/to-tickets` output (`content/lessons/11-main-flow.md` lines 64, 77).
- **Quirk:** finished tickets say `Status: resolved`. That isn't one of the five triage states. It's the local tracker's convention (claimed/resolved under "Wayfinding operations").
- **The natural future source of incoming work** is the Discussion panel, where anonymous Visitors leave Comments. Lesson 14 can frame it as: "I didn't need it yet; here's what I'll do when a Visitor reports a bug."

## Candidate quiz questions
1. **You just ran `/to-spec` and `/to-tickets`. Should you run `/triage` on the new tickets?**
   - a) Yes, always
   - **b) No. They're already agent-ready; triage is for incoming work you didn't create ✔**
   - c) Only the bugs
   - d) Only if there are more than five

   *Why:* the two lanes meet at `ready-for-agent`. (T6, T7)
2. **Ten new issues arrive while you're grilling. Will the agent start triage on its own?**
   - a) Yes, once issues pile up
   - **b) No. `/triage` is user-invoked; you type it ✔**
   - c) Yes, inside grilling
   - d) Only on GitHub

   *Why:* `disable-model-invocation: true`. (T1, T4)
3. **An issue carries both `ready-for-human` and `needs-triage`. What does triage do first?**
   - a) Keeps both
   - b) Removes the older one silently
   - **c) Flags the conflict and asks the maintainer before anything else ✔**
   - d) Closes it

   *Why:* exactly one state role; conflicts are flagged. (T1)
4. **A Visitor asks to edit old Comments, which your project rejects by design. What's the outcome?**
   - a) needs-info
   - **b) wontfix as a rejected enhancement: write or append `.out-of-scope/<concept>.md`, link it, close ✔**
   - c) wontfix with no record
   - d) ready-for-human

   *Why:* rejected enhancements go in the knowledge base. (T1, T3)
5. **A request is closed because the feature already exists. Does it go in `.out-of-scope/`?**
   - a) Yes
   - **b) No. Point to where it lives; recording it would poison the dedup checks ✔**
   - c) Only if it was a bug
   - d) Only with a PR

   *Why:* the knowledge base is for rejected requests only. (T1, T3)
6. **A brief says "Open src/app/page.tsx and fix line 42". What's wrong with it?**
   - a) It's too short
   - **b) It isn't durable: briefs describe behaviours, types and acceptance criteria, never paths or line numbers ✔**
   - c) It's missing an emoji
   - d) Nothing

   *Why:* durability over precision. (T2)
7. **The reporter's steps don't reproduce and are vague. Best state?**
   - a) ready-for-agent with "investigate"
   - **b) needs-info, with Triage Notes listing what's established and specific questions ✔**
   - c) wontfix immediately
   - d) Leave it unlabelled

   *Why:* insufficient detail is the strongest needs-info signal; questions must be actionable. (T1, T6)
8. **What must triage do before grilling the reporter's request?**
   - a) Write the brief
   - **b) Verify the claim: reproduce the bug, or check out and run the PR ✔**
   - c) Close duplicates
   - d) Run `/to-tickets`

   *Why:* step 3 comes before step 4. (T1)
9. **What must every comment triage posts begin with?**
   - a) The issue number
   - **b) The line "This was generated by AI during triage." ✔**
   - c) The reporter's name
   - d) A label list

   *Why:* the required disclaimer. (T1)
10. **You say "move #42 to ready-for-agent". What happens?**
    - a) It refuses without grilling
    - **b) It trusts you, confirms the action, applies it, skips grilling, and asks if you want a brief ✔**
    - c) It runs `/implement`
    - d) It closes #42

    *Why:* quick state override. (T1)

## Open questions / uncertain
- Date conflict for the aihero triage page: front matter says updatedAt 2026-05-05; /posts lists it on 2026-07-07; corpus.blog says 2026-07-06. The video is dated 2026-05-07.
- The topaiskills post date also conflicts (2026-08-19 in the search listing, 2026-10-21 in page metadata).
- In the video, Matt shows PRDs and tickets marked ready-for-agent (9:06–9:28). Current docs say `/to-tickets` applies that label itself, so no triage pass is needed.
