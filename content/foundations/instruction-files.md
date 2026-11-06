---
title: Instruction files
slug: instruction-files
summary: An instruction file is a Markdown file of standing instructions that an agent reads at the start of every session.
---

## What an instruction file is

Say you told Claude Code yesterday to run `pytest` before every commit. Today you start a new session, and you're typing the same thing again. Every session starts with a fresh **context window**: everything an agent can see at once. Yesterday's chat isn't in it.

```checkpoint quick-1
You start a new Claude Code session this morning. How much of yesterday's chat is in its context window?
- [x] None of it, because every session starts with a fresh one.
- [ ] All of it, because Claude Code reopens your last session.
- [ ] The last few messages, because those carry over overnight.
Why: Every session starts with a fresh context window, so yesterday's chat isn't in it. That's why you end up typing the same thing again.
```

**An instruction file is a Markdown file of standing instructions that an agent reads at the start of every session.**

Claude Code's instruction file is called `CLAUDE.md`. You write something down once, and Claude reads it each time.

## The two you'll use

- **Your home folder: `~/.claude/CLAUDE.md`**. (`~` is shorthand for your home folder.) Your personal preferences for every project on your computer. Only you see it.
- **The repo root: `CLAUDE.md`** (or `.claude/CLAUDE.md`). Instructions for this project, in its top folder. It's committed, so everyone working on the repo gets the same file.

```checkpoint quick-2
You want "explain changes in plain English" in every project on your computer. Where does it go?
- [x] `~/.claude/CLAUDE.md`, the file in your home folder.
- [ ] `CLAUDE.md` at the root of one repo, committed with its code.
- [ ] `.claude/CLAUDE.md` inside the repo you're using.
Why: Your home folder's file holds your personal preferences for every project. A repo's file covers that one project, and everyone working on the repo gets it.
```

Say you're building the yoga-studio booking site. Your home file could hold one line:

```
Explain changes in plain English.
```

The repo's file could hold two:

```
Run `pytest` before every commit.
Tickets are GitHub Issues in this repo.
```

Now every session in that repo starts with all three lines.

## Which ones load

When you start Claude Code in a folder, it loads `CLAUDE.md` from that folder and from every folder above it, plus your home folder's file. So at the root of your FastAPI repo, it reads `~/.claude/CLAUDE.md` and the repo's `CLAUDE.md`.

```checkpoint quick-3
You start Claude Code inside your repo's `api/` folder. Which `CLAUDE.md` files load at the start?
- [x] The ones in `api/` and every folder above it, plus your home folder's.
- [ ] Only the one in `api/`, since that's the folder where you started it.
- [ ] The ones in `api/` and every subfolder below it, plus your home folder's.
Why: It loads `CLAUDE.md` from the folder you start in and from every folder above it, plus your home folder's file. Folders below aren't part of that load.
```

To check, run `/context`, a slash command showing what's loaded in your session. Look under "Memory files", the instruction files, which lists what loaded at launch.

A `CLAUDE.md` inside a subfolder, like `app/migrations/CLAUDE.md`, doesn't load at the start. It loads the first time Claude works on a file in that subfolder.

## They add up

The files don't replace each other. They're joined together, broadest first: your home folder's file, then the repo's, then a subfolder's once it loads.

```diagram
type: layers
caption: "They're joined together, broadest first"
mode: stacked
layers:
  - label: "Your home folder: `~/.claude/CLAUDE.md`"
    note: "Your personal preferences for every project on your computer."
  - label: "The repo root: `CLAUDE.md`"
    note: "Instructions for this project, in its top folder."
  - label: "`app/migrations/CLAUDE.md`"
    note: "It loads the first time Claude works on a file in that subfolder."
```

So two files can disagree, and then Claude may follow either one. Say your home file says `Use 2-space indentation` and the repo's says `Use 4-space indentation`. Fix one of them.

```checkpoint quick-4
Your home file says `Use 2-space indentation`, and the repo's says `Use 4-space indentation`. You start a session. What happens?
- [x] Claude may follow either one, so you should fix one of them.
- [ ] The repo's file wins, because it's joined in after your home file.
- [ ] Claude stops and asks you which of the two rules it should follow.
Why: The files are joined, not replaced, so both instructions reach Claude. When two disagree, it may follow either one, so the fix is to change one of them.
```

