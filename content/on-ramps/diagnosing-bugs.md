---
title: diagnosing-bugs: find a hard bug's cause
slug: diagnosing-bugs
summary: diagnosing-bugs makes the agent build one command that fails on your bug before any theory, then find the cause, fix it and lock it in with a test.
image: /images/lessons/diagnosing-bugs.jpg
imageAlt: A stethoscope resting on a computer keyboard beside a curling strip of ECG heart-trace paper.
---

## What it's for

Say a member can book a full class. Ask an agent to fix it, and by default it reads the code and guesses.

**diagnosing-bugs allows no theory until there's one command that goes red on this bug and green once it's fixed.** That's the **feedback loop** you met in [tdd](/learn/tdd): red means the check fails, green means it passes. With it, you will find the cause. Without it, staring at code won't.

```checkpoint quick-1
You report a bug to an agent running this Skill. What must exist before it may form a theory?
- [x] One command that goes red on this bug and green once it's fixed.
- [ ] A written list of the files most likely to hold the cause of this bug.
- [ ] A second agent's full review of the code around the reported bug.
Why: No theory comes before the feedback loop, one command that goes red on this bug and green once it's fixed. Without it, staring at code won't find the cause.
```

You type `/diagnosing-bugs` and describe the bug. The agent works through six phases:

1. Build the loop.
2. Reproduce and shrink. It cuts the **repro**, a reliable way to make a bug happen again, down to what's needed.
3. Guess. It shows you 3 to 5 ranked guesses, each with a prediction that could prove it wrong.
4. Probe. It tests one change at a time and tags debug logs (printed messages) like `[DEBUG-a4f2]`, so cleanup is one search.
5. Fix. It writes a regression test, which stops this bug coming back, before the fix.
6. Clean up.

```checkpoint quick-2
The loop is red and the repro is cut down. What does the agent do next?
- [x] It shows you 3 to 5 ranked guesses, each with a prediction.
- [ ] It writes the fix for the likeliest cause, then reruns the loop.
- [ ] It tests the first guess it has, then tags its debug logs.
Why: Guessing comes straight after shrinking, and each guess needs a prediction that could prove it wrong. Probing and the fix come later.
```

```diagram
type: chain
caption: "The agent works through six phases"
steps:
  - label: "Build the loop."
    note: "one command that goes red on this bug and green once it's fixed"
  - "Reproduce and shrink."
  - "Guess."
  - "Probe."
  - "Fix."
  - "Clean up."
  - label: "[retro](/learn/retro)"
    note: "in the same session"
groups:
  - from: 1
    to: 6
    label: "six phases"
```

For example, the loop might be one failing test, run by pytest, a Python test tool (409 means refused, 201 means booked):

```text
$ pytest test_bookings.py -k full_class
FAILED test_bookings.py::test_full_class - assert 201 == 409
```

The loop must check your exact symptom, give the same verdict every run, take seconds and run unattended, with nobody watching. Phase 1 is done once the loop is that **tight** and already run. The Skill tells the agent to spend most of its effort here.

```checkpoint quick-3
Your command goes red on the exact symptom, but each run takes minutes. Why isn't phase 1 done?
- [x] A tight loop has to take seconds, and this one doesn't.
- [ ] A tight loop has to avoid your symptom, and this one checks it.
- [ ] A tight loop has to need a person, and this one runs alone.
Why: A tight loop must check your exact symptom, give the same verdict every run, take seconds and run unattended. This command takes minutes, so it misses the third of those.
```

## When to use it

- You have something broken, failing or slow, and the cause isn't obvious.
- You have a **regression**: a bug that broke something which used to work.
- You have a bug that happens only sometimes. The agent aims for a higher reproduction rate, meaning how often it fails, not a clean repro.

```checkpoint quick-4
A booking test fails only some of the time. What should the agent aim for first?
- [x] A higher reproduction rate, so the bug shows up more often.
- [ ] A clean repro that fails the same way on every single run.
- [ ] A longer test suite, so that more of the code gets exercised.
Why: For a bug that happens only sometimes, a clean repro isn't the goal. The aim is a higher reproduction rate.
```

## When not to use it

