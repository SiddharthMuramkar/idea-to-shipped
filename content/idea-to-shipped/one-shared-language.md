---
title: One shared language
slug: one-shared-language
summary: One shared language means you and your agents use the same words for the same things, and each word has one meaning.
---

## What a shared language is

Say an agent picks up Ticket #13 on your yoga-studio site: the endpoint that creates a booking. In its code it writes _reservation_, in its test _appointment_, and in its next Issue _slot_. You can't tell whether it means one thing or three.

**One shared language means you and your agents use the same words for the same things, and each word has one meaning.**

```checkpoint quick-1
On your site, _class_ means one lesson to some people and a weekly course to others. Does that fit a shared language?
- [x] No: each word has one meaning, so one of them needs a new word.
- [ ] Yes: one word for both things keeps the glossary nice and short.
- [ ] Yes: an agent can work out from the sentence which one you mean.
Why: A shared language gives each word one meaning. If _class_ means two things, nobody can be sure which one a sentence is about.
```

In most repos, those words live in the glossary from [keeping track](/learn/issues-and-keeping-track): one file, `GLOSSARY.md`, at the top level of the repo.

## What an entry looks like

Say you settle on _booking_. Its entry looks like this:

```
**Booking**:
One member's place in one class.
_Avoid_: reservation, appointment, slot
```

An entry names the thing, says what it is, and takes a side: the best word stays, and the others go under `_Avoid_`.

```checkpoint quick-2
_Booking_ and _reservation_ could both name the same thing. What does the entry do about that?
- [x] Keeps the best word, and lists the other under `_Avoid_`.
- [ ] Keeps both words, and says either one is fine for you to use.
- [ ] Leaves both words out until the code has settled on one.
Why: An entry takes a side. The best word stays, and the others go under `_Avoid_`, so nobody has to wonder which one to use.
```

**The glossary holds words and what they mean, and nothing else.** It isn't a Spec, a place for rough notes, or a place to record how the code is built.

```checkpoint quick-3
You want to note that bookings live in a Postgres table. Does that go in the glossary?
- [x] No: it holds words and what they mean, and nothing else.
- [ ] Yes: how the code is built belongs right beside the words.
- [ ] Yes: anything about bookings can go in the Booking entry.
Why: Where bookings are stored is about how the code is built. The glossary only says what the project's words mean.
```

## How agents use it

Matt's Skills that work on your code get the same instruction. When an agent names a concept, in an Issue title or a test name, it uses the glossary's word. It doesn't drift to a synonym the glossary avoids.

On Ticket #13, the agent now names the endpoint `create_booking` and its test `test_create_booking`. Its next Issue says _booking_. Compare the work without a glossary and with a glossary:

```diagram
type: compare
caption: "Compare the work without a glossary and with a glossary"
columns: ["without a glossary", "with a glossary"]
rows:
  - label: "its code"
    cells: ["reservation", "`create_booking`"]
  - label: "its test"
    cells: ["appointment", "`test_create_booking`"]
  - label: "its next Issue"
    cells: ["slot", "booking"]
```

A missing word is a signal. Either the agent is inventing language the project doesn't use, or the glossary has a real gap.

```checkpoint quick-4
An agent needs a word for a waiting list, and the glossary has none. What does that tell you?
- [x] The word may be invented, or the glossary has a real gap.
- [ ] The agent skipped the glossary, or the file failed to load.
- [ ] The agent may use any word it likes, since none is listed.
Why: A missing word is a signal. Either the agent is inventing language the project doesn't use, or the glossary really does lack the word.
```

## Where it shows up

A shared language is your first **Principle**: one of the ideas behind how the [Flows](/learn/issues-and-keeping-track) are designed. It comes first because [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills), which writes that instruction into `docs/agents/`, runs before your first Flow.

Two Skills show it at work:

