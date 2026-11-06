---
title: implement
slug: implement
summary: implement turns work that's already decided into a commit: it builds it, tests it, reviews it, and never reopens the plan.
---

## What it's for

The deciding is done, and your [Tickets](/learn/issues-and-keeping-track) are written. Type "build this" at a fresh agent, and it often redesigns the work while it builds it.

**implement turns work that's already decided into a commit: it builds it, tests it, reviews it, and never reopens the plan.**

Say you're building the yoga-studio booking site, and Ticket #12 (List bookings) is next. You start a fresh session and type:

```
/implement #12
```

The agent then works in a fixed order:

1. It fetches Ticket #12 from the [Issue tracker](/learn/issues-and-keeping-track) and states its title. If the reference is unclear, it asks.
2. Where it can, it builds test-first with [tdd](/learn/tdd), at seams agreed up front. A seam is a place where tests check the code from outside.
3. It runs the type check and single test files often, and the full test suite once at the end. The type check catches wrong types before the code runs.
4. It runs [code-review](/learn/code-review), whose subagents review the work.
5. It commits to the current branch.

```checkpoint quick-1
You run implement with a Ticket reference that could mean two things. What happens?
- [x] It asks which Ticket you mean before it starts.
- [ ] It picks the closest match and starts building.
- [ ] It builds every Ticket the reference could mean.
Why: implement states the Ticket's title before it starts, and if the reference is unclear, it asks you.
```

## When to use it

- You're working through the Tickets that [to-tickets](/learn/to-tickets) made, one at a time. Clear the context window between them, after any [retro](/learn/retro). Each Ticket is self-contained, so the last one's context isn't needed.
- You've finished [grilling](/learn/grill-before-you-build), and the work is small enough for one session. Build it in the same context window, with no [Spec](/learn/issues-and-keeping-track) or Tickets.

```checkpoint quick-2
Ticket #12 is committed and Ticket #13 is next. Why is it safe to clear the context window?
- [x] Each Ticket is self-contained, so #12's context isn't needed.
- [ ] The agent copies #12's context into #13 when it commits.
- [ ] Clearing the window saves #12's context for the next session.
Why: Each Ticket is self-contained, so #13 doesn't need what the agent saw for #12. Do any retro on that session before you clear.
```

## When not to use it

- If you'd rather have agents run the whole build than drive each Ticket yourself, use [implement-spec](/learn/implement-spec) instead. It builds the whole Spec in one run, with agents working in parallel.
- If bug reports and requests are piling up, use [triage](/learn/triage) first, because it turns them into Issues ready for an agent.

```checkpoint quick-3
You'd like one run to build the whole Spec, with agents in parallel. Which Skill fits?
- [x] implement-spec, which builds the whole Spec in one run.
- [ ] implement, given every Ticket of the Spec in one go.
- [ ] triage, which sets an agent on each Ticket of the Spec.
Why: implement-spec builds the whole Spec in one run, with agents working in parallel. Pick it when you'd rather orchestrate the build than drive each Ticket.
```

## What it needs to start

Only you can start implement, by typing `/implement`. It needs:

```checkpoint quick-4
Your Tickets are ready and the agent is idle. Will it start implement by itself?
- [x] No. Only you can start it, by typing /implement.
- [ ] Yes. It starts on the first ready Ticket by itself.
- [ ] Yes, but only once you've cleared the context window.
Why: Only you can start implement, by typing /implement. The agent doesn't start it by itself, however ready the Tickets are.
```

- A Spec or a Ticket, ideally one whose blockers are all done. For small work, the settled conversation is enough. Say so when you start it.
- Ideally, [seams](/learn/test-first) agreed up front.
- The right branch checked out. implement commits to whatever branch it's on, and it won't make one for you.

```checkpoint quick-5
You start implement while you're still on `main`. Where do its commits go?
- [x] Onto `main`, because it commits to whatever branch it's on.
- [ ] Onto a new branch that it makes for the Ticket before it starts.
- [ ] Nowhere yet, because it stops first to ask which branch you want.
Why: implement commits to whatever branch it's on and won't make one for you. So check out the right branch before you start.
```

## What it creates

