---
title: scaffold-exercises: lay out a course's exercise folders
slug: scaffold-exercises
summary: How scaffold-exercises turns a plan for a course section into numbered exercise folders with placeholder readmes, and why its lint step no longer runs.
image: /images/lessons/scaffold-exercises.jpg
imageAlt: A Hong Kong high-rise wrapped in bamboo scaffolding and yellow netting, its floors numbered before the building is done.
---

## What it's for

Say you're writing a short course on your yoga-studio site's booking API. You've planned the exercises, and each needs a numbered folder with a fixed kind of name. By hand, you'd make and name every folder yourself.

**scaffold-exercises is the Skill that lays out the folders for a course's exercises, with only a placeholder in each, from a plan you give it.**

```checkpoint quick-1
You give scaffold-exercises a plan for a new course section. What do you get?
- [x] The folders for the course's exercises, each holding only a placeholder.
- [ ] Finished exercises, with the problem code and the solutions written.
- [ ] Lessons that teach you the topic yourself, over several sessions.
Why: It lays out the folders for a course's exercises, with only a placeholder in each, from the plan you give it. The writing of the exercises is still to come.
```

Say you ask your agent to scaffold exercises from this plan:

```
Section 01: Booking API Basics
- 01.01 How a booking is stored
- 01.02 Create a booking (explainer + problem + solution)
```

The agent parses the plan, creates the folders and writes a **stub** `readme.md`, a small placeholder file, in each subfolder. It runs the [linter](/learn/fix-the-environment), a tool that checks for mistakes, and fixes errors until the linter passes. Then it [commits](/learn/commits-and-diffs), and you have this:

```
exercises/
  01-booking-api-basics/
    01.01-how-a-booking-is-stored/
      explainer/readme.md
    01.02-create-a-booking/
      explainer/readme.md
      problem/readme.md
      solution/readme.md
```

```checkpoint quick-2
The linter finds an error partway through a run. What does the agent do next?
- [x] It fixes the error and runs the linter again, until it passes.
- [ ] It commits anyway, and lists the error in the commit message.
- [ ] It stops there, and asks you to fix the folder by hand.
Why: The agent fixes errors until the linter passes, and only then commits. So the loop ends with a layout that passed.
```

## When to use it

- You have the plan for a new section of a course laid out like this.
- You're renumbering or moving exercises. It renames folders with **`git mv`**, git's own command for renaming, which the Skill says "preserves git history". It then updates the numbers to keep the order, and re-runs the linter. Git itself stores no record of a rename, though. Its own book calls `git mv` a convenience: a plain `mv`, then [staging](/learn/commits-and-diffs) the change, makes the same commit.

```checkpoint quick-3
You're moving `01.03-embeddings` to `01.04-embeddings`, and you want its history kept. What does the Skill do?
- [x] It renames the folder with `git mv`, then re-runs the linter.
- [ ] It renames the folder with `mv`, and skips the linter after the move.
- [ ] It copies the folder to its new number, and leaves the old one.
Why: The Skill uses `git mv`, which it says preserves git history. It then updates the numbers to keep the order, and re-runs the linter.
```

## When not to use it

If you want to learn a topic yourself, over several sessions, use [teach](/learn/teach) instead, because it writes lessons for you to study. scaffold-exercises only makes placeholder folders for a course other people will take.

```checkpoint quick-4
You want to learn Postgres indexing yourself, over several sessions. Which Skill fits?
- [x] teach, because it writes lessons for you to study over those sessions.
- [ ] scaffold-exercises, because its folders give you a course to study.
- [ ] scaffold-exercises, if every exercise gets only an `explainer/` folder.
Why: teach writes lessons for you to study. scaffold-exercises only makes placeholder folders for a course other people will take.
```

## What it needs to start

- A plan: section names, exercise names and any subfolders you want.
- A repo for the course. The lint step calls **`ai-hero-cli`**, the CLI (command-line tool) whose lint command checks a course's exercise folders. That command is `pnpm ai-hero-cli internal lint`, where `pnpm` runs a project's commands.
- The [Skill](/learn/skills) itself, which you install separately. Its author, Matt Pocock, leaves it out of his plugin, a bundle of his Skills you install in one step.