- [grill-with-docs](/learn/grill-with-docs) is the Skill that interviews you and writes the glossary as it goes. That interview is **grilling**: an agent interviewing you until you share one understanding. Use a word that clashes with the glossary, and the Skill calls it out at once and asks which you mean.
- [wait-what](/learn/wait-what) is the Skill that re-explains the agent's last message in plain words, using the glossary's terms.

```checkpoint quick-5
[grill-with-docs](/learn/grill-with-docs) is interviewing you, and you use a word that clashes with the glossary. What happens?
- [x] It calls that out at once and asks which you mean.
- [ ] It swaps in the glossary's word without telling you.
- [ ] It lists every clash for you when the session ends.
Why: The Skill stops you at once and asks which you mean, so the word gets settled while you're still talking.
```

wait-what works after the fact. Matt calls grill-with-docs the upfront cure: "a shared language agreed early is what stops the jargon arriving at all."

```checkpoint quick-6
You want to stop jargon arriving in the first place. Which fits?
- [x] grill-with-docs, because it agrees a shared language early.
- [ ] wait-what, because it works on each message after the fact.
- [ ] Neither, because jargon can only be cleaned up afterwards.
Why: wait-what works after the fact. grill-with-docs is the upfront cure, because a shared language agreed early stops the jargon arriving at all.
```

This site's own glossary is why the **Course**, everything it teaches in a fixed order, says Ticket where others say _task_. It says Spec where others say _PRD_ (product requirements document).

## Going deeper

### Why it exists

Developers and the people they build for often start out speaking different languages. Matt felt the same gap with his agents. He puts the problem this way: "Agents are usually dropped into a project and asked to figure out the jargon as they go. So they use 20 words where 1 will do."

```checkpoint quick-7
An agent is dropped into a project with no shared language. What does Matt expect to happen?
- [x] It works out the jargon as it goes, using 20 words where 1 will do.
- [ ] It stops and asks you to define each word before it writes any code.
- [ ] It copies the words from the code, and gets every one of them right.
Why: With no shared language, an agent has to figure out the project's jargon as it goes. So it describes things at length instead of naming them.
```

So his fix is a shared language: a document that helps agents decode the project's jargon. He lists three other gains:

- Variables, functions and files get named the same way.
- The codebase is easier for the agent to find its way around.
- The agent spends fewer **tokens** on thinking. A token is a small piece of text, roughly part of a word.

He thinks this might be the coolest technique in his repo, yet he gives no numbers for any of these gains. His advice is to try it and see.

You may meet older names. In Matt's Skills, the idea began as a Skill of its own, `/ubiquitous-language`. Matt removed that Skill, and its job moved into [domain-modeling](/learn/domain-modeling), the Skill that settles the project's words and records its hard decisions. The glossary file was called `CONTEXT.md` until version 1.3.0.

### How it works underneath

The idea comes from Eric Evans's book _Domain-Driven Design_. He called it the **ubiquitous language**: a common, rigorous (exact, with no loose ends) language that developers and users build up together.

It must be rigorous because it's based on the **domain model** the software uses: its map of the problem your project solves. As the software writer Martin Fowler sums it up, "software doesn't cope well with ambiguity". So a vague word in the language becomes a vague name in the code.

Evans adds three points. You test the language by using it when you talk with **domain experts**, the people you're building the software for. On your booking site, for example, that's the studio owner. And the language should evolve as the team learns more.

```checkpoint quick-8
You've written a glossary for the booking site. How do you test it, in Evans's view?
- [x] Use its words when you talk with the studio owner.
- [ ] Ask a second developer to read the file on their own.
- [ ] Have an agent read it, and count the words it saves.
Why: Evans tests the language by using it with domain experts, the people you're building the software for. On the booking site, that's the studio owner.
```

Third, each side has a job: domain experts object to awkward terms, and developers watch for ambiguity.

[grill-with-docs](/learn/grill-with-docs) puts this to work. It tells the agent to run domain-modeling during the interview, which challenges your words and updates `GLOSSARY.md` the moment a term is settled. Agents can still skip that Skill, so if `GLOSSARY.md` hasn't changed by the end, ask for domain-modeling by name.

