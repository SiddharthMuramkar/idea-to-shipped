---
title: domain-modeling
slug: domain-modeling
summary: domain-modeling stops you when a word is fuzzy, and writes down the word you settle, the moment you settle it.
---

## What it's for

Say you keep saying "class" while planning the yoga-studio booking site. Sometimes you mean a kind of class, like Vinyasa. Sometimes you mean the Tuesday 6pm one. An agent might pick one and carry on.

**domain-modeling stops you when a word is fuzzy, and writes down the word you settle, the moment you settle it.**

```checkpoint quick-1
You keep saying "class" for two different things while planning. What does domain-modeling do?
- [x] It stops you, then writes down the word you settle.
- [ ] It picks the likelier meaning and carries on with that.
- [ ] It lets you finish, then writes a glossary at the end.
Why: It stops you when a word is fuzzy, and writes down the word you settle the moment you settle it. It doesn't pick a meaning for you, and it doesn't wait for the end.
```

The result is your **domain model**: the shared words for what your project is about, and its decisions. A run might look like this:

```
You:   /domain-modeling A class can't be booked once it's full.

Agent: You're saying "class": do you mean the kind of class,
       or one scheduled class?

You:   One scheduled class. Call it a Session.

Agent: Added to GLOSSARY.md:

       **Session**:
       One scheduled class that people book.
       _Avoid_: class
```

The Skill also calls out a word that clashes with your [glossary](/learn/one-shared-language), or a claim your code contradicts.

```checkpoint quick-2
You say partial refunds are allowed, but your code only refunds whole bookings. What does domain-modeling do?
- [x] It calls out the clash between your claim and your code.
- [ ] It changes the code so that it matches what you said.
- [ ] It accepts your claim, since you know the project best.
Why: It calls out a claim your code contradicts, and leaves you to settle which one is right.
```

## When to use it

- You have no plan to discuss, but the words are the problem: one word, "account", means both the Customer and the User.
- You're writing or editing `GLOSSARY.md`, or recording an ADR (architecture decision record: a short file on one decision).

```checkpoint quick-3
Which situation fits domain-modeling?
- [x] You have no plan to discuss, but "account" means two things.
- [ ] You have a full plan for a waitlist, and want it questioned.
- [ ] You have a bug that appears when two people book at once.
Why: It fits when the words are the problem, like "account" meaning both the Customer and the User, and there's no plan to discuss.
```

## When not to use it

- If you want a whole plan questioned, use [grill-with-docs](/learn/grill-with-docs) instead, because it runs grilling (an agent interviewing you about your plan) and domain-modeling together.
- If the shape of your code is the problem, use [codebase-design](/learn/codebase-design) instead, because domain-modeling covers words, not code structure.
- If you only need to look a word up, read `GLOSSARY.md` instead, because domain-modeling is for changing the model, not reading it.

```checkpoint quick-4
You want your whole plan for a waitlist questioned. Which Skill fits?
- [x] grill-with-docs, which runs the interview and domain-modeling.
- [ ] codebase-design, which gives you words for your code's shape.
- [ ] domain-modeling, which only reads the glossary for its words.
Why: A whole plan needs the grilling interview, and grill-with-docs runs it and domain-modeling together. codebase-design is for the shape of your code.
```

## What it needs to start

Nothing has to exist first. It reads `GLOSSARY.md` and `docs/adr/` if present. A repo with several glossaries has a **GLOSSARY-MAP.md**: a file pointing to the right one.

You can type `/domain-modeling`, and an agent can also decide to load it itself when a task fits. Mostly you won't start it yourself. grill-with-docs runs it alongside grilling, and other Skills ([triage](/learn/triage), [wayfinder](/learn/wayfinder), [improve-codebase-architecture](/learn/improve-codebase-architecture)) pull it in too.

