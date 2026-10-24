---
title: How coding agents work
slug: how-agents-work
order: 1
part: 1
image: /photos/how-agents-work.jpg
imageAlt: Two robotic arms with grippers pick items out of trays on an automated workstation.
imageCredit: Franck V.
---

Know what really happens between the sentence you type and the code that appears, and which controls keep you in charge of it.

```goals
- You'll be able to explain how a model, a harness and the loop of tool calls between them turn one sentence into finished work.
- You'll be able to pick a permission mode for a task, switch to it with Shift+Tab, and answer plan mode's approval menu.
- You'll be able to decide which lines belong in `CLAUDE.md` and which don't.
- You'll be able to undo the agent's file edits with Esc Esc or `/rewind`, and say what a checkpoint can't undo.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that works in your terminal, reads your project's files, runs commands and writes code. You type one sentence, say "the comments API test is failing, fix it", and your screen fills with lines you didn't write: a read, a search, a shell command, an edit, another command. A few minutes later it says it's done.

If you don't know what those lines are, you either approve every request unread or panic and stop it halfway. Either way you aren't steering. Worse, you can't tell a real result from a confident sentence: an agent can write "I ran the tests and they pass" without having run anything.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code (short instruction files the agent loads when you type their name, like `/grill-me`), describes agents as decent engineers with one big flaw: no memory. This Lesson gives you the parts list behind that picture: what thinks, what acts, how much it may do without asking, how to give it standing instructions, and how to step back.

## The idea: a model inside a harness

Three words do most of the work.

- **The model** is the AI itself (Claude). It does one thing: text in, text out. On its own it can't open a file, run a command or remember your last message.
- **The harness** is everything wrapped around the model that lets it act: the tools it can call, the system prompt (standing instructions sent with every request), the permission checks, and the management of its context window (everything the model can see at once, measured in tokens, the small chunks of text AI usage is counted in; see [The context window](/learn/context-window)). Claude Code is a harness. So is the Claude.ai chat app, which is why ==the same model behaves differently== in each: same brain, different hands.
- **The agent** is the two together, taking turns with you. When people say "Claude Code", they usually mean this.

The model acts through **tool calls**. A tool call is a line of structured text naming a tool and what to pass it: run this command, read this file. The model writes it and stops. Claude Code reads the call, checks it against your permission settings, runs it if allowed, and sends the output back to the model as a **tool result**. The model reads the result and decides the next step. That cycle is ==the agent loop==, and it repeats until the model answers with words instead of another call.

One **turn** is your message plus everything the agent does before it hands control back, often dozens of tool calls. Claude Code's docs describe the loop as three blended stages: gather context, take action, check the result. Each result shapes the next step: run the tests, read the error, find the file, edit it, run the tests again.

Two things follow. First, if no tool call happened, nothing happened, whatever the reply says. Second, ==every session starts blank==. A session is one Claude Code conversation, from starting `claude` until you clear it or quit, and the next one remembers nothing of it unless something was written to a file. In January 2026 Matt pictured a colleague who forgets everything about the project each time they commit.

```scene flow
title: One request, many trips round the loop (illustrative)
node: you | You type a request
node: model | The model picks the next step
node: call | It writes a tool call
node: harness | Claude Code checks and runs it
node: result | The result goes back to the model
node: done | It hands control back to you
# You type: "The comments API test is failing. Fix it." That starts a turn.
at: you
# The model can't see your project yet. It decides the first step: run the tests to see the error.
at: model
# It writes a tool call: a line of text naming the shell tool and the command to run. Then it stops.
at: call
# Claude Code checks the call against your permission mode, asks you if it needs to, and runs it.
at: harness
# The error output goes back to the model. Next it searches, reads the file, edits it, runs the tests again: each one more trip round the same loop.
at: result
# The tests pass, so the model writes a reply instead of another tool call. The turn is over.
at: done
```

```checkpoint same-model
A friend pastes "fix the typo in my README" into the Claude.ai chat app and gets corrected text to copy. In Claude Code, the same request changes the file itself. Both use the same model. Why the difference?
- [ ] Claude Code runs a larger, smarter model behind the scenes.
  > The model is the same. What differs is everything wrapped around it.
