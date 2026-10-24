---
title: Implement
slug: implement
order: 9
part: 2
image: /photos/implement.jpg
imageAlt: A construction worker in a hard hat stands on a timber wall frame against a blue sky.
imageCredit: Josh Olalde
---

Once the plan is agreed, hand the building to a Skill that tests, reviews and saves the work: one task at a time with `/implement`, or a whole written plan in one run with `/implement-spec`.

```goals
- You'll be able to say what one `/implement` run does, in order, and what it leaves for you to do.
- You'll be able to choose between `/implement` in the same window, `/implement` once per ticket with `/clear` between, and `/implement-spec`.
- You'll be able to explain how `/implement-spec` builds a spec: task graph, frontier, worktrees, one integration branch and one review at the end.
- You'll be able to decide which work stays human-in-the-loop and which can run AFK, and pick between Matt's three ways to loop over tickets.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Matt Pocock, a developer and teacher, publishes a popular set of Skills for it. A Skill is a short instruction file the agent loads when you type its name, like `/implement`, or when a task matches its description. ([Start here](/learn/start-here) covers installing them.)

Say the agent has just grilled you about a comment box for this site (asked question after question until the plan was settled; see [Grilling](/learn/grilling)), and you agreed: anonymous comments, an optional name, newest first. Type "OK, build it" and three things go wrong:

- **The plan gets reopened.** A fresh agent told "build this" often redesigns as it goes, deciding names should be required after all.
- **Nobody checks the work.** It may write tests (small programs that run your code and check its answers) afterwards, or none, and never review the result.
- **The session loses its sharpness.** Everything in a session (one Claude Code conversation) lives in the agent's context window, its working memory, measured in tokens (small chunks of text). As it fills, the model reasons less sharply. Matt calls the part where it still thinks clearly the Smart zone: about 150k tokens on today's best models, as a rule of thumb. Build a big feature in one go and you finish far past it, in what he calls the dumb zone.

Matt's answer is two Skills that build work that has ==already been decided==. `/implement` builds one piece: tests first, checks along the way, a fresh review, then a commit (a saved snapshot of your changes in Git, the tool that tracks every version of a project). `/implement-spec` builds a whole spec (a written description of what to build and why) split into tickets (small tasks that each fit one session), giving each ticket its own helper agent.

## The idea: one run of `/implement`

`/implement` takes a ticket, a spec, or a plan you just agreed in the conversation, and turns it into a commit. It ==never reopens the plan==: no interview, no clarifying round, no alternative approach.

It's a **user-invoked Skill**: only you can start it, by typing its name at the start of your message. The agent won't reach for it, and no other Skill can call it. So when `/to-tickets` (the Skill that splits a spec into tickets) finishes, nothing starts building by itself: typing `/implement` is your move.

One run goes in this order:

1. **Read the work.** If you pass a ticket, it fetches it from your issue tracker (wherever your tickets live; on this site, Markdown files in a `.scratch` folder) and states its title. If the reference is ambiguous, it asks.
2. **Drive tdd at the agreed seams.** It loads the tdd Skill (test-driven development: a failing test first, then just enough code to pass it; see [TDD](/learn/tdd)) and builds one slice at a time. A seam is the public boundary where tests watch behaviour without reaching inside, like the comments module's "save" and "list" functions.
3. **Check often.** Typechecks (quick automatic checks that the code fits together) and single test files run as it goes.
4. **Run the full test suite once**, every test in the project, at the end.
5. **Call code-review.** Matt's review Skill checks two axes: Standards (does it follow the rules written in your repo, the project folder Git tracks, plus a short list of code smells, classic signs of code that's hard to change?) and Spec (does it match what was asked?). Each runs in its own sub-agent, a helper with a fresh, empty memory, so it doesn't share the bias of the agent that just wrote the code. See [Code review](/learn/code-review).
6. **Commit to the current branch.** A branch is a separate line of commits, and `/implement` uses whichever one you're on.

Steps 2 and 5 load model-invoked Skills (ones the agent may also pick up itself). A user-invoked Skill can call those, never another user-invoked one.

Notice what's missing. ==It ends at the commit.== It doesn't create a branch, open a pull request (a proposal, usually on GitHub, to merge, or combine, a branch into `main`, the project's primary branch), act on the review's findings, or close the ticket (on a local tracker, change its status from "ready-for-agent" and tick its checklist boxes). Those jobs are yours.

```callout watch-out
"Agreed seams" is the weak spot. tdd asks you to confirm them before writing a test, so name them in the spec or answer in the first minute. Agreed nowhere, the run quietly becomes "just write the code".
```

```checkpoint ticket-still-open
You typed `/implement` on a ticket in your book-club app. Tests pass, the review ran and there's a new commit, but the ticket file still says "ready-for-agent" and none of its boxes are ticked. What now?
- [ ] Run `/implement` on the same ticket again, so that this time it marks the ticket as done.
  > Running it again just builds the same work again. Closing tickets isn't part of a run.
