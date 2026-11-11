---
title: retro: look back and fix the environment
slug: retro
summary: How retro looks back over a coding session and suggests fixes to the agent's environment, not the code, so the next session goes better.
image: /images/lessons/retro.jpg
imageAlt: A car's side mirror reflecting the empty road and mountains left behind on a drive in Iceland.
---

## What it's for

Imagine your booking endpoint (the web address your app calls) is finished. The agent hunted a long time for one file, and you corrected, by hand, an import the project doesn't allow. The endpoint works, so nobody looks back. The next agent hits the same problems.

**retro looks back over a coding session and suggests changes to the agent's environment, not the code.** The [environment](/learn/fix-the-environment) is what surrounds the agent: navigation pointers, automated checks, coding standards, instruction files and tools.

```checkpoint quick-1
An agent's session was a struggle, but the endpoint works. What will retro suggest changing?
- [x] The agent's environment, such as its checks and coding standards.
- [ ] The endpoint's code, so that part can't go wrong a second time.
- [ ] The task's wording, so the next agent gets clearer instructions.
Why: retro suggests changes to the agent's environment, not the code: navigation pointers, automated checks, coding standards, instruction files and tools.
```

You type `/retro`, the command that starts this [Skill](/learn/skills). The agent reads the session's record (a saved log of it), finds where it struggled, and lists fixes. For example:

```text
1. Automated checks: a lint rule (an automatic code check) in CI would catch that disallowed import.
2. Navigation: a pointer in CLAUDE.md would save the long hunt for that file.
```

Here CI is the [automated checks that run on every pull request](/learn/what-ci-cd-is), and `CLAUDE.md` is the [instruction file](/learn/instruction-files) every session reads.

You pick the fixes you want, and the next build starts from a better environment.

## When to use it

retro is the last step of the [main flow](/learn/main-flow), and it closes the loop after a build. Use it when:

- You've finished a build that went sideways: the agent hunted for files or repeated a mistake.
- You've fixed a hard bug, and you want to ask what would have prevented it.

Run it in the session it's looking back on, before you type `/clear`, the command that empties the session. The struggles are still in its [context window](/learn/context-window), everything the agent can see at once, until then.

```checkpoint quick-2
You've merged Ticket #13, and the session went badly. When do you run retro?
- [x] Now, in this session, while the struggles are still in context.
- [ ] Tomorrow, in a fresh session, once the context window is empty.
- [ ] After the next Ticket, once two sessions have gone the same way.
Why: Run it in the session it's looking back on. Before you clear, the struggles are still in the context window.
```

## When not to use it

- If you want to know whether the code is right, use [code-review](/learn/code-review) instead, because it reviews the [diff](/learn/commits-and-diffs), the lines the change adds and removes, not how the work went.
- If you're passing unfinished work to a fresh session, use [handoff](/learn/handoff) instead, because it writes the summary for the next agent.

```checkpoint quick-3
You want a verdict on whether the endpoint's code is right. Which Skill fits?
- [x] code-review, since it reviews the diff.
- [ ] retro, since it looks at the session.
- [ ] handoff, since it writes a summary of the work.
Why: code-review reviews the diff, so it can judge the code. handoff is for passing unfinished work to the next agent.
```

## What it needs to start

Only you can start it, by typing `/retro`. The agent won't start it on its own.

```checkpoint quick-4
An agent finishes a rough build, and you say nothing. Will retro run?
- [x] No. Only you can start it, by typing /retro.
- [ ] Yes. The agent starts it after any rough build.
- [ ] Yes, if CI failed at some point during the build.
Why: Only you can start it, by typing /retro. The agent won't start it on its own.
```

retro needs a session to look back on: the current one by default. After clearing, point it at that session's log, the record kept on your machine, by naming the session after `/retro`.

Your repo needs no checks first. A repo with no guardrail (no pre-commit hook (a script that runs inside `git commit`) and no [CI](/learn/what-ci-cd-is) job running lint, typecheck and tests) is itself a finding.

```checkpoint quick-5
Your repo has no pre-commit hook and no CI job running its checks. You type /retro. What happens?
- [x] It runs, and reports the missing guardrail as a finding.
- [ ] It stops, and asks you to add a guardrail before it runs.
- [ ] It runs, but skips the checks since there are none to read.
Why: A repo with no guardrail is itself a finding, so your repo needs no checks before you start.
```

