---
title: Undo and merge conflicts
slug: undo-and-conflicts
summary: Pick the right undo from where a mistake lives, revert what's on GitHub instead of rewriting it, and resolve a merge conflict yourself or through an agent.
image: /images/lessons/undo-and-conflicts.jpg
imageAlt: A 1912 Olympic tug of war: one team leans back hard on the rope while the other team pulls from the far end.
---

Say a coding agent rewrote the wrong recipe in your `recipes` site. Or a pull request you merged this morning broke the home page. Or GitHub says your pull request has conflicts, and its merge button won't work. Git can undo almost anything, but each undo fits one situation, and the wrong one can throw work away for good.

```goals
- You'll be able to say where a mistake lives, from a file on your computer to GitHub, and pick the undo that fits.
- You'll be able to undo a merged pull request with a revert, and say why a commit on GitHub is never rewritten.
- You'll be able to get a lost commit back with the reflog.
- You'll be able to read a merge conflict, resolve it in the terminal, on github.com or through an agent, and check the result.
```

## Where does the mistake live?

Git has several undo commands with similar names, and each one works on a different place. So the first question is never "which command?". It's "where is the mistake now?".

**Before you undo anything, ask where the mistake lives: the further a change has travelled, the gentler its undo must be.**

A change can be in four places. You met the first three in [Commits and diffs](/learn/commits-and-diffs):

- the files in your folder, called the working tree;
- the staging area, the list of changes for your next commit;
- a commit on your computer;
- GitHub, once the commit is [pushed](/learn/push-pull-and-remotes), and perhaps merged into `main`.

| Where the mistake lives | How you can tell | The undo | What happens |
|---|---|---|---|
| Edited, not staged | `git status` lists it under "Changes not staged for commit" | `git restore <file>` | The file goes back to its last staged or committed version. The edit is gone for good. |
| Staged, not committed | `git status` lists it under "Changes to be committed" | `git restore --staged <file>` | The file comes off the list for the next commit. The edit stays in the file. |
| Committed, not pushed, nothing built on it | `git log` shows the commit, and GitHub doesn't have it | `git commit --amend`, or `git reset --soft HEAD~1` | The commit is replaced, or undone with its changes kept staged. |
| Pushed to GitHub | GitHub's list of commits shows it | `git revert <commit>` | A new commit cancels the old one. History stays as it was. |
| In a merged pull request | The pull request says Merged | The Revert button, or `gh pr revert <number>` | GitHub opens a new pull request that cancels it. You merge that one. |

Read the table from top to bottom, like a ladder. The first rung is the only one that destroys work. An edit you never staged or committed exists only in the file. So when `git restore` replaces the file, no copy is left anywhere.

The third rung is the first that rewrites history. The last two never do. They add a new commit that does the opposite of the bad one, so the mistake and its undo both stay in the record.

```checkpoint quick-1
An agent ran `git add .` and staged `.env`, the file that holds your site's secret key, because `.gitignore` forgot it. The repo has earlier commits, but this change isn't committed yet. Which undo fits?
- [x] `git restore --staged .env`, which takes it off the list and leaves the file on disk.
- [ ] `git revert HEAD`, which adds a new commit that cancels the latest one.
- [ ] `git reset --soft HEAD~1`, which moves the branch back by one commit.
- [ ] `git commit --amend`, which replaces the latest commit with a new one.
Why: The mistake is in the staging area, so `git restore --staged` takes the file off the list for the next commit and keeps it on disk. The other three act on commits, and `.env` isn't in any commit yet.
```

## Undo on your computer

While a mistake hasn't left your computer, and nothing else is built on it, you can fix it any way you like. Nobody else has seen it yet.

### Throw an edit away, or unstage it

Say you asked an agent to fix a typo in `recipes/pancakes.md`, and it rewrote the whole recipe. Nothing is staged. `git status` shows:

```text
On branch 7-cooking-time
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   recipes/pancakes.md
```

Git's own hint names the undo. Run `git restore recipes/pancakes.md`, and the file goes back to how it was. Run `git status` again: the file has gone from the list.

