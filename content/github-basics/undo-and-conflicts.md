---
title: Undo and merge conflicts
slug: undo-and-conflicts
summary: Pick the right undo from where a mistake lives, explain why a commit on GitHub is undone with a new commit and never rewritten, read a merge conflict, and steer an agent through one.
---

On the morning of 26 October, two seconds before Care4Mind’s first push, its very first commit was rewritten: same files, new author email. That was safe, because nothing else had seen the commit yet. The same rewrite today would do real damage, because GitHub, four merged PRs and two Orca worktrees are all built on that commit. Which undo is safe comes down to one question: where does the mistake live?

```goals
- You’ll be able to pick the right undo from where a mistake lives, explain why a commit on GitHub is undone with a new commit and never rewritten, read a merge conflict, and steer an agent through one. You’ll also know when Matt’s `git-guardrails-claude-code` hook is worth installing.
```

## Where does the mistake live?

A mistake can live in Lesson 7’s three places, plus one more: the **working tree** (the files on disk), the **staging area** (what goes into the next commit), a **commit** on your computer, and **GitHub**, pushed and perhaps merged into `main`. Git has three undo commands with confusingly similar names, and each works on a different place. `git restore` puts files back and never moves a branch. `git reset` moves a branch’s label, which changes history. `git revert` adds a new commit that cancels an old one.

| Where the mistake lives | The undo (your agent runs it) | What happens |
|---|---|---|
| Edited, not staged (`git status` lists it under “Changes not staged for commit”) | `git restore <file>` | The file goes back to its last staged or committed version. The edit is gone for good. |
| Staged, not committed (“Changes to be committed”) | `git restore --staged <file>` | The file comes off the list for the next commit. The edit stays in the file. |
| Committed, not pushed, nothing built on it | `git commit --amend`, or `git reset --soft HEAD~1` | Amend replaces the last commit with a corrected one. `reset --soft` moves the branch back one commit and leaves that commit’s changes staged, ready to commit again. |
| Pushed, or merged into `main` | `git revert <commit>` | A new commit that undoes the old one. History is untouched. |
| A PR merged on GitHub | The **Revert** button on the PR | GitHub opens a new PR that undoes the merge. You merge it like any other PR. |

Read the table top to bottom as a ladder: the further a change has travelled, the gentler the undo has to be. The first rung is the only one that destroys work. An edit that was never staged or committed exists only in the file, so when `git restore` replaces the file, no copy remains anywhere. Anything committed can almost always be got back (next section).

The third rung is the first that rewrites. `--amend` doesn’t edit the last commit; it makes a new one and moves the branch label onto it. `HEAD~1` means “one commit before the one you have open”, and `git reset --soft HEAD~1` moves the label back there without touching your files or the staging area, so the undone commit’s changes sit staged. Care4Mind first used this rung on 26 October at 10:18: its first commit was amended to swap the author email for GitHub’s no-reply address, then pushed two seconds later. Same files, new ID: `691764b` became `c08fe71`. That was fine, because the old commit had never left your computer.

The last two rungs never rewrite. `git revert` adds a commit that does the opposite of the bad one, and both stay in the history. GitHub’s **Revert** button does the same through a PR, so the undo passes the same gates as any other change. Brad Traversy uses it in his CI/CD video (chapter “Render Gate Test”) to put `main` back after merging a PR whose checks failed. Thanks to squash merges, no commit on Care4Mind’s `main` is a merge commit (checked 27 October), and this course’s repo allows nothing else. So a plain `git revert` works on any of them, with none of the extra choices a merge commit needs.

```callout remember
Ask where the mistake lives before you choose the undo. A commit nothing else has seen you may replace; once it’s on GitHub, you only add a new commit that cancels it.
```

```checkpoint check-1
An agent ran `git add .` in `~/Desktop/project1` and staged `.env.local`, which holds a database password. Nothing is committed yet. What should it run?
- [ ] `git revert --no-edit HEAD`
- [ ] `git reset --soft HEAD~1`
- [x] `git restore --staged .env.local`
- [ ] `git commit --amend --no-edit`
Why: The mistake is in the staging area, so `restore --staged` takes the file off the list and leaves it on disk. The other three all act on commits: they would undo or rewrite PR #4’s commit, not unstage a file.
```

