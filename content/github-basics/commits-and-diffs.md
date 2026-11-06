---
title: Commits and diffs
slug: commits-and-diffs
summary: Read git log, git show and a diff, and decide whether a commit does what you asked the agent to do.
---

On the evening of 27 October your front-end worktree held twelve commits that `main` didn’t have yet: 108 files and 12,730 added lines, all made by an agent. Nobody reads that line by line, and you don’t need to. You need to know what a commit is, where an unfinished change can hide, and which few commands tell you whether a commit does what you asked.

```goals
- You’ll be able to read `git log`, `git show` and a diff, and decide whether a commit does what you asked the agent to do. You’ll also know what must never be committed, what a good commit message looks like, and the four-command check to run after every `/implement`.
```

## A commit is a snapshot with a parent

Most people picture a commit as a list of changes. Git doesn’t store it that way. A **commit** is a snapshot: a picture of every file in the project at one moment. Files that didn’t change aren’t copied again; the snapshot just links to the copy git already has. The changes you see in a diff are worked out afterwards, by comparing two snapshots.

Besides the snapshot, a commit holds its author, a date, the message, and a pointer to its **parent**: the commit that came just before it. The very first commit has no parent; a merge commit has two or more. Git computes a checksum of all of that, a 40-character ID called the commit’s **SHA** (or hash). You’ll usually see only the first seven characters, such as `0cf9076`, which is enough to pick out one commit.

You can look at a raw commit. This is `git cat-file -p 0cf9076`, the commit that PR (pull request) #3 put on Care4Mind’s `main`, trimmed:

```text
tree f30be3d81c218ef8ada2ea55de7749fab934cfa1     ← the snapshot
parent 902f64f126cf2f84f269b5fc81daa449a17b8323   ← the commit before
author SiddharthMuramkar <…@users.noreply.github.com> 1793079217 +0530
committer GitHub <noreply@github.com> 1793079217 +0530
…
Chart the rebuild planning map and record the research (#3)
```

The `tree` line is the snapshot and the `parent` line is the link back. The committer is GitHub, not you, because the squash merge (Lesson 6) happened on GitHub: the author wrote the work, the committer made the commit.

Because every commit names its parent, history is a chain, and each ID depends on everything before it. Change one old commit and every commit after it gets a new ID. So `0cf9076` means one exact state of the project, with one exact history behind it.

`git log` walks that chain backwards from where you are, newest first. “Where you are” has a name: **HEAD**, a pointer to the branch you have open. Each worktree has its own HEAD. Here is Care4Mind’s `main`, all five commits, on 27 October:

```text
$ git log --oneline
76f992c (HEAD -> main, origin/main, origin/HEAD) Draft the client question list (#4)
0cf9076 Chart the rebuild planning map and record the research (#3)
902f64f Rewrite the project brief for a from-scratch rebuild (#2)
bce63c7 Sync CLAUDE.md with AGENTS.md via symlink (#1)
c08fe71 Add project brief and agent setup
```

`git show <id>` prints one commit: header, message and diff; with no ID it shows HEAD’s. Add `--stat` for a list of files instead of the full diff. For `0cf9076` it ends `33 files changed, 1227 insertions(+), 9 deletions(-)`, and the message lists three smaller commits (section 5 explains why).

```callout remember
A commit is a full snapshot plus author, date, message and a pointer to its parent. Its ID is computed from all of that, so a short ID like `0cf9076` names one exact state of the project and the history behind it.
```

```checkpoint check-1
An agent changes one line in `docs/project-brief.md` and commits. What does the new commit record?
- [ ] Only the one line that changed
- [ ] A diff against the previous commit
- [x] A snapshot of every project file
- [ ] A copy of the whole branch
Why: A commit is a snapshot of all the files; unchanged ones are stored as links to copies git already has. The diff is worked out later, by comparing the snapshot with its parent’s.
```

```checkpoint check-2
An agent rewrites the message of `902f64f`, an older commit on Care4Mind’s `main`. What happens to `0cf9076` and `76f992c`?
- [ ] They keep their current IDs
- [x] They both get new IDs
- [ ] Git deletes both of them
- [ ] Only their messages change too
Why: Each commit’s ID covers its parent’s ID. A new `902f64f` means `0cf9076`’s parent changed, so its ID changes, and so on down the chain.
```

