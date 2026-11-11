---
title: Your first wayfinder session
slug: wayfinder-first-session
summary: Your first /wayfinder session charts a map of open questions on your tracker, and every session after it settles one of them.
image: /images/lessons/wayfinder-first-session.jpg
imageAlt: A cairn of flat stones left by early travellers to mark the Old Spanish Trail across a Utah desert.
---

Say the studio owner wants the whole booking and payments system rebuilt on your yoga-studio site: class passes, monthly memberships, card payments, refunds and a waitlist for full classes. You start [grilling](/learn/grilling) it, and the open questions keep spreading past what one conversation can hold. Grilling settles a plan in one conversation. This plan is too big for one, so [wayfinder](/learn/wayfinder) spreads the planning over many short sessions and keeps track of it on your Issue tracker.

```goals
- You'll be able to say why a plan this big needs a map, not one long grilling.
- You'll be able to read a map and its tickets, and say which ticket a session may take next.
- You'll be able to sort open questions into the four ticket types, and say which ones need you there.
- You'll be able to start your first wayfinder session on the practice project.
```

## Why not one big grilling?

You've been grilled before, with [grill-with-docs](/learn/grill-with-docs), so you know the shape: the agent asks, you decide, and the plan gets sharper. That works when the whole plan fits in one conversation. The booking and payments rebuild doesn't fit.

Say your notes end with a dozen open questions, from which payment service to use to which kinds of pass move across from the old booking tool. Many of the answers don't exist yet. Some need research, some need people the studio owner hasn't named yet, and some can't be settled until another question is.

**So wayfinder writes each open question down as a ticket and settles one ticket per session, and the tracker, not the conversation, remembers the plan.**

A _ticket_ here is a decision ticket: one question, in its own [Issue](/learn/issues-and-keeping-track), whose answer is a decision, not a slice to build. Because the tracker holds every answer, each session can start with a clean slate.

```callout remember
Grilling settles a plan you can hold in one conversation. The rebuild doesn't fit, because many of its answers don't exist yet. So wayfinder writes each open question down as a ticket and settles one per session. The tracker remembers everything.
```

```checkpoint check-1
You want members to join a waitlist when a class is full. It's a medium-sized change, and you can settle every question about it in one sitting. Which fits?
- [ ] `/wayfinder`, with one ticket per open question
- [ ] A research ticket for each open question
- [x] `/grill-with-docs`, in a single session
- [ ] `/wayfinder`, charted over several sessions
Why: Matt's own summary: `/grill-with-docs` sharpens an idea you can hold in one session, and wayfinder is for the idea you can't. Tickets spread over many sessions are for a plan too big for one conversation, and this one isn't.
```

```checkpoint check-2
One of your open questions can only be answered by someone the studio owner hasn't named yet. Why does that stop one grilling from settling the whole plan?
- [x] That answer can't exist during the conversation
- [ ] Grilling can only ask about technical choices
- [ ] The agent must name that person itself first
- [ ] Questions about people always go out of scope
Why: Grilling works when the whole plan fits in one conversation. An answer that needs a person nobody has named can't arrive in that conversation, so wayfinder writes the question down as a ticket and settles it in a later session.
```

## What it leaves on your tracker

The practice project keeps its work in GitHub Issues, so that's where the map goes. Here is a made-up map for the rebuild, a little way in. The numbers and titles only show the shape; wayfinder writes its own.

```text
#20 Rebuild booking and payments                    wayfinder:map
├── #21 What do payment services charge and offer?
│       wayfinder:research · closed
├── #22 Who handles refunds after launch?
│       wayfinder:task · closed
├── #23 Which payment service will take the studio's payments?
│       wayfinder:grilling · blocked by #21, #22
└── #24 What should the checkout page look like?
        wayfinder:prototype · blocked by #23
```

The **map** is one Issue, labelled `wayfinder:map`, that indexes the whole effort. Its tickets hang under it as [sub-issues](/learn/issues-and-keeping-track), and each carries a `wayfinder:` label naming its type. The map's body has five parts:

```text
## Destination
A Spec for the new booking and payments, with every open
question settled or ruled out of scope.

## Notes
Payments are new to the studio: prefer the simplest set-up.

## Decisions so far
- [What do payment services charge and offer?](link): three fit;
  all take a fee per payment, and one adds a monthly fee.
- [Who handles refunds after launch?](link): the front desk, with
  the studio owner approving anything over one class.

## Not yet specified
How teachers get paid for classes booked through the site.

## Out of scope
A phone app for members.
```