## When a repo has AGENTS.md

Many other coding agents read a file called `AGENTS.md` instead. By default, Claude reads a repo's `AGENTS.md` only when there's no `CLAUDE.md` in your folder or above it. Your home folder's file doesn't count. If both exist, it reads `CLAUDE.md`.

```checkpoint quick-5
You clone a repo that has an `AGENTS.md` but no `CLAUDE.md`, and no folder above it has one either. What does Claude read?
- [x] The `AGENTS.md`, because no `CLAUDE.md` is in or above your folder.
- [ ] Nothing from the repo, because Claude only ever reads `CLAUDE.md` files.
- [ ] Nothing yet, until you rename the `AGENTS.md` file to `CLAUDE.md` yourself.
Why: Claude reads a repo's `AGENTS.md` when there's no `CLAUDE.md` in your folder or above it, and that's the case here. If both existed, it would read `CLAUDE.md`.
```

## Why the Skills care

[setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) writes an **Agent skills block** into the repo's `CLAUDE.md`, or into `AGENTS.md` if that's the file the repo already has. The block points the Skills that need them at your settings in `docs/agents/`. For example:

```checkpoint quick-6
A repo has only an `AGENTS.md`, and you run [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills). What happens to that file?
- [x] It gets an Agent skills block, pointing the Skills at `docs/agents/`.
- [ ] It's renamed to `CLAUDE.md`, because that's the name Claude Code reads.
- [ ] It's left alone, and a new `CLAUDE.md` gets the Agent skills block.
Why: The Skill writes its block into `CLAUDE.md`, or into `AGENTS.md` if that's the file the repo already has. The block points the Skills that need them at your settings in `docs/agents/`.
```

```
## Agent skills

### Issue tracker

GitHub Issues on this repo. See `docs/agents/issue-tracker.md`.
```

That's how the Skills find your Issue tracker (see [keeping track](/learn/issues-and-keeping-track)).

## Going deeper

### Why it exists

A bad instruction file can confuse the agent and cost you on every request.

It usually goes bad by growing. The agent does something you don't like, so you add a rule to prevent it. You repeat that hundreds of times over months, and the file becomes a "ball of mud".

Size matters because the repo's `CLAUDE.md` is **global**: every instruction applies to every session. Say you add a rule about the website in `web/`. It's still there in the next session, when you only touch `api/`.

```checkpoint quick-7
Your repo's `CLAUDE.md` has a rule about the website in `web/`. Your next session only touches `api/`. What does that rule do?
- [x] It's still there, because every instruction applies to every session.
- [ ] It stays out, because it only loads in sessions that touch `web/`.
- [ ] It's there at first, then dropped once Claude opens a file in `api/`.
Why: The repo's `CLAUDE.md` is global, so a rule that only matters for the website still sits in a session about the API. That's why every line has a cost, whether it's relevant or not.
```

Matt puts the cost this way: "Every line you add has a cost that compounds across every session, whether it's relevant or not."

### How it works underneath

**It's context, not a setting.** Think of the file as a note to a colleague, not a lock on a door. Claude treats it "as context, not enforced configuration". It tries to follow the file, but nothing guarantees that, especially when an instruction is vague or conflicts with another. So write instructions concrete enough to check. For example, `Run pytest before every commit` beats `Test your changes`.

```checkpoint quick-8
Why does `Run pytest before every commit` work better than `Test your changes`?
- [x] It's concrete, and Claude is less likely to follow a vague instruction.
- [ ] Claude Code runs every command it finds in the file when a session starts.
- [ ] Vague instructions are rejected when the file loads, so Claude never sees them.
Why: Claude treats the file as context and tries to follow it, with no guarantee, especially when an instruction is vague. So instructions should be concrete enough to check.
```

**Every line costs, every session.** An agent can follow only so many instructions at once, a limit Matt calls the **instruction budget**. Anthropic's docs aim for under 200 lines per file. Longer files use more context, and Claude follows them less reliably.

Splitting a long file with imports (`@path` lines that pull in another file) doesn't cut that cost. Imported files load along with the file that imports them.

