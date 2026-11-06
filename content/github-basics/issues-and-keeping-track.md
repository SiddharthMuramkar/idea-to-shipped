---
title: Issues: keeping track of work
slug: issues-and-keeping-track
summary: So the work lives outside the agent, in an Issue tracker: the shared list where work is written down and marked done.
---

## Why the work lives outside the agent

Say you're building a booking site with Claude Code. Today's chat session ends, and tomorrow's starts fresh: unless told, it doesn't know what's planned or finished.

Every **agent**, an AI program like Claude Code that runs commands and edits files, starts each session this way.

**So the work lives outside the agent, in an Issue tracker: the shared list where work is written down and marked done.**

```checkpoint quick-1
Tomorrow's session will start fresh. Where should today's record of the work be?
- [x] In the Issue tracker, where work is written down and marked done.
- [ ] In the agent, which carries today's work over to tomorrow's session.
- [ ] In today's chat session, which tomorrow's session reads by itself.
Why: The work lives outside the agent, in the Issue tracker. That shared list is where work is written down and marked done, so the next session can read it there.
```

An **Issue** is one item in that tracker. Two kinds matter here:

- A **Spec** describes one whole feature: its problem and planned solution.
- A **Ticket** describes one slice of a Spec, built in one session.

```checkpoint quick-2
You write down "Booking API" and "Add the bookings table". Which one is the Ticket?
- [x] "Add the bookings table", since a Ticket is one slice of a Spec.
- [ ] "Booking API", since a Ticket describes one whole feature.
- [ ] Both of them, since a Ticket is any Issue you write down.
Why: A Spec describes one whole feature, such as "Booking API". A Ticket describes one slice of it, such as "Add the bookings table", built in one session.
```

## Where Specs and Tickets live

By default, each is a GitHub Issue, reached with **`gh`**, GitHub's command-line tool. Three features organise them:

- A **label** is a tag on an Issue. `ready-for-agent` means it's fully specified, so an agent can build it.
- A **sub-issue** is an Issue hung under another, such as a Ticket under its Spec.
- A **blocker** is a Ticket that must finish first. You record it on the waiting Ticket with a **blocked-by link**.

```checkpoint quick-3
You want each Ticket to show up under its Spec on GitHub. Which feature does that?
- [x] A sub-issue, which hangs one Issue under another.
- [ ] A label, which tags the Ticket with its Spec's name.
- [ ] A blocked-by link, which names the Spec as its blocker.
Why: A sub-issue hangs one Issue under another, such as a Ticket under its Spec. A label is only a tag, and a blocked-by link names a Ticket that must finish first.
```

A **local tracker** keeps them on disk instead, under `.scratch/`. They're **Markdown** files: plain text with light formatting, like a README. Each feature gets a folder: the Spec is `spec.md`, and each Ticket is a numbered file in `issues/`. For example:

```checkpoint quick-4
You use a local tracker for a booking feature. Where does the feature's Spec go?
- [x] In `spec.md`, in that feature's folder under `.scratch/`.
- [ ] In a numbered file, in that feature's `issues/` folder.
- [ ] In a GitHub Issue, with a copy kept under `.scratch/`.
Why: With a local tracker, each feature gets a folder under `.scratch/`. The Spec is `spec.md`, and each Ticket is a numbered file in `issues/`.
```

```
.scratch/booking-api/spec.md
.scratch/booking-api/issues/01-bookings-table.md
.scratch/booking-api/issues/02-booking-endpoint.md
```

## What's done, and what's next

**On GitHub, a Ticket is done when its Issue is closed.**

```checkpoint quick-5
An agent has committed the code for Ticket #12, but its Issue is still open. Is #12 done?
- [x] No. A Ticket is done only when its Issue is closed.
- [ ] Yes. A Ticket is done once its code is committed.
- [ ] Yes. A Ticket is done once its agent has stopped.
Why: On GitHub, a closed Issue is what marks a Ticket as done. Committed code doesn't, so #12 isn't done until its Issue is closed.
```

The **frontier** is the open Tickets whose blockers are all closed, so you can start them now.

```checkpoint quick-6
#13's only blocker is closed, and #13 is still open. Is #13 on the frontier?
- [x] Yes. It's open, and all its blockers are closed.
- [ ] No. It stays off until you delete its blocked-by link.
- [ ] No. Only the lowest-numbered open Ticket is on it.
Why: The frontier is the open Tickets whose blockers are all closed. #13 fits, so you can start it now.
```

