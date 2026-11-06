---
title: orca-cli
slug: orca-cli
summary: In this Course, orca-cli's job: your agent starts another agent in a new Orca worktree, then stops.
---

## What it's for

Say Ticket #12 is merged, and Ticket #13, the booking endpoint, is next. You want another agent to own #13 while you carry on. By hand, that's a [worktree](/learn/branches-and-worktrees), a terminal, an agent and a long paste.

**In this Course, orca-cli's job: your agent starts another agent in a new Orca worktree, then stops.**

The new agent starts from your **brief**, its first prompt, and owns the work from then on. That's a [full handoff](/learn/claude-handoff).

```checkpoint quick-1
Your agent has handed off Ticket #13 and stopped. Who owns #13 now?
- [x] The new agent, which owns the work from then on.
- [ ] Your first agent, which checks on the new one later.
- [ ] You, until the new agent says that it has finished.
Why: That's what makes it a full handoff. The new agent starts from your brief and owns the work from then on.
```

orca-cli comes with [Orca](/learn/orchestration), the app that runs several coding agents side by side, not from Matt.

For example, you type:

```
Hand off Ticket #13 to another agent.
```

Your agent runs:

```
orca skills get orca-cli
orca worktree create --name ticket-13 --no-parent --agent claude --prompt "<brief>" --json
```

## When to use it

- You say `hand off`, `handoff`, `handover`, `give this to another agent` or `another worktree`, and nobody needs to watch the new agent.
- You want a new Orca worktree, or to read from or type into an Orca terminal. Use it over raw `git worktree` commands whenever Orca's state is involved, meaning its worktrees, terminals and agents.

```checkpoint quick-2
You're working in Orca and want a new worktree for a Ticket. Which fits?
- [x] orca-cli, because Orca's state is involved here.
- [ ] Raw `git worktree` commands, because they do the same.
- [ ] A second clone, because Orca's state doesn't matter.
Why: Use orca-cli over raw `git worktree` commands whenever Orca's state is involved, and a new worktree in Orca is exactly that.
```

## When not to use it

- If you want to supervise, by waiting for results or answering questions, use [orchestration](/learn/orchestration) instead, because a handoff stops once the brief arrives. Asking for a model or effort level doesn't count: effort level is how hard the model thinks.
- If the work leaves Orca, say for a colleague, use [handoff](/learn/handoff) instead, because it writes a document the next agent reads.
- If Orca's state doesn't matter, use plain terminal commands instead.

```checkpoint quick-3
You say: hand this off with a strong model and high effort, and nobody will watch it. Which Skill fits?
- [x] orca-cli, since asking for a model isn't supervising.
- [ ] orchestration, since asking for a model is supervising.
- [ ] handoff, since asking for a model means leaving Orca.
Why: Supervising means waiting for results or answering questions. Asking for a model or effort level doesn't count, so this stays a plain handoff.
```

## What it needs to start

The agent starts it itself. It needs:

- The right command. On Linux, outside Orca's own terminals, that's **`orca-ide`**, the Orca command that avoids a name clash. A bare `orca` there normally starts the **GNOME screen reader**, which shares the name and speaks aloud.
- Orca running. If it isn't, the agent runs that command with `open`.
- The real guide. The installed Skill file is only a stub, a small file pointing elsewhere. So the agent first runs `orca skills get orca-cli`, which prints the guide matching your installed Orca.
- A brief. The new agent starts fresh, so the brief carries anything it needs from your current branch.

```checkpoint quick-4
You're on Linux, in your own terminal, outside Orca. An agent is about to run a bare `orca`. What happens?
- [x] It normally starts the GNOME screen reader, which speaks aloud.
- [ ] It normally opens the Orca app, and waits for your next command.
- [ ] It normally prints the guide that matches your installed Orca.
Why: Outside Orca's own terminals on Linux, the name `orca` normally means the screen reader. The right command there is `orca-ide`.
```

## What it creates

- A new Orca worktree: a repo checkout that Orca tracks. `--no-parent` marks it as independent work. Leaving out `--base-branch` makes Orca start it from the repo's default base, such as your remote's `main`, not your current branch.
- An agent started in it, with your brief.
- A short report: the worktree's id and the agent's **handle**, the name Orca commands use to reach it. The handoff is done once those are reported and the brief arrived.

