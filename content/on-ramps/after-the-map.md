---
title: After the map is clear
slug: after-the-map
summary: When the map is clear, three commands turn its decisions into built Tickets, and you need to know when to /clear between them.
image: /images/lessons/after-the-map.jpg
imageAlt: A red octagonal lighthouse on a small rocky islet in calm blue sea under soft evening clouds.
---

When no tickets are left on the map, you have every answer, and still nothing you can build from. Wayfinder hands off at that point; it never builds. Three commands turn the settled decisions into code. Here's what each one does, what it leaves on your tracker, and the two places people clear at the wrong time.

```goals
- You'll be able to say why a clear map still isn't a build plan.
- You'll be able to run the three commands that follow a clear map, in order, and say what each one leaves on your tracker.
- You'll be able to tell a tracer-bullet Ticket from a layer, and push back on a list cut the wrong way.
- You'll know exactly when to `/clear`, and when to keep going.
```

## Why the map isn't a build plan

A natural guess is that by the time the map is clear, wayfinder has already written the plan, and maybe the Tickets too. It hasn't. What you have is a set of answered questions: "Which payment service will take the studio's payments?" on one ticket, "Which passes and memberships move across?" on another, a glossary entry here, an ADR there. Every answer is right, but they're scattered across tickets and linked from one index. Nobody could build from that directly.

**So the next step collapses those scattered answers into one document, the Spec, and only then cuts it into Tickets to build.**

A [Spec](/learn/to-spec) describes one feature in enough detail to build. It matters because every session you run has a limited memory and ends. The decisions survive on the tracker, but the reasoning that ties them together has to be written down somewhere a fresh session can read. Matt puts it in one line: "The spec exists because context windows end." Tickets come and go; the Spec stays as the one place that records why they exist.

That's also why you don't jump from a clear map straight to building. Skip the Spec and the agent works from whichever ticket it happens to open, without the rest. Matt allows one exception: the whole effort turned out small. Some people run that shorter route and report that it works, but the two extra steps give you a Spec a reviewer or a colleague can read. A rebuild of the studio's booking and payments won't be small.

```callout remember
A clear map is a set of scattered, linked decisions, not a build plan. The Spec collapses them into one document a fresh session can read, and it stays after the Tickets are gone.
```

```checkpoint check-1
Your rebuild map is clear. What does a fresh session still lack, which the Spec writes down?
- [ ] The answers to the map's questions
- [ ] The name of whoever made each decision
- [x] The reasoning that joins the decisions
- [ ] The links between the map's tickets
Why: The decisions survive on the tracker, but the reasoning that ties them together has to be written down somewhere a fresh session can read: that's the Spec. The answers, and the links to them, are already on the map.
```

```checkpoint check-2
Months after the build, you wonder why one of the rebuild's Tickets existed at all. Where should that be recorded?
- [x] In the Spec for that feature
- [ ] In the Ticket's own checkbox list
- [ ] In the map's index of decisions
- [ ] In the session that built it
Why: Tickets come and go; the Spec stays as the one place that records why they exist. A session ends, and the map is a set of answered questions, not a build plan.
```

## The three steps

1. **Collapse the decisions into a Spec.** Type `/to-spec #20`, with your map's number.
   - It doesn't interview you: it puts together what's already decided.
   - It proposes the _seams_, the public edges of the code where tests will watch the feature, and checks them with you.
   - It writes the Spec in your glossary's words, respecting your ADRs.
   - It publishes the Spec as an Issue labelled `ready-for-agent`.
2. **Cut the Spec into Tickets, in the same session.** Type `/to-tickets`.
   - It slices the Spec into thin, complete pieces, each with the Tickets that block it.
   - It shows you the numbered list and asks whether the size and the blocking are right.
   - Once you approve, it publishes one Issue per Ticket, as sub-issues of the Spec, each labelled `ready-for-agent`.
3. **Build one Ticket at a time, in a fresh session each.** Type `/clear`, then `/implement` and the Ticket.
   - It fetches the Ticket and says its title before starting.
   - It builds it test-first (a failing test, then the code) at the agreed seams.
   - It runs the checks as it goes, and the full test suite once at the end.
   - It reviews its own work with `/code-review`, then commits.
   - Then you clear, and take the next Ticket whose blockers are done.