Say your "Booking API" Spec has two Tickets: #12 adds the bookings table, and #13 adds the endpoint that creates a booking. The second is blocked by #12. While #12 is open, only #12 is on the frontier. Close #12, and #13 is next.

```diagram
type: tree
caption: "Close #12, and #13 is next."
root:
  label: "Booking API"
nodes:
  - label: "#12 adds the bookings table"
    state: closed
  - label: "#13 adds the endpoint that creates a booking"
    state: frontier
links:
  - from: "#13 adds the endpoint that creates a booking"
    to: "#12 adds the bookings table"
    label: "blocked by"
```

## Where the Skills fit

A **Skill** is a named set of instructions an agent loads for one job.

A **Flow** is a path through the Skills. The **main flow** runs from an idea to shipped code.

On it, the Skill [to-spec](/learn/to-spec) turns your conversation into a Spec. Then [to-tickets](/learn/to-tickets) splits that Spec into Tickets.

You run [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) first. It's the Skill that records which Issue tracker a repo uses, its labels, and where its docs live. They go in **`docs/agents/`**, the folder of settings the Skills read.

```checkpoint quick-7
[to-tickets](/learn/to-tickets) needs to know which tracker your repo uses. Where does it read that?
- [x] In `docs/agents/`, where setup-matt-pocock-skills records it.
- [ ] In `GLOSSARY.md`, where the project's words are written.
- [ ] In `.scratch/`, where a local tracker keeps its own files.
Why: setup-matt-pocock-skills records a repo's tracker, labels and doc locations in `docs/agents/`. That's the folder of settings the Skills read.
```

The labels are for [triage](/learn/triage): sorting new Issues by what they need next. The docs are the **domain docs**: the project's glossary and decision records.

`GLOSSARY.md` is the **glossary**: the project's agreed words, what they mean, and words to avoid. `docs/adr/` holds **ADRs**, architecture decision records: short files that each record one hard-to-reverse decision and why.

```checkpoint quick-8
You've decided to record a bookings design that would be costly to change. Where does that record go?
- [x] In an ADR, a short file kept in `docs/adr/`.
- [ ] In `GLOSSARY.md`, among the project's agreed words.
- [ ] In `docs/agents/`, among the Skills' settings.
Why: An ADR records one hard-to-reverse decision and why, so that's where this record goes. `GLOSSARY.md` holds the project's words, not its decisions.
```

## Going deeper

### Why it exists

You develop a memory of a messy codebase. An agent can't: it starts afresh every session. Matt Pocock, who wrote most of the Skills taught here, says: "AI agents are like super-smart experts who forget everything between tasks."

So the list of what's planned and what's done can't live in the agent's head. It has to live where the next session can read it, such as GitHub Issues. The Skills fit this: they keep Specs and Tickets in an Issue tracker, so a session can start "without re-deriving what the last one knew."

```checkpoint quick-9
Tomorrow's session needs to know what's done. Where must the list of work live?
- [x] Where the next session can read it, such as GitHub Issues.
- [ ] In the agent's head, where it builds up over each session.
- [ ] In today's session, left open for the next one to reuse.
Why: The agent can't keep the list in its head, because each session starts afresh. So the list has to live somewhere the next session can read, such as GitHub Issues.
```

It's also why you run [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) once per repo, before any other engineering Skill. Without it, the others don't know where your Issues go: they may tell you to run it, or start guessing.

```checkpoint quick-10
You're about to run [to-spec](/learn/to-spec) for the first time in a new repo. What comes first?
- [x] setup-matt-pocock-skills, run once for this repo.
- [ ] setup-matt-pocock-skills, run at each session's start.
- [ ] Nothing, since to-spec works out where your Issues go.
Why: You run setup-matt-pocock-skills once per repo, before any other engineering Skill. Without it, the others don't know where your Issues go: they may tell you to run it, or start guessing.
```

### How it works underneath

**Engineers on shifts.** Anthropic hit the same problem with long-running agents. They pictured "engineers working in shifts, where each new engineer arrives with no memory of what happened on the previous shift."

Their fix was a few plain files: a progress file alongside the git history, and a feature list marking each feature as passing or failing. Each new session read them to see where the last one stopped.

Anthropic kept the feature list in JSON, not Markdown. Their reason: "the model is less likely to inappropriately change or overwrite JSON files compared to Markdown files."

```checkpoint quick-11
Agents keep overwriting your feature list. Which format did Anthropic pick to lower that risk?
- [x] JSON, which the model is less likely to change or overwrite.
- [ ] Markdown, which the model is less likely to change or overwrite.
- [ ] A plain progress file, which only the model is able to change.
Why: Anthropic chose JSON because the model is less likely to wrongly change or overwrite it than Markdown.
```

