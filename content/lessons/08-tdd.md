---
title: TDD
slug: tdd
order: 8
part: 2
---

Make the agent prove each behaviour with a test it watched fail first, so the tests it leaves behind are ones you can trust.

```goals
- You'll be able to explain why an agent should write one failing test, then only the code that makes it pass, instead of writing the code first or all the tests first.
- You'll be able to agree a seam with the agent before any test exists, weighing what a test there catches and what it misses.
- You'll be able to spot implementation-coupled, tautological and horizontally sliced tests, and say what a test may fake and what it never should.
- You'll be able to decide when to reach for `/tdd`, when to skip it, and where refactoring happens instead.
```

## Why it matters

You ask Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) to add a 2,000-character limit to this site's comment box. It writes the code, then the tests: small programs that run your code with a known input and check the result. Every test passes. A week later a Visitor (anyone reading the site) posts a 5,000-character essay and it goes straight in. One test checked that the limit was set to 2,000. It was. Nothing checked that the API (the code that receives and saves each Comment) actually used it.

Nobody lied. The agent wrote the code first, so the tests described that code, gaps included. Matt Pocock, a developer and teacher, publishes a popular set of Skills for Claude Code. A Skill is a short instruction file the agent loads when you type its name, like `/tdd`, or when your request matches its description (see [Skills](/learn/skills)). In an April 2026 workshop Matt described the habit: an agent working in layers writes the whole implementation, then a whole layer of tests for it, and tends to cheat at the tests.

Tests are an agent's feedback loop: the way it finds out whether its code works without you checking by hand. In the same workshop Matt said the quality of those loops sets the ceiling on how good an agent's code can get.

The `tdd` Skill fixes the order. The agent writes the test first, watches it fail, and only then writes the code. ==A test written before the code can't bend to fit it.==

## The idea: red, then green, one slice at a time

TDD stands for test-driven development: you write each test before the code it tests. A test runner (a program such as Vitest that runs your tests and reports the results) shows a failing test in red and a passing one in green, which gives the loop its name:

1. **Red.** Write one test for one behaviour that doesn't exist yet. Run it and watch it fail.
2. **Green.** Write only enough code to make that test pass. Nothing for the test after next, no extra features.
3. **Repeat** with the next behaviour.

Why insist on seeing red? A test you've never seen fail might not be checking anything. If it fails while the behaviour is missing, then passes once the code exists, and the test itself didn't change in between, you have real evidence. ==A test that goes red, then green, is hard to cheat.==

Each cycle is a **vertical slice**: one behaviour, one test, one small piece of code. The Skill calls each test a **tracer bullet** (the idea from [Spec + tickets](/learn/spec-and-issues), shrunk to one test): it shows where your shots land, so the next cycle can learn from it.

Classic TDD has a third step: refactor (tidy the code without changing what it does). ==Matt's Skill has no refactor step.== In March 2026 Matt said agents are reluctant to change code still sitting in their own context window (their working memory for the conversation), and version 1.1 of his Skills (July 2026) dropped the step. Tidying now belongs to review: the `code-review` Skill has helper agents with fresh context windows check the finished changes and flag what to fix. The `tdd` description still mentions "red-green-refactor" (open GitHub bug report #589), and the phrase still triggers it; you just get red, then green.