The _Destination_ is where this effort ends. _Notes_ hold standing preferences for the effort, and any Skills every session should use. _Decisions so far_ has one line per settled ticket, linking to it. _Not yet specified_ and _Out of scope_ are explained below.

Each **ticket** is one question in its own Issue. Its label records its type, and GitHub's own blocked-by links record which tickets have to be settled first. Here is what #23 might look like. Notice that it states the question and its limits, and gives no hint of the answer:

```text
Which payment service will take the studio's payments? #23
Label:      wayfinder:grilling
Blocked by: #21, #22 (GitHub's own links, beside the Issue)

## Question
Choose the payment service for class passes, memberships and
drop-in classes, including whether the card reader at the front
desk stays or goes. It has to suit one developer who knows Python
and SQL but little about payments, and whoever handles refunds
after launch (see "Who handles refunds after launch?").
```

When a ticket is settled, the agent posts the answer as a comment on it and closes it. In the example, the next session would take #23: it's open, and both tickets blocking it are closed. #24 waits for #23, because you can't sketch a checkout page before you know which payment service it uses.

Questions you can see coming but can't phrase sharply yet go under _Not yet specified_. Wayfinder calls that the **fog**. In the example, how teachers get paid is fog until you know how the money comes in. As answers arrive, pieces of fog become clear enough to turn into new tickets.

_Out of scope_ is different: it lists work you've ruled beyond the destination, like the phone app in the example. It isn't fog, and it never turns into tickets.

With no tracker set up, wayfinder keeps the same map and tickets as Markdown files under `.scratch/` instead. [Working the map](/learn/working-the-map) shows how that spells each step.

```callout remember
The map indexes the whole effort; each ticket is one question in its own Issue, with its type and the tickets that must be settled first. A ticket is unblocked once every ticket blocking it is closed. A question you can't yet state precisely stays in the fog.
```

```checkpoint check-3
In the example map, suppose #21 is closed but #22 is still open. Can a session take #23 yet?
- [ ] Yes, because one of its blockers is closed
- [x] No, because #22 still blocks it
- [ ] Yes, because grilling tickets ignore blockers
- [ ] No, because #24 has to go first
Why: A ticket is unblocked only when every ticket blocking it is closed. #23 is blocked by both #21 and #22, so it waits for #22. It's #24 that waits for #23, not the other way round.
```

```checkpoint check-4
You can state a question about the rebuild precisely, but nobody can answer it yet. Does it become a ticket, or stay in the fog?
- [ ] Fog, because it has no answer yet
- [ ] Fog, until a session can settle it
- [ ] Neither: it goes under Out of scope
- [x] A ticket, because it can be phrased
Why: Wayfinder's test is whether you can state the question precisely now, not whether you can answer it now. The fog is for questions you can see coming but can't phrase sharply yet.
```

```checkpoint check-5
You're reading #23 before its session starts. Which of these should it _not_ contain?
- [x] A hint of the expected answer
- [ ] The question it has to settle
- [ ] Its type and its blocking tickets
- [ ] The limits any answer must meet
Why: A ticket states its question and its limits, its type, and which tickets must be settled first. #23 gives no hint of what to choose; the answer only arrives when the ticket is settled, as a comment on it.
```

## How the sessions go

Matt's advice is never to start with `/wayfinder`. Start with a [grill-with-docs](/learn/grill-with-docs) session instead, and if planning gets out of hand, say `/wayfinder let's turn this into a map`. That way you never build a map for work that turns out simple. Either way, the effort runs in three stages: two kinds of wayfinder session, then the hand-off:

1. **Chart the map, once.** Type `/wayfinder` and your idea, or `/wayfinder let's turn this into a map` inside a grilling that has outgrown its session.
   - It asks where this effort ends: the _destination_.
   - It asks wide questions across the whole effort.
   - It writes the map, plus one ticket for each question it can already phrase, then wires the blocking links.
   - It starts the research tickets in the background.
   - It stops. It settles nothing itself.
2. **Work the map, once per ticket.** Type `/clear`, then `/wayfinder #20`, with your map's number.
   - It reads the map.
   - It takes the ticket you name, or else the first open ticket that isn't blocked or claimed, and claims it.
   - It settles the ticket the way its type says (next part).
   - It posts the answer on the ticket, closes it and adds one line to the map.
   - It turns any fog that has cleared into new tickets, then stops.
   - Repeat until no tickets are left. [Working the map](/learn/working-the-map) walks through one of these sessions.
