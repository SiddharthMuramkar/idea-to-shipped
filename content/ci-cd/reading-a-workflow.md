---
title: Reading a GitHub Actions workflow
slug: reading-a-workflow
summary: Read any workflow file and say what runs, when, on which machine, with which permissions, and which check name it reports.
---

On 27 October this course’s own repo ran its first workflow. A rented Ubuntu machine copied the files, ran one script, and 11 seconds later a green tick called `check` appeared on `main`. About thirty lines of YAML decided all of it: when it ran, on what, with which permissions, and what the tick is called. Soon an agent will write the same kind of file for Care4Mind, and you’re the one who has to read it.

```goals
- You’ll be able to read any workflow file and say what runs, when, on which machine, with which permissions, and which check name it reports. You’ll also know where to look when that check goes red.
```

## Six words before any YAML

**GitHub Actions** is GitHub’s built-in way to run work on its machines when something happens in your repo. CI (continuous integration, Lesson 10) is what you’ll use it for first. You already read Docker Compose files, so the YAML will feel familiar: indentation is structure, and a dash starts a list item. What’s new is the vocabulary. Six words cover every workflow you’ll read.

| Word | What it is | In Brad’s lab |
|---|---|---|
| **Workflow** | One YAML file in `.github/workflows/`. A repo can have several. | `ci.yml` |
| **Event** | What happens on GitHub (or outside it) that starts the workflow: a push, a PR opened, a label added, a timer. | A push to `main`, a PR into `main` |
| **Job** | A list of steps that all run on one runner. Jobs in one workflow run side by side unless one waits for another. | `verify` |
| **Step** | One task inside a job: either a shell command or an action. | Four steps |
| **Action** | A packaged, reusable step that someone published. | `actions/checkout`, `actions/setup-node` |
| **Runner** | The machine that runs one job at a time. | `ubuntu-latest` |

The runner is the word that explains the rest. GitHub’s runners are fresh virtual machines, made for one job and thrown away after it. Nothing from your laptop is there: no code, no `node_modules`, not your Node version. The machine has only GitHub’s standard tools, such as a default Node (22, on 27 October) and the `gh` command. Every step in a CI job exists to rebuild, from that bare start, what your laptop already has. That’s the point. A check that passes on a blank machine can’t be relying on something only you have installed.

```callout remember
An event starts a workflow. Each job gets its own fresh runner. Inside a job, steps run in order on that one machine, and each step is either a shell command or a packaged action.
```

```checkpoint check-1
Brad’s workflow has one job with four steps. Where do the four steps run?
- [ ] On four fresh machines, one each
- [x] On one runner, one after another
- [ ] On your laptop, before the push
- [ ] On Vercel, during the production build
Why: A job’s steps all run on the same runner, in order. That’s why a later step can use what an earlier one installed. Each _job_ gets a fresh machine, not each step, and Vercel builds separately.
```

```checkpoint check-2
In a step, what is `actions/checkout@v7`?
- [ ] A shell command for the runner
- [ ] A branch of your own repository
- [x] A reusable action, pinned to v7
- [ ] A runner image with Node installed
Why: It follows `uses:`, so it’s an action: published code from the `actions/checkout` repo, version 7. It copies your repo’s files onto the blank runner. A shell command would follow `run:`.
```

## Brad’s ci.yml: when it runs, and what it may touch

Here is the workflow from Brad Traversy’s lab, exactly as it appears in his gist. In Lesson 13 you’ll have an agent add it to your own copy of his starter app. Read it once from top to bottom, then we’ll take it apart in two halves.

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  verify:
    name: Verify
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Check out repository
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Verify application
        run: npm run verify
