---
title: code-review: check changes against Spec and standards
slug: code-review
summary: How code-review checks your branch against the repo's coding standards and against the Spec, with a separate report for each.
---

## What it's for

Imagine the tests pass on [Ticket](/learn/issues-and-keeping-track) #13, the booking endpoint (the web address your app calls). Did the agent build what the Ticket asked, and follow your repo's rules? The agent that wrote the code is a poor judge of that.

**code-review judges your branch's changes on two separate [axes](/learn/review-spec-and-standards), each with its own report.**

- **Standards**: does the code follow the repo's documented coding standards?
- **Spec**: does the code do what the Issue or Spec behind it asked for?

Separate reports stop a pass on one hiding a failure on the other.

```checkpoint quick-1
Your change follows every standard but builds the wrong thing. Why does it help that the two reports stay separate?
- [x] The Standards pass can't hide the Spec failure.
- [ ] The Spec axis can be skipped once the Standards pass.
- [ ] The findings can be ranked together in one list.
Why: A change can pass one axis and fail the other. With separate reports, the pass on one can't hide the failure on the other.
```

On Ticket #13's branch, you type:

```text
/code-review main
```

`main` is the **fixed point**: the commit, branch or tag (a name for a commit) a review compares against.

The agent reads `git diff main...HEAD`. `HEAD` is the commit you currently have checked out. The three dots compare against the **merge-base**, the commit where your branch left `main`, so only your branch's changes show.

```checkpoint quick-2
You branched from `main`, and `main` has moved on since. What does `git diff main...HEAD` show?
- [x] Only your branch's changes, from the merge-base on.
- [ ] Your changes, plus everything that landed on main since.
- [ ] Only the changes in the last commit on your branch.
Why: The three dots compare against the merge-base, the commit where your branch left main. So later work on main stays out, and every commit on your branch stays in.
```

Each axis then runs in its own [subagent](/learn/context-window), a helper agent with a fresh context, at the same time.

The standards come from the repo's own files, such as `CONTRIBUTING.md`, its contribution rules. On top sits a **smell baseline**: twelve code smells, signs the design may have a problem, from Martin Fowler's book _Refactoring_. One is Duplicated Code: the same logic copied in two places.

Your repo's standards always win: if they allow something the baseline would flag, the smell is dropped. And each smell is a judgement call, never a hard violation.

```checkpoint quick-3
A review reports a smell, and your repo's standards say nothing about it. How do you treat it?
- [x] As a judgement call for you to weigh.
- [ ] As a hard violation you have to fix.
- [ ] As noise, because only repo rules count.
Why: A smell is always a judgement call, never a hard violation. Your repo's standards can overrule it, but here they say nothing, so it's yours to weigh.
```

```diagram
type: chain
caption: "Each axis then runs in its own subagent, at the same time."
steps:
  - "you type: `/code-review main`"
  - label: "The agent reads `git diff main...HEAD`"
    note: "only your branch's changes show"
  - parallel:
      - "Standards: does the code follow the repo's documented coding standards?"
      - "Spec: does the code do what the Issue or Spec behind it asked for?"
  - "a report with a `## Standards` part and a `## Spec` part"
