---
title: Your first wayfinder session
slug: wayfinder-first-session
summary: You’ll know what your first /wayfinder session will do, what it leaves behind, and what every session after it looks like.
---

Grilling settles a plan in one conversation. The Care4Mind rebuild is too big for one conversation, so wayfinder spreads the planning over many short sessions and keeps track of it in files.

```goals
- You’ll know what your first `/wayfinder` session will do, what it leaves behind, and what every session after it looks like.
```

## Why not one big grilling?

You’ve been grilled before, so you know the shape: the agent asks, you decide, and the plan gets sharper. That works when the whole plan fits in one conversation. Care4Mind doesn’t fit. Its brief ends with twelve open questions, from what to build the site with to which Questionnaires are in scope, and many of the answers don’t exist yet: some need research, some need people the client hasn’t named yet, and some can’t be settled until another question is.

So wayfinder writes the open questions down as **tickets** and settles them one per session. The files remember everything, which means every session can start with a clean slate.

```callout remember
Grilling settles a plan you can hold in one conversation. Care4Mind’s plan doesn’t fit, because many of its answers don’t exist yet, so wayfinder writes each open question down as a ticket and settles one per session. The files remember everything.
```

```checkpoint check-1
You want to rename one Care4Mind page and fix its menu link, and every answer is already in your head. Which fits?
- [ ] `/wayfinder`, one ticket per question
- [ ] A research ticket per question
- [x] `/grill-with-docs`, in a single session
- [ ] `/wayfinder`, charted over several sessions
Why: Matt’s own summary: `/grill-with-docs` sharpens an idea you can hold in one session, and wayfinder is for the idea you can’t. Tickets spread over many sessions are for a plan too big for one conversation, and this one isn’t.
```

```checkpoint check-2
One of the brief’s open questions can only be answered by someone the client hasn’t named yet. Why does that stop one grilling from settling the whole plan?
- [x] That answer can’t exist during the conversation
- [ ] Grilling can only ask about technical choices
- [ ] The agent must name that person first
- [ ] People questions always belong out of scope
Why: Grilling works when the whole plan fits in one conversation. An answer that needs a person nobody has named can’t arrive in that conversation, so wayfinder writes the question down as a ticket and settles it in a later session.
```

## What it leaves on disk

```text
.scratch/care4mind-rebuild/
├── map.md                                  the index
└── issues/
    ├── 01-what-vercel-and-neon-offer.md     research · resolved
    ├── 02-who-runs-the-site-after-launch.md task · resolved
    ├── 03-what-to-build-it-with.md          grilling · blocked by 01, 02
    └── 04-topic-landing-page-look.md        prototype · blocked by 03
```

The **map** is a single file that indexes the whole effort. It has five parts: the _Destination_ (where this effort ends), _Notes_, _Decisions so far_ (one line per settled ticket, linking to it), _Not yet specified_, and _Out of scope_.

A **ticket** is one question in its own file. It records its type and which tickets have to be settled first. Here is what ticket 03 might look like. Notice it states the question and its limits, and gives no hint of the answer:

```text
# 03: What will the new site be built with, and where will it run?
Type: grilling
Blocked by: 01, 02

## Question
Choose the platform and hosting for the rebuild, including whether WordPress
stays on as a content back end or goes entirely. It has to suit one developer
who knows Docker and SQL but little JavaScript, and whoever runs the site
after launch (see “Who runs the site after launch?”).
```

When a ticket is settled, the agent adds an `## Answer` to it and marks it resolved. In the example above, the next session would take 03: it’s open, and both tickets blocking it are resolved. 04 waits for 03, because you can’t sketch a landing page before you know what it will be built with.

Questions you can see coming but can’t phrase sharply yet go under _Not yet specified_. Wayfinder calls that the **fog**. On Care4Mind, “what exactly is a topic, and how does a Concept link to a modern idea in psychology?” is fog until a few other answers are in. As answers come in, pieces of fog become clear enough to turn into new tickets.

