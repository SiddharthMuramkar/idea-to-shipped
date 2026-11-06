---
title: to-tickets: cut a Spec into small Tickets
slug: to-tickets
summary: How to-tickets splits a Spec into small Tickets that each work end to end, with links that say which Tickets must finish first.
---

## What it's for

Say your "Booking API" [Spec](/learn/issues-and-keeping-track) is published, and it's too big for one session. You need pieces a fresh agent can finish alone, in an order that works.

**to-tickets splits a Spec into small [Tickets](/learn/issues-and-keeping-track) that each work end to end, and each names what must finish first.**

Each Ticket is the [tracer bullet](/learn/small-end-to-end-tickets) you've already met: a narrow but complete path through every layer of the change (tables, API, UI, tests). You can show it working, or check it, on its own, and it fits in one fresh [context window](/learn/context-window).

```checkpoint quick-1
You're splitting the Booking API Spec. Which of these would make a good Ticket?
- [x] One table, one endpoint and a test, which you can demo on its own.
- [ ] Every table the Spec needs, with the endpoints to come in later Tickets.
- [ ] All the tests the Spec needs, with the code to come in later Tickets.
Why: A Ticket is a narrow but complete path through every layer. Every table, or every test, is one layer on its own, so there's nothing to demo yet.
```

Its blocking edges are the other Tickets that must be done before it can start.

```checkpoint quick-2
Ticket #13 lists Ticket #12 as a blocking edge. What does that mean?
- [x] #12 must be done before #13 can start.
- [ ] #13 must be done before #12 can start.
- [ ] #12 and #13 must be built in one session.
Why: A Ticket's blocking edges are the other Tickets that must be done before it can start. So #13 waits for #12.
```

For example, you type `/to-tickets`, and the agent shows a numbered list:

```text
1. List bookings
   Blocked by: none
   Delivers: GET /bookings reads a new bookings table, with a test
2. Create a booking
   Blocked by: 1
   Delivers: POST /bookings saves a booking, with a test
```

You approve, and they become Ticket #12 and Ticket #13, with #13 blocked by #12.

## When to use it

- You've written a Spec with [to-spec](/learn/to-spec). Run to-tickets in the same session, before you clear the context window.
- You have a Spec from an earlier session. Pass its Issue number, like `/to-tickets #11`.

```checkpoint quick-3
You've written a Spec with to-spec, and you want it split. When do you run to-tickets?
- [x] In the same session, before you clear the context window.
- [ ] In a new session, so that it starts with a clear context window.
- [ ] After building the first Ticket, once you know how big a slice is.
Why: Run to-tickets in the same session as to-spec, before you clear the context window.
```

## When not to use it

- If an Issue came from someone else, use [triage](/learn/triage) instead, because triage is for incoming work. Tickets from to-tickets skip it: they already carry `ready-for-agent`.
- If you want code built, use [implement](/learn/implement) or [implement-spec](/learn/implement-spec) instead, because to-tickets builds nothing.

```checkpoint quick-4
Your Tickets are published, and you want them built. What do you run?
- [x] implement or implement-spec, since to-tickets builds nothing.
- [ ] to-tickets again, since it builds in the order blockers allow.
- [ ] triage, since it picks the next ready Ticket and then builds it.
Why: to-tickets stops once the Tickets exist. Building them is the job of implement or implement-spec.
```

## What it needs to start

- A Spec, a plan or a conversation to split.
- The [Issue tracker](/learn/issues-and-keeping-track) and labels, set up by [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills).

Only you can start it, by typing `/to-tickets`.

```checkpoint quick-5
You finish writing a Spec and say nothing more. Will the agent split it into Tickets?
- [x] No. Only you can start to-tickets, by typing its command.
- [ ] Yes. The agent starts to-tickets as soon as a Spec is published.
- [ ] Yes, as long as the Spec's Issue has the `ready-for-agent` label.
Why: Only you can start to-tickets, by typing `/to-tickets`. The agent won't start it on its own.
```

Before publishing, it asks whether the size feels right and the blocking edges are correct, and keeps adjusting until you approve.