If the file was staged, `git status` lists it under "Changes to be committed" instead, with the hint `git restore --staged <file>`. That command only takes the file off the list. Your edit stays in the file, ready for a later commit. In a repo with no commits yet, git's hint is `git rm --cached <file>` instead, because there's no commit to restore from. It too takes the file off the list and leaves it on disk.

```checkpoint quick-2
You staged `recipes/pancakes.md` and `recipes/waffles.md`, but this commit should hold only the pancakes. You want to commit the waffles later. What do you run?
- [x] `git restore --staged recipes/waffles.md`
- [ ] `git restore recipes/waffles.md`
- [ ] `git reset --soft HEAD~1`
- [ ] `git commit --amend`
Why: `--staged` only takes the file off the list for the next commit, and the waffle edit stays on disk. Without `--staged`, `git restore` puts the file back to its staged version, which already holds the waffle edit, so waffles stays on the list. The last two act on commits, not on what's staged.
```

Agents sometimes use older spellings of the same two undos. `git checkout -- <file>` does what `git restore <file>` does. `git reset HEAD <file>` does what `git restore --staged <file>` does.

### Fix the last commit

Say the agent's last commit left out `tests/recipe-card.test.js`, and it hasn't pushed. Stage the missing file, then fold it into the same commit:

```sh
git add tests/recipe-card.test.js
git commit --amend --no-edit
```

`--amend` doesn't edit the old commit. It makes a new commit in its place and moves the branch onto it. `--no-edit` keeps the old message. To fix only a typo in the message, run `git commit --amend -m "Show cooking time on recipe cards"`.

To undo the last commit but keep its changes, run `git reset --soft HEAD~1`. `HEAD` is the commit your folder has open, and `HEAD~1` is the one before it. The branch moves back one commit, and the undone changes wait in the staging area. You can then commit them again, perhaps as two smaller commits.

```callout watch-out
`git reset --hard` is a different tool. It moves the branch and throws away every uncommitted change to the files git tracks, with no copy anywhere. Only new files that aren't staged survive. If an agent proposes it, ask what it's trying to do: there's almost always a gentler command.
```

```checkpoint quick-3
An agent's last commit has a typo in its message. It hasn't pushed, and nothing is built on the branch. What do you ask for?
- [x] `git commit --amend`, to replace the commit with a corrected one.
- [ ] `git revert HEAD`, to add a second commit that cancels the first.
- [ ] `git reset --hard HEAD~1`, to throw the commit away and start again.
- [ ] `git restore --staged`, to take the commit off the staging list.
Why: The commit exists only on your computer, so it's safe to replace, and `--amend` fixes the message. A revert doesn't fix the message: it cancels the commit's changes and leaves the typo in the history. `reset --hard HEAD~1` throws the commit away and also destroys uncommitted edits, and `restore --staged` works on staged files, not commits.
```

## Undo what's on GitHub

Once a commit is on GitHub, the rules change. Other people, other branches and the pull request's history can all point at it.

### Never rewrite shared history

Git can't change a commit. Amend makes a new commit and moves the branch label onto it, and reset moves the label back to an older one. While only your computer has the old commit, nobody notices. Once GitHub has it, anything built on it still points at it. Now two versions of the history live side by side, and someone has to untangle them.

Rebasing replays a branch's commits on top of another commit, as new copies. [Push, pull and remotes](/learn/push-pull-and-remotes) shows how. The Pro Git book gives the rule for it in one line. Don't rebase commits that exist outside your repository and that people may have based work on. The same goes for amend and reset. And "shared" means more than "pushed". A commit that another branch, another [worktree](/learn/branches-and-worktrees) (a second folder of the repo, with its own branch) or a teammate has built on is shared, even if it never reached GitHub.

Putting rewritten commits on GitHub takes a **force push** (`git push --force`). A normal push only moves GitHub's branch forward, to a commit that already contains everything the branch had. Git calls that a **fast-forward**. A rewrite moves the branch sideways, so `git push` refuses unless you force it. A force push to a shared branch can wipe other people's commits from it, which is why teams [block force pushes on `main`](/learn/how-teams-do-it).

