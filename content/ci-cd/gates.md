---
title: Gates: checks that block
slug: gates
summary: Name the three gates (merge, look and release), say exactly what each one blocks and how each one can be bypassed, and hand your agent one prompt that sets all three up on a repo and proves they work.
---

Care4Mind already has a Vercel project connected to its GitHub repo. On 27 October it had no ruleset, no workflow and no Deployment Check that holds anything, so by Vercel’s defaults whatever an agent merges into `main` goes live unchecked. This lesson is about the three gates that belong in between, and the undo behind them.

```goals
- You’ll be able to name the three gates (merge, look and release), say exactly what each one blocks and how each one can be bypassed, and hand your agent one prompt that sets all three up on a repo and proves they work.
```

## Three gates and an undo

A **gate** is an automatic check that blocks the next step. Lesson 11 showed you the workflow that produces a **check**: one job’s pass or fail on a commit. A check on its own blocks nothing. It becomes a gate only when something refuses to go on until it’s green. Brad Traversy’s video sets up two of these refusals, one on GitHub and one on Render, then adds preview deployments. On Vercel the same pipeline has three gates and one undo.

1. **1. Merge gate: a ruleset** (GitHub, before merging)
   - A ruleset on `main` refuses to merge a PR until the `check` job passes. **Blocks:** merging. **Bypass:** an admin switches the ruleset to Disabled, or adds someone to its bypass list.
2. **2. Look gate: the preview deployment** (Vercel, while the PR is open)
   - Every push to the PR’s branch gets its own copy of the site at its own URL. You open it and look. **Blocks:** nothing by itself. You are the gate. **Bypass:** merging without opening the link.
3. **3. Release gate: Deployment Checks** (Vercel, after merging)
   - The merge builds a production deployment, which waits until `check` passes on the merged commit before it is promoted. **Blocks:** going live. **Bypass:** the Force Promote button.
4. **4. The undo: roll back, then revert** (Vercel, then GitHub)
   - Instant Rollback points production back at an earlier deployment, with no rebuild. A revert PR then takes the bad change out of `main`.

Each gate answers a different question. The merge gate asks “did the code pass the tests?” The look gate asks “does it look and behave right?”, which no test you’ve written can answer. The release gate asks “is the exact commit about to go live still green?”, because the code tested on a PR isn’t always the code that ships. The undo is for the day all three say yes and are wrong.

One caveat: by this course’s definition the look gate isn’t strictly a gate, because nothing automatic stops you. It’s held by a person, and with agents writing the code, that person is you.

```callout remember
Merge gate: a ruleset blocks the merge until `check` passes. Look gate: you, on the preview URL. Release gate: Deployment Checks block going live. When all three miss something, roll back, then revert.
```

```checkpoint check-1
An agent’s PR adds a questionnaire page. Every test passes, but on a phone the Submit button sits off-screen. Which gate can catch this?
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
Why: The ruleset targets `main` and refuses the merge until `check` passes. It doesn’t touch other branches, previews or promotion. Promotion is the release gate’s job.
```

## The merge gate: a ruleset on main

A **ruleset** is GitHub’s name for a named list of rules attached to branches. Whenever you or an agent make one, you set four parts. The **target** is which branches it covers: here, the default branch, `main`. The **enforcement** is Active (enforced) or Disabled (kept but ignored). GitHub Enterprise adds a third status, Evaluate, which only reports what would have been blocked. Then come the **rules** themselves, and the **bypass list**: the people or apps allowed to ignore the rules.

This course’s own repo has one, called “Protect main”. Here is each rule in it and what it stops:

| Rule | In “Protect main” | What it blocks |
|---|---|---|
| Require a pull request before merging | 0 approvals; squash merge only | Pushing straight to `main`. Every change arrives as a PR, but nobody has to approve it, which is right when you work alone. |
| Require status checks to pass | `check`, from GitHub Actions only | Merging while `check` is red, still running or missing on the PR |
| Block force pushes | On | Rewriting `main`’s history |
| Restrict deletions | On | Deleting `main` |
| Bypass list | Empty | Nobody, you included, skips the rules while the ruleset is Active |

The required check is chosen **by name**, and for a workflow that name is the job’s name: `check`, from `name: check` in `.github/workflows/check.yml`. That makes the name a contract. If an agent renames the job to `verify`, nothing errors. The new job runs and goes green, while the ruleset waits for a `check` that never arrives and blocks every PR with “Waiting for status to be reported.” The release gate names the same job, so the rename breaks it too. Rename a job only together with every gate that names it.

