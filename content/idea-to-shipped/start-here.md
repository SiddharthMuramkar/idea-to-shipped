---
title: Start here
slug: start-here
image: /photos/start-here.jpg
imageAlt: A wooden desk with a brass lamp beside an open balcony door overlooking the sea at dawn.
imageCredit: Ruben Aster
---

Everything to know before your first Lesson: what this course teaches, what to install, and how to read a page here.

```goals
- You'll be able to say which of the course's four Parts to turn to for a given problem.
- You'll be able to set up Claude Code with the native installer, an eligible plan, a terminal and git, and know when you'd need Node.js.
- You'll be able to use a Lesson's Checkpoints as you read, and its dated sources to spot a renamed Skill.
- You'll be able to start `/teach` in a folder of its own to learn a side topic over several sessions.
```

## What this course is

This is a course on working with a coding agent: an AI that reads your files, runs commands and writes code while you steer. The agent is Claude Code, Anthropic's coding agent, which runs in your terminal (the window where you type commands). The method comes from Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code. A Skill is a short instruction file the agent loads when you type its name, like `/grill-me`, or, for some Skills, when your request matches what it's for.

It's for you if you've ==never coded with an agent==.

Why Skills? In March 2026 Matt compared agents to a team of decent engineers on call, adding that "the weird thing about these engineers is they have no memory." So the process must be written down, and his Skills are that process, from idea to shipped code. In an October 2026 review, Colin Eberhardt of Scott Logic found their practices sound but said they don't remove the need for your judgement. So the course teaches both: what each Skill does, and which decisions stay yours.

The worked example throughout is ==this site==, built with these same Skills.

## What you need

- **A computer and a terminal.** A recent Mac, Windows or Linux machine with 4 GB of RAM or more. Use Terminal on a Mac, PowerShell on Windows, any terminal app on Linux.
- **Claude Code, from the native installer**, which keeps itself up to date. On a Mac, Linux or WSL (Linux running inside Windows): `curl -fsSL https://claude.ai/install.sh | bash`. In Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`. Then open a new terminal window and run `claude --version`. Still not found? Follow the fix the installer printed under "Setup notes", then open another window.
- **An eligible plan:** ==a paid Pro, Max, Team or Enterprise plan==, or a Claude Console account (Anthropic's developer account, paid with credits you buy in advance). The free claude.ai plan doesn't include Claude Code. Running `claude` starts a session: one conversation with the agent, until you quit or clear it.
- **Git**, which saves snapshots of a project so you can compare and undo changes. Most of the course happens in a repo: a folder git tracks. On Windows, install Git for Windows (git-scm.com), which also lets Claude Code use Bash, a common command shell. On Linux, use your package manager.
- **Node.js is optional.** Claude Code doesn't need this JavaScript tool. You'd only use it to run this site's code, or for a second way of installing Matt's Skills that this course doesn't use.

```scene terminal
title: Setting up on a Mac (illustrative)
# Install Claude Code with the native installer. It shows no progress while it downloads, so give it a minute.
$ curl -fsSL https://claude.ai/install.sh | bash
# Open a new terminal window, then check it. A version number means it worked. If it's still not found, follow the fix the installer printed under "Setup notes", then open another window.
$ claude --version
2.1.309 (Claude Code)
# Check git too. If it's missing, your Mac offers to install it.
$ git --version
git version 2.54.0 (Apple Git-157)
# Make an empty practice folder and turn it into a repo, one command per line.
$ mkdir agent-practice
$ cd agent-practice
$ git init
Initialized empty Git repository in /Users/you/agent-practice/.git/
# Start Claude Code. The first time, answer its setup questions and log in when a browser opens. Then it asks whether you trust this folder: choose Yes.
$ claude
```

```checkpoint command-not-found
The installer has just finished. You type `claude --version` and get "command not found" (on Windows, "not recognized"). What do you try first?
- [ ] Install Node.js, then run the installer again.
  > Claude Code's native installer doesn't need Node, so that isn't the problem.
- [x] Open a new terminal window and try again.
  > Right. The window you installed from keeps the PATH it started with (the list of folders your terminal searches for commands), so the docs say to check in a new window first. If it's still missing, the installer's folder isn't on your PATH. The installer doesn't change PATH itself, but the "Setup notes" it prints give the fix.
- [ ] Reinstall it with a different installer.
  > Don't reinstall yet. First rule out the old window, then check the installer's Setup notes about PATH.
