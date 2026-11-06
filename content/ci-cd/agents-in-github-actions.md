---
title: Agents in GitHub Actions
slug: agents-in-github-actions
summary: Tell apart on-demand, review and label-triggered agents in GitHub Actions, set one up, and check six safety rules before you switch it on.
---

So far, every agent session you've run started the same way: you opened a terminal and typed. Say you want an agent to review each pull request on your `recipes` repo while your laptop is shut. Or to start building when you add a label to an issue. That's an agent in GitHub Actions: an event on GitHub starts it, on a machine nobody watches, and it ends in something you review. It also brings new ways to go wrong, because the agent now reads text strangers can write, and holds keys that can push code.

```goals
- Tell apart the three kinds of agent you can run in GitHub Actions: on demand, automatic review and label-triggered.
- Say what each one needs before it can run, and what each run costs.
- Check a workflow an agent proposes against six safety rules.
- Pick the first agent to switch on, and widen from there one step at a time.
```

## Why run an agent in Actions

Two words describe how you work with an agent. **HITL** (human in the loop) work happens with you there, watching and steering. **AFK** (away from keyboard) work runs unattended: you start the session and leave. [The build loop in practice](/learn/spec-driven-build-loop) shows where you sit in each.

Matt Pocock's AI coding dictionary adds the catch. AFK usually means letting the agent act without asking permission. So it needs a **sandbox**: an isolated place where its mistakes can't reach the rest of your machine. Run AFK on your laptop, and you have to build that sandbox there.

Run the same agent inside GitHub Actions, and four things change:

- It runs on GitHub's machines. Each job gets a fresh virtual machine, the same kind your CI's `Verify` job runs on ([What CI/CD is](/learn/what-ci-cd-is)). Your laptop can be shut.
- An event starts it: a comment, a pull request opening, a label, a timer.
- It works where the gates are. Its pull request meets the same ruleset and the same check as yours ([Gates: checks that block](/learn/gates)).
- It ends in something you review: a comment or a pull request.

Matt calls a setup where triggers, not people, start agent sessions a **software factory**. Here are the three kinds of agent you can run that way:

| Kind | Started by | What the agent may do | Ends in |
|---|---|---|---|
| On demand | You, writing `@claude …` in an issue or pull request comment | Answer, or commit to a new branch | A reply, and a link for you to open the pull request |
| Automatic review | A pull request being opened or updated | Read the diff, post comments | Comments on the pull request |
| Label-triggered AFK | A label such as `agent:implement` | Write code, review, update branches | A pull request waiting for your review |

**An agent in Actions is AFK by design: an event starts it on a fresh GitHub machine, and it ends in something you review.**

Read the table top to bottom as a ladder. Each row starts with less of you, and lets the agent change more.

```callout remember
An event starts an agent in Actions, on a fresh GitHub machine, and it ends in something you review. On-demand and review agents wait for you or your pull requests; a label pipeline does the work itself.
```

```checkpoint where-agent-runs
You comment "@claude why does the server crash on an empty body?" on a pull request in your `recipes` repo, then shut your laptop. Where does the agent run?
- [ ] In a terminal on your laptop
- [ ] Inside the pull request's preview deployment
- [x] On a fresh GitHub machine
- [ ] Nowhere, until you open the laptop again
Why: The workflow's job gets a fresh GitHub-hosted runner, so your laptop doesn't matter. A preview deployment serves the site; it doesn't run agents.
```

```checkpoint software-factory
Which of these is a software factory, in Matt's sense?
- [x] A label on an issue starts an agent session
- [ ] You open a Claude Code session for each ticket
- [ ] You read every agent diff before it merges
- [ ] An agent stops to ask you each question
Why: A factory is defined by what starts the session: a trigger, not a person. Opening a session yourself may be AFK once it runs, but you still start it.
```

## Claude Code's action: @claude and automatic review

Anthropic's ready-made agent for Actions is `anthropics/claude-code-action`. It's an **action**: a packaged step that a workflow pulls in with `uses:`, like `actions/checkout` in [Reading a GitHub Actions workflow](/learn/reading-a-workflow). It installs Claude Code on the runner and runs it there. Its calls to the model go out to Anthropic, or to the cloud provider you choose.

One input decides how it behaves: `prompt`. Leave it out, and the action runs in **interactive mode**. It waits for `@claude` in a comment, a review, or the title or body of a new issue. Then it replies in a comment and updates it as it works. Ask for a change, and it commits to a new branch, then gives you a link to open the pull request yourself.

Give it a `prompt`, and it runs in **automation mode**. It does that job on every event the workflow listens to, with no mention needed. Its results go to the run's log, unless the job tells it to post and gives it a tool for posting. Automatic review is automation mode with "review this pull request" as the job.

