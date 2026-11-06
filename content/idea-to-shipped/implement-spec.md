---
title: implement-spec: build a whole Spec in one run
slug: implement-spec
summary: How implement-spec builds a whole Spec in one run, handing each ready Ticket to a fresh helper agent and landing the work on one branch.
---

## What it's for

Say your "Booking API" [Spec](/learn/issues-and-keeping-track) is split into [Tickets](/learn/to-tickets). With [implement](/learn/implement), you work one at a time, clearing the context in between, and track what's unblocked yourself. Tickets that could run side by side wait their turn.

```checkpoint quick-1
You're building a Spec with implement, and two Tickets don't depend on each other. What happens to them?
- [x] They wait their turn, because you work through one Ticket at a time.
- [ ] They run side by side, because implement spots that nothing links them.
- [ ] They merge into one Ticket, so that one session can build both.
Why: With implement you work one Ticket at a time and track what's unblocked yourself, so even Tickets that could run side by side wait their turn.
```

**implement-spec builds the whole Spec in one run, with one session handing out the Tickets to helper agents.**

It reads the Tickets as a **task graph**: Tickets linked by what blocks what, not a plain list. So there's always a [frontier](/learn/issues-and-keeping-track): Tickets that nothing still blocks, ready to start.

```checkpoint quick-2
#14 has no blockers. #13 is blocked by #12, which isn't done. Which can start now?
- [x] #14, because nothing still blocks it.
- [ ] #13, because it comes first in the list.
- [ ] Neither, until every lower number is done.
Why: The Tickets are a task graph, not a plain list. The frontier is the Tickets that nothing still blocks, whatever their numbers.
```

Say nothing blocks #12 (List bookings) or #14 (a health check), and #12 blocks #13 (Create a booking). You type `/implement-spec`. Then:

1. The agent creates one [integration branch](/learn/review-spec-and-standards), where all of a Spec's Tickets land before reaching `main`.
2. #12 and #14 each get a fresh **implementer subagent**: a new helper agent with an empty context. It builds one Ticket in its own [worktree](/learn/branches-and-worktrees), on its own branch. Both run at once.
3. Each calls [tdd](/learn/tdd) to build its Ticket test-first. Before reporting done, it merges the integration branch's latest commit into its own branch.
4. A **merger subagent**, a helper agent, folds that finished work into the integration branch.
5. #12 landing puts #13 on the frontier, so another fresh implementer subagent starts.

```checkpoint quick-3
#12 has landed, and #13 was blocked by it. What happens next?
- [x] #13 goes on the frontier, and a fresh implementer subagent starts on it.
- [ ] The implementer subagent that built #12 carries on and builds #13 next.
- [ ] #13 keeps waiting until #14 has landed on the integration branch too.
Why: Landing #12 frees #13, so it joins the frontier and gets its own fresh implementer subagent. It doesn't wait for #14, which never blocked it.
```

```diagram
type: git
caption: "Both run at once"
branches:
  - name: "`main`"
    commits: 1
  - name: "integration branch"
    from: { branch: "`main`", after: 1 }
    commits: 1
  - name: "#12"
    from: { branch: "integration branch", after: 1 }
    commits: 2
  - name: "#14"
    from: { branch: "integration branch", after: 1 }
    commits: 3
worktrees:
  - branch: "#12"
    label: "its own worktree"
  - branch: "#14"
    label: "its own worktree"
```

Messages to subagents carry **context pointers**: short references to material kept elsewhere, such as the Spec and earlier commits, instead of pasted copies.

```checkpoint quick-4
You're about to start a subagent on a Ticket. What should your message to it carry?
- [x] A context pointer to the Ticket, not a pasted copy of it.
- [ ] A pasted copy of the Ticket, so that nothing needs looking up.
- [ ] A pasted copy of the session, so that it knows what came before.
Why: Context pointers are short references to material kept elsewhere, so the message stays short and nothing is pasted twice.
```

## When to use it

- You have a Spec split into Tickets with blocking links, and want it all built in one run.
- You have Tickets that can be built at the same time.

