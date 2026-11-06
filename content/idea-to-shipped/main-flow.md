---
title: The main flow
slug: main-flow
summary: A map of the path most work takes through Matt Pocock's Skills, from a rough idea to merged code: which Skill comes next, and when to clear the session.
---

## What the main flow is

Say you've installed Matt Pocock's Skills and set up the repo for your yoga-studio booking site. You want members to be able to book a class, and you're looking at 27 Skills. Which comes first? The right Skills in the wrong order still go wrong. Clear the session, your conversation with the agent, right after the interview, and the plan you write next has lost the reasons behind your answers.

**The main flow is the path most work takes through the Skills: grill, plan, build test-first, review, ship, then learn.**

Matt, a developer and teacher who publishes the Skills, puts it this way: "This is the main flow that all of my work runs through." Each stop is a **Skill**, a set of instructions the agent loads for one kind of task (see [what a Skill is](/learn/skills)). This lesson is the map; each stop has its own lesson, linked below.

```diagram
type: chain
caption: "The main flow, from idea to shipped"
steps:
  - label: "[grill-with-docs](/learn/grill-with-docs)"
    note: "with a [prototype](/learn/prototype) detour if talk can't settle a question"
  - "[to-spec](/learn/to-spec)"
  - "[to-tickets](/learn/to-tickets)"
  - label: "[implement](/learn/implement) or [implement-spec](/learn/implement-spec)"
    note: "driving [tdd](/learn/tdd), closing with [code-review](/learn/code-review)"
  - "[pr](/learn/pr)"
  - "[retro](/learn/retro)"
groups:
  - from: 2
    to: 3
    label: "only if the build spans sessions"
```

```checkpoint quick-1
Your idea for a booking waitlist is still rough. Where does the main flow start?
- [x] With an interview that sharpens the idea, before anything is built.
- [ ] With a Spec, so the idea is written down before anyone asks questions.
- [ ] With the build, so you can see the idea working before you plan it.
Why: The main flow starts by grilling the idea. Planning, building, review, shipping and learning come after it.
```

## The stops, in order

