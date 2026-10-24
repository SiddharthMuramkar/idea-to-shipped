---
title: The main flow
slug: main-flow
order: 12
part: 2
image: /photos/main-flow.jpg
imageAlt: An aerial view of a large highway interchange at sunset with ramps looping over one another.
imageCredit: Denys Nevozhai
---

One map for the whole course: which Skill to type next, from a rough idea to merged code, and what to do with the conversation between steps.

```goals
- You'll be able to walk the Main flow in order and pick the right branch at both of its forks.
- You'll be able to decide what to do with a session at a Phase boundary: carry on, `/clear`, `/handoff`, send work to a subagent, or `/compact`.
- You'll be able to say which Skills only you can start and which the agent can start too, and what that means at every step.
- You'll be able to pick the right on-ramp or side road (`/triage`, `/diagnosing-bugs`, `/wayfinder`, `/improve-codebase-architecture`) and say where it rejoins the Main flow.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Matt Pocock, a developer and teacher, publishes a popular set of Skills for it. A Skill is a short instruction file the agent loads when you type its name, like `/to-spec`, or when a task matches its description. His plugin ships 27 of them, and in his July 2026 walkthrough he says people ask him all the time what order to use them in.

Knowing each Skill isn't enough. Three ways to go wrong with good Skills:

- **The right Skills in the wrong order.** You let the agent interview you about a feature for forty minutes, type `/clear` (which empties the conversation) to "free up space", then `/to-spec`. The spec, a written plan of what to build, comes out vague, because the conversation it writes from is gone.
- **The heavy road for a light job.** A one-button change goes through a spec, five tickets (small tasks) and five sessions (separate Claude Code conversations), when it fitted in the conversation you had.
- **Waiting at a junction.** The interview ends, and you wait for the agent to start the spec. It never will: that Skill only starts when you type it.

The ==Main flow== fixes all three. It's the path most work takes through the Skills, from idea to shipped, drawn as a map with two forks. As Matt put it in that walkthrough: "This is the main flow that all of my work runs through." Each earlier Lesson in Part 2 taught one stretch of the road. This one joins them up, and adds the part no single Skill teaches: ==what to do with the conversation between steps==.

## The map, in order

Before the first run in a repo (a project folder tracked with Git), type `/setup-matt-pocock-skills` once. It records where tickets live (GitHub, GitLab or local Markdown files), which triage labels to use and where the docs go, so the other Skills know where to read and write. [Skills](/learn/skills) covers it. Then:

1. **`/grill-with-docs`.** The agent interviews you until the idea is sharp, writing the project's terms into `GLOSSARY.md` as you go. No repo under you, like a talk or a plan? Use `/grill-me`, which saves nothing. Both run the same interview, `/grilling`. See [Grilling](/learn/grilling) and [Domain modeling](/learn/domain-modeling).
2. **Fork A: can talking settle every question?** Some questions need a runnable answer: a state model, a tricky rule, a screen you have to see. Those take the prototype detour: `/handoff` out (it writes a file a fresh session can read), `/prototype` in that fresh session, then `/handoff` back what you learned. See [Prototype](/learn/prototype).
3. **Fork B: is this a multi-session build?**
   - **No:** type `/implement` right here, in the same conversation.
   - **Yes:** type `/to-spec` to turn the conversation into a spec, then `/to-tickets` to cut it into tickets that each fit one session, each naming the tickets that block it ([Spec + tickets](/learn/spec-and-issues)). Then build them one of two ways. Either `/implement` one ticket at a time, with a `/clear` between tickets, or `/implement-spec`, which hands the whole spec to subagents (helper agents, each with its own fresh memory). They build every unblocked ticket in parallel and land it all on one integration branch (a single shared line of work in Git). See [Implement](/learn/implement).
4. **`/retro`.** After the build, especially a messy one, it reads back over the session and suggests changes to the agent's environment, not your code: pointers to hard-to-find files, automated checks, coding standards, steering files. See [Retro](/learn/retro).

Three Skills run inside those steps without you typing them. `/implement` builds test-first with `/tdd` ([TDD](/learn/tdd)) and closes with `/code-review`, a two-part review against your coding standards and the spec ([Code review](/learn/code-review)). `/implement-spec` has each subagent drive `/tdd`, then runs one review over the integration branch. When the work goes up as a pull request (a PR: a proposed change that's reviewed before it joins the main code), the agent reaches for `/pr` to write the description ([PR + ship](/learn/pr-and-ship)).

Fork B is the split people get wrong most. ==It isn't about how important the work is==; it's about whether the build fits in the room this session has left.

```scene flow
title: The Main flow, start to finish
node: grill | /grill-with-docs
node: proto | Detour: /handoff, /prototype, /handoff back | side
node: fork | Multi-session build?
node: here | No: /implement right here | side
node: spec | Yes: /to-spec, then /to-tickets
node: build | /implement per ticket, or /implement-spec
node: pr | /pr writes the PR body
node: retro | /retro, before you clear
# Every idea starts with an interview. In a repo, that's `/grill-with-docs`, after a one-time `/setup-matt-pocock-skills`.
at: grill
# Fork A: a question talking can't settle takes a detour through a throwaway prototype, then comes back.
at: proto
# Fork B: will building it take more than one session?
at: fork
# No: it fits the room this session has left, so build it here. You still finish with `/pr` and `/retro`.
at: here
# Yes: turn the same conversation into a spec, then tickets. No `/clear` until they exist.
at: spec
# Build ticket by ticket with a `/clear` between, or let `/implement-spec` run them in parallel. `/tdd` and `/code-review` run inside.
at: build
# When the work goes up as a pull request, the agent writes its description with `/pr`.
at: pr
# `/retro` looks back on the session and improves the agent's environment for next time.
at: retro
```

```checkpoint fork-b-recipe
You've grilled a feature for a recipe site: tags, filters, a new database table and an admin page. You judge it will take four or five sessions to build. What do you type next, in the same conversation?
- [ ] `/implement`, and let it run until the session fills up.
  > That's the short road, for work that fits the room this session has left. Four or five sessions of work would push one window deep past its best.
