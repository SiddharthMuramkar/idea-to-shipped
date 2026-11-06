---
title: How teams protect main
slug: how-teams-do-it
summary: How teams guard main with rulesets, required checks and reviews, CODEOWNERS and naming conventions, and how a solo project's rules differ from a big team's.
---

Say `recipes` was yours alone, and you merged your own pull requests whenever you liked. Then two friends join, one to add recipes and one to fix the code. One day a rushed merge breaks the site. Another day an agent force-pushes `main`, and a friend's commit vanishes. On a shared repo, good habits aren't enough: you want rules that hold even when someone is in a hurry.

```goals
- You'll be able to say what a ruleset or branch protection rule does to `main`, and set one up on github.com.
- You'll be able to read a repo's rules with `gh ruleset check`, and tell which checks and reviews a merge needs.
- You'll be able to write a CODEOWNERS file, and follow a team's naming conventions.
- You'll be able to pick rules that fit a project of one, a small team or a big one.
```

## What changes on a team

On your own repo, GitHub lets you merge your own pull request whenever you like. On a team's repo, you can click merge and find the button switched off. The merge box says a review is required, and nothing merges until a teammate approves.

**On a shared repo, rules on `main` decide what may merge, other people review your pull request, and you still answer for it.**

Rules make the team's habits hold when someone is in a hurry. Reviews add a second pair of eyes. Neither takes the change off your hands. If you wrote it, or ran the agent that wrote it, you answer for it, as [Checking a pull request](/learn/checking-a-pr) explains.

```checkpoint quick-1
A teammate approved your pull request, and it merged. Later it breaks the site. Who answers for the change?
- [x] You do, because you wrote it or ran the agent that did, even though it was reviewed.
- [ ] Your reviewer does, because their approval took the change off your hands.
- [ ] The rules on `main` do, because they allowed the merge to go through.
Why: Rules and reviews catch problems, but neither takes the change off your hands. Whoever wrote it, or ran the agent that wrote it, still answers for it.
```

## Rules that protect `main`

GitHub has two tools for this. A **ruleset** is a named list of rules that applies to the branches you choose, such as `main`. A **branch protection rule** is the older, classic kind, set up per branch. You'll meet both. When both cover a branch, all their rules apply, and where two of them disagree, the stricter one wins.

These are the rules teams use most. Each one's short name in brackets is how `gh` and GitHub's API spell it.

| Rule | What it does |
|---|---|
| Require a pull request before merging (`pull_request`) | Every change reaches `main` through a pull request. Its options add required approvals, code owner review and more. |
| Require status checks to pass (`required_status_checks`) | Named checks must pass before a merge. |
| Block force pushes (`non_fast_forward`) | Nobody can rewrite `main`'s history. A new ruleset ticks it for you. |
| Restrict deletions (`deletion`) | Nobody can delete `main`. Also ticked by default. |
| Require linear history (`required_linear_history`) | Only squash or rebase merges, so `main` gets no merge commits. |

Both tools are free on public repos. On a private repo, they need a paid plan, such as GitHub Pro or Team. Anyone who can read a repo can see its rulesets.

A ruleset can name people or apps allowed to bypass it. Leave that list empty, and its rules hold for everyone, admins included. Classic rules work the other way: admins bypass them unless you tick **Do not allow bypassing the above settings**.

```checkpoint quick-2
A ruleset on `main` has **Block force pushes** and an empty bypass list. You're the repo's admin, and you try to force-push `main`. What happens?
- [x] GitHub refuses the push, because the rule holds for everyone, you included.
- [ ] The push goes through, because admins skip every rule on their own repo.
- [ ] The push goes through, but GitHub undoes it once the checks have run.
Why: With an empty bypass list, a ruleset's rules hold for everyone, admins included. Only classic rules let admins through by default.
```

### Setting up a ruleset on github.com

You need admin access to the repo. Then:

1. On your repo's page, click **Settings**.
2. In the sidebar, under "Code, planning, and automation", find **Rulesets**.
3. Click **New ruleset**, then **New branch ruleset**.
4. Under "Ruleset name", type a name, such as `Protect main`.
5. Set **Enforcement status** to **Active**. A new ruleset starts out disabled, and a disabled ruleset enforces nothing.
6. Under "Target branches", click **Add target**, then **Include default branch**.
7. Under "Branch protections", keep **Restrict deletions** and **Block force pushes** ticked. Tick **Require a pull request before merging** and **Require status checks to pass**, then add each check by name.
8. Click **Create**.

For the classic kind, go to **Settings**, then **Branches**, and click **Add classic branch protection rule**. Type `main` as the branch name pattern, tick the same kinds of options, and save.

```checkpoint quick-3
You created a ruleset for `main`, but direct pushes to `main` still go through. What's the likely cause?
- [x] Its enforcement status was left at Disabled, so it enforces nothing.
- [ ] Rulesets take a day to start working on a repo that had none before.
- [ ] Rulesets only apply to pull requests, never to pushes made from a terminal.
Why: A new ruleset starts out disabled. It enforces its rules only once its status is Active.
```

### Reading a repo's rules

To see the rules on a repo's default branch, run:

```sh
gh ruleset check --default
```

Run it in your project's folder, or add `--repo <owner>/<repo>` for any repo you can read. On github.com, the same list is at `https://github.com/<owner>/<repo>/rules`. Here is Neon, a public database project, shortened:

```text
5 rules apply to branch main in repo neondatabase/neon

- creation
- deletion
- non_fast_forward
- pull_request: [allowed_merge_methods: [squash]] … [require_code_owner_review: true] … [required_approving_review_count: 1] [required_review_thread_resolution: true] …
- required_linear_history
```

So on Neon, a change to `main` comes through a pull request and is squash-merged. It needs one approval, from a code owner when the files have one, and every review thread resolved. The ruleset also blocks deleting or force-pushing `main`.

`gh ruleset check` lists rules from rulesets only. A classic branch protection rule doesn't show there, so `0 rules` doesn't prove `main` is unprotected. Look under **Settings**, then **Branches**, or run `gh api repos/<owner>/<repo>/branches/main --jq .protected`, which prints `true` for a branch with classic protection.

```checkpoint quick-4
`gh ruleset check --default` prints `0 rules apply to branch main`. Can you be sure `main` is unprotected?
- [x] No, because a classic branch protection rule doesn't show in that list.
- [ ] Yes, because that command lists every kind of rule GitHub has.
- [ ] No, because the command only works on repos with a paid plan.
Why: `gh ruleset check` lists rules from rulesets. A classic branch protection rule protects a branch without being part of one, so check under Settings, then Branches.
```

## Required checks

A check that fails blocks a merge only if a rule names it as required. The others are advice. You can still merge past them, so read them anyway. `gh pr checks --required` lists only the ones that block.

A rule finds a required check by its name, the job name in your [workflow file](/learn/reading-a-workflow). Say the rule requires `test`, and someone renames the job to `tests`. Nothing reports under `test` any more, so the merge box shows it as expected, "Waiting for status to be reported", forever. More commits won't help. Rename the job back, or change the rule. And question any pull request that edits the checks themselves.

The status checks rule has one more option: **Require branches to be up to date before merging**. With it, a pull request's branch must include the latest `main` before it merges, so the checks run on what `main` will become. GitHub calls that strict. Without it, a pull request whose checks passed against last week's `main` can merge and then break, because `main` changed underneath it.

Busy repos often use a **merge queue** instead. GitHub tests each queued pull request on top of the latest `main` and every pull request ahead of it, then merges them in order. Merge queues need a repo owned by an organization, a GitHub account that a team shares. It can be any public one, or a private one on GitHub Enterprise Cloud.

```checkpoint quick-5
Your pull request renamed the CI job from `test` to `tests`. The ruleset requires `test`, and the merge box has waited for it for an hour. What do you do?
- [x] Rename the job back to `test`, or change the rule to require `tests`.
- [ ] Push an empty commit, so the checks start again under the right name.
- [ ] Wait longer, because GitHub is still queueing the renamed check.
Why: A required check is found by its name. Nothing reports under `test` any more, so the wait never ends, however many commits you push.
```

## Reviews and code owners

