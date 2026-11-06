---
title: migrate-to-shoehorn: swap test casts for partial data
slug: migrate-to-shoehorn
summary: migrate-to-shoehorn replaces type casts in TypeScript tests with shoehorn, a library that lets a test pass only the fields it needs.
---

## What it's for

Say your [practice project](/learn/issues-and-keeping-track)'s website is written in TypeScript, which checks your data's shape before the code runs. Its `createBooking` function takes a whole `Request`, the object for one incoming web request. One test only cares about `body.id`, but TypeScript wants 20 more fields faked too. So you add a **type assertion**, or cast: `as Request` tells TypeScript "trust me, this is that type".

Casts cause three problems in tests:

- You're trained not to use them.
- You must name the target type by hand.
- Wrong data on purpose, to test bad input, needs a **double cast**: `as unknown as Type`.

**migrate-to-shoehorn replaces those casts with shoehorn, Matt Pocock's library that lets a test pass partial data: only the fields it needs.**

It swaps each cast for a helper:

- `as Type` becomes `fromPartial()`, for partial data that still type-checks.
- `as unknown as Type` becomes `fromAny()`, for wrong data on purpose, with autocomplete (editor suggestions) kept.

```checkpoint quick-1
A test passes only `body.id`, with a single `as Request`. Which helper does it get?
- [x] `fromPartial()`, for partial data that still type-checks.
- [ ] `fromAny()`, for wrong data on purpose, with autocomplete kept.
- [ ] Neither helper, because a single cast like `as Type` stays as it is.
Why: `as Type` becomes `fromPartial()`, and `as unknown as Type` becomes `fromAny()`. A single cast on partial data gets `fromPartial()`.
```

For example, the call changes like this:

```ts
// Before
createBooking({ body: { id: "123" } } as Request);

// After
createBooking(fromPartial({ body: { id: "123" } }));
```

You ask for the migration. The agent asks three questions, installs shoehorn, swaps the casts and runs a [type check](/learn/fix-the-environment).

One rule is firm: test code only, never production code. That's the code your live site runs. A broken type in your app is likely to reach users as a bug. In a passing test, once you've checked it, fixing a broken type can feel like busywork.

```checkpoint quick-2
You're tempted to call `fromPartial()` in your booking page's real code, to save writing a full object. What does the rule say?
- [x] Don't: shoehorn is for test code only, never production code.
- [ ] Go ahead, as long as the type check still passes afterwards.
- [ ] Go ahead, as long as that page has tests around it as well.
Why: One rule is firm, test code only. A broken type in your app is likely to reach users as a bug, so bending types is fine only in tests.
```

```diagram
type: compare
caption: "It swaps each cast for a helper"
columns: ["each cast", "a helper"]
rows:
  - label: "partial data"
    cells: ["`as Type`", "`fromPartial()`"]
  - label: "wrong data on purpose"
    cells: ["`as unknown as Type`", "`fromAny()`"]
footer: "test code only, never production code."
```

## When to use it

- You have TypeScript tests that fake a whole big object, when each test only cares about one field.
- You have test files full of `as` casts you want gone.

```checkpoint quick-3
Which of these tests is a case for migrate-to-shoehorn?
- [x] One that fakes a whole big object when it only cares about one field.
- [ ] One that builds a small object by hand, with no casts in it at all.
- [ ] One that calls the real function with real data, and fakes nothing.
Why: It's for tests that fake big objects or lean on `as` casts. A test with no fakes and no casts has nothing to migrate.
```

## When not to use it

- If you're building a feature test-first, use its look-alike [tdd](/learn/tdd) instead, because migrate-to-shoehorn only rewrites how existing tests build their fake data.
- If a function you own asks for far more than it uses, use [codebase-design](/learn/codebase-design) instead, because fewer inputs mean simpler test setup.
- If your tests are Python, skip it, because it only searches files ending in `.test.ts` or `.spec.ts`.

