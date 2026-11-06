---
title: Agents in GitHub Actions
slug: agents-in-github-actions
summary: Tell apart the three kinds of agent you can run in GitHub (on demand, automatic review and label-triggered), say what each one needs before it can run, and check six safety rules before you switch…
---

Every agent that has touched Care4Mind so far started because you opened a terminal and typed. On 27 October its `main` branch had no `.github` folder, the front-end branch’s CI workflow had never run, and the repo had no GitHub issues; its tickets are Markdown files in `.scratch/`. This lesson is about the other way to start an agent: an event on GitHub, a machine nobody is watching, and a pull request waiting for you at the end.

```goals
- You’ll be able to tell apart the three kinds of agent you can run in GitHub (on demand, automatic review and label-triggered), say what each one needs before it can run, and check six safety rules before you switch one on.
```

## Why run an agent in Actions

Lessons 1 and 14 used two words for how you work with an agent. **HITL** (human-in-the-loop) work is done with you there, watching and steering. **AFK** (away-from-keyboard) work runs unattended: you start the session and leave. Matt’s dictionary adds the catch: AFK usually means letting the agent act without asking permission, so it needs a sandbox: an isolated place where its mistakes can’t reach the rest of your machine. So far, any AFK run of yours would have happened on your laptop.

Run the same agent inside GitHub Actions and four things change. It runs on GitHub’s machines: each job gets a new virtual machine, the same kind your CI `check` runs on (Lesson 10), so your laptop can be shut. It’s started by an event: a comment, a PR opening, a label, a timer. It works where the gates are, so its PR meets the same ruleset and the same `check` as yours. And it ends in something you review: a comment or a PR. Matt calls a setup where triggers, not people, start agent sessions a **software factory**.

| Kind | Started by | What the agent may do | Ends in |
|---|---|---|---|
| **On demand** | You, writing `@claude …` in an issue or PR comment | Answer, or commit to a new branch | A reply, and a link for you to open the PR |
| **Automatic review** | A PR being opened or updated | Read the diff, post comments | Comments on the PR |
| **Label-triggered AFK** | A label such as `agent:implement` | Write code, review, update branches | A PR waiting for your review |

Read the table top to bottom as a ladder. Each row starts with less of you and lets the agent change more.

```callout remember
An agent in Actions is AFK by design: an event starts it on a fresh GitHub machine, and it ends in something you review. On demand and review agents wait for you or your PRs; a label pipeline does the work itself.
```

```checkpoint check-1
You comment “@claude why does the server crash on an empty body?” on a cicd-lab PR, then shut your laptop. Where does the agent run?
- [ ] In Orca on your laptop
- [ ] Inside the Vercel preview deployment
- [x] On a fresh GitHub machine
- [ ] Nowhere until you reopen it
Why: The workflow’s job gets a fresh GitHub-hosted runner, so your laptop doesn’t matter. A preview deployment serves the site; it doesn’t run agents.
```

```checkpoint check-2
Which of these is a software factory in Matt’s sense?
- [x] A label on an issue starts a session
- [ ] You open an Orca session for each ticket
- [ ] You read every agent diff before it merges
- [ ] An agent pauses to ask you each question
Why: A factory is defined by what starts the session: a trigger, not a person. Opening Orca yourself is AFK at best, but you still start it.
```

## Claude Code’s action: @claude and automatic review

Anthropic’s ready-made agent for Actions is `anthropics/claude-code-action`. It is an **action**: a packaged step that a workflow pulls in with `uses:`, like `actions/checkout` in Lesson 11. It installs Claude Code on the runner and runs it there. The calls to the model go out to Anthropic, or to the cloud provider you choose.

One input decides how it behaves: `prompt`. Leave it out and the action runs in **interactive mode**: it waits for `@claude` in a comment, a PR review, or the title or body of a new issue, then replies in a comment and updates it as it works. If you ask for a change, it commits to a new branch and gives you a link to open the PR yourself. Give it a `prompt` and it runs in **automation mode**: it does that job on every event the workflow listens to, with no mention needed. Automatic review is automation mode with “review this PR” as the job.