A **reviewer** reads your pull request and submits one of three decisions: **Comment**, **Approve** or **Request changes**. A rule can require a number of approvals before a merge, counting only people with write access to the repo.

Two details catch people out. You can't approve your own pull request. And an agent that uses your GitHub login opens pull requests as you, so you can't approve those either. A rule can also dismiss approvals when new commits arrive, so an approval always covers what will merge.

To ask for a review on github.com, click **Reviewers** in the pull request's sidebar and pick a teammate. In the terminal, run `gh pr edit 8 --add-reviewer ben-t`.

```checkpoint quick-6
You work alone, and your agents open pull requests with your GitHub login. You add a rule requiring one approval. What happens to their pull requests?
- [x] None can merge, because nobody but you can approve them, and you're the author.
- [ ] You approve each one, then merge it, as you would a teammate's.
- [ ] The agents approve each other's pull requests, so the rule is met.
Why: Authors can't approve their own pull requests, and your agents' pull requests are yours. On a repo of one, a required approval blocks every merge.
```

A **CODEOWNERS** file names who is responsible for which files. Put it in `.github/`, in the repo's root, or in `docs/`. Each line is a file pattern, written like a `.gitignore` line, then one or more owners. Say your team is Ana, Ben and Cara:

```text
# Everything, unless a later line says otherwise
*             @ana-k @ben-t
# The recipes themselves
/recipes/     @cara-m
# The workflow files that run the checks
/.github/     @ana-k
```

The last matching line wins, so a change to `recipes/pancakes.md` asks only Cara. When a pull request changes a file, GitHub requests a review from that file's owners. For a draft, it waits, and asks them when you mark the draft ready. Code owners need write access to the repo.

On its own, CODEOWNERS only requests reviews. To make an owner's approval required, tick **Require review from Code Owners** in the rule.

```checkpoint quick-7
With the CODEOWNERS file above, a pull request changes only `.github/workflows/ci.yml`. Whose review does GitHub request?
- [x] Ana's, because `/.github/` is the last line that matches the file.
- [ ] Ana's and Ben's, because the `*` line matches every file in the repo.
- [ ] Cara's, because she owns the recipes the workflow builds.
Why: In a CODEOWNERS file, the last matching line wins. `/.github/` comes after `*`, so only Ana is asked.
```

## Naming conventions

A **convention** is a habit the whole team follows, so names carry meaning and tools can rely on them. Three kinds matter most.

- **Branches.** Many teams start a branch name with its Issue's number, like `7-cooking-time`, so anyone can find the Issue. The **Create a branch** button on an Issue suggests a name made from its number and title. Other teams use prefixes, like `feature/dark-mode` or `fix/broken-links`.
- **Commit messages.** A short first line, written as a command, says what the commit does: "Show cooking time on recipe cards". Some teams follow Conventional Commits, which starts each message with a type: `feat: show cooking time`, `fix: correct pancake servings`.
- **Pull requests.** A title that says what changes, and a description with `Closes #7`, so the Issue closes when it merges.

Most teams enforce these by habit and review. Organizations on GitHub's Enterprise plans can also make a ruleset refuse branch names or commit messages that don't match a pattern. With agents, write your conventions down where the agent reads them at the start of each session, such as `CLAUDE.md` or a `CONTRIBUTING.md` file. [Instruction files](/learn/instruction-files) shows how.

```checkpoint quick-8
Your team names branches `<issue-number>-<short-slug>`. You start work on Issue #12, "Add a print button". Which name fits?
- [x] `12-print-button`
- [ ] `print-button-branch`
- [ ] `feature/new-stuff`
Why: The convention starts with the Issue's number, then a few words, so anyone can find the Issue from the branch name.
```

## Small teams and big ones

The right rules depend on who shares the repo.

| Who | Rules that fit |
|---|---|
| You alone, with or without agents | Require a pull request and your checks, with zero approvals. Block force pushes and deletions. Your Merge check is the review. |
| A small team | The same, plus one required approval, and CODEOWNERS for the parts that need an expert, such as the workflow files. |
| A big, busy team | Approvals scaled by risk, code owners, strict checks or a merge queue, and automated review on every pull request. |

