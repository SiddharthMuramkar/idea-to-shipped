---
title: The build loop in practice
slug: spec-driven-build-loop
summary: Take a spec to production one ticket per PR with /implement, or the whole spec in one PR with /implement-spec.
---

On 27 October your front-end branch held a spec with 56 user stories, five build tickets, and tickets 01 and 02 already built, ticked and marked resolved. That was fifteen commits that `main` had never seen, with no pull request, so no check had ever run on them. This lesson joins Lessons 5 to 13 into one loop, from a spec to merged, deployed PRs, and marks the points only you can hold.

```goals
- You’ll be able to take a spec to production one ticket per PR with `/implement`, or the whole spec in one PR with `/implement-spec`. You’ll know which steps are yours and which are automatic gates, and what your local ticket tracker changes about PRs and agents.
```

## From map to tickets, with git eyes

Lesson 5 set out the planning end. When the map is clear, you run `/to-spec .scratch/<effort>/map.md` and then `/to-tickets`, in the same session, with no `/clear` between them. `/to-spec` checks its test seams with you and writes `spec.md`. `/to-tickets` shows you a numbered list of thin vertical slices, each with the tickets that block it, and writes one file per ticket once you approve. The tickets whose blockers are all done form the **frontier**: the ones an agent can start now.

Now look at the same step the way git sees it. On your local tracker, “publish” means “write a file”, and neither skill mentions committing. So the spec and tickets are ordinary files in the agent’s worktree. They join history on whichever branch is open when they’re committed, and they travel with that branch. Until it merges, `main` doesn’t have them.

Care4Mind shows both halves. Commit `9ebb5ed`, “Spec the Press × Kolam front end and split it into tickets”, sits on `SiddharthMuramkar/frontend` and added a spec and five tickets. Its source is ticket 21, the design direction, plus ADR-0003, not `map.md`. Your map allows that early start for the front-end foundation only, so Lesson 5’s rule still holds for everything else: point `/to-spec` at the cleared map.

```text
.scratch/front-end-foundation/            on SiddharthMuramkar/frontend, not on main
├── spec.md                               Status: ready-for-agent
└── issues/
    ├── 01-kolam-logo-and-imagery.md      Status: resolved
    ├── 02-home-scroll-and-signature.md   Status: resolved
    ├── 03-click-language.md              Blocked by: 01
    ├── 04-concept-and-questionnaire-interactions.md
    │                                     Blocked by: 01
    └── 05-performance-budgets.md         Blocked by: 02, 03, 04
```

Tickets 02, 03 and 04 each list only 01 as their blocker, so once 01 was resolved all three were on the frontier together. With 02 resolved too, the frontier is 03 and 04, and 05 waits for both. Here is the git-eyes catch. A branch made from `main` today has no `front-end-foundation` folder at all, so a fresh branch for ticket 03 has to start from a commit that holds the tickets. Until the front-end branch merges, that means starting from it.

```callout remember
`/to-spec` and `/to-tickets` run in one session and write files. With a local tracker those files live on the branch they were committed to, and reach `main` only when that branch merges.
```

```checkpoint check-1
You ask for a fresh branch from `main` to build ticket 03 of the front-end spec. The agent can’t find the ticket. Why?
- [ ] The ticket was never written anywhere
- [x] The tickets live on another branch
- [ ] `/implement` reads only from GitHub Issues
- [ ] Fresh branches always start with nothing
Why: The spec and its tickets were committed on `SiddharthMuramkar/frontend` in `9ebb5ed`. A branch cut from `main` doesn’t have them until that branch merges, so start from the front-end branch instead. Branches don’t start empty: they start with every file of the commit they’re cut from.
```

```checkpoint check-2
`/to-spec` has just written a spec. What do you do before `/to-tickets`?
- [ ] Type `/clear` to start fresh
- [ ] Commit the spec, then clear
- [ ] Open a PR for it
- [x] Nothing: keep the same session
Why: Matt: don’t clear or compact between the two. The tickets are cut from the thinking that wrote the spec, and the agent never has to fetch a long spec back. Clearing “to be safe” is the tempting mistake.
```