```checkpoint quick-4
Which commit is safe to rewrite with amend or reset?
- [x] One on your own branch that you haven't pushed, with nothing built on it.
- [ ] One you pushed an hour ago, which a teammate has since pulled and built on.
- [ ] One you never pushed, but that a branch in another worktree is built on.
- [ ] One on `main` on GitHub, as long as you force-push the result at once.
Why: Rewrite only what nothing else has seen. A commit a teammate has pulled is shared, and so is one another branch is built on. Rewriting `main` on GitHub needs the very force push that wipes other people's work.
```

### Revert a commit or a merged pull request

A **revert** is a new commit that does the opposite of an old one. Both stay in the history, so anyone can see the mistake and its undo. A revert reaches `main` the way any change does: on a branch, through a pull request, past the same checks.

```checkpoint quick-5
You merge a revert of pull request #8. What does `main`'s history hold afterwards?
- [x] Both #8's commit and the revert that cancels it.
- [ ] Only the revert, because #8's commit gets erased.
- [ ] Neither, because a revert rewinds `main` past #8.
Why: A revert is a new commit that does the opposite of an old one, so the mistake and its undo both stay in the history.
```

Say pull request #8 added cooking times to your recipe cards. It was [squash-merged](/learn/merging-and-cleaning-up) this morning, and it broke the home page. You can undo it three ways:

- On github.com, open pull request #8 and click **Revert** near the bottom. GitHub makes a new branch and opens a new pull request that cancels #8. Check it and merge it like any other. No button? You need write access to the repo.
- In the terminal, `gh pr revert 8` does the same.
- With an agent, say: "Revert pull request #8 in a new pull request. Don't merge it yet."

To check the revert, run `gh pr view <its number>`. Its numbers should be #8's flipped: if #8 was `+40 -12`, the revert is `+12 -40`.

To revert one commit by hand, run `git revert <commit>` on a new branch, then push it and open a pull request. If the commit is a merge commit, add `-m 1`, which tells git to keep `main`'s side. A squash merge leaves an ordinary commit, so a plain `git revert` works on it.

### What a revert can't undo

A revert changes the repo's files, and nothing outside them.

- A database change. Say #8 came with a migration, a script that changes the database's tables, and it has run. Reverting #8 puts the files back, but the database stays as the migration left it. So read any migration before you merge, as [Checking a pull request](/learn/checking-a-pr) shows.
- A leaked secret. Say an agent committed `.env`, with your site's secret key, and pushed it. A revert removes the file from the latest version, but the old commit on GitHub still holds the key. So treat the key as public. Replace it at the service that issued it, so the old key stops working. Then add `.env` to `.gitignore`, so it can't happen again.

```checkpoint quick-6
A merged pull request's migration has already removed a column from your database. You revert that pull request. What happens to the column?
- [x] It stays removed, because a revert changes only the repo's files.
- [ ] It comes back, because a revert also runs the migration in reverse.
- [ ] It comes back with its data, because GitHub keeps a copy of the table.
Why: A revert records a new commit that reverses old changes in the repo. A database isn't in the repo, so what the migration did stays done.
```

## The reflog: getting a lost commit back

Say an agent ran `git reset --hard HEAD~3` on a branch you never pushed, and three commits seem to be gone. They aren't, yet. The **reflog**, short for reference log, is your computer's record of every place `HEAD` has pointed. Each commit, switch, reset, amend and merge adds a line.

```sh
git reflog
```

```text
4e5f6a7 HEAD@{0}: reset: moving to HEAD~3
9c8d7e6 HEAD@{1}: commit: Show cooking time on the waffle card
5b4a3c2 HEAD@{2}: commit: Show cooking time on the pancake card
```

Find the last line before the mistake. Here it's `HEAD@{1}`. Put a new branch on its commit, and the three commits are back:

```sh
git branch rescued 9c8d7e6
```

The reflog has two limits. It lives only on your computer, so GitHub can't show it. And it records commits, never edits. Work that was never committed, then thrown away by `git restore` or `git reset --hard`, was never in it. Lines for commits that no branch holds expire after 30 days by default.

```checkpoint quick-7
An agent's `git reset --hard HEAD~3` has made three unpushed commits disappear from `git log`. What gets them back?
- [x] `git reflog` to find where the branch was, then a new branch on that commit.
- [ ] The Revert button on GitHub, which brings back commits that a branch lost.
- [ ] `git restore` on each changed file, which brings back the lost commits.
- [ ] Nothing, because a hard reset deletes the three commits for good.
Why: The commits still exist, and the reflog lists where `HEAD` was before the reset. A new branch on that commit brings them back. GitHub never had these commits, and `git restore` works on files, not commits.
```

