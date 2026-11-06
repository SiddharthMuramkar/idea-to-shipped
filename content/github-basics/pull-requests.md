---
title: Opening a pull request
slug: pull-requests
summary: Read every part of a PR page, say what the merge box is telling you and what should happen next, and choose how a PR lands on main.
---

On 27 October, Care4Mind’s PR #3 carried 33 files, three commits and ten answered research tickets. It was merged 64 seconds after it was opened, with no review and no checks. For planning documents, that was a fair call. Once agents start opening PRs full of code, this page becomes your review desk. It’s the one place that shows what the agent changed, what checked it, and exactly what will land on `main`.

```goals
- You’ll be able to read every part of a PR page, say what the merge box is telling you and what should happen next, and choose how a PR lands on `main`. You’ll also know why your repos squash, and how a PR should close its ticket on Care4Mind.
```

## A request to merge, kept on GitHub

A **pull request** (PR) asks GitHub to fold one branch into another. The branch with the new work is the **head branch**. The branch it should land on is the **base branch**, which is `main` unless someone picks another. PR #3 asked to merge `plan/rebuild-map` (head) into `main` (base).

What a PR shows you is a comparison. GitHub finds the commit where the head branch split off from the base, called the **merge base**, and shows everything the head branch has added since. So a PR shows what its branch brings, not every difference between the two branches. If other PRs land on `main` after the agent made its branch, their changes don’t appear in this PR’s diff. PR #3’s branch split off at `902f64f`, PR #2’s commit, and nothing else had landed since, so its comparison was simple.

A PR is a GitHub thing, not a git thing. Git stores branches and commits. The PR’s title, description, conversation and reviews are stored on GitHub. You can see the split on Care4Mind. PR #3’s description has a Summary, an Evidence section and a Merge Danger section. The commit it put on `main`, `0cf9076`, holds none of that: its message is just the three commit messages, listed one after another.

A PR can also be opened as a **draft**. A draft shows the work and its diff, but it can’t be merged until someone marks it ready for review, with the **Ready for review** button in the **merge box** (the panel at the foot of the PR page that says whether it can merge) or `gh pr ready`. That suits agents. An agent can open a draft as soon as it has pushed, so its checks start and you can follow along, while the merge stays locked until you decide.

```callout remember
A PR is a request, stored on GitHub, to merge a head branch into a base branch. It shows only what the head branch adds since they split. Its description and reviews live on GitHub, not in git.
```

```checkpoint check-1
PR #3 has been merged. Where can you still read its Merge Danger section?
- [x] On PR #3’s GitHub page
- [ ] In commit `0cf9076`’s message body
- [ ] In the rebuild map file
- [ ] In git’s stored branch names
Why: The description lives on GitHub. Care4Mind’s squash commit `0cf9076` holds the three commit messages, not the PR body, and branch names carry no text at all.
```

```checkpoint check-2
Your agent has pushed its branch but isn’t finished. You want the PR and its checks visible, with merging locked. What do you ask for?
- [ ] A merge into main now
- [ ] A new branch from main
- [x] A PR marked as draft
- [ ] A local commit, not pushed
Why: A draft can’t be merged until it’s marked ready for review, but it’s a real PR: you can read it and follow its checks. A merge now is the opposite of what you want.
```

```checkpoint check-3
`main` gained two commits from other PRs after the agent made its branch. Do their changes show in this PR’s Files changed?
- [ ] Yes: it shows every difference from main
- [x] No: it shows what the branch adds
- [ ] Yes: but only once it is merged
- [ ] No: GitHub hides all of main’s commits
Why: A PR compares from the merge base, where the branch split off, so it shows only what the branch introduces. `main`’s commits aren’t hidden; they just aren’t part of this PR.
```

## Reading the PR page

A PR page has four main tabs, with the merge box at the bottom of the first. Here’s what each tab shows, what you check there as the supervisor, and what PR #3 held. A fifth tab, **Findings**, shows automated code-review results such as code scanning. Care4Mind has none switched on.

