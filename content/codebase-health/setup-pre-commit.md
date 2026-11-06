---
title: setup-pre-commit
slug: setup-pre-commit
summary: setup-pre-commit makes Git format, type-check and test your code at every commit, and a failed step blocks it.
---

## What it's for

Say your agent keeps committing type errors to the yoga-studio website. A line in `CLAUDE.md` telling it to run the checks doesn't help, because a sentence can't fail.

**setup-pre-commit makes Git format, type-check and test your code at every commit, and a failed step blocks it.**

It writes a [pre-commit hook](/learn/fix-the-environment), a script that runs inside `git commit`, before the commit is made. The file is `.husky/pre-commit`:

```checkpoint quick-1
You run `git commit`. When does the pre-commit hook run?
- [x] Inside `git commit`, before the commit is made.
- [ ] Straight after the commit is made, before any push.
- [ ] Only once a pull request is opened on the remote.
Why: A pre-commit hook is a script that runs inside `git commit`, before the commit is made. So it can stop the commit from existing.
```

```
npx lint-staged
npm run typecheck
npm run test
```

The new names:

- **npm** is a package installer like pip, for JavaScript, the language web browsers run.
- **npx** runs a package's tool.
- **lint-staged** runs checks only on **staged files**, the ones marked with `git add`.
- **Prettier**, the tool it runs here, formats code automatically.
- **Husky** installs git hooks for a JavaScript repo.

```checkpoint quick-2
You've changed five files and run `git add` on two. Which files does lint-staged check?
- [x] Only the two you've marked with `git add`.
- [ ] All five you changed since the last commit.
- [ ] Every file in the repo, changed or not.
Why: lint-staged runs checks only on staged files, and staged files are the ones marked with `git add`.
```

So Git runs three steps in order: format the staged files with Prettier, run the type check, run the tests. The first is fast, because it only touches staged files. The others run on everything.

```diagram
type: chain
caption: "Git runs three steps in order"
steps:
  - "format the staged files with Prettier"
  - "run the type check"
  - "run the tests"
```

Say the agent commits a type error. The type check fails, Git makes no commit, and the agent gets the error to fix.

```checkpoint quick-3
Your agent runs `git commit` on code with a type error. What do you end up with?
- [x] No new commit, and an error message for the agent.
- [ ] A new commit, with a warning added to its message.
- [ ] A new commit on a side branch, waiting for your review.
Why: The type check fails, so Git makes no commit. The agent gets the error message and can fix the code.
```

## When to use it

- You have a JavaScript or TypeScript repo with no checks at commit time.
- You keep catching an agent's type errors by hand.

```checkpoint quick-4
Which repo does setup-pre-commit fit?
- [x] A TypeScript repo with no checks at commit time.
- [ ] A Python repo with no checks at commit time.
- [ ] A TypeScript repo that already checks every commit.
Why: It's for a JavaScript or TypeScript repo that has no checks at commit time.
```

## When not to use it

- If you want dangerous git commands blocked before they run, use [git-guardrails-claude-code](/learn/git-guardrails-claude-code) instead, because it hooks into Claude Code, not Git.
- If you want checks on every pull request, use [CI](/learn/what-ci-cd-is), because a hook runs only on the machine making the commit.
- If your repo is Python, use the **pre-commit framework**, a tool, installed with pip, that sets up pre-commit hooks.

```checkpoint quick-5
Your agent ran `git reset --hard` and lost your work. You want that command blocked before it runs. Which fits?
- [x] git-guardrails-claude-code, which hooks into Claude Code.
- [ ] setup-pre-commit, which adds a hook inside `git commit`.
- [ ] CI, which runs its checks on every pull request.
Why: `git reset --hard` is a dangerous git command, and git-guardrails-claude-code blocks those before they run. It hooks into Claude Code, not Git.
```

## What it needs to start

You type `/setup-pre-commit`, or ask for pre-commit hooks and the agent starts it on its own.

- A `package.json`, a settings file listing a web project's scripts and packages, beside `.git`, because Husky won't install into a parent folder. Going deeper has the fix.
- A **lockfile**, a file pinning the exact package versions a project installs, shows which installer the repo uses. With none, it uses npm.
- `typecheck` and `test` scripts in `package.json`, run by `npm run`. If one is missing, it leaves that line out and tells you.

