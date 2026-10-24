---
title: Retro
slug: retro
order: 17
part: 4
image: /photos/retro.jpg
imageAlt: A person in a green sweater looks at a blue wall covered in yellow sticky notes.
imageCredit: Per Lööv
---

Every session leaves clues about what slowed the agent down. `/retro` reads them and turns each one into a fix for the repo, so the next session doesn't trip over the same thing.

```goals
- You'll be able to explain what `/retro` changes (the agent's environment, not your code) and run it at the right moment: in the session it reviews, before `/clear`.
- You'll be able to send each finding to the right home: a failing check for a mechanical slip, `CODING_STANDARDS.md` for a judgement call, a pointer for slow searching, and almost never a new `CLAUDE.md` line.
- You'll be able to explain why Matt never runs `/init`, and what earns a place in a steering file.
- You'll be able to review any document an agent reads with `/writing-for-agents`: context pointers, the two loads, progressive disclosure, no-ops, leading words and positive phrasing.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Watch one work and you'll see it stumble. It needs twenty searches to find one file. It runs `npm install` in a project that uses a different package manager. The reviewer misses a mistake it should have caught. And the feature gets built anyway, because ==the agent doesn't complain==.

Next session, the same struggles happen again. An agent remembers nothing between sessions (a session is one conversation, from starting `claude` until you clear it or quit), so nothing it learned the hard way carries over unless it's written into the repo: the project folder, tracked with Git, that it works in.

The usual reflex is to add a line to `CLAUDE.md`, the file of standing instructions Claude Code loads at the start of every session: "Use pnpm, not npm." But every line in that file is read in every session, relevant or not, and the file only grows.

Matt Pocock, a developer and teacher, publishes a popular set of Skills for Claude Code. A Skill is a short instruction file the agent loads when you type its name or when a task matches its description. Matt noticed he was doing this upkeep by hand: tidying steering files, adding lint rules, making files easier to find. So he bundled it into `/retro`, short for retrospective, which joined his main set in version 1.3 (September 2026). It looks back at a session and improves the agent's ==environment==: everything around your code that shapes how the agent works, from steering files and docs to automated checks, tools and access.

```callout big-idea
`/retro` doesn't fix the bug the agent shipped. It asks what in the repo let the bug happen, and proposes the check, pointer or rule that stops it next time.
```

## The idea: fix the environment, not the code

`/retro` is user-invoked: only you can start it, by typing `/retro` at the start of a message. Plain words like "let's do a retro" won't start it. When it runs, it does four things:

1. **Loads `/writing-for-agents`**, Matt's reference on writing documents agents read, as its yardstick for judging steering files. It does this every run, even when it only reports.
2. **Reads the session's record.** By default that's the current session; name another and it searches the session logs Claude Code keeps under `~/.claude/projects/`.
3. **Hunts for candidates in seven categories.**
4. **Lists them most severe first**, and stops there. Nothing changes until you pick one.

| What went wrong | Where the fix lands |
|---|---|
| The agent took ages to find a file or fact | A navigation pointer: a line in a file it already reads |
| It made a mistake a tool could have caught | An automated check: a lint rule, a type check, a test, a pre-commit hook, a CI job |
| The reviewer missed a judgement-call mistake | A rule in `CODING_STANDARDS.md` |
| `CLAUDE.md` or `AGENTS.md` is large | Move its steering out, into standards or checks |
| A tool call was expensive for what it returned | Streamline or replace the tool (tool economy) |
| Steering files are full of lines that change nothing | Delete those no-ops |
| The agent needed information it couldn't reach | Widen its access: write the dev server's log to a file, give read-only access to a service |

Lint is a tool that flags code patterns automatically. A pre-commit hook runs checks every time you commit; CI (continuous integration) runs them on a server for every push. Two ideas sit under the table.

**Mechanical or judgement?** Before it proposes any rule, `/retro` sorts the mistake. A ==mechanical== one follows a fixed pattern: a banned function, the wrong import, a file in the wrong folder, the wrong package manager. That gets a deterministic check, because, as Matt's docs put it, "a check can fail and a sentence in a standards file can't." Only genuine judgement calls, like "matches the surrounding style", become written rules. A repo with no guardrail at all (no pre-commit hook and no CI job running its lint, type and test commands) is a finding in itself. And if a check already exists but nothing runs it, the finding is to wire it up, not to build another.

**The reviewer enforces standards, not the builder.** The agent implementing a change is under the most context pressure: it explores, writes code and debugs, all in one context window (its working memory for the session, measured in tokens, the chunks of text AI usage is counted in). The reviewer, like the one inside `/code-review`, gets a diff (the list of changed lines) and has room to spare. So standards go in `CODING_STANDARDS.md`, which `/code-review` always reads when it exists. No Skill ships that file: `/retro` proposes creating it the first time it finds a judgement-call rule.

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
Your team keeps a 900-line list of coding rules. By `/retro`'s reasoning, where do those rules do the most good?
- [ ] In `CLAUDE.md`, so the builder follows them from the first line it writes.
  > The builder is already juggling exploring, coding and debugging. Hundreds of rules on top get followed unevenly.
- [x] With the reviewer, which only has to read a diff.
  > Right. The reviewer has the least context pressure, so it has room to apply every rule. That's why standards live in `CODING_STANDARDS.md`.
- [ ] Split across both, so each agent enforces half of them.
  > Halving the list doesn't change who has room for it. Review is where the rules belong.
- [ ] Nowhere: rules that long should become one big lint check.
  > Only mechanical rules become checks. Judgement calls need a reviewer to read them.
```