Think of an Issue tracker as that feature list, kept on GitHub: each Ticket is open or closed, and the next session reads it.

**The order comes from the links.** You don't write a to-do order. You write blocked-by links, and the frontier is worked out from them. Together the links form a **dependency graph**: a map of which Ticket waits for which.

**The graph also unlocks parallel work.** Independent Tickets, the leaves of the graph, can each run in their own session at the same time. For example, say #14 adds a bookings page that nothing blocks. While #12 is open, #12 and #14 are both on the frontier, so two sessions can build them at once.

```checkpoint quick-12
While #12 is open, #12 and #14 are both on the frontier. What can you do?
- [x] Run each one in its own session at the same time.
- [ ] Run them in number order, as one must finish first.
- [ ] Run them in one session, as sessions can't overlap.
Why: Independent Tickets can each run in their own session at the same time. Nothing blocks #14, so it doesn't have to wait for #12.
```

**Local files follow the same rule.** Each Ticket file's "Blocked by" line lists the Tickets it depends on. You work any Ticket whose blockers are done.

### A real example

In a July 2026 tutorial, Matt opens a Spec he built a couple of days earlier, to remove things from a repo. Underneath it sit 11 sub-issues, and he calls each Ticket "a single context window session". The **context window** is everything an agent can see at once.

He clicks into one Ticket, and it's short. Most of the acceptance criteria, the checks that decide whether the work is done, stayed in the Spec. So the Ticket only says what to build in that session.

```checkpoint quick-13
Why could the Ticket Matt opened be so short?
- [x] Most of the acceptance criteria stayed in the Spec.
- [ ] Each Ticket linked out to a long design document.
- [ ] The agent worked out what to build as it went along.
Why: The Spec held most of the checks that decide whether the work is done. So the Ticket only had to say what to build in that session.
```

### Where it goes wrong

**The next Ticket still shows as blocked after the work is finished.** The Skill that does the work has no step that closes the Ticket. [implement](/learn/implement), the Skill that builds a Spec or Tickets, stops at "Commit your work to the current branch." So the Ticket's Issue is still open, and the frontier on the tracker goes stale.

```checkpoint quick-14
implement has committed the work for Ticket #12. What should you expect of #12's Issue?
- [x] It's still open, because implement stops at the commit.
- [ ] It closes, because implement closes it after the commit.
- [ ] It closes, because GitHub closes an Issue on any commit.
Why: implement stops at the commit, and nothing in it closes the Issue. So the Issue stays open, and the frontier on the tracker goes stale.
```

A user reported this in issue #508. After `/implement #42`, the Issue was "still open, no closing comment, nothing marking it as done."

```diagram
type: chain
caption: "So the Ticket's Issue is still open, and the frontier on the tracker goes stale."
steps:
  - "Commit your work to the current branch."
  - "the Ticket's Issue is still open"
  - "the frontier on the tracker goes stale"
```

The fix is to close the Ticket. Matt uses "pull requests which close the issue when merged", and you'll meet this again in [pull requests and merging](/learn/merging-and-cleaning-up). Otherwise, you mark it done yourself.

**GitHub doesn't mark a Ticket as blocked.** The blocker went in as text, not as a real link. In issue #513, to-tickets wrote `Blocked by: #346` into an Issue's body, and the agent then wrongly claimed GitHub had no real link to make. The fix is `gh issue create --blocked-by <n>,<n>`, or `gh issue edit <child> --add-blocked-by <blocker>` for an existing Issue. Both need `gh` 2.94 or later. A text line is only the fallback where dependencies aren't available.

