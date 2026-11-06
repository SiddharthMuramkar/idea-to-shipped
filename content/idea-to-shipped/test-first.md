---
title: Test first
slug: test-first
summary: Write a failing test first, then only enough code to pass it, one small slice at a time, so your agent can see whether its code works.
---

## What test first is

Say you ask your agent to build [Ticket](/learn/issues-and-keeping-track) #13, the endpoint (the web address your app calls) that creates a booking. It tells you it's done. But with nothing to run, looking done is all it has to go on. Every mistake waits until you notice it.

```checkpoint quick-1
Your agent says the endpoint is done, but it had nothing to run. What does it really know?
- [x] Only that the work looks done, since nothing has checked it.
- [ ] That the code works, since the agent wrote every line itself.
- [ ] That every mistake is gone, since it read the code back over.
Why: With nothing to run, looking done is all the agent has to go on. Every mistake waits until you notice it.
```

**Test first means writing a failing test, then only enough code to make it pass.**

The test is red while it fails and green once it passes, as in [CI/CD](/learn/what-ci-cd-is). Now your agent has something to run.

## One red-green cycle

For example, say Ticket #13's first rule is that a member can book a class. Your agent writes the test first:

```python
def test_member_can_book_a_class(client):  # client: a helper that calls your app
    response = client.post("/bookings", json={"class_id": 1})
    assert response.status_code == 201
```

It runs `pytest`, Python's test runner. The test is red, because the endpoint doesn't exist yet:

```text
FAILED test_bookings.py::test_member_can_book_a_class - assert 404 == 201
```

Now it writes only enough code to pass: that one endpoint. It runs `pytest` again, and the test is green.

A full class refusing a booking is a later rule, so it waits for its own test.

```checkpoint quick-2
Your agent's first test is green, and a full class must refuse bookings too. What comes next?
- [x] A test for that rule first, then its code.
- [ ] The refusal code now, then a test for both.
- [ ] Nothing, since this Ticket's first test passes.
Why: A later rule waits for its own test, so you write that test first. Adding the code now would add a feature no test asks for yet.
```

## Tests live at seams

That test calls the HTTP API (the web requests the app answers), not a private helper function. The API is its **seam**: the public boundary where tests watch what the code does, without reaching inside.

```checkpoint quick-3
You're testing Ticket #13's endpoint in FastAPI. Which of these is a seam?
- [x] The HTTP API that a caller sends requests to.
- [ ] A private helper function inside the endpoint.
- [ ] A single line inside the route handler's code.
Why: A seam is the public boundary where tests watch what the code does. Testing a private helper or a line of code means reaching inside.
```

You can't test everything, so the agent agrees seams with you before writing any test.

A good test checks behaviour through a public **interface** (what a caller must know to use the code correctly), not how the code works inside. So the code can change completely, and the test shouldn't need to.

```checkpoint quick-4
You rewrite how an endpoint works inside, and it still behaves the same. What should a good test do?
- [x] Keep passing, with no change to the test itself.
- [ ] Fail, because the code inside it has changed.
- [ ] Need rewriting, to match the code's new structure.
Why: A good test checks behaviour through a public interface, not how the code works inside. So the code can change completely, and the test shouldn't need to.
```

## One slice at a time

Each cycle is one seam, one test and the smallest code that passes it. You work in **vertical slices**: thin pieces of work through every layer (database, API, page), showable alone. Each test responds to what the last cycle taught.

The trap is **horizontal slicing**: doing one kind of work at a time, such as all the tests first, then all the code. Those bulk tests check behaviour you imagined, not behaviour you've seen.

```checkpoint quick-5
You're about to write every test for a feature, and then all its code. What's the catch?
- [x] The tests check behaviour you imagined, not behaviour you've seen.
- [ ] The tests run too slowly, because they were all written together.
- [ ] The code ends up too small, because the tests ask for so little.
Why: That's horizontal slicing: doing one layer at a time. Those bulk tests check behaviour you imagined, not behaviour you've seen.
```

**Refactoring** means tidying code without changing what it does. Refactoring is not part of the loop: it belongs to the review stage, in [code-review](/learn/code-review).

```checkpoint quick-6
A test has gone green, and you spot a messy function you'd like to tidy. When does that tidying happen?
- [x] In the review stage, outside the red-green loop.
- [ ] Straight away, as the last step of this cycle.
- [ ] Never, because code that passes is left alone.
Why: Refactoring, tidying code without changing what it does, is not part of the loop. It belongs to the review stage, so the tidying waits.
```

```diagram
type: cycle
caption: "Refactoring is not part of the loop"
steps: ["writing a failing test", "red while it fails", "only enough code to make it pass", "green once it passes"]
outside: "Refactoring"
```

## Where it shows up