Here is the review workflow from Claude Code's docs. The quick setup in the next part writes one that runs the same `code-review` plugin:

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-plugins-official.git"
          plugins: "code-review@claude-plugins-official"
          prompt: "/code-review:code-review --comment ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'
```

Read it the way you'd read any workflow. `on: pull_request` runs it when a pull request is opened, pushed to, reopened or marked ready. The job's own token may only read. The comments go out through the Claude GitHub App, which the action signs in as by default, and `id-token: write` is what lets it. The `prompt` runs the plugin's review skill on this pull request. `--comment` posts the findings on the pull request, not only in the log. The review skips drafts, and pull requests Claude has already commented on.

The last line is the limit that matters most. `claude_args` passes flags straight to Claude Code, and `--allowedTools` names tools the agent may use without asking. In a run nobody watches there's nobody to ask, so a tool that isn't granted can't be used. This review grants one extra tool: the one that posts inline comments. These are the inputs you'll meet most:

| Input | What it sets |
|---|---|
| `prompt` | The job, as plain text or a skill such as `/code-review:code-review`. Leave it out for `@claude` mode. |
| `claude_args` | Claude Code's own flags: `--allowedTools`, `--max-turns` (a cap on turns), `--model`. Older `max_turns` and `model` inputs moved here. |
| `anthropic_api_key` or `claude_code_oauth_token` | How the run pays: an API key, or your Claude subscription |
| `label_trigger` | A label that starts the action when someone adds it to an issue |

```callout remember
No `prompt`: it waits for `@claude`, commits to a branch, and you open the pull request. A `prompt`: it runs on every matching event, such as each pull request. Its limits live in `claude_args`: `--allowedTools` and `--max-turns`.
```

```checkpoint at-claude-result
Your `@claude` workflow has no `prompt`. You comment "@claude fix the TypeError in the signup route" on an issue. When it finishes, what is on GitHub?
- [ ] A new commit, merged into `main`
- [ ] An approved review on a pull request
- [x] A branch, and a link to open a pull request
- [ ] Nothing, until you run the workflow by hand
Why: In interactive mode, Claude commits to a new branch and links you to open the pull request yourself. By default it neither merges nor opens the pull request for you.
```

```checkpoint where-max-turns
You want every automatic review to stop after a few turns. Where does that limit go?
- [ ] In the job's `permissions` block
- [x] In `claude_args`, as `--max-turns`
- [ ] In the `trigger_phrase` input
- [ ] In the repo's ruleset settings
Why: `claude_args` passes Claude Code's own flags, and `--max-turns` caps the turns. `permissions` limits the job's token, not how long the agent works.
```

```checkpoint drop-claude-args
A teammate deletes the `claude_args` line from the review workflow, because the skill already names the tool. What happens?
- [x] Claude reviews, but can't post inline comments
- [ ] Claude gets every tool, with no limits at all
- [ ] The whole workflow refuses to start running
- [ ] Every review posts twice on each pull request
Why: The action starts the inline-comment tool only when `--allowedTools` in `claude_args` names it. Without the line, the findings can't go on the pull request as inline comments. Removing a grant never adds tools.
```

## What switching it on takes

Three pieces: the Claude GitHub App on the repo, one secret, and a workflow file. The quick route is a command you type inside Claude Code, in the repo's folder: `/install-github-app`. It needs the GitHub CLI signed in, admin rights on the repo, and a repo on github.com.

The command installs the app and saves the secret. Then it pushes a branch with `claude.yml`, the `@claude` workflow, plus `claude-code-review.yml` if you pick the review. It opens GitHub with a pull request ready to create. Nothing works until you merge it: on the setup pull request itself, the action skips its run, because the workflow isn't on `main` yet. The manual route does the same three steps by hand.

The app serves every Claude feature that works with GitHub, so its permissions are broad. They include write access to code, pull requests and workflow files, and you can't accept only part of them. What you can choose is where it's installed: only the repos that use it.

The secret is how the run pays for the model. There are two kinds:

| Secret name | Where it comes from | Who pays |
|---|---|---|
| `ANTHROPIC_API_KEY` | A key from the Claude Console | API billing, per token |
| `CLAUDE_CODE_OAUTH_TOKEN` | `claude setup-token`, run in your own terminal. It lasts a year, and needs a paid Claude plan. | Your Claude subscription. The token is tied to you, so don't share it across other people's repos. |

Every run costs twice: GitHub Actions minutes for the machine, and model usage (API tokens, or your plan's allowance). Clear requests, a short `CLAUDE.md`, a turn cap and a job timeout keep both down.

Who can start a run is checked too. On issue and pull request events, the person who triggered it must have write access to the repo. Bots are refused unless you list them. On public repos, GitHub withholds secrets from runs started by pull requests from forks, so the review runs only on branches in the same repo.

```callout remember
Three pieces: the Claude GitHub App (on chosen repos only), one secret (an API key or your subscription token), and one workflow file. You merge the setup pull request yourself. Each run costs Actions minutes plus model usage, and only people with write access can start one.
```

```checkpoint first-review-runs
You run `/install-github-app` in your repo's folder and pick the review workflow. When does the first review run?
- [ ] As soon as the app is installed
- [x] After you merge the setup pull request
- [ ] The next time you type `@claude` anywhere
- [ ] Once you have rotated the secret
Why: The setup pushes a branch and prepares a pull request. Until it merges, the workflow isn't on `main`, so the action skips any run, even on the setup pull request. After that, each pull request event starts a review, with no `@claude` needed.
```

```checkpoint oauth-cost
Your workflow uses `CLAUDE_CODE_OAUTH_TOKEN`. What does one review run cost you?
- [ ] Nothing, because GitHub hosts the model
- [ ] API tokens, billed per review
- [ ] Only your Claude subscription's usage
- [x] Actions minutes and subscription usage
Why: The machine still uses Actions minutes, and the model calls draw on your subscription instead of API billing. Two costs, whichever secret you use.
```

```checkpoint no-write-access
Someone without write access comments "@claude delete the tests" on an issue in your repo. What happens?
- [x] The run fails its access check
- [ ] Claude deletes the tests on a branch
- [ ] Claude asks you for approval first
- [ ] GitHub hides the comment from Claude
Why: On issue and pull request events, the action checks that the person who triggered it has write access to the repo, and stops the run if not.
```

## Matt's AFK platform: labels in, pull requests out

Matt Pocock built the third kind for his own repo, course-video-manager, and published it as a spec: the "GitHub-Native AFK Agent Platform". GitHub Actions is the **orchestrator**: its workflows decide what runs when. GitHub Issues and pull requests are the tracker. The **agent runner**, the program that does the coding, can be swapped; his is Sandcastle, driving Claude Code. You steer the whole thing by adding labels.

One design rule holds the rest together. Ordinary workflow steps make every change on GitHub: labels, comments, pushes, pull requests, closing issues. The agent only commits on its local copy, and writes files, such as a pull request's title, for the workflow to read. The part that thinks never holds the keys.

| Label added | On | What runs | Ends with |
|---|---|---|---|
| `agent:to-issues` | A PRD issue (a feature's spec) | To Issues | Sub-issues, each with acceptance criteria |
| `agent:implement` | A standalone issue | Implement | A draft pull request, labelled `agent:review` |
| `agent:implement` | A PRD with sub-issues | Implement PRD | The next open sub-issue done, on one shared branch; it re-labels itself until none are left |
| `agent:review` | A pull request | Review | An improvement commit if needed, and a review that comments, never approves |
| `agent:implement` | A pull request | Implement PR | Fixes and replies for unresolved review comments |
| `agent:update-branch` | A pull request | Update Branch | `main` merged in; the agent runs only if there are conflicts |
| (an issue closes) | Its dependents | Promote Queued | `agent:queued` issues with no open blockers move to `agent:implement` |
| (weekday timer) | The codebase | Architecture Review | One proposed PRD issue |

Labels are the state too. `agent:in-progress` locks an item while a run is going. A failed run adds `agent:blocked` and a comment saying why; adding the trigger label again retries it. Nothing in the system merges: the last step is always yours.

It runs on two GitHub tokens. `GITHUB_TOKEN`, the one GitHub makes for every job, does most of the work. But events caused by that token start no new workflows, so a workflow can't set itself off in a loop. A label added with it lands, but doesn't start the next workflow.

So the spec adds `AGENT_PAT`, a **personal access token** (one tied to a person's account), kept as a secret. It's used for each hop that must start the next step. Without it, the chain stops at every hop until you add the label yourself. The agent's own credential, `CLAUDE_CODE_OAUTH_TOKEN`, goes only into the agent's step.

Two workflow settings return with a twist. The three workflows that push to a pull request share one `concurrency` group per pull request. So they never push to the same branch at once. And they set `cancel-in-progress: false`, the opposite of the usual CI choice: a half-finished agent run is expensive, so the newer one waits. Each workflow also asks for the least `permissions` it needs; Promote Queued gets only `issues: write`.

**Sandcastle** is the runner. In TypeScript, you call `run()` with an agent (for example `claudeCode(…)`), a sandbox (for example `docker()`) and a prompt. Ask for a branch, and it makes a git worktree on that branch: a second working folder ([Branches and worktrees](/learn/branches-and-worktrees)). With Docker, it bind-mounts that folder into the container, so the agent writes straight into it. You get the agent's commits back in `result.commits`.

Because the sandbox is the boundary, Sandcastle skips Claude's permission prompts on AFK runs by default, and runs one iteration unless you ask for more. Inside Actions, Matt's spec runs it with `noSandbox()`. The spec doesn't say why; a likely reason is that the runner is already a fresh machine, thrown away after the job.

The spec needs GitHub Issues. If your tickets live somewhere else, such as Markdown files in the repo, you'd move them to GitHub Issues first ([Issues: keeping track of work](/learn/issues-and-keeping-track)). Sandcastle on its own is looser: its setup offers other trackers too.

```callout remember
Labels are both the controls and the state. The workflow holds the keys and makes every change on GitHub; the agent only commits and writes files. `AGENT_PAT` lets one step start the next. A human still merges.
```

```checkpoint no-agent-pat
Your repo runs Matt's platform without `AGENT_PAT`. Implement opens a draft pull request and adds `agent:review` with `GITHUB_TOKEN`. What happens next?
- [ ] Review starts within a minute
- [ ] GitHub silently rejects the label
- [x] The label lands, but Review waits
- [ ] Implement retries with your token
Why: Events caused by `GITHUB_TOKEN` don't start workflows, so the label is there but Review doesn't run until a person adds it again. That's the spec's graceful fallback.
```

```checkpoint who-pushes
In Matt's platform, which part pushes the agent's commits to GitHub?
- [x] The workflow steps around the agent
- [ ] The agent itself, with its own token
- [ ] The Docker container running Sandcastle
- [ ] The Claude GitHub App, on its own
Why: The orchestrator owns every change on GitHub, pushes included. The agent only commits locally and writes files; it never holds a GitHub token.
```

```checkpoint cancel-in-progress
Why do the platform's concurrency groups use `cancel-in-progress: false`, unlike a typical CI workflow?
- [ ] GitHub forbids cancelling labelled runs
- [ ] Labels can never start a second run
- [ ] Cancelling would delete the comments
- [x] Agent runs are expensive, so newer waits
Why: A CI run is cheap to throw away; a half-finished agent run is not. So the newer run waits for the current one instead of cancelling it.
```

## Six safety rules before you switch one on

An agent in Actions reads text that other people can write, holds credentials, and can push code. Each rule below closes one way that goes wrong. Check all six on any workflow an agent proposes.

1. **Least permissions, per job.** Set `permissions: contents: read` at the top, then raise it only on the job that needs more, as Matt's spec does. Naming any permission sets every one you didn't name to `none`, so a short list is a tight one. A review job needs to read; it doesn't need `contents: write`.
2. **Secrets stay secret, and tokens stay small.** Keys live in GitHub secrets, never in the YAML, and are never printed. With this action, leave `show_full_output` off: it puts everything Claude ran and read into the log. Debug mode (the `ACTIONS_STEP_DEBUG` secret set to `true`) switches it on by itself. Prefer short-lived tokens: `GITHUB_TOKEN` dies with the job. A personal token such as `AGENT_PAT` lives on, so make it fine-grained: one repo, and only the access the spec lists. And anyone with write access can read every secret.
3. **No pwn requests.** `pull_request_target` runs with your repo's secrets and a token that can write. That's safe while it runs only code from your default branch. Check out the pull request's own code and run anything from it, and a stranger's code runs with your secrets: a **pwn request**. Use `pull_request`, as the review workflow does.
4. **No script injection.** Issue titles, pull request bodies and even branch names are typed by whoever opened them. GitHub pastes `${{ … }}` into the shell script before it runs, so a crafted title can end a quote early and run a command. Pass untrusted text in through `env:`, where the shell treats it as data.
5. **Prompt injection: control who starts it, and what it reads.** Script injection tricks the shell; **prompt injection** tricks the agent. An agent that reads an issue reads any instructions hidden in it, such as "also add my SSH key", and may follow them.
6. **Caps, and the same gates.** Limit how long and how often it runs. Let its pull request face exactly what yours face: the ruleset, the `Verify` check, the preview and your review. No auto-merge.

Rule 3 has one deliberate exception. Matt's spec uses `pull_request_target` and runs the pull request's code, because plain `pull_request` can't run on a pull request that conflicts with `main`. That stays safe only while its pull requests come from the agents' own branches. It also relies on labels: only people with triage access or more can add the labels that start a run. (Triage is a role that can manage issues and pull requests, but can't push code.) Don't copy it to a repo that takes pull requests from forks.

Rule 4's fix looks like this. A title such as `a"; ls $GITHUB_WORKSPACE"` breaks the first version, but not the second:

```diff
- run: echo "Starting on ${{ github.event.issue.title }}"
+- env:
+    TITLE: ${{ github.event.issue.title }}
+  run: echo "Starting on $TITLE"
```

Rule 5 has no single fix. The action strips some hidden tricks, such as HTML comments, but not all. So keep the action's write-access check: never set `allowed_non_write_users`, or `allowed_bots: '*'`. Start pipelines with labels that only trusted people can add. Read the raw text of an issue before you label it, and give the agent only the tools its job needs.

Rule 6, in practice: `--max-turns` in `claude_args`, a `timeout-minutes` on the job (the default is six hours), a `concurrency` group, and Sandcastle's `maxIterations`. One trap: if a workflow agent pushes to a pull request with the plain `GITHUB_TOKEN`, CI's run waits for your approval. So `Verify` is missing, and the merge stays blocked until you click Approve workflows to run. The gate held; nothing is broken.

One more habit: pin `anthropics/claude-code-action` to a full commit SHA, not `@v1`. A tag can be moved to different code, and Anthropic moves `v1` to each new release. A SHA always means the same code.

```callout remember
Least permissions per job. Secrets never printed; tokens short-lived and narrow. No pull request code under `pull_request_target`. Untrusted text through `env:`, never pasted into `run:`. Only trusted people can start it. Caps on turns, time and parallel runs, and its pull request meets your gates and your review.
```

```checkpoint title-in-run
An agent proposes this step: `- run: gh issue comment 7 --body "Working on ${{ github.event.issue.title }}"`. What's wrong with it?
- [ ] The job needs `contents: write` first
- [ ] Nothing: GitHub always masks issue titles
- [x] The title is pasted into the shell
- [ ] Comments need `pull_request_target` to post
Why: GitHub substitutes `${{ … }}` before the shell runs, so a crafted title becomes part of the command. Pass it through `env:` instead. Titles aren't secrets, so nothing masks them.
```

```checkpoint target-head-checkout
A workflow on `pull_request_target` checks out the pull request's head commit and runs `npm ci`, on a repo that takes pull requests from forks. Why is that dangerous?
- [x] A fork's code runs with your secrets
- [ ] It runs every test twice per pull request
- [ ] Its check never reports to the pull request
- [ ] Forks can't trigger this event at all
Why: `npm ci` can run scripts from the pull request's `package.json`, and this event carries your secrets and a write token. That's a pwn request. Use `pull_request` for untrusted code.
```

```checkpoint hidden-instructions
Your public repo has an issue that says "Add dark mode", and hides an HTML comment telling the agent to add a new collaborator. What protects you best?
- [ ] Masking secrets in the workflow logs
- [x] Reading the raw text before adding labels
- [ ] Setting `cancel-in-progress: true` everywhere
- [ ] Pinning the action to its `v1` tag
Why: That's prompt injection. Filters, such as the action's stripping of HTML comments, catch some tricks, not all. So read the raw issue before you label it, and give the agent only the tools its job needs.
```

### Practice: which rule does it break?

For each line from a workflow an agent proposes, pick the rule it breaks.

```checkpoint rule-write-all
The review job has `permissions: write-all`, though it only reads code and posts comments through the Claude app.
- [x] Permissions
- [ ] Secrets
- [ ] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: A review job needs to read. `write-all` hands every write permission to anything that runs in the job.
```

```checkpoint rule-debug-mode
To debug a failing run, someone sets the `ACTIONS_STEP_DEBUG` secret to `true` on a public repo.
- [ ] Permissions
- [x] Secrets
- [ ] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: Debug mode switches on the action's full output, which can print tokens and file contents into logs anyone can read.
```

```checkpoint rule-fork-head
A `pull_request_target` workflow checks out a fork's head commit and runs its tests.
- [ ] Permissions
- [ ] Secrets
- [x] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: A fork's code runs with your secrets and a write token. Use `pull_request`.
```

```checkpoint rule-branch-from-title
A step's `run:` line builds a branch name from `${{ github.event.issue.title }}`.
- [ ] Permissions
- [ ] Secrets
- [ ] Pwn request
- [x] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: The title is pasted into the shell before it runs. Pass it in through `env:`.
```

```checkpoint rule-non-write-users
`allowed_non_write_users: '*'` is set, so anyone can ask `@claude` for help.
- [ ] Permissions
- [ ] Secrets
- [ ] Pwn request
- [ ] Script injection
- [x] Prompt injection
- [ ] Caps and gates
Why: It removes the write-access check, so any stranger's text can steer the agent.
```

```checkpoint rule-auto-merge
A label pipeline's pull requests auto-merge once the agent's own review passes.
- [ ] Permissions
- [ ] Secrets
- [ ] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [x] Caps and gates
Why: The agent's pull request must meet the same gates as yours, ending in your review. Matt's spec never merges.
```

## When to go AFK

Matt names the way AFK goes wrong. You come back to hours of confident work, built on a wrong guess from the first ten minutes. With nobody to ask, the agent picks a default and builds on it. His fix is to give your input before the run (a grilling session, a written spec) and after it (a pull request to review).

So the right AFK job is one that's already decided, which is what [to-tickets](/learn/to-tickets) produces. Each ticket is one thin slice through every layer, small enough for one fresh context window, and checkable on its own. Its acceptance criteria are a checklist, and on a real tracker it's labelled `ready-for-agent`. Add two conditions of your own. Tests exist that tell the agent when it's done. And the **blast radius**, how much of the code one change can break, is small.

Deciding stays HITL. [wayfinder](/learn/wayfinder), [grilling](/learn/grilling), writing the spec and judging a [prototype](/learn/prototype) all need your reactions as the input. An agent in Actions can't ask you how readers of your `recipes` site should browse recipes. It can build the way you chose.

Then widen the loop one step at a time. Matt's advice is to start narrow: one kind of session, one kind of reviewable pull request. See how far you can trust it before you add the next.

| Rung | What runs | Switch it on when |
|---|---|---|
| 1. Review on a practice repo | Automatic review on the lab's `cicd-lab` repo ([Lab: a gated pipeline](/learn/lab-gated-pipeline)). The job only reads, and the agent can only comment. | Now: you learn what a run costs, and what it catches |
| 2. Review on your real project | The same workflow, beside your project's gates | Once the project has its `Verify` check and ruleset ([Setting up your own project's pipeline](/learn/your-projects-pipeline)) |
| 3. `@claude` on demand | Small fixes you ask for in a comment. It writes to branches; you open and merge the pull requests. | When the reviews have proved useful |
| 4. A label pipeline | Matt's platform, or your own Sandcastle loop, for `ready-for-agent` tickets only. A human still merges. | Only after your tickets live in GitHub Issues |

```callout remember
AFK suits work that's already decided: a ticket with acceptance criteria, tests and a small blast radius. Deciding stays HITL. Widen one rung at a time: review, then `@claude`, then labels.
```

```checkpoint stays-hitl
Which job on your `recipes` site should stay HITL, rather than go to a label pipeline?
- [ ] Add a health route and its test
- [ ] Fix a typo flagged in a review
- [ ] Rename a component in one file
- [x] Decide how readers should browse recipes
Why: Deciding how readers browse needs your reactions as the input, which is HITL by nature. The other three are small, decided and checkable.
```

```checkpoint vague-ticket
A ticket reads "Make the site better" and has no acceptance criteria. Why not label it `agent:implement`?
- [ ] Labels only work on pull requests
- [x] The agent will guess, and nobody checks
- [ ] Actions can't run on a ticket at all
- [ ] It needs a sub-issue before any label
Why: With no criteria and nobody to ask, the agent picks a default and builds on it. That's the AFK failure Matt describes. Labels do work on issues.
```

## Tell your agent

Use this once you have the lab's practice repo, `cicd-lab`. It adds the first rung of the ladder there, with the least permissions that work.

```text
Add Claude Code pull request review to my practice repo, YOUR_USERNAME/cicd-lab. Do the read-only checks first. Any file change goes on a branch with a pull request. Never push to main and never merge.