| Tab | Shows | You check | On PR #3 |
|---|---|---|---|
| **Conversation** | The description, a timeline of events, comments and reviews. The merge box sits at the bottom. | Does the description match the ticket? | A `/pr`-style body. No comments, no reviews. |
| **Commits** | How the branch changed over time, one commit at a time | Does the story make sense? (Lesson 7 covers reading a commit.) | 3 commits: “Chart the rebuild planning map”, “Record the ten research answers on the rebuild map”, “Ask the client for the KarmaYoga quiz’s scoring settings” |
| **Checks** | Automated tests, builds and other validations | Did every required check pass? | None. Care4Mind has no CI yet. |
| **Files changed** | The diff: what `main` would gain | Does it match the description, and only the description? | 33 files, +1,227 −9. Added: 29 ticket files, `map.md` and ADR-0002. Edited: the project brief and `current-site.md`. |

**Files changed** is where the real review happens. Read it one file at a time. When you’ve read a file, tick **Viewed** and it folds away. If the agent later pushes a change to that file, the tick clears itself, so after a fix you reread only what moved. You can also comment on a single line or on a range of lines. Those comments stay _pending_, visible only to you, until you submit them as a review.

A review ends with one of three decisions. **Comment** leaves feedback without a verdict. **Approve** says the PR is ready to merge. **Request changes** says something must be fixed first. Two rules matter when you work alone. First, you can’t approve your own PR, and your agents’ PRs _are_ your own: agents open them with your `gh` login, which is why PR #3’s author is `SiddharthMuramkar`. That’s why this course’s **ruleset** (a set of rules GitHub enforces on matching branches) requires a PR but zero approvals. Requiring one approval would block every PR you open. Second, Request changes blocks nothing on its own unless a ruleset requires a PR. With agents, sending work back usually just means telling the agent in the terminal.

So read a PR in this order. First the description, which is the agent’s claim. Then Files changed, which is the evidence. Then Checks, which say what verified it. Then the merge box. PR #3 went from opened to merged in 64 seconds. For planning documents, a two-way door as its own body said, that was reasonable. For code an agent wrote alone, those seconds are where your review goes.

```callout remember
Read a PR in this order: the description (the claim), Files changed (the evidence), Checks (what verified it), then the merge box. You can’t approve your own PRs, and your agents’ PRs are yours.
```

```checkpoint check-4
You ticked “Viewed” on `map.md`. Then the agent pushed a fix to that file. What happens?
- [ ] The tick stays, file hidden
- [ ] The PR is closed again
- [x] The file is unticked again
- [ ] The review is submitted now
Why: GitHub clears the Viewed tick when a file changes after you viewed it, so you reread only what moved. Nothing closes or submits on its own.
```

```checkpoint check-5
Your agent opened a PR with your `gh` login. Why can’t you approve it?
- [ ] Approve needs a passing check first
- [ ] Drafts can never receive any approval
- [ ] Only the base branch can approve
- [x] Authors can’t approve their own PRs
Why: GitHub: “Pull request authors cannot approve their own pull requests.” Your agents open PRs as you, as PR #3’s author shows. That’s why the course’s ruleset asks for zero approvals.
```

```checkpoint check-6
Where do you check whether the agent touched files the ticket never mentioned?
- [ ] In the PR description
- [x] In the full diff
- [ ] In the check results
- [ ] In the commit list
Why: Files changed shows the full diff of what the PR brings. The description is only the agent’s claim, checks show only what was tested, and a list of commit titles can hide a stray file.
```

## The merge box: what it’s telling you

The merge box sits at the bottom of the Conversation tab. It answers one question: can this PR merge right now, and if not, what’s in the way? The same status shows in the PR’s header.

Start with the checks. A **check** is the pass/fail result one CI job reports on a commit. Brad Traversy’s CI/CD video shows the three states you’ll see. Yellow means the check is still running or waiting in the queue. A red ✗ means it failed. A green ✓ means it passed. When a ruleset requires a check, that check becomes a **gate**, an automatic check that blocks the next step: the merge button stays locked until it passes.

