---
title: Diagnosing bugs
slug: diagnosing-bugs
order: 13
part: 3
---

When something breaks, make the agent prove it can see the bug before it's allowed to guess why.

```goals
- You'll be able to explain why an agent that guesses at a bug's cause wastes your time, and what makes a feedback loop tight.
- You'll be able to put the Skill's six phases in order and say what has to be true before each next one starts.
- You'll be able to steer a `/diagnosing-bugs` session: give the exact symptom, and hand over steps only you can do.
- You'll be able to decide when to reach for `/diagnosing-bugs` instead of `/triage` or a plain question, and what to type once the fix is in.
```

## Why it matters

You tell Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) that a comment from a Visitor (anyone reading this site) wouldn't post. It opens the comments code, spots something suspicious, changes it, runs the tests (small programs that check the code works), sees them pass and reports: fixed. Was it? The tests passed before the change too. Nothing ever showed the bug happening, so nothing can show it's gone.

That's the default: given a bug report, a coding agent reads code and guesses, and sounds certain. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, sums up the problem with a line his README (the front page of his Skills' repository: the project folder holding them, shared online) borrows from *The Pragmatic Programmer*: "The rate of feedback is your speed limit." In an April 2026 talk he added that agents have feedback (type checks, tests, a browser) but, unlike a veteran developer, do far too much before checking.

