---
title: orchestration: one agent supervises the others
slug: orchestration
summary: How Orca's orchestration Skill lets one agent start other agents, answer their questions and wait for their reports, and why silence proves nothing.
image: /images/lessons/orchestration.jpg
imageAlt: An orchestra seen from the back of the stage in Geneva's Victoria Hall, its conductor leading before a full audience.
---

## What it's for

Say [Tickets](/learn/issues-and-keeping-track) #13 and #14 are ready to build. **Orca**, an app that runs several coding agents side by side, can put an agent on each, even each in its own [worktree](/learn/branches-and-worktrees), a separate folder of the repo on its own branch. But then you're checking who has a question or has finished.

**orchestration is Orca's Skill for one agent supervising other agents.**

The supervising agent is the **coordinator**. The others are **workers**.

```checkpoint quick-1
One agent in Orca starts two others and waits for their results. Which one is the coordinator?
- [x] The one that starts and supervises the other two.
- [ ] The one that finishes its piece of work first.
- [ ] The one you happened to open first when Orca started.
Why: The supervising agent is the coordinator, and the others are workers.
```

For example, you say:

```
Supervise two workers, one on #13 and one on #14.
```

Then:

1. The coordinator starts both workers, then ends its turn. Orca wakes it when a worker reports.
2. A stuck worker asks the coordinator a **blocking question**, then waits for the reply.
3. Each worker sends **worker_done** once: a three-sentence summary and its outcome, succeeded or failed.
4. The coordinator reports back to you.

```checkpoint quick-2
A worker on Ticket #13 needs an answer before it can go on. What happens?
- [x] It asks the coordinator a blocking question, then waits for the reply.
- [ ] It stops, and leaves its question in a message to the next worker.
- [ ] It carries on, and saves its question for its final worker_done.
Why: A blocking question is one the worker asks and then waits on, so it doesn't guess or carry on without the answer.
```

A long silence, or a wait that times out (a **timeout** is a time limit), is a checkpoint, not a failure: the coordinator doesn't stop or restart the worker.

```checkpoint quick-3
A long time passes with no message from either worker. What does the coordinator do?
- [x] It leaves the worker alone, since silence is only a checkpoint.
- [ ] It stops the worker, since silence means the worker has failed.
- [ ] It restarts the worker, since silence means the worker is stuck.
Why: Silence is a checkpoint, not a failure. It tells the coordinator nothing about the worker, so stopping or restarting it would be a guess.
```

```diagram
type: chain
caption: "one agent supervising other agents"
steps:
  - "The coordinator starts both workers"
  - parallel: ["one on #13", "one on #14"]
  - "Each worker sends worker_done"
  - "The coordinator reports back to you"
```

## When to use it

An agent takes this job only when you ask it to supervise or coordinate. Use it when:

- You want several Tickets built at once, with one agent answering questions and waiting for results.
- You need work done in a set order, such as #12 before #13.

```checkpoint quick-4
You ask an agent to start a second agent in a new worktree, and nothing more. Is it now a coordinator?
- [x] No, it takes that job only when you ask it to supervise.
- [ ] Yes, it takes that job whenever a second agent is running.
- [ ] Yes, it takes that job whenever a new worktree is created.
Why: Starting another agent isn't enough. An agent becomes a coordinator only when you ask it to supervise.
```

## When not to use it

- If another agent should take over with nobody watching, use [orca-cli](/learn/orca-cli) instead, Orca's Skill for driving Orca and handing off work.
- If the work has to travel, say to a colleague, use [handoff](/learn/handoff) instead, because it writes a document the next agent reads.
- If you're building a whole [Spec](/learn/issues-and-keeping-track)'s Tickets (a Spec is the written plan for one feature), use [implement-spec](/learn/implement-spec) instead, because its subagents work from the Spec with little back-and-forth.

```checkpoint quick-5
A colleague will finish your half-done work tomorrow, and nobody needs to supervise. Which fits?
- [x] handoff, which writes a document the next agent reads.
- [ ] orchestration, so a coordinator can watch your colleague.
- [ ] implement-spec, so its subagents can finish it for them.
Why: The work has to travel to a colleague, so it needs a document that goes with it. Nobody is supervising, so there's no job for a coordinator.
```