```checkpoint check-3
You’re in `~/Desktop/project1` with `main` open. Which commit does `git show` print when you give it no ID?
- [x] The newest commit on main
- [ ] The first commit ever made
- [ ] The front-end branch’s latest commit
- [ ] Every commit since the branch
Why: `git show` defaults to HEAD, and HEAD points at the branch this folder has open: `main`, whose newest commit is `76f992c`.
```

## Three places a change can be

A change passes through three places before it’s part of history. The **working tree** is the files on disk, where the agent edits. The **staging area**, also called the **index**, is the list of exactly what goes into the next commit. The **repository** is git’s store of commits. Editing a file changes only the working tree. `git add` copies the file’s current contents into the staging area. `git commit` turns the staging area into a new snapshot.

The staging area takes a file as it was at the moment of `git add`. If the agent edits the file again afterwards, the commit gets the older version, and the newer edit stays behind in the working tree. Anything never added stays behind too.

`git status` tells you what is where. Its headings map onto the three places:

| You see | It means |
|---|---|
| Changes to be committed | Staged: these go into the next commit |
| Changes not staged for commit | Edited but not staged: these don’t |
| Untracked files | New files git has never been told about: in no commit at all |
| nothing to commit, working tree clean | Every file on disk matches the last commit |

Agents often use the short form, `git status -s`: two columns, the left for the staging area, the right for the working tree. An `M` on the left means staged, an `M` on the right means edited but not staged, and `MM` means both: staged, then edited again. `A` is a new file that’s staged, and `??` is untracked.

Why would an agent stage only some of what it changed? To keep one idea per commit. If it fixed a bug and also tidied the README, those are two commits, each with its own message, so either one can be read, or undone, on its own. That’s also why `git commit -a` is a habit to discourage: it stages every changed file git already tracks, wanted or not.

So run `git status` before you believe “done”. An agent can commit and still leave a new test file untracked, or a last fix unstaged; neither reaches GitHub, CI (the automatic checks that run on GitHub) or the PR. Run it in the agent’s folder: each worktree has its own staging area, so a clean `~/Desktop/project1` tells you nothing about the front-end worktree. On the evening of 27 October that was the picture: `~/Desktop/project1` was clean, while the front-end worktree, mid-task, had an edit to `src/app/layout.tsx` not yet staged, and was 8 commits ahead of GitHub.

```callout remember
Only what’s staged goes into a commit. Before you trust “done”, run `git status` in the agent’s folder: “nothing to commit, working tree clean” means everything it did is inside its commits.
```

```checkpoint check-4
`/implement` says it committed. In the front-end worktree, `git status` lists `tests/unit/sanskrit.test.ts` under “Untracked files”. What does that tell you?
- [ ] The test is in the commit
- [ ] The test failed and was skipped
- [ ] Git ignores test files by default
- [x] The test file was never committed
Why: Untracked means git has never been told about the file, so no commit contains it, and it won’t reach GitHub or CI. Ask the agent to commit it or say why not.
```

```checkpoint check-5
`git status -s` shows `MM src/lib/kolam.ts`. If the agent commits now, what goes in for that file?
- [ ] The newest version of the file
- [ ] Nothing from that file at all
- [x] The version from the last add
- [ ] Both versions, merged by git automatically
Why: `MM`: staged (left column), then edited again (right column). The commit takes the staged version; the later edit stays in the working tree until it’s added again.
```

```checkpoint check-6
The agent fixed the Dosha Survey scoring and also tidied the README. It staged only the scoring files for this commit. Why is that right?
- [x] Each commit should hold one idea
- [ ] README files can never be committed
- [ ] Git allows one file per commit
- [ ] Staging everything would break the tests
Why: One logical change per commit, so each can be read or undone on its own. The README tidy gets its own commit.
```

## Reading a diff

A **diff** is the line-by-line difference between two versions. Which two depends on the command, and picking the right one is most of the skill:

| Command | Compares | Answers |
|---|---|---|
| `git diff` | Working tree with staging area | What has the agent changed but not staged? |
| `git diff --staged` | Staging area with the last commit | What exactly goes into the next commit? |
| `git show <id>` | One commit with its parent | What did this commit do? |
| `git diff main...<branch>` | The point where the branch split from `main`, with the branch’s tip | What has this branch done so far? |