```scene terminal
title: Red, then green, on this site's comment API (illustrative)
# You and the agent have already agreed where the test plugs in (a seam; more on those below): the comments route, the code that runs when a new Comment arrives. The agent writes one test for the length limit and runs it before writing the check.
$ npx vitest run src/app/api/comments
× a body of exactly 2000 characters is fine, 2001 is rejected
AssertionError: expected 201 to be 400
Tests  1 failed (1)
# Red, for the right reason: the API answered with status code 201 ("saved") where the test expected 400 ("rejected"). It adds one length check and nothing else.
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

Code is split into modules (pieces that each do one job), and each module has an interface: what the rest of the code must know to use it, mostly the functions it exports and what they promise. The Skill calls the place you test at a **seam**: the public boundary where you can watch behaviour from outside without reaching inside.

The Skill's firmest rule: ==no test is written at a seam you haven't agreed.== Before any test exists, the agent writes down the seams it proposes and waits for your OK. Each should come with a short note on what a test there would catch and miss. Testing effort is limited, so settling seams first puts it on the paths that matter, not on every edge case.

Take this site's comment API. Its route handler (the function that runs when the comment box sends a new Comment to `POST /api/comments`) hands it to the comments module, which checks it and saves it. Here are two seams you could test at:

| Seam | Catches | Misses |
|---|---|---|
| The route handler, called with a real request against a real test database | What a Visitor gets back: status codes, error messages, broken JSON (garbled request data), whether the Comment is saved | How the comment box shows those errors |
| The comments module's `postComment` function, one layer down | The rules, and whether the Comment is saved | Status codes, broken JSON and what a Visitor sees |

The higher seam catches more per test, and this site's API tests use it. Matt's `to-spec` Skill, which writes a spec (a written description of what to build), has the same instinct: prefer existing seams to new ones, the highest you can, ideally one. In the full Main flow (the path most work takes, from idea to shipped), you agree the seams while `/to-spec` writes the spec. Later, `/implement`, the Skill that builds the work, calls `tdd` at those seams, so there's little left to confirm.

```checkpoint skipped-seam
You type `/tdd` and ask for a "save a recipe to favourites" feature. The agent's first reply is a new test file, already run and failing. Which of the Skill's required steps has it skipped?
- [x] Agreeing with you which boundary to test.
  > Right. No test is written at a seam you haven't agreed. Press Esc and ask for its proposed seams, with what each catches and misses.
- [ ] Planning the refactor that follows each green.
  > This loop has no refactor step: tidying belongs to review. What it missed comes before any test.
- [ ] Listing every edge case the tests will cover.
  > The Skill doesn't aim at every edge case. Agreeing seams first is what puts the effort on the paths that matter.
- [ ] Checking the runner with a test that passes.
  > A test you've only seen pass proves nothing. Starting red is right; the missing step comes before any test.
```

## A session, step by step

Here's a short session (one Claude Code conversation) that adds a rule to the comment API: no links in v1. It runs inside the site's repo, its project folder tracked with Git (a tool that records every change), so the agent reads `GLOSSARY.md`, the project's list of agreed terms, and uses words like Comment in test names.

```scene chat
title: Adding a no-links rule to the comment API (illustrative)
# You type the Skill and the behaviour you want.
you: `/tdd` Comments can't contain links in v1. Reject any Comment whose body or name contains `http://` or `https://`, with a clear error.
# Before any test exists, it proposes seams, each with what it catches and misses, and waits.
agent: I read GLOSSARY.md and the existing tests. Proposed seams: **1. The `POST /api/comments` route** (the API tests already use it): catches what a Visitor gets back; misses how the comment box shows it. **2. The comments module's `postComment`**, one layer down (no tests there yet): catches the rule and the save; misses status codes and what a Visitor sees. Which should we test?
# You pick the seam. That's a decision for you, not a detail.
you: 1, the route.
# Red: one test, run before any code changes. It fails for the right reason.
agent: Test: "a body containing a link is rejected with 400". Ran it: expected 400, got 201. That's red.
# Green: only enough code to pass, nothing for future tests.
agent: Added one check in the comments module. The new test passes, and so do the existing ones.
# Next slice, next red: the other half of your rule. It only appears once the first test is green.
agent: Next: "a name containing a link is rejected too". Ran it: it fails, because only the body is checked so far. Extended the check: green.
# It stops without a tidy-up pass. That belongs to review.
agent: Done: two tests, each seen red, then green. Any tidying is for code review.
```

## Good tests and the three bad ones

A good test checks behaviour through the public interface, reads like a line of the spec, survives refactors and makes one logical claim. This site has one called "a body of exactly 2000 characters is fine, 2001 is rejected": the name alone tells you what the API promises. Its inputs (2000 and 2001 characters) and what it expects back (saved with 201, rejected with 400) all come from the spec, not from the code.

The Skill names three ways tests go wrong:

- **Implementation-coupled.** The test checks how the code works instead of what it does: it swaps the module's own parts for fakes (stand-ins with canned answers; more below), tests private functions (ones the module keeps to itself), counts how often something was called, or checks through a side channel, like querying a database table directly instead of reading the data back through the interface. The tell: ==it breaks when you restructure the code, though nothing a user sees has changed.== Matt's September 2026 conference talk on reviewing agents' code showed one that read a page's source file to check one section came after another.
- **Tautological.** The expected value comes from the code, not from an independent source like the spec. Worked out the way the code works it out, it passes by construction and can never disagree. Copied from a constant (a named, fixed value like `MAX_BODY = 2000`), it checks a number, not a behaviour: Matt's example from the same talk was a test that the constant for X's (Twitter's) post limit equals 280. That passes even if nothing enforces the limit.
- **Horizontal slicing.** Every test first, then all the code: a layer at a time. Such a batch describes imagined behaviour, tests how things are shaped instead of what a user does, and fixes a test structure too early.

Here's the opening story's tautological test next to a real one:

```ts
// Tautological: restates the code's own constant, so it passes whatever the API does
expect(MAX_BODY).toBe(2000);