- [ ] `/clear`, then `/to-spec` in a fresh session.
  > Clearing throws away the grilling that `/to-spec` writes from. Stay in this conversation.
- [x] `/to-spec`, then `/to-tickets`.
  > Right. A multi-session build takes Fork B's long road: a spec for the destination, then tickets sized to one session each.
- [ ] `/implement-spec`, straight away.
  > `/implement-spec` builds from a spec and its tickets. Neither exists yet.
```

## Context hygiene: one window, then fresh ones

Everything in a session lives in the agent's ==context window==: its working memory, measured in tokens (small chunks of text, roughly three-quarters of a word each). As the window fills, the model reasons less sharply. Matt calls the part where it still thinks clearly the Smart zone. `/ask-matt` puts it at about 150k tokens on today's best models, and Matt said about 140k in July. It's a limit on quality, not size: current models have million-token windows, and a session can be past its best with most of the window still free. Type `/context` to see how full yours is ([The context window](/learn/context-window) has the detail).

The Main flow spends that budget in a set rhythm:

- **Grill, spec and tickets share one unbroken window.** Don't `/clear` or `/compact` until after `/to-tickets`. `/to-spec` doesn't interview you again. It writes from the conversation, so it needs the reasoning behind each answer, not just the answers.
- **Each `/implement` starts fresh.** Once the tickets exist, everything that matters is written down, so the last ticket's context is disposable. `/clear` (a Built-in command, part of Claude Code rather than a Skill) empties the conversation. You can reopen the old one with `/resume`, but it doesn't come back into the new session.
- **`/retro` runs in the session it reviews, before you clear.** If you've already cleared, point it at that session's log.
- **If grilling nears the Smart zone before `/to-tickets`,** don't push on half-asleep. Type `/compact`, which replaces the history with a summary, at the nearest Phase boundary, then carry on.

```scene meter
title: Context used across a multi-session build (illustrative)
zone: 15
# A fresh session. The dumb zone starts around 15% of a million-token window: about 150k tokens.
fill: 2% | Fresh session
# Grilling with `/grill-with-docs` fills the window a little at a time.
fill: 6% | After /grill-with-docs
# `/to-spec` and `/to-tickets` build on the same conversation, so the reasoning is still there.
fill: 9% | After /to-spec and /to-tickets
# Everything that matters is now in files, so you type `/clear`.
fill: 2% | After /clear
# `/implement` works ticket 1 from its file, test-first, and reviews it.
fill: 7% | Ticket 1 built and reviewed
# `/clear` again, so ticket 2 also starts in the Smart zone.
fill: 2% | After /clear
# Ticket 2 gets the same sharp window as ticket 1.
fill: 7% | Ticket 2 built and reviewed
```

```checkpoint next-ticket
`/implement` has just built and committed ticket 2 of 6 for your recipe site, and it all went smoothly. What's the best next move?
- [x] `/clear`, then `/implement` ticket 3.
  > Right. Each ticket is self-contained and written down, so the last one's context is disposable. A fresh window starts the next ticket in the Smart zone.
- [ ] `/compact`, so ticket 3 can build on ticket 2's details.
  > Ticket 3 works from its own file, and ticket 2's work is in the commit. A summary adds noise without adding anything it needs.
- [ ] Type `/implement` for ticket 3 in the same session.
  > That stacks every ticket into one window, which is how a build drifts out of the Smart zone. Clear between tickets.
- [ ] `/handoff`, then start ticket 3 in a new session.
  > Nothing is travelling to a new tool, folder or colleague, so there's nothing for a handoff file to carry.