- [x] Check the work, then close the ticket and tick its boxes yourself.
  > Right. `/implement` ends at the commit. Closing the ticket is your job, and it's what lets the tickets waiting on it start.
- [ ] Report a bug: the Skill skipped its last step.
  > Nothing was skipped. The Skill has no step that touches the ticket.
- [ ] Run `/triage` so the ticket moves to the right state.
  > Triage is for raw incoming issues, not tickets that `/to-tickets` already made ready.
```

## Where the plan lives decides how you start

Tickets can wait on each other: a ticket's blocking edges name the tickets that must be finished before it starts. By hand, finished means built, committed and closed; inside `/implement-spec`, a ticket is finished once it has landed (merged into the run's shared branch). The right way in depends on where the decided work is written down:

| The work is… | Type |
|---|---|
| Only in the conversation you just had, and small | `/implement` right here, saying the plan is in the conversation |
| A small spec | `/implement` pointed at the spec |
| A ticket on your tracker | `/implement` plus the ticket, one ticket per session, `/clear` between |
| A spec split into tickets with blocking edges, landed in one run | `/implement-spec` |
| Not written down anywhere yet | `/grill-with-docs` first (see [Grilling](/learn/grilling)) |
| One behaviour you want test-first, with no spec | `/tdd` on its own |

The first row has a catch. The Skill's text talks about "the spec or tickets", so it may hunt for a file that doesn't exist. Add one sentence: "The plan is in this conversation, not a file."

The third row is the rhythm for a multi-session build, after `/to-spec` (which writes the spec from your conversation) and `/to-tickets` (see [Spec + tickets](/learn/spec-and-issues)). Each ticket fits one fresh context window and carries what it needs. Implement one ticket, check it, close it, then type `/clear`, a Built-in command (it comes with Claude Code; it isn't a Skill) that empties the working context. Work blockers-first.

Don't hand it several tickets at once: ==one run, one ticket==. And don't run two `/implement` sessions in one checkout (one copy of the project's files on your disk). In one user's report, sessions sharing a folder rewrote each other's commits and put work on the wrong branch.

```checkpoint two-terminals
Your book-club spec has tickets 02 and 03, and neither blocks the other. To save time, you open a second terminal in the same project and start `/implement` on 03 while 02 is still building in the first. What's likely to go wrong?
- [ ] Nothing: each session has its own context window, so the two can't affect each other.
  > Separate memories don't mean separate files. Both sessions edit and commit in the same place.
- [ ] The second `/implement` refuses to start until the first one has committed.
  > It doesn't check for other sessions, which is why the clash happens silently.
- [x] Both sessions edit and commit in one folder, so their work gets tangled.
  > Right. One checkout means one set of files and one current branch. To build tickets in parallel, `/implement-spec` gives each its own copy of the project, called a worktree.
