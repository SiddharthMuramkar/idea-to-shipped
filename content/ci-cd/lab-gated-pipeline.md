---
title: Lab: a gated pipeline with GitHub Actions and Vercel
slug: lab-gated-pipeline
summary: Of the lab you’ll have a private cicd-lab repo where main needs a PR with a passing Verify check, every PR gets a Vercel preview deployment, and production is promoted only after Verify passes.
---

Lessons 10 to 12 took Brad Traversy’s pipeline apart. Now you build it, on a private repo of your own, with Vercel where Brad has Render. This page is a brief, not a walkthrough: eight checkpoints, what you should see at each one, and a line to hand your agent. Brad’s video and gist carry the rest.

```goals
- Of the lab you’ll have a private `cicd-lab` repo where `main` needs a PR with a passing `Verify` check, every PR gets a Vercel preview deployment, and production is promoted only after `Verify` passes. You’ll also have watched each gate hold against a change built to fail.
```

## The end state

Brad’s starter is a tiny Express app written in TypeScript: a home page, a health endpoint at `/api/health` and one test. By the end it lives in a private repo, deploys to Vercel, and sits behind two gates that read one check, `Verify`. That’s five pieces, in two places:

| Piece | Where it lives | Its job |
|---|---|---|
| Repo `SiddharthMuramkar/cicd-lab`, private | GitHub | Brad’s starter with your own history, plus a `verify` script |
| Workflow `.github/workflows/ci.yml`, job `name: Verify` | The repo; GitHub Actions runs it | Runs `npm ci` and `npm run verify` on each PR and each push to `main`; reports the check `Verify` |
| Ruleset “Protect main” | GitHub: Settings → Rulesets | Merge gate: PR required, `Verify` required, empty bypass list |
| Vercel project `cicd-lab` | Your Vercel Pro team, linked to the repo through Vercel for GitHub | A preview deployment for each PR, a production deployment for each merge |
| Deployment Check on `Verify` | Vercel: project Settings → Build and Deployment | Release gate: holds each production deployment until `Verify` passes on its commit |

On 27 October none of this existed yet: GitHub had no `cicd-lab` repo under your name. [Lesson 12](/learn/gates) is the theory behind every row. Go back to it whenever a checkpoint surprises you.

```callout remember
Five pieces: a private repo, a workflow that reports `Verify`, a ruleset that requires it, a Vercel project, and a Deployment Check that requires it too. Two gates read the same check name.
```

```checkpoint check-1
In the finished lab, an agent’s PR has a red `Verify`. Which piece stops it reaching `main`?
- [ ] The Vercel Deployment Check
- [x] The ruleset Protect main
- [ ] The workflow file ci.yml
- [ ] The Vercel preview deployment
Why: The ruleset is the merge gate. The workflow only reports the check, the Deployment Check acts after a merge, and a preview blocks nothing.
```

```checkpoint check-2
Besides the workflow itself, which two pieces depend on the exact name `Verify`?
- [ ] The repo and lock file
- [ ] The preview and production URLs
- [ ] The starter and Brad’s gist
- [x] The ruleset and Deployment Check
Why: Both gates require the check by name, and the name comes from the job’s `name:`. The URLs, the lock file and the gist don’t care what the job is called.
```

## Before you start

Your machine runs Node 22. The starter declares Node 24 in the `engines` field of `package.json`, but that field is a note for hosts, not a switch for your shell. Vercel reads it and builds with the latest 24.x, and CI gets 24 from the workflow’s `setup-node` step. Your terminal stays on 22, so install Node 24 first, or your local checks and CI can disagree.

Use a **version manager**: a tool that installs several Node versions side by side and picks one per shell or per folder. fnm and nvm are two well-known ones; neither is installed on this machine yet.

**Tell your agent:** “Install Node 24 with fnm, make it the default for new shells, and show me `node --version` in a fresh terminal.”

A ruleset on a private repo needs a paid GitHub plan. On GitHub Free, rulesets work on public repos only, which is why Brad’s gist tells Free users to go public. You have Pro, so keep `cicd-lab` private. Your Vercel Pro team holds the project.

Last, the connections. `gh` is logged in as you, which your agent needs to create the repo and read its checks. Vercel must be connected to your GitHub account, because its New Project page lists only the repositories it can see. The agent works in one folder, `~/Desktop/cicd-lab`. Nothing in this lab touches Care4Mind.