One language doesn't have to cover the whole system. Say your system has ordering and billing. Each part can have its own glossary, and a `GLOSSARY-MAP.md` at the repo root lists them, where they live, and how they relate. Most repos need one `GLOSSARY.md`.

```checkpoint quick-9
You've decided ordering and billing each need their own language. How do you lay that out?
- [x] One glossary per part, listed in a `GLOSSARY-MAP.md` at the root.
- [ ] One `GLOSSARY.md` at the root, forcing both into a single language.
- [ ] No glossary at all, with each part's words kept in its own Skill.
Why: One language doesn't have to cover the whole system. Each part can have its own glossary, and a `GLOSSARY-MAP.md` lists them. Most repos need one `GLOSSARY.md`.
```

A Python book shows the same habit in code. In _Architecture Patterns with Python_, Harry Percival and Bob Gregory take their class and variable names from the business jargon. Even their exceptions get business names:

```python
class OutOfStock(Exception):
    pass
```

Say a class fills up on your booking site. By the same habit, you'd raise `ClassFull`, not `CapacityError`.

### A real example

Matt's `course-video-manager` repo is a tool for authoring courses. A lesson in it can be a _ghost_: it exists in the database but not yet on the file system. Matt asks which of these two sentences about giving one its spot on disk is easier to read:

- **Before:** There's a problem when a lesson inside a section of a course is made 'real' (i.e. given a spot in the file system)
- **After:** There's a problem with the materialization cascade

The short version works because his glossary defines the term once. Give a lesson in a ghost course its spot on disk, and the course and section get theirs too. The entry calls that "The chain reaction when materializing a lesson inside a ghost course".

```checkpoint quick-10
A new agent reads: There's a problem with the materialization cascade. Why can it follow that?
- [x] The glossary defines the term once, so the short name is enough.
- [ ] The term is ordinary English, so any reader would already know it.
- [ ] The agent worked on that very same problem in an earlier session.
Why: The short name only works because the glossary defines it once. Any session can read that entry and know what the name means.
```

So one sentence drops from 23 words to 7, and Matt says that concision "pays off session after session". Other entries name the words to give up: Section, for example, avoids Module, Chapter and Unit.

### Where it goes wrong

**Your glossary reads like a Spec.** Agents can take an instruction to write to the glossary as permission to save every answer you give. One user saw decisions written in as term definitions. Another's file passed 500 lines after several sessions. Matt calls this the most-reported problem with domain-modeling. To fix it, ask for a cleanup:

```
/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it
```

Don't split the file first: "Splitting a bloated file gives you several bloated files." domain-modeling's rules don't yet prevent this growth, so check the file now and then.

```checkpoint quick-11
Your glossary has passed 500 lines, and you're about to split it in two. What happens?
- [x] You end up with two bloated files instead of one.
- [ ] You end up with two short files, each half the size.
- [ ] You end up with one clean file, once the agent merges them.
Why: Splitting a bloated file gives you several bloated files. The cleanup comes first, so the file holds only words and what they mean.
```

**The output sounds right but is wrong.** The agent has the right words but not the right ideas behind them. Matt warns: "The right nouns on top of the wrong concepts produce output that reads as correct and is not." Get the ideas straight first: a word you don't understand yourself means nothing once it's written down.

**Later sessions repeat a wrong claim.** A glossary an agent wrote and nobody reviewed fills with confident claims, and later sessions treat them as true. That's worse than no glossary at all. So read each new entry, as you'd read code in a pull request.

```checkpoint quick-12
An agent wrote your glossary and nobody read it. You're about to start a new session. What's the risk?
- [x] The session treats the file's confident claims as true.
- [ ] The session skips the file, since nobody has approved it.
- [ ] The session rewrites the file from scratch before it starts.
Why: An unreviewed glossary fills with confident claims, and later sessions treat them as true. That's why you read each new entry.
```

