---
title: Context hygiene
slug: context-hygiene
summary: When to keep your coding agent's context window and when to clear it: one window from grilling to Tickets, then a fresh one per Ticket.
---

## What context hygiene is

Say an agent has been [grilling](/learn/grill-before-you-build) you about a made-up Booking API, and the Spec, the written plan, comes next. If you run `/clear` now, which empties the window, it forgets most of what you decided. If you never clear, it reasons worse.

**Context hygiene** means choosing on purpose what's in an agent's [context window](/learn/context-window), everything it can see at once. A **session** is one run of the agent.

```checkpoint quick-1
Which of these is context hygiene?
- [x] Deciding on purpose what your agent can see right now.
- [ ] Tidying your repo's code so the agent can read it well.
- [ ] Clearing your agent's window after every message you send.
Why: Context hygiene means choosing on purpose what's in the context window, which is everything an agent can see at once. It isn't about tidy code or constant clearing.
```

On the [main flow](/learn/main-flow), where the grilling becomes a Spec and the Spec is cut into small tasks called Tickets, that means one rule:

**Keep the grilling, the Spec and the Tickets in one unbroken context window, then give each Ticket a fresh window.**

```checkpoint quick-2
The grilling is done, and the Spec is next. Which window does the Spec get?
- [x] The same window as the grilling.
- [ ] A fresh window, like each Ticket.
- [ ] A fresh window with a summary in it.
Why: The grilling, the Spec and the Tickets share one unbroken context window. Only each Ticket gets a fresh one.
```

```diagram
type: chain
caption: "Keep the grilling, the Spec and the Tickets in one unbroken context window"
steps:
  - "the grilling"
  - "the Spec"
  - "the Tickets"
  - label: "each Ticket"
    note: "a fresh window"
groups:
  - from: 1
    to: 3
    label: "one unbroken context window"
```

## One window first

[to-spec](/learn/to-spec) doesn't interview you. It turns the conversation in the current window, plus what it reads in the repo, into a Spec, and [to-tickets](/learn/to-tickets) works from that same conversation. Keep the grilling in the window until both have run, so all three build on the same thinking.

```checkpoint quick-3
You run `/clear` right after the grilling, then `/to-spec`. What does to-spec have to work from?
- [x] Only what's in the repo, as the grilling left the window.
- [ ] The grilling, which it asks you about all over again.
- [ ] The whole grilling, which it reads back from the old session.
Why: to-spec doesn't interview you. It turns the conversation in the current window, plus what it reads in the repo, into a Spec. Once the grilling has left the window, to-spec can't use it, and only the repo is left.
```

**`/compact`** is a slash command that replaces the session's history with a summary. So don't compact or clear until the Tickets exist.

Clear a context that still matters, and you lose the why behind what you built. Reading back the **diff**, the exact lines a change adds and removes, won't return it.

```checkpoint quick-4
You cleared a session that still mattered. What can't the diff give you back?
- [x] The why behind what you built.
- [ ] The lines that the change added.
- [ ] The lines that the change removed.
Why: A diff shows the exact lines a change adds and removes. The why behind them was in the context you cleared.
```

## Then a fresh window

Each Ticket is sized to fit a fresh context window, and it's self-contained. So the last one's context is disposable: `/clear` between Tickets.

```checkpoint quick-5
Ticket #12 is done, and #13 is next. Why is it safe to drop #12's window?
- [x] Each Ticket is self-contained, so #13 works from its own Ticket.
- [ ] The agent keeps a summary of #12 for the next Ticket to read.
- [ ] A window empties by itself as soon as its Ticket is finished.
Why: Each Ticket is self-contained and sized to fit a fresh window. So #13 works from its own Ticket, not from what's left of #12.
```

For example, for the Booking API, you'd type these lines, one after another. The first three share one window, and each `/clear` gives the next Ticket a fresh one. [implement](/learn/implement), the [Skill](/learn/skills) that builds the work a Ticket describes, gets one Ticket at a time (`#12` is a Ticket number).

```
/grill-with-docs
/to-spec
/to-tickets
/clear
/implement #12
/clear
/implement #13
```

## The smart zone

A **model** is the AI that writes replies, such as Claude. Its **smart zone** is the amount of context within which it still reasons well.