```checkpoint quick-9
Your `CLAUDE.md` is 400 lines long. You're about to move half of it into a file it imports with `@path`. How much context does that save?
- [x] None, because imported files load along with the file importing them.
- [ ] Half, because imported files load only when Claude needs what's in them.
- [ ] All of it, because imported files don't count as part of the context.
Why: Imports can tidy up a long file, but they don't shrink what loads. Imported files load along with the file that imports them.
```

**Where it sits.** Matt splits a context window into phases. The first is the **system prompt**: the instructions an agent gets before you type anything.

He counts `CLAUDE.md` as part of that prompt. Anthropic's docs, the newer source, say it arrives after the system prompt, as a message from you, not part of the system prompt.

**A second memory.** Claude Code also keeps **auto memory**: notes Claude writes itself from your corrections and preferences. It loads at the start of every session, and it's context too.

**What research found.** A 2026 study tested coding agents with and without `AGENTS.md`-style files. The files didn't generally improve task success. They also raised **inference cost**, the cost of running the model, by over 20% on average. Agents did follow the instructions well, but repository overviews didn't help. The authors conclude that while the files "are useful for specifying non-standard coding practices", any attempt to improve performance should be tested first.

```checkpoint quick-10
You're about to add a repository overview to your `CLAUDE.md`. What does the 2026 study suggest?
- [x] It won't help. The files are useful for non-standard coding practices.
- [ ] It will help, because agents follow an overview better than any rule.
- [ ] It will cut the cost of running the model by over 20% on average.
Why: The study found repository overviews didn't help, and the files raised inference cost by over 20% on average. The files are useful for specifying non-standard coding practices.
```

**Matt's February 2026 bar.** Keep a line only if it's both **undiscoverable** and **globally relevant**. Undiscoverable means the agent can't find it by reading the repo. Globally relevant means it matters in every session. A list of scripts fails, because the agent can read them in `package.json`, the settings file listing a web project's scripts and packages. Guidance for one kind of task belongs in a Skill, which "the agent can pull in when relevant". His newer [retro](/learn/retro) Skill also keeps short pointers to other files, like the Agent skills block.

### A real example

In February 2026, Matt showed his entire `CLAUDE.md`. It was one line:

```
you are on WSL on Windows
```

WSL runs Linux inside Windows, and it has path problems "that the agent can't discover on its own". So the line passes his bar: the agent can't find it, and it matters in every session.

```checkpoint quick-11
Why does `you are on WSL on Windows` pass Matt's bar?
- [x] The agent can't find it in the repo, and it matters in every session.
- [ ] It's short, and any line of six words or fewer passes his bar for size.
- [ ] It's about your machine, and only facts about machines pass his bar.
Why: WSL has path problems the agent can't discover on its own, and they matter in every session. So the line is both undiscoverable and globally relevant.
```

His Skills repo's `AGENTS.md` is a 9-byte **symbolic link**, a tiny file that points at another file, here `CLAUDE.md`. So both names open one file. His January 2026 guide suggested linking the two names, back when "Claude Code doesn't use `AGENTS.md`".

Since version 2.1.277, Claude checks for `AGENTS.md` when a folder has no `CLAUDE.md`. So check the date on any advice about these files.

### Where it goes wrong

**Claude ignored a rule in your file.** The file is context, so nothing forces Claude to follow it. Make the rule concrete first. To block an action, or to make a step like `pytest` run every time, use a hook instead. A **hook** runs as a shell command at a fixed point, "regardless of what Claude decides to do."

**A rule stopped working in a long session.** A long session can be compacted: `/compact` replaces its history with a summary. One user reported that afterwards "CLAUDE.md is completely ignored without warning". Anthropic's docs now say the root `CLAUDE.md` survives compaction, because Claude reads it again from disk. What can get lost is anything said only in conversation, or a subfolder's file that hasn't loaded again yet. So put what must last in the file.

**The agent looks in the wrong place.** When a file your instructions name "gets renamed or moved, the agent will confidently look in the wrong place." So Matt says to describe what the code can do, and give only hints about where things might be.

