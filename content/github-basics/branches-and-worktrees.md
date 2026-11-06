---
title: Branches and worktrees
slug: branches-and-worktrees
summary: A worktree is a folder with one of the repo's branches checked out, and one repo can have several.
---

## What a worktree is

Say Tickets #13 and #14 of your "Booking API" Spec are [ready to build](/learn/issues-and-keeping-track): the endpoint that creates a booking, and a bookings page. You start two agents in your repo's folder, one on each. But a folder holds one branch's files at a time. When one agent switches branch, the files change under the other, and its next commit can land on the wrong branch.

```checkpoint quick-1
Two agents work in one repo folder, and one of them switches branch. What happens to the other?
- [x] Its files change under it, and its next commit can land on the wrong branch.
- [ ] Nothing changes for it, because git keeps a separate set of files per agent.
- [ ] Git refuses the switch, because another agent is still editing in that folder.
Why: A folder holds one branch's files at a time. So when one agent switches branch, the other's files change too, and its next commit can land on the wrong branch.
```

So each agent needs its own folder. To **check out** a branch is to put its files in a folder to work on.

**A worktree is a folder with one of the repo's branches checked out, and one repo can have several.**

## Making worktrees

The `git worktree` commands create and remove worktrees. Say you're on `main` in `yoga-studio`, your practice booking site's folder. You run:

```
git worktree add ../yoga-13 -b 13-create-booking
git worktree add ../yoga-14 -b 14-list-bookings
```

`..` means "the folder above", so `../yoga-13` is a new folder next to `yoga-studio`. `-b 13-create-booking` makes a new branch with that name. So each line makes a new branch, and a new folder with that branch checked out. You now have three folders. They all share one history, the record of all commits, so a commit in `yoga-13` is visible from the other two.

```checkpoint quick-2
You're about to run `git worktree add ../yoga-15 -b 15-cancel-booking`. What will you get?
- [x] A new branch, and a new folder with that branch checked out.
- [ ] A new branch only, and you still have to make its folder yourself.
- [ ] A new folder only, with `main` checked out in it until you switch.
Why: Each `git worktree add` line with `-b` makes a new branch, and a new folder with that branch checked out.
```

```diagram
type: git
caption: "They all share one history"
branches:
  - name: "`main`"
    commits: 3
  - name: "`13-create-booking`"
    from: { branch: "`main`", after: 2 }
    commits: 2
  - name: "`14-list-bookings`"
    from: { branch: "`main`", after: 2 }
    commits: 2
worktrees:
  - branch: "`main`"
    label: "`yoga-studio`"
  - branch: "`13-create-booking`"
    label: "`yoga-13`"
  - branch: "`14-list-bookings`"
    label: "`yoga-14`"
```

The folder you cloned or created, here `yoga-studio`, is the **main worktree**. A normal repo has exactly one. Each extra folder, made with `git worktree add`, is a **linked worktree**.

A branch can be checked out in only one worktree at a time. Ask for `13-create-booking` in a second worktree and git refuses, unless you add the flag `--force`, an extra option that overrides the refusal. Done with a worktree? Remove it with `git worktree remove`.

```checkpoint quick-3
`main` is checked out in `yoga-studio`. You run `git worktree add ../yoga-main main`. What happens?
- [x] Git refuses, because `main` is already checked out in a worktree.
- [ ] Git makes the folder, and both folders stay on `main` from then on.
- [ ] Git makes a copy of `main` under a new name, and checks that out.
Why: A branch can be checked out in only one worktree at a time, so git refuses. Only `--force` overrides that refusal.
```

## Where a branch starts

Both new branches started from `main`. You always make a new branch from an existing one, usually the **default branch**. The default branch is the repo's first branch. It's the one GitHub shows when anyone visits, and the one a new pull request merges into unless you pick another. GitHub names it `main` by default.

A branch made for one feature is often called a **feature branch** or topic branch. Give each Ticket its own, and one Ticket's half-done code stays away from the others. When the work is ready, it usually goes back into `main` through a [pull request](/learn/merging-and-cleaning-up).

