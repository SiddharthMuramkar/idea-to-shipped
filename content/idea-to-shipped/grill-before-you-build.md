---
title: Grill before you build
slug: grill-before-you-build
summary: Why your coding agent should interview you about an idea before it writes any code, and how that interview, called grilling, works.
image: /images/lessons/grill-before-you-build.jpg
imageAlt: An empty small-town courtroom with the judge's bench, the witness stand and two flags behind them.
---

## What grilling is

Say you ask an agent, in two lines, to add class bookings to a yoga studio's booking site. It picks defaults for the decisions you haven't made, and the result looks complete. At review, you find it handles cancellations in a way you never chose.

**So before any code is written, have the agent interview you about your idea until you both understand it the same way.** Matt Pocock, who wrote the [Skills](/learn/skills) this lesson uses, calls that interview **grilling**.

```checkpoint quick-1
You're about to start a new feature with an agent. What do you do before any code is written?
- [x] Have the agent interview you until you both understand it the same way.
- [ ] Write out every detail yourself, so the agent has nothing left to ask.
- [ ] Let the agent build a first version, then correct whatever it got wrong.
Why: The interview comes first, so that you and the agent reach the same understanding before any code exists. Matt calls that interview grilling.
```

## How a grilling works

The agent maps your idea as a **design tree**: a map of decisions, each branching into the ones depending on it.

It works through the tree in **rounds**, each one a batch of questions it asks before waiting for answers. Each round holds the **frontier**: every decision whose prerequisites are settled, so it can be asked now without guessing. Each question is worded so "yes" accepts its recommended answer.

```checkpoint quick-2
You're about to get a round of questions. Which decisions will it hold?
- [x] Every decision whose prerequisites are already settled.
- [ ] Only the one decision the agent thinks matters most.
- [ ] Every decision in the tree, whether it can be asked yet or not.
Why: A round holds the frontier, which is every decision the agent can ask now without guessing. A decision that needs another answer first has to wait.
```

For example, the first round on bookings might look like this:

```
❓ Q1 - Cancelling: Can members cancel a booking?
➡️ Yes, which frees the place.

❓ Q2 - Full classes: Should a full class turn new bookings away?
➡️ Yes, with no waiting list.
```

_How late can members cancel?_ isn't in this round. It hangs off Q1, so asking it now would mean guessing. You reply "yes" to both. Your answers settle those decisions, which opens up the questions that depended on them. That question comes in the next round.

```checkpoint quick-3
You reply "yes" to Q1. What happens to the question _How late can members cancel?_
- [x] It comes in the next round, now that Q1 is settled.
- [ ] It's dropped, since your yes to Q1 settled it as well.
- [ ] The agent answers it itself, using your reply to Q1.
Why: It hung off Q1, so asking it earlier would have meant guessing. Your answer settled Q1, and that opens up the questions that depended on it.
```

```diagram
type: tree
caption: "Your answers settle those decisions, which opens up the questions that depended on them."
root:
  label: "class bookings"
  note: "a map of decisions, each branching into the ones depending on it"
nodes:
  - label: "Can members cancel a booking?"
    state: settled
    children:
      - label: "How late can members cancel?"
        note: "the next round"
        state: frontier
  - label: "Should a full class turn new bookings away?"
    state: settled
```

## Facts and decisions

- **Facts** are the agent's job. For example, which database does the repo use? The agent sends a **subagent**, a helper agent with its own fresh [context window](/learn/context-window), to find out instead of asking you.
- **Decisions** are yours, like Q1 and Q2. The agent puts each one to you and waits.

```checkpoint quick-4
During a grilling, the next question is a decision, not a fact. What does the agent do?
- [x] It puts the decision to you, and waits for your answer.
- [ ] It sends a subagent to look the decision up in the repo.
- [ ] It makes the decision itself, then tells you what it chose.
Why: Facts are the agent's job, and a subagent can look them up. Decisions are yours, so the agent puts each one to you and waits.
```

## When it's done

The grilling ends when the frontier is empty: every branch of the tree visited, and nothing left silently assumed. Even then, the agent doesn't act until you confirm that you share an understanding.