```

## When to use it

- You want a finished branch, a pull request or work in progress checked.
- You're running [implement](/learn/implement) or [implement-spec](/learn/implement-spec). They call it for you.

```checkpoint quick-4
You're running implement on a Ticket. Once the code is done, who starts the review?
- [x] implement does, because it calls code-review for you.
- [ ] You do, because implement stops and waits for you.
- [ ] Nobody, because implement leaves review to the PR.
Why: implement and implement-spec both call code-review themselves, so you don't have to start it.
```

## When not to use it

- If you need a pull request's description, use its look-alike [pr](/learn/pr) instead, because it writes the description and doesn't judge the code.
- If the whole codebase is the problem, not one diff, use [improve-codebase-architecture](/learn/improve-codebase-architecture) instead, because it surveys a codebase for hard-to-change code and suggests refactors.
- If you want bugs hunted, use Claude Code's built-in reviewer, `/review`, instead, because this Skill doesn't hunt them.

```checkpoint quick-5
Your branch is reviewed and fixed, and its pull request needs a description. Which Skill fits?
- [x] pr, which writes the pull request's description.
- [ ] code-review, which judges the code.
- [ ] improve-codebase-architecture, which surveys a codebase.
Why: pr writes a pull request's description and doesn't judge the code. Judging is code-review's job, and it's already done here.
```

## What it needs to start

You type `/code-review`, or you ask for a review and the agent starts it on its own. It needs:

- Your work committed, because it reads only commits.
- A fixed point, or it asks for one.
- A Spec. It looks for Issue numbers in your commit messages, such as `Closes #13`, then a path or Spec file, and asks if it finds none. Issue numbers need your Issue tracker [set up](/learn/setup-matt-pocock-skills). With no Spec, it skips the Spec axis and says so.

```checkpoint quick-6
You run a review on a branch with no Spec anywhere. What happens?
- [x] It skips the Spec axis, and says so.
- [ ] It stops at once, with no report at all.
- [ ] It runs the Standards axis a second time.
Why: With no Spec, there's nothing to check the code against. So the Spec axis is skipped and the report says so, while the Standards axis still runs.
```

## What it creates

Nothing on disk. You get a report with a `## Standards` part and a `## Spec` part. It ends with one line: how many findings (problems) each axis has, and the worst issue within each.

```checkpoint quick-7
You're about to read the report's last line. What will it tell you?
- [x] Each axis's finding count and its worst issue.
- [ ] The one worst issue picked across both axes.
- [ ] Every finding again, merged and ranked by risk.
Why: The report ends with one line, how many findings each axis has and the worst issue within each, so the two axes stay apart to the end.
```

## Going deeper

### Why it exists

A reviewer that doesn't know your repo gets two things wrong. It complains about choices you made on purpose, and it misses the rules your code relies on. Matt Pocock, who wrote the Skill, says his design "exists to avoid a generic review skill that does not know your standards."

```checkpoint quick-8
Say a reviewer reads your repo without knowing its standards. What does it get wrong?
- [x] It flags choices you made on purpose, and misses your rules.
- [ ] It passes everything, because it has no rules to check against.
- [ ] It refuses to run until the repo has its own written standards.
Why: A reviewer that doesn't know your repo complains about what's deliberate and misses the rules your code relies on. That's the problem code-review's design avoids.
```

So your repo's own docs come first, and the repo always overrides.

Agents can make a codebase worse over time. Matt's answer is two agents: one does the work, the second imposes your standards.

### How it works underneath

**Fresh eyes.** Think of proofreading your own essay: you read what you meant. Matt says agents are often "really bad at editing code or improving code" they've written themselves. So each axis runs in a subagent, whose clean context sees only its brief. Neither axis sees the other's reasoning, either.

```checkpoint quick-9
An agent has written your code in this session. Why does each axis run in a subagent?
- [x] It starts clean, and sees only its brief.
- [ ] It can open files the agent isn't allowed to.
- [ ] It can run tests the agent has no way to run.
Why: Agents are often bad at improving code they've written themselves, like you proofreading your own essay. A subagent's clean context doesn't carry the writer's thinking.
```

The Skill now says to start every subagent with a fresh context window. Matt added that in October 2026 because some Codex models fork the conversation instead. A fork starts with a copy of the writer's context window, which defeats the point.

**Code smells.** A code smell is a surface sign that usually points to a deeper problem. A hint, not proof: Fowler says some long methods are fine. So the Skill labels each smell as a rule of thumb, with the word "possible" in front, as in possible Duplicated Code.

```checkpoint quick-10
A finding says "possible Duplicated Code". What does the word "possible" tell you?
- [x] It's a hint to look closer, not proof.
- [ ] It's proven, but it can safely wait.
- [ ] It's a rule your repo has written down.
Why: A smell is a surface sign that usually points to a deeper problem, but not always. So the Skill labels it as a rule of thumb.
```

