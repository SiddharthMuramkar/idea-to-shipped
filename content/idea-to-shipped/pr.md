---
title: pr: write a fast-to-review pull request body
slug: pr
summary: How pr gives your agent a template for a pull request's description: what changed, proof that it works, and how risky merging is.
---

## What it's for

Say you ask the agent to open a [pull request](/learn/pull-requests) for [Ticket](/learn/issues-and-keeping-track) #13, the booking endpoint (the web address your app calls). Its description comes back as a long paragraph. You can't tell what changed, whether it works, or how risky merging is.

**pr gives the agent a template for the pull request's description, its body, so a reviewer can answer all three fast.**

The agent loads pr by itself and fills in three parts:

- **Summary**: the smallest picture that shows the change. Perhaps a file tree: an outline of folders and files.
- **Evidence**: a before and after that proves the change works. A screenshot is best when the change is visual and your setup allows it. Next best: test results or console output (what a program prints).
- **Merge Danger**: how risky merging is.

```checkpoint quick-1
You have a test that failed before your change and passes now. Which part of the body does that go in?
- [x] Evidence, the before and after that proves the change works.
- [ ] Summary, the smallest picture that shows the change itself.
- [ ] Merge Danger, the part that says how risky merging is.
Why: Evidence is the before and after. The Summary shows the change, and Merge Danger says how risky merging is.
```

Merge Danger makes a door call: which of two doors is this change? A **two-way door** is a change you can walk back cheaply. A **one-way door** can't be walked back, like a database change (a SQL migration) that drops a column and its data.

```checkpoint quick-2
You're about to merge a migration that drops a column and its data. Which door is it?
- [x] A one-way door, because dropping that data can't be walked back.
- [ ] A two-way door, because reverting the commit puts the data back.
- [ ] A two-way door, because a SQL migration is cheap to write again.
Why: A one-way door can't be walked back. Reverting the commit puts the code back, but a dropped column's data is gone.
```

Merge Danger also names the **blast radius**: how much a change could affect if it goes wrong. That could be a shifted page layout, or breakages for whoever depends on it.

```checkpoint quick-3
Your change could break everything that depends on your API. What does Merge Danger call that?
- [x] The blast radius, which is how much a change could affect.
- [ ] The door call, which is how much a change could affect.
- [ ] Neither, since it only covers a shifted page layout.
Why: The blast radius is how much a change could affect if it goes wrong. That includes breakages for whoever depends on it, not only a shifted page layout.
```

For example, Ticket #13's body:

````markdown
## Summary

```diff
 api/
+└── bookings.py
```

## Evidence

- **Before:** test_create_booking fails
  **After:** test_create_booking passes

## Merge Danger

**Door:** two-way

**Blast Radius:** bookings
````

Here `+` marks a file the change adds, and bookings is what it could affect.

## When to use it

- You've built a Ticket test-first with [tdd](/learn/tdd) and reviewed it with [code-review](/learn/code-review), and the work is going up as a pull request. In the [main flow](/learn/main-flow), this is where pr comes in.
- You ask for a pull request outside the main flow. pr loads then too.

```checkpoint quick-4
You built a Ticket with tdd, and now it's going up as a pull request without a review. What's missing from the main flow?
- [x] The review with code-review, which comes before pr.
- [ ] Nothing, since pr comes in as soon as the tests pass.
- [ ] A second run of tdd, which has to come before pr.
Why: In the main flow you build test-first with tdd and review with code-review. Then the work goes up as a pull request, and pr comes in.
```

```diagram
type: chain
caption: "In the main flow, this is where pr comes in."
steps:
  - "built a Ticket test-first with [tdd](/learn/tdd)"
  - "reviewed it with [code-review](/learn/code-review)"
  - label: "the work is going up as a pull request"
    note: "this is where pr comes in"
```

## When not to use it

- If you want the code judged against your standards, use [code-review](/learn/code-review) instead, because pr only describes a change.
- If you're passing unfinished work to a fresh session, use [handoff](/learn/handoff) instead, because its document is for the next agent.

```checkpoint quick-5
You want to know if a diff meets your coding standards. Which Skill fits?
- [x] code-review, because pr only describes a change.
- [ ] pr, because its door call judges the code's quality.
- [ ] handoff, because its document goes to a reviewer.
Why: code-review judges the code against the standards and the Spec. pr only describes a change, and a handoff document is for the next agent.
```

## What it needs to start

