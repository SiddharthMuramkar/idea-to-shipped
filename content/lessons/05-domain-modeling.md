---
title: Domain modeling
slug: domain-modeling
order: 5
part: 2
image: /photos/domain-modeling.jpg
imageAlt: A thick dictionary with thumb-index tabs lies open on a pale wooden table against a dark wall.
imageCredit: Pisit Heng
---

Settle your project's words once, while the agent grills you, and keep them in files every later session reads.

```goals
- You'll be able to explain what `/grill-with-docs` adds to a grilling session, and why shared words make the agent's replies and code easier to follow.
- You'll be able to judge a `GLOSSARY.md` entry: one term, what it is, the words to avoid, and no implementation details.
- You'll be able to decide whether a decision earns an ADR using the three tests, and say where every other decision goes.
- You'll be able to rescue a reply that lost you with `/wait-what`, and notice when the domain-modeling half of a session didn't run.
```

## Why it matters

Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) starts every session knowing nothing about your project. A session is one conversation, from starting `claude` until you clear it or quit. What you explained yesterday is gone today, unless it's in a file the agent reads.

That bites hardest with words. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code (short instruction files the agent loads when you type their name), hit it while planning a feature for his course-making app. His idea mentioned a "standalone video", which to him obviously meant a video not attached to any lesson. The agent had no idea, so it asked, or guessed, and padded its replies re-describing things that already had names. When the two of them did land on a good word, it lived only in that conversation.

The cost adds up. On this site, a note left under a Lesson could be a comment, a message or a post. If one session says "message" and the next says "post", the code gets two names for one thing. Decisions fade the same way: Comments here point at Lessons in an unusual way (you'll meet it below), and an agent that doesn't know why might "fix" it and break every comment.

The cure is a thin layer of documentation that grows while you plan. The project's ==domain== (the problem it's about: its things, rules and words) goes into a glossary, and the rare decision that would surprise a newcomer gets a one-paragraph record. Matt's `/grill-with-docs` Skill writes both during a grilling session.

```callout big-idea
Write a word down the moment you agree on it, and the next session starts with your words instead of guessing at them.
```

## The idea: grilling plus a paper trail

A grilling session is an interview: the agent asks about every decision your idea depends on, in numbered rounds with a recommended answer for each, until you share one understanding (see [Grilling](/learn/grilling)). `/grill-with-docs` is one line telling the agent to load two Skills: `grilling` for the interview and `domain-modeling` for the docs.

It's a ==user-invoked Skill==: only you can start it, by typing its name at the start of a message. `/domain-modeling` is model-invoked: you can type it, or the agent may reach for it when a task fits, such as discussing the project's terminology.

The idea comes from the *ubiquitous language* of Eric Evans' book *Domain-Driven Design* (2003): the people who know the problem, the developers and the code should all use the same words. Matt first ran a separate ubiquitous-language Skill mid-grill, then merged the two. Domain modeling adds four moves to the interview:

1. **Challenge against the glossary.** Use a word that clashes with one already defined, and it says so at once and asks which you mean.
2. **Sharpen fuzzy words.** A vague or overloaded word ("account": the customer or the login?) gets one precise term.
3. **Invent scenarios.** It makes up awkward cases to find where one idea ends and the next begins.
4. **Check the code.** When you say how something works, it checks whether the code agrees.

Then it writes, but not everything. This is the part people get wrong:

| What got settled | Where it lands |
|---|---|
| A term: the project's word for a thing | `GLOSSARY.md`, ==the moment it's settled== |
| A decision that's hard to reverse, surprising without context, and a real trade-off | A short decision record (an ADR) in `docs/adr/` |
| Everything else you decided | The conversation, and nowhere else |

That last row is most of what you decide. It stays in the agent's context window (its working memory for this conversation) until `/to-spec` turns it into a spec, a written description of what to build. So never `/clear` (the Built-in command that empties the conversation) straight after grilling.