Zero approvals is right for a project of one, not lazy. You can't approve your own pull requests, so a required approval would block every merge. The rules still make every change pass through a pull request and its checks.

Small pull requests help at every size. Someone has to read them, and small changes get reviewed more quickly and more thoroughly, and they're simpler to roll back. At Google, a reviewer may reject a change for being too large, and for no other reason. Anthropic's Code Review reviews pull requests with agents. It found problems in 84% of pull requests over 1,000 changed lines, and in 31% of those under 50.

A big team adds layers. Claude writes about 90 percent of Claude Code's code, and its team still reviews in six layers:

1. Before the pull request, the agent shows test results, and a fresh agent reviews the changes.
2. Claude reviews every pull request before a person does.
3. An automated security review can block the merge.
4. CI's checks can block it too.
5. A second person approves riskier changes.
6. The checks run again on the latest `main` plus the change, before it merges.

A rollback, such as a [revert](/learn/undo-and-conflicts), handles whatever still gets through. When an agent writes a pull request there, the person who ran the agent always counts as one of its required reviewers. And an agent's approval doesn't count as a person's.

```checkpoint quick-9
Why does the Claude Code team run the checks again on the latest `main` plus the change, before merging?
- [x] Two pull requests that each pass on their own can still break `main` together.
- [ ] The first run of the checks can't see the files a pull request changes.
- [ ] Running checks twice makes them twice as likely to catch a bug.
Why: Each pull request's checks ran against an older `main`. Running them again on the latest `main` plus the change catches the combination before it lands.
```

## Try it

````try
You need `gh` logged in. A free GitHub account works, because the practice repo is public.

1. Make a public practice repo with a README, and go into it:

```sh
gh repo create ruleset-practice --public --add-readme --clone
cd ruleset-practice
```

2. Run `gh ruleset check --default`. You should see `0 rules apply to branch main`.
3. On github.com, open the new repo and follow the steps in "Setting up a ruleset" above. Keep **Restrict deletions** and **Block force pushes**, and tick **Require a pull request before merging**, leaving required approvals at 0. Make it Active, then click **Create**.
4. Run `gh ruleset check --default` again. You should see `3 rules apply to branch main`, listing `deletion`, `non_fast_forward` and `pull_request`.
5. Try to push a commit straight to `main`:

```sh
git commit --allow-empty -m "Try a direct push"
git push
```

6. GitHub refuses. You should see `GH013: Repository rule violations found for refs/heads/main` and `Changes must be made through a pull request`.
7. Undo the local commit with `git reset --soft HEAD~1`.
8. Delete the practice repo: on github.com, open its **Settings**, scroll to the bottom, and click **Delete this repository**.
````

## Going deeper

### A real example

Neon's rules above show a big team at work. Its CODEOWNERS file sends each part of the code to the team that knows it. For example, `/pageserver/ @neondatabase/storage` hands the storage code to the storage team. The workflow files under `/.github/` go to the teams for developer productivity and performance. With `require_code_owner_review: true`, a change under `pageserver/` needs a storage team approval before it can merge.

A public pull request on TrueNAS, another open-source project, shows why people and agents review together. A person requested changes twice. Once, the approach didn't match the project's other plugins. Once, names and docstrings didn't follow the file's patterns. Then they approved. Seventeen minutes later, Claude flagged a bug that would have broken syncing encryption keys, and a new commit fixed it. The person caught code that didn't fit the project. The agent caught a bug after the person approved. Neither replaced the other.

```checkpoint quick-10
A person approved a pull request, then a reviewing agent flagged a real bug in it. What does that show?
- [x] People and agents catch different things, so neither replaces the other.
- [ ] Agents catch more than people do, so the person's review wasn't needed.
- [ ] A person's approval ends the review, so the agent's comment can wait.
Why: The person caught code that didn't fit the project, and the agent caught a bug after the approval. Each found what the other missed.
```

### Where it goes wrong

**Nobody reviews your pull request.** Code owners aren't asked while it's a draft, so mark it ready. Anyone else, you ask by name with **Reviewers** or `gh pr edit --add-reviewer`.

