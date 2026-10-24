---
title: Start here
slug: start-here
order: 0
part: 1
image: /photos/start-here.jpg
imageAlt: A wooden desk with a brass lamp beside an open balcony door overlooking the sea at dawn.
imageCredit: Ruben Aster
---

Everything to know before your first Lesson: what this course teaches, what to install, and how to read a page here.

```goals
- You'll be able to say who this course is for, what it teaches, and where each of its four Parts fits.
- You'll be able to set up Claude Code with the native installer, an eligible plan, a terminal and git, and know when you'd need Node.js.
- You'll be able to read a Lesson here: its Scenes, Checkpoints, Site story box, Final test and sources.
- You'll be able to start `/teach` in a folder of its own to learn a side topic over several sessions.
```

## What this course is

This is a course on working with a coding agent: an AI that reads your files, runs commands and writes code while you steer. The agent is Claude Code, Anthropic's coding agent, which runs in your terminal. The steering comes from Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code. A Skill is a short instruction file the agent loads when you type its name, like `/grill-me`, or when a task matches its description.

It's for you if you've ==never coded with an agent==. A little comfort typing commands helps, and the `/teach` tip below covers any gaps.

Why Skills? In March 2026 Matt compared agents to a team of decent engineers on call, adding that "the weird thing about these engineers is they have no memory." So the process has to be written down and followed every time, and his Skills are that process, from first idea to shipped code. Colin Eberhardt of Scott Logic tried them in October 2026 and concluded they don't replace your judgement. So the course teaches both: what each Skill does, and which decisions stay yours.

The worked example throughout is ==this site==, built with these same Skills.

## What you need

- **A computer and a terminal.** A recent Mac, Windows or Linux machine with 4 GB of RAM or more. The terminal is where you type commands: Terminal on a Mac, PowerShell on Windows.
- **Claude Code, from the native installer**, which keeps itself up to date. On a Mac, Linux or WSL: `curl -fsSL https://claude.ai/install.sh | bash`. In Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`. Then open a new terminal window and run `claude --version`.
- **An eligible plan:** ==paid Pro, Max, Team or Enterprise==, or a pay-as-you-go Console account. The free claude.ai plan doesn't include Claude Code. You log in through your browser the first time you run `claude`.
- **Git**, which saves snapshots of a project so you can compare and undo changes. Most of the course happens in a repo: a folder git tracks. On Windows, add Git for Windows so Claude Code can use Bash.
- **Node.js is optional.** Claude Code doesn't need it. You'd only use it for the other way of installing Matt's Skills, or to run this site's code.

You'll install Matt's Skills in [Skills](/learn/skills).

```scene terminal
title: Setting up on a Mac (illustrative)
# Install Claude Code with the native installer. It shows no progress while it downloads, so give it a minute.
$ curl -fsSL https://claude.ai/install.sh | bash
# Open a new terminal window, then check it. A version number means it worked.
$ claude --version
2.1.309 (Claude Code)
# Check git too. If it's missing, your Mac offers to install it.
$ git --version
git version 2.54.0 (Apple Git-157)
# Make an empty practice folder and turn it into a repo.
$ mkdir agent-practice
$ cd agent-practice
$ git init
Initialized empty Git repository in /Users/you/agent-practice/.git/
# Start Claude Code. The first time, a browser opens so you can log in. Then it asks whether you trust this folder: choose Yes.
$ claude
```

```checkpoint command-not-found
The installer finished a moment ago. In the same terminal window, you type `claude --version` and get "command not found". What do you try first?
- [ ] Install Node.js, then run the installer again.
  > Claude Code's native installer doesn't need Node, so that isn't the problem.
- [x] Open a new terminal window and try again.
  > Right. A new window picks up the folder the installer put `claude` in. If it's still missing, the setup docs explain how to fix your PATH (the list of folders your terminal searches for commands).
- [ ] Reinstall it with a different installer.
  > Nothing has gone wrong with the install yet. The old window just hasn't seen the new command.