## What it needs to start

Start Orca, with its orchestration [Skill](/learn/skills) installed, and ask an agent to supervise.

The installed SKILL.md (the Skill's instruction file) is only a **stub**, a small placeholder file pointing elsewhere. So the agent asks Orca's CLI, its command-line tool, to print the real guide: `orca skills get orchestration`.

```checkpoint quick-6
You open orchestration's installed SKILL.md, looking for its commands. What do you find?
- [x] A stub pointing to the real guide, which the Orca CLI prints.
- [ ] The full guide, with every command the agent will need.
- [ ] An empty file, which Orca fills in the first time it runs.
Why: The installed file is only a stub, a small placeholder. The agent asks the Orca CLI to print the real guide.
```

A **Task** is Orca's word for one piece of work given to a worker. The coordinator writes a Task spec for each. A worker starts from that spec, its written brief, not the coordinator's chat, so the spec must stand on its own. Ticket #13's might read like this (the labels are the Orca guide's, and newer versions of the guide word them more loosely):

```
Target: api/bookings.py and its tests
Change: add the booking endpoint
Constraints: don't change the bookings table
Ownership: edit only those files
Observable acceptance: pytest api/test_bookings.py passes
```

Observable acceptance is what proves it's done.

```checkpoint quick-7
The coordinator is about to start a worker. Why can't its spec say "carry on with what we discussed"?
- [x] The worker starts from its spec, not from the coordinator's chat.
- [ ] The worker can read that chat, but reading it costs too much time.
- [ ] Orca refuses to start a worker whose spec is under a set length.
Why: A worker starts from its spec, not that chat, so "what we discussed" means nothing to it. That's why the spec must stand on its own.
```

## What it creates

Inside Orca, not your repo, it keeps:

- A **Run**: the coordinator's inbox for one piece of supervised work.
- The Tasks, with a **Dispatch** per attempt: one attempt at a Task by one worker.

```checkpoint quick-8
A worker's attempt at a Task fails, and a second worker retries that Task. How many Dispatches is that?
- [x] Two, since each one is one attempt by one worker.
- [ ] One, since each Task has only a single Dispatch.
- [ ] None, since a Dispatch is for a finished Task.
Why: A Dispatch is one attempt at a Task by one worker. Two attempts make two Dispatches, even for one Task.
```

The coordinator's final report names each Task's outcome, the evidence, and anything still blocked.

## Going deeper

### Why it exists

Orca could already run coding agents such as Claude Code, Codex and OpenCode side by side. But running side by side isn't working together. In April 2026 a user, heyramzi, opened a discussion in Orca's repo and named the gap:

> The missing piece is the **glue** — the coordinator that makes the agents collaborate…

```checkpoint quick-9
Orca could already run several coding agents side by side. What was still missing?
- [x] A coordinator to make the agents collaborate.
- [ ] A separate terminal for each agent it started.
- [ ] A way to run Codex and Claude Code in one app.
Why: Running side by side isn't working together. The gap was the glue, a coordinator that makes the agents collaborate.
```

So a maintainer of Orca, Jinwoo-H, built it, in a pull request that answered that discussion. So Orca's makers wrote it, not Matt Pocock, whose [Skills](/learn/skills) most of this library covers. It first shipped behind an experimental toggle in Settings.

Today its job fits in one line: "Use it when you need ownership, completion tracking, or a DAG." Ownership is who owns each piece of work. Completion tracking is knowing when it has finished. A **DAG** here is a plan of Tasks with dependencies between them: some wait for others, and the rest can run at once.

```checkpoint quick-10
Your plan has four Tasks: one must wait for another, and the rest can run at once. What is that plan?
- [x] A DAG, a plan of Tasks with dependencies between them.
- [ ] A Run, a plan of Tasks that all start at the same time.
- [ ] A Dispatch, a plan of Tasks that one worker does in turn.
Why: A DAG here is a plan of Tasks with dependencies between them. Some wait for others, and the rest can run at once.
```

### How it works underneath

Think of the Run as a mailbox. Workers post messages to it, such as a question or a `worker_done`, and Orca stores them in a database. Since Orca 1.4.246 (November 2026), the coordinator starts every worker, then ends its turn. Orca wakes it when a worker reports, asks or stops, and it runs the `check` command the wake names. Before that, it stayed awake and waited with `check --wait`, which "blocks until a message arrives, replacing sleep+poll loops". Either way, it doesn't have to keep waking up to look.

```checkpoint quick-11
A coordinator has nothing to do until a worker writes to it. What does it do?
- [x] It ends its turn, and Orca wakes it when a worker writes.
- [ ] With a loop that sleeps a while, then looks for messages.
- [ ] By rereading each worker's terminal again and again.
Why: Orca wakes the coordinator when a worker reports, asks or stops, so the coordinator doesn't need a loop that sleeps and looks again.
```

Here's the normal loop for #13 and #14, trimmed a little, with comments added:

```
# Make the Run.
orca orchestration run-create --objective "Build #13 and #14"

# Start both workers. Each command also makes a Task and its Dispatch.
orca orchestration worker-start --spec "<#13's spec>" --worktree current --agent codex
orca orchestration worker-start --spec "<#14's spec>" --worktree current --agent claude

# Then end the turn. Orca wakes the coordinator when a worker reports.
```

Here both workers share your folder, which works when they edit different files. If they might edit the same files, or you ask for it, each gets its own worktree, with `--worktree new-child`.

The coordinator then replies to questions, checks each `worker_done` against the attempt it expects, and ends its turn again until every attempt has finished. The guide behind these commands lives in the Orca program itself, so it always matches your version.

In the first version, from April 2026, `orchestration run` started a coordinator loop inside Orca's **runtime**, the running app that stores and delivers messages. That command has since been retired. Today the coordinator agent starts the workers and ends its turn, and Orca wakes it when one reports.

```checkpoint quick-12
An old post tells you to start the coordinator loop with `orchestration run`. What runs that loop today?
- [x] The coordinator agent: it starts the workers, ends its turn, and Orca wakes it when one reports.
- [ ] Orca's runtime, which still starts the loop whenever that command is run.
- [ ] Each worker, which takes a turn at running it between pieces of its work.
Why: `orchestration run` is retired. It started a loop inside the runtime, but today the coordinator agent starts the workers and Orca wakes it when one reports.
```

One person who runs a coordinator daily, with their own scripts, says coordinating was never the hard part: "Knowing when a worker was done was." A coordinator, they argue, needs three states, not two: finished, needs input, and unknown. Unknown means alive, with no output and no question, and that's where they say the time goes.

Orca takes the same care over whether a worker is still running. It keeps three verdicts: `live`, `unverifiable` and `exited`. The middle one means Orca can't tell, because "contact loss is not process death".

```checkpoint quick-13
A coordinator loses contact with a worker. What does that tell it about the worker?
- [x] Nothing certain, since the worker may still be running.
- [ ] The worker has exited, so its work can safely be retried.
- [ ] The worker has failed, so its Task can be marked as failed.
Why: Losing contact isn't process death, so Orca's verdict is unverifiable. The worker may still be running.
```

So only one kind of fact lets a coordinator give up on a worker: "Only positive proof of exit authorizes stop, abandon, or retry". Positive proof means an `exited` verdict, the worker's own report that its process ended, or a transcript whose last turn sent no `worker_done`.

### A real example

The pull request that built orchestration added messaging, plans of Tasks and a coordinator loop in one go. Its test plan ran a small DAG end to end: three Tasks, two in parallel and one in sequence. It passed: "full 3-task DAG orchestration (2 parallel + 1 sequential) completes ~1 min".

So a plan doesn't have to be a long chain. Tasks with no dependency between them can run at once, and a dependency makes one wait for another: "Use dependencies only for real ordering".

```checkpoint quick-14
Two of your Tasks could run at once, but you add a dependency between them to be safe. What's the cost?
- [x] One now waits for the other, with no real ordering behind it.
- [ ] Orca refuses the whole plan, since it allows no dependencies.
- [ ] Both still run at once, so the dependency changes nothing.
Why: A dependency makes one Task wait for another. That's worth it only for real ordering, so without one you lose the time you'd gain running them at once.
```

### Where it goes wrong

Most of these failures look like silence, and an empty inbox is not a result.

**A worker stays quiet for a long time.** That alone proves nothing: "Absence never authorizes stop, abandon, retry, or release; keep waiting or inspect." Don't start a second worker on the same Task without positive proof that the first has stopped. Instead, list the workers with `worker-list`, which gives each worker's liveness and what it needs next.

```checkpoint quick-15
A worker has been quiet for a long time, and you're tempted to start a second worker. What do you do instead?
- [x] List the workers with worker-list, and see what each one needs next.
- [ ] Start the second worker, since a long silence proves the first died.
- [ ] Stop the first worker, since a long silence counts as positive proof.
Why: Silence proves nothing about the worker. Listing the workers shows what each one needs, without risking a second worker on the same Task.
```

**A worker pushed its commit, but `worker_done` never came.** In one 12-hour run with no person watching, a coordinator had up to 10 Codex workers at a time. At least six finished their work and never sent `worker_done`. The reporter guessed that, over Codex's long context, they forgot their reporting rules, but that cause "was not isolated experimentally".

The reporter had asked Orca to settle such Tasks, meaning record their final outcome, from checked evidence. Then the reporter closed the issue, because that "would reintroduce success inferred from artifacts, which the guide rules out." Those are what a run leaves behind, such as a commit. So a commit is not a report: a valid `worker_done` is what settles a Task. Without one, treat the outcome as unknown, inspect the worker, and stop or abandon it only on positive proof.

```checkpoint quick-16
A worker pushed its commit an hour ago, but sent no worker_done. Can the Task count as succeeded?
- [x] No. A commit is not a report, so the outcome stays unknown.
- [ ] Yes. A pushed commit proves the worker did what was asked.
- [ ] Yes. An hour of silence after a commit counts as finished.
Why: A valid worker_done is what settles a Task. Without one the outcome is unknown, so the coordinator inspects the worker.
```

**The quiet looks normal, but Orca isn't answering.** In one run of three workers, the runtime stopped answering, but the workers kept going. A worker sends `worker_done` only once, and if that send fails, "the work is done but invisible".

```checkpoint quick-17
Orca's runtime stops answering as a worker sends its worker_done. What can happen?
- [x] The send fails, and the finished work goes unreported.
- [ ] The worker keeps sending it until one gets through.
- [ ] The worker stops too, so no work has been finished.
Why: A worker sends worker_done only once, so a failed send leaves finished work that the coordinator never hears about.
```

A second user confirmed it on Windows, and saw no retry after the runtime recovered. So don't read the quiet as nothing having finished: "a runtime outage is easy to mistake for a quiet window". Read the reply to `check --wait`, which the report's author used. In the first report, with `--json`, a normal timeout said `"ok":true` and an outage said `"ok":false`. Then inspect each worker.

**Your computer starts speaking.** On Linux outside Orca's terminals, `orca` normally runs the GNOME screen reader. Use `orca-ide` there.

### Try it

Supervise two workers, then check their reports yourself. You'll need your practice project (the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) sets it up), with `api/` and `web/` (your agent can add them), and Orca ([download it](https://www.onorca.dev/docs/install) for macOS, Windows or Linux), with its orchestration Skill. If the Skill is missing, run `npx skills add https://github.com/stablyai/orca --skill orchestration --global`. If Orca doesn't offer it, check Settings → Experimental → Agent Orchestration.

Here's what you'll ask for in step 2:

```
Supervise two Orca workers. One adds a GET /health endpoint, with a test, in api/.
The other adds a page that lists classes in web/.
Give each worker its own worktree.
Show me both Task specs before you start them.
```

1. Open your yoga-studio repo in Orca, and start an agent there.
2. Give the agent the request above. You should see two Task specs, each saying what's in scope, the change, what not to touch, what the worker may edit, and the test that proves it's done.
3. Say "Start them." You should see two workers start, each in its own terminal or chat.
4. Wait for both to finish. You should see a `worker_done` from each, with a summary and an outcome.
5. Open each worker's worktree (its card in Orca's sidebar), and run the acceptance test from its Task spec there. You should see the result match its reported outcome.
6. Read the coordinator's report. You should see each Task's outcome, the evidence, and any blocker.