- [ ] Log in first, then run the version check again.
  > There's nothing to log in to yet: the terminal can't find `claude` at all. You log in the first time `claude` starts.
```

## How to read a Lesson

- **Goals.** 3–4 things you'll be able to do. The Final test checks them.
- **Scenes.** Small pictures beside the text (above it on a phone), such as a chat, a terminal, a flow chart or a file list, each with ==numbered captions to read in order==. "Illustrative" marks a made-up session that behaves like the real Skill.
- **Checkpoints.** One question right after the idea it checks. Pick an answer, then open "Show the answer" to see why each option is right or wrong. They never count, so guess freely.
- **Try it yourself.** The exact prompt to copy, numbered steps and an "It's working if" checklist.
- **The Site story box.** How the author really used the Skill on this site, mistakes included. It's kept apart from the teaching: the story is what happened, the teaching is what to do.
- **The Final test.** Questions at the end on the Lesson's goals. Answer them all, then open the box under each one to check yourself.
- **Sources**, each dated. Skill facts match version 1.3.1 of Matt's Skills, and Claude Code facts 23 October 2026 (version 2.1.309). Matt renames Skills, so an older video may say write-a-prd where this course says `/to-spec`.

```checkpoint site-story-vs-teaching
A Lesson's Site story box says the author typed `/grilling` to start. The teaching above it says to start with `/grill-with-docs` whenever you're in a repo. You're in a repo. Which do you type?
- [ ] `/grilling`, because it's what really worked on this site.
  > The Site story is one real run, mistakes and all. It records what happened, not what's recommended.
- [ ] Either one, since the story and the teaching are equally good advice.
  > They aren't equal. The story can show a choice the author made before knowing better. The teaching is what to do now.
- [x] `/grill-with-docs`, since the teaching is the current advice.
  > Right. The teaching is what to do now. The story sits in its own box so you can tell what happened from what to do.
- [ ] Both, one after the other, so you follow the story and the teaching.
  > No need. `/grill-with-docs` already runs the `/grilling` interview, and writes docs as it goes. The teaching is the one to follow.
```

## The four Parts

The 20 Lessons sit in four Parts. Read them in order the first time.

- **Part 1, Foundations:** how an agent works, why its working memory fills up and its work slips in a long session, and what a Skill is. [Start here](/learn/start-here), [How coding agents work](/learn/how-agents-work), [The context window](/learn/context-window), [Skills](/learn/skills).
- **Part 2, The main flow:** Matt's path from idea to shipped code, step by step (this section's Scene walks through it), then the whole map. [Grilling](/learn/grilling), [Domain modeling](/learn/domain-modeling), [Prototype](/learn/prototype), [Spec + tickets](/learn/spec-and-issues), [TDD](/learn/tdd), [Implement](/learn/implement), [Code review](/learn/code-review), [PR + ship](/learn/pr-and-ship), [The main flow](/learn/main-flow).
- **Part 3, When things go wrong:** a stubborn bug, a pile of incoming requests, steps only a human can do. [Diagnosing bugs](/learn/diagnosing-bugs), [Triage](/learn/triage), [Wizard](/learn/wizard).
- **Part 4, Level up:** a codebase agents can work in, learning from each build, huge projects, choosing models. [Architecture](/learn/architecture), [Retro](/learn/retro), [Wayfinder](/learn/wayfinder), [Models, effort & ultracode](/learn/models-effort-ultracode).

Part 2 follows what Matt calls the ==Main flow==: the path most work takes through his Skills.

```scene flow
title: The Main flow, the heart of Part 2
node: grill | Grill the idea
node: proto | Detour: a quick prototype | side
node: spec | Big build: spec, then tickets
node: here | Small change: build it right here | side
node: build | Build it test-first
node: pr | Pull request
node: retro | Retro
# Most changes start with an interview: `/grill-with-docs` asks questions until you and the agent want the same thing.
at: grill
# A question that talking can't settle, like how a page should look, takes a detour: a quick throwaway build with `/prototype`, and you bring back what you learned.
at: proto
# A build too big for one session gets written up as a spec (what to build and why) with `/to-spec`, then split by `/to-tickets` into tickets: pieces the agent can finish one at a time.
at: spec
# A small change skips the spec and tickets: `/implement` builds it right here, in the same conversation.
at: here
# Either way, `/implement` builds by driving `/tdd` (test-driven development: one small automated check, then just enough code to pass it), and closes with a code review against your coding standards and, when there is one, the spec.
at: build
# A pull request, or PR (a proposed change, checked before it joins the main code), is how the work reaches the live site. The agent writes its description with `/pr`.
at: pr
# `/retro` looks back on the session and suggests changes to the agent's setup; you choose which to make. It gets its own Lesson, in Part 4.
at: retro
```

```checkpoint which-lesson-stubborn-bug
A few weeks in, the comment box on your own project saves some comments and silently drops others, and a first look shows no reason why. Which Lesson do you turn to?
- [x] Diagnosing bugs
  > Right. It's in Part 3, When things go wrong, built for a problem that resists a first look.