## When a pull request goes wrong

Some mistakes happen around a pull request rather than inside a file. Each has its own fix.

| What went wrong | What to do |
|---|---|
| A check is red on an open pull request | Fix it on the same branch and push. The pull request updates, and the checks run again. |
| You found one more fix after the pull request merged | Put it on a new branch from the latest `main`, in a new pull request. A merged pull request is finished. |
| The agent committed on `main` and hasn't pushed | Move the commit to a branch, and put `main` back to match GitHub (below). |
| The wrong commit is already on GitHub's `main` | Revert it in a new pull request. Never reset and force-push `main`. |
| The commit landed on the wrong branch | Cherry-pick it onto the right one, which copies one commit's change across. Then revert it on the wrong one. |

The second row catches people out. After a merge, a push to the old branch still works: if GitHub deleted the branch, the push makes it again. But that pull request has already merged, so the new commit never reaches `main`. Check `gh pr view` first. If it says `Merged`, start a new branch.

For the third row, ask the agent for these two commands, run while `main` is open:

```sh
git switch -c 7-cooking-time
git branch -f main origin/main
```

The first makes a new branch where you are, commit included. The second moves your `main` back to `origin/main`, your copy of GitHub's `main`, and leaves your files alone. Check it with `git log --oneline origin/main..HEAD`: you should see your one commit.

```checkpoint quick-8
The agent committed on your `main` by mistake and hasn't pushed. You also have uncommitted edits. It proposes `git reset --hard` to move the commit. What do you ask for instead?
- [x] `git switch -c` to a new branch, then `git branch -f main origin/main`.
- [ ] `git revert HEAD` on `main`, then a push of both commits to GitHub.
- [ ] `git push --force`, then a new branch made from GitHub's `main`.
Why: `reset --hard` would throw away your uncommitted edits. The new branch keeps the commit, and `git branch -f` moves `main` back to match GitHub without touching your files.
```

## Merge conflicts: what they are

A merge combines two branches. Git usually manages it alone, because the two sides changed different files, or different lines. A **merge conflict** is the case git can't settle. Both branches changed the same lines in different ways, or one deleted a file that the other edited. Changes on lines right next to each other count as the same lines. Git won't guess which version is right. It stops, marks the spots, and waits for someone to decide.

Say pull requests #11 (quicker pancakes) and #12 (vegan pancakes) both changed the same line of `recipes/pancakes.md`. #11 merges first. Now #12 conflicts: its line and `main`'s line differ, and git can't pick. On GitHub, #12 says "This branch has conflicts that must be resolved", and its merge button stays off until someone resolves them. In the terminal, `gh pr view 12 --json mergeable` prints `"mergeable": "CONFLICTING"`. GitHub Actions, GitHub's own automation for checks, also won't start #12's pull request checks until the conflict is fixed.

```checkpoint quick-conflict-github
Pull request #12 has a merge conflict that nobody has resolved yet. What else is true on GitHub?
- [x] Its merge button stays off, and its GitHub Actions pull request checks won't start.
- [ ] Its merge button works, and GitHub keeps whichever of the two lines is newer.
- [ ] Its checks run as usual, and they fail on the line that both branches changed.
Why: GitHub won't merge a pull request with a conflict, and GitHub Actions won't run `pull_request` checks on it either. Resolving the conflict, and pushing, starts them.
```

### Reading a conflicted file

Git writes both versions into the file, between three marker lines:

```text
# Pancakes
<<<<<<< HEAD
Serves 4. Ready in 20 minutes. Vegan option below.
=======
Serves 4. Ready in 15 minutes.
>>>>>>> origin/main
```

Between `<<<<<<< HEAD` and `=======` is your branch's version. `HEAD` is the branch your folder has open, here #12's. Between `=======` and `>>>>>>>` is the version coming in, named after the arrows. The right answer is often a mix of both: `Serves 4. Ready in 15 minutes. Vegan option below.`

