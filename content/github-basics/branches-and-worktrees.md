---
title: Branches and worktrees
slug: branches-and-worktrees
summary: Start work on its own branch from an up-to-date main, move between branches, retire a finished one, and give an agent its own folder with a worktree.
---

Say you start adding a search box to your recipe site, and the site on `main` must keep working while you do. Later, you want two agents to build two features at once. Work straight on `main`, and half-done code sits where every new piece of work starts. Put two agents in one folder, and one agent's switch changes the files under the other.

```goals
- Say what a branch and a worktree are, and how they differ.
- Start work on a new branch from an up-to-date `main`, and give it a good name.
- Move between branches, and read the marks in `git branch -vv`.
- Tell when a branch is finished, and delete it safely, even after a squash merge.
- Know when you need a worktree, and make one with Git or with Claude Code.
```

## A branch is a name; a worktree is a folder

A commit is a saved snapshot of the project, with a pointer to the commit before it. [Commits and diffs](/learn/commits-and-diffs) covers commits in full. Branches and worktrees are both built on top of them.

A **branch** is a name stuck on one commit, like a movable label. When you commit on a branch, its label moves forward to the new commit. Making a branch copies no files: it adds one more label.

To **check out** a branch is to put its files in a folder to work on. **HEAD** is Git's marker for what you have checked out, normally your current branch.

A **worktree** is a folder with one of the repo's branches checked out. So when two pieces of work need two branches at the same moment, they need two folders.

**A branch keeps work off `main`; a worktree gives a branch its own folder, which you need only when two sessions work at once.**

The folder you cloned or created, such as `recipes`, is the **main worktree**. A repo can also have **linked worktrees**: extra folders, each with a different branch checked out. They all share one history, the record of all commits, so a commit made in one folder can be seen from the others.

For example, the recipe site could keep `main` in `recipes`, with two linked worktrees beside it: `recipes-search` on the `add-search` branch, and `recipes-list` on `shopping-list`.

```diagram
type: git
caption: "They all share one history"
branches:
  - name: "`main`"
    commits: 3
  - name: "`add-search`"
    from: { branch: "`main`", after: 2 }
    commits: 2
  - name: "`shopping-list`"
    from: { branch: "`main`", after: 2 }
    commits: 2
worktrees:
  - branch: "`main`"
    label: "`recipes`"
  - branch: "`add-search`"
    label: "`recipes-search`"
  - branch: "`shopping-list`"
    label: "`recipes-list`"
```

Two rules hold this together. A folder shows exactly one branch at a time. And a branch can be checked out in only one worktree at a time. But a branch doesn't need a folder at all: most branches are only a name in the history.

```checkpoint label-moves
An agent commits on the `add-search` branch. What happens to the branch?
- [x] Its label moves forward to the new commit.
- [ ] It copies every project file into a new folder.
- [ ] It stays on the commit it pointed at before.
Why: A branch is a name on one commit. When you commit on it, the label moves forward to the new commit, and no files are copied.
```

```checkpoint folder-or-name
`add-search` is checked out in one folder. Can a second worktree check out `add-search` too?
- [x] No: a branch can be checked out in only one worktree at a time.
- [ ] Yes: both folders then share the branch's files as they change.
- [ ] Yes, but only if the second folder sits inside the first one.
Why: A folder shows one branch, and a branch can be checked out in only one worktree at a time. A second folder needs a different branch.
```

## Start work on a branch, from an up-to-date `main`

You always make a new branch from an existing one, usually the **default branch**. That's the repo's first branch: the one GitHub shows when anyone visits, and the one a new pull request merges into unless you pick another. GitHub names it `main`.

A branch made for one feature or fix is often called a **feature branch**, or topic branch. Give each piece of work its own, and its half-done code stays away from everything else. When the work is ready, it goes back into `main` through a [pull request](/learn/pull-requests).