## A real retro, step by step

This site hasn't had a retro yet, so here is Matt's own, from the video where he launched the Skill in October 2026. He ran it on one of his recent sessions.

```scene chat
title: Matt's retro on his own repo (paraphrased; his reply is illustrative)
# Matt types the Skill's name. It loads `/writing-for-agents`, then reads the session's record.
you: `/retro`
# Candidates arrive most severe first. The top one: the agent did something public and irreversible.
agent: **1. Irreversible action:** the agent published a release before you'd picked a fix.
# Next, a missing guardrail. A check script exists, but nothing runs it.
agent: **2. No guardrail:** there's a `pnpm check` script, but no CI job runs it. Add one.
# Long sessions were losing instructions each time `/compact` shrank the conversation into a summary.
agent: **3. Steering:** repeated instructions get lost when long sessions are compacted. Move them into a Skill.
# Then the tools: one costs too much, one can't be reached.
agent: **4. Tool economy:** a custom command-line tool returns far more tokens than the job needs.
agent: **5. Information access:** another custom tool isn't on the PATH, the list of folders the shell searches for commands.
# Matt overrules the order. A release can be recut, so number 1 isn't serious. Number 3 he'll build.
you: 1 doesn't matter, I can cut another release. Let's do 3.
```

Every candidate pointed at something that really happened. And Matt's first move was to argue with the ranking: the order is the Skill's first draft, not a verdict.

## Your part: when to run it, and how to judge the list

