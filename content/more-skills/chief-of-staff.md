---
title: chief-of-staff
slug: chief-of-staff
summary: chief-of-staff makes one long session the manager of that goal: subagents do all the work, and what it learns is kept outside the session.
---

## What it's for

Say you want the yoga-studio API's flaky [CI](/learn/what-ci-cd-is), which fails at random, fixed over the next few weeks, with no [Spec](/learn/issues-and-keeping-track) or [Tickets](/learn/issues-and-keeping-track) yet. One ordinary session would fill its [context window](/learn/instruction-files). A string of fresh sessions would each forget what the last one learned.

**chief-of-staff makes one long session the manager of that goal: subagents do all the work, and what it learns is kept outside the session.**

The agent becomes the goal's **Directly Responsible Individual**: the one who owns it. So it thinks on two tracks at once:

```checkpoint quick-1
An agent is told it's the Directly Responsible Individual for your goal. What does that make it?
- [x] The single agent that owns the goal.
- [ ] A helper reporting to the owner.
- [ ] One of several agents sharing the goal.
Why: The Directly Responsible Individual is the one who owns the goal, so the goal is that agent's to pursue.
```

- **Tactical:** how do I finish the task in hand?
- **Strategic:** how do I change the [environment](/learn/fix-the-environment) so the _next_ task goes better?

To protect its window, the session does no work itself. [Subagents](/learn/grill-before-you-build), helper agents that each start with a fresh window, do it all in the background, so the session stays free to talk with you.

```checkpoint quick-2
A small bug turns up halfway through the goal. Who should fix it?
- [x] A background subagent, since the session does no work itself.
- [ ] The session itself, since a small bug barely touches its window.
- [ ] You, since the session stays free only to talk with you.
Why: To protect its window, the session does no work itself. Subagents do it all, however small the job, and that keeps the session free to talk with you.
```

Its memory lives in a **wiki**: a folder of linked Markdown pages that outlives the session. What sits only in the window is lost at [compaction](/learn/context-hygiene), when a summary replaces the history.

```checkpoint quick-3
You want the session to remember a decision for weeks. Where should that decision live?
- [x] In the wiki, because its pages outlive the session.
- [ ] In the window, because compaction keeps it all.
- [ ] In the summary, because compaction writes every decision down.
Why: The wiki's pages outlive the session. What sits only in the window is lost at compaction, when a summary replaces the history.
```

Its messages to subagents carry [context pointers](/learn/implement-spec), such as wiki pages and earlier commits, not pasted copies.

```diagram
type: tree
caption: "one long session the manager of that goal"
root:
  label: "one long session"
  note: "the manager of that goal"
nodes:
  - label: "subagents"
    note: "do all the work"
  - label: "a wiki"
    note: "outlives the session"
```

For example:

```
You:   /chief-of-staff Make the API's CI fast and reliable.
Agent: This goal has no wiki yet. Where should it go?
You:   docs/wiki/
Agent: A subagent is finding the slowest tests in the background.
```

## When to use it

- You have a **long-running goal**: one goal that takes a long time, with no Tickets yet.
- You want to keep talking with one session while helpers do the work.
- You want the agents' environment to improve as you go.

```checkpoint quick-4
Which of these fits chief-of-staff?
- [x] A goal that will take weeks, with no Tickets written yet.
- [ ] A one-off fix that you can finish in about an hour today.
- [ ] A goal you've already split into Tickets, ready to build.
Why: chief-of-staff is for a long-running goal, one that takes a long time and has no Tickets yet. A quick fix isn't long-running, and a goal with Tickets fits implement-spec.
```

## When not to use it

- If you already have a Spec split into Tickets, use [implement-spec](/learn/implement-spec) instead, because it builds them as a task graph onto one integration branch.
- If you want an agent to supervise workers and track their results, use Orca's [orchestration](/learn/orchestration) instead, because it's built for that.

```checkpoint quick-5
Your Spec is already split into Tickets. Which Skill fits?
- [x] implement-spec, which builds them as a task graph.
- [ ] chief-of-staff, which owns them as a long-running goal.
- [ ] orchestration, which supervises them as tracked workers.
Why: Tickets that already exist fit implement-spec, because it builds them as a task graph. orchestration is for when you want an agent to supervise workers.
```

## What it needs to start

- A long-running goal, and a place for its wiki. If it has no wiki yet, the agent agrees the location with you first.
- A [harness](/learn/context-hygiene) that can run [background agents](/learn/research).