```checkpoint check-3
Tickets 01 and 02 are resolved. Which front-end tickets can an agent start now?
- [x] Tickets 03 and 04
- [ ] Only ticket 03 now
- [ ] Tickets 03 to 05
- [ ] Only ticket 05 now
Why: 03 and 04 each list only 01 as their blocker, so both are on the frontier. Ticket 05 is blocked by 02, 03 and 04, so it waits until 03 and 04 are resolved too.
```

## One ticket, one branch, one PR

`/implement` does five things, in order. It fetches the ticket and states its title, drives `tdd` at the pre-agreed seams, runs typechecks and single test files as it goes, runs the full suite once at the end, then runs `/code-review` and commits to the current branch. There are two things it never does: it doesn’t make a branch, and it doesn’t open a PR. So your prompt adds both, a fresh branch before and a PR with a `/pr` body after.

1. **1. Clear, then a fresh branch** (You): `/clear`
   - One ticket per branch, cut from a base that holds the tickets. A squash-merged branch is finished (Lesson 6), so every ticket gets a new one.
2. **2. Build the ticket** (The agent): `/implement .scratch/<feature>/issues/02-<slug>.md`
   - It says the ticket’s title (check it), builds test-first, typechecks and tests as it goes, runs the full suite once, reviews with `/code-review` and commits.
3. **3. Close the ticket, open the PR** (The agent, because you asked)
   - It sets the ticket’s `Status:` line and ticks the boxes it met, on the same branch (Lesson 8). Then it pushes and opens a PR with a `/pr` body: Summary, Evidence, Merge Danger.
   - Your tracker has no “done” label for build tickets: [Lesson 2](/learn/reading-a-repository)’s five triage labels stop at `ready-for-agent`, and Lessons 5 and 8 left the closing word to you. The front-end agent borrowed wayfinder’s `resolved`. If you keep it, add one line to `docs/agents/issue-tracker.md` saying a finished build ticket gets `Status: resolved`, so every agent uses the same word.
4. **4. Checks and a preview** (GitHub and Vercel)
   - The workflow runs its checks on the PR. Vercel builds a preview deployment and comments its link on the PR.
5. **5. Review the diff and the preview** (You)
   - Read the diff and test the body’s claims against it (Lessons 7 and 8). Open the preview and do what the ticket describes, at phone width too.
6. **6. Squash-merge** (You)
   - One new commit on `main`. With a ruleset, the button stays shut until the required check is green.
7. **7. Promote** (Vercel)
   - The merge builds a production deployment. A Deployment Check holds it until the check passes on `main`; then it is promoted and goes live.
8. **8. Sweep, then clear** (You, in ~/Desktop/project1): `git pull
git fetch --prune
git branch -vv`
   - The Lesson 6 sweep, and archive the Orca worktree if there was one. Then `/clear`.
   - Then take the next ticket on the frontier.

That is Matt’s rhythm stretched across GitHub: clear context, implement one ticket, commit, clear again, with a PR, your review and a merge before the second clear. Each ticket gets its own check run, its own preview and its own squash commit. So each slice reaches production on its own, and you read every one before it does.

Your front-end agent works another way, chosen in the spec: every ticket is committed straight onto the front-end branch. Ticket 01 came in three commits, `e42bfe5`, `7d06da9` and `2e8f7e7`, and the last also set ticket 01 to resolved, ticked its boxes and added a “Built” comment. Ticket 02 followed the same way in three more, `b84d905`, `00314e8` and `7aa63e9`, and the last of those resolved it. There’s no PR yet, so no check and no reviewer has seen any of it. That is the one-PR-per-spec shape of the next section, run by hand.

```callout remember
`/implement` builds one ticket and commits to whatever branch is open. Your prompt adds the fresh branch before and the PR after; the checks, the preview and your review sit between that PR and production.
```

