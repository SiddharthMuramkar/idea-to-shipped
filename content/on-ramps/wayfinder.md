---
title: wayfinder
slug: wayfinder
summary: wayfinder plans an effort too big for one session as a shared map of decisions, resolved one at a time.
---

## What it's for

Say you want the yoga-studio site to become a service any studio can join. Planning it would overflow a session's [context window](/learn/context-hygiene).

**wayfinder plans an effort too big for one session as a shared map of decisions, resolved one at a time.**

You type `/wayfinder` and your idea. The agent [grills](/learn/grill-before-you-build) you to name the **destination**: where the effort ends, such as a [Spec](/learn/issues-and-keeping-track), decision or change. Then it creates the **map**: one [Issue](/learn/issues-and-keeping-track) holding the destination, the decisions so far and the still-foggy questions.

Under it hang **decision tickets**: child Issues (sub-issues) that each ask one question. The answer is a decision, not a slice to build like a [Ticket](/learn/issues-and-keeping-track). Not yet specified is explained below:

```checkpoint quick-1
A decision ticket asks how to keep studios' data apart. What do you have once it's resolved?
- [x] A decision on how to keep the data apart.
- [ ] A slice of code that keeps the data apart.
- [ ] A merged branch that keeps the data apart.
Why: A decision ticket asks one question, and the answer is a decision. A slice to build is what a Ticket is for.
```

```
wayfinder:map
  Destination:       a Spec for studio sign-up
  Not yet specified: moving today's bookings across?

wayfinder:grilling  How do we keep studios' data apart?
wayfinder:research  What do payment services charge?
```

Not yet specified holds the **fog**: questions you know are coming but can't phrase sharply. A question you can phrase sharply becomes a ticket, even if it's blocked.

```checkpoint quick-2
You can tell a question about refunds is coming, but you can't phrase it sharply yet. Where does it go?
- [x] Under Not yet specified, as fog.
- [ ] Into a new ticket, marked as blocked.
- [ ] Nowhere yet, until you can answer it.
Why: Not yet specified holds the fog. Once you can phrase the question sharply, it becomes a ticket, even if it's blocked.
```

A label gives each ticket's type: `grilling` (the default, a chat with you), `prototype`, `research` (a fact a decision waits on) or `task` (manual work). **HITL** tickets (human in the loop) need you, live. In **AFK** ones, the agent works alone.

```checkpoint quick-3
A ticket is AFK. What does that mean for you?
- [x] The agent works on it alone, so you needn't be there.
- [ ] It needs you there, live, to answer the agent's questions.
- [ ] It's manual work that you carry out on your own.
Why: HITL tickets (human in the loop) need you, live. In AFK ones, the agent works alone.
```

## When to use it

- You have a loose idea and no map. wayfinder grills you broadly, then creates the map, its first tickets and their blocking links. That's one session; subagents take the research tickets.
- You have a map. In a fresh session, wayfinder takes the first ticket on the [frontier](/learn/issues-and-keeping-track) (open, unblocked, unclaimed: the edge of the known). It claims it by assigning it, resolves it and stops. One ticket per session, except research tickets.

```checkpoint quick-4
A session has resolved one grilling ticket, and the next looks easy. What does the session do?
- [x] It stops, since it's one ticket per session.
- [ ] It takes the next ticket, while there's room left.
- [ ] It asks you which ticket to resolve after that one.
Why: wayfinder takes one ticket from the frontier, resolves it and stops. Only research tickets are an exception.
```

## When not to use it

- If you can hold the idea in one session, or it's a well-scoped feature, use [grill-with-docs](/learn/grill-with-docs) instead, because wayfinder is slower and denser.

```checkpoint quick-5
You can hold a new feature in one session, but a few of its questions are still open. Which fits?
- [x] grill-with-docs, since wayfinder is slower and denser.
- [ ] wayfinder, since a map suits a well-scoped feature.
- [ ] wayfinder, since open questions always need a map.
Why: An idea you can hold in one session goes to grill-with-docs. wayfinder is slower and denser, so it isn't worth it here.
```

