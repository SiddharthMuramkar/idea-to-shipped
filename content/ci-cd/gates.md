---
title: Gates: checks that block
slug: gates
summary: The three gates (merge, look and release), what each one blocks, how each can be bypassed, and the undo for when all three miss.
---

Say your `recipes` site is on Vercel, connected to its GitHub repo, and nothing else is set up: no ruleset, no workflow, no Deployment Check (a Vercel setting that holds a release until a check passes). By Vercel’s defaults, whatever an agent merges into `main` goes live, unchecked. This lesson is about the three gates that belong in between, and the undo behind them.

```goals
- You’ll be able to name the three gates (merge, look and release) and say exactly what each one blocks.
- You’ll be able to say how each gate can be bypassed, and why that should never be an agent’s call.
- You’ll be able to prove a gate works with a change built to fail, and undo a release that went wrong.
- You’ll be able to hand your agent one prompt that sets up all three gates on a repo.
```

## Three gates and an undo

A **gate** is an automatic check that blocks the next step. [Reading a GitHub Actions workflow](/learn/reading-a-workflow) showed you the workflow that produces a **check**: one job’s pass or fail on a commit. A check on its own blocks nothing. It becomes a gate only when something refuses to go on until it’s green. Brad Traversy’s video sets up two of these refusals, one on GitHub and one on Render, then adds preview deployments. On Vercel the same pipeline has three gates and one undo.

**A ruleset blocks the merge, you look at the preview, and a Deployment Check blocks the release: three gates, with an undo for when all three miss.**

1. **Merge gate: a ruleset**, on GitHub, before merging. A ruleset on `main` refuses to merge a PR until the required check passes, such as `Verify` in Brad’s lab. **Blocks:** merging. **Bypass:** an admin switches the ruleset to Disabled, or adds someone to its bypass list, the people allowed to ignore it.
2. **Look gate: the preview deployment**, on Vercel, while the PR is open. Every push to the PR’s branch gets its own copy of the site at its own URL. You open it and look. **Blocks:** nothing by itself. You are the gate. **Bypass:** merging without opening the link.
3. **Release gate: Deployment Checks**, on Vercel, after merging. The merge builds a production deployment, which waits until the check passes on the merged commit before it is promoted (made live). **Blocks:** going live. **Bypass:** the Force Promote button.
4. **The undo: roll back, then revert**, on Vercel, then GitHub. Instant Rollback points production back at an earlier deployment, with no rebuild. A revert PR then takes the bad change out of `main`.

Each gate answers a different question. The merge gate asks “did the code pass the tests?” The look gate asks “does it look and behave right?”, which no test you’ve written can answer. The release gate asks “is the exact commit about to go live still green?”, because the code tested on a PR isn’t always the code that ships. The undo is for the day all three say yes and are wrong.

One caveat: by the definition above, the look gate isn’t strictly a gate, because nothing automatic stops you. It’s held by a person, and with agents writing the code, that person is you.

```callout remember
Merge gate: a ruleset blocks the merge until the required check passes. Look gate: you, on the preview URL. Release gate: Deployment Checks block going live. When all three miss something, roll back, then revert.
```

```checkpoint check-1
An agent’s PR adds a page to your `recipes` site. Every test passes, but on a phone the Save button sits off-screen. Which gate can catch this?
- [ ] The merge gate
- [ ] The release gate
- [x] The look gate
- [ ] The undo step
Why: Only a person looking at the preview deployment sees a layout problem the tests don’t cover. The merge and release gates both read the same test results, and those were green.
```

```checkpoint check-2
What does the merge gate block?
- [ ] Pushing any branch
- [x] Merging into main
- [ ] Building the preview
- [ ] Promoting the release
Why: The ruleset targets `main` and refuses the merge until the check passes. It doesn’t touch other branches, previews or promotion. Promotion is the release gate’s job.
```

## The merge gate: a ruleset on main

A **ruleset** is GitHub’s name for a named list of rules attached to branches. Whenever you or an agent make one, you set four parts:

- The **target**: which branches it covers. Here, the default branch, `main`.
- The **enforcement**: Active (enforced) or Disabled (kept but ignored). GitHub Enterprise adds a third status, Evaluate, which only reports what would have been blocked.
- The **rules** themselves.
- The **bypass list**: the people or apps allowed to ignore the rules.

Brad’s gist sets up a ruleset called “Protect main”. Here is each of its settings, and what it stops. A new ruleset also comes with two rules already selected, Block force pushes and Restrict deletions:

| Rule | In Brad’s “Protect main” | What it blocks |
|---|---|---|
| Require a pull request before merging | On, with 0 approvals | Pushing straight to `main`. Every change arrives as a PR, but nobody has to approve it, which is right when you work alone. |
| Require status checks to pass | `Verify`, from GitHub Actions | Merging while `Verify` is red, still running or missing on the PR |
| Block force pushes | Not in his notes; on by default in a new ruleset | Rewriting `main`’s history |
| Restrict deletions | Not in his notes; on by default in a new ruleset | Deleting `main` |
| Bypass list | Empty | Nobody, you included, skips the rules while the ruleset is Active |

The required check is chosen **by name**, and for a workflow that name is the job’s name: `Verify`, from `name: Verify` in `.github/workflows/ci.yml`. That makes the name a contract. If an agent renames the job to `Verify app`, nothing errors. The new job runs and goes green, while the ruleset waits for a `Verify` that never arrives and blocks every PR with “Waiting for status to be reported.” The release gate names the same job, so the rename breaks it too. Rename a job only together with every gate that names it.

Order matters when you set it up. GitHub’s troubleshooting page says a required check must have completed successfully in the repo within the past seven days. In Brad’s video, the job shows up in the ruleset form because it has already run on his repo. So let the job run once, on a test PR or a push, before you require it. And a pass counts only for the commit it ran on: required checks must pass on the PR’s latest commit, so after each push the merge waits for the new run.

Rulesets aren’t available everywhere. On GitHub Free they work on public repos only; GitHub Pro, Team and Enterprise Cloud add private repos. That’s why Brad’s notes tell Free users to make the lab repo public. On a Free account, keep a repo public if you want a ruleset on it, or move to a paid plan to keep it private.

You may also meet the older **branch protection rules**, which do the same job (see [How teams protect main](/learn/how-teams-do-it)). Rulesets are the newer form: several can apply to one branch, and one can be switched off without being deleted. Where both kinds exist, GitHub applies them all, and the strictest version of each rule wins.

```callout watch-out
A skipped job counts as passed. Say a required job `needs` another job, and that job fails: the required job is skipped, and the PR may still merge. GitHub’s advice is to use `always()` with `needs` for required checks that depend on other jobs.
```

```callout remember
The merge gate is a ruleset on `main`: a PR is required, the check is required by its job name, and the bypass list is empty. Its weak spots are a renamed job, a skipped job, and an admin switching it to Disabled.
```

```checkpoint check-3
An agent tidies `ci.yml` and changes the job from `name: Verify` to `name: Verify app`. The new job passes. What happens to the next PR?
- [ ] It merges once `Verify app` passes
- [x] It waits on `Verify` forever
- [ ] GitHub renames the required check
- [ ] The ruleset switches to Disabled
Why: The ruleset asks for a check called `Verify`, by name. Nothing reports that name any more, so the PR shows “Waiting for status to be reported” until someone updates the ruleset, and Vercel’s Deployment Check as well.
```

```checkpoint check-4
Brad’s notes tell GitHub Free users to make the lab repo public. Why?
- [ ] Free runs Actions only publicly
- [ ] Render can’t read private repos
- [ ] Previews need a public repo
- [x] Free has rulesets only publicly
Why: On GitHub Free, rulesets work on public repos only. Pro, Team and Enterprise Cloud add private repos.
```

```checkpoint check-5
“Protect main” requires a pull request with 0 approvals. What does that rule actually stop?
- [x] Pushing commits straight to main
- [ ] Merging before someone reviews it
- [ ] Opening more than one PR
- [ ] Deleting the branch after merging
Why: The PR has to exist, but nobody has to approve it. So every change goes through a PR and the check it runs, and you never wait for a second reviewer who doesn’t exist.
```

```checkpoint check-latest
A required check passed on your PR, then you pushed one more commit. What happens now?
- [x] You wait: the check must pass on the latest commit
- [ ] You can merge: one pass on the pull request is enough
- [ ] You can merge, as long as the new commit only changes docs
Why: A pass counts only for the commit it ran on. So you wait for the run on your newest commit.
```

## Prove it by breaking it

A gate you’ve never seen fail is a gate you only hope works. Brad proves his two by sending through a change that ought to fail (from 24:16 in his video). On a branch called `feature/version-endpoint` he adds a test for an `/api/version` endpoint that doesn’t exist yet, and opens a PR. Here is what follows:

1. The check goes yellow (queued), then red. The merge button is blocked. **The merge gate held.**
2. He switches “Protect main” from Active to Disabled. The PR is still red, but now the merge button works, and he merges.
3. Render starts no deploy, because its Auto-Deploy setting is “After CI Checks Pass” and the check on the merged commit failed. **The deploy gate held.**
4. He clicks GitHub’s Revert on the merged PR, which opens a new PR that undoes it. Its check passes and he merges it. Then he switches the ruleset back to Active.

