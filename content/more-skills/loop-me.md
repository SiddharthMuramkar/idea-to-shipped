---
title: loop-me: spec out a job you repeat
slug: loop-me
summary: How loop-me interviews you about a job you repeat until it's written down as a spec an agent could build, without building anything itself.
image: /images/lessons/loop-me.jpg
imageAlt: The iron clockwork of a church tower clock: rows of gears and wheels on a frame in a wooden tower room.
---

## What it's for

Say you label new [Issues](/learn/issues-and-keeping-track) on the yoga-studio repo by hand every morning. An agent could take that over, but the rules live in your head.

**loop-me interviews you about a job you repeat, and writes it down as a spec an agent could build.**

It's a [grilling](/learn/grilling) session whose only output is that spec: a Markdown file (plain text with light formatting), not a [Spec](/learn/to-spec) on your Issue tracker. To tell the two apart, this lesson calls it **loop-me's workflow spec**.

```checkpoint quick-1
You've finished a session about your morning labelling job. What do you have?
- [x] A spec in a Markdown file, and the job still not built.
- [ ] A new Spec on your Issue tracker, split into Tickets.
- [ ] A job already running each morning, with no spec file.
Why: The session's only output is the spec, and that spec is a Markdown file. It isn't a Spec on your Issue tracker, and nothing runs yet.
```

Once it knows your tools, one round might look like this:

```
You:   /loop-me labelling new Issues every morning

Agent: ❓ Q1 - Start: Should each new Issue start a run,
       not a set time?
       ➡️ Yes.

       ❓ Q2 - Asking: Should the agent label first, then ask
       you once?
       ➡️ Yes.

You:   Yes to both.

Agent: Updated workflows/label-new-issues.md. Next round...
```

That morning job is a **loop**: a recurring pattern in your life or work, such as your week, your morning or one repeated activity.

```checkpoint quick-2
Which of these is a loop?
- [x] The report you write by hand every Friday.
- [ ] The one talk you're giving next month.
- [ ] The one bug you fixed on your own last Tuesday.
Why: A loop is a recurring pattern in your life or work. A weekly report repeats. A single talk or a single bug doesn't.
```

## When to use it

- You keep doing the same job by hand, and you want to hand it off.
- You don't know what to hand off yet. Type `/loop-me` with nothing after it, and it looks for loops.

```checkpoint quick-3
You repeat plenty of work, but you can't say which job to hand off. How do you start?
- [x] Type `/loop-me` with nothing after it, and let it look.
- [ ] Pick a job first, since it needs one to start.
- [ ] Wait until you've spotted a job you repeat.
Why: You don't need a job in mind. Type `/loop-me` with nothing after it, and it looks for loops, including ones you haven't noticed.
```

## When not to use it

- If you want to sharpen a one-off plan outside a repo, use [grill-me](/learn/grill-me) instead, because it grills you and saves nothing.
- If you want the job running today, loop-me won't get you there. It writes the spec and stops. Building it and running it are a separate step.

```checkpoint quick-4
You want your morning labelling job running today. What will loop-me do for that?
- [x] Write the spec and stop, so building it comes later.
- [ ] Build the job at the end, once the spec is finished.
- [ ] Put the job on a schedule as soon as you confirm it.
Why: loop-me writes the spec and stops. Building it and running it are a separate step.
```

```diagram
type: chain
caption: "It writes the spec and stops."
steps:
  - "a job you repeat"
  - "a spec an agent could build"
  - "Building it"
  - "running it"
groups:
  - from: 1
    to: 2
    label: "loop-me"
  - from: 3
    to: 4
    label: "a separate step"
```

## What it needs to start

You need a folder: the current directory becomes its workspace. You install this [Skill](/learn/skills) on its own, as the Try it step shows.

Only you can start it, by typing `/loop-me`. The agent never starts it on its own.

loop-me keeps its notes on your world in a `NOTES.md` file in that folder. If that file is missing, empty or thin, it first interviews you about the tools you use and the channels you read, such as email.

```checkpoint quick-5
You start loop-me in a new, empty folder. What does it do first?
- [x] Interviews you about your tools and channels.
- [ ] Writes a starter spec for you to fill in.
- [ ] Reads your commit history to find loops.
Why: With NOTES.md empty, it knows nothing about your world yet. So it interviews you about your tools and channels before anything else.
```

