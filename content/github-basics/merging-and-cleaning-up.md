---
title: Merging and cleaning up
slug: merging-and-cleaning-up
summary: Choose how a pull request lands on main, merge it or set auto-merge, then check its Issue closed, delete the branch and update your main.
---

Say PR #14 in your recipe site's repo has passed your [Merge check](/learn/checking-a-pr). The merge button offers three ways to merge, and you're not sure which to pick. Afterwards, Issue #12 might stay open without anyone noticing, and old branches pile up on GitHub and on your computer.

```goals
- Choose between a merge commit, squash and merge, and rebase and merge.
- Merge a pull request on github.com or with `gh pr merge`.
- Use auto-merge safely, and turn it off.
- Confirm the Issue closed, and close it by hand when it didn't.
- Delete the branch on GitHub and on your computer, and bring your `main` up to date.
- Ask a coding agent to merge and tidy up, and check what's left.
```

## After the Merge check

**Squash and merge by default, confirm the Issue closed, then clean up.**

Those are three separate moves, and each can go wrong on its own:

1. Merge with a method you chose, not whichever the button showed first.
2. Check that the Issue the PR was for is now closed.
3. Delete the branch, and bring your own copy of `main` up to date.

```checkpoint quick-1
Your Merge check has passed. What are the next three moves?
- [x] Merge with the method you chose, confirm the Issue closed, then clean up.
- [ ] Clean up the branch first, then merge, then read the Issue.
- [ ] Merge with any method, then open a new PR for the clean-up.
Why: Squash and merge by default, confirm the Issue closed, then clean up. Each move can go wrong on its own, so check each one.
```

## Three ways to merge

GitHub offers three ways to merge a pull request. All three put the same files on `main`. They differ in which commits `main` gets:

| Method | What `main` gets | Suits |
|---|---|---|
| **Create a merge commit** | Every commit from the branch, plus one extra **merge commit** that joins the two lines of history | A team that wants every commit kept |
| **Squash and merge** | One new commit holding all the changes | One change on a short-lived branch, often with small "fix" commits |
| **Rebase and merge** | Each commit copied onto `main`, one by one, with new IDs and no merge commit | A team that wants a straight-line history of tidy commits |

For example, say PR #14 has three commits: the fix, "Fix a typo" and "Fix the failing test". Squash and merge puts one commit on `main`. A merge commit puts four there: the three, plus the merge commit. Rebase and merge puts three copies.

```checkpoint quick-2
PR #14 has five commits: the fix and four "fix the test" commits. With squash and merge, how many new commits land on `main`?
- [x] One, holding all the changes.
- [ ] Five, one for each commit.
- [ ] Six: the five, plus a merge commit.
Why: Squash and merge combines every commit in the PR into one new commit. A merge commit would add six, and rebase and merge five copies.
```

Why squash by default? Small commits help while you work on a branch, but they aren't worth keeping in `main`'s history. With one commit per PR, the history reads as a list of changes, and one revert takes a whole change back out ([Undo and merge conflicts](/learn/undo-and-conflicts) shows how).

Squashing has two costs. The branch's separate commits aren't kept on `main`, though the PR page still shows them. And Git no longer sees your branch as merged, which matters when you clean up, below. So after a squash, the branch is finished: new work starts on a new branch.

When you squash, GitHub suggests a commit message, and you can edit it before you confirm. For a PR with one commit, it suggests that commit's message. For two or more, it suggests the PR's title and a list of its commits. So the PR's title often becomes the line on `main`.

A repo chooses which methods to allow, under **Settings**, then **General**, in the **Pull Requests** section. Allow only one, and only that button appears. Pick a merge commit instead of a squash when each commit must stay separate in the history.

```checkpoint quick-3
Your team wants every commit from each PR kept on `main`, with a clear point where each PR joined. Which method fits?
- [x] Create a merge commit.
- [ ] Squash and merge.
- [ ] Rebase and merge.
Why: A merge commit keeps every commit from the branch and adds one commit marking the merge. A squash keeps one commit, and a rebase adds no merge commit.
```

## Merging it

On github.com:

1. Open the PR's **Conversation** tab and scroll down to the merge box.
2. Open the menu on the merge button, and choose **Squash and merge**. Then click **Squash and merge**.
3. Check the suggested commit message, and edit it if you need to. Then click **Confirm squash and merge**.
4. Click **Delete branch** when GitHub offers it.