```checkpoint quick-5
The frontier is empty and every branch has been visited. What happens before the agent acts?
- [x] You confirm that you both share an understanding.
- [ ] It starts the code, since nothing is left to ask.
- [ ] It runs one last round to recheck every branch.
Why: An empty frontier means no questions are left, but the agent still doesn't act. It waits for you to confirm that you share an understanding.
```

## When talk isn't enough

Some questions can't be settled in conversation: what a page should look like, or how a **state model** behaves. A state model is the states a thing can be in, and the moves between them. For example, a booking is either booked or cancelled. Then the [main flow](/learn/main-flow) detours through a [prototype](/learn/prototype): throwaway code that answers one design question. The answer comes back to the grilling.

```checkpoint quick-6
During a grilling, you can't tell what a page should look like until you see it. What does the main flow do?
- [x] It detours through a prototype, then brings the answer back.
- [ ] It leaves the question for the agent to settle with a default.
- [ ] It ends the grilling, and writes a Spec without that answer.
Why: Talk can't settle that kind of question. So the main flow detours through a prototype, throwaway code that answers it, and the answer comes back to the grilling.
```

## Where it fits

Grilling is where the [main flow](/learn/main-flow), the route from idea to finished code, starts. It comes before any [Spec or Ticket](/learn/issues-and-keeping-track): the written plan for a feature, and one slice of it to build. You'll meet it again in [grill-with-docs](/learn/grill-with-docs), the Skill from [one shared language](/learn/one-shared-language) that interviews you and writes the glossary.

```checkpoint quick-7
You have a new idea for the yoga-studio site. Where does the main flow start?
- [x] With a grilling, before any Spec or Ticket exists.
- [ ] With a Spec, which a grilling then checks for gaps.
- [ ] With a Ticket, so that a grilling can follow its code.
Why: Grilling is the main flow's first step. Any Spec or Ticket comes after it, once you and the agent understand the idea the same way.
```

## Going deeper

### Why it exists

You think a developer knows what you want. Then you see what they built, and it isn't what you meant. That's **misalignment**: the two of you meant different things, and nobody noticed. Matt calls it the "most common failure mode in software development".

Agents have the same gap, and they hide it. An agent fills the gaps you left with defaults, and the result looks complete. You can't tell its guesses from your choices. So you find them late: at review, or in a rare case handled in a way you never chose.

```checkpoint quick-8
You leave some decisions out of your request. Why might you not notice what the agent did about them until review?
- [x] It fills the gaps with defaults, and the guesses look like your choices.
- [ ] It marks each guess in a comment that's easy to miss at a glance.
- [ ] It leaves those parts unbuilt until a later session fills them in.
Why: An agent fills the gaps you left with defaults, and the result looks complete. Since you can't tell its guesses from your choices, you find them late.
```

So grilling turns this around. Instead of guessing, the agent has to ask. To **align** is to settle what you both mean, and a grilling does that before any code exists.

### How it works underneath

The idea underneath is the **design concept**: the shared understanding of what's being built, held between you and the agent. Matt takes the term from _The Design of Design_, a book by the computer scientist Frederick Brooks. Brooks credits the design researcher Rachael Luck with identifying it. The conversation, the code and written documents such as a Spec all try to capture it, but none of them is it.

That explains a familiar frustration: the agent writes exactly what you asked for, and it's still wrong. Usually you hadn't finished working out what you wanted. The agent filled the silences with its own assumptions. Nothing broke. There wasn't yet a whole design concept to share.

```checkpoint quick-9
The agent wrote exactly what you asked for, and it's still wrong. What's the usual cause?
- [x] You hadn't finished working out what you wanted.
- [ ] The model misread the words of your request.
- [ ] A tool the agent uses failed while it worked.
Why: Nothing broke. You hadn't finished working out what you wanted, so the agent filled the silences with its own assumptions.
```

So writing a Spec too early doesn't help. It only "captures the misalignment in a more durable asset".

Matt opens his case for grilling with a line from _The Pragmatic Programmer_: "No-one knows exactly what they want". So grilling doesn't only test an idea. It's how the idea gets finished.