Nothing needs setting up first. `GLOSSARY.md` appears at the root of your repo (your project's folder, tracked with Git) when the first term is settled, and `docs/adr/` arrives with the first decision that earns a record. Plenty of sessions never create an ADR.

```scene files
title: What a session adds to this site's repo (illustrative)
# Before you start, the repo holds code and Lessons. No docs exist, and none are needed.
+ content/lessons/04-grilling.md
+ src/comments/comments.ts
# The first term is settled ("Visitor": anyone reading the site). Only now is GLOSSARY.md created.
+ GLOSSARY.md
# Another term is settled. Each one is written as it happens, not saved up for the end.
~ GLOSSARY.md
# A decision passes all three tests, so the agent offers a record. You say yes, and docs/adr/ appears with it.
+ docs/adr/0001-rest-endpoints-in-nextjs.md
# A scenario sharpens an old term, so its entry is rewritten. Every other decision adds no file: it waits in the conversation.
~ GLOSSARY.md
```

```checkpoint where-it-lands
You're grilling a recipe site with `/grill-with-docs`. You agree that v1 shows metric units only, since imperial can come later. Where does that decision live when the session ends?
- [ ] In `GLOSSARY.md`, under a new entry called Units.
  > The glossary holds the project's words and what they mean, not choices like this one.
- [x] Only in the conversation, until you run `/to-spec`.
  > Right. Most decisions aren't terms and don't earn an ADR, so they stay in the conversation. Don't clear before `/to-spec`.
- [ ] In a new ADR, because every agreed decision gets its own record.
  > An ADR needs all three tests. "Metric only" is easy to reverse, so it doesn't qualify.
- [ ] In a decisions file the Skill keeps next to the glossary.
  > There's no such file. Terms go to the glossary, rare big decisions to ADRs, and everything else stays in the conversation.
```

## The glossary

`GLOSSARY.md` has a fixed shape: a heading naming the project, a sentence about what it is, then a `## Language` list. Here's one of this site's real entries in that shape:

```md
# Lesson Site

A small personal course that teaches Matt Pocock's Skills, written as a journal of building this site.

## Language

**Visitor**:
Anyone reading the site. Visitors are anonymous and have no accounts.
_Avoid_: User, member, commenter
```

The rules:

- **Be opinionated.** One word per thing; the rejected synonyms go under `_Avoid_`.
- **Say what it is**, in one or two sentences.
- **Only this project's words.** "Timeout" doesn't belong, however often the code uses it.
- **Group terms under subheadings** once clusters appear (this site uses Course and Discussion).

One rule outranks the rest. The domain-modeling Skill puts it bluntly: "It is a glossary and nothing else." No tables, endpoints, frameworks, decisions or to-do notes. Models tend to treat the file as a place to save every answer, until it swells into a spec. This entry has gone wrong: everything after "A row" is storage and decisions, not what a Comment *is*.

```md
**Comment**:
A row in the comments table (id, lesson_slug, body). POST /api/comments rejects bodies over 2,000 characters. We decided not to allow editing.
_Avoid_: Message, post
```

Why bother? The agreed words become the names in your code (variables, files, tables), so searching for "Comment" finds everything about comments. Matt also reports shorter replies and less of the model's thinking text, because nothing needs re-describing. Other Skills, like `/to-spec`, `/to-tickets`, `/triage` and `/wait-what`, use the glossary's words, and the one-time setup Skill, `/setup-matt-pocock-skills`, records where it lives in a file linked from `CLAUDE.md` (the instructions the agent reads at the start of every session).

A huge repo holding several apps can split it: a `GLOSSARY-MAP.md` at the root points to one glossary per area. Matt reckons one glossary suits about 99% of people, and today's setup picks that by default. And before version 1.3.0 (October 2026) the file was called `CONTEXT.md`, as Matt's older videos say. The Skills now look only for the new name, so rename an old one with `git mv CONTEXT.md GLOSSARY.md`.

```checkpoint glossary-entry
A bike-rental shop's repo is getting its first `GLOSSARY.md`. Which entry belongs in it?
- [ ] **Retry**: How many times a failed network request is sent again before the app gives up.
  > That's a general programming idea. Only words specific to this project's problem belong.
- [ ] **Late fee**: £5 a day, charged through Stripe; we agreed on this in round 3.
  > That's a decision plus implementation details. The glossary defines what things are, nothing else.
- [ ] **Rental / Booking / Hire**: Three names we use for the very same thing.
  > Be opinionated: pick one word and list the others under `_Avoid_`.
- [x] **Rental**: One customer's use of one bike for an agreed time. _Avoid_: Booking, hire
  > Right. One word, what it is in a sentence, and the rejected synonyms under `_Avoid_`.
```

## Decision records: the three tests

An ADR (Architecture Decision Record) is a tiny Markdown file in `docs/adr/`, numbered in order: `0001-slug.md`, `0002-slug.md`. The template is a short title plus one to three sentences: the context, the decision and why. Optional sections (a Status line, rejected options, consequences) appear only when they add something. ==One paragraph is a complete ADR.==

The agent offers one only when all three of these hold:

1. **Hard to reverse.** Changing your mind later costs real work. Swapping one date library for another doesn't count.
2. **Surprising without context.** A future reader would ask, in the words of Matt's ADR guide, "why on earth did they do it this way?"
3. **A real trade-off.** There were genuine alternatives, chosen between for specific reasons. "We used TypeScript in a TypeScript project" records nothing.

Miss any one and there's no ADR. Kinds that tend to pass: the system's overall shape; technology that would take months to swap (database, login provider, hosting); scope calls, including firm "no"s; deliberate departures from the obvious path; and constraints invisible in the code, like a legal rule.

One from this site: Lessons are Markdown files, Comments are database rows, and each Comment stores its Lesson's Slug, the Lesson's permanent short name (like `grilling`). A database can't link a row to a file, so there's no foreign key (the usual rule that refuses a row pointing at something missing). A written rule protects the link instead: a Slug never changes. Hard to reverse? Moving Lessons into the database means a new table and an editor. Surprising? Most apps would use a foreign key. A trade-off? Yes, and the record says why the alternative lost. So it's ADR 0004. "Show the oldest comments first", by contrast, is easy to flip and puzzles nobody, so it stays in the conversation.

If a decision is overturned later, write a new ADR and mark the old one "superseded" at the top, so an agent reading it knows it no longer holds.

```checkpoint earns-an-adr
Which of these decisions, made while grilling a school's homework app, should the agent offer to record as an ADR?
- [ ] Use one date-picker library rather than another, since both would do the job.
  > Easy to swap later, so it fails "hard to reverse". You'd just change it.
- [ ] Make the submit button green, to match the school's colours.
  > Easy to change, and nobody will wonder why. It fails two of the tests.
- [x] Store pupils' marks only in the council's database, as its rules require.
  > Right. Costly to undo, invisible in the code, and a real trade-off against an easier setup. All three tests pass.
- [ ] Write the app in TypeScript, because the whole project already uses TypeScript.
  > No real alternative was weighed, so there's nothing to record beyond "we did the obvious thing".
```

## A session, step by step

Here's a short, invented session in this site's repo, which already has a glossary. Watch for the four moves, and for the moment a word gets written down.

```scene chat
title: Adding spam flags to this site with grill-with-docs (illustrative)
# You type the Skill and a rough idea, in your everyday words.
you: `/grill-with-docs` Let users flag a spammy comment so I can hide it.
# It reads GLOSSARY.md and the code first. Round 1 opens with the clashes between your words and the glossary.
agent: ❓ **Q1** - **Who flags**: Your glossary says **Visitor** and lists "User" under _Avoid_. By "users", do you mean any Visitor? ➡️ Yes: anyone reading can flag.
agent: ❓ **Q2** - **Hiding**: The glossary says a Comment can't be edited once posted. Is hiding separate from editing, so the Comment is kept, just not shown? ➡️ Yes.
# You answer the whole round in one line.
you: 1 yes, 2 yes. I want to be able to unhide it.
# The moment a word is settled, it goes into the glossary, mid-session.
agent: Added **Flag** to GLOSSARY.md: a Visitor's mark that one Comment may be spam. _Avoid_: report, vote. Updated **Comment**: a hidden Comment is kept but not shown.
# It invents a scenario to find the edge of the idea, and checks your idea against the code.
agent: ❓ **Q3** - **Many flags**: A Comment gets five Flags overnight while you're away. Should it stay visible until you decide? ➡️ Yes. (I checked `src/comments`: nothing hides a Comment today, so this is all new.)
# You agree. Nothing is left to ask.
you: 3 yes.
# It closes like any grilling session. No decision passed all three tests, so there's no ADR, and the rest lives in the conversation.
agent: That covers every branch. Any Visitor can flag; only you hide or unhide; nothing hides itself. Glossary: added **Flag**, updated **Comment**. No ADR: hiding is easy to undo. Is that our shared understanding?
```

Q1 challenged your word against the glossary. Q2 caught your idea bumping into an existing definition. Q3 was an invented scenario plus a code check. The glossary changed twice before the end, while every other decision, like who can unhide, lives only in the conversation.

```checkpoint glossary-clash
A gym app's glossary defines **Session** as one 60-minute class slot and **Booking** as a member's place in a Session. Mid-grilling you say: "Members can cancel a session up to an hour before." What should a working `/grill-with-docs` session do next?
- [x] Point out the clash and ask whether you mean cancelling a Booking.
  > Right. Challenging your words against the glossary is the first of domain modeling's moves.
- [ ] Quietly rewrite the Session entry so it matches what you just said.
  > It doesn't change the glossary behind your back. A clash gets called out so you decide.
- [ ] Add "cancel a session" to the glossary as a brand-new term.
  > That piles a vague phrase on top of the clash instead of resolving it.
- [ ] Offer an ADR, because a cancellation rule is an important decision.
  > Cancellation timing is easy to change, and the real problem here is the word, not a record.
```

## Your part

The agent proposes; you decide.

- **Own the words.** Pick one word per thing and stick to it. Don't accept a term you couldn't explain to a friend.
- **Don't bike-shed** (argue endlessly over small things). Once a name is good enough, move on; names can be refactored later.
- **Read the glossary now and then.** An unreviewed, agent-written glossary fills with confident claims that later sessions trust. If it bloats, type `/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it`. Split it only once it's lean.
- **Existing project, no docs?** Type `/grill-with-docs help me document my repo`, and expect a long interview.
- **Check both halves loaded.** All the questions at once with no ➡️ recommendations means neither loaded properly. Good rounds but a `GLOSSARY.md` that never changes means only grilling did. Ask "Which Skills did you load?", or type `/domain-modeling` yourself.
- **Know when to skip it.** No repo: `/grill-me`, the same interview with no files. A throwaway one-day build doesn't need a glossary. An effort too big to plan in one sitting starts with `/wayfinder` (Part 4).
- **Finish like any grilling.** Small change: `/implement` (Matt's Skill that builds it) right there. Multi-session build: `/to-spec`, then `/to-tickets` (which splits the spec into tickets, small tasks of one session each), in the same conversation (see [Spec + tickets](/learn/spec-and-issues)), then check the spec against your own answers.

## When a reply loses you

Even with a glossary, some replies lose you: invented jargon, a pile of acronyms, a conclusion whose premise you never saw. `/wait-what` is a three-line, user-invoked Skill for that moment. It tells the agent you didn't follow and asks it to re-pitch with a little context, in ASD-STE100 Simplified Technical English (a controlled English from aircraft maintenance manuals: short sentences, one meaning per word), using your `GLOSSARY.md` words.

==The leading word does the work.== "Be concise" is about the output, and the model obeys by cutting words, which loses you further. "Wait" is about *your* state. So the agent backs up, adds the step you missed, and only then trims. It re-pitches "that", deciding for itself how far back to go. Without a glossary it still works, minus the shared words.

Matt added it in August 2026, when he found Opus 5's replies verbose and hard to follow. In the same video he names the real cure: your own words, settled in `/grill-with-docs`. So `/wait-what` repairs one reply, and the glossary stops the jargon arriving.

```checkpoint wait-what-reply
You type `/wait-what` after a reply full of jargon. What should the re-pitch look like?
- [ ] The same reply cut to about half its length, keeping its terms.
  > That's what "be concise" gets you: fewer words, and you're still lost.
- [x] Clearer, with the missing step added, in your glossary's words.
  > Right. Shorter is fine, but it must also add the context you missed and use the project's own words.
- [ ] Only the last sentence, reworded in simpler language.
  > It re-pitches "that", and the agent decides how far back to go. What lost you is often bigger than one sentence.
- [ ] A list of new glossary entries for each unfamiliar word.
  > It explains; it doesn't change the glossary. Settling words is the job of `/grill-with-docs`.
```

## How Matt and others use it

**Matt Pocock** makes `/grill-with-docs` the first step of his Main flow (the path most work takes, from idea to shipped) whenever there's a repo.

- **A codebase means the docs version.** His rule in the May 2026 video introducing it: with a codebase, `/grill-with-docs`; without one, `/grill-me`. Even on a brand-new project he'd pick the docs version, because the start is when shared words get set.
- **Language first.** In that demo, the agent's first move was to flag a tension with an existing glossary entry, and a naming question ended up deciding whether the page got its own section. (He asked it to save the terms near the end; today's version writes each one as it's settled.)
- **Good enough, then move on.** He calls time on naming debates, yet takes names seriously, because they flow into every variable and file name.
- **One glossary, one plain name.** In his July 2026 walkthrough he chose a single glossary for the repo. In October 2026 he renamed `CONTEXT.md` to `GLOSSARY.md`, because "context" felt vague and the file had become just a glossary.

**Other developers:**

- In an October 2026 review, Colin Eberhardt, CTO of Scott Logic, described rebuilding his karting app with the Skills. Five minutes of grilling gave a roughly 45-line glossary and one ADR worth having: there's no "Kart" record, because chassis, engine and tyres wear out and get swapped separately. That's "surprising without context" in a sentence.
- In an August 2026 GitHub discussion, a user with dozens of ADRs watched an agent find an old record and a newer one that contradicted it, then pick whichever suited it. Hence the advice to mark superseded records at the top.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)).