With `gh`:

```sh
gh pr merge 14 --squash --delete-branch
```

It merges, then deletes the branch on GitHub and on your computer. If you were on that branch, it first switches you to `main` and pulls it. You should see something like:

```text
✓ Squashed and merged pull request your-name/recipes#14 (Make search ignore capital letters)
✓ Deleted local branch 12-search-capitals and switched to branch main
✓ Deleted remote branch 12-search-capitals
```

`gh` deletes your computer's copy of the branch even if it holds commits the PR doesn't have. So push any last commit before you merge.

If something is in the way, `gh` says the PR `is not mergeable` and gives the reason, such as a required check that hasn't passed. Fix that, not the rule. `gh` may also suggest the `--admin` flag, which merges past the repo's rules. Never let an agent use it.

```checkpoint quick-4
Your agent's `gh pr merge` fails: "is not mergeable: the base branch policy prohibits the merge". It offers to retry with `--admin`. What do you say?
- [x] No. Find out what's blocking the merge, such as a check, and fix that.
- [ ] Yes, because `--admin` is the normal way to merge your own PRs.
- [ ] Yes, but only if the agent squashes the commits as well.
Why: The repo's rules are blocking the merge for a reason. `--admin` merges past them, which is what those rules exist to stop.
```

## Auto-merge

**Auto-merge** merges a PR by itself once all its required reviews and checks pass. It's handy when the last check takes a while: you set it, and the merge happens when that check goes green.

Three things must be true before you can use it:

- The repo allows it: under **Settings**, then **General**, select **Allow auto-merge**.
- The repo's plan has it. GitHub Free offers it only in public repos. Private repos need a paid plan, such as GitHub Pro or Team.
- The PR can't merge yet. The option shows only while something is still pending, such as a required check that's running.

To turn it on, choose a method from the merge button's menu, click **Enable auto-merge**, then **Confirm auto-merge**. With `gh`, run `gh pr merge 14 --auto --squash`. It prints that the PR "will be automatically merged via squash when all requirements are met".

To turn it off, click **Disable auto-merge** in the merge box, or run `gh pr merge 14 --disable-auto`. It also turns itself off if someone without write access pushes to the branch, or if the PR's base branch changes.

There's a catch. Auto-merge waits only for what the repo requires. It doesn't wait for the rest of your Merge check: the preview, the risk, the fresh review. So turn it on only once your own check is done.

```checkpoint quick-5
Your PR can already merge, and you can't find the Enable auto-merge button. Why not?
- [x] It shows only on a PR that can't merge yet, while something is still pending.
- [ ] It shows only after every check on the PR has passed.
- [ ] It shows only on repos that have no rules at all.
Why: Auto-merge waits for something still pending, such as a required check that's running. A PR that can already merge has nothing to wait for.
```

## Did the Issue close?

If the PR said `Closes #12` and merged into `main`, GitHub should have closed #12. Check it:

```sh
gh issue view 12 --json state
```

```json
{
  "state": "CLOSED"
}
```

On github.com, the Issue shows **Closed**, and its timeline names the PR that closed it.

Still `OPEN`? Look again after a few seconds, since closing can lag a moment behind the merge. Then check three things with `gh pr view 14`:

- It says `Merged`. If not, nothing reached `main`, and nothing closed.
- It says `into main`, the default branch. A PR into any other branch closes nothing.
- Its description says `Closes #12`, or fixes or resolves, with one keyword per Issue. Words like "Part of #12" close nothing.

If `gh issue view` prints `"state": "MERGED"`, you gave it the PR's number by mistake. Issues and PRs share one set of numbers, so use the Issue's.

```checkpoint quick-6
Which pull request closes Issue #12 when it merges?
- [x] One into `main` whose description says `Closes #12`.
- [ ] One into any branch whose description says `Closes #12`.
- [ ] One into `main` whose title mentions #12 in any words.
Why: It has to merge into the default branch, usually `main`, and its description needs a closing keyword with the Issue's number.
```

## Closing an Issue by hand

Some Issues won't close by themselves: the PR forgot its `Closes` line, or the work needed no code at all. Close those by hand, with a comment saying why, so the next reader knows.

On github.com, open the Issue and write your comment. Next to **Close issue**, open the menu to pick a reason, such as completed or not planned. Then click **Close issue**.

With `gh`:

```sh
gh issue close 12 --comment "Fixed by #14."
gh issue close 9 --reason "not planned" --comment "We removed the About page."
```

Closed one by mistake? `gh issue reopen 12` opens it again.

Parents need this too. Closing every sub-issue doesn't close the parent ([Issues: keeping track of work](/learn/issues-and-keeping-track) explains sub-issues). So give the parent its own `closes #10` in the last PR, or close it by hand once its last sub-issue closes. `gh issue view 10 --json state,subIssuesSummary` shows both its state and how many sub-issues are done.