Your copy of `main` doesn't update itself. To **pull** is to bring new commits from GitHub into the branch you're on, so pull first, or you build on old code. [Push, pull and remotes](/learn/push-pull-and-remotes) explains the pulling. The routine is three commands:

```sh
git switch main
git pull
git switch -c add-search
```

`git switch` changes the branch you're on, and `-c` creates the new branch first. Then `git status` should start with `On branch add-search`. The new branch exists only on your computer until you push it.

Give it a short name that says what the work is, so others can see it at a glance. GitHub's own examples are `increase-test-timeout` and `add-code-of-conduct`. Some teams add a prefix, as in `feature/version-endpoint` from Brad Traversy's CI/CD crash course, or an Issue's number, as in `12-add-search`. The number helps people; it doesn't close anything by itself.

Edits you haven't committed don't belong to any branch yet. So they come along to a branch you create, which is handy when you started on `main` by mistake.

You can also make a branch on github.com. Open the branch menu above the file list, type a new name, and choose to create the branch. That branch is on GitHub only, until you fetch it.

With an agent, ask for the routine and a stop. For example:

> Start a new branch named `add-search` from an up-to-date `main`. Stop there.

Then run `git status` yourself, and look for `On branch add-search`.

```checkpoint stale-main
A pull request was merged on GitHub yesterday, and you haven't pulled since. You're on `main`, and you run `git switch -c add-search`. What does the new branch start from?
- [x] Your copy of `main`, without yesterday's merge, so you'd build on old code.
- [ ] GitHub's `main`, because creating a branch fetches the latest commits first.
- [ ] Nothing, because a new branch stays empty until its first commit.
Why: A new branch starts from where you are, and your copy of `main` gets new commits only when you pull. So switch to `main` and pull first.
```

```checkpoint uncommitted-comes-along
You've edited two files on `main` without committing, then realise they belong on a branch. You run `git switch -c add-search`. Where are the edits?
- [x] In the folder, on `add-search`, because uncommitted edits belong to no branch yet.
- [ ] Gone, because creating a branch resets every edited file.
- [ ] On `main`, committed there by Git before it switched.
Why: Edits you haven't committed don't belong to any branch yet, so they come along to the branch you create.
```

## Moving between branches

`git switch <branch>` changes the branch you're on, and the files in the folder change to match it. Uncommitted edits come along if they don't clash. If switching would overwrite them, Git refuses, and tells you which files are in the way. Commit them first, or ask the agent what they are.

You'll also meet the older command, `git checkout`. `git checkout <branch>` switches, and `git checkout -b <name>` creates and switches. Many tutorials and agents still use it.

`git branch` lists your branches, and `*` marks the one you're on. `git branch -vv` adds each branch's last commit and, in brackets, its copy on GitHub. For example:

```text
$ git branch -vv
* add-search    4e8b2a1 [origin/add-search: ahead 2] Find recipes by ingredient
  main          a3f9c21 [origin/main] Add the number of servings to each recipe (#4)
+ shopping-list 1f0c7d3 (/home/sam/recipes-list) [origin/shopping-list] Add the shopping list page
```

A name starting with `origin/` is Git's memory of a branch on GitHub. The marks do most of the reading for you:

| You see | It means |
|---|---|
| `*` at the start | This folder has the branch checked out |
| `+` at the start, then a folder path | Another worktree has it checked out |
| `[origin/add-search: ahead 2]` | 2 commits here that GitHub doesn't have yet |
| `[origin/old-branch: gone]` | GitHub's copy was deleted; this shows after `git fetch --prune` |

```checkpoint read-vv-line
`git branch -vv` prints `+ shopping-list 1f0c7d3 (/home/sam/recipes-list) [origin/shopping-list: ahead 3]`. What does it tell you?
- [x] Another worktree has it checked out, and it holds 3 commits GitHub doesn't have.
- [ ] This folder has it checked out, and GitHub has 3 newer commits on it.
- [ ] GitHub deleted the branch, and 3 of its commits remain on your computer.
Why: `+` and a folder path mean another worktree has the branch checked out. `ahead 3` means 3 commits here that GitHub doesn't have yet.
```