- [ ] Upgrade to a higher plan.
  > Your plan only matters once you log in. The terminal can't even find `claude` yet.
```

## How to read a Lesson

- **Goals.** 3–4 things you'll be able to do. The Final test checks them.
- **Scenes.** Small pictures beside the text (a chat, a terminal, a flow, a file tree or a context meter) that ==build a step at a time as you scroll==. Scroll back up to replay a step. "Illustrative" marks a made-up session that behaves like the real Skill.
- **Checkpoints.** One question right after the idea it checks. Press Check to see feedback on your choice and how other Visitors answered. They never count towards passing, so guess freely.
- **Try it yourself.** The exact prompt to copy, numbered steps and an "It's working if" checklist.
- **The Site story box.** How the author really used the Skill on this site, mistakes included. It's kept apart from the teaching: the story is what happened, the teaching is what to do.
- **The Final test.** Questions checked together; 80% passes. If you miss, you see which answers were wrong and why, and you can retry as often as you like. Your latest Attempt counts, and passed Lessons get a tick on the home page.
- **Sources**, each dated. Skill facts are pinned to mattpocock-skills 1.3.1, and Claude Code facts to 23 October 2026 (version 2.1.309). Matt renames Skills, so an older video may say write-a-prd where this course says `/to-spec`.

Your answers are saved under a random ID in a cookie; there's no account.

```checkpoint site-story-vs-teaching
A Lesson's Site story box says the author typed `/grilling` to start. The teaching above it says to start with `/grill-with-docs` whenever you're in a repo. You're in a repo. Which do you type?
- [ ] `/grilling`, because it's what really worked on this site.
  > The Site story is one real run, mistakes and all. It records what happened, not what's recommended.
- [ ] Either one, because the two boxes always agree.
  > They often differ. The Site story records what really happened, sometimes before the author knew better.
- [x] `/grill-with-docs`, as the teaching says.
  > Right. The teaching is the current advice. The story sits in its own box so you can tell what happened from what to do.
- [ ] Neither, until you've passed that Lesson's Final test.
  > Nothing on this site is locked behind a Final test. Try a Skill whenever you like.
```

## The four Parts

The 20 Lessons sit in four Parts. Read them in order the first time, because each builds on the ones before. Later, jump to whichever you need.

- **Part 1, Foundations:** how an agent works, why its working memory fills up, and what a Skill is. [Start here](/learn/start-here), [How coding agents work](/learn/how-agents-work), [The context window](/learn/context-window), [Skills](/learn/skills).
- **Part 2, The main flow:** Matt's path from idea to shipped code, step by step, then the whole map. [Grilling](/learn/grilling), [Domain modeling](/learn/domain-modeling), [Prototype](/learn/prototype), [Spec + tickets](/learn/spec-and-issues), [TDD](/learn/tdd), [Implement](/learn/implement), [Code review](/learn/code-review), [PR + ship](/learn/pr-and-ship), [The main flow](/learn/main-flow).
- **Part 3, When things go wrong:** a stubborn bug, a pile of incoming requests, steps only a human can do. [Diagnosing bugs](/learn/diagnosing-bugs), [Triage](/learn/triage), [Wizard](/learn/wizard).
- **Part 4, Level up:** a codebase agents can work in, learning from each build, huge projects, choosing models. [Architecture](/learn/architecture), [Retro](/learn/retro), [Wayfinder](/learn/wayfinder), [Models, effort & ultracode](/learn/models-effort-ultracode).

Part 2 follows what Matt calls the ==Main flow==: the path most work takes through his Skills.

```scene flow
title: The Main flow, the heart of Part 2
node: grill | Grill the idea
node: spec | Spec and tickets
node: build | Build it test-first
node: review | Code review
node: pr | Pull request
node: retro | Retro
# Every change starts with an interview: `/grill-with-docs` asks questions until you and the agent want the same thing.
at: grill
# A build too big for one session gets written up with `/to-spec`, then split by `/to-tickets` into pieces the agent can finish one at a time.
at: spec
# `/implement` builds each piece, driving `/tdd`: one small automated check, then just enough code to pass it.
at: build
# Matt's code-review Skill (`/mattpocock-skills:code-review`, since Claude Code has its own `/code-review`) checks the finished code against your coding standards and the spec.
at: review
# A pull request (a proposed change, ready to merge) carries it to the live site; `/pr` writes its description.
at: pr
# `/retro` looks back on the session and improves the agent's setup for next time.
at: retro
```

```checkpoint which-lesson-stubborn-bug
A few weeks in, your own project has a bug you can't explain: the comment box saves some comments and silently drops others. Which Lesson do you turn to?
- [x] Diagnosing bugs
  > Right. It's in Part 3, When things go wrong, built for a stubborn bug that resists a first look.
