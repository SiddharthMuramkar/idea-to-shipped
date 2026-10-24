---
title: Architecture
slug: architecture
order: 16
part: 4
image: /photos/architecture.jpg
imageAlt: A white cable-stayed bridge pylon with fanned steel cables against a deep blue sky.
imageCredit: Daniele Bissoli
---

Agents write code fast, and fast code gets messy fast. Learn the words for judging a codebase's shape, and a Skill that finds where it's getting hard to change.

```goals
- You'll be able to explain module, interface, depth, seam and adapter, and say what leverage and locality give you.
- You'll be able to judge a design with the deletion test and the one-adapter-or-two rule.
- You'll be able to run `/improve-codebase-architecture`, read its report and carry one candidate forward, knowing it never changes code.
- You'll be able to tell `/codebase-design`, a reference, from a Skill that drives a session, and pick the right one.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Ask it for a feature and it makes the change in front of it, without thinking about the whole codebase (all the code in a project) unless something makes it. So each change adds a little oddness: a second copy of a rule, a helper that only passes things along. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, calls this ==software entropy==, and says agents speed it up. Left alone, a codebase becomes what he calls a "ball of mud", where every change breaks something.

A Skill is a short instruction file the agent loads when you type its name, or when a task matches its description. Matt's architecture Skills start from John Ousterhout's book *A Philosophy of Software Design*, which defines complexity as whatever makes a system hard to understand and change. It hurts agents too: an agent starts every session (one Claude Code conversation) knowing nothing about your project. If understanding one idea means opening twelve tiny files, it may miss one, and its next change makes things worse. Good structure also makes good tests possible, and tests are how the agent checks its work: as Matt argued in an April 2026 talk, better feedback means better code.

This Lesson covers two Skills. `/codebase-design` gives you and the agent an exact vocabulary for the shape of code. `/improve-codebase-architecture` uses it to survey a codebase and hand you places to improve. You don't need to write code to use either. You need to judge.

## The words

Every term below comes from the `/codebase-design` Skill, which tells the agent to use them exactly. Each one maps onto a real file on this site.

- A **module** is anything with a front door and code behind it, at any size: a function (a named chunk of code that does one job), a file, a folder. This site's Lessons module, `src/lessons/lessons.ts`, is one.
- Its **interface** is everything a caller (the code that uses it) must know to use it correctly: the names, plus rules like call order, errors and required settings. The Lessons module's interface is three functions: `listLessons`, `getLesson` and `lessonExists`.
- Its **implementation** is the code behind the door. Behind those three functions, the Lessons module reads the Markdown files, checks each header, sorts them, turns Markdown into a web page and works out the previous and next links.
- **Depth** is how much a caller gets per thing it has to learn. A ==deep module== hides a lot behind a small interface. A **shallow module** has an interface nearly as complicated as the code behind it.
- A **seam** (the programmer Michael Feathers' term) is a place where you can change behaviour without editing the code there. It's where an interface lives, and choosing where to put one is its own decision.
- An **adapter** is a concrete thing that plugs into a seam. The word names the slot it fills, not what's inside.

Depth pays twice. Callers get **leverage**: one implementation does the work for every page and test that uses it. Maintainers get **locality**: changes, bugs and checking concentrate in one place, so ==fix it once, fixed everywhere==.

The Skill bans the loose words people usually reach for, "component", "service", "API" and "boundary", because a design conversation gets much shorter when you and the agent mean exactly the same thing by "seam".

```checkpoint shallow-library
A library app has a `Book` module with fourteen functions: `getTitle`, `setTitle`, `getAuthor`, `setAuthor`, and so on. Each is a single line that reads or writes one field. Which word fits it best?
- [ ] Deep, because fourteen functions give its callers plenty of choice.
  > More functions make a bigger interface, not more depth. Depth is how much each thing you learn gets you.
- [x] Shallow: the interface is about as big as the code behind it.
  > Right. Callers learn fourteen names and get almost nothing hidden in return.
- [ ] A seam, since every function is a spot where behaviour can change.
  > A seam is where an interface lives and an adapter can be swapped in. Nothing here can be swapped.
- [ ] An adapter, because it fills the slot for books.
  > An adapter fills a seam with a concrete thing, like a real or a fake database. Nothing is being swapped here.
