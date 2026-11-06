---
title: Working with a coding agent on GitHub
slug: working-with-an-agent-on-github
summary: Read the Spec first, because your decisions live there, then its sub-issues' blocked-by links show what's next.
---

## Where your decisions went

Say you planned something with Claude. Your Issue list is long, and you can't tell what's next.

**Read the Spec first, because your decisions live there, then its sub-issues' blocked-by links show what's next.**

```checkpoint quick-1
Why do you read the Spec first?
- [x] Your decisions live there.
- [ ] Your commits live there.
- [ ] Your branches live there.
Why: Read the Spec first, because your decisions live there. Then its sub-issues' blocked-by links show what's next.
```

## Each step on GitHub

The main **Flow** is a path through [Skills](/learn/pull-requests).

```checkpoint quick-2
What is a Flow?
- [x] A path through Skills.
- [ ] A set of instructions for one job.
- [ ] A list of Issues in number order.
Why: A Skill is a named set of instructions an agent loads for one job. A Flow is a path through Skills.
```

- **grilling ([grill-with-docs](/learn/grill-with-docs)):** Claude interviews you until you share one understanding. Nothing appears on GitHub; any notes stay on disk.
- **[to-spec](/learn/to-spec):** turns that into one Issue, the [Spec](/learn/one-change-start-to-finish). Read it now, though it's labelled `ready-for-agent`: a wrong decision is cheapest to catch here.
- **[to-tickets](/learn/to-tickets):** splits the Spec into [sub-issues](/learn/issues-and-keeping-track) called **Tickets**, each one session's work, joined by blocked-by links. Read its list before approving: nothing appears until then.
- **[implement](/learn/implement):** builds one Ticket and commits to your current branch. Nothing appears until you ask Claude to push and open a pull request.
- **[implement-spec](/learn/implement-spec):** instead builds every Ticket. Ask for one [draft](/learn/pull-requests) pull request, to check at the end.

```checkpoint quick-3
Which step leaves nothing on GitHub?
- [x] grilling, where Claude interviews you.
- [ ] to-spec, where you get one Issue.
- [ ] implement-spec, where you ask for one draft.
Why: Grilling is an interview, so nothing appears on GitHub. to-spec leaves one Issue, and implement-spec, if you ask, leaves one draft pull request.
```

## One pull request per Ticket

Your default: ask for one pull request per Ticket into `main`, so each [Merge check](/learn/checking-a-pr) stays small.

```checkpoint quick-4
What's the default for a Spec's Tickets?
- [x] One pull request per Ticket, so each Merge check stays small.
- [ ] One pull request per Spec, so each Merge check stays small.
- [ ] One pull request per commit, so each Merge check stays small.
Why: Your default is to ask for one pull request per Ticket into `main`, so each Merge check stays small.
```

Say you'd asked for #305.

You say:

> /implement #267 on a new branch from an up-to-date `main`, then open a pull request closing it. Don't merge.

Claude runs:

```
git switch main
git pull
git switch -c themes-T02
git add .
git commit -m "..."
git push -u origin themes-T02
gh pr create --title "..." --body "Closes #267"
```

You look:

```
gh pr view 305 --repo SiddharthMuramkar/finance-agent
```

You should see `Closes #267` in the body. Ignore `Auto-merge:`, `finance-agent`'s own rule.

## One big branch

implement-spec uses one shared branch, the **integration branch**. Each Ticket's branch merges into it.

Those merges close nothing, because GitHub acts on `Closes` only on merges into `main`. So open Tickets are normal until that branch's pull request merges. Its body needs a `Closes` line for each.

```checkpoint quick-5
A Ticket's branch merges into an integration branch. What happens to the Ticket?
- [x] It stays open, because GitHub acts on `Closes` only on merges into `main`.
- [ ] It closes, because GitHub acts on `Closes` on merges into any branch.
- [ ] It closes, because GitHub acts on `Closes` when a Ticket's work merges.
Why: Those merges close nothing, because GitHub acts on `Closes` only on merges into `main`. So open Tickets are normal until the one pull request merges.
```