```callout remember
Put Node 24 on your machine before anything else: `engines` tells Vercel which Node to use, not your shell. GitHub Pro is what lets the repo stay private and still have a ruleset.
```

```checkpoint check-3
Your agent runs `npm run verify` and it passes, but `node --version` prints `v22.23.1`. What’s wrong?
- [ ] The engines field already switched it
- [ ] Vercel will refuse to build it
- [x] Local checks ran on Node 22
- [ ] The ruleset will block every merge
Why: `engines` doesn’t switch your local Node; the gist says so. CI and Vercel use 24, so a pass on 22 proves less than it looks. Vercel does read `engines`, and builds with 24.x.
```

```checkpoint check-4
Why can your `cicd-lab` repo stay private when Brad’s gist suggests a public one?
- [x] Your Pro plan allows private rulesets
- [ ] Vercel cannot import a public repo
- [ ] Private repos skip the ruleset entirely
- [ ] GitHub Actions runs only on private
Why: On GitHub Free, rulesets work on public repos only. GitHub Pro adds private repos. Vercel imports both kinds.
```

## Checkpoints 1–4: app, repo, Vercel, CI

Each checkpoint gives the outcome, what you should see, and one line for your agent. The agent does the git and file work. You click in the dashboards where it can’t, and you do every merge. The exact code is in Brad’s gist, and the order follows it: the `verify` script goes in before the first commit, so `main` starts green.

1. **Fresh copy, local checks green** (Checkpoint 1 · your agent)
   - The starter cloned into `~/Desktop/cicd-lab` with its history removed (`rm -rf .git`, then `git init -b main`), dependencies installed with `npm ci`, and Brad’s `verify` script added.
   - **You should see:** `npm run verify` end with one passing test, no type errors, and a new `dist/` folder.
   - **Tell your agent:** “Clone bradtraversy/cicd-lab-starter into ~/Desktop/cicd-lab, delete its .git and start fresh history on main, confirm node is v24, run npm ci, add Brad’s verify script and run it.”
2. **A private repo with one commit** (Checkpoint 2 · your agent)
   - One commit with everything, `package-lock.json` included, pushed to a new private repo, with the course’s merge settings: squash merging only, and head branches deleted automatically.
   - **You should see:** the repo marked Private, one commit on `main`, and no `node_modules/` or `dist/` in it.
   - **Tell your agent:** “Commit everything including package-lock.json, create the private repo SiddharthMuramkar/cicd-lab with gh, push main, then allow squash merges only and turn on automatic deletion of head branches.”
3. **The Vercel project and its first deployment** (Checkpoint 3 · you, in Vercel)
   - New Project, import `cicd-lab`, and leave every build setting as Vercel fills it in. The first deployment of a new project is a production deployment, and with no gate yet it goes live at once.
   - **You should see:** the deployment Ready; the production URL showing “CI/CD Lab” and “Version development”; `/api/health` returning `{"status":"ok"}`.
   - **Tell your agent:** “Read the build log of cicd-lab’s first Vercel deployment and tell me whether it built and what it says about Express and the entrypoint. Change no code unless it failed.”
4. **CI on a branch, green, squash-merged** (Checkpoint 4 · agent, then you merge)
   - Brad’s `ci.yml` on `feature/github-actions-ci`, a PR, `Verify` green, and you squash-merge. The merge starts a second `Verify` run, on `main`.
   - **You should see:** `Verify` ✓ in the PR’s checks, beside Vercel’s deployment status and a Vercel comment with a preview link; after the merge, a passing `push` run on `main`.
   - **Tell your agent:** Lesson 11’s prompt, then “Open the PR, wait for Verify and tell me the exact check name. I’ll merge. Then do the Lesson 6 sweep.”

Will Vercel find the app without changes? Yes, by its own docs. Vercel looks for a file that imports `express` in a fixed list of places: `app`, `index` or `server`, at the root or under `src/`, with a JavaScript or TypeScript extension. That file must default-export the app or call `listen`. The starter’s `src/app.ts` imports `express` and ends with `export default app`, so it qualifies. `src/server.ts` doesn’t count, because it imports `./app.js`, not `express`. So `src/app.ts` is the entrypoint, and no code changes.

