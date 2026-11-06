---
title: One change, start to finish
slug: one-change-start-to-finish
summary: Walk one change round the whole GitHub loop on a small recipe site: Issue, branch, commits, push, pull request, checks, review, merge and clean-up.
---

Say you've met each piece on its own: an Issue, a branch, a commit, a push, a pull request. Now you want to make one real change to `recipes`, your small recipe website, and you're not sure which step comes when. Or a coding agent did every step at once, commands scrolled past, and you couldn't say what happened. This lesson walks one change all the way round, so each piece has its place.

```goals
- You'll be able to take one change round the whole loop: Issue, branch, commits, push, pull request, checks, review, merge and clean-up.
- You'll be able to do each step yourself, in the terminal or on github.com, or ask an agent for it and check its work.
- You'll be able to say why every pull request needs its own branch, and why a merged branch is finished.
```

## The loop

Every change to a project on GitHub takes the same path. It doesn't matter whether it's one line or a hundred files, or whether you or an agent types the commands. GitHub calls this way of working GitHub flow.

**Every change goes round the same loop, and whoever types the commands, you decide what gets built and what goes into `main`.**

Here's the loop. Each step links to the lesson that teaches it in full.

1. Write the change down as an Issue ([Issues: keeping track of work](/learn/issues-and-keeping-track)).
2. Make a branch from an up-to-date `main` ([Branches and worktrees](/learn/branches-and-worktrees)).
3. Commit the change on the branch ([Commits and diffs](/learn/commits-and-diffs)).
4. Push the branch to GitHub ([Push, pull and remotes](/learn/push-pull-and-remotes)).
5. Open a pull request that closes the Issue ([Opening a pull request](/learn/pull-requests)).
6. Let the checks run ([What CI/CD is](/learn/what-ci-cd-is)).
7. Review the pull request ([Checking a pull request before you merge](/learn/checking-a-pr)).
8. Merge it, then clean up ([Merging and cleaning up](/learn/merging-and-cleaning-up)).

```diagram
type: chain
caption: "Every change goes round the same loop"
steps:
  - "Write the change down as an Issue"
  - "Make a branch from an up-to-date `main`"
  - "Commit the change on the branch"
  - "Push the branch to GitHub"
  - "Open a pull request that closes the Issue"
  - "Let the checks run"
  - "Review the pull request"
  - "Merge it, then clean up"
```

Steps 3 to 7 can go round more than once. A red check, or a reviewer asking for a change, sends you back to step 3. You commit the fix on the same branch and push it, and the pull request updates itself.

```checkpoint quick-1
A reviewer asks for one more change to your open pull request. Where does that change go?
- [x] On the same branch: commit it and push, and the pull request updates.
- [ ] On a new branch from `main`, in a second pull request for the reviewer.
- [ ] Straight on `main`, because the pull request has already been reviewed.
Why: While a pull request is open, a push to its branch updates it. A red check or a reviewer's request sends you back to step 3 on the same branch.
```

## Why every pull request needs a branch

A pull request holds no work of its own. It's a request: please merge this branch into that one. The branch with the new work is the **head branch**. The branch it should land on, usually `main`, is the **base branch**. With no head branch, there's nothing to ask about.

So the branch is where the work happens, and the pull request is the review at the end. While the work waits on its branch, `main` stays untouched, and the checks and the review get their turn first. A commit made straight on `main` skips all of them. That's why many teams [forbid it with a rule](/learn/how-teams-do-it).

```checkpoint quick-2
You ask an agent to skip the branch and open a pull request straight away. What must it make first anyway?
- [x] A branch holding the work, because a pull request asks to merge one branch into another.
- [ ] A copy of the whole repo, because a pull request compares two repos side by side.
- [ ] A commit on `main`, because a pull request reviews what's already on `main`.
Why: A pull request asks GitHub to merge a head branch into a base branch. With no branch, there's nothing for the pull request to ask about.
```

Give each change its own branch, and start it fresh. Once a pull request is [squash-merged](/learn/merging-and-cleaning-up), with all its commits combined into one, its branch is finished. The squash put one brand-new commit on `main`, so the branch's own commits never joined `main`'s history. A later pull request from the same branch would carry them all over again. So new work gets a new branch, from the latest `main`.

