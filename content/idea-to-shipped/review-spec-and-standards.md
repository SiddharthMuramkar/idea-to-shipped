---
title: Review against the Spec and the standards
slug: review-spec-and-standards
summary: Review finished code on two axes, the repo's standards and the Spec, and keep their reports apart so a pass on one can't hide a fail on the other.
image: /images/lessons/review-spec-and-standards.jpg
imageAlt: A brass two-pan balance scale with an ornate central column, both pans level, on a grey background.
---

## Two questions, not one

Say an agent has finished Ticket #13, the endpoint (the web address your app calls) that creates a booking. You ask for a review and get one answer: looks good. But tidy code can still build the wrong thing, and the right code can still break your repo's conventions. One answer can't tell you which.

So ask two questions. Each one is an **axis**: one separate question a review judges. **When the code is written, review it on two axes, and keep their reports apart.**

- **Standards:** does the code follow this repo's written coding standards?
- **Spec:** does the code do what the [Spec](/learn/to-spec) or [Ticket](/learn/to-tickets) asked for?

```checkpoint quick-1
A review asks whether Ticket #13's endpoint does what the Ticket asked for. Which axis is that?
- [x] The Spec axis.
- [ ] The Standards axis.
- [ ] Both axes.
Why: Spec asks whether the code does what the Spec or Ticket asked for. Standards asks a different question, whether the code follows the repo's written coding standards.
```

## One change, two results

A change can pass one axis and fail the other:

- Code that follows every standard but builds the wrong thing: Standards pass, Spec fail.
- Code that does exactly what the Ticket asked but breaks the project's conventions: Spec pass, Standards fail.

```checkpoint quick-2
Your endpoint does exactly what the Ticket asked, but it breaks the project's conventions. What does the review report?
- [x] Spec pass, Standards fail.
- [ ] Standards pass, Spec fail.
- [ ] A clean pass on both axes.
Why: Doing what the Ticket asked is the Spec axis, so Spec passes. Breaking the project's conventions is the Standards axis, so Standards fails.
```

```diagram
type: compare
caption: "A change can pass one axis and fail the other"
columns: ["builds the wrong thing", "breaks the project's conventions"]
rows:
  - label: "Standards pass"
    cells: ["yes", "no"]
  - label: "Spec pass"
    cells: ["no", "yes"]
```

Say Ticket #13's endpoint does everything asked, but its route handler (the function that answers requests to it) breaks a rule in your `CODING_STANDARDS.md`. The report could read:

```text
## Standards
api/bookings.py: breaks CODING_STANDARDS.md, "route handlers stay thin".

## Spec
No findings: every requirement in Ticket #13 is implemented.

Findings: Standards 1, Spec 0. Worst on Standards: "route handlers stay thin".
```

That's Spec pass, Standards fail. So the two reports stay separate: merged or ranked together, a problem on one axis could hide a problem on the other.

```checkpoint quick-3
You're about to merge the two reports into one ranked list. What's the risk?
- [x] A problem on one axis could hide a problem on the other.
- [ ] The review would have to run each of its axes a second time.
- [ ] The Standards axis would stop reading the repo's written rules.
Why: Kept separate, each report shows its own result. Merged or ranked together, a problem on one axis can bury a problem on the other.
```

## How the review runs

[code-review](/learn/code-review) runs each axis in its own [subagent](/learn/context-window), a helper agent with a fresh context, at the same time, so the two don't pollute each other's context.

```checkpoint quick-4
Why does code-review give each axis its own subagent?
- [x] So the two don't pollute each other's context.
- [ ] So each one can fix the problems the other one finds.
- [ ] So the second one can check the first one's report.
Why: Each subagent has its own fresh context window, and the two run at the same time. So neither one's context gets into the other's.
```

The Standards axis reads every file in the repo that says how code should be written, such as the `CODING_STANDARDS.md` from [fix the environment](/learn/fix-the-environment).

That axis also carries a fixed set of **code smells**, signs that the design may have a problem. Duplicated code is one. The set applies even when your repo documents nothing.

A written repo standard always wins: if it allows something a smell would flag, the smell is dropped. And each smell is a judgement call, never a hard failure.