```

`name: CI` is the workflow’s display name. You’ll see it in the Actions tab and next to each run. It is _not_ the name of the check; that comes from the job, in the next section.

`on` lists the events that start the workflow. Here there are two. `push` with `branches: [main]` fires when commits land on `main`; once a ruleset blocks direct pushes, that only happens when a PR is merged. `pull_request` with `branches: [main]` needs more care. For pull requests the filter is matched against the branch the PR _targets_, its base, not the branch it came from. So every PR into `main` runs it, whatever the agent called its own branch. With no `types` listed, it runs when a PR is opened or reopened and every time new commits are pushed to it (GitHub calls that `synchronize`).

One fact surprises most people. On an open PR, the code that gets checked out isn’t the agent’s branch as it was pushed. GitHub makes a test merge of the branch into `main`, and CI checks that, which is what you’d actually get by merging. It follows that a PR with a merge conflict (Lesson 9) gets no run at all until the conflict is fixed.

`permissions` limits a key you never see. At the start of every job, GitHub creates a short-lived token, the `GITHUB_TOKEN`, so that steps can talk to GitHub on the workflow’s behalf. `permissions` sets what that token may do, and the rule is strict: once you name one permission, every permission you didn’t name is set to none. `contents: read` lets the job read the code, which is all a check needs. It can’t push, comment, label or approve. This is called **least privilege**: grant only the access the job needs.

That gives you your first supervisor’s question. When an agent’s workflow asks for `write` anywhere, ask why. A CI check never needs it. An agent that comments on PRs does need `pull-requests: write`, and that’s fine, as long as the reason is visible in the file.

```callout remember
`on` says when it runs, and for `pull_request`, `branches` means the branch the PR targets. `permissions` says what the job’s token may do, and anything not named is none. A CI check needs `contents: read` and nothing more.
```

```checkpoint check-3
An agent opens a PR from `feature/login` into `main`. Which branch does Brad’s `pull_request` filter `branches: [main]` look at?
- [ ] The PR’s head branch, `feature/login`
- [ ] Every branch the agent pushed
- [ ] The default branch of forks
- [x] The PR’s base branch, `main`
Why: For `pull_request`, `branches` matches the branch the PR targets: its base. So any PR into `main` runs the workflow, whatever the agent named its own branch.
```

```checkpoint check-4
Brad’s workflow passes on that PR. What code did it test?
- [x] The PR branch merged into main
- [ ] Only the PR branch, as pushed
- [ ] Only main, before the PR merges
- [ ] Whatever your laptop last built locally
Why: On an open PR, GitHub checks out a test merge of the branch into `main`, so CI tests the result of merging. That’s also why a PR with a merge conflict gets no run until the conflict is fixed.
```

```checkpoint check-5
A step in a workflow with `permissions: contents: read` tries to comment on the PR. What happens?
- [ ] It works, because comments are read-only
- [ ] It works, but only on main
- [x] It fails: the token cannot write
- [ ] It asks you to approve it
Why: Naming one permission sets all the others to none. Writing a comment needs `pull-requests: write` (or `issues: write`), and this token has neither.
```

## Brad’s ci.yml: the job, its name and its steps

Under `jobs:`, the key `verify` is the **job id**: the label the file uses internally. `name: Verify` is the job’s **display name**. Each job reports one check, and this is how it gets its name: **the check is called whatever the job’s `name:` says. If the job has no `name:`, the job id is used instead.** So Brad’s job reports a check called `Verify`. The workflow name (`CI`) and the file name (`ci.yml`) play no part. `Verify` is the exact string a ruleset requires and a Vercel Deployment Check selects.

That’s why renaming a job is the quiet way to break a gate. Change `name: Verify` to `name: Verify app`, and the new check can pass while the ruleset waits forever for one called `Verify`. Keep job names unique across workflows too. Two jobs called `Verify` in two files report clashing checks, and the gates can read the wrong one.

`runs-on: ubuntu-latest` picks the runner: a fresh Linux virtual machine from GitHub. “Latest” is a label that moves. This course’s run on 27 October got Ubuntu 24.04, and the run carried a notice that `ubuntu-latest` is moving to Ubuntu 26.04 over the following weeks. If an exact version matters, the label `ubuntu-24.04` pins it. `timeout-minutes: 10` tells GitHub to cancel the job after ten minutes. Without it, a hung test could hold the runner for the default 360 minutes. A cancelled job doesn’t count as a pass.

Then the `steps`, in order, on that one machine. Each step has a `name` for the log, and then either `uses:` or `run:`. **`uses:`** runs a published action. `@v7` pins the major version: you still get the action’s fixes, but a breaking v8 can’t arrive unannounced. `with:` passes the action its inputs. **`run:`** is a shell command, typed on the runner as you would in a terminal.

| Step | What it does on the blank machine |
|---|---|
| `uses: actions/checkout@v7` | Copies the repo’s files onto the runner (on a PR, the test merge). |
| `uses: actions/setup-node@v7` `node-version: 24`, `cache: npm` | Sets up Node 24 in place of the machine’s default. `cache: npm` saves npm’s store of downloaded packages under a key made from `package-lock.json` and restores it on the next run, so installs download less. It does not cache `node_modules`. |
| `run: npm ci` | A clean install, exactly as the lockfile says. It deletes any `node_modules` first, never edits `package.json` or the lockfile, and stops with an error if the two disagree. |
| `run: npm run verify` | Brad’s one script: `npm run typecheck && npm test && npm run build`. `&&` stops at the first failure, so the step fails, the job fails, and the check goes red. |

Two choices there are deliberate. `npm ci`, not `npm install`, because a check has to test exactly what was committed. If the lockfile is out of date, you want a loud failure, not a silent fix on a machine that’s about to be thrown away. And one `verify` script, not three steps, so you can run the same command on your laptop that CI runs. Brad’s gist has you do exactly that, `npm ci` then `npm run verify`, before pushing.

```callout remember
The check is named after the job’s `name:`, or its id if there’s no `name:`. Rename it and every gate that requires it waits forever. The steps rebuild your setup on a blank machine: check out, set up Node, `npm ci`, verify.
```

```checkpoint check-6
Brad’s job is `verify:` with `name: Verify`, in a workflow named `CI` in the file `ci.yml`. What is the check called?
- [ ] `verify`
- [ ] `CI`
- [ ] `ci.yml`
- [x] `Verify`
Why: When a job has `name:`, the check carries that name. The id `verify` is used only when there’s no `name:`. The workflow’s name and the file name play no part.
```

```checkpoint check-7
Brad’s setup-node step has `cache: npm`. What does that keep between runs?
- [ ] The node_modules folder from before
- [ ] Test results from last run
- [x] npm’s store of downloaded packages
- [ ] The compiled dist build folder
Why: `cache: npm` saves npm’s download store, keyed on `package-lock.json`, so installs download less. It never caches `node_modules`: `npm ci` still installs from scratch, and nothing caches builds or test results.
```

```checkpoint check-8
A test hangs and never exits. With `timeout-minutes: 10`, what happens?
- [x] GitHub cancels the job after ten minutes
- [ ] It runs six hours, then it passes
- [ ] It waits until you cancel it yourself
- [ ] It retries the step three more times
Why: `timeout-minutes` is the longest a job may run before GitHub cancels it. Without it the limit is 360 minutes. A cancelled job isn’t a pass, so the check blocks the merge.
```

## A second real workflow: this course’s check.yml

This course sits behind the same kind of gate, set up on 27 October. Care4Mind has nothing like it running yet, so this is the nearest real example. Here is the whole file, as it is on `main`:

```yaml
# The course's CI. Its one job, "check", is the check that the "Protect main"
# ruleset and Vercel's Deployment Checks both require, by that exact name.
name: Course check

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  check:
    name: check
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Check out repository
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24

      - name: Check links, quizzes and what gets deployed
        run: node scripts/check-course.mjs
