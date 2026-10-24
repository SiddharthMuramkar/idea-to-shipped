---
title: Implement
slug: implement
order: 9
part: 2
image: /photos/implement.jpg
imageAlt: A construction worker in a hard hat stands on a timber wall frame against a blue sky.
imageCredit: Josh Olalde
---

Once the plan is agreed, hand the building to a Skill that tests, reviews and commits: one ticket at a time with `/implement`, or a whole spec in one run with `/implement-spec`.

```goals
- You'll be able to say what one `/implement` run does, in order, and what it leaves for you to do.
- You'll be able to choose between `/implement` in the same window, `/implement` once per ticket with `/clear` between, and `/implement-spec`.
- You'll be able to explain how `/implement-spec` builds a spec: task graph, frontier, worktrees, one integration branch and one review at the end.
- You'll be able to decide which work stays human-in-the-loop and which can run AFK, and pick between Matt's three ways to loop over tickets.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Matt Pocock, a developer and teacher, publishes a popular set of Skills for it. A Skill is a short instruction file the agent loads when you type its name, like `/implement`, or when a task matches its description. ([Start here](/learn/start-here) covers installing them.)

Say you've just agreed a comment box for this site with the agent: anonymous comments, an optional name, oldest first. Now somebody has to build it. Type "OK, build it" and three things go wrong:

- **The plan gets reopened.** A fresh agent told "build this" often redesigns as it goes, deciding names should be required after all.
- **Nobody checks the work.** It may write tests afterwards, or none, and never review the result.
- **The session loses its sharpness.** Everything in a session (one Claude Code conversation) lives in the agent's context window, its working memory, measured in tokens (small chunks of text). As it fills, the model reasons less sharply. Matt calls the part where it still thinks clearly the Smart zone: about 150k tokens on today's best models, as a rule of thumb. Build a big feature in one go and you finish far past it, in what he calls the dumb zone.

Matt's answer is two Skills that build work that has ==already been decided==. `/implement` builds one piece: tests first, checks along the way, a fresh review, a commit. `/implement-spec` builds a whole spec (a written description of what to build and why) split into tickets (small tasks that each fit one session), giving each ticket its own helper agent.

## The idea: one run of `/implement`

`/implement` takes a ticket, a spec, or a plan you just agreed in the conversation, and turns it into a commit. It ==never reopens the plan==: no interview, no clarifying round, no alternative approach.

It's a **user-invoked Skill**: only you can start it, by typing its name at the start of your message. The agent won't reach for it, and no other Skill can call it. When `/to-tickets` says "then implement each ticket", that's an instruction to you.

One run goes in this order:

1. **Read the work.** If you pass a ticket, it fetches it from your issue tracker (wherever your tickets live; on this site, Markdown files in a `.scratch` folder) and states its title. If the reference is ambiguous, it asks.
2. **Drive tdd at the agreed seams.** A seam is the public boundary where tests watch behaviour without reaching inside, like the comments module's "save" and "list" functions. It loads the tdd Skill (see [TDD](/learn/tdd)) and builds one slice at a time: a failing test, then just enough code to pass it.
3. **Check often.** Typechecks (quick automatic checks that the code fits together) and single test files run as it goes.
4. **Run the full test suite once**, every test in the project, at the end.
5. **Call code-review.** Matt's review Skill checks Standards (does it follow the rules written in your repo, the project folder Git tracks?) and Spec (does it match what was asked?) in two sub-agents: helpers with fresh, empty memories, so they aren't biased toward code they just wrote. See [Code review](/learn/code-review).
6. **Commit to the current branch.** A commit is a saved snapshot of your changes; a branch is a separate line of commits. It uses whichever branch you're on.

Steps 2 and 5 load model-invoked Skills (ones the agent may also pick up itself). A user-invoked Skill can call those, never another user-invoked one.

Notice what's missing. ==It ends at the commit.== It doesn't create a branch, open a pull request (a proposal, usually on GitHub, to merge a branch into `main`), act on the review's findings, or close the ticket. Those jobs are yours.

```callout watch-out
"Agreed seams" is the weak spot. tdd asks you to confirm them before writing a test, so name them in the spec or answer in the first minute. Agreed nowhere, the run quietly becomes "just write the code".
```

```checkpoint ticket-still-open
You typed `/implement` on a ticket in your book-club app. Tests pass, the review ran and there's a new commit, but the ticket file still says "ready-for-agent" and none of its boxes are ticked. What now?
- [ ] Run `/implement` on the same ticket again, so that this time it marks the ticket as done.
  > Running it again just builds the same work again. Closing tickets isn't part of a run.