```

## Two tests for any design

The vocabulary comes with four principles. Two are tests you can run in your head.

**The deletion test.** Imagine deleting the module. If the complexity vanishes with it, it was a pass-through. If the complexity would reappear in every caller, it was ==earning its keep==. Delete the Lessons module, and the home page, every Lesson page and the comment check would each have to read and parse the files themselves: it stays. Delete a `formatDate` helper that calls one built-in function from one place, and nothing gets harder: a pass-through.

**One adapter means a hypothetical seam; two adapters mean a real one.** Don't cut a seam until something actually varies across it. The Lessons module is built by `lessonsFrom(dir)`, which takes the folder to read as an input. The live site passes the real `content/lessons` folder; the tests (small programs that check the code does what it should) pass folders of fake Lessons. Two adapters, so the seam is real, which is why those tests were easy to write.

The comments module talks to the database directly, and only one adapter ever fills that slot: the real Postgres database. Even the tests use a real copy, a choice recorded in an ADR (a short decision record kept in the repo, the project's Git-tracked folder). A swappable "database seam" there would be plumbing with nothing to swap.

The other two principles shape what you build:

- **The interface is the test surface.** Tests go through the same front door as callers. If you need to test past it, poking at the parts inside, the module is probably the wrong shape. After deepening a module, test at its new interface and delete the old tests on the pieces inside: replace, don't layer.
- **Depth belongs to the interface, not the implementation.** A deep module can be built from small parts, even with private internal seams its own tests use. Callers never see them.

```scene flow
title: Judging this site's code with the vocabulary (from a real run)
node: route | Comments route
node: comments | Comments module
node: lessons | Lessons module
node: seam | lessonsFrom(dir)
node: db | Comments to database
node: verdict | Change nothing
# The route only turns web requests into calls to the comments module: a thin adapter, on purpose.
at: route
# The comments module hides input checks, the Lesson check, length limits and the database code behind two functions. Deep.
at: comments
# The Lessons module hides files, headers, sorting and Markdown behind three functions. The deletion test says keep it.
at: lessons
# lessonsFrom(dir) has two adapters, the real folder and the fake test folders, so this seam is real.
at: seam
# The database has one adapter, the real one. One adapter is a hypothetical seam, so add nothing.
at: db
# The verdict: the design is in good shape, and nothing should change.
at: verdict
```

```checkpoint real-seam
Your app sends email through one provider. Which fact would justify putting an `EmailSender` seam in front of it?
- [x] Tests plug in a fake sender; the live app uses the real one.
  > Right. That's two adapters, so something really varies across the seam.
- [ ] You might switch to a different email provider one day.
  > "Might" is one adapter today: a hypothetical seam. Add it when the second adapter actually exists.
- [ ] The email code is long, and a seam would split it into tidier files.
  > Seams are about what varies, not about length or file layout. A long module can still be deep.
- [ ] A clear name like `EmailSender` makes the code read more nicely.
  > A good name helps, but it doesn't make a seam. Only a second adapter does.
```

## Two Skills, two jobs

`/codebase-design` is a **reference**: the vocabulary and principles above, plus two deeper files. One explains how to test a deepened module depending on what it talks to. The other, "design it twice", sends three or more sub-agents (helper agents, each with a fresh memory) to design radically different interfaces for the same module, then compares them and recommends one.

It's **model-invoked**: you can type `/codebase-design`, or the agent can load it on its own when a design task fits. `/tdd` and `/improve-codebase-architecture` both lean on it.

What it lacks is a process: no steps, and no point where it stops. Give a fresh session `/codebase-design` as the whole task and ==the agent invents a process==. In issue #449 on Matt's repo (July 2026), an agent told to "drive the open decisions" with it re-explored code another session had already mapped, started designing interfaces, and ran to about 105k tokens (the chunks of text AI usage is measured in) before asking anything. The issue was closed with no guard added, so the fix is yours: let a driver Skill run the session, such as `/grill-with-docs`, `/improve-codebase-architecture` or `/tdd`, or type `/codebase-design` with a question that has an end, like "is this module deep?"

`/improve-codebase-architecture` is a **survey**, and it's **user-invoked**: only you can start it, by typing its name at the start of your message; plain words won't. Matt's router Skill, `/ask-matt`, files it under codebase health: upkeep, not feature work. The survey finds the candidates, and `/codebase-design` is the bench you design the chosen one on.

```checkpoint reference-not-driver
You type `/codebase-design` as your whole message in a fresh session and go for a coffee. You come back to an agent that has re-read half the repo and is designing interfaces nobody asked for. Why?
- [ ] It's user-invoked, so starting it by hand put it into the wrong mode.
  > It's model-invoked, and how it started isn't the problem.
