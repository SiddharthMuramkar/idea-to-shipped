---
title: Setting up your own project's pipeline
slug: your-projects-pipeline
summary: Plan the pipeline for your own Next.js project on Vercel: one verify script, when each gate goes on, preview tests, a database per preview, and your agent's prompt.
---

The lab gave you a gated pipeline on a toy app. Your own project is bigger. Say it's `recipes`: a Next.js site on Vercel, with its recipes in a Postgres database. Link that repo to Vercel, and by default every merge to `main` goes live with nothing holding it. Switch on every possible check at once, and the gates block you for reasons nobody cares about. This lesson is the plan in between: which gates to switch on, in what order, and the prompt that sets up the first ones.

```goals
- Take stock of your project's pipeline today, with a few read-only commands.
- Write one `verify` script for a Next.js app, and run it in three places.
- Test the running preview, and give each preview a database of its own.
- Say when each gate goes on and what it blocks, and hand your agent the prompt for the first ones.
```

## Take stock: what your project has today

Start from what is actually there. Many projects reach this point with good habits and nothing that enforces them. Here is what a made-up `recipes` repo might show, and how to check yours:

| Part | How to check | What you might find | So |
|---|---|---|---|
| Merging | `gh api repos/OWNER/recipes --jq '{allow_squash_merge, allow_merge_commit, delete_branch_on_merge}'` | Squash merges by habit, but merge commits still allowed | The habit is right; the settings still offer other buttons |
| Rulesets | `gh api repos/OWNER/recipes/rules/branches/main` | `[]` | Anyone, agents included, can push straight to `main` |
| Workflows | `ls .github/workflows` | Nothing, or a workflow on a branch that hasn't merged | No check exists for a gate to require |
| Vercel | Project Settings → Git, then Build and Deployment | Linked to the repo, production branch `main`, no Deployment Checks | A merge to `main` goes live unchecked |
| Scripts | `npm pkg get scripts` | `lint`, `typecheck`, `test` and `build`, but no `verify` | The pieces exist, but no one command runs them all |

**Turn each gate on when there's something real for it to check, starting with your first code pull request.**

The Vercel row matters most. Once Vercel is linked to the repo, every push to the production branch makes a production deployment. By default, Vercel promotes the newest good one straight away. Vercel's own Lint and Typecheck checks, if you've added them, run only those two scripts, never your tests. So when your first code pull request merges, it goes live with nothing holding it.

One more thing to look for: branches that never merge, such as notes or experiments. A ruleset that targets `main` never touches them. Vercel does: it makes a preview deployment for every push to every branch. The project's **Ignored Build Step** setting runs a command before each build, and cancels the build when the command exits with 0. For example, to skip branches whose names start with `notes/`:

```sh
if [[ "$VERCEL_GIT_COMMIT_REF" == notes/* ]]; then exit 0; else exit 1; fi
```

```callout remember
With no ruleset, no workflow and no Deployment Check, a linked Vercel project puts every merge live unchecked. The first code pull request is where the pipeline starts. A ruleset on `main` leaves other branches alone; Vercel builds them unless you tell it not to.
```

```checkpoint merge-tomorrow
Your `recipes` repo is linked to Vercel, with no other gates. If your first code pull request merged tomorrow, what would happen on Vercel?
- [ ] Nothing, until someone deploys by hand
- [x] It builds `main` and promotes it
- [ ] It builds `main`, then holds it
- [ ] It refuses, since no check exists
Why: The Git link makes every push to `main` a production deployment, and Vercel promotes the newest good one by default. Holding it is exactly what a Deployment Check would add.
```

```checkpoint ruleset-notes-branch
With a ruleset on `main` only, an agent pushes notes to `notes/meeting`. What does the ruleset do?
- [ ] Blocks the push until `Verify` passes
- [ ] Asks for a pull request first
- [x] Nothing, because it covers `main` only
- [ ] Deletes the branch after the push
Why: A ruleset applies only to the branches it targets. Vercel is what reacts to that push, by starting a preview build, unless the Ignored Build Step cancels it.
```

```checkpoint nothing-to-require
Which of these findings means there's nothing yet for a gate to require?
- [ ] No ruleset protects `main` yet
- [ ] Merge commits are still allowed
- [ ] Vercel's own checks block nothing
- [x] No workflow produces a check
Why: A gate requires a check by name, and checks come from workflow jobs. With no workflow, a ruleset or a Deployment Check would have nothing to wait for.
```

## The whole chain, in order

Before you switch anything on, see every check between an agent's first commit and a live page. Only some of them block:

| Where | What | What it blocks | How it's skipped |
|---|---|---|---|
| Inside the agent's session | [tdd](/learn/tdd), the typecheck and tests, [code-review](/learn/code-review) | Nothing: they're habits, judged by the agent | The agent leaves them out |
| On the machine that commits | A pre-commit hook ([setup-pre-commit](/learn/setup-pre-commit)) | The commit | `git commit --no-verify` |
| GitHub, before the merge | The required check, `Verify` | The merge | An admin switches the ruleset off |
| Vercel, while the pull request is open | The preview deployment | Nothing by itself: you are the gate | Merging without looking |
| Vercel, after the merge | Deployment Checks | Going live | Force Promote |

When all of them miss something, there's the undo. Instant Rollback points production back at an earlier deployment, then a revert pull request fixes `main`. [Gates: checks that block](/learn/gates) covers each one.

```checkpoint agent-skips-alone
Which of these can an agent skip on its own, without anyone switching a gate off?
- [x] The pre-commit hook, with `--no-verify`
- [ ] The required check, on its pull request
- [ ] The Deployment Check, on production
- [ ] Your review of the preview deployment
Why: `git commit --no-verify` skips the hook, and nothing on GitHub notices. The required check and the Deployment Check sit outside the agent's machine, and the preview review is yours.
```

## One verify script, three places to run it

The first gate needs a check, and the check needs one command to run. A **verify script** is one script in `package.json` that runs every fast check in order, and stops at the first failure. You met Brad's in the [lab](/learn/lab-gated-pipeline). For a Next.js app it has four steps:

```json
"verify": "npm run typecheck && npm run lint && npm test && npm run build"
```

With pnpm, write `pnpm run` in place of each `npm run`. Here is what each step typically runs:

| Step | A typical script | What it catches |
|---|---|---|
| Typecheck | `next typegen && tsc --noEmit` | Type errors, including in the route types Next.js generates |
| Lint | `eslint .` | Mistakes the type checker allows, plus accessibility rules for markup, such as `jsx-a11y` |
| Unit tests | `vitest run` | Logic that needs no browser, such as scaling a recipe's amounts |
| Build | `next build` | Anything that breaks only in a production build |

Two details trip up agents that learned an older Next.js. First, Next.js 16 removed `next lint`, and `next build` no longer lints. Linting runs through ESLint as a step of its own, so a green build no longer means lint passed. Second, the typecheck runs `next typegen` before `tsc --noEmit`. Next.js generates types for your routes, and before `next typegen`, only `next dev` or `next build` made them. So `tsc` on its own couldn't check them.

The order is deliberate. The quick checks run first and the slow build last, and `&&` starts each step only if the one before it passed. A type error fails in seconds, not after a full build.

The point of one script is that the same command runs in three places:

- On the agent's machine, before it opens a pull request. Matt's [implement](/learn/implement) skill has the agent typecheck and test as it goes, then run the full suite at the end. `npm run verify` is that last run, with lint and build added.
- In CI, as one job named `Verify` in `.github/workflows/ci.yml`, on every pull request and every push to `main`. The lab's workflow fits, set to your project's Node version. Its name is the check both gates will require.
- On Vercel, in part. Vercel's native Deployment Checks can run your `lint` and `typecheck` scripts on each deployment. They never run your tests.

One script means a green run on the agent's machine predicts a green check in CI, and a red check can be rerun exactly. If CI listed its own steps, the two lists would drift apart. If you use Vercel's native checks, leave them running but not required. They repeat part of `verify`, and the check Vercel should wait for is GitHub's `Verify`, the only one that runs the tests.

```callout remember
`npm run verify` runs typecheck, lint, unit tests and build, and stops at the first failure. The same command runs on the agent's machine, in CI as the job `Verify`, and partly on Vercel. In Next.js 16 the build doesn't lint, so lint is a step of its own.
```

```checkpoint lint-error-next16
An agent's pull request passes `next build` but leaves an ESLint error. On Next.js 16, which step reports it?
- [ ] The build step, which lints first
- [ ] The typecheck step, through `next typegen`
- [ ] Vercel's preview build log, every time
- [x] Only the lint step, run on its own
Why: Next.js 16 removed `next lint`, and `next build` no longer lints. Only the separate `eslint .` step sees the error, which is why lint sits in `verify` as its own step.
```

```checkpoint ci-runs-verify
Why should the CI job run `npm run verify`, instead of listing the four steps itself?
- [ ] A listed version would run faster
- [x] So local runs and CI runs match
- [ ] GitHub allows one command per job
- [ ] Vercel reads the job's step names
Why: One command everywhere means a local pass predicts a CI pass, and a red check can be rerun exactly. Two separate lists drift apart. Speed and GitHub's limits have nothing to do with it.
```

