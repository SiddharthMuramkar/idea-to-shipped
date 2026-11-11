---
title: Reading a GitHub Actions workflow
slug: reading-a-workflow
summary: Read any workflow file and say what runs, when, on which machine, with which permissions, and which check name it reports.
image: /images/lessons/reading-a-workflow.jpg
imageAlt: A music box's metal cylinder studded with pins above a steel comb, the pins set in advance to play a tune.
---

Say an agent adds a file called `ci.yml` to your `recipes` repo and opens a pull request. A minute later a green tick appears on the PR, with a name beside it. About thirty lines of YAML decided all of that: when the check ran, on which machine, with which permissions, and what the tick is called. You’re the one who has to read that file and say whether it’s right.

```goals
- You’ll be able to read any workflow file and say what runs, when, on which machine, with which permissions, and which check name it reports.
- You’ll be able to spot the one-line mistakes that make a check skip, fail or never report.
- You’ll know where to look when a check goes red or gets stuck, and what the usual causes are.
```

## Six words before any YAML

**GitHub Actions** is GitHub’s built-in way to run work on its machines when something happens in your repo. CI, from [What CI/CD is](/learn/what-ci-cd-is), is what you’ll use it for first.

**An event starts a workflow, each job in it runs on a fresh runner, and each job reports one check (a pass or fail on the commit), named after the job.**

Workflows are written in YAML: plain-text settings, where `key: value` sets something, a leading `-` starts a list item, and indentation (spaces, never tabs) shows what belongs inside what. A short list can also sit on one line, in square brackets: `branches: [main]` is the same as `branches:` with `- main` indented under it. What’s new is the vocabulary. Six words cover every workflow you’ll read.

The table’s last column shows each word in Brad’s lab: the pipeline that Brad Traversy, a web development teacher on YouTube, builds in his CI/CD crash course. You’ll read its workflow file in full below.

| Word | What it is | In Brad’s lab |
|---|---|---|
| **Workflow** | One YAML file in `.github/workflows/`. A repo can have several. | `ci.yml` |
| **Event** | What happens on GitHub (or outside it) that starts the workflow: a push, a PR opened, a label added, a timer. | A push to `main`, a PR into `main` |
| **Job** | A list of steps that all run on one runner. | `verify` |
| **Step** | One task inside a job: either a shell command or an action. | Four steps |
| **Action** | A packaged, reusable step that someone published. | `actions/checkout`, `actions/setup-node` |
| **Runner** | The machine that runs one job at a time. | `ubuntu-latest` |

These names nest inside each other: GitHub Actions runs workflows, a workflow holds jobs, and a job holds steps.

```diagram
type: layers
caption: "These names nest inside each other"
mode: nested
layers:
  - label: "GitHub Actions"
    note: "GitHub’s built-in way to run work on its machines"
    children:
      - label: "Workflow"
        note: "One YAML file in `.github/workflows/`"
        children:
          - label: "Job"
            note: "A list of steps that all run on one runner"
            children:
              - label: "Step"
                note: "One task inside a job: either a shell command or an action"
```

By default, a workflow’s jobs run at the same time. A job waits for another only if you give it `needs:` naming that job.

