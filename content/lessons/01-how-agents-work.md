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
- You'll be able to undo the agent's file edits with Esc Esc or `/rewind`, and say what rewind can't undo.
```

## Why it matters

Claude Code is Anthropic's coding agent: Claude, their AI, working in your terminal, reading your project's files, running commands and writing code. You type one sentence, say "the comment box test is failing, fix it" (a test is a small program that checks your code still works), and your screen fills with lines you didn't write: a read, a search, a shell command (a command run in the terminal), an edit, another command. A few minutes later it says it's done.

If you don't know what those lines are, you either approve every request unread or panic and stop it halfway. Either way you aren't steering. Worse, you can't tell a real result from a confident sentence: an agent can write "I ran the tests and they pass" without having run anything.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, describes agents as decent engineers with one big flaw: no memory. A Skill is a short instruction file the agent loads when you type its name, like `/grill-me`, or, for some, when a task matches its description. Claude Code also has Built-in commands, like `/rewind`. You type them the same way, a slash and a name at the start of the prompt box (where you type your messages), but they're part of Claude Code itself, not Skills.

## The idea: a model inside a harness

Three words do most of the work.

- **The model** is the AI itself (Claude). It does one thing: text in, text out. On its own it can't open a file, run a command or remember your last message.
- **The harness** is everything wrapped around the model that lets it act: the tools it can call, the system prompt (standing instructions sent with every request), the permission checks, and the management of its context window. The context window is everything the model can see at once. It's measured in tokens, the small chunks of text AI usage is counted in; see [The context window](/learn/context-window). Strictly, Claude Code is the harness; with Claude inside, it's a coding agent. So is the claude.ai website, whose tools (web search, say) can't touch your files. That's why ==the same model behaves differently== in each: same brain, different hands.
- **The agent** is the two together, taking turns with you.

The model acts through **tool calls**. A tool call is a line of structured text naming a tool and what to pass it: run this command, read this file. The model writes it and stops. Claude Code reads the call, checks it against your permission settings, runs it if allowed, and sends the output back to the model as a **tool result**. The model reads the result and decides the next step. That cycle is ==the agent loop==, and it repeats until the model answers with words instead of another call.

One **turn** is your message plus everything the agent does before it hands control back, often dozens of tool calls.

Two things follow. First, if no tool call happened, nothing happened, whatever the reply says. Second, ==every session starts blank==. A session is one Claude Code conversation, from starting `claude` until you quit or type `/clear` (a Built-in command that empties the conversation and leaves your files alone). The next session remembers nothing of it unless something was written to a file, by you or by Claude Code in notes it keeps for itself. In January 2026 Matt pictured a colleague who forgets everything each time they commit (save a version of the project with git, the tool most projects use to record every change).

```scene flow
title: One request, many trips round the loop (illustrative)
node: you | You type a request
node: model | The model picks the next step
node: call | It writes a tool call
node: harness | Claude Code checks and runs it
node: result | The result goes back to the model
node: done | It hands control back to you
# You type: "The comment box test is failing. Fix it." That starts a turn.
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
A friend pastes "fix the typo in my README" (a project's front-page guide) into the claude.ai website and gets corrected text to copy. In Claude Code, the same request changes the file itself. Both use the same model. Why the difference?
- [ ] The website only answers questions; it can't run tools of any kind.
  > The website has tools too, such as web search. None of them reach the files on your computer.
- [ ] The website hides the edit until you approve it.
  > There's no edit to hide: the website has no tool that can change files on your computer.
- [ ] Claude Code remembers your README from an earlier session.
  > Sessions start blank. It found your README by calling a tool to read it.
- [x] Claude Code gives the model tools that reach your files.
  > Right. Same model, different harness. Claude Code's tools reach your files, so it can run the edit the model asks for.
```

## Tools: what the agent can reach

Claude Code's docs group its built-in tools into five families:

| Family | Tools | What it's for |
|---|---|---|
| Files | `Read`, `Edit`, `Write` | Read, change and create files |
| Search | `Glob`, `Grep`, or `find` and `grep` through Bash | Find files by name, search inside them |
| Execution | `Bash` (on Windows, usually `PowerShell`) | Any terminal command: tests, git, starting the site on your machine |
| Web | `WebSearch`, `WebFetch` | Search the web, read a page |
| Code intelligence | Added by a plugin (an add-on you install) | Type errors, jump to a definition |

On top sit orchestration tools, such as `Agent`, which starts a sub-agent (a helper agent with its own fresh context window that does one job and reports back a summary). MCP servers (connectors that link the agent to outside systems) add tools of their own, and Skills add instructions; see [Skills](/learn/skills).

The tools differ in whether they ask first. In Manual mode (the setting where it asks before most actions; more on modes below), reading and searching inside your project folder never asks. Editing a file asks. Shell commands ask, apart from a built-in list of read-only ones. The split is deliberate: a read can't hurt you, but a shell tool (`Bash`, or `PowerShell` on Windows) can do anything you can.

Three keys let you watch and steer mid-loop. **Ctrl+O** opens the transcript, showing every tool call and its result. **Esc** stops the agent straight away. And if you type a message while it works, it's queued and read as soon as the current tool calls finish.

```checkpoint manual-runs-free
You're in Manual mode. Which of these tool calls runs without stopping for your approval?
- [x] Searching every file in the project for the word `signup`.
  > Right. Reads and searches inside the project never ask: they can't change anything.
- [ ] Editing a single line of a file it has just read.
  > Edits ask in Manual mode, however small.
- [ ] Running `npm install` to add a package (someone else's code library).
  > Shell commands ask, apart from a built-in list of read-only ones. Installing a package changes your project.
- [ ] Deleting a temporary file with `rm`.
  > A shell command that deletes things isn't read-only, so it asks first.
```

## Permission modes: how much it does without asking

A permission mode is the session's baseline for which tool calls run on their own and which stop for your approval. Press **Shift+Tab** to cycle through them (on Windows, if that changes nothing, press Alt+M); the label under the prompt box shows the current one. (In the desktop app, use the mode selector next to the send button.)

| Mode (setting name) | Runs without asking | Use it for |
|---|---|---|
| Manual (`default`) | Reads only | Reviewing every action; sensitive work |
| Accept edits (`acceptEdits`) | Reads, file edits, and common file commands inside the project, even `rm` | Iterating on code you'll review afterwards |
| Plan (`plan`) | Reads and exploring; no edits until you approve a plan | Looking before anything changes |
| Auto (`auto`) | Almost everything: reads and edits in your project run straight away; a second model, the classifier, checks the rest against your request and blocks risky ones | Long tasks with fewer interruptions |
| Bypass permissions (`bypassPermissions`) | Everything | Sealed-off containers and virtual machines only |

Since Claude Code 2.1.283, ==new sessions start in auto mode== unless your organisation has switched it off, and the label reads "auto mode on". So a fresh session won't stop to ask before editing. If you'd rather approve each step while you learn, press Shift+Tab: from auto, the first press goes to Manual, then Accept edits, then Plan, then the optional modes.

When a mode does ask, you get a permission prompt: allow the call, or choose No. A plain No (or Esc) stops the turn, and the agent waits for your next message. To steer it instead, move to No, press Tab, type a few words ("no, use the existing helper") and press Enter: the model reads your refusal as a tool result and changes course. If a harmless prompt keeps coming back, add an allow rule with `/permissions` (a rule that lets one kind of call through without asking). A deny rule does the opposite: it blocks one kind of call in every mode.

Picking a mode is a trade. Too tight and you approve on autopilot; Anthropic's best-practices guide warns: "After the tenth approval you're clicking through rather than reviewing." Matt's AI Coding Dictionary calls that rubber-stamping: the interruptions without the protection. Too loose and the agent does things you'd have wanted to see first. The same dictionary sketches a ladder that loosens with trust: plan mode first, Manual for delicate edits, Accept edits once it has shown it understands, Bypass only for unattended runs in a sealed-off container. (Matt now plans by having the agent interview him; see below.) Switching modes never resets the conversation.

```callout watch-out
Bypass permissions (what the `--dangerously-skip-permissions` option turns on) runs every tool call without asking. The docs say to use it only in sealed-off containers or virtual machines. On your own laptop, auto mode or a few allow rules cut the prompts and keep the safety net.
```

```checkpoint fresh-session-edits
You start Claude Code in a new folder, ask for a small script, and it creates the file without asking you. Nothing is broken. What's going on?
- [ ] It's in Bypass permissions, which every session starts in.
  > Bypass is never the built-in starting mode; you'd have to turn it on yourself.
- [x] New sessions start in auto mode; Shift+Tab reaches Manual.
  > Right. Auto mode lets edits inside your project through without asking; the classifier checks riskier actions, such as shell commands. One Shift+Tab takes you to Manual, which asks before edits.
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

Approving ends plan mode and switches to the mode you picked. Press Ctrl+G first if you'd rather edit the plan yourself.

```scene chat
title: Plan mode on this site (illustrative)
# You press Shift+Tab until the label says plan mode on, then describe the change.
you: Plan how to add a "Back to top" link at the end of each Lesson page. Keep it small.
# It explores first. Reads and searches run freely; edits are blocked.
agent: Reading how the Lesson page is built in `src/app/learn/`…
# Before it finishes, it asks about a decision your sentence left open.
agent: Should the link sit right after the Final test, or at the very bottom, after the comments?
# You answer, and it writes the plan to a file you can open.
you: At the very bottom.
agent: **Plan:** add the link at the end of the Lesson page and give it a little styling. Two files change: `src/app/learn/[slug]/page.tsx` and `src/app/globals.css`.
# Then Claude Code shows the approval menu.
agent: *Claude Code's menu:* 1 Yes, and use auto mode · 2 Yes, manually approve edits · 3 No, keep planning
# You pick 2, and plan mode ends. The model writes its first edit as a tool call, and Claude Code, not the model, stops it for your approval.
you: 2
agent: *Claude Code's permission prompt:* edit `src/app/learn/[slug]/page.tsx`? Yes · No
```

**Matt changed his mind about plan mode, and you should know both halves.** In January 2026 he used it for almost everything, even small bug fixes, refining each plan before the agent built anything. Two lines in his instruction file shaped his plans: be extremely concise, and end with a list of unresolved questions. By April 2026 he'd stopped. On X he wrote that it "creates a plan FAR too eagerly and usually asks you zero questions", when planning should get you on the same wavelength, not produce a document nobody reads. He still plans heavily, but by being interviewed with his grilling Skills, with plan mode off; see [Grilling](/learn/grilling).

So use plan mode when you want the agent to look before it touches anything, on a change you've already decided. When you haven't decided *what* to build yet, grill first: let the agent interview you until the decisions are made.

```checkpoint plan-wrong-scope
Plan mode has produced a plan for a "save for later" button on a recipe site. It assumes saved recipes need user accounts, which you don't want in v1. The menu is on screen. What do you pick?
- [ ] Yes, and use auto mode, then fix the accounts part afterwards.
  > Then it builds accounts first. Changing a plan costs one sentence; changing code costs a rebuild.
- [ ] Yes, manually approve edits, and reject the account edits one by one.
  > You'd be fighting a plan you never agreed to, edit by edit. Fix the plan instead.
- [x] No, keep planning, and say saved recipes stay in the browser.
  > Right. Stay in plan mode and correct the assumption. Approve only a plan you agree with.
- [ ] Press Esc to stop it, then retype the whole request in auto mode.
  > You'd throw away the plan and skip planning altogether. One sentence at the menu fixes the assumption.
```

## CLAUDE.md: standing instructions

Because every session starts blank, Claude Code reads a few files at the start of each one. The main one is `CLAUDE.md`, a Markdown file (plain text with light formatting, like `#` for a heading) that you write. Its contents go into the context window every session, and the project's copy is reloaded after `/compact` (the Built-in command that shrinks a long conversation into a summary), so its lines outlast anything said only in chat.

| File | Applies to |
|---|---|
| `~/.claude/CLAUDE.md` | You, in every project |
| `CLAUDE.md` in the project folder | Everyone working on this repo (a project folder tracked with git), shared through git |
| `CLAUDE.local.md` | Just you, in this project; keep it out of git |

`AGENTS.md` is the same idea under a name other agents read too; Claude Code reads it only when there's no `CLAUDE.md`. `/init` writes a starter file.

Claude Code also keeps **auto memory**: notes it writes for itself as you work, such as a preference you stated, loaded at the start of each session too. It decides what to save, so put any rule you rely on in `CLAUDE.md`. `/memory` lists your instruction files and opens them, and shows the auto memory folder and its on/off switch.

What belongs in `CLAUDE.md`? The docs and Matt agree on what to keep, and disagree on how much.

- **The docs** suggest keeping it under 200 lines, because longer files cost more context and get followed less reliably. For each line, ask whether removing it would cause mistakes. Keep commands it can't guess, rules that differ from the usual defaults and the project's gotchas; leave out anything it can learn by reading the code.
- **Matt** goes further. In February 2026 he argued you should never run `/init`, and should delete any auto-generated `CLAUDE.md` you find. Every line costs tokens on every request, a model can follow only so many instructions at once, and descriptions of files go stale. His own file was one line: he works on WSL (Linux inside Windows). Steering that only matters sometimes belongs in Skills, which load only when needed.

A good trigger, from Matt's dictionary: ==if you've corrected the agent on the same thing twice==, that correction is a candidate line.

```checkpoint claude-md-which-file
You want the agent to sum up each change in one sentence, but only in this repo, and the teammates who share the repo don't want that. Where does the line go?
- [ ] The project's `CLAUDE.md`.
  > That file is shared through git, so your teammates would get your preference too.
- [ ] Your global `~/.claude/CLAUDE.md`.
  > That file is yours, but it applies to every project, and you want this only here.
- [ ] An `AGENTS.md` file in the project folder.
  > Like the project's `CLAUDE.md`, it's shared through git, so your teammates would get it too. And Claude Code reads it only when there's no `CLAUDE.md`.
- [x] `CLAUDE.local.md` in the project folder.
  > Right. It applies only in this project, and since you keep it out of git, it's yours alone.
```

## Rewind: stepping back

Claude Code takes a snapshot of your code before each message that starts a turn, and tracks every change its file tools make. (Its docs call these snapshots checkpoints; they have nothing to do with this site's Checkpoint questions.) To step back, press **Esc twice** with the prompt box empty, or type `/rewind`. Pick the message to return to, then restore the code and the conversation, only the conversation, or only the code. Or just ask: "undo that."

Rewind has hard limits. It doesn't undo:

- files changed only by shell commands, like `rm`, `mv` or a script that rewrites files;
- edits made outside Claude Code, by you or another program;
- most edits made by sub-agents;
- anything remote: a database row, a pushed commit (one sent to a site like GitHub), a deploy (a release of the live site), a sent message.

==Rewind is not version control.== Keep committing with git.

```scene terminal
title: Rewinding edits you didn't want (illustrative)
# The agent has changed two files with its file tools, and you don't like the direction. In Claude Code's prompt box you type `!git status`: the `!` lets you run a shell command yourself, and `git status` lists the files changed since the last commit.
$ !git status
modified:   src/app/learn/[slug]/page.tsx
modified:   src/app/globals.css
# With the prompt box empty, you press Esc twice. The menu lists the prompts you sent this session; you pick the one just before the edits.
Plan how to add a "Back to top" link at the end of each Lesson page.
# Then you choose what to restore.
Restore code and conversation
Restore conversation
Restore code
Summarize from here
Summarize up to here
Never mind
# You choose Restore code. The files go back, and the conversation stays, so you can explain what you meant instead.
$ !git status
nothing to commit, working tree clean
```

```callout big-idea
Permissions and rewind work as a pair. Rewind covers the agent's file edits, so the prompts worth reading most carefully are the ones it can't reach: shell commands, and anything that leaves your machine. In Accept edits even `rm` runs without asking, so commit before you loosen the mode.
```

## How Matt and others use it

**Matt Pocock**

- **Plan mode, January 2026.** In his plan mode video, the agent sent an Explore sub-agent on the cheaper Haiku model to read the code (about 40,000 tokens), then wrote a plan and asked him something his short prompt hadn't covered.
- **Grilling in auto mode, July 2026.** In his end-to-end walkthrough he grilled with plan mode off, in auto mode.

**Others**

- **Anthropic's best practices:** correct course early with Esc, Esc Esc or "undo that". After two failed corrections, `/clear` and start again with a better prompt, because failed attempts clutter the context window.
- **Plan mode versus grilling:** AI Coding Daily compared `/grill-me` with plan mode in April 2026, and a Hacker News commenter reported increasingly reaching for `/grill-me` instead of plan mode.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)), plus git. Type `git --version` to check: if it's missing, a Mac offers to install it; on Windows, install Git for Windows from git-scm.com, then open a new PowerShell window. Nothing here needs Matt's Skills, and you'll rewind everything you change.

1. Get this site's code and start Claude Code in it. If it asks whether you trust the folder, choose Yes.

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped
cd idea-to-shipped
claude
```

2. Look under the prompt box. It probably says "auto mode on". Press Shift+Tab (Alt+M on some Windows setups) until it says "manual mode on".
3. Watch the loop without changing anything. Type the prompt below and press Enter. While it works, press Ctrl+O to see each tool call (Ctrl+O again to go back). If it asks to run a command or change anything, move to No, press Tab, type `carry on without changing anything` and press Enter (a plain No would stop it).

```text
Without changing anything, find where Lesson pages are loaded from Markdown and explain the flow in five bullets.
```

4. Press Shift+Tab until you see "plan mode on", then type:

```text
Plan how to add a "Back to top" link at the end of each Lesson page. Keep it small, and ask me anything you're unsure about.
```

5. Answer its questions and read the plan. At the menu, pick **Yes, manually approve edits**.
6. When it asks to edit a file, choose the plain Yes, not any option that allows edits for the rest of the session. Then press Esc to stop it. If it asks to run a command before any edit, answer No as in step 3, typing `skip that, just make the first edit`.
7. With the prompt box empty, press Esc twice. Pick the prompt from step 4, then **Restore code**. Type `!git status` and press Enter.
8. Type `/memory` to see your instruction files. Press Esc to close the list, then type `/exit`.

**It's working if:**

- [ ] In step 3, most of its reads and searches ran without asking you.
- [ ] Ctrl+O showed each tool call and its result.
- [ ] Plan mode showed you a plan and the approval menu before any file changed.
- [ ] You saw at least one permission prompt and chose an answer.
- [ ] After Restore code, `git status` said "nothing to commit". If a file is still listed, a shell command changed it, which rewind can't reach. Type `!git restore .` to put changed files back, and ask the agent to delete any new file listed under "Untracked files".
- [ ] `/memory` listed the project's `CLAUDE.md`.
````

## Common mistakes

- **Rubber-stamping prompts.** If you click Yes without reading, switch to a looser mode or add allow rules instead, so you choose what runs freely.
- **Believing a claim with no tool call behind it.** "I ran the tests" means nothing if Ctrl+O shows no test run.
- **Expecting it to remember yesterday.** Put what must carry over in `CLAUDE.md`, or in a file the next session reads.
- **Accepting a plan that asked you nothing.** That's Matt's complaint about plan mode. Read the plan, and choose "No, keep planning" wherever it guessed.

```site-story
This site's `CLAUDE.md` is 17 lines, and it arrived with the very first commit. Most of it is the "Agent skills" block in the shape that Matt's repo-setup Skill, `/setup-matt-pocock-skills`, writes: where the issue tracker lives (to-do files under `.scratch/`), the labels for sorting issues, and where the glossary (the project's word list) and decision records go. The rest points the agent at `AGENTS.md`, a note about the newer version of Next.js, this site's framework. Nothing in it describes the code; the agent reads the code for that.

The blank-session rule also shaped how this course was rebuilt. The engine that draws Scenes and questions was built in one session while the Lessons were written in another. They didn't share a context window, so the engine session wrote its rules down in a contract file, and every Lesson follows it. Before I moved the course to a new Mac, I committed `HANDOFF.md`: where the drafts are, the plan, and how I work. The work on the new machine picked up from that file.
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
| See your instruction files and auto memory | `/memory` |
| Undo its file edits | Esc Esc or `/rewind`, then Restore code |
| Undo a shell command or a deploy | Git or the remote system; rewind can't |

## Final test

```test predict-loop
You ask the agent to fix a crash on your sign-up page. In Ctrl+O you see that its first tool call ran the tests, and the result shows an error at line 42 of `src/signup.ts`. What is the agent most likely to do next?
- [ ] Write a tool call that edits line 42, since the error names it.
  > It hasn't seen that file's contents yet. The model knows only what tool results have brought in, so it reads first.
- [x] Write another tool call, this time to read `src/signup.ts`.
  > Right. Each result shapes the next call. The error points at a file, so the next trip round the loop reads it.
- [ ] Ask you to paste `src/signup.ts` into the chat so it can see it.
  > It has a Read tool. In Claude Code it fetches the file itself with a tool call.
- [ ] Reply "fixed", because the tests have already run once.
  > A reply ends the turn, and nothing has been changed or checked again yet.
```

```test spot-no-tool-call
Ana asked the agent to fix a failing test and run the whole set of tests. It replied "Done: all 42 tests pass", so she told her team the bug was fixed. Spot the mistake.
- [ ] She should have used plan mode, which runs the tests for her before any edit.
  > Plan mode blocks edits until you approve a plan. It doesn't run your tests for you.
- [ ] She should have asked again, because a second reply would show the output.
  > Another reply is just more words. Only a tool call actually runs the tests.
- [x] She should have checked the transcript for an actual test run.
  > Right. A tool call is text the harness must run. Ctrl+O shows whether a test run happened; no call, no run, whatever the reply says.
- [ ] She should have switched to Accept edits, which shows each test result.
  > Accept edits only changes which actions ask first. It doesn't run or show anything extra.
```

```test scenario-unfamiliar-repo
You've cloned a friend's project you've never seen. You want the agent to study it and propose how to add a dark theme, without changing a single file yet. What do you do?
- [x] Press Shift+Tab until "plan mode on", then describe the change.
  > Right. Plan mode blocks edits and tells the agent to explore and propose. Nothing changes until you approve.
- [ ] Switch to Accept edits so it can try a few approaches quickly.
  > Accept edits approves file changes automatically: the opposite of what you want.
- [ ] Stay in auto mode, because its classifier stops it from editing files.
  > In auto mode, edits inside your project skip the classifier entirely, so nothing would stop it if it started building. Plan mode blocks edits outright.
- [ ] Turn on Bypass permissions so it can explore without interruptions.
  > Bypass runs everything without asking, edits included, and belongs in throwaway containers only.
```

```test scenario-style-tweaks
You're adjusting a site's spacing and fonts: dozens of small changes to its style files. You're tired of saying yes to each one, but you still want to be asked before it installs anything, runs a script or commits to git. Which mode?
- [ ] Bypass permissions
  > That runs every command without asking too, and it's for isolated containers only.
- [ ] Plan
  > Plan mode blocks edits until you approve a plan; it won't tweak anything as you go.
- [ ] Manual
  > Manual is what you're tired of: it asks before every edit.
- [x] Accept edits
  > Right. File edits and simple file commands go through on their own; installs, scripts and commits still ask.
```

```test scenario-repeat-correction
For the third session running, you've had to tell the agent "this project uses pnpm, not npm" (two tools that install a project's packages). What do you do about it?
- [ ] Keep telling it at the start of each session in this project.
  > It works, but you'd have to remember every time. A file read at the start of each session remembers for you.
- [x] Add one short line about it to this project's `CLAUDE.md`.
  > Right. A correction you've made twice is a candidate line, and this one matters in every session here.
- [ ] Run `/init` so the agent writes a fresh `CLAUDE.md` for the project.
  > `/init` writes a whole starter file about the project. You need one line for one repeated correction.
- [ ] Describe every folder and script in `CLAUDE.md`, so it learns the project.
  > That's detail it can get by reading, and it goes stale. One line about the correction is what's missing.
```

```test scenario-undo-whole-request
You asked the agent to add a dark theme. Its file tools rewrote four stylesheets (the files that set a site's look), and now you've decided the whole request was a mistake. You want to start over as if you'd never sent it. What do you do?
- [ ] Type `/clear`, which empties the chat and undoes the session's edits.
  > `/clear` empties the conversation but leaves all four edited files as they are.
- [ ] Esc Esc, pick that request, then choose Restore code.
  > That puts the files back but keeps the chat, request and all.
- [x] Esc Esc, pick that request, then Restore code and conversation.
  > Right. The files and the chat both go back to how they were before you sent that request.
- [ ] Type `/compact`, so the agent forgets the request and its edits.
  > `/compact` summarises the conversation. It doesn't touch any files.
```

```test spot-bypass-laptop
Jo found the permission prompts annoying, so she now starts Claude Code with `--dangerously-skip-permissions` on the laptop she uses for everything. Spot the mistake.
- [x] Bypass is for isolated containers, not the laptop with all her files.
  > Right. That option turns on Bypass permissions, which runs tool calls without asking. On her everyday laptop, auto mode's classifier or a few allow rules cut the prompts and keep a safety net.
- [ ] Bypass still asks before shell commands, so it cuts only the edit prompts.
  > Ordinary shell commands run unasked too, and that's the danger.
- [ ] Auto mode would be just as risky, so which mode she picked doesn't matter.
  > Auto mode's classifier still checks shell commands and blocks risky ones. Bypass has no such check.
- [ ] Bypass ignores her deny rules, so she should have written more of them.
  > Deny rules still block in every mode, Bypass included. The danger is everything else running unchecked.
```

```test spot-rm-rewind
Sam asked the agent to tidy up. It edited the README with its file tools, then ran `rm -r drafts` in the shell, deleting a folder of notes it had never edited. Sam pressed Esc twice, picked that request and chose Restore code, expecting the folder back. Spot the mistake.
- [ ] He should have chosen Restore code and conversation, which brings back every kind of change.
  > Both code options restore only what Claude Code tracked. Files only a shell command touched aren't tracked either way.
- [ ] Snapshots are kept for a day, and he waited too long.
  > Timing isn't the issue; this change was never captured.
- [ ] He should have typed `/rewind`; Esc Esc only rewinds the conversation.
  > Esc Esc and `/rewind` open the same menu. Neither restores what only a shell command changed.
- [x] Rewind can't restore files only a shell command changed.
  > Right. Rewind tracks what the file tools change. `rm`, `mv` and scripts working on other files are outside it, which is why you keep committing with git.
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
- [ ] Shift+Tab into plan mode → describe the change → read the plan → "Yes, and use auto mode"
  > Auto mode lets it build without routine prompts. It won't stop so you can review each edit.
- [ ] Describe the change → Shift+Tab into plan mode → read the plan → "Yes, manually approve edits"
  > A new session starts in auto mode, so describing the change first starts the work straight away. Switch to plan mode before you describe it.
- [x] Shift+Tab into plan mode → describe the change → read the plan → "Yes, manually approve edits"
  > Right. Plan first, read it, then approve in the mode that stops for each edit.
- [ ] Describe the change in auto mode → read what it built → Shift+Tab into plan mode → approve it
  > In auto mode it builds straight away; planning afterwards is too late to steer.
```

```sources
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) (the agent loop, tool families, sessions, what rewind and permissions cover), Claude Code docs, read 2026-10-23 against Claude Code 2.1.309.
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) (the modes and their status-bar labels, the starting mode since 2.1.283, what Accept edits and the classifier cover, plan mode and its approval menu, Ctrl+G), Claude Code docs, read 2026-10-23.
- [Configure permissions](https://code.claude.com/docs/en/permissions) (answering a prompt with No, with or without a comment; allow and deny rules), Claude Code docs, read 2026-10-24.
- [Tools reference](https://code.claude.com/docs/en/tools-reference) (tool names, which ones ask first, the PowerShell tool on Windows), Claude Code docs, read 2026-10-24.
- [Interactive mode](https://code.claude.com/docs/en/interactive-mode) (Esc, Esc Esc, Shift+Tab and Alt+M, Ctrl+O, Tab on a permission prompt, the `!` prefix), Claude Code docs, read 2026-10-24.
- [How Claude remembers your project](https://code.claude.com/docs/en/memory) (`CLAUDE.md` locations, when `AGENTS.md` loads, `/init`, `/memory`, the 200-line advice, reloading after `/compact`, auto memory), Claude Code docs, read 2026-10-23.
- [Checkpointing](https://code.claude.com/docs/en/checkpointing) (when snapshots are taken, the rewind menu and what it can't undo), Claude Code docs, read 2026-10-23.
- [Best practices](https://code.claude.com/docs/en/best-practices) (approval fatigue; correcting course), Claude Code docs, read 2026-10-23.
- [setup-matt-pocock-skills SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/SKILL.md) (the "Agent skills" block it writes into `CLAUDE.md`): pinned to mattpocock-skills 1.3.1, read 2026-10-24.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (what `/setup-matt-pocock-skills` configures): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [I was an AI skeptic. Then I tried plan mode](https://www.youtube.com/watch?v=WNx-s-RxVxk), Matt Pocock, 2026-01-15 (what plan mode blocks 1:37–2:11; Shift+Tab 2:11; the forgetful colleague 2:36–2:56; Explore sub-agent on Haiku 3:02–3:19 and 5:44–6:00; the plan and its question 6:19–6:51; the two `CLAUDE.md` lines 8:16–8:51).
- [Matt Pocock on X: "I don't use plan mode"](https://x.com/mattpocockuk/status/2040054706928578851), 2026-04-03, quoting his post of 2026-04-02, read 2026-10-24.
- [An Introduction To Plan Mode](https://www.aihero.dev/plan-mode-introduction), Matt Pocock, AI Hero, updated 2026-01-09 (plan mode for almost everything, the two plan instructions), with a later note that he no longer uses plan mode, read 2026-10-24.
- [Never Run claude /init](https://www.youtube.com/watch?v=9tmsq-Gvx6g), Matt Pocock, 2026-02-24 (the fixed system prompt 2:41–3:05; instruction budget 7:21–8:06; steering in Skills 8:07–8:43; his one-line file 8:54–9:23); written version [on AI Hero](https://www.aihero.dev/never-run-claude-init), updated 2026-02-24.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (grilling in auto mode, not plan mode, 10:03–10:08).
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16 (agents as engineers with no memory).
- [AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary) (harness, tool call, permission mode, agent mode, AGENTS.md entries), Matt Pocock, 2026-09-24, read 2026-10-23.
- [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models), Thariq Shihipar, Anthropic, 2026-07-24.
- [I Tried "grill-me" Skill for Plan Mode. Wow.](https://www.youtube.com/watch?v=rLNLa2dcjG8), AI Coding Daily, 2026-04-12.
- [Hacker News discussion: /grill-me instead of plan mode](https://news.ycombinator.com/item?id=49851420), read 2026-10-23.
```