```checkpoint native-checks-replace
Could Vercel's native Lint and Typecheck checks replace the CI `Verify` job?
- [x] No: they never run your tests
- [ ] Yes: they run every package script
- [ ] Yes, once they're set to required
- [ ] No: they only run on previews
Why: Native checks run only the `lint` and `typecheck` scripts, and Vercel doesn't run your tests. They can run on production deployments too, so the last option is wrong.
```

## Checks against the live preview

`verify` checks the code on a runner. Some problems show only on the running site: a button off-screen at phone width, a tap target too small, a slow first paint. Three tools test the running site:

| Tool | What it does | A typical setup |
|---|---|---|
| Playwright | Drives real browser engines (Chromium, Firefox, WebKit) through scripted visits | Tests at several widths, such as 360, 768 and 1440 px. The config reads the preview's URL from a variable such as `PLAYWRIGHT_BASE_URL`, and tests a local build without one. |
| axe | Scans each page for WCAG failures, through `@axe-core/playwright` | A test helper that asks for the `wcag22aa` tag |
| Lighthouse CI | Audits each page several times, and fails the run when a budget is missed | A budget file, such as `lighthouserc.cjs`: LCP ≤ 2,500 ms, CLS ≤ 0.1, TBT ≤ 200 ms, accessibility score ≥ 0.95 |

**WCAG** (the Web Content Accessibility Guidelines) is the standard that accessibility checks test against. Two details about axe earn their place. axe finds, on average, about 57% of WCAG issues by itself; the rest need a person. And WCAG 2.2's rule on target size (tap targets at least 24 by 24 CSS pixels) is off by default. It runs only when the test asks for the `wcag22aa` tag, and Playwright's own documented example doesn't ask.

Lighthouse's numbers need defining. **LCP** (Largest Contentful Paint) measures how fast the biggest piece of content appears. **CLS** (Cumulative Layout Shift) measures how much the layout jumps. The budget above sets both at Google's thresholds for "good".

**INP** (Interaction to Next Paint) measures how fast the page reacts to a tap or click. Lighthouse loads pages with no user, so it can't measure INP. Its stand-in is **TBT** (Total Blocking Time): how long the page was too busy to respond. Real INP comes only from real visitors, after launch.

How does a workflow find the preview? Vercel tells GitHub. A **repository_dispatch** event is one that something outside GitHub sends to start workflows. Vercel sends one each time a deployment's status changes. A workflow that listens for `vercel.deployment.success` starts once a preview has finished building, and reads its URL from `github.event.client_payload.url`.

Previews ask for a Vercel login, so the runner needs a way past it. Vercel's answer is Protection Bypass for Automation: a secret your Playwright config sends with each request. Here is the shape, after Vercel's examples. It's a sketch to hand your agent, not a tested file:

```yaml
on:
  repository_dispatch:
    types:
      - 'vercel.deployment.success'

jobs:
  e2e:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      actions: read
      statuses: write
    steps:
      - uses: vercel/repository-dispatch/actions/status@v1
        with:
          name: 'e2e (${{ github.event.client_payload.environment }})'
      - uses: vercel/repository-dispatch/actions/checkout@v1
      # … set up Node, install, install the browsers …
      - run: npm run test:e2e
        env:
          PLAYWRIGHT_BASE_URL: ${{ github.event.client_payload.url }}
          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
```

Three traps sit in that small file, and each one explains a line of it:

1. It runs on the wrong commit unless told otherwise. GitHub runs a `repository_dispatch` workflow against the latest commit on `main`, not the pull request's commit. The checkout action fetches the deployed commit instead. The status action posts the result on that commit, where the pull request and Vercel look for it, hence `statuses: write`.
2. It can't test the pull request that adds it. The event starts a workflow only if the file is already on `main`. So the e2e workflow lands in one pull request, and first runs on the next.
3. Your project may not send the events. Vercel's API calls the setting `disableRepositoryDispatchEvents`, and it must be `false`. If it's `true`, the workflow never starts.

One more distinction, for the day you want these tests to hold production, not only a pull request. For production, `vercel.deployment.success` arrives after promotion, too late to hold anything. A Deployment Check needs `vercel.deployment.ready`: built, not yet promoted. That's also why the status name includes the environment, so a preview run and a production run don't write over each other.

```callout remember
Playwright, axe (with `wcag22aa`) and Lighthouse CI test the running site, not the code. Vercel starts them with a `repository_dispatch` event that carries the URL. The status action puts the result on the right commit, and the workflow must already be on `main`.
```