```checkpoint quick-5
Your agent reported the worktree's id and the agent's handle, and the brief arrived. What does it do next?
- [x] Nothing more, because the handoff is now done.
- [ ] It waits for the new agent, in case it fails.
- [ ] It reads the new agent's commits, then closes the Ticket.
Why: The handoff is done once the id and handle are reported and the brief arrived. The work is the new agent's now, so there's nothing to wait for.
```

```diagram
type: chain
caption: "That's a full handoff."
steps:
  - "Hand off Ticket #13 to another agent."
  - "`orca skills get orca-cli`"
  - "A new Orca worktree"
  - "An agent started in it, with your brief."
  - "A short report: the worktree's id and the agent's handle"
  - "The handoff is done"
```

## Going deeper

### Why it exists

You install orca-cli from Orca's own repo:

```
npx skills add https://github.com/stablyai/orca --skill orca-cli --global
```

Two problems shaped it.

**Guides that go stale.** A Skill file you install is a copy, while the `orca` program itself, its **binary**, changes with each update. An Orca developer named the risk: "Today, globally installed skills are frozen copies, so their command guidance can drift from the Orca binary they control." So in July 2026 Orca turned this file into a stub that asks the exact program it will use for the guide.

```checkpoint quick-6
You installed a Skill file holding a full guide, then updated Orca. Why might its commands now be wrong?
- [x] The installed file is a frozen copy, and the program changed.
- [ ] The update rewrote the file with commands from an old release.
- [ ] The agent can read a Skill file only on the day it's installed.
Why: A Skill file you install stays as it was, while the `orca` program changes with each update. So the file's command guidance can drift from the program.
```

**Handoff words with two possible meanings.** A request to hand off work could mean giving it away, or supervising whoever takes it. In June 2026 Orca gave that wording one meaning: a full ownership transfer "unless supervision is explicit".

```checkpoint quick-7
You tell your agent: hand this off to another agent. You say nothing about watching it. How is that read?
- [x] As a full ownership transfer, since no supervision was asked for.
- [ ] As a request to supervise, since handing off implies a coordinator.
- [ ] As a question for you, since the wording could mean either one.
Why: Orca gave that wording one meaning. It's a full ownership transfer, unless you explicitly ask for supervision.
```

### How it works underneath

**A stub that asks the app.** The file you install is a **hybrid discovery stub**: a short file that says when to use Orca and how to load the full guide. The guide stays inside the program, for one reason: "Command flags live in the binary so they cannot drift from the app version."

```checkpoint quick-8
You update Orca and leave the installed stub as it is. Where does the agent get its commands now?
- [x] From the updated program, which holds the full guide.
- [ ] From the stub, which holds the full list of commands.
- [ ] From Orca's website, whose address the stub contains.
Why: The stub only says when to use Orca and how to load the guide. The guide stays inside the program, so the two can't drift apart.
```

Moving the guide out cut orca-cli's installed file from 331 lines to under 80. This Course's copy is 47.

The stub gives the agent two jobs. First it picks the program, once, and reuses that choice for every later command. That's where the `orca-ide` rule lives. Then it runs `orca skills get orca-cli` with that program, and follows the guide it prints.

```diagram
type: chain
caption: "A stub that asks the app."
steps:
  - "it picks the program"
  - "it runs `orca skills get orca-cli`"
  - "follows the guide it prints"
```

**How the agent knows the brief arrived.** It reads the launch's reply, where `prompt.outcome` must be `journaled` or `handed-to-terminal`. A handoff can also go to an agent that's already running. Then the send receipt must say `accepted: true`.

```checkpoint quick-9
A launch's reply shows `prompt.outcome` as `handed-to-terminal`. What does that tell the agent?
- [x] The brief arrived, so it needn't launch again.
- [ ] The brief was lost, so it must launch again.
- [ ] The new agent has finished the work it was given.
Why: For a new launch, `prompt.outcome` shows whether the brief arrived. `journaled` and `handed-to-terminal` both mean it did.
```

**What else it drives.** The same `orca` command reaches Orca's terminals, repos, automations and built-in browser. An agent can also set a **worktree comment**, the short status line on a workspace card in Orca.

### A real example

In July 2026, before the stub shipped, an Orca developer tested it. Would agents find the real guide before their first Orca command? Claude Code and Codex each loaded the stub explicitly, then did a small read-only job in a demo project.

