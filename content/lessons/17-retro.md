---
title: Retro
slug: retro
order: 17
part: 4
---

Every session leaves clues about what slowed the agent down. `/retro` reads them and proposes a fix in the repo for each one, so the next session doesn't trip over the same thing.

```goals
- You'll be able to explain what `/retro` changes (the agent's environment, not your code) and run it at the right moment: in the session it reviews, before `/clear`.
- You'll be able to send each finding to the right home: a failing check for a mechanical slip, `CODING_STANDARDS.md` for a judgement call, a pointer for slow searching, and a new rule in `CLAUDE.md` almost never.
- You'll be able to explain why Matt never runs `/init`, and what earns a line in a steering file.
- You'll be able to review any document an agent reads with `/writing-for-agents`: sharpen its context pointers, cut its no-ops, and state what you want instead of what you don't.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Watch one work and you'll see it stumble. It needs twenty searches to find one file. It runs `npm install` in a project set up for pnpm (npm and pnpm are package managers: tools that download a project's libraries). The reviewer (a second agent that checks the finished change) misses a mistake it should have caught. And the feature gets built anyway, because ==the agent doesn't complain==.

Next session, the same struggles happen again. A session is one conversation, from starting `claude` until you clear it or quit, and each one starts blank. Claude Code's auto memory sometimes saves a note for later, but only when it judges one worth keeping. Nothing reliably changes unless the fix is written into the repo: the project folder the agent works in, with its history tracked by Git, the tool that records every change.

The usual reflex is a new line in `CLAUDE.md`, the file of standing instructions Claude Code loads into every session: "Use pnpm, not npm." But that file only grows, and every session pays for every line, relevant or not.

Matt Pocock, a developer and teacher, publishes a popular set of Skills for Claude Code. A Skill is a short instruction file the agent loads when you type its name or when a task matches its description. Matt noticed he was doing this upkeep by hand: tidying steering files (files like `CLAUDE.md` that load into every session to steer the agent), adding lint rules (automatic checks that flag code patterns), making files easier to find. So he bundled it into `/retro`, short for retrospective, which joined his main set in version 1.3, released in early October 2026. It looks back at a session and suggests improvements to the agent's ==environment==: the steering files, docs, automated checks, tools and access around your code.

```callout big-idea
`/retro` doesn't fix the bug the agent shipped. It looks for the gap in the repo that let the bug through, and proposes the check, pointer or rule that closes it.
```

## The idea: fix the environment, not the code

`/retro` is user-invoked: only you can start it, by typing `/retro` at the start of a message. Plain words like "let's do a retro" won't start it. When it runs, it does four things:

1. **Loads `/writing-for-agents`**, Matt's reference on writing for agents, as the style guide for anything it proposes, on every run.
2. **Reads the session's record.** By default that's the current session; name another and it searches the session logs Claude Code keeps on your machine, under `~/.claude/projects/`.
3. **Hunts for candidates in seven categories.**
4. **Lists them most severe first**, and stops there. Nothing changes until you pick one.

| Category | What went wrong | Where the fix goes |
|---|---|---|
| Navigation | Finding a file or fact took ages | A navigation pointer in a file the agent already opens |
| Automated checks | A slip a tool could have flagged | A check: lint, a type check, a test, a commit hook, a CI job |
| Coding standards | A judgement call got past the reviewer, or a standard is unclear | Add, clarify or remove a rule in `CODING_STANDARDS.md` |
| Global AGENTS.md | `CLAUDE.md` or its twin `AGENTS.md`, in the repo or your personal one for every project, has grown big | Move its rules into standards or checks |
| Tool economy | A tool call (a search, a command) cost far more than it was worth | A cheaper tool, or a different one |
| No-ops | Steering lines that change nothing | Cut them |
| Information access | Information the agent couldn't see | More access: an app's log saved to a file, read-only access to a service |

A type check confirms the code's pieces fit together; a test runs code and checks the answers. A pre-commit hook runs checks every time you commit (save a snapshot of your changes in Git); CI, short for continuous integration, runs them on a server every time you push (send your commits to a shared copy, say on GitHub).

**Mechanical or judgement?** Before it proposes any rule, `/retro` sorts the mistake. A ==mechanical== one follows a fixed pattern: a banned function, the wrong import, a file in the wrong folder, the wrong package manager. That gets an automated check, because, as Matt's docs put it, "a check can fail and a sentence in a standards file can't." Only genuine judgement calls, like "matches the surrounding style", become written rules. A repo where no hook or CI job runs lint, types or tests is a finding by itself. If a check exists but nothing runs it, the finding is to wire it up.

**The reviewer enforces standards, not the builder.** The agent implementing a change is under the most context pressure: it explores, writes code and debugs, all in one context window (its working memory for the session, measured in tokens, the chunks of text AI usage is counted in). The reviewer gets a diff (the list of changed lines) and has room to spare. So standards go in `CODING_STANDARDS.md`, which Matt's code-review Skill always reads when it exists. Type that Skill as `/mattpocock-skills:code-review`, because plain `/code-review` can run Claude Code's own Built-in bug hunt instead (see [Skills](/learn/skills)). No Skill ships the standards file: `/retro` proposes creating it the first time it finds a judgement-call rule.

```scene flow
title: Where a retro finding lands
node: struggle | A moment the agent struggled
node: sort | What kind of problem is it?
node: check | Mechanical: a check that fails | side
node: standard | Judgement call: CODING_STANDARDS.md | side
node: pointer | Slow to find: a navigation pointer | side
node: pick | You choose what gets built
# `/retro` reads the session's record and finds a moment the agent struggled.
at: struggle
# It sorts the problem before it proposes anything.
at: sort
# A fixed pattern, like the wrong package manager, gets a check that fails, not a sentence.
at: check
# A matter of taste becomes a rule in the coding standards the reviewer reads.
at: standard
# A file that took twenty searches gets a pointer from a file the agent already reads.
at: pointer
# The candidates arrive most severe first, and nothing changes until you pick.
at: pick
```

```checkpoint reviewer-has-room
Your team keeps a 900-line list of judgement-call rules, such as when a function has grown big enough to split. By `/retro`'s reasoning, where do those rules do the most good?
- [ ] In `CLAUDE.md`, so the builder follows them from the first line it writes.
  > The builder is already juggling exploring, coding and debugging. Hundreds of rules on top get followed unevenly.