// Behaviour at the seam, with the number taken from the spec
const res = await post({ lesson: "grilling", body: "x".repeat(2001) });
expect(res.status).toBe(400);
```

The first passes even if the API never checks the length. The second fails until it does.

```checkpoint rename-breaks-test
On a recipe site, the agent splits the inside of `scale(recipe, servings)` into two smaller helpers. Every recipe still scales correctly, but one test now fails: it checked that `scale` called a helper named `multiplyAmounts` exactly once. What's the right verdict on this test?
- [ ] A good catch: update it to count calls to both new helpers.
  > Every recipe still scales correctly, so nothing broke. Counting the new helpers ties the test even tighter to the inside of `scale`.
- [ ] Too broad: replace it with one test per helper.
  > The helpers are internals, not the interface. Tests per helper break on the next split too.
- [ ] Horizontal slicing: it was written before the code.
  > Horizontal slicing means writing all the tests before any of the code. Writing one test first is the loop working.
- [x] Implementation-coupled: it checks how, not what.
  > Right. It broke on a change nobody using `scale` can see. Check results instead: 200 g of flour for 4 servings becomes 400 g for 8.
```

## Fake only at the edges

You don't want every test run to send a real email or charge a real card, so a test sometimes swaps in a fake. The Skill calls it a mock, and its rule is short: ==fake only at system boundaries==, where your code meets something you don't control.

| Fake it | Never fake it |
|---|---|
| Outside services, like payments or email | Your own modules |
| Time and randomness | Internal helpers |
| Sometimes the database (a real test database is better) | Anything else you control |
| Sometimes the filesystem | |

Fake your own code and the test only checks the fake. Even at a boundary, a fake hides what it leaves out: Matt's September talk showed a test that swapped the browser's audio feature for a bare fake, so it could never fail, while the real feature had error cases that only showed up for real users.

One habit makes the edges easy to fake: **pass dependencies in** (dependency injection). Hand a function the outside things it relies on, like a clock or an email service, and a test can hand it a fake instead. This site's Lessons module takes its folder as an input, so its tests pass in folders of fake Lessons.

This site goes further: one of its ADRs (architecture decision records: short notes on a hard-to-reverse choice) says the tests always talk to a real Postgres database, in a copy kept only for tests. Neon, the service that hosts it, calls such a copy a branch. A faked database can pass when the real query would fail.

```checkpoint which-fake-is-wrong
Your gym app's sign-up charges the first month through a payment service and sends a welcome text through an SMS service, both run by other companies. Four tests each swap one thing for a fake. Which swap breaks the Skill's rule?
- [ ] The SMS service, handed to sign-up as a dependency.
  > That's a boundary you don't control, and you don't want real texts going out on every run. Faking it is the rule working.
- [ ] The payment service that charges the first month.
  > An outside payment service is a system boundary. Faking it is allowed.
- [x] The app's pricing module that sets the fee.
  > Right. That's your own code. Fake it and the test only checks the fake; let it run for real.
- [ ] The random generator that picks each welcome code.
  > Randomness is a boundary too. A fake makes the result predictable enough to check.