Mind the dots. `git diff main...branch`, with three, compares the branch with the commit where it split off `main`, so you see only the branch’s own work. With two, `main..branch` is the same as `git diff main branch`: it compares the two tips directly, so anything `main` gained after the split shows up as if the branch had removed it. On Care4Mind the two still agree, because nothing has landed on `main` since the front-end branch split off. Once something does, they won’t.

Now the anatomy. Here is a real diff of one file from the front-end commit `7d06da9`, made by the agent on 27 October (`git show 7d06da9 -- src/lib/contrast.ts`):

```diff
diff --git a/src/lib/contrast.ts b/src/lib/contrast.ts
index 5cc7e48..7f53c09 100644
--- a/src/lib/contrast.ts
+++ b/src/lib/contrast.ts
@@ -18,7 +18,7 @@ function luminance(hex: string): number {

 /**
  * The colour-token pairs every palette must pass. Text pairs need 4.5:1
- * (WCAG 1.4.3); focus rings and control edges need 3:1 (WCAG 1.4.11).
+ * (WCAG 1.4.3); focus rings, control edges and kolam drawings need 3:1 (WCAG 1.4.11).
  */
 export const CONTRAST_PAIRS = [
   { foreground: 'ink', background: 'ground', minimum: 4.5 },
@@ -32,6 +32,10 @@ export const CONTRAST_PAIRS = [
   { foreground: 'focus', background: 'ground', minimum: 3 },
   { foreground: 'surface-focus', background: 'surface', minimum: 3 },
   { foreground: 'accent', background: 'ground', minimum: 3 },
+  { foreground: 'kolam-line', background: 'ground', minimum: 3 },
+  { foreground: 'kolam-dot', background: 'ground', minimum: 3 },
+  { foreground: 'surface-kolam-line', background: 'surface', minimum: 3 },
+  { foreground: 'surface-kolam-dot', background: 'surface', minimum: 3 },
 ] as const
 
 export type ColourToken = (typeof CONTRAST_PAIRS)[number]['foreground' | 'background']
```

Read it from the top. `diff --git a/… b/…` starts one file: `a/` is before, `b/` is after. The `index` line gives short IDs of the file’s contents before and after, then its file mode. `---` and `+++` name the before and after files again; a brand-new file shows `--- /dev/null`. Then come the **hunks**, one per changed region, each with a header such as `@@ -32,6 +32,10 @@`: before, 6 lines starting at line 32; after, 10 lines starting at line 32. So that region grew by four lines. The text after the second `@@` is a line from above the change, there to show which part of the file you’re in. Inside a hunk, a line starting with a space is **context**, unchanged; `-` was removed and `+` was added. A changed line shows up as a `-` line followed by a `+` line, as in the first hunk.

For a big change, start with the overview instead. `--stat` lists each file with a count of changed lines and a bar of `+` and `-`, then a total. Here is the whole front-end branch on 27 October, cut down from 109 lines:

```text
$ git diff --stat main...SiddharthMuramkar/frontend
 .github/workflows/ci.yml                           |   75 +
 .gitignore                                         |   25 +
 package.json                                       |   51 +
 pnpm-lock.yaml                                     | 7284 ++++++++++++++++++++
 …
 src/fonts/playfair/PlayfairText-Regular.woff2      |  Bin 0 -> 65836 bytes
 …
 src/lib/kolam.ts                                   |   66 +
 …
 tests/unit/kolam.test.ts                           |  166 +
 …
 108 files changed, 12730 insertions(+), 9 deletions(-)
```

Read a stat like a supervisor. Do the files fit the ticket? Is there a test beside each piece of code? Is anything there that shouldn’t be (next section)? Are the big numbers explained? Here more than half the added lines are `pnpm-lock.yaml`, which lists every installed package, so it’s big when a project is first set up. Fonts show as `Bin` with sizes, because binary files have no lines. Only then open the full diff, of just the files that carry the ticket’s behaviour: `git show <id> -- <file>`.

```callout remember
Pick the diff by the question: `--staged` for the next commit, `git show` for one commit, `main...branch` (three dots) for a whole branch. Read `--stat` first, then the full diff of only the files that matter.
```