```checkpoint check-4
You type `/implement` while `main` is open. Where does the commit go?
- [ ] Onto a branch it makes
- [ ] Into a new pull request
- [x] Straight onto your local main
- [ ] Nowhere until you pick one
Why: It commits to the current branch; it doesn’t create one and it doesn’t ask. That’s why the one-ticket prompt starts by making a fresh branch.
```

```checkpoint check-5
`/implement` has committed ticket 03 on its own branch. What comes next in the one-ticket loop?
- [x] Close the ticket, open a PR
- [ ] Clear context and start ticket 04
- [ ] Merge the branch into main locally
- [ ] Ask Vercel to promote the build
Why: On your tracker, closing is an edit to the ticket file on the same branch. Then the PR opens, and the checks and preview follow. Clearing comes only after the merge and the sweep.
```

```checkpoint check-6
Ticket 02’s PR is green and Vercel has commented a preview link. What do you do before you merge?
- [ ] Nothing: green checks prove it works
- [ ] Rerun every check one more time
- [ ] Force Promote the preview to production
- [x] Open the preview and scroll it
Why: The checks prove the tests passed. They can’t tell you whether the kolam drawings look right as you scroll a phone-width page. The preview is the look gate, and you hold it.
```

## A whole spec at once: /implement-spec

With `/implement`, you are the dispatcher: one session per ticket, and you keep track of the frontier. `/implement-spec` hands that job to one orchestrating session. It creates an **integration branch**, one branch where the whole spec comes together. For every ticket on the frontier it starts an implementer **subagent** (a helper agent with its own fresh context), each in its own worktree on its own branch, building with `tdd`. A merger subagent folds each finished branch into the integration branch, and new tickets start as their blockers land. After the first merge it opens a draft PR into `main`, if your tracker closes work through PRs or you ask for one. At the end it runs `/code-review` once, fixes the findings, marks the PR ready for review and cleans up the worktrees.

```text
main
└── spec/<feature>                integration branch: one draft PR into main
    ├── ticket-02  (worktree A)    implementer subagent
    ├── ticket-03  (worktree B)    implementer subagent
    └── ticket-04  (worktree C)    implementer subagent
        each merges spec/<feature> into itself, then the merger folds it in
    then ticket 05, /code-review, fixes, “ready for review”
```

Lesson 9 covered where conflicts come from here. Separate worktrees stop agents trampling each other while they work, but their branches still meet on the integration branch. Because each implementer merges that branch into its own first, any conflict shows up in its own worktree, and the merger’s step is a fast-forward. When two tickets on the frontier will edit the same file, Matt’s fix is a blocking edge, so they run one after the other.

Your front-end spec made exactly that call. Once 01 was done, tickets 02, 03 and 04 sat on the frontier together, so `/implement-spec` would have started all three at once. The spec rules that out, because they share the global styles, the layout and the pages. Its shape is `/implement-spec`’s without the parallel part: one integration branch, built one ticket after another. Either way, the end is the same. One PR for the whole spec becomes one squash commit on `main`.

The price is one large review instead of five small ones, and Matt expects the final `/code-review` to find real problems. Your local tracker adds one more wrinkle. It closes tickets by editing files, not through PRs, so `/implement-spec` ends on the integration branch, with every ticket resolved and no PR unless you ask. Ask, and ask for it early: a draft PR can’t be merged by accident, and every push to it runs the checks and refreshes its preview link, not only at the end.

```callout remember
`/implement-spec` runs the frontier in parallel worktrees and lands everything on one integration branch: one PR, one big review, one squash commit. Tickets that edit the same files need a blocking edge between them.
```

```checkpoint check-7
Why does each implementer merge the integration branch into its own branch before reporting done?
- [ ] So `main` gets every ticket early
- [x] So conflicts surface in its worktree
- [ ] So CI can skip the tests
- [ ] So the PR closes each ticket
Why: Any clash with work already merged shows up in the implementer’s own worktree, while its ticket is fresh. The merger’s step is then a fast-forward. Nothing reaches `main` until the one PR merges.
```