```diagram
type: git
caption: "Those merges close nothing"
branches:
  - name: "`main`"
    commits: 2
  - name: "integration branch"
    from: { branch: "`main`", after: 1 }
    commits: 1
    merge: { into: "`main`", label: "that branch's pull request merges" }
  - name: "Each Ticket's branch"
    from: { branch: "integration branch", after: 1 }
    commits: 2
    merge: { into: "integration branch", label: "Those merges close nothing" }
```

The cost: you stop reading each Ticket's work as it merges. So pick one big branch only if you'll read it all at the end.

```checkpoint quick-6
What does one big branch cost you?
- [x] You stop reading each Ticket's work as it merges.
- [ ] You stop getting a branch for each Ticket's work.
- [ ] You stop getting any pull request for the Spec.
Why: The cost is that you stop reading each Ticket's work as it merges. It all comes to you at once.
```

## Do it now

Start a read-only session: no [line for Claude](/learn/one-change-start-to-finish). Read a Spec: #229 on `finance-agent`. Yours? Use its numbers and repo.

You look, from your second terminal:

```
gh issue view 229 --repo SiddharthMuramkar/finance-agent
```

Scroll up and read `Solution`. Scroll down: near the end, you should see `Sub-issues ·`, then Tickets, `Open` or `Closed`. Stuck? See [Where it goes wrong](/learn/working-with-an-agent-on-github).

Find an `Open` Ticket there: that's `<number>`. Its own print's `Blocked by:` row still lists closed Issues, so `--jq` picks the open count.

You look:

```
gh api repos/SiddharthMuramkar/finance-agent/issues/<number> --jq .issue_dependencies_summary.blocked_by
```

You should see `0`.

A Ticket is next once nothing open blocks it. Above `0`? Try another `Open` Ticket.

```checkpoint quick-7
When is a Ticket next?
- [x] Once nothing open blocks it.
- [ ] Once its number is the lowest.
- [ ] Once its Spec has closed.
Why: A Ticket is next once nothing open blocks it, so a number's place in the list doesn't decide it.
```

You say:

> `finance-agent` #229's next Ticket is `<number>`. Don't start it.

Then stop.

## Going deeper

### Why it exists

A Spec's work outlasts any one session, so you need a way back in. Matt puts the value of a Spec this way: "Its value is that the tickets are disposable and the spec is not." So the Spec keeps the reasoning, and each Ticket closes once its work is done.

```checkpoint quick-8
Which part keeps the reasoning, once a Ticket has closed?
- [x] The Spec, because it isn't disposable.
- [ ] The Ticket, because it isn't disposable.
- [ ] The session, because it isn't disposable.
Why: Matt says the Tickets are disposable and the Spec isn't. So the Spec keeps the reasoning, and each Ticket closes once its work is done.
```

When you check a new Spec, start with its seams, the boundaries where tests watch behaviour, and its `Out of Scope` part. A wrong decision is cheapest to catch in those two places. #229 on `finance-agent` lists its seams under `Testing Decisions`.

```checkpoint quick-9
You're checking a new Spec. Where do you start?
- [x] Its seams and its `Out of Scope` part.
- [ ] Its first user story and its last one.
- [ ] Its title and the Tickets' full bodies.
Why: Start with its seams and its `Out of Scope` part. A wrong decision is cheapest to catch in those two places.
```

Tickets aren't a list to work through from the top. Their blocked-by links say what can start. One pull request per Ticket keeps changes small, and small changes get reviewed more quickly and more thoroughly.

Don't confuse a Flow with GitHub flow, GitHub's own name for branch, pull request, merge. No Skills are involved in that one.

### A real example

Start with the default. #229 on `finance-agent` is a Spec that was grilled with its owner first. It has 19 Tickets, joined by blocked-by links. All 18 build Tickets merged and closed, in 33 pull requests to `main`: more than one per Ticket on average, but not one big one. The 19th, #248, is the answer to Do it now.

Next, one big branch with the site down. Pull request #91 is on this site's repo, which is private. It merged the fix, then eight finished Ticket pull requests "in one go instead of eight CI rounds". That made 78 commits and 439 files from one branch, `57-finish-v2`. It merged about seven minutes after it opened, with no reviews. So it saved CI rounds, and the combined result got one round of checks.