The runner is the word that explains the rest. GitHub’s runners are fresh virtual machines (temporary computers in GitHub’s cloud), made for one job and thrown away after it. Nothing from your laptop is there: no code, no `node_modules` folder of installed packages, not your Node version. The machine has only GitHub’s standard tools, such as a default version of Node and `gh`, GitHub’s command-line tool. Every step in a CI job exists to rebuild, from that bare start, what your laptop already has. That’s the point. A check that passes on a blank machine can’t be relying on something only you have installed.

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
Why: It’s an action: published code from the `actions/checkout` repo, and `@v7` pins it to version 7. It copies your repo’s files onto the blank runner. In a workflow file, a step runs an action with `uses:` and a shell command with `run:`.
```

```checkpoint quick-3
Your workflow has two jobs, and neither has `needs:`. What happens when it runs?
- [x] Both run at the same time, since neither one waits
- [ ] The first runs to the end, and then the second starts
- [ ] Only the first runs, unless it’s told to start the second
Why: By default, jobs run at the same time. One waits for another only if you give it `needs:` naming that job.
```

## Brad’s ci.yml: when it runs, and what it may touch

Here is the workflow from Brad Traversy’s lab, exactly as it appears in his gist, the GitHub page of commands and code that goes with his CI/CD crash course. In [the lab](/learn/lab-gated-pipeline) you’ll add it to your own copy of his starter app, by hand as Brad does or through your agent. Read it once from top to bottom, then take it apart in two halves below.

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

`name: CI` is the workflow’s display name. You’ll see it in the Actions tab and next to each run. It is _not_ the name of the check; that comes from the job, in the next part.

`on` lists the events that start the workflow. Here there are two. `push` with `branches: [main]` fires when commits land on `main`; once a ruleset (a set of rules on a branch) blocks direct pushes, that only happens when a PR is merged. `pull_request` with `branches: [main]` needs more care. For pull requests the filter is matched against the branch the PR _targets_, its base, not the branch it came from. So every PR into `main` runs it, whatever the agent called its own branch. With no `types` listed, it runs when a PR is opened or reopened, and every time new commits are pushed to it (GitHub calls that `synchronize`).

One fact surprises most people. On an open PR, the code that gets checked out isn’t the agent’s branch as it was pushed. GitHub makes a test merge of the branch into `main`, and CI checks that, which is what you’d actually get by merging. It follows that a PR with a merge conflict (see [Undo and merge conflicts](/learn/undo-and-conflicts)) gets no run at all until the conflict is fixed.

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

Under `jobs:`, the key `verify` is the **job id**: the label the file uses internally. `name: Verify` is the job’s **display name**. Each job reports one check, and this is how it gets its name: **the check is called whatever the job’s `name:` says. If the job has no `name:`, the job id is used instead.**

So Brad’s job reports a check called `Verify`. The workflow name (`CI`) and the file name (`ci.yml`) play no part. `Verify` is the exact string that a ruleset requires and that a Vercel Deployment Check selects: the setting, met in [What CI/CD is](/learn/what-ci-cd-is), that holds a release until the check passes.

That’s why renaming a job is the quiet way to break a gate. Change `name: Verify` to `name: Verify app`, and the new check can pass while the ruleset waits forever for one called `Verify`. Keep job names unique across workflows too. Two jobs called `Verify` in two files report clashing checks, and the gates can read the wrong one.

`runs-on: ubuntu-latest` picks the runner: a fresh Linux virtual machine from GitHub. “Latest” is a label that moves. From time to time GitHub points it at a newer Ubuntu release, after announcing the change: the move from Ubuntu 24.04 to 26.04 began in October 2026. Each run’s log records which version it got, and if an exact version matters, a label such as `ubuntu-24.04` pins it. `timeout-minutes: 10` tells GitHub to cancel the job after ten minutes. Without it, a hung test could hold the runner for the default 360 minutes. A cancelled job doesn’t count as a pass.

Then the `steps`, in order, on that one machine. Each step has a `name` for the log, and then either `uses:` or `run:`. **`uses:`** runs a published action. `@v7` pins the major version: you still get the action’s fixes, but a breaking v8 can’t arrive unannounced. `with:` passes the action its inputs. **`run:`** is a shell command, typed on the runner as you would in a terminal.

| Step | What it does on the blank machine |
|---|---|
| `uses: actions/checkout@v7` | Copies the repo’s files onto the runner (on a PR, the test merge). |
| `uses: actions/setup-node@v7` with `node-version: 24`, `cache: npm` | Sets up Node 24 in place of the machine’s default. `cache: npm` saves npm’s store of downloaded packages under a key made from `package-lock.json`, and restores it on the next run, so installs download less. It does not cache `node_modules`. |
| `run: npm ci` | A clean install from the lockfile, `package-lock.json`, which records the exact version of every package. It deletes any `node_modules` first, never edits `package.json` (the project’s list of packages and scripts) or the lockfile, and stops with an error if the two disagree. |
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

## A second real workflow: GitHub’s own licensed.yml

Workflows differ, so read one more. This one is real and public: `licensed.yml`, from GitHub’s own `actions/checkout` repo, the home of the action in Brad’s first step. Going by its name, its one job checks the licenses of the packages the action depends on.

```yaml
name: Licensed

on:
  push: {branches: main}
  pull_request: {branches: main}

jobs:
  test:
    runs-on: ubuntu-latest
    name: Check licenses
    steps:
      - uses: actions/checkout@v7
      - run: npm ci
      - run: npm run licensed-check