```checkpoint check-8
Tickets 02, 03 and 04 all edit the global styles. What should change before you run `/implement-spec` on them?
- [ ] Nothing: worktrees keep them apart
- [ ] Turn off the merger subagent
- [x] Add blocking edges between them
- [ ] Run all three in main
Why: Worktrees only postpone the collision to merge time. A blocking edge makes the tickets run one after the other, which is what your front-end spec chose.
```

```checkpoint check-9
A whole spec lands through `/implement-spec` and one PR. How many commits does it add to `main`?
- [x] One squash commit
- [ ] One per ticket
- [ ] One per subagent
- [ ] One per merge
Why: The integration branch reaches `main` through one PR, and a squash merge turns it into one new commit, however many tickets and merges it holds.
```

## HITL or AFK: where you sit

Matt’s dictionary gives the two words exact meanings. **Human-in-the-loop** (HITL) is “a working pattern where one or more humans pair with the agent during a session — reviewing, redirecting, or collaborating in real time.” **AFK** (away from keyboard) is “a working pattern where the user kicks off a session and leaves the agent to run unattended.”

Which one fits depends on the work. Clear, low-risk tickets that are easy to check suit AFK. Ambiguous or hard-to-undo work, or anything touching production, suits staying in the loop. AFK never removes your review; it moves all of it to the end. That’s why an unattended run must end in a PR, not a merge.

| Step | Who | Kind |
|---|---|---|
| Confirm the seams (`/to-spec`) | You | HITL by nature: your answers are the input |
| Approve the ticket list (`/to-tickets`) | You | HITL by nature |
| Build one ticket (`/implement`) | The agent, in your window | HITL if you watch: you read each ticket as it lands |
| Build a whole spec (`/implement-spec`) | An orchestrator and its subagents | Can run unattended; you review at the end |
| Checks on the PR, Deployment Checks | GitHub, Vercel | Automatic gates |
| Read the diff, the PR body, the preview | You | Human: nothing automatic replaces it |
| Merge | You | Human, even in Matt’s AFK set-up |

So your loop has four human points: approving the spec’s seams, approving the ticket list, reviewing the PR with its preview, and merging. Everything between them can run unattended once the gates exist. Even Matt’s fully AFK set-up, the subject of Lesson 15, stops at a PR that is ready for review. On Care4Mind there’s no ruleset yet, so a red check can’t stop a merge and you are the only gate. Stay in the loop until Lesson 16 wires up the rest.

```callout remember
HITL: you’re there, and you steer as it goes. AFK: you walk away and review it all at the end. Either way, you approve the spec and tickets, review the PR and its preview, and merge.
```

```checkpoint check-10
By Matt’s rule, which of these suits AFK best?
- [ ] Choosing the site’s design direction
- [ ] A schema migration on production
- [ ] Agreeing the seams for tests
- [x] A clear ticket with tests
Why: Well-specified, low-risk, easy-to-check work suits AFK. Design choices and seams need your reactions, and a production migration costs too much if it goes wrong while nobody watches.
```

```checkpoint check-11
You leave an agent running AFK overnight on Care4Mind. What should be waiting for you in the morning?
- [ ] A merged commit on main
- [x] A PR ready for review
- [ ] The change live in production
- [ ] Nothing until you restart it
Why: AFK moves your review to the end, so the run must end in something reviewable: a PR, not changes already merged. You still review and merge.
```

## The gates, in order

Here is every step an agent’s change goes through on its way to users, in order. The first three happen inside the agent’s own session.

1. **1. tdd** (Inside the agent)
   - A failing test first, then the code, at the agreed seams. Proof it ran: a `tdd` call in the agent’s trace, not just tests in the diff.
2. **2. Typecheck and tests** (Inside /implement)
   - Single test files as it goes, the full suite once at the end.
3. **3. /code-review** (Inside /implement)
   - Two reviews in separate subagents: does the code follow the repo’s standards, and does it match the spec?
4. **4. Pre-commit hook** (Your laptop, at commit): `npx lint-staged
npm run typecheck
npm run test`
   - The `setup-pre-commit` skill writes it. No pass, no commit, unless someone adds `--no-verify`.
