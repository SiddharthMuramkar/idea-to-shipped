---
title: How coding agents work
slug: how-agents-work
summary: A coding agent is a model inside a harness. See what Claude Code does with each step Claude asks for, and which controls keep you in charge.
---

## A model inside a harness

Say your project's tests are failing. (A **test** is a small program that checks your code still works.) You type one sentence into Claude Code, Anthropic's coding agent: "Fix the failing tests." Your screen fills with lines you didn't write, and minutes later it says it's done. If you can't read those lines, you can't steer it, and you can't tell real work from a confident sentence.

**A coding agent is a model inside a harness: the model chooses each step, and the harness carries it out.**

The **model** is the AI itself, here Claude. It does one thing: text in, text out. On its own, it can't open a file, run a command or remember your last message.

The **harness** is everything around the model that lets it act. Claude Code is a harness. It gives Claude **tools**: functions it can ask to run, such as reading a file or running a command. It also adds standing instructions of its own, and checks your permission settings before anything runs.

That's why the same model behaves differently in different places. The claude.ai website runs Claude too, but in a chat harness. Its tools, such as web search, can't touch the files on your computer. Claude Code's tools can.

```checkpoint quick-1
You paste "fix the typo in my notes file" into the claude.ai website, and get corrected text to copy. In Claude Code, the same request edits the file. Both run Claude. Why the difference?
- [x] Claude Code is a harness whose tools reach your files.
- [ ] Claude Code runs a stronger model that can edit files.
- [ ] The website hides its edit until you approve it.
Why: Same model, different harness. Claude Code's tools reach the files on your computer. The website's tools, such as web search, don't.
```

## The agent loop

The model acts through **tool calls**. A tool call is a short, structured request: which tool to use, and what to give it. "Run the tests." "Read `src/search.js`." The model writes the request, then stops.

Claude Code checks the call against your permission settings, and runs it if allowed. The output goes back to the model as a **tool result**. The model reads it, then writes the next call.

That cycle is the **agent loop**: the model asks for a tool, Claude Code runs it, the result goes back, and the model picks the next step. It repeats until the model answers in words, with no tool call. Your message, and everything the agent does before it answers, is one **turn**.

```diagram
type: cycle
caption: "That cycle is the agent loop"
steps: ["the model asks for a tool", "Claude Code runs it", "the result goes back", "the model picks the next step"]
outside: "answers in words"
```

For example, say the search box on your recipe website has a failing test. "Fix the failing tests" might take five trips round the loop:

1. Run the tests, to see what fails.
2. Read the error: a test expects a search for "pancakes" to find "Pancakes".
3. Read `src/search.js`, the file the error points to.
4. Edit that file, so searches ignore capital letters.
5. Run the tests again. They pass, so the model answers in words: "Fixed. Search now ignores capital letters."

Each result shapes the next call. So if no tool call happened, nothing happened, whatever the reply says. Press **Ctrl+O** to open the transcript, which shows every tool call and its result. Press it again to close it.

```checkpoint quick-2
The agent replies "All 42 tests pass." In the transcript, you find no tool call that ran the tests. What do you conclude?
- [x] No tests ran this turn, because a reply is only words.
- [ ] The tests ran, but Claude Code hides test runs from the transcript.
- [ ] The tests ran in an earlier session, and the agent remembered them.
Why: Only a tool call runs anything. With no test run in the transcript, the reply is a claim, not a result.
```

You're part of the loop too. **Esc** stops the agent at once, and keeps the work done so far. Or type a correction while it works: it reads your message as soon as its current tool calls finish.

```checkpoint quick-3
The agent starts editing a file you never mentioned. You press Esc. What happens?
- [x] It stops at once, keeping the work done so far.
- [ ] It undoes everything it did since your last message.
- [ ] It finishes the edit first, then waits for you.
Why: Esc stops the agent straight away and keeps what it has done so far. Undoing is a separate step, covered below.
```

The tool results pile up in the model's **context window**: everything it can see at once. [The context window](/learn/context-window) shows how that fills up. [Calling a model](/learn/calling-a-model) shows the loop in code.

## How much it does without asking

A **permission mode** sets which tool calls run on their own, and which stop for your approval. The label under the prompt box shows the current mode. Press **Shift+Tab** to switch.

