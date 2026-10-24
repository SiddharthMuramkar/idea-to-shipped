---
title: TDD
slug: tdd
order: 8
part: 2
image: /photos/tdd.jpg
imageAlt: A scientist in a white lab coat works at a lab bench full of instruments and cables.
imageCredit: ThisisEngineering
---

Make the agent prove each behaviour with a test it watched fail first, so the tests it leaves behind are ones you can trust.

```goals
- You'll be able to explain why an agent should write one failing test, then just enough code to pass it, instead of writing the code first or all the tests first.
- You'll be able to agree a seam with the agent before any test exists, weighing what a test there catches and what it misses.
- You'll be able to spot implementation-coupled, tautological and horizontally sliced tests, and say what a test may fake and what it never should.
- You'll be able to decide when to reach for `/tdd`, when to skip it, and where refactoring happens instead.
```

## Why it matters

You ask Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) to add a 2,000-character limit to the comment box on this site. It writes the code, then writes the tests: small programs that run your code with a known input and check the result. Every test passes. A week later a Visitor posts a 5,000-character essay and it goes straight in. One test checked that the limit was set to 2,000. It was. Nothing checked that the API (the code that receives and saves each comment) actually used it.

Nobody lied. The agent wrote the code first, so the tests described that code, gaps included. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, described this in an April 2026 workshop: an agent working in layers builds the whole implementation, then a layer of tests underneath that bends to fit it. He calls it cheating at the tests. (A Skill is a short instruction file the agent loads when you type its name, like `/tdd`, or when your request matches its description.)

Tests are an agent's feedback loop: the way it finds out whether its code works without you checking by hand. Matt's README quotes *The Pragmatic Programmer*: "The rate of feedback is your speed limit." In the same workshop he said the quality of those loops sets the ceiling on how good an agent's code can get.

The `tdd` Skill fixes the order. The agent writes the test first, watches it fail, and only then writes the code. ==A test written before the code can't bend to fit it.==

## The idea: red, then green, one slice at a time

TDD stands for test-driven development: you write each test before the code it tests. A test runner (a program such as Vitest that runs your tests and reports the results) shows a failing test in red and a passing one in green, which gives the loop its name:

1. **Red.** Write one test for one behaviour that doesn't exist yet. Run it and watch it fail.
2. **Green.** Write only enough code to make that test pass. Nothing for the test after next, no extra features.
3. **Repeat** with the next behaviour.

Why insist on seeing red? A test you've never seen fail might not be checking anything. If it fails while the behaviour is missing, then passes once the code exists, and the test itself didn't change in between, you have real evidence. ==A test that goes red, then green, is hard to fake.==

Each cycle is a **vertical slice**: one behaviour, one test, one small piece of code. The Skill calls each one a **tracer bullet**: a thin slice that proves one path works end to end, so the next cycle can respond to what this one taught you.

Classic TDD has a third step: refactor (tidy the code without changing what it does). ==Matt's Skill has no refactor step.== In March 2026, while the step still existed, Matt said it hadn't worked well: agents are reluctant to change code still sitting in their own context window (their working memory for the conversation). Version 1.1 (July 2026) dropped it, and refactoring now happens at review, in the `code-review` Skill, with a fresh context. The Skill's description still says "red-green-refactor" (open issue #589); the phrase still triggers it, but you get red, then green.

```scene terminal
title: Red, then green, on this site's comment API (illustrative)
# The agent writes one test for the length limit and runs it before writing the check.
$ npx vitest run src/app/api/comments
× a body of exactly 2000 characters is fine, 2001 is rejected
AssertionError: expected 201 to be 400
Tests  1 failed (1)
# Red, for the right reason: the API saved a 2001-character Comment. It adds one length check and nothing else.
$ npx vitest run src/app/api/comments
✓ a body of exactly 2000 characters is fine, 2001 is rejected
Tests  1 passed (1)
# Green. Only now does the next test appear: a blank Comment. It fails first too.
$ npx vitest run src/app/api/comments
✓ a body of exactly 2000 characters is fine, 2001 is rejected
× an empty or blank body is rejected with 400
Tests  1 failed | 1 passed (2)
# Just enough code to reject blanks, and both pass. One slice at a time, each seen red first.
$ npx vitest run src/app/api/comments
✓ a body of exactly 2000 characters is fine, 2001 is rejected
✓ an empty or blank body is rejected with 400
Tests  2 passed (2)
```