1. Check. Confirm the repo exists, and say whether it's public or private. List its secret names with gh secret list (names only). If CLAUDE_CODE_OAUTH_TOKEN isn't there, stop and give me the steps to do myself: install the Claude GitHub App on this one repo only, run claude setup-token in my own terminal, then run gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo YOUR_USERNAME/cicd-lab and paste the token at its prompt. Never ask me for the token, and never print it.
2. Workflow. On a new branch, add .github/workflows/claude-code-review.yml, based on the code-review example under "Run a skill" in https://code.claude.com/docs/en/github-actions, with:
   - on: pull_request (opened, synchronize, ready_for_review, reopened). Never pull_request_target.
   - Job permissions exactly contents: read, pull-requests: read, issues: read, id-token: write. Nothing else.
   - claude_code_oauth_token from the secret, instead of anthropic_api_key.
   - claude_args: --allowedTools with only mcp__github_inline_comment__create_inline_comment, plus --max-turns 10. If a run stops at that limit, tell me instead of raising it.
   - timeout-minutes: 15, and a concurrency group per pull request.
   - anthropics/claude-code-action pinned to the full commit SHA that the v1 tag points to today, with the version in a comment.
   No claude.yml (@claude) workflow yet. No allowed_bots, no allowed_non_write_users, no show_full_output, and no ${{ }} inside any run: step.