```checkpoint quick-6
The agent has shown you its numbered list of Tickets. What does it ask you?
- [x] Whether the size feels right and the blocking edges are correct.
- [ ] Which one of the Tickets you would like it to go and build first.
- [ ] Whether the Spec should be closed now that its Tickets exist.
Why: Before publishing, it asks whether the size feels right and the blocking edges are correct, and it keeps adjusting until you approve.
```

## What it creates

On GitHub, it publishes one Issue per Ticket, blockers first, each labelled `ready-for-agent`. Ones with blockers get GitHub's built-in "blocked by" links and a Blocked icon. When it splits a Spec's Issue, each Ticket becomes a sub-issue of it. It never closes or changes the Spec.

```checkpoint quick-7
to-tickets splits your Spec's Issue on GitHub. How is each Ticket tied to the Spec?
- [x] Each Ticket becomes a sub-issue of the Spec's Issue.
- [ ] Each Ticket becomes a checklist line in the Spec's body.
- [ ] Each Ticket copies the Spec's whole text into its body.
Why: Each Ticket becomes a sub-issue of the Spec's Issue, and the Spec itself is never closed or changed.
```

A local tracker gets one file per Ticket under `.scratch/<feature-slug>/issues/`, where a **slug** is a short name made from a topic, used in file names.

Any Ticket whose blockers are all done is on the frontier, ready to start: here, only #12.

```checkpoint quick-8
Ticket #12 is closed, and it was the only blocker on Ticket #13. Can #13 start now?
- [x] Yes. All its blockers are done, so it's on the frontier.
- [ ] No. It stays blocked until you remove the link by hand.
- [ ] No. It has to wait until the Spec's Issue is closed too.
Why: Any Ticket whose blockers are all done is on the frontier, ready to start. Once #12 is closed, that includes #13.
```

```diagram
type: tree
caption: "one Issue per Ticket, blockers first"
root:
  label: "Booking API"
  note: "It never closes or changes the Spec."
nodes:
  - label: "Ticket #12"
    note: "List bookings"
    state: frontier
  - label: "Ticket #13"
    note: "Create a booking"
links:
  - from: "Ticket #13"
    to: "Ticket #12"
    label: "blocked by"
```

One exception to slicing: a [wide refactor](/learn/small-end-to-end-tickets), like renaming a column used everywhere. It follows **expand–contract**: add the new form beside the old, move the callers (the code that uses it) over in batches, then delete the old form. If even the batches can't pass their checks alone, they share one branch, and a final Ticket checks it all.

```checkpoint quick-9
You're renaming a column used everywhere. How do you split that work into Tickets?
- [x] Add the new form, move the callers over in batches, delete the old.
- [ ] One Ticket per layer, from the table change through to the UI change.
- [ ] One big Ticket that renames the column and every caller in one go.
Why: That's a wide refactor, and it follows expand–contract. The new form sits beside the old while the callers move over, and the old form goes last.
```

## Going deeper

### Why it exists

Left alone, an agent tends to build everything at once. Matt Pocock, who wrote the Skill, describes one "building entire layers in isolation, without ever testing whether the critical path actually works." Then you get a huge mess to clean up.

The second problem is size. When a build spans several sessions, each Ticket is picked up by a session that has never seen your Spec. That's why a Ticket has to fit in one fresh context window.

```checkpoint quick-10
Why must a Ticket fit in one fresh context window?
- [x] The session that picks it up has never seen your Spec.
- [ ] A Ticket has to fit in one PR that's quick to review.
- [ ] The whole Spec gets copied into the body of each Ticket.
Why: Each Ticket is picked up by a session that has never seen your Spec. That session starts fresh, so the Ticket has to fit in one fresh context window.
```

So to-tickets cuts for both. Every Ticket goes through every layer, so you can check it when it lands. Each is small enough for a fresh session to finish without you in the room.

### How it works underneath

