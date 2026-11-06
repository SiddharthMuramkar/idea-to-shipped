---
title: What CI/CD is
slug: what-ci-cd-is
summary: What CI, continuous delivery and continuous deployment mean, why checks run on a fresh machine, and the one verify command that everyone runs.
---

Say an agent opens a pull request on your `recipes` site. Does the change work? You could run the tests by hand every time, until the day you forget, and an agent writes changes faster than you can read them. This lesson gives you the words for the machine checks that catch problems first, so you can ask an agent to set them up.

```goals
- You’ll be able to explain CI, continuous delivery and continuous deployment in your own words.
- You’ll be able to say why checks run on a fresh machine instead of yours, and what usually breaks there.
- You’ll be able to recognise a verify script: the one command that the agent, you and CI all run.
- You’ll be able to name the four stops a change passes on its way to users, and say which of them are gates.
```

## Why now: agents write, gates check

Brad Traversy, a web development teacher on YouTube, opens his CI/CD crash course with a claim: coding and software development are “no longer synonymous”. People build whole apps with agents without understanding every line, and he isn’t there to criticise that. His point is what must surround that code before it reaches users: tests, gates that stop a failing change, and a **pipeline** (the chain of automatic steps every change goes through) that catches problems first.

**With CI/CD, a machine tests every change and keeps merged work ready to go live.**

- **CI**, continuous integration, is [merging](/learn/merging-and-cleaning-up) small changes into the shared code often, with a machine building and testing each one automatically, such as on each pull request.
- **CD**, continuous delivery, is keeping merged changes always ready to go live. When they go live automatically, that’s **continuous deployment**.

```checkpoint quick-1
You want every pull request tested, with nobody having to ask. Which idea is that?
- [x] CI: building and testing every change automatically
- [ ] CD: keeping merged changes ready to go live
- [ ] Continuous deployment: changes going live by themselves
Why: CI is the testing half. CD and continuous deployment are about getting merged work live.
```

Agents make this urgent. **Ralph**, a loop that runs an agent over and over on its own, shows why. Matt Pocock, who writes about coding with agents at AI Hero, puts it this way: “A human might commit once or twice a day. Ralph can pile dozens of commits into a repo in hours.” If those commits are poor, the code gets worse fast. Your job moves from typing to checking, and you can’t read that fast, so the first round of checking has to be done by machines, on every change.

Machine checks suit agents, too. An agent doesn’t get frustrated by repetition: when its code fails a check, it tries again. That’s why Matt’s [retro](/learn/retro), a [Skill](/learn/skills) that looks back over a coding session, treats a [repo](/learn/what-git-and-github-are) with no automatic checks as a problem in itself.

Two words carry the rest of these lessons. A **check** is the pass/fail result that one CI job, a set of automated steps, reports on a [commit](/learn/commits-and-diffs): the green tick or red cross you’ve seen next to a [pull request](/learn/pull-requests). A **gate** is an automatic check that blocks the next step, such as merging or going live. A check on its own only reports. It becomes a gate when something is set up to wait for it.

Say an agent has written a CI workflow for your `recipes` site (the file that tells GitHub which jobs to run, and when), with jobs that check its code and run its tests, and [pushed](/learn/push-pull-and-remotes) it on a [branch](/learn/branches-and-worktrees). It runs only on pull requests and on pushes to `main`, so until one of those happens it has run zero times. And with no **ruleset** on `main` (a named list of rules for a branch, as in [How teams protect main](/learn/how-teams-do-it)), even a red result can’t stop a merge. Brad points out the same gap after his first green run: even if a test failed, “we could still merge.”

You don’t have to write any of this by hand. Brad’s advice is to tell your agent to add these guardrails, as long as you know the words to ask with. This lesson is the words. [Reading a GitHub Actions workflow](/learn/reading-a-workflow), [Gates: checks that block](/learn/gates) and [the lab](/learn/lab-gated-pipeline) are the wiring.

```callout remember
Agents write the code, checks report on it, and gates make the result count. A workflow that nothing waits for is a report, not a gate.
```

```checkpoint check-1
Your `recipes` workflow runs on a PR, and its lint job fails. The repo has no ruleset yet. What happens when you click merge?
- [ ] GitHub blocks the merge outright
- [ ] Vercel refuses to deploy it
- [x] The merge goes through anyway
- [ ] The agent reverts the change
Why: Nothing waits for the check, so the red cross only reports. Blocking the merge is a ruleset’s job, and this repo doesn’t have one yet.
```

```checkpoint check-2
Which of these is a gate, in the sense used here?
- [ ] A green tick on one commit
- [x] A check that merging waits for
- [ ] A workflow file in the repo
- [ ] A test the agent wrote today
Why: A gate blocks the next step by itself. A tick, a workflow file or a test produces or reports a result; it becomes a gate only when something waits for it.
```

## CI: merge often, check every change

Martin Fowler, a long-time writer on software design, defines CI in two halves: everyone merges their work into the shared code at least daily, and an automated build that includes the tests checks every merge. Put plainly: land small changes often, and have a machine check each one. CI is much older than agents. Kent Beck developed it in the 1990s, as part of a method called Extreme Programming.

