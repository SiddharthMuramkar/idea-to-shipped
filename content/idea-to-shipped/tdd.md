---
title: tdd: build it test-first, one slice at a time
slug: tdd
summary: How tdd gives your agent the rules of the red-green loop: one failing test first, then only enough code to pass it, at seams you agree.
---

## What it's for

Imagine an agent that writes the code first, then tests that only repeat it. They pass, but tell you little.

**tdd gives the agent the rules of the red → green loop: a failing test first, then only enough code to pass it.** It's [test-first](/learn/test-first) as a Skill.

Say tdd runs on [Ticket](/learn/issues-and-keeping-track) #13, the booking endpoint (the web address your app calls):

1. The agent writes down a **seam**: the public boundary you test at, without reaching inside, here `POST /bookings`. You confirm it.
2. Red: it writes one test that fails, because the behaviour doesn't exist yet.
3. Green: it writes only enough code to make that test pass.
4. Then the next test.

```checkpoint quick-1
Your agent has one failing test for Ticket #13. How much code does it write next?
- [x] Only enough to make that one test pass.
- [ ] Enough to finish all of Ticket #13.
- [ ] Enough to pass that test and the next few too.
Why: Green means only enough code to make the failing test pass. Then the agent writes the next test.
```

```diagram
type: cycle
caption: "the red → green loop"
steps: ["Red: it writes one test that fails", "Green: it writes only enough code", "Then the next test."]
outside: "Refactoring"
```

Step 2's test might be:

```python
def test_member_can_book_a_class(client):  # client sends requests to the app
    response = client.post("/bookings", json={"class_id": 7})
    assert response.status_code == 201  # 201 means created
```

A good test like this checks behaviour through a public interface, not the code's insides. The code can change and the test still holds.

```checkpoint quick-2
You rewrite the insides of the booking code, and the endpoint behaves as before. What should a good test do?
- [x] Still pass, as it checks behaviour through a public interface.
- [ ] Fail, because it checks how the code works on its insides too.
- [ ] Fail, so that you know to rewrite the test along with the code.
Why: A good test checks behaviour through a public interface, not the code's insides. So the code can change and the test still holds.
```

The rules also name three **anti-patterns**, or common mistakes:

- **Implementation-coupled test**: it reaches into the code's insides instead of its interface.
- **Tautological test**: it computes its expected value the same way the code does, so it can never disagree with the code.
- **Horizontal slicing**: writing all the tests first, so no test can respond to what the last cycle taught you.

```checkpoint quick-3
Your test calls a private helper instead of going through the endpoint. Which mistake is that?
- [x] An implementation-coupled test: it reaches into the insides.
- [ ] A tautological test: it computes its value the way the code does.
- [ ] Horizontal slicing: it writes all of the tests before any code.
Why: A private helper is part of the code's insides. A test that reaches in there instead of using the interface is implementation-coupled.
```

A **mock** is a fake stand-in for a real part. It goes only at system boundaries, where your code meets things you don't control, like an outside API or the clock. Your own modules stay real.

```checkpoint quick-4
Your code reads the clock and calls your own pricing module. Which do you mock in the test?
- [x] The clock, a system boundary you don't control.
- [ ] The pricing module, because you wrote it yourself.
- [ ] Both, so that nothing real runs in the test.
Why: A mock goes only at system boundaries, such as an outside API or the clock. Your own pricing module stays real.
```

Refactoring, tidying code without changing what it does, isn't in the loop. It belongs to review, in [code-review](/learn/code-review).

## When to use it

- You're building a feature or fixing a bug test-first.
- You want **integration tests**: tests running several parts of the system together.

```checkpoint quick-5
You've decided on a new rule for the booking API, and you want it built test-first. Does tdd fit?
- [x] Yes, because it fits building a feature test-first.
- [ ] No, because it only fits fixing a bug test-first.
- [ ] No, because it only fits writing integration tests.
Why: tdd fits building a feature or fixing a bug test-first. A new rule is a small feature, and you've already decided what it should do.
```

## When not to use it

- For a fast answer to a design question, use its look-alike [prototype](/learn/prototype), because it skips tests and stays off `main`.
- For a hard bug with no known cause, use [diagnosing-bugs](/learn/diagnosing-bugs). It first builds a **feedback loop**: a quick pass/fail check that fails on a bug and passes once it's fixed.