That changes what runs. On Render, `npm start` runs `dist/server.js`, a server listening on a port. On Vercel nothing runs `npm start`: the app becomes a single Vercel Function that Vercel calls for each request, and the build and output settings stay empty. If the first build fails anyway, read the log before the agent changes code. When no file qualifies, the builder says “No entrypoint found which imports express”.

One deliberate difference from the gist. Brad merges with a merge commit, then deletes the branch with `git branch -d`, which works because the branch’s own commits become part of `main`. You squash-merge, the course convention, so the branch’s commits never reach `main`, and once `git fetch --prune` has dropped git’s memory of GitHub’s deleted copy, `-d` refuses. Ask for the [Lesson 6](/learn/branches-and-worktrees) sweep instead: update `main`, `git fetch --prune`, check each branch marked `gone` against its squash commit, then `git branch -D`.

The second run, on `main`, matters later. The squash commit is brand new, and the PR’s green check belongs to a different commit. The push run gives the new commit its own `Verify`, and that’s the one the Deployment Check waits for.

```callout remember
Checkpoints 1–4 give you a deployed app with CI but no gates yet: `Verify` runs and goes green, and nothing waits for it. Vercel finds the app in `src/app.ts` unchanged, because that file imports `express` and default-exports the app.
```

```checkpoint check-5
Which starter file does Vercel use as the app’s entrypoint?
- [ ] `src/server.ts`, because it calls listen
- [x] `src/app.ts`, because it imports express
- [ ] `dist/server.js`, after the build runs
- [ ] `package.json`, from its start script
Why: Vercel takes the first file in its list that imports `express`. `src/server.ts` imports `./app.js` instead, and nothing runs a start command on Vercel.
```

```checkpoint check-6
After the CI PR is squash-merged, `git branch -d feature/github-actions-ci` refuses. What should your agent do?
- [ ] Switch the repo to merge commits
- [ ] Revert the squash commit on main
- [x] Check the diff, then use -D
- [ ] Leave it until GitHub deletes it
Why: The squash commit is new, so `-d` sees unmerged commits. Confirm the branch matches the squash commit, then force-delete. Auto-delete removes only GitHub’s copy, not yours.
```

```checkpoint check-7
At checkpoint 4, before any gate exists, a push to `main` builds fine on Vercel while `Verify` on that commit fails. What happens?
- [ ] Vercel holds it until Verify passes
- [ ] Vercel cancels the build at once
- [ ] The preview takes over production instead
- [x] It is built and promoted anyway
Why: Without a Deployment Check, Vercel promotes every successful production build. That’s continuous deployment with no gate. Checkpoint 6 adds the hold.
```

## Checkpoints 5–8: the gates, proved

1. **Merge gate: the ruleset “Protect main”** (Checkpoint 5 · agent or you, on GitHub)
   - A branch ruleset on the default branch: enforcement Active, require a pull request (0 approvals), require the status check `Verify` from GitHub Actions, empty bypass list. You may add this course’s extras: block force pushes, restrict deletions, squash only.
   - **You should see:** `gh api repos/SiddharthMuramkar/cicd-lab/rules/branches/main` list `pull_request` and `required_status_checks` naming `Verify`.
   - **Tell your agent:** “Create the branch ruleset Protect main on cicd-lab as in Lesson 12, requiring the check Verify, then GET the rules for main and show me.”
2. **Release gate: a Deployment Check on Verify** (Checkpoint 6 · you, in Vercel)
   - Project Settings → Build and Deployment → Deployment Checks → Add Checks, provider GitHub, then search for `Verify`. The prerequisites hold if you imported from GitHub and left the production environment alone: the project is linked through Vercel for GitHub, and automatic production aliasing is on.
   - **You should see:** `Verify` listed under Deployment Checks.
   - **Tell your agent:** “Add a Vercel Deployment Check on GitHub’s Verify to cicd-lab and confirm automatic production aliasing is on. If you can’t by API or CLI, give me the dashboard steps.”