You count it in **tokens**: small pieces of text, each roughly part of a word. [ask-matt](/learn/ask-matt), the Skill that says which Skill or Flow fits your situation, puts it at about 150k tokens on today's best models. That's up from about 120k before August 2026.

```checkpoint quick-6
You're judging how much work fits in one sharp session. Which figure do you use?
- [x] About 150k tokens, the smart zone on today's best models.
- [ ] About 120k tokens, the smart zone from before August 2026.
- [ ] As many tokens as the context window can hold, on any model.
Why: ask-matt puts the smart zone at about 150k tokens on today's best models. The 120k figure is the one from before August 2026.
```

A **phase** is a chunk of work inside a session, such as the grilling. A **phase boundary** is the gap between two phases.

Nearing the smart zone's limit before the Tickets exist? Don't push on. Run `/compact` at the nearest phase boundary and carry on. Compacting mid-phase makes the agent lose the thread.

```checkpoint quick-7
You're near the limit, halfway through a phase. Why wait for the phase boundary to compact?
- [x] Compacting mid-phase makes the agent lose the thread.
- [ ] `/compact` won't run until the current phase has ended.
- [ ] Tokens are only counted in the gap between two phases.
Why: Run `/compact` at the nearest phase boundary, then carry on. Mid-phase, the agent would lose the thread of its work.
```

## Handing off

At a phase boundary you can also use [handoff](/learn/handoff), the Skill that writes a summary file so another agent can continue.

A **harness** is the agent tool you run, such as Claude Code. You need handoff only for a new harness, a new folder or repo, a colleague, or a side job you fork off mid-phase.

```checkpoint quick-8
Which of these needs [handoff](/learn/handoff)?
- [x] Passing the work to a colleague who'll finish it.
- [ ] Starting the next Ticket in the same repo and harness.
- [ ] Nearing the smart zone's limit, in the same directory.
Why: You need handoff only for a new harness, a new directory or repo, a colleague, or a side job found mid-phase. Nothing has to travel in the other two.
```

## Going deeper

### Why it exists

A long session gets worse without telling you. The agent forgets an instruction you gave twenty turns ago, or repeats a mistake it had already corrected. There's no error message and no visible boundary.

```checkpoint quick-9
How would you notice a session sliding past the smart zone?
- [x] The agent starts forgetting things and repeating old mistakes.
- [ ] An error message appears as soon as the limit is passed.
- [ ] A visible line shows up in the session as it crosses over.
Why: There's no error message and no visible boundary. You notice it in the agent's work, when it forgets an instruction or repeats a mistake it had already corrected.
```

Matt Pocock, who wrote the Skills in this flow, calls this the **dumb zone**: past the smart zone, the agent gets sloppier and more forgetful. The model's attention gets strained, and it starts making worse decisions.

Matt's number has moved, so don't learn one figure as fact. In May 2026 he put the dumb zone around 120k tokens for most state-of-the-art models. Release 1.2.0, in August 2026, moved the figure from ~120k to ~150k tokens. Today's ask-matt says ~150k. His AI Coding Dictionary gives a range of 125K-150K tokens, and says the figure is debated. The current Skill file decides, so use ~150k, as an estimate.

```diagram
type: chain
caption: "Matt's number has moved"
steps:
  - label: "around 120k tokens"
    note: "In May 2026"
  - label: "from ~120k to ~150k tokens"
    note: "Release 1.2.0, in August 2026"
  - label: "~150k"
    note: "Today's ask-matt"
```

The opposite mistake is clearing too soon. A finished grilling leaves a window full of your design decisions. Matt is blunt about clearing it only to write the Spec: "That's throwing away all your design work."

```checkpoint quick-10
The grilling is over, and you want a clean start before writing the Spec. What does clearing cost you?
- [x] The window full of your design decisions so far.
- [ ] Nothing much, since those decisions are saved for you.
- [ ] Only the tool results, which the Spec doesn't need.
Why: A finished grilling leaves a window full of your design decisions. Clearing it only to write the Spec throws them away.
```

His older posts on this talk about writing a PRD. That was Matt's word for a Spec, and `/to-prd` was the old name of [to-spec](/learn/to-spec).

So keep a window while its decisions still matter, and drop it once they're written down somewhere better.

