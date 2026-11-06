---
title: Small Tickets that each work end to end
slug: small-end-to-end-tickets
summary: Cut a Spec into small Tickets that each run through every layer, so each one can be demoed on its own and fits one fresh context window.
---

## Tickets you can see working

Say your "Booking API" Spec, from [to-spec](/learn/to-spec), has two [Tickets](/learn/issues-and-keeping-track): #12 adds the bookings table, and #13 adds the endpoint (the web address your app calls) that creates a booking. When #12 is done, all you can show is a table nothing uses. If it's the wrong table, you only find out in #13.

**Split a Spec into small Tickets that each work end to end.**

Matt Pocock, who wrote the Skills of the [main flow](/learn/main-flow), calls such a Ticket a **tracer bullet**: a thin path through the whole system, end to end, that you can see working. The name comes from artillery, where a tracer round is a glowing bullet that shows where your shots land.

```checkpoint quick-1
Why call a Ticket like this a tracer bullet?
- [x] It's a thin path through the whole system that you can see working.
- [ ] It covers one whole layer of the system before the next layer starts.
- [ ] It's fired off in a batch, and you see the results only at the very end.
Why: A tracer bullet is a thin path through the whole system that you can see working, the way a tracer round shows where your shots land.
```

## Vertical, not horizontal

A **layer** is one level of the system: the database schema (its tables), the API (the addresses other code calls), the UI or the tests.

A **vertical slice**, as in [test first](/learn/test-first), cuts a narrow but complete path through every layer. A **horizontal slice** does one layer at a time. For example:

- Vertical: "A member can book a class", with its table, its endpoint, its page and its test.
- Horizontal: "Write every SQL migration", the scripts that change the tables. Nothing works end to end until several more Tickets land.

```checkpoint quick-2
A Ticket says "Write every SQL migration". What can you do when it's done?
- [x] Not much yet: nothing works end to end until more Tickets land.
- [ ] Watch a member book a class, because the whole path now works.
- [ ] Demo it by itself, because every migration touches the schema.
Why: That Ticket is horizontal, so it does one layer. Nothing works end to end until several more Tickets land.
```

Only the vertical kind can be shown working on its own. A finished one can be demoed (shown to someone) or checked. So ask of each Ticket: what can I demo when it's done?

```checkpoint quick-3
You want to show a finished Ticket working by itself. Which kind lets you?
- [x] A vertical slice, which can be shown working on its own.
- [ ] A horizontal slice, once every part of its one layer is done.
- [ ] Either kind, as long as all of its blockers are closed first.
Why: Only the vertical kind can be shown working on its own. That's why you ask of each Ticket what you can demo when it's done.
```

```diagram
type: compare
caption: "a narrow but complete path through every layer"
columns: ["A vertical slice", "A horizontal slice does one layer at a time"]
rows:
  - label: "the database schema"
    cells: ["its table", "every SQL migration"]
  - label: "the API"
    cells: ["its endpoint", ""]
  - label: "the UI"
    cells: ["its page", ""]
  - label: "the tests"
    cells: ["its test", ""]
footer: "Only the vertical kind can be shown working on its own."
```

## Small enough for one window

Size each slice to fit in a single fresh [context window](/learn/context-window), everything an agent can see at once. Each Ticket gets its own, with nothing left over from the last one.

```checkpoint quick-4
Why size a Ticket to fit in a single fresh context window?
- [x] So a fresh session, with nothing from the last Ticket, can finish it.
- [ ] So several Tickets can share one window and pass notes between them.
- [ ] So the agent can carry the last Ticket's context into the next one.
Why: Each Ticket gets its own fresh window, with nothing left over from the last. So the whole Ticket has to fit inside that one window.
```

## The order they go in

Start with any **prefactoring**: reshaping the code first, such as tidying a tangled function, so the change is easier. The saying behind it: "Make the change easy, then make the easy change."

Each Ticket also lists its **blocking edges**: links to the other Tickets that must finish before it can start. Re-cut the Booking API:

```text
#12 List bookings
#13 Create a booking (blocked by #12)
```

#13 saves to the table #12 adds, so #13 waits. #12 has no blockers, so it's on the frontier: you can start it now.

```checkpoint quick-5
#13 is blocked by #12, and #12 has no blockers. Which can you start right now?
- [x] #12, because no other Ticket has to finish before it.
- [ ] #13, because it's the Ticket with a listed blocker.
- [ ] Both, because each one is small enough to start.
Why: #13 waits for #12. #12 has no blockers, so it's on the frontier: you can start it now.
```

## The one exception

A **wide refactor** is one mechanical change, a repetitive edit needing no design decisions, that breaks code all over the codebase at once. Renaming a column is one. No vertical slice of it can pass on its own.

```checkpoint quick-6
You rename a column that's used all over the code. Why can't one vertical slice do it?
- [x] The rename breaks code everywhere at once, so no slice passes alone.
- [ ] The rename breaks nothing, so it needs no Ticket of its own at all.
- [ ] A rename is too small a change to count as a slice of its own.
Why: A wide refactor breaks code all over the codebase at once. So no vertical slice of it can pass on its own.
```

So take three steps. Add the new column beside the old, and copy the data. Move callers (code using the column) over in batches. Drop the old once nothing uses it.

## Where it shows up

You'll meet this again in [to-tickets](/learn/to-tickets), which writes Tickets this way.

```checkpoint quick-7
Which Skill writes Tickets as small, end-to-end slices?
- [x] to-tickets, before implement or implement-spec builds them.
- [ ] implement, which writes each Ticket just before it builds it.
- [ ] implement-spec, which writes the Tickets as it builds the Spec.
Why: to-tickets writes the Tickets this way. implement or implement-spec builds them afterwards.
```

## Going deeper

### Why it exists

Ask an agent for a whole feature, and it tries to produce all of it in one leap. Matt describes the result: it "keeps going, building entire layers in isolation, without ever testing whether the critical path actually works." The critical path is the main route through the feature.

His example: you ask for a database service with an API that connects to it. The agent writes every endpoint, the error handling, authentication, rate limiting and logging. Only then does it try the database. And then the connection string format is wrong, or a column has the wrong type, or the tests never touch the database.

```checkpoint quick-8
You ask an agent for a database service with an API. When does a wrong connection string show up?
- [x] Only at the end, after it has written everything else.
- [ ] At the start, because the agent tries the database first.
- [ ] Never, because its tests run before any code is written.
Why: The agent writes every endpoint, the error handling and the rest first. Only then does it try the database, and that's when the problem shows.
```

Matt borrows a name for this from the book _The Pragmatic Programmer_: "outrunning your headlights." The agent builds too much in the dark, with no feedback to catch a wrong guess.

Tickets cut by layer have the same problem: "Nothing works until every layer has landed". Each Ticket's acceptance criteria, the checks that decide whether the work is done, also reach into work that another Ticket owns.

So you build one small slice end to end, test it, get feedback, and move to the next slice in a fresh context window. Matt says this matters even more with agents than it did with people: "Context window constraints make the discipline non-negotiable."

### How it works underneath

The idea is older than agents. Matt credits the tracer bullet to _The Pragmatic Programmer_, by Andy Hunt and Dave Thomas.

In an interview, Thomas explains the name. Old artillery worked out its aim up front with a firing table, a lookup of angles. Then you fired and hoped the shell "landed somewhere close to your target."

Tracer rounds work the other way. You can see them as you fire, and they land where the real rounds land. So you adjust your aim as you go. Thomas says you use them when your target is moving, or you don't know all the factors.

```checkpoint quick-9
Your target keeps moving. What do tracer rounds give you?
- [x] You see where shots land, and adjust your aim as you go.
- [ ] A firing table that works out the exact angle before you shoot.
- [ ] A stronger round that lands close even when your aim is off.
Why: You can see tracer rounds as you fire, and they land where the real rounds land. So you adjust your aim as you go.
```

