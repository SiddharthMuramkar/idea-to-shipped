---
title: Wayfinder
slug: wayfinder
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

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Matt Pocock, a developer and teacher, publishes a popular set of Skills for it. A Skill is a short instruction file the agent loads when you type its name, like `/wayfinder`; some it can also load by itself when your request fits.

Most planning with Matt's Skills happens in one grilling session with `/grill-with-docs`: the agent interviews you until you both want the same thing, noting the project's terms as it goes (see [Grilling](/learn/grilling)). For a bigger build, `/to-spec` then turns the decisions into a spec, a written description of what to build and why. That works because the whole plan fits in one session: a single Claude Code conversation. Everything in a session lives in the agent's context window, its working memory, measured in tokens (small chunks of text). As the window fills, the model reasons less sharply. Matt calls the part where it still thinks clearly the Smart zone: about 150k tokens on today's best models, as a rule of thumb.

Now picture a bigger idea: every Lesson on this site in Spanish as well as English. You can name where you want to end up. The route is another matter. What does the site's framework offer for serving pages in two languages? Does a Spanish Lesson keep its English Slug, the permanent name its comments point at? How should a language switcher look? Is machine translation good enough? Some need someone to read documentation, one needs a picture, and one needs a native speaker. A single grilling session can't hold all that: you'd run out of Smart zone, or hit a question nobody in the conversation can answer.

Matt hit the same wall. In his July 2026 video on the Skill, he said single-session planning made him ==shrink what he built to fit the AI==. His fix is `/wayfinder`: plan the effort across many sessions, as a map.

```callout big-idea
Wayfinder plans; by default it doesn't build. It clears the decisions between you and a plan, one session at a time, then hands off to the Main flow, the path most work takes from idea to shipped.
```

## The idea: a map with fog on it

Wayfinder borrows its words from strategy games. You know the **destination**. Between you and it lies the **fog of war**: decisions you know are coming but can't define yet, because they depend on questions nobody has answered. Each decision you settle clears the fog just ahead of it.

The **map** is a single issue on your project's issue tracker: the list where its tickets live, one tracked item each. On GitHub (a website that hosts code, and calls tickets issues) the map is an issue labelled `wayfinder:map`. This site keeps its tickets as Markdown (plain-text) files in its repo instead (short for repository: the project's folder, with its history tracked by a tool called Git), so its map would be `.scratch/<effort>/map.md`. Right after charting, the Spanish map might read:

```md
## Destination
A spec for Spanish versions of every Lesson, written by /to-spec once every decision is made.

## Notes
Use the words in GLOSSARY.md, the project's dictionary. Slugs never change (decision record docs/adr/0004).

## Decisions so far
(empty until the first ticket closes)

## Not yet specified
- How translated Final test questions keep their permanent ids.

## Out of scope
- Languages other than Spanish. Translating Visitors' comments.
```

The map is ==an index, not a store==. Each decision lives in exactly one place, its ticket. Decisions so far gets one line per closed ticket: a gist and a link. That keeps the map small enough to load at the start of every session. Open tickets aren't listed on it at all; the agent finds them by looking.

The tickets are **decision tickets**: child issues of the map, each holding one question small enough to settle in one session. They carry only a `wayfinder:<type>` label (a `Type:` line on this site), never a triage label (a status tag like `ready-for-agent` that marks a build ticket as ready), because they're decisions, not building work. Some block others: "Does a Spanish Lesson keep its English Slug?" can't be settled until someone has read how the framework serves languages. The **frontier** is every ticket that's open, unblocked and unclaimed (no session has marked it as taken yet): what you can take right now. A blocked ticket joins it once all its blockers are closed.

Two more rules decide where a thought goes:

- **Fog or ticket?** If you can already put the question sharply, it's a ticket, even if it's blocked. If you can only gesture at it, it goes under Not yet specified. Don't chop fog into ticket-sized pieces early: one patch may become several tickets, or none.
- **Out of scope** is work you've ruled beyond the destination. It isn't fog, it never graduates into tickets, and it stays out of Decisions so far. It comes back only if you redraw the destination, as a fresh effort.