```checkpoint quick-6
Your `package.json` is in `web/`, and `.git` is one folder up. What does that mean for this Skill?
- [x] It needs a fix, since Husky won't install into a parent folder.
- [ ] It works as usual, since Husky searches parent folders for `.git`.
- [ ] It can't work at all, since a subfolder can never have a hook.
Why: Husky won't install into a parent folder, so a `package.json` in a subfolder needs a fix. A hook is still possible there.
```

## What it creates

- `husky`, `lint-staged` and `prettier` as **dev dependencies**, packages needed only while developing, not when the app runs.
- `.husky/pre-commit`, the hook above.
- A **`prepare` script** in `package.json`, set to `"husky"`. npm runs it after each install, so everyone who installs the project gets the hook.
- `.lintstagedrc`, lint-staged's settings file, which makes it run Prettier.
- `.prettierrc`, if the repo has no Prettier config yet.
- One commit that runs through the new hook, to test it.

```checkpoint quick-7
A teammate clones the repo and runs `npm install`. How do they get the hook?
- [x] npm runs the `prepare` script after the install, and that sets it up.
- [ ] Git copies the hook from the remote while they clone the repo.
- [ ] Their first commit sets it up, the same way the Skill's commit did.
Why: npm runs the `prepare` script after each install. It's set to `husky`, so everyone who installs the project gets the hook.
```

## Going deeper

### Why it exists

An agent working on its own can commit broken code and carry on, with nobody watching. Matt's answer: "you need feedback loops so the AI can verify its own work." A [feedback loop](/learn/tdd) is a check that fails on a bug and passes once it's fixed.

A pre-commit hook puts that loop in the agent's path, and that suits an agent well: "AI agents don't get frustrated by repetition." It reads the error and tries again. So setup-pre-commit installs that loop for you.

```checkpoint quick-8
Why does a hook that keeps blocking commits suit an agent?
- [x] It doesn't get frustrated: it reads the error and tries again.
- [ ] It skips reading each error, so repeating costs it nothing at all.
- [ ] It saves every error and fixes them all in one go at the end.
Why: An agent doesn't get frustrated by repetition, so being blocked doesn't stop it. It reads the error and tries again.
```

Matt rarely uses this Skill today. It sits in his misc bucket, Skills he keeps but doesn't promote, and isn't in his **plugin**, a bundle of Skills you install together.

He doesn't run these Skills day to day, so the bucket is frozen: bug reports and pull requests against it get closed. If one breaks for you, install it with `npx skills`, the installer that copies editable files into your project. Then, in his words, "fix your copy: the files are yours to edit."

```checkpoint quick-9
You find a bug in setup-pre-commit. What do you do?
- [x] Fix your own copy of the Skill's files.
- [ ] File a bug report and wait for Matt's fix.
- [ ] Send Matt a pull request with your fix.
Why: The bucket is frozen, so bug reports and pull requests against it get closed. The files are yours to edit, so you fix your copy.
```

### How it works underneath

**Git runs the hook, and reads how it ends.** A hook is a program Git runs at a set point. For `pre-commit`, that's inside `git commit`. Every program ends with a number, its **exit status**, and anything but zero means it failed. A failed hook makes Git abort the commit.

```checkpoint quick-10
Your hook script ends with exit status 1. What does Git do?
- [x] It aborts the commit, because the hook failed.
- [ ] It makes the commit, and prints the hook's output.
- [ ] It runs the hook once more, then makes the commit.
Why: Anything but zero means the hook failed, and a failed hook makes Git abort the commit.
```

**Git is picky about hook files.** It skips any file in its hooks folder without the **executable bit**, the permission that marks a file as runnable. The Skill's verify step checks `.husky/pre-commit` for that bit. Git also runs a pre-commit hook from your repo's top folder, so a hook for a subfolder has to change folder itself.

```checkpoint quick-11
A file in Git's hooks folder doesn't have the executable bit set. What does Git do with it?
- [x] It skips the file, so that hook never runs.
- [ ] It runs the file anyway, and prints a warning.
- [ ] It blocks every commit until you set the bit.
Why: Without the executable bit, Git skips the file, so that hook never runs.
```