Take three things from it. First, each gate covers for the other: with the merge gate off, the deploy gate still kept the bad commit from users. Second, switching a gate off _is_ the bypass, and nothing reminds you to switch it back on. Brad had to remember. Treat it as a loud act: do the one thing you needed, switch it back in the same sitting, and never let an agent do it without asking you. Third, the failing change still landed on `main`. The gate kept it from users, not from history, and it took a revert (see [Undo and merge conflicts](/learn/undo-and-conflicts)) to clean up `main`.

On Vercel the second half plays out differently, and the difference matters. Render didn’t start a deploy at all. Vercel builds the production deployment from the bad commit anyway, then holds it. The deployment exists, with its own URL, but it isn’t promoted to the production domain. Built isn’t live. You’ll run this exact test on your own repo in [the lab](/learn/lab-gated-pipeline).

```callout remember
Prove every gate with a change that should fail. With one gate switched off, the next one should still hold. Switching a gate off is the bypass, so do it rarely, on purpose, and switch it back straight away.
```

```checkpoint check-6
In Brad’s test, why did Render start no deploy after he merged the red PR?
- [ ] The ruleset blocked the merge
- [ ] Render deploys only tagged releases
- [x] Render waits for passing checks
- [ ] The revert ran before deploying
Why: Auto-Deploy was set to “After CI Checks Pass”, and the check on the merged commit had failed. The ruleset was disabled at that point, so it blocked nothing.
```

```checkpoint check-7
You repeat Brad’s test on a Vercel project whose Deployment Check waits for the same check: ruleset disabled, a red PR merged. What does Vercel do?
- [x] Builds it and holds promotion
- [ ] Refuses to build the commit
- [ ] Promotes it, then rolls back
- [ ] Turns the ruleset back on
Why: Vercel still creates the production deployment, but the Deployment Check keeps it off the production domain. Render, by contrast, didn’t start a deploy at all.
```

## The look gate: preview deployments

A **preview deployment** is a temporary copy of the site for one branch or PR, with its own URL. On Vercel you don’t switch them on. Every push to a branch that isn’t the production branch gets one, and so does every PR. When the project is connected to GitHub, Vercel’s bot posts the link as a comment on the PR, and the commit gets a status saying whether the deployment worked.

Each preview has two kinds of URL. The branch URL always shows the latest push to that branch, so it’s the one to keep open while an agent is still working. The commit URL is frozen to one commit, so it’s the one to quote when you report a problem. Production doesn’t move: only merges to the production branch, `main`, make production deployments.

Who can open the link depends on **Deployment Protection**, a project setting. With its Vercel Authentication method, anyone who opens a protected URL is sent to a Vercel login, and only people with access to the project get through. You choose what it covers. Standard Protection protects every deployment except the production domains, so the real site stays public and the previews stay private. All Deployments protects production too.

What does the look gate block? By itself, nothing. The green check and the preview link sit side by side on the PR, and the merge button works whether or not you clicked the link. The gate is a habit: before you merge an agent’s PR, open the preview and try the thing the PR changed, in a phone-width window too. Its bypass is not looking. GitHub can require a deployment to succeed before merging, but that proves the preview built, not that anyone looked at it.

A preview is a real running copy that talks to real services. So give preview deployments their own **environment variables**: named settings, such as a database address, that the host hands to your app without them being written in the code. Once your site has a database, its previews should use a test one, never production data. Render warns about the same trap.

On Render the same idea is called **Pull Request Previews**, and you turn it on yourself: Manual previews only the PRs you mark, Automatic previews every PR. Each preview is a separate running instance, billed like the service and deleted when the PR is merged or closed. Brad picks Automatic in the video’s last chapter. On Vercel, previews stay in the project’s list of deployments after the merge.

```callout remember
Every push to a PR branch gets its own preview URL, and production stays on `main`. The look gate is the one held by a person: it holds only if you open the link before you merge. Previews get their own settings and a test database, never production data.
```

```checkpoint check-8
An agent pushes three commits to its PR branch over an hour. Which link always shows the newest one?
- [ ] The first commit’s URL
- [x] The branch preview URL
- [ ] The production domain URL
- [ ] The Actions run page
Why: The branch-specific URL always points at the latest push to that branch. A commit URL is frozen to one commit, and production doesn’t change until a merge.
```

```checkpoint check-9
Your project protects all deployments with Vercel Authentication. A friend with no Vercel account opens a preview link. What happens?
- [ ] They see the preview page
- [ ] They see the production site
- [ ] They get a GitHub error
- [x] They get a Vercel login
Why: With Vercel Authentication, anyone who opens a protected URL is sent to Vercel’s login, and only people with access to the project get through.
```

