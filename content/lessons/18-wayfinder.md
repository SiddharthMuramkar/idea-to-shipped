---
title: Wayfinder
slug: wayfinder
order: 18
part: 4
image: /photos/wayfinder.jpg
imageAlt: A lone person walks along a forest trail into thick fog.
imageCredit: Dominik Chelstowski
---

Some ideas are too big to plan in one sitting. Instead of guessing the route, chart a map of the decisions and clear them one session at a time.

```goals
- You'll be able to tell when an effort needs `/wayfinder` rather than `/grill-with-docs`, and say what happens when it finds no fog.
- You'll be able to read a wayfinder map: its destination, its decision tickets and their four types, the frontier, the fog and what's out of scope.
- You'll be able to chart a map, work it one ticket per session, and hand the cleared map to `/to-spec`.
- You'll be able to send an outside fact to `/research` and a question only someone else can answer to `/to-questionnaire`.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Matt Pocock, a developer and teacher, publishes a popular set of Skills for it. A Skill is a short instruction file the agent loads when you type its name, like `/wayfinder`. ([Start here](/learn/start-here) covers installing them.)

Most planning with Matt's Skills happens in one grilling session, where the agent interviews you until you both want the same thing (see [Grilling](/learn/grilling)). That works because the whole plan fits in one session: a single Claude Code conversation. Everything in a session lives in the agent's context window, its working memory, measured in tokens (small chunks of text). As the window fills, the model reasons less sharply. Matt calls the part where it still thinks clearly the Smart zone: about 150k tokens on today's best models, as a rule of thumb.

Now picture a bigger idea: every Lesson on this site in Spanish as well as English. You can name where you want to end up. The route is another matter. What does the site's framework offer for routing pages by language? Does a Spanish Lesson keep its English Slug, the permanent name its comments point at? How should a language switcher look? Is machine translation good enough? Some of those need someone to read documentation, one needs a picture, and one needs a native speaker. A single grilling session can't hold all that. You'd run out of Smart zone, or hit a question nobody in the conversation can answer.

Matt hit the same wall. In his July 2026 video on the Skill, he said single-session planning made him ==shrink what he built to fit the AI==. He'd chop the work into small bites before starting, then still get lost when a question had no answer yet. His fix is `/wayfinder`: plan the effort across many sessions, as a map.

```callout big-idea
Wayfinder plans; it doesn't build. Each ticket settles one decision, and when nothing is left to decide, it hands off to the normal flow.
```

## The idea: a map with fog on it

Wayfinder borrows its words from strategy games. You know the **destination**. Between you and it lies the **fog of war**: decisions you know are coming but can't define yet, because they depend on questions nobody has answered. Each decision you settle clears the fog just ahead of it.

The **map** is a single issue on your project's issue tracker, the list where its tickets (small units of work) live. On GitHub that's an issue labelled `wayfinder:map`. This site keeps its issues as Markdown files instead, so its map would be `.scratch/<effort>/map.md`. Right after charting, the Spanish map might read:

```md
## Destination
A spec for Spanish versions of every Lesson, ready to hand to /to-spec.

## Notes
Use GLOSSARY.md terms. Slugs never change (docs/adr/0004).

## Decisions so far
(empty until the first ticket closes)

## Not yet specified
- How translated Final test questions keep their permanent ids.

## Out of scope
- Languages other than Spanish. Translating Visitors' comments.
```

The map is ==an index, not a store==. Each decision lives in exactly one place, its ticket, and the map gives a one-line gist and a link. That keeps the map small enough to load at the start of every session, however long the effort runs. Open tickets aren't listed on it at all; the agent finds them by looking.

The tickets are **decision tickets**: child issues of the map, each holding a single question small enough to settle in one session. They carry only a `wayfinder:<type>` label (a `Type:` line on this site), never a triage label like `ready-for-agent`, because they're decisions, not implementation work. Some block others: "Does a Spanish Lesson keep its English Slug?" can't be settled until someone has read how routing works. The **frontier** is every ticket that's open, unblocked and unclaimed: what you can take right now. Tickets are always referred to by name, not number, because a wall of `#42, #43` is unreadable.

