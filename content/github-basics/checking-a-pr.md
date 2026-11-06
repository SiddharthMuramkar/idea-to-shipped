---
title: Checking a pull request before you merge
slug: checking-a-pr
summary: Green proves only what the checks test, so run your Merge check before you say merge.
---

## What green proves

Say your pull request's checks are green (passed), and Claude asks whether to merge. You don't read app code, so what do you look at?

**Green proves only what the checks test, so run your Merge check before you say merge.**

```checkpoint quick-1
What does a green check prove?
- [x] Only what the checks test.
- [ ] That the change works on the live site.
- [ ] That nobody needs to look at the change.
Why: Green proves only what the checks test, so you run your Merge check before you say merge.
```

Pull request #78 on this site's repo merged itself, with `All checks were successful`. Then every page of the live site said "The Course has problems".

```checkpoint quick-2
Every check on a pull request passed. Does that keep the live site safe after the merge?
- [x] No. Every page of the live site still broke after one such merge.
- [ ] Yes. A pull request whose checks all passed can't break the live site.
- [ ] Yes. GitHub undoes the merge by itself if the live site breaks.
Why: #78 merged itself, with `All checks were successful`. Then every page of the live site said "The Course has problems".
```

## The Merge check

- CI: whether your build and tests passed.
- The **preview**: a test copy of the site, at its own web address.
- A fresh agent's review: the agent that wrote the change would be marking its own work. A new session hasn't seen its reasoning.
- The **Merge Danger** line: how risky merging is.
- Any SQL migration: often hard to undo, and you can read SQL.

```checkpoint quick-3
Why does the review come from a new session?
- [x] The agent that wrote the change would be marking its own work.
- [ ] A new session is the only kind that can run `gh pr checks`.
- [ ] A new session merges the pull request as soon as it has looked.
Why: The agent that wrote the change would be marking its own work. A new session hasn't seen its reasoning.
```

**You ran the agent, so you answer for its work.**

```checkpoint quick-4
Claude wrote the change, and you ran Claude. Who answers for it?
- [x] You do, because you ran the agent.
- [ ] Claude does, because Claude wrote it.
- [ ] Nobody does, once the checks have passed.
Why: You ran the agent, so you answer for its work, whoever typed the change.
```

## The Merge Danger line

A **two-way door** is a change you can walk back cheaply. A **one-way door** can't be walked back, like dropping a column.

```checkpoint quick-5
What makes a change a one-way door?
- [x] It can't be walked back, like dropping a column.
- [ ] You can walk it back cheaply, like dropping a column.
- [ ] It only ever touches one file, like dropping a column.
Why: A two-way door is a change you can walk back cheaply. A one-way door can't be walked back, like dropping a column.
```

The **blast radius** is what the change could break.

The agent grades its own change, so be most suspicious of two-way with a small blast radius.

```checkpoint quick-6
When should a Merge Danger line make you most suspicious?
- [x] When it says two-way with a small blast radius.
- [ ] When it says one-way with a large blast radius.
- [ ] When it says one-way with a small blast radius.
Why: The agent grades its own change, so be most suspicious of two-way with a small blast radius.
```

## Do it now

In your project's folder, use your [pull request](/learn/pull-requests)'s number. Stuck? See [Where it goes wrong](/learn/checking-a-pr).

You look:

```
gh pr checks <number>
```

You should see `All checks were successful`, and a row for your build or tests. No such row? CI hasn't run, so nothing's proved. One failed? Stop and read [When it goes wrong](/learn/undo-and-conflicts).

You look:

```
gh pr view <number> --comments
```

You should see `Door:`, `Blast Radius:` and a `Preview` link. No `Door:` line? Ask Claude to update the body with `/pr`.

No link? Your project may not deploy (put online) by itself:

You say:

> Deploy a preview of this branch.

Open the web address Claude gives. None? Type `/verify` there, so Claude runs and checks the app.

On the preview, or in `/verify`'s result, check your [line for done](/learn/issues-and-keeping-track). Will that save data? Ask Claude which database first.

You look:

```
gh pr diff <number> --name-only
```

You should see the changed files' names. A migration among them? Read it with `cat`.

Start a new, read-only session in your second terminal: no worktree or line for Claude.

You say:

> Review pull request `<number>` against its Issue and Merge Danger line. Report real bugs, skip style, change nothing.

You should see bugs listed, or none.

Your line for done holds, and nothing worries you? In your first session:

You say:

> My Merge check passed. Don't merge yet or turn on auto-merge.

Otherwise, tell it to push a fix to this branch, not merge. Then run your Merge check again.

```checkpoint quick-7
Your Merge check hasn't passed. What happens next?
- [x] Claude pushes a fix to this branch, and you run your Merge check again.
- [ ] Claude merges this pull request, and you fix what you saw straight after.
- [ ] Claude opens a new pull request, and you leave this one open as it is.
Why: You tell Claude to push a fix to this branch, not merge. Then you run your Merge check again.
```