- **Run it before you clear.** `/clear` is a Built-in command (it comes with Claude Code; it isn't a Skill) that empties the working context, and the struggles live in that context. So run `/retro` in the session it reviews, as the last step of a build: in Matt's Main flow, his path from idea to shipped, it comes after `/code-review` and `/pr` (see [The main flow](/learn/main-flow)). If you've already cleared, or the session has grown past the Smart zone (roughly the first 150k tokens, where the model still thinks clearly), start fresh and point `/retro` at the old session's log.
- **Pick sessions worth learning from:** ones that were harder than they should have been. After `/diagnosing-bugs` fixes a bug, run `/retro` in the same session to ask what would have prevented it (see [Diagnosing bugs](/learn/diagnosing-bugs)). After a smooth session, skip it: you'll mostly get rules nobody needed.
- **Trace every candidate, and question the order.** Throw out any you can't link to a specific moment: late in a long session the agent can forget the mid-session struggles and fill the categories with generic advice. And a quiet, expensive mistake can rank below a loud, cheap one.
- **Build what you accept like any other change.** A new check is code: try it on the repo before it blocks anyone's merges. One GitHub issue reports accepted changes left uncommitted, so check `git status` afterwards.
- **Prune checks yourself.** `/retro` sees one session, so it can't tell you that last month's rule now fires on good code.

Don't confuse it with its neighbours. `/code-review` gives a verdict on code. `/improve-codebase-architecture` improves the code's structure, working from the code alone (see [Architecture](/learn/architecture)). `/retro` works from a session's history and improves the environment.

```checkpoint untraceable-candidate
`/retro` lists five candidates after a session where the agent kept running the wrong test command. Number four says "Add more comments to improve readability." Nothing in the session involved comments. What do you do with it?
- [ ] Accept it; the Skill ranked it, so it must have found something.
  > A ranking isn't evidence. A candidate you can't trace to a moment in the session is probably filler.
- [ ] Put it in `CLAUDE.md` so every session sees it.
  > That spends every session's context on advice nobody needed, and it's vague enough to change nothing.
- [ ] Rerun `/retro` until the list has no generic items.
  > Rerunning burns tokens and can produce new filler. Judging the list is your job.
- [x] Discard it: you can't trace it to the session.
  > Right. Every real candidate points at something that happened. Generic advice gets dropped.
```

## Steering files, and why Matt never runs `/init`

`CLAUDE.md` and `AGENTS.md` (the same idea under a name other agents read too) are steering files: their contents go into the context window of every session in the repo. Claude Code has a Built-in command, `/init`, that writes a starter `CLAUDE.md` describing your project.

In February 2026 Matt published a video called "Never Run claude /init", and the advice is in the title: never run it, and delete any steering file you think an agent wrote. He cited a study that found unnecessary requirements in these files make tasks harder. His reasons:

- **The start of the window is fixed.** Exploring, building and testing all flex with the task. What's loaded at the start, including `CLAUDE.md`, doesn't, and it costs tokens on every request.
- **It's global.** A line about React helps a frontend session and is dead weight in a database or docs session.
- **There's an instruction budget.** He estimates a model can juggle roughly 300 to 400 instructions at once, about 500 on the biggest models. Lines that don't apply still spend it.
- **What `/init` writes is discoverable or goes stale.** The commands are already in `package.json`. "This is a React app" is plain from the config files. Notes naming specific files rot the moment you rename one. The agent explores before it builds anyway.

At the time, the only `CLAUDE.md` line in his whole setup said he works on WSL (Linux running inside Windows): hard to discover, and true in every session. General steering preferences, he said, belong in Skills, which load only when needed.

So what earns a line? Mostly ==navigation pointers==, plus the rare fact that's both undiscoverable and relevant to every session. [How coding agents work](/learn/how-agents-work) gave you a rule of thumb: once you've corrected the agent on the same thing twice, the correction is a candidate line. `/retro` sharpens it: a mechanical repeat mistake becomes a check, a judgement call goes to `CODING_STANDARDS.md`, and only what neither can hold goes in `CLAUDE.md`.

This site's `CLAUDE.md` has that shape. Its 17 lines were mostly written by `/setup-matt-pocock-skills` (the Skill that configures Matt's Skills for a repo): short entries for the issue tracker, the triage labels and the domain docs, each pointing to a fuller doc in `docs/agents/`. The last entry warns that this Next.js is newer than the model's training data, and points to `AGENTS.md` and the docs bundled with Next.js. Nothing in it describes the code.

```checkpoint globality
A teammate wants to add five lines to the project's `CLAUDE.md` about how React components should use reducers, because frontend sessions keep skipping them. What's Matt's objection?
- [ ] Five lines is too few; the rule needs a full page of examples to work.
  > Length isn't the problem. Where the lines live is.
- [ ] The agent ignores `CLAUDE.md`, so the lines will have no effect.
  > It reads `CLAUDE.md` in every session. That's exactly why every line costs something.
- [x] Every session pays for them, including ones that never touch React.
  > Right. Steering files are global. Frontend preferences belong in a Skill the agent pulls in when needed, or in the reviewer's standards.
- [ ] React advice should go in `AGENTS.md` instead, which loads less often.
  > `AGENTS.md` is the same idea under another name: it loads in every session too.
```

## Writing for agents: the reference `/retro` loads

`/writing-for-agents` is Matt's guide to writing any document an agent reads: a Skill, a `CLAUDE.md`, a spec, a doc that a pointer leads to. It's model-invoked, so the agent picks it up on its own when you create or edit a Skill or change `CLAUDE.md` or `AGENTS.md`, and you can type it yourself. It used to be called writing-great-skills; Matt renamed it in August 2026 because he was using it on everything agents read, and pitched it for breaking a bloated `AGENTS.md` up into Skills. Its main ideas:

- **Context pointers.** A context pointer is a line held in the agent's context that names material outside it and says when to reach for it. A Skill's description is one; a line in `CLAUDE.md` naming a doc is another. The wording, not the target, decides how reliably the agent follows it. If the agent never opens a doc it needed, sharpen the pointer before you paste the doc in: key word first, one trigger for each distinct case.
- **The two loads.** ==Context load== is what always-loaded material costs the agent: tokens and attention on every turn. Cognitive load is what it costs you to remember which documents exist. You're the index: a user-invoked Skill like `/retro` costs the agent no context, and you pay by remembering it exists. Spend that memory where your judgement matters.
- **Progressive disclosure.** Material sits on a ladder: the steps the agent follows, then reference in the same file, then reference in a separate file behind a pointer. Moving material down the ladder keeps the top readable. Keep inline what every case needs; put behind a pointer what only some cases reach. The failure is sprawl: a file simply too long, even when every line is true.
- **No-ops.** For each sentence, ask: does it change what the agent does compared with its default? "Write clean, readable code" doesn't. When a sentence fails, delete the whole sentence rather than trimming words. Restating what the agent can look up, like the scripts in `package.json`, is a copy that goes stale. Keep what looking can't reveal: the reason behind a choice, a gotcha no config file admits.
- **Leading words.** A compact word the model already knows can anchor a whole behaviour in a few tokens: a *tight* feedback loop, a test that goes *red*, a *tracer bullet*. A word too weak to beat the default, like *be thorough*, is itself a no-op; reach for a stronger one, like *relentless*.
- **Say what you want, not what you don't.** A ban drags the forbidden idea into the agent's attention. "Don't write long comments" puts long comments front and centre; "Keep every comment to one line" never mentions them. Keep a prohibition only as a hard guardrail you can't phrase positively, paired with the positive target.

One tip from Matt's docs: left alone, an agent writing for another agent explains what the model already knows. Let it draft, then review the draft against the reference; most of the value is in that review.