Two more rules decide where a thought goes:

- **Fog or ticket?** If you can state the question precisely now, it's a ticket, even if it's blocked. If you can only gesture at it, it goes under Not yet specified. Don't chop fog into ticket-sized pieces early: one patch may become several tickets, or none.
- **Out of scope** is work beyond the destination. It isn't fog, and it never graduates into tickets. It comes back only if you redraw the destination, as a fresh effort.

```checkpoint fog-or-ticket
You're charting a map for moving a village library's catalogue online. You can already phrase "Should borrowers see their overdue fines online?" precisely, but it can't be settled until a research ticket on the old catalogue's data closes. Where does it go?
- [ ] Not yet specified, because it can't be answered yet.
  > The test is whether you can state the question precisely now, not whether you can answer it now.
- [x] A ticket now, blocked by the research ticket.
  > Right. A sharp question becomes a ticket even when it's blocked. The blocking link keeps it off the frontier until the research closes.
- [ ] Out of scope, until the research is done.
  > Out of scope is for work beyond the destination, and it never comes back. This question is on the route.
- [ ] Decisions so far, marked as pending.
  > Decisions so far lists only closed tickets: the route actually walked.
```

## Four kinds of decision ticket

Every ticket is either HITL (human in the loop: worked live with you, speaking for yourself) or AFK (away from keyboard: the agent works alone).

| Type | Who | Reach for it when | Resolved by |
|---|---|---|---|
| `grilling` | HITL, the default | Talking it through can settle it | The grilling and domain-modeling Skills |
| `prototype` | HITL | The question is how something should look or behave | The prototype Skill: a rough artifact to react to, linked from the ticket |
| `research` | AFK | A fact from outside the repo blocks a decision | A subagent (a helper agent with its own fresh memory) running the research Skill |
| `task` | Either | Nothing to decide, but real-world work blocks a decision | The agent if it can; otherwise a precise checklist for you |

A `task` is the only type that *does* rather than decides: signing up for a service so its dashboard can be judged, say, or asking a Spanish speaker to read one translated Lesson. It earns its place by unblocking a decision, never by delivering part of the destination.

A HITL ticket can only be resolved live, with you. ==An agent that answers its own grilling questions has broken it.== And wayfinder makes decisions, not deliverables: an urge to start building usually means you've reached the map's edge. A map can switch that default off in its Notes, so read the Notes of any map you didn't chart yourself.

All four resolvers are model-invoked Skills, ones the agent can load on its own. That matters, because `/wayfinder` is user-invoked: only you can start it, by typing its name at the start of a message. A user-invoked Skill can call model-invoked ones, never another user-invoked one.

```checkpoint ticket-type
On a map for a school's sports-day booking site, the next question is "Should parents see free slots as a calendar or as a list?" Nobody can picture the difference yet. Which ticket type fits?
- [ ] `grilling`, since it's the default
  > Talking hasn't settled it, and won't. It's a question about how something looks.
- [ ] `research`, so an agent can find the best practice
  > No outside fact decides this for your parents. It's your call, once you can see it.
- [x] `prototype`, to make something rough to react to
  > Right. "How should it look?" is a prototype question: a cheap, concrete artifact you can react to, linked from the ticket.
- [ ] `task`, because someone has to build the screen
  > A task is real-world work that unblocks a decision. A rough, throwaway screen to look at is a prototype's job.
```

## Session one: chart the map

You start `/wayfinder` with a loose idea, and it charts in six steps:

1. **Name the destination.** It grills you, using the grilling and domain-modeling Skills, on where this ends: a spec to hand off, a decision to lock, or a change made in place. The destination fixes the scope, so it comes first.
2. **Map the frontier.** A second, breadth-first round fans out across the whole idea instead of going deep on one thread. ==If no fog turns up==, the journey fits in one session and you don't need a map: it stops and asks how you'd like to proceed.
3. **Create the map**, with Destination and Notes filled in and the fog sketched under Not yet specified.
4. **Create the tickets** it can phrase sharply, then wire the blocking links in a second pass, once every ticket exists to point at.
5. **Fire the research agents.** Each research ticket gets a subagent straight away, working in the background. Its findings go on a throwaway `research/<name>` branch (a separate line of work in Git), pushed but never merged.
6. **Stop.** Charting is one session's work. It resolves nothing by hand.

