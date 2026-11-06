---
title: After the map is clear
slug: after-the-map
summary: You’ll know the three commands that follow a clear map, what each leaves in your .scratch/ folder, what a good build ticket looks like on Care4Mind, and exactly when to /clear and when not to.
---

When no tickets are left on the map, wayfinder hands off: it never builds. Three commands turn the settled decisions into code. This lesson is the overview: what each one does, what it leaves on disk, and the two places people clear at the wrong time.

```goals
- You’ll know the three commands that follow a clear map, what each leaves in your `.scratch/` folder, what a good build ticket looks like on Care4Mind, and exactly when to `/clear` and when not to.
```

## Why the map isn’t a build plan

A natural guess is that by the time the map is clear, wayfinder has already written the plan, and maybe the tasks too. It hasn’t. What you have is a folder of answered questions: “what to build it with” in one file, “which Questionnaires are in scope” in another, a glossary entry here, an ADR there. Every answer is right, but they are scattered across files and linked from one index. Nobody could build from that directly.

So the next step collapses those scattered answers into one document, the **spec** (short for specification: one feature described in enough detail to build). The spec matters because every session you run has a limited memory and ends. The decisions survive in files, but the reasoning that ties them together has to be written down somewhere a fresh session can read. Build tickets come and go; the spec stays as the one place that records why they exist.

That is also why you never jump from a clear map straight to building. Skip the spec and the agent works from whichever ticket it happens to open, without the rest. Matt allows one exception: if the whole effort turned out to be small. A rebuild of Care4Mind won’t be.

```callout remember
A clear map is a folder of scattered, linked decisions, not a build plan. The spec collapses them into one document a fresh session can read, and it stays after the build tickets are gone.
```

```checkpoint check-1
Your Care4Mind map is clear. What does a fresh session still lack, which the spec writes down?
- [ ] The answers to the map’s questions
- [ ] The name of whoever decided each
- [x] The reasoning that joins the decisions
- [ ] The links between the map’s tickets
Why: The decisions survive in files, but the reasoning that ties them together has to be written down somewhere a fresh session can read: that’s the spec. The answers, and the links to them, are already in the map.
```

```checkpoint check-2
Months after the build, you wonder why one Care4Mind build ticket existed at all. Where should that be recorded?
- [x] In the spec for that feature
- [ ] In the ticket’s own checkbox list
- [ ] In the map’s index of decisions
- [ ] In the session that built it
Why: Build tickets come and go; the spec stays as the one place that records why they exist. A session ends, and the map is a folder of answered questions, not a build plan.
```

## The three steps

1. **Collapse the decisions into a spec** (Step 1): `/to-spec .scratch/<effort>/map.md`
   - Doesn’t interview you: it puts together what is already decided.
   - Proposes the _seams_ where the feature will be tested, and checks them with you.
   - Writes the spec in glossary words, respecting ADR-0001.
   - Saves it as `.scratch/<feature>/spec.md`, marked `ready-for-agent`.
2. **Cut the spec into build tickets** (Step 2 · same session): `/to-tickets`
   - Slices the spec into thin, complete pieces, each with the tickets that block it.
   - Shows you the numbered list and asks whether the size and the blocking are right.
   - After you approve, writes one file per ticket, marked `ready-for-agent`.
3. **Build one ticket at a time** (Step 3 · fresh session each): `/clear
/implement <ticket path>`
   - Opens the ticket and says its title before starting.
   - Builds it test-first at the agreed seams.
   - Runs the checks as it goes and the full test suite at the end.
   - Reviews its own work with `/code-review`, then commits.
   - Then clear, and take the next ticket whose blockers are done.

Two words in that flow need defining. A **seam** is a public edge of the code where a test can watch what happens without reaching inside, such as a page’s address or a search box. `/to-spec` picks as few as it can, ideally one, and asks you to confirm them before it writes anything. The spec itself always has the same sections: the problem, the solution, a long numbered list of user stories (“As a researcher, I want…, so that…”), the implementation decisions, the testing decisions, and what is out of scope.

