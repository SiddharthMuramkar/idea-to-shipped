---
title: The build loop in practice
slug: spec-driven-build-loop
summary: Take a Spec to production one Ticket per pull request with /implement, or the whole Spec in one pull request with /implement-spec.
image: /images/lessons/spec-driven-build-loop.jpg
imageAlt: A big white Ferris wheel with brightly coloured gondolas spaced around its rim against a blue sky.
---

Say an agent has been building your "Booking API" Spec straight onto one branch: two Tickets built, a dozen commits that `main` has never seen, and no pull request. No check has run on any of it, and nobody has reviewed it. You've met each piece on its own: `/implement` commits, `/pr` shapes a body, CI checks a pull request, Vercel builds a preview. Here they join into one loop, from a Spec to merged, deployed pull requests, with the points only you can hold marked.

```goals
- You'll be able to take a Spec to production one Ticket per pull request with `/implement`, or the whole Spec in one pull request with `/implement-spec`.
- You'll know which steps are yours, which are the agent's, and which are automatic gates.
- You'll be able to say when a run can be left unattended, and when you should stay in the loop.
- You'll know what changes when a project's Tickets live in local files instead of GitHub Issues.
```

## From Tickets to pull requests, with git eyes

[After the map is clear](/learn/after-the-map) set out the planning end. You run `/to-spec`, then `/to-tickets`, in the same session, with no `/clear` between them. `/to-spec` checks its test seams with you and publishes the Spec. `/to-tickets` shows you a numbered list of thin end-to-end slices, each with the Tickets that block it, and publishes one Issue per Ticket once you approve. The Tickets whose blockers are all done form the frontier: the ones an agent can start now.

Now look at the same step the way git sees it. On GitHub Issues, as in the practice project, the Spec and its Tickets live on GitHub, not in your repo. Every branch sees the same Tickets, and git only ever sees the code.

**So each Ticket's code reaches production on its own road: a fresh branch, a pull request, the gates, your review and a merge.**

Say the Booking API Spec has five Tickets, and the first two have merged, each through its own pull request:

```text
#11 Booking API                                  Spec
├── #12 List bookings                             closed
├── #13 Create a booking                          closed · blocked by #12
├── #14 Cancel a booking                          open · blocked by #12
├── #15 A full class says no to a booking         open · blocked by #12
└── #16 Show bookings on the timetable page       open · blocked by #13, #14, #15
```

#13, #14 and #15 each list only #12 as their blocker, so once #12 closed, all three were on the frontier together. With #13 closed too, the frontier is #14 and #15, and #16 waits for both.

A project on a [local tracker](/learn/issues-and-keeping-track) works differently. There, "publish" means "write a file", and neither `/to-spec` nor `/to-tickets` mentions committing. So the Spec and Tickets are ordinary files in the agent's folder. They join history on whichever branch is open when they're committed, and they travel with that branch. Until it merges, `main` doesn't have them, so a fresh branch cut from `main` has no Tickets folder at all. A branch for the next Ticket has to start from a commit that holds the Tickets.

```callout remember
`/to-spec` and `/to-tickets` run in one session. On GitHub Issues, the Spec and Tickets are the same from every branch. On a local tracker they're files: they live on the branch they were committed to, and reach `main` only when that branch merges.
```

```checkpoint check-1
A friend's project keeps its Tickets as local files. They ask for a fresh branch from `main` to build ticket 03, and the agent can't find the Ticket. Why?
- [ ] The Ticket was never written anywhere
- [x] The Tickets live on another branch
- [ ] `/implement` reads only from GitHub Issues
- [ ] A fresh branch always starts empty
Why: The Spec and its Tickets were committed on a branch that hasn't merged, so a branch cut from `main` doesn't have them. Start from the branch that holds them instead. Branches don't start empty: they start with every file of the commit they're cut from.
```

```checkpoint check-2
`/to-spec` has published a Spec. What do you do before `/to-tickets`?
- [ ] Type `/clear` to start fresh
- [ ] Merge the Spec, then clear
- [ ] Open a pull request for it
- [x] Nothing: stay in the same session
Why: Matt: don't clear or compact between the two. The Tickets are cut from the thinking that wrote the Spec, and the agent never has to fetch a long Spec back. Clearing "to be safe" is the tempting mistake.
```