3. Open the pull request, and show me the YAML with one line per setting saying why it's there. Wait for me to merge.
4. After I merge, open a small test pull request with an obvious bug. Show me Claude's review comments, how long the run took, and that the required Verify check still gates the merge.

End with what you changed, the commands you ran, and anything you couldn't verify.
```

```checkpoint prompt-why-sha
The prompt asks for the action pinned to a full commit SHA instead of `@v1`. Why?
- [x] The `v1` tag can move to different code
- [ ] GitHub refuses tags in the `uses:` line
- [ ] A SHA makes every review run faster
- [ ] The secret only works with a SHA
Why: Anthropic moves the `v1` tag to each new release, and anyone who controls a tag can move it. A full commit SHA always means the same code.
```

## Try it

````try
You need the GitHub CLI, signed in. These commands only read; they change nothing.

1. Ask GitHub for the action's latest release, and Sandcastle's one-line description:

```sh
gh api repos/anthropics/claude-code-action/releases/latest --jq .tag_name
gh api repos/mattpocock/sandcastle --jq .description
```

2. Print the eight workflow rows of Matt's spec:

```sh
gh api repos/mattpocock/course-video-manager/contents/docs/agents/afk-agent-platform-spec.md -H "Accept: application/vnd.github.raw" | grep -E '^\| [1-8] +\|'
```

3. List your practice repo's secrets, by name only:

```sh
gh secret list --repo YOUR_USERNAME/cicd-lab
```

You should see `v1` first: the release GitHub marks as latest, whose tag Anthropic moves to each new patch release. Then Sandcastle's description, "Orchestrate sandboxed coding agents in TypeScript with sandcastle.run()". Then the spec's eight workflows, the same eight as the table above. Last, your secrets' names, never their values; after setup, `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY` is among them.
````

For the reasoning behind the platform, read parts 2 and 3.9 of the [full spec](https://github.com/mattpocock/course-video-manager/blob/main/docs/agents/afk-agent-platform-spec.md). For the shape of the loop, watch Matt's [AFK software factory video](https://www.youtube.com/watch?v=E5-QK3CDVQM), about 11 minutes. The safety rules above are what to add when that loop moves into GitHub Actions.

## Remember

```flashcards
Q: What decides whether `claude-code-action` waits for `@claude` or runs on every event?
A: The `prompt` input. Without it, interactive mode waits for `@claude`. With it, automation mode runs on every event the workflow listens to.