Order matters when you set it up. GitHub’s troubleshooting page says a required check must have completed successfully in the repo within the past seven days. In Brad’s video the job shows up in the ruleset form because it has already run on his repo. So let the job run once, on a test PR or a push, before you require it. On this repo the `check` job ran on `main` first, and the ruleset was created seconds later.

Rulesets aren’t available everywhere. On GitHub Free they work on public repos only; GitHub Pro, Team and Enterprise Cloud add private repos. That’s why Brad’s notes tell Free users to make the lab repo public. You have Pro, so private repos like Care4Mind and this course can use them.

You may also meet the older **branch protection rules**, which do the same job. Rulesets are the newer form: several can apply to one branch, and one can be switched off without being deleted. Where both kinds exist, GitHub applies them all and the strictest version of each rule wins.

```callout remember
The merge gate is a ruleset on `main`: a PR is required, `check` is required by job name, and the bypass list is empty. Its weak spots are a renamed job and an admin switching it to Disabled.
```

```checkpoint check-3
An agent tidies `check.yml` and renames the job from `check` to `verify`. The new job passes. What happens to the next PR?
- [ ] It merges once `verify` passes
- [x] It waits on `check` forever
- [ ] GitHub renames the required check
- [ ] The ruleset switches to Disabled
Why: The ruleset asks for a check called `check`, by name. Nothing reports that name any more, so the PR shows “Waiting for status to be reported” until someone updates the ruleset, and Vercel’s Deployment Check as well.
```

```checkpoint check-4
Brad’s notes tell GitHub Free users to make the lab repo public. Why?
- [ ] Free runs Actions only publicly
- [ ] Render can’t read private repos
- [ ] Previews need a public repo
- [x] Free has rulesets only publicly
Why: On GitHub Free, rulesets work on public repos only. Pro, Team and Enterprise Cloud add private repos. You have Pro, so Care4Mind can stay private.
```

```checkpoint check-5
“Protect main” requires a pull request with 0 approvals. What does that rule actually stop?
- [x] Pushing commits straight to main
- [ ] Merging before someone reviews it
- [ ] Opening more than one PR
- [ ] Deleting the branch after merging
Why: The PR has to exist, but nobody has to approve it. So every change goes through a PR and the `check` it runs, and you never wait for a second reviewer who doesn’t exist.
```

## Prove it by breaking it

A gate you’ve never seen fail is a gate you only hope works. Brad proves his two by sending through a change that ought to fail. On a branch called `feature/version-endpoint` he adds a test for an `/api/version` endpoint that doesn’t exist yet, and opens a PR. Here is what follows:

1. The check goes yellow (queued), then red. The merge button is blocked. **The merge gate held.**
2. He switches “Protect main” from Active to Disabled. The PR is still red, but now the merge button works, and he merges.
3. Render starts no deploy, because its Auto-Deploy setting is “After CI Checks Pass” and the check on the merged commit failed. **The deploy gate held.**
4. He clicks GitHub’s Revert on the merged PR, which opens a new PR that undoes it. Its check passes and he merges it. Then he switches the ruleset back to Active.

Take three things from it. First, each gate covers for the other: with the merge gate off, the deploy gate still kept the bad commit from users. Second, switching a gate off _is_ the bypass, and nothing reminds you to switch it back on. Brad had to remember. Treat it as a loud act: do the one thing you needed, switch it back in the same sitting, and never let an agent do it without asking you. Third, the failing change still landed on `main`. The gate kept it from users, not from history, and it took a revert (Lesson 9) to clean up `main`.