```checkpoint quick-5
How does domain-modeling usually get started?
- [x] Another Skill pulls it in, such as grill-with-docs.
- [ ] You type its name yourself, at the start of every session.
- [ ] Nothing starts it until a repo has a GLOSSARY-MAP.md file.
Why: You can type its name, and an agent can load it on its own. But mostly another Skill starts it, such as grill-with-docs, triage, wayfinder or improve-codebase-architecture.
```

## What it creates

It creates two kinds of file, each only when there's something to write.

`GLOSSARY.md` gets an entry the moment a term is settled, never batched up for later. An entry is a one or two sentence definition and an **_Avoid_ line**: the other words you shouldn't use.

The file holds only terms specific to this project. General programming terms, like timeouts, stay out. So do implementation details (how the code works). The file is never a Spec.

```checkpoint quick-6
You're about to add "timeout" to the glossary, because your project uses timeouts a lot. Does it belong?
- [x] No. The file holds only terms specific to this project.
- [ ] Yes. Any term the project uses a lot belongs in the file.
- [ ] Yes, if its entry also explains how the code handles it.
Why: The file holds only terms specific to this project. A timeout is a general programming term, so it stays out however often you use it.
```

ADRs go in `docs/adr/`. Each says what was decided and why, in one paragraph. domain-modeling offers one only when all three hold: the decision is hard to reverse, surprising without context, and the result of a real trade-off.

```checkpoint quick-7
You pick a setting you could change tomorrow. Does domain-modeling offer an ADR?
- [x] No. It's easy to reverse, so one of the three doesn't hold.
- [ ] Yes. Every decision you settle gets an ADR of its own.
- [ ] Yes, as long as one paragraph is enough to explain it.
Why: All three must hold, and the first is that the decision is hard to reverse. A setting you could change tomorrow fails that, so there's no ADR.
```

```diagram
type: compare
caption: "It creates two kinds of file"
columns: ["`GLOSSARY.md`", "ADRs"]
rows:
  - cells: ["gets an entry the moment a term is settled", "only when all three hold"]
  - cells: ["holds only terms specific to this project", "says what was decided and why"]
  - cells: ["a one or two sentence definition and an _Avoid_ line", "in one paragraph"]
```

## Going deeper

### Why it exists

At the start of a project, developers and the people they build for usually speak different languages. Those people are the **domain experts**: they know what you're building, but not how.

Agents hit the same gap. They're dropped into a project and left to work out the jargon as they go. Matt describes the result: they "use 20 words where 1 will do."

```checkpoint quick-8
Why does an agent use 20 words where 1 will do?
- [x] It's left to work out the project's jargon as it goes.
- [ ] It's told to explain each of its steps in full detail.
- [ ] It forgets the whole project between one reply and the next.
Why: Agents are dropped into a project with no shared words, so they work out the jargon as they go. The long-winded wording is the result.
```

He felt this in his own grilling sessions, re-explaining the project before any real work could start. So he wrote the ubiquitous language skill to record the words, and later combined it with grill-me into grill-with-docs.

That separate Skill was then removed, and its job moved into domain-modeling. So domain-modeling keeps the shared language in a file that helps agents decode the project's jargon.

### How it works underneath

**The language.** The idea behind the glossary comes from Eric Evans's book _Domain-Driven Design_. His **ubiquitous language** is one precise language shared by developers and domain experts. It has to be precise, Martin Fowler explains, "since software doesn't cope well with ambiguity".

Evans gives each side a job. Experts object to terms that feel awkward or inadequate. Developers watch for ambiguity or inconsistency. domain-modeling gives the agent the developer's job. When you use a vague or overloaded word, one doing several jobs, it proposes a precise one. It also invents edge cases: unusual situations that test where one word ends and the next begins.

```checkpoint quick-9
Evans gives experts and developers each a job. Which does domain-modeling give the agent?
- [x] The developer's: spot a vague word and propose a precise one.
- [ ] The expert's: object to terms that feel awkward or inadequate.
- [ ] Neither: it only writes down the words you've already chosen.
Why: Developers watch for ambiguity or inconsistency. domain-modeling gives the agent that job, so it proposes a precise word when you use a vague or overloaded one.
```