**The glossary feels like extra work on a small job.** Some people argue that an agent responds the same to a plain-English description as to a glossary term. On that view, the glossary keeps you and your reviewers aligned with the agent, rather than making the agent better. On a one-day build, skip it.

```checkpoint quick-13
You're building a small tool that you'll finish today. Should you write a glossary?
- [x] No: on a one-day build, skip it and use plain words.
- [ ] Yes: every repo needs a glossary before an agent runs.
- [ ] Yes: agents can't follow plain English without one.
Why: An agent may respond the same to plain English, and a glossary may mostly keep you and your reviewers aligned with the agent. On a one-day build, that doesn't earn its keep, so skip it.
```

### Try it

Write a small glossary by hand, then watch an agent use it. You'll need your practice project. If you haven't set it up, do keeping-track's Try it step first.

1. Open `docs/agents/domain.md` in your practice project. You should see the heading "Use the glossary's vocabulary".
2. At the repo root, create a file called `GLOSSARY.md`.
3. Add this entry on three lines: `**Booking**:`, then `One member's place in one class.`, then `_Avoid_: reservation, appointment, slot`.
4. Add an entry for the person who teaches a class, in the same shape. Say what the person is, in one or two sentences.
5. Start Claude Code at the repo root.
6. Send this message: `Read GLOSSARY.md, then name the endpoint that lets a member reserve a place in a class.` You should see a name built on _booking_, such as `create_booking`.
7. In your shell, run `git grep -n reservation`. You should see no lines, or lines showing where your code uses that word.
8. Commit `GLOSSARY.md` on a branch, and merge it through a pull request.

Each line from step 7 is a place where your code and the glossary disagree. Keep the file to words only, with no decisions or code details in it.

### Read more

