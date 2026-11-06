---
title: Checking a pull request before you merge
slug: checking-a-pr
summary: Why green checks prove only what they test, and how to read the description, diff, checks and preview, and weigh the risk, before you merge.
---

Say your coding agent has opened PR #14 to fix the search bug in your recipe site. Every check is green, and the agent asks: "Shall I merge?" You may not read code well yet, and the agent sounds sure. Green feels like a yes, but it only answers part of the question.

```goals
- Say what a green check proves, and what it can't.
- Read a pull request in order: the description, the diff, the checks, then the preview.
- Spot the files in a diff that need a slow read: database changes, workflow files, lockfiles and secrets.
- Try the change on a preview deployment, or have it run for you.
- Weigh the risk: can the change be undone cheaply, and what could it break?
- Get a fresh review, then decide: merge, send it back, or wait.
```

## What green proves

A **check** is the pass-or-fail result of one automated job, such as running the tests or building the site. [CI](/learn/what-ci-cd-is) runs them on every push, and a [pull request](/learn/pull-requests) shows each one with a tick or a cross.

**Green proves only what the checks test, so look at the rest yourself before you merge.**

For example, say the `recipes` tests check that searching "soup" finds Tomato soup. A PR could pass them all and still break the home page, if no test ever opens it. Checks run only what someone wrote them to run.

Addy Osmani has described how the team behind Claude Code reviews code. The team treats "did someone read the code?" as an imprecise measure. It asks instead: "what could go wrong with this change, and what check - automated or human - is the right one to catch it?" Each layer of checking catches some problems and misses others.

So the automated checks are one layer, and the other looks are yours. Together they make your **Merge check**: the short routine you run before you say merge. Read a PR in this order:

```diagram
type: chain
caption: "Read a pull request in this order, then decide."
steps:
  - "The description: the claim"
  - "Files changed: the evidence"
  - "The checks: what verified it"
  - "The preview: try it yourself"
  - "The risk: can it be undone?"
  - "Decide: merge, send back or wait"
```

```checkpoint quick-1
Every check on PR #14 is green. What has that proved?
- [x] That the checks that ran passed, and nothing beyond what they test.
- [ ] That the change works everywhere on the live site.
- [ ] That nobody needs to look at the change before it merges.
Why: Green proves only what the checks test. A page no test opens can still be broken, so the rest of your Merge check still matters.
```

## The description: the claim

The description is the author's claim: what changed, why, and how they know it works. When an agent wrote the PR, the description is the agent's account of its own work. So read it first, then test it against everything else.

Look for three things:

- The Issue: `Closes #12`, and a change that matches #12's "Done when" line.
- Evidence from a real run: test output, or a screenshot before and after. Claude Code's guide is blunt: "'All tests pass' on its own tells you very little."
- The risk: what could break, and whether it's easy to undo. That comes up again below.

```checkpoint quick-2
PR #14's description says "Fixed search. Tests pass." and nothing else. What do you ask the agent for first?
- [x] The Issue it closes, and the test output as evidence.
- [ ] A longer paragraph explaining how search works inside.
- [ ] A second PR that holds only the tests.
Why: A description should name the Issue and show evidence from a real run. "Tests pass" with nothing shown is only a claim.
```

## Files changed: the evidence

The **Files changed** tab, or `gh pr diff`, shows exactly what `main` would gain. Start with the list of files:

```sh
gh pr diff 14 --name-only
```

```text
src/search.js
src/search.test.js
```

For each file, ask: did the Issue need this? A search fix that also edits the About page, or deletes tests, needs a reason. Ask for it, or ask for that part to go in a PR of its own.

Some files need a slow read, whatever the Issue says. Two are about what the change does:

- A **migration**: a file that changes how a database stores data, such as removing a column. Many can't be undone without losing data.
- A **workflow file**, in `.github/workflows/`: it defines the checks themselves. A PR that edits its own checks can make itself pass.

Two more are about what the change brings in, or gives away:

- A **lockfile**, such as `package-lock.json`: it pins the exact versions of the packages your project uses. A big change there means new or upgraded packages.
- A **secret**: a password or key, often in a file like `.env`. Once it's pushed, the old commit on GitHub keeps it, so get a new key first ([Commits and diffs](/learn/commits-and-diffs) explains why).

Size matters too. Hundreds of lines across dozens of files, for one small Issue, is too much to check. Ask for a split.

```checkpoint quick-3
Every check on PR #14 is green, but Files changed also edits `.github/workflows/ci.yml`, which the Issue never mentioned. What do you do?
- [x] Ask why, or ask for that change in a PR of its own.
- [ ] Merge it, because the green checks cover the workflow file too.
- [ ] Merge it, because workflow files never affect the site.
Why: A workflow file defines the checks themselves. Green checks don't vouch for a change to the checks, least of all one nobody asked for.
```

## The checks: what verified it

Open the **Checks** tab, or run `gh pr checks 14`. Its first line sums things up, such as `All checks were successful` or `Some checks were not successful`. Here's what each state means:

| You see | It means | What happens next |
|---|---|---|
| A yellow dot | Still running, or waiting its turn | Wait. `gh pr checks 14 --watch` waits with you. |
| A red cross | The check failed | The author fixes it on the same branch and pushes. The checks run again. |
| A green tick on every check | Everything that ran passed | Go on with the rest of your Merge check. |
| `no checks reported` | Nothing ran at all | Nothing is proved. Ask why CI didn't run. |
| "Waiting for status to be reported" | A check the repo requires never started | Look at the workflow, not the code. Often a job was renamed. |

Two traps catch beginners. First, a failed check doesn't always stop a merge. A repo can mark some checks **required**: they must pass before the merge button works. A failed check that isn't required leaves the button working, so stopping is your job. `gh pr checks 14 --required` lists only the required ones, and [Gates: checks that block](/learn/gates) shows how to set them up.

Second, read each check's name, not only its colour. Your **host** is the service that puts your site online, such as Vercel. Its row can say a deploy finished, and that's not your tests. And GitHub reports a skipped job as a success.

```checkpoint quick-4
PR #14 shows a red cross on one check that isn't required. The merge button still works. What do you do?
- [x] Stop and find out why it failed, because a working button doesn't make it safe.
- [ ] Merge it, because a check that isn't required doesn't matter.
- [ ] Wait, because a failed check turns green by itself after a while.
Why: Only required checks block the merge button. A failure in any check still means something went wrong, so stopping at it is your call.
```

## The preview: try it yourself

A **preview deployment** is a temporary copy of your site, built from the PR's branch, at its own web address. Hosts such as Vercel and Netlify make one for each PR. The link usually appears in a comment on the PR, or among its checks.

Open it and do what the Issue's "Done when" line says. Type "Soup", then "SOUP", and look for Tomato soup each time. Then try one nearby thing that shouldn't have changed, such as opening a recipe.

No preview? Run the site on your computer from the PR's branch: `gh pr checkout 14` switches you to it. Or ask your agent to run it and show you a screenshot. In Claude Code, `/verify` has the agent build and run the app and look at the result.

Be careful with buttons that save or delete. A preview runs the PR's code, but each environment, such as preview or the live site, can have its own settings. Those include which database it connects to. Before you try anything that writes, ask which database the preview uses.

```checkpoint quick-5
PR #14's preview adds a "Delete recipe" button. Before you press it to test it, what do you find out?
- [x] Which database the preview uses, so you don't delete real recipes.
- [ ] Which branch the preview was built from, so it matches the PR.
- [ ] Which check the preview passed, so the button is safe to press.
Why: Each environment can have its own settings, including its database. A preview pointed at the real database deletes real recipes.
```

## The risk: can it be undone?

Ask two questions of every PR. Can the change be undone cheaply? And what could it break?