```checkpoint check-3
#12 and #13 are closed. Which Booking API Tickets can an agent start now?
- [x] #14 and #15
- [ ] Only #14 for now
- [ ] #14, #15 and #16
- [ ] Only #16 for now
Why: #14 and #15 each list only #12 as their blocker, so both are on the frontier. #16 is blocked by #13, #14 and #15, so it waits until #14 and #15 are closed too.
```

## One Ticket, one branch, one pull request

`/implement` does five things, in order. It fetches the Ticket and states its title, drives `tdd` at the pre-agreed seams, runs typechecks and single test files as it goes, runs the full suite once at the end, then runs `/code-review` and commits to the current branch. There are two things it never does: it doesn't make a branch, and it doesn't open a pull request. So your prompt adds both, a fresh branch before and a pull request with a `/pr` body after.

1. **Clear, then a fresh branch (you).** Type `/clear`. One Ticket per branch, cut from an up-to-date `main`. A squash-merged branch is finished ([Branches and worktrees](/learn/branches-and-worktrees)), so every Ticket gets a new one.
2. **Build the Ticket (the agent).** `/implement #14`. It says the Ticket's title (check it), builds test-first, typechecks and tests as it goes, runs the full suite once, reviews with `/code-review` and commits.
3. **Open the pull request (the agent, because you asked).** It pushes and opens a pull request into `main` whose body says `Closes #14`, shaped by [pr](/learn/pr): Summary, Evidence, Merge Danger.
4. **Checks and a preview (GitHub and Vercel).** The workflow runs its checks on the pull request. Vercel builds a preview deployment and comments its link on the pull request.
5. **Review the diff and the preview (you).** Read the diff and test the body's claims against it ([Checking a pull request before you merge](/learn/checking-a-pr)). Open the preview and do what the Ticket describes, at phone width too.
6. **Squash-merge (you).** One new commit lands on `main`, and `Closes #14` closes the Ticket. With a ruleset, the button stays shut until the required check is green.
7. **Promote (Vercel).** The merge builds a production deployment. A Deployment Check holds it until the check passes on `main`; then it's promoted and goes live.
8. **Sweep, then clear (you).** Run `git switch main && git pull`, `git fetch --prune` and `git branch -vv`: the sweep from [Merging and cleaning up](/learn/merging-and-cleaning-up). Remove the Ticket's worktree if it had one. Then type `/clear`, and take the next Ticket on the frontier.

That's Matt's rhythm stretched across GitHub: clear context, implement one Ticket, commit, clear again, with a pull request, your review and a merge before the second clear. Each Ticket gets its own check run, its own preview and its own squash commit. So each slice reaches production on its own, and you read every one before it does.

Compare the agent in the opening. It committed every Ticket straight onto one long-lived branch, with no pull request, so no check and no reviewer has seen any of it. That's the one-pull-request-per-Spec shape of the next part, run by hand and without its safeguards.

```callout remember
`/implement` builds one Ticket and commits to whatever branch is open. Your prompt adds the fresh branch before and the pull request after; the checks, the preview and your review sit between that pull request and production.
```