```checkpoint check-2
PR #5 on Care4Mind was squash-merged this morning, and its change to the home page is wrong. Which undo fits?
- [x] Click Revert on the PR
- [ ] Reset `main` back one commit
- [ ] Amend the commit on `main`
- [ ] Force-push the previous `main` commit
Why: It’s merged on GitHub, so you add an undo rather than rewrite. Revert opens a PR that cancels the squash commit, and that PR passes the same gates. Resetting, amending or force-pushing `main` would rewrite a commit everything after it is built on.
```

```checkpoint check-3
An agent’s last commit on its branch has a typo in the message. It hasn’t pushed, and nothing else is built on the branch. What do you ask for?
- [ ] `git revert HEAD`, then push
- [ ] `git reset --hard`, then push
- [ ] `git restore --staged`, then push
- [x] `git commit --amend`, then push
Why: The commit exists only on your computer and nothing depends on it, so it can be replaced: amend fixes the message. Revert would add a whole second commit for a typo, and `reset --hard` doesn’t touch the message at all; it throws away uncommitted edits.
```

## Never rewrite shared history

Amend, reset and rebase (replaying a branch’s commits on top of another branch; more below) all work the same way underneath. They never change a commit. They make similar new ones and move the branch label onto them, while anything built on the old commits still points at the old ones. Now two versions live side by side, and someone has to merge them back together. That’s where duplicate commits and needless conflicts come from. Pro Git’s rule fits on one line: don’t rewrite commits that exist outside your repository and that someone may have built on.

“Shared” means more than “pushed”, and your two Orca worktrees show why. On 27 October the `SiddharthMuramkar/content-v1` branch was created at `9ebb5ed`, a commit in the middle of `SiddharthMuramkar/frontend`, and both branches have added commits since. Neither has pushed `9ebb5ed`: content-v1 has no GitHub copy, and frontend’s GitHub copy stops below it. Yet if an agent in the frontend worktree rewrote `9ebb5ed`, say with a reset and fresh commits, content-v1 would still carry the old copy, and the next merge would have to reconcile two versions of the same work. So the test isn’t “is it on GitHub?” but “has anything else built on it?”

Getting rewritten commits onto GitHub takes a **force push**. A normal push only moves GitHub’s branch forward, to a commit that already contains everything the branch had; git calls that a **fast-forward**. A rewrite moves the branch sideways, and `git push` refuses unless forced. On this course’s repo, the ruleset “Protect main” includes **Block force pushes** (API name `non_fast_forward`) with no bypass list, so nobody can force-push `main`, you included. Care4Mind has no ruleset yet (checked 27 October), so nothing on GitHub would stop it there; [Lesson 12](/learn/gates) shows how to add one. And the rule covers only `main`: on PR branches the habit has to be yours, and your agent’s.

For mistakes on your own computer, git keeps a safety net: the **reflog** (reference log). Every time a branch label or `HEAD` (what the folder has open) moves, whether by a commit, a switch, a reset, an amend or a merge, git writes down where it was. If an agent’s reset or amend loses a commit, the commit isn’t deleted straight away: its ID is in the reflog, and a new branch on that ID brings it back. Your own reflog still lists `691764b`, the pre-amend first commit, although no branch contains it any more. Two limits. The reflog lives only on your computer. And it records commits, not edits: uncommitted work thrown away by `git restore` or `git reset --hard` was never in it.

```callout remember
Rewrite only what nothing else has seen. Once a commit is on GitHub, or another branch or worktree is built on it, undo it with a new commit. The reflog can rescue lost commits on your computer, never uncommitted edits.
```

```checkpoint check-4
An agent in the frontend worktree wants to rewrite `9ebb5ed` with a reset and fresh commits. That commit was never pushed, but `content-v1` is built on it. Is the rewrite safe?
- [ ] Yes, because it was never pushed anywhere
- [x] No, another branch is built on it
- [ ] Yes, the reflog makes it fully undoable
- [ ] Yes, as long as nobody force-pushes it
Why: Shared means anything else has built on it, not just GitHub. content-v1 would keep the old commit, and the next merge would have to reconcile both versions. The reflog keeps the old commit, but it can’t stop the two branches from drifting apart.
```