**Test-first** (the _tdd_ skill) means the agent writes a failing test for the next small behaviour, then the code that makes it pass, one slice at a time. You start every build session yourself, by typing `/implement`; no other skill will start one for you. Each ticket is written to make sense on its own, so the previous ticket’s conversation is safe to clear.

```callout remember
Three commands, in order: `/to-spec` collapses the decisions into a spec, `/to-tickets` cuts it into build tickets in the same session, and `/implement` builds one ticket per fresh session, test-first, then commits. You start every build yourself.
```

```checkpoint check-3
You run `/to-spec` on a clear map, expecting a long interview. What does it actually do?
- [ ] It re-asks every map question
- [x] It puts together existing decisions
- [ ] It writes every ticket first
- [ ] It starts building straight away
Why: `/to-spec` doesn’t interview you: it puts together what is already decided, and checks only the seams with you. Tickets come next, from `/to-tickets`; building comes last, from `/implement`.
```

```checkpoint check-4
Which of these is a seam on Care4Mind, in this lesson’s sense?
- [ ] A private function inside the code
- [ ] One variable inside the page template
- [ ] The table that stores the Concepts
- [x] The search box on the site
Why: A seam is a public edge of the code where a test can watch what happens without reaching inside, such as a search box or a page’s address. The other three sit inside the code, so a test would have to reach in.
```

```checkpoint check-5
In this flow, what starts each build session?
- [x] You type `/implement` yourself
- [ ] `/to-tickets` starts it automatically
- [ ] The last run continues
- [ ] Wayfinder hands it over
Why: You start every build session yourself, by typing `/implement`; no other skill will start one for you. Each run builds one ticket and commits, and the next one is yours to start.
```

## Point /to-spec at the map

Matt’s instruction is to hand `/to-spec` the map itself, not the decision tickets one by one: the map is the index that links every answer. On GitHub that is the map’s issue number; on your local tracker it is the map file’s path. One adjustment is my suggestion for a project this size, not Matt’s rule. A whole-site rebuild is likely to hold several features, and your tracker keeps one spec per feature folder. So run `/to-spec` once per feature, each in its own session, and name the feature when you do. Every run still reads from the same map.

```callout remember
Hand `/to-spec` the map itself, the index that links every answer, never the decision tickets one by one. On a rebuild with several features, the suggestion here is one run per feature, each in its own session, all reading the same map.
```

```checkpoint check-6
A friend says: “Matt’s rule is to run `/to-spec` once per feature.” Are they right?
- [ ] Yes, that’s Matt’s stated rule
- [ ] Yes, for GitHub trackers only
- [ ] No, Matt prefers single runs
- [x] No, it’s this lesson’s suggestion
Why: Matt’s rule is to hand `/to-spec` the map, not the decision tickets. Running it once per feature, each in its own session, is this lesson’s suggestion for a rebuild likely to hold several features.
```

```checkpoint check-7
You start `/to-spec` for a second Care4Mind feature, in a new session. What does it read from?
- [ ] The first feature’s spec file
- [x] The same map as before
- [ ] Only that feature’s decision tickets
- [ ] A new map for it
Why: Every run still reads from the same map, the index that links every answer; you name the feature when you start. Handing it decision tickets one by one would leave out the links between them.
```

## Layers versus thin slices, on Care4Mind

The most important idea in `/to-tickets` is how it cuts the work. The obvious way is by layer: one ticket for storing the data, one for the pages, one for the tests. That fails, because nothing works until every layer has landed, and each ticket depends on work another ticket owns. A **tracer bullet** cuts the other way: one thin path through every layer at once, small enough to finish in one fresh session, and working on its own when it lands.

Here is a made-up feature, “Concept pages”, cut both ways. The tickets don’t name any particular technology, because what to build it with is still an open question:

```diff
-By layer (wrong): nothing works until all four land
01 Store Concepts and the links between them
02 Read Concepts out for the pages
03 The Concept page template
04 Tests for all of the above

+As tracer bullets (right): each one works on its own
01 One Concept page shows its title, summary and Sanskrit term
   Demo: open one Concept's page
02 A Concept page links to its related Concepts          (blocked by 01)
   Demo: click from one Concept to another
03 Search finds a Concept by any stored spelling         (blocked by 01)
   Demo: search "vikshepa" and "vikṣepa", get the same page
04 A topic landing page lists its Concepts               (blocked by 01)
   Demo: open a topic, see its Concepts and breadcrumbs
```

Notice the “Demo” line under each slice. That is the test for spotting a layer disguised as a ticket: ask what you could show someone when it’s done. “The Concept page template” has no answer until the data and the tests exist too; “one Concept page shows its Sanskrit term” does. Matt reports a team that sliced 26 tickets by layer and spent most of its agent runs on rework. `/to-tickets` shows you the list before it writes anything, and that is your moment to push back.

```callout remember
Cut tickets as tracer bullets, not layers: one thin path through every layer, small enough for one fresh session, working on its own when it lands. Test each one by asking what you could demo when it’s done.
```

```checkpoint check-8
`/to-tickets` proposes a ticket called “Read Concepts out for the pages”. Which question shows what’s wrong with it?
- [ ] Which technology will it use?
- [ ] Which spec section produced it?
- [x] What could I demo afterwards?
- [ ] How many tests are needed?
Why: Ask what you could show someone when it’s done. For a layer like this there’s no answer until the pages and tests exist too, which is how you spot a layer disguised as a ticket. Technology isn’t named in these tickets at all yet.
```

```checkpoint check-9
Why does cutting Concept pages into layer tickets go wrong?
- [x] Nothing works until every layer lands
- [ ] Layer tickets are always too small
- [ ] The spec forbids splitting by layer
- [ ] Agents can only build whole pages
Why: Sliced by layer, nothing works until every layer has landed, and each ticket depends on work another ticket owns. Matt reports a team that sliced 26 tickets this way and spent most of its agent runs on rework.
```

```checkpoint check-10
When is your moment to push back on how the work is sliced?
- [ ] After the first `/implement` commit
- [ ] While `/to-spec` proposes the seams
- [ ] Once every ticket file exists
- [x] When `/to-tickets` shows its list
Why: `/to-tickets` shows you the numbered list before it writes anything and asks whether the size and the blocking are right. That is your moment, before any ticket file is written. The seams are a `/to-spec` question, not slicing.
```

## Where it lands

```text
.scratch/<feature>/
├── spec.md                    from /to-spec, Status: ready-for-agent
└── issues/
    ├── 01-<first-slice>.md    Blocked by: None (can start immediately)
    └── 02-<next-slice>.md     Blocked by: 01
```

It’s the same folder habit as the wayfinder map, with different contents: map tickets hold questions, these hold building work. Each build ticket is one file with a fixed shape. The checkboxes are its acceptance criteria, the tests for “done”. Here is ticket 01 from the example above:

```text
# 01: One Concept page shows its title, summary and Sanskrit term

**What to build:** a visitor opens a Concept's page and sees its title,
summary and Sanskrit term, read from stored content rather than typed
into the page.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Opening a Concept's address shows its title, summary and Sanskrit term
- [ ] Changing the stored content changes what the page shows
```

```callout remember
Each feature gets one `.scratch/<feature>/` folder: `spec.md` beside an `issues/` folder with one file per build ticket. A ticket’s checkboxes are its acceptance criteria, the tests for “done”.
```

```checkpoint check-11
Ticket 01’s file ends in two checkboxes. What are they?
- [ ] Steps the agent must type out
- [x] The tests for when it’s done
- [ ] Other tickets that block this one
- [ ] Questions still waiting for an answer
Why: The checkboxes are the ticket’s acceptance criteria, the tests for “done”. Blockers have their own line, “Blocked by”, and questions belong in map tickets, not build tickets.
```