```

Read it the way you just read Brad’s, and only five things differ. The workflow is called `Course check`. The job id and its `name:` are both `check`, so whichever one you look at, the check is `check`. The timeout is five minutes. There is no `npm ci` and no `cache:`. And the last step runs `node scripts/check-course.mjs`, not `npm run verify`. The script uses only what ships with Node, so there is nothing to install and nothing to cache. It checks every link, every quiz (including that each answer in a question has the same number of words, which is why the options in these quizzes are evenly matched), and the list of files Vercel may publish.

Two gates read that one word. The ruleset “Protect main” won’t let a PR merge until a check called `check` has passed. The Vercel Deployment Check holds each production deployment back from being promoted (made live on the real domain) until GitHub’s `check` has passed on that commit. Lesson 12 is about those two gates. For now, see what a rename would do. Say an agent “tidies” `name: check` into `name: Course check`. Its PR shows a new check, `Course check`, passing. But `check` sits at “Expected”, waiting for a result nothing will ever send, and the PR can’t merge.

```callout remember
Read a job’s `name:` and you know its check’s name. On this repo it’s `check`, and both the ruleset and Vercel wait for exactly that word.
```

```checkpoint check-9
Why has this course’s `check.yml` no `npm ci` step?
- [ ] Vercel installs the packages after the merge
- [ ] The cache keeps node_modules from earlier runs
- [ ] GitHub runners install every package by default
- [x] The script has no dependencies to install
Why: `check-course.mjs` uses only what ships with Node, so there’s nothing to install or cache. Every runner starts blank, so a project with dependencies always needs an install step.
```

```checkpoint check-10
An agent’s PR changes this course’s job to `name: course-check`. What does the PR show?
- [ ] A passing check, and the merge allowed
- [x] A required check named check, never reported
- [ ] A failing check named course-check, blocking merge
- [ ] Nothing changes: rulesets follow the new name
Why: The renamed job reports `course-check`, which can pass. But the ruleset waits for `check`, and nothing reports that any more, so it stays at “Expected” and the PR can’t merge. Rulesets don’t follow renames.
```

## Triggers, secrets and concurrency you’ll meet later

CI workflows are the simple kind. The workflows in Lessons 15 and 16, which run agents and wire Care4Mind to Vercel, use more keys. You only need to recognise them now.

Five more triggers come up again and again. Each one answers “what starts this workflow?” differently.

| Trigger | What starts it | Where you’ll meet it |
|---|---|---|
| `workflow_dispatch` | A person: it adds a “Run workflow” button in the Actions tab (only once the file is on the default branch). | Testing a workflow by hand |
| `schedule` with `cron` | A timer, in UTC unless you set a `timezone`. `cron: '30 3 * * *'` is 03:30 UTC, which is 09:00 in India. Runs on the default branch, and can be late at busy times such as the top of the hour. | Nightly jobs |
| `issues` or `pull_request` with `types: [labeled]` | Someone adding a label. This is how a label can start an agent. | Lesson 15 |
| `repository_dispatch` | A system outside GitHub, through GitHub’s API. Vercel sends these when a deployment changes state, for example `vercel.deployment.success`. | Lesson 16 |
| `pull_request_target` | The same PR activity as `pull_request`, but it runs the workflow from the default branch with the base repo’s secrets and a read/write token. Safe only while it never runs the PR’s own code. | Lesson 15 |

One trap with the button: a check from a run you started by hand doesn’t count. Rulesets accept checks only from runs started by PR and push events (plus a few others). “I ran it manually and it passed” never unblocks a PR.

**Secrets.** `${{ secrets.NAME }}` pulls in a value you stored, encrypted, in the repo’s settings, such as Care4Mind’s Neon database URL. The `${{ … }}` marks an expression that GitHub fills in before the step runs. GitHub replaces known secret values with `***` in logs. That’s the `token: ***` you’ll see in this course’s log. But GitHub says plainly that masking isn’t guaranteed: a value that has been encoded or cut up can slip through. So the rule is simple: never print a secret. Pass it to a step through `env:` or `with:`, never through `echo`.

**Concurrency.** By default, every push starts its own run, even while an older run for the same branch is still going. An agent that pushes five commits in a minute starts five runs, and only the last one matters. A `concurrency` group allows one run at a time per group. `cancel-in-progress: true` cancels the older run when a newer one arrives:

```text
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