- [x] With the reviewer, which only reads a diff, not the whole codebase.
  > Right. The reviewer has the least context pressure, so it has room to apply every rule. That's why standards live in `CODING_STANDARDS.md`.
- [ ] Split across both, so each agent enforces half of them.
  > Halving the list doesn't change who has room for it. Review is where the rules belong.
- [ ] Nowhere: rules that long should become one big lint check.
  > Checks are for fixed patterns. Judgement calls need a reviewer that reads them.
```

## A real retro, step by step

This site hasn't had a retro yet, so here is Matt's own, from his October 2026 launch video, run over a batch of his recent sessions.

```scene chat
title: Matt's retro over his recent sessions (paraphrased; his messages are illustrative)
# Matt points the Skill at his recent sessions. It loads `/writing-for-agents`, then reads their records.
you: `/retro` look back over my recent sessions
# Candidates arrive most severe first, each worded for what happened. The top one: something public that can't be undone.
agent: **1.** An agent published a release (a new numbered version) without asking you first.
# Next, a missing guardrail. A check script exists, but nothing runs it.
agent: **2.** There's a `pnpm check` script, but nothing runs it. Add a CI job.
# Long sessions were losing instructions each time `/compact` shrank the conversation into a summary.
agent: **3.** Repeated instructions get lost when long sessions are compacted. Move them into a Skill.
# Then the tools: one costs too much, one can't be reached.
agent: **4.** A custom command-line tool wastes tokens.
agent: **5.** Another custom tool isn't on the PATH, the list of folders the terminal searches for commands.
# Matt overrules the order. A release can be recut, so number 1 isn't serious. Number 3 he'll build.
you: 1 doesn't matter, I can cut another release. Let's do 3.
```

Every candidate pointed at something real, and Matt's first move was to argue with the ranking: the order is a first draft, not a verdict.

## Your part: when to run it, and how to judge the list

- **Run it before you clear.** `/clear`, a Built-in command (one that comes with Claude Code), empties the working context, where the struggles live. So run `/retro` in the session it reviews. In Matt's Main flow, his path from idea to shipped, it's the last step, after the code review and `/pr`, the Skill that writes a pull request's description (a pull request asks to merge your changes into the main project; see [The main flow](/learn/main-flow)).
- **Already cleared?** In a fresh session, type `/retro` followed by the session you mean, for example `/retro my previous session in this repo, where the agent couldn't find the config file`. It searches the logs for it.
- **Pick sessions worth learning from:** ones that were harder than they should have been. After `/diagnosing-bugs` (Matt's Skill for hard bugs) fixes one, run `/retro` in the same session to ask what would have prevented it (see [Diagnosing bugs](/learn/diagnosing-bugs)). After a smooth session, skip it: you'll mostly get rules nobody needed.
- **Trace every candidate, and question the order.** Throw out any you can't link to a specific moment in the session, or to a plain fact about the repo, such as nothing running its checks. Late in a long session, the agent can forget mid-session struggles and pad the categories with generic advice. And the ranking can put a noisy but harmless slip above a silent, costly one.
- **Build what you accept like any other change.** A new check is code: try it on the repo before it blocks anyone's work. One bug report on Matt's repo says accepted changes were left uncommitted, so run `git status` (it lists what changed) afterwards.
- **Prune checks yourself.** `/retro` judges the sessions you show it, not how its past proposals have fared since, so it can't tell you that last month's rule now fires on good code.

Don't confuse it with its neighbours. Matt's code review gives a verdict on code. `/improve-codebase-architecture` hunts for structural improvements to the code (see [Architecture](/learn/architecture)). `/retro` works from a session's history and improves the environment.

```checkpoint untraceable-candidate
`/retro` lists five candidates after a session where the agent kept running the wrong test command. Number four says "Add more comments to improve readability." Nothing in the session involved comments. What do you do with it?
- [ ] Accept it; the Skill ranked it, so it must have found something.
  > A ranking isn't evidence. A candidate you can't trace to the session or the repo is probably filler.
- [ ] Put it in `CLAUDE.md` so every session sees it.
  > That spends every session's context on advice nobody needed, and it's vague enough to change nothing.
- [ ] Rerun `/retro` until the list has no generic items.
  > Rerunning burns tokens and can produce new filler. Judging the list is your job.
- [x] Discard it: nothing in the session or the repo backs it.
  > Right. A real candidate traces to a moment in the session or to a plain fact about the repo, like a missing guardrail. Generic advice that fits neither gets dropped.
```

## Steering files, and why Matt never runs `/init`

`CLAUDE.md` is a steering file: Claude Code puts its contents into the context window of every session in the repo. `AGENTS.md` is the same idea under a name other agents read; Claude Code reads it instead only when there's no `CLAUDE.md` (see [How coding agents work](/learn/how-agents-work)). Claude Code also has a Built-in command, `/init`, that writes a starter `CLAUDE.md` describing your project.

In February 2026 Matt published a video called "Never Run claude /init". His advice: never run it, and delete any steering file you think an agent wrote. He cited a study that found unnecessary requirements in these files make tasks harder. His reasons:

- **The start of the window is fixed.** Exploring, building and testing take more or less room depending on the task. What's loaded at the start, including `CLAUDE.md`, never shrinks, and you pay for it on every request.
- **It's global.** A line about React, a tool for building web pages, helps a session on the pages and is dead weight in a database or docs session.
- **There's an instruction budget.** He estimates a model can juggle roughly 300 to 400 instructions at once, about 500 on the biggest models. Lines that don't apply still spend it.
- **What `/init` writes is discoverable or goes stale.** The commands are already in `package.json`, the file that lists a project's scripts. "This is a React app" is plain from the config (settings) files. Notes naming specific files rot the moment you rename one. The agent explores before it builds anyway.

At the time, the only `CLAUDE.md` line in his whole setup said he works on WSL (Linux running inside Windows): hard to discover, and true in every session. General steering preferences, he said, belong in Skills, which load only when needed.

So what earns a line? Mostly ==navigation pointers==, plus the rare fact that's both undiscoverable and relevant to every session. `/retro` sharpens the old rule of thumb (a correction you've made twice is a candidate line): a mechanical repeat mistake becomes a check, a judgement call goes to `CODING_STANDARDS.md`, and only what neither can hold goes in `CLAUDE.md`.

