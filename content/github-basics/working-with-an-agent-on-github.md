---
title: Working with a coding agent on GitHub
slug: working-with-an-agent-on-github
summary: Let a coding agent type the git and gh commands while you decide what to ask, check its work, run two sessions at once, and organise bigger work.
---

Say you've started using a coding agent. You type one sentence, commands scroll past, and a pull request appears on GitHub. It's fast, but is it what you asked for? Then you want two agents working at once, and your plans grow bigger than one session can hold. This lesson shows what to ask for, what to check, and how to keep parallel and bigger work in order.

```goals
- You'll be able to ask an agent for each git and GitHub step in plain words, and check what it did with look-only commands.
- You'll be able to run two agent sessions at once, each in its own worktree, without them colliding.
- You'll be able to organise bigger work the way Matt Pocock does: a Spec, its Tickets, and one pull request per Ticket.
```

## The agent types, you decide

A coding agent is an AI that reads your files, runs commands and writes code from your terminal. This lesson uses Claude Code, Anthropic's agent, but the habits fit any agent. [How coding agents work](/learn/how-agents-work) explains what goes on inside.

**Let the agent type the commands, and keep three jobs yourself: saying what to do, checking what it did, and deciding what merges.**

The agent can run every git and `gh` command the earlier lessons taught, from `git switch -c` to `gh pr merge`. In its default mode, Claude Code asks your permission before it runs a shell command. The exception is a built-in set of read-only ones, such as `ls` and the read-only forms of `git`. So you see each command that changes something before it runs.

Your evidence comes from look-only commands, which show you something and change nothing. Run them yourself, in a second terminal, whenever the agent reports back. The agent's summary is a claim. The command's output is the proof.

| You want to know | Run |
|---|---|
| Which branch the agent is on, and what's left uncommitted | `git status` |
| Which commits the branch adds | `git log --oneline main..HEAD` |
| Which files the pull request changes | `gh pr diff --name-only` |
| The pull request's base branch, title and description | `gh pr view` |
| Whether the checks passed | `gh pr checks` |
| Whether the Issue closed | `gh issue view <number> --json state` |

```checkpoint quick-1
The agent reports: "Done. Committed, pushed and opened the pull request." What do you do next?
- [x] Run `git status`, `gh pr view` and `gh pr checks` yourself, to see the evidence.
- [ ] Merge the pull request, because the agent has told you every step is done.
- [ ] Ask the agent to repeat its summary, to make sure it hasn't changed its mind.
Why: The agent's summary is a claim. Look-only commands change nothing and show you what really happened, so you run them yourself.
```

## What to ask for

Agents do what you say, so say the parts that matter. Each of these asks heads off a common mistake.

- "Start Issue #7 on a new branch from an up-to-date `main`." Otherwise the agent may commit on whatever branch is open, even an old, finished one.
- "One pull request per Issue, into `main`, saying `Closes #7`." Small pull requests get better reviews, and the Issue closes when the pull request merges.
- "Show me the diff before you commit, and the test output after." You want evidence, not the words "tests pass".
- "Don't merge." Merging is your decision, after your [Merge check](/learn/checking-a-pr).
- "Stop and ask before anything that rewrites or deletes: `reset --hard`, `push --force`, deleting a branch." [Undo and merge conflicts](/learn/undo-and-conflicts) shows why.

Put together, for the cooking times on your `recipes` site, that's one message:

> Start Issue #7 on a new branch from an up-to-date `main`. Show me the diff before you commit. Then push, and open a pull request into `main` that says `Closes #7`. Show me the test output. Don't merge.

If you give the same asks every time, write them down where the agent reads them at the start of each session, such as `CLAUDE.md`. [Instruction files](/learn/instruction-files) shows how.

```checkpoint quick-2
You asked: "Fix the pancake card and open a pull request." The agent committed on `7-cooking-time`, whose pull request was squash-merged last week. Which ask would have prevented it?
- [x] "Start on a new branch from an up-to-date `main`."
- [ ] "Show me the test output after you commit."
- [ ] "Don't merge the pull request when you're done."
Why: Without it, the agent commits on whatever branch is open. A squash-merged branch is finished, so new work needs a new branch from the latest `main`.
```