Then stop.

## Going deeper

### Why it exists

You don't read app code, so you need another way to judge a change. Claude Code's team asks: "what could go wrong with this change, and what check - automated or human - is the right one to catch it?"

That team runs layers of checks, because each one catches some bugs and misses others. So no one part of your Merge check is the whole check.

```checkpoint quick-8
Why does that team run layers of checks?
- [x] Each one catches some bugs and misses others.
- [ ] Each one catches every bug the one before found.
- [ ] Each one replaces the need for a person to answer.
Why: That team runs layers of checks, because each one catches some bugs and misses others. So no one part of your Merge check is the whole check.
```

That team also counts whoever runs an agent as a required reviewer of its pull request, and an agent's approval doesn't count as a person's. So a fresh agent's review informs your decision, and doesn't replace it.

```checkpoint quick-9
What does a fresh agent's review do to your decision?
- [x] It informs your decision, and doesn't replace it.
- [ ] It replaces your decision, and counts as a person's.
- [ ] It delays your decision until a second agent agrees.
Why: An agent's approval doesn't count as a person's on that team. So a fresh agent's review informs your decision, and doesn't replace it.
```

### A real example

#78 had auto-merge on, which merges a pull request by itself once its required reviews and checks pass. It merged about 6 minutes after it opened. All 3 of its checks were green. Its Merge Danger line said `Door: two-way` and `Blast Radius: content-check`, naming only the check on this site's Lessons. It had no review on GitHub, and its preview link sat in a comment.

Then every page of the live site said "The Course has problems". Pages read each image file's header, its opening bytes. But those files shipped only with the one route serving images, so other pages couldn't read them. A fix was committed about 4 minutes after the merge, on the merged branch, so it didn't reach `main`. You'll meet that again in [When it goes wrong](/learn/undo-and-conflicts). #91 brought the fix into `main` about 2 hours after the merge.

So green checks and an agent's own door call weren't enough, and auto-merge didn't wait for the rest. Keep it off until your Merge check is done.

```checkpoint quick-10
Why keep auto-merge off until your Merge check is done?
- [x] It doesn't wait for the rest of your Merge check.
- [ ] It runs the rest of your Merge check for you.
- [ ] It stops the checks on the pull request from running.
Why: Green checks and an agent's own door call weren't enough, and auto-merge didn't wait for the rest. So keep it off until your Merge check is done.
```

#78's repo is private, so only its owner can run `gh pr checks 78 --repo SiddharthMuramkar/skills`. A pull request on `finance-agent`, which is public, shows the Merge Danger line.

You look:

```
gh pr view 305 --repo SiddharthMuramkar/finance-agent
```

You should see `Door: two-way`, then `Blast Radius: sitewide`.

#184 on that repo shows the last part. It changes 26 files, and one is a SQL migration.

You look:

```
gh pr diff 184 --repo SiddharthMuramkar/finance-agent --name-only
```

You should see `drizzle/0028_learners_contract.sql` in the list.

That file has 15 lines like `ALTER TABLE "sessions" ALTER COLUMN "learner_id" DROP DEFAULT;`. You can read that: it removes a default, not a column, so no data goes. But a row written without a `learner_id` now fails.

```checkpoint quick-11
What does `DROP DEFAULT` do in that migration?
- [x] It removes a default, not a column, so no data goes.
- [ ] It removes a column, so that column's data goes.
- [ ] It removes each table's rows, so no data stays.
Why: You can read that yourself. It removes a default, not a column, so no data goes. But a row written without a `learner_id` now fails.
```

So ask whether the running code always names one. The pull request's body answers: "every app write on main already names its Learner". It also keeps auto-merge off: the migration must be rehearsed and applied to production (the live site real people use) before the merge.

### Where it goes wrong

**`gh pr view` shows `Auto-merge: enabled`.** Your pull request will merge once its required reviews and checks pass, perhaps before your Merge check is done.

You say:

> Turn off auto-merge on this pull request.

Claude runs:

```
gh pr merge <number> --disable-auto
```

**`gh pr checks` shows more than `0 pending checks`.** Some are still running, so you have no answer yet. `gh pr checks <number> --watch` waits until they finish.

**`gh pr checks` says `no checks reported`.** `gh pr checks 1 --repo SiddharthMuramkar/finance-agent` prints that line. Nothing reported means nothing is proved. If yours stays that way, ask Claude to set up CI.

**`gh pr checks` is green, but with only `Vercel` rows.** Vercel is the host that puts `finance-agent` online. Its row says `Deployment has completed`, so it reports a deploy, not your tests. A CI row looks like `CI/check (pull_request)`. With no such row, CI hasn't run, so ask Claude why.