```

Read it the way you read Brad’s, and six things differ:

- **The workflow’s name** is `Licensed`. It labels the runs in the Actions tab, and plays no part in the check’s name.
- **The triggers are Brad’s, written on one line each.** YAML lets you write a short set of keys on one line between braces, and GitHub accepts a single branch name where it expects a list. So `push: {branches: main}` means the same as Brad’s three lines from `push:` down to `- main`.
- **There’s no `permissions` key.** The token then gets the default access set in the repository’s or the organization’s settings, so the file alone doesn’t tell you what the job may do.
- **The job id is `test`, and its `name:` is `Check licenses`.** So the check is called `Check licenses`. The order of keys inside a job doesn’t matter: `name:` can come after `runs-on:`.
- **There’s no `timeout-minutes`,** so a hung job could run for the default 360 minutes.
- **There’s no `setup-node` step, and the steps have no names.** `npm ci` runs on whatever Node the runner image has preinstalled, which changes when GitHub updates the image. The `engines` field, where a project’s `package.json` names the Node version it expects, doesn’t change that. Without a `name:`, the log labels each step by what it runs, such as “Run npm ci”.

The same repo shows the naming rule from the other side. Its main workflow, `test.yml`, has a job with the id `build` and no `name:`, so that check is called `build`.

Names matter because gates read them. In the lab, two gates read one word, `Verify`. The ruleset “Protect main” won’t let a PR merge until a check called `Verify` has passed. The Vercel Deployment Check holds each production deployment back from being promoted (made live on the real domain) until `Verify` has passed on that commit. [Gates: checks that block](/learn/gates) sets up both. For now, see what a rename does. Say an agent “tidies” `name: Verify` into `name: Verify app`. Its PR shows a new check, `Verify app`, passing. But `Verify` sits at “Expected”, waiting for a result nothing will ever send, and the PR can’t merge.

```callout remember
Read a job’s `name:` and you know its check’s name; with no `name:`, it’s the job id. Read what a file leaves out, too: no `permissions` means the repo’s defaults, no `timeout-minutes` means 360 minutes, and no `setup-node` means the runner’s own Node.
```

```checkpoint check-9
What is the check from `licensed.yml` called?
- [ ] `Licensed`
- [ ] `test`
- [x] `Check licenses`
- [ ] `licensed.yml`
Why: The job has `name: Check licenses`, so the check carries that name. `test` is the job id, used only when there’s no `name:`. `Licensed` is the workflow’s name, and the file name plays no part.
```

```checkpoint check-node
`licensed.yml` has no `setup-node` step. Which Node runs its `npm ci`?
- [x] The Node preinstalled on the runner image
- [ ] Node 24, read from the engines field
- [ ] The Node installed on your own laptop
- [ ] None: npm ci fails without setup-node
Why: Without setup-node, the step uses the Node that comes with the runner image, which changes when GitHub updates the image. Nothing else on the runner switches Node to match `engines`, and the runner has nothing from your laptop.
```

```checkpoint check-10
In the lab, an agent’s PR changes Brad’s job to `name: verify-app`. What does the PR show?
- [ ] A passing check, and the merge allowed
- [x] A required check named Verify, never reported
- [ ] A failing check named verify-app, blocking merge
- [ ] Nothing changes: rulesets follow the new name
Why: The renamed job reports `verify-app`, which can pass. But the ruleset waits for `Verify`, and nothing reports that any more, so it stays at “Expected” and the PR can’t merge. Rulesets don’t follow renames.
```

## Triggers, secrets and concurrency you’ll meet later

CI workflows are the simple kind. Workflows that run agents, or that react to Vercel deployments, use more keys: you’ll meet them in [Agents in GitHub Actions](/learn/agents-in-github-actions) and [Setting up your own project’s pipeline](/learn/your-projects-pipeline). You only need to recognise them now.

Five more triggers come up again and again. Each one answers “what starts this workflow?” differently.

| Trigger | What starts it | Where you’ll meet it |
|---|---|---|
| `workflow_dispatch` | A person: it adds a “Run workflow” button in the Actions tab (only once the file is on the default branch). | Testing a workflow by hand |
| `schedule` with `cron` | A timer, in UTC unless you set a `timezone`. `cron: '30 3 * * *'` is 03:30 UTC every day. It runs on the default branch, and can be late at busy times such as the start of every hour. | Nightly jobs |
| `issues` or `pull_request` with `types: [labeled]` | Someone adding a label. This is how a label can start an agent. | [Agents in GitHub Actions](/learn/agents-in-github-actions) |
| `repository_dispatch` | A system outside GitHub, through GitHub’s API. Vercel sends these when a deployment changes state, for example `vercel.deployment.success`. | [Setting up your own project’s pipeline](/learn/your-projects-pipeline) |
| `pull_request_target` | The same PR activity as `pull_request`, but it runs the workflow from the default branch with the base repo’s secrets and a read/write token. Safe only while it never runs the PR’s own code. | [Agents in GitHub Actions](/learn/agents-in-github-actions) |

One trap with the button: a check from a run you started by hand doesn’t count. Rulesets accept checks only from runs started by events such as `pull_request` and `push`, plus a few others. “I ran it manually and it passed” never unblocks a PR.

**Secrets.** `${{ secrets.NAME }}` pulls in a value you stored, encrypted, in the repo’s settings, such as a database password. The `${{ … }}` marks an **expression**: something GitHub fills in before the step runs. GitHub replaces known secret values with `***` in logs, which is the `token: ***` you’ll see under a checkout step. But GitHub says plainly that masking isn’t guaranteed: a value that has been encoded or cut up can slip through. So the rule is plain too: never print a secret. Pass it to a step through `env:` or `with:`, never through `echo`.

**Concurrency.** By default, every push starts its own run, even while an older run for the same branch is still going. An agent that pushes five commits in a minute starts five runs, and only the last one matters. A `concurrency` group allows one run at a time per group, and `cancel-in-progress: true` cancels the older run when a newer one arrives:

```yaml
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
An agent’s workflow has `run: echo ${{ secrets.DATABASE_URL }}`. Should you accept it?
- [ ] Yes: GitHub always hides secrets in logs
- [ ] Yes: secrets are visible only to you
- [ ] No: secrets only work inside run steps
- [x] No: masking can miss a transformed value
Why: GitHub masks the secret values it knows, but says redaction isn’t guaranteed: an encoded or split value can slip through. Never print a secret. Secrets also work in `env:` and `with:`, which is the safe way to pass one.
```

```checkpoint check-13
An agent pushes a second commit to a PR while the first commit’s run is still going. The workflow has `concurrency` with `group: ${{ github.workflow }}-${{ github.ref }}` and `cancel-in-progress: true`. What happens?
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