```checkpoint quick-7
You decide the "search by ingredient" Issue won't be built after all. How does it get closed?
- [x] By hand, as not planned, with a comment first saying why.
- [ ] By a merge, with `Closes` and its number in some other PR.
- [ ] By the `wontfix` label, which closes the Issue when you add it.
Why: Work that will never happen has no PR to close it. Close it by hand, choose "not planned", and leave a comment so the next reader knows why.
```

## Cleaning up

GitHub keeps the PR, its conversation and its commits when the branch goes. What deleting prevents is someone, you or an agent, picking up an old branch by mistake.

On GitHub, the branch can go three ways:

- Click **Delete branch** on the merged PR. A **Restore branch** button brings it back if you need it.
- Turn on **Automatically delete head branches**, under **Settings**, then **General**. GitHub then deletes each PR's branch after it merges.
- Use `gh pr merge` with `--delete-branch`, as above.

On your computer, bring `main` up to date and see what's left. [Push, pull and remotes](/learn/push-pull-and-remotes) explains these commands:

```sh
git switch main
git pull
git fetch --prune
git branch -vv
```

`git pull` brings the merged commit into your `main`. `git fetch --prune` makes Git forget branches that were deleted on GitHub. Then `git branch -vv` lists your branches, and one whose GitHub copy is gone shows `gone]`.

Delete each finished branch with `git branch -d 12-search-capitals`. After a squash merge, Git may refuse, saying the branch is `not fully merged`. That's expected: `main` holds one new commit, not your branch's commits, so Git can't find them there.

Before you force it with `git branch -D`, check that the branch holds nothing new. These two should print the same long ID:

```sh
git rev-parse 12-search-capitals
gh pr view 14 --json headRefOid --jq .headRefOid
```

If they match, the branch holds only work that's already in the PR, so `-D` is safe. If they differ, the branch has a commit the PR lacks. Put it on a fresh branch with its own PR first.

Used a [worktree](/learn/branches-and-worktrees) for this work? Remove it from your project's main folder with `git worktree remove <folder>`. Git removes only a clean worktree, with nothing left uncommitted.

Then start your next change on a fresh branch, from an up-to-date `main`.

```checkpoint quick-8
After a squash merge, `git branch -d 12-search-capitals` says the branch is not fully merged. What's going on?
- [x] `main` holds one new squash commit, so Git can't find the branch's own commits there.
- [ ] The merge failed, so the branch's work never reached `main`.
- [ ] GitHub still has the branch, so Git refuses to delete your copy.
Why: Squash and merge writes a new commit instead of keeping the branch's commits. Check that the branch's last commit matches the PR's, then `git branch -D` is safe.
```

## With a coding agent

An agent can do the merging and most of the tidying through `gh` and `git`. Say what to do, and what not to:

> Squash-merge PR #14 and delete its branch. Don't use `--admin`. Then show me `gh issue view 12 --json state` and `git branch -vv`.

It runs something like:

```sh
gh pr merge 14 --squash --delete-branch
gh issue view 12 --json state
git fetch --prune
git branch -vv
```

Then check its report against these:

- `gh pr view 14` says `Merged`.
- Issue #12 says `"state": "CLOSED"`. If not, run the three checks above.
- `git branch` shows `* main`, and no `12-search-capitals`.

If you want the agent to merge later, once a check finishes, ask for auto-merge only after your Merge check is done:

> My Merge check passed. Turn on auto-merge with squash for PR #14.

```checkpoint quick-9
Your agent reports: "Merged PR #14, and Issue #12 is closed." What do you run to check the second claim?
- [x] `gh issue view 12 --json state`, looking for CLOSED.
- [ ] `gh pr view 14`, looking for the word Merged.
- [ ] `git branch -vv`, looking for a branch marked gone.
Why: Only the Issue's own state shows whether it closed. `gh pr view` checks the merge, and `git branch -vv` checks the clean-up.
```

## Try it: merge your practice PR