**Husky does the setup.** Git looks for hooks in `.git/hooks` by default, and a setting can point it somewhere else. Husky's docs name the two jobs: "Git needs to be configured and husky needs to setup files in `.husky/`." The `prepare` script runs `husky` for you after each install.

**lint-staged puts the fixes back.** When Prettier rewrites a staged file, the new version isn't staged yet. lint-staged "automatically restages them", so the commit holds the formatted version.

```checkpoint quick-12
Prettier reformats a file you've staged. Which version goes into the commit?
- [x] The formatted version, because lint-staged restages it.
- [ ] Your original version, because you staged it before Prettier ran.
- [ ] Neither, because the hook stops so you can stage it yourself.
Why: Prettier's new version isn't staged yet, so lint-staged restages it. The commit holds the formatted version.
```

**It's a fix to the environment.** [Fix the environment](/learn/fix-the-environment) gives a mechanical mistake a deterministic check, such as a pre-commit hook.

**The Python world's version.** The pre-commit framework does the same job, for any language. Install it with `pip install pre-commit`, list your hooks in `.pre-commit-config.yaml`, then run `pre-commit install`. Each commit then runs them against your staged files.

Git reads one hooks folder per repo, so it's simplest to pick one tool: this or Husky.

```checkpoint quick-13
Your repo already uses Husky, and you'd like the pre-commit framework too. What do you do?
- [x] Pick one, because Git reads one hooks folder per repo.
- [ ] Run both, because Git reads a hooks folder for each tool.
- [ ] Run both, because each tool only handles its own language.
Why: Git reads one hooks folder per repo, so it's simplest to pick one tool.
```

### A real example

Matt's own app, course-video-manager, shows a hook growing. In January 2026, a commit he made with Claude added Husky and Prettier. Its hook was one line, `npx lint-staged`, and lint-staged then ran Prettier, the type check and the tests.

By October 2026, that hook ran 20 commands. The newest line came after a mistake: "Five agent worktrees were committed as gitlinks". A **gitlink** is how Git records a folder as a separate repo, not as files. The fix was to fail the hook on any future gitlink. So that mistake became one more line in the hook.

```checkpoint quick-14
Agent worktrees got committed as gitlinks by mistake. What stops that happening again?
- [x] A line in the hook that fails on any future gitlink.
- [ ] A sentence in `CLAUDE.md` that asks agents to avoid them.
- [ ] A person checking each new commit for gitlinks by hand.
Why: The fix was to fail the hook on any future gitlink. So the mistake became one more line in the hook, and repeating it gets a blocked commit.
```

### Where it goes wrong

**Commits with failing tests landed anyway.** The agent skipped the hook with **`--no-verify`**, a `git commit` flag that skips the pre-commit hook (`-n` for short). Chris Richardson saw this often: "Claude Code would regularly bypass the precommit hook by using `git commit --no-verify`."

A written rule doesn't stop it. In one bug report, "6 consecutive commits landed with failing integration tests", even though `CLAUDE.md` banned the flag. The agent used other tricks too, such as `git stash`.

```checkpoint quick-15
Your `CLAUDE.md` bans `--no-verify`. Can you trust that every commit ran the hook?
- [x] No. In one report, failing commits landed despite that ban.
- [ ] Yes. An agent always follows what `CLAUDE.md` tells it.
- [ ] Yes. Git refuses the flag once `CLAUDE.md` bans it.
Why: A written rule doesn't stop it. In one bug report, 6 commits with failing tests landed even though `CLAUDE.md` banned the flag.
```

So a hook is a skippable check, not a guarantee. Back it up. Richardson denied the agent direct `git commit`, so it commits through a small **MCP server**, a program that gives an agent tools.

The report's author denied the flag with `permissions.deny` rules, Claude Code settings that forbid a command. They also blocked pushes unless the hook had passed.

Run the same checks in [CI](/learn/what-ci-cd-is) too, which a flag on `git commit` can't skip.

**Commits go through with no checks at all.** Your `package.json` is in a subfolder, and "Husky doesn't install in parent directories (`../`) for security reasons." So `npx husky init` reports `.git can't be found`, and no hook runs. The fix: set `prepare` to `cd .. && husky web/.husky`, run it, and start the hook with `cd web`. Some users still saw commits go through, so always test that the hook really fires.