- [ ] Your effort setting was too low, so it skipped asking you questions.
  > Effort changes how hard the model thinks. The real gap is that nothing told it when to stop.
- [x] It's a reference with no steps or end, so the agent made some up.
  > Right. Give it a question with an end, or let a driver Skill such as `/improve-codebase-architecture` use it.
- [ ] Rescanning the repo first is simply its normal process.
  > It has no process at all. That's exactly why the agent improvised one.
```

## A survey, step by step

Here is what `/improve-codebase-architecture` does, in order:

1. **Scope first.** Improving code only pays off if someone changes it again. If you name a direction (a module, a folder, a pain point), it takes it. If not, it reads the commit history (`git log`, the list of saved changes) for ==hot spots==, the files that keep changing, and leaves dormant code alone.
2. **Read the project's own words.** It reads `GLOSSARY.md` (the project's agreed terms) and the relevant ADRs, so its cards say "the Comment module", not invented names. It only reopens an ADR when the friction is real, and marks the conflict on the card.
3. **Explore.** A sub-agent walks the code noting friction: one idea spread across many small modules, shallow modules, functions pulled out just to be tested while the bugs hide in how they're called, modules leaking into each other, code that's hard to test. The deletion test filters the list.
4. **Write a report.** One self-contained web page goes to your computer's temp folder as `architecture-review-<timestamp>.html`, so nothing lands in your project. It opens the page and tells you where it is. Each candidate card shows the files, the problem, the solution, the benefits in terms of locality and leverage (and tests), a before-and-after diagram, and a badge: `Strong`, `Worth exploring` or `Speculative`. A Top recommendation closes the report.
5. **Stop and ask.** No designs yet: it asks which candidate you'd like to explore.
6. **Grill one.** On your pick, it runs the grilling Skill: rounds of numbered questions with recommended answers, about constraints, dependencies, the module's new shape, what sits behind the seam and which tests survive. New terms go into `GLOSSARY.md`. Turn a candidate down for a lasting reason and it offers to record an ADR, so future surveys don't suggest it again.

It ==never changes code==. The run produces a conversation and one HTML file, plus any glossary or ADR updates you agreed to. The refactor (restructuring code without changing what it does) comes later, through the Main flow, the path most work takes from idea to shipped: take the decision into `/grill-with-docs` or `/to-spec`, then `/to-tickets` and `/implement`. See [The main flow](/learn/main-flow).

```scene chat
title: Surveying a recipe site (illustrative)
# You type the Skill and name a direction. Without one, it would hunt for hot spots in the commit history.
you: `/improve-codebase-architecture` Focus on the shopping list. It changes every week and keeps breaking.
# It reads the project's words and past decisions, then sends a sub-agent to explore.
agent: Read GLOSSARY.md (Recipe, Shopping List, Serving) and the ADRs. A sub-agent is exploring the shopping-list code now.
# The report lands in the temp folder, not the repo, and it stops to ask.
agent: Report written to your temp folder and opened: architecture-review-20261023-1412.html. Three candidates. Top recommendation: one Shopping List module for the merging rules, copied in three places today. The third, a recipes database, is `Speculative`. Which of these would you like to explore?
# You pick one, and turn another down for a lasting reason.
you: The first. And drop the third for good: recipes stay Markdown files so anyone can edit them.
# It offers to record the rejection, then starts grilling with recommendations.
agent: Shall I record that as an ADR, so later surveys don't suggest it again? ❓ **Q1** - **Interface**: Should callers only ever call `addRecipe(list, recipe, servings)`, with unit conversion hidden inside? ➡️ Yes: nothing else needs it on its own.
# You answer the round in one line.
you: Yes to the ADR. 1 yes.
# It ends with a decision, not a diff.
agent: Decided: one deep Shopping List module behind `addRecipe`, tested at that interface. No code changed. Take this into `/to-spec` when you're ready.
```

```checkpoint after-the-report
The report shows nine candidates: two `Strong`, three `Worth exploring` and four `Speculative`. What's the best next step?
- [ ] Ask it to build both `Strong` ones now, while the report is fresh.
  > It never changes code, and two refactors in one session crowd the agent's memory. One candidate, then the Main flow.
- [ ] Commit the HTML file so the team can work through all nine.
  > The report is a temp file on purpose. Carry the decision forward, not the file.