````try
You need the practice PR from the Try it in [Checking a pull request before you merge](/learn/checking-a-pr), marked ready for review, and the numbers of its two Issues. Run these in your practice repo.

1. Squash-merge the PR and delete its branch. Add the PR's number if you're not on its branch.

   ```sh
   gh pr merge --squash --delete-branch
   ```

   You should see `Squashed and merged pull request`, then `Deleted local branch` and `Deleted remote branch`.

2. Check that the bug closed, with its number in place of `BUG`:

   ```sh
   gh issue view BUG --json state
   ```

   You should see `"state": "CLOSED"`.

3. Check the parent, with its number in place of `PARENT`:

   ```sh
   gh issue view PARENT --json state,subIssuesSummary
   ```

   You should see `"state": "OPEN"`, with `"completed": 1` and `"total": 1`. Closing its sub-issue didn't close it.

4. Close the parent by hand:

   ```sh
   gh issue close PARENT --comment "Practice done: its only sub-issue is closed."
   ```

5. Tidy your copy:

   ```sh
   git switch main
   git pull
   git fetch --prune
   git branch -vv
   ```

   You should see `main`, and no practice branch.

6. See the one new commit at the top of `main`:

   ```sh
   git log --oneline -3
   ```
````

## Try it: watch a pull request merge itself

This one uses your practice project, the yoga-studio booking site from [Issues: keeping track of work](/learn/issues-and-keeping-track), with a CI check on its pull requests. You'll make `main` wait for that check with **branch protection**: a branch rule that blocks merging until checks pass. Then you'll watch a PR merge itself.

````try
You'll need the practice project. If you haven't set it up, do its Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first. No CI check yet? The Try it in [What CI/CD is](/learn/what-ci-cd-is) adds one, called `test`.

1. On GitHub Free, make the repo public first. Free has auto-merge and protected branches only in public repos.

   ```sh
   gh repo edit --visibility public --accept-visibility-change-consequences
   ```

2. Turn on auto-merge: in **Settings**, under **General**, select **Allow auto-merge**.
3. In **Settings**, click **Branches**, then **Add classic branch protection rule**.
4. Type `main` as the branch name pattern. Select **Require status checks to pass before merging**.
5. Search for your CI check, select it, and click **Create**.
6. Create a practice Ticket, so your booking Ticket, #3, stays open. Note its number.

   ```sh
   gh issue create --title "Try auto-merge" --body "Practice."
   ```

7. Start its branch:

   ```sh
   git switch main && git pull && git switch -c try-auto-merge
   ```

8. Change one line of `README.md`, then commit and push:

   ```sh
   git commit -am "Try auto-merge" && git push -u origin HEAD
   ```

9. Open a PR into `main`, with your practice Ticket's number in place of `N`:

   ```sh
   gh pr create --title "Try auto-merge" --body "Closes #N"
   ```

10. While the checks run, click **Enable auto-merge**, then **Confirm auto-merge**. If they finish first, the button won't show: push another small commit and try again.

You should see the PR merge by itself once the checks pass, and the Ticket's Issue close. Then go back:

```sh
git switch main && git pull
```
````

## Going deeper

### Where it goes wrong

**Your PR says `Merged`, and your Issue says `OPEN`.** Look at the PR's description. "Part of #12" or "Related to #12" only mention the Issue. If the work is finished, close the Issue by hand, naming the PR.

**Your PR says `into` another branch.** GitHub ignored its `Closes` line, so the merge closed nothing. The Issue closes when a PR into `main` says so, or when you close it by hand.

**`gh` won't delete your local branch, because a worktree has it open.** Git lets only one folder be on a branch at a time. The merge itself went through: only the clean-up stopped, and `gh` prints the commands to finish. Run `git status` in that worktree first, in case it holds work you want.

**A later PR shows commits you already merged.** You kept working on a branch after it was squash-merged. A new PR from it lists the old commits again, and you may meet the same merge conflicts more than once. Start each change on a fresh branch.

**You deleted a branch you still needed.** Open the merged PR and click **Restore branch**.

**Auto-merge turned itself off.** Someone without write access pushed to the branch, or the base branch changed. Check the new commits, then turn it on again.

```checkpoint quick-10
You squash-merged a branch yesterday. Today you want to add to the same work, and the old branch is still on your computer. Where does the new work go?
- [x] On a fresh branch, because a new PR from the old one would list the squashed commits again.
- [ ] On the old branch, because a squash merge empties it, so nothing old can come back.
- [ ] Straight on `main`, because a squashed piece of work can't have another PR.
Why: Squash merging suits short-lived branches. Keep working on the old branch, and later PRs from it can include commits already squashed into `main`.
```

