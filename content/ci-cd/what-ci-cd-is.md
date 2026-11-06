---
title: What CI/CD is
slug: what-ci-cd-is
summary: Explain CI, continuous delivery and continuous deployment in your own words, say why checks run on a fresh machine instead of yours, and recognise the verify script: the one command the rest of Part…
---

Your front-end agent has already written a CI workflow for Care4Mind, with three jobs that run everything from lint to Lighthouse. On 27 October it had never run, and even a red result would have blocked nothing. This lesson gives you the words for what’s missing, so you can ask an agent to add it.

```goals
- You’ll be able to explain CI, continuous delivery and continuous deployment in your own words, say why checks run on a fresh machine instead of yours, and recognise the verify script: the one command the rest of Part 3 builds on.
```

## Why now: agents write, gates check

Brad Traversy opens his CI/CD crash course, the source video for this Part, with a claim: coding and software development aren’t the same thing any more. People build whole apps with agents without understanding every line, and he isn’t here to criticise that. His point is what must surround that code before it reaches users: tests, gates, and a CI/CD pipeline that catches problems first.

That is your situation exactly: Care4Mind’s second decision record says agents write all the code. This course calls that **agentic engineering**, building software by directing coding agents. Your job moves from typing to checking, and an agent writes faster than you can read, so the first round of checking has to be done by machines, on every change.

Two words from [Lesson 8](/learn/pull-requests) carry the rest of Part 3. A **check** is the pass/fail result one CI job reports on a commit: the green tick or red cross you’ve seen next to a pull request. A **gate** is an automatic check that blocks the next step, such as merging or going live. A check on its own only reports. It becomes a gate when something is set up to wait for it.

Care4Mind already shows the difference. Your front-end agent wrote a workflow with three jobs (lint, types and unit tests; Playwright and axe; Lighthouse CI) and pushed it. But it runs only on pull requests and pushes to `main`, so it had run zero times, and with no ruleset even a red result couldn’t stop a merge. Brad points out the same gap after his first green run.

You don’t have to write any of this by hand. Brad’s advice is to tell your agent to add the gates, as long as you know the words to ask with. This lesson is the words; Lessons 11 to 13 are the wiring.

```callout remember
Agents write the code, checks report on it, and gates make the result count. A workflow that nothing waits for is a report, not a gate.
```

```checkpoint check-1
Care4Mind’s front-end workflow runs on a PR and its lint job fails. The repo still has no ruleset. What happens when you click merge?
- [ ] GitHub blocks the merge outright
- [ ] Vercel refuses to deploy it
- [x] The merge goes through anyway
- [ ] The agent reverts the change
Why: Nothing waits for the check, so the red cross only reports. Blocking the merge is a ruleset’s job, and Care4Mind doesn’t have one yet.
```

```checkpoint check-2
Which of these is a gate, in this course’s sense?
- [ ] A green tick on one commit
- [x] A check that merging waits for
- [ ] A workflow file in the repo
- [ ] A test the agent just wrote
Why: A gate blocks the next step by itself. A tick, a workflow file or a test produces or reports a result; it becomes a gate only when something waits for it.
```

## CI: merge often, check every change

**CI** stands for continuous integration. Martin Fowler’s definition has two halves: everyone merges their work into the shared code at least daily, and every merge is checked by an automated build that includes the tests. Put simply, land small changes often and have a machine check each one.

GitHub’s docs say the same in GitHub’s terms. A CI workflow builds your code and runs your tests when something happens, such as a push, and shows the results on the pull request. All green means ready to review or merge. It doesn’t mean the code is right: a check catches only what it was written to catch.

Brad lists what CI usually checks: types, tests, lint and the build. Here is what each one catches, with the command in Brad’s lab and on Care4Mind’s front-end branch.