- [x] Check the work, then close the ticket and tick its boxes yourself.
  > Right. `/implement` ends at the commit. Closing the ticket is your job, and on a chain of tickets it's what makes the next ones look unblocked.
- [ ] Report a bug: the Skill skipped its last step.
  > Nothing was skipped. The Skill has no step that touches the ticket.
- [ ] Run `/triage` so the ticket moves to the right state.
  > Triage is for raw incoming issues, not tickets that `/to-tickets` already made ready.
```

## Where the plan lives decides how you start

The right way in depends on where the decided work is written down:

| The work is… | Type |
|---|---|
| Only in the conversation you just had, and small | `/implement` right here, saying the plan is in the conversation |
| A small spec | `/implement` pointed at the spec |
| A ticket on your tracker | `/implement` plus the ticket, one ticket per session, `/clear` between |
| A spec split into tickets with blocking edges, landed in one run | `/implement-spec` |
| Not written down anywhere yet | `/grill-with-docs` first (see [Grilling](/learn/grilling)) |
| One behaviour you want test-first, with no spec | `/tdd` on its own |

The first row has a catch. The Skill's text talks about "the spec or tickets", so it may hunt for a file that doesn't exist. Add one sentence: "The plan is in this conversation, not a file."

The third row is the rhythm for a multi-session build, after `/to-spec` and `/to-tickets` (see [Spec + tickets](/learn/spec-and-issues)). Each ticket fits one fresh context window and carries what it needs. Implement one ticket, check it, close it, then type `/clear`, a Built-in command (it comes with Claude Code; it isn't a Skill) that empties the working context. Work blockers-first: a blocking edge is a line on a ticket naming tickets that must land before it.

Don't hand it several tickets at once: ==one run, one ticket==. And don't run two `/implement` sessions in one checkout: one user's sessions amended each other's commits, because they shared one folder.

```checkpoint next-ticket
Your spec has three tickets, worked by hand in order. `/implement` just committed ticket 01, you've checked it and closed it, and the session has used 90k tokens. What do you type next?
- [ ] `/implement` for ticket 02 straight away, while the code is fresh in its memory
  > Ticket 02 carries what it needs. Starting it at 90k tokens just pushes the session toward the dumb zone.
- [ ] `/implement` with tickets 02 and 03 together, to finish faster
  > One run takes one ticket. Two at once is how a run outgrows a single window.
- [x] `/clear`, then `/implement` for ticket 02
  > Right. Each ticket fits one fresh window and is self-contained, so ticket 01's context can go.
- [ ] `/compact`, so it keeps a summary of ticket 01, then `/implement` for ticket 02
  > Ticket 02 doesn't need a summary of ticket 01. Clearing is cleaner and leaves the most room.