```checkpoint quick-4
Tickets #13 and #14 each get their own branch. What does that give you?
- [x] #13's half-done code stays away from #14's until the work is ready.
- [ ] #14 can build straight on #13's half-done code as it gets written.
- [ ] #13's commits and #14's commits go into `main` as soon as they're made.
Why: With a branch per Ticket, one Ticket's half-done code stays away from the others. When the work is ready, it usually goes back into `main` through a pull request.
```

## Why agents use them

Worktrees let agents build different Tickets side by side. Matt Pocock, who wrote most [Skills](/learn/issues-and-keeping-track) taught here, relies on them. You'll meet them again in [implement-spec](/learn/implement-spec), the Skill that builds a whole Spec using many helper agents. It runs one fresh helper agent per Ticket, each in its own worktree on its own branch.

```checkpoint quick-5
You run implement-spec on a Spec with five Tickets. How does it build them?
- [x] With five fresh helper agents, each in its own worktree on its own branch.
- [ ] With five fresh helper agents, taking turns in one worktree on one branch.
- [ ] With one fresh helper agent, working through the five in its own worktree.
Why: implement-spec runs one fresh helper agent per Ticket, each in its own worktree on its own branch. So each one has its own files to edit while it works.
```

## Going deeper

### Why it exists

Git's own example of a worktree has no agent in it. You're in the middle of a refactor, a big reshuffle of your code, and your files are a mess, and someone needs an urgent fix. So you make a temporary linked worktree, fix it there, remove it, and carry on.

Agents need the same separation. Take [implement](/learn/implement), the Skill that builds a Spec or Tickets, then commits. Matt warns that running several of its sessions side by side in one folder "is worse than unsupported".

His reason: the sessions share one set of files, one index and one HEAD. The **index** is git's stored version of your files. **HEAD** is git's marker for what you have checked out, normally your current branch.

```checkpoint quick-6
You run two sessions side by side in one folder. What do they share?
- [x] One set of files, one index and one HEAD.
- [ ] One set of files, but a HEAD and index each.
- [ ] Separate files, but one index and one HEAD.
Why: Two sessions in one folder share its files, its index (git's stored version of those files) and its HEAD (git's marker for what you have checked out).
```

So one session's commit or branch switch changes what the others are working on. A worktree per session gives each one its own files, index and HEAD.

### How it works underneath

Git gives each linked worktree a private folder inside the main worktree's `.git/worktrees/`. The linked folder holds a `.git` file that points back there. Take `yoga-13` from above:

```
yoga-studio/.git/                     the history and config all worktrees share
yoga-studio/.git/worktrees/yoga-13/   private to yoga-13: its HEAD, its index
yoga-13/.git                          a file that points back to that private folder
```

A **ref** is a name that points to something git stores, such as a commit. Every branch is a ref. Every ref is shared, except three special kinds that git keeps per worktree for its own bookkeeping.

So here's what's shared, and what each worktree keeps for itself:

- **Shared:** the history, nearly every ref, and the config file, where the repo's settings live.
- **Kept apart:** its files, its `HEAD` and its index.

```checkpoint quick-7
You make a new linked worktree. What does it keep for itself?
- [x] Its files, its `HEAD` and its index.
- [ ] The history and the repo's config file.
- [ ] Nearly every ref the repo has so far.
Why: Each worktree keeps its own files, `HEAD` and index. The history, nearly every ref and the config file are shared.
```

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

A **stash** is where git temporarily stores uncommitted work, and it lives at `refs/stash`. So a repo has one list of stashes, not one per worktree. Agent A can run `git stash` in its worktree, and agent B can take that work back out in another, with `git stash pop`.

```checkpoint quick-8
You stash work in `yoga-13`, then run `git stash list` in `yoga-14`. What do you see?
- [x] The stash you made in `yoga-13`, since a repo has one list of stashes.
- [ ] An empty list, since each worktree keeps a separate stash list of its own.
- [ ] An error, since only the main worktree can ever hold or list a stash.
Why: The stash lives at `refs/stash`, and nearly every ref is shared. So a repo has one list of stashes, not one per worktree.
```