### How it works underneath

Why does more context hurt? Anthropic's engineers call the effect **context rot**, a term from needle-in-a-haystack studies. Think of asking a model to find one fact in a long text. As the tokens in the window grow, the model gets worse at recalling what's in them.

They trace it to how models are built. Every token attends to every other token, so n tokens make n² pairs. Think of it like a meeting where everyone must listen to everyone: double the people, and you get four times the pairs. The model has an "attention budget", and every new token spends some of it. The dumb zone is how that feels from your side: the felt effect of attention degradation.

```checkpoint quick-11
You double the tokens in a window. What happens to the number of token pairs?
- [x] It grows to four times as many.
- [ ] It doubles, along with the tokens.
- [ ] It stays about the same as before.
Why: n tokens make n² pairs, so twice the tokens means four times the pairs. Think of a meeting where everyone must listen to everyone.
```

That's why the limit isn't the size of the window. The window's limit is where the harness refuses to continue, and quality falls off long before that. So a session can be deep in the dumb zone with most of the window still free. Plan around the smart zone, not the window.

Matt credits Dex Horthy of HumanLayer with the two zones. Dex pushes a 1M window (1 million tokens) to around 300-400K, and stops at around 100K on smaller ones.

Continue costs nothing and loses nothing. Every other move at a phase boundary has a cost. The session as it happened is a [primary source](/learn/prototype), the original thing itself. `/compact` and `/handoff` turn it into a **secondary source**, a summary of the original, which loses detail. `/clear` keeps nothing. So you pay that loss only when staying costs more than it saves.

```checkpoint quick-12
You run `/compact` at a phase boundary. What does the session become?
- [x] A secondary source, with more room but some detail lost.
- [ ] A primary source, kept exactly as the session happened.
- [ ] A Spec, saved to the Issue tracker so nothing is lost.
Why: `/compact` turns the session into a secondary source. You get less noise and more room, but it's lossy.
```

That cost is why the five moves at a boundary come in an order. Work from the top, and the first yes wins:

1. Does the next phase need this session word for word, or does it still fit in the smart zone? Continue.
2. Is everything in this session disposable? `/clear`.
3. Does the work have to travel? `/handoff`.
4. Can the task run with you away from the keyboard? Send it to a [subagent](/learn/grill-before-you-build).
5. None of those? `/compact`.

```checkpoint quick-13
You're at a phase boundary, and the next phase needs this session word for word. Which move fits?
- [x] Continue, and keep the whole session in the window.
- [ ] `/clear`, and start the next phase with nothing.
- [ ] `/compact`, and carry a summary into the next phase.
Why: A next phase that needs this session word for word is a yes to the first question, so you continue. A clear or a summary would lose what it needs.
```

This list is for phases inside one session. Between Tickets, the main flow always clears.

### A real example

How many Tickets does a big job need? In August 2026 Matt posted a sizing tip for [to-tickets](/learn/to-tickets). Guess how many tokens the whole job needs, then divide by 150k, the approximate smart zone. That's how many Tickets you need.

```checkpoint quick-14
By this tip, you guess a job needs about 300k tokens. How many Tickets do you need?
- [x] 2, since 300k divided by 150k is 2.
- [ ] 3, since each Ticket holds about 100k.
- [ ] 1, since one job is always one Ticket.
Why: Guess the tokens the whole job needs and divide by 150k, the approximate smart zone. 300k divided by 150k is 2, so you need 2 Tickets.
```

His worked illustration: "A big refactor might be 1M tokens. That's 6.66 smart zones, so 7 tickets."

So the smart zone limits that first window, and it sets the size of each Ticket.

### Where it goes wrong

**The agent forgets an instruction you gave twenty turns ago.** It has probably drifted past the smart zone. Explaining again feels natural, but it adds more context and makes the problem worse. Compact at the nearest phase boundary instead, or clear if nothing in the session still matters. Don't push through.

```checkpoint quick-15
The agent has forgotten an instruction, and you're about to explain it again. What happens?
- [x] You add more context, which makes the problem worse.
- [ ] The smart zone resets, so the agent sharpens up again.
- [ ] The instruction moves up, so the agent weighs it more.
Why: Past the smart zone, explaining again adds more context and makes the problem worse. Compact at the nearest phase boundary instead, or clear if nothing in the session still matters.
```