```diagram
type: chain
caption: "Two steps in one session, then a fresh session for each build"
steps:
  - "`/to-spec`"
  - "`/to-tickets`"
  - "`/clear`"
  - label: "`/implement`"
    note: "one Ticket per fresh session"
groups:
  - from: 1
    to: 2
    label: "in the same session"
```

Two words in that flow need a closer look. A **seam** is a public edge of the code where a test can watch what happens without reaching inside, such as a page's address or an API endpoint. `/to-spec` picks as few as it can, ideally one, and asks you to confirm them before it writes anything. The Spec itself always has the same parts: the problem, the solution, a long numbered list of user stories ("As a member, I want…, so that…"), the implementation decisions, the testing decisions, what's out of scope, and further notes.

**Test-first** (the [tdd](/learn/tdd) Skill) means the agent writes a failing test for the next small behaviour, then the code that makes it pass, one slice at a time. You start every build session yourself, by typing `/implement`: no other Skill starts one for you. Each Ticket is written to make sense on its own, so the previous Ticket's conversation is safe to clear.

```callout remember
Three commands, in order: `/to-spec` collapses the decisions into a Spec, `/to-tickets` cuts it into Tickets in the same session, and `/implement` builds one Ticket per fresh session, test-first, then commits. You start every build yourself.
```

```checkpoint check-3
You run `/to-spec` on a clear map, expecting a long interview. What does it do?
- [ ] It asks every map question again
- [x] It puts together existing decisions
- [ ] It writes every Ticket first
- [ ] It starts building straight away
Why: `/to-spec` doesn't interview you: it puts together what's already decided, and checks only the seams with you. Tickets come next, from `/to-tickets`; building comes last, from `/implement`.
```

```checkpoint check-4
Which of these is a seam on the yoga-studio site?
- [ ] A private function inside the booking code
- [ ] One variable inside the page template
- [ ] The table that stores the class passes
- [x] The API endpoint that creates a booking
Why: A seam is a public edge of the code where a test can watch what happens without reaching inside, such as an API endpoint or a page's address. The other three sit inside the code, so a test would have to reach in.
```

```checkpoint check-5
In this flow, what starts each build session?
- [x] You type `/implement` yourself
- [ ] `/to-tickets` starts it automatically
- [ ] The last build carries straight on
- [ ] Wayfinder hands each Ticket over
Why: You start every build session yourself, by typing `/implement`; no other Skill starts one for you. Each run builds one Ticket and commits, and the next one is yours to start.
```

## Point /to-spec at the map

Matt's instruction is to hand `/to-spec` the map itself, not the decision tickets one by one: the map is the index that links every answer. On GitHub that's the map's Issue number, as in `/to-spec #20`. On a local tracker, it's the map file's path.

One adjustment is a suggestion for an effort this size, not Matt's rule. A Spec describes one feature, and a rebuild of booking and payments is likely to hold several: class passes, memberships, refunds, the waitlist. So run `/to-spec` once per feature, each in its own session, and name the feature when you do. Every run still reads from the same map.

```callout remember
Hand `/to-spec` the map itself, the index that links every answer, never the decision tickets one by one. On an effort with several features, the suggestion is one run per feature, each in its own session, all reading the same map.
```

```checkpoint check-6
A friend says: "Matt's rule is to run `/to-spec` once per feature." Are they right?
- [ ] Yes, that's Matt's stated rule for maps
- [ ] Yes, but only on GitHub trackers
- [ ] No, Matt says to hand it each decision ticket
- [x] No, his rule is the map; per feature is a suggestion
Why: Matt's rule is to hand `/to-spec` the map, not the decision tickets. Running it once per feature, each in its own session, is a suggestion for an effort likely to hold several features.
```

```checkpoint check-7
You start `/to-spec` for a second feature of the rebuild, in a new session. What does it read from?
- [ ] The first feature's Spec
- [x] The same map as before
- [ ] That feature's decision tickets only
- [ ] A new map made for that feature
Why: Every run reads from the same map, the index that links every answer; you name the feature when you start. Handing it decision tickets one by one would leave out the links between them.
```

