---
title: Opening a pull request
slug: pull-requests
summary: What a pull request is, when to open one or a draft, how to open it on GitHub or with gh, what to write in it, and how to read its page.
---

Say you've fixed the search bug in your recipe site on its own branch, and pushed it. Now the fix needs to reach `main`. You could merge it in yourself, but then nobody looks at the change before it lands. When a coding agent wrote the change, that look is what keeps your site safe.

```goals
- Say what a pull request is: a head branch, a base branch, and a page on GitHub.
- Decide when to open one, how big it should be, and when to open a draft instead.
- Open one on github.com or with `gh pr create`.
- Write a title and description that say what changed, why, how you know it works, and which Issue it closes.
- Find your way around a pull request's page: its tabs, checks, reviews and merge box.
- Ask a coding agent to open a pull request, and check what it opened.
```

## What a pull request is

**A pull request (PR) is a proposal, kept on GitHub, to merge the commits on one branch into another.** It's where a change is discussed and reviewed before it lands. Nothing reaches the other branch until the PR merges.

A PR always compares two [branches](/learn/branches-and-worktrees):

- the **head branch**, which holds your work, such as `12-search-capitals`;
- the **base branch**, where the work should land, usually `main`.

```diagram
type: git
caption: "A pull request takes the head branch's work into the base branch."
branches:
  - name: "base: main"
    commits: 2
  - name: "head: 12-search-capitals"
    from: { branch: "base: main", after: 1 }
    commits: 2
    merge: { into: "base: main", label: "when the pull request merges" }
```

`main` is usually the repo's **default branch**: the one GitHub shows first, and the base for new PRs.

A PR shows what its head branch adds since it split off from the base. GitHub compares from the commit where the head branch began, called the **merge base**. So work that lands on `main` in the meantime doesn't appear in your PR's changes.

```checkpoint quick-2
Two other PRs landed on `main` after your branch split off. Do their changes show up among your PR's changes?
- [x] No. A PR shows what its own branch adds since it split off.
- [ ] Yes. A PR shows every difference between the two branches.
- [ ] Only once your PR has merged into `main`.
Why: GitHub compares from the merge base, the commit where your branch began. Work that landed on `main` later isn't part of your PR.
```

A PR is a GitHub thing, not a Git thing. Git stores the branches and their [commits](/learn/commits-and-diffs). The PR's title, description, comments and reviews live on GitHub. After the merge the page stays, so you can still read why a change was made.

For example, `gh pr view 14`, run with GitHub's command-line tool, starts like this:

```text
Make search ignore capital letters your-name/recipes#14
Open • your-name wants to merge 1 commit into main from 12-search-capitals • about 1 hour ago
+3 -1 • No checks
```

Here `main` is the base and `12-search-capitals` is the head. `+3 -1` counts the lines added and removed. `No checks` means no automated checks have run on it yet.

```checkpoint quick-1
`gh pr view` says a PR "wants to merge 3 commits into main from add-ingredient-search". Which branch holds the new work?
- [x] `add-ingredient-search`, the head branch.
- [ ] `main`, the base branch.
- [ ] Neither: the work is held inside the PR itself.
Why: The head branch holds the work, and the base branch is where it should land. The PR is the proposal to merge one into the other.
```

## When to open one

**Open a pull request when its branch holds one whole change, finished and ready to check.**

The right size is one self-contained change, so aim for one small Issue per PR. Google's engineering guide gives a rule of thumb. About 100 changed lines is usually reasonable, and 1,000 is usually too large. So is a 200-line change spread across 50 files.

Small PRs get reviewed faster and more carefully. They're less likely to hide a bug, and simpler to undo. Google's guide also warns against splitting late: "It can be a lot of work to split up a change after you've already written it." So keep each branch to one change from the start.

```checkpoint quick-3
Your branch fixes the search bug. You're tempted to add a vegetarian filter to the same branch before you open the PR. What's better?
- [x] Open the PR for the fix now, and build the filter on its own branch.
- [ ] Add the filter first, so that one PR gets checked and merged once.
- [ ] Finish both, then open two PRs from that same branch.
Why: A PR should hold one whole change. Two changes in one PR are slower to check, more likely to hide a bug, and harder to undo apart.
```

Not finished, but want the work seen? Open a **draft pull request**. It shows the work, its changes and its checks like any PR, but nobody can merge it. When it's done, mark it ready: click **Ready for review** in the merge box (the panel at the bottom of the PR's page that says whether it can merge), or run `gh pr ready`.