| Check | What it catches | Lab | Care4Mind front end |
|---|---|---|---|
| **Typecheck** | Code that breaks TypeScript’s type rules. In the lab it’s `tsc --noEmit`: the compiler, with no output files. | `npm run typecheck` | `pnpm typecheck` |
| **Tests** | Code that doesn’t do what a test says it should | `npm test` | `pnpm test` (Vitest) |
| **Lint** | Broken rules about style and risky patterns. Care4Mind’s include accessibility rules. | Not in the lab | `pnpm lint` (ESLint) |
| **Build** | Code that can’t be compiled for production | `npm run build` | `pnpm build` |

Tests catch what types can’t. In Brad’s gate test he writes a test for a new `/api/version` endpoint before the endpoint exists. Types and build are fine, but the test calls the endpoint, gets no version back, and goes red.

Fowler adds two cautions that matter more with agents, not less. Keep the build fast: the point is rapid feedback, and ten minutes is his reasonable target. And integrate for real. Checks on a branch are useful, but they aren’t continuous integration until the work lands in `main`, and a PR that waits days for review breaks the rhythm. For you, that means small PRs from agents, merged quickly, not a week-long branch with perfect checks.

```callout remember
CI means landing small changes in `main` often, with a machine checking each one: types, tests, lint, build. Green means the checks found nothing, not that the code is right.
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

## CD: delivery or deployment

The CD in CI/CD has two meanings, and the difference is one human click. **Continuous delivery** means the software is always ready to go live, but a person decides when, and clicks. Fowler’s test is that someone could ask for the current version in production at a moment’s notice and nobody would worry. **Continuous deployment** goes one step further: every change that passes the gates goes live by itself. You can’t do the second without the first.

|  | Continuous delivery | Continuous deployment |
|---|---|---|
| After the gates pass | Ready to go live | Goes live |
| Who decides when | A person, with a click | Nobody: it’s automatic |
| Brad’s words | “it does need that human” | “it happens automatically once those required checks pass” |

Brad’s definitions match Fowler’s, and he says his project uses continuous deployment. Then he slips. Setting up Render, he leaves Auto-Deploy on “On Commit” and rightly calls it continuous deployment, but later in the same chapter he says “And again, continuous delivery”, because each push now deploys automatically. By his own definition that’s continuous deployment: no human decides. People say “CD” for both, so when you prompt an agent, say the full word.

This course uses continuous deployment behind a gate. On Vercel a deployment goes live only when it is **promoted**: given the production domain. So “deployed” doesn’t mean “live”. When a PR merges into `main`, Vercel builds a production deployment, holds it until GitHub’s `check` passes on that commit, then promotes it with nobody clicking. Care4Mind will run the same way once its gates are on (Lessons 12 and 16).

```callout remember
Delivery: always ready, and a person clicks to go live. Deployment: every change that passes the gates goes live by itself. This course runs continuous deployment, held back by a check.
```

```checkpoint check-6
On this course’s repo, a merged PR’s `check` passes and the new lesson goes live with no one clicking. Which is that?
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
Say Care4Mind’s client wants the site always ready to ship, but wants a person to approve every release. Which fits?
- [ ] Continuous deployment
- [x] Continuous delivery
- [ ] Continuous integration
- [ ] Manual builds
Why: Delivery keeps every change ready to go live and leaves the click to a person. Deployment would remove that click. CI alone says nothing about releasing.
```

## Where checks run: a fresh machine every time

A **runner** is the machine that runs a CI **job**: a set of steps that run in order on that one machine. A **workflow** (the YAML file in `.github/workflows/`) picks one with `runs-on`; this course’s says `ubuntu-latest`. On GitHub-hosted runners, each job gets a brand-new virtual machine (VM) in GitHub’s cloud, with Linux and common tools preinstalled. In Brad’s lab, the job checks out the code, sets up Node, installs the dependencies and runs the checks. Then the VM is thrown away.

Why bother, when the agent already ran the checks on your laptop? Because your laptop has history, and “works on my machine” is a well-known phrase for a reason. The runner has none of it. It gets the one commit being checked, the dependencies the lockfile lists, and GitHub’s standard tools. Three ways a change can pass on your laptop and fail there:

- **An uncommitted file.** Say the agent creates `src/lib/scales.ts`, imports it, and forgets to commit it. Your folder has the file, so everything passes. The runner has only the commit, so the import fails.
- **A missing dependency.** A package sits in your `node_modules` but was never added to `package.json` and the lockfile. CI installs from the lockfile alone, so the package isn’t there.
- **A different Node version.** Your machine runs Node 22. Care4Mind’s front-end workflow reads `.nvmrc`, which says 24, so CI runs Node 24. Code that depends on one version’s behaviour passes in one place and fails in the other.

GitHub Actions isn’t the only CI service. Brad names Jenkins, CircleCI and Travis CI: they differ in setup, but all of them run checks automatically whenever the code changes. This course uses GitHub Actions only.

Tests that need a real database get a throwaway one too. A workflow can start **service containers**: Docker containers beside the job, created fresh for it and destroyed when it ends. You know the shape from Docker Compose: a `services` block names an image such as `postgres`, and the job reaches it over the network. Think of it as a Compose file that lives for one job.

Care4Mind’s data will live in Neon, which offers a second route: a Neon branch, a copy-on-write clone of the database that Neon’s GitHub Actions can create for a pull request and delete afterwards. Lesson 16 shows Neon’s other use: a branch of its own for every preview deployment, made through Neon’s Vercel integration.

```callout remember
CI runs on a new machine that gets the commit and the locked dependencies, nothing from your laptop, and is thrown away afterwards. A pass there can’t depend on leftovers.
```

```checkpoint check-9
An agent’s PR passes `npm run verify` on your laptop, but CI fails with “Cannot find module ./scales”. What’s the most likely cause?
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
Your tests need a throwaway Postgres for one CI job. What does GitHub Actions offer?
- [ ] A shared database for everyone
- [ ] Your laptop’s database over SSH
- [x] A service container per job
- [ ] A permanent Neon production branch
Why: A service container is a Docker container started beside the job and destroyed when it ends, like a Compose service that lives for one job. A Neon branch is Care4Mind’s other route, but a short-lived one, not production.
```

## The verify script: one command everywhere

Brad’s starter app already has three checks as separate npm scripts. His first change is to add a fourth script that runs all three:

```diff
"scripts": {
  "dev": "tsx watch src/server.ts",
  "typecheck": "tsc --noEmit",
  "test": "node --import tsx --test test/app.test.ts",
  "build": "tsc",
  "start": "node dist/server.js",
+  "verify": "npm run typecheck && npm test && npm run build"
}
```

`&&` means “run the next command only if this one succeeded”. So `npm run verify` either runs all three and passes, or stops at the first failure with an error, and you see the first real problem rather than its knock-on errors.

Why one script instead of three commands? Because three callers run it, and they should all mean the same thing by “passed”. The agent runs it before it says it’s done, you ask for its output before you review, and CI runs it on every pull request. Fowler asks that anyone with a clean machine can check out the code and build it with a single command; this is the single command for checking it. And when CI goes red, the agent reproduces the failure with that same command.

In Brad’s workflow, the last two steps are just this:

```text
      - name: Install dependencies
        run: npm ci

      - name: Verify application
        run: npm run verify