5. **5. Required check** (GitHub, before merge)
   - A ruleset on `main` refuses the merge until the check is green. It finds the check by job name.
6. **6. Preview deployment** (Vercel, while the PR is open)
   - Blocks nothing by itself. You are the gate.
7. **7. Deployment Checks** (Vercel, after merge)
   - Production waits for the check on `main` before it is promoted. Force Promote skips the wait.
8. **8. Instant Rollback, then revert** (Vercel, then GitHub)
   - Production points back at an earlier deployment instantly. A revert PR then takes the change out of `main`.

Steps 1 to 3 are how a good agent works, and they’re what make the PR worth your time. But the agent runs them and judges them, so they aren’t gates in this course’s sense. `/implement` doesn’t even act on what `/code-review` finds, and an agent reviewing its own work leans towards its own solution. Step 4 is the first one outside the agent’s judgement, and it can be skipped. The gates that hold are 5 and 7, and 6 holds only if you look (Lessons 10 and 12).

On Care4Mind today, steps 1 to 3 are in place on the front-end branch: the scripts exist, and ticket 01’s commits came with their tests. There is no pre-commit hook. The CI workflow has three jobs but has never run, and nothing requires them. A ruleset would require the first job by its name, “Lint, types and unit tests”, so an agent renaming that job would quietly break the gate. Lesson 16 fills in steps 5 and 7.

```callout remember
Inside the agent: `tdd`, typecheck and tests, `/code-review`. Good habits, not gates. Outside it: the pre-commit hook (skippable), the required check (blocks the merge), the preview (you), Deployment Checks (block going live), then rollback and revert.
```

```checkpoint check-12
`/code-review` flagged a missing test, and `/implement` committed anyway. Why?
- [ ] The pre-commit hook overrode it
- [ ] Findings only block on GitHub
- [x] `/implement` doesn’t act on findings
- [ ] Its review step was skipped
Why: `/implement` doesn’t act on what `/code-review` finds. That’s one reason the steps inside the agent aren’t gates: read the review yourself.
```

```checkpoint check-13
Which two steps stop an agent’s change whatever the agent does?
- [x] Required check and Deployment Checks
- [ ] tdd and the pre-commit hook
- [ ] Code review and the preview
- [ ] Typecheck and the full suite
Why: They run on GitHub and Vercel, outside the agent’s session. The hook can be skipped with `--no-verify`, the review blocks nothing, and the preview is held by you.
```

```checkpoint check-14
An agent’s release breaks the live homepage. In what order do you act?
- [ ] Revert first, then Instant Rollback
- [x] Instant Rollback, then a revert
- [ ] Force Promote, then a revert
- [ ] Rerun CI, then Force Promote
Why: Rollback puts the earlier deployment back in seconds, with no rebuild. The revert PR then takes the change out of `main`, through the gates.
```

## Where tickets live changes the loop

`/setup-matt-pocock-skills` decided where Care4Mind’s tickets live, and you chose local markdown files under `.scratch/`. Matt’s default is GitHub Issues, because the skills “were designed for GitHub”. The choice reaches further than storage. It changes how a PR names a ticket, how a ticket closes, and which agents can work on it.

|  | Local `.scratch/` (Care4Mind today) | GitHub Issues |
|---|---|---|
| A ticket is | A file, on the branch that committed it | An issue, the same from every branch |
| Blocking | A “Blocked by:” line | Native blocking links and sub-issues |
| The PR names it | By path | By number, linked from both pages |
| It closes when | The PR’s diff edits its `Status:` line | A PR saying “Closes #N” merges into `main` |
| `/implement-spec` ends | On the integration branch; a PR only if you ask | With a draft PR, marked ready at the end |
| Label-triggered agents (Lesson 15) | Not possible: nothing to label | Label an issue, and an agent opens a PR |