On Vercel the second half plays out differently, and the difference matters. Render didn’t start a deploy at all. Vercel builds the production deployment from the bad commit anyway, then holds it. The deployment exists, with its own URL, but it isn’t promoted to the production domain. Built isn’t live. You’ll run this exact test on your own repo in the lab (Lesson 13).

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
You repeat Brad’s test on this course’s repo: ruleset disabled, a red PR merged. What does Vercel do?
- [x] Builds it and holds promotion
- [ ] Refuses to build the commit
- [ ] Promotes it, then rolls back
- [ ] Turns the ruleset back on
Why: Vercel still creates the production deployment, but the Deployment Check on `check` keeps it off the production domain. Render, by contrast, didn’t start a deploy at all.
```

## The look gate: preview deployments

A **preview deployment** is a temporary copy of the site for one branch or PR, with its own URL. On Vercel you don’t switch them on. Every push to a branch that isn’t the production branch gets one, and so does every PR. When the project is connected to GitHub, Vercel’s bot posts the link as a comment on the PR, and the commit gets a status saying whether the deployment worked.

Each preview has two kinds of URL. The branch URL always shows the latest push to that branch, so it’s the one to keep open while an agent is still working. The commit URL is frozen to one commit, so it’s the one to quote when you report a problem. Production doesn’t move: only merges to the production branch, `main`, make production deployments.

Who can open the link depends on Deployment Protection. This course protects every deployment, production included, with Vercel Authentication: anyone who opens a URL is sent to a Vercel login, and only people with access to the project get through. Care4Mind’s project protects every URL except its custom domains, so its previews need a login too.

What does the look gate block? By itself, nothing. The green check and the preview link sit side by side on the PR, and the merge button works whether or not you clicked the link. The gate is a habit: before you merge an agent’s PR, open the preview and do the thing the ticket was about, in a phone-width window too. Its bypass is simply not looking. GitHub can require a deployment to succeed before merging, but that proves the preview built, not that anyone looked at it.

A preview is a real running copy that talks to real services, so give preview deployments their own environment variables. Once Care4Mind has a database, its previews should use a test one, never production data. Render warns about the same trap.

On Render the same idea is called **Pull Request Previews**, and you turn it on yourself: Manual previews only the PRs you mark, Automatic previews every PR. Each preview is a separate running instance, billed like the service and deleted when the PR is merged or closed. Brad picks Automatic in the video’s last chapter.

```callout remember
Every push to a PR branch gets its own preview URL, and production stays on `main`. The look gate is the one held by a person: it holds only if you open the link before you merge.
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
A friend with no Vercel account opens a preview link from this course’s repo. What happens?
- [ ] They see the preview page
- [ ] They see the production site
- [ ] They get a GitHub error
- [x] They get a Vercel login
Why: This course has Vercel Authentication on every deployment, so anyone who opens a URL is sent to Vercel’s login, and only people with access get through.
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

**Deployment Checks** add a step between built and promoted: Vercel holds each production deployment until all the required checks pass, and only then gives it the production domain. A check can come from three places. Vercel’s own native checks, Lint and Typecheck, run the matching script in `package.json` and are skipped if there isn’t one. GitHub Checks read the commit’s statuses and check runs. Marketplace integrations can add their own. GitHub Checks need two things first: the project is linked to GitHub through Vercel for GitHub, and automatic production aliasing (Vercel promoting each new production deployment by itself) is on.

This course’s project has one blocking check: source GitHub, name `check`, holding production aliasing. Vercel also listed its native Lint and TypeCheck checks when the project was made, set to block nothing; with no `package.json` in this repo, they would be skipped anyway. GitHub matches checks by job name, so the rename trap from the merge gate is here too: rename the job and the Deployment Check must be updated to match.

Here is a detail that’s easy to miss. The release gate reads the check on the commit Vercel deployed, and after a squash merge that’s a brand-new commit on `main` (Lesson 6). The PR’s green check belongs to a different commit. The new one gets a `check` only if the workflow also runs on pushes to `main`. That’s why this course’s `check.yml`, like Brad’s, lists both `push` and `pull_request`. Render has the same rule from the other side: with After CI Checks Pass, a commit with zero checks never deploys. The push run also catches two PRs that pass alone but break together. “Protect main” doesn’t require a branch to be up to date with `main` before merging, and GitHub warns that checks can then fail after the merge.

The release gate’s bypass is a button: **Force Promote**, on the deployment’s page, promotes it with its checks failing. Keep it for emergencies. Like disabling the ruleset, it should never be the agent’s call.

Deployment Checks don’t make this continuous delivery: when the check passes, the release still goes live with no click. For a human click before every release, you’d turn off “Auto-assign Custom Production Domains” and promote each deployment by hand. That replaces Deployment Checks rather than adding to them, since they need automatic aliasing. This course runs continuous deployment behind gates, and Care4Mind will too.

### When all three miss: the undo

