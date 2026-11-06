---
title: One change, start to finish
slug: one-change-start-to-finish
summary: Every change goes round the same loop: Claude runs the steps, and you decide what gets built and what goes into your project.
---

## What happens to a change

Say you ask Claude to fix something. Commands scroll past, then it says it's done. You couldn't say what happened.

**Every change goes round the same loop: Claude runs the steps, and you decide what gets built and what goes into your project.**

```checkpoint quick-1
In the loop, who decides what goes into your project?
- [x] You do, while Claude runs the steps.
- [ ] Claude does, because it runs the steps.
- [ ] Nobody does, because every change goes in.
Why: Every change goes round the same loop. Claude runs the steps, and you decide what gets built and what goes into your project.
```

## The loop

A **repo** is your project plus the history git records.

```checkpoint quick-2
What is a repo?
- [x] Your project plus the history git records.
- [ ] The tool that records your project's history.
- [ ] Your project's files, without any history.
Why: A repo, short for repository, is your project plus the history git records.
```

GitHub, a website, keeps a copy. You pick an **Issue**: one item on the repo's work list.

Claude makes a **branch**: a separate line of work. `main`, GitHub's default branch, stays untouched.

```checkpoint quick-3
While Claude works on a branch, what happens to `main`?
- [x] It stays untouched.
- [ ] It takes each change as it's made.
- [ ] It moves over to the new branch.
Why: A branch is a separate line of work. `main`, GitHub's default branch, stays untouched.
```

Claude makes the change. A **commit** is a saved snapshot. A **push** copies commits to GitHub. Claude commits and pushes.

```checkpoint quick-4
How does a commit differ from a push?
- [x] A commit saves a snapshot; a push copies commits to GitHub.
- [ ] A commit copies work to GitHub; a push saves a snapshot.
- [ ] A commit saves a snapshot; a push saves a second snapshot.
Why: A commit is a saved snapshot. A push copies commits to GitHub.
```

Claude opens a **pull request** (PR): a proposal to bring your changes into `main`. That move is a **merge**.

**CI** is your project's automation. CI runs **the checks**: building and testing every pull request.

```checkpoint quick-5
What are the checks that CI runs?
- [x] Your project's automatic build and test of every pull request.
- [ ] Your project's automatic merge of every pull request that passes.
- [ ] The things you look at yourself before you say merge.
Why: CI is your project's automation. The checks it runs build and test every pull request.
```

You run your **Merge check**: what you [look at](/learn/checking-a-pr) before merging. You say merge, and Claude merges it.

The pull request says `Closes` and the Issue's number. The merge closes the Issue. Claude cleans up: it deletes the branch and updates your computer's `main`.

```diagram
type: chain
caption: "Every change goes round the same loop"
steps:
  - "You pick an Issue"
  - "Claude makes a branch"
  - "Claude commits and pushes"
  - "Claude opens a pull request"
  - "CI runs the checks"
  - label: "You run your Merge check"
    note: "You say merge, and Claude merges it"
  - "The merge closes the Issue"
  - "Claude cleans up"
```

## What stays yours

- What to build.
- What goes in a **Spec**: an Issue describing one whole feature.
- The Merge check.

```checkpoint quick-6
What is a Spec?
- [x] An Issue describing one whole feature.
- [ ] A pull request holding one whole feature.
- [ ] A branch holding one whole feature.
Why: A Spec is an Issue describing one whole feature. What goes in it stays yours, along with what to build and the Merge check.
```

## One small, normal change

Take pull request #105 on this site's repo: 1 commit.

A **look-only command** changes nothing, so you run those yourself, to confirm what happened. `gh` is GitHub's command-line tool.

```checkpoint quick-7
Who runs a look-only command, and why?
- [x] You do, to confirm what happened.
- [ ] Claude does, because only it runs commands.
- [ ] You do, because only your branch changes.
Why: A look-only command changes nothing, so you run those yourself, to confirm what happened.
```

Say you'd asked for that change:

You say:

> Start Issue #99 on a new branch, then open a pull request that closes it.

Claude runs:

```
git switch -c 99-lesson-audio-records
git add .
git commit -m "..."
git push origin 99-lesson-audio-records
gh pr create --title "..." --body "Closes #99"
```

Claude edits files before `git add .`, which picks what to commit.

Only the owner can run this, so read it.

You look:

```
gh pr view 105 --repo SiddharthMuramkar/skills
```

It prints `+30 -9 • ✓ Checks passing`.

## Do it now

You need `gh` logged in and your project on GitHub. Missing one? See Where it goes wrong on [the full page](/learn/one-change-start-to-finish).

Open two terminals in your project's folder: one for Claude, one for look-only commands.

You say:

> Before each step, tell me what you're about to do and why, and wait for me.

Claude should run nothing yet. Paste this line for Claude per session, because each one starts fresh. Never save it, or unwatched sessions stall. Drop it once you're confident.

```checkpoint quick-8
How often do you paste the line for Claude?
- [x] Once per session, because each one starts fresh.
- [ ] Once only, because every session reads it from a file.
- [ ] Before each step, because Claude forgets it after each reply.
Why: Paste the line per session, because each one starts fresh.
```