3. **Hand off to the build, when the map is clear.** Run [`/to-spec`](/learn/to-spec), which writes a _Spec_ (the plan for building one feature), then [`/to-tickets`](/learn/to-tickets), which cuts the Spec into build _Tickets_, then [`/implement`](/learn/implement).
   - Wayfinder plans; it doesn't build. [After the map is clear](/learn/after-the-map) covers these three.

```diagram
type: chain
caption: "Wayfinder plans; it doesn't build."
steps:
  - label: "Chart the map, once."
    note: "It settles nothing itself."
  - label: "Work the map, once per ticket."
    note: "Repeat until no tickets are left."
  - "`/to-spec`"
  - "`/to-tickets`"
  - "`/implement`"
groups:
  - from: 3
    to: 5
    label: "Hand off to the build, when the map is clear."
```

One ticket per session is a rule, not a suggestion. Research tickets are the exception, because several can run at once in the background. And if charting's wide questions find no fog at all, the whole journey fits in one session: you don't need a map, so it stops and asks how you'd like to go on.

```callout remember
Charting happens once and settles nothing. Every session after it starts with `/clear`, takes one ticket (the one you name, or the first open one that isn't blocked or claimed), writes the answer down, turns cleared fog into tickets and stops. Only research tickets run several at once.
```