Here is the review workflow from Claude Code’s docs. The quick setup in the next section writes one that runs the same `code-review` plugin:

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
          plugin_marketplaces: "https://github.com/anthropics/claude-code.git"
          plugins: "code-review@claude-code-plugins"
          prompt: "/code-review:code-review --comment ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'
```

Read it the way Lesson 11 taught you. `on: pull_request` runs it when a PR is opened, pushed to, reopened or marked ready. The job’s own token may only _read_. The comments go out through the Claude GitHub App, which the action signs in as by default; `id-token: write` is what lets it do that. The `prompt` runs the plugin’s review skill on this PR, and `--comment` posts the findings on the PR instead of only in the log. It skips drafts and reviews each PR once.

The last line is the limit that matters most. `claude_args` passes flags straight to Claude Code, and `--allowedTools` names tools the agent may use without asking. In a run nobody watches there is nobody to ask, so a tool that hasn’t been granted (here, or in the skill’s own settings) can’t be used. This review grants exactly one extra tool: the one that posts inline comments. These are the inputs you’ll meet most:

| Input | What it sets |
|---|---|
| `prompt` | The job, as plain text or a skill such as `/code-review:code-review`. Leave it out for `@claude` mode. |
| `claude_args` | Claude Code’s own flags: `--allowedTools`, `--max-turns` (a cap on turns), `--model`. The old `max_turns` and `model` inputs moved here. |
| `anthropic_api_key` or `claude_code_oauth_token` | How the run pays: an API key, or your Claude subscription |
| `label_trigger` | A label that starts it when someone adds it to an issue |

```callout remember
No `prompt`: it waits for `@claude`, commits to a branch, and you open the PR. A `prompt`: it runs on every matching event, such as each PR. Its limits live in `claude_args`: `--allowedTools` and `--max-turns`.
```

```checkpoint check-3
Your `@claude` workflow has no `prompt`. You comment “@claude fix the TypeError in the signup route” on an issue. When it finishes, what is on GitHub?
- [ ] A new commit merged into main
- [ ] An approved review on a PR
- [x] A branch and a PR link
- [ ] Nothing happens until you run it
Why: In interactive mode Claude commits to a new branch and links you to open the PR yourself. By default it neither merges nor opens the PR for you.
```

```checkpoint check-4
You want every automatic review to stop after a few turns. Where does that limit go?
- [ ] In the job’s `permissions` block
- [x] In the `claude_args` `--max-turns` flag
- [ ] In the `trigger_phrase` input value
- [ ] In the repository’s ruleset settings
Why: `claude_args` passes Claude Code’s own flags, and `--max-turns` caps the turns. `permissions` limits the job’s token, not how long the agent works.
```

```checkpoint check-5
A teammate deletes the `claude_args` line from the review workflow because the skill already names the tool. What happens?
- [x] Claude reviews but cannot post inline comments
- [ ] Claude gets every tool without any limits
- [ ] The whole workflow refuses to start running
- [ ] Reviews post twice on each pull request
Why: The action starts the inline-comment server only when `--allowedTools` in `claude_args` names it. Without the line, the findings can’t go on the PR as inline comments. Removing a grant never adds tools.
```

## What switching it on takes

Three pieces: the Claude GitHub App on the repo, one secret, and a workflow file. The quick route is a command you type yourself inside Claude Code, in the repo’s folder: `/install-github-app`. It expects the GitHub CLI signed in, and needs admin rights on the repo and a github.com remote. It installs the app, saves the secret, then pushes a branch with `claude.yml` (the `@claude` workflow) and, if you pick it, `claude-code-review.yml`, and opens a PR for you to create. Nothing works until you merge that PR: on the setup PR itself, the action skips its run because the workflow isn’t on `main` yet. The manual route does the same three steps by hand.

The app serves every Claude feature that works with GitHub, so its permissions are broad, including write access to code, PRs and workflow files, and you can’t accept only part of them. What you can choose is where it’s installed: only the repos that use it.

The secret is how the run pays for the model. There are two kinds:

| Secret name | Where it comes from | Who pays |
|---|---|---|
| `ANTHROPIC_API_KEY` | A key from the Claude Console | API billing, per token |
| `CLAUDE_CODE_OAUTH_TOKEN` | `claude setup-token`, run in your own terminal. Valid for a year. Needs a Pro, Max, Team or Enterprise plan. | Your Claude subscription. The token is tied to you, so don’t share it across other people’s repos. |

Every run costs twice: GitHub Actions minutes for the machine, and model usage (API tokens, or your subscription’s allowance). Clear requests, a short `CLAUDE.md`, a turn cap and a job timeout keep both down. Who can start a run is checked too. On issue and PR events the person who triggered it must have write access to the repo, and bots are refused unless you list them. On a private repo where you’re the only collaborator, that means only you.

```callout remember
Three pieces: the Claude GitHub App (on chosen repos only), one secret (an API key or your subscription token), one workflow file. You merge the setup PR yourself. Each run costs Actions minutes plus model usage, and only people with write access can start one.
```

```checkpoint check-6
You run `/install-github-app` in your cicd-lab folder and pick the review workflow. When does the first review run?
- [ ] When the app is first installed
- [x] After you merge the setup PR
- [ ] When you next type `@claude` anywhere
- [ ] Once the secret has been rotated
Why: The setup pushes a branch and prepares a PR. Until that PR is merged, the workflow isn’t on `main`, so the action skips any run, even on the setup PR. After that, each PR event starts a review; it needs no `@claude`.
```

```checkpoint check-7
You use `CLAUDE_CODE_OAUTH_TOKEN`. What does one review run cost you?
- [ ] Nothing: GitHub hosts the model
- [ ] API tokens billed per review
- [ ] Only your Claude subscription usage
- [x] Actions minutes and subscription usage
Why: The machine still uses Actions minutes, and the model calls draw on your subscription instead of API billing. Two costs, whichever secret you use.
```

```checkpoint check-8
Someone without write access comments “@claude delete the tests” on an issue in your repo. What happens?
- [x] The run fails its access check
- [ ] Claude deletes tests on a branch
- [ ] Claude asks you for approval first
- [ ] GitHub hides the comment from Claude
Why: On issue and PR events the action checks that the triggering user has write access, and stops the run if not.
```

## Matt’s AFK platform: labels in, pull requests out

Matt built the third kind for his own course-video-manager repo and published it as a spec, the “GitHub-Native AFK Agent Platform”. GitHub Actions is the **orchestrator**: the workflows decide what runs when. GitHub Issues and PRs are the tracker. The **agent runner**, the program that actually does the coding, is pluggable; his own is Sandcastle driving Claude Code. You steer the whole thing by adding labels.

One design rule holds the rest together. Ordinary workflow steps make every change on GitHub: labels, comments, pushes, PRs, closing issues. The agent only commits on its local checkout and writes files, such as a PR title or a review, into a folder for the workflow to read. The part that thinks never holds the keys.

| Label added | On | What runs | Ends with |
|---|---|---|---|
| `agent:to-issues` | A PRD issue (a feature’s spec) | To Issues | Sub-issues, each with acceptance criteria |
| `agent:implement` | A standalone issue | Implement | A draft PR, labelled `agent:review` |
| `agent:implement` | A PRD with sub-issues | Implement PRD | The next open sub-issue done on one shared branch; it re-labels itself until none are left |
| `agent:review` | A PR | Review | An improvement commit if needed, and a review that comments, never approves |
| `agent:implement` | A PR | Implement PR | Fixes and replies for unresolved review comments |
| `agent:update-branch` | A PR | Update Branch | `main` merged in; the agent runs only if there are conflicts |
| (an issue closes) | Its dependents | Promote Queued | `agent:queued` issues with no open blockers move to `agent:implement` |
| (weekday timer) | The codebase | Architecture Review | One proposed PRD issue |

Labels are the state too. `agent:in-progress` locks an item while a run is going; a failed run adds `agent:blocked` and a comment saying why, and adding the trigger label again retries it. Nothing in the system merges: the last step is always yours.

It runs on two GitHub tokens. `GITHUB_TOKEN`, the one GitHub makes for every job, does most of the work. But GitHub ignores events caused by that token, so that a workflow can’t set itself off in a loop, and a label added with it lands without starting the next workflow. So the spec adds `AGENT_PAT`, a personal access token (one tied to a person’s account) kept as a secret, for each hop that must start the next step. Without it the chain stops at every hop until you add the label yourself. The agent’s own credential, `CLAUDE_CODE_OAUTH_TOKEN`, is passed only into the agent’s step.

Two settings from Lesson 11 return with a twist. The three workflows that push to a PR share one `concurrency` group per PR, so they never push to the same branch at once, and they set `cancel-in-progress: false`, the opposite of your CI: a half-finished agent run is expensive, so the newer one waits. And each workflow asks for the least `permissions` it needs; Promote Queued gets only `issues: write`.

**Sandcastle** is the runner, and you know most of its parts already. In TypeScript you call `run()` with an agent (for example `claudeCode(…)`), a sandbox (`docker()`, `podman()` or `vercel()`) and a prompt. Ask for a branch and it makes a git worktree on that branch, then bind-mounts the folder into a Docker container, as `docker run -v` does. Its default image (Node 22, git, the GitHub CLI, Claude Code) runs as a user without root rights. The agent commits inside; you get the commits back in `result.commits`. Because the container is the boundary, Sandcastle skips Claude’s permission prompts on AFK runs by default, and runs one iteration unless you ask for more.

Inside Actions, Matt’s spec runs Sandcastle with `noSandbox()`. The spec doesn’t say why; a likely reason is that the runner is already a fresh machine that’s thrown away after the job. As for Care4Mind: the spec needs GitHub Issues, and Care4Mind’s tickets are Markdown files in `.scratch/`, so adopting it means moving the tickets to GitHub Issues first (Lesson 14 showed how). Sandcastle alone is looser; its setup offers other trackers too.

```callout remember
Labels are both the controls and the state. The workflow holds the keys and makes every change on GitHub; the agent only commits and writes files. `AGENT_PAT` lets one step start the next. A human still merges.
```

```checkpoint check-9
Your repo runs Matt’s platform without `AGENT_PAT`. Implement opens a draft PR and adds `agent:review` using `GITHUB_TOKEN`. What happens next?
- [ ] Review starts within a minute
- [ ] The label is silently rejected
- [x] The label lands; Review waits
- [ ] Implement retries with your token
Why: GitHub doesn’t start workflows from events caused by `GITHUB_TOKEN`, so the label is there but Review doesn’t run until a person adds it again. That’s the spec’s graceful fallback.
```

```checkpoint check-10
In Matt’s platform, which part pushes the agent’s commits to GitHub?
- [x] The workflow steps around it
- [ ] The agent, using its token
- [ ] The Docker container running Sandcastle
- [ ] The Claude GitHub App itself
Why: The orchestrator owns every change on GitHub, pushes included. The agent only commits locally and writes files; it never holds a GitHub token.
```

```checkpoint check-11
Why do the platform’s concurrency groups use `cancel-in-progress: false`, unlike your CI?
- [ ] GitHub forbids cancelling any labelled runs
- [ ] Labels cannot start a second run
- [ ] Cancelling would lose the PR’s comments
- [x] Agent runs are expensive; newer waits
Why: A CI run is cheap to throw away; a half-finished agent run is not. So the newer run waits for the current one instead of cancelling it.
```

## Six safety rules before you switch one on

An agent in Actions reads text that other people can write, holds credentials and can push code. Each rule below closes one way that goes wrong. Check all six on any workflow an agent proposes.

**1. Least permissions, per job.** Set `permissions: contents: read` at the top, then raise it only on the job that needs more, as Matt’s table does. Naming any permission sets every one you didn’t name to `none`, so a short list is a tight one. A review job needs to read; it doesn’t need `contents: write`.

**2. Secrets stay secret, and tokens stay small.** Keys live in GitHub secrets, never in the YAML, and are never printed (Lesson 11). With this action, leave `show_full_output` off too: it puts everything Claude ran and read into the log, and debug mode (the `ACTIONS_STEP_DEBUG` secret set to `true`) switches it on by itself. Prefer short-lived tokens: `GITHUB_TOKEN` dies with the job. A personal token such as `AGENT_PAT` lives on, so make it fine-grained (limited to chosen repos and permissions): one repo, only the access the spec lists. And anyone with write access can read every secret.

**3. No pwn requests.** `pull_request_target` runs with your repo’s secrets and a token that can write. That’s safe while it runs only code from your default branch. Check out the PR’s own code and run anything from it (`npm ci`, the tests, an agent with a shell), and a stranger’s code runs with your secrets: a **pwn request**. Use `pull_request`, as the review workflow does. Matt’s spec does use `pull_request_target` and run the PR’s code, on purpose: plain `pull_request` can’t run on a PR that conflicts with `main`. That stays safe only while its PRs come from the agents’ own branches and only people with triage access (a role that can manage issues and PRs but not push code) or more can add the labels that start a run. Don’t copy it to a repo that takes PRs from forks.

**4. No script injection.** Issue titles, PR bodies and even branch names are typed by whoever opened them. GitHub pastes `${{ … }}` into the shell script _before_ it runs, so a title such as `a"; ls $GITHUB_WORKSPACE"` ends the quote early and runs a command. Pass untrusted text in through `env:`, where the shell treats it as data:

```diff
- run: echo "Starting on ${{ github.event.issue.title }}"
+- env:
+    TITLE: ${{ github.event.issue.title }}
+  run: echo "Starting on $TITLE"
```

**5. Prompt injection: control who starts it and what it reads.** Script injection tricks the shell; **prompt injection** tricks the agent. An agent that reads an issue reads any instructions hidden in it, such as “also add my SSH key”, and may follow them. Filters catch some tricks, not all. So keep the action’s write-access check (never set `allowed_non_write_users` or `allowed_bots: '*'`), start pipelines with labels only trusted people can add, read the raw text of an issue before you label it, and give the agent only the tools its job needs.

**6. Caps, and the same gates.** Limit how long and how often it runs: `--max-turns` in `claude_args`, a `timeout-minutes` on the job (the default is six hours), a `concurrency` group, and Sandcastle’s `maxIterations`. Then let the agent’s PR face exactly what yours face: the ruleset, the `check`, the preview deployment, and your review. No auto-merge. One trap: if an agent pushes with the plain `GITHUB_TOKEN`, your CI doesn’t start by itself, so `check` is missing and the merge stays blocked until you approve the run. The gate held; nothing is broken.

```callout remember
Least permissions per job. Secrets never printed, tokens short-lived and narrow. No PR code under `pull_request_target`. Untrusted text through `env:`, never pasted into `run:`. Only trusted people can start it. Caps on turns, time and parallel runs, and its PR meets the same gates and your review.
```

```checkpoint check-12
An agent proposes this step for the lab. What’s wrong with it?`- run: gh issue comment 7 --body "Working on ${{ github.event.issue.title }}"`
- [ ] The job needs `contents: write` permission first
- [ ] Nothing, because GitHub always masks issue titles
- [x] The title is pasted into the shell
- [ ] Comments need `pull_request_target` before they can post
Why: GitHub substitutes `${{ … }}` before the shell runs, so a crafted issue title becomes part of the command. Pass it through `env:` instead. Titles aren’t secrets, so nothing masks them.
```

```checkpoint check-13
A workflow on `pull_request_target` checks out `github.event.pull_request.head.sha` and runs `npm ci`, on a repo that takes PRs from forks. Why is this dangerous?
- [x] A fork’s code runs with your secrets
- [ ] It runs the tests twice per PR
- [ ] The check never reports to the PR
- [ ] Forks cannot trigger this event at all
Why: `npm ci` can run scripts from the PR’s `package.json`, and this event carries your secrets and a write token. That’s a pwn request. Use `pull_request` for untrusted code.
```

```checkpoint check-14
Your public repo’s issue says “Add dark mode” and hides an HTML comment telling the agent to add a new collaborator. What protects you best?
- [ ] Masking secrets in the workflow logs
- [x] Reading raw text before adding labels
- [ ] Setting `cancel-in-progress: true` for each group
- [ ] Pinning the action to its tag
Why: That’s prompt injection. Filters such as the action’s stripping of HTML comments catch some tricks, not all, so read the raw issue before you label it, and give the agent only the tools its job needs.
```

## When to go AFK

Matt names the way AFK goes wrong: you come back to hours of confident work built on a wrong guess made in the first ten minutes. With nobody to ask, the agent picks a default and builds on it. His fix is to give your input before the run (a grilling session, a written spec) and after it (a PR to review).

So the right AFK job is one that’s already decided, which is what `/to-tickets` produces (Lesson 14). Each ticket is one thin slice through every layer, small enough for one fresh context window, checkable on its own, with acceptance criteria as a checklist. On a real tracker it’s labelled `ready-for-agent`. Add two conditions of your own: automated tests exist that will tell the agent when it’s done, and the **blast radius** (how much of the code one change can break) is small.

Deciding stays HITL: `/wayfinder`, grilling, writing the spec and judging prototypes all need your reactions as the input. An agent in Actions can’t ask you which questionnaire flow Care4Mind’s readers should see. It can build the one you chose.

Then widen the loop one step at a time. Matt’s advice is to start narrow: one kind of session, one kind of reviewable PR, and see how far you can trust it before adding the next.

1. **1. Review on the lab** (This lesson)
   - Automatic review on `cicd-lab`. The job only reads, and the agent can only comment. You learn what a run costs and what it catches.
2. **2. Review on Care4Mind** (After Lesson 16’s gates are on)
   - The same workflow, once Care4Mind has its `check` and ruleset. Its comments then sit beside the gates on every agent PR.
3. **3. @claude on demand** (When reviews are useful)
   - Small fixes you ask for in a comment. It writes to branches, and you open and merge the PRs.
4. **4. A label pipeline** (Only after tickets live in GitHub Issues)
   - Matt’s platform, or your own Sandcastle loop, for `ready-for-agent` tickets only. A human still merges.

```callout remember
AFK suits work that’s already decided: a `/to-tickets` slice with acceptance criteria, tests and a small blast radius. Deciding stays HITL. Widen one step at a time: review, then `@claude`, then labels.
```

```checkpoint check-15
Which Care4Mind job should stay HITL rather than go to a label pipeline?
- [ ] Add a health route and test
- [ ] Fix a typo flagged in review
- [ ] Rename a component in one file
- [x] Decide how the questionnaire should flow
Why: Deciding the flow needs your reactions as the input, which is HITL by nature. The other three are small, decided and checkable.
```

```checkpoint check-16
A ticket reads “Make the site better” and has no acceptance criteria. Why not label it `agent:implement`?
- [ ] Labels only work on PRs
- [x] The agent will guess, unchecked
- [ ] Actions cannot run on tickets
- [ ] It needs a sub-issue first
Why: With no criteria and nobody to ask, the agent picks a default and builds on it. That’s the AFK failure Matt describes. Labels do work on issues.
```

## Tell your agent

Use this once your Lesson 13 lab repo exists. It adds the first rung of the ladder there, not on Care4Mind, with the least permissions that work.

```text
Add Claude Code pull-request review to my lab repo, SiddharthMuramkar/cicd-lab. Not Care4Mind. Do the read-only checks first. Any file change goes on a branch with a PR. Never push to main and never merge.