```checkpoint quick-10
Eight finished Ticket pull requests merge in one go through one branch. What does that save, and what does it leave?
- [x] It saves CI rounds, and leaves one round of checks on the combined result.
- [ ] It saves reviews, and leaves eight rounds of checks on the combined result.
- [ ] It saves commits, and leaves one round of checks on half of the result.
Why: #91 merged eight finished Ticket pull requests in one go instead of eight CI rounds. That left one round of checks on the combined 439 files.
```

Last, one big branch on purpose. #129 adds these 11 Lessons, the GitHub Track. Its body has 14 `Closes` lines: the Spec, then each of its 13 Tickets. Ticket #116's work merged into #129's branch, `115-github-track`, and #116 stayed open. `Closes` acts only when #129 itself merges into `main`.

```checkpoint quick-11
A Ticket's work merges into one big branch, whose pull request says `Closes` for it. Why does the Ticket stay open?
- [x] `Closes` acts only when that pull request merges into `main`.
- [ ] That pull request's `Closes` line works only for the Spec.
- [ ] `Closes` acts only when that pull request gets a review.
Why: #129's body has a `Closes` line for each Ticket, and `Closes` acts only when #129 itself merges into `main`.
```

The Track's Spec records the choice. One pull request per Lesson was recommended, and the owner chose one big one with no pause. It names the known cost too: if these Lessons' shape doesn't work when the owner reads it, all 11 need changing.

implement-spec's author, Matt Pocock, sees a rough edge: "The result is one big branch, and there is no good answer to that yet."

### Where it goes wrong

**The Spec's print scrolls past you.** A long Spec runs to hundreds of lines. Add `--web` to open it in your browser.

**#229 shows no `Sub-issues ·` row.** Your `gh` may be too old. It needs 2.94 or later, so check `gh --version` and update it. Or you piped it: `gh` prints another format unless it's writing to a terminal, so drop `| less`, or use `--web`.

**Your own Spec shows no `Sub-issues ·` row.** Nobody has split that Spec into Tickets, or its Tickets aren't linked to it. To split one, type [`/to-tickets`](/learn/to-tickets) and its number. The agent won't reach for that Skill on its own. If Claude says it isn't installed, run `npx skills@latest add mattpocock/skills`, then `/setup-matt-pocock-skills`.

**#248 has closed.** Every Ticket on #229 is then closed, so it has no next one. Try #264 the same way. Read its `1. What changes` part instead of `Solution`. Its `Open` Tickets that print `0` are all next, so name one, like #320.

**Several Tickets have nothing open blocking them.** All of them are next, so pick one. You'll meet running two at once in [Two sessions at once](/learn/working-with-an-agent-on-github).

**#305's print says `Auto-merge: enabled`.** `finance-agent`'s own rule tells agents to turn that on, so its pull requests merge by themselves once their required reviews and checks pass. Without that rule, yours waits for your Merge check. That's why the You say above ends `Don't merge.` Its branch name, `themes-T02`, also breaks the [`<issue-number>-<short-slug>`](/learn/branches-and-worktrees) rule. Yours shouldn't.

**`/implement` has finished, but the Ticket is still open.** It ends at a commit on your current branch, and never touches the Ticket. Ask Claude to push and open the pull request, saying `Closes` and the number.

```checkpoint quick-12
`/implement` has finished, but the Ticket is still open. What do you do?
- [x] Ask Claude to push and open the pull request.
- [ ] Run `/implement` on the same Ticket a second time.
- [ ] Wait, because `/implement` closes the Ticket later.
Why: `/implement` ends at a commit on your current branch, and never touches the Ticket. So ask Claude to push and open the pull request, saying `Closes` and the number.
```

**A Ticket looks blocked, though its blocker's work has merged.** The count drops only when an Issue closes, and on one big branch that's at the end. On this site's repo, #117 still counted #116 as open after #116's work reached #129's branch. So have Claude track what has merged into that branch.

```checkpoint quick-13
On one big branch, when does a Ticket's blocked-by count drop?
- [x] When the Issue blocking it closes, at the end.
- [ ] When the Issue blocking it merges into that branch.
- [ ] When the Ticket's own work merges into that branch.
Why: The count drops only when an Issue closes, and on one big branch that's at the end. So have Claude track what has merged into that branch.
```