```

## When to reach for it

Reach for `/tdd` when there's a concrete behaviour with an input and an output you can observe: a validation rule, a calculation, a transformation, what an API returns. `tdd` is a model-invoked Skill: you can type `/tdd`, and the agent may load it on its own when you ask to build something test-first.

| Your situation | Reach for |
|---|---|
| A behaviour with clear inputs and outputs | `/tdd` |
| You're not sure yet what should happen | `/grill-with-docs` first, where the agent questions you until the plan is settled (see [Grilling](/learn/grilling)), then `/implement` (small) or `/to-spec` (multi-session) |
| The real question is the interface's shape | `/codebase-design` |
| A spec or tickets (small tasks sized for one session) you want built | `/implement` per ticket, or `/implement-spec` for the whole spec; both drive `tdd` |
| Styling, settings, code that only connects other pieces | Probably no test: check it by eye |
| A browser test for a feature that doesn't exist yet | Not first: it makes the loop too slow |

The fifth row is your call: the Skill has rules for where tests go, but none for whether a change is worth testing (issue #746 asked for that and was closed as not planned). A test of a colour or a setting has no independent answer to check, so it just restates the code.

The last row is about browser tests, which open a real browser and click through a page. They're slow, so Matt's docs say they come after the behaviour works. The Skill won't stop the agent writing one first, so write that rule into your project's `CLAUDE.md`, a file of standing instructions the agent reads each session.

`tdd` is a reference, not a driver: it holds the rules, and something else runs the session. That's you, or `/implement`, which closes out with `code-review`. See [Implement](/learn/implement) and [Code review](/learn/code-review). (Type `/mattpocock-skills:code-review` for Matt's: Claude Code ships its own `/code-review`, a Built-in command with the same name.)

The Skill's docs admit the agent sometimes writes code before the test anyway. If strictness matters for a slice, watch the run.

## How Matt and others use it

**Matt Pocock** called good TDD the most consistent way he has improved what agents produce (March 2026). Some habits, from his videos:

- **TDD is in his standing prompt.** In his April 2026 workshop, the prompt in his Ralph script (built to run the agent unattended, task after task) says: explore the repo, use TDD, then run the feedback loops (tests and other automatic checks). He ran it once on stage and pointed out the agent confirming red before green.
- **He shapes the codebase around testing.** He said he'd warped his whole technique around making TDD work: a badly structured codebase has no clear test boundaries, while modules that hide a lot behind a small interface have clear seams. See [Architecture](/learn/architecture).
- **He enforces test quality at review.** In the September talk he argued that an implementing agent already has too much to do, so standards belong in a separate review with its own context: make it work, then make it good.

**Other developers:**

- A developer posting as Warshoow ran `/implement` unattended, one ticket after another, and reported that across 173 sessions on their machine (September 2026), `tdd` never ran once. Matt's `/implement` now tells the agent explicitly to load `tdd`.
- In October 2026, Colin Eberhardt of the consultancy Scott Logic rebuilt an app with Matt's Skills. `/implement` ran red-green TDD and the reviews caught real bugs, but its storage tests, repeated for every kind of record, checked their fakes more than the code.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)).

1. In your terminal, make an empty folder and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir reading-time
cd reading-time
claude
```

2. Type a slash and then tdd, but don't press Enter. If `tdd` is in the list that pops up, delete what you typed and go on to step 3. If it isn't, delete it, type `/exit`, run this in your terminal to install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode (where the agent only reads and proposes) is off: if you see "plan mode on" under the prompt box, press Shift+Tab until it changes. Any other mode is fine.
4. Type this:

```text
/tdd In this empty folder, set up the smallest project you can with a language and test runner already installed on this machine. Then build readingTime(text) for a Lesson page: whole minutes at 200 words per minute, rounded up, never less than 1.
```

5. When it proposes a seam, reply: "Yes, test through readingTime itself." If it asks what to cover, offer: empty text takes 1 minute, 201 words take 2, 200 words take 1.
6. If it asks permission to create files or run tests in this folder, choose Yes. Watch its messages: each test should fail before its code is written.
7. When it's done, type: "Rewrite the inside of readingTime a different way, without changing what it returns, then run the tests and show me the test file."
8. Press Esc at any point to stop it. Type `/exit` when you're done.

**It's working if:**

