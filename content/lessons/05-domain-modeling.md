---
title: Domain modeling
slug: domain-modeling
order: 5
part: 2
---

Settle your project's words once, while the agent grills you, and keep them in a file that later sessions and Skills can read.

```goals
- You'll be able to explain what `/grill-with-docs` adds to a grilling session, and why shared words make the agent's replies and code easier to follow.
- You'll be able to judge a `GLOSSARY.md` entry: one term, what it is, the words to avoid, and no implementation details.
- You'll be able to decide whether a decision earns an ADR using the three tests, and say where every other decision goes.
- You'll be able to rescue a reply that lost you with `/wait-what`, and notice when the domain-modeling half of a session didn't run.
```

## Why it matters

Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) starts every session blank. A session is one conversation, from starting `claude` until you clear it or quit. What you explained yesterday is gone today, unless it's in a file the agent reads.

That bites hardest with words. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code (short instruction files the agent loads when you type their name, or, for some, when a task fits), hit it while planning a feature for his course-making app. To him, a "standalone video" obviously meant one not attached to any lesson or course. The agent had to ask or dig through the code, and its replies kept re-describing things that already had names. When they did land on a good word, it lived only in that conversation.

On this site, a note under a Lesson could be a comment, a message or a post; if one session says "message" and the next "post", the code gets two names for one thing. Decisions fade too: Comments here point at Lessons in an unusual way, and an agent that doesn't know why might "fix" it and break every comment.

The cure is a thin layer of docs that grows while you plan. The project's ==domain== (the problem it's about: its things, rules and words) goes into a glossary, and the rare decision that would surprise a newcomer gets a one-paragraph record. Matt's `/grill-with-docs` Skill writes both while the agent interviews you.

```callout big-idea
Write a word down the moment you agree on it, and later sessions can start from your words instead of guessing at them.
```

## The idea: grilling plus a paper trail

A grilling session is an interview: the agent asks about every decision your idea depends on, in numbered rounds with a recommended answer for each, until you share one understanding (see [Grilling](/learn/grilling)). `/grill-with-docs` is one line telling the agent to load two Skills: `grilling` for the interview and `domain-modeling` for the docs.

It's a ==user-invoked Skill==: only you can start it, by typing its name at the start of a message. `/domain-modeling` is model-invoked: you can type it, or the agent may reach for it when a task fits, such as discussing the project's terminology.

The idea comes from the *ubiquitous language* of Eric Evans' book *Domain-Driven Design* (2003): the people who know the problem, the developers and the code should all use the same words. Domain modeling adds four moves to the interview:

1. **Challenge against the glossary.** Use a word that clashes with one already defined, and it says so at once and asks which you mean.
2. **Sharpen fuzzy words.** A vague or overloaded word ("account": the customer or the login?) gets one precise term.
3. **Invent scenarios.** It makes up awkward cases to find where one idea ends and the next begins.
4. **Check the code.** When you say how something works, it checks whether the code agrees.

Then it writes, but not everything:

| What got settled | Where it lands |
|---|---|
| A term: the project's word for a thing | `GLOSSARY.md`, ==the moment it's settled== |
| A decision that passes three tests: hard to reverse, surprising without context, a real trade-off | A short decision record (an ADR) in `docs/adr/` |
| Everything else you decided | Only the conversation |

That last row is most of what you decide. It lives only in the agent's context window (its working memory for this conversation; see [The context window](/learn/context-window)) until `/implement` builds it or `/to-spec` writes it into a spec, a written description of what to build. So before then, don't run `/clear` (which empties the conversation) or `/compact` (which swaps it for a summary), two Built-in commands: ones that come with Claude Code itself, not Skills. On a multi-session build, wait until `/to-tickets` has split the spec into tickets (small tasks of one session each).

