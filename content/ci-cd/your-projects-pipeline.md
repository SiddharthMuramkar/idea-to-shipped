---
title: Setting up your own project's pipeline
slug: your-projects-pipeline
summary: Describe Care4Mind’s target pipeline from pull request to production, say when each gate goes on and what it blocks, and hand your agent the one prompt that sets up the first gates when the first…
---

Care4Mind’s `main` is still all Markdown, but its first code already exists: a Next.js app on the `SiddharthMuramkar/frontend` branch, with Playwright, axe, Lighthouse and a CI workflow set up inside it. A Vercel project is linked to the repo too, so the day that branch merges, `main` will be built and put live with nothing holding it. This last lesson is the plan: which gates to switch on, in what order, and the one prompt that sets up the first of them.

```goals
- You’ll be able to describe Care4Mind’s target pipeline from pull request to production, say when each gate goes on and what it blocks, and hand your agent the one prompt that sets up the first gates when the first code PR opens.
```

## Where Care4Mind stands today

Start from what is actually there. Every row below comes from a read-only command run on 27 October, and the Try it section has the commands. The habits are already good; what’s missing is anything that _enforces_ them.

| Part | Today | So |
|---|---|---|
| Repo | Private `SiddharthMuramkar/care4mind`. `main` holds only Markdown and the agent setup: `AGENTS.md`, `GLOSSARY.md`, `docs/`, `.scratch/`. No `package.json`. | Nothing to build or test yet |
| Merging | Four PRs, all squash-merged, head branches deleted automatically. Merge commits and rebase merging are still allowed. | The habit is right; the settings still offer other buttons |
| Rulesets | None. The API returns `[]`. | Anyone, agents included, can push straight to `main` |
| Workflows | None on `main`: it has no `.github` folder. | No check exists for a gate to require |
| Vercel | Project `care4mind`, linked to the repo by Git, production branch `main`. One deployment so far, made from the command line. Native Lint and TypeCheck checks that block nothing. Repository dispatch events switched off. | A merge to `main` will build and go live unchecked |
| First code | A Next.js 16.4.3 app on `SiddharthMuramkar/frontend`, an Orca worktree with commits not yet pushed to GitHub. It brings its own `.github/workflows/ci.yml`: a job with id `check` and name “Lint, types and unit tests” (the name its check reports) running lint, format, types and unit tests, plus Playwright and Lighthouse jobs that test a build on the runner. | This branch becomes the first code PR, and brings the first workflow |

The Vercel row matters most. The project was linked on 27 October, and its only deployment so far was made by hand from the frontend branch, not by a push. But the link is live. Every push to the production branch, `main`, makes a production deployment, and by default Vercel promotes the newest good one straight away. Vercel added its own Lint and TypeCheck checks when the project was made, but both are set to block nothing. So when the frontend PR merges, Lesson 12’s warning comes true: it goes live with nothing holding it.

One more thing before any gate goes on: the ten `research/<slug>` branches. By your map’s rule they are pushed and never merged, so they never get a PR (Lesson 6). A ruleset that targets only `main` never touches them, and doesn’t need to. Vercel is the one that notices them. It makes a preview deployment for every push to any branch, so the next push to a research branch starts a build of a branch that holds only Markdown. The project’s **Ignored Build Step** setting runs a command before each build, and can cancel any build whose branch name starts with `research/`.

```callout remember
`main` has no ruleset, no workflow and no check that holds anything, yet Vercel is already linked: the first code PR is where the pipeline starts. A ruleset on `main` leaves the research branches alone; Vercel builds them unless you tell it not to.
```

```checkpoint check-1
If the frontend PR merged tomorrow with no other changes, what would happen on Vercel?
- [ ] Nothing, until someone deploys by hand
- [x] It builds main and promotes it
- [ ] It builds main, then holds it
- [ ] It refuses, since no check exists
Why: The Git link makes every push to `main` a production deployment, and Vercel promotes the newest good one by default. Lint and TypeCheck run but block nothing. Holding it is exactly what a Deployment Check would add.
```

