---
title: Fix the environment, not just the code
slug: fix-the-environment
summary: When your coding agent repeats a mistake, fix what lets it happen with an automated check or a written standard, not only the broken line.
image: /images/lessons/fix-the-environment.jpg
imageAlt: Inside a glass greenhouse, lush green plants line both sides of a central path under the sunny roof.
---

## Fixing the next run too

Imagine your agent imports `legacy_db`, an old package your project has banned, while it builds Ticket #13, one task on your yoga-studio booking site. You point it out, and it fixes the line. Tomorrow's session starts fresh and makes the same mistake, because nothing around the agent stops it.

```checkpoint quick-1
You corrected the banned import yesterday. Why does today's session make the same mistake?
- [x] The session started fresh, and nothing around the agent stops it.
- [ ] The correction was never saved, so the old import is still on disk.
- [ ] The package is still installed, so the agent has to keep using it.
Why: Yesterday's fix changed one line of code. Today's session starts fresh, and nothing around the agent stops it making the same mistake.
```

**Fixing the code fixes this run; fixing the environment around the agent fixes the next one too.**

```checkpoint quick-2
You can fix the code, or fix the environment around the agent. Which helps the next run?
- [x] Fixing the environment, since fixing the code only fixes this run.
- [ ] Fixing the code, since one corrected line stops the mistake everywhere.
- [ ] Neither, since each run starts over and can't be helped by earlier fixes.
Why: Fixing the code fixes this run. Fixing the environment around the agent fixes the next one too.
```

The **environment** is everything around an agent: its [instruction files](/learn/instruction-files), automated checks, written standards, and **tools** (functions it can ask to run, like reading files).

```checkpoint quick-3
You want to change an agent's environment. Which of these changes counts?
- [x] Adding an automated check that runs on the agent's work.
- [ ] Rewriting by hand the one line the agent got wrong today.
- [ ] Telling the agent in today's chat to be more careful next time.
Why: The environment is everything around an agent, such as its instruction files, automated checks, written standards and tools. One corrected line or one chat message isn't any of those.
```

## Mechanical or a judgement call?

So ask what let the mistake happen, then sort it.

- A **mechanical mistake** has a fixed pattern a program could spot: a banned API, a wrong import, a file in the wrong place. It gets a **deterministic check**: an automated check that gives the same answer every time, such as a [CI](/learn/what-ci-cd-is) job.
- A **judgement call** is a choice code can't check, such as matching the surrounding style. It gets a **coding standard**: a written rule in `CODING_STANDARDS.md`, which the reviewer, a second agent that checks the finished code, reads.

```checkpoint quick-4
Your agent keeps putting test files in the wrong folder. Which fix fits that mistake?
- [x] A deterministic check, because the mistake has a fixed pattern.
- [ ] A coding standard, because only a reviewer could ever spot it.
- [ ] Neither, because where a file goes is a matter of personal taste.
Why: A file in the wrong place is a fixed pattern a program could spot, so it's a mechanical mistake, and it gets a deterministic check.
```

By default, build the check rather than write the standard.

```checkpoint quick-5
A mistake could be sorted either way, and you can't decide. Which do you do?
- [x] Build the check, rather than write the standard.
- [ ] Write the standard, since a check might be wrong.
- [ ] Add a line to `CLAUDE.md` until you can tell which.
Why: By default, you build the check rather than write the standard.
```

```diagram
type: compare
caption: "Mechanical or a judgement call?"
columns: ["A mechanical mistake", "A judgement call"]
rows:
  - cells: ["has a fixed pattern a program could spot", "is a choice code can't check"]
  - cells: ["a banned API, a wrong import, a file in the wrong place", "such as matching the surrounding style"]
  - cells: ["gets a deterministic check", "gets a coding standard"]
footer: "By default, build the check rather than write the standard."
```

## What the fix looks like

The `legacy_db` import is mechanical, so say you add this step to the job in `.github/workflows/ci.yml`:

```yaml
- name: No legacy_db imports
  run: "! grep -rn legacy_db api/"
```

`grep` finds any line in `api/` that mentions `legacy_db`, and `!` turns a match into a failure. Tomorrow's repeat turns the pull request red.

```checkpoint quick-6
You've added the `legacy_db` step, and a later commit imports `legacy_db` in `api/`. What does the step do?
- [x] It fails, because `!` turns the match into a failure.
- [ ] It passes, because `grep` found what it was looking for.
- [ ] It deletes the line, because `grep` removes every match.
Why: `grep` finds the line that mentions `legacy_db`, and `!` turns that match into a failure. So the step fails, and the pull request goes red.
```