- [ ] Run `/codebase-design` on each candidate to choose between them.
  > It's a reference with no process. Choosing is your job, and the grilling helps you think it through.
- [x] Pick one, grill it, and take the decision into the Main flow.
  > Right. One candidate per session; the rest can become tickets for later.
```

## Your part: the strategist

In his April 2026 video on de-slopping a codebase, Matt calls agents excellent tactical programmers who need a strategic programmer above them: you. The agent finds candidates; you decide what's good for the code's long-term health.

- **Pick, don't rubber-stamp.** Choose the candidate yourself and answer the grilling properly. A badge is the agent's opinion.
- **Design the interface; delegate the implementation.** Matt's rule from his April 2026 talk: you own each module's front door, and the agent can own what's behind it, checked by tests at the interface. Not for critical code like finance, though.
- **One candidate per session.** A report, a grilling and later edits together fill the context window (the agent's working memory, which gets less sharp as it fills). The rest become tickets (small tasks for later).
- **Give it a direction.** Before a big build, Matt's docs suggest pointing it at the spec (the written plan) and asking "how can we make this change easy?"
- **Don't wait for "it's fine".** It exists to find things. If every card is `Speculative`, it found nothing worth doing.
- **Know the neighbours.** One broken thing: [Diagnosing bugs](/learn/diagnosing-bugs). An effort too big to plan in one sitting: [Wayfinder](/learn/wayfinder). But if a bug fix shows there's no good seam to pin it down with a test, come back here.

## How Matt and others use it

**Matt Pocock:**

- **Often.** About weekly, or after a burst of features, in March 2026; every couple of days by his April 2026 video. His README now says every few days.
- **A live run.** In that April video he switched auto mode off first, saying it does odd things in flows where a human answers questions. The survey found six candidates on his own app. He picked one where an ordering rule had two separate implementations, front end and back end, that could drift apart: a locality win. To save time he let the agent accept its own recommendations, but said he'd normally answer each question carefully. The next step, he said, is turning the result into a ticket for an agent to build unattended, with the Skills now called `/to-spec` and `/to-tickets`.
- **One at a time.** In March he said to tackle a single candidate at a time, because these decisions need taste.
- **Legacy code first.** Before changing an old codebase, he recommends starting here, to find the seams where tests can go.
- **Modules in the plan.** His specs name which modules change and how their interfaces change (April 2026 talk).

**Other developers:**

- A Reddit user runs it on just the code they've written, after each build (r/ClaudeCode, August 2026).
- A counterpoint: in an October 2026 A/B test on a 20,000-line Go service, a blind judge slightly preferred a one-paragraph prompt, though the Skill was cheaper and faster. That prompt copied the Skill's report format, and there were only two runs each, but it's a fair reminder that the method matters more than the magic words.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)), plus Git, the tool that tracks a project's history (check with `git --version`).

1. Copy this site's public repo and start Claude Code in it. If it asks whether you trust the folder, choose Yes.

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped.git
cd idea-to-shipped
claude
```

2. Type a slash and the word improve. If `improve-codebase-architecture` isn't in the list, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If the status bar says "auto mode on", press Shift+Tab until it says "manual mode on". Now the agent asks before editing any file: answer No every time today.
4. Warm up with the vocabulary. Give the reference a question that has an end:

```text
/codebase-design Is src/lessons/lessons.ts deep or shallow, and how many adapters does lessonsFrom(dir) have? Answer in a few lines and change nothing.
```

5. Run the survey. You need an internet connection, because the report loads its styles and diagrams from the web:

```text
/improve-codebase-architecture Focus on src/comments and src/lessons. Show me the report first, and don't start grilling until I pick a candidate.
```

6. Read every card in the page that opens. Pick one and answer one round of questions. Then type: "Stop here. I'm not changing anything today."
7. If it's still working, press Esc. Type `/exit`, then run `git status`.

**It's working if:**

- [ ] The warm-up called the Lessons module deep and named two adapters: the real folder and the fake test folders.
- [ ] The report opened from your temp folder, and `git status` says nothing changed.
- [ ] The cards use the site's words (Lesson, Comment, Slug) and the vocabulary (module, interface, seam, adapter), never "component" or "service".
- [ ] Every card has files, a problem, a solution, benefits, a before-and-after diagram and a badge, and the report ends with a Top recommendation.
- [ ] It stopped and asked which candidate you wanted before grilling you.
- [ ] Any new seam it proposes names a second adapter, or you can spot that it doesn't.