Drafts suit agents. An agent can open a draft as soon as it has pushed. Its checks start, and you can follow along, while merging stays locked until you decide.

```checkpoint quick-4
Your agent's work is half done. You want its PR and checks on GitHub now, with nobody able to merge it yet. What do you ask for?
- [x] A draft pull request, to be marked ready for review later.
- [ ] A normal pull request, with a note asking people to wait.
- [ ] Nothing yet, since a PR can only be opened once the work is done.
Why: A draft shows the work and runs its checks, but it can't be merged until someone marks it ready for review.
```

## Opening one

On github.com, the branch must already be pushed ([Push, pull and remotes](/learn/push-pull-and-remotes) shows how). Either way, it needs at least one commit that `main` doesn't have.

On github.com:

1. Open the repo. After a recent push, a yellow banner offers **Compare & pull request** for your branch: click it. Otherwise, open the **Pull requests** tab and click **New pull request**.
2. Check the two branch menus. **base** is where the work lands, usually `main`. **compare** is your branch.
3. Type a title and a description.
4. Click **Create pull request**. For a draft instead, open the menu on that button, choose **Create draft pull request**, then click **Draft pull request**.

With `gh`, from your branch:

```sh
gh pr create --title "Make search ignore capital letters" --body "Closes #12"
```

Add `--draft` for a draft. Without `--base`, the PR goes into the default branch. If your branch isn't pushed yet, `gh` offers to push it. When it's done, it prints the new PR's web address.

```checkpoint quick-5
You run `gh pr create` with no `--base`. Where will the new PR want to merge?
- [x] Into the repo's default branch, usually `main`.
- [ ] Into whichever branch yours was created from.
- [ ] Nowhere, until you pick a base on github.com.
Why: Without `--base`, `gh pr create` uses the repo's default branch as the base.
```

## What to write in it

The title says what the change does: "Make search ignore capital letters". It often becomes the commit's title on `main` too, as [Merging and cleaning up](/learn/merging-and-cleaning-up) shows. So write a line someone could understand a year from now.

The description, also called the body, answers four questions:

- What changed, in a sentence or a small sketch.
- Why: usually the Issue, linked with `Closes #12` ([Issues: keeping track of work](/learn/issues-and-keeping-track) explains the keyword).
- How you know it works: real evidence, such as test output or a screenshot, before and after.
- What could break, and how easy it would be to undo.

People who review agents' PRs ask for much the same. One wrote: "all I need to know is what changed, how it was verified, what could break, and whether it's safe to merge."

For example:

```markdown
Search now ignores capital letters.

Closes #12

Before: searching "Soup" showed no recipes.
After: "Soup", "SOUP" and "soup" all show Tomato soup (screenshot below).
Tests: before the fix, the new test for "SOUP" failed (`fail 1`). Now `npm test` prints `pass 6` and `fail 0`.

Risk: small. Only the search box changes, and a revert undoes it.
```

A description like "Fixed stuff" leaves the reviewer to work everything out from the changes. "Tests pass", with nothing shown, is a claim, not evidence.

```checkpoint quick-6
Your agent's PR description says only "Tests pass." What do you ask for?
- [x] The test output itself, before and after, so you can see what ran.
- [ ] A longer summary that describes each changed file in words.
- [ ] Nothing more, since a passing test needs no further evidence.
Why: "Tests pass" with nothing shown is a claim. Evidence is real output from a run, or a screenshot for a change you can see.
```

Templates help. A repo can keep a PR template, such as `.github/pull_request_template.md`, that every new description starts from.

Agents can follow a template too. A **Skill** is a named set of instructions an agent loads for one job. Matt Pocock's [pr](/learn/pr) Skill gives agents a description template of its own: Summary, Evidence, and Merge Danger, which says how risky merging is.

## Reading the PR page

A PR's page has four main tabs:

| Tab | What it shows | What you look for |
|---|---|---|
| **Conversation** | The description, then a timeline of commits, comments and reviews. The merge box sits at the bottom. | Does the description match the Issue? |
| **Commits** | The branch's commits, one at a time. | Does the story make sense? |
| **Checks** | Automated tests, builds and other checks run on the change. | Did they run, and did they pass? |
| **Files changed** | The **diff**: every line the PR adds or removes. | Does it change what the description says, and nothing more? |

Some repos show a fifth tab, **Findings**, with results from automated code scanning. [Commits and diffs](/learn/commits-and-diffs) shows how to read a diff.

