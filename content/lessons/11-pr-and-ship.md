---
title: PR + ship
slug: pr-and-ship
order: 11
part: 2
image: /photos/pr-and-ship.jpg
imageAlt: An aerial view of a loaded container ship guided out of port by two red tugboats.
imageCredit: william william
---

Get a change from your branch onto the real site safely, through a pull request a person can review in minutes.

```goals
- You'll be able to follow a change from a branch to production on a site like this one: pull request, preview with its own database branch, testing, then squash and merge.
- You'll be able to say what `/pr` does and what it leaves to you: it's model-invoked, and it writes only the PR body.
- You'll be able to judge a PR body: a Summary that shows the change, Evidence with a before and an after, and a Merge Danger call.
- You'll be able to make the door call yourself, one-way or two-way, and decide how hard to review and when to test before merging.
```

## Why it matters

Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) can write a feature in minutes. Someone still has to decide whether that code reaches the real site, and on a careful project that someone is a person reading a pull request. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, says pull requests are still the main bottleneck for getting work shipped. (A Skill is a short instruction file the agent loads when you type its name, or when a task matches its description. [Skills](/learn/skills) covers them.)

Picture the pull request that added Comments to this site. Suppose its description said only "Added comment box, all tests pass." You'd have two bad options: read every changed line to work out what it does, or trust the sentence and merge. The first takes an hour. The second is how a change to the database reaches real data unchecked.

This Lesson covers both halves. First, the road a change takes from your laptop to the real site. Then `/pr`, the Skill that shapes the description so ==a reviewer knows what changed, whether it works and how risky it is== before reading a line of code.

## How a change ships

Shipping is mostly vocabulary, so here are the words first.

- **Git** keeps the history of a project folder, called a repo. Each saved step is a **commit**.
- A **branch** is a separate line of commits. **`main`** is the branch the real site is built from, so work happens on other branches until it's ready.
- **Pushing** copies your commits to GitHub, the website that hosts the repo.
- A **pull request (PR)** asks GitHub to merge one branch into another. It shows the **diff** (every line added or removed) and a description called the **body**. Reviewers read both, comment, and approve or ask for changes.
- **Merging** folds the branch into `main`. **Squash and merge** turns all of the branch's commits into one tidy commit on `main`.
- **Production** is the real site that Visitors use.