If the page shows plain text with no diagrams, something blocked the web scripts. Ask it to rebuild the report with inline styles and hand-drawn SVG diagrams.
````

## Common mistakes

- **Running `/codebase-design` as the whole task.** Ask it a question with an end, or let a driver Skill use it.
- **Several candidates in one session.** One per session; the rest become tickets.
- **Letting the survey become a refactor.** If the agent starts editing after you agree, press Esc. The Main flow builds the decision.
- **Tidying code nobody touches.** Leverage only pays where you keep editing.
- **A seam with one adapter.** That's plumbing, not design.
- **Loose words** like "component", "service" or "cleaner code". Ask for the vocabulary.
- **Treating folders as modules.** Matt's docs are firm: depth is about the interface, whatever the folders look like.

```site-story
Minutes after v1 of this site shipped, I typed `/mattpocock-skills:codebase-design` (the full name, which always reaches Matt's Skill) with nothing after it. I wanted to learn the words.

The agent treated it as a vocabulary, not a task, and judged the code I'd just shipped in one reply:

| Module | Its verdict |
|---|---|
| Lessons: `listLessons`, `getLesson`, `lessonExists` | Deep: hides the files, headers, sorting, Markdown and previous/next links |
| Comments: `postComment`, `listComments` | Deep, and deeper since the last fix |
| The comments route | A thin adapter, on purpose (ADR 0001) |
| `lessonsFrom(dir)` | A real seam: two adapters, the real folder and the fake ones |
| Comments to the database | One adapter, so don't add a seam |

**Its recommendation: change nothing.** It added that knowing when not to restructure is a useful lesson too. I was also lucky: issue #449 shows the same Skill, handed a session to drive, spiralling for 105k tokens.

**The deepening move had already happened.** PR #7, merged minutes earlier, came out of a code review. It moved the "is this a JSON object?" check out of the route and into `postComment`. Now the comments module checks all of its input, and the route, as its own comment says, only speaks HTTP. More behaviour behind the same small interface: that's depth.

**One judgement call is still open.** A second review of PR #7 suggested splitting `postComment` into a `parseCommentInput` step and the save. That split would stay inside the module, so callers would see the same interface. I haven't done it.

**Not run on this site yet:** I've never typed `/improve-codebase-architecture` on this repo, so there's no report of mine to show you.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Talking about code's shape | module, interface, depth, seam, adapter, leverage, locality |
| Is this module worth it? | Deletion test: does the complexity vanish, or spread to every caller? |
| Add a seam? | Only with two adapters, often the real one and a test one |
| Where tests go | At the interface; delete old tests on the parts inside |
| Shared words for one question | `/codebase-design` plus a question with an end |
| Don't know where it hurts | `/improve-codebase-architecture` (only you can start it) |
| Big build coming | Point the survey at the spec: "how can we make this change easy?" |
| Report open | Pick one candidate and grill it; one per session |
| After the grilling | `/to-spec` or `/grill-with-docs`; the Main flow builds it |
| How often | Every few days, or after a burst of features |

## Final test

```test scenario-grown-fast
Your team's app gained a dozen features in a month. Changes now feel slow and risky, but nobody can say which part is the problem. Which Skill do you type?
- [ ] `/codebase-design`, and let it work through the repo
  > It's a reference with no process or end. Given the whole job, the agent invents a process and can run a long way before asking you anything.
- [ ] `/diagnosing-bugs`
  > That's for one specific thing that's broken. Nothing is broken here; the code is getting hard to change.
- [x] `/improve-codebase-architecture`
  > Right. It's the survey: it looks where the code keeps changing, finds candidates to deepen and hands you a report.
- [ ] `/wayfinder`
  > That plans a huge, foggy new effort. You're not planning a build; you want to know where the existing code hurts.
```

```test scenario-big-build
Next week you start a large feature from a finished spec, and it touches the checkout code. How do Matt's docs suggest using the survey beforehand?
- [x] Point it at the spec and ask how to make that change easy.
  > Right. A direction makes the report actionable, and the docs call this its most effective prompt.
- [ ] Run it with no prompt, then work through every candidate before starting.
  > With no direction it hunts for hot spots, which may have nothing to do with checkout. And it's one candidate per session.
- [ ] Skip it until the feature ships, then tidy whatever got messy.
  > Then the feature lands on top of the friction. Making the change easy first is the point.
