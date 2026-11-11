---
title: claude-handoff: carry on in a background agent
slug: claude-handoff
summary: How claude-handoff writes up your conversation and starts a fresh Claude Code agent in the background with it, so you can carry on here.
image: /images/lessons/claude-handoff.jpg
imageAlt: A mural of a Pony Express rider arriving at a relay station, where he will switch to a fresh horse to carry the mail on.
---

## What it's for

Say you've settled every decision about [Ticket](/learn/issues-and-keeping-track) #13, the booking endpoint. Building should start now, but you want this session for other work. [handoff](/learn/handoff), a [Skill](/learn/skills) that writes the conversation up as a file, would leave you with a file and a session still to open.

```checkpoint quick-1
Your decisions are settled, and building should start now. Why isn't handoff enough?
- [x] It leaves you a file, with the next session still to open.
- [ ] It can't summarise a session once its decisions are settled.
- [ ] It publishes the summary as an Issue, rather than as a file.
Why: handoff would leave you with a file and a session still to open. You want building to start now, while this session does other work.
```

**claude-handoff hands your conversation to a fresh background agent now: a second agent that works while you carry on.**

For example, you type:

```
/claude-handoff build Ticket #13, the booking endpoint
```

The agent writes a handoff summary and saves it to your computer's temporary folder. Then it runs one command:

```
claude --bg --name "<descriptive name>" -- "$(cat <summary file>)"
```

`claude --bg` is the command that starts a Claude Code agent in the background. The last part reads the summary file in as that agent's first message, its prompt. The command returns at once.

```checkpoint quick-2
The launch command has just run. When do you get this session back?
- [x] At once, because the command returns straight away.
- [ ] When the new agent finishes, and has reported back here.
- [ ] When the new agent has read all of the summary file.
Why: The command returns at once, so nothing holds this session up while the new agent works.
```

Now two things run side by side: the new agent works in the background, and you carry on in this session. `claude agents` is the command that lists and manages background agents.

```checkpoint quick-3
The new agent is working in the background. How do you check on it?
- [x] Run `claude agents`, which lists and manages them.
- [ ] Run `claude --bg`, which starts another one.
- [ ] Ask in this session, since the new agent reports back here.
Why: `claude agents` is the command that lists and manages background agents. `claude --bg` is the one that starts them.
```

```diagram
type: chain
caption: "Now two things run side by side"
steps:
  - "The agent writes a handoff summary"
  - "saves it to your computer's temporary folder"
  - "it runs one command"
  - parallel: ["the new agent works in the background", "you carry on in this session"]
```

## When to use it

- You want the work to carry on now, in a new Claude Code session, while you keep this one.
- You want the next agent to start where you are: the folder you're in, the current working directory.
- You've settled the open decisions, so the new agent only has to build.

```checkpoint quick-4
You run claude-handoff from your repo's folder. Where does the new agent start?
- [x] In that folder, the current working directory.
- [ ] In the temporary folder, next to the summary.
- [ ] In your home folder, until a summary names a repo.
Why: The next agent starts where you are, which is the current working directory.
```

## When not to use it

- If you want a file for later, another [harness](/learn/context-hygiene) or a colleague, use [handoff](/learn/handoff) instead, because it writes a document and starts nothing.
- If you only need room in this session, use `/compact` instead, because it replaces the session's history with a summary.
- If you want a **full handoff**, giving another agent the work and ownership, then stopping, use [orca-cli](/learn/orca-cli) instead, because it does that in Orca, an app that runs agents side by side.

```checkpoint quick-5
You want another agent to own the work, and this one to stop. Which fits?
- [x] orca-cli, because that's a full handoff.
- [ ] claude-handoff, because you carry on here.
- [ ] `/compact`, because it swaps the history.
Why: A full handoff gives another agent the work and ownership, and the first agent stops. With claude-handoff you carry on working, and `/compact` only makes room in this session.
```

## What it needs to start

You need a conversation worth carrying on, in Claude Code. You install this Skill on its own, as the Try it step under Going deeper shows.

Only you can start it, by typing `/claude-handoff`; an agent never loads it on its own. Add what the next session is for, and the summary is shaped around that.