Claude Code builds on worktrees. `claude --worktree feature-auth` makes a worktree under `.claude/worktrees/feature-auth/`, on a new branch named `worktree-feature-auth`. Add `.claude/worktrees/` to your `.gitignore`, the file listing what git should leave out of commits. Otherwise those folders show up in your main worktree as files git doesn't track yet.

### A real example

In July 2026, a user opened issue #429 on Matt's repo. They were running several implement sessions at once in one folder, one per issue. In a single afternoon:

- one session's `git commit --amend`, which changes the latest commit, landed on the other session's commit;
- a stash "silently disappeared";
- commits landed on the wrong branch, because HEAD had moved under a session.

Their verdict: "None of these were reasoning mistakes." The agents' thinking was fine. Two sessions were writing to shared git state, with nothing keeping them apart. So the user asked for a worktree per session, each with its own directory, index and HEAD.

Three days later, another user replied that worktrees fix only two of the three. The amend and the wrong branch go away, because each worktree has its own HEAD and index. The vanished stash doesn't, because "refs/stash is a single shared ref across every worktree".

```checkpoint quick-9
Your agents move into separate worktrees. Which of the three failures can still happen?
- [x] A stash vanishing, since every worktree shares the one stash.
- [ ] An amend landing on the other session's commit, as before.
- [ ] Commits landing on the wrong branch, since HEAD still moves.
Why: Each worktree has its own HEAD and index, so the amend and the wrong branch go away. The stash is one shared ref, so that failure stays.
```

That reply's advice: where agents work side by side, don't use `git stash` to set work aside. Commit it on your own branch instead. Matt agrees about the stash: "worktrees alone do not fix the stash case".

```checkpoint quick-10
Agents work side by side in one repo. How should one of them set its work aside?
- [x] Commit it on its own branch, not with `git stash`.
- [ ] Stash it, since each worktree has a stash of its own.
- [ ] Stash it, since `git stash` only ever touches one agent.
Why: The stash is one ref that every worktree shares, so one agent's stash can vanish under another. A commit on your own branch stays yours.
```

The issue was closed in October 2026. Its closing reply was written by AI while sorting new issues, and says so. It sends parallel Tickets to implement-spec, which merges each Ticket's branch into one shared branch. If you run several implement sessions side by side, it says to start each in its own worktree, for example with `claude --worktree`.

So a worktree per agent fixes what it keeps apart. What's shared, like the stash, stays shared.

### Where it goes wrong

**Git refuses to make the worktree.** One cause: you asked for a branch that another worktree already has checked out, such as `main`. Add `-b` and a new name to make a new branch instead.

**A Ticket reported green, meaning its tests passed, but its key test never ran.** A worktree holds only what git tracks, meaning the files committed to the repo. So gitignored files, the ones `.gitignore` lists, aren't there: fixtures (test data files), local databases, credentials (passwords and keys), your `.env`. Tests that read them "can silently skip there". In Claude Code, add a `.worktreeinclude` file at the project root, written in `.gitignore` syntax. Claude Code copies the gitignored files it matches into each new worktree. Or run that Ticket's check in the main worktree instead.

```checkpoint quick-11
A new Claude Code worktree is missing your gitignored `.env`. What do you add?
- [x] A `.worktreeinclude` file at the project root, in `.gitignore` syntax.
- [ ] A `--force` flag on `git worktree add`, which brings gitignored files along.
- [ ] A `.gitignore` entry that tells git to share the `.env` between them.
Why: A worktree holds only what git tracks, so gitignored files aren't there. Claude Code copies the gitignored files that `.worktreeinclude` matches into each new worktree.
```