```checkpoint quick-15
A Ticket's body says `Blocked by: #12`, but GitHub doesn't mark it blocked. What's the fix?
- [x] Make a real link, with `gh issue edit` and `--add-blocked-by`.
- [ ] Add the `ready-for-agent` label, so GitHub reads that line.
- [ ] Leave it, since GitHub has no real blocking link to add.
Why: A text line doesn't make GitHub mark the Ticket as blocked, and the agent's claim that GitHub has no real link was wrong. `gh issue edit <child> --add-blocked-by <blocker>` makes one.
```

**Your script says a Ticket is blocked, though every blocker is closed.** `gh issue view <n> --json blockedBy` also lists closed blockers, so counting that list never reaches 0. The fix is to count open blockers only, with `gh api repos/<owner>/<repo>/issues/<n> --jq .issue_dependencies_summary.blocked_by`. There, 0 means the Ticket can start.

```checkpoint quick-16
Your script counts the list from `gh issue view 13 --json blockedBy`. It never reaches 0. Why not?
- [x] The list includes closed blockers as well as open ones.
- [ ] The list keeps only the newest blocker of the Ticket.
- [ ] The list stays empty until the whole Spec is closed.
Why: That list also includes closed blockers, so counting it never reaches 0. `gh api` with `.issue_dependencies_summary.blocked_by` counts open blockers only.
```

**A new Issue landed in the wrong repo.** In a fork, your own GitHub copy of someone else's repo, `gh` can default to theirs. The fix is to check the target before your first new Issue of a session: `gh repo view --json nameWithOwner`.

### Try it

This step creates your **practice project**: the yoga-studio booking site you build for real in your own repo. Every later Try it step builds on it. It has two parts: `api/`, a FastAPI backend with Postgres in Docker, and `web/`, a small TypeScript site with Vercel previews of each pull request.

You'll need Claude Code, Node.js, and `gh` 2.94 or later (`gh --version`), logged in.

1. Create and clone the repo: `gh repo create yoga-studio --private --clone --add-readme`. You should see a new `yoga-studio` folder.
2. Go into it: `cd yoga-studio`.
3. Describe those two parts in `README.md`.
4. Commit and push it: `git add README.md && git commit -m "Describe the project" && git push -u origin HEAD`.
5. Install Matt's Skills, if you haven't yet: `npx skills@latest add mattpocock/skills`. Choose all of them, for Claude Code, in project scope.
6. Start Claude Code: `claude`.
7. Type `/setup-matt-pocock-skills`, and accept its recommended answers, starting with GitHub as the tracker. If it asks which file to create, choose `CLAUDE.md`. Then approve its drafts.
8. Open `docs/agents/issue-tracker.md`. You should see its "Blocking" and "Count open blockers" lines.
9. Back in the terminal, commit and push the new files: `git add -A && git commit -m "Set up the Skills" && git push`.
10. Check the target: `gh repo view --json nameWithOwner`. You should see your own repo.
11. Create the Spec: `gh issue create --title "Booking API" --body "Members can book a class."`. You should see a link ending `/issues/1`.
12. Create the first Ticket: `gh issue create --title "Add the bookings table" --body "First slice." --parent 1`.
13. Create the second: `gh issue create --title "Add the endpoint that creates a booking" --body "Second slice." --parent 1 --blocked-by 2`.
14. Open the Spec: `gh issue view 1 --web`. You should see two sub-issues.
15. Open the Issues page: `gh issue list --web`. You should see a "Blocked" icon on #3.
16. Count #3's open blockers: `gh api repos/{owner}/{repo}/issues/3 --jq .issue_dependencies_summary.blocked_by`. You should see `1`.
17. Close #2: `gh issue close 2`.
18. Run the count from step 16 again. You should see `0`, so #3 is on the frontier.

You closed #2 only to watch the count drop, so no table exists yet. [implement](/learn/implement)'s Try it builds it with #3.

### Read more

- [11 Tips For AI Coding With Ralph Wiggum](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum), Matt Pocock, updated 2026-01-08
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), Justin Young, Anthropic, 2025-11-26
- [AI Skills with Matt Pocock](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock), Gergely Orosz, The Pragmatic Engineer, 2026-09-17
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [/implement has no completion step, finished tickets are never marked done (issue #508)](https://github.com/mattpocock/skills/issues/508), HorvathAlteisen, 2026-07-10
- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills), Matt Pocock, updated 2026-08-24

## Remember

```flashcards
Q: On a GitHub Issue tracker, how can you tell a Ticket is done?
A: Its Issue is closed.

Q: What is the frontier?
A: The Tickets whose blockers are all done, so you can start them now.

Q: With the local tracker, where do a feature's Spec and Tickets live?
A: In `.scratch/<feature>/`. The Spec is `spec.md`, and each Ticket is a numbered file in `issues/`.

Q: On GitHub, how is a Ticket tied to its Spec?
A: It's a sub-issue of the Spec.

Q: Why isn't counting `gh issue view <n> --json blockedBy` enough to tell if a Ticket can start?
A: It lists closed blockers too. Count only open blockers; 0 means the Ticket can start.

Q: What picture does Anthropic use for agents working across many sessions?
A: Engineers working in shifts, where each new engineer arrives with no memory of the previous shift.