```checkpoint quick-6
You want a design question answered fast, with code that won't ship. Which Skill fits?
- [x] prototype, which skips tests and stays off `main`.
- [ ] tdd, which writes one failing test at a time.
- [ ] diagnosing-bugs, which builds a feedback loop first.
Why: A prototype answers a design question fast. It skips tests and stays off `main`, so it's the look-alike to use here instead of tdd.
```

## What it needs to start

You type `/tdd`, or the agent starts it when a task fits. [implement](/learn/implement) calls it where possible, and [implement-spec](/learn/implement-spec) calls it for each Ticket. For a whole Ticket, you'd almost always use implement. tdd needs:

- A behaviour to build.
- Seams agreed with you before any test. You can't test everything, so this puts the effort on the critical paths, the parts that must not break.

```checkpoint quick-7
Why does the agent agree seams with you before it writes any test?
- [x] You can't test everything, so it puts effort on the critical paths.
- [ ] It isn't allowed to read any of your code until you have said yes.
- [ ] It can then write all of the tests at once, in a single big batch.
Why: You can't test everything. Agreeing the seams before any test puts the effort on the critical paths.
```

## What it creates

- Tests at the agreed seams, each one failing before its code was written.
- Only enough code to pass them, with no extra features.

```checkpoint quick-8
You open a test that tdd left behind. What should be true of a test that tdd leaves behind?
- [x] It failed before the code that passes it was written.
- [ ] It was written after its code, to confirm the code works.
- [ ] It was written at a seam the agent chose without asking.
Why: tdd leaves tests at the agreed seams, each one failing before its code was written, plus only enough code to pass them.
```

## Going deeper

### Why it exists

TDD, short for test-driven development, was built for people. A failing test reminds you where you were when you come back from a coffee break. Matt Pocock, who wrote the Skill, puts it this way: "TDD optimizes for having a very small working memory." Agents hold far more than people do, so they don't need that reminder.

What agents do need is feedback: a way to see what their code does when it runs. A test that fails first gives them that. Matt adds that a failure built first is very hard for an agent to cheat.

So Matt often asks an agent for **TDD evidence**: proof that the test would fail without the change.

```checkpoint quick-9
You want an agent to show that its change really does something. What do you ask for?
- [x] TDD evidence: proof the test would fail without the change.
- [ ] A test run showing that the new test passed the first time.
- [ ] A list of every function that the change touched and tested.
Why: TDD evidence is proof that the test would fail without the change. So the change is what turns the test green.
```

There's a second problem: agents often write poor tests. So tdd holds the rules that make the loop produce tests worth keeping.

Matt admits mixed feelings about TDD, but still recommends it for the confidence it gives.

### How it works underneath

Kent Beck, who rediscovered TDD, wrote its loop down as Canon TDD (2023). It has five steps. You list your test scenarios, turn exactly one into a real test, and make it pass. Step 4 is "Optionally refactor". Step 5 repeats until the list is empty.

Two of Beck's named mistakes are close to Matt's anti-patterns:

- **Turning the whole list into tests first.** If the first test changes your mind, Beck says you get "Rework". Matt calls this horizontal slicing.
- **Pasting computed values in as the expected values.** Beck says that "defeats double checking". Matt's closest anti-pattern is the tautological test, which recomputes the value the way the code does.

```checkpoint quick-10
You turn your whole test list into tests, then start on the code. What does Beck warn about?
- [x] If the first test changes your mind, you get rework.
- [ ] A long list of tests takes too long for the agent to run.
- [ ] The tests end up copying computed values from the code.
Why: If the first test changes your mind, the tests you've already written need rework. Matt calls this mistake horizontal slicing.
```

For example, say a booking adds up its line prices. Here's a tautological test, then the fix:

```python
# Tautological: repeats the code's own sum
assert booking_total(prices) == sum(prices)

# Independent: a known value
assert booking_total([10, 5]) == 15
```

Canon TDD and Matt's tdd share one test at a time. But Canon TDD starts from a test list, while Matt's tdd starts from agreed seams. And only Canon TDD keeps a refactor step.

```checkpoint quick-11
You're comparing Canon TDD with Matt's tdd. Which one keeps a refactor step?
- [x] Only Canon TDD.
- [ ] Only Matt's tdd.
- [ ] Both of them.
Why: Both take one test at a time. Canon TDD starts from a test list and keeps a refactor step. Matt's tdd starts from agreed seams and doesn't.
```