- [ ] Ask it to refactor the checkout code before the feature work begins.
  > It never changes code. It hands you candidates; the refactor goes through the Main flow.
```

```test scenario-legacy
You inherit an old app with no tests and want to start changing it with an agent. What does Matt suggest doing first?
- [ ] Let the agent rewrite it from scratch, since it's a ball of mud.
  > A rewrite throws away behaviour nobody wrote down. Build a safety net around the existing code first.
- [ ] Ask `/improve-codebase-architecture` to untangle it in one run.
  > It never changes code, and Matt's README calls it a survey, not a rescue.
- [ ] Write tests that reach inside every function, so nothing is missed.
  > Testing past the interface ties tests to today's shape, so every later change breaks them.
- [x] Run the survey to find seams where tests can go.
  > Right. Tests at good seams are the safety net that makes later changes safe, and the survey is where Matt starts.
```

```test scenario-settle-words
Halfway through a `/tdd` session, you and the agent disagree about whether a new helper should be its own module. Which Skill gives you shared words to settle it, and how does it start?
- [ ] `/improve-codebase-architecture`, which the agent starts when it notices friction
  > It's user-invoked, so only you can start it. And it surveys a whole area; you need words for one question.
- [x] `/codebase-design`: you type it, or the agent loads it itself
  > Right. It's the model-invoked vocabulary reference, and `/tdd` already leans on it for the shape of an interface.
- [ ] `/domain-modeling`, which the agent loads when terms come up
  > That one sharpens the words of your problem, like "Comment" or "Visitor", not the shape of a module.
- [ ] `/grill-me`, which only you can start
  > That runs an interview about a plan. You need a shared vocabulary for module shape.
```

```test spot-one-adapter
Kai adds a `CommentStore` interface in front of the database "so we can swap it later". Only one thing ever fills it, the real Postgres, and the tests use a real database too. Spot the mistake.
- [ ] The interface should be called a boundary, not a store.
  > The vocabulary actually bans "boundary". The name isn't the problem.
- [ ] The tests should mock the database instead.
  > Mocking is a separate decision, and some projects choose real databases on purpose. The problem is the seam itself.
- [x] It has one adapter, so it's only a hypothetical seam.
  > Right. It's plumbing with nothing to swap. Add the seam when a second adapter, like an in-memory fake for tests, actually exists.
- [ ] The interface needs more functions so callers can do more with it.
  > More functions make the interface bigger, which makes the module shallower, not better.
```

```test spot-carried-on
Sam runs the survey and agrees with the top candidate after two rounds of grilling. The agent then starts editing five files in the same session. What should Sam have done?
- [ ] Let it finish, since agreeing with the candidate was approval to build.
  > Agreeing settles a design, not a go-ahead to build. The survey should end with a decision, not a diff.
- [x] Stop it, and take the decision into the Main flow.
  > Right. The Skill never changes code. Press Esc, then carry the decision into `/to-spec` or `/grill-with-docs`.
- [ ] Ask it to do the other candidates too, while it has the report open.
  > One candidate per session. Several at once fill the context window with reports, grilling and edits.
- [ ] Commit the HTML report first, so the edits can point back to it.
  > The report is a temp file. Carry the decision forward, not the file.
```

```test spot-layered-tests
Priya deepened her cart code into one module with a small interface and wrote tests against it. She also kept every old test on the little functions inside, and now each internal tidy-up breaks dozens of them. What's the mistake?
- [ ] She should have kept the small functions as separate modules.
  > That undoes the deepening. Small parts are fine inside; tests just shouldn't target them.
- [ ] Her new interface is too small to test properly.
  > A small interface is the goal. Tests through it still exercise all the behaviour behind it.
- [ ] She needs a seam around every small function so each can be faked.
  > That's testing past the interface with extra steps. A seam needs two real adapters, not a wish to fake things.
- [x] The old tests go past the interface; delete them.
  > Right. Replace, don't layer: once tests exist at the deeper interface, the old shallow tests are waste.
```

```test sequence-survey
In what order does `/improve-codebase-architecture` work when you name no direction?
- [ ] Ask which module to explore → explore → grill → write the report
  > It never asks before it has looked. You choose from the report, after it's written.
- [ ] Explore the whole repo evenly → grill you on its best idea → write the report
  > Grilling comes last, on a candidate you picked, and exploring starts from the hot spots.