## What it creates

Nothing on disk. You get a list of **candidates**: suggested improvements, in order of severity. retro changes nothing until you pick.

```checkpoint quick-6
retro has shown you its list. What has changed in your repo so far?
- [x] Nothing. It only suggests fixes until you pick one.
- [ ] The most severe fix is committed on a new branch.
- [ ] Each candidate has become a new Issue on the tracker.
Why: You get a list of candidates in order of severity, and nothing on disk. retro changes nothing until you pick.
```

What went wrong decides the fix. If the agent hunted for a file, the fix is a navigation pointer. A mechanical mistake, a fixed pattern a program could spot, becomes a deterministic check, like a lint rule or a CI job. A judgement call becomes a coding standard, for the reviewer to enforce. The reviewer is [code-review](/learn/code-review)'s review agent.

```checkpoint quick-7
The reviewer missed a judgement call: the code doesn't match the surrounding style. What fix will retro suggest?
- [x] A coding standard, for the reviewer to enforce.
- [ ] A deterministic check, like a lint rule or a CI job.
- [ ] A navigation pointer to a file that shows the style.
Why: A mechanical mistake gets a deterministic check, and a hunt for a file gets a navigation pointer. A judgement call becomes a coding standard, for the reviewer to enforce.
```

```diagram
type: compare
caption: "What went wrong decides the fix."
columns: ["What went wrong", "the fix"]
rows:
  - cells: ["the agent hunted for a file", "a navigation pointer"]
  - cells: ["A mechanical mistake", "a deterministic check, like a lint rule or a CI job"]
  - cells: ["A judgement call", "a coding standard, for the reviewer to enforce"]
```

## Going deeper

### Why it exists

An agent rarely tells you where it struggled. It hunts for a file or repeats a mistake, then carries on. Matt Pocock, who wrote the Skill, puts the problem this way: "It pushes on, and the feature gets built anyway." So the finished code hides the cost.

```checkpoint quick-8
Your agent's feature works, and it reported no trouble. Why might a look back still be worth it?
- [x] The agent carries on after a struggle, so the finished code hides it.
- [ ] The agent lists each struggle, but only in its final commit message.
- [ ] A working feature usually means the agent skipped all of the hard parts.
Why: An agent rarely tells you where it struggled. It carries on and the feature gets built, so the finished code hides the cost.
```

Fixing what caused those struggles fell to you: keeping `AGENTS.md` lean, the Skills sharp, the lint rules good and the code easy to navigate. Matt did it by hand, then bundled it into retro.

So retro reads the real session, not the finished feature. Human review has the same aim: you're reviewing the system that creates the code, so "you never want to write the same comment twice".

So the loop is: find a mistake, run `/retro`, and make the mistake impossible next time.

```diagram
type: cycle
caption: "So the loop is"
steps: ["find a mistake", "run `/retro`", "make the mistake impossible next time"]
```

### How it works underneath

**The name comes from team practice.** retro is short for retrospective: a team's look back at how its work went. Martin Fowler credits Norm Kerth with launching the practice. Kerth's Prime Directive asks a team to believe "that everyone did the best job they could", given what they knew, their skills, resources and situation. Think of retro as that idea turned on a session: it asks what in the repo let the mistakes happen.

```checkpoint quick-9
An agent made three mistakes in a session. Which question does retro ask about them?
- [x] What in the repo let them happen?
- [ ] Which agent should now be replaced?
- [ ] Who wrote the code that they touched?
Why: Retrospectives start from the belief that everyone did the best job they could. Think of retro as that idea turned on a session: it asks what in the repo let the mistakes happen.
```

**How a run starts.** retro's Skill file sets `disable-model-invocation: true`, a Skill setting that stops the agent starting it by itself. Once you start it, it loads [writing-for-agents](/learn/writing-for-agents), the Skill with rules for writing documents agents read.

retro looks for candidates in set categories, such as navigation, automated checks and coding standards. Before it proposes a new check, it reads the repo's own check commands, because a check that exists but isn't wired up is the finding. Another category is **tool economy**: whether the agent's tool use wastes tokens, the units a model reads and writes.