```checkpoint check-10
Which of these is the look gate’s bypass?
- [ ] Clicking Force Promote
- [ ] Disabling the ruleset
- [x] Merging without looking
- [ ] Renaming the job
Why: Nothing automatic stops a merge when nobody opened the preview. Force Promote skips the release gate, and disabling the ruleset skips the merge gate.
```

## The release gate: Deployment Checks

On Vercel a deployment is built first and goes live only when it is **promoted**, that is, given the production domain. By default Vercel promotes your newest successful production build straight away: merge to `main`, Vercel builds, the build goes live. That is continuous deployment, where changes go live with no human click. Out of the box, though, it’s continuous deployment with no check either.

**Deployment Checks** add a step between built and promoted: Vercel holds each production deployment until all the required checks pass, and only then gives it the production domain. A check can come from three places. Vercel’s own native checks, Lint and Typecheck, run the matching script in `package.json`, and are skipped if there isn’t one. GitHub Checks read the commit’s statuses and check runs. Integrations from the Vercel Marketplace, add-ons made by other companies, can add their own. GitHub Checks need two things first: the project is linked to GitHub through Vercel for GitHub, and automatic production aliasing (Vercel promoting each new production deployment by itself) is on.

You add them in the project’s **Settings → Build and Deployment → Deployment Checks**. In the lab, the project gets one blocking check: GitHub as the source, `Verify` as the name, holding production. Brad’s app has a `typecheck` script, so Vercel’s native Typecheck could run too, but it has no `lint` script, so a native Lint check would be skipped. GitHub matches checks by job name, so the rename trap from the merge gate is here too: rename the job, and the Deployment Check must be updated to match.

Here is a detail that’s easy to miss. The release gate reads the check on the commit Vercel deployed, and after a merge that’s a new commit on `main`: a merge commit or a squash commit, as in [Merging and cleaning up](/learn/merging-and-cleaning-up). The PR’s green check belongs to a different commit. The new one gets a check only if the workflow also runs on pushes to `main`, which is why Brad’s workflow lists both `push` and `pull_request`. Render has the same rule from the other side: with After CI Checks Pass, a commit with zero checks never deploys. The push run also catches two PRs that pass alone but break together. If your ruleset doesn’t require branches to be up to date before merging, GitHub warns that checks can fail after the merge.

The release gate’s bypass is a button: **Force Promote**, on the deployment’s page, promotes it with its checks failing. Keep it for emergencies. Like disabling the ruleset, it should never be the agent’s call.

Deployment Checks don’t make this continuous delivery: when the check passes, the release still goes live with no click. For a human click before every release, you’d turn off “Auto-assign Custom Production Domains” and promote each deployment by hand. That replaces Deployment Checks rather than adding to them, since they need automatic aliasing. The lab runs continuous deployment behind gates.

```checkpoint check-11
A PR passes `Verify` and is merged, but its production deployment never gets promoted. The workflow runs only on `pull_request`. Why?
- [ ] Vercel ignores GitHub Actions checks
- [ ] The ruleset is still disabled
- [ ] The `Verify` job was renamed
- [x] The merged commit lacks `Verify`
Why: A merge makes a new commit on `main`. Vercel judges that commit, and it gets a `Verify` check only if the workflow also runs on pushes to `main`.
```

```checkpoint check-13
Deployment Checks are on, and `Verify` is green on the merged commit. Who clicks to put the release live?
- [ ] You, in the dashboard
- [ ] A reviewer on GitHub
- [x] Nobody; Vercel does it
- [ ] The agent, using CLI
Why: Deployment Checks only add a wait. Once the check passes, Vercel promotes the deployment with no click, so it’s still continuous deployment. A human click every time would be continuous delivery.
```

### When all three miss: the undo

**Instant Rollback** points the production domains back at an earlier deployment that has already served production. Nothing is rebuilt, so it’s quick. On Vercel’s Pro plan you can pick any deployment that has served production before; on the free Hobby plan, only the one immediately before. One catch you must know: after a rollback, Vercel turns off automatic promotion. Your next merges to `main` build but don’t go live until you undo the rollback by promoting a deployment yourself, from the dashboard or with `vercel promote`. Then fix `main` itself with a revert PR, which goes through all three gates like any other change.

```callout remember
On Vercel, built isn’t live. Deployment Checks hold the production deployment until the check passes on the merged commit, and Force Promote skips them. Instant Rollback undoes a release with no rebuild, then a revert fixes `main`.
```