```checkpoint globality
A teammate wants to add five lines to the project's `CLAUDE.md` about a pattern every React component should follow, because sessions that build pages keep skipping it. What's Matt's objection?
- [ ] Five lines is too few; the rule needs a full page of examples to work.
  > Length isn't the problem. Where the lines live is.
- [ ] The agent ignores `CLAUDE.md`, so the lines will have no effect.
  > It reads `CLAUDE.md` in every session. That's exactly why every line costs something.
- [x] Every session pays for them, including ones that never touch React.
  > Right. Steering files are global. Page-building preferences belong in a Skill the agent pulls in when needed, or in the reviewer's standards.
- [ ] They'd only work at the top of `CLAUDE.md`, where the agent reads first.
  > Position doesn't change the cost. Wherever they sit, every session loads them.
```

## Writing for agents: the reference `/retro` loads

`/writing-for-agents` is Matt's guide to writing any document an agent reads: a Skill, a `CLAUDE.md`, a spec (a written plan of what to build), a doc that a pointer leads to. It's model-invoked, so the agent picks it up on its own when you create or edit a Skill or change `CLAUDE.md` or `AGENTS.md`, and you can type it yourself. Until August 2026 it was called writing-great-skills. Its main ideas:

- **Context pointers.** A context pointer is a line the agent always sees that names something it can't see yet, and says when to go and get it. A Skill's description is one; so is a `CLAUDE.md` line naming a doc. How reliably the agent follows it depends on the wording. If the agent never opens a doc it needed, sharpen the pointer before you paste the doc in: key word first, one trigger per distinct case.
- **The two loads.** ==Context load== is what always-loaded material costs the agent: tokens and attention every time it replies. Cognitive load is what it costs you to remember which documents exist. A user-invoked Skill like `/retro` costs the agent no context; you pay by remembering it, which is worth it where your judgement counts.
- **Progressive disclosure.** Material sits on a ladder: steps the agent follows, then reference in the same file, then reference in a separate file behind a pointer. Inline what every case needs; put what only some cases reach behind a pointer, so the top stays readable. The failure is sprawl: a file too long even when every line is true.
- **No-ops.** For each sentence, ask whether it changes what the agent does by default. "Write clean, readable code" doesn't. If a sentence fails, cut all of it; a trimmed no-op is still a no-op. Restating what the agent can look up, like the scripts in `package.json`, is a copy that goes stale. Keep what looking can't reveal: the reason behind a choice, a trap no config file mentions.
- **Leading words.** A compact word the model already knows can anchor a whole behaviour in a few tokens: a *tight* feedback loop (fast and repeatable), a test that goes *red* (fails). A word too feeble to beat the default, like *be thorough*, is itself a no-op; reach for a stronger one, like *relentless*.
- **Say what you want, not what you don't.** A ban drags the forbidden idea into the agent's attention. "Don't write long comments" puts long comments front and centre; "Keep every comment to one line" never mentions them. Keep a prohibition only as a hard guardrail you can't phrase positively, and pair it with the target you want.