```scene chat
title: Charting a Spanish course for this site (illustrative)
# You type the Skill and a loose idea. Only you can start it.
you: `/wayfinder` I'd like every Lesson in Spanish as well as English. I can't see the route yet.
# It reads the repo and the tracker doc, then settles the destination first.
agent: ❓ **Q1** - **Destination**: Should this map end in a spec you can hand to `/to-spec`? ➡️ Yes.
you: 1 yes.
# A breadth-first round fans out across the whole idea. "Yes" accepts each recommendation.
agent: ❓ **Q2** - **Scope**: Should other languages stay out of this effort? ➡️ Yes. ❓ **Q3** - **Comments**: Should Visitors' comments stay untranslated? ➡️ Yes.
you: 2 yes, 3 yes.
# It writes the map, then the tickets it can phrase sharply, and wires the blocking links in a second pass.
agent: Created the map and four tickets: *What does Next.js offer for routing pages by language?* (research), *Does a Spanish Lesson keep its English Slug?* (grilling, blocked by the routing ticket), *How should the language switcher look?* (prototype) and *Ask a Spanish speaker to read one machine-translated Lesson* (task).
# What it can't phrase yet goes into the fog. What you ruled out goes out of scope.
agent: Not yet specified: how translated Final test questions keep their permanent ids. Out of scope: other languages, translating comments.
# The research ticket goes to a background agent straight away.
agent: Started a research agent on the routing ticket. Its findings go on a throwaway `research/language-routing` branch, pushed but never merged.
# Then it stops. Charting resolves nothing by hand.
agent: Charting done. Takeable now: *How should the language switcher look?* and *Ask a Spanish speaker to read one machine-translated Lesson*. Start a fresh session with `/wayfinder .scratch/spanish-lessons/map.md`.
```

## Every session after: one ticket

Once the map exists, you type `/wayfinder` followed by the map's path or link. You can name a ticket; if you don't, the agent picks the first one on the frontier. Then it:

1. Loads the map at low resolution, not every ticket body.
2. **Claims** the ticket before any work, so another session running in parallel skips it. On GitHub a claim is an assignee; on this site it's a `Status: claimed` line, saved first.
3. Resolves it the way its type label says, opening related tickets only when it needs their detail.
4. Records the answer (a comment on GitHub, an `## Answer` heading here), closes the ticket and adds one line to Decisions so far.
5. Graduates any fog the answer made sharp into new tickets. A ticket that turns out to sit past the destination gets closed and noted under Out of scope.

Then it stops. ==Never more than one ticket per session==, research tickets aside: each ticket is sized for a fresh session of its own. Type `/clear` (a Built-in command that empties the conversation) before you take the next.

```scene files
title: One ticket worked on this site's Markdown tracker (illustrative)
# After charting: the map, plus one file per ticket with Type, Status and Blocked by lines.
+ .scratch/spanish-lessons/map.md
+ .scratch/spanish-lessons/issues/01-language-routing.md
+ .scratch/spanish-lessons/issues/02-slug-for-spanish-lessons.md
+ .scratch/spanish-lessons/issues/03-language-switcher.md
+ .scratch/spanish-lessons/issues/04-native-speaker-check.md
# The research agent finishes in the background. The routing ticket gets a pointer to its findings and Status: resolved.
~ .scratch/spanish-lessons/issues/01-language-routing.md
# Next session, you type `/wayfinder` with the map. The Slug ticket is now unblocked and first in order, so it's claimed: Status: claimed, saved before any work.
~ .scratch/spanish-lessons/issues/02-slug-for-spanish-lessons.md
# It's a grilling ticket, so it grills you. Your answer goes under an Answer heading, and the status becomes resolved.
~ .scratch/spanish-lessons/issues/02-slug-for-spanish-lessons.md
# One line goes into Decisions so far: the ticket's name, a link and a one-line gist.
~ .scratch/spanish-lessons/map.md
# Your answer made a patch of fog sharp, so it graduates into a new ticket and leaves Not yet specified. Then the session stops.
+ .scratch/spanish-lessons/issues/05-final-test-ids-in-spanish.md
~ .scratch/spanish-lessons/map.md
```