- Both treated the file as a discovery stub, not a full command guide.
- Both picked plain `orca` on macOS, the right program there.
- Both ran `orca skills get orca-cli` before any `status`, `worktree` or `terminal` command.
- Neither invented a subcommand from memory.

The verdict was "pass". So a short file can be enough if it says where the real guide is. The record names its limits. It didn't measure an old Orca with no `skills get`, the token cost, or picking the program on Linux, WSL (Linux inside Windows) or SSH. It ran no comparison with the full file.

```checkpoint quick-10
You're on Linux. Does this test show that the stub will pick the right program for you?
- [x] No, because picking the program on Linux wasn't measured.
- [ ] Yes, because both agents picked plain `orca`, which suits Linux too.
- [ ] Yes, because the verdict was pass, which covers every system.
Why: The record names its own limits. It didn't measure picking the program on Linux, WSL or SSH, so a pass on macOS says nothing about those.
```

### Where it goes wrong

**The new agent doesn't stop for approval.** By default, Orca starts every supported agent with its full-autonomy flag, the option that turns off approval prompts. For Claude Code that's `--dangerously-skip-permissions`. Orca's reasoning is that "the worktree itself is the sandbox", a space set apart for the agent's work. That's its intent, not a guarantee: worktrees share the repo's history and config.

```checkpoint quick-11
You hand off work with Orca's default settings. How does a new Claude Code agent start?
- [x] With `--dangerously-skip-permissions`, so no approval prompts.
- [ ] In plan mode, so it checks with you before each change it makes.
- [ ] With only the permissions that you approved in your first session.
Why: By default, Orca starts every supported agent with its full-autonomy flag, reasoning that the worktree itself is the sandbox.
```

One user wanted a session in plan mode, where you iterate on a plan first, and it started with permissions bypassed. To change the default, edit the agent's launch arguments in **Settings → Agents**. That user warns the change "is global and also changes every worker and every hand-opened tab".

**Your agent ran an `orca orchestration` command during a handoff.** Some of those commands belong to supervision. `task-create` adds a **task row**, Orca's tracking record for a Task, and that record belongs to a coordinator. After a handoff, no coordinator is left to own it. So in June 2026 Orca forbade `task-create`, `dispatch --inject` and `check --wait` for handoffs. For a handoff, leave those commands out. And "if a task row is needed, the user asked for supervised orchestration."

```checkpoint quick-12
You need a task row for a Ticket you're handing off. What does that tell you?
- [x] You really want supervision, so use orchestration.
- [ ] Nothing much, since a task row is part of any handoff.
- [ ] The agent must make its first commit, then add the row.
Why: A task row belongs to a coordinator, and a handoff leaves no coordinator to own it. So needing one means you asked for supervised orchestration.
```

**Your computer starts talking, on Linux.** The agent ran a bare `orca` outside Orca's terminals, and that started the GNOME screen reader. Use `orca-ide`. If the chosen program can't run, the agent must report its exact error and stop. Trying another one "could silently target a different Orca build".

**The launch's reply never came back.** Starting again could create a second agent or send the brief twice. So the agent repeats the same command, from the same directory, with `--retry-launch` and the launch's `operationId`. Orca then replays the launch it accepted. The rule: "Do not retry as a fresh launch." If the replay says the outcome is unknown or expired, the agent inspects the workspace, without sending input, before deciding whether to launch again.

```checkpoint quick-13
A launch's reply never came back. What should the agent do?
- [x] Repeat the same command with `--retry-launch` and the `operationId`.
- [ ] Run the same command again with no ID, as the first one failed.
- [ ] Start a different agent in the same worktree, then send it the brief.
Why: Repeating it with `--retry-launch` makes Orca replay the launch it already accepted. A fresh launch could create a second agent, or send the brief twice.
```

**The new agent opened in a terminal, though you use chats.** Chat UI is Orca's setting for opening agents as chats. Before an October 2026 fix, `orca worktree create --agent codex` could open the new agent in a terminal even with Chat UI on. The command took worktree creation's own path to a terminal, which never read that setting. The fix: update Orca. The command now uses Orca's agent launch, the same one the app's new-agent tab uses, so the setting decides. If you still get a terminal, the reply's `receipt.detail` says why.