- [ ] The chat app hides the edit until you approve it.
  > The chat app has no tool for editing your files at all.
- [ ] Claude Code remembers your README from an earlier session.
  > Sessions start blank. It found the file by calling tools, this time.
- [x] Claude Code gives the model tools; the chat app doesn't.
  > Right. Same model, different harness. Claude Code runs the tool calls the model writes, so it can read and edit your files.
```

## Tools: what the agent can reach

Claude Code's docs group its built-in tools into five families:

| Family | Tools | What it's for |
|---|---|---|
| Files | `Read`, `Edit`, `Write` | Read, change and create files |
| Search | `Glob`, `Grep`, or `find` and `grep` through Bash | Find files by name, search inside them |
| Execution | `Bash` | Any command you could type: tests, git, a dev server |
| Web | `WebSearch`, `WebFetch` | Search the web, read a page |
| Code intelligence | Added by a plugin | Type errors, jump to a definition |

On top sit orchestration tools: `Agent`, which starts a sub-agent (a helper agent with its own fresh context window that does one job and reports back a summary), a tool for asking you multiple-choice questions, and a to-do list. MCP servers (plug-ins that connect the agent to outside systems, like a database host) add tools of their own, and Skills add instructions; see [Skills](/learn/skills).

The tools differ in whether they ask first. In Manual mode (more on modes below), reading and searching inside your project folder never asks. Editing a file asks. Shell commands ask, apart from a built-in list of read-only ones. The split is deliberate: a read can't hurt you, but `Bash` can do anything you can.

Three keys let you watch and steer mid-loop. **Ctrl+O** opens the transcript, showing every tool call and its result. **Esc** stops the agent straight away. And if you type a message while it works, it's queued and read as soon as the current tool calls finish.

```checkpoint manual-runs-free
You're in Manual mode. Which of these tool calls runs without stopping for your approval?
- [x] Reading a file inside your project folder.
  > Right. Reads and searches inside the project never ask: they can't change anything.
- [ ] Editing a single line of a file it has just read.
  > Edits ask in Manual mode, however small.
- [ ] Running `npm install` to add a package.
  > Shell commands ask, apart from a built-in list of read-only ones. Installing a package changes your project.
- [ ] Deleting a temporary file with `rm`.
  > A shell command that deletes things isn't read-only, so it asks first.
```

## Permission modes: how much it does without asking

A permission mode is the session's baseline for which tool calls run on their own and which stop for your approval. Press **Shift+Tab** to cycle through them; the label under the prompt box shows the current one. (In the desktop app, use the mode selector next to the send button.)

| Mode (setting name) | Runs without asking | Use it for |
|---|---|---|
| Manual (`default`) | Reads only | Reviewing every action; sensitive work |
| Accept edits (`acceptEdits`) | Reads, file edits, and simple file commands like `mkdir` and `mv` | Iterating on code you'll review afterwards |
| Plan (`plan`) | Reads and exploring; no edits until you approve a plan | Looking before anything changes |
| Auto (`auto`) | Almost everything; a second model, the classifier, checks each action against your request and blocks risky ones | Long tasks with fewer interruptions |
| Bypass permissions (`bypassPermissions`) | Everything | Isolated containers and virtual machines only |

Since Claude Code 2.1.283, ==new sessions start in auto mode== unless your organisation has switched it off, and the label reads "auto mode on". (This course was checked on 2.1.309, in October 2026.) So a fresh session won't stop to ask before editing. If you'd rather approve each step while you learn, press Shift+Tab: from auto, the first press goes to Manual, then Accept edits, then Plan, then the optional modes.

When a mode does ask, you get a permission prompt: allow the call, or say No (Esc does the same). A No isn't a dead end: the model reads your refusal as a tool result and changes course, and a few added words ("no, use the existing helper") steer it. If a harmless prompt keeps coming back, add an allow rule with `/permissions`, say for your test script. Deny rules block in every mode.

Picking a mode is a trade. Too tight and you approve on autopilot; Anthropic's best-practices guide warns: "After the tenth approval you're clicking through rather than reviewing." Matt's AI Coding Dictionary calls that rubber-stamping: you get the interruptions and lose the protection. Too loose and the agent does things you'd have wanted to see first. His ladder loosens as trust grows: plan while the approach takes shape, Manual for the first delicate edits, Accept edits once it has shown it understands, Bypass only for unattended runs in a sandbox. Switching modes never resets the conversation.

```callout watch-out
Bypass permissions (the `--dangerously-skip-permissions` flag) runs every tool call with no checks at all. The docs say to use it only in isolated containers or virtual machines, where a bad command can't reach your real files. On your own laptop, auto mode or a few allow rules cut the prompts without removing the safety net.
```

```checkpoint fresh-session-edits
You start Claude Code in a new folder, ask for a small script, and it creates the file without asking you. Nothing is broken. What's going on?
- [ ] It's in Bypass permissions, which every session starts in.
  > Bypass is never the starting mode; you have to turn it on.
