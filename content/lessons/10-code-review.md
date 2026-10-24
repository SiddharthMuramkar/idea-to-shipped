---
title: Code review
slug: code-review
order: 10
part: 2
image: /photos/code-review.jpg
imageAlt: A woman leans over a desk to review work on a laptop with a seated colleague.
imageCredit: Vitaly Gariev
---

Before you trust code an agent wrote, send two fresh reviewers over it: one checks it against your repo's rules, the other against what you asked for.

```goals
- You'll be able to explain the Standards and Spec axes, and why the report keeps them apart instead of giving one verdict.
- You'll be able to start a review the reliable way: committed work, a named fixed point, and `/mattpocock-skills:code-review` rather than Claude Code's Built-in `/code-review`.
- You'll be able to read the report: tell hard violations from judgement calls, sort Spec findings, and decide which ones to act on.
- You'll be able to say where a review fits in your work, and when a different tool is the better reach.
```

## Why it matters

Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) can write four hundred lines while you make a coffee. The tests pass. You glance at the result, it looks fine, and you accept it. Somewhere in those lines is a choice you'd never have made, or a requirement that quietly went missing.

That's what happened on this site. The comment box shipped with 19 passing tests. Then a review found that sending a number as a comment crashed the server with a `500` error, instead of the `400` "invalid request" reply promised in the spec (the written description of what to build). No test had tried a number; tests only check what someone thought to check. ==Passing tests isn't the same as correct.==

Code review means reading changed code critically before you trust it. Two things make it hard with an agent:

- **You didn't write the code**, so you don't know where its weak spots are, and reading every line yourself defeats the point of an agent.
- **The agent that wrote it is a poor judge of it.** It made every decision in that code, so it tends to approve them. And its context window (its working memory for the conversation, measured in tokens, the small chunks of text AI usage is counted in) is full of the build, so it reasons less sharply than at the start.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, calls automated code review one of the most impactful ways to raise the quality of agent-written code. A Skill is a short instruction file the agent loads when you type its name, or when a task matches its description. His `code-review` Skill hands the job to fresh reviewers, each with a narrow brief. ([Skills](/learn/skills) covers installing them.)

## The idea: a fixed point and two axes

Three words first:

- A **commit** is a saved snapshot of your project in Git, the tool that tracks every change. `HEAD` means your latest commit.
- A **diff** is the list of lines that changed between two snapshots.
- A **fixed point** is the snapshot you compare against: a branch like `main` (a branch is a separate line of commits), a commit's ID like `4f849b9`, a tag, or `HEAD~5` (five commits back).

The Skill reviews the diff between your fixed point and `HEAD`. If you don't name a fixed point, it asks rather than guessing. Before it does anything expensive, it checks that the fixed point exists and the diff isn't empty, so a typo fails in front of you, not halfway through.

Then it asks two separate questions about that diff. Matt calls them axes:

| | Standards | Spec |
|---|---|---|
| Question | Is it built right? | Is it the right thing? |
| Checks against | Your repo's documented rules, plus a baseline of code smells | The spec or ticket the work came from |
| Every finding cites | The file and rule, or the named smell plus the code | The line of the spec |

A repo is a project folder tracked with Git; a ticket is one small, buildable piece of a spec.

Why two? Because ==a change can pass one axis and fail the other==. Code that follows every rule but builds the wrong feature passes Standards and fails Spec. Code that does just what the ticket asked, in a style the project's rules forbid, does the reverse. A single blended score would let the passing half hide the failing half. So the report never merges the two and never re-ranks findings across them.

```scene flow
title: What happens when you start a review
node: pin | Pin the fixed point
node: spec | Find the spec
node: rules | Find the standards
node: agents | Two sub-agents, in parallel
node: report | Two sections, side by side
# You name a fixed point, like main. It checks that it exists and that the diff isn't empty before spending anything.
at: pin
# It looks for the spec: ticket numbers in commit messages, a path you gave, a matching file, or it asks you.
at: spec
# It gathers every file that says how code should be written, then adds the twelve-smell baseline.
at: rules
# It starts a Standards reviewer and a Spec reviewer at the same time, each with a fresh context window.
at: agents
# You get two separate sections and a worst issue for each axis. No overall winner.
at: report
```