```checkpoint check-start
Your next change looks medium-large, and you can't yet tell whether its questions will fit in one session. Where do you start?
- [x] A `/grill-with-docs` session, turned into a map only if it sprawls
- [ ] `/wayfinder` straight away, so that a map catches every decision
- [ ] `/to-spec` now, with a map only for what the Spec leaves open
- [ ] A research ticket for each question, before any grilling starts
Why: Matt's advice is never to start with `/wayfinder`: the work may turn out simpler than you thought, and then you've made a map you don't need. Start with `/grill-with-docs`, and say `/wayfinder let's turn this into a map` if planning gets out of hand.
```

```checkpoint check-6
You start a working session with the map's number and don't name a ticket. Which one does wayfinder take?
- [ ] The newest ticket added to the map
- [ ] The ticket that blocks the most others
- [ ] Every research ticket that's still open
- [x] The first open, unblocked, unclaimed ticket
Why: It takes the ticket you name; if you don't name one, it takes the first open ticket that isn't blocked or claimed, and claims it. How many other tickets it blocks plays no part in the choice.
```

```checkpoint check-7
While charting, the agent has asked about the destination and written the map and its tickets. What does it do with the research tickets?
- [x] Starts them running in the background
- [ ] Leaves them for you to start later
- [ ] Settles them all before it stops
- [ ] Moves them under Not yet specified
Why: Charting writes the map and one ticket per question it can phrase, starts the research tickets in the background, then stops. It settles nothing itself.
```

```checkpoint check-8
#23 has been settled, and its answer makes a piece of fog clear enough to phrase. What does the session do with it?
- [ ] Settles it straight away as well
- [ ] Waits for you to add it by hand
- [x] Writes it up as a new ticket
- [ ] Adds it to the Out of scope part
Why: The last step of a working session turns any fog that has cleared into new tickets, then stops. Settling the new ticket too would break the one-ticket-per-session rule.
```

## Four kinds of ticket

Every ticket has one of four types, and the type decides how it gets settled. Wayfinder calls a ticket worked with you **HITL** (human in the loop) and one the agent runs alone **AFK** (away from keyboard).

| Type | Needs you? | How it gets settled |
|---|---|---|
| Research | No (AFK) | An agent reads docs, sites or files in the background and writes up what it found. |
| Grilling | Yes (HITL) | The interview you already know, aimed at one question. |
| Prototype | Yes (HITL) | The agent makes a rough draft (a sketch, an outline, a stub) for you to react to. |
| Task | Sometimes | Someone does work that must happen before a decision, such as signing up for a service so it can be tried. |

That's why **"I don't know" is a fine answer** while charting. A fact you don't know becomes a research ticket, or the agent looks it up: the grilling Skill says finding facts is the agent's job, never yours. An answer that belongs to someone else, like the studio owner's refund rules, becomes a task. You collect it with a [to-questionnaire](/learn/to-questionnaire), as [Answers only other people have](/learn/answers-from-other-people) shows; wayfinder itself sends nothing. A question that's still too vague goes into the fog.

```callout remember
A ticket's type decides how it gets settled and whether you're needed: research runs without you, grilling and prototypes need you, and a task does work that must happen before a decision. So "I don't know" is fine: an unknown fact becomes the agent's job, someone else's answer becomes a task, and a vague question goes into the fog.
```

```checkpoint check-9
While charting, the agent asks you a question of fact, and you don't know the answer. What do you say?
- [ ] Your best guess, so that nothing is left blank
- [x] That you don't know, so the agent finds out
- [ ] Nothing, until you've looked it up yourself
- [ ] Ask it to drop the question from the map
Why: Finding facts is the agent's job, never yours. A fact you don't know becomes the agent's job, or a research ticket, which is why "I don't know" is a fine answer while charting.
```

```checkpoint check-10
You'll be away all day while the agent works through the map. Which two ticket types can't be settled without you?
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
- [ ] It starts from a rough draft
- [x] It does work rather than deciding
Why: A task is "the one type that _does_ rather than decides": work that must happen before a decision, such as signing up for a service so it can be tried. An interview is grilling, a rough draft is a prototype, and a task only sometimes needs you.
```

## So where do the ADRs come from?

From the same place as before. Every grilling ticket runs the two Skills that `/grill-with-docs` runs, [grilling](/learn/grilling) and [domain-modeling](/learn/domain-modeling), so the paper trail still gets written, one question at a time.

- When a word gets pinned down, it goes into the project's `GLOSSARY.md`, its agreed dictionary, straight away.
- An **ADR** (architecture decision record: one big decision, written down) is rare. You're offered one only when a decision is hard to reverse, surprising without context, and the result of a real trade-off.
- **Every** decision, ADR or not, is written in its ticket's answer. The map only links to it.

|  | /grill-with-docs | /wayfinder |
|---|---|---|
| Fits | A plan you can hold in one session | A plan too big for one session |
| Sessions | One | One to chart, then one per ticket |
| Decisions live in | The conversation, plus glossary and ADRs | Ticket answers, plus glossary and ADRs |
| Next step | `/to-spec` in the same session | `/to-spec` once the map is clear |

```callout remember
Every grilling ticket runs the same two Skills as `/grill-with-docs`, so pinned-down words go into `GLOSSARY.md` straight away, and an ADR is offered only for a big, hard-to-undo decision. Every decision, ADR or not, is written in its ticket's answer.
```

```checkpoint check-12
Why does a wayfinder grilling ticket still update `GLOSSARY.md` and offer ADRs, as `/grill-with-docs` does?
- [ ] Wayfinder copies the chat into files
- [x] It runs the same two Skills
- [ ] The map writes one ADR per ticket
- [ ] Research tickets write the ADRs later
Why: `/grill-with-docs` is two Skills, grilling and domain-modeling, and every wayfinder grilling ticket runs the same two. So the paper trail still gets written, one question at a time.
```

```checkpoint check-13
A grilling ticket settles the order of the links in the site's footer, which you could change in a minute. Will you be offered an ADR?
- [ ] Yes, every grilling decision gets one
- [ ] Yes, once the map links to it
- [ ] No, ADRs only come from research
- [x] No, because it's easy to undo
Why: An ADR is offered only for a big decision: hard to reverse, surprising without context, and the result of a real trade-off. The small choice is still written down, in its ticket's answer.
```

```checkpoint check-14
During a grilling ticket, you and the agent pin down what "drop-in class" means. When is that meaning written down?
- [x] Straight away, in the glossary
- [ ] Later on, in the Spec
- [ ] Only if it earns an ADR
- [ ] Once the whole map is clear
Why: When a word gets pinned down, it goes into the project's `GLOSSARY.md` straight away. It doesn't wait for an ADR, the end of the map, or the Spec.
```

## Try it: your first session

````try
You'll need the `yoga-studio` practice project, with Matt's Skills set up and GitHub as its tracker. If you haven't set it up, do the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first. You'll also need wayfinder's five labels, from the Try it in [wayfinder](/learn/wayfinder).

1. In the `yoga-studio` folder, bring `main` up to date, so the map starts from the latest work:

```sh
git switch main && git pull
```

2. Start Claude Code: `claude`.
3. Start with a grilling, as Matt advises. Type this:

```text
/grill-with-docs Rebuild how the studio takes bookings and money: class passes, monthly memberships, card payments, refunds and a waitlist for full classes. Today an old booking tool takes the bookings, members pay cash at the front desk, and a spreadsheet tracks who has paid.
```

4. Answer until the questions spread past what one session can hold.
5. Type `/wayfinder let's turn this into a map`. You should see it ask for the destination.
6. Name the end of the whole map, not of this session. If you're unsure, use: _every open question is settled or ruled out of scope, so the rebuild can be specced_.
7. Answer its wide questions. Expect it to ask whether everything belongs on one map: the waitlist, say, could be its own smaller effort. "I don't know" is a fine answer.
8. When charting stops, in a second terminal in the `yoga-studio` folder, run `gh issue list --label wayfinder:map`. You should see your map.
9. In that terminal, run `gh issue view <number> --web`, with the map's number. You should see its Destination, and its tickets as sub-issues.
10. Type `/clear` before your first working session.