You'll meet test first again in the [main flow](/learn/main-flow)'s Skills:

- [to-spec](/learn/to-spec), which sketches the seams before any code is written and checks them with you;
- [tdd](/learn/tdd), the Skill for test-driven development: red, then green, then the next test;
- [implement](/learn/implement), the Skill that builds a Spec or its Tickets, test-first, then commits. It calls tdd wherever it can;
- [implement-spec](/learn/implement-spec), which gives each Ticket an **implementer subagent**: a helper agent that builds one Ticket in its own [worktree](/learn/branches-and-worktrees), and calls tdd.

```checkpoint quick-7
You're building a Ticket with implement. Which Skill does it call to work test first?
- [x] tdd, wherever it can, to build the code test first.
- [ ] to-spec, to sketch a fresh set of seams for it.
- [ ] implement-spec, to give it an implementer subagent.
Why: implement builds a Spec or its Tickets test-first, then commits. For the test-first part, it calls tdd wherever it can.
```

## Going deeper

### Why it exists

You and your agent can agree on exactly what to build, and the code can still come out wrong. The agent can't tell, because it never saw the code run. Matt Pocock, who wrote the Skills in this flow, puts the problem this way: "Without feedback on how the code it produces actually runs, the agent will be flying blind."

The cure is a **feedback loop**: something the agent can run that fails when something's wrong and passes once it's fixed, such as a test. With one, the agent makes the change, runs the check, reads the output and fixes what broke. For automated tests, Matt calls a red-green-refactor loop critical. The refactor step came out later.

```checkpoint quick-8
Your agent needs a way to see whether its change worked. Which of these is a feedback loop?
- [x] A command that fails when something's wrong and passes once fixed.
- [ ] A note in the Ticket that says what the finished code should do.
- [ ] A promise from the agent that it read its own code before finishing.
Why: A feedback loop is something the agent can run that fails when something's wrong and passes once it's fixed. The agent runs it, reads the output and fixes what broke.
```

Red-green comes from **test-driven development (TDD)**: writing each test before its code. Matt's feelings about TDD are mixed. A failing test reminds a distracted person where they were, so TDD suits a very small working memory. Agents hold much more, so he thinks TDD aims at the wrong problem. What agents really need is feedback loops.

Even when he isn't using TDD directly, he often asks for **TDD evidence**: proof that the test would fail without the change. He still recommends his tdd Skill.

So the idea under test first is not only the order you write things in. It's also proof that a test can fail, and that your change is what turns it green.

### How it works underneath

The programmer Kent Beck wrote down what he says TDD actually is, which he calls Canon TDD:

1. Write a list of the test scenarios you want to cover.
2. Turn exactly one item on the list into a runnable test.
3. Change the code to make that test and all the earlier ones pass.
4. Optionally refactor to improve the implementation design.
5. Until the list is empty, go back to step 2.

Matt's tdd differs in two ways. It starts with seams agreed with you, not a list of scenarios. And it drops the refactor step, because agents almost never performed it, and because review and building work better as separate sessions. So Matt's red-green is not Canon TDD.

```checkpoint quick-9
You're about to use Matt's tdd on a new rule. What comes before the first test?
- [x] Agreeing the seams with you.
- [ ] Writing a list of test scenarios.
- [ ] Refactoring the code around it.
Why: Matt's tdd starts with seams agreed with you, not a list of scenarios, and it drops the refactor step.
```

Matt isn't troubled by the label: "Whether the result still counts as TDD by the book matters less than whether the loop produces better code."

```diagram
type: compare
caption: "Matt's red-green is not Canon TDD"
columns: ["Canon TDD", "Matt's tdd"]
rows:
  - label: "It starts with"
    cells: ["a list of the test scenarios you want to cover", "seams agreed with you"]
  - label: "Refactoring"
    cells: ["Optionally refactor to improve the implementation design", "not part of the loop"]
```

Why must red come first? A test you've only ever seen pass might pass whatever the code does. Seeing it fail for the right reason shows it can catch the problem. Matt adds a reason about agents: a failure the agent built first is very hard for it to cheat.

Anthropic's Claude Code guide says to ask for evidence as well: the command the agent ran and its output. A bare "All tests pass" tells you very little.

```checkpoint quick-10
Your agent reports: "All tests pass." What do you ask for next?
- [x] The command it ran and the output that came back.
- [ ] A longer summary of everything that it changed.
- [ ] A second message confirming that they all pass.
Why: A bare "All tests pass" tells you very little. Evidence is the command the agent ran and its output.
```

### A real example

In July 2026, on issue #479, a user reported a real run of [implement](/learn/implement). The agent made the code changes first and added the tests afterwards. The tests all passed, but the user saw the gap: "The resulting green suite did not demonstrate that the tests could detect the pre-fix behaviour."