```checkpoint axis-library-renewal
A library app's ticket asked for "members can renew a loan once". The diff renews loans exactly once, as asked, but copies the same date maths into three files and names the main function `doIt2`. How does the review come out?
- [ ] Spec fails, because the ticket didn't ask for three files.
  > The ticket is about behaviour, and the behaviour matches. Where the code lives is a question about how it's built.
- [ ] Both axes fail, since messy code can't count as done.
  > The axes are independent on purpose. The feature is exactly what was asked, so Spec passes.
- [x] Standards flags it; Spec passes.
  > Right. Copied date maths and a name like `doIt2` are about how it's built (Duplicated Code, Mysterious Name). It still does what the ticket asked.
- [ ] One blended verdict: mostly fine, with some style notes.
  > The report never blends the axes. A blended score is exactly how one half hides the other.
```

## The Standards axis: your rules, then the smells

The Standards reviewer starts by searching the repo for every file that documents how code should be written. If a `CODING_STANDARDS.md` or `CONTRIBUTING.md` exists, it's always on the list. This site has neither. Its rules live in four ADRs (short decision records in `docs/adr/`, such as "tests hit a real database"), the glossary of agreed words in `GLOSSARY.md`, and `AGENTS.md`, which points agents at the Next.js docs.

On top of whatever the repo documents, the reviewer always carries a **smell baseline**: twelve code smells from chapter 3 of Martin Fowler's book *Refactoring*. A code smell is a surface sign that the design might be off. It isn't a bug; it's a hint. A few of the twelve:

- **Duplicated Code**: the same logic shape appears in more than one place in the change.
- **Mysterious Name**: a name that doesn't say what the thing does or holds.
- **Shotgun Surgery**: one logical change forces edits scattered across many files.
- **Middle Man**: a function that mostly just passes calls on to another.

Each smell comes with its fix: extract the shared code, rename it, gather what changes together. Two rules bind the baseline:

1. **The repo overrides.** If your documented standards endorse something a smell would flag, the smell is dropped.
2. **A smell is always a judgement call**, written as "possible Feature Envy", ==never a hard violation==. Breaking a documented rule can be a hard violation; a smell can't.

Both axes also skip anything your tooling already enforces, such as a linter (a program that flags style problems and common mistakes automatically) or the type checker.

Matt's advice is to keep your rules in `CODING_STANDARDS.md`, which only the reviewer reads, so they don't weigh down the agent doing the building (more on why below). Over time, `/retro` (see [Retro](/learn/retro)) proposes new rules when a review misses a kind of mistake, and turns purely mechanical ones into automatic checks instead.

```checkpoint smells-with-no-docs
A weekend project has no standards documents at all: no `CODING_STANDARDS.md`, no ADRs, nothing. What does the Standards axis check?
- [x] The smell baseline, as judgement calls.
  > Right. The baseline applies even when a repo documents nothing, and a smell is never a hard violation.
- [ ] Nothing: with no documents, it skips the Standards axis.
  > Only the Spec axis can skip, and only when there's no spec. The smell baseline means Standards always has something to check.
- [ ] Only the problems the linter already reports.
  > It's the reverse: both axes skip anything tooling already enforces.
- [ ] A popular public style guide, treated as hard rules.
  > There's no outside style guide. Without repo rules, it's the Fowler smells, and those are never hard violations.
```

## The Spec axis: what you asked for

The Spec reviewer needs a spec to check against. It looks in this order:

1. Ticket references in the commit messages, like `#123` or `Closes #45`, fetched from your issue tracker (where tickets live). `/setup-matt-pocock-skills` writes the note that tells it where that is.
2. A path you pass when you start the review.
3. A spec file under `docs/`, `specs/` or `.scratch/` whose name matches the branch or feature.
4. Asking you.

If there's no spec at all, it skips this axis and the report says "no spec available". It doesn't invent requirements from the code.

It reports three kinds of finding, quoting the spec line for each:

- **Missing or partial**: something the spec asked for that isn't there, or is only half there.
- **Scope creep**: behaviour nobody asked for.
- **Looks implemented, but wrong**: the feature exists but doesn't do what the spec line says.

This axis is ==only as sharp as the spec==. A vague spec makes a vague review. That's one more reason to write one with `/to-spec`, and split it with `/to-tickets`, for anything bigger than a small change; see [Spec + tickets](/learn/spec-and-issues).

```checkpoint colour-picker-extra
A to-do app's spec asks for due dates on tasks. The diff adds due dates and also a colour picker for each task. Where does the colour picker show up in the report?
- [ ] Under Spec, as a missing or partial requirement.
  > Nothing is missing: due dates are there. The picker is something extra.
- [x] Under Spec, as scope creep.
  > Right. Behaviour nobody asked for is scope creep, and the reviewer quotes the spec to show it wasn't requested.
- [ ] Under Standards, as a hard violation.
  > Standards asks whether code follows the repo's rules. Whether a feature was requested is a Spec question.
- [ ] Nowhere: extra features are a bonus, not a finding.
  > The Spec reviewer reports extras on purpose. Unrequested behaviour is code someone has to maintain.
```

## Two reviewers, side by side

The two reviews run as **sub-agents**: helper agents, each with its own fresh context window. The Skill starts both at the same time and waits for both reports. That buys three things:

- **Neither sees the other's reasoning**, so one axis can't colour the other.
- **Neither wrote the code**, so neither is defending its own choices. In his July 2026 walkthrough, Matt explained that an agent asked to review code it just wrote tends to decide it's fine.
- **Both start clean**, in the Smart zone: the part of the context window where the model still thinks clearly. Matt's rule of thumb is about 150k tokens on today's best models.

Each sub-agent gets a tight brief: the diff command, the list of commits, its sources, and an order to report in under 400 words. The Standards brief includes the full smell list, because the sub-agent can't see it otherwise.

The report then follows a fixed shape:

```md
## Standards
Hard violations (file + rule) · judgement calls (rules or smells, code quoted)

## Spec
Missing or partial · scope creep · looks wrong (each quoting the spec)

Summary: findings per axis, and the worst issue within each axis.
```

==There is no overall winner.== Naming one would be exactly the re-ranking the separation exists to stop. The Skill reports; it doesn't edit your code. Deciding what to fix is still your job, or the job of whichever Skill called it.

```checkpoint worst-per-axis
A review ends: "Standards: 3 findings, worst is a duplicated price calculation. Spec: 2 findings, worst is a missing refund button." A teammate asks why it doesn't just name the single worst problem overall. What's the reason?
- [ ] Sub-agents can't read each other's reports, so there's nothing to compare.
  > The main agent reads both reports. It declines to rank them on purpose.
- [ ] Spec findings always matter more, so naming a winner would be pointless.
  > Neither axis outranks the other. Either one can hold the issue that matters most.
- [ ] It saves tokens by skipping a final comparison step.
  > Cost isn't the reason. The separation is a deliberate design choice.
- [x] Ranking across axes would let one hide the other.
  > Right. Keeping a worst issue per axis means a serious Spec gap can't be buried under a pile of Standards notes, or the reverse.
```

## A session, step by step

Here's a replay of the first review of this site, run after the comment box went live. The findings are real; the wording is condensed.