```checkpoint switch-refuses
You run `git switch main`, and Git refuses: your local changes to two files would be overwritten. What's going on?
- [x] Switching would lose uncommitted edits, so Git stops until you commit or deal with them.
- [ ] `main` is checked out in another worktree, so this folder can't switch to it.
- [ ] Git never lets you leave a branch that has commits GitHub doesn't have.
Why: Git won't switch if that would lose uncommitted changes. Ask what the changes are, and whether to commit them first.
```

## When a branch is finished

A branch's work usually lands on `main` through a pull request. Once that's merged, the branch is finished. Delete it, and start the next piece of work on a fresh branch from the updated `main`.

There are two copies to delete. On github.com, the pull request page offers to delete the branch after the merge. The repo setting "Automatically delete head branches" does it for you. On your computer:

```sh
git switch main
git pull
git branch -d add-search
```

`-d` is the safe delete: it refuses if the branch holds work that isn't merged. In his CI/CD crash course gist, Brad Traversy merges with a merge commit, then runs the same three steps, with `git pull --ff-only`. There, `-d` goes through.

A **squash merge** is different. It lands the branch's work on `main` as one brand-new commit, so the branch's own commits never join `main`'s history. Once GitHub's copy is gone, and Git has noticed after a `git fetch --prune`, `-d` refuses. It says the branch isn't fully merged, even though nothing would be lost.

First check that nothing would be lost. `git diff add-search <squash-commit>`, with the squash commit's ID from `git log` on `main`, should print nothing. Then force the delete with `git branch -D add-search`. [Merging and cleaning up](/learn/merging-and-cleaning-up) covers the full sweep after each merge.

Once its pull request is squash-merged, never reuse the branch. A later pull request from it can carry the commits already squashed into `main`. New work, new branch.

```checkpoint squash-d-refuses
Your pull request from `add-search` was squash-merged, GitHub deleted its copy, and you ran `git fetch --prune`. `git branch -d add-search` refuses: not fully merged. What do you do?
- [x] Check that `git diff add-search <squash-commit>` prints nothing, then use `-D`.
- [ ] Leave the branch, because `-d` says the work isn't on `main` yet.
- [ ] Merge the pull request again, so Git counts the branch as merged.
Why: A squash lands the work as a brand-new commit, so `-d` can't see it. If the diff with the squash commit is empty, nothing is lost, and the forced `-D` is safe.
```

```checkpoint reuse-merged-branch
An agent wants to keep committing on `add-search`, whose pull request was squash-merged, and open a second pull request from it. What do you tell it?
- [x] Start the new work on a fresh branch from the updated `main`.
- [ ] Fine: reuse the branch, since its work is on `main` already.
- [ ] Rename the branch first, then keep committing on it.
Why: A squash-merged branch is finished. A later pull request from it can carry the commits already squashed into `main`, and a new name doesn't change that.
```

## When you need a worktree

Say two agents work in your `recipes` folder, one per feature. One agent switches branch, and the files change under the other. Its next commit can land on the wrong branch. The two sessions share one set of files, one index and one HEAD. The **index**, or staging area, is the list of what goes into the next commit.

Matt Pocock warns that running several sessions of his [implement](/learn/implement) Skill side by side in one folder "is worse than unsupported". So give each session its own worktree. Start each piece of work on its own branch, and add a worktree only when two or more sessions run at once.

The `git worktree` commands make and remove them. From the `recipes` folder, on `main`:

```sh
git worktree add -b add-search ../recipes-search
git worktree add -b shopping-list ../recipes-list
git worktree list
```

`-b add-search` makes a new branch with that name. `..` means the folder above, so `../recipes-search` is a new folder next to `recipes`. So each `add` line makes a new branch, and a new folder with that branch checked out. You now have three folders: `recipes`, `recipes-search` and `recipes-list`. They all share one history.