## Remember

```flashcards
Q: Which merge method is your default, and when do you pick another?
A: Squash and merge. Pick a merge commit when each commit must stay in the history, and rebase and merge for a straight-line history of tidy commits.

Q: What does squash and merge put on `main`?
A: One new commit holding all the PR's changes. The separate commits stay visible on the PR's page.

Q: What does auto-merge wait for, and what doesn't it wait for?
A: It waits for the repo's required reviews and checks. It doesn't wait for your preview, your risk call or a fresh review.

Q: Why can't you see the Enable auto-merge button?
A: The repo doesn't allow auto-merge, your plan doesn't offer it, or the PR can already merge.

Q: An Issue stays open after its PR merged. What three things do you check on the PR?
A: It says `Merged`, it says `into main`, and its description says `Closes` with the Issue's number.

Q: `gh issue view` prints `"state": "MERGED"`. What went wrong?
A: You gave it the PR's number. Issues and PRs share one set of numbers, so use the Issue's.

Q: Does closing every sub-issue close the parent?
A: No. Give the parent its own `Closes` line, or close it by hand.

Q: What does `git fetch --prune` do?
A: It makes Git forget the branches that were deleted on GitHub.

Q: After a squash merge, `git branch -d` says not fully merged. What do you do?
A: Check that the branch's last commit matches the PR's `headRefOid`. If it does, `git branch -D` is safe.

Q: Where does your next change start after a squash merge?
A: On a fresh branch, from an up-to-date `main`.
```

## Final test

```final-test mcu-which-merge
Your PR holds one fix in five small commits, on a branch you made this morning. Nobody needs those commits later. Which merge do you ask for?
- [x] Squash and merge, because one change on a short-lived branch suits one commit on `main`.
- [ ] A merge commit, because every PR has to keep each of its commits on `main`.
- [ ] Rebase and merge, because a squash is refused on a branch with more than one commit.
- [ ] Any of the three, because they all leave exactly the same history on `main`.
Why: Squash and merge combines the commits into one, which suits one change on a short-lived branch. A merge commit keeps them all, and rebase copies each one.
```

```final-test mcu-same-files
What's the difference between the three merge methods?
- [x] They put the same files on `main`, but different commits.
- [ ] They put different files on `main`, depending on the method.
- [ ] Only squash and merge brings the branch's changes to `main`.
- [ ] Only a merge commit lets GitHub close the linked Issue.
Why: All three land the same changes. A merge commit keeps every commit and adds one, squash makes one new commit, and rebase copies each commit.
```

```final-test mcu-stays-open
A PR merged into `main`, and its Issue still says `OPEN` a minute later. Its description never says `Closes`. The work is finished. What do you do?
- [x] Close the Issue by hand, with a comment naming the PR.
- [ ] Wait longer, because GitHub closes every Issue a merged PR worked on.
- [ ] Revert the PR, because an open Issue means the merge failed.
- [ ] Merge the PR again, so GitHub reads its description a second time.
Why: With no closing keyword, the PR gave GitHub nothing to close. The merge worked, so close the Issue by hand and say which PR did the work.
```