**The same idea in Python.** _Architecture Patterns with Python_ writes its rules in the business jargon. Its classes and variables take their names from that jargon, and so do exceptions like `OutOfStock`. The authors say: "We could show this code to our nontechnical coworkers". For example, your booking site could raise `SessionFull`, not `CapacityError`.

```checkpoint quick-10
You're naming an exception for a full class on the booking site. Which name fits this idea?
- [x] SessionFull, in the business's own words.
- [ ] CapacityError, in general programming words.
- [ ] BookingsInsertError, after the database table.
Why: Names come from the business jargon, even for exceptions like OutOfStock. So SessionFull fits, and a nontechnical coworker could read it.
```

**Several languages in one repo.** A **bounded context** is a part of an app where everyone speaks one shared language. A big repo can have several, each with its own glossary, and a `GLOSSARY-MAP.md` at the root lists them.

Until version 1.3, the glossary was called `CONTEXT.md`, after this idea. Matt renamed it because that name "was too vague. It did not make the agent pull the file in at the right moments". The file had also shrunk until it was only a glossary. Only the name changed, not the behaviour.

**The ADR.** Michael Nygard proposed it for a different problem: a newcomer finds a past decision with no reasons attached. They have only two choices: blindly accept the decision, or blindly change it. An ADR keeps the reasons, so neither choice is blind. Matt adds another benefit: it stops the AI "suggesting the same bad idea repeatedly".

```checkpoint quick-11
A newcomer finds a past decision with no reasons attached. What choices do they have?
- [x] Only two, blindly accepting it or blindly changing it.
- [ ] Only two, asking the agent or reading the glossary.
- [ ] Many, because the code itself explains its own reasons.
Why: With no reasons to go on, they can only blindly accept the decision or blindly change it. An ADR keeps the reasons, so neither choice is blind.
```

Nygard's ADR has a Title, Context, Decision, Status and Consequences, and runs one or two pages long. Matt's ADR-FORMAT.md, this Skill's template, is much shorter: a title and 1-3 sentences. So an ADR can be a single paragraph. Status and Consequences become optional sections, and most ADRs won't need them.

```diagram
type: compare
caption: "Matt's ADR-FORMAT.md, this Skill's template, is much shorter"
columns: ["Nygard's ADR", "Matt's ADR-FORMAT.md"]
rows:
  - cells: ["a Title, Context, Decision, Status and Consequences", "a title and 1-3 sentences"]
  - cells: ["one or two pages long", "a single paragraph"]
footer: "Status and Consequences become optional sections"
```

### A real example

Matt's course-video-manager app has ghosts: lessons and courses in its database, but not yet on the file system. Making a lesson real inside a ghost course sets off a chain reaction. The glossary gave that chain a name, and one long sentence got short:

```
Before: There's a problem when a lesson inside a section
        of a course is made 'real' (i.e. given a spot in
        the file system)

After:  There's a problem with the materialization cascade
```

That glossary, still named `CONTEXT.md` there, also takes a side. Its **Materialize** entry, for making a ghost real, ends like this:

```
_Avoid_: Create on disk, Realize
```

That line gives up two other ways of saying it, so one word does the job. Matt says this shorter language keeps paying off, session after session.

```checkpoint quick-12
The Materialize entry lists Create on disk and Realize under Avoid. What are they?
- [x] Other ways of saying it, which the glossary gives up.
- [ ] Steps to skip whenever a lesson is being made real.
- [ ] Bugs that the chain reaction used to cause on disk.
Why: The Avoid line gives up two other ways of saying it, so one word does the job.
```

### Where it goes wrong

**`GLOSSARY.md` has grown to 500 lines, or even 3,000.** Left unchecked, models take any instruction to write to the file as permission to save every answer. The file then turns into a running spec, a log of every decision. That's the most-reported problem with this Skill. The fix is one direct instruction: `/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it`. Split it with a `GLOSSARY-MAP.md` only once it's lean: "Splitting a bloated file gives you several bloated files."