Ask for a branch that's already checked out, such as `main`, and Git refuses, unless you add `--force`, an option that overrides the refusal. Done with a worktree? `git worktree remove ../recipes-list` removes it.

A worktree has a cost. It starts fresh: gitignored files, such as your `.env`, aren't there, and packages aren't installed, so run `npm install` in it. So a worktree pays only when separate pieces of work run at once. A second terminal that only looks isn't a second session.

Claude Code builds worktrees in. `claude --worktree add-search`, or `claude -w add-search`, makes a worktree under `.claude/worktrees/add-search/` on a new branch named `worktree-add-search`. You can also ask, mid-session, to work in a worktree. Add `.claude/worktrees/` to your `.gitignore`, or those folders show up as untracked files in your main worktree.

To carry gitignored files into each new Claude Code worktree, add a `.worktreeinclude` file at the project root, written like a `.gitignore`. Claude Code copies the gitignored files it matches, such as `.env`, into every worktree it creates.

Tools that run many agents at once rely on this. The [implement-spec](/learn/implement-spec) Skill, which builds a whole plan with helper agents, runs each helper in its own worktree on its own branch.

```checkpoint one-session-branch
You're about to start one piece of work, and it's the only session you have running. What do you need?
- [x] A plain branch, because one session has no other session's work to collide with.
- [ ] A worktree, because every piece of work needs its own folder before it starts.
- [ ] Neither, because one session can safely work straight on `main`.
Why: A branch keeps the work off `main`, so you always make one. A worktree keeps two sessions apart, so one session doesn't need it.
```

```checkpoint worktree-add-result
You're about to run `git worktree add -b print-button ../recipes-print`. What will you get?
- [x] A new branch, and a new folder next to `recipes` with that branch checked out.
- [ ] A new branch only, and you still have to make its folder yourself.
- [ ] A new folder only, with `main` checked out in it until you switch.
Why: `git worktree add` with `-b` makes a new branch, and a new folder with that branch checked out.
```

```checkpoint missing-env
A new Claude Code worktree is missing your gitignored `.env`, so the site won't start in it. What do you add before the next one?
- [x] A `.worktreeinclude` file at the project root, listing `.env` in `.gitignore` syntax.
- [ ] A `--force` flag on the next worktree, which brings gitignored files along.
- [ ] A commit of `.env` to `main`, so every worktree gets a copy of it.
Why: A worktree holds only what Git tracks, so gitignored files aren't there. Claude Code copies the gitignored files `.worktreeinclude` matches into each new worktree.
```

## Going deeper

### Why it exists

Git's own example of a worktree has no agent in it. You're in the middle of a refactor, a big reshuffle of your code, and your files are a mess. Then someone needs an urgent fix. So you make a temporary linked worktree from `main`, fix it there, remove it, and carry on:

```sh
git worktree add -b emergency-fix ../temp main
# fix, test and commit inside ../temp, then:
git worktree remove ../temp
```

Agents need the same separation, all the time. Sessions in one folder share its files, its index and its HEAD, so one session's commit or switch changes what the others are working on. A worktree per session gives each one its own files, index and HEAD.

```checkpoint urgent-fix
You're halfway through a messy refactor when an urgent fix comes in. What does Git's own worktree example suggest?
- [x] Make a temporary linked worktree from `main`, fix it there, then remove it.
- [ ] Commit the half-done refactor to `main` first, then make the fix on top of it.
- [ ] Switch this folder to `main`, and let Git carry the messy edits over with you.
Why: A linked worktree gives the fix its own folder, so the refactor's mess stays where it is. You remove the worktree when the fix is done.
```

### How it works underneath

Git gives each linked worktree a private folder inside the main worktree's `.git/worktrees/`. The linked folder holds a `.git` file that points back there. Take `recipes-search` from above:

```text
recipes/.git/                          the history and settings all worktrees share
recipes/.git/worktrees/recipes-search/ private to recipes-search: its HEAD, its index
recipes-search/.git                    a file that points back to that private folder
```

A **ref** is a name that points to something Git stores, such as a commit. Every branch is a ref. Every ref is shared, except three special kinds that Git keeps per worktree for its own bookkeeping.

So here's what's shared, and what each worktree keeps for itself:

- **Shared:** the history, nearly every ref, and the config file, where the repo's settings live.
- **Kept apart:** its files, its `HEAD` and its index.

```diagram
type: compare
caption: "what's shared, and what each worktree keeps for itself"
columns: ["Shared", "Kept apart"]
rows:
  - label: "the history"
    cells: ["yes", "no"]
  - label: "nearly every ref"
    cells: ["yes", "no"]
  - label: "the config file"
    cells: ["yes", "no"]
  - label: "its files"
    cells: ["no", "yes"]
  - label: "its `HEAD`"
    cells: ["no", "yes"]
  - label: "its index"
    cells: ["no", "yes"]
```

A **stash** is where Git sets aside uncommitted work for later, and it lives at `refs/stash`. So a repo has one list of stashes, not one per worktree. Agent A can run `git stash` in its worktree, and agent B can take that work back out in another, with `git stash pop`.

```checkpoint one-stash-list
You stash work in `recipes-search`, then run `git stash list` in `recipes-list`. What do you see?
- [x] The stash you made in `recipes-search`, since a repo has one list of stashes.
- [ ] An empty list, since each worktree keeps a separate stash list of its own.
- [ ] An error, since only the main worktree can hold or list a stash.
Why: The stash lives at `refs/stash`, and nearly every ref is shared. So a repo has one list of stashes, not one per worktree.
```

### A real example

In July 2026, a user opened issue #429 on Matt Pocock's Skills repo. They were running several implement sessions at once in one folder, one per issue. In a single afternoon:

- one session's `git commit --amend`, which changes the latest commit, landed on the other session's commit;
- a stash "silently disappeared";
- commits landed on the wrong branch, because HEAD had moved under a session.

Their verdict: "None of these were reasoning mistakes." The agents' thinking was fine. Two sessions were writing to shared Git state, with nothing keeping them apart. So the user asked for a worktree per session.

A few days later, another user replied that worktrees fix only two of the three. The amend and the wrong branch go away, because each worktree has its own HEAD and index. The vanished stash doesn't, because "refs/stash is a single shared ref across every worktree".

That reply's advice: where agents work side by side, don't use `git stash` to set work aside. Commit it on your own branch instead. Matt agrees: "worktrees alone do not fix the stash case".

```checkpoint stash-still-shared
Your agents move into separate worktrees. Which of the three failures can still happen?
- [x] A stash vanishing, since every worktree shares the one stash.
- [ ] An amend landing on the other session's commit, as before.
- [ ] Commits landing on the wrong branch, since HEAD still moves.
Why: Each worktree has its own HEAD and index, so the amend and the wrong branch go away. The stash is one shared ref, so that failure stays.
```

### Where it goes wrong

**Git refuses to make the worktree.** You asked for a branch that another worktree already has checked out, such as `main`. Add `-b` and a new name to make a new branch instead.

**The tests passed in a worktree, but the key test never ran.** A worktree holds only what Git tracks. So gitignored files aren't there: test data files, local databases, credentials, your `.env`. Tests that read them "can silently skip there", as Matt puts it. List those files in `.worktreeinclude`, or run that check in the main worktree.

**Two branches added one thing under two names.** Each agent sees only its own work in progress. For example, two branches can each add the same field, one as `cookTime` and the other as `cookingMinutes`. Git keeps the folders apart, so nothing clashes until the branches merge. Matt's summary: "worktrees do not remove collisions, they move them to merge time". When two pieces of work touch one shared file, run them one after the other.