```checkpoint quick-10
Your repo has a lint script, but CI never runs it. What will retro report?
- [x] The unwired check, as the finding.
- [ ] A brand-new lint rule to replace it.
- [ ] Nothing, since a lint script exists.
Why: Before it proposes a check, retro reads the repo's own check commands. A check that exists but isn't wired up is the finding, so there's no need to build another.
```

**Rules go where there's room for them.** Think of **context pressure** as how hard a job crowds an agent's [context window](/learn/context-window). retro's Skill file names two agents: an implementation agent that builds, and a review agent that checks. The implementation agent has the most: it explores, writes code and debugs. The review agent has the least, because it receives a diff and needs no exploring. So coding standards go to the reviewer, which has room to apply them.

A `CLAUDE.md` line "loads into every session, gives less weight to everything else in the file, and goes out of date as the code changes." So that file is for navigation pointers and little else.

```checkpoint quick-11
The agent keeps making one mistake. Why not add a line to CLAUDE.md?
- [x] It loads into every session and goes out of date.
- [ ] It's only read by the reviewer, never by the agent.
- [ ] It's ignored unless a Ticket tells the agent to read it.
Why: A line in CLAUDE.md loads into every session, gives less weight to everything else in the file, and goes out of date. So that file is for navigation pointers and little else.
```

**A check beats a written rule when a program can spot the mistake.** Say the agent keeps building SQL from glued strings. A line in `CODING_STANDARDS.md` asks the reviewer to make that same call on every future diff. A lint rule costs you once, then catches it every time. So retro's default is to build the check. Matt's reason: "A check can fail. A sentence in a Markdown file cannot."

```checkpoint quick-12
The agent keeps building SQL from glued strings. Why choose a lint rule over a line in `CODING_STANDARDS.md`?
- [x] It costs you once, and the reviewer needn't re-check each diff.
- [ ] `CODING_STANDARDS.md` is only read by the agent writing the code.
- [ ] A lint rule runs faster than a reviewer can read a single line.
Why: A line in the standards file asks the reviewer to make the same call on every future diff. A lint rule costs you once, then catches it every time.
```

### A real example

In September 2026, a user ran implement-spec end to end on one [Spec](/learn/issues-and-keeping-track), then filed issue #1010 in Matt's repo, drafted by an AI agent.

After the build, the same session ran a `/retro` Skill over its own transcript, its full record. A [subagent](/learn/how-agents-work), a helper agent that does one job in its own fresh context window and reports back, pulled every tool call out of the log, so the counts aren't from memory. A tool call is one request to run a tool.

A merged [Ticket](/learn/issues-and-keeping-track)'s check failed for a cause outside that Ticket. The orchestrator, the main agent running the build, investigated it itself: "60 tool calls, and most of the run's peak context." Peak context is the fullest its context window got.

A later review subagent attached a proposed sentence to each finding. For this failure, it proposed a **diagnosing subagent**, which returns a cause.

So the proposed fix was a sentence for a Skill, not a code change: the kind of environment change retro looks for.

```checkpoint quick-13
A run wasted its context, though its code was fine. Which fix is the kind retro looks for?
- [x] A sentence for a Skill, which is an environment change.
- [ ] A code change to the merged Ticket whose check had failed.
- [ ] A second run of that same Skill, on a brand-new branch.
Why: The proposed fix was a sentence for a Skill, not a code change. A sharper Skill is the kind of environment change retro looks for.
```

### Where it goes wrong

**The suggestions sound generic.** Matt calls this the strongest criticism of retro. One user found that once the job is finished, the agent tends to forget the struggles from the middle of the session. They say it "invents generic advice to satisfy the retro categories." Matt adds: it can overweight one session. Discard any candidate you can't trace to a specific moment. Treat the severity order as a first draft too, because a quiet, expensive mistake can rank below a loud, cheap one.

```checkpoint quick-14
retro ranks a small lint slip above a slow, costly search. How should you treat that order?
- [x] As a first draft, since quiet mistakes can rank too low.
- [ ] As final, since severity is worked out from the session.
- [ ] As random, since the order only follows the categories.
Why: Treat the severity order as a first draft, because a quiet, expensive mistake can rank below a loud, cheap one. And discard any candidate you can't trace to a specific moment.
```