**A fresh session is sure of something you never decided.** The summary flattened a decision. Anthropic warns that overly aggressive compaction can lose context whose importance only shows up later. Pass `/compact` an instruction, like `/compact we're going to QA this area`, so the summary keeps what the next phase needs.

**The agent can't say why the code looks the way it does.** You may have cleared a context that still mattered. If you did, go back to it: `/clear` isn't final, and `/resume` reopens the old session.

**The finished code breaks a promise in the Spec.** An Issue on Matt's Skills repo, [#959](https://github.com/mattpocock/skills/issues/959), reports that promises can drop out while the Tickets are written. After a clear, the Spec "is no longer reliably in context". So the next agent follows the Ticket and can ship what the Spec ruled out.

```checkpoint quick-16
A Ticket has dropped one of the Spec's promises, and you've cleared. What's the risk with the next agent?
- [x] It follows the Ticket, and ships what the Spec ruled out.
- [ ] It notices the gap, and adds the promise back by itself.
- [ ] It stops work, because the Spec and the Ticket disagree.
Why: After a clear, the Spec is no longer reliably in context. So the agent follows the Ticket, and can ship what the Spec ruled out.
```

So check before you clear. Go through the Spec's promises, and check that each one is on the Ticket for that part of the work. If one is missing, add it while the grilling is still in the window.

**You don't know when to clear.** [Issue #844](https://github.com/mattpocock/skills/issues/844) on Matt's repo asked exactly this. The reply, marked as generated by AI, gives ask-matt's answer: one window up to the Tickets, then clear between them.

