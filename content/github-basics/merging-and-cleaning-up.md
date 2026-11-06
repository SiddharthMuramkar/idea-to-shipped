---
title: Merging and cleaning up
slug: merging-and-cleaning-up
summary: Squash into one commit by default, confirm the Issue closed, then clean up.
---

## After the Merge check

Say your pull request has passed your [Merge check](/learn/checking-a-pr). Which of GitHub's three merges do you pick? The Issue might stay open unnoticed, and old branches pile up.

**Squash into one commit by default, confirm the Issue closed, then clean up.**

```checkpoint quick-1
Your Merge check has passed. What are the next three moves?
- [x] Squash into one commit, confirm the Issue closed, then clean up.
- [ ] Clean up first, then squash, then confirm the Issue closed.
- [ ] Use a merge commit, then clean up, then read the Issue.
Why: Squash into one commit by default, confirm the Issue closed, then clean up.
```

## Which merge

- **Squash and merge** combines the commits into one on `main`. Your default: it suits one change on a short-lived branch.
- **Merge commit** keeps every commit, for when each must stay in the history.
- **Rebase and merge** adds each commit onto `main`, for teams wanting a straight-line history.

```checkpoint quick-2
You're merging one change from a short-lived branch. Which merge fits?
- [x] Squash and merge, which combines its commits into one.
- [ ] Merge commit, which keeps every commit on `main`.
- [ ] Rebase and merge, which adds each commit onto `main`.
Why: Squash and merge combines all the pull request's commits into one commit on `main`. It suits one change on a short-lived branch, so it's your default.
```

## Did the Issue close?

On `finance-agent`, pull request #305 merged into `main` saying `Closes #267`.

You look:

```
gh issue view 267 --repo SiddharthMuramkar/finance-agent --json state
```

You should see `"state": "CLOSED"`.

If yours says `OPEN`, run three checks with `gh pr view <pr-number>`:

- It says `Merged`.
- It says `into main`. A pull request into any other branch closes nothing.
- Its body says `Closes` and the Issue's number.

```checkpoint quick-3
Which pull request closes its Issue when it merges?
- [x] One into `main` whose body says `Closes` and the number.
- [ ] One into any branch whose body says `Closes` and the number.
- [ ] One into `main` whose title names the Issue in any words.
Why: It has to have merged, into `main`, and its body has to say `Closes` and the Issue's number. A pull request into any other branch closes nothing.
```

If it merged without that line and the work is finished, close the Issue by hand, below. Anything else? See [Where it goes wrong](/learn/merging-and-cleaning-up).

## Closing by hand

You say:

> Close `#<issue-number>`, naming pull request `#<pr-number>` in a comment.

Some Issues get no code. Close those by hand, with a comment first to record why.

```checkpoint quick-4
An Issue will get no code. How does it get closed?
- [x] By hand, with a comment first to record why.
- [ ] By a merge, with `Closes` and its number in the body.
- [ ] By hand, with no comment, since closing records why.
Why: Some Issues get no code. Close those by hand, with a comment first to record why.
```

Say you've decided against one.

You say:

> Close `#<issue-number>` as not planned, with a comment first saying `<reason>`.

Either way, look again: you should see `"state": "CLOSED"`.

## Closing a Spec

Closing every [sub-issue](/learn/issues-and-keeping-track) doesn't close their [Spec](/learn/one-change-start-to-finish). So give it its own `Closes` line in the last pull request, or close it by hand.

```checkpoint quick-5
Every sub-issue of a Spec has closed. What closes the Spec?
- [x] Its own `Closes` line in the last pull request, or by hand.
- [ ] Nothing more, because its last sub-issue closing closes it too.
- [ ] Pulling `main`, because that updates the Spec's state on GitHub.
Why: Closing every sub-issue doesn't close their Spec. So give it its own `Closes` line in the last pull request, or close it by hand.
```

## Cleaning up

- Branch: delete it, so nobody uses it by accident.
- `main`: pull it, so your copy has the merged work.
- [Worktree](/learn/branches-and-worktrees), if you made one: type `/exit` in its session, and choose remove if asked. Kept it? From your project's folder, have Claude run `git worktree remove .claude/worktrees/318-clipped-labels`.