GitHub’s docs say the same in GitHub’s terms. A CI workflow builds your code and runs your tests when something happens, such as a push, and shows the results on the pull request. All green means ready to review or merge. It doesn’t mean the code is right: a check catches only what it was written to catch.

Brad’s lab app is a tiny web server written in TypeScript: JavaScript plus **types**, labels that say what kind of value each name holds, such as a number or some text. Brad lists what CI usually checks: the types, the tests, lint (rules about style and risky patterns) and the build.

Here is what each check catches, and its command in the lab. Each command runs through npm, the tool that installs a JavaScript project’s packages and runs its scripts.

| Check | What it catches | In Brad’s lab |
|---|---|---|
| **Typecheck** | Code that breaks TypeScript’s type rules. In the lab it’s `tsc --noEmit`: TypeScript’s compiler, the tool that turns it into JavaScript, run without writing any files. | `npm run typecheck` |
| **Tests** | Code that doesn’t do what a test says it should | `npm test`, with the test runner built into Node.js, the program that runs JavaScript outside a browser |
| **Lint** | Broken rules about style and risky patterns, found by a **linter** such as ESLint | Not in the lab |
| **Build** | Code that can’t be turned into the version that runs for users | `npm run build`, which runs `tsc` |

Tests catch what types can’t. In Brad’s gate test he writes a test for a new **endpoint**, `/api/version` (an address in the app that answers requests), before the endpoint exists. The types and the build are fine, but the test calls the endpoint, gets “not found” instead of a version, and goes red.

The tests are what make CI work. **Self-testing code** is code that comes with a full set of automated tests. Fowler calls it “a necessary prerequisite”: without it, CI won’t work.

Fowler adds two cautions that matter more with agents, not less. Keep the build fast: the point is rapid feedback, and ten minutes is his reasonable target. And integrate for real. Checks on a branch are useful, but they aren’t continuous integration until the work lands in `main`, and a PR that waits days for review breaks the rhythm. For you, that means small PRs from agents, merged quickly, not a week-long branch with perfect checks.

A red build comes first. If CI goes red on `main`, fixing it comes before anything else, and Fowler quotes Kent Beck: “nobody has a higher priority task than fixing the build.” (CI can only go red on `main` if a workflow runs there, for example on each push.) Usually the best fix is to **revert** the faulty commit: add a new commit that undoes it, as in [Undo and merge conflicts](/learn/undo-and-conflicts). Everyone else keeps working while a couple of people find the cause.

```callout remember
CI means landing small changes in `main` often, with a machine checking each one: types, tests, lint, build. Green means the checks found nothing, not that the code is right. A red `main` comes first: revert, then find the cause.
```

```checkpoint check-3
Brad adds a test for `/api/version` before writing the route. The types and the build are fine. What goes red?
- [ ] The typecheck
- [ ] The build
- [ ] The lint
- [x] The tests
Why: The test calls a route that doesn’t exist yet, so it fails. The typecheck and the build only check that the code is well formed and compiles; neither runs it.
```

```checkpoint check-4
By Fowler’s definition, which of these isn’t continuous integration yet?
- [ ] Small PRs merged into main daily
- [x] Green checks on a week-old branch
- [ ] Checks on every push to main
- [ ] A fast build on every merge
Why: CI means the work lands in `main` at least daily. Checks on a branch that hasn’t merged for a week are useful, but Fowler says that isn’t the same thing.
```

```checkpoint check-5
Every check on an agent’s PR is green. What does that tell you?
- [x] It’s ready to review or merge
- [ ] The code has no bugs left
- [ ] Users have already seen the change
- [ ] The agent wrote it very carefully
Why: GitHub’s docs say all green means ready to be reviewed or merged. The checks found nothing, but they can only catch what they were written to catch.
```

```checkpoint quick-9
CI goes red on `main`, and nobody knows why yet. What’s usually the best fix?
- [x] Revert the faulty commit, and find the cause elsewhere
- [ ] Keep merging as usual, and fix it at the end of the week
- [ ] Leave it red until whoever broke it has time to look
Why: Fixing the build comes first. Reverting undoes the faulty commit, so everyone else keeps working while a couple of people find the cause.
```

## CD: delivery or deployment

The CD half is about **production**: the real, live version of the app that users see, as opposed to your laptop or a test copy. CD has two meanings, and the difference is one human click.

**Continuous delivery** means the software is always ready to go live, but releasing stays a business decision: a person decides when, and clicks. Fowler’s test is that someone could ask for the current version to go to production “at a moment’s notice” and nobody would worry. **Continuous deployment** goes one step further: every change that passes the gates goes live by itself. You can’t do the second without the first.

|  | Continuous delivery | Continuous deployment |
|---|---|---|
| After the gates pass | Ready to go live | Goes live |
| Who decides when | A person, with a click | Nobody: it’s automatic |
| Brad’s words | “it does need that human” | “it happens automatically once those required checks pass” |