```checkpoint check-4
You type `/implement #14` while `main` is open. Where does the commit go?
- [ ] Onto a branch it makes first
- [ ] Into a new pull request
- [x] Straight onto your local `main`
- [ ] Nowhere until you pick a branch
Why: It commits to the current branch; it doesn't create one and it doesn't ask. That's why the one-Ticket prompt starts by making a fresh branch.
```

```checkpoint check-5
`/implement` has committed #14 on its own branch. What comes next in the one-Ticket loop?
- [x] Push it, and open a pull request that says `Closes #14`
- [ ] Clear the context, and start building #15 at once
- [ ] Merge the branch into `main` on your laptop
- [ ] Ask Vercel to promote the build to production
Why: Your prompt asked for the pull request after the commit, and its `Closes #14` line will close the Ticket when it merges into `main`. Then the checks and the preview follow. Clearing comes only after the merge and the sweep.
```

```checkpoint check-6
#14's pull request is green, and Vercel has commented a preview link. What do you do before you merge?
- [ ] Nothing: green checks prove it works
- [ ] Rerun every check one more time
- [ ] Force Promote the preview to production
- [x] Open the preview and try it out
Why: The checks prove the tests passed. They can't tell you whether the cancel button sits where a member expects it on a phone-width page. The preview is the look gate, and you hold it.
```

## A whole Spec at once: /implement-spec

With `/implement`, you are the dispatcher: one session per Ticket, and you keep track of the frontier. [implement-spec](/learn/implement-spec) hands that job to one orchestrating session. It creates an **integration branch**, one branch where the whole Spec comes together. For every Ticket on the frontier, it starts an implementer **subagent** (a helper agent with its own fresh context), each in its own worktree on its own branch, building with `tdd`.

A merger subagent folds each finished branch into the integration branch, and new Tickets start as their blockers land. After the first merge it opens a draft pull request into `main`, if your tracker closes work through pull requests or you ask for one. At the end it runs `/code-review` once, fixes the findings, marks the pull request ready for review and cleans up the worktrees.

```text
main
└── spec/booking-api                integration branch: one draft pull request into main
    ├── ticket-13  (worktree A)     implementer subagent
    ├── ticket-14  (worktree B)     implementer subagent
    └── ticket-15  (worktree C)     implementer subagent
        each merges spec/booking-api into itself, then the merger folds it in
    then #16, /code-review, fixes, "ready for review"