| You see | It means | What happens next |
|---|---|---|
| A yellow check | Still running, or queued | Wait. Your agent can run `gh pr checks --watch`. |
| A red ✗ | The check failed | The agent reads the log, fixes the problem on the same branch and pushes. The PR updates and the checks run again. |
| A green ✓ on every check | Everything required passed | Merge, once the diff matches the ticket. |
| Conflicts | The branch and `main` changed the same lines | The merge button stays off until they’re resolved (Lesson 9). |
| “Waiting for status to be reported” | A required check never ran | Fix the workflow, not the code. Often the job was renamed, or its workflow didn’t run. |
| Out of date with `main` | `main` moved on after the branch split off | Blocks only if the ruleset is strict (below). |

Two rows deserve a closer look. A **merge conflict** means the branch and `main` changed the same lines, or one deleted a file the other edited, so git can’t choose between them. GitHub switches the merge button off until someone resolves it, and [Lesson 9](/learn/undo-and-conflicts) covers how. “Waiting for status to be reported” is quieter and easier to misread. Rulesets require a check _by its job name_. If an agent renames the job, nothing reports under the old name again, and the PR waits for ever. When you see it, look at the workflow file before the code.

The merge box also enforces rulesets. On this course’s repo, the “Protect main” ruleset requires a PR, requires the `check` check to pass, and allows only squash merges. Its bypass list is empty, so not even you, the owner, can merge around a red ✗ without editing the ruleset or switching it off. Switching it off is what Brad did in his video to push a failing PR through on purpose. Care4Mind has no ruleset, and no CI on `main` yet: the front-end branch’s workflow has never run (checked 27 October), so its merge box lets anything through. Setting up rulesets is [Lesson 12](/learn/gates).

Last, “out of date”. While the agent worked, other PRs may have landed on `main`. A ruleset can be **strict**, meaning the branch must include the latest `main` before it merges, or **loose**, meaning it needn’t. Loose saves reruns, but GitHub names the risk: checks that passed against the older `main` may fail once the two are combined. The **Update branch** button brings `main`’s new commits into the PR’s branch, and the checks run again. You won’t usually see it on your repos. It appears only when the ruleset is strict or the setting “Always suggest updating pull request branches” is on, and on 27 October neither was true for either repo.

```callout remember
Yellow: wait. Red ✗: the agent fixes it on the same branch. Green on every check, no conflicts, and a diff that matches the ticket: merge. A required check that never reports blocks you just like a failure, and the fix is in the workflow.
```

```checkpoint check-7
On the course repo, the agent renamed the CI job from `check` to `verify`. The merge box now says “Waiting for status to be reported”. Why?
- [ ] GitHub is queueing the renamed job
- [ ] Renamed jobs always take ten minutes
- [x] The ruleset requires the name `check`
- [ ] The branch is out of date
Why: Rulesets require a check by its job name. Nothing reports a check called `check` any more, so the gate waits for ever. Fix the workflow, not the code.
```

```checkpoint check-8
A required check shows a red ✗ on your agent’s PR. What should happen next?
- [ ] You turn the ruleset off and merge
- [ ] Agent opens a second PR from main
- [ ] You wait for it to turn green
- [x] Agent fixes it on the same branch
Why: A push to the same branch updates the PR, and the checks run again, as in Brad’s gist. A finished failure won’t turn green by waiting, and switching the gate off is exactly what the gate is there to prevent.
```

```checkpoint check-9
`main` moved on after your agent branched, and the course repo’s ruleset is loose. What’s the risk if you merge now?
- [x] Checks passed against an older main
- [ ] GitHub will refuse the squash merge
- [ ] `main`’s new commits will be lost
- [ ] The PR reopens as a draft
Why: Loose means the branch needn’t include the latest `main`. GitHub warns that checks “may fail after you merge” if the two clash. Nothing is lost, and nothing is refused.
```