```

`npm ci` is `npm install` for machines. It needs a lockfile, clears out `node_modules`, and installs exactly the locked versions. If `package.json` disagrees with the lockfile, it stops with an error instead of quietly updating it. Same commit, same versions, every run. Care4Mind’s front end uses pnpm, and its workflow does the same with `pnpm install --frozen-lockfile`.

One trap before the lab. Brad’s `package.json` declares Node 24 in its `engines` field. That records which Node the project expects, but npm treats it as advice and doesn’t change the Node you have. Your machine runs Node 22, so `npm run verify` on your laptop would use 22 while CI uses the 24 its workflow asks for. The fix, as Brad’s gist says, is to install or switch to Node 24 before you start.

You’ve already met one. This course’s check, `node scripts/check-course.mjs`, is the same command on your laptop and in `check.yml`. Care4Mind’s front-end branch has the parts (lint, formatting, typecheck, tests, build) but no single command: its README lists them one by one, and its CI runs them as separate steps. [Lesson 16](/learn/your-projects-pipeline) closes that gap.

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

A change an agent writes passes four stops on its way to users. They are also the map of Part 3.

1. **1. Pre-commit hook** (Your laptop, at commit): `npx lint-staged
npm run typecheck
npm run test`
   - A **hook** is a script git runs at a set moment. A pre-commit hook runs before each commit, and if it fails, there’s no commit. Matt’s `setup-pre-commit` skill writes these three lines: format the staged files with Prettier, then typecheck, then test.
2. **2. Required check** (GitHub, before merge)
   - The workflow runs the checks on a fresh runner for every PR. A **ruleset** on `main` makes the check required: no green, no merge. This course’s “Protect main” requires `check`. Lesson 12 sets one up.
3. **3. Review and preview** (You, before merge)
   - You read the PR and open its **preview deployment**: the temporary copy of the site for that branch, with its own URL. A person decides here, so it isn’t a gate in this course’s sense. It’s the part machines can’t do. [Lesson 12](/learn/gates) nicknames it the look gate, because you hold it, but nothing automatic blocks there.
4. **4. Deployment Check, then promote** (Vercel, before release)
   - After the merge, Vercel builds the production deployment and holds it until the required checks pass on `main`. Then it promotes it. “Force Promote” skips the wait. Lesson 12 sets this up too.

Stop 1 is the fastest feedback, before anything leaves the laptop. But anyone, an agent included, can skip it with `git commit --no-verify`, so treat it as a convenience. The gates that hold are stops 2 and 4. They run on GitHub and Vercel, not on the machine the agent works in, and switching them off takes a deliberate settings change, not a flag.

The same check counts twice: GitHub’s `check` blocks the merge, and Vercel waits for it again on `main` before promoting. Both find it by the job’s name, so rename the job and neither finds it until the ruleset and the Deployment Check are updated. Brad builds the same two layers with Render: a ruleset on GitHub, and Render’s “After CI Checks Pass” setting.

From here Part 3 goes stop by stop. [Lesson 11](/learn/reading-a-workflow) reads a workflow line by line, [Lesson 12](/learn/gates) wires stops 2 to 4, and [Lesson 13](/learn/lab-gated-pipeline) is the lab: you build it all yourself on Brad’s starter app, with Vercel in place of Render.

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
You rename the course workflow’s job from `check` to `verify`. What else must change?
- [ ] Nothing, since names are only labels
- [ ] Only the URL of each preview
- [ ] The runner image named in `runs-on`
- [x] The ruleset and the Deployment Check
Why: Both gates find the check by the job’s name. After a rename, the ruleset and Vercel’s Deployment Check must be updated to the new name, or neither finds it.
```