```

## A session, step by step

Here's `/implement` working one ticket from this site's first build, the comments API. It was really built with `/tdd` before `/implement` existed, so this is a replay.

```scene chat
title: Replaying the comments API ticket with implement (illustrative)
# You're on a branch made for this ticket. You type the Skill and point it at one ticket file.
you: `/implement .scratch/lesson-site/issues/05-comments-api.md`
# It fetches the ticket and states its title first. There's no interview about what to build.
agent: Ticket 05, **Comments API**: the comments module, plus `GET` and `POST /api/comments`.
# It loads tdd, which wants the seam confirmed before any test exists. The spec named it, so this is a quick yes.
agent: Loading **tdd**. Seam under test: the comments module's public functions, save and list, as the spec's testing section says. OK?
you: Yes.
# Red, then green, one slice at a time, with a typecheck and the single test file after each.
agent: 🔴 "rejects an empty body" fails. 🟢 Now it passes. Typecheck clean. Next slice: a body that's too long.
# When every slice is green, the full suite runs once.
agent: All 8 slices green. Full suite: 25 passed.
# It loads code-review, which runs one fresh sub-agent per axis.
agent: Loading **code-review**. Standards: nothing to fix. Spec: every "Done when" item is met except the `curl` check, which needs you.
# It commits to whatever branch you're on, then stops. The ticket stays open.
agent: Committed to `ticket-05-comments-api`. The ticket file is unchanged: close it and tick its boxes yourself.
```

Only two moments needed you: confirming the seam, and the `curl` check.

Two rough edges were still open on GitHub in October 2026. The review compares committed work, but the commit comes after it, so it may see nothing. And the short name code-review can reach Claude Code's Built-in `/code-review` (a bug hunt with effort levels) instead. Either way, let it commit, then type `/mattpocock-skills:code-review` against the point you branched from.

## Building a whole spec: `/implement-spec`

Working ten tickets by hand makes you the dispatcher. `/implement-spec` hands that job to one orchestrating agent (your session), which gives each ticket to an implementer sub-agent. It's user-invoked too, and joined Matt's main set in version 1.3.0, in October 2026. Start it in a cleared session, pointing at the spec's file or issue number.

Four ideas make it work:

- **Task graph.** The tickets aren't a list of steps; their blocking edges make a graph.
- **Frontier.** The frontier is every ticket whose blockers have all landed, and ==every frontier ticket runs at once==.
- **Worktrees.** Each implementer works in its own git worktree: a second checkout of the repo in its own folder, on its own branch, so parallel agents never edit the same files at once.
- **One integration branch.** Every finished ticket is merged (its commits combined) into one shared branch.

Step by step: it reads the spec and tickets. Optionally, an exploration sub-agent saves notes outside the repo for later sub-agents. It creates the integration branch. Implementers start on the frontier, in the background; each builds its ticket with tdd and merges in the integration branch's latest work before reporting done. A merger sub-agent lands each finished ticket, and when the frontier changes, more implementers start. The agents pass context pointers (paths to the spec, ticket, notes and commits), not pasted summaries.

Only when ==every ticket has landed== does it call code-review, once, over the whole branch, and hand every finding to one fix-up implementer. Then it resolves the tickets the way your tracker closes work and removes the worktrees. A pull request appears only if your tracker closes work through them or you ask; otherwise the run ends on the integration branch.

```scene flow
title: The five tickets behind this site's redesign
node: t01 | 01 Design foundation
node: t02 | 02 Lesson pages with photos
node: t03 | 03 Home page
node: t04 | 04 Main flow Lesson | side
node: t05 | 05 Scroll motion
node: review | One review of the whole branch
# The frontier starts as ticket 01, the only one with no blockers. One implementer builds it in its own worktree.
at: t01
# 01 merges into the integration branch. Now ticket 02 is the whole frontier.
at: t02
# 02 lands, and the frontier holds two tickets: 03 and 04 build at the same time, each in its own worktree.
at: t03
# 04 lands first. Before reporting done, 03 merges the integration branch in, and the shared credits file conflicts.
at: t04
# With 02 and 03 merged, 05 is unblocked.
at: t05
# All five tickets are in, so code-review runs over the whole branch and one fix-up agent fixes every finding.
at: review
```

Prerequisites and trade-offs:

- **It needs setup.** A configured tracker (otherwise it tells you to run `/setup-matt-pocock-skills`), tickets with blocking edges, and a harness (the program around the model, here Claude Code) that runs sub-agents in the background, each in its own worktree. One at a time, it's just a slower `/implement`.
- **Worktrees move collisions; they don't remove them.** Two tickets touching one shared file still clash at merge time, or name the same thing differently. Add a blocking edge, or fix the names in the exploration notes.
- **Nobody asks you about seams**, so name them in the spec.
- **The review belongs at the end.** Mid-run, every unbuilt ticket reads as a failure, the agent builds it, and another review starts. Even then it can loop: if a second broad review starts after the fix, tell it to stop.
- **You review one big branch**, not each ticket as it lands.

```checkpoint shared-file
You're about to run `/implement-spec` on a recipe app. Two tickets that will be on the frontier together both add new labels to the same `messages.json` file. What should you do first?
- [ ] Nothing: each implementer works in its own worktree on its own branch, so the two can never collide.
  > Worktrees keep them apart only while they work. The clash arrives when both branches are merged.