```checkpoint fog-or-ticket
You're charting a map for moving a village library's catalogue online. You've written down the question "Should borrowers see their overdue fines online?", but it can't be settled until a research ticket on the old catalogue's data closes. Where does it go?
- [ ] Not yet specified, because it can't be answered yet.
  > What counts is whether the question is sharp today, not whether anyone can settle it yet.
- [x] A ticket now, blocked by the research ticket.
  > Right. A sharp question becomes a ticket even when it's blocked. The blocking link keeps it off the frontier until the research closes.
- [ ] Out of scope, until the research is done.
  > Out of scope is for work beyond the destination, and it returns only as a fresh effort. This question is on the route.
- [ ] Decisions so far, marked as pending.
  > Decisions so far lists only closed tickets: the route actually walked.
```

## Four kinds of decision ticket

Each ticket is HITL (human in the loop: you work it live and give your own answers) or AFK (away from keyboard: the agent handles it by itself).

| Type | Who | Reach for it when | Resolved by |
|---|---|---|---|
| `grilling` | HITL, the default | Talking it through can settle it | The grilling and domain-modeling Skills (domain modeling keeps the project's words straight in `GLOSSARY.md`) |
| `prototype` | HITL | The question is how something should look or behave | The prototype Skill: a rough, throwaway version to react to, linked from the ticket |
| `research` | AFK | A fact from outside the repo blocks a decision | A subagent (a helper agent with its own fresh memory) running the research Skill |
| `task` | Either | Nothing to decide, but real-world work blocks a decision | The agent if it can; otherwise a precise checklist for you |

A `task` is the one type that acts instead of deciding: signing up for a service so its dashboard can be judged, say, or asking a Spanish speaker to read one translated Lesson. It's there only because a decision waits on it; it never builds the destination itself.

A HITL ticket can only be resolved live, with you. ==An agent that answers its own grilling questions has broken it.==

By default a map makes decisions, not deliverables: an urge to start building usually means you've reached the map's edge. A map's Notes can override that and bring the building in, so check the Notes of any map you didn't chart.

The four Skills these tickets lean on (grilling, domain-modeling, prototype and research) are all model-invoked: the agent can load them on its own. That matters, because `/wayfinder` is user-invoked: only you can start it, by typing its name at the start of a message. A user-invoked Skill can call model-invoked ones, never another user-invoked one.

```checkpoint ticket-type
On a map for a school's sports-day booking site, the next question is "Should parents see free slots as a calendar or as a list?" Nobody can picture the difference yet. Which ticket type fits?
- [ ] `grilling`, since it's the default
  > Talking can't settle it while nobody can picture the two. A "how should it look" question needs something to look at.
- [ ] `research`, so an agent can find the best practice
  > No outside fact decides this for your parents. It's your call, once you can see it.
- [x] `prototype`, so you can see both before choosing
  > Right. "How should it look?" is a prototype question: a cheap, rough version of each that you can react to, linked from the ticket.
- [ ] `task`, because someone has to build the screen
  > A task is real-world work that unblocks a decision. A rough, throwaway screen to look at is a prototype's job.
```

## Session one: chart the map

You start `/wayfinder` with a loose idea, and it charts in six steps:

1. **Name the destination.** It grills you, with the grilling and domain-modeling Skills, on where this ends: a spec to hand off, a decision to lock, or a change made in place. The destination fixes the scope, so it comes first.
2. **Survey the whole idea.** A second, breadth-first round fans out across everything instead of going deep on one thread. ==If no fog turns up==, the journey fits in one session and you don't need a map: it stops and asks how you'd like to proceed.
3. **Create the map**, with Destination and Notes filled in and the fog sketched under Not yet specified.
4. **Create the tickets** it can phrase sharply, then wire the blocking links in a second pass, once every ticket exists to point at.
5. **Start the research agents.** Each research ticket gets a subagent straight away, working in the background. Its findings go on a throwaway `research/<name>` branch (a separate line of work in Git), pushed (uploaded to GitHub) but never merged (folded into the main line of work).
6. **Stop.** Charting is a session's work on its own, and it settles no ticket by hand.

```scene chat
title: Charting a Spanish course for this site (illustrative)
# You type the Skill and a loose idea. Only you can start it.
you: `/wayfinder` I'd like every Lesson in Spanish as well as English. I can't see the route yet.
# It reads the repo and its tracker notes (`docs/agents/issue-tracker.md`, which say where the map and tickets go), then settles the destination first. Each question carries its recommendation after ➡️, and "yes" accepts it.
agent: ❓ **Q1** - **Destination**: Should this map end in a spec, written by `/to-spec` once every decision is made? ➡️ Yes.
you: 1 yes.
# A breadth-first round fans out across the whole idea.
agent: ❓ **Q2** - **Scope**: Should other languages stay out of this effort? ➡️ Yes. ❓ **Q3** - **Comments**: Should Visitors' comments stay untranslated? ➡️ Yes.
you: 2 yes, 3 yes.
# It writes the map, then the tickets it can phrase sharply, and wires the blocking links in a second pass.
agent: Created the map and five tickets: *What does Next.js, the site's framework, offer for serving pages by language?* (research), *Does a Spanish Lesson keep its English Slug?* (grilling, blocked by the Next.js ticket), *How should the language switcher look?* (prototype), *Ask a Spanish speaker to read one machine-translated Lesson* (task) and *Is machine translation good enough for the Lessons?* (grilling, blocked by the task).
# What it can't phrase yet goes into the fog. What you ruled out goes out of scope.
agent: Not yet specified: how translated Final test questions keep their permanent ids. Out of scope: other languages, translating comments.
# The research ticket goes to a background agent straight away.
agent: Started a research agent on the Next.js ticket. Its findings go on a throwaway `research/language-routing` branch, pushed but never merged.
# Then it stops. Charting resolves nothing by hand.
agent: Charting done. A research agent is already working the Next.js ticket in the background. The other open, unblocked tickets are *How should the language switcher look?* and *Ask a Spanish speaker to read one machine-translated Lesson*. Start a fresh session with `/wayfinder .scratch/spanish-lessons/map.md` once the research lands, or name one of those two.
```

## Every session after: one ticket

Once the map exists, you type `/wayfinder` followed by the map's path or link. You can name a ticket; if you don't, the agent takes the first frontier ticket in order (on this site, the lowest number). Then it:

1. Loads the map only, not every ticket body.
2. **Claims** the ticket before any work, so another session running in parallel skips it. On GitHub a claim means assigning the ticket to you; on this site it's a `Status: claimed` line, saved first.
3. Resolves it the way its type label says, opening related tickets only when it needs their detail.
4. Records the answer (a comment on GitHub, an `## Answer` heading here), closes the ticket (`Status: resolved` here) and adds one line to Decisions so far.
5. Graduates any fog the answer made sharp into new tickets. A ticket that turns out to sit past the destination gets closed and noted under Out of scope.

Then it stops. ==Never more than one ticket per session==, research tickets aside: each ticket is sized for a fresh session of its own. Type `/clear` (a Built-in command that empties the conversation) before you take the next.

```scene files
title: One ticket worked on this site's Markdown tracker (illustrative)
# After charting: the map, plus one file per ticket with a Type line, and a Blocked by line on the two that wait.
+ .scratch/spanish-lessons/map.md
+ .scratch/spanish-lessons/issues/01-language-routing.md
+ .scratch/spanish-lessons/issues/02-slug-for-spanish-lessons.md
+ .scratch/spanish-lessons/issues/03-language-switcher.md
+ .scratch/spanish-lessons/issues/04-native-speaker-check.md
+ .scratch/spanish-lessons/issues/05-machine-translation-quality.md
# The research agent finishes in the background. The Next.js ticket gets a pointer to its findings and Status: resolved, and its gist goes into Decisions so far.
~ .scratch/spanish-lessons/issues/01-language-routing.md
~ .scratch/spanish-lessons/map.md
# Next session, you type `/wayfinder` with the map. The Slug ticket is now unblocked and first in order, so it's claimed: Status: claimed, saved before any work.
~ .scratch/spanish-lessons/issues/02-slug-for-spanish-lessons.md
# It's a grilling ticket, so it grills you. Your answer goes under an Answer heading, and the status becomes resolved.
~ .scratch/spanish-lessons/issues/02-slug-for-spanish-lessons.md
# One line goes into Decisions so far: the ticket's name, a link and a one-line gist.
~ .scratch/spanish-lessons/map.md
# Your answer made a patch of fog sharp, so it graduates into a new ticket and leaves Not yet specified. Then the session stops.
+ .scratch/spanish-lessons/issues/06-final-test-ids-in-spanish.md
~ .scratch/spanish-lessons/map.md
```

```checkpoint claim-first
You start `/wayfinder` on a map in one terminal window. A minute later you start it on the same map in a second window, naming no ticket in either. The first session marked its ticket claimed before doing anything else. What does that change for the second session?
- [x] It takes a different ticket from the frontier.
  > Right. A claimed ticket is off the frontier, so the second session takes the next open, unblocked, unclaimed one.
- [ ] It waits until the first session has cleared the whole map.
  > A claim covers one ticket, not the map. Any other frontier ticket is still free.
- [ ] It joins the first session on the same ticket.
  > A claim keeps sessions apart, so no question gets worked twice.
- [ ] It finds the claimed ticket listed under Decisions so far.
  > Decisions so far lists only closed tickets. A claim lives on the ticket itself.
```

## When the fog clears: hand off at `/to-spec`

The map is done when no tickets are left and Not yet specified is empty. What you have then is a pile of linked decisions, not a build plan.

```scene flow
title: Where a cleared map goes next
node: map | Cleared map
node: spec | /to-spec
node: tickets | /to-tickets
node: build | /implement, one ticket per session
node: pr | Pull request
# No open tickets are left, and Not yet specified is empty. The map is a pile of linked decisions.
at: map
# In a new session, `/to-spec` with the map's path collapses those decisions into one spec.
at: spec
# `/to-tickets` cuts the spec into implementation tickets, in the same session.
at: tickets
# `/implement` builds one ticket per session, with `/clear` between them. Each run ends with its own code review.
at: build
# Then the work goes up as a pull request (a request to merge a branch's changes into the main line of work).
at: pr
```

Start a session and type `/to-spec` with the map's path or link. A fresh session is fine, because the decisions live in the tickets; ask it to read the tickets the map links to, since the map holds only gists. In Matt's run, the spec linked back to each decision ticket, so a later agent could check what was actually decided. From there it's the usual Main flow, with wayfinder sitting exactly where `/grill-with-docs` normally does (see [Spec + tickets](/learn/spec-and-issues) and [Implement](/learn/implement)). Pointing `/implement` straight at the map skips the spec and loses the linked detail; do that only if the effort turned out small.

## Research: let a background agent read

`/research` is model-invoked, so you can type it or just ask the agent to research something. It starts a **background agent**, a helper that works alongside your session, so you keep going while it reads. That agent:

1. Reads **primary sources**, the ones that own the facts (official docs, the code itself, specs, a vendor's own API), not blog posts about them, and checks each claim against its owner.
2. Writes one Markdown file, citing where each claim came from.
3. Saves it where the repo already keeps notes, or somewhere sensible, and tells you where.

The file is raw material. Take it into `/grill-with-docs` or a wayfinder ticket, where you still make the decision. Keep the question narrow: "research how browsers decide where a printed page breaks; official docs only" beats "research printing". AI Hero, Matt's teaching site, puts it neatly: research gathers short-lived facts, while a decision you'll keep belongs in grilling.

## To-questionnaire: ask the one person who knows

Sometimes the answer isn't in your head, the code or any document. It's in someone else's head. `/to-questionnaire` (user-invoked) writes that person a questionnaire to fill in on their own time, or to work through together in a meeting.

Its rule is ==grill the send, not the subject==. Interviewing you about the topic would be pointless: not knowing it is why you're asking someone else. So it asks you two things, one exchange each: who it's going to (their role, what they know, how they relate to you), and what you need back. Then it writes `to-questionnaire-<topic>.md` (named after the topic) in the current folder and tells you the path.

The document opens with its purpose and a short context paragraph, then a deadline and explicit permission to say "I don't know". Questions come grouped by theme, most important first, one idea each. It's one recipient per run, and it sends nothing: delivery is yours.

The best moment is mid-grilling, in the same conversation, when some questions turn out not to be yours to answer; working the Spanish map's native-speaker task is another. You'd type `/to-questionnaire` yourself, since wayfinder can't start another user-invoked Skill. Feed the answers back into `/grill-with-docs`, `/to-spec`, or the ticket that was waiting.

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

- **One prompt to chart.** For a command palette (a search box of actions) in his course video manager app, he typed `/wayfinder` and a paragraph of wishes. It explored the code, asked what "done" looked like and recommended a spec, then charted seven tickets. Only three were takeable at first.
- **A new session per ticket.** He gave each ticket a fresh session, calling wayfinder with its name.
- **Research runs unwatched; prototypes run often.** He leans on prototypes so the planning doesn't harden into waterfall (heavy, low-fidelity planning up front).
- **Then the usual flow.** One map stood at 14 of 17 tickets done. The first draft of a spec he made from a map was too big for GitHub's character limit.
- **Beyond code.** He's used it to plan courses and a garden office.
- **His rule for "too heavy":** if one session can plan it, plan it in one session.

**Other developers:**

- Gilles d'Andrea (July 2026) liked that wayfinder makes fog first-class, with a named section and a rule for when it becomes a ticket, where GitHub's Spec Kit writes its guesses into an "Assumptions" section.
- AI Hero's wayfinder page (updated August 2026) reports a 27-ticket map that went stale by its thirteenth ticket. It advises one bounded piece of the product per map, plenty of prototypes, and one ticket at a time even when the frontier allows more, since parallel grilling sessions repeat questions.
- The Gray Cat (August 2026), testing two Skill packs, measured the wayfinder route spending about 35M tokens on planning before any code, and called it overkill for that feature.

## Try it yourself

````try
You need Claude Code installed and signed in, plus Git (see [Start here](/learn/start-here); check Git with `git --version`). You'll use a copy of this site's repo, which is already set up for wayfinder. Press Esc to stop the agent at any point. At a permission prompt, choose Yes for files under `.scratch/`, and No for anything unexpected. Allow about 25 minutes.

1. Clone the repo (download your own copy) and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped
cd idea-to-shipped
claude
```

2. Type `/wayfinder` but don't press Enter: check it shows in the list that pops up, then delete it. If it isn't there, type `/exit`, run this to install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode is off (plan mode only reads and proposes, so it couldn't write the map): if you see "plan mode on" under the prompt box, press Shift+Tab until it changes.
4. **A no-fog check.** Type this and answer its questions briefly:

```text
/wayfinder Make the footer text slightly larger.
```

5. When it asks how you'd like to proceed, reply `Stop here. Don't change any files.` Then type `/clear` and chart a real map:

```text
/wayfinder I want this site to work as a printed book too: every Lesson laid out for paper, with a PDF download for each Part. Destination: a spec, written with /to-spec once the map clears. Don't push any branch: this is a practice copy.
```

6. Answer the destination question, then the breadth-first round, by number. A research agent may still try to push its `research/…` branch. That fails harmlessly, since you can't write to this repo; close any GitHub sign-in window that opens.
7. When it stops, ask: `Show me the new map.md and every file in its issues folder.`
8. Optional: once any research agent has reported back, type `/clear`, then `/wayfinder` followed by the map's path, and work one ticket. Type `/exit` when you're done.

**It's working if:**

- [ ] The footer change ended without a map, after asking how you'd like to proceed.
- [ ] The Destination was agreed before any ticket existed.
- [ ] Each ticket holds a question to decide or, for a `task`, the job a decision waits on. None asks for part of the print edition to be built.
- [ ] Each ticket file has a `Type:` line, plus a `Blocked by:` line where it waits on another.
- [ ] Not yet specified and Out of scope are separate sections.
- [ ] Charting resolved no ticket by hand, and typing `!git status` (the `!` runs a shell command yourself) lists nothing under `src/`.
- [ ] (Step 8) It set `Status: claimed` before working, added an `## Answer`, set `Status: resolved`, added one line to Decisions so far, and stopped.
````

## Common mistakes

- **Wayfinder for a well-scoped feature.** If you can plan it in one sitting, `/grill-with-docs` is faster and better, even when building takes several sessions.
- **Building inside the map.** A ticket that reads "build the X" doesn't belong on the map, unless its Notes say the map carries the build.
- **Letting the agent answer for you,** or pick between your prototypes. Say so, and answer yourself.
- **Several tickets in one session.** See "Every session after" above.
- **Pre-slicing fog,** or filing out-of-scope work as fog.
- **Skipping `/to-spec`** when the map clears.
- **A vague `/research` question,** or never checking where its citations land. If a duplicate background agent appears (a known issue Matt won't fix), ask the agent to stop it.
- **One questionnaire for three people.** Run it once per recipient, in the conversation that holds the context.

```site-story
Not used on this site yet. The repo is wired for it (`/setup-matt-pocock-skills`, Matt's run-once setup Skill, wrote a "Wayfinding operations" section into `docs/agents/issue-tracker.md`), but I planned this 20-Lesson rewrite as one spec and seven tickets in `.scratch/course-rewrite/` instead, with no map.
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

```final-test scenario-foggy-effort
A bakery with twelve shops wants online ordering with delivery slots to replace its paper order books. Ten minutes of talk turns up a dozen open questions, and each answer seems to raise two more: some wait on suppliers' docs, one needs a mock-up before anyone can judge it, and several can't even be phrased yet. Which Skill do you type first?
- [ ] `/grill-with-docs`
  > That's for an idea one sitting can plan. This one keeps growing, and parts of it can't even be phrased yet.
- [ ] `/prototype`
  > A mock-up can settle the one "how should it look" question. It can't chart the dozen others around it.
- [x] `/wayfinder`
  > Right. A known destination, a route that keeps branching and fog you can't phrase yet: that's a map to chart and clear over many sessions.
- [ ] `/research`
  > Research can settle one outside fact, like what a supplier's docs say. It doesn't chart the route or handle the decisions that are yours.
```

```final-test scenario-plan-vs-build
In your repo you want recipe search with filters for diet, cooking time and ingredients. You could describe exactly what you want in five minutes, but building it will take three sessions. Which Skill do you start with?
- [x] `/grill-with-docs`, because one sitting can plan it
  > Right. Planning fits in one sitting, so grill it, then turn the multi-session build into a spec with `/to-spec` and tickets with `/to-tickets`.
- [ ] `/wayfinder`, because the build spans several sessions
  > The line is planning, not building. A build that takes several sessions can still be planned in one sitting.
- [ ] `/implement`, since you already know what you want
  > A three-session build needs a spec and tickets first, and those are written from a grilled conversation. Grill it, then `/to-spec` and `/to-tickets`.
- [ ] `/research`, to read up on how search filters work
  > Nothing here waits on an outside fact. You can decide it by talking.
```

```final-test scenario-outside-fact
Grilling a ticket-booking app, you hit a decision that waits on one fact: does your payment provider's API allow partial refunds? You'd like to keep answering the other questions meanwhile. What do you reach for?
- [ ] `/to-questionnaire`, addressed to the provider
  > The answer is written down in the provider's docs. A questionnaire is for knowledge that lives in a person's head.
- [ ] `/prototype`, to build a refund screen
  > A screen won't tell you what the API allows. That's a fact to look up.
- [ ] Accept the agent's best guess and move on
  > A guess that reads like a fact is how plans go wrong, and this one can be checked against the source.
- [x] `/research`, which leaves a cited file
  > Right. A background agent reads the provider's own docs while you carry on, and leaves one file citing each claim.
```

```final-test scenario-someone-elses-head
Planning the bakery's ordering system stalls: only Priya, the head of operations, knows how the delivery vans are scheduled, and nothing about it is written down. What do you reach for?
- [ ] `/grill-with-docs`, to talk the van schedule through with the agent
  > You're the one who doesn't know. Interviewing you about the subject only produces guesses.
- [x] `/to-questionnaire`, to write Priya questions on the van schedule
  > Right. The knowledge is in Priya's head, so it asks you who Priya is and what you need back, then writes questions aimed at the gap.
- [ ] `/research`, to send a background agent after the schedule
  > Research reads documents, and nothing about the vans is written down. It's in one person's head.
- [ ] `/wayfinder`, to chart the van schedule as a map of tickets
  > Wayfinder plans whole efforts. Getting one person's knowledge out of their head is a questionnaire's job.
```

```final-test spot-own-answers
Mo is working a `wayfinder:grilling` ticket. The agent writes "Q1: Should drivers see the whole day's route? I'll assume yes. Q2: Weekly or daily slots? I'll go with daily." Then it closes the ticket. Spot the mistake.
- [ ] It should have been labelled `research` instead.
  > Route views and slot lengths are choices, not facts to look up.
- [ ] It should have asked the two questions in separate rounds.
  > Two independent questions belong in the same round. The problem is who answered them.
- [ ] It should have taken a second ticket while it had room.
  > It's one ticket per session, and this one wasn't properly resolved anyway.
- [x] It should have waited for Mo to answer each question.
  > Right. Grilling is HITL: it only resolves through a live exchange, and an agent answering its own questions has broken it.
```

```final-test spot-build-ticket
While charting a map for a school's new booking site, the agent creates a ticket labelled `wayfinder:task` and titled "Build the parent sign-up page." The map's Notes say nothing about building. Spot the mistake.
- [x] It's building work; a task only unblocks a decision.
  > Right. Without a Notes override, the map produces decisions, not deliverables. Building the page comes after `/to-spec` and `/to-tickets`.
- [ ] It's too big: split it into one task per form field.
  > Smaller slices of building are still building. A task only unblocks a decision.
- [ ] It needs a `ready-for-agent` label so `/implement` picks it up.
  > Map tickets carry only `wayfinder:` labels. Unless the Notes say otherwise, they're decisions, not implementation work.
- [ ] It belongs in Not yet specified until it's sharper.
  > It's sharp enough. It's the wrong kind of thing for the map.
```

```final-test spot-scope-as-fog
Charting a map whose Destination is "a spec for a members' area on a climbing gym's site", the agent writes this under Not yet specified: "A members' shop, which we agreed to leave for a later project." Spot the mistake.
- [ ] It should be a ticket, since it's already phrased clearly.
  > A ticket is a question on the way to the destination. This is off the route altogether.
- [ ] It should go in Decisions so far, as a decision you made.
  > Decisions so far gets one line per closed ticket. Ruling something out isn't a step on the route.
- [x] It belongs under Out of scope, since you ruled it out.
  > Right. Not yet specified holds fog on the way to the destination. Work you've ruled beyond it goes under Out of scope and never graduates.
- [ ] It's fine there; it can graduate into tickets once the members' area is settled.
  > Fog graduates because it's on the route. This was ruled beyond the destination, so it only comes back as a fresh effort.
```

```final-test sequence-whole-effort
You're planning a huge, foggy effort in your repo. Which order is right?
- [ ] `/wayfinder` to chart → `/implement` each decision ticket → `/to-spec`
  > Decision tickets are questions, not slices of a build, and the spec comes before anything is built.
- [x] `/wayfinder` to chart → `/wayfinder <map>` per ticket → `/to-spec` → `/to-tickets`
  > Right. Chart in one session, work one ticket per session, hand the cleared map to `/to-spec`, and cut tickets from the spec.
- [ ] `/to-spec` → `/wayfinder` to chart → `/to-tickets` → `/implement`
  > There's nothing to write a spec from until the map has been worked.
- [ ] `/wayfinder` to chart and work every ticket in one session → `/to-tickets` → `/implement`
  > Charting takes a session of its own, each ticket gets its own session, and skipping `/to-spec` loses the linked detail.
```

```final-test predict-no-fog
In a repo, you type `/wayfinder Rename the Submit button on the contact form to Send.` After the destination question, the breadth-first round finds nothing foggy at all. What happens next?
- [x] It hands the next step back to you, with no map made.
  > Right. No fog means the whole journey fits in one session, so it stops and asks how you'd like to proceed.
- [ ] It creates a map with a single ticket, to stay consistent.
  > A map is only worth its overhead when there's fog to clear.
- [ ] It charts the map anyway and starts research agents.
  > With nothing unknown, there's nothing to chart or research.
- [ ] It renames the button, since the way is clear.
  > It plans rather than builds, and with no fog it stops and leaves the next step to you.
```

```final-test predict-frontier
A map's `issues/` folder holds four ticket files. `01-seating-plan.md` says `Blocked by: 03`. `02-speaker-travel.md` says `Status: claimed`. `03-catering-budget.md` says `Blocked by: 04` and has no `Status:` line. `04-venue-shortlist.md` says `Status: resolved`. You run `/wayfinder` on the map without naming a ticket. Which file does it take?
- [ ] `01-seating-plan.md`, the first by number
  > It's blocked until the catering-budget ticket is resolved. "First by number" only picks among frontier tickets.
- [ ] `02-speaker-travel.md`, to help the session working it
  > A claim tells other sessions to skip that ticket.
- [ ] `04-venue-shortlist.md`, to check its answer
  > A resolved ticket is closed. It's only opened again for its detail.
- [x] `03-catering-budget.md`, the third by number
  > Right. Its only blocker is resolved and nobody has claimed it, so it's the whole frontier. With no ticket named, the agent takes the first frontier ticket.
```

```sources
- [wayfinder SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/wayfinder/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [research SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/research/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [to-questionnaire SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/to-questionnaire/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (wayfinder as an on-ramp that merges at `/to-spec`; research and to-questionnaire as standalones; the Smart zone): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md) (each run ends with a code review): pinned to mattpocock-skills 1.3.1, read 2026-10-24.
- [/wayfinder: Nothing is too big to plan anymore](https://www.youtube.com/watch?v=F3lL98Pj90o), Matt Pocock, 2026-07-30 (why he built it 0:00–1:39; the course video manager repo 4:30–4:36; charting the command palette 5:40–6:44; a session per ticket 6:53–7:38; ticket types and waterfall 7:40–9:06; 14 of 17 done 9:18; to-spec and the character limit 9:46–10:52; spec links back to tickets 10:54–11:23; "too heavy" 11:45–12:08; garden office 12:17–12:32; courses 14:15–14:20).
- [The /wayfinder Skill](https://www.aihero.dev/skills-wayfinder), [The /research Skill](https://www.aihero.dev/skills-research) and [The /to-questionnaire Skill](https://www.aihero.dev/skills-to-questionnaire), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [Matt Pocock's Wayfinder skill gives fog a place on the map](https://ai.plainenglish.io/matt-pococks-wayfinder-skill-gives-fog-a-place-on-the-map-1dc288523ecb), Gilles d'Andrea, 2026-07-25.
- [Matt Pocock vs Addy Osmani: I Tested Both Skill Packs](https://www.youtube.com/watch?v=IDQs0VBL5UY), The Gray Cat, 2026-08-27 (overkill 0:28; the 34.9M-token Wayfinder run 4:56–5:03).
- [research skill: spawned background agent can recursively re-spawn another agent](https://github.com/mattpocock/skills/issues/530), mattpocock/skills issue #530, closed as not planned 2026-10-06, read 2026-10-24.
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes) (auto mode may push to the repo you're working in without asking), Claude Code docs, read 2026-10-24.
- This site's [issue tracker doc, "Wayfinding operations"](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/docs/agents/issue-tracker.md), written 2026-10-21, read 2026-10-23.
```