```checkpoint green-first-run
On a book-club site, the agent writes a test for "a member can't vote twice", runs it, and it passes straight away. No code has changed yet. What's the right reaction?
- [ ] Good news: one fewer step, so move on to the next behaviour.
  > A test you've never seen fail proves nothing yet. It may not be checking what its name says.
- [x] Find out why: the rule may exist, or the test checks nothing.
  > Right. Say so honestly, then break the behaviour on purpose and confirm the test goes red.
- [ ] Delete the test, since the loop only allows tests that start out red and then turn green.
  > The test might be fine. The point is to prove it can fail, not to throw it away.
- [ ] Write the code anyway, so the loop stays in order.
  > Writing code for a behaviour that may already exist adds risk without adding evidence.
```

## Seams: agree where tests go first

Before the first red, one question decides whether the tests are worth keeping: where do they go?

Code is split into modules (files or folders that each do one job), and each module has an interface: the functions it exports for the rest of the code to call. The Skill calls the place you test at a **seam**: the public boundary where you can watch behaviour from outside without reaching inside. Think of it as the module's front door: tests knock there, and never climb in through a window.

The Skill's firmest rule: ==no test is written at a seam you haven't agreed.== Before any test exists, the agent writes down the seams it proposes and waits for your OK. In the 1.3.1 plugin, each proposed seam comes with a one-line note on what it catches and what it misses; if yours doesn't, ask for one. You can't test everything, so agreeing seams up front spends the effort on the paths that matter instead of on every edge case.

Take this site's comment API. Its route handler answers requests to `POST /api/comments` and saves a Comment. Here are two seams you could test at:

| Seam | Catches | Misses |
|---|---|---|
| The route handler, called with a real request against a real test database | What a Visitor gets back: status codes, error messages, broken input, whether the Comment is saved | How the comment box shows those errors |
| The validation function inside the comments module | The rules themselves, slightly faster | Whether the route uses them, and what a Visitor sees |

The higher seam catches more per test, and this site's API tests all use it. Matt's `to-spec` Skill, which writes a spec (a written description of what to build), has the same instinct: prefer existing seams, pick the highest one you can, ideally just one. In the full Main flow (the path most work takes, from idea to shipped), the spec agrees the seams before any code exists. Run `/tdd` on its own and it asks you.

```checkpoint seam-before-tests
You type `/tdd` and ask for a "save a recipe to favourites" feature. The agent lists two places it could test, notes what each catches and misses, then stops. What is it waiting for?
- [x] Your answer on where the tests go.
  > Right. No test is written at an unconfirmed seam. Pick one, or ask a follow-up about the trade-offs first.
- [ ] Permission to install a test runner.
  > It hasn't got as far as running anything. This pause comes before any test exists.
- [ ] Your full list of every test it should write.
  > It picks the tests itself, one slice at a time. What it needs from you is where they go.
- [ ] A go-ahead for its refactor plan.
  > There's no refactor step in the loop. Refactoring happens later, at review.
```

## A session, step by step

Here's a short session (one Claude Code conversation) that adds a rule to the comment API: no links in v1. It runs inside the site's repo, its project folder tracked with Git, so the agent reads `GLOSSARY.md`, the project's list of agreed terms, and uses words like Comment in test names.