```checkpoint quick-4
You're about to build a waiting-list button test-first, and no tests exist yet. Which Skill fits?
- [x] tdd, because you're building a feature test-first, with no tests yet.
- [ ] migrate-to-shoehorn, because it writes the fake data new tests need.
- [ ] codebase-design, because it writes a new test for each of your params.
Why: tdd is for building a feature test-first. migrate-to-shoehorn only rewrites how existing tests build their fake data, and here there are none.
```

## What it needs to start

It needs a TypeScript project that installs with npm, JavaScript's standard package installer, and a type check to run.

You can type `/migrate-to-shoehorn`, or the agent may start it on its own when you mention shoehorn or ask for partial test data.

```checkpoint quick-5
You ask your agent for partial test data, and you don't name this Skill. What can happen?
- [x] The agent may start migrate-to-shoehorn on its own.
- [ ] Nothing, because only you can start it, by typing its name.
- [ ] The agent refuses until you've installed shoehorn yourself.
Why: You can type `/migrate-to-shoehorn`, but you don't have to. The agent may start it on its own when you mention shoehorn or ask for partial test data.
```

Before changing anything, it asks three questions:

- Which test files have casts causing problems?
- Are big objects involved, where only some fields matter?
- Do you need wrong data on purpose?

## What it creates

- `@total-typescript/shoehorn`, installed with `npm i`.
- Edited test files: each cast replaced, and the shoehorn imports added.
- A type check run, the last step of its checklist. That's where it stops.

```checkpoint quick-6
The agent has replaced your casts and added the imports. What's left on its checklist?
- [x] A type check run, the last step of its checklist.
- [ ] A pull request, opened with the edited test files.
- [ ] A commit of the edited test files, on a new branch.
Why: The type check is the last step of its checklist, and it stops there. A commit or a pull request isn't on that checklist.
```

## Going deeper

### Why it exists

Testing a function that takes a big type is painful in TypeScript. Take a `Request` from express, an outside library for writing endpoints (web addresses that answer requests). You fake every field, or you write `as unknown as Request`. Then you import that type into every test. Matt's name for this is "A thousand tiny cuts."

Matt went through dozens of open-source codebases, and every one with a large test suite had the same problem. So he released shoehorn. Years later he added this Skill, so an agent can do the clean-up for you.

The Skill sits in misc, the bucket (his word for a folder of Skills) for tools he keeps around but rarely uses. They aren't promoted: they don't ship in his **plugin**, a bundle of Skills you can install together. He has also frozen the bucket, so bug reports, feature requests and PRs against its Skills are closed.

```checkpoint quick-7
You open a pull request that fixes a typo in this Skill. What happens to it?
- [x] It's closed, because PRs against a frozen bucket's Skills are closed.
- [ ] It's merged, because a frozen bucket still takes small fixes like typos.
- [ ] It's moved to the plugin, because misc Skills ship in the plugin first.
Why: Matt has frozen the misc bucket, so bug reports, feature requests and PRs against its Skills are closed. Its Skills don't ship in his plugin either.
```

### How it works underneath

A cast only says "trust me". shoehorn's helpers say what you mean, and each one checks a different amount. Say `body.id` should be a string, and `Request` has 20 more fields:

```ts
// fromPartial: leave out any field, nested ones too.
createBooking(fromPartial({ body: { id: "123" } })); // passes

// A field you do give must have the right type.
createBooking(fromPartial({ body: { id: 123 } })); // type error

// fromAny: pass anything. No checks, but autocomplete stays.
createBooking(fromAny({ body: { id: 123 } })); // passes

// fromExact: you must pass every property.
createBooking(fromExact({ body: { id: "123" } })); // type error
```

An object where any field can be left out, nested ones too, is called a **deep partial**. So `fromPartial` still checks the fields you do give, `fromAny` checks nothing, and `fromExact` wants every property.

```checkpoint quick-8
You want to leave most fields out, but still catch a wrong type in the ones you pass. Which helper fits?
- [x] `fromPartial`, which still checks the fields you do give.
- [ ] `fromAny`, which checks the fields you give and leaves out the rest.
- [ ] `fromExact`, which lets you leave out any field you don't need.
Why: `fromPartial` lets you leave fields out and still checks the ones you give. `fromAny` checks nothing, and `fromExact` wants every property.
```