```scene chat
title: Reviewing this site's first build (illustrative replay of a real review)
# You type the Skill's full name, with a fixed point: the site's first commit.
you: `/mattpocock-skills:code-review` Review since 4f849b9.
# Before starting anything, it checks the fixed point and the diff.
agent: `4f849b9` resolves. There are 9 commits since it, and the diff isn't empty.
# It finds both sets of sources, then starts the two reviewers together.
agent: Spec: `.scratch/lesson-site/spec.md` and its tickets. Standards: no `CODING_STANDARDS.md`, so the four ADRs, `GLOSSARY.md` and `AGENTS.md`, plus the smell baseline. Starting the Standards and Spec reviewers now.
# The Standards report: no hard violations, only judgement calls.
agent: **Standards.** Hard violations: none. Judgement calls include possible Shotgun Surgery (the length limits live in two files) and the endpoint checking the request's shape, when issue 05 says route handlers contain no validation.
# The Spec report quotes the spec for each finding.
agent: **Spec.** Looks wrong: a number as a comment returns `500`, but the spec says "`400` + `{ error }` if invalid". Missing: the home page doesn't use the spec's wording. Not asked for: dates on comments, a "Loading…" message.
# One summary line: a worst issue per axis, and no overall winner.
agent: **Summary.** Standards: 0 hard violations, 7 judgement calls; worst is the shape check in the endpoint. Spec: 2 wrong, 2 missing, 4 extras; worst is the `500` crash.
# You decide what to act on.
you: Fix the crash test-first and share the limits. Leave the renames for now.
```

The worst issue on each axis was named separately, one about where code lives and one about a crash, so neither could hide the other.

## Your part: commit, name it, read it

**Commit first.** The diff runs from the fixed point to your latest commit, so work you haven't committed is invisible to it. If you just asked the agent for changes, commit them, review, then fix in a new commit. ==Commit before you review.==