## Three ways to land a PR

When the box is clear, the merge button offers up to three methods. All three put the same files on `main`. They differ in which commits `main` gets. Here they are, applied to PR #3’s three commits, `9fa719b`, `aa10e4e` and `154c9c6`:

| Method | What `main` gets | For PR #3 |
|---|---|---|
| **Create a merge commit** | Every branch commit, unchanged, plus one extra merge commit that joins the two lines of history | The three original commits, plus a fourth: the merge commit |
| **Squash and merge** | One brand-new commit holding all the changes | One commit, `0cf9076`. This is what really happened. |
| **Rebase and merge** | Each branch commit copied onto `main`, one by one, with new IDs | Three new commits with the same messages and new IDs |

Brad’s gist uses the merge commit. Each time, he merges with **Create a merge commit**, pulls `main`, and deletes his branch with the safe `git branch -d`. That works for him because a merge commit makes the branch’s own commits part of `main`’s history. After a squash they never are, which is exactly why `-d` refused your leftovers in [Lesson 6](/learn/branches-and-worktrees).

A squash commit needs a message, and the repo’s settings decide the default. Care4Mind uses GitHub’s default. A one-commit PR gets that commit’s title and message; a PR with two or more commits gets the PR’s title and a list of its commits. PRs #1, #2 and #4 had one commit each. PR #3 had three, so `0cf9076` is titled “Chart the rebuild planning map and record the research (#3)”, the PR’s title plus its number, and its body lists the three commit messages. This course’s repo is set differently, to PR title plus PR description. There, the PR body becomes the commit message on `main`.

Squash suits agent work. Agents commit often: every `/implement` run ends in a commit, and a failed check or a review note adds “fix” commits on top. On the branch, those small commits are useful. On `main`, you want one commit per ticket, titled by its PR. GitHub’s own advice matches: squash when a PR is one logical change with many small fix-up commits. It also keeps undo simple. One PR is one commit, so taking a ticket back out means reverting one commit. GitHub’s **Revert** button on a merged PR opens a new PR that does it ([Lesson 9](/learn/undo-and-conflicts)).

Squash has two costs. `main` loses the branch’s separate commits, with their times and authors; only the PR page still shows them. And git sees the branch as unmerged, so it lingers until the [Lesson 6](/learn/branches-and-worktrees) sweep. A rule follows: once a branch is squash-merged, it’s finished, and new work starts on a new branch. Rebase and merge doesn’t escape this. GitHub gives every copied commit a new ID, so the branch looks unmerged there too.

A repo can allow just one method. This course’s repo allows only squash, twice over: in its settings, and in its ruleset. Care4Mind still allows all three (checked 27 October). Until that changes, name the method whenever you ask an agent to merge there.

```callout remember
Squash puts one new commit per PR on `main`, titled from the PR. That’s what you want when agents make many small commits. The price is the leftover branch from Lesson 6. The course repo allows only squash; Care4Mind allows all three, so say “squash” out loud.
```

```checkpoint check-10
An agent’s PR has five commits: the work and four “fix the check” commits. With squash and merge, how many new commits land on `main`?
- [ ] Five
- [ ] Six
- [x] One
- [ ] Four
Why: Squash combines every commit in the PR into one new commit. A merge commit would add six (the five plus the merge commit), and rebase would add five with new IDs.
```

```checkpoint check-11
Why does `git branch -d` work after Brad’s merges but refuse after yours?
- [ ] His branches were never pushed to GitHub
- [x] His merge commit keeps the branch’s commits
- [ ] Your repo turns on branch deletion protection
- [ ] Squash merges only run on private repos
Why: A merge commit makes the branch’s own commits part of `main`’s history, so `-d` sees them as merged. A squash writes a new commit instead, so the branch’s commits never join `main`.
```