```checkpoint quick-6
Why delete a branch after merging it?
- [x] So nobody uses it by accident.
- [ ] So your copy has the merged work.
- [ ] So GitHub can close the Issue.
Why: Delete the branch, so nobody uses it by accident. Pulling `main` is what gives your copy the merged work.
```

## Do it now

Merge check passed? Go back to your first session, on your Issue's branch. Not passed? Have that session fix and push, then check again.

New session? Paste [the line for Claude](/learn/one-change-start-to-finish) first.

Still in the review session in your second terminal? Type `/exit`.

You say:

> Squash-merge this pull request and delete its branch.

Claude runs:

```
gh pr merge --squash --delete-branch
```

An error? See [Where it goes wrong](/learn/merging-and-cleaning-up).

You look:

```
gh issue view <issue-number> --json state
```

You should see `"state": "CLOSED"`. If it's `OPEN`, run the three checks above.

You look:

```
git branch
```

You should see `* main` and no Issue branch: `--delete-branch` moved you to `main` and pulled it.

That's your first real change merged into `main`. Whether it's online depends on how your project deploys. Take a moment, then stop.

```checkpoint quick-7
You've confirmed the Issue closed, and `git branch` shows `* main` with no branch for your Issue. What now?
- [x] Your first real change has merged, so stop.
- [ ] Your change still needs a merge, so go on.
- [ ] Your branch still needs pushing, so go on.
Why: That's your first real change merged into `main`. Take a moment, then stop.
```

## Going deeper

### Why it exists

GitHub's default button makes a merge commit, which adds all your branch's commits to `main`. Work-in-progress commits help while you're on a branch, but they aren't necessarily worth keeping in the history. So squash by default. The cost is that those separate commits aren't kept on `main`, so pick a merge commit when they matter.

```checkpoint quick-8
What does squashing cost you?
- [x] Your branch's separate commits aren't kept on `main`.
- [ ] Your pull request's history isn't kept on GitHub.
- [ ] Your branch's changes aren't brought into `main`.
Why: The cost is that those separate commits aren't kept on `main`, so pick a merge commit when they matter.
```

Cleanup can feel risky, but GitHub keeps your pull request and commit history when the branch goes. The one exception is a commit you never pushed: `--delete-branch` deletes your local branch anyway, so push first. What deleting prevents is someone using an old branch by accident.

### A real example

Pull request #91 on this site's repo landed the last eight sub-issues of Spec #57. Its body gives each its own line, with the Spec last:

```
Closes #62
Closes #63
Closes #64
Closes #67
Closes #68
Closes #70
Closes #71
Closes #72
Closes #57
```

That repo is private, so here's the same kind of list on a public one. Pull request #89 on `finance-agent` went into `main` with 14 commits, using squash and merge, so `main` got one commit. Its branch was deleted 2 seconds after the merge. Its body says it implements a Spec, #77, then gives that Spec and its 4 sub-issues a `Closes` line each.

You look:

```
gh issue view 77 --repo SiddharthMuramkar/finance-agent --json closedByPullRequestsReferences --jq '.closedByPullRequestsReferences[].number'
```

You should see `89`, the pull request that closed the Spec. `--jq` picks one field out of the JSON.

Now a Spec no pull request closed: #57 on `finance-agent`, which isn't the #57 on this site's repo.

You look:

```
gh issue view 57 --repo SiddharthMuramkar/finance-agent --json state,subIssuesSummary
```

You should see `"state": "OPEN"`, with `"completed": 19` and `"total": 19`.

All 19 sub-issues are closed, and GitHub left the Spec open. Its newest comment says it has shipped and is now with its owner. A merged pull request saying `Closes` with its number would close it, and so would closing it by hand.

```checkpoint quick-9
All 19 of a Spec's sub-issues are closed. What does GitHub do to the Spec?
- [x] It leaves the Spec open.
- [ ] It closes the Spec too.
- [ ] It reopens the sub-issues.
Why: All 19 sub-issues are closed, and GitHub left the Spec open. A merged pull request saying `Closes` with its number would close it, and so would closing it by hand.
```