```

## Phase boundaries: five choices, in order

Matt splits a session into ==Phases==: chunks of work like the grilling, the implementation or the QA (checking that the built thing works). A Phase ends when you think "OK, we're done with that". The gap between two Phases is the only place to decide what happens to the context. Mid-Phase there's nothing to decide: carry on, or hand what's left to subagents. Compacting mid-Phase makes the agent lose the thread.

At a boundary, ask these in order. The first yes wins.

1. **Can you continue?** Yes if the next Phase needs this one word for word (grilling, then implementing a small change, is the standard case), or if the Smart zone has room for it. It costs nothing, so rule it out first.
2. **Is everything here disposable?** Then `/clear`. It's the cheapest move. Getting it wrong is one-way, though: clear a conversation you still needed and the *why* behind your decisions is gone.
3. **Does something need to travel?** `/handoff` is only for a new harness (the program around the model, say moving from Claude Code to Codex), a new folder or repo, a colleague, or a side task you want to fork off mid-Phase. What it buys is portability.
4. **Can it run AFK?** AFK means away from keyboard: a job tight enough to run with no steering, like an automated review. Send it to a subagent and leave this session alone.
5. **Otherwise, `/compact`,** with an instruction about what's next, such as "next we check the comment box works". It's the default, but not the first reach.

Why that order? Every move except Continue swaps the real conversation for a summary or a blank page. In his April 2026 workshop Matt was blunt: "devs love compacting for some reason, but I hate it." A cleared session starts from a known state; a compacted one can be confidently wrong about a detail the summary dropped.

```checkpoint mid-phase
Halfway through building a ticket, the conversation feels cluttered with test output, and the work isn't finished. What does the Phase boundary advice say to do?
- [ ] `/compact` now, so the rest of the ticket starts clean.
  > Compacting mid-Phase makes the agent lose the thread. The decision belongs at a boundary, not in the middle of the work.
- [ ] `/clear` and restart the ticket from its file.
  > That throws away half a ticket of progress and reasoning. Mid-Phase isn't the place to decide.
- [ ] `/handoff` the rest of the ticket to a fresh session.
  > `/handoff` is for something that has to travel: a new harness, folder or colleague. Nothing here does.
- [x] Carry on, or hand the remaining pieces to subagents.
  > Right. Mid-Phase there are only two moves: continue, or split what's left into subagents. Decide about the context at the boundary.
```

## Who can type what

Matt's Skills split on one question: who can start them. ==User-invoked Skills== only start when you type their name. Model-invoked Skills can also be picked up by the agent when a task fits.

| Only you can start these | You or the agent can start these |
|---|---|
| `/ask-matt` `/setup-matt-pocock-skills` `/grill-with-docs` `/grill-me` `/handoff` `/to-spec` `/to-tickets` `/implement` `/implement-spec` `/retro` `/triage` `/wayfinder` `/improve-codebase-architecture` `/wait-what` `/teach` `/to-questionnaire` | `/grilling` `/domain-modeling` `/prototype` `/tdd` `/code-review` `/pr` `/diagnosing-bugs` `/research` `/wizard` `/codebase-design` `/writing-for-agents` |

Three rules follow, and they shape the whole map:

- **Every junction is yours.** `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement` and `/retro` are all user-invoked, so the flow never moves on until you type the next name, at the start of your message. Writing "now write the spec" in plain words won't start `/to-spec`.
- **User-invoked Skills can call model-invoked ones, never each other.** That's why `/implement` can run `/tdd` and `/code-review` for you, but can't roll on into the next ticket or start `/retro`.
- **Built-in commands aren't Skills.** `/clear`, `/compact`, `/context` and `/resume` come with Claude Code. One name clashes: Claude Code has its own Built-in `/code-review`, a bug hunt. To be sure of Matt's version, type `/mattpocock-skills:code-review`. A hidden Built-in also shadows `/prototype`, and `/mattpocock-skills:prototype` always works.

One quirk to know: some harnesses hide user-invoked Skills from the list the agent sees, so it may tell you `/to-spec` isn't installed. It is. Type it anyway.

```checkpoint chain-rule
`/implement` runs `/tdd` and `/code-review` on its own, but when it finishes it never starts `/retro` for you. Why?
- [ ] `/retro` only works the next day, in a fresh session.
  > The reverse: `/retro` works best in the session it reviews, before you clear.
- [x] User-invoked Skills can call model-invoked ones, never each other.
  > Right. `/tdd` and `/code-review` are model-invoked; `/retro` is user-invoked, so you type it.
- [ ] `/retro` is a Built-in command, so Skills can't call it.
  > It's one of Matt's Skills. Built-in commands are things like `/clear` and `/compact`.
- [ ] `/implement` is model-invoked, and model-invoked Skills can't call any other Skill.
  > `/implement` is user-invoked, and it does call `/tdd` and `/code-review`.