```checkpoint quick-13
Your GLOSSARY.md is 3,000 lines, and you're about to split it across a GLOSSARY-MAP.md. What happens?
- [x] You get several bloated files, so make it lean first.
- [ ] You get several lean files, so the problem goes away.
- [ ] You get one index file, and the old file stays as it is.
Why: Splitting a bloated file gives you several bloated files. Make it lean first, with the direct instruction, and split it only after that.
```

**`GLOSSARY.md` is unchanged after a whole grilling.** domain-modeling probably never loaded. Matt calls automatic invocation, the agent reaching for a Skill by itself, "the weakest part of the skill". When grill-with-docs or wayfinder say to load it, models often load grilling and skip this one.

```checkpoint quick-14
A whole grilling ends, and GLOSSARY.md hasn't changed. What probably happened?
- [x] The model loaded grilling and skipped domain-modeling.
- [ ] The model saved every term for the end of the Spec.
- [ ] The model found no term that passed the ADR's tests.
Why: Automatic invocation is the Skill's weakest part. Models often load grilling and skip this one, and an unchanged file is the sign.
```

Version 1.3 changed how Skills call each other, because naming one in prose doesn't reliably load it. They now use the **Skill tool**, the tool an agent calls to load a Skill. Matt's advice stays: if the file is unchanged at the end, invoke domain-modeling by name alongside the other Skill.

**The agent raises a naming clash that was settled months ago.** It cross-references code, `GLOSSARY.md` and the ADRs, and nothing else, so it can't see a closed Issue. In issue #717 on Matt's repo, a run on a Django codebase flagged two things both called "Tool". A closed Issue had settled that months earlier. Until the Skill changes, add an instruction to search Issues to your own `docs/agents/domain.md`, which the Skills already read.

```checkpoint quick-15
Why can domain-modeling raise a naming clash that a closed Issue already settled?
- [x] It checks only code, GLOSSARY.md and the ADRs, not Issues.
- [ ] It reads closed Issues too, but trusts the code over them.
- [ ] It reads only GLOSSARY.md, never the code or the ADRs.
Why: It cross-references code, GLOSSARY.md and the ADRs, and nothing else, so a decision in a closed Issue is invisible to it.
```

**Later sessions treat unchecked claims as true.** Nobody reviewed the glossary, and "an unreviewed, agent-authored glossary is worse than none". It fills with confident claims that later sessions trust. So read each entry as it lands. On a one-day build, skip the glossary.

### Try it

You'll need your practice project. If you haven't set it up, do keeping-track's Try it step first.

1. Open the `yoga-studio` repo in Claude Code.
2. Type `/domain-modeling A class can't be booked once it's full.` You should see the agent ask which "class" you mean, or quote your glossary or code.
3. Answer: `One scheduled class. Call it a Session.`
4. In a second terminal, run `cat GLOSSARY.md`. You should see a Session entry already, with an _Avoid_ line.
5. In the session, ask: `Should we record an ADR that a waitlist spot is held for 24 hours? It's one setting we can change any time.` You should see it say no, because the setting is easy to reverse.
6. In `docs/agents/domain.md`, add the settled-clash fix: `Before treating a term as unresolved, search the repo's GitHub Issues for it.` You should see the new line in `git diff`.
7. In the session, type `/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it`. You should see no implementation details left in the file.

### Read more