A **two-way door** is a change you can walk back cheaply. New search code is one: a revert, a new commit that undoes it, takes it out again. A **one-way door** can't be walked back, such as deleting a column of saved recipes, or sending emails. As one user put it, "rolling back a commit won't unsend a batch of emails".

The **blast radius** is what the change could break if it's wrong: one page, every page, or other people's data.

Matt Pocock's [pr](/learn/pr) Skill, a set of instructions agents load to write PR descriptions, puts both under a heading called Merge Danger:

```text
Door: two-way
Blast Radius: search
```

Read a two-way door with a small blast radius quickly, and a one-way door slowly. But remember who wrote the line: the agent, grading its own change. Matt's advice is to be most suspicious when it says "two-way, small blast radius". Check that call against the diff. A migration or a workflow change rarely deserves it.

```checkpoint quick-6
The description says `Door: two-way`, but Files changed holds a migration that removes a column. What do you make of it?
- [x] Don't trust the line. Removing a column is a one-way door, so slow down.
- [ ] Trust the line, because the agent that wrote the change knows it best.
- [ ] Ignore the migration, because green checks make any change two-way.
Why: Deleted data can't be walked back. The agent graded its own change, so check its door call against the diff.
```

## A fresh review

If the agent that wrote the change reviewed it, it would be marking its own work. A new session hasn't seen the reasoning behind the code, so it isn't swayed by it.

In Claude Code, `/code-review` hands the diff to a fresh **subagent**: a helper agent that never saw your conversation. Pass a PR number, as in `/code-review 14`, to review that PR. Or start a new session and say:

> Review pull request #14 against Issue #12. Report real bugs, skip style, and change nothing.

Keep "skip style". Claude Code's guide warns that a reviewer asked to find problems "will always find something". Fix every finding, and you add code you don't need, so pick the findings that matter.

A review informs your decision; it doesn't make it. On the Claude Code team, "Agent approvals don't count as human approvals", and whoever runs an agent is a required reviewer of its PRs. **You ran the agent, so you answer for its work.**

```checkpoint quick-7
The session that built PR #14 offers to review it too. What do you do?
- [x] Use a fresh session or `/code-review`, which hasn't seen the reasoning behind the change.
- [ ] Accept, because the session that built the change knows it best.
- [ ] Skip the review, because green checks have already reviewed the code.
Why: The building session would be marking its own work. A fresh reviewer isn't swayed by the reasoning that produced the code.
```

## Decide: merge, send it back, or wait

Every Merge check ends in one of three moves:

- Wait, while a check is still running.
- Send it back when something's wrong: a failed check, a file nobody asked for, a [merge conflict](/learn/undo-and-conflicts), a preview that fails "Done when", or a risk you don't understand. Tell the agent what you found, and to push a fix to the same branch. Then run your Merge check again on the new commits.
- Merge when the checks you rely on passed, the diff matches the description and the Issue, the preview works, and you understand the risk. [Merging and cleaning up](/learn/merging-and-cleaning-up) takes it from there.

Watch for auto-merge while you check. If `gh pr view` shows a line starting `Auto-merge: enabled`, the PR will merge as soon as the repo's required checks pass. That may be before you've finished. Turn it off with `gh pr merge 14 --disable-auto`, or with **Disable auto-merge** in the merge box.

```checkpoint quick-8
Every check is green and there are no conflicts, but on the preview "SOUP" still finds nothing. What's your move?
- [x] Send it back: tell the agent what you saw, and to push a fix to the same branch.
- [ ] Merge it, because green checks outrank what you saw on the preview.
- [ ] Wait, because a preview catches up with the checks after a while.
Why: The preview fails the Issue's "Done when" line, so the change isn't finished. A fix pushed to the same branch updates the PR, and you check again.
```

## Your Merge check with an agent

When an agent hands you a PR, here's the routine as commands. They only read, so they're safe to run at any time:

```sh
gh pr view 14               # the claim: description, Closes line, any Auto-merge line
gh pr diff 14 --name-only   # the evidence: which files changed
gh pr diff 14               # the lines themselves: + added, - removed
gh pr checks 14             # what verified it
```

