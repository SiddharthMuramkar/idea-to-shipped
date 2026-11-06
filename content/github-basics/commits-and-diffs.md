---
title: Commits and diffs
slug: commits-and-diffs
summary: Read git log, git show and a diff, know what belongs in a commit and what a good message looks like, and check what an agent committed.
---

Say an agent finishes a search box for your recipe site and reports "done, committed". Its branch holds six commits, 40 files and over 2,000 added lines. Nobody reads that line by line, and you don't need to. You need to know what a commit is, and where an unfinished change can hide. Then a few commands tell you whether a commit does what you asked.

```goals
- Read `git log`, `git show` and a diff, and decide whether a commit does what you asked.
- Know the three places a change can be, and why `git status` comes before "done".
- Know what must never be committed, and why the lockfile is the exception.
- Write, or ask for, a good commit message.
- Run the four-command check after an agent says it committed.
```

## A commit is a snapshot with a parent

Most people picture a commit as a list of changes. Git doesn't store it that way.

**A commit is a snapshot of the whole project, and a diff is what changed between two snapshots.**

A snapshot is a picture of every file at one moment. Files that didn't change aren't copied again: the snapshot links to the copy Git already has. The changes you see in a diff are worked out afterwards, by comparing two snapshots.

Besides the snapshot, a commit holds its author, a date, its message and a pointer to its **parent**, the commit before it. The very first commit has no parent, and a merge commit has two. Git computes a checksum of all of that: a 40-character ID called the commit's **SHA**, or hash. You'll usually see its first seven characters, such as `a3f9c21`, which is enough to pick out one commit.

You can look at a raw commit. For example, here is `git cat-file -p a3f9c21` on the recipe site, with two notes added:

```text
tree 6f1e0b8c2d9a4e7f3b5c1a8d0e2f4b6c8a1d3e5f     ← the snapshot
parent 9c41d5a7e3b2f1c0d9e8a7b6c5d4e3f2a1b0c9d8   ← the commit before
author Sam Lee <sam@example.com> 1793079217 +0000
committer GitHub <noreply@github.com> 1793079217 +0000

Add the number of servings to each recipe (#4)
```

The `tree` line is the snapshot, and the `parent` line is the link back. The committer is GitHub, not Sam, because the commit was made on github.com when its pull request was merged. The author wrote the work; the committer made the commit.

Because every commit names its parent, the history is a chain, and each ID depends on everything before it. Change one old commit, and every commit after it gets a new ID. So `a3f9c21` means one exact state of the project, with one exact history behind it.

`git log` walks that chain backwards from where you are, newest first. "Where you are" has a name: **HEAD**, a pointer to the branch you have open. For example:

```text
$ git log --oneline
a3f9c21 (HEAD -> main, origin/main) Add the number of servings to each recipe (#4)
9c41d5a Show cooking time on each recipe (#3)
7b2e8d0 Add a page for each recipe (#2)
e2b18c4 Set up the site and its tests (#1)
5d6c0f2 Add a README
```

`git show` with an ID prints one commit: its header, message and diff. With no ID, it shows the commit HEAD points at. Add `--stat` for a list of the changed files instead of the full diff.

```checkpoint commit-records-what
An agent changes one line in `README.md` and commits. What does the new commit record?
- [x] A snapshot of every file in the project, unchanged ones linked rather than copied.
- [ ] Only the one line that changed, stored as a list of edits to the file.
- [ ] A copy of the whole branch, so that the branch can be rebuilt from it.
Why: A commit is a snapshot of all the files. Unchanged ones link to copies Git already has, and the diff is worked out later by comparing snapshots.
```

```checkpoint ids-downstream
An agent rewrites the message of `7b2e8d0`, an older commit on `main`. What happens to `9c41d5a` and `a3f9c21`?
- [x] They both get new IDs, because each ID covers its parent's ID.
- [ ] They keep their IDs, because only that one message changed.
- [ ] Git deletes them, because their parent no longer exists.
Why: Each commit's ID depends on its parent's. A new `7b2e8d0` means `9c41d5a` has a new parent, so it gets a new ID, and so on down the chain.
```