```callout remember
`workflow_dispatch` is a button, `schedule` a UTC timer, `labeled` a label, and `repository_dispatch` an outside system such as Vercel. `pull_request_target` plus the PR’s own code means danger. Secrets are masked in logs but still never printed, and concurrency cancels stale runs.
```

```checkpoint check-11
You want a workflow to start when someone adds a label to an issue. Which trigger?
- [ ] `schedule` every five minutes
- [ ] `push` to `main` only
- [x] `issues` with `types: [labeled]`
- [ ] `workflow_dispatch` button on GitHub
Why: The `issues` event fires on many kinds of activity; `types: [labeled]` narrows it to a label being added. A schedule would only notice later, and `workflow_dispatch` needs a person to click.
```

```checkpoint check-12
An agent’s workflow has `run: echo ${{ secrets.NEON_URL }}`. Should you accept it?
- [ ] Yes: GitHub always hides secrets in logs
- [ ] Yes: secrets are visible only to you
- [ ] No: secrets only work inside run steps
- [x] No: masking can miss a transformed value
Why: GitHub masks the secret values it knows, but says redaction isn’t guaranteed: an encoded or split value can slip through. Never print a secret. Secrets also work in `env:` and `with:`, which is the safe way to pass one.
```

```checkpoint check-13
An agent pushes twice to a PR a minute apart. The workflow has `concurrency` with `group: ${{ github.workflow }}-${{ github.ref }}` and `cancel-in-progress: true`. What happens?
- [ ] Both runs finish; the later one counts
- [x] The older run stops; the newer runs
- [ ] The newer run waits for the older
- [ ] Both runs are cancelled until you approve
Why: Both runs fall in the same group (same workflow, same PR), and `cancel-in-progress: true` cancels the running one when the new one arrives. Without that line, the newer run would wait as pending.
```