### Where it goes wrong

**Your pull request says `Merged`, and your Issue says `OPEN`.** Pull request #306 on `finance-agent` shows why that happens.

You look:

```
gh pr view 306 --repo SiddharthMuramkar/finance-agent
```

You should see `Merged`, `into main` and `Part of #248`.

`Part of` isn't a closing word, so #248 stayed open. If yours is the same and the work is finished, close the Issue by hand.

```checkpoint quick-10
A merged pull request says `Part of` and an Issue's number. What happens to that Issue?
- [x] It stays open, because `Part of` isn't a closing word.
- [ ] It closes, because the pull request merged into `main`.
- [ ] It closes, because `Part of` counts the same as `Closes`.
Why: `Part of` isn't a closing word, so #248 stayed open. If yours is the same and the work is finished, close the Issue by hand.
```

**All three checks hold, and your Issue says `OPEN`.** GitHub closed #77 on `finance-agent` 3 seconds after #89 merged, so look again. Still `OPEN`? Close it by hand, naming the pull request.

**Your pull request doesn't say `Merged`.** It hasn't merged, so nothing reached `main` and nothing closed. Have Claude explain what `gh pr merge` printed. Fix that, then merge again.

**Your pull request says `into` another branch.** GitHub ignored its `Closes`. The Issue closes when a pull request into `main` says so, as #89 did after building on another branch.

**`gh` prints `"state": "MERGED"`.** You gave `gh issue view` your pull request's number. Issues and pull requests share one set of numbers, so use the Issue's.

```checkpoint quick-11
`gh issue view` prints `"state": "MERGED"`. What does that tell you?
- [x] You gave it your pull request's number, not the Issue's.
- [ ] You gave it the right number, and the Issue has closed.
- [ ] You gave it an Issue's number, and that Issue has merged.
Why: Issues and pull requests share one set of numbers, so `gh issue view` can read a pull request's number. Use the Issue's.
```

**`gh` stops at `'main' is already used by worktree`.** Your session is in a worktree, and your project's folder is already on `main`. Git lets only one folder be on a branch. The merge went through, and only the cleanup stopped. First run `git status` in the worktree. If it lists work you want, have Claude put it on a fresh branch. Then exit a `claude -w` session, and choose remove if asked. For a worktree you made yourself, have Claude run `git worktree remove <worktree-folder>` from your project's folder. If `git branch` still lists the Issue's branch, delete it as the next entry says. Then have Claude delete the branch on GitHub if it's still there, and update `main`.

**Git says a branch is `not fully merged`.** After a squash, that can be expected: `main` holds one new commit, so `git branch -d` can't find your branch's commits there. A commit made after the merge prints the same message, and `-D` would lose it. So compare your branch's last commit with the pull request's.

You look:

```
git rev-parse <branch>
gh pr view <pr-number> --json headRefOid --jq .headRefOid
```

You should see the same long id twice. If so, have Claude run `git branch -D <branch>`, which deletes it anyway. If not, don't delete it. Have Claude show what differs. A commit the pull request lacks goes on a fresh branch with its own pull request. No such commit? Then `-D` is safe.

**`git worktree remove` says `contains modified or untracked files`.** Only a clean worktree can be removed: no new files you haven't committed, and no uncommitted changes. In that folder, run `git status` yourself to see what's left, before anyone reaches for `--force`, which removes it anyway.

**`git worktree remove` says `locked`.** A `claude -w` session locks its worktree while it runs, and one `--force` won't get past that. Don't force it twice. Exit the session, and choose remove if asked. Terminal closed without exiting? Have Claude run `git worktree unlock <worktree-folder>` first.