- [x] New sessions start in auto mode; Shift+Tab reaches Manual.
  > Right. In auto mode the classifier approves actions that fit your request. One Shift+Tab takes you to Manual, which asks before edits.
- [ ] Creating new files never needs permission, in any mode.
  > In Manual mode, creating a file asks first, like any edit.
- [ ] It's in plan mode, which writes files as it works out the plan.
  > Plan mode blocks edits to your files until you approve a plan.
```

## Plan mode and the approval menu

Plan mode does two things. It blocks edits to your files, and it tells the agent it's planning, so instead of pushing against the block it explores, asks about anything unclear and writes a plan to a file (under `~/.claude/plans/`). There are three ways in: press Shift+Tab until the label says "plan mode on", start a single message with `/plan`, or launch with `claude --permission-mode plan`.

When the plan is ready, an approval menu appears:

- **Yes, and use auto mode**: approve and let it build without routine prompts.
- **Yes, manually approve edits**: approve, then review each edit as it comes.
- **No, keep planning**: stay in plan mode and say what to change.

Approving ends plan mode and switches to the mode you picked. Press Ctrl+G first if you'd rather edit the plan yourself. The docs' suggested workflow for anything complex is explore, then plan, then code.

```scene chat
title: Plan mode on this site (illustrative)
# You press Shift+Tab until the label says plan mode on, then describe the change.
you: Plan how to show an estimated reading time under each Lesson title. Keep it small.
# It explores first. Reads and searches run freely; edits are blocked.
agent: Reading how Lesson pages are built from the Markdown files in `content/lessons/`…
# Before it finishes, it asks about a decision your sentence left open.
agent: Should the estimate count only the prose, or code blocks too?
# You answer, and it writes the plan to a file you can open.
you: Only the prose. Round to whole minutes.
agent: **Plan:** count the prose words when a Lesson loads, show "6 min read" under the title. One file changed, one test added.
# Then the approval menu appears.
agent: 1 Yes, and use auto mode · 2 Yes, manually approve edits · 3 No, keep planning
# You pick 2. Plan mode ends, and the first edit stops for your approval.
you: 2
agent: I'd like to edit `src/lessons/lessons.ts`. Allow this edit?
```

**Matt changed his mind about plan mode, and you should know both halves.** In January 2026 every piece of code he wrote went through it: plan with the AI, have it carry out the plan, test, commit, repeat. Two `CLAUDE.md` lines kept his plans short: make plans extremely concise, and end each with a list of unresolved questions. By April 2026 he'd stopped. On X he wrote that it "creates a plan FAR too eagerly and usually asks you zero questions", when planning should get you on the same wavelength, not produce a document nobody reads. He still plans heavily, but by being interviewed with his grilling Skills, with plan mode off; see [Grilling](/learn/grilling).

So use plan mode when you want the agent to look before it touches anything, on a change you've already decided. When you haven't decided *what* to build yet, grill first.

```checkpoint plan-wrong-scope
Plan mode has produced a plan for a "save for later" button on a recipe site. It assumes saved recipes need user accounts, which you don't want in v1. The menu is on screen. What do you pick?
- [ ] Yes, and use auto mode, then fix the accounts part afterwards.
  > Then it builds accounts first. Changing a plan costs one sentence; changing code costs a rebuild.