Each smell also names its fix: Duplicated Code says to extract the shared shape. [tdd](/learn/tdd) left refactoring out of its loop; this is where it comes back.

**Findings you can check.** A Standards finding cites the file and the rule, or names the smell and quotes the changed lines. A Spec finding quotes the line of the Spec: something missing, something nobody asked for, or something built wrongly.

For example, a report on Ticket #13 might read:

```text
## Standards
CONTRIBUTING.md, "Every endpoint returns a response model":
  POST /bookings returns a plain dict.
possible Duplicated Code: "if booked >= capacity" appears twice.

## Spec
"A full class takes no more bookings": missing.

Standards: 2 findings, worst: the plain dict. Spec: 1 finding, worst: the missing rule.
```

### A real example

In a July 2026 video, Matt runs his whole flow to strip internal tooling from his CLI. As implement finishes, it loads code-review by itself. The repo has no written coding standards, so the review has only "some classic ones kind of from Martin Fowler". Both subagents come back, with the work checked against the Spec and the standards. Only then does implement commit.

Notice the order: review first, commit after. implement says it that way, and that order can cause the empty diff below.

Notice where it ran: inside the session that wrote the code. Matt prefers a fresh session, because the session that wrote the code carries every assumption behind it. The subagents start fresh, but that session still writes their briefs and can clean up their reports. For an independent review, run it yourself from a clean session.

```checkpoint quick-11
implement has run its own review step. You want an independent review. What do you do?
- [x] Run the review yourself from a clean session.
- [ ] Nothing, because the subagents already start fresh.
- [ ] Ask the same session to run its review again.
Why: The subagents start fresh, but the session that wrote the code still writes their briefs and can clean up their reports. A clean session keeps its assumptions out.
```

### Where it goes wrong

**`/code-review` may not run the reviewer you meant.** This is the Skill's most reported problem. Claude Code ships its own `/code-review`, which hunts bugs in the diff. Install Matt's Skills, and one of the two wins that name. Matt won't rename his to dodge a harness's built-ins.

With his **plugin**, a bundle of Skills you can install together, type the full name: `/mattpocock-skills:code-review`. With a plain install, your copy takes `/code-review`, and the built-in stays reachable through its alias, `/review`. To give `/code-review` back to the built-in, rename the folder and the `name:` field in your copy. But `npx skills update` undoes that rename.

```checkpoint quick-12
You installed Matt's plugin, and you want his review, not Claude Code's. What do you type?
- [x] `/mattpocock-skills:code-review`, the full name.
- [ ] `/code-review`, the short name of the Skill.
- [ ] `npx skills update`, which renames the Skill.
Why: With the plugin, the full name always reaches Matt's Skill. The short name is the one the two reviewers compete for.
```

**The review stops at an empty diff, or misses your last change.** The diff sees only commits. It leaves out **staged** changes, the ones marked with `git add` for the next commit. It also leaves out working-tree changes, the edits you haven't staged. implement asks for the review before it commits, so the diff can be empty. Then the review stops, and neither subagent runs.

```checkpoint quick-13
You've edited a file but not committed it. You're about to run a review. What happens to that edit?
- [x] The review misses it, because the diff sees only commits.
- [ ] The review includes it, along with your staged changes.
- [ ] The review commits it for you, and then reads the diff.
Why: The diff sees only commits, so staged and working-tree changes stay out. Commit first, then review.
```

The fix is to change the order: "Commit first, then review, then amend or add a fixup." That means changing your last commit, or adding a small one that corrects it.

```diagram
type: chain
caption: "Commit first, then review, then amend or add a fixup."
steps:
  - "Commit first"
  - "then review"
  - "then amend or add a fixup."
```

**It finds new problems on every run.** Each fix adds new code to review, and smells are judgement calls, so the results change from run to run. Don't run it in a loop "until it comes back clean, because it never will." Act on the findings with a cited rule behind them, then stop. Anthropic warns that any reviewer asked to find problems will always find something.