```checkpoint no-op-test
A Skill you're writing contains the line "Be careful and think about edge cases." You run the Skill with and without the line, and the agent behaves the same both times. What does `/writing-for-agents` say to do?
- [x] Delete all of it: it doesn't change the default.
  > Right. It changes nothing compared with the default, so it only costs tokens. If you need the behaviour, reach for a stronger leading word.
- [ ] Trim it to "Think about edge cases" to save tokens.
  > A shorter no-op is still a no-op. Delete the whole sentence.
- [ ] Put it in bold so the agent takes it seriously.
  > Formatting doesn't make a line change behaviour. Check by running the document, and delete what fails.
- [ ] Move it into `CLAUDE.md` so it applies to every session.
  > That spreads a line that does nothing across every session.
```

## How Matt and others use it

**Matt Pocock:**

- **He runs it by hand, on samples.** In his October 2026 launch video he said nearly everyone he shows it to wants to automate it. His answer: "No, you don't want to automate this." Left to loop on its own findings, an agent chases false positives and drifts the repo somewhere it shouldn't go. When he has a free moment, he points it at recent sessions, especially one that went wrong.
- **He leans on navigation.** His "prompt of the day" on 2 October 2026 asked `/retro` to read his last ten sessions and find where agents took too long to find information or relied on out-of-date docs. He called navigability an underrated way to save tokens.
- **He reviews the system, not just the code.** In a September 2026 talk on the pull-request bottleneck, just before `/retro` shipped, he argued you should never write the same review comment twice: look back over a week of reviews for the checks and standards that would make the next review lighter. The 1.3.1 Skill reads sessions, not pull requests, so you point it at the sessions behind them.
- **Push to the reviewer, let the builder pull.** In an April 2026 workshop he put it this way: the builder can pull standards in when it has a question, while the reviewer gets them pushed alongside the code.