## A repo with no checks

A deterministic check can also be:

- a **lint** rule: lint is a tool that checks code for mistakes and style without running it;
- a **type check**: a tool checking that values match their declared types, without running code;
- a **pre-commit hook**: a script that runs automatically inside `git commit`, before the commit is made.

```checkpoint quick-7
You want a check that runs before a commit is even made. Which fits?
- [x] A pre-commit hook, which runs inside `git commit`.
- [ ] A type check, which runs inside the code at run time.
- [ ] A lint rule, which needs the code running to work.
Why: A pre-commit hook runs automatically inside `git commit`, before the commit is made. Lint and a type check both work without running the code.
```

A repo with no pre-commit hook, and no CI job running lint, type check or tests, has no **guardrail**: no automatic check that catches mistakes. That's a problem in itself: a missed chance, not a neutral default.

```checkpoint quick-8
Which of these repos has no guardrail?
- [x] One with tests on disk, but no pre-commit hook and no CI job running them.
- [ ] One with no pre-commit hook, but with a CI job running its lint and tests.
- [ ] One with no CI job at all, but with a pre-commit hook running its lint.
Why: A repo has no guardrail when it has no pre-commit hook and no CI job running its lint, type check or tests. Having tests that nothing runs automatically doesn't count.
```

## Keep instruction files small

Every agent in the repo loads `CLAUDE.md` (or `AGENTS.md`) into its [context window](/learn/context-window). So use it sparingly, mostly for **navigation pointers**: short notes saying where to find something, like `See docs/agents/issue-tracker.md`. A repeat mistake usually doesn't earn a new line there.

```checkpoint quick-9
You're about to add a line to `CLAUDE.md`. Which line fits best?
- [x] A short note saying which file explains the Issue tracker.
- [ ] A reminder to every agent never to import `legacy_db`.
- [ ] A full list of every endpoint the project has so far.
Why: Every agent loads the file into its context window, so it's mostly for navigation pointers. A repeat mistake usually doesn't earn a new line there.
```

## Where it shows up

[retro](/learn/retro) is a [Skill](/learn/skills) that looks back on a finished session and suggests environment changes, not code changes. Run it after a session that went sideways, and after [diagnosing-bugs](/learn/diagnosing-bugs), the Skill for finding hard bugs' causes.

```checkpoint quick-10
A build went sideways, and the code is fixed now. Which Skill do you run, and what does it suggest?
- [x] retro, which suggests changes to the environment, not the code.
- [ ] retro, which suggests changes to the code, not the environment.
- [ ] diagnosing-bugs, which suggests changes to the Spec behind the build.
Why: retro looks back on a session and suggests environment changes, not code changes. You run it after a build, especially one that went sideways.
```

## Going deeper

### Why it exists

You could correct an agent's code by hand every time. But each new session meets the same repo, with the same gaps. Matt Pocock, who wrote the Skills this flow uses, points out that the repo itself shapes the agent: "your code is the environment the agent operates in." Read that as the whole codebase the next session walks into, not the one line you corrected.

That changes the engineer's job. Think of a platform team, which builds the tools other engineers use. Matt says "we are our agents platform team", building the environment they need to succeed.

```checkpoint quick-11
Matt likens the engineer's job to a platform team. What does that team build here?
- [x] The environment the agents need to succeed.
- [ ] The features the agents can't write alone.
- [ ] The AI models the agents themselves run on.
Why: A company's platform team builds the tools its other engineers use. Here the agents are the ones being served, so the job is building their environment.
```

So the work keeps going: keep `AGENTS.md` lean, keep the Skills sharp, add good lint rules, keep the code easy to navigate. Matt did this by hand on his own repos, then bundled it into [retro](/learn/retro).

### How it works underneath

**Why standards go to the reviewer.** All work goes through two stages: implementation, where one agent writes the code, and review, where another checks it. The agent writing the code has the most to fit in its context window, because it explores, writes and debugs. The reviewer agent receives a **diff**, the exact lines a change adds and removes, so it has room to spare. So the reviewer enforces the standards, and `CODING_STANDARDS.md` isn't read while the code is being written.

```checkpoint quick-12
Why does the reviewer agent enforce coding standards, not the agent writing the code?
- [x] It receives a diff, so it has room in its context window.
- [ ] It writes the code itself, so it knows every rule already.
- [ ] It runs before the writing starts, so it can set the rules.
Why: The agent writing the code explores, writes and debugs, so it has the most to fit in its context window. The reviewer receives a diff, so it has room to spare.
```