Brad’s definitions match Fowler’s, and he says his project uses continuous deployment. Then he slips. His video puts the app on Render, a hosting service that runs it on Render’s servers. Setting Render up, he leaves Auto-Deploy on “On Commit” and rightly calls it continuous deployment. A minute later, in the same chapter, he says “And again, continuous delivery”, because each push now deploys automatically. By his own definition that’s continuous deployment: no human decides. People say “CD” for both, so when you prompt an agent, say the full word.

Vercel, the hosting service the lab uses in Render’s place, makes two kinds of deployment from a site’s GitHub repo. A **deployment** is one build of one commit, at its own web address.

- A **production deployment** is a build made for production. You get one when you push or merge into the production branch (the live one, usually `main`), or run `vercel --prod`. A new project’s first deployment is always a production one.
- A **preview deployment** is a test copy of the site, at its own address. You get one when you open a pull request, or push to any other branch. The live site stays as it is.

A production deployment goes live when it is **promoted**: given the production domain, the site’s real address. By default Vercel promotes each one as soon as it’s built. The lab adds a gate. When a PR merges into `main`, Vercel builds a production deployment, holds it until GitHub’s check (called `Verify` in Brad’s lab) passes on that commit, then promotes it with nobody clicking. That’s still continuous deployment, held back by a check. [Gates: checks that block](/learn/gates) sets up the hold.

```callout remember
Delivery: always ready, and a person clicks to go live. Deployment: every change that passes the gates goes live by itself. On Vercel a pull request gets a preview deployment, and a merge into `main` gets a production deployment, which goes live when it’s promoted.
```

```checkpoint check-6
In the lab, a merged PR’s `Verify` passes and the change goes live with no one clicking. Which is that?
- [x] Continuous deployment
- [ ] Manual release
- [ ] Continuous delivery
- [ ] Continuous integration
Why: Every change that passes goes live without a human click. With continuous delivery it would stop at “ready” and wait for someone to promote it.
```

```checkpoint check-7
Brad leaves Render on “On Commit” and later calls it continuous delivery. Why is that a slip?
- [ ] Render can’t deploy on commits
- [ ] Delivery means no tests run
- [x] No human approves each release
- [ ] Commits never reach production servers
Why: By his own definition, delivery needs a person to approve the release. “On Commit” deploys every push automatically, which is continuous deployment.
```

```checkpoint check-8
Say a client wants their site always ready to ship, but wants a person to approve every release. Which fits?
- [ ] Continuous deployment
- [x] Continuous delivery
- [ ] Continuous integration
- [ ] Manual builds
Why: Delivery keeps every change ready to go live and leaves the click to a person. Deployment would remove that click. CI alone says nothing about releasing.
```

```checkpoint quick-5
You open a pull request on a site that’s already live on Vercel. What happens to the live site?
- [x] Nothing: the PR gets a preview deployment at its own address
- [ ] It changes at once, because Vercel deploys every pull request
- [ ] It goes offline until Vercel finishes the preview deployment
Why: A pull request gets a preview deployment, a test copy of the site. The live site changes when you push or merge into the production branch.
```

## Where checks run: a fresh machine every time

A **job** is a set of steps that run in order on one machine. The **runner** is the machine that runs it.

A **workflow** says which jobs to run, and when. It’s a file in the repo’s `.github/workflows/` folder, written in **YAML**: a plain-text settings format of indented `key: value` lines. Each job in it picks a runner with `runs-on`. Brad’s says `ubuntu-latest`: GitHub’s current standard machine running Ubuntu Linux.

On GitHub-hosted runners, each job gets a brand-new virtual machine (VM): a temporary computer in GitHub’s cloud, with Linux and common tools preinstalled. In Brad’s lab, the job checks out the code, sets up Node, installs the dependencies (the published packages the app needs) and runs the checks. When the job finishes, the VM is thrown away.

So each run starts clean. The fresh machine has none of your files on it. A job’s first step fetches the code, and later steps can use it, because they share one runner.

```checkpoint quick-8
You remove the step that fetches the code from a job. Why do the later steps fail?
- [x] The fresh machine has none of your files until a step fetches them
- [ ] The runner still holds the last run’s files, and those are out of date
- [ ] Each step gets its own machine, so the steps can’t share any code
Why: Every job gets a fresh machine with none of your files on it. A step has to fetch the code, and later steps can use it because they share one runner.
```

Why bother, when the agent already ran the checks on your laptop? Because your laptop has history, and Fowler notes that “works on my machine” is a well-known phrase for a reason. The runner has none of that history. It gets the one commit being checked, the packages the **lockfile** lists (for npm, `package-lock.json`: the exact version of every package to install), and GitHub’s standard tools. Here are three ways a change can pass on your laptop and fail there:

- **An uncommitted file.** Say the agent creates `src/recipes.ts`, imports it, and forgets to commit it. Your folder has the file, so everything passes. The runner has only the commit, so the import fails.
- **A missing dependency.** A package sits in your `node_modules` folder, where npm keeps installed packages, but it was never added to `package.json` (the file that lists a Node project’s packages and scripts) and the lockfile. CI installs from the lockfile alone, so the package isn’t there.
- **A different Node version.** Say your laptop runs Node 22 and the workflow asks for Node 24. Code that depends on one version’s behaviour passes in one place and fails in the other.

