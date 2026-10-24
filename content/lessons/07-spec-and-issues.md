---
title: Spec + tickets
slug: spec-and-issues
order: 7
part: 2
image: /photos/spec-and-issues.jpg
imageAlt: A person drafts on a large sheet with a scale ruler and a rolled blueprint on a wooden table.
imageCredit: Daniel McCullough
---

When a build is too big for one sitting with your coding agent, write what you agreed into a spec (one document saying where you're going) and a few thin tickets (small tasks that get you there) before you start a fresh conversation.

```goals
- You'll be able to decide whether a grilled change needs `/to-spec` and `/to-tickets`, or goes straight to `/implement`.
- You'll be able to run `/to-spec` and `/to-tickets` in the same session as your grilling, answering the seam check and reviewing the breakdown before anything is published.
- You'll be able to tell a tracer-bullet ticket from a horizontal one, read blocking edges and say which tickets are ready to start.
- You'll be able to avoid the common traps: clearing too early, triaging these tickets, too many tickets, and forcing a wide refactor into slices instead of using expand–contract.
```

## Why it matters

Say you've just spent forty minutes being grilled by Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal), which interviewed you round after round about a new feature for this site. The feature puts Checkpoints and a Final test under every Lesson and saves each Visitor's Answers (a Visitor is anyone reading the site). Every decision is settled, and it all lives in one place: the conversation.

That conversation is a session, and all of it sits in the agent's context window: its working memory, measured in tokens (small chunks of text). Matt Pocock, a developer and teacher, publishes a popular set of Skills for Claude Code: short instruction files the agent loads when you type their name, or, for some, when a task fits (see [Skills](/learn/skills)). He calls the part where the model (the AI behind the agent) still reasons sharply the Smart zone: about 150k tokens on today's best models, as a rule of thumb. Type `/context`, a Built-in command (one that comes with Claude Code itself), to see how full yours is. A feature this size won't fit in the room you have left. Push on, and the agent gets sloppier as it builds the second half. Clear the window instead with `/clear`, another Built-in command, and the agent starts again with none of the conversation.

So the decisions must land in files a fresh session can read. His Skills do that in two steps: `/to-spec` writes the spec (what to build and why), then `/to-tickets` cuts it into tickets, each sized for one fresh session. They pick up where his grilling Skill, `/grill-with-docs`, left off. If the work fits the room you have left, skip both and type `/implement`, the Skill that builds the agreed change right there.

```checkpoint why-write-it-down
You've grilled a recipe-site feature that will take about three sessions to build. Why can't the second session simply carry on from the conversation?
- [ ] The agent isn't allowed to write any code until a spec file exists.
  > No such rule: `/implement` builds straight from the conversation when the work fits in one session.
- [x] A new session starts without it, so write the decisions down.
  > Right. A fresh session has seen none of the conversation. The spec and tickets carry your decisions across.
- [ ] Every session shares one context window, so the spec is only for teammates.
  > Each session gets its own context window, and a fresh one has seen none of the conversation. The decisions need to be in files.
- [ ] It can: `/to-tickets` copies the whole conversation into each ticket.
  > Tickets hold what to build, what blocks it and acceptance criteria, not the conversation. A new session still starts without it.
```

## The idea: a destination and a route

Matt calls the ==spec== the destination and the tickets the route. Each ticket names the tickets that must finish before it. The spec stays as the record of why; each ticket is done with once it's built.

```callout big-idea
Neither Skill makes your decisions. `/to-spec` writes down what you already decided; `/to-tickets` proposes how to cut it up, and you approve the cut. Both leave the result where a fresh session can pick it up without you in the room.
```

First, the project needs to know where tickets live. A repo (a project folder whose history Git, the standard version-control tool, keeps) learns this once, from `/setup-matt-pocock-skills`. It asks which issue tracker you use: the place a project keeps its tasks, called issues (the spec and each ticket become one issue apiece). That can be GitHub or GitLab (websites that host repos, each with an issues list), markdown (plain `.md` text) files in the repo, or another tracker you describe, such as Jira. It records your answer in `docs/agents/issue-tracker.md` and points to it from `CLAUDE.md`, the file of standing instructions the agent reads at the start of every session (or from `AGENTS.md`, if the repo already has that).

This site uses the local-markdown tracker, laid out like this:

- One folder per feature: `.scratch/<feature>/`.
- The spec at `.scratch/<feature>/spec.md`.
- One file per ticket at `.scratch/<feature>/issues/01-<name>.md`, then `02-…`, numbered with blockers first.
- A `Status:` line near the top of each file, such as `ready-for-agent` (fully specified, needing no more sorting).

Both Skills are ==user-invoked==: only you can start them, by typing the name at the start of your message. However finished the grilling feels, the agent won't start `/to-spec` for you, and "let's write the spec" in plain words won't either.

```scene files
title: What lands in the repo (illustrative)
# Once per repo, setup records where tickets live, plus two more settings files.
+ docs/agents/issue-tracker.md
+ docs/agents/triage-labels.md
+ docs/agents/domain.md
~ CLAUDE.md
# `/grill-with-docs` writes the words you agree on into `GLOSSARY.md`, the project's word list, as you go.
~ GLOSSARY.md
# `/to-spec` publishes one spec, marked ready-for-agent.
+ .scratch/final-test/spec.md
# `/to-tickets` writes one file per ticket, blockers first.
+ .scratch/final-test/issues/01-one-checkpoint-end-to-end.md
+ .scratch/final-test/issues/02-final-test-with-a-score.md
+ .scratch/final-test/issues/03-answers-survive-a-reload.md
# Each build session works from one ticket file, and you update its Status when it's built.
~ .scratch/final-test/issues/01-one-checkpoint-end-to-end.md
```

## `/to-spec`: write down what you decided

Type `/to-spec` in the same conversation, right after you confirm the grilling summary. ==It doesn't interview you.== It only puts together what's already known: the conversation, the code, the glossary (`GLOSSARY.md`, the words you agreed) and the ADRs (short records of hard-to-reverse decisions). Matt's docs are blunt: "If the spec states something you never said, that is a defect."

It works in three steps:

1. **Explore.** It reads the code if it hasn't already, and uses the glossary's words throughout.
2. **Check the seams with you.** A seam is a place where tests (small programs that check the code does what it should) can check the feature from the outside, such as the functions a module (a self-contained chunk of code) offers the rest of the program. It prefers existing seams, picks the highest-level one it can (so tests check behaviour, not internals) and proposes as few as possible; one is ideal. Then it stops and asks whether they match what you expect.
3. **Write and publish.** It fills in a fixed template, saves the spec to your tracker (on the local tracker, that just means writing the file) and labels it `ready-for-agent`.

The seam question is the one moment `/to-spec` waits for you. Later, `/tdd` (Matt's test-first building Skill; see [TDD](/learn/tdd)) writes tests only at seams you agreed, and Matt's `code-review` Skill checks the finished code against the spec (type `/mattpocock-skills:code-review` to start it yourself; plain `/code-review` reaches Claude Code's own Built-in command of that name). ==Answer the seam question before you type anything else.==

The template has seven sections: Problem Statement and Solution (both from the user's side), a long numbered list of User Stories ("As a (who), I want (what), so that (why)"), Implementation Decisions, Testing Decisions, Out of Scope (what you refused) and Further Notes. It holds no file paths or code, which go stale fast, apart from a trimmed snippet from a prototype (a quick throwaway version built to test an idea) that pins a decision down better than words.

The spec is written mostly for agents, but do read the seams and Out of Scope: a mistake there is cheap to fix now and costly later. One quirk: on the spec, `ready-for-agent` means complete, not "build me", so if you ever let an agent work unattended through everything with that label, tell it to skip the spec.

```checkpoint invented-limit
`/to-spec` has written the spec for a book-club site. Under Implementation Decisions it says "Reviews are limited to 300 words." Nobody mentioned a limit while grilling, and nothing in the code, `GLOSSARY.md` or the ADRs sets one. What is this line?
- [ ] A normal detail: filling gaps with sensible defaults is the Skill's job.
  > No. `/to-spec` records decisions; it doesn't make new ones. A gap it filled is a guess with your name on it.
- [ ] A guess you can leave: the spec is mostly for agents, not for you.
  > Mostly for agents, but every line should still be your decision, and the tickets get cut from this one.
- [x] Something it invented: settle it with a decision, then fix the spec.
  > Right. If the spec says something you never said, it's a defect. Decide it or strike it before the tickets are cut from it.
- [ ] A sign to `/clear` and run `/to-spec` again from scratch.
  > Clearing empties the conversation the spec is written from. Fix the one line instead.
```

## `/to-tickets`: tracer bullets with blocking edges

Next, still in the same conversation, type `/to-tickets`. It works from the spec in view, or one you name, like `/to-tickets .scratch/final-test/spec.md`.

Its core idea is the ==tracer bullet==, from the book *The Pragmatic Programmer*, named after the glowing rounds that show gunners where they're aiming. In software, it's a thin piece of a feature that runs through every layer at once (the database, the API that other code calls, the screen, and the tests), so you can try it the moment it lands.

The opposite is a horizontal slice: one layer per ticket. Matt has noticed that AI loves to build this way, so nobody gets feedback until the last layer lands. This site's own first plan, written from the plain words `write the spec` before the author used these Skills, had that shape for comments: a ticket for their database table, then one for their API, then one for the comment box. A Visitor couldn't post a Comment until the last of those landed. The tracer-bullet version: a Visitor posts a Comment and still sees it after a reload.

The Skill drafts tickets by four rules:

- Each ticket cuts a narrow but complete path through every layer.
- Once it's done, it can be demoed or checked on its own.
- It fits in one fresh context window.
- Prefactoring (tidying the code so the change becomes easy) goes first. The Skill sums it up with a line borrowed from Kent Beck, a well-known software author: "Make the change easy, then make the easy change."

Each ticket also lists its **blocking edges**: the tickets that must finish before it can start. The **frontier** is every ticket whose blockers are all done: the ones ready to build now, possibly by several agents at once.

Before publishing, it shows you a numbered breakdown (title, what blocks it, what it delivers) and asks: is the size right, are the edges real, should anything merge or split? This review step repeats until you approve. ==Ask of every ticket: what can I demo when this is done?== If nothing, and it isn't prefactoring, it's a horizontal slice.

Then it publishes. Locally that's one file per ticket, numbered blockers first, each with **What to build** (the behaviour from the user's side), **Blocked by** (or "None (can start immediately)"), `Status: ready-for-agent` and acceptance criteria: checks that prove it's done. The template doesn't make sure each one can fail, so read them: a criterion that's already true before any work starts proves nothing. On a real tracker like GitHub, each ticket becomes an issue, with the tracker's own blocking links where it has them, filed under the spec's issue if it started from one. It never edits the spec.

### The exception: wide refactors

A refactor reshapes code without changing what it does. A wide one is a single mechanical change, like renaming a database column, that touches thousands of places at once, so no thin slice can land without breaking the rest. `/to-tickets` orders it as **expand–contract**:

1. **Expand:** add the new form beside the old one, so nothing breaks.
2. **Migrate:** move the code over in batches (a folder at a time, say), one ticket per batch, each blocked by the expand. The old form still works, so the automatic checks stay green (passing) after every batch.
3. **Contract:** delete the old form in a last ticket, blocked by every batch.

```checkpoint first-tracer-bullet
`/to-tickets` is drafting tickets for a recipe site. Which proposed first ticket is a tracer bullet?
- [x] A cook adds one recipe and finds it in their list the next day.
  > Right. It runs through storage, the API and the page at once, and you can try it the moment it lands.
- [ ] A cook can browse every page of the finished design, filled with sample recipes.
  > Screens with nothing behind them. It's a horizontal slice, just from the top instead of the bottom.
- [ ] A database table for recipes, with just a title column, ready for later tickets.
  > Thin, but only one layer. A cook can't try anything until other tickets add the API and the page.
- [ ] Other code can fetch recipes, ratings and comments through the API.
  > The middle layer only, for three features at once. Thin and complete beats wide and partial.
```

## A session, step by step

Here's the Final test feature from the start of this page, in one sitting. Grilling (see [Grilling](/learn/grilling)) is confirmed, and the session still has room.

```scene chat
title: Spec and tickets for a Final test feature on this site (illustrative)
# Grilling is confirmed and the build needs several sessions. In the same conversation, you type the next Skill.
you: `/to-spec`
# No new interview. It explores, then stops once: to check the seams.
agent: Before I write it: I'd test at two seams. The existing **Lessons module**, which will read each Lesson's questions, and a new **attempts module** for saving and scoring Answers, since nothing does that yet. Do these match what you expect?
# You answer that question before typing anything else.
you: Yes, both. Keep scoring inside the attempts module.
# It writes the spec from the conversation and publishes it.
agent: Published `.scratch/final-test/spec.md` (Status: ready-for-agent) with Problem Statement, Solution, 24 user stories, Implementation Decisions, Testing Decisions, Out of Scope and Further Notes.
# Still no `/clear`. You type the next Skill.
you: `/to-tickets`
# It drafts a numbered breakdown and asks you to check it before publishing anything.
agent: 1. **Answers table and attempts module.** Blocked by: none. Delivers: Answers can be saved. 2. **One Checkpoint end to end.** Blocked by: 1. Delivers: a Visitor answers a Checkpoint and sees the feedback. 3. **Final test with a score.** Blocked by: 2. Delivers: a score at the end. 4. **Answers survive a reload.** Blocked by: 2. Delivers: earlier Answers reappear. Is the size right? Are the blocking edges real? Should anything merge or split?
# You push back: ticket 1 is a horizontal slice, with nothing a Visitor can try.
you: 1 is one layer, with nothing to demo. Merge it into 2, so the first ticket is one Checkpoint working end to end.
# It redraws, you approve, and only then does it write one file per ticket, blockers first.
agent: Redrawn: 01 One Checkpoint end to end (blocked by: none), 02 Final test with a score (blocked by: 01), 03 Answers survive a reload (blocked by: 01). Approve?
you: Approved.
agent: Written to `.scratch/final-test/issues/`, 01 to 03.
```

You were needed twice: the seam check and the review step. Now everything that matters is on disk, so you can `/clear` and build one ticket per fresh session, or hand the whole set to `/implement-spec`, which builds ready tickets in parallel (see [Implement](/learn/implement)).

## Your part: when to use them, and when not

After grilling (and any prototype detour), Matt's Main flow (the path most work takes, from idea to shipped; see [The main flow](/learn/main-flow)) asks: is this a multi-session build?

| Where you are | What to type |
|---|---|
| Nothing is decided yet | `/grill-with-docs` first |
| Decided, and it fits the room this session has left | `/implement`, right here; skip the spec |
| Decided, and it needs several sessions | `/to-spec`, then `/to-tickets` |
| A huge, foggy effort you can't plan in one sitting | `/wayfinder` (Part 4), which hands over to `/to-spec` once its map is clear |

**Keep it in one window.** Don't `/clear`, or `/compact` (the Built-in command that swaps the conversation for a summary), until after `/to-tickets`. The spec is written from the conversation, and the tickets come out better with its reasoning still in view. The one exception: if the session nears the end of the Smart zone before `/to-tickets`, `/compact` at the nearest phase boundary (a natural break between chunks of work, such as the end of grilling).

**Don't triage these tickets.** `/triage` (see [Triage](/learn/triage)) sorts issues that arrive raw from other people, like bug reports. Tickets from `/to-tickets` are ready for an agent from the start.

**Keep the books yourself.** `/implement` has no step for marking a ticket done, so change its `Status:` line yourself (this site writes `resolved`).

**Check that the seam reached the ticket.** The ticket templates have no field for the seams `/to-spec` agreed, so check that each ticket needing tests names its seam, and add it by hand if not.

```checkpoint triage-these
`/to-tickets` has just written four tickets for your newsletter feature. A friend says: "Run `/triage` over them first, to be safe." What do you say?
- [ ] Yes: every new issue should go through triage before an agent builds it.
  > Triage is for issues you didn't create. These came out of your own grilling and spec.
- [ ] Yes: triage adds the `ready-for-agent` status they still lack.
  > They already carry `Status: ready-for-agent`: `/to-tickets` writes it into every ticket.
- [ ] No: `/triage` only works on GitHub issues, not on local files.
  > Right call, wrong reason: triage works on a local tracker too. It's for issues you didn't create, and these came from your own spec.
- [x] No: they're ready for an agent already; triage is for raw issues.
  > Right. `/to-tickets` output is agent-ready from the start. Triage sorts bug reports and requests that arrive from other people.
```

## How Matt and others use it

**Matt Pocock**, in his videos:

- **One window, no clearing.** In his July 2026 walkthrough a small cleanup fitted his remaining room, so he'd normally type `/implement`. To demo the long road he typed `/to-spec`, which squeezed 46.1k tokens of grilling into a spec, then `/to-tickets` in the same session. (His went into one `tickets.md`; since 1.2.0 it's one file per ticket.)
- **He pushes back on size.** That session proposed three slices; he said one would do. In March 2026, with the older Skills write-a-PRD (a PRD, product requirements document, is the old name for a spec) and PRD-to-issues, he merged six tickets down to four, because each ticket pays for a fresh agent start-up.
- **Seams first.** That March Skill asked which modules needed tests; he picked those with test setups, and told it to look harder when it claimed there were none. He didn't read the spec; today's docs say to read at least the seams and Out of Scope.
- **Slices, not layers.** At an April 2026 workshop he told the agent its first slice was "too horizontal", and said he prefers a board of tickets with blocking edges to a numbered plan only one agent can work through.

**Other developers:**

- Colin Eberhardt, CTO of Scott Logic, rebuilt a karting-tracker app with the Skills in October 2026. `/to-spec` proposed one seam; `/to-tickets` made eight sensible, lightweight tickets. For simple create-and-edit screens, he'd have preferred a data model to user stories.
- A September 2026 GitHub issue counted 17 `/implement` runs in which `/tdd` never ran, and traced it to tickets dropping the seams `/to-spec` agreed. It's still open, which is why you check the seam yourself.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). An app this small would normally just get `/implement`; here it's cheap practice for both Skills.

1. Make a practice folder, turn it into a Git repo and start Claude Code. If it asks whether you trust this folder, choose Yes. (If your terminal says `git` isn't found, skip that line; nothing here needs it.)

```sh
mkdir todo-practice
cd todo-practice
git init
claude
```

2. Type a slash and the letters "to-". If `to-spec` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box, press Shift+Tab until it changes: plan mode only reads and proposes, and this exercise needs files written. If the agent asks permission to create or edit a file in `todo-practice`, choose Yes; if it asks to run anything else you don't understand, choose No.
4. Type `/setup-matt-pocock-skills`. Choose **Local markdown** for the tracker, choose `CLAUDE.md` if it asks which file to create, and accept the other recommendations.
5. Start grilling. Keep steps 5 to 8 in this one conversation, with no `/clear`:

```text
/grill-with-docs I want a single web page to-do list: add an item, tick it off, and the list survives a page reload. Keep it tiny: no accounts, no server.
```

6. It asks a few numbered questions at a time, each with a recommended answer. Answer by number: "yes" accepts a recommendation, or give your own. After two or three rounds, type: "Let's wrap up. Summarise what we decided and what's out of scope."
7. Confirm the summary and add: "Don't build anything yet." (If it starts building the page anyway, press Esc.) Then, in a new message, type `/to-spec`. When it stops to show you the seams, reply before typing anything else: "Yes, that matches", or, if it proposes several, ask whether one would do.
8. Type `/to-tickets`. At the numbered list, ask: "For each ticket, what can I demo when it's done?" Merge any ticket without a good answer, then approve.
9. Ask: "List every file you wrote under .scratch, then show me spec.md." If it offers to start building, say no, or press Esc to stop it. Type `/exit` when you're done.

**It's working if:**

- [ ] `/to-spec` asked no new round of questions, and checked the seams with you before writing.
- [ ] `spec.md` follows the template's sections, with no file paths.
- [ ] You remember making every decision in it, and Out of Scope lists things you refused, like accounts.
- [ ] The tickets are separate files, `01-…`, `02-…`, each with **What to build**, **Blocked by**, `Status: ready-for-agent` and a checklist, with no item already true.
- [ ] Ticket 01 says "None (can start immediately)".
- [ ] Each ticket delivers something you could try in the browser, and there are two or three, not ten.
````

## Common mistakes

- **Clearing before `/to-tickets`, or compacting while there's still room.** One window for grilling, spec and tickets; `/compact` only if you near the end of the Smart zone first.
- **A spec for single-session work.** Go from grilling to `/implement`.
- **Typing past the seam check, or letting the spec invent.** Every line should be your decision.
- **Horizontal tickets, or far too many.** Ask what each one lets you demo, and merge at the review step.
- **Triaging these tickets.** They're agent-ready.

```site-story
**The first time, I used plain words.** For v1 I typed `write the spec`. Following `docs/agents/issue-tracker.md`, the agent wrote a one-page spec in `.scratch/lesson-site/spec.md` and six tickets, each with a `Status:` (`ready-for-agent`, or `ready-for-human` for logins only I could do), a "Blocked by" line and a "Done when" checklist. It flagged three things it had added that I hadn't decided: length limits on comments, rejecting unknown Slugs (a Slug is the one-word name in a Lesson's web address, like `grilling`), and deploying the empty app early. I approved all three. My lesson then: my job isn't writing code; it's writing, or approving, good "Done when" lists, then checking them.

**For the redesign, I used the real Skills:** grilling, then `/to-spec`, then `/to-tickets`, then `/implement-spec`, with no `/clear` in between. The spec followed the template, with 35 user stories and one seam, the Lessons module. Five tickets came out, two of which could run side by side, and ticket 02 carried the seam into the build: "Build the Lessons module change with `/tdd`."

**My slip.** `/to-spec` stopped to ask me to check one design choice. I typed `/to-tickets` instead of answering, so the spec got written with the agent's best guess.

`/implement-spec` then built the tickets with helper agents, each in its own worktree (a separate checkout of the repo), and every ticket ended with a build note and `Status: resolved`. What I'd do differently: answer the open question before typing the next Skill. It stopped for a reason.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Once per repo | `/setup-matt-pocock-skills` |
| Grilling done, fits this session | `/implement`, right here |
| Grilling done, needs several sessions | `/to-spec`, in the same conversation |
| `/to-spec` asks about seams | Answer first; fewer is better |
| Spec written | Read the seams and Out of Scope, then `/to-tickets` |
| Reviewing the breakdown | "What can I demo when this is done?" Merge or split |
| A wide refactor | Expand, migrate in batches, contract |
| Tickets published | Now `/clear`; one ticket per fresh session, or `/implement-spec` |
| Never | `/triage` these tickets |

## Final test

```test scenario-fits-one-session
You've grilled a "print this recipe" button for a recipe site. `/context` shows about 40k tokens used, and the build is small. A teammate says anything users will see deserves a spec first. What do you type next?
- [ ] `/to-spec`, then `/to-tickets`, so the work is documented.
  > That's the road for multi-session builds. Here it's an extra writing step with room for drift, and nothing needs carrying across sessions.
- [ ] `/clear`, then `/implement` in a fresh session.
  > Clearing takes the decisions out of this session, so `/implement` would start with none of them. Build in this conversation.
- [x] `/implement`, in this same conversation.
  > Right. It fits the room you have and every decision is in this conversation; a spec only pays when the build spans sessions.
- [ ] `/to-tickets` on its own, to keep each step small.
  > Splitting a one-session change into tickets only adds fresh-session start-up costs.
```

```test scenario-wide-rename
Your team has to rename a field used in about 3,000 places, far more than one session can change. Renaming it anywhere breaks every caller still using the old name. How should the tickets be shaped?
- [x] One ticket adding the new name, one per batch of callers, then one deleting the old.
  > Right. That's expand–contract. Each batch keeps the checks green because the old name still works, and the last ticket deletes it once nothing uses it.
- [ ] One tracer-bullet ticket for each screen that shows the field.
  > Tracer bullets suit features. Here every caller breaks at once, so no thin slice can land green.
- [ ] One ticket that renames all 3,000 places in a single pass.
  > 3,000 call sites won't fit in one fresh context window, and nothing is green until the last one changes.
- [ ] One ticket per layer, so the database changes first, then the API, then every screen.
  > Layer slicing doesn't help: the database rename alone breaks every caller above it.
```

```test scenario-two-agents
Your tickets: 01 is blocked by nothing; 02 is blocked by 01; 03 is blocked by 01; 04 is blocked by 02 and 03. Ticket 01 is done and you have three agents free. Which tickets can they start?
- [ ] Only 04, since 02 and 03 both point to it.
  > That reads the edges backwards. 04 is blocked by 02 and 03, so it starts last. 02 and 03 wait only on 01, which is done.
- [ ] Only 02, because tickets go strictly in number order.
  > Numbering only puts blockers first. 03's one blocker is done too, so it's ready.
- [ ] 02, 03 and 04, since 01 was the first ticket.
  > 04 needs both 02 and 03 finished. It isn't on the frontier yet.
- [x] 02 and 03, since each one's only blocker is done.
  > Right. The frontier is every ticket whose blockers are all done. Both depend only on 01; 04 waits for both of them, so the third agent waits too.
```

```test scenario-too-many-tickets
A blog's sharing feature needs several sessions. `/to-tickets` shows its breakdown, and the "copy link" button alone is nine tickets: one for the icon, one for the click handler, one for the "Copied!" message, and so on. What's your best move?
- [ ] Approve; more, smaller tickets are always safer.
  > Every ticket costs a fresh session's start-up, and nine slivers of one button lose the grouping that makes them meaningful.
- [x] Say they're too fine, and merge the button into one ticket.
  > Right. The review step is where you fix the size. One button is one demoable slice, and every extra ticket costs a fresh session's start-up.
- [ ] Approve them, then run `/triage` afterwards to merge the small ones.
  > `/to-tickets` output is agent-ready from the start; `/triage` is only for issues you didn't create, like bug reports. It doesn't reshape tickets.
- [ ] Merge the whole sharing feature into one ticket instead.
  > Too far the other way: the feature needs several sessions, so one ticket won't fit in a fresh context window. Merge just the button.
```

```test spot-cleared-before-tickets
Ana finished grilling and typed `/to-spec`. Then she typed `/clear` "to start the tickets with a clean slate", and finally `/to-tickets` with the spec's path. Spot the mistake.
- [x] `/clear` came too early: grill, spec and tickets belong in one window.
  > Right. The spec file survives, but the reasoning behind it doesn't, and the tickets come out better with that reasoning still in view. Clear after `/to-tickets`.
- [ ] `/to-tickets` can't read a spec from a file path, only from the conversation.
  > It can: give it a path or an issue number and it fetches it. The problem is that clearing emptied the reasoning from the window.
- [ ] She should have typed `/to-tickets` before `/to-spec`.
  > Tickets are cut from the spec, so the spec comes first.
- [ ] She should have run `/compact` after the grilling as well.
  > Compacting is for a session nearing the end of the Smart zone. Here the fix is simply not clearing until after `/to-tickets`.
```

```test spot-seam-skip
Sam ran `/to-spec` for a shop's refunds feature. It explored the code and ended its message: "I'd test at the existing orders module and a new refunds module. Does that match what you expect?" Sam typed `/to-tickets` to keep things moving. Spot the mistake.
- [ ] The agent broke its rules: `/to-spec` isn't supposed to ask anything.
  > It asks no new round of questions, but it does stop once, to check the seams. That question was Sam's to answer.
- [ ] Nothing: the agent's own guess at the seams is usually good enough.
  > Seams decide where `/tdd` writes tests and what Matt's `code-review` Skill checks against. They're yours to agree, not the agent's to guess.
- [x] Sam never agreed the seams, so the agent had to guess them.
  > Right. The seam check is the one moment `/to-spec` waits for you. Answer it before typing the next Skill.
- [ ] Seams belong in the tickets, so Sam can agree them when `/to-tickets` asks.
  > `/to-tickets` never asks about seams, and its templates have no field for them. The spec is where they get agreed.
```

```test spot-horizontal
Lee approved this breakdown for a booking site: 01 every database table, 02 every API route, 03 every screen, each blocked by the one before. Spot the mistake.
- [ ] Too few tickets: it should have been twelve smaller ones.
  > More layer tickets would make it worse. The problem is the direction of the cut.
- [x] Each ticket is one layer, so nothing can be tried until 03 lands.
  > Right. Horizontal slices push all feedback to the end. A tracer bullet runs through every layer and can be tried on its own.
- [ ] The tickets needed file paths and line numbers so agents could find the code.
  > Tickets avoid file paths because they go stale. The cut was the problem.
- [ ] 03 should be blocked by nothing, so the screens can start at once.
  > Screens with nothing behind them still can't be tried. Changing the edges doesn't fix a cut by layer.
```

```test scenario-what-to-triage
Your tracker holds two new issues: a bug report a stranger filed this morning, and ticket 03, which `/to-tickets` wrote from your spec yesterday. Which should go through `/triage`?
- [x] Only the stranger's bug report.
  > Right. Triage sorts issues you didn't create. Ticket 03 came from your own spec and is ready for an agent.
- [ ] Only ticket 03, because it's the one an agent will build.
  > Ticket 03 is agent-ready already: `/to-tickets` wrote `Status: ready-for-agent` into it.
- [ ] Both, so every issue is checked before an agent builds it.
  > Triage is for issues you didn't create. Ticket 03 came from your own grilling and spec.
- [ ] Neither: an agent can build a bug report straight from the tracker.
  > A raw report has no category or status yet. `/triage` sorts it and writes an agent-ready brief first.
```

```test sequence-multi-session
You're in a repo, planning a feature that needs several sessions to build. Which order is right?
- [ ] `/grill-with-docs` → `/clear` → `/to-spec` → `/to-tickets` → `/implement` each ticket
  > Clearing after grilling empties the conversation `/to-spec` writes from.
- [ ] `/grill-with-docs` → `/to-tickets` → `/to-spec` → `/clear` → `/implement` each ticket
  > Tickets are cut from the spec, so the spec has to come first.
- [ ] `/grill-with-docs` → `/to-spec` → `/clear` → `/to-tickets` → `/implement` all at once
  > Clearing before `/to-tickets` breaks the one-window rule, and one session building every ticket runs past the Smart zone.
- [x] `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/clear` → `/implement` per ticket
  > Right. One window for grilling, spec and tickets; then a fresh session per ticket, clearing in between.
```

```test scenario-near-smart-zone
Grilling a podcast-site feature ran long. It's settled and needs several sessions to build, and the session is close to the end of the Smart zone. You haven't typed `/to-spec` yet. What next?
- [ ] `/clear`, then `/to-spec` in the fresh, empty session.
  > Clearing empties the conversation `/to-spec` writes from, so the fresh session has none of your decisions.
- [ ] Push on: type `/to-spec` and `/to-tickets` straight away, before the room runs out.
  > Near the end of the Smart zone the agent reasons less sharply, so the spec and tickets come out sloppier. Don't push on.
- [x] `/compact` now, at the end of grilling, then type `/to-spec`.
  > Right. `/compact` keeps a summary of the decisions and frees room. Do it at a phase boundary, like the end of grilling.
- [ ] Skip the spec and `/implement` the whole feature in this session.
  > It needs several sessions, and this one is already near the end of the Smart zone. That's exactly when a spec and tickets earn their keep.
```

```sources
- [to-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-spec/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [to-tickets SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-tickets/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [setup-matt-pocock-skills SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/SKILL.md) and [issue-tracker-local.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md) (no step that marks a ticket done): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the multi-session fork, one unbroken window, the Smart zone exception, don't triage these tickets): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (1.1.0: to-prd renamed to-spec, to-plan and to-issues merged into to-tickets; 1.2.0: one file per local ticket): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (normally `/implement` 10:58–11:23, `/to-spec` and 46.1k tokens 11:16–11:32, destination and route 11:43–11:56, `/to-tickets` in the same session 12:20–12:25, three slices to one 12:39–12:53, `tickets.md` 12:53–12:57, the 11-ticket spec 13:03–13:44, one ticket per cleared session and review against the spec 13:55–14:48).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (horizontal coding and tracer bullets 41:55–45:09, "too horizontal" 45:21–46:10, a board versus a numbered plan 49:40–51:38).
- [Building a REAL feature with Claude Code: every step explained](https://www.youtube.com/watch?v=hX7yG1KVYhI), Matt Pocock, 2026-03-18 (modules and tests 26:06–28:53, not reviewing 29:14–29:29 and 30:56–31:07, six tickets to four 29:49–30:56, day shift and night shift 33:44–34:02).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19, read 2026-10-23.
- [to-tickets drops the seam agreement that to-spec just made (#1078)](https://github.com/mattpocock/skills/issues/1078), GitHub issue opened 2026-09-13, read 2026-10-23.
```