**Most of the list can be noise.** Issue #1173 argues that triggers like a long search or a mistake are friction every real session has, so every run produces a list. The reporter's team asked the agent to prove its candidates after 15 of 17 runs. They suggest testing each candidate before you see it, with the narrowest check that could show it isn't needed, such as a `git log`, a count in the session or a docs read. Only the candidates that hold up, the survivors, reach you. They add: "Zero survivors is a complete retro." The Skill doesn't do this yet, so they pass that instruction to `/retro`.

```checkpoint quick-15
You follow that suggestion: one narrow check per candidate, and none survives. Where does that leave the retro?
- [x] It's complete, because an empty result counts.
- [ ] It failed, so you should run it all over again.
- [ ] It's unfinished until you keep at least one candidate.
Why: Issue #1173 argues that friction in every real session means every run produces a list. One check per candidate shows which hold up, and the issue counts an empty result as complete.
```

**Your repo drifts after you automate retro.** You wired it to run by itself, so nobody weighs its findings. "An automated retro finds false positives, keeps fixing them, and takes your repo somewhere it should not go." A false positive is a problem that looks real but isn't. Run it on a sample of sessions instead, or one where the agent did something odd.

```checkpoint quick-16
You're about to add a hook that runs retro after every session and applies its top fix. What goes wrong?
- [x] It finds false positives and keeps fixing them.
- [ ] It can't read a session that's already finished.
- [ ] It can only suggest fixes that you've picked before.
Why: An automated retro finds false positives, problems that look real but aren't, and keeps fixing them. Run it on a sample of sessions instead.
```

**A lint rule keeps firing on good code.** Pruning means removing old checks. retro sees one session, so it can't tell that a rule now fires too often, or that the bug behind it is gone. You must still prune checks yourself. A rule that fires constantly on good code is the sign to remove it.

```checkpoint quick-17
A lint rule from an old retro now fires constantly on good code. Who removes it?
- [x] You do, since retro sees only one session.
- [ ] retro does, the next time it reads a session.
- [ ] CI does, once the rule has failed enough times.
Why: retro sees one session, so it can't tell that a rule now fires too often. A rule that fires constantly on good code is your sign to remove it.
```

### Try it

You'll need your practice project (the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) sets it up), with a CI check on its pull requests (the Try it in [What CI/CD is](/learn/what-ci-cd-is) adds one). You'll need a session where an agent changed the booking endpoint in `api/`: [implement](/learn/implement)'s Try it builds the endpoint in one.

1. In that session, type `/retro`. If you've cleared it, type `/retro the session that changed the booking endpoint` in a fresh one.

   You should see a list of candidates, most severe first.

2. For each candidate, find the moment in the session it came from. Cross out any you can't trace.
3. For each one left, pick the narrowest check that could show it isn't needed. Try a `git log`, a count in the session, or a docs read.
4. Run each check, and cross out any candidate it knocks down. If nothing mechanical is left, you're done.
5. Run `git switch main && git pull`. Then ask the agent to make a new branch, add the automated check that a surviving mechanical candidate proposes (such as a lint rule) to `.github/workflows/ci.yml`, and commit it.
6. Push the branch and open a pull request:

   ```sh
   git push -u origin HEAD
   gh pr create --fill
   ```

   You should see CI run the new check on your existing code.

7. Merge or close the pull request, then `git switch main && git pull`.

A proposed check is code, so try it against the repo before you let it block merges.

### Read more