```checkpoint quick-11
An agent writes the code, then adds tests that all pass. What hasn't been shown?
- [x] That the tests could detect the old behaviour.
- [ ] That the tests import the code without errors.
- [ ] That the new code passes the tests it now has.
Why: The tests came after the code, so a green run couldn't show they'd catch the old behaviour. Nothing had ever made them fail.
```

To get that proof back, they set the code changes aside and ran the new tests against the old code. That's TDD evidence, gathered by hand after the fact. It shows what red first gives you: a failure you can see before the fix exists.

### Where it goes wrong

**The code arrived before its test.** One agent, pushed on it, said it had "defaulted to my normal habit". The tdd Skill accepts this, because no instruction makes an agent comply every time. If a slice really matters, watch the run rather than trusting the Skill to enforce it.

```checkpoint quick-12
A slice really matters, and you know agents sometimes write code first. What do you do?
- [x] Watch the run, rather than trust the Skill to enforce it.
- [ ] Trust the Skill, as its rules stop code coming before tests.
- [ ] Reword the Skill, so that every agent has to comply with it.
Why: No instruction makes an agent comply every time, and the Skill accepts this. So for a slice that really matters, watch the run yourself.
```

**The test passes, but it could never fail.** Agents often write tests that restate the code. Matt's example is a test that "writes a constant and then it says expect this constant to be this value." That's a **tautological test**: one computing its expected value the same way the code does. Beck warns of a close cousin: copying the code's computed values into the test's expected values. So take expected values from somewhere else: a known-good literal, a worked example or the Spec.

```checkpoint quick-13
A test computes its expected value the same way the code does. How do you fix it?
- [x] Take the expected value from somewhere else, such as a worked example.
- [ ] Copy the value the code computes, and paste it into the test instead.
- [ ] Run the test once more, to confirm that the computed value is stable.
Why: That's a tautological test, and it could never fail. Copying the code's computed values is a close cousin. So the expected value has to come from somewhere else.
```

**The test went green, but its checks are gone.** Deleting `assert` lines makes a test pretend to pass. Beck lists that as a mistake, with a plain fix: "Make it pass for real."

**A batch of tests landed before any code.** That's horizontal slicing. Those tests check the shape of things rather than what a user sees. They stop noticing real changes, and they lock in a test structure before you understand the code. So go back to one test at a time.

**A browser test won't go green, and the agent blames the test.** A browser test drives a real web page. One user's agent wrote one first, re-ran it for a long time, then decided the test was broken. The feature didn't exist yet. Browser tests are slow enough that the red-green loop stops paying for itself. So say in your repo's `CLAUDE.md` that browser tests come after the behaviour works.

**You asked for red-green-refactor, and nothing got refactored.** The tdd Skill dropped its refactor step in June 2026. Its description and the README still say "red-green-refactor". Issue #589 on Matt's repo asks to fix the description. The phrase still loads the Skill, but what you get is red-green, so leave the tidying for review.

```checkpoint quick-14
You mention "red-green-refactor" and the tdd Skill loads. What do you get?
- [x] Red-green, with the tidying left for review.
- [ ] Red-green-refactor, since that name decides.
- [ ] Nothing, since that phrase no longer loads it.
Why: The Skill dropped its refactor step, but the old name lives on. The phrase still loads the Skill, and what you get is red-green.
```

### Try it

Add one small rule to the booking API, test first. You'll need your practice project (the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) creates it). It needs a FastAPI app in `api/`, with pytest, running in Docker Compose as a service called `api`. If your project doesn't have that yet, ask your agent to set it up first.

1. Run `docker compose exec api pytest`. You should see no failures.
2. Pick one rule. Leave creating a booking to [implement](/learn/implement)'s Try it. For example: `GET /bookings` returns an empty list when nobody has booked.
3. Ask your agent: "Which seams could test this rule? Say what each one catches and misses."
4. Agree the seam: the HTTP API in `api/`, not a private helper.
5. Ask for one test at that seam, and no code yet.
6. Run `docker compose exec api pytest`. You should see the new test fail: red.
7. Read the failure. The behaviour should be missing, rather than an import error or a typo.
8. Ask your agent to write only enough code to pass that test.
9. Run `docker compose exec api pytest` again. You should see it pass: green.
10. Ask for TDD evidence: the command it ran and its output, red before and green after.
11. Merge it all through a pull request. You should see the `test` check from [CI](/learn/what-ci-cd-is) pass. If not, add what's missing to `api/requirements.txt`.

### Read more