## Three places a change can be

A change passes through three places before it's part of the history. The **working tree** is the files on disk, where you or the agent edit. The **staging area**, also called the **index**, is the list of exactly what goes into the next commit. The **repository** is Git's store of commits.

Editing a file changes only the working tree. `git add` copies the file's current contents into the staging area. `git commit` turns the staging area into a new snapshot.

```diagram
type: chain
caption: "A change passes through three places before it's part of the history."
steps:
  - label: "The working tree"
    note: "the files on disk"
  - label: "The staging area"
    note: "exactly what goes into the next commit"
  - label: "The repository"
    note: "Git's store of commits"
```

The staging area takes a file as it was at the moment of `git add`. If the agent edits the file again afterwards, the commit gets the older version, and the newer edit stays behind in the working tree. Anything never added stays behind too.

`git status` tells you what is where. Say an agent is partway through the search box:

```text
$ git status
On branch add-search
Changes to be committed:
	modified:   src/search/search.ts

Changes not staged for commit:
	modified:   src/search/search.ts
	modified:   README.md

Untracked files:
	tests/search.test.ts
```

Its headings map onto the three places:

| You see | It means |
|---|---|
| Changes to be committed | Staged: these go into the next commit |
| Changes not staged for commit | Edited but not staged: these don't |
| Untracked files | New files Git has never been told about: in no commit at all |
| nothing to commit, working tree clean | Every file on disk matches the last commit |

Agents often use the short form, `git status -s`. It has two columns: the left one for the staging area, the right one for the working tree. For the same moment:

```text
$ git status -s
MM src/search/search.ts
 M README.md
?? tests/search.test.ts
```

An `M` on the left means staged, and an `M` on the right means edited but not staged. `MM` means both: staged, then edited again. `A` is a new file that's staged, and `??` is untracked.

Why would an agent stage only some of what it changed? To keep one idea per commit. If it fixed a bug and also tidied the README, those are two commits, so either one can be read, or undone, on its own. That's also why `git commit -a` is a habit to discourage: it stages every changed file Git already tracks, wanted or not.

So run `git status` before you believe "done". An agent can commit and still leave a new test file untracked, or a last fix unstaged. Neither reaches GitHub, the checks or the pull request.

Run it in the agent's folder, too. Each worktree, a second folder of the same repo, has its own staging area. So a clean folder of yours tells you nothing about the agent's. [Branches and worktrees](/learn/branches-and-worktrees) explains worktrees.

```checkpoint untracked-test
An agent says it committed. In its folder, `git status` lists `tests/search.test.ts` under "Untracked files". What does that tell you?
- [x] The test file is in no commit, so it won't reach GitHub or the checks.
- [ ] The test file is in the commit, and Git is showing it once more.
- [ ] The test ran and failed, so Git moved it out of the commit.
Why: Untracked means Git has never been told about the file, so no commit contains it. Ask the agent to commit it, or to say why not.
```

```checkpoint mm-status
`git status -s` shows `MM src/search/search.ts`. If the agent commits now, which version of that file goes in?
- [x] The version from the last `git add`.
- [ ] The newest version on disk.
- [ ] Nothing from that file at all.
Why: `MM` means staged, then edited again. The commit takes the staged version, and the later edit stays in the working tree until it's added.
```

```checkpoint one-idea-per-commit
The agent fixed the search and also tidied the README. It staged only the search files for this commit. Why is that right?
- [x] One idea per commit, so each can be read or undone on its own.
- [ ] README files must always be committed in a separate repo.
- [ ] Git refuses to commit two changed files at the same time.
Why: One logical change per commit keeps each one readable and undoable by itself. The README tidy gets its own commit.
```

## Reading a diff

A **diff** is the line-by-line difference between two versions. Which two versions depends on the command, and picking the right one is most of the skill:

| Command | Compares | Answers |
|---|---|---|
| `git diff` | The working tree with the staging area | What has been changed but not staged? |
| `git diff --staged` | The staging area with the last commit | What exactly goes into the next commit? |
| `git show <id>` | One commit with its parent | What did this commit do? |
| `git diff main...<branch>` | The point where the branch split from `main`, with the branch's newest commit | What has this branch done so far? |

Mind the dots. With three, `git diff main...add-search` compares the branch with the commit where it split off `main`, so you see only the branch's own work. With two, `main..add-search` compares the two newest commits directly. Anything `main` gained after the split then shows up as if the branch had removed it. On a fresh branch the two agree; once `main` moves on, they don't. A pull request on GitHub shows the three-dot kind.

Now the anatomy. Here is one file's diff from a commit on the agent's branch, printed by `git show 4e8b2a1 -- src/lib/cooking-time.ts`:

```diff
diff --git a/src/lib/cooking-time.ts b/src/lib/cooking-time.ts
index 3e1a9f0..b72c4d1 100644
--- a/src/lib/cooking-time.ts
+++ b/src/lib/cooking-time.ts
@@ -1,6 +1,9 @@
 /**
- * Turns minutes into text, such as "45 min".
+ * Turns minutes into text, such as "45 min" or "1 h 30 min".
  */
 export function formatCookingTime(minutes: number): string {
-  return `${minutes} min`
+  const hours = Math.floor(minutes / 60)
+  const rest = minutes % 60
+  if (hours === 0) return `${rest} min`
+  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
 }
```

Read it from the top. `diff --git a/… b/…` starts one file: `a/` is before, `b/` is after. The `index` line gives short IDs of the file's contents before and after, then its file mode. `---` and `+++` name the before and after files again. A brand-new file shows `--- /dev/null`.

Then come the **hunks**, one per changed region. Each starts with a header such as `@@ -1,6 +1,9 @@`: before, 6 lines starting at line 1; after, 9 lines starting at line 1. So that region grew by three lines. When a hunk starts further down a file, Git also prints a nearby line after the second `@@`, such as a function's first line. It tells you where you are.

Inside a hunk, a line starting with a space is **context**: unchanged, shown so you can find your place. A line starting with `-` was removed, and one starting with `+` was added. A changed line shows up as a `-` line followed by a `+` line, as in the comment at the top.

For a big change, start with the overview instead. `--stat` lists each file with a count of changed lines and a bar of `+` and `-`, then a total. For example, the agent's whole search branch:

```text
$ git diff --stat main...add-search
 package-lock.json            | 214 ++++++++++++++++++++
 package.json                 |   1 +
 public/images/no-results.png | Bin 0 -> 48213 bytes
 src/pages/index.tsx          |  18 +++--
 src/search/search.ts         |  42 ++++
 src/styles/search.css        |  25 ++
 tests/search.test.ts         |  56 +++++
 7 files changed, 352 insertions(+), 4 deletions(-)
```

Read a stat like a supervisor. Do the files fit the task? Is there a test beside each piece of code? Is anything there that shouldn't be? Are the big numbers explained? Here most of the added lines are `package-lock.json`, because the agent added a package. The image shows as `Bin` with sizes, because binary files have no lines.

Only then open the full diff, and only of the files that carry the behaviour you asked for. Use `git show <id> -- <file>` for one commit, or `git diff main...add-search -- <file>` for the whole branch.

```checkpoint which-diff-command
The agent is about to commit. You want to see exactly what that commit will contain. Which command?
- [x] `git diff --staged`
- [ ] `git show HEAD`
- [ ] `git log -1`
- [ ] `git diff`
Why: `--staged` compares the staging area with the last commit, which is exactly what `git commit` will record. `git show HEAD` is the commit already made, and plain `git diff` shows unstaged edits.
```

```checkpoint hunk-header
A hunk header reads `@@ -12,4 +12,7 @@`. What happened in that region?
- [x] It grew by three lines.
- [ ] Seven lines were deleted.
- [ ] Line 12 moved to line 7.
- [ ] Four lines were added.
Why: Before, 4 lines from line 12. After, 7 lines from line 12. The region is three lines longer.
```