```checkpoint check-5
An agent ran `git reset --hard HEAD~3` on a branch that was never pushed, and three commits seem to be gone. What gets them back?
- [ ] Nothing; reset deletes commits for good
- [ ] GitHub’s Revert button on the branch
- [ ] `git restore` on every changed file
- [x] The reflog, then a new branch
Why: The commits still exist. The reflog shows where the branch was before the reset, and a new branch on that ID brings them back. Revert works on commits GitHub has, and restore works on files, not lost commits.
```

```checkpoint check-6
Why can’t anyone, you included, force-push `main` on this course’s repo?
- [x] The ruleset blocks force pushes
- [ ] Git refuses every force push
- [ ] Squash merges forbid force pushes
- [ ] Vercel rejects rewritten main commits
Why: “Protect main” includes Block force pushes (`non_fast_forward`) and has no bypass list. Git itself will force-push if asked; the block is GitHub’s.
```

## Merge conflicts: what they are and how to read one

A **merge** combines two branches. Git usually manages it alone, because the two sides changed different files or different lines. A **merge conflict** is the case it can’t settle: both branches changed the same lines in different ways, or one branch deleted a file that the other edited. Git won’t guess. It stops halfway, marks the spots, and waits for someone to decide. On GitHub, a PR with a conflict has its **Merge pull request** button switched off until that’s done.

With agents, you’ll meet conflicts in two places. The first is parallel worktrees. Each Orca agent works in its own folder, so they can’t trip over each other while they work, but their branches still have to come together on `main`. If two of them change the same lines, the second PR to merge gets the conflict. Care4Mind’s likeliest hot spot is the map, `.scratch/rebuild/map.md`. The frontend branch changes it, and every wayfinder session edits it too, often several at once.

The second is `/implement-spec`. It gives each ticket to an implementer subagent in its own worktree and branch, and a merger subagent folds each finished branch into one **integration branch**, where the whole spec comes together. The skill puts the conflict where it’s cheapest. Before reporting done, each implementer merges the integration branch’s latest commit into its own branch, so any conflict surfaces there, in its own worktree, while its ticket is fresh. The merger’s step should then be a fast-forward. That is Matt’s test of a healthy run: merges into the integration branch are fast-forwards, not conflict resolutions. As he puts it, worktrees don’t remove collisions; they postpone them to merge time.

A conflicted file looks like this. It’s an invented example, in the shape of your map:

```text
## Ticket 21: Design direction
<<<<<<< HEAD
Status: done. Press × Kolam chosen.
=======
Status: in progress. Three style tiles to compare.
>>>>>>> SiddharthMuramkar/frontend
```

Between `<<<<<<< HEAD` and `=======` is the version on the branch being merged _into_, the one the folder has open. Between `=======` and `>>>>>>>` is the version coming in, from the branch named after the arrows. Resolving takes four steps: choose one side, the other, or a version that combines both; delete all three marker lines; stage the file with `git add`, which tells git it’s resolved; then commit, which finishes the merge. If it turns into a mess, `git merge --abort` backs out to where things stood before the merge. A deleted-versus-edited conflict has no markers: `git status` says, for example, “deleted by us”, and the choice is to keep the file (`git add`) or delete it (`git rm`).

The agent can do all of that typing. What it can’t know is which version is right. That’s a product decision: in the example, only you know whether ticket 21 is done. So have the agent show you each conflict and the resolution it proposes before it commits. Then two safeguards. `git diff --check`, run before staging, warns about any marker left behind. And the tests must run after the merge, because two changes that merge cleanly as text can still break each other as code.

```callout remember
A conflict is git asking a question it can’t answer: which version is right? Let the agent do the editing, but make it show you each answer, leave no markers behind, and run the tests before it commits.
```

```checkpoint check-7
Two Orca agents worked in separate worktrees. Both of their PRs change the same lines of the “Decisions so far” list in `map.md`. PR A merges first. What happens to PR B?
- [ ] Git keeps whichever change is newer
- [ ] GitHub merges both lines in automatically
- [x] It shows a conflict to resolve
- [ ] Worktrees stop this from ever happening
Why: Same lines, changed differently on two branches: git won’t guess, so PR B’s merge button stays off until someone resolves it. Worktrees keep agents apart only while they work; the collision waits for merge time.
```