```checkpoint check-12
How does a build ticket in `issues/` differ from a wayfinder map ticket?
- [ ] It lives outside the .scratch folder
- [ ] It must be triaged before building
- [ ] Its contents have no fixed shape
- [x] It holds building work, not questions
Why: Same folder habit, different contents: map tickets hold questions, build tickets hold building work. Each build ticket has a fixed shape, and tickets from `/to-tickets` are already agent-ready, so they need no triage.
```

## Where to clear, across the whole flow

Two rules trip people up, and they point in opposite directions. First, don’t clear between `/to-spec` and `/to-tickets`: the tickets have to be cut from the same thinking that wrote the spec, so the two steps share one session. Second, do clear between every `/implement`, and between wayfinder tickets, because there the files hold everything. Beginners tend to do the reverse, clearing after the spec “to be safe” and then building three tickets in one long session.

| The moment | Clear? | Why |
|---|---|---|
| Charting has just finished | `/clear` | The map and tickets hold everything |
| Between two wayfinder tickets | `/clear` | One ticket per session |
| Between `/to-spec` and `/to-tickets` | Keep going | The tickets build on the spec’s thinking |
| After `/to-tickets`, before the first build | `/clear` | Each ticket stands on its own |
| Between two `/implement` runs | `/clear` | Clear, build one ticket, commit, clear again |
| In the middle of any step | Keep going | Decide only at a boundary between steps |

```callout watch-out
**Heads-up for later.**

`/implement` stops at the commit. It doesn’t tick the ticket’s checkboxes or mark it done, so you have to, or the next ticket never looks unblocked. Your tracker setup doesn’t yet say how a finished build ticket is marked, so settle that before your first `/implement`. And run one build at a time in your project folder. Matt’s `/implement-spec` is the separate tool for building many tickets in parallel.
```

```callout remember
The two clearing rules point in opposite directions: keep one session from `/to-spec` through `/to-tickets`, but clear before every `/implement` and between wayfinder tickets, because there the files hold everything.
```

```checkpoint check-13
A friend clears right after `/to-spec` “to be safe”, then builds three tickets in one long session. What did they get wrong?
- [ ] Only the long build session
- [ ] Neither; that is Matt’s routine
- [x] Both: each one is backwards
- [ ] Only clearing after the spec
Why: Both, in opposite directions: that’s the reverse beginners tend to do. Keep one session from `/to-spec` through `/to-tickets`, then clear before every `/implement`, one ticket per session.
```

```checkpoint check-14
You’d like three Care4Mind tickets built at the same time. What does this section say?
- [ ] Run three `/implement` sessions together
- [x] Use `/implement-spec` for parallel builds
- [ ] Pass all three to `/implement`
- [ ] Build them in one session
Why: Run one build at a time in your project folder: Matt calls several `/implement` sessions side by side in one checkout “worse than unsupported”. `/implement-spec` is his separate tool for building many tickets in parallel.
```

## Practice

### Clear or keep going?

For each moment, choose what you type next. You’ll see why straight away.

```checkpoint check-15
You’ve just settled a wayfinder ticket, and the next one is on the frontier.
- [x] Type `/clear`
- [ ] Keep going
Why: One ticket per session. The answer is in the files, so the conversation can go.
```

```checkpoint check-16
`/to-spec` has just written the spec, and `/to-tickets` is next.
- [ ] Type `/clear`
- [x] Keep going
Why: The tickets must be cut from the same thinking that wrote the spec. Keep both in one session.
```

```checkpoint check-17
Charting has just finished, and the research tickets are running in the background.
- [x] Type `/clear`
- [ ] Keep going
Why: Charting is one session’s work. Everything it decided is in the map and the ticket files.
```

```checkpoint check-18
A grilling round is half answered.
- [ ] Type `/clear`
- [x] Keep going
Why: You’re in the middle of a step. Decisions about clearing belong at the boundary between steps, never mid-way.
```

```checkpoint check-19
`/to-tickets` has written the tickets, and your first `/implement` is next.
- [x] Type `/clear`
- [ ] Keep going
Why: Each build ticket stands on its own, so every build starts in a fresh session.
```