On this site, two services make PRs safe to try. Vercel, which builds and hosts the site, makes a **preview** for every PR: a full, temporary copy of the website built from that branch, at its own address. Neon, which hosts the database, gives each preview its own **database branch**, a separate copy of the database. Every build also runs any **migration** (a script that changes the database's structure, like adding a table) against its own database. So a preview tries a migration on its copy, and only the merge runs it on the real one.

```scene flow
title: How a change ships on this site
node: branch | A branch off main
node: pr | A pull request on GitHub
node: body | The PR body, shaped by the pr Skill | side
node: preview | A Vercel preview site
node: db | Its own Neon database branch | side
node: test | You test the preview
node: merge | Squash and merge
node: prod | Production, the real site
# The change is committed to a branch, so `main` and the real site stay untouched.
at: branch
# When you ask, the agent pushes the branch and opens a pull request.
at: pr
# Writing the body is exactly what the `pr` Skill describes, so the agent loads it without being asked.
at: body
# Vercel builds the branch into a preview site at its own address.
at: preview
# The preview gets its own database branch, and any migration runs on that copy first.
at: db
# You open the preview, do the thing the PR is about, and try to break it.
at: test
# Only then do you squash and merge: the branch's commits become one commit on `main`.
at: merge
# Merging deploys production, and that build runs the migration on the real database.
at: prod
```

Merging to `main` deploys production automatically. That's why ==you test on the preview before you merge==, never after: the preview is the last place a mistake costs nothing.

```checkpoint preview-separate
A recipe site is set up like this one. You open a PR's preview and add a test recipe called "Burnt toast". Where does it end up?
- [ ] On the real site too, because both sites read the same database.
  > Not with this setup. Each preview gets its own database branch, so the real site never sees it.
- [x] Only in the preview's own database branch.
  > Right. The preview is a separate copy, so testing there can't touch production.
- [ ] Nowhere, because previews are read-only.
  > Previews are full working sites. You can post, click and break things, which is the whole point.
- [ ] In production, but only after you squash and merge.
  > Merging ships the code and its migrations, not the recipes you added while testing.
```

## The idea: a body built for the reviewer

`/pr` is a format for a PR body, and that's all. It doesn't create the branch, push it or open the PR. It tells the agent what the body should look like whenever it writes one. It arrived in version 1.3 of Matt's Skills, in October 2026.

It's a ==model-invoked Skill==: the agent loads it on its own whenever it's writing a PR body, so you rarely need to type `/pr` (you can). Compare user-invoked Skills like `/implement`, which start only when you type their name.

The body has three sections, in this order, with no intro paragraph above them. It uses your project's own words from its glossary file (`GLOSSARY.md`), if there is one.

**1. Summary: show the change.** The diff is already on the reviewer's screen. The Summary's job is to show its outline before they read it, using the smallest view that makes the point:

| The change is about | The view |
|---|---|
| Logic or an algorithm | Pseudocode (plain-English code) |
| What calls what when it runs | A call tree |
| The structure of a page | A component tree |
| Which file owns what | A shallow file tree |
| How the parts talk to each other | A Mermaid diagram (text that GitHub draws as a picture) |
| What changes in a shape that already exists | A shaped diff |

Each visual sits next to the short sentence it supports. One is usually enough, several is fine, and all six would bury the point. Matt credits this menu to Dex Horthy's show-me Skill.

**2. Evidence: prove it works.** Always a **before** and an **after**. Screenshots are the strongest evidence when the change is visible and the agent can take them. Next comes evidence from running the code: the exact test that failed before the change and passes after it, written as pseudocode, or console output (what a program prints) that changed. "All tests pass" on its own is a claim, not evidence.

**3. Merge Danger: how risky is it to land?** Two calls:

- **Door: one-way or two-way.** You can walk back through a two-way door: if the change is wrong, a revert (a new commit that undoes it) puts things back. A one-way door can't be walked back: deleted data, a destructive migration, anything already sent out into the world.
- **Blast radius:** one word for how far the damage could spread if the change is wrong, plus optional notes such as layout shift, problems on phones, or broken code elsewhere that relies on it.

Here's that shape applied to a real bug fix from this site, PR #7, where posting a number as a Comment crashed the server. This body is written for illustration; the real PR's body was a bullet list.

````md
## Summary

A non-text body or name is now rejected before it reaches `trim`.

```diff
 POST /api/comments
   route handler: parse JSON only
   comments module: addComment(input)
+    if body or name is not text → 400 with an error message
     trim, check lengths, save
```

## Evidence

- **Before:** test "rejects a non-text body": POST {"body": 123} → 500, `.trim is not a function`
  **After:** same test → 400 with an error message; 20 of 20 tests pass

## Merge Danger

**Door:** two-way

Input checks only. No schema or data changes, so a revert undoes it cleanly.

**Blast Radius:** small

Requests that used to crash now get a 400. Valid Comments behave as before.
````

```callout big-idea
The door call is the heart of the body. It replaces a gut feeling about whether a change is safe with a claim you can check and dispute. It also tells you where your attention goes: a reversible change with little reach gets a quick look, and an irreversible one gets a slow, careful read.
```

```checkpoint evidence-no-ui
A PR changes how a nightly script picks which old Comments to archive. There's no screen involved. What belongs in Evidence?
- [x] The test that failed before the change and passes now.
  > Right. With nothing visible to screenshot, the best evidence comes from running the code: a before and an after.
- [ ] A screenshot of the changed code, open in the editor.
  > A picture of code doesn't show that it works. Screenshots are strongest only when the change itself is visible.
- [ ] "All tests are green, and lint and type checks are clean."
  > That's a claim. Evidence shows a before and an after.
- [ ] A Mermaid diagram of the script.
  > A diagram belongs in the Summary. It shows the shape of the change, not that it works.
```

## A session, step by step

Here's that bug fix again as a short session (one Claude Code conversation). The fix is committed on its own branch, and the branch has already been reviewed.

```scene chat
title: Writing the body for a bug fix on this site (illustrative)
# You ask for a body, and nothing else.
you: Write the PR body for this branch against main. Show it to me here; don't push or open anything.
# Writing a PR body is what the `pr` Skill describes, so the agent loads it on its own, then reads the diff.
agent: *Loads the `pr` Skill, then reads the diff between this branch and `main`.*
# The body starts at the Summary: one small visual and a sentence, no intro.
agent: **Summary:** a shaped diff of the comments module, with one new line: *if body or name is not text → 400*.
# Evidence is a before and an after, from a real test run.
agent: **Evidence:** before, the new test gets a 500 (`.trim is not a function`). After, it gets a 400, and all 20 tests pass.
# Merge Danger names the door and the blast radius.
agent: **Merge Danger:** two-way door, because there's no schema or data change and a revert undoes it. Blast radius: small.
# You check the call that matters most, then ask it to ship.
you: Does anything here touch the database? If not, push the branch and open the PR with this body.
# Only now does anything leave your laptop. The PR opens, and Vercel starts building its preview.
agent: No schema or data changes. Pushed the branch and opened the PR with `gh pr create`.
```

Notice two things. Nobody typed `/pr`: asking for a PR body was enough. And nothing left the laptop until the last message asked for it.

```checkpoint body-only
You tell the agent: "Write the PR body for this branch. Show it here; don't push." Then you open the repo on GitHub. What do you find?
- [ ] A new PR with that body, because writing a PR body loads `/pr`.
  > `/pr` only shapes the body. Pushing and opening a PR are separate steps the agent takes when asked.
- [ ] A draft PR, waiting for your approval.
  > Only `/implement-spec` opens draft PRs, and only in specific cases. `/pr` never does.
- [ ] The branch, pushed, but no PR yet.
  > Pushing is a separate step too, and you asked it not to.
- [x] Nothing new: the body exists only in your terminal.
  > Right. Nothing leaves your machine until you ask the agent to push the branch and open the PR.
```

## Your part: read it, argue with it

`/pr` writes the body. Judging it is still your job.

- **Read Merge Danger first,** then Evidence, then Summary. The door call tells you how carefully to read the rest.
- **Doubt the comfortable call most.** "Two-way, small blast radius" comes from the same agent that wrote the code, so it's marking its own homework. Whether a change can be undone often isn't visible in the diff at all. Reverting code doesn't bring back deleted rows, and as one user put it in Matt's docs, "rolling back a commit won't unsend a batch of emails."
- **Give the agent what it needs to judge.** Make sure the ticket or spec (the written description of what to build) is in front of it, not just the diff. List the changes your repo always treats as one-way, such as migrations, anything that sends messages out and anything that deletes, in your `CLAUDE.md`: a file of standing instructions the agent reads at the start of every session.
- **Start on a branch.** `/implement` commits to whatever branch you're on. Ask for a new branch before you build, or the work lands on `main`.
- **Review before the body.** If nobody has reviewed the code yet, run `/code-review` first, so the body describes a diff that's already been checked (`/implement` runs it for you at the end). If the short name runs Claude Code's own Built-in review instead, type `/mattpocock-skills:code-review` (see [Code review](/learn/code-review)).
- **Ask for a rewrite after big changes.** The body is written once. If the PR changes a lot under review, ask the agent to write it again.

What it won't do, so you aren't surprised: open the PR (the agent does that with `gh`, GitHub's command-line tool, when you ask), sort through review comments, follow your repo's own PR template (settle any clash in `CLAUDE.md`), label the body as AI-written, or split a huge PR into smaller ones. And if a Mermaid diagram looks like raw text in your terminal, nothing's broken: GitHub draws it.

In [The main flow](/learn/main-flow), `/pr` comes between review and the retrospective: `/implement`, then `/code-review`, then `/pr`, then `/retro`. Among Matt's Skills, only `/implement-spec` opens a PR by itself, and only as a draft (a PR marked not ready for review), when your issue tracker (where tickets live) closes work through PRs or you ask. See [Implement](/learn/implement).

```checkpoint door-lasting-fix
On your project, the agent keeps calling database migrations "two-way: just revert". You've corrected it in three separate sessions. What's the lasting fix?
- [ ] Correct it again each time, since door calls are judgements it makes fresh.
  > The correction disappears with the session. Write the rule where every session will read it.
- [x] Write in `CLAUDE.md` that migrations are always one-way doors.
  > Right. List the changes your repo always treats as one-way where the agent reads them before it makes the call.
- [ ] Stop the agent using `/pr` on PRs that change the database.
  > Those are the PRs where the door call matters most. Fix the call; don't drop it.
- [ ] Delete the Merge Danger section from those bodies.
  > Then the reviewer loses the one line that says how hard to look.
```

## How Matt and others use it

**Matt Pocock** built `/pr` to make human review as easy as possible. From his talks and videos:

- **It's one of his most used Skills.** In his v1.3 video (5 October 2026) he called it one of his most used recent Skills and said it seems to load every single time without being asked, at least on Opus 5.5, one of Anthropic's models.
- **He asks for evidence to get verification.** In the same video he explained that asking for evidence often makes the agent run an extra test or take a screenshot. Without it, agents happily say a change probably works because they've read the code.
- **His own example,** shown in the same video, merged two near-identical algorithms. The body showed the files removed and added, the call structure, a before and after on a real record, and Merge Danger: two-way, small blast radius.
- **Merge Danger goes last, but gets read early.** He places it at the bottom of the body and expects it to be the first or second thing a reviewer looks at.
- **Review the irreversible.** In his "Fixing the PR Bottleneck" talk (25 September 2026), he said most PRs are two-way doors, which is software's big advantage over civil engineering: a bad bridge can't be reverted. But a tiny change that accidentally emails 60,000 people is one-way. His closing rule: you don't need to review every reversible decision, but you must review every irreversible one.
- **PRs that close issues.** In his May 2026 video on `/triage`, he said he usually has the agent open a PR that references the issue (the ticket on GitHub), so merging closes it. In that demo he pushed straight to `main` instead.
- **More review is coming.** At an April 2026 workshop he admitted that handing more coding to agents means humans doing more code review, and said he doesn't enjoy saying so.

**Other developers:**

- A self-described AI rookie on Matt's GitHub discussions (August 2026) asked when to push and open a PR after `/implement`. Other users replied that `/implement` commits to whatever branch you're on and `/pr` only writes the body, so pushing and opening the PR are yours, by hand or by asking the agent. One reply's rule of thumb: one branch per logical PR.
- Users quoted in Matt's October 2026 docs have warned that a change hidden behind a feature flag stays reversible only until it first saves data in the new shape. That's why the door call is a claim to check, not a fact.
- One developer on Hacker News (August 2026) uses `/code-review` to check the code against the spec, then posts details from his plan on the PR, so reviewers have the context they need.

## Try it yourself

````try
You need Claude Code installed and signed in, plus Git (see [Start here](/learn/start-here)). Nothing here touches GitHub.

1. In your terminal, make a practice folder that's a Git repo and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir pr-practice && cd pr-practice && git init -b main && claude
```

2. Type a slash and the letters pr. If `pr` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box, press Shift+Tab until it changes. Then set up a tiny project. If it asks permission to create files or run commands in this folder, choose Yes.

```text
Create a tiny project in a language already installed here: one function that returns a comment's display name, with one passing test. Commit it to main.
```

4. Make a change on a branch:

```text
Make a branch called anonymous-name. Test-first, change the function so an empty or blank name shows as "Anonymous". Commit to that branch.
```

5. Ask for the body, and only the body:

```text
Write the PR body for this branch against main. Show it to me here; don't push or open anything.
```

6. Read it as the reviewer: Merge Danger first, then Evidence, then Summary. Then ask: "What would make this a one-way door?"
7. Type `/exit` when you're done. Press Esc at any point to stop the agent. Later, in a real project of yours that's already on GitHub, with `gh` signed in, you can end with: "Push this branch and open the PR with that body."

**It's working if:**

- [ ] The body starts at the Summary heading, with no intro paragraph.
- [ ] You can tell what changed from the Summary visual alone.
- [ ] Evidence shows a before and an after (the new test failing, then passing), not just "tests pass".
- [ ] Merge Danger names a door and a one-word blast radius, and you agree with both.
- [ ] Nothing was pushed or opened unless you asked.

If the three headings are missing, ask: "Did you load the pr skill?"
````

## Common mistakes

- **Evidence that's a claim.** "Tests are green" with no before and after.
- **Trusting "two-way, small" on sight.** It's the call to be most suspicious of. Check it against what the change touches.
- **Merging, then testing.** On a PR with a migration, the merge has already changed the real database. Check the preview first.
- **Building on `main`.** `/implement` commits wherever you are. Branch first.
- **Expecting `/pr` to push, open or update the PR.** It writes the body, once.
- **A wall of diagrams, or a huge PR.** One small view is usually enough, and `/pr` can't split a PR that's too big to review.

```site-story
I typed nothing special to ship v1. The agent opened each PR with `gh pr create`, and I clicked **Squash and merge** on GitHub. Six PRs built v1. A rule on my machine blocks pushing straight to `main`, so every change has to go through a PR.

**Every PR came with three things:** a branch (like `issue-06-comment-box`), a Vercel preview site built from it, and a Neon database copy just for that preview (`preview/issue-06-comment-box`).

**How I learned to test a PR** (I didn't know this at first):

1. Open the PR on GitHub.
2. Find the Vercel bot's comment and click its Preview link.
3. Do the thing the PR is about: post a Comment, open a page.
4. Try to break it: an empty form, a wrong URL, a reload.
5. Only then, **Squash and merge**.

**My mistake:** on the final PR I merged first and tested after. It worked, but only because the risky parts had already been tested. On a PR that changes the database, that order could damage real data. In `/pr` words, I walked through a door without checking which kind it was.

**I proved the copies are separate.** I posted a Comment on the preview, then checked the real site. It wasn't there. And migrations ship themselves: the preview build migrates the copy, the merge migrates production. Nobody has to remember `alembic upgrade head`.

**My PR bodies, read against the template today.** My v1 bodies were bullet lists of what changed, mostly with steps for checking it on the preview. PR #7 came closest: its bug fix had real evidence, a red test reproducing `.trim is not a function`, then 20 passing tests. A later body, PR #9, had an Evidence heading and a door line, but its Evidence had no before, only results like "vitest (24), eslint, tsc and next build pass". It also had no Summary visual and no blast radius. Whether or not the agent loaded `/pr` for it, those are the three things I'd now ask for.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Before you build | Make a branch; `/implement` commits wherever you are |
| Code written, not yet reviewed | `/code-review` (or `/mattpocock-skills:code-review`) |
| Need a PR body | Ask for one; `/pr` loads by itself |
| Reading a body | Merge Danger, then Evidence, then Summary |
| Evidence | A before and an after: screenshots if visible, else a test that failed before and passes now |
| Door call | One-way if it deletes, migrates destructively or sends anything out |
| Repo always treats X as one-way | Write it in `CLAUDE.md` |
| Big changes under review | Ask for the body to be rewritten |
| Ship it | Preview → test it → squash and merge → production |

## Final test

```test scenario-need-to-type
You've reviewed a branch and you're about to type "open a PR for this". Do you need to type `/pr` first to get the Summary, Evidence and Merge Danger shape?
- [x] No. The agent loads it on its own whenever it writes a PR body.
  > Right. `/pr` is model-invoked, and Matt says it fires reliably by itself, at least on Opus 5.5.
- [ ] Yes. Without it, the agent writes no body at all.
  > The agent can always write a body. The question is its shape, and `/pr` supplies that without you typing it.
- [ ] Yes, but only when the PR is a one-way door.
  > The door call is part of every `/pr` body, and none of it depends on you typing the name.
- [ ] No, because `/implement` already wrote the body when it committed.
  > `/implement` ends by committing to the current branch. It doesn't write a PR body.
```

```test scenario-visual-evidence
A PR makes the Comment box fit on narrow phone screens. The agent can take screenshots in your setup. What's the strongest Evidence?
- [ ] The console output from a full production build of the branch.
  > Build output says the code compiled, not that it looks right on a phone.
- [ ] A shaped diff of the CSS that changed.
  > That's a Summary visual. It shows what changed, not that the change works.
- [ ] "Checked on mobile, looks good now."
  > A claim, with no before to compare against.
- [x] Before and after screenshots at phone width.
  > Right. For a visible change, screenshots are the strongest evidence, and the before shows what was broken.
```

```test scenario-review-effort
A PR changes the wording on one button. Its Merge Danger says "Door: two-way. Blast Radius: small", and the diff agrees. How much review does it need?
- [ ] A line-by-line read, because every PR deserves equal care.
  > Equal care for everything means too little care for the PRs that can't be undone. Spend it where reversal is hard.
- [x] A quick skim: if it's wrong, a revert undoes it.
  > Right. Matt's rule: you don't need to review every reversible decision, but you must review every irreversible one.
- [ ] None. Two-way doors can be merged without opening them.
  > Skimming isn't skipping. You still check that the call is right and the Evidence is real.
- [ ] Block it until the team writes screenshot tests.
  > That's out of proportion for a wording change that a revert undoes.
```

```test scenario-stale-body
Reviewers asked for big changes, and you've pushed three more commits to the PR. The body still describes the first version. What do you do?
- [ ] Nothing: `/pr` keeps the body in sync as commits arrive.
  > It writes the body at one point in time. It doesn't watch the PR.
- [ ] Close the PR and open a new one so `/pr` runs again.
  > No need for a new PR. Asking for a fresh body is enough.
- [ ] Add a comment on the PR saying the body is out of date.
  > The body is what reviewers read first. Fix it rather than flag it.
- [x] Ask the agent to rewrite the body.
  > Right. Writing a PR body loads `/pr` again, so the new body has the same shape.
```

```test scenario-repo-template
Your team's repo already has a `.github/pull_request_template.md`. Which template will the agent follow when it writes a PR body?
- [ ] The repo's, because `/pr` looks for it first.
  > `/pr` doesn't look for your repo's template at all.
- [ ] Both, merged automatically into one body.
  > Nothing merges them. The agent just has two competing instructions for one document.
- [x] It's unclear until you settle it in `CLAUDE.md`.
  > Right. `/pr` has its own template. Say how to combine them, for example the repo template with the three sections under it.
- [ ] Neither, because `/pr` refuses to run when a repo template exists.
  > It runs regardless. That's why the clash needs settling.
```

```test spot-claim-evidence
A PR body's Evidence section reads: "All 24 tests pass, and lint is clean." What's missing?
- [ ] A Mermaid diagram of the changed modules.
  > Diagrams belong in the Summary. Evidence is proof the change works.
- [x] A before and an after.
  > Right. That sentence is a claim. Show what failed before and passes now, or how the output changed.
- [ ] The number of files that changed.
  > The diff already shows that, and it proves nothing about whether the change works.
- [ ] Nothing, since a passing suite is the strongest evidence.
  > Screenshots rank higher for visible changes, and even test results need a before to compare against.
```

```test spot-prose-summary
Jo's PR body opens with four paragraphs walking through every file the agent touched, in the order it touched them. Spot the mistake.
- [ ] It should start with Merge Danger instead.
  > The order is Summary, Evidence, Merge Danger. Reviewers may read Merge Danger first, but the body doesn't start with it.
- [ ] Four paragraphs is fine, but each one needs a screenshot.
  > Screenshots are Evidence, and only for visible changes. The problem is the prose itself.
- [ ] It should list the files in alphabetical order.
  > Order isn't the problem. A file-by-file walk-through is just the diff retold in words.
- [x] The Summary should be a small visual, not prose.
  > Right. Pick the smallest view that makes the point, like a call tree or a shaped diff, with a short sentence beside it.
```

```test spot-email-door
A two-line PR on a newsletter site turns on a weekly email to every subscriber. Its Merge Danger says: "Door: two-way, we can revert the commit." Spot the mistake.
- [x] A revert can't unsend emails that already went out.
  > Right. Anything sent out into the world is a one-way door, however small the diff. Read this one slowly.
- [ ] Two-line changes can't have a door; doors are for big PRs.
  > Size doesn't decide the door. Matt's example of a one-way door is a tiny change that accidentally emails 60,000 people.
- [ ] The call is right; it just needs a wider blast radius.
  > Blast radius is how far it spreads. The door is about whether it can be undone, and this one can't.
- [ ] Email features should never ship through a PR.
  > They should, with a correct door call so the reviewer knows to slow down.
```

```test spot-merge-then-test
On a PR that adds a migration, Sam clicks Squash and merge, then opens the preview to test it. Why is that order risky?
- [ ] It isn't risky: a revert undoes a migration like any other change.
  > Reverting the code doesn't undo what a migration did to the data. That's what can make it a one-way door.
- [x] The merge already ran the migration on the real database.
  > Right. Merging deploys production, and that build migrates the real database. Check the preview first, while a mistake only hits its copy.
- [ ] GitHub blocks merging until someone has opened the preview.
  > It doesn't, which is why the order is up to you.
- [ ] Squash and merge skips the migration, so production falls behind.
  > Squashing only combines the commits. The production build still runs the migration.
```

```test sequence-ship
Which order ships a change on a site set up like this one?
- [ ] branch → pull request → squash and merge → preview with its own database → test it → production
  > Merging first means production gets the change before anyone has tested it.
- [ ] preview with its own database → branch → pull request → test it → squash and merge → production
  > A preview is built from a PR's branch, so the branch and the PR come first.
- [x] branch → pull request → preview with its own database → test it → squash and merge → production
  > Right. Every step before the merge happens on copies, so a mistake there costs nothing.
- [ ] branch → squash and merge → pull request → preview with its own database → test it → production
  > Once the branch is merged, there's nothing left for a pull request to review.
```

```sources
- [pr SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/pr/SKILL.md) and [pr CREDITS.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/pr/CREDITS.md) (Dex Horthy's show-me): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md) and [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md) (commits to the current branch; draft PRs): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md) (where `/pr` sits in the Main flow): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /pr Skill](https://www.aihero.dev/skills-pr), AI Hero docs, published 2026-10-05, read 2026-10-23 (what it doesn't do, trusting the door call, users' quotes).
- [Skills changelog v1.3](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), AI Hero, 2026-10-05.
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (most used 4:54–5:00, the bottleneck 5:28–5:40, evidence 5:53–6:25, doors and blast radius 6:28–7:11, his example PR 7:11–7:46, fires every time 7:46–8:05).
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock at AI Engineer Paris, 2026-09-25 (doors 17:04–18:10, Merge Danger 18:23–18:37, pseudocode summaries 18:46–19:41, the closing rule 22:09–22:15; checked against an auto-translated transcript).
- [Burn through the backlog from hell with /triage](https://www.youtube.com/watch?v=MzWIIlx0Gpc), Matt Pocock, 2026-05-07 (PRs that close the issue, 8:07–8:17).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock, AI Engineer workshop, 2026-04-24 (more code review ahead, 59:42–60:17).
- [Discussion #835: branches and PRs after /implement](https://github.com/mattpocock/skills/discussions/835), mattpocock/skills, opened 2026-08-11, read 2026-10-23.
- [Hacker News comment on reviewing against the spec](https://news.ycombinator.com/item?id=49297440), 2026-08-14.
- This site's [ADR 0002: one Neon branch per environment](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/docs/adr/0002-neon-branch-per-environment.md), read 2026-10-23, and PRs [#7](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/7) (merged 2026-10-21) and [#9](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/9) (merged 2026-10-22).
```