```checkpoint three-dots
After the search branch split off, a pull request added `docs/adr/0002-search-in-the-browser.md` to `main`. Which command shows only the search branch's own work?
- [x] `git diff main...add-search`
- [ ] `git diff main..add-search`
- [ ] `git show add-search`
- [ ] `git diff add-search`
Why: Three dots compare from the split point, so `main`'s new ADR stays out. Two dots compare the two newest commits, so the ADR would look deleted. `git show` shows only the branch's last commit.
```

## What belongs in a commit

Commit what people and agents write: code, tests, settings and docs. Leave out what a tool can make again from those files, and never commit a secret.

`.gitignore` is how you leave things out. It lists patterns for Git to ignore, such as `node_modules/` for installed packages, `dist/` for build output, and `.env` for secret settings. [Reading a repository](/learn/reading-a-repository) shows a real one. An ignored file doesn't show up as untracked, so it can't be added by accident.

The **lockfile** is the exception: made by a tool, but committed. `package.json` names the packages the project needs. `package-lock.json` records the exact version of every package installed, including the packages those packages pulled in. Committing it means your laptop, the checks on GitHub and the server that runs the site all install the same thing.

That's why automated checks install with `npm ci`, not `npm install`. `npm install` can rewrite the lockfile. `npm ci` needs a lockfile, and deletes any existing `node_modules` first. It never writes to `package.json` or the lockfile, and it stops with an error if the two disagree. pnpm's version of the same idea is `pnpm install --frozen-lockfile`.

So when an agent adds a package, `package.json` and the lockfile must change in the same commit. If only one did, the checks fail at the install step.

Secrets are the hard rule. A key that reaches a commit stays in that snapshot. Deleting the file in a later commit doesn't touch the earlier one, and scrubbing it out means rewriting history. That's why GitHub's first step for a leaked secret is to revoke or replace it.

If you ever see `.env`, `.env.local` or a key in a diff, stop. Get a new key first, then add the missing `.gitignore` line.

```checkpoint env-in-stat
The stat for an agent's commit includes `.env.local | 2 +`. What do you do first?
- [x] Replace the key it holds, then fix `.gitignore`.
- [ ] Delete the file in another commit, then carry on.
- [ ] Nothing, because the repo is private anyway.
- [ ] Squash the commit before you merge it.
Why: The key is now in a snapshot, and a later delete doesn't remove it from that one. GitHub's first step is to revoke or replace the secret.
```

```checkpoint lockfile-missing
An agent adds a package. The stat shows `package.json` changed, but not `package-lock.json`. What will checks that run `npm ci` do?
- [x] Fail at the install step, because the two files disagree.
- [ ] Install the new package and pass anyway.
- [ ] Update the lockfile for you, then carry on.
- [ ] Skip installing the new package quietly.
Why: `npm ci` stops with an error when `package.json` and the lockfile disagree. Both must change in the same commit.
```

```checkpoint why-lockfile
Why is `package-lock.json` committed while `node_modules/` is ignored?
- [x] The lockfile pins exact versions, so `node_modules/` can be rebuilt the same everywhere.
- [ ] Git can't store folders of packages, but it can store one file.
- [ ] The lockfile is smaller, and Git has a limit on folder sizes.
Why: The lockfile records the exact package tree. Any computer can rebuild `node_modules/` from it, so the folder itself stays out.
```

## Good commits and their messages

A good commit holds one logical change, and its message tells a reviewer what changed and why. Git's long-standing advice is a subject line of about 50 characters or fewer, in the imperative: "Fix bug", not "Fixed bug". Then comes a blank line, then a body that explains why.

For example, a good message for the cooking-time commit above:

```text
Show long cooking times in hours and minutes

Recipes over an hour showed "150 min", which is hard to read at a
glance. formatCookingTime now prints "2 h 30 min", and keeps "45 min"
for anything under an hour. The tests cover 0, 45, 60 and 150 minutes.
```