You may not have that file yet. No Skill ships it: retro proposes creating it the first time a session finds a judgement-call rule.

**Why a check beats a sentence.** Matt's short version: "A check can fail. A sentence in a Markdown file cannot." A written rule for a fixed pattern also costs you again and again. The reviewer agent has to work out the same answer on every future diff. A check you pay for once.

```checkpoint quick-13
You write down a rule for a fixed pattern, instead of building a check. What's the running cost?
- [x] The reviewer agent works out the same answer on every future diff.
- [ ] The check slows down every future CI run by the same small amount.
- [ ] The agent writing the code re-reads the rule before every single edit.
Why: A written rule has to be applied afresh each time, by the reviewer agent, on every future diff. A check you pay for once.
```

**A name for the idea.** In a post, Mitchell Hashimoto, a software engineer, calls this idea "harness engineering". The idea: whenever an agent makes a mistake, you take the time to engineer a fix so it never makes that mistake again. He says he doesn't know of an accepted term.

```checkpoint quick-14
Which of these is harness engineering, as Mitchell Hashimoto means it?
- [x] An agent makes a mistake, and you build a fix so it never recurs.
- [ ] An agent makes a mistake, and you correct that one line by hand.
- [ ] A test harness runs every agent's change in CI before it merges.
Why: Whenever an agent makes a mistake, you take the time to engineer a fix so it never makes that mistake again.
```

It has two forms: better instructions in `AGENTS.md`, and programmed tools, such as scripts that run only the relevant tests.

**Where Matt and Mitchell agree.** Both want tools doing the main work. Mitchell's surest way is to "give the agent fast, high quality tools to automatically tell it when it is wrong."

**Where they differ.** They split on a simple repeat mistake, like the agent running the wrong command. Mitchell adds a line to `AGENTS.md`. In his example file, each line came from a bad agent behaviour, and he says it almost completely resolved them.

Matt's advice is newer. Asked whether to add a line to `CLAUDE.md`, he says "Usually not". That line loads into every session, gives less weight to everything else in the file, and goes out of date as the code changes.

His aim: "Your `AGENTS.md` gets shorter over time, not longer."

```diagram
type: compare
caption: "Where they differ"
columns: ["Mitchell", "Matt"]
rows:
  - label: "a simple repeat mistake"
    cells: ["adds a line to `AGENTS.md`", "Usually not"]
  - label: "`AGENTS.md`"
    cells: ["each line came from a bad agent behaviour", "gets shorter over time, not longer"]
```

