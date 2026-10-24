---
title: Diagnosing bugs
slug: diagnosing-bugs
order: 13
part: 3
image: /photos/diagnosing-bugs.jpg
imageAlt: A mechanic in a workshop studies and works on a motorcycle engine.
imageCredit: Aaron Huber
---

When something breaks, make the agent prove it can see the bug before it's allowed to guess why.

```goals
- You'll be able to explain why an agent that guesses at a bug's cause wastes your time, and what makes a feedback loop tight.
- You'll be able to put the Skill's six phases in order and say what has to be true before each next one starts.
- You'll be able to steer a `/diagnosing-bugs` session: give the exact symptom, re-rank its hypotheses, ask for a pause before the fix, and hand over steps only you can do.
- You'll be able to decide when to reach for `/diagnosing-bugs` instead of `/triage` or a plain question, and what to type once the fix is in.
```

## Why it matters

You tell Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) that a reader's comment on this site wouldn't post. It opens the comments code, spots something suspicious, changes it, runs the tests (small programs that check the code works), sees them pass and reports: fixed. Was it? The tests passed before the change too. Nothing ever showed the bug happening, so nothing can show it's gone.

That's the default: given a bug report, a coding agent reads code and guesses, and the guess sounds certain. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, sums up the problem with a line his README borrows from *The Pragmatic Programmer*: "The rate of feedback is your speed limit." In an April 2026 conference talk he added that agents do have feedback (types, tests, a browser) but don't use it the way a veteran developer would: they do far too much at once and check afterwards.