- A finished change on a branch, ideally reviewed, and a way to prove it works.
- The project's `GLOSSARY.md`, its list of terms, if it has one, so the body uses its words.

You rarely start pr yourself. It's **model-invoked**: the agent reaches for the Skill by itself whenever it writes a pull request body. You can also type `/pr`.

```checkpoint quick-6
You ask the agent to open a pull request, and you don't mention pr. What happens?
- [x] The agent reaches for pr by itself as it writes the body.
- [ ] Nothing changes, since pr only runs when you type `/pr`.
- [ ] The agent stops and waits for you to type `/pr` first.
Why: pr is model-invoked, so the agent reaches for it by itself. You can also type `/pr`, but you rarely need to.
```

## What it creates

The text of the pull request body. It creates no files, branches or Issues, and it opens no pull request.

```checkpoint quick-7
pr has finished on your change. What has it left behind?
- [x] The text of the pull request body, and nothing on disk.
- [ ] A new branch for the change, and the body's text on it.
- [ ] An open pull request, with its branch already pushed.
Why: pr creates only the text of the body. It creates no files, branches or Issues, and it opens no pull request.
```

The door call tells a reviewer where to spend time: skim a two-way door with a small blast radius, and read a one-way door slowly.

```checkpoint quick-8
A body's door call says two-way, with a small blast radius. How do you review it?
- [x] Skim it, and save slow reading for a one-way door.
- [ ] Read it slowly, the same as you would a one-way door.
- [ ] Merge it unread, since a two-way door needs no reader.
Why: The door call says where to spend your time. Skim a two-way door with a small blast radius, and read a one-way door slowly.
```

## Going deeper

### Why it exists

Agents made code quick to write, but a person still has to read it before it reaches `main`. Matt Pocock, who wrote the Skill, puts the problem this way: "Writing code got cheap. Reading it did not."

```checkpoint quick-9
Agents can write code quickly now. Which part of shipping it stays slow?
- [x] A person reading it before it reaches `main`.
- [ ] Writing it, which still takes up most of the time.
- [ ] Agents reading it before it reaches `main`.
Why: Writing code got cheap, but reading it did not. A person still has to read it before it reaches `main`.
```

So pr aims to make human review as fast and as simple as possible.

### How it works underneath

**A template, not a process.** pr's first version was a 9-step process that ended by opening the pull request with `gh pr create`. Matt cut that step, because it "turned a format reference into an action skill". A format reference says what a document should look like, and does nothing itself. So pr never pushes a branch or opens the pull request.

```checkpoint quick-10
You ask the agent to write a body with pr, and the branch isn't pushed yet. Does pr push it?
- [x] No. It's a format reference for how the body should look.
- [ ] Yes. Its last step pushes the branch and runs `gh pr create`.
- [ ] Only if the branch has no pull request open on it yet.
Why: A format reference says what a document should look like and does nothing itself. So pr never pushes a branch or opens the pull request.
```

**Evidence is a pair.** One passing test run proves the code works now, not that this change is what made it work. A before and after shows both. Without a request for hard evidence, an agent can say "that probably works, I read the code".

```checkpoint quick-11
Why does pr want a before and after, not one passing test run?
- [x] One passing run doesn't prove this change is what made it work.
- [ ] One passing run doesn't prove that the code works at the moment.
- [ ] One passing run is more evidence than a reviewer has time to read.
Why: One passing run proves the code works now. A before and after also shows that this change is what made it work.
```

**The Summary's views come from show-me.** show-me is Dex Horthy's Skill for making an agent "converse visually instead of in walls of prose". pr reuses its menu of views almost word for word, aimed at a diff instead of a live conversation. The menu runs from pseudocode, code-like steps in plain words, to a shaped diff: a tree or sketch with `+` and `-` marking what changes.

```checkpoint quick-12
Where does pr's menu of Summary views come from?
- [x] Dex Horthy's show-me Skill, aimed at a diff, not a conversation.
- [ ] Matt's own code-review Skill, which draws a file tree of a diff.
- [ ] Jeff Bezos's letter to shareholders, adapted to fit a diff.
Why: pr reuses the menu of views from Dex Horthy's show-me Skill almost word for word, aimed at a diff instead of a live conversation.
```

**Two doors, older than pr.** Jeff Bezos split decisions into two kinds in his letter to Amazon's shareholders covering 2015:

- **One-way doors (Type 1)** are hard or impossible to undo, so you make them "methodically, carefully, slowly".
- **Two-way doors (Type 2)** are most decisions. If you chose badly, "You can reopen the door and go back through."

```checkpoint quick-13
You face a decision you can't undo. By Bezos's split, how do you make it?
- [x] Methodically, carefully, slowly, since it's a one-way door.
- [ ] Quickly, since you can reopen the door and go back through.
- [ ] Quickly, since most decisions turn out to be two-way doors.
Why: One-way doors are hard or impossible to undo, so they're made slowly. Only with a two-way door can you reopen the door and go back through.
```

Matt's pages don't name Bezos, but they use the same two doors for a narrower job: how much care a merge gets. Matt sums up the payoff:

> Merge Danger tells you where to spend review time. A two-way door with a small blast radius: skim it. A one-way door: read it slowly.

The door call also changes "is this safe to merge?" from a gut feeling into a stated claim the reviewer can disagree with.

```diagram
type: compare
caption: "Merge Danger tells you where to spend review time."
columns: ["Two-way doors", "One-way doors"]
rows:
  - label: "Bezos"
    cells: ["You can reopen the door and go back through.", "methodically, carefully, slowly"]
  - label: "Matt"
    cells: ["A two-way door with a small blast radius: skim it.", "A one-way door: read it slowly."]
```

### A real example

In September 2026 Matt opened pull request #1120 to release version 1.3 of his Skills. Three Skills were moving out of `in-progress/`, his folder for beta Skills, into `engineering/`. He calls that graduating. A fourth was being deleted. The body was written with pr.

**Summary.** It opens with one line of text, then a file tree drawn as a diff. Here's part of that tree:

```text
 skills/
 ├── engineering/
+│   ├── implement-spec/      # from in-progress, reworked first
+│   ├── pr/                  # from in-progress
+│   ├── retro/               # from in-progress
-│   └── resolving-merge-conflicts/
 └── in-progress/
-    ├── implement-spec/
-    ├── pr/
-    └── retro/
```

**Evidence.** A plugin is a bundle of Skills you can install together. Before, the plugin's `plugin.json` shipped 25 skills. After, it shipped 27, and `claude plugin validate . --strict` passed.

**Merge Danger.** A split door call: "two-way for the graduations, one-way-ish for the removal and the glossary rename". The rename turned `CONTEXT.md` into `GLOSSARY.md`. The blast radius is one word, plugin.

Once 1.3.0 is released, plugin users lose the deleted Skill on update. In the body's words, "It can be restored, but not before people notice it's gone."

```checkpoint quick-14
Why was deleting that Skill called one-way-ish, not fully one-way?
- [x] It can be restored, but users lose it first, before anyone notices.
- [ ] It can't be restored at all, so the "ish" only softens the call.
- [ ] It stays installed for current users, so nobody loses it on update.
Why: Plugin users lose the deleted Skill on update. It can be restored, but not before people notice it's gone.
```

So a reviewer should read the removal and rename slowly.

### Where it goes wrong

**The agent uses pr when you didn't ask.** pr loads on a plain `create pr`. That's on purpose: the AI-written triage reply on Matt's account called it "working as designed". Want it only when you type `/pr`? On a plain `npx skills` install, add `disable-model-invocation: true` to your copy of its `SKILL.md`, though `npx skills update` overwrites it. On the plugin, add `Skill(mattpocock-skills:pr)` and `Skill(mattpocock-skills:pr *)` to `permissions.deny` in `~/.claude/settings.json`, Claude Code's settings file.

**The door call says two-way, but the change can't be undone.** The agent that wrote the change is the one grading it, and the diff often hides whether a change can be reversed. As one user put it, "rolling back a commit won't unsend a batch of emails". So when the agent's call says two-way with a small blast radius, check that call hardest before you skim, because it's the call that tells you to skim. Give the agent the Ticket or the [Spec](/learn/issues-and-keeping-track), the Issue that describes the whole feature, not only the diff. And write down which changes your repo always treats as one-way, where the agent will read them.

```checkpoint quick-15
Your change sends emails to members, and the agent's door call says two-way. Why doubt it?
- [x] Rolling back the commit won't unsend the emails already sent.
- [ ] Rolling back the commit is only possible on a small diff.
- [ ] The diff shows clearly that nothing here can be reversed.
Why: The agent that wrote the change is grading it, and the diff often hides whether a change can be reversed. A rollback can't unsend emails.
```