```checkpoint claim-first
Two sessions in two terminal windows each run `/wayfinder` on the same map at the same moment, without naming a ticket. Why does each one mark its ticket claimed before doing anything else?
- [x] So the other session skips that ticket.
  > Right. The claim keeps two sessions off the same question. An open ticket with no claim is fair game.
- [ ] So `/to-spec` knows which tickets are finished.
  > Closing the ticket and its line in Decisions so far do that. A claim marks work in progress.
- [ ] So a research agent can resolve it in the background.
  > Research tickets are handed to agents while charting. A claim is about sessions working side by side.
- [ ] So the map can list it under Not yet specified.
  > Not yet specified holds fog, never live tickets.
```

## When the fog clears: hand off at `/to-spec`

The map is done when no tickets are left and Not yet specified is empty. What you have then is a pile of linked decisions, not a build plan. Wayfinder ==hands off; it doesn't build==.

```scene flow
title: Where a cleared map goes next
node: map | Cleared map
node: spec | /to-spec
node: tickets | /to-tickets
node: build | /implement, one ticket per session
node: review | Code review
# No open tickets are left, and Not yet specified is empty. The map is a pile of linked decisions.
at: map
# In a new session, `/to-spec` with the map's path collapses those decisions into one spec.
at: spec
# `/to-tickets` cuts the spec into implementation tickets, in the same session.
at: tickets
# `/implement` builds one ticket per session, with `/clear` between them.
at: build
# A code review closes the build, then the usual pull request.
at: review
```

Start a session and type `/to-spec` with the map's path or link. A fresh session is fine here: the decisions live in the tickets, not in a conversation. `/to-spec` collapses the decisions into one spec (a written description of what to build and why). In Matt's run, the spec linked back to each decision ticket, so a later agent could check what was actually decided. Then `/to-tickets` cuts the spec into implementation tickets, and `/implement` builds them one per session (see [Spec + tickets](/learn/spec-and-issues) and [Implement](/learn/implement)). Matt puts wayfinder exactly where `/grill-with-docs` sits in his Main flow, the path most work takes from idea to shipped. Pointing `/implement` straight at the map skips the collapse and throws the linked detail away; do that only if the effort turned out small.

## Research: let a background agent read

`/research` is model-invoked, so you can type it or just ask the agent to research something. It starts a **background agent**, a helper that works alongside your session, so you keep going while it reads. That agent:

1. Investigates against **primary sources**: official docs, source code, specs, first-party APIs, not someone's write-up of them. It traces each claim to the source that owns it.
2. Writes one Markdown file, citing each claim's source.
3. Saves it where the repo already keeps notes, or somewhere sensible, and tells you where.

The file is raw material. Take it into `/grill-with-docs` or a wayfinder ticket, where you still make the decision. This site runs on Vercel with a Neon database, one database branch per environment, so a good question here would be: "research what happens to a preview's Neon branch when its pull request closes; official docs only." Narrow and answerable beats "research databases". Matt's docs on AI Hero offer a handy line: research gathers facts with a short shelf life, while a decision you'll keep belongs in grilling.

## To-questionnaire: ask the one person who knows

Sometimes the answer isn't in your head, the code or any document. It's in someone else's head. `/to-questionnaire` (user-invoked) writes that person a questionnaire to fill in on their own time, or to work through together in a meeting.

Its rule is ==grill the send, not the subject==. Interviewing you about the topic would be pointless: not knowing it is why you're asking someone else. So it asks you two things, one exchange each: who it's going to (their role, what they know, how they relate to you), and what you need back. Then it writes `to-questionnaire-<slug>.md` in the current folder and tells you the path.