3. **Prove it: a test that fails** (Checkpoint 7 · agent, then you)
   - On `feature/version-endpoint`, Brad’s test for `GET /api/version`, with no route yet, pushed in a PR that you leave open.
   - **You should see:** `npm test` fail locally (404 instead of 200); then `Verify` yellow, then red ✗, and the merge button blocked.
   - **Optional, the release gate:** switch Protect main to Disabled, merge the red PR yourself, and watch Vercel build a production deployment without promoting it. Click Revert on the merged PR, merge the revert once it’s green, and switch the ruleset back to Active in the same sitting.
   - **Tell your agent:** “Add Brad’s failing version-endpoint test on feature/version-endpoint, show me npm test failing, push, open the PR, and show me the red Verify and the merge state. Don’t touch the ruleset.”
4. **Pass the gate, then preview a change** (Checkpoint 8 · agent, then you merge)
   - Brad’s route, before `export default app`: two tests pass, the PR goes green, you squash-merge. `Verify` runs on the squash commit on `main`, and only then does Vercel promote. Then a preview: Brad’s `<p>Preview deployment</p>` on the home page, on `feature/preview-demo`, in a new PR.
   - **You should see:** production’s `/api/version` return `{"version":"development"}`. Then the new line on the preview but not on production; after you merge, on production too.
   - **Tell your agent:** “Add Brad’s version route, run verify, push and wait for Verify. Then make the preview-demo change on a new branch, open a PR, and give me its preview link and the production URL.”

Two details make checkpoint 5 trustworthy. GitHub’s new-ruleset form starts at Disabled, which saves the rules without enforcing them, so set Active. And GitHub’s rules endpoint returns only enforced rules, so if the `gh api` line prints `[]`, nothing protects `main`. Both gates come after checkpoint 4’s merge for a reason: by then `Verify` has run on `main`, so GitHub’s form and Vercel’s search have a real check by that name to find.

What does “held” look like in the optional step? The failing PR adds only a test, so the site looks the same either way. Look in Vercel instead: a production deployment is built from the bad commit, its Deployment Checks aren’t met, and the production domain keeps serving the deployment before it. Built isn’t live. In Brad’s video, Render never even starts the deploy. GitHub’s Revert then opens a new PR that undoes the merge, and that PR passes both gates like any other.

If you skipped the optional step, push the route to the open PR; it updates in place. If you took it, the merge finished `feature/version-endpoint`, and GitHub deleted its copy. Do checkpoint 8 on a fresh branch with both the test and the route, because the revert took the test back out of `main`.

For the preview, Vercel’s PR comment has Visit Preview (the branch’s latest), and the PR’s View deployment button opens the exact commit. After you merge, Render would delete the preview. Vercel doesn’t: it keeps the URL for as long as your retention policy (how long Vercel keeps old deployments) allows, by default 180 days for previews on Pro. While the PR is open, the latest preview of its branch is also safe from clean-up.

```callout remember
Prove each gate with a change built to fail: the ruleset blocks the red PR, and with the ruleset off, Vercel builds the bad commit but doesn’t promote it. On Vercel a preview outlives its merge, until retention removes it.
```

```checkpoint check-8
You created Protect main, but `gh api repos/SiddharthMuramkar/cicd-lab/rules/branches/main` prints `[]`. What’s the most likely cause?
- [x] The ruleset is still Disabled
- [ ] Verify has not failed yet
- [ ] The repo is still private
- [ ] Vercel has not deployed main
Why: The rules endpoint skips disabled rulesets, and the new-ruleset form starts at Disabled. Private repos on Pro can use rulesets, and Vercel has nothing to do with it.
```

```checkpoint check-9
With Protect main switched off, you merge the red PR. What does Vercel do?
- [ ] It refuses to build the commit
- [ ] It promotes, then rolls back itself
- [x] It builds but does not promote
- [ ] It deletes the open preview deployment
Why: Deployment Checks let the production deployment be built, then hold it until `Verify` passes on its commit. Render, in the video, doesn’t start the deploy at all.
```

```checkpoint check-10
A week after you merge the preview-demo PR, you open its preview’s commit URL. What do you see?
- [ ] A redirect to the production site
- [x] That same preview version, still there
- [ ] Vercel’s error page for deleted deployments
- [ ] Whatever main’s newest commit now shows
Why: Vercel doesn’t delete previews on merge. The deployment stays until your retention policy removes it: 180 days by default for previews on Pro. Render is the one that deletes on merge.
```

## Render → Vercel, chapter by chapter

Watch the video with the gist open, and make these swaps as you go. The number in brackets is the checkpoint where each chapter lands.

