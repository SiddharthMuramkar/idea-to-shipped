---
title: setup-ts-deep-modules: enforce package boundaries in TypeScript
slug: setup-ts-deep-modules
summary: setup-ts-deep-modules adds a check to a TypeScript repo that fails when one package imports past another package's public files.
---

## What it's for

Say the yoga site is written in TypeScript (JavaScript with types). It has a `booking` package, a folder that is a [deep module](/learn/codebase-design), with a lot of behaviour behind a small interface. Then you add a `billing` package that imports a file from `booking/lib/`. Nothing complains.

**setup-ts-deep-modules adds a check that fails when another package imports past a package's public files.**

Those public files are its **entry points**: the files at the package's root. Its subfolders are private:

```text
src/packages/booking/
  index.ts    entry point
  client.ts   entry point
  lib/        private
  tests/      private
```

```checkpoint quick-1
Your package has `index.ts` at its root and `pricing.ts` in `lib/`. Which can outside code import?
- [x] Only `index.ts`, because it sits at the package's root.
- [ ] Only `lib/pricing.ts`, because it holds the real behaviour.
- [ ] Both files, because they sit in the same package folder.
Why: Entry points are the files at a package's root, and its subfolders are private. So `index.ts` is public, and `lib/pricing.ts` isn't.
```

You type `/setup-ts-deep-modules`. The agent installs **dependency-cruiser**, a tool that checks which files import which, and adds rules for this shape. Now say `billing` has these imports:

```ts
import { createBooking } from "../booking/index"; // allowed
import { priceFor } from "../booking/lib/pricing"; // the check fails
```

The second is a **deep import**: an import reaching past a package's entry points into its subfolders. Inside a package, files import each other freely, except its tests, which use entry points too.

```checkpoint quick-2
Inside `booking`, `index.ts` imports `lib/pricing.ts`. What does the check do?
- [x] Allows it, because both files are in the same package.
- [ ] Fails it, because `lib/pricing.ts` sits in a subfolder.
- [ ] Fails it, because `index.ts` may import only entry points.
Why: Both files are in the same package, and inside a package, files import each other freely.
```

## When to use it

- You're on a TypeScript repo, and want the deep-module shape enforced by a check, not only agreed on.
- You keep finding code that reaches into a package's internals.

```checkpoint quick-3
You've settled which files are public, but code keeps importing from `lib/` folders. What's missing?
- [x] A check that enforces the shape, not only an agreement.
- [ ] A longer agreement that lists every file that's public.
- [ ] A second package that holds copies of the private files.
Why: This Skill is for when agreeing on the shape isn't enough. It makes a check enforce the shape.
```

## When not to use it

- If you're still designing an interface or a seam, use [codebase-design](/learn/codebase-design) instead, because this Skill only enforces a folder shape.
- **Layering**, rules on which packages may depend on which, is left as a commented stub in the config for you to fill in.
- In a **monorepo**, a repo whose projects a tool links together as packages, use that tool's own package support instead. You'd see a `pnpm-workspace.yaml` file, or a `workspaces` field in `package.json`. That's the advice of Matt Pocock, who wrote the Skill.

```checkpoint quick-4
You want a rule that `ui` must never depend on `billing`. Does this Skill write it?
- [x] No. That's layering, left as a stub for you to fill in.
- [ ] Yes. It writes one rule for each pair of packages it finds.
- [ ] Yes. Its entry-point rules stop packages using each other.
Why: Which packages may depend on which is layering. The Skill leaves it as a commented stub in the config, for you to fill in.
```

## What it needs to start

A TypeScript repo. In the practice project in the Try it below, that's the website in `web/`. It isn't `api/`, the backend (the server code), written in Python with FastAPI, a Python web framework. The Skill is user-invoked: only you can start it, by typing its name.

The agent first works out:

- the package manager, the tool that installs libraries, from the lockfile, the file recording installed versions (npm by default);
- the packages root, the folder holding all packages: `src/packages` if `src/` exists, otherwise `packages`;
- whether a dependency-cruiser config exists, which it merges into and never overwrites.