```final-test mcu-parent-closes
Your last PR finishes the final sub-issue, #13, of the parent Issue #10. How can that same PR also close #10?
- [x] Give it a keyword for each: `Closes #13, closes #10`.
- [ ] Nothing extra: a parent closes when its last sub-issue closes.
- [ ] Write `Closes #13, #10`, so one keyword covers both.
- [ ] Mention #10 anywhere in the PR's title.
Why: Closing every sub-issue doesn't close the parent, and GitHub needs one keyword per Issue. Or close the parent by hand afterwards.
```

```final-test mcu-after-squash
You squash-merged a branch yesterday and want to add to the same work today. The old branch is still on your computer. Where does the new work go?
- [x] On a fresh branch from an up-to-date `main`.
- [ ] On the old branch, because squash merging emptied it.
- [ ] On the old branch, because Git refuses new branches until old ones go.
- [ ] Straight on `main`, because squashed work can't have another PR.
Why: A new PR from a squash-merged branch can list the already-merged commits again, and conflicts get more likely. Start fresh.
```

```final-test mcu-not-fully-merged
After a squash merge, `git branch -d` refuses: the branch is not fully merged. What do you do?
- [x] Check that the branch's last commit matches the PR's `headRefOid`, then use `git branch -D`.
- [ ] Use `git branch -D` straight away, because the message is always wrong after a merge.
- [ ] Leave the branch for ever, because Git says some of its work is unmerged.
- [ ] Merge the PR a second time, so Git sees the branch as merged.
Why: After a squash, Git can't find the branch's commits on `main`, so it refuses. If the branch holds nothing newer than the PR, the forced delete loses nothing.
```

```final-test mcu-auto-merge-wait
Auto-merge is on for your PR, and the last required check is still running. You haven't tried the preview yet. What happens if the check passes now?
- [x] The PR merges, because auto-merge waits only for what the repo requires.
- [ ] Nothing, because auto-merge waits until you've tried the preview.
- [ ] The PR merges only after a fresh agent has reviewed it.
- [ ] The PR turns into a draft until you confirm the merge.
Why: Auto-merge merges once the required reviews and checks pass. Your own looks aren't among them, so turn it on only after your Merge check.
```

```final-test mcu-state-merged
You run `gh issue view 14 --json state` to see whether your Issue closed, and it prints `"state": "MERGED"`. What does that tell you?
- [x] You gave it a PR's number, since Issues and PRs share one set of numbers.
- [ ] The Issue merged into `main` along with its PR.
- [ ] The Issue closed, and GitHub calls a closed Issue merged.
- [ ] The Issue is waiting for its PR to merge.
Why: An Issue is open or closed, never merged. A PR can be merged, and it shares the repo's numbers with the Issues, so use the Issue's number.
```

```final-test mcu-admin
Your agent's merge fails with "not mergeable", and it proposes `gh pr merge 14 --squash --admin`. What do you say?
- [x] No: find out what's blocking the merge, such as a required check, and fix that.
- [ ] Yes, because `--admin` only changes who is shown as merging the PR.
- [ ] Yes, because a failed merge always means GitHub is confused.
- [ ] Yes, but only after you delete the branch on GitHub.
Why: `--admin` merges past the repo's rules, which exist to stop exactly this. Fix what the rules are pointing at instead.
```

```final-test mcu-fetch-prune
GitHub deleted your PR's branch after the merge, but `git branch -r` on your computer still lists `origin/12-search-capitals`. What fixes that?
- [x] `git fetch --prune`, which makes Git forget branches deleted on GitHub.
- [ ] `git pull`, which deletes old branches as it brings in new commits.
- [ ] `git branch -d main`, which resets the list of branches.
- [ ] Nothing, because that line means the branch still exists on GitHub.
Why: Git's list of GitHub branches is only as fresh as its last fetch. `--prune` removes the ones that no longer exist on GitHub.
```

```sources
- [Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges), GitHub Docs
- [About merge methods on GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github), GitHub Docs
- [Configuring commit squashing for pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests), GitHub Docs
- [Merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request), GitHub Docs
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request), GitHub Docs
- [Managing auto-merge for pull requests in your repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-auto-merge-for-pull-requests-in-your-repository), GitHub Docs
- [Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule), GitHub Docs
- [Managing the automatic deletion of branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches), GitHub Docs
- [Deleting and restoring branches in a pull request](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/deleting-and-restoring-branches-in-a-pull-request), GitHub Docs
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs
- [Closing an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/closing-an-issue), GitHub Docs
- [Adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues), GitHub Docs
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub CLI manual
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [gh issue view](https://cli.github.com/manual/gh_issue_view), GitHub CLI manual
- [gh issue close](https://cli.github.com/manual/gh_issue_close), GitHub CLI manual
- [gh repo edit](https://cli.github.com/manual/gh_repo_edit), GitHub CLI manual
- [cli/cli: pkg/cmd/pr/merge/merge.go](https://github.com/cli/cli/blob/trunk/pkg/cmd/pr/merge/merge.go), The GitHub CLI project
- [git-branch](https://git-scm.com/docs/git-branch), The Git project
- [git-fetch](https://git-scm.com/docs/git-fetch), The Git project
- [git-pull](https://git-scm.com/docs/git-pull), The Git project
- [git-switch](https://git-scm.com/docs/git-switch), The Git project
- [git-worktree](https://git-scm.com/docs/git-worktree), The Git project
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05
```