| Chapter | Brad, on Render | You, on Vercel |
|---|---|---|
| Clone & Go Over The Project · Our Verify Script | Clones the starter, fresh history, `npm ci`, adds `verify`; Node 24 already installed | Same, after installing Node 24; your agent types it (1) |
| Push To GitHub | New repo, commit and publish from VS Code | A private repo made with `gh`; squash only, auto-delete on (2) |
| Deploy To Render | New Web Service; build `npm ci && npm run build`; start `npm start`; health check `/api/health`; Auto-Deploy On Commit | New Project, import the repo; no build, start or health settings; each merge builds production and promotes it (3) |
| Github Actions Workflow · Our First Checks Run | `ci.yml` on a branch, PR, green check, merge commit, `git branch -d` | Same file and branch; squash merge, Lesson 6 sweep (4) |
| Github & Render Enforced Guardrails | Ruleset “Protect main”; Auto-Deploy set to After CI Checks Pass | Same ruleset; a Deployment Check on `Verify` (5, 6) |
| Github Gate Test | Failing version test, red ✗, merge blocked | Same (7) |
| Render Gate Test | Disables the ruleset and merges; Render starts no deploy; reverts; re-enables | Vercel builds the production deployment and holds it; revert; re-enable (7, optional) |
| Passing The Gate | Adds the route, merges, Render deploys | `Verify` passes on `main`, then Vercel promotes (8) |
| Preview Environments | Turns Pull Request Previews to Automatic; Render deletes each preview on merge | Nothing to switch on; previews sit behind your Vercel login and outlive the merge (8) |

One word to correct while you watch. In “Deploy To Render” Brad calls On Commit “continuous deployment”, then later in the same chapter calls the same setting “continuous delivery”. By his own definition, releasing every commit with no human click is continuous deployment. So is your Vercel setup: the Deployment Check adds a gate, not a click.

```callout remember
Same pipeline, different switches: Render’s After CI Checks Pass becomes a Deployment Check, and its opt-in previews become Vercel’s always-on previews. Where Render skips the deploy, Vercel builds and holds.
```

```checkpoint check-11
Brad sets Render’s Build Command to `npm ci && npm run build` and its Start Command to `npm start`. What do you set on Vercel?
- [ ] The same two commands, in settings
- [ ] A vercel.json with a start script
- [ ] A Dockerfile that runs the build
- [x] Nothing; Vercel detects the Express app
Why: Vercel detects Express, finds the app in `src/app.ts` and runs it as a single Vercel Function. Nothing runs a start command, and you leave build and output settings empty.
```

```checkpoint check-12
In “Deploy To Render” Brad calls On Commit “continuous delivery” once. By his own definition, what is it?
- [ ] Continuous delivery, since a human merges
- [x] Continuous deployment, with no human click
- [ ] Continuous integration, since checks run first
- [ ] Neither, because Render has no gates
Why: Delivery needs a human click to release; deployment releases automatically. On Commit releases every commit with no click, and so does your Vercel setup, gate or no gate.
```

## Traps

Most of these fail quietly: nothing errors, a gate just waits. Three are about the check, whose name comes from the job’s `name:`, and the ruleset that requires it. One is about access. The last three are setup and file rules that a green `npm run verify` on your machine can miss.

| Trap | What you see | What to do |
|---|---|---|
| The job name is the check name | After a rename, the PR waits for `Verify` forever and Vercel never promotes | Rename the job only together with both gates |
| A check is easiest to pick once it has run | `Verify` isn’t offered when you add it | Let it run first; GitHub wants a success in the past seven days, and checkpoint 4’s merge gives one |
| The ruleset form starts at Disabled | Red PRs still mergeable; the rules call prints `[]` | Set enforcement to Active |
| Previews sit behind your Vercel login | Your agent’s `curl` meets a login redirect, not your JSON | Check the project’s Deployment Protection after the import; open previews in a browser logged in to Vercel |
| Node 24 | Local results differ from CI | Install 24 with fnm or nvm; check `node --version` |
| `npm ci` needs the lock file | CI fails at the install step | Commit `package-lock.json` |
| Express must be the default export | Vercel’s build fails with “No entrypoint found…”, or the routes stop answering | Keep `src/app.ts` importing `express` and ending with `export default app` |

