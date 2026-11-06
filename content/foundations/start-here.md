---
title: Start here
slug: start-here
summary: What Idea to Shipped is, who it's for, how a lesson and its Final test work, where to begin, and what you need.
---

## What Idea to Shipped is

Coding agents can now read your files, run commands and write code while you steer. But most guides assume you already know Git, GitHub and the terminal. And few teach the habits that make an agent's work safe to ship.

**Idea to Shipped is a free reference library of seven Courses on building software with a coding agent, from your first repository to shipped code.**

A **coding agent** is an AI program that reads your project, runs commands and edits code for you. The lessons use Claude Code, Anthropic's coding agent, in your **terminal**: the window where you type commands to your computer.

```checkpoint quick-1
Which of these is a coding agent?
- [x] Claude Code, which reads your project and edits code for you.
- [ ] GitHub, the website that stores your project online.
- [ ] A terminal, the window where you type commands.
Why: A coding agent is an AI program that reads your project, runs commands and edits code for you. Claude Code is one, and it runs in your terminal.
```

Many lessons also teach Matt Pocock's Skills. Matt is a developer and teacher who publishes his Skills free, for anyone to use. A **Skill** is a named set of instructions an agent loads for one job, such as interviewing you about a plan. [What a Skill is](/learn/skills) explains them.

The library is for you if any of this is new. You may never have used Git, GitHub, a terminal or a coding agent. Each lesson explains its terms where they first appear, and links to the lesson that teaches a term in full. If you know the basics already, jump to whichever Course you need.

## The seven Courses

Each Course is a set of lessons, best read in order the first time. Each link opens a Course's first lesson.

1. **[GitHub from zero](/learn/what-git-and-github-are).** Git is the tool that saves snapshots of your project, and GitHub is the website that stores it online. You go from your first repository (a project folder that Git tracks) to proposing, reviewing and merging changes.
2. **[CI/CD: ship safely](/learn/what-ci-cd-is).** Checks that run by themselves on every change, before it reaches your live site. You build them with GitHub Actions, which runs the checks, and Vercel, which hosts the site.
3. **[Coding agents: the foundations](/learn/how-agents-work).** How an agent like Claude Code works, what fills its context window (everything it can see at once), instruction files, Skills, and choosing models. This page opens it, so the link goes to its next lesson.
4. **[Idea to shipped: the main flow](/learn/main-flow).** The Course the library is named after: Matt Pocock's path from a rough idea to merged code, one Skill at a time. You get interviewed about the idea, write a plan, split it into small pieces, then build, review and ship.
5. **[When things go wrong, and big foggy work](/learn/triage).** What to reach for when bug reports pile up or a bug resists you. And how to steer work too big to plan in one sitting.
6. **[Codebase health and guardrails](/learn/improve-codebase-architecture).** How to keep code easy for agents to work in, plus safety checks on each commit (a snapshot Git saves) and on dangerous Git commands.
7. **[More Skills: thinking, writing, running agents](/learn/ask-matt).** The rest of the toolkit: research, teaching and writing Skills, and agents that run in the background.

```checkpoint quick-2
You want automatic checks that stop a broken change from reaching your live site. Which Course fits?
- [x] CI/CD: ship safely
- [ ] GitHub from zero
- [ ] Coding agents: the foundations
Why: CI/CD: ship safely covers checks that run by themselves on every change, before it reaches your live site.
```

## How a lesson works

Most lessons have the same shape:

- **Read.** It opens with a problem you'd recognise, then the idea, with a worked example. Many lessons then have a part called **Going deeper**: why it exists, how it works underneath, a real example, what goes wrong, and further reading.
- **Quick checks.** Short questions appear right after the idea they test. They're optional. Pick an answer to see whether it's right, and why. They don't count, so guess freely.
- **Try it.** Numbered steps to do it yourself, with exact commands and what you should see.
- **Remember.** Cards to flip, for the facts worth keeping.
- **The Final test.** Every lesson ends with 5 to 10 questions on the whole lesson. Answer them all, then submit. You see your score, with the right answer and an explanation for each question.