```checkpoint small-close-button
A new page on your `recipes` site has a 16 px close button. Which check can flag it, and what does it need?
- [x] axe, with the `wcag22aa` tag requested
- [ ] Lighthouse, with a CLS budget set
- [ ] ESLint, with the Next.js rules on
- [ ] TypeScript, with route types generated first
Why: WCAG 2.2's target-size rule wants at least 24 by 24 CSS pixels. axe has that rule, but runs it only when the `wcag22aa` tag is requested. CLS measures layout jumps, not sizes.
```

```checkpoint e2e-never-starts
Your agent merges the e2e workflow, but no preview ever starts it. What do you check first?
- [ ] Whether the Lighthouse budgets are set to warn
- [x] Whether Vercel sends repository dispatch events
- [ ] Whether the ruleset requires the e2e result
- [ ] Whether Playwright supports the WebKit engine
Why: If the project's `disableRepositoryDispatchEvents` is `true`, Vercel sends no events, and the workflow never starts. The ruleset only reads results; it can't start anything.
```

```checkpoint hold-production-event
You want e2e results to hold your production release. Which event should that workflow listen for?
- [ ] `vercel.deployment.success`, after promotion
- [ ] `vercel.deployment.promoted`, after promotion
- [ ] `vercel.deployment.pending`, before building
- [x] `vercel.deployment.ready`, before promotion
Why: `ready` means built but not yet promoted, so the check can still hold it. For production, `success` and `promoted` arrive after promotion, and `pending` has no build to test.
```

## A database branch for every preview