Code and tests, as commits on the current branch, plus a [code review](/learn/review-spec-and-standards) of that work.

implement stops at the commit. It opens no pull request and closes nothing. The rest is up to you.

```checkpoint quick-6
implement has committed its work on Ticket #12. What state is the Ticket in?
- [x] Still open, because implement closes nothing.
- [ ] Closed, because the commit mentions its number.
- [ ] In review, because implement opened a pull request.
Why: implement stops at the commit. It opens no pull request and closes nothing, so the Ticket stays open until you close it the way your Issue tracker closes work.
```

Say your repo closes work through pull requests, as in [pull requests and merging](/learn/merging-and-cleaning-up). You open a pull request marked as closing the Ticket, with `Closes #12`. If the agent writes it, [pr](/learn/pr), the Skill with the template for a pull request's description, shapes its body. Merging that pull request into `main` closes Ticket #12.

```checkpoint quick-7
Your repo closes work through pull requests, and implement has finished. Who opens the pull request?
- [x] You do, because implement opens no pull request.
- [ ] implement does, as its final step, once the checks pass.
- [ ] code-review does, as soon as its review finishes.
Why: You open it, marked as closing the Ticket with a line such as Closes #12. If the agent writes it, the pr Skill shapes its body. Merging it closes the Ticket.
```

```diagram
type: chain
caption: "implement stops at the commit."
steps:
  - "It fetches Ticket #12 from the Issue tracker and states its title"
  - label: "Where it can, it builds test-first with [tdd](/learn/tdd)"
    note: "at seams agreed up front"
  - label: "It runs the type check and single test files often"
    note: "the full test suite once at the end"
  - "It runs [code-review](/learn/code-review), whose subagents review the work"
  - "It commits to the current branch"
  - "You open a pull request"
  - "Merging that pull request into `main` closes Ticket #12"
groups:
  - from: 1
    to: 5
    label: "The agent then works in a fixed order"
  - from: 6
    to: 7
    label: "The rest is up to you"
```

## Going deeper

### Why it exists

The deciding happens before the build, when you grill the idea and write the Spec and Tickets. A fresh agent told to "build this" often redesigns that work as it builds.

Matt built implement to do the opposite: "It never reopens the plan." There's no interview, no clarifying round, and no proposal of a different approach. Whatever was settled upstream, in the steps before it, is the input.

```checkpoint quick-8
Halfway through a Ticket, the agent sees a design it likes better. What does implement have it do?
- [x] Build the settled plan, with no proposal of a different approach.
- [ ] Stop and interview you about which of the designs you would prefer.
- [ ] Switch to the better design and tell you about it when it has finished.
Why: implement never reopens the plan. There's no interview, no clarifying round and no proposal of a different approach, because what was settled upstream is its input.
```

So implement is the step where deciding stops and building starts.

### How it works underneath

**Seams agreed before the code.** A test at a seam watches what the code does from outside, so it doesn't depend on how the code works inside. Say Ticket #13 names its seam:

```
Ticket #13: the endpoint that creates a booking
Seam: test through POST /bookings
```

The test calls `POST /bookings` and checks the response. Agree that seam before any code exists, and the test lasts. You can rewrite the code behind the endpoint without changing the test.

```checkpoint quick-9
You rewrite the code behind a seam you agreed up front. What happens to the test at that seam?
- [x] It stays as it is, because it only watches the seam.
- [ ] It needs rewriting too, because the code behind it changed.
- [ ] It gets deleted, because it was written against the old code.
Why: Agree the seam before any code exists, and the test lasts. You can rewrite the code behind the endpoint without changing the test.
```

Matt calls this agreement "the skill's weakest point". Nothing inside implement agrees the seams. [tdd](/learn/tdd) is the Skill that asks, and it writes no test at an unconfirmed seam.

```checkpoint quick-10
No seams were agreed for your Ticket. Which Skill asks you to confirm them?
- [x] tdd, which writes no test at an unconfirmed seam.
- [ ] implement, which agrees the seams before it builds.
- [ ] code-review, which picks seams once the code is done.
Why: Nothing inside implement agrees the seams. tdd is the Skill that asks, and it writes no test at an unconfirmed seam.
```