```checkpoint quick-6
You start on a goal that has no wiki yet. What happens before anything is written to it?
- [x] The agent agrees the wiki's location with you.
- [ ] The agent picks a folder itself and tells you afterwards.
- [ ] You create the wiki folder by hand first.
Why: A place for the wiki is one of the things it needs. With no wiki yet, the agent agrees the location with you first, so it's your call where it goes.
```

Only you can start it, by typing `/chief-of-staff`. The agent never picks it on its own.

## What it creates

- Whatever the subagents build.
- The wiki. Its contents page, `index.md`, lists every page with a one-line summary, and each other page covers one thing, such as a decision.
- A date on every wiki claim. A claim about code also cites the commit it was true at.
- Suggested recurring schedules, such as a regular wiki check.
- Changes to the environment that make the next task easier.

```checkpoint quick-7
You open a wiki page and find a claim about the booking endpoint's code. What should sit beside it?
- [x] A date, and the commit the claim was true at.
- [ ] A date, and the subagent that wrote it.
- [ ] No date, because the page always shows the latest code.
Why: Every wiki claim has a date. A claim about code also cites the commit it was true at, so you can tell how old it is.
```

## Going deeper

### Why it exists

A goal that lasts for weeks outlives any one context window. Matt wants one session to carry the goal anyway. He gives it this job: it "will run for a long time, accruing tribal knowledge", helping the agent make long-term strategic decisions. Tribal knowledge is what you only learn by being there.

So the Skill keeps that session's window clear by sending out all the work, and writes what it learns into the wiki.

chief-of-staff is still beta. Matt added it as an experimental Skill, and it sits in his `in-progress` folder. He warns that Skills there "can change or disappear without warning", and they get no docs pages.

```checkpoint quick-8
You're about to build your routine around chief-of-staff. What should you expect?
- [x] It's beta, so it can change or disappear without warning.
- [ ] It's stable, so it won't change until Matt announces it.
- [ ] It's finished, so its docs pages will explain each change.
Why: chief-of-staff is still beta and sits in Matt's in-progress folder. Skills there can change or disappear without warning, and they get no docs pages.
```

### How it works underneath

**The wiki idea comes from Andrej Karpathy.** His gist, a single document shared on GitHub, starts from a complaint about chatting with documents. The model "is rediscovering knowledge from scratch on every question", so nothing builds up. His fix: the model writes and keeps up a set of Markdown pages, so what it learns adds up.

```checkpoint quick-9
What's the problem with chatting with your documents, in Karpathy's view?
- [x] Each question starts from scratch, so nothing builds up.
- [ ] Each answer adds so much that the model soon slows down.
- [ ] The model reads each document once, then never looks again.
Why: The model rediscovers knowledge from scratch on every question, so nothing builds up. His fix is for the model to keep Markdown pages, so what it learns adds up.
```

Pull request #1304 brought the idea into chief-of-staff, "based on Karpathy's gist but without `log.md`". It kept `index.md` as the catalogue, and the ingest, query and lint operations. It left out four things:

- `log.md`, the gist's running record of what happened, at Matt's request.
- The gist's schema layer, a document telling the model how the wiki is structured. The Skill itself plays that role.
- Tooling, such as Obsidian, the app Karpathy browses his wiki in.
- A fixed wiki location: the agent agrees one with you for each goal.

```diagram
type: compare
caption: "based on Karpathy's gist but without `log.md`"
columns: ["Karpathy's gist", "chief-of-staff"]
rows:
  - label: "`index.md` as the catalogue"
    cells: ["yes", "yes"]
  - label: "ingest, query and lint"
    cells: ["yes", "yes"]
  - label: "`log.md`"
    cells: ["yes", "no"]
```

**Three operations keep the wiki alive.** Say a subagent finds out why your CI is slow:

- **Ingest.** That finding will last, so the session updates every page it touches and the index, not only a new page.
- **Query.** Before its next decision, the session reads `index.md` and the pages it points to.
- **Lint.** Periodically, it looks for contradictions, pages nothing links to, missing links and claims newer sources have overtaken. It suggests this as a schedule, where the harness allows one.

```checkpoint quick-10
A subagent reports a finding that will last. What does the session do with it?
- [x] Updates every page it touches, and the index.
- [ ] Adds one new page, leaving the rest alone.
- [ ] Keeps it in its window until the next lint comes round.
Why: That's ingest. A lasting finding updates every page it touches and the index, not only a new page.
```