**Other developers:**

- A user Matt quoted at launch said retro showed their agents bumping into problems nobody had noticed, because the agents' persistence got the features built anyway.
- On Hacker News in October 2026, one developer said he keeps a `CONTRIBUTING.md` and a `CODING_STANDARDS.md` beside the decision records Matt's Skills write, and the agents seem to find those docs and keep them up to date.

## Try it yourself

````try
You need Claude Code installed and signed in, and Git ([Start here](/learn/start-here) covers both), plus Node.js, which runs JavaScript outside a browser. If `git --version` or `node --version` doesn't print a number, install what's missing (for Node.js, the LTS installer from nodejs.org), then open a new terminal. Allow 15 minutes. To stop the agent, press Esc, or choose No at a permission prompt.

1. Make a practice folder, turn it into a Git repo and start Claude Code. If it asks whether you trust this folder, choose Yes.

```sh
mkdir retro-practice
cd retro-practice
git init
claude
```

2. Type a slash and the word retro, without pressing Enter. If `/retro` is in the list that pops up, delete what you typed and go on. If it isn't, delete it, type `/exit`, run this in your terminal to install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode (where the agent only plans and changes no files) is off: if you see "plan mode on" under the prompt box, press Shift+Tab until it changes. Any other mode is fine.
4. Ask for a deliberately weak steering file. If it asks permission to create the file, choose Yes. If it offers better wording, reply: "Keep these exact lines; it's practice."

```text
Create a file called CLAUDE.md containing exactly these four lines:
This project is written in JavaScript.
Write clean, readable code.
Don't use var.
See notes.md.
```

5. Give it a small job: a function plus a test. If it asks permission to create files or run its test, choose Yes.

```text
Write a JavaScript function that counts the words in a string, with a test that runs on Node's built-in test runner.
```

6. Review `CLAUDE.md` with the reference:

```text
/writing-for-agents Review CLAUDE.md line by line. Label each line as a context pointer, a no-op, a copy of something discoverable, or a prohibition, and suggest a better wording or home for each. Report only; leave the file unchanged.
```

7. In the same session, before anything else, type:

```text
/retro
```

8. Read the list without accepting anything. For each candidate, find the moment or the repo fact it points to. Type `/exit` when you're done.

**It's working if:**

- [ ] The review called "Write clean, readable code" a no-op, the JavaScript line discoverable (or a no-op), "Don't use var" a prohibition or a job for a lint rule, and "See notes.md" a weak pointer: it never says when to read the file, which doesn't exist.
- [ ] The review left `CLAUDE.md` unchanged.
- [ ] Right after you sent `/retro`, a line mentioning writing-for-agents showed that Skill loading. If you see none, ask: "Did you load the writing-for-agents skill?"
- [ ] Its candidates came most severe first, and each one points at a moment in this session or a plain fact about the repo.
- [ ] It flagged that nothing runs its test automatically: no pre-commit hook, no CI job.
- [ ] It proposed no new `CLAUDE.md` rule for a slip a check could catch (a sharper `notes.md` pointer is fine), and nothing changed until you chose.
````

## Common mistakes

- **A `CLAUDE.md` line for every repeat mistake.** Mechanical slips get a check; judgement calls go to the reviewer's standards.
- **Running `/init`**, or keeping a steering file an agent generated.
- **Running `/retro` after `/clear`** without naming the old session.
- **Accepting every candidate, or automating the whole thing.** You're the judge.
- **Asking an agent to "streamline" a document.** It optimises for length and cuts behaviour; use the no-op test instead.
- **Typing plain `/code-review` for Matt's reviewer.** Type `/mattpocock-skills:code-review`.

