---
title: The main flow
slug: main-flow
order: 11
image: /photos/main-flow.jpg
imageAlt: An aerial view of a large highway interchange at sunset with ramps looping over one another.
imageCredit: Denys Nevozhai
---

## What it is

The **Main flow** is the road most work takes through Matt Pocock's Skills, from an idea to shipped code. Think of it as a map: you're in this situation, so you type that Skill next. It's the map I wish I'd had as a beginner.

Lessons 0–10 follow the order I happened to use while building v1. Since then, Matt has folded those steps into fewer, bigger Skills. This Lesson is the up-to-date map. The table at the end of "When to use it" translates the old Lessons into today's Skills.

Sources: Matt's video [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM) (2026-07-16), and the `ask-matt` Skill that comes with the Skills (version 1.3.1, read on 2026-10-22). `/implement-spec` arrived after the video, in v1.3, so for that one the `ask-matt` Skill is the source.

**The path, in order:**

1. **`/grill-with-docs`**: the agent interviews you until the idea is sharp. As it goes, it writes the words you agree on into `GLOSSARY.md` and the big decisions into ADRs.
2. **Fork 1: can every question be settled by talking?**
   - Yes: carry on.
   - No, you need to *see* something run (a screen, some tricky logic): `/prototype` builds a small throwaway program that answers the question. Matt bridges the trip with `/handoff`, out to the prototype and back again, because a prototype lives in its own folder.
3. **Fork 2: is this a multi-session build?** In other words, is it too big for one sitting?
   - Yes: `/to-spec` turns the conversation into a spec, then `/to-tickets` splits the spec into small tickets, each saying which tickets block it. Then build them one of two ways:
     - **`/implement`** on one ticket at a time, with a `/clear` between tickets. You drive.
     - **`/implement-spec`** on the whole spec in one go. It sends helper agents to every ticket that's ready, in parallel, and lands everything on one **integration branch**. You watch.
   - No: **`/implement`** right away, in the same session.
4. **Build and review.** Either way, the code gets written with `/tdd` (one failing test, then just enough code to pass it) and checked with `/code-review`. You don't type these two. `/implement` runs both for each ticket. `/implement-spec`'s helpers each run `/tdd`, and it runs one `/code-review` over everything at the end.
5. **`/pr`** writes the pull request description when the work goes up as a PR. The agent reaches for it on its own.
6. **`/retro`** looks back over the session and suggests changes to your setup (checks, coding rules, notes for the agent), so the next build starts from a better place.

The same path as a picture:

```
/grill-with-docs
  │
  ├─ a question needs code? → /prototype
  │
  ├─ multi-session build?
  │    yes → /to-spec → /to-tickets
  │          → /implement per ticket
  │            or /implement-spec
  │    no  → /implement
  │
  └─ /tdd + /code-review run inside
       → /pr → /retro
```

## When to use it

**You're in this situation → type this:**

| You're in this situation | Type this |
|---|---|
| You don't know which Skill fits | `/ask-matt`, then describe where you are. It's a router: it points you at the right Skill. |
| You have an idea and a repo to build it in | `/grill-with-docs` |
| A question can't be settled by talking | `/prototype` |
| The grilling is done, and it's too big for one session | `/to-spec`, then `/to-tickets` |
| You have tickets and want to drive each one | `/implement` on one ticket, `/clear`, next ticket |
| You have tickets and want them built in one run | `/implement-spec` |
| The job is small enough for this session | `/implement` |
| Something's broken and you can't see why | `/diagnosing-bugs` |
| Bug reports and requests from other people are piling up | `/triage`. Not for tickets `/to-tickets` made: those are ready already. |
| The work is going up as a pull request | Nothing: the agent uses `/pr` itself |
| A build just finished, especially a messy one | `/retro`, in the same session, before you `/clear` |

**Who starts what.** Some Skills only start when *you* type them. The agent never starts them on its own. On the Main flow, those are:

- `/ask-matt`
- `/grill-with-docs`
- `/to-spec`
- `/to-tickets`
- `/implement`
- `/implement-spec`

`/triage` and `/retro` are the same: only you can start them. So when the grilling ends, don't wait for the agent to begin the spec. It won't. Type `/to-spec`.