Hunt adds the other side. If you know all the requirements up front and they won't change, working it all out first is "probably the cheapest way to do it."

Thomas sums it up: "Basically, it all comes down to feedback. The more quickly you can get feedback, the less change you need to get back on target."

Hunt also describes the code version: a skeleton application, where "one thin line of execution goes end to end". You then add one feature at a time.

Alistair Cockburn has his own name for this idea: a **walking skeleton**. It's a tiny implementation of the system that performs a small end-to-end function. Its parts are incomplete, "but they are hooked together, and will stay hooked together from this point on."

```checkpoint quick-10
You build a walking skeleton. What's true of its parts?
- [x] They're incomplete, but hooked together, and they stay hooked together.
- [ ] They're complete, but each one is built and tested apart from the rest.
- [ ] They're joined up for one demo, then pulled apart before the real work.
Why: A walking skeleton is a tiny implementation of the system. Its parts are incomplete, but they're hooked together and stay that way.
```

A walking skeleton is different from a spike. A **spike** is a small experiment that answers one question: are we headed in the wrong direction? A spike is thrown away afterwards, since it was built with nonproduction coding habits. A walking skeleton is permanent code, built with production coding habits, and it's meant to grow with the system.

```diagram
type: compare
caption: "A walking skeleton is different from a spike."
columns: ["A walking skeleton", "A spike"]
rows:
  - label: "built with"
    cells: ["production coding habits", "nonproduction coding habits"]
  - label: "is"
    cells: ["permanent code", "thrown away"]
```

You may meet one other claim. Matt's Tracer Bullets article says "Tracer bullets are what /prototype automates". The Skill files decide what a Skill does. to-tickets breaks work into tracer bullet Tickets, each demoable or verifiable on its own. The [prototype](/learn/prototype) Skill makes throwaway code that answers a question. So when the two disagree, follow the Skill files: a tracer bullet is not a prototype.

```checkpoint quick-11
One source says tracer bullets are what prototype automates. Which view should you follow?
- [x] The Skill files, where a prototype is throwaway code.
- [ ] The article, because it overrides what the Skill files say.
- [ ] Neither, because the two words mean the same thing.
Why: The Skill files decide what a Skill does. A tracer bullet Ticket is demoable or verifiable on its own; the prototype Skill makes throwaway code that answers a question.
```

### A real example

Matt shows one from his own work. Issue #161 asked for a "Reveal in File System" feature for videos. The agent's breakdown made step 1 the tracer bullet: a backend endpoint, wired up to one location. Steps 2 to 4 added it to two menus and a dropdown.

Rather than build all four UI locations, Matt focused the agent on "one end-to-end slice: the backend endpoint connected to a single UI location." That let him check the core worked before expanding it out.

```checkpoint quick-12
A feature must appear in four UI locations. What does Matt's first slice build?
- [x] The backend endpoint, wired to one of the four UI locations.
- [ ] All four UI locations, with the backend endpoint left for later.
- [ ] The backend endpoint alone, with no UI location connected to it.
Why: Matt focused the agent on one end-to-end slice, the endpoint connected to a single UI location. That let him check the core worked before expanding it out.
```

### Where it goes wrong

**You get twelve Tickets for a three-line change.** Over-splitting is the most reported problem with to-tickets. Ask it to merge Tickets, and it will. If the whole change fits in one context window, skip to-tickets and go straight to [implement](/learn/implement).

```checkpoint quick-13
to-tickets gives you twelve Tickets for a three-line change. What do you do?
- [x] Ask it to merge Tickets, or skip it if the change fits one window.
- [ ] Approve all twelve, because more Tickets always make a change safer.
- [ ] Ask for more Tickets, because over-splitting has never been a problem.
Why: Over-splitting is the most reported problem with to-tickets. Ask it to merge Tickets, and it will. If the whole change fits in one context window, go straight to implement.
```