```callout remember
Most lab failures are silent waits, not errors: a renamed job, a ruleset left Disabled, a check that hasn’t run yet. When a gate seems stuck, check the check’s name and the ruleset’s enforcement first.
```

```checkpoint check-13
You created the ruleset, yet a PR with a red ✗ still merges. What do you check first?
- [ ] Which Node version you run
- [x] Whether its enforcement is Active
- [ ] Whether Vercel imported the repo
- [ ] Whether the preview needs login
Why: The ruleset form starts at Disabled, and a Disabled ruleset blocks nothing: the rules call prints `[]`. Node, the Vercel import and the preview login don’t decide what can merge.
```

```checkpoint check-14
Your agent runs `curl` on a preview URL and gets a Vercel login page instead of JSON. What does that tell you?
- [ ] The preview build must have failed
- [ ] The route is missing on previews
- [x] Deployment Protection is doing its job
- [ ] The Deployment Check is still pending
Why: With Vercel Authentication on, anyone not logged in is sent to a login page. Open the preview in your own browser. Deployment Checks hold production, not previews.
```

```checkpoint check-15
On the very first PR, CI fails at the `npm ci` step, though everything worked on your machine. What do you check first?
- [x] Whether package-lock.json is in git
- [ ] Whether the ruleset is Active
- [ ] Whether Vercel imported the repo
- [ ] Whether the preview has loaded
Why: `npm ci` needs a committed lock file and stops without one. The ruleset and Vercel don’t affect how the runner installs.
```

## Tell your agent

Paste this once, at the start. Then use the one-liner at each checkpoint.

```text
We’re doing a CI/CD lab: Brad Traversy’s CI/CD crash course, with Vercel in place of Render. Gist: https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e. Starter: bradtraversy/cicd-lab-starter. Work only in ~/Desktop/cicd-lab and the private repo SiddharthMuramkar/cicd-lab.

Goal: main needs a PR with a passing Verify check, every PR gets a Vercel preview deployment, and production is promoted only after Verify passes.

Rules:
- Read the gist first and use its code exactly. Two changes: we squash-merge instead of making merge commits, and after each merge you do the Lesson 6 sweep (git pull, git fetch --prune, check each gone branch against its squash commit with git diff, then git branch -D) instead of git branch -d.
- Use Node 24. If node --version isn’t v24, stop and tell me.
- Keep the job’s name: Verify. Keep export default app in src/app.ts.
- One checkpoint at a time. At each one, stop and show me the evidence: command output, PR link, the check’s name and state, the Vercel deployment’s state.
- Where you can’t act (Vercel or GitHub dashboard settings you can’t reach by API or CLI), give me the exact clicks.
- Never merge, disable the ruleset or Force Promote unless I say so in this conversation.

Start with checkpoint 1: clone the starter with fresh history, run npm ci, add the verify script and run it.
```

## Try it

When the lab is done, run these. They only read; they change nothing. The first is the final check on the merge gate.

```sh
gh api repos/SiddharthMuramkar/cicd-lab/rules/branches/main
gh run list -R SiddharthMuramkar/cicd-lab --limit 10
gh pr list -R SiddharthMuramkar/cicd-lab --state all
```

The first should list `pull_request`, with `required_approving_review_count: 0`, and `required_status_checks` with `"context": "Verify"`; if you picked GitHub Actions as the source, also `integration_id: 15368`. With the extras, `deletion` and `non_fast_forward` appear too. `[]` means the ruleset is Disabled: switch it back on. The second lists the `CI` workflow’s runs, for both `pull_request` and `push` events, with the red one from checkpoint 7 among them. The third lists your PRs: CI, the version endpoint and the preview demo, plus a revert and a second version-endpoint PR if you took the optional step.

## Afterwards: keep it or delete it

If you keep the lab, it’s a sandbox: try any gate change here before you make it on Care4Mind. If you don’t, delete the Vercel project first (Settings → General → Delete Project), which removes its deployments and settings with it. Then archive the repo on GitHub (it stays, read-only) or delete it. Deleting with `gh` needs the `delete_repo` scope, which your login didn’t have on 27 October; `gh auth refresh -s delete_repo` adds it. Remove `~/Desktop/cicd-lab` last.

## Check yourself

After you finish the lab, from memory, without scrolling up.