```

## On-ramps, upkeep and side roads

Not all work starts with your own idea. Three on-ramps generate work, then merge onto the Main flow:

- **Bug reports and requests piling up → `/triage`.** It walks issues through triage roles and writes agent-ready briefs that `/implement` later picks up. It's only for issues you didn't create: tickets from `/to-tickets` are already agent-ready, so never triage them. See [Triage](/learn/triage).
- **Something's broken and you can't see why → `/diagnosing-bugs`.** It refuses to theorise until it has a tight feedback loop (one command that goes red on this bug), then fixes it with a regression test (one that fails if the bug ever comes back). Afterwards, run `/retro` in the same session to ask what would have prevented it. See [Diagnosing bugs](/learn/diagnosing-bugs).
- **A huge, foggy effort you can't even plan in one sitting → `/wayfinder`.** It charts a map of decision tickets and resolves them one at a time, producing ==decisions, not code==. When the fog clears, merge at `/to-spec`, never straight into `/implement`. See [Wayfinder](/learn/wayfinder).

**Upkeep.** When you have a spare moment, `/improve-codebase-architecture` surveys the code for places to make it easier for agents to work in. Pick one, and it becomes an idea you take into `/grill-with-docs`. Underneath everything sit two vocabulary Skills that other Skills pull in: `/domain-modeling` for the project's words and `/codebase-design` for the shape of its code. See [Architecture](/learn/architecture).

**Standalones** sit off the map. `/research` sends a background agent to read sources and leave a cited file, which then feeds `/grill-with-docs`. `/to-questionnaire` writes questions for the one person who knows an answer you don't (both live in [Wayfinder](/learn/wayfinder)). `/wizard` scripts the steps only a human can do, like pasting secrets from a dashboard ([Wizard](/learn/wizard)). `/wait-what` re-explains a message that didn't land ([Domain modeling](/learn/domain-modeling)). `/teach` tutors you over several sessions ([Start here](/learn/start-here)), and `/writing-for-agents` guides the files agents read ([Retro](/learn/retro)).

```checkpoint someone-else-knows
You're planning refunds for a small bike shop's site, and only the owner knows the refund rules. She's busy until next week. Which Skill fits?
- [x] `/to-questionnaire`, then wait for her answers
  > Right. When the blocker is in someone else's head, it writes them a questionnaire to fill in. Their answers then feed `/grill-with-docs` or `/to-spec`.
- [ ] `/research`, to find the refund rules online for you
  > `/research` reads published sources. These rules aren't written anywhere; they're in the owner's head.
- [ ] `/grill-me`, and answer the questions as best you can
  > Grilling interviews you, and you don't know the rules. The build would rest on your guesses.
- [ ] `/triage`, so the question gets an agent-ready brief
  > `/triage` sorts incoming issues and requests. Nobody has filed anything.
```

## When you're lost: ask the router

You don't have to memorise any of this. `/ask-matt` is a router: describe where you are, and it names the next Skill or sequence, where to clear or compact, and where your decisions sit. Then it stops, and you type what it named. It's a hand-written map, so where it disagrees with a Skill's own `SKILL.md` file, the Skill wins. The installed build tells it to read that file before describing a Skill; if it doesn't, ask it to.

```scene chat
title: Asking the router about a multi-session build (illustrative)
# You type the router and say where you are. "Just give me the sequence" gets the short form.
you: `/ask-matt` I'm in my recipe site's repo. I want tags and filters, probably three or four sessions of work. Just give me the sequence.
# It places you on the Main flow and names each Skill in order, with the rule about context.
agent: Main flow, in one unbroken context window until the tickets exist. 1. `/grill-with-docs`. 2. If a question needs a runnable answer: `/handoff`, `/prototype` in a fresh session, `/handoff` back. 3. It's multi-session, so `/to-spec`, then `/to-tickets`. Don't clear or compact before this point.
# Then the build and the close-out, with where the clears go.
agent: 4. `/implement` one ticket at a time, with `/clear` between each, or `/implement-spec` for the whole task graph. `/tdd` and `/code-review` run inside. 5. `/pr` shapes the PR body. 6. `/retro` in the same session, before you clear.
# You ask about the one thing that could break the rule.
you: What if the grilling runs long?
# It answers with the Phase boundary rule, not a new plan.
agent: If you near the smart zone (~150k tokens) before `/to-tickets`, don't push on degraded. `/compact` at the nearest phase boundary, with an instruction for what comes next.
# Then it stops. It doesn't start the grilling for you.
agent: Your next step: type `/grill-with-docs` and describe the idea.
```

## How Matt and others use it

**Matt Pocock**, in his July 2026 end-to-end walkthrough:

- He ran `/setup-matt-pocock-skills`, chose local Markdown files for tickets, then asked `/ask-matt` how to start. It told him to walk the flow in one unbroken window.
- He grilled in auto mode (the Claude Code mode where the agent doesn't stop to ask permission for each step), not plan mode (where it only reads and proposes). Six questions; he said his sessions usually run to about twenty.
- He checked his token count before choosing at Fork B. With about 100k of room left, he'd normally type `/implement` there; he took the spec road only to demo it.
- He ran `/to-spec` and `/to-tickets` in the same session, asked for one ticket instead of three, then cleared and typed `/implement`. He clears between tickets.

In October 2026, introducing `/implement-spec`, he called looping tickets by hand the most annoying way to work. He recommends a script that runs `/implement` per ticket, once you've built one, and offers `/implement-spec` as the easier start for AFK work. `/retro`, he said, must stay human-in-the-loop: run it on a sample of sessions, never automatically. And in an April 2026 workshop he drew the line across the whole flow: planning needs a human in the loop; implementation can run AFK.

**Other developers:**

- Colin Eberhardt of Scott Logic rebuilt a real app with the flow in October 2026. `/ask-matt` sent him to `/grill-with-docs`, then came an 80-line spec, eight tickets and `/implement`, with both review axes catching real bugs. His caveat: tailor it, or the steps start to feel like ritual.
- A developer who scripted the loop, one fresh session per ticket, checked their transcripts in September 2026. The bare `/code-review` name had run Claude Code's Built-in twice as often as Matt's. The fix: name Skills in full.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). This takes about fifteen minutes and writes no code.

1. Make a folder, turn it into a Git repo, and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir recipe-box
cd recipe-box
git init
claude
```