Q: What three pieces does Claude's action need before it can run?
A: The Claude GitHub App on the repo, one secret (`ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN`), and a workflow file.

Q: What does one run of an agent in Actions cost?
A: GitHub Actions minutes for the machine, plus model usage: API tokens, or your Claude plan's allowance.

Q: In Matt's AFK platform, what makes the changes on GitHub?
A: The workflow steps: labels, comments, pushes and pull requests. The agent only commits locally and writes files.

Q: Why does Matt's spec need `AGENT_PAT` on top of `GITHUB_TOKEN`?
A: Events caused by `GITHUB_TOKEN` don't start workflows, so a label added with it can't start the next step.

Q: What is a pwn request?
A: A `pull_request_target` workflow that checks out and runs a pull request's own code, which then runs with your secrets and a write token.

Q: How do you use an issue's title safely in a `run:` step?
A: Pass it through `env:`, then use `"$TITLE"` in the script. Never put `${{ }}` inside `run:`.

Q: What is prompt injection, and what defends against it?
A: Hidden instructions in text the agent reads. Only trusted people start runs, you read raw text before labelling, and the agent gets only the tools its job needs.

Q: Which work suits an AFK run?
A: Work that's already decided: a ticket with acceptance criteria, tests that check it, and a small blast radius.

Q: Why pin `claude-code-action` to a full commit SHA?
A: The `v1` tag moves to each new release. A SHA always means the same code.
```

## Final test

```final-test which-kind-of-agent
A workflow uses `anthropics/claude-code-action` with a `prompt` input, and runs on `pull_request`. Which kind of agent is it?
- [ ] An on-demand `@claude` comment helper
- [ ] A label-triggered AFK agent pipeline
- [ ] A HITL session that you steer
- [x] An automatic reviewer on pull requests
Why: A `prompt` means automation mode: it runs on every matching event, here every pull request, with no mention needed. That's automatic review.
```

```final-test why-agent-pat
Why does Matt's spec ask for `AGENT_PAT` on top of `GITHUB_TOKEN`?
- [x] So one step can start the next
- [ ] So the agent can merge into `main`
- [ ] So reviews post as your own account
- [ ] So secrets show up in the logs
Why: Events from `GITHUB_TOKEN` don't start workflows, so chained labels need a personal token. Nothing in the platform merges.
```

```final-test fork-safe-trigger
Your review workflow must read pull request code, on a public repo that takes pull requests from forks. Which trigger keeps a fork's code away from your secrets?
- [ ] `pull_request_target`, with a head checkout
- [ ] `workflow_dispatch`, from the Run button
- [x] `pull_request`, as in Claude Code's docs
- [ ] `issue_comment`, on the pull request
Why: `pull_request` gives fork pull requests a read-only token and no secrets. `pull_request_target` with a head checkout is the pwn-request pattern.
```

```final-test sandcastle-edits
In Sandcastle, with a Docker sandbox and a `branch` strategy, how do the agent's edits reach your repo?
- [ ] It emails a patch file to you
- [x] A worktree is bind-mounted into the container
- [ ] It pushes its commits straight to `main`
- [ ] GitHub copies the files after the job
Why: Sandcastle makes a git worktree on the branch and bind-mounts it into the container. The agent's commits land in your repo, and `run()` returns them.
```

```final-test first-afk-ticket
Which ticket is the best first candidate for an AFK run?
- [ ] Choose the recipes site's colours and typefaces
- [ ] Write the spec for a new recipe search feature
- [ ] Decide how readers should browse the recipes
- [x] Build a tested slice with acceptance criteria
Why: AFK suits work that's already decided and checkable. The other three are decisions, which need you in the loop.
```

```final-test verify-missing-approve
Your ruleset requires `Verify`. A workflow agent pushes a fix to an open pull request with the plain `GITHUB_TOKEN`. An hour later, the merge box still waits for `Verify`. What's going on?
- [ ] The ruleset broke, so switch it off
- [ ] GitHub is busy, so push again
- [ ] Vercel is holding it, so Force Promote
- [x] CI's run awaits approval, so approve it
Why: When a workflow updates a pull request with `GITHUB_TOKEN`, CI's run waits for approval, so `Verify` is missing. The gate held; nothing is broken. Force Promote is for production deployments, not pull requests.
```

```final-test prompt-changes-mode
A workflow runs `claude-code-action` on every new issue comment, with no `prompt`, so it replies only when a comment mentions `@claude`. An agent adds a `prompt`: "Keep every change small." What changes?
- [ ] Nothing: it still waits for `@claude`
- [x] It now runs on every new comment
- [ ] It opens a pull request after each change
- [ ] It fails, because no trigger phrase is set
Why: `prompt` is the switch between the two modes. With it, the action does that job on every event the workflow listens to, mention or not. The instruction stops being a rule and becomes the job itself.
```

```final-test branch-from-title
An agent drafts a step for a label pipeline that names the new branch after the issue: `- run: git switch -c agent/${{ github.event.issue.title }}`. What do you ask it to change?
- [ ] Add `contents: write` to the job
- [ ] Mask the title with a secret
- [ ] Switch the trigger to `pull_request_target`
- [x] Pass the title in through `env:`
Why: Whoever opens an issue types its title, and GitHub pastes `${{ … }}` into the script before the shell runs. Through `env:`, it's only data. Titles aren't secrets, and `pull_request_target` would add your secrets to the risk.
```

```final-test first-agent-this-week
You want your first agent running in GitHub Actions this week, and your real project's gates aren't on yet. Which first step fits Matt's advice to start narrow?
- [ ] A label pipeline on your real project
- [ ] `@claude` fixes on your real project
- [x] Automatic review on a practice repo
- [ ] A whole spec built AFK overnight
Why: Start where the job only reads and the agent can only comment, so you learn what a run costs and catches. Review on the real project waits for its gates, `@claude` comes once reviews prove useful, and labels need GitHub Issues.
```

```sources
- [AFK](https://www.aihero.dev/ai-coding-dictionary/afk), AI Hero AI coding dictionary, Matt Pocock
- [Human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop), AI Hero AI coding dictionary, Matt Pocock
- [Software factory](https://www.aihero.dev/ai-coding-dictionary/software-factory), AI Hero AI coding dictionary, Matt Pocock
- [GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners), GitHub Docs
- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions), Claude Code Docs
- [claude-code-action README](https://github.com/anthropics/claude-code-action), Anthropic
- [claude-code-action: Security](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md), Anthropic
- [claude-code-action: Usage](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md), Anthropic
- [claude-code-action: token.ts](https://github.com/anthropics/claude-code-action/blob/main/src/github/token.ts), Anthropic
- [Authentication](https://code.claude.com/docs/en/authentication), Claude Code Docs
- [Installing a GitHub App from a third party](https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party), GitHub Docs
- [GitHub-Native AFK Agent Platform spec](https://github.com/mattpocock/course-video-manager/blob/main/docs/agents/afk-agent-platform-spec.md), Matt Pocock
- [Sandcastle](https://github.com/mattpocock/sandcastle), Matt Pocock
- [I Open-Sourced My Own AFK Software Factory](https://www.youtube.com/watch?v=E5-QK3CDVQM), Matt Pocock, 2026-04-30
- [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token), GitHub Docs
- [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), GitHub Docs
- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use), GitHub Docs
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), GitHub Docs
- [Securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target), GitHub Docs
- [Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/), GitHub Security Lab
- [Script injections](https://docs.github.com/en/actions/concepts/security/script-injections), GitHub Docs
- [Managing labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels), GitHub Docs
- [Repository roles for an organization](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization), GitHub Docs
- [to-tickets SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
```