```scene chat
title: Adding a no-links rule to the comment API (illustrative)
# You type the Skill and the behaviour you want.
you: `/tdd` Comments can't contain links in v1. Reject any body with `http://` or `https://` in it, with a clear error.
# Before any test exists, it proposes seams, each with what it catches and misses, and waits.
agent: I read GLOSSARY.md and the existing tests. Proposed seams: **1. The `POST /api/comments` route** (existing seam): catches what a Visitor gets back; misses how the comment box shows it. **2. The validation function**: catches the rule, slightly faster; misses whether the route uses it. Which should we test?
# You pick the seam. That's a decision for you, not a detail.
you: 1, the route.
# Red: one test, run before any code changes. It fails for the right reason.
agent: Test: "a Comment containing a link is rejected with 400". Ran it: expected 400, got 201. That's red.
# Green: only enough code to pass, nothing for future tests.
agent: Added one check in the comments module. The new test passes, and so do the existing ones.
# Next slice, next red. The second test only appears once the first is green.
agent: Next: "a link in the name is rejected too". Ran it: it fails, because names aren't checked. Added the check: green.
# It stops without a tidy-up pass. That belongs to review.
agent: Done: two tests, each seen red, then green. Any tidying is for code review.
```

You made one decision, the seam. The agent did the rest, and you followed along by watching red turn green.

## Good tests and the three bad ones

A good test checks behaviour through the public interface, reads like a line of the spec, survives refactors and makes one logical claim. This site has one called "a body of exactly 2000 characters is fine, 2001 is rejected": the name alone tells you what the API promises. Its expected values come from the spec, not the code: the test types 2000 and 2001 itself instead of reading the limit out of the code.

The Skill names three ways tests go wrong:

- **Implementation-coupled.** The test checks how the code works instead of what it does: it fakes the module's own internal parts, tests private functions, counts calls, or checks through a side channel, like querying a database table directly instead of reading the data back through the interface. The tell: ==it breaks when you rename something, though nothing a user sees has changed.== In a September 2026 conference talk about reviewing agents' code, Matt showed an agent-written test that read a page's source file to check that one section came after another.
- **Tautological.** The expected value is worked out the same way the code works it out, or a constant is checked against itself. It passes by construction and can never disagree with the code. Matt's example from the same talk: a test that the character limit for a post on X equals 280.
- **Horizontal slicing.** All the tests first, then all the code. Tests written in bulk describe imagined behaviour, check the shape of things rather than what a user does, and lock in a test structure before anyone knows what the code will look like.

Here's the opening story's tautological test next to a real one:

```ts
// Tautological: restates the code, so it can never disagree with it
expect(MAX_BODY).toBe(2000);

// Behaviour at the seam, with the number taken from the spec
const res = await post({ lesson: "grilling", body: "x".repeat(2001) });
expect(res.status).toBe(400);
```

The first passes even if the API never checks the length. The second fails until it does.

```checkpoint name-the-smell
A recipe site has `scale(recipe, servings)`. The agent's test works out `const expected = recipe.flour * (8 / recipe.servings)`, then checks `expect(scale(recipe, 8).flour).toBe(expected)`. What's wrong with it?
- [ ] It's implementation-coupled, because it calls `scale` directly.
  > Calling the public function is exactly right. That's the seam.
- [ ] Nothing: it uses the same formula, so it's precise.
  > The same formula is the problem. If the formula is wrong, the test is wrong in the same way and still passes.
- [ ] It's horizontal slicing, because it only tests flour.
  > Horizontal slicing means writing all the tests before any code. One thing per test is good.
- [x] It's tautological: it recomputes the answer.
  > Right. Use a worked example instead: 200 g of flour for 4 servings should become 400 g for 8.
```

## Fake only at the edges

You don't want every test run to send a real email or charge a real card, so sometimes a test swaps in a mock (also called a fake): a stand-in that gives canned answers. The Skill's rule is short: ==fake only at system boundaries==, where your code meets something you don't control.

| Fake it | Never fake it |
|---|---|
| Outside services, like payments or email | Your own modules |
| Time and randomness | Internal helpers |
| Sometimes the database (a real test database is better) | Anything else you control |
| Sometimes the filesystem | |

Fake your own code and the test checks the fake. Matt's talk showed a test that faked a browser audio feature so thoroughly it could never fail, while the real feature had error cases that would only show up in production.

Two habits make the edges easy to fake:

- **Pass dependencies in** rather than creating them inside the function (dependency injection). This site's Lessons module is built from a folder you hand it, so its tests hand it small folders of fake Lessons instead of the real course.
- **One function per outside operation**, like `getUser` and `createOrder`, instead of one general-purpose fetch wrapper, so each fake returns one simple shape.

This site goes a step further. A decision record (an ADR) says the tests always use a real Postgres database on a separate test branch, because a faked database can pass when the real query would fail.

```checkpoint what-to-fake
Your gym app sends a welcome text through an outside SMS service when someone signs up. You're testing "sign-up sends a welcome text". What should the test fake?
- [ ] The app's own sign-up module, so the test runs fast.
  > That's your own code. Fake it and the test only checks the fake.