```checkpoint quick-6
Your session is getting long. Will the agent start claude-handoff by itself?
- [x] No. Only you can start it, by typing its name.
- [ ] Yes, once it decides the session has got too long.
- [ ] Yes, if your last message mentions a background agent.
Why: Only you can start it, by typing `/claude-handoff`. An agent never loads it on its own, however long the session gets.
```

## What it creates

- A handoff summary in your computer's temporary folder. Its "suggested skills" part names the Skills the next agent should load. It points at Specs, [Issues](/learn/issues-and-keeping-track) and commits by path or URL instead of copying them. It leaves out API keys, passwords and personal details, because the summary becomes the agent's prompt.
- A named background agent, started with that summary and listed in `claude agents`. The name, such as "Fix login bug", shows in the list `claude agents` prints and in the terminal title.

```checkpoint quick-7
Your Spec is already an Issue. What does the summary do with it?
- [x] It points at the Issue by URL, and copies nothing.
- [ ] It copies the Spec's whole text, so nothing is lost.
- [ ] It leaves it out, and names a Skill that can find it.
Why: The summary points at Specs, Issues and commits by path or URL instead of copying them.
```

## Going deeper

### Why it exists

[handoff](/learn/handoff) stops at a file. Nothing happens until you open a new session and point it at that file.

Matt Pocock, who wrote it, describes claude-handoff as "Identical to the existing `handoff` skill, with one substantive difference". The summary goes straight to a fresh background agent, as its first prompt.

So claude-handoff writes the summary, then starts the next agent itself. Until October 2026 it skipped the file. Today it saves one too, for a reason you'll see in A real example. What still sets it apart is that it starts the new agent.

```checkpoint quick-8
Both Skills now save the summary as a file. What still sets claude-handoff apart?
- [x] It starts the new agent itself, once the summary is written.
- [ ] It writes a longer summary, with more of the session copied in.
- [ ] It deletes the file as soon as the new agent has finished it.
Why: The file is no longer the difference. What still sets claude-handoff apart is that it starts the new agent.
```

claude-handoff sits in Matt's **in-progress** bucket, the folder for his beta Skills. They "can change or disappear without warning". They're left out of his plugin, a bundle of Skills you can install together, and they get no docs pages. So you install this one on its own.

```checkpoint quick-9
Why do you install claude-handoff on its own, and not with Matt's plugin?
- [x] It's a beta Skill, and those are left out of the plugin.
- [ ] It's a paid Skill, and those are sold outside the plugin.
- [ ] It's a private Skill, and only its folder holds a copy.
Why: Skills in Matt's in-progress bucket are beta. They're left out of his plugin and get no docs pages, so you install this one on its own.
```

Its future is still moving. An unmerged pull request would replace it with a `spawn` Skill that could also start Codex and other agents. Matt's comment on it: "Closing — rethinking whether a generic spawn skill makes sense."

### How it works underneath

**Don't count on a way back.** A handoff moves an agent's context from one session to another. Nothing from the old session is visible to the new one. Matt calls the constraint "No return path": the new session can't count on asking the old one what it meant. So the summary has to stand on its own.

```checkpoint quick-10
The new agent finds your summary unclear. Can it count on asking the old session what you meant?
- [x] No. Plan for no return path, so the summary must stand alone.
- [ ] Yes, because the old session answers every question it gets.
- [ ] Yes, because it starts with all of the old session's context.
Why: Nothing from the old session is visible to the new one, and it can't count on a way to ask. So the summary has to stand on its own.
```

**A file, then a prompt.** A file is one way to carry a summary: you can read and correct it before anything depends on it. claude-handoff saves a file, and the same text becomes the new agent's prompt. The new agent starts straight away, though, so you don't get that chance to correct it first.

**The launch line, piece by piece.** Here's the command again:

```
claude --bg --name "<descriptive name>" -- "$(cat <summary file>)"
```