- [Canon TDD](https://newsletter.kentbeck.com/p/canon-tdd), Kent Beck, 2023-12-11
- [The /tdd Skill](https://www.aihero.dev/skills-tdd), Matt Pocock, updated 2026-08-24
- [AI Skills with Matt Pocock (video)](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer with Matt Pocock, 2026-09-17
- [AI Skills with Matt Pocock (episode notes)](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock), Gergely Orosz, 2026-09-17
- [Update the tdd skill description, issue #589](https://github.com/mattpocock/skills/issues/589), onur-aslan, 2026-07-16
- [/implement silently skips its /tdd and /code-review steps, issue #479](https://github.com/mattpocock/skills/issues/479), AlejandroFuentePinero, 2026-07-09
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic, read 2026-10-30
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29

## Remember

```flashcards
Q: What is the red-green loop?
A: Write a failing test first (red), then only enough code to pass it (green).

Q: In testing, what is a seam?
A: The public boundary you test at, where you see what the code does without reaching inside.

Q: What goes into one red-green cycle?
A: One seam, one test, and one minimal piece of code.

Q: What does Matt mean by "TDD evidence"?
A: Proof that a change does what it claims, because the test would fail without it. He asks for it even when the agent didn't write the test first.

Q: How does Kent Beck's Canon TDD differ from Matt's red-green?
A: Canon TDD starts with a written list of test scenarios and has an optional refactor step. Matt's tdd starts with agreed seams and leaves refactoring to review.

Q: Why should the agent build the failing test first?
A: A failure built first is very hard for an agent to cheat. One user found that when an agent wrote the code first, its green tests didn't show they could catch the old behaviour.
```

## Final test

```final-test test-first-horizontal
An agent writes twenty tests for a new FastAPI endpoint, then writes all the code. What went wrong?
- [x] The tests were written in bulk, so they check imagined behaviour.
- [ ] Too few tests. Twenty can't cover every edge case of an endpoint.
- [ ] The order. The code should come first, then the tests to match.
Why: That's horizontal slicing. With no finished cycle to learn from, those tests can only check what you imagined. One test and its code at a time lets each test respond to what the last cycle taught you.
```

```final-test test-first-agree-seams
When do you and your agent agree which seams to test?
- [x] Before the first test, and confirmed with you.
- [ ] After the first test passes, once the shape is clear.
- [ ] During code review, when the reviewer reads the tests.
Why: You can't test everything, so agreeing the seams first decides where the testing effort goes. No test is written at a seam nobody agreed to.
```

```final-test test-first-refactor
Where does refactoring belong?
- [x] In the review stage, not the red-green loop.
- [ ] Inside every red-green cycle, before the next test.
- [ ] Nowhere. Code that passes its tests is left as it is.
Why: The loop is only red, then green. Tidying code without changing what it does is a separate job, so refactoring waits for review.
```

```final-test test-first-deeper-tdd-evidence
What does Matt often ask an agent for, even when it isn't doing TDD directly?
- [x] TDD evidence, meaning proof that the test would fail without the change.
- [ ] A full list of test scenarios written down before any code, as in Canon TDD.
- [ ] A refactoring pass after every green test, so the design stays tidy.
Why: TDD suits a very small working memory, and agents hold much more. What they really need is feedback loops. So Matt asks for proof that the change is what turns the test green.
```

```final-test test-first-deeper-no-refactor-step
Kent Beck's Canon TDD has an optional refactor step. Why does Matt's tdd Skill leave it out?
- [x] Agents almost never did it, and review works better as a separate session.
- [ ] Kent Beck removed the refactor step from Canon TDD in his 2023 article.
- [ ] Refactoring would move the agreed seams, so tdd never changes working code.
Why: Agents almost never performed the step, and building and reviewing work better as separate sessions. So refactoring moved to the review stage. Canon TDD still lists "Optionally refactor" as step 4.
```

```sources
- [tdd: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/SKILL.md), Matt Pocock's Skills
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [mattpocock/skills README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [Enhance README by adding links to skill documentation and clarifying the purpose of feedback loops in AI development · mattpocock/skills@20861cb](https://github.com/mattpocock/skills/commit/20861cb0a186fdae2c3ae63926410659cfa0ace6), Matt Pocock, 2026-04-28
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer (Gergely Orosz) with Matt Pocock, 2026-09-17
- [AI Skills with Matt Pocock](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock), Gergely Orosz, 2026-09-17
- [Canon TDD](https://newsletter.kentbeck.com/p/canon-tdd), Kent Beck, 2023-12-11
- [The /tdd Skill](https://www.aihero.dev/skills-tdd), Matt Pocock, Updated Aug 24, 2026
- [Update "tdd" skill description to match documented workflow #589](https://github.com/mattpocock/skills/issues/589), onur-aslan, 2026-07-16
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [/implement silently skips its /tdd and /code-review steps (#479)](https://github.com/mattpocock/skills/issues/479), AlejandroFuentePinero, 2026-07-09
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [codebase-design: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/codebase-design/SKILL.md), Matt Pocock's Skills
```