**The body ignores your repo's pull request template.** pr has its own template and doesn't look for `.github/pull_request_template.md`. So the agent has two competing instructions. Settle it in your repo's agent docs, such as `CLAUDE.md`: for example, fill the repo's template and put Summary, Evidence and Merge Danger under it.

```checkpoint quick-16
Your repo has its own pull request template, and you do nothing about it. What does pr do with it?
- [x] It doesn't look for it, so the agent has two competing instructions.
- [ ] It reads it first, and fills in that template instead of its own.
- [ ] It adds its three parts to that template, with no help from you.
Why: pr has its own template and doesn't look for yours. Settle which one wins in your repo's agent docs.
```

**You merged a docs fix, and a whole feature came with it.** One agent cut a docs branch from a feature branch, not from the base branch, so it carried that feature's commits. The body "accurately described the 8 docs files", but the real diff was 70 files. The human reviewed the body, not the Commits tab, and merged. Evidence covers whether the change works, but nothing checks that the body matches the diff. So read the diff too.

```checkpoint quick-17
A body accurately lists 8 docs files. Can you trust that's all the pull request changes?
- [x] No. Nothing checks that the body matches the diff, so read the diff too.
- [ ] Yes. Evidence checks that the body matches the diff before you merge.
- [ ] Yes. pr has a check that compares the body with the diff as it writes.
Why: Evidence covers whether the change works. Nothing checks that the body matches the diff, so a feature's commits can slip in under a body about docs.
```

**The body no longer matches the pull request.** pr writes the body once, so changes under review leave it stale. Ask the agent to rewrite it after a large change.

**The Ticket stayed open.** pr's template omits `Closes #13`, so add it.

**The body is huge.** If the diff is huge too, the problem is the pull request's size, and pr won't split it for you. Keep the work in [small Tickets](/learn/small-end-to-end-tickets).

### Try it

Check an agent's door call against your own. You'll need your practice project, the yoga-studio booking site, with Matt's Skills installed. If you haven't set it up, do "Try it: set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first. It also needs the booking code in `api/`, which [implement](/learn/implement)'s Try it step builds.

1. Run `git switch main`, then `git pull`. Then create a branch: `git switch -c waitlist-position`.
2. Ask the agent to add a migration in `api/`: a nullable `waitlist_position` column on bookings, with a test.
3. Write down your own door call for that change: one-way or two-way?
4. Ask the agent to commit the work and open a pull request.

   You should see the agent load pr by itself, and a body with Summary, Evidence and Merge Danger.

5. Run `git diff main...HEAD --stat`.

   You should see the files this pull request will change.

6. Compare that list with the Summary, and your door call with the body's.
7. Merge or close the pull request, then `git switch main && git pull`.

Decide whether this migration belongs on your repo's list of one-way changes. Matt suggests listing "schema migrations, anything that ships outward or deletes".

### Read more