The other Skills, the agent picks up on its own when the job fits: `/tdd`, `/code-review`, `/prototype`, `/diagnosing-bugs`, `/pr`, `/domain-modeling`, `/wizard` and `/research`. You can still type them yourself whenever you like.

**Built-in commands are not Skills.** `/clear` and `/compact` come with Claude Code itself, not with Matt's Skills. The Main flow uses both:

- **`/clear`** empties the conversation. The agent forgets everything said so far and starts fresh. The old session isn't deleted; you can go back to it.
- **`/compact`** squeezes the conversation into a summary and carries on from that summary. It's handy, but some detail is always lost.

**The rule: keep the grilling, the spec and the tickets in one session. `/clear` only after `/to-tickets`.** `/to-spec` doesn't interview you again. It writes the spec from the conversation it can see. Clear before it, and the *why* behind every answer you gave is gone. After `/to-tickets`, everything that matters is written down in the spec and the tickets, so each `/implement` can start clean.

**The smart zone.** A model only thinks sharply for so long. Per `ask-matt`, that's roughly the first 150,000 tokens of a session (a token is a small piece of a word). Matt calls this window the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone). If a session gets close to it before `/to-tickets`, don't push on half-asleep: `/compact` at the end of a step (say, right after the grilling) and carry on from there.

**If you read Lessons 0–10:** here's what they typed, and what you'd type today.

| The old Lessons typed | Today, type | What changed |
|---|---|---|
| `/grilling` (Lesson 1), then `/domain-modeling` (Lesson 2) | `/grill-with-docs` | One Skill does both: the interview, plus the glossary and ADRs |
| `write the spec` (Lesson 3) | `/to-spec`, then `/to-tickets` | The spec and the tickets are now two named Skills |
| `/tdd` ×4 (Lesson 6), then `/code-review` (Lesson 7) | `/implement` per ticket, or `/implement-spec` | Both run `/tdd` and `/code-review` for you |
| `gh pr create`, done by the agent (Lesson 8) | Nothing: the agent uses `/pr` | `/pr` shapes the PR description |
| `/wizard` (Lesson 4), `/prototype` (Lesson 5), `/diagnosing-bugs` (Lesson 9) | The same | `/prototype` is now fork 1 of the Main flow |

## What I typed

This Lesson and the site's new look were built as one PR, with the Main flow itself:

| # | I typed | What came out |
|---|---|---|
| 1 | "I want to create a PR which teaches [Matt's video] … you can start grilling with docs" | A grilling session: Lesson 11, a redesign in the style of GE's sites, photos, motion on scroll. Two new glossary terms: **Main flow** and **Built-in command** |
| 2 | `/to-spec` | One spec: `.scratch/main-flow-and-redesign/spec.md` |
| 3 | `/to-tickets` | 5 tickets with their blockers: 01 design, then 02 Lesson photos, then 03 home page and 04 this Lesson, then 05 scroll motion |
| 4 | `/implement-spec` | A helper agent per ready ticket, each in its own worktree, all merged into the `main-flow-and-redesign` integration branch |

I never typed `/clear`. Steps 1 to 3 stayed in one session, as the rule says.

## What happened

*Draft: I'll finish this section after the build, once I know how `/implement-spec` and the final `/code-review` went.*

**1. I said "grilling with docs" in plain words, not as a Skill.** Because `/grill-with-docs` only starts when *you* type it, the agent couldn't run it. It ran `/grilling` and then `/domain-modeling` instead, the two halves `/grill-with-docs` is made of. Same result, but if I'd typed `/grill-with-docs` myself, it would have been one step.

**2. I changed my mind about where this Lesson goes.** First I asked for a new Lesson 0, then for "the last lesson". It became Lesson 11. The old Lessons kept their numbers, and Comments are attached to a Lesson's Slug, which never changes, so nothing broke.

**3. I wasn't sure typing a Skill counted as a "yes".** I typed `/to-spec` and `/to-tickets`, then asked whether the tickets had really been made, because I'd never said "yes" to the spec. Typing the Skill *is* the yes. The spec and all five tickets were already sitting in `.scratch/`.

**4. I asked when to run `/code-review`:** now, or after the tickets? Neither, by hand. `/implement-spec` runs one `/code-review` over the integration branch once every ticket is done.

*Still to write: how the build went, what the review found, and what I'd do differently next time.*
