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
- You'll be able to judge a PR body: a Summary that shows the change, Evidence with a before and an after, and a Merge Danger call on the risk of merging.
- You'll be able to judge whether a change can be undone (a two-way door) or not (a one-way door), and use that to decide how hard to review and when to test before merging.
```

## Why it matters

Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) can write a feature in minutes. Someone still has to decide whether that code reaches the real site, and on a careful project that someone is a person reading a pull request: a request to merge a set of changes into the site's main code, which others review first. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, says pull requests are still the main bottleneck for getting work shipped. (A Skill is a short instruction file the agent loads when you type its name, or when a task matches its description. [Skills](/learn/skills) covers them.)

Picture the pull request that added Comments to this site. Suppose its description said only "Added comment box, all tests pass." (Tests are small programs that run the code and check its answers.) You'd have two bad options: read every changed line to work out what it does, or trust the sentence and merge. The first takes an hour. The second is how a change to the database reaches real data unchecked.

This Lesson covers both halves. First, the road a change takes from your laptop to the real site. Then `/pr`, the Skill that shapes the description so ==a reviewer knows what changed, whether it works and how risky it is== before reading a line of code.

## How a change ships

Shipping is mostly vocabulary, so here are the words first.

- **Git** keeps the history of a project folder, called a repo. Each saved step is a **commit**.
- A **branch** is a separate line of commits. **`main`** is the branch the real site is built from, so work happens on other branches until it's ready.
- **Pushing** copies your commits to GitHub, the website that hosts the repo.
- A **pull request (PR)** asks GitHub to merge one branch into another. It shows the **diff** (every line added or removed) and a description called the **body**. Reviewers read both, comment, and approve or ask for changes.
- **Merging** folds the branch into `main`. **Squash and merge** turns all of the branch's commits into one tidy commit on `main`.
- **Production** is the real site that Visitors (the people reading it) use.

On this site, two services make PRs safe to try. Vercel, the site's host, builds a **preview** of every pushed branch: a full, temporary copy of the website at its own address. Neon, the database's host, gives each preview its own **database branch**: a throwaway copy, never merged back, so test data stays off the real site. Every build also runs any **migration** (a script that changes the database's structure, like adding a table) against its own database. So a preview tries a migration on its copy, and only the merge runs it on the real one.

```scene flow
title: How a change ships on this site
node: branch | A branch off main
node: body | The PR body, shaped by the pr Skill | side
node: pr | A pull request on GitHub
node: preview | A Vercel preview site
node: db | Its own Neon database branch | side
node: test | You test the preview
node: merge | Squash and merge
node: prod | Production, the real site
# The change is committed to a branch, so `main` and the real site stay untouched.
at: branch
# When you ask for a PR, the agent writes its body first. That's exactly what the `pr` Skill describes, so it loads without being asked.
at: body
# Then the agent pushes the branch and opens a pull request with that body.
at: pr
# Vercel builds the pushed branch into a preview site at its own address.
at: preview
# The preview gets its own database branch, and any migration runs on that copy first.
at: db
# You open the preview, do the thing the PR is about, and try to break it.
at: test
# Only then do you squash and merge: the branch's commits become one commit on `main`.
at: merge
# Merging puts the change live on production, and that build runs the migration on the real database.
at: prod
```

Merging to `main` deploys production automatically: the new version goes live. That's why ==you test on the preview before you merge==, never after: the preview is the last place a mistake costs nothing.

```checkpoint preview-separate
A recipe site is set up like this one. You open a PR's preview and add a test recipe called "Burnt toast". Where does it end up?
- [ ] On the real site too, because both sites read the same database.
  > Not with this setup. Each preview gets its own database branch, so the real site never sees it.
- [x] Only in the preview's own database branch.
  > Right. The preview is a separate copy, so testing there can't touch production.
- [ ] Nowhere. Previews are read-only.
  > Previews are full working sites. You can post, click and break things, which is the whole point.
- [ ] In production, but only after you squash and merge.
  > Merging ships the code and its migrations, not the recipes you added while testing.