**The wiki records history, not the present.** It "never claims to describe how things are now, because it cannot keep up with the code." For example, a page might read:

```
On 2026-10-13, you decided to run the slow tests in their own CI job.
On 2026-10-13, as of `you/yoga-studio@abc1234`, the booking endpoint writes to `bookings`.
```

Writing `currently`, `now` or `is` about code needs a date or commit beside it. When something changes, the agent adds a new dated claim and marks the old one superseded, meaning replaced. It doesn't rewrite the old one.

```checkpoint quick-11
The bookings table gets renamed. How does the wiki record that?
- [x] A new dated claim, with the old claim marked superseded.
- [ ] The old claim rewritten, so the page shows the new name.
- [ ] The old claim deleted, since it's no longer true of the code.
Why: When something changes, the agent adds a new dated claim and marks the old one superseded. It doesn't rewrite the old one, because the wiki records history.
```

**The strategic track has a target too.** The Skill wants agents in the **pit of success**, where the easy path is the right one. Rico Mariani coined the phrase, and Jeff Atwood wrote it up in 2007. Atwood's version: "a well-designed system makes it easy to do the right things and annoying (but not impossible) to do the wrong things".

For agents, that means tightly limited APIs, lint rules that force correctness, and `CODING_STANDARDS.md` files for reviewers. Agents also need **data sources**, such as logs, and no one-off workarounds. That's [Fix the environment](/learn/fix-the-environment), made a standing job.

**Start every subagent fresh.** Some Codex models **fork** a subagent: it starts with a copy of the parent's whole context. Pull request #1341 says that "throws away the reason for using a subagent". So the Skill says to start every subagent with a fresh context window. That's [context hygiene](/learn/context-hygiene) applied to helpers.

```checkpoint quick-12
Your harness forks each subagent. What does each one start with?
- [x] A copy of the parent's whole context.
- [ ] A fresh window with only its brief.
- [ ] One window shared with other subagents.
Why: A forked subagent starts with a copy of the parent's whole context. That throws away the reason for using a subagent, so the Skill says to start each one fresh.
```

### A real example