**Before you build.** Run [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) once per repo, so the Skills know where your Issues (the project's tracked to-do items) and docs live. Two ideas sit under every stop. [One shared language](/learn/one-shared-language) means one word for each thing in the project. [Fix the environment](/learn/fix-the-environment) means that when the agent repeats a mistake, you fix what lets it happen, not only the one line.

1. **Grill.** Before any code, the agent interviews you until you both understand the idea the same way ([grill before you build](/learn/grill-before-you-build)). In a repo, type `/grill-with-docs` ([grill-with-docs](/learn/grill-with-docs)). It writes the words you settle into `GLOSSARY.md` as you go, with [domain-modeling](/learn/domain-modeling). With no repo, use [grill-me](/learn/grill-me), which saves nothing. Both run the same interview, [grilling](/learn/grilling).
2. **Detour, only if talk can't settle a question.** Some questions need something you can run or see, like a tricky booking rule or a screen. [prototype](/learn/prototype) answers it with throwaway code, in a fresh session that [handoff](/learn/handoff) bridges out and back.
3. **Plan, only if the build spans sessions.** [to-spec](/learn/to-spec) turns the conversation into a **Spec**: one Issue that describes the whole feature. [to-tickets](/learn/to-tickets) splits it into **Tickets**, one Issue per small piece of work, [each working end to end](/learn/small-end-to-end-tickets) and naming what must finish first. Here you also agree where tests will check the feature from outside ([test first](/learn/test-first)).
4. **Build.** [implement](/learn/implement) builds one Ticket, or a small change, test-first with [tdd](/learn/tdd). Then it commits the work, saving it as a snapshot in Git ([commits](/learn/commits-and-diffs)), and stops: it opens no pull request. [implement-spec](/learn/implement-spec) builds a whole Spec in one run. Helper agents build its Tickets in parallel, and everything lands on one branch, a separate line of work in Git. Both close with [code-review](/learn/code-review), which checks the work [against the Spec and the standards](/learn/review-spec-and-standards).
5. **Ship.** The work goes up as a pull request, a proposed change that's reviewed before it joins the main code, and [pr](/learn/pr) shapes its description. [The build loop in practice](/learn/spec-driven-build-loop) takes a whole Spec to merged pull requests.
6. **Learn.** [retro](/learn/retro) looks back over the session and suggests fixes to the agent's environment, not the code. Run it before you clear the session.

```checkpoint quick-2
`/implement` has built Ticket #12 and committed it. What does it do next, on its own?
- [x] Nothing more: it stops at the commit, and the pull request is up to you.
- [ ] It opens a pull request for Ticket #12 and merges it when checks pass.
- [ ] It moves straight on to the next Ticket, in the same session.
Why: implement builds, tests, reviews and commits, then stops. It opens no pull request and closes nothing, so shipping is the next stop.
```

## When to skip steps

Two questions decide your route, like two forks in the road:

- **Fork A: can talk settle every question?** If one needs a runnable answer, take the prototype detour, then come back to the grilling.
- **Fork B: does the build span sessions?** If it fits in the room this session has left, type `/implement` right after the grilling, and skip the Spec and Tickets. If it needs several sessions, write the Spec and Tickets first.

**Fork B isn't about how important the work is; it's about whether the build fits in this session.** For example:

```text
Small: members can add a note to a booking.
  /grill-with-docs  →  /implement  →  /retro

Big: a waitlist that emails members when a place frees up.
  /grill-with-docs  →  /to-spec  →  /to-tickets  →  /implement per Ticket  →  /retro
```

Matt takes the short road when the work fits. Once, he had to remove ten commands from a tool, with about 100k tokens of room left. Tokens are the small chunks of text a model reads. He said he'd normally type `/implement` and let it run.

```checkpoint quick-3
You've grilled a small change, and the session has plenty of room left. What do you type next?
- [x] `/implement`, in this same session.
- [ ] `/to-spec`, then `/to-tickets`, so it's written down.
- [ ] `/clear`, then `/implement` in a fresh session.
Why: Fork B: the build fits in this session, so skip the Spec and Tickets and build it right here, where every decision is still in the window.
```

## Context between steps

Everything in a session lives in its [context window](/learn/context-window), the agent's working memory, which fills as you work. The **smart zone** is the part where the model still reasons sharply: about 150k tokens on today's best models. The main flow spends it in a set rhythm:

- **One unbroken window for the grilling, the Spec and the Tickets.** Don't `/clear` (empty the window) or `/compact` (swap the history for a summary) until after `/to-tickets`. to-spec doesn't interview you again: it writes from the conversation.
- **A fresh window for each Ticket.** Each Ticket is self-contained, so `/clear` between them.
- **retro in the session it looks back on,** before you clear. After clearing, name that session after `/retro`.
- **Near the smart zone's limit before the Tickets exist?** Don't push on. `/compact` at the nearest phase boundary, and carry on.

For example, for the waitlist:

```text
/grill-with-docs   # one window
/to-spec
/to-tickets
/clear             # a fresh window
/implement #12
/clear             # a fresh window
/implement #13
```

```checkpoint quick-4
You've finished `/to-spec`, and `/to-tickets` is next. The session has room. Do you clear first?
- [x] No: the Spec and Tickets build on the same unbroken window.
- [ ] Yes: to-tickets works best from an empty context window.
- [ ] Yes, but with `/compact`, so the Tickets use fewer tokens.
Why: Keep the grilling, the Spec and the Tickets in one unbroken window. Don't clear or compact until after `/to-tickets`.
```

A **phase** is a chunk of work inside a session, like the grilling or the build. The gap between two phases, the **phase boundary**, is the only place to decide what to do with the session. You have five options there, checked in this order, and the first yes wins:

1. **Continue,** if the next phase needs this one as it happened, or fits in the smart zone left.
2. **`/clear`,** if nothing here matters to what comes next.
3. **`/handoff`,** only for a new harness (the agent tool you run), a new folder or repo, a colleague, or a side task found mid-phase.
4. **A subagent,** a helper agent with its own window, for a tightly scoped job that runs without you, like an automated review.
5. **`/compact`,** otherwise. It's the default, but the last to reach for.

Mid-phase, there's nothing to decide: carry on, or split what's left between subagents. Compacting mid-phase makes the agent lose the thread. [Context hygiene](/learn/context-hygiene) covers the rhythm in depth.

```checkpoint quick-5
`/implement` has committed Ticket #12. Ticket #13 builds on #12's code. What do you do with the session?
- [x] `/clear`, then `/implement #13` from its own Ticket.
- [ ] `/compact`, so #13 keeps a summary of how #12 works.
- [ ] `/handoff`, then start #13 in a brand-new session.
Why: #13 needs #12's code, and that's in the commit. Each Ticket is self-contained, so the last one's context is disposable. Nothing has to travel, so there's nothing to hand off.
```

## Who can type what

Matt's Skills split on one question: who can start them.

| Only you can start these | You or the agent can start these |
|---|---|
| `/grill-with-docs`, `/grill-me`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`, `/retro`, `/handoff` | `/grilling`, `/domain-modeling`, `/prototype`, `/tdd`, `/code-review`, `/pr` |

- **The junctions are yours.** The flow never moves on until you type the next name, at the start of your message. Writing "now write the spec" in plain words won't start to-spec.
- **A Skill only you can start can call the agent's kind, but never another of yours.** That's why `/implement` can run `/tdd` and `/code-review` for you, but can't start `/retro`.
- **Some names aren't Skills.** `/clear`, `/compact` and `/context` are commands built into Claude Code.

```checkpoint quick-6
Grilling is done. You write "great, now write the spec and split it into Tickets". What can you count on?
- [x] Neither Skill starts, so you still type `/to-spec`, then `/to-tickets`.
- [ ] The agent starts `/to-spec`, then `/to-tickets`, as if you'd typed them.
- [ ] The agent runs `/grill-with-docs` again to check your decisions first.
Why: to-spec and to-tickets are Skills only you can start, by typing the name at the start of a message. Plain words can't start them.
```

## Other ways in

Three situations start somewhere other than a fresh idea, then merge onto the main flow. Matt calls them **on-ramps**:

- **Bug reports and requests piling up:** [triage](/learn/triage) sorts the Issues other people file until each is ready for an agent, and `/implement` picks those up. It's only for Issues you didn't create: Tickets from to-tickets are ready already.
- **Something's broken, and you can't see why:** [diagnosing-bugs](/learn/diagnosing-bugs) builds one command that fails on this bug before it guesses at a cause. Then it fixes the bug and adds a test that guards it. Run `/retro` in the same session afterwards.
- **A huge, foggy effort you can't plan in one sitting:** [wayfinder](/learn/wayfinder) maps it as decision tickets and settles them one per session. It produces decisions, not code, so it merges onto the main flow at `/to-spec`.

For upkeep, [improve-codebase-architecture](/learn/improve-codebase-architecture) surveys your code for the parts that are hard to change. The one you pick becomes an idea, which you take into the main flow at `/grill-with-docs`.

```checkpoint quick-7
After three weeks with wayfinder, the map for a new booking system is clear. Where does it join the main flow?
- [x] At `/to-spec`, which turns the map's decisions into one plan to build.
- [ ] At `/implement`, pointed at the map, so the build can start today.
- [ ] At `/triage`, so each decision ticket becomes ready for an agent.
Why: wayfinder produces decisions, not code. to-spec collapses them into a Spec you can split into Tickets. Go straight to implement only if the effort turned out small.
```

## Lost? Ask the router

[ask-matt](/learn/ask-matt) knows the whole map. Type `/ask-matt` with your situation, and it places you on a route, names what to type next and where to clear, then stops. Before it says what a Skill does, or that you can skip a step, it reads that Skill's own `SKILL.md`. Where the router and a Skill's own file disagree, the file is right.

For example, you type:

```text
/ask-matt I'm in my yoga-studio repo. I want a waitlist, maybe four sessions of work. Just give me the sequence.
```

It might answer:

```text
Main flow, in one unbroken context window until the Tickets exist.
1. /grill-with-docs.
2. If a question needs a runnable answer: /handoff, /prototype, /handoff back.
3. It's multi-session, so /to-spec, then /to-tickets. Then /implement one
   Ticket at a time, with /clear between each, or /implement-spec.
4. /retro in the same session, before you clear.
```

```checkpoint quick-8
`/ask-matt` has named `/grill-with-docs` as your next step. What happens now?
- [x] Nothing, until you type `/grill-with-docs` yourself.
- [ ] It starts `/grill-with-docs` for you once it has answered.
- [ ] It waits a moment, then starts it unless you say no.
Why: The router names what to type, then stops. grill-with-docs is a Skill only you can start, so you type it.
```

## Going deeper

### Why it exists

People ask Matt all the time what order to use his Skills in. A fixed list can't answer that. His page on the router says a static table would "be wrong for most situations", because the parts that matter are the branches. Is there a codebase? Does the build span sessions? Can talking settle this question?

So the main flow is a map with forks, not a checklist, and the router walks you along it.

```checkpoint quick-9
Someone proposes replacing the main flow with one fixed list of Skills in order. What's wrong with that?
- [x] It would be wrong for most situations, because the branches matter.
- [ ] It would be right in most situations, but too long to read.
- [ ] Nothing, since the main flow never changes from one job to the next.
Why: The right next step depends on your situation: is there a codebase, does the build span sessions, can talking settle the question? A fixed list drops those branches.
```

### How it works underneath

**Primary and secondary sources.** Every option at a boundary except Continue swaps the session as it happened, a **primary source**, for a summary of it, a **secondary source**. A summary has less noise, but it has lost detail too. That's why Continue comes first and `/compact` comes last. Starting with `/compact` risks "a fresh session that is confidently wrong about a decision the summary flattened."

**The destination and the steps.** In Matt's words, the Spec is "the destination that we're heading to", and the Tickets are how you get there. Each Ticket is sized for one fresh context window, which is why the last one's context can go.

**A fresh reviewer.** code-review runs its checks in subagents with clean windows. Matt explains why: agents "are often really bad at editing code or improving code they've just written."

```checkpoint quick-10
Why does Continue come before `/compact` at a phase boundary?
- [x] Continue keeps the session as it happened, while a summary loses detail.
- [ ] Continue costs fewer tokens on the next turn than a compacted session.
- [ ] `/compact` only works once a session has gone past the smart zone.
Why: Every option except Continue swaps the session as it happened for a summary of it. You only pay that loss of detail when staying costs more than it saves.
```

### A real example

In a July 2026 video, Matt walked the main flow on one of his work repos, the AI Hero CLI. After setup, `/ask-matt` told him to walk down the flow "in one unbroken context window."

He typed `/grill-with-docs` with a vague idea: strip out most of the tool's internal commands. Six questions later, they had a plan; his grillings usually run to about 20. Then he reached Fork B. With about 100k tokens of room left, he'd normally type `/implement`. To show the whole flow, he pretended the work needed several sessions.

`/to-spec` compressed the 46.1k-token discussion into a Spec on his tracker. In the same session, `/to-tickets` proposed three Tickets, and he asked for one. He cleared, then typed `/implement`. It ran the checks, then code-review in subagents, against the Spec and the standards, and committed.

So one sitting showed the whole flow: grill, fork, plan, clear, build, review.

```checkpoint quick-11
In Matt's walkthrough, why did he run `/to-spec` and `/to-tickets` at all?
- [x] To show the whole flow, since the work really fitted one session.
- [ ] Because his session had already gone past the smart zone.
- [ ] Because implement can't run until a Spec and Tickets exist.
Why: With about 100k tokens of room left, he'd normally have typed `/implement`. He took the long road only to show the whole flow.
```

### Where it goes wrong

**The Spec came out vague.** You cleared or compacted after the grilling, so to-spec had little to write from. Keep one window until `/to-tickets`.

**You waited, and nothing happened.** The next Skill is one only you can start. The flow doesn't move until you type it.

**The agent says a Skill isn't installed.** Skills only you can start are kept out of the agent's list of Skills, so it decides they're missing. Type the name anyway: it loads fine.

**An agent built the whole Spec in one run.** to-spec labels the Spec `ready-for-agent`, and an agent running alone that looks for that label can take the Spec itself. Tell it to skip the Spec, or remove the label once the Tickets exist.

**You triaged your own Tickets.** Tickets from to-tickets are born ready for an agent. Triage is for the Issues other people file.

```checkpoint quick-12
Sam grilled a feature, ran `/to-spec` and `/to-tickets`, then ran `/triage` on the seven new Tickets. Spot the mistake.
- [x] Triage is for Issues others file, and his Tickets were ready already.
- [ ] Triage should have run before `/to-spec`, to sort the idea first.
- [ ] Seven Tickets is too many for one run of triage to handle.
Why: Tickets from to-tickets are born ready for an agent. Triage is the on-ramp for bug reports and requests that arrive raw.
```

### Try it

You'll need your practice project, the yoga-studio repo, with Matt's Skills set up. If you haven't set it up, do the Try it in [keeping track](/learn/issues-and-keeping-track) first. This writes no code.

1. Go to the project: `cd yoga-studio`.
2. Start Claude Code: `claude`.
3. Type `/ask-matt I want members to add a note to a booking. Just give me the sequence, and where I should /clear or /compact.` You should see it start with `/grill-with-docs`, then go to `/implement` in the same window.
4. Type `Now say the idea is a waitlist that emails members when a place frees up, and it needs several sessions. Same question.` You should see `/to-spec` and `/to-tickets` appear.
5. Type `I'm still grilling the waitlist, and I'm near the end of the smart zone. What do I do?` You should see `/compact` at the nearest phase boundary.
6. Check the answers against the map: no clear or compact before `/to-tickets`, and `/retro` before you clear.
7. Check that it stopped each time without starting any of it. Then type `/exit`.

If it says some Skills aren't installed, that's the quirk from Where it goes wrong: they are. Don't start the work it names yet.

### Read more

- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, updated 2026-08-24
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock
- [Smart zone (AI Coding Dictionary)](https://www.aihero.dev/ai-coding-dictionary/smart-zone), Matt Pocock

## Remember

```flashcards
Q: What are the stops on the main flow, in order?
A: Grill (`/grill-with-docs`), plan (`/to-spec`, `/to-tickets`) if the build spans sessions, build (`/implement` or `/implement-spec`, with `/tdd` and `/code-review` inside), ship (`/pr`), learn (`/retro`).

Q: What does Fork B ask?
A: Does the build span sessions? If it fits this one, type `/implement` right after the grilling and skip the Spec and Tickets.

Q: When do you first clear the session on a multi-session build?
A: After `/to-tickets`. Grilling, Spec and Tickets share one unbroken window; then each Ticket gets a fresh one.

Q: At a phase boundary, what are the five options, in order?
A: Continue, `/clear`, `/handoff`, a subagent, then `/compact`. The first yes wins.

Q: When is `/handoff` the right move?
A: Only for a new harness, a new folder or repo, a colleague, or a side task found mid-phase.

Q: What are the three on-ramps, and where do they lead?
A: `/triage` for Issues others file, `/diagnosing-bugs` for a hard bug, `/wayfinder` for huge, foggy work, which merges at `/to-spec`.

Q: You're not sure what comes next. What do you type?
A: `/ask-matt` and your situation. It names the next step and stops.
```

## Final test

```final-test main-flow-fits-one-session
On the yoga-studio site, you've grilled a small change: members can add a note to a booking. The session has used about 45k tokens. What do you type next?
- [x] `/implement`, in this same session, while every decision is still there.
- [ ] `/to-spec`, then `/to-tickets`, so the change is written down first.
- [ ] `/clear`, then `/implement` with a one-line description of the change.
- [ ] `/implement-spec`, so helper agents can build it in parallel.
Why: Fork B: the build fits in the room this session has left, so build it here. The Spec and Tickets pay off only across sessions, and clearing would throw away the decisions you made.
```

```final-test main-flow-needs-seeing
Grilling the waitlist, you hit a rule two rounds of talk haven't settled: when two places free up at once and five members are waiting, who gets them? What's the route?
- [x] `/handoff` out, `/prototype` in a fresh session, `/handoff` back.
- [ ] Keep grilling until one version of the rule sounds right.
- [ ] Run `/to-spec` now, and leave the question for the Tickets.
- [ ] Accept the agent's guess, and settle it during `/implement`.
Why: That's Fork A. A question talk can't settle takes the prototype detour: throwaway code answers it, and the second handoff carries the answer back to the grilling.
```

```final-test main-flow-sequence-detour
You're planning a feature that will take several sessions, and one question can only be settled by a screen you can see. Which order walks the main flow? ("Detour" means `/handoff` out, `/prototype`, `/handoff` back.)
- [x] `/grill-with-docs`, detour, `/to-spec`, `/to-tickets`, `/implement` per Ticket, `/retro`
- [ ] Detour, `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement` per Ticket, `/retro`
- [ ] `/grill-with-docs`, detour, `/implement` right here, `/retro`
- [ ] `/grill-with-docs`, detour, `/to-spec`, `/to-tickets`, `/retro`, `/implement` per Ticket
Why: The detour answers a question the grilling raised, so it comes after the grilling starts. Several sessions means a Spec and Tickets. `/retro` looks back on a build, so it comes last.
```

```final-test main-flow-boundary-order
You've finished checking that the waitlist works, and you stop to decide what to do with the session. In which order do you weigh the options?
- [x] Continue, `/clear`, `/handoff`, a subagent, `/compact`
- [ ] `/compact`, `/clear`, `/handoff`, a subagent, Continue
- [ ] Continue, `/handoff`, `/clear`, a subagent, `/compact`
- [ ] `/clear`, Continue, a subagent, `/handoff`, `/compact`
Why: Ask in that order, and take the first yes. Continue loses nothing, so rule it out first. `/compact` is the default when nothing above it fits.
```

```final-test main-flow-step-away
Your Spec has nine Tickets, some blocking others. It's Friday evening, and you want the whole Spec built by Monday without typing anything per Ticket. What do you type?
- [x] `/implement-spec`, pointed at the Spec.
- [ ] `/implement`, naming all nine Tickets at once.
- [ ] `/triage`, so each Ticket becomes ready for an agent.
- [ ] `/to-tickets` again, to merge them into one big Ticket.
Why: implement-spec builds a whole Spec in one run, with helper agents building the Tickets in parallel. One implement for nine Tickets would overfill one session, which is what the Tickets were cut to avoid.
```

```final-test main-flow-retro-next-day
Dana finished a messy build late at night and typed `/clear`. Next morning she opened a new session, typed `/retro` with nothing after it, and got almost nothing useful. Spot the mistake.
- [x] She ran it on an empty session, not on the one she cleared.
- [ ] She should have typed `/handoff` the night before, instead of `/clear`.
- [ ] `/retro` only works straight after a `/diagnosing-bugs` session.
- [ ] `/retro` reads only the code, so a session can't help it anyway.
Why: retro looks back on the current session unless you name another. Run it before you clear, or name the session you mean after `/retro`.
```

```final-test main-flow-plain-words
You type "ok, start the build now" after `/to-tickets` has run, instead of a Skill's name. Why doesn't `/implement` start?
- [x] It's a Skill only you can start, by typing its name at the start of a message.
- [ ] It needs `/clear` to run first, and only then will plain words start it.
- [ ] The agent can start it, but only once every Ticket has been triaged.
Why: The junctions on the main flow are yours. The flow never moves on until you type the next Skill's name at the start of your message.
```

```final-test main-flow-flaky-test
On the yoga-studio site, one automated test fails about one run in five, and nobody can see why. What's the route?
- [x] `/diagnosing-bugs`, then `/retro` in the same session.
- [ ] `/triage` it, then wait for an Issue that's ready for an agent.
- [ ] `/grill-with-docs` a plan to rewrite the flaky tests from scratch.
- [ ] `/wayfinder`, since nobody knows where the cause is yet.
Why: diagnosing-bugs builds one command that fails on this bug before it guesses at a cause, then fixes it with a test that guards it. `/retro` in the same session asks what would have prevented it.
```

```final-test main-flow-who-starts
`/implement` is building a Ticket. Which of these can it pull in by itself?
- [x] `/tdd` and `/code-review`, which you or the agent can start.
- [ ] `/retro`, so the session gets reviewed when the build ends.
- [ ] `/to-tickets`, so a Ticket that's too big gets split again.
Why: A Skill only you can start can call the kind the agent can start, but never another of yours. tdd and code-review are the agent's kind; retro and to-tickets are yours to type.
```

```final-test main-flow-ask-when-lost
You've finished the Tickets, but you can't remember whether to clear before building or keep going. What's the quickest reliable move?
- [x] Type `/ask-matt` and describe where you are.
- [ ] Ask the agent in plain words to start whichever Skill comes next.
- [ ] Type `/compact`, which is always safe at any point in a session.
Why: The router knows the whole map, including where to clear, and it names the next step, then stops. Plain words can't start the Skills only you can type, and `/compact` is the last option to reach for, never a mid-phase fix.
```

```sources
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [Skills For Real Engineers (README)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, updated 2026-08-24
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock
- [The /to-spec Skill](https://www.aihero.dev/skills-to-spec), Matt Pocock, updated 2026-08-24
- [Smart zone (AI Coding Dictionary)](https://www.aihero.dev/ai-coding-dictionary/smart-zone), Matt Pocock
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
```