The document opens with a Purpose line and a short Context paragraph for a reader who wasn't in your head, then How to answer, with a deadline and explicit permission to say "I don't know". The questions come grouped by theme, most important first, one idea each, with space to answer under each. It closes with "Anything else?". It's one recipient per run, and it sends nothing: delivery is yours.

The best moment is mid-grilling, in the same conversation, when some questions turn out not to be yours to answer. On the Spanish map, the task ticket asking a Spanish speaker to judge a translated Lesson is a natural fit. You'd type `/to-questionnaire` yourself, since wayfinder can't start another user-invoked Skill. Feed the answers back into `/grill-with-docs`, `/to-spec`, or the ticket that was waiting.

```checkpoint grill-the-send
You type `/to-questionnaire` because only your accountant knows how to handle tax on your shop's new online sales. The agent starts asking you detailed questions about tax rules. What's gone wrong?
- [ ] Nothing: it needs the subject first to write good questions.
  > It never interviews you about the subject. Not knowing the subject is why you're writing to someone else.
- [ ] It should be contacting the accountant directly.
  > It never contacts anyone. It writes a file, and delivering it is up to you.
- [ ] You should have run `/research` first so it has the facts.
  > The answers you need live in the accountant's head, not in any document.
- [x] It should only ask who it's for and what you need back.
  > Right. Grill the send, not the subject: two questions you can always answer, then questions aimed at the gap.
```

## How Matt and others use it

**Matt Pocock**, in his video "/wayfinder: Nothing is too big to plan anymore" (30 July 2026):

- **One prompt to chart.** For a command palette in his diagram app, he typed `/wayfinder` and a paragraph of wishes. It explored the code, asked what "done" looked like and recommended a spec, then charted seven tickets. Only three were takeable at first.
- **A new session per ticket.** He called wayfinder with each ticket's name, sometimes through a handoff Skill of his that wrote the prompt and started the session.
- **Research runs unwatched; prototypes run often.** Research tickets go off to a subagent. He leans on prototypes so the planning doesn't harden into waterfall (heavy, low-fidelity planning up front).
- **Then the usual flow.** One map stood at 14 of 17 tickets done. The first draft of a spec he made from a map was too big for GitHub's character limit. He hands the spec to an AFK agent to build, and closes the spec once the code exists.
- **Beyond code.** He's used it to plan courses and a garden office: site survey, research, which firms to contact.
- **His rule for "too heavy":** if one session can plan it, plan it in one session.

**Other developers:**

- Gilles d'Andrea (July 2026) liked that wayfinder makes fog first-class, with a named section and a rule for when it becomes a ticket, where other spec tools write their guesses down as "assumptions".
- AI Hero's wayfinder page (updated August 2026) reports a user whose 27-ticket map went stale by the thirteenth ticket. The advice: scope a map to one bounded piece of the product, prototype aggressively, and work one ticket at a time even when the frontier allows more, because parallel grilling sessions ask you the same questions twice.
- In a side-by-side test, The Gray Cat (August 2026) measured the wayfinder route spending about 35M tokens on planning before any code. On Reddit (August 2026), one user split a project into about 20 issues that each ran cleanly; others found it too much like waterfall and grill smaller pieces instead.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). You'll use a copy of this site's repo, which is already set up for wayfinder. Allow about 25 minutes.