```checkpoint no-op-test
A Skill you're writing contains the line "Be careful and think about edge cases." You run the Skill with and without the line, and the agent behaves the same both times. What does `/writing-for-agents` say to do?
- [x] Delete the whole sentence; it's a no-op.
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
- **He reviews the system, not just the code.** In a September 2026 talk on the pull-request bottleneck he argued you should never have to write the same review comment twice: `/retro` can look over a week of pull requests and reviews and propose the checks and standards that make the next review lighter.
- **Push to the reviewer, let the builder pull.** In an April 2026 workshop he put it this way: the builder can pull standards in when it has a question, while the reviewer gets them pushed alongside the code. He was building with a cheaper model and reviewing with a stronger one.

**Other developers:**

- A user Matt quoted at launch said retro showed their agents bumping into problems nobody had noticed, because the agents' persistence got the features built anyway.
- On Hacker News in October 2026, one developer described keeping a `CONTRIBUTING.md` and a `CODING_STANDARDS.md` next to the decision records Matt's Skills write, and said the agents find those docs and keep them up to date.
- Matt's docs quote a user, burned by automatic hooks that blocked good changes, who wanted `/retro` to stay propose-only.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). Allow 15 minutes.

1. Make a practice folder, turn it into a Git repo and start Claude Code. If it asks whether you trust this folder, choose Yes.

```sh
mkdir retro-practice
cd retro-practice
git init
claude
```

2. Type a slash and the word retro. If `retro` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Ask for a deliberately weak steering file. If it asks permission to create the file, choose Yes.

```text
Create a file called CLAUDE.md containing exactly these four lines:
This project is written in JavaScript.
Write clean, readable code.
Don't use var.
See notes.md.
```

4. Review it with the reference:

```text
/writing-for-agents Review CLAUDE.md line by line. Label each line as a context pointer, a no-op, a copy of something discoverable, or a prohibition, and suggest a better wording or home for each. Report only; leave the file unchanged.
```

5. Give it a small job. If it asks permission to create files or run its test, choose Yes.

```text
Write a JavaScript function that counts the words in a string, with a test that runs on Node's built-in test runner.
```

6. In the same session, before anything else, type:

```text
/retro
```

7. Read the list without accepting anything. For each candidate, find the moment it points to. To stop the agent at any point, press Esc, or choose No at a permission prompt. Type `/exit` when you're done.

**It's working if:**

- [ ] The review called "Write clean, readable code" a no-op, "This project is written in JavaScript" discoverable, "Don't use var" a prohibition (or a job for a lint rule), and "See notes.md" a pointer that never says when to read it.
- [ ] The review left `CLAUDE.md` unchanged.
- [ ] `/retro` loaded `/writing-for-agents` before it started.
- [ ] Its candidates came most severe first, and each one points at a moment in this session.
- [ ] It flagged that nothing runs its checks automatically: no pre-commit hook, no CI job.
- [ ] Nothing it proposed makes `CLAUDE.md` longer, and nothing changed until you chose.
````

## Common mistakes

- **A `CLAUDE.md` line for every repeat mistake.** Mechanical slips get a check; judgement calls go to the reviewer's standards.
- **Running `/init`**, or keeping a steering file an agent generated.
- **Running `/retro` after `/clear`** without pointing it at the old session's log.
- **Accepting every candidate, or automating the whole thing.** You're the judge; drop anything you can't trace to a moment.
- **Building a new check when one exists.** If a `lint` or `test` script is there but nothing runs it, wire it up.
- **Asking an agent to "streamline" a document.** It optimises for length and cuts behaviour. Use the no-op test, sentence by sentence.
- **Steering by prohibition.** State the behaviour you want.

```site-story
Not used on this site yet: I haven't run `/retro` in this repo. The project's `CLAUDE.md` is 17 lines, almost all pointers, most of them written by `/setup-matt-pocock-skills`. And `package.json` has `lint` and `test` scripts, but no CI job or pre-commit hook runs them, which the Skill counts as a finding in itself.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| A build was harder than it should have been | `/retro` in that session, before `/clear` |
| Already cleared | A fresh `/retro`, pointed at the old log |
| `/diagnosing-bugs` just fixed a bug | `/retro` in the same session |
| A mechanical repeat mistake | A check that fails: lint rule, hook or CI job |
| A judgement call the reviewer missed | A rule in `CODING_STANDARDS.md` |
| The agent searched too long | A navigation pointer |
| Tempted by `/init` | Skip it; keep `CLAUDE.md` to pointers and undiscoverable, global facts |
| Writing a Skill or editing `CLAUDE.md` | `/writing-for-agents`: sharpen pointers, delete no-ops, state the positive |

## Final test

```test scenario-repeat-mistake
In a project that uses pnpm, the agent has run `npm install` in three sessions running, each time breaking the lockfile (the file that pins exact package versions). You run `/retro`. Which proposal fits how it sorts problems?
- [ ] A new line in `CLAUDE.md`: "Always use pnpm."
  > That's the reflex `/retro` resists. The line loads into every session and can still be ignored.
- [ ] A rule in `CODING_STANDARDS.md` for the reviewer agent to enforce.
  > Standards are for judgement calls. Using the wrong package manager is a fixed pattern a tool can catch.
- [x] A check that fails when the wrong package manager is used.
  > Right. It's mechanical, so it gets a deterministic check, such as a pre-commit hook or a CI job.
- [ ] A memory note so the agent remembers next session.
  > `/retro` isn't a memory system. It changes the environment so the mistake can't happen again.
```

```test scenario-style-drift
A new page on a recipe site works, but its layout and naming don't match the pages around it, and the reviewer let it through. Where does `/retro` send the fix?
- [x] A rule in `CODING_STANDARDS.md`, which the reviewer reads.
  > Right. "Match the surrounding pages" is a judgement call no tool can enforce, so it becomes a written standard for review.
- [ ] A lint rule that fails the build on any layout difference.
  > No tool can judge whether a page matches its neighbours. Checks are for fixed patterns.
- [ ] A paragraph in `CLAUDE.md` describing the house style.
  > That loads into every session, including ones that never touch pages, and lands on the builder instead of the reviewer.
- [ ] Nothing: style is a matter of taste, so no file can capture it.
  > Judgement calls are exactly what `CODING_STANDARDS.md` is for.
```