In **Files changed**, read one file at a time. When you've read a file, tick **Viewed** and it folds away. If the file changes again later, GitHub clears the tick, so you reread only what moved. To comment on a line, hover over it and click the `+` beside it.

```checkpoint quick-7
You ticked Viewed on `search.js` in Files changed. Then your agent pushed a fix to that file. What happens to the tick?
- [x] GitHub clears it, so you know to read the file again.
- [ ] It stays, and the file stays folded away.
- [ ] GitHub submits your review, because the file changed.
Why: If a file changes after you mark it viewed, GitHub unmarks it. So after a fix, you reread only the files that moved.
```

A **check** is one automated job's result on the PR's latest commit. It shows a yellow dot while it runs, then a green tick or a red cross. Checks usually come from **CI** (continuous integration), which runs your tests on every push. [What CI/CD is](/learn/what-ci-cd-is) sets it up.

The **merge box** at the bottom of the Conversation tab says whether the PR can merge right now. If it can't, it says what's in the way, such as a failing check or a **merge conflict**. A merge conflict means two changes touch the same lines, and Git can't combine them by itself. [Undo and merge conflicts](/learn/undo-and-conflicts) shows how to resolve one.

From the terminal, three commands cover the page:

```sh
gh pr view 14     # title, state and description (--web opens the page)
gh pr diff 14     # the diff (--name-only lists only the file names)
gh pr checks 14   # each check and its result
```

## Reviews, and changing a PR

A **review** is someone's verdict on a PR. In Files changed, click **Review changes**, write a summary, and pick one:

- Comment: feedback, with no verdict.
- Approve: ready to merge.
- Request changes: something must be fixed first.

Comments you add on lines while reviewing stay pending, seen only by you, until you submit the review.

Two rules matter when you work alone or with agents. You can't approve your own PR. And an agent working through your `gh` login opens PRs as you, so its PRs count as yours.

```checkpoint quick-8
Your agent opened PR #14 using your `gh` login. You try to approve it. What happens?
- [x] GitHub won't let you, because authors can't approve their own PRs.
- [ ] It's approved, because you own the repo.
- [ ] It's approved, but only once every check has passed.
Why: Pull request authors cannot approve their own pull requests. The agent opened #14 as you, so you're its author.
```

Request changes blocks nothing by itself. It stops a merge only when a rule on the branch requires pull requests, which [How teams protect main](/learn/how-teams-do-it) covers. Working alone, you send work back by telling the agent what to fix.

To change a PR, push more commits to the same branch. The PR updates by itself, and its checks run again. You don't open a new PR.

```checkpoint quick-9
A check failed on your agent's PR. Where should the fix go?
- [x] In a new commit pushed to the same branch, which updates the PR.
- [ ] In a new PR from `main`, after closing this one.
- [ ] Straight onto `main`, so the check passes there first.
Why: Pushing to the PR's head branch updates the PR, and its checks run again. There's no need for a new PR.
```

## With a coding agent

An agent can push, open and update PRs through `gh`. Tell it what to open, and what not to do:

> Push this branch and open a draft pull request into `main`. Title it after the change. In the description, put `Closes #12` and the test output as evidence. Don't merge it, and don't turn on auto-merge.

**Auto-merge** is a setting that merges a PR by itself once its required checks and reviews pass, without waiting for you. [Merging and cleaning up](/learn/merging-and-cleaning-up) covers it.

The agent runs something like:

```sh
git push -u origin 12-search-capitals
gh pr create --draft --title "Make search ignore capital letters" --body "..."
```

Then check, from that branch, with `gh pr view`. You should see:

- `Draft`, then `into main from 12-search-capitals`: the right base and head.
- `+N -M` about the size you expected. A small fix shouldn't add hundreds of lines.
- `Closes #12` and real evidence in the description.
- No line starting `Auto-merge:`.

Then confirm the link to the Issue. This should print `12`:

```sh
gh pr view --json closingIssuesReferences --jq '.closingIssuesReferences[].number'
```

Something wrong? Say so, and the agent fixes it:

- Wrong base: "Change the base to `main`." It runs `gh pr edit 14 --base main`.
- Auto-merge on: "Turn off auto-merge." It runs `gh pr merge 14 --disable-auto`.
- Too big: "Split this into smaller PRs, one self-contained change each. Tell me the split before you start."