```checkpoint check-8
In a healthy `/implement-spec` run, where does a conflict between two tickets get resolved?
- [ ] By the merger, on the integration branch
- [x] By the implementer, in its own worktree
- [ ] By you, in GitHub’s web conflict editor
- [ ] By code-review, once every ticket has landed
Why: Each implementer merges the integration branch’s tip into its own branch before reporting done, so the conflict surfaces there, and the merger’s step is a fast-forward. Matt’s test: merges into the integration branch are fast-forwards, not conflict resolutions.
```

## Bringing a PR up to date

Lesson 8 showed how a PR’s branch falls **behind** when other PRs land on `main`, and why that matters under a loose ruleset like this course’s. The checks ran against an old `main`, so they can pass on the PR, then fail on `main` when the two sets of changes first meet. So when `main` has moved, update the branch before you merge, and let `check` run again. The question here is how.

There are two ways to update. **Merge** `main` into the branch: the branch gains one merge commit, and nothing is rewritten. Or **rebase** the branch onto `main`: git replays the branch’s commits one at a time on top of the new `main`. That gives a straight line, but every one of those commits is replaced by a new copy, so it’s a rewrite and the last section’s rule applies: rebase only a branch no other person, worktree or agent is using. The rewritten branch then has to be force-pushed to reach its PR.

On a squash-merge repo, choose merge. When the PR lands, everything on its branch, extra merge commits included, is squashed into one new commit on `main`. So `main` gets the same single commit whichever way you updated. A rebase would buy a tidier branch that is about to be deleted, at the price of a rewrite.

GitHub’s **Update branch** button merges, and its dropdown offers **Update with rebase**. But as Lesson 8 noted, it appears only when the ruleset is strict or “Always suggest updating pull request branches” is on, and neither was true on either of your repos on 27 October. Turn the setting on (Settings, under Pull Requests), or ask the agent to merge `main` into the branch and push. If the update hits a conflict, GitHub’s **Resolve conflicts** editor handles simple same-line conflicts in the browser; anything harder goes back to the agent.

```callout remember
Update a PR by merging `main` into its branch: nothing is rewritten, and the squash merge hides the extra commit. Rebase only a branch that no person, worktree or agent is using.
```

```checkpoint check-9
Your PR’s checks passed on Monday. Two other PRs merged into `main` on Tuesday, and the ruleset doesn’t require up-to-date branches. What’s the risk if you merge now?
- [ ] GitHub blocks the merge outright
- [ ] The squash commit loses changes
- [ ] The PR branch gets force-pushed
- [x] `check` may fail on `main`
Why: The checks ran against Monday’s `main`. With the loose setting nothing forces an update, so an incompatibility can surface only after the merge. Update the branch first and let `check` run again.
```

```checkpoint check-10
An agent wants to rebase `SiddharthMuramkar/frontend` onto `main` to update its PR. Another worktree has a branch built on top of frontend. What do you ask for instead?
- [ ] Rebase it, then force-push it
- [x] Merge `main` into the branch
- [ ] Squash the branch before rebasing
- [ ] Delete the other worktree first
Why: A rebase replaces frontend’s commits and strands the branch built on top of them. Merging `main` in rewrites nothing, and the squash merge keeps the extra commit off `main`.
```

## Prevention, and a hook for the worst commands

Most conflicts are prevented upstream, in how the work is cut. Keep PRs small, so each one touches few files. Keep branches short-lived: merge soon, then start fresh. Cut tickets so that two running at the same time don’t touch the same file. When they must, Matt’s advice for `/implement-spec` is to add a blocking edge so they run one after the other, or to fix in the exploration notes the exact names each ticket will add. And when a branch has to live long, like the front-end branch, with more than 100 changed files, merge `main` into it after every PR that lands, so each conflict stays small.

Prevention covers conflicts. For destructive commands there’s Matt’s `git-guardrails-claude-code` skill. It installs a Claude Code **hook**: a script that Claude Code runs automatically at a set moment. This one runs before every shell command the agent tries (the `PreToolUse` event, on the `Bash` tool). It reads the command, and if the command matches its list, it exits with code 2. Claude Code then refuses to run the command and shows the agent the script’s message, which ends “The user has prevented you from doing this.” The list:

- `git push`, every kind, forced or not
- `git reset --hard`
- `git clean -f` and `git clean -fd`, which delete files git doesn’t track
- `git branch -D`
- `git checkout .` and `git restore .`, which throw away every unstaged edit