1. Make an empty folder, turn it into a Git repo and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir book-club
cd book-club
git init
claude
```

2. Type a slash and the word grill. If `grill-with-docs` isn't in the list, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box (a mode where the agent only reads and plans), press Shift+Tab until it changes.
4. Type this. The fuzzy words ("people", "members", "thoughts") are on purpose:

```text
/grill-with-docs I want a small site for my book club. Each month we pick a book, people post their thoughts on it, and old books move to an archive. Members don't need accounts.
```

5. Answer each round by number. When it asks what to call something, pick one word.
6. Once a word is settled, peek at the file (a leading `!` runs a shell command):

```text
!cat GLOSSARY.md
```

7. After any reply, type `/wait-what` and compare the two versions.
8. Ask: "Would any of our decisions earn an ADR? For each candidate, say which of the three tests it passes or fails."
9. Type "Let's wrap up." and correct anything wrong in the summary. If it asks permission to create `GLOSSARY.md` or an ADR, choose Yes; for any other file, choose No, or press Esc. Type `/exit` when you're done.

**It's working if:**

- [ ] `GLOSSARY.md` appeared mid-session, after the first word was settled, and grew term by term.
- [ ] Each entry has a bold term, a one- or two-sentence definition of what it *is*, and an `_Avoid_:` line.
- [ ] The glossary holds no tables, pages, frameworks or decisions.
- [ ] It challenged a fuzzy word, such as whether "people" and "members" are the same.
- [ ] It invented an awkward case, such as what happens to posts when a book is archived.
- [ ] You got zero or one ADR, and for each rejected candidate it said which test failed.
- [ ] `/wait-what` came back clearer, not just shorter, in your glossary's words.

No ➡️ recommendations, or no glossary? Ask: "Did you load grilling and domain-modeling?"
````

## Common mistakes

- **Using `GLOSSARY.md` as a spec.** Trim it before you think about splitting it.
- **An ADR for every choice.** If you could undo it tomorrow, or nobody would wonder why, it isn't one.
- **Assuming the docs hold every decision.** Run `/to-spec` before any `/clear`.
- **Asking for it in plain words.** Type `/grill-with-docs` at the start of your message.
- **Endless naming debates,** or accepting words you don't understand.
- **Leaving an old `CONTEXT.md`** after updating the Skills.
- **Asking for "concise" when you're lost.** Type `/wait-what`.

```site-story
I didn't use `/grill-with-docs`. I grilled the whole site with `/grilling`, then, with every decision still in the conversation, typed just this:

    /domain-modeling