```checkpoint check-12
Care4Mind allows all three merge methods. What should your merge request to the agent include?
- [ ] A request to rebase first
- [ ] Nothing; GitHub picks squash itself
- [ ] The `--admin` flag, skipping checks
- [x] The `--squash` flag, named explicitly
Why: With three methods allowed, the method is whatever the agent chooses unless you name it. `--admin` forces a merge past the requirements, which you never want from an agent.
```

## What the PR says: the body and the ticket

The PR body is where the agent tells you what it did and why it’s safe to merge. Matt’s `/pr` skill gives every body the same three sections, and PR #3 used them:

- **Summary**: the smallest picture that makes the point, such as a sketch of the file tree, a diff-shaped outline, a call tree or a diagram, with few words around it.
- **Evidence**: a Before and an After. A screenshot is best when the change is visible; test or console output comes next.
- **Merge Danger**: the **Door**, one-way (hard to undo) or two-way (easy to walk back), and the **Blast Radius**: what the change could affect if it’s wrong.

Here is part of PR #3’s body, as `gh pr view 3` prints it:

```diff
## Summary

Adds the planning map for the Care4Mind.org rebuild, with the ten research tickets answered.

 .scratch/rebuild/
+├── map.md              # destination, notes, Decisions so far, fog, out of scope
+└── issues/             # 29 tickets: 10 research (resolved), 12 grilling, 4 prototype, 3 task
…

## Merge Danger

**Door:** two-way

Planning documents only. A revert removes them cleanly.

**Blast Radius:** none

No code, no deploys, nothing touches the current site.
```

Read the body as the agent’s claim, then test it. Does the Summary match Files changed? Did the Evidence come from a real run, such as a check result or test output, or is it a sentence saying “tests pass”? Let Merge Danger set your pace. A two-way docs change can go quickly. A one-way door, such as a database change that deletes data, earns the slowest read you give.

A PR should also say which ticket it finishes. With GitHub Issues, a **closing keyword** does that. You write “Closes #12” (or fixes, resolves and their other forms) in the PR body. When the PR merges into the default branch, issue 12 closes by itself. On a PR into any other branch, the keywords are ignored.

Care4Mind doesn’t use GitHub Issues. Its tracker is local markdown: each ticket is a file under `.scratch/`, closed by editing its `Status:` line. So on Care4Mind, closing a ticket is part of the diff. PR #3 shows it: its diff set `Status: resolved` on all ten research tickets, and merging the PR is what closed them. “Closes #12” would do nothing there. On GitHub, issues and PRs share one set of numbers, so #12 can only ever mean issue or PR 12, never a file in `.scratch/`. Name the ticket by its path instead, and have the agent edit its status inside the same PR. As [Lesson 5](/learn/after-the-map) said, `/implement` stops at the commit and closes nothing, and how a finished build ticket is marked is still yours to settle.

This isn’t fixed for ever. `/setup-matt-pocock-skills` is the skill that set up your tracker. GitHub Issues is its default, local markdown is the supported alternative, and re-running it is how you’d switch. With GitHub Issues, closing keywords would do the closing at merge time. Nothing in this course needs that switch.

```callout remember
A `/pr` body has a Summary, Evidence and Merge Danger. Treat it as the agent’s claim and check it against the diff. On Care4Mind, a ticket closes because the PR edits its `Status:` line, not because of “Closes #N”.
```

```checkpoint check-13
A PR body says “Door: one-way”. What is it telling you?
- [ ] Only one reviewer may approve it
- [x] The change is hard to undo
- [ ] It changes exactly one file only
- [ ] It can merge only by squashing
Why: From the `/pr` skill: “You can walk back through two-way doors, but not one-way doors.” A one-way door earns your slowest read.
```