```checkpoint quick-3
Halfway through a lesson, a quick check asks something you're not sure about. What's the best move?
- [x] Answer it anyway, then read whether you were right, and why.
- [ ] Skip it, because a wrong guess lowers your Final test score.
- [ ] Jump to the Final test, because only the test shows answers.
Why: Quick checks don't count, so a wrong guess costs nothing. Each one shows whether your answer is right, and why.
```

**Submitting the Final test marks the lesson Done, with a green tick, whatever your score.** You can retake the test any time.

Your progress is saved in your browser, so there's no account to make. A different browser or device, or clearing your browser's data, starts you afresh.

Under each lesson are its sources, then a Discussion, where anyone can leave a public comment. Your name is optional.

Tools change fast, so check dates. Matt renames Skills now and then: `/to-prd` became `/to-spec`, and `/diagnose` became `/diagnosing-bugs`. Claude Code updates often too.

So when other advice disagrees with a lesson, check when that advice was written. Then look in the tool's **changelog**, its list of what changed in each version. Matt keeps [one for his Skills](https://github.com/mattpocock/skills/blob/main/CHANGELOG.md), renames included, and Claude Code has [its own](https://code.claude.com/docs/en/changelog).

## Where to start

Pick the path that fits what you know:

- **New to Git and GitHub?** Start with [GitHub from zero](/learn/what-git-and-github-are). Most hands-on lessons happen in a Git **repository**: a project folder that Git tracks.
- **You know Git, but coding agents are new?** Carry on in Coding agents: the foundations. Next is [How coding agents work](/learn/how-agents-work).
- **You know the basics?** Go to [Idea to shipped: the main flow](/learn/main-flow), the heart of the library.
- **Stuck on something right now?** [ask-matt](/learn/ask-matt) shows which of Matt's Skills fits your situation.

```checkpoint quick-4
Your friend uses Git every day at work, but has never used a coding agent. Where should they start?
- [x] Coding agents: the foundations, with How coding agents work.
- [ ] GitHub from zero, with What Git and GitHub are.
- [ ] More Skills, with ask-matt.
Why: They know Git already, so GitHub from zero would repeat it. Coding agents are new, and the foundations Course starts there.
```

After your first pass, use the library as a reference. Come back to a lesson when you need it.

## What you need

To read, you need only a browser. For the hands-on parts, you need:

- **A computer and a terminal.** A Mac with macOS 13 or later, a Windows 10 or 11 PC, or a recent Linux computer will do, with 4 GB of memory or more. Use Terminal on a Mac, PowerShell on Windows, or any terminal app on Linux. New to terminals? Anthropic's [terminal guide](https://code.claude.com/docs/en/terminal-guide) shows how to open one.
- **A GitHub account.** It's free, at [github.com](https://github.com/signup). The GitHub lessons use it from the start.
- **Git.** Type `git --version` in your terminal to check. If it's missing, a Mac offers to install it. On Linux, use your package manager, such as `sudo apt install git` on Debian or Ubuntu. On Windows, install Git for Windows from [git-scm.com](https://git-scm.com/downloads). It adds Git Bash, a second terminal, which the GitHub lessons use. Claude Code runs in either.
- **Claude Code.** It needs a paid Claude plan (Pro, Max, Ultra, Team or Enterprise) or a Claude Console account, which you pay for with prepaid credits. The free plan isn't on that list.

```checkpoint quick-5
Your friend has only ever used the free Claude plan in the browser. They've installed Claude Code for the hands-on parts. What's missing?
- [x] A paid Claude plan, or a Claude Console account.
- [ ] A GitHub account to log in to Claude Code with.
- [ ] Nothing, since every Claude plan includes Claude Code.
Why: Claude Code needs a paid plan (Pro, Max, Ultra, Team or Enterprise) or a Claude Console account. The free plan isn't on that list.
```

Install Claude Code with its native installer, which keeps itself up to date. On a Mac, on Linux, or in WSL (Linux running inside Windows), type:

```sh
curl -fsSL https://claude.ai/install.sh | bash
```

In Windows PowerShell, type:

```powershell
irm https://claude.ai/install.ps1 | iex
```