**The tracer bullet is an old idea.** Matt credits it to _The Pragmatic Programmer_, by Andy Hunt and Dave Thomas. Hunt describes an app's first version as "one thin line of execution" from the UI to a database. You then add one feature at a time, each another thin line, and adjust your aim from what you learn.

```checkpoint quick-11
You've built the first thin line from the UI to a database. What comes next?
- [x] More features, one at a time, each another thin line.
- [ ] Each whole layer in turn, starting with the database.
- [ ] A rebuild from scratch, now that the first line has run.
Why: After the first thin line, you add one feature at a time, each another thin line, and adjust your aim from what you learn.
```

**Why layers fail with agents.** A horizontal Ticket ships one layer, so nothing works until every layer has landed. Its acceptance criteria, the checks that decide whether the work is done, have to reach into work another Ticket owns. A vertical Ticket ships one thin path through every layer, so it can be checked alone. It "owns everything it grades".

```checkpoint quick-12
Why can a vertical Ticket be checked alone, when a horizontal one can't?
- [x] It ships one path through every layer, so it owns all it grades.
- [ ] It touches one layer only, so its changes stay small and easy to read.
- [ ] Its criteria reach into other Tickets' work, so it gets checked twice.
Why: A horizontal Ticket ships one layer, so its acceptance criteria reach into work another Ticket owns. A vertical Ticket ships a path through every layer, so it owns everything it grades.
```

```diagram
type: compare
caption: "A horizontal Ticket ships one layer"
columns: ["A horizontal Ticket", "A vertical Ticket"]
rows:
  - label: "ships"
    cells: ["one layer", "one thin path through every layer"]
  - label: "can be checked alone"
    cells: ["no", "yes"]
```

**The blocking edges are the real output.** Matt says so outright: "The edges are the point of the artifact." They tell you which Tickets can start now.

**What a published Ticket looks like.** Say Ticket #13's Issue reads like this:

```markdown
## Parent

#11

## What to build

A member books a class, and the booking then shows in the list.

## Acceptance criteria

- [ ] POST /bookings saves a booking
- [ ] GET /bookings returns the new booking
```

It names its Spec as the parent, and describes behaviour, not layers. It has no `## Blocked by` part, because that's left out when the link is built in. It names no file paths, because they go stale fast.

```checkpoint quick-13
Ticket #13's blocker is set as a built-in link. What does its body say about #12?
- [x] Nothing. The `## Blocked by` part is left out when the link is built in.
- [ ] It adds a `## Blocked by` part, so that GitHub can build the link from it.
- [ ] It adds the file paths of #12's work, so that the agent can find them.
Why: The `## Blocked by` part is left out when the link is built in. File paths stay out too, because they go stale fast.
```

**A tracer bullet isn't a prototype here.** You may read otherwise: one of Matt's articles says tracer bullets are what [prototype](/learn/prototype) automates, "answer questions with throwaway code." But a Ticket is a complete path you can demo on its own, while a prototype's code stays out of `main`.

**A wide refactor gets its own shape.** One edit breaks thousands of places at once, so no vertical slice can pass alone. The first Ticket adds the new form beside the old. Each batch of callers then gets its own Ticket, blocked by the first. CI stays green, because the old form still exists. The last Ticket deletes the old form, blocked by every batch.

```checkpoint quick-14
Why does CI stay green while a wide refactor's batches land one by one?
- [x] The old form still exists, so callers not yet moved still work.
- [ ] CI runs only on the last Ticket, so the batches in between go unchecked.
- [ ] Each batch moves every caller at once, so nothing can break.
Why: The first Ticket adds the new form beside the old, and the old form stays until the last Ticket. So CI stays green from batch to batch.
```

```diagram
type: chain
caption: "A wide refactor gets its own shape."
steps:
  - "adds the new form beside the old"
  - label: "Each batch of callers then gets its own Ticket"
    note: "blocked by the first"
  - label: "deletes the old form"
    note: "blocked by every batch"