Research tickets save their findings on a throwaway `research/<name>` branch and push it to GitHub. That's expected: those branches are never merged into `main`. If charting stops with no map, it found no fog, so the idea fits one session.
````

Matt's 15-minute [wayfinder walkthrough](https://www.youtube.com/watch?v=F3lL98Pj90o) shows a real map: how maps work at 2:10, and ticket types and blocking at 7:40.

## Practice

### Sort the tickets

Pick the type for each question about the rebuild. You'll see why straight away.

```checkpoint sort-sign-up
Sign up for test accounts with two payment services, so their checkouts can be tried.
- [ ] Research
- [ ] Grilling
- [ ] Prototype
- [x] Task
Why: Nothing to decide yet: it's work that has to happen before the payment decision can be judged. Signing up for a service is the Skill's own example of a task.
```

```checkpoint sort-pause-membership
Which payment services let a member pause a monthly membership?
- [x] Research
- [ ] Grilling
- [ ] Prototype
- [ ] Task
Why: A fact the agent can find on its own, in each service's documentation, so it runs in the background.
```

```checkpoint sort-old-tool
Should the old booking tool stay on for the teachers' timetables, or go entirely?
- [ ] Research
- [x] Grilling
- [ ] Prototype
- [ ] Task
Why: A decision with real trade-offs that only you can make: teachers know the old tool's screens, but keeping it means two systems. It also waits on which payment service takes the studio's payments.
```

```checkpoint sort-timetable-look
What should the class timetable look like on a phone?
- [ ] Research
- [ ] Grilling
- [x] Prototype
- [ ] Task
Why: "How should it look?" is easier to answer by reacting to rough drafts than by describing it, so the agent makes some for you to react to.
```

```checkpoint sort-monthly-fee
Who will pay the payment service's monthly fee after launch?
- [ ] Research
- [ ] Grilling
- [ ] Prototype
- [x] Task
Why: Neither you nor the agent can answer it: it belongs to the studio owner. Getting that answer is work that unblocks a decision, so it's a task, and you send a questionnaire.
```

```checkpoint sort-pay-what-you-can
Which payment services can take pay-what-you-can prices for community classes?
- [x] Research
- [ ] Grilling
- [ ] Prototype
- [ ] Task
Why: Another fact: the agent reads the services' documentation and writes up what it found.
```

```checkpoint sort-pass-or-membership
Is a class pass its own kind of thing, or a membership with a fixed number of classes?
- [ ] Research
- [x] Grilling
- [ ] Prototype
- [ ] Task
Why: A decision about structure and about words. In a grilling ticket, domain-modeling writes the agreed meaning of "class pass" into the project's `GLOSSARY.md`.
```

## Remember