```checkpoint check-2
With a ruleset on `main` only, an agent pushes new findings to `research/published-scales`. What does the ruleset do?
- [ ] Blocks the push until verify passes
- [ ] Asks for a pull request first
- [x] Nothing, because it covers main only
- [ ] Deletes the branch after the push
Why: A ruleset applies only to the branches it targets. Research branches never get a PR and never merge into `main`. Vercel is what reacts to that push, by starting a preview build.
```

```checkpoint check-3
Which of today’s facts about `main` means there is nothing yet for a gate to require?
- [ ] No ruleset protects main yet
- [ ] Merge commits are still allowed
- [ ] Vercel’s checks block nothing yet
- [x] No workflow produces a check
Why: A gate requires a check by name, and checks come from workflow jobs. With no workflow, a ruleset or Deployment Check would have nothing to wait for.
```

## One verify script, three places to run it

The first gate needs a check, and the check needs one command to run. A **verify script** is a single script in `package.json` that runs every fast check in order and stops at the first failure. For a Next.js app that means four steps: typecheck, lint, unit tests, build. The frontend branch already has a script for each. What it lacks is the one line that runs them together. Care4Mind uses pnpm, so it reads:

```text
"verify": "pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run build"
```

| Step | Script on the frontend branch | What it catches |
|---|---|---|
| Typecheck | `next typegen && tsc --noEmit` | Type errors, including in the route types Next.js generates |
| Lint | `eslint .` | Mistakes the type checker allows, plus the `jsx-a11y` accessibility rules for markup |
| Unit tests | `vitest run` | Logic in `tests/unit`: kolam drawing, Sanskrit spellings, colour contrast, content |
| Build | `next build` | Anything that breaks only in a production build |

Two details trip up agents that learned an older Next.js. First, `next lint` is gone, and `next build` no longer lints at all. Linting runs through the ESLint command line as a step of its own, and a green build no longer tells you lint passed. Care4Mind’s `lint` script is already plain `eslint .`. Second, the typecheck runs `next typegen` before `tsc --noEmit`. Next.js generates types for your routes, and before `next typegen` existed only `next dev` or `next build` made them, so `tsc` on its own couldn’t check them.

The order is deliberate. The quick checks run first and the slow build last, and `&&` starts each step only if the one before it passed. A type error fails in seconds instead of after a full build.

The point of one script is that the same command runs in three places:

- **On the agent’s machine**, before it opens a PR. Matt’s `/implement` skill already has the agent typecheck and test as it goes, then run the full suite at the end. `pnpm run verify` is that last run, with lint and build added.
- **In CI**, as one job named `verify` in `.github/workflows/ci.yml`, in place of today’s `check` job, on every PR and every push to `main`. Its name is the check the ruleset and the Deployment Check will require (Lesson 12).
- **On Vercel**, in part. Care4Mind’s native Deployment Checks run the `lint` and `typecheck` scripts on each production deployment, and Care4Mind’s script names already match. They never run your tests, though.

One script means a green run on the agent’s machine predicts a green check in CI, and a red check can be rerun exactly. If CI listed its own steps, the two lists would drift apart. The frontend’s `ci.yml` does exactly that today: its `check` job lists lint, a format check, typecheck and tests as separate steps, and only the Playwright and Lighthouse jobs build. Leave Vercel’s two native checks running but not blocking: they repeat part of `verify`, and the check Vercel should wait for is GitHub’s `verify`, the only one that runs the tests.

```callout remember
`pnpm run verify` runs typecheck, lint, unit tests and build, and stops at the first failure. The same command runs on the agent’s machine, in CI as the job `verify`, and partly on Vercel. In Next.js 16 the build doesn’t lint, so lint is a step of its own.
```

```checkpoint check-4
An agent’s PR passes `next build` but leaves an ESLint error. On Next.js 16, which step reports it?
- [ ] The build step, which lints first
- [ ] The typecheck step, through `next typegen`
- [ ] Vercel’s preview build log, every time
- [x] Only the lint step, run separately
Why: Next.js 16 removed `next lint`, and `next build` no longer lints. Only the separate `eslint .` step sees it, which is why lint sits in `verify` as its own step.
```

```checkpoint check-5
Why should the CI job run `pnpm run verify` instead of listing the four steps itself?
- [ ] A listed version would run faster
- [x] So local and CI runs match
- [ ] GitHub allows one command per job
- [ ] Vercel reads the job’s step names
Why: One command everywhere means a local pass predicts a CI pass, and a red check can be rerun exactly. Two separate lists drift apart. Speed and GitHub limits have nothing to do with it.
```