The subject says what the site now does. The body says why, and what to look for in the diff.

Many projects also put a type in front, following **Conventional Commits**. The format is `<type>[optional scope]: <description>`, then an optional body and footers. The spec defines two types: `feat` for a new feature and `fix` for a bug fix. Others are allowed, such as `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` and `test`. A scope goes in round brackets after the type, and a breaking change gets a `!` before the colon. For example:

```text
feat: add a search box to the recipe list
fix(search): ignore capital letters in ingredients
ci: run the tests on every pull request
docs: record the Markdown decision as ADR-0001
```

In his CI/CD crash course video, Brad Traversy starts his CI workflow commit with `feature:`. That isn't the spec's word, and that commit adds CI anyway. His written gist gets it right, with `ci:`, `test:` and `feat:`. Plain imperative subjects work too. Pick one style per repo, and tell the agent.

One message matters more than the rest. With a **squash merge**, a pull request's commits become one new commit on `main`, and GitHub writes its message. By default, a one-commit pull request keeps that commit's message. With two or more, the pull request's title becomes the subject, with its number, and the commits are listed in the body. That's why the history above reads like a list of pull request titles.

So the line that lands on `main` is the pull request's title, or a lone commit's subject. Get that one right. [Merging and cleaning up](/learn/merging-and-cleaning-up) covers squash merges in full.

```checkpoint which-type
The agent fixed a bug where the search missed recipes with capital letters. Which Conventional Commits type fits?
- [x] `fix`
- [ ] `feat`
- [ ] `chore`
- [ ] `refactor`
Why: The spec says a bug fix uses `fix`. `feat` is for a new feature, and the other two say nothing about fixing a bug.
```

```checkpoint squash-subject
A pull request has four commits: "wip", "wip 2", "fix tests" and "done". With GitHub's default setting, what is the subject of the squash commit on `main`?
- [x] The pull request's title, with its number.
- [ ] "done", the last commit's message.
- [ ] "wip", the first commit's message.
- [ ] All four messages, joined into one line.
Why: With two or more commits, GitHub uses the pull request's title and number as the subject, and lists the commits in the body.
```

```checkpoint good-subject
Which subject follows both Conventional Commits and Git's imperative advice, for a commit that adds a CI workflow?
- [x] `ci: add the test workflow`
- [ ] `ci: added the test workflow`
- [ ] `feature: setup GitHub Actions CI`
- [ ] `Add the test workflow, ci`
Why: `ci` is the usual type for CI changes, and "add" is imperative. "Added" isn't, `feature` isn't the spec's type, and the type must come first.
```

## After an agent says "done"

Many agents commit to whatever branch is open, without making a branch or asking. The [implement](/learn/implement) Skill works that way, for example. So check the branch before work starts: it's the first line of `git status`.

When the agent says done, there is a commit for you to read. Four read-only commands, run in the agent's folder, do the check:

| Run | Look for |
|---|---|
| `git status` | The right branch, and "nothing to commit, working tree clean" |
| `git log --oneline main..HEAD` | The new commits, with subjects that name what you asked for |
| `git show --stat HEAD` | Files that fit the task: code with its tests, no secrets, no build output, no lockfile change you didn't expect |
| `git show HEAD -- <file>` | The behaviour itself, in the one or two files that carry it |

Here the two dots are right: `main..HEAD` lists the commits on your branch that `main` doesn't have.

For example, say you asked for tablespoons in the units the recipe page converts. The agent's message ends: "The units test checks the new unit too." Its stat, trimmed to the files:

```text
 src/lib/units.ts     | 1 +
 src/pages/recipe.tsx | 6 ++++--
 2 files changed, 5 insertions(+), 2 deletions(-)
```

No test file. Is the message wrong? This is where you open one file's diff, instead of trusting the message or a hunch. `git show HEAD -- src/lib/units.ts` prints this hunk, after the commit's header:

```diff
@@ -4,6 +4,7 @@ export const UNITS = [
   { name: 'teaspoon', short: 'tsp', millilitres: 5 },
   { name: 'cup', short: 'cup', millilitres: 240 },
   { name: 'gram', short: 'g', grams: 1 },
+  { name: 'tablespoon', short: 'tbsp', millilitres: 15 },
 ] as const
 
 export type Unit = (typeof UNITS)[number]
```

The commit adds one entry to `UNITS`. The existing test, in `tests/units.test.ts`, is named "converts every unit in UNITS both ways". So the new unit is tested, and the claim holds. One question, answered from the diff, not from the agent's summary.

```checkpoint committed-on-main
You asked an agent to build a feature without checking the branch first. `git status` now starts "On branch main". What happened?
- [x] The work was committed onto `main`, the branch that was open.
- [ ] The agent made a new branch for the work, named after the task.
- [ ] The agent opened a pull request, so `main` is untouched.
- [ ] The agent refused to commit, because `main` was open.
Why: Many agents commit to whatever branch is open, without asking. Moving that commit onto its own branch is undo work, covered in [Undo and merge conflicts](/learn/undo-and-conflicts).
```

```checkpoint unexpected-lockfile
You asked for a print button on the recipe page. `git show --stat HEAD` lists the page, its test, and `package-lock.json | 312 +++`. What do you ask the agent?
- [x] Which package did you add, and why?
- [ ] Why is there a test file in this commit?
- [ ] Can you delete the page's test file?
- [ ] Why is the commit so small?
Why: A lockfile change means a package changed. That may be fine, but the task didn't ask for one, so ask what was added and why. A test beside the page is what you want.
```

## Tell your agent

Use the first message when an agent is about to commit, and the second after it says done. If your repo uses plain subjects, drop the words "Conventional Commits" and keep the rest.

```text
Before you commit, show me git status and git diff --staged --stat.
Commit only the files for this task, as one commit, with a Conventional
Commits subject under 50 characters in the imperative and a body that says
why. Nothing that .gitignore covers, no .env files, no build output. If
package.json changed, the lockfile must change in the same commit.
```

```text
Show me what you committed: git status, git log --oneline main..HEAD,
git show --stat HEAD, then the full diff of the file that does the work.
Point to the lines that do what I asked for.
```

Then read the outputs yourself. The agent's summary is a claim, and the outputs are the evidence.

```checkpoint claim-or-evidence
The agent's summary says "all tests added". What settles whether that's true?
- [x] The stat and the diff, which show which test files the commit holds.
- [ ] The summary itself, because the agent ran the commands.
- [ ] The commit message, because it was written by the agent.
Why: The summary and the message are claims. The stat and the diff show what the commit actually holds.
```

## Cheat sheet

These commands only look. They change nothing, so you can run any of them at any time:

```sh
git status                      # staged, unstaged, untracked
git status -s                   # left column staged, right unstaged; ?? untracked
git log --oneline --graph -8    # the history, newest first
git log --oneline main..HEAD    # commits here that main doesn't have
git show --stat <id>            # one commit's files (no id: HEAD)
git show <id> -- <file>         # that commit's diff of one file
git diff                        # changed, not staged
git diff --staged               # exactly what the next commit gets
git diff --stat main...<branch> # the branch's own work since the split
```

And the rules in one place:

- One logical change per commit, with an imperative subject of about 50 characters, a blank line, and a body that says why.
- The lockfile changes in the same commit as `package.json`.
- Nothing `.gitignore` covers, no build output, and never a secret. If one lands, replace the key first.
- With a squash merge, the pull request's title becomes the line on `main`.

```checkpoint cheat-sheet-pick
You want to list the commits on your branch that `main` doesn't have yet. Which command?
- [x] `git log --oneline main..HEAD`
- [ ] `git diff --staged`
- [ ] `git show --stat HEAD`
- [ ] `git status -s`
Why: `main..HEAD` lists the commits reachable from your branch that aren't on `main`. The others show staged changes, one commit, or the working tree.
```

## Try it