## What it needs to start

Only you can start wayfinder, by typing `/wayfinder` with an idea or a map.

```checkpoint quick-6
Your plan has grown huge in the middle of a session. Will the agent start wayfinder by itself?
- [x] No. Only you can start it, by typing its name.
- [ ] Yes. It starts once the plan outgrows the session.
- [ ] Yes. It starts once an existing map is in the repo.
Why: Only you can start wayfinder, by typing /wayfinder with a loose idea or an existing map.
```

It expects an [Issue tracker](/learn/issues-and-keeping-track) set up by [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills). Without one, it keeps the map and tickets as Markdown files instead.

## What it creates

- The map Issue and its decision tickets, with `wayfinder:` labels and blocking links.
- For each resolved ticket: an answer comment, the closed Issue and a line under Decisions so far, the map's settled questions.
- For research tickets: findings on a `research/<name>` branch, pushed but never merged, so your main code stays untouched.

When the map clears, it hands off; it doesn't build. It merges onto the [main flow](/learn/issues-and-keeping-track) at [to-spec](/learn/to-spec), which turns the linked decisions into a buildable Spec, then [to-tickets](/learn/to-tickets) and [implement](/learn/implement) as usual.

```checkpoint quick-7
Your map has cleared, and nothing is left to decide. What comes next?
- [x] to-spec, which turns the linked decisions into a Spec.
- [ ] implement, which builds straight from the linked decisions.
- [ ] to-tickets, which splits the linked decisions into slices.
Why: When the map clears, it hands off. It merges onto the main flow at to-spec, then to-tickets and implement as usual.
```

```diagram
type: chain
caption: "When the map clears, it hands off; it doesn't build."
steps:
  - "a loose idea"
  - label: "creates the map, its first tickets and their blocking links"
    note: "That's one session"
  - label: "takes the first ticket on the frontier"
    note: "One ticket per session, except research tickets."
  - "When the map clears"
  - label: "[to-spec](/learn/to-spec)"
    note: "turns the linked decisions into a buildable Spec"
  - "[to-tickets](/learn/to-tickets)"
  - label: "[implement](/learn/implement)"
    note: "as usual"
groups:
  - from: 5
    to: 7
    label: "the main flow"
```

## Going deeper

### Why it exists

A session has a limit, and a big enough plan outruns it. Planning can push the agent out of its [smart zone](/learn/context-hygiene), or even fill its context window. Matt's example is a grilling session about a clone of Stripe, a payments service: "There's no way you can plan that in 150k tokens."

So wayfinder splits one long grilling across many sessions. Each session takes one question, and the map carries what's been decided. The plan can then grow as long as it needs to.

```checkpoint quick-8
A plan won't fit in one session. How does wayfinder get round that?
- [x] It splits the grilling across many sessions, one question each.
- [ ] It asks fewer questions, so the plan fits in one session.
- [ ] It squeezes the whole plan's history into one long session.
Why: Each session takes one question, and the map carries what's been decided. So the plan can grow as long as it needs to.
```

### How it works underneath

**Two documents.** Matt started from the flow of information: what does a grilling session need when another session manages it? His answer: "the child probably needs to understand a vague overview of what else is happening, and they need their specific task." So there are two documents: the map for the overview, and the ticket for the task.

```checkpoint quick-9
A session is about to work on one ticket. What did Matt decide it needs?
- [x] A vague overview of the effort, plus its specific task.
- [ ] The full history of the effort, plus its specific task.
- [ ] Only its specific task, with the rest kept from it.
Why: The child session needs a vague overview and its specific task. So there are two documents, the map and the ticket.
```

**The map is an index, not a store.** Think of a book's index: a line and a page number, not the whole chapter. A decision lives in exactly one place, its ticket, and the map gives one line and a link. For example:

```
## Decisions so far

- [How do we keep studios' data apart?](link): one schema per studio
```