Most red or stuck checks are one of these six, and the step that failed usually tells you which:

| You see | It usually means | Ask the agent to |
|---|---|---|
| `npm ci` fails: lockfile and `package.json` not “in sync” | Someone changed `package.json` without committing the updated lockfile | Run `npm install` locally and commit `package-lock.json` |
| `npm run verify` fails, with a test name in the log | A real failure. The gate did its job. | Fix the code, or explain why the test is wrong |
| Passes on your laptop, fails in CI on syntax or a missing API | CI is using a different Node version from yours or production’s | Make `node-version` match `engines` |
| Cancelled at exactly 10 minutes | Something hung: a server that never closed, a prompt waiting for input | Find what hung, rather than raise the timeout |
| The required check stuck at “Expected” | Nothing reported a check by that name: a branch or path filter that skipped the workflow, a merge conflict, or a renamed job | Show you the `on` block and the job’s `name:` |
| A check passed, but the merge is still blocked | A newer commit was pushed since: required checks must pass on the latest commit | Wait for the run on the newest commit |

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
- [ ] A secret was printed in the logs
- [ ] The job hit its ten-minute timeout limit
Why: “Expected” means nothing has reported that check at all. A failing test or a timeout would still leave a run, failed or cancelled. With no run, the usual causes are a filter that doesn’t match (such as `branches: [master]`) or a merge conflict. If a run exists but under another name, the job was renamed.
```

## Practice: spot the bug

Each snippet has one deliberate problem. Read it the way you’d read an agent’s diff.

Your repo’s default branch is `main`, and an agent wrote this trigger:

```yaml
on:
  pull_request:
    branches: [master]
  push:
    branches: [master]
```

```checkpoint practice-17
What’s wrong with the trigger above?
- [ ] It runs twice on every PR
- [x] PRs into main never trigger it
- [ ] It runs only on forked PRs
- [ ] It needs write permission to run
Why: There is no branch called `master`, so neither filter ever matches. No PR into `main` runs it, and neither does a push to `main`. A required check would wait at “Expected” forever. Older repos used `master`; always match the real default branch.
```

The ruleset on `main` requires a check called `Verify`. An agent changed one line of Brad’s job:

```yaml
jobs:
  verify:
    name: Verify app
    runs-on: ubuntu-latest