GitHub Actions isn’t the only CI service. Brad names Jenkins, CircleCI and Travis CI: they differ in setup, but all of them run checks automatically whenever the code changes. These lessons use GitHub Actions only.

Tests that need a real database get a throwaway one too. A workflow can start **service containers**: Docker containers (packaged programs, such as a database, that run in isolation) beside the job, created fresh for it and destroyed when it ends. A `services` block in the workflow names the container image (the packaged program to start), such as `postgres` for the Postgres database, and the job reaches it over the network. Some hosted databases offer another route: Neon, for example, has GitHub Actions that make a short-lived copy of a database for a pull request and delete it afterwards.

```callout remember
CI runs on a new machine that gets the commit and the locked dependencies, nothing from your laptop, and is thrown away afterwards. A pass there can’t depend on leftovers.
```

```checkpoint check-9
An agent’s PR passes `npm run verify` on your laptop, but CI fails with “Cannot find module ./recipes”. What’s the most likely cause?
- [ ] GitHub’s runner is too slow
- [ ] The ruleset blocked the import
- [ ] Your Node version is newer
- [x] The file was never committed
Why: The runner has only the commit. A file that exists in your folder but was never committed is missing there. A ruleset can block a merge, but it never touches imports.
```

```checkpoint check-10
Why does a passing check on a GitHub-hosted runner prove more than the same check on your laptop?
- [x] The runner starts clean every job
- [ ] The runner has a faster processor
- [ ] The runner skips the slow tests
- [ ] The runner can read your files
Why: Each job gets a new VM with the commit, the locked dependencies and GitHub’s standard tools, so nothing left behind on your laptop can make it pass.
```

```checkpoint check-11
Your tests need a throwaway Postgres database for one CI job. What does GitHub Actions offer?
- [ ] A shared database for everyone
- [ ] Your laptop’s database over the network
- [x] A service container per job
- [ ] Your production database, read-only
Why: A service container is a Docker container started beside the job and destroyed when it ends. Production data and your laptop’s database never belong in a CI job.
```

## The verify script: one command everywhere

Brad’s starter app already has three checks as separate **npm scripts**: named shortcuts in the `scripts` section of `package.json`, the file that describes a Node project. `npm run typecheck` runs whatever command is saved under `typecheck`. His first change is to add a fourth script that runs all three:

```diff
 "scripts": {
   "dev": "tsx watch src/server.ts",
   "typecheck": "tsc --noEmit",
   "test": "node --import tsx --test test/app.test.ts",
   "build": "tsc",
-  "start": "node dist/server.js"
+  "start": "node dist/server.js",
+  "verify": "npm run typecheck && npm test && npm run build"
 }
```

`&&` means “run the next command only if this one succeeded”. So `npm run verify` either runs all three and passes, or stops at the first failure with an error, and you see the first real problem rather than its knock-on errors.

Why one script instead of three commands? Because three callers run it, and they should all mean the same thing by “passed”. The agent runs it before it says it’s done, you ask for its output before you review, and CI runs it on every pull request. Fowler asks that anyone with a clean machine can check out the code and build it with a single command; this is the single command for checking it. And when CI goes red, the agent reproduces the failure with that same command.

In Brad’s workflow, the last two steps are these:

```yaml
      - name: Install dependencies
        run: npm ci

      - name: Verify application
        run: npm run verify
```

`npm ci` is `npm install` for machines. It needs a lockfile, clears out `node_modules`, and installs exactly the locked versions. If `package.json` disagrees with the lockfile, it stops with an error instead of quietly updating it. Same commit, same versions, every run. A project that uses pnpm, another package manager, does the same with `pnpm install --frozen-lockfile`.

One trap before the lab. Brad’s `package.json` declares Node 24 in its `engines` field. That records which Node the project expects, but npm treats it as advice and doesn’t change the Node you have. Say your laptop runs Node 22: `npm run verify` there uses 22, while CI uses the 24 its workflow asks for. The fix, as Brad’s gist says, is to install or switch to Node 24 before you start. (A gist is a GitHub page of shared notes and code; Brad’s holds every command and file from his video.)

Many projects have the parts but no single command: a README that lists lint, typecheck, tests and build one by one, and a CI workflow that runs them as separate steps. [Setting up your own project’s pipeline](/learn/your-projects-pipeline) closes that gap.

```callout remember
One verify script, run the same way by the agent, by you and by CI. `&&` stops at the first failure, `npm ci` installs exactly the lockfile, and `engines` states a Node version without switching yours.
```

```checkpoint check-12
Your verify script joins typecheck, tests and build with `&&`. The typecheck fails. What runs next?
- [ ] The tests, then the build
- [ ] Only the build step runs
- [x] Nothing: the script stops there
- [ ] The typecheck runs once again
Why: `&&` runs the next command only if the last one succeeded, so the first failure ends the script with an error.
```

```checkpoint check-13
Why does CI run `npm ci` instead of `npm install`?
- [ ] It also runs the tests
- [x] It installs exactly the lockfile
- [ ] It updates the lockfile first
- [ ] It skips the dev dependencies
Why: `npm ci` installs the locked versions and stops with an error if `package.json` disagrees, instead of updating the lockfile. Same commit, same versions, every run.
```