```diagram
type: compare
caption: "Canon TDD and Matt's tdd"
columns: ["Canon TDD", "Matt's tdd"]
rows:
  - label: "one test at a time"
    cells: ["yes", "yes"]
  - label: "starts from"
    cells: ["a test list", "agreed seams"]
  - label: "a refactor step"
    cells: ["yes", "no"]
```

Matt removed that step because agents almost never performed it, and because review and implementation work better as separate sessions. The phrase "red-green-refactor" still starts the Skill, but what you get is red-green.

The Skill's file is short on purpose. The loop rests on **leading words**, compact terms the model already knows and thinks with: TDD, red/green and tracer bullet. So the old Workflow section, which spelled the loop out step by step, was largely a no-op: it changed almost nothing. What's left is a reference: seams, anti-patterns and the rules of the loop.

```checkpoint quick-12
Why could Matt cut the Workflow section from tdd?
- [x] The model already holds the loop's words, like TDD and red/green.
- [ ] The section moved into code-review, along with the refactor step.
- [ ] The section became a longer checklist for each cycle of the loop.
Why: The loop rests on leading words the model already holds. Spelling it out changed almost nothing, so what's left is a reference.
```

The reference also has the agent read `GLOSSARY.md`, if any, so test names match the project's words.

### A real example

Until October 2026, tdd's seam question named seams by label only, so you had to guess. It was "the most-reported friction with the skill".

Matt's one-line fix changed the question:

```text
Before: Which seam: A (component boundary) or B (integration boundary)?
After:  A: component boundary: catches rendering bugs, misses network failures.
        B: integration boundary: catches the full round-trip, slower to isolate.
```

Now each proposed seam gets a note on what it catches and what it misses. Matt's page on the Skill, dated August 2026, says no fix has shipped: it predates this one.

```checkpoint quick-13
The agent proposes two seams and asks you to pick. What should it tell you about each one?
- [x] What it catches and what it misses.
- [ ] How long its tests will take to run.
- [ ] Which file of the code it lives in.
Why: A note on what each seam catches and what it misses gives you a basis for choosing, so you no longer have to guess.
```

### Where it goes wrong

**The agent wrote the code before the test.** One model, pushed on it, said it "defaulted to my normal habit". No instruction makes an agent comply every time, and stricter wording gains little. If a slice matters, watch the run rather than trusting the Skill to enforce it.

```checkpoint quick-14
A slice really matters, and you know agents sometimes write the code first. What do you do?
- [x] Watch the run, instead of trusting the Skill to enforce it.
- [ ] Add stricter wording to the Skill until the agent complies.
- [ ] Switch to prototype, which doesn't need any tests at all.
Why: No instruction makes an agent comply every time, and stricter wording gains little. If a slice matters, watch the run.
```

**implement skipped tdd.** One user counted 17 implement runs in their transcripts, with 0 tdd calls. The issue blames no agreed seam, so nothing triggers tdd, and "where possible", which reads as optional. Matt's later change to a Skill tool call kept those words. So look in the run for a `tdd` Skill tool call, which shows the agent really loaded it, before any code changes.

**The first red only proved a name was missing.** A model asked to reproduce a bug wrote tests against a method that didn't exist yet. It reported "confirmed red (no method named drain_settled, 4 compile errors)". The bug itself never happened, so no test guards against it coming back. Ask for a test that calls the existing code and fails on the wrong behaviour.

```checkpoint quick-15
Fixing a bug, the agent reports red: compile errors on a method it hasn't written. What do you ask for?
- [x] A test on the existing code that fails on the wrong behaviour.
- [ ] The missing method first, so the test can compile and go green.
- [ ] A second test against the same missing method, to confirm the red.
Why: That red only proves a name is missing. The bug never happened in the test, so ask for one that calls the existing code and fails on the wrong behaviour.
```

**A test vanished on the way to green.** Beck lists "disabling or deleting tests" as a sign of an AI cheating. Check the diff, and have the agent pass it for real.

**The test only restates the code.** For config, wiring or glue, there's often no independent value to check against, so the loop gives you "a test that restates the implementation". Nothing in tdd decides whether a change is worth the loop. You make that call yourself, or write the rule into your `CLAUDE.md`. The request for such a rule was closed as not planned.