```checkpoint quick-10
`gh pr view` on your agent's new PR shows `Auto-merge: enabled by your-name, using squash and merge`. You haven't checked anything yet. What do you do?
- [x] Tell the agent to turn it off, so the PR can't merge before you've checked it.
- [ ] Leave it, since auto-merge waits for you to say merge before it acts.
- [ ] Close the PR and open another, since auto-merge can't be turned off.
Why: Auto-merge merges once the repo's required checks and reviews pass, whatever you've looked at. `gh pr merge --disable-auto` turns it off.
```

## Try it

````try
You need the repo and the bug Issue from the first Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track), "file your first Issues". That's your practice repo, such as `recipes`, not the `yoga-studio` practice project. Put your bug's number in place of `BUG` below.

1. Go into that repo's folder:

   ```sh
   cd recipes
   ```

2. Start a branch from an up-to-date `main`:

   ```sh
   git switch main
   git pull
   git switch -c BUG-practice-fix
   ```

3. Add a line to `README.md`, in your editor or with this command:

   ```sh
   echo "Search ignores capital letters now." >> README.md
   ```

4. Commit the change, and push the branch:

   ```sh
   git commit -am "Note the search fix in the README"
   git push -u origin HEAD
   ```

5. Open a draft PR that closes the bug:

   ```sh
   gh pr create --draft --title "Practice fix for search" --body "Closes #BUG"
   ```

   You should see a link ending in the PR's number.

6. Read it back:

   ```sh
   gh pr view
   ```

   You should see `Draft`, then `into main from BUG-practice-fix`, and `Closes #BUG` in the description.

7. Check the link to the Issue:

   ```sh
   gh pr view --json closingIssuesReferences --jq '.closingIssuesReferences[].number'
   ```

   You should see your bug's number.

8. Open the page, and visit each of its four tabs:

   ```sh
   gh pr view --web
   ```

Leave the PR as a draft. The Try it in [Checking a pull request before you merge](/learn/checking-a-pr) picks it up.
````

## Going deeper

### Why the description matters so much

With an agent, writing the code gets fast. Reading it doesn't. Matt Pocock puts it bluntly: "PRs are still the main bottleneck for work that gets to main." The slow part is a person reading the agent's work before it lands.

So a good description saves the reviewer time. It shows the shape of the change before they open the diff, and it says where to spend their attention. That's why Matt's [pr](/learn/pr) Skill exists: it does one job, giving the agent a template for the description. It doesn't push a branch or open the PR. You, or the agent, still do that.

```checkpoint quick-11
An agent has written the code for an Issue. Which part of getting it into `main` is usually the slow part?
- [x] A person reading the work in the PR before it lands.
- [ ] GitHub building and testing each of the agent's commits.
- [ ] Typing the `gh pr create` command that opens the PR.
Why: Agents write code quickly, but someone still has to read it before it reaches `main`. A clear description makes that reading faster.
```

### A real example

Matt Pocock's own public repo shows a description doing its job. In September 2026 he opened PR #1120 on `mattpocock/skills`, to release a new version of his Skills. Three Skills moved out of `in-progress/`, his folder for beta Skills, and into his plugin, a bundle of his Skills you install in one step. He calls that graduating them. The PR removed one Skill, and renamed the glossary file the Skills read, from `CONTEXT.md` to `GLOSSARY.md`. Its body has the three parts of his template.

The Summary sketches the change as a small file tree, with `+` for folders added and `-` for folders removed. The Evidence gives a before and an after: the plugin listed 25 Skills, then 27, with a validation command passing. The Merge Danger part calls the change "two-way for the graduations, one-way-ish for the removal and the glossary rename". Two-way means easy to walk back, and one-way means hard to undo. [Checking a pull request before you merge](/learn/checking-a-pr) explains these doors.

It also warns readers what changes for them. Anyone who used the Skill being removed would find it gone after updating. A reviewer can check each of those claims against the diff, which is the point.

```checkpoint quick-12
A PR's description says one part of the change is "one-way-ish": a Skill is removed, and users lose it when they update. What is that telling a reviewer?
- [x] That part is hard to walk back, so it deserves the slowest read.
- [ ] That part changes only one file, so it can be skipped.
- [ ] That part can merge only by one method, chosen on GitHub.
Why: A one-way door is a change that's hard to undo. Calling it out tells the reviewer where to spend their attention.
```

### Where it goes wrong

**`gh pr create` says there are no commits between `main` and your branch.** Your commit isn't on this branch. `git log --oneline main..HEAD` lists the branch's own commits. If it prints nothing, ask where the commit went.