```

[Undo and merge conflicts](/learn/undo-and-conflicts) covered where conflicts come from. Separate worktrees stop agents trampling each other while they work, but their branches still meet on the integration branch. Because each implementer merges that branch into its own first, any conflict shows up in its own worktree, and the merger's step is a fast-forward. When two Tickets on the frontier will edit the same file, Matt's fix is a blocking edge, so they run one after the other.

Say you'd run the whole Booking API Spec this way from the start, and its Spec makes exactly that call. Once #12 is done, #13, #14 and #15 sit on the frontier together, so `/implement-spec` would start all three at once. But all three change the same booking code and its tests, so parallel branches would collide for little gain. So the Spec adds blocking edges, and they run one after another on one integration branch: `/implement-spec`'s shape without the parallel part. Either way, the end is the same. One pull request for the whole Spec becomes one squash commit on `main`.

The price is one large review instead of five small ones, and Matt expects the final `/code-review` to find real problems. The tracker adds a wrinkle. On GitHub, a Ticket's blocked-by count only drops when its blocker closes, and the Tickets close only when the pull request merges, at the end. So tell the orchestrator to work out the frontier from what has merged into the integration branch. And ask for the draft pull request early: a draft can't be merged by accident, and every push to it runs the checks and refreshes its preview link, not only at the end.

```callout remember
`/implement-spec` runs the frontier in parallel worktrees and lands everything on one integration branch: one pull request, one big review, one squash commit. Tickets that edit the same files need a blocking edge between them.
```

```checkpoint check-7
Why does each implementer merge the integration branch into its own branch before reporting done?
- [ ] So `main` gets every Ticket early
- [x] So conflicts surface in its own worktree
- [ ] So CI can skip the tests on the merge
- [ ] So the pull request closes each Ticket
Why: Any clash with work already merged shows up in the implementer's own worktree, while its Ticket is fresh. The merger's step is then a fast-forward. Nothing reaches `main` until the one pull request merges.
```

```checkpoint check-8
#13, #14 and #15 all change the same booking code. What should change before you run `/implement-spec` on them?
- [ ] Nothing: worktrees keep them apart
- [ ] Turn off the merger subagent
- [x] Add blocking edges between them
- [ ] Run all three straight on `main`
Why: Worktrees only postpone the collision to merge time. A blocking edge makes the Tickets run one after the other.
```

```checkpoint check-9
A whole Spec lands through `/implement-spec` and one pull request. How many commits does it add to `main`?
- [x] One squash commit
- [ ] One per Ticket
- [ ] One per subagent
- [ ] One per merge
Why: The integration branch reaches `main` through one pull request, and a squash merge turns it into one new commit, however many Tickets and merges it holds.
```

## HITL or AFK: where you sit

Matt's AI Coding Dictionary gives two words exact meanings. **Human-in-the-loop** (HITL) is "a working pattern where one or more humans pair with the agent during a session — reviewing, redirecting, or collaborating in real time."

**AFK** (away from keyboard) is "a working pattern where the user kicks off a session and leaves the agent to run unattended."

Which one fits depends on the work. Clear, low-risk Tickets that are easy to check suit AFK. Ambiguous or hard-to-undo work, or anything touching production, suits staying in the loop. The question to ask is how expensive a wrong turn is, and how late you'd catch it. AFK never removes your review; it moves all of it to the end. That's why an unattended run must end in a pull request, not a merge.

| Step | Who | Kind |
|---|---|---|
| Confirm the seams (`/to-spec`) | You | HITL by nature: your answers are the input |
| Approve the Ticket list (`/to-tickets`) | You | HITL by nature |
| Build one Ticket (`/implement`) | The agent, in your window | HITL if you watch: you read each Ticket as it lands |
| Build a whole Spec (`/implement-spec`) | An orchestrator and its subagents | Can run unattended; you review at the end |
| Checks on the pull request, Deployment Checks | GitHub, Vercel | Automatic gates |
| Read the diff, the pull request body, the preview | You | Human: nothing automatic replaces it |
| Merge | You | Human, even in Matt's AFK set-up |

So your loop has four human points: approving the Spec's seams, approving the Ticket list, reviewing the pull request with its preview, and merging. Everything between them can run unattended once the gates exist. Even Matt's fully AFK set-up, the subject of [Agents in GitHub Actions](/learn/agents-in-github-actions), stops at a pull request that's ready for review: in his words, "Nothing in the system merges to main."

Until your repo has a ruleset on `main`, a red check can't stop a merge, and you're the only gate. Stay in the loop until [Setting up your own project's pipeline](/learn/your-projects-pipeline) wires up the rest.

```callout remember
HITL: you're there, and you steer as it goes. AFK: you walk away and review it all at the end. Either way, you approve the seams and the Tickets, review the pull request and its preview, and merge.
```

```checkpoint check-10
Which of these suits AFK best?
- [ ] Choosing the site's design direction
- [ ] A schema change on the live database
- [ ] Agreeing the seams for the tests
- [x] A clear Ticket with tests to check it
Why: Well-specified, low-risk, easy-to-check work suits AFK. Design choices and seams need your reactions, and a change to the live database costs too much if it goes wrong while nobody watches.
```

```checkpoint check-11
You leave an agent running AFK overnight on the yoga-studio repo. What should be waiting for you in the morning?
- [ ] A merged commit on `main`
- [x] A pull request ready for review
- [ ] The change live in production
- [ ] Nothing, until you restart it
Why: AFK moves your review to the end, so the run must end in something reviewable: a pull request, not changes already merged. You still review and merge.
```

## The gates, in order

Here is every step an agent's change goes through on its way to users, in order. A **gate** is a check outside the agent's own judgement that can stop the change. The first three steps happen inside the agent's own session.

1. **`tdd` (inside the agent).** A failing test first, then the code, at the agreed seams. Proof it ran: a `tdd` call in the agent's trace, not only tests in the diff.
2. **Typecheck and tests (inside `/implement`).** Single test files as it goes, the full suite once at the end.
3. **`/code-review` (inside `/implement`).** Two reviews in separate subagents: does the code follow the repo's standards, and does it match the Spec?
4. **Pre-commit hook (your laptop, at commit).** The [setup-pre-commit](/learn/setup-pre-commit) Skill writes it, to run `npx lint-staged`, `npm run typecheck` and `npm run test`. No pass, no commit, unless someone adds `--no-verify`.
5. **Required check (GitHub, before merge).** A ruleset on `main` refuses the merge until the check is green. It finds the check by its job name.
6. **Preview deployment (Vercel, while the pull request is open).** Blocks nothing by itself. You are the gate.
7. **Deployment Checks (Vercel, after merge).** Production waits for the check on `main` before it's promoted. Force Promote skips the wait.
8. **Instant Rollback, then revert (Vercel, then GitHub).** Production points back at an earlier deployment instantly. A revert pull request then takes the change out of `main`.

Steps 1 to 3 are how a good agent works, and they're what make the pull request worth your time. But the agent runs them and judges them, so they aren't gates. `/implement` doesn't even act on what `/code-review` finds, and an agent reviewing its own work leans towards its own solution. Step 4 is the first check outside the agent's judgement, and it can be skipped. The gates that hold are 5 and 7, and 6 holds only if you look ([Gates: checks that block](/learn/gates)).

The job name matters more than it looks. Say the practice project's CI workflow has one job, `test`, and a ruleset requires it by that name. An agent that renames the job breaks the gate: the ruleset keeps waiting for a `test` check that never reports, and every merge box stays stuck.

```callout remember
Inside the agent: `tdd`, typecheck and tests, `/code-review`. Good habits, not gates. Outside it: the pre-commit hook (skippable), the required check (blocks the merge), the preview (you), Deployment Checks (block going live), then rollback and revert.
```

```checkpoint check-12
`/code-review` flagged a missing test, and `/implement` committed anyway. Why?
- [ ] The pre-commit hook overrode it
- [ ] Findings only block a merge on GitHub
- [x] `/implement` doesn't act on findings
- [ ] Its review step was skipped this time
Why: `/implement` doesn't act on what `/code-review` finds. That's one reason the steps inside the agent aren't gates: read the review yourself, or ask the agent to fix the findings.
```

```checkpoint check-13
Which two steps stop an agent's change whatever the agent does?
- [x] The required check and Deployment Checks
- [ ] `tdd` and the pre-commit hook
- [ ] `/code-review` and the preview
- [ ] The typecheck and the full test suite
Why: They run on GitHub and Vercel, outside the agent's session. The hook can be skipped with `--no-verify`, the review blocks nothing, and the preview is held by you.
```

```checkpoint check-14
An agent's release breaks the live timetable page. In what order do you act?
- [ ] Revert first, then Instant Rollback
- [x] Instant Rollback, then a revert
- [ ] Force Promote, then a revert
- [ ] Rerun CI, then Force Promote
Why: Rollback puts the earlier deployment back in seconds, with no rebuild. The revert pull request then takes the change out of `main`, through the gates.
```

## Where Tickets live changes the loop

[setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) decides where a project's Tickets live. The practice project uses GitHub Issues, Matt's default, because the Skills "were designed for GitHub". Some projects choose local Markdown files under `.scratch/` instead, which the Skill suggests for solo projects or repos without a remote. The choice reaches further than storage. It changes how a pull request names a Ticket, how a Ticket closes, and which agents can work on it.

|  | GitHub Issues | Local `.scratch/` files |
|---|---|---|
| A Ticket is | An Issue, the same from every branch | A file, on the branch that committed it |
| Blocking | Native blocked-by links and sub-issues | A `Blocked by:` line |
| The pull request names it | By number, linked from both pages | By path |
| It closes when | A pull request saying `Closes #N` merges into `main` | The pull request's diff edits its `Status:` line |
| `/implement-spec` ends | With a draft pull request, marked ready at the end | On the integration branch; a pull request only if you ask |
| Label-triggered agents | Label an Issue, and an agent opens a pull request | Not possible: nothing to label |