```final-test final-16
The lab is done. An agent’s PR has a green `Verify`, but its change breaks the home page’s layout. What should catch it?
- [ ] The ruleset, since Verify passed
- [ ] The Deployment Check after merging
- [x] You, opening the preview first
- [ ] Vercel’s build, which runs tests
Why: No test checks the layout, so both automatic gates see green. Only a person looking at the preview catches it, and only if you open the link before merging.
```

```final-test final-17
Which change to the starter would break the Vercel deployment while `npm run verify` still passes?
- [x] Moving the app into src/routes.ts
- [ ] Adding a route to src/app.ts
- [ ] Adding a test to test/app.test.ts
- [ ] Changing the home page’s text
Why: `src/routes.ts` isn’t in Vercel’s list, and `src/server.ts` doesn’t import `express`, so the build finds no entrypoint. The other three keep `src/app.ts` as it must be.
```

```final-test final-18
You squash-merge a green PR. When does its change go live on Vercel?
- [ ] As soon as the merge happens
- [ ] When the PR’s own check passed
- [ ] When you click Promote by hand
- [x] After Verify passes on main’s commit
Why: The squash makes a new commit on `main`. The push run gives it its own `Verify`, and the Deployment Check holds the production deployment until that passes.
```

```final-test final-19
Why must `ci.yml` run on pushes to `main`, not only on pull requests?
- [ ] Vercel can’t build pull request commits
- [x] The squash commit needs a check
- [ ] The ruleset ignores pull request runs
- [ ] GitHub bills pull request runs differently
Why: The Deployment Check reads `Verify` on the commit being deployed. After a squash merge that commit is new, and only the push run checks it.
```

```final-test final-20
For the optional test you disabled Protect main and merged the red PR. What must you do before you stop?
- [ ] Delete the held production deployment now
- [ ] Force Promote the held deployment now
- [x] Revert, then switch the ruleset back
- [ ] Rename the job so Verify reruns
Why: The bad commit is on `main` and the merge gate is off. A revert PR cleans `main`, and Active puts the gate back. Force Promote would ship the failure.
```

## Watch next

**Watch:** [Brad Traversy, “CI/CD Made Simple: Build a Real Pipeline”](https://www.youtube.com/watch?v=B7GM6F3BP6A), about 35 minutes, with [his gist](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e) open beside it. Watch a chapter, then do its checkpoint; the table above says what to swap.

Keep the CI/CD cheat sheet open while you work, and take the Part 3 test when the lab is done.

```sources
- [Brad’s gist](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e)
- [Vercel Docs, Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [fnm README](https://github.com/Schniz/fnm)
- [nvm README](https://github.com/nvm-sh/nvm)
- [GitHub Docs, About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Vercel Docs, Deploying Git Repositories](https://vercel.com/docs/git)
- [Vercel Docs, Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- [vercel/vercel, packages/express/src/build.ts](https://github.com/vercel/vercel/blob/main/packages/express/src/build.ts)
- [Vercel KB, How to ship an Express app on Vercel](https://vercel.com/kb/guide/ship-a-express-app-on-vercel)
- [Vercel Docs, Environments](https://vercel.com/docs/deployments/environments)
- [@vercel/node changelog](https://github.com/vercel/vercel/blob/main/packages/node/CHANGELOG.md)
- [GitHub Docs, Creating rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [GitHub REST, Rules](https://docs.github.com/en/rest/repos/rules)
- [Vercel Docs, Deployment Checks](https://vercel.com/docs/deployment-checks)
- [GitHub Docs, Reverting a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/reverting-a-pull-request)
- [Vercel Docs, Generated URLs](https://vercel.com/docs/deployments/generated-urls)
- [Vercel Docs, Deployment Retention](https://vercel.com/docs/deployment-retention)
- [Brad Traversy, “CI/CD Made Simple: Build a Real Pipeline”](https://www.youtube.com/watch?v=B7GM6F3BP6A)
- [GitHub Docs, Troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules)
- [GitHub Docs, Troubleshooting required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
- [Vercel Docs, Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [Vercel Docs, Deployment Protection](https://vercel.com/docs/deployment-protection)
- [npm Docs, npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)
- [Vercel Docs, Managing projects](https://vercel.com/docs/projects/managing-projects)
- [GitHub Docs, Archiving repositories](https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories)
```