- [ ] Ticket 03 skips tdd, because only one session at a time can load a Skill.
  > Each session loads its own Skills. The problem is the shared folder.
```

## A session, step by step

Here's `/implement` working one ticket from this site's first build, the comments API (the web addresses the comment box calls to save and list comments). That ticket was really built with `/tdd`, without `/implement`, so this is a replay.

```scene chat
title: Replaying the comments API ticket with implement (illustrative)
# You're on a new branch made for this ticket. You type the Skill and point it at one ticket file.
you: `/implement .scratch/lesson-site/issues/05-comments-api.md`
# It fetches the ticket and states its title first. There's no interview about what to build.
agent: Ticket 05, **Comments API**: the comments module, plus the web addresses that save and list comments.
# It loads tdd, which won't write a test until you confirm the seams. The spec named them, so this is a quick yes.
agent: Loading **tdd**. Seams under test: the comments module and its API, against a test database, as the spec says. OK?
you: Yes.
# Red, then green, one slice at a time, with a typecheck and the single test file after each.
agent: 🔴 "rejects an empty body" fails. 🟢 Now it passes. Typecheck clean. Next slice: a body that's too long.
# Every slice is green, so the full suite runs once. Then code-review asks for a fixed point: the branch or commit to compare against.
agent: Full suite passes. Loading **code-review**. Which fixed point should I review against?
you: main
# The review reads only what's been committed since the fixed point. This new branch has no commits yet, so it finds nothing. Then it commits and stops. The ticket stays open.
agent: The diff since `main` is empty, so there's nothing to review. Committed to `ticket-05-comments-api`. The ticket file is unchanged.
# Now the commit exists, so you run the review yourself by its full name. The ticket's "Done when" checklist includes a hand check with `curl`, a terminal program that calls a web address.
you: `/mattpocock-skills:code-review main`
agent: Standards: nothing to fix. Spec: every "Done when" item is met except the `curl` check, which needs you.
```

Four moments needed you: confirming the seams, naming the fixed point, rerunning the review after the commit, and the `curl` check.

That empty review is a known rough edge, still open on GitHub in October 2026. So is another: the Skill calls code-review by its short name, which can reach Claude Code's Built-in command `/code-review` (a bug hunt where you pick how hard it looks). The last step above cures both: after the commit, type the Skill's full name, `/mattpocock-skills:code-review`: the plugin's name (the bundle Matt's Skills were installed as), a colon, then the Skill's.

## Building a whole spec: `/implement-spec`

Working ten tickets by hand makes you the dispatcher. `/implement-spec` hands that job to one orchestrating agent (your session), which gives each ticket to an implementer sub-agent. It's user-invoked too. Start it in a cleared session, pointing at the spec's file or its number on your tracker.

Four ideas make it work:

- **Task graph.** The tickets aren't a list of steps; their blocking edges make a graph, a map of which tickets wait on which.
- **Frontier.** The frontier is every ticket whose blockers have all landed, and ==every frontier ticket runs at once==.
- **Worktrees.** Each implementer works in its own git worktree: a second checkout of the repo in its own folder, on its own branch, so parallel agents never edit the same files at once.
- **One integration branch.** Every finished ticket is merged (its commits combined) into one shared branch.

After reading the spec and tickets (and perhaps sending an exploration sub-agent to save notes outside the repo), it creates the integration branch and starts implementers on the frontier, in the background. Each builds its ticket with tdd and merges in the branch's latest work before reporting done. A merger sub-agent lands it, and as the frontier changes, more implementers start.

Only when ==every ticket has landed== does it call code-review, once, over the whole branch, and hand every finding to one fix-up implementer. If your tracker closes work through pull requests, or you asked for one, it marks ready the draft pull request it opened after the first merge. Otherwise it resolves the tickets itself, and the run ends on the integration branch. Last, it removes the worktrees.

```scene flow
title: The five tickets behind this site's redesign
node: t01 | 01 Design foundation
node: t02 | 02 Lesson pages with photos
node: t04 | 04 Main flow Lesson | side
node: t03 | 03 Home page
node: t05 | 05 Scroll motion
node: review | Final review of the whole branch
# The frontier starts as ticket 01, the only one with no blockers. One implementer builds it in its own worktree.
at: t01
# 01 merges into the integration branch. Now ticket 02 is the whole frontier.
at: t02
# 02 lands, and the frontier holds two tickets: 03 and 04 build at the same time, each in its own worktree.
at: t04
# 04 lands first. Before reporting done, 03 pulls in the integration branch, which now holds 04, and the two clash in the shared photo-credits file.
at: t03
# With 02 and 03 merged, 05 is unblocked.
at: t05
# All five tickets are in. This is where the Skill runs its one review, over the whole branch, then hands every finding to one fix-up agent. On this run an early review had also run while 05 was building.
at: review
```

Prerequisites and trade-offs:

- **It needs setup.** A configured tracker (otherwise it tells you to run `/setup-matt-pocock-skills`), tickets with blocking edges, and a harness (the program around the model, here Claude Code) that runs sub-agents in the background, each in its own worktree. One at a time, it's just a slower `/implement`.
- **Worktrees move collisions; they don't remove them.** Two tickets touching one shared file still clash at merge time, or name the same thing differently. Add a blocking edge, or have the exploration notes fix the names.
- **Nobody asks you about seams**, so name them in the spec.
- **The review belongs at the end.** Run it mid-run and every ticket not yet built shows up as a failure, so the agent builds it and reviews again. Even the final review can repeat itself: if a second full review starts after the fix-up, tell it to stop.
- **You review one big branch**, not each ticket as it lands.

```checkpoint shared-file
You're about to run `/implement-spec` on a recipe app. Two tickets that will be on the frontier together both add new labels to the same `messages.json` file. What should you do first?
- [ ] Nothing: each implementer works in its own worktree on its own branch, so the two can never collide.
  > Worktrees keep them apart only while they work. The clash arrives when both branches are merged.