```checkpoint quick-5
Which situation fits implement-spec?
- [x] A Spec split into Tickets with blocking links, wanted all in one run.
- [ ] A Spec split into Tickets, where you only want the first one built.
- [ ] A Spec not split yet, which you'd like talked through with you first.
Why: It fits a Spec already split into Tickets with blocking links, when you want it all built in one run.
```

## When not to use it

[implement](/learn/implement) is this Skill's **look-alike**: a Skill easy to mistake for another.

- If you have one Ticket, use implement instead, because it builds in your own session.
- If the Spec isn't split yet, use [to-tickets](/learn/to-tickets) first, because it writes the blocking links.

```checkpoint quick-6
You have one Ticket to build, and nothing blocks it. Which Skill fits?
- [x] implement, because it builds one Ticket in your own session.
- [ ] implement-spec, because it builds any number of Tickets.
- [ ] to-tickets, because every Ticket needs its blocking links first.
Why: implement is the look-alike here. It builds one Ticket in your own session, and implement-spec is for a whole Spec's Tickets.
```

## What it needs to start

- A Spec with its Tickets in the [Issue tracker](/learn/issues-and-keeping-track), blocking links included.
- The Issue tracker set up. If it's missing, the agent tells you to run [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills).

```checkpoint quick-7
You type /implement-spec, but the Issue tracker isn't set up. What happens?
- [x] It tells you to run setup-matt-pocock-skills.
- [ ] It builds from a list of Tickets you paste in.
- [ ] It sets up a new Issue tracker for the Spec.
Why: The Issue tracker has to be set up first. If it's missing, the agent points you to setup-matt-pocock-skills.
```

Only you can start it. Clear the context with `/clear`, then type `/implement-spec` and the Spec's Issue number or file path.

```checkpoint quick-8
You've finished splitting a Spec into Tickets. Will the agent start implement-spec by itself?
- [x] No. Only you can start it, by typing /implement-spec.
- [ ] Yes. It starts once the last Ticket is written.
- [ ] Yes, but only once you've cleared the context yourself.
Why: Only you can start it: you clear the context, then type /implement-spec.
```

## What it creates

- One integration branch holding the whole Spec.
- A [code-review](/learn/code-review) of that branch against the Spec, once every Ticket is complete. One more fresh implementer subagent fixes everything it raises.
- A draft pull request closing the Spec and its Tickets, if your tracker closes work through pull requests or you ask.

```checkpoint quick-9
Your tracker doesn't close work through pull requests, and you don't ask for one. What do you end up with?
- [x] One integration branch, with every Ticket resolved your tracker's way.
- [ ] A draft pull request all the same, since every run ends by opening one.
- [ ] No branch at all, since each Ticket's work has gone straight into main.
Why: The draft pull request only appears if your tracker closes work through pull requests or you ask. The integration branch is there either way.
```

At the end, the pull request is marked ready and the worktrees are cleaned up. Without a pull request, the agent closes each Ticket your tracker's way.

## Going deeper

### Why it exists

Building a Spec one Ticket at a time keeps you busy. People kept building their own versions of this Skill. One user wanted subagents to build the Tickets "when a spec may contain over 5 tickets".

Matt Pocock, who wrote the Skill, names three ways to work through a set of Tickets:

- **The manual loop.** You run one Ticket, clear the context, then run the next. You are the for loop.
- **The deterministic loop.** A script reads each Ticket and runs implement on it. Matt recommends it for most people, though it takes patience to set up.
- **The agent loop.** An agent does the babysitting (watching and starting each Ticket) instead of a human. This is implement-spec.

```checkpoint quick-10
You write a script that reads each Ticket and runs implement on it. Which loop is that?
- [x] The deterministic loop, which Matt recommends for most people.
- [ ] The agent loop, where an agent does the babysitting for you.
- [ ] The manual loop, where you are the one running every Ticket.
Why: A script running implement on each Ticket is the deterministic loop. Matt recommends it for most people, though it takes patience to set up.
```

```diagram
type: compare
caption: "three ways to work through a set of Tickets"
columns: ["The manual loop.", "The deterministic loop.", "The agent loop."]
rows:
  - cells: ["You are the for loop", "A script reads each Ticket", "An agent does the babysitting"]
footer: "The agent loop is worse than a deterministic loop."
```

He's plain about the trade: "The agent loop is worse than a deterministic loop." But it's a good way to start leaving work to run alone, before you've tuned a script.