**A new Claude Code worktree misses something merged minutes ago.** It starts from Git's saved copy of GitHub's default branch. Claude Code refreshes that copy only if the repo hasn't been fetched in the last 24 hours, so it can lag. `git pull origin main` catches your branch up.

**Claude Code asks "keep or remove" as you leave a worktree session.** Removing deletes the worktree's folder and its branch, along with all the work in them. Say keep until the work is merged. To come back, run the `claude --worktree <name> --resume` command it prints.

```checkpoint keep-or-remove
You leave a Claude Code worktree session. Its branch holds commits you haven't pushed, and Claude asks whether to keep or remove the worktree. What do you choose?
- [x] Keep, because removing deletes the folder, its branch and the work in them.
- [ ] Remove, because the commits are already safe on GitHub.
- [ ] Remove, because your main folder holds a copy of everything it made.
Why: Removing deletes the worktree's folder and its branch, with the work in them, and unpushed commits aren't on GitHub. Keep it until the work is merged.
```

```checkpoint same-thing-two-names
Two agents, in two worktrees, will both add a field to the same recipe file. What should you do before they start?
- [x] Run the two pieces of work one after the other, because worktrees move collisions to merge time.
- [ ] Nothing, because separate worktrees stop the two branches from ever clashing.
- [ ] Give both agents the same branch, so they see each other's work as it happens.
Why: Worktrees keep the folders apart, so a clash shows up only when the branches merge. Work that touches one shared file is safer done in turn.
```

## Cheat sheet

These only look, and change nothing:

```sh
git status                     # which branch you're on, and what's changed
git branch -vv                 # each branch, its GitHub copy, ahead/behind, its folder
git worktree list              # every folder, and the branch it shows
git log --oneline main..HEAD   # commits on this branch that main doesn't have
```

These change things:

```sh
git switch main && git pull                  # an up-to-date main
git switch -c add-search                     # a new branch, from where you are
git worktree add -b add-search ../recipes-search   # a new branch in a new folder
git worktree remove ../recipes-search        # remove a folder you're done with
git branch -d add-search                     # safe delete: refuses unmerged work
git branch -D add-search                     # forced delete, after a squash merge
```

Before you delete any branch, ask: is it `main`? Is a folder using it, or does it hold work that isn't on `main`? Is its pull request merged? Only a merged branch that no folder is using is a leftover.

```checkpoint safe-to-delete
Which branch is safe to delete?
- [x] One whose pull request was squash-merged, with an empty diff against the squash commit and no folder using it.
- [ ] One with commits GitHub doesn't have yet, which another worktree has checked out right now.
- [ ] `main`, once every feature branch has been merged into it through pull requests.
Why: Never `main`. A branch that a folder is using, or that holds unmerged work, is live. A merged branch with nothing new on it is a leftover.
```

## Try it

````try
You need Git and a practice repo on `main`, such as the `recipes` repo from [What Git and GitHub are](/learn/what-git-and-github-are). Run every command from that repo's folder. `git -C <folder>` runs a Git command in another folder.

1. Make a worktree on a new branch:

   ```sh
   git worktree add -b try-a ../recipes-try-a
   ```

2. List your worktrees:

   ```sh
   git worktree list
   ```

   You should see this folder on `main`, then `recipes-try-a` on `try-a`.
3. Commit in the new folder:

   ```sh
   git -C ../recipes-try-a commit --allow-empty -m "Hello from try-a"
   ```

4. Look for that commit from here:

   ```sh
   git log try-a --oneline -1
   ```

   You should see `Hello from try-a`, because the worktrees share one history.
5. Ask for the same branch again:

   ```sh
   git worktree add ../recipes-again try-a
   ```

   You should see Git refuse, and no new folder.
6. Make a second worktree:

   ```sh
   git worktree add -b try-b ../recipes-try-b
   ```

7. Read the marks:

   ```sh
   git branch -vv
   ```

   You should see `*` on `main`, and `+` with a folder path on `try-a` and `try-b`.