1. Clone the repo and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped && cd idea-to-shipped && claude
```

2. Type a slash and the word wayfinder. If `wayfinder` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode is off: if you see "plan mode on" under the prompt box, press Shift+Tab until it changes.
4. **A no-fog check.** Type this and answer its questions briefly:

```text
/wayfinder Make the footer text slightly darker.
```

5. Type `/clear`, then chart a real map:

```text
/wayfinder I want this site to work as a printed book too: every Lesson laid out for paper, with a PDF download for each Part. Destination: a spec I can hand to /to-spec.
```

6. Answer the destination question, then the breadth-first round, by number. If a background research agent asks to push a `research/…` branch, choose No: you don't own this repo, and the branch is throwaway anyway.
7. When it stops, open the new folder under `.scratch/` and read `map.md` and the files in its `issues/` folder.
8. Optional: type `/clear`, then `/wayfinder` followed by the map's path, and work one ticket. Press Esc to stop anything you didn't expect, and type `/exit` when you're done.

**It's working if:**

- [ ] The footer change ended without a map, and it asked how you'd like to proceed.
- [ ] The Destination was agreed before any ticket existed.
- [ ] Every ticket reads as a question; none says "build" or "make".
- [ ] Each ticket file has a `Type:` line, plus a `Blocked by:` line where it waits on another.
- [ ] Not yet specified and Out of scope are separate sections.
- [ ] Charting resolved no ticket by hand, and `git status` shows nothing changed under `src/`.
- [ ] (Step 8) It set `Status: claimed` before working, added an `## Answer`, set `Status: resolved`, added one line to Decisions so far, and stopped.
````

## Common mistakes

- **Wayfinder for a well-scoped feature.** If you can plan it in one sitting, `/grill-with-docs` is faster and better, even when building takes several sessions.
- **Building inside the map.** A `task` ticket that reads "build the X" is mis-typed. Planning ends in decisions.
- **Letting the agent answer for you.** An agent that answers its own grilling questions, or picks between your prototypes, has broken a HITL ticket. Say so, and answer yourself.
- **Several tickets in one session.** One, then `/clear`. Research tickets are the only exception.
- **Pre-slicing fog,** or filing out-of-scope work as fog.
- **Skipping `/to-spec`** when the map clears.
- **A vague `/research` question,** or never checking where its citations land. If two near-identical background agents appear, that's a known issue: ask the agent to stop the duplicate.
- **One questionnaire for three people.** Run it once per recipient, in the conversation that holds the context.

```site-story
Not used on this site yet. The repo is wired for it (`/setup-matt-pocock-skills` wrote a "Wayfinding operations" section into `docs/agents/issue-tracker.md`), but I planned even this 20-Lesson rewrite in a single grilling session instead.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Can you plan it in one sitting? | Yes: `/grill-with-docs`. No: `/wayfinder` |
| Start a map | `/wayfinder <loose idea>`; the destination comes first |
| No fog found | No map; it asks how you'd like to proceed |
| Work the map | `/wayfinder <map>`: one ticket per session, `/clear` between |
| Sharp but blocked question | A ticket, with a blocking link |
| Can't phrase it yet | Not yet specified |
| Past the destination | Out of scope; it never graduates |
| Map cleared | `/to-spec` on the map, then `/to-tickets`, then `/implement` |
| An outside fact | `/research`: primary sources, one cited file |
| Someone else knows | `/to-questionnaire`: who it's for, what you need back |

## Final test

```test scenario-foggy-effort
A bakery with twelve shops wants to swap its paper order books for online ordering with delivery slots. You can name the end point but not the route: some answers need suppliers' docs, one needs a mock-up, and planning won't fit in one sitting. Which Skill do you type first?
- [ ] `/grill-with-docs`
  > That's for an idea you can plan in one sitting. This one can't be, and parts of it need reading or a picture before anyone can decide.
- [x] `/wayfinder`
  > Right. A named destination, a foggy route and more than one session of planning is exactly its shape.
- [ ] `/to-tickets`
  > Tickets are cut from a spec, and nothing has been decided yet.
- [ ] `/research`
  > Research can settle one outside fact. It doesn't chart the route or handle the decisions that are yours.
```

```test scenario-plan-vs-build
In your repo you want a "print this recipe" button. You could describe exactly what you want in five minutes, but building it will take three sessions. Which Skill do you start with?
- [ ] `/wayfinder`, because the build spans several sessions
  > The line is planning, not building. A build that takes several sessions can still be planned in one sitting.
- [ ] `/to-questionnaire`, so someone else settles the details
  > You already know what you want. A questionnaire is for answers that live in someone else's head.
- [ ] `/research`, to read up on how printing works
  > Nothing here waits on an outside fact. You can decide it by talking.