```checkpoint check-14
A Care4Mind PR body ends with “Closes #12”, meaning ticket `12-questionnaire-flow-prototype.md`. What happens to that ticket file when the PR merges?
- [ ] GitHub sets its Status line to resolved
- [ ] It closes, because the PR targets main
- [x] Nothing; the keywords can’t reach its file
- [ ] It closes once all checks have passed
Why: Closing keywords act on GitHub issue or PR number 12, never on files in `.scratch/`. The ticket closes only when the PR’s own diff changes its Status line, as PR #3 did for ten research tickets.
```

```checkpoint check-15
The agent’s Evidence section just says “Tests pass.” What do you ask for?
- [x] The test output, before and after
- [ ] A longer Summary with more prose
- [ ] A second PR holding the tests
- [ ] A one-way door in Merge Danger
Why: Evidence means a real Before and After: output from an actual run, or a screenshot for a visible change. A sentence saying tests pass is only another claim.
```

## From open to tidy: what your agent runs

Your agent drives all of this through `gh`, GitHub’s command-line tool. Here is the whole path, so you recognise each command when it shows up in the agent’s output.

| Step | Your agent runs | What it does |
|---|---|---|
| Open | `gh pr create --fill`, or `--draft` | Opens a PR from the current branch into the default branch. `--fill` takes the title and body from the commits; `--draft` opens it as a draft. For a `/pr` body, the agent passes the body with `--body-file` instead. |
| Ready | `gh pr ready` | Marks a draft ready for review |
| Read | `gh pr view`, `gh pr diff` | Prints the PR’s title, body and status; prints its diff |
| Wait | `gh pr checks --watch` | Watches the checks until they finish |
| Merge | `gh pr merge --squash --delete-branch` | Squash-merges, then deletes the branch on GitHub and on your computer |
| Tidy | `git pull`, `git fetch --prune`, `git branch -vv` | Brings the new commit onto `main`, forgets deleted GitHub branches, shows what’s left (Lesson 6) |

`--delete-branch` helps with the Lesson 6 leftovers. `gh` deletes your computer’s copy with the forced `git branch -D`, so a squash doesn’t stop it. It has one limit. Git refuses to delete a branch that another worktree has open, so for work in an Orca worktree the name stays until you archive that worktree. When that happens, `gh` reports an error even though the merge has already gone through, so check with `gh pr view` before assuming it failed. That’s your installed `gh`, 2.97.0. Since 2.99.0, `gh` first runs `git worktree remove` on that folder, which works if nothing in it is uncommitted, so after an upgrade a merge can delete the Orca worktree’s folder. `gh --version` shows which you have. Auto-delete is on in both repos, so GitHub removes its own copy either way. The routine after every merge stays the same: `git pull`, `git fetch --prune`, `git branch -vv`, and the sweep on the branches cheat sheet.

```callout remember
Your agent opens, waits and merges: `gh pr create`, `gh pr checks --watch`, `gh pr merge --squash --delete-branch`. You finish in `~/Desktop/project1`: `git pull`, `git fetch --prune`, `git branch -vv`, and the sweep.
```

```checkpoint check-16
With your installed `gh` 2.97.0, from `~/Desktop/project1`, your agent runs `gh pr merge 7 --squash --delete-branch`, but the branch is still open in an Orca worktree. What’s left over?
- [ ] The PR, still open and not merged
- [ ] The GitHub copy of the head branch
- [ ] Nothing at all; every copy is gone
- [x] The local branch name, until you archive
Why: The merge goes through, and GitHub’s auto-delete removes its copy. But git won’t delete a branch another worktree has open, so the local name stays and `gh` reports an error. Archiving the worktree clears it.
```

```checkpoint check-17
You want to hear the moment the checks on PR 7 finish. What does the agent run?
- [ ] `gh pr view 7 --web`
- [x] `gh pr checks 7 --watch`
- [ ] `gh pr diff 7 --web`
- [ ] `gh pr list --state all`
Why: `--watch` keeps `gh pr checks` running until the checks finish. The others open pages in the browser or list PRs.
```

## Tell your agent

Use these when an agent has finished a ticket on its own branch. The first opens the PR; the second merges it once you’ve read it.