```checkpoint check-17
Which of the four stops is not a gate, in this course’s sense?
- [ ] Pre-commit hook
- [ ] Required check
- [x] PR review
- [ ] Deployment Check
Why: A gate is automatic. At the review a person decides, which is the part machines can’t do. The other three are automatic, though the pre-commit hook can be skipped.
```

## Tell your agent

Use this on Brad’s starter app in the Lesson 13 lab. Care4Mind’s verify script, which adds lint, comes with its first code PR in [Lesson 16](/learn/your-projects-pipeline).

```text
Add a verify script to package.json that runs typecheck, tests and build in that order, stopping at the first failure. Use the package manager this repo already uses. Run it and show me the output. Don’t change the CI workflow yet; just tell me whether it runs the same checks.
```

## Try it

These four commands only look; they change nothing. The first two read this course’s own pipeline, the last two Care4Mind’s.

```sh
gh run list -R SiddharthMuramkar/learn-matt-flow --limit 5
cat ~/Desktop/learn-matt-flow/.github/workflows/check.yml
gh run list -R SiddharthMuramkar/care4mind --limit 5
git -C ~/Desktop/project1 show origin/SiddharthMuramkar/frontend:.github/workflows/ci.yml
```

The first lists recent runs: status (a tick means passed), title, workflow, branch, event, ID, time taken and age. On 27 October there was one, “chore: put the course under git”, a `push` to `main` that passed in 11 seconds. By now you may also see `pull_request` runs. In `check.yml`, find `runs-on: ubuntu-latest` (the fresh VM), `node-version: 24` and `run: node scripts/check-course.mjs` (the single command), in a job named `check`: the name both gates wait for. For Care4Mind, `gh run list` should say `no runs found`, and the workflow file shows why: it runs on `pull_request` and on `push` to `main`, and neither has happened for that branch yet.