**Type the full name.** Claude Code has its own `/code-review`, a Built-in command (it comes with Claude Code itself; it isn't a Skill). It does a different job: a bug hunt for things like unchecked empty values and race conditions (two actions colliding), with effort levels such as `/code-review max` and a deep cloud version, `/code-review ultra`. With Matt's Skills installed as a plugin, the bare `/code-review` can land on the Built-in, and Matt won't rename his Skill to dodge it. The sure way in is `/mattpocock-skills:code-review`. No Standards and Spec sections means the Built-in answered.

**Name the fixed point.** For a whole branch, it's usually `main`. For one ticket, it's the commit just before the work started.

**Review from a clean session.** A session is one Claude Code conversation, and the one that did the building carries all its assumptions. Review after `/clear` (a Built-in command that empties the conversation) or in a new session.

**Read findings as leads, not verdicts.** The Skill passes the reports on without re-checking them, so one can point at the wrong line or exaggerate the damage. Check each citation, act on the ones that hold up, then stop. A re-run always finds something new, because each fix is new code and judgement calls vary between runs.

The Skill is model-invoked: the agent can start it on its own when you say "review this branch since main" in plain words. Other Skills call it too: `/implement` at the end of each ticket, and `/implement-spec` once over the whole branch, handing every finding to one fix-up sub-agent ([Implement](/learn/implement) covers both).

| Your situation | Reach for |
|---|---|
| A diff exists; you want to know it's built right and is the right thing | `/mattpocock-skills:code-review` |
| You want bugs hunted: empty values, races, off-by-one errors | Claude Code's Built-in `/code-review` |
| Nothing is written yet | `/tdd` ([TDD](/learn/tdd)) |
| Something is broken and you don't know why | `/diagnosing-bugs` ([Diagnosing bugs](/learn/diagnosing-bugs)) |
| The whole codebase has drifted, not one diff | `/improve-codebase-architecture` ([Architecture](/learn/architecture)) |

```callout watch-out
Inside `/implement`, the review runs before the agent's final commit, so if nothing was committed along the way it can't see the newest work. Ask for an interim commit, or run your own review afterwards.
```

```checkpoint which-review-answered
With Matt's plugin installed, you type `/code-review` and get a list of possible crashes on empty values and race conditions, with no Standards or Spec sections. What happened?
- [x] Claude Code's Built-in review answered; type the full name.
  > Right. The bare name can reach the Built-in bug hunt. `/mattpocock-skills:code-review` always reaches Matt's Skill.
- [ ] The Skill found no spec, so it fell back to hunting bugs.
  > With no spec, it says "no spec available" and still reports Standards. It never turns into a bug hunt.
- [ ] Your repo has no standards documents, so it skipped both axes.
  > With no documents it uses the smell baseline. Two missing sections means a different tool answered.
- [ ] The diff was empty, so it reviewed the whole repo instead.
  > An empty diff stops the review early, before any sub-agent starts.
```

## How Matt and others use it

**Matt Pocock** treats review as the step that turns working code into good code.

- **Make it work, then make it good.** In his September 2026 talk on the pull-request bottleneck, he split good code into two steps: implementing makes it work, review makes it good, as if the tidy-up step of test-first coding got its own context window. An implementing agent is already busy exploring, editing and debugging, so he keeps coding standards out of its way and gives them to the reviewer, which has far less to do.
- **Grow your own standards.** In the same talk he advised building your own standards with your team rather than leaning on generic third-party review bots. He'd also like reviewers to commit their fixes instead of leaving comments for a human to wade through. That's his direction; the 1.3.1 Skill only reports.
- **Review where it's smart.** At an April 2026 workshop he sketched why a review at the end of a long build session happens in the dumb zone, past the Smart zone, and recommended clearing first. He builds with Sonnet and reviews with Opus, because review is where he needs the smarts. ([Models, effort & ultracode](/learn/models-effort-ultracode) covers switching models.)
- **Inside the Main flow.** In his July 2026 walkthrough, `/implement` loaded the review by itself; that repo had no standards documents, so it leaned on the Fowler smells. He clears between tickets, then runs a final review against the spec.
- **Ambitious beats timid.** Trying Cursor's strict review Skill in May 2026, he found reviewers handed a diff tend to stay inside it. Ambitious reviews raise more false alarms, but those are easy to reject; the improvements you never see are the costly ones.

**Other developers:**

- Colin Eberhardt of Scott Logic rebuilt a real app with the Skills in October 2026, and reported that both axes caught real bugs.
- A developer running `/implement` unattended in a loop checked 173 session logs in September 2026. The bare name had reached Claude Code's Built-in review 36 times, against 18 runs of Matt's, so he switched to the full namespaced names.
- One reader, quoted in Matt's docs, called an agent reviewing its own work in the same session "confirmation bias with a slash command".

## Try it yourself

````try
You need Claude Code installed and signed in, plus Git (see [Start here](/learn/start-here)).

1. Make an empty folder, turn it into a Git repo and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir review-practice
cd review-practice
git init -b main
claude
```

2. Type a slash and the word mattpocock. If `mattpocock-skills:code-review` isn't in the list that pops up, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Ask for a spec and a deliberately incomplete build. If it asks permission to create files or commit, choose Yes. If Git says it doesn't know who you are, let the agent set a name and email for this folder only.

```text
Create .scratch/reading-time/spec.md with three requirements for a readingTime(text) function: (1) it rounds up to whole minutes at 200 words per minute; (2) it never returns less than 1; (3) it ignores text inside Markdown code blocks. Commit it on main. Then make a branch called reading-time, write reading-time.js meeting only requirements 1 and 2, and commit it.
```

4. Try a bad fixed point first:

```text
/mattpocock-skills:code-review Review since nope.
```

5. Now the real review:

```text
/mattpocock-skills:code-review Review since main. The spec is .scratch/reading-time/spec.md.
```

If it suggests running `/setup-matt-pocock-skills` first, you can skip that here: you've given it the spec's path yourself.

6. Read the report, but don't fix anything. To stop the agent at any point, press Esc. Type `/exit` when you're done.

**It's working if:**

- [ ] With `nope`, it stopped before starting any sub-agents.
- [ ] It started two sub-agents together, one per axis.
- [ ] The report has two separate sections, Standards and Spec, not one merged list.
- [ ] The Spec section flags requirement (3) as missing and quotes that line of the spec.
- [ ] Any Standards finding names a smell and quotes the code. This repo documents no rules, so expect smells only, or nothing at all.
- [ ] The summary names a worst issue for each axis, and no overall winner.
````

## Common mistakes

- **Typing the bare `/code-review`** and getting the Built-in bug hunt instead of Matt's two axes.
- **Treating a smell as a hard violation**, or acting on one your own docs allow.
- **Expecting a Spec review without a spec.** You get "no spec available"; a vague spec gives a vague review.
- **Everything from Your part:** reviewing uncommitted work, no fixed point, reviewing in the session that wrote the code, and looping until it comes back clean.

```site-story
After the comment box went live, I typed `/mattpocock-skills:code-review` with nothing after it. The agent had suggested a starting point earlier, `4f849b9`, the site's very first commit, so it used that and reviewed everything built since. Today I'd name the fixed point myself.

**Standards: 0 hard violations, 7 judgement calls.** The code followed all four ADRs and used Next.js correctly. The judgement calls included the comment length limits written in two files (possible Shotgun Surgery: change one, forget the other), the endpoint checking the request's shape when issue 05 said endpoints contain no validation, and three names for one idea: `order`, `number` and "position number".

**Spec: one real bug, plus small gaps.** The worst: a number as a comment crashed the API with a `500`, where the spec promised a `400` and an error message. We confirmed it on the live site with `curl`; my 19 tests had never tried a number. The home page's rows didn't match the spec's wording either, and there were extras nobody asked for, like dates on comments.

**I fixed it in one pull request (PR #7):** the crash, test-first (the red test failed with `.trim is not a function`), all input checks moved into the comments module, the limits in one shared file, and the home page and ADR wording. **I left alone on purpose:** renames, emoji counting as two characters, and a repeated error line.

**The name clash, live.** Earlier that session I'd typed `/code-review max`. That was Claude Code's Built-in bug hunt, not Matt's Skill. It ran in the background for about 39 minutes and found 15 problems in the comment box, 10 worth fixing, like pasted comments silently cut off. The comment box was the one part we'd agreed not to test during `/tdd`. Matt's review asked whether the code matched our rules and spec; the Built-in asked where it breaks. Different tools, different jobs.

On a later build, `/implement-spec` ran the review over the whole branch. The worst Standards finding was the home page calling Skills "commands", against the glossary. One fix-up agent fixed all 13 findings, counting three from an earlier review.

My takeaway: passing tests isn't the same as correct, and two separate reviewers find different kinds of problems.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Before reviewing | Commit everything; start a clean session |
| Start it | `/mattpocock-skills:code-review Review since main.` Add the spec's path if it can't find one |
| Got a plain bug list | That was the Built-in `/code-review`; use the full name |
| Reading Standards | Hard violations cite a documented rule; smells are always judgement calls |
| Reading Spec | Missing or partial, scope creep, looks wrong; each quotes the spec |
| Acting on it | Fix what has a real citation; don't loop until clean |
| Afterwards | `/pr` writes the PR body; `/retro` turns misses into standards or checks |

## Final test

```test scenario-wrong-feature
A bakery site's ticket asked for "customers can pre-order a cake for pickup". The agent built a polished delivery-scheduling flow instead. It follows every documented rule in the repo, and pickup is nowhere to be seen. How should the report read?
- [ ] Both axes pass, because the code is clean and well built.
  > Clean code can still be the wrong thing. Spec checks the feature against the ticket.
- [x] Standards passes; Spec fails on a missing feature and scope creep.
  > Right. Pickup is missing, delivery wasn't asked for, and the code still follows every rule. That's the pass-one, fail-the-other case the two axes exist for.
- [ ] Standards fails, because delivery code breaks the repo's conventions.
  > It follows every documented rule. Building the wrong feature is a Spec failure, not a Standards one.
- [ ] One blended verdict: roughly half right overall.
  > The report never blends the axes. A blend would let the clean code hide the wrong feature.
```

```test scenario-bug-hunt
Nothing is broken yet, but before merging a payments change you want the diff hunted for bugs: unchecked empty values, two requests racing each other, off-by-one errors. What do you reach for?
- [ ] `/mattpocock-skills:code-review`, since bugs count as Standards findings.
  > Matt's Skill checks your rules and your spec. Hunting null paths and races is a different job.
- [ ] `/diagnosing-bugs`, since you're looking for bugs.
  > That's for when something is already broken and you don't know why. Nothing is broken here.
- [ ] `/tdd`, to write a test for every possible bug first.
  > `/tdd` builds new behaviour test-first. This code already exists; you want it inspected.
- [x] Claude Code's Built-in `/code-review`.
  > Right. The Built-in is a bug hunt, with effort levels like `/code-review max`. It complements Matt's two-axis review rather than replacing it.
```

```test scenario-fixed-point
This morning you branched off `main` and made four commits for one feature. Everything is committed. What do you type to review all four?
- [x] `/mattpocock-skills:code-review Review since main.`
  > Right. The full name reaches Matt's Skill, and `main` is the fixed point your branch started from, so the diff covers all four commits.
- [ ] `/mattpocock-skills:code-review Review since HEAD.`
  > `HEAD` is your latest commit. Comparing it with itself gives an empty diff, and the review stops early.
- [ ] `/code-review max`, the strongest setting.
  > With the plugin installed, the bare name can reach Claude Code's Built-in bug hunt, which doesn't check your rules or your spec.
- [ ] `/mattpocock-skills:code-review` on its own, so it can choose the branch.
  > It doesn't choose: with no fixed point, it asks you. Naming `main` up front saves a round trip.
```

```test scenario-new-findings
You fixed every finding from a review and ran it again. This time it reports four new judgement calls, all smells, none citing a documented rule. What now?
- [ ] Keep fixing and re-running until it comes back clean.
  > It never converges: fixes are new code, and judgement calls vary from run to run.
- [ ] Switch to the Built-in review, which gives steadier results.
  > A different tool answers a different question. It won't tell you whether the change follows your rules and spec.
- [x] Read them as hints, fix any you agree with, then stop.
  > Right. Smells are labelled judgement calls. Treat a pass as a list of leads, act on the ones you agree with, and move on.
- [ ] Delete the smell baseline so the noise stops.
  > The baseline is part of the Skill and catches real problems. Its findings are already marked as judgement calls, so weigh them rather than silence them.
```

```test spot-uncommitted
Ana asked the agent to fix three findings. It edited the files, and she straight away ran `/mattpocock-skills:code-review Review since main.` again, without committing. The new report doesn't mention her fixes at all. Spot the mistake.
- [ ] She should have used `/code-review max` for a deeper look.
  > That's the Built-in bug hunt, a different tool. It doesn't explain the missing fixes.
- [x] She reviewed before committing the fixes.
  > Right. The diff runs from the fixed point to the latest commit, so uncommitted edits are invisible. Commit, then review.
- [ ] Her fixed point should have been `HEAD`.
  > `HEAD` against itself is an empty diff. `main` was right; the fixes just weren't committed.
- [ ] She needed to pass the spec's path again.
  > The spec path affects the Spec axis, not which changes the diff contains. The fixes weren't in any commit.
```

```test spot-hard-smell
A repo's ADR says its thin `api-client` wrapper is deliberate: it keeps a vendor's library behind one module. The review reports: "HARD VIOLATION: Middle Man in `api-client`." What's wrong with that finding?
- [x] The ADR wins, and smells are never hard violations.
  > Right. A documented repo standard overrides the baseline, so this smell should be dropped. Even where a smell applies, it's only ever a judgement call.
- [ ] Nothing: Middle Man is always a hard violation.
  > No smell is ever a hard violation, and the repo's documented choice suppresses this one.
- [ ] It belongs under Spec, because an ADR is a kind of spec.
  > ADRs are documented standards, so they belong to the Standards axis. The problem is the label, not the section.
- [ ] Middle Man isn't one of the twelve baseline smells.
  > It is one of them. The problem is that the repo overrides it, and smells are never hard violations.
```

```test spot-same-session
After a three-hour build, Raj types into the same session: "Review your work against the spec." The agent replies that everything looks great, and Raj merges. A week later, a missing requirement turns up. Spot the mistake.
- [ ] He should have asked for a longer, more detailed review.
  > Length isn't the problem. The reviewer was the agent that wrote the code.
- [ ] He should have reviewed before building anything.
  > There's nothing to review before code exists. Grilling and a spec come first; review comes after.
- [ ] The spec itself must have been wrong.
  > Nothing suggests that. A fresh reviewer quoting the spec line by line would likely have caught the gap.
- [x] The agent that wrote it also reviewed it.
  > Right. It was biased toward its own choices and deep in a full context window. Use `/mattpocock-skills:code-review` from a clean session, so fresh sub-agents do the reviewing.
```

```test sequence-review-ticket
You've just finished building a ticket by hand in a long session. Which order gives the most trustworthy review?
- [ ] Review since `main` → commit → fix the findings → `/clear`
  > Reviewing before committing hides the newest work from the diff.
- [ ] `/clear` → review since `main` → commit → fix the findings
  > A clean session is good, but the work has to be committed before the review can see it.
- [x] Commit → `/clear` → review since `main` → fix, commit
  > Right. Commit so the diff sees the work, clear so the review starts without the build's assumptions, then fix what's cited in a new commit.
- [ ] Commit → review since `main` → fix everything → re-run until clean
  > Reviewing in the long build session keeps its assumptions in the room, and re-running until clean never ends.
```

```test scenario-no-spec
You review a quick refactor that never had a spec or ticket. When the agent asks where the spec is, you say there isn't one. What should the report contain?
- [x] Standards findings, and "no spec available" for Spec.
  > Right. Only the Spec axis needs a spec. It says so plainly instead of inventing requirements.
- [ ] Spec findings based on requirements it works out from the code.
  > It never invents requirements. Inferring them from the code would just approve whatever was built.
- [ ] Nothing: a review can't run at all without a spec.
  > Only the Spec axis needs one. Standards still runs against your docs and the smell baseline.
- [ ] Both sections, with the Standards findings copied into Spec.
  > The axes stay separate. With no spec, the Spec section just says so.
```

```test why-two-reviewers
A friend asks why Matt's review starts two sub-agents instead of one agent checking both the rules and the spec. What's the best answer?
- [ ] Two agents finish in half the time; that's the whole point.
  > Running both at once is quicker, but speed isn't why they're separate.
- [ ] One agent can't read both a spec and a standards file.
  > It could. Keeping them apart is a deliberate choice, not a limit.
- [x] Fresh contexts keep each axis independent.
  > Right. Neither reviewer sees the other's reasoning or wrote the code, so one axis can't colour or mask the other.
- [ ] So the main agent can rank all the findings in one list.
  > The report never merges or re-ranks findings across the axes.
```

```sources
- [code-review SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [code-review docs page](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/docs/engineering/code-review.md) (the name clash, same-session review, convergence, uncommitted work): pinned to mattpocock-skills 1.3.1, read 2026-10-23. Public copy: [The /code-review Skill](https://www.aihero.dev/skills-code-review), AI Hero, updated 2026-08-24, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md) and [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [retro SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md) (`CODING_STANDARDS.md` is read during review; mechanical rules become checks): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [Out of scope: harness name collisions](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/.out-of-scope/harness-name-collisions.md), mattpocock/skills, read 2026-10-23.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (clearing between tickets and a final review 14:39–14:50; review inside `/implement` 14:55–15:12; two axes and the Fowler fallback 15:12–15:46; why sub-agents 15:46–16:21).
- [AI Engineer workshop](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock, 2026-04-24 (reviewing in the Smart zone 1:04:59–1:06:24; standards go to the reviewer, Sonnet implements, Opus reviews 1:32:23–1:32:44).
- [Can Cursor's HARDCORE Review Skill Stop The Slop?](https://www.youtube.com/watch?v=mh5XZ-L5SFQ), Matt Pocock, 2026-05-28 (impact of automated review 0:00–0:06; reviewers stay inside the diff 2:00–2:15; false positives vs missed improvements 12:06–12:29).
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock, AI Hero, 2026-09-25, auto-translated captions (keep standards out of the implementer 11:35–13:28; make it work, then make it good 13:37–14:00; `CODING_STANDARDS.md` 14:04–14:20; build your own reviewer 14:31–15:19; reviewers should commit fixes 15:20–16:03).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [afk.sh](https://github.com/mattpocock/skills/discussions/1136), Warshoow, GitHub Discussion #1136, 2026-09-28 (the bare name resolving to the Built-in, 36 runs vs 18).
```