## What it creates

- `workflows/*.md`: one spec per loop, and the source of truth.
- `NOTES.md`: raw notes on your tools, your channels and your own words for both.

**A spec is done when an implementer agent could build it without asking a single question.** Until then, the grilling goes on.

```checkpoint quick-6
Your spec looks tidy, but an agent building it would still ask which labels exist. Is it done?
- [x] No. An open question means the grilling goes on.
- [ ] Yes. It's done once the file has been saved.
- [ ] Yes. It's done once you've answered a round.
Why: A spec is done when an implementer agent could build it without asking a single question. One open question means it isn't done.
```

loop-me has four words, used only when a job calls for them:

- **Trigger**: what starts each run, a schedule or an event, such as a new Issue, as in Q1.
- **Checkpoint**: a point where you verify or decide.
- **Push right**: put the checkpoint as late as it will go, so you're asked once, late, with everything prepared, as in Q2.
- **Brief**: the short summary a checkpoint shows you.

```checkpoint quick-7
Your agent could ask about each label, or label everything and then ask once. Which is push right?
- [x] Label everything first, then ask you once.
- [ ] Ask you about each label as it comes up.
- [ ] Ask you once, before any label is chosen.
Why: Push right puts the checkpoint as late as it will go. You're asked once, late, with everything prepared.
```

They're never a checklist: a spec needs no AI, no checkpoint and no schedule unless the grilling shows it does.

```checkpoint quick-8
Your job has no human check and no schedule. Can a finished spec describe it?
- [x] Yes. A spec needs neither unless the grilling shows it.
- [ ] No. Every spec must name a checkpoint and a schedule.
- [ ] No. All four words must be filled in before it's done.
Why: The four words are never a checklist. A spec needs no AI, no checkpoint and no schedule unless the grilling shows it does.
```

## Going deeper

### Why it exists

A job you repeat is predictable, and predictable work is worth handing off. The work is spotting those jobs, then describing one well enough for an agent to build. Matt Pocock wrote the Skill, and his announcement shows the aim: "Interviews you about your work and finds opportunities for delegating your day-to-day work to AI".

So loop-me pictures your life as loops within loops, looks for the ones worth writing down, and grills you until each spec is finished.

Matt's post pitches handing work to AI, but the Skill's own text goes wider. A spec needs no AI unless the grilling shows it does. Some jobs use no AI at all.

Matt sorts his Skills into buckets. loop-me sits in his in-progress one, which he labels "Beta". Skills there get no docs pages, and they can change or disappear without warning. So check the current `SKILL.md` before you rely on this lesson. His plugin, a bundle of Skills you can install together, leaves them out, so you install this one on its own.

```checkpoint quick-9
You've come to rely on loop-me. What should you expect from a Skill in the in-progress bucket?
- [x] It can change or disappear without warning.
- [ ] It stays frozen until Matt retires it for good.
- [ ] It gets a new docs page with every change.
Why: Matt labels that bucket "Beta". Skills in it get no docs pages, and they can change or disappear without warning.
```

### How it works underneath

**A grilling with a narrow target.** loop-me uses the same rounds as [grilling](/learn/grilling): relentless, a round of questions at a time, with a recommended answer attached to each. What changes is the finish line. Plain grilling stops at a shared understanding. loop-me stops at a spec an implementer agent could build.

```checkpoint quick-10
How is loop-me's grilling different from plain grilling?
- [x] Same rounds, but it stops at a spec an agent could build.
- [ ] Same finish line, but it asks with no recommended answers.
- [ ] No rounds at all, because it writes the spec straight away.
Why: The rounds are the same. Plain grilling stops at a shared understanding. loop-me stops at a spec an implementer agent could build.
```

**Why it can take many sessions.** A spec may take more than one sitting. loop-me's files stay in the folder, and it creates, edits and deletes specs as the grilling settles things. So you run `/loop-me` again and carry on.

**A spec partway through.** For example, here's a made-up one, using all four words:

```
workflows/label-new-issues.md

Trigger:    a new Issue on the yoga-studio repo.
Push right: read the Issue and choose its labels first.
Checkpoint: you approve the labels before they're saved.
Brief:      the labels chosen, why, and a link to the Issue.
```