```checkpoint quick-11
You're choosing between the agent loop and a script. How does Matt rate the agent loop?
- [x] Worse than a script, but a good way to start leaving work to run alone.
- [ ] Better than a script, so a script is no longer worth setting up at all.
- [ ] As good as a script, so the choice comes down to which one you prefer.
Why: He says the agent loop is worse than a deterministic loop. It's still a good way to start leaving work to run alone, before you've tuned a script.
```

So implement-spec hands the babysitting to one session, the **orchestrator**, which runs the whole Spec. You review the integration branch at the end, not each Ticket's work as it lands.

### How it works underneath

**The graph sets the speed.** Every Ticket on the frontier runs at once, so the graph's shape sets the pace, not the Tickets' order on the tracker. With no blocking links, every Ticket starts at once.

**Landing stays easy.** Say #14 lands while #12 is being built. Before reporting done, #12's implementer merges in the integration branch's latest commit, #14's work included. Its branch now holds everything the integration branch has, plus #12. So landing it is a **fast-forward**: git moves the branch to the newer commit, with no new merge commit.

```checkpoint quick-12
#12's implementer merged in the integration branch's latest commit before reporting done. What is landing #12 now?
- [x] A fast-forward: git moves the branch, with no new merge commit.
- [ ] A conflict resolution, since #14 landed while #12 was built.
- [ ] A merge commit, which marks where the two branches joined.
Why: Its branch already holds everything the integration branch has, plus #12. So git only has to move the branch to the newer commit.
```

**Pointers keep prompts small.** The orchestrator and its implementers talk through context pointers, not pasted summaries. That keeps each prompt small, and leaves room in the orchestrator's context window for the graph.

**Start every subagent fresh.** Some models in Codex, a coding agent, **fork** a subagent: it starts with a copy of the parent's whole context. Claude Code can too. Matt says that "throws away the reason for using a subagent: a clean context that sees only its brief". So the Skill asks for a fresh context window every time.

```checkpoint quick-13
A harness forks a new subagent from its parent. What does that throw away?
- [x] The clean context that's the reason for using a subagent.
- [ ] The parent's whole context, which the subagent can't see.
- [ ] The worktree and the branch the subagent needs for its work.
Why: A fork starts with a copy of the parent's whole context, so the subagent loses the clean context that sees only its brief.
```

**Every Ticket gets its own implementer.** Even then, an orchestrator could send Ticket B to the implementer that built Ticket A, and "That implementer is still carrying ticket A's context." So in October 2026 Matt added the word _fresh_ for each Ticket and for the review fixes. The merger subagent can be reused across merges.

```checkpoint quick-14
One Ticket has landed, and the next is ready. Which subagent can you reuse?
- [x] The merger subagent, which can be reused across merges.
- [ ] The implementer subagent, which already knows the code.
- [ ] Either one, since each Ticket has its own branch anyway.
Why: An implementer that built one Ticket is still carrying that Ticket's context, so each Ticket gets a fresh one. The merger subagent can be reused.
```

### A real example