```checkpoint quick-5
Your repo's written standard allows something a code smell would flag. What happens to the smell?
- [x] It's dropped, because the repo standard always wins.
- [ ] It's reported as a hard failure, above your standard.
- [ ] It stays in the report, for you to settle by hand.
Why: The fixed set of smells sits under your written rules. If a standard allows what a smell would flag, the smell is dropped. And a smell is never a hard failure anyway.
```

## Why the reviewer enforces the standards

You might expect the agent writing the code to enforce the standards as it goes. But its context window is under the most pressure: it explores, writes code and debugs. The reviewing agent receives the [diff](/learn/commits-and-diffs), the exact lines the change adds and removes, so it has no exploring to do. So the reviewer, not the writer, enforces the coding standards.

```checkpoint quick-6
Why is the agent writing the code the wrong one to enforce the standards?
- [x] Its context window is under the most pressure: it explores, writes and debugs.
- [ ] It only needs the diff, so it never sees the code around each of its changes.
- [ ] Its context window is the emptiest, so it would miss most of the finer details.
Why: The writer explores, writes code and debugs, so its context window is under the most pressure. The reviewer receives the diff, so the standards are its job.
```

## Where it fits

[implement](/learn/implement) calls the review once a Ticket's code is done. Once every Ticket is complete, [implement-spec](/learn/implement-spec) runs one review over the whole **integration branch**, the single branch where all of a Spec's Tickets land.

```checkpoint quick-7
You're running implement-spec on a whole Spec. When does its review run?
- [x] Once, over the whole integration branch, after every Ticket is complete.
- [ ] Once for each Ticket, as soon as that one Ticket's own code is finished.
- [ ] Once at the very start, before any code is written, against the Spec alone.
Why: implement reviews once a Ticket's code is done. implement-spec waits until every Ticket is complete, then runs one review over the integration branch, where they all land.
```

## Going deeper

### Why it exists

A generic reviewer doesn't know your repo. It flags choices you made on purpose. It also misses **invariants**, the things that must always stay true in your code.

```checkpoint quick-8
Your repo has an odd pattern you chose on purpose, and you run a generic reviewer. What do you expect?
- [x] It flags your pattern, because it doesn't know your repo.
- [ ] It skips your pattern, because it guards your invariants.
- [ ] It asks you why, because it has read your written rules.
Why: A generic reviewer doesn't know your repo. So it flags choices you made on purpose, and it also misses the things that must always stay true in your code.
```

Matt Pocock, who wrote the code-review Skill, states its aim: "This design exists to avoid a generic review skill that does not know your standards."

So your repo's own written rules come first, and on the Standards axis the repo always overrides. The report closes with a worst issue per axis, never one overall winner.

### How it works underneath

**Code smells.** The baseline is twelve smells from the book _Refactoring_ by Martin Fowler. One is a name that doesn't say what it holds. A smell is a surface sign: it usually, but not always, points to a deeper problem. Fowler's own example is long methods, which aren't one of the twelve. Some long methods, he says, are fine. In his words, "smells don't _always_ indicate a problem."

```checkpoint quick-9
The review flags a variable name as a possible smell. What does that prove?
- [x] Nothing yet. It's a sign to look closer, as a smell isn't always a problem.
- [ ] That the name is wrong, and it has to be changed before you can merge the branch.
- [ ] That the Spec axis has missed a requirement that the Ticket had clearly asked for.
Why: A smell is a surface sign. It usually points to a deeper problem, but not always.
```

That fits code-review's rule: each smell is a rule of thumb, never a hard violation.

**A reviewer that didn't write the code.** Claude Code has its own built-in `/code-review`, a different command with the same name. It reviews the diff in a fresh subagent that never saw your chat. Anthropic, the company that makes Claude, says it "isn't swayed by the reasoning that produced the code."

A subagent isn't better by itself. Anthropic: "A fresh reviewer does help, because it hasn't seen your reasoning". Since October 2026, Matt's code-review asks for this outright: it says to start every subagent with a fresh context window.