1. Check. Confirm the repo exists and say whether it's public or private. List its secret names with gh secret list (names only). If CLAUDE_CODE_OAUTH_TOKEN isn't there, stop and give me the steps to do myself: install the Claude GitHub App on this one repo only, run claude setup-token in my own terminal, then run gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo SiddharthMuramkar/cicd-lab and paste the token at its prompt. Never ask me for the token and never print it.
2. Workflow. On a new branch, add .github/workflows/claude-code-review.yml based on the code-review example under "Run a skill" in https://code.claude.com/docs/en/github-actions, with:
   - on: pull_request (opened, synchronize, ready_for_review, reopened). Never pull_request_target.
   - job permissions exactly contents: read, pull-requests: read, issues: read, id-token: write. Nothing else.
   - claude_code_oauth_token from the secret instead of anthropic_api_key.
   - claude_args: --allowedTools with only mcp__github_inline_comment__create_inline_comment, plus --max-turns 10. If a run stops at that limit, tell me instead of raising it.
   - timeout-minutes: 15, and a concurrency group per PR.
   - anthropics/claude-code-action pinned to the full commit SHA that the v1 tag points to today, with the version in a comment.
   No claude.yml (@claude) workflow yet. No allowed_bots, no allowed_non_write_users, no show_full_output, and no ${{ }} inside any run: step.