```

## The idea: a body built for the reviewer

`/pr` is a format for a PR body, and that's all. It doesn't create the branch, push it or open the PR. It tells the agent what the body should look like whenever it writes one. It joined the plugin (the bundle that installs all of Matt's Skills at once) in version 1.3, in October 2026.

It's a ==model-invoked Skill==: the agent loads it on its own whenever it's writing a PR body, so you rarely need to type `/pr` (you can). Compare user-invoked Skills like `/implement` (Matt's Skill that builds planned work, test-first where it can, then reviews and commits it), which start only when you type their name.

The body has three sections, in this order, with no intro paragraph above them. It uses your project's own words from its glossary file (`GLOSSARY.md`), if there is one.

**1. Summary: show the change.** The diff is already on the reviewer's screen. The Summary's job is to show its outline before they read it, using the smallest view that makes the point:

| The change is about | The view |
|---|---|
| Logic or an algorithm | Pseudocode (plain-English code) |
| What calls what when it runs | A call tree |
| The structure of a page | A component tree (the page's building blocks, nested) |
| Which file owns what | A shallow file tree |
| How the parts talk to each other | A Mermaid diagram (text that GitHub draws as a picture) |
| What changes in a structure that already exists | A shaped diff: one of these views, with + marking added lines and − removed ones |

Each visual sits next to the short sentence it supports. One is usually enough, several is fine, and all six would bury the point. When most of the code is new, it can show the whole block instead. Matt credits this menu to show-me, a Skill by Dex Horthy of HumanLayer.

**2. Evidence: prove it works.** Always a **before** and an **after**. Screenshots are the strongest evidence when the change is visible and the agent can take them. Next comes evidence from running the code: the exact test that failed before the change and passes after it, written as pseudocode, or console output (what a program prints) that changed. "All tests pass" on its own is a claim, not evidence.

**3. Merge Danger: how risky is it to land?** Two calls:

- **Door: one-way or two-way.** You can walk back through a two-way door: if the change is wrong, a revert (a new commit that undoes it) puts things back. A one-way door can't be walked back. That's anything destructive or hard to reverse: deleted data, a destructive migration, anything already sent out into the world.
- **Blast radius:** one word for how far the damage could spread if the change is wrong, plus optional notes such as layout shift (parts of a page jumping as it loads), problems on phones, or broken code elsewhere that relies on it.

Here's that shape applied to a real bug fix from this site, PR #7, where posting a number as a Comment's text crashed the server. The real PR's body was a bullet list; this one is for illustration. A key: `body` and `name` here are a Comment's text and author, not the PR body. `POST /api/comments` is the request that saves a Comment. The route handler is the code that receives that request; the comments module, through its `postComment` function, checks and saves the Comment. A 500 is the server's "I crashed" reply, a 400 its "your request was wrong". `trim` strips spaces off text, and crashed when handed a number. The schema is the database's structure.

````md
## Summary

A non-text body or name is now rejected before it reaches `trim`.

```diff
 POST /api/comments
   route handler: reads the request only
   comments module: postComment(input)
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
The door call is the heart of the body. It turns a gut feeling about safety into a claim you can check and dispute, and it tells you where your attention goes: a reversible change with little reach gets a quick look, an irreversible one a slow, careful read.
```

```checkpoint evidence-no-ui
A PR changes how a nightly script picks which old Comments to archive. There's no screen involved. What belongs in Evidence?
- [x] The test that failed before the change and passes now.
  > Right. With nothing visible to screenshot, the best evidence comes from running the code: a before and an after.
- [ ] A screenshot of the changed code, open in the editor.
  > A picture of code doesn't show that it works. Screenshots are strongest only when the change itself is visible.
- [ ] A note that a code review checked the branch and found no problems.
  > A review checks the code's quality and its fit with the plan. Evidence shows the change working, with a before and an after.
- [ ] A Mermaid diagram of the script.
  > A diagram belongs in the Summary. It shows the shape of the change, not that it works.