```checkpoint check-6
Could Vercel’s native Lint and TypeCheck checks replace the CI `verify` job?
- [x] No, they never run the tests
- [ ] Yes, they run every package script
- [ ] Yes, if they are set blocking
- [ ] No, they only run on previews
Why: Native checks run only the `lint` and `typecheck` scripts, and Vercel says it doesn’t execute your tests. Care4Mind’s run on production deployments, so the last option is wrong.
```

## Checks against the live preview

`verify` checks the code on a runner. Some problems only show on the running site: a button pushed off-screen at phone width, a tap target too small to hit, a slow first paint. Care4Mind’s own research for ticket 06 named three tools for these, and the frontend branch already has all three set up:

| Tool | What it does | On the frontend branch |
|---|---|---|
| Playwright | Drives real browser engines (Chromium, Firefox, WebKit) through scripted visits | `playwright.config.ts` tests at 360, 768 and 1440 px, plus 320 px for reflow, and points at a deployed preview when `PLAYWRIGHT_BASE_URL` is set. Otherwise it tests a local build, as `ci.yml`’s `e2e` job does today. |
| axe | Scans each page for WCAG failures, through `@axe-core/playwright` | `tests/e2e/axe.ts` asks for the `wcag22aa` tag |
| Lighthouse CI | Audits each page three times and fails the run when a budget is missed | `lighthouserc.cjs`: LCP ≤ 2,500 ms, CLS ≤ 0.1, TBT ≤ 200 ms, accessibility score ≥ 0.95. It audits a local build, not yet a preview. |

Two details from that research earn their place. axe finds, on average, about 57% of WCAG issues by itself; the rest need a person. And WCAG 2.2’s new rule on target size (tap targets at least 24 by 24 CSS pixels), the only 2.2 rule axe has, is off by default. It runs only when the test asks for the `wcag22aa` tag, and Playwright’s own documented example doesn’t ask. Care4Mind’s helper does.

Lighthouse’s numbers need defining. **LCP** (Largest Contentful Paint) measures how fast the biggest piece of content appears, **CLS** (Cumulative Layout Shift) how much the layout jumps, and **INP** (Interaction to Next Paint) how fast the page reacts to a tap or click. Care4Mind’s LCP and CLS budgets are exactly Google’s thresholds for “good”. Lighthouse loads pages with no user, so it can’t measure INP. Its stand-in is **TBT** (Total Blocking Time): how long the page was too busy to respond. Real INP comes only from real visitors, after launch.

How does a workflow find the preview? Vercel tells GitHub. A **repository_dispatch** event is a GitHub event that something outside GitHub sends to start workflows, and Vercel sends one each time a deployment’s status changes. A workflow that listens for `vercel.deployment.success` starts once a preview has finished building, and reads its URL from `github.event.client_payload.url`. Care4Mind’s previews ask for a Vercel login, so the runner also gets the bypass secret, which `playwright.config.ts` already sends as a header. Here is the shape, after Vercel’s examples, with Care4Mind’s names:

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
      # … set up pnpm and Node, install, install the browsers …
      - run: pnpm run test:e2e
        env:
          PLAYWRIGHT_BASE_URL: ${{ github.event.client_payload.url }}
          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
