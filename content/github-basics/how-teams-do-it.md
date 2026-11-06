---
title: How teams protect main
slug: how-teams-do-it
summary: When others share a repo, they review your pull request, rules on main can require their approval, and you still answer for it.
---

## What changes on a team

Say you've only merged your own pull requests. You join a team and say merge. GitHub refuses: it wants an approval.

**When others share a repo, they review your pull request, rules on `main` can require their approval, and you still answer for it.**

```checkpoint quick-1
When others share a repo, who answers for your pull request?
- [x] You still do, even though others review it.
- [ ] Your reviewers do, once they have reviewed it.
- [ ] The rules on `main` do, once they let it merge.
Why: When others share a repo, they review your pull request, rules on `main` can require their approval, and you still answer for it.
```

## Reviewers and code owners

A **reviewer** reads your pull request, comments, then approves or requests changes.

Admins control a repo's settings. They can set **required approvals**: how many must approve before a pull request merges.

```checkpoint quick-2
What do a repo's admins set with required approvals?
- [x] How many must approve before a pull request merges.
- [ ] How many can comment before a pull request merges.
- [ ] How many days a pull request can wait for a review.
Why: A repo's admins can set required approvals: how many must approve before a pull request merges.
```

**Code owners** are people or teams responsible for certain files, named in a `CODEOWNERS` file. Change those files, and GitHub asks them to review.

```checkpoint quick-3
You change a file that has a code owner. What does GitHub do?
- [x] It asks the code owner to review it.
- [ ] It waits for you to name the owner.
- [ ] It moves your change to their branch.
Why: Code owners are named in a `CODEOWNERS` file. Change those files, and GitHub asks them to review.
```

Anyone else, you ask.

You say:

> Ask `<username>` to review this pull request.

## Rules on `main`

A **ruleset** is a named list of rules for a repo's branches, such as:

- `pull_request`: changes must come through a pull request, with any required approvals.
- `required_status_checks`: named checks must pass before a merge.

```checkpoint quick-5
Which rule makes named checks pass before a merge?
- [x] `required_status_checks`
- [ ] `pull_request`
- [ ] `CODEOWNERS`
Why: `required_status_checks`: named checks must pass before a merge.
```

## Small pull requests

Someone has to read them, so you [aim small](/learn/pull-requests): small changes get reviewed more quickly and more thoroughly, and they're simpler to undo.

```checkpoint quick-6
Why do small pull requests help a team?
- [x] They get reviewed more quickly and more thoroughly.
- [ ] They skip the review, so they merge more quickly.
- [ ] They need no checks, so they cost the team less.
Why: Someone has to read them. Small changes get reviewed more quickly and more thoroughly, and they're simpler to undo.
```

## How the Claude Code team reviews

Claude writes about 90 percent of Claude Code. Its team still reviews, in six layers. Each layer catches some bugs and misses others.

```checkpoint quick-7
What does each of the Claude Code team's six layers do?
- [x] It catches some bugs and misses others.
- [ ] It catches every bug the last one found.
- [ ] It replaces the one that came before it.
Why: The team still reviews, in six layers. Each layer catches some bugs and misses others.
```

1. Before the pull request, Claude shows test results and a fresh agent reviews the changes.
2. Claude reviews every pull request before a person does.
3. An automated security review can block the merge.
4. CI's checks can too.
5. Another person approves riskier changes.
6. The checks run again on the latest `main` plus the change, before merging.

A rollback, like a [revert](/learn/undo-and-conflicts), handles what still gets through.

```checkpoint quick-8
What happens to a bug that gets through all six layers?
- [x] A rollback handles it.
- [ ] A seventh review finds it.
- [ ] It stays in `main` for good.
Why: A rollback, like a revert, handles what still gets through.
```

```diagram
type: chain
caption: "Each layer catches some bugs and misses others."
steps:
  - "Before the pull request"
  - "Claude reviews every pull request"
  - "An automated security review"
  - "CI's checks"
  - "Another person approves riskier changes"
  - "The checks run again on the latest `main`"
  - "A rollback"
groups:
  - from: 1
    to: 6
    label: "six layers"
```

## An agent's pull request

Whoever ran the agent answers for it, as in [Checking a PR](/learn/checking-a-pr). On the Claude Code team, that person must always review it, and an agent's approval doesn't count as a person's.

```checkpoint quick-9
On the Claude Code team, what happens to whoever ran the agent?
- [x] They must always review the pull request.
- [ ] They never review it, being too close to it.
- [ ] They review it only when the agent asks them.
Why: Whoever ran the agent must always review it, and an agent's approval doesn't count as a person's.
```

## Do it now

In your project's folder, read this public pull request.

You look:

```
gh pr view 18291 --repo truenas/middleware --comments
```