- [ ] Ask for both tickets to be built in the same worktree.
  > That defeats the point of worktrees and puts two agents in one folder at once.
- [ ] Skip the exploration step, so each implementer reads the file fresh.
  > Fresh reads don't help: each implementer never sees the other's work in progress.
- [x] Add a blocking edge between them, or fix the exact label names in the exploration notes.
  > Right. Either they run one after the other, or both start from the same agreed names.
```

## Human-in-the-loop or AFK

There are two ways to work alongside an agent:

- **Human-in-the-loop:** you're present, steering in real time, catching a wrong turn while it's cheap. It suits work that's ambiguous, irreversible or hard to review afterwards.
- **AFK** (away from keyboard): you start a session and leave. It usually needs a permissive permission mode, so the agent doesn't stop to ask, plus a sandbox: an isolated environment, like a Docker container, where it can't harm your machine. The typical failure is tidy work built on a wrong early guess. So settle the ambiguity before, let tests and review stand in during, and end with something reviewable: a branch or pull request, not merged changes.

Matt's split, from his April 2026 workshop: implementation can be AFK, but "planning, this alignment phase, has to be human in the loop." He calls it a ==day shift and a night shift==: humans grill, write the spec and cut tickets by day; agents work the queue at night.

In his October 2026 video he named three ways to loop over tickets:

1. **The manual loop.** You're the for loop: implement ticket 1, clear, implement ticket 2. It works, but it's no fun.
2. **A deterministic loop.** A script runs the implementer on each ticket: his Sandcastle library, or a shell script. He recommends this for most people once it's set up: it runs the same way every time, and it's cheap, because no human or agent runs the loop. But tuning one takes patience, so he sees it as out of range for beginners.
3. **The agent loop**, which is `/implement-spec`: "an agent does the babysitting instead of a human." It's less reliable than a script, because an agent makes the orchestration decisions, but it needs no infrastructure, you can watch and steer it, and it's a good first step into AFK work.

Whichever loop you build, ==run one pass by hand first==. In the workshop, Matt ran a single pass of his loop and watched it, to see what to tune in the prompt; only the looping version runs AFK, in a Docker sandbox.

```checkpoint run-once-first
You've written a shell script that runs `/implement` on every ready ticket, each in a fresh session, and you plan to leave it running overnight. What should you do first?
- [x] Run one pass by hand and watch what the agent does.
  > Right. That's how Matt starts: one watched pass shows what to tune in the prompt before nobody is watching.
- [ ] Turn on the most permissive mode on your own laptop, so it never stops to ask.
  > Permissive modes are normal for AFK work, but inside a sandbox, where a wrong command can't harm your machine.
- [ ] Add a step that merges every finished ticket straight into `main`.
  > AFK runs should end in something reviewable, like a branch or pull request, not changes already merged.