Two things make this stronger than writing “never force-push” in a prompt or in `CLAUDE.md`. Claude Code enforces it, not the model, so it holds even when the agent is sure it knows better. And a blocking hook runs before Claude Code’s permission rules, so it still blocks after you’ve allowed every shell command to run without asking, which is how AFK runs (the agent working unattended) are usually set up. It also fires inside subagents, so it covers every `/implement-spec` implementer.

It’s a blunt tool, because it matches text. It blocks the ordinary `git push` an agent needs to open a PR, `git branch -D` from your Lesson 6 clean-up routine, and even `git restore .env.local`, which starts with `git restore .`. You run those yourself, or drop the pattern when the skill asks. If you drop `git push`, add one for `git push -f`: the separate `push --force` pattern catches only that spelling. The targeted undos still work: amend, `reset --soft`, `restore --staged`. So does `git rebase`, so a local rewrite like the `9ebb5ed` one is still yours to forbid in the prompt.

Is it worth installing? In a HITL session (human-in-the-loop: you watch and steer) where you approve each command as it comes, you already do the hook’s job. It earns its place when nobody reads commands before they run: AFK runs, and long `/implement-spec` runs with many subagents at once. Install it for Care4Mind only, before the first of those. The two protections cover different ground: a ruleset guards `main` on GitHub, and this hook guards the files on your disk, which no ruleset can see.

```callout remember
Small, short-lived branches that don’t share files prevent most conflicts. The ruleset guards `main` on GitHub; Matt’s hook guards your disk by stopping the agent before a destructive command runs.
```

```checkpoint check-11
Two frontier tickets in an `/implement-spec` run will both add entries to `src/config/site.ts`. What does Matt suggest?
- [ ] Let the merger subagent sort it
- [ ] Run both, then rebase the loser
- [x] Add a blocking edge between them
- [ ] Give both tickets the same worktree
Why: A blocking edge makes them run one after the other, so the second starts from the first one’s work. (His other option: fix the exact names in the exploration notes.) Leaving it to the merge is the collision he warns about, and one worktree can show only one branch.
```

```checkpoint check-12
With `git-guardrails-claude-code` installed, an implementer subagent runs `git push -u origin ticket-3`. What happens?
- [x] The hook blocks it before it runs
- [ ] It runs, because subagents skip all hooks
- [ ] It runs, because the push isn’t forced
- [ ] GitHub’s ruleset rejects it after it arrives
Why: The list blocks every `git push`, forced or not, and hooks from settings files also run inside subagents. If you want agents to push their own branches, drop that pattern and add one for `git push -f`, which the separate `push --force` pattern misses.
```

## Practice

### Sort the mistake

For each mistake on Care4Mind, pick the undo your agent should run.

```checkpoint check-13
An agent rewrote `src/app/page.tsx` in the wrong worktree. Nothing is staged, and you want the old file back.
- [x] `restore`
- [ ] `restore --staged`
- [ ] `amend` or `reset --soft`
- [ ] `revert`
Why: Unstaged edits live only in the file. `git restore` puts it back, and the agent’s edit is gone for good, which is what you want here.
```

```checkpoint check-14
`git add .` picked up `.env.local`. Nothing is committed.
- [ ] `restore`
- [x] `restore --staged`
- [ ] `amend` or `reset --soft`
- [ ] `revert`
Why: Staged, not committed: `restore --staged` takes it off the list and leaves the file alone.
```

```checkpoint check-15
PR #5 was squash-merged this morning and broke the questionnaire page.
- [ ] `restore`
- [ ] `restore --staged`
- [ ] `amend` or `reset --soft`
- [x] `revert`
Why: Merged on GitHub: the Revert button (or `git revert` on its commit) adds a commit that undoes it, through a PR that passes the same gates.
```

```checkpoint check-16
The agent’s last commit, on a branch it hasn’t pushed and nothing is built on, left out `tests/unit/kolam.test.ts`.
- [ ] `restore`
- [ ] `restore --staged`
- [x] `amend` or `reset --soft`
- [ ] `revert`
Why: Local and unshared: stage the missing file and `git commit --amend` folds it into the same commit.
```