Scroll up: you should see `Reviewers: claude (Commented), yocalebo (Approved)`. Read down, skipping `bugclerk`'s notes: `yocalebo` requests changes twice, with Claude commenting between, then approves. `No body provided` means that reviewer wrote no summary.

Then your `main`.

You look:

```
gh ruleset check --default
```

You should see a line like `3 rules apply to branch main`. If `pull_request` is listed, `required_approving_review_count` says how many. If not, even at `0 rules`, no ruleset requires an approval, but the classic kind of rule could. For that, or `HTTP 403`, see [Where it goes wrong](/learn/how-teams-do-it). Note how many approvals your `main` requires, if any, then stop.

```checkpoint quick-10
Your `gh ruleset check` shows no `pull_request` rule. What does that tell you?
- [x] No ruleset requires an approval.
- [ ] Every ruleset needs one approval.
- [ ] Your pull requests can't be merged.
Why: If `pull_request` isn't listed, no ruleset requires an approval. If it is, `required_approving_review_count` says how many.
```

## Going deeper

### Why it exists

Review has two jobs: catching bugs before they ship, and building a shared understanding of the code. Required reviews help protect a branch like `main` and reduce accidental merges.

```checkpoint quick-11
What are review's two jobs?
- [x] Catching bugs before they ship, and building a shared understanding.
- [ ] Catching bugs after they ship, and writing the release notes.
- [ ] Blocking large changes, and choosing who owns which files.
Why: Review has two jobs: catching bugs before they ship, and building a shared understanding of the code.
```

At the Claude Code team's pace, reviewing line by line gets hard, if not impossible. So that team asks: "what could go wrong with this change, and what check - automated or human - is the right one to catch it?"

Most of its review is automated, with a person's attention on the risky part. A docs fix needs less review than an auto-updater change. Automated review can clear a low-risk change, but it can't stand in for a person when one is required. The checks run again at the end because two pull requests that each pass can still break `main` together. People keep what only people can do: deciding what to build, auditing dangerous code such as billing, reviewing architecture, checking proofs and taking responsibility. If you can't say what the checks would miss, you need a real review, not a quick approval.

An approval doesn't replace your [Merge check](/learn/checking-a-pr), because you still answer for the change. If you merge a small or medium change and it goes wrong, that team expects you to fix it yourself.

At Google, a reviewer can reject a change purely for its size. Size shows up in the numbers too. Code Review, Anthropic's review by agents, found problems in 84% of pull requests over 1,000 changed lines, and 31% of those under 50.

### A real example

Pull request #18291 on TrueNAS, a public project, is the one you read. It changed how a Python service handles encryption keys. `--comments` leaves out comments on single lines, so [open it on GitHub](https://github.com/truenas/middleware/pull/18291) to read those. Most are folded under `Resolved`, so click a thread to open it.

The reviewer's first comment on a line began "I don't like this approach", and pointed to how the project's other plugins work. The second request for changes asked for names and docstrings matching the rest of the code. Commits followed, named `id_ --> dataset`, `docstring format` and `rework exceptions`.

The reviewer approved. Seventeen minutes later, Claude flagged a bug that would break syncing those keys, and a commit named `pass tls` then changed that code. Claude also flagged an older bug, which wiped a key cache. The author replied "Needs separate PR", and merged 6 seconds later.

So the person caught code that didn't fit the project, and the agent caught a bug after the person had approved. Neither replaced the other, and the older bug's fix stayed out of this pull request.

```checkpoint quick-12
A person approved a pull request, then an agent flagged a bug in it. What does that show?
- [x] A person and an agent catch different things, so neither replaces the other.
- [ ] An agent catches more than a person does, so the person isn't needed.
- [ ] A person's approval ends the review, so the agent's comment can be ignored.
Why: The person caught code that didn't fit the project, and the agent caught a bug after the person had approved. Neither replaced the other.
```

Neon, a public Postgres project, shows a team's rules at work, including a required code owner's approval.

You look:

```
gh ruleset check --default --repo neondatabase/neon
```

You should see a `pull_request` rule holding `[required_approving_review_count: 1]` and `[require_code_owner_review: true]`: one approval, from a code owner where the files have one. Ignore `[required_reviewers: []]` beside them: **required reviewers** is a separate setting, naming teams that must approve changes to certain files. Neon's `CODEOWNERS` file has the line `/pageserver/ @neondatabase/storage`, so a change under `pageserver/` needs that team's approval.

```checkpoint quick-4
A `pull_request` rule holds those two settings. What do they require?
- [x] One approval, from a code owner where the files have one.
- [ ] One approval, from anyone at all, on every pull request.
- [ ] No approval, unless a code owner asks to take a look.
Why: `[required_approving_review_count: 1]` and `[require_code_owner_review: true]` mean one approval, from a code owner where the files have one.
```

