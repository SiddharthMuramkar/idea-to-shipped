---
title: codebase-design: words for designing deep modules
slug: codebase-design
summary: codebase-design gives you and your agents shared words for the shape of code, aimed at deep modules: a lot of behaviour behind a small interface.
---

## What it's for

An agent is reshaping your booking code. You say _service_, it says _boundary_, and you can't tell if you mean the same thing.

**codebase-design gives you and your agents shared words for the shape of code, aimed at deep modules.** It bans loose substitutes (component, service, API, boundary): consistent language is the whole point. It's a reference to consult, not a session to run.

```checkpoint quick-1
You're about to call the booking code a service in a design chat. What does codebase-design want?
- [x] One of its own words, since service is a banned substitute.
- [ ] Service is fine, since every backend developer knows that word.
- [ ] Either word works, as long as the code keeps the same shape.
Why: It bans loose substitutes such as service, because consistent language is the whole point. Otherwise you can't tell whether two people mean the same thing.
```

For example, say Ticket #13, the endpoint that creates a booking, must check capacity, save the booking and email the member:

```python
# Shallow: the caller must know every step
check_capacity(class_id)
booking = insert_booking(class_id, member_id)
send_confirmation(booking, mailer)  # mailer: sends email

# Deep: those steps sit behind one call
booking = create_booking(class_id, member_id, mailer)
```

In these words:

- **Module**: anything with an interface and an implementation, from one function to a package. Here, `create_booking`.
- **Interface**: everything a caller must know to use it correctly: the signature, plus rules, error cases and required setup.
- **Depth**: how much behaviour a caller gets for each bit of interface learned. Deep means a lot behind a small interface; shallow means an interface nearly as complex as the code.
- **Seam**: a place where you can change behaviour without editing in that place. It's where a module's interface lives, the same seam [tests watch](/learn/test-first). `mailer` is one: swap it without editing `create_booking`.
- **Adapter**: a concrete thing that fills a seam: here, a fake mailer in tests and a real one in production.

```checkpoint quick-2
`create_booking` raises an error when the class is full. Is that error part of its interface?
- [x] Yes, because a caller must know its error cases to use it.
- [ ] No, because an interface is only the function's name and arguments.
- [ ] No, because errors are part of the code inside, not the interface.
Why: An interface is everything a caller must know to use the module correctly. That's the signature, plus rules, error cases and required setup.
```

```diagram
type: compare
caption: "how much behaviour a caller gets for each bit of interface learned"
columns: ["Deep", "Shallow"]
rows:
  - cells: ["a lot behind a small interface", "an interface nearly as complex as the code"]
  - cells: ["those steps sit behind one call", "the caller must know every step"]
```

**Leverage** is what depth buys callers: more behaviour for less to learn. **Locality** is what it buys maintainers: fix a bug once, fixed everywhere.

```checkpoint quick-3
You fix one bug in `create_booking`, and every caller gets the fix. Which word names that?
- [x] Locality, what depth buys maintainers.
- [ ] Leverage, what depth buys callers.
- [ ] Neither, since a fix has nothing to do with depth.
Why: Locality is what depth buys maintainers: fix a bug once, fixed everywhere. Leverage is the other payoff: callers get more behaviour for less to learn.
```

## When to use it

- You've chosen a module to reshape, and need to settle its interface or seam.
- You want alternatives first. **Design it twice** has several subagents (helper agents the main agent starts) each design a radically different interface, and the agent compares them.

```checkpoint quick-4
You've picked the booking module, and you want very different interfaces to choose from. What does design it twice do?
- [x] Several subagents each design one, and the agent compares them.
- [ ] One subagent designs one, then improves it over several rounds.
- [ ] Several subagents build the same one, and the fastest is kept.
Why: Each subagent designs a radically different interface. Then the agent compares them, so you choose between real alternatives.
```

## When not to use it

- If you don't yet know which module to reshape, use [improve-codebase-architecture](/learn/improve-codebase-architecture) instead, because it's the survey that finds candidates.
- If the problem is your project's own words, use [domain-modeling](/learn/domain-modeling) instead, because this Skill covers only the shape of code.

```checkpoint quick-5
You know the backend is hard to change, but not which module to fix first. Which fits?
- [x] improve-codebase-architecture, the survey that finds candidates.
- [ ] codebase-design, because it names the shape of one chosen module.
- [ ] domain-modeling, because it settles the project's own words first.
Why: You don't yet know which module to reshape, so you need the survey that finds candidates. codebase-design helps once you've chosen one.
```