In October 2026, a user filed [#1328](https://github.com/mattpocock/skills/issues/1328) after running implement-spec in Codex on a large graph of Tickets. The orchestrator had reused the same implementers across different Tickets. The report's summary: "Worktrees kept ticket branches separate, but did not prevent agent context from carrying over between tasks." So a worktree keeps branches apart, not an agent's context.

```checkpoint quick-15
An orchestrator reuses one implementer across Tickets, each in its own worktree. What stays apart?
- [x] The Ticket branches, but not the agent's context.
- [ ] The agent's context, but not the Ticket branches.
- [ ] Both the Ticket branches and the agent's context.
Why: Worktrees kept the Ticket branches separate, but agent context still carried over from one Ticket to the next.
```

A compaction is the harness replacing a full context with a summary, as [/compact](/learn/context-hygiene) does, and it loses detail. By the user's count, that run logged 339 compactions across all its sessions.

Matt asked for a line saying each subagent "should start with a fresh context window." The user then told Codex never to fork, and built a different pair of Specs: 25 Tickets, 64 fresh subagents, 11 compactions.

These are one user's counts from two different jobs: an observation, not a controlled test.

```checkpoint quick-16
Why can't one user's two runs prove that fresh subagents cut compactions?
- [x] They're one user's counts from two different jobs.
- [ ] They're counts Matt made, and the user only saw them.
- [ ] They're counts of one job, run twice in the same way.
Why: The two runs built different Specs, and one user did the counting. That makes the comparison an observation, not a controlled test.
```

### Where it goes wrong

**Two Tickets name one thing two ways.** Each implementer sees only its own Ticket and the shared exploration notes, never the other's work in progress. So one user's two Tickets added the same string as `blockedSince` and `blockedOn`. Matt's summary: "Worktrees don't remove collisions; they postpone them to merge time." Add a blocking link between the two Tickets, so they run one after the other. Or fix the exact names in the exploration notes, which an optional exploration subagent saves for later subagents.

```checkpoint quick-17
Two Tickets on the frontier will add the same new string. What stops them naming it two ways?
- [x] A blocking link between them, or exact names in the exploration notes.
- [ ] Giving each Ticket its own worktree, so neither sees the other's work.
- [ ] Asking the merger subagent to pick one name after both have landed.
Why: Each implementer sees only its own Ticket and the shared notes, and worktrees only postpone the collision. A blocking link runs the Tickets in turn, and fixed names remove the guess.
```

**The review and fix loop runs for hours.** code-review compares the code against the whole Spec, so it only makes sense once every Ticket has landed. Run mid-way, every unbuilt Ticket reads as a failure. The agent builds that Ticket, and that sets off another review. Even at the end, the Skill doesn't yet say when to stop. One user's five-Ticket loop took "roughly four hours".

**Blocked Tickets never start, even after their blocker merged.** On GitHub, a Ticket's blocked-by count only drops when its blocker closes. Merges into the integration branch close nothing (see [Merging and cleaning up](/learn/merging-and-cleaning-up)). Tickets usually close at the end of the run, or later when the pull request merges. Tell the orchestrator to track those merges itself, and work out the frontier from them.

```checkpoint quick-18
#12 has merged into the integration branch, but GitHub still shows #13 as blocked. Why?
- [x] The count drops only when #12 closes, at the end of the run or later.
- [ ] The count drops only when #13's own implementer subagent starts work.
- [ ] The count drops only when the review of the whole branch has passed.
Why: Merges into the integration branch close nothing, so Tickets usually close at the end of the run or later. So the orchestrator has to track those merges itself.
```

**A Ticket reports green, but its key test never ran.** A worktree holds only what git tracks, so tests that read gitignored (left out of git) fixtures, local databases or credentials can silently skip. Tell the orchestrator to run that Ticket in the main checkout, the folder you cloned. In Claude Code, a `.worktreeinclude` file copies the gitignored files you list, such as a `.env` of secret settings, into new worktrees.

```checkpoint quick-19
A Ticket's test reads a gitignored file. What can happen in its worktree?
- [x] The test can silently skip, while the Ticket still reports green.
- [ ] The test fails loudly, because git won't run it without the file.
- [ ] The test reads the file from the main checkout, as it normally does.
Why: A worktree holds only what git tracks, so a gitignored file isn't there. Tests that need it can silently skip.
```

**The tests sit at seams you never agreed.** No step lets you agree [seams](/learn/test-first) with the agent, as an implement session does. So name them in the Spec or the Tickets.

### Try it

You'll need your practice project. If you haven't set it up, do [keeping track](/learn/issues-and-keeping-track)'s Try it step first.

1. Create a small Spec and three Tickets. Use the numbers `gh` prints for `<spec>` and `<list>`.

```bash
gh issue create --title "Classes API" --body "Members can list classes by day."
gh issue create --title "List classes" --body "First slice." --parent <spec>
gh issue create --title "Filter classes by day" --body "Second slice." --parent <spec> --blocked-by <list>
gh issue create --title "Add a version endpoint" --body "Third slice." --parent <spec>
```

2. Open the Issues page: `gh issue list --web`. You should see a "Blocked" icon on the filter Ticket.
3. If your tests read a gitignored `.env`, add a `.worktreeinclude` file at the repo root containing `.env`.
4. Clear the context with `/clear`.
5. Type `/implement-spec` and the Spec's Issue number. You should see two implementers running at once.
6. Wait for List classes to land. You should see a new implementer start on the filter Ticket. If it doesn't, tell the orchestrator to track merges into the integration branch itself.
7. Open one implementer's trace, the record of what it ran. You should see tdd's failing test before the code, and no skipped tests.

You should end on one integration branch with all three Tickets merged. If a test skipped, tell the orchestrator to run that Ticket in the main checkout. Then merge that branch into `main` through a pull request, and run `git switch main && git pull`.

### Read more

- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock, updated 2026-10-05
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05
- [Start subagents with a fresh context window, not a fork (#1341)](https://github.com/mattpocock/skills/pull/1341), Matt Pocock, 2026-10-29
- [implement-spec: a fresh implementer subagent per ticket (#1342)](https://github.com/mattpocock/skills/pull/1342), Matt Pocock, 2026-10-29
- [implement-spec: make subagent lifecycles explicit per ticket (#1328)](https://github.com/mattpocock/skills/issues/1328), saidelike, 2026-10-25
- [/implement-spec doesn't drive /tdd, unlike /implement (#1035)](https://github.com/mattpocock/skills/issues/1035), rynz, 2026-09-03
- [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees), Anthropic, read 2026-10-30

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint implement-spec-deeper-reused-implementer
You're running a whole Spec for your yoga-studio API with subagents in a harness that lets the orchestrator reuse agents. It hands the second Ticket to the implementer that just built the first one, in a new worktree. The Skill asks for a fresh implementer for each Ticket instead. Why?
- [x] The reused implementer still carries the first Ticket's context into the second one.
- [ ] A reused implementer can't check out a new worktree, so its branch would land on main.
  > Worktrees did keep the branches apart in the real report. What carried over was the agent's context, not its files.
- [ ] A fresh implementer is needed so the orchestrator can track the frontier from the tracker.
  > The frontier comes from the task graph and merges, not from which agent builds a Ticket. The rule is about each agent's context.
- [ ] Only a fresh implementer can call tdd, because the Skill tool loads once per agent.
  > Nothing in the change is about calling tdd. Matt added "fresh" because an implementer that built Ticket A is still carrying A's context.
Why: A worktree keeps each Ticket's branch apart, but not the agent's context. One real run reused implementers across Tickets, and context carried over. So the Skill asks for a fresh implementer each time, which starts clean.
```

```checkpoint implement-spec-deeper-review-mid-run
Halfway through building your booking Spec with parallel subagents onto one integration branch, three Tickets have merged and two are still waiting on blockers. You'd like a review now, to catch problems early. Which fits best?
- [x] Let the remaining Tickets land, and leave the one full review for the end of the run.
  > Right: that's `/implement-spec`.
- [ ] Review the integration branch against the Spec now, and fix whatever it raises.
  > That's `/code-review`. It compares the code against the whole Spec, so mid-run every unbuilt Ticket reads as a failure. Each fix then starts another review.
- [ ] Stop the run and build the two waiting Tickets yourself, one session per Ticket.
  > That's `/implement`. The waiting Tickets are only blocked, not stuck. They start once their blockers land, and you'd lose the parallel run.
Why: The review compares the code against the whole Spec, so mid-run every unbuilt Ticket reads as a failure. The agent builds that Ticket, which sets off another review. That's why the one full review waits until every Ticket has landed.
```

## Remember

```flashcards
Q: What does implement-spec create?
A: One integration branch holding the whole Spec, with every Ticket resolved the way the Issue tracker closes work.

Q: In implement-spec, what is the frontier?
A: The Tickets that are ready to be grabbed now, because nothing still blocks them.

Q: One Ticket to build. implement-spec or implement?
A: [implement](/learn/implement). implement-spec is for a whole Spec's Tickets.

Q: Which Skill does each implementer subagent call to build its Ticket?
A: [tdd](/learn/tdd).

Q: What are Matt's three ways to work through a set of Tickets, and which is implement-spec?
A: The manual loop (you are the for loop), the deterministic loop (a script, which he recommends for most people), and the agent loop. implement-spec is the agent loop.

Q: Two parallel implementers named the same new string `blockedSince` and `blockedOn`. Why, and what's the fix?
A: Each sees only its own Ticket and the shared notes, and worktrees postpone collisions to merge time. Add a blocking link between the two Tickets, or fix the exact names in the exploration notes.

Q: On GitHub, why can a blocked Ticket never start during a run, even after its blocker merged?
A: The blocked-by count only drops when the blocker closes, usually at the end of the run, or later when the PR merges. Have the orchestrator track merges into the integration branch itself.
```

## Final test

```final-test implement-spec-task-graph
How does implement-spec treat a Spec's Tickets?
- [x] As a graph, starting each Ticket once its blockers are done.
- [ ] As a list, built one at a time in the order they were written.
- [ ] As one big piece of work, built together in a single session.
- [ ] As suggestions, building only the Tickets it judges most useful.
Why: Some Tickets block others, so the links set the order, not a list. Whatever nothing still blocks is the frontier, and implementer subagents run in the background to build those Tickets at once.
```

```final-test implement-spec-before-done
What does each implementer subagent do just before it reports done?
- [x] Merges the integration branch's latest commit into its own.
- [ ] Merges its own branch straight into the integration branch.
- [ ] Closes its Ticket and the Spec in the Issue tracker.
- [ ] Deletes its worktree so the next Ticket starts clean.
Why: Bringing in the latest commit first means its work already fits everything merged so far. Folding it into the integration branch is the merger subagent's job, and the worktrees are cleaned up at the very end.
```

```final-test implement-spec-after-all-tickets
Once every Ticket is complete, what does implement-spec do next?
- [x] Reviews the integration branch and fixes all findings in one subagent.
- [ ] Merges the integration branch into main, then reviews what landed.
- [ ] Writes a new Ticket for each finding and runs them as a graph.
Why: The review compares the code against the whole Spec, so it only makes sense once every Ticket is in. One fresh implementer subagent then fixes everything it raises.
```

```final-test implement-spec-deeper-why-fresh
Why did Matt add the word "fresh" to implement-spec's implementer subagents?
- [x] An implementer reused for a new Ticket still carries the context of the Ticket it built before.
- [ ] A fresh implementer runs in the background, while a reused one blocks the orchestrator's session.
- [ ] A reused implementer can't merge its own branch, so the merger subagent had to start over each time.
- [ ] Two implementers could not share one worktree, so each Ticket needed a brand-new worktree and agent.
Why: An implementer that built Ticket A is still carrying A's context, so handing it Ticket B would mix the two. A fresh one starts clean. Merging is a separate job, and the merger subagent can be reused across merges.
```

```final-test implement-spec-deeper-skipped-test
A Ticket reports green in its worktree, but its key test never ran. Why?
- [x] A worktree holds only what git tracks, so tests needing gitignored files can silently skip.
- [ ] The merger subagent runs the tests after merging, so the implementer never runs them itself.
- [ ] Implementers skip tdd for Tickets that are blocked, so those Tickets have no tests at all.
- [ ] The code-review step deletes failing tests from the integration branch before the final report.
Why: A worktree holds only what git tracks, so gitignored fixtures, local databases and credentials aren't there, and tests that need them can silently skip. Run such a Ticket in the main checkout instead. In Claude Code, a `.worktreeinclude` file can also copy gitignored files such as `.env` into new worktrees.
```

```final-test implement-spec-whole-spec
The Spec for your FastAPI booking backend is split into eight Tickets with blocking links. Three of them have no blockers. You want the whole Spec built, with Tickets that don't depend on each other built at the same time. Which fits best?
- [x] Run the Tickets as a graph, with a subagent for each ready Ticket.
  > Right: that's `/implement-spec`.
- [ ] Build one ready Ticket yourself, then clear context before the next.
  > That's `/implement`. It builds one Ticket at a time, driven by you. Tickets that don't depend on each other still wait their turn.
- [ ] Split the Spec into thinner Tickets with blocking links first.
  > That's `/to-tickets`. The Tickets already exist, blocking links included.
Why: Blocking links make these Tickets a task graph, and the three with no blockers are its frontier. Running the graph lets helper agents build those three at once, then land everything on one integration branch.
```

```final-test implement-spec-one-ticket
Only one Ticket is left on your website's Spec, #42, which adds a contact form. Nothing blocks it, and you want it built now. Which fits best?
- [x] Fetch the Ticket, build it test-first, then get it reviewed.
  > Right: that's `/implement`.
- [ ] Start an integration branch and an implementer subagent for it.
  > That's `/implement-spec`. With one Ticket there's no task graph to run, so an integration branch and subagents add work for nothing.
- [ ] Split the Ticket into smaller Tickets with blocking links.
  > That's `/to-tickets`. The Ticket already exists and is ready to build.
Why: With one Ticket there's no graph to run, so parallel helper agents would have nothing to add. implement fetches the Ticket from the Issue tracker, builds it with tdd at pre-agreed seams, and calls code-review once done.
```

```final-test implement-spec-ticket-finished
You're running a whole Spec for a Dockerised FastAPI app. An implementer subagent has just finished the Ticket that lists bookings from a new table, and two other Tickets were waiting on it. What comes next?
- [x] Merge it into the integration branch and start the Tickets it freed.
  > Right: that's `/implement-spec`.
- [ ] Review the whole integration branch now, before more Tickets start.
  > That's `/code-review`. The review of the integration branch runs once all Tickets are complete, not after each one.
- [ ] Write a pull request body for the finished Ticket on its own.
  > That's `/pr`. In this Flow, Tickets don't get pull requests of their own. A merger subagent folds each one into the integration branch.
Why: The other two Tickets are waiting on this one, so its work has to land before they can start. A merger subagent folds it into the integration branch, and the freed Tickets then get implementer subagents of their own.
```

```final-test implement-spec-all-merged
Every Ticket of your website's Spec has been built and merged into the integration branch. What comes next?
- [x] Review the integration branch, then fix what the review finds.
  > Right: that's `/code-review`.
- [ ] Write the pull request body now, so the work can be handed over.
  > That's `/pr`. The review comes first, so its fixes are part of what you hand over.
- [ ] Start another red-green loop to add tests across the branch.
  > That's `/tdd`. The building is done. What's missing is a look at the whole branch.
Why: The review looks at the finished whole, so it comes once every Ticket is in. One fresh implementer subagent then fixes everything it raises, and only after that is the draft pull request marked ready.
```

```final-test implement-spec-pointers-not-paste
While building your AI agent's Spec, each Ticket goes to its own implementer subagent with a fresh context. The message it gets is short, with links to the Spec, its Ticket and earlier commits, not a pasted copy of them. What's the reason behind this step?
- [x] The links already lead there, so pasting would only duplicate it.
- [ ] Short messages make each subagent finish its Ticket faster.
  > The Skill's reason isn't speed. It's what goes into each subagent's context, with no copies of things the pointers already lead to.
- [ ] Subagents can't read a pasted Ticket, only a link to the Issue.
  > Nothing stops a subagent reading pasted text. Pointers avoid duplicating what's already available.
- [ ] It keeps the Issue tracker from drifting out of date with the copies.
  > The Issue tracker is the same either way. The pointers are about what goes into each subagent's context.
Why: A subagent starts with a fresh context, but it can read the Spec, its Ticket and earlier commits for itself. A short pointer gets it there, so a pasted copy would only repeat what the pointer already leads to.
```

```sources
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [Creating issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies)
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock, 2026-10-05 (page says Updated Oct 5, 2026)
- [Start subagents with a fresh context window, not a fork #1341](https://github.com/mattpocock/skills/pull/1341), mattpocock, 2026-10-29
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic (Claude Code Docs)
- [implement-spec: make subagent lifecycles explicit per ticket](https://github.com/mattpocock/skills/issues/1328), saidelike, 2026-10-25
- [implement-spec: a fresh implementer subagent per ticket](https://github.com/mattpocock/skills/pull/1342), mattpocock, 2026-10-29
- [Run parallel sessions with worktrees (Claude Code Docs)](https://code.claude.com/docs/en/worktrees), Anthropic
- [`/implement-spec` doesn't drive `/tdd`, unlike `/implement`](https://github.com/mattpocock/skills/issues/1035), rynz, 2026-09-03
- [Git - gitglossary Documentation](https://git-scm.com/docs/gitglossary), The Git project
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [writing-for-agents: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
```