- [ ] Ask for both tickets to be built in the same worktree.
  > That defeats the point of worktrees and puts two agents in one folder at once.
- [ ] Skip the exploration step, so each implementer reads the file fresh.
  > Fresh reads don't help: each implementer never sees the other's work in progress.
- [x] Make one wait for the other, or agree the label names before either starts.
  > Right. A blocking edge runs them one after the other; agreed names, in the tickets or the run's exploration notes, mean both start from the same words.
```

## Human-in-the-loop or AFK

- **Human-in-the-loop:** you're present, steering in real time, catching a wrong turn while it's cheap. It suits work that's ambiguous, irreversible or hard to review afterwards.
- **AFK** (away from keyboard): you start a session and leave. It usually needs a permissive permission mode (the setting for when the agent must stop and ask before it edits a file or runs a command), plus a sandbox: an isolated environment, like a Docker container, where it can't harm your machine. The typical failure is tidy work built on a wrong early guess. So settle the ambiguity before, let tests and review stand in during, and end with something reviewable: a branch or pull request, not merged changes.

Matt's split, from his April 2026 workshop: implementation can be AFK, but "planning, this alignment phase, has to be human in the loop." He calls it a ==day shift and a night shift==: humans plan and queue up the tickets by day; agents work through them at night.

In his October 2026 video he named three ways to loop over tickets:

1. **The manual loop.** You're the loop: implement ticket 1, clear, implement ticket 2. He calls it not really workable, and not much fun.
2. **A deterministic loop.** A script runs the implementer on each ticket: his Sandcastle tool, or a shell script. He recommends it for most people: once set up, it runs the same way every time and it's cheap, because no human or agent runs the loop. But tuning one takes patience, so he puts it out of range for beginners.
3. **The agent loop**, `/implement-spec`: "an agent does the babysitting instead of a human." He calls it worse than a script, because it isn't deterministic, but a good first step into AFK work. Its docs add that it needs no infrastructure and you can watch and steer it.

Whichever loop you build, ==run one pass by hand first==. In the workshop, Matt ran a single pass of his loop and watched it, to see what to tune in the prompt; only the looping version runs AFK, in a Docker sandbox.

```checkpoint run-once-first
You've written a shell script that runs `/implement` on every ready ticket, each in a fresh session, and you plan to leave it running overnight. What should you do first?
- [x] Start it on just one ticket and stay at the keyboard to watch.
  > Right. That's how Matt starts: one watched pass shows what to tune in the prompt before nobody is watching.