So the agreement happens upstream in the Spec, or in the first exchange of the run. If it happens nowhere, the run becomes plain code-writing, and nothing warns you.

**A check the agent can run.** Anthropic, the company that makes Claude, puts the general idea this way: "Give Claude something it can run that comes back pass or fail." The agent makes a change and runs the check. If something broke, it reads the output and fixes it without you watching. So implement's checks catch its own mistakes.

```checkpoint quick-11
Why give the agent something it can run that comes back pass or fail?
- [x] It can fix its own mistakes without you watching.
- [ ] You can grade each of its steps by hand as it goes.
- [ ] It can carry on in a session that's already full.
Why: The agent makes a change and runs the check. If something broke, it reads the output and fixes it, so you don't have to watch.
```

### A real example

Until October 2026, implement didn't have to say which Ticket it had picked up. An Issue on Matt's repo reported a run of `/implement #2` in a fresh session of Codex, another coding agent. Matt's summary: the agent matched `#2` to another numbered list in its context, and "started on the wrong work without saying so."

The fix was one rule: fetch the Ticket from the Issue tracker and state its title before starting. Now a wrong match shows up in the agent's first line, where you can catch it.

```checkpoint quick-12
Why does implement state the Ticket's title before it starts?
- [x] So you can catch a wrong match in its first line.
- [ ] So the Issue tracker can mark the Ticket as started.
- [ ] So the agent can rebuild its context from the title.
Why: The agent once matched a bare #2 to another numbered list and started the wrong work. Now a wrong match shows up in its first line, where you can catch it.
```

So check that the title is the Ticket you meant.

### Where it goes wrong

**The tests appeared after the code.** An open Issue on Matt's repo reports that "TDD and code-review almost never run." One user saw the agent write the code first and add tests after. So the passing suite didn't show that those tests could catch the old behaviour. Another user's 1,125 session transcripts held 17 implement runs, with no tdd call in any of them.

Users there blame the weak spot above: no seam gets agreed, so nothing triggers tdd. All these reports are older than an October 2026 change. implement now tells the agent to call tdd with the Skill tool, which loads a Skill by name.

The fix: name the seams in the Spec or the Ticket, since Tickets have no seam field. That's no guarantee: one run worked out seams from a Spec and still never called tdd. So check the trace, the record of each step the agent took. You want to see an actual `tdd` call there, not only tests appearing in the diff.

```checkpoint quick-13
How can you tell that implement really ran tdd?
- [x] The trace shows an actual tdd call.
- [ ] The diff shows new tests beside the code.
- [ ] The full test suite passes at the end.
Why: Tests in the diff don't prove tdd ran, because they may have come after the code. Check the trace, the record of each step the agent took, for an actual tdd call.
```

**The Ticket is built, but it's still open.** implement has no completion step. It ends at the commit and never touches the Ticket, and it doesn't act on [code-review](/learn/code-review)'s findings either. That matters most on a chain of Tickets, because the next ones count as ready only when all their blockers are closed. Matt's warning: "If nothing gets closed, nothing ever becomes visibly unblocked." The fix: act on the findings, then close the Ticket yourself, or merge a pull request with `Closes #` and its number.

```checkpoint quick-14
implement has committed the first Ticket of a chain. Why don't the next Tickets look ready?
- [x] The first Ticket is still open, so it still blocks them.
- [ ] They wait until every review finding has been fixed first.
- [ ] They stay locked until a pull request for it has been opened.
Why: implement ends at the commit and never touches the Ticket. The next ones count as ready only when all their blockers are closed, so close it, or merge a pull request that closes it.
```

**code-review says it can't see your changes.** code-review reads `git diff <fixed-point>...HEAD`. A fixed point is the commit, branch or tag a review compares against. HEAD is the commit you currently have checked out. So the diff leaves out anything not yet committed, and implement runs the review before it commits. Unless an earlier commit exists, there's nothing to review. The fix: "Commit first, then review against the point you branched from."

```checkpoint quick-15
On a new branch with no commits yet, code-review runs. What does it see?
- [x] Nothing, because the diff leaves out uncommitted work.
- [ ] Only staged changes, because implement stages as it goes.
- [ ] Every change, because it reads the working directory too.
Why: code-review compares a fixed point with HEAD, the commit you have checked out. Work that isn't committed isn't in that diff, so commit first, then review.
```