**An approval disappears after a push.** The rule dismisses approvals when new commits arrive, so the reviewer has to look again. Ask them with the same command.

**`gh ruleset check` stops with `HTTP 403` on a private repo.** On GitHub's free plan, rulesets work only in public repos. A private repo needs a paid plan.

**A red check didn't stop the merge.** It wasn't a required check. Only checks a rule names must pass.

**An agent and a reviewing agent go round and round.** They can cycle forever. One pull request in the Claude Code team's command-line project cycled more than fifty times overnight. So the team's review system now asks the author to rethink the approach after three rounds. If yours keep going round, stop them and rethink.

```checkpoint quick-11
A check on your pull request is red, yet the merge button works. Why?
- [x] That check isn't required, because no rule names it.
- [ ] Red checks block a merge only on private repos.
- [ ] The check failed too long ago to count any more.
Why: A failing check blocks a merge only if a rule names it as required. `gh pr checks --required` lists the ones that do.
```

## Remember

```flashcards
Q: What's the difference between a ruleset and a branch protection rule?
A: Both protect branches. A ruleset is a named list of rules for chosen branches, and several can apply at once. A branch protection rule is the older, classic kind. When both apply, the stricter rule wins.

Q: Which rules protect `main` on most repos?
A: Require a pull request, require status checks, block force pushes and restrict deletions. Bigger teams add required approvals and code owner review.

Q: When does a failing check block a merge?
A: Only when a rule names it as required. `gh pr checks --required` lists those.

Q: Why does a solo repo require zero approvals?
A: You can't approve your own pull requests, and your agents' pull requests are yours too. A required approval would block every merge.

Q: What does a CODEOWNERS file do?
A: It names who owns which files. GitHub requests their review when a pull request changes those files, and a rule can make their approval required.

Q: In a CODEOWNERS file, which line wins?
A: The last line that matches the file.

Q: `gh ruleset check` prints `0 rules`. Is `main` unprotected?
A: Not always. Classic branch protection rules don't show there; look under Settings, then Branches.

Q: Why do teams keep pull requests small?
A: Small changes get reviewed more quickly and more thoroughly, and they're simpler to roll back.
```

## Final test

```final-test final-no-approval
A team's `main` requires one approving review. The checks pass on your pull request, and nobody has reviewed it. You click merge. What happens?
- [x] GitHub refuses the merge until a reviewer approves the pull request.
- [ ] GitHub merges it, because passing checks stand in for the approval.
- [ ] GitHub merges it, then asks a reviewer to approve it afterwards.
- [ ] GitHub closes the pull request, because nobody reviewed it in time.
Why: The required count is how many approvals a pull request needs before it can merge. Passing checks are a separate requirement, so they can't replace an approval.
```

```final-test final-solo-rules
You work alone on `recipes`, with agents opening pull requests under your login. Which ruleset fits?
- [x] Require a pull request and your checks, with zero approvals, and block force pushes and deletions.
- [ ] Require one approval on every pull request, so each change gets a second look.
- [ ] No rules at all, because rules only matter once a second person joins.
- [ ] Block every push to `main`, including merges, so nothing changes by accident.
Why: You can't approve your own pull requests, so a required approval would block every merge. The rules still send every change through a pull request and its checks, and keep `main`'s history safe.
```

```final-test final-renamed-check
An agent's pull request renamed the CI job from `test` to `verify`, "for clarity". The ruleset requires `test`, and the merge box has waited for twenty minutes. The agent wants to push an empty commit. What do you tell it?
- [x] Rename the job back to `test`, because the rule looks for that name.
- [ ] Push the empty commit, because that starts the checks again.
- [ ] Wait, because GitHub is still queueing the renamed check.
- [ ] Merge `main` into the branch, because that refreshes the checks.
Why: A required check is found by its name. Nothing reports under `test` any more, so the merge waits forever, however long you wait or however many commits you push.
```