```

### A real example

In a July 2026 tutorial, Matt ran to-spec, then to-tickets in the same session. It proposed three Tickets. Matt thought that was too many: "I actually think it can be done in one slice." He asked for one, and got one.

```checkpoint quick-15
to-tickets proposes three Tickets, but you think one would do. What do you do?
- [x] Say so and ask for one, the way Matt did. It gives you one.
- [ ] Approve all three, then merge two of them by hand afterwards.
- [ ] Clear the session and run to-tickets again for a fresh split.
Why: Matt thought three was too many, so he asked for one slice in the same session, and he got one.
```

He then opened a real Spec he'd built days before, with 11 sub-issues under it. Each was one context window session. The one he opened was short, because most of its acceptance criteria were already in the Spec.

So the numbered list is the place to push back, and a good Ticket can be short.

One detail is out of date: the Ticket went into one `tickets.md`. Matt later called that file a bug, and parallel agents clashed writing to it. Today's Skill writes one file per Ticket under `.scratch/<feature-slug>/issues/`.

### Where it goes wrong

**It proposes twelve Tickets for a three-line change.** Over-decomposition, splitting work into too many pieces, is "the most reported problem with this skill". The model defaults to tiny units. Fix it at the numbered list: ask it to merge Tickets, and it will. If the whole change fits in one context window, skip this Skill and go straight to implement.

```checkpoint quick-16
to-tickets proposes more Tickets than the work needs, but it's still too big for one session. What do you do?
- [x] At the numbered list, ask it to merge Tickets.
- [ ] Publish them all, then delete the extra Issues.
- [ ] Cap the number of Tickets in the Skill's template.
Why: The fix comes at the numbered list. Ask it to merge Tickets, and it will.
```

**The Tickets come out one per layer.** The Skill still does this sometimes. One team's 26 Tickets took about 20 agent runs per closed Ticket, roughly three quarters of them rework. They first blamed the Skill's Ticket template. After re-reading the Skill, the reporter wrote: "It's our misuse, and the rule we broke is already in your skill."

Their Tickets were the layers of one system, and none delivered anything you could see alone. So their criteria could only reach into other Tickets' work, and three Tickets blocked each other in a loop. The fix is one question per Ticket at the numbered list: "what can I demo when this is done? A ticket with no answer is a horizontal slice."

**"Blocked by" shows up as text in the Issue's body.** One agent wrote `Blocked by: #346` that way, then claimed `gh issue create` has no `--blocked-by` flag. It does: `gh issue create --blocked-by 12,15`. The Skill publishes blockers first, so their numbers always exist by then. Text is only the fallback for trackers with no built-in link. To repair a Ticket by hand, run `gh issue edit 13 --add-blocked-by 12`.

```checkpoint quick-17
On GitHub, why can to-tickets always give a new Ticket a native blocking link?
- [x] It publishes blockers first, so their Issue numbers already exist.
- [ ] It writes the blockers as text, and gh turns that text into links.
- [ ] It creates every Ticket at once, then adds the links in a second go.
Why: `gh issue create` takes `--blocked-by`, and the Skill publishes blockers first. So a blocker's number already exists when the Ticket it blocks is created.
```

**The Tickets aren't sub-issues of the Spec.** Your `docs/agents/issue-tracker.md` is probably old. Re-run [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) to refresh it, and use `gh` 2.94 or later.

**It keeps cutting off while reading your Spec.** You cleared or compacted between the two steps, so the agent has to fetch the Spec back. A very large one can come back cut short. Run both in the same context window.

**The Tickets sit there after they're published.** The Skill stops at the Tickets, and nothing starts them for you. Count the Tickets with no open blockers, and open that many agent sessions, each with a fresh context and its own [worktree](/learn/branches-and-worktrees). [implement](/learn/implement) stops at the commit and never closes the Ticket. So close it yourself, or merge a pull request that closes it.

### Try it

Split the Spec from [to-spec](/learn/to-spec)'s Try it into Tickets. You'll need:

- your practice project (if you haven't set it up, do the Try it step in [Issues: keeping track of work](/learn/issues-and-keeping-track) first);
- the session where you ran `/to-spec`, not yet cleared, or the Spec's number for `/to-tickets #N`.

Then:

1. Type `/to-tickets`. You should see a numbered list of Tickets.
2. For each Ticket, ask yourself: "what can I demo when this is done?"
3. If a Ticket has no answer, tell the agent and ask it to recut the list.
4. Approve the list. You should see the agent publish the Issues, blockers first.
5. Open the Spec's Issue on GitHub. You should see the new Tickets as its sub-issues.
6. Open the repo's Issues page. You should see `ready-for-agent` on each Ticket, and a "Blocked" icon on blocked ones.
7. Remove the Spec's label, so no agent builds it whole: `gh issue edit <number> --remove-label ready-for-agent`. You should see the label gone.

### Read more

- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, updated 2026-08-24
- [Tracer Bullets: Keeping AI Slop Under Control](https://www.aihero.dev/tracer-bullets), Matt Pocock, 2026-01-22
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock (video), 2026-07-16
- [Tracer Bullets and Prototypes: A Conversation with Andy Hunt and Dave Thomas, Part VIII](https://www.artima.com/articles/tracer-bullets-and-prototypes), Bill Venners, 2003-04-21
- [to-tickets: acceptance criteria have no falsifiability guidance (#595)](https://github.com/mattpocock/skills/issues/595), david-seu, 2026-07-16
- [to-tickets didn't create blocking relationships between GitHub issues (#513)](https://github.com/mattpocock/skills/issues/513), ctrom, 2026-07-10

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint to-tickets-deeper-twelve-tickets
You ran to-tickets on a tiny Spec: return a clearer error when a class is full. It proposes twelve Tickets for what is about three lines of change in your FastAPI backend, and the whole change would fit easily in one context window. What do you do?
- [x] Skip the Tickets and build the change in one session, test-first.
  > Right: that's `/implement`.
- [ ] Run each of the twelve Tickets through triage to check they're agent-ready.
  > That's `/triage`. Tickets from to-tickets are agent-ready already, and twelve Tickets for three lines is the problem itself.
- [ ] Hand all twelve Tickets to one orchestrated run with parallel agents.
  > That's `/implement-spec`. Running twelve needless Tickets in parallel keeps the over-splitting. A change this small needs no Tickets at all.
Why: Over-decomposition, splitting work into too many pieces, is the most reported problem with to-tickets. If the whole change fits in one context window, Tickets add nothing, so go straight to implement.
```

## Remember

```flashcards
Q: On a real Issue tracker, what does to-tickets create?
A: One Issue per Ticket, published blockers first, with native blocking links and the ready-for-agent label.

Q: What is a Ticket's blocking edge?
A: A link to another Ticket that must be done before this one can start.

Q: What is the frontier?
A: Every Ticket whose blockers are all done, so it's ready to start.

Q: How does to-tickets split a wide refactor, like renaming a column used everywhere?
A: Expand–contract. Add the new form beside the old, move the callers over in batches, then delete the old form.

Q: What question catches a horizontal Ticket when to-tickets shows you its list?
A: "What can I demo when this is done?" A Ticket with no answer is a horizontal slice.

Q: An agent wrote "Blocked by" as text in an Issue's body. What went wrong, and what's the fix?
A: It claimed `gh` had no `--blocked-by` flag, but it does. Blockers are published first, so their numbers already exist, and the Skill uses native links wherever the tracker has them.

Q: Where does the tracer-bullet idea come from, and what is it?
A: The Pragmatic Programmer, by Andy Hunt and Dave Thomas: one thin line of execution that goes end to end, grown one feature at a time.
```

## Final test

```final-test to-tickets-tracer-bullet
What makes a good Ticket from to-tickets?
- [x] A narrow slice through every layer that can be checked on its own.
- [ ] One whole layer done completely, such as every table change in the Spec.
- [ ] All the tests for the Spec, written before any of the code.
- [ ] A small change to one file or function, kept easy to review.
Why: A good Ticket is a tracer bullet: a narrow but complete path through every layer, so you can demo or check it once it's done. One whole layer can't do that, because nothing works until the other layers land.
```

```final-test to-tickets-approval
What does to-tickets do before it publishes the Tickets?
- [x] It shows you the breakdown and adjusts it until you approve.
- [ ] It publishes them straight away, then asks you to review them.
- [ ] It runs each Ticket through triage so each one is agent-ready.
Why: Nothing reaches the tracker until you approve. The agent asks about the Tickets' size and their blocking edges, then keeps adjusting, so the numbered list is your chance to push back.
```

```final-test to-tickets-parent
What does to-tickets do to the Spec it splits?
- [x] Nothing. It never closes or changes it.
- [ ] It closes it, since the Tickets now replace it.
- [ ] It relabels it needs-triage.
Why: The Skill's rule is never to close or change a parent Issue. The Tickets hang under the Spec as sub-issues, and the Spec itself stays as it was.
```

```final-test to-tickets-deeper-595-cause
A team's 26 Tickets took about 20 agent runs per closed Ticket, mostly rework. What did the reporter find was the cause?
- [x] They had cut the Tickets by layer, which the Skill's own rule already forbids.
- [ ] The Skill's template forced eight to nineteen criteria per Ticket, so most were untestable.
- [ ] Their agents ran in parallel and kept overwriting each other's changes.
- [ ] Each Ticket was published before its blockers, so the edges were missing.
Why: The reporter first blamed the template, then re-read the Skill: "It's our misuse, and the rule we broke is already in your skill." Their Tickets were the layers of one system, and no layer delivered anything you could see alone.
```

```final-test to-tickets-deeper-local-files
An older video shows to-tickets saving the Ticket in one `tickets.md`. What does the current Skill do with a local tracker?
- [x] It writes one file per Ticket under `.scratch/<feature-slug>/issues/`.
- [ ] It still writes one `tickets.md`, with every Ticket under its own heading.
- [ ] It refuses to run until a real tracker like GitHub has been set up.
Why: That one shared file was a bug, and it caused clashes when parallel agents wrote to it. So the current Skill writes one file per Ticket, "never a single combined file".
```

```final-test to-tickets-split-the-spec
A Spec for adding user accounts to your FastAPI backend has just been published, in this same session. It's far too big for one session, and you want it broken into slices that agents can pick up, each saying what must be done before it. Which fits best?
- [x] Split the Spec into thin end-to-end Tickets, each with its blockers.
  > Right: that's `/to-tickets`.
- [ ] Run the Spec through triage so the slices come out agent-ready.
  > That's `/triage`. Triage is for issues you didn't create. This Spec is yours, and slices made from it are agent-ready already.
- [ ] Start building the Spec in this session, while the context is fresh.
  > That's `/implement`. The Spec is too big for one session, so it needs splitting into Tickets first.
- [ ] Hand the whole Spec to one orchestrated run with parallel agents.
  > That's `/implement-spec`. That run starts from a Spec that already has its Tickets; this one has none yet.
Why: A Spec too big for one session has to be split before anyone builds it. Thin end-to-end Tickets each fit one fresh context window, and their blocking edges say what must finish first. So an agent can pick up any Ticket that's ready.
```

```final-test to-tickets-dont-triage-them
You've just published six Tickets for moving your website into Docker. Each has its blocking links and the ready-for-agent label, and two have no blockers. What comes next?
- [x] Build one of the unblocked Tickets in a fresh context window.
  > Right: that's `/implement`.
- [ ] Run each new Ticket through triage to confirm it's agent-ready.
  > That's `/triage`. Tickets made by splitting a Spec are agent-ready from the start. Triage is for issues you didn't create.
- [ ] Split the Tickets again, so each fits one context window.
  > That's `/to-tickets`. You already approved this breakdown before it was published.
Why: These Tickets are already agent-ready, so nothing is left to sort. Start from the frontier, the Tickets whose blockers are done. Each Ticket stands alone, so the last one's context window can go.
```

```final-test to-tickets-why-vertical
An agent proposes Tickets for a new SQL-backed reports feature. Ticket 1: every table change. Ticket 2: every API endpoint. Ticket 3: all the UI. Ticket 4: all the tests. Why should you push back?
- [x] Each Ticket should cross every layer, so each can be checked on its own.
- [ ] Four Tickets is too few; a feature of this size needs at least eight of them.
  > Nothing sets a number of Tickets. The problem is the shape of each one.
- [ ] The tests should be written first, so Ticket 4 should come first.
  > The order of the layers isn't the problem. With layer-by-layer Tickets, nothing works until all four are done.
Why: These Tickets are horizontal slices, one layer each, so there's nothing to demo until all four are done. A tracer-bullet Ticket goes through the tables, API, UI and tests together, so it works end to end, and can be checked, the moment it's done.
```

```final-test to-tickets-wide-refactor
You're splitting a Spec for your FastAPI backend that changes a shared `booking_id` from an integer to a UUID everywhere. You've laid out expand, then migrate in batches, then contract. But the agent finds no batch can pass the tests on its own: each goes green only once the others have landed too. How should the Tickets go now, and why?
- [x] Keep the order, but land the batches on one shared branch, checked at the end.
- [ ] Drop expand–contract and do the whole change as one large Ticket instead.
  > The sequence still holds. Only the promise of green moves, to one final Ticket that integrates and checks everything.
- [ ] Merge each batch into main as it's done, and let CI stay red until the last one.
  > The batches that can't stay green share an integration branch, not main. Green is promised only at the final Ticket.
- [ ] Split it by feature instead, with each slice going through every layer.
  > A wide refactor is the exception to vertical slicing. One change breaks every call site at once, so no feature slice can land green.
Why: The expand–contract order still holds, but no batch can pass alone, so main can't take them one by one. Instead the batches share an integration branch (one branch they all land on), and they all block a final Ticket that integrates and checks them. Green is promised only there.
```

```final-test to-tickets-deeper-sibling-criteria
An agent cut your class-booking Spec into Tickets by layer: tables, endpoints, page. Ticket 2's acceptance criteria can only pass once Ticket 3's page exists, and Tickets 2 and 3 each list the other as a blocker. Why did this happen?
- [x] A layer alone does nothing you can see, so its criteria reach into sibling Tickets.
- [ ] The Tickets had too few criteria; more checks per Ticket would have caught it.
  > More criteria don't fix it. Criteria reach into sibling Tickets because the slices are layers.
- [ ] GitHub's blocking links can't hold a loop, so the edges were written wrongly.
  > The loop comes from the layers needing each other ("layer A needs B, B needs A"), not from how the tracker stores edges.
- [ ] The Tickets were published out of order, so the blockers pointed at the wrong ones.
  > Publishing order only decides whether blockers have real numbers. It can't make one Ticket's criteria depend on another's work.
Why: A layer on its own does nothing a user can see, so its acceptance criteria can only grade work another Ticket owns. Layers can also end up needing each other, in a loop. A vertical slice owns everything it grades, which prevents most of this.
```

```sources
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock, 2026-08-24
- [/implement should use git worktrees to isolate parallel sessions · Issue #429 · mattpocock/skills](https://github.com/mattpocock/skills/issues/429), rekart222, 2026-07-02
- [Tracer Bullets: Keeping AI Slop Under Control](https://www.aihero.dev/tracer-bullets), Matt Pocock, 2026-01-22
- [The /to-tickets Skill](https://www.aihero.dev/skills-to-tickets), Matt Pocock, 2026-08-24
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [Tracer Bullets and Prototypes: A Conversation with Andy Hunt and Dave Thomas, Part VIII](https://www.artima.com/articles/tracer-bullets-and-prototypes), Bill Venners, 2003-04-21
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
- [to-tickets: acceptance criteria have no falsifiability guidance (#595)](https://github.com/mattpocock/skills/issues/595), david-seu, 2026-07-16
- [to-tickets didn't create blocking relationships between GitHub issues (#513)](https://github.com/mattpocock/skills/issues/513), ctrom, 2026-07-10
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock, 2026-04-27 (page says "Updated Aug 24, 2026")
- [Creating issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies)
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
```