Grilling also draws on what the **model** knows. The model is the AI that reads your text and writes replies. Matt calls what it learned in training its **parametric knowledge**. That knowledge is how the agent suggests things you hadn't considered.

So use a big model to grill: "A dumb model won't give you good ideas." A smaller model can do the building. Most of what building needs is **contextual**: already written down, in your plan and the codebase.

```checkpoint quick-10
Which part of the work can a smaller model do, and why?
- [x] The building, since most of what it needs is already written down.
- [ ] The grilling, since asking questions takes very little knowledge.
- [ ] Neither of them, since a smaller model gives no good ideas for either.
Why: Grilling needs a big model's good ideas. Building mostly needs what's already written down, in your plan and the codebase, so a smaller model can do it.
```

### A real example

Anthropic recommends the same move in its Claude Code docs, for when you don't yet know what you want. Its example is about **rate limiting**: capping how many requests each user, or each [API key](/learn/calling-a-model), can send in a given time. You could run it on a FastAPI app, the Python code behind a website:

```
I want to add rate limiting to the public API but haven't thought it through yet. Interview me until you could write the spec, then write it to SPEC.md.
```

Claude then asks about what you haven't pinned down: "per-user versus per-key limits, what happens to requests over the limit, what's out of scope". Each of those is a default the agent would otherwise have picked for you.

```checkpoint quick-11
Claude asks you about per-user versus per-key limits. What would have happened if it hadn't asked?
- [x] The agent would have picked a default for you.
- [ ] The agent would have read them from the repo.
- [ ] The agent would have stopped and left out the limits.
Why: Each thing Claude asks about is a default the agent would otherwise have picked. Being asked turns its guess into your decision.
```

Matt's own work shows when to skip the grilling. His video editor has a feedback button for very simple changes. A note becomes a GitHub Issue, an agent works on it straight away, and a code-review agent reviews the code.

Only at the end does he see the result: "I can do my alignment then". It works because these changes are very easy to specify, with nothing to grill on.

### Where it goes wrong

**The agent asked 200 questions.** Usually the scope was too large. Scope means how large a thing you're grilling. A very long session also fills the context window, and the questions get worse. The fix is to have the agent break the work into smaller pieces first, then grill each one.

```checkpoint quick-12
A grilling has run to 200 questions. What's usually wrong, and what's the fix?
- [x] The scope was too large, so break the work into smaller pieces first.
- [ ] The model was too small, so switch to a bigger one and start again.
- [ ] The rounds were too long, so ask the agent for one question at a time.
Why: Too large a scope makes for a very long session, which fills the context window and makes the questions worse. So split the work, then grill each piece.
```

**You're answering questions about a five-line change.** Not every change needs a grilling. Matt keeps it for work that's "quite large and hard to row back from" (hard to undo). There, wrong code sits in the context window, influencing everything that comes afterwards. A five-line change is cheap to fix, so you can look at it and align afterwards.

The fix is what Matt calls shifting right: check after building rather than before, wherever you can. Before you start, ask three questions:

- Is it small enough to align afterwards? Then don't grill.
- Can you hold the idea in a single session, even if the build takes several? Then grill it.
- Is the idea itself too big and foggy for one session? Then align over the whole thing with [wayfinder](/learn/wayfinder), the Skill that plans a huge, foggy effort as a map of decisions.

```checkpoint quick-13
Your idea is too big and foggy to hold in one session. Which answer fits?
- [x] Align over the whole thing with wayfinder.
- [ ] Grill it all in one long session anyway.
- [ ] Skip aligning, and check the result afterwards.
Why: Small enough to align afterwards? Don't grill. Can you hold the idea in one session? Grill it. Too big and foggy for that? Align over the whole thing with wayfinder.
```

Matt has also written that you should use the grill Skills "_every_ time you want to make a change". That line is older than his three questions, which go into more detail, though it's still in his README. So read it as every change worth aligning on first.

**A long grilling feels like an exam.** One user, bogged down at question 26, wrote that it "feels like I'm being tested". A common cause is being too passive. The agent then piles on questions and widens the scope.

The fix is to steer. You're the one in charge, so use each question as a prompt to give more information. Matt's reply to that user: "It's a conversation, not an exam."