Then ask for what's missing:

> Show me the test output for PR #14, and give me the preview link.

When your check finds a problem, say what you saw and what not to do:

> On the preview, "SOUP" still finds nothing. Push a fix to this same branch. Don't merge, and don't turn on auto-merge.

When it reports back, run the routine again. The agent's message is a claim; the PR is the evidence.

```checkpoint quick-9
Your agent says: "Fixed. I pushed a new commit to PR #14." What do you do next?
- [x] Run your Merge check again on the updated PR.
- [ ] Merge it, since the agent has fixed what you found.
- [ ] Close #14, since a new commit needs a new PR.
Why: The agent's message is a claim, and the new commit may have changed more than you asked. The PR shows what happened, so check it again.
```

## Try it

````try
You need the draft PR from the Try it in [Opening a pull request](/learn/pull-requests), and to be on its branch in your practice repo.

1. Read the claim:

   ```sh
   gh pr view
   ```

   You should see `Draft`, `Closes #` with your bug's number, and no line starting `Auto-merge:`.

2. List the evidence:

   ```sh
   gh pr diff --name-only
   ```

   You should see `README.md`, and nothing else.

3. Read the change itself:

   ```sh
   gh pr diff
   ```

   You should see your new line, starting with `+`.

4. Look for checks:

   ```sh
   gh pr checks
   ```

   You'll probably see `no checks reported`. Your practice repo has no CI yet, so nothing is proved. [What CI/CD is](/learn/what-ci-cd-is) adds a check.

5. Open the page, click **Files changed**, and tick **Viewed** on `README.md`:

   ```sh
   gh pr view --web
   ```

6. Nothing worries you, so mark the PR ready for review:

   ```sh
   gh pr ready
   ```

   Run `gh pr view` again: `Draft` has become `Open`.

Leave it open. The Try it in [Merging and cleaning up](/learn/merging-and-cleaning-up) merges it.
````

## Going deeper

### How one team layers its checks

Addy Osmani's account shows the Claude Code team running checks in layers. Most of the reviewing happens before a PR exists. Claude runs something, such as the tests or the build, and shows the result instead of saying it's done. Then a subagent reviews the diff with fresh context.

After that, every PR gets an automated review before a person looks, plus blocking checks such as tests and builds. Some paths always need a person's approval, including "any CI workflow file". That's the same instinct as reading workflow files slowly: a change to the checks needs more than the checks. [How teams protect main](/learn/how-teams-do-it) shows the rest of such a setup.

```checkpoint quick-10
On that team, which kind of file always needs a person's approval, however small the change?
- [x] A CI workflow file, which defines the checks.
- [ ] A test file, which the checks already run.
- [ ] Any file under ten lines, since small changes hide bugs.
Why: Some paths always need another approval there, including any CI workflow file. A change to the checks can't be vouched for by the checks.
```

### Where it goes wrong

**No preview link appears.** Your project may not deploy branches by itself. Ask your agent to deploy a preview of this branch, or to run the site and show you the result.

**A required check says "Waiting for status to be reported" for a long time.** That check never started. Often its job was renamed, or its workflow doesn't run for this kind of change. Fix the workflow, not the code.

**`gh pr checks` is green, but every row is from your host.** A row such as `Vercel` reports a deploy, not your tests. With no test row, CI hasn't run, so ask why.

**The review always finds something.** A reviewer asked to find problems always does. Pick the findings that would really break something, and leave style alone.

**The risk line is missing, or out of date.** It was written at one moment, and later commits can leave it stale. Ask the agent to rewrite the description and update it on GitHub. It runs `gh pr edit 14 --body-file <file>`.

**A migration isn't in your folder.** You're on another branch. `gh pr diff 14` shows every change, wherever you are.