Say `recipes` keeps its recipes in Postgres on Neon, a hosted Postgres service. Previews then raise a question: which database does a preview talk to? If it's production's, a **migration** (a change to the database's structure, such as adding a column) tried on a preview runs against real data. Neon's answer is a branch. A **Neon branch** is a copy-on-write clone of a database. It's made at once and starts with all its parent's data, but changes to it never touch the parent.

1. An agent pushes to a pull request's branch. Vercel starts a preview deployment, as it does for every push.
2. Neon's integration hears about the deployment, and creates a branch named `preview/<git-branch>`, copied from the project's default branch.
3. Vercel hands that branch's `DATABASE_URL` to this one deployment only. If the build command runs migrations first, they change the copy, and tests on the preview hit the copy too.

Production keeps one fixed Neon branch, chosen when you connect. Every pull request gets a database of its own that it can break freely. That's the whole point: migrations and tests touch a copy, never production's data.

Neon connects to Vercel in two ways. Neon-Managed links an existing Neon account, and keeps billing with Neon. Vercel-Managed creates the database through Vercel, and bills it there. If you might hand the project to someone else one day, note that Neon's project transfer doesn't work for a Vercel-Managed database.

When you connect Neon-Managed, turn on "Automatically delete obsolete Neon branches". It deletes a preview branch once its Git branch is gone, checked at the next preview deployment. GitHub can delete pull request branches on merge, so the two work together. Without the setting, old preview branches pile up and count against your plan's limit.

One caution. A copy protects production from the preview, not the data from whoever opens the preview. A preview branch starts as a full copy of the project's default branch, which is production's unless you pick another. So anything private there is in every preview too, including copies of user accounts if Neon's own sign-in is used. Keep previews behind a login, which Vercel's Standard Protection does by default.

```callout remember
Once your project has a database, connect Neon to Vercel so each preview gets its own `preview/<git-branch>` branch. Migrations and tests then touch a copy, never production. The copy still holds production's data, so previews stay behind a login.
```

```checkpoint migration-runs-where
An agent's pull request adds a migration that drops a column, and the build command runs migrations. With preview branching on, where does it run first?
- [ ] On production, the moment it merges
- [x] On that pull request's own preview branch
- [ ] On your laptop's local database only
- [ ] Nowhere, until someone runs it by hand
Why: The preview deployment gets `DATABASE_URL` for its own `preview/<git-branch>` branch, so the migration in the build changes that copy. Production is untouched until the pull request merges.
```

```checkpoint delete-obsolete-branches
Why turn on "Automatically delete obsolete Neon branches" when you connect?
- [ ] Neon refuses new previews without it
- [ ] Production reads from stale preview branches
- [x] Old branches count against your plan's limit
- [ ] Old branches show their data to visitors
Why: Stale preview branches count toward your plan's branch limit. Production never reads them, and they show nothing that the preview login doesn't already guard.
```

## The order to switch gates on

Each gate goes on when there's something real for it to check. Too early, and it blocks everything, or fails for reasons nobody cares about. A gate that people learn to ignore is worse than none. Here is the order for a typical Next.js project on Vercel:

| Gate | When | What it blocks |
|---|---|---|
| `Verify` job in `ci.yml` | Your first code pull request | Nothing alone: it makes the check the next gates require |
| Ruleset "Protect main" | The same pull request, once `Verify` has run | Pushing to `main`; merging while `Verify` is red |
| Vercel's Git connection | Usually linked already: confirm it | Nothing: it gives every pull request a preview, the look gate |
| Deployment Check on `Verify` | The same pull request, before it merges | Promoting a production build whose `Verify` failed |
| Playwright and axe on previews | Once pages exist, often the pull request after the first | Nothing while report-only; once required, merging |
| Lighthouse CI budgets | When the design settles | Once required, merging a pull request that misses a budget |
| A Neon branch per preview | When a database arrives | Nothing: it keeps migrations and tests off production data |

Three of these have hard reasons behind their place. The ruleset comes after `Verify` has run, because GitHub requires a check that passed in the repo within the past seven days. The Deployment Check must be in place before the first code pull request merges, or that merge goes live unchecked. And the e2e workflow can't arrive in a pull request and test that same one, because a `repository_dispatch` workflow starts only once it's on `main`.

Lighthouse budgets on a design that still changes every week would fail on changes you meant to make. The same rule covers every new check. Run it **report-only** first: it runs and shows its result, but no gate requires it. Once it has stayed green for a while, add it to the ruleset or the Deployment Checks.

```callout remember
Switch a gate on when there's something real for it to check. `Verify`, the ruleset and a Deployment Check go on with the first code pull request. Then e2e tests once there are pages, Lighthouse budgets when the design settles, and Neon branches when a database arrives. Run each new check report-only first, then require it.
```

```checkpoint ruleset-after-verify
Why does the ruleset go on only after `Verify` has run once?
- [x] GitHub needs a check that passed recently
- [ ] Rulesets can't exist on private repos
- [ ] Vercel must see the check first
- [ ] The job's name isn't fixed yet
Why: GitHub requires a required check to have passed in the repo within the past seven days. Private repos can have rulesets on paid plans, and Vercel plays no part in the ruleset.
```

```checkpoint e2e-same-pr
Why not add the e2e workflow in the first code pull request, and have it test that same pull request?
- [ ] Playwright can't run on GitHub's runners
- [ ] Vercel skips previews for first pull requests
- [ ] Rulesets block new workflow files outright
- [x] Dispatch events only run files already on `main`
Why: A `repository_dispatch` event starts a workflow only if the file is already on `main`. The first pull request is what puts it there, so the e2e workflow first runs on the next one.
```

### Practice: when does it go on?

For each piece of the pipeline, pick when to switch it on.

```checkpoint when-verify-job
A `Verify` job in `.github/workflows/ci.yml`
- [x] The first code pull request
- [ ] The pull request after that
- [ ] When the design settles
- [ ] When a database arrives
Why: It produces the check every other gate requires, so it comes first.
```

```checkpoint when-deployment-check
A Deployment Check that holds production until `Verify` passes
- [x] The first code pull request
- [ ] The pull request after that
- [ ] When the design settles
- [ ] When a database arrives
Why: Without it, the first code merge goes live unchecked.
```

```checkpoint when-e2e-report-only
Playwright and axe tests against each preview, report-only, when the first pull request already brings pages
- [ ] The first code pull request
- [x] The pull request after that
- [ ] When the design settles
- [ ] When a database arrives
Why: The workflow must be on `main` before a `repository_dispatch` event can start it.
```

```checkpoint when-lighthouse
Requiring the Lighthouse budgets: LCP 2.5 s, CLS 0.1 and TBT 200 ms
- [ ] The first code pull request
- [ ] The pull request after that
- [x] When the design settles
- [ ] When a database arrives
Why: On a design still changing, budgets fail on changes you meant to make.
```

```checkpoint when-neon-branches
Migrations in Vercel's build command, run against `preview/<git-branch>`
- [ ] The first code pull request
- [ ] The pull request after that
- [ ] When the design settles
- [x] When a database arrives
Why: With no database, there's nothing to migrate or branch.
```

## Conventions for agents: your call

Gates catch mistakes after an agent makes them. A few lines in your project's instruction file, such as `CLAUDE.md` or `AGENTS.md`, stop some being made at all. That file sits in the agent's context every session ([Instruction files](/learn/instruction-files)). Whether to add these lines is your call. For example:

```text
## Shipping
- Every change reaches main through a pull request; the "Protect main" ruleset enforces it.
- Run `npm run verify` and see it pass before opening a pull request. CI runs the same script as the Verify check.
- Each pull request covers one ticket. Name the ticket in the pull request body.
- Pull request titles follow Conventional Commits: `feat: …`, `fix: …`, `docs: …`.
```

Matt's [writing-for-agents](/learn/writing-for-agents) skill gives two tests for each line. First, write down only what the agent can't find by looking. Don't copy the scripts out of `package.json`, but do write the convention and the reason behind it. Second, say what to do rather than what not to do, because naming a forbidden action makes it more likely, not less. That's why the first line says every change reaches `main` through a pull request, instead of "never push to `main`".

The title line matters because of squash merging. With GitHub's default setting, a squash commit takes the title of the pull request's only commit, or the pull request's title when it has several. With agents making many commits, the pull request's title usually becomes the one line on `main`. **Conventional Commits** is one format for it: a type such as `feat` or `fix`, a colon, then a description. Plain sentences work as well. What matters is picking one and writing it down.

```callout remember
Instruction-file lines load in every session, so keep them few: conventions and reasons the agent can't find by looking, phrased as what to do. Whether to add them is your call.
```

```checkpoint line-that-earns
Which line earns a place in your project's instruction file?
- [ ] A copy of each `package.json` script
- [ ] The whole folder layout under `src/app`
- [x] Each pull request covers exactly one ticket
- [ ] The ESLint rules, restated in prose
Why: One ticket per pull request is a convention the agent can't discover from the repo. Scripts, folders and lint rules are already there to look up, so copying them only goes stale.
```

```checkpoint positive-phrasing
Why write "every change reaches `main` through a pull request" rather than "never push to `main`"?
- [ ] GitHub rejects negative lines in the file
- [x] Naming a ban makes that action likelier
- [ ] The ruleset reads the file before merges
- [ ] Positive lines take fewer tokens to load
Why: Matt's skill: a ban puts the forbidden action in the agent's context. Stating the target behaviour steers it straight there. GitHub and the ruleset never read the file.
```

## Tell your agent

Use this when your project's first code pull request is ready. It sets up the first gates, proves they hold, and only plans the later ones. Put your own names in place of `OWNER`, `recipes` and `BRANCH_NAME`.

```text
Set up the first gates for OWNER/recipes, as part of its first code pull request, from the branch BRANCH_NAME. Every change reaches main through this pull request.

1. Verify script. Add "verify": "npm run typecheck && npm run lint && npm test && npm run build" to package.json, using the scripts that already exist. Make typecheck run next typegen before tsc --noEmit. Run npm run verify and show me the end of the output.
2. CI. Add .github/workflows/ci.yml with one job, id verify and name Verify, on pull_request to main and on push to main: permissions contents: read, Node from engines or .nvmrc, npm ci, then npm run verify. If the branch already has a CI workflow, replace its check job with this one, and keep its other jobs running without requiring them. Push, open the pull request, and show me the green Verify check.
3. Merge gate. Once Verify has passed on the pull request, create a branch ruleset with gh api: "Protect main", default branch, active, require a pull request (0 approvals, squash only), require the Verify check from GitHub Actions, block force pushes, restrict deletions, empty bypass list. Turn off merge commits and rebase merging in the repo settings. GET both back and show me.
4. Release gate. Confirm the Vercel project is linked to this repo by Git, with production branch main and automatic production aliasing on, and that the pull request got a preview link. Add a Deployment Check from GitHub on Verify. If the API or CLI can't do a step, give me the exact dashboard steps.
5. Prove it. Push a commit with a deliberately failing unit test, and show me the red Verify check and the blocked merge. Revert that commit, then wait for me to merge. After I merge, show me the production deployment waiting for Verify before it was promoted.

Plan only, for the next pull request: an e2e workflow on vercel.deployment.success that checks out the deployed commit with vercel/repository-dispatch/actions/checkout, runs npm run test:e2e against client_payload.url with the automation bypass secret, and reports with vercel/repository-dispatch/actions/status. Check that the Vercel project's disableRepositoryDispatchEvents is false. The workflow stays report-only until I say to require it.

Ask me before you disable the ruleset, click Force Promote or merge anything. End with what you changed, the commands you ran, and anything you couldn't verify.
```

```checkpoint revert-failing-test
In step 5 of the prompt, the agent pushes a failing test, then reverts that commit before you merge. Why revert it?
- [x] So the failing test never reaches `main`
- [ ] So Vercel deletes the failed preview
- [ ] So the ruleset switches itself back on
- [ ] So GitHub forgets the red check ran
Why: The failing test was only there to prove the merge gate holds. Reverting it on the branch turns `Verify` green again, so what you merge is clean.
```

## Try it

````try
You need the GitHub CLI, signed in, and a terminal in your project's folder. These commands only read; they change nothing. Put your own names in place of `OWNER` and `recipes`.

1. Look for rules on `main`, and at the repo's merge settings:

```sh
gh api repos/OWNER/recipes/rules/branches/main
gh api repos/OWNER/recipes --jq '{visibility, allow_squash_merge, allow_merge_commit, delete_branch_on_merge}'
```

2. Look for workflows, and list the project's scripts:

```sh
ls .github/workflows 2>/dev/null || echo "no workflows yet"
npm pkg get scripts
```

You should see where your project starts. Before any gates, the rules call prints `[]`, and the folder check may say `no workflows yet`. The scripts list `lint`, `typecheck`, `test` and `build`, but no `verify`.

Run them again after your agent's first gates have merged. The rules list `pull_request` and `required_status_checks`, `allow_merge_commit` is `false`, `ci.yml` is listed, and `verify` appears among the scripts.
````

For where Vercel's job ends and GitHub Actions' begins, read Vercel's guide [How can I use GitHub Actions with Vercel?](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel), about twelve minutes. Vercel builds, previews and hosts; Actions runs what Vercel doesn't, such as tests, performance budgets and approval steps. Its parts on deploying from Actions with `--prebuilt` are for setups that skip Vercel's Git link, so skim those.

## Remember

```flashcards
Q: What does a linked Vercel project do with a merge to `main`, with no other gates?
A: It builds a production deployment and promotes it straight away. A Deployment Check is what makes it wait for `Verify`.

Q: What does a verify script for a Next.js app run, in which order?
A: Typecheck (`next typegen && tsc --noEmit`), lint (`eslint .`), unit tests, then `next build`, stopping at the first failure.

Q: Why is lint its own step in a Next.js 16 `verify`?
A: Next.js 16 removed `next lint`, and `next build` no longer lints, so a green build doesn't mean lint passed.

Q: Where does the same `verify` command run?
A: On the agent's machine before it opens a pull request, in CI as the job `Verify`, and partly on Vercel through native Lint and Typecheck checks.

Q: Why can't Lighthouse measure INP?
A: It loads pages with no user, so nothing taps or clicks. TBT is its stand-in; real INP comes from real visitors.

Q: Which three lines in a `repository_dispatch` e2e workflow fix its traps?
A: Vercel's checkout action (test the deployed commit), Vercel's status action with `statuses: write` (report on that commit), and the file must already be on `main`.

Q: Which Vercel event lets e2e results hold a production release?
A: `vercel.deployment.ready`: built, but not yet promoted. `vercel.deployment.success` arrives after promotion.

Q: What does a Neon branch per preview protect, and what doesn't it?
A: It keeps migrations and tests off production's data. It doesn't hide that data: the copy holds it, so previews stay behind a login.

Q: What does "report-only first" mean for a new check?
A: It runs and shows its result, but no gate requires it. Once it has stayed green for a while, add it to the ruleset or the Deployment Checks.
```

## Final test

```final-test drop-lint-next16
On Next.js 16, an agent removes `lint` from `verify`, because "the build lints anyway". What's wrong?
- [ ] Nothing: `next build` still runs ESLint
- [x] `next build` no longer runs linting
- [ ] ESLint now runs only on Vercel
- [ ] Linting moved into `next typegen`
Why: Next.js 16 removed `next lint` and stopped linting in `next build`. Without its own step, lint errors pass every gate.
```

```final-test first-pr-gate
Your first code pull request is green, and you're about to merge it. Which gate keeps it from going live unchecked?
- [ ] Lighthouse budgets on every page
- [ ] A Neon branch for each preview
- [ ] Playwright and axe on the preview
- [x] A Deployment Check on `Verify`
Why: A linked Vercel project promotes the newest good production build by default. Only a Deployment Check makes it wait for `Verify` on the merged commit.
```

```final-test tbt-no-inp
Lighthouse CI on a preview of your site reports TBT, but no INP. Why?
- [x] INP needs a real user's input
- [ ] INP only runs on production builds
- [ ] TBT was renamed INP in Lighthouse
- [ ] The budget file had no INP line
Why: Lighthouse loads pages with no user, so nothing is clicked or tapped. TBT is the lab stand-in; real INP comes from real visitors.
```

```final-test previews-need-login
Preview branching is on. Why must your previews still sit behind a login?
- [ ] Neon refuses connections from public URLs
- [ ] Vercel requires it for Deployment Checks
- [x] Previews hold copies of production data
- [ ] Migrations fail on unprotected previews
Why: A Neon preview branch starts as a full copy of the default branch, which is normally production's. So private data, and copies of user accounts, are in every preview.
```

```final-test e2e-result-missing
Your e2e workflow, started by `repository_dispatch`, passes, but the pull request never shows its result. What's missing?
- [ ] A `pull_request` trigger in the workflow
- [x] A status step on the deployed commit
- [ ] A second ruleset for other branches
- [ ] Vercel's native Lint check set to required
Why: A dispatch workflow runs against the latest commit on `main`, so its own result lands there. `vercel/repository-dispatch/actions/status` posts it on the commit Vercel deployed, which is where the pull request looks.
```

```final-test lighthouse-required-now
On your first code pull request, an agent proposes making Lighthouse CI a required check straight away, since its budget file marks every budget as an error. What do you tell it?
- [x] Run it report-only until the design settles
- [ ] Yes: require it with `Verify` today
- [ ] Drop it: Vercel already measures this
- [ ] Require it, but only on production
Why: Budgets on a design that still changes fail on changes you meant to make, and a gate people learn to ignore is worse than none. Only `Verify`, the ruleset and a Deployment Check go on with the first code pull request.
```

```final-test plain-checkout-dispatch
An agent tidies your e2e workflow, which runs on `repository_dispatch`, by swapping Vercel's checkout action for the usual `actions/checkout`. A pull request that adds a new Playwright test then gets a green e2e result. What did that run test?
- [ ] The pull request's tests, against its preview
- [ ] Production, since dispatch targets the domain
- [x] `main`'s tests, without the new one
- [ ] Nothing, because the run had no URL
Why: GitHub runs a `repository_dispatch` workflow against the latest commit on `main`, so plain `actions/checkout` fetches `main`'s files, tests included. The URL still points at the preview, but the new test never ran.
```

```final-test neon-branch-goes
Your project connects Neon-Managed, with "Automatically delete obsolete Neon branches" on. A pull request from `ticket-07` is squash-merged, and GitHub deletes the branch. When does the Neon branch `preview/ticket-07` go?
- [ ] The moment GitHub deletes the branch
- [x] At the next preview deployment
- [ ] Only when you delete it by hand
- [ ] When production is next promoted
Why: The cleanup deletes a preview branch once its Git branch is gone, but it checks only when the next preview deployment is created. Without the setting, the branch would stay and count against your plan's limit.
```

```final-test no-ruleset-red-check
None of your gates are on yet. An agent opens your project's first code pull request. One CI job shows a red ✗, yet the merge button is green. What stops a merge?
- [ ] GitHub, because the check is red
- [ ] Vercel, which holds the production build
- [ ] A pre-commit hook in the repo
- [x] Nothing but you: no ruleset exists
Why: With no ruleset, a red check is information, not a gate. Vercel promotes the newest good production build by default. You are the only gate, which is why `Verify`, the ruleset and a Deployment Check go on with this very pull request.
```

```sources
- [How can I use GitHub Actions with Vercel?](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel), Vercel KB
- [Deployment Checks](https://vercel.com/docs/deployment-checks), Vercel Docs
- [Native Deployment Checks are now available](https://vercel.com/changelog/native-deployment-checks), Vercel changelog, 2026-04-28
- [Deploying Git repositories](https://vercel.com/docs/git), Vercel Docs
- [Project settings](https://vercel.com/docs/project-configuration/project-settings), Vercel Docs
- [How do I use the Ignored Build Step field on Vercel?](https://vercel.com/kb/guide/how-do-i-use-the-ignored-build-step-field-on-vercel), Vercel KB
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github), Vercel Docs
- [How can I run end-to-end tests after my Vercel preview deployment?](https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment), Vercel KB
- [vercel/repository-dispatch](https://github.com/vercel/repository-dispatch), Vercel
- [Update an existing project](https://vercel.com/docs/rest-api/projects/update-an-existing-project), Vercel REST API
- [Deployment Protection](https://vercel.com/docs/deployment-protection), Vercel Docs
- [Upgrading to version 16](https://nextjs.org/docs/app/guides/upgrading/version-16), Next.js Docs
- [next CLI](https://nextjs.org/docs/app/api-reference/cli/next), Next.js Docs
- [pnpm run](https://pnpm.io/cli/run), pnpm Docs
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [axe-core README](https://github.com/dequelabs/axe-core/blob/develop/README.md), Deque
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md), Deque
- [Accessibility testing](https://playwright.dev/docs/accessibility-testing), Playwright Docs
- [Understanding Success Criterion 2.5.8: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), W3C
- [Web Vitals](https://web.dev/articles/vitals), web.dev
- [Total Blocking Time](https://web.dev/articles/tbt), web.dev
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), GitHub Docs
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), GitHub Docs
- [Troubleshooting required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks), GitHub Docs
- [Branching](https://neon.com/docs/introduction/branching), Neon Docs
- [Neon-Managed integration](https://neon.com/docs/guides/neon-managed-vercel-integration), Neon Docs
- [Vercel-Managed integration](https://neon.com/docs/guides/vercel-managed-integration), Neon Docs
- [Preview branch cleanup](https://neon.com/docs/guides/vercel-branch-cleanup), Neon Docs
- [writing-for-agents SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
- [About pull request merges](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges), GitHub Docs
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), Conventional Commits
```