```checkpoint quick-5
Your repo already has a dependency-cruiser config. What does the agent do with it?
- [x] Merges into it, and never overwrites the file.
- [ ] Replaces it with a fresh config file of its own.
- [ ] Stops, and asks you to delete it before going on.
Why: The agent checks for an existing config first. If there is one, it merges into it and never overwrites it.
```

## What it creates

- `dependency-cruiser` as a dev dependency (used only while developing), and its config, `.dependency-cruiser.cjs`.
- **`lint:boundaries`**, the script that runs the dependency-cruiser rules, in the same command as your [type check](/learn/fix-the-environment).
- An `example` package to copy or delete, whose test imports only its `index.ts` entry point.
- A `README.md` in the packages folder, plus a one-line pointer to it from `CLAUDE.md` or `AGENTS.md`, so agents find the rule.

The agent isn't done until `lint:boundaries` does three things. It passes on the clean example, fails on a deliberate deep import in the example's test, and passes again once that import is reverted. A config that doesn't fail on a violation is worthless.

```checkpoint quick-6
`lint:boundaries` has passed on the clean example. What must happen before the agent is done?
- [x] It must fail on a deliberate deep import, then pass again.
- [ ] Nothing more, because a pass shows that the rules work.
- [ ] It must pass a second time, to show the pass wasn't luck.
Why: A config that doesn't fail on a violation is worthless. So the check must pass, fail on a deliberate deep import, then pass again.
```

```diagram
type: chain
caption: "A config that doesn't fail on a violation is worthless."
steps:
  - "passes on the clean example"
  - "fails on a deliberate deep import"
  - "passes again once that import is reverted"
```

## Going deeper

### Why it exists

[codebase-design](/learn/codebase-design) tells you what a deep module is. It doesn't stop a stray import from reaching past the interface. Matt calls building one in TypeScript "the most-asked question about the skill".

A user pressed him on it in an issue: once you're happy with an interface, how do you enforce it? Without guardrails, they argued, people and AI models alike make a mess of it over time.

Matt replied with three options:

- Wrap the code in a class or an IIFE (a function that runs the moment it's defined). The wrapper "will get enormous".
- Turn it into a package in a monorepo. He says that tooling "is rarely worth it".
- Use a linter like dependency-cruiser, which blocks imports from outside the module. He hadn't tried it, but thought it "might be the closest thing to what you want".

```checkpoint quick-7
You want a deep module, with no giant wrapper and no monorepo tooling. Which of Matt's options is left?
- [x] A linter like dependency-cruiser, to block outside imports.
- [ ] A class or an IIFE wrapped around all the module's code.
- [ ] A package in a monorepo, kept apart from the other code.
Why: The wrapper will get enormous, and monorepo tooling is rarely worth it. That leaves the linter, which Matt hadn't tried but thought might be closest.
```

Three days later he merged this Skill: the third option, tried for real. It also proves its check can fail, with a deliberate deep import. That's [fix the environment](/learn/fix-the-environment) at work: a wrong import gets a check, not a reminder.

This Skill is still in progress. Matt keeps it in his **in-progress bucket**, the folder for his beta Skills. They're public so people can try them and report what breaks. They stay out of the plugin (a bundle of Skills you can install together) and get no docs pages. They "can change or disappear without warning".

```checkpoint quick-8
You build your setup around an in-progress Skill. What should you expect?
- [x] It can change or disappear without warning.
- [ ] It stays fixed until the plugin's next release.
- [ ] It gets a docs page listing each of its changes.
Why: In-progress Skills are beta. They're public on purpose, stay out of the plugin and get no docs pages, and they can change or disappear without warning.
```

You may read on Matt's codebase-design page that this Skill "ships no lint rule". That's wrong: its rules are all at `error` level, so a violation fails the check.

### How it works underneath

**Folder depth decides what's public.** A package here is one folder under the packages root, not an npm package. Its root files are entry points, and anything in a subfolder is private. So a new subfolder never needs a config change. Folder depth isn't what makes a module deep: Matt says "there's no need to use the file system in the construction of deep modules". This Skill uses the file system anyway: it makes folder depth the rule a tool checks.

```checkpoint quick-9
You add a `helpers/` subfolder to a package. What do you change in the config?
- [x] Nothing, because anything in a subfolder is already private.
- [ ] You add `helpers/` to the config's list of private folders.
- [ ] You add one new rule that covers the package's `helpers/`.
Why: Anything in a subfolder is private, so a new subfolder never needs a config change.
```

**One rule covers every package.** dependency-cruiser checks each import against a list of `forbidden` rules. Each rule names a `from` and a `to`, with paths written as regular expressions: text patterns that match paths. In them, `^` means "starts with", `[^/]+` means "one or more characters that aren't a slash", and round brackets, `( )`, capture the part they match. Here's the rule for imports between packages, where `R` is the packages root:

```js
from: { path: `^${R}/([^/]+)/`, pathNot: `^${R}/[^/]+/tests/` },
to: {
  path: PACKAGE_INTERNALS,
  pathNot: `^${R}/$1/`, // same package → intra-package freedom
},
```

- `from.path` matches a file inside a package. Its round brackets capture that package's name, which dependency-cruiser calls **group matching**.
- `from.pathNot` leaves out test files, which have a rule of their own.
- `to.path` uses `PACKAGE_INTERNALS`: anything in a package's subfolder.
- `to.pathNot` lets an import through when its target sits in `$1`, the captured name. `$1` is a **back-reference**. Think of it like `\1` in Python's `re` module.

Say `billing/index.ts` imports `booking/lib/pricing.ts`. `$1` is `billing`, and the target isn't in `billing`, so the rule fires. Now say `booking/index.ts` imports that same file. `$1` is `booking`, so `pathNot` lets it through. Don't split this into one rule per package: `$1` does that job.

```checkpoint quick-10
`ui/index.ts` imports `booking/lib/pricing.ts`. What does this rule do?
- [x] It fires, because `$1` is `ui` and the target isn't in `ui`.
- [ ] It lets it through, because `index.ts` is an entry point.
- [ ] It lets it through, because `$1` matches any package name.
Why: `$1` is the importer's package, here `ui`. The target is in a subfolder of `booking`, not `ui`, so nothing lets it through and the rule fires.
```

**The config's five rules.** You'll see these names when the check fails:

- `entrypoint-boundary-from-app`: app code may import a package's entry points, and nothing deeper.
- `entrypoint-boundary-across-packages`: the rule above.
- `tests-through-entrypoints`: a package's tests use entry points too, even for their own package.
- `tests-folder-is-private`: only tests may import a package's `tests/` folder.
- `no-circular`: no dependency cycles.

**Entry points, not one `index.ts`.** The Skill's first draft made `index.ts` "the only public interface". Before it merged, Matt made every root file an entry point, so a package can expose several small ones. The Skill discourages a **barrel file**: one `index.ts` that re-exports a whole subtree. Think of a Python `__init__.py` that imports everything below it.

### A real example

In August 2026 a user filed an issue saying this Skill "can false-pass when dependency-cruiser cannot parse TypeScript". In other words, its check might pass when it should fail.

A day later they withdrew it. The real cause was a version mismatch: `dependency-cruiser@18.2.0` doesn't support TypeScript 7, and no later stable release does yet. Their agent had blamed the Skill. But the Skill's proof had already refused to call the job done, because the deliberate deep import went undetected.

```checkpoint quick-11
The check never caught the deliberate deep import. What did the Skill's proof do?
- [x] Refused to call the job done, as the import went undetected.
- [ ] Passed, which hid that dependency-cruiser couldn't read the code.
- [ ] Upgraded dependency-cruiser so that it supported TypeScript 7.
Why: dependency-cruiser 18.2.0 doesn't support TypeScript 7, so the deliberate deep import went undetected. The proof refused to finish, which is its job.
```

So the proof did its job. A check you've never seen fail may not be working at all.

### Where it goes wrong

**The check passes, but app code imports a package's internals.** The Skill lets `lint:boundaries` run `depcruise src/packages`, dependency-cruiser's command, and that scan "does not include app importers outside that directory". In issue #1148, `src/app.ts` imported a package's internals. `depcruise src/packages` printed `no dependency violations found`. `depcruise src` also sees app code, and printed `error entrypoint-boundary-from-app`. The proof misses this too, because it only changes the example's test import.

```checkpoint quick-12
`lint:boundaries` runs `depcruise src/packages`, and `src/app.ts` has a deep import. What happens?
- [x] The check passes, because `src/app.ts` is outside the scan.
- [ ] The check fails, because the rule covers app code by name.
- [ ] The scan stops with an error, as `src/app.ts` is unknown.
Why: A scan of `src/packages` doesn't include app files outside that folder. `depcruise src` also sees app code, and catches the same import.
```

```diagram
type: compare
caption: "`depcruise src` also sees app code"
columns: ["`depcruise src/packages`", "`depcruise src`"]
rows:
  - label: "sees app code"
    cells: ["no", "yes"]
  - label: "printed"
    cells: ["`no dependency violations found`", "`error entrypoint-boundary-from-app`"]
```

The fix is to ask for `depcruise src` when the agent writes the script. If you have code outside `src/`, name those folders too. Matt's draft pull request #1225 would make that the default. It would also add a probe to the proof, a temporary app file whose deep import must fail. It hasn't merged yet.

**The deep import never fails the check.** The deliberate deep import goes undetected, so the agent won't finish. Either the rules aren't wired correctly, or dependency-cruiser doesn't support your TypeScript version. Check both, and fix before finishing: a check that can't fail guards nothing. To check the version, run `npx depcruise --info`. An `x` beside `typescript` means it found no TypeScript it supports, so it skips your `.ts` files, and a run may report `0 modules` cruised. On TypeScript 7, move to TypeScript 6: `npm install --save-dev typescript@6`.

**A newer Bun repo gets npm commands.** The Skill spots Bun only by `bun.lockb`, so "a Bun 1.2+ repo with only `bun.lock` falls through to npm". Tell the agent your repo uses Bun. The same draft pull request would fix this.

```checkpoint quick-13
A Bun 1.2+ repo has only a `bun.lock` file. Which package manager does the Skill pick?
- [x] npm, because it looks only for `bun.lockb`.
- [ ] Bun, because it reads the lock file's name.
- [ ] Neither, because it asks you to pick one.
Why: The Skill spots Bun only by `bun.lockb`, so a repo with only `bun.lock` falls through to npm. The draft pull request would fix this.
```

### Try it

You'll need your practice project, the yoga-studio booking site (the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) creates it), with its TypeScript site in `web/`. If `web/` is missing, ask your agent to set it up. Your `web/` and `api/` sit side by side, but no tool links them as packages, so this isn't a monorepo in the sense above. Run this Skill in `web/`, the TypeScript website, never in `api/`, the FastAPI backend.

`web/` must be on TypeScript 6 or older, because dependency-cruiser doesn't support TypeScript 7 yet. In `web/`, run `npx tsc --version`. If it prints `Version 7` and more numbers, ask your agent to move `web/` to TypeScript 6 (`npm install --save-dev typescript@6`) before you start.

1. Open a terminal in `web/`.
2. If there's no `src/` folder, create one: `mkdir src`. The Skill then picks `src/packages` as its packages root.
3. Install the Skill by name, because the plugin won't give you an in-progress one: `npx skills@latest add mattpocock/skills --skill setup-ts-deep-modules`. If it asks, choose Claude Code, in project scope.
4. Start Claude Code, and type `/setup-ts-deep-modules`.
5. When it writes `lint:boundaries`, ask for `depcruise src`.
6. Let it finish. You should see the check pass, fail on the deep import, then pass again. If the deep import never fails, see "The deep import never fails the check" above.
7. In your editor, or by asking the agent, create `src/boundary-probe.ts` in `web/`, holding one deep import: `import "./packages/example/lib/impl";`
8. In a second terminal, in `web/`, run `npm run lint:boundaries`. You should see it fail with `entrypoint-boundary-from-app`.
9. Delete the file (`rm src/boundary-probe.ts`), then run `npm run lint:boundaries` again. You should see it pass.

### Read more

- [How to implement deep modules in practice, issue #458](https://github.com/mattpocock/skills/issues/458), dylanmoz with replies by Matt Pocock, 2026-07-05
- [Add setup-ts-deep-modules skill (in-progress), pull request #505](https://github.com/mattpocock/skills/pull/505), Matt Pocock, 2026-07-10
- [Rename to setup-ts-deep-modules; entry-points model over single barrel, commit 3ea30af](https://github.com/mattpocock/skills/commit/3ea30afc6852debbe5d6ce2835d9ab64e21ae4fa), Matt Pocock, 2026-07-10
- [The in-progress bucket's README](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock, 2026-10-29
- [The /codebase-design Skill](https://www.aihero.dev/skills-codebase-design), Matt Pocock, updated 2026-08-24
- [setup-ts-deep-modules: package-only scan misses app deep imports, issue #1148](https://github.com/mattpocock/skills/issues/1148), dajiaohuang, 2026-10-01
- [setup-ts-deep-modules: scan app code in lint:boundaries, detect bun.lock, draft pull request #1225](https://github.com/mattpocock/skills/pull/1225), Matt Pocock, 2026-10-08
- [Withdrawn: setup-ts-deep-modules and unsupported TypeScript 7, issue #974](https://github.com/mattpocock/skills/issues/974), screenfluent, 2026-08-26
- [Writing dependency-cruiser rules: a tutorial](https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-tutorial.md), Sander Verweij, last updated 2026-09-13

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint setup-ts-deep-modules-proof-blocks
A user's agent runs setup-ts-deep-modules on a repo using TypeScript 7. The deliberate deep import never makes the check fail, so the agent won't call the setup done. It turns out dependency-cruiser 18.2.0 doesn't support TypeScript 7. Why was stopping right?
- [x] A check that can't fail on a violation guards nothing, so the setup isn't done.
- [ ] The rules were too strict, and should be loosened until the step finally passes.
  > Loosening rules can't make a check that never fails work. The cause was an unsupported compiler.
- [ ] The proof step is optional on new compilers, and could have been skipped this once.
  > The proof is the completion criterion for the whole Skill. Here it is what caught the problem.
Why: The deliberate violation went undetected, so a pass from that check would have meant nothing. Refusing to finish kept that setup from being accepted as complete. The user withdrew their issue, saying the proof had done its job.
```

## Remember

```flashcards
Q: What does setup-ts-deep-modules create?
A: dependency-cruiser and its `.dependency-cruiser.cjs` config, a `lint:boundaries` script, an example package, and a packages README with a one-line pointer from `CLAUDE.md` or `AGENTS.md`.

Q: Under setup-ts-deep-modules, which files of a package are private?
A: Anything in any subfolder, such as `lib/` and `tests/`. The files at the package root are its entry points.

Q: What does setup-ts-deep-modules leave for you to fill in?
A: Layering, meaning which packages may depend on which. It's a different concern, left as a commented stub in the config.

Q: In the dependency-cruiser config, what lets each package import its own internals while outsiders can't?
A: Group matching. The brackets in `from.path` capture the importer's package name as `$1`, and `pathNot` lets imports into that same package through.

Q: What three ways to enforce a deep module in TypeScript did Matt give?
A: Wrap it in a class or IIFE, turn it into a package in a monorepo, or use a linter like dependency-cruiser. setup-ts-deep-modules is the third.

Q: Which of Matt's buckets holds setup-ts-deep-modules, and what does that mean?
A: In-progress, his beta bucket. It's public on purpose for feedback, kept out of the plugin, has no docs page, and can change or disappear without warning.
```

## Final test

```final-test setup-ts-deep-modules-public-surface
Under setup-ts-deep-modules, which files of a package are public?
- [x] Its entry points, which are the files at the package root.
- [ ] One designated index.ts file that re-exports everything inside it.
- [ ] Every file in its lib/ subfolder that has at least one export.
Why: The public files are the ones at the package's root, its entry points. There can be several, not one designated `index.ts`. Anything in any subfolder, `lib/` included, is private.
```

```final-test setup-ts-deep-modules-done-when
When is a setup-ts-deep-modules run finished?
- [x] When lint:boundaries passes, fails on a deep import, then passes again.
- [ ] As soon as dependency-cruiser is installed and its config file is written.
- [ ] When the example package's test passes through its index.ts entry point.
Why: A config that doesn't fail on a violation is worthless. So the run finishes only after the agent has seen the check catch a deliberate deep import, then pass again once that import is reverted.
```

```final-test setup-ts-deep-modules-who-starts
Who starts setup-ts-deep-modules?
- [x] You do. It's user-invoked, so an agent never loads it on its own.
- [ ] An agent loads it on its own whenever it notices a TypeScript repo.
- [ ] codebase-design calls it whenever a module's interface is redesigned.
Why: The Skill is user-invoked, so only you can start it, by typing its name. A setting in the Skill's file stops an agent loading it on its own.
```

```final-test setup-ts-deep-modules-scan-scope
`lint:boundaries` passes, yet your app code imports a package's internals. Why did the check miss it?
- [x] It ran depcruise on the packages folder only, so app files outside it went unchecked.
- [ ] The $1 back-references let any file in the repo reach into any package's internals.
- [ ] dependency-cruiser can't read TypeScript files that sit outside a package's folder.
Why: `depcruise <packages-root>` scans only that folder, so it never sees app files outside it. Scanning `src` caught the same import.
```

```final-test setup-ts-deep-modules-matt-linter
Before he built this Skill, what did Matt say about using a linter like dependency-cruiser to enforce deep modules?
- [x] He hadn't tried it, but it might be the closest thing to what was wanted.
- [ ] He had used it for years and called it the only reliable way to do it.
- [ ] He turned it down, saying a monorepo package does the same job better.
Why: It was the third of his three options, after a class or IIFE and a monorepo package, whose tooling he said is rarely worth it. He hadn't tried it yet, and three days later he merged this Skill.
```

```final-test setup-ts-deep-modules-stray-imports
On the yoga site's TypeScript website, code keeps importing files from inside the booking package's lib/ folder instead of its root files. Talking about it hasn't helped. You want a check that fails whenever that happens. Which fits best?
- [x] Install rules that let outsiders import only a package's root files.
  > Right: that's `/setup-ts-deep-modules`.
- [ ] Settle the booking package's interface with the deep-module vocabulary.
  > That's `/codebase-design`. That gives you words to design an interface. It adds no check that fails on a bad import.
- [ ] Scan the codebase for shallow modules worth deepening, as a report.
  > That's `/improve-codebase-architecture`. That finds refactors to make. It doesn't enforce the shape of the packages you already have.
Why: A wrong import is a mechanical mistake, so it should get a check, not another reminder. setup-ts-deep-modules installs dependency-cruiser rules that make a package's entry points the only way in.
```

```final-test setup-ts-deep-modules-undecided
You're about to build a booking package for the yoga site's TypeScript website. You can't yet decide what its interface should expose, or where its seam should go. Which fits best?
- [x] Settle the interface and seam with the deep-module vocabulary.
  > Right: that's `/codebase-design`.
- [ ] Install boundary rules so outsiders can import only its root files.
  > That's `/setup-ts-deep-modules`. That enforces a folder shape once the design exists. It doesn't decide what the interface exposes.
- [ ] Write the first failing test and let the interface fall out of it.
  > That's `/tdd`. Tests go at agreed seams. When the interface's shape is in question, tdd itself calls for the vocabulary first.
Why: You're still deciding what the interface exposes and where the seam goes, and that's codebase-design's job. setup-ts-deep-modules only enforces the folder shape afterwards, and borrows codebase-design's words to do it.
```

```final-test setup-ts-deep-modules-deliberate-deep
setup-ts-deep-modules has installed its rules and the check passes. Next it adds a deep import to the example package's test on purpose, runs the check again, then reverts the import. Why does it do this?
- [x] To see the check fail on a real violation, as a check that never fails proves nothing.
- [ ] To show that a package's own tests are allowed to reach into its internal files directly.
  > The rules forbid that. The import is there to make the check fail with tests-through-entrypoints.
- [ ] To leave a known failure in CI as a reminder for the whole team to fix it later.
  > The import is reverted at once, and the check must pass again before the Skill is done.
Why: A wrong import is mechanical, so it gets a check that gives the same answer every time. But you can trust a check only once you've watched it fail. The Skill calls a config that doesn't fail on a violation worthless.
```

```final-test setup-ts-deep-modules-context-pointer
Besides the README in the packages folder, setup-ts-deep-modules adds one line to the repo's CLAUDE.md (or AGENTS.md) pointing to that README. Why only one line there?
- [x] So agents find the boundary rule from a short pointer, not a full copy.
- [ ] So the dependency-cruiser config can read its rules out of the instruction file.
  > The rules live in .dependency-cruiser.cjs. The pointer is for agents, not for the tool.
- [ ] So CLAUDE.md holds the full convention, with every rule written out in detail.
  > The convention lives in the packages folder's README. The instruction file gets one line.
Why: Every agent working in the repo gets the instruction file, so it should hold short pointers to other files, not the full rules. This one line is what makes an agent discover the boundary rule instead of tripping over it.
```

```final-test setup-ts-deep-modules-app-probe
A repo passed the boundary check while its app code imported a package's internals. Matt's draft fix keeps the test-import step, and adds a second one: a temporary app file with a deep import into the example package must fail. Why add that step?
- [x] A rule is only trusted once you've seen it fail on its own kind of violation.
- [ ] App files are slower to scan, so the probe is there to time the check.
  > Nothing in the issue or the fix is about speed. The old proof never reached the app-import rule at all.
- [ ] The test-import step is flaky, so a second deep import makes the result more likely.
  > The test-import step worked. It just only exercised the tests rule, never the app-import rule.
Why: The old proof only changed a test import, so it could pass without ever reaching the app-import rule. A check you haven't seen fail on a violation proves nothing about that violation.
```

```sources
- [setup-ts-deep-modules: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/setup-ts-deep-modules/SKILL.md), Matt Pocock's Skills
- [codebase-design: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/codebase-design/SKILL.md), Matt Pocock's Skills
- [Add setup-ts-deep-modules skill (in-progress) · Pull Request #505 · mattpocock/skills](https://github.com/mattpocock/skills/pull/505), Matt Pocock, 2026-07-10
- [The /codebase-design Skill](https://www.aihero.dev/skills-codebase-design), Matt Pocock, Updated Aug 24, 2026
- [How to implement deep modules in practice #458](https://github.com/mattpocock/skills/issues/458), dylanmoz (issue); replies by mattpocock, 2026-07-05
- [skills/skills/in-progress/README.md at a496f55 · mattpocock/skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock
- [setup-ts-deep-modules: dependency-cruiser.config.cjs](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/setup-ts-deep-modules/dependency-cruiser.config.cjs), Matt Pocock's Skills
- [Writing dependency-cruiser rules - a tutorial](https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-tutorial.md), Sander Verweij
- [Rename to setup-ts-deep-modules; entry-points model over single barrel · mattpocock/skills@3ea30af](https://github.com/mattpocock/skills/commit/3ea30afc6852debbe5d6ce2835d9ab64e21ae4fa), Matt Pocock, 2026-07-10
- [Withdrawn: setup-ts-deep-modules and unsupported TypeScript 7 · Issue #974 · mattpocock/skills](https://github.com/mattpocock/skills/issues/974), screenfluent, 2026-08-26
- [setup-ts-deep-modules: package-only scan misses app deep imports · Issue #1148 · mattpocock/skills](https://github.com/mattpocock/skills/issues/1148), dajiaohuang, 2026-10-01
- [Pull request #1225 (GitHub REST API)](https://api.github.com/repos/mattpocock/skills/pulls/1225), GitHub
- [setup-ts-deep-modules: scan app code in lint:boundaries, detect bun.lock · Pull Request #1225 · mattpocock/skills](https://github.com/mattpocock/skills/pull/1225), Matt Pocock, 2026-10-08
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [improve-codebase-architecture: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/improve-codebase-architecture/SKILL.md), Matt Pocock's Skills
- [tdd: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/tdd/SKILL.md), Matt Pocock's Skills
```