- [ ] Switch to `/implement-spec`, which is more reliable than a script.
  > It's the other way round: a tuned script is more reliable, because no agent makes the orchestration decisions.
```

## How Matt and others use it

**Matt Pocock**, from his videos:

- **Small job, same window.** In his July 2026 walkthrough, after grilling a small cleanup, he said he'd usually just type `/implement` there and let it run. He treats about 140k tokens as where his model gets noticeably dumber, so he budgets roughly 100k for a job (10:08–11:03).
- **One ticket at a time.** In the same video he cleared the context before implementing, and said he usually clears between every ticket (13:53–14:41). The run used 42.7k tokens: it typechecked, built, ran code-review's two axes in sub-agents and committed (14:50–16:23).
- **Review in a fresh context.** In his April 2026 AI Engineer workshop he explained that an implementer finishes deep in its window, so a review in the same session happens in the dumb zone (1:05:28–1:06:24). He builds with Sonnet and reviews with Opus (1:32:33; see [Models, effort & ultracode](/learn/models-effort-ultracode)).
- **Scripts where he has them.** His Sandcastle setup runs planner, implementer, reviewer and merger agents, with implementers in sandboxed worktrees (1:29:50–1:32:13). In his October 2026 video he said he reaches for `/implement-spec` more than he expected in repos without a tuned script, and called it a basic version to build your own on (4:23–4:54). He also said to read any Skill in full before using it (3:23–3:33).

**Other developers:**

- Colin Eberhardt of Scott Logic rebuilt a karting-tracker app with the Skills in October 2026. `/implement` ran red-green TDD, then the review, and both axes caught real bugs, though many tests only checked their own mocks.
- A GitHub user, Warshoow, shared a shell loop in September 2026 that runs `/implement` once per ready ticket, each in a fresh session and worktree: 10 tickets in 62 minutes for $20.40. His logs showed tdd never loading and the Built-in review answering code-review calls twice as often as Matt's, so he now names the Skills in full.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)).

1. Make an empty folder, turn it into a Git repo, and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir word-tools
cd word-tools
git init
claude
```

2. Type a slash and the word implement. If `implement` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Give it something to build on (choose Yes when it asks to run setup commands):

```text
Set up a tiny TypeScript project here with Vitest and a typecheck script, with one function readingTime(text) that returns whole minutes at 200 words per minute, and one test for it. If Node.js isn't installed, use Python with pytest and mypy instead. Commit it on main.
```

4. Make a branch, because `/implement` commits to whatever branch you're on:

```text
Create a git branch called try-implement and switch to it.
```

5. Now type the Skill, and say where the plan lives:

```text
/implement The plan is in this message, not a file: add wordCount(text) next to readingTime. It counts words separated by any whitespace (spaces, tabs, new lines), and readingTime must use it. Only write tests at the public functions wordCount and readingTime.
```

6. If it asks you to confirm the seams, reply "yes": your message named them. If it tells you to run `/setup-matt-pocock-skills`, reply "There's no tracker; the plan is in my message. Carry on." Press Esc to stop it at any point.
7. When it finishes, type: "Show me the last three commits and which branch we're on." Then type `/exit`.

**It's working if:**

- [ ] It restated what it would build instead of asking you what to build.
- [ ] You saw it load the tdd Skill, and a failing test appeared before the code.
- [ ] Typechecks and single test files ran during the work, and the full suite ran once near the end.
- [ ] A review ran with two parts, Standards and Spec.
- [ ] The new commit is on `try-implement`, and `main` still holds only the setup commit.

If the review was a bug hunt with effort levels, or found nothing to review, type `/mattpocock-skills:code-review` and give it `main` as the fixed point. Then ask yourself: which moments needed you, and which could have run with you away?
````

## Common mistakes