```checkpoint check-17
A commit on `SiddharthMuramkar/frontend` is already on GitHub, and it has a bug.
- [ ] `restore`
- [ ] `restore --staged`
- [ ] `amend` or `reset --soft`
- [x] `revert`
Why: On GitHub means shared. Add a commit that undoes it; never rewrite and force-push.
```

```checkpoint check-18
You staged `map.md` and `project-brief.md`, but this commit should hold only the map.
- [ ] `restore`
- [x] `restore --staged`
- [ ] `amend` or `reset --soft`
- [ ] `revert`
Why: `restore --staged project-brief.md` takes the brief off the list and keeps your edit for the next commit.
```

```checkpoint check-19
The agent made one unpushed commit that should have been two, and you want its changes back in the staging area to split them.
- [ ] `restore`
- [ ] `restore --staged`
- [x] `amend` or `reset --soft`
- [ ] `revert`
Why: `git reset --soft HEAD~1` undoes the commit and leaves its changes staged, ready to commit in two parts.
```

```checkpoint check-20
`9ebb5ed` on `frontend` was never pushed, but `content-v1` is built on it, and the whole commit was a mistake.
- [ ] `restore`
- [ ] `restore --staged`
- [ ] `amend` or `reset --soft`
- [x] `revert`
Why: Never pushed, but shared: content-v1 is built on it. Rewriting would leave content-v1 holding the old copy, so add a commit that undoes it.
```

## Tell your agent

Paste the first when something has gone wrong, the second when a PR shows conflicts, and the third before your first AFK or `/implement-spec` run on Care4Mind.

```text
Something went wrong. Before undoing anything, show me git status and git log --oneline -3, and tell me where the mistake lives: unstaged, staged, committed but not pushed, or already on GitHub. If the commit is on GitHub, or another branch or worktree is built on it, use git revert (or the Revert button on a merged PR). Never reset, amend, rebase or force-push it.
```

```text
This PR has merge conflicts. Merge main into the branch; don't rebase. Before you commit, show me each conflict: both sides, the resolution you propose, and why. Wait for my OK. Then remove every marker, run git diff --check before staging (it must print nothing), run the tests, commit the merge and push.
```

```text
Use the git-guardrails-claude-code skill to install the git hook for this project only. Run its verify step and show me that git push is blocked with exit code 2.
```

## Try it

These commands only look; they change nothing. Run them in `~/Desktop/project1`:

```sh
git status
git log --oneline -5
git reflog
git branch -a --contains 691764b
git log --oneline -1 691764b
```