**It wrote six terms**: Lesson, Slug, Skill, Phase, Comment and Visitor. It caught one fuzzy idea on its own: a Lesson isn't the same as a Skill, because "Start here" and "Models, effort & ultracode" don't teach one.

**It wrote four ADRs**, one paragraph each. Don't worry if the stack names mean nothing yet.

| ADR | Decision |
|---|---|
| 0001 | Real REST endpoints inside Next.js, not Server Actions or a separate FastAPI service |
| 0002 | One Neon database branch per environment, with migrations on every build |
| 0003 | Tests hit a real Postgres database, never mocks |
| 0004 | Comments point at Lessons by a permanent Slug, with no foreign key |

**Then it tested the design with a scenario:** what if you rename a Lesson? Comments store the Slug, so after a rename they'd silently vanish from the page. I didn't get it at first, asked for a breakdown, then mixed up the Slug with the API endpoint: a `/wait-what` moment, before I knew the Skill. I decided Slugs never change; numbers go in filenames, never in Slugs. A written rule turned out cheaper than extra machinery, and the ADR says why, so nobody "fixes" it later.

**It paid off.** When this course grew to 20 Lessons, every file was renumbered and every Slug stayed put; the commit message cites ADR 0004. Every spec on this site opens by telling the agent to read `GLOSSARY.md` and the ADRs, and a later code review flagged the home page for calling Skills "commands", a word the glossary avoids.