- [The /domain-modeling Skill](https://www.aihero.dev/skills-domain-modeling), Matt Pocock, updated 2026-08-24
- [I stopped using /grill-me for coding. Here’s what I use instead:](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock, 2026-05-14
- [Skills Changelog: Ubiquitous Language -> /grill-with-docs](https://www.aihero.dev/skills/skills-changelog-ubiquitous-language-grill-with-docs), Matt Pocock, 2026-04-30
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, updated 2026-10-05
- [mattpocock/skills README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [course-video-manager CONTEXT.md at 076a5a7](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md), Matt Pocock, 2026-04-27
- [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html), Martin Fowler, 2006-10-31
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), Michael Nygard, 2011-11-15
- [1: Domain Modeling (Architecture Patterns with Python)](https://www.cosmicpython.com/book/chapter_01_domain_model.html), Harry Percival and Bob Gregory, 2020
- [domain-modeling: cross-reference the issue tracker, not just code, when resolving a term (#717)](https://github.com/mattpocock/skills/issues/717), mecampbellsoup, 2026-08-01

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint domain-modeling-deeper-settled-clash
A domain-modeling session on your booking site flags "Teacher" versus "Instructor" as a new naming clash and asks you to settle it. But your team settled it months ago, in a closed GitHub Issue with a written decision. Why did it raise the clash again? What's the reason behind this step?
- [x] It checks the code, GLOSSARY.md and the ADRs, but never searches the issue tracker.
- [ ] It reads closed Issues, but skips any decision older than one month as probably stale.
  > It doesn't read Issues at all. It cross-references code and the committed docs, and nothing else.
- [ ] It found the closed Issue, but it re-asks any clash the issue's author didn't mark as final.
  > It never found the Issue. It cross-references code, GLOSSARY.md and the ADRs, and nothing else.
Why: It only checks code, GLOSSARY.md and the ADRs, so a decision in a closed Issue is invisible to it, and the clash looks new. Issue #717 hit this on a Django codebase. Until the Skill changes, put the instruction to search the Issue tracker in your own docs/agents/domain.md.
```

## Remember

```flashcards
Q: What does domain-modeling create?
A: GLOSSARY.md and ADRs in docs/adr/, each created only when there's something to write.

Q: What three things must be true before domain-modeling offers an ADR?
A: The decision is hard to reverse, surprising without context, and the result of a real trade-off.

Q: In a glossary entry, what goes on the _Avoid_ line?
A: The other words for the same concept, which you shouldn't use. Pick the best word and list the rest there.

Q: Which main-flow Skill runs domain-modeling alongside grilling?
A: grill-with-docs.

Q: What does Matt call the weakest part of domain-modeling, and what's the fix?
A: Automatic invocation: models often load grilling and skip it. Version 1.3 changed how Skills call each other. If GLOSSARY.md is unchanged at the end, invoke it by name.

Q: Without an ADR, what are a newcomer's two choices about a past decision, as Michael Nygard sees it?
A: Blindly accept the decision, or blindly change it. An ADR records the reasons so neither is blind.

Q: Why did version 1.3 rename CONTEXT.md to GLOSSARY.md?
A: CONTEXT.md was too vague: it didn't make the agent pull the file in at the right moments, and the file had shrunk to only a glossary. Behaviour didn't change, only the name.
```

## Final test

```final-test domain-modeling-when-adr
When does domain-modeling offer to write an ADR?
- [x] Only when it's hard to reverse, surprising, and a real trade-off.
- [ ] Whenever a decision is made, so the reasoning is kept in docs/adr/.
- [ ] At the end of the session, for the decisions made earlier in it.
- [ ] When the decision changes the project's database or its schema.
Why: All three must be true, and each has a reason. An easy-to-reverse decision can be reversed later. An unsurprising one leaves nobody wondering why. With no real alternative, there's nothing worth recording.
```

```final-test domain-modeling-glossary-holds
What belongs in GLOSSARY.md?
- [x] Terms specific to this project, with tight definitions and words to avoid.
- [ ] Implementation decisions, such as which database library the project uses.
- [ ] General programming terms the project uses a lot, like timeouts and retries.
Why: The glossary records what this project's own words mean. A term like timeout isn't unique to this project, so it stays out. An implementation decision isn't a word at all, so it stays out too.
```

```final-test domain-modeling-just-reading
An agent reads GLOSSARY.md so a Ticket's title uses the right words. Is that domain-modeling?
- [x] No. It's for changing the model, not only reading it.
- [ ] Yes. Using GLOSSARY.md like this is domain-modeling.
- [ ] Yes, as long as the agent also reads the ADRs in docs/adr/.
Why: Any Skill can read the glossary to borrow its words. domain-modeling is the active work of challenging terms and writing them down, so reading alone doesn't count.
```

```final-test domain-modeling-deeper-most-reported
What's the most-reported problem with domain-modeling?
- [x] GLOSSARY.md soaks up every answer and implementation detail, and turns into a running spec.
- [ ] It offers an ADR for almost every small decision made in the session, so docs/adr/ fills up.
- [ ] It refuses to write any term until a GLOSSARY-MAP.md lists the repo's separate contexts.
Why: Left unchecked, models take any instruction to write to GLOSSARY.md as permission to save every answer, so the file fills up with things that aren't terms. The fix is a direct instruction to make it concise and remove implementation details.
```

```final-test domain-modeling-deeper-roots
Which older idea is domain-modeling's glossary built on?
- [x] Eric Evans's ubiquitous language from Domain-Driven Design, one language shared with domain experts.
- [ ] Michael Nygard's architecture decision records, one short file for each important decision.
- [ ] The Python standard library's docstrings, which describe each class and function in plain words.
Why: Ubiquitous language is Evans's term for one precise language shared by developers and the people they build for, and the glossary writes that language down. Nygard's post is where ADRs come from, the files in docs/adr/, so it isn't the glossary's root.
```

```final-test domain-modeling-overloaded-account
In your FastAPI backend, "account" means the login in one module, the paying customer in another, and the billing ledger in a third. You're not planning a feature. You only want the word sorted out and the result written down. Which fits best?
- [x] Settle precise terms for the word and record them in the glossary.
  > Right: that's `/domain-modeling`.
- [ ] Be interviewed about a plan, with the docs kept up to date as you go.
  > That's `/grill-with-docs`. There's no plan to interview you about. The words themselves are the problem.
- [ ] Shape the modules' interfaces with the deep-module vocabulary.
  > That's `/codebase-design`. That's the shape of the code. The problem here is the domain's words.
- [ ] Survey the three modules for deepening opportunities.
  > That's `/improve-codebase-architecture`. That hunts for deepening opportunities, not overloaded words.
Why: One word is doing three jobs, and there's no plan to discuss. The words themselves are the problem, so you go straight to domain-modeling, which settles precise terms and writes them down.
```

```final-test domain-modeling-plan-a-feature
You have a rough idea for letting the AI support agent in your Python repo pass tricky chats to a human. Nothing is decided: when it passes a chat on, who picks it up, what the user sees meanwhile. The repo already has a GLOSSARY.md, and the idea fits in one session. Which fits best?
- [x] Be questioned on each decision, with the hard ones kept in the repo.
  > Right: that's `/grill-with-docs`.
- [ ] Pin down the words first, like exactly what a "handover" is.
  > That's `/domain-modeling`. The open questions are decisions about how it should work, not just words. You need the interview, and grill-with-docs runs this Skill alongside it anyway.
- [ ] Build a throwaway version of the handover to see how it feels.
  > That's `/prototype`. Nothing is decided yet, so there's no single question for throwaway code to answer.
- [ ] Write up the idea as a Spec and publish it to the Issue tracker.
  > That's `/to-spec`. That only writes up what's already settled. It doesn't interview you, and nothing is settled yet.
Why: Nothing is decided yet, so the idea needs an interview, and the repo gives it somewhere to record the words and hard decisions. grill-with-docs runs grilling and domain-modeling together, so the decisions get made and the words get written down.
```

```final-test domain-modeling-no-adr
While sharpening the booking site's model, you and the agent settle that a waitlist spot is held for 24 hours. It's one setting you can change at any time. The agent updates nothing in docs/adr/ and doesn't offer an ADR. Why not? What's the reason behind this step?
- [x] It can be changed any time, so it's easy to reverse.
- [ ] ADRs are written once the whole project is finished.
  > Decisions are captured as they land, not saved up for the end.
- [ ] The agent slipped up and should have offered one here.
  > ADRs are offered sparingly, only when a decision is hard to reverse, surprising, and a real trade-off.
Why: An ADR needs all three tests to pass, and if any one is missing, the agent skips it. A setting you could change at any time isn't hard to reverse. If it turns out wrong, you change it, so there's nothing that needs a record.
```

```final-test domain-modeling-write-it-now
Halfway through a design session on your Docker deploy tool, you and the agent settle that a "Release" is one tagged image, not a deploy. The agent adds it to GLOSSARY.md straight away instead of waiting until the session ends. Why? What's the reason behind this step?
- [x] Settled terms are captured as they happen, not batched up.
- [ ] To add implementation notes while they're fresh.
  > The glossary holds no implementation details. It's a glossary and nothing else.
- [ ] No real reason; batching terms at the end works just as well.
  > The Skill says not to batch them up but to capture them as they happen.
Why: Writing a term down the moment it's settled makes the glossary part of the session's work. A glossary written at the end is only a summary of the session.
```

```final-test domain-modeling-deeper-glossary
In your yoga-studio repo you spend an hour with grill-with-docs and settle that a "Session" is one scheduled class people book, not the kind of class. When you finish, GLOSSARY.md hasn't changed at all. What most likely happened, and what should you do next time? What's the reason behind this step?
- [x] The model loaded grilling but skipped domain-modeling. Invoke it by name alongside.
- [ ] Terms are held back until to-spec publishes the Spec, so they'll appear after that.
  > Nothing waits for a Spec. Terms are written into GLOSSARY.md the moment they're settled.
- [ ] Settling a term isn't enough. Only words that pass an ADR's three tests go in GLOSSARY.md.
  > Those tests are the ADR's bar. A glossary entry's bar is lower; a vague term became canonical.
Why: Automatic loading is the weakest part of this Skill. When another Skill says to load it, models often load grilling and skip it, and an unchanged GLOSSARY.md is the sign. Version 1.3 made grill-with-docs call the Skill tool for both, but Matt's advice stays: invoke it by name alongside.
```

```sources
- [domain-modeling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md), Matt Pocock's Skills
- [The /domain-modeling Skill](https://www.aihero.dev/skills-domain-modeling), Matt Pocock, 2026-08-24
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), Michael Nygard, 2011-11-15
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: domain.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/domain.md), Matt Pocock's Skills
- [domain-modeling: GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md), Matt Pocock's Skills
- [triage: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/SKILL.md), Matt Pocock's Skills
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [improve-codebase-architecture: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/improve-codebase-architecture/SKILL.md), Matt Pocock's Skills
- [domain-modeling: ADR-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/ADR-FORMAT.md), Matt Pocock's Skills
- [mattpocock/skills README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [I stopped using /grill-me for coding. Here’s what I use instead:](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock, 2026-05-14
- [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html), Martin Fowler, 2006-10-31
- [1: Domain Modeling (Architecture Patterns with Python)](https://www.cosmicpython.com/book/chapter_01_domain_model.html), Harry Percival and Bob Gregory, 2020
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05 (updated)
- [Skills Changelog: Ubiquitous Language -> /grill-with-docs](https://www.aihero.dev/skills/skills-changelog-ubiquitous-language-grill-with-docs), Matt Pocock, 2026-04-30
- [course-video-manager CONTEXT.md at 076a5a7](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md), Matt Pocock, 2026-04-27
- [domain-modeling: cross-reference the issue tracker, not just code, when resolving a term #717](https://github.com/mattpocock/skills/issues/717), mecampbellsoup, 2026-08-01
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), Matt Pocock
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
```