On 27 October, `git status` said `main` was up to date with `origin/main` and the working tree was clean: nothing to restore or unstage. `git log` shows five commits, from `76f992c` (PR #4) down to `c08fe71`. Read `git reflog` from the bottom: `commit (initial)` made `691764b`, then `commit (amend)` replaced it with `c08fe71`. The lines ending `Fast-forward` are `main` catching up with GitHub after a PR merged. The last two commands show the safety net: no branch contains `691764b`, so the first prints nothing, yet the second still finds it. Your reflog may have grown since, but its bottom lines stay the same until they expire; the `691764b` lines go first, after 30 days by default.

## Check yourself

From memory, without scrolling up.

```final-test final-21
Which of these undos can lose work for good?
- [ ] `git revert` on a pushed commit
- [x] `git restore` on an unstaged edit
- [ ] `git reset --soft` on a commit
- [ ] The Revert button on a PR
Why: An edit that was never staged or committed exists only in the file, so restoring the file erases it with no copy anywhere. Revert adds a commit, and a soft reset keeps the changes staged while the old commit stays in the reflog.
```

```final-test final-22
Which commit is safe to rewrite? Assume nothing is built on a commit unless the option says so.
- [ ] `9ebb5ed`, which `content-v1` is built on
- [ ] A `frontend` commit that’s on GitHub
- [ ] The squash commit for PR #4
- [x] A `ticket-3` commit that’s only local
Why: Rewrite only what nothing else has seen. The other three are shared: `content-v1` is built on the first, the second is on GitHub, and the third is on `main` itself.
```

```final-test final-23
An agent says it has resolved a conflict in `map.md` and wants to commit. What should it do first?
- [x] Check for markers, then run tests
- [ ] Rebase onto `main`, then force-push it
- [ ] Abort the merge, then retry later
- [ ] Push first, then check GitHub’s diff
Why: `git diff --check` catches leftover markers, and the tests catch changes that merged cleanly as text but break each other as code. Rebasing and force-pushing rewrite history, and aborting throws the resolution away.
```

```final-test final-24
This course’s repo allows only squash merges, and a PR is behind `main`. Why merge `main` into it rather than rebase?
- [ ] Merging gives `main` a cleaner history
- [ ] Rebasing is blocked on PR branches
- [x] Merging rewrites nothing; squash hides it
- [ ] Rebasing always causes more merge conflicts
Why: A merge adds one commit and replaces nothing, and the squash merge folds it into the PR’s single commit on `main`. `main` ends up the same either way, so a rebase’s rewrite buys nothing. No rule blocks rebasing PR branches.
```

```final-test final-25
You’re about to start an AFK `/implement-spec` run on Care4Mind with every shell command pre-approved. What protects your uncommitted files from `git reset --hard`?
- [ ] A `main` ruleset
- [x] Matt’s guardrails hook
- [ ] The local reflog
- [ ] A `CLAUDE.md` rule
Why: The hook stops the command before it runs, even when every shell command is pre-approved, and it fires inside subagents. A ruleset guards only GitHub, the reflog never held uncommitted edits, and a line in `CLAUDE.md` shapes what the agent tries without enforcing anything.
```

## Read next

**Read:** [Pro Git §2.4, Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things), about ten minutes. It walks the first three rungs with `git status` output at each step, so you learn to tell your rung from what git prints. It also shows the older `git reset HEAD <file>` and `git checkout -- <file>` forms, which agents sometimes still use. Then, for conflicts, read [§3.2’s Basic Merge Conflicts](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts).

Keep the Commits & PRs cheat sheet open the next time an agent says something went wrong. This is the last lesson of Part 2; the Part 2 test covers Lessons 6–9.

```sources
- [git docs, Reset, restore and revert](https://git-scm.com/docs/git#_reset_restore_and_revert)
- [Pro Git §2.4, Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)
- [git-reset docs](https://git-scm.com/docs/git-reset)
- [gitrevisions](https://git-scm.com/docs/gitrevisions)
- [GitHub Docs, Reverting a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/reverting-a-pull-request)
- [Traversy, CI/CD crash course](https://www.youtube.com/watch?v=B7GM6F3BP6A)
- [git-revert docs](https://git-scm.com/docs/git-revert)
- [Pro Git §3.6, The Perils of Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing#_rebase_peril)
- [git-push docs](https://git-scm.com/docs/git-push)
- [GitHub Docs, Block force pushes](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#block-force-pushes)
- [git-reflog docs](https://git-scm.com/docs/git-reflog)
- [Pro Git §10.7, Data Recovery](https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery#_data_recovery)
- [GitHub Docs, Merge conflicts](https://docs.github.com/en/pull-requests/reference/merge-conflicts)
- [Pro Git §3.2, Basic Merge Conflicts](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts)
- [wayfinder SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md)
- [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md)
- [AI Hero, implement-spec](https://www.aihero.dev/skills-implement-spec)
- [git-merge docs](https://git-scm.com/docs/git-merge)
- [GitHub Docs, Resolving a merge conflict using the command line](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-using-the-command-line)
- [git-diff docs](https://git-scm.com/docs/git-diff)
- [GitHub Docs, Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [GitHub Docs, Keeping your pull request in sync with the base branch](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch)
- [GitHub Docs, Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
- [GitHub Docs, Managing suggestions to update pull request branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-suggestions-to-update-pull-request-branches)
- [GitHub Docs, Resolving a merge conflict on GitHub](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-on-github)
- [git-guardrails-claude-code SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/misc/git-guardrails-claude-code/SKILL.md)
- [block-dangerous-git.sh](https://github.com/mattpocock/skills/blob/main/skills/misc/git-guardrails-claude-code/scripts/block-dangerous-git.sh)
- [Claude Code docs, Hooks](https://code.claude.com/docs/en/hooks)
- [git-clean docs](https://git-scm.com/docs/git-clean)
- [Claude Code docs, Permissions](https://code.claude.com/docs/en/permissions)
- [AI Hero dictionary, AFK](https://www.aihero.dev/ai-coding-dictionary/afk)
- [AI Hero dictionary, Human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)
```