**The docs need upkeep.** A review found ADR 0004's wording no longer matched the code, so I fixed it. The glossary later gained Main flow and Built-in command, and this rewrite redefines Phase, because my meaning ("one step of building this site") clashed with Matt's.

Today I'd type `/grill-with-docs` once, and the terms would be written during the interview, not after it.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Start a change in a repo | `/grill-with-docs <your rough idea>` |
| No repo | `/grill-me` instead |
| A word clashes or is fuzzy | Pick one; the rest go under `_Avoid_` |
| A glossary entry | Bold term, what it *is* in one or two sentences, an `_Avoid_:` line, no implementation details |
| An ADR? | Only if hard to reverse **and** surprising without context **and** a real trade-off |
| Every other decision | Lives in the conversation: `/to-spec` before any `/clear` |
| A reply lost you | `/wait-what` |
| The glossary never changes | Ask which Skills loaded, or type `/domain-modeling` |
| An old `CONTEXT.md` | `git mv CONTEXT.md GLOSSARY.md` |

## Final test

```test scenario-new-words
You're in your team's repo for a dog-walking app, about to plan a feature. You keep saying "walk", "outing" and "slot" for what may be the same thing, and you want those words settled and written where next week's session will find them. Which Skill do you type?
- [ ] `/grill-me`, then copy the agreed words into a notes file yourself
  > Same interview, but it saves nothing. In a repo, the docs version writes the glossary for you.
- [x] `/grill-with-docs`
  > Right. Grilling plus domain modeling: it settles each word and writes it to `GLOSSARY.md` as you go.
- [ ] `/wait-what`, each time the agent uses a word you didn't expect
  > That repairs one confusing reply. It doesn't settle words or write anything down.
- [ ] `/to-spec`, so the agreed words end up in the spec
  > `/to-spec` writes from an already-grilled conversation, and a spec isn't where the project's words live.
```