`Closes #13` in a pull request body works only with GitHub Issues, and only when the pull request goes into the default branch. In a pull request into an integration branch, it's ignored. On a local tracker, `#13` would point at GitHub Issue or pull request 13, never at a file in `.scratch/`.

Label-triggered agents are where a local tracker stops. Matt's AFK platform runs on GitHub Issues: a label on an Issue starts an agent that opens a pull request, and a merged pull request's `Closes #N` closes the Issue, which can unblock and start the next one. None of that can see a file in `.scratch/`. A project on local files would re-run `/setup-matt-pocock-skills`, choose GitHub, and publish its next Spec's Tickets as Issues.

One trap waits there. The Spec carries the `ready-for-agent` label too, and an agent that picks up anything with that label will try to build the whole Spec in one go. Tell it to skip the Spec, or remove the Spec's label once `/to-tickets` has run.

```callout remember
Local files: Tickets travel with branches and close inside the pull request's diff. GitHub Issues: Tickets are shared, close with `Closes #N` when the pull request merges into `main`, and are what label-triggered agents need.
```

```checkpoint check-15
A friend's project keeps its Tickets as `.scratch` files. A pull request into `main` says "Closes #3". What does that line do to their ticket 03 when it merges?
- [ ] Its Status becomes resolved automatically
- [ ] GitHub moves the file into Issues
- [ ] The merge is blocked outright
- [x] Nothing: #3 isn't that file
Why: "#3" means GitHub Issue or pull request 3, never a file in `.scratch/`. On a local tracker, a ticket closes only when the pull request's diff edits its `Status:` line.
```

```checkpoint check-16
That same project wants label-triggered agents. What has to change first?
- [ ] Open a pull request for each Ticket
- [ ] Rename every Ticket file by number
- [x] Move the Tickets to GitHub Issues
- [ ] Add labels inside the `.scratch` files
Why: Matt's platform reads labels on GitHub Issues and closes them with `Closes #N`. Files can't carry labels. Re-run `/setup-matt-pocock-skills` and choose GitHub.
```

## Tell your agent

Start each in a fresh session. The first builds one Ticket into one pull request; the second builds a whole Spec into one pull request. Fill in the angle brackets.

```text
/implement #<N>