An implementer agent would still ask which labels exist, and what to do when none fits. So this spec isn't done, and the next round asks those questions.

```checkpoint quick-11
A builder would still ask which labels exist. What happens to that made-up spec?
- [x] It isn't done, so the next round asks that question.
- [ ] It's done, and the builder picks any labels it likes.
- [ ] It's done, because it already uses all four words.
Why: An open question means the spec isn't done, even with all four words in it. The next round asks that question.
```

**Why so late, and why so short.** Push right and the brief both protect your time. The agent does as much work as it can before it involves you. Then you read a brief, not a draft. The Skill gives its reason: "Speed of review is imperative."

**Three other things repeat work.** They're easy to mix up with loop-me. Only loop-me's whole job is writing a spec. The other three run something.

- **The Ralph loop.** This is Geoffrey Huntley's technique, and he created it. In its purest form it's a Bash loop that feeds the same prompt to an agent, again and again: `while :; do cat PROMPT.md | claude-code ; done`. Matt's guide puts it this way: "You run the same prompt repeatedly. The AI picks its own tasks from a PRD." A PRD is a product requirements document, a plan of what to build. A Ralph loop builds code. loop-me builds nothing.
- **Claude Code's `/loop`.** It re-runs a prompt on an interval inside your session, as in `/loop 5m check the deploy`. It's for quick polling during a session.
- **A cloud scheduled task.** This is a saved Claude Code configuration that runs in the cloud, so it keeps working when your laptop is closed. It suits work that is unattended, repeatable and tied to a clear outcome.

```checkpoint quick-12
You have a PRD, and you want an agent to keep picking tasks and building from it. Which fits?
- [x] A Ralph loop, which re-runs one prompt and builds code.
- [ ] loop-me, which grills you until the spec is finished.
- [ ] `/loop`, which is for quick polling during a session.
Why: In Matt's guide to a Ralph loop, you run the same prompt repeatedly, and the AI picks its own tasks from a PRD. loop-me builds nothing, and `/loop` is for quick polling.
```

```diagram
type: compare
caption: "Only loop-me's whole job is writing a spec."
columns: ["whole job is writing a spec", "run something"]
rows:
  - label: "loop-me"
    cells: ["yes", "no"]
  - label: "The Ralph loop"
    cells: ["no", "yes"]
  - label: "Claude Code's `/loop`"
    cells: ["no", "yes"]
  - label: "A cloud scheduled task"
    cells: ["no", "yes"]
```

A finished spec could describe a cloud scheduled task. Anthropic's Backlog maintenance example does similar work to the labelling job above. A schedule trigger runs every weeknight, and the task reads new issues and applies labels. Unlike that spec, it has no event trigger and no approval step.

### Where it goes wrong

**A cloud run shows no error, but the work isn't done.** A finished run whose row shows no Error or Cancelled counts as Succeeded. That only tells you the session ended without Claude Code reporting a failure. So open the run and read its transcript to see what happened.

```checkpoint quick-13
A cloud run of your job counts as Succeeded. How do you find out whether the work got done?
- [x] Open the run and read what its transcript shows.
- [ ] Nothing more, as Succeeded means it's done.
- [ ] See whether the next run counts as Succeeded too.
Why: Succeeded only tells you the session ended without Claude Code reporting a failure. The transcript shows what happened.
```

A spec can leave that question open. loop-me says when a spec is done, but not when one run is. Issue #657 proposed defining "the completion boundary for one **run**". Without it, the issue warned, a job can retry without end, or report success with nothing to check.

That issue was a proposal from reading the Skill, not a run that went wrong, and it was closed as not planned. So close the gap yourself: during the grilling, ask how one run proves it finished.

**You put loop-me on a `/loop` timer, and the interview never starts.** A scheduled `/loop` fire only runs Skills that Claude may start on its own. loop-me is marked `disable-model-invocation: true`, the setting that stops the agent starting it by itself. So it reaches Claude as plain text instead of running. The fix is to start it yourself. It's an interview, so it needs you there anyway.

```checkpoint quick-14
You put `/loop-me` on a `/loop` timer. What happens when the timer fires?
- [x] It arrives as plain text, and no interview starts.
- [ ] The interview starts, then waits for your next answer.
- [ ] Claude asks you to confirm, then starts the interview.
Why: A scheduled fire only runs Skills Claude may start on its own. loop-me is marked `disable-model-invocation: true`, so it arrives as plain text.
```