## Layers versus thin slices, on the rebuild

The most important idea in [to-tickets](/learn/to-tickets) is how it cuts the work. The obvious way is by layer: one Ticket for storing the data, one for the pages, one for the tests. That fails, because nothing works until every layer has landed, and each Ticket depends on work another Ticket owns. A **tracer bullet** cuts the other way: one thin path through every layer at once, small enough to finish in one fresh session, and working on its own when it lands.

Here is a made-up feature from the rebuild, "Class passes", cut both ways. The Tickets describe behaviour, not files or code, because file paths and snippets go stale fast:

```diff
-By layer (wrong): nothing works until all four land
01 Store passes and the classes left on each
02 Read passes out for the pages
03 The pass page template
04 Tests for all of the above

+As tracer bullets (right): each one works on its own
01 A member buys a 10-class pass and sees it on their account page
   Demo: buy one with a test card, see 10 classes left
02 Booking a class uses one class from the pass          (blocked by 01)
   Demo: book a class, see 9 left
03 Cancelling in time gives the class back                (blocked by 02)
   Demo: cancel before the deadline, see 10 again
04 A used-up pass can't book another class                (blocked by 02)
   Demo: use the last class, then try to book one more
```

Notice the "Demo" line under each slice. That's the test for spotting a layer disguised as a Ticket: ask what you could show someone when it's done. "The pass page template" has no answer until the data and the tests exist too; "a member buys a pass and sees it" does.

Matt reports a team that sliced 26 Tickets by layer and got roughly twenty agent runs per closed Ticket, about three quarters of them rework. `/to-tickets` shows you the list before it publishes anything, and that's your moment to push back.

```callout remember
Cut Tickets as tracer bullets, not layers: one thin path through every layer, small enough for one fresh session, working on its own when it lands. Test each one by asking what you could demo when it's done.
```

```checkpoint check-8
`/to-tickets` proposes a Ticket called "Read passes out for the pages". Which question shows what's wrong with it?
- [ ] Which payment service will it use?
- [ ] Which part of the Spec produced it?
- [x] What could I demo when it's done?
- [ ] How many tests will it need?
Why: Ask what you could show someone when it's done. For a layer like this there's no answer until the pages and the tests exist too, which is how you spot a layer disguised as a Ticket.
```

```checkpoint check-9
Why does cutting class passes into layer Tickets go wrong?
- [x] Nothing works until every layer lands
- [ ] Layer Tickets are always too small
- [ ] The Spec forbids splitting by layer
- [ ] Agents can only build whole pages
Why: Sliced by layer, nothing works until every layer has landed, and each Ticket depends on work another Ticket owns. Matt reports a team that sliced 26 Tickets this way and spent most of its agent runs on rework.
```

```checkpoint check-10
When is your moment to push back on how the work is sliced?
- [ ] After the first `/implement` commit
- [ ] While `/to-spec` proposes the seams
- [ ] Once every Ticket has been published
- [x] When `/to-tickets` shows its list
Why: `/to-tickets` shows you the numbered list before it publishes anything, and asks whether the size and the blocking are right. That's your moment. The seams are a `/to-spec` question, not slicing.
```

## Where it lands

On the practice project, the Spec and its Tickets land as GitHub Issues:

```text
#30 Class passes                                    Spec · ready-for-agent
├── #31 A member buys a 10-class pass and sees it    ready-for-agent
├── #32 Booking a class uses one class from the pass ready-for-agent · blocked by #31
├── #33 Cancelling in time gives the class back      ready-for-agent · blocked by #32
└── #34 A used-up pass can't book another class      ready-for-agent · blocked by #32
```

It's the same tree shape as the wayfinder map, with different contents: map tickets hold questions, these hold building work. The labels differ too. Decision tickets carry only `wayfinder:` labels, never a triage label, while every Ticket here carries `ready-for-agent`, so an agent can pick it up.

Each Ticket has a fixed shape. The checkboxes are its acceptance criteria, the tests for "done". Here is #31:

```text
## Parent
#30

## What to build
A member buys a 10-class pass online and sees it on their account
page, with 10 classes left, read from what was stored rather than
typed into the page.

## Acceptance criteria
- [ ] Paying for a pass with a test card shows it on the account page
- [ ] The account page shows how many classes are left on the pass
```