```test scenario-glossary-missing
Twenty minutes into a `/grill-with-docs` session, the questions arrive in tidy numbered rounds with ➡️ recommendations, and you've settled several names. But `GLOSSARY.md` still doesn't exist. What's the most likely explanation?
- [ ] The glossary is written in one go when the session ends.
  > It's written inline, the moment each term is settled.
- [ ] The grilling Skill failed to load properly.
  > Numbered rounds with recommendations show that grilling did load.
- [x] Only grilling loaded; domain modeling didn't.
  > Right. Ask which Skills loaded, or type `/domain-modeling` yourself.
- [ ] You need `/setup-matt-pocock-skills` to create an empty glossary first.
  > Nothing is set up in advance. The file is created when the first term is settled.
```

```test scenario-lost-reply
Mid-grilling, the agent writes: "Given the fan-out invariant, the reconcile pass must stay idempotent across shards." You've no idea how it got there. What do you type next?
- [x] `/wait-what`
  > Right. It tells the agent you stopped following, so it backs up, adds the missing step and uses your glossary's words.
- [ ] "Be concise."
  > That's about the output, so the model clips words. Shorter, but you're still lost.
- [ ] `/clear`, then explain the feature again
  > That empties the conversation, including every decision you've made so far.
- [ ] `/compact`, so the agent summarises the session
  > That replaces the history with a summary. It doesn't explain the reply that lost you.
```