- [ ] It proposed a seam, with what it catches and misses, and waited before any test file existed.
- [ ] Tests appeared one at a time, and you saw each fail: before its code, or with the code broken on purpose.
- [ ] Before your rewrite, it finished without a tidy-up pass of its own.
- [ ] Test names describe behaviour ("201 words take 2 minutes"), and expected values are plain numbers like 2, not the formula again.
- [ ] Nothing was faked.
- [ ] Your rewrite in step 7 broke no tests.

If it writes a batch of tests at once, say: "One test at a time: red, then green." If one passes straight away, say: "Break the code, show me that test fail, then restore it." If it never stops to agree a seam, press Esc and say: "Propose the seam, with what it catches and misses, and wait for my OK."
````

## Common mistakes

- **Picking a seam blind.** If a proposal doesn't say what each seam catches and misses, ask before you answer.
- **Expecting `tdd` to know about other tickets.** It sees the one you give it. Pass the spec too if a slice depends on its neighbours.

```site-story
I typed `/tdd` four times while building the first version of this site, once per ticket.

| Ticket | Where the tests went | Result |
|---|---|---|
| 03 Lesson pages | The Lessons module's public functions, fed folders of fake Lessons | 7 tests; pages checked by eye |
| 04 Comments table | None, by agreement: no public entry point yet | Checked the table existed on every database branch |
| 05 Comments API | `GET` and `POST /api/comments`, against the real Neon `test` branch | 12 tests, including 2000 vs 2001 characters and broken JSON |
| 06 Comment box | None, by agreement: its logic lives in the tested API | Checked by eye on a preview copy of the site |

**Tests can be dangerous.** Mine empty the comments table before each one. So a setup file refuses to run unless the database address comes from `.env.test.local`, which points at the test branch.

**Say so when a test is green from the start.** I learned to admit when one was, rather than pretend it had gone red.

**Passing isn't the same as correct.** Later, Matt's two-axis review (`/mattpocock-skills:code-review`) found a crash none of my 19 tests had tried: a number instead of text as the comment crashed the API with a 500 error. I fixed it test-first: a red test reproduced `.trim is not a function`, all the input checks moved into the comments module, and it went green. That made 20.

**For the site's later redesign, the spec named one seam:** the Lessons module's public functions, fed folders of fake Lessons; the look was checked with screenshots. The ticket said "Build the Lessons module change with `/tdd`", and it ended with 11 Lessons-module tests, including checks that a Lesson file missing a photo field fails loudly.

What I took away: deciding *where* to test mattered more than testing everything.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Start | `/tdd <the behaviour you want>`, or `/mattpocock-skills:tdd` |
| It proposes seams | Pick the highest one that catches what matters; ask what each misses |
| Each cycle | One failing test, seen red, then just enough code to turn it green |
| Expected values | Numbers from the spec or a worked example, never the code's own formula |
| Faking | System boundaries only: outside services, time, randomness, sometimes files; a real test database if you can |
| After green | No refactor: review flags what to tidy |
| Skip it | Styling, settings, connecting code; browser tests come later |

## Final test

```test scenario-seam-choice
You're adding discount codes to a shop's checkout with `/tdd`. The agent proposes two seams: the `checkout(cart, code)` function the checkout page calls, which catches the total a customer pays but misses how the page shows it, or the discount module's `parseCode(code)` function, which catches how codes are read but misses whether checkout applies them. Which do you pick?
- [ ] `parseCode`, because smaller functions make more precise tests.
  > Precise, but it's the lower seam. It can't tell you whether customers pay the right total.
- [ ] Both, plus a test for every helper in the checkout module.
  > You can't test everything, and helpers are internals. Seams are agreed so the effort lands on what matters.
- [x] `checkout`, since parse bugs would show up in its total too.
  > Right. It's the higher seam: a parsing bug shows up as a wrong total, and it also catches whether the code gets applied at all.
- [ ] Neither, until a browser test of the checkout page exists.
  > Browser tests make the loop too slow to pay off. They come after the behaviour works.
```

```test scenario-clock
Your to-do app stamps a task with the current time when you tick it off, and hides tasks finished more than 30 days ago. You're writing the test "a task finished 31 days ago is hidden". What should the test fake?
- [ ] The function that works out each task's age.
  > That's your own code, part of what's under test. Fake it and the test only checks the fake; control the clock it reads instead.
- [ ] Nothing: create a task and wait 31 days.
  > Real waiting makes the test useless. Time is a boundary you're allowed to fake.