The Skill's table lists all three helpers, but its checklist only ever writes `fromPartial()` and `fromAny()`. You'd reach for `fromExact` when you want to swap in and out of the other two.

Bending types has a cost, and Matt admits it: huge test objects are "a sign that your types are too loose". Ideally, every function asks only for the data it needs. So when the function is yours, fix the function. shoehorn is still the best choice in cases like these:

- **Legacy codebases:** you may not have time to refactor everything.
- **Third-party libraries:** you may not be able to change the types without needless wrapper functions.

```checkpoint quick-9
Every test of your own function fakes a huge object. What does that point to?
- [x] Types too loose: the function asks for more than it needs.
- [ ] Tests too strict: they check more fields than they should.
- [ ] A test runner too old to handle partial data on its own.
Why: Ideally, every function asks only for the data it needs. So a huge test object is a sign that your types are too loose, and when the function is yours, you fix the function.
```

### A real example

In June 2023, a user was replacing every cast in their test suite with `fromPartial`. It seemed to work perfectly, except for one call: `fromPartial<AxiosInstance>({})`. `AxiosInstance` is a type from Axios, an outside library, and TypeScript still demanded all its fields.

Matt spotted a likely cause: "It looks like AxiosInstance is a function? One with multiple overloads." Overloads are different ways of calling the same function. The user thanked him for looking into it, and said shoehorn had already helped them remove hundreds of casts.

```checkpoint quick-10
`fromPartial` worked for every cast in one test suite except `AxiosInstance`. What did Matt suspect?
- [x] That it's a function, and one with multiple overloads.
- [ ] That it's too deep for the compiler's depth limit to walk.
- [ ] That its library ships with no types for it at all.
Why: Matt spotted a likely cause: "It looks like AxiosInstance is a function? One with multiple overloads." Overloads are different ways of calling the same function.
```

Matt fixed shoehorn the next day, through a pull request, and shipped the fix in version 0.1.1. So one fix in the library repaired that call in every test, for everyone on the fixed version.

### Where it goes wrong

**Some test files were never touched.** The Skill's search covers only `*.test.ts` and `*.spec.ts`, so a TypeScript test ending in `.test.tsx` is never found. Tell the agent to search `*.test.tsx` files too.

```checkpoint quick-11
Your website's tests all end in `.test.tsx`, and you run the Skill as written. What does its search find?
- [x] None of them, since it covers only `*.test.ts` and `*.spec.ts`.
- [ ] All of them, since it covers every TypeScript file in the repo.
- [ ] All of them, since `.test.tsx` counts as a kind of `*.test.ts` file.
Why: The search covers only those two endings, so a test ending in `.test.tsx` is never found. Tell the agent to search those files too.
```

**shoehorn landed in `dependencies`.** The Skill runs plain `npm i`, and npm saves packages into `dependencies` by default. shoehorn is for tests only, so you want a [dev dependency](/learn/setup-pre-commit). Install it with `npm i -D`, which puts it in `devDependencies`.

**The Skill is missing after you install the plugin.** Matt's plugin leaves out the misc Skills. An automated report said four of them, this one included, can't be invoked after a plugin install. Matt answered "Yep, this is intentional". Install this one through skills.sh, using its installer, `npx skills`.

**Your bug report gets closed.** The Skill is frozen, so a report against it is closed. Matt's advice: "If one doesn't work for you, install it with skills.sh and fix your copy: the files are yours to edit." The freeze covers the Skill only. The library lives in its own repo, total-typescript/shoehorn.

**`fromPartial` fails with TS2321, "Excessive stack depth".** You passed a full value of a large, self-referencing type, one whose members lead back to itself. The compiler walks every member of the type, then every member of those, until it hits its depth limit.