```

```checkpoint practice-18
What’s wrong with the agent’s change above?
- [ ] Names with spaces are invalid in YAML
- [ ] The job id must be capitalised too
- [ ] The ubuntu-latest runner cannot run named jobs
- [x] The required check never reports, blocking merges
Why: The check is now called `Verify app`. It may pass, but nothing reports `Verify`, so the required check waits at “Expected” and no PR can merge. Spaces in a job name are fine, and the id doesn’t matter while `name:` is set.
```

An agent wrote these steps:

```yaml
- uses: actions/setup-node@v7
  with:
    node-version: 24
    cache: npm
- run: npm install
- run: npm run verify
```

```checkpoint practice-19
What’s wrong with the steps above?
- [x] A lockfile mismatch gets silently patched, not reported
- [ ] The npm cache works only with Yarn projects
- [ ] setup-node does not install npm on Ubuntu runners
- [ ] npm run verify must always come before installing
Why: When the lockfile and `package.json` disagree, `npm install` can quietly rewrite the lockfile on the runner, so CI tests something nobody committed. `npm ci` stops with an error instead. npm comes with Node, and `cache: npm` is for npm.
```

This job should post “Verify passed” on the PR:

```yaml
permissions:
  contents: read

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - run: gh pr comment $URL --body 'Verify passed'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          URL: ${{ github.event.pull_request.html_url }}
```

```checkpoint practice-20
Why will the job above fail?
- [ ] The gh tool is not installed on runners
- [ ] Secrets can never be passed through env blocks
- [x] The token can only read, so commenting fails
- [ ] A PR URL is not accepted by gh
Why: Naming `contents: read` sets every other permission to none, so the token can’t write a comment. It needs `pull-requests: write` as well. GitHub CLI comes preinstalled on GitHub’s runners, `env:` is the recommended way to pass a secret, and `gh pr comment` accepts a PR URL.
```

Brad’s `package.json` sets `engines.node` to `24.x`, and Vercel deploys with that. An agent wrote this step:

```yaml
- uses: actions/setup-node@v7
  with:
    node-version: 20
    cache: npm
```

```checkpoint practice-21
What’s wrong with the step above?
- [ ] setup-node reads engines first, so this line is ignored
- [ ] The npm cache key breaks when Node versions differ
- [ ] npm ci always refuses to run below Node 24
- [x] CI tests Node 20, but Vercel deploys Node 24
Why: `node-version` decides which Node the runner gets; `engines` doesn’t switch it. So CI passes or fails on Node 20 while production runs Node 24. A mismatched `engines` makes npm print a warning, not stop. Set `node-version: 24`.
```

Your ruleset requires `Verify` on every PR, and the workflow’s trigger is this:

```yaml
on:
  push:
    branches: [main]
```

```checkpoint practice-22
What’s wrong with the trigger above?
- [ ] Pushes to main are blocked by this trigger
- [x] PRs get no check until after they merge
- [ ] It runs on every branch, not only main
- [ ] It also needs workflow_dispatch to run at all
Why: Only pushes to `main` start it, and a PR’s commits are pushed to its own branch. So PRs never get the check: with the ruleset they wait at “Expected” forever, and without one they merge unchecked. Add `pull_request` to `main`.
```

## Tell your agent

Use this in [the lab](/learn/lab-gated-pipeline), in your copy of Brad’s starter. A project of your own gets the same shape, with its own commands.

```text
Add .github/workflows/ci.yml: run on pull requests to main and pushes to main, permissions contents: read, one job with id verify and name Verify, on ubuntu-latest with a 10-minute timeout. Steps: checkout, setup-node 24 with npm cache, npm ci, npm run verify. Run npm ci and npm run verify locally before you push. Don’t rename the job later: the ruleset requires it by name. When the PR is open, tell me the exact check name it reports.
```

## Try it

````try
Read a real workflow’s runs, and one run’s log, on GitHub’s public `actions/checkout` repo. These commands only read; they change nothing.

**You need:** `gh`, the GitHub CLI, logged in to your GitHub account. If it isn’t set up, see [What Git and GitHub are](/learn/what-git-and-github-are).

1. List the latest runs of `licensed.yml` that passed, so each one has a full log. Each line shows the result, the run’s title, the workflow (`Licensed`), the branch, the event (`push` or `pull_request`), the run ID, how long it took and how long ago.

```sh
gh run list -R actions/checkout --workflow licensed.yml --status success --limit 5
```

2. Pick a run ID from that list and print the start of its log, with the ID in place of `<id>`. Each line starts with the job’s name, `Check licenses`.

```sh
gh run view -R actions/checkout <id> --log | head -80
```

3. In the log, find four things. Inside “Set up job”: the **Operating System** lines (the Ubuntu version this run got), the **GITHUB_TOKEN Permissions** lines (what this run’s token may do), and the line **Complete job name: Check licenses**. Then, under the checkout step, `token: ***`: a secret, masked.
4. Open the file in your browser and match each line to what you saw: `https://github.com/actions/checkout/blob/main/.github/workflows/licensed.yml`.