[Claude Code's own docs](https://code.claude.com/docs/en/memory) side with Mitchell here. They suggest adding to `CLAUDE.md` when Claude makes the same mistake a second time.

When the two disagree, retro's `SKILL.md`, the file holding its instructions, decides. It says to use these files "incredibly sparingly", so it sides with Matt, and so should you.

```checkpoint quick-15
Mitchell and Matt disagree about a repeat mistake. Whose advice do you follow?
- [x] Matt's, because retro's instructions side with him.
- [ ] Mitchell's, because retro's instructions side with him.
- [ ] Mitchell's, because his post came before Matt's advice.
Why: When the two disagree, retro's `SKILL.md` decides. It says to use these files "incredibly sparingly", so it sides with Matt.
```

**Where the fixes start.** [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) is the first environment fix, made once before your first [Flow](/learn/main-flow), a set path through the Skills. It records where Issues live, any triage labels and the doc layout, and adds a short block to `CLAUDE.md` or `AGENTS.md` that points to them.

### A real example

retro used to send every gap in review to one fix: a new line in `CODING_STANDARDS.md`. In September 2026 Matt merged pull request #1083 to change that. retro now sorts each mistake first, with one default: "build the check over writing the rule".

The same pull request shows the default isn't always followed. Matt's repo bans em-dashes, the long dash, but only through a sentence in `CLAUDE.md`. So the rule was checked by hand, by reading the diff aloud against it. It also notes "No automated test surface for `SKILL.md` prose in this repo".

```checkpoint quick-16
Matt's repo bans em-dashes through one sentence in `CLAUDE.md`. How did his pull request check that rule?
- [x] By hand, reading the diff aloud against the rule.
- [ ] By a new lint rule that fails on any long dash.
- [ ] By a pre-commit hook that removes each long dash.
Why: The rule was checked by hand, by reading the diff aloud against it. The pull request also notes there's no automated test for that kind of text.
```

### Where it goes wrong

**Your `CLAUDE.md` keeps growing.** Each repeat mistake earned a new line, and each line loads into every session. Move the lines out: a mechanical mistake gets a check that fails, and a judgement call goes in the coding standards. Keep the navigation pointers.

**You built a check the repo already had.** Read the repo's own checks first: its CI workflow, and scripts like `lint` in `package.json`, a settings file listing a web project's scripts and packages. A check that exists but isn't wired up, or is quietly broken, is the **finding**: the problem to report and fix. Repair it rather than build a second one.

**A check keeps failing on good code.** Checks pile up, and retro won't flag an old one, because it sees only one session. So you prune them yourself. A rule that fires constantly on good code is the sign to remove it.

```checkpoint quick-17
A lint rule keeps failing on good code, and retro hasn't flagged it. What do you do?
- [x] Remove it yourself, since retro sees only one session.
- [ ] Wait for retro, since it audits last month's rules too.
- [ ] Add a line to `CLAUDE.md` telling agents to ignore it.
Why: retro sees only one session, so it won't flag an old check. You prune checks yourself, and a rule that fires constantly on good code is the sign to remove it.
```

**The repo gets messier as the agents work.** This is software entropy: things drift towards a more disordered state. Matt warns that "agents are producing software entropy at a higher rates than ever." He likes the metaphor of a garden, which left alone gathers weeds. So tend it: run retro on a sample of sessions when you have a free moment. It won't reshape the code ([improve-codebase-architecture](/learn/improve-codebase-architecture), a later Skill, finds the code worth reshaping), but it proposes checks that stop the same mess coming back.

### Try it

Turn one mistake into a check, and watch the check catch it. You'll need your practice project, the yoga-studio booking site, on an up-to-date `main` with nothing uncommitted. If you haven't set the project up, do the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

It also needs a CI check called `test`: a GitHub Actions workflow, `.github/workflows/ci.yml`, that runs on every pull request. The Try it "On GitHub: a `test` check for your practice project", in [What CI/CD is](/learn/what-ci-cd-is), adds it. If you haven't done that Try it, do it first.

1. Update `main` and create a branch: `git switch main && git pull && git switch -c ban-legacy-db`.
2. In `.github/workflows/ci.yml`, add this step after the checkout step, indented 6 spaces to match the `- uses:` line:

```yaml
      - name: No legacy_db imports
        run: "! grep -rn legacy_db api/"
```

3. Commit it: `git add .github/workflows/ci.yml && git commit -m "ci: ban legacy_db"`.
4. Push it: `git push -u origin ban-legacy-db`.
5. Open the pull request: `gh pr create --fill`. Then watch its checks: `sleep 10 && gh pr checks --watch`. You should see `test` pass, and the pull request go green.
6. Add the mistake: `mkdir -p api && echo 'import legacy_db' > api/demo.py`. Commit it and push: `git add api/demo.py && git commit -m "add a banned import" && git push`.
7. Watch again: `sleep 10 && gh pr checks --watch`. You should see `test` fail, and the pull request go red. Then run `gh pr view --web`, and click the **Checks** tab, then `test`. The log of its No legacy_db imports step shows `api/demo.py:1:import legacy_db`.
8. Remove the mistake, then commit and push: `git rm api/demo.py && git commit -m "remove the banned import" && git push`. Watch once more with `sleep 10 && gh pr checks --watch`. You should see `test` pass again.
9. Pick a mistake your agent has made more than once, and sort it. No repeat mistake yet? Say your agent keeps writing code that doesn't match the surrounding style, and sort that.
10. If it's mechanical, add a step like this one, and make it fail once, as you did here. If it's a judgement call, add one line to `CODING_STANDARDS.md`.
11. Run `git diff main -- CLAUDE.md`. You should see no output: your `CLAUDE.md` didn't grow.
12. Commit and push step 10's change.
13. Once green: `gh pr merge --squash --delete-branch && git switch main && git pull`. `main` now has the check.

### Read more

- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer (Gergely Orosz) with Matt Pocock, 2026-09-17
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, updated 2026-10-05
- [The /retro Skill](https://www.aihero.dev/skills-retro), Matt Pocock, updated 2026-10-05
- [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey), Mitchell Hashimoto, 2026-02-05
- [retro: push mechanical coding-standards findings toward deterministic checks (#1083)](https://github.com/mattpocock/skills/pull/1083), Matt Pocock, 2026-09-15

## Remember

```flashcards
Q: Where does a coding standard that needs judgement go?
A: In `CODING_STANDARDS.md`, which is read during review.

Q: Build a check, or write a standard? Which is the default?
A: Build the check.

Q: What should a repo's `CLAUDE.md` (or `AGENTS.md`) mostly hold?
A: Navigation pointers to other files. Every agent in the repo loads it, so use it sparingly.

Q: What does Mitchell Hashimoto mean by "harness engineering"?
A: Whenever an agent makes a mistake, you take the time to engineer a fix so it never makes that mistake again. He says he doesn't know of an accepted term for it.

Q: Which way should `AGENTS.md` go over time, by Mitchell Hashimoto's practice and by Matt's advice?
A: Mitchell adds a line per bad agent behaviour. Matt's gets shorter over time. Matt's is newer, and the current retro `SKILL.md` agrees with him.

Q: Matt's repo has a no-em-dash rule. How did his pull request #1083 check it?
A: By hand: the diff was read against the rule in `CLAUDE.md`. The rule lives only as a sentence there, and the pull request notes no automated test for `SKILL.md` prose.
```

## Final test

```final-test fix-the-environment-banned-import
An agent in your FastAPI repo keeps importing a package the project has banned. What fix does a retro recommend?
- [x] A deterministic check, such as a lint rule or a CI job.
- [ ] A new line in `CLAUDE.md` asking agents not to.
- [ ] A new entry in `CODING_STANDARDS.md` for the reviewer.
Why: A banned import has a fixed pattern a program could spot, so it's a mechanical mistake. That gets a deterministic check, which fails every time the import appears. A written standard is for judgement calls, and `CLAUDE.md` is mostly for navigation pointers.
```

```final-test fix-the-environment-no-guardrail
Your repo has no pre-commit hook and no CI job running lint, type check or tests. How does a retro treat that?
- [x] As a problem in itself.
- [ ] As a neutral default.
- [ ] As fine, as long as the agent runs the tests by hand.
Why: With no guardrail, nothing catches mistakes automatically. A retro reports that as a problem on its own, because it's a missed chance that keeps costing you, not a neutral default.
```

```final-test fix-the-environment-what-changes
After a build that went sideways, what does a retro suggest changing?
- [x] The agent's environment, for the next build.
- [ ] The code the session wrote, so the bug is fixed.
- [ ] The Spec the build came from, so it's clearer.
Why: Fixing the code only helps this run. A retro looks back over the session and suggests changes to the agent's environment instead, so the next build starts from a better place.
```

```final-test fix-the-environment-deeper-check-beats
Why does Matt want a mechanical mistake fixed with a check rather than a written rule?
- [x] A check can fail, and it's paid for once instead of re-judged on every future diff.
- [ ] Only the implementation agent reads CODING_STANDARDS.md, so the reviewer never sees a written rule.
- [ ] Reviewers ignore written rules unless a CI job reminds them to read the standards file.
Why: A sentence in a file can't fail by itself, but a check can. For a fixed pattern, a written rule also makes the reviewer agent work out the same answer on every future diff, while a check is paid for once. And the reviewer is the one who reads `CODING_STANDARDS.md`, so the other two options are wrong.
```

```final-test fix-the-environment-deeper-mitchell-vs
Mitchell Hashimoto and Matt both prefer tools that tell the agent it's wrong. Where do they differ on a simple repeat mistake?
- [x] Mitchell adds a line to AGENTS.md for it; Matt usually says no, and wants that file to get shorter.
- [ ] Mitchell writes a script and leaves AGENTS.md alone; Matt adds a line to AGENTS.md for it instead.
- [ ] Both add a line to AGENTS.md, but Matt also copies the same rule into CODING_STANDARDS.md.
Why: For a simple repeat mistake, like running the wrong command, Mitchell updates `AGENTS.md`. Matt, asked whether to add a line to `CLAUDE.md`, says "Usually not", and wants that file to get shorter over time. Matt's advice is newer, and retro's current instructions agree with him.
```

```sources
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [Git - githooks Documentation](https://git-scm.com/docs/githooks), Git project
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests)
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [AI Skills with Matt Pocock](https://www.youtube.com/watch?v=4DhcSPkEbwI), The Pragmatic Engineer (Gergely Orosz) with Matt Pocock, 2026-09-17
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05 (updated)
- [The /retro Skill](https://www.aihero.dev/skills-retro), Matt Pocock, 2026-10-05
- [retro: push mechanical coding-standards findings toward deterministic checks (#1083)](https://github.com/mattpocock/skills/pull/1083), Matt Pocock (mattpocock), 2026-09-15
- [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey), Mitchell Hashimoto, 2026-02-05
- [Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
```