- [ ] Triage
  > Triage sorts a pile of incoming reports and requests. You have one bug you can't explain.
- [ ] Retro
  > Retro looks back after a build to improve the agent's setup. First the bug has to be found.
- [ ] The context window
  > That Lesson explains the agent's working memory. It won't walk you through hunting down a bug.
```

## Learn anything with `/teach`

If the terminal, git or anything else here is new to you, Matt has a Skill for it. `/teach` is user-invoked (only you can start it, by typing its name), and it teaches one topic over several sessions.

It ==turns the folder you run it in into a teaching workspace== and keeps everything there as files. First it asks why you want to learn, and saves that as the mission. It doesn't trust what the model already knows: it finds trusted sources, cites them in every lesson, and recommends one to read yourself. Lessons are short HTML pages pitched just past what you can already do, with practice that gives instant feedback. Questions that need real-world judgement get pointed to a community.

```scene files
title: A first /teach workspace (illustrative)
# You type `/teach git basics` in an empty folder. It asks why you want to learn, then writes your answer down as the mission.
+ MISSION.md
# It searches for trusted sources before it teaches anything.
+ RESOURCES.md
# Your first lesson: one short HTML page with practice and a source to read yourself, styled by a shared stylesheet.
+ lessons/0001-what-a-commit-is.html
+ assets/lesson.css
# You do the practice and say it clicked. It records what you've shown you know, so it won't teach it twice.
+ learning-records/0001-commits.md
# It keeps a cheat sheet you'll come back to.
+ reference/git-cheat-sheet.html
# Next week, in a fresh session in the same folder, `/teach` reads these files and plans lesson two.
+ lessons/0002-branches.html
```

So **run it in an empty folder of its own**, never in your project. To carry on later, open Claude Code in that folder and type `/teach` again. Its memory is in files, so `/clear` (the Built-in command that empties the conversation) loses nothing.

In his June 2026 video, Matt shows how it taught him to solve a Rubik's Cube; he opens a session by telling it where he's stuck. His docs say most reported use is outside code; in code, people get the most from it in an unfamiliar codebase. There's no level check, so say what you already know in your first message, and check lessons against the source it recommends.

```checkpoint teach-next-session
Last week you ran `/teach` in `~/learn-git` and finished a lesson on commits. Today you open a fresh session. How do you carry on?
- [ ] Paste last week's lesson into the chat so it remembers you.
  > No need. Everything it knows about you is already saved in the folder's files.
- [ ] Start from scratch, because `/clear` erased everything it knew.
  > `/clear` empties the conversation, not the folder. The mission, lessons and learning records are still there.
- [ ] Run it from your project folder this time, so it can see more.
  > That starts a new workspace in your project and leaves your git lessons behind.
- [x] In `~/learn-git`, type `/teach` and say where you're stuck.
  > Right. It reads its own files, sees what you've learned, and plans the next lesson around what you tell it.