```checkpoint check-7
The agent is about to commit. You want to see exactly what that commit will contain. Which command?
- [ ] `git show HEAD`
- [ ] `git diff HEAD`
- [ ] `git log -1`
- [x] `git diff --staged`
Why: `--staged` compares the staging area with the last commit: exactly what `git commit` will record. `git diff HEAD` also includes unstaged edits, and `git show HEAD` is the commit already made.
```

```checkpoint check-8
A hunk header reads `@@ -32,6 +32,10 @@`. What happened in that region?
- [ ] Lines thirty-two to six were changed
- [x] The region grew by four lines
- [ ] Ten lines were deleted at 32
- [ ] Line 32 moved to line 10
Why: Before: 6 lines from line 32. After: 10 lines from line 32. The region is four lines longer; in `7d06da9` those were four added colour pairs.
```

```checkpoint check-9
After the front-end branch split off, another PR landed on `main` and added `docs/adr/0004.md`. Which command shows only the front-end branch’s own work?
- [ ] `git diff main..SiddharthMuramkar/frontend`
- [ ] `git show SiddharthMuramkar/frontend`
- [x] `git diff main...SiddharthMuramkar/frontend`
- [ ] `git diff SiddharthMuramkar/frontend`
Why: Three dots compare from the split point, so `main`’s new ADR stays out. Two dots compare the two tips, so the ADR would look deleted. `git show` shows only the branch’s last commit.
```

## What belongs in a commit

Commit what people and agents write: code, tests, config, docs. Leave out what a tool can make again from those files, and never commit a secret. A `.gitignore` file lists patterns for git to leave out: an ignored file doesn’t show up as untracked, so it can’t be added by accident.

This is the `.gitignore` in Brad’s starter repo for the CI/CD lab (Lesson 13), read through the GitHub API on 27 October:

```text
node_modules/
dist/
.env
.env*
!.env.example
*.log
.DS_Store
```

`node_modules/` holds installed packages, `dist/` is build output, and `.env` files hold secrets such as API keys; `!.env.example` makes one exception so the example file can be committed. Care4Mind’s front-end branch does the same for Next.js: `node_modules/`, `.next/`, `.vercel/`, test reports, and `.env*` except `.env.example`.

The **lockfile** is the exception: generated, but committed. `package.json` names the packages the project needs. `package-lock.json` records the exact version of every package that was installed, including the packages those packages pulled in. Committing it means your laptop, CI and Vercel all install exactly the same thing. Care4Mind’s front end uses pnpm instead of npm, so its lockfile is `pnpm-lock.yaml`: the 7,284-line file in the stat above.

That’s why CI installs with `npm ci`, not `npm install`. `npm install` can rewrite the lockfile. `npm ci` needs a lockfile, deletes any existing `node_modules` first, never writes to `package.json` or the lockfile, and stops with an error if the two disagree. Care4Mind’s CI uses pnpm’s version of the same idea, `pnpm install --frozen-lockfile`. So when an agent adds a package, `package.json` and the lockfile must change in the same commit. If only one did, CI fails at the install step.

Secrets are the hard rule. A key that reaches a commit stays in that snapshot; deleting the file in a later commit doesn’t touch the earlier one, and scrubbing it out means rewriting history. That’s why GitHub’s first step for a leaked secret is to revoke or replace it. If you ever see `.env`, `.env.local` or a key in a diff, stop: new key first, then the missing `.gitignore` line.

```callout remember
Commit what’s written, plus the lockfile. Leave out what tools install or build, and every secret. If a secret ever lands in a commit, replace the secret first.
```

```checkpoint check-10
The stat for an agent’s commit includes `.env.local | 2 +`. What do you do first?
- [ ] Delete the file in another commit
- [ ] Nothing; the repo is private anyway
- [ ] Squash the commit before you merge
- [x] Replace the key, then fix `.gitignore`
Why: The key is now in a snapshot, and a later delete doesn’t remove it from that one. GitHub’s first step is to revoke or rotate the secret. Then ignore `.env` files so it can’t happen again.
```

```checkpoint check-11
An agent adds a date library. The stat shows `package.json` changed but not `pnpm-lock.yaml`. What will Care4Mind’s CI do?
- [ ] Install it and pass anyway
- [x] Fail at the install step
- [ ] Update the lockfile for you
- [ ] Skip installing the new library
Why: CI runs `pnpm install --frozen-lockfile`, which refuses to install when the lockfile is out of sync with `package.json`. `npm ci` behaves the same way.
```