- [ ] The function that formats the message text.
  > That's an internal helper you control. Let it run for real.
- [x] The SMS service, passed into sign-up as a dependency.
  > Right. It's a boundary you don't control, and you don't want real texts going out on every run.
- [ ] Nothing: let the test send a real text to a test number.
  > Real texts on every run are slow, cost money and depend on someone else's service.
```

## When to reach for it

Reach for `/tdd` when there's a concrete behaviour with an input and an output you can observe: a validation rule, a calculation, a transformation, what an API returns. `tdd` is a model-invoked Skill: you can type `/tdd`, and the agent may also load it on its own when you ask to build something test-first. (User-invoked Skills only start when you type their name.)

| Your situation | Reach for |
|---|---|
| A behaviour with clear inputs and outputs | `/tdd` |
| You're not sure yet what should happen | [Grilling](/learn/grilling) first, then `/to-spec` |
| The real question is the interface's shape | `/codebase-design` |
| A spec or tickets you want built | `/implement`, which drives `tdd` for you |
| Styling, config, wiring, pass-through code | Probably no test: check it by eye |
| A browser test for a feature that doesn't exist yet | Not first: it makes the loop too slow |

The fifth row is your call: the Skill decides where seams go, not whether a change deserves the loop (a request for that, issue #746, was closed as not planned). A test of a colour or a config value has no independent answer to check, so it just restates the code. Put rules like "browser tests come after the behaviour works" in your project's `CLAUDE.md`, a file of standing instructions the agent reads at the start of every session.

`tdd` is a reference, not a driver: it holds the rules, and something else runs the session. That's you, or `/implement`, which builds a ticket (a small task sized for one session) by calling `tdd` at the agreed seams, then closes out with `code-review`. See [Implement](/learn/implement) and [Code review](/learn/code-review). Claude Code has a Built-in command (one that comes with Claude Code itself) also called `/code-review`, so type `/mattpocock-skills:code-review` to get Matt's.

No instruction is followed every time; the Skill's docs admit the agent sometimes writes code before the test. If strictness matters for a slice, watch the run.

## How Matt and others use it

**Matt Pocock** called good TDD the most consistent way he has improved what agents produce (March 2026). Some habits, from his videos:

- **TDD is in his standing prompt.** In his April 2026 workshop, the prompt for his unattended loop says: explore the repo, use TDD, then run the feedback loops (tests and type checks). As it ran, he pointed out the agent confirming red before going green.
- **He reads the tests first.** Reviewing that run, he said he'd check the tests were testing reasonable things before reading the code.
- **He shapes the codebase around testing.** He said he'd warped his whole technique around making TDD work: in a badly structured codebase nobody knows where the test boundaries go, while modules that hide a lot behind a small interface have clear seams. See [Architecture](/learn/architecture).
- **He doesn't force everything through it.** He finds front ends hard to test, so in the workshop the tests covered the service behind the page.
- **He enforces test quality at review.** In the September talk he argued that an implementing agent already has too much to do, so standards belong in a separate review with its own context: make it work, then make it good.

**Other developers:**

- A developer posting as Warshoow ran Matt's Skills unattended and checked 173 session transcripts (September 2026). `tdd` was never called. His fix was to name it in full: `/mattpocock-skills:tdd`.
- In October 2026, Colin Eberhardt, CTO of the consultancy Scott Logic, rebuilt an app with Matt's Skills. `/implement` ran red-green TDD and the reviews caught real bugs, but the generated tests mostly checked their own mocks.
- On Reddit in July 2026, one developer called `tdd` expensive but worth it for tickets that need heavy validation; another uses it on almost everything.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)).

1. In your terminal, make an empty folder and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir reading-time && cd reading-time && claude
```

2. Type a slash and then tdd. If `tdd` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode is off: if you see "plan mode on" under the prompt box, press Shift+Tab until it changes.
4. Type this:

```text
/tdd In this empty folder, set up the smallest project you can with a language and test runner already installed on this machine. Then build readingTime(text) for a Lesson page: whole minutes at 200 words per minute, rounded up, never less than 1. Before writing any test, propose the seam you'd test at, with what it catches and misses, and wait for my OK.
```