```

Three traps sit in that small file, and each explains a line of it:

1. **It runs on the wrong commit unless told otherwise.** GitHub runs a `repository_dispatch` workflow against the latest commit on `main`, not the PR’s commit. The checkout action fetches the deployed commit instead, and the status action posts the result on that commit, where the PR and Vercel look for it. Care4Mind’s default token can only read, hence `statuses: write`.
2. **It can’t test the PR that adds it.** The event starts a workflow only if the file is already on `main`. So the e2e workflow lands in one PR and first runs on the next.
3. **Care4Mind’s project doesn’t send the events yet.** Its setting `disableRepositoryDispatchEvents` is `true`, so until your agent sets it to `false`, the workflow never starts.

One more distinction, for the day you want these tests to hold production and not just a PR. For production, `vercel.deployment.success` arrives after promotion, which is too late to hold anything. A Deployment Check needs `vercel.deployment.ready`: built, not yet promoted. That’s also why the status name includes the environment, so a preview run and a production run don’t write over each other.

```callout remember
Playwright, axe (with `wcag22aa`) and Lighthouse CI test a running site, not the code. Vercel starts them with a `repository_dispatch` event that carries the URL. The status action puts the result on the right commit, and the workflow must already be on `main`.
```

```checkpoint check-7
A new Care4Mind page has a 16 px close button. Which check can flag it, and what does it need?
- [x] axe, with the `wcag22aa` tag requested
- [ ] Lighthouse, with a CLS budget set
- [ ] ESLint, with the Next.js rules on
- [ ] TypeScript, with route types generated first
Why: WCAG 2.2’s target-size rule wants at least 24 by 24 CSS pixels. axe has that rule, but runs it only when the `wcag22aa` tag is requested. CLS measures layout jumps, not sizes.
```

```checkpoint check-8
Your agent merges the e2e workflow, but no preview ever starts it. What do you check first on Care4Mind?
- [ ] Whether Lighthouse budgets are marked warn
- [x] Whether Vercel sends repository dispatch events
- [ ] Whether the ruleset requires e2e results
- [ ] Whether Playwright supports the WebKit engine
Why: On 27 October Care4Mind’s project had `disableRepositoryDispatchEvents` set to `true`, so Vercel sends no events and the workflow never starts. The ruleset only reads results; it can’t start anything.
```

```checkpoint check-9
You want e2e results to hold Care4Mind’s production release. Which event should that workflow listen for?
- [ ] `vercel.deployment.success`, after promotion
- [ ] `vercel.deployment.promoted`, after promotion
- [ ] `vercel.deployment.pending`, before building
- [x] `vercel.deployment.ready`, before promotion
Why: `ready` means built but not yet promoted, so the check can still hold it. For production, `success` and `promoted` arrive after promotion, and `pending` has no build to test.
```

## A database branch for every preview

Care4Mind has no database yet; ADR-0002 only says its data will live in Neon. When one arrives, previews raise a new question: which database does a preview talk to? If it’s production’s, then a **migration** (a change to the database’s structure, such as adding a column) tried on a preview runs against real data. Neon’s answer is a branch. A **Neon branch** is a copy-on-write clone of a database: made at once, starting with all of its parent’s data, and changes to it never touch the parent.

1. **1. An agent pushes to a PR branch** (GitHub → Vercel)
   - Vercel starts a preview deployment, as it does for every push.
2. **2. Neon makes a branch** (Vercel → Neon)
   - Neon’s integration hears about the deployment and creates `preview/<git-branch>`, copied from the project’s default branch.
3. **3. The preview gets its own database** (Vercel’s build)
   - `DATABASE_URL` for that branch is handed to this one deployment only. If the build command runs migrations first, they change the copy, and tests on the preview hit the copy too.

Production keeps one fixed Neon branch, chosen when you connect. Every PR gets a database of its own that it can break freely. That’s the whole reason: migrations and tests touch a copy, never production’s data.

Neon connects to Vercel in two ways. **Neon-Managed** links an existing Neon account and keeps billing with Neon; **Vercel-Managed** creates the database through Vercel and bills it there. You already pay for Neon, which points to Neon-Managed, and Care4Mind’s research adds a handover reason: Neon’s project transfer doesn’t work for a Vercel-Managed database. When you connect, turn on “Automatically delete obsolete Neon branches”. It deletes a preview branch once its Git branch is gone (checked at the next preview deployment), and GitHub already deletes Care4Mind’s PR branches on merge. Without it, old preview branches pile up and count against your plan.

One caution. A copy protects production from the preview, not the data from whoever opens the preview. A preview branch starts as a full copy of the project’s default branch, which is production’s unless you pick another when you connect, so anything private there is in every preview too, including copies of editor accounts if Neon’s own sign-in is used. Keep previews behind a login. Care4Mind’s already are (Lesson 12).

```callout remember
When Care4Mind gets a database, connect Neon to Vercel so each preview gets its own `preview/<git-branch>` branch: migrations and tests then touch a copy, never production. The copy still holds production’s data, so previews stay behind a login.
```

```checkpoint check-10
An agent’s PR adds a migration that drops a column, and the build command runs migrations. With preview branching on, where does it run first?
- [ ] On production, the moment it merges
- [x] On that PR’s own preview branch
- [ ] On your laptop’s local database only
- [ ] Nowhere, until someone runs it manually
Why: The preview deployment gets `DATABASE_URL` for its own `preview/<git-branch>` branch, so the migration in the build changes that copy. Production is untouched until the PR merges.
```

```checkpoint check-11
Why turn on “Automatically delete obsolete Neon branches” when you connect?
- [ ] Neon refuses new previews without it
- [ ] Production reads from stale preview branches
- [x] Old branches count against plan limits
- [ ] Old branches leak data to visitors
Why: Stale preview branches count toward your plan’s branch limit. Production never reads them, and they leak nothing that the preview login doesn’t already guard.
```

## The order to switch gates on

Each gate goes on when there is something real for it to check. Too early, and it blocks everything or fails for reasons nobody cares about, and a gate that people learn to ignore is worse than none. Here is the order for Care4Mind:

| Gate | When | What it blocks |
|---|---|---|
| `verify` job in `ci.yml` | First code PR | Nothing alone: it makes the check the next gates require |
| Ruleset “Protect main” | First code PR, once `verify` has run | Pushing to `main`; merging while `verify` is red |
| Vercel Git connection | Linked already; confirm it | Nothing: it gives every PR a preview deployment, the look gate |
| Deployment Check on `verify` | First code PR, before it merges | Promoting a production build whose `verify` failed |
| Playwright + axe on previews | When pages exist: the PR after the first | Nothing while report-only; once required, merging |
| Lighthouse CI budgets | When the design settles | Once required, merging a PR that misses a budget |
| Neon branch per preview | When a database arrives | Nothing: it keeps migrations and tests off production data |

Three of these have hard reasons behind their place. The ruleset comes after `verify` has run, because GitHub requires a check that has passed in the repo within the last seven days (Lesson 12). The Deployment Check must be in place before the first code PR merges, or that merge goes live unchecked, as the first section showed. And the e2e workflow can’t arrive in the first PR and test it, because a `repository_dispatch` workflow starts only once it’s on `main`. The frontend branch already has pages, so “when pages exist” means the very next PR.

Lighthouse budgets on a design that still changes every week would fail on changes you meant to make. The frontend’s `lighthouserc.cjs` already marks its budgets as errors, so “not yet” means running it without requiring its check. Neon branching simply needs a database. The same rule covers every new check: run it **report-only** first (it runs and shows its result, but no gate requires it), and once it has stayed green for a while, add it to the ruleset or the Deployment Checks.

```callout remember
Switch a gate on when there is something real for it to check: `verify`, the ruleset and a Deployment Check with the first code PR; e2e tests on the PR after; Lighthouse budgets when the design settles; Neon branches when a database arrives. Run each new check report-only first, then require it.
```

```checkpoint check-12
Why does the ruleset go on only after `verify` has run once?
- [x] GitHub needs a recently passed check
- [ ] Rulesets can’t exist on private repos
- [ ] Vercel must see the check first
- [ ] Its job name isn’t fixed yet
Why: GitHub requires a required check to have passed in the repo within seven days. Care4Mind is private, but you have GitHub Pro, so rulesets work there (Lesson 12).
```

```checkpoint check-13
Why not add the e2e workflow in the first code PR and have it test that same PR?
- [ ] Playwright can’t run on GitHub runners
- [ ] Vercel skips previews for first PRs
- [ ] Rulesets block new workflow files outright
- [x] Dispatch runs only files on main
Why: A `repository_dispatch` event starts a workflow only if the file is already on `main`. The first PR is what puts it there, so the e2e workflow first runs on the next one.
```

## Conventions for agents: your call

Gates catch mistakes after an agent makes them. A few lines in `AGENTS.md` stop some being made at all, because that file sits in the agent’s context every session (`CLAUDE.md` is a link to it). Today it points to the issue tracker, the triage labels and the domain docs, and says nothing about shipping. This part is your call, and nothing here changes the repo. If you want them, these lines are worth adding:

```text
## Shipping
- Every change reaches main through a pull request; the "Protect main" ruleset enforces it.
- Run `pnpm run verify` and see it pass before opening a PR. CI runs the same script as the `verify` check.
- Each PR covers one ticket. Name the ticket file in the PR body.
- PR titles follow Conventional Commits: `feat: …`, `fix: …`, `docs: …`.
```

Matt’s `writing-for-agents` skill gives two tests for each line. First, write down only what the agent can’t find by looking. The environment is already a source of truth, so don’t copy the scripts out of `package.json`; do write the convention and the reason behind it. Second, say what to do rather than what not to do, because naming a forbidden action makes it more likely, not less. That’s why the first line says every change reaches `main` through a PR, instead of “never push to `main`”.

The PR-title line matters because of squash merging. Care4Mind’s repo titles the squash commit after the PR’s only commit, or after the PR when it has several, so with agents making many commits the PR title usually becomes the one line on `main`. **Conventional Commits** is one format for it: a type such as `feat` or `fix`, a colon, a description. Your four merged PRs used plain sentences (“Draft the client question list”), which works just as well. What matters is picking one and writing it down.

```callout remember
`AGENTS.md` lines are loaded every session, so keep them few: conventions and reasons the agent can’t find by looking, phrased as what to do. Whether to add them is your call.
```

```checkpoint check-14
Which line earns a place in Care4Mind’s `AGENTS.md`?
- [ ] A copy of each `package.json` script
- [ ] The whole folder layout under `src/app`
- [x] Each PR covers exactly one ticket
- [ ] The ESLint rules, restated in prose
Why: One ticket per PR is a convention the agent can’t discover from the repo. Scripts, folders and lint rules are already there to look up, so copying them only goes stale.
```

```checkpoint check-15
Why write “every change reaches main through a PR” rather than “never push to main”?
- [ ] GitHub rejects any negative line in `AGENTS.md`
- [x] Naming a ban makes that action likelier
- [ ] The ruleset reads `AGENTS.md` before every merge
- [ ] Positive lines take fewer tokens to load
Why: Matt’s skill: a prohibition puts the forbidden action in the agent’s context. Stating the target behaviour steers it straight there. GitHub and the ruleset never read `AGENTS.md`.
```

## Tell your agent

Use this when the frontend branch is ready to become Care4Mind’s first code PR. It sets up the first gates, proves they hold, and only plans the later ones.

```text
Set up Care4Mind's first gates as part of its first code PR, from the SiddharthMuramkar/frontend branch. Every change reaches main through this PR.