8. Add a file to the first worktree:

   ```sh
   echo "note" > ../recipes-try-a/try.txt
   ```

9. Stash that file:

   ```sh
   git -C ../recipes-try-a stash --include-untracked
   ```

   You should see `try.txt` gone from `recipes-try-a`.
10. List stashes from the second worktree:

    ```sh
    git -C ../recipes-try-b stash list
    ```

    You should see the stash you made in `recipes-try-a`.
11. Clean up:

    ```sh
    git stash drop
    git worktree remove ../recipes-try-a
    git worktree remove ../recipes-try-b
    git branch -D try-a try-b
    ```

    `-D` is needed here, because `try-a` holds a commit that was never merged.
````

## Remember

```flashcards
Q: What is a branch?
A: A movable name on one commit. It moves forward with each commit on it, and making one copies no files.

Q: What is a worktree?
A: A folder with one of the repo's branches checked out. One repo can have several, and they all share one history.

Q: What's the difference between the main worktree and a linked worktree?
A: The main worktree is the folder you cloned or created. A linked worktree is an extra folder added with `git worktree add`.

Q: Which commands start new work from an up-to-date `main`?
A: `git switch main`, `git pull`, then `git switch -c` with the new branch's name.

Q: When do you need a worktree?
A: When two or more sessions run at once. With one session, a plain branch is enough.

Q: In `git branch -vv`, what do `*`, `+` and `gone` mean?
A: `*`: this folder has the branch checked out. `+`: another worktree has it. `gone`: GitHub's copy was deleted.

Q: Why does `git branch -d` refuse after a squash merge, and what do you do?
A: The squash made a brand-new commit, so the branch's own commits never joined `main`. Check `git diff <branch> <squash-commit>` prints nothing, then use `-D`.

Q: What do all the worktrees of one repo share, and what does each keep for itself?
A: They share the history, nearly every ref (the stash included) and the config file. Each keeps its own files, its own `HEAD` and its own index.

Q: A new worktree lacks your gitignored `.env`. What's the Claude Code fix?
A: A `.worktreeinclude` file at the project root, in `.gitignore` syntax. Claude Code copies the gitignored files it matches into each new worktree.

Q: What do worktrees do to collisions between agents?
A: They don't remove them, they move them to merge time.
```

## Final test

```final-test what-a-worktree-is
What is a worktree?
- [x] A folder with one of the repo's branches checked out. One repo can have several.
- [ ] A copy of the repo on GitHub, under your own account, that only you can push to.
- [ ] A branch's line of commits, from where it split off `main` to its newest one.
- [ ] A protected branch, like `main`, that can't be merged into until checks pass.
Why: A worktree is one folder holding one branch's files. A repo can have several, each with a different branch checked out.
```

```final-test where-branches-start
You're starting a new feature on the recipe site. Where do you make its branch from?
- [x] An up-to-date `main`, the repo's default branch.
- [ ] The last feature's branch, so the history stays in one line.
- [ ] Nowhere: a new branch starts empty, and you add the files.
- [ ] GitHub's `main`, which `git switch -c` fetches by itself.
Why: You make a branch from an existing one, usually the default branch. Pull first, because your copy of `main` doesn't update itself.
```

```final-test same-branch-twice
`add-search` is already checked out in one worktree. What happens if you try to check it out in a second worktree too?
- [x] Git refuses to make the second worktree, unless you use `--force`.
- [ ] Both folders share the branch, and edits in one show up in the other.
- [ ] Git makes a copy of the branch under a new name and checks that out.
Why: A branch can be checked out in only one worktree at a time. Git treats that as a safeguard, and `--force` overrides it.
```

```final-test two-agents-two-features
Two agents need to build two features at the same time. What do you give them?
- [x] Two worktrees, each with its own branch.
- [ ] One folder, switching branches as they go.
- [ ] One branch, shared by both of them.
- [ ] Two pull requests, and no branches.
Why: One folder shows one branch, and sessions in one folder share its files, index and HEAD. Two sessions at once need two worktrees.
```