5. When it proposes a seam, reply: "Yes, test through readingTime itself." If it asks what to cover, offer: empty text takes 1 minute, 200 words take 1, 201 take 2.
6. If it asks permission to create files or run tests in this folder, choose Yes. Watch each test fail before its code appears.
7. When it's done, type: "Rewrite the inside of readingTime a different way, without changing what it returns, then run the tests."
8. Press Esc at any point to stop it. Type `/exit` when you're done.

**It's working if:**

- [ ] It proposed a seam, with what it catches and misses, and waited before any test file existed.
- [ ] Tests appeared one at a time, and you saw each fail before the code to pass it was written.
- [ ] Test names describe behaviour ("201 words take 2 minutes"), not internals.
- [ ] Expected values are plain numbers you could work out by hand, like 2, not the formula again.
- [ ] Nothing was faked.
- [ ] The rewrite broke no tests.
- [ ] It didn't add a refactoring pass at the end.

If it writes a batch of tests at once, say: "One test at a time: red, then green." If it never stops to agree a seam, the Skill may not have loaded: send the same request again starting with `/mattpocock-skills:tdd`.
````

## Common mistakes

- **Picking a seam blind.** If a proposal doesn't say what each seam catches and misses, ask before you answer.
- **Trusting a test you never saw fail.** Green on the first run proves nothing yet.
- **Expecting `tdd` to know about other tickets.** It sees the one you give it. Pass the spec too if a slice depends on its neighbours.
- **The traps covered above:** expecting a refactor step, letting tests arrive in a batch, faking your own code, and testing styling or glue.

```site-story
I typed `/tdd` four times while building the first version of this site, once per ticket.

| Ticket | Where the tests went | Result |
|---|---|---|
| 03 Lesson pages | The Lessons module's public functions, fed folders of fake Lessons | 7 tests; pages checked by eye |
| 04 Comments table | None, by agreement: no public entry point yet | Checked the table existed on every database branch |
| 05 Comments API | `GET` and `POST /api/comments`, against the real Neon `test` database | 12 tests, including 2000 vs 2001 characters and broken JSON |
| 06 Comment box | None, by agreement: its logic lives in the tested API | Checked by eye on the preview |

**Tests can be dangerous.** Mine empty the comments table before each one. So a setup file refuses to run unless the database address comes from `.env.test.local`, which points at the test branch.

**Green on the first run proves nothing.** I learned to say so when a test passed straight away, rather than pretend it had gone red.

**Passing isn't the same as correct.** Later, Matt's two-axis review (`/mattpocock-skills:code-review`) found a crash none of my 19 tests had tried: sending a number instead of text as the comment returned a 500 error. I fixed it test-first. A red test reproduced `.trim is not a function`, all the input checks moved into the comments module, and it went green. That made 20.

**For the redesign, the spec named one seam:** the Lessons module, through its public functions, with folders of fake Lessons. The look was checked with screenshots, not tests. The ticket said "Build the Lessons module change with `/tdd`", and it ended with 11 Lessons-module tests, including one that fails loudly when a Lesson file is missing its photo.

What I took away: deciding *where* to test mattered more than testing everything.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Start | `/tdd <the behaviour you want>`, or `/mattpocock-skills:tdd` |
| It proposes seams | Pick the highest one that catches what matters; ask what each misses |
| Each cycle | One failing test, seen red, then just enough code to turn it green |
| Expected values | Numbers from the spec or a worked example, never the code's own formula |
| Faking | Only outside services, time and randomness; a real test database if you can |
| After green | No refactor: that's review's job |
| Skip it | Styling, config, glue; browser tests come later |
| A whole spec or set of tickets | `/implement`, which drives `tdd` for you |

## Final test

```test scenario-seam-choice
You're adding discount codes to a shop's checkout with `/tdd`. The agent proposes two seams: the public `checkout(cart, code)` function, which catches the total a customer pays but misses how the page shows it, or the private `parseCode` helper, which catches how codes are read but misses whether checkout applies them. Which do you pick?
- [ ] `parseCode`, because smaller functions make more precise tests.
  > Precise, but it reaches inside. A rename breaks it, and it can't tell you whether customers pay the right total.
- [ ] Both, plus a test for every helper in the checkout module.
  > You can't test everything. Seams are agreed so the effort lands on what matters.