**It’s working if:**

- [ ] The run list shows `Licensed` runs, with `push` or `pull_request` as the event.
- [ ] You found the Ubuntu version, the token’s permissions and `Complete job name: Check licenses` in the log.
- [ ] You can point at the line in `licensed.yml` that gives the check its name.
````

## Cheat sheet

Everything from [What CI/CD is](/learn/what-ci-cd-is) and this lesson, on one page.

**Words**

- **Check:** the pass/fail result one CI job reports on a commit, named after the job’s `name:`, or its id if there’s none. Gates require it by that name: rename the job and they wait forever.
- **Gate:** an automatic check that blocks the next step, merging or going live. A check alone only reports.
- **CI:** small changes merged into `main` at least daily, each checked by an automated build with tests. Green means the checks found nothing, not that the code is right.
- **Continuous delivery · continuous deployment:** always ready, and a person clicks to go live · every change that passes the gates goes live with no click.
- **Runner:** the machine that runs one job. GitHub’s are fresh VMs, thrown away after the job, with only the commit, the locked dependencies and GitHub’s tools.
- **Workflow · job · step · action:** one YAML file in `.github/workflows/` · steps run in order on one runner, reporting one check · one shell command (`run:`) or action (`uses:`) · a published, reusable step.
- **Preview deployment · promote:** a test copy of the site for one branch or PR, at its own URL · give a deployment the production domain. On Vercel, a built deployment isn’t always live.

**Brad’s ci.yml, annotated**

```yaml
name: CI                     # Actions tab label, not the check

on:
  push:                      # commits land on main, such as a merge
    branches:
      - main
  pull_request:              # opened, reopened, new commits
    branches:
      - main                 # the PR's base; CI tests the PR merged into it

permissions:
  contents: read             # read code only; anything unnamed is none

jobs:
  verify:                    # job id: the check name only if no name:
    name: Verify             # THE check name the gates require
    runs-on: ubuntu-latest   # fresh VM; "latest" moves, ubuntu-24.04 pins
    timeout-minutes: 10      # cancels a hung job (default 360)

    steps:                   # in order, on that one runner
      - name: Check out repository
        uses: actions/checkout@v7    # an action, major version 7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24           # match engines (24.x)
          cache: npm                 # npm's download store, not node_modules

      - name: Install dependencies
        run: npm ci                  # exactly the lockfile, or an error

      - name: Verify application
        run: npm run verify          # first failure turns the check red
```

GitHub’s `licensed.yml` has the same triggers on one line each, no `permissions`, the job id `test` named `Check licenses`, no timeout and no `setup-node`. Any `write` permission needs a visible reason. Secrets: `${{ secrets.NAME }}`, passed through `env:` or `with:`, never `echo`ed. `concurrency` with `cancel-in-progress: true` cancels a stale run when a newer push arrives.

**Triggers**

| Trigger | Starts it | Watch for |
|---|---|---|
| `push` to `main` | Commits landing on `main` | The only run on the merged commit itself |
| `pull_request` to `main` | A PR opened, reopened or pushed to | `branches` means the base. A PR with a merge conflict gets no run. |
| `workflow_dispatch` | The “Run workflow” button (file on the default branch) | Its checks don’t count on a PR |
| `schedule` + `cron` | A timer, in UTC unless you set `timezone`; default branch | Can run late at the start of the hour |
| `issues` or `pull_request`, `types: [labeled]` | Someone adding a label | How a label starts an agent |
| `repository_dispatch` | An outside system, through GitHub’s API | Vercel sends one when a deployment changes state |
| `pull_request_target` **(danger)** | PR activity, run from the default branch with secrets and a read/write token | Never run the PR’s own code under it |

**Red or stuck**