```final-test vv-gone
After `git fetch --prune`, `git branch -vv` shows `add-search 4e8b2a1 [origin/add-search: gone]`. What does `gone` mean?
- [x] The branch's copy on GitHub was deleted, though your copy remains.
- [ ] Your copy of the branch was deleted, though GitHub still has one.
- [ ] The branch has commits that GitHub doesn't have yet.
Why: `gone` means GitHub's copy no longer exists. It shows once `git fetch --prune` has made Git forget the deleted name.
```

```final-test squash-then-delete
`add-search` was squash-merged, its GitHub copy was deleted, and `git fetch --prune` has run. `git branch -d add-search` refuses, though `git diff add-search <squash-commit>` prints nothing. Why?
- [x] The squash made a brand-new commit, so the branch's own commits aren't in `main`'s history.
- [ ] Its pull request is still open on GitHub, waiting for a review.
- [ ] Git never deletes a branch that was ever pushed to GitHub.
- [ ] The branch is checked out in a worktree that Claude Code made.
Why: A squash merge lands the work as one new commit. The files match, but `-d` sees commits `main` doesn't contain, so it refuses. `-D` is safe once the diff is empty.
```

```final-test shared-stash
Two agents work in two linked worktrees of one repo. Agent A runs `git stash`, then agent B runs `git stash pop`. What happens?
- [x] B pops A's stash, because `refs/stash` is one ref that every worktree shares.
- [ ] B gets an error, because each worktree keeps its own stash list.
- [ ] Nothing changes, because only the main worktree can stash.
- [ ] B's pop goes back to A's folder, where the stash was made.
Why: A repo has one list of stashes, not one per worktree. Worktrees keep each agent's files, HEAD and index apart, but not the stash.
```

```final-test green-but-skipped
An agent reports its tests green from its own worktree, but the key test reads a gitignored `.env`. Why might green mean little?
- [x] A worktree holds only what Git tracks, so the `.env` is missing there and the test can silently skip.
- [ ] A worktree runs its tests against `main`'s code, not the code on its own branch.
- [ ] Git locks a gitignored file while another worktree has it open, so the test reads nothing.
Why: Gitignored files aren't in a new worktree, so a test that reads one can silently skip. In Claude Code, `.worktreeinclude` copies such files in.
```

```final-test collisions-merge-time
Two agents in two worktrees each add a cooking-time field to recipes, under two different names. When do you find out?
- [x] When the two branches merge, because worktrees move collisions to merge time.
- [ ] As soon as the second agent saves the file, because the folders share files.
- [ ] Never, because Git renames one of the two fields to match the other.
Why: Each worktree keeps its own files, so nothing clashes while the agents work. The clash shows up when the branches merge.
```

```sources
- [Branches](https://docs.github.com/en/pull-requests/reference/branches), GitHub Docs
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [Creating and deleting branches within your repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository), GitHub Docs
- [Managing the automatic deletion of branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches), GitHub Docs
- [About pull request merges](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges), GitHub Docs
- [Pro Git, Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell), Scott Chacon and Ben Straub
- [git-switch](https://git-scm.com/docs/git-switch), the Git project
- [git-branch](https://git-scm.com/docs/git-branch), the Git project
- [git-worktree](https://git-scm.com/docs/git-worktree), the Git project
- [gitglossary](https://git-scm.com/docs/gitglossary), the Git project
- [git-stash](https://git-scm.com/docs/git-stash), the Git project
- [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees), Anthropic (Claude Code Docs)
- [CI/CD Crash Course: Commands and Code](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e), Brad Traversy
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, 2026-08-24
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock, 2026-10-05
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05
- [/implement should use git worktrees to isolate parallel sessions (issue #429)](https://github.com/mattpocock/skills/issues/429), rekart222 and others, 2026-07-02
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
```