```checkpoint quick-14
You fixed the findings, and a second run reports new ones. What do you do?
- [x] Act on the ones with a cited rule, then stop.
- [ ] Keep running it until it comes back clean.
- [ ] Fix them all, since every smell is a fault.
Why: Each fix adds new code, and smells are judgement calls, so a clean run never arrives. Act on the findings with a cited rule behind them, then stop.
```

**A finding turns out to be wrong.** A subagent's report is "a hypothesis, not evidence." The Skill doesn't re-check each finding against the files, so one can cite the wrong place or overstate the impact. Read its citation before you act on it.

**The agent count keeps climbing.** The two subagents can start their own reviews, so each one spawns two more. One report reached more than 50 agents. In October 2026 Matt ruled guards against this out of scope: "The harness should be responsible for stopping infinite subagent loops, not skills." The harness, the agent tool you run, decides what a subagent can reach, so a limit set there holds for every Skill. Claude Code caps nesting at three layers by default. The Skill has no guard, so if you run a review unattended, watch the agent count.

```checkpoint quick-15
You're about to leave a review running unattended. What should you keep an eye on?
- [x] The agent count, because the Skill has no guard.
- [ ] Nothing, because the Skill caps its subagents.
- [ ] Nothing, because Matt added a guard to the briefs.
Why: Subagents can start their own reviews, and each one spawns two more. Matt leaves the limit to the harness, so the Skill itself has no guard.
```

### Try it

Run one real review, and see what it can't see. You'll need your practice project, with a branch of unmerged work for one Ticket. To get one, repeat [implement](/learn/implement)'s Try it on another open Ticket and a new branch, up to its commit.

1. Check out that branch.
2. Add a `CONTRIBUTING.md` at the repo's root with one rule: `Every endpoint returns a response model, never a plain dict.`
3. Commit everything, with `Closes #` and the Ticket's number in the commit message.
4. Open a fresh session.
5. Type `/code-review main`. If you installed the plugin, type `/mattpocock-skills:code-review main` instead.
6. Read the report. You should see a `## Standards` part and a `## Spec` part.
7. Check the findings. Each Standards finding should name your rule or one smell. Each Spec finding should quote a line of the Ticket.
8. Add a new file, `api/ping.py`, with an endpoint that returns a plain dict. Don't commit it.
9. Run the same command again. You should see no finding about that file, because the review reads only commits.
10. Fix only the findings with a cited rule behind them.
11. Delete that file, commit your fixes, and stop.

### Read more