```test scenario-cleared-session
Yesterday's session went badly: the agent kept failing to find a config file. You typed `/clear` at the end and moved on. Today you want to learn from it. What's the best move?
- [ ] Type `/retro` with nothing else; it reviews the current session by default.
  > The current session is today's, which hasn't struggled with anything yet.
- [ ] Skip it; once a session is cleared, its record is gone for good.
  > `/clear` empties the working context, but the session's log stays on disk.
- [ ] Describe yesterday's problems from memory, then add them to `CLAUDE.md`.
  > Your memory loses the details, and `CLAUDE.md` is the wrong home for most fixes anyway.
- [x] Start `/retro` and point it at yesterday's session log.
  > Right. Claude Code keeps each session's record on disk, and `/retro` searches those logs when you name the session.
```

```test scenario-which-skill
No session went wrong, but before a teammate joins you want to check whether your 40-line `CLAUDE.md` pulls its weight. Which Skill fits?
- [ ] `/retro`, because it judges steering files.
  > Its candidates must trace back to struggles in a session's record, and there are none to trace here.
- [ ] `/code-review`, because the file is part of the repo.
  > It checks a diff against standards and a spec, not how well a steering file is written.
- [x] `/writing-for-agents`, the reference for documents agents read.
  > Right. Its rules on pointers, no-ops and pruning apply to any steering file, with or without a session behind it.
- [ ] `/improve-codebase-architecture`, because it surveys the whole repo.
  > That looks for structural improvements to the code, not to the documents agents read.
```

```test spot-negation
After the agent kept writing long comments, Dana added "Don't write long comments." to `CLAUDE.md`. Now it writes even more of them. Spot the mistake.
- [ ] The line should be in capitals so the agent takes it seriously.
  > Emphasis doesn't help. The ban itself keeps long comments in the agent's attention.
- [x] The ban names the unwanted behaviour instead of the wanted one.
  > Right. Negation backfires. "Keep every comment to one line" states the target and never mentions long ones.
- [ ] `CLAUDE.md` is only read once, when the project is created.
  > It's loaded at the start of every session.
- [ ] The rule belongs in `AGENTS.md`, which the agent obeys more strictly.
  > `AGENTS.md` is the same idea under another name, with no extra authority.
```

```test spot-automated-retro
Ravi set up a script that runs `/retro` after every session and accepts everything it proposes. A month later the repo is full of odd rules and checks that fire on good code. Spot the mistake.
- [ ] The script should have run `/retro` before each session instead.
  > Before a session there's nothing to look back on. Timing isn't the problem.
- [ ] `/retro` should only ever run on a brand-new repo.
  > It needs session history to learn from, so it suits a repo you've been working in.
- [ ] He should have told it to edit `CLAUDE.md` instead of adding checks.
  > Checks are the right home for mechanical fixes. Accepting everything without judgement was the problem.
- [x] He took the human out of the loop.
  > Right. Unjudged, it chases false positives and drifts the repo. Matt runs it by hand on a sample of sessions and picks what to build.
```

```test predict-stale-init
Mo's `CLAUDE.md` was written by `/init` months ago. Last week a teammate renamed two service files, and since then the agent keeps looking for files that no longer exist. What's going on?
- [ ] The agent's explore step is broken and needs restarting.
  > Exploring would find the renamed files. Something is steering it toward the old names.
- [x] The generated file still names the old files, so it now misleads.
  > Right. Notes about specific files rot as soon as the code changes. Matt's fix is to delete what `/init` wrote and let the agent explore the code itself.
- [ ] `/init` must be rerun after every rename to keep the file fresh.
  > That spends tokens keeping a copy up to date, and the file still loads into every session. Matt deletes it instead.
- [ ] The renamed files need a comment at the top pointing to their old names.
  > That piles more stale detail into the code. The stale steering file is the problem.
```