“Closes #12” in a PR body works only with GitHub Issues, and only when the PR goes into the default branch. In a PR into an integration branch, it’s ignored. On Care4Mind the number would point at GitHub issue or PR 12, never at a file in `.scratch/`, as Lesson 8 showed. Your repo has GitHub Issues switched on, but there are no issues in it yet.

Lesson 15’s agents are where the local tracker stops. Matt’s AFK platform runs on GitHub Issues: a label on an issue starts an agent that opens a PR, and a merged PR’s “Closes #N” closes the issue, which can unblock and start the next one. None of that can see a file in `.scratch/`. To use it on Care4Mind, you’d re-run `/setup-matt-pocock-skills`, choose GitHub, and publish the next spec’s tickets as issues. One trap waits there. The spec carries the `ready-for-agent` label too, and an agent that picks up anything with that label will try to build the whole spec in one go.

```callout remember
Local files: tickets travel with branches and close inside the PR’s diff. GitHub Issues: tickets are shared, close with “Closes #N” when the PR merges into `main`, and are what label-triggered agents need.
```

```checkpoint check-15
A PR into `main` says “Closes #3”. Care4Mind’s tickets are `.scratch` files. What does that line do to ticket 03 when the PR merges?
- [ ] Its Status becomes resolved automatically
- [ ] GitHub moves it into Issues
- [ ] The merge is blocked outright
- [x] Nothing: #3 isn’t that file
Why: “#3” means GitHub issue or PR 3, never a file in `.scratch/`. On your tracker, a ticket closes only when the PR’s diff edits its `Status:` line.
```

```checkpoint check-16
You want Lesson 15’s label-triggered agents on Care4Mind. What has to change first?
- [ ] Open a PR for each ticket
- [ ] Rename every ticket file by number
- [x] Move the tickets to GitHub Issues
- [ ] Add labels to the `.scratch` files
Why: Matt’s platform reads labels on GitHub issues and closes them with “Closes #N”. Files can’t carry labels. Re-run `/setup-matt-pocock-skills` and choose GitHub.
```

## Tell your agent

Start each in a fresh session. The first builds one ticket into one PR; the second builds a whole spec into one PR. Fill in the angle brackets. `<base>` is `main`, or the branch that holds the spec’s tickets until that branch merges (for the front-end spec, `SiddharthMuramkar/frontend`).

```text
/implement .scratch/<feature>/issues/<NN>-<slug>.md

Before you build: from <base>, create a fresh branch named
ticket/<NN>-<slug>, switch to it, and show me git status. Then
follow the skill. After your commit: set the ticket’s Status to
resolved, tick only the criteria you met, and add a short “Built”
comment, in a second commit. Run /code-review against <base> and
fix what it finds. Push, then open a PR into <base> with a
/pr body (Summary, Evidence, Merge Danger) that names the ticket by
its path. Run gh pr checks --watch, then give me each check’s result
and the preview deployment link. Don’t merge.
```

```text
/implement-spec .scratch/<feature>/spec.md

Our tracker is local markdown, so I’m asking for a PR. Name the
integration branch spec/<feature>, starting from the commit that
holds this spec and its tickets, and open a draft PR into main after
the first merge, naming the spec and every ticket by path. Before you
start, list the frontier and any tickets on it that will edit the
same files, and ask me before running those in parallel. Work out the
frontier from what has merged into the integration branch. Run
/code-review once, at the end; after the fix, run focused checks
only, not a second full review. Then mark the PR ready for review
and give me its link and the preview link. Don’t merge.
```

## Try it

These two commands only look; they change nothing. The first lists the commits on the front-end branch that `main` doesn’t have. The second lists the tracker files as that branch sees them.

```sh
git -C ~/Desktop/project1 log --oneline main..SiddharthMuramkar/frontend
git -C ~/Desktop/project1 ls-tree -r --name-only SiddharthMuramkar/frontend -- .scratch | head -40
```