**Instant Rollback** points the production domains back at an earlier deployment that has already served production. Nothing is rebuilt, so it’s quick. On Pro you can pick any eligible deployment; on Hobby, only the one just before. One catch you must know: after a rollback, Vercel turns off automatic promotion. Your next merges to `main` build but don’t go live until you click **Undo Rollback** or promote a deployment yourself. Then fix `main` itself with a revert PR, which goes through all three gates like any other change.

```callout remember
On Vercel, built isn’t live. Deployment Checks hold the production deployment until `check` passes on the merged commit, and Force Promote skips them. Instant Rollback undoes a release with no rebuild, then a revert fixes `main`.
```

```checkpoint check-11
A PR passes `check` and is squash-merged, but its production deployment never gets promoted. The workflow runs only on `pull_request`. Why?
- [ ] Vercel ignores GitHub Actions checks
- [ ] The ruleset is still disabled
- [ ] The `check` job was renamed
- [x] The squash commit lacks `check`
Why: A squash merge makes a new commit on `main`. Vercel judges that commit, and it gets a `check` only if the workflow also runs on pushes to `main`.
```

```checkpoint check-12
On Monday you roll back a bad release. On Tuesday an agent merges the fix, `check` passes, yet the old version is still live. Why?
- [x] Rollback turned off automatic promotion
- [ ] The fix failed Deployment Checks
- [ ] Previews replaced the production domain
- [ ] Vercel needs a second approval
Why: After an Instant Rollback, Vercel stops giving new deployments the production domain, so merges build but don’t go live until you click Undo Rollback or promote one. The check passed, so the gate isn’t the problem.
```

```checkpoint check-13
Deployment Checks are on and `check` is green on the merged commit. Who clicks to put the release live?
- [ ] You, in the dashboard
- [ ] A reviewer on GitHub
- [x] Nobody; Vercel does it
- [ ] The agent, using CLI
Why: Deployment Checks only add a wait. Once the check passes, Vercel promotes the deployment with no click, so it’s still continuous deployment. A human click every time would be continuous delivery.
```

## Render ↔ Vercel, setting by setting

Brad’s video uses Render; your lab and Care4Mind use Vercel. The ideas carry across, but not one for one. Here is each setting Brad touches, and where it lives on Vercel:

| In Brad’s video (Render) | On Vercel | What changes |
|---|---|---|
| Auto-Deploy: On Commit | Automatic Git deployments: a merge to the production branch builds a production deployment, promoted by default | Nothing. Both are continuous deployment. |
| Auto-Deploy: After CI Checks Pass | Deployment Checks, with GitHub as the source | Render waits for _all_ checks and starts no deploy until then. Vercel waits for the checks you choose, and builds first. |
| Auto-Deploy: Off | Turn off Auto-assign Custom Production Domains; promote by hand | The closest match: continuous delivery |
| Pull Request Previews: Manual or Automatic | Preview deployments | Automatic on Vercel for every branch push and PR; nothing to switch on |
| Health Check Path: `/api/health` | No direct equivalent | Test the endpoint on the deployment’s URL as a check before promotion. Nothing keeps checking the live site the way Render does. |
| Build Command: `npm ci && npm run build` | Detected for you | Vercel detects the install command and sets the build command from the framework; you can override both |
| Instance type: Free | Your Vercel plan (you have Pro) | The plan sets things like how far back Instant Rollback reaches |

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

Use this on the lab ([Lesson 13](/learn/lab-gated-pipeline)) or any other repo that already has a CI job. For Care4Mind, use [Lesson 16’s prompt](/learn/your-projects-pipeline) instead: it adds the verify job first, so the gates never point at a name that is about to change.

```text
Set up the three gates on <owner>/<repo>. Never push to main; any file change goes on a branch with a PR.

1. The check. Read .github/workflows/ and tell me which job runs our tests and its exact job name. That name is the check every gate will require. If there is no workflow yet, stop and tell me. If the job hasn’t run on this repo in the last 7 days, open a small test PR so it runs first.
2. Merge gate. With gh api, create a branch ruleset called "Protect main": target the default branch, enforcement active, require a pull request (0 approvals, squash merge only), require that check by name from GitHub Actions, block force pushes, restrict deletions, empty bypass list. Then GET it back and show me the JSON.
3. Look gate. Confirm this repo’s Vercel project is connected to this repo through Git, its production branch is main, and PRs get a Vercel comment with the preview link. Tell me which Deployment Protection setting is on.
4. Release gate. Add a Vercel Deployment Check with GitHub as the source, using the same job name, so it holds production promotion. Confirm automatic production aliasing is on. If you can’t do this with the API or CLI, give me the exact dashboard steps instead.
5. Prove it. Open a test PR with a deliberately failing test and show me the red check and the blocked merge button. Then fix it, show me the preview link, and wait for me to merge. After I merge, show me that the production deployment waited for the check before it was promoted.

Never disable the ruleset, click Force Promote or merge anything without asking me. End with what you changed, the commands you ran, and anything you couldn’t verify.
```