2. Type a slash and the word ask. If `ask-matt` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Type this:

```text
/ask-matt I'm in a repo for a small recipe site. Idea: add a "copy link" button to each recipe page. Just give me the sequence: what I type, in order, and where I should /clear or /compact.
```

4. Then this:

```text
Now say the idea is a full meal planner with a database, too big for one session. Same question.
```

5. Then this:

```text
I'm still grilling the meal planner and the session is nearing the smart zone. What do I do?
```

6. Without looking, sketch the map on paper with both forks, then compare it with the map above. If it starts doing work instead of answering, press Esc. Type `/exit` when you're done.

**It's working if:**

- [ ] Both answers start with `/grill-with-docs`, perhaps after a one-time `/setup-matt-pocock-skills`.
- [ ] The small idea goes straight to `/implement`, in the same window.
- [ ] The big idea goes `/to-spec` → `/to-tickets` → `/implement` per ticket with `/clear` between, or `/implement-spec`.
- [ ] It says not to clear or compact until after `/to-tickets`.
- [ ] It puts `/retro` in the same session, before you clear.
- [ ] The third answer says to `/compact` at the nearest Phase boundary, not to push on.
- [ ] It stops after naming what to type, without starting any of it.

If it says some Skills aren't installed, that's the quirk from Who can type what.
````

## Common mistakes

- **Clearing before `/to-tickets`.** The spec and tickets lose the reasoning they're built from.
- **Taking the long road for a short job.** If it fits this session, `/implement` here.
- **Waiting for the agent at a junction, or asking in plain words.** Type the next Skill's name yourself.
- **Typing the next Skill while the agent is still asking you something.** Answer first, or it fills the gap with its best guess (the Site story below has a real case).
- **Reaching for `/compact` first, or mid-Phase, or treating `/handoff` as the general way to change sessions.** Walk the five questions, at the boundary.
- **Triaging your own tickets, or running a `/wayfinder` map straight into `/implement`.**

```site-story
I built the first version of this Lesson in one PR, together with the site's redesign and a photo for every Lesson, using the Main flow itself:

| I typed | What came out |
|---|---|
| "…you can start grilling with docs" | A grilling session, and two new glossary terms: **Main flow** and **Built-in command** |
| `/to-spec` | One spec, in `.scratch/main-flow-and-redesign/spec.md` |
| `/to-tickets` | Five tickets, each naming its blockers |
| `/implement-spec` | A helper agent per ready ticket, each in its own worktree (a separate copy of the repo), all merged into one integration branch |

I never typed `/clear` before the tickets existed. Grilling, spec and tickets stayed in one session, as the rule says.

**My plain-words slip.** I asked for "grilling with docs" in a sentence. The agent can't start a user-invoked Skill, so it ran `/grilling` and then `/domain-modeling`, the two halves `/grill-with-docs` is made of. Same result, in two steps.

**I skipped a question.** `/to-spec` stopped to ask me to check one design choice. I typed `/to-tickets` instead of answering, so the spec went out with the agent's best guess. My rule now: answer the open question before typing the next Skill.

**The build ran itself.** The tickets went 01, then 02, then 03 and 04 together, then 05. The only merge conflict was in the shared photo-credits file. The review found about 15 problems, like the home page calling Skills "commands". One fix-up agent fixed them, and `/pr` wrote the description, calling the change a two-way door: content and CSS only, easy to revert.

**What my v1 build typed, and what I'd type today:**

| My v1 build | Today |
|---|---|
| `/grilling`, then `/domain-modeling` | `/grill-with-docs`: one Skill does both |
| "write the spec", in plain words | `/to-spec`, then `/to-tickets` |
| `/tdd` four times, once per issue | `/implement` per ticket, with `/clear` between |
| `/mattpocock-skills:code-review` at the end | It runs inside each `/implement` |
| The agent ran `gh pr create` | The agent writes the description with `/pr` |
| Nothing after shipping | `/retro`, before clearing |
```