- [x] `/grill-with-docs`, then `/to-spec` and `/to-tickets`
  > Right. You can plan it in one sitting, so grill it, then turn the multi-session build into a spec and tickets.
```

```test scenario-outside-fact
Grilling a ticket-booking app, you hit a decision that waits on one fact: does your payment provider's API allow partial refunds? You'd like to keep answering the other questions meanwhile. What do you reach for?
- [x] `/research`, which leaves a cited file
  > Right. A background agent reads the provider's own docs while you carry on, and leaves one file citing each claim.
- [ ] `/to-questionnaire`, addressed to the provider
  > The answer is written down in the provider's docs. A questionnaire is for knowledge that lives in a person's head.
- [ ] `/prototype`, to build a refund screen
  > A screen won't tell you what the API allows. That's a fact to look up.
- [ ] Accept the agent's best guess and move on
  > A guess that reads like a fact is how plans go wrong, and this one can be checked against the source.
```

```test scenario-someone-elses-head
Planning the bakery's ordering system stalls: only the head of operations knows how the delivery vans are scheduled, and she isn't technical. What do you type, and what will it ask you?
- [ ] `/grill-me`, which interviews you about the vans
  > You're the one who doesn't know. Interviewing you about the subject only produces guesses.
- [ ] `/research`, which asks which websites to trust
  > The answer isn't in any document. It's in one person's head.
- [x] `/to-questionnaire`: who it's for, what you need back
  > Right. It grills the send, not the subject, then writes questions aimed at the gap between what she knows and what you need.
- [ ] `/wayfinder`, which asks you to name a destination for the whole map
  > Wayfinder plans whole efforts. Getting one person's knowledge out of their head is a questionnaire's job.
```

```test spot-own-answers
Mo is working a `wayfinder:grilling` ticket. The agent writes "Q1: Should drivers see the whole day's route? I'll assume yes. Q2: Weekly or daily slots? I'll go with daily." Then it closes the ticket. Spot the mistake.
- [ ] It should have been labelled `research` instead.
  > Route views and slot lengths are choices, not facts to look up.
- [x] A grilling ticket needs Mo's answers, not the agent's.
  > Right. Grilling is HITL: it only resolves through a live exchange, and an agent answering its own questions has broken it.
- [ ] It should have asked the two questions in separate rounds.
  > Two independent questions belong in the same round. The problem is who answered them.
- [ ] It should have taken a second ticket while it had room.
  > It's one ticket per session, and this one wasn't properly resolved anyway.
```

```test spot-build-ticket
While charting a map for a school's new booking site, the agent creates a ticket labelled `wayfinder:task` and titled "Build the parent sign-up page." Spot the mistake.
- [ ] Only the agent may work task tickets, so it can't be a task.
  > Tasks can be done by the agent alone or by you from a checklist. Who does it isn't the problem.
- [ ] It needs a `ready-for-agent` label so `/implement` picks it up.
  > Map tickets carry only `wayfinder:` labels. They're decisions, never implementation work.
- [ ] It belongs in Not yet specified until it's sharper.
  > It's sharp enough. It's the wrong kind of thing for the map.
- [x] It delivers the build; a task may only unblock a decision.
  > Right. The map produces decisions, not deliverables. Building the page comes after `/to-spec` and `/to-tickets`.
```

```test spot-many-tickets
Feeling productive, Lin works three grilling tickets back to back in one session, then a prototype ticket. Each gets an answer and is closed. Spot the mistake.
- [x] It should be one ticket per session, research aside.
  > Right. Each ticket is sized for a session of its own. Piling four into one pushes the later ones out of the Smart zone. Clear between tickets.
- [ ] Prototype tickets must be worked before grilling ones.
  > There's no order by type. Blocking links decide what's takeable.
- [ ] Grilling tickets should go to a subagent so Lin isn't needed.
  > Grilling is HITL. Lin's answers are the whole point.
- [ ] The answers should have gone into the spec, not the tickets.
  > Each decision lives in its ticket and the map points at it. The spec comes later, from `/to-spec`.