A session reads that line, and opens the ticket only if it needs the detail. So a map can "keep growing without every session loading its whole history."

```checkpoint quick-10
A session needs the detail behind a decision listed on the map. Where does it look?
- [x] In that decision's ticket, which it opens for the detail.
- [ ] In the map's line for it, which holds the whole decision.
- [ ] In the loaded history of every session the map has had.
Why: The map's line is enough to judge whether a decision matters. The session opens the ticket only if it needs the detail.
```

**The fog is deliberate.** Think of a strategy game like Warcraft III, where the fog of war hides the parts of the map you haven't explored. Resolving a ticket clears the fog ahead of it, and any question you can now state sharply becomes a fresh ticket. Work past the destination goes in the map's Out of scope section instead, and never graduates into a ticket.

```checkpoint quick-11
You resolve a ticket, and a foggy question can now be stated sharply. What happens to that question?
- [x] It becomes a fresh ticket, even if it's blocked.
- [ ] It stays as fog, since the map hasn't cleared.
- [ ] It goes in the map's Out of scope section instead.
Why: Resolving a ticket clears the fog ahead of it. Any question you can now state sharply becomes a fresh ticket.
```

**The words do real work.** Version 1.1 renamed the Skill from `decision-mapping`, a name Matt called "jargony and inaccurate". Fog of war, frontier and map are what he calls leading words: precise terms that lead the agent to the right idea.

**The tracker helps too.** The tracker's own blocked-by links show the frontier on its own screens, so you see what you can take without opening the map.

### A real example

Richard MacManus of Latent Space tried wayfinder on "a project to rearchitect my personal website", with 20+ years of content to reorganise. In his screenshot, the agent names the frontier and claims the first ticket in map order. It sees a HITL grilling ticket, loads the grilling Skill and starts asking.

```checkpoint quick-12
You run wayfinder on an existing map. What does the agent do before it starts asking you anything?
- [x] It takes the first frontier ticket and claims it.
- [ ] It writes a Spec for the whole of the effort.
- [ ] It resolves every ticket that's on the frontier.
Why: It takes the first ticket on the frontier, in map order, and claims it. In the screenshot, that's a HITL grilling ticket, so it then starts asking.
```

So a real run follows the same steps: frontier, claim, then a live exchange.

Matt's Sandcastle repo has a map for deciding whether to add one outside package as a dependency. Its GitHub Issue holds eight tickets as sub-issues. Only the top one has no blocked mark, so it's the one you could take now.

```checkpoint quick-13
You look down a map's open, unassigned sub-issues. Only the top one has no blocked mark. What does that tell you?
- [x] It's the only ticket you could take now.
- [ ] It's the one you should leave until last.
- [ ] It's already been resolved and closed.
Why: Among open, unassigned tickets, the one with no blocked mark is the one you could take now, and you can tell that from the list.
```

Matt has had maps with "50, 100 tickets or something", and uses wayfinder away from code too.

### Where it goes wrong

**The agent starts writing production code in the middle of the map.** This is the most-reported failure with wayfinder. A map's Notes hold its standing preferences, and they can override the plan-only default. But the agent writes the Notes. One agent wrote "this map carries execution" there, then read that back as permission and built on a live server. So read the Notes on any map you didn't chart yourself, and keep building in separate sessions.

```checkpoint quick-14
You pick up a map that a teammate's agent charted. Why read its Notes?
- [x] The agent writes them, and they can override the plan-only default.
- [ ] The tracker writes them, and they list which tickets are open now.
- [ ] A subagent writes them, and they hold research you haven't seen.
Why: Notes can override the plan-only default, but the agent writes them. One agent wrote itself an exemption, then built on a live server.
```

**By ticket thirteen, the rest of the map makes no sense.** One user charted 27 tickets and reported exactly that. Later tickets rested on assumptions that earlier ones had broken. That's the waterfall trap: the plan comes first, then goes stale.