```checkpoint check-12
Why is `pnpm-lock.yaml` committed while `node_modules/` is ignored?
- [x] It pins exact versions for reinstalling
- [ ] Git cannot store folders of packages
- [ ] Vercel reads only the lockfile file
- [ ] The lockfile is smaller than `node_modules`
Why: The lockfile records the exact package tree, so anyone, CI included, can rebuild `node_modules` identically. The folder itself is something a tool can always make again.
```

## Good commits and their messages

A good commit holds one logical change, and its message tells a reviewer what changed and why. Git’s long-standing convention: a subject line of about 50 characters or fewer, in the imperative (“Fix bug”, not “Fixed bug”), then a blank line, then a body that explains the motivation and how the new behaviour differs from the old.

Your front-end agent already writes them this way. Here is `e42bfe5`, from 27 October:

```text
Generate kolams from one tested billiard path

Restore the Kolam style tile's generator from d99c935 as src/lib/kolam.ts.
It now refuses sizes that would not draw one whole kolam: sizes that share
a factor, anything that is not a positive whole number of dots, and a unit
that is not a positive length.
```

The subject says what the code now does. The body says where it came from and what it refuses, which is exactly what you’d look for in the diff. And its stat agrees: two files, `src/lib/kolam.ts` and `tests/unit/kolam.test.ts`.

Many projects also put a type in front, following **Conventional Commits**. The format is `<type>[optional scope]: <description>`, then an optional body and optional footers. The spec defines two types: `feat` for a new feature and `fix` for a bug fix. Others are allowed, and the spec points to a common set: `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` and `test`. A scope goes in round brackets after the type. A breaking change gets a `!` before the colon, or a `BREAKING CHANGE:` footer. For example:

```text
feat: add the KarmaYoga Scale page
fix(questionnaires): score each answer by its points
ci: run the Playwright tests on every pull request
docs: record the Next.js decision as ADR-0003
```

In the video, Brad starts the message for his CI workflow commit with `feature:`. `feature` isn’t the spec’s word: a new feature MUST use `feat`, and this commit only adds CI anyway. His written gist gets it right, with `ci:`, `test:` and `feat:`. This course’s repo started with `chore: put the course under git`; Care4Mind’s commits so far use plain imperative subjects. Both work. Pick one per repo and tell the agent.

One message matters more than the rest. With a squash merge (Lesson 8), a PR’s commits become one new commit on `main`, and GitHub writes its message. By default, a one-commit PR keeps that commit’s message; with two or more, the PR title becomes the subject and the commits are listed in the body. That’s `0cf9076`: PR #3 had three commits, so its subject is the PR title plus “(#3)”. This course’s repo always uses the PR title and description. So the line that lands on `main` is the PR title, or a lone commit’s subject. Get that one right.

```callout remember
One idea per commit, a short imperative subject, a body that says why. With squash merges, the PR title (or a lone commit’s subject) becomes the line on `main`, so that’s the one to get right.
```

```checkpoint check-13
The agent fixed a bug where the Dosha Survey counted the wrong option. Which Conventional Commits type fits?
- [ ] `feat`
- [x] `fix`
- [ ] `chore`
- [ ] `refactor`
Why: The spec says `fix` MUST be used for a bug fix. `feat` is for a new feature, and the other two say nothing about fixing a bug.
```

```checkpoint check-14
On Care4Mind, PR #5 has four commits: “wip”, “wip 2”, “fix tests” and “done”. With the default setting, what is the subject of the squash commit on `main`?
- [ ] The last commit’s message, done
- [ ] The first commit’s message, wip
- [ ] All four messages, one line
- [x] The pull request’s title, numbered
Why: Two or more commits: GitHub uses the PR title (with the PR number, as on `0cf9076`) and lists the commits in the body. So the PR title is what to get right.
```

```checkpoint check-15
Which subject follows both Conventional Commits and Pro Git’s advice, for a commit that adds a CI workflow?
- [ ] `feature: setup GitHub Actions CI`
- [ ] `ci: added the verification workflow`
- [x] `ci: add the verification workflow`
- [ ] `Add the verification workflow, ci`
Why: `ci` is the usual type for CI changes, and “add” is imperative. `feature` isn’t the spec’s type, “added” isn’t imperative, and the type must come first.
```

## After /implement says done