```site-story
Not used on this site yet. The project's `CLAUDE.md` is 17 lines, almost all pointers, mostly an "Agent skills" block in the shape that `/setup-matt-pocock-skills` (Matt's once-per-repo setup Skill) writes. And `package.json` has `lint` and `test` scripts, but no CI job or pre-commit hook runs them, which `/retro` counts as a finding in itself.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| A build was harder than it should have been | `/retro` in that session, before `/clear` |
| Already cleared | A fresh `/retro` that names the old session |
| A mechanical repeat mistake | A check that fails: lint rule, hook or CI job |
| A judgement call the reviewer missed | A rule in `CODING_STANDARDS.md` |
| The agent searched too long | A navigation pointer |
| Tempted by `/init` | Skip it; keep `CLAUDE.md` to pointers and undiscoverable, global facts |
| Writing a Skill or editing `CLAUDE.md` | `/writing-for-agents`: sharpen pointers, delete no-ops, state the positive |

## Final test

```test scenario-repeat-mistake
On a recipe site, the agent keeps adding `moment`, a date library the team dropped months ago, to new code. You run `/retro`. Which proposal fits how it sorts problems?
- [ ] A new line in `CLAUDE.md`: "Never use moment."
  > That's the reflex `/retro` resists. The line loads into every session and can still be ignored.
- [ ] A rule in `CODING_STANDARDS.md` for the reviewer to enforce.
  > Standards are for judgement calls. A banned library is a fixed pattern a tool can catch.
- [x] A lint rule that fails whenever code uses `moment`.
  > Right. It's mechanical, so it gets an automated check, run by a pre-commit hook or a CI job.
- [ ] A commit that strips `moment` out of the new code.
  > That fixes today's code, not the gap that let it in. `/retro` changes the environment, so the next slip gets caught.
```

```test scenario-style-drift
A new page on a recipe site works, but its layout and tone don't match the pages around it, and the reviewer let it through. Where does `/retro` send the fix?
- [x] A rule in `CODING_STANDARDS.md`, which the reviewer reads.
  > Right. "Match the surrounding pages" is a judgement call no tool can enforce, so it becomes a written standard for review.
- [ ] A lint rule that fails the build on any layout difference.
  > No tool can judge whether a page matches its neighbours. Checks are for fixed patterns.
- [ ] A paragraph in `CLAUDE.md` describing the house style.
  > That loads into every session, including ones that never touch pages, and lands on the builder instead of the reviewer.
- [ ] Nothing: the reviewer can't judge taste, so no file can capture it.
  > Judging taste is exactly the reviewer's job, and `CODING_STANDARDS.md` is where it reads the rules.
```

```test scenario-cleared-session
Yesterday's session went badly: the agent kept failing to find a config file. You typed `/clear` at the end and moved on. Today you want to learn from it. What's the best move?
- [ ] Type `/retro` with nothing else; it reviews the current session by default.
  > The current session is today's, which hasn't struggled with anything yet.
- [ ] Skip it; once a session is cleared, its record is gone for good.
  > `/clear` empties the working context, but the session's log stays on disk.
- [ ] Describe yesterday's problems from memory, then add them to `CLAUDE.md`.
  > Your memory loses the details, and `CLAUDE.md` is the wrong home for most fixes anyway.
- [x] Start `/retro` and name yesterday's session, so it reads that log.
  > Right. Claude Code keeps each session's record on disk, and `/retro` searches those logs when you name the session.
```

```test scenario-which-skill
No session went wrong, but before a teammate joins you want to check whether your 40-line `CLAUDE.md` pulls its weight. Which Skill fits?
- [ ] `/retro`, because it reads files rather than sessions.
  > It's the other way round: it reads a session's record. With nothing gone wrong, it has little to work from and mostly proposes rules nobody needed.
- [ ] `/mattpocock-skills:code-review`, because the file is in the repo.
  > It checks a diff against standards and a spec, not how well a steering file is written.