```sh
Open a draft PR from this branch into main. Write the body with /pr
(Summary, Evidence, Merge Danger). Name the ticket it finishes by its
file path, and set that ticket’s Status line in this same PR. Then run
gh pr checks --watch and tell me each check’s result.
```

```sh
Squash-merge PR #N only if every check passed and there are no
conflicts. Mark it ready first if it’s still a draft, then run
gh pr merge N --squash --delete-branch. Then, in ~/Desktop/project1,
run git pull and git fetch --prune, show me git branch -vv, and list
any branch marked gone. Don’t delete anything yet.
```

## Try it

These only read; they change nothing. Run them in `~/Desktop/project1`:

```sh
gh pr list --state all
gh pr view 3
gh pr checks 3
gh api repos/SiddharthMuramkar/learn-matt-flow --jq '{allow_squash_merge, allow_merge_commit, allow_rebase_merge}'
```

You should see four PRs, all merged. PR #3’s header reads “Merged • SiddharthMuramkar wants to merge 3 commits into main from plan/rebuild-map”, then “+1227 -9 • No checks”, followed by its `/pr` body. (The “wants to merge” wording stays even after the merge.) `gh pr checks 3` answers “no checks reported on the 'plan/rebuild-map' branch”: Care4Mind has no CI yet. The last command asks about this course’s repo and should show squash allowed and the other two methods not. For a closer look, open PR #3 in your browser with `gh pr view 3 --web` and walk its four tabs with the table above.

## Practice

### Read the merge box

For each PR, pick what should happen next.

```checkpoint check-18
The `check` check is yellow. It started a minute ago.
- [x] Wait
- [ ] Send it back
- [ ] Merge it
Why: Yellow means running or queued. Let it finish; `gh pr checks --watch` tells you when.
```

```checkpoint check-19
`check` shows a red ✗: a broken link in the new lesson.
- [ ] Wait
- [x] Send it back
- [ ] Merge it
Why: A failed check goes back to the agent, which fixes it on the same branch and pushes.
```

```checkpoint check-20
Every check is green, there are no conflicts, and Files changed matches the `/pr` Summary.
- [ ] Wait
- [ ] Send it back
- [x] Merge it
Why: The gates passed, and the evidence matches the claim.
```

```checkpoint check-21
Every check is green, but Files changed also edits `.github/workflows/check.yml`, which the ticket never mentioned.
- [ ] Wait
- [x] Send it back
- [ ] Merge it
Why: Green checks don’t cover a change nobody asked for, least of all a change to the gate itself. Ask why, or ask for it in a PR of its own.
```

```checkpoint check-22
The merge box says the branch has conflicts with `main`.
- [ ] Wait
- [x] Send it back
- [ ] Merge it
Why: GitHub keeps the merge button off until conflicts are resolved. The agent resolves them (Lesson 9).
```

```checkpoint check-23
“Waiting for status to be reported” on `check`, ten minutes after the agent renamed a job.
- [ ] Wait
- [x] Send it back
- [ ] Merge it
Why: The required name no longer reports anything. The fix is in the workflow.
```

```checkpoint check-24
Merge Danger says “Door: two-way” and “Blast Radius: none”. The diff is three ticket files, and every check is green.
- [ ] Wait
- [ ] Send it back
- [x] Merge it
Why: Small, reversible and verified. Merge, then pull and prune.
```

## Check yourself

From memory, without scrolling up.

```final-test final-25
PR #3 had three commits and was squash-merged on Care4Mind. Where did commit `0cf9076`’s title come from?
- [ ] The first commit’s own title
- [ ] The head branch’s full name
- [x] The PR’s title, plus “(#3)”
- [ ] The /pr body’s Summary line
Why: Care4Mind uses GitHub’s default squash message: one commit gives that commit’s title; two or more give the PR’s title and a list of the commits. PR #3 had three.
```