Lesson 5 covered what `/implement` does. Its last step matters here: after the full test suite and `/code-review` have run, it commits to the current branch, without creating a branch or asking which. So check the branch before you start (the first line of `git status`). When it says done, there is a commit for you to read.

There’s one known gap. `/code-review` reviews `git diff <fixed-point>...HEAD`: three dots, as in section 3, so committed work only. `/implement` runs it _before_ committing, so on a fresh branch the review can have nothing to look at. Matt’s own advice is to commit first, then review against the point you branched from. In practice: after `/implement`, run `/code-review` yourself, with `main` as the fixed point.

Then check the commit. Four read-only commands, in the agent’s folder:

| Run | Look for |
|---|---|
| `git status` | The right branch, and “nothing to commit, working tree clean” |
| `git log --oneline main..HEAD` | The new commits; a subject that names the ticket’s behaviour |
| `git show --stat HEAD` | Files that fit the ticket: code with its tests, no secrets, no build output, no lockfile change you didn’t expect |
| `git show HEAD -- <file>` | The behaviour itself, in the one or two files that carry it |

Here is that check on `7d06da9`, the front-end commit from section 3. Its message ends: “The contrast test checks all four at 3:1.” Its stat:

```text
 src/components/Folio.module.css |  2 ++
 src/components/Kolam.module.css | 56 +++++++++++++++++++++++++++++++++++++++++
 src/components/Kolam.tsx        | 49 ++++++++++++++++++++++++++++++++++++
 src/lib/contrast.ts             |  6 ++++-
 src/styles/globals.css          |  7 ++++++
 5 files changed, 119 insertions(+), 1 deletion(-)
```

No test file. Is the message wrong? This is where you open one file’s diff instead of trusting the message or your hunch. The `src/lib/contrast.ts` diff from section 3 adds four entries to `CONTRAST_PAIRS`, and the existing test, `tests/unit/contrast.test.ts`, checks every pair on that list. So the claim holds; no new test was needed. One question, answered from the diff, not from the agent’s summary.

```callout remember
`/implement` ends with a commit on whatever branch is open. Check the branch first. Afterwards, read that commit: status clean, stat fits the ticket, and the key file’s diff does what you asked. Then run `/code-review` against `main`.
```

```checkpoint check-16
You ran `/implement` in `~/Desktop/project1` without checking first. `git status` now starts “On branch main”. What happened?
- [ ] It made a branch called implement
- [x] The work was committed onto main
- [ ] It opened a pull request instead
- [ ] It refused to commit on main
Why: `/implement` commits to the branch you’re on; it doesn’t create one or ask. Moving that commit onto its own branch is undo work (Lesson 9).
```

```checkpoint check-17
Why can `/implement`’s own `/code-review` find nothing to review on a fresh branch?
- [ ] It reviews only the main branch
- [ ] It skips files without any tests
- [x] It runs before anything is committed
- [ ] It needs a pull request first
Why: `/code-review` reads `git diff <fixed-point>...HEAD`, which covers commits only. `/implement` runs it before its commit, so run it again yourself afterwards, against `main`.
```

```checkpoint check-18
The ticket: add the KarmaYoga Scale page. `git show --stat HEAD` lists the page, its test, and `pnpm-lock.yaml | 312 +++`. What do you ask the agent?
- [x] Which package was added, and why?
- [ ] Why is there a test file?
- [ ] Can you delete the page test?
- [ ] Why is the commit so small?
Why: A lockfile change means a dependency changed. That may be fine, but the ticket didn’t ask for one, so ask what was added and why. A test beside the page is exactly what you want.
```

## Tell your agent

Use the first when an agent is about to commit outside `/implement`, and the second after every `/implement`. If Care4Mind keeps plain subjects, drop the words “Conventional Commits” and keep the rest.

```text
Before you commit, show me git status and git diff --staged --stat.
Commit only the files for this ticket, as one commit, with a Conventional
Commits subject under 50 characters in the imperative and a body that says
why. Nothing that .gitignore covers, no .env files, no build output. If
package.json changed, the lockfile must change in the same commit.
```

```sh
Show me what you just committed: git status, git log --oneline main..HEAD,
git show --stat HEAD, then the full diff of <file>. Point to the lines that
do what the ticket asked. Then run /code-review with main as the fixed point.
```

## Try it