```checkpoint quick-10
What do you gain by handing a review to a fresh subagent?
- [x] Fresh eyes: it hasn't seen your reasoning.
- [ ] A smarter answer: subagents think harder.
- [ ] Your full history: it knows why the code looks so.
Why: Handing the same job to a subagent doesn't make the answer better by itself. The gain is that a fresh reviewer hasn't seen the reasoning behind the code.
```

**Findings you can check.** Every finding must point at something you can read: a standards file and its rule, or a line of the Spec. A smell finding names the smell and quotes its hunk, the changed lines it's about. Matt warns: "Sub-agent output is a hypothesis, not evidence." So before you act on a finding, read what it points at.

```checkpoint quick-11
A finding says your code breaks a rule. What do you do before you act on it?
- [x] Read the rule or line it points at, since it's only a hypothesis.
- [ ] Apply its fix at once, since every finding counts as evidence.
- [ ] Ask a second subagent, since its word is what counts as proof.
Why: A subagent's output is a hypothesis, not evidence. Each finding has to point at something you can read, so read that before you act.
```

### A real example

Anthropic's best-practices page for Claude Code shows a real reviewer. It's one short file, `.claude/agents/reviewer.md`:

```text
---
name: reviewer
description: Reviews changed files against the spec they were built from. Use after implementing a feature, before opening the PR.
tools: Read, Grep, Glob
---
You're reviewing code you didn't write. Compare the changed files against the spec you're given,
check that every requirement is implemented and the listed edge cases have tests,
and report only the gaps that affect correctness. Skip style.
```

The `tools` line means it can read but can't edit. Its instructions compare the code with the spec and nothing else. So Anthropic's reviewer is a Spec axis on its own.

The same page gives a review-against-spec prompt that also ends with `skip style`, and warns you not to drop it. A reviewer asked to find problems will always find something. In Anthropic's words: "If you fix every finding, you end up with extra abstraction layers and tests for cases that can't happen."

```checkpoint quick-12
Anthropic's page warns against fixing every finding a reviewer reports. What does it say happens?
- [x] You end up with extra abstraction layers, and tests for impossible cases.
- [ ] The code ends up matching the Spec exactly, with nothing extra in it.
- [ ] The reviewer soon runs out of findings, and reports a fully clean pass.
Why: A reviewer asked to find problems will always find something. So fixing all of it adds layers and tests the code never needed.
```

code-review keeps a Standards axis, but limits it. That axis reads only the repo's written standards plus a fixed baseline.

```diagram
type: compare
caption: "code-review keeps a Standards axis, but limits it."
columns: ["Anthropic's reviewer", "code-review"]
rows:
  - label: "a Spec axis"
    cells: ["yes", "yes"]
  - label: "a Standards axis"
    cells: ["no", "yes"]
  - label: "each smell is a judgement call"
    cells: ["", "yes"]
footer: "So Anthropic's reviewer is a Spec axis on its own."
```

### Where it goes wrong

**You got a list of bugs, not two reports.** You reached Claude Code's built-in `/code-review`, which hunts bugs in the diff. When you install Matt's Skills, one of the two wins, depending on how you installed them. With the plugin, type the full name, `/mattpocock-skills:code-review`; with a plain install, your copy takes `/code-review`.

**The review finds new problems on every run.** Each fix adds new code to review, and the judgement calls change from run to run. Matt is blunt: "Do not run it in a loop until it comes back clean, because it never will." Treat a pass as a list of leads. Act on the findings with a cited rule behind them, then stop. implement-spec differs: it reviews once, and hands every issue to a single fresh subagent to fix.

**The review misses your latest work, or won't start.** code-review compares `HEAD`, the commit you currently have checked out, with the point you name, such as `main`. That diff excludes staged and working-tree changes: edits marked with `git add`, and edits not yet marked. If your branch has no commits yet, the diff is empty and the review stops there. implement can hit this, because it asks for the review before it commits (issue #511 on Matt's repo). So commit first, then review.

```checkpoint quick-13
You've edited three files on a new branch, committed nothing, and run code-review. What happens?
- [x] The diff is empty, so the review stops there.
- [ ] It reviews your uncommitted edits first of all.
- [ ] It reviews only the files you marked with git add.
Why: It compares HEAD with the point you name, so uncommitted edits aren't in the diff. A branch with no commits yet has an empty diff. So commit first, then review.
```