- [x] Find hot spots in the history → explore → report → you pick one → grill
  > Right. Scope, explore, report and stop; the grilling runs only on the candidate you chose.
- [ ] Write the report → refactor the `Strong` candidates → grill you on the rest
  > It never changes code, and it grills only on the one candidate you pick.
```

```test predict-deletion
A `priceFor` module is used by the cart, checkout, invoices and receipt emails. If you deleted it, each of those would need its own tax rules, discounts and rounding. What does the deletion test say?
- [ ] It's a pass-through, so its code belongs inside each caller.
  > A pass-through is one where nothing gets harder once it's gone. Here the complexity comes back four times.
- [x] It's earning its keep and should stay.
  > Right. Complexity that reappears across callers means the module was concentrating it. That's depth doing its job.
- [ ] It's an adapter, so the deletion test doesn't apply to it.
  > An adapter fills a seam. Nothing is being swapped here, and the deletion test works on any module.
- [ ] It should be split into four, one copy per caller.
  > That's the opposite of locality. Four copies of the tax rules means four places to fix every bug.
```

```test why-locality
After a deepening, a teammate says: "I fixed the rounding bug once, and every page that shows a price got the fix." Which benefit of depth is that?
- [x] Locality: change and bugs concentrate in one place
  > Right. Maintainers get locality: fix it once, fixed everywhere.
- [ ] Leverage, which callers get from a small, simple interface
  > Close, but leverage is what callers get: more capability per thing they learn. A fix landing everywhere is about where change lives.
- [ ] A real seam, because several pages share the module
  > A seam is where you can swap an adapter. Sharing a module across pages doesn't swap anything.
- [ ] Shallowness, because the fix itself was small
  > A small fix says nothing about the interface. Shallow means the interface is nearly as big as the code behind it.
```

```sources
- [codebase-design SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/codebase-design/SKILL.md), with [DEEPENING.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/codebase-design/DEEPENING.md) and [DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/codebase-design/DESIGN-IT-TWICE.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [improve-codebase-architecture SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/improve-codebase-architecture/SKILL.md), with [HTML-REPORT.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/improve-codebase-architecture/HTML-REPORT.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) ("Codebase health", "Vocabulary underneath"): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) ("We Built A Ball Of Mud"; a survey, not a rescue; every few days) and [CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (hot-spot scoping in 1.2.0): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /improve-codebase-architecture Skill](https://www.aihero.dev/skills-improve-codebase-architecture) and [The /codebase-design Skill](https://www.aihero.dev/skills-codebase-design), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [How To De-Slop A Codebase Ruined By AI (with one skill)](https://www.youtube.com/watch?v=3MP8D-mdheA), Matt Pocock, 2026-04-29 (entropy and the ball of mud 0:06–0:32, auto mode off 5:53, six candidates and the locality pick 6:28–7:06, a ticket for an unattended agent 7:47–7:54, answering thoughtfully 7:57–8:10, tactical vs strategic 9:16–9:56, every couple of days 9:57, legacy code 10:25–10:59).
- ["Software Fundamentals Matter More Than Ever"](https://www.youtube.com/watch?v=v4F1gFy-hqg), Matt Pocock, AI Engineer, 2026-04-23 (Ousterhout's complexity 2:40–3:01, better codebase, better feedback 12:15–12:35, shallow modules are hard for AI 13:18–13:52, grey boxes 15:34–16:24, "Design the interface, delegate the implementation." 16:26, modules in the spec 16:45–16:55, tactical vs strategic 17:23–17:39).
- [5 Claude Code skills I use every single day](https://www.youtube.com/watch?v=EJyuu6zlQCg), Matt Pocock, 2026-03-16 (one candidate at a time 14:09–14:25, weekly or after a burst 14:45–14:59).
- [Issue #449: /codebase-design gets run as a session driver](https://github.com/mattpocock/skills/issues/449), opened 2026-07-04, closed 2026-10-06.
- [Discussion #1247: A/B test of /improve-codebase-architecture vs a plain prompt](https://github.com/mattpocock/skills/discussions/1247), 2026-10-10.
- [r/ClaudeCode thread: running the survey after each build](https://www.reddit.com/r/ClaudeCode/comments/1vgtqpy/), 2026-08-06.
- [A Philosophy of Software Design, 2nd edition](https://web.stanford.edu/~ouster/cgi-bin/book.php), John Ousterhout, 2021, read 2026-10-23.
```