- [The /code-review Skill](https://www.aihero.dev/skills-code-review), Matt Pocock, updated 2026-08-24
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (video)
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer with Matt Pocock, 2026-09-17 (video)
- [Renaming skills to dodge harness built-in commands](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/harness-name-collisions.md), Matt Pocock, 2026-10-06
- [Guards against sub-agents recursing into skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/subagent-recursion.md), Matt Pocock, 2026-10-06
- [[Bug] `implement` and `code-review` disagree on reviewing uncommitted changes (#511)](https://github.com/mattpocock/skills/issues/511), pellorao, 2026-07-10
- [/code-review name clash with Claude Code built-in (#483)](https://github.com/mattpocock/skills/issues/483), N0tS0Lucky, 2026-07-09
- [code-review sub-agents recursively invoke /code-review and fan out (#573)](https://github.com/mattpocock/skills/issues/573), dmmulroy, 2026-07-14
- [Code Smell](https://martinfowler.com/bliki/CodeSmell.html), Martin Fowler, 2006-02-09
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic, read 2026-10-30

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint code-review-deeper-fresh-session
implement built your booking endpoint and ran its own review step at the end, and committed. You still open a clean session and run code-review against main yourself instead of relying on that built-in step. What's the reason behind this step?
- [x] The session that wrote the diff still briefs the reviewers and can clean up their reports.
- [ ] A clean session loads a stricter smell baseline than the review step inside implement does.
  > The smell baseline is one fixed set of Fowler smells. What changes is which session writes the reviewers' briefs.
- [ ] implement's step only checks the Spec axis, since the Standards axis needs a session of its own.
  > Whichever session starts it, the axes run the same way. The problem is where the review was started from.
- [ ] Only a clean session lets the review read every file in the repo instead of just the diff.
  > Every run reviews the diff between the fixed point and HEAD. A clean session doesn't widen that.
Why: The two subagents start with a fresh context window, but the session that starts the review still writes their briefs and presents their reports, verbatim or lightly cleaned. If that session wrote the code, its assumptions can shape both. Starting the review from a clean session keeps them out.
```

```checkpoint code-review-deeper-no-clean-pass
Every time you fix the findings on your FastAPI branch and run the review again, it reports new smells. You decide to fix only the findings that cite a rule from your CONTRIBUTING.md or the Ticket, then stop. What's the reason behind this step?
- [x] Each fix adds new code, and smells are judgement calls, so it never comes back clean.
- [ ] The review refuses a fourth run on one branch, so later runs would be wasted anyway.
  > Nothing caps the runs. The point is that the review never settles on a clean result, however often you run it.
- [ ] A smell that shows up twice turns into a hard violation that blocks the merge.
  > A baseline smell is always a judgement call, never a hard violation, however often it appears.
- [ ] The Spec axis switches off once every line of the Ticket has been quoted once.
  > Earlier runs don't switch off an axis. The new findings come from the Standards axis's judgement calls.
Why: Each fix adds new code to review, and smells are judgement calls that change from run to run. So a clean run never arrives, and chasing one would go on forever. That's why you act on the findings with a cited rule behind them, then stop.
```

## Remember

```flashcards
Q: What are code-review's two axes?
A: Standards: does the code follow the repo's documented standards? Spec: does it do what the Issue or Spec asked?

Q: Which command does code-review use to see your branch's changes since main?
A: `git diff main...HEAD`, three dots, so it compares against the merge-base.

Q: What does code-review create?
A: A report with a Standards part and a Spec part, ending with the number of findings and the worst issue within each axis.

Q: In code-review, is a baseline smell like Duplicated Code a hard violation?
A: No. Each smell is always a judgement call, and a documented repo standard overrides it.

Q: Does code-review see changes you haven't committed yet?
A: No. It diffs from the merge-base to HEAD, which leaves out staged and working-tree changes. Commit first, then review, then amend or add a fixup.

Q: Claude Code ships its own `/code-review`. How do you reach Matt's one from his plugin?
A: By its full name, `/mattpocock-skills:code-review`. Matt doesn't rename Skills to dodge a harness's built-ins.

Q: Per Matt, what should stop code-review's subagents from starting more reviews without end?
A: The harness, not the Skill. In October 2026 he ruled guards like that out of scope for Skills, so watch the agent count.
```

## Final test

```final-test code-review-two-axes
What are the two axes code-review judges a change on?
- [x] Standards (the repo's coding standards) and Spec (what the Issue asked).
- [ ] Tests (whether they all pass) and Speed (how fast the new code runs).
- [ ] Coverage (how much is tested) and Docs (whether the docs are up to date).
- [ ] Security (known risks in the code) and Style (the linter's formatting rules).
Why: Code can follow every standard and still build the wrong thing, or build the right thing and break the repo's conventions. So the review asks two separate questions. Does the code follow the repo's documented standards, and does it do what the Issue or Spec asked?
```

```final-test code-review-three-dots
To review your branch against main, code-review reads `git diff main...HEAD`. What do the three dots do?
- [x] They compare against the merge-base, where your branch left main.
- [ ] They limit the diff to the last three commits on your branch.
- [ ] They add the changes you haven't committed yet to the diff.
- [ ] They compare against main's newest commit, including its later work.
Why: The three dots make the comparison start at the merge-base, the commit where your branch left main. So you see only your branch's work, and nothing that landed on main after you branched.
```

```final-test code-review-repo-wins
Your repo's CONTRIBUTING.md allows something the smell baseline would flag. What does the review do?
- [x] It drops the smell, because a documented repo standard always wins.
- [ ] It flags the smell as a hard violation, since the baseline is fixed.
- [ ] It reports both, and asks you which one the repo should follow.
Why: A documented repo standard always wins over the baseline. If your repo allows something the baseline would flag, that choice is deliberate, so the review drops the smell instead of complaining about it.
```

```final-test code-review-deeper-uncommitted
implement finishes your booking endpoint and runs the review before it commits anything. Why can that review find nothing to check?
- [x] It diffs from the merge-base to HEAD, which leaves out staged and working-tree changes.
- [ ] It only reviews files that the Ticket names, and this Ticket names no files at all.
- [ ] It skips every file the repo's linter already checks, which covers the new endpoint.
- [ ] It waits for CI to pass on the branch, and CI hasn't run on this branch yet.
Why: The review reads `git diff <fixed-point>...HEAD`, which sees only commits. implement asks for the review before it commits, so all the new work can still be uncommitted and the diff empty. That's why the fix is to commit first, then review.
```

```final-test code-review-deeper-fan-out-owner
code-review's subagents can start their own reviews, which start more. What did Matt decide about this?
- [x] The harness should stop runaway subagents, so the Skill itself gets no guard.
- [ ] Each subagent brief gets a line that forbids it from calling the Skill again.
- [ ] Both axes now run inside one agent, so there is no subagent left to fan out.
- [ ] The SKILL.md caps the review at two levels of subagents, then stops them.
Why: The harness decides what a subagent can reach, so a limit set there holds for every Skill. A guard written into one Skill covers only that Skill. So Matt left the Skill without a guard, which is why you should watch the agent count when a review runs unattended.
```

```final-test code-review-branch-done
Your Ticket branch that adds a health check to your Docker setup is built, test-first, and the tests pass. It hasn't gone into main yet. What comes next?
- [x] Check the changes since main against the Ticket and the standards.
  > Right: that's `/code-review`.
- [ ] Write the pull request's description now, so it can go into main.
  > That's `/pr`. The check comes first, so the pull request presents the change after its fixes.
- [ ] Write more tests for the health check's edge cases first.
  > That's `/tdd`. The Ticket is built and its tests pass. What's missing is a look at the finished change.
Why: The Ticket is built and its tests pass, so what's missing is a check of the finished change. That check comes before the pull request, so the pull request can present the change after its fixes. implement also reviews once the work is done, and the diff since main shows exactly what the branch changed.
```

```final-test code-review-no-fixed-point
Your FastAPI branch is still work in progress, with no pull request yet. You want its changes checked against the Ticket and the repo's standards, though you haven't decided what to compare the branch with. Which fits best?
- [x] Review the branch's diff on both axes; it asks what to compare to.
  > Right: that's `/code-review`.
- [ ] Write the pull request body first, so there's something to review.
  > That's `/pr`. The body describes a change for whoever merges it. A review needs no pull request: it asks you for a fixed point, such as main.
- [ ] Look back over the session for changes to the agent's environment.
  > That's `/retro`. That suggests changes to the environment, not a check of this code against the Ticket and the standards.
- [ ] Build the rest of the branch test-first, one slice at a time.
  > That's `/tdd`. That adds code. It doesn't check the changes so far against the Ticket or the standards.
Why: You want changes checked against a Ticket and the standards, and that works on a branch or work in progress, with no pull request needed. You don't have to pick the comparison point first: if you name no fixed point, the review asks for one before it reads the diff.
```

```final-test code-review-findings-on-integration
Every Ticket of your booking site's Spec is merged into the integration branch, and a draft pull request is open. The review of that branch against main has come back with findings on both axes. What comes next?
- [x] Fix all findings in one subagent, then mark the draft ready.
  > Right: that's `/implement-spec`.
- [ ] Write the pull request body now, and fix the findings after.
  > That's `/pr`. The findings get fixed first, so the pull request describes the fixed change.
- [ ] Turn each finding into a new Ticket, with its blocking links.
  > That's `/to-tickets`. implement-spec fixes everything the review raised in a single fresh implementer subagent, with no new Tickets.
Why: The review's findings get fixed together, by one fresh implementer subagent, with no new Tickets. Only then is the draft pull request marked ready for review, so whoever reads it sees the fixed change.
```

```final-test code-review-pick-migration
Your branch with a SQL migration that adds a cancellations table is done. You want to know two things: whether it follows the repo's CONTRIBUTING.md, and whether it does what Ticket #31 asked. Which fits best?
- [x] Check the diff against the repo's standards and against the Ticket.
  > Right: that's `/code-review`.
- [ ] Write the pull request's description, linking it to the Ticket.
  > That's `/pr`. That describes the change for others. It doesn't check it against anything.
- [ ] Rebuild the migration test-first, following CONTRIBUTING.md.
  > That's `/tdd`. The migration is already built. The question is whether it's right.
Why: Your two questions are the review's two axes. Following CONTRIBUTING.md is the Standards axis, and that file is always on its list when it exists. Doing what Ticket #31 asked is the Spec axis. Neither of the other options checks the migration against anything.
```

```final-test code-review-two-reports
Reviewing your AI agent's branch, the agent checks the coding standards and the Spec in two separate subagents. It reports them under two headings and never ranks a finding from one against a finding from the other. What's the reason behind this step?
- [x] So a pass on one axis can't hide a fail on the other.
- [ ] Two subagents working in parallel finish sooner than one.
  > They do run in parallel, but the reason given is that they don't pollute each other's context and one axis can't mask the other.
- [ ] So the Standards findings, which matter more, can go first.
  > Neither axis outranks the other. The report never reranks findings or picks one winner.
- [ ] So each subagent only has to read half of the changed files.
  > Both read the whole diff. They differ in what they judge it against.
Why: Code that follows every standard can still build the wrong thing, and code that does what the Issue asked can still break the repo's conventions. In one blended verdict, the axis that passes would hide the one that fails. Keeping the reports apart keeps both failures visible.
```

```sources
- [code-review: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/code-review/SKILL.md), Matt Pocock's Skills
- [improve-codebase-architecture: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/improve-codebase-architecture/SKILL.md), Matt Pocock's Skills
- [The /code-review Skill](https://www.aihero.dev/skills-code-review), Matt Pocock, 2026-08-24 (page says Updated Aug 24, 2026)
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [pr: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/SKILL.md), Matt Pocock's Skills
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer (Gergely Orosz) with Matt Pocock, 2026-09-17
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [Start subagents with a fresh context window, not a fork #1341](https://github.com/mattpocock/skills/pull/1341), mattpocock, 2026-10-29
- [Code Smell](https://martinfowler.com/bliki/CodeSmell.html), Martin Fowler, 2006-02-09
- [Bug `implement` and `code-review` disagree on reviewing uncommitted changes #511](https://github.com/mattpocock/skills/issues/511), pellorao, 2026-07-10
- [/code-review name clash with Claude Code built-in #483](https://github.com/mattpocock/skills/issues/483), N0tS0Lucky, 2026-07-09
- [Renaming skills to dodge harness built-in commands (.out-of-scope/harness-name-collisions.md)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/harness-name-collisions.md), Matt Pocock, 2026-10-06
- [code-review sub-agents recursively invoke /code-review and fan out #573](https://github.com/mattpocock/skills/issues/573), dmmulroy, 2026-07-14
- [Guards against sub-agents recursing into skills (.out-of-scope/subagent-recursion.md)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/subagent-recursion.md), Matt Pocock (mattpocock/skills, added in PR, 2026-10-06
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [tdd: reshape into reference-only with pre-agreed seams #393](https://github.com/mattpocock/skills/pull/393), Matt Pocock (mattpocock), 2026-06-30
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic (Claude Code Docs)
- [Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
```