**The review runs in the session that wrote the code.** An agent reviewing in the session that wrote the code has every assumption behind that code in its context. One reader put it this way: "Same context reviewing itself isn't review, it's confirmation bias with a slash command." Since October 2026 the Skill says to start both subagents fresh. It has to ask: Claude Code can by default start a subagent that inherits the whole conversation. But implement still calls code-review from the writing session. That session briefs them. For an independent review, run `/code-review` yourself from a clean session.

**The review starts more agents than you asked for.** Issue #573 reports that the two subagents start `/code-review` themselves, so each spawns two more. One report reached more than 50 agents. Matt's repo keeps guards like a `do not invoke this skill` line out of scope. Its reason, about the agent tool you run: "The harness should be responsible for stopping infinite subagent loops, not skills." Claude Code does set a limit: by default, subagents nest at most three layers below your main conversation.

Matt's page calls this an open bug. Issue #573 was closed as not planned in October 2026, and the Skill has no guard. If you run code-review unattended, watch the agent count.

```checkpoint quick-14
You're about to run code-review unattended. What should you keep an eye on?
- [x] The agent count, since the Skill has no guard against growth.
- [ ] The commit count, since the Skill commits after every finding.
- [ ] The test count, since the Skill reruns your tests on each pass.
Why: Its subagents can start the review again, and each one then spawns two more. The Skill has no guard against that, so watch the agent count.
```

### Try it

Give the Standards axis a rule, then watch it catch a broken one. You'll need your practice project, with the Ticket for the endpoint that creates a booking (both set up in the Try it of [Issues: keeping track of work](/learn/issues-and-keeping-track)). It also needs a FastAPI app in `api/`; if it's missing, ask your agent to add one first. Start on `main` with nothing uncommitted: step 11 deletes branch `try-review`.

1. Create a branch for that Ticket: `git switch -c try-review`.
2. Add a `CODING_STANDARDS.md` with one rule: `Route handlers stay thin; booking logic lives in a service module.` (A service module is a separate file for that logic.)
3. Ask your agent to write the endpoint, with its booking logic in a service module.
4. Stage it all: `git add .`
5. Commit, naming the Ticket: `git commit -m "feat: create a booking (Closes #<ticket>)"`. The Spec axis finds its Ticket through that number.
6. In Claude Code, run `/clear` to start fresh.
7. Run `/code-review main`. You should see two blocks, `## Standards` and `## Spec`, not one merged list. If you installed Matt's Skills as a plugin, type `/mattpocock-skills:code-review main` instead.
8. Ask your agent to move the booking logic into the route handler, then commit that change.
9. Run `/clear` again.
10. Run `/code-review main` again (or `/mattpocock-skills:code-review main` with the plugin). You should see a finding under `## Standards` that names your rule.
11. Throw the branch away: `git switch main`, then `git branch -D try-review`. [implement](/learn/implement)'s Try it builds this Ticket for real.

### Read more