```

## A session, step by step

Here's that bug fix again as a short session (one Claude Code conversation). The fix and its new test are committed on their own branch. You've just reviewed them in a clean session, as [Code review](/learn/code-review) advises, so this session never saw the new test fail.

```scene chat
title: Writing the body for a bug fix on this site (illustrative)
# You ask for a body, and nothing else.
you: Write the PR body for this branch against main. Show it to me here; don't push or open anything.
# Writing a PR body is what the `pr` Skill describes, so the agent loads it on its own. Evidence needs a real before and after, so it runs the new test on both versions instead of trusting the code it read.
agent: *Loads the `pr` Skill, reads the diff between this branch and `main`, then runs the new test against `main`'s code (a 500) and on this branch: 20 of 20 pass.*
# The body starts at the Summary: one small visual and a sentence, no intro.
agent: **Summary:** a shaped diff of the comments module, with one new line: *if body or name is not text → 400*.
# Evidence is a before and an after: the new test on `main`'s code, then on this branch.
agent: **Evidence:** before the fix, the new test got a 500 (`.trim is not a function`). Now it gets a 400, and all 20 tests pass.
# Merge Danger names the door and the blast radius.
agent: **Merge Danger:** two-way door, because there's no schema or data change and a revert undoes it. Blast radius: small.
# You skim the diff yourself rather than take the agent's door call on trust: a small change, no migration, nothing deleted or sent. The two-way call holds.
you: The door call holds. Push the branch and open the PR with this body.
# Only now does anything leave your laptop. The PR opens, and Vercel starts building its preview.
agent: Pushed the branch and opened the PR with `gh pr create` (`gh` is GitHub's command-line tool).
```

```checkpoint body-only
On a book-club site, you type `/pr` on a finished, reviewed branch and press Enter. When it's done, what has the Skill given you?
- [ ] An open PR on GitHub with that body.
  > `/pr` only shapes the body. Pushing and opening the PR are separate steps the agent takes when you ask.
- [ ] A draft PR, waiting for your approval.
  > `/pr` never opens anything, draft or not. Opening a PR is a separate step you ask for.
- [ ] The branch pushed, with the PR left for you to open.
  > Pushing is a separate step too, and `/pr` doesn't take it.
- [x] A PR body in your terminal, and nothing else.
  > Right. It writes the body and stops. Ask the agent to push the branch and open the PR when you're ready.
```

## Your part: read it, argue with it

`/pr` writes the body. Judging it is still your job.

- **Read Merge Danger first,** then Evidence, then Summary. The door call tells you how carefully to read the rest.
- **Doubt the comfortable call most.** "Two-way, small blast radius" comes from the same agent that wrote the code, so it's marking its own homework. Whether a change can be undone often isn't visible in the diff at all. Reverting code doesn't bring back deleted rows, and as one user put it in Matt's docs, "rolling back a commit won't unsend a batch of emails."
- **Give the agent what it needs to judge.** Show it the ticket (one small task from a plan) or the spec (the written description of what to build), not only the diff. Name your repo's one-way changes (migrations, anything that sends messages out, anything that deletes) in `CLAUDE.md`, a file of standing instructions the agent reads at the start of every session.
- **Start on a branch.** `/implement` commits to whatever branch you're on. Ask for a new branch before you build, or the work lands on `main`.
- **Review before the body.** Run Matt's review Skill by its full name, `/mattpocock-skills:code-review`, so the body describes a diff that's already been checked. The short name `/code-review` can reach Claude Code's own Built-in review, a bug hunt; if the reply lacks Matt's two sections, Standards and Spec, that's what answered. `/implement` calls the review by its short name too, so run the full name yourself afterwards (see [Code review](/learn/code-review)).
- **Ask for a rewrite after big changes.** The body is written once. If the PR changes a lot under review, ask the agent to write it again.

What it won't do: open the PR (the agent does that with `gh` when you ask), sort through review comments, follow your repo's own PR template (a file GitHub uses to pre-fill new PR descriptions; settle any clash in `CLAUDE.md`), label the body as AI-written, or split a huge PR. And if a Mermaid diagram looks like raw text in your terminal, nothing's broken: GitHub draws it.

When the work ships as a PR, `/pr` comes between review and the retrospective in [The main flow](/learn/main-flow): `/implement`, `/mattpocock-skills:code-review`, `/pr`, then `/retro` (a look back at the session). Among Matt's Skills, only `/implement-spec`, which builds a whole spec in one run, opens a PR by itself: a draft (marked not ready for review) that it marks ready when the work is done, and only if your issue tracker (where tickets live) closes work through PRs or you ask. See [Implement](/learn/implement).

```checkpoint door-lasting-fix
On your project, the agent keeps calling database migrations "two-way: just revert". You've corrected it in three separate sessions. What's the lasting fix?
- [ ] Correct it again each time, since door calls are judgements it makes fresh.
  > The correction disappears with the session. Write the rule where every session will read it.
- [x] Write in `CLAUDE.md` that migrations are always one-way doors.
  > Right. Every session reads `CLAUDE.md` at the start, so the next door call begins from your rule.
- [ ] Stop the agent using `/pr` on PRs that change the database.
  > Those are the PRs where the door call matters most. Fix the call; don't drop it.
- [ ] Run a code review on every PR that changes the database.
  > A review checks the code, not how the next session calls the door. Write the rule where every session reads it.
```

## How Matt and others use it

**Matt Pocock** built `/pr` to make human review as fast and simple as possible. From his talks, videos and docs:

- **It loads by itself.** In his v1.3 video (5 October 2026) he called it one of his most used recent Skills and said it seems to load every time without being asked, at least on Opus 5.5, one of Anthropic's models.
- **Evidence buys verification.** In the same video he explained that asking for evidence often makes the agent run an extra test or take a screenshot. Without it, agents happily say a change probably works because they've read the code.
- **His own example,** in that video, merged two near-identical algorithms. The body showed the files removed and added, the call structure, a before and after on a real record, and Merge Danger: two-way, small blast radius.
- **Merge Danger goes last, but gets read early.** He puts it at the bottom and expects it to be the first or second thing a reviewer looks at.
- **Review the irreversible.** In his "Fixing the PR Bottleneck" talk (25 September 2026), he said most PRs are two-way doors, software's big advantage over civil engineering, where a bad bridge can't be reverted. But a tiny change that accidentally emails 60,000 people is one-way. He closed with the rule: not every two-way door needs review, but every one-way door does.
- **Flags don't settle it.** His October 2026 docs warn that a change hidden behind a feature flag (a switch that turns new code on or off without a new release) stays reversible only until it first saves data in the new shape.
- **PRs that close issues.** In a May 2026 video he said he usually has the agent open a PR that references the issue (the ticket on GitHub), so merging closes it.

**Other developers:**

- A self-described AI rookie on Matt's GitHub discussions asked in August 2026 when to push and open a PR after `/implement`. Replies, the last in October, explained that `/implement` commits to whatever branch you're on and `/pr` only writes the body, so pushing and opening the PR are yours, by hand or by asking the agent.

## Try it yourself

````try
You need Claude Code installed and signed in, plus Git (see [Start here](/learn/start-here)). Nothing here touches GitHub.

1. In your terminal, make a practice folder that's a Git repo and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir pr-practice
cd pr-practice
git init -b main
claude
```

2. Type `/pr` but don't press Enter. In the list that pops up, look for a `pr` entry described as "Use when writing a PR body." Then delete what you typed. If it isn't there, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box (plan mode only reads and proposes), press Shift+Tab until it changes. Then set up a tiny project. If it asks permission to create files or run commands in this folder, choose Yes; press Esc at any point to stop it. If Git says it doesn't know who you are, let the agent set a name and email for this folder only.

```text
Create a tiny project in a language already installed here: one function that returns a comment's display name, with one passing test. Commit it to main.
```

4. Make a change on a branch. Watching the new test fail first is what gives the body a real "before". If the agent proposes a seam (the boundary a test checks the code at) and waits, reply: "Yes, test the display-name function itself."

```text
Make a branch called anonymous-name. First write a test that an empty or blank name shows as "Anonymous", and run it so we see it fail. Then change the function so it passes, and commit to that branch.
```

5. Ask for the body, and only the body:

```text
Write the PR body for this branch against main. Show it to me here; don't push or open anything.
```

6. Read it as the reviewer: Merge Danger first, then Evidence, then Summary. Then ask: "What would make this a one-way door?"
7. Type `/exit` when you're done. Later, in a real project of yours that's already on GitHub, with `gh` signed in, you can end with: "Push this branch and open the PR with that body."

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
- **Merging, then testing.** On a PR with a migration, the merge has already changed the real database. Check the preview first.
- **A wall of diagrams, or a huge PR.** One small view is usually enough, and `/pr` can't split a PR that's too big to review.
- **The rest are in Your part, above:** trusting "two-way, small" on sight, building on `main`, and expecting `/pr` to push, open or update the PR.

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

**I proved the copies are separate.** I posted a Comment on the preview, then checked the real site. It wasn't there. And migrations ship themselves: the preview build migrates the copy, the merge migrates production. Nobody has to remember to run them by hand.

**My PR bodies, read against the template today.** My early bodies (PRs #2 to #7) were bullet lists of what changed, most with steps for checking it on the preview. Of those, PR #7 came closest: a failing ("red") test reproducing `.trim is not a function`, then 20 passing tests. PR #8, the README, had all three sections: a file-tree diff, a before and an after, and Merge Danger with a door and a one-word blast radius ("none"). PR #9, merged the next day, slipped back. It had an Evidence heading and a door line, but no before. Its Evidence opened with passing checks (tests, a style check, a type check, a build): "vitest (24), eslint, `tsc --noEmit` and `next build` pass." It had no Summary visual and no blast radius. My journal says `/pr` wrote it, so even with the Skill loaded, read every body against the template. PR #10 went back to the full shape, and that's the one I now ask for.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Before you build | Make a branch; `/implement` commits wherever you are |
| Code written, not yet reviewed | `/mattpocock-skills:code-review` (the bare `/code-review` can reach Claude Code's own) |
| Need a PR body | Ask for one; `/pr` loads by itself |
| Reading a body | Merge Danger, then Evidence, then Summary |
| Evidence | A before and an after: screenshots if visible, else a test that failed before and passes now |
| Door call | One-way if it's destructive or hard to reverse: deletes data, migrates destructively, sends anything out |
| Repo always treats X as one-way | Write it in `CLAUDE.md` |
| Big changes under review | Ask for the body to be rewritten |
| Ship it | Preview → test it → squash and merge → production |

## Final test

```test scenario-need-to-type
You've reviewed a branch and you're about to type "open a PR for this". Do you need to type `/pr` first to get the Summary, Evidence and Merge Danger shape?
- [x] No. Asking for a PR is enough; the agent picks up `/pr` itself.
  > Right. `/pr` is model-invoked, and Matt says it fires reliably by itself, at least on Opus 5.5.
- [ ] Yes. Without it, the agent writes no body at all.
  > The agent can always write a body. The question is its shape, and `/pr` supplies that without you typing it.
- [ ] Yes, because only typing `/pr` makes the agent push the branch and open the PR.
  > `/pr` never pushes or opens anything; it only shapes the body. The agent opens the PR with `gh` because you asked.
- [ ] No. `/implement` already wrote the body when it committed.
  > `/implement` ends by committing to the current branch. It doesn't write a PR body.
```

```test scenario-visual-evidence
A PR makes the Comment box fit on narrow phone screens. In your setup, the agent can open the page in a browser at any width and capture what it shows. What's the strongest Evidence?
- [ ] A layout test that failed at phone width before the fix and passes now.
  > Good evidence, but for a change you can see it ranks below screenshots. A picture shows the box really fits.
- [ ] A shaped diff of the styling code (CSS) that changed.
  > That's a Summary visual. It shows what changed, not that the change works.
- [ ] "Checked on mobile, looks good now."
  > A claim, with no before to compare against.
- [x] Before and after screenshots at phone width.
  > Right. For a visible change, screenshots are the strongest evidence, and the before shows what was broken.
```

```test scenario-review-effort
A PR changes the wording on one button. The agent wrote both the code and the body, and its Merge Danger says "Door: two-way. Blast Radius: small." How much review does it need?
- [ ] A line-by-line read, because every PR deserves equal care.
  > Equal care for everything means too little care for the PRs that can't be undone. Spend it where reversal is hard.
- [x] A quick skim that checks the door call holds.
  > Right. A small two-way door gets a light look, not a slow read. The skim is still how you check the call, since the agent that wrote the code made it.
- [ ] None: the agent's door call already settles it.
  > The call comes from the agent that wrote the code. A quick look is how you catch a "two-way" that isn't.
- [ ] Ask the agent if it's sure, and merge if it says yes.
  > That has the agent grade its own call a second time. Your quick skim is the independent check.
```

```test scenario-stale-body
Reviewers asked for big changes, and you've pushed three more commits to the PR. The body still describes the first version. What do you do?
- [ ] Leave it: reviewers can follow the new commits in the diff.
  > The new commits may change what the Summary shows and whether the Merge Danger call still holds. Ask for a new body.
- [ ] Type `/pr` again: it rewrites the body and puts it on the PR.
  > It rewrites the body, but `/pr` only writes. Putting the new body on the PR is a step you ask the agent for.
- [ ] Add a comment on the PR saying the body is out of date.
  > The body is what reviewers read first. Fix it rather than flag it.
- [x] Ask the agent to rewrite the body and update the PR.
  > Right. Writing a PR body loads `/pr` again, so the new body has the same shape. `/pr` won't put it on the PR for you.
```

```test scenario-repo-template
Your team's repo already has a PR template (`.github/pull_request_template.md`), and you want agent-written bodies to respect it. What do you do?
- [ ] Let `/pr` find the repo's template and fill it in.
  > `/pr` has its own template and doesn't look for yours. Left alone, the agent has two competing instructions.
- [ ] Copy the repo's template into `GLOSSARY.md`, since `/pr` reads that file.
  > `/pr` borrows your project's words from the glossary, not a layout. Say how the two templates combine in `CLAUDE.md`.
- [x] Say in `CLAUDE.md` how they combine, since every session reads it.
  > Right. For example: fill in the repo's template, with Summary, Evidence and Merge Danger under it.
- [ ] Type `/pr` yourself, so it reads the repo's template.
  > Typing the name loads the same Skill, which still doesn't look for your template.
```

```test spot-claim-evidence
A PR fixes a recipe site's search, which found nothing when you typed "Pasta" with a capital P. Its Evidence reads: "Fixed. All 112 tests pass." Spot the mistake.
- [ ] Evidence should be a Mermaid diagram of the search module.
  > A diagram shows the shape of the change, so it belongs in the Summary. Evidence shows the change working.
- [x] It never shows the search failing, then working.
  > Right. A passing suite is a claim. Show a before and an after: screenshots of the search if the agent can take them, or the search test that failed before the fix and passes now.
- [ ] It should say how many files changed.
  > The diff already shows that, and it proves nothing about whether search works.
- [ ] Nothing: a full green suite is the strongest evidence there is.
  > Screenshots rank higher for visible changes, and a green suite with no before doesn't show this bug was ever caught.
```

```test spot-prose-summary
Jo's Summary is four paragraphs walking through every file the agent touched, in the order it touched them. Spot the mistake.
- [ ] It should start with Merge Danger instead.
  > The order is Summary, Evidence, Merge Danger. Reviewers may read Merge Danger first, but the body doesn't start with it.
- [ ] Four paragraphs is fine, but each one needs a screenshot.
  > Screenshots are Evidence, and only for visible changes. The problem is the prose itself.
- [ ] It needs a fifth paragraph saying why each file changed.
  > More prose makes it longer, not clearer. A file-by-file walk-through is just the diff retold in words.
- [x] The Summary should be a small visual, not prose.
  > Right. Pick the smallest view that makes the point, like a call tree or a shaped diff, with a short sentence beside it.
```

```test spot-text-door
A two-line PR on a dentist's booking site turns on a text-message reminder to every patient the night before their visit. Its Merge Danger says: "Door: two-way, we can revert the commit." Spot the mistake.
- [x] The door is one-way, since texts can't be unsent.
  > Right. Anything sent out into the world is a one-way door, however small the diff. Read this one slowly.
- [ ] Nothing: a revert switches the reminders off again.
  > It stops future texts. The ones already sent can't be pulled back, and that's what makes the door one-way.
- [ ] The call is right; it just needs a wider blast radius.
  > Blast radius is how far it spreads. The door is about whether it can be undone, and this one can't.
- [ ] Two-line diffs don't need a Merge Danger section.
  > Every body gets one, and size doesn't decide the door. Matt's own one-way example is a tiny change that accidentally emails 60,000 people.
```

```test spot-merge-then-test
On a recipe site set up like this one, a PR's migration renames the `ingredients` table. Sam clicks Squash and merge, then opens the preview to check the rename worked. Spot the mistake.
- [ ] Nothing: a revert undoes a migration like any other change.
  > Reverting the code doesn't undo what a migration did to the database. That's what can make it a one-way door.
- [x] The merge migrated the real database, so the check came too late.
  > Right. Merging deploys production, and that build migrates the real database. Check the preview first, while a mistake only hits its copy.
- [ ] The preview already migrated the real database, so merging first changed nothing.
  > Each preview migrates its own database branch. Only the merge's production build touches the real one, which is why you test the preview first.
- [ ] Squash and merge skips migrations, so Sam must run this one by hand.
  > Squashing only combines the commits. The production build still runs the migration.
```

```test sequence-review-body-ship
A small feature for a recipe site set up like this one is ready to build. Which order matches the advice in this Lesson?
- [ ] branch → build → `/pr` writes the body → `/mattpocock-skills:code-review` → open the PR → test the preview → squash and merge
  > The body should describe a diff that's already been reviewed. If the review changes the code, this body is out of date before anyone reads it.
- [ ] branch → build → `/mattpocock-skills:code-review` → open the PR → test the preview → squash and merge → `/pr` writes the body
  > The body is for the reviewer, so it has to exist before anyone reviews or merges the PR.
- [x] branch → build → `/mattpocock-skills:code-review` → `/pr` writes the body → open the PR → test the preview → squash and merge
  > Right. Review, then describe, then test on the copy. The merge is the last step and the only one that touches production.
- [ ] build on `main` → `/mattpocock-skills:code-review` → branch → `/pr` writes the body → open the PR → test the preview → squash and merge
  > `/implement` commits to whatever branch you're on, so building first puts the work on `main`. Branch before you build.
```

```sources
- [pr SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/pr/SKILL.md) and [pr CREDITS.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/pr/CREDITS.md) (Dex Horthy's show-me): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md) and [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md) (commits to the current branch; draft PRs, marked ready at the end): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (where `/pr` sits in the Main flow, when the work goes up as a PR): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock-skills CHANGELOG 1.3.0](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (`pr` graduates into the plugin, #1120): pinned to mattpocock-skills 1.3.1, read 2026-10-24.
- [The /pr Skill](https://www.aihero.dev/skills-pr), AI Hero docs, published 2026-10-05, read 2026-10-23 (what it doesn't do, trusting the door call, feature flags, users' quotes).
- [Skills changelog v1.3](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), AI Hero, 2026-10-05, read 2026-10-24 (why `/pr`, evidence, skim a small two-way door, reliable on Opus 5.5).
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (most used 4:54–5:00, the bottleneck 5:28–5:40, evidence 5:53–6:25, doors and blast radius 6:28–7:11, his example PR 7:11–7:46, fires every time 7:46–8:05).
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock at AI Engineer Paris, 2026-09-25 (doors and the 60,000 emails 17:14–18:14, Merge Danger at the bottom and a light review 18:14–18:44, pseudocode summaries 18:44–19:44, the closing rule 21:44–22:14); wording checked against the [English transcript on ai.engineer](https://ai.engineer/talks/LlgiOCmFG_w-fixing-pr-bottleneck), read 2026-10-24.
- [Burn through the backlog from hell with /triage](https://www.youtube.com/watch?v=MzWIIlx0Gpc), Matt Pocock, 2026-05-07 (PRs that close the issue, 8:07–8:17).
- [Discussion #835: branches and PRs after /implement](https://github.com/mattpocock/skills/discussions/835), mattpocock/skills, opened 2026-08-11, the `/pr` reply 2026-10-06, read 2026-10-24.
- This site's [ADR 0002: one Neon branch per environment](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/docs/adr/0002-neon-branch-per-environment.md), read 2026-10-23, and PRs [#7](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/7) and [#8](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/8) (merged 2026-10-21), [#9](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/9) (merged 2026-10-22) and [#10](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/10) (merged 2026-10-23).
```