| Mode | Label | Runs without asking | Fits |
|---|---|---|---|
| Auto | auto mode on | Almost everything, after a safety check on risky actions | Long tasks, with fewer interruptions |
| Manual | manual mode on | Reads only | Watching every step |
| Accept edits | accept edits on | Reads, file edits, and common file commands such as `mkdir` and `mv` | Changes you'll review afterwards |
| Plan | plan mode on | Reads and exploring, with no edits until you approve a plan | Looking before anything changes |

New sessions start in **auto mode**. Reads and edits inside your project run straight away. A second model, the **classifier**, checks other actions first, such as commands, and blocks risky ones, like a deploy to your live site.

From auto, one press of Shift+Tab goes to Manual, the next to Accept edits, then Plan. (On some Windows setups, the key is Alt+M.)

```checkpoint quick-4
You start Claude Code in a new folder and ask for a small script. It creates the file without asking you. Nothing is broken. What's going on?
- [x] New sessions start in auto mode, which lets edits in your project through.
- [ ] Creating a new file never needs your approval, in any mode at all.
- [ ] The session started in plan mode, which writes files as it plans.
Why: Auto mode is where new sessions start, and it lets reads and edits inside your project run straight away. One press of Shift+Tab takes you to Manual, which asks before edits.
```

In Manual, reads and searches inside your project never ask, because they can't change anything. Edits ask. Commands ask too, apart from a built-in set of read-only ones.

```checkpoint quick-5
You're in Manual mode. Which of these runs without stopping for your approval?
- [x] Searching every file in the project for the word `recipe`.
- [ ] Editing one line of a file the agent has just read.
- [ ] Deleting a temporary file with the `rm` command.
Why: In Manual, reads and searches inside your project never ask. Edits ask, and so do commands that aren't read-only.
```

When a mode asks, you get a **permission prompt**. It offers Yes, a "don't ask again" Yes for that kind of command, and No. A plain No stops the turn. To steer instead, move to No, press Tab, type what to do differently, and press Enter. The agent reads your note and carries on.

Picking a mode is a trade. Anthropic warns that in Manual, "after the tenth prompt you start approving without reading". Too loose, and the agent does things you'd have wanted to see first.

```callout watch-out
**Bypass permissions**, which the `--dangerously-skip-permissions` option turns on, runs everything without asking. Anthropic says to use it only in isolated containers or virtual machines: sealed-off computers inside your computer. On your own laptop, auto mode keeps a safety check.
```

## Plan mode

**Plan mode** lets the agent look before it touches anything. It reads your files and explores, then writes a plan. Edits stay blocked until you approve the plan.

To enter it, press Shift+Tab until the label says "plan mode on", or start one message with `/plan`. To start a whole session in it, run `claude --permission-mode plan`.

When the plan is ready, Claude Code asks how to go on:

- **Yes, and use auto mode**: approve it, and let the agent build without routine prompts.
- **Yes, manually approve edits**: approve it, then review each edit as it comes.
- **No, keep planning**: stay in plan mode, and say what to change.

Approving ends plan mode. Changing a plan costs a sentence, while changing code costs a rebuild. So read the plan, and pick "No, keep planning" wherever it guessed.

```checkpoint quick-6
Plan mode has written a plan for a "save for later" button on your recipe website. It assumes saved recipes need user accounts, which you don't want yet. The menu is on screen. What do you pick?
- [x] No, keep planning, and say that saved recipes stay in the browser.
- [ ] Yes, and use auto mode, then remove the accounts part afterwards.
- [ ] Yes, manually approve edits, and turn down the account edits one by one.
Why: Changing a plan costs a sentence, and changing code costs a rebuild. Approve only a plan you agree with.
```

## Standing instructions

A **session** is one conversation with Claude Code, from starting `claude` until you quit or clear it. Each new session starts blank, with none of the last one's conversation in it. So Claude Code reads a few files at the start of every session. The main one is `CLAUDE.md`: a Markdown file (plain text with light formatting) of standing instructions that you write, such as the command that runs your tests. Keep it short, with a line for each thing the agent can't learn from your code or that you've had to correct twice. [Instruction files](/learn/instruction-files) covers where these files go and what belongs in them.

