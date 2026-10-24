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

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Matt Pocock, a developer and teacher, publishes a popular set of Skills for it. A Skill is a short instruction file the agent loads when you type its name, like `/to-spec`, or when a task matches its description. His plugin (one package that installs them all) ships 27, and in his July 2026 walkthrough he says people constantly ask what order to use them in.

Three ways to go wrong with good Skills:

- **The right Skills in the wrong order.** You let the agent interview you about a feature for forty minutes, type `/clear` (which empties the conversation) to "free up space", then `/to-spec`. The spec, a written plan of what to build, comes out vague, because the conversation it writes from is gone.
- **The heavy road for a light job.** A one-button change goes through a spec, five tickets (small tasks) and five sessions (separate Claude Code conversations), when it fitted in the conversation you had.
- **Waiting at a junction.** The interview ends, and you wait for the agent to start the spec. It never will: that Skill only starts when you type it.

The ==Main flow== fixes all three. It's the path most work takes through the Skills, from idea to shipped, drawn as a map with two forks. As Matt put it in that walkthrough: "This is the main flow that all of my work runs through." This Lesson joins up the stretches the rest of Part 2 taught, and adds the part no single Skill teaches: ==what to do with the conversation between steps==.

## The map, in order

Before the first run in a repo (a project folder tracked with Git, the tool that records every change), type `/setup-matt-pocock-skills` once. It records where tickets and docs live and which labels to use ([Skills](/learn/skills) covers it). Then:

1. **`/grill-with-docs`.** The agent interviews you until the idea is sharp, writing the project's terms into `GLOSSARY.md` as you go. No repo under you, like a talk or a plan? Use `/grill-me`, which saves nothing. Both run the same interview, `/grilling`. See [Grilling](/learn/grilling) and [Domain modeling](/learn/domain-modeling).
2. **Fork A: can talking settle every question?** Some questions need a runnable answer: a state model (how a booking moves from held to paid), a tricky rule, a screen you have to see. Those take the prototype detour: type `/handoff`, which writes a summary file, and copy the path it shows. In a second terminal window, `cd` into the project and start `claude`, so the grilling stays open in the first. Type `/prototype` and paste the path. Once that's answered, `/handoff` back what you learned and ask the first window to read the new file. See [Prototype](/learn/prototype).
3. **Fork B: is this a multi-session build?**
   - **No:** type `/implement` right here, in the same conversation.
   - **Yes:** type `/to-spec` to turn the conversation into a spec, then `/to-tickets` to cut it into tickets that each fit one session, each naming the tickets that block it ([Spec + tickets](/learn/spec-and-issues)). Then either `/implement` one ticket at a time, with a `/clear` between tickets, or `/implement-spec`, which hands the whole spec to subagents (helper agents, each with its own fresh memory) that build every unblocked ticket in parallel on one integration branch (a single shared line of work in Git). See [Implement](/learn/implement).
4. **`/retro`.** After the build, especially a messy one, it reviews the session and proposes fixes to the agent's environment, such as automated checks or coding standards, rather than to your code. See [Retro](/learn/retro).