## Reading the result

A workflow run is the record of one trip through the file. Each job in it reports one check, and that check is what you see on the PR. Read failures from the outside in. On a PR, the merge box lists each check with a tick, a cross or a dot. The **Checks** tab shows the run behind each check. The repo’s **Actions** tab lists every run of every workflow. Click down three levels: **run → job → step**. A failed step opens on its own. Two steps appear that you never wrote. “Set up job” comes first; it records the runner image and the token’s permissions. “Complete job” comes last.

From the terminal, the same three levels look like this. Your agent runs these when it watches its own PR; you can run them too, because they only read:

```sh
gh pr checks 12 --watch          # wait until every check on PR 12 finishes
gh run list --limit 5            # latest runs: workflow, branch, event, result, run ID
gh run view <id>                 # one run: its jobs and any notices
gh run view <id> --log-failed    # only the output of the steps that failed
```

Most red checks are one of five things, and the step that failed usually tells you which:

| You see | It usually means | Ask the agent to |
|---|---|---|
| `npm ci` fails: lockfile and `package.json` not “in sync” | Someone changed `package.json` without committing the updated lockfile | Run `npm install` locally and commit `package-lock.json` |
| `npm run verify` fails, with a test name in the log | A real failure. The gate did its job. | Fix the code, or explain why the test is wrong |
| Passes on your laptop, fails in CI on syntax or a missing API | CI is using a different Node version from yours or production’s | Make `node-version` match `engines` |
| Cancelled at exactly 10 minutes | Something hung: a server that never closed, a prompt waiting for input | Find what hung, rather than raise the timeout |
| The required check stuck at “Expected” | Nothing reported a check by that name: a branch filter that doesn’t match, a merge conflict, or a renamed job | Show you the `on` block and the job’s `name:` |