### Try it

You'll need your practice project (set it up first with keeping-track's Try it step if you haven't). It needs a FastAPI app in `api/` on `main`; if it's missing, have your agent add one. You'll also need Orca, with orca-cli installed: the command is under Why it exists.

Send this request:

```
Hand off adding a GET /health endpoint to another Claude Code agent. Don't supervise it.
Brief: add it to the FastAPI app in api/, with a test, and don't touch web/.
```

1. Open the `yoga-studio` repo in Orca.
2. Start a Claude Code agent there, from Orca's agent picker.
3. Send it the request above.
4. Watch what it runs. You should see `orca skills get orca-cli`, then one `orca worktree create` with `--no-parent`.
5. Look for `orca orchestration` in what it ran. You should see no such command.
6. Read its last message. You should see the new worktree's id and the agent's handle.
7. Find the new worktree's card in Orca's sidebar. You should see the agent's status: yellow while working.
8. Open that worktree yourself, since Orca leaves it in the background.
9. Read the new agent's chat or terminal. You should see it working from your brief.

The work now belongs to the new agent, and you review it when it's done. Orca starts that agent without approval prompts, so run this only in the practice project, never in this site's repo.

### Read more

- [Clarify full handoff routing guidance, pull request #6687](https://github.com/stablyai/orca/pull/6687), AmethystLiang, 2026-06-29
- [Add version-matched skill guides to the CLI, pull request #8624](https://github.com/stablyai/orca/pull/8624), brennanb2025, 2026-07-13
- [Ship orca-cli as a first-generation hybrid stub, pull request #9238](https://github.com/stablyai/orca/pull/9238), brennanb2025, 2026-07-17
- [Per-launch model, permission mode and view for `worktree create --agent`, issue #25067](https://github.com/stablyai/orca/issues/25067), yamakura-yuma, 2026-10-03
- [Honor Chat UI setting for worktree agent creation, pull request #27796](https://github.com/stablyai/orca/pull/27796), brennanb2025, 2026-10-12
- [Orca skills registry & MCP](https://www.onorca.dev/docs/cli/skills), Stably, Inc., no date shown (fetched 2026-10-30)
- [Agents & sessions](https://www.onorca.dev/docs/model/agents-sessions), Stably, Inc., no date shown (fetched 2026-10-30)

## Remember

```flashcards
Q: What does orca-cli create in a full handoff?
A: A new Orca worktree, an agent started in it with your brief as its first prompt, and a report of the worktree's id and the agent's handle.

Q: Which words make an agent treat a request as a full handoff for orca-cli?
A: "hand off", "handoff", "handover", "give this to another agent" or "another worktree", unless you also ask it to supervise or wait for results.

Q: Which command prints orca-cli's real guide?
A: `orca skills get orca-cli`: it prints the guide that matches the installed Orca, since the Skill file is only a stub.

Q: How does Orca start a handed-off Claude Code agent by default?
A: With `--dangerously-skip-permissions`, so no approval prompts: Orca intends the worktree to be the sandbox. You can change the default in Settings → Agents, but a user found that change is global, not per launch.

Q: A handoff's launch reply is lost. What does the agent do?
A: Repeat the exact same command with `--retry-launch` and the same operation ID. Don't retry as a fresh launch: that could start a second agent. If replay says unknown or expired, inspect first.

Q: Where does orca-cli's full guide live, since July 2026?
A: Inside the `orca` program, printed by `orca skills get orca-cli`. The installed file went from 331 lines to a stub of under 80 lines then, and is 47 lines in the Course's pinned copy.
```

## Final test

```final-test orca-cli-what-it-does
You ask your agent in Orca to hand off a Ticket to another agent. What does orca-cli have it do?
- [x] Start another agent in a new Orca worktree with your brief, then stop.
- [ ] Set up a Run and a Task, then wait for the new agent's worker_done report.
- [ ] Write a Markdown summary of the session into your computer's temporary folder.
Why: A full handoff moves ownership to the new agent, so the first agent has nothing left to do. It stops once the new worktree's id and the agent's handle are reported and the brief arrived. It doesn't wait for the new agent to finish, because the work is no longer its own.
```

```final-test orca-cli-real-guide
Why does the agent run `orca skills get orca-cli` before any other Orca command?
- [x] The installed Skill file is only a stub; the real guide comes from the installed Orca.
- [ ] The command checks that the Orca app is running, and starts it when it's closed.
- [ ] The command installs the newest orca-cli Skill files into the agent's skill folder.
Why: A Skill file you install stays as it was, while Orca keeps changing. So the file is only a stub, and the agent asks the Orca program it will run for the guide that matches that version.
```

```final-test orca-cli-linux-orca-ide
On Linux, outside Orca's own terminals, why must the agent not run a bare `orca`?
- [x] There it usually starts the GNOME screen reader, which speaks aloud.
- [ ] There it opens a second copy of the Orca app beside the one already running.
- [ ] There it points at an older Orca build whose guide no longer matches.
Why: Two programs answer to the name `orca`. On Linux, outside Orca's terminals, the name normally means the GNOME screen reader, so running it starts speech on your machine. That's why the stub says to use `orca-ide` there.
```

```final-test orca-cli-deeper-why-stub
Why did Orca's developers turn orca-cli's installed file into a short stub in July 2026?
- [x] Installed copies were frozen, so their command guidance could drift from the Orca program.
- [ ] Agents loaded the long guide too slowly, so the file was cut to speed up their start.
- [ ] The skills installer refused long files, so the guide had to move into a website.
Why: A Skill file you install is a frozen copy, but the Orca program keeps changing, so the file's commands could go out of date. A stub avoids that. It asks the installed program for its guide, and that guide can't drift from the program it lives in.
```

```final-test orca-cli-deeper-chat-setting
Before a fix in October 2026, what went wrong when an agent handed off work with `orca worktree create --agent`?
- [x] The new agent could open in a terminal, even when the user's Chat UI setting asked for a chat.
- [ ] The new agent could open as a chat, even when the user's Chat UI setting asked for a terminal.
- [ ] The new agent started without its brief, so the user had to paste the first prompt in by hand.
Why: The command took worktree creation's own path to a terminal, and that path never read the Chat UI setting. Since the fix it goes through Orca's agent launch, the same one the app's new-agent tab uses, so the setting decides.
```

```final-test orca-cli-give-away-ticket
You're working in Orca on the yoga-studio API. A small Ticket, a health-check endpoint, is ready. You want another agent to own it in its own worktree while you carry on with something else. Nobody needs to watch it, wait for its result or answer its questions. Which fits best?
- [x] Start another agent in a new Orca worktree with a brief, then stop.
  > Right: that's `/orca-cli`.
- [ ] Have one agent supervise the new agent and wait for its report.
  > That's `/orchestration`. Supervision is for when you ask to monitor or wait for results. Here nobody does, so the guide sends the work to a plain handoff and makes no Run or Task.
- [ ] Write a summary document so a fresh session can pick up the work.
  > That's `/handoff`. It writes a document for the next agent to read. It doesn't start an agent in an Orca worktree.
Why: You're giving the work away and nobody will supervise, which makes it a full handoff: a new worktree, an agent started with the brief, and the first agent stops. Supervising would leave an agent waiting for a report nobody needs, and a summary document starts no agent.
```

```final-test orca-cli-three-supervised
In Orca, three Tickets of the yoga-studio API don't block each other. You want three agents on them at once, and one agent to wait for each to report back and to answer their questions as they come up. Which fits best?
- [x] Have one agent supervise three Orca workers, one per Ticket.
  > Right: that's `/orchestration`.
- [ ] Hand each Ticket to a new agent in its own worktree, then stop.
  > That's `/orca-cli`. A handoff stops once the brief arrives and doesn't wait for the new agent, so nobody collects the reports or answers questions.
- [ ] Write one summary document per Ticket for fresh sessions to read.
  > That's `/handoff`. Documents move the work, but nothing waits for results or answers questions.
Why: You asked for an agent that waits for reports and answers questions. That's supervision, which is orchestration's job. A full handoff can't do it, because the first agent stops as soon as the brief arrives.
```

```final-test orca-cli-colleague-laptop
Your Docker setup for the yoga-studio site is half done. Tomorrow a colleague will finish it with Codex on their own laptop, which doesn't run Orca. You want their session to know what was done and what's left. Which fits best?
- [x] Write a summary document you can send to their fresh session.
  > Right: that's `/handoff`.
- [ ] Start another agent in a new Orca worktree with a brief, then stop.
  > That's `/orca-cli`. It drives the Orca app on your machine. The work is leaving Orca for a colleague's laptop.
- [ ] Have one agent supervise a worker on the colleague's part.
  > That's `/orchestration`. Nobody needs to supervise, and supervision needs Orca's runtime, which the colleague's laptop doesn't run.
Why: The work is leaving Orca for a laptop that doesn't run it, so an Orca worktree on your machine wouldn't help. handoff fits because it saves one summary document in your own temporary folder, and you send that on.
```

```final-test orca-cli-why-stop
Your agent hands a booking-page Ticket to a new agent in its own Orca worktree, with a brief as its first prompt. Then it reports the worktree id and the agent's handle, and stops. Why is starting the new agent fresh, from the brief, a good thing? What's the reason behind this step?
- [x] The new agent starts from the brief, so it carries none of this session's history.
- [ ] So the new agent can be supervised later through the first agent's Run and its Tasks.
  > A handoff creates no Run, Task or Dispatch and doesn't monitor completion. Supervision is orchestration's job.
- [ ] So the first agent's terminals can be closed and its worktree removed safely.
  > The guide says the first agent stops because ownership moved. Its handoff section says nothing about closing terminals or removing worktrees.
Why: The brief is the new agent's first prompt, so it starts without this session's long history. Anything it needs from your branch goes in the brief. That's context hygiene: you choose what the new agent gets from this session.
```

```final-test orca-cli-deeper-task-row
In Orca you tell your agent: "Hand off the health-check Ticket to another agent, with a strong model and high effort." It starts a new agent in a new worktree with a brief. Then, "so it's tracked", it also runs `orca orchestration task-create` for the Ticket and stops. Orca's guide forbids that last step. Why? What's the reason behind this step?
- [x] A task row is coordinator-owned state, and a handoff has no coordinator once the first agent stops.
- [ ] A task row is fine, but only after the new agent has made its first commit in its new worktree.
  > Timing isn't the problem. The guide forbids task-create for every full handoff, because it records coordinator-owned tracking state.
- [ ] Asking for a model and an effort level made it supervised, so it needed a whole Run, not one task.
  > Model or effort selection doesn't make a handoff supervised. Nobody asked to monitor or wait for results, so it stays a plain handoff.
Why: A task row is state owned by a coordinator, but a full handoff leaves no coordinator: the first agent stops. So a June 2026 pull request forbade `task-create` for handoffs, and added tests for the wording. If you do need a task row, you were asking for supervision, and that's orchestration.
```

```sources
- [Orca skills registry & MCP — Orca Docs](https://www.onorca.dev/docs/cli/skills), Stably, Inc.
- [Agents & sessions — Orca Docs](https://www.onorca.dev/docs/model/agents-sessions), Stably, Inc.
- [handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/SKILL.md), Matt Pocock's Skills
- [Add version-matched skill guides to the CLI · Pull Request #8624 · stablyai/orca](https://github.com/stablyai/orca/pull/8624), brennanb2025, 2026-07-13
- [Clarify full handoff routing guidance by AmethystLiang · Pull Request #6687 · stablyai/orca](https://github.com/stablyai/orca/pull/6687), AmethystLiang, 2026-06-29
- [feat(skills): ship orca-cli as a first-generation hybrid stub · Pull Request #9238 · stablyai/orca](https://github.com/stablyai/orca/pull/9238), brennanb2025, 2026-07-17
- [git-worktree](https://git-scm.com/docs/git-worktree)
- [Run parallel sessions with worktrees (Claude Code Docs)](https://code.claude.com/docs/en/worktrees), Anthropic
- [Feature: Per-launch model, permission mode / agent args, and view (chat|terminal) for `worktree create --agent` and `terminal create` · Issue #25067 · stablyai/orca](https://github.com/stablyai/orca/issues/25067), yamakura-yuma, 2026-10-03
- [Getting Started With Ralph](https://www.aihero.dev/getting-started-with-ralph), Matt Pocock, 2026-01-08
- [fix(cli): honor Chat UI setting for worktree agent creation by brennanb2025 · Pull Request #27796 · stablyai/orca](https://github.com/stablyai/orca/pull/27796), brennanb2025, 2026-10-12
```