## What it needs to start

A module to talk about. Type `/codebase-design`, or an agent loads it when a design task fits. [tdd](/learn/tdd) calls it when an interface's shape is in question.

```checkpoint quick-6
You want an agent to use codebase-design's words. Do you have to start it yourself?
- [x] No. You can type it, or an agent loads it when a design task fits.
- [ ] Yes. Only you can start it, because agents never load a Skill on their own.
- [ ] No. It loads by itself on every commit, so there's never anything to type.
Why: You can type `/codebase-design`, or an agent loads it on its own when a design task fits. tdd also calls it when an interface's shape is in question.
```

## What it creates

Nothing on disk. You keep the words and three checks:

- **The deletion test**: imagine deleting a module. If complexity vanishes, it was a pass-through, only handing calls on. If complexity reappears across many callers, it was earning its keep.
- **The test surface** is the interface: callers and tests cross the same seam.
- **A real seam** has two adapters, such as production and test. One adapter means a hypothetical seam, since nothing varies across it.

```checkpoint quick-7
You're about to add a seam for `mailer`, but production is its only adapter, and tests use none. What does that make it?
- [x] A hypothetical seam, since it has only one adapter.
- [ ] A real seam, since one adapter is enough to fill it.
- [ ] A deep module, since it sits behind a small interface.
Why: A real seam has two adapters, such as production and test. With only one, nothing varies across it, so the seam is hypothetical.
```

## Going deeper

### Why it exists

Matt Pocock, who wrote the Skill, starts from the fact that an agent begins each session knowing nothing about your code: "AI is not a super-powered developer. It's a new starter with no memory."

You hold a map of your codebase in your head, with modules in loose groups.

The agent doesn't have that map. It sees modules that can all import from each other, with no groups and no relationships.

Matt ranks your codebase above your prompt or `AGENTS.md` as the biggest influence on an agent's output.

So his fix is deep modules, an idea from the book _A Philosophy of Software Design_. You own each module's interface, the agent owns the implementation behind it, and tests keep it honest.

```checkpoint quick-8
You're building a deep module with an agent. Which part does Matt say you own?
- [x] The interface. The agent owns the implementation behind it.
- [ ] The implementation. The agent owns the interface in front of it.
- [ ] The tests alone. The agent owns both the interface and the code.
Why: You own each module's interface, the agent owns the implementation behind it, and tests keep it honest.
```

codebase-design holds the words for that work, and the survey uses them too. It replaced an older Skill, `design-an-interface`.

### How it works underneath

**Depth comes from John Ousterhout**, that book's author. A good method saves you keeping its code in your head. It replaces "a large cognitive load (reading the detailed implementation) with a much smaller cognitive load (learning the interface)". He calls those methods deep.

```checkpoint quick-9
You call a deep method. By Ousterhout's account, what does it spare you?
- [x] Reading its detailed implementation, because you learn the interface.
- [ ] Learning its interface, because you read the detailed implementation.
- [ ] Both of those, since a deep method needs no explanation at all.
Why: A deep method swaps a large cognitive load, reading the implementation, for a much smaller one, learning the interface.
```

Split code too far and the opposite happens. Less sits behind each interface, and it often grows more complex. He calls those interfaces shallow.

The Skill doesn't count lines. It rejects implementation lines against interface lines as a measure, because that "rewards padding the implementation". It credits that ratio to Ousterhout, but his words above are about what you must learn.

**Seam comes from Michael Feathers**, who coined the term in his book on legacy code. His definition: "a seam is a place where you can alter behavior in your program without editing in that place". [tdd](/learn/tdd) uses the word for where you test; this Skill owns the module's shape behind it.

**Dependencies decide how you test.** Before you deepen a module, you sort what it depends on into four kinds. DEEPENING.md, one of the Skill's files, says how to test each:

- **In-process**: computation and in-memory state, with no I/O (disk or network). Merge the modules, and test through the new interface directly.
- **Local-substitutable**: something with a local test stand-in, such as PGLite for Postgres. Tests run the stand-in, and the seam stays internal.
- **Remote but owned**: your own services across a network. Define a **port**, an interface at the seam. Tests use an in-memory adapter, and production an HTTP adapter.
- **True external**: third-party services you don't control, such as Stripe. It's passed in as a port, like `mailer`, and tests use a mock adapter.