```callout remember
Read a failure from the outside in: which check, which job, which step, then the log lines. `gh run view <id> --log-failed` takes you straight to the step that broke. “Expected” means nothing reported that check name at all.
```

```checkpoint check-14
Verify failed on PR 12. Which command shows only the output of the step that broke?
- [ ] `gh run list --limit 5`
- [ ] `gh pr checks 12 --watch`
- [x] `gh run view <id> --log-failed`
- [ ] `git log --oneline -n 5`
Why: `--log-failed` prints the log of the failed steps only. `gh run list` finds the run ID, and `gh pr checks --watch` waits for results without showing logs. `git log` shows commits, not runs.
```

```checkpoint check-15
In CI, `npm ci` stops with “can only install packages when your package.json and package-lock.json … are in sync”. What happened?
- [x] Someone changed package.json without updating the lockfile
- [ ] A test failed inside the verify script
- [ ] The runner ran out of disk space
- [ ] The npm cache was empty this time
Why: `npm ci` won’t fix a mismatch itself. Ask the agent to run `npm install` locally and commit the updated `package-lock.json`. A failing test would show in the _Verify application_ step, and an empty cache only makes the install slower.
```

```checkpoint check-16
Your PR shows `Verify` as “Expected”, waiting for a status, and the Actions tab has no run for it. What’s likeliest?
- [ ] A test failed in the verify step
- [x] The workflow’s branch filter skipped this PR
- [ ] The secret NEON_URL was printed in logs
- [ ] The job hit its ten-minute timeout limit
Why: “Expected” means nothing has reported that check at all. A failing test or a timeout would show a red run. With no run, the usual causes are a filter that doesn’t match (such as `branches: [master]`) or a merge conflict. If a run exists but under another name, the job was renamed.
```

## Practice: spot the bug

Each snippet has one deliberate problem. Read it the way you’d read an agent’s diff.

```checkpoint practice-17
Care4Mind’s default branch is `main`. What’s wrong?`on:
  pull_request:
    branches: [master]
  push:
    branches: [master]`
- [ ] It runs twice on every PR
- [x] PRs into main never trigger it
- [ ] It runs only on forked PRs
- [ ] It needs write permission to run
Why: There is no branch called `master`, so neither filter ever matches. No PR into `main` runs it, and neither does a push to `main`. A required check would wait at “Expected” forever. Older repos used `master`; always match the real default branch.
```

```checkpoint practice-18
The ruleset on `main` requires a check called `Verify`. An agent changed one line:`jobs:
  verify:
    name: Verify app
    runs-on: ubuntu-latest`
- [ ] Names with spaces are invalid in YAML
- [ ] The job id must be capitalised too
- [ ] The ubuntu-latest runner cannot run named jobs
- [x] The required check never reports, blocking merges
Why: The check is now called `Verify app`. It may pass, but nothing reports `Verify`, so the required check waits at “Expected” and no PR can merge. Spaces in a job name are fine, and the id doesn’t matter while `name:` is set.
```

```checkpoint practice-19
What’s wrong with these steps?`- uses: actions/setup-node@v7
  with:
    node-version: 24
    cache: npm
- run: npm install
- run: npm run verify`
- [x] A lockfile mismatch gets silently patched, not reported
- [ ] The npm cache works only with Yarn projects
- [ ] setup-node does not install npm on Ubuntu runners
- [ ] npm run verify must always come before installing
Why: When the lockfile and `package.json` disagree, `npm install` can quietly rewrite the lockfile on the runner, so CI tests something nobody committed. `npm ci` stops with an error instead. npm comes with Node, and `cache: npm` is for npm.
```