```test predict-weak-pointer
Your `CLAUDE.md` has the line "See docs/database.md." That doc explains a migration gotcha, but the agent never opens it before changing the database. What does `/writing-for-agents` suggest first?
- [ ] Paste the whole doc into `CLAUDE.md` so it's always loaded.
  > That's the last resort, and it puts database detail into every session. Sharpen the pointer first.
- [ ] Delete the pointer; the agent will find the doc by exploring.
  > A gotcha like this is exactly what exploring misses. The pointer is the right tool; it needs better wording.
- [x] Reword it to say what the doc is and when to read it.
  > Right. A pointer's wording decides how reliably it fires. Lead with the key word: "Database migrations: read docs/database.md before changing the schema."
- [ ] Move the line to the bottom of `CLAUDE.md` so it's read last.
  > Position isn't the fix. The line never says when the doc matters.
```

```test sequence-retro-timing
You've just built a feature in one session, and a few things went sideways along the way. Which order is right for the rest?
- [ ] `/code-review` → `/clear` → `/pr` → `/retro`
  > Clearing before `/retro` empties the context that holds the struggles.
- [x] `/code-review` → `/pr` → `/retro` → `/clear`
  > Right. Review, write the PR body, look back while the session is still in context, then clear.
- [ ] `/retro` → `/code-review` → `/pr` → `/clear`
  > `/retro` looks back on the whole build, review included. It comes last, after the reviewer has had its turn.
- [ ] `/code-review` → `/pr` → `/clear` → `/retro`
  > `/retro` reviews the current session by default, and after `/clear` the struggles are gone from it.
```

```sources
- [retro SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md) (the four steps, the seven categories, mechanical vs judgement, implementation vs review, which file is for what): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [writing-for-agents SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/writing-for-agents/SKILL.md) and [SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/writing-for-agents/SKILL-MECHANICS.md) (context pointers, the two loads, the information hierarchy, leading words, negation, pruning): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [code-review SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review/SKILL.md) (`CODING_STANDARDS.md` is always a standards source): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (`/retro` as the last Main flow step, before you clear; after `/diagnosing-bugs`): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (`retro` graduates in 1.3.0; writing-great-skills renamed in 1.2.0): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /retro Skill](https://www.aihero.dev/skills-retro), AI Hero docs, updated 2026-10-05, read 2026-10-23.
- [The /writing-for-agents Skill](https://www.aihero.dev/skills-writing-for-agents), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [New Skills! v1.3 brings /pr, /implement-spec, and /retro](https://www.youtube.com/watch?v=BsJGo1wFTvQ), Matt Pocock, 2026-10-05 (why he built it 9:38–10:27; what agents hide 10:42–11:16; his findings 11:16–12:34; judging them 12:34–12:50; don't automate 12:50–13:16; run it on a sample 13:16–13:35; the categories 13:35–14:00).
- [Never Run claude /init](https://www.youtube.com/watch?v=9tmsq-Gvx6g), Matt Pocock, 2026-02-24 (never run it 0:00–0:23; the study 0:25–0:40; the fixed start of the window 1:53–3:05; globality 3:08–4:16; discoverable or stale 4:18–7:19; instruction budget 7:19–8:06; steering in Skills 8:07–8:43; his one line 8:54–9:23; trust exploring 10:09–10:20); written version [on AI Hero](https://www.aihero.dev/never-run-claude-init), updated 2026-02-24.
- [Matt Pocock on X, "Prompt of the day"](https://x.com/mattpocockuk/status/2105951409887949107) (`/retro` over his last ten sessions), 2026-10-02.
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock, AI Engineer Paris, 2026-09-25, auto-translated captions, so paraphrased loosely (standards belong to the reviewer 13:22–14:20; review the system 20:00–20:35; retro over a week of pull requests 20:36–21:12).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock, AI Engineer, 2026-04-24 (push vs pull 1:27:53–1:29:42; standards pushed to the reviewer, cheaper builder and stronger reviewer 1:32:23–1:32:44).
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05, machine-translated track, so paraphrased loosely (the rename and what he uses it for 6:27–7:26).
- [Hacker News comment by gregwebs](https://news.ycombinator.com/item?id=49948336) (`CONTRIBUTING.md` plus `CODING_STANDARDS.md`), 2026-10-03, read 2026-10-23.
- [mattpocock/skills issue #1311](https://github.com/mattpocock/skills/issues/1311) (accepted retro changes left uncommitted), read 2026-10-23.
```