```checkpoint quick-10
Your module calls Stripe, and you're about to write its tests. What do they use?
- [x] A mock adapter, with Stripe passed in as a port.
- [ ] A local stand-in of Stripe, with the seam kept internal.
- [ ] An in-memory adapter, because you own Stripe's service.
Why: Stripe is a third-party service you don't control, so it's the true external kind. It's passed in as a port, and tests use a mock adapter.
```

```diagram
type: compare
caption: "Dependencies decide how you test."
columns: ["what it depends on", "how you test"]
rows:
  - label: "In-process"
    cells: ["computation and in-memory state", "test through the new interface directly"]
  - label: "Local-substitutable"
    cells: ["something with a local test stand-in", "Tests run the stand-in"]
  - label: "Remote but owned"
    cells: ["your own services across a network", "Tests use an in-memory adapter"]
  - label: "True external"
    cells: ["third-party services you don't control", "tests use a mock adapter"]
```

Once tests at the new interface exist, the old shallow-module tests become waste. The rule is replace, don't layer: delete them.

```checkpoint quick-11
Tests now exist at the deep module's interface. What happens to the old tests on the shallow modules?
- [x] You delete them, because they've become waste.
- [ ] You keep them, as an extra layer of safety.
- [ ] You move them behind the new interface, unchanged.
Why: Once tests at the new interface exist, the old ones become waste. The rule is replace, don't layer.
```

**Design it twice is Ousterhout's too.** The Skill credits him: "your first idea is unlikely to be the best." Each subagent gets a different constraint: one minimises the interface, one maximises flexibility, and one makes the most common caller's case trivial. The agent then compares the designs and recommends one.

### A real example

One line of the design-it-twice file shows what a subagent needs. It used to say: "Spawn 3+ sub-agents in parallel using the Agent tool."

In July 2026, a reader filed an issue: other harnesses may not have a tool called Agent. In August, Matt dropped the tool's name and left the mechanism to the harness.

In October, Matt fixed a second problem. Some Codex models fork the parent conversation when they spawn a subagent, so the subagent inherits the parent's context window. That throws away the point of a subagent: a clean context that sees only its brief. So the line now says "each with a fresh context window".

```checkpoint quick-12
Your harness forks the conversation when it spawns a subagent. What does the subagent lose?
- [x] A clean context that sees only its brief.
- [ ] Access to the parent's context window.
- [ ] Nothing, since a fork starts with an empty context.
Why: A fork inherits the parent's context window. That throws away the point of a subagent: a clean context that sees only its brief.
```

So a subagent is there for its clean start. Where Matt's page on this Skill disagrees with the Skill's own file, trust the file: it's what the agent reads. That page still quotes the old line.

### Where it goes wrong

**The agent went off designing without asking you anything.** In one real case, a [handoff](/learn/handoff) note said "resume in `/codebase-design` to drive the open decisions". The fresh session re-explored mapped code, running to about 105k tokens before asking anything.

The Skill has no overall process or stopping rule, so the agent invents one, reaching for design it twice. The fix is to name a driver Skill, one with a process and checkpoints, such as [grill-with-docs](/learn/grill-with-docs) or [tdd](/learn/tdd), and let it use these words. A triage note marked as AI-generated closed that issue without changing the Skill, so the fix stays yours.

```checkpoint quick-13
You're writing a handoff note for a design session. What should its resume instruction name?
- [x] A driver Skill such as grill-with-docs, using these words.
- [ ] codebase-design alone, so the session stays on its words only.
- [ ] No Skill at all, so the agent is free to invent its own process.
Why: The Skill has no overall process or stopping rule, so pointed at alone, the agent invents a process. A driver Skill has a process and checkpoints, and can use these words.
```

**Other code imports past the interface.** Say another module imports `check_capacity` directly. The Skill doesn't stop that: it says nothing about enforcing an interface. Asked about TypeScript, Matt gave three options, each with a catch:

- Wrap it in a class or IIFE (a JavaScript function that runs as soon as it's defined), but that gets enormous.
- Make it a package in a monorepo (one repo holding several separate projects), but the tooling is rarely worth it.
- Use a linter like dependency-cruiser (a tool that checks which files import which). He hadn't tried it, but thought it might be the closest fit.

```checkpoint quick-14
You want something to catch stray imports, without wrapping or moving your code. Which of Matt's options fits?
- [x] A linter like dependency-cruiser, though he hadn't tried it.
- [ ] A class or IIFE, which he said stays small and tidy over time.
- [ ] A package in a monorepo, whose tooling he said always pays off.
Why: dependency-cruiser checks which files import which. The other two change your code's shape, and each has a catch: a class or IIFE gets enormous, and a monorepo's tooling is rarely worth it.
```

You'll meet that linter again in [setup-ts-deep-modules](/learn/setup-ts-deep-modules), Matt's in-progress Skill that wires it into a TypeScript repo.

**You moved files into folders, and the modules stayed shallow.** Depth is a property of the interface, not of where files sit. As Matt told one reader: "I think you might be tying the concept of modules too closely to the file system." So judge a module by its interface, not the folder tree.

```checkpoint quick-15
You've moved each module into its own folder. Does that make them deep?
- [x] No, because depth is a property of the interface.
- [ ] Yes, because a folder shrinks each interface.
- [ ] Yes, because the file system now hides each implementation.
Why: Depth is a property of the interface, not of where files sit. So judge a module by its interface, not the folder tree.
```

### Try it

Describe one module in these words, and change no code. You'll need the practice project's booking endpoint. The Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) sets up the project, and the one in [implement](/learn/implement) builds the endpoint.

1. In the practice project, start a session: `claude`.
2. Type `/codebase-design`. You should see it give you the words and stop, without reading your code.
3. Type `/grill-with-docs Use those words to describe the booking module. Change no code.` You should see numbered questions, each with a recommended answer.
4. Answer the round. Type "yes" to accept a recommendation, or say what you'd change.
5. Ask: "What's the module's interface, and where's its seam?" You should see both named, with no component or service.
6. Ask: "Which of DEEPENING.md's four kinds is Postgres?" You should see local-substitutable, if it can name a local stand-in.
7. Ask: "Run the deletion test on one helper the module calls." You should see whether complexity vanishes or reappears in its callers.
8. Run `gh issue comment 3 --web`, #3 being the endpoint's Ticket, and paste the answers.

If step 2 starts reading files or proposing refactors, the agent has mistaken the reference for a driver. Stop it, and carry on from step 3.

### Read more