A Skill is a short instruction file the agent loads when you type its name, or when a task matches its description. ([Skills](/learn/skills) covers installing Matt's.) `/diagnosing-bugs` packages the veteran's habit: ==no theory until something goes red== (red means failing, as test tools colour it; green means passing). It's for the hard bugs: one that resists a first look, comes and goes, or crept in between two versions that worked. It's slow on purpose.

It's a model-invoked Skill. Besides typing `/diagnosing-bugs` yourself, the agent can start it on its own when you say "diagnose" or "debug this", or report that something is broken, throwing an error, failing or slow. It needs no setup.

## The idea: a loop that goes red

A ==feedback loop== is a command that runs the code where the bug lives and gives a pass-or-fail verdict. Building one is the Skill's whole first step, and everything later just uses it. Its SKILL.md (the instruction file) puts it bluntly: "Build the right feedback loop, and the bug is 90% fixed."

A loop only counts when it's **tight**, which means four things:

- **Red-capable.** It drives the real code and checks *your exact symptom*, so it's red now and turns green once the bug is fixed. A loop that only checks the build passes, or that nothing crashed, can't catch this bug.
- **Deterministic.** The same verdict on every run; for a bug that comes and goes, a steady, high failure rate (see below).
- **Fast.** Seconds, not minutes. A slow loop that flips at random is barely better than none.
- **Agent-runnable.** The agent can run it alone; a person joins only through a special script.

The agent must show it: one named command it has already run, with its output. Until then it may form no theory, and if it catches itself reading code to guess the cause, it must stop.

**Secrets come first.** Before it shows any command, output or artifact, it writes `<REDACTED>` over secrets, keeps credentials in environment variables (settings the shell holds, so they never appear in the command itself) and quotes only the lines that matter.

**Ways to build a loop,** roughly in the order it tries them:

1. A failing test at a seam: a place where a test can plug in and drive the real code.
2. A curl script (curl sends web requests from the terminal) against the dev server, your site running on your machine.
3. A command on a sample input, its output compared with a known-good copy.
4. A script driving a hidden browser through the page.
5. A saved real request, replayed.
6. A throwaway harness: a tiny slice of the system, the rest faked.
7. A fuzz loop: a thousand random inputs.
8. A script Git (the tool that tracks your code's history) runs over old saved snapshots to find where it broke.
9. One input through the old and new versions, compared.
10. Last resort: a human-in-the-loop script, when a person has to click.

**Bugs that come and go.** The goal is a higher reproduction rate, not a perfect repro (a reliable way to make the bug happen): repeat the trigger a hundred times, run copies in parallel, add load or delays. Failing half the time is debuggable; one in a hundred isn't yet.

**When nothing will go red,** the agent stops, lists what it tried, and asks you for one of three things: access to wherever the bug happens, a redacted captured artifact (a log, or a HAR file: a browser's recording of its network traffic), or permission to add temporary logging (lines the code prints as it runs) to the live system. It doesn't move on to theories.

```callout big-idea
Without a red command, everything after it is guessing. With one, finding the cause becomes mechanical: change one thing, run the loop, read the verdict.
```

```checkpoint no-loop-stop
A bug only happens on one customer's laptop, which the agent can't reach. It has tried a failing test, a curl script and a replayed request, and nothing goes red. What should it do now?
- [ ] Form its best theory from the code and fix that.
  > That's exactly what the Skill forbids: no red-capable command, no theories.
- [ ] Close the bug as "can't reproduce".
  > Giving up isn't on the list either. It should ask you for what it needs.
- [x] Stop, say what it tried, and ask you for access or a log.
  > Right. It asks for access to the environment, a redacted captured artifact such as a log, or permission to add temporary logging.
- [ ] Add logging to every function and wait for the bug to recur.
  > Logging everything is ruled out, and logging on a live system needs your permission first.
```

## The six phases, gate by gate

The Skill works in six phases, its own name for its steps. (Elsewhere in this course, a Phase is a chunk of work inside one session: one Claude Code conversation.) Each phase sits behind a gate: the next can't start until something specific is true. It may skip one only with a stated reason.

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
# Phase 3 shows you 3–5 ranked hypotheses (guesses at the cause), each with a prediction, before testing any.
at: hyp
# Phase 4 runs probes (small experiments, like a temporary log line), one prediction at a time, each log tagged so cleanup can find it.
at: probe
# Phase 5 first writes a regression test (one that fails if this bug ever returns) at a correct seam, or records that none exists.
at: fix
# Phase 6: the repro is gone, the tags are gone, and the commit names the right hypothesis.
at: clean
```

1. **Build a feedback loop.** Gate: one command, already run and shown, that's red on your symptom.
2. **Reproduce and minimise.** It confirms the loop shows the failure *you* described, not one nearby (wrong bug, wrong fix), on repeated runs, and records the exact symptom. Then it cuts inputs, settings, data and steps one at a time, rerunning after each cut. Gate: ==every remaining piece is load-bearing==, so removing any one turns the loop green. A small repro leaves fewer suspects, and it becomes the regression test later.
3. **Hypothesise.** Three to five ranked guesses at the cause, before testing any; a single guess tends to lock onto the first plausible idea. Each must be falsifiable (able to be proved wrong) by stating a prediction: a change that should make the bug vanish, or one that should make it worse, if the guess is right. A guess with no prediction is a vibe: sharpen it or drop it. It shows you the list before testing, the one point in a normal run where it invites your input, but it never waits: it carries on with its own ranking.
4. **Instrument.** Probes (small, temporary ways to watch the code run) each test one prediction, changing one thing at a time. A debugger (a tool that pauses running code so you can look inside) comes first, then targeted logs where the hypotheses disagree, never logging everything and searching the pile. Every debug log gets a unique tag like `[DEBUG-a4f2]`, so one search finds them all at cleanup. For something slow, it measures a baseline first, then narrows down.
5. **Fix and regression test.** A regression test fails if this bug ever comes back. It's written before the fix, but only at a correct seam: one where a test recreates the bug the way it really happens. If the only seam is too shallow (a test calling the code from one place when the bug needs two at once, say), a test there gives false confidence, so ==a missing seam is itself the finding==, and the agent records it. Otherwise: turn the minimised repro into a failing test, watch it fail, fix, watch it pass, rerun the original loop. If it forced a failure by editing code or test data, it first checks that the edit really landed.
6. **Cleanup.** Before declaring done: the original repro no longer reproduces; the regression test passes, or the missing seam is written down; a search for `[DEBUG-` finds nothing; throwaway code is gone; and the commit message (the note saved with a change) says which hypothesis was right.

```checkpoint minimise-cut
A loop for "the CSV export drops the last row" goes red with a 2,000-row file, three settings switched on and an admin account. The agent switches off one setting and reruns: still red. What does that tell it?
- [x] That setting isn't needed for the bug, so it stays out.
  > Right. Cut one thing at a time and keep only what the failure needs. Fewer moving parts means fewer suspects in Phase 3.
- [ ] Every detail of the original report matters, so put it back.
  > Minimising exists to find out which details matter. One that leaves the loop red doesn't.
- [ ] The repro is red, so minimising is finished.
  > It's done only when removing any remaining piece turns the loop green.
- [ ] That setting must be the cause, because nothing changed.
  > The opposite: the bug still happens without it, so this failure doesn't need it at all.
```

## A session, step by step

Imagine someone reports that a comment box like this site's refused their comment with "Name must be 50 characters or fewer", though their name was 26 flower emoji. Below, 400 is the web's code for a refused request, 201 means created, and `repro.sh` is a small script of terminal commands. A real session prints far more.

```scene chat
title: Diagnosing a refused comment (illustrative)
# You type the Skill, the exact symptom, and one request about pausing.
you: `/diagnosing-bugs` A reader's comment was refused: "Name must be 50 characters or fewer". The name was 26 🌸 emoji. Expected: it posts. Show me the root cause before you fix anything.
# Phase 1: before any theory, one command it has already run, red on your symptom.
agent: Loop: `bash repro.sh` posts a comment with that name to the dev server. Output: `400 Name must be 50 characters or fewer.` That's red, and it's your symptom. Same result every run, under a second.
# Phase 2: it confirms the failure, then shrinks it until every piece matters.
agent: Minimised: any page, a one-letter comment and a name of 26 🌸 still go red. 25 🌸 go green, and so do 26 plain letters. The count and the emoji both matter.
# Phase 3: ranked hypotheses, each with a prediction. It shows you the list, then carries on without waiting.
agent: 1. The length check counts each emoji as two. *Prediction:* counting characters instead makes 26 🌸 pass. 2. Invisible characters get added on the way in. *Prediction:* stripping them on arrival makes it pass. 3. The check measures display width, where an emoji takes the space of two letters. *Prediction:* other wide characters make it worse: 26 "漢" (also two letters wide) get refused too. Testing in this order; say if you want to re-rank.
# Phase 4: one tagged probe per prediction. Then it pauses before the fix, as you asked.
agent: `[DEBUG-7c1e] length=52 characters=26`: the name arrives intact, with nothing to strip (rules out 2). 26 "漢" post fine (rules out 3). JavaScript's `.length` counts each 🌸 as two, so the check compares 52 with 50 (confirms 1). Shall I fix it?
# Phase 5: a regression test at the API (the address the comment box sends to), red before the fix, green after.
you: Yes, fix it.
agent: Added an API test that posts 26 🌸: watched it fail, changed the check to count characters, watched it pass. Reran `bash repro.sh`: `201`.
# Phase 6: cleanup, and a commit message that names the right hypothesis.
agent: A search for `[DEBUG-` finds nothing, and `repro.sh` is deleted. Commit: "Count name length in characters so emoji count once (hypothesis 1)".
```

You did two things: gave the exact symptom, and asked for the one pause you wanted. The agent showed its ranking and went straight on, because the Skill never waits there. To change the order, type while it works: Claude Code queues your message and hands it over as soon as the current step finishes.

```checkpoint rerank
Diagnosing "gift cards are charged twice", the agent shows four ranked hypotheses. Its top one blames the payment provider's test sandbox (its practice mode), but you've seen the double charge on real orders too. What's the best move?
- [ ] Say nothing; the probes will rule it out soon enough.
  > They might, but each probe costs time. The list comes to you so one line of what you know can save several.
- [ ] Tell it to skip the probes and fix number 2 now.
  > Ruling one out doesn't prove another right. Number 2's prediction still needs testing.
- [ ] Ask it to start over with a fresh set of hypotheses.
  > The other three are still live. Re-ranking keeps them; starting over throws that work away.
- [x] Reply at once with what you've seen, so it re-ranks.
  > Right. What you know sinks number 1 before a probe is spent. It won't wait for you, so say it straight away.
```

## Steering it, and when to reach for it

- **Describe the symptom exactly:** what you did, what you saw, what you expected. "Prints 41.50, should print 46.50" gives the loop something to check; "the total's broken" doesn't.
- **Hand over what only you know,** as soon as the list appears. Re-rank it in one line: "we changed #3 yesterday" or "I've ruled out #1".
- **Ask for the pauses you want, up front:** "stop after the hypotheses" or "show me the root cause before you fix it". It has no pause of its own before the fix, and the repro and probes still come first.
- **Keep secrets out of what you paste.** The Skill redacts what it shows; what you paste is yours to strip.
- **Do the human-only steps through its script.** If a person must sign in, click or read a screen, the agent fills in its template, `hitl-loop.template.sh`: a bash script (a file of terminal commands) of steps ("Sign in, then press Enter") and questions ("Did the error appear? y/n") whose answers come back as `KEY=VALUE` lines. Signing in stays a step, never a captured answer, since answers are shown to the agent. If the agent runs it, it stops at the first prompt: nobody can type into the agent's terminal. So ask for the script's full path and run it yourself in a second terminal window (on Windows, Git Bash from the Start menu: PowerShell can't run bash scripts): type `bash`, a space and that path, then paste the `KEY=VALUE` lines back.

| Your situation | Reach for |
|---|---|
| A specific defect you can describe as a symptom | `/diagnosing-bugs` |
| Something got slow, with a known before and after | `/diagnosing-bugs` |
| A raw bug report from someone else, not yet confirmed | `/triage` first (Matt's Skill for sorting other people's reports and checking they're real); see [Triage](/learn/triage) |
| "Where are the slow parts of this codebase?" | No Skill does this: `/diagnosing-bugs` chases one known failure; it doesn't audit |
| A design question rather than a defect | `/prototype`; see [Prototype](/learn/prototype) |
| New behaviour you're building test-first | `/tdd` (test-driven development: a failing test first, then the code); see [TDD](/learn/tdd) |
| A quick question you want answered now | Ask, and say you want a plain answer, not a diagnosis |

```checkpoint pause-first
You want to approve the agent's diagnosis before it starts fixing the bug. How do you get that pause?
- [ ] Nothing to do: it always waits for approval before the fix.
  > It doesn't. Only the hypothesis list is shown to you, and even that doesn't block.
- [x] Say so when you start: "check with me before fixing".
  > Right. The Skill has no pause before the fix, so say you want one when you invoke it.
- [ ] Choose No when it first asks permission to edit a file.
  > New sessions start in auto mode, where the agent stops asking for each step, so it may not ask at all. And its first edits are for the loop and probes, not the fix: saying No there stalls the diagnosis.
- [ ] Watch closely and press Esc, which stops it, when the fix starts.
  > By then it's already fixing, and you never got to approve the diagnosis.
```

## After the fix

Once the fix is in, `/ask-matt` (Matt's Skill that routes you to the right Skill) says to type `/retro` in the same session. A retro (retrospective) reads that session and suggests changes to the agent's surroundings, most severe first, such as a check that would have caught the bug or a new rule for the agent that reviews code.

`/retro` is user-invoked: only you can start it, and `/diagnosing-bugs` never calls it. Type it before `/clear`, the Built-in command (one that comes with Claude Code) that empties the conversation; afterwards you'd have to point it at the old session's log. See [Retro](/learn/retro).

If the finding was a missing seam, the next step is `/improve-codebase-architecture`, which surveys a codebase for places worth reshaping; it's user-invoked too ([Architecture](/learn/architecture)).

## How Matt and others use it

**Matt** has no video about this Skill alone, but he used it, under its old name `diagnose`, in his May 2026 triage walkthrough:

- He was sorting bug reports with `/triage` when the agent took a reporter's analysis on trust, so he told it to diagnose the bug itself, in the same session.
- First he checked his context (the agent's working memory for the conversation, measured in tokens: small chunks of text). He'd budgeted about 100k tokens for that session and was at 46.5k, so there was room.
- The loop was a unit test (a small test of one piece of code) checking that generated text had no unresolved task ID. Matt noted it works like his `/tdd` Skill: loop and regression test first, then the fix inside the loop.
- Asked to approve a command, he said yes, switched to auto mode (where the agent stops asking for each step) and had it push the fix (upload the commit to GitHub) and close the issue (the bug report filed there).
- In a May 2026 video he called `/compact` (the Built-in command that swaps the conversation for a summary) handy for long debugging: compact what you've tried, keep going, repeat.

**Other developers** report its problems on its issue tracker (the list of bug reports and requests on its GitHub page):

- In July 2026, people running it on a non-Claude model, GPT-5.6-Sol, reported that it fires on plain questions and builds mock repros before answering. The AI Hero docs page suggests saying what you want: "just answer this, don't diagnose".
- In October 2026, a user saw an agent load the whole Skill and still jump from CI logs (the output of checks that run on every push) straight to a theory. The gate is written guidance, not a lock; you're the one who notices.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). You'll plant a bug, make the agent forget it, then diagnose it.

1. Make an empty folder and start Claude Code in it. Choose Yes if it asks whether you trust this folder, and whenever it asks to create, edit or run something there. Press Esc to stop it at any point.

```sh
mkdir bug-practice
cd bug-practice
claude
```

2. Type a slash and the word diagnosing. If `diagnosing-bugs` is in the list that pops up, delete what you typed. If not, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box, press Shift+Tab until it changes: plan mode stops the agent writing files.
4. Plant the bug:

```text
Make this folder a git repository (if Git has no name and email, set placeholder ones for this folder). Write a tiny script that reads cart.json and prints the order total: in Node or Python if either is installed here, otherwise in bash. Plant one realistic, subtle bug that makes the total wrong for some carts, and commit it with a neutral message. Don't tell me the cause and leave no hints in comments. Don't save anything about this to memory. At the end, tell me only the command to run, the wrong output it prints, and the correct output.
```

5. Copy the command and both outputs somewhere, then type `/clear` so the agent forgets what it planted. Memory notes would survive `/clear`, which is why step 4 asks for none.
6. Start the diagnosis. Replace each `<…>`, brackets included, with what step 4 told you:

```text
/diagnosing-bugs Running <command> prints <wrong output>, but it should print <correct output>. Stop after you show me your ranked hypotheses.
```

7. It stops after the hypotheses, as you asked. Read them and reply "Go with your ranking."
8. Let it fix the bug. Then type `/retro` and read its suggestions (you needn't accept any). Type `/exit` when you're done.

**It's working if:**

- [ ] Before any theory, it showed a command it had already run, with output matching your symptom.
- [ ] It shrank the repro and could say why each piece left is needed.
- [ ] It showed 3–5 ranked hypotheses, each with a prediction, before testing any.
- [ ] Debug logs carried a tag like `[DEBUG-xxxx]`, and none were left.
- [ ] A regression test failed before the fix and passed after, or it said no correct seam exists.
- [ ] Its commit message or final summary names the right hypothesis.

If a theory arrives before any command output, reply "Show me the red command first."

**Bonus: a real report from this site.** Its repository records a known quirk in [the ticket that built Lesson pages](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/.scratch/lesson-site/issues/03-lesson-pages.md) (a note describing that piece of work) and [the change that closed it](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/2): `/learn/nope`, a Lesson that doesn't exist, showed the not-found page but answered with HTTP status 200 ("OK"), not 404 ("not found"). It was accepted for v1, with no fix recorded since; the loop will tell you if it still happens. With Git and Node.js 24 (the version its README asks for), run these one at a time and choose Yes at the trust prompt:

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped.git
cd idea-to-shipped
npm install
claude
```

On Windows, if PowerShell says npm.ps1 cannot be loaded, type `npm.cmd install` instead.

```text
/diagnosing-bugs This repo's Lesson-pages ticket says http://localhost:3000/learn/nope shows the not-found page with status 200 instead of 404. Start the dev server yourself and check. Don't change any code.
```

It's working if it shows the command it ran, with output, before any theory; if nothing goes red or something blocks it (such as the README's database settings), it should say so and ask.
````

## Common mistakes

- **Taking a green run as proof.** If it passed before the fix, it can't prove the fix.
- **A vague symptom, or a theory first.** Give what you did, saw and expected, and ask for the red command.
- **A regression test that can't recreate the bug.** A recorded missing seam beats false confidence.

```site-story
I never typed `/diagnosing-bugs` while building v1 of this site; v1 didn't need the full Skill. Things still broke, and the agent and I fixed them. Nothing in my notes shows the Skill's gates at work (a red command first, ranked hypotheses, tagged logs), so read these as everyday debugging, not Skill runs.

| Symptom | What the evidence showed | Fix |
|---|---|---|
| My setup wizard (a question-and-answer script) raced through every question | I'd run it from the Claude chat with `!` (its prefix for shell commands), which can't press Enter | Ran it in a real terminal |
| The build failed: "uncached data during prerendering" | Next.js 16, the framework the site is built on, wants file reads marked as cacheable | Added `"use cache"` |
| `/learn/nope` showed the not-found page but returned status 200, not 404 | The page streams, so the status goes out before "not found" is known | Wrote it down and accepted it for v1 |
| A wait loop never finished | It was reading the wrong output stream | Fixed the command |
| A comment from a preview copy of the site seemed to appear on the real one | Two *different* comments looked alike | Checked both copies' databases: they were separate |

The lesson I took: look at the evidence (the logs, the actual database rows) before deciding what's wrong. The last one wasn't a bug at all.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Something's broken | `/diagnosing-bugs` plus what you did, saw and expected |
| Before any theory | One command, already run, red on your symptom |
| Nothing goes red | It stops and asks; no theories |
| The ranked list arrives | Re-rank at once; it won't wait unless asked |
| You want to approve the cause | Ask for that pause when you start |
| A person must click | Its human-in-the-loop script; signing in stays a step |
| The fix is in | `/retro` in the same session, before `/clear` |
| No correct seam | `/improve-codebase-architecture` |
| You just want an answer | Tell it to just answer, not diagnose |

## Final test

```test scenario-raw-report
A stranger opens an issue on your open-source project: "Export is broken, please fix." There are no steps and no error text, and you haven't confirmed it. Which Skill do you start with?
- [ ] `/diagnosing-bugs`, so the agent builds a loop right away
  > It needs a symptom it can make go red. A vague, unconfirmed report from someone else should be checked and written up first.
- [x] `/triage`, to label it and choose its next step
  > Right. Raw reports from other people go through `/triage` first; it does a light version of reproducing and confirming.
- [ ] `/tdd`, to write tests for the export feature first
  > `/tdd` builds planned behaviour test-first. You don't yet know what's wrong, or whether anything is.
- [ ] `/prototype`, to rebuild the export in a throwaway folder
  > A prototype answers a design question. This is a possible defect, not a design choice.
```

```test scenario-quick-question
You ask: "Why might a row of buttons overflow on small screens?" You'd like a two-line answer, but the agent starts setting up a reproduction harness. What's your best move?
- [ ] Let it carry on; the loop will make the answer more accurate.
  > For a general question with no specific bug, a full diagnosis is slow overhead. The Skill is built for hard, specific defects.
- [ ] Type `/clear`, then ask the same question again.
  > The same words can trigger it again, because it's model-invoked. Say what you want instead.
- [ ] Turn on plan mode so it can't build anything.
  > That blocks edits but doesn't make it answer directly. Just tell it what you want.
- [x] Press Esc, then say you only want an explanation.
  > Right. It's model-invoked and sometimes fires on plain questions. Saying plainly what you want is the documented workaround.
```

```test scenario-human-click
Reproducing a bug needs a person to sign in to a test dashboard with a code texted to their phone, click Refund and read the message that appears. The agent can't do that part. What does the Skill have it do?
- [x] A script that prompts you step by step and reads back your answers
  > Right. That's the last-resort human-in-the-loop script. Signing in stays a step you do; only what you observe gets captured.
- [ ] A script whose first question asks for your password
  > No. Captured answers are printed back where the agent reads them, so signing in stays a step you do yourself; only what you observe gets captured.
- [ ] Skip Phase 1 and form hypotheses by reading the refund code instead
  > No red-capable command, no Phase 2. A human-driven script still counts as a loop; reading code for a theory doesn't.
- [ ] Log everything in the refund code and ask you to send all the output
  > The Skill rules out logging everything. Probes come later, each tied to one prediction.
```

```test scenario-after-fix
The fix is in: the regression test passes, the debug logs are gone, and the commit names the right hypothesis. You want to stop this kind of bug happening again. What do you type next?
- [ ] `/clear`, then `/retro`, so the review starts with a clean slate
  > `/retro` reviews the current session by default, and after `/clear` that's an empty one. Run it first; otherwise you'd have to point it at the old session's log.
- [ ] `/diagnosing-bugs` again, to double-check the fix
  > Phase 6 already reran the original loop and the bug no longer reproduces. Running it again won't make the next bug less likely.
- [x] `/retro` now, while this session is still open
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
A report says "the dashboard total is wrong after midnight". The agent opens four files, then shows four ranked hypotheses, each with a prediction. It hasn't run anything yet. Spot the mistake.
- [x] It's theorising before it has a command that goes red.
  > Right. Reading code to build theories before the loop exists is the exact failure the Skill blocks. First, a command that shows the wrong total.
- [ ] It should have read more files before ranking them.
  > More reading is still guessing. What's missing is a command that shows the wrong total.
- [ ] It should test them before showing you the list.
  > The list comes to you before testing. The real problem comes earlier: nothing has gone red yet.
- [ ] Time-of-day bugs can't be caught with a feedback loop at all.
  > They can: pin the clock to just after midnight and check the total. Pinning time is one way to make a loop deterministic.
```

```test spot-shallow-seam
A cart total goes wrong only when two browser tabs update the same cart at once. Before fixing it, the agent writes a unit test that calls the update function once, from a single caller, then fixes the bug and declares it locked down. Spot the mistake.
- [ ] Unit tests never count as regression tests.
  > A unit test is fine when it can recreate the real bug pattern. This one can't.
- [x] One caller can't recreate this bug, so it can't catch it.
  > Right. That seam is too shallow. With no correct seam, the agent should record the missing seam as a finding, not ship false confidence.
- [ ] It should have written its test after the fix, not before.
  > The Skill writes it before the fix so you can watch it fail. This one could never fail: one caller can't trigger the bug.
- [ ] The test needed a `[DEBUG-…]` tag so cleanup could find it.
  > Tags are for temporary debug logs. A regression test stays in the code for good.
```

```test spot-vague-symptom
On a recipe site, you type: "`/diagnosing-bugs` The servings scaler is broken. Show me the root cause before you fix anything." Spot the weakness in this request.
- [ ] It asks for a pause, and the Skill can't pause before the fix.
  > It can, when you ask up front like this. The Skill just has no pause of its own there.
- [x] "Broken" gives the loop no exact symptom to go red on.
  > Right. Say what you did, saw and expected ("6 servings shows 1 cup of flour, should be 3") so the loop can check that exact output.
- [ ] It should include your own hypotheses for the agent to test.
  > Writing 3–5 ranked hypotheses is the agent's job in Phase 3. Your part is to re-rank them with what you know.
- [ ] It names the Skill; saying "debug this" would work better.
  > Both start it, since it's model-invoked. Typing its name is the surest way.
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
- [ ] "If it's a timezone bug, Sydney invoices will show the wrong date."
  > It only restates the symptom you already see. A prediction names a change that should make the bug vanish or get worse.
- [ ] "It's definitely the timezone, so I'll go ahead and fix that right now."
  > Certainty isn't a prediction: it names no change that could prove it wrong, and it skips straight to the fix.
- [x] "If dates are in universal time (UTC), using Sydney time fixes them."
  > Right. It names a cause and a change that should make the bug disappear, so one experiment can rule it in or out.
```

```sources
- [diagnosing-bugs SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/diagnosing-bugs/SKILL.md) and its [hitl-loop.template.sh](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/diagnosing-bugs/scripts/hitl-loop.template.sh): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the "Something's broken" on-ramp, `/retro` after the fix, a session's log after clearing): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [retro SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) ("#3: The Code Doesn't Work") and [CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (1.0.0 rename from `diagnose`, 1.2.3 redaction, 1.3.1 `/retro` routing): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /diagnosing-bugs Skill](https://www.aihero.dev/skills-diagnosing-bugs), AI Hero docs, read 2026-10-23 (the "just answer this" workaround; its notes on redaction and issue #124 predate 1.2.3 and October 2026).
- [Burn through the backlog from hell with /triage](https://www.youtube.com/watch?v=MzWIIlx0Gpc), Matt Pocock, 2026-05-07 (diagnosing inside a triage session 5:02–5:27, context budget 5:29–5:43, the loop and the TDD comparison 6:57–7:23, auto mode and push 7:51–8:07).
- [/handoff is my new favourite skill](https://www.youtube.com/watch?v=dtAJ2dOd3ko), Matt Pocock, 2026-05-21 (compacting during long debugging 4:21–4:43).
- [Software Fundamentals Matter More Than Ever](https://www.youtube.com/watch?v=v4F1gFy-hqg), Matt Pocock at AI Engineer, 2026-04-23 (agents and feedback loops 9:59–11:09).
- GitHub issues on mattpocock/skills: [#578 over-firing on quick questions](https://github.com/mattpocock/skills/issues/578), opened 2026-07-15; [#1205 jumping from CI logs to a theory](https://github.com/mattpocock/skills/issues/1205), opened 2026-10-07; [#674 sensitive evidence](https://github.com/mattpocock/skills/issues/674), 2026-07-27 to 2026-10-06; [#955 a red from a no-op edit](https://github.com/mattpocock/skills/issues/955), 2026-08-25 to 2026-10-07; [#124 a pause before the fix](https://github.com/mattpocock/skills/issues/124), closed as not planned 2026-10-06.
- [Issue 03: Lesson pages](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/.scratch/lesson-site/issues/03-lesson-pages.md) and [PR #2](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/2), this site's repo, 2026-10-21 (the `/learn/nope` status note, accepted for v1).
```