## Try it

These commands only read; they change nothing. They show the merge gate on this course’s repo as GitHub enforces it:

```sh
gh api repos/SiddharthMuramkar/learn-matt-flow/rules/branches/main
gh api repos/SiddharthMuramkar/learn-matt-flow --jq '{allow_squash_merge, allow_merge_commit, delete_branch_on_merge}'
```

The first lists every rule that applies to `main`, whichever ruleset it comes from. You should see four. `deletion` is restrict deletions, and `non_fast_forward` is block force pushes. `pull_request` shows `required_approving_review_count: 0` and `allowed_merge_methods: ["squash"]`. `required_status_checks` names `check` with `integration_id: 15368`, which is GitHub Actions. The second command should print `true`, `false`, `true`: squash allowed, merge commits off, head branches deleted after merging. Then run the first command with `care4mind` in place of `learn-matt-flow`. It prints `[]`, because no rules apply to Care4Mind’s `main` yet.

## Practice

### Which gate stops it?

For each failure, pick the first thing that stands between it and your readers.

```checkpoint check-16
An agent’s PR breaks a unit test, and `check` goes red on the PR.
- [x] Merge gate
- [ ] Look gate
- [ ] Release gate
- [ ] Only the undo
Why: The ruleset won’t let a PR merge while its required check is red.
```

```checkpoint check-17
Every test passes, but the new questionnaire’s buttons overlap on a phone.
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
Why: The merge gate is off, but `check` fails on the merged commit, so the Deployment Check holds promotion.
```

```checkpoint check-19
Two PRs each pass alone. Merged one after the other, they break the build on `main`.
- [ ] Merge gate
- [ ] Look gate
- [x] Release gate
- [ ] Only the undo
Why: The push run on `main` fails, and Vercel won’t promote that commit. The ruleset never saw them together.
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

## Check yourself

From memory, without scrolling up.

```final-test final-24
By Vercel’s defaults, what happens when a PR merges into Care4Mind’s `main` today, with no ruleset, workflow or blocking Deployment Check?
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

## Read next

**Read:** [Vercel Docs, Deployment Checks](https://vercel.com/docs/deployment-checks), about six minutes. It’s short, and it holds the release gate’s details: the three kinds of check, the two prerequisites, Force Promote, and the job-name limits that bite when an agent renames a job.

Keep the CI/CD cheat sheet open when you set up the gates in the lab.

```sources
- [CI/CD crash course](https://www.youtube.com/watch?v=B7GM6F3BP6A)
- [Vercel Docs, Deployment Checks](https://vercel.com/docs/deployment-checks)
- [GitHub Docs, About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub Docs, REST API endpoints for rules](https://docs.github.com/en/rest/repos/rules)
- [GitHub Docs, Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [GitHub Docs, Troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules)
- [GitHub Docs, Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- [Brad’s gist](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e)
- [Render Docs, Deploying on Render](https://render.com/docs/deploys)
- [Vercel Docs, Environments](https://vercel.com/docs/deployments/environments)
- [Vercel Docs, Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Vercel Docs, Deploying Git Repositories](https://vercel.com/docs/git)
- [Vercel Docs, Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [Vercel Docs, Deployment Protection](https://vercel.com/docs/deployment-protection)
- [Render Docs, Service Previews](https://render.com/docs/service-previews)
- [Vercel Docs, Instant Rollback](https://vercel.com/docs/instant-rollback)
- [Vercel KB, Migrate from Render to Vercel](https://vercel.com/kb/guide/migrate-render-to-vercel)
- [Render Docs, Health Checks](https://render.com/docs/health-checks)
- [Vercel Docs, Configuring a Build](https://vercel.com/docs/builds/configure-a-build)
```