- [ ] Turn on the most permissive mode on your own laptop, so it never stops to ask.
  > Permissive modes are normal for AFK work, but inside a sandbox, where a wrong command can't harm your machine.
- [ ] Add a step that merges every finished ticket straight into `main`.
  > AFK runs should end in something reviewable, like a branch or pull request, not changes already merged.
- [ ] Raise the effort level (how hard the model thinks), so each ticket gets more care.
  > More effort doesn't show you whether the prompt does what you want. One watched pass does.
```

## How Matt and others use it

**Matt Pocock**, from his videos:

- **Small job, same window.** In his July 2026 walkthrough, after grilling a small cleanup, he said he'd usually just type `/implement` there and let it run. He put his own Smart zone at about 140k tokens then, leaving roughly 100k of room for the job (10:08–11:03).
- **One ticket at a time.** In the same video he cleared the context before implementing and said he usually clears between every ticket (13:53–14:41). There, `/implement` ran code-review's two axes in sub-agents, then committed (14:50–16:23).
- **Review in a fresh context.** In his April 2026 workshop he explained that an implementer finishes deep in its window, so a review in the same session happens in the dumb zone (1:05:28–1:06:24). He builds with Sonnet, a cheaper Claude model, and reviews with Opus, a stronger one (1:32:33; see [Models, effort & ultracode](/learn/models-effort-ultracode)).
- **`/implement-spec` where there's no script.** In October 2026 he said he reaches for `/implement-spec` more than he expected in repos without a tuned script, calling it a basic version to build your own on (4:23–4:54), and to read any Skill in full before using it (3:23–3:33).

**Other developers:**

- Colin Eberhardt of Scott Logic rebuilt an app with the Skills in October 2026. Both review axes caught a few real bugs, though many tests checked the fake back end they'd set up (mocks) more than the real code.
- A GitHub user, Warshoow, shared a script in September 2026 that runs `/implement` once per ready ticket, each in a fresh session and worktree: 10 tickets in 62 minutes for $20.40. Across 173 of his sessions, tdd never loaded and Claude Code's Built-in command `/code-review` answered twice as often as Matt's Skill, so his script now names each Skill in full.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)), Git, and Node.js or Python. If `git --version` says it isn't found, install Git first. If neither `node --version` nor `python --version` (`python3 --version` on a Mac) prints a version, install Node.js (the LTS installer from nodejs.org), then open a new terminal.

1. Make an empty folder, turn it into a Git repo whose first branch is `main`, and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir word-tools
cd word-tools
git init -b main
claude
```

2. Type `/implement` but don't press Enter. Check it shows in the list that pops up, then delete what you typed. If it wasn't there, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Give it something to build on (choose Yes when it asks to run setup commands):

```text
Set up a tiny TypeScript project here with Vitest and a typecheck script, with one function readingTime(text) that returns whole minutes at 200 words per minute, and one test for it. If Node.js isn't installed, use Python with pytest and mypy instead; if neither is installed, stop and tell me. If Git has no name and email yet, set placeholder ones for this folder only. Commit it on main.
```

4. Make a branch, because `/implement` commits to whatever branch you're on:

```text
Create a git branch called try-implement and switch to it.
```

5. Now type the Skill, and say where the plan lives:

```text
/implement The plan is in this message, not a file: add wordCount(text) next to readingTime. It counts words separated by any whitespace (spaces, tabs, new lines), and readingTime must use it. Only write tests at the public functions wordCount and readingTime.
```

6. Answer as it goes. Seams: reply "yes" (your message named them). A fixed point: "main". Where the spec is: "It's my /implement message." Told to run `/setup-matt-pocock-skills`: "There's no tracker; the plan is in my message. Carry on." A permission prompt to edit a file, run tests or commit: choose Yes. Press Esc to stop it at any point.
7. If the review said there was nothing to review, or was a bug hunt with effort levels, type `/mattpocock-skills:code-review main` to review everything since `main`.
8. Type: "Show me the last three commits and which branch we're on." Then type `/exit`.

**It's working if:**

- [ ] It restated what it would build instead of asking you what to build.
- [ ] You saw a line naming the tdd Skill as it loaded, and a failing test appeared before the code.
- [ ] Typechecks and single test files ran during the work, and the full suite ran once near the end.
- [ ] A review with two parts, Standards and Spec, ran inside the run or when you typed it in step 7.
- [ ] The new commit is on `try-implement`, and `main` still holds only the setup work.

Then ask yourself: which moments needed you, and which could have run with you away?
````

## Common mistakes

- **Waiting for the agent to start it.** Both Skills are user-invoked: type the name yourself.
- **Building on `main` by accident.** Make the branch first; `/implement` never asks.
- **Expecting `/implement` to close tickets.** Close them yourself, or the tickets waiting on them never start.
- **Tests quietly skipped in a worktree.** A worktree holds only what Git tracks, so a test needing an untracked file, like database credentials, can skip and still pass. This site's spec told its builders to copy those files in.
- **And from above:** several tickets per run, two sessions per checkout, no `/clear` between tickets, unnamed seams, reviewing mid-run.

```site-story
I built this site's redesign (a new Lesson, a photo for every Lesson, scroll motion) with `/implement-spec`. My first message asked for a pull request; then came grilling, `/to-spec`, `/to-tickets` and `/implement-spec`, all in one session, with no `/clear` before the run.

**One mistake first.** `/to-spec` stopped to ask me to check a design choice, and I typed `/to-tickets` instead of answering, so the spec was written on the agent's best guess. Today I'd answer first: it asked for a reason.

**Five tickets, run as a graph:** 01 design, then 02 Lesson photos, then 03 home page and 04 the Main flow Lesson side by side, then 05 scroll motion. Each got its own builder and worktree, and merged into one integration branch, `main-flow-and-redesign`.

**The spec named its seam** ("One seam: the Lessons module"), so where tests belonged was settled before any builder started.

**One collision, at merge time.** Tickets 03 and 04 both added photo credits to `unsplash.ts`. Before reporting done, 03 merged in the integration branch, which already held 04, and kept both sides of the conflict. Worktrees didn't prevent it; they moved it to the end.

**The review.** Mid-build I asked whether to run the code review now or after. An early review still ran while 05 was building. In all, the review checked both axes and found about 15 problems, like the home page calling Skills "commands"; one fix-up builder fixed them all. The pull request was opened only after the fix-up, never as the draft the Skill's steps open after the first merge, and `/pr` wrote its description.
```

## Cheat sheet

| Moment | What to type or do |
|---|---|
| Small job, plan in the conversation | `/implement` + "the plan is in this conversation" |
| Tickets, by hand | Branch → `/implement` one ticket → close it → `/clear` → next |
| Whole spec, parallel harness | `/clear`, then `/implement-spec` + the spec's path |
| Review sees nothing, or a bug hunt answers | Commit, then `/mattpocock-skills:code-review main` |
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