```checkpoint quick-14
You're bogged down at question 26, and the grilling feels like a test. What's the fix?
- [x] Steer it, using each question as a prompt to give more information.
- [ ] Answer every question in order, because the agent needs them all.
- [ ] Start a fresh session, and ask the agent for the same questions.
Why: You're the one in charge. A question is a prompt to give more information, not a test to pass. It's a conversation, not an exam.
```

**You keep planning and never build.** This is the opposite failure: being too active, on details that don't matter yet. Matt calls it over-grilling. The fix is to notice when you know enough, stop planning and start building.

**The decisions vanished with the session.** A finished grilling leaves "a context window full of design decisions". Clearing it to start fresh, only to write a document, throws that work away. Matt's fix: if there's room left, build in the same session. If not, write the decisions into a Spec first.

```checkpoint quick-15
Your grilling is finished, and there's no room left in the session. What do you do before clearing it?
- [x] Write the decisions into a Spec, so they last.
- [ ] Nothing, as the agent keeps them for next time.
- [ ] Start building, and let the session run out.
Why: A finished grilling leaves a context window full of design decisions. Clearing it throws that work away, so write the decisions down first.
```

### Try it

You'll need your practice project, the yoga-studio booking site, with Matt's Skills installed. If you haven't set it up, do the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. Open the `yoga-studio` repo in Claude Code.
2. Ask the agent to reword one line of `README.md`.
3. Look at the result. You should see the reworded line. That change was small enough to align afterwards.
4. Now start the large change. Type `/grill-with-docs let a member cancel a class booking`.
5. Read the first round. You should see numbered questions, each with a recommended answer.
6. Reply to each with "yes" or your own choice. You should see a new round, opened up by your answers.
7. Carry on until no questions are left. Then confirm that you share an understanding, and tell it to build nothing.
8. List the questions you hadn't thought of yourself, such as late cancels or refunds.
9. In a second terminal, in the `yoga-studio` folder, run `git status --short`. You should see `README.md` from step 2, and `GLOSSARY.md` if a term was settled.
10. Undo those edits, so the next Try it starts clean: run `git restore .`, then delete any file on a line starting `??`.
11. Run `git status --short` again. You should see no output.

Each question on your list is a default the agent would have filled in silently.

### Read more