**`git push` is refused, with a warning about a private email address.** Your commit carries an email that your GitHub account keeps private. Find your `noreply` address, the stand-in address GitHub gives you for commits, on the Emails page of your GitHub settings. Set it for this repo with `git config user.email "YOUR-NOREPLY-ADDRESS"`. Then give the commit that address with `git commit --amend --reset-author --no-edit`, and push again. A plain `--amend` keeps the private address.

**`gh pr view` finds no pull request.** It looks for the current branch's PR, and you may be on another branch. Name the PR instead: `gh pr view 14`.

**The PR goes into a branch other than `main`.** Its `Closes` line will do nothing there. Change the base with `gh pr edit 14 --base main`, or with **Edit** beside the PR's title on github.com.

**The description is huge.** Matt Pocock names the usual cause: "If the body is huge because the diff is huge, the problem is the size of the PR." A template won't fix that, so ask for a split.

```checkpoint quick-13
A PR's description says `Closes #12`, but `gh pr view` says it goes into `search-work`, not `main`. What happens to #12 when it merges?
- [x] Nothing. GitHub ignores the keyword on a PR into any other branch.
- [ ] It closes, because the keyword is in the description.
- [ ] It closes, but only once someone has approved the PR.
Why: Closing keywords work only on a PR into the default branch. Into any other branch they're ignored, and merging has no effect on the Issue.
```

## Remember

```flashcards
Q: What is a pull request?
A: A proposal, kept on GitHub, to merge the commits on one branch (the head) into another (the base, usually `main`).

Q: Which branch is the head, and which is the base?
A: The head branch holds your work. The base branch is where it should land, usually `main`.

Q: What does a PR's list of changes show?
A: What its head branch adds since the merge base, the commit where it split off. Later work on `main` isn't part of it.

Q: When is a pull request ready to open?
A: When its branch holds one whole change, finished and ready to check.

Q: How big is too big?
A: More than one self-contained change. As a rule of thumb, 100 lines is usually reasonable, and 1,000 usually too large.

Q: What is a draft pull request for?
A: Sharing unfinished work, with its checks running. Nobody can merge it until it's marked ready for review.

Q: What four things should a PR's description say?
A: What changed, why (the Issue, with `Closes #12`), how you know it works (real evidence), and what could break.

Q: Can you approve a PR your agent opened with your `gh` login?
A: No. Authors can't approve their own PRs, and the agent opened it as you.

Q: How do you change a PR after it's open?
A: Push more commits to the same branch. The PR updates, and its checks run again.