```test scenario-no-docs-repo
You join a three-year-old repo with no `GLOSSARY.md` and no ADRs. People use "ticket", "case" and "job" loosely for what might be one thing. You want a trustworthy glossary before planning any feature. What's the best move?
- [ ] Ask the agent to write a glossary from the code in one go, then commit it unread.
  > An unreviewed, agent-written glossary fills with confident claims later sessions trust. You decide which words are right.
- [ ] Run `/setup-matt-pocock-skills`, which generates the glossary from your code.
  > Setup only records where the domain docs live. The glossary itself is built term by term.
- [ ] Create a `GLOSSARY-MAP.md` with one area per folder, then fill each one in.
  > Splitting comes last, and only for very large repos. Most need a single glossary.
- [x] Type `/grill-with-docs help me document my repo`, and expect a long interview.
  > Right. It reads the code, asks what each thing really is, and writes each settled term as you go.
```

```test spot-recipe-entry
Here's a new entry in a recipe site's glossary: **Recipe**: A row in the recipes table (id, slug, steps as JSON). The API caps steps at 30, and in round 2 we dropped video. _Avoid_: Dish, post. What's wrong with it?
- [ ] It needs a Considered Options section explaining the rejected names.
  > That's an optional ADR section. A glossary entry just lists rejected words under `_Avoid_`.
- [x] It describes storage, limits and decisions, not what a Recipe is.
  > Right. A glossary holds no implementation details or decisions: say what a Recipe *is*, in a sentence or two.
- [ ] "Recipe" is a general programming term, so it shouldn't be there.
  > It's specific to this project's problem. The term is fine; the definition isn't.
- [ ] It should have been saved as an ADR rather than in the glossary.
  > None of it passes the three ADR tests. The fix is a shorter, cleaner definition.
```

```test spot-adr-pile
Dana's first `/grill-with-docs` session on a habit tracker left 14 ADRs, including "Use date-fns for dates", "Round the button corners" and "Show streaks on the home page". Spot the mistake.
- [x] Most of those fail the three tests, so they shouldn't be ADRs.
  > Right. Each could be undone tomorrow, and nobody would wonder why. An ADR needs all three tests at once.
- [ ] They should all be merged into one big decisions file.
  > ADRs are one decision per numbered file. The problem is that these aren't ADR material at all.
- [ ] Each ADR needed Status, Considered Options and Consequences sections.
  > Those sections are optional. One short paragraph is a complete ADR.
- [ ] They belong in `GLOSSARY.md`, which holds the session's choices.
  > The glossary holds words and what they mean, never decisions.
```

```test spot-assumed-saved
Omar finishes `/grill-with-docs` for a multi-session feature. `GLOSSARY.md` gained six terms and there's one new ADR, so he decides everything's saved, types `/clear`, and runs `/to-spec` the next morning. The spec misses the 30-day refund window he agreed. Spot the mistake.
- [ ] He should have asked for an ADR about the refund window.
  > A refund window is easy to change, so it fails the ADR tests. It belonged in the conversation, then the spec.
- [ ] `/to-spec` should have run before `/grill-with-docs`.
  > `/to-spec` writes from a grilled conversation. Run first, it has nothing to write from.
- [x] The docs hold terms and rare decisions; `/clear` erased the rest.
  > Right. Most decisions live only in the conversation. Run `/to-spec` in the same session, before any `/clear`.
- [ ] The glossary should have recorded the 30-day refund window as a term.
  > A refund window is a decision, not a word for a thing. The glossary holds no decisions.
```