- [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html), Martin Fowler, 2006-10-31
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [course-video-manager CONTEXT.md](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md), Matt Pocock, 2026-04-27
- [Skills Changelog: Ubiquitous Language -> /grill-with-docs](https://www.aihero.dev/skills/skills-changelog-ubiquitous-language-grill-with-docs), Matt Pocock, 2026-04-30
- [The /domain-modeling Skill](https://www.aihero.dev/skills-domain-modeling), Matt Pocock, 2026-08-24
- [grill-with-docs: GLOSSARY.md (formerly CONTEXT.md) gets used as a plan and churns mid-round, issue #130](https://github.com/mattpocock/skills/issues/130), AKuederle and others, 2026-05-04
- [1: Domain Modeling (Architecture Patterns with Python)](https://www.cosmicpython.com/book/chapter_01_domain_model.html), Harry Percival and Bob Gregory, 2020

## Remember

```flashcards
Q: In most repos, where is the shared language written down?
A: In `GLOSSARY.md`, at the root of the repo.

Q: What stops jargon arriving in the first place?
A: A shared language agreed early, which grill-with-docs builds as it interviews you.

Q: While grill-with-docs interviews you, you use a word that clashes with the glossary. What happens?
A: It calls the clash out at once and asks which meaning you have in mind.

Q: In Matt's course-video-manager repo, what short term replaces "a lesson inside a section of a course is made 'real'"?
A: The materialization cascade, a term defined in the glossary of his course-video-manager repo.

Q: Does one shared language have to cover a whole system?
A: No. Each part, such as ordering and billing, can have its own glossary, listed in a `GLOSSARY-MAP.md` at the repo root.

Q: Whose idea is a project's shared language, and what did he call it?
A: Eric Evans's. He called it the ubiquitous language, in his book Domain-Driven Design.
```

## Final test

```final-test one-shared-language-name-a-concept
An agent is naming a test for a concept your glossary already defines. What should it call the concept?
- [x] The term exactly as the glossary defines it.
- [ ] Whichever synonym reads best in the test name.
- [ ] The name the code already uses, whatever the glossary says.
Why: A test name is one of the places the rule lists. Use the glossary's term and don't drift to a synonym, so one concept keeps one name.
```

```final-test one-shared-language-missing-word
The concept an agent needs isn't in the glossary. What does that tell you?
- [x] Either the agent is inventing a word, or the glossary has a real gap.
- [ ] It's a normal gap, so the agent can use whichever word fits the sentence best.
- [ ] The glossary must be out of date, so the agent can stop checking it.
Why: A missing word is a signal, so the agent shouldn't carry on with any word that fits. Either it's inventing a word the project doesn't use, so it should think again, or the project really lacks the word, so it should note the gap.
```

```final-test one-shared-language-what-belongs
What belongs in `GLOSSARY.md`?
- [x] The project's terms and what they mean, nothing else.
- [ ] The terms, plus how each one is built in the code.
- [ ] The Spec for the next feature, in the project's words.
- [ ] Rough notes from each session, so new terms aren't lost.
Why: The glossary does one job, saying what the project's words mean. So it isn't a Spec, a scratch pad or a home for decisions about how the code is built. Let those in, and the file turns into a running Spec.
```

```final-test one-shared-language-deeper-why-rigorous
Why, in Evans's idea as Fowler sums it up, must a project's shared language be rigorous?
- [x] It's based on the model in the software, and software doesn't cope well with ambiguity.
- [ ] Domain experts won't talk to developers until every term has a formal written definition.
- [ ] A rigorous language lets the team stop checking its words with the people who know the business.
Why: The language is based on the domain model the software uses, and software doesn't cope well with ambiguity. So a vague word becomes a vague name in the code. The checking doesn't stop either, because Evans tests the language by using it with domain experts.
```

```final-test one-shared-language-deeper-glossary
After several grilling sessions, your glossary has grown past 500 lines and reads like a Spec. What does Matt suggest?
- [x] Ask grill-with-docs to make it more concise and remove any implementation details.
- [ ] Split it into one glossary per part of the system straight away, so each file stays short.
- [ ] Leave it as it is, since a longer glossary gives the agent more context to work with.
Why: The size is a symptom. The file has taken in details that never belonged in a glossary, so the fix is to ask grill-with-docs to make it more concise and take those details out. Splitting first doesn't help, because splitting a bloated file gives you several bloated files.
```

```sources
- [setup-matt-pocock-skills: domain.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/domain.md), Matt Pocock's Skills
- [domain-modeling: GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md), Matt Pocock's Skills
- [domain-modeling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [Spec | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/spec), Matt Pocock
- [mattpocock/skills README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [mattpocock/skills commit a496f55](https://github.com/mattpocock/skills/commit/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa), Matt Pocock, 2026-10-29
- [Skills Changelog: Ubiquitous Language -> /grill-with-docs](https://www.aihero.dev/skills/skills-changelog-ubiquitous-language-grill-with-docs), Matt Pocock, 2026-04-30
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [The /domain-modeling Skill](https://www.aihero.dev/skills-domain-modeling), Matt Pocock, 2026-08-24
- [I stopped using /grill-me for coding. Here’s what I use instead:](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock, 2026-05-14
- [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html), Martin Fowler, 2006-10-31
- [1: Domain Modeling (Architecture Patterns with Python)](https://www.cosmicpython.com/book/chapter_01_domain_model.html), Harry Percival and Bob Gregory, 2020
- [course-video-manager CONTEXT.md at 076a5a7](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md), Matt Pocock, 2026-04-27
- [mattpocock/course-video-manager commit 076a5a7](https://github.com/mattpocock/course-video-manager/commit/076a5a7a182db0fe1e62971dd7a68bcadf010f1c), Matt Pocock, 2026-04-27
- [grill-with-docs: GLOSSARY.md (formerly CONTEXT.md) gets used as a plan and churns mid-round · Issue #130 · mattpocock/skills](https://github.com/mattpocock/skills/issues/130), AKuederle, 2026-05-04
```