You look:

```
gh issue list
```

You should see your open Issues. None, or an error? See Where it goes wrong.

Pick one small, clear Issue, like cut-off text (#318 on `finance-agent`, an example repo). Note its number for the next Lessons, then stop.

## Going deeper

### Why it exists

When Claude can run every step, it's easy to stop following along. Claude writes about 90 percent of the code for Claude Code. The team behind it still keeps people for deciding what to build and for checking the proof that a change works, like test output. The team gives one more reason: "A person answers for every change that ships, whoever typed it." So the loop gives Claude the commands and leaves you the decisions.

```checkpoint quick-9
Claude typed a change, and it has shipped. Who answers for it?
- [x] A person, whoever typed it.
- [ ] Claude, because it typed it.
- [ ] Nobody, once the checks passed.
Why: The team that builds Claude Code puts it this way, "A person answers for every change that ships, whoever typed it." So the loop leaves you the decisions.
```

**GitHub flow** is GitHub's own name for this way of working: branch, pull request, merge. The branch is what makes it safe. Your changes reach `main` only when you merge.

### A real example

Pull request #105 is in a private repo, so here's the same path on a public one. Pull request #305 on `finance-agent` went from the branch `themes-T02` into `main`, with `Closes #267` in its description. It merged, and its branch was deleted 2 seconds later. Now look at the Issue it named.

You look:

```
gh issue view 267 --repo SiddharthMuramkar/finance-agent --json state
```

You should see `"state": "CLOSED"`.

At 7 commits and 19 files, #305 is bigger than #105, but it took the same path from branch to merge.

```checkpoint quick-10
What does a bigger pull request change about its path to a merge?
- [x] Nothing. It takes the same path to a merge.
- [ ] It adds a step, so the checks on it run twice.
- [ ] It drops a step, so it skips the pull request.
Why: #305 is bigger than #105, at 7 commits and 19 files, but it took the same path from branch to merge.
```

One thing differs: auto-merge was turned on 3 seconds after it opened. Auto-merge merges a pull request by itself once its required reviews and checks pass. In your loop, you say merge after your Merge check.

### Where it goes wrong

**`gh` isn't found, or asks you to log in.** Install it from the [GitHub CLI manual](https://cli.github.com/manual/). You'll need a GitHub account. Then run `gh auth login` yourself, because it normally opens a browser. Take the default at each question and finish in the browser. It should say you're logged in. Then run `gh issue list` again.

**`gh issue list` says `not a git repository`, or mentions git remotes.** You may be in the wrong folder: `cd` into your project and run it again. Same print? Your project isn't on GitHub yet, and the loop needs a repo there. Ask Claude to create a private one and push your project to it. Then run `gh issue list` again.

**`gh issue list` shows no Issues.** Your project has none open yet. Tell Claude the fix you want, and ask it to open an Issue. It runs `gh issue create`.

**`gh pr view 105` can't find the repo.** That repo is private, so only its owner can run the command. Try the public one: `gh pr view 305 --repo SiddharthMuramkar/finance-agent`. Near the top, you should see `+692 -99`.

**Claude's commands don't match the ones shown.** That's normal. Claude also reads the Issue and makes the change, and it picks its own branch name and files. `origin` is git's name for the copy on GitHub. Claude may add `-u` to `git push`, which links your branch to it. Check the steps, not the spelling.

**No checks show on your pull request.** Your project may have no CI set up yet. Ask Claude to add it.

**Claude stops waiting, late in a long session.** It usually follows the line, but nothing forces it to. Compaction replaces the session's history with a summary. It runs on its own in a long session, or when you type `/compact`, a slash command. It can lose an instruction given only in conversation. Paste the line again.

```checkpoint quick-11
Claude stops waiting late in a long session. What do you do?
- [x] Paste the line again, because compaction can lose it.
- [ ] Do nothing, because compaction keeps every instruction.
- [ ] Run `/compact` again, because it can bring the line back.
Why: Compaction replaces the session's history with a summary, and can lose an instruction given only in conversation. So paste the line again.
```

**A session waits with nobody there.** The line got saved somewhere every session reads, so a session you aren't watching stops and waits, with nobody there to answer. It may be in `CLAUDE.md`, the file Claude reads at the start of every session. Or Claude saved it in auto memory, notes it writes itself. Run `/memory` to see both, tell Claude to take it out, and go back to pasting it.

### Read more

- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs, read 2026-11-05
- [GitHub CLI manual](https://cli.github.com/manual/), GitHub, read 2026-11-05
- [About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories), GitHub Docs, read 2026-11-05
- [About issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues), GitHub Docs, read 2026-11-05
- [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests), GitHub Docs, read 2026-10-29
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [How Claude remembers your project](https://code.claude.com/docs/en/memory), Claude Code docs, read 2026-10-29

## Remember

```flashcards
Q: In one change, what stays yours, not Claude's?
A: What to build, what goes in a Spec and the Merge check. Claude runs the commands that change things.

Q: What does a look-only command, such as `gh pr view`, change?
A: Nothing. It only displays information. You run it yourself, to confirm what happened.

Q: What makes GitHub close an Issue when a pull request merges into `main`?
A: The pull request says `Closes` and the Issue's number, such as `Closes #99`.

Q: How often do you paste the line for Claude, and when can you drop it?
A: Once per session, because each session starts fresh. Drop it once you're confident.

Q: Why isn't the line for Claude saved in `CLAUDE.md`?
A: Claude reads that file at the start of every session, so a session you aren't watching would stop and wait, with nobody there to answer.
```

## Final test

```final-test one-change-start-to-finish-whose-merge
Claude tells you every check on your pull request has passed, and asks whether to merge. What do you do?
- [x] Run your Merge check first, then say merge if you're happy with what you saw.
- [ ] Say merge straight away, because the checks are the last step before a merge.
- [ ] Say nothing and wait, because Claude merges on its own once the checks have passed.
- [ ] Merge it in your second terminal, because only you may run the merge command.
Why: The checks are CI's part of the loop. Then you run your Merge check and say merge, and Claude merges it. Claude runs the command, and the decision stays yours.
```

```final-test one-change-start-to-finish-before-merge
Claude has made commits on a branch, pushed them and opened a pull request. Nobody has merged it. How much of that work is in `main`?
- [x] None of it. The work reaches `main` only when the pull request merges.
- [ ] All of it, because a push copies your commits straight into `main` on GitHub.
- [ ] All of it, because opening a pull request copies your branch into `main`.
- [ ] The commits made so far, and any later commits wait until the pull request merges.
Why: A branch is a separate line of work. Pushing copies its commits to GitHub, still on that branch, and they reach `main` only when you merge.
```

```final-test one-change-start-to-finish-new-session
You pasted the line for Claude in yesterday's session. You start a new session today and still want Claude to wait before each step. What do you do?
- [x] Paste the line again, because each new session starts fresh.
- [ ] Nothing, because Claude carries the line over from yesterday's session.
- [ ] Paste it before every step, because Claude forgets it after each reply.
- [ ] Ask Claude to reopen yesterday's session, because the line only works in there.
Why: Each session starts fresh, so the line lasts for one session.
```

```final-test one-change-start-to-finish-deeper-long
Claude waited before each step all morning. After `/compact` in a long session, it starts running steps without stopping. What's the likely cause, and the fix?
- [x] The line was given only in conversation, so `/compact` lost it. Paste the line again.
- [ ] The line only lasts an hour, so Claude has dropped it. Start a new session and carry on.
- [ ] Your Merge check has passed, so Claude no longer needs to wait. Let it carry on.
- [ ] The line was saved in `CLAUDE.md`, so `/compact` deleted that file. Write the file again.
Why: An instruction given only in conversation can disappear after compaction. That's the price of pasting the line per session, and pasting it again fixes it.
```

```sources
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories), GitHub Docs
- [Git - gitglossary Documentation](https://git-scm.com/docs/gitglossary), The Git project
- [About issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues), GitHub Docs
- [Branches](https://docs.github.com/en/pull-requests/reference/branches)
- [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests)
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks), GitHub Docs
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub CLI manual
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [Git - git-pull Documentation](https://git-scm.com/docs/git-pull), The Git project
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [docs: record read-aloud decisions and the public site](https://github.com/SiddharthMuramkar/skills/pull/105), SiddharthMuramkar, 2026-11-04
- [GitHub CLI manual](https://cli.github.com/manual/), GitHub CLI manual
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [Git - git-switch Documentation](https://git-scm.com/docs/git-switch), The Git project
- [Git - Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository), Scott Chacon and Ben Straub (Pro Git)
- [Git - git-push Documentation](https://git-scm.com/docs/git-push), The Git project
- [gh pr create](https://cli.github.com/manual/gh_pr_create), GitHub CLI manual
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [gh issue list](https://cli.github.com/manual/gh_issue_list), GitHub CLI manual
- [The Rate move Widget clips its end labels](https://github.com/SiddharthMuramkar/finance-agent/issues/318), SiddharthMuramkar, 2026-11-04
- [The site follows the Mac by default, and the header menu picks any of the four Themes](https://github.com/SiddharthMuramkar/finance-agent/pull/305), SiddharthMuramkar, 2026-11-04
- [gh auth login](https://cli.github.com/manual/gh_auth_login), GitHub CLI manual
- [gh issue create](https://cli.github.com/manual/gh_issue_create), GitHub CLI manual
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request), GitHub Docs
- [cli/pkg/cmd/factory/remote_resolver.go at v2.97.0](https://github.com/cli/cli/blob/v2.97.0/pkg/cmd/factory/remote_resolver.go), The GitHub CLI project
- [cli/pkg/cmd/auth/shared/login_flow.go at v2.97.0](https://github.com/cli/cli/blob/v2.97.0/pkg/cmd/auth/shared/login_flow.go), The GitHub CLI project
```