- [x] `/writing-for-agents`, because an agent reads that file.
  > Right. Its rules on pointers, no-ops and pruning apply to any steering file, with or without a session behind it.
- [ ] `/improve-codebase-architecture`, because it surveys the whole repo.
  > That looks for structural improvements to the code, not to the documents agents read.
```

```test scenario-earns-a-line
You're pruning a teammate's `CLAUDE.md`. Which line earns its place there?
- [x] "Payments: read docs/payments.md before changing checkout code."
  > Right. It's a navigation pointer with a clear trigger, the main thing a steering file is for.
- [ ] "This project is a Next.js app written in TypeScript, styled with Tailwind."
  > The config files already say so. A copy of something the agent can look up costs every session and goes stale.
- [ ] "Run `npm test` before every commit to run the whole test suite."
  > That's mechanical, so it belongs in a pre-commit hook, where a check can fail and a sentence can't.
- [ ] "Always write well-tested, maintainable and readable code."
  > A no-op: the agent already aims for that, so the line changes nothing.
```

```test spot-negation
Dana's `error-messages` Skill, which the agent loads whenever it writes an error message, says "Don't use technical jargon." Since she added that line, the messages mention stack traces and status codes even more. Spot the mistake.
- [ ] The line should be in capitals so the agent takes it seriously.
  > Emphasis doesn't help. The ban itself keeps jargon in the agent's attention.
- [x] The ban names the unwanted behaviour instead of the wanted one.
  > Right. Negation backfires. "Write every error message in words a customer would use" states the target and never mentions jargon.
- [ ] A Skill is read only once, when it's installed.
  > It loads each time a task matches its description, so the agent did see the line.
- [ ] The rule belongs in `AGENTS.md`, which the agent obeys more strictly.
  > Claude Code reads `AGENTS.md` only when there's no `CLAUDE.md`, and a ban there backfires the same way.
```

```test spot-automated-retro
Ravi set up a script that runs `/retro` after every session and accepts everything it proposes. A month later the repo is full of odd rules and checks that fire on good code. Spot the mistake.
- [ ] The script should also have deleted any check that fires on good code.
  > That's more automation on the same unjudged loop. Deciding what to prune takes a human too.
- [ ] He should have kept `/retro` to standards, not checks.
  > Mechanical slips belong in checks. The trouble was that nothing got judged.
- [ ] He should have told it to edit `CLAUDE.md` instead of adding checks.
  > Steering lines would cost every session. The real problem was accepting everything unseen.
- [x] He should have judged each proposal before it went into the repo.
  > Right. Unjudged, it chases false positives and drifts the repo. Matt runs it by hand on a sample of sessions and picks what to build.
```

```test predict-stale-init
Mo's `CLAUDE.md` was written by `/init` months ago. Last week a teammate renamed two files, and since then the agent keeps looking for files that no longer exist. What's going on?
- [ ] The agent forgot the rename because it remembers nothing between sessions.
  > Exploring would find the new names. Something it reads every session still points to the old ones.
- [x] The generated file still names the old files, so it now misleads.
  > Right. Notes about specific files rot as soon as the code changes. Matt's fix is to delete what `/init` wrote and let the agent explore the code itself.
- [ ] The rename wiped an index `/init` built, so search now fails.
  > `/init` builds no index; it only writes a starter `CLAUDE.md`, and that file still names the old files.
- [ ] The file is too short to list every file, so the agent guesses.
  > Length isn't it. A fuller map would go stale faster; what's there now names files that are gone.
```

```test predict-weak-pointer
Your `CLAUDE.md` has the line "See docs/database.md." That doc explains a migration gotcha, but the agent never opens it before changing the database. What does `/writing-for-agents` suggest first?
- [ ] Paste the whole doc into `CLAUDE.md` so it's always loaded.
  > That's the last resort, and it puts database detail into every session. Sharpen the pointer first.
- [ ] Delete the pointer; the agent will find the doc by exploring.
  > A gotcha like this is exactly what exploring misses. The pointer is the right tool; it needs better wording.
- [x] Reword it to say what the doc covers and when to open it.
  > Right. A pointer's wording decides how reliably it fires. Lead with the key word: "Database migrations: read docs/database.md before changing the schema."