```checkpoint quick-11
`gh pr checks 14` is all green, but the only row is your host's, saying the deployment completed. What has been proved about your tests?
- [x] Nothing yet. That row reports a deploy, so ask why no test check ran.
- [ ] That every test passed, because the deploy runs the tests first.
- [ ] That the change works, because a deploy can't finish with a bug in it.
Why: Read each check's name, not only its colour. A host's row says a deploy finished, and that says nothing about your tests.
```

## Remember

```flashcards
Q: What does a green check prove?
A: Only what that check tests. It can't speak for anything no check covers, such as a page no test opens.

Q: In what order do you read a pull request?
A: The description (the claim), Files changed (the evidence), the checks (what verified it), then the preview. Then weigh the risk and decide.

Q: Which files deserve a slow read in any diff?
A: Migrations, workflow files in `.github/workflows/`, lockfiles, and anything holding a secret.

Q: Does a failed check always stop a merge?
A: No. Only required checks must pass first, so stopping at any failed check is your job.

Q: What does `no checks reported` prove?
A: Nothing. No check ran, so ask why CI didn't run.

Q: What is a preview deployment?
A: A temporary copy of your site, built from the PR's branch, at its own web address.

Q: What do you ask before you try anything that writes on a preview?
A: Which database the preview uses.

Q: What's a two-way door, and what's a one-way door?
A: A two-way door is a change you can walk back cheaply. A one-way door can't be walked back, such as deleting stored data.

Q: When should a risk line make you most suspicious?
A: When it says "two-way, small blast radius", because the agent that wrote the change is grading it.

Q: Why must the review come from a fresh session?
A: The session that wrote the change would be marking its own work. A fresh one hasn't seen its reasoning.

Q: Who answers for an agent's pull request?
A: You do. Whoever ran the agent answers for its work.
```

## Final test

```final-test cpr-green-then-what
`gh pr checks` on your PR says `All checks were successful`, and your agent asks whether to merge. What do you do?
- [x] Finish your Merge check first: the description, the diff, the preview and the risk.
- [ ] Say merge straight away, because green proves the change works on the live site.
- [ ] Read every line of code yourself first, because green proves nothing at all.
- [ ] Ask the agent if it's confident, then merge, because it knows what its checks cover.
Why: Green means the checks that ran passed, and it can't speak for anything they don't test. The rest of your Merge check still needs your look.
```

```final-test cpr-who-reviews
The session that built your change offers to review it before you merge. What do you do?
- [x] Start a fresh session or run `/code-review`, because it hasn't seen the reasoning behind the change.
- [ ] Accept, because the session that built the change knows its reasoning best.
- [ ] Skip the review, because a PR with green checks has already been reviewed by CI.
- [ ] Accept, and ask it to look twice, because a second look makes the review a fresh one.
Why: The agent that wrote the change would be marking its own work. A fresh reviewer isn't swayed by the reasoning that produced the code.
```

```final-test cpr-door-and-drop
Your PR's risk line says `Door: two-way`. Its one migration removes a column of saved recipes. What do you make of that?
- [x] Don't trust the line. Removing a column is a one-way door, so slow down before you decide.
- [ ] Trust the line. The agent that wrote the change is the best judge of which door it is.
- [ ] Ignore the migration. A change whose checks are green is a two-way door, whatever it does.
- [ ] Ignore the line. Risk lines only describe how a change looks, not what it does to data.
Why: Deleted data can't be walked back, so that's a one-way door. The agent graded its own change, so read the migration yourself.
```

```final-test cpr-auto-merge-on
You're part way through your Merge check. `gh pr view` shows `Auto-merge: enabled`, and the checks are still running. What do you do?
- [x] Turn auto-merge off, because it merges once the required checks pass, whatever you've looked at.
- [ ] Carry on, because auto-merge can't act until you've tried the preview yourself.
- [ ] Carry on, because auto-merge waits for an agent's review to finish.
- [ ] Close the PR and open a new one, because auto-merge can't be turned off once it's on.
Why: Auto-merge merges a PR by itself once its required reviews and checks pass. Your preview and your other looks aren't among those, so turn it off with `gh pr merge --disable-auto`.
```