```test predict-frontier
An `/implement-spec` run on a club website has five tickets. A has no blockers. B and C are each blocked by A. D is blocked by B. E is blocked by C and D. Ticket A has just merged into the integration branch. What starts now?
- [ ] B only, because tickets are built in the order they're listed.
  > The tickets form a graph, not a list. Blockers set the pace, not the order on the tracker.
- [x] B and C together, each in its own worktree on its own branch.
  > Right. Their only blocker has landed, so both join the frontier, and every frontier ticket runs at once.
- [ ] B, C, D and E, now that the first ticket has landed.
  > D still waits for B, and E for C and D. Only tickets whose blockers have all landed are on the frontier.
- [ ] Nothing yet: code-review has to check ticket A before anything else starts.
  > The run's one review comes after every ticket has landed, not between merges.
```

```test scenario-serial-harness
You have a spec with four tickets, but your harness can only run one sub-agent at a time, and you wait while each one works. How should you build it?
- [ ] `/implement-spec` anyway, so the four tickets build at the same time
  > They can't: your harness runs one sub-agent at a time, so `/implement-spec` is just a slower `/implement`. Running tickets in parallel is its whole point.
- [ ] One long session that implements all four tickets back to back
  > That's the road into the dumb zone. Each ticket deserves a fresh window.
- [ ] Combine the four tickets into one big ticket and implement that
  > Tickets are sized to fit one window each. One big ticket undoes that.
- [x] `/implement` once per ticket, with a `/clear` between each one
  > Right. Without sub-agents running side by side, `/implement-spec` has nothing to make up for being slower, so drive each ticket yourself in a fresh window.
```

```test scenario-pick-spec-run
Your garden-planner spec has eight tickets from `/to-tickets`, and once the first lands, four of them can start. Claude Code on your laptop can run several helpers at once, each in its own copy of the project. You'd rather not start each ticket yourself, and checking one finished branch at the end suits you. In a cleared session, what do you type?
- [x] `/implement-spec`, pointing it at the spec's file
  > Right. It reads the blocking edges as a graph, builds the first ticket, then the four it unblocks at once in their own worktrees, and lands everything on one integration branch for one review.
- [ ] `/implement` with all eight ticket files, so one run builds them all
  > One run takes one ticket. Eight in one window head straight for the dumb zone.
- [ ] `/implement` on the first ticket, then `/clear` and the next, by hand
  > That's the by-hand rhythm, and it makes you the dispatcher: the job you said you'd rather hand off.
- [ ] `/tdd` once per ticket, then `/mattpocock-skills:code-review` at the end
  > `/tdd` builds one behaviour test-first. It doesn't read tickets or their blocking edges, so you'd still be the dispatcher.
```

```test scenario-afk-task
It's Friday evening. Which of these would you leave running AFK overnight?
- [ ] A ticket, in a sandbox, whose spec never settled whether names are required.
  > That's an open question. Left alone, the agent fills it with a guess and builds tidy work on top of it.
- [x] A well-specified ticket with agreed seams, in a sandbox.
  > Right. The questions are settled before you leave, tests and review stand in for you, and the sandbox keeps your machine safe. It ends on a branch you check in the morning.
- [ ] A well-specified ticket with agreed seams, on your laptop with every permission prompt off.
  > With no sandbox, one wrong command overnight can harm your own machine. Permissive modes belong inside one.
- [ ] A well-specified ticket, in a sandbox, that deletes old rows from the live database.
  > Irreversible work that touches production is exactly what to keep human-in-the-loop.
```