| Symptom | Likely cause |
|---|---|
| Passes locally; CI says “Cannot find module” | A file never committed, or a package missing from `package.json` |
| `npm ci` fails: not “in sync”, or no lockfile | `package.json` changed without the lockfile, or `package-lock.json` never committed |
| `verify` fails with a test name | A real failure: the gate worked |
| Passes locally, fails in CI on syntax | A different Node version: match `node-version` to `engines` |
| Cancelled at exactly the timeout | Something hung; don’t raise the timeout |
| Required check “Expected”, no run | A branch or path filter that skipped it, a merge conflict, or no `pull_request` trigger |
| “Expected”, but a run passed under another name | The job was renamed |
| A check passed, but the merge is still blocked | A newer commit: required checks must pass on the latest one |

```sh
gh pr checks <n> --watch          # wait for every check on PR n
gh run list --limit 5             # latest runs and their IDs
gh run view <id> --log-failed     # only the failed steps' output
```

**Tell your agent**

```text
Add a verify script that runs typecheck, tests and build, stopping at the
first failure. Then add .github/workflows/ci.yml on pull requests and pushes
to main, contents: read, one job named Verify on ubuntu-latest with a
10-minute timeout: checkout, setup-node 24 with npm cache, npm ci, npm run
verify. Run npm ci and npm run verify locally before you push. Never rename
the job: the gates require it by name.
```

```text
The check on PR N is red or stuck. Show me gh run view <id> --log-failed
and the likely cause. Fix the code or the workflow, not the gate: never
rename the job, disable the ruleset or Force Promote without asking me.
```

## Read next

- **Read:** [GitHub Docs, Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), about 15 minutes if you read only four sections: `on`, `permissions`, `jobs.<job_id>.name` and `jobs.<job_id>.steps`. Every key in this lesson comes from that page, and it’s where to look when an agent’s workflow uses one you don’t know.
- **Keep handy:** the cheat sheet above, the first time you review a workflow an agent wrote.

## Remember

```flashcards
Q: Event, workflow, job, step: how do they fit together?
A: An event starts a workflow, one YAML file in `.github/workflows/`. Each job in it gets its own fresh runner, and its steps run in order on that one machine.

Q: In a step, what’s the difference between `uses:` and `run:`?
A: `uses:` runs a published action, such as `actions/checkout@v7`. `run:` is a shell command, typed on the runner as in a terminal.

Q: Do a workflow’s jobs run one after another, or at the same time?
A: At the same time, by default. A job waits for another only if you give it `needs:` naming that job.

Q: For `pull_request`, what does `branches: [main]` match?
A: The branch the PR targets, its base. So every PR into `main` runs it, whatever the agent named its own branch.

Q: On an open PR, what code does CI check out?
A: A test merge of the PR’s branch into `main`: what you’d get by merging. A PR with a merge conflict gets no run.

Q: You name one permission under `permissions`. What happens to the rest?
A: Every permission you didn’t name is set to none. A CI check needs `contents: read` and nothing more.

Q: What is a check called?
A: Whatever its job’s `name:` says, or the job id if there’s no `name:`. The workflow’s name and the file’s name play no part.

Q: An agent renames a job that a ruleset requires. What happens?
A: The renamed check can pass, but the gates wait for the old name, which sits at “Expected” forever, so the PR can’t merge.

Q: What does `cache: npm` keep between runs?
A: npm’s store of downloaded packages, keyed on `package-lock.json`. Not `node_modules`, builds or test results.

Q: A workflow has no `timeout-minutes`. How long can a hung job run?
A: 360 minutes, GitHub’s default, before it’s cancelled. A cancelled job doesn’t count as a pass.

Q: Does a run you started with the Run workflow button count for a ruleset?
A: No. Required checks count only from runs started by events such as `pull_request` and `push`.

Q: How do you pass a secret to a step safely?
A: As `${{ secrets.NAME }}` through `env:` or `with:`. Never `echo` it: masking in logs isn’t guaranteed.

Q: What does `concurrency` with `cancel-in-progress: true` do?
A: It allows one run at a time per group, and cancels the older run when a newer push arrives.

Q: A required check says “Expected”, and there’s no run. What are the usual causes?
A: A branch or path filter that skipped the workflow, a merge conflict, or no `pull_request` trigger. If there’s a run but its check has another name, the job was renamed.
```

## Final test