- [ ] Yes, manually approve edits, and reject the account edits one by one.
  > You'd be fighting a plan you never agreed to, edit by edit. Fix the plan instead.
- [x] No, keep planning, and say saved recipes stay in the browser.
  > Right. Stay in plan mode and correct the assumption. Approve only a plan you agree with.
- [ ] Press Esc twice to rewind to before the plan.
  > Nothing has been built yet, so there's nothing to rewind. Correct the plan.
```

## CLAUDE.md: standing instructions

Because every session starts blank, Claude Code reads a few files at the start of each one. The main one is `CLAUDE.md`, a Markdown file you write. Its contents go into the context window every session, and the project's copy is reloaded after `/compact` (the Built-in command that shrinks a long conversation into a summary), so its lines outlast anything said only in chat.

| File | Applies to |
|---|---|
| `~/.claude/CLAUDE.md` | You, in every project |
| `CLAUDE.md` in the project folder | Everyone working on this repo (a project folder tracked with git), shared through git |
| `CLAUDE.local.md` | Just you, in this project; keep it out of git |

`AGENTS.md` is the same idea under a name other agents read too. `/memory` shows which files loaded, and `/init` writes a starter file. Separately, Claude keeps auto memory: notes it writes itself about your project.

What belongs in it? The docs and Matt agree on what to keep, and disagree on how much.

- **The docs** suggest keeping it under 200 lines, because longer files cost more context and get followed less reliably. For each line, ask whether removing it would cause mistakes. Keep commands it can't guess, rules that differ from the usual defaults and the project's gotchas; leave out anything it can learn by reading the code.
- **Matt** goes further. In February 2026 he argued you should never run `/init`, and should delete any `CLAUDE.md` an agent wrote. Every line costs tokens on every request, a model can only follow so many instructions at once, and descriptions of files go stale. His own file was one line saying he works on WSL (Linux inside Windows). Steering that only matters sometimes belongs in Skills, which load only when needed. Anthropic's July 2026 advice on context leans the same way.

A good trigger, from Matt's dictionary: ==if you've corrected the agent on the same thing twice==, that correction is a candidate line.

```checkpoint claude-md-line
Which of these lines earns its place in a project's `CLAUDE.md`?
- [ ] "This is a Next.js project written in TypeScript."
  > The agent sees that in seconds from the project's files. A line it can discover is a line you pay for in every session.
- [ ] "Write clean, well-tested, high-quality code."
  > Too vague to change anything the agent does. Removing it wouldn't cause a single mistake.
- [ ] A paragraph describing what each folder contains and which file does what.
  > It's discoverable by looking, and it goes stale as soon as the folders change.
- [x] "Run `npm run test:unit`; plain `npm test` empties the shared database."
  > Right. It can't guess this, it matters in every session, and getting it wrong is costly.