Not every branch has to become a pull request. A quick experiment can be deleted. Matt Pocock's [prototype](/learn/prototype) Skill keeps its throwaway code on a branch of its own, out of `main`. Only the decision the prototype led to reaches `main`.

```checkpoint quick-3
Your pull request from `7-cooking-time` was squash-merged yesterday. Now you want cooking times on the print view too. Where do you start?
- [x] A new branch from the latest `main`, because the old branch is finished.
- [ ] More commits on `7-cooking-time`, because it already has the cooking-time work.
- [ ] A rebase of `7-cooking-time`, so the old branch can carry the new work.
Why: A squash merge puts one new commit on `main`, so the old branch's commits never join `main`'s history. A new pull request from it would carry them again. New work, new branch.
```

## The loop by hand, on `recipes`

Say the cards on your `recipes` site don't show how long a recipe takes. Here's the whole loop by hand. Each step shows the terminal way, with git and `gh` (GitHub's command-line tool), and the github.com way.

### Write it down as an Issue

On github.com, open your repo and click the **Issues** tab, then **New issue**. Type a title, "Show the cooking time on each recipe card", and a description: what's wrong, and what done looks like. Click **Submit new issue**. GitHub gives it a number. Say it's #7.

In the terminal, one command does the same:

```sh
gh issue create --title "Show the cooking time on each recipe card" --body "Each card shows the total time, for example 25 min."
```

The Issue keeps the change, and what done looks like, in one place. That place is outside your head and outside any one agent session. Later, the pull request will close it.

```checkpoint quick-4
Why write the change down as an Issue before any code?
- [x] It keeps the change and what done looks like in one place, and the pull request can close it.
- [ ] It makes the branch and the first commit for you, so the work can start straight away.
- [ ] It runs the checks on the idea first, so a bad change never reaches a pull request.
Why: The Issue keeps the change and what done looks like outside your head and outside any one session. When the pull request merges, it can close the Issue.
```

### Make a branch

```sh
git switch main
git pull
git switch -c 7-cooking-time
```

`git pull` comes first, so the branch starts from the latest `main`, not from whatever your computer had last week. The name follows a common habit: the Issue's number, then a few words, `<issue-number>-<short-slug>`.

On github.com, the Issue's sidebar has **Create a branch**, under Development. GitHub suggests a name made from the Issue's number and title. Change it to `7-cooking-time` in the **Branch name** field, and click **Create branch**. That makes the branch on GitHub, from the default branch. Then run `git fetch` and `git switch 7-cooking-time` to work on it.

```checkpoint quick-5
Why run `git pull` on `main` before `git switch -c 7-cooking-time`?
- [x] So the new branch starts from the latest `main`, not an old copy.
- [ ] So the new branch is pushed to GitHub as soon as it's made.
- [ ] So GitHub links the new branch to Issue #7 by its number.
Why: A new branch starts from whatever `main` your computer has. `git pull` first brings that copy up to date.
```

### Commit and push

Edit the files. Then look before you commit:

```sh
git status
git diff
git add src/recipe-card.js tests/recipe-card.test.js
git commit -m "Show cooking time on recipe cards"
git push -u origin 7-cooking-time
```

`git status` lists what changed, and `git diff` shows the lines. Name the files in `git add`, so nothing extra slips into the commit. Only what you stage goes into the commit, and only commits get pushed, so an edit you didn't stage reaches neither GitHub nor the checks. Until you push, your new commits exist only on your computer. `-u` links your branch to its copy on GitHub, so later you can type a plain `git push` or `git pull`.

```checkpoint quick-6
What does `-u` in `git push -u origin 7-cooking-time` do?
- [x] It links your branch to its copy on GitHub, so a plain `git push` works later.
- [ ] It updates `main` on GitHub with the branch's commits as it pushes them.
- [ ] It undoes the push if any check fails on the branch's copy on GitHub.
Why: `-u` sets up the link between your branch and its copy on GitHub. After that, `git push` and `git pull` need no names.
```

### Open the pull request

On github.com, after the push, your repo's page shows a yellow banner with **Compare & pull request**. Click it. Check the two branch menus: base `main`, compare `7-cooking-time`. Write a title that says what changes. In the description, write `Closes #7`. Then click **Create pull request**.

In the terminal:

```sh
gh pr create --title "Show cooking time on recipe cards" --body "Closes #7"
```

`Closes #7` links the pull request to the Issue. When the pull request merges into `main`, GitHub closes #7 by itself. Say this pull request is #8.

```checkpoint quick-7
Which line in pull request #8's description makes GitHub close Issue #7 when #8 merges into `main`?
- [x] `Closes #7`
- [ ] `See #7`
- [ ] `Issue 7`
Why: A closing word such as `Closes`, then the Issue's number, links the two. The Issue closes when the pull request merges into the default branch, `main`.
```

### Let the checks run, then review

If your repo has CI, automation that builds and tests every pull request, its checks start by themselves. You can watch them from the terminal:

```sh
gh pr checks --watch
```

On github.com, they show in the merge box at the bottom of the pull request. A red check sends you back a step: fix, commit, push, and the checks run again.

Then review it. Green proves only what the checks test, so run your [Merge check](/learn/checking-a-pr). Read the description, the **Files changed** tab and the checks, and try the change if you can. On a shared repo, ask a teammate too. Use **Reviewers** in the pull request's sidebar, or run `gh pr edit 8 --add-reviewer <username>`.

```checkpoint quick-8
Every check on pull request #8 is green. What's left before you merge?
- [x] Your Merge check, because green proves only what the checks test.
- [ ] Nothing, because green checks prove that the change works.
- [ ] A second round of checks, because one green round can be luck.
Why: The checks test only what someone wrote tests for. Your Merge check reads the description, the changed files and the checks, and tries the change if it can.
```

### Merge, then clean up

On github.com, in the merge box, choose **Squash and merge** from the merge button's menu, and click **Squash and merge**. Then click **Confirm squash and merge**, and then **Delete branch**.

In the terminal, one command merges and deletes the branch, on GitHub and on your computer:

```sh
gh pr merge 8 --squash --delete-branch
```

Then check that the Issue closed, and bring your own `main` up to date:

```sh
gh issue view 7 --json state
git switch main
git pull
```

You should see `"state": "CLOSED"`. If you merged with `gh` from your branch, it has already switched you to `main` and pulled, so `git pull` only says `Already up to date.`

If you merged on github.com, nothing has changed on your computer yet, so `git pull` brings the merged work into your `main`. The branch is still on your computer too: `git branch -d 7-cooking-time` deletes it. After a squash merge, git may refuse with "not fully merged". [Merging and cleaning up](/learn/merging-and-cleaning-up) shows how to check nothing is lost first.

```checkpoint quick-9
You merged pull request #8 on github.com. Why do you still run `git pull` on your `main`?
- [x] Merging on GitHub doesn't change your computer's copy, so the pull brings the work in.
- [ ] The pull finishes the merge, which GitHub leaves half done until you run it.
- [ ] The pull closes Issue #7, which GitHub leaves open until your copy catches up.
Why: The merge happened on GitHub. Your computer's `main` only gets the merged work when you pull it.
```

## The same loop with an agent

A coding agent, such as Claude Code, can type every command above. Your job moves from typing to deciding and checking. Here's the same change, said to an agent:

| You say | The agent runs | You check |
|---|---|---|
| "Start Issue #7 on a new branch from an up-to-date `main`." | `git switch main`, `git pull`, `git switch -c 7-cooking-time` | `git status` starts `On branch 7-cooking-time` |
| "Make the change. Show me the diff, then commit and push." | edits, then `git add`, `git commit`, `git push -u origin 7-cooking-time` | `git status` says the working tree is clean, and `git log --oneline main..HEAD` lists its commits |
| "Open a pull request into `main` that closes #7. Don't merge." | `gh pr create --title "…" --body "Closes #7"` | `gh pr view` shows the base, the title and `Closes #7` |
| After your Merge check: "Squash-merge it and delete the branch." | `gh pr merge --squash --delete-branch` | `gh issue view 7 --json state` says `CLOSED` |

Every command in the last column is look-only: it shows you something and changes nothing. Run those yourself, in a second terminal. Then you see the evidence, not the agent's summary of it.

The agent's commands won't match these letter for letter. It picks its own branch name and files, and it may add flags. Check the steps, not the spelling.

```checkpoint quick-10
The agent says it has committed and pushed. Why do you run `git status` and `git log` yourself?
- [x] They change nothing, and they show you the evidence instead of the agent's summary.
- [ ] They finish the push, which the agent leaves waiting until you run them.
- [ ] They make the agent stop, so it can't run anything else until you approve.
Why: A look-only command only shows you something. Run it yourself, and you see what really happened.
```

To follow along at first, paste this line at the start of each session:

> Before each step, tell me what you're about to do and why, and wait for me.

Each session starts fresh, so paste it every time, and drop it once you're confident. Don't save it in `CLAUDE.md`, the file Claude Code reads at the start of every session. A session you aren't watching would stop and wait for an answer that never comes.

What stays yours, whoever types: what to build, what goes into `main`, and the word "merge". The team behind Claude Code gives the reason in one line: "A person answers for every change that ships, whoever typed it."

```checkpoint quick-11
Why not save the "wait before each step" line in `CLAUDE.md`?
- [x] Every session reads that file, so a session nobody is watching would stop and wait.
- [ ] Claude Code ignores instructions in `CLAUDE.md` once the session has started.
- [ ] The line works only when you paste it, because files can't hold instructions.
Why: Claude Code reads `CLAUDE.md` at the start of every session. A session you aren't watching would then wait for an answer nobody gives.
```

## Try it

````try
You need git, with your name and email set, and `gh`, logged in with `gh auth login`. [What Git and GitHub are](/learn/what-git-and-github-are) sets up both. You'll make a public practice repo, take one change round the loop, then delete the repo.

1. Make the practice repo and go into it:

```sh
gh repo create loop-practice --public --add-readme --clone
cd loop-practice
```

2. Write the change down as an Issue. `gh` prints its address, ending in `/issues/1`:

```sh
gh issue create --title "Add a first recipe" --body "Add pancakes.md with one line."
```

3. Make a branch, commit the change, and push it:

```sh
git switch -c 1-first-recipe
echo "Serves 4. Ready in 20 minutes." > pancakes.md
git add pancakes.md
git commit -m "Add a first recipe"
git push -u origin 1-first-recipe
```

4. Open the pull request. `gh` prints its address, ending in `/pull/2`:

```sh
gh pr create --title "Add a first recipe" --body "Closes #1"
```

5. Read it, as your Merge check: `gh pr view 2`. You should see `wants to merge 1 commit into main from 1-first-recipe`, `+1 -0` for the one line you added, and `Closes #1`. Then `gh pr diff 2 --name-only` lists the one changed file, `pancakes.md`. This repo has no CI, so there are no checks to wait for.
6. Merge it, and check the Issue closed:

```sh
gh pr merge 2 --squash --delete-branch
gh issue view 1 --json state
```

7. You should see `"state": "CLOSED"`. Then run `git switch main` and `git pull`: `gh` already did both, so git says `Already on 'main'` and `Already up to date.` `cat pancakes.md` shows the recipe line.
8. Delete the practice repo: on github.com, open its **Settings**, scroll to the bottom, and click **Delete this repository**.

To practise with an agent, ask it for steps 2 to 4, one at a time. Check each with the look-only commands in the table above.
````

## Going deeper

### Why it exists

When an agent can run every step, it's easy to stop following along. Claude writes about 90 percent of the code for Claude Code. Its team still keeps people for some jobs, among them deciding what to build and checking the proof that a change works, such as test output. So the loop gives the agent the commands and leaves you the decisions.

The branch is what makes the loop safe. Your changes reach `main` only when you merge. Until then, a half-done or wrong change can sit on its branch, get fixed, or get thrown away, and `main` never sees it.

A bigger change takes the same path: more commits, more files, the same steps. If a change grows too big to review well, split it into several Issues, each with its own loop. [How teams protect main](/learn/how-teams-do-it) shows why small pull requests get better reviews.

Some repos turn on auto-merge, which merges a pull request by itself once its required reviews and checks pass. On a repo that requires no review, it can merge before you've run your Merge check. So turn it on only for a change you've already read.

```checkpoint quick-13
Claude writes most of Claude Code's code. Which jobs does its team still keep for people?
- [x] Deciding what to build, and checking the proof that a change works.
- [ ] Typing the git commands, and writing each commit message by hand.
- [ ] Running the checks, and opening every pull request themselves.
Why: The team keeps people for deciding what to build and for checking proof, such as test output. The agent can do the typing.
```

### Where it goes wrong

**`gh` isn't found, or asks you to log in.** Install it from the [GitHub CLI manual](https://cli.github.com/manual/). Then run `gh auth login` yourself. It usually opens your browser: take the default at each question and finish there.

**`gh` says `not a git repository`.** You're in the wrong folder, so `cd` into your project. If it still fails, the folder isn't a Git repository yet: [What Git and GitHub are](/learn/what-git-and-github-are) shows how to make one, with `git init` and a first commit.

**`gh` says `no git remotes found`.** Your repo isn't on GitHub yet. [Push, pull and remotes](/learn/push-pull-and-remotes) shows how to put it there.

**The pull request shows no checks.** Your repo has no CI yet. [What CI/CD is](/learn/what-ci-cd-is) explains it, and an agent can set it up for you.

**The pull request lists commits you didn't make.** The branch started from an old branch instead of the latest `main`, perhaps one that was already squash-merged. Ask the agent to put only your commits on a fresh branch from the latest `main`. Check with `git log --oneline origin/main..HEAD`: it should list only your own commits.

**The Issue stayed open after the merge.** The pull request merged into some other branch, or its description had no `Closes #7`. `gh pr view 8` shows both. If the work is done, close the Issue by hand.

**The agent stops waiting before each step, late in a long session.** Compaction replaces a long conversation with a summary, and it can lose an instruction you gave only in conversation. It runs by itself in a long session, or when you type `/compact`. Paste the line again.

**A session sits waiting with nobody there.** The line got saved somewhere every session reads, such as `CLAUDE.md`, or the notes Claude Code keeps itself. Run `/memory` to see both, and take the line out.

```checkpoint quick-12
The agent waited before each step all morning. After `/compact`, it starts running steps without stopping. What do you do?
- [x] Paste the line again, because compaction can lose an instruction given only in conversation.
- [ ] Nothing, because compaction keeps every instruction from earlier in the session.
- [ ] Start a new session, because the line works only in the first hour of a session.
Why: Compaction replaces the conversation with a summary, and an instruction given only in conversation can vanish with it. Pasting the line again brings it back.
```

## Remember

```flashcards
Q: What are the steps of the loop?
A: Issue, branch from an up-to-date `main`, commit, push, pull request that closes the Issue, checks, review, merge, clean up.

Q: Why does every pull request need a branch?
A: A pull request asks to merge a head branch into a base branch. The branch holds the work; the pull request is the review at the end.

Q: A check goes red, or a reviewer asks for a change. Where does the fix go?
A: On the same branch. Commit and push, and the open pull request updates and the checks run again.

Q: Why start new work on a new branch after a squash merge?
A: The squash put a brand-new commit on `main`, so the old branch's commits never joined its history. A new pull request from it would carry them again.

Q: What makes GitHub close Issue #7 when a pull request merges?
A: The pull request says `Closes #7`, and it merges into the default branch, `main`.

Q: What stays yours when an agent types the commands?
A: What to build, what goes into `main` (your Merge check), and the word "merge". You check with look-only commands.

Q: How often do you paste the "wait before each step" line?
A: Once per session, because each session starts fresh. Again after compaction. Never save it in `CLAUDE.md`.
```

## Final test

```final-test final-loop-order
Which order is right for one change?
- [x] Issue, branch, commit, push, pull request, checks, review, merge.
- [ ] Branch, commit, merge, push, Issue, pull request, checks, review.
- [ ] Issue, pull request, branch, commit, merge, push, checks, review.
- [ ] Commit, push, Issue, branch, review, merge, pull request, checks.
Why: The Issue says what to do. The branch holds the work, commits record it, and a push puts it on GitHub. The pull request asks to merge it, the checks and the review come next, and the merge comes last.
```

```final-test final-why-branch
Someone asks why you can't open a pull request without a branch. What's the answer?
- [x] A pull request asks to merge a head branch into a base branch, so with no branch there's nothing to ask.
- [ ] GitHub charges for pull requests without a branch, so teams avoid opening them.
- [ ] A pull request without a branch skips the checks, so GitHub hides the button.
- [ ] Git deletes any pull request without a branch as soon as it's merged.
Why: The branch holds the work, and the pull request is the request to land it. No head branch, no request.
```

```final-test final-before-merge
The agent has made commits on a branch, pushed them and opened a pull request. Nobody has merged it. How much of that work is in `main`?
- [x] None of it. The work reaches `main` only when the pull request merges.
- [ ] All of it, because a push copies your commits straight into `main` on GitHub.
- [ ] All of it, because opening a pull request copies the branch into `main`.
- [ ] The commits made so far, while later commits wait for the merge.
Why: Pushing copies the branch's commits to GitHub, still on that branch. They reach `main` only when you merge.
```

```final-test final-whose-merge
The agent tells you every check on your pull request has passed, and asks whether to merge. What do you do?
- [x] Run your Merge check first, then say merge if you're happy with what you saw.
- [ ] Say merge straight away, because the checks are the last step before a merge.
- [ ] Say nothing and wait, because the agent merges by itself once the checks pass.
- [ ] Close the pull request, because only you may merge, so the agent shouldn't ask.
Why: The checks are CI's part of the loop. Then you run your Merge check and say merge. The agent can type the command, but the decision stays yours.
```

```final-test final-old-branch
You're about to start Issue #9. `git status` says `On branch 7-cooking-time`, and that branch's pull request was squash-merged last week. What do you do?
- [x] Switch to `main`, pull, and make a new branch for #9.
- [ ] Start #9 here, because the merged pull request will pick up the new commits.
- [ ] Start #9 here, then rebase the branch onto `main` before you push it.
- [ ] Reopen the merged pull request, then add #9's work to it.
Why: A squash-merged branch is finished. A new pull request from it would carry its old commits again, and a merged pull request takes no new work.
```

```final-test final-unstaged-edit
The agent says it has committed and wants to push. `git status` still lists `src/recipe-card.js` under "Changes not staged for commit". What does that mean?
- [x] That edit isn't in the commit, so neither the pull request nor the checks will see it.
- [ ] The push will carry that edit to GitHub, along with the commit.
- [ ] GitHub adds that edit to the pull request when it squash-merges.
- [ ] The checks stage that edit themselves before they run the tests.
Why: Only staged changes go into a commit, and only commits are pushed. Ask the agent to commit the edit, or to say why it shouldn't.
```

```final-test final-issue-open
Pull request #8 merged an hour ago, but Issue #7 is still open. What's the likely cause?
- [x] #8 merged into a branch other than `main`, or its description has no `Closes #7`.
- [ ] GitHub closes Issues once a day, so #7 will close by itself overnight.
- [ ] Issues close only when the merged branch is deleted from your computer too.
- [ ] Issues close only after someone runs `git pull` on `main` on their computer.
Why: GitHub closes the Issue when a pull request that says `Closes #7` merges into the default branch. `gh pr view 8` shows both the base branch and the description.
```

```final-test final-new-session
You pasted the "wait before each step" line in yesterday's session. You start a new session today and still want the agent to wait. What do you do?
- [x] Paste the line again, because each new session starts fresh.
- [ ] Nothing, because the agent carries the line over from yesterday's session.
- [ ] Paste it before every step, because the agent forgets it after each reply.
- [ ] Save it in `CLAUDE.md`, so every session from now on waits before each step.
Why: Each session starts fresh, so the line lasts for one session. Saving it in `CLAUDE.md` would make sessions nobody is watching stop and wait.
```

```sources
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue), GitHub Docs
- [Creating a branch to work on an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-a-branch-for-an-issue), GitHub Docs
- [Creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request), GitHub Docs
- [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests), GitHub Docs
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks), GitHub Docs
- [Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges), GitHub Docs
- [GitHub CLI manual](https://cli.github.com/manual/), GitHub CLI
- [gh issue create](https://cli.github.com/manual/gh_issue_create), GitHub CLI manual
- [gh pr create](https://cli.github.com/manual/gh_pr_create), GitHub CLI manual
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub CLI manual
- [gh pr edit](https://cli.github.com/manual/gh_pr_edit), GitHub CLI manual
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub CLI manual
- [gh issue view](https://cli.github.com/manual/gh_issue_view), GitHub CLI manual
- [gh auth login](https://cli.github.com/manual/gh_auth_login), GitHub CLI manual
- [git switch](https://git-scm.com/docs/git-switch), The Git project
- [git pull](https://git-scm.com/docs/git-pull), The Git project
- [git push](https://git-scm.com/docs/git-push), The Git project
- [Git Basics: Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository), Scott Chacon and Ben Straub (Pro Git)
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [How Claude remembers your project](https://code.claude.com/docs/en/memory), Claude Code docs
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
```