- [x] `checkout`, the public seam that shows what the customer pays.
  > Right. It's the higher seam, it survives refactors, and it catches the behaviour a customer cares about.
- [ ] Neither, until a browser test of the checkout page exists.
  > Browser tests make the loop too slow to pay off. They come after the behaviour works.
```

```test scenario-clock
Your to-do app hides tasks finished more than 30 days ago. You're writing the test "a task finished 31 days ago is hidden". What should the test fake?
- [ ] The to-do module's own filter function.
  > That's your code, the thing under test. Fake it and the test checks nothing.
- [ ] Nothing: create a task and wait 31 days.
  > Real waiting makes the test useless. Time is a boundary you're allowed to fake.
- [ ] The database, always, so that the test runs a lot faster.
  > A real test database is preferred where you can have one. Time is the problem here.
- [x] The clock, passed in so the test can set "today".
  > Right. Time is a system boundary. Pass the clock in and the test can jump 31 days in a millisecond.
```

```test scenario-no-refactor
After each green, the agent goes straight to the next failing test without tidying the code. The Skill's description mentions "red-green-refactor". What's going on?
- [ ] The Skill failed to load, so reinstall Matt's Skills.
  > It's working as designed. The description is just out of date.
- [x] Nothing's wrong: refactoring moved to review.
  > Right. Version 1.1 dropped the refactor step. Agents did it poorly with their own code in context; a separate review does it better.
- [ ] It skipped a step, so remind it to refactor every cycle.
  > There's no refactor step to skip. Tidying belongs to review, with a fresh context.
- [ ] It's saving the refactoring for one big pass at the end.
  > There's no end-of-loop pass either. Refactoring happens at review.
```

```test scenario-tickets
You've grilled a feature, written a spec with `/to-spec` and split it into four tickets with `/to-tickets`. What do you type to build the first ticket?
- [x] `/implement`, which calls `tdd` at the agreed seams
  > Right. `/implement` runs the session, drives `tdd` for the ticket, then closes out with a review.
- [ ] `/tdd`, pasting in the whole spec
  > `tdd` holds the loop's rules but doesn't run a ticket's whole build. `/implement` drives it for you.
- [ ] `/mattpocock-skills:code-review`, to set standards before coding
  > Review comes after the code exists. It reviews the changes, not a plan.
- [ ] `/to-spec` again, to add the test cases
  > The spec is done, and its seams are agreed. Tests get written during the build.
```

```test scenario-skip
You're changing your site's accent colour from royal blue to teal, a one-line edit in a CSS file. Should you run `/tdd`?
- [ ] Yes: every change needs a failing test first.
  > The Skill decides where tests go, not whether a change deserves one. That call is yours.
- [x] Probably not: nothing independent to test.
  > Right. A test that the colour is teal just restates the code. Check it by eye instead.
- [ ] Yes, with the stylesheet faked at the boundary.
  > Your stylesheet isn't a system boundary, and faking it would test the fake.
- [ ] Yes, starting with a browser test of the colour.
  > Browser tests first make the loop too slow, and this one would still just restate the code.
```

```test spot-tautological
A shipping test says `expect(shippingCost(parcel)).toBe(parcel.kg * RATE_PER_KG)`. Spot the mistake.
- [ ] It should fake `shippingCost` so it runs faster.
  > `shippingCost` is the code under test. Faking it means testing nothing.
- [ ] It makes more than one logical assertion.
  > It makes one. The problem is where the expected value comes from.
- [x] It works out the answer the way the code does.
  > Right. It's tautological, so it passes even if the formula is wrong. Use a worked example from the price list instead.
- [ ] It's horizontal slicing, because it covers one parcel.
  > Horizontal slicing means writing all the tests before any code. One case per test is fine.
```

```test spot-side-channel
A test named "createUser saves the user" calls `createUser({ name: "Alice" })`, then runs a SQL query against the users table to check the row is there. Spot the mistake.
- [x] It checks through a side channel, not the interface.
  > Right. Read the user back through the public interface, like `getUser(id)`, so a table change can't break a working feature.
- [ ] It should fake the database instead of using a real one.
  > A real test database is the preferred option. The problem is how the test checks the result.