```

## Checkpoints: stepping back

Before each prompt you send, Claude Code records a checkpoint, and it snapshots files before its file tools change them. To step back, press **Esc twice** with the prompt box empty, or type `/rewind`. Pick the prompt to return to, then restore the code and the conversation, only the conversation, or only the code. (You can also summarise part of the conversation to free up room.) Restoring only the code suits edits that went wrong when you still want to explain what you meant. Or just ask: "undo that."

Checkpoints have hard limits. They don't undo:

- changes made by shell commands, like `rm`, `mv` or a script that rewrites files;
- edits made outside Claude Code, by you or another program;
- most edits made by sub-agents;
- anything remote: a database row, a pushed commit, a deploy, a sent message.

==Checkpoints are not version control.== Keep committing with git, the tool that records your project's history.

```scene terminal
title: Rewinding edits you didn't want (illustrative)
# The agent has changed two files with its file tools, and you don't like the direction.
$ git status
modified:   src/lessons/lessons.ts
modified:   src/app/learn/[slug]/page.tsx
# Back in Claude Code, with the prompt box empty, you press Esc twice. The menu lists the prompts you sent this session; you pick the one just before the edits.
Plan how to show an estimated reading time under each Lesson title.
# Then you choose what to restore.
Restore code and conversation
Restore conversation
Restore code
Summarize from here
Summarize up to here
Never mind
# You choose Restore code. The files go back, and the conversation stays, so you can explain what you meant instead.
$ git status
nothing to commit, working tree clean
```

```callout big-idea
Permissions and checkpoints work as a pair. Rewind covers the agent's file edits, so the prompts worth reading most carefully are the ones it can't reach: shell commands, and anything that leaves your machine.
```

## How Matt and others use it

**Matt Pocock**

- **Plan mode, January 2026.** In his plan mode video he dictated a bug in plan mode. The agent sent an Explore sub-agent on the cheaper Haiku model to read the code (about 40,000 tokens), then wrote a plan and asked him something his two-line prompt hadn't covered.
- **Grilling in auto mode, July 2026.** In his end-to-end walkthrough he grilled with plan mode off, in auto mode, which he called "kind of like the default mode".
- **A nearly empty `CLAUDE.md`.** In February 2026 his only line was about WSL; he relies on the agent exploring each repo for itself.
- **Reads free, irreversible actions gated.** His dictionary (September 2026) notes that most people auto-approve reads and keep a human in the loop for anything that can't be undone.

**Others**

- **Anthropic's best practices:** explore, plan, then code; correct course early with Esc, Esc Esc or "undo that"; after two failed corrections, `/clear` and start again with a better prompt, because failed attempts clutter the context.
- **Plan mode versus grilling** is a common comparison now. AI Coding Daily published "I Tried 'grill-me' Skill for Plan Mode" in April 2026, and a Hacker News commenter reported reaching for `/grill-me` more and more instead of plan mode.

## Try it yourself

````try
You need Claude Code installed and signed in, plus git (see [Start here](/learn/start-here)). Nothing here needs Matt's Skills, and you'll rewind everything you change.

1. Get this site's code and start Claude Code in it. If it asks whether you trust the folder, choose Yes.

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped && cd idea-to-shipped && claude
```

2. Look under the prompt box. It probably says "auto mode on". Press Shift+Tab until it shows Manual.
3. Watch the loop without changing anything. Type the prompt below, then press Ctrl+O to see each tool call (Ctrl+O again to go back).

```text
Without changing anything, find where Lesson pages are loaded from Markdown and explain the flow in five bullets.
```

4. Press Shift+Tab until you see "plan mode on", then type:

```text
Plan how to show an estimated reading time under each Lesson title. Keep it small, and ask me anything you're unsure about.
```

5. Answer its questions and read the plan. At the menu, pick **Yes, manually approve edits**.
6. Approve its first file edit, then press Esc to stop it. If it asks to run a command first, choose No.
7. With the prompt box empty, press Esc twice. Pick the prompt from step 4, then **Restore code**. Type `!git status` (the `!` runs a shell command yourself).
8. Type `/memory` to see which `CLAUDE.md` files loaded, then `/exit`.

**It's working if:**

- [ ] In step 3, it chained several reads and searches without asking you.
- [ ] Ctrl+O showed each tool call and its result.
- [ ] Plan mode showed you a plan and the approval menu before any file changed.
- [ ] You saw at least one permission prompt and chose an answer.
- [ ] After Restore code, `git status` showed no changes. If something is still listed, a shell command made it, which rewind can't reach; `git restore .` puts changed files back.
- [ ] `/memory` listed the project's `CLAUDE.md`.
````

## Common mistakes

- **Rubber-stamping prompts.** If you click Yes without reading, switch to a looser mode or add allow rules instead. At least then you chose what runs freely.
- **Believing a claim with no tool call behind it.** "I ran the tests" means nothing if Ctrl+O shows no test run.
- **Expecting it to remember yesterday.** Put what must carry over in `CLAUDE.md`, or in a file the next session reads.
- **Accepting a plan that asked you nothing.** That's Matt's complaint about plan mode. Read the plan, and choose "No, keep planning" wherever it guessed.
- **Everything else from above:** Bypass on your own machine, a stuffed `CLAUDE.md`, and treating rewind as undo for everything.

