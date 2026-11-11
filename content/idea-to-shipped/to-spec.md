---
title: to-spec: turn your conversation into a Spec
slug: to-spec
summary: How to-spec writes the decisions from a grilling into a Spec, one Issue describing the whole feature, so later sessions can build from it.
image: /images/lessons/to-spec.jpg
imageAlt: An old blue blueprint with white line drawings of doors, a roof and moulding profiles.
---

## What it's for

Say [grill-with-docs](/learn/grill-with-docs) has grilled you, question by question, on the Booking API for your yoga-studio site. Most of your decisions sit only in that conversation. The build needs several sessions (a session is one conversation with the agent), and clearing this one, wiping it with `/clear`, would lose them. [Context hygiene](/learn/context-hygiene) explains both.

**to-spec turns that conversation into a Spec, one Issue describing the whole feature, on your [Issue tracker](/learn/issues-and-keeping-track).**

It doesn't interview you. It only writes up what you've decided, plus what it learns by reading the repo.

```checkpoint quick-1
You run to-spec on a settled plan. What goes into the Spec besides your decisions?
- [x] What it learns by reading the repo.
- [ ] Its best guesses at the questions you left open.
- [ ] Its own ideas you never raised.
Why: It doesn't interview you, and it only writes up what you've decided plus what it learns by reading the repo. So nothing else should go in.
```

It checks one thing with you: the [seams](/learn/test-first), the public boundaries where tests will watch the feature. A run might go like this:

```text
you:   /to-spec
agent: I'd test this at one seam, the HTTP API. Does that match what you expect?
you:   Yes.
agent: Published "Booking API" as an Issue, labelled ready-for-agent.
```

## When to use it

- You've been grilled, every question is settled, and the build needs more than one session.
- The build is too big for one session, and each fresh session should pick up the work without you explaining it again.

The order is grill, then to-spec, then [to-tickets](/learn/to-tickets), all in the same session. Don't clear or [compact](/learn/context-hygiene) until the [Tickets](/learn/issues-and-keeping-track) are written, so all three build on the same thinking.

```checkpoint quick-2
You've written the Spec, and the Tickets are next. Do you clear the session first?
- [x] No. All three steps should build on the same thinking.
- [ ] Yes. to-tickets works best from a clean context window.
- [ ] Yes, but compact it, so the Tickets take up fewer tokens.
Why: The grilling, to-spec and to-tickets all run in the same session, so don't clear or compact until the Tickets are written.
```

```diagram
type: chain
caption: "grill, then to-spec, then to-tickets, all in the same session"
steps:
  - "[grill](/learn/grill-with-docs)"
  - "to-spec"
  - "[to-tickets](/learn/to-tickets)"
groups:
  - from: 1
    to: 3
    label: "all in the same session"
```

## When not to use it

- If the idea is still fuzzy, use [grill-with-docs](/learn/grill-with-docs) instead, because to-spec only writes up what's decided.
- If the work fits in one session, use [implement](/learn/implement) instead, because a Spec only pays off across sessions.
- If you already have a Spec to split up, use [to-tickets](/learn/to-tickets) instead, because it cuts a Spec into Tickets.

```checkpoint quick-3
Your change is settled and fits in one session. What do you run?
- [x] implement, since a Spec only pays off across sessions.
- [ ] to-spec, so that the next session has a Spec to read.
- [ ] to-tickets, so that the change is cut into small slices.
Why: When the work fits in one session, there's no later session to hand it to. So skip the Spec and build it with implement.
```

## What it needs to start

Only you can start it, by typing `/to-spec`. It needs:

- the decisions, usually from a grilling in this conversation;
- the Issue tracker and its labels, set up by [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) (to-spec tells you if they're missing);
- time to agree the seams. It prefers existing ones and proposes the highest it can, ideally one. Highest means nearest what users touch.

```checkpoint quick-4
to-spec is about to agree the seams with you. How many will it try to propose?
- [x] As few as it can, as high as it can, ideally one.
- [ ] One for every module that the feature touches.
- [ ] One for each Ticket that the work will need.
Why: It prefers existing seams and proposes the highest it can, ideally one.
```

## What it creates

One Spec, as an Issue on the tracker, labelled `ready-for-agent` so it needs no further triage, the sorting of Issues by what they need next ([Issues: keeping track of work](/learn/issues-and-keeping-track)). It creates no branches, code or Tickets.

```checkpoint quick-5
to-spec has finished. What's new on your Issue tracker and in your repo?
- [x] One Spec Issue, labelled ready-for-agent, and nothing else.
- [ ] One Spec Issue, plus a new branch to start the build on.
- [ ] One Spec Issue, plus a Ticket for each of its User Stories.
Why: It creates one Spec, as an Issue labelled ready-for-agent. It creates no branches, code or Tickets.
```

Every Spec follows the same template. It has a Problem Statement, a Solution, and a long list of **User Stories**. A User Story is one need, written from the point of view of a user. For example: `As a member, I want to book a class, so that my place is saved`.

```checkpoint quick-6
You're reading a Spec for the Booking API. Which line is a User Story?
- [x] As a member, I want to book a class, so that my place is saved.
- [ ] The bookings table stores the member's id and the id of the class.
- [ ] The tests for booking a class sit at one seam, the HTTP API.
Why: A User Story is one need, written from the point of view of a user. The other two lines are decisions about how to build and test it.
```

The rest are Implementation Decisions (how to build it), Testing Decisions (how to test it), Out of Scope (what you refused) and Further Notes.

The Spec leaves out file paths and code snippets, because they go stale fast. The exception is a short prototype snippet that states a decision more exactly than words can.

## Going deeper

### Why it exists

A grilling settles a lot: the shape of the solution, the choices you argued through, and what you refused. All of that sits in one conversation that you're about to clear. Matt Pocock, who wrote the Skill, gives the reason for a Spec in one line: "The spec exists because context windows end."

```checkpoint quick-7
You're about to clear a session after a long grilling. What goes with it if there's no Spec?
- [x] The choices you argued through, and what you refused.
- [ ] The labels that your Issue tracker uses for triage.
- [ ] The code that the agent wrote while grilling you.
Why: The shape of the solution, the choices you argued through and what you refused all sit in one conversation. Clear it and the next session starts without them, which is why the Spec exists.
```

Sessions are disposable, and big work isn't. So the Spec gives the work a home outside any one session. A fresh session reads it and can pick up the work without you explaining it again, and without the old session's noise.

The Skill used to be called to-prd. Matt renamed it in July 2026 (version 1.1), because a PRD (product requirements document) describes the product itself, and non-product material was leaking in.

### How it works underneath

**A record, not a decision.** The Spec holds what you already decided, in your project's own words. It isn't a place to make new decisions. Matt's test for a bad Spec is blunt: "If the spec states something you never said, that is a defect."

```checkpoint quick-8
A finished Spec names a rule you never discussed. What is that line?
- [x] A defect, since a Spec adds no decisions you didn't make.
- [ ] A bonus, since the agent spotted something you missed.
- [ ] Normal, since writing a Spec is where the gaps get decided.
Why: The Spec is a record of what you already decided, not a place to make new decisions. So a line you never said is a defect.
```

**The destination and the steps.** The Spec is the destination and the decisions that fix it. The Tickets are the steps that get there. Say your Booking API Spec has Ticket #12 for the bookings table and Ticket #13 for the endpoint. You finish #12, then change direction. You delete #13, which is unfinished, and you keep the Spec.

```checkpoint quick-9
You've finished Ticket #12, then you change direction. What do you do with the rest?
- [x] Delete the unfinished Ticket, and keep the Spec.
- [ ] Edit the Spec to match, and keep every Ticket.
- [ ] Close the Spec, and move its plan into the Ticket.
Why: The Spec is the destination and the Tickets are the steps that get there. So when the direction changes, the unfinished steps go and the Spec stays.
```

Each Ticket is sized for one fresh context window, then gets closed or deleted. So the Spec stays as the one place that records the reasoning behind them.

**The seams travel through the Spec.** You agree the seams here, and two later Skills rely on them. [tdd](/learn/tdd) works only at seams you agreed in advance. [code-review](/learn/code-review) checks the diff against the Spec, so a seam nobody agreed to shows up as a review finding. So take the seam check seriously now, and don't leave it for the build.

```checkpoint quick-10
The agent adds tests at a seam you never agreed. Which step catches that?
- [x] code-review, which checks the diff against the Spec.
- [ ] to-tickets, which cuts Tickets along the agreed seams.
- [ ] tdd, which rewrites any test at an unagreed seam.
Why: code-review checks the diff against the Spec, so a seam nobody agreed to shows up as a review finding.
```

**The same idea outside Matt's Skills.** Anthropic's Claude Code guide suggests the same order without a Skill: get interviewed, write `SPEC.md`, then build from it in a fresh session. The Spec is a local file there, and an Issue here.

### A real example

In a July 2026 video, Matt walks through the [main flow](/learn/main-flow), his usual path through the Skills, on his AI Hero command-line tool repo. He gets grilled on one idea: to "remove most of the internal tooling on this CLI". At this point he'd normally call `implement` and let it run.

To show the whole flow, he pretends the work needs several sessions, and runs to-spec instead. It takes all 46.1k tokens (small pieces of text) of that discussion, and will "compress it into a document that we can use" later. His tracker here is local Markdown files, so the Spec lands in a local folder. He then stays in the same session for to-tickets.

```checkpoint quick-11
You've had 46.1k tokens of discussion, and the work will span sessions. What does to-spec do with them?
- [x] It compresses them into one document for later.
- [ ] It pastes them word for word into one Issue.
- [ ] It splits them into Tickets, one for each topic.
Why: to-spec takes the whole discussion and compresses it into a document you can use in later sessions.
```

He also opens a real Spec from a couple of days earlier, with 11 sub-issues. In his words, "each of these tickets is a single context window session". At the end of his run, code-review cross-checks the work against the Spec.

That's what a Spec and its Tickets buy: one big job, cut into pieces a session can finish, with one document to check them against.

### Where it goes wrong

**An agent tried to build the whole Spec in one run.** to-spec puts `ready-for-agent` on the Spec itself. To Matt, the label means "no further triage needed": the Spec is an input, not a work order. An agent running alone and looking for that label can't see the difference. It takes the Spec, builds everything in one go, and leaves the Tickets with nothing to do. Matt calls this the most-reported problem with the Skill. To fix it, tell that agent to skip the Spec when you start it, or remove the label once to-tickets has run.

```checkpoint quick-12
You've run to-tickets. An agent running alone looks for ready-for-agent Issues. What can go wrong?
- [x] It takes the Spec itself and builds it all in one go.
- [ ] It moves the Spec back to triage for a person to sort.
- [ ] It refuses the Spec and asks you to split it up again.
Why: The Spec carries ready-for-agent too, and the agent can't see that the label marks an input rather than a work order. So tell it to skip the Spec, or remove the label.
```

[implement-spec](/learn/implement-spec) isn't this trap. It builds a whole Spec in one run too, but it reads the Spec's Tickets and what blocks what, and works through them.

**to-tickets can't read the whole Spec.** A tracker Issue may not return a very large Spec in full, and there's no local copy to use instead. So run to-tickets in the same session as to-spec. Then it "never has to fetch the spec again". Nearing the [smart zone](/learn/context-hygiene)'s limit while you're still grilling? Compact at the end of the grilling, before to-spec, and carry on. Don't compact between to-spec and to-tickets: then to-tickets has to fetch the Spec again.

```checkpoint quick-13
You cleared the session after to-spec, and to-tickets keeps reading a cut-off Spec. What would have avoided this?
- [x] Running to-tickets in the same session as to-spec.
- [ ] Asking to-tickets to fetch the Spec once more.
- [ ] Clearing the session once more before to-tickets.
Why: A tracker Issue may not return a very large Spec in full. In the same session, to-tickets never has to fetch it again.
```

**The Spec no longer matches the code.** Nothing keeps a Spec in sync. It records what you knew when you wrote it, and it goes out of date the first time building teaches you something. Don't edit it: treat it as disposable after the work ships. Put anything that should last in `GLOSSARY.md`, the project's list of agreed words, and in ADRs, short records of one hard-to-reverse decision each, kept in `docs/adr/`. [domain-modeling](/learn/domain-modeling) covers both.

```checkpoint quick-14
The build teaches you something that should last. Where do you put it?
- [x] In GLOSSARY.md and ADRs.
- [ ] In the Spec itself.
- [ ] In a fresh Spec, once it ships.
Why: Nothing keeps a Spec in sync, so it goes out of date. Don't edit it. Put what should last in GLOSSARY.md and ADRs.
```

Matt's older AI Coding Dictionary entry says a Spec changes as work goes on, and lists its Tickets' status. His newer to-spec page says not to edit it, and the newer page wins.

**The template fits badly.** You're doing a refactor (restructuring code without changing what it does), not a feature. The template "relies heavily on user stories, which do not fit architectural work." Lean on Implementation Decisions and Testing Decisions instead, and record lasting decisions as ADRs through [grill-with-docs](/learn/grill-with-docs).

**The Spec repeats work someone already filed.** to-spec doesn't search the tracker for overlapping Issues before it writes, and nothing warns you. In a busy area, search the Issue tracker yourself first.

**The Spec feels too long to read.** There's no summary mode. Read at least the seams and the Out of Scope section. There, a wrong decision is cheapest to catch now and most expensive to find later. If a line surprises you, the length isn't the problem: "the grilling was too shallow".

```checkpoint quick-15
You only have time to read part of a Spec. Which parts do you read?
- [x] The seams and the Out of Scope section.
- [ ] The User Stories and the Further Notes.
- [ ] The Problem Statement and the Solution.
Why: In the seams and the Out of Scope section, a wrong decision is cheapest to catch now and most expensive to find later.
```

### Try it

You'll need your practice project, with the Skills set up. If you haven't set the project up, do the Try it step in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. Run `/grill-with-docs` on the next feature: a full class says no to a booking. Ticket #3 from that Try it already covers creating one.
2. Answer until every question is settled. Don't clear the session.
3. Type `/to-spec`. You should see it propose seams before it writes anything.
4. Check the seams are as few as possible. For a FastAPI backend, the HTTP API is a natural single seam.
5. Confirm the seams. You should see a new Issue on your tracker, labelled `ready-for-agent`.
6. Read the Issue. Check that you remember making every decision in it.
7. Read Out of Scope. Check that it lists things you really refused.
8. If a line surprises you, the grilling missed it. Grill that question again, run `/to-spec` again, and close the first Spec with `gh issue close <number>`.
9. Keep this session open. The Try it in [to-tickets](/learn/to-tickets) splits this Spec next, in the same session.

### Read more

- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock, updated 2026-08-24
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (video)
- [v1.1: /wayfinder, /to-spec, /to-tickets, /grilling improvements, and much more](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements), Matt Pocock, 2026-07-08
- [Spec (AI Coding Dictionary)](https://www.aihero.dev/ai-coding-dictionary/spec), Matt Pocock, last changed 2026-06-05
- [History for dictionary/Spec.md](https://github.com/mattpocock/dictionary-of-ai-coding/commits/main/dictionary/Spec.md), Matt Pocock, last commit 2026-06-05
- [Release v1.3.0](https://github.com/mattpocock/skills/releases/tag/v1.3.0), Matt Pocock, 2026-10-04
- [to-tickets: parent issue remains pickable after decomposition (#292)](https://github.com/mattpocock/skills/issues/292), mnusurov, 2026-05-31
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic, undated (read 2026-10-30)

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint to-spec-deeper-truncated
Your Spec for a big FastAPI change came out very long. You cleared the session straight after writing it, and in the new session the Ticket-splitting step keeps reading the Spec cut short. Why would keeping both steps in one session have avoided this?
- [x] The second step could use the Spec still in context, instead of fetching it again.
- [ ] A long Spec is a sign it needs more grilling, which only works in the first session.
  > A surprising Spec points to shallow grilling, but a long one doesn't. Here the trouble is that the tracker may not return a very large Spec in full.
- [ ] Clearing the session deletes the Issue, so the second step can only read a summary.
  > Clearing doesn't touch the Issue tracker. The Issue is still there; it's just too large to come back in full when fetched.
- [ ] The Spec should hold file paths, so the second step can read the code instead.
  > A Spec leaves out file paths, because they go stale. The fix is not to have to fetch the Spec at all.
Why: A tracker Issue may not return a very large Spec in full, and there's no local copy to use. In the same session, the Ticket step never has to fetch the Spec again. So don't clear or compact between them.
```

## Remember

```flashcards
Q: What does to-spec create?
A: One Spec, as an Issue on the Issue tracker, labelled ready-for-agent.

Q: In the main flow, what comes right after to-spec?
A: [to-tickets](/learn/to-tickets), which splits the Spec into Tickets.

Q: What does a Spec from to-spec leave out, and why?
A: File paths and code snippets, because they go stale fast. The exception is a short prototype snippet that pins down a decision better than words.

Q: Why did Matt rename the Skill from to-prd to to-spec in v1.1?
A: The document wasn't really a PRD. "A PRD describes things about the actual product itself, whereas we were allowing non-product stuff to leak in."

Q: What does Matt call the most-reported problem with to-spec?
A: Agents running alone that look for ready-for-agent build the whole Spec in one run. Tell them to skip the Spec, or remove its label after the Tickets are written.

Q: Which two parts of a Spec should you read, even if you skip the rest?
A: The seams and the Out of Scope section, where a wrong decision is cheapest to catch now and most expensive to find later.
```

## Final test

```final-test to-spec-no-interview
What does to-spec do with the plan you've been discussing?
- [x] It writes up what's been decided as a Spec, without interviewing you.
- [ ] It interviews you until every open question is settled, then writes it.
- [ ] It splits the plan into Tickets, each saying which others block it.
- [ ] It builds the plan test-first, at the seams you agreed.
Why: By the time you reach for to-spec, the deciding is done, so it starts no new round of questions. It only writes up what's already known. Splitting into Tickets and building come later.
```

```final-test to-spec-label
Which triage label does to-spec put on the Spec it publishes?
- [x] ready-for-agent
- [ ] needs-triage
- [ ] ready-for-human
- [ ] None. Triage labels it later.
Why: to-spec applies ready-for-agent itself. The label says the Spec is complete enough for an agent to work from, so nobody needs to triage it.
```

```final-test to-spec-seams
What does to-spec check with you before it writes the Spec?
- [x] The seams where the feature will be tested.
- [ ] How many Tickets the work should be split into.
- [ ] The body of the pull request.
Why: Seams decide where the tests will go, so it agrees them with you before it writes. It prefers seams that already exist, picks the highest it can, and asks whether they match what you expect.
```

```final-test to-spec-deeper-defect
You're checking a finished Spec for defects. What counts as one?
- [x] The Spec states something you never said in the conversation.
- [ ] The Spec is too long for you to read from start to finish.
- [ ] The Spec leaves a section empty when nothing was decided there.
- [ ] The Spec uses your project's own nouns instead of standard terms.
Why: A Spec records what you decided. It isn't a place to decide. So a line you never said is a defect. Length isn't the problem: if a Spec surprises you, the grilling was too shallow.
```

```final-test to-spec-deeper-what-lasts
Building teaches you something that should last. Where do you put it?
- [x] Into `GLOSSARY.md` and ADRs, because the Spec is disposable once the work ships.
- [ ] Into the Spec, edited in place as each Ticket teaches you something.
- [ ] Into the open Tickets, so the next session reads it before it starts building.
- [ ] Into a fresh Spec, written with to-spec again at the end of the build.
Why: Nothing keeps a Spec in sync, so it goes out of date, and it's disposable once the work ships. `GLOSSARY.md` and ADRs are the files meant to last. Matt's older AI Coding Dictionary entry says a Spec changes as work goes on, but his newer to-spec page says not to edit it, and the newer page wins.
```

```final-test to-spec-after-grilling
You've spent an hour being interviewed about a FastAPI booking backend. Every question is settled and the Glossary is up to date. The build will clearly take several sessions, and you want the plan written down on the Issue tracker. Which fits best?
- [x] Write up the settled plan as a Spec and publish it.
  > Right: that's `/to-spec`.
- [ ] Get interviewed again, to check nothing in the plan was missed.
  > That's `/grill-with-docs`. Every question is already settled, so another interview adds nothing.
- [ ] Split the plan straight into Tickets, each naming what blocks it.
  > That's `/to-tickets`. The main flow writes the Spec first, then splits it into Tickets.
- [ ] Start building it now, while the plan is fresh in this session.
  > That's `/implement`. Building straight away is for work that fits one session; this build needs several.
Why: A build that spans several sessions goes from the interview to a Spec, then to Tickets. The questions are settled, so there's nothing left to ask. The next step is to write up what's already known.
```

```final-test to-spec-fuzzy-idea
You want to add an AI agent that answers questions on your website. You haven't decided how it stores conversations or which model it calls. You'd like a Spec on the Issue tracker eventually, and the repo is right there. Which fits best?
- [x] Get interviewed on the open questions, keeping a Glossary as you go.
  > Right: that's `/grill-with-docs`.
- [ ] Write the Spec now from what you've said, filling the gaps as it goes.
  > That's `/to-spec`. It doesn't interview you. It only writes up what's already decided, so the gaps would be guessed.
- [ ] Build a quick throwaway version first, to try the idea out.
  > That's `/prototype`. The interview comes first. A prototype is a detour from it, only for a question that talk alone can't settle.
Why: A Spec can only hold decisions you've made, and here the big ones are still open. So settle them by interview first, in the repo, so the Glossary and any ADRs are kept. Then write the Spec.
```

```final-test to-spec-same-window
In this session you've just finished being interviewed about moving your FastAPI backend into Docker. It's a multi-session build, and the context window still has plenty of room. What do you do next?
- [x] Write the Spec now, in this same session.
  > Right: that's `/to-spec`.
- [ ] Write a handoff file, then write the Spec in a fresh session.
  > That's `/handoff`. A handoff is for a new harness, a new directory or a colleague. Here it would cut the Spec off from the thinking behind it.
- [ ] Split the work into Tickets now.
  > That's `/to-tickets`. The Spec comes first; the Tickets are slices of it.
- [ ] Start building it here.
  > That's `/implement`. Building straight away is for work that fits one session; this build needs several.
Why: The grilling, the Spec and the Tickets should all build on the same thinking, so they belong in one unbroken context window. The Spec comes right after the grilling, and this window still has room for it.
```

```final-test to-spec-why-seams
The agent is writing up the Spec for a new SQL migration runner. Before writing, it stops and asks you to confirm one thing: the tests will sit at the runner's public interface, and nowhere else. Why does it check this with you?
- [x] So the tests land on as few agreed public boundaries as possible.
- [ ] Because the design still has open questions it must ask you about.
  > It doesn't interview you about the design; it only checks the seams it proposes.
- [ ] So it can list each test file's path in the Spec for the builder.
  > The Spec leaves out file paths, because they go stale fast.
Why: Seams decide where the tests go, and you can't test everything. Agreeing the fewest, highest seams up front puts the testing effort on the critical paths, not on every edge case.
```

```final-test to-spec-deeper-afk-label
You run agents unattended, and each one picks up any Issue labelled ready-for-agent. After you wrote the Spec for the yoga-studio booking feature and split it into Tickets, one agent took the Spec Issue itself and tried to build the whole feature in one run. Why is that a problem, and what fixes it?
- [x] Each Ticket fits one fresh context window; drop the Spec's label or tell the agent to skip it.
- [ ] The Spec was missing seams; add them, then relabel it so agents test at the right places.
  > The seams weren't the issue. The agent saw the label and treated the Spec as a work order instead of picking up the Ticket slices.
- [ ] The Tickets were too small; merge them back into the Spec so one agent can build it.
  > Tickets are sized for one fresh context window. An agent that builds the Spec Issue as one work item skips them.
- [ ] The agent needs the Spec triaged first; run triage on it to add the right label.
  > The Spec already has ready-for-agent, meaning no more triage is needed. The label itself is what the agent picked up.
Why: The label means "no further triage needed", but an agent looking for it can't see that the Spec is an input, not a work order. So it builds the whole Spec at once, when each Ticket was sized for one fresh context window. Tell the agent to skip the Spec, or remove its label once the Tickets exist.
```

```sources
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [tdd: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/SKILL.md), Matt Pocock's Skills
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), Matt Pocock
- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock, updated 2026-08-24
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [Spec | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/spec), Matt Pocock
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [v1.1: /wayfinder, /to-spec, /to-tickets, /grilling improvements, and much more](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements), Matt Pocock, 2026-07-08
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [Release v1.3.0 · mattpocock/skills](https://github.com/mattpocock/skills/releases/tag/v1.3.0), Matt Pocock, 2026-10-04
- [to-tickets: parent issue remains pickable after decomposition #292](https://github.com/mattpocock/skills/issues/292), mnusurov, 2026-05-31
- [History for dictionary/Spec.md - mattpocock/dictionary-of-ai-coding](https://github.com/mattpocock/dictionary-of-ai-coding/commits/main/dictionary/Spec.md), Matt Pocock
```