```checkpoint quick-9
In a conflicted file, which version sits between `=======` and `>>>>>>> origin/main`?
- [x] The version coming in from `origin/main`.
- [ ] The version on the branch your folder has open.
- [ ] The version git picked as the right one.
Why: The top half, after `<<<<<<< HEAD`, is the branch your folder has open. The bottom half, before the closing arrows, is the version coming in, named after the arrows. Git picks neither.
```

A conflict between a deleted file and an edited one has no markers. `git status` says, for example, `deleted by us`, and you choose. Keep the file with `git add <file>`, or delete it with `git rm <file>`.

## Resolving a conflict, step by step

You can resolve a conflict in the terminal, in the browser, or through an agent. Whichever you use, someone has to decide which version is right, and that someone is you.

### In the terminal

Say you're resolving #12. From your project's folder:

1. Switch to the pull request's branch and get its latest commits: `git switch 12-vegan-pancakes`, then `git pull`.
2. Run `git fetch origin`, which downloads GitHub's latest commits without touching your files. Then merge GitHub's `main` in with `git merge origin/main`. Git prints `CONFLICT (content): Merge conflict in recipes/pancakes.md`.
3. Run `git status`. It lists the file under "Unmerged paths".
4. Open the file. Keep one side, the other, or a mix, and delete all three marker lines.
5. Run `git diff --check`. It warns about any marker you missed, so it should print nothing.
6. Run `git add recipes/pancakes.md`, which tells git the file is resolved.
7. Run `git commit --no-edit`, which finishes the merge with the message git prepared.
8. Run your tests, then `git push`. The pull request updates, and its checks run again.

If it turns into a mess, `git merge --abort` puts everything back as it was before step 2.

You may read that you can rebase instead: replay your branch's commits on top of the new `main`. That rewrites every one of them, so the rule above applies, and the branch then needs a force push. Merging `main` in rewrites nothing. And if your repo squash-merges, the extra merge commit disappears into the squash anyway.

```checkpoint quick-10
You've edited a conflicted file and deleted what you think are all the markers. What do you run before `git add`?
- [x] `git diff --check`, which warns about any conflict marker you missed.
- [ ] `git merge --abort`, which checks the merge and then finishes it.
- [ ] `git push --force`, which sends the resolved file to the pull request.
Why: `git diff --check` flags leftover markers. `git merge --abort` throws the merge away, and a force push rewrites the branch on GitHub, which a merge never needs.
```

### On github.com

For a simple conflict on the same lines, GitHub's editor works in the browser.

1. Open the pull request. Near the bottom, click **Resolve conflicts**.
2. In each marked block, keep what's right and delete the marker lines.
3. Click **Mark as resolved**. If other files conflict, pick the next one from the list on the left.
4. When every file is done, click **Commit merge**. This merges all of `main` into your branch.

If **Resolve conflicts** is greyed out, the conflict is too complex for the browser. Use the terminal or an agent.

```checkpoint quick-11
The **Resolve conflicts** button on your pull request is greyed out. What does that tell you?
- [x] This conflict is too complex for the browser, so use the terminal or an agent.
- [ ] Someone else is already resolving the conflict, so wait for them to finish.
- [ ] The conflict has fixed itself, so the merge button will work after a refresh.
Why: GitHub's editor handles simple same-line conflicts. When its button is off, resolve the conflict with git on your computer, yourself or through an agent.
```

### Through an agent

An agent can do all the typing. What it can't know is which version is right. That's a decision about your site, so it's yours. In the example, only you know whether the vegan note should stay.

You say:

> This pull request has merge conflicts. Run `git fetch origin`, then merge `origin/main` into the branch; don't rebase. Before you commit, show me each conflict: both sides, what you propose, and why. Wait for my OK. Then, before you stage anything, run `git diff --check` (it must print nothing) and the tests. After that, commit and push.

Once it has pushed, you look:

```sh
git show --remerge-diff
```

It compares the conflict git left with what the agent committed. Lines starting `-` left the file, markers included. Plain lines stayed. Lines starting `+` are new. Want a `-` line back? Say so. The option needs git 2.36 or newer.

Run the tests after every merge, even a clean one. Two changes can merge cleanly as text and still break each other as code.