```site-story
I started this site's first build session in plan mode. I described the idea, it asked me multiple-choice questions, and it wrote a plan file: "smallest thing that works" as the guiding rule, the stack, and one Skill per Lesson. I typed `/plan` to see the plan and where it was saved, and told it to keep asking questions. Then I approved the plan, the session switched to auto mode, and I typed `/grilling`. The rest of the build ran in auto mode.

The project's `CLAUDE.md` is 17 lines. `/setup-matt-pocock-skills` wrote most of it: where the issue tracker lives, the labels for sorting issues, and where the glossary and decision records go. The rest points the agent at `AGENTS.md`, a file of notes about the newer Next.js this site uses. Nothing in it describes the code; the agent reads the code for that.

This course rewrite started the same way: I grilled the plan in plan mode, in one session. Then I split the work into two sessions running side by side, one building the engine for the Scenes, Checkpoints and Final tests, the other writing the Lessons. They don't share a context window, so they share a written contract instead.
```

## Cheat sheet

| You want to… | Do this |
|---|---|
| See what it's doing | Ctrl+O |
| Stop it now | Esc |
| Change how much it asks | Shift+Tab (from auto: Manual → Accept edits → Plan → …) |
| Look before anything changes | Plan mode, or start one message with `/plan` |
| Approve a plan and review each edit | **Yes, manually approve edits** |
| Change the plan | **No, keep planning** |
| Stop a harmless prompt repeating | An allow rule via `/permissions` |
| Give it a standing instruction | One short line in `CLAUDE.md` |
| See which instruction files loaded | `/memory` |
| Undo its file edits | Esc Esc or `/rewind`, then Restore code |
| Undo a shell command or a deploy | Git or the remote system; rewind can't |

## Final test

```test predict-loop
You type "the signup page crashes on submit, fix it" and Claude Code starts working. What happens next?
- [ ] The model loads the whole project into memory once, then writes the fix from what it remembers.
  > The model only sees what tool results bring in. It reads files one call at a time, as it needs them.
- [x] It calls a tool, gets the result back, picks the next step, and repeats until it can answer.
  > Right. That's the agent loop: each result (an error, a file's contents) shapes the next call, until the model replies with words instead.
- [ ] Claude Code runs every tool it has, then sends the model one big summary at the end.
  > The harness runs only the calls the model writes, one round trip at a time.
- [ ] The model edits the files directly, and Claude Code shows you the changes afterwards.
  > The model can't touch files. It writes a tool call; Claude Code checks it and runs it.
```

```test spot-no-tool-call
Ana asks the agent to run her tests. It replies "Done: all 42 tests pass." Ctrl+O shows its last tool call was an edit, with nothing after it. Spot the mistake.
- [ ] Ana should have used plan mode, which shows test output in full.
  > Plan mode blocks edits; it doesn't change how test output appears.
- [ ] The tests ran too fast for the transcript to record them.
  > Every tool call the harness runs appears in the transcript, fast or not.
- [x] It never made the tool call, so nothing ran.
  > Right. A tool call is text the harness must execute. No call, no run, whatever the reply says.
- [ ] Claude Code ran the tests in the background without logging them.
  > The harness runs only calls the model writes, and the transcript shows each one.
```

```test scenario-unfamiliar-repo
You've cloned a friend's project you've never seen. You want the agent to study it and propose how to add a dark theme, without changing a single file yet. What do you do?
- [x] Press Shift+Tab until "plan mode on", then describe the change.
  > Right. Plan mode blocks edits and tells the agent to explore and propose. Nothing changes until you approve.
- [ ] Switch to Accept edits so it can try a few approaches quickly.
  > Accept edits approves file changes automatically: the opposite of what you want.
- [ ] Stay in auto mode, because its classifier stops it from editing files.
  > The classifier blocks risky actions, not edits that fit your request. In auto mode it may well start building.
- [ ] Turn on Bypass permissions so it can explore without interruptions.
  > Bypass runs everything without asking, edits included, and belongs in throwaway containers only.
```