```checkpoint check-12
On Monday you roll back a bad release. On Tuesday an agent merges the fix, `Verify` passes, yet the old version is still live. Why?
- [x] Rollback turned off automatic promotion
- [ ] The fix failed its Deployment Checks
- [ ] Previews replaced the production domain
- [ ] Vercel needs a second approval
Why: After an Instant Rollback, Vercel stops giving new deployments the production domain, so merges build but don’t go live until you undo the rollback by promoting one. The check passed, so the gate isn’t the problem.
```

```checkpoint check-rollback-plan
Your project is on Vercel’s free Hobby plan. How far back can Instant Rollback go?
- [x] Only to the deployment immediately before
- [ ] To any deployment that served production
- [ ] To any preview deployment of `main`
- [ ] Nowhere: rollback needs the Pro plan
Why: On Hobby you can roll back to the immediately previous deployment. Pro can pick any deployment that has already served production.
```

## Render ↔ Vercel, setting by setting

Brad’s video uses Render; the lab uses Vercel. The ideas carry across, but not one for one. Here is each setting Brad touches, and where it lives on Vercel:

| In Brad’s video (Render) | On Vercel | What changes |
|---|---|---|
| Auto-Deploy: On Commit | Automatic Git deployments: a merge to the production branch builds a production deployment, promoted by default | Nothing. Both are continuous deployment. |
| Auto-Deploy: After CI Checks Pass | Deployment Checks, with GitHub as the source | Render waits for _all_ checks and starts no deploy until then. Vercel waits for the checks you choose, and builds first. |
| Auto-Deploy: Off | Turn off Auto-assign Custom Production Domains; promote by hand | The closest match: continuous delivery |
| Pull Request Previews: Manual or Automatic | Preview deployments | Automatic on Vercel for every branch push and PR; nothing to switch on |
| Health Check Path: `/api/health` | No direct equivalent | Test the endpoint on the deployment’s URL as a check before promotion. Nothing keeps checking the live site the way Render does. |
| Build Command: `npm ci && npm run build` | Detected for you | Vercel detects the install command and sets the build command from the framework; you can override both |
| Instance type: Free | Your Vercel plan, Hobby or Pro | The plan sets things like how far back Instant Rollback reaches |

The health check is the one setting with no twin. Render keeps probing the live service and restarts it when it stops answering. Vercel’s own migration guide says to test the endpoint on each new deployment’s URL as a check before promotion, which checks a release once but doesn’t watch it afterwards. And because Vercel builds before it holds, you can open a held deployment’s URL and see exactly what would have shipped.

```callout remember
Same gates, different switches: After CI Checks Pass ↔ Deployment Checks, and Pull Request Previews ↔ preview deployments, which are always on. Render’s health check has no Vercel twin, so make it a check before promotion instead.
```

```checkpoint check-14
Brad’s app uses `/api/health` as Render’s Health Check Path. When it moves to Vercel, what takes its place?
- [ ] Vercel’s Health Check Path setting
- [x] A check run before promotion
- [ ] Vercel’s automatic restart on failure
- [ ] Nothing; endpoints can’t be tested
Why: Vercel has no Health Check Path. Its migration guide says to test the endpoint on the deployment’s URL and require that check before promotion. That checks each release once, rather than watching the live site.
```

```checkpoint check-15
A repo has two workflows: tests (chosen as the Deployment Check) and a slow link checker (not chosen). A push to `main` fails only the link checker. What does each platform do?
- [ ] Render deploys; Vercel holds it
- [ ] Both hold the release back
- [x] Render holds; Vercel promotes it
- [ ] Both promote; nothing is required
Why: Render’s After CI Checks Pass needs every check to pass, so one red check stops it. Vercel’s Deployment Checks wait only for the checks you chose, so a red link checker doesn’t hold the release.
```

## Tell your agent

Use this in [the lab](/learn/lab-gated-pipeline), or on any repo that already has a CI job. If your project has no CI job yet, start with the prompt in [Setting up your own project’s pipeline](/learn/your-projects-pipeline) instead: it adds the verify job first, so the gates never point at a name that is about to change.

```text
Set up the three gates on <owner>/<repo>. Never push to main; any file change goes on a branch with a PR.

1. The check. Read .github/workflows/ and tell me which job runs our tests and its exact check name (its name:, or its id if it has none). That name is the check every gate will require. If there is no workflow yet, stop and tell me. If the job hasn’t run on this repo in the last 7 days, open a small test PR so it runs first.
2. Merge gate. With gh api, create a branch ruleset called "Protect main": target the default branch, enforcement active, require a pull request (0 approvals), require that check by name from GitHub Actions, block force pushes, restrict deletions, empty bypass list. Then GET it back and show me the JSON.
3. Look gate. Confirm this repo’s Vercel project is connected to this repo through Git, its production branch is main, and PRs get a Vercel comment with the preview link. Tell me which Deployment Protection setting is on.
4. Release gate. Add a Vercel Deployment Check with GitHub as the source, using the same check name, so it holds production promotion. Confirm automatic production aliasing is on. If you can’t do this with the API or CLI, give me the exact dashboard steps instead.
5. Prove it. Open a test PR with a deliberately failing test and show me the red check and the blocked merge button. Then fix it, show me the preview link, and wait for me to merge. After I merge, show me that the production deployment waited for the check before it was promoted.

Never disable the ruleset, click Force Promote or merge anything without asking me. End with what you changed, the commands you ran, and anything you couldn’t verify.
```