Q: Which line in `gh pr view` should stop you before you've checked a PR?
A: One starting `Auto-merge:`. Ask the agent to turn it off with `gh pr merge --disable-auto`.
```

## Final test

```final-test pr-where-it-lands
`gh pr view` says a PR "wants to merge 2 commits into main from fix-about-link". Where will the work land when it merges?
- [x] On `main`, the base branch.
- [ ] On `fix-about-link`, the head branch.
- [ ] On a new branch that GitHub makes for the merge.
- [ ] Nowhere yet, until someone picks a base on github.com.
Why: The base branch is where the work lands, and the head branch holds the work. This PR's base is `main`.
```

```final-test pr-description-lives
A PR has merged. Where can you still read its description and its review comments?
- [x] On the PR's page on GitHub, which stays after the merge.
- [ ] In a file that Git adds to the repo when the PR merges.
- [ ] Nowhere, because GitHub deletes a PR's page once it merges.
- [ ] Only in the head branch's newest commit message.
Why: A PR is a GitHub thing, not a Git thing. Its title, description, comments and reviews live on GitHub, and the page stays after the merge.
```

```final-test pr-one-change
Your branch fixes the search bug, and the fix is finished. You'd also like a vegetarian filter. What do you do?
- [x] Open the PR for the fix now, and start the filter on a new branch.
- [ ] Add the filter to this branch, so one PR covers both changes.
- [ ] Wait to open any PR until the filter is finished too.
- [ ] Merge the fix into `main` yourself, and open a PR for the filter.
Why: A PR should hold one whole change, finished and ready to check. Small, single-change PRs are quicker to check and simpler to undo.
```

```final-test pr-draft
You want early feedback on half-finished work, with its checks running and with nobody able to merge it. What do you open?
- [x] A draft pull request.
- [ ] A normal pull request with "WIP" in its title.
- [ ] A new Issue that links to your branch.
- [ ] Nothing until the work is finished.
Why: A draft shows the work and runs its checks, but it can't be merged until someone marks it ready for review.
```

```final-test pr-too-big
Your agent's fix for one small Issue has grown to 2,000 lines across 40 files, and you can't tell what it all does. What do you do before merging?
- [x] Ask the agent to split it into smaller PRs, one self-contained change each.
- [ ] Merge it as it is, because size only matters when other people review it.
- [ ] Ask for a longer description, because a long enough body makes any size easy to check.
- [ ] Mark it as a draft, so it can be merged without being checked.
Why: The right size is one self-contained change, and 1,000 lines is usually too large already. A longer body doesn't help, and a draft can't be merged at all.
```

```final-test pr-evidence
Your agent's PR description says "Fixed search. Tests pass." What's missing?
- [x] Evidence: the real test output, or a screenshot before and after.
- [ ] Nothing, because "Tests pass" is the evidence a reviewer needs.
- [ ] A list of every commit, copied from the Commits tab.
- [ ] The names of the files, copied from Files changed.
Why: "Tests pass" with nothing shown is only a claim. A description should show how the change was verified, as well as name the Issue it closes.
```

```final-test pr-approve-own
You work alone. Your agent opened PR #14 using your `gh` login, and you want to approve it before merging. What happens?
- [x] GitHub won't let you, because the agent opened it as you, and authors can't approve their own PRs.
- [ ] It's approved, because the repo's owner can approve any PR.
- [ ] It's approved, because the agent counts as a different person.
- [ ] It's approved, but only after every check has passed.
Why: Pull request authors cannot approve their own pull requests. An agent working through your login opens PRs as you.
```

```final-test pr-fix-same-branch
A check failed on your agent's PR #14. What should the agent do?
- [x] Fix it and push a new commit to the same branch, so #14 updates and its checks run again.
- [ ] Close #14 and open a new PR from `main` with the fix.
- [ ] Push the fix straight onto `main`, then rerun #14's checks.
- [ ] Wait, because a failed check turns green on its own after a while.
Why: Pushing to the PR's head branch updates the PR, and its checks run again. A new PR isn't needed.
```

```final-test pr-merge-base
After your agent made its branch, two other PRs landed on `main`. Your PR's Files changed doesn't show their changes. What's going on?
- [x] A PR shows only what its own branch adds since it split off from `main`.
- [ ] GitHub hides changes from other PRs until yours has merged.
- [ ] Your PR is out of date, and GitHub has stopped updating it.
- [ ] The other PRs failed, so their changes never reached `main`.
Why: GitHub compares from the merge base, the commit where your branch began. Work that landed on `main` later isn't part of your PR.
```

```final-test pr-request-changes
You submit a review with Request changes on a repo whose `main` has no rules at all. Can someone still merge the PR?
- [x] Yes. Request changes blocks a merge only when a rule on the branch requires pull requests.
- [ ] No. Request changes always locks the merge button until you approve.
- [ ] No. The PR turns back into a draft until the changes are made.
- [ ] Yes, but only after the author deletes your review.
Why: Request changes is a verdict, not a lock. It stops a merge only when a rule on the branch requires pull requests.
```

```sources
- [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests), GitHub Docs
- [Branches](https://docs.github.com/en/pull-requests/reference/branches), GitHub Docs
- [Creating a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request), GitHub Docs
- [Changing the stage of a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request), GitHub Docs
- [Reviewing proposed changes in a pull request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request), GitHub Docs
- [Pull request reviews](https://docs.github.com/en/pull-requests/reference/pull-request-reviews), GitHub Docs
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks), GitHub Docs
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request), GitHub Docs
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [Blocking command line pushes that expose your personal email address](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/blocking-command-line-pushes-that-expose-your-personal-email-address), GitHub Docs
- [Setting your commit email address](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address), GitHub Docs
- [gh pr create](https://cli.github.com/manual/gh_pr_create), GitHub CLI manual
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [gh pr diff](https://cli.github.com/manual/gh_pr_diff), GitHub CLI manual
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub CLI manual
- [gh pr ready](https://cli.github.com/manual/gh_pr_ready), GitHub CLI manual
- [gh pr edit](https://cli.github.com/manual/gh_pr_edit), GitHub CLI manual
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub CLI manual
- [git-push](https://git-scm.com/docs/git-push), The Git project
- [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), Google Engineering Practices
- [The /pr Skill](https://www.aihero.dev/skills-pr), Matt Pocock, 2026-10-05
- [pr: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/SKILL.md), Matt Pocock's Skills
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05
- [v1.3: graduate implement-spec, pr and retro; remove resolving-merge-conflicts (#1120)](https://github.com/mattpocock/skills/pull/1120), Matt Pocock, 2026-09-24
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
```