It has no "Blocked by" part, because on GitHub the blockers are native links. With a [local tracker](/learn/issues-and-keeping-track), the same Spec and Tickets are files: `.scratch/class-passes/spec.md`, beside an `issues/` folder with one numbered file per Ticket, each with a `Blocked by:` line and a `Status:` line.

```callout remember
The Spec is one Issue labelled `ready-for-agent`, and its Tickets hang under it as sub-issues, with native blocked-by links. A Ticket's checkboxes are its acceptance criteria, the tests for "done".
```

```checkpoint check-11
Ticket #31 ends in two checkboxes. What are they?
- [ ] Steps the agent must type out
- [x] The tests for when it's done
- [ ] Other Tickets that block this one
- [ ] Questions still waiting for answers
Why: The checkboxes are the Ticket's acceptance criteria, the tests for "done". Blockers are native links on GitHub, and questions belong on decision tickets, not build Tickets.
```

```checkpoint check-12
How does a build Ticket differ from a wayfinder decision ticket?
- [ ] It can't hang under another Issue
- [ ] It must go through triage before building
- [ ] Its body has no fixed shape at all
- [x] It holds building work, not a question
Why: Same tree shape, different contents: decision tickets hold questions, build Tickets hold building work. Each build Ticket has a fixed shape, and Tickets from `/to-tickets` already carry `ready-for-agent`, so they need no triage.
```

## Where to clear, across the whole flow

Two rules trip people up, and they point in opposite directions. First, don't clear between `/to-spec` and `/to-tickets`: the Tickets have to be cut from the same thinking that wrote the Spec, so the two steps share one session. Second, do clear before every `/implement`, and between wayfinder tickets, because there the tracker holds everything. Beginners tend to do the reverse: they clear after the Spec "to be safe", then build three Tickets in one long session.

| The moment | Clear? | Why |
|---|---|---|
| Charting has finished | `/clear` | The map and its tickets hold everything |
| Between two wayfinder tickets | `/clear` | One ticket per session |
| Between `/to-spec` and `/to-tickets` | Keep going | The Tickets build on the Spec's thinking |
| After `/to-tickets`, before the first build | `/clear` | Each Ticket stands on its own |
| Between two `/implement` runs | `/clear` | Clear, build one Ticket, commit, clear again |
| In the middle of any step | Keep going | Decide only at a boundary between steps |

```callout watch-out
**Heads-up for later.**

`/implement` stops at the commit. It doesn't tick the Ticket's checkboxes or close it, so the next Ticket never looks unblocked until someone does. On GitHub, merging a pull request whose body says `Closes #31` into `main` closes it; with a local tracker, you edit its `Status:` line. [The build loop in practice](/learn/spec-driven-build-loop) walks that whole route. And run one build at a time in your project folder: Matt calls several `/implement` sessions side by side in one checkout "worse than unsupported". [implement-spec](/learn/implement-spec) is his separate tool for building many Tickets in parallel.
```

```callout remember
The two clearing rules point in opposite directions: keep one session from `/to-spec` through `/to-tickets`, but clear before every `/implement` and between wayfinder tickets, because there the tracker holds everything.
```

```checkpoint check-13
A friend clears right after `/to-spec` "to be safe", then builds three Tickets in one long session. What did they get wrong?
- [ ] Only the long build session
- [ ] Neither; that's Matt's routine
- [x] Both: each one is backwards
- [ ] Only clearing after the Spec
Why: Both, in opposite directions: that's the reverse beginners tend to do. Keep one session from `/to-spec` through `/to-tickets`, then clear before every `/implement`, one Ticket per session.
```

```checkpoint check-14
You'd like three of the rebuild's Tickets built at the same time. What fits?
- [ ] Run three `/implement` sessions in one folder
- [x] Use `/implement-spec` for parallel builds
- [ ] Pass all three Tickets to one `/implement`
- [ ] Build all three in one long session
Why: Run one build at a time in your project folder: Matt calls several `/implement` sessions side by side in one checkout "worse than unsupported". `/implement-spec` is his separate tool for building many Tickets in parallel.
```

## Try it: from a clear map to the first build

````try
You'll need a map whose tickets are all closed, with nothing left under Not yet specified (see [Working the map](/learn/working-the-map)). Until yours is clear, read the steps through; they don't change.

1. In the `yoga-studio` folder, start Claude Code and type `/clear`.
2. Type `/to-spec #20, the class passes feature`, with your map's number and one feature's name. You should see it propose seams before it writes anything.
3. Confirm the seams, or push back. You should see a new Issue labelled `ready-for-agent`: the Spec.
4. In the same session, type `/to-tickets`. You should see a numbered list of Tickets, each with its blockers.
5. For each Ticket, ask "what could I demo when this is done?". If one has no answer, ask the agent to recut the list.
6. Approve the list. You should see the Tickets appear as sub-issues of the Spec.
7. Remove the Spec's own label, so no agent builds the Spec whole: `gh issue edit <spec> --remove-label ready-for-agent`.
8. Type `/clear`. In a second terminal, make a branch for the first Ticket, because `/implement` commits to whatever branch is open:

```sh
git switch main && git pull
git switch -c buy-a-pass
```

9. Type `/implement <you>/yoga-studio#31`, with your GitHub name and the first Ticket's number. You should see the Ticket's title first: check it's the one you meant.
````

```callout watch-out
Pass the Ticket's full reference to `/implement`, then check the title it reads back before it starts. A bare number can get matched to the wrong list.
```

To watch the hand-off on a real map, see the chapter at 9:44 ("Creating specs and tickets from maps") of Matt's [wayfinder walkthrough](https://www.youtube.com/watch?v=F3lL98Pj90o).

## Practice

### Clear or keep going?

For each moment, choose what you type next. You'll see why straight away.

```checkpoint clear-after-ticket
You've settled a wayfinder ticket, and the next one is on the frontier.
- [x] Type `/clear`
- [ ] Keep going
Why: One ticket per session. The answer is on the tracker, so the conversation can go.
```

```checkpoint clear-after-spec
`/to-spec` has published the Spec, and `/to-tickets` is next.
- [ ] Type `/clear`
- [x] Keep going
Why: The Tickets must be cut from the same thinking that wrote the Spec. Keep both in one session.
```

```checkpoint clear-after-charting
Charting has finished, and the research tickets are running in the background.
- [x] Type `/clear`
- [ ] Keep going
Why: Charting is one session's work. Everything it decided is on the map and its tickets.
```

```checkpoint clear-mid-round
A grilling round is half answered.
- [ ] Type `/clear`
- [x] Keep going
Why: You're in the middle of a step. Decisions about clearing belong at the boundary between steps, never midway.
```

```checkpoint clear-before-build
`/to-tickets` has published the Tickets, and your first `/implement` is next.
- [x] Type `/clear`
- [ ] Keep going
Why: Each Ticket stands on its own, so every build starts in a fresh session.
```

```checkpoint clear-after-commit
One `/implement` run has committed, and the next Ticket is ready.
- [x] Type `/clear`
- [ ] Keep going
Why: Matt's routine: clear, build one Ticket, commit, clear again.
```

## Remember