```checkpoint check-20
One `/implement` run has just committed, and the next ticket is ready.
- [x] Type `/clear`
- [ ] Keep going
Why: Matt’s routine: clear, build one ticket, commit, clear again.
```

### Check yourself

From memory, without scrolling up.

```final-test final-21
Your map is clear. What do you point `/to-spec` at?
- [ ] Each decision ticket, one by one
- [x] The map file, once per feature
- [ ] The last ticket you resolved there
- [ ] Nothing; it interviews you from scratch
Why: Hand it the map, the index of every answer. On a project with several features, run it once per feature.
```

```final-test final-22
Which of these is a tracer-bullet ticket for Concept pages?
- [ ] Store every Concept and its links
- [ ] Write all the tests for Concepts
- [ ] Build the Concept page template only
- [x] A single Concept page works end-to-end
Why: It cuts through every layer and you can demo it when it lands. The other three are single layers.
```

```final-test final-23
Why must `/to-spec` and `/to-tickets` run in the same session?
- [x] Tickets build on the spec’s thinking
- [ ] `/to-tickets` deletes the spec when done
- [ ] The tracker only allows one session
- [ ] `/clear` would delete the spec file
Why: The tickets are cut from the reasoning that wrote the spec. Clearing in between throws that reasoning away; the file itself would survive.
```

```final-test final-24
`/implement` has committed, but your ticket is still open with its boxes unticked. What’s going on?
- [ ] The run failed and must restart
- [x] It never closes tickets; you do
- [ ] The tracker setup is broken somewhere
- [ ] The code review rejected the work
Why: That’s expected: `/implement` ends at the commit. Closing the ticket and ticking its boxes is your job.
```

```final-test final-25
The map is clear. Why not run `/implement` straight from it?
- [ ] `/implement` cannot read any Markdown files
- [ ] The map’s decisions aren’t final yet
- [x] Skipping the spec loses linked detail
- [ ] Wayfinder already wrote all the code
Why: The spec is the step that collapses the map’s scattered answers into one buildable plan. Skip it and that linked detail is lost.
```

## What this means for you today

Your map, `.scratch/rebuild/map.md`, was charted and merged in PR #3 on 27 October ([Lesson 8](/learn/pull-requests)). Once its last ticket is settled, this is the whole sequence, with each `/implement` in a fresh session. [Lesson 14](/learn/spec-driven-build-loop) walks the same loop on GitHub, with branches, PRs and checks:

```text
/to-spec .scratch/<effort>/map.md
/to-tickets
/clear
/implement .scratch/<feature>/issues/01-<slug>.md
```

```callout watch-out
Pass the ticket’s full path to `/implement`, then check the title it reads back before it starts. A bare number can get matched to the wrong list.
```

## Watch and read next

**Watch:** the chapter at 9:44 (“Creating specs and tickets from maps”) of Matt’s [wayfinder walkthrough](https://www.youtube.com/watch?v=F3lL98Pj90o).

**Read:** Matt’s [/to-spec article](https://www.aihero.dev/skills-to-spec) (start with “The spec is a decision record”) and his [/to-tickets article](https://www.aihero.dev/skills-to-tickets) (“Tracer bullets, not layers”), checked 26 October 2026. When you get there, the skills themselves are short: [to-spec](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md), [to-tickets](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md) and [implement](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md).

This is the last lesson of Part 1. The Part 1 test covers Lessons 1–5, from memory.

```sources
- [Matt’s /wayfinder article](https://www.aihero.dev/skills-wayfinder)
- [Matt’s /to-spec article](https://www.aihero.dev/skills-to-spec)
- [ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md)
- [to-spec/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md)
- [implement/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md)
- [Matt’s /implement article](https://www.aihero.dev/skills-implement)
- [to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md)
- [Matt’s /to-tickets article](https://www.aihero.dev/skills-to-tickets)
- [clear](https://www.aihero.dev/ai-coding-dictionary/clearing)
- [PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/PHASE-BOUNDARIES.md)
```