Before you build: from an up-to-date main, create a fresh branch
named ticket/<N>-<slug>, switch to it, and show me git status. Then
follow the skill. After your commit, run /code-review against main
and fix what it finds. Push, then open a pull request into main with
a /pr body (Summary, Evidence, Merge Danger) that says "Closes #<N>".
On the Issue, tick only the acceptance criteria you met, and list
any you didn't in the pull request body. Run gh pr checks --watch,
then give me each check's result and the preview deployment link.
Don't merge.
```

```text
/implement-spec #<spec>

Name the integration branch spec/<feature>, from an up-to-date main,
and open a draft pull request into main after the first merge, with
"Closes" for the Spec and every Ticket. Before you start, list the
frontier and any Tickets on it that will edit the same files, and
ask me before running those in parallel. Work out the frontier from
what has merged into the integration branch, not from the tracker.
Run /code-review once, at the end; after the fix, run focused checks
only, not a second full review. Then mark the pull request ready for
review and give me its link and the preview link. Don't merge.
```

Three lines in them do the most work. "Show me git status" lets you check the branch before anything is built. "After your commit, run /code-review" puts the review where it can see the work: `/code-review` compares commits, so work that isn't committed yet isn't in what it reads. And "Don't merge" keeps the merge with you, one of your four human points.

```checkpoint check-17
Both prompts end with "Don't merge." Why?
- [x] Merging is one of the steps that stays yours
- [ ] Agents can't merge pull requests on GitHub
- [ ] The checks only start once you've merged
- [ ] A merge would delete the preview link
Why: The merge is one of your four human points, even in Matt's AFK set-up. The agent stops at a pull request that's ready for your review.
```

## Try it: one Ticket, all the way to production

````try
You'll need the practice project with its "Booking API" Spec and at least one Ticket on the frontier, a CI check that runs on pull requests (see [What CI/CD is](/learn/what-ci-cd-is)), and Vercel previews of each pull request.

1. Find the frontier: run `gh issue view <spec> --web`, with the Spec's number, and look for open Tickets with no Blocked icon.
2. Start Claude Code and type `/clear`.
3. Paste the first prompt from Tell your agent, with that Ticket's number. You should see it create the branch and show `git status` before it builds.
4. Check the title it reads back. It should be the Ticket you meant.
5. When it's done, you should see a pull request link, each check's result and a preview link, and no merge.
6. Read the diff with `gh pr diff <number>`, and test the body's claims against it.
7. If the Ticket changes a page, open the preview and do what the Ticket describes, at phone width too.
8. Squash-merge on GitHub once the checks are green. You should see the Ticket close, because the body says `Closes`.
9. Sweep your laptop:

```sh
git switch main && git pull
git fetch --prune
git branch -vv
```

10. Type `/clear`, and take the next Ticket on the frontier.
````

Before you take a Ticket all the way to production for the first time, Matt's "Prerequisites" and "Common questions" in [The /implement Skill](https://www.aihero.dev/skills-implement) cover this loop's snags in his words: no branch, no pull request, no Ticket closing, and a review that can see nothing until the work is committed.

## Practice

### Who holds this step?

Each step sits somewhere between an agent's first commit and a live page. Assume the repo has a ruleset on `main` and a Deployment Check, and pick who or what holds the step.

```checkpoint holds-phone-width
Deciding whether a new page reads well at phone width, on the pull request's preview deployment.
- [x] You
- [ ] The agent
- [ ] GitHub
- [ ] Vercel
Why: The preview blocks nothing by itself: it works as a gate only if you open it and look. Green checks prove the tests passed, not that the page looks right.
```

```checkpoint holds-inside-checks
Running `tdd`, the typecheck and `/code-review` before a commit, and judging what they found.
- [ ] You
- [x] The agent
- [ ] GitHub
- [ ] Vercel
Why: These run inside the agent's own session, and the agent judges them, so they're good habits, not gates. `/implement` doesn't even act on what `/code-review` finds.
```

```checkpoint holds-required-check
Refusing a merge into `main` until the required `test` check is green.
- [ ] You
- [ ] The agent
- [x] GitHub
- [ ] Vercel
Why: The ruleset on `main` refuses the merge until the check it names, by job name, has passed. Without a ruleset, a red check is information, not a gate.
```

```checkpoint holds-promotion
Keeping a merged commit's production build off the live site until the check has passed on `main`.
- [ ] You
- [ ] The agent
- [ ] GitHub
- [x] Vercel
Why: A Deployment Check holds promotion until the named check passes on `main`. Force Promote skips the wait. The ruleset's work ended at the merge.
```

## Remember

```flashcards
Q: What are the two things `/implement` never does, which your prompt has to add?
A: It doesn't make a branch, and it doesn't open a pull request. So you ask for a fresh branch before and a pull request with a `/pr` body after.