- [ ] Triage
  > Triage sorts a pile of incoming reports and requests. You have one problem you can't explain.
- [ ] Code review
  > Code review checks a finished change against your coding standards and, when there is one, the spec. Here something misbehaves and nobody knows why, so the first job is finding the cause.
- [ ] Models, effort & ultracode
  > A stronger model or more effort won't tell you why comments vanish. First you need the cause, and that's what Diagnosing bugs is for.
```

## Learn anything with `/teach`

If the terminal, git or anything else here is new to you, Matt has a Skill for it, once his Skills are installed (step 5 of the Try below). `/teach` is user-invoked (only you can start it, by typing its name), and it teaches one topic over several sessions.

It ==turns the folder you run it in into a teaching workspace== and keeps everything there as files. First it asks why you want to learn, and saves that as the mission. It doesn't trust what the AI already knows: it finds trusted sources, cites them in every lesson, and recommends one to read yourself.

```scene files
title: A first /teach workspace (illustrative)
# You type `/teach git basics` in an empty folder. It asks why you want to learn, then writes your answer down as the mission.
+ MISSION.md
# It searches for trusted sources before it teaches anything.
+ RESOURCES.md
# Your first lesson: one short web page (an HTML file) with practice and a source to read yourself, styled by a shared stylesheet.
+ lessons/0001-what-a-commit-is.html
+ assets/lesson.css
# You get the practice right. It writes down what you've shown you know, so the next lesson builds on it.
+ learning-records/0001-commits.md
# It keeps a cheat sheet you'll come back to.
+ reference/git-cheat-sheet.html
# Next week, in a fresh session in the same folder, `/teach` reads these files and plans lesson two.
+ lessons/0002-branches.html
```

So **run it in an empty folder of its own**, never in your project. To carry on later, open Claude Code in that folder and type `/teach` again. Its memory is in files, so `/clear`, a Built-in command (part of Claude Code itself) that empties the conversation, loses nothing.

In his June 2026 video, Matt learns to solve a Rubik's Cube with it, opening a session by saying where he's stuck. There's no level check, so say what you already know in your first message, and check lessons against the source it recommends.

```checkpoint teach-next-session
Last week you ran `/teach` in `~/learn-chess` and finished a lesson on how the knight moves. Today you open a fresh session. How do you carry on?
- [ ] In `~/learn-chess`, paste last week's lesson so it remembers you.
  > Pasting doesn't start `/teach`: only typing its name does. And its files already hold what you've learned.
- [ ] Start from scratch, because `/clear` erased everything it knew.
  > `/clear` empties the conversation, not the folder. The mission, lessons and learning records are still there.
- [ ] Make a new empty folder, since each session needs a fresh workspace.
  > The opposite: one workspace per topic, reused every session. A new folder starts from zero, with no mission or records.
- [x] In `~/learn-chess`, type `/teach`, as its files hold your progress.
  > Right. It reads its own files, sees what you've learned and plans the next lesson. Tell it where you're stuck, as Matt does.
```

## Try it yourself

````try
You need a terminal and an eligible plan. Press Enter after each command.

1. Check your tools. If either isn't found, install it (see What you need), then open a new terminal window.

```sh
claude --version
git --version
```

2. Make a practice repo and start Claude Code in it. Answer its first-run questions, and log in when a browser opens. When it asks whether you trust this folder, choose Yes.

```sh
mkdir agent-practice
cd agent-practice
git init
claude
```

3. Type `/help`, then ask the question below. While the agent works, Esc stops it. If it asks permission to do something you didn't ask for, choose No.

```text
What's in this folder? Don't change anything.
```

4. Type `/exit` to quit.
5. Optional: install Matt's Skills as a plugin (an add-on that updates itself), then start a learning folder of its own.

```sh
claude plugin install mattpocock-skills@claude-plugins-official
mkdir ~/learn-git
cd ~/learn-git
claude
```

```text
/teach git basics. I've never used git.
```

Answer its questions, then type `/exit`.

**It's working if:**

- [ ] Both version commands print a version number.
- [ ] `/help` lists commands, and the agent describes the folder as empty apart from git's hidden folder.
- [ ] (Optional) `/teach` asks why you want to learn before it shows a lesson, and `ls` in `~/learn-git` lists `MISSION.md`.
````

```site-story
This site is the first full-stack app (pages, server and database) I ever shipped. Claude Code wrote the code with Anthropic's Opus 5.5 model, and I steered it with Matt's Skills (the plugin, version 1.3.1). The first eight pull requests all merged on the same day, 21 October 2026.