**Every Ticket is one layer, and rework piles up.** One team reported about 20 agent runs per closed Ticket across 26 Tickets, roughly three quarters of them rework. After re-reading to-tickets, the reporter wrote: "It's our misuse, and the rule we broke is already in your skill."

Each of their Tickets was one layer of the same system. So criteria graded work that other Tickets owned, and three Tickets blocked each other in a loop.

```checkpoint quick-14
A team cuts one Ticket per layer. What does that lead to?
- [x] Criteria grade other Tickets' work, and Tickets can block each other.
- [ ] Each Ticket can be demoed alone, so the criteria check nothing extra.
- [ ] Every Ticket finishes in one run, so there's no rework left to do.
Why: Each Ticket was one layer, so its criteria graded work that other Tickets owned. Three Tickets even blocked each other in a loop.
```

To catch this, read the numbered list to-tickets shows you before it publishes anything. Ask one question per Ticket: "what can I demo when this is done? A ticket with no answer is a horizontal slice."

**Every Ticket looks fine, but part of the feature belongs to nobody.** One report, drafted by an AI agent, shows a quieter version. A prep slice built half the code that turns stored data into a displayed value, and a UI slice assumed the rest would work. That path was "owned by neither", and the gap showed up one slice too late. The report's advice: title each user-facing Ticket by what the user does and sees, never by layer, and don't wave the list through.

### Try it

You'll need your practice project (the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) creates it), with `ci.yml`, `api/`, `web/` and Postgres running in Docker Compose. If any is missing, ask your agent to set it up first.

Build a walking skeleton before your Spec's first Ticket: `Hello World` in one cell of a new table, carried up through every layer to the screen.

Tickets #2 and #3 from that Try it are cut by layer; [implement](/learn/implement)'s Try it builds both.

1. Run this SQL in Postgres: `CREATE TABLE hello (message text); INSERT INTO hello VALUES ('Hello World');`
2. In `api/`, add a FastAPI endpoint, `GET /hello`, that reads that row and returns it.
3. In `web/`, make one page call `GET /hello` and show the answer.
4. In `api/`, add one test that calls `GET /hello` and expects `Hello World`.
5. Run the test: `docker compose exec api pytest`. You should see it pass.
6. Open the page. You should see `Hello World`, read from the database.
7. Ask your agent to add Postgres, with the `hello` table, to `ci.yml`.
8. Merge it all through a pull request. You should see the `test` check pass.
9. Write a title for your first booking Ticket, such as `List bookings`.
10. Under it, answer in one line: what can I demo when this is done? If you can't answer, cut the Ticket again.

### Read more