A Skill is a short instruction file the agent loads when you type its name, or when a task matches its description. ([Start here](/learn/start-here) covers installing Matt's.) `/diagnosing-bugs` packages the veteran's habit: ==no theory until something goes red==. It's for the hard bugs: the one that resists a first look, the one that comes and goes, the one that crept in between two versions that worked. It's slow on purpose.

It's a model-invoked Skill. Besides typing `/diagnosing-bugs` yourself, the agent can start it on its own when you say "debug this" or report that something is broken, throwing an error, failing or slow. It needs no setup.

## The idea: a loop that goes red

A ==feedback loop== is a command that runs the code where the bug lives and gives a pass-or-fail verdict. Developers call a failing result red and a passing one green, after the colours test tools print. Building one is the whole first phase, and everything later just uses it. Its SKILL.md (the instruction file) puts it bluntly: "Build the right feedback loop, and the bug is 90% fixed."

A loop only counts when it's **tight**, which means four things:

- **Red-capable.** It drives the real code and checks *your exact symptom*, so it's red now and turns green once the bug is fixed. "The build passes" or "it didn't crash" can't catch this bug.
- **Deterministic.** The same verdict on every run.
- **Fast.** Seconds, not minutes. A slow loop that flips at random is barely better than none.
- **Agent-runnable.** The agent can run it alone; a person joins only through a special script.

The agent must show it: one named command it has already run, with its output. Until that exists, it may not form a theory, and if it catches itself reading code to guess the cause, the Skill tells it to stop.

**Ways to build one,** roughly in the order it tries them:

1. A failing test at a seam: a place where a test can plug into the code and drive the real behaviour.
2. A curl script (curl sends web requests from the terminal) against the dev server, your site running on your own machine.
3. A command run on a sample input, output compared with a known-good copy.
4. A script that drives a hidden browser through the page.
5. A saved real request, replayed through the code.
6. A throwaway harness: a tiny slice of the system, the rest faked.
7. A fuzz loop: a thousand random inputs.
8. A script Git (the tool that tracks your code's history) runs on old commits, its saved snapshots, to find where it broke.
9. The same input through the old and new versions, compared.
10. Last resort: a human-in-the-loop script, when a person has to click.

**Bugs that come and go.** Here the goal is a higher reproduction rate, not a perfect repro (a reliable way to make the bug happen): repeat the trigger a hundred times, run copies in parallel, add load or delays. Failing half the time is debuggable; one in a hundred isn't yet.

**When nothing will go red,** the agent stops and says so, lists what it tried, and asks you for one of three things: access to wherever the bug happens, a captured artifact (a log, or a HAR file: a browser's recording of its network traffic), or permission to add temporary logging (lines the code prints as it runs) to the live system. It doesn't move on to theories.

**Secrets come first.** Before it shows any command, output or artifact, it writes `<REDACTED>` over secrets, keeps credentials in environment variables (settings the shell holds, so they never appear in the command itself) and quotes only the lines that matter.

```callout big-idea
Without a red command, everything after it is guessing. With one, finding the cause becomes mechanical: change one thing, run the loop, read the verdict.
```

```checkpoint no-loop-stop
A bug only happens on one customer's laptop, which you can't access. The agent has tried a failing test, a curl script and a replayed request, and nothing goes red. What should it do now?
- [ ] Form its best theory from the code and fix that.
  > That's exactly what the Skill forbids: no red-capable command, no hypotheses.
- [ ] Close the bug as "can't reproduce".
  > Giving up isn't on the list either. It should ask you for what it needs.
- [x] Stop, say what it tried, and ask you for access or a log.
  > Right. It asks for access to the environment, a redacted captured artifact such as a log, or permission for temporary instrumentation.
- [ ] Add logging to every function and wait for the bug to recur.
  > "Log everything" is ruled out, and logging on a live system needs your permission first.
```

## The six phases, gate by gate

The Skill works in six phases, each behind a gate: the next can't start until something specific is true. It may skip one only with a stated reason.

```scene flow
title: Six phases, each behind a gate
node: loop | Phase 1: build a tight loop
node: stop | Nothing goes red: stop and ask | side
node: repro | Phase 2: reproduce and minimise
node: hyp | Phase 3: rank 3 to 5 hypotheses
node: probe | Phase 4: instrument with tagged logs
node: fix | Phase 5: fix plus regression test
node: clean | Phase 6: cleanup
# Phase 1 ends only when one command, already run and shown, goes red on your exact symptom.
at: loop
# If nothing will go red, it stops, says what it tried and asks you for access, an artifact or permission. No theories.
at: stop
# Phase 2 confirms it's your bug, then cuts pieces until every one left is needed.
at: repro
# Phase 3 shows you 3–5 ranked hypotheses, each with a prediction, before testing any.
at: hyp
# Phase 4 tests one prediction at a time, with every debug log tagged.
at: probe
# Phase 5 writes a regression test first, at a correct seam, or records that none exists.
at: fix
# Phase 6: the repro is gone, the tags are gone, and the commit names the right hypothesis.
at: clean
```

1. **Build a feedback loop.** Gate: one command, already run and shown, that's red on your symptom.
2. **Reproduce and minimise.** It confirms the loop shows the failure *you* described, not one nearby (wrong bug, wrong fix), on repeated runs, and records the exact symptom. Then it cuts inputs, settings, data and steps one at a time, rerunning after each cut. Gate: ==every remaining piece is load-bearing==, so removing any one turns the loop green. A small repro leaves fewer suspects, and it becomes the regression test later.
3. **Hypothesise.** Three to five ranked guesses at the cause, before testing any; one guess anchors on the first plausible idea. Each must be falsifiable (able to be proved wrong) by naming a change that should make the bug vanish if it's right. A guess with no prediction is a vibe: sharpen it or drop it. The list is shown to you before testing: the Skill's only built-in human checkpoint. It doesn't wait; if you're AFK (away from the keyboard), the agent carries on with its own ranking.
4. **Instrument.** Each probe tests one prediction, changing one thing at a time. A debugger (a tool that pauses running code so you can look inside) comes first, then targeted logs where the hypotheses disagree, never "log everything and search". Every debug log gets a unique tag like `[DEBUG-a4f2]`, so one search finds them all at cleanup. For something slow, it measures a baseline first, then narrows down.
5. **Fix and regression test.** A regression test fails if this bug ever comes back. It's written before the fix, but only at a correct seam: one where a test recreates the bug the way it really happens. If the only seam is too shallow (one caller when the bug needs two, say), a test there gives false confidence, so ==a missing seam is itself the finding==, and the agent records it. Otherwise: turn the minimised repro into a failing test, watch it fail, fix, watch it pass, rerun the original loop. If it forced the red by deliberately breaking code, it diffs against an untouched copy to prove the break happened.
6. **Cleanup.** Before declaring done: the original repro no longer reproduces; the regression test passes, or the missing seam is written down; a search for `[DEBUG-` finds nothing; throwaway code is gone; and the commit message (the note saved with a change) says which hypothesis was right.

There's no pause before the fix unless you ask for one when you start.

```checkpoint minimise-cut
A loop for "the CSV export drops the last row" goes red with a 2,000-row file, three settings switched on and an admin account. The agent switches off one setting and reruns: still red. What does that tell it?
- [x] That setting isn't needed for the bug, so it stays out.
  > Right. Cut one thing at a time and keep only what the failure needs. Fewer moving parts means fewer suspects in Phase 3.
- [ ] Every detail of the original report matters, so put it back.
  > Minimising exists to find out which details matter. One that leaves the loop red doesn't.
- [ ] The repro is red, so minimising is finished.
  > It's done only when removing any remaining piece turns the loop green.
- [ ] That setting must be the cause, because nothing changed.
  > If removing it changed nothing, it's the least likely cause.
```

## A session, step by step

Imagine a Visitor (anyone reading this site) reports that their comment was refused with "Name must be 50 characters or fewer", though their name was 26 flower emoji. In the replies, 400 is the web's code for a refused request and 201 means created. A real session (one Claude Code conversation) prints far more.

```scene chat
title: Diagnosing a refused comment on this site (illustrative)
# You type the Skill, the exact symptom, and one request about pausing.
you: `/diagnosing-bugs` A Visitor's comment was refused: "Name must be 50 characters or fewer". The name was 26 🌸 emoji. Expected: it posts. Show me the root cause before you change any code.
# Phase 1: before any theory, one command it has already run, red on your symptom.
agent: Loop: `bash repro.sh` posts a comment with that name to the dev server. Output: `400 Name must be 50 characters or fewer.` That's red, and it's your symptom. Same result every run, under a second.
# Phase 2: it confirms the failure, then shrinks it until every piece matters.
agent: Minimised: any Lesson, a one-letter comment and a name of 26 🌸 still go red. 25 🌸 go green, and so do 26 plain letters. The count and the emoji both matter.
# Phase 3: ranked hypotheses, each with a prediction, shown before testing.
agent: 1. The length check counts each emoji as two. *Prediction:* counting characters makes 26 🌸 pass. 2. Invisible characters get added on the way in. *Prediction:* logging the name on arrival shows extras. 3. The limit is in bytes. *Prediction:* 26 "é" also fail. I'll go in this order unless you re-rank.
# You add what you know, or just say go.
you: Go with your ranking.
# Phase 4: one tagged probe per prediction. Then it pauses, as you asked.
agent: `[DEBUG-7c1e] length=52 characters=26`, and the name arrives intact (rules out 2). 26 "é" go green (rules out 3). JavaScript's `.length` counts each 🌸 as two, so the check compares 52 with 50 (confirms 1). Shall I fix it?
# Phase 5: a regression test at the API, red before the fix, green after.
you: Yes, fix it.
agent: Added an API test that posts 26 🌸: watched it fail, changed the check to count characters, watched it pass. Reran `bash repro.sh`: `201`.
# Phase 6: cleanup, and a commit message that names the right hypothesis.
agent: A search for `[DEBUG-` finds nothing, and `repro.sh` is deleted. Commit: "Count name length in characters so emoji count once (hypothesis 1)".
```

You did three things: gave the exact symptom, asked for a pause, and said go. The agent kept the order: red command, then ranked predictions, then one tagged probe.

```checkpoint rerank
Diagnosing "booking times show an hour late", the agent shows four ranked hypotheses. Number 3 blames the daylight-saving code, which your team changed yesterday. What's the best move?
- [ ] Say nothing; it will get to number 3 eventually.
  > The list comes to you precisely because you know things it doesn't. One line can save several probes.
- [ ] Tell it to skip the probes and fix number 3 now.
  > A hint isn't proof. It should still test the prediction before fixing.
- [ ] Tell it to delete the other three hypotheses.
  > Keep them: if number 3's prediction fails, the next one is ready.
- [x] Mention yesterday's change so it tests 3 first.
  > Right. Re-ranking with what you know is the reason the list is shown to you.
```

## Steering it, and when to reach for it

- **Describe the symptom exactly:** what you did, what you saw, what you expected. "Prints 41.50, should print 46.50" gives the loop something to check; "the total's broken" doesn't.
- **Hand over what only you know.** Re-rank the list in one line: "we changed #3 yesterday" or "I've ruled out #1".
- **Ask for the pauses you want, up front:** "stop after the hypotheses" or "show me the root cause before changing code".
- **Keep secrets out of what you paste.** The Skill redacts what it shows; what you paste is yours to strip.
- **Do the human-only steps through its script.** If a person must sign in, click or read a screen, the agent turns its template, `hitl-loop.template.sh`, into a bash script (a file of terminal commands) of steps ("Sign in, then press Enter") and questions ("Did the error appear? y/n"). Your answers come back as `KEY=VALUE` lines. Signing in stays a step, never a captured answer, since answers are shown to the agent. If the prompts race past, run the script yourself in a separate terminal window and paste the final lines back.

| Your situation | Reach for |
|---|---|
| A specific defect you can describe as a symptom | `/diagnosing-bugs` |
| Something got slow, with a known before and after | `/diagnosing-bugs`: it measures, then narrows down |
| A raw bug report from someone else, not yet confirmed | `/triage` first; see [Triage](/learn/triage) |
| "Where are the slow parts of this codebase?" | Nothing yet: it diagnoses one known failure, it doesn't audit |
| A design question rather than a defect | `/prototype`; see [Prototype](/learn/prototype) |
| New behaviour you're building test-first | `/tdd`; see [TDD](/learn/tdd) |
| A quick question you want answered now | Ask, and add "just answer, don't diagnose" |

```checkpoint pause-first
You want to agree with the root cause before the agent changes any code. How do you get that pause?
- [ ] Nothing to do: it always waits for approval before the fix.
  > It doesn't. Only the hypothesis list is shown to you, and even that doesn't block.
- [x] Ask when you start: "show me the root cause first".
  > Right. The Skill has no pause before the fix, so say you want one when you invoke it.
- [ ] Switch to plan mode before typing `/diagnosing-bugs`.
  > Plan mode only reads and proposes until you approve a plan. It isn't a pause between finding the cause and fixing it.
- [ ] Watch closely and press Esc when the fix starts.
  > That works only if you catch it in time. Asking up front is reliable.
```

## After the fix

Once the fix is in, `/ask-matt` (Matt's Skill that routes you to the right Skill) says to type `/retro` in the same session. A retro (retrospective) reads the session just finished and suggests changes to the agent's surroundings, most severe first: an automated check that would have caught the bug, a rule for the reviewer, a pointer to a hard-to-find file.

`/retro` is user-invoked: only you can start it, and `/diagnosing-bugs` never calls it. Type it before `/clear`, the Built-in command (one that comes with Claude Code) that empties the conversation. See [Retro](/learn/retro).

If the finding was a missing seam, the next step is `/improve-codebase-architecture`, which looks for ways to reshape code so it can be tested properly; it's user-invoked too ([Architecture](/learn/architecture)). In Matt's map, "Something's broken" is an on-ramp onto the Main flow, the path most work takes from idea to shipped ([The main flow](/learn/main-flow)).

## How Matt and others use it

**Matt** has no video about this Skill alone, but he used it, under its old name `diagnose`, in his May 2026 triage walkthrough:

- He was sorting incoming bug reports with `/triage` when the agent took a reporter's analysis on trust. He wanted it to reproduce the bug itself, so he told it to diagnose, in the same session.
- First he checked his context: the agent's working memory for the conversation, measured in tokens (small chunks of text). He kept a budget of about 100K tokens per session then and was at 46.5K, so there was room. (His current rule of thumb is about 150k; see [The context window](/learn/context-window).)
- The agent built its loop as a unit test (a small test of one piece of code) asserting that a generated prompt contained no unresolved task ID. Matt noted it works like his TDD Skill: loop and regression test first, then the fix inside the loop.
- When it asked permission for a command, he said yes, switched to auto mode (where the agent stops asking for each step) and had it push the fix and close the issue.
- He often runs two sessions side by side: one triaging, one fixing.
- In a May 2026 video he called `/compact` (the Built-in command that replaces the conversation with a summary) handy for long debugging: compact away what you've tried, keep going, compact again.

**Other developers** shaped the Skill through its issue tracker:

- In July 2026, users of the GPT-5.6-Sol model reported that it fires on plain questions and builds mock repros before answering. The documented workaround: say "just answer, don't diagnose".
- In October 2026, a user saw an agent load the whole Skill and still jump from CI logs (the output of checks that run on every push) straight to a theory. The gate is written guidance, not a lock; you're the one who notices.
- The redaction rule (version 1.2.3) and the untouched-copy check both came from user reports, in July and August 2026.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). You'll plant a bug, make the agent forget it, then diagnose it.

1. Make an empty folder and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir bug-practice
cd bug-practice
claude
```

2. Type a slash and the word diagnosing. If `diagnosing-bugs` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box, press Shift+Tab until it changes.
4. Plant the bug:

```text
Make this folder a git repository. Write a tiny script in Node or Python, whichever is installed here, that reads cart.json and prints the order total. Plant one realistic, subtle bug that makes the total wrong for some carts, and commit it with a neutral message. Don't tell me the cause and leave no hints in comments. At the end, tell me only the command to run, the wrong output it prints, and the correct output.
```

5. Type `/clear` so the agent forgets what it planted.
6. Start the diagnosis, filling in what step 4 told you:

```text
/diagnosing-bugs Running <command> prints <wrong output>, but it should print <correct output>.
```

7. When the ranked hypotheses appear, read them and reply "Go with your ranking."
8. Let it fix the bug. If it asks permission to edit or run something in this folder, choose Yes; press Esc to stop it. Then type `/retro` and read its suggestions (you needn't accept any). Type `/exit` when you're done.

**It's working if:**

- [ ] Before any theory, it showed one command it had already run, with output matching your symptom.
- [ ] It shrank the repro and could say why each remaining piece is needed.
- [ ] It showed 3–5 ranked hypotheses, each with a prediction, before testing any.
- [ ] Any debug logs carried a tag like `[DEBUG-xxxx]`, and none were left at the end.
- [ ] A regression test failed before the fix and passed after, or it told you no correct seam exists.
- [ ] Its commit message, or its final summary, names the hypothesis that turned out right.

If a theory arrives before any command output, reply "Show me the red command first."

**Bonus: a real report from this site.** The author's notes say `/learn/nope` returned HTTP status 200 ("OK") instead of 404 ("not found"). When this Lesson was written, a check printed 404 on the live site and a local dev server, and nobody has diagnosed why. If you have Node and Git:

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped.git
cd idea-to-shipped
npm install
claude
```

```text
/diagnosing-bugs The notes say http://localhost:3000/learn/nope returns status 200 instead of 404. Start the dev server yourself. Don't change any code.
```

It's working if it shows the command it ran and its output before any theory, and if nothing goes red, it says so and asks instead of guessing.
````

## Common mistakes

- **Taking a green run as proof.** If it passed before the fix, it can't prove the fix.
- **Vague symptoms.** "It's broken" gives the loop nothing to check.
- **Letting it theorise first.** Ask for the red command.
- **A regression test that can't recreate the bug.** A shallow test is false confidence; a recorded missing seam is honest.
- **Everything from the steering and after-the-fix sections:** pasting secrets, running its script inside the chat, skipping `/triage` on a stranger's report, expecting a pause you didn't ask for, clearing before `/retro`.

```site-story
I never typed `/diagnosing-bugs` while building v1 of this site. Things still broke, and the agent and I handled them as everyday debugging: notice a symptom, look at the evidence, fix it. None of these went through the Skill's gates (no red command shown first, no ranked hypotheses, no tagged logs), so don't read them as Skill runs.

| Symptom | What the evidence showed | Fix |
|---|---|---|
| My setup wizard raced through every question | I'd run it inside the Claude chat with `!`, which can't press Enter | Ran it in a real terminal |
| The build failed: "uncached data during prerendering" | Next.js 16, the framework the site is built on, wants file reads marked as cacheable | Added `"use cache"` |
| `/learn/nope` showed the not-found page but returned status 200, not 404 | The page streams, so the status goes out before "not found" is known | Wrote it down and accepted it for v1 |
| A wait loop never finished | It was reading the wrong output stream | Fixed the command |
| A comment from a preview seemed to appear on the real site | Two *different* comments looked alike | Checked both databases: they were separate |

The lesson I took: look at the evidence (the logs, the actual database rows) before deciding what's wrong. The last one wasn't a bug at all.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Something's broken | `/diagnosing-bugs` plus the exact symptom: what you did, saw and expected |
| Before any theory | Expect one command, already run, red on your symptom |
| Nothing goes red | It stops and asks for access, an artifact or permission to log |
| The ranked list arrives | Re-rank with what you know, or say go |
| You want to approve the cause | Ask for that pause when you start |
| A person must click | Its human-in-the-loop script; signing in stays a step |
| The fix is in | `/retro` in the same session, before `/clear` |
| No correct seam | `/improve-codebase-architecture` |
| You just want an answer | "Just answer, don't diagnose" |

## Final test

```test scenario-raw-report
A stranger opens an issue on your open-source project: "Export is broken, please fix." There are no steps and no error text, and you haven't confirmed it. Which Skill do you start with?
- [ ] `/diagnosing-bugs`, so the agent builds a loop right away
  > It needs a symptom it can make go red. A vague, unconfirmed report from someone else should be checked and written up first.
- [x] `/triage`, to check it's real and get it written up
  > Right. Raw reports from other people go through `/triage` first; it does a light version of reproducing and confirming.
- [ ] `/tdd`, to write tests for the export feature first
  > `/tdd` builds planned behaviour test-first. You don't yet know what's wrong, or whether anything is.
- [ ] `/prototype`, to rebuild the export in a throwaway folder
  > A prototype answers a design question. This is a possible defect, not a design choice.
```

```test scenario-quick-question
You ask: "Why might a row of buttons overflow on small screens?" You want a quick explanation, but the agent starts setting up a reproduction harness. What do you reply?
- [ ] "Carry on; the loop will make the answer more accurate."
  > For a general question with no specific bug, a full diagnosis is slow overhead. The Skill is built for hard, specific defects.
- [ ] Type `/clear`, then ask the same question again.
  > The same words can trigger it again, because it's model-invoked. Say what you want instead.
- [ ] Turn on plan mode so it can't build anything.
  > That blocks edits but doesn't make it answer directly. Just tell it what you want.
- [x] "Just answer the question; don't diagnose."
  > Right. It's model-invoked and sometimes fires on plain questions. Saying what you want is the documented workaround.
```

```test scenario-human-click
Reproducing a bug needs a person to sign in to a test dashboard, click Refund and read the message that appears. The agent can't do that part. What does the Skill have it do?
- [x] Write a script that prompts you step by step and reads back your answers
  > Right. That's the last-resort human-in-the-loop script. Signing in stays a step you do; only what you observe gets captured.
- [ ] Ask you to paste your password into the chat so it can sign in by itself
  > Never. Sign-in stays a step you do yourself, because captured answers are printed back where the agent reads them.
- [ ] Skip Phase 1 and form hypotheses by reading the refund code instead
  > No red-capable command, no Phase 2. A human-driven script still counts as a loop; reading code for a theory doesn't.
- [ ] Log everything in the refund code and ask you to send all the output
  > The Skill rules out logging everything. Probes come later, each tied to one prediction.
```

```test scenario-after-fix
The fix is in: the regression test passes, the debug logs are gone, and the commit names the right hypothesis. You want to stop this kind of bug happening again. What do you type next?
- [ ] `/clear`, then `/retro`, so the review starts with a clean slate
  > `/retro` reviews the current session by default. Clearing first empties the conversation it should read, so run it before `/clear`.
- [ ] `/diagnosing-bugs` again, to double-check the fix
  > Phase 6 already reran the original loop and the bug no longer reproduces. Running it again won't make the next bug less likely.
- [x] `/retro`, in this same session
  > Right. It reads what just happened and suggests changes, like a new automated check, that would have prevented or caught it.
- [ ] Nothing; the Skill runs `/retro` for you at the end
  > `/retro` is user-invoked, so no Skill can start it. You type it.
```

```test spot-fake-loop
Asked to debug "search results show oldest first instead of newest first", the agent reports: "Phase 1 done. My loop is `npm test`, and it passes." What's wrong?
- [ ] `npm test` is too slow to count as a tight loop.
  > Speed isn't the problem here. Even a fast command fails the gate if it can't catch this bug.
- [ ] Agents may not use an existing test suite as their loop.
  > A failing test is the Skill's first choice of loop. The problem is that this one passes while the bug is there.
- [x] A command that passes while the bug exists can't go red on it.
  > Right. The loop must check your exact symptom (newest first) and be red now. A passing suite proves nothing about this bug.
- [ ] It should have shown ranked hypotheses before choosing any loop.
  > Hypotheses come after the loop. Phase 1 has to finish first.
```

```test spot-theory-first
A report says "the dashboard total is wrong after midnight". The agent opens four files, then writes: "I think it's a timezone bug in the date helper. I'll add some logs to confirm." It hasn't run anything yet. Spot the mistake.
- [x] It's theorising before it has a command that goes red.
  > Right. Reading code to build a theory before the loop exists is the exact failure the Skill blocks. First, a command that shows the wrong total.
- [ ] It should add logs everywhere instead of in one helper.
  > Logging everything is ruled out. And the real problem comes before any logging.
- [ ] One hypothesis is fine as long as it has a prediction.
  > The Skill wants 3–5 ranked ones, and even those only come after a red loop and a minimised repro.
- [ ] Timezone bugs can't be caught with a feedback loop at all.
  > They can: pin the clock to just after midnight and check the total. Pinning time is one way to make a loop deterministic.
```

```test spot-shallow-seam
A cart total goes wrong only when two browser tabs update the same cart at once. The agent fixes it, adds a unit test that calls the update function once from a single caller, and declares the bug locked down. Spot the mistake.
- [ ] Unit tests never count as regression tests.
  > A unit test is fine when it can recreate the real bug pattern. This one can't.
- [x] One caller can't recreate the bug, so it guards nothing.
  > Right. That seam is too shallow. With no correct seam, the agent should record the missing seam as a finding, not ship false confidence.
- [ ] It should have skipped the regression test and only fixed it.
  > Locking the bug down matters. The problem is where this test sits, not that there is one.
- [ ] The test needed a `[DEBUG-…]` tag so cleanup could find it.
  > Tags are for temporary debug logs. A regression test stays in the code for good.
```

```test sequence-phases
A teammate asks what order the agent works through a hard bug with `/diagnosing-bugs`. Which order is right?
- [ ] Hypothesise → build a loop → instrument → minimise → fix + regression test → cleanup
  > Hypotheses before a loop is the exact failure the Skill exists to stop.
- [ ] Build a loop → hypothesise → reproduce + minimise → fix + regression test → instrument → cleanup
  > Minimising comes before hypotheses, to shrink the suspects, and probing comes before the fix.
- [x] Build a loop → reproduce + minimise → hypothesise → instrument → fix + regression test → cleanup
  > Right. Loop, shrink, guess with predictions, probe one prediction at a time, fix with a regression test, clean up.
- [ ] Reproduce + minimise → fix + regression test → build a loop → hypothesise → instrument → cleanup
  > The loop comes first: you can't reproduce, minimise or fix against something you can't see go red.
```

```test predict-good-hypothesis
Diagnosing "invoices show yesterday's date for customers in Sydney", which hypothesis is in a shape the Skill accepts?
- [ ] "Something is off with how dates are handled somewhere in this app."
  > That's a vibe: it predicts nothing you could check. Sharpen it or drop it.
- [ ] "The date code is messy and should probably be rewritten from scratch."
  > An opinion about the code, not a cause with a prediction. No single change could prove it wrong.
- [ ] "It's definitely the timezone, so I'll go ahead and fix that right now."
  > One untested guess. The Skill wants 3–5 ranked hypotheses, tested before any fix.
- [x] "If the server's UTC clock is the cause, using Sydney time fixes it."
  > Right. It names a cause and a change that should make the bug disappear, so one experiment can rule it in or out.
```

```test scenario-flaky
An upload fails about once in every 100 tries, and never while you're watching. What does the Skill tell the agent to aim for first?
- [ ] A clean repro that fails on every single run
  > For flaky bugs the Skill says a clean repro isn't the goal. A high enough failure rate is.
- [x] A higher failure rate: repeat it, run it in parallel, add stress
  > Right. Loop the trigger, parallelise, add load or delays until it fails often enough to debug: half the time is workable, one in a hundred isn't.
- [ ] Reading the upload code until the cause becomes clear on its own
  > A theory before a loop is the failure the Skill exists to stop.
- [ ] Marking it as unreproducible and moving on to other work
  > It's reproducible, just rarely. The job is to raise that rate.
```

```sources
- [diagnosing-bugs SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/diagnosing-bugs/SKILL.md) and its [hitl-loop.template.sh](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/diagnosing-bugs/scripts/hitl-loop.template.sh): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the "Something's broken" on-ramp, `/retro` after the fix): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [retro SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) ("#3: The Code Doesn't Work") and [CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (1.0.0 rename from `diagnose`, 1.2.3 redaction, 1.3.1 `/retro` routing): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /diagnosing-bugs Skill](https://www.aihero.dev/skills-diagnosing-bugs), AI Hero docs, read 2026-10-23 (its notes on redaction and issue #124 predate 1.2.3 and October 2026).
- [Burn through the backlog from hell with /triage](https://www.youtube.com/watch?v=MzWIIlx0Gpc), Matt Pocock, 2026-05-07 (diagnosing inside a triage session 5:02–5:27, context budget 5:29–5:43, the loop and the TDD comparison 6:57–7:23, two sessions 7:38–7:49, auto mode and push 7:51–8:07).
- [/handoff is my new favourite skill](https://www.youtube.com/watch?v=dtAJ2dOd3ko), Matt Pocock, 2026-05-21 (compacting during long debugging 4:21–4:43).
- [Software Fundamentals Matter More Than Ever](https://www.youtube.com/watch?v=v4F1gFy-hqg), Matt Pocock at AI Engineer, 2026-04-23 (agents and feedback loops 9:59–11:09).
- GitHub issues on mattpocock/skills: [#578 over-firing on quick questions](https://github.com/mattpocock/skills/issues/578), opened 2026-07-15; [#1205 jumping from CI logs to a theory](https://github.com/mattpocock/skills/issues/1205), opened 2026-10-07; [#674 sensitive evidence](https://github.com/mattpocock/skills/issues/674), 2026-07-27 to 2026-10-06; [#955 a red from a no-op edit](https://github.com/mattpocock/skills/issues/955), 2026-08-25 to 2026-10-07; [#124 a pause before the fix](https://github.com/mattpocock/skills/issues/124), closed as not planned 2026-10-06.
- [Issue 03: Lesson pages](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/.scratch/lesson-site/issues/03-lesson-pages.md), this site's repo, 2026-10-21 (the `/learn/nope` status note); live and local checks of that URL, 2026-10-23.
```