**A job you put on `/loop` stops after a week.** `/loop` tasks only fire while Claude Code is running and idle, and recurring ones expire 7 days after creation. So a job meant to run for months needs a cloud scheduled task, a scheduled task in Claude's desktop app (which runs on your machine) or [GitHub Actions](/learn/agents-in-github-actions), GitHub's built-in way to run work on its own machines. Staying on `/loop` means cancelling and recreating the task before it expires.

```checkpoint quick-15
A spec's job should run for months. Why not put it on Claude Code's `/loop`?
- [x] It fires only while Claude Code runs, and expires in 7 days.
- [ ] It fires even with Claude Code closed, so runs pile up.
- [ ] It never expires, so a forgotten job would run for ever.
Why: `/loop` tasks only fire while Claude Code is running and idle, and recurring ones expire after 7 days. So a job that lasts months needs something else.
```

### Try it

You'll need your practice project. If you haven't set it up, do the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. In the `yoga-studio` repo, make a folder and go into it: `mkdir loops && cd loops`.
2. Install the Skill there: `npx skills@latest add mattpocock/skills --skill loop-me`. If it asks which agent, choose Claude Code.
3. Start Claude Code: `claude`.
4. Type `/loop-me a weekly summary of new booking Issues`. You should see questions about your tools and channels first, since it knows nothing about your world yet.
5. Answer each round. Type "yes" to accept a recommended answer, or say what you'd change.
6. When the agent writes a file in `workflows/`, open it. You should see one spec for that job.
7. Read it as the builder would. Could an agent build it without asking a single question?
8. If not, run `/loop-me` again and answer what's still open. You should see the same file change.
9. Before you stop, ask it how one run proves it finished, the gap issue #657 pointed out.

Stop there. Don't build or schedule the job yet.

### Read more