These commands only read; they change nothing. Run them in `~/Desktop/project1`:

```sh
git log --oneline --graph -8
git show --stat 0cf9076
git diff --stat main...SiddharthMuramkar/frontend
git status
```

You should see five commits, not eight, because `main` has only five, in one straight line: each squash merge added one commit with one parent. The top one carries `HEAD -> main`. `0cf9076`’s message lists PR #3’s three commits, and its stat ends at 33 files changed. The front-end stat ends with a total: 108 files on 27 October, more as the agent works. `git status` should say `nothing to commit, working tree clean`. Then read one diff by hand: `git show 7d06da9 -- src/lib/contrast.ts`.

## Check yourself

From memory, without scrolling up.

```final-test final-19
The agent says “all done, committed”. Which command best tells you nothing was left out of the commit?
- [ ] `git log`
- [ ] `git show`
- [ ] `git diff`
- [x] `git status`
Why: `git status` shows unstaged edits and untracked files, the two things a commit can miss. `git diff` doesn’t show untracked files, and `git log` and `git show` show only what was committed.
```

```final-test final-20
You want an overview of everything the front-end branch has done since it split from `main`. Which command?
- [ ] `git show --stat SiddharthMuramkar/frontend`
- [x] `git diff --stat main...SiddharthMuramkar/frontend`
- [ ] `git diff --staged SiddharthMuramkar/frontend`
- [ ] `git log --stat -1`
Why: Three dots compare the branch with the point where it split from `main`, and `--stat` gives the file-by-file overview. `git show` covers only the last commit.
```

```final-test final-21
Which of these belongs in a commit?
- [x] `pnpm-lock.yaml`
- [ ] `.env.local`
- [ ] `.next/`
- [ ] `node_modules/`
Why: The lockfile pins exact versions, so CI and Vercel install the same packages you did. `.env.local` holds secrets, and the two folders are made by tools.
```

```final-test final-22
You’re about to squash-merge a three-commit PR on Care4Mind. Where does careful wording matter most?
- [ ] The first commit’s message
- [ ] Each commit’s body text
- [x] The pull request’s title
- [ ] The .gitignore file’s comments
Why: With two or more commits, GitHub’s default makes the PR title the subject of the one commit that lands on `main`.
```

```final-test final-23
In a diff, what does a line that starts with a space mean?
- [ ] Added in the new version
- [x] Unchanged, shown only for context
- [ ] Removed from the old version
- [ ] Changed only in its whitespace
Why: A leading space marks context: lines common to both versions, shown so you know where you are. `+` is added and `-` is removed.
```

## Read next

**Read:** [Pro Git §2.2, Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository), about fifteen minutes. It walks files through untracked, staged, modified and committed with real `git status` and `git diff` output, which is the picture behind every check in this lesson. Skip “Removing Files” and “Moving Files” for now.

Keep the Commits & PRs cheat sheet open the next time `/implement` says done.

```sources
- [Pro Git §1.3, What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F)
- [Pro Git §3.1](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [Pro Git §7.1](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection)
- [git-cat-file docs](https://git-scm.com/docs/git-cat-file)
- [Pro Git §2.3](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)
- [GitHub Docs, Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [git-log docs](https://git-scm.com/docs/git-log)
- [git-show docs](https://git-scm.com/docs/git-show)
- [Pro Git §2.2](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
- [Pro Git §5.2](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)
- [git-worktree docs](https://git-scm.com/docs/git-worktree)
- [git-diff docs](https://git-scm.com/docs/git-diff)
- [gitattributes docs](https://git-scm.com/docs/gitattributes)
- [GNU diff manual](https://www.gnu.org/software/diffutils/manual/html_node/Detailed-Unified.html)
- [GNU diff manual](https://www.gnu.org/software/diffutils/manual/html_node/Specified-Headings.html)
- [Brad’s gist](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e)
- [cicd-lab-starter](https://github.com/bradtraversy/cicd-lab-starter)
- [npm docs, package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json)
- [npm ci docs](https://docs.npmjs.com/cli/v11/commands/npm-ci)
- [pnpm docs](https://pnpm.io/cli/install)
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- [GitHub Docs, Configuring commit squashing](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)
- [implement/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md)
- [Matt’s /implement article](https://www.aihero.dev/skills-implement)
- [code-review/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md)
```