```final-test final-26
Why does the course repo’s ruleset require zero approvals rather than one?
- [x] You can’t approve your own PRs
- [ ] Approvals slow the check job down
- [ ] Squash merges ignore all approvals anyway
- [ ] Drafts already count as one approval
Why: Authors can’t approve their own PRs, and your agents open PRs as you. One required approval would block every PR.
```

```final-test final-27
The merge box is blocked, and the only required check says “Waiting for status to be reported”. What do you look at first?
- [ ] The changed code’s diff
- [ ] The PR’s Merge Danger
- [ ] The PR’s reviewer list
- [x] The workflow’s job name
Why: A required check that never reports usually means the job was renamed or its workflow didn’t run. Rulesets match checks by job name, so start with the workflow.
```

```final-test final-28
Why squash-merge agent PRs?
- [ ] It keeps every work-in-progress commit on main
- [x] One commit per ticket, easy to revert
- [ ] It lets `git branch -d` work afterwards
- [ ] It skips the required checks on main
Why: Agents leave many small commits. Squash turns each PR into one commit on `main`, so one revert takes one ticket back out. It’s a merge commit, not a squash, that lets `-d` work.
```

```final-test final-29
An agent finished ticket 13 on Care4Mind. How should its PR close the ticket?
- [ ] Write “Closes #13” in the PR body
- [ ] Let `/implement` close it after the commit
- [x] Edit the ticket’s Status line inside it
- [ ] Close GitHub issue 13 after the merge
Why: Care4Mind’s tickets are files, closed by editing their Status line, so that edit goes in the same PR. Closing keywords only reach GitHub issues, and `/implement` stops at the commit.
```

## Read next

**Read:** [GitHub Docs, “Pull requests”](https://docs.github.com/en/pull-requests/reference/pull-requests) (it used to be called “About pull requests”), about five minutes. It names the tabs, drafts and the merge status in GitHub’s own words. Then [“About merge methods on GitHub”](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github), about five minutes, for the trade-offs of each method in one place.

Keep the Commits & PRs cheat sheet open the next time an agent hands you a PR.

```sources
- [GitHub Docs, Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests)
- [GitHub Docs, Branches](https://docs.github.com/en/pull-requests/reference/branches)
- [Changing the stage of a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request)
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Webhook events and payloads](https://docs.github.com/en/webhooks/webhook-events-and-payloads#pull_request)
- [GitHub Docs, Reviewing proposed changes in a pull request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request)
- [GitHub Docs, Pull request reviews](https://docs.github.com/en/pull-requests/reference/pull-request-reviews)
- [Brad Traversy, CI/CD crash course](https://www.youtube.com/watch?v=B7GM6F3BP6A)
- [GitHub Docs, Status checks](https://docs.github.com/en/pull-requests/reference/status-checks)
- [GitHub Docs, Merge conflicts](https://docs.github.com/en/pull-requests/reference/merge-conflicts)
- [Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- [Troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules)
- [GitHub Docs, About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Managing suggestions to update pull request branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-suggestions-to-update-pull-request-branches)
- [Keeping your pull request in sync with the base branch](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch)
- [GitHub Docs, Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
- [Brad Traversy’s gist](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e)
- [Configuring commit squashing](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)
- [Reverting a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/reverting-a-pull-request)
- [implement/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md)
- [About merge methods on GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github)
- [pr/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/pr/SKILL.md)
- [pr/CREDITS.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/pr/CREDITS.md)
- [GitHub Docs, Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [issue-tracker-github.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md)
- [setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md)
- [GitHub CLI manual](https://cli.github.com/manual/gh_pr)
- [git/client.go](https://github.com/cli/cli/blob/v2.97.0/git/client.go)
- [merge.go](https://github.com/cli/cli/blob/v2.97.0/pkg/cmd/pr/merge/merge.go)
- [release notes](https://github.com/cli/cli/releases/tag/v2.99.0)
- [merge.go, v2.103.3](https://github.com/cli/cli/blob/v2.103.3/pkg/cmd/pr/merge/merge.go)
```