### Checking its pull request

When the pull request is up, check it before you even start your Merge check:

- The base is `main`, and the description says `Closes` and the right Issue number: `gh pr view`.
- The branch adds only this change's commits: `git log --oneline main..HEAD`.
- The files are the ones you expected, and no others: `gh pr diff --name-only`, or the **Files changed** tab.
- Nothing is left behind: `git status` says "nothing to commit, working tree clean".
- The checks are green, and you know what they test: `gh pr checks`.

Anything wrong goes back to the agent, fixed on the same branch. A push updates the pull request, and the checks run again.

```checkpoint quick-3
`gh pr diff --name-only` lists `src/recipe-card.js`, its test, and `package-lock.json`, which you didn't expect. What do you do?
- [x] Ask the agent why that file changed, and have it fix the branch if it shouldn't have.
- [ ] Merge anyway, because files the checks didn't fail on can't do any harm.
- [ ] Close the pull request, because an unexpected file means starting again.
Why: The files should be the ones you expected, and no others. An unexpected file goes back to the agent, and a fix pushed to the same branch updates the pull request.
```

## Two sessions at once

Two agents can work at once, on two Issues, if you keep them apart. Here's how.

### Why one folder isn't enough

Say one session adds cooking times (Issue #7) while a second adds a dark mode (Issue #9). In one folder, they share one checked-out branch and one set of files. When one switches branch, the files change under the other, and its next commit can land on the wrong branch.

One developer described an afternoon of this in a public issue on Matt Pocock's Skills repo. An amend landed on the other session's commit, a stash vanished, and commits landed on the wrong branch. Their verdict: "None of these were reasoning mistakes." Nothing was keeping the two sessions apart.

```checkpoint quick-4
Two sessions work in one folder, and one switches branch. What happens to the other?
- [x] Its files change under it, and its next commit can land on the wrong branch.
- [ ] Nothing, because git keeps a separate set of files for each session.
- [ ] Git refuses the switch, because another session is working in the folder.
Why: A folder holds one branch's files at a time. When one session switches, the other's files change too.
```

### Give each session its own worktree

A [worktree](/learn/branches-and-worktrees) is a separate folder with its own branch checked out, sharing the repo's history. Claude Code can make one and start a session in it:

```sh
claude --worktree 9-dark-mode
```

That makes a folder, `.claude/worktrees/9-dark-mode/`, on a new branch named `worktree-9-dark-mode`, starting from your default branch. Ask the session to rename the branch with `git branch -m 9-dark-mode`. Add `.claude/worktrees/` to your `.gitignore`, so the folder doesn't show up as new files in your main checkout. Or make the worktree by hand:

```sh
git worktree add ../recipes-dark-mode -b 9-dark-mode
cd ../recipes-dark-mode
claude
```

A new worktree is a fresh checkout. It holds only what git tracks, so it has no installed dependencies and no gitignored files such as `.env`. Ask the new session to install the dependencies and copy `.env` in. A `.worktreeinclude` file can make `claude --worktree` copy listed files for you; `git worktree add` ignores it.

Two running copies of your site can't share a port, the number in its local address, such as `localhost:3000`. So give the second copy its own. If your site has a database, give each copy its own too, or a migration in one changes it for both.

```checkpoint quick-5
You start a second copy of your site from a new worktree. What does it need?
- [x] Its dependencies installed, a copy of `.env`, its own port, and its own database if there is one.
- [ ] Nothing, because a worktree copies every file from your project's folder, `.env` included.
- [ ] A fresh clone of the repo, because a worktree can't run the site on its own.
Why: A worktree holds only what git tracks. Gitignored files and installed dependencies aren't there, and two running copies can't share a port.
```

### Split the files, and stay current

Neither session sees what the other is changing. So split who owns which files before the second one starts. Say, in the first session:

> You own `src/recipe-card.js` and its tests. Ask me before changing anything else. Commit your work instead of using `git stash`.

In the second, say the same with `style.css` and `src/theme.js`. Why no stash? `git stash` sets unfinished changes aside, but every worktree shares one stash list. So one session can take back the other's work.

Worktrees keep sessions apart while they work, but not forever. As Matt Pocock puts it, "Worktrees don't remove collisions; they postpone them to merge time." So before each pull request, and again before your Merge check, have the session bring in the latest `main`:

> Merge the latest `main` into this branch and push. If git prints `CONFLICT`, stop and tell me.

The agent runs `git fetch` first, which refreshes `origin/main`, your copy of GitHub's `main`. Then check from that worktree's folder: `git log --oneline HEAD..origin/main` should print nothing. That means no commit on GitHub's `main` is missing from the branch.

One collision git can't see: two sessions adding the same thing under two names, such as `cookTime` in one file and `cookingMinutes` in another. The changes don't overlap, so git merges them without a conflict. Agree on the exact names first, or run the two one after the other.

```checkpoint quick-6
Two sessions run in two worktrees. One has half-done work to set aside, and offers `git stash`. What do you say?
- [x] Commit it on this branch instead, because every worktree shares one stash list.
- [ ] Go ahead, because each worktree keeps its own stash list, apart from the other's.
- [ ] Go ahead, because git lets only one session at a time use the stash list.
Why: `git stash` sets changes aside on a list that every worktree shares, so one session can take the other's work. A commit stays on the session's own branch.
```

## Bigger work: a Spec, Tickets and pull requests

Some changes are too big for one session: say, a shopping list built from your recipes. You need a plan that outlives any one conversation. Matt Pocock, a developer and teacher, publishes a popular set of Skills: named instructions an agent loads when you type them, such as `/to-spec`. His **main flow** is one way to organise big work. [The main flow](/learn/main-flow) maps all of it.

| Step | What it does | What appears on GitHub |
|---|---|---|
| Grilling, with [grill-with-docs](/learn/grill-with-docs) | The agent interviews you until you share one understanding. | Nothing. |
| [to-spec](/learn/to-spec) | Writes a **Spec**: the plan for one whole feature, with its decisions. | One Issue. |
| [to-tickets](/learn/to-tickets) | Splits the Spec into **Tickets**, each one session's work, joined by blocked-by links. | Sub-issues of the Spec, once you approve its list. |
| [implement](/learn/implement) | Builds one Ticket and commits to your current branch. | Nothing, until you ask for a push and a pull request. |
| [implement-spec](/learn/implement-spec) | Builds every Ticket in one run, each in its own worktree. | A draft pull request for the whole Spec, if you ask for one. |

Say `/to-spec` writes Spec #20, "Shopping list". `/to-tickets` splits it into three Tickets: #21 adds a recipe's ingredients to the list, #22 shows the list page, and #23 ticks off bought items. #22 is blocked by #21, and #23 by #22. [Issues: keeping track of work](/learn/issues-and-keeping-track) shows how sub-issues and blocked-by links work.

On github.com, the Spec's page lists its sub-issues and how many are closed. Each Ticket's sidebar shows its links under **Relationships**. In the terminal, `gh issue view 22` prints a `Blocked by:` row. A Ticket is next once nothing open blocks it, so here #21 comes first. The row keeps listing a blocker after it closes, so make sure each one has closed.

```checkpoint quick-7
Spec #20 has two open Tickets. #22's only blocker, #21, has closed. #23's blocker, #22, is still open. Which Ticket is next?
- [x] #22, because nothing open blocks it any more.
- [ ] #23, because working on it is how its blocker gets cleared.
- [ ] Neither, because both still show a `Blocked by:` row.
Why: A Ticket can start once every Issue blocking it has closed. The `Blocked by:` row keeps listing closed blockers, so check whether each one is still open.
```

### One pull request per Ticket, or one big branch

Your default is one pull request per Ticket, into `main`, saying `Closes` and that Ticket's number. Each Merge check stays small, and each Ticket closes as its work lands.

implement-spec works differently. It merges each Ticket's branch into one shared **integration branch**, not into `main`. Those merges close nothing, because GitHub acts on `Closes` only when a pull request merges into the default branch. The Tickets close when the integration branch's pull request merges into `main`, at the end of the run.

```diagram
type: git
caption: "Those merges close nothing"
branches:
  - name: "`main`"
    commits: 2
  - name: "integration branch"
    from: { branch: "`main`", after: 1 }
    commits: 1
    merge: { into: "`main`", label: "pull request merges into `main`" }
  - name: "each Ticket's branch"
    from: { branch: "integration branch", after: 1 }
    commits: 2
    merge: { into: "integration branch", label: "Those merges close nothing" }
```

The cost: you stop reading each Ticket's work as it lands, and review it all at the end. Matt Pocock names the rough edge himself: "The result is one big branch, and there is no good answer to that yet." So pick one big branch only if you'll read it all at the end.

When you come back to a Spec after a break, read the Spec first, then its open Tickets. Matt puts the reason this way: "Its value is that the tickets are disposable and the spec is not." The Tickets close one by one, and the Spec keeps the reasoning.

```checkpoint quick-8
You're running implement-spec. Three Tickets' branches have merged into the integration branch, and all three Tickets still show as open. What's going on?
- [x] Nothing's wrong: they close when the integration branch's pull request merges into `main`.
- [ ] The merges failed, so the agent should merge the three branches in again.
- [ ] GitHub closes Issues in batches, so the three will close by themselves soon.
Why: GitHub acts on `Closes` only when a pull request merges into the default branch. Merges into the integration branch close nothing, so the Tickets close at the end of the run.
```

## Try it

````try
You need a git repo of your own, such as `recipes`, with nothing uncommitted. Claude Code is optional.

1. In your project's folder, make a second worktree on a practice branch:

```sh
git worktree add ../recipes-practice -b practice-second-session
```

2. Run `git worktree list`. You should see your project's folder first, then a line for `recipes-practice` ending in `[practice-second-session]`.
3. Go there and look: `cd ../recipes-practice`, then `git status`. It says `On branch practice-second-session`, while your project's folder stays on its own branch.
4. Optional: run `claude` here to start a second session, and ask "Which branch are you on?" Then type `/exit`.
5. Go back to your project's folder, then remove the practice worktree and its branch:

```sh
cd ../recipes
git worktree remove ../recipes-practice
git branch -d practice-second-session
```

6. Run `git worktree list` again. You should see only your project's folder.

To practise through an agent, ask: "Make a worktree with `git worktree add`, on a new practice branch, `practice-second-session`." Check with `git worktree list`. Then ask it to remove the worktree and delete the branch, and check again.
````

## Going deeper

### Where it goes wrong

**`/implement` has finished, but GitHub shows nothing.** It ends at a commit on your current branch, and never touches the Ticket. Ask the agent to push and open the pull request, saying `Closes` and the Ticket's number.

**A Ticket looks blocked, though its blocker's work has merged.** On one big branch, the blocker closes only when the integration branch's pull request merges. So ask the agent to track what has merged into that branch.

**The Spec has a `ready-for-agent` label you didn't add.** to-spec adds it. On a Spec it means no more triage, the sorting and labelling of new Issues, is needed. It's input for an agent, not an order to build the whole Spec. An agent running unwatched can't tell the difference, so remove the label once `/to-tickets` has run.

**`git switch main` fails in the second worktree.** Git won't check out a branch that another worktree has open, and `main` is open in your project's folder. You don't need it there: merge `origin/main` into the branch from where you are.

```checkpoint quick-9
`/implement` says it has finished a Ticket, but the Ticket is still open and GitHub shows no pull request. What do you do?
- [x] Ask the agent to push and open the pull request, saying `Closes` and the Ticket's number.
- [ ] Run `/implement` on the Ticket again, because its commit was lost on the way.
- [ ] Wait, because `/implement` opens the pull request once the checks have run.
Why: `/implement` ends at a commit on your current branch. Pushing and opening the pull request are separate asks.
```

**A test passes in the new worktree, but it never really ran.** A test that reads gitignored files can skip quietly when they're missing. Copy those files in, then run the test again.

**A stash has vanished.** Another session may have popped it from the shared list. Ask the agent to look for it among the dangling commits, ones no branch leads to, with `git fsck`. Next time, commit instead.

**A session edits files outside its share.** You may have given the split only in conversation, and `/compact`, which replaces the conversation with a summary, lost it. Put the split in `CLAUDE.local.md` in that worktree: a personal instruction file that Claude Code reads like `CLAUDE.md`, kept out of git with `.gitignore`.

**GitHub says `CONFLICTING`, but a merge on your computer is clean.** Some repos give a file the rule `merge=union` in `.gitattributes`, which tells git to keep both sides' lines. Git on your computer obeys it, and GitHub ignores it. Have the agent merge `main` in locally and push. If git doesn't stop, the mark was false.

```checkpoint quick-10
GitHub marks your pull request `CONFLICTING`. The only file both branches changed has the rule `merge=union`. What do you do first?
- [x] Have the agent merge the latest `main` in locally, and report any `CONFLICT`.
- [ ] Close the pull request and rebuild the work, because GitHub can't merge it.
- [ ] Delete the `merge=union` line and push, because the rule causes the conflict.
Why: Git obeys `merge=union` and keeps both sides' lines, but GitHub ignores it. So a merge on your computer gives the real answer: if git doesn't stop, the mark was false.
```

## Remember

```flashcards
Q: What three jobs stay yours when an agent types the commands?
A: Saying what to do, checking what it did with look-only commands, and deciding what merges.

Q: Which asks head off the most common agent mistakes?
A: A new branch from an up-to-date `main`; one pull request per Issue saying `Closes #N`; the diff and the test output; "don't merge"; stop before anything that rewrites or deletes.

Q: What do worktrees do to collisions between two sessions?
A: They don't remove them. They postpone them to merge time, so split the files first and merge the latest `main` in before each pull request.

Q: Why commit instead of `git stash` when two sessions run?
A: Every worktree shares one stash list, so one session can take the other's work.

Q: What does a new worktree lack?
A: Installed dependencies and gitignored files such as `.env`. A second running copy also needs its own port, and its own database if there is one.

Q: In Matt Pocock's main flow, what are a Spec and its Tickets?
A: The Spec is one Issue holding the plan and decisions for a whole feature. Tickets are its sub-issues, each one session's work, joined by blocked-by links.

Q: Which Ticket is next?
A: An open one with nothing open blocking it.

Q: Why do Tickets stay open while implement-spec merges their branches?
A: GitHub acts on `Closes` only on merges into the default branch. They close when the integration branch's pull request merges into `main`.
```

## Final test

```final-test final-evidence
The agent says every check on its pull request passed. How do you confirm that before your Merge check?
- [x] Run `gh pr checks` yourself, because a look-only command shows the evidence.
- [ ] Ask the agent to say it again, because a repeated summary is more reliable.
- [ ] Run `git push` yourself, because a push reruns the checks and shows the result.
- [ ] Nothing, because an agent can't report a check as passed when it failed.
Why: The agent's summary is a claim. A look-only command changes nothing and shows you what really happened.
```

```final-test final-back-after-a-week
You come back to a project after a week away. Its Issue list is long, and you've lost track of what you decided. What do you read first?
- [x] The Spec, because it keeps the decisions, then its Tickets' blocked-by links for what's next.
- [ ] The newest Ticket, because its description repeats every decision in the Spec.
- [ ] The lowest-numbered open Ticket, because Tickets are a list you work from the top.
- [ ] The newest pull request, because its description records every decision from grilling.
Why: Tickets close one by one, and the Spec stays as the one place that records the reasoning. The blocked-by links then show what can start.
```

```final-test final-same-lines
You give two sessions their own worktrees, and both change the same lines of one file. What happens?
- [x] Each edits its own copy with no warning, and the collision shows up at merge time.
- [ ] Git stops the second session from editing that file until the first one merges.
- [ ] Nothing goes wrong, because worktrees keep their branches from ever colliding.
- [ ] GitHub combines both edits when the second pull request merges, with no conflict.
Why: Worktrees keep sessions apart while they work and postpone collisions to merge time. So you split who owns which files before the second session starts.
```

```final-test final-stash
Two sessions run in two worktrees. One has half-done work to set aside and offers `git stash`. What do you say?
- [x] Commit it on this branch instead, because every worktree shares one stash list.
- [ ] Go ahead, because each worktree keeps its own stash list, apart from the other's.
- [ ] Move it to the other worktree first, because only one folder can use a stash.
- [ ] Go ahead, but run `git stash` from your project's main folder, not the worktree.
Why: The stash list is shared by every worktree, so one session can take the other's work. A commit stays on the session's own branch.
```

```final-test final-new-worktree
A second session's tests pass in its new worktree, but you suspect they never really ran. What's the likely cause?
- [x] The tests read gitignored files, such as `.env`, that the new worktree doesn't have.
- [ ] Tests can't run in a worktree, so git skips them and reports a pass instead.
- [ ] The first session is holding the test files open, so the second sees empty ones.
- [ ] The worktree has its own copy of the history, so its tests run against old code.
Why: A worktree holds only what git tracks. A test that reads gitignored files can skip quietly when they're missing, so copy them in and run it again.
```

```final-test final-which-is-next
A Spec has two open Tickets. One has a `Blocked by:` row whose only Issue has closed. The other's blocker is still open. Which is next?
- [x] The first, because nothing open is blocking it.
- [ ] The second, because working on it is how its open blocker gets cleared.
- [ ] Neither, because a Ticket can't start while it has any `Blocked by:` row.
- [ ] Either, because a `Blocked by:` row is only a note and doesn't affect the order.
Why: A Ticket can start once every Issue blocking it has closed. The row keeps listing closed blockers, so count only the open ones.
```

```final-test final-implement-done
You run `/implement` on a Ticket. It says it's finished, but the Ticket is still open and GitHub shows no pull request. What's the likely cause, and the fix?
- [x] It ends at a commit on your current branch, so ask the agent to push and open the pull request.
- [ ] It failed part way through and lost its commit, so run `/implement` on the Ticket again.
- [ ] It opened the pull request into the wrong branch, so ask the agent to move it to `main`.
- [ ] It closes Tickets after CI has run on the commit, so wait for the checks and look again.
Why: `/implement` commits to the open branch and never touches the Ticket. Pushing and opening the pull request, with `Closes` and the number, are separate asks.
```

```final-test final-shared-branch
You chose implement-spec, with one integration branch and one pull request. What do you give up compared with one pull request per Ticket?
- [x] Reading each Ticket's work as it lands, because you review it all at the end.
- [ ] Running the checks, because an integration branch's pull request has none.
- [ ] Closing the Tickets, because they stay open even after the pull request merges.
- [ ] Using worktrees, because implement-spec builds every Ticket in one folder.
Why: Each Ticket's branch merges into the integration branch, and only its one pull request reaches `main`. So the whole Spec's work comes to you at once.
```

```sources
- [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees), Claude Code docs
- [Configure permissions](https://code.claude.com/docs/en/permissions), Claude Code docs
- [How Claude remembers your project](https://code.claude.com/docs/en/memory), Claude Code docs
- [git worktree](https://git-scm.com/docs/git-worktree), The Git project
- [git stash](https://git-scm.com/docs/git-stash), The Git project
- [git log](https://git-scm.com/docs/git-log), The Git project
- [gitattributes](https://git-scm.com/docs/gitattributes), The Git project
- [git fsck](https://git-scm.com/docs/git-fsck), The Git project
- [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests), GitHub Docs
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs
- [Adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues), GitHub Docs
- [Creating issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies), GitHub Docs
- [Merge conflicts](https://docs.github.com/en/pull-requests/reference/merge-conflicts), GitHub Docs
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [gh pr diff](https://cli.github.com/manual/gh_pr_diff), GitHub CLI manual
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub CLI manual
- [gh issue view](https://cli.github.com/manual/gh_issue_view), GitHub CLI manual
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock
- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [/implement should use git worktrees to isolate parallel sessions](https://github.com/mattpocock/skills/issues/429), rekart222, 2026-07-02
- [Pull request conflicts: Support merge=union in .gitattributes file](https://github.com/orgs/community/discussions/9288), GitHub Community
- [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), Google Engineering Practices
```