```checkpoint quick-12
Why can `fromPartial` fail with TS2321 on a huge, self-referencing type?
- [x] The compiler walks member after member until it hits a depth limit.
- [ ] `fromPartial` refuses, on purpose, any type that refers back to itself.
- [ ] The test runner times out before the whole type check can finish.
Why: The compiler walks every member of the type, then every member of those, until it hits its depth limit. A type whose members lead back to itself can take it that far.
```

One real case is the ComfyUI frontend's test files. There, tsgo, a preview of TypeScript 7's new compiler, reports 88 errors in 38 files, all from that same walk. TypeScript 6's compiler, `tsc`, gets through the same files. TypeScript 7 shipped in July 2026, and its `tsc` is that new compiler. The issue is still open. The reporter proposed a one-line change to shoehorn's partial type, and it makes all 88 errors go away. They apply a slightly wider version to their own copy with `pnpm patch`, pnpm's way of editing an installed package.

### Try it

Clean up one test in your practice project's TypeScript website, then watch `fromPartial` catch a mistake. You'll need the practice project, the yoga-studio booking site (if you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first), and Node.js. You'll also need a test in `web/` that fakes a class or booking with `as`, and needs only one or two fields. If `web/`, its type check or that test is missing, ask your agent to set it up first. If Claude Code doesn't offer `/migrate-to-shoehorn`, install it first: `npx skills@latest add mattpocock/skills --skill migrate-to-shoehorn`.

1. Go into the website, the subfolder with its own `package.json`: `cd web`.
2. Start Claude Code: `claude`.
3. Type `/migrate-to-shoehorn`. You should see its three questions.
4. Answer them, naming your test file for the first. Also tell it to install with `npm i -D @total-typescript/shoehorn`, and to search `*.test.tsx` files too. You should see the cast become `fromPartial()`, with its import added.
5. In a second terminal, in `web/`, run the type check yourself: `npx tsc --noEmit`. You should see no errors.
6. Open `package.json`. You should see shoehorn under `devDependencies`.
7. List the files that mention shoehorn: `grep -rl shoehorn . --include='*.ts' --include='*.tsx' --exclude-dir=node_modules`. You should see only test files.
8. In your test, change one field you pass to `fromPartial` to the wrong type.
9. Run `npx tsc --noEmit` again. You should see a type error on that field.
10. Undo the change, and run it once more. You should see no errors.

If step 9 shows no error, that field may accept any type, or your type check may not cover that file. Ask your agent which.

### Read more