The whole build, start to finish:

| # | I typed | What came out |
|---|---|---|
| 1 | `/grilling` | Decisions: scope, architecture, what's out |
| 2 | `/domain-modeling` | `GLOSSARY.md` + 4 decision records (ADRs) |
| 3 | `write the spec` | A one-page spec + 6 issues (tickets) with "Done when" lists |
| 4 | `/wizard` | GitHub, Vercel and Neon connected; site live |
| 5 | `/prototype` | 3 layouts to compare; I picked one |
| 6 | `/tdd` ×4 | Lesson pages, database table, API, comment box |
| 7 | `/mattpocock-skills:code-review` (its full name: Claude Code has its own `/code-review`) | The finished code checked against the spec |

**The stack:** Next.js for pages and server, a Neon Postgres database with a copy for my laptop, tests and the live site, Drizzle to reach it from code, and Vercel for hosting.

**The one rule I learned:** *I own the architecture and the scope. The agent owns the details.* My job was to decide, review and check the "Done when" lists, not to type code.

That order isn't Matt's Main flow, so the course follows his: today `/grill-with-docs` would replace rows 1 and 2.
```

## Cheat sheet

| You want to | Do this |
|---|---|
| Check the install | `claude --version`, in a new window |
| Start a session | `cd` into your repo, then `claude` |
| Stop the agent, or quit | Esc stops it; `/exit` quits |
| Find which Skill fits | Type `/ask-matt`, then your situation, in one message ([Skills](/learn/skills) covers it) |
| Learn a side topic | `/teach`, in a folder of its own |

## Final test

```final-test scenario-which-part
Two hours into one long session, the agent's answers get sloppier and it starts contradicting decisions you settled at the start. You want to understand why. Which Part explains it?
- [x] Part 1, Foundations
  > Right. Foundations explains how an agent works and why its working memory fills up over a long session, which is what you're seeing.
- [ ] Part 2, The main flow
  > The main flow walks you from idea to shipped code. It relies on knowing why a long session goes downhill, and Part 1 explains that.
- [ ] Part 3, When things go wrong
  > Part 3 is for problems in your project: a stubborn bug, a pile of incoming requests, steps only a human can do. This one is about how the agent itself works.
- [ ] Part 4, Level up
  > Part 4 covers choosing models, but even the best model slips as a long session fills its working memory. Why that happens is a foundation, in Part 1.
```

```final-test scenario-free-plan
Your friend has only ever used Claude's free chats in the browser. They've just installed Claude Code with the native installer and want to follow along. Is anything missing?
- [ ] No, their chat account works once they log in
  > Free claude.ai chats don't include Claude Code at all. They need a paid plan or a Console account.
- [ ] A GitHub account to log in with
  > Claude Code logs in with a Claude account in the browser, not with GitHub.
- [x] A paid plan or a Console account
  > Right. Claude Code needs a paid Pro, Max, Team or Enterprise plan, or a Claude Console account with credits bought in advance.
- [ ] Node.js installed alongside Claude Code
  > The native installer doesn't need Node. The plan is what's missing.
```

```final-test spot-unneeded-step
Ana set up for the course like this: (1) ran the native installer to get Claude Code; (2) installed Node.js, so Claude Code would have what it needs to run; (3) opened a new terminal window, so it could find `claude`, and got a version number from `claude --version`; (4) made an empty folder, ran `git init` in it for a practice repo, and started `claude` there. Spot the step she didn't need.
- [ ] Step 1, the native installer
  > The native installer is the recommended way to get Claude Code, and it keeps itself up to date.
- [x] Step 2, installing Node.js
  > Right. The native installer doesn't need Node.js. She'd only want it to run this site's code, or for a second way of installing Matt's Skills that this course doesn't use.