## Try it

````try
Check which gates a repo of yours has today. These commands only read; they change nothing.

**You need:** `gh`, logged in, and a repo of yours on GitHub, such as your `recipes` repo, on your machine. Run the commands from its folder. Steps 3 and 4 need the repo connected to a Vercel project; if it isn’t, skip them, and [the lab](/learn/lab-gated-pipeline) sets one up.

1. The merge gate. List the ruleset rules that apply to the default branch:

```sh
gh ruleset check --default
```

You should see how many rules apply, each one by its type, such as `pull_request` or `required_status_checks`. `0 rules` means no ruleset protects `main`, so a red PR can still merge. (A classic branch protection rule doesn’t show here: see [How teams protect main](/learn/how-teams-do-it).) On a private repo with GitHub Free, it may stop with `HTTP 403`, because rulesets there need a paid plan.

2. The check. List the latest workflow runs:

```sh
gh run list --limit 5
```

You should see your CI workflow’s runs, with `pull_request` as the event for PRs and `push` for merges into `main`. No `push` runs means a merged commit never gets a check of its own, so a release gate would wait forever.

3. The look gate. List your recent pull requests, then open one in the browser, with its number in place of `<number>`. Look for a comment from Vercel’s bot with the preview link.

```sh
gh pr list --state all --limit 3
gh pr view <number> --web
```

4. The release gate. In the Vercel dashboard, open the project, then **Settings → Build and Deployment → Deployment Checks**. You should see each check that holds production, with its source and its name. An empty list means every successful production build goes live at once.

**It’s working if:**

- [ ] For each of the three gates, you can say whether this repo has it.
- [ ] Where the merge gate or the release gate exists, you can name the check it waits for, and it matches a job’s `name:`.

If a gate is missing, the prompt in Tell your agent above sets it up.
````

## Practice

### Which gate stops it?

For each failure, pick the first thing that stands between it and your readers.

```checkpoint check-16
An agent’s PR breaks a unit test, and `Verify` goes red on the PR.
- [x] Merge gate
- [ ] Look gate
- [ ] Release gate
- [ ] Only the undo
Why: The ruleset won’t let a PR merge while its required check is red.
```

```checkpoint check-17
Every test passes, but the new recipe page’s buttons overlap on a phone.
- [ ] Merge gate
- [x] Look gate
- [ ] Release gate
- [ ] Only the undo
Why: No test covers it. Only someone opening the preview will see it.
```

```checkpoint check-18
“Protect main” was left Disabled after an experiment, and a red PR gets merged.
- [ ] Merge gate
- [ ] Look gate
- [x] Release gate
- [ ] Only the undo
Why: The merge gate is off, but `Verify` fails on the merged commit, so the Deployment Check holds promotion.
```

```checkpoint check-19
Two PRs each pass alone. Merged one after the other, they break the build on `main`.
- [ ] Merge gate
- [ ] Look gate
- [x] Release gate
- [ ] Only the undo
Why: The push run on `main` fails, and Vercel won’t promote that commit. The ruleset never saw the two together.
```

```checkpoint check-20
An agent tries to push a commit straight to `main`.
- [x] Merge gate
- [ ] Look gate
- [ ] Release gate
- [ ] Only the undo
Why: The ruleset requires a PR, so the push is refused.
```

```checkpoint check-21
Tests passed, the preview looked fine, the release went live, and an hour later readers report a broken page.
- [ ] Merge gate
- [ ] Look gate
- [ ] Release gate
- [x] Only the undo
Why: Every gate said yes. Instant Rollback gets readers back to the last good version, then a revert fixes `main`.
```

```checkpoint check-22
A heading on a new page has a typo that no test checks.
- [ ] Merge gate
- [x] Look gate
- [ ] Release gate
- [ ] Only the undo
Why: Only a person reading the preview catches it.
```

```checkpoint check-23
Someone clicks Force Promote on a deployment whose check failed, and the site breaks.
- [ ] Merge gate
- [ ] Look gate
- [ ] Release gate
- [x] Only the undo
Why: Force Promote is the release gate’s bypass, and the earlier gates were already passed. What’s left is the undo.
```

## Read and watch next