```checkpoint quick-12
Your `CLAUDE.md` names `api/bookings/routes.py`, and you rename that file. What happens next?
- [x] The agent confidently looks for it in the wrong place.
- [ ] The agent stops and asks you where the file has gone.
- [ ] The agent skips that line and carries on with its task.
Why: The file still names the old path, and the agent trusts it. That's why Matt says to describe what the code can do, and give only hints about where things might be.
```

**Claude stopped reading your `AGENTS.md`.** You added a `CLAUDE.local.md`, your own notes for one project, kept out of git by listing it in `.gitignore`. It counts as a `CLAUDE.md`, so Claude reads it instead of `AGENTS.md`. To keep both, type `/config` and set **Project instructions** to `claude-md-and-agents-md`.

**A generated file lists things the agent can already find.** You ran `/init`, which generates a starting `CLAUDE.md`. Here the sources disagree. Anthropic's docs suggest running it, then refining it with what Claude wouldn't discover on its own.

Matt says to delete a generated file, because what `/init` writes "is either trivially discoverable from source or will go stale". If you keep one, test each line against his bar.

```checkpoint quick-13
You find a `CLAUDE.md` that `/init` generated, and you want to follow Matt's advice. What do you do with it?
- [x] Delete it, as what `/init` writes is discoverable or will go stale.
- [ ] Keep it, and refine it with what Claude wouldn't discover on its own.
- [ ] Keep it, and run `/init` again whenever the repo's layout changes.
Why: Matt says to delete a generated file, because what `/init` writes is either easy for the agent to find or will go out of date. Refining it is what Anthropic's docs suggest.
```

### Try it

You'll need Claude Code and your practice project. If you haven't set the project up, do keeping-track's Try it step first.

1. Start Claude Code at the root of your practice project: `claude`.
2. Type `/context`. You should see the files that loaded, listed under "Memory files".
3. Open a second terminal at the repo root.
4. Make sure the folder exists: `mkdir -p api`.
5. Create a rule from your shell, not by asking Claude: `echo "Give every endpoint a test." > api/CLAUDE.md`.
6. Create a file for Claude to read: `echo "hello" > api/notes.txt`.
7. Back in Claude Code, type `Read api/notes.txt`. You should see a `Loaded` line with the path of `api/CLAUDE.md`.
8. Type `/context` again. You won't see that file under "Memory files", which lists what loaded at launch.
9. Open your repo's root instruction file. Add a line you'd like Claude to follow, then test it. Can the agent learn it only from this file? Does it matter in both `api/` and `web/`? If either answer is no, delete the line.
10. Clean up from your shell: `rm api/CLAUDE.md api/notes.txt`.
11. Commit any line you kept on a branch, and merge it through a pull request.

### Read more

