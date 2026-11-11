---
title: Lab: a gated pipeline with GitHub Actions and Vercel
slug: lab-gated-pipeline
summary: Build Brad Traversy's CI/CD pipeline yourself, with Vercel in place of Render: a Verify check, a ruleset on main, PR previews and a release gate.
image: /images/lessons/lab-gated-pipeline.jpg
imageAlt: The silver Trans-Alaska oil pipeline zigzags on supports across a forested valley towards snowy mountains.
---

You've read how a pipeline works: checks that run on every change, and gates that refuse to go on until those checks pass. Reading about a gate isn't the same as watching one hold. In this lab you build the whole pipeline on a repo of your own, step by step. You follow Brad Traversy's CI/CD crash course video, with Vercel where Brad uses Render. Plan on about an hour.

The lab puts three lessons into practice: [What CI/CD is](/learn/what-ci-cd-is), [Reading a GitHub Actions workflow](/learn/reading-a-workflow) and [Gates: checks that block](/learn/gates).

```goals
- Build a repo where `main` only takes a pull request with a passing `Verify` check.
- Deploy an Express app on Vercel, with a preview deployment for every pull request.
- Make Vercel hold each release until `Verify` passes on `main`.
- Prove each gate with a change built to fail, and spot where Vercel behaves differently from Render.
```

## The end state

Brad's starter is a tiny web app. It uses Express, a small Node.js framework for web servers, and TypeScript, which is JavaScript with types. It has a home page, a health endpoint at `/api/health` that answers `{"status":"ok"}` while the app runs, and one test. By the end of the lab, five pieces surround it:

| Piece | Where it lives | Its job |
|---|---|---|
| Repo `cicd-lab` | GitHub, under your username | Brad's starter with your own history, plus a `verify` script |
| Workflow `.github/workflows/ci.yml`, job `name: Verify` | The repo; GitHub Actions runs it | Runs `npm ci` and `npm run verify` on each pull request and each push to `main`, and reports the check `Verify` |
| Ruleset "Protect main" | GitHub: Settings → Rules → Rulesets | Merge gate: a pull request is required, `Verify` is required, and nobody can skip the rules |
| Vercel project `cicd-lab` | Your Vercel account, linked to the repo | A preview deployment for each pull request, a production deployment for each merge |
| Deployment Check on `Verify` | Vercel: Settings → Build and Deployment | Release gate: holds each production deployment until `Verify` passes on its commit |

**Two gates read one check, `Verify`: GitHub won't merge until it passes, and Vercel won't release until it passes again on `main`.**

[Gates: checks that block](/learn/gates) is the theory behind every row. Go back to it whenever a step surprises you.

```callout remember
Five pieces: a repo, a workflow that reports `Verify`, a ruleset that requires it, a Vercel project, and a Deployment Check that requires it too. Two gates read the same check name.
```

```checkpoint end-state-red-pr
In the finished lab, an agent's pull request has a red `Verify`. Which piece stops it from reaching `main`?
- [ ] The Deployment Check on Vercel
- [x] The ruleset Protect main
- [ ] The workflow file `ci.yml`
- [ ] The pull request's preview deployment
Why: The ruleset is the merge gate. The workflow only reports the check, the Deployment Check acts after a merge, and a preview blocks nothing.
```

```checkpoint end-state-name
Besides the workflow itself, which two pieces depend on the exact name `Verify`?
- [ ] The repo and its lock file
- [ ] The preview and production URLs
- [ ] The starter and Brad's gist
- [x] The ruleset and the Deployment Check
Why: Both gates ask for the check by name, and the name comes from the job's `name:` line. The URLs, the lock file and the gist don't care what the job is called.
```

## Before you start

You need these:

- A GitHub account. The free plan works.
- A Vercel account. The free Hobby plan works. Sign up with your GitHub account, so Vercel can see your repos.
- Git and a terminal. On Windows, use Git Bash, as Brad's gist says.
- A code editor. Brad uses VS Code.
- Node 24, the version of Node.js the starter asks for.
- [Brad's video](https://www.youtube.com/watch?v=B7GM6F3BP6A) and [his gist](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e), open side by side. The gist holds every command and line of code. This page says what changes for Vercel.

None of it costs money. GitHub Actions is free on public repos, and a lab this size fits in Vercel's Hobby plan.

Public or private? A **ruleset** is GitHub's name for a set of rules on a branch, such as "merge only through a pull request". On GitHub Free, rulesets work on public repos only. So make your repo public, as Brad's gist says; the starter holds nothing secret. On GitHub Pro, a private repo works too.

Then Node. The starter's `package.json` says `"node": "24.x"` in its `engines` field. That field tells hosts such as Vercel which Node to use. It doesn't change the Node on your machine. Check yours with `node --version`. If it doesn't start with `v24.`, install Node 24 first, or your checks and CI's can disagree.

The easiest way is a **version manager**: a tool that keeps several Node versions side by side. With nvm, for example:

```sh
nvm install 24
nvm alias default 24
node --version
```

fnm works the same way (`fnm install 24`, then `fnm default 24`). Or ask your agent: "Install Node 24 with a version manager, make it the default, and show me `node --version` in a new terminal."

Each step below follows the same pattern. First, what Brad does, with the time to rewatch it: "(video 12:00)" means 12 minutes in. Then where Vercel differs, before you start. Then you do it, and check what you should see. Here is the whole map:

| Video chapter | Brad, on Render | You, on Vercel | Step |
|---|---|---|---|
| Clone & Go Over The Project (4:30), Our Verify Script (8:53) | Clones the starter, starts fresh history, adds `verify` | The same | 1 |
| Push To GitHub (10:49) | A new repo; commits and pushes from VS Code | The same, with the gist's commands; squash merging only | 2 |
| Deploy To Render (12:00) | New Web Service; build and start commands; health check; Auto-Deploy On Commit | Import the repo and change nothing; each merge goes live by default | 3 |
| Github Actions Workflow (14:54), Our First Checks Run (19:19) | `ci.yml` on a branch, a green check, a merge commit | The same file and branch; you squash-merge | 4 |
| Github & Render Enforced Guardrails (21:50) | Ruleset Protect main; Auto-Deploy set to After CI Checks Pass | The same ruleset; a Deployment Check on `Verify` | 5, 6 |
| Github Gate Test (24:16) | A failing test, a red check, a blocked merge | The same | 7 |
| Render Gate Test (26:28) | Ruleset off, red pull request merged; Render starts no deploy | Vercel builds the bad commit and holds it | 7, optional |
| Passing The Gate (28:53) | Adds the route and merges; Render deploys | `Verify` passes on `main`, then Vercel promotes | 8 |
| Preview Environments (31:33) | Switches previews on; Render deletes each one on merge | Already on, behind a Vercel login, kept after the merge | 9 |

```callout remember
Install Node 24 before Step 1: `engines` sets Vercel's Node, not yours. On GitHub Free, make the repo public, so its ruleset works.
```

```checkpoint local-node-22
Your `npm run verify` passes, but `node --version` prints `v22.12.0`. What's wrong?
- [ ] The `engines` field switched Node already
- [ ] Vercel will refuse to build the app
- [x] Your local checks ran on Node 22
- [ ] The ruleset will block every merge
Why: `engines` doesn't change your local Node. CI and Vercel use Node 24, so a pass on 22 proves less than it looks. Install Node 24 and run the checks again.
```

```checkpoint why-public-repo
You're on GitHub Free. Why does Brad's gist tell you to make the lab repo public?
- [x] Free plans enforce rulesets on public repos only
- [ ] Vercel can't import a private repo at all
- [ ] GitHub Actions runs on public repos only
- [ ] Preview deployments need a public repo
Why: On GitHub Free, rulesets work on public repos only; GitHub Pro adds private ones. Vercel imports both kinds, and Actions runs on both.
```

## Steps 1 to 4: app, repo, Vercel, CI

The first four steps give you a deployed app with CI but no gates. `Verify` runs and goes green, and nothing waits for it yet.

### Step 1: a fresh copy, checks green

Brad clones the starter, deletes its Git history and starts his own (video 4:30–5:37). He installs, runs the app and tours the code (5:42–8:46). Then he adds one `verify` script that runs all three checks (8:53–10:10). Nothing differs on Vercel yet.

````try
You need Git, Node 24 and a terminal, open in the folder where you keep projects.

1. Copy the starter into a new folder called `cicd-lab`, and go into it:

```sh
git clone https://github.com/bradtraversy/cicd-lab-starter.git cicd-lab
cd cicd-lab
```

2. Delete the starter's history, and start your own on `main`:

```sh
rm -rf .git
git init -b main
```

3. Install the exact versions in the lock file, then start the app:

```sh
npm ci
npm run dev
```

4. In your browser, open `localhost:3000`, then `localhost:3000/api/health`.
5. Stop the app with Ctrl+C.
6. Open `package.json`. In `"scripts"`, add a comma after the `"start"` line, then this line below it:

```json
"verify": "npm run typecheck && npm test && npm run build"
```

7. Run all three checks with one command:

```sh
npm run verify
```

You should see the home page say "CI/CD Lab", and the health endpoint answer `{"status":"ok"}`. Then `npm run verify` prints a test summary showing `pass 1` and `fail 0`. It ends with the build's `> tsc` line and no errors, and a new `dist` folder appears.
````

Brad explains his choice of `npm ci` over `npm install` (video 6:40). `npm install` can change the lock file, the file that pins every package's exact version. `npm ci` installs exactly what the lock file lists, which is why CI uses it too.

The `verify` script chains three checks with `&&`, which runs the next command only if the last one passed. So the type check, the test and the build run in that order, and the first failure stops the rest. [What CI/CD is](/learn/what-ci-cd-is) explains why one command for every check matters.

```checkpoint verify-first-failure
You run `npm run verify`, and the type check finds an error. What happens next?
- [x] The test and the build don't run at all
- [ ] The test runs, but the build is skipped
- [ ] All three run, and the errors print last
- [ ] The build runs first, to show the error
Why: `&&` starts the next command only if the one before it passed. The type check comes first, so its failure stops the test and the build.
```

### Step 2: your own repo on GitHub

Brad creates an empty `cicd-lab` repo on GitHub, then commits and pushes with VS Code's buttons (video 10:49–11:53). The gist gives the same steps as commands, used below. Nothing differs on Vercel. One step is new: you switch the repo to squash merging, the default taught in [Merging and cleaning up](/learn/merging-and-cleaning-up).

````try
1. On GitHub, click + at the top right, then New repository.
2. Name it `cicd-lab`. Choose Public, or Private if you have GitHub Pro.
3. Leave README, .gitignore and license off. Click Create repository.
4. In your terminal, in `cicd-lab`, commit everything, the lock file included:

```sh
git add .
git commit -m "feat: add starter app with local verification"
```

5. Connect your new repo and push. Put your GitHub username in place of `YOUR_USERNAME`:

```sh
git remote add origin https://github.com/YOUR_USERNAME/cicd-lab.git
git push -u origin main
```

6. On the repo's page, open Settings → General, and scroll to Pull Requests.
7. Untick Allow merge commits and Allow rebase merging. Keep Allow squash merging.
8. Tick Automatically delete head branches.

You should see your one commit on the repo's Code tab, with `package-lock.json` in the file list. There's no `node_modules` or `dist` folder: the starter's `.gitignore` keeps them out.
````

The repo must start empty. A README would be a first commit on GitHub that your machine lacks, so GitHub would refuse your push. If `git push` asks for a password, see [Push, pull and remotes](/learn/push-pull-and-remotes): GitHub wants a token or the GitHub CLI's sign-in instead.

Squash merging turns each pull request into one commit on `main`. Brad merges with a merge commit instead, and Step 4 shows what that changes. Automatic deletion removes a pull request's branch on GitHub once it merges, which Brad does by hand.

```checkpoint readme-ticked
You ticked Add a README when you created the repo on GitHub. What happens when you push `main`?
- [x] GitHub refuses it: it has a commit you lack
- [ ] Git merges the README into your commit
- [ ] GitHub swaps its README for your files
- [ ] The push works, and the README disappears
Why: The README became a first commit on GitHub. Your history doesn't contain it, so the push is refused. Start from an empty repo, as the gist says.
```

### Step 3: the first Vercel deployment

Brad deploys to Render (video 12:00–14:41). He creates a Web Service with four settings: build command `npm ci && npm run build`, start command `npm start`, health check `/api/health`, and Auto-Deploy On Commit. Render builds with Node 24 because of `engines` (13:59).

```callout watch-out
Vercel differs here. You set none of Render's four settings. Vercel spots the Express app and runs it for you, so nothing runs `npm start`. It has no health check setting: you check `/api/health` yourself. Like On Commit, every push to `main` goes live by default.
```

````try
You need your Vercel account, signed in with GitHub.

1. In Vercel's dashboard, click Create New, then Project, or open [vercel.com/new](https://vercel.com/new).
2. Under Import Git Repository, find `cicd-lab` and click Import.
3. Not listed? Click Adjust GitHub App Permissions, and give Vercel access to the repo.
4. Leave every setting as Vercel fills it in. Click Deploy.
5. Error instead of Ready? Open the deployment's Build Logs, and use the fixes below this box. With the starter's TypeScript 7, it's likely `TS2688`.
6. When the deployment is Ready, open the project and click its domain.
7. Check the health endpoint. Put your project's domain in place of `YOUR_PRODUCTION_URL`:

```sh
curl https://YOUR_PRODUCTION_URL/api/health
```

You should see the home page say "CI/CD Lab" and "Version development". `curl` prints `{"status":"ok"}`.
````

How did Vercel find the app? It looks for a file that imports `express`, in a fixed list of places. The file is called `app`, `index` or `server`, at the root or in `src`, in JavaScript or TypeScript. It must default-export the app or call `listen`. `src/app.ts` imports `express` and ends with `export default app`, so it qualifies. `src/server.ts` imports `./app.js`, not `express`, so it doesn't.

On Render, `npm start` runs a server that listens all the time. On Vercel the app becomes a **Vercel Function**: code that Vercel runs whenever a request arrives. Vercel also reads `engines`, so it builds with the newest Node 24, as Render did. It builds the app, but it never runs your tests: that's CI's job, from Step 4.

Two URLs matter from now on. A **deployment** is one build of one commit, at its own URL, such as `cicd-lab-a1b2c3d4e-your-account.vercel.app`. The **Production URL** is your project's main address, such as `cicd-lab.vercel.app`, with a few extra letters if that name is taken. It always shows the newest production deployment that has gone live.

The first deployment of a new project is a production deployment, so it went live as soon as it built. With no gate yet, that's continuous deployment with no check, like Brad's On Commit. Listen for one slip at 14:23: Brad calls On Commit "continuous delivery", after calling it continuous deployment at 13:19. By his own definitions (video 2:04), going live with no human click is continuous deployment.

If the build fails, open the deployment and read its Build Logs before you change any code. Two errors have known causes:

- `TS2688: Cannot find type definition file for 'node'`. The starter uses TypeScript 7, which is very new, and Vercel's Express builder has failed on it. Move to TypeScript 6 with the commands below.
- `No entrypoint found which imports express`. No file on Vercel's list imports `express` any more, for example because the app's file moved. Put `src/app.ts` back as it was.

```sh
npm install --save-dev typescript@6
npm run verify
git add package.json package-lock.json
git commit -m "chore: build with TypeScript 6"
git push
```

No gate exists yet, so pushing straight to `main` is fine this once. Vercel builds the new commit by itself.

```checkpoint vercel-entrypoint
Which starter file does Vercel run as the app?
- [ ] `src/server.ts`, because it calls `listen`
- [x] `src/app.ts`, because it imports `express`
- [ ] `dist/server.js`, after the build has run
- [ ] `package.json`, through its `start` script
Why: Vercel takes the file on its list that imports `express`, and that file must export the app as a default export (or listen on a port). `src/server.ts` imports `./app.js` instead, and nothing on Vercel runs `npm start`.
```

```checkpoint which-url-changes
You push a new commit to `main`, and it builds. Which URL now shows the new version?
- [x] The Production URL, which follows each new release
- [ ] The first deployment's own URL, which updates
- [ ] Every older deployment's URL, which all update
- [ ] None, until you redeploy by hand in Vercel
Why: Each deployment's URL stays frozen on its own commit. The Production URL always shows the newest production deployment that went live, and with no gate, the new one goes live at once.
```

### Step 4: CI on a branch, then a squash merge

Brad creates the branch `feature/github-actions-ci` and adds the gist's `.github/workflows/ci.yml` (video 15:20–16:25). He explains it line by line (16:25–18:32). Then he opens a pull request, watches `Verify` go green and reads its log (19:19–20:33). He merges, pulls `main` and deletes his branch (20:45–21:45). [Reading a GitHub Actions workflow](/learn/reading-a-workflow) explains the file in depth.

```callout watch-out
Two things differ. Your pull request also gets a Vercel preview deployment, with a bot comment linking to it: on Vercel, previews are on from the start. And you squash-merge where Brad makes a merge commit, so you delete your local branch differently.
```

````try
1. Start the branch from `main`, and make the workflow folder:

```sh
git switch -c feature/github-actions-ci
mkdir -p .github/workflows
```

2. Create `.github/workflows/ci.yml` with Brad's workflow:

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

3. Run the same install and checks that CI will run:

```sh
npm ci
npm run verify
```

4. Commit and push the branch:

```sh
git add .
git commit -m "ci: add GitHub Actions verification workflow"
git push -u origin feature/github-actions-ci
```

5. On GitHub, click Compare & pull request, then Create pull request.
6. Wait for `CI / Verify (pull_request)` to turn green. Click Details to read each step's log.
7. Click Squash and merge, then Confirm squash and merge.
8. In your terminal, switch to `main` and update it:

```sh
git switch main
git pull --ff-only
```

9. Check that the branch holds nothing `main` lacks. This should print nothing:

```sh
git diff main feature/github-actions-ci
```

10. Delete your copy of the branch:

```sh
git branch -D feature/github-actions-ci
```

You should see `Verify` ✓ in the pull request's checks, beside Vercel's own status and a Vercel comment with a preview link. After the merge, the Actions tab shows a second CI run, for the push to `main`.
````

GitHub shows the check as `CI / Verify (pull_request)`: the workflow's name, the job's name and the event. The check's own name is `Verify`, from the job's `name:` line. Without a `name:` line, the job's id, `verify`, would be the name. That's the name both gates will ask for.

Why `-D`? Brad's `git branch -d` works because a merge commit keeps the branch's commits in `main`. A squash makes one new commit instead, so `main` doesn't hold them. Yet `-d` may still delete the branch, with a warning, because it first checks against `origin/feature/github-actions-ci`: Git's memory of the copy you pushed, which `git pull` leaves in place. After `git fetch --prune` drops that memory, `-d` refuses, saying the branch is "not fully merged". Either way, an empty `git diff` proves `main` already holds everything, so `-D` (delete anyway) loses nothing.

The second run matters later. The squash commit on `main` is brand new, and the pull request's green check belongs to a different commit. The push run gives the new commit its own `Verify`. That's the one Vercel's Deployment Check will wait for in Step 6.

```checkpoint squash-branch-d
After the squash merge and a `git fetch --prune`, `git branch -d feature/github-actions-ci` refuses. What's the safe next move?
- [ ] Switch the repo back to merge commits
- [ ] Revert the squash commit on `main`
- [x] Check `git diff` is empty, then use `-D`
- [ ] Wait for GitHub to delete your local copy
Why: The squash commit is new, so `-d` can't find the branch's own commits in `main`. An empty diff proves nothing would be lost. GitHub's automatic deletion removes only its own copy, not yours.
```

```checkpoint no-gate-yet
Right after step 4, before any gate exists, a push to `main` builds fine on Vercel while `Verify` on it fails. What happens?
- [ ] Vercel holds it until `Verify` passes
- [ ] Vercel cancels the build at once
- [ ] The preview replaces production instead
- [x] It is built and goes live anyway
Why: Without a Deployment Check, Vercel promotes every production build that succeeds. `Verify` reports, but nothing waits for it. Step 6 adds the hold.
```

```callout remember
After four steps you have a deployed app with CI, and no gates. `Verify` runs on each pull request and each push to `main`. Vercel runs `src/app.ts` unchanged, and every merge goes live at once.
```

## Steps 5 and 6: the two gates

Both gates come after step 4 for a reason. By now `Verify` has run in the repo, so GitHub's form and Vercel's search can find a check by that name.

### Step 5: the merge gate, a ruleset

Brad opens his repo's settings and creates a new branch ruleset called Protect main (video 22:09–22:28). He sets it to Active, targets the default branch, and requires a pull request with 0 approvals (22:28–22:52). Then he requires the `Verify` check and creates it (22:52–23:25). Nothing differs on Vercel: this gate lives on GitHub.

````try
1. On your repo, open Settings, then Rules → Rulesets.
2. Click New ruleset, then New branch ruleset.
3. Name it `Protect main`. Change Enforcement status from Disabled to Active.
4. Leave the Bypass list empty.
5. Under Target branches, click Add target, then Include default branch.
6. Tick Require a pull request before merging. Leave Required approvals at 0.
7. Tick Require status checks to pass. Click Add checks and type `Verify`.
8. Pick the `Verify` that comes from GitHub Actions. Click Create.
9. Optional, with the GitHub CLI installed:

```sh
gh api repos/YOUR_USERNAME/cicd-lab/rules/branches/main
```

You should see Protect main listed as Active. The `gh api` output lists `pull_request` and `required_status_checks`, with `"context": "Verify"`.
````

The new-ruleset form starts at Disabled, which saves the rules without enforcing them. That's why you switch it to Active. The rules call lists only rules GitHub enforces, so `[]` means nothing protects `main`.

An empty bypass list means nobody can skip the rules, you included. With 0 required approvals, every change still arrives as a pull request, so `Verify` runs on it. Nobody has to approve it, which is right when you work alone. From now on, a `git push` straight to `main` is refused, so work on branches.

```checkpoint rules-call-empty
You created Protect main, but `gh api repos/YOUR_USERNAME/cicd-lab/rules/branches/main` prints `[]`. What's the likeliest cause?
- [x] The ruleset's status is still Disabled
- [ ] `Verify` hasn't failed on any pull request
- [ ] The repo is public, not private
- [ ] Vercel hasn't deployed `main` yet
Why: The rules call skips rulesets that aren't enforced, and the form starts at Disabled. Public repos on GitHub Free can use rulesets, and Vercel has nothing to do with it.
```

### Step 6: the release gate, a Deployment Check

Brad opens his Render service's settings, edits Auto-Deploy, and picks After CI Checks Pass (video 23:31–24:05). From then on, Render deploys a commit only once its checks pass.

```callout watch-out
Vercel differs in two ways. Render waits for every check on a commit, while Vercel waits only for the checks you pick. And Render doesn't start the deploy until they pass. Vercel builds first, holds the finished production deployment, then promotes it once the checks pass.
```

To **promote** a deployment is to make it the one your Production URL shows. Vercel's **Deployment Checks** add a wait between built and promoted.

````try
1. In Vercel, open the `cicd-lab` project. Go to Settings → Environments → Production.
2. Check that automatic production aliasing is on. The switch reads Auto-assign Custom Production Domains.
3. Go to Settings → Build and Deployment. Under Deployment Checks, click Add Checks.
4. Choose GitHub as the provider. Search for `Verify`, select it, and add it.

You should see `Verify` listed under Deployment Checks.
````

Vercel's docs list two conditions for checks from GitHub. The project must be linked to the repo through Vercel for GitHub, which your import in Step 3 did. And automatic aliasing must be on, so Vercel promotes by itself once the checks pass. It's on unless you turned it off.

The release gate has a bypass too: Force Promote, on a deployment's page, promotes it even with checks failing. Keep it for emergencies, and never make it the agent's call.

This is still continuous deployment. When `Verify` passes on the new commit, Vercel promotes it with no click from you. The gate adds a wait, not a human.

```checkpoint who-clicks-release
The Deployment Check is on, and `Verify` passes on `main`'s new commit. Who puts the release live?
- [ ] You, with Promote in Vercel's dashboard
- [ ] A reviewer, approving the pull request
- [x] Nobody: Vercel promotes it by itself
- [ ] Your agent, through the Vercel CLI
Why: Deployment Checks only add a wait. Once the check passes, Vercel promotes the deployment with no click, which is continuous deployment. A human click before every release would be continuous delivery.
```

```callout remember
Merge gate: a ruleset on `main` that requires a pull request and `Verify`, set to Active, with an empty bypass list. Release gate: a Deployment Check on `Verify`, which holds each production deployment until the check passes on its commit.
```

## Steps 7 to 9: prove the gates, then preview

A gate you've never seen fail is a gate you only hope works. So the next steps send a change built to fail, then pass it, then preview one more change.

### Step 7: a test built to fail

Brad starts `feature/version-endpoint` and pastes the gist's test for `GET /api/version`, a route that doesn't exist yet (video 24:22–24:53). He sees it fail locally, pushes and opens a pull request (24:53–25:53). `Verify` goes yellow, then red, and the merge is blocked (25:53–26:20). Nothing differs on Vercel here: it's all GitHub.

````try
1. Start a fresh branch from an up-to-date `main`:

```sh
git switch main
git pull --ff-only
git switch -c feature/version-endpoint
```

2. Paste Brad's test at the very bottom of `test/app.test.ts`:

```ts
test('GET /api/version returns the current version', async () => {
  const response = await fetch(`${baseUrl}/api/version`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    version: process.env.APP_VERSION ?? 'development',
  });
});
```

3. Run the tests. The new one should fail, with 404 where it expects 200:

```sh
npm test
```

4. Commit and push:

```sh
git add .
git commit -m "test: demonstrate missing version endpoint"
git push -u origin feature/version-endpoint
```

5. On GitHub, open a pull request into `main`. Leave it open.

You should see `Verify` turn yellow while it runs, then a red ✗. The merge box says merging is blocked, and its button doesn't work.
````

The failing test is the point. It shows the merge gate holding against a change that ought to fail, before you trust it with a change that matters.

```checkpoint merge-blocked-why
Your pull request's `Verify` is red, and the merge button doesn't work. What is blocking it?
- [ ] Vercel's Deployment Check on `Verify`
- [x] The ruleset, which requires `Verify` to pass
- [ ] The workflow, which refuses failed merges
- [ ] The failed preview deployment on Vercel
Why: The ruleset requires `Verify` before merging. The workflow only reports the result, and the Deployment Check acts only after a merge.
```

### Step 7, optional: switch the merge gate off

Brad switches Protect main to Disabled and merges the red pull request (video 26:28–27:06). Render starts no deploy, because the check failed (27:06–27:48). Then he clicks Revert, merges the revert and switches the ruleset back on (27:53–28:47).

```callout watch-out
Here Vercel differs most. Render never starts the deploy. Vercel builds a production deployment from the bad commit, then holds it, because `Verify` failed on it. Built isn't live. The failing pull request adds only a test, so the site looks the same either way: look in Vercel, not at the page.
```

````try
1. In Settings → Rules → Rulesets → Protect main, set Enforcement status to Disabled. Click Save changes.
2. On the red pull request, click Squash and merge, then confirm.
3. In Vercel, open Deployments. Open the new production deployment.
4. Wait for its Deployment Checks: `Verify` fails, and the deployment isn't promoted.
5. Open your Production URL. It still shows the deployment from before.
6. On GitHub, open the merged pull request. Click Revert, then Create pull request.
7. When the revert's `Verify` is green, squash-merge it.
8. Set Protect main back to Active, in the same sitting. Click Save changes.
9. Keep your local `feature/version-endpoint` branch: Step 8 finishes it.

You should see the rules call from Step 5 list `pull_request` and `required_status_checks` again.
````

Switching a gate off is its bypass, and nothing reminds you to switch it back. The bad commit also reached `main`: the release gate kept it from users, not from history. The revert, a new pull request that undoes the merge, cleaned `main` up with a green `Verify`, and the Deployment Check let it go live. [Undo and merge conflicts](/learn/undo-and-conflicts) covers reverts.

```checkpoint gate-off-vercel
With Protect main switched off, you merge the red pull request. What does Vercel do?
- [ ] It refuses to build the commit at all
- [ ] It promotes it, then rolls back by itself
- [x] It builds it, but doesn't promote it
- [ ] It deletes the open preview deployments
Why: Deployment Checks let the production deployment be built, then hold it until `Verify` passes on its commit. Render, in the video, doesn't start the deploy at all.
```

### Step 8: pass the gate

Brad stays on `feature/version-endpoint` and adds the gist's route to `src/app.ts` (video 29:00–29:22). Both tests pass, he pushes and opens a pull request, then merges once it's green (29:22–30:36). Render deploys, and he pulls `main` and deletes the branch (30:36–31:15).

```callout watch-out
Render starts its deploy only once the checks pass. Vercel builds as soon as you merge, then waits for `Verify` on the new commit on `main` before it promotes.
```

````try
1. Make sure you're on the branch:

```sh
git switch feature/version-endpoint
```

2. In `src/app.ts`, paste Brad's route above the line `export default app`:

```ts
app.get('/api/version', (_request, response) => {
  response.json({
    version: process.env.APP_VERSION ?? 'development',
  });
});
```

3. Run all the checks. Both tests should pass:

```sh
npm run verify
```

4. Commit and push:

```sh
git add .
git commit -m "feat: add version endpoint"
git push -u origin feature/version-endpoint
```

5. Skipped the optional part? Your open pull request updates itself. Took it? Open a new pull request.
6. When `Verify` is green, squash-merge it.
7. In Vercel, watch the new production deployment wait for `Verify`, then go live.
8. Open your Production URL with `/api/version` on the end.
9. Clean up as after Step 4. The diff should print nothing:

```sh
git switch main
git pull --ff-only
git diff main feature/version-endpoint
```

10. Then delete the branch:

```sh
git branch -D feature/version-endpoint
```

You should see `{"version":"development"}`.
````

The route returns the `APP_VERSION` setting if one exists, and `development` if not. Nothing on Vercel sets it, so you see `development`.

```checkpoint held-deployment-waits
After the merge, Vercel shows the new production deployment built but not live yet. What is it waiting for?
- [x] `Verify` to pass on `main`'s new commit
- [ ] Your click on Promote in the dashboard
- [ ] Someone opening the pull request's preview
- [ ] The pull request's earlier `Verify` run
Why: The squash made a new commit, and the push run gives it its own `Verify`. The Deployment Check waits for that run, then Vercel promotes with no click.
```

### Step 9: a preview deployment

Brad explains previews: a temporary copy of the app for one pull request, at its own URL (video 31:33–31:59). He switches Render's previews to Automatic (32:07–32:21). He changes the home page on a new branch and opens a pull request (32:29–33:26). He compares the preview with production, merges, and shows Render deleting the preview (33:26–34:32). The video adds a "Hello World" heading; use the gist's line instead.

```callout watch-out
Three things differ. Vercel previews every branch push and pull request, so there's nothing to switch on. Previews ask for a Vercel login, while the Production URL stays public. And Vercel doesn't delete a preview on merge: it keeps it until its retention policy removes it, after 30 days by default.
```

````try
1. Start a fresh branch from an up-to-date `main`:

```sh
git switch main
git pull --ff-only
git switch -c feature/preview-demo
```

2. In `src/app.ts`, add this line to the home page's HTML, below the line with `Version`:

```html
<p>Preview deployment</p>
```

3. Check, commit and push:

```sh
npm run verify
git add .
git commit -m "feat: add preview deployment message"
git push -u origin feature/preview-demo
```

4. Open a pull request titled `Add preview deployment message`. Don't merge it yet.
5. When Vercel's bot comments, click Visit Preview. Log in to Vercel if it asks.
6. Open your Production URL in another tab, and compare the two.
7. Once `Verify` is green, squash-merge the pull request.
8. Reload your Production URL once Vercel promotes the new deployment.
9. Open the preview link again.
10. Clean up as after Step 8: update `main`, check the diff, then delete `feature/preview-demo`.

You should see the new line on the preview but not on production. After the merge, it's on production too, and the old preview link still works.
````

The login comes from Deployment Protection. Vercel switches on Standard Protection for new projects: previews and each deployment's own URL ask for a Vercel login, and production domains stay public. You own the project, so you get in.

The preview is the look gate from [Gates: checks that block](/learn/gates). Nothing stops you merging without opening it, so you are the gate. A preview is also a real running copy, talking to real services, so never point one at production data. [Setting up your own project's pipeline](/learn/your-projects-pipeline) covers that.

```checkpoint preview-after-merge
A week after you merge the preview pull request, you open its preview link. What do you see?
- [ ] A redirect to the production site
- [x] That same preview version, still there
- [ ] Vercel's page for deleted deployments
- [ ] Whatever `main`'s newest commit shows
Why: Vercel doesn't delete previews on merge. Each one stays until your retention policy removes it, after 30 days by default. Render is the one that deletes previews on merge.
```

```checkpoint curl-gets-login
Your agent runs `curl` on a preview URL and gets Vercel's login page instead of the home page. What does that tell you?
- [ ] The preview's build must have failed
- [ ] The preview is missing the new route
- [x] Deployment Protection is doing its job
- [ ] The Deployment Check is still waiting
Why: With Standard Protection, anyone not logged in to Vercel is sent to a login page. Open previews in your own browser. Deployment Checks hold production, not previews.
```

```callout remember
Prove each gate with a change built to fail. With the ruleset on, the red pull request can't merge. With it off, Vercel builds the bad commit but doesn't promote it. On Vercel, previews are always on, sit behind a login, and outlive their merge.
```

## Traps

Most of these fail quietly. Nothing errors; a gate waits, or the build stops with a message that's easy to misread.

| Trap | What you see | What to do |
|---|---|---|
| The job name is the check name | After a rename, pull requests wait for `Verify` forever, and Vercel never promotes | Rename the job only together with both gates |
| A check is easiest to pick once it has run | `Verify` isn't offered when you search for it | Let it run first; Step 4's pull request does that |
| The ruleset form starts at Disabled | Red pull requests still merge; the rules call prints `[]` | Set Enforcement status to Active |
| A private repo on GitHub Free | The ruleset doesn't protect `main` | Make the repo public, or use GitHub Pro |
| Previews sit behind a Vercel login | `curl` on a preview gets a login page | Open previews in a browser logged in to Vercel |
| Your Node isn't 24 | Your local results differ from CI's | Install Node 24, and check `node --version` |
| No lock file in Git | CI stops at Set up Node.js: "Dependencies lock file is not found" | Commit `package-lock.json` |
| The app file moved, or lost its default export | "No entrypoint found which imports express", or routes stop answering | Keep `src/app.ts` importing `express`, ending with `export default app` |
| TypeScript 7 on Vercel | The build fails with `TS2688: Cannot find type definition file for 'node'` | Move to TypeScript 6, as in Step 3 |
| A fix set for Production only | Production builds, then the first preview fails | Fix the cause in the code, not in one environment |

The last row needs a word. Vercel hands **environment variables**, named settings, to your build. Each one applies only to the environments you tick: Production, Preview or Development. Say a variable you set for Production only gets a failing build through. Previews build without it, so the first preview fails. One opt-in variable, `VERCEL_EXPERIMENTAL_BACKENDS=1`, swaps in a newer, experimental builder for Express, but it's no way around `TS2688`: that builder has a known crash on TypeScript 7 too.

```checkpoint red-pr-still-merges
You created the ruleset, yet a pull request with a red ✗ still merges. What do you check first?
- [ ] Which Node version your machine runs
- [x] Whether its Enforcement status is Active
- [ ] Whether Vercel imported the repo yet
- [ ] Whether the preview asks for a login
Why: The form starts at Disabled, and a Disabled ruleset blocks nothing. Node, the Vercel import and the preview login don't decide what can merge.
```

```checkpoint npm-ci-fails
On the very first pull request, CI stops at Set up Node.js with "Dependencies lock file is not found", though everything worked on your machine. What do you check first?
- [x] Whether `package-lock.json` is in Git
- [ ] Whether the ruleset is set to Active
- [ ] Whether Vercel imported the repo yet
- [ ] Whether the preview has finished loading
Why: With `cache: npm`, Set up Node.js needs the lock file in the repo, and so does `npm ci` after it. The ruleset and Vercel don't affect how the runner installs.
```

## Tell your agent

Prefer to have your agent do the typing? Paste this once, at the start. You still do every merge and every dashboard click, and you check each step's evidence yourself.

```text
We're doing a CI/CD lab: Brad Traversy's CI/CD crash course, with Vercel in place of Render. Gist: https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e. Starter: https://github.com/bradtraversy/cicd-lab-starter. Work only in the cicd-lab folder and the repo YOUR_USERNAME/cicd-lab.

Goal: main needs a pull request with a passing Verify check, every pull request gets a Vercel preview, and production is promoted only after Verify passes.

Rules:
- Read the gist first and use its code exactly. One change: we squash-merge. After each merge, update main, check that git diff main <branch> prints nothing, then delete the branch with git branch -D.
- Use Node 24. If node --version doesn't start with v24, stop and tell me.
- Keep the job's name: Verify. Keep export default app in src/app.ts.
- One step at a time. After each one, show me the evidence: command output, the pull request link, the check's name and state, the Vercel deployment's state.
- Where you can't act (GitHub or Vercel settings you can't reach by API or CLI), give me the exact clicks.
- Never merge, disable the ruleset or click Force Promote unless I say so in this conversation.

Start with step 1: clone the starter with fresh history, run npm ci, add the verify script and run it.
```

```checkpoint agent-never-does
Which of these should your agent never do in the lab without asking you first?
- [ ] Run `npm run verify` on its branch
- [ ] Open a pull request for its change
- [x] Switch the ruleset to Disabled
- [ ] Read a deployment's build logs
Why: Disabling the ruleset is the merge gate's bypass, like Force Promote for the release gate. Running checks, opening pull requests and reading logs leave every gate in place.
```

## Try it: check the whole pipeline

````try
You need the GitHub CLI, signed in. These commands only read; they change nothing.

1. Run all three, with your username:

```sh
gh api repos/YOUR_USERNAME/cicd-lab/rules/branches/main
gh run list -R YOUR_USERNAME/cicd-lab --limit 10
gh pr list -R YOUR_USERNAME/cicd-lab --state all
```

You should see the rules list `pull_request`, with `required_approving_review_count: 0`, and `required_status_checks`, with `"context": "Verify"`. If you picked GitHub Actions as the check's source, it also shows `integration_id: 15368`. If it prints `[]`, the ruleset is Disabled: switch it back on.

The runs list shows CI runs for both `pull_request` and `push` events, with the red one from Step 7 among them. The pull request list shows CI, the version endpoint and the preview demo. If you took the optional part, it also shows a revert and a second version pull request.
````

Keep the lab, if you like, as a sandbox: try any gate change here before you make it on a real project. To delete it, start in Vercel. In the project's Settings → General, Delete Project removes the project and its deployments. Then, on GitHub, Settings → General offers Archive this repository (it stays, read-only) and Delete this repository. Deleting with `gh repo delete` needs one more permission first: `gh auth refresh -s delete_repo`. Delete the local folder last.

## Remember

```flashcards
Q: In the lab, which two gates read the `Verify` check?
A: The ruleset Protect main, before merging, and Vercel's Deployment Check, before a production deployment is promoted.

Q: Where does the check name `Verify` come from?
A: The job's `name:` line in `ci.yml`. Rename it, and both gates wait for a check that never arrives.

Q: Why does `ci.yml` run on pushes to `main` as well as on pull requests?
A: A squash merge makes a new commit on `main`. Only the push run gives that commit its own `Verify`, which the Deployment Check waits for.

Q: With a Deployment Check on, what does Vercel do with a production build whose `Verify` failed?
A: It builds it and holds it: the Production URL keeps showing the deployment before. Render, in Brad's video, doesn't start the deploy at all.

Q: Which starter file does Vercel run, and why?
A: `src/app.ts`: it imports `express` and ends with `export default app`. Nothing runs `npm start`; the app becomes one Vercel Function.

Q: What replaces Render's Build Command, Start Command and Health Check Path on Vercel?
A: Nothing. Vercel spots the Express app by itself, and you check `/api/health` yourself.

Q: The rules call for `main` prints `[]`. What does it mean?
A: No enforced rules protect `main`. The ruleset is probably still Disabled, the form's starting status.

Q: How long does a Vercel preview last after you merge its pull request?
A: Until the retention policy removes it: 30 days by default. Render deletes previews on merge.

Q: Vercel's first build fails with `TS2688: Cannot find type definition file for 'node'`. What's the fix?
A: Move from TypeScript 7 to 6 (`npm install --save-dev typescript@6`), run `npm run verify`, and commit both package files.
```

## Final test

```final-test look-gate-catches-layout
The lab is done. An agent's pull request has a green `Verify`, but its change pushes the home page's text off-screen on a phone. What should catch it?
- [x] You, opening the preview before you merge
- [ ] The ruleset, because it reads `Verify`
- [ ] The Deployment Check, after the merge
- [ ] Vercel's build, which runs the tests
Why: No test checks the layout, so both automatic gates see green. Only a person looking at the preview catches it, and only if they open the link before merging. Vercel builds; it doesn't run your tests.
```

```final-test breaks-vercel-not-verify
Which change to the starter would break the Vercel deployment while `npm run verify` still passes?
- [x] Moving the app's code into `src/routes.ts`
- [ ] Adding a new route to `src/app.ts`
- [ ] Adding a test to `test/app.test.ts`
- [ ] Changing the text of the home page
Why: `src/routes.ts` isn't on Vercel's list of places, and `src/server.ts` doesn't import `express`, so the build finds no entrypoint. The other three keep `src/app.ts` as Vercel needs it.
```

```final-test when-it-goes-live
You squash-merge a green pull request. When does its change go live on your Production URL?
- [ ] The moment the merge finishes on GitHub
- [ ] When the pull request's own `Verify` passed
- [ ] When you click Promote in Vercel's dashboard
- [x] After `Verify` passes on `main`'s new commit
Why: The squash makes a new commit on `main`. The push run gives it its own `Verify`, and the Deployment Check holds the production deployment until that passes. Then Vercel promotes it with no click.
```

```final-test why-push-trigger
Why does `ci.yml` run on pushes to `main`, and not only on pull requests?
- [ ] Vercel can't build a pull request's commits
- [x] The squash commit needs its own `Verify`
- [ ] The ruleset ignores pull request runs
- [ ] GitHub bills pull request runs differently
Why: The Deployment Check reads `Verify` on the commit Vercel deploys. After a squash merge, that commit is new, and only the push run checks it.
```

```final-test optional-test-cleanup
For the optional test, you switched Protect main off and merged the red pull request. What must you do before you stop?
- [ ] Delete the held production deployment
- [ ] Force Promote the held deployment
- [x] Revert the merge, then set the ruleset to Active
- [ ] Rename the job, so `Verify` runs again
Why: The bad commit is on `main`, and the merge gate is off. A revert pull request cleans `main`, and Active puts the gate back. Force Promote would ship the failure.
```

```final-test is-any-rule-enforced
You created Protect main an hour ago, yet a red pull request still looks mergeable. Which read-only command shows whether any rule is enforced on `main`?
- [x] `gh api repos/YOUR_USERNAME/cicd-lab/rules/branches/main`
- [ ] `gh run list -R YOUR_USERNAME/cicd-lab --limit 10`
- [ ] `gh pr list -R YOUR_USERNAME/cicd-lab --state all`
- [ ] `git diff main feature/version-endpoint`
Why: The rules call lists only rules GitHub enforces on that branch, and `[]` means nothing protects `main`. The usual reason is that the form started at Disabled. The other commands list runs, pull requests or file changes, not rules.
```

```final-test job-id-rename
An agent tidies `ci.yml` and changes the job's id from `verify:` to `checks:`, leaving `name: Verify` as it was. The run passes. What do the gates see?
- [x] A passing check, still reported as `Verify`
- [ ] No `Verify` at all, so pull requests wait
- [ ] A new check, `checks`, that nothing requires
- [ ] The ruleset renaming its required check itself
Why: The check takes the job's `name:`; the id counts only when there's no `name:`. So both gates still find `Verify`. Change `name:` instead, and every pull request waits for a check that never arrives.
```

```final-test production-only-variable
Your first Vercel build failed, so you added an environment variable for Production only, and production now builds. Then the first pull request's preview fails to build. Why?
- [x] Previews don't get variables set for Production only
- [ ] Previews build from a different copy of the repo
- [ ] Previews need their own Deployment Check first
- [ ] Previews only build once the pull request merges
Why: Each variable applies only to the environments you tick: Production, Preview or Development. Fix the cause in the code instead, and every environment gets the fix.
```

```final-test ts2688-fix
Vercel's first build fails with `TS2688: Cannot find type definition file for 'node'`, though `npm run verify` passes on your machine. What do you change?
- [x] Move to TypeScript 6, run `verify`, commit both package files
- [ ] Turn on Vercel's experimental builder with its variable
- [ ] Delete the test file, since Vercel runs the tests
- [ ] Delete `engines`, so Vercel picks its own Node version
Why: The starter's TypeScript 7 is the cause, and Vercel's Express builder has failed on it. The experimental builder has a known crash on TypeScript 7 too. Vercel doesn't run your tests, and `engines` only picks Node.
```

```sources
- [CI/CD Made Simple: Build a Real Pipeline](https://www.youtube.com/watch?v=B7GM6F3BP6A), Brad Traversy (Traversy Media), 2026-10-05
- [CI/CD Crash Course: Commands and Code](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e), Brad Traversy, 2026
- [cicd-lab-starter](https://github.com/bradtraversy/cicd-lab-starter), Brad Traversy
- [Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), Vercel Docs
- [nvm README](https://github.com/nvm-sh/nvm), nvm
- [fnm README](https://github.com/Schniz/fnm), fnm
- [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), GitHub Docs
- [Creating rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), GitHub Docs
- [Get rules for a branch](https://docs.github.com/en/rest/repos/rules), GitHub REST API docs
- [Troubleshooting required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks), GitHub Docs
- [Reverting a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/reverting-a-pull-request), GitHub Docs
- [Deploying Git repositories](https://vercel.com/docs/git), Vercel Docs
- [Express on Vercel](https://vercel.com/docs/frameworks/backend/express), Vercel Docs
- [How to ship an Express app on Vercel](https://vercel.com/kb/guide/ship-a-express-app-on-vercel), Vercel KB
- [packages/express/src/build.ts](https://github.com/vercel/vercel/blob/main/packages/express/src/build.ts), Vercel
- [Environments](https://vercel.com/docs/deployments/environments), Vercel Docs
- [Accessing deployments through generated URLs](https://vercel.com/docs/deployments/generated-urls), Vercel Docs
- [Deployment Checks](https://vercel.com/docs/deployment-checks), Vercel Docs
- [Block Vercel deployment promotions with GitHub Actions](https://vercel.com/changelog/block-vercel-deployment-promotions-with-github-actions), Vercel changelog
- [Deployment Protection](https://vercel.com/docs/deployment-protection), Vercel Docs
- [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication), Vercel Docs
- [Deployment Retention](https://vercel.com/docs/deployment-retention), Vercel Docs
- [Experimental build mode for Hono and Express projects](https://vercel.com/changelog/experimental-build-mode-hono-express), Vercel changelog
- [Deployment fails with TypeScript 7: ts.sys is undefined in doTypeCheck (#17390)](https://github.com/vercel/vercel/issues/17390), vercel/vercel, 2026-08-06
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), npm Docs
- [Managing projects](https://vercel.com/docs/projects/managing-projects), Vercel Docs
- [Archiving repositories](https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories), GitHub Docs
```