1. Verify script. Add "verify": "pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run build" to package.json. Run pnpm run verify and show me the end of the output.
2. CI. The branch already has .github/workflows/ci.yml. Replace its check job with one job, id and name both "verify", on pull_request to main and on push to main. Install pnpm at the version in packageManager and Node from .nvmrc, install with the lockfile frozen, then run pnpm run format:check (the old check job ran it) and pnpm run verify. Keep the e2e and lighthouse jobs running, but don't require them. Push, open the PR, and show me the green verify check.
3. Research branches. Set the Vercel project's Ignored Build Step so builds for branches starting with research/ are cancelled. Every other branch still builds.
4. Merge gate. Once verify has passed on the PR, create a ruleset with gh api: "Protect main", default branch, active, require a pull request (0 approvals, squash only), require the verify check from GitHub Actions, block force pushes, restrict deletions, empty bypass list. Turn off merge commits and rebase merging in the repo settings. GET both back and show me.
5. Release gate. Confirm the Vercel project care4mind is linked to this repo by Git, production branch main, automatic production aliasing on, and that the PR got a preview link. Add a Deployment Check from GitHub on verify that holds production aliasing. Leave the native Lint and TypeCheck checks non-blocking. If the API or CLI can't do a step, give me the exact dashboard steps.
6. Prove it. Push a commit with a deliberately failing unit test and show me the red verify check and the blocked merge. Revert that commit, then wait for me to merge. After I merge, show me the production deployment waiting for verify before it was promoted.