- [The /code-review Skill](https://www.aihero.dev/skills-code-review), Matt Pocock, updated 2026-08-24
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic, read 2026-10-30
- [Code Smell](https://martinfowler.com/bliki/CodeSmell.html), Martin Fowler, 2006-02-09
- [code-review sub-agents recursively invoke /code-review and fan out](https://github.com/mattpocock/skills/issues/573), dmmulroy, 2026-07-14
- [implement and code-review disagree on reviewing uncommitted changes](https://github.com/mattpocock/skills/issues/511), pellorao, 2026-07-10
- [Guards against sub-agents recursing into skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/subagent-recursion.md), Matt Pocock's repo, 2026-10-06
- [Start subagents with a fresh context window, not a fork (PR #1341)](https://github.com/mattpocock/skills/pull/1341), Matt Pocock, 2026-10-29

## Remember

```flashcards
Q: What are code-review's two axes?
A: Standards (does the code follow the repo's coding standards?) and Spec (does it do what the Spec asked?).

Q: Why does each review axis run in its own subagent?
A: So the two don't pollute each other's context.

Q: A written repo standard allows something the code-smell baseline would flag. Which wins?
A: The repo standard. The smell is dropped.

Q: Why can't code-review see changes you haven't committed yet?
A: It compares your last commit (`HEAD`) with the point you name, such as `main`, which leaves out staged and working-tree changes. Commit first, then review.

Q: Why shouldn't you drop "skip style" from a review-against-spec prompt?
A: A reviewer asked to find problems will always find something. Fixing every finding leaves extra abstraction layers and tests for cases that can't happen.

Q: code-review's subagents keep starting the review again. According to Matt's repo, whose job is it to stop that?
A: The harness's, not the Skill's. Matt's repo keeps "do not invoke this skill" guards out of scope.
```

## Final test

```final-test review-spec-and-standards-wrong-thing
Your FastAPI change passes every lint rule and naming convention, but it builds the wrong endpoint. What does a two-axis review report?
- [x] Standards pass, Spec fail.
- [ ] A clean pass, because the code follows the standards.
- [ ] Spec pass, Standards fail.
Why: Standards asks whether the code follows the repo's rules, and this code does. Spec asks whether it does what was asked, and this endpoint doesn't. So Standards passes and Spec fails.
```

```final-test review-spec-and-standards-separate
Why are the Standards and Spec reports kept apart instead of merged into one ranked list?
- [x] So a problem on one axis can't hide a problem on the other.
- [ ] Because merging two lists into one ranked list takes too long.
- [ ] So the Spec findings, which matter more, can be read first.
Why: In one ranked list, a problem on one axis could hide a problem on the other. Two separate reports show each result on its own, so neither can bury the other.
```

```final-test review-spec-and-standards-who-enforces
Which agent should enforce the coding standards?
- [x] The reviewing agent, which receives the diff.
- [ ] The agent writing the code, as it writes each line.
- [ ] The planning agent, which writes them into each Ticket.
Why: The writing agent's context window is under the most pressure, because it explores, writes code and debugs. The reviewer receives the diff and does no exploring, so enforcing the standards falls to it.
```

```final-test review-spec-and-standards-deeper-smell
Which idea of Fowler's fits code-review's rule that each smell is a rule of thumb, never a hard violation?
- [x] A smell is a surface sign that usually, but not always, points to a deeper problem.
- [ ] The twelve smells are too slow to check on every diff, so they're only sampled.
- [ ] The Spec axis already reports every smell as a requirement the Ticket missed.
Why: A smell usually points to a deeper problem, but not always, and some long methods are fine. That fits code-review's rule: each smell is a rule of thumb, never a hard violation.
```

```final-test review-spec-and-standards-deeper-no
You've run code-review three times on your booking endpoint, and each pass finds new Standards issues. What should you do?
- [x] Act on the findings that have a cited rule behind them, then stop.
- [ ] Keep fixing and rerunning it until the report finally comes back clean.
- [ ] Merge the two reports so the single worst issue overall is fixed first.
Why: Each fix adds new code to review, and the judgement calls change from run to run, so the report may never come back clean. Treat a pass as a list of leads, act on the findings with a cited rule behind them, then stop.
```

```sources
- [code-review: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/code-review/SKILL.md), Matt Pocock's Skills
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [The /code-review Skill](https://www.aihero.dev/skills-code-review), Matt Pocock, 2026-08-24
- [Code Smell](https://martinfowler.com/bliki/CodeSmell.html), Martin Fowler, 2006-02-09
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [Bug `implement` and `code-review` disagree on reviewing uncommitted changes #511](https://github.com/mattpocock/skills/issues/511), pellorao, 2026-07-10
- [code-review sub-agents recursively invoke /code-review and fan out #573](https://github.com/mattpocock/skills/issues/573), dmmulroy, 2026-07-14
- [Guards against sub-agents recursing into skills (.out-of-scope/subagent-recursion.md)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/subagent-recursion.md), Matt Pocock (mattpocock/skills, added in PR #1190), 2026-10-06
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic (Claude Code Docs)
- [Start subagents with a fresh context window, not a fork #1341](https://github.com/mattpocock/skills/pull/1341), mattpocock, 2026-10-29
```