- **Waiting for the agent to start it.** Both Skills are user-invoked: type the name yourself.
- **Building on `main` by accident.** Make the branch first; `/implement` never asks.
- **Expecting tickets to close themselves.** Close them yourself, or the next tickets never look unblocked.
- **One ticket eating 150k tokens.** The ticket is too big. Split it rather than raising effort (how hard the model thinks).
- **Tests quietly skipped in a worktree.** A worktree holds only what Git tracks, so a test needing an untracked file, like database credentials, can skip and still pass. This site's spec told its builders to copy that file in.
- **And from above:** several tickets per run, two sessions per checkout, no `/clear` between tickets, unnamed seams, reviewing mid-run.

```site-story
I built this site's redesign (a new Lesson, photos, scroll motion) with `/implement-spec`. I typed `/to-spec`, `/to-tickets` and then `/mattpocock-skills:implement-spec`, all in one session. The docs say to clear before a run; I didn't.

**One mistake first.** `/to-spec` stopped to ask me to check a design choice, and I typed `/to-tickets` instead of answering, so the spec was written on the agent's best guess. Today I'd answer first: it asked for a reason.

**Five tickets, run as a graph:** 01 design, then 02 Lesson photos, then 03 home page and 04 the Main flow Lesson side by side, then 05 scroll motion. Each ticket got its own builder in its own worktree, merged into one integration branch, `main-flow-and-redesign`. It ran in the background, where I could follow it with `/workflows`.

**The spec named its seam** ("One seam: the Lessons module"), so the builders never had to ask me where tests belonged.

**One collision, at merge time.** Tickets 03 and 04 both added photo credits to `unsplash.ts`. Before reporting done, 03 merged in the integration branch, which already held 04, hit a conflict in that file and kept both sides' entries. Worktrees didn't prevent it; they moved it to the end.

**The review.** Mid-build I asked whether to run the code review now or after the tickets. After, the agent said: it's the Skill's last step. Then I asked it to go faster with more agents, and it started an early review of the four merged tickets while 05 was still building, which found three problems. Once 05 merged, Matt's code-review ran over the whole branch (called by its full name, so the Built-in one didn't answer), and one fix-up builder fixed all 13 findings. Then the pull request opened.
```

## Cheat sheet

| Moment | What to type or do |
|---|---|
| Small job, plan in the conversation | `/implement` + "the plan is in this conversation" |
| Tickets, by hand | Branch → `/implement` one ticket → close it → `/clear` → next |
| Whole spec, parallel harness | `/clear`, then `/implement-spec` + the spec's path |
| Review sees nothing, or a bug hunt answers | Commit, then `/mattpocock-skills:code-review` |
| Going AFK | Sandbox, one pass by hand first, end on a branch |

## Final test

```test scenario-plan-in-chat
You've just grilled a small change to a recipe site: a "print this recipe" button. Nothing was written to a file, and the session has plenty of room left. What do you type?
- [ ] `/to-spec`, then `/to-tickets`, then `/implement` per ticket
  > That road is for multi-session builds. For a change this small it's overhead.
- [ ] `/clear`, then `/implement` with a fresh description of the button
  > Clearing throws away the decisions you just made in this conversation.
- [x] `/implement`, adding that the plan is in this conversation
  > Right. Build it here, and say where the plan lives so the Skill doesn't go looking for a spec file.
- [ ] `/implement-spec`, so that sub-agents can build it in parallel
  > `/implement-spec` needs a spec split into tickets with blocking edges. There's no graph here.
```

```test scenario-whole-spec
A spec for a club's events page is split into six tickets with blocking edges, and your harness runs sub-agents in the background, each in its own worktree. You'd like one run to land them all while you watch. Which Skill do you type?
- [ ] `/implement` with all six ticket numbers
  > One `/implement` run takes one ticket.
- [x] `/implement-spec`
  > Right. It works the graph's frontier in parallel and lands everything on one integration branch.
- [ ] `/tdd`, once for each ticket
  > `/tdd` builds one behaviour test-first. It doesn't dispatch tickets or merge branches.
- [ ] `/code-review` against the spec
  > That checks work that's already built, and nothing is built yet.
```