In October 2026, a user filed [#1263](https://github.com/mattpocock/skills/issues/1263) with numbers from a real run. They had adapted the Skill and run it in Codex, with background agents in a tool called Herdr. The session kept **polling**: asking again and again whether a helper had news. That news was already arriving.

```checkpoint quick-13
A session keeps asking a helper for news, even though the news is already arriving. What is it doing?
- [x] Polling: asking a helper again and again for news.
- [ ] Forking: copying its whole context into the helper.
- [ ] Compacting: replacing its history with a summary.
Why: Polling means asking again and again whether a helper has news. Here it was wasted effort, because the news was already arriving.
```

Part of their patch moved the checks out of the model, into a timer script, a watchdog, that runs every 60 seconds. Their log compared two equal periods of 714.5 seconds:

- Before the patch, the model issued 10 waits on the same worker, across 10 turns.
- All 10 came back empty.
- It spent 550.1 seconds inside those waits.
- After the patch, all three numbers were 0.

So most of the first period went on waiting for nothing. They called it "not a controlled benchmark", because their copy already differed from Matt's and the workload changed.

### Where it goes wrong

**The session keeps checking on helpers and finds nothing.** The Skill only says messages should be sparse, not how a helper's news gets back. Issue #1263 asked it to set up **callbacks**, messages a helper sends when it has news, and to wake the session only then. It was closed as not planned. An AI-written triage reply called your adapted copy, or a line in your `AGENTS.md`, "the right home" for them. Claude Code already sends results as notifications. On other harnesses, add the setup there. If an unmodified copy polls, the reply asks for a new issue.

```checkpoint quick-14
You run an adapted copy on a harness with no callbacks. Where should you set them up?
- [x] In your adapted copy of the Skill, or a line in your AGENTS.md.
- [ ] In Matt's Skill, because the issue asking for them was accepted.
- [ ] In the wiki, as a dated page that each subagent reads first.
Why: The issue asking for callbacks in the Skill was closed as not planned. A triage reply called your adapted copy, or a line in your AGENTS.md, the right home for them.
```

**A helper arrives carrying the session's whole history.** Your harness forks subagents, and a copy of the Skill from before #1341 doesn't say what context a subagent should start with. Ask for a fresh context window instead. On Claude Code, ordinary subagents start fresh, but by default Claude can start a fork on its own.

```checkpoint quick-15
You run chief-of-staff on Claude Code with its default settings. Is asking for fresh subagents still worth it?
- [x] Yes, since Claude can start a fork on its own by default.
- [ ] No, since Claude Code never starts a fork on its own.
- [ ] No, since Claude Code forks every subagent whatever you ask.
Why: Ordinary subagents on Claude Code start fresh, but by default Claude can start a fork on its own. So asking for a fresh context window still matters there.
```

**A subagent follows a wiki page, and its change breaks.** Say a page states that the booking endpoint uses a table, and the table has been renamed. Ask for dated claims that cite commits, and a new dated claim when the code changes.

**Your notes on the Skill go out of date.** The wiki section arrived in October 2026, and the fresh-context line ten days later. So read the current `SKILL.md` before trusting any older note, this one included.

### Try it

You'll need your practice project with its CI check. If you haven't set those up, do [keeping track](/learn/issues-and-keeping-track)'s Try it step, then [CI/CD](/learn/what-ci-cd-is)'s. The plugin doesn't ship in-progress Skills, so install this one by name.

1. In your `yoga-studio` repo, install it: `npx skills@latest add mattpocock/skills --skill chief-of-staff`. Choose Claude Code if asked.
2. Start Claude Code: `claude`.
3. Type `/chief-of-staff keep the booking API's CI fast and green`. You should see it ask where the wiki goes.
4. When it asks, reply `docs/wiki/`. You should see subagents start in the background.
5. Ask the session what it's working on. You should see it answer while the subagents run.
6. When they've reported back, open `docs/wiki/index.md`. You should see every page listed, each with a one-line summary.
7. Open a page it lists. You should see every claim dated, and claims about code citing a commit.

### Read more

- [docs: enhance chief-of-staff skill description for clarity and detail](https://github.com/mattpocock/skills/commit/4588b32ecab9ecc9fc8cc6b6c5e7d675b6004b0d), Matt Pocock, 2026-10-05.
- [skills/in-progress at a496f55](https://github.com/mattpocock/skills/tree/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress), Matt Pocock, 2026-10-29: the folder listing and its README.
- [History for skills/in-progress/chief-of-staff](https://github.com/mattpocock/skills/commits/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/chief-of-staff), Matt Pocock, 2026-10-05 to 2026-10-29.
- [chief-of-staff: keep memory in a dated, commit-cited wiki (#1304)](https://github.com/mattpocock/skills/pull/1304), Matt Pocock, 2026-10-19.
- [Start subagents with a fresh context window, not a fork (#1341)](https://github.com/mattpocock/skills/pull/1341), Matt Pocock, 2026-10-29.
- [chief-of-staff: avoid model-driven polling while background agents work (#1263)](https://github.com/mattpocock/skills/issues/1263), K1nG11, 2026-10-13.
- [llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), Andrej Karpathy, 2026-04-04.
- [Falling Into The Pit of Success](https://blog.codinghorror.com/falling-into-the-pit-of-success/), Jeff Atwood, 2007-08-29.

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint chief-of-staff-deeper-stale-page
Two weeks into your yoga-studio goal, a subagent follows a wiki page that says the booking endpoint "uses" a table. The table was renamed a week ago, and the subagent's change breaks. What's the reason behind this step?
- [x] Write the claim with its date and commit, and add a new dated claim when it changes.
- [ ] Rewrite the page whenever the code changes, so it says how the booking endpoint is now.
  > The Skill says the wiki can't keep up with the code, so a page that claims the present goes stale again.
- [ ] Delete the wiki and have each subagent read the booking endpoint's code from scratch.
  > The wiki is how tribal knowledge reaches the next session. Without it, that knowledge is lost at compaction.
Why: The wiki can't keep up with the code, so it records history, not the present. A claim that cites its commit shows how old it is. A change adds a new dated claim and marks the old one superseded.
```

## Remember

```flashcards
Q: What does chief-of-staff create?
A: The subagents' work, a wiki of dated pages with an `index.md`, suggested recurring schedules, and changes that improve the agents' environment.

Q: What role does chief-of-staff give the agent?
A: The Directly Responsible Individual for one long-running goal, coordinating subagents and schedules.

Q: How does chief-of-staff get started?
A: Only by you, typing `/chief-of-staff`. The agent never picks it on its own.

Q: Whose idea is chief-of-staff's wiki based on, and what did pull request #1304 leave out of it?
A: Andrej Karpathy's llm-wiki gist (2026-04-04). Pull request #1304 left out its `log.md`, its schema layer, tooling such as Obsidian, and a fixed wiki location.

Q: What is the "pit of success" that chief-of-staff wants agents to work in, and who coined it?
A: A system that makes the right things easy and the wrong things annoying. Rico Mariani coined it; Jeff Atwood wrote it up in 2007.

Q: What did issue #1263 report about a chief-of-staff run, and what happened to it?
A: An adapted copy in Codex kept polling background agents and got 10 empty waits out of 10. It asked for callback setup and was closed as not planned on 2026-10-13.
```

## Final test

```final-test chief-of-staff-who-works
In a chief-of-staff session, who does the work toward the goal?
- [x] Subagents, each started with a fresh context window and run in the background.
- [ ] The main session itself, so the whole goal stays in one context window.
- [ ] One implementer subagent per Ticket, merged onto an integration branch.
Why: The long session has to keep its context window clear, so all the work goes to subagents, which each start fresh. They run in the background, and that leaves the session free to talk with you.
```

```final-test chief-of-staff-memory
Where does chief-of-staff keep what it learns about the goal?
- [x] In a wiki of linked Markdown pages that outlives the session.
- [ ] In its own context window, compacting it whenever it fills up.
- [ ] In the Issue tracker, as one closed Ticket for each decision.
Why: What sits only in the context window is lost at compaction, so the window can't be the memory. A wiki's pages outlive the session, and its `index.md` lists them, so what was learned reaches the next session.
```

```final-test chief-of-staff-two-tracks
What are the two tracks chief-of-staff thinks on at once?
- [x] Tactical: finish this task. Strategic: improve the environment for the next one.
- [ ] Planning: write the Spec and its Tickets. Building: turn each Ticket into code.
- [ ] Red: write one failing test. Green: write only enough code to make that test pass.
Why: The agent owns the goal as its Directly Responsible Individual, so finishing today's task isn't enough. It also asks how to change the environment so the next task goes better.
```

```final-test chief-of-staff-deeper-history
Why does chief-of-staff's wiki date every claim instead of saying how things are now?
- [x] The wiki can't keep up with the code, so it's kept as a dated history.
- [ ] Dates let the lint step delete every page that's older than a week.
- [ ] Karpathy's gist asks for a dated `log.md`, and the Skill copies it.
Why: A page saying how the code is now goes stale when the code changes, and the wiki can't keep up. So it's kept as a dated history. It isn't Karpathy's `log.md`, which pull request #1304 left out at Matt's request.
```

```final-test chief-of-staff-deeper-fork
Why did pull request #1341 add "Start every subagent with a fresh context window"?
- [x] Some harnesses fork the parent conversation, and a fork inherits its context.
- [ ] Claude Code's forks doubled the cost of each subagent, so Matt banned them.
- [ ] Fresh subagents can run in the background, and forked ones can't.
Why: Some Codex models fork the parent conversation when they start a subagent, so the subagent inherits the parent's context window. That throws away the clean start a subagent exists for. Claude Code's ordinary subagents start fresh, but by default Claude can start a fork on its own, so the line matters there too.
```

```final-test chief-of-staff-open-goal
Over the next few weeks you want the yoga-studio API's slow, flaky CI made fast and reliable. There's no Spec and no Tickets, only the goal. You want to keep talking with one session while helpers do the work, and keep what it learns for later sessions. Which fits best?
- [x] Own the goal in one long session, send work to subagents and keep a wiki.
  > Right: that's `/chief-of-staff`.
- [ ] Run the Spec's Tickets as a task graph onto one integration branch.
  > That's `/implement-spec`. There's no Spec split into Tickets with blocking links, so there's no task graph to run.
- [ ] Write a handoff document so a fresh agent can carry on the work.
  > That's `/handoff`. It passes one session's work to the next agent. It doesn't coordinate helpers or keep a lasting memory of the goal.
Why: With a long goal and no Tickets, there's no graph to run, so you want one session that owns the goal. Subagents protect its context window, and the wiki carries what it learns past compaction.
```

```final-test chief-of-staff-spec-ready
The booking Spec for your yoga-studio site is split into six Tickets with blocking links, and two have no blockers. You want the whole Spec built, with independent Tickets built at once, ending on one branch. Which fits best?
- [x] Run the Tickets as a task graph, with subagents onto one integration branch.
  > Right: that's `/implement-spec`.
- [ ] Own an open-ended goal in one long session, keeping a dated wiki of decisions.
  > That's `/chief-of-staff`. It pursues a long-running goal, with no task graph and no integration branch. The Spec's Tickets already form a task graph.
- [ ] Build one ready Ticket test-first, then clear context before the next.
  > That's `/implement`. It builds one Ticket at a time, so Tickets that don't depend on each other still wait their turn.
Why: Blocking links make these Tickets a task graph. implement-spec builds every ready Ticket at once, so the two unblocked ones needn't wait, and it ends with the whole Spec on one integration branch.
```

```final-test chief-of-staff-why-subagents
A chief-of-staff session has been running your yoga-studio goal for days. A small bug turns up in the booking endpoint, and the session starts reading the API's files to fix it itself. What's the reason behind this step?
- [x] Send it to a subagent, so the long session's context window stays free for the goal.
- [ ] Fix it in the session, since a small bug isn't worth the cost of starting a subagent.
  > The Skill says all work goes to subagents, small jobs included, to protect the session's context window.
- [ ] Clear the session's context first, then fix the bug with a clean window.
  > Clearing throws away what the long session has learned, and building that up is why it exists.
Why: The session owns the goal, so it isn't a worker. Reading files to fix a bug would fill its context window with detail the goal doesn't need. A subagent starts fresh and takes that load, however small the job.
```

```final-test chief-of-staff-why-pointers
A chief-of-staff session is briefing a subagent to speed up the yoga-studio CI. It's about to paste two whole wiki pages and the diffs of three earlier commits into the message. What's the reason behind this step?
- [x] Send links to the wiki pages and commits instead, and keep the message short.
- [ ] Paste it all, so the subagent never has to go and look anything up.
  > The Skill says not to duplicate what pointers already reach. Pasted copies crowd the subagent's fresh window.
- [ ] Skip the brief and fork the session, so the subagent sees everything already.
  > A fork inherits the parent's whole context, which is what a fresh subagent is meant to escape.
Why: Pasting fills part of the subagent's fresh window before it starts. A context pointer, such as a link to a wiki page or a commit, costs a few words and lets the subagent read only what it needs.
```

```final-test chief-of-staff-deeper-forked-helpers
You run chief-of-staff on a harness that forks the parent conversation whenever it spawns a subagent. Each helper starts out carrying the session's whole long history, and its answers wander off its brief. What's the reason behind this step?
- [x] Ask for each subagent to start with a fresh context window, not a fork.
- [ ] Keep the forks, since a helper that sees everything needs a shorter brief.
  > The fork inherits the parent's context window, which throws away the reason for using a subagent.
- [ ] Stop using subagents and do the work in the long session instead.
  > The Skill says all work goes to subagents, to protect the session's context window.
Why: A fork hands each helper the parent's full context, and in a long session that's a lot of history it doesn't need. That throws away the clean start a subagent exists for, so ask for a fresh context window.
```

```sources
- [chief-of-staff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/chief-of-staff/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [Compaction | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/compaction), Matt Pocock
- [History for skills/in-progress/chief-of-staff at a496f55](https://github.com/mattpocock/skills/commits/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/chief-of-staff), mattpocock, 2026-10-29
- [skills/in-progress at a496f55 (mattpocock/skills)](https://github.com/mattpocock/skills/tree/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress), mattpocock, 2026-10-29
- [docs: enhance chief-of-staff skill description for clarity and detail](https://github.com/mattpocock/skills/commit/4588b32ecab9ecc9fc8cc6b6c5e7d675b6004b0d), Matt Pocock, 2026-10-05
- [mattpocock/skills commit a496f55](https://github.com/mattpocock/skills/commit/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa), Matt Pocock, 2026-10-29
- [chief-of-staff: keep memory in a dated, commit-cited wiki (#1304)](https://github.com/mattpocock/skills/commit/5beb35b040e3de97e54fa9e386d7e42d15c295c2), Matt Pocock, 2026-10-19
- [llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), Andrej Karpathy, 2026-04-04
- [chief-of-staff: keep memory in a dated, commit-cited wiki #1304](https://github.com/mattpocock/skills/pull/1304), mattpocock, 2026-10-19
- [Falling Into The Pit of Success](https://blog.codinghorror.com/falling-into-the-pit-of-success/), Jeff Atwood, 2007-08-29
- [Start subagents with a fresh context window, not a fork #1341](https://github.com/mattpocock/skills/pull/1341), mattpocock, 2026-10-29
- [chief-of-staff: avoid model-driven polling while background agents work #1263](https://github.com/mattpocock/skills/issues/1263), K1nG11, 2026-10-13
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic (Claude Code Docs)
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
```