## Check yourself

From memory, without scrolling up.

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
On this course’s repo, a merged change’s `check` fails on `main`. What do readers of the live site see?
- [ ] The new version, live at once
- [ ] An error page until it passes
- [x] The previous version, still live there
- [ ] A preview deployment of the change
Why: Vercel builds the new production deployment but doesn’t promote it until the check passes, so the domain keeps serving the last promoted one.
```

```final-test final-22
Care4Mind’s tests will need a real Postgres in CI. Which two options did this lesson name?
- [ ] Your laptop or the production database
- [x] A service container or Neon branch
- [ ] A pre-commit hook or a ruleset
- [ ] Render’s free tier or Travis CI
Why: A service container is a throwaway Docker Postgres for one job. A Neon branch is a copy-on-write clone that Neon’s actions can create for a PR and delete afterwards. Either works for a CI job.
```

## Watch next

**Watch:** [“CI/CD Made Simple: Build a Real Pipeline”](https://www.youtube.com/watch?v=B7GM6F3BP6A), Brad Traversy’s 35-minute crash course (Traversy Media, 5 October 2026). Watch from “What Is CI/CD?” at 1:24 to the end of “Our Verify Script” at 10:46, about nine minutes. The slip about continuous delivery is in “Deploy To Render”, from 12:00.

**Read:** [Martin Fowler, “Continuous Integration”](https://martinfowler.com/articles/continuousIntegration.html): the definition at the top and the story “Building a Feature with Continuous Integration”, about five minutes. It follows one change from a laptop through the CI service, “works on my machine” included.

Keep the CI/CD cheat sheet open for the rest of Part 3.

```sources
- [CI/CD Made Simple](https://www.youtube.com/watch?v=B7GM6F3BP6A)
- [Martin Fowler, Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html)
- [GitHub Docs, Continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration)
- [TypeScript docs, noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html)
- [Brad’s gist](https://gist.github.com/bradtraversy/b6b1e16322cf60d8f41fbda71b1c607e)
- [Martin Fowler, ContinuousDelivery](https://martinfowler.com/bliki/ContinuousDelivery.html)
- [Vercel Docs, Deployment Checks](https://vercel.com/docs/deployment-checks)
- [GitHub Docs, GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners)
- [GitHub Docs, Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [GitHub Docs, Self-hosted runners](https://docs.github.com/en/actions/concepts/runners/self-hosted-runners)
- [Traversy Media, CI/CD for Beginners](https://www.traversymedia.com/blog/ci-cd-for-beginners-build-a-github-actions-and-render-pipeline)
- [actions/checkout README](https://github.com/actions/checkout)
- [GitHub Docs, Communicating with Docker service containers](https://docs.github.com/en/actions/tutorials/use-containerized-services/use-docker-service-containers)
- [Neon Docs, Branching](https://neon.com/docs/introduction/branching)
- [Neon Docs, Automate branching with GitHub Actions](https://neon.com/docs/guides/branching-github-actions)
- [Brad’s starter](https://github.com/bradtraversy/cicd-lab-starter)
- [npm Docs, npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)
- [pnpm Docs, pnpm install](https://pnpm.io/cli/install)
- [npm Docs, package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- [setup-pre-commit skill](https://github.com/mattpocock/skills/blob/main/skills/misc/setup-pre-commit/SKILL.md)
- [githooks docs](https://git-scm.com/docs/githooks)
```