- `--bg` starts a background session: a full Claude Code conversation that keeps running with no terminal attached.
- `--name` sets the name you see in `claude agents`.
- `--` stops a summary that starts with `-` being read as an option.
- `"$(cat <summary file>)"` passes the file's text as the prompt. The shell, the program running the command, doesn't re-read that text. So backticks (the ` character) in it don't run as commands, and `$` doesn't turn into a variable's value.

```checkpoint quick-11
A summary happens to start with `-`. Which part of the launch line protects it?
- [x] The `--` that comes straight before the summary.
- [ ] The `--bg`, which runs the line in the background.
- [ ] The `--name`, which gives the summary its own name.
Why: `--` stops a summary that starts with `-` being read as an option. `--bg` and `--name` do other jobs.
```

**Where the new agent works.** It starts in your working directory. Before it edits files, Claude Code moves it into its own [git worktree](/learn/branches-and-worktrees) under `.claude/worktrees/`. So parallel sessions can read the same checkout, but each writes to its own. That step is skipped when the session is already inside a linked worktree: then it edits that one.

```checkpoint quick-12
Two background sessions run in one repo. Why don't they write over each other's files?
- [x] Each one is moved into its own git worktree before it edits.
- [ ] The first one locks the checkout until it has finished work.
- [ ] The second one waits for the first one's pull request to merge.
Why: Before it edits files, Claude Code moves each session into its own git worktree. They can read the same checkout, but each writes to its own.
```

```diagram
type: chain
caption: "Before it edits files, Claude Code moves it into its own git worktree"
steps:
  - "It starts in your working directory."
  - label: "Claude Code moves it into its own git worktree under `.claude/worktrees/`"
    note: "That step is skipped when the session is already inside a linked worktree"
  - label: "parallel sessions can read the same checkout"
    note: "but each writes to its own"
```

**Keeping an eye on it.** `claude agents` opens **agent view**: one screen for what's running, what needs your input, and what's done. A session shows "Needs input" when it's waiting on something only you can provide, such as an answer to a question or a permission decision.

**Only you can start it.** The settings block at the top of `SKILL.md`, the file holding the Skill's instructions, has `disable-model-invocation: true`, so an agent can't load it on its own.

### A real example

The launch line looks the way it does because of a real bug. In July 2026, a user reported that the Skill put the summary straight into the command, inside double quotes. A summary can hold backticks and `$`, and inside double quotes the shell ran or expanded them. Nothing crashed. The user's example:

```
summary:         We changed `src/auth.ts` to fix the bug
claude receives: We changed  to fix the bug
```

The shell tried to run `src/auth.ts` as a command, then put nothing in its place. So the background agent started with a summary that had quietly lost part of its context.

```checkpoint quick-13
The shell can't run `src/auth.ts` as a command. What reaches the agent in its place?
- [x] Nothing. Those words vanish, and the summary loses context.
- [ ] The file's contents, read in from `src/auth.ts` by the shell.
- [ ] A warning in the prompt, so the agent knows words are missing.
Why: The shell tried to run it as a command, then put nothing in its place. So the summary quietly lost part of its context.
```

In October 2026 Matt changed the launch line to today's. The summary now goes in a temporary file, and reaches the agent as `"$(cat <file>)"` after `--`. His before-and-after test shows `src/auth.ts` and `$HOME` arriving intact. So this line is what stops a prompt quietly losing words.

### Where it goes wrong

**You're answering the same questions in two sessions.** You handed off with decisions still open, and the summary told the new agent to "put the open questions to the user and wait". The background agent is out of your line of sight, so any question it asks splits the decisions across two sessions. One user answered in the main session, and the main agent had to relay the answers. The Skill's file doesn't warn about this. So settle open decisions in the session you're talking to, and brief the background agent to build things only.

```checkpoint quick-14
You still have open decisions, and you want to hand off. What do you do first?
- [x] Settle them in this session, then brief the agent to build.
- [ ] Hand off now, and answer the agent's questions as they come.
- [ ] List them in the summary, and tell the agent to wait for you.
Why: The background agent is out of your line of sight, so its questions split the decisions across two sessions. Settle them where you're talking.
```

**The new agent re-opens decisions you'd settled.** Matt calls this relitigation. It happens when the summary recorded what was decided but not why. The new agent gets a summary in place of the session, and a summary loses detail. So read the saved summary, and if the why is missing, send it from agent view. Matt's test: "Judge a handoff by what a session with zero context could do with it."

```checkpoint quick-15
The new agent keeps re-opening decisions you'd settled. What's the likely cause?
- [x] The summary told it what was decided, but not the reason.
- [ ] The summary copied the session, so it re-read each step.
- [ ] The new agent started in a folder that didn't have the code.
Why: Matt calls this relitigation. It happens when the summary recorded what was decided but not why.
```

**The new agent may run on a different model.** Without `--model`, a background agent uses the CLI default, not the model from your current session. The Skill doesn't pass `--model`, so check which model it's on.

### Try it

Hand a small job to a background agent, then find its work. You need your practice project, with the endpoint that creates a booking. If you haven't built it, do [implement](/learn/implement)'s Try it step first. Step 1 uses `npx`, a command that runs a JavaScript package's tool without installing it.

1. In the repo's main worktree (the `yoga-studio` folder you cloned), not a linked worktree, run `npx skills@latest add mattpocock/skills --skill claude-handoff`.

   You should see it finish with no errors. If it asks which agent, choose Claude Code.

2. Start Claude Code: `claude`.
3. Say: "Let's plan an endpoint in `api/` that cancels a booking."
4. Answer its questions until no decision is left open.
5. Type `/claude-handoff write the failing test for cancelling a booking, then make it pass`.

   You should see the agent save a summary and start the new agent. Then this session is free again.

6. Open a second terminal in the repo, and run `claude agents`.

   You should see a new row with the new agent's name.

7. Select that row with the arrow keys, and press `Space`.

   You should see its latest output, or what it's waiting on. If it's a question, type a reply and press `Enter`. If it's a permission prompt, press `→` to open the session and answer it, then press `←` to come back.

8. When the row moves under the Completed or Ready for review heading, press `Esc` until agent view closes. If it moves under Needs input again first, repeat step 7.
9. Run `git worktree list`.

   You should see a worktree under `.claude/worktrees/`.

### Read more

- [The in-progress bucket README](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock
- [Add claude-handoff skill (in-progress), #421](https://github.com/mattpocock/skills/pull/421), Matt Pocock, 2026-07-02
- [feat(spawn): generalise claude-handoff into agent-agnostic spawn skill, #647](https://github.com/mattpocock/skills/pull/647), Matt Pocock, 2026-07-23
- [Feedback from using claude-handoff, #562](https://github.com/mattpocock/skills/issues/562), shihyuho, 2026-07-14
- [claude-handoff: pass the summary to claude --bg without shell interpolation, #1185](https://github.com/mattpocock/skills/pull/1185), Matt Pocock, 2026-10-06
- [claude-handoff: background agent asks the user open questions, splitting decisions across two sessions, #1307](https://github.com/mattpocock/skills/issues/1307), fabiandistlerkb, 2026-10-20
- [Handoff, AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/handoff), Matt Pocock
- [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view), Anthropic

## Remember

```flashcards
Q: What does claude-handoff create?
A: A handoff summary in your computer's temporary folder, and a named background agent started with it, listed in `claude agents`.

Q: Which command does claude-handoff use to start the new agent?
A: `claude --bg --name "<descriptive name>" -- "$(cat <summary file>)"`

Q: Why does claude-handoff always pass `--name`?
A: It sets the display name shown in the `claude agents` list, the session picker and the terminal title, so you can tell the agent apart.

Q: Why does claude-handoff leave secrets out of its summary?
A: Because the summary becomes the background agent's prompt.

Q: Which of Matt's buckets holds claude-handoff, and what does that mean?
A: In-progress, his beta bucket: left out of the plugin, no docs pages, and it can change or disappear without warning.

Q: What went wrong before claude-handoff passed its summary through a file?
A: The summary sat inside double quotes in the command, so the shell ran its backticks and expanded `$`. The agent got a silently cut-down prompt.

Q: Where does a `claude --bg` session make its file edits?
A: Normally in its own git worktree under `.claude/worktrees/`, which Claude Code moves it into before it edits files. There are exceptions: for example, a session already inside a linked git worktree edits that one.

Q: Where should open decisions stay when you hand off to a background agent?
A: In the session you're talking to. Brief the background agent to build things only.
```

## Final test

```final-test claude-handoff-after-the-summary
What does claude-handoff do once it has written its summary?
- [x] It starts a named background agent with `claude --bg`, using the summary as its prompt.
- [ ] It saves the summary in the repo's docs/ folder and waits for you to open a session.
- [ ] It publishes the summary as a new Issue, so the next agent can pick it up from there.
- [ ] It runs `/compact` on this session, so the summary replaces the history you have now.
Why: The point of this Skill is that the next agent starts for you. So it saves the summary to your computer's temporary folder, then starts a background agent with that summary as its prompt. The command returns at once, and you manage the new agent with `claude agents`.
```

```final-test claude-handoff-who-starts-it
How does claude-handoff get run?
- [x] You type `/claude-handoff` yourself; an agent never loads it on its own.
- [ ] An agent loads it by itself whenever the current session gets too long.
- [ ] Claude Code runs it for you each time you start a session with `--bg`.
Why: Its settings stop an agent loading it by itself, so it only runs when you type its name. You can add what the next session is for, and the summary is shaped around that.
```

```final-test claude-handoff-or-handoff
You want a file a colleague can carry on from tomorrow, in Codex. Which Skill fits?
- [x] handoff, which writes the summary as a document and starts nothing.
- [ ] claude-handoff, which writes the summary and starts a Claude Code background agent now.
- [ ] Neither; run `/compact` first, so the colleague gets this session's summary instead.
Why: Your colleague needs something that can travel to them and into Codex, and a file can. handoff writes that file and starts nothing. claude-handoff would start a Claude Code background agent on your machine right now, which doesn't help them.
```

```final-test claude-handoff-deeper-why-cat-file
Why does claude-handoff pass its summary as `"$(cat <summary file>)"` after `--`?
- [x] So the shell can't run backticks or expand `$` in it, which once silently cut words out.
- [ ] So the background agent reads the summary from disk later, instead of getting it as a prompt.
- [ ] So the summary is kept out of the `claude agents` list, where everyone on the machine could read it.
- [ ] So Claude Code picks the same model as this session, which an inline prompt would skip.
Why: Placed straight inside double quotes, a summary's backticks ran as commands and its `$` expanded, so words vanished with no crash. The shell doesn't re-read what `$(cat ...)` puts out, so the text now arrives whole. The `--` stops a summary that starts with `-` being read as an option.
```

```final-test claude-handoff-deeper-open-questions
One user ran claude-handoff with decisions still open. What went wrong?
- [x] The background agent asked the open questions too, so the decisions split across two sessions.
- [ ] The summary dropped the open questions, so the background agent built on the wrong guesses.
- [ ] The background agent started in the wrong folder, so its answers landed in another repo.
- [ ] The shell expanded the questions' backticks, so the agent got the questions cut in half.
Why: The summary told the new agent to put the open questions to the user and wait. The user answered in the main session instead, so the main agent had to relay the answers. Keeping open decisions in the session you're talking to avoids that split.
```

```final-test claude-handoff-start-building-now
In Claude Code, you and the agent have settled every decision about a cancel-booking endpoint for your FastAPI backend. You want a fresh agent to start building it right now, in the background, while you review another pull request in this session. Which fits best?
- [x] Write a summary and start a named background agent seeded with it.
  > Right: that's `/claude-handoff`.
- [ ] Write a summary document to the temporary folder for a later session.
  > That's `/handoff`. It only writes the file. You'd still have to open the next session yourself, so nothing starts building now.
- [ ] Send a background agent to read the docs and write cited notes.
  > That's `/research`. research investigates a question against primary sources. It doesn't carry this session's plan on into building.
Why: You want building to start now, and this session free. Of these three, only claude-handoff both carries this conversation over and starts an agent with it at once. handoff stops at a file, and research starts on a question of its own.
```

```final-test claude-handoff-colleague-tomorrow
You've spent the afternoon planning booking reminders for the yoga studio's backend in Claude Code. Tomorrow a colleague will carry on in Codex, on their own laptop, and needs to know where you got to. Which fits best?
- [x] Write a portable summary document that the colleague can open in Codex.
  > Right: that's `/handoff`.
- [ ] Write a summary and start a Claude Code background agent with it now.
  > That's `/claude-handoff`. That starts a Claude Code agent on your machine today. Your colleague needs a file that travels to another harness.
- [ ] Publish the reminders plan as a Spec on the issue tracker for the team.
  > That's `/to-spec`. A Spec describes the feature to build. It isn't a way to carry this session's state to someone else.
Why: Your colleague works tomorrow, on their own laptop, in another harness. A file can travel that far, and a portable file is what handoff writes. A background agent would run on your machine today, and a Spec describes the feature, not where you got to.
```

```final-test claude-handoff-reading-job
You're coding the yoga studio's booking endpoint. You want an agent in the background to read FastAPI's official docs on background tasks and leave a cited Markdown note in the repo, while you keep coding here. Which fits best?
- [x] Send a background agent to read primary sources and write a cited file.
  > Right: that's `/research`.
- [ ] Write a summary of this session and start a background agent with it.
  > That's `/claude-handoff`. That carries this conversation on in a new session. A reading job with a cited note at the end is a separate task.
- [ ] Write a summary document of this session for a later agent to read.
  > That's `/handoff`. Nothing here needs to travel. The job is fresh reading, not carrying this session somewhere else.
Why: This is a fresh reading job, not this conversation carrying on, so no summary of this session is needed. research sends a background agent to read primary sources and leave a cited file, and you keep coding while it reads.
```

```final-test claude-handoff-why-no-copies
You ran the background handoff with a Spec Issue and three Ticket Issues already on GitHub. The summary it wrote only links to them by URL instead of copying their text in. Why is that the right call?
- [x] The Issues already hold that text; the summary points at them and stays short.
- [ ] The background agent can't read long prompts, so the summary has to stay under a page.
  > Nothing in the Skill limits the prompt's length. It says to reference existing artifacts instead of duplicating them.
- [ ] Copying Issues into the summary would publish them again as new Issues on GitHub.
  > The summary is a file in the temporary folder and the agent's prompt. It publishes nothing.
Why: Those Issues already hold the text, so copying it would only make the summary longer. The Skill says to point at what's already written, by path or URL. The new agent starts from a short summary and reads the rest where it lives.
```

```final-test claude-handoff-deeper-decisions-still
Planning a waitlist for full yoga classes, two decisions are still open: how long a held spot lasts, and who gets told. You want a background agent to build the waitlist. You settle both decisions in this session before handing off. Why?
- [x] The background agent is out of your line of sight, so its questions would split the decisions across two sessions.
- [ ] A background agent can't put questions to you at all, so any decision left open in the summary would be dropped.
  > It can ask: agent view shows a session as Needs input when it waits on an answer only you can give. The trouble is that you'd be answering in two places.
- [ ] Open questions would make the summary too long to pass through the shell safely as the new agent's first prompt.
  > Passing the summary file to `claude --bg` is about backticks and `$`, not length. The trouble is where the answers would have to go.
Why: A background agent is out of your line of sight, so any question it asks starts a second conversation about the same decisions. One user answered in the main session, and the main agent had to relay the answers. Settling them first keeps every decision where you're talking. The Skill doesn't warn about this, so it's up to you.
```

```sources
- [claude-handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/claude-handoff/SKILL.md), Matt Pocock's Skills
- [handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [Compaction | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/compaction), Matt Pocock
- [Manage multiple agents with agent view - Claude Code Docs](https://code.claude.com/docs/en/agent-view), Anthropic
- [Add claude-handoff skill (in-progress) #421](https://github.com/mattpocock/skills/pull/421), mattpocock, 2026-07-02
- [claude-handoff: pass the summary to claude --bg without shell interpolation #1185](https://github.com/mattpocock/skills/pull/1185), mattpocock, 2026-10-06
- [skills/skills/in-progress/README.md at a496f55 · mattpocock/skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [feat(spawn): generalise claude-handoff into agent-agnostic spawn skill #647](https://github.com/mattpocock/skills/pull/647), mattpocock, 2026-07-23
- [Handoff | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/handoff), Matt Pocock
- [Feedback from using claude-handoff #562](https://github.com/mattpocock/skills/issues/562), shihyuho, 2026-07-14
- [claude-handoff: background agent asks the user open questions, splitting decisions across two sessions #1307](https://github.com/mattpocock/skills/issues/1307), fabiandistlerkb, 2026-10-20
- [research: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/research/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
```