- If you're building a new behaviour test-first, use [tdd](/learn/tdd) instead, because nothing is broken.
- If a raw bug report came from someone else, use [triage](/learn/triage) first, because it checks the report.

```checkpoint quick-5
You want a new endpoint that lists a member's bookings, built test-first. Which fits?
- [x] tdd, because it's new behaviour and nothing is broken.
- [ ] diagnosing-bugs, because a failing test starts its loop.
- [ ] triage, because a new endpoint needs sorting first.
Why: triage is for a raw bug report from someone else, and diagnosing-bugs is for something broken. Building a new behaviour test-first is the job of tdd.
```

## What it needs to start

You can start it, or the agent may do so when you report a bug. It needs:

- Your exact symptom: the error, wrong output or slow timing.
- Code the agent can run, such as your tests or a command-line program.

```checkpoint quick-6
You tell the agent that an endpoint has a bug, and you don't type the Skill's name. What can happen?
- [x] The agent may start the Skill on its own.
- [ ] The agent has to wait until you type the name.
- [ ] The agent can start it only after a triage pass.
Why: You don't have to be the one who starts this Skill. When you report a bug, the agent may start it on its own.
```

## What it creates

- A regression test, red then green.
- The fix, with the right guess named in the commit message.

The test needs a **correct seam**: a place where a test can recreate the real bug. If none exists, the agent notes that as the finding, because a shallow test, one that passes while the bug survives, can't be trusted.

This Skill is an on-ramp, a starting point that later joins the [main flow](/learn/main-flow). It joins at [retro](/learn/retro): run it in the same session to ask what would have prevented the bug. A missing seam is a job for [improve-codebase-architecture](/learn/improve-codebase-architecture).

```checkpoint quick-7
The fix is in and the regression test is green. What do you run next, in the same session?
- [x] retro, to ask what would have prevented the bug.
- [ ] tdd, to write more tests around the code you fixed.
- [ ] triage, to label the Issue for this bug as done.
Why: retro asks what would have prevented the bug. That's where this on-ramp merges onto the main flow.
```

## Going deeper

### Why it exists

Given a bug report, a coding agent by default reads the code and guesses. Nothing has shown the bug happening, so nothing can show that a fix worked.

So the Skill adds a **gate**, a condition the agent must meet before it may go on. There's no theory until one command, already run, goes red on this bug. In the words of Matt Pocock, who wrote the Skill: "That single gate is what the skill is for."

The other phases work the same way: gates, not a checklist. For example, the agent can't start guessing until the bug is reproduced and the repro is shrunk. A phase may be skipped only with an explicit justification.

```checkpoint quick-8
The agent has a red loop but hasn't shrunk the repro, and it wants to start guessing. What happens?
- [x] It has to wait, because guessing needs the repro shrunk first.
- [ ] It can go ahead, because it may take the phases in any order.
- [ ] It can go ahead, as long as you see the guess list before it tests.
Why: The phases work as gates, not a checklist. Guessing has to wait until the bug is reproduced and the repro is shrunk.
```

### How it works underneath

**Debugging as science.** Andreas Zeller's _The Debugging Book_ applies the scientific method to bugs. A **hypothesis** is a possible cause; a prediction is what you'd see if it's real.

So the cycle is: form a hypothesis, state a prediction that could refute it, test it in an experiment, then keep or reject the hypothesis. You repeat until nothing disagrees. Zeller: "Debugging is a game of falsifying assumptions."

```checkpoint quick-9
An experiment shows that a prediction was wrong. What comes next?
- [x] Reject the hypothesis, and go round the cycle again.
- [ ] Write the fix anyway, since the experiment has run.
- [ ] Keep the hypothesis, and drop the prediction instead.
Why: A test that refutes the prediction means the hypothesis is rejected. You repeat until nothing disagrees, so a refuted guess doesn't reach the fix.
```

```diagram
type: cycle
caption: "Debugging is a game of falsifying assumptions."
steps: ["form a hypothesis", "state a prediction that could refute it", "test it in an experiment", "keep or reject the hypothesis"]
```

**Guesses you can test.** Phase 3 is the same move, with a fixed sentence shape. For example, one guess for the full class might read:

```text
If an off-by-one in the capacity check is the cause,
then changing its <= to < will make the bug disappear,
and changing it to <= capacity + 1 will make it worse.
```