Scope the map to a bounded destination, not the whole product, and prototype aggressively. Cheap, rough prototypes expose what's uncertain before building depends on it. Matt's shorthand: wayfinder is _prototypemaxxing_, not _planmaxxing_.

```checkpoint quick-15
Your last map stopped making sense by its thirteenth ticket. What helps with the next one?
- [x] A bounded destination, and aggressive prototyping.
- [ ] A destination covering the whole product, and no gaps.
- [ ] More tickets charted up front, before any prototypes.
Why: Scope the map to a bounded destination, not the whole product. Cheap prototypes expose what's uncertain before building depends on it.
```

**The work turns out simple, and you've made a map you don't need.** You started with wayfinder, and the grilling showed a way simpler solution. Matt's rule: "Never start with /wayfinder". For a medium-large change, always start with a /grill-with-docs session. If planning starts to get out of hand, say `/wayfinder let's turn this into a map`.

```checkpoint quick-16
You expect a medium-large change. Where do you start?
- [x] With a /grill-with-docs session, and a map only if planning gets out of hand.
- [ ] With /wayfinder, so that a map catches every decision from the very start.
- [ ] With /to-spec, and a map only for what the written Spec leaves still open.
Why: Starting with a map risks making one you don't need. Start with a /grill-with-docs session, and turn it into a map if planning gets out of hand.
```

```diagram
type: chain
caption: "Never start with /wayfinder"
steps:
  - "start with a /grill-with-docs session"
  - "If planning starts to get out of hand"
  - "/wayfinder let's turn this into a map"
```

You may meet older advice: in July 2026, Matt wrote that wayfinder was "designed to replace `/grill-with-docs` in many situations". His October 2026 post is newer, but it is advice, not a change to the Skill, which still charts from a loose idea. If that finds no fog, you don't need a map: it stops and asks how you'd like to go on.

**A second session asks a question you already answered.** You ran two grilling tickets at once, and the sessions share no context. One ticket at a time is the safer default.

**The agent answers its own questions.** Students reported wayfinder grilling itself instead of them. v1.1 fixed that by marking every ticket type HITL or AFK: a HITL ticket resolves only through a live exchange with you. If an agent answers for you, stop it and answer yourself.

**A research ticket closes before you've seen the findings.** In issue #1241, still open, the findings were posted, "the ticket closed and the map edited before the human had seen them." The Skill has no review gate before closing AFK tickets. So ask the agent up front to show you a research result before resolving the ticket.

### Try it

You'll need your practice project. If you haven't set it up, do keeping-track's Try it step first.

1. In the `yoga-studio` folder, create wayfinder's labels: `for t in map grilling research prototype task; do gh label create "wayfinder:$t"; done`. You should see five labels.
2. Start Claude Code: `claude`.
3. Type `/grill-with-docs Let any yoga studio sign up and run its own bookings.`
4. Answer until the questions spread past one session.
5. Type `/wayfinder let's turn this into a map`, and answer until charting stops.
6. Run `gh issue list --web`. You should see the map, labelled `wayfinder:map`, and its tickets.
7. Open the map. You should see its Destination, and the tickets as sub-issues.
8. Find the frontier: open tickets with no "Blocked" icon and no assignee.
9. Run `/clear`.
10. Type `/wayfinder #20`, using your map's number. You should see it claim one ticket by assigning it.
11. If it's a grilling ticket, answer until it resolves.
12. Open the map. You should see the ticket closed, and a new line under Decisions so far.
13. Read the map's Notes. If they say the map carries execution, ask whether you wrote that.

If charting stops with no map, it found no fog. Pick a bigger idea.

### Read more

