---
title: Code review
slug: code-review
image: /photos/code-review.jpg
imageAlt: A woman leans over a desk to review work on a laptop with a seated colleague.
imageCredit: Vitaly Gariev
---

Before you trust code an agent wrote, send two fresh reviewers over it: one checks it against your project's rules, the other against what you asked for.

```goals
- You'll be able to explain the Standards and Spec axes, and why the report keeps them apart instead of giving one verdict.
- You'll be able to start a review the reliable way: committed work, a named fixed point, and `/mattpocock-skills:code-review` rather than Claude Code's Built-in `/code-review`.
- You'll be able to read the report: tell hard violations from judgement calls, sort Spec findings, and decide which ones to act on.
- You'll be able to say when in your work to run a review, and when a different tool is the better reach.
```

## Why it matters

Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal) can write four hundred lines while you make a coffee. The tests (small programs that check that your code gives the expected result) pass. You glance at it, it looks fine, and you accept it. Somewhere in those lines is a choice you'd never have made, or a requirement that quietly went missing.

That's what happened on this site. When the comment box under each Lesson went live, all 19 of the site's tests passed. Then a review found that sending a number as a comment crashed the server with a `500` error (a failure on the server's side), instead of the `400` reply for an invalid request that the spec (the written description of what to build) promised. No test had tried a number; tests only check what someone thought to check. ==Passing tests isn't the same as correct.==

Code review means reading changed code critically before you trust it. Two things make it hard with an agent:

- **You didn't write the code**, so you don't know where its weak spots are, and reading every line yourself defeats the point of an agent.
- **The agent that wrote it is a poor judge of it.** It made every decision in that code, so it tends to approve them. And its context window (its working memory for the conversation, measured in tokens, the small chunks of text AI usage is counted in; see [The context window](/learn/context-window)) holds the whole build, so it reasons less sharply.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, calls automated code review one of the most impactful ways to raise the quality of agent-written code. A Skill is a short instruction file the agent loads when you type its name, or when a task matches its description (see [Skills](/learn/skills)). His `code-review` Skill hands the job to fresh reviewers, each with a narrow brief.

## The idea: a fixed point and two axes

A few words first:

- A **repo** (repository) is a project folder tracked by Git, the tool that records every change.
- A **commit** is a saved snapshot of the repo. `HEAD` means your latest commit.
- A **diff** is the list of lines that changed between two snapshots.
- A **fixed point** is the snapshot you compare against: a branch like `main` (a branch is a separate line of commits), a commit's ID like `4f849b9`, a tag (a name pinned to one commit, like `v1.0`), or `HEAD~5` (five commits back).

The Skill reviews the diff between your fixed point and `HEAD`. Strictly, it measures from where your branch split off it, so later commits on `main` don't count. If you don't name a fixed point, it asks rather than guessing. Before spending anything, it checks that the fixed point exists and the diff isn't empty, so a typo fails at once, in front of you.

Then it asks two separate questions about that diff. Matt calls them axes. One checks the work against its spec, or its ticket (one small, buildable piece of a spec).

| | Standards | Spec |
|---|---|---|
| Question | Is it built right? | Is it the right thing? |
| Checks against | Your repo's documented rules, plus a fixed list of code smells (warning signs, explained below) | The spec or ticket the work came from |
| Every finding cites | The file and rule, or the named smell plus the code | The line of the spec |

Why two? Because ==a change can pass one axis and fail the other==. Code that obeys every rule but builds the wrong feature passes Standards and fails Spec. Code that does just what the ticket asked, in a style the project's rules forbid, does the reverse. A single blended score would let the passing half hide the failing half.

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
# It gathers every file that says how code should be written, then adds a fixed list of twelve code smells.
at: rules
# It starts two sub-agents (helper agents, each with a fresh context window) at the same time: a Standards reviewer and a Spec reviewer.
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
- [x] Standards flags the copied maths and name; Spec passes.
  > Right. Copied date maths and a name like `doIt2` are about how it's built (Duplicated Code, Mysterious Name). It still does what the ticket asked.
- [ ] One blended verdict: mostly fine, with some style notes.
  > The report never blends the axes. A blended score is exactly how one half hides the other.
```

## The Standards axis: your rules, then the smells

Before it starts the reviewers, the Skill searches the repo for every file that says how code here should be written, and hands that list to the Standards reviewer. If a `CODING_STANDARDS.md` or `CONTRIBUTING.md` exists, it's always on the list. This site has neither. Its rules live in ADRs (short decision records in `docs/adr/`) and the glossary in `GLOSSARY.md`, plus `CLAUDE.md` (the instructions Claude Code loads into every conversation) and `AGENTS.md`, which both point agents at the docs for Next.js, the web framework this site uses.

On top of whatever the repo documents, the reviewer always carries a **smell baseline**: twelve code smells from chapter 3 of *Refactoring*, Martin Fowler's classic book on restructuring code. A code smell is a hint that the design might be off, not a bug. A few of the twelve:

- **Duplicated Code**: the same logic turns up in more than one place in the change.
- **Mysterious Name**: a name that doesn't say what the thing does or holds.
- **Shotgun Surgery**: one logical change forces edits scattered across many files.
- **Middle Man**: a function that mostly just passes calls on to another.

Each smell comes with its fix: extract the shared code, rename it, gather what changes together. Two rules bind the baseline:

1. **The repo overrides.** If your documented standards endorse something a smell would flag, the smell is dropped.
2. **A smell is always a judgement call**, written as a possibility (possible Duplicated Code, say), ==never a hard violation==. Breaking a documented rule can be a hard violation; a smell can't.

The Standards reviewer also skips anything your tooling already enforces, such as a linter (a program that flags common mistakes automatically).

Matt's advice is to keep your rules in `CODING_STANDARDS.md`, which only the reviewer reads, so they don't weigh down the agent doing the building. Over time, `/retro` ([Retro](/learn/retro)) proposes new rules when a review misses a kind of mistake, or automatic checks for purely mechanical ones.

```checkpoint smells-with-no-docs
A weekend project has no standards documents at all: no `CODING_STANDARDS.md`, no ADRs, nothing. What does the Standards axis check?
- [x] The twelve-smell baseline, each one a judgement call.
  > Right. The baseline applies even when a repo documents nothing, and a smell is never a hard violation.
- [ ] Nothing: with no documents, it skips the Standards axis.
  > Only the Spec axis can skip, and only when there's no spec. The smell baseline means Standards always has something to check.
- [ ] Only the problems the linter already reports.
  > It's the reverse: the Standards axis skips anything tooling already enforces.
- [ ] A popular public style guide, treated as hard rules.
  > There's no outside style guide. Without repo rules, it's the Fowler smells, and those are never hard violations.
```

## The Spec axis: what you asked for

Before it starts the reviewers, the Skill also looks for the spec in this order, then hands it to the Spec reviewer:

1. Ticket references in the commit messages, like `#123` or `Closes #45`, fetched from your issue tracker (where tickets live). `/setup-matt-pocock-skills` writes the note that tells it where that is.
2. A path you pass when you start the review.
3. A spec file under `docs/`, `specs/` or `.scratch/` whose name matches the branch or feature.
4. Asking you.

If there's no spec at all, it doesn't start the Spec reviewer, and the report says "no spec available". It doesn't invent requirements from the code.

It reports three kinds of finding, quoting the spec line for each:

- **Missing or partial**: something the spec asked for that isn't there, or is only half there.
- **Scope creep**: behaviour nobody asked for.
- **Looks implemented, but wrong**: the feature exists but doesn't do what the spec line says.

This axis is ==only as sharp as the spec==. A vague spec makes a vague review. That's one more reason to write one with `/to-spec`, and split it with `/to-tickets`, for anything that will take more than one session (one Claude Code conversation); see [Spec + tickets](/learn/spec-and-issues).

```checkpoint colour-picker-extra
A to-do app's spec asks for due dates on tasks. The diff adds due dates and also a colour picker for each task. Where does the colour picker show up in the report?
- [ ] Under Spec, as a missing or partial requirement.
  > Nothing is missing: due dates are there. The picker is something extra.
- [x] Under Spec, as scope creep beyond the due dates.
  > Right. Behaviour nobody asked for is scope creep, and the reviewer quotes the spec to show it wasn't requested.
- [ ] Under Standards, as a hard violation.
  > Standards asks whether code follows the repo's rules. Whether a feature was requested is a Spec question.
- [ ] Nowhere: extra features are a bonus, not a finding.
  > The Spec reviewer reports extras on purpose. Unrequested behaviour is code someone has to maintain.
```

## Two reviewers, side by side

The two reviews run as **sub-agents**: helper agents, each with its own fresh context window. The Skill starts both at the same time and waits for both reports. That buys three things:

- **Neither sees the other's reasoning**, so one axis can't colour the other.
- **Neither wrote the code**, so neither is defending its own choices.
- **Both start clean**, in the Smart zone: the part of the context window where the model (the AI doing the thinking) still reasons clearly. Matt's rule of thumb is about 150k tokens on today's best models.

Each sub-agent gets a tight brief: the diff command, the list of commits, its sources, and an order to report in under 400 words. The Standards brief includes the full smell list, because the sub-agent can't see it otherwise.

The report always has this outline, though the wording inside each section varies:

```md
## Standards
Hard violations (file + rule) · judgement calls (a rule cited, or a smell named and the code quoted)

## Spec
Missing or partial · scope creep · looks wrong (each quoting the spec)

Summary: findings per axis, and the worst issue within each axis.
```

==There is no overall winner.== The Skill reports; it doesn't edit your code.

```checkpoint worst-per-axis
A review ends: "Standards: 3 findings, worst is a duplicated price calculation. Spec: 2 findings, worst is a missing refund button." A teammate asks why it doesn't just name the single worst problem overall. What's the reason?
- [ ] Sub-agents can't read each other's reports to compare.
  > The Skill reads both reports itself. It declines to rank them on purpose.
- [ ] Spec findings always outrank Standards ones.
  > Neither axis outranks the other. Either one can hold the issue that matters most.
- [ ] It saves tokens by skipping a final comparison step.
  > Cost isn't the reason. The separation is a deliberate design choice.
- [x] Ranking across the axes would let one bury the other.
  > Right. Keeping a worst issue per axis means a serious Spec gap can't be buried under a pile of Standards notes, or the reverse.
```

## A session, step by step

Here's this site's first review with Matt's Skill, run after the comment box went live. The findings are real; the wording is condensed, the summary line is illustrative, and the first line names the fixed point up front.

```scene chat
title: Reviewing this site's first build (illustrative, from a real review)
# You type the Skill's full name and a fixed point: the site's first commit.
you: `/mattpocock-skills:code-review` Review since 4f849b9.
# Before starting anything, it checks the fixed point and the diff.
agent: `4f849b9` resolves, and the diff since it isn't empty.
# It finds both sets of sources, then starts the two reviewers together.
agent: Spec: `.scratch/lesson-site/spec.md` and its tickets. Standards: `AGENTS.md`, `CLAUDE.md`, `GLOSSARY.md` and four ADRs (no `CODING_STANDARDS.md` here), plus the smell baseline. Starting the Standards and Spec reviewers now.
# The Standards report: no hard violations, only judgement calls. The endpoint is the code that receives each new comment; the comments module is the code that saves and reads them.
agent: **Standards.** Hard violations: none. Judgement calls include the length limits living in two files, three names for one idea, and the endpoint checking each comment itself instead of leaving that to the comments module.
# The Spec report quotes the spec for each finding.
agent: **Spec.** Looks wrong: a number as a comment returns `500`, but the spec says "`400` + `{ error }` if invalid"; the home page's rows don't match the spec's wording. Not asked for: dates on comments, a "Loading…" message.
# One summary line: a worst issue per axis, and no overall winner.
agent: **Summary.** Standards: 0 hard violations, 7 judgement calls; worst is the endpoint doing its own checks. Spec: 4 findings; worst is the `500` crash.
# You decide what to act on.
you: Fix the crash test-first (a failing test, then the fix), move the checks into the comments module and share the limits. Leave the renames for now.
```

## Your part: commit, name it, read it

**Commit first.** The diff runs from the fixed point to your latest commit, so work you haven't committed is invisible to it. If the agent just made changes, ask it to "commit these changes", review, then fix in a new commit. ==Commit before you review.==

**Type the full name.** Claude Code has its own `/code-review`, a Built-in command (it ships with Claude Code itself, not with Matt's Skills). It's a bug hunt for things like unchecked empty values and race conditions (two actions colliding), with effort levels (how hard it thinks) such as `/code-review max` and a deep cloud version, `/code-review ultra`. With Matt's Skills installed as a plugin (a bundle that adds them all at once), the bare `/code-review` can land on the Built-in review, and Matt won't rename his Skill to dodge it. The sure way in is the full name, `/mattpocock-skills:code-review`. A bug list with no Standards or Spec sections means the Built-in review answered.

**Name the fixed point.** For a whole branch, it's usually `main`. For one ticket, it's the commit just before the work started.

**Review from a clean session.** The sub-agents start fresh anyway, but the agent you're talking to writes their briefs and passes on their reports. If it did the building, it brings the build's assumptions. Review after `/clear` (a Built-in command that empties the conversation; your files and commits stay) or in a new session.

**Read findings as leads, not verdicts.** The Skill passes the reports on unchecked, so one can point at the wrong line or exaggerate the damage. Check each citation, act on the ones that hold up, then stop. A re-run always finds something new: each fix is new code, and judgement calls vary between runs.

The Skill is model-invoked: the agent may start it when you say "review this branch since main" in plain words, though it can pick the Built-in review instead. `/implement`, Matt's Skill that builds the work in a spec or ticket, also calls it when it finishes. `/implement-spec`, which builds a whole spec's tickets with helper agents, calls it once over the whole branch ([Implement](/learn/implement)). Both use the bare name, so they can get the Built-in review too.

| Your situation | Reach for |
|---|---|
| A diff exists; you want to know it's built right and is the right thing | `/mattpocock-skills:code-review` |
| You want bugs hunted: empty values, races, off-by-one errors (counting one too many or too few) | Claude Code's Built-in `/code-review` |
| Nothing is written yet, and you want it built test-first (a failing test, then the code) | `/tdd` ([TDD](/learn/tdd)) |
| Something is broken and you don't know why | `/diagnosing-bugs` ([Diagnosing bugs](/learn/diagnosing-bugs)) |
| The whole codebase has drifted, not one diff | `/improve-codebase-architecture` ([Architecture](/learn/architecture)) |

```callout watch-out
Inside `/implement`, the review runs before the final commit, so it can't see work that wasn't committed along the way. Run `/mattpocock-skills:code-review` yourself afterwards, from a clean session.
```

```checkpoint which-review-answered
With Matt's plugin installed, you type `/code-review` and get back a list of places the code could crash, with no mention of your spec. What happened?
- [x] The bare name reached the Built-in, so it hunted bugs.
  > Right. The bare name can reach Claude Code's Built-in bug hunt. Type `/mattpocock-skills:code-review` to reach Matt's Skill every time.
- [ ] The Skill found no spec, so it fell back to hunting bugs.
  > With no spec, Matt's Skill says "no spec available" and still gives a Standards section. A plain bug list means a different tool answered.
- [ ] Your repo has no standards documents, so it skipped both axes.
  > With no documents, Standards still checks the smell baseline, and Spec needs only a spec. Neither axis turns into a crash list.
- [ ] The diff was empty, so it reviewed the whole repo instead.
  > An empty diff stops the review early, before any sub-agent starts.
```

## How Matt and others use it

**Matt Pocock:**

- **Make it work, then make it good.** In his September 2026 talk on the pull-request bottleneck (a pull request, or PR, is a proposed change that's reviewed before it joins the main branch), he split the job in two: implementing makes code work, review makes it good.
- **Grow your own standards.** In the same talk he advised building your own standards with your team, not leaning on generic third-party review bots.
- **Review where it's smart.** At an April 2026 workshop he explained that an agent reviewing at the end of its own long build session works in the dumb zone, past the Smart zone, so clear first. He builds with Sonnet and reviews with Opus (two Claude models; Opus is the stronger), because review is where he needs the smarts. ([Models, effort & ultracode](/learn/models-effort-ultracode) covers switching.)
- **At the end of every ticket.** In his July 2026 walkthrough, `/implement` ran the review by itself when a ticket was done. He clears between tickets, then runs one final review against the spec.

**Other developers:**

- Colin Eberhardt of Scott Logic wrote in October 2026 that when he rebuilt a real app with the Skills, both axes caught a few bugs in the first build.
- A developer running `/implement` unattended in a loop checked the transcripts of 173 sessions in September 2026: the bare name had reached the Built-in review 36 times, Matt's Skill 18. His loop now types the full names.
- One reader, quoted in Matt's docs, called an agent reviewing its own work in the same session "confirmation bias with a slash command".

## Try it yourself

````try
You need Claude Code installed and signed in, plus Git (see [Start here](/learn/start-here)).

1. Make an empty folder, turn it into a Git repo and start Claude Code in it. If it asks whether you trust this folder, choose Yes. To stop the agent at any point, press Esc.

```sh
mkdir review-practice
cd review-practice
git init -b main
claude
```

2. Type a slash and the word mattpocock. If `mattpocock-skills:code-review` is in the list that pops up, delete what you typed. If it isn't, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Check that plan mode (where the agent only reads and proposes) is off: if you see "plan mode on" under the prompt box, press Shift+Tab until it changes. Any other mode is fine.
4. Ask for a spec and a deliberately incomplete build. If it asks permission to create files or commit, choose Yes. If Git says it doesn't know who you are, let the agent set a name and email for this folder only.

```text
Create .scratch/reading-time/spec.md with three requirements for a readingTime(text) function: (1) it rounds up to whole minutes at 200 words per minute; (2) it never returns less than 1; (3) it ignores text inside Markdown code blocks. Commit it on main. Then make a branch called reading-time, write reading-time.js meeting only requirements 1 and 2, and commit it.
```

5. Type `/clear`, so the review starts clean, as it would after a real build.
6. Try a bad fixed point first. It should say it can't find `nope` and stop before starting any reviewers; if it offers another fixed point, say no. If it suggests `/setup-matt-pocock-skills`, now or in the next step, skip it: you'll give it the spec's path yourself.

```text
/mattpocock-skills:code-review Review since nope.
```

7. Now the real review. Two sub-agent rows, one per axis, should appear together in the panel below the prompt box. They run in the background: wait for the report, even if the prompt comes back first. If more rows keep appearing, press Ctrl+X then Ctrl+K, and again within 3 seconds, to stop them all: that's a known bug, not your mistake. Then type `/clear` and rerun this step.

```text
/mattpocock-skills:code-review Review since main. The spec is .scratch/reading-time/spec.md.
```

8. Read the report, but don't fix anything. Type `/exit` when you're done.

**It's working if:**

- [ ] With `nope`, it stopped before starting any sub-agents.
- [ ] It started two sub-agents together, one per axis.
- [ ] The report has two separate sections, Standards and Spec, not one merged list.
- [ ] The Spec section flags requirement (3) as missing and quotes that line of the spec.
- [ ] Any Standards finding names a smell and quotes the code. This repo documents no rules, so expect smells only, or nothing at all.
- [ ] The summary names a worst issue for each axis that has findings, and no overall winner.
````

## Common mistakes

- **Typing the bare `/code-review`** and getting the Built-in bug hunt instead of Matt's two axes.
- **Treating a smell as a hard violation**, or acting on one your own docs allow.
- **Expecting a Spec review without a spec.** You get "no spec available".
- **Skipping the habits in Your part:** reviewing uncommitted work, reviewing in the session that wrote the code, and looping until it comes back clean.

```site-story
After the comment box went live, I typed `/mattpocock-skills:code-review`, starting from `4f849b9`, the site's very first commit, so it reviewed everything built after it.

**Standards: 0 hard violations, 7 judgement calls.** The code followed all four ADRs and used Next.js correctly. The judgement calls included the comment length limits written in two places (change one, forget the other), the endpoint checking input itself instead of leaving it to the comments module, and three names for one idea: `order`, `number` and "position".

**Spec: one real bug, plus small gaps.** Sending a number instead of text crashed the server with a `500`, where the spec promised a `400`. I confirmed it on the live site. The home page's rows didn't match the spec's wording either, and there were extras nobody asked for, like dates on comments.

**I fixed it in one pull request, PR #7:** the crash, test-first (the new test failed first, with `.trim is not a function`), all input checks moved into the comments module, the limits in one shared file, and the home page and ADR wording. **I left alone on purpose:** renames, emoji counting as two characters, and a repeated error line.

**The name clash, live.** Before Matt's review, I'd typed `/code-review max`: Claude Code's Built-in bug hunt at maximum effort, running in the background, not Matt's Skill.

On a later build, the review inside `/implement-spec` found about 15 problems, such as the home page calling Skills "commands", which the glossary rules out. One fix-up agent fixed them all.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Before reviewing | Commit everything; start a clean session |
| Start it | `/mattpocock-skills:code-review Review since main.` Add the spec's path if it can't find one |
| Got a plain bug list | That was the Built-in `/code-review`; use the full name |
| Reading Standards | Hard violations cite a documented rule; smells are always judgement calls |
| Reading Spec | Missing or partial, scope creep, looks wrong; each quotes the spec |
| Acting on it | Check each citation and fix what holds up; don't loop until clean |
| Afterwards | `/pr` writes the PR's description; `/retro` proposes rules or checks for what the review missed: run it before you `/clear`, or point it at the old session's log ([Retro](/learn/retro)) |

## Final test

```final-test predict-wrong-feature
A bakery site's ticket says "customers can pre-order a cake for pickup". The agent built a polished delivery-scheduling flow instead, with no way to choose pickup. The code is tidy, well named and in line with the repo's ADRs. How should the report read?
- [ ] Both axes pass: the code is clean and pre-orders work.
  > Clean code can still be the wrong thing. The ticket's line says pickup, and there's no pickup.
- [x] Standards passes; Spec flags missing pickup and scope creep.
  > Right. Pickup is missing and delivery wasn't asked for, while how it's built is fine. That's the pass-one, fail-the-other case the two axes exist for.
- [ ] Standards fails too, because the wrong feature means the wrong code.
  > Standards judges how it's built, and this code is built well. Building the wrong thing is a Spec failure; the axes are judged separately.
- [ ] Spec flags only scope creep: delivery wasn't asked for.
  > Delivery is extra, but the ticket's pickup is missing too. Both belong in the Spec section.
```

```final-test scenario-bug-hunt
Your checkout change follows the house rules and does what its ticket asked. Before merging, you want to know whether a customer who double-clicks Pay could be charged twice, or whether an empty basket crashes the page. What do you reach for?
- [ ] `/mattpocock-skills:code-review`, since bugs count as Standards findings.
  > Matt's Skill checks your rules and your spec, and this change already meets both. Hunting for crashes and double charges is a different job.
- [ ] `/diagnosing-bugs`, since you're looking for bugs.
  > That's for when something is already broken and you don't know why. Nothing has broken yet.
- [ ] `/tdd`, since it writes a test for every possible bug first.
  > `/tdd` builds new behaviour test-first. This code already exists; you want it inspected.
- [x] Claude Code's Built-in `/code-review`, since it looks for breakage.
  > Right. The Built-in review is a bug hunt, with effort levels like `/code-review max` for a deeper pass. It complements Matt's two-axis review rather than replacing it.
```

```final-test scenario-fixed-point
This morning you branched off `main` and made four commits for one feature. Everything is committed. What do you type to review all four?
- [x] `/mattpocock-skills:code-review Review since main.`
  > Right. The full name reaches Matt's Skill, and `main` is the fixed point your branch started from, so the diff covers all four commits.
- [ ] `/mattpocock-skills:code-review Review since HEAD.`
  > `HEAD` is your latest commit. Comparing it with itself gives an empty diff, and the review stops early.
- [ ] `/code-review max`, the strongest setting.
  > With the plugin installed, the bare name can reach Claude Code's Built-in bug hunt, which gives no Standards or Spec report.
- [ ] `/mattpocock-skills:code-review` on its own, so it can choose the branch.
  > It doesn't choose: with no fixed point, it asks you. Naming `main` up front saves a round trip.
```

```final-test scenario-new-findings
You fixed every finding from a review and ran it again. This time it reports four new findings: one cites a rule in your `CODING_STANDARDS.md`, and three name a possible smell. What now?
- [ ] Keep fixing and re-running until it comes back clean.
  > It never converges: fixes are new code, and judgement calls vary from run to run.
- [ ] Switch to the Built-in review, which gives steadier results.
  > A different tool answers a different question: it hunts bugs, and doesn't check the change against your spec.
- [x] Check the cited rule, weigh the three smells, then move on.
  > Right. A cited rule can be a hard violation, so confirm it applies; smells are judgement calls. Every fix is new code, so another run will always find something. Act on what holds up, then move on.
- [ ] Treat them all as hard violations and fix all four before merging.
  > Only a documented rule can make a finding hard. The three smells are judgement calls to weigh, not must-fixes.
```

```final-test spot-uncommitted
Ana asked the agent to fix three findings. It edited the files and said it was done. She typed `/clear`, then ran `/mattpocock-skills:code-review Review since main.` again. The new report flags the same three problems as before. Spot the mistake.
- [ ] She should have used `/code-review max` for a deeper look.
  > That's the Built-in bug hunt, a different tool. It doesn't explain why the old problems came back.
- [x] She should have committed the fixes first.
  > Right. The diff runs from the fixed point to the latest commit, so edits that aren't committed are invisible and the review sees the old code. Commit, then review.
- [ ] Her fixed point should have been `HEAD`.
  > `HEAD` against itself is an empty diff, and the review stops early. `main` was right; the fixes just weren't in a commit.
- [ ] She needed to pass the spec's path again.
  > The spec's path affects the Spec axis, not which changes the diff contains. The fixes weren't in any commit.
```

```final-test spot-overridden-smell
A repo's ADR says its thin `api-client` wrapper is deliberate: it keeps a vendor's library behind one module. The review lists a judgement call: "possible Middle Man in `api-client`; cut it and call the vendor's library directly." What's wrong with that finding?
- [x] The ADR endorses the wrapper, so it shouldn't be raised.
  > Right. A documented repo standard overrides the baseline, so this smell shouldn't have been reported at all.
- [ ] Nothing: as a judgement call, it's fine to raise.
  > Being a judgement call doesn't protect it. Where the repo's docs endorse what a smell would flag, the smell goes.
- [ ] It belongs under Spec, because an ADR is a kind of spec.
  > ADRs are documented standards, so they belong to the Standards axis. Here the ADR cancels the finding.
- [ ] It's too soft: breaking an ADR makes it a hard violation.
  > The code follows the ADR, so nothing is broken. And a smell is never a hard violation.
```

```final-test spot-same-session
After a three-hour build, Raj types: "Review your work against the spec." The agent replies that everything looks great, and Raj merges. A week later, a missing requirement turns up. Spot the mistake.
- [ ] He should have run the tests once more first.
  > Tests only check what someone thought to check, and none covered the missing requirement. The problem was who did the reviewing.
- [ ] He should have typed `/compact` first, to shrink the chat to a summary.
  > A summary keeps the same agent, still primed by its own choices. The reviewer needs to be one that didn't write the code.
- [ ] He should have asked for the Built-in `/code-review`.
  > That's a bug hunt. It doesn't check the work against the spec, so it wouldn't flag a missing requirement.
- [x] He should have had a different agent do the review.
  > Right. It was biased toward its own choices, and three hours in it was likely past the Smart zone. Use `/mattpocock-skills:code-review` from a clean session, so neither the reviewers nor the agent briefing them built the code.
```

```final-test sequence-review-ticket
You've just finished a small feature on its own branch off `main`, built by chatting with the agent in one long session. Which order gives the most trustworthy review?
- [ ] Review since `main` → commit → fix the findings → `/clear`
  > Reviewing before committing hides the newest work from the diff.
- [ ] `/clear` → review since `main` → commit → fix the findings
  > A clean session is good, but the work has to be committed before the review can see it.
- [x] Commit → `/clear` → review since `main` → fix, commit
  > Right. Commit so the diff sees the work, clear so the review starts without the build's assumptions, then fix what's cited in a new commit.
- [ ] Commit → review since `main` → fix everything → re-run until clean
  > Reviewing in the long build session keeps its assumptions in the room, and re-running until clean never ends.
```

```final-test predict-departures-order
A train-times app's spec says "departures are listed soonest first". The diff sorts departures by time, but the latest trains come out on top. Nothing else changed. Where should this finding land?
- [ ] Spec: a missing or partial requirement, only half there.
  > Sorting by departure time is there in full. It runs the wrong way, which is a different kind of finding.
- [ ] Spec: scope creep, behaviour beyond the request.
  > Nothing was added that the spec didn't ask for. Scope creep is behaviour nobody requested.
- [ ] Standards: a hard violation of a documented rule.
  > No documented coding rule is broken. Whether behaviour matches a spec line is the Spec axis's question.
- [x] Spec: it looks implemented, but it's done wrong.
  > Right. The feature exists but doesn't do what the spec line says, so the reviewer quotes "soonest first" beside the reversed order.
```

```final-test why-two-reviewers
A teammate suggests a cheaper version of the review: one fresh sub-agent that checks both the repo's rules and the spec in a single pass. What would that most likely cost?
- [ ] Nothing: one fresh agent is as independent as two.
  > It's fresh from the build, but not from itself. What it concludes on one axis sits in its context while it judges the other.
- [ ] The smell baseline, which only a Standards sub-agent can hold.
  > The Skill pastes the baseline into whatever brief it writes. Losing it isn't the risk.
- [x] Independence: a verdict on one axis can sway the other.
  > Right. In two separate contexts, neither reviewer sees the other's reasoning, so a clean Standards pass can't soften a Spec gap, or the reverse.
- [ ] Ticket lookup, since sub-agents can't reach an issue tracker.
  > The Skill finds the spec itself and passes it in. That works the same with one reviewer or two.
```

```sources
- [code-review SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [code-review docs page](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/docs/engineering/code-review.md) (same-session review, trusting findings, convergence, uncommitted work): pinned to mattpocock-skills 1.3.1, read 2026-10-23. Public copy: [The /code-review Skill](https://www.aihero.dev/skills-code-review), AI Hero, updated 2026-08-24, read 2026-10-23.
- [implement SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md) and [implement-spec SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md) (both call `code-review` by its bare name): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [retro SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md) (`CODING_STANDARDS.md` is read during review; mechanical rules become checks): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [Out of scope: harness name collisions](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/.out-of-scope/harness-name-collisions.md), mattpocock/skills, read 2026-10-23.
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Claude Code docs (the bundled `/code-review`; a plugin's Skills are namespaced with the plugin's name), read 2026-10-23.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (clearing between tickets and a final review 14:39–14:50; review inside `/implement` 14:55–15:12; why the writing agent is a poor reviewer 15:46–16:21).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (reviewing in the Smart zone 1:04:59–1:06:24; standards go to the reviewer, Sonnet implements, Opus reviews 1:32:23–1:32:44).
- [Can Cursor's HARDCORE Review Skill Stop The Slop?](https://www.youtube.com/watch?v=mh5XZ-L5SFQ), Matt Pocock, 2026-05-28 (impact of automated review 0:00–0:06).
- [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w), Matt Pocock, AI Engineer Paris 2026 (AI Engineer channel), 2026-09-25, auto-translated captions (keep standards out of the implementer 11:35–13:28; make it work, then make it good 13:37–14:00; `CODING_STANDARDS.md` 14:04–14:20; build your own reviewer 14:31–15:19).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [implement loses two of its five beats on unattended runs](https://github.com/mattpocock/skills/discussions/1091), GitHub Discussion #1091, Warshoow's comment of 2026-09-29 (173 sessions: the bare name reached the Built-in review in 36, Matt's Skill ran in 18), with the loop itself in [afk.sh](https://github.com/mattpocock/skills/discussions/1136), Discussion #1136, 2026-09-28.
- [Fix code review findings (PR #7)](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/7), this site's repo, 2026-10-21 (the Site story's fixes).
```