**A browser test came first.** A browser test drives a real web page, and it's slow enough that the red-green loop stops paying for itself. One agent wrote one before the feature existed, then decided the test was broken. So say in your repo's `CLAUDE.md` that browser tests come after the behaviour works.

### Try it

Use tdd to fix one bug in your practice project. Say a booking still goes through for a class that has already started. If you haven't added a full-class rule yet, a full class still taking one more booking works too.

You'll need the practice project's booking endpoint. [keeping track](/learn/issues-and-keeping-track)'s Try it step sets up the project, and [implement](/learn/implement)'s builds the endpoint. It needs pytest, running in Docker Compose as a service called `api`.

1. Open a fresh session in the project and type `/tdd`.
2. Describe the bug, and ask the agent to fix it test-first.
3. Read the seams it proposes. You should see a note on what each one catches and misses.
4. Confirm the seam `POST /bookings`.
5. Read the first red. You should see pytest fail because the booking went through.
6. Read the test's expected value, the response it asserts. It should be a literal, not computed the way the code does.
7. Let the agent write only enough code to pass the test.
8. Run `docker compose exec api pytest`. You should see every test pass.
9. Commit the fix on a branch, and merge it through a pull request. You should see it on `main`.

If a seam has no note, ask for one before you confirm. If the first red is an `ImportError` or `AttributeError`, only a name is missing. Ask for a test that calls the existing endpoint and fails because the booking goes through.

### Read more