## Cheat sheet

| Situation | Type | Taught in |
|---|---|---|
| A new repo | `/setup-matt-pocock-skills`, once | [Skills](/learn/skills) |
| Not sure what's next | `/ask-matt` | [Skills](/learn/skills) |
| An idea, in a repo | `/grill-with-docs` | [Domain modeling](/learn/domain-modeling) |
| An idea, no repo | `/grill-me` | [Grilling](/learn/grilling) |
| A question you need to see | `/handoff`, `/prototype`, `/handoff` back | [Prototype](/learn/prototype) |
| It fits this session | `/implement`, right here | [Implement](/learn/implement) |
| Multi-session | `/to-spec`, then `/to-tickets`, same window | [Spec + tickets](/learn/spec-and-issues) |
| Tickets ready, you drive | `/implement`, `/clear`, next ticket | [Implement](/learn/implement) |
| Tickets ready, you step away | `/implement-spec` | [Implement](/learn/implement) |
| Inside the build | `/tdd` and `/code-review` run for you | [TDD](/learn/tdd), [Code review](/learn/code-review) |
| Going up as a PR | `/pr` runs for you | [PR + ship](/learn/pr-and-ship) |
| Build finished | `/retro`, before `/clear` | [Retro](/learn/retro) |
| A Phase boundary | Continue? `/clear`? `/handoff`? Subagent? Else `/compact` | [The context window](/learn/context-window) |
| Incoming bugs and requests | `/triage` | [Triage](/learn/triage) |
| A hard bug | `/diagnosing-bugs`, then `/retro` | [Diagnosing bugs](/learn/diagnosing-bugs) |
| Huge and foggy | `/wayfinder`, then `/to-spec` | [Wayfinder](/learn/wayfinder) |
| A spare afternoon | `/improve-codebase-architecture` | [Architecture](/learn/architecture) |

## Final test

```test scenario-fits-one-session
On a book-club site, you've just grilled a small change: show each member's join date on their profile. The session has used about 30k tokens. What do you type next?
- [ ] `/to-spec`, then `/to-tickets`, so the change is written down.
  > That's the long road, worth its cost only when the build spans sessions. This one fits the room you have.
- [x] `/implement`, in this same conversation.
  > Right. Fork B says it fits one session, so build it here, where every decision is still in the window.
- [ ] `/clear`, then `/implement` with a one-line description.
  > Clearing throws away the decisions you just made. The short road keeps them in the same window.
- [ ] `/implement-spec`, so subagents can build it in parallel.
  > `/implement-spec` runs a spec's tickets as a task graph. A one-session change has neither, and needs neither.
```

```test scenario-needs-seeing
Grilling a checkout page, you hit a question you can't answer by talking: one long form, or three short steps? You need to click through both to know. What's the route?
- [ ] Accept the agent's recommendation and settle it during `/implement`.
  > Then the build rests on a choice you couldn't judge. A question you need to see takes the detour first.
- [ ] Run `/to-spec` now and leave the question open for the tickets.
  > The spec would carry a guess. Settle it before the spec, with something runnable.
- [ ] Keep grilling until one option sounds better than the other.
  > Talking harder won't help. Matt calls these ungrillable: they need a runnable answer.
- [x] `/handoff` out, `/prototype` in a fresh session, `/handoff` back.
  > Right. That's Fork A: a throwaway build answers the question, and the handoff file carries the answer back to the idea's thread.
```

```test scenario-step-away
Your spec has nine tickets with blocking edges between them. You'd rather step away than drive each ticket yourself, and you haven't set up a script to loop them. What do you type?
- [x] `/implement-spec`
  > Right. It reads the tickets as a task graph, runs subagents across every unblocked ticket in parallel, and lands it all on one integration branch.
- [ ] `/implement` once, naming all nine tickets
  > One window for nine tickets' worth of work heads straight out of the Smart zone. That's what the tickets were cut to avoid.
- [ ] `/triage`, so each ticket becomes agent-ready
  > `/to-tickets` output is already agent-ready. `/triage` is for issues you didn't create.
- [ ] `/to-tickets` again, merging them into one big ticket
  > Tickets are sized to one session each on purpose. Merging them undoes that.
```