- [Never Run Claude /init](https://www.aihero.dev/never-run-claude-init), Matt Pocock, updated 24 February 2026
- [A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md), Matt Pocock, updated 18 January 2026
- [How Claude remembers your project](https://code.claude.com/docs/en/memory), Anthropic, taken 29 October 2026
- [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988), Thibaud Gloaguen and others, 12 February 2026 (revised 29 September 2026)
- [Feature Request: Support AGENTS.md (#6235)](https://github.com/anthropics/claude-code/issues/6235), anthropics/claude-code, opened 21 August 2025
- [CLAUDE.md instructions completely ignored after context compaction (#19471)](https://github.com/anthropics/claude-code/issues/19471), anthropics/claude-code, opened 20 January 2026

## Remember

```flashcards
Q: Which instruction file holds your own preferences for every project?
A: `~/.claude/CLAUDE.md`, in your home folder.

Q: Where does a project's shared instruction file go?
A: At the repo root, as `CLAUDE.md` (or `.claude/CLAUDE.md`), committed so everyone gets it.

Q: When your home folder's CLAUDE.md and the repo's CLAUDE.md both load, does one replace the other?
A: No. They're joined together, and the repo's comes after yours.

Q: How do you see which instruction files loaded at launch?
A: Run `/context` and look under "Memory files".

Q: What did the 2026 study of `AGENTS.md`-style context files find about task success and cost?
A: They didn't generally improve task success, and they raised inference cost by over 20% on average.

Q: Your project relies on `AGENTS.md`. What happens when you add a `CLAUDE.local.md`?
A: Claude stops reading `AGENTS.md` for you, because `CLAUDE.local.md` counts as a `CLAUDE.md`.

Q: What size do Anthropic's docs aim for in each `CLAUDE.md` file, and why?
A: Under 200 lines. Longer files use more context and reduce how well Claude follows them.
```

## Final test

```final-test instruction-files-which-load
You start Claude Code at the root of your FastAPI repo. You have `~/.claude/CLAUDE.md`, and the repo has a `CLAUDE.md`. Which does it read?
- [x] Both: your home folder's file first, then the repo's.
- [ ] Only the repo's. It replaces your home folder's file.
- [ ] Only your home folder's. Repo files load only when you ask.
Why: Both load, because instruction files add up instead of replacing each other. They're joined together, broadest first, so your home folder's file comes first and the repo's comes after it.
```

```final-test instruction-files-agents-md
A repo has both an `AGENTS.md` and a `CLAUDE.md` at its root. By default, what does Claude read?
- [x] Only the `CLAUDE.md`.
- [ ] Only the `AGENTS.md`.
- [ ] Both, `AGENTS.md` first.
Why: Claude treats `AGENTS.md` as the fallback. It reads that file only when there's no `CLAUDE.md` in your folder or above it. This repo has a `CLAUDE.md` at its root, so Claude reads that and leaves `AGENTS.md` out.
```

```final-test instruction-files-subfolder
Your repo has `app/migrations/CLAUDE.md`. You start Claude Code at the repo root. When does that file first load in this session?
- [x] The first time Claude works on a file in `app/migrations/`.
- [ ] At the start of the session, with the repo's own `CLAUDE.md`.
- [ ] When you next start Claude Code inside `app/migrations/`.
Why: At the start, Claude Code loads the folder you started in and the folders above it, and `app/migrations/` is below that. So its file waits until Claude reads, writes or edits a file in that folder.
```

```final-test instruction-files-deeper-must-hold
Your `CLAUDE.md` says "never push to main", yet an agent pushed. Where do the docs say to put a rule that must block an action whatever Claude decides?
- [x] In a PreToolUse hook, which runs as a shell command whatever Claude decides.
- [ ] In `CLAUDE.local.md` as well, so the same rule is read twice each session.
- [ ] In a file the `CLAUDE.md` imports with `@path`, so it reloads on every message.
Why: An instruction file is context, so Claude tries to follow it but nothing forces it to. Reading the rule twice doesn't change that. A hook does, because it runs as a shell command at a fixed point, whatever Claude decides.
```

```final-test instruction-files-deeper-the-bar
You're trimming a `CLAUDE.md`. Which line passes Matt's bar for staying in it?
- [x] The note that this machine runs WSL on Windows, whose path quirks the agent can't see from the code.
- [ ] Every script from `web/package.json`, copied in so the agent never has to open that file itself.
- [ ] Where the booking handlers live, like `api/bookings/routes.py`, so the agent can go straight to them.
Why: His bar keeps a line only if the agent can't find it in the repo and it matters to every task. The WSL note is both. The scripts are already there for the agent to read in `package.json`, and a named file path is wrong the moment the file moves.
```

```sources
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md), Matt Pocock, 2026-01-18 (updated)
- [Never Run Claude /init](https://www.aihero.dev/never-run-claude-init), Matt Pocock, 2026-02-24 (updated)
- [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988), Thibaud Gloaguen, Niels Mündler-Sasahara, Mark Niklas Müller, Veselin Raychev, Martin Vechev, 2026-02-12 (v1); 2026-09-29 (v3)
- [skills/AGENTS.md at a496f55 · mattpocock/skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/AGENTS.md), Matt Pocock
- [Feature Request: Support AGENTS.md. · Issue #6235 · anthropics/claude-code](https://github.com/anthropics/claude-code/issues/6235), coygeek (opened); comments by many, 2025-08-21
- [BUG CLAUDE.md instructions completely ignored after context compaction · Issue #19471 · anthropics/claude-code](https://github.com/anthropics/claude-code/issues/19471), OWT-GwanHeeCho (opened); comments by many, 2026-01-20
- [Compaction | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/compaction), Matt Pocock
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
```