```test scenario-style-tweaks
You're adjusting a site's spacing and fonts, and you'll review every change with `git diff` (git's list of what changed) afterwards. You're tired of approving each edit, but you still want to be asked before it runs any other command. Which mode?
- [ ] Bypass permissions
  > That runs every command without asking too, and it's for isolated containers only.
- [ ] Plan
  > Plan mode blocks edits until you approve a plan; it won't tweak anything as you go.
- [ ] Manual
  > Manual is what you're tired of: it asks before every edit.
- [x] Accept edits
  > Right. File edits and simple file commands go through on their own; other shell commands still ask.
```

```test scenario-repeat-correction
For the third session running, you've had to tell the agent "this project uses pnpm, not npm". Your other projects all use npm. Where should that fact live?
- [ ] At the top of every prompt you type in this project.
  > It works, but you'd have to remember every time. A file read at the start of each session remembers for you.
- [x] One short line in this project's `CLAUDE.md`.
  > Right. It's a repeated correction, and it applies to every session in this repo and no other.
- [ ] Your global `~/.claude/CLAUDE.md`, so it's never forgotten anywhere.
  > That file applies to every project, and your others use npm. Keep project facts in the project's file.
- [ ] A fresh `CLAUDE.md` generated by `/init`, with the rest of the setup.
  > `/init` writes a long file of mostly discoverable detail. You need one line, not a dump.
```

```test scenario-undo-edits
The agent used its file tools to change three files, and you don't like the direction. You want the files back as they were, but you want to keep the conversation so you can explain what you meant. What do you do?
- [ ] Type `/clear` and describe the task again.
  > `/clear` empties the conversation and leaves the files as they are: the opposite of what you want.
- [ ] Press Esc twice, pick your earlier prompt, choose Restore conversation.
  > That rewinds the chat but keeps the current code.
- [x] Press Esc twice, pick that prompt, choose Restore code.
  > Right. Restore code reverts the file-tool edits and keeps the conversation.
- [ ] Type `/compact` so it forgets the bad approach.
  > `/compact` summarises the conversation; it doesn't touch any files.
```

```test spot-bypass-laptop
Jo found the permission prompts annoying, so she turned on Bypass permissions on the laptop she uses for everything. Spot the mistake.
- [x] Bypass is for isolated containers; on her laptop, use auto or allow rules.
  > Right. Bypass runs everything without checks. Auto mode's classifier or a few allow rules cut prompts and keep a safety net.
- [ ] Bypass still asks before edits, so it won't actually cut the prompts.
  > It asks before nothing; that's the danger.
- [ ] She should have switched to Plan, which never asks for anything.
  > Plan mode blocks edits until you approve a plan. It's for looking, not for fewer prompts while building.
- [ ] Bypass only lasts for one session, so she'll have to switch it on again every day.
  > How long it lasts isn't the problem. Running everything unchecked on a machine with all her files is.
```

```test spot-rm-rewind
Sam asked the agent to tidy up, and it ran `rm -r drafts` in the shell. Sam pressed Esc twice and chose Restore code, expecting the folder back. Spot the mistake.
- [ ] He should have chosen Restore code and conversation, which brings back every kind of change.
  > Both code options restore only what the file tools changed. A shell command isn't tracked either way.
- [ ] Checkpoints are kept for a day, and he waited too long.
  > Timing isn't the issue; this change was never captured.
- [ ] Rewind only works while plan mode is on.
  > Rewind works in every mode. The problem is how the folder was deleted.
- [x] Checkpoints don't track shell commands; only git or a backup can help.
  > Right. Rewind covers edits made by the file tools. `rm`, `mv` and scripts are outside it, which is why you keep committing.
```

```test spot-init-dump
Kim ran `/init` and kept the result: 300 lines listing every folder, every script and the framework version. Now the agent seems to ignore half of it. Spot the mistake.
- [ ] The file belongs in your global `~/.claude/CLAUDE.md`, which is read first.
  > Moving it doesn't shrink it. The global file is for instructions that apply to all your projects.
- [x] It's long and mostly things the agent can find by reading the code.
  > Right. Every line costs context in every session, and long files get followed less reliably. Keep what it can't discover.
- [ ] It needs more detail, so the agent has no reason to guess.
  > More lines make it worse. The agent learns folders and scripts by exploring.
- [ ] `/init` has to run again at the start of every session.
  > `CLAUDE.md` loads automatically each session. The problem is what's in it.
```