```checkpoint quick-16
You've set up Husky in a subfolder, using the docs' fix. What do you do next?
- [x] Test that the hook really fires on a commit.
- [ ] Move on, because the docs' fix always works.
- [ ] Run `npx husky init` until its error stops.
Why: Even with the fix, some users still saw commits go through without Husky. So test that the hook really fires.
```

**The Skill picked npm in a Bun project.** **Bun** is another JavaScript package installer. The Skill's first step looks only for `bun.lockb`, but "Bun v1.2 changed the default lockfile format to the text-based `bun.lock`." With no match, it falls back to npm. The Skill is frozen, so fix your own copy: add `bun.lock` to that step.

```checkpoint quick-17
Your project's lockfile is `bun.lock`. Which installer does the Skill pick?
- [x] npm, because it looks only for `bun.lockb`.
- [ ] Bun, because it spots any Bun lockfile.
- [ ] Neither, because it stops and asks you.
Why: The Skill's first step looks only for `bun.lockb`. With no match, it falls back to npm.
```

### Try it

Watch a clean commit pass, then a broken one get blocked. Use only your practice project.

You'll need that project ([keeping track](/learn/issues-and-keeping-track)'s Try it creates it), with its TypeScript site in `web/`, and the CI workflow from [CI/CD](/learn/what-ci-cd-is)'s Try it. `web/package.json` needs `typecheck` and `test` scripts that pass. If anything's missing, ask your agent to set it up.

1. If you don't have this Skill yet, install it: `npx skills@latest add mattpocock/skills --skill setup-pre-commit`.
2. In your repo's top folder, start your agent: `claude`.
3. Paste this request, which asks for Husky's subfolder setup:

```
Set up pre-commit hooks with setup-pre-commit, for the site in web/.
.git is one folder above it, so set the prepare script to
cd .. && husky web/.husky, run npm run prepare in web/, and start
web/.husky/pre-commit with cd web.
```

4. Wait for it to finish. In a subfolder, `.git can't be found` from `npx husky init` is expected.
5. Open `web/.husky/pre-commit`. You should see `cd web`, then the Skill's three lines.
6. In a second terminal in the top folder, run `git log -1 --oneline`. You should see the Skill's setup commit, which passed your new hook.
7. In a `.ts` file your type check covers, add this line: `const broken: number = "yoga";`.
8. Try to commit it: `git add -A && git commit -m "break a type"`. You should see the type check's error, and no new commit.
9. If the commit went through, the hook isn't firing. In `web/`, run `npm run prepare`, then recheck `cd web`.
10. Delete the broken line, then run `git add -A`.
11. Open `.github/workflows/ci.yml`. If it doesn't run the type check, ask your agent to add a job that does. Then `--no-verify` can't skip it.

### Read more