- [The /wayfinder Skill](https://www.aihero.dev/skills-wayfinder), Matt Pocock, updated 2026-08-24
- [The /wayfinder Skill: Navigating the "Fog of War" of Planning](https://www.latent.space/p/wayfinder-skill), Richard MacManus interviewing Matt Pocock, 2026-08-20
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer, Gergely Orosz with Matt Pocock, 2026-09-17
- [v1.1: /wayfinder, /to-spec, /to-tickets, /grilling improvements, and much more](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements), Matt Pocock, 2026-07-08
- [Should you /grill-with-docs, /wayfinder, or just one shot the code?](https://x.com/mattpocockuk/status/2108216899439894574), Matt Pocock on X, 2026-10-08
- [wayfinder/research: unclear who runs git for research agents, and no review gate before closing AFK tickets (#1241)](https://github.com/mattpocock/skills/issues/1241), sant3e, 2026-10-09

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint wayfinder-deeper-unsure-size
You want members of your yoga-studio site to buy class passes and pay online. It feels like a medium-large change, but you can't tell yet whether the open questions fit in one session or will spread across many. Nothing is decided and the repo already has a Glossary. Which fits best?
- [x] Get interviewed while the docs are kept current, and chart a map only if it sprawls.
  > Right: that's `/grill-with-docs`.
- [ ] Start straight away with the map: name the destination, then chart decision tickets.
  > That's `/wayfinder`. If the work turns out simpler than you thought, you've made a map and tickets you don't need. Matt's October 2026 advice is never to start there.
- [ ] Write a Spec now from what you already know about passes, prices and payments.
  > That's `/to-spec`. Nothing is decided yet, and writing the Spec doesn't interview you about the open questions.
- [ ] Build a quick throwaway checkout page first and decide from what it shows.
  > That's `/prototype`. A throwaway prototype answers one design question. It won't show whether your open questions fit in one session.
Why: If you start with a map and the work turns out simple, you've made a map you don't need. So begin with an interview. If planning starts to get out of hand, say "/wayfinder let's turn this into a map" then.
```

```checkpoint wayfinder-deeper-notes-say-execution
You open a wayfinder map a teammate's agent charted for your booking site. Its Notes say "this map carries execution", and the latest session deployed code to the live server. You never agreed to that. Why read the Notes on any map you didn't chart yourself? What's the reason behind this step?
- [x] The agent writes the Notes, so an exemption there may be one it gave itself.
- [ ] The Notes hold the list of open tickets, and stale ones block the frontier.
  > Open tickets aren't listed in the map body; they're open child issues found by query. The Notes hold domain, skills and standing preferences.
- [ ] The Notes are where research subagents post findings that still need your review.
  > Research findings go on a research branch with a pointer from the ticket, not into the map's Notes.
Why: The Notes can override the plan-only default, but the agent is the one writing them. So the agent can lift its own limit, as one did before it built on a live server. The decision is yours, so check what the Notes allow.
```

## Remember

```flashcards
Q: What does wayfinder create in the Issue tracker?
A: A map Issue labelled wayfinder:map, with child decision tickets, each carrying a wayfinder type label and blocking links.

Q: Where does wayfinder merge onto the main flow?
A: At [to-spec](/learn/to-spec), once the map clears, then [to-tickets](/learn/to-tickets) and [implement](/learn/implement).

Q: In a wayfinder map, what is the frontier?
A: The open, unblocked, unclaimed decision tickets, the edge of what's known.

Q: What are the four types of wayfinder decision ticket?
A: Research, prototype, grilling (the default) and task.

Q: What problem made Matt build wayfinder, in his own words?
A: Planning itself outgrew one session. Of grilling something like a Stripe clone, he said "There's no way you can plan that in 150k tokens". So he split grilling across many sessions.

Q: How do you stop a wayfinder map turning into waterfall?
A: Scope the map to a bounded destination, not the whole product, and prototype aggressively. "Wayfinder is "prototypemaxxing", not "planmaxxing"."

Q: Which reported bug did v1.1 fix by classing every wayfinder ticket type as HITL or AFK?
A: Wayfinder grilling itself instead of the human. A HITL ticket now resolves only through a live exchange with you.
```

## Final test

```final-test wayfinder-ticket-produces
By default, what does resolving one of wayfinder's decision tickets produce?
- [x] A decision, recorded on the ticket and linked from the map.
- [ ] A working slice of the feature, built and merged into main.
- [ ] A pull request that builds part of the destination.
Why: A decision ticket asks a question, so resolving it gives you an answer, posted on the ticket and linked from the map. wayfinder plans and leaves the building for later. Building enters the map only if its Notes say so, which is why this says "by default".
```

```final-test wayfinder-tickets-per-session
How many decision tickets may one session resolve while working through a map?
- [x] One, except research tickets.
- [ ] As many as fit before the context window fills.
- [ ] The whole frontier, in parallel.
- [ ] Zero; sessions chart, they don't resolve.
Why: Each ticket is sized to fit one agent session, so a session claims one, resolves it and stops. The next ticket gets a fresh session. Research tickets are the exception, because subagents resolve those.
```

```final-test wayfinder-fog-or-ticket
You can state a question precisely, but it's blocked and you can't act on it yet. Where does it go?
- [x] Into a ticket, blocked by whatever it waits on.
- [ ] Into Not yet specified, until it can be acted on.
- [ ] Into Out of scope, since it can't be acted on yet.
Why: A ticket needs a sharp question, not an answer. You can already state this one precisely, so it's a ticket now, and its blocked-by link holds it back until it can be acted on. Not yet specified is only for questions you can't phrase sharply yet.
```

```final-test wayfinder-deeper-what-child-needs
When Matt designed wayfinder, what did he decide a grilling session needs when another session manages it?
- [x] A rough overview of the rest of the effort, plus its own specific question.
- [ ] The full transcript of every earlier session, so nothing decided is lost.
- [ ] Only its own question, with the rest of the effort hidden to keep it focused.
Why: A session needs a rough idea of what else is happening, plus its own task. So there are two documents, the map for the overview and the ticket for the task. The map stays an index, so no session has to load the whole history.
```

```final-test wayfinder-deeper-most-reported-failure
Which failure gets reported most often with wayfinder?
- [x] The agent starts writing production code in the middle of the map.
- [ ] The agent charts too few tickets and misses decisions it should have asked about.
- [ ] The map's labels clash with the triage labels already set up in the repo.
Why: A map's Notes can override the plan-only default, but the agent writes the Notes. One agent wrote "this map carries execution" there, read that back as permission and built on a live server. So read the Notes on any map you didn't chart yourself.
```

```final-test wayfinder-agent-platform
You want to build a platform for running AI agents from scratch: hosting, sign-in, how agents run, billing and the website. You can't yet see the route from here to a buildable Spec, and just deciding things would take many agent sessions. Which fits best?
- [x] Chart a map of decision tickets in the Issue tracker, settled one per session.
  > Right: that's `/wayfinder`.
- [ ] Get interviewed about the idea while the Glossary and decision records are written.
  > That's `/grill-with-docs`. That sharpens an idea you can hold in one session. This one is too big and too foggy for that.
- [ ] Write a Spec from the conversation so far and publish it to the Issue tracker.
  > That's `/to-spec`. It doesn't interview you; it only writes up what's been decided, and almost nothing has been yet.
- [ ] Have agents build the whole platform in one orchestrated run, Ticket by Ticket.
  > That's `/implement-spec`. There's no Spec and there are no Tickets to build from.
Why: You can't see the route yet, and the deciding alone would take many sessions. A map splits that deciding into tickets, one session each, so the way is clear before anything is built.
```

```final-test wayfinder-password-reset
You want to add password reset to your FastAPI app. You roughly know how it should work, the repo already has a Glossary, and a few questions about token expiry and emails are still open. You can settle them all in one conversation. Which fits best?
- [x] Get interviewed on the open questions while the docs are kept up to date.
  > Right: that's `/grill-with-docs`.
- [ ] Chart a map of decision tickets for the open questions, settled one per session.
  > That's `/wayfinder`. It's slower and denser, and meant for an idea you can't hold in one session. Never for a well-scoped feature.
- [ ] Write a Spec straight away from what you know about tokens and emails.
  > That's `/to-spec`. The questions are still open, and writing the Spec doesn't interview you about them.
Why: You can settle every open question in one conversation, so a map would only slow you down. The main flow's interview settles them now, in the repo, and leaves a written record behind.
```

```final-test wayfinder-map-cleared
For weeks you've worked through a map of decisions for moving your website from one server to Docker containers on a cloud host. The last decision ticket is closed, and nothing is left under Not yet specified. The effort is still big. What comes next? What comes next?
- [x] Turn the map's linked decisions into a buildable Spec.
  > Right: that's `/to-spec`.
- [ ] Have an agent start building straight from the map.
  > That's `/implement`. Going from the map straight to building skips turning the decisions into a Spec, and throws the linked detail away. That's only right when the effort turned out small.
- [ ] Split the map's decision tickets into build Tickets.
  > That's `/to-tickets`. The map's decisions first need turning into a Spec. Tickets are split from it right after.
- [ ] Work through the map again for another decision.
  > That's `/wayfinder`. The map is clear. Nothing is left to decide, so it hands off rather than going on.
Why: A cleared map holds linked decisions, not a buildable plan. So it hands off to the main flow at the Spec step, which collapses those decisions into one buildable Spec. Tickets and building then follow as usual.
```

```final-test wayfinder-why-stop-after-one
A session working through the map for your booking site has just resolved one grilling ticket about which database to use. There's time left, and the next ticket on the frontier looks easy. Why does the session stop instead of taking it? What's the reason behind this step?
- [x] Each ticket is sized to one session, so the next one gets a fresh session.
- [ ] A pull request for the database decision has to be reviewed first.
  > Decision tickets end in a resolution comment and a closed Issue, not a pull request.
- [ ] The next ticket stays blocked until the rest of the map is closed.
  > A ticket is unblocked when the tickets blocking it are closed, not the whole map.
Why: Each ticket is sized to one session, so resolving one is the session's whole job, however easy the next looks. The next ticket gets a new session, which starts by loading the map's short overview.
```

```final-test wayfinder-why-wait-for-you
In a grilling ticket about pricing for your booking site, the agent is waiting for your answer. From earlier tickets it could guess what you'd say, write the answer itself and close the ticket. Why must it wait? What's the reason behind this step?
- [x] It only resolves through a live exchange with you, not the agent's guesses.
- [ ] Agents aren't allowed to close Issues, so you have to close it yourself.
  > Closing the Issue is part of recording a resolution. The problem is who gives the answer.
- [ ] Grilling tickets go to a research subagent, not to this agent.
  > Research tickets go to a subagent. A grilling ticket is a conversation with you.
Why: The decision is yours, so a grilling ticket is human in the loop. It only resolves when you answer, live. An agent that answers for you has broken that rule, however good its guess.
```

```sources
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [Creating issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies)
- [mattpocock/skills commit a496f55](https://github.com/mattpocock/skills/commit/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa), Matt Pocock, 2026-10-29
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer (Gergely Orosz) with Matt Pocock, 2026-09-17
- [The /wayfinder Skill: Navigating the “Fog of War” of Planning](https://www.latent.space/p/wayfinder-skill), Richard MacManus (interview with Matt Pocock), 2026-08-20
- [v1.1: /wayfinder, /to-spec, /to-tickets, /grilling improvements, and much more](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements), Matt Pocock, 2026-07-08
- [The /wayfinder Skill](https://www.aihero.dev/skills-wayfinder), Matt Pocock, 2026-08-24
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [Should you /grill-with-docs, /wayfinder, or just one shot the code?](https://x.com/mattpocockuk/status/2108216899439894574), Matt Pocock, 2026-10-08
- [wayfinder/research: unclear who runs git for research agents, and no review gate before closing AFK tickets #1241](https://github.com/mattpocock/skills/issues/1241), sant3e, 2026-10-09
- [AI Skills with Matt Pocock](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock), Gergely Orosz, 2026-09-17
- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills), Matt Pocock, 2026-08-24
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [tdd: mocking.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/mocking.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
```