- [Grilling](https://www.aihero.dev/ai-coding-dictionary/grilling), AI Coding Dictionary, Matt Pocock, last changed 2026-06-05
- [Design concept](https://www.aihero.dev/ai-coding-dictionary/design-concept), AI Coding Dictionary, Matt Pocock, last changed 2026-06-05
- [The /grill-me Skill](https://www.aihero.dev/skills-grill-me), Matt Pocock, updated 2026-08-24
- [9 Things People Get Wrong With /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), Matt Pocock, updated 2026-05-25
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer, Gergely Orosz with Matt Pocock, 2026-09-17
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29 (the grilling lines written 2026-04-28)
- [Codex just asked me 200 questions (issue #44)](https://github.com/mattpocock/skills/issues/44), opened by DoozyDoz, 2026-04-19

## Remember

```flashcards
Q: In a grilling, what is the design tree?
A: A map of the idea where every decision branches into the decisions that hang off it.

Q: In a grilling, what is the frontier?
A: Every decision whose prerequisites are already settled, so it can be asked now without guessing.

Q: The frontier is empty. Can the agent start building?
A: Not yet. It waits until you confirm you've reached a shared understanding.

Q: What is a design concept?
A: The shared understanding of what's being built, held between you and the agent. The conversation, written documents such as a Spec, and the code only try to capture it.

Q: Why does Matt want a big model for grilling, but not for building?
A: Grilling leans on the model's parametric knowledge to suggest things you hadn't considered. Building mostly uses what's already written down, so a smaller model can do it.

Q: A grilling has run to 200 questions. What does Matt suggest?
A: Usually the scope was too large. Have the agent break the work into smaller pieces first, then grill each one.
```

## Final test

```final-test grill-before-you-build-when-done
When is a grilling finished?
- [x] When every branch of the design tree has been visited.
- [ ] After a set number of rounds, such as three or four.
- [ ] As soon as the agent knows enough to start coding.
Why: A grilling has no set number of rounds, and the agent feeling ready isn't enough. It ends when the frontier is empty, because only then has every branch been visited with nothing silently assumed. Even then, the agent waits for you to confirm a shared understanding.
```

```final-test grill-before-you-build-facts
Mid-grilling, a question depends on which database your FastAPI repo already uses. Who finds that out?
- [x] The agent. Finding facts is its job.
- [ ] You. The agent asks you for every fact it needs.
- [ ] Nobody. The agent guesses and moves on.
Why: Which database the repo uses is a fact the agent can look up, so it shouldn't ask you, and it shouldn't guess. It sends a subagent to find out. Only decisions come to you, because they're yours to make.
```

```final-test grill-before-you-build-round
What does one round of a grilling ask?
- [x] Every question whose prerequisites are settled, with recommended answers.
- [ ] One question at a time, each with the agent's recommended answer.
- [ ] Every question about the plan, including ones that hang on other answers.
Why: A round asks the whole frontier, every question that can be asked now without guessing, numbered and with recommended answers. A question that hangs on another still-open answer would force a guess, so it waits for a later round.
```

```final-test grill-before-you-build-deeper-silent
Grilling exists because of one habit agents have. What is it?
- [x] They fill the gaps you left with defaults, and the guesses look just like your choices.
- [ ] They ask so many questions up front that you give up before any code is written.
- [ ] They forget earlier decisions once the session grows long, so you have to repeat them.
Why: Given a short request, an agent doesn't stop at the decisions you haven't made. It picks defaults, and the result looks complete, so you only find the guesses late, at review or in a rare case you never chose. Grilling makes the agent ask instead.
```

```final-test grill-before-you-build-deeper-when-to
You're about to ask an agent for a change. Which work does Matt say needs no aligning first?
- [x] Small changes like a five-line fix, which you can check and put right afterwards.
- [ ] Work that spans several sessions, which is too big to grill in one go.
- [ ] New features on a page you haven't built yet, since the agent can guess well.
Why: A small change is cheap to put right, so you can look at it and align afterwards. Where you can, Matt says, you should "shift right". He keeps grilling for work that's large and hard to row back from, and an idea too big for one session still needs aligning, through wayfinder.
```

```sources
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [mattpocock/skills README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [Grilling | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/grilling), Matt Pocock, 2026-09-24
- [Design concept | AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/design-concept), Matt Pocock, 2026-09-24
- [The Design of Design: Essays from a Computer Scientist (publisher preview)](https://api.pageplace.de/preview/DT0400.9780321702043_A23552532/preview-9780321702043_A23552532.pdf), Frederick P. Brooks, Jr., 2010
- [9 Things People Get Wrong With /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), Matt Pocock, 2026-05-25
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer (Gergely Orosz) with Matt Pocock, 2026-09-17
- [Codex just asked me 200 questions · Issue #44 · mattpocock/skills](https://github.com/mattpocock/skills/issues/44), DoozyDoz, 2026-04-19
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
- [Enhance README with detailed explanations of common AI failure modes … · mattpocock/skills@1eed8a6](https://github.com/mattpocock/skills/commit/1eed8a689b289992dcb92990933bc1166f8faaca), Matt Pocock, 2026-04-28
- [History for README.md - mattpocock/skills](https://github.com/mattpocock/skills/commits/1eed8a689b289992dcb92990933bc1166f8faaca/README.md), Matt Pocock, 2026-04-28
- [History for dictionary/Grilling.md - mattpocock/dictionary-of-ai-coding](https://github.com/mattpocock/dictionary-of-ai-coding/commits/main/dictionary/Grilling.md), Matt Pocock, 2026-06-05
- [History for dictionary/Design concept.md - mattpocock/dictionary-of-ai-coding](https://github.com/mattpocock/dictionary-of-ai-coding/commits/main/dictionary/Design%20concept.md), Matt Pocock, 2026-06-05
- [The /grill-me Skill](https://www.aihero.dev/skills-grill-me), Matt Pocock, 2026-08-24
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
```