### Read more

- [Orchestration — Orca Docs](https://www.onorca.dev/docs/cli/orchestration), Stably, Inc.
- [Multi-agent orchestration: coordinator pattern for Claude/Codex/OpenCode](https://github.com/stablyai/orca/discussions/681), heyramzi and others, 2026-04-15
- [feat(orchestration): add inter-agent orchestration system](https://github.com/stablyai/orca/pull/1188), Jinwoo-H, 2026-04-27
- [Recover supervised cycles missing worker_done using attempt-linked result evidence](https://github.com/stablyai/orca/issues/14829), Tauri-EPO, 2026-08-16
- [What happens to worker_done / ask sent while the runtime is unreachable — queued or lost?](https://github.com/stablyai/orca/issues/12986), choiyounggi, 2026-08-07

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint orchestration-deeper-outage-quiet
Three Orca workers are building parts of your booking API. For twenty minutes the coordinator hears nothing, and you learn the Orca runtime was unreachable for part of that time. Why shouldn't you read the quiet as "nothing has finished yet"?
- [x] A worker's one worker_done may have failed to send, so finished work can sit unreported.
- [ ] Workers stop working whenever the runtime is down, so all three Tasks have already failed.
  > In the reported run the workers did not stop; one pushed three commits during the outage.
- [ ] Orca resends every lost worker_done when the runtime comes back, so you'll see them all soon.
  > The issue asks whether sends are queued; one user saw no retry after the runtime recovered.
Why: A worker reports exactly once and then ends its turn. If that one send fails during an outage, the work is done but nobody hears about it, and the outage looks like any other quiet spell. So an empty inbox tells you nothing: inspect each worker instead of trusting it.
```

## Remember

```flashcards
Q: What does orchestration create?
A: A Run (the coordinator's inbox), Tasks, and a Dispatch for each attempt at a Task.

Q: What must every worker's Task spec name?
A: The target, the change, the constraints, what the worker may edit, and the evidence that proves it's done, so it stands on its own.

Q: A coordinator hears nothing from a worker for a long time. What does that mean?
A: Nothing yet. It's a checkpoint, not a failure, so keep waiting; don't stop or relaunch the worker.

Q: You want another agent to take over work in another worktree, and nobody will watch it. Which Orca Skill fits?
A: orca-cli. No Run, Task or Dispatch is made, and nobody monitors completion.

Q: Where did Orca's orchestration come from?
A: An April 2026 discussion asking for a coordinator as the "glue" between agents. A maintainer's pull request built it, behind an experimental toggle.

Q: What three verdicts can Orca give about a worker, and what does losing contact mean?
A: live, unverifiable and exited. Losing contact isn't process death; only positive proof of exit allows stop, abandon or retry.

Q: Someone who runs the coordinator pattern daily named its hard part. What was it?
A: Not the coordinating, but knowing when a worker was done. The "unknown" state is where the time goes.
```

## Final test

```final-test orchestration-when-to-use
When does an agent use orchestration rather than only starting another agent?
- [x] When you ask it to supervise agents and wait for their results.
- [ ] When it starts another agent for you in a new worktree and terminal.
- [ ] When you choose a model and effort level for the new agent.
- [ ] When the project is a Git repo with several worktrees open.
Why: An agent takes the coordinator's job only when you explicitly ask it to supervise, wait for results or manage questions. Starting another agent with nobody watching goes to orca-cli instead, and choosing a model or having worktrees open doesn't count as asking.
```

```final-test orchestration-real-guide
Where does an agent get orchestration's real instructions?
- [x] It asks the Orca CLI to print them, with skills get orchestration.
- [ ] It reads the SKILL.md file installed with the orchestration Skill.
- [ ] It reads a handoff document saved in your computer's temporary folder.
Why: The installed SKILL.md is only a stub, a small file that points elsewhere. The Orca CLI prints the real guide itself, so the guide can never drift from the version of Orca that will run the commands.
```

```final-test orchestration-worker-done
How does a worker tell the coordinator it has finished?
- [x] It sends worker_done once, with a summary and an explicit outcome.
- [ ] It sends one last heartbeat, a still-alive message, with a summary of what it changed.
- [ ] It closes its terminal so the coordinator sees that it exited.
- [ ] It writes in its last message that it's done and that the tests pass.
Why: worker_done is the report the coordinator waits for, so a last message or a closed terminal doesn't tell it the outcome. It's sent exactly once, with a three-sentence summary and an explicit outcome. A heartbeat only proves the worker is alive, and a failure must never be written only in prose.
```

```final-test orchestration-deeper-missing-report
A worker pushed its commit but never sent worker_done. What should the coordinator do?
- [x] Treat the outcome as unknown, inspect the worker, and stop or abandon it only on positive proof.
- [ ] Mark the Task as succeeded, since the pushed commit proves the worker finished its work.
- [ ] Start a duplicate worker on the same Task straight away, since the first one has gone quiet.
- [ ] Mark the Task as failed after one empty wait, since a worker that reports late is broken.
Why: A commit isn't a report, and a missing report isn't a failure, so the outcome is unknown. The contributor who asked Orca to settle such Tasks from checked evidence, and warned that a commit alone isn't enough, still closed the issue: even that would bring back success guessed from what a run leaves behind. Starting a duplicate or marking a failure would act on silence, and silence never permits that. So the coordinator inspects the worker first.
```

```final-test orchestration-deeper-retired-run
In the first version, `orchestration run` started a coordinator loop inside Orca. What runs that loop now?
- [x] The coordinator agent: it starts the workers, ends its turn, and Orca wakes it when one reports.
- [ ] Orca's runtime, still started with the `orchestration run` command from the first version.
- [ ] Each worker, which picks its next Task from the Run once it sends its worker_done.
Why: `orchestration run` is retired, so the loop no longer lives inside Orca's runtime. The coordinator agent runs it now: it creates a Run with run-create, starts workers with worker-start, then ends its turn until Orca wakes it. A worker doesn't take it over, because each one idles after its worker_done.
```

```final-test orchestration-parallel-tickets
You use Orca on a FastAPI backend. Three Tickets that don't block each other are ready: sign-up, the booking list and a health check. You want Codex on one and Claude on the other two, all at once. Each may stop mid-Ticket to ask a question and wait for the answer, and you want one agent to answer those questions and wait for each to report back. Which fits best?
- [x] Have one agent supervise three Orca workers, one per Ticket.
  > Right: that's `/orchestration`.
- [ ] Write a summary document so a fresh agent can pick up the work.
  > That's `/handoff`. It passes the work to one fresh agent. Nothing waits for results or answers questions.
- [ ] Build the Tickets with fresh implementer subagents, one per Ticket, working from the Spec.
  > That's `/implement-spec`. Its implementer subagents are meant to talk to it sparsely, working from pointers to the Spec and Tickets. Here each worker must stop, ask and wait for an answer.
Why: You want one agent waiting for results and answering questions while the others build. That's a coordinator's job, and Orca records who owns which work and when it has finished. A written summary only passes work along, and implement-spec's subagents are meant to have little back-and-forth.
```

```final-test orchestration-end-of-day
It's late, and the Docker Compose setup for your website is half done. Tomorrow a colleague will finish it in their own agent session, and nobody needs to supervise anything. You want their session to know what was done and what's left. Which fits best?
- [x] Write up this conversation so a fresh agent can carry on.
  > Right: that's `/handoff`.
- [ ] Create an Orca Run and start a worker to finish the setup.
  > That's `/orchestration`. Nobody is supervising. For unsupervised work Orca's guide creates no Run, Task or Dispatch and doesn't monitor completion.
- [ ] Build each Ticket of the Spec and merge them all into one shared branch.
  > That's `/implement-spec`. There's no Spec with Tickets here, only one half-done piece of work.
Why: The work is going to a colleague, so what it needs is a written summary that travels with it. Nobody is supervising, so a coordinator would have nothing to do, and there's no Spec with Tickets to build.
```

```final-test orchestration-independent-wave
Your Spec for an AI agent backend has been split into Tickets, and four of them don't depend on each other. You use Orca, and you've asked for agents to build those four in parallel while one agent supervises them and answers their questions. What comes next?
- [x] Create a Run, start all four workers, then wait for reports.
  > Right: that's `/orchestration`.
- [ ] Split the Spec into Tickets, each declaring what blocks it.
  > That's `/to-tickets`. That's already done; the four Tickets are ready.
- [ ] Write the Spec from this conversation and publish it as an Issue.
  > That's `/to-spec`. The Spec is already written and split.
Why: The Spec and Tickets are done, and you've asked for supervision. So the next move is the coordinator's: it creates one Run and starts all four workers before it ends its turn. Starting the whole group first is what lets them run at the same time.
```

```final-test orchestration-self-contained-spec
An agent is supervising two Orca workers on your website: one fixes the contact form, one adds a sitemap. For each, it writes a Task spec naming the files in scope, the change, what not to touch, what the worker may edit, and the test that proves it's done. Why spell all that out instead of writing "carry on with what we discussed"?
- [x] A worker starts without the supervisor's chat, so its spec must say it all.
- [ ] So the supervisor can trust each worker_done without checking it.
  > The supervisor still checks each worker_done against the attempt it expects.
- [ ] So a worker can widen its scope to nearby files when it spots more things to fix.
  > The spec sets boundaries, and a worker does only its current Task.
Why: Each worker is a separate agent, maybe even a different one like Codex, that starts from its own Task spec. "What we discussed" means nothing to it. So every Task spec has to stand on its own: the target, the change, the constraints, what the worker owns, and the evidence that proves it's done.
```

```final-test orchestration-deeper-commit-no-report
An agent supervises two Orca workers on your yoga-studio repo. The worker adding a class-list test in api/ pushed a commit an hour ago, then sat idle without sending worker_done. The coordinator still won't mark that Task as succeeded. Why is that the right call?
- [x] A commit isn't the worker's report: a valid worker_done is what settles a Task.
- [ ] The coordinator has no way to see a worker's commits, so it can't know anything was pushed.
  > In the reported run the coordinator checked commits by other means; a commit still isn't the report.
- [ ] The coordinator must wait out a fixed ninety-minute grace period before it can mark anything.
  > The guide sets no grace period. It treats absence as a checkpoint and asks for positive proof.
Why: A pushed commit doesn't show it came from this attempt, or that it meets the Task's test. So a commit can't settle a Task; a valid worker_done does. Even settling from checked evidence would bring back success guessed from what a run leaves behind, which is why the contributor who asked for that closed the issue. Since the worker's last turn sent no worker_done, the coordinator inspects it, then chooses worker-stop or worker-abandon explicitly.
```

```sources
- [Multi-agent orchestration: coordinator pattern for Claude/Codex/OpenCode · Discussion #681 · stablyai/orca](https://github.com/stablyai/orca/discussions/681), heyramzi, 2026-04-15
- [handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [Orca skills registry & MCP — Orca Docs](https://www.onorca.dev/docs/cli/skills), Stably, Inc.
- [feat(orchestration): add inter-agent orchestration system · Pull Request #1188 · stablyai/orca](https://github.com/stablyai/orca/pull/1188), Jinwoo-H, 2026-04-27
- [Orchestration — Orca Docs](https://www.onorca.dev/docs/cli/orchestration), Stably, Inc.
- [Docs What happens to worker_done / ask sent while the runtime is unreachable — queued or lost? · Issue #12986 · stablyai/orca](https://github.com/stablyai/orca/issues/12986), choiyounggi, 2026-08-07
- [Feature: Recover supervised cycles missing worker_done using attempt-linked result evidence · Issue #14829 · stablyai/orca](https://github.com/stablyai/orca/issues/14829), Tauri-EPO, 2026-08-16
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
```