- [The /retro Skill](https://www.aihero.dev/skills-retro), Matt Pocock, updated 2026-10-05
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, updated 2026-10-05
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock, AI Engineer Paris 2026 talk, 2026-09-25
- [retro: push mechanical coding-standards findings toward deterministic checks](https://github.com/mattpocock/skills/pull/1083), Matt Pocock, 2026-09-15
- [retro: candidates reach the user unchecked, so most of each run is noise](https://github.com/mattpocock/skills/issues/1173), mecampbellsoup, 2026-10-05
- [implement-spec: two text defects and four unnamed branches from a full run](https://github.com/mattpocock/skills/issues/1010), danielbaldwin47, 2026-09-02
- [Priming Prime Directive](https://martinfowler.com/bliki/PrimingPrimeDirective.html), Martin Fowler, 2012-10-23

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint retro-deeper-dont-automate
You like what the session look-back finds on your FastAPI backend, so you plan a hook that runs it after every agent session and applies its top finding without asking. Matt advises against this. Why?
- [x] An automated run finds false positives and keeps fixing them, so the repo drifts.
- [ ] It can only read the current session, so a hook would always see an empty log.
  > It can read older sessions too. You can run it on the current session or older ones.
- [ ] Its findings need the reviewer agent first, so a hook would skip the code review step.
  > Matt's objection isn't about the order of steps. He says an automated retro finds false positives and keeps fixing them.
- [ ] Hooks can't call a user-invoked Skill, so the run would fail before it starts.
  > Matt's objection isn't about whether it can run unattended; some users do run it after every implementation run. He says an automated retro finds false positives and keeps fixing them.
Why: Deciding what deserves a permanent check takes judgement, so retro changes nothing until you pick from its list. Left to itself, it finds false positives, problems that look real but aren't, keeps fixing them, and takes your repo somewhere it should not go. Run it on a sample of sessions instead, or on one where the agent did something odd.
```

```checkpoint retro-deeper-inline-diagnosis
An agent-run build of a whole Spec for your booking site just finished. Reading the session, you see the orchestrator spent 60 tool calls diagnosing a failing check itself and found the cause, using most of the run's peak context. The code is fine. You want the next run's instructions to send such failures to a subagent. Which fits best?
- [x] Look back over the session and propose changes to the agent's environment.
  > Right: that's `/retro`.
- [ ] Run the two-axis review of the branch against the Standards and the Spec.
  > That's `/code-review`. The code is fine. The problem was how the orchestrator spent its context, which a review of the diff can't see.
- [ ] Build a feedback loop and hunt down the cause of the failing check.
  > That's `/diagnosing-bugs`. The check's cause is already found. What you want is a better instruction for the next run.
- [ ] Run the whole Spec again on a new branch, with implementer subagents on each frontier Ticket.
  > That's `/implement-spec`. A rerun follows the same instructions and would diagnose inline again. The instructions need changing first.
Why: The code is fine, so the fix belongs in the instructions the next run reads. This mirrors a real report, issue #1010. After an implement-spec run, the same session ran a retro over its own transcript, and the extract showed the cost of those 60 tool calls. A later review pass proposed a sentence sending such failures to a diagnosing subagent: a change to the environment, not the code.
```

## Remember

```flashcards
Q: What does retro create?
A: A list of suggested improvements to the agent's environment, presented in order of severity. It changes nothing until you choose.

Q: Where does retro sit in the main flow?
A: At the end. It closes the loop after a build, especially one that went sideways, so the next build starts from a better environment.

Q: In retro, what does a judgement call (not a mechanical mistake) become?
A: A coding standard, for the reviewer to enforce.

Q: In retro, what is a guardrail, and what if a repo has none?
A: A pre-commit hook or CI job that runs the lint, typecheck and test command. A repo with none is itself a finding.

Q: What loop does Matt describe for retro?
A: Find a mistake, run retro, and make the mistake impossible next time.

Q: Does retro remove the lint rules and CI jobs it proposed last month?
A: No. It sees one session, so it can't tell a rule now fires too often. You prune checks yourself; a rule that fires constantly on good code should go.

Q: Who first launched the practice of retrospectives, by Martin Fowler's account, and what does the Prime Directive ask?
A: Norm Kerth. It asks everyone to believe that each person did the best job they could, given what they knew, their skills, the resources and the situation.
```

## Final test

```final-test retro-what-it-changes
You run retro after a rough build. What does it suggest changing?
- [x] The agent's environment: checks, pointers, standards and tooling.
- [ ] The code in the diff: names, structure, comments and error handling.
- [ ] The Spec, so the next build starts from clearer requirements.
Why: retro leaves the code alone. It asks what let the mistakes happen, and suggests changes to what surrounds the agent: navigation pointers, automated checks, coding standards and tools. So the next build starts from a better environment.
```

```final-test retro-mechanical-mistake
The agent keeps making the same mechanical mistake, a fixed pattern a program could spot. What does retro turn it into?
- [x] A deterministic check, like a lint rule or a CI job.
- [ ] A new line in CLAUDE.md telling the agent to avoid it.
- [ ] A rule in the coding standards for the reviewer to enforce.
Why: A program can spot a fixed pattern, so a check can catch it every time. A line in a Markdown file can't fail the way a check can. So retro defaults to building the check, and keeps coding standards for judgement calls.
```

```final-test retro-when-to-run
You've finished a rough build. When's the best time to run retro on it?
- [x] In the session it looks back on, before you clear it.
- [ ] At the start of a fresh session, before the next Ticket.
- [ ] Once a week, over all the sessions since the last one.
Why: Until you clear, the struggles are still in the context window, so that's the best time. If you've already cleared, you can still point retro at that session's log.
```

```final-test retro-deeper-untraceable-candidate
A retro candidate says "add more tests", but you can't find the moment in the session it came from. What do you do with it?
- [x] Discard it, since every candidate should trace to a specific moment.
- [ ] Keep it, since the severity order already ranks it below the others.
- [ ] Move it into CLAUDE.md, since general advice belongs in every session.
Why: One user found that once the job is finished, the agent can forget the struggles and invent generic advice to fill its categories. A candidate you can't trace to a specific moment may be exactly that, so discard it. The severity order is only a first draft too.
```

```final-test retro-deeper-why-the-reviewer
Why do coding standards go to the review agent rather than the implementation agent?
- [x] The reviewer has the least context pressure; it gets a diff, so no exploring.
- [ ] The reviewer runs after CI, so it can see which checks have already failed.
- [ ] The reviewer has more tools than the implementer, so it can run linters as it reads.
Why: The implementation agent's context window fills up as it explores, writes code and debugs. The review agent receives a diff and needs no exploring, so it has room to apply the coding standards.
```

```final-test retro-after-the-merge
A Ticket for your FastAPI backend went up as a pull request, CI went green and you merged it into main. Along the way the agent spent ages hunting for the file that sets up the database session. The session is still open and the next Ticket is waiting. What comes next?
- [x] Look back over this session for changes to the agent's environment.
  > Right: that's `/retro`.
- [ ] Clear the context and start the next Ticket with a fresh agent.
  > That's `/implement`. Run retro in the session it looks back on, before you clear. Skip it and the next agent hunts for the same file.
- [ ] Run the two-axis review over the merged diff, Standards and Spec.
  > That's `/code-review`. The code is already merged, and CI passed. The problem was finding files, which a review of the diff doesn't fix.
- [ ] Write a document summing up the session so a fresh agent can continue.
  > That's `/handoff`. The Ticket is done, so there's no work to continue. What needs fixing is the environment.
Why: The waste was in finding that file, not in the code, and nothing stops the next agent hunting for it too. retro closes the loop: it looks back over the session and suggests an environment change, like a navigation pointer to that file. Run it now, because the struggles are still in the context window.
```

```final-test retro-ci-kept-failing
On your Next.js website, the agent's pull request passed CI, yet three times you spotted that it imported a server-only database module into a client component. No check caught it; you pointed it out by hand each time. The fix is now merged. Before you clear the session, what comes next?
- [x] Look back over the session and suggest a check for this mistake.
  > Right: that's `/retro`.
- [ ] Rewrite the pull request body to warn reviewers about the import.
  > That's `/pr`. The pull request is already merged, and a body only describes one change. The next agent would make the same mistake.
- [ ] Write more tests for the component, one red-green slice at a time.
  > That's `/tdd`. The bug is already fixed. The repeated mistake is a fixed pattern a check could catch on every future change.
- [ ] Run the two-axis review of the merged diff to catch the import.
  > That's `/code-review`. The merged code is fine now. The review reports on one diff; it doesn't stop the next agent repeating the mistake.
Why: An import shape is a fixed pattern a program can spot, so it's a mechanical mistake, and those become deterministic checks. You caught it by hand three times, and nothing will stop the next agent until a check exists. retro suggests that check, in the session that went sideways, before you clear.
```

```final-test retro-session-went-sideways
Building a Docker setup for your AI agent project went badly. The agent burned tokens on huge log reads and kept missing which folder held the SQL migrations. The work is done and merged. You want ideas for making the next session go better, not changes to the code. Which fits best?
- [x] Look back over the session for changes to the agent's environment.
  > Right: that's `/retro`.
- [ ] Review the merged diff against the coding standards and the Spec.
  > That's `/code-review`. That checks whether the code is right. Your problem is how the session went, not the diff.
- [ ] Write a document summing up the session for the next fresh agent.
  > That's `/handoff`. That carries unfinished work forward. The work is done; you want the environment improved.
- [ ] Build a throwaway version of the Docker setup to try a better layout.
  > That's `/prototype`. A prototype is throwaway code that answers a design question. It doesn't look back at how the agent worked.
Why: The code is merged, and you want the next session to go better, so the fix belongs in the environment. retro could suggest a navigation pointer to the folder the agent kept missing. It could also flag tool economy: whether the agent's tool use wasted tokens, as those huge log reads did.
```

```final-test retro-check-not-a-note
Looking back at a session on your FastAPI backend, you find the agent kept building SQL by gluing strings together instead of using the query builder, a fixed pattern a linter can spot. Why make it a lint rule run in CI rather than a line in CLAUDE.md?
- [x] It's mechanical, so a check always catches it; CLAUDE.md stays sparse.
- [ ] Agents only open CLAUDE.md when a Ticket tells them to read it.
  > They don't need to open it. CLAUDE.md is pushed into every agent's context, which is exactly why it should be used sparingly, mostly for navigation pointers.
- [ ] Lint rules are for code style, so this belongs in the coding standards.
  > Coding standards are for judgement calls. A fixed pattern is mechanical and gets a deterministic check.
- [ ] A CI job runs faster than the agent can read a line in CLAUDE.md.
  > Speed isn't the reason. A check gives the same answer every time; a note relies on the agent remembering it.
Why: A linter can spot a fixed pattern, so a check catches it every time, while a line in a Markdown file can't fail. And CLAUDE.md goes into every agent's context window, so it's kept for navigation pointers. That makes a mechanical mistake a job for a deterministic check: a linter rule, a pre-commit hook or a CI job.
```

```final-test retro-no-guardrail
Looking back at a session on your website, you notice the repo has a lint and test command, but no pre-commit hook and no CI job runs them. Nothing broke this time. Why is that still worth raising?
- [x] Nothing stops the next mistake a check could catch, so it's a finding.
- [ ] It isn't worth it. Nothing broke, so the repo's setup is fine as it is.
  > An unchecked repo is a standing missed opportunity, not a neutral default.
- [ ] It belongs in the next pull request body, under Merge Danger.
  > Merge Danger covers the changes one pull request brings in. The missing guardrail affects every change.
Why: With no pre-commit hook and no CI job running them, the lint and test commands catch nothing unless someone remembers to run them. So a repo with no guardrail is itself a finding, even when nothing broke. It's a standing missed chance, and fixing it once helps every future build.
```

```sources
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [The /retro Skill](https://www.aihero.dev/skills-retro), Matt Pocock, 2026-10-05
- [code-review: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/code-review/SKILL.md), Matt Pocock's Skills
- [handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/SKILL.md), Matt Pocock's Skills
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05 (updated)
- [Fixing the PR Bottleneck — Matt Pocock, AIHero](https://ai.engineer/talks/LlgiOCmFG_w-fixing-pr-bottleneck), Matt Pocock (talk); page by AI Engineer
- [Priming Prime Directive](https://martinfowler.com/bliki/PrimingPrimeDirective.html), Martin Fowler, 2012-10-23
- [retro: push mechanical coding-standards findings toward deterministic checks (#1083)](https://github.com/mattpocock/skills/pull/1083), Matt Pocock (mattpocock), 2026-09-15
- [implement-spec: two text defects and four unnamed branches from a full run](https://github.com/mattpocock/skills/issues/1010), danielbaldwin47, 2026-09-02
- [retro: candidates reach the user unchecked, so most of each run is noise (#1173)](https://github.com/mattpocock/skills/issues/1173), mecampbellsoup, 2026-10-05
- [Fixing the PR Bottleneck — Matt Pocock, AIHero](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock (AI Engineer channel), 2026-09-25
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
- [pr: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
```