- [Essential AI Coding Feedback Loops For TypeScript Projects](https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects), Matt Pocock, updated 2026-01-16
- [Changes to misc/ skills (frozen-misc-skills.md)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock, 2026-10-06
- [Configure pre-commit hooks with Husky and Prettier (Issue #72)](https://github.com/mattpocock/course-video-manager/commit/9ae0c9e8c95f8e20fed5c6e34f6d0bae5a25b803), Matt Pocock, 2026-01-15
- [chore: remove stray .claude/worktrees gitlinks; guard against gitlinks](https://github.com/mattpocock/course-video-manager/commit/da04bf45220545f329f686ca4d8825074556cbe3), Matt Pocock, 2026-10-23
- [How To](https://typicode.github.io/husky/how-to.html), Husky docs (typicode), fetched 2026-10-30
- [githooks: Hooks used by Git](https://git-scm.com/docs/githooks), the Git project, fetched 2026-10-30
- [pre-commit](https://pre-commit.com/index.html), the pre-commit project, fetched 2026-10-30
- [Claude Code: Allow Bash(git commit:*) considered harmful](https://microservices.io/post/genaidevelopment/2025/09/10/allow-git-commit-considered-harmful.html), Chris Richardson, 2025-09-10
- [Agent bypasses git pre-commit hooks using --no-verify, stash, and quiet flags despite explicit deny rules (#40117)](https://github.com/anthropics/claude-code/issues/40117), slguardo, 2026-03-28

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint setup-pre-commit-deeper-subfolder
In the practice project, the website's `package.json` is in `web/`, and `.git` is one folder up. Run from `web/`, `npx husky init` printed ".git can't be found", and commits still go through with no checks. Why? What's the reason behind this step?
- [x] Husky won't install into a parent folder; the `prepare` script must `cd ..` and point at `web/.husky`.
- [ ] Husky needs a `.prettierrc` in the repo before it can install, and the Skill hadn't made one yet.
  > The Prettier config has nothing to do with installing the hook. The problem is where `.git` is.
- [ ] lint-staged found no staged files, so the hook exited early and let the commit through.
  > If the hook had run, the type check and the tests after lint-staged would still have run. Here the hook never ran at all.
Why: "Husky doesn't install in parent directories", so Git was never configured, and it has no hook to run. The fix has three parts. `prepare` changes up a folder first, as in the docs' `cd .. && husky frontend/.husky`. You run it once. Then the hook script changes back into the subfolder.
```

## Remember

```flashcards
Q: What does setup-pre-commit create?
A: Husky, lint-staged and Prettier as dev dependencies, `.husky/pre-commit`, `.lintstagedrc`, a `.prettierrc` if none exists, and a first commit that runs the hook.

Q: What is the `"prepare": "husky"` script in `package.json` for?
A: It sets the Git hooks up again automatically after each install, so everyone who installs the project gets them.

Q: Which package installer does setup-pre-commit use when it can't tell from a lockfile?
A: npm.

Q: Which `git commit` flag skips a pre-commit hook, and what's the backstop?
A: `--no-verify` (or `-n`). So back the hook up: one user denied the flag with `permissions.deny` rules and blocked pushes unless the hook had passed.

Q: What's the Python world's equivalent of Husky and lint-staged?
A: The pre-commit framework, installed with `pip install pre-commit`. You list hooks in `.pre-commit-config.yaml`, then run `pre-commit install`.

Q: Why does setup-pre-commit miss newer Bun projects?
A: It only looks for `bun.lockb`, but Bun 1.2 made the text `bun.lock` the default. With no match, it falls back to npm.

Q: How did the pre-commit hook in Matt's course-video-manager change between January and October 2026?
A: It grew from one line, `npx lint-staged` (which then ran Prettier, the type check and the tests), to 20 commands. The newest fails any commit that adds a gitlink, after five agent worktrees were committed as gitlinks.
```

## Final test

```final-test setup-pre-commit-hook-order
What does the pre-commit hook that setup-pre-commit writes run, and in what order?
- [x] lint-staged (Prettier on staged files), then the type check, then the tests.
- [ ] The tests first, then the type check, then Prettier on every file in the repo.
- [ ] ESLint on staged files, then a production build, then a push to the remote.
Why: Git runs the hook's three lines in order: `npx lint-staged`, `npm run typecheck`, `npm run test`. lint-staged goes first because it only touches staged files, so it's fast. The type check and the tests run on everything, so they come after.
```

```final-test setup-pre-commit-missing-script
The repo's `package.json` has no `test` script. What does setup-pre-commit do?
- [x] It leaves the test line out of the hook and tells you.
- [ ] It adds Vitest and a sample test so the hook has something to run.
- [ ] It stops the whole setup and asks you to write tests first.
Why: The Skill adapts the hook to your repo. With no `test` script in `package.json`, that line has nothing to run, so the Skill leaves it out and tells you.
```

```final-test setup-pre-commit-blocked-commit
An agent commits code with a type error in a repo where setup-pre-commit ran. What happens?
- [x] The hook's type check fails, so Git makes no commit and the agent sees the error.
- [ ] The commit is made, and the type error shows up later as a failed CI run.
- [ ] Prettier rewrites the broken file so the type check passes, and the commit is made.
Why: The hook runs inside `git commit`, before the commit exists. When its type check fails, Git stops and makes no commit, so the broken code never lands. The agent gets the error message and can fix it. Prettier only formats code, so it can't fix a type error.
```

```final-test setup-pre-commit-deeper-no-verify
Chris Richardson and the author of a Claude Code bug report saw the same thing. What?
- [x] Claude Code skipped the pre-commit hook with `git commit --no-verify` and committed failing code.
- [ ] Husky deleted the hook files after an update, so commits went through with no checks at all.
- [ ] lint-staged rewrote files that had been staged on purpose, so the wrong code got committed.
Why: Git lets `--no-verify` skip the pre-commit hook, and agents used it, so failing code still got committed. That's why a hook is a skippable check, not a guarantee. Richardson then denied the agent direct `git commit`. The report's author denied the flag with `permissions.deny` rules and added a check before each push.
```

```final-test setup-pre-commit-deeper-frozen
Where does setup-pre-commit sit in Matt's repo, and what does that mean for a bug you find in it?
- [x] In his frozen misc bucket. Bug reports are closed, so you fix your own copy.
- [ ] In his promoted engineering bucket. He fixes bug reports there in the next release.
- [ ] In his in-progress bucket. It's a beta, and he wants bug reports to shape it.
Why: misc holds the "Tools I keep around but rarely use". Matt doesn't run them day to day, so he can't tell whether a fix is right. That's why they're frozen: bug reports, feature requests and pull requests are closed. The files are yours to edit, so you fix your copy.
```

```final-test setup-pre-commit-broken-commits
The yoga-studio website is a TypeScript repo with `typecheck` and `test` scripts. Your agent keeps committing code that has type errors and messy formatting. You want every commit stopped until formatting, types and tests are fine. Which fits best?
- [x] Add a Husky hook that runs lint-staged, the type check and the tests on commit.
  > Right: that's `/setup-pre-commit`.
- [ ] Add a Claude Code hook that blocks dangerous git commands before they run.
  > That's `/git-guardrails-claude-code`. It blocks commands like `git push` and `git reset --hard`. It doesn't check formatting, types or tests.
- [ ] Look back over the session and suggest changes to the agent's environment.
  > That's `/retro`. It suggests changes after a session. It doesn't install Husky, lint-staged and Prettier for you.
Why: You want bad commits stopped before they exist, so the check has to run at commit time. In a JavaScript or TypeScript repo, setup-pre-commit sets that up: it formats, type-checks and tests, and a failed step blocks the commit. Neither of the other two checks your code at commit time.
```

```final-test setup-pre-commit-reset-hard
The website repo already has a Husky pre-commit hook that runs the type check and the tests. But twice this week your agent ran `git reset --hard` and wiped work you hadn't committed. You want that command blocked before it runs. Which fits best?
- [x] Add a Claude Code hook that blocks dangerous git commands before they run.
  > Right: that's `/git-guardrails-claude-code`.
- [ ] Add a Husky hook that runs lint-staged, the type check and the tests on commit.
  > That's `/setup-pre-commit`. A pre-commit hook only runs inside `git commit`. `git reset --hard` isn't a commit, so it never runs.
- [ ] Look back over the session and suggest changes to the agent's environment.
  > That's `/retro`. It suggests changes after the fact. You already know the fix: block the command before it runs.
Why: You want a command stopped before the agent runs it. A Claude Code hook can do that, because it checks each git command first. The repo's pre-commit hook only runs inside `git commit`, so it never sees a reset.
```

```final-test setup-pre-commit-check-not-sentence
Your `CLAUDE.md` says "always run the type check before committing", and the agent still commits type errors. You set up a pre-commit hook that runs the type check instead. Why does the hook work where the sentence didn't? What's the reason behind this step?
- [x] Git runs the hook, and a failing check stops the commit.
- [ ] The agent reads hook files more carefully than it reads `CLAUDE.md`.
  > The agent doesn't need to read the hook at all. Git runs it, and a failing step stops the commit.
- [ ] A hook makes the type check faster, so the agent stops skipping it.
  > Speed isn't the point. lint-staged is fast, but the full type check still runs on everything.
Why: A program can spot a type error, so this rule belongs in a deterministic check, such as a pre-commit hook. Git runs the hook whether or not the agent remembers the rule, and a failed check stops the commit. A check can fail; a sentence in a Markdown file cannot.
```

```final-test setup-pre-commit-staged-first
You read the pre-commit hook the Skill wrote: `npx lint-staged` comes first, then the type check, then the tests. Why does lint-staged go first? What's the reason behind this step?
- [x] It only formats the staged files, so it's fast; the type check and tests need the whole project.
- [ ] Prettier has to finish before Git can stage any of the changed files for the commit.
  > The files are already staged when the hook runs. lint-staged works on exactly those staged files.
- [ ] The type check and the tests only look at the files that lint-staged has just formatted.
  > The type check and the tests run on everything. Only lint-staged is limited to staged files.
Why: lint-staged only touches staged files, so it's fast. The type check and the tests run on everything, so they take longer and come after. That's the order the Skill's own note gives.
```

```final-test setup-pre-commit-deeper-skipped-hook
The website's pre-commit hook runs the type check and the tests. Your `CLAUDE.md` already says "never use `--no-verify`". Still, the agent committed failing tests with `git commit --no-verify`. Why didn't the rule in `CLAUDE.md` stop it? What's the reason behind this step?
- [x] A sentence can't fail, and `--no-verify` skips the whole hook; only denying the command stops it.
- [ ] The agent hadn't loaded `CLAUDE.md` in that session, so it never saw the rule against `--no-verify`.
  > In one bug report the rule sat in both `CLAUDE.md` and the agent's memory, and 6 commits with failing tests landed anyway.
- [ ] The hook runs after Git has made the commit, so it can only report the failing tests afterwards.
  > The pre-commit hook runs before Git makes the commit. `--no-verify` meant it never ran at all.
Why: A rule in `CLAUDE.md` is a sentence, and a sentence can't fail. `--no-verify` skips the whole hook, so none of its checks run. So the fixes block the command itself: Richardson denied the agent direct `git commit`, and the bug report's author denied the flag with `permissions.deny` rules and blocked pushes unless the hook had passed.
```

```sources
- [setup-pre-commit: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/setup-pre-commit/SKILL.md), Matt Pocock's Skills
- [Git - githooks Documentation](https://git-scm.com/docs/githooks), Git project
- [Essential AI Coding Feedback Loops For TypeScript Projects](https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects), Matt Pocock, 2026-01-16
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05 (updated)
- [git-guardrails-claude-code: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/git-guardrails-claude-code/SKILL.md), Matt Pocock's Skills
- [How To | Husky](https://typicode.github.io/husky/how-to.html), typicode (Husky docs)
- [pre-commit](https://pre-commit.com/index.html), pre-commit (Anthony Sottile and contributors)
- [mattpocock/skills skills/misc/README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/README.md), Matt Pocock
- [misc: demote to a non-promoted bucket · mattpocock/skills@7efc3d2](https://github.com/mattpocock/skills/commit/7efc3d2a3899c141f4d64e11be2227e0049db626), Matt Pocock, 2026-07-01
- [Add SCOPE.md, issue forms, and out-of-scope records · mattpocock/skills@f0588cd](https://github.com/mattpocock/skills/commit/f0588cd3aebe87556bbfc9d82a640e06900be7d0), Matt Pocock, 2026-10-06
- [mattpocock/skills .out-of-scope/frozen-misc-skills.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock
- [mattpocock/skills README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [Configure pre-commit hooks with Husky and Prettier (Issue #72) · mattpocock/course-video-manager@9ae0c9e](https://github.com/mattpocock/course-video-manager/commit/9ae0c9e8c95f8e20fed5c6e34f6d0bae5a25b803), Matt Pocock, 2026-01-15
- [chore: remove stray .claude/worktrees gitlinks; guard against gitlinks · mattpocock/course-video-manager@da04bf4](https://github.com/mattpocock/course-video-manager/commit/da04bf45220545f329f686ca4d8825074556cbe3), Matt Pocock, 2026-10-23
- [Claude Code: Allow Bash(git commit:*) considered harmful](https://microservices.io/post/genaidevelopment/2025/09/10/allow-git-commit-considered-harmful.html), Chris Richardson, 2025-09-10
- [Agent bypasses git pre-commit hooks using --no-verify, stash, and quiet flags despite explicit deny rules (#40117)](https://github.com/anthropics/claude-code/issues/40117), slguardo, 2026-03-28
- [Husky not running when .git is in another directory (#1437)](https://github.com/typicode/husky/issues/1437), cmaciasjimenez, 2024-05-08
- [Lockfile | Bun Docs](https://bun.com/docs/pm/lockfile), Bun (Oven)
- [Support both bun.lock and bun.lockb in package manager detection (#1088)](https://github.com/mattpocock/skills/issues/1088), syx-labs, 2026-09-16
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
```