If the agent can't state a prediction, the Skill calls the guess a "vibe": discard or sharpen it.

**Building the loop.** The Skill lists ten ways, roughly in order of preference. A failing test comes first. Next is a script using **curl**, a terminal command for sending HTTP requests, against a **dev server**, a local copy of an app.

If a bug happens only sometimes, the agent repeats its trigger 100 times or adds stress until it fails often enough to debug. That high rate stands in for the same verdict every run.

If no loop can be built, the agent stops and says so. It asks you for access, a redacted captured log, or permission for temporary production logging.

```checkpoint quick-10
The agent has tried, and no loop can be built. What should it do?
- [x] Stop, say so, and ask you for access, a log or permission.
- [ ] Read the code and fix its best guess, with no loop at all.
- [ ] Skip to the fix, then add a regression test once it's done.
Why: With no loop, there's no way to test a theory, so the agent stops and says so. It asks for access, a redacted captured log, or permission for temporary production logging.
```

When a person must click, the last resort is a template script in **bash**, a common terminal shell and scripting language (a Mac's Terminal opens zsh by default, but runs bash scripts too). The agent runs the script, and you follow its prompts in your terminal. Your answers come back as `KEY=VALUE` lines. This stands in for running unattended.

**Finding the commit.** If a bug appeared between two known states, the loop can drive `git bisect`, a git command that finds which commit introduced a bug. `git bisect run` runs your command on each commit it picks, and reads the **exit code**: the number a program returns when it ends.

- Exit 0: the commit is good.
- Exit 1 to 127, except 125: the commit is bad.
- Exit 125: the commit can't be tested, so bisect skips it.

```checkpoint quick-11
Your loop script can't run its test on an old commit. Which exit code should it return?
- [x] 125, so bisect skips that commit.
- [ ] 0, so bisect counts it as good.
- [ ] 1, so bisect counts that commit as bad.
Why: Exit 0 means good, and 1 to 127 except 125 means bad. A commit that can't be tested is neither, so exit 125 tells bisect to skip it.
```

Given one good commit and one bad one, a command that fails only on this bug can drive the rest of the search.

For a slowdown, phase 4 swaps debug logs for a baseline measurement, then bisects: measure first, fix second.

### A real example

In August 2026, Matt's pull request #779 closed a high-rated finding from Snyk, a security scanner. The finding was insecure handling of secrets, such as API keys. The pull request lists three ways a live secret could reach the agent's reply:

- Phase 1 said "paste the invocation and its output". For a curl loop, that's an `Authorization` header, the part of the request that carries your login secret.
- With no loop, the Skill asked you for a captured log, which carries auth headers.
- The bash script prints each captured answer back to the terminal, where the agent reads it.

The fix was a Redact section at the top of the Skill. The agent writes `<REDACTED>` for every secret and builds loops against **environment variables**, named settings your computer passes to programs, so the secret itself never shows up in a command or its output.

One line there is deliberate: if the redacted output isn't enough, the agent says so and asks you. The pressure to produce a red loop would push an agent to paste the raw secret. As the pull request puts it, "the escape hatch needs writing."

```checkpoint quick-12
The redacted output isn't enough to diagnose the bug. What should the agent do?
- [x] Say so and ask you, without showing the raw secret.
- [ ] Paste the raw secret once, then delete it from chat.
- [ ] Skip the loop and guess at the cause from the code.
Why: The pressure to produce a red loop could push an agent to paste the raw secret. So the Skill writes down the way out, which is to say so and ask.
```

### Where it goes wrong

**You asked a quick question and got a full diagnosis.** This is the most-reported problem with the Skill, which is slow and thorough on purpose. Some models, GPT-5.6-Sol especially, start it on a plain description of a problem. Matt has said it could start lighter, but that hasn't shipped. Until then, tell the agent to answer and not diagnose, or switch off model invocation so only you can start it. In Claude Code, type `/skills`, highlight diagnosing-bugs, press Space until it says `user-only`, then press Esc. That's saved in your settings, not in the Skill's file, so `npx skills update` leaves it alone. Adding `disable-model-invocation: true` to the Skill's file works too, but the next update undoes it. (This applies to Skills installed with `npx skills`, as in the practice project, not to plugin installs.)

```checkpoint quick-13
You wanted a quick answer, and the agent started a full diagnosis. What can you do?
- [x] Tell it to answer and not diagnose, or switch off model invocation.
- [ ] Nothing is needed, since the lighter start has already shipped.
- [ ] Type the Skill's name, which makes it start with a lighter approach.
Why: Matt has said the Skill could start lighter, but that hasn't shipped. So for now, you say what you want, or stop the agent starting this Skill by itself.
```

**The agent wrote the fix before you agreed the cause.** Its only checkpoint with you is the ranked guess list, and even that doesn't wait if you're away. Issue #124 asked for a stop before the fix and was closed as not planned in October 2026. So ask for that stop when you start the Skill.

```checkpoint quick-14
You want to read the root cause before any fix is written. What do you do?
- [x] Ask for that stop when you start the Skill.
- [ ] Rely on the Skill's built-in stop.
- [ ] Wait at the guess list, which holds until you reply.
Why: The only checkpoint is the guess list, and even that doesn't wait if you're away. Issue #124 asked for a stop before the fix and was closed as not planned.
```

**The agent redid work that triage already did.** [triage](/learn/triage) follows the reporter's steps, a shallow version of phases 1 and 2. Expect this Skill to redo that work in full. It isn't wasted, though: it often gives you most of phase 1's raw material.

**A secret showed up in the agent's output.** Older versions of the Skill told it to paste output as it was. Update the Skill. [Matt's page on the Skill](https://www.aihero.dev/skills-diagnosing-bugs), last updated on 24 August 2026, says no instruction covers this, but the Skill's file has had a Redact section since version 1.2.3.

**A saved prompt that calls `/diagnose` stopped working.** Version 1.0.0 renamed the Skill to `/diagnosing-bugs`. Update the prompt.

### Try it

Run the Skill on one real bug. You need the practice project, the yoga-studio booking site that [keeping track](/learn/issues-and-keeping-track)'s Try it step sets up, with its booking endpoint ([implement](/learn/implement)'s Try it step builds it) and a bug in `api/`. No bug to hand? If you have the full-class rule, change its check by hand so a full class takes one more booking, then commit that. If you don't have the rule yet, add it with [tdd](/learn/tdd) first, because a missing rule is new behaviour.