Q: What is the one-Ticket loop, end to end?
A: `/clear` and a fresh branch, `/implement`, a pull request saying `Closes #N`, checks and a preview, your review, a squash merge, promotion, then the sweep and `/clear` again.

Q: How does `/implement-spec` land a whole Spec?
A: It runs the frontier in parallel worktrees, merges each Ticket into one integration branch, reviews once at the end, and lands everything through one pull request: one squash commit on `main`.

Q: Two frontier Tickets will edit the same file. What's Matt's fix?
A: A blocking edge between them, so they run one after the other. Worktrees only postpone the collision to merge time.

Q: What are the four human points in the loop?
A: Approving the Spec's seams, approving the Ticket list, reviewing the pull request with its preview, and merging. Even Matt's AFK set-up stops at a pull request ready for review.

Q: HITL or AFK: which suits a clear, low-risk Ticket with tests?
A: AFK, left to run unattended. But AFK moves all your review to the end, so the run must end in a pull request, not a merge.

Q: Which steps on the way to production are gates that hold whatever the agent does?
A: The required check (GitHub, before merge) and Deployment Checks (Vercel, before going live). The preview holds only if you look; the pre-commit hook can be skipped.

Q: When does `Closes #13` close the Ticket?
A: When the pull request merges into the default branch, with the Tickets in GitHub Issues. Into an integration branch, it's ignored, and it never points at a local file.
```

## Final test

```final-test next-ticket-first-move
#13's pull request is merged and you've done the sweep. #14 is next. What do you do first?
- [ ] Reuse #13's branch, since it's still there
- [ ] Run `/implement-spec` for #14 alone
- [x] `/clear`, then a fresh branch from `main`
- [ ] Open the pull request for #14 first
Why: Clear the context, and give #14 its own branch: a squash-merged branch is finished. Then `/implement` it. The pull request comes after the build, not before.
```

```final-test human-even-afk
Which step stays human even in Matt's fully AFK set-up?
- [x] Merging to `main`
- [ ] Running the tests
- [ ] Opening the pull request
- [ ] Building the preview
Why: "Nothing in the system merges to main." Agents open pull requests, and machines run the checks and build previews; a person approves and merges.
```

```final-test implement-spec-local-end
`/implement-spec` runs on a project whose Tickets are local files, and you didn't ask for a pull request. How does the run end?
- [ ] With a draft pull request waiting for review
- [ ] With every Ticket merged into `main` already
- [ ] With one worktree per Ticket left open
- [x] With the Tickets resolved on the integration branch
Why: A pull request opens only if the tracker closes work through pull requests or you ask for one. A local tracker doesn't, so the run stops on the integration branch with the Tickets resolved and the worktrees cleaned up.
```

```final-test held-by-a-person
Which step on the way to users is held by a person, not a machine?
- [ ] The required check
- [x] The preview deployment
- [ ] The pre-commit hook
- [ ] The Deployment Checks
Why: The preview blocks nothing by itself; it works as a gate only if you open it and look. The other three are run by git, GitHub or Vercel.
```

```final-test where-tickets-publish
Which Skill changes where new Tickets are published, for example from `.scratch` files to GitHub Issues?
- [ ] `/to-tickets`
- [ ] `/implement-spec`
- [x] `/setup-matt-pocock-skills`
- [ ] `/code-review`
Why: It records the tracker in `docs/agents/issue-tracker.md`, which the other Skills read. `/to-tickets` publishes wherever that file points.
```

```final-test give-up-with-implement-spec
Three Tickets of a Spec are left. You could run `/implement` three times, one pull request each, or `/implement-spec` once, one pull request in all. What do you give up with `/implement-spec`?
- [ ] The checks that run on pull requests
- [ ] Tests written first at the seams
- [x] Reading each Ticket as it lands
- [ ] The final squash merge into `main`
Why: With `/implement-spec` you review the integration branch once, at the end: one large review instead of several small ones. Its implementers still build with `tdd`, its pull request still gets checks and a preview, and it still lands as one squash commit.
```

```final-test no-ruleset-red-check
Your repo has no ruleset yet. An agent opens a pull request, one CI job shows a red cross, and the merge button is green. What stops a merge?
- [ ] GitHub, because the check is red
- [ ] Vercel, which holds the production build
- [ ] The pre-commit hook in the repo
- [x] Nothing but you: no ruleset requires it
Why: With no ruleset, a red check is information, not a gate, so GitHub lets the merge through. You're the only gate, which is why a ruleset and a Deployment Check go on as soon as the first code lands.
```

```final-test closes-into-integration
An agent builds #13 on a branch cut from the integration branch `spec/booking-api`, and its pull request into `spec/booking-api` says "Closes #13". When that pull request merges, what happens to #13?
- [x] It stays open for now
- [ ] It closes as soon as this merges
- [ ] GitHub blocks the merge outright
- [ ] It closes, and starts #14 by itself
Why: Closing keywords work only when the pull request targets the repo's default branch. In a pull request into an integration branch they're ignored, so #13 closes only when a pull request into `main` that names it merges.
```

```final-test local-branch-base
A friend's Tickets are local files, committed on a feature branch that hasn't merged yet. They want ticket 03 built as its own pull request. Where does its branch start, and where does the pull request go?
- [ ] From `main`, with a pull request into `main`
- [x] From the feature branch, with a pull request into it
- [ ] Onto the feature branch, with no pull request
- [ ] From `main`, and let `/implement` find the Ticket
Why: A branch cut from `main` has no Tickets folder, so `/implement` has no Ticket to find. Until the feature branch merges, the base is the branch that holds the Tickets, and the pull request goes back into it. Committing straight onto it would mean no check and no review.
```

```sources
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, updated 2026-08-24
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock, updated 2026-10-05
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, updated 2026-08-24
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock, updated 2026-08-24
- [code-review: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/code-review/SKILL.md), Matt Pocock's Skills
- [pr: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/SKILL.md), Matt Pocock's Skills
- [setup-pre-commit: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/setup-pre-commit/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [Human-in-the-loop (AI Coding Dictionary)](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop), Matt Pocock
- [AFK (AI Coding Dictionary)](https://www.aihero.dev/ai-coding-dictionary/afk), Matt Pocock
- [GitHub-Native AFK Agent Platform spec](https://github.com/mattpocock/course-video-manager/blob/main/docs/agents/afk-agent-platform-spec.md), Matt Pocock
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs
- [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests), GitHub Docs
- [githooks](https://git-scm.com/docs/githooks), the Git project
- [Deployment Checks](https://vercel.com/docs/deployment-checks), Vercel Docs
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github), Vercel Docs
- [Instant Rollback](https://vercel.com/docs/instant-rollback), Vercel Docs
```