- [Tracer Bullets: Keeping AI Slop Under Control](https://www.aihero.dev/tracer-bullets), Matt Pocock, updated 2026-01-22
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, updated 2026-08-24
- [Tracer Bullets and Prototypes: A Conversation with Andy Hunt and Dave Thomas, Part VIII](https://www.artima.com/articles/tracer-bullets-and-prototypes), Bill Venners, 2003-04-21
- [Walking skeleton](https://web.archive.org/web/20140329201356/http://alistair.cockburn.us/Walking+skeleton), Alistair Cockburn, 1996-06-01 (archived 2014-03-29)
- [to-tickets: acceptance criteria have no falsifiability guidance (#595)](https://github.com/mattpocock/skills/issues/595), david-seu, 2026-07-16
- [to-tickets: vertical-slice rule has no completeness check, so layer-cut slices can leave a connecting path unowned (#310)](https://github.com/mattpocock/skills/issues/310), iKon85, 2026-06-07

## Remember

```flashcards
Q: What can you do with a finished vertical slice on its own?
A: Demo it or check that it works.

Q: What are a Ticket's blocking edges?
A: The other Tickets that must be done before it can start.

Q: In a set of Tickets, when does prefactoring happen?
A: First. Make the change easy, then make the easy change.

Q: What does Matt, borrowing from The Pragmatic Programmer, call an agent building whole layers before it gets any feedback?
A: Outrunning your headlights.

Q: What one question does Matt ask of each Ticket to catch a horizontal slice?
A: What can I demo when this is done? A Ticket with no answer is a horizontal slice.

Q: What is a walking skeleton, and who named it?
A: Alistair Cockburn's name for a tiny implementation of the system that performs a small end-to-end function.
```

## Final test

```final-test small-end-to-end-tickets-vertical
Which of these is a vertical slice for a FastAPI booking site?
- [x] A member can book a class, with its table, endpoint, page and test.
- [ ] Write every SQL migration the site will need.
- [ ] Build all the API endpoints now, and add the pages and tests later.
Why: It cuts one narrow path through every layer, so you can watch it work when it's done. The other two each do one layer, so nothing works end to end until more Tickets land.
```

```final-test small-end-to-end-tickets-size
How big should one Ticket be?
- [x] Small enough to fit in one fresh context window.
- [ ] One whole layer, such as every API endpoint the Spec needs.
- [ ] The whole Spec, so one session sees the full feature.
Why: A context window is everything an agent can see at once. Each Ticket gets a fresh one, with nothing left over from the last, so the whole Ticket has to fit inside it.
```

```final-test small-end-to-end-tickets-wide-refactor
You need to rename a database column that's used all over your Python backend. How should the Tickets go?
- [x] Add the new column, move callers over in batches, then drop the old.
- [ ] One Ticket that renames the column everywhere in a single change.
- [ ] Rename it in the first Ticket, then fix what breaks in later ones.
Why: The rename breaks code everywhere at once, so no vertical slice can pass alone. Adding the new column first, and copying the data, breaks nothing. Callers then move in batches, each batch its own Ticket, and the old column goes last.
```

```final-test small-end-to-end-tickets-deeper-feedback
When do Hunt and Thomas prefer tracer bullets to working everything out up front, and why?
- [x] If the target moves or you don't know all the factors: you see where shots land, and faster feedback means less change.
- [ ] Always, on every project: working everything out first is never the cheapest way, even when the requirements are fixed.
- [ ] When every requirement is known and won't change: the whole plan goes to the coders, who then need no feedback at all.
Why: When the target moves or the factors are unknown, you use tracers instead of working it all out up front. Tracers show where your shots land, and the sooner you see that, the less you have to change. If the requirements are known and won't change, working it all out first is probably cheapest.
```

```final-test small-end-to-end-tickets-deeper
How is a walking skeleton different from a spike?
- [x] The walking skeleton is permanent code that grows with the system; the spike is thrown away afterwards.
- [ ] The spike is permanent code that grows with the system; the walking skeleton is thrown away afterwards.
- [ ] Both are thrown away afterwards; the walking skeleton only proves the layers connect before real work starts.
Why: A walking skeleton is meant to stay, so it's built with production coding habits and grows with the system. A spike is a small experiment built with nonproduction habits, so it's thrown away afterwards.
```

```sources
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, 2026-08-24
- [Ticket | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/ticket), Matt Pocock
- [Tracer Bullets: Keeping AI Slop Under Control](https://www.aihero.dev/tracer-bullets), Matt Pocock, 2026-01-22
- [Tracer Bullets and Prototypes: A Conversation with Andy Hunt and Dave Thomas, Part VIII](https://www.artima.com/articles/tracer-bullets-and-prototypes), Bill Venners, 2003-04-21
- [Walking skeleton](https://web.archive.org/web/20140329201356/http://alistair.cockburn.us/Walking+skeleton), Alistair Cockburn, 1996-06-01
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
- [to-tickets: acceptance criteria have no falsifiability guidance (#595)](https://github.com/mattpocock/skills/issues/595), david-seu, 2026-07-16
- [to-tickets: vertical-slice rule has no completeness check, so layer-cut slices can leave a connecting path unowned (#310)](https://github.com/mattpocock/skills/issues/310), iKon85, 2026-06-07
```