You can start it yourself, or the agent may start it for you.

```checkpoint quick-5
You ask your agent to scaffold exercises, and you don't name the Skill. What can happen?
- [x] The agent may still start the Skill on its own.
- [ ] Nothing, because only you can start the Skill.
- [ ] The agent refuses until you type the Skill's name.
Why: You can start it yourself, and the agent may also start it when you ask to scaffold exercises. You don't have to name it.
```

One catch: `ai-hero-cli` removed that command in release 0.6.0, a numbered update of the tool. So with a current CLI the lint step can't run (see Going deeper).

```checkpoint quick-6
Your repo has the current `ai-hero-cli`. What happens at the lint step?
- [x] It can't run, because release 0.6.0 removed the command.
- [ ] It runs as normal, because the command is still there.
- [ ] It runs a newer command, which release 0.6.0 added.
Why: Release 0.6.0 removed the lint command the Skill calls. So with a current CLI, the lint step has nothing to run.
```

## What it creates

A git commit holding folders that nest inside each other:

- One folder per section, named `XX-section-name/` inside `exercises/`.
- One folder per exercise, named `XX.YY-exercise-name/` inside its section. Names are **dash-case**: lowercase words joined with hyphens.
- In each exercise, at least one of three subfolders: `problem/` (the student's workspace, with TODOs: marked gaps to fill in), `solution/` (the reference answer) or `explainer/` (ideas only, no TODOs). If the plan doesn't say which, it makes only `explainer/`.
- In each subfolder, a `readme.md` that isn't empty. A stub holds a title, and the Skill also asks for a description.

```checkpoint quick-7
You're naming the first exercise in section 02, about bookings. Which folder name fits?
- [x] `02.01-first-booking/`, inside the section's folder.
- [ ] `02-first-booking/`, at the top of `exercises/`.
- [ ] `02.01_FirstBooking/`, inside the section's folder.
Why: An exercise is `XX.YY-exercise-name/` inside its section. Names are dash-case: lowercase words joined with hyphens.
```

```diagram
type: tree
caption: "folders that nest inside each other"
root:
  label: "`exercises/`"
nodes:
  - label: "`XX-section-name/`"
    note: "One folder per section"
    children:
      - label: "`XX.YY-exercise-name/`"
        note: "In each exercise, at least one of three subfolders"
        children:
          - label: "`problem/`"
            note: "the student's workspace, with TODOs"
          - label: "`solution/`"
            note: "the reference answer"
          - label: "`explainer/`"
            note: "ideas only, no TODOs"
```

## Going deeper

### Why it exists

A course in this layout comes with fussy rules: how folders are numbered, what each holds, what a readme can't contain. They were written for one tool: `ai-hero-cli`, "typically pre-installed in AI Hero exercise repositories." AI Hero is Matt's own course site. The problem is laying out a course's `exercises/` folders in a way that tool accepts.

```checkpoint quick-8
What job was this Skill written to get right?
- [x] Folder layouts that the `ai-hero-cli` tool accepts.
- [ ] The lesson text and the code inside each exercise.
- [ ] The choice of exercises a new course should include.
Why: The layout's rules were written for `ai-hero-cli`. So the problem is laying out a course's `exercises/` folders in a way that tool accepts.
```

Matt wrote the rules into a Skill. The goal it gives the agent is plain: "Create exercise directory structures that pass `pnpm ai-hero-cli internal lint`, then commit with `git commit`." Its first examples, `01-retrieval-skill-building` and `01.03-retrieval-with-bm25`, are a real section and one of its exercises in an AI Hero course repo. Its rules fit that one layout, so it won't suit a course laid out differently as it stands.

Matt rarely uses it now. It sits in misc, one of the folders, or buckets, that he sorts his Skills into. His label for that one: "Tools I keep around but rarely use, not promoted in the plugin." So it gets no docs page on aihero.dev either.

```checkpoint quick-9
You spot a Skill in Matt's misc bucket. What does that tell you?
- [x] He keeps it around but rarely uses it now.
- [ ] He uses it daily and promotes it in his plugin.
- [ ] He's testing it and wants your feedback.
Why: Matt's label for misc is "Tools I keep around but rarely use, not promoted in the plugin." So don't expect a docs page either.
```

### How it works underneath

**A checklist for one linter.** The Skill is a checklist for the linter that used to live inside `ai-hero-cli`, a CLI that helps students navigate and run AI Hero exercises. A changelog is a tool's record of what changed in each release. This one shows the linter growing one rule at a time, and the Skill's "Lint rules summary" lists many of the same rules:

- 0.0.12 is the first release to mention the linter.
- 0.0.13 added a rule against `pnpm run exercise` commands in readmes.
- 0.0.22 added a rule for empty `main.ts` files. `main.ts` is an exercise's code, and the Skill says it needs more than one line.
- 0.0.26 added a rule for speaker notes. The Skill says no `speaker-notes.md` files.
- 0.2.8 added "Support exercises with only README.md (no main.ts)." That's why a stub can hold only a `readme.md`.

**A loop the agent can run alone.** Running the linter is a [feedback loop](/learn/tdd): one command that fails on a mistake and passes once it's fixed. The Skill's last two steps run the linter and "iterate until lint passes". So it doesn't judge the layout itself. A [deterministic check](/learn/fix-the-environment), one that gives the same answer every time, tells it.

```checkpoint quick-10
How does the agent know its layout is right?
- [x] It runs the linter, which is a deterministic check.
- [ ] It reads the folders and judges the layout for itself.
- [ ] It waits for you to review each folder by hand.
Why: Running the linter and fixing errors is a feedback loop the agent can run alone. A check that gives the same answer every time does the judging.
```

Say the agent leaves `01.01-how-a-booking-is-stored/explainer/readme.md` empty. The linter fails, because a `readme.md` must be non-empty. The agent writes a title line, runs the linter again, and this time it passes.

**Who can start it.** It's [model-invoked](/learn/skills): the agent can reach for it by itself. Its file doesn't set `disable-model-invocation: true`, the setting that keeps a Skill for you alone.

### A real example

The section the Skill names in its first example exists. In the AI Hero `cohort-002-skill-building` repo, the folder `01-retrieval-skill-building` holds six exercises. Matt made its latest commit, in December 2025.

GitHub shows `01.01-retrieval-intro`, `01.02-bm25` and `01.05-rank-fusion` as one path down to `explainer/`, with the note "This path skips through empty directories". So each holds only `explainer/`. `01.03-retrieval-with-bm25` holds `problem/` and `solution/`, and so do `01.04-embeddings` and `01.06-query-rewriting`. So a real section mixes both kinds: exercises that are ideas only, and exercises with a problem and its solution. The Skill's `git mv` example moves `01.03-embeddings` to `01.04-embeddings`, the same name as the real exercise, in a section it calls `01-retrieval`.

```checkpoint quick-11
On GitHub, `01.02-bm25/explainer` shows as one path. What does that tell you about `01.02-bm25`?
- [x] It holds `explainer/` and no other folder.
- [ ] It holds `problem/` and `solution/` as well.
- [ ] It holds a `readme.md` and no subfolders.
Why: GitHub's note says the path skips through empty directories. So the exercise holds nothing but `explainer/`.
```

```diagram
type: tree
caption: "The section the Skill names in its first example"
root:
  label: "`01-retrieval-skill-building`"
nodes:
  - label: "`01.01-retrieval-intro`"
    note: "holds only `explainer/`"
  - label: "`01.02-bm25`"
    note: "holds only `explainer/`"
  - label: "`01.03-retrieval-with-bm25`"
    note: "holds `problem/` and `solution/`"
  - label: "`01.04-embeddings`"
    note: "holds `problem/` and `solution/`"
  - label: "`01.05-rank-fusion`"
    note: "holds only `explainer/`"
  - label: "`01.06-query-rewriting`"
    note: "holds `problem/` and `solution/`"
```

That repo's `package.json` runs exercises with `ai-hero-cli exercise`. It asks for `"ai-hero-cli": "^0.2.8"`, a version from before the lint command was removed.

### Where it goes wrong

**The lint step points at a command that's gone.** In July 2026, commit 95406cd cut the CLI's `internal` commands down to one, and `lint` went with them. It deleted the linter's code and its tests. Release 0.6.0 says so: "`ai-hero internal` now exposes only `edit-commit`". The Skill still says to run `pnpm ai-hero-cli internal lint`, so with a current CLI its loop has no check to run.

Treat the missing check as the finding. Say the linter is gone, and go through the "Lint rules summary" in the Skill's file by hand. One rule there is stricter than the folder rule above: an exercise with only `solution/` fails it. Don't report a pass, because folders that match the plan still haven't been checked. The Skill's file still decides what it does, which is why the run above still shows the lint step.

```checkpoint quick-12
The lint command is missing, and every folder matches the plan. What do you report?
- [x] That the linter is gone, and you checked its rules by hand.
- [ ] That the layout passes, because the folders match the plan.
- [ ] Nothing yet, because you're waiting for the Skill to be fixed.
Why: Folders that match the plan still haven't been checked. So say the linter is gone, and go through the Skill's rules yourself.
```

**Your bug report gets closed.** Matt froze misc in October 2026, so bug reports, feature requests and pull requests against these Skills are closed. He isn't running them day to day, so he can't tell whether a fix is right. His advice if one breaks: "install it with skills.sh and fix your copy: the files are yours to edit." He means `npx skills`, the installer, which copies editable files into your project.

```checkpoint quick-13
The Skill breaks for you, and you want it working. What does Matt advise?
- [x] Install it with skills.sh and fix your own copy.
- [ ] Open a pull request against his misc bucket with the fix.
- [ ] Send him a bug report, and wait for the next release.
Why: Bug reports and PRs against misc Skills are closed. So his advice is to install it with skills.sh and fix your copy, since the files are yours to edit.
```

**You installed Matt's plugin, and the Skill isn't there.** `claude plugin install mattpocock-skills` doesn't register it. When someone reported the four misc Skills missing, this one included, Matt replied: "Yep, this is intentional". They aren't promoted, so the plugin leaves them out on purpose. His own install script stopped linking them in September 2026, in pull request #1025. Install this Skill on its own instead, as Try it shows.

```checkpoint quick-14
You installed Matt's plugin, and this Skill isn't there. What's going on?
- [x] It's left out on purpose, so install it on its own.
- [ ] It's a bug in the plugin's list, so report it to Matt.
- [ ] Its name clashes with a Skill that the plugin ships.
Why: Misc Skills aren't promoted, so the plugin leaves them out on purpose. Matt said so when someone reported them missing.
```

### Try it

You'll need your practice project, the yoga-studio booking site. If you haven't set it up, do "Try it: set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. First commit anything you're working on, so `git status` shows nothing to commit. Then make a branch for this run: `git switch -c try-scaffold-exercises`.
2. Install the Skill: `npx skills@latest add mattpocock/skills --skill scaffold-exercises`. If it asks which agent, choose Claude Code.

   You should see its files copied into your project.

3. In the project folder, start a fresh Claude Code session: `claude`.
4. Ask the agent to scaffold exercises from this plan:

   ```
   Section 01: Booking API Basics
   - 01.01 How a booking is stored
   - 01.02 Create a booking (explainer + problem + solution)
   ```

   You should see the agent load the Skill and make the folders. If it doesn't load the Skill, ask for scaffold-exercises by name.

5. Run `find exercises -name readme.md`.

   You should see four paths: one under `01.01-how-a-booking-is-stored/`, and three under `01.02-create-a-booking/`.

6. Open `exercises/01-booking-api-basics/01.02-create-a-booking/problem/readme.md`.

   You should see at least a title, not an empty file.

7. Read what the agent says about the lint step. Your project has no `ai-hero-cli`, so the command can't run. Note whether the agent says so or claims the layout passed.
8. Commit what's left, so it goes with the branch: `git add -A && git commit -m "try scaffold-exercises"`. If git says there's nothing to commit, carry on.
9. Go back: `git switch main`.

   You should see no `exercises/` folder.

10. Delete the branch: `git branch -D try-scaffold-exercises`.

### Read more

- [Changes to misc/ skills (frozen-misc-skills.md)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock, 2026-10-06
- [Updates (commit 8e51ff7, which added scaffold-exercises/SKILL.md)](https://github.com/mattpocock/skills/commit/8e51ff765eb242b65324e9b770526cc53e9db767), Matt Pocock, 2026-02-20
- [misc: demote to a non-promoted bucket (commit 7efc3d2)](https://github.com/mattpocock/skills/commit/7efc3d2a3899c141f4d64e11be2227e0049db626), Matt Pocock, 2026-07-01
- [chore: trim internal namespace to edit-commit only (ai-hero-cli commit 95406cd)](https://github.com/mattpocock/ai-hero-cli/commit/95406cdb1395851ec99b83e2d1851e3d2289bbe7), Matt Pocock, 2026-07-09
- [ai-hero-cli CHANGELOG.md](https://github.com/mattpocock/ai-hero-cli/blob/78a55bb7616a5de0f7ee5d02ad18950988e4fdca/CHANGELOG.md), Matt Pocock, 2026-10-28
- [exercises/01-retrieval-skill-building in cohort-002-skill-building](https://github.com/ai-hero-dev/cohort-002-skill-building/tree/73969f1a1ec65b390f0532bb8ae6c693376fca9e/exercises/01-retrieval-skill-building), ai-hero-dev (latest commit by mattpocock), 2025-12-09
- [4 skills under skills/misc/ missing from plugin.json (issue #164)](https://github.com/mattpocock/skills/issues/164), xiaolai, 2026-05-11

## Remember

```flashcards
Q: What does scaffold-exercises create?
A: Numbered section and exercise folders, a stub `readme.md` in every subfolder, and a git commit.

Q: How does scaffold-exercises name a section and an exercise?
A: A section is `XX-section-name/` inside `exercises/`. An exercise is `XX.YY-exercise-name/` inside its section. Both are dash-case.

Q: In scaffold-exercises' layout, what goes in `problem/`, `solution/` and `explainer/`?
A: `problem/`: the student's workspace with TODOs. `solution/`: the reference answer. `explainer/`: ideas only, no TODOs.

Q: What does scaffold-exercises do after it writes the stub readmes?
A: It runs the linter and fixes errors, again and again, until the linter passes.

Q: Which `ai-hero-cli` release removed the `internal lint` command that scaffold-exercises runs?
A: 0.6.0, from Matt's commit 95406cd on 2026-07-09. That release left `ai-hero internal` with only `edit-commit`.

Q: Which `ai-hero-cli` change lets a scaffold-exercises stub hold only a `readme.md`, with no `main.ts`?
A: Release 0.2.8: "Support exercises with only README.md (no main.ts)."

Q: Does `claude plugin install mattpocock-skills` give you scaffold-exercises?
A: No. misc Skills aren't promoted, so the plugin leaves them out on purpose. Matt's advice is to install it with skills.sh.
```

## Final test

```final-test scaffold-exercises-variants
Which subfolders can an exercise folder hold?
- [x] At least one of `problem/`, `solution/` and `explainer/`, each with its own `readme.md`.
- [ ] Exactly one `lesson/` folder, holding a `readme.md` and a `main.ts` for the student.
- [ ] A `src/` and a `tests/` folder, so each exercise can be run and checked on its own.
Why: An exercise needs at least one of the three: `problem/` is the student's workspace with TODOs, `solution/` is the reference answer, and `explainer/` holds ideas only, with no TODOs. Each one needs a `readme.md` that isn't empty, though a single title line is enough.
```

```final-test scaffold-exercises-stub-default
Your plan names an exercise but doesn't say which subfolders it needs. What does scaffold-exercises make?
- [x] Only an `explainer/` subfolder, with a stub `readme.md` holding a title and a description.
- [ ] All three subfolders, `problem/`, `solution/` and `explainer/`, so nothing is missing later.
- [ ] A `problem/` and a `solution/` subfolder, each with a `main.ts` ready for code.
Why: Your plan names no subfolders, so the default applies: when stubbing, the Skill makes `explainer/` unless the plan says otherwise. It then writes a minimal readme with a title and a description. You get `problem/` or `solution/` only when the plan asks for them.
```

```final-test scaffold-exercises-rename
How does scaffold-exercises rename an exercise folder when it renumbers exercises?
- [x] With `git mv`, which it says preserves git history, then it re-runs the linter.
- [ ] With `mv`, then it skips the linter, since a rename can't break the layout.
- [ ] By copying the folder under its new number and leaving the old one for students who started it.
Why: It uses `git mv`, not `mv`, and says that preserves git history. It then updates the number prefix so the exercises stay in order, and re-runs the linter to check the layout after the move.
```

```final-test scaffold-exercises-deeper-lint-gone
You run scaffold-exercises with a current `ai-hero-cli`. What happens at its lint step?
- [x] It can't run: `ai-hero-cli` 0.6.0 removed `internal lint`, which the Skill still calls.
- [ ] It runs a newer, stricter set of rules that 0.6.0 added, so old stubs fail until fixed.
- [ ] It runs as before, because the Skill was updated to the new command when the CLI changed.
Why: The command isn't there to run. Matt's commit 95406cd removed `lint` from the CLI's `internal` commands, leaving only `edit-commit`, and release 0.6.0 carries that change. The Skill still says to run `pnpm ai-hero-cli internal lint`, so it now calls a command that's gone.
```

```final-test scaffold-exercises-deeper-frozen
Why won't Matt fix scaffold-exercises if you report a bug in it?
- [x] It's in his frozen misc bucket of Skills he doesn't run day to day, so reports are closed.
- [ ] It was deprecated and will be deleted, so any fix would be thrown away with the folder.
- [ ] Only the AI Hero course team may change it, and they take reports through a private tracker.
Why: He froze his misc Skills, so bug reports, feature requests and PRs against them are closed. He isn't running them day to day, so he can't tell whether a fix is right. If it breaks for you, he suggests installing it with skills.sh and fixing your own copy.
```

```final-test scaffold-exercises-new-section
You keep a small course repo where every exercise lives in a numbered folder under `exercises/`, with `problem/`, `solution/` or `explainer/` inside. You've written the plan for the next section: its name and four exercises. You want the empty folders and readmes made, checked by the linter and committed. Which fits best?
- [x] Have the agent turn the plan into numbered folders and stub readmes until the linter passes.
  > Right: that's `/scaffold-exercises`.
- [ ] Have the agent set up a teaching workspace in the repo and write the first lessons.
  > That's `/teach`. teach teaches you a topic over several sessions in its own workspace files. It doesn't lay out empty exercise folders for students.
- [ ] Have the agent split the plan into Tickets, one for each exercise, on the issue tracker.
  > That's `/to-tickets`. Tickets are for work to build later. You already know every folder you want, and you only want them made and checked.
Why: You already have the plan, and you only want the folders made and checked. That's this Skill's whole job. It turns sections and exercises into numbered folders with stub readmes, runs the linter until it passes, then commits.
```

```final-test scaffold-exercises-learn-yourself
You want to really understand Postgres indexing for your FastAPI backend, over a few weeks, with short lessons and practice you come back to. You picture "a course", but you're the only student. Which fits best?
- [x] Have the agent set up a teaching workspace and teach you, one lesson at a time.
  > Right: that's `/teach`.
- [ ] Have the agent lay out numbered exercise folders with problems and solutions for you.
  > That's `/scaffold-exercises`. It only makes empty folders and stub readmes for a course others will take. Nothing in them teaches you anything.
- [ ] Send a background agent to read the Postgres docs and leave one cited file.
  > That's `/research`. One cited file answers a question. You want to learn over weeks, with lessons and practice.
Why: You're the student here, and you'll learn over several sessions, so this is teach's job. It writes self-contained lessons tied to your mission, and keeps the state of your learning in files, including records that drive future sessions. scaffold-exercises writes no teaching at all, only the folder layout.
```

```final-test scaffold-exercises-after-stubs
In your course repo, the agent has parsed your plan, made every section and exercise folder, and written a stub `readme.md` in each subfolder. What should happen next?
- [x] Run the linter, fix any errors and repeat until it passes.
  > Right: that's `/scaffold-exercises`.
- [ ] Open a pull request now, so a reviewer can look at the new folders.
  > That's `/pr`. Nothing has checked the layout yet. The linter runs first, and the agent fixes what it finds.
- [ ] Have a reviewer compare the folders with the plan before anything else.
  > That's `/code-review`. A deterministic check comes first. The linter catches mechanical mistakes, like an empty readme, without a reviewer.
Why: Nothing has checked the layout yet. So the agent runs the linter next, and fixes errors until it passes. The commit comes after that, so it holds a layout that passed.
```

```final-test scaffold-exercises-renumber
Your course repo has `01.03-embeddings` in its first section, and you want a new exercise in its place, so it must become `01.04-embeddings`. You want the folder's git history kept and the layout checked again afterwards. Which fits best?
- [x] Have the agent rename it with `git mv`, update the number and re-run the linter.
  > Right: that's `/scaffold-exercises`.
- [ ] Have the agent build a quick throwaway version of the new exercise first.
  > That's `/prototype`. Nothing here is a design question. The job is a rename that keeps history, then a check.
- [ ] Have the agent write a script that walks you through renaming the folders by hand.
  > That's `/wizard`. A wizard is for steps only a human can take. The agent can rename folders itself.
Why: You want a rename that keeps history, then a check, and that's this Skill's routine for renumbering. It uses `git mv` rather than `mv`, which it says preserves git history. It updates the number prefix to keep the order, then re-runs the linter after the move.
```

```final-test scaffold-exercises-deeper-missing-linter
You ask your agent to scaffold a new section in your course repo, which has the latest `ai-hero-cli`. The folders and stub readmes are made, but at the lint step the shell says the `internal lint` command doesn't exist. What's the best response?
- [x] Report the linter as gone, and go through the rules in the Skill's own summary by hand.
- [ ] Report that the layout passes, since every folder was made exactly as the plan said.
  > Nothing checked the layout. Making the folders as planned isn't the same as passing the rules, like a non-empty readme.
- [ ] Open an issue asking Matt to point the Skill at the new lint command, and wait for the fix.
  > misc Skills are frozen, and reports against them are closed. Meanwhile nothing has checked the layout, and that missing check is the finding.
Why: The Skill's loop relies on a check that `ai-hero-cli` removed in 0.6.0, so nothing has tested the layout. Saying it passed would be false, and waiting won't help, because reports against frozen misc Skills are closed. So say the linter is gone, and check the rules in the Skill's own summary by hand.
```

```sources
- [scaffold-exercises: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/scaffold-exercises/SKILL.md), Matt Pocock's Skills
- [teach: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/teach/SKILL.md), Matt Pocock's Skills
- [mattpocock/ai-hero-cli CHANGELOG.md at 78a55bb](https://github.com/mattpocock/ai-hero-cli/blob/78a55bb7616a5de0f7ee5d02ad18950988e4fdca/CHANGELOG.md), Matt Pocock, 2026-10-28
- [mattpocock/ai-hero-cli README.md at 78a55bb](https://github.com/mattpocock/ai-hero-cli/blob/78a55bb7616a5de0f7ee5d02ad18950988e4fdca/README.md), Matt Pocock
- [mattpocock/skills skills/misc/README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/misc/README.md), Matt Pocock
- [misc: demote to a non-promoted bucket · mattpocock/skills@7efc3d2](https://github.com/mattpocock/skills/commit/7efc3d2a3899c141f4d64e11be2227e0049db626), Matt Pocock, 2026-07-01
- [Add SCOPE.md, issue forms, and out-of-scope records · mattpocock/skills@f0588cd](https://github.com/mattpocock/skills/commit/f0588cd3aebe87556bbfc9d82a640e06900be7d0), Matt Pocock, 2026-10-06
- [mattpocock/skills .out-of-scope/frozen-misc-skills.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [mattpocock/skills CLAUDE.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CLAUDE.md), Matt Pocock, 2026-10-29
- [cohort-002-skill-building/exercises/01-retrieval-skill-building at 73969f1a1ec65b390f0532bb8ae6c693376fca9e · ai-hero-dev/cohort-002-skill-building](https://github.com/ai-hero-dev/cohort-002-skill-building/tree/73969f1a1ec65b390f0532bb8ae6c693376fca9e/exercises/01-retrieval-skill-building), ai-hero-dev (latest commit by mattpocock), 2025-12-09
- [cohort-002-skill-building/exercises/01-retrieval-skill-building/01.03-retrieval-with-bm25 at 73969f1a1ec65b390f0532bb8ae6c693376fca9e · ai-hero-dev/cohort-002-skill-building](https://github.com/ai-hero-dev/cohort-002-skill-building/tree/73969f1a1ec65b390f0532bb8ae6c693376fca9e/exercises/01-retrieval-skill-building/01.03-retrieval-with-bm25), ai-hero-dev (latest commit by mattpocock), 2025-11-18
- [package.json at 73969f1 (ai-hero-dev/cohort-002-skill-building)](https://github.com/ai-hero-dev/cohort-002-skill-building/blob/73969f1a1ec65b390f0532bb8ae6c693376fca9e/package.json), AI Hero (Matt Pocock), 2025-12-09
- [chore: trim internal namespace to edit-commit only · mattpocock/ai-hero-cli@95406cd](https://github.com/mattpocock/ai-hero-cli/commit/95406cdb1395851ec99b83e2d1851e3d2289bbe7), Matt Pocock, 2026-07-09
- [mattpocock/skills commit a496f55](https://github.com/mattpocock/skills/commit/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa), Matt Pocock, 2026-10-29
- [4 skills under `skills/misc/` missing from plugin.json's `skills` array · Issue #164 · mattpocock/skills](https://github.com/mattpocock/skills/issues/164), xiaolai, 2026-05-11
- [link-skills: stop linking misc/ into local skill directories by mattpocock · Pull Request #1025 · mattpocock/skills](https://github.com/mattpocock/skills/pull/1025), Matt Pocock, 2026-09-03
- [Updates · mattpocock/skills@8e51ff7](https://github.com/mattpocock/skills/commit/8e51ff765eb242b65324e9b770526cc53e9db767), Matt Pocock, 2026-02-20
- [cohort-002-skill-building/exercises/01-retrieval-skill-building/01.04-embeddings at 73969f1a1ec65b390f0532bb8ae6c693376fca9e · ai-hero-dev/cohort-002-skill-building](https://github.com/ai-hero-dev/cohort-002-skill-building/tree/73969f1a1ec65b390f0532bb8ae6c693376fca9e/exercises/01-retrieval-skill-building/01.04-embeddings), ai-hero-dev (latest commit by mattpocock), 2025-12-08
- [cohort-002-skill-building/exercises/01-retrieval-skill-building/01.06-query-rewriting at 73969f1a1ec65b390f0532bb8ae6c693376fca9e · ai-hero-dev/cohort-002-skill-building](https://github.com/ai-hero-dev/cohort-002-skill-building/tree/73969f1a1ec65b390f0532bb8ae6c693376fca9e/exercises/01-retrieval-skill-building/01.06-query-rewriting), ai-hero-dev (latest commit by mattpocock), 2025-12-09
- [mattpocock/skills README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [wizard: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wizard/SKILL.md), Matt Pocock's Skills
- [Git Basics: Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository), Scott Chacon and Ben Straub (Pro Git)
```