````try
You need Git and a practice repo with at least one commit. The Try it in [What Git and GitHub are](/learn/what-git-and-github-are) makes one, called `recipes`. Run every command inside that folder.

1. Look at the history:

   ```sh
   git log --oneline --graph -5
   ```

   You should see your commits, newest first, with `HEAD -> main` on the top one.
2. Look at the newest commit's files:

   ```sh
   git show --stat HEAD
   ```

3. Add a line to the README:

   ```sh
   echo "Family recipes, shared." >> README.md
   ```

4. Check where the change is:

   ```sh
   git status
   ```

   You should see `README.md` under "Changes not staged for commit".
5. Read the change:

   ```sh
   git diff
   ```

   You should see one line starting with `+`: `+Family recipes, shared.`
6. Stage it:

   ```sh
   git add README.md
   ```

7. Compare the two diffs:

   ```sh
   git diff --staged
   ```

   You should see the same `+` line. Plain `git diff` now prints nothing, because nothing is unstaged.
8. Commit it, with an imperative subject:

   ```sh
   git commit -m "Describe the site in the README"
   ```

9. Read the new commit's stat:

   ```sh
   git show --stat HEAD
   ```

   You should see `1 file changed, 1 insertion(+)`.
10. Check that nothing was left out:

    ```sh
    git status
    ```

    You should see `nothing to commit, working tree clean`.
````

## Remember

```flashcards
Q: What is a commit?
A: A snapshot of the whole project, plus author, date, message and a pointer to its parent. Its ID, the SHA, is computed from all of that.

Q: Why does changing an old commit change every later commit's ID?
A: Each commit's ID covers its parent's ID, so a new parent means a new ID, all the way down the chain.

Q: What are the three places a change can be?
A: The working tree (files on disk), the staging area or index (what the next commit gets) and the repository (the commits).

Q: What does `MM` mean in `git status -s`?
A: Staged, then edited again. A commit now would take the staged version, not the newest one.

Q: Which command shows exactly what the next commit will contain?
A: `git diff --staged`.

Q: What's the difference between `main...branch` and `main..branch` in `git diff`?
A: Three dots compare from where the branch split off, so you see only its own work. Two dots compare the two newest commits, so anything `main` gained since looks removed.

Q: In a hunk header like `@@ -1,6 +1,9 @@`, what do the numbers mean?
A: Before: 6 lines from line 1. After: 9 lines from line 1. The region grew by three lines.

Q: Why is the lockfile committed?
A: It pins the exact version of every package, so every computer and every check installs the same thing. It changes in the same commit as `package.json`.

Q: A secret lands in a commit. What comes first?
A: Revoke or replace the secret. Deleting the file later doesn't remove it from the earlier snapshot.

Q: What are the four commands to run after an agent says "committed"?
A: `git status`, `git log --oneline main..HEAD`, `git show --stat HEAD`, and `git show HEAD -- <file>` for the file that does the work.
```

## Final test

```final-test nothing-left-out
The agent says "all done, committed". Which command best tells you nothing was left out of the commit?
- [x] `git status`
- [ ] `git log`
- [ ] `git show`
- [ ] `git diff --staged`
Why: `git status` shows unstaged edits and untracked files, the two things a commit can miss. `git log` and `git show` show only what was committed, and `git diff --staged` shows only what's staged.
```

```final-test branch-overview
You want an overview of everything the search branch has done since it split from `main`. Which command?
- [x] `git diff --stat main...add-search`
- [ ] `git show --stat add-search`
- [ ] `git diff --staged add-search`
- [ ] `git log --stat -1`
Why: Three dots compare the branch with the point where it split from `main`, and `--stat` gives the file-by-file overview. `git show` covers only the last commit.
```

```final-test belongs-in-commit
Which of these belongs in a commit?
- [x] `package-lock.json`
- [ ] `.env.local`
- [ ] `dist/`
- [ ] `node_modules/`
Why: The lockfile pins exact versions, so every computer installs the same packages. `.env.local` holds secrets, and the two folders are made by tools.
```