- [Testing with TypeScript is Painful: Here's a Solution](https://www.totaltypescript.com/testing-with-typescript-is-painful-heres-a-solution), Matt Pocock
- [shoehorn on GitHub: Work seamlessly with partial mocks in TypeScript](https://github.com/total-typescript/shoehorn), Matt Pocock
- [Release v0.1.0](https://github.com/total-typescript/shoehorn/releases/tag/v0.1.0), total-typescript/shoehorn (published by GitHub Actions), 11 April 2023
- [Changes to misc/ skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock, 6 October 2026
- [misc: demote to a non-promoted bucket](https://github.com/mattpocock/skills/commit/7efc3d2a3899c141f4d64e11be2227e0049db626), Matt Pocock, 1 July 2026
- [Getting type errors with Axios (shoehorn issue #6)](https://github.com/total-typescript/shoehorn/issues/6), charliematters, 13 June 2023
- [fromPartial hits "Excessive stack depth" (shoehorn issue #22)](https://github.com/total-typescript/shoehorn/issues/22), DrJKL, 5 October 2026
- [4 skills under skills/misc/ missing from plugin.json (skills issue #164)](https://github.com/mattpocock/skills/issues/164), xiaolai, 11 May 2026
- [npm-install](https://docs.npmjs.com/cli/v11/commands/npm-install/), npm Docs

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint migrate-to-shoehorn-deeper-axios
In 2023, a user's `fromPartial<AxiosInstance>({})` failed, though `fromPartial` worked for every other cast in their test suite. Matt could have told them to use `fromAny` in those tests. Instead he fixed shoehorn and shipped 0.1.1. Why is that the better move?
- [x] The bug lived in shoehorn itself, so one fix there repaired that call for everyone who updated the library.
- [ ] `fromAny` can't take an empty object like `{}`, so the user had no other way to write those Axios tests at all.
  > shoehorn's README says `fromAny` lets you pass anything to a slot. It would have taken `{}`, just with no checks.
- [ ] The user had sent a Codesandbox, and Matt only fixes shoehorn issues that come with a working online repro.
  > Nothing in the issue states such a rule. Matt fixed it because it was a bug in how shoehorn handled the type.
Why: The trouble was how shoehorn handled `AxiosInstance`, which looks like a function with multiple overloads, so Matt fixed it in shoehorn the next day. Using `fromAny` would have helped only those tests. One fix in the shared library repaired that call for everyone who updated.
```

## Remember

```flashcards
Q: What does migrate-to-shoehorn create?
A: The `@total-typescript/shoehorn` library installed, test files with their casts replaced and shoehorn imports added, and a type check run at the end.

Q: In migrate-to-shoehorn, what does `as Type` become?
A: `fromPartial()`: partial data that still type-checks.

Q: What three problems with `as` in tests does migrate-to-shoehorn name?
A: You're trained not to use it, you must name the target type by hand, and wrong data on purpose needs a double cast, `as unknown as Type`.

Q: Which of Matt's buckets holds migrate-to-shoehorn, and what does that mean?
A: misc: tools he keeps around but rarely uses, not promoted in the plugin. They're frozen, so bug reports, feature requests and PRs against them are closed.

Q: Why did Matt build shoehorn, the library this Skill installs?
A: Every open-source codebase with a large test suite he looked at had the same pain: faking huge types, or casting with `as unknown as`. He called it a thousand tiny cuts.

Q: What are huge test objects a sign of?
A: That your types are too loose: ideally every function asks only for the data it needs. shoehorn is for legacy code you lack time to refactor, or third-party types you can't change.
```

## Final test

```final-test migrate-to-shoehorn-double-cast
A test passes wrong data on purpose with `as unknown as Request`. What does migrate-to-shoehorn put in its place?
- [x] `fromAny()`, which takes wrong data on purpose and keeps autocomplete.
- [ ] `fromPartial()`, which takes partial data that still type-checks.
- [ ] `fromExact()`, which forces you to pass the full object every time.
- [ ] A full, hand-built `Request` object, so no cast or helper is needed.
Why: The data here is wrong on purpose, so the double cast becomes `fromAny()`, which takes it and keeps autocomplete. `fromPartial()` replaces a single `as Type`, for partial data that still type-checks.
```

```final-test migrate-to-shoehorn-why-tests-only
migrate-to-shoehorn keeps shoehorn to test code only. Why is bending types fine in tests?
- [x] A broken type in app code can reach users as a bug; in a passing test it can feel like busywork.
- [ ] shoehorn's helpers only run inside a test runner, so app code that imports them would crash.
- [ ] Bundlers can't tree-shake shoehorn, so in app code it would ship test helpers to every user.
- [ ] Tests are never type-checked at all, so any type shoehorn bends there is never seen anyway.
Why: A broken type in your app is likely to become a bug your users find. In a passing test, once you've checked it, it can feel like busywork. So tests can be less strict than app code.
```

```final-test migrate-to-shoehorn-first-step
What does migrate-to-shoehorn do before it installs anything or edits a test?
- [x] It asks which tests hurt, whether big objects matter, and whether wrong data is needed.
- [ ] It runs the type check first, to record every error before it changes any file.
- [ ] It writes a failing test for each cast it finds, so every rewrite has a target.
- [ ] It reads every source file and lists each `as` it finds, whether in tests or not.
Why: Its first step is to gather requirements: which test files hurt, whether big objects are involved, and whether you need wrong data on purpose. Only after your answers does it install shoehorn and change any test.
```

```final-test migrate-to-shoehorn-deeper-frozen
You find a bug in migrate-to-shoehorn and report it on Matt's repo. What happens?
- [x] It's closed, because misc Skills are frozen. He suggests you fix your own copy.
- [ ] It's fixed in the next release, because every bucket gets the same upkeep.
- [ ] It's moved to the plugin's tracker, because misc Skills ship in the plugin.
- [ ] It's moved to the library's own repo, because the Skill only wraps shoehorn's helpers.
Why: The misc bucket is frozen, so bug reports, feature requests and PRs against its Skills are closed. Those Skills don't ship in the plugin. The library has its own repo, but this Skill's files are in Matt's skills repo. His advice: install it with skills.sh and fix your copy.
```

```final-test migrate-to-shoehorn-deeper-checked
A test passes `{ body: { id: 123 } }` where `id` should be a string. Which shoehorn helper still reports that mistake?
- [x] `fromPartial`, because the fields you do give must match the expected type.
- [ ] `fromAny`, because it keeps autocomplete on the original type as you type.
- [ ] Both of them, because each one checks every field you pass in the object.
- [ ] Neither of them, because both turn type checking off for the whole argument.
Why: `fromPartial` lets you leave fields out, but the fields you do give must match, so a number where a string belongs is an error. `fromAny` takes anything and never fails. It keeps autocomplete, but autocomplete only helps you type: it isn't a check.
```

```final-test migrate-to-shoehorn-big-request
The TypeScript tests in your yoga-studio website fake a whole request object, with twenty fields, only to pass one class id. Each test ends in `as Request`. You want every one rewritten to give only the fields that matter, without touching the real code. Which fits best?
- [x] Swap each cast for a helper that takes partial data.
  > Right: that's `/migrate-to-shoehorn`.
- [ ] Write new failing tests one slice at a time, then the code to pass them.
  > That's `/tdd`. That builds new behaviour test-first. Here the tests exist; only the way they build fake data needs to change.
- [ ] Reshape the function's interface so it asks for fewer params.
  > That's `/codebase-design`. You asked to leave the real code alone, and the Request type may not be yours to change.
Why: The tests already exist, and you only want to change how they build fake data. That's migrate-to-shoehorn's job. `as Type` becomes `fromPartial()`, which takes the few fields you give and still checks them.
```

```final-test migrate-to-shoehorn-new-rule
Your booking page needs a new rule. A class that's full shows a waiting-list button instead of "Book". Nothing about it exists yet, and you want it built with tests that last. Which fits best?
- [x] Write one failing test, then only enough code to pass it, then the next.
  > Right: that's `/tdd`.
- [ ] Install a partial-data library and swap the casts in the existing tests.
  > That's `/migrate-to-shoehorn`. It only rewrites how existing tests build fake data. It never builds a new feature.
- [ ] Build throwaway code first to try the button on a few cases.
  > That's `/prototype`. The rule is already decided. A prototype answers an open question, and it stays off main.
Why: The rule is new and already decided, so you build it test-first with tdd. migrate-to-shoehorn only cleans up tests that already exist, and a prototype is for open questions.
```

```final-test migrate-to-shoehorn-fix-the-type
Your booking function takes a whole twenty-field request, but only ever reads the class id. Every test fakes the full object. The function is your own code, and you want those big fakes gone for good. Which fits best?
- [x] Narrow the function's interface so it asks only for the class id it actually uses.
  > Right: that's `/codebase-design`.
- [ ] Swap each test's cast for a helper that takes partial data and still type-checks it.
  > That's `/migrate-to-shoehorn`. That leaves the loose type in place. shoehorn's README calls huge test objects a sign of loose types; it suits code you can't change.
- [ ] Write one failing test first, then only enough code to pass it, one slice at a time.
  > That's `/tdd`. That builds new behaviour test-first. Nothing new is needed; the function just asks for more than it uses.
Why: A function should ask only for the data it needs, and huge test objects are a sign that it doesn't. The code is yours, so fix the interface and the big fakes go away. shoehorn suits legacy code and third-party types you can't change.
```

```final-test migrate-to-shoehorn-after-rewrite
Your agent has replaced the casts in your website's tests with shoehorn helpers and added their imports. What comes next in the checklist it follows?
- [x] Run the type check, to confirm the rewritten tests still compile.
  > Right: that's `/migrate-to-shoehorn`.
- [ ] Write the pull request's description, showing what changed and that it works.
  > That's `/pr`. The checklist isn't finished. Its last step, the type check, hasn't run yet.
- [ ] Review the change against the Spec and the coding standards.
  > That's `/code-review`. First the rewrite has to be checked to compile. The checklist ends with a type check.
Why: Its checklist ends with a type check, which verifies the rewritten tests. The migration isn't done until that has run, so the pull request and the review come after it.
```

```final-test migrate-to-shoehorn-deeper-stack-depth
A team's tests pass real, deeply linked objects into `fromPartial`. Under tsgo, 38 of their test files fail with TS2321, "Excessive stack depth". They patch shoehorn's partial type once with `pnpm patch`, instead of editing 38 tests. Why is that the better fix?
- [x] Every failure came from one shared type, so fixing that type once clears all 38 files and any test added later.
- [ ] tsgo is only a preview, so its errors don't count, and the patch just silences a false alarm until it ships.
  > The patch changes the type so the compiler stops early. Wrong member types, unknown keys and wrong nested types still error. And TypeScript 7 already ships this compiler as its `tsc`.
- [ ] TypeScript 6's `tsc` fails those same 38 files too, so the tests were broken all along and needed the type rewritten.
  > The reporter says TypeScript 6's `tsc` gets through their test files. Only tsgo reports the 88 errors.
Why: All 88 errors came from the same comparison, against one shared type. So one patch to that type made them all go away, and ordinary partial mocks behave the same. That fixes the shared cause, instead of working around it in 38 files.
```

```sources
- [migrate-to-shoehorn: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/migrate-to-shoehorn/SKILL.md), Matt Pocock's Skills
- [tdd: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/SKILL.md), Matt Pocock's Skills
- [codebase-design: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/codebase-design/SKILL.md), Matt Pocock's Skills
- [Testing with TypeScript is Painful: Here's a Solution | Total TypeScript](https://www.totaltypescript.com/testing-with-typescript-is-painful-heres-a-solution), Matt Pocock
- [Release v0.1.0 · total-typescript/shoehorn](https://github.com/total-typescript/shoehorn/releases/tag/v0.1.0), github-actions, 2023-04-11
- [Added migrate to shoehorn script · mattpocock/skills@64b2f99](https://github.com/mattpocock/skills/commit/64b2f9924555a561896157b17606c042cd01053c), Matt Pocock, 2026-02-03
- [mattpocock/skills skills/misc/README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/README.md), Matt Pocock
- [misc: demote to a non-promoted bucket · mattpocock/skills@7efc3d2](https://github.com/mattpocock/skills/commit/7efc3d2a3899c141f4d64e11be2227e0049db626), Matt Pocock, 2026-07-01
- [Add SCOPE.md, issue forms, and out-of-scope records · mattpocock/skills@f0588cd](https://github.com/mattpocock/skills/commit/f0588cd3aebe87556bbfc9d82a640e06900be7d0), Matt Pocock, 2026-10-06
- [mattpocock/skills .out-of-scope/frozen-misc-skills.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock
- [GitHub - total-typescript/shoehorn: Work seamlessly with partial mocks in TypeScript.](https://github.com/total-typescript/shoehorn), Matt Pocock
- [Getting type errors with Axios · Issue #6 · total-typescript/shoehorn](https://github.com/total-typescript/shoehorn/issues/6), charliematters, 2023-06-13
- [npm-install | npm Docs](https://docs.npmjs.com/cli/v11/commands/npm-install/), npm, Inc.
- [4 skills under `skills/misc/` missing from plugin.json's `skills` array · Issue #164 · mattpocock/skills](https://github.com/mattpocock/skills/issues/164), xiaolai, 2026-05-11
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [`fromPartial` hits "Excessive stack depth" when passed a full value of a large recursive type · Issue #22 · total-typescript/shoehorn](https://github.com/total-typescript/shoehorn/issues/22), DrJKL, 2026-10-05
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
```