- [ ] Move the line to the bottom of `CLAUDE.md` so it's read last.
  > Position isn't the fix. The line never says when the doc matters.
```

```test sequence-retro-timing
You've just built a feature in one session, and a few things went sideways along the way. Which order gets the most out of `/retro`?
- [ ] `/mattpocock-skills:code-review` → `/compact` → `/pr` → `/retro`
  > Compacting swaps the history for a summary, and the mid-session struggles are the details a summary drops.
- [x] `/mattpocock-skills:code-review` → `/pr` → `/retro` → `/clear`
  > Right. Review, write the pull request's description, look back while the session is still in context, then clear.
- [ ] `/retro` → `/mattpocock-skills:code-review` → `/pr` → `/clear`
  > `/retro` looks back on the whole build, review included. It comes last, after the reviewer has had its turn.
- [ ] `/mattpocock-skills:code-review` → `/pr` → `/clear` → `/retro`
  > Typed bare after `/clear`, `/retro` reviews the new, empty session. You'd have to name the old one, and running it before you clear keeps every detail in view.
```

```sources
- [retro SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md) (the four steps, the seven categories, mechanical vs judgement, implementation vs review, which file is for what): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [writing-for-agents SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/writing-for-agents/SKILL.md) and [SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/writing-for-agents/SKILL-MECHANICS.md) (context pointers, the two loads, the information hierarchy, leading words, negation, pruning): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [code-review SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review/SKILL.md) (`CODING_STANDARDS.md` is always a standards source) and [improve-codebase-architecture SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/improve-codebase-architecture/SKILL.md) (structural improvements to the code): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (`/retro` as the last Main flow step, before you clear; after `/diagnosing-bugs`): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (`retro` graduates in 1.3.0, released 2026-10-04; writing-great-skills renamed in 1.2.0, 2026-08-05): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [How Claude remembers your project](https://code.claude.com/docs/en/memory) (`AGENTS.md` is read only when there's no `CLAUDE.md`; auto memory), [Commands](https://code.claude.com/docs/en/commands) (the Built-in `/code-review`, `/init`, `/clear`) and [Sessions](https://code.claude.com/docs/en/sessions) (transcripts under `~/.claude/projects/`), Claude Code docs, read 2026-10-23.
- [The /retro Skill](https://www.aihero.dev/skills-retro), AI Hero docs, updated 2026-10-05, read 2026-10-23.
- [The /writing-for-agents Skill](https://www.aihero.dev/skills-writing-for-agents), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (why he built it 9:38–10:27; one session or a batch 10:27–10:41; what agents hide 10:42–11:16; his findings 11:16–12:34; judging them 12:34–12:50; don't automate 12:50–13:16; run it on a sample 13:16–13:35; the categories 13:35–14:00).
- [Never Run claude /init](https://www.youtube.com/watch?v=9tmsq-Gvx6g), Matt Pocock, 2026-02-24 (never run it 0:00–0:23; the study 0:25–0:40; the fixed start of the window 1:53–3:05; globality 3:08–4:16; discoverable or stale 4:18–7:19; instruction budget 7:19–8:06; steering in Skills 8:07–8:43; his one line 8:54–9:23; trust exploring 10:09–10:20); written version [on AI Hero](https://www.aihero.dev/never-run-claude-init), updated 2026-02-24.
- [Matt Pocock on X, "Prompt of the day"](https://x.com/mattpocockuk/status/2105951409887949107) (`/retro` over his last ten sessions), 2026-10-02.
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock, AI Engineer Paris, 2026-09-25, auto-translated captions, so paraphrased loosely (review the system 20:00–20:35; looking back over a week of reviews 20:36–21:12).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock, AI Engineer, 2026-04-24 (push vs pull 1:27:53–1:29:42; standards pushed to the reviewer 1:32:23–1:32:44).
- [Hacker News comment by gregwebs](https://news.ycombinator.com/item?id=49948336) (`CONTRIBUTING.md` plus `CODING_STANDARDS.md`), 2026-10-03, read 2026-10-23.
- [mattpocock/skills issue #1311](https://github.com/mattpocock/skills/issues/1311) (accepted retro changes left uncommitted), 2026-10-20, read 2026-10-23.
```