```checkpoint quick-7
Yesterday you told the agent to run the tests before every commit. In today's new session, it doesn't. Why, and what's the fix?
- [x] Each session starts blank, so put the rule in `CLAUDE.md`.
- [ ] The agent forgot overnight, so repeat the rule every hour.
- [ ] Yesterday's session expired, so reopen it each morning instead.
Why: A new session has none of yesterday's conversation. Claude Code reads `CLAUDE.md` at the start of every session, so a standing rule belongs there.
```

## Stepping back with rewind

Before each message you send that starts a turn, Claude Code saves a **checkpoint**: the state of your files, so the agent's edits can be undone. To step back, press **Esc twice** with the prompt box empty, or type `/rewind`. Pick the message to go back to, then choose what to restore:

- **Restore code and conversation**: both go back to that point.
- **Restore conversation**: the chat goes back, and your files stay as they are.
- **Restore code**: your files go back, and the chat stays.

```checkpoint quick-8
The agent's last answer was misleading, but its file edits are good. You want the chat back to before that message. Which option fits?
- [x] Restore conversation, which keeps your files as they are.
- [ ] Restore code, which puts your files back as they were.
- [ ] Restore code and conversation, which takes both back together.
Why: Restore conversation takes the chat back and leaves your files alone, so the good edits stay.
```

Rewind has limits. It doesn't undo:

- files changed only by commands, such as `rm`, which deletes files;
- changes made outside Claude Code, by you or another program;
- most edits made by subagents, the helper agents covered below;
- anything beyond your computer, such as a database, a deploy or a sent message.

So rewind doesn't replace Git, the tool that saves snapshots of your project ([What Git and GitHub are](/learn/what-git-and-github-are)). Keep committing.

```checkpoint quick-9
The agent ran `rm -r drafts` in the terminal, deleting a folder it had never edited. Can rewind bring the folder back?
- [x] No. Rewind doesn't undo files changed only by commands.
- [ ] Yes. Restore code puts back every file the agent touched.
- [ ] Yes, but only if you rewind within the next hour.
Why: Rewind covers the edits made by Claude Code's file tools. A folder deleted only by a command is outside it, so you'd need Git to get it back.
```

```callout big-idea
Permissions and rewind work as a pair. Rewind covers the agent's file edits. So read most carefully the prompts it can't reach: commands, and anything that leaves your computer.
```

## Going deeper

### Why it exists

A model on its own can only write text. To change your code, something has to run its requests. And something has to stop the ones you'd never allow.

The harness does both, and the two jobs work differently. What the model reads, such as your prompt or `CLAUDE.md`, shapes what it tries to do. It usually follows them, with no guarantee. What the harness enforces, such as a permission rule, applies every time. Anthropic's docs put it plainly: "Permission rules are enforced by Claude Code, not by the model."

So a rule that must never break belongs in the harness's settings, not in a sentence to the model. A **deny rule**, which you add with `/permissions`, blocks one kind of tool call in every mode, Bypass included.

```checkpoint quick-10
Your `CLAUDE.md` says "never read `.env`", a file of secret keys. Can you count on that line every time?
- [x] No. The model usually follows it, but only a deny rule is enforced.
- [ ] Yes. Claude Code enforces every line of `CLAUDE.md` as a rule.
- [ ] Yes, but only while the session stays in Manual mode.
Why: What the model reads shapes what it tries to do, with no guarantee. A deny rule is enforced by Claude Code itself, in every mode.
```

### How it works underneath

**The loop is an API call, repeated.** Claude Code sends the conversation to Claude, and Claude's reply asks for a tool. Claude Code runs it, adds the result to the conversation, and calls Claude again. [Calling a model](/learn/calling-a-model) builds that loop in a short Python script.

**The tools come in families.** Claude Code's built-in tools fall into five:

| Family | Example tools | What they do |
|---|---|---|
| File operations | `Read`, `Edit`, `Write` | Read, change and create files |
| Search | `Glob`, `Grep` | Find files by name, and search inside them |
| Execution | `Bash` | Run commands: tests, Git, scripts |
| Web | `WebSearch`, `WebFetch` | Search the web, and read a page |
| Code intelligence | Added by a plugin | Show type errors, and jump to a definition |

Other tools manage the work itself. One starts a **subagent**: a helper agent with its own fresh context window, which does one job and reports back a summary. Claude Code sends broad searches of your code to a built-in subagent called Explore. That keeps all the reading out of your conversation.