`finance-agent` shows what a required check means. Its rules name two checks, `check` and `build`. A third can fail without blocking a merge, as in [Checking a PR](/learn/checking-a-pr). So a check blocks a merge only if a rule names it.

```checkpoint quick-13
When does a failing check block a merge?
- [x] Only if a rule names it.
- [ ] Every time it fails.
- [ ] Only if a reviewer asks.
Why: A third check can fail without blocking a merge, because its rules name two checks. A check blocks a merge only if a rule names it.
```

Its other two rules: `non_fast_forward` blocks force pushes, which overwrite a branch's history, and `deletion` blocks deleting the branch.

### Where it goes wrong

**Nobody reviews your pull request.** Code owners get asked automatically, but not on a draft: they're told when you mark it ready. Anyone else, you ask.

You say:

> Ask `<username>` to review this pull request.

Claude runs:

```
gh pr edit --add-reviewer <username>
```

**An approval disappears after a push.** A repo can dismiss approvals when new commits arrive: `dismiss_stale_reviews_on_push: true` in its `pull_request` rule. The same command asks for the review again.

**`gh ruleset check` prints `0 rules`, but `main` is protected.** That command lists rules from rulesets. The classic kind, a **branch protection rule**, doesn't show there.

```checkpoint quick-14
Why can `gh ruleset check` print `0 rules` for a protected `main`?
- [x] It lists rules from rulesets, and a branch protection rule isn't one.
- [ ] It lists public repos only, and your repo may be a private one.
- [ ] It lists rules for new branches, and `main` isn't a new branch.
Why: That command lists rules from rulesets. The classic kind, a branch protection rule, doesn't show there.
```

You look:

```
gh api repos/truenas/middleware/branches/master --jq .protected
```

You should see `true`, although `gh ruleset check --default --repo truenas/middleware` prints `0 rules`. For your own repo, change the owner, name and branch. Branch protection rules are in your repo's settings, under Branches.

**`gh ruleset check` stops with `HTTP 403` on your private repo.** On GitHub's free plan, rulesets work only in public repos. A private repo needs a paid plan, such as GitHub Pro.

**An agent and a reviewing agent won't stop.** They can cycle for ever. One pull request in the Claude Code team's CLI project cycled more than fifty times overnight. That team now limits the rounds: after three, the review system asks the author to rethink the approach. So if yours keep going round, stop them and rethink the approach.

```checkpoint quick-15
How does the Claude Code team stop an agent and a reviewing agent cycling?
- [x] It limits the rounds: after three, the author rethinks the approach.
- [ ] It limits the agents: after three, a person writes the code by hand.
- [ ] It limits the size: after three, the pull request must be split up.
Why: That team limits the rounds. After three, the review system asks the author to rethink the approach.
```

### Read more

- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [Code Review for Claude Code](https://claude.com/resources/articles/code-review), Anthropic, 2026-03-09
- [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), Google Engineering Practices, read 2026-11-05
- [Pull request reviews](https://docs.github.com/en/pull-requests/reference/pull-request-reviews), GitHub Docs, read 2026-11-05
- [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), GitHub Docs, read 2026-11-05
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), GitHub Docs, read 2026-11-05
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), GitHub Docs, read 2026-11-05
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), GitHub Docs, read 2026-11-05
- [REST API endpoints for rules](https://docs.github.com/en/rest/repos/rules), GitHub Docs, read 2026-11-05
- [gh ruleset check](https://cli.github.com/manual/gh_ruleset_check), GitHub, read 2026-11-05
- [Convert `zfs.dataset` encryption methods to use `truenas_pylibzfs`](https://github.com/truenas/middleware/pull/18291), creatorcary, 2026-02-24
- [Neon's CODEOWNERS file](https://github.com/neondatabase/neon/blob/main/CODEOWNERS), neondatabase, read 2026-11-05

## Remember

```flashcards
Q: What can a reviewer do with your pull request?
A: Comment on it, approve it, or request changes.

Q: Who are code owners, and what happens when you change their files?
A: People or teams named in a `CODEOWNERS` file as responsible for certain files. GitHub asks them to review automatically.

Q: Which look-only command lists the ruleset rules on your `main`?
A: `gh ruleset check --default`, run in your project's folder.

Q: Why do teams keep pull requests small?
A: Someone has to read them. Small changes get reviewed more quickly and more thoroughly, and they're simpler to undo.

Q: Who answers for a pull request an agent wrote?
A: Whoever ran the agent. On the Claude Code team, an agent's approval doesn't count as a person's.

Q: A check fails on a pull request, yet it can still merge. Why?
A: A check blocks a merge only if a rule names it as required.

Q: `gh ruleset check` prints `0 rules`. Is `main` unprotected?
A: Not always. A classic branch protection rule doesn't show there.
```

## Final test

```final-test how-teams-do-it-no-approval
A team's `main` requires 1 approving review. CI's checks pass on your pull request, and nobody has reviewed it. You say merge. What happens?
- [x] GitHub refuses the merge until a reviewer approves the pull request.
- [ ] GitHub merges it, because passing checks stand in for the approval.
- [ ] GitHub merges it, then asks a reviewer to approve it afterwards.
- [ ] GitHub closes the pull request, because nobody reviewed it in time.
Why: The required count is how many approvals a pull request needs before it can merge. Passing checks are a separate requirement, so they can't replace an approval.
```

```final-test how-teams-do-it-asked-to-split
Claude built a whole feature in one very large pull request, and every check passes. A reviewer asks you to split it up. Why is that a fair request?
- [x] Small changes get reviewed more quickly and more thoroughly, and they're simpler to undo.
- [ ] Small changes need no approval from a reviewer, so the whole feature would merge sooner.
- [ ] Large pull requests can't run CI's checks, so a passing result on one can't be trusted.
- [ ] GitHub refuses pull requests above a set size, so the reviewer can't approve this one.
Why: Someone has to read what you send. Small changes get reviewed more quickly and more thoroughly, and they're simpler to undo.
```

```final-test how-teams-do-it-who-answers
You ran Claude, and it opened a pull request on your team's repo. A reviewing agent approved it. A colleague asks who answers for the change. What do you say?
- [x] I do, because I ran the agent, and an agent's approval doesn't take that from me.
- [ ] Claude does, because it wrote the change, and I only asked for it in one sentence.
- [ ] The reviewing agent does, because its approval moved the responsibility across to it.
- [ ] Nobody does, because two agents have now looked at the change, and both agreed on it.
Why: Whoever ran the agent answers for its pull request. On the Claude Code team, that person must always review it, and an agent's approval doesn't count as a person's.
```

```final-test how-teams-do-it-deeper-zero-rules
`gh ruleset check --default` prints `0 rules` for your repo, yet `gh api` says its `main` is protected. What's the likely cause?
- [x] A classic branch protection rule applies, and `gh ruleset check` doesn't list those.
- [ ] `gh api` says `true` for every branch of every repo, so it tells you nothing about `main`.
- [ ] `gh ruleset check` works only on public repos, so `0 rules` is all it can print on yours.
- [ ] `main` is a new branch, and `gh ruleset check` can't list a new branch's rules for a while.
Why: A branch protection rule protects a branch without being part of a ruleset, and `gh ruleset check` lists rules from rulesets. So `0 rules` alone doesn't prove `main` is unprotected.
```

```sources
- [Pull request reviews](https://docs.github.com/en/pull-requests/reference/pull-request-reviews), GitHub Docs
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), GitHub Docs
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), GitHub Docs
- [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), GitHub Docs
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), GitHub Docs
- [Rules on neondatabase/neon](https://github.com/neondatabase/neon/rules), neondatabase
- [REST API endpoints for rules](https://docs.github.com/en/rest/repos/rules), GitHub Docs
- [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), Google Engineering Practices
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [NAS-139874 / 26.0.0-BETA.1 / Convert `zfs.dataset` encryption methods to use `truenas_pylibzfs`](https://github.com/truenas/middleware/pull/18291), creatorcary, 2026-02-24
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [gh ruleset check](https://cli.github.com/manual/gh_ruleset_check), GitHub CLI manual
- [Rules on SiddharthMuramkar/finance-agent](https://github.com/SiddharthMuramkar/finance-agent/rules), SiddharthMuramkar
- [Code Review for Claude Code](https://claude.com/resources/articles/code-review), Anthropic, 2026-03-09
- [CODEOWNERS](https://github.com/neondatabase/neon/blob/main/CODEOWNERS), neondatabase
- [Small leftovers from the tutor lanes](https://github.com/SiddharthMuramkar/finance-agent/pull/306), SiddharthMuramkar, 2026-11-04
- [gh pr edit](https://cli.github.com/manual/gh_pr_edit), GitHub CLI manual
- [Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule), GitHub Docs
- [kanban PR acceptance: a 403 from rules/branches blocks every card on a free-plan private repo](https://github.com/NousResearch/hermes-agent/issues/141987), bbqribs, 2026-10-20
- [cli/pkg/cmd/ruleset/check/check.go at v2.97.0](https://github.com/cli/cli/blob/v2.97.0/pkg/cmd/ruleset/check/check.go), The GitHub CLI project
- [Line comment 2880169596 on truenas/middleware pull request 18291, and the comment it replies to](https://api.github.com/repos/truenas/middleware/pulls/comments/2880169596), creatorcary, 2026-03-03
```