**Two Tickets added one thing under two names.** Each helper agent sees only its own Ticket and the shared notes, never another's work in progress. So one user's two Tickets added the same piece of text data under the names `blockedSince` and `blockedOn`. Git kept the files apart, so nothing clashed until the branches merged. Matt puts it this way: "worktrees do not remove collisions, they move them to merge time". When two Tickets touch one shared file, add a blocked-by link so they run one after the other. Or have the exploration notes, which an earlier helper agent saves for the others, fix the exact names each Ticket adds.

```checkpoint quick-12
You see that two Tickets will touch one shared file. What should you do before they run?
- [x] Add a blocked-by link, so the two Tickets run one after the other.
- [ ] Give them separate worktrees, which stop the two Tickets ever clashing.
- [ ] Let both run side by side, and leave any clash for the final merge.
Why: Worktrees don't remove collisions, they move them to merge time. A blocked-by link makes the Tickets run in turn. Or the exploration notes can fix the exact names each one adds.
```

### Try it

See the sharing for yourself. You'll need your practice project, `yoga-studio`, on `main`. If you haven't set it up, do [keeping track](/learn/issues-and-keeping-track)'s Try it step first. Run every command from its root folder. `git -C <folder>` runs a git command in that folder.

1. Make a worktree on a new branch: `git worktree add ../yoga-try-a -b try-a`.
2. List your worktrees: `git worktree list`. You should see this folder on `main`, then `yoga-try-a` on `try-a`.
3. Commit in the new folder: `git -C ../yoga-try-a commit --allow-empty -m "Hello from try-a"`.
4. Look for that commit from here: `git log try-a --oneline -1`. You should see "Hello from try-a".
5. Ask for the same branch again: `git worktree add ../yoga-again try-a`. You should see git refuse, and no new folder.
6. Make a second worktree: `git worktree add ../yoga-try-b -b try-b`.
7. Add a file to the first worktree: `echo "note" > ../yoga-try-a/try.txt`.
8. Stash that file: `git -C ../yoga-try-a stash --include-untracked`. You should see `try.txt` gone from `yoga-try-a`.
9. List stashes from the second worktree: `git -C ../yoga-try-b stash list`. You should see the stash you made in `yoga-try-a`.
10. If your project has a gitignored file, such as a `.env`, run `ls -a ../yoga-try-a`. You shouldn't see it there.
11. Clean up with these four commands:

```
git stash drop
git worktree remove ../yoga-try-a
git worktree remove ../yoga-try-b
git branch -D try-a try-b
```

### Read more

- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock, updated 2026-10-05
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, updated 2026-08-24
- [/implement should use git worktrees to isolate parallel sessions (issue #429)](https://github.com/mattpocock/skills/issues/429), rekart222 and others, opened 2026-07-02
- [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees), Anthropic (Claude Code Docs), read 2026-10-30
- [git-worktree Documentation](https://git-scm.com/docs/git-worktree), the Git project, read 2026-10-29

## Remember

```flashcards
Q: What is the default branch, and what does GitHub call it in a new repo?
A: The branch GitHub shows when anyone visits the repo, and the one new pull requests target unless you pick another. It starts as the repo's first branch, and GitHub calls it `main` in a new repo.

Q: What's the difference between the main worktree and a linked worktree?
A: The main worktree is the folder you cloned or created. A linked worktree is an extra folder added with `git worktree add`.

Q: How does implement-spec give each helper agent its own files to edit?
A: A fresh helper agent builds each Ticket in its own worktree, on its own branch.

Q: What do all the worktrees of one repo share, and what does each keep for itself?
A: They share the history, every ref under `refs/` except three kinds (branches and the stash included) and the config file. Each keeps its own files, its own `HEAD` and its own index.

Q: What do worktrees do to collisions between agents?
A: They don't remove them, they move them to merge time. Two Tickets can still add the same field under two names, and you find out only when the branches merge.

Q: Claude Code makes a new worktree, and your gitignored `.env` isn't in it. What file fixes that, and how is it written?
A: A `.worktreeinclude` file at the project root, written in `.gitignore` syntax. Claude Code copies the gitignored files it matches into each new worktree.
```

## Final test

```final-test branches-and-worktrees-what-a-worktree
What is a worktree?
- [x] A folder with one of the repo's branches checked out. One repo can have several.
- [ ] A copy of the repo on GitHub, under your own account, that only you can push to.
- [ ] A branch's line of commits, from where it split off `main` to its latest one.
- [ ] A protected branch, like `main`, that can't be merged into until checks pass.
Why: A worktree is one folder holding one branch's files. A repo can have several, each with a different branch checked out, so you aren't stuck on one branch at a time.
```

```final-test branches-and-worktrees-where-branches
You're starting a new Ticket on a FastAPI backend. Where do you usually make its branch from?
- [x] The default branch of the repo, which is usually `main`.
- [ ] Nowhere. A new branch starts empty and you add files.
- [ ] The last Ticket's branch, so history stays in one line.
Why: You always make a branch from an existing one, so it starts with that branch's commits. You usually pick the default branch, so the new Ticket starts from `main`, not from another Ticket's half-done code.
```

```final-test branches-and-worktrees-same-branch-twice
The branch `13-create-booking` is already checked out in one worktree. What happens if you try to check it out in a second worktree too?
- [x] Git refuses to make the second worktree, unless you use `--force`.
- [ ] Both folders share the branch, and edits in one show up in the other.
- [ ] Git makes a copy of the branch under a new name and checks that out.
Why: By default, a branch can be checked out in only one worktree at a time. Git treats that as a safeguard, so it refuses to make the second one. `--force` overrides the refusal.
```

```final-test branches-and-worktrees-deeper-shared
Two agents work in two linked worktrees of one repo. Agent A runs `git stash`, then agent B runs `git stash pop`. What happens?
- [x] B can pop A's stash, because `refs/stash` is one ref that every worktree of the repo shares.
- [ ] B gets an error, because each worktree keeps its own stash and B's own stash list is still empty.
- [ ] Nothing changes, because git only allows stashing in the main worktree and A's stash was refused.
- [ ] B pops A's stash into A's folder, because a stash always goes back to the worktree that made it.
Why: The stash lives at `refs/stash`, and every ref under `refs/` is shared, except three kinds. So a repo has one list of stashes, not one per worktree. Worktrees keep each agent's files, HEAD and index apart, but B's pop can still take what A stashed.
```

```final-test branches-and-worktrees-deeper-silent
A helper agent reports a Ticket green from its own worktree, but the key test reads a gitignored `.env`. Why might green mean little?
- [x] A worktree holds only what git tracks, so the `.env` is missing there and the test can silently skip.
- [ ] A worktree runs tests against `main`'s code rather than its own branch, so the result is for the wrong code.
- [ ] Git locks a gitignored file while another worktree has it open, so the test reads an empty copy of the `.env`.
Why: A worktree holds only what git tracks, so a gitignored `.env` isn't there. A test that reads it can silently skip, so the Ticket reports green though its key test never ran. In Claude Code, a `.worktreeinclude` file copies such files in.
```

```sources
- [Branches](https://docs.github.com/en/pull-requests/reference/branches)
- [git-worktree](https://git-scm.com/docs/git-worktree)
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [block-dangerous-git.sh is bypassed by any git global option (e.g. git -C <dir> push) · Issue #301 · mattpocock/skills](https://github.com/mattpocock/skills/issues/301), stoneLeaf, 2026-06-03
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, 2026-08-24
- [Git - gitglossary Documentation](https://git-scm.com/docs/gitglossary), The Git project
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05
- [Run parallel sessions with worktrees (Claude Code Docs)](https://code.claude.com/docs/en/worktrees), Anthropic
- [/implement should use git worktrees to isolate parallel sessions · Issue #429 · mattpocock/skills](https://github.com/mattpocock/skills/issues/429), rekart222, 2026-07-02
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock, 2026-10-05 (page says Updated Oct 5, 2026)
- [Orca skills registry & MCP — Orca Docs](https://www.onorca.dev/docs/cli/skills), Stably, Inc.
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
```