```checkpoint quick-11
To answer your question, the agent has to search across your whole codebase. Where does that reading usually happen?
- [x] In a subagent called Explore, which reports back a summary.
- [ ] In your conversation, where every file it reads stays visible.
- [ ] On Anthropic's servers, which keep a copy of your codebase.
Why: Claude Code sends broad searches of your code to its built-in Explore subagent. Explore works in its own context window and reports back a summary.
```

**Auto mode checks in a fixed order.** Your own allow, ask and deny rules come first. Then reads and file edits inside your project go through. Everything else goes to the classifier, which blocks anything that goes beyond your request. After three blocks in a row, or twenty in total, auto mode pauses and goes back to asking you.

Anthropic is clear about the limit: auto mode "reduces permission prompts but does not guarantee safety."

```checkpoint quick-12
In auto mode, the classifier has blocked three of the agent's actions in a row. What happens next?
- [x] Auto mode pauses and goes back to asking you.
- [ ] The session switches itself into Bypass permissions.
- [ ] The agent ends the session and loses its work.
Why: After three blocks in a row, or twenty in total, auto mode pauses and asks you instead.
```

### A real example

Matt Pocock is a developer and teacher who publishes a popular set of Skills for coding agents. In January 2026, he used plan mode for almost everything, even small bug fixes.

Within months, he'd stopped. He found that Claude Code "tends to spit out a plan really early when in plan mode, creating a document before we've truly understood each other."

Now he has the agent interview him first, and he records the decisions as they go. In his July 2026 walkthrough of his whole workflow, he does that interview in auto mode, with plan mode off.

So plan mode fits a change you've already decided. When what to build is still open, have the agent interview you first, as [grill before you build](/learn/grill-before-you-build) shows.

```checkpoint quick-13
You haven't yet decided what a new feature should do. By Matt's account, what works better than plan mode?
- [x] Have the agent interview you until the decisions are made.
- [ ] Approve the first plan, then fix the code as you go along.
- [ ] Ask plan mode for a longer and more detailed plan instead.
Why: Matt found that plan mode produced a plan before the two of them understood each other. Being interviewed first settles the decisions, and then a plan has something to rest on.
```

### Where it goes wrong

**The agent says the tests pass, but nothing ran.** A reply is only words. Check the transcript with Ctrl+O for the test run. Anthropic suggests asking for evidence: the command it ran, and its output.

**You click Yes without reading.** After many prompts, approving becomes a reflex. For a harmless command you trust, pick the "don't ask again" option. For safe work, switch to a looser mode. Either way, you choose what runs freely.

**Rewind didn't bring back a deleted folder.** A command deleted it, and rewind only tracks edits made by Claude Code's file tools. Get it back from Git, and commit before risky work.

```checkpoint quick-14
You're about to let the agent clean up an old folder of files. What should you do first, and why?
- [x] Commit with Git, because rewind can't undo files deleted by commands.
- [ ] Switch to Accept edits, because it asks before every delete.
- [ ] Nothing, because rewind restores anything the agent deletes.
Why: A cleanup often runs commands such as `rm`, and rewind doesn't track files changed only by commands. A commit gives you a way back.
```

**The plan asked you nothing.** That's Matt's complaint. Pick "No, keep planning" and name what it guessed, or have it interview you before it plans.

**Everything runs unasked on your own computer.** You started Claude Code with `--dangerously-skip-permissions`. Use auto mode instead, or a few "don't ask again" rules. Bypass belongs in isolated containers.

```checkpoint quick-15
You're tired of permission prompts on the laptop you use for everything. Which change keeps a safety check?
- [x] Use auto mode, where a classifier still checks risky actions.
- [ ] Start every session with `--dangerously-skip-permissions`.
- [ ] Stay in Manual, and answer Yes to every prompt you see.
Why: Bypass runs everything without asking, and belongs in isolated containers. Auto mode cuts the prompts but keeps the classifier's check.
```

### Try it

You'll need Claude Code installed and signed in: [Start here](/learn/start-here) covers setup. You'll change one file, then rewind the change.