- [ ] Step 3, the new terminal window
  > The docs say to check the install in a new window, and the version number proves it worked.
- [ ] Step 4, the practice repo
  > Most of the course happens in a git repo, so a fresh practice repo is exactly the right place to start.
```

```final-test scenario-unsure-checkpoint
Halfway through a Lesson, a Checkpoint asks something you're not sure about. What's the best move?
- [ ] Skip it, since a wrong guess lowers your Final test score.
  > Checkpoints never count towards anything. A wrong guess costs nothing, and the feedback teaches you.
- [ ] Reread the whole Lesson from the top before you answer.
  > A Checkpoint sits right after the idea it checks, so the section just above is all you need.
- [ ] Jump to the Final test, since only it shows the answers.
  > Every Checkpoint has its own answer box, with feedback on each option.
- [x] Answer it anyway, then read the feedback on every option.
  > Right. Checkpoints never count, so a wrong answer costs nothing, and the feedback shows what you missed.
```

```final-test scenario-teach-folder
You're building a recipe site in `~/recipes` and want to spend the next two weeks learning SQL properly. Where do you run `/teach`?
- [x] In a new empty folder, so lesson files stay out of your code.
  > Right. One topic per workspace, outside your project. Its mission, lessons and records live there between sessions.
- [ ] In `~/recipes`, so it can learn from your real code.
  > It would turn your project folder into a teaching workspace, mixing lesson files in with your code. Even for learning a codebase, Matt suggests starting the learner in a separate workspace and pointing it at the code.
- [ ] Nowhere, since asking in your recipe session works just as well.
  > Asking in passing suits one explanation. Two weeks of learning that builds session by session is what `/teach` is for.
- [ ] In your home folder, so every project you have can use it.
  > A shared folder mixes topics. `/teach` keeps one mission per workspace, so give SQL a folder of its own.
```

```final-test scenario-renamed-skill
A blog post from spring 2026 says Matt's bug-hunting Skill starts when you type /diagnose. You type it, but no Skill by that name exists, though his other Skills, like `/teach`, work fine. What's the likeliest reason?
- [ ] Bug-hunting Skills only start on their own, never by typing.
  > Any of Matt's Skills starts when you type its name, and some can also start on their own. The name in the post is out of date.
- [ ] That Skill only starts inside a git repo.
  > Matt's Skills come as a plugin, which works in any folder. `/teach` works, so they're loaded; this name is out of date.
- [x] Matt has renamed that Skill since the post was written.
  > Right. Matt renames Skills, so check a source's date. This course uses the 1.3.1 names, where that Skill is `/diagnosing-bugs`.
- [ ] That Skill needs a higher plan, such as Max.
  > Every eligible plan runs the same Skills. The plan isn't the problem; the name is out of date.
```

```sources
- [teach SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/teach/SKILL.md) and [LEARNING-RECORD-FORMAT.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/teach/LEARNING-RECORD-FORMAT.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the Main flow, its two forks, and what `/retro` suggests): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md) (drives `/tdd`, then a code review): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (diagnose renamed to diagnosing-bugs in 1.0.0; to-prd renamed to to-spec in 1.1.0): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /teach Skill](https://www.aihero.dev/skills-teach), AI Hero docs, updated 2026-08-24, read 2026-10-23 (no level check; checking lessons against sources).
- [Quickstart](https://code.claude.com/docs/en/quickstart), [Advanced setup](https://code.claude.com/docs/en/setup), [Troubleshoot installation and login](https://code.claude.com/docs/en/troubleshoot-install) and [Authentication](https://code.claude.com/docs/en/authentication), Claude Code docs, read 2026-10-23 (Claude Code 2.1.309).
- [Learn anything with the /teach skill](https://www.youtube.com/watch?v=s5T5oQJcJ6U), Matt Pocock, 2026-06-08 (bus ride and Rubik's Cube 0:16–0:28, empty folder 2:28–2:38, mission first 2:42–3:04, telling it where he's stuck 6:11–6:30, state in files 8:24–8:35, a learner's own workspace for a codebase 10:04–10:43).
- [5 Claude Code skills I use every single day](https://www.youtube.com/watch?v=EJyuu6zlQCg), Matt Pocock, 2026-03-16 (agents with no memory need strict processes, 0:00–0:49; the old write-a-prd name, 4:05).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (`/ask-matt` as the place to start, 6:58–7:40).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
```