```

## Try it yourself

````try
You need a terminal and an eligible plan.

1. Check your tools. If `claude` isn't found, install it (see What you need), then open a new terminal window.

```sh
claude --version
git --version
```

2. Make a practice repo and start Claude Code in it. Log in if a browser opens. If it asks whether you trust this folder, choose Yes.

```sh
mkdir agent-practice
cd agent-practice
git init
claude
```

3. Type `/help`, then ask:

```text
What's in this folder? Don't change anything.
```

4. Type `/exit` to quit. If the agent ever does something you didn't want, press Esc to stop it.
5. Optional: install Matt's Skills and start a learning folder of its own.

```sh
claude plugin install mattpocock-skills@claude-plugins-official
mkdir ~/learn-git
cd ~/learn-git
claude
```

```text
/teach the git basics I need for an agentic coding course. I've never used git.
```

Answer its questions, then type `/exit`.

**It's working if:**

- [ ] Both version commands print a version number.
- [ ] `/help` lists commands, and the agent describes the folder as empty apart from git's hidden folder.
- [ ] (Optional) `/teach` asks why you want to learn before it shows a lesson, and `MISSION.md` appears in `~/learn-git`, not in `agent-practice`.
````

```site-story
This site is the first full-stack app I ever shipped. Claude Code wrote the code on Opus 5.5 at the default effort, and I steered it with Matt's Skills (the plugin, version 1.3.1, installed on 2026-10-21). The first eight pull requests all merged that same day.

The whole build, start to finish:

| # | I typed | What came out |
|---|---|---|
| 1 | `/grilling` | Decisions: scope, architecture, what's out |
| 2 | `/domain-modeling` | `GLOSSARY.md` + 4 decision records (ADRs) |
| 3 | `write the spec` | A one-page spec + 6 issues with "Done when" lists |
| 4 | `/wizard` | GitHub, Vercel and Neon connected; site live |
| 5 | `/prototype` | 3 layouts to compare; I picked one |
| 6 | `/tdd` ×4 | Lesson pages, database table, API, comment box |
| 7 | `/mattpocock-skills:code-review` | The finished code checked against the spec |

**The stack:** Next.js for the site and its backend, a Neon Postgres database with a separate branch for each environment, Drizzle to talk to it, and Vercel for hosting.

**The one rule I learned:** *I own the architecture and the scope. The agent owns the details.* My job was to decide, review and check the "Done when" lists, not to type code.

That order isn't Matt's Main flow, so the course follows his, not mine. Today `/grill-with-docs` would replace rows 1 and 2, and `/to-spec` then `/to-tickets` would replace row 3.
```

## Cheat sheet

| You want to | Do this |
|---|---|
| Check the install | `claude --version`, in a new window |
| Start a session | `cd` into your repo, then `claude` |
| Stop the agent, or quit | Esc stops it; `/exit` quits |
| Find which Skill fits | `/ask-matt`, Matt's router Skill (see [Skills](/learn/skills)) |
| Learn a side topic | `/teach`, in a folder of its own |

## Final test

```test scenario-where-to-start
Dev has written a little Python but has never let an AI agent work on a project. Dev wants to learn Matt's Skills from this course. Where should Dev begin?
- [ ] Grilling, since Part 1 is optional background.
  > Part 1 explains what the rest depends on: how agents work, the context window and what a Skill is.
- [x] Here, then Part 1 in order.
  > Right. The course is written for someone who has never coded with an agent, and each Lesson builds on the ones before it.
- [ ] Level up, to see the most advanced Skills first.
  > Part 4 assumes you know the Main flow. Starting there means meeting ideas nobody has explained yet.
- [ ] Any Lesson at random; the order doesn't matter.
  > The Lessons are ordered so each builds on the last. The first time through, read them in order.
```

```test scenario-free-plan
Your friend installed Claude Code with the native installer and wants to follow along, but only has the free claude.ai plan. What else do they need?
- [ ] Node.js, so Claude Code can run.
  > The native installer doesn't need Node. The plan is the problem.
- [ ] A GitHub account, to log in.
  > Claude Code logs in with a Claude account in the browser, not with GitHub.
- [ ] Nothing; the free plan covers the course.
  > The free claude.ai plan doesn't include Claude Code at all.