1. Make a practice folder with one file, and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir agent-practice
cd agent-practice
echo "Pancakes: flour, milk, eggs." > recipes.txt
claude
```

2. Look under the prompt box. You'll probably see "auto mode on". Press Shift+Tab until it says "manual mode on".
3. Type the prompt below. While it works, press Ctrl+O to watch its tool calls, then Ctrl+O again to go back. You should see it read the folder without asking you.

```text
What's in this folder? Don't change anything.
```

4. Press Shift+Tab until you see "plan mode on". Then type:

```text
Plan how to add an omelette recipe to recipes.txt. Ask me anything you're unsure about.
```

5. Answer its questions, and read the plan. At the menu, choose **Yes, manually approve edits**.
6. When it asks to edit `recipes.txt`, read the change, and choose Yes. If it asks to run a command, move to No, press Tab, type `skip that, just edit the file`, and press Enter.
7. With the prompt box empty, press Esc twice. Pick your message from step 4, then choose **Restore code**.
8. Type `!cat recipes.txt` and press Enter. The `!` runs a command yourself, and the agent then comments on its output. You should see only the pancakes line.
9. Type `/exit` to quit.

### Read more

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works), Anthropic
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes), Anthropic
- [Checkpointing](https://code.claude.com/docs/en/checkpointing), Anthropic
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [Harness](https://www.aihero.dev/ai-coding-dictionary/harness), AI Coding Dictionary, Matt Pocock
- [An Introduction To Plan Mode](https://www.aihero.dev/plan-mode-introduction), Matt Pocock, updated 2026-01-09, with his later note on why he stopped

## Remember

```flashcards
Q: What are the two parts of a coding agent?
A: A model (the AI, such as Claude: text in, text out) inside a harness (Claude Code: the tools, standing instructions and permission checks around it).

Q: What is the agent loop?
A: The model asks for a tool, the harness runs it, the result goes back, and the model picks the next step. It repeats until the model answers in words.

Q: How do you see every tool call the agent made?
A: Press Ctrl+O to open the transcript, and Ctrl+O again to close it.

Q: Which permission mode does a new session start in, and how do you change it?
A: Auto mode. Shift+Tab cycles from auto to Manual, then Accept edits, then Plan.

Q: What does plan mode do?
A: The agent reads and explores, then writes a plan. Edits stay blocked until you approve it.

Q: How do you rewind, and what can't rewind undo?
A: Esc twice on an empty prompt, or `/rewind`. It can't undo files changed only by commands, changes made outside Claude Code, most subagent edits, or anything beyond your computer.