```callout remember
The map indexes the whole effort; each ticket is one question in its own file, with its type and the tickets that must be settled first. A ticket is unblocked once every ticket blocking it is resolved. A question you can’t yet state precisely stays in the fog.
```

```checkpoint check-3
In the example map, suppose 01 is resolved but 02 is still open. Can a session take ticket 03 yet?
- [ ] Yes, because one blocker is resolved
- [x] No, because 02 still blocks it
- [ ] Yes, grilling tickets ignore their blockers
- [ ] No, because 04 must go first
Why: A ticket is unblocked only when every ticket blocking it is resolved. 03 is blocked by both 01 and 02, so it waits for 02. It’s 04 that waits for 03, not the other way round.
```

```checkpoint check-4
You can state a Care4Mind question precisely, but nobody can answer it yet. Does it become a ticket, or stay in the fog?
- [ ] Fog, because it has no answer yet
- [ ] Fog, until a session can settle it
- [ ] Neither; it goes under Out of scope
- [x] A ticket, because it can be phrased
Why: Wayfinder’s test is whether you can state the question precisely now, not whether you can answer it now. The fog is for questions you can see coming but can’t phrase sharply yet.
```

```checkpoint check-5
You’re reading ticket 03 before its session starts. Which of these should it _not_ contain?
- [x] A hint of the expected answer
- [ ] The question it has to settle
- [ ] Its type and its blocking tickets
- [ ] The limits any answer must meet
Why: A ticket states its question and its limits, its type, and which tickets must be settled first. Ticket 03 gives no hint of what to choose; the answer only arrives when the ticket is settled, under `## Answer`.
```

## How the sessions go

1. **Chart the map** (Once): `/wayfinder <your idea>`
   - Asks where this effort ends: the _destination_.
   - Asks wide questions across the whole project.
   - Writes the map, plus one ticket for each question it can already phrase.
   - Starts the research tickets in the background.
   - Stops. It settles nothing itself.
2. **Work the map** (Once per ticket): `/clear
/wayfinder .scratch/<name>/map.md`
   - Reads the map.
   - Takes the ticket you name, or else the first open ticket that isn’t blocked or claimed, and claims it.
   - Settles it the way its type says (next section).
   - Writes the answer into the ticket and adds one line to the map.
   - Turns any fog that has cleared into new tickets, then stops.
   - Repeat until no tickets are left. [Lesson 3](/learn/working-the-map) walks through one of these sessions.
3. **Hand off to the build** (When the map is clear): `/to-spec → /to-tickets → /implement`
   - Wayfinder plans; it doesn’t build. These three are [Lesson 5](/learn/after-the-map).

One ticket per session is a rule, not a suggestion. Research tickets are the exception, because several can run at once in the background.

```callout remember
Charting happens once and settles nothing. Every session after it starts with `/clear`, takes one ticket (the one you name, or the first open one that isn’t blocked or claimed), writes the answer down, turns cleared fog into tickets and stops. Only research tickets run several at once.
```

```checkpoint check-6
You start a work session with the map’s path and don’t name a ticket. Which one does wayfinder take?
- [ ] The newest ticket added to the map
- [ ] The ticket that blocks the most others
- [ ] Every research ticket that is still open
- [x] The first open, unblocked and unclaimed ticket
Why: It takes the ticket you name; if you don’t name one, it takes the first open ticket that isn’t blocked or claimed, and claims it. How many other tickets it blocks plays no part in the choice.
```

```checkpoint check-7
While charting, the agent has asked about the destination and written the map and tickets. What does it do with the research tickets?
- [x] Starts them running in the background
- [ ] Leaves them for you to start
- [ ] Settles them all before it stops
- [ ] Moves them under Not yet specified
Why: Charting writes the map and one ticket per question it can phrase, starts the research tickets in the background, then stops. It settles nothing itself.
```

```checkpoint check-8
Ticket 03 has just been settled, and its answer makes a piece of fog clear enough to phrase. What does the session do with it?
- [ ] Settles it straight away as well
- [ ] Waits for you to add it
- [x] Writes it as a new ticket
- [ ] Adds it to Out of scope
Why: The last step of a work session turns any fog that has cleared into new tickets, then stops. Settling the new ticket too would break the one-ticket-per-session rule.
```

## Four kinds of ticket

| Type | Needs you? | How it gets settled |
|---|---|---|
| Research | No | An agent reads docs, sites or files in the background and writes up what it found. |
| Grilling | Yes | The interview you already know, aimed at one question. |
| Prototype | Yes | The agent makes a rough draft (a sketch, an outline, a stub) for you to react to. |
| Task | Sometimes | Someone does work that must happen before a decision, such as signing up for a service so it can be tried. |

That’s why **“I don’t know” is a fine answer** while charting. A fact you don’t know becomes the agent’s job, or a research ticket. An answer that belongs to someone else, like the Psychology expert’s scoring rules, becomes a task: send them a `/to-questionnaire` ([Lesson 4](/learn/answers-from-other-people)). A question that’s still too vague goes into the fog.

```callout remember
A ticket’s type decides how it gets settled and whether you’re needed: research runs without you, grilling and prototypes need you, and a task does work that must happen before a decision. So “I don’t know” is fine: an unknown fact becomes the agent’s job, someone else’s answer becomes a task, and a vague question goes into the fog.
```

```checkpoint check-9
While charting, the agent asks you a question of fact, and you don’t know the answer. What do you say?
- [ ] Your best guess, so nothing is blank
- [x] That you don’t know; it finds out
- [ ] Nothing until you have looked it up
- [ ] Ask it to drop the question entirely
Why: Finding facts is the agent’s job, never yours. A fact you don’t know becomes the agent’s job, or a research ticket, which is why “I don’t know” is a fine answer while charting.
```

```checkpoint check-10
You’ll be away all day while the agent works through the map. Which two ticket types can’t be settled without you?
- [ ] Research and task
- [ ] Research and grilling
- [x] Grilling and prototype
- [ ] Prototype and task
Why: Grilling is an interview with you, and a prototype is a rough draft for you to react to. Research runs in the background without you, and a task only sometimes needs you.
```

```checkpoint check-11
What sets a task apart from the other three ticket types?
- [ ] It always runs without you there
- [ ] It is settled by an interview
- [ ] It starts with a rough draft
- [x] It does work rather than deciding
Why: A task is “the one type that _does_ rather than decides”: work that must happen before a decision, such as signing up for a service so it can be tried. An interview is grilling, a rough draft is a prototype, and a task only sometimes needs you.
```

## So where do the ADRs come from?

From the same place as before. Every grilling ticket runs the two skills `/grill-with-docs` runs, _grilling_ and _domain-modeling_, so the paper trail still gets written, one question at a time.

- When a word gets pinned down, it goes into the project’s `GLOSSARY.md` straight away.
- An **ADR** (architecture decision record: one big decision, written down) is rare. You’re offered one only for a big, hard-to-undo decision.
- **Every** decision, ADR or not, is written in its ticket’s Answer. The map just links to it.

|  | /grill-with-docs | /wayfinder |
|---|---|---|
| Fits | A plan you can hold in one session | A plan too big for one session |
| Sessions | One | One to chart, then one per ticket |
| Decisions live in | The conversation, plus glossary and ADRs | Ticket files, plus glossary and ADRs |
| Next step | `/to-spec` in the same session | `/to-spec` once the map is clear |

```callout remember
Every grilling ticket runs the same two skills as `/grill-with-docs`, so pinned-down words go into `GLOSSARY.md` straight away, and an ADR is offered only for a big, hard-to-undo decision. Every decision, ADR or not, is written in its ticket’s Answer.
```

```checkpoint check-12
Why does a wayfinder grilling ticket still update `GLOSSARY.md` and offer ADRs, just as `/grill-with-docs` does?
- [ ] Wayfinder copies the chat into files
- [x] It runs the same two skills
- [ ] The map writes one ADR each
- [ ] Research tickets write the ADRs later
Why: `/grill-with-docs` is two skills, grilling and domain-modeling, and every wayfinder grilling ticket runs the same two. So the paper trail still gets written, one question at a time.
```

```checkpoint check-13
A grilling ticket settles the order of the links in Care4Mind’s footer, which you could change in a minute. Will you be offered an ADR?
- [ ] Yes, every grilling decision gets one
- [ ] Yes, once the map links it
- [ ] No, ADRs only come from research
- [x] No, because it’s easy to undo
Why: An ADR is offered only for a big, hard-to-undo decision: hard to reverse, surprising without context, and the result of a real trade-off. The small choice is still written down, in its ticket’s Answer.
```

```checkpoint check-14
During a grilling ticket, you and the agent pin down what a word in the brief means. When is that meaning written down?
- [x] Straight away, in the glossary
- [ ] Later on, in the spec
- [ ] Only if it’s an ADR
- [ ] Once the map is clear
Why: When a word gets pinned down, it goes into the project’s `GLOSSARY.md` straight away. It doesn’t wait for an ADR, the end of the map, or the spec.
```

## Practice

### Sort the tickets

Pick the type for each Care4Mind question. You’ll see why straight away.

```checkpoint check-15
Sign up for Vercel and Neon, so the platform the brief leans towards can be tried.
- [ ] Research
- [ ] Grilling
- [ ] Prototype
- [x] Task
Why: Nothing to decide yet: it’s work that has to happen before the platform decision can be judged. Signing up for a service is the skill’s own example of a task.
```

```checkpoint check-16
What do web archives still hold of the old questionnaire app at questionnaire.care4mind.org?
- [x] Research
- [ ] Grilling
- [ ] Prototype
- [ ] Task
Why: A fact the agent can find on its own, so it runs in the background. The brief names web archives as one possible source of the missing scoring rules.
```

```checkpoint check-17
Should WordPress stay on as the content back end, or go entirely?
- [ ] Research
- [x] Grilling
- [ ] Prototype
- [ ] Task
Why: A decision with real trade-offs that only you can make: Content editors might keep screens they know, but you know little WordPress. It also waits on who runs the site after launch.
```

```checkpoint check-18
What should a topic landing page look like?
- [ ] Research
- [ ] Grilling
- [x] Prototype
- [ ] Task
Why: “How should it look?” is easier to answer by reacting to rough drafts than by describing it, so the agent makes some for you to react to.
```

```checkpoint check-19
Who will pay for hosting after launch?
- [ ] Research
- [ ] Grilling
- [ ] Prototype
- [x] Task
Why: Neither you nor the agent can answer it: it belongs to the Project owner (the brief marks it “(Client)”). Getting that answer is work that unblocks a decision, so it’s a task: you send a questionnaire (Lesson 4).
```

```checkpoint check-20
Which search tools can match a Sanskrit term in IAST, Devanagari and plain spellings?
- [x] Research
- [ ] Grilling
- [ ] Prototype
- [ ] Task
Why: Another fact: the agent reads the tools’ documentation and writes up what it found. The brief’s NFR-03 needs search to match every stored spelling.
```

```checkpoint check-21
Is a topic its own content type, or just a label on Concepts?
- [ ] Research
- [x] Grilling
- [ ] Prototype
- [ ] Task
Why: A decision about structure and about words. In a grilling ticket, domain-modeling writes the agreed meaning of “topic” into the project’s `GLOSSARY.md`.
```

### Check yourself

From memory, without scrolling up. Getting one wrong first is part of how it sticks.

```final-test final-22
Your first `/wayfinder` session has just ended. What has it left on disk?
- [ ] A spec that is ready to build
- [ ] One ADR for each decision it made
- [x] A map plus one file per question
- [ ] Nothing until the last ticket is done
Why: Charting writes the map and one ticket file for each question it can already phrase, starts the research tickets, and stops. It settles nothing itself.
```

```final-test final-23
You start a normal session with `/wayfinder` and the map’s path. What does it do?
- [x] Settles one ticket, then it stops
- [ ] Settles every open ticket in turn
- [ ] Writes the spec, then the tickets
- [ ] Builds the code for one ticket
Why: One ticket per session. Research tickets are the only exception, since several can run at once in the background.
```

```final-test final-24
You’ve just settled a ticket. What do you type before starting the next one?
- [ ] `/compact`, so the agent remembers more
- [ ] `/handoff`, to write a summary file
- [ ] `/resume`, to reload the last session
- [x] `/clear`, since the files hold everything
Why: The answer is saved in the ticket and the map, so the old conversation can go. `/handoff` is only for moving to a different tool, folder or person.
```

```final-test final-25
Where does a wayfinder decision get written down?
- [ ] In a brand new ADR, every single time
- [x] In its ticket, and the map links it
- [ ] Only in the chat, so keep it open
- [ ] Into the spec file for that same feature
Why: The answer goes in its ticket, and the map’s “Decisions so far” gets one line linking to it. An ADR is an extra, offered only for big, hard-to-undo decisions.
```

```final-test final-26
The map has no open tickets left. What comes next?
- [ ] `/implement`, starting at ticket one
- [ ] `/to-tickets` straight from the map
- [x] `/to-spec`, pointed at the map
- [ ] `/grill-with-docs` to write the ADRs
Why: Wayfinder plans; it doesn’t build. `/to-spec` collapses the map’s settled decisions into a build plan (once per feature if the map covers several), then `/to-tickets` splits it into build tickets for `/implement`. Skipping `/to-spec` throws away the detail in the tickets.
```

## Your first session

Open a terminal in your project folder and check which branch you’re on:

```sh
cd ~/Desktop/project1 && git status
```

```callout watch-out
If it says you’re on `docs/rebuild-brief`: that branch’s pull request is already merged on GitHub, and your local `main` is one commit behind it. Switch to `main` and bring it up to date first, so the map starts from the merged brief.
```

```sh
git switch main && git pull
```

Then start Claude Code in that folder, type `/clear`, and paste this:

```text
/wayfinder Chart the Care4Mind.org rebuild from docs/project-brief.md. Read docs/current-site.md, docs/adr/0001-rebuild-instead-of-enhancing.md and GLOSSARY.md first. The rebuild itself is settled (ADR-0001); the brief's twelve open questions are where the map starts.
```

Expect a long interview: first about the destination, then wide questions across the whole brief. If you’re unsure what to say for the destination, the brief gives you one: _every open question is settled or ruled out of scope, so the rebuild can be estimated and specced_. Expect a question about whether the Questionnaires belong on this map at all, since the brief runs them as a separate track. And remember: “I don’t know” is a fine answer.

```callout watch-out
Research tickets save their findings on a throwaway git branch and push it to your private GitHub repo. That’s expected: those branches are never merged into `main`.
```

## Watch and read next

**Watch:** [“/wayfinder: Nothing is too big to plan anymore”](https://www.youtube.com/watch?v=F3lL98Pj90o), Matt Pocock’s 15-minute walkthrough (July 2026). The chapters at 2:10 (how maps work) and 7:40 (ticket types and blocking) cover this lesson.

**Read:** [the wayfinder skill itself](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md), about 130 lines and the exact instructions your agent follows. Start with “The Map” and “Ticket Types”. Your installed copy is identical to [the published one](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md) (checked 26 October 2026).

```sources
- [wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md)
- [ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md)
- [grilling/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md)
- [grill-with-docs](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md)
- [domain-modeling/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md)
- [Matt’s /grill-with-docs article](https://www.aihero.dev/skills-grill-with-docs)
```