```test sequence-files-appear
You run `/grill-with-docs` in a brand-new repo with no docs. You settle your first term in round 1 and accept one ADR in round 3. Which sequence matches what happened on disk?
- [ ] `docs/adr/` and an empty `GLOSSARY.md` are created → terms fill in → the ADR is written
  > Nothing is set up in advance. Files appear only when there's something to write.
- [x] First term settled → `GLOSSARY.md` created → more terms added → ADR offered and written
  > Right. The glossary is born with the first settled term and grows inline; `docs/adr/` arrives with the first ADR you accept.
- [ ] The interview ends → every term is written to `GLOSSARY.md` at once → then the ADR
  > Terms are written the moment they're settled, not saved up for the end.
- [ ] The ADR is written → the agent copies its key words into a new `GLOSSARY.md`
  > The two are separate. Terms are written as they're settled, whether or not any ADR appears.
```

```test why-not-surprising
A team picks Tailwind (a styling library) for a new app. Swapping it out later would mean restyling every page, and there were real alternatives. But it ships with their framework's starter template, so nobody reading the code would be surprised. Should the agent offer an ADR?
- [ ] Yes: being hard to reverse is enough on its own.
  > All three tests must pass, not just one.
- [ ] No: a styling library is always easy to swap out.
  > Here swapping it is costly, so it passes "hard to reverse". A different test fails.
- [ ] Yes, and add Tailwind to `GLOSSARY.md` as well.
  > Tailwind is a general tool, not a word from the project's problem, so it isn't a glossary term either.
- [x] No: it fails "surprising without context".
  > Right. Hard to reverse and a real trade-off, but nobody will wonder why, so there's nothing to explain.
```

```test why-shared-words
A teammate asks: "The agent can read our code, so why keep a glossary at all?" What's the strongest reply?
- [x] Agreed words become the names in our code and replies, so nothing gets two names.
  > Right. Each new session starts from the same words, replies get shorter, and the code is easier to search.
- [ ] It stores every decision, so we never need to write a spec.
  > The glossary holds terms only. Most decisions live in the conversation until `/to-spec`.
- [ ] It lets the agent skip grilling next time, because the answers are already written down.
  > Words aren't decisions. Each new change still needs its own interview.
- [ ] It gives the agent a memory of every past conversation.
  > The agent has no memory between sessions. It knows only what's in the files it reads, and the glossary holds words, not conversations.
```

```sources
- [grill-with-docs SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/grill-with-docs/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [domain-modeling SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/SKILL.md), with its [GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md) and [ADR-FORMAT.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/ADR-FORMAT.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [wait-what SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/wait-what/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (`/grill-with-docs` as the Main flow's first step; "Vocabulary underneath"): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (1.3.0, #1120: `CONTEXT.md` renamed `GLOSSARY.md`; #751: wait-what): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), [The /domain-modeling Skill](https://www.aihero.dev/skills-domain-modeling) and [The /wait-what Skill](https://www.aihero.dev/skills-wait-what), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [I stopped using /grill-me for coding. Here's what I use instead](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock, 2026-05-14 (standalone-video jargon 2:20–3:28, ubiquitous-language origin 3:40–4:44, ADR tests 7:27–8:24, demo 8:35–11:30, good enough 11:54–12:22, benefits 12:25–13:21, grill-me vs grill-with-docs 13:35–14:25).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (single vs multi-context setup 5:54–6:22; ask-matt routes to `/grill-with-docs` 7:46–7:57).
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05 (why wait-what exists, 2:32–4:00; watched via a machine-translated track, so paraphrased loosely).
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (the `GLOSSARY.md` rename, 8:11–9:36).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [How to deal with conflicting ADRs?](https://github.com/mattpocock/skills/discussions/847), mattpocock/skills GitHub discussion, 2026-08-13, read 2026-10-23.
```