```test sequence-multi-session
In a repo, you're planning a feature that will take several sessions. Which order runs the Main flow correctly?
- [ ] `/to-spec` → `/grill-with-docs` → `/to-tickets` → `/implement` per ticket → `/retro`
  > `/to-spec` writes up a grilled conversation. Before the grilling, there's nothing to write up.
- [ ] `/grill-with-docs` → `/to-tickets` → `/to-spec` → `/implement` per ticket → `/retro`
  > Tickets are cut from the spec, so the spec has to come first.
- [x] `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` per ticket → `/retro`
  > Right. Interview, spec and tickets in one window; then a fresh session per ticket; then look back on the build.
- [ ] `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/retro` → `/implement` per ticket
  > `/retro` looks back on a build. Run before the build, it has nothing to review.
```

```test scenario-near-smart-zone
You're grilling a big feature for a gym's booking site. You've just finished the questions about memberships and are about to start on payments, and the session is nearing the Smart zone. You haven't run `/to-spec` yet. What now?
- [ ] Push on: the window is mostly empty, so there's room to finish.
  > Window size isn't the limit; reasoning quality is. The rest of the grilling and the spec would be built by a duller model.
- [x] `/compact` here, saying what comes next, then carry on.
  > Right. You're at a Phase boundary and the context is still needed, so compact with an instruction ("next we grill payments") and keep going.
- [ ] `/clear`, then start the grilling again from the top.
  > That throws away every decision so far. `/clear` is only for context you'll never need again.
- [ ] `/to-tickets` now, before the window gets any fuller.
  > Tickets come from a spec, and the payments decisions don't exist yet.
```

```test scenario-side-task
Midway through grilling a feature, you notice the login code calls one thing by three different names. You want it tidied up without derailing the grilling. What fits?
- [ ] `/clear`, tidy the names, then start the grilling again.
  > That throws away the grilling so far to fix something unrelated to it.
- [ ] Stop grilling and fix the names in this conversation first.
  > That derails the Phase you're in and fills its window with unrelated work.
- [x] `/handoff` it, and tidy it in a separate session.
  > Right. Forking a side task mid-Phase is one of the four jobs `/handoff` exists for: the file travels, and this session stays on track.
- [ ] `/compact`, so there's room for both jobs in one window.
  > Compacting mid-Phase loses the thread, and it still mixes two jobs in one window.
```

```test sequence-boundary-questions
You've reached a Phase boundary. In what order does Matt's tree have you consider the options?
- [ ] `/compact` → `/clear` → `/handoff` → subagent → continue
  > `/compact` is the default, but it sits last: everything above it is cheaper or more precise.
- [ ] Continue → `/handoff` → `/clear` → subagent → `/compact`
  > `/clear` comes before `/handoff`. `/handoff` is narrow: only when something has to travel.
- [ ] `/clear` → continue → subagent → `/handoff` → `/compact`
  > Continue comes first: it costs nothing and keeps the real conversation, so rule it out before anything else.
- [x] Continue → `/clear` → `/handoff` → subagent → `/compact`
  > Right. Ask in that order and take the first yes. Continue costs nothing; `/compact` is the default when nothing above it fits.
```

```test spot-retro-next-day
Dana finished a messy build late at night and typed `/clear`. Next morning she opened a new session, typed `/retro` with no other instructions, and got back almost nothing useful. Spot the mistake.
- [x] She ran it on an empty session, not the one she cleared.
  > Right. With no session named, `/retro` reviews the current one. Run it before clearing, or point it at the old session's log.
- [ ] `/retro` only works straight after `/diagnosing-bugs`, not after a build.
  > `/retro` is the last step of the Main flow too, after any build, especially a messy one.
- [ ] She should have typed `/handoff` the night before instead of `/clear`.
  > Nothing needed to travel. The fix is to run `/retro` in the session it's reviewing.
- [ ] `/retro` can't read sessions at all; it only reviews the code diff.
  > The reverse: it reads the session itself, which is how it finds what the agent struggled with.
```

```test predict-plain-words
Grilling is done. Instead of typing a Skill's name, you write: "great, now write the spec and split it into tickets". What happens?
- [ ] The agent starts `/to-spec`, then `/to-tickets`, exactly as if you'd typed them.
  > Both are user-invoked, so plain words can't start them.
- [ ] Nothing at all: the agent ignores any request that isn't a Skill name.
  > It will try to help; it just can't load those two Skills to do it.
- [x] It can't start either Skill, so it improvises its own version.
  > Right. User-invoked Skills only start when you type their names. Type `/to-spec`, then `/to-tickets`, at the start of a message.
- [ ] The agent runs `/grill-with-docs` again to check the decisions.
  > Nothing asked for more grilling, and that Skill is user-invoked too, so plain words couldn't start it.
```