```checkpoint check-14
Brad’s `package.json` sets `engines` to Node 24. Your laptop has Node 22. Which Node runs your local `npm run verify`?
- [ ] Node 24, switched for you
- [ ] Whatever version CI last used
- [ ] Neither: npm will refuse it
- [x] Node 22, the one installed
Why: `engines` only records what the project expects, and npm treats it as advice. Your installed Node runs, which is why the gist says to switch to 24 first.
```

## Where the gates sit

A change an agent writes passes four stops on its way to users. Stops 2 to 4 are also the map of the next three lessons.

1. **Pre-commit hook**, on your laptop, at each commit. A **hook** is a script Git runs at a set moment. A pre-commit hook runs before each commit, and if it fails, there’s no commit. Matt’s [setup-pre-commit](/learn/setup-pre-commit) Skill writes the three-line hook shown below: format the staged files with Prettier, a code formatter, then typecheck, then test.
2. **Required check**, on GitHub, before merge. The workflow runs the checks on a fresh runner for every PR. A ruleset on `main` makes the check required: no green, no merge. In Brad’s lab the ruleset is called “Protect main”, and it requires `Verify`.
3. **Review and preview**, by you, before merge. You read the PR and open its preview deployment. A person decides here, so it isn’t a gate in the sense used here: it’s the part machines can’t do. [Gates: checks that block](/learn/gates) nicknames it the look gate, because you hold it, but nothing automatic blocks there.
4. **Deployment Check, then promote**, on Vercel, before release. After the merge, Vercel builds the production deployment and holds it until the required checks pass on `main`. Then it promotes it. “Force Promote” skips the wait.

The hook from the first stop:

```sh
npx lint-staged
npm run typecheck
npm run test
```

```diagram
type: chain
caption: "A change an agent writes passes four stops on its way to users."
steps:
  - label: "Pre-commit hook"
    note: "on your laptop, at each commit"
  - label: "Required check"
    note: "on GitHub, before merge"
  - label: "Review and preview"
    note: "by you, before merge"
  - label: "Deployment Check, then promote"
    note: "on Vercel, before release"
```

Stop 1 is the fastest feedback, before anything leaves the laptop. But anyone, an agent included, can skip it with `git commit --no-verify`, so treat it as a convenience. The gates that hold are stops 2 and 4. They run on GitHub and Vercel, not on the machine the agent works in, and switching them off takes a deliberate settings change, not a flag.

The same check counts twice: GitHub’s `Verify` blocks the merge, and Vercel waits for it again on `main` before promoting. Both find it by the job’s name, so rename the job and neither finds it until the ruleset and the Deployment Check are updated. Brad builds the same two layers with Render: a ruleset on GitHub, and Render’s “After CI Checks Pass” setting.

The next lessons go stop by stop. [Reading a GitHub Actions workflow](/learn/reading-a-workflow) reads a workflow line by line, [Gates: checks that block](/learn/gates) wires stops 2 to 4, and [the lab](/learn/lab-gated-pipeline) has you build them on Brad’s starter app, with Vercel in place of Render. Stop 1 has its own lesson, [setup-pre-commit](/learn/setup-pre-commit).

```callout remember
The pre-commit hook is fast but skippable. The gates that hold are the required check before merge and the Deployment Check before release. You review in between.
```

```checkpoint check-15
An agent commits with `--no-verify`, skipping the pre-commit hook. Which stop still catches its failing test?
- [ ] The preview deployment for review
- [x] The required check before merge
- [ ] The pre-commit hook, run later
- [ ] The agent’s own commit message
Why: The hook runs on the laptop and was skipped. CI runs the tests again on a fresh runner, and the ruleset won’t let the PR merge until they pass.
```

```checkpoint check-16
You change Brad’s job from `name: Verify` to `name: Verify app`. What else must change?
- [ ] Nothing, since names are only labels
- [ ] Only the URL of each preview
- [ ] The runner image named in `runs-on`
- [x] The ruleset and the Deployment Check
Why: Both gates find the check by the job’s name. After a rename, the ruleset and Vercel’s Deployment Check must be updated to the new name, or neither finds it.
```

```checkpoint check-17
Which of the four stops is not a gate, in the sense used here?
- [ ] Pre-commit hook
- [ ] Required check
- [x] PR review
- [ ] Deployment Check
Why: A gate is automatic. At the review a person decides, which is the part machines can’t do. The other three are automatic, though the pre-commit hook can be skipped.
```

## Going deeper

### A check that never ran

In July 2025, a user named searls opened issue #319 on Anthropic’s Claude Code GitHub Action, which runs Claude Code inside GitHub Actions. Claude had committed to their pull request, but their CI workflow never ran.

The cause is a GitHub rule. Each job gets a key called `GITHUB_TOKEN`, so the job can act on the repo. Events that a workflow causes with that key don’t start new workflow runs, with a few exceptions, so a workflow’s commit can’t start a workflow that commits again, without end.