- [ ] The database, so the test needn't set up a real one.
  > A real test database is preferred, and faking it doesn't help: the app takes the finish time from the clock, so the clock is what the test must control.
- [x] The clock, passed in so the test can set "today".
  > Right. Time is a system boundary. Pass the clock in and the test can jump 31 days in a millisecond.
```

```test scenario-no-refactor
A teammate who learned TDD years ago watches your `/tdd` run and says the agent keeps skipping the refactor step after each green. What do you tell them?
- [ ] The Skill failed to load, so reinstall Matt's Skills.
  > It's working as designed. Since version 1.1 the loop is red, then green, even though the description still mentions refactoring.
- [x] Nothing's wrong: refactoring moved to review.
  > Right. Version 1.1 dropped the refactor step: agents rarely did it with their own code still in context, and a separate review with a fresh context does it better.
- [ ] It skipped a step, so remind it to refactor every cycle.
  > There's no refactor step to skip. Tidying belongs to review, with a fresh context.
- [ ] It's saving the refactoring for one big pass at the end.
  > There's no end-of-loop pass either. Refactoring happens at review.
```

```test scenario-tickets
You've settled a feature with `/grill-with-docs`, written a spec with `/to-spec` and split it into four tickets with `/to-tickets`. What do you type to build the first ticket?
- [x] `/implement`, to work through the ticket
  > Right. `/implement` runs the session, drives `tdd` for the ticket, then closes out with a review.
- [ ] `/tdd` for the ticket's tests, then `/implement` for its code
  > That splits the loop in two. `/implement` already calls `tdd`, so each test and its code arrive together, one slice at a time.
- [ ] `/mattpocock-skills:code-review` on the ticket, to set standards first
  > Review comes after the code exists. It reviews the changes, not a plan.
- [ ] `/to-spec` again, to add the ticket's test cases
  > The spec is done, and its seams are agreed. Tests get written during the build.
```

```test scenario-best-fit
Four small jobs are waiting on your project. Which one is the best fit for `/tdd`?
- [ ] Changing the site's accent colour in a CSS file.
  > A test of the new colour would only restate the code. Check it by eye.
- [ ] Adding a menu link that points at a new page.
  > That only connects two pieces, with nothing to work out. Check it by eye.
- [ ] A browser test for a checkout page not built yet.
  > Browser tests first make the loop too slow to pay off. They come after the behaviour works.
- [x] A function that splits a bill between friends.
  > Right. Clear inputs, an output you can check by hand (£30 split three ways is £10 each), and rules worth pinning down.
```

```test spot-tautological
A shipping test says `expect(shippingCost(parcel)).toBe(parcel.kg * RATE_PER_KG)`. Spot the mistake.
- [ ] It calls the real `shippingCost` instead of a mock.
  > `shippingCost` is the code under test. Calling it for real through its interface is right; mocks are for boundaries.
- [ ] It makes more than one logical assertion.
  > It makes one. The problem is where the expected value comes from.
- [x] Its expected value repeats the code's own formula.
  > Right. It's tautological, so it passes even if the formula is wrong. Use a worked example from the price list instead.
- [ ] It should test every parcel weight, not just this one.
  > More weights checked the same way would all share the flaw. One case per test is fine; the problem is the expected value.
```

```test spot-side-channel
A test named "a booked class shows on the member's timetable" calls `bookClass(member, "yoga")`, then runs its own query on the bookings table to check a row exists. Spot the mistake.
- [x] It checks through a side channel, not the interface.
  > Right. Read it back the way a member would, through `getTimetable(member)`, so a change to the table can't break a working feature.
- [ ] It should fake the database instead of using a real one.
  > A real test database is the preferred option. The problem is how the test checks the result.
- [ ] It's tautological, because it checks a value it just set.
  > "yoga" is an independent literal. The problem is the route the test takes to check it.
- [ ] It tests too little: it should check every column.
  > More columns would tie it even more tightly to the table.
```

```test spot-batch
Asked to build a password-strength checker with `/tdd`, the agent creates a file of 15 tests and runs them: all 15 fail. Then it writes the whole checker, and all 15 pass. Spot the mistake.
- [ ] Nothing: every test was seen red, then green.
  > Seeing red isn't enough on its own. Fifteen tests written before any code describe imagined behaviour and lock in a structure too early.