```checkpoint practice-20
This job should post “Verify passed” on the PR. Why will it fail?`permissions:
  contents: read

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - run: gh pr comment $URL --body 'Verify passed'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          URL: ${{ github.event.pull_request.html_url }}`
- [ ] The gh tool is not installed on runners
- [ ] Secrets can never be passed through env blocks
- [x] The token can only read, so commenting fails
- [ ] A PR URL is not accepted by gh
Why: Naming `contents: read` sets every other permission to none, so the token can’t write a comment. It needs `pull-requests: write` as well. GitHub CLI comes preinstalled on GitHub’s runners, `env:` is the recommended way to pass a secret, and `gh pr comment` accepts a PR URL.
```

```checkpoint practice-21
Brad’s `package.json` sets `engines.node` to `24.x`, and Vercel deploys with that. What’s wrong?`- uses: actions/setup-node@v7
  with:
    node-version: 20
    cache: npm`
- [ ] setup-node reads engines first, so this line is ignored
- [ ] The npm cache key breaks when Node versions differ
- [ ] npm ci always refuses to run below Node 24
- [x] CI tests Node 20, but Vercel deploys Node 24
Why: `node-version` decides which Node the runner gets; `engines` doesn’t switch it. So CI passes or fails on Node 20 while production runs Node 24. A mismatched `engines` makes npm print a warning, not stop. Set `node-version: 24`.
```

```checkpoint practice-22
Care4Mind’s ruleset requires `Verify` on every PR. What’s wrong with this trigger?`on:
  push:
    branches: [main]`
- [ ] Pushes to main are blocked by this trigger
- [x] PRs get no check until after they merge
- [ ] It runs on every branch, not just main
- [ ] It also needs workflow_dispatch to run at all
Why: Only pushes to `main` start it, and a PR’s commits are pushed to its own branch. So PRs never get the check: with the ruleset they wait at “Expected” forever, and without one they merge unchecked. Add `pull_request` to `main`.
```

## Tell your agent

Use this in the Lesson 13 lab, in your copy of Brad’s starter. Care4Mind will get the same shape later, with its own commands.

```text
Add .github/workflows/ci.yml: run on pull requests to main and pushes to main, permissions contents: read, one job with id verify and name Verify, on ubuntu-latest with a 10-minute timeout. Steps: checkout, setup-node 24 with npm cache, npm ci, npm run verify. Run npm ci and npm run verify locally before you push. Don’t rename the job later: the ruleset requires it by name. When the PR is open, tell me the exact check name it reports.
```

## Try it

These three commands only read; they change nothing. The first lists this course’s latest workflow runs. The second prints the first 40 lines of one run’s log: put a run ID from the first list in place of `<id>`. The third shows the workflow file.

```sh
gh run list -R SiddharthMuramkar/learn-matt-flow --limit 5
gh run view -R SiddharthMuramkar/learn-matt-flow <id> --log | head -40
cat ~/Desktop/learn-matt-flow/.github/workflows/check.yml
```

On 27 October the list had one run: `Course check` on `main`, event `push`, `success`, 11 seconds. You may see more by now. In the log, find four things, all inside “Set up job” and the checkout step. The operating system block (Ubuntu 24.04 that day). “GITHUB_TOKEN Permissions”, listing only `Contents: read` and `Metadata: read`. “Complete job name: check”: there’s your check’s name. And `token: ***` under the checkout step: a secret, masked.

## Check yourself

From memory, without scrolling up.

```final-test final-23
An agent’s Care4Mind workflow is open in front of you. Which key tells you what machine each job runs on?
- [ ] `on`
- [ ] `uses`
- [x] `runs-on`
- [ ] `permissions`
Why: `runs-on` picks the runner, such as `ubuntu-latest`. `on` is the trigger, `uses` picks an action for one step, and `permissions` sets what the token may do.
```