```

```test sequence-whole-effort
You're planning a huge, foggy effort in your repo. Which order is right?
- [ ] `/wayfinder` to chart → `/implement` each decision ticket → `/to-spec`
  > Decision tickets are questions, not slices of a build, and the spec comes before anything is built.
- [ ] `/to-spec` → `/wayfinder` to chart → `/to-tickets` → `/implement`
  > There's nothing to write a spec from until the map has been worked.
- [x] `/wayfinder` to chart → `/wayfinder <map>` per ticket → `/to-spec` → `/to-tickets`
  > Right. Chart in one session, work one ticket per session, hand the cleared map to `/to-spec`, and cut tickets from the spec.
- [ ] `/wayfinder` to chart and work every ticket in one session → `/to-tickets` → `/implement`
  > Charting is one session's work, each ticket gets its own session, and skipping `/to-spec` loses the linked detail.
```

```test predict-no-fog
In a repo, you type `/wayfinder Rename the Submit button on the contact form to Send.` After the destination question, the breadth-first round finds nothing foggy at all. What happens next?
- [ ] It creates a map with a single ticket, to stay consistent.
  > A map is only worth its overhead when there's fog to clear.
- [x] It stops and asks how you'd like to proceed.
  > Right. No fog means the whole journey fits in one session, so no map is needed.
- [ ] It charts the map anyway and starts research agents.
  > With nothing unknown, there's nothing to chart or research.
- [ ] It renames the button, since the way is clear.
  > Wayfinder plans; it doesn't build. It hands the choice back to you.
```

```test predict-frontier
A map has four tickets. *Venue shortlist* is closed. *Catering budget* is open, unblocked and unclaimed. *Seating plan* is blocked by *Catering budget*. *Speaker travel* is open but claimed by another session. You run `/wayfinder` on the map without naming a ticket. Which one does it take?
- [ ] *Venue shortlist*, to double-check it
  > Closed tickets are done. They're only opened for their detail.
- [ ] *Seating plan*, since it's next in line
  > It's blocked until *Catering budget* closes.
- [ ] *Speaker travel*, to help the other session
  > A claim tells other sessions to skip that ticket.
- [x] *Catering budget*, the only frontier ticket
  > Right. The frontier is the open, unblocked, unclaimed tickets, and with none named it takes the first one there.
```

```sources
- [wayfinder SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [research SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/research/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [to-questionnaire SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/to-questionnaire/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md) (wayfinder as an on-ramp that merges at `/to-spec`; research and to-questionnaire as standalones; the Smart zone): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [/wayfinder: Nothing is too big to plan anymore](https://www.youtube.com/watch?v=F3lL98Pj90o), Matt Pocock, 2026-07-30 (why he built it 0:00–1:39; charting the command palette 5:40–6:44; a session per ticket 6:53–7:38; ticket types and waterfall 7:40–9:06; 14 of 17 done 9:18; to-spec and the character limit 9:46–10:52; spec links back to tickets 10:54–11:23; "too heavy" 11:45–12:08; garden office 12:17–12:32; specs as temporary 13:36–14:00; courses and AFK agents 14:15–14:33).
- [The /wayfinder Skill](https://www.aihero.dev/skills-wayfinder), [The /research Skill](https://www.aihero.dev/skills-research) and [The /to-questionnaire Skill](https://www.aihero.dev/skills-to-questionnaire), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [Matt Pocock's Wayfinder skill gives fog a place on the map](https://ai.plainenglish.io/matt-pococks-wayfinder-skill-gives-fog-a-place-on-the-map-1dc288523ecb), Gilles d'Andrea, 2026-07-25.
- [Matt Pocock vs Addy Osmani: I Tested Both Skill Packs](https://www.youtube.com/watch?v=IDQs0VBL5UY), The Gray Cat, 2026-08-27.
- [r/ClaudeCode: Wayfinder pivots](https://www.reddit.com/r/ClaudeCode/comments/1vjijgx/), 2026-08-09.
- This site's [issue tracker doc, "Wayfinding operations"](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/docs/agents/issue-tracker.md), written 2026-10-21, read 2026-10-23.
```