```flashcards
Q: Why isn't a clear map a build plan?
A: It's a set of scattered, linked decisions. The Spec collapses them into one document a fresh session can read, and it stays after the Tickets are gone.

Q: What are the three commands after a clear map, in order?
A: `/to-spec` (pointed at the map), `/to-tickets` in the same session, then `/implement`, one Ticket per fresh session.

Q: What does `/to-spec` check with you before it writes?
A: The seams: the public edges of the code where tests will watch the feature. As few as possible, ideally one.

Q: What is a tracer-bullet Ticket?
A: One thin path through every layer, small enough for one fresh session, that works on its own when it lands. Test it by asking what you could demo when it's done.

Q: Where do you point `/to-spec` when the map is clear?
A: At the map itself, never the decision tickets one by one. For several features, a suggestion: one run per feature, each in its own session.

Q: What are a build Ticket's checkboxes?
A: Its acceptance criteria, the tests for "done". On GitHub its blockers are native links, so its body has no Blocked by part.

Q: Which two clearing rules point in opposite directions?
A: Keep one session from `/to-spec` through `/to-tickets`. Clear before every `/implement`, and between wayfinder tickets.

Q: Does `/implement` close the Ticket it builds?
A: No. It stops at the commit, so the next Ticket only looks unblocked once someone closes it, for example by merging a pull request that says `Closes #31`.
```

## Final test

```final-test point-to-spec-at
Your map is clear. What do you point `/to-spec` at?
- [ ] Each decision ticket, one by one
- [x] The map's Issue, once per feature
- [ ] The last ticket you resolved on it
- [ ] Nothing; it interviews you from scratch
Why: Hand it the map, the index of every answer. On an effort with several features, the suggestion is to run it once per feature.
```

```final-test pick-tracer-bullet
Which of these is a tracer-bullet Ticket for class passes?
- [ ] Store every pass and its balance
- [ ] Write all the tests for passes
- [ ] Build the pass page template only
- [x] A member buys a pass and sees it, end to end
Why: It cuts through every layer, and you can demo it when it lands. The other three are single layers.
```

```final-test same-session-why
Why must `/to-spec` and `/to-tickets` run in the same session?
- [x] The Tickets build on the Spec's thinking
- [ ] `/to-tickets` deletes the Spec when done
- [ ] The tracker allows only one session
- [ ] `/clear` would delete the Spec's Issue
Why: The Tickets are cut from the reasoning that wrote the Spec. Clearing in between throws that reasoning away; the Spec's Issue itself would survive.
```

```final-test still-open-after-commit
`/implement` has committed, but your Ticket is still open with its boxes unticked. What's going on?
- [ ] The run failed and must restart
- [x] It never closes Tickets; that's left to you
- [ ] The tracker setup is broken somewhere
- [ ] The code review rejected the work
Why: That's expected: `/implement` ends at the commit. Closing the Ticket and ticking its boxes is yours, for example by merging a pull request that says `Closes` and its number.
```

```final-test skip-the-spec
The map is clear. Why not run `/implement` straight from it?
- [ ] `/implement` can't read Issues at all
- [ ] The map's decisions aren't final yet
- [x] Skipping the Spec loses the linked detail
- [ ] Wayfinder already wrote all the code
Why: The Spec is the step that collapses the map's scattered answers into one buildable plan. Skip it and that linked detail is lost, unless the effort turned out small.
```

```final-test layer-list
After `/to-spec`, `/to-tickets` shows you this list for class passes: "01 Store passes and their balances · 02 The pass page template · 03 Tests for passes". Why push back?
- [x] They're cut by layer, so nothing works alone
- [ ] Build Tickets must come before the Spec
- [ ] Each one needs a `wayfinder:` label added
- [ ] Three Tickets are too few for one feature
Why: Each Ticket is one layer, so nothing works until all three land, and none passes the "what can I demo when this is done?" test. A tracer bullet cuts one thin path through every layer, such as "a member buys a 10-class pass and sees it". The list is shown before anything is published, so you can push back now.
```

```final-test long-session-after-spec
`/to-spec` has published the Spec for class passes. The session feels long, and you'd like a clean start before the Tickets are cut. What do you do?
- [ ] Type `/clear`, then run `/to-tickets` fresh
- [ ] Run `/compact`, then cut the Tickets
- [x] Run `/to-tickets` now, in this session
- [ ] Run `/implement` on the Spec itself
Why: Don't clear or compact between `/to-spec` and `/to-tickets`: the Tickets are cut from the same thinking that wrote the Spec, so the two share one session. The clean start comes after `/to-tickets`, before the first `/implement`.
```

```sources
- [The /wayfinder Skill](https://www.aihero.dev/skills-wayfinder), Matt Pocock, updated 2026-08-24
- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock, updated 2026-08-24
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, updated 2026-08-24
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, updated 2026-08-24
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [Clearing (AI Coding Dictionary)](https://www.aihero.dev/ai-coding-dictionary/clearing), Matt Pocock
- [/wayfinder: Nothing is too big to plan anymore](https://www.youtube.com/watch?v=F3lL98Pj90o), Matt Pocock, 2026-07-30
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), GitHub Docs
```