- **Read:** [Vercel Docs, Deployment Checks](https://vercel.com/docs/deployment-checks), about six minutes. It’s short, and it holds the release gate’s details: the three kinds of check, the two prerequisites, Force Promote, and the job-name limits that bite when an agent renames a job.
- **Watch:** Brad Traversy’s [CI/CD crash course](https://www.youtube.com/watch?v=B7GM6F3BP6A) from “Github & Render Enforced Guardrails” at 21:50 to the end, about 13 minutes: both gates set up, proved by a failing test, passed, and then preview environments.
- **Keep handy:** the cheat sheet at the end of [Reading a GitHub Actions workflow](/learn/reading-a-workflow), when you set up the gates in the lab.

## Remember

```flashcards
Q: What are the three gates, and what does each one block?
A: The merge gate (a ruleset) blocks merging until the check passes. The look gate (you, on the preview) blocks nothing by itself. The release gate (Deployment Checks) blocks going live until the check passes on the merged commit.

Q: What is each gate’s bypass?
A: Merge gate: switching the ruleset to Disabled, or the bypass list. Look gate: merging without opening the preview. Release gate: Force Promote.

Q: How does a ruleset pick out its required check?
A: By name: the job’s `name:`, or its id if there’s none. Rename the job, and every PR waits for a check that never arrives.

Q: Why let a job run once before you require it?
A: A required check must have completed successfully in the repo in the past seven days.

Q: Do rulesets work on private repos with GitHub Free?
A: No. On Free they work on public repos only; Pro, Team and Enterprise Cloud add private repos.

Q: How do you prove a gate works?
A: Send through a change that should fail, and watch the gate hold. With one gate switched off, the next one should still hold.

Q: A preview’s branch URL vs its commit URL?
A: The branch URL always shows the latest push to that branch. The commit URL is frozen to one commit.

Q: What should a preview deployment never use?
A: Production data. Give previews their own environment variables, such as a test database.

Q: With Deployment Checks on, is a newly built production deployment live?
A: Not yet. Vercel holds it until the required checks pass on its commit, then promotes it with no click.

Q: Why does the release gate need the workflow to run on `push` to `main`?
A: A merge makes a new commit on `main`. Only a `push` run gives that commit its own check, and that’s the one the Deployment Check reads.

Q: What is the release gate’s bypass, and who may use it?
A: Force Promote, on the deployment’s page. Keep it for emergencies, and never make it the agent’s call.

Q: How do you get a person’s click before every release on Vercel?
A: Turn off Auto-assign Custom Production Domains and promote each deployment by hand. That’s continuous delivery, and it replaces Deployment Checks.

Q: What does Instant Rollback do, and what’s the catch?
A: It points production back at an earlier deployment, with no rebuild. Afterwards, Vercel stops promoting new deployments until you undo the rollback by promoting one yourself.

Q: Render’s After CI Checks Pass vs Vercel’s Deployment Checks?
A: Render waits for all checks and starts no deploy until then. Vercel waits only for the checks you chose, and builds first.

Q: What replaces Render’s Health Check Path on Vercel?
A: Nothing directly. Test the endpoint on each deployment’s URL as a check before promotion; nothing keeps watching the live site.
```

## Final test

```final-test final-24
Your `recipes` site is on Vercel, connected to its GitHub repo, with no ruleset, no workflow and no blocking Deployment Check. A PR merges into `main`. What happens, by Vercel’s defaults?
- [x] Vercel builds and promotes it
- [ ] It waits for your approval
- [ ] Nothing until a workflow exists
- [ ] It becomes a preview only
Why: Vercel builds every merge to the production branch and promotes it automatically. With no gates set, nothing stands between the merge and the live site.
```

```final-test final-25
Which gate does Force Promote get past?
- [ ] The merge gate
- [ ] The look gate
- [ ] All three gates
- [x] The release gate
Why: Force Promote puts a production deployment live even though its Deployment Checks failed. The merge and look gates were already behind it.
```

```final-test final-26
You disable “Protect main” to merge one urgent fix. What must you handle?
- [ ] The fix skips the preview
- [x] Forgetting to switch it back
- [ ] Vercel deletes the production deployment
- [ ] Main gets force-pushed by GitHub
Why: Disabling the ruleset is the merge gate’s bypass, and nothing switches it back on for you. Brad had to remember to re-enable his. GitHub and Vercel do none of the other things.
```

```final-test final-27
An agent sets up a ruleset on a brand-new repo, but the check it should require isn’t offered in the form. What’s the likeliest reason?
- [ ] The repo is still set public
- [ ] Rulesets only accept checks from Vercel
- [x] No success here in seven days
- [ ] The job has no name: line
Why: GitHub wants a required check to have passed in the repo within the past seven days, so let the job run once before you require it. Public repos can use rulesets, Actions checks are what rulesets require here, and a job with no `name:` reports its id instead.
```

```final-test final-28
An agent-written release breaks a page on the live site. What’s the fastest way to get readers back to the working version?
- [ ] Open a revert PR
- [x] Instant Rollback on Vercel
- [ ] Disable the GitHub ruleset
- [ ] Force Promote the fix
Why: Instant Rollback points the domains back at an earlier deployment with no rebuild. You still need a revert PR to fix `main`, but it has to pass the gates and build first.
```

```final-test final-no-push-trigger
To save runner minutes, an agent trims Brad’s `ci.yml` to run on `pull_request` only, dropping `push`. PRs still get their `Verify`. What happens after the next merge?
- [ ] Nothing changes, since every PR still runs
- [ ] The ruleset blocks every PR from merging
- [x] It merges, but production is never promoted
- [ ] Vercel promotes it without waiting for Verify
Why: The ruleset reads `Verify` on the PR, so merging still works. But the Deployment Check reads it on the commit Vercel deployed, and after a merge that’s a new commit on `main`. Only a `push` run gives that commit a `Verify`, so the production deployment is built and held for good, unless someone clicks Force Promote.
```

```final-test final-preview-database
Your `recipes` site now has a database. To make previews “look real”, an agent points preview deployments at the production database. What do you say?
- [ ] Fine: previews sit behind a Vercel login
- [ ] Fine: previews are deleted once PRs merge
- [ ] No: previews cannot connect to any database
- [x] No: give previews their own test database
Why: A preview is a real running copy of unmerged, agent-written code, talking to real services. Give previews their own environment variables and a test database, never production data. Vercel Authentication limits who can open the link, not what the code does to the data, and a Vercel preview stays in the deployments list after its PR merges.
```

```final-test final-approve-releases
Say a client wants a person to approve every release of their site before it goes live, while agents’ PRs keep merging as usual. What do you set up?
- [ ] Add a Deployment Check on the job
- [ ] Require one approving review on every PR
- [ ] Turn on Vercel Authentication for production too
- [x] Turn off auto-assign; promote each by hand
Why: That’s continuous delivery: a person clicks to go live. Turning off Auto-assign Custom Production Domains makes each production deployment wait for someone to promote it, and it replaces Deployment Checks, which need automatic aliasing. A Deployment Check adds a wait but still promotes with no click. A review gates the merge, not the release, and Vercel Authentication decides who can open a deployment, not when it goes live.
```

```final-test final-rollback-pro
Your site’s Vercel project is on the Pro plan. The last two releases both broke the recipe page, and the last good one came before both. What can Instant Rollback do?
- [ ] Only reach the release right before this
- [x] Point the domains at that good deployment
- [ ] Nothing until both bad commits are reverted
- [ ] Rebuild the good commit, then promote it
Why: On Pro you can roll back to any deployment that has already served production; on Hobby, only the one immediately before. Nothing is rebuilt, so it’s quick. Then revert the bad commits on `main` through the gates, and remember that after a rollback Vercel stops promoting new deployments until you promote one yourself.
```

```sources
- [CI/CD Made Simple: Build a Real Pipeline](https://www.youtube.com/watch?v=B7GM6F3BP6A), Brad Traversy, 2026-10-05
- [CI/CD Crash Course: Commands and Code](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e), Brad Traversy
- [Deployment Checks](https://vercel.com/docs/deployment-checks), Vercel Docs
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), GitHub Docs
- [REST API endpoints for rules](https://docs.github.com/en/rest/repos/rules), GitHub Docs
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), GitHub Docs
- [Troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules), GitHub Docs
- [Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks), GitHub Docs
- [gh ruleset check](https://cli.github.com/manual/gh_ruleset_check), GitHub CLI manual
- [Deploying on Render](https://render.com/docs/deploys), Render Docs
- [Environments](https://vercel.com/docs/deployments/environments), Vercel Docs
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github), Vercel Docs
- [Deploying Git Repositories](https://vercel.com/docs/git), Vercel Docs
- [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication), Vercel Docs
- [Deployment Protection](https://vercel.com/docs/deployment-protection), Vercel Docs
- [Service Previews](https://render.com/docs/service-previews), Render Docs
- [Instant Rollback](https://vercel.com/docs/instant-rollback), Vercel Docs
- [Migrate from Render to Vercel](https://vercel.com/kb/guide/migrate-render-to-vercel), Vercel KB
- [Health Checks](https://render.com/docs/health-checks), Render Docs
- [Configuring a Build](https://vercel.com/docs/builds/configure-a-build), Vercel Docs
```