Plan only, for the next PR: set disableRepositoryDispatchEvents to false on the Vercel project, and add an e2e workflow on vercel.deployment.success that checks out the deployed commit with vercel/repository-dispatch/actions/checkout, runs pnpm run test:e2e with PLAYWRIGHT_BASE_URL from client_payload.url and the automation bypass secret, and reports with vercel/repository-dispatch/actions/status. It stays report-only until I say to require it.

Ask me before you disable the ruleset, click Force Promote, touch a research branch or merge anything. End with what you changed, the commands you ran, and anything you couldn't verify.
```

## Try it

These commands only read; they change nothing. Run them in `~/Desktop/project1`:

```sh
gh api repos/SiddharthMuramkar/care4mind/rulesets
gh api repos/SiddharthMuramkar/care4mind --jq '{visibility, allow_squash_merge, delete_branch_on_merge}'
ls .github 2>/dev/null || echo "no workflows yet"
git show SiddharthMuramkar/frontend:package.json | grep -A12 '"scripts"'
```

On 27 October the first printed `[]`. The second printed `{"allow_squash_merge":true,"delete_branch_on_merge":true,"visibility":"private"}` (`gh` sorts the keys). The third printed `no workflows yet`. The last reads the frontend branch’s `package.json` without switching branches: you should see `lint`, `typecheck`, `test`, `test:e2e` and `lhci`, but no `verify`. After your agent runs the prompt and the PR merges, run them again: the first shows “Protect main”, the third lists `workflows`, and `verify` appears.

## Practice

### When does it go on?

For each piece of the pipeline, pick when it should be switched on.

```checkpoint check-16
A `verify` job in `.github/workflows/ci.yml`
- [x] First code PR
- [ ] The PR after
- [ ] Design settles
- [ ] Database arrives
Why: It produces the check every other gate requires, so it comes first.
```

```checkpoint check-17
Playwright and axe tests against each preview, report-only
- [ ] First code PR
- [x] The PR after
- [ ] Design settles
- [ ] Database arrives
Why: The workflow must be on `main` before a `repository_dispatch` event can start it, and the first PR already brings pages.
```

```checkpoint check-18
Requiring the Lighthouse budgets of LCP 2.5 s, CLS 0.1 and TBT 200 ms
- [ ] First code PR
- [ ] The PR after
- [x] Design settles
- [ ] Database arrives
Why: On a design still changing, budgets fail on changes you meant to make.
```

```checkpoint check-19
A Deployment Check that holds production until `verify` passes
- [x] First code PR
- [ ] The PR after
- [ ] Design settles
- [ ] Database arrives
Why: Without it, the first code merge goes live unchecked.
```

```checkpoint check-20
Migrations in Vercel’s build command, run against `preview/<git-branch>`
- [ ] First code PR
- [ ] The PR after
- [ ] Design settles
- [x] Database arrives
Why: With no database there is nothing to migrate or branch.
```

```checkpoint check-21
The ruleset “Protect main”, requiring a PR and `verify`
- [x] First code PR
- [ ] The PR after
- [ ] Design settles
- [ ] Database arrives
Why: It goes on as soon as `verify` has run once on the first code PR.
```

```checkpoint check-22
Switching on Vercel’s repository dispatch events for the project
- [ ] First code PR
- [x] The PR after
- [ ] Design settles
- [ ] Database arrives
Why: They start the e2e workflow, which arrives with the PR after the first.
```

```checkpoint check-23
Turning on “Automatically delete obsolete Neon branches”
- [ ] First code PR
- [ ] The PR after
- [ ] Design settles
- [x] Database arrives
Why: It’s a setting of Neon’s Vercel integration, which you connect when the database arrives.
```

## Check yourself

From memory, without scrolling up.

```final-test final-24
On Next.js 16, an agent removes `lint` from `verify` because “the build lints anyway”. What’s wrong?
- [ ] Nothing; `next build` still runs ESLint
- [x] `next build` no longer runs linting
- [ ] ESLint now runs only on Vercel
- [ ] Linting moved into `next typegen` instead
Why: Next.js 16 removed `next lint` and stopped linting in `next build`. Without its own step, lint errors pass every gate.
```

```final-test final-25
The frontend PR is green and you’re about to merge it. Which gate keeps it from going live unchecked?
- [ ] Lighthouse budgets on every page
- [ ] A Neon branch per preview
- [ ] Playwright and axe on previews
- [x] A Deployment Check on `verify`
Why: Vercel is already linked and promotes the newest good production build by default. Only a Deployment Check makes it wait for `verify` on the merged commit.
```

```final-test final-26
Lighthouse CI on a Care4Mind preview reports TBT but no INP. Why?
- [x] INP needs a real user’s input
- [ ] INP only runs on production builds
- [ ] TBT was renamed INP in Lighthouse
- [ ] The budget for INP was missing
Why: Lighthouse loads pages with no user, so nothing is clicked or tapped. TBT is the lab stand-in; real INP comes from real visitors.
```

```final-test final-27
Preview branching is on. Why must Care4Mind’s previews still sit behind a login?
- [ ] Neon refuses connections from public URLs
- [ ] Vercel requires it for Deployment Checks
- [x] Previews hold copies of production data
- [ ] Migrations fail on unprotected preview deployments
Why: A Neon preview branch starts as a full copy of the default branch, which is normally production’s, so private data, and copies of editor accounts, are in every preview.
```

```final-test final-28
Your e2e workflow, started by `repository_dispatch`, passes, but the PR never shows its result. What’s missing?
- [ ] A `pull_request` trigger added to the workflow
- [x] A status step on the deployed commit
- [ ] A second ruleset that targets research branches
- [ ] Vercel’s native Lint check switched to blocking
Why: A dispatch workflow runs against the latest commit on `main`, so its own result lands there. `vercel/repository-dispatch/actions/status` posts it on the commit Vercel deployed, which is where the PR looks.
```

## Read next

**Read:** [Vercel KB, How can I use GitHub Actions with Vercel?](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel), about twelve minutes. It draws the line this lesson follows: Vercel builds, previews and hosts, while GitHub Actions runs what Vercel doesn’t, such as tests, performance budgets and approval steps. Read “Stop adding a pipeline Vercel already runs for you” and “Confirm the deploy and gate on it before it goes live” closely. Skim the `--prebuilt` and Turborepo parts: they’re for deploying from Actions, which Care4Mind doesn’t need.

Keep the agentic shipping cheat sheet open when you send the prompt. Then take the Part 4 test: it covers Lessons 14 to 16.

```sources
- [Vercel REST API, Create a check](https://vercel.com/docs/rest-api/checks-v2/create-a-check)
- [Vercel Docs, Deployment Checks](https://vercel.com/docs/deployment-checks)
- [Vercel Docs, Deploying Git Repositories](https://vercel.com/docs/git)
- [Vercel Docs, Project settings](https://vercel.com/docs/project-configuration/project-settings)
- [Vercel KB](https://vercel.com/kb/guide/how-do-i-use-the-ignored-build-step-field-on-vercel)
- [pnpm Docs, run](https://pnpm.io/cli/run)
- [Next.js Docs, Upgrading to version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js Docs, next CLI](https://nextjs.org/docs/app/api-reference/cli/next)
- [Matt’s implement skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md)
- [Vercel KB, GitHub Actions with Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel)
- [axe-core README](https://github.com/dequelabs/axe-core/blob/develop/README.md)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Playwright Docs, Accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [W3C, Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [web.dev, Web Vitals](https://web.dev/articles/vitals)
- [web.dev, TBT](https://web.dev/articles/tbt)
- [Vercel Docs, Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Vercel’s e2e guide](https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment)
- [vercel/repository-dispatch](https://github.com/vercel/repository-dispatch)
- [GitHub Docs, Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Vercel REST API, Update a project](https://vercel.com/docs/rest-api/projects/update-an-existing-project)
- [GitHub Docs, Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Neon Docs, Branching](https://neon.com/docs/introduction/branching)
- [Neon Docs, Neon-Managed integration](https://neon.com/docs/guides/neon-managed-vercel-integration)
- [Neon Docs, Vercel-Managed integration](https://neon.com/docs/guides/vercel-managed-integration)
- [Neon Docs, Preview branch cleanup](https://neon.com/docs/guides/vercel-branch-cleanup)
- [GitHub Docs, Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- [Matt’s writing-for-agents skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md)
- [GitHub REST API, Repositories](https://docs.github.com/en/rest/repos/repos)
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
```