```final-test final-24
A workflow lists only `pull-requests: write` under `permissions`. What may its token do with the repo’s files?
- [x] Nothing: unnamed permissions are set to none
- [ ] Read them, since contents defaults to read
- [ ] Write them, since write includes every scope
- [ ] Whatever the repository’s default token setting allows
Why: Once any permission is named, every one not named is none, `contents` included. Add `contents: read` next to it.
```

```final-test final-25
In the Lesson 13 lab you keep Brad’s file but change `name: Verify` to `name: verify-app`. What must the ruleset require?
- [ ] `Verify`
- [ ] `verify`
- [ ] `CI`
- [x] `verify-app`
Why: With `name:` set, the check carries that name. `verify` is the job id, used only when there’s no `name:`; `Verify` was the old name; `CI` is the workflow’s name.
```

```final-test final-26
Which trigger runs with the base repository’s token and secrets, so must never build a pull request’s own code?
- [ ] `pull_request`
- [x] `pull_request_target`
- [ ] `workflow_dispatch`
- [ ] `schedule`
Why: `pull_request_target` runs the default branch’s workflow with secrets and a read/write token. Checking out and running the PR’s code under it hands that access to whoever wrote the PR. Plain `pull_request` gets no secrets for forks.
```

```final-test final-27
In Brad’s workflow, Verify shows “in progress” for ten minutes, then ends as cancelled. What’s the likeliest story?
- [ ] The lockfile was out of sync with package.json
- [ ] A secret was printed, so GitHub stopped it
- [x] Something hung, and the timeout cancelled the job
- [ ] The branch filter quietly skipped this pull request
Why: `timeout-minutes: 10` cancels the job at ten minutes. A lockfile mismatch fails fast in `npm ci`, printing a secret doesn’t stop a run, and a skipped run never shows “in progress”.
```

## Read next

**Read:** [GitHub Docs, Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), about 15 minutes if you read only four sections: `on`, `permissions`, `jobs.<job_id>.name` and `jobs.<job_id>.steps`. Every key in this lesson comes from that page, and it’s where to look when an agent’s workflow uses one you don’t know.

Keep the CI/CD cheat sheet open the first time you review a workflow an agent wrote.

```sources
- [GitHub Docs, Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [Brad Traversy, CI/CD crash course](https://www.youtube.com/watch?v=B7GM6F3BP6A)
- [Ubuntu 24.04 runner image](https://github.com/actions/runner-images/blob/ubuntu24/20261012.334/images/ubuntu/Ubuntu2404-Readme.md)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#name)
- [gist](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onpull_requestpull_request_targetbranchesbranches-ignore)
- [GitHub Docs, Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)
- [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token)
- [Workflow syntax, permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions)
- [GitHub Docs, Troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idname)
- [actions/checkout](https://github.com/actions/checkout/blob/main/.github/workflows/licensed.yml)
- [test.yml](https://github.com/actions/checkout/blob/main/.github/workflows/test.yml)
- [Vercel, Deployment Checks](https://vercel.com/docs/deployment-checks)
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#choosing-github-hosted-runners)
- [runner-images #14748](https://github.com/actions/runner-images/issues/14748)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsuses)
- [actions/setup-node README](https://github.com/actions/setup-node)
- [npm docs, npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)
- [check.yml on GitHub](https://github.com/SiddharthMuramkar/learn-matt-flow/blob/main/.github/workflows/check.yml)
- [GitHub Docs, Status checks](https://docs.github.com/en/pull-requests/reference/status-checks)
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)
- [Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- [GitHub Docs, Secrets](https://docs.github.com/en/actions/concepts/security/secrets)
- [Using secrets in GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
- [Control the concurrency of workflows and jobs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)
- [GitHub Docs, Using workflow run logs](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs)
- [gh run view](https://cli.github.com/manual/gh_run_view)
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks)
- [gh run list](https://cli.github.com/manual/gh_run_list)
- [Vercel, Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
```