```test sequence-plan-approve
You want the agent to plan a change, then let you review each edit as it builds. Which order is right?
- [ ] Describe the change → pick "Yes, manually approve edits" → Shift+Tab into plan mode → read the plan
  > The approval menu only appears once a plan exists. Plan mode comes first.
- [ ] Shift+Tab into plan mode → pick "Yes, and use auto mode" → read the plan → review each edit
  > Approving before reading the plan defeats the point, and auto mode won't stop for each edit.
- [x] Shift+Tab into plan mode → describe the change → read the plan → "Yes, manually approve edits"
  > Right. Plan first, read it, then approve in the mode that stops for each edit.
- [ ] Describe the change in auto mode → read what it built → Shift+Tab into plan mode → approve it
  > In auto mode it builds straight away; planning afterwards is too late to steer.
```

```sources
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) (the agent loop, tool families, sessions, what checkpoints and permissions cover), Claude Code docs, read 2026-10-23 against Claude Code 2.1.309.
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) (the modes, the starting mode since 2.1.283, plan mode and its approval menu, Ctrl+G), Claude Code docs, read 2026-10-23.
- [Tools reference](https://code.claude.com/docs/en/tools-reference) (tool names and which ones ask first), Claude Code docs, read 2026-10-23.
- [Interactive mode](https://code.claude.com/docs/en/interactive-mode) (Esc, Esc Esc, Shift+Tab, Ctrl+O, the `!` prefix), Claude Code docs, read 2026-10-23.
- [How Claude remembers your project](https://code.claude.com/docs/en/memory) (`CLAUDE.md` locations, `/init`, `/memory`, the 200-line advice, auto memory), Claude Code docs, read 2026-10-23.
- [Checkpointing](https://code.claude.com/docs/en/checkpointing) (the rewind menu and what it can't undo), Claude Code docs, read 2026-10-23.
- [Best practices](https://code.claude.com/docs/en/best-practices) (explore, plan, code; approval fatigue; correcting course), Claude Code docs, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md) (what `/setup-matt-pocock-skills` configures): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [I was an AI skeptic. Then I tried plan mode](https://www.youtube.com/watch?v=WNx-s-RxVxk), Matt Pocock, 2026-01-15 (plan, execute, test, commit loop 0:18–0:40; what plan mode blocks 1:37–2:11; Shift+Tab 2:11; the forgetful colleague 2:36–2:56; Explore sub-agent on Haiku 3:02–3:19 and 5:44–6:00; the plan and its question 6:19–6:51; the two `CLAUDE.md` lines 8:16–8:51).
- [Matt Pocock on X: "I don't use plan mode"](https://x.com/mattpocockuk/status/2040054706928578851), 2026-04-03, quoting his post of 2026-04-02, read 2026-10-23.
- [An Introduction To Plan Mode](https://www.aihero.dev/plan-mode-introduction), Matt Pocock, AI Hero, written January 2026 with a later note that he no longer uses plan mode, read 2026-10-23.
- [Never Run claude /init](https://www.youtube.com/watch?v=9tmsq-Gvx6g), Matt Pocock, 2026-02-24 (the fixed system prompt 2:41–3:05; instruction budget 7:21–8:06; steering in Skills 8:07–8:43; his one-line file 8:54–9:23); written version [on AI Hero](https://www.aihero.dev/never-run-claude-init), updated 2026-02-24.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (grilling in auto mode, not plan mode, 10:03–10:08).
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16 (agents as engineers with no memory).
- [AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary) (harness, tool call, permission mode, agent mode, AGENTS.md entries), Matt Pocock, 2026-09-24, read 2026-10-23.
- [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models), Thariq Shihipar, Anthropic, 2026-07-24.
- [I Tried "grill-me" Skill for Plan Mode](https://www.youtube.com/watch?v=rLNLa2dcjG8), AI Coding Daily, 2026-04-11.
- [Hacker News discussion: /grill-me instead of plan mode](https://news.ycombinator.com/item?id=49851420), read 2026-10-23.
```