```final-test final-23
An agent’s workflow for your `recipes` site is open in front of you. Which key tells you what machine each job runs on?
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
In the lab you keep Brad’s file, but change `name: Verify` to `name: verify-app`. What must the ruleset require?
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

```final-test final-watch-checks
An agent has pushed to PR 12, and it should report back only once every check on the PR has a result. What does it run?
- [x] `gh pr checks 12 --watch`
- [ ] `gh run list --limit 5`
- [ ] `gh run view <id> --log-failed`
- [ ] `git log --oneline -n 5`
Why: `gh pr checks 12 --watch` waits until every check on the PR finishes. It doesn’t show logs; for those, the agent runs `gh run view` with `--log-failed`.
```

```final-test final-write-permission
An agent’s first CI workflow for your `recipes` site runs lint, typecheck and tests, and nothing else. At the top it sets `permissions: contents: write`. What’s your response?
- [ ] Widen it: add pull-requests write as well
- [ ] Accept it: checkout needs write to copy
- [x] Question it: a check needs only read
- [ ] Drop it: let the repo default decide
Why: `contents: read` lets the job read the code, which is all a check needs, checkout included. That’s least privilege. An agent that comments on PRs needs `pull-requests: write`, but this workflow doesn’t comment. Dropping the line leaves the token on the repo’s default access instead of the minimum.
```

```final-test final-job-id-change
An agent’s PR changes the job id in Brad’s `ci.yml` from `verify:` to `checks:`, and leaves `name: Verify` as it was. Its run passes. What do the gates see?
- [x] A passing check, still reported as Verify
- [ ] The check named Verify waits at Expected
- [ ] A new check, checks, that nothing requires
- [ ] The ruleset renames its required check itself
Why: The check takes the job’s `name:`; the id is used only when there’s no `name:`. So the PR reports `Verify` as before, and both gates still find it. Change `name:` instead, and every PR waits at “Expected”, because rulesets don’t follow renames.
```

```final-test final-expected-conflict
A PR on your `recipes` repo has had its required check at “Expected” all morning. The Actions tab shows no `pull_request` run for it, though the same workflow ran on yesterday’s PRs. The agent started the workflow with the Run workflow button on its branch, and that run passed. What now?
- [ ] Merge it: the manual run already passed
- [ ] Disable the ruleset until the check arrives
- [x] Check the PR for a merge conflict
- [ ] Raise the job’s timeout and wait longer
Why: A run started by hand doesn’t count: rulesets accept checks only from runs started by events such as `pull_request` and `push`. No `pull_request` run at all, from a workflow that works on other PRs, points to a merge conflict: GitHub doesn’t run `pull_request` workflows on a PR that has one. Once the agent fixes the conflict and pushes, the check runs.
```

```sources
- [CI/CD Made Simple: Build a Real Pipeline](https://www.youtube.com/watch?v=B7GM6F3BP6A), Brad Traversy, 2026-10-05
- [CI/CD Crash Course: Commands and Code](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e), Brad Traversy
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions), GitHub Docs
- [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), GitHub Docs
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), GitHub Docs
- [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token), GitHub Docs
- [Troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules), GitHub Docs
- [Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks), GitHub Docs
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks), GitHub Docs
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), GitHub Docs
- [licensed.yml in actions/checkout](https://github.com/actions/checkout/blob/main/.github/workflows/licensed.yml), GitHub
- [test.yml in actions/checkout](https://github.com/actions/checkout/blob/main/.github/workflows/test.yml), GitHub
- [actions/setup-node README](https://github.com/actions/setup-node), GitHub
- [runner-images issue #14748: ubuntu-latest moves to Ubuntu 26.04](https://github.com/actions/runner-images/issues/14748), GitHub
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), npm Docs
- [Deployment Checks](https://vercel.com/docs/deployment-checks), Vercel Docs
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github), Vercel Docs
- [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), Vercel Docs
- [Securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target), GitHub Docs
- [Secrets](https://docs.github.com/en/actions/concepts/security/secrets), GitHub Docs
- [Using secrets in GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets), GitHub Docs
- [Control the concurrency of workflows and jobs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency), GitHub Docs
- [Using workflow run logs](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs), GitHub Docs
- [gh run view](https://cli.github.com/manual/gh_run_view), GitHub CLI manual
- [gh pr checks](https://cli.github.com/manual/gh_pr_checks), GitHub CLI manual
- [gh run list](https://cli.github.com/manual/gh_run_list), GitHub CLI manual
```