```checkpoint quick-12
An agent says it has resolved a conflict and wants to commit. What should happen first?
- [x] It shows you each side and its choice, checks for markers, and runs the tests.
- [ ] It rebases onto `main` and force-pushes, so the conflict can't come back.
- [ ] It pushes first, so you can read the result in the pull request on GitHub.
Why: Git can't tell which version is right, and neither can the agent: you decide. Then `git diff --check`, run before staging, catches leftover markers, and the tests catch changes that merge as text but break as code.
```

## Preventing conflicts and the worst commands

Most conflicts are prevented by how you cut the work.

- Keep pull requests small and branches short-lived. Merge soon, then start a fresh branch.
- When a branch must live long, merge the latest `main` into it often, so each conflict stays small.
- Don't give two people or two agents the same file at the same time. [Working with a coding agent on GitHub](/learn/working-with-an-agent-on-github) shows how to split the work.

For destructive commands, Matt Pocock's [git-guardrails-claude-code](/learn/git-guardrails-claude-code) Skill installs a Claude Code **hook**: a script that runs automatically before every shell command the agent tries. It blocks every `git push`, plus `git reset --hard`, `git clean -f`, `git branch -D`, `git checkout .` and `git restore .`. So the agent has to hand those commands to you.

```checkpoint quick-13
Two agents will work at the same time, and both tasks need changes to the same lines of `src/recipe-card.js`. What prevents a conflict best?
- [x] Run the two tasks one after the other, so the second starts from the first's work.
- [ ] Run both at once, then let the second pull request keep whichever change is newer.
- [ ] Run both at once in one folder, so each agent can see what the other is writing.
Why: Two branches changing the same lines meet as a conflict at merge time. Run one after the other, and the second builds on the first. Git never keeps "the newer change", and one folder for two agents causes worse trouble.
```

## Try it

````try
You need git 2.36 or newer: `git --version` prints yours. Work in a new folder outside any project. Nothing here touches GitHub.

1. Make a practice repo with a one-line recipe:

```sh
mkdir undo-practice
cd undo-practice
git init -b main
echo "Serves 4. Ready in 20 minutes." > pancakes.md
git add pancakes.md
git commit -m "Add pancakes"
```

2. On a new branch, change the line one way:

```sh
git switch -c vegan
echo "Serves 4. Ready in 20 minutes. Vegan option below." > pancakes.md
git commit -am "Add a vegan note"
```

3. Back on `main`, change the same line another way:

```sh
git switch main
echo "Serves 4. Ready in 15 minutes." > pancakes.md
git commit -am "Make the pancakes quicker"
```

4. Merge the branch with `git merge vegan`. You should see `CONFLICT (content): Merge conflict in pancakes.md`.
5. Run `cat pancakes.md`. You should see `<<<<<<< HEAD`, `main`'s line, `=======`, the branch's line, then `>>>>>>> vegan`.
6. Write one line that keeps both changes, then finish the merge:

```sh
echo "Serves 4. Ready in 15 minutes. Vegan option below." > pancakes.md
git diff --check
git add pancakes.md
git commit --no-edit
```

7. Undo the merge with a revert: `git revert -m 1 --no-edit HEAD`. Then `cat pancakes.md` shows `Serves 4. Ready in 15 minutes.` again.
8. Run `git log --oneline`. The revert is on top, and every earlier commit is still there.
9. Throw the revert away with `git reset --hard HEAD~1`. That's safe here, because nothing is uncommitted. `git log --oneline` no longer shows it.
10. Run `git reflog`. Its second line, `HEAD@{1}`, is the revert. Bring it back with `git branch rescued "HEAD@{1}"`, and `git log --oneline rescued` shows it again.

Delete the `undo-practice` folder when you're done. To practise with an agent, ask it to do steps 1 to 4 and stop. Then ask it to keep both changes, and check its work with `git show --remerge-diff`.
````

## Remember