Q: Where does an instruction go that every session should follow?
A: In `CLAUDE.md`, which Claude Code reads at the start of every session.
```

## Final test

```final-test predict-loop
You ask the agent to fix a crash in your recipe website's search box. Its first tool call ran the tests, and the result shows an error on line 42 of `src/search.js`. What is the agent most likely to do next?
- [x] Write another tool call, this time to read `src/search.js`.
- [ ] Write a tool call that edits line 42, since the error names it.
- [ ] Ask you to paste the contents of `src/search.js` into the chat.
- [ ] Reply "Fixed", because the tests have already run once.
Why: Each result shapes the next call. The model knows only what tool results have brought in, and it hasn't seen that file yet. So the next trip round the loop reads it, with its own tool.
```

```final-test spot-no-tool-call
Ana asked the agent to fix a failing test and run the whole test suite. It replied "Done: all 42 tests pass", so she told her team the bug was fixed. Spot the mistake.
- [x] She should have checked the transcript for a real test run.
- [ ] She should have used plan mode, which runs the tests for her.
- [ ] She should have asked again, since a second reply shows the output.
- [ ] She should have switched to Accept edits, which shows each result.
Why: A tool call is what runs a test, and a reply is only words. Ctrl+O shows whether a test run happened. No call means no run, whatever the reply says.
```

```final-test unfamiliar-repo
You've copied a friend's project you've never seen. You want the agent to study it and propose how to add a dark theme, without changing a single file yet. What do you do?
- [x] Press Shift+Tab until "plan mode on", then describe the change.
- [ ] Switch to Accept edits, so it can try a few approaches quickly.
- [ ] Stay in auto mode, because its classifier stops all file edits.
- [ ] Turn on Bypass permissions, so it can explore without interruptions.
Why: Plan mode lets the agent read and explore, and blocks edits until you approve a plan. Auto mode lets edits inside your project straight through, and Accept edits and Bypass approve them too.
```

```final-test style-tweaks
You're adjusting a website's spacing and fonts: dozens of small edits to its style files. You're tired of approving each one, but you still want to be asked before it runs other commands. Which mode fits?
- [x] Accept edits
- [ ] Manual
- [ ] Plan
- [ ] Bypass permissions
Why: Accept edits lets file edits and common file commands through, and other commands still ask. Manual asks before every edit, Plan blocks edits, and Bypass asks about nothing.
```

```final-test repeat-correction
For the third session running, you've told the agent "this project uses pnpm, not npm" (two tools that install a project's packages). What do you do about it?
- [x] Add one short line about it to the project's `CLAUDE.md`.
- [ ] Keep telling it at the start of each session in this project.
- [ ] Ask it to remember, so the next session picks up this conversation.
Why: Each session starts blank, and Claude Code reads `CLAUDE.md` at the start of every one. A correction you've had to make twice is a line for that file.
```

```final-test undo-whole-request
You asked the agent to add a dark theme, and its file tools rewrote four style files. Now you've decided the whole request was a mistake. You want things as they were before you sent it. What do you do?
- [x] Esc twice, pick that request, then Restore code and conversation.
- [ ] Esc twice, pick that request, then Restore code.
- [ ] Type `/clear`, which empties the chat and undoes the session's edits.
- [ ] Press Esc once, which stops the agent and undoes its last turn.
Why: Restore code and conversation puts both the files and the chat back to before that request. Restore code alone keeps the chat. `/clear` and Esc leave the edited files as they are.
```

```final-test spot-bypass-laptop
Jo found the permission prompts annoying, so she now starts Claude Code with `--dangerously-skip-permissions`, on the laptop she uses for everything. Spot the mistake.
- [x] Bypass is for isolated containers, not the laptop with all her files.
- [ ] Bypass still asks before commands, so it only cuts the edit prompts.
- [ ] Auto mode is just as risky, so the mode she picked doesn't matter.
Why: That option turns on Bypass permissions, which runs everything without asking. Auto mode would cut her prompts and keep the classifier's check on risky actions.
```

```final-test spot-rm-rewind
Sam asked the agent to tidy up. It edited the README with its file tools, then ran `rm -r drafts`, deleting a folder it had never edited. Sam pressed Esc twice, picked that request and chose Restore code, expecting the folder back. Spot the mistake.
- [x] Rewind can't restore files that only a command changed.
- [ ] He should have chosen Restore code and conversation instead.
- [ ] He should have typed `/rewind`, as Esc twice only rewinds the chat.
- [ ] He waited too long, because checkpoints only last for a minute.
Why: Rewind tracks what Claude Code's file tools change. A folder deleted only by `rm` is outside it, whichever restore option you pick. That's why you keep committing with Git.
```

```final-test plan-approve-order
You want the agent to plan a change, then let you review each edit as it builds. Which order is right?
- [x] Plan mode on → describe the change → read the plan → "Yes, manually approve edits"
- [ ] Describe the change → plan mode on → read the plan → "Yes, manually approve edits"
- [ ] Plan mode on → describe the change → read the plan → "Yes, and use auto mode"
Why: Switch to plan mode before you describe the change, or a new session in auto mode starts building straight away. Then approve with the option that stops for each edit.
```

```final-test deeper-deny-rule
A rule must hold every time, whatever the model decides: the agent may never read your `.env` file of secret keys. Where does that rule belong?
- [x] In a deny rule, added with `/permissions`, which Claude Code enforces.
- [ ] In `CLAUDE.md`, written in capitals so the model can't miss it.
- [ ] In your first message of each session, before you ask for anything.
Why: What the model reads shapes what it tries to do, but nothing guarantees it. A deny rule is enforced by the harness, and it blocks in every mode.
```

```sources
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works), Anthropic
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes), Anthropic
- [Configure permissions](https://code.claude.com/docs/en/permissions), Anthropic
- [Interactive mode](https://code.claude.com/docs/en/interactive-mode), Anthropic
- [Checkpointing](https://code.claude.com/docs/en/checkpointing), Anthropic
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [How Claude remembers your project](https://code.claude.com/docs/en/memory), Anthropic
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic
- [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop), Anthropic
- [Harness](https://www.aihero.dev/ai-coding-dictionary/harness), AI Coding Dictionary, Matt Pocock
- [An Introduction To Plan Mode](https://www.aihero.dev/plan-mode-introduction), Matt Pocock, 2026-01-09
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
```