**A later pull request shows commits you already merged.** You kept working on the branch after squashing it, so later pull requests can include those commits. A **conflict** (two changes git can't combine by itself) gets more likely too. So start each change on a fresh branch. You'll meet conflicts again in [When it goes wrong](/learn/undo-and-conflicts).

```checkpoint quick-12
You squashed a branch, and now have more work. Where does it go?
- [x] On a fresh branch.
- [ ] On the same branch.
- [ ] Straight on `main`.
Why: Later pull requests from the same branch can include commits you already merged. So start each change on a fresh branch.
```

**#57 says `CLOSED`.** Its owner may have closed it since. The sub-issue counts still show all 19 closed.

### Read more

- [Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges), GitHub Docs, read 2026-10-29
- [Closing an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/closing-an-issue), GitHub Docs, read 2026-11-05
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs, read 2026-10-29
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs, read 2026-11-05
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub, read 2026-11-05
- [gh issue close](https://cli.github.com/manual/gh_issue_close), GitHub, read 2026-11-05
- [git branch](https://git-scm.com/docs/git-branch), The Git project, read 2026-11-05
- [git worktree](https://git-scm.com/docs/git-worktree), The Git project, read 2026-10-29
- [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees), Claude Code docs, read 2026-10-30
- [Home on every visit, sign in where you meant to go, and Sign out (#77)](https://github.com/SiddharthMuramkar/finance-agent/pull/89), SiddharthMuramkar, 2026-11-03
- [Small leftovers from the tutor lanes](https://github.com/SiddharthMuramkar/finance-agent/pull/306), SiddharthMuramkar, 2026-11-04
- [Insight-led Topics: a smarter, more intuitive Tutor, piloted on present value](https://github.com/SiddharthMuramkar/finance-agent/issues/57), SiddharthMuramkar, 2026-11-03

## Remember

```flashcards
Q: Which merge is your default, and when do you use another?
A: Squash and merge. Use a merge commit when each commit must stay in the history, and rebase when your team wants a straight-line history.

Q: How do you confirm an Issue closed after a merge?
A: Run `gh issue view` with its number and `--json state`, and look for `"state": "CLOSED"`.

Q: An Issue stays open after a merge. What three things do you check on the pull request?
A: It says `Merged`, it says `into main`, and its body says `Closes` with the Issue's number.

Q: You've decided against an Issue. How do you close it?
A: Have Claude post a comment saying why, then close it as not planned.

Q: Every sub-issue of a Spec has closed. How does the Spec itself close?
A: Through its own `Closes` line in a merged pull request, or by hand. Closing its sub-issues doesn't close it.

Q: What's on your cleanup list after a merge?
A: Delete the branch, pull `main`, and remove the worktree if you made one.

Q: Why does `git branch -d` say `not fully merged` after a squash merge?
A: `main` holds one new commit, so git can't find your branch's own commits there. Check your branch's last commit matches the pull request's `headRefOid`, then use `git branch -D`.

Q: `gh issue view` with `--json state` prints `"state": "MERGED"`. What went wrong?
A: You gave it your pull request's number. Issues and pull requests share one set of numbers, so use the Issue's.
```

## Final test

```final-test merging-and-cleaning-up-which-merge
Your pull request holds one fix in five small commits, on a branch you made this morning. Nobody needs those commits later. Which merge do you ask for?
- [x] Squash and merge, because one change on a short-lived branch suits one commit on `main`.
- [ ] A merge commit, because every pull request has to keep each of its commits on `main`.
- [ ] Rebase and merge, because a squash is refused on any branch with more than one commit.
- [ ] Any of the three, because they all leave exactly the same history on `main`.
Why: Squash and merge combines the commits into one, which suits one change on a short-lived branch. A merge commit is for when each commit must stay in the history, and rebase is for a team that wants a straight-line history.
```

```final-test merging-and-cleaning-up-stays-open
A pull request merged into `main`, and its Issue still says `OPEN`. Its body never says `Closes`. The work is finished. What do you do?
- [x] Have Claude close the Issue by hand, with a comment naming the pull request.
- [ ] Wait a while, because GitHub closes every Issue a merged pull request worked on.
- [ ] Have Claude undo the pull request, because an open Issue means the merge failed.
- [ ] Have Claude merge the pull request again, so that GitHub reads its body a second time.
Why: With no `Closes` in its body, the pull request gave GitHub nothing to close. The merge itself worked, and the work is on `main`. So close the Issue by hand, with a comment naming the pull request.
```

```final-test merging-and-cleaning-up-spec-stays-open
The last sub-issue of your Spec has closed. No pull request says `Closes` with the Spec's number. What happens to the Spec?
- [x] It stays open. A merged pull request's `Closes` line would close it, or you can close it by hand.
- [ ] It closes by itself, because GitHub closes a parent when its last sub-issue closes.
- [ ] It closes when you next pull `main`, because pulling is what updates an Issue's state.
- [ ] Its sub-issues reopen, because a parent can't stay open once all of them have closed.
Why: Closing every sub-issue doesn't close their Spec. A Spec with all its sub-issues closed can still say `OPEN`. So give it its own `Closes` line in the last pull request, or close it by hand.
```

```final-test merging-and-cleaning-up-deeper-after-a
You squash-merged a branch yesterday. Today you want to add to the same work, and the old branch is still on your machine. Where does the new work go?
- [x] On a fresh branch, because a later pull request from the old one can include the squashed commits.
- [ ] On the old branch, because a squash merge removes its commits, so nothing can come back.
- [ ] On the old branch, because git refuses a new branch until an older one has been deleted.
- [ ] Straight on `main`, because a squash merge turns off pull requests for that piece of work.
Why: Squash merging works best for short-lived branches. Keep working on the same branch and later pull requests can include commits already squashed into `main`, which makes conflicts more likely. So start a fresh branch.
```

```sources
- [Finish v2: land the last eight Tickets and bring the site back up](https://github.com/SiddharthMuramkar/skills/pull/91), SiddharthMuramkar, 2026-10-30
- [Home on every visit, sign in where you meant to go, and Sign out (#77)](https://github.com/SiddharthMuramkar/finance-agent/pull/89), SiddharthMuramkar, 2026-11-03
- [Run parallel sessions with worktrees (Claude Code Docs)](https://code.claude.com/docs/en/worktrees), Anthropic
- [Git - git-push Documentation](https://git-scm.com/docs/git-push), The Git project
- [Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub CLI manual
- [The site follows the Mac by default, and the header menu picks any of the four Themes](https://github.com/SiddharthMuramkar/finance-agent/pull/305), SiddharthMuramkar, 2026-11-04
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [Small leftovers from the tutor lanes](https://github.com/SiddharthMuramkar/finance-agent/pull/306), SiddharthMuramkar, 2026-11-04
- [Go-live: model sweep, 50-turn replay and production switches](https://github.com/SiddharthMuramkar/finance-agent/issues/248), SiddharthMuramkar, 2026-11-04
- [Closing an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/closing-an-issue), GitHub Docs
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [gh issue close](https://cli.github.com/manual/gh_issue_close), GitHub CLI manual
- [Insight-led Topics: a smarter, more intuitive Tutor, piloted on present value](https://github.com/SiddharthMuramkar/finance-agent/issues/57), SiddharthMuramkar, 2026-11-03
- [v2 Spec: planning docs (the brief, ADR 0006, the Glossary words, the research notes)](https://github.com/SiddharthMuramkar/skills/pull/73), SiddharthMuramkar, 2026-10-30
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [Git - git-pull Documentation](https://git-scm.com/docs/git-pull), The Git project
- [Commands (Claude Code Docs)](https://code.claude.com/docs/en/commands), Anthropic
- [finance-agent/vercel.json](https://github.com/SiddharthMuramkar/finance-agent/blob/main/vercel.json), SiddharthMuramkar
- [git-worktree](https://git-scm.com/docs/git-worktree)
- [Git - git-branch Documentation](https://git-scm.com/docs/git-branch), The Git project
- [cli/pkg/cmd/pr/merge/merge.go at v2.97.0](https://github.com/cli/cli/blob/v2.97.0/pkg/cmd/pr/merge/merge.go), The GitHub CLI project
- [Git - git-switch Documentation](https://git-scm.com/docs/git-switch), The Git project
- [gh issue view](https://cli.github.com/manual/gh_issue_view), GitHub CLI manual
- [Merge conflicts](https://docs.github.com/en/pull-requests/reference/merge-conflicts), GitHub Docs
```