**Two Skills give different numbers.** [wayfinder](/learn/wayfinder) still sizes each of its own tickets to "one 100K token agent session", while ask-matt says ~150k. The 100K is an old number. [Issue #1062](https://github.com/mattpocock/skills/issues/1062) on Matt's repo asks for the change, Matt labelled it a bug, and it was still open in October 2026. So go by ask-matt's figure.

### Try it

Watch a decision disappear from the window. You'll need your practice project, the yoga-studio booking site. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. In your practice project, start a new Claude Code session.
2. Type `A member can book at most two classes a day. Don't save that anywhere.`
3. Type `What's the booking limit?` You should see the agent answer with your two-class limit.
4. Run `/clear`.
5. Type `What's the booking limit?` again. You should see that the agent no longer gives your two-class limit.

The limit lived only in the window, and `/clear` took it. So write down what matters before you clear for real.

### Read more

- [Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), AI Coding Dictionary, Matt Pocock
- [Compaction](https://www.aihero.dev/ai-coding-dictionary/compaction), AI Coding Dictionary, Matt Pocock
- [9 Things People Get Wrong With /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), Matt Pocock, 2026-05-25
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock, 2026-10-29
- [Quick tip when using /to-tickets](https://x.com/mattpocockuk/status/2087111966854730148), Matt Pocock on X, 2026-08-11
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), Anthropic's Applied AI team, 2025-09-29
- [Context engineering with Dex Horthy](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy), Gergely Orosz, The Pragmatic Engineer, 2026-07-15
- [docs: where does /clear fit into the build chain #844](https://github.com/mattpocock/skills/issues/844), owain-williams, 2026-08-12
- [Preserve spec commitments when splitting specs into tickets #959](https://github.com/mattpocock/skills/issues/959), mingjitianming, 2026-08-26
- [wayfinder: two 2025 context-size lines no longer match current models #1062](https://github.com/mattpocock/skills/issues/1062), peekp, 2026-09-09

## Remember

```flashcards
Q: What is the smart zone?
A: The part of the context window within which the model still reasons sharply. ask-matt puts it at about 150k tokens on today's best models; Matt moved it up from about 120k in August 2026.

Q: What do you lose if you clear a context that still matters?
A: The why behind what you built. Reading the diff back won't return it.

Q: At a phase boundary, when do you need handoff?
A: Only for a new harness, a new directory or repo, a colleague, or a side job found mid-phase.

Q: What is context rot?
A: A term Anthropic uses, from needle-in-a-haystack studies: as the tokens in the context window grow, the model gets worse at recalling what's in them. Matt calls how that feels the dumb zone.

Q: At a phase boundary, which move keeps the session itself as a primary source?
A: Continue. `/compact` and `/handoff` swap it for a secondary source, which is lossy but leaves more room. Pay that loss only when staying costs more than it saves.

Q: How does Matt's August 2026 tip turn a job's size into a number of Tickets?
A: Guess the tokens the whole job needs and divide by 150k, the approximate smart zone. A 1M-token refactor is 6.66 smart zones, so 7 Tickets.
```

## Final test

```final-test context-hygiene-first-clear
In the main flow, if the session stays well short of the smart zone limit, when is the first point where you should clear or compact the context window?
- [x] After the Tickets are written.
- [ ] Right after the grilling, before the Spec.
- [ ] Between the Spec and the Tickets.
Why: The grilling, the Spec and the Tickets stay in one unbroken window, so all three build on the same thinking. Only nearing the smart zone limit before then would make you compact earlier.
```

```final-test context-hygiene-between-tickets
You're building a FastAPI backend one Ticket at a time. What do you do with the context window between Tickets?
- [x] Clear it, because each Ticket is self-contained.
- [ ] Keep it, because the next Ticket builds on the last.
- [ ] Compact it, so the next Ticket starts from a summary.
Why: Each Ticket is self-contained, so nothing from the last one needs to carry over. Clearing lets the next Ticket start fresh and work from its own text, not from leftovers or a summary of the last session.
```

```final-test context-hygiene-near-the-limit
Your session is getting close to the smart zone limit, and the Tickets aren't written yet. What should you do?
- [x] Compact at the nearest phase boundary, then carry on.
- [ ] Push on until the Tickets are written, then clear.
- [ ] Compact right away, even in the middle of a phase.
Why: If you push on, the model reasons less sharply. If you compact mid-phase, the agent loses the thread. So wait for the nearest phase boundary, the gap between two phases, then compact there and keep going.
```

```final-test context-hygiene-deeper-moving-number
Matt's figure for the smart zone has changed over time. Which one does the current ask-matt give, and how did it get there?
- [x] About 150k tokens, moved up from about 120k in release 1.2.0, in August 2026.
- [ ] About 120k tokens, moved down from about 150k in release 1.2.0, in August 2026.
- [ ] About 100k tokens, the size of one agent session, as wayfinder still says.
Why: In May 2026 Matt put the limit around 120k tokens. Release 1.2.0 moved the figure up to about 150k, and that's what ask-matt says today. wayfinder's 100K line is an old number that issue #1062 asks to change.
```

```final-test context-hygiene-deeper-window-still-free
Why can a session be deep in the dumb zone while most of its context window is still free?
- [x] Recall gets worse as tokens pile up, long before the window's hard limit is reached.
- [ ] The harness keeps most of the window back for tool results that haven't come in yet.
- [ ] The window is counted in words, but the smart zone is counted in tokens, so they differ.
Why: The model recalls less well as the tokens in the window grow, which Anthropic calls context rot. The window's limit only marks where the harness refuses to continue. Quality falls off long before that, so the window can look roomy while the model is already slipping.
```

```sources
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [Smart zone | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/smart-zone), Matt Pocock
- [9 Things People Get Wrong With /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), Matt Pocock, 2026-05-25
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [Matt Pocock on X: Quick tip when using /to-tickets](https://x.com/mattpocockuk/status/2087111966854730148), Matt Pocock, 2026-08-11
- [Compaction | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/compaction), Matt Pocock
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), Anthropic Applied AI team, 2025-09-29
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer (Gergely Orosz) with Matt Pocock, 2026-09-17
- [Context engineering with Dex Horthy](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy), Gergely Orosz, 2026-07-15
- [Hooks reference](https://code.claude.com/docs/en/hooks), Anthropic
- [Preserve spec commitments when splitting specs into tickets #959](https://github.com/mattpocock/skills/issues/959), mingjitianming, 2026-08-26
- [docs: where does /clear fit into the build chain #844](https://github.com/mattpocock/skills/issues/844), owain-williams, 2026-08-12
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [wayfinder: two 2025 context-size lines no longer match current models #1062](https://github.com/mattpocock/skills/issues/1062), peekp, 2026-09-09
```