```flashcards
Q: What do you ask before any undo?
A: Where does the mistake live: unstaged, staged, committed on your computer, or on GitHub? The further it has travelled, the gentler the undo.

Q: Which undos can lose work for good?
A: `git restore <file>` on an edit that was never staged or committed, and `git reset --hard`, which throws away every uncommitted change to the files git tracks.

Q: What's the difference between `git restore <file>` and `git restore --staged <file>`?
A: The first throws away edits you haven't staged. The second only takes the file off the next commit's list, and the edit stays.

Q: How do you undo a merged pull request?
A: Revert it. The Revert button or `gh pr revert <number>` opens a new pull request that cancels it, and you merge that.

Q: When is it safe to amend, reset or rebase a commit?
A: Only while nothing else has seen it: not pushed, and no other branch, worktree or person has built on it.

Q: What can the reflog bring back, and what can't it?
A: Commits lost to a reset or an amend on your computer. Never uncommitted edits, and nothing that only GitHub had.

Q: What is a merge conflict?
A: Two branches changed the same lines differently, or one deleted a file the other edited. Git stops and waits for someone to choose.

Q: An agent resolves a conflict. What gets checked, and when?
A: `git diff --check` before it stages the file, for leftover markers, and the tests. After it commits, `git show --remerge-diff`, for what it kept and dropped.
```

## Final test

```final-test final-lose-work
Which of these undos can lose work for good?
- [x] `git restore` on an edit that was never staged or committed.
- [ ] `git revert` on a commit that's already on GitHub.
- [ ] `git reset --soft HEAD~1` on your latest commit.
- [ ] The Revert button on a merged pull request.
Why: An edit that was never staged or committed exists only in the file, so restoring the file leaves no copy anywhere. A revert adds a commit, and a soft reset keeps the changes staged.
```

```final-test final-merged-yesterday
Pull request #14 merged into `main` yesterday, and its change to the shopping list is wrong. Which undo fits?
- [x] Revert #14 in a new pull request, and merge that once its checks pass.
- [ ] Reset `main` back past #14 on your computer, then force-push it to GitHub.
- [ ] Amend the commit #14 left on `main`, then push the corrected version.
- [ ] Delete #14's branch on GitHub, which takes its commit back out of `main`.
Why: The change is on GitHub's `main`, so you add an undo instead of rewriting history. Resetting or amending `main` needs a force push, and deleting a merged branch changes nothing on `main`.
```

```final-test final-leaked-key
An agent pushed a commit holding `.env` and your site's secret key. Its pull request is still open, and the agent offers to amend the commit and force-push. What comes first?
- [x] Replace the key at the service that issued it, then add `.env` to `.gitignore`.
- [ ] Amend the commit and force-push it, so the key leaves GitHub's history.
- [ ] Revert the commit, so the key disappears from every copy on GitHub.
- [ ] Close the pull request, so nobody can open the commit that holds the key.
Why: The key already sits in a commit on GitHub, so treat it as public and replace it first. A revert or a later commit leaves the old commit in place, and a rewrite can't call back copies already made.
```

```final-test final-red-check
A check on your open pull request has gone red. The agent has found the cause and asks where the fix should go. What do you say?
- [x] On this same branch, because a push updates the pull request and the checks run again.
- [ ] On a new branch from `main`, because a pull request can't take commits once a check fails.
- [ ] Straight on `main`, because a red check means this pull request can never merge.
- [ ] Nowhere yet, because the failing check has to be switched off before the branch can change.
Why: While a pull request is open, a push to its branch updates it, and the checks run on the update. So the fix goes on the same branch.
```

```final-test final-fix-after-merge
Your pull request merged an hour ago. You've found one more small fix, and the agent is still on the old branch. What do you ask for?
- [x] The fix on a new branch from the latest `main`, in a new pull request.
- [ ] The fix pushed to the old branch, so the merged pull request carries it in.
- [ ] The fix committed on the old branch, so GitHub merges it after the next check.
- [ ] A revert of the merged pull request first, so the old branch can take the fix.
Why: A merged pull request is finished. A commit pushed to its branch afterwards never reaches `main`, so the fix needs a pull request of its own.
```

```final-test final-remerge-diff
The agent merged `main` into your branch, fixed a conflict and pushed. You want to see what its fix kept and what it dropped. What do you run?
- [x] `git show --remerge-diff`, which compares the conflict git left with what was committed.
- [ ] `git status`, which lists what each side wanted and what the agent kept of it.
- [ ] `git reflog`, which records each line the agent removed while it edited the file.
- [ ] Nothing, because git refuses to finish a merge that drops anybody's changes.
Why: Git couldn't choose between the two sides, so the choice was the agent's, and git won't catch a bad one. `--remerge-diff` shows the lines that left the file and the ones that came in.
```