When searls reported it, GitHub started no run at all. GitHub’s docs now add an exception for pull requests. A push made with `GITHUB_TOKEN` starts no `push` run. But when a workflow creates a pull request or pushes to one with it, the `pull_request` runs start in an approval-required state. Someone with write access to the repo has to select **Approve workflows to run** in the merge box.

So a check that never ran isn’t a check that passed. When an agent pushes to a pull request from inside a workflow, look for its run, and approve it if GitHub asks. [Agents in GitHub Actions](/learn/agents-in-github-actions) runs agents this way.

```checkpoint quick-11
A workflow using `GITHUB_TOKEN` pushes to your pull request, and its CI runs don’t start. What’s needed?
- [x] Someone with write access selects Approve workflows to run
- [ ] Someone with admin access re-runs the last run on `main`
- [ ] Nothing: the runs begin by themselves after a short wait
Why: A pull request created or pushed to with `GITHUB_TOKEN` starts its runs in an approval-required state. They wait until someone with write access approves them.
```

## Tell your agent

Use this on Brad’s starter app in [the lab](/learn/lab-gated-pipeline), or on a project of your own that has typecheck, test and build scripts.

```text
Add a verify script to package.json that runs typecheck, tests and build in that order, stopping at the first failure. Use the package manager this repo already uses. Run it and show me the output. Don’t change the CI workflow yet. Tell me whether it runs the same checks as the workflow.
```

## Try it

Two practice runs. The first stays on your machine, with Brad’s starter app. The second adds a real CI check, called `test`, to your practice project on GitHub. Later Try it steps rely on that check. If you skipped the auto-merge Try it in [Merging and cleaning up](/learn/merging-and-cleaning-up) because you had no check, go back to it after the second run.

### On your machine: one verify command

````try
Run Brad’s three checks on your own machine, join them into one `verify` script, and watch `&&` stop at the first failure. Nothing here touches GitHub. It takes about ten minutes.

**You need:** a terminal, Git, and Node.js 24 with npm (npm comes with Node).

1. Check your Node version. It should start with `v24.`. If it doesn’t, install or switch to Node 24 first: the starter’s `engines` field won’t do it for you.

```sh
node --version
```

2. Copy Brad’s starter into a practice folder, and go into it.

```sh
git clone https://github.com/bradtraversy/cicd-lab-starter.git cicd-practice
cd cicd-practice
```

3. Install exactly what the lockfile lists.

```sh
npm ci
```

4. Run the three checks one by one. Each should finish with no error, and the test summary should count one test passed (`pass 1`).

```sh
npm run typecheck
npm test
npm run build
```

5. Open `package.json` in your editor. In `scripts`, add a comma at the end of the `start` line, add this line below it, and save.

```text
"verify": "npm run typecheck && npm test && npm run build"
```

6. Run all three with one command. You should see npm run `typecheck`, then `test`, then `build`, in that order, with no error at the end.

```sh
npm run verify
```

7. Break the app on purpose. In `src/app.ts`, change `status: 'ok'` to `status: 'up'`, save, and run `npm run verify` again. The typecheck passes, because the types are still fine. The test fails (`fail 1`), because it expects `ok`. And no `build` step follows: `&&` stopped the script.
8. Change `status: 'up'` back to `status: 'ok'`, save, and run `npm run verify` once more. It should pass again.

**It’s working if:**

- [ ] `npm run verify` runs the typecheck, the test and the build, in that order, and passes.
- [ ] With `status: 'up'`, it stops at the failing test, and the build never starts.

You can delete the `cicd-practice` folder afterwards. The lab starts again from Brad’s starter, in a repo of your own.
````

### On GitHub: a `test` check for your practice project

````try
Add a CI workflow that runs your practice project’s tests on every pull request, then watch its check go green, red, and green again. Its one job has the id `test` and no `name:`, so the check it reports is called `test`.

**You need:** your practice project, the yoga-studio booking site, on an up-to-date `main`, and `gh`, logged in. If you haven’t set the project up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first. You don’t need Python on your machine: the runner installs it.

1. In your `yoga-studio` folder, update `main` and make a branch: `git switch main && git pull && git switch -c add-ci`.
2. Make the folders: `mkdir -p api .github/workflows`.
3. Name what CI installs, pytest (a tool that runs Python tests): `echo pytest > api/requirements.txt`. If `api/requirements.txt` already exists, add a `pytest` line to it instead.
4. Add a test that passes, as `api/test_smoke.py`:

```python
def test_adds_up():
    assert 1 + 1 == 2
```

5. Add the workflow, as `.github/workflows/ci.yml`. The `#` comments are notes for you; YAML ignores them.

```yaml
name: ci
on:
  pull_request:                        # the event: every pull request
jobs:
  test:                                # the job; also the check's name
    runs-on: ubuntu-latest             # the runner: a fresh Linux machine
    steps:
      - uses: actions/checkout@v7      # fetch the code
      - uses: actions/setup-python@v7  # install Python
        with:
          python-version: "3.12"
      - run: pip install -r api/requirements.txt   # install the listed packages
      - run: pytest api                # run the tests
```