```final-test final-codeowners
A CODEOWNERS file has `*  @ana-k @ben-t` on one line and `/recipes/  @cara-m` on a later line. A pull request changes only `recipes/waffles.md`. Whose review does GitHub request?
- [x] Cara's, because the last matching line wins.
- [ ] Ana's and Ben's, because `*` matches every file.
- [ ] All three, because every matching line adds its owners.
- [ ] Nobody's, because CODEOWNERS works only on drafts.
Why: GitHub uses the last line in CODEOWNERS that matches the file. `/recipes/` comes after `*`, so only Cara is asked.
```

```final-test final-zero-rules
`gh ruleset check --default` prints `0 rules apply to branch main`, yet a direct push to `main` is refused. What's the likely cause?
- [x] A classic branch protection rule protects `main`, and that command doesn't list those.
- [ ] GitHub refuses every direct push to `main`, on every repo, with or without rules.
- [ ] The command lists only rules added in the last day, so newer ones are missing.
- [ ] Direct pushes always need a pull request on public repos, whatever the rules say.
Why: `gh ruleset check` lists rules from rulesets only. A classic branch protection rule protects a branch without being part of a ruleset.
```

```final-test final-asked-to-split
An agent built a whole feature in one very large pull request, and every check passes. A reviewer asks you to split it up. Why is that a fair request?
- [x] Small changes get reviewed more quickly and more thoroughly, and they're simpler to roll back.
- [ ] Small changes need no approval, so the whole feature would merge sooner.
- [ ] Large pull requests can't run the checks, so their green result can't be trusted.
- [ ] GitHub refuses pull requests above a set size, so this one could never merge.
Why: Someone has to read what you send. Large pull requests hide more problems, and reviewers may reject a change for its size alone.
```

```final-test final-who-answers
You ran an agent, and it opened a pull request on your team's repo. A reviewing agent approved it. A colleague asks who answers for the change. What do you say?
- [x] I do, because I ran the agent, and an agent's approval doesn't take that from me.
- [ ] The agent does, because it wrote the change and I only asked for it.
- [ ] The reviewing agent does, because its approval moved the responsibility to it.
- [ ] Nobody does, because two agents have looked at it and both agreed.
Why: Whoever ran the agent answers for its pull request. On the Claude Code team, that person always counts as a required reviewer, and an agent's approval doesn't count as a person's.
```

```final-test final-strict-checks
Your pull request's checks passed last week. Since then, other pull requests have merged into `main`, and the rule doesn't require branches to be up to date. What's the risk if you merge now?
- [x] The change can break `main`, because its checks ran against an older `main`.
- [ ] GitHub refuses the merge, because the checks are more than a week old.
- [ ] The merge undoes the other pull requests, because yours is older than theirs.
- [ ] Nothing, because checks that passed once keep passing whatever changes.
Why: Without the up-to-date rule, nothing makes the branch include the latest `main` first. The combination of your change and the newer work is untested until after it lands.
```

```sources
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), GitHub Docs
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), GitHub Docs
- [Creating rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), GitHub Docs
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), GitHub Docs
- [Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule), GitHub Docs
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks), GitHub Docs
- [Managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue), GitHub Docs
- [Pull request reviews](https://docs.github.com/en/pull-requests/reference/pull-request-reviews), GitHub Docs
- [Approving a pull request with required reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/approving-a-pull-request-with-required-reviews), GitHub Docs
- [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), GitHub Docs
- [Creating a branch to work on an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-a-branch-for-an-issue), GitHub Docs
- [gh ruleset check](https://cli.github.com/manual/gh_ruleset_check), GitHub CLI manual
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub CLI manual
- [gh pr edit](https://cli.github.com/manual/gh_pr_edit), GitHub CLI manual
- [gh repo create](https://cli.github.com/manual/gh_repo_create), GitHub CLI manual
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), Conventional Commits
- [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), Google Engineering Practices
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [Code Review for Claude Code](https://claude.com/resources/articles/code-review), Anthropic, 2026-03-09
- [Rules on neondatabase/neon](https://github.com/neondatabase/neon/rules), neondatabase
- [Neon's CODEOWNERS file](https://github.com/neondatabase/neon/blob/main/CODEOWNERS), neondatabase
- [Convert zfs.dataset encryption methods to use truenas_pylibzfs](https://github.com/truenas/middleware/pull/18291), creatorcary, 2026-02-24
```