- [The /pr Skill](https://www.aihero.dev/skills-pr), Matt Pocock, updated 2026-10-05
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, updated 2026-10-05
- [Add the pr skill (in-progress): reference for a fast-to-review PR body, #1092](https://github.com/mattpocock/skills/pull/1092), Matt Pocock, 2026-09-17
- [v1.3: graduate implement-spec, pr and retro; remove resolving-merge-conflicts, #1120](https://github.com/mattpocock/skills/pull/1120), Matt Pocock, 2026-09-24
- [show-me: a coding agent skill for compact visual representations](https://www.humanlayer.com/blog/show-me-skill), Dex Horthy, 2026-08-12
- [2015 Letter to Shareholders (Exhibit 99.1)](https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm), Jeffrey P. Bezos, covering 2015
- [pr: auto-triggers on every "create pr", should be user-invoked only, #1262](https://github.com/mattpocock/skills/issues/1262), sleeyax, 2026-10-12
- [pr skill: body can faithfully describe a scope the branch doesn't have (branch ancestry contamination), #1331](https://github.com/mattpocock/skills/issues/1331), pangpang778, 2026-10-26

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint pr-deeper-docs-branch-shipped-feature
An agent opened a pull request for a docs fix on your yoga-studio site. Its body lists two Markdown files, the Evidence looks right, and you merge after reading the body. Then main has the half-built booking feature from another branch too. The body was accurate about the files it named. Why did it miss the rest?
- [x] The body described the work done, and nobody compared it with the real diff against main.
- [ ] The Merge Danger part called it a two-way door, which let the merge skip review.
  > The door call tells you where to spend review time. It doesn't decide what the branch carries; in one real case the body was accurate and the diff still held 70 files.
- [ ] The Summary should have been prose, since a file tree only shows the files it lists.
  > pr asks for the smallest view, such as a file tree. The trouble was what the tree was drawn from, not its shape.
- [ ] The Evidence part had no screenshot, and only a screenshot can show the full change.
  > Evidence covers whether the change works. A screenshot of the docs page wouldn't show feature commits the branch carried from its base.
Why: A body can be true about the files it names and still miss what the branch carries. In one real case a branch cut from a feature branch brought its commits along: the body described 8 docs files, the diff held 70, and the human reviewed the body, not the Commits tab. Evidence never checks the body against the diff, so read the diff too. Checked against the Ticket, a docs fix carrying feature code fails code-review's Spec check: the branch holds work the Ticket never asked for.
```

```checkpoint pr-deeper-reminder-emails-door
A pull request for your yoga-studio site adds a job that emails a reminder to every member booked into tomorrow's classes. The agent's body says "Door: two-way. Revert the commit to undo it. Blast Radius: small." The code is a clean, small diff. Why should you not take that door call as it stands?
- [x] Reverting the commit can't unsend emails already sent, so this isn't a two-way door.
- [ ] Every change that adds a background job is a one-way door, whatever the job does.
  > pr's definition is about destructive or hard-to-reverse effects, not about the kind of code. A job that only logs could be reverted cleanly.
- [ ] A small diff always means a small blast radius, so only the door half is in doubt.
  > Matt's page says the diff often hides whether a change can be reversed. The size of the diff doesn't tell you what it touches out in the world.
- [ ] The agent left out Evidence, and a door call without Evidence is never valid.
  > Evidence is its own part of the body. The door call is wrong here because of what the change does once merged, not because a part is missing.
Why: Reverting the commit removes the code, but the emails have already gone out, so you can't get back to where you started. That makes it a one-way door, however small the diff. The agent that wrote the change is grading it, so check a "two-way, small blast radius" call hardest, and give it the Spec, not only the diff.
```

## Remember

```flashcards
Q: What does pr create?
A: The text of a pull request body, with three parts, Summary, Evidence and Merge Danger. No files, branches or Issues.

Q: In the main flow, what comes just before pr?
A: The Ticket is built test-first with tdd and reviewed with code-review. Then the work goes up as a pull request, and pr writes its body.

Q: In a pull request's Merge Danger, what is a two-way door?
A: A change you can walk back cheaply. A one-way door, like destroying data, can't be walked back.

Q: What is the best Evidence in a pull request body, and the next best?
A: Screenshots, when the change is visual and the setup allows it. Next, execution-based evidence like test results or console output.

Q: In a pull request's Merge Danger, what is the blast radius?
A: How much the change could affect if it goes wrong, such as layout shift or breakages for whoever depends on it.

Q: Where do the views in a pr Summary, from pseudocode to a shaped diff, come from?
A: Dex Horthy's show-me Skill, reproduced almost word for word and aimed at a diff instead of a live conversation.

Q: What door call did the v1.3 release pull request, written with pr, make?
A: A split one, "two-way for the graduations, one-way-ish for the removal and the glossary rename", with the blast radius "plugin".

Q: Who described decisions as one-way and two-way doors in a letter to Amazon's shareholders covering 2015?
A: Jeff Bezos. One-way doors (Type 1) are made methodically, carefully, slowly; most decisions are two-way doors (Type 2) that you can reopen and go back through.

Q: Why does pr ask for hard evidence, not a claim that the change works?
A: Without a request for hard evidence, an agent can say "that probably works, I read the code". Asked for it, the agent often runs an extra test or takes a screenshot.
```

## Final test

```final-test pr-three-parts
Which three parts does pr put in a pull request body?
- [x] Summary, Evidence and Merge Danger.
- [ ] Problem, Solution and User Stories.
- [ ] Standards and Spec, one per axis.
- [ ] Background, Checklist and Reviewers.
Why: Those three answer what a reviewer needs to know: what changed (Summary), whether it works (Evidence) and how risky merging is (Merge Danger). Standards and Spec are the two axes of code-review, which judges the code; pr only describes it.
```

```final-test pr-one-way-door
A pull request adds a SQL migration that drops a column and its data. What does its Merge Danger part say?
- [x] It's a one-way door, because the dropped data can't be walked back.
- [ ] It's a two-way door, because reverting the commit undoes the change.
- [ ] Nothing, because Merge Danger only covers layout and visual changes.
Why: Reverting the commit puts the code back, but not the data the migration dropped. A change you can't walk back is a one-way door, and anything that destroys data or is hard to reverse counts as one.
```

```final-test pr-who-calls-it
Who usually starts pr?
- [x] The agent, on its own, when it writes a pull request.
- [ ] You, by typing it yourself once each Ticket is done.
- [ ] A CI job, as soon as a pull request is opened.
Why: pr is model-invoked, which means the agent reaches for it by itself. It does that whenever it writes a pull request, so you rarely need to type it.
```

```final-test pr-deeper-door-call-job
What does a pull request body's door call change for the reviewer?
- [x] It turns "is this safe to merge?" into a stated claim the reviewer can disagree with.
- [ ] It proves the change works, by showing a test that failed before and passes after.
- [ ] It replaces the review itself, since a two-way door can be merged without reading it.
- [ ] It splits a large pull request into smaller ones, so each one carries a single door.
Why: A gut feeling gives the reviewer nothing to argue with. A stated claim does, and it tells them where to spend review time: skim a two-way door with a small blast radius, and read a one-way door slowly. Proving the change works is Evidence's job, and pr won't split a pull request for you.
```

```final-test pr-deeper-scope-gap
A body written with pr accurately described 8 docs files, but the pull request's diff held 70. Which gap does that show?
- [x] Evidence checks that the change works, but nothing checks the body matches the real diff.
- [ ] The Summary used a file tree, and a file tree can't show more than a handful of files.
- [ ] The Merge Danger part was missing, so the reviewer had no door call to slow them down.
- [ ] The agent ran tests on the wrong branch, so the Evidence part showed a failing test run.
Why: The branch was cut from a feature branch, so it carried that branch's commits. The body told the truth about the 8 docs files, and the human reviewed the body, not the Commits tab. Evidence asks whether the change works, not whether the body matches the diff, so nothing caught the other files.
```

```final-test pr-describe-the-change
You're about to open a pull request for one Ticket on your website: a waitlist button, the FastAPI endpoint behind it, a SQL migration with a new column, and their tests. You want the reviewer to see at a glance what changed, proof that it works, and how risky merging is. Which fits best?
- [x] Write the pull request body: a small picture, a before and after, and a door call.
  > Right: that's `/pr`.
- [ ] Run a two-axis review of the diff against the coding standards and the Spec.
  > That's `/code-review`. That judges the code, but it doesn't write the description a reviewer reads before merging.
- [ ] Write a document summing up the session, so a fresh agent can continue the work.
  > That's `/handoff`. A handoff document is for the next agent to continue the work, not for a reviewer deciding whether to merge.
- [ ] Turn the conversation so far into a Spec and publish it on the issue tracker.
  > That's `/to-spec`. That turns the conversation into a Spec on the issue tracker. It doesn't describe a finished change for a reviewer.
Why: You want a reviewer to see what changed, proof it works and how risky merging is. pr's template has a part for each: Summary, Evidence and Merge Danger. And because a Ticket is a slice that can be checked on its own, the body can show that slice working.
```

```final-test pr-review-comes-first
A Ticket for your website is built test-first on its own branch, and every test passes. Nobody has reviewed the diff yet. The work will go up as a pull request to be merged into main. What comes next?
- [x] Review the diff along two axes, the coding standards and the Spec.
  > Right: that's `/code-review`.
- [ ] Write the pull request body now, with a before and after and a door call.
  > That's `/pr`. In the main flow the build closes out with the review first. The body comes when the reviewed work goes up as a pull request.
- [ ] Look back over the session for changes to the agent's environment.
  > That's `/retro`. That closes the loop after the build. The build isn't finished until it's reviewed.
- [ ] Clear the context and start the next Ticket with a fresh agent.
  > That's `/implement`. This Ticket isn't reviewed or merged yet.
Why: A pull request body should describe a diff that has already been reviewed. So the build closes out with code-review, a two-axis review of the diff, and only then does the work go up as a pull request, with pr shaping the body.
```

```final-test pr-reviewed-goes-up
A Ticket for your yoga-studio site is built test-first and the two-axis review came back clean. You push the branch so that CI can run and the change can be merged into main. What does the agent do next?
- [x] Write the pull request body, with a before and after and a door call.
  > Right: that's `/pr`.
- [ ] Run the two-axis review again, this time against the pushed branch.
  > That's `/code-review`. The review is already done and clean. Running it again doesn't describe the change for whoever merges it.
- [ ] Look back over the session for changes to the agent's environment.
  > That's `/retro`. That closes the loop after the build. First the work has to go up and be merged.
- [ ] Write a document summing up the session so a fresh agent can continue.
  > That's `/handoff`. Nothing is left to continue. The work is going up as a pull request, which needs a body, not a handoff.
Why: The review is done and the work is going up, so what's missing is the body. pr shapes it, and the agent reaches for pr by itself whenever it writes a pull request. The before and after shows the Ticket's slice working on its own. Looking back with retro comes after.
```

```final-test pr-ci-goes-red
You opened a pull request for a Ticket on your FastAPI backend. CI runs the tests, and one test on the booking endpoint the change touched now fails. The pull request can't be merged while CI is red. What comes next?
- [x] Fix it on the branch, test-first with tdd, and push.
  > Right: that's `/tdd`.
- [ ] Rewrite the pull request body so its Evidence explains the failure.
  > That's `/pr`. The body's Evidence should show the test passing after the change. Words don't turn CI green.
- [ ] Merge anyway, then look back over the session for improvements.
  > That's `/retro`. Merging a red change breaks main. Looking back suggests changes to the environment; it doesn't fix this code.
- [ ] Run the two-axis review of the diff to find what broke the test.
  > That's `/code-review`. A review reports problems against the standards and the Spec. It doesn't make the failing test pass.
Why: A red CI run means more work on the branch, and new words in the body can't fix that. Code is built by driving tdd, so the fix goes on the branch the same way. Then Evidence can show a passing test run after the change.
```

```final-test pr-expand-step-door
You're renaming a column in your FastAPI backend in three Tickets: add the new column, move the queries over, then drop the old one. This pull request is the first: it adds the new column beside the old one and copies the values across. Nothing is dropped. Which door call fits, and why?
- [x] Two-way, because it adds beside the old column and destroys nothing.
- [ ] One-way, because every SQL migration changes the schema for good.
  > Adding a column destroys nothing, so it can be walked back. Dropping the old column in the last Ticket is the destructive, one-way step.
- [ ] One-way, because the rename can't be stopped once its first step merges.
  > Each step is its own Ticket. This one adds the new form beside the old, so nothing breaks and it can be rolled back on its own.
- [ ] Two-way, so the body can leave out its Merge Danger part.
  > The template always has Merge Danger. It names the door and the blast radius either way.
Why: A change is a one-way door when it destroys something or is hard to reverse. This step only adds: the old column is still there, so you can walk it back, and that makes it a two-way door. A repo can still choose to treat every schema migration as one-way. The last step drops the old column, so that's the one-way door.
```

```sources
- [pr: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/SKILL.md), Matt Pocock's Skills
- [pr: agents/openai.yaml](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/agents/openai.yaml), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/SKILL.md), Matt Pocock's Skills
- [pr: CREDITS.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/pr/CREDITS.md), Matt Pocock's Skills
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05 (updated)
- [The /pr Skill](https://www.aihero.dev/skills-pr), Matt Pocock, 2026-10-05
- [Add the pr skill (in-progress): reference for a fast-to-review PR body](https://github.com/mattpocock/skills/pull/1092), Matt Pocock, 2026-09-17
- [v1.3: graduate implement-spec, pr and retro; remove resolving-merge-conflicts](https://github.com/mattpocock/skills/pull/1120), mattpocock, 2026-09-24
- [pr: auto-triggers on every "create pr", should be user-invoked only](https://github.com/mattpocock/skills/issues/1262), sleeyax, 2026-10-12
- [domain-modeling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md), Matt Pocock's Skills
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, 2026-08-24
- [pr skill: body can faithfully describe a scope the branch doesn't have (branch ancestry contamination)](https://github.com/mattpocock/skills/issues/1331), pangpang778, 2026-10-26
- [show-me: a coding agent skill for compact visual representations](https://www.humanlayer.com/blog/show-me-skill), Dex Horthy, 2026-08-12
- [2015 Letter to Shareholders (Exhibit 99.1)](https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm), Jeffrey P. Bezos, 2016-04
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [tdd: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/SKILL.md), Matt Pocock's Skills
```