6. Commit and push: `git add . && git commit -m "add CI" && git push -u origin add-ci`.
7. Open the pull request: `gh pr create --fill`.
8. Watch the run: `sleep 10 && gh pr checks --watch`. You should see `test` pass. That’s green.
9. Break the test: in `api/test_smoke.py`, change `1 + 1 == 2` to `1 + 1 == 3`.
10. Commit and push: `git commit -am "break the test" && git push`.
11. Watch again: `sleep 10 && gh pr checks --watch`. You should see `test` fail. That’s red.
12. Open the pull request in your browser with `gh pr view --web`, and click its **Checks** tab. You should see pytest’s error under `test`.
13. Undo the faulty commit with a revert: `git revert --no-edit HEAD && git push`.
14. Watch again. You should see `test` pass.
15. Merge: `gh pr merge --squash --delete-branch`. From now on, every pull request runs this check.

**It’s working if:**

- [ ] The pull request showed `test` green, then red with pytest’s error, then green after the revert.
- [ ] After the merge, `main` holds `.github/workflows/ci.yml`, and your next pull request runs `test`.

This workflow runs on pull requests only. Brad’s also runs on pushes to `main`, and [Gates: checks that block](/learn/gates) explains why a release gate needs that.
````

## Read and watch next

- **Watch:** [“CI/CD Made Simple: Build a Real Pipeline”](https://www.youtube.com/watch?v=B7GM6F3BP6A), Brad Traversy’s 35-minute crash course. Watch from “What Is CI/CD?” at 1:24 to the end of “Our Verify Script” at 10:49, about nine minutes. The slip about continuous delivery is in “Deploy To Render”, from 12:00.
- **Read:** [Martin Fowler, “Continuous Integration”](https://martinfowler.com/articles/continuousIntegration.html): the definition at the top and the story “Building a Feature with Continuous Integration”, about five minutes. It follows one change from a laptop through the CI service, “works on my machine” included.
- **Keep handy:** the cheat sheet at the end of [Reading a GitHub Actions workflow](/learn/reading-a-workflow) puts these words on one page.

## Remember

```flashcards
Q: What turns a check into a gate?
A: Something that waits for it, such as a ruleset before merging or a Deployment Check before going live. A check that nothing waits for only reports.

Q: What does CI mean?
A: Continuous integration: land small changes in `main` often, at least daily, with an automated build and tests checking each one.

Q: Every check is green. What does that prove?
A: That the checks found nothing. A check catches only what it was written to catch, so green means ready to review or merge, not bug-free.

Q: CI goes red on `main`. What do you do, and usually how?
A: Fix it right away: “nobody has a higher priority task than fixing the build.” Usually the best fix is to revert the faulty commit, so everyone else can keep working.

Q: Continuous delivery vs continuous deployment?
A: Delivery keeps every change ready to go live, and a person decides when and clicks. Deployment puts every change that passes the gates live by itself.

Q: On Vercel, what gets a production deployment, and what gets a preview?
A: A push or merge into the production branch, usually `main`, gets a production deployment. A pull request, or a push to any other branch, gets a preview deployment at its own address.

Q: What does a GitHub-hosted runner start with?
A: A fresh virtual machine with the one commit being checked, the packages the lockfile lists, and GitHub’s standard tools. Nothing from your laptop, and it’s thrown away after the job.

Q: Name three ways a change passes on your laptop but fails in CI.
A: A file that was never committed, a package missing from `package.json` and the lockfile, and a different Node version.

Q: What does `&&` do in `npm run typecheck && npm test && npm run build`?
A: It runs the next command only if the last one succeeded, so the script stops at the first failure.

Q: Why `npm ci` and not `npm install` in CI?
A: `npm ci` installs exactly the lockfile’s versions and stops with an error if `package.json` disagrees, instead of quietly updating the lockfile.

Q: Does the `engines` field switch your Node version?
A: No. It records which Node the project expects, and npm treats it as advice. Install or switch to that version yourself.

Q: Of the four stops, which are the gates that hold?
A: The required check before merge, and the Deployment Check before release. The pre-commit hook can be skipped with `--no-verify`, and the review is held by a person.

Q: A workflow pushes to a PR with `GITHUB_TOKEN`, and CI doesn’t start. Why?
A: Those `pull_request` runs start in an approval-required state. Someone with write access selects Approve workflows to run.
```

## Final test

```final-test final-18
In one line, what separates continuous delivery from continuous deployment?
- [ ] Whether tests run before each release
- [ ] Whether GitHub or Vercel runs it
- [ ] Whether the app uses TypeScript code
- [x] Whether a person clicks to release
Why: Both run the same gates. Delivery stops at “ready” and waits for a person; deployment goes live by itself once the gates pass.
```

```final-test final-19
CI is red, but the agent says everything passed on its side. What do you ask first?
- [x] Did you commit every new file?
- [ ] Did you rerun it more slowly?
- [ ] Did you turn off the ruleset?
- [ ] Did you force-promote it on Vercel?
Why: A fresh runner has only what’s committed. An uncommitted file, a dependency missing from the lockfile or a different Node version are the usual suspects. Switching off a gate only hides the problem.
```

```final-test final-20
Why should the agent, you and CI all run the same `verify` script?
- [ ] So CI never has to install packages
- [x] So a pass means the same everywhere
- [ ] So the agent can skip writing tests
- [ ] So Vercel can promote without any checks
Why: One command means “it passed” is the same claim from the agent, from you and from CI, and a red CI run can be reproduced locally with that command.
```

```final-test final-21
Your site runs continuous deployment behind a Deployment Check, as in the lab. A merged change’s check fails on `main`. What do visitors to the live site see?
- [ ] The new version, live at once
- [ ] An error page until it passes
- [x] The previous version, still live there
- [ ] A preview deployment of the change
Why: Vercel builds the new production deployment but doesn’t promote it until the check passes, so the domain keeps serving the last promoted one.
```

```final-test final-22
Your `recipes` site’s tests need a real Postgres database in CI, thrown away after each run. Which fits?
- [ ] Your laptop’s database, over the network
- [x] A service container beside the job
- [ ] The production database, read-only
- [ ] A pre-commit hook that starts one
Why: A service container is a throwaway Docker database, created fresh for the job and destroyed when it ends. Your laptop and production are the wrong places for test data, and a hook runs on your laptop, not in CI.
```

```final-test final-agent-claim
Your agent reports: “CI is set up for the `recipes` site, so bad code can’t reach users now.” The workflow runs on pull requests, but the repo has no ruleset and no Deployment Check. Is the agent right?
- [ ] Yes: a red check now blocks merging
- [x] No: a check reports but blocks nothing
- [ ] Yes: Vercel refuses to build failing commits
- [ ] No: workflows only run after a merge
Why: A check becomes a gate only when something waits for it: a ruleset before merging, a Deployment Check before going live. With neither, a merged PR is built and promoted whatever its checks say. The workflow does run on pull requests, but it can’t stop anything.
```

```final-test final-missing-dependency
An agent’s PR imports `date-fns`. `npm run verify` passes on your laptop. In CI, `npm ci` succeeds, then the typecheck fails with “Cannot find module date-fns”. What’s the likeliest cause?
- [ ] The runner’s preinstalled npm version is outdated
- [ ] The setup-node cache was empty this run
- [ ] The ruleset blocked the import from loading
- [x] It sits in your node_modules, not package.json
Why: The runner installs only what the lockfile lists. A package that sits in your `node_modules` but was never added to `package.json` and the lockfile isn’t on the runner, so the import fails. Ask the agent to add it properly and commit both files. A ruleset never touches imports.
```

```final-test final-agent-token-runs
A workflow using `GITHUB_TOKEN` lets an agent push commits to a pull request. What happens to the runs of your `pull_request` CI workflow?
- [x] They start in an approval-required state, until someone with write access approves them
- [ ] They start straight away, exactly as they would for commits you pushed yourself
- [ ] None start at all, and GitHub gives no way to start them from the pull request
- [ ] They start, but their checks never count toward the branch’s required checks
Why: GitHub won’t let a workflow’s own changes set off runs without limit, so these runs wait in an approval-required state. They start when someone with write access selects Approve workflows to run. The older report, issue #319, saw no runs at all.
```

```sources
- [CI/CD Made Simple: Build a Real Pipeline](https://www.youtube.com/watch?v=B7GM6F3BP6A), Brad Traversy, 2026-10-05
- [CI/CD Crash Course: Commands and Code](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e), Brad Traversy
- [cicd-lab-starter](https://github.com/bradtraversy/cicd-lab-starter), Brad Traversy
- [CI/CD for Beginners](https://www.traversymedia.com/blog/ci-cd-for-beginners-build-a-github-actions-and-render-pipeline), Traversy Media
- [Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html), Martin Fowler, 2024-01-18
- [ContinuousDelivery](https://martinfowler.com/bliki/ContinuousDelivery.html), Martin Fowler
- [11 Tips For AI Coding With Ralph Wiggum](https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum), Matt Pocock, 2026-01-08
- [Essential AI Coding Feedback Loops For TypeScript Projects](https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects), Matt Pocock, 2026-01-16
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock’s Skills
- [setup-pre-commit: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/setup-pre-commit/SKILL.md), Matt Pocock’s Skills
- [Continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration), GitHub Docs
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions), GitHub Docs
- [GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners), GitHub Docs
- [actions/checkout README](https://github.com/actions/checkout), GitHub
- [actions/setup-python README](https://github.com/actions/setup-python), GitHub
- [Communicating with Docker service containers](https://docs.github.com/en/actions/tutorials/use-containerized-services/use-docker-service-containers), GitHub Docs
- [Automate branching with GitHub Actions](https://neon.com/docs/guides/branching-github-actions), Neon Docs
- [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token), GitHub Docs
- [CI builds aren't triggered when Claude makes commits to a PR (issue #319)](https://github.com/anthropics/claude-code-action/issues/319), searls, 2025-07-21
- [noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html), TypeScript Docs
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), npm Docs
- [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json), npm Docs
- [pnpm install](https://pnpm.io/cli/install), pnpm Docs
- [githooks](https://git-scm.com/docs/githooks), Git
- [Environments](https://vercel.com/docs/deployments/environments), Vercel Docs
- [Deployment Checks](https://vercel.com/docs/deployment-checks), Vercel Docs
```