```test scenario-serial-harness
You have a spec with four tickets, but your harness can only run one sub-agent at a time, in the foreground. How should you build it?
- [ ] `/implement-spec` anyway, because it's always the faster choice
  > It exists to run tickets at the same time. One at a time, it's just a slower `/implement`.
- [ ] One long session that implements all four tickets back to back
  > That's the road into the dumb zone. Each ticket deserves a fresh window.
- [ ] Combine the four tickets into one big ticket and implement that
  > Tickets are sized to fit one window each. One big ticket undoes that.
- [x] `/implement` once per ticket, clearing between them
  > Right. Without parallel background sub-agents, driving each ticket yourself loses nothing.
```

```test scenario-afk-task
It's Friday evening. Which of these would you leave running AFK overnight?
- [ ] Grilling the idea for a new members' area.
  > Agreeing what to build needs you. Left alone, the agent fills every gap with a guess.
- [x] A well-specified ticket with agreed seams, in a sandbox.
  > Right. It's well specified, easy to verify and sandboxed: tests and review stand in for you, and it ends on a branch you check in the morning.
- [ ] A one-way change to the live production database.
  > Irreversible work that touches production is exactly what to keep human-in-the-loop.
- [ ] Choosing between two page layouts that you haven't seen side by side yet.
  > That's a decision you need to see, through a prototype. Nobody can make it for you overnight.
```

```test scenario-loop-choice
Your team works through about thirty tickets a week across several repos. You're happy to spend a few weeks building something, and you want the loop that's cheapest and most reliable once it's tuned. Which way of looping over tickets fits Matt's advice?
- [ ] The manual loop: one person types `/implement` and `/clear` for every ticket.
  > It works, but you're acting as the for loop, thirty times a week.
- [ ] `/implement-spec`, because an agent makes smarter choices than a script.
  > An agent orchestrating is less predictable than a script. Matt calls it a good way in, not the best end state.
- [x] A deterministic script loop, such as Sandcastle or a shell script.
  > Right. Once tuned, it runs the same way every time and costs less, because no human or agent runs the loop.
- [ ] One long session per repo that works through the whole week's tickets.
  > That ends far past the Smart zone, the opposite of a fresh window per ticket.
```

```test spot-on-main
Sam wanted the new search feature on its own branch, ready for a pull request. Sam opened Claude Code in the project, which was on `main`, typed `/implement` with the ticket, and now the commit is on `main`. Spot the mistake.
- [x] Sam didn't create and switch to a branch before typing `/implement`.
  > Right. It commits to whichever branch you're on. It doesn't create one, and it doesn't ask.
- [ ] Sam should have run `/code-review` before typing `/implement`.
  > There's nothing to review before the code exists, and a review doesn't choose branches.
- [ ] Sam should have used `/implement-spec`, which always builds on a separate branch.
  > It does use an integration branch, but it's for a whole spec of tickets. For one ticket, make the branch yourself.
- [ ] Sam's ticket was missing its blocking edges.
  > Blocking edges decide the order of tickets, not which branch a commit lands on.
```

```test spot-no-clear
Ana worked through four tickets with `/implement`, one after another in a single session. Tickets 1 and 2 came out clean. By ticket 4 the agent forgot names it had agreed and its review missed obvious problems. Spot the mistake.
- [x] She never typed `/clear` between tickets.
  > Right. Each ticket fits one fresh window. Without clearing, every ticket starts closer to the dumb zone.
- [ ] She should have run `/to-spec` again between tickets.
  > The spec already exists. Rewriting it doesn't free up the window.
- [ ] She worked the tickets in order instead of all at once.
  > Working blockers-first is right, and one run takes one ticket.
- [ ] She should have opened a pull request after every single ticket.
  > Pull requests are about reviewing and merging, not about the agent's sharpness.
```