- [The /tdd Skill](https://www.aihero.dev/skills-tdd), Matt Pocock, updated 2026-08-24
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer with Matt Pocock, 2026-09-17
- [Canon TDD](https://newsletter.kentbeck.com/p/canon-tdd), Kent Beck, 2023-12-11
- [Augmented Coding: Beyond the Vibes](https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes), Kent Beck, 2025-06-25
- [tdd: reshape into reference-only with pre-agreed seams (#393)](https://github.com/mattpocock/skills/pull/393), Matt Pocock, 2026-06-30
- [tdd: note what each proposed seam catches and misses (#1192)](https://github.com/mattpocock/skills/pull/1192), Matt Pocock, 2026-10-06
- [`skills/engineering/tdd` allows for incorrect TDD tests and considers them valid RED -> GREEN (#1210)](https://github.com/mattpocock/skills/issues/1210), Teebor-Choka, 2026-10-07
- [/implement silently skips its /tdd and /code-review steps (#479)](https://github.com/mattpocock/skills/issues/479), AlejandroFuentePinero, 2026-07-09

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint tdd-deeper-reproduce-the-bug
Your FastAPI booking backend lets two people book the last place in a class. You ask the agent to fix it test-first. It reports red, because pytest failed with an AttributeError on a helper it hasn't written yet. You ask for a different first test. What's the reason behind this step?
- [x] A red on a missing name never shows the double booking, so no test guards it.
- [ ] An AttributeError means the test mocks an internal part, which tdd forbids.
  > Nothing is mocked here. The problem is what the failure proves, not how the test is built.
- [ ] The first test for a bug should drive the browser, so a test on the backend can't count.
  > Browser tests are slow enough that the red-green feedback loop stops paying for itself.
- [ ] The helper should be written first, so the test can import it before going red.
  > That writes code before the test. The red should come from the existing code doing the wrong thing.
Why: A red on a missing name proves only that the name is missing. The double booking never happens in that test, so nothing guards against it coming back. A useful red comes from the existing code doing the wrong thing, here a second booking going through.
```

## Remember

```flashcards
Q: What is tdd's loop?
A: Red → green: write a failing test first, then only enough code to pass it.

Q: In tdd, what is a seam?
A: The public boundary you test at, where you see behaviour without reaching inside.

Q: Where does refactoring belong, if not in tdd's loop?
A: In the review stage: [code-review](/learn/code-review).

Q: What does tdd create?
A: Tests at the agreed seams, each failing before its code was written, and only enough code to pass them.

Q: Who rediscovered TDD, and which step does his Canon TDD keep that tdd dropped?
A: Kent Beck. Canon TDD (2023) keeps step 4, "Optionally refactor".

Q: Why does Matt say a test that fails first helps agents?
A: It gives them a feedback loop on how their code really runs, and that failure is very hard for an agent to fake.

Q: Why could tdd drop its step-by-step Workflow section?
A: The red → green loop rests on leading words the model already holds (TDD, red/green, tracer bullet), so the Workflow was largely a no-op.
```

## Final test

```final-test tdd-before-first-test
You start tdd on a new behaviour. What happens before any test is written?
- [x] The seams to test are written down and confirmed with you.
- [ ] Every test for the feature is written, so the code has a target.
- [ ] The existing code is refactored first so it's easier to test.
- [ ] A throwaway prototype is built first to explore the design.
Why: You can't test everything. So the agent writes down the seams first and you confirm them, which puts the testing effort on the critical paths and complex logic, not on every edge case.
```

```final-test tdd-tautological
A test checks that a booking total equals the line prices added up the same way the code adds them. What's wrong with it?
- [x] It's tautological, so it can never disagree with the code.
- [ ] It's implementation-coupled, because it mocks an internal part.
- [ ] It's a horizontal slice, because it was written before the code.
Why: Both sides do the same sum, so they always match, and the test can never disagree with the code. The expected value has to come from somewhere independent, such as a known literal or a worked example.
```

```final-test tdd-where-to-mock
You're writing a test with tdd, and you want to use a mock. Where may it go?
- [x] Only at system boundaries, like outside APIs or time.
- [ ] Around every module, so each one is tested on its own.
- [ ] Around your own classes, since you control what they do.
- [ ] Nowhere. A test with a mock isn't testing the real code.
Why: A mock belongs where your code meets something you don't control, such as an outside API or the clock. Mock your own modules and the test reaches into the code's insides, so it can break when you refactor even though the behaviour hasn't changed.
```

```final-test tdd-deeper-why-no-refactor
Why did Matt drop the refactor step from tdd's loop?
- [x] Agents almost never performed it, and review works better as a separate session.
- [ ] Kent Beck's Canon TDD has no refactor step, so tdd was brought in line with it.
- [ ] Refactoring inside the loop kept turning good tests into tautological ones.
- [ ] The longer loop no longer fit in the model's context window on big features.
Why: Agents almost never did the step, so it wasn't earning its place, and review and building work better as separate sessions. Beck's Canon TDD isn't the reason, because it keeps a step 4, "Optionally refactor".
```

```final-test tdd-deeper-compile-red
Asked to reproduce a bug, a model's first red was 4 compile errors for a method that didn't exist yet. Why didn't that red count?
- [x] It only proved a name was missing, so the bug itself was never reproduced.
- [ ] It mocked an internal part of the code, so the test was implementation-coupled.
- [ ] Several tests before any code is horizontal slicing, and that cancels any red.
- [ ] It ran a slow browser test, so the red-green loop stopped paying for itself.
Why: A red should show the bug happening. Compile errors on a missing method show only that a name is missing, so the pass "did not replicate the target issue". With no test that reproduces the bug, no test guards against it coming back.
```

```final-test tdd-cancellation-rule
Your FastAPI booking backend needs a new rule. A booking can't be cancelled within 24 hours of its start. You want the rule built with tests that will still hold after later refactors. Which fits best?
- [x] Write one failing test at a time, then the code to make it pass.
  > Right: that's `/tdd`.
- [ ] Build a quick throwaway version first to try the rule on a few cases.
  > That's `/prototype`. A prototype has no tests and stays off main. This rule is decided, and it needs tests that last.
- [ ] Review the change against the Spec and the coding standards.
  > That's `/code-review`. Nothing is built yet, so there's no change to review.
Why: The rule is decided, so it's ready to build test-first. The tests go through public interfaces and don't depend on the code's insides, so they survive later refactors.
```

```final-test tdd-or-prototype
You can't decide whether the booking flow in your AI agent needs three states or four. You want to push it through a few tricky cases and see which feels right before building it for real. Which fits best?
- [x] Build throwaway code that lets you click through the cases.
  > Right: that's `/prototype`.
- [ ] Write a failing test for each state, then the code to pass it.
  > That's `/tdd`. Tests pin down behaviour you've already decided. Here the design question is still open.
- [ ] Build it now, test-first, and get the work reviewed.
  > That's `/implement`. There's nothing settled to build yet. The question has to be answered first.
Why: The question here is "does this state model feel right?", and nothing is decided yet. A prototype answers that fast, and it stays off main. Tests pin down behaviour you've decided, so tdd comes after, once the answer is in.
```

```final-test tdd-green-then-tidy
The tests for your cancellation rule have gone green. The code works, but you'd like to rename a few things and pull out a helper function. What comes next?
- [x] Leave the tidy-up for the review, once the building is done.
  > Right: that's `/code-review`.
- [ ] Tidy it now, as the refactor step of the red-green loop.
  > That's `/tdd`. Refactoring is not part of the loop. Each cycle is one test and only enough code.
- [ ] Write the pull request body first, then tidy before merging.
  > That's `/pr`. The pull request should describe the finished change, after the review.
Why: Refactoring isn't part of the red-green loop, so tidying waits until the building is done. The review stage then flags things like a mysterious name or duplicated code, and says how to fix them.
```

```final-test tdd-one-slice
Building the cancellation rule, the agent writes one failing test, makes it pass, and only then writes the next test. It never writes all the tests up front. What's the reason behind this step?
- [x] Each test can respond to what the last cycle taught.
- [ ] It's less typing than writing every test for the rule at once.
  > Typing isn't the reason. Tests written in bulk check imagined behaviour, not real behaviour.
- [ ] A test runner can only report one failing test at a time.
  > Test runners handle many failing tests. The one-at-a-time rule is about learning from each cycle.
- [ ] It lets the agent leave out the tests for the hard parts of the rule.
  > Nothing is skipped. Each slice is one seam, one test and one small piece of code.
Why: Tests written in bulk check behaviour you've only imagined, and they fix a test structure before you understand the code. Working one test at a time, each test is a tracer bullet that responds to what the last cycle taught you.
```

```final-test tdd-agree-seams
Before writing any test for your SQL-backed bookings endpoint, the agent lists the seams it plans to test, notes what each one catches and misses, and waits for you to confirm. What's the reason behind this step?
- [x] So testing effort lands on the critical paths, not every edge case.
- [ ] So it can mock every module that sits behind each agreed seam.
  > tdd mocks only at system boundaries, never your own modules.
- [ ] So it can write every test at once, as soon as the seams are known.
  > Tests still come one at a time, each made to pass before the next.
- [ ] Because the agent isn't allowed to read the code until you confirm.
  > Nothing stops it reading the code. The confirmation is about where testing effort goes.
Why: You can't test everything, so the agreement decides where the testing effort goes. Each proposed seam's note says what it catches and what it misses, so you can choose the ones that cover the critical paths.
```

```sources
- [/implement silently skips its /tdd and /code-review steps (#479)](https://github.com/mattpocock/skills/issues/479), AlejandroFuentePinero, 2026-07-09
- [The /tdd Skill](https://www.aihero.dev/skills-tdd), Matt Pocock, Updated Aug 24, 2026
- [tdd: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/SKILL.md), Matt Pocock's Skills
- [writing-for-agents: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
- [tdd: mocking.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/mocking.md), Matt Pocock's Skills
- [tdd: tests.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/tests.md), Matt Pocock's Skills
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [diagnosing-bugs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/diagnosing-bugs/SKILL.md), Matt Pocock's Skills
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer (Gergely Orosz) with Matt Pocock, 2026-09-17
- [Canon TDD](https://newsletter.kentbeck.com/p/canon-tdd), Kent Beck, 2023-12-11
- [Augmented Coding: Beyond the Vibes](https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes), Kent Beck, 2025-06-25
- [tdd: reshape into reference-only with pre-agreed seams #393](https://github.com/mattpocock/skills/pull/393), Matt Pocock (mattpocock), 2026-06-30
- [tdd: note what each proposed seam catches and misses #1192](https://github.com/mattpocock/skills/pull/1192), Matt Pocock (mattpocock), 2026-10-06
- [`skills/engineering/tdd` allows for incorrect TDD tests and considers them valid RED -> GREEN #1210](https://github.com/mattpocock/skills/issues/1210), Teebor-Choka (issue); triage comment on mattpocock marked AI-generated, 2026-10-07
- [tdd: nothing decides whether a change warrants the loop — only where the seams go #746](https://github.com/mattpocock/skills/issues/746), yifengingit (issue), 2026-08-05
- [implement: call the Skill tool for tdd and code-review (e48341a)](https://github.com/mattpocock/skills/commit/e48341a3d412cfeba4b9a79d3fd0331fc376ba82), Matt Pocock, 2026-10-06
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [code-review: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/code-review/SKILL.md), Matt Pocock's Skills
```