**A failed check may not stop the merge.** `gh pr checks 306 --repo SiddharthMuramkar/finance-agent` prints `Some checks were not successful`, yet #306 merged. The failed check's comment says "This job is not a required check." Only required checks must pass first. So stopping at a failed check is your job.

```checkpoint quick-12
A check on your pull request has failed. Does that stop the merge?
- [x] Only if the check is required, so stopping is your job.
- [ ] Always, because a failed check blocks every merge.
- [ ] Never, because checks have no say in a merge.
Why: #306 merged with a failed check, and that check's comment says it isn't required. Only required checks must pass first.
```

**The review always finds something.** A reviewer asked to find problems always finds some, and fixing every finding adds code you don't need. So pick the ones that matter.

**Claude can't deploy a preview.** `finance-agent` doesn't deploy branches by itself, so Claude must. If your project has no host at all, `/verify` comes with Claude Code and needs no setup. Claude builds and runs the app, then looks at the result.

**`vercel` asks for confirmation.** `vercel` is the host's command for a preview. Your folder isn't linked to a Vercel project yet. `--yes` skips the questions, and `--project` names the project when your folder's name doesn't match.

You say:

> Link this folder to my existing Vercel project, then deploy a preview.

Claude runs:

```
vercel link --yes --project <name>
vercel
```

**The preview could touch real data.** Every environment can define its own environment variables, including its database connection. So ask Claude which database your preview uses before you try anything that writes.

```checkpoint quick-13
What do you ask before you try anything that writes on a preview?
- [x] Which database your preview uses.
- [ ] Which branch your preview came from.
- [ ] Which check your preview passed.
Why: Every environment can define its own environment variables, including its database connection. So ask Claude which database your preview uses.
```

**The door call looks too easy.** The changed lines often hide whether a change can be reversed. As one user put it, "rolling back a commit won't unsend a batch of emails". So write down what your repo always treats as one-way, such as schema migrations, where Claude will read it.

**There's no `Door:` line, or it's out of date.** `/pr` writes that line, at one point in time, and later commits can leave it stale. `/pr` covers only the body, so ask for the update too.

You say:

> Rewrite this pull request's body with `/pr`, keep its `Closes` line, and update it on GitHub.

Claude runs:

```
gh pr edit <number> --body-file <file>
```

**The migration isn't in your folder.** Your folder is on another branch. `gh pr diff <number>` prints every change, so find the file's name there. Its new lines start with `+`.

### Read more

- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub, read 2026-11-05
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub, read 2026-11-05
- [gh pr diff](https://cli.github.com/manual/gh_pr_diff), GitHub, read 2026-11-05
- [gh pr edit](https://cli.github.com/manual/gh_pr_edit), GitHub, read 2026-11-05
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub, read 2026-11-05
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks), GitHub Docs, read 2026-11-05
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs, read 2026-11-05
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request), GitHub Docs, read 2026-10-30
- [Environments](https://vercel.com/docs/deployments/environments), Vercel, read 2026-10-29
- [vercel link](https://vercel.com/docs/cli/link), Vercel, read 2026-11-05
- [The /pr Skill](https://www.aihero.dev/skills-pr), Matt Pocock, updated 2026-10-05
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic, read 2026-10-30
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic, read 2026-10-30
- [The site follows the Mac by default, and the header menu picks any of the four Themes](https://github.com/SiddharthMuramkar/finance-agent/pull/305), SiddharthMuramkar, 2026-11-04
- [Small leftovers from the tutor lanes](https://github.com/SiddharthMuramkar/finance-agent/pull/306), SiddharthMuramkar, 2026-11-04
- [Each person signs in with their own passcode (contract migration)](https://github.com/SiddharthMuramkar/finance-agent/pull/184), SiddharthMuramkar, 2026-11-03

## Remember

```flashcards
Q: What are the five parts of the Merge check?
A: CI, the preview, a fresh agent's review, the Merge Danger line and any SQL migration.

Q: What does a green `gh pr checks` prove?
A: Only what the checks test. It can't speak for anything they don't test, such as the live site working.

Q: Why must the review come from a fresh agent?
A: The agent that wrote the change would be marking its own work. A new session hasn't seen its reasoning.

Q: What's a two-way door, and what's a one-way door?
A: A two-way door is a change you can walk back cheaply. A one-way door can't be walked back, like dropping a column.

Q: When should a Merge Danger line make you most suspicious?
A: When it says two-way with a small blast radius, because the agent that wrote the change is grading it.

Q: Your pull request has no Merge Danger line. How do you get one?
A: Ask Claude to run `/pr` and put its Merge Danger part in the pull request's body.

Q: Your project doesn't make a preview by itself, and the change is one you can try. What do you say?
A: Deploy a preview of this branch. Then try the change at its web address.

Q: Claude wrote the change, and you ran Claude. Who answers for it?
A: You do. Whoever ran the agent answers for its work.

Q: Why keep auto-merge off until your Merge check is done?
A: It merges a pull request by itself once its required reviews and checks pass, so it won't wait for the rest of your Merge check.

Q: Does a failed check always stop a merge?
A: No. Only required checks must pass first, so stopping at a failed check is your job.
```

## Final test

```final-test checking-a-pr-green-then-what
`gh pr checks` on your pull request says `All checks were successful`, and Claude asks whether to merge. What do you do?
- [x] Run the rest of your Merge check first, because green proves only what the checks test.
- [ ] Say merge straight away, because green proves the change works on the live site.
- [ ] Read all the app code yourself first, because green proves nothing at all about a change.
- [ ] Ask Claude if it's confident, then say merge, because it knows what its checks covered.
Why: Green means the checks that ran have passed, and it can't speak for anything they don't test. So the preview, the review, the Merge Danger line and any SQL migration still need your look.
```

```final-test checking-a-pr-who-reviews
The session that built your change offers to review it before you merge. What do you do?
- [x] Start a new session for the review, because that one hasn't seen the reasoning behind the change.
- [ ] Accept the offer, because the session that built the change knows the reasoning behind it best.
- [ ] Skip the review, because a pull request with green checks has been reviewed already by CI.
- [ ] Accept the offer and ask it to look twice, because a second look makes the review a fresh one.
Why: The agent that wrote the change would be marking its own work. A new session starts fresh, so it isn't swayed by the reasoning that produced the code.
```

```final-test checking-a-pr-door-and-drop
Your pull request's Merge Danger line says `Door: two-way`. Its one SQL migration has a `DROP COLUMN` in it. What do you make of that?
- [x] Don't trust the line. Dropping a column is a one-way door, so slow down before you decide.
- [ ] Trust the line. The agent that wrote the change is the best judge of which door it is.
- [ ] Ignore the migration. A change whose checks are green is a two-way door, whatever it does.
- [ ] Ignore the line. Merge Danger only describes how a change looks, not what it does to data.
Why: A destructive migration is a one-way door, and the agent that wrote the change is grading its own work. So read the file yourself, and be suspicious when the line says two-way.
```

```final-test checking-a-pr-deeper-auto-merge-on
You're part way through your Merge check. `gh pr view` shows `Auto-merge: enabled`, and the checks are still running. What do you do?
- [x] Have Claude turn auto-merge off, because it merges once the requirements pass, whatever you've looked at.
- [ ] Carry on as you were, because auto-merge can't act until you've tried the preview yourself.
- [ ] Carry on as you were, because auto-merge holds the merge until an agent's review has finished.
- [ ] Close the pull request and open a new one, because auto-merge can't be turned off once it's on.
Why: Auto-merge merges a pull request by itself once its required reviews and checks pass. Your preview and your other looks aren't among those, so turn it off with `gh pr merge --disable-auto` until your Merge check is done.
```

```sources
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks), GitHub Docs
- [Pinned pages, outside links and real images](https://github.com/SiddharthMuramkar/skills/pull/78), SiddharthMuramkar, 2026-10-30
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request), GitHub Docs
- [Finish v2: land the last eight Tickets and bring the site back up](https://github.com/SiddharthMuramkar/skills/pull/91), SiddharthMuramkar, 2026-10-30
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub CLI manual
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [Environments](https://vercel.com/docs/deployments/environments)
- [The /pr Skill](https://www.aihero.dev/skills-pr), Matt Pocock, 2026-10-05
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [pr: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/SKILL.md), Matt Pocock's Skills
- [The site follows the Mac by default, and the header menu picks any of the four Themes](https://github.com/SiddharthMuramkar/finance-agent/pull/305), SiddharthMuramkar, 2026-11-04
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [finance-agent/vercel.json](https://github.com/SiddharthMuramkar/finance-agent/blob/main/vercel.json), SiddharthMuramkar
- [vercel link](https://vercel.com/docs/cli/link), Vercel
- [gh pr edit](https://cli.github.com/manual/gh_pr_edit), GitHub CLI manual
- [gh pr diff](https://cli.github.com/manual/gh_pr_diff), GitHub CLI manual
- [Each person signs in with their own passcode (contract migration)](https://github.com/SiddharthMuramkar/finance-agent/pull/184), SiddharthMuramkar, 2026-11-03
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub CLI manual
- [docs: use finance-agent as the repo name in the spec](https://github.com/SiddharthMuramkar/finance-agent/pull/1), SiddharthMuramkar, 2026-11-01
- [Small leftovers from the tutor lanes](https://github.com/SiddharthMuramkar/finance-agent/pull/306), SiddharthMuramkar, 2026-11-04
```