Three Skills run inside step 3 without you typing them. `/implement` is told to build test-first with `/tdd` (a failing check first, then the code that passes it; see [TDD](/learn/tdd)) where it can, at agreed seams (the places in the code tests check from). `/to-spec` checks them with you. On the short road no spec has, so answer when `/tdd` asks which seams to test; agreed nowhere, `/implement` may just write the code. It closes with `/code-review`, a two-part review against your coding standards and the spec ([Code review](/learn/code-review)). `/implement-spec` has each subagent drive `/tdd`, then runs one review over the integration branch. When the work goes up as a pull request (a PR: a proposed change that's reviewed before it joins the main code), the agent reaches for `/pr` to write the description ([PR + ship](/learn/pr-and-ship)).

As of October 2026, the review can misfire: run before the work is committed (saved in Git), or reach Claude Code's own `/code-review`; if no Standards and Spec sections come back, let `/implement` commit, `/clear`, then type `/mattpocock-skills:code-review` ([Implement](/learn/implement)). One developer's September logs (below) showed `/tdd` never loading, before an October fix told `/implement` to load it. If no failing test comes first anyway, ask for "the tdd Skill" in plain words: the agent can start that one itself.

Fork B ==isn't about how important the work is==; it's about whether the build fits in the room this session has left: the agent's working memory (its context window), which fills as you work.

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
# No: it fits the room this session has left, so build it here. You still finish with `/retro`, and `/pr` if it goes up as a pull request.
at: here
# Yes: turn the same conversation into a spec, then tickets. No `/clear` until they exist.
at: spec
# Build ticket by ticket with a `/clear` between, or let `/implement-spec` run them in parallel. `/tdd` (at the agreed seams) and `/code-review` run inside.
at: build
# When the work goes up as a pull request, the agent writes its description with `/pr`.
at: pr
# Step 4: `/retro` looks back on the session and improves the agent's environment for next time.
at: retro
```

```checkpoint fork-b-recipe
You've grilled a feature for a recipe site: tags, filters, a new database table and an admin page. You judge it will take four or five sessions to build. What do you type next?
- [ ] `/implement`, and let it run until the session fills up.
  > That's the short road, for work that fits the room this session has left. Four or five sessions of work would overfill one session's working memory, far past where it reasons well.
- [ ] `/clear`, then `/to-spec` in a fresh session.
  > Clearing throws away the grilling that `/to-spec` writes from. Stay in this conversation.
- [x] `/to-spec`, then `/to-tickets`, in this conversation.
  > Right. A multi-session build takes Fork B's long road, in the same conversation: a spec for the destination, then tickets sized to one session each.
- [ ] `/implement-spec`, straight away.
  > `/implement-spec` builds from a spec and its tickets. Neither exists yet.
```

## Context hygiene: one window, then fresh ones

Everything in a session lives in the agent's ==context window==: its working memory, measured in tokens (small chunks of text, roughly three-quarters of a word each). As the window fills, the model reasons less sharply. Matt calls the part where it still thinks clearly the Smart zone, and what lies past it the dumb zone. Matt's router Skill, `/ask-matt` (it tells you which Skill to type next; more below), puts the line at about 150k tokens on today's best models, as a rule of thumb. It's a limit on quality, not size: a session can be past its best with most of a million-token window still free. Type `/context` to see how full yours is ([The context window](/learn/context-window) has the detail).

The Main flow spends that budget in a set rhythm:

- **Grill, spec and tickets share one unbroken window.** Don't `/clear` or `/compact` (which swaps the history for a summary) until after `/to-tickets`. `/to-spec` doesn't interview you again. It writes from the conversation, so it needs the reasoning behind each answer, not just the answers.
- **Each ticket's `/implement` starts fresh.** Once the tickets exist, everything that matters is written down, so the last ticket's context is disposable. `/clear` empties the conversation; `/resume` can still reopen the old one, as its own session.
- **`/retro` runs in the session it reviews, before you clear.** In a ticket-by-ticket build, that's a messy ticket's session. Already cleared? Type `/retro` with the session you mean, such as "yesterday's ticket 3": it searches the logs Claude Code keeps on your computer.
- **If grilling nears the end of the Smart zone before `/to-tickets`,** don't push on half-asleep. Type `/compact` at the nearest Phase boundary (a natural break between chunks of work, covered below), then carry on.

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
# `/clear` again, so ticket 2 starts from an empty window too, carrying nothing from ticket 1.
fill: 2% | After /clear
# Ticket 2 gets the same sharp window as ticket 1.
fill: 7% | Ticket 2 built and reviewed
```

```checkpoint next-ticket
`/implement` has just built and committed ticket 2 of 6 for your recipe site, at about 115k tokens. Ticket 3 is blocked by ticket 2: it adds filters on top of the tags ticket 2 built. What's the best next move?
- [x] `/clear`, then `/implement` ticket 3 from its own file.
  > Right. Ticket 3 needs ticket 2's code, and that's in the commit. Its file says what to build, so the conversation is disposable, and a fresh window starts it in the Smart zone.
- [ ] `/compact`, so ticket 3 keeps a summary of how the tags work.
  > The tags are in the committed code, where ticket 3 can read them. A summary of the conversation adds noise, not anything it needs.
- [ ] Carry on in this session, since ticket 3 builds on ticket 2's work.
  > Building on ticket 2's work means building on its code, which is committed. At 115k, ticket 3 would also end past the Smart zone.
- [ ] `/handoff`, then start ticket 3 in a new session.
  > Nothing is travelling to a new tool, folder or colleague, so there's nothing for a handoff file to carry.
```

## Phase boundaries: five choices, in order

Matt splits a session into ==Phases==: chunks of work like the grilling, the implementation or the QA (checking that the built thing works). A Phase ends when you think "OK, we're done with that", and the line is fuzzy on purpose: in a long grilling, finishing one whole topic can count. The gap between two Phases is the only place to decide about the context. Mid-Phase, the work in hand has two moves: carry on, or hand what's left to subagents; compacting there makes the agent lose the thread.

At a boundary, ask these five questions in order. The first yes wins.

1. **Can you continue?** Yes if the next Phase needs this one word for word (grilling, then implementing a small change, is the standard case), or if the Smart zone has room for it. It costs nothing, so rule it out first. One limit comes from `/ask-matt`'s context rule, not the five questions: near the Smart zone's end before `/to-tickets`, don't push on, even if the next Phase needs this one.
2. **Is everything here disposable?** Then `/clear`. It's the cheapest move. Getting it wrong is one-way, though: clear a conversation you still needed and the *why* behind your decisions is gone from the session you carry on in.
3. **Does something need to travel?** `/handoff` is only for a new harness (the program around the model: moving from Claude Code to OpenAI's Codex, say), a new folder or repo, a colleague, or a side task you fork off mid-Phase, like the prototype detour. What it buys is portability.
4. **Can it run AFK?** AFK means away from keyboard: a job tight enough to run with no steering, like an automated review. Ask in plain words ("use a subagent to review today's changes") and leave this session alone.
5. **Otherwise, `/compact`,** with an instruction about what's next, such as "next we QA the tag filters". It's the default, but not the first reach.

Why that order? Every move except Continue hands the next step a summary or a blank page instead of the real conversation. In his April 2026 workshop Matt was blunt: "devs love compacting for some reason, but I hate it." A cleared session starts from a known state; a compacted one can be confidently wrong about a detail the summary dropped.

```checkpoint mid-phase
Halfway through building a ticket, the conversation feels cluttered with test output, and the work isn't finished. What does the Phase boundary advice say to do?
- [ ] `/compact` now, so the rest of the ticket starts clean.
  > Compacting mid-Phase makes the agent lose the thread. The decision belongs at a boundary, not in the middle of the work.
- [ ] `/clear` and restart the ticket from its file.
  > That throws away half a ticket of progress and reasoning. Mid-Phase isn't the place to decide.
- [ ] `/handoff` the rest of the ticket to a fresh session.
  > `/handoff` is for something that travels: a new harness, folder or colleague, or a separate side task. The rest of this ticket is none of those.
- [x] Carry on, or split what's left between subagents.
  > Right. For the work you're in the middle of there are two moves: continue, or split what's left into subagents. Decide about the context at the boundary.
```

## Who can type what

Matt's Skills split on one question: who can start them. ==User-invoked Skills== only start when you type their name. Model-invoked Skills can also be picked up by the agent when a task fits.

| Only you can start these | You or the agent can start these |
|---|---|
| `/ask-matt` `/setup-matt-pocock-skills` `/grill-with-docs` `/grill-me` `/handoff` `/to-spec` `/to-tickets` `/implement` `/implement-spec` `/retro` `/triage` `/wayfinder` `/improve-codebase-architecture` `/wait-what` `/teach` `/to-questionnaire` | `/grilling` `/domain-modeling` `/prototype` `/tdd` `/code-review` `/pr` `/diagnosing-bugs` `/research` `/wizard` `/codebase-design` `/writing-for-agents` |

Three rules follow:

- **Every junction is yours.** `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement` and `/retro` are all user-invoked, so the flow never moves on until you type the next name, at the start of your message. Writing "now write the spec" in plain words won't start `/to-spec`.
- **User-invoked Skills can call model-invoked ones, never each other.** That's why `/implement` can run `/tdd` and `/code-review` for you, but can't start `/retro`.
- **Built-in commands aren't Skills.** `/clear`, `/compact`, `/context` and `/resume` come with Claude Code. Two names clash. Claude Code has its own Built-in `/code-review`, a bug hunt; to be sure of Matt's version, type `/mattpocock-skills:code-review`. A hidden Built-in also takes the name `/prototype`, and `/mattpocock-skills:prototype` always works.

One quirk: Claude Code hides user-invoked Skills from the agent, so it may say `/to-spec` isn't installed. It is. Type it anyway.

```checkpoint chain-rule
`/triage`, which sorts incoming bug reports, has just written a brief an agent could build from. You expected it to go straight on and start `/implement`, but it stops. Why?
- [ ] `/triage` only sorts issues; it can't call any other Skill.
  > It can call model-invoked ones: it pulls in `/grilling` when a report needs fleshing out. `/implement` isn't one of those.
- [x] `/implement` is user-invoked too, and those never start each other.
  > Right. A user-invoked Skill can call model-invoked ones only. The brief waits for you to type `/implement`.
- [ ] Briefs need `/to-tickets` first, and only you can type that.
  > A triage brief is ready for `/implement` as it is. `/to-tickets` is for cutting up your own plans.
- [ ] `/implement` only works on tickets from `/to-tickets`, never on briefs.
  > `/implement` picks up triage's briefs too. What stops it here is who's allowed to start it.
```

## On-ramps, upkeep and side roads

Three on-ramps start from a situation rather than a sharp idea you can plan in one sitting, then merge onto the Main flow:

- **Bug reports and requests piling up → `/triage`.** It checks and tags each incoming issue, and writes a brief for each one that's ready, clear enough for `/implement` to pick up. It's only for issues you didn't create: tickets from `/to-tickets` are born agent-ready, so never triage them. See [Triage](/learn/triage).
- **Something's broken and you can't see why → `/diagnosing-bugs`.** It won't guess at a cause until it has a tight feedback loop: one command that fails on this exact bug. Then it fixes the bug and adds a regression test (one that fails if the bug ever comes back). Once it's fixed, type `/retro` in that session to find what would have stopped the bug. See [Diagnosing bugs](/learn/diagnosing-bugs).
- **A huge, foggy effort you can't even plan in one sitting → `/wayfinder`.** It lays out a map of decision tickets (one open question each) and settles them one per session, producing ==decisions, not code==. When the fog clears, merge at `/to-spec`, not straight into `/implement`, unless the effort turned out small. See [Wayfinder](/learn/wayfinder).

**Upkeep.** When you have a spare moment, `/improve-codebase-architecture` surveys the code for places to make it easier for agents to work in, writes a report, and grills you on the one you pick. That gives you an idea: take it into the Main flow at `/grill-with-docs`, as `/ask-matt` says, or straight to `/to-spec` if that grilling already settled it. Underneath everything sit two vocabulary Skills that other Skills pull in: `/domain-modeling` for the project's words and `/codebase-design` for the shape of its code. See [Architecture](/learn/architecture).

**Standalones** sit off the map. `/research` has a background agent read sources and leave a cited file. `/to-questionnaire` writes questions for the one person who knows an answer you don't (both in [Wayfinder](/learn/wayfinder)). `/wizard` scripts the steps only a human can do, like pasting secrets from a dashboard ([Wizard](/learn/wizard)). `/wait-what` re-explains a message that didn't land ([Domain modeling](/learn/domain-modeling)); `/teach` tutors you ([Start here](/learn/start-here)); `/writing-for-agents` guides the files agents read ([Retro](/learn/retro)).

```checkpoint someone-else-knows
You're planning refunds for a small bike shop's site, and only the owner knows the refund rules. She's busy until next week. Which Skill fits?
- [x] `/to-questionnaire`, so she can answer when she's free
  > Right. When the blocker is in someone else's head, it writes them a questionnaire to fill in. Their answers then feed `/grill-with-docs` or `/to-spec`.
- [ ] `/research`, to find the refund rules online for you
  > `/research` reads published sources. These rules aren't written anywhere; they're in the owner's head.
- [ ] `/grill-with-docs`, and answer the questions as best you can
  > Grilling interviews you, and you don't know the rules. The build would rest on your guesses.
- [ ] `/triage`, so the question gets an agent-ready brief
  > `/triage` sorts incoming issues and requests. Nobody has filed anything.
```

## When you're lost: ask the router

`/ask-matt` is a router: describe where you are, and it names the next Skill or sequence, and where to clear or compact. Then it stops, and you type what it named. It's a hand-written map: where it disagrees with a Skill's own instruction file, `SKILL.md`, the Skill wins, so if it doesn't read that file first, ask it to.

```scene chat
title: Asking the router about a multi-session build (illustrative)
# You type `/ask-matt` and say where you are. "Just give me the sequence" gets the short form.
you: `/ask-matt` I'm in my recipe site's repo. I want tags and filters, probably three or four sessions of work. Just give me the sequence.
# It places you on the Main flow and names steps 1 to 3, with the rule about context.
agent: Main flow, in one unbroken context window until the tickets exist. 1. `/grill-with-docs`. 2. If a question needs a runnable answer: `/handoff`, `/prototype` in a fresh session, `/handoff` back. 3. It's multi-session, so `/to-spec`, then `/to-tickets`. Don't clear or compact before this point.
# Step 3 carries on into the build, with where the clears go. Step 4 closes the loop.
agent: Still step 3: `/implement` one ticket at a time, with `/clear` between each, or `/implement-spec` for the whole spec in one run. `/tdd` and `/code-review` run inside, and `/pr` shapes the PR body. 4. `/retro` in the same session, before you clear.
# You ask about the one thing that could break the rule.
you: What if the grilling runs long?
# It answers with the Phase boundary rule, not a new plan.
agent: If you get close to the smart zone's limit (~150k tokens) before `/to-tickets`, don't carry on with a duller model. Use `/compact` at the nearest phase boundary, and tell it what comes next.
# Then it stops. It doesn't start the grilling for you.
agent: Your next step: type `/grill-with-docs` and describe the idea.
```

## How Matt and others use it

**Matt Pocock**, in his July 2026 end-to-end walkthrough:

- After `/setup-matt-pocock-skills`, he asked `/ask-matt` how to start. It told him to walk the flow in one unbroken window.
- He grilled in auto mode (where Claude Code skips routine permission prompts), not plan mode (where it only reads and proposes).
- With about 100k of room left, he'd normally have typed `/implement`; he took the spec road only to demo it, with `/to-spec` and `/to-tickets` in the same session, then a clear before `/implement`. He clears between tickets.

In October 2026 he called looping tickets by hand the most annoying way to work. He recommends a script that runs `/implement` per ticket, but it takes patience to set up, so `/implement-spec` is the easier start for AFK work. `/retro`, he said, must stay human-in-the-loop: run it on a sample of sessions, never automatically.

**Other developers:**

- Colin Eberhardt of Scott Logic rebuilt a real app with the flow in October 2026. `/ask-matt` sent him to `/grill-with-docs`, then came an 80-line spec, eight tickets and `/implement`. His caveats: tailor the Skills to your project, and don't hand your judgement to the agent, or the steps turn into ritual.
- A developer who scripted the loop, one fresh session per ticket, checked 173 session transcripts in September 2026. `/tdd` had never run, and `/implement`'s own review call reached Claude Code's Built-in twice as often as Matt's. Their next prompt named each Skill in full, like `mattpocock-skills:tdd`, still untested when they posted.

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

2. At Claude Code's prompt, type a slash and the word ask, check that `ask-matt` is in the list that pops up, then delete what you typed. If it isn't in the list, type `/exit`, run this in your terminal, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Type this. It should only answer: if it starts doing work instead (creating files, running setup), press Esc to stop it, or choose No if it asks permission.

```text
/ask-matt I'm in a repo for a small recipe site. Idea: add a "copy link" button to each recipe page. Just give me the sequence: what I type, in order, and where I should /clear or /compact.
```

4. Then this:

```text
Now say the idea is a full meal planner with a database. I can describe all of it today, but building it will take several sessions. Same question.
```

5. Then this:

```text
I'm still grilling the meal planner and the session is nearing the end of the smart zone. What do I do?
```

6. Without looking, sketch the map on paper with both forks, then compare it with the map above. Type `/exit` when you're done.

**It's working if:**

- [ ] The first two answers start with `/grill-with-docs`, perhaps after a one-time `/setup-matt-pocock-skills`.
- [ ] After grilling, the small idea goes to `/implement` in the same window, with no spec or tickets.
- [ ] The big idea goes `/to-spec` → `/to-tickets` → `/implement` per ticket with `/clear` between, or `/implement-spec`.
- [ ] It says not to clear or compact until after `/to-tickets`.
- [ ] It puts `/retro` in the same session, before you clear.
- [ ] The third answer says to `/compact` at the nearest Phase boundary, not to push on.
- [ ] It stops after naming what to type, without starting any of it.

If it says some Skills aren't installed, that's the quirk from "Who can type what" above: type them anyway.
````

## Common mistakes

- **The three wrong turns from "Why it matters":** clearing before `/to-tickets`, the long road for a short job, and waiting at a junction or asking in plain words.
- **Typing the next Skill while the agent is still asking you something.** Answer first (the Site story shows why).
- **Reaching for `/compact` first or mid-Phase, or using `/handoff` as the general way to change sessions.** Walk the five questions, at the boundary.
- **Triaging your own tickets, or running a big `/wayfinder` map straight into `/implement`.**

```site-story
I built the first version of this Lesson, with the site's redesign, in one PR, using the Main flow itself:

| I typed | What came out |
|---|---|
| "…you can start grilling with docs" | A grilling session, and two new glossary terms: **Main flow** and **Built-in command** |
| `/to-spec` | One spec, in `.scratch/main-flow-and-redesign/spec.md` |
| `/to-tickets` | Five tickets, each naming its blockers |
| `/implement-spec` | A helper agent per ready ticket, each in its own worktree (a separate copy of the repo), all merged into one integration branch |

Grilling, spec and tickets stayed in one session, with no `/clear`, as the rule says.

**My plain-words slip.** I asked for "grilling with docs" in a sentence. The agent can't start a user-invoked Skill, so it ran `/grilling` and then `/domain-modeling`, the two halves `/grill-with-docs` is made of. Same result, in two steps.

**I skipped a question.** `/to-spec` stopped to ask me to check one design choice. I typed `/to-tickets` instead of answering, so the spec went out with the agent's best guess. My rule now: answer the open question before typing the next Skill.

**The build ran itself.** Tickets 03 and 04 ran in parallel, and the only merge conflict was in the photo-credits file. The review found about 15 problems, like the home page calling Skills "commands". One fix-up agent fixed them, and my journal says `/pr` wrote the description, calling the change a two-way door: content and styling only, easy to revert.

**Before that PR, I'd built the site's first version, one Lesson per step. What I typed then, and what I'd type today:**

| The first version | Today |
|---|---|
| `/grilling`, then `/domain-modeling` | `/grill-with-docs`: one Skill does both |
| "write the spec", in plain words | `/to-spec`, then `/to-tickets` |
| `/tdd` four times, once per ticket | `/implement` per ticket, with `/clear` between |
| `/mattpocock-skills:code-review` at the end | Inside each `/implement`; the full name if it misfires |
| The agent ran `gh pr create` | The agent writes the description with `/pr` |
| Nothing after shipping | `/retro`, before clearing |
```

## Cheat sheet

| Situation | Type |
|---|---|
| A new repo | `/setup-matt-pocock-skills`, once |
| Not sure what's next | `/ask-matt` |
| An idea, in a repo | `/grill-with-docs` |
| An idea, no repo | `/grill-me` |
| A question you need to see | `/handoff`, `/prototype`, `/handoff` back |
| It fits this session | `/implement`, right here |
| Multi-session | `/to-spec`, then `/to-tickets`, same window |
| Tickets ready, you drive | `/implement`, `/clear`, next ticket |
| Tickets ready, you step away | `/implement-spec` |
| Inside the build, or going up as a PR | `/tdd` (at agreed seams), `/code-review` and `/pr` run for you |
| Build finished | `/retro`, before `/clear` |
| A Phase boundary | Continue? `/clear`? `/handoff`? Subagent? Else `/compact` |
| Incoming bugs and requests | `/triage` |
| A hard bug | `/diagnosing-bugs`, then `/retro` |
| Huge and foggy | `/wayfinder`, then `/to-spec` |
| A spare afternoon | `/improve-codebase-architecture`, then `/grill-with-docs` |

## Final test

```test scenario-fits-one-session
On a bakery's ordering site, you've just grilled a small change: let customers add a delivery note to an order. The session has used about 45k tokens. What do you type next?
- [ ] `/to-spec`, then `/to-tickets`, so the change is written down.
  > That's the long road, worth its cost only when the build spans sessions. This one fits the room you have.
- [x] `/implement`, in this same conversation, while it's fresh.
  > Right. Fork B says it fits one session, so build it here, where every decision is still in the window.
- [ ] `/clear`, then `/implement` with a one-line description.
  > Clearing throws away the decisions you just made. The short road keeps them in the same window.
- [ ] `/implement-spec`, so subagents can build it in parallel.
  > `/implement-spec` runs a spec's tickets in parallel. A one-session change has neither, and needs neither.
```

```test scenario-needs-seeing
Grilling a library's system for holding books, you hit a rule two rounds of talk haven't settled: when two copies of a popular book come back at once and five people are waiting, who gets them, and what does each borrower see? What's the route?
- [ ] Accept the agent's recommendation and settle it during `/implement`.
  > Then the build rests on a rule you couldn't check. A question that needs a runnable answer takes the detour first.
- [ ] Run `/to-spec` now and leave the question open for the tickets.
  > The spec would carry a guess. Settle it before the spec, with something runnable.
- [ ] Keep grilling until one version of the rule sounds right.
  > Talking harder won't help. A tricky rule like this is exactly what Fork A sends to a prototype.
- [x] `/handoff` out, `/prototype` in a fresh session, `/handoff` back.
  > Right. That's Fork A: a throwaway program answers the question, and the second handoff carries the answer back to the grilling.
```

```test scenario-step-away
Your spec has nine tickets, some blocking others. It's Friday evening, you want the whole spec built on one branch by Monday without typing anything per ticket, and this repo has no script for looping tickets. What do you type?
- [x] `/implement-spec`, pointed at the spec
  > Right. It runs subagents across every unblocked ticket in parallel, picks up the next ones as blockers clear, and lands it all on one integration branch.
- [ ] `/implement`, naming all nine
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
  > In the Main flow, tickets are cut from the spec, so the spec has to come first.
- [x] `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` per ticket → `/retro`
  > Right. Interview, spec and tickets in one window; then a fresh session per ticket; then look back on a session from the build.
- [ ] `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/retro` → `/implement` per ticket
  > `/retro` looks back on a build. Run before the build, it has nothing to review.
```

```test scenario-near-smart-zone
You're grilling a big feature for a gym's booking site. You've just finished the last of the membership questions and are about to start on payments. `/context` shows about 140k tokens, and you haven't run `/to-spec` yet. What now?
- [ ] Push on: payments needs the membership answers word for word.
  > That's the usual case for continuing, but not this near the end of the Smart zone. The rest of the grilling and the spec would come from a duller model.
- [x] `/compact` at this break, telling it payments is next.
  > Right. Finishing memberships is a Phase boundary, and the context is still needed, so compact with an instruction ("next we grill payments") and keep going.
- [ ] `/clear`, then start the grilling again from the top.
  > That throws away every decision so far. `/clear` is only for context you'll never need again.
- [ ] `/to-tickets` now, before the window gets any fuller.
  > The payments decisions don't exist yet, and in the Main flow the tickets come after `/to-spec`.
```

```test scenario-side-task
Midway through grilling a new feature for a book-club site, you notice the password-reset email sends a broken link. You want it fixed without derailing the grilling. What fits?
- [ ] `/clear`, fix the link, then restart the grilling.
  > That throws away the grilling so far to fix something unrelated to it.
- [ ] Stop grilling and fix the link in this conversation first.
  > That derails the Phase you're in and fills its window with unrelated work.
- [x] `/handoff` the fix, then do it in a separate session.
  > Right. Forking a side task mid-Phase is one of the four jobs `/handoff` exists for: the file travels, and this session stays on track.
- [ ] `/compact`, so there's room for both jobs in one window.
  > Compacting mid-Phase loses the thread, and it still mixes two jobs in one window.
```

```test sequence-boundary-questions
You've just finished QA on your recipe site's tag filters and stop to decide what to do with the session. In what order do Matt's five questions have you consider the options?
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
  > Right. With no session named, `/retro` reviews the current one. Run it before clearing, or tell it which session to review.
- [ ] `/retro` only works after `/diagnosing-bugs`.
  > `/retro` is the last step of the Main flow too, after any build, especially a messy one.
- [ ] She should have typed `/handoff` the night before instead of `/clear`.
  > Nothing needed to travel. The fix is to run `/retro` in the session it's reviewing.
- [ ] `/retro` can't read sessions at all; it only reviews the code diff.
  > The reverse: it reads the session itself, which is how it finds what the agent struggled with.
```

```test predict-plain-words
Grilling is done. Instead of typing a Skill's name, you write: "great, now write the spec and split it into tickets". What can you count on?
- [ ] The agent starts `/to-spec`, then `/to-tickets`, exactly as if you'd typed them.
  > Both are user-invoked, so plain words can't start them.
- [ ] Nothing happens: the agent ignores any message that isn't a Skill name.
  > It reads every message and tries to help. It just can't load those two Skills.
- [x] Neither Skill starts, so you'll still need to type both names yourself.
  > Right. Both are user-invoked. The agent may write a spec of its own or tell you to type the names; either way, type `/to-spec`, then `/to-tickets`, at the start of a message.
- [ ] The agent runs `/grill-with-docs` again to check the decisions.
  > Nothing asked for more grilling, and that Skill is user-invoked too, so plain words couldn't start it.
```

```test scenario-agent-may-start
While `/implement` builds a ticket on your book-club site, it needs a key from the payment provider's website, behind your login, saved into the project's private settings file. Which Skill might the agent start on its own?
- [ ] `/handoff`
  > User-invoked: only you can start it, and nothing here needs to travel.
- [x] `/wizard`
  > Right. It's model-invoked, so the agent can reach for it when it hits a step only a human can take, and script that step for you.
- [ ] `/to-questionnaire`
  > User-invoked, and it's for knowledge in someone else's head, not a step you can do yourself.
- [ ] `/triage`
  > User-invoked, and it sorts incoming issues; it isn't a step inside a build.
```

```test spot-triaged-own-tickets
Sam grilled a feature, ran `/to-spec` and `/to-tickets`, then ran `/triage` on the seven new tickets before building any of them. Spot the mistake.
- [ ] `/triage` should have run before `/to-spec`, not after it.
  > `/triage` isn't a step on the Main flow at all. It's the on-ramp for work that arrives from outside.
- [ ] Sam should have used `/wayfinder` for a build of seven tickets.
  > `/wayfinder` is for efforts you can't plan in one sitting. Sam planned this one fine.
- [ ] `/triage` only accepts one ticket at a time, not seven.
  > It handles a whole backlog. The problem is which tickets went in.
- [x] `/triage` is for raw incoming issues, not Sam's own tickets.
  > Right. Tickets from `/to-tickets` are born agent-ready. `/triage` is for bug reports and requests that arrive raw.
```

```test spot-map-to-implement
After three weeks with `/wayfinder`, the map for a new booking system has cleared. Ade types `/implement` and points it at the map. Spot the mistake.
- [x] Its decisions should go to `/to-spec`, not `/implement`.
  > Right. For an effort this size, `/to-spec` turns the map's decisions into one plan you can build, then `/to-tickets` cuts it into sessions.
- [ ] A cleared map should start over with `/grill-with-docs`.
  > The decisions are already made, on the map. Grilling again repeats the work.
- [ ] Ade should have run `/triage` on the map's tickets first.
  > Those are decision tickets, already resolved. They need collapsing into a spec, not triage.
- [ ] `/wayfinder` should have built the system as it went.
  > Wayfinder produces decisions, not deliverables. It hands off; it doesn't build.
```

```test scenario-flaky-failure
On your recipe site, one of the automated tests fails about one run in five, and nobody can see why. What's the route?
- [ ] `/triage` it, then wait for an agent-ready brief.
  > `/triage` sorts incoming reports. You already know what's wrong; you need to find out why.
- [ ] `/grill-with-docs` a plan to rewrite the flaky checks from scratch.
  > Rewriting is a guess at the cause. Find the cause first.
- [x] `/diagnosing-bugs`, then `/retro` in the same session.
  > Right. It builds a feedback loop that fails on this bug before it guesses at a cause, fixes it with a regression test, and `/retro` then looks for what would have caught it sooner.
- [ ] `/wayfinder`, since nobody knows where the cause is.
  > `/wayfinder` plans huge efforts. A flaky failure needs a feedback loop, not a map.
```

```test scenario-spare-afternoon
No feature is planned this week, and lately one change to a recipe rule means editing six small files that keep drifting apart. What fits, and where does its result go?
- [ ] `/retro` on today's session, then `/implement` what it suggests.
  > `/retro` fixes the agent's environment after a session, not the shape of your code, and drifting files are a code-shape problem.
- [x] `/improve-codebase-architecture`, then `/grill-with-docs`.
  > Right. It surveys the code and grills you on the spot you pick, and Matt's router sends the idea that comes out into the Main flow at `/grill-with-docs`.
- [ ] `/codebase-design` on its own, then `/implement` the new design at once.
  > `/codebase-design` is vocabulary other Skills pull in, and nothing has been grilled yet.
- [ ] `/diagnosing-bugs` across the whole codebase.
  > Nothing is broken. That Skill needs one bug and a loop that fails on it.
```

```test scenario-unsteered-check
You've just finished building your recipe site's tag filters. `/context` shows about 145k tokens, and you'll want this conversation afterwards to write up the PR. Before that, you want all 300 pages' links checked and a list of any that are broken. What fits?
- [ ] Continue: ask for the link check right here, in this session.
  > The check doesn't need this conversation, and 300 pages of results would push this window past the Smart zone, just before the PR write-up that needs it.
- [ ] `/clear`, then ask for the check in the empty session.
  > You still need this conversation for the PR, so it isn't disposable.
- [ ] `/compact`, then run the check in the summarised session.
  > `/compact` comes last, for when nothing above it fits. A job that needs no steering is caught first, by the AFK question.
- [x] Give the check to a subagent; this window stays as it is.
  > Right. It's tightly scoped and needs no steering, so it can run AFK in its own window and report back.
```

```sources
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the Main flow, forks, context hygiene, on-ramps, codebase health, standalones): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/PHASE-BOUNDARIES.md) (the five options, in order; phases are fuzzy on purpose): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md), [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md), [to-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-spec/SKILL.md), [retro SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md), [triage SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/triage/SKILL.md) and [improve-codebase-architecture SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/improve-codebase-architecture/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) ("Reference": user-invoked vs model-invoked): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), AI Hero docs, updated 2026-08-24, read 2026-10-23 (where the decisions sit; the hidden-Skills quirk; "It's working if").
- [Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), AI Coding Dictionary, read 2026-10-23.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (order questions 0:12–0:18, setup 4:35–6:50, `/ask-matt` 7:00–8:24, grilling and auto mode 9:36–10:08, ~140k, 100k of room and normally typing `/implement` 10:28–11:03, spec and tickets in one session 11:19–12:53, clearing 13:55–14:39, review in subagents 14:55–16:08, the quote at 16:33–16:38).
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (spec and tickets 0:28–1:08, three ways to loop tickets 1:08–3:23, `/retro` stays human-in-the-loop 12:48–13:33).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (compacting 10:36).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [afk.sh: chaining /implement over ready-for-agent tickets overnight, one fresh session per ticket](https://github.com/mattpocock/skills/discussions/1136), GitHub Discussion #1136, 2026-09-28 (the 173-session update, 2026-09-29).
- [Issue #1215: implement and implement-spec call code-review by bare name](https://github.com/mattpocock/skills/issues/1215), opened 2026-10-07, and [issue #1277: /implement doesn't run /code-review](https://github.com/mattpocock/skills/issues/1277), opened 2026-10-14, both open when read on 2026-10-24.
- Repo: [PR #9](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/9), merged 2026-10-22 (the two-way door), and the first version of this Lesson, `content/lessons/11-main-flow.md` at commit d21fc2c (the Site story), read 2026-10-24.
```