- [ ] It's tautological, because it checks a value it just set.
  > "Alice" is an independent literal. The problem is the route the test takes to check it.
- [ ] It tests too little: it should check every column.
  > More columns would tie it even more tightly to the table.
```

```test spot-batch
Asked to build a password-strength checker with `/tdd`, the agent writes 15 tests in one go, then all the code, and every test passes. Spot the mistake.
- [ ] Fifteen tests is too many for one feature.
  > The count isn't the problem; the order is.
- [ ] It should have written the code first, then the tests.
  > Code first lets the tests bend to fit the code, which is what the loop prevents.
- [ ] Nothing: all the tests pass, so the work is done.
  > Tests written in bulk can describe imagined behaviour, and nobody saw any of them fail.
- [x] It wrote them in bulk, not one at a time.
  > Right. That's horizontal slicing. One test, red, just enough code, green, then the next.
```

```test sequence-loop
You give `/tdd` a new behaviour to build in your project. Which order matches the Skill?
- [ ] Write every test → write all the code → refactor → agree the seams
  > That's horizontal slicing with a refactor step the Skill doesn't have, and the seams come far too late.
- [ ] Agree the seam → write the code → write a test → see it pass
  > Code before the test lets the test bend to fit it. And a test you only ever see pass proves little.
- [ ] One failing test → agree the seam → refactor → just enough code
  > No test is written before the seam is agreed, and there's no refactor step in the loop.
- [x] Agree the seam → one failing test → just enough code → next test
  > Right. Seam first, then red, then green, one slice at a time. Refactoring waits for review.
```

```test why-test-first
A friend says: "I let the agent write the code, then ask it for tests at the end. Same result, fewer steps." What's the strongest reply?
- [x] "Tests written after the code tend to fit it, bugs included."
  > Right. A test that fails before the code exists, then passes, is evidence. One written afterwards may just describe what's there.
- [ ] "Tests written afterwards run more slowly than tests written first."
  > Speed has nothing to do with when a test was written.
- [ ] "Agents can't write tests at all unless the Skill is loaded."
  > They can. They just tend to write tests that fit the code they already wrote.
- [ ] "Writing tests first means you never need a code review."
  > Review still matters: it's where refactoring and standards checks happen.
```

```sources
- [tdd SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md), with [tests.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/tests.md) and [mocking.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/mocking.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [to-spec SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md) (seams in the spec), [implement SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md) (drives tdd) and [codebase-design SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/SKILL.md) (seam): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/main/README.md) ("The Code Doesn't Work"; user-invoked vs model-invoked): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /tdd Skill](https://www.aihero.dev/skills-tdd), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [mattpocock/skills release v1.1.0](https://github.com/mattpocock/skills/releases/tag/v1.1.0) (refactor step dropped, seams introduced), 2026-07-08; issues [#589](https://github.com/mattpocock/skills/issues/589), [#607](https://github.com/mattpocock/skills/issues/607) and [#746](https://github.com/mattpocock/skills/issues/746), read 2026-10-23.
- [5 Claude Code skills I use every single day](https://www.youtube.com/watch?v=EJyuu6zlQCg), Matt Pocock, 2026-03-16 (TDD as his most consistent lever 9:24–9:52; the weak refactor step 11:37–11:59; TDD needs clear module boundaries 12:05–12:27).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (TDD in the loop prompt 57:21–57:31; confirming red, cheating in layers, warping his technique 66:42–68:34; feedback loops as the ceiling 69:51–70:30; front ends and reading tests first 71:03–71:30).
- [How To De-Slop A Codebase Ruined By AI](https://www.youtube.com/watch?v=3MP8D-mdheA), Matt Pocock, 2026-04-29 (seams as where tests go, 3:45–4:40).
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock at AI Engineer Paris, 2026-09-25 (tautological, structure-bound and unfailable tests 5:24–7:55; deep modules 8:40–9:30; standards at review, not implementation 11:35–14:00; checked on an auto-translated track).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [afk.sh: unattended runs and skills that never fired](https://github.com/mattpocock/skills/discussions/1136), GitHub Discussion #1136, 2026-09-28.
- [r/AskVibecoders thread on Matt's Skills](https://www.reddit.com/r/AskVibecoders/comments/1uzzmkh/), 2026-07-18.
```