```test scenario-agent-may-start
While building a ticket, which of these Skills might the agent start on its own, without you typing it?
- [ ] `/to-tickets`
  > User-invoked: only you can start it.
- [x] `/tdd`
  > Right. `/tdd` is model-invoked, and `/implement` drives it as it builds.
- [ ] `/retro`
  > User-invoked, and it belongs after the build, in the session it reviews.
- [ ] `/implement-spec`
  > User-invoked: only you can start it, and only once a spec and tickets exist.
```

```test spot-triaged-own-tickets
Sam grilled a feature, ran `/to-spec` and `/to-tickets`, then ran `/triage` on the seven new tickets "to make them agent-ready". Spot the mistake.
- [ ] `/triage` should have run before `/to-spec`, not after it.
  > `/triage` isn't a step on the Main flow at all. It's the on-ramp for work that arrives from outside.
- [ ] Sam should have used `/wayfinder` for a build of seven tickets.
  > `/wayfinder` is for efforts you can't plan in one sitting. Sam planned this one fine.
- [ ] `/triage` only accepts one ticket at a time, not seven.
  > It handles a whole backlog. The problem is which tickets went in.
- [x] `/to-tickets` output is already agent-ready.
  > Right. Tickets from `/to-tickets` are born agent-ready. `/triage` is for bug reports and requests that arrive raw.
```

```test spot-map-to-implement
After three weeks with `/wayfinder`, the map for a new booking system has cleared. Ade types `/implement` and points it at the map. Spot the mistake.
- [x] It should merge at `/to-spec`, not `/implement`.
  > Right. `/to-spec` collapses the map's linked decisions into a buildable plan, then `/to-tickets` cuts it into sessions.
- [ ] A cleared map should start over with `/grill-with-docs`.
  > The decisions are already made, on the map. Grilling again repeats the work.
- [ ] Ade should have run `/triage` on the map's tickets first.
  > Those are decision tickets, already resolved. They need collapsing into a spec, not triage.
- [ ] `/wayfinder` should have built the system as it went.
  > Wayfinder produces decisions, not deliverables. It hands off; it doesn't build.
```

```test scenario-flaky-failure
On your recipe site, one check in the automated suite fails about one run in five, and nobody can see why. What's the route?
- [ ] `/triage` it, then wait for an agent-ready brief.
  > `/triage` sorts incoming reports. You already know what's wrong; you need to find out why.
- [ ] `/grill-with-docs` a plan to rewrite the flaky checks from scratch.
  > Rewriting is a guess at the cause. Find the cause first.
- [x] `/diagnosing-bugs`, then `/retro` in the same session.
  > Right. It builds a feedback loop that goes red on this bug before it theorises, fixes it with a regression test, and `/retro` then asks what would have prevented it.
- [ ] `/wayfinder`, since nobody knows where the cause is.
  > `/wayfinder` plans huge efforts. A flaky failure needs a feedback loop, not a map.
```

```test scenario-spare-afternoon
You have a free afternoon, no feature planned, and the code has started to feel tangled for the agent to work in. What fits, and where does its result go?
- [ ] `/retro` on today's session, then `/implement` what it suggests.
  > `/retro` reviews a session that happened. There's no build to look back on.
- [x] `/improve-codebase-architecture`, then `/grill-with-docs` a pick.
  > Right. It surveys the code for places to make it easier to work in; the one you pick becomes an idea that enters the Main flow at the start.
- [ ] `/codebase-design` on its own, then `/implement` the new design at once.
  > `/codebase-design` is vocabulary other Skills pull in, and nothing has been grilled yet.
- [ ] `/diagnosing-bugs` across the whole codebase.
  > Nothing is broken. That Skill needs one bug and a loop that goes red on it.
```

```sources
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the Main flow, forks, context hygiene, on-ramps, codebase health, standalones): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/PHASE-BOUNDARIES.md) (the five options, in order): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md), [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md), [to-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-spec/SKILL.md) and [retro SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) ("Reference": user-invoked vs model-invoked): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), AI Hero docs, updated 2026-08-24, read 2026-10-23 (the hidden-Skills quirk; "It's working if").
- [Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), AI Coding Dictionary, updated 2026-09-24, read 2026-10-23.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (order questions 0:12–0:18, setup 4:35–6:50, `/ask-matt` 7:00–8:24, grilling and auto mode 9:36–10:08, ~140k and normally typing `/implement` 10:28–11:03, spec and tickets in one session 11:19–12:53, clearing 13:55–14:39, review in subagents 14:55–16:08, the quote at 16:33–16:38).
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (spec and tickets 0:28–1:08, three ways to loop tickets 1:08–3:23, `/retro` stays human-in-the-loop 12:48–13:33).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (compacting 10:36, human-in-the-loop vs AFK 26:39–27:07).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [afk.sh: an outer loop for /implement](https://github.com/mattpocock/skills/discussions/1136), GitHub Discussion #1136, 2026-09-28.
```