On 27 October the first printed fifteen commits, newest first: ticket 02’s three at the top, then ticket 01’s three, then `9ebb5ed` with the spec and tickets, then the Press pages, the style tiles and the Next.js foundation below it. The count grows as the agent works. The second printed 38 paths: the spec and five tickets under `front-end-foundation/`, then the rebuild map, its 29 tickets and two asset files. Find the five tickets. Then ask your agent to show you each one’s `Status:` and `Blocked by:` lines from that branch, say which are on the frontier now, and read the next one’s acceptance criteria as the test for “done”.

## Check yourself

From memory, without scrolling up.

```final-test final-17
Ticket 02’s PR is merged and you’ve done the sweep. Ticket 03 is next. What do you do first?
- [ ] Reuse ticket 02’s branch now
- [ ] Run `/implement-spec` for ticket 03
- [x] `/clear`, then a fresh branch
- [ ] Open the PR for 03
Why: Clear the context, and give 03 its own branch: a squash-merged branch is finished. Then `/implement` it. The PR comes after the build, not before.
```

```final-test final-18
Which step stays human even in Matt’s fully AFK set-up?
- [x] Merging to main
- [ ] Running the tests
- [ ] Opening the PR
- [ ] Building the preview
Why: “Nothing in the system merges to `main`.” Agents open PRs, and machines run the checks and build previews; a person approves and merges.
```

```final-test final-19
`/implement-spec` runs on Care4Mind’s local tracker, and you didn’t ask for a PR. How does the run end?
- [ ] A draft PR waiting for review
- [ ] Every ticket merged into main already
- [ ] One worktree per ticket left open
- [x] Tickets resolved on the integration branch
Why: A PR opens only if the tracker closes work through PRs or you ask for one. A local tracker doesn’t, so the run stops on the integration branch with the tickets resolved and the worktrees cleaned up.
```

```final-test final-20
Which step on the way to users is held by a person, not a machine?
- [ ] The required check
- [x] The preview deployment
- [ ] The pre-commit hook
- [ ] The Deployment Checks
Why: The preview blocks nothing by itself; it works as a gate only if you open it and look. The other three are run by git, GitHub or Vercel.
```

```final-test final-21
Which skill changes where new tickets are published, for example from `.scratch` to GitHub Issues?
- [ ] `/to-tickets`
- [ ] `/implement-spec`
- [x] `/setup-matt-pocock-skills`
- [ ] `/code-review`
Why: It records the tracker in `docs/agents/issue-tracker.md`, which the other skills read. `/to-tickets` publishes wherever that file points.
```

## Read next

**Read:** Matt’s [“The /implement Skill”](https://www.aihero.dev/skills-implement), about eight minutes. Its “Prerequisites” and “Common questions” are this lesson’s snags in his words: no branch, no PR, no ticket closing, and a review that can see nothing. Then [“The /to-tickets Skill”](https://www.aihero.dev/skills-to-tickets), about eight more, for blocking edges and the frontier.

Keep the agentic shipping cheat sheet open the first time you take a ticket all the way to production.

```sources
- [Matt’s /to-tickets article](https://www.aihero.dev/skills-to-tickets)
- [to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md)
- [to-spec/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md)
- [Matt’s /implement article](https://www.aihero.dev/skills-implement)
- [implement/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md)
- [Vercel Docs, Deployment Checks](https://vercel.com/docs/deployment-checks)
- [Vercel Docs, Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [implement-spec/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md)
- [Matt’s /implement-spec article](https://www.aihero.dev/skills-implement-spec)
- [GitHub Docs, Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests)
- [Human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)
- [AFK](https://www.aihero.dev/ai-coding-dictionary/afk)
- [Matt’s AFK agent platform spec](https://github.com/mattpocock/course-video-manager/blob/main/docs/agents/afk-agent-platform-spec.md)
- [setup-pre-commit/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/misc/setup-pre-commit/SKILL.md)
- [githooks docs](https://git-scm.com/docs/githooks)
- [code-review/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md)
- [Vercel Docs, Instant Rollback](https://vercel.com/docs/instant-rollback)
- [setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md)
- [GitHub Docs, Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [issue-tracker-github.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md)
- [Matt’s /to-spec article](https://www.aihero.dev/skills-to-spec)
```