```flashcards
Q: When does a plan need wayfinder rather than one grilling?
A: When it won't fit in one conversation, often because many answers don't exist yet. Wayfinder writes each open question down as a ticket and settles one per session.

Q: What are the five parts of a map's body?
A: Destination, Notes, Decisions so far, Not yet specified (the fog) and Out of scope.

Q: When is a ticket unblocked?
A: When every ticket blocking it is closed.

Q: Fog or ticket: what's the test?
A: Whether you can state the question precisely now, not whether you can answer it now.

Q: What does the charting session settle?
A: Nothing. It names the destination, writes the map and the tickets it can phrase, starts the research tickets, and stops.

Q: Which ticket does a working session take?
A: The one you name, or else the first open ticket that isn't blocked or claimed. It claims it, settles it, records it and stops.

Q: Which ticket types need you there?
A: Grilling and prototype. Research runs without you, and a task only sometimes needs you.

Q: Where does a wayfinder decision get written down?
A: In its ticket's answer, with one line on the map linking to it. Words go into `GLOSSARY.md` straight away, and an ADR only for a decision that's hard to reverse, surprising and a real trade-off.

Q: Where should a medium-large change start, by Matt's advice?
A: With a `/grill-with-docs` session. If planning gets out of hand, say `/wayfinder let's turn this into a map`.
```

## Final test

```final-test what-charting-leaves
Your first wayfinder session has ended. What has it left on your tracker?
- [ ] A Spec that is ready to build
- [ ] One ADR for each decision it made
- [x] A map, plus one ticket per question
- [ ] Nothing until the last ticket is done
Why: Charting writes the map and one ticket for each question it can already phrase, starts the research tickets, and stops. It settles nothing itself.
```

```final-test working-session-does
You start a normal session with `/wayfinder` and the map's number. What does it do?
- [x] Settles one ticket, then it stops
- [ ] Settles every open ticket in turn
- [ ] Writes the Spec, then the Tickets
- [ ] Builds the code for one ticket
Why: One ticket per session. Research tickets are the only exception, since several can run at once in the background.
```

```final-test between-tickets
You've settled a ticket. What do you type before starting the next one?
- [ ] `/compact`, so the agent remembers more
- [ ] `/handoff`, to write a summary file
- [ ] `/resume`, to reload the last session
- [x] `/clear`, since the tracker holds everything
Why: The answer is saved in the ticket and the map, so the old conversation can go. `/handoff` is for moving work to a different tool, folder or person.
```

```final-test where-decisions-live
Where does a wayfinder decision get written down?
- [ ] In a brand new ADR, every single time
- [x] In its ticket, and the map links to it
- [ ] Only in the chat, so keep the session open
- [ ] In the Spec for that same feature
Why: The answer goes in its ticket, and the map's Decisions so far gets one line linking to it. An ADR is an extra, offered only for big, hard-to-undo decisions.
```

```final-test map-is-clear
The map has no open tickets left. What comes next?
- [ ] `/implement`, starting at the first ticket
- [ ] `/to-tickets`, straight from the map
- [x] `/to-spec`, pointed at the map
- [ ] `/grill-with-docs`, to write the ADRs
Why: Wayfinder plans; it doesn't build. `/to-spec` collapses the map's settled decisions into a buildable Spec, then `/to-tickets` cuts it into Tickets for `/implement`. Skipping `/to-spec` throws away the detail in the tickets.
```

```final-test sort-what-services-charge
While charting, this comes up: find out what each payment service charges per payment. Where does it go?
- [x] A research ticket
- [ ] A grilling ticket
- [ ] A task ticket
- [ ] The Out of scope part
Why: A fact the agent can find on its own by reading, so it runs in the background without you. Signing up for the services so they can be tried would be a task: work, not reading.
```

```final-test sort-which-service
Both blockers of "Which payment service will take the studio's payments?" are now closed. What type of ticket is it?
- [ ] A research ticket
- [x] A grilling ticket
- [ ] A task ticket
- [ ] A prototype ticket
Why: A decision with real trade-offs that is yours to make, settled in an interview with you. Its blockers, what the services charge and who handles refunds, were why it had to wait.
```

```final-test small-decision-where
A grilling ticket settles that the timetable lists classes by start time. It's easy to change later and surprises nobody. Where is the decision written down?
- [ ] A new ADR, since a grilling settled it
- [ ] The glossary, beside the word "class"
- [ ] Only the chat, since it isn't ADR-worthy
- [x] Its ticket's answer, gisted on the map
Why: Every decision, ADR or not, goes in its ticket's answer, and the map gets one line linking to it. An ADR needs all three tests (hard to reverse, surprising, a real trade-off), and the glossary holds words, not decisions.
```


```sources
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [/wayfinder: Nothing is too big to plan anymore](https://www.youtube.com/watch?v=F3lL98Pj90o), Matt Pocock, 2026-07-30
- [The /wayfinder Skill](https://www.aihero.dev/skills-wayfinder), Matt Pocock, updated 2026-08-24
- [Should you /grill-with-docs, /wayfinder, or just one shot the code?](https://x.com/mattpocockuk/status/2108216899439894574), Matt Pocock, 2026-10-08
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
- [domain-modeling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), Matt Pocock, updated 2026-08-24
```