1. In the project folder, run `git switch main && git pull`, then `git switch -c diagnose-full-class`, so the bug you plant and its fix stay off `main`.
2. Write down the exact symptom.
3. Open a fresh session in the project and type `/diagnosing-bugs`.
4. Give it the symptom, and add one line: `Stop and show me the root cause before you write the fix.`

   You should see a command and its red output before any theory. If a theory comes first, the Skill isn't running.

5. Read the ranked list. You should see 3 to 5 guesses, each with a prediction.
6. Read the root cause when the agent stops.
7. Reply `go ahead`. You should see a regression test go red, then green.
8. Search for leftover logs: `grep -rn "DEBUG-" api/`. You should see nothing.
9. Ask the agent to commit.
10. Run `git log -1`. You should see the guess that proved right.
11. Push the branch with `git push -u origin diagnose-full-class`, open a pull request with `gh pr create`, and merge it once its checks pass, so the regression test reaches `main`.

### Read more

- [The /diagnosing-bugs Skill](https://www.aihero.dev/skills-diagnosing-bugs), Matt Pocock, updated 2026-08-24
- [fix: make diagnosing-bugs redact secrets (#779)](https://github.com/mattpocock/skills/pull/779), Matt Pocock, 2026-08-06
- [diagnosing-bugs: start light and escalate, instead of a full repro loop on quick questions (#578)](https://github.com/mattpocock/skills/issues/578), bash99, 2026-07-15
- [Add user confirmation checkpoint between Phase 4 and Phase 5 (#124)](https://github.com/mattpocock/skills/issues/124), zzy1099207684, 2026-05-03
- [Improve diagnosing-bugs handling of sensitive debugging evidence (#674)](https://github.com/mattpocock/skills/issues/674), geret1, 2026-07-27
- [Introduction to Debugging](https://www.debuggingbook.org/html/Intro_Debugging.html), Andreas Zeller, _The Debugging Book_, last changed 2024-10-15
- [git-bisect Documentation](https://git-scm.com/docs/git-bisect), the Git project, git 2.56.0, 2026-09-28

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint diagnosing-bugs-deeper-after-triage
A member of the yoga studio filed an Issue: booking a full class sometimes succeeds. You already sorted it, and that pass reproduced it once from her steps. Nobody knows the cause yet, and it fails only some of the time. Which fits best?
- [x] Build a tight loop that goes red on it, even though it was reproduced once already.
  > Right: that's `/diagnosing-bugs`.
- [ ] Sort the Issue again, so its one reproduction becomes the agent brief and the test.
  > That's `/triage`. Triage's check is a shallow, bounded pass. A cause that's still unknown needs the thorough version, which redoes that work in full.
- [ ] Write the full-class booking rule as new behaviour, test-first, one slice at a time.
  > That's `/tdd`. That builds a planned behaviour. Here the behaviour exists and fails some of the time, and the cause isn't known yet.
Why: A triage check is a shallow version of this Skill's first two phases. It showed the bug can happen, but not why. So the first pass isn't wasted, but expect the diagnosis to redo that work in full.
```

```checkpoint diagnosing-bugs-deeper-falsifiable-guess
Your loop goes red on the full-class bug. The agent's first guess reads: "the capacity code is messy". The Skill makes it rewrite the guess as "If X is the cause, then changing Y will make the bug disappear". Why?
- [x] A guess that predicts nothing gives no experiment that could prove it wrong.
- [ ] The pull request message has to quote every guess in that exact sentence shape.
  > Only the guess that turned out right goes in the commit or pull request message. The shape is for testing, not for the record.
- [ ] The agent may not read the capacity code until the guess names a file and a line.
  > Reading code is allowed once the loop exists. The rule is about making each guess testable.
- [ ] Sentences in that shape let the agent skip the shrinking step before guessing.
  > Guessing comes only after the repro is reproduced and minimised, not instead of it.
Why: A prediction is what makes a guess testable. With no prediction, no experiment can prove the guess wrong, so it can't be kept or rejected. The Skill calls a guess like that a vibe, and Zeller calls debugging a game of falsifying assumptions.
```

## Remember

```flashcards
Q: What is diagnosing-bugs' first phase, and why does it get the most effort?
A: Building a tight feedback loop, one command that goes red on this bug. With it, you will find the cause. Without it, staring at code won't.

Q: Which four things must the feedback loop do before phase 2?
A: Check your exact symptom, give the same verdict every run, take seconds, and run unattended.

Q: How does the agent mark its debug logs, and why?
A: It tags each one with a unique prefix like [DEBUG-a4f2], so cleaning them up at the end is a single search.

Q: Where does diagnosing-bugs merge onto the main flow?
A: Once the fix is in, at [retro](/learn/retro), in the same session. A missing seam goes to [improve-codebase-architecture](/learn/improve-codebase-architecture).

Q: What did a security fix add to diagnosing-bugs, and why?
A: A Redact section: write `<REDACTED>` for every secret, because a scanner found three ways a live secret could reach the agent's reply.

Q: What does `git bisect run` do when your loop script exits with 125?
A: It skips that commit as one that cannot be tested. Exit 0 means good; 1 to 127, except 125, means bad.

Q: What is diagnosing-bugs' most-reported problem, and the workaround?
A: It fires on quick questions. Tell the agent to answer and not diagnose, or switch off model invocation, so only you can start it.
```

## Final test

```final-test diagnosing-bugs-loop-done
When is the first phase, building the feedback loop, done?
- [x] When a fast command you've run reliably goes red on your exact symptom, unattended.
- [ ] When you've read the code around the bug and ranked three or four likely causes for it.
- [ ] When the whole test suite runs to the end with no errors, on your laptop and in CI.
- [ ] When you've written down steps that reproduce your exact symptom by hand.
Why: The loop only helps if it catches this exact bug, gives the same verdict every run, takes seconds and needs nobody watching. Until that command exists, the agent may not form a theory, because a theory with no way to test it is what the Skill exists to prevent.
```

```final-test diagnosing-bugs-no-correct-seam
The only place you could put a regression test can't recreate how the bug really happens. What should the agent do?
- [x] Note the missing seam as the finding, rather than trust a shallow test.
- [ ] Write the test there anyway, since a shallow regression test still guards the fix.
- [ ] Hold back the fix until someone has built a seam that can recreate it.
Why: A test at a seam that's too shallow can pass while the real bug lives on, so it gives false confidence. The shape of the code is what stops the bug being locked down, so the agent records that as the finding.
```

```final-test diagnosing-bugs-how-many-guesses
How many guesses about the cause does the Skill want before testing any of them?
- [x] 3 to 5, ranked, each with a prediction that could disprove it.
- [ ] One, the most likely, tested straight away so the loop stays fast.
- [ ] A long list of ten or more, tested together in one run.
Why: One guess anchors the agent on the first idea that sounds right. A short ranked list keeps other causes alive, and each prediction gives a way to prove a guess wrong. You see the list first, because you may know enough to re-rank it.
```

```final-test diagnosing-bugs-deeper-default
What does a coding agent do by default with a bug report, the thing this Skill blocks?
- [x] It reads the code and guesses at the cause before any command has gone red.
- [ ] It writes a broad end-to-end test first and only then reads the code around it.
- [ ] It asks you for logs and a screen recording before it looks at anything itself.
Why: By default, the agent reads the code and guesses, and nothing shows whether the guess is right. So the Skill puts a gate before any theory, a command, already run, that goes red on this bug.
```

```final-test diagnosing-bugs-deeper-pause-before-fix
Where does the Skill wait for you between finding the root cause and writing the fix?
- [x] Nowhere: its only checkpoint is the guess list, which doesn't wait if you're away.
- [ ] At a required stop after probing, where it reports the root cause and waits for your yes.
- [ ] At the Redact section, which pauses every fix until you confirm no secret was shown.
Why: The only checkpoint is the ranked guess list, and the Skill says not to block on it. Issue #124 asked for a stop before the fix, but it was closed as not planned. So if you want that stop, ask for it when you start the Skill.
```

```final-test diagnosing-bugs-flaky-checkout
On your shop website, the end-to-end checkout test started failing about one run in ten in CI a week ago. Nobody can see why from reading the code, and re-running it usually passes. Which fits best?
- [x] Make it fail more often, shrink it, then list guesses and probe each one.
  > Right: that's `/diagnosing-bugs`.
- [ ] Write a new failing test for the checkout and build until it passes.
  > That's `/tdd`. That builds new behaviour test-first. Here the behaviour exists and fails sometimes, and nobody knows why yet.
- [ ] Review the last week's changes against the coding standards and the Spec.
  > That's `/code-review`. A review checks a diff against standards and the Spec. It doesn't hunt down the cause of an intermittent failure.
- [ ] Label the failure as a bug and write an agent brief so it can be fixed.
  > That's `/triage`. Sorting is for raw Issues other people filed. You've already seen this bug yourself; what's missing is its cause.
Why: A test that fails only sometimes, with no cause you can see, is the hard kind of bug this Skill is for. The Skill keeps raising the failure rate until it's debuggable, so the first goal is a higher reproduction rate. Then you shrink it, guess and probe as usual.
```

```final-test diagnosing-bugs-new-endpoint
You want to add an endpoint to your FastAPI app that lists a user's bookings. Nothing is broken and there's no Spec for it. It's one small, clear behaviour, and you want it built with tests. Which fits best?
- [x] Build the endpoint test-first, one red-green slice at a time.
  > Right: that's `/tdd`.
- [ ] Build a tight feedback loop that goes red, then list guesses about the cause.
  > That's `/diagnosing-bugs`. That's for bugs and regressions. Nothing is broken, so there's no cause to find.
- [ ] Write a Spec for the endpoint and publish it to the Issue tracker.
  > That's `/to-spec`. One concrete behaviour doesn't need a Spec. The test-first Skill on its own is meant for exactly this.
Why: Both Skills can start from a failing test, but for different reasons. A feedback loop hunts the cause of something broken. Here nothing is broken, and you're building one clear behaviour with no Spec, so that's the job of tdd on its own.
```

```final-test diagnosing-bugs-after-the-fix
Your FastAPI app's nightly SQL migration kept hanging. After a long session you built a loop, found the cause, and the regression test now passes. The original repro no longer hangs and the tagged debug logs are gone. What comes next, in this same session?
- [x] Ask what environment change would have prevented the bug.
  > Right: that's `/retro`.
- [ ] Write another failing test for the migration and build until it passes.
  > That's `/tdd`. The regression test and the fix are already done and green.
- [ ] Sort the open Issues and label this one as fixed, with a comment.
  > That's `/triage`. Sorting is for raw incoming Issues. This bug is already fixed, and the useful question now is how to stop the next one.
- [ ] Write a Spec for the migration system so the next change is planned.
  > That's `/to-spec`. There's no new feature to plan. The bug is fixed.
Why: The bug is fixed, so the useful question now is how to stop the next one. The main flow's last step asks what would have prevented it. It suggests changes to the environment (checks, standards, pointers), not the code, so the next build starts from a better place.
```

```final-test diagnosing-bugs-missing-seam
Two background workers in your AI agent service sometimes claim the same job. You found the cause, but the only place you could test it is a unit test with a single caller, which can't recreate two workers racing. You noted that no correct seam exists. Where does that finding go next?
- [x] Into a survey of the codebase's shape, to find how to give the bug a seam.
  > Right: that's `/improve-codebase-architecture`.
- [ ] Into a unit test at the single-caller seam, kept anyway as the regression test.
  > That's `/tdd`. A test at a seam too shallow to recreate the bug gives false confidence.
- [ ] Into a review of the fix against the coding standards and the Spec.
  > That's `/code-review`. A review checks the diff. It doesn't reshape modules to create the missing seam.
Why: A test at that single-caller seam can't recreate two workers racing, so it would prove nothing. The shape of the code is what stops the bug being locked down. So the finding goes to the Skill that surveys the code's shape and finds ways to improve it.
```

```final-test diagnosing-bugs-why-loop-first
A page on your website has become slow. The agent wants to start by reading the code and guessing. Instead it's told to first build one command that shows the slowness and goes red on it. Why that order?
- [x] With no pass/fail signal on this exact problem, reading code won't find it.
- [ ] The Skill holds off reading code until the bug has been fixed.
  > The Skill reads code. What it rules out is building a theory before the loop exists.
- [ ] The pull request body needs the command as proof the slowness is gone.
  > The loop is for finding and checking the cause, not for decorating the pull request.
- [ ] Slow pages are found by profiling alone, so the command just runs a profiler.
  > A profiler is only one way to measure slowness, and the loop's reason is the same for every bug, slow or broken.
Why: Every later phase needs a signal that says whether this problem is still there. A theory formed before the loop exists has no way to be tested, which is the exact failure the Skill prevents. For slowness, the Skill's order is the same, so measure first and fix second.
```

```sources
- [The /diagnosing-bugs Skill](https://www.aihero.dev/skills-diagnosing-bugs), Matt Pocock, 2026-07-07
- [diagnosing-bugs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/diagnosing-bugs/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [git-bisect Documentation](https://git-scm.com/docs/git-bisect), The Git project, 2026-09-28
- [Introduction to Debugging (The Debugging Book)](https://www.debuggingbook.org/html/Intro_Debugging.html), Andreas Zeller, 2024-10-15
- [diagnosing-bugs: scripts/hitl-loop.template.sh](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/diagnosing-bugs/scripts/hitl-loop.template.sh), Matt Pocock's Skills
- [fix: make diagnosing-bugs redact secrets #779](https://github.com/mattpocock/skills/pull/779), Matt Pocock, 2026-08-06
- [diagnosing-bugs: start light and escalate, instead of a full repro loop on quick questions #578](https://github.com/mattpocock/skills/issues/578), bash99, 2026-07-15
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, 2026-08-24
- [Add user confirmation checkpoint between Phase 4 and Phase 5 #124](https://github.com/mattpocock/skills/issues/124), zzy1099207684, 2026-05-03
- [triage: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/SKILL.md), Matt Pocock's Skills
- [Improve diagnosing-bugs handling of sensitive debugging evidence #674](https://github.com/mattpocock/skills/issues/674), geret1, 2026-07-27
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
```