```test spot-midrun-review
Halfway through an `/implement-spec` run, with two of six tickets still building, Jo types `/mattpocock-skills:code-review` against the whole spec. It flags those two tickets as missing, the agent starts building them, and then another review starts. Spot the mistake.
- [ ] Jo typed the full name instead of the short `/code-review`.
  > The full name is the reliable way to reach Matt's Skill. The timing was the problem.
- [x] The review ran before every ticket had landed.
  > Right. It compares the code with the whole spec, so unbuilt tickets read as failures. `/implement-spec` runs it once, at the end.
- [ ] Jo should have reviewed each worktree separately instead.
  > Reviewing half-built work in pieces has the same problem. The run's one review belongs after the last merge.
- [ ] A code review can't run on an integration branch.
  > It can: that's exactly where `/implement-spec` runs it, once every ticket is in.
```

```test sequence-one-run
Which order matches one `/implement` run on a ticket?
- [ ] Commit → fetch the ticket → tdd slices → full suite → code-review
  > Committing comes last. At the start, nothing is built yet.
- [ ] Fetch the ticket → full suite → tdd slices → commit → code-review
  > The full suite runs once, at the end, after the slices. And the review comes before the commit.
- [ ] Fetch the ticket → code-review → tdd slices → full suite → commit
  > The review checks finished work, so it comes after the build.
- [x] Fetch the ticket → tdd slices → full suite → code-review → commit
  > Right. Read the work, build it test-first with checks along the way, run everything once, review, then commit to the current branch.
```

```test predict-run-end
You run `/implement-spec` in a repo whose tracker is a folder of local Markdown files, and you never ask for a pull request. What should you expect when it finishes?
- [ ] A pull request on GitHub, marked ready for review.
  > A pull request appears only if the tracker closes work through pull requests or you ask for one. A local tracker does neither.
- [ ] Every ticket's work committed straight to `main`.
  > Nothing lands on `main`. Everything goes to the integration branch.
- [x] One integration branch with every ticket merged and resolved.
  > Right. On a local tracker the run ends on the integration branch, with each ticket resolved and nothing merged into `main`.
- [ ] A separate branch for each ticket, all left for you to merge into `main` by hand.
  > A merger sub-agent lands each ticket on the integration branch as it finishes, and the worktrees get cleaned up.
```

```sources
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the fork between `/implement` per ticket and `/implement-spec`; clearing between tickets) and [tdd SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/SKILL.md) (pre-agreed seams): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /implement Skill](https://www.aihero.dev/skills-implement), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), AI Hero docs, published 2026-10-05, read 2026-10-23.
- [Skills changelog v1.3: implement-spec, pr, retro and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), AI Hero, updated 2026-10-05, read 2026-10-23.
- AI Coding Dictionary: [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) (2026-09-24) and [Human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop) (2026-07-01), read 2026-10-23.
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (three loops 1:08–3:23, read the Skill first 3:23–3:33, how he uses it 4:23–4:54).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (the fork and his token budget 10:08–11:03, one ticket at a time 13:53–14:41, the `/implement` run 14:50–16:23).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (human-in-the-loop vs AFK 26:39–27:07, day and night shift 53:15–53:35, one pass by hand 54:52–56:03, review in a fresh context 1:05:28–1:06:24, Sandcastle and models 1:29:50–1:32:40).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [afk.sh (Discussion #1136)](https://github.com/mattpocock/skills/discussions/1136), mattpocock/skills on GitHub, 2026-09-28.
- [Issue #1215: bare code-review calls reach the Built-in command](https://github.com/mattpocock/skills/issues/1215), opened 2026-10-07, and [issue #1277: review runs before the commit](https://github.com/mattpocock/skills/issues/1277), both open when read on 2026-10-23.
- [The main flow Lesson + GE-style redesign (PR #9)](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/9), this site's repo, merged 2026-10-22, with its spec and tickets in the repo's `.scratch/main-flow-and-redesign/`.
```