- [ ] It should have written the checker first.
  > Code first lets the tests bend to fit the code, which is what the loop prevents.
- [x] It wrote all the tests before any code.
  > Right. That's horizontal slicing. One test, red, just enough code, green, then the next, each shaped by what the last one taught.
- [ ] Fifteen tests is too many for one feature.
  > The count isn't the problem; the order is.
```

```test sequence-loop
You give `/tdd` a new behaviour to build in your project. Which order matches the Skill?
- [ ] Agree the seam → one failing test → just enough code → refactor → next test
  > That's classic TDD. This Skill has no refactor step: tidying happens later, at review, with a fresh context.
- [ ] Agree the seam → write the code → write a test → see it pass
  > Code before the test lets the test bend to fit it, and a test you only ever see pass proves little.
- [ ] One failing test → agree its seam → just enough code → next test
  > No test is written at a seam you haven't agreed. The seam comes before the first red.
- [x] Agree the seam → one failing test → just enough code → next test
  > Right. Seam first, then red, then green, one slice at a time. Refactoring waits for review.
```

```test why-test-first
A friend says: "I let the agent write the code, then ask it for tests at the end. Same result, fewer steps." What's the strongest reply?
- [ ] "It's the same if every test passes at the end."
  > Passing is the problem: tests shaped to fit the code pass anyway, like the comment-limit test that never checked the API.
- [x] "Tests written afterwards fit the code, not what it should do."
  > Right. A test that fails before the code exists, then passes, is evidence. One written afterwards may just describe what's there, gaps included.
- [ ] "Then just ask it for twice as many tests."
  > More tests written the same way fit the code the same way. The order matters, not the count.
- [ ] "Tests written afterwards never catch anything, so skip them entirely."
  > Too strong. They can catch some bugs, but nobody saw them fail, so you can't tell which ones check anything.
```

```sources
- [tdd SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/SKILL.md), with [tests.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/tests.md) and [mocking.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/mocking.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [to-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-spec/SKILL.md) (seams in the spec), [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md) and [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md) (both drive tdd), [code-review SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review/SKILL.md) (reports, doesn't edit) and [codebase-design SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/codebase-design/SKILL.md) (seam, module, interface): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) (user-invoked vs model-invoked Skills): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /tdd Skill](https://www.aihero.dev/skills-tdd), AI Hero docs (browser tests after the behaviour; code before the test happens), updated 2026-08-24, read 2026-10-23.
- [mattpocock/skills release v1.1.0](https://github.com/mattpocock/skills/releases/tag/v1.1.0) (refactor step dropped, seams introduced), 2026-07-08; issues [#589](https://github.com/mattpocock/skills/issues/589), [#607](https://github.com/mattpocock/skills/issues/607) and [#746](https://github.com/mattpocock/skills/issues/746), read 2026-10-23.
- [5 Claude Code skills I use every single day](https://www.youtube.com/watch?v=EJyuu6zlQCg), Matt Pocock, 2026-03-16 (TDD as his most consistent lever 9:24–9:52; the weak refactor step 11:37–11:59; TDD needs clear module boundaries 12:05–12:27).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (TDD in the Ralph prompt, run once on stage 57:21–57:43; confirming red, cheating in layers, warping his technique 66:42–68:34; feedback loops as the ceiling 69:45–70:30).
- [How To De-Slop A Codebase Ruined By AI](https://www.youtube.com/watch?v=3MP8D-mdheA), Matt Pocock, 2026-04-29 (seams as where tests go, 3:45–4:40).
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock at AI Engineer Paris, 2026-09-25 (tautological, structure-bound and unfailable tests 5:24–7:55; deep modules 8:40–9:30; standards at review, not implementation 11:35–14:00; checked on an auto-translated track).
- [ADR 0003: tests run against a real Neon branch](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/docs/adr/0003-tests-hit-real-postgres.md), this site's repo, read 2026-10-24.
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [afk.sh: chaining /implement over ready-for-agent tickets overnight, one fresh session per ticket](https://github.com/mattpocock/skills/discussions/1136), GitHub Discussion #1136, 2026-09-28, with Warshoow's comment of 2026-09-29.
```