None of these files need setting up first. `GLOSSARY.md` appears at the root of your repo (your project's folder, tracked with Git, a tool that records every change) when the first term is settled, and `docs/adr/` arrives with the first decision that earns a record. Plenty of sessions never create an ADR.

```scene files
title: What a session adds to this site's repo (illustrative)
# No docs exist before you start, and none are needed. The first term is settled ("Visitor": anyone reading the site), and only now is GLOSSARY.md created.
+ GLOSSARY.md
# Another term is settled. Each one is written as it happens, not saved up for the end.
~ GLOSSARY.md
# A decision passes all three tests, so the agent offers a record. You say yes, and docs/adr/ appears with it.
+ docs/adr/0001-rest-endpoints-in-nextjs.md
# A scenario sharpens an old term, so its entry is rewritten. Every other decision adds no file: it waits in the conversation.
~ GLOSSARY.md
```

```checkpoint where-it-lands
You're grilling a recipe site with `/grill-with-docs`. You agree that v1 shows metric units only, since imperial can come later. Where does that decision live once the interview wraps up?
- [ ] In `GLOSSARY.md`, under a new entry called Units.
  > The glossary holds the project's words and what they mean, not choices like this one.
- [x] Only in the conversation, until you run `/to-spec`.
  > Right. It isn't a term and it's easy to reverse, so it stays in the conversation, waiting for `/to-spec`.
- [ ] In a new ADR, because every agreed decision gets its own record.
  > An ADR needs all three tests. "Metric only" is easy to reverse, so it doesn't qualify.
- [ ] In a decisions file the Skill keeps next to the glossary.
  > There's no such file. Terms go to the glossary, rare big decisions to ADRs, and everything else stays in the conversation.
```

## The glossary

`GLOSSARY.md` has a fixed shape: a heading naming the project, a sentence or two about what it is, then the terms, each a bold name, one or two sentences on what it *is*, and an `_Avoid_` line. The template files terms under `## Language`; this site's first glossary used its own headings. Here's its start, trimmed to one entry:

```md
# Lesson Site

A small personal course that teaches Matt Pocock's skills and agentic coding, written as a journal of building this very site.

## Discussion

**Visitor**:
Anyone reading the site. Visitors are anonymous and have no accounts.
_Avoid_: User, member, commenter
```

The rules:

- **Be opinionated.** One word per thing; the rejected synonyms go under `_Avoid_`.
- **Only this project's words.** "Timeout" (how long code waits before giving up) doesn't belong, however often the code uses it.
- **Group terms under headings** once clusters appear.

One rule outranks the rest. The domain-modeling Skill puts it bluntly: "It is a glossary and nothing else." No database details, web addresses, tool names, decisions or to-do notes. Agents tend to treat the file as a place to save every answer, until it swells into a spec. This entry goes wrong: it describes a database row, a size limit and a decision, not what a Comment *is*.

```md
**Comment**:
A row in the comments table (id, lesson_slug, body). POST /api/comments rejects bodies over 2,000 characters. We agreed in round 3 to show the newest first.
_Avoid_: Message, post
```

Why bother? The agreed words become the names in your code (variables, files, tables), so searching for "Comment" finds everything about comments. Matt also reports shorter replies, and shorter "thinking" (the reasoning the AI writes before it answers). Other Skills, like `/to-spec`, `/to-tickets` and `/wait-what`, reuse the glossary's words, and the one-time setup Skill, `/setup-matt-pocock-skills`, leaves a pointer in `CLAUDE.md` (the file Claude Code reads at the start of every session), so every session knows where to look.

A huge repo holding several apps can split it, with a `GLOSSARY-MAP.md` pointing to one glossary per area, but setup defaults to one glossary, which fits almost every repo. Before version 1.3.0 (October 2026) the file was `CONTEXT.md`, as Matt's older videos say; the Skills now look only for the new name, so rename an old one with `git mv CONTEXT.md GLOSSARY.md`.

```checkpoint glossary-entry
A bike-rental shop's repo is getting its first `GLOSSARY.md`. Which entry belongs in it?
- [ ] **Retry**: How many times a failed network request is sent again before the app gives up.
  > That's a general programming idea. Only words specific to this project's problem belong.
- [ ] **Late fee**: £5 a day, charged to the card on file, as agreed in round 3. _Avoid_: Fine, penalty
  > That's a decision plus implementation details. The glossary defines what things are, nothing else.
- [ ] **Rental / Booking / Hire**: Three names we use for the very same thing.
  > Be opinionated: pick one word and list the others under `_Avoid_`.
- [x] **Rental**: One customer's use of one bike for an agreed time. _Avoid_: Booking, hire
  > Right. One word, what it is in a sentence, and the rejected synonyms under `_Avoid_`.
```

## Decision records: the three tests

An ADR (Architecture Decision Record) is a tiny Markdown file (plain text with light formatting) in `docs/adr/`, numbered in order with a short name, like this site's `0001-rest-endpoints-in-nextjs.md`. The template is a short title plus one to three sentences: the context, the decision and why. Optional sections (Status, Considered Options for the rejected alternatives, Consequences) appear only when they add something. ==One paragraph is a complete ADR.==

The agent offers one only when all three of these hold:

1. **Hard to reverse.** Changing your mind later costs real work. Swapping one date library (a ready-made package of code) for another doesn't count.
2. **Surprising without context.** A future reader would ask, in the words of Matt's ADR guide, "why on earth did they do it this way?"
3. **A real trade-off.** There were genuine alternatives, chosen between for specific reasons. Picking TypeScript (a programming language) for a project already written in it records nothing.

Miss any one and there's no ADR. Kinds that tend to pass: the system's overall shape; technology that would take months to swap (database, login provider, hosting); scope calls, including firm "no"s; deliberate departures from the obvious path; and constraints invisible in the code, like a legal rule.

One from this site: Lessons are Markdown files and Comments are database rows, each storing its Lesson's Slug, the Lesson's permanent short name (like `grilling`). A database can't link a row to a file, so there's no foreign key (the usual rule that refuses a row pointing at something missing). A written rule guards the link instead: a Slug never changes. Hard to reverse? Moving Lessons into the database means a new table and an editor. Surprising? Most apps would use a foreign key. A trade-off? Yes, and the record says why the alternative lost. That's ADR 0004. "Show the newest comments first", by contrast, is easy to flip and puzzles nobody.

If a decision is overturned later, write a new ADR and mark the old one "superseded" in its Status, at the top.

```checkpoint earns-an-adr
Which of these decisions, made while grilling a school's homework app, should the agent offer to record as an ADR?
- [ ] Use one charting library rather than another for the progress graphs.
  > Either would do, and swapping later is cheap, so it fails "hard to reverse".
- [ ] List homework oldest first, unlike most apps, so overdue work stays on top.
  > Surprising, perhaps, but it's cheap to flip back, so it fails "hard to reverse". Missing even one test means no ADR.
- [x] Keep marks in the council's system, not the app's database, to skip a data audit.
  > Right. Moving the data later is costly, a reader would expect the app's own database, and you gave up simplicity for a lighter legal load. All three tests pass.
- [ ] Store homework as rows in the same database that every other part of the app uses.
  > That's the obvious path with no real alternative weighed, so there's nothing to record.
```

## A session, step by step

Here's a short, invented session in this site's repo, which already has a glossary. Watch for the four moves and the moment a word is written down.

```scene chat
title: Adding spam flags to this site with grill-with-docs (illustrative)
# You type the Skill and a rough idea, in your everyday words.
you: `/grill-with-docs` Let users report a spammy comment so I can hide it.
# It reads GLOSSARY.md and the code first. Round 1 challenges one of your words and sharpens another.
agent: ❓ **Q1** - **Who reports**: Your glossary says **Visitor** and lists "User" under _Avoid_. By "users", do you mean any Visitor? ➡️ Yes: anyone reading can report.
agent: ❓ **Q2** - **Name**: "Report" could mean a Visitor's mark on one Comment, or a summary sent to you. Call the mark a **Flag**, with "report" under _Avoid_? ➡️ Yes.
# You answer the round in one line. The moment a word is settled, it goes into the glossary, mid-session.
you: 1 yes, 2 yes.
agent: Added **Flag** to GLOSSARY.md: a Visitor's mark saying one Comment may be spam. _Avoid_: report.
# It invents an awkward case to find the edge of the idea.
agent: ❓ **Q3** - **Many flags**: A Comment gets five Flags overnight while you're away. Does it stay visible until you decide? ➡️ Yes: only you hide a Comment.
# You say how something works, so it checks the code, and the code disagrees.
you: 3 yes. The comment box already has a hide button, so reuse that.
agent: ❓ **Q4** - **Hiding**: I checked `src/comments`: there's no hide button, and nothing hides a Comment today. So hiding is new work for this change? ➡️ Yes.
you: 4 yes.
# Nothing is left to ask. No decision passed all three tests, so there's no ADR.
agent: That covers every branch. Any Visitor can flag; only you hide a Comment; nothing hides itself. Glossary: added **Flag**. No ADR: hiding is easy to undo. Is that our shared understanding?
```

Q1 challenged your word against the glossary, and Q2 sharpened a fuzzy one into **Flag**. Q3 invented an awkward case, and your claim about the code got checked and corrected. The glossary gained its entry the moment the word was settled; every other decision, like who can hide a Comment, lives only in the conversation.

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

- **Own the words.** One word per thing, and never accept a term you couldn't explain to a friend.
- **Don't bike-shed** (argue endlessly over small things). Once a name is good enough, move on; names can be changed later.
- **Read the glossary now and then.** An unreviewed, agent-written glossary fills with confident claims that later sessions trust. If it bloats, type `/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it`. Split it only once it's lean.
- **Existing project, no docs?** Type `/grill-with-docs help me document my repo`, and expect a long interview.
- **Check both halves loaded.** Questions without ❓ numbers and ➡️ recommendations mean grilling didn't load. Good rounds whose settled words never reach `GLOSSARY.md` mean domain modeling didn't. Ask "Which Skills did you load?", or type `/domain-modeling` yourself.
- **Know when to skip it.** No project folder: `/grill-me`, the same interview with no files. An effort too big to plan in one sitting starts with `/wayfinder` ([Wayfinder](/learn/wayfinder)).
- **Finish like any grilling.** Small change: `/implement` (Matt's Skill that builds it) right there. Multi-session build: `/to-spec`, check the spec against your answers, then `/to-tickets`, all in one conversation (see [Spec + tickets](/learn/spec-and-issues)).

## When a reply loses you

Even with a glossary, some replies lose you: invented jargon, a pile of acronyms, a conclusion whose premise you never saw. `/wait-what` is a tiny, user-invoked Skill for that moment. Its one paragraph opens "Wait, I don't understand where you've got to here." It then asks the agent to re-pitch (explain again) with a little context, in ASD-STE100 Simplified Technical English (a controlled English from aircraft maintenance manuals: short sentences, one meaning per word), using your `GLOSSARY.md` words.

==The first word, "Wait", does the work.== "Be concise" is about the output, and the agent obeys by cutting words, which loses you further. "Wait" is about *your* state, so it asks for both at once: fewer words *and* the step you missed. It re-pitches "that" (whatever lost you), and the agent decides how far back to go. Without a glossary it still works, minus the shared words.

Matt added it in version 1.2.0 (August 2026) to fight verbose replies. His changelog calls it a one-reply repair; the real cure is shared words, settled upfront with `/grill-with-docs`.

```checkpoint wait-what-reply
You type `/wait-what` after a reply full of jargon. What should the re-pitch look like?
- [ ] The same reply cut to about half its length, keeping all its terms.
  > That's what "be concise" gets you: fewer words, and you're still lost.
- [x] Clearer, with the missing step added, in your glossary's words.
  > Right. Shorter is fine, but it must also add the context you missed and use the project's own words.
- [ ] Only the last sentence, reworded in simpler language.
  > It re-pitches "that", and the agent decides how far back to go. What lost you is often bigger than one sentence.
- [ ] A list of new glossary entries for each unfamiliar word.
  > It explains; it doesn't change the glossary. Settling words is the job of `/grill-with-docs`.
```

## How Matt and others use it

**Matt Pocock** makes `/grill-with-docs` the first step of his Main flow (the path most work takes, from idea to shipped) whenever he's in a project folder (his Skills say working directory).

- **A codebase (a project's code) means the docs version.** His rule in the May 2026 video introducing it: codebase, `/grill-with-docs`; no codebase, `/grill-me`. He'd pick the docs version even for a brand-new project, since that's when shared words get set.
- **Language first.** In that demo, the agent's first move was to flag a tension with an existing glossary entry, and a naming question then decided whether standalone videos got their own section of his app. He still asked it to save near the end, though the Skill says to write as you go: peek at the file mid-session.
- **One glossary, one plain name.** In his July 2026 walkthrough he picked a single glossary, saying it suits about 99% of people. In October 2026 he renamed `CONTEXT.md` to `GLOSSARY.md`: "context" felt vague, and the file had become just a glossary.

**Other developers:**

- In an October 2026 review, Colin Eberhardt, CTO of Scott Logic, rebuilt a karting-tracker app with the Skills. Five minutes of grilling gave a roughly 45-line glossary and one ADR worth having: there's no "Kart" record, because chassis, engine and tyres wear out and get swapped separately.
- In an August 2026 GitHub discussion, a user with a few dozen ADRs found that when an old and a newer record disagreed, the agent picked whichever suited the change it wanted. They proposed putting the status line at the top, the part an agent reliably reads.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)).

1. Make an empty folder and start Claude Code in it. If it asks whether you trust this folder, choose Yes. This practice folder skips `/setup-matt-pocock-skills`, because `/grill-with-docs` doesn't need what it records; in a real repo, run it once first (see [Skills](/learn/skills)).

```sh
mkdir book-club-docs
cd book-club-docs
claude
```

2. Type a slash and the word grill without pressing Enter, look at the list that pops up, then delete it. If `grill-with-docs` isn't listed, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box (a mode where the agent only reads and plans), press Shift+Tab until it changes.
4. Type this. The fuzzy words ("people", "members", "thoughts") are on purpose:

```text
/grill-with-docs I want a small site for my book club. Each month we pick a book, people post their thoughts on it, and old books move to an archive. Members don't need accounts.
```

5. Answer each round by number in one reply, like "1 yes, 2 no: call them Members". When it asks what to call something, pick one word. If it asks permission to create or edit `GLOSSARY.md` or a file in `docs/adr/`, choose Yes; for any other file, No.
6. Once the agent says it added a term to `GLOSSARY.md`, peek at the file (a leading `!` runs a terminal command):

```text
!cat GLOSSARY.md
```

7. After any reply, type `/wait-what` and compare the two versions.
8. Ask: "Would any of our decisions earn an ADR? For each candidate, say which of the three tests it passes or fails."
9. Type "Let's wrap up." and correct anything wrong in the summary. If it starts writing code, press Esc to stop it. Type `/exit` when you're done.

**It's working if:**

- [ ] `GLOSSARY.md` appeared mid-session, after the first word was settled, and grew term by term.
- [ ] Each entry is a bold term, what it *is* in a sentence or two, and an `_Avoid_:` line, with no tables, pages or decisions.
- [ ] It challenged a fuzzy word, such as whether "people" and "members" are the same.
- [ ] It invented an awkward case, such as what happens to posts when a book is archived.
- [ ] You got zero or one ADR, and for each rejected candidate it said which test failed.
- [ ] `/wait-what` came back clearer, not just shorter, in your glossary's words.

No glossary? Check you didn't choose No at a permission prompt, then ask: "Did you load grilling and domain-modeling?"
````

## Common mistakes

- **An ADR for every choice.** If you could undo it tomorrow, or nobody would wonder why, it isn't one.
- **Assuming the docs hold every decision.** No `/clear` or `/compact` until `/to-spec`, and `/to-tickets` if you need it, have run.
- **Asking for it in plain words.** Type `/grill-with-docs` at the start of your message.
- **Asking for "concise" when you're lost.** Type `/wait-what`.

```site-story
I didn't use `/grill-with-docs`. I grilled the whole site with `/grilling`, then, with every decision still in the conversation, typed just this:

    /domain-modeling

**It wrote six terms**: Lesson, Slug, Skill, Phase, Comment and Visitor. It caught one fuzzy idea on its own: a Lesson isn't the same as a Skill, because "Start here" and "Models, effort & ultracode" don't teach one.

**It wrote four ADRs**, one paragraph each (the stack names don't matter here).

| ADR | Decision |
|---|---|
| 0001 | Real REST endpoints inside Next.js, not Server Actions or a separate FastAPI service |
| 0002 | One Neon database branch per environment, with migrations on every build |
| 0003 | Tests hit a real Postgres database, never mocks |
| 0004 | Comments point at Lessons by a permanent Slug, with no foreign key |

**Then it tested the design with a scenario:** what if you rename a Lesson? Comments store the Slug, so after a rename they'd silently vanish from the page. I didn't get it at first, asked for a breakdown, then mixed up the Slug with the API endpoint (the web address the site fetches comments from): just the moment `/wait-what` is for. I decided Slugs never change; numbers go in filenames, never in Slugs. A written rule was cheaper than extra machinery (a lessons table plus a foreign key), and the ADR says why, so nobody "fixes" it later.

**It paid off.** When this course grew to 20 Lessons, the Lessons were renumbered and every Slug stayed put; the note saved with that Git change cites ADR 0004. Every spec here has a "Read first" line pointing the agent at `GLOSSARY.md` and the ADRs, and a later code review caught the home page calling Skills "commands", a word the glossary avoids.

**The docs need upkeep.** A review found ADR 0004's wording no longer matched the code, so I fixed it. The glossary later gained Main flow and Built-in command, and Phase swapped my meaning ("one step of building this site") for Matt's: a chunk of work inside one session.

Today I'd type `/grill-with-docs` once, so the terms get written during the interview.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| A new repo | `/setup-matt-pocock-skills`, once |
| Start a change | `/grill-with-docs <your rough idea>` |
| No project folder | `/grill-me` instead |
| A word clashes or is fuzzy | Pick one; the rest go under `_Avoid_` |
| A glossary entry | Bold term, what it *is*, an `_Avoid_:` line, nothing else |
| An ADR? | Only if hard to reverse **and** surprising without context **and** a real trade-off |
| Every other decision | Stays in the conversation: no `/clear` or `/compact` until `/to-spec` (and `/to-tickets`) |
| A reply lost you | `/wait-what` |
| The glossary never changes | Ask which Skills loaded, or type `/domain-modeling` |

## Final test

```test scenario-new-words
You're in your team's repo for a dog-walking app, about to plan a feature. You keep saying "walk", "outing" and "slot" for what may be the same thing. Which Skill do you type to start?
- [ ] `/grill-me`, since all you need is the interview
  > Same interview, but it writes nothing. In a repo, the docs version settles each word and writes it to `GLOSSARY.md`.
- [x] `/grill-with-docs`, with your rough idea after it
  > Right. Grilling plus domain modeling: it settles each word and writes it to `GLOSSARY.md` as you go.
- [ ] `/wait-what`, each time the agent uses a word you didn't expect
  > That repairs one confusing reply. It doesn't settle words or write anything down.
- [ ] `/to-spec`, so the agreed words end up in the spec
  > `/to-spec` writes from an already-grilled conversation, and a spec isn't where the project's words live.
```

```test scenario-glossary-missing
Twenty minutes into a `/grill-with-docs` session, the questions arrive in tidy numbered rounds with ➡️ recommendations, and you've settled several names. But `GLOSSARY.md` still doesn't exist. What's the most likely explanation?
- [ ] The glossary is only created once enough terms pile up.
  > There's no threshold. The file is created with the first settled term and grows one term at a time.
- [ ] The glossary waits until you accept your first ADR.
  > Terms and ADRs are separate. The glossary is created with the first settled term, whether or not any ADR comes.
- [x] Only grilling loaded; the domain-modeling half didn't.
  > Right. Numbered rounds show grilling is running, but nothing is writing terms down. Ask which Skills loaded, or type `/domain-modeling` yourself. (If it did load but is saving terms up, as in Matt's demo, ask it to write them now.)
- [ ] You need `/setup-matt-pocock-skills` to create an empty glossary first.
  > Nothing is set up in advance. The file is created when the first term is settled.
```

```test scenario-lost-reply
Mid-grilling, the agent writes: "Given the fan-out invariant, the reconcile pass must stay idempotent across shards." You've no idea how it got there. What do you type next?
- [x] `/wait-what`, straight after that reply
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
- [ ] Ask the agent to read the code and write the whole glossary in one go.
  > That skips the interview. An agent-written glossary nobody reviewed fills with confident claims that later sessions trust.
- [ ] Run `/setup-matt-pocock-skills`, which generates the glossary from your code.
  > Setup records where the glossary will live, plus your issue tracker and labels, but it writes no glossary. That's built term by term.
- [ ] Create a `GLOSSARY-MAP.md` with one area per folder, then fill each one in.
  > Splitting comes last, and only for very large repos. Most need a single glossary.
- [x] Type `/grill-with-docs` and have it interview you about the existing code.
  > Right. It reads the code, asks what each thing really is, and writes each settled term as you go. Expect a long session.
```

```test spot-recipe-entry
Here's a new entry in a recipe site's glossary: **Recipe**: A dish's ingredients and the steps to cook it. Steps are stored in one database column, capped at 30; we dropped video in round 2. _Avoid_: Post, article. What's wrong with it?
- [ ] It needs a Considered Options section listing the names that lost.
  > That's an optional ADR section. A glossary entry just lists rejected words under `_Avoid_`.
- [x] After its first sentence, it drifts into storage and decisions.
  > Right. Keep the first sentence and the `_Avoid_` line: that's what a Recipe *is*. How it's stored, its limits and your choices go elsewhere.
- [ ] Nothing: the extra detail saves the next session from having to guess.
  > That's how a glossary swells into a spec. It holds words and what they mean, nothing else.
- [ ] The whole entry belongs in an ADR, not in the glossary.
  > The first sentence is a fine definition. Even if dropping video earned an ADR, the entry would still need trimming.
```

```test spot-adr-pile
Dana's first `/grill-with-docs` session on a habit tracker left 14 ADRs, including "Use a 12-hour clock", "Round the button corners" and "Show streaks on the home page". Spot the mistake.
- [x] Decisions like these fail the three tests, so they aren't ADRs.
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
- [ ] He should have asked the agent to write an ADR about the 30-day refund window.
  > A refund window is easy to change, so it fails the ADR tests. It belonged in the conversation, then the spec.
- [ ] He should have run `/compact` instead, which keeps every decision.
  > `/compact` swaps the conversation for a summary, which can drop details like this one. Keep the full conversation until `/to-spec` and `/to-tickets` have run.
- [x] The docs hold only terms and rare decisions; `/clear` left the rest behind.
  > Right. Most decisions live only in the conversation `/to-spec` writes from. Keep it until `/to-spec` and `/to-tickets` have run.
- [ ] The glossary should have recorded the 30-day refund window as a term.
  > A refund window is a decision, not a word for a thing. The glossary holds no decisions.
```

```test sequence-files-appear
You run `/grill-with-docs` in a brand-new repo with no docs. You settle a first term early on, more terms later, and accept one ADR near the end. Which sequence matches what appears on disk?
- [ ] `docs/adr/` and an empty `GLOSSARY.md` are created at the start → terms fill in → the ADR is added
  > Nothing is set up in advance. Files appear only when there's something to write.
- [x] First term settled → `GLOSSARY.md` created → more terms added → `docs/adr/` comes with the ADR
  > Right. The glossary is born with the first settled term and grows inline; `docs/adr/` arrives with the first ADR you accept.
- [ ] The interview ends → every term is written to `GLOSSARY.md` at once → then the ADR
  > Terms are written the moment they're settled, not saved up for the end.
- [ ] Nothing is written until `/to-spec`, which creates `GLOSSARY.md` and `docs/adr/` together
  > Domain modeling writes during the interview. `/to-spec` writes the spec, not the glossary or ADRs.
```

```test why-not-surprising
A team picks Tailwind (a styling library) for a new app. Swapping it out later would mean restyling every page, and they did weigh two other options. It came with the starter template they built the app from, and nearly every app built from that template uses it. Should the agent offer an ADR?
- [ ] Yes: being hard to reverse is enough on its own.
  > All three tests must pass, not just one.
- [ ] No: only databases and hosting earn ADRs, never a library.
  > A library can qualify when swapping it is costly, as here. A different test fails.
- [ ] Yes, and add Tailwind to `GLOSSARY.md`.
  > Tailwind is a general tool, not a word from the project's problem, so it isn't a glossary term either.
- [x] No: it fails "surprising without context".
  > Right. Hard to reverse and a real trade-off, but it's what any reader would expect, so there's nothing to explain.
```

```test why-shared-words
A teammate asks: "The agent can read our code, so why keep a glossary at all?" What's the strongest reply?
- [x] The code shows the names, not which one is right or what it means.
  > Right. The glossary fixes one word per thing, so sessions, Skills and new files can all use it, and a search finds everything.
- [ ] It stores every decision, so we never need to write a spec.
  > The glossary holds terms only. Most decisions live in the conversation until `/to-spec`.
- [ ] It lets the agent skip grilling next time, because the answers are already written down.
  > Words aren't decisions. Each new change still needs its own interview.
- [ ] It gives the agent a memory of every past conversation.
  > Only files carry anything from one session to the next, and the glossary holds words, not past conversations.
```

```sources
- [grill-with-docs SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/grill-with-docs/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [domain-modeling SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/SKILL.md), with its [GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ADR-FORMAT.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/ADR-FORMAT.md), Matt's ADR guide inside domain-modeling (the three tests, what qualifies): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [wait-what SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/wait-what/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [setup-matt-pocock-skills SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/SKILL.md) (single-context by default; the `CLAUDE.md` pointer): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (`/grill-with-docs` as the Main flow's first step; one window until `/to-tickets`): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (1.3.0, #1120: `CONTEXT.md` renamed `GLOSSARY.md`; 1.2.0, #751: wait-what and its cure): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), [The /domain-modeling Skill](https://www.aihero.dev/skills-domain-modeling) and [The /wait-what Skill](https://www.aihero.dev/skills-wait-what), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [I stopped using /grill-me for coding. Here's what I use instead](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock, 2026-05-14 (standalone-video jargon 2:20–3:28, ubiquitous-language origin 3:40–4:44, "update it as you go" 5:37–5:52, ADR tests 7:27–8:24, demo 8:35–11:30, good enough 11:54–12:22, benefits 12:25–13:21, grill-me vs grill-with-docs 13:35–14:25).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (single vs multi-context setup 5:54–6:22; ask-matt routes to `/grill-with-docs` 7:46–7:57).
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05 (the release that added `/wait-what`).
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (the `GLOSSARY.md` rename, 8:11–9:36).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [How to deal with conflicting ADRs?](https://github.com/mattpocock/skills/discussions/847), mattpocock/skills GitHub discussion, 2026-08-13, read 2026-10-23.
```