- [The /codebase-design Skill](https://www.aihero.dev/skills-codebase-design), Matt Pocock, updated 2026-08-24
- [How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love), Matt Pocock, updated 2026-02-26
- [A Philosophy of Software Design vs Clean Code](https://github.com/johnousterhout/aposd-vs-clean-code), John Ousterhout and Robert C. Martin, 2024 to 2025
- [bliki: Legacy Seam](https://martinfowler.com/bliki/LegacySeam.html), Martin Fowler, 2024-01-04
- [Issue #449: /codebase-design gets run as a session driver, not consumed as a reference](https://github.com/mattpocock/skills/issues/449), mlibby-gh, 2026-07-04
- [Pull request #1341: Start subagents with a fresh context window, not a fork](https://github.com/mattpocock/skills/pull/1341), Matt Pocock, 2026-10-29

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint codebase-design-deeper-fresh-context
Your agent's harness forks the parent conversation each time it spawns a subagent. You're about to have three subagents each design a radically different interface for the booking module. Why does the Skill now say each must start with a fresh context window?
- [x] A fork carries the whole parent conversation, so no subagent gets a clean context with only its brief.
- [ ] Fresh windows let the three subagents share notes, so their designs agree on one answer sooner.
  > The point is independent, radically different designs. A fresh window isolates each subagent; it doesn't make them share anything.
- [ ] Forked subagents can't run in parallel, so the three designs would have to run one by one.
  > The Skill still wants 3+ subagents in parallel, each with a fresh context window, so fresh windows don't stop them running at once. The problem is that a fork inherits the parent's context window.
Why: A subagent is worth having for its clean context. Some Codex models fork the parent conversation instead, which throws that away, so the Skill now asks for a fresh context window.
```

## Remember

```flashcards
Q: What does codebase-design create?
A: Nothing on disk. It's a reference to consult, not a session to run, and gives a shared vocabulary for designing deep modules.

Q: In codebase-design, what is a seam?
A: A place where you can change behaviour without editing in that place; where a module's interface lives.

Q: What do leverage and locality mean?
A: What depth buys. Leverage: callers get more for each bit of interface they learn. Locality: change and bugs concentrate in one place, so you fix once and it's fixed everywhere.

Q: Which four words does codebase-design say never to use in place of its own terms?
A: Component, service, API and boundary.

Q: Who coined the word "seam", and how did he define it?
A: Michael Feathers, in his book on legacy code. A seam is a place where you can alter behavior in your program without editing in that place.

Q: What are the four kinds of dependency in codebase-design's DEEPENING.md?
A: In-process, local-substitutable, remote but owned (ports and adapters), and true external (mock).

Q: Once tests exist at a deepened module's interface, what happens to the old unit tests on the shallow modules?
A: They become waste, so you delete them. The rule is replace, don't layer.

Q: Where does codebase-design's "design it twice" come from?
A: John Ousterhout's "Design It Twice": your first idea is unlikely to be the best.
```

## Final test

```final-test codebase-design-deep-module
In codebase-design's words, what makes a module deep?
- [x] A lot of behaviour sits behind a small interface.
- [ ] It has many lines of code compared to its interface.
- [ ] It's split into many small functions, each doing one thing.
Why: A deep module gives a caller a lot of behaviour for little to learn. Counting implementation lines against interface lines is a measure the Skill rejects, because you could pad the code to score well.
```

```final-test codebase-design-deletion-test
You imagine deleting a module, and its complexity reappears across many callers. What does that tell you?
- [x] The module was earning its keep.
- [ ] The module was a shallow pass-through.
- [ ] The module needs a second adapter.
Why: The module was holding that complexity in one place, so without it every caller has to carry it. If complexity vanished instead, the module was a pass-through.
```

```final-test codebase-design-real-seam
When is a seam real rather than hypothetical?
- [x] When two adapters fill it, such as production and test.
- [ ] As soon as its interface is written down in the code.
- [ ] When the module behind it is deep, with a small interface.
- [ ] When it sits at a network call to another service.
Why: A seam earns its place when something actually varies across it. With one adapter nothing varies, so it's only an extra layer. Production plus test is the usual pair.
```

```final-test codebase-design-deeper-driver-runaway
A handoff told a fresh session to resume in codebase-design and drive the open decisions. What happened?
- [x] The agent invented a process and ran to about 105k tokens before asking anything.
- [ ] The agent refused to start, because codebase-design has no steps for it to follow.
- [ ] The agent asked one question at a time and never got as far as designing anything.
Why: codebase-design gives words, with no process and no stopping rule, so the agent made a process up. It re-explored code that was already mapped, and asked nothing for about 105k tokens. Name a driver Skill instead.
```

```final-test codebase-design-deeper-remote-owned
Your deepened module depends on your own service across a network. How do you test it?
- [x] Define a port at the seam; tests use an in-memory adapter, production an HTTP one.
- [ ] Run a local stand-in of the service in the test suite, and keep the seam internal.
- [ ] Mock the module's own internal helpers and assert on the calls each one receives.
Why: Your own service across a network is the remote-but-owned kind, so it gets a port with two adapters. A local stand-in is for local-substitutable dependencies like Postgres, and tests never reach past the interface to internal helpers.
```

```final-test codebase-design-chosen-candidate
You've decided to merge three small pricing helpers in your FastAPI backend into one module. Before writing it, you want to settle what its callers should have to know, and where its tests should plug in. Which fits best?
- [x] Shape its interface with the deep-module vocabulary.
  > Right: that's `/codebase-design`.
- [ ] Survey the whole codebase for modules worth reshaping.
  > That's `/improve-codebase-architecture`. You've already chosen the module. The survey finds candidates; it doesn't design the chosen one.
- [ ] Sharpen the project's domain terms in the glossary.
  > That's `/domain-modeling`. The question is the shape of the code, not the words of the domain.
Why: You've already chosen the module, so the job is settling its interface and seam, and codebase-design gives you the words for that. The interface is also where the tests plug in, because callers and tests cross the same seam.
```

```final-test codebase-design-mid-ticket
You're building a Ticket test-first on your booking site's backend. Before the next failing test, you realise you can't tell where the seam for the booking module belongs or what its interface should expose. Which fits best?
- [x] Use the deep-module vocabulary to settle the interface.
  > Right: that's `/codebase-design`.
- [ ] Write the next failing test anyway and see what shape falls out.
  > That's `/tdd`. Tests go at the seam, so the seam has to be settled before the test can be written.
- [ ] Run a full architecture survey to find the right seam.
  > That's `/improve-codebase-architecture`. That's upkeep across the whole codebase. You need one module's shape, now, inside a Ticket.
Why: Tests go at a seam, so you have to settle the seam first. tdd itself calls codebase-design for the words when the shape of an interface is in question.
```

```final-test codebase-design-compare-interfaces
An architecture survey of your website's backend turned up a candidate you like: deepen the booking module. While you're being grilled on it, you want to see a few very different interfaces before choosing one. What comes next?
- [x] Have subagents each design a different interface to compare.
  > Right: that's `/codebase-design`.
- [ ] Run the architecture survey again to turn up more candidates.
  > That's `/improve-codebase-architecture`. You already have the candidate. You need alternative designs for it, not more candidates.
- [ ] Write the Spec now around the first interface you thought of.
  > That's `/to-spec`. Your first idea is unlikely to be the best. Compare alternatives before committing to one.
Why: You have the candidate, and what you need now is alternative interfaces for it. Design it twice gives you those, because your first idea is unlikely to be the best.
```

```final-test codebase-design-tests-reach-inside
Tests for the email module in your Python worker reach inside it and check a private retry counter. They break every time you refactor, even when the emails sent are exactly the same. Why are these tests a problem?
- [x] Tests should cross the same seam callers use, not reach past it.
- [ ] The tests need more mocks of the module's internal parts.
  > More mocks of internals would tie the tests even tighter to the implementation.
- [ ] The retry counter should be made public so the tests stop breaking.
  > That adds internal state to the interface just so tests can see it. Tests should check observable outcomes through the interface, not internal state.
Why: These tests break when only the code inside changes, so they're testing past the interface. Tests that cross the same seam as callers check what the module does, so they survive a refactor.
```

```final-test codebase-design-deeper-resume-as-driver
Yesterday's design session on your booking API ended with a handoff note: "resume in codebase-design and drive the open decisions". Today's fresh session re-reads code that was already mapped and designs for a long time before asking you anything. Why did this happen?
- [x] The Skill is a vocabulary with no process or stopping rule, so the agent made a process up.
- [ ] The handoff note was too short, and listing every file would have kept the agent on track.
  > The agent re-explored code the note's session had already mapped. Nothing in the Skill told it to stop or check in, whatever the note listed.
- [ ] The model was too weak for design work, and a bigger model would have asked first.
  > The issue's root cause is the missing process, not the model. The fix is to name a driver Skill in the resume instruction.
Why: codebase-design has no checkpoints, because it's a reference. Told to run it, the agent invents a process. So name a driver Skill, such as grill-with-docs or tdd, and let it use these words.
```

```sources
- [codebase-design: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/codebase-design/SKILL.md), Matt Pocock's Skills
- [tdd: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/SKILL.md), Matt Pocock's Skills
- [The /codebase-design Skill](https://www.aihero.dev/skills-codebase-design), Matt Pocock, Updated Aug 24, 2026
- [/codebase-design gets run as a session driver, not consumed as a reference #449](https://github.com/mattpocock/skills/issues/449), mlibby-gh (issue); comments by others, 2026-07-04
- [improve-codebase-architecture: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/improve-codebase-architecture/SKILL.md), Matt Pocock's Skills
- [How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love), Matt Pocock, Updated Feb 26, 2026
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [codebase-design: DEEPENING.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/codebase-design/DEEPENING.md), Matt Pocock's Skills
- [codebase-design: DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/codebase-design/DESIGN-IT-TWICE.md), Matt Pocock's Skills
- [A Philosophy of Software Design vs Clean Code](https://github.com/johnousterhout/aposd-vs-clean-code), John Ousterhout and Robert C. Martin, discussions held September 2024 to February 2025
- [bliki: Legacy Seam](https://martinfowler.com/bliki/LegacySeam.html), Martin Fowler, 2024-01-04
- [fix: make subagent dispatch harness-neutral](https://github.com/mattpocock/skills/commit/14bfbbd8654a8d2910299e1a004c19c1979687d8), Matt Pocock, 2026-08-06
- [Make architecture subagent workflows harness-neutral #564](https://github.com/mattpocock/skills/issues/564), wushijie-ai (issue); comments by others, 2026-07-14
- [Start subagents with a fresh context window, not a fork #1341](https://github.com/mattpocock/skills/pull/1341), mattpocock, 2026-10-29
- [How to implement deep modules in practice #458](https://github.com/mattpocock/skills/issues/458), dylanmoz (issue); replies by mattpocock, 2026-07-05
- [setup-ts-deep-modules: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/setup-ts-deep-modules/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
```