- [New in-progress skill: /loop-me](https://x.com/mattpocockuk/status/2069729160600203595), Matt Pocock, 2026-06-24
- [The in-progress bucket README](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock, 2026-10-29
- [Ralph Wiggum as a "software engineer"](https://ghuntley.com/ralph/), Geoffrey Huntley, 2025-07-14
- [Getting Started With Ralph](https://www.aihero.dev/getting-started-with-ralph), Matt Pocock, updated 2026-01-08
- [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks), Anthropic
- [Automate work with scheduled tasks](https://code.claude.com/docs/en/routines), Anthropic
- [loop-me: define an observable run completion and failure boundary](https://github.com/mattpocock/skills/issues/657), qshanx, 2026-07-24

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint loop-me-deeper-succeeded-means
Your spec for nightly Issue labelling will become a cloud scheduled task. Before you build it, you go back and get grilled on how one run proves it finished, even though the spec already names its trigger. Why go back?
- [x] A run counted as Succeeded only means the session ended, reporting no failure.
- [ ] A cloud task can't start until its spec names how many times a run may retry.
  > The docs set no such rule. The risk is a run that looks fine but did nothing checkable.
- [ ] Cloud tasks run only on GitHub events, so a nightly trigger needs a second spec.
  > Cloud tasks can run on a schedule, such as nightly, as well as on API calls or GitHub events.
Why: Succeeded tells you how the session ended, not whether the work got done. Issue #657 warned that with no definition of when a run is finished, a job can report success with nothing to check. So you settle that question before you build.
```

## Remember

```flashcards
Q: What does loop-me create?
A: One spec per loop in `workflows/*.md`, plus notes on your world in `NOTES.md`.

Q: What does loop-me mean by a loop?
A: A recurring pattern in your life, such as your week, your morning or one repeated activity.

Q: In loop-me's words, what does "push right" mean?
A: Put the checkpoint as late as it will go, so you are asked once, late, with everything prepared.

Q: When do you use loop-me instead of grill-me?
A: When the thing to pin down is a job you repeat and you want a buildable spec saved. grill-me is for a one-off plan and saves nothing.

Q: In Geoffrey Huntley's words, what is the Ralph loop in its purest form?
A: A Bash loop that feeds the same prompt to the agent again and again: `while :; do cat PROMPT.md | claude-code ; done`.

Q: A cloud run of a job built from a loop-me spec counts as Succeeded. What does that prove?
A: Only that the session ended without Claude Code reporting a failure. Open the run and read its transcript to see whether the work was done.

Q: How long does a recurring `/loop` task keep running?
A: At most 7 days, and only while Claude Code is running and idle.

Q: Which of Matt's buckets is loop-me in, and what does that mean?
A: In-progress, his beta bucket. Its Skills get no docs pages and can change or disappear without warning.
```

## Final test

```final-test loop-me-what-it-creates
What does loop-me leave in its workspace when a session ends?
- [x] One spec per loop in `workflows/*.md`, plus notes on your world in `NOTES.md`.
- [ ] A `GLOSSARY.md` of the repo's terms, plus one ADR for each hard decision made.
- [ ] A scheduled task that runs the job, plus a log of every run in `NOTES.md`.
Why: loop-me's only output is specs, so each loop gets one file in `workflows/*.md`. What it learns about your tools, channels and words goes in `NOTES.md`. It builds nothing and schedules nothing, so no job runs yet.
```

```final-test loop-me-when-done
When is one of loop-me's workflow specs done?
- [x] When an implementer agent could build it without asking a single question.
- [ ] When it names a Trigger, a Checkpoint, a Push right and a Brief for the job.
- [ ] When you have answered one round of questions and the file has been saved.
Why: An open question would leave the builder guessing, so the grilling goes on until none remain. Naming the four words doesn't finish a spec, because they're used only when a job needs them. Answering one round and saving the file isn't the test either.
```

```final-test loop-me-who-starts-it
How does loop-me get started?
- [x] You type `/loop-me`; the agent never starts it on its own.
- [ ] The agent starts it whenever you mention a job you repeat.
- [ ] It starts each morning on a schedule it sets up itself.
Why: Only you can start loop-me, by typing its name. The agent won't begin it on its own, even when you mention a job you repeat. It's an interview, so it needs you there anyway.
```

```final-test loop-me-deeper-ralph-versus
How does a Ralph loop differ from loop-me?
- [x] A Ralph loop feeds one prompt to the agent again and again to build; loop-me builds nothing and writes specs.
- [ ] A Ralph loop interviews you to write specs of your jobs; loop-me feeds one prompt to the agent again and again.
- [ ] A Ralph loop runs only as a cloud scheduled task; loop-me runs only inside a `/loop` timer in your session.
Why: A Ralph loop is about building: a Bash loop runs the same prompt repeatedly, and in Matt's guide the AI picks its own tasks from a PRD. loop-me is about writing the job down: it interviews you, its only output is specs, and it builds nothing.
```

```final-test loop-me-deeper-run-boundary
Your loop-me spec is done. What gap in loop-me did issue #657 point out?
- [x] It says when a spec is done, but not how one run of the job proves it finished.
- [ ] It says how one run proves it finished, but not when the spec itself is done.
- [ ] It has no word for what fires each run, so specs leave the trigger unstated.
Why: loop-me's finish line is about the spec: an agent could build it. That says nothing about one run of the finished job, so a job could retry without end, or report success with nothing to check. Issue #657 was a proposal, not a failed run, and it was closed as not planned.
```

```final-test loop-me-morning-issues
Every morning you spend twenty minutes labelling new Issues on your yoga-studio repo. You want to hand that job off one day. First you want it written down so well that an agent could build it without asking you anything. Which fits best?
- [x] Get grilled into a written spec of the repeated job, saved in a workspace folder.
  > Right: that's `/loop-me`.
- [ ] Get grilled about the plan in a single session, with nothing saved once you're done.
  > That's `/grill-me`. It saves nothing, so no spec is left behind for an agent to build from.
- [ ] Get grilled about the plan while a GLOSSARY.md and ADRs are written in the repo.
  > That's `/grill-with-docs`. It leaves docs (ADRs and a glossary) about a plan, not a spec of a job you repeat that an agent could build.
Why: Two things decide it: the job repeats, and you want something saved that an agent could build from. loop-me grills you until the spec has no open question, and it stays in the folder. grill-me leaves nothing behind, and grill-with-docs records a plan's words and decisions, not a job.
```

```final-test loop-me-one-off-talk
You're giving one talk next month about how you built the yoga-studio site. There's no repo for the talk. You want an agent to question you hard until the outline is clear. Which fits best?
- [x] Get grilled about the talk's plan, with nothing saved.
  > Right: that's `/grill-me`.
- [ ] Get grilled into a spec of a job you repeat, saved in a workspace.
  > That's `/loop-me`. Its only output is specs of loops, jobs you repeat. A single talk is a one-off plan.
- [ ] Get grilled about the plan while a GLOSSARY.md and ADRs are written.
  > That's `/grill-with-docs`. There is no repo to keep a glossary or ADRs in.
Why: A single talk doesn't repeat, so it isn't a loop, and there's no repo to keep docs in. You want the interview and nothing else, which is what grill-me gives you: it saves nothing.
```

```final-test loop-me-why-keeps-asking
You started a session about your weekly class-schedule email. You think the job is obvious, but the agent keeps asking questions in rounds before it will call the spec finished. Why does it keep asking?
- [x] The spec isn't done until an agent could build it without asking a single question.
- [ ] It must fill a fixed template of Trigger, Checkpoint, Push right and Brief first.
  > Those words are used only when a spec calls for them, never as a checklist.
- [ ] It must set up a schedule for the email before it is allowed to stop.
  > It mandates no schedule. It writes the spec and leaves building it to later.
Why: The questions keep coming because a spec with an open question would leave its builder guessing. The agent isn't filling in a template or setting up a schedule: loop-me requires neither, and it stops at the spec.
```

```final-test loop-me-why-asks-about-tools
In a new, empty folder you run the Skill to spec a job you repeat. Instead of writing a spec, it first asks which tools you use, which channels you read and what you call things. Why does it ask that first?
- [x] Its notes file is empty, so it learns your world before it specifies anything.
- [ ] It is checking which Issue tracker your repo was set up with before it begins.
  > It asks about your world, the tools and channels you use, not a repo's setup.
- [ ] It needs your answers to choose between an event trigger and a schedule.
  > Trigger comes later, inside a spec. These first questions fill NOTES.md.
Why: With NOTES.md empty, loop-me knows nothing about your world yet. So it asks about that first, and turns your fuzzy terms into fixed ones as they come up. Only then does it start on a spec.
```

```final-test loop-me-deeper-weekly-timer
You want to be interviewed every Monday about new jobs to hand off, so you put the Skill on a seven-day `/loop` and leave your session open. A week later the Skill's name shows up as plain text, and no interview happens. Why didn't the interview start?
- [x] The Skill is user-invoked, and a scheduled fire only runs Skills Claude may start itself.
- [ ] `/loop` can't use days as a unit, so the seven-day interval was quietly dropped.
  > `/loop` supports `d` for days. The block is the Skill's `disable-model-invocation: true` mark.
- [ ] The loop needs a cloud scheduled task, because only the cloud can save its files.
  > `/loop` runs on your machine with your local files. The block is the Skill's mark.
Why: A scheduled fire only runs Skills Claude may start on its own. This Skill is marked `disable-model-invocation: true`, so its name reaches Claude as plain text and the Skill doesn't run. It's an interview anyway: it asks you questions and waits for your answers, so it needs you there.
```

```sources
- [loop-me: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/loop-me/SKILL.md), Matt Pocock's Skills
- [loop-me: agents/openai.yaml](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/loop-me/agents/openai.yaml), Matt Pocock's Skills
- [skills/skills/in-progress/README.md at a496f55 · mattpocock/skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [grill-me: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grill-me/SKILL.md), Matt Pocock's Skills
- [Ralph Wiggum as a "software engineer"](https://ghuntley.com/ralph/), Geoffrey Huntley, 2025-07-14
- [Matt Pocock on X: New in-progress skill: /loop-me](https://x.com/mattpocockuk/status/2069729160600203595), Matt Pocock, 2026-06-24
- [Getting Started With Ralph](https://www.aihero.dev/getting-started-with-ralph), Matt Pocock, 2026-01-08
- [Run prompts on a schedule - Claude Code Docs](https://code.claude.com/docs/en/scheduled-tasks), Anthropic
- [Automate work with scheduled tasks - Claude Code Docs](https://code.claude.com/docs/en/routines), Anthropic
- [loop-me: define an observable run completion and failure boundary #657](https://github.com/mattpocock/skills/issues/657), qshanx, 2026-07-24
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
```