```final-test cpr-failed-not-required
One check on your PR has failed, but it isn't a required check, and the merge button works. What's true?
- [x] Only required checks block the button, so stopping at this failure is your call.
- [ ] The failure doesn't matter, because GitHub would block the merge if it did.
- [ ] The check will be rerun at merge time, so you can merge now.
- [ ] A failed check always blocks the merge, so the button is broken.
Why: A repo can require some checks and not others. A failed check that isn't required leaves the button working, but something still went wrong.
```

```final-test cpr-no-checks
`gh pr checks` on your PR says `no checks reported`. What has been proved about the change?
- [x] Nothing. No check ran, so ask why CI didn't run.
- [ ] That it's safe, because GitHub reports only the checks that fail.
- [ ] That it's small, because GitHub skips the checks on small changes.
- [ ] That it passed, because no news from CI is good news.
Why: A check can only prove something if it ran. With no checks reported, nothing is proved, so find out why CI didn't run.
```

```final-test cpr-workflow-edit
Every check is green, but Files changed also edits `.github/workflows/ci.yml`, which the Issue never asked for. What do you do?
- [x] Send it back: ask why, or ask for that change in a PR of its own.
- [ ] Merge it, because a green run covers the workflow change too.
- [ ] Merge it, and look at the workflow file some other day.
- [ ] Wait, because GitHub will flag the workflow change if it matters.
Why: A workflow file defines the checks themselves, so green checks can't vouch for a change to them. A change nobody asked for needs a reason.
```

```final-test cpr-waiting-status
After your agent renamed a CI job, the merge box says "Waiting for status to be reported" for the only required check, and has for twenty minutes. What do you look at first?
- [x] The workflow and its job name, because the required check never started.
- [ ] The changed code, because the check is still busy running the tests.
- [ ] Nothing, because waiting longer will let the check finish.
- [ ] The PR's description, because the check reads its risk line.
Why: That message means a required check never reported. A renamed job is a common cause, so fix the workflow, not the code.
```

```final-test cpr-preview-db
The preview of your PR adds a "Delete recipe" button. Before you try it, what do you ask?
- [x] Which database the preview uses.
- [ ] Which branch the preview was built from.
- [ ] Which reviewer approved the preview.
- [ ] Which check built the preview's page.
Why: Each environment can have its own settings, including its database. If the preview uses the real one, pressing the button deletes real recipes.
```

```final-test cpr-who-answers
Your agent wrote the change, and you ran the agent. Who answers for the change once it merges?
- [x] You do, because you ran the agent.
- [ ] The agent does, because it wrote every line.
- [ ] Nobody does, once the checks have passed.
- [ ] The reviewer does, because it said the change was fine.
Why: Whoever runs an agent answers for its work. A review informs your decision, but the decision, and the change, are yours.
```

```sources
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks), GitHub Docs
- [Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks), GitHub Docs
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), GitHub Docs
- [Reviewing proposed changes in a pull request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request), GitHub Docs
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request), GitHub Docs
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub CLI manual
- [gh pr view](https://cli.github.com/manual/gh_pr_view), GitHub CLI manual
- [gh pr diff](https://cli.github.com/manual/gh_pr_diff), GitHub CLI manual
- [gh pr checkout](https://cli.github.com/manual/gh_pr_checkout), GitHub CLI manual
- [gh pr ready](https://cli.github.com/manual/gh_pr_ready), GitHub CLI manual
- [gh pr edit](https://cli.github.com/manual/gh_pr_edit), GitHub CLI manual
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge), GitHub CLI manual
- [Environments](https://vercel.com/docs/deployments/environments), Vercel
- [The /pr Skill](https://www.aihero.dev/skills-pr), Matt Pocock, 2026-10-05
- [pr: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/SKILL.md), Matt Pocock's Skills
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [Commands](https://code.claude.com/docs/en/commands), Anthropic
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
```