```test scenario-loop-choice
Your team works through about thirty tickets a week across several repos, all run overnight while nobody watches. One engineer can spend the next few weeks setting something up. Which way of looping over tickets fits Matt's advice for this team?
- [ ] The manual loop: one person types `/implement` and `/clear` for every ticket.
  > Matt calls being the loop yourself not really workable, and here it's thirty times a week.
- [ ] `/implement-spec`, because an agent makes smarter choices than a script.
  > An agent making the orchestration decisions is less reliable than a script when nobody is watching. Matt calls it a good first step, not the end state for a team with time to build a loop.
- [x] A deterministic script loop, such as Sandcastle or a shell script.
  > Right. Once tuned, it runs the same way every time and costs less, because no human or agent runs the loop.
- [ ] One long session per repo that works through the whole week's tickets.
  > That ends far past the Smart zone, the opposite of a fresh window per ticket.
```

```test spot-on-main
Sam wanted the new search feature on its own branch, ready for a pull request. Sam opened Claude Code in the project, typed `/implement` with the ticket, and the run went well. Afterwards, the new commit is on `main`. Spot the mistake.
- [x] Sam didn't create and switch to a branch before typing `/implement`.
  > Right. It commits to whichever branch you're on. It doesn't create one, and it doesn't ask.
- [ ] Sam didn't run `/mattpocock-skills:code-review` before typing `/implement`.
  > There's nothing to review before the code exists, and a review doesn't choose branches.
- [ ] Sam didn't type `/clear` before `/implement`, so no clean branch was made.
  > `/clear` empties the agent's working memory. It doesn't touch Git, so the project stays on `main`.
- [ ] Sam's ticket was missing its blocking edges.
  > Blocking edges decide the order of tickets, not which branch a commit lands on.
```

```test spot-midrun-review
Halfway through an `/implement-spec` run on a six-ticket spec, Jo gets impatient and asks the orchestrating agent for "a quick review of everything so far". The report lists the search and export features as missing, the agent starts extra work on both, and then a second review kicks off. Spot the mistake.
- [ ] Jo asked in plain words instead of typing the Skill's name.
  > Plain words can start a model-invoked Skill like code-review. The timing was the problem.
- [x] The review ran while two tickets still hadn't landed.
  > Right. The review compares the code with the whole spec, so tickets still in their worktrees read as failures. `/implement-spec` runs it once, at the end.
- [ ] Jo reviewed everything at once instead of one worktree at a time.
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
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the fork between `/implement` per ticket and `/implement-spec`; clearing between tickets), [tdd SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/SKILL.md) (pre-agreed seams) and [code-review SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review/SKILL.md) (the fixed point, the empty-diff check, the smell baseline): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /implement Skill](https://www.aihero.dev/skills-implement), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), AI Hero docs, published 2026-10-05, read 2026-10-23.
- [Skills changelog v1.3: implement-spec, pr, retro and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), AI Hero, updated 2026-10-05, read 2026-10-23.
- AI Coding Dictionary: [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) (2026-09-24) and [Human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop) (2026-07-01), read 2026-10-23.
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (three loops 1:08–3:23, read the Skill first 3:23–3:33, how he uses it 4:23–4:54).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (the fork and his Smart zone figure 10:08–11:03, one ticket at a time 13:53–14:41, the `/implement` run 14:50–16:23).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (human-in-the-loop vs AFK 26:39–27:07, day and night shift 53:15–53:35, one pass by hand 54:52–56:03, review in a fresh context 1:05:28–1:06:24, Sandcastle and models 1:29:50–1:32:40).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [afk.sh (Discussion #1136)](https://github.com/mattpocock/skills/discussions/1136), mattpocock/skills on GitHub, 2026-09-28, with the author's update of 2026-09-29.
- [Issue #1215: bare code-review calls reach the Built-in command](https://github.com/mattpocock/skills/issues/1215), opened 2026-10-07, and [issue #511: implement and code-review disagree on reviewing uncommitted changes](https://github.com/mattpocock/skills/issues/511), opened 2026-07-10, both open when read on 2026-10-24.
- [The main flow Lesson + GE-style redesign (PR #9)](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/9), this site's repo, merged 2026-10-22, with its spec and tickets in the repo's `.scratch/main-flow-and-redesign/`.
```