**No pull request appeared for implement-spec.** It opens one after the first merge, and only if your project closes work through pull requests, or you ask for one. So wait for that merge, or ask.

**Your Spec says `ready-for-agent`, and you didn't ask for that.** to-spec adds that label. On a Spec it means no more triage is needed: an input for an agent, not an order to build it. An agent running without you can't tell the difference, and may try to build the whole Spec. So remove the label once `/to-tickets` has run.

```checkpoint quick-14
Your Spec says `ready-for-agent`. What does that label mean on a Spec?
- [x] No more triage is needed.
- [ ] It's an order to build it whole.
- [ ] Someone asked for that label.
Why: to-spec adds that label. On a Spec it means no more triage is needed: an input for an agent, not an order to build it.
```

### Read more

- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock, updated 2026-08-24
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, updated 2026-08-24
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, updated 2026-08-24
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock, updated 2026-10-05
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, updated 2026-10-05
- [The /grilling Skill](https://www.aihero.dev/skills-grilling), Matt Pocock, updated 2026-08-24
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs, read 2026-10-29
- [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), Google Engineering Practices, read 2026-11-05
- [Teach simply: the Tutor follows the Topic, one step and one ask at a time](https://github.com/SiddharthMuramkar/finance-agent/issues/229), SiddharthMuramkar, 2026-11-04
- [The site follows the Mac by default, and the header menu picks any of the four Themes](https://github.com/SiddharthMuramkar/finance-agent/pull/305), SiddharthMuramkar, 2026-11-04

## Remember

```flashcards
Q: You pick up a Spec's work. Which Issue do you read first, and why?
A: The Spec. Tickets get closed, and the Spec stays as the one place that records the reasoning.

Q: How do you find a Spec's next Ticket?
A: Look for an open Ticket with nothing open blocking it. The `Blocked by:` row still lists closed Issues, so count the open ones.

Q: What's your default to ask for on a Spec's work?
A: One pull request per Ticket, each into `main`, so each Merge check stays small.

Q: What does implement-spec's one big branch cost you?
A: You stop reading each Ticket's work as it merges, and you check the whole integration branch at the end.

Q: Why does merging a Ticket's branch into a shared branch leave the Ticket open?
A: GitHub acts on `Closes` only on merges into the default branch, `main`.

Q: `/implement` has finished. What has changed on GitHub?
A: Nothing yet. It ends at a commit on your current branch, so Claude still has to push and open the pull request.

Q: On one big branch, why can a Ticket look blocked after its blocker's work has merged?
A: The blocked-by count drops only when the blocker closes, and that's at the end. So track what has merged into the branch.
```

## Final test

```final-test your-flow-on-github-back-after-a-week
You come back to a project after a week away. Its Issue list is long, and you've lost track of what you decided. What do you read first?
- [x] The Spec, because your decisions live there, then its Tickets' blocked-by links for what's next.
- [ ] The newest Ticket, because its body repeats every decision the Spec above it records.
- [ ] The lowest-numbered open Ticket, because the Tickets are a list you work from the top.
- [ ] The newest pull request, because its body records each decision from your grilling.
Why: Each Ticket gets closed, and the Spec stays as the one place that records the reasoning. Then the blocked-by links show what can start, because the Tickets aren't a list of steps.
```

```final-test your-flow-on-github-which-is-next
A Spec has two open Tickets. One has a `Blocked by:` row whose only Issue has closed. The other's blocker is still open. Which is next?
- [x] The first, because the row still lists closed Issues and nothing open is blocking it.
- [ ] The second, because working on a Ticket is how its open blocker gets cleared.
- [ ] Neither, because a Ticket can't start while it has any `Blocked by:` row at all.
- [ ] Either, because a `Blocked by:` row is only a note and doesn't affect the order.
Why: A Ticket can start once every Issue blocking it has closed. The `Blocked by:` row also lists closed ones, so count the ones still open.
```

```final-test your-flow-on-github-shared-branch-open
You're running implement-spec. Three Tickets' branches have merged into the integration branch, and all three Tickets still show as open. What's going on?
- [x] Nothing's wrong. They close when the integration branch's pull request merges into `main`.
- [ ] Those merges failed. Ask Claude to merge the three branches into the integration branch again.
- [ ] Their branches lost `Closes`. Ask Claude to add it to the three branches and merge them again.
- [ ] GitHub closes Issues in batches. Wait, and the three Tickets will close by themselves soon.
Why: GitHub ignores closing keywords on a pull request into any other branch, and merging one has no effect on the Issues. So Tickets typically close when the integration branch's pull request merges, at the end of the run.
```

```final-test your-flow-on-github-deeper-implement
You run `/implement` on a Ticket. It says it's finished, but the Ticket is still open and GitHub shows no pull request. What's the likely cause, and the fix?
- [x] It ends at a commit on your current branch. Ask Claude to push and open the pull request.
- [ ] It failed part way through, so its commit was lost. Run `/implement` on the Ticket again.
- [ ] It opened the pull request into the wrong branch. Ask Claude to move that across to `main`.
- [ ] It closes Tickets once CI has run on the commit. Wait for the checks, then look again.
Why: `implement` has no completion step. It ends at the commit and never touches the Ticket, so pushing and opening the pull request are separate asks.
```

```sources
- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock, 2026-04-27 (page says "Updated Aug 24, 2026")
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), Matt Pocock
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, 2026-08-24
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, 2026-08-24
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [A learner reads the tutor for hours without glare, in the theme they like, with nothing crowding the chat](https://github.com/SiddharthMuramkar/finance-agent/issues/264), SiddharthMuramkar, 2026-11-04
- [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), Google Engineering Practices
- [The site follows the Mac by default, and the header menu picks any of the four Themes](https://github.com/SiddharthMuramkar/finance-agent/pull/305), SiddharthMuramkar, 2026-11-04
- [Git - Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository), Scott Chacon and Ben Straub (Pro Git)
- [Git - git-push Documentation](https://git-scm.com/docs/git-push), The Git project
- [gh pr create](https://cli.github.com/manual/gh_pr_create), GitHub CLI manual
- [Git - git-pull Documentation](https://git-scm.com/docs/git-pull), The Git project
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [Branches](https://docs.github.com/en/pull-requests/reference/branches)
- [The /implement-spec Skill](https://www.aihero.dev/skills-implement-spec), Matt Pocock, 2026-10-05 (page says Updated Oct 5, 2026)
- [Finish v2: land the last eight Tickets and bring the site back up](https://github.com/SiddharthMuramkar/skills/pull/91), SiddharthMuramkar, 2026-10-30
- [GitHub Track: 11 practical Lessons for shipping real work](https://github.com/SiddharthMuramkar/skills/issues/115), SiddharthMuramkar, 2026-11-05
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05 (updated)
- [Teach simply: the Tutor follows the Topic, one step and one ask at a time](https://github.com/SiddharthMuramkar/finance-agent/issues/229), SiddharthMuramkar, 2026-11-04
- [Go-live: model sweep, 50-turn replay and production switches](https://github.com/SiddharthMuramkar/finance-agent/issues/248), SiddharthMuramkar, 2026-11-04
- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), GitHub Docs
- [GitHub Track: 11 practical Lessons for shipping real work](https://github.com/SiddharthMuramkar/skills/pull/129), SiddharthMuramkar, 2026-11-05
- [gh issue view](https://cli.github.com/manual/gh_issue_view), GitHub CLI manual
- [Git - git-switch Documentation](https://git-scm.com/docs/git-switch), The Git project
- [The /grilling Skill](https://www.aihero.dev/skills-grilling), Matt Pocock
- [GitHub CLI 2.94.0](https://github.com/cli/cli/releases/tag/v2.94.0), GitHub CLI, 2026-06-10
- [gh help environment](https://cli.github.com/manual/gh_help_environment), GitHub CLI manual
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request), GitHub Docs
- [Issue tracker: GitHub](https://github.com/SiddharthMuramkar/finance-agent/blob/main/docs/agents/issue-tracker.md), SiddharthMuramkar
```