**One Ticket used over 100k tokens.** That's normal for a non-trivial Ticket, not a sign something broke. The fix is upstream: right-size the Tickets in [to-tickets](/learn/to-tickets), so each fits one fresh context window. If one keeps going over, split it rather than raising the effort level, the main control for how hard Claude thinks.

```checkpoint quick-16
A Ticket keeps going over one fresh context window. What do you change?
- [x] Split the Ticket into smaller ones.
- [ ] Raise the effort level for its run.
- [ ] Report the run as a sign of a bug.
Why: Over 100k tokens alone is normal for a non-trivial Ticket. If one keeps going over a fresh window, it's likely too big, so split it rather than raising the effort level.
```

**Commits landed on the wrong branch, and a stash vanished.** You met this report in [branches and worktrees](/learn/branches-and-worktrees). Several implement sessions ran side by side in one checkout. They shared one working directory, one index (git's list of what goes in the next commit) and one HEAD. In a single afternoon, a stash (work set aside with `git stash`) vanished and commits landed on the wrong branch.

The fix: Matt's rule is "one invocation, one ticket." For several Tickets at once, use [implement-spec](/learn/implement-spec), which gives each one its own worktree. Some people run separate implement sessions in their own worktrees instead. Either way, the stash list is shared across worktrees too, so worktrees alone don't fix the stash case.

```checkpoint quick-17
You give each implement session its own worktree. Why can a stash still vanish?
- [x] The stash list is shared across worktrees too.
- [ ] Each worktree deletes its own stash when it ends.
- [ ] git clears the stash when a session makes a commit.
Why: Separate worktrees give each session its own folder, but the stash list, refs/stash, is shared across them. So worktrees alone don't fix the stash case.
```

### Try it

You'll need your practice project. It needs an open Ticket whose blockers are all closed, such as the endpoint that creates a booking. If you haven't set the project up, do [keeping track](/learn/issues-and-keeping-track)'s Try it step first, then ask your agent to add a FastAPI app in `api/`.

1. On GitHub, open the Ticket. Add one line naming its seam: `Seam: test through POST /bookings`.
2. In your terminal, run `git switch main`, then `git pull`.
3. Run `git switch -c implement-booking`, because implement commits to whatever branch it's on. You should see that branch checked out.
4. Start a fresh Claude Code session in the repo.
5. Type `/implement <you>/yoga-studio#N`, with your GitHub name and the Ticket's number. You should see the Ticket's title first.
6. Watch the run. Look for a `tdd` call before any code changes. Confirm the seam if it asks.
7. If code-review asks for a fixed point, type `main`.
8. You should see a commit at the end. If the review found an empty diff, run `/code-review main`.
9. Open the Ticket on GitHub. You should see it's still open, because implement closes nothing.
10. Run `git push -u origin implement-booking`.
11. Run `gh pr create --title "Create a booking" --body "Closes #N"`, with the Ticket's number.
12. Merge the pull request once its checks pass. If CI lacks Postgres or a package, ask your agent to add it. You should see the Ticket close.
13. Type `/clear` before you start the next Ticket.

### Read more

- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, updated 2026-08-24, current to at least 2026-10-07
- [implement: fetch a passed ticket reference and state its title (#1196)](https://github.com/mattpocock/skills/pull/1196), Matt Pocock, 2026-10-06
- [implement: call the Skill tool for tdd and code-review](https://github.com/mattpocock/skills/commit/e48341a3d412cfeba4b9a79d3fd0331fc376ba82), Matt Pocock, 2026-10-06
- [/implement silently skips its /tdd and /code-review steps (#479)](https://github.com/mattpocock/skills/issues/479), AlejandroFuentePinero, 2026-07-09
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic, read 2026-10-30

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint implement-why-review
An agent has finished a Ticket that adds a SQL migration, and all the tests pass. Before committing, it still reviews its diff on two axes: the repo's coding standards and the Spec. Why bother, when the tests are green? What's the reason behind this step?
- [x] Passing tests don't prove it meets the standards or the Spec.
- [ ] To write the pull request's body from what the diff has changed.
  > The review checks the diff; it doesn't write the pull request body.
- [ ] To run the full test suite once more, as a final check.
  > The review reads the diff against standards and the Spec; it isn't a test run.
Why: Tests only show the code works as tested. They don't prove it follows the repo's written standards, or does what the Spec or Ticket asked. The review asks those two questions.
```

```checkpoint implement-deeper-why-commit-before
An agent finishes a yoga-studio Ticket, with all tests green and nothing committed yet. It runs the two-axis review against main, and the review reports an empty diff. Why did the review see nothing? What's the reason behind this step?
- [x] It reviews the diff from a fixed point to HEAD, and uncommitted changes aren't in it.
- [ ] It skips any Ticket whose tests are green, since passing tests already prove the work.
  > Green tests aren't why. The review compares HEAD with a fixed point, and work that isn't committed isn't in HEAD.
- [ ] It only reviews pull requests, and no pull request has been opened for this branch.
  > It needs a fixed point and HEAD, not a pull request. The diff was empty because nothing was committed yet.
Why: The review reads a git diff from a fixed point (the commit, branch or tag it compares against) to HEAD (the commit you have checked out). Uncommitted work isn't in that diff, so with no commits yet there's nothing to see. Commit first, then review against the point you branched from.
```

```checkpoint implement-deeper-why-tests-came-last
You built a booking Ticket with the build-one-Ticket Skill. The diff has tests, but the trace shows the code was written first and no test-first Skill call ever ran. Neither the Spec nor the Ticket named any seams. Why did the test-first step drop out? What's the reason behind this step?
- [x] No seam was agreed upstream, and nothing inside the build step agrees one itself.
- [ ] The test-first step only runs when the full test suite is already failing at the start.
  > A failing suite isn't the trigger. Tests go at pre-agreed seams, and here none were agreed anywhere.
- [ ] The build step only calls test-first work when it runs inside a separate worktree.
  > Worktrees aren't the trigger. Nothing inside it agrees the seams, so with none in the Spec the run becomes plain code-writing.
Why: implement asks for test-first work at pre-agreed seams, but nothing inside it agrees them. tdd does the asking, and only if it runs. So in practice the agreement comes from the Spec or the run's first exchange. If it happens nowhere, the run becomes plain code-writing, and nothing warns you. Naming the seams in the Spec guards against that.
```

```checkpoint implement-deeper-why-runs-collided
You ran two build sessions side by side in one yoga-studio checkout, one Ticket each. By the end of the afternoon a stash had vanished and some commits sat on the wrong branch. Why did the two runs collide? What's the reason behind this step?
- [x] Both sessions shared one working directory, one index and one HEAD, so each saw the other's git moves.
- [ ] Each session reopened the plan and rewrote the other Ticket's code to fit its own design.
  > The build step never reopens the plan. The damage was to git state: a stash and branches that both sessions shared.
- [ ] The two Tickets blocked each other, so each session waited and then committed onto the other's branch.
  > Blockers don't move commits. Both sessions used the same index and HEAD, so one session's checkout or stash changed what the other was working on.
Why: Two sessions in one checkout share one working directory, one index, one HEAD and the stash list, so one session's git moves change what the other is working on. Matt's rule is one run of implement per Ticket. For several at once, use the Skill that gives each Ticket its own worktree. Separate sessions in their own worktrees still don't fix the stash case, since the stash list, refs/stash, is shared across worktrees too.
```

## Remember

```flashcards
Q: What does implement create?
A: Code and tests, built test-first where possible, as commits on the current branch, plus a code review of the work.

Q: Does implement close the Ticket it builds?
A: No. It only commits to the current branch. The Ticket closes the way the Issue tracker closes work, for example through a pull request.

Q: Working Tickets one by one, what do you do between them?
A: Clear the context window, after any retro on that session. Each Ticket is self-contained, so the last one's context is no longer needed.

Q: When do you pick implement-spec over implement?
A: When you'd rather orchestrate the whole Spec in one run, with agents building ready Tickets in parallel, than drive each Ticket yourself.

Q: Does implement question or redesign the plan it's given?
A: No. It never reopens the plan: no interview, no clarifying round, no different approach. Whatever was settled upstream is the input.

Q: Why does implement state the Ticket's title before it starts?
A: A bare "#2" once matched another numbered list in context, and the agent started the wrong work. Fetching the Ticket and stating its title makes a wrong match visible at the first line.

Q: One implement run used over 100k tokens. What should you change?
A: Nothing is wrong with the run: over 100k is normal for a non-trivial Ticket. The fix is upstream: right-size Tickets in to-tickets, and split one that keeps going over rather than raising the effort level.
```

## Final test

```final-test implement-ticket-reference
You give implement a Ticket number. What does it do before it starts building?
- [x] It fetches the Ticket and states its title.
- [ ] It interviews you about how the Ticket should be built.
- [ ] It splits the Ticket into smaller Tickets first.
Why: It fetches the Ticket from the Issue tracker and states its title first, so you can catch a wrong match before any work starts. If the reference is unclear, it asks.
```

```final-test implement-how-it-ends
How does implement finish its work?
- [x] It reviews the work, then commits to the current branch.
- [ ] It commits, then opens a pull request that closes the Ticket.
- [ ] It runs the tests, then merges the branch into main.
- [ ] It writes a handoff file so the next session can carry on.
Why: The review and the commit are implement's last two steps, and the commit is where it stops. It opens no pull request and closes nothing, so those are left for you to do.
```

```final-test implement-test-runs
When does implement run the full test suite?
- [x] Once, at the end.
- [ ] After every change.
- [ ] Never. It only runs single test files.
Why: While it builds, it runs the type check and single test files regularly. The full suite runs only once, at the end, before the review.
```

```final-test implement-deeper-who-agrees-seams
implement builds test-first at pre-agreed seams. Where does that agreement come from?
- [x] From the Spec, or the run's first exchange, since tdd asks and implement never does.
- [ ] From implement itself, which interviews you about the seams before it writes any code.
- [ ] From code-review, which picks the seams after the code is written and then adds the tests.
Why: Nothing inside implement agrees the seams. tdd is the Skill that asks, and it writes no test at an unconfirmed seam. So in practice the agreement comes from the Spec or the run's first exchange. If it happens nowhere, the run becomes plain code-writing, and nothing warns you.
```

```final-test implement-deeper-nothing-unblocked
implement finished the first Ticket of a chain and committed it. Why do the Tickets it was blocking still not look ready?
- [x] implement has no completion step, so the finished Ticket, their blocker, stays open.
- [ ] implement keeps the chain locked until every code-review finding on the commit is fixed.
- [ ] implement marks the next Tickets blocked until a pull request for this one has merged.
Why: implement ends at the commit and never touches the Ticket, so the Ticket stays open. The next Tickets count as ready only when all their blockers are closed, so they can't look ready until it's closed.
```

```final-test implement-one-ticket-at-a-time
Your Spec for a FastAPI booking backend has eight Tickets with blocking links. You want to build them yourself, one Ticket per session, starting each with a fresh context window. Which fits best?
- [x] Build one Ticket per session, clearing the context between them.
  > Right: that's `/implement`.
- [ ] Hand the whole Spec to one orchestrated run with parallel agents.
  > That's `/implement-spec`. That's for when you'd rather orchestrate the build than drive each Ticket yourself.
- [ ] Split the Spec into Tickets.
  > That's `/to-tickets`. The Tickets already exist, with their blocking links.
Why: You want to drive the build yourself, one Ticket per session, and that's the per-Ticket way to work a Spec. Clearing the context between Tickets loses nothing, because each Ticket is self-contained: the last one's context is no longer needed.
```

```final-test implement-orchestrate-the-spec
A Spec for a Dockerised AI agent service has twelve Tickets, and four have no blockers. You'd rather set the whole build running, with agents working the ready Tickets in parallel, than drive each Ticket yourself. Which fits best?
- [x] Start one run that builds the whole Spec from its Tickets.
  > Right: that's `/implement-spec`.
- [ ] Build each ready Ticket yourself, one fresh session at a time.
  > That's `/implement`. That's driving each Ticket yourself. You'd rather one run set agents working the ready Tickets in parallel.
- [ ] Split the Spec into Tickets again, sized for parallel agents.
  > That's `/to-tickets`. The Tickets already exist.
Why: You'd rather start one run than drive each Ticket, so the whole-Spec run fits. It works out which Tickets block which, puts a fresh agent on each ready Ticket in parallel, and lands everything on one integration branch.
```

```final-test implement-small-change
You want to add a health-check endpoint to your FastAPI app. You've just talked it through in this session. It's small, and it will fit in this context window. Which fits best?
- [x] Build it right here, in this session.
  > Right: that's `/implement`.
- [ ] Write a Spec for it first, then build it.
  > That's `/to-spec`. A Spec and Tickets are for multi-session builds. This one fits in one session.
- [ ] Split it into Tickets, then build them.
  > That's `/to-tickets`. A change this small doesn't need slicing; it fits one context window as it is.
Why: The work fits this context window and you've already talked it through, so a Spec and Tickets would add steps for no gain. Those are for builds that span several sessions. Build it here, in the same context window.
```

```final-test implement-close-the-ticket
You're working Ticket #12 of your website's Spec, on its own branch. The code is built, the review's findings are fixed, and the commits are on the branch. This repo closes work through pull requests, and CI checks every pull request. What comes next? What comes next?
- [x] Open a pull request into main with "Closes #12" and a body shaped for review; merge once checks pass.
  > Right: that's `/pr`.
- [ ] Open a pull request into main with "Closes #12" and a body shaped for review; merge before checks finish.
  > That's `/pr`. CI builds and tests every pull request, and a protected branch can require those status checks before a merge. Merging first can put a broken change on main.
- [ ] Run the build step again, so it opens the pull request and closes #12.
  > That's `/implement`. It only commits to the current branch. It never opens a pull request or closes anything.
- [ ] Review the diff once more against the Spec and the standards first.
  > That's `/code-review`. The review has already run and its findings are fixed.
Why: Building stops at a commit, so Ticket #12 is still open. In this repo, work closes through a pull request: "Closes #12" in its description closes the Ticket when it merges into main, the default branch. The Skill for writing pull requests shapes the body. CI (automatic builds and tests) runs checks on the pull request, so wait for them to pass, to keep a broken change off main.
```

```final-test implement-next-ticket
Ticket #12's pull request is merged into main, and #12 is closed. You've already looked back over #12's session for fixes to the agent's environment, and they're committed. Ticket #13, for the same website, was blocked only by #12. What do you do next? What comes next?
- [x] Clear the context, then build #13 on a new branch from the updated main.
  > Right: that's `/implement`.
- [ ] Build #13 on a new branch from main, in this same context window.
  > That's `/implement`. Each Ticket starts fresh, because the last one's context is no longer needed.
- [ ] Clear the context, then build #13 on #12's branch, which is still checked out.
  > That's `/implement`. #12's branch is merged and done. New work goes on a new branch, made from the updated main, which now holds #12.
- [ ] Write a handoff file about #13, then build it on a new branch in a new session.
  > That's `/handoff`. A handoff is for a new harness, a new directory or a colleague. The Ticket already holds what the next session needs.
Why: Ticket #13 is self-contained and works from the Ticket itself, so #12's context is no longer needed: clear it. #12's branch is merged and done, so #13 goes on a new branch made from the latest main, which now holds #12.
```

```sources
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [code-review: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/code-review/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, 2026-08-24
- [implement: fetch a passed ticket reference and state its title (#1196)](https://github.com/mattpocock/skills/pull/1196), Matt Pocock, 2026-10-06
- [tdd: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/SKILL.md), Matt Pocock's Skills
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [implement: call the Skill tool for tdd and code-review (e48341a)](https://github.com/mattpocock/skills/commit/e48341a3d412cfeba4b9a79d3fd0331fc376ba82), Matt Pocock, 2026-10-06
- [/implement silently skips its /tdd and /code-review steps (#479)](https://github.com/mattpocock/skills/issues/479), AlejandroFuentePinero, 2026-07-09
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [Branches](https://docs.github.com/en/pull-requests/reference/branches)
```