```final-test final-reflog-limit
An agent ran `git restore .` and threw away an afternoon of edits it had never committed. Can the reflog bring them back?
- [x] No. The reflog records commits, and those edits were never committed.
- [ ] Yes. The reflog records every edit, so the latest line holds the afternoon's work.
- [ ] Yes, but only from GitHub, which keeps a copy of the reflog for each branch.
- [ ] No, because `git restore .` also deletes the reflog along with the edits.
Why: The reflog lists where `HEAD` has pointed: commits, never edits. Work that was never committed and then thrown away isn't anywhere, which is why `git restore` sits on the dangerous rung.
```

```final-test final-merge-not-rebase
Your pull request's branch has a conflict with `main`, and a branch in another worktree is built on yours. The agent wants to rebase onto `main` and force-push. What do you ask for instead?
- [x] Merge `main` into the branch, which resolves the conflict without rewriting anything.
- [ ] Rebase as planned, then rebase the other branch too, so both match again.
- [ ] Delete the other worktree first, so the rebase can't strand its branch.
- [ ] Squash the branch into one commit first, then rebase and force-push that.
Why: A rebase replaces every commit on your branch and strands the branch built on top of it. Merging `main` in rewrites nothing, and a squash merge keeps the extra merge commit off `main`.
```

```final-test final-different-lines
Two pull requests change different lines of `recipes/pancakes.md`, a few lines apart. The first one merges. What happens to the second?
- [x] It can merge without a conflict, because git combines changes on different lines.
- [ ] It conflicts, because both pull requests changed the same file.
- [ ] It's closed, because GitHub allows one merged change per file each day.
- [ ] It overwrites the first one's change, because the newer pull request wins.
Why: Git stops where it can't safely pick a side: the same lines changed differently, or a deleted file that the other side edited. Changes on lines right next to each other count as the same lines, but changes a few lines apart merge on their own. You still run the tests.
```

```sources
- [Git Basics: Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things), Scott Chacon and Ben Straub (Pro Git)
- [Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging), Scott Chacon and Ben Straub (Pro Git)
- [Rebasing: The Perils of Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing), Scott Chacon and Ben Straub (Pro Git)
- [Maintenance and Data Recovery](https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery), Scott Chacon and Ben Straub (Pro Git)
- [git restore](https://git-scm.com/docs/git-restore), The Git project
- [git reset](https://git-scm.com/docs/git-reset), The Git project
- [git revert](https://git-scm.com/docs/git-revert), The Git project
- [git reflog](https://git-scm.com/docs/git-reflog), The Git project
- [git merge](https://git-scm.com/docs/git-merge), The Git project
- [git diff](https://git-scm.com/docs/git-diff), The Git project
- [git show](https://git-scm.com/docs/git-show), The Git project
- [git push](https://git-scm.com/docs/git-push), The Git project
- [git branch](https://git-scm.com/docs/git-branch), The Git project
- [git cherry-pick](https://git-scm.com/docs/git-cherry-pick), The Git project
- [Git 2.36 release notes](https://raw.githubusercontent.com/git/git/v2.36.0/Documentation/RelNotes/2.36.0.txt), The Git project
- [Reverting a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/reverting-a-pull-request), GitHub Docs
- [Merge conflicts](https://docs.github.com/en/pull-requests/reference/merge-conflicts), GitHub Docs
- [Resolving a merge conflict using the command line](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-using-the-command-line), GitHub Docs
- [Resolving a merge conflict on GitHub](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-on-github), GitHub Docs
- [Keeping your pull request in sync with the base branch](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch), GitHub Docs
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), GitHub Docs
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), GitHub Docs
- [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), GitHub Docs
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [gh pr revert](https://cli.github.com/manual/gh_pr_revert), GitHub CLI manual
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub CLI manual
- [git-guardrails-claude-code: SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/misc/git-guardrails-claude-code/SKILL.md), Matt Pocock's Skills
```