```final-test unstaged-edit
An agent says it committed, and wants to push. `git status` still lists `src/pages/index.tsx` under "Changes not staged for commit". What does that mean?
- [x] That edit reaches neither GitHub nor the checks, because it isn't in any commit.
- [ ] The push will carry the edit to GitHub along with the commits.
- [ ] GitHub will stage the edit for you before the checks run.
Why: Only what's staged goes into a commit, and only commits are pushed. The edit stays in the working tree until it's added and committed.
```

```final-test context-line
In a diff, what does a line that starts with a space mean?
- [x] Unchanged, shown only so you can find your place.
- [ ] Added in the new version of the file.
- [ ] Removed from the old version of the file.
- [ ] Changed only in its spaces or tabs.
Why: A leading space marks context: lines common to both versions. `+` is added and `-` is removed.
```

```final-test pr-title-matters
You're about to squash-merge a pull request with three commits. Where does careful wording matter most?
- [x] The pull request's title.
- [ ] The first commit's message.
- [ ] Each commit's body text.
- [ ] The comments in `.gitignore`.
Why: With two or more commits, GitHub's default makes the pull request's title the subject of the one commit that lands on `main`.
```

```final-test leaked-key
An agent's branch is pushed, and its stat shows `.env | 3 +`, a file with your payment provider's key. The agent offers to delete the file in a new commit. What comes first?
- [x] Replace the key, then add the missing `.gitignore` line.
- [ ] Let it delete the file, which removes the key from the history.
- [ ] Merge the pull request first, then delete the file on `main`.
Why: The key is in a snapshot that's already on GitHub. A later commit doesn't touch that snapshot, so the key must be revoked or replaced first.
```

```final-test check-the-claim
The agent's message says "the units test covers the new unit", but the stat lists no test file. What do you do?
- [x] Open the diff and the existing test, and check whether the claim holds.
- [ ] Reject the commit, because a message can't claim tests without a test file.
- [ ] Accept the commit, because the agent's message says the tests cover it.
Why: Neither the message nor a hunch settles it. The diff and the existing test do: a test that checks every unit in a list covers a new entry in it.
```

```final-test hunk-numbers
A hunk header reads `@@ -20,5 +20,3 @@`. What happened in that region?
- [x] It shrank by two lines.
- [ ] It grew by two lines.
- [ ] Line 20 moved to line 3.
- [ ] Five lines were added.
Why: Before, 5 lines from line 20. After, 3 lines from line 20. The region is two lines shorter.
```

```sources
- [Pro Git, What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F), Scott Chacon and Ben Straub
- [Pro Git, Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository), Scott Chacon and Ben Straub
- [Pro Git, Viewing the Commit History](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History), Scott Chacon and Ben Straub
- [Pro Git, Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell), Scott Chacon and Ben Straub
- [Pro Git, Contributing to a Project](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project), Scott Chacon and Ben Straub
- [Pro Git, Revision Selection](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection), Scott Chacon and Ben Straub
- [git-cat-file](https://git-scm.com/docs/git-cat-file), the Git project
- [git-log](https://git-scm.com/docs/git-log), the Git project
- [git-show](https://git-scm.com/docs/git-show), the Git project
- [git-status](https://git-scm.com/docs/git-status), the Git project
- [git-diff](https://git-scm.com/docs/git-diff), the Git project
- [Detailed description of unified format](https://www.gnu.org/software/diffutils/manual/html_node/Detailed-Unified.html), GNU diff manual
- [Branches: three-dot and two-dot Git diff comparisons](https://docs.github.com/en/pull-requests/reference/branches), GitHub Docs
- [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), GitHub Docs
- [Configuring commit squashing for pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests), GitHub Docs
- [package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json), npm Docs
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), npm Docs
- [pnpm install](https://pnpm.io/cli/install), pnpm
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- [CI/CD Crash Course: Commands and Code](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e), Brad Traversy
- [cicd-lab-starter](https://github.com/bradtraversy/cicd-lab-starter), Brad Traversy
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
```