The installer shows no progress while it downloads. When it finishes, open a new terminal window and type `claude --version`. A version number means it worked. If the terminal says `claude` isn't found, its folder isn't on your PATH yet: the list of folders your terminal searches for commands. Anthropic's [Fix your PATH](https://code.claude.com/docs/en/troubleshoot-install#command-not-found-claude-after-installation) guide has the steps.

````try
You'll need a terminal, Git, and Claude Code with an eligible plan.

1. Check your tools. Each command should print a version number.

```sh
claude --version
git --version
```

2. Make an empty folder, turn it into a Git repository, and start Claude Code in it:

```sh
mkdir first-session
cd first-session
git init
claude
```

3. Answer the first-run questions, and log in when a browser opens. When it asks whether you trust this folder, choose Yes.
4. Type the question below, and press Enter:

```text
What's in this folder? Don't change anything.
```

5. Type `/exit` to quit.

You should see the agent describe an empty folder, apart from Git's hidden `.git` folder.
````

## Remember

```flashcards
Q: What marks a lesson Done?
A: Submitting its Final test, whatever your score. A green tick then shows the lesson is Done.

Q: Where is your progress saved?
A: In your browser. There's no account, so a different browser or device starts you afresh.

Q: Git and GitHub are new to you. Where do you start?
A: GitHub from zero, with What Git and GitHub are.

Q: What do you need for the hands-on parts?
A: A computer with a terminal, a GitHub account, Git, and Claude Code with a paid Claude plan or a Claude Console account.
```

## Final test

```final-test score-and-done
You answer all six Final test questions on a lesson and submit, but only two are right. What happens to the lesson?
- [x] It's marked Done with a green tick, and you can retake the test.
- [ ] It stays not Done until you score at least five out of six.
- [ ] It's marked Done, but the test is locked and can't be retaken.
Why: Submitting the Final test marks the lesson Done, whatever your score. You can retake it any time.
```

```final-test progress-other-browser
You've finished ten lessons on your laptop at home. At work, you open Idea to Shipped in your office browser. What do you see?
- [x] No lessons Done, because progress is saved in each browser.
- [ ] All ten lessons Done, because progress is saved to your account.
- [ ] All ten lessons Done, once you sign in with your GitHub account.
Why: Progress is saved in your browser, and there's no account. A different browser or device starts you afresh.
```

```final-test new-to-git
Your friend has never used Git or GitHub, and wants to build a small website with a coding agent. Which Course should they start with?
- [x] GitHub from zero
- [ ] Coding agents: the foundations
- [ ] Idea to shipped: the main flow
- [ ] Codebase health and guardrails
Why: If Git and GitHub are new, GitHub from zero comes first. Most hands-on lessons happen in a Git repository, so the other Courses build on it.
```

```final-test command-not-found
The installer has finished. In the same terminal window, you type `claude --version` and get "command not found". What do you try first?
- [x] Open a new terminal window, and type it again.
- [ ] Install Node.js, then run the installer again.
- [ ] Log in to your Claude account, then check again.
Why: The check belongs in a new terminal window. If `claude` still isn't found there, its folder isn't on your PATH yet, and Anthropic's Fix your PATH guide has the steps.
```

```final-test renamed-skill
An older blog post says to type `/diagnose` for Matt's bug-hunting Skill. You type it, and no Skill by that name exists, though his other Skills work. What's the likeliest reason?
- [x] Matt has renamed that Skill since the post was written.
- [ ] Bug-hunting Skills start on their own, and never by typing.
- [ ] That Skill needs a more expensive plan than the others.
Why: Matt renames Skills now and then, and `/diagnose` became `/diagnosing-bugs`. So check the date on any advice you find.
```

```final-test what-you-need
You only want to read the lessons for now, on a borrowed tablet. What do you need?
- [x] A browser, and nothing else.
- [ ] Claude Code, installed on the tablet.
- [ ] A GitHub account, to unlock the lessons.
Why: To read, you need only a browser. The terminal, Git, a GitHub account and Claude Code are for the hands-on parts.
```

```sources
- [Quickstart](https://code.claude.com/docs/en/quickstart), Anthropic (Claude Code docs)
- [Advanced setup](https://code.claude.com/docs/en/setup), Anthropic (Claude Code docs)
- [mattpocock/skills](https://github.com/mattpocock/skills), Matt Pocock
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock, 2026-10-29
```