3. Open the PR and show me the YAML, with one line per setting saying why it's there. Wait for me to merge.
4. After I merge, open a small test PR with an obvious bug. Show me Claude's review comments, how long the run took, and that the required Verify check still gates the merge.

End with what you changed, the commands you ran, and anything you couldn't verify.
```

## Try it

These commands only read; they change nothing. Run them anywhere the GitHub CLI is signed in:

```sh
gh api repos/anthropics/claude-code-action/releases/latest --jq .tag_name
gh api repos/mattpocock/sandcastle --jq '.description'
gh api repos/mattpocock/course-video-manager/contents/docs/agents/afk-agent-platform-spec.md -H "Accept: application/vnd.github.raw" | grep -E '^\| [1-8] +\|'
gh api repos/SiddharthMuramkar/care4mind --jq '{has_issues, open_issues_count}'
```

The first prints `v1`: the release GitHub marks as latest, and the tag behind `@v1`. Anthropic moves that tag to each new patch release, and those come out almost daily, which is why the prompt above pins a commit SHA instead. The second prints Sandcastle’s one-line description, “Orchestrate sandboxed coding agents in TypeScript with sandcastle.run()”. The third prints the spec’s eight workflow rows, the same eight as this lesson’s table; then read §2 and §3.9 of the [full spec](https://github.com/mattpocock/course-video-manager/blob/main/docs/agents/afk-agent-platform-spec.md). The last shows `has_issues` true and `open_issues_count` 0: Care4Mind has issues switched on but none in use, because its tickets live in `.scratch/`.

## Practice

### Which rule does it break?

For each workflow an agent proposes, pick the safety rule it breaks.

```checkpoint check-17
The review job has `permissions: write-all`, though it only reads code and posts comments through the Claude app.
- [x] Permissions
- [ ] Secrets
- [ ] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: A review job needs to read. `write-all` hands every write permission to anything that runs in the job.
```

```checkpoint check-18
A step’s `run:` line builds a branch name from `${{ github.event.issue.title }}`.
- [ ] Permissions
- [ ] Secrets
- [ ] Pwn request
- [x] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: The title is pasted into the shell before it runs. Pass it in through `env:`.
```

```checkpoint check-19
To debug a failing run, someone sets the `ACTIONS_STEP_DEBUG` secret to `true` on a public repo.
- [ ] Permissions
- [x] Secrets
- [ ] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: Debug mode switches on the action’s full output, which can print tokens and file contents into logs anyone can read.
```

```checkpoint check-20
A label pipeline’s PRs are set to auto-merge once the agent’s own review passes.
- [ ] Permissions
- [ ] Secrets
- [ ] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [x] Caps and gates
Why: The agent’s PR must meet the same gates as yours, ending in your review. Matt’s spec never merges.
```

```checkpoint check-21
`allowed_non_write_users: '*'` is set so anyone can ask `@claude` for help.
- [ ] Permissions
- [ ] Secrets
- [ ] Pwn request
- [ ] Script injection
- [x] Prompt injection
- [ ] Caps and gates
Why: It removes the write-access check, so any stranger’s text can steer the agent.
```

```checkpoint check-22
A `pull_request_target` workflow checks out the fork’s head commit and runs its tests.
- [ ] Permissions
- [ ] Secrets
- [x] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: A fork’s code runs with your secrets and a write token. Use `pull_request`.
```

```checkpoint check-23
An AFK workflow has no `timeout-minutes`, no `--max-turns` and no `concurrency` group.
- [ ] Permissions
- [ ] Secrets
- [ ] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [x] Caps and gates
Why: Nothing stops a runaway run before GitHub’s six-hour default, and runs can pile up.
```

```checkpoint check-24
`AGENT_PAT` is a classic token that can write to every repo you own.
- [ ] Permissions
- [x] Secrets
- [ ] Pwn request
- [ ] Script injection
- [ ] Prompt injection
- [ ] Caps and gates
Why: A long-lived token should be fine-grained: one repo, only the access the spec lists.
```

```checkpoint check-25
Issues on a public repo get `agent:implement` without anyone reading their raw text.
- [ ] Permissions
- [ ] Secrets
- [ ] Pwn request
- [ ] Script injection
- [x] Prompt injection
- [ ] Caps and gates
Why: Hidden instructions in an issue reach the agent. Read the raw text before you label.
```

## Check yourself

From memory, without scrolling up.

```final-test final-26
A workflow uses `anthropics/claude-code-action` with a `prompt` input and runs on `pull_request`. Which kind of agent is it?
- [ ] An on-demand `@claude` comment helper
- [ ] A label-triggered AFK agent pipeline
- [ ] A HITL session in Orca
- [x] An automatic reviewer on PRs
Why: A `prompt` means automation mode: it runs on every matching event, here every PR, with no mention needed. That’s automatic review.
```

```final-test final-27
Why does Matt’s spec ask for `AGENT_PAT` on top of `GITHUB_TOKEN`?
- [x] So one step can trigger the next
- [ ] So the agent can merge to `main`
- [ ] So reviews post as your own account
- [ ] So secrets show up in the logs
Why: Events from `GITHUB_TOKEN` don’t start workflows, so chained labels need a personal token. Nothing in the platform merges.
```

```final-test final-28
Your cicd-lab review workflow must read PR code. Which trigger keeps a fork’s code away from your secrets?
- [ ] `pull_request_target` with head checkout
- [ ] `workflow_dispatch` from the button
- [x] `pull_request`, like the docs
- [ ] `issue_comment` on the PR
Why: `pull_request` gives fork PRs a read-only token and no secrets. `pull_request_target` with a head checkout is the pwn-request pattern.
```

```final-test final-29
In Sandcastle with a Docker sandbox and a `branch` strategy, how do the agent’s edits reach your repo?
- [ ] It emails a patch file to you
- [x] A worktree is bind-mounted into the container
- [ ] It pushes its commits straight to `main`
- [ ] GitHub copies the files after the job
Why: Sandcastle makes a git worktree on the branch and bind-mounts it into the container, so the agent’s commits land in your repo, and `run()` returns them.
```

```final-test final-30
Which ticket is the best first candidate for an AFK run?
- [ ] Choose Care4Mind’s colour palette and its typefaces
- [ ] Write the spec for the questionnaire feature
- [ ] Decide how readers should browse the scales
- [x] Build a tested slice with acceptance criteria
Why: AFK suits work that’s already decided and checkable. The other three are decisions, which need you in the loop.
```

## Watch next

**Watch:** [Matt Pocock, “I Open-Sourced My Own AFK Software Factory”](https://www.youtube.com/watch?v=E5-QK3CDVQM), about 11 minutes (30 April 2026). Its description: “Learn how to build AI coding agents that run completely AFK in isolated sandboxes.” It introduces Sandcastle. Watch it for the shape of the loop; this lesson’s safety rules are what to add when that loop moves into GitHub Actions.

Keep the agentic shipping cheat sheet open the next time an agent proposes a workflow file. Check the six safety rules before you merge it.

```sources
- [AI Hero dictionary, AFK](https://www.aihero.dev/ai-coding-dictionary/afk)
- [AI Hero dictionary, Human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)
- [GitHub Docs, GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners)
- [AI Hero dictionary](https://www.aihero.dev/ai-coding-dictionary/software-factory)
- [Claude Code docs, GitHub Actions](https://code.claude.com/docs/en/github-actions)
- [claude-code-action README](https://github.com/anthropics/claude-code-action)
- [claude-code-action, Security](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md)
- [claude-code-action, Usage](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md)
- [claude-code-action, token.ts](https://github.com/anthropics/claude-code-action/blob/main/src/github/token.ts)
- [GitHub Docs, Installing a GitHub App from a third party](https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party)
- [Claude Code docs, Authentication](https://code.claude.com/docs/en/authentication)
- [GitHub-Native AFK Agent Platform spec](https://github.com/mattpocock/course-video-manager/blob/main/docs/agents/afk-agent-platform-spec.md)
- [GitHub Docs, GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token)
- [Sandcastle README](https://github.com/mattpocock/sandcastle)
- [GitHub Docs, Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [GitHub Docs, Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitHub Docs, Securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)
- [GitHub Security Lab, Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
- [Managing labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
- [Repository roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization)
- [GitHub Docs, Script injections](https://docs.github.com/en/actions/concepts/security/script-injections)
- [to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md)
```