Q: What does a Spec's dependency graph of Tickets unlock?
A: Parallel work. Independent Tickets, the leaves of the graph, can each run in their own session at the same time.
```

## Final test

```final-test keeping-track-where-tickets-live
Your repo was set up with GitHub as its Issue tracker. Where does a new Ticket go?
- [x] A new Issue in the repo's GitHub Issues.
- [ ] A new section in `docs/agents/issue-tracker.md`.
- [ ] A new term in the repo's `GLOSSARY.md`.
- [ ] A new numbered file under `docs/adr/`.
Why: GitHub is the tracker, so a new Ticket goes where GitHub keeps its items, as a new Issue. `docs/agents/`, `GLOSSARY.md` and `docs/adr/` hold settings, words and decisions, not the work itself.
```

```final-test keeping-track-docs-agents
What does `docs/agents/` hold?
- [x] Settings the Skills read, like which Issue tracker to use.
- [ ] The Specs and Tickets, one Markdown file for each Issue.
- [ ] Records of the design decisions made so far, one file each.
Why: setup-matt-pocock-skills records your tracker, labels and doc locations in `docs/agents/`, so the Skills can read them there. Specs and Tickets live in the tracker, and decisions go in `docs/adr/`.
```

```final-test keeping-track-whats-next
Ticket #13 is blocked by #12, and #12 is still open. Can you start #13?
- [x] No. #13 waits until every Ticket blocking it is closed.
- [ ] Yes. Blocked-by links show an order but do not stop you.
- [ ] Yes, once #12 has the `ready-for-agent` label on it.
Why: A blocker must finish first, and a Ticket is unblocked only when every blocker is closed. #12 is still open, so #13 isn't on the frontier yet. A label on #12 doesn't change that.
```

```final-test keeping-track-deeper-who-closes
On GitHub, `/implement` has finished Ticket #2 and committed. #3 is blocked by #2. What makes #3 show as unblocked?
- [x] Closing #2, for example by merging a pull request that closes it, since implement stops at the commit.
- [ ] Nothing more, because implement closes #2 itself as the last step after its code review passes.
- [ ] Running to-tickets again, which re-reads the commits and moves each finished Ticket off the frontier.
Why: implement stops at the commit, and nothing in it closes the Issue. So #2 stays open, and #3 stays blocked. Something else has to close #2. Matt merges a pull request that closes it; otherwise you close it yourself.
```

```final-test keeping-track-deeper-why-outside
Why does the list of work live outside the agent?
- [x] Each new session starts fresh, so the list must live where the next session can read it.
- [ ] The agent remembers past tasks, but GitHub lets teammates see the list as well.
- [ ] Context windows are too small to hold a Spec, so it is split into Issues instead.
Why: Each new session starts fresh, so it won't know the list unless it's told. Kept outside it, somewhere like GitHub Issues, the list is there for the next session to read.
```

```sources
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop), Anthropic (Claude Code docs)
- [Configure permissions](https://code.claude.com/docs/en/permissions), Anthropic
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), Justin Young (Anthropic), 2025-11-26
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: triage-labels.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/triage-labels.md), Matt Pocock's Skills
- [triage: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/SKILL.md), Matt Pocock's Skills
- [Adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues)
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [Creating issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies)
- [setup-matt-pocock-skills: issue-tracker-local.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md), Matt Pocock's Skills
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), Michael Nygard, 2011-11-15
- [domain-modeling: ADR-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/ADR-FORMAT.md), Matt Pocock's Skills
- [domain-modeling: GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: domain.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/domain.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05
- [Orca skills registry & MCP — Orca Docs](https://www.onorca.dev/docs/cli/skills), Stably, Inc.
- [11 Tips For AI Coding With Ralph Wiggum](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum), Matt Pocock, 2026-01-08
- [AI Skills with Matt Pocock](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock), Gergely Orosz, 2026-09-17
- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills), Matt Pocock, 2026-08-24
- [Ticket | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/ticket), Matt Pocock
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [/implement has no completion step, finished tickets are never marked done (#508)](https://github.com/mattpocock/skills/issues/508), HorvathAlteisen, 2026-07-10
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, 2026-08-24
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, 2026-08-24
- [to-tickets didn't create blocking relationships between GitHub issues (#513)](https://github.com/mattpocock/skills/issues/513), ctrom, 2026-07-10
- [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests)
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [Learn Anything With My /teach Skill](https://www.aihero.dev/learn-anything-with-my-teach-skill), Matt Pocock, 2026-06-08
- [gh issue create](https://cli.github.com/manual/gh_issue_create), GitHub CLI manual
```