- [x] A paid plan, or a Console account.
  > Right. Claude Code needs a Pro, Max, Team or Enterprise plan, or a pay-as-you-go Console account.
```

```test spot-unneeded-step
Ana set up for the course like this: (1) installed Node.js, because she'd read that Claude Code runs on it; (2) ran the native installer; (3) opened a new terminal window and got a version number from `claude --version`; (4) made an empty folder, ran `git init` and started `claude` there. Spot the step she didn't need.
- [x] Step 1
  > Right. The native installer doesn't need Node.js. She'd only want it for the other way of installing Matt's Skills, or to run this site's code.
- [ ] Step 2
  > The native installer is the recommended way to get Claude Code, and it keeps itself up to date.
- [ ] Step 3
  > Opening a new window is what lets the terminal find `claude`, and the version number proves the install worked.
- [ ] Step 4
  > Most of the course happens in a git repo, so a fresh practice repo is exactly the right place to start.
```

```test scenario-failed-final-test
You finish a Lesson's Final test with 4 of 6 right, so it isn't passed. What's the best next step?
- [ ] Go back and answer more Checkpoints to raise your score.
  > Checkpoints never count towards passing, however many you get right.
- [ ] Accept it, because a Final test can only be taken once.
  > You can try again as often as you like.
- [x] Read why each miss was wrong, reread, then retry.
  > Right. The feedback shows which answers were wrong and why, and your latest Attempt is the one that counts.
- [ ] Clear your cookies so the site forgets your first go.
  > No need. Retrying is allowed, and your latest Attempt decides whether the Lesson is passed.
```

```test scenario-teach-folder
You're building a recipe site in `~/recipes` and want to spend the next two weeks learning SQL properly. Where do you run `/teach`?
- [ ] In `~/recipes`, so it can learn from your real code.
  > It would turn your project folder into a teaching workspace, mixing lesson files in with your code.
- [x] In a new, empty folder kept just for SQL.
  > Right. One topic per workspace, outside your project. Its mission, lessons and records live there between sessions.
- [ ] Nowhere; just ask SQL questions in your recipe session.
  > Asking in passing suits one explanation. Two weeks of learning that builds session by session is what `/teach` is for.
- [ ] In your home folder, so every project can use it.
  > A shared folder mixes topics. `/teach` keeps one mission per workspace, so give SQL a folder of its own.
```

```test predict-teach-first-move
You type `/teach the basics of git` in an empty folder for the first time. What should happen first?
- [x] It asks why you want to learn git.
  > Right. With no mission yet, its first job is finding out why you're learning, and it writes your answer to `MISSION.md`.
- [ ] It opens a first lesson straight away.
  > Lessons come after the mission, because every lesson is built around why you're learning.
- [ ] It sets a placement exam to find your level.
  > There's no level check. That's why it helps to say what you already know in your first message.
- [ ] It installs git and sets up a repo for you.
  > `/teach` teaches; it doesn't set up your tools. Its first move is a question.
```

```sources
- [teach SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/teach/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the Main flow): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (renamed Skills): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /teach Skill](https://www.aihero.dev/skills-teach), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [Set up Claude Code](https://code.claude.com/docs/en/setup) and [Authentication](https://code.claude.com/docs/en/authentication), Claude Code docs, read 2026-10-23 (Claude Code 2.1.309).
- [Learn anything with the /teach skill](https://www.youtube.com/watch?v=s5T5oQJcJ6U), Matt Pocock, 2026-06-08 (bus ride and Rubik's Cube 0:16–0:28, empty folder 2:28–2:38, mission first 2:42–3:04, telling it where he's stuck 6:13–6:41, state in files 8:24–8:35, onboarding to a codebase 10:04–10:43).
- [5 Claude Code skills I use every single day](https://www.youtube.com/watch?v=EJyuu6zlQCg), Matt Pocock, 2026-03-16 (agents with no memory need strict processes, 0:00–0:49).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (`/ask-matt` as the place to start, 6:58–7:40).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
```
