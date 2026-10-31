---
title: Architecture
slug: architecture
image: /photos/architecture.jpg
imageAlt: A white cable-stayed bridge pylon with fanned steel cables against a deep blue sky.
imageCredit: Daniele Bissoli
---

Agents write code fast, and fast code gets messy fast. Learn the words for judging a codebase's shape, and a Skill that finds where it's getting hard to change.

```goals
- You'll be able to explain module, interface, depth, seam and adapter, and say what leverage and locality give you.
- You'll be able to judge a design with the deletion test and the one-adapter-or-two rule.
- You'll be able to run `/improve-codebase-architecture`, read its report and carry one candidate forward, knowing its job ends at a decision, not a code change.
- You'll be able to tell `/codebase-design`, a reference, from a Skill that drives a session, and pick the right one.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Ask it for a feature and it makes the change in front of it, without thinking about the whole codebase (all the code in a project) unless something makes it. So each change adds a little oddness: a second copy of a rule, a helper that only passes things along. Matt Pocock, a developer and teacher, calls this drift ==software entropy==, and says agents speed it up. Left alone, a codebase becomes what he calls a "ball of mud", where every change is slow and risky. He publishes a popular set of Skills for Claude Code: short instruction files the agent loads when you type their name, or when a task matches their description.

Matt's architecture Skills draw on John Ousterhout's book *A Philosophy of Software Design*, which defines complexity as whatever makes a system hard to understand and change. It hurts agents too: an agent starts every session (one Claude Code conversation) knowing nothing about your project. If understanding one idea means opening twelve tiny files, it may miss one, and its next change makes things worse. Good structure also makes tests (small programs that check the code works) easier to write, and they're how the agent checks its work: better feedback, Matt argued in an April 2026 talk, means better code.

This Lesson covers two Skills. `/codebase-design` gives you and the agent an exact vocabulary for the shape of code. `/improve-codebase-architecture` uses it to survey a codebase and hand you places to improve. You don't need to write code to use either. You need to judge.

## The words

Every term below comes from the `/codebase-design` Skill, which tells the agent to use them exactly. The examples are this site's real files.

- A **module** is anything with a front door and code behind it, at any size: a function (a named chunk of code that does one job), a file, a whole package of files. This site's Lessons module, `src/lessons/lessons.ts`, is one.
- Its **interface** is everything a caller (the code that uses it) must know to use it correctly: the names, plus rules like call order, errors and required settings. The Lessons module's interface is mainly four functions: `listLessons`, `getLesson`, `getQuestions` and `lessonExists`.
- Its **implementation** is the code behind the door. Behind those four functions, the Lessons module reads the Lesson files, checks and sorts them, turns them into web pages, pulls out their questions and links each to the next.
- **Depth** is how much a caller gets per thing it has to learn. A ==deep module== hides a lot behind a small interface. A **shallow module** has an interface nearly as complicated as the code behind it.
- A **seam** (the programmer Michael Feathers' term) is a place where you can change behaviour without editing the code there. It's where an interface lives, and choosing where to put one is its own decision. Callers and tests cross the same seam: it's where [TDD](/learn/tdd) has tests plug in.
- An **adapter** is a concrete thing that plugs into a seam. The word names the slot it fills, not what's inside. A real database in the live app and a fake one in the tests would be two adapters at the same seam.

Depth pays twice. Callers get **leverage**: one implementation does the work for every page and test that uses it. Maintainers get **locality**: changes, bugs and checking concentrate in one place, so ==fix it once, fixed everywhere==.

The Skill bans looser words, "component", "service", "API" and "boundary": design talk gets much shorter when you and the agent mean the same thing by "seam".

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

**The deletion test.** Imagine deleting the module. If the complexity vanishes with it, it was a pass-through (code that only hands the call on). If the complexity would reappear in every caller, it was ==earning its keep==. Delete the Lessons module, and the home page, every Lesson page and the comment check would each have to read and parse the files themselves: it stays. Delete a `formatDate` helper that calls one built-in function from one place, and nothing gets harder: a pass-through.

**One adapter means a hypothetical seam; two adapters mean a real one.** Don't cut a seam until something actually varies across it. That's about adding a new swap point, like a fake database; tests still go through the interface. The Lessons module is built by `lessonsFrom(dir)`, which takes the folder to read as an input. The live site passes the real `content/lessons` folder; the tests pass folders of fake Lessons. Two adapters, so the seam is real, which is why those tests were easy to write.

The comments module talks to Postgres (the database software this site uses) directly. A setting already picks the live database or, in the tests, a separate real copy. A new seam for a fake database would have one adapter, plumbing with nothing to swap: an ADR (a short decision record kept in the repo, the project's folder with its history tracked by Git) keeps the tests on real Postgres.

The other two principles shape what you build:

- **The interface is the test surface.** Tests go through the same front door as callers. If you need to test past it, poking at the parts inside, the module is probably the wrong shape. After deepening a module, test at its new interface and delete the old tests on the pieces inside: replace, don't layer.
- **Depth belongs to the interface, not the implementation.** Inside, a deep module can hold small parts and even private internal seams, where its own tests plug in a stand-in yet still call the front door. Callers never see them.

```scene flow
title: Judging this site's code with the vocabulary
node: route | Comments route
node: comments | Comments module
node: lessons | Lessons module
node: seam | lessonsFrom(dir)
node: db | Comments to database
node: verdict | Change nothing
# The comments route, the code that answers when someone posts a Comment, is a thin caller on purpose (ADR 0001): it only turns web requests into calls on the comments module.
at: route
# The comments module hides input checks, the check that the Lesson exists, length limits and the database code behind two functions. Deep.
at: comments
# The Lessons module hides reading, checking, sorting and rendering the Lesson files behind four functions. The deletion test says keep it.
at: lessons
# lessonsFrom(dir) has two adapters, the real folder and the fake test folders, so this seam is real.
at: seam
# A seam for swapping in a fake database would have one adapter, because ADR 0003 keeps the tests on real Postgres. One adapter is a hypothetical seam, so add nothing.
at: db
# The verdict: each piece is the right shape for now, so nothing needs to change.
at: verdict
```

```checkpoint real-seam
Lee plans an `EmailSender` seam in front of the app's only email provider, "in case we switch one day". Nothing else would plug into it, not even in the tests. What does the one-adapter-or-two rule say?
- [x] Hold off: with one adapter, it's a hypothetical seam.
  > Right. Nothing varies across it yet. Add it when a second adapter, such as a test fake, actually exists.
- [ ] Add it: switching providers one day will be easier with it in place.
  > "One day" is still one adapter today. Add the seam when the second adapter really exists.
- [ ] Add it: a clear name like `EmailSender` makes the code read better.
  > A good name helps, but it doesn't make a seam. Only a second adapter does.
- [ ] Hold off until the email code is long enough to split into files.
  > Seams are about what varies, not about length or file layout. A long module can still be deep.
```

## Two Skills, two jobs

`/codebase-design` is a **reference**: the vocabulary and principles above, plus two deeper files. One explains how to test a deepened module depending on what it talks to. The other, "design it twice", sends three or more sub-agents (helper agents, each with a fresh memory) to design radically different interfaces for the same module, then compares them.

It's **model-invoked**: you can type `/codebase-design`, or the agent can load it on its own when a design task fits. `/tdd` (Matt's Skill for building test-first) and `/improve-codebase-architecture` both lean on it.

What it lacks is a session process: its main file has no steps, and nothing says when to stop. Give a fresh session `/codebase-design` as the whole task and ==the agent invents a process==. In issue #449 on Matt's repo (July 2026), an agent told to "drive the open decisions" with it reached for the design-it-twice steps, re-explored code another session had already mapped, and ran to about 105k tokens (the chunks of text AI usage is measured in) before asking anything. The issue was closed with no guard added, so the fix is yours: let a driver Skill (one with steps and a point where it stops) run the session, such as `/grill-with-docs` (an interview that also records the project's terms), `/improve-codebase-architecture` or `/tdd`. Or type `/codebase-design` with a question that has an end, like "is this module deep?"

`/improve-codebase-architecture` is a **survey**, and it's **user-invoked**: only you can start it, by typing its name at the start of your message; plain words won't. Matt's router Skill, `/ask-matt`, which points you to the right Skill for a job, files it under codebase health: upkeep, not feature work. The survey picks where to dig; `/codebase-design` gives you the words for designing the one you pick.

```checkpoint reference-not-driver
You end a session by asking for a note for tomorrow. It says: "Next session: run `/codebase-design` and finish designing the payment module." Next morning a fresh session reads it, re-reads half the repo and designs interfaces nobody asked for, without checking in. Why?
- [ ] It's user-invoked, so starting it from a note put it in the wrong mode.
  > It's model-invoked, and how it started isn't the problem.
- [ ] Your effort setting (how hard the model thinks) was too low.
  > Effort changes how hard the model thinks. The real gap is that nothing told it when to stop.
- [x] It's vocabulary with no steps or end, so the agent made its own.
  > Right. The note should name a driver Skill with steps and an end, such as `/grill-with-docs`, and say to use the `/codebase-design` words: the agent can load that reference itself.
- [ ] Re-reading the repo before designing is simply its normal process.
  > Its main file has no steps or end. That's exactly why the agent improvised one.
```

## A survey, step by step

Here is what `/improve-codebase-architecture` does, in order:

1. **Scope first.** Improving code only pays off if someone changes it again. If you name a direction (a module, a folder, a pain point), it takes it. If not, it reads the commit history (`git log`, the list of saved changes) for ==hot spots==, the files that keep changing, and looks there first. If nothing stands out, it widens the search.
2. **Read the project's own words.** It reads `GLOSSARY.md` (the project's agreed terms) and the relevant ADRs ([Domain modeling](/learn/domain-modeling) covers both), so its suggestions say "the Comment module", not invented names. It suggests something an ADR rules out only when the problem is worth reopening that decision, and flags the clash.
3. **Explore.** A sub-agent walks the code noting friction, such as one idea spread across many small modules, shallow modules, or code that's hard to test. The deletion test filters the list.
4. **Write a report.** One web page goes to your computer's temp folder (a place for throwaway files) as `architecture-review-<timestamp>.html`, so nothing lands in your project. It opens the page and tells you its full path. Each candidate (a place it suggests deepening) gets a card: the files, the problem, the solution, the benefits in terms of locality and leverage (and tests), a before-and-after diagram, and a badge: `Strong`, `Worth exploring` or `Speculative`. Benefits may be headed "Wins", and a second tag, like `in-process`, names the kind of dependency. A Top recommendation closes the report.
5. **Stop and ask.** No designs yet: it asks which candidate you'd like to explore.
6. **Grill one.** On your pick, it runs the grilling Skill ([Grilling](/learn/grilling)): rounds of numbered questions with recommended answers, about the module's new shape, what sits behind the seam and which tests survive. New terms go into `GLOSSARY.md` as they settle. Turn a candidate down for a lasting reason and it offers to record an ADR, so future surveys don't suggest it again.

Its job ==ends at a decision==: none of its steps builds anything, though an eager agent may try to carry on. The run leaves a conversation, one HTML file, any terms it added to `GLOSSARY.md` and any ADR you said yes to. The refactor (restructuring code without changing what it does) comes later, through the Main flow, the path most work takes from idea to shipped: `/grill-with-docs` or `/to-spec` (which writes the decision up as a spec, the written plan), then `/to-tickets` (which splits it into tickets, small tasks one session can finish) and `/implement` (which builds them). See [The main flow](/learn/main-flow).

```scene chat
title: Surveying a recipe site (illustrative)
# You type the Skill and name a direction. Without one, it would look for hot spots in the commit history.
you: `/improve-codebase-architecture` Focus on the shopping list. It changes every week and keeps breaking.
# It reads the project's words and past decisions, has a sub-agent explore, writes the report outside the project and stops to ask.
agent: Read GLOSSARY.md (Recipe, Shopping List, Serving) and the ADRs, and explored the shopping-list code. Report written and opened: /var/folders/…/T/architecture-review-20261023-1412.html. Three candidates. Top recommendation: one Shopping List module for the merging rules, copied in three places today. The third, a recipes database, is `Speculative`. Which of these would you like to explore?
# You pick one, and turn another down for a lasting reason.
you: The first. And drop the third for good: recipes stay plain text files so anyone can edit them.
# It offers to record the rejection, then grills. Each question (❓) comes with its recommended answer (➡️).
agent: Shall I record that as an ADR, so later surveys don't suggest it again? ❓ **Q1** - **Interface**: Should callers only ever call `addRecipe(list, recipe, servings)`, with unit conversion hidden inside? ➡️ Yes. ❓ **Q2** - **Tests**: Should tests on `addRecipe` replace the three old merging tests? ➡️ Yes: replace, don't layer.
# You answer the whole round in one line: "yes" accepts a recommendation.
you: Yes to the ADR. 1 yes, 2 yes.
# With nothing left open, it checks you agree. The result is a decision, not a code change.
agent: ADR recorded. That settles every open question: one deep Shopping List module behind `addRecipe`, tested at that interface. Is that our shared understanding? No code has changed; take it into `/to-spec` when you're ready.
```

```checkpoint turned-down
During a survey of an online shop, you turn a candidate down for good: "Orders stay in one table, because the finance team queries it by hand." What does the Skill do next?
- [ ] Adds the reason to `GLOSSARY.md`, so the agent keeps it in mind.
  > The glossary holds the project's terms, like Order. A lasting decision and its reason belong in an ADR.
- [ ] Nothing: a turned-down candidate simply drops out of the conversation.
  > That fits "not right now". A lasting reason that a future survey would need gets an ADR offer.
- [ ] Strikes the card out of the HTML report, so nobody picks it later.
  > The report is a one-off temp file. The next survey writes a fresh one and never reads this.
- [x] Offers to write it up as an ADR, a record later surveys will read.
  > Right. It offers this only for a reason a future survey would need, not for "not now".
```

## Your part: the strategist

In his April 2026 video on de-slopping a codebase, Matt calls agents excellent tactical programmers who need a strategic programmer above them: you. The agent finds candidates; you judge which changes will keep the code easy to work in.

- **Pick, don't rubber-stamp.** Choose the candidate yourself and answer the grilling properly. A badge is the agent's opinion.
- **"Design the interface, delegate the implementation."** That's Matt's rule from his April 2026 talk: you own each module's front door, and the agent can own what's behind it, checked by tests at the interface. Not for critical code like finance, though.
- **One candidate per session.** These decisions need taste, Matt said in March 2026, and a report, a grilling and later edits together fill the context window (the agent's working memory, which gets less sharp as it fills; see [The context window](/learn/context-window)). Others worth doing (`Strong` or `Worth exploring`) can become tickets.
- **Give it a direction.** Before a big build, Matt's docs on AI Hero (his teaching site) suggest pointing it at the spec and asking "how can we make this change easy?"
- **Don't wait for "it's fine".** It exists to find things. If every card is `Speculative`, it found nothing worth doing.
- **Know the neighbours.** One broken thing: [Diagnosing bugs](/learn/diagnosing-bugs). An effort too big to plan in one sitting: [Wayfinder](/learn/wayfinder). If a bug fix finds no good seam to test it at, come back here.

## How Matt and others use it

**Matt Pocock:**

- **Often.** About weekly, or after a burst of features, in March 2026; every couple of days by his April 2026 video. His README (the front page of his Skills repo) now says every few days.
- **A live run.** In that April video he switched off auto mode (where Claude Code approves routine actions itself), saying it misbehaves in flows where a human answers questions. The survey found six candidates on his own app. He picked one where an ordering rule was written twice, in the browser code and the server code, and could drift apart: a locality win. To save time he let the agent accept its own recommendations; normally he'd answer each carefully. Next, he said, the result becomes a ticket (through what are now `/to-spec` and `/to-tickets`) for an agent to build unattended.
- **Legacy code first.** Before changing an old codebase, he recommends starting here, to find the seams where tests can go.

**Other developers:**

- One user loved the survey but found the grilling crowded it out: each run became a long interview about one idea (GitHub issue #274, May 2026). In 1.3.1 the report comes first; the Try it prompt insists on it.
- A counterpoint: in an October 2026 test on a 20,000-line program in the Go language, a judge shown the reports unlabelled ranked a one-paragraph prompt that copied the Skill's report format slightly above the Skill. Two runs each is one data point, but a fair reminder that a Skill is a well-written prompt, not magic.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)), plus Git: type `git --version` to check. If it's missing, a Mac offers to install it; on Windows, install Git for Windows from git-scm.com, then open a new terminal.

1. Copy this site's public repo and start Claude Code in it. If it asks whether you trust the folder, choose Yes.

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped.git
cd idea-to-shipped
claude
```

2. Type a slash and the word improve. If `improve-codebase-architecture` is in the list that pops up, delete what you typed and go on. If it isn't, delete it, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If the label under the prompt box says "auto mode on", press Shift+Tab until it says "manual mode on". Now the agent asks before it writes a file or runs most commands. Choose Yes when it asks to find your temp folder, write the `architecture-review-….html` report there, or open it. Choose No to any change inside `idea-to-shipped`, such as `GLOSSARY.md`.
4. Warm up with the vocabulary. Give the reference a question that has an end:

```text
/codebase-design Is src/lessons/lessons.ts deep or shallow, and how many adapters does lessonsFrom(dir) have? Answer in a few lines and change nothing.
```

5. Run the survey. You need an internet connection, because the report loads its styles and some diagrams from the web:

```text
/improve-codebase-architecture Focus on src/comments and src/lessons. Show me the report first, and don't start grilling until I pick a candidate.
```

6. Read every card in the browser page that opens. Back in the terminal, type the title of the card you pick. Answer its round of numbered questions in one reply, where "yes" accepts a recommendation: `1 yes, 2 no: keep it in one file`. Then type: "Stop here. I'm not changing anything today."
7. If it's still working, press Esc. Type `/exit`, then run `git status`.

**It's working if:**

- [ ] The warm-up said whether the Lessons module is deep and how many adapters `lessonsFrom(dir)` has. This Lesson counts two; if yours says one, ask why and weigh its reason.
- [ ] The report's path, which the agent printed, is outside `idea-to-shipped`, and `git status` says `nothing to commit, working tree clean`.
- [ ] The cards use the site's words (Lesson, Comment, Slug) and the vocabulary (module, interface, seam, adapter), never "component" or "service".
- [ ] Every card has files, a problem, a solution, benefits, a before-and-after diagram and a badge, and the report ends with a Top recommendation.
- [ ] It stopped and asked which candidate you wanted before grilling you.
- [ ] Any new seam it proposes names a second adapter, or you can spot that it doesn't.

If the page looks unstyled, or some diagrams show as raw code, something blocked the web scripts. Ask it to rebuild the report with everything inside the one file.
````

## Common mistakes

- **Running `/codebase-design` as the whole task.** Ask it a question with an end, or let a driver Skill use it.
- **Letting the survey become a refactor.** If the agent starts editing after you agree, press Esc. The Main flow builds the decision.
- **Mistaking tidy folders for depth.** Matt's docs are firm: depth is about the interface, whatever the folders look like.
- **The rest is above:** loose words, several candidates at once, tidying code nobody touches, one-adapter seams.

```site-story
**The deepening move came from a review.** My two-axis `/mattpocock-skills:code-review` of the whole site (one reviewer for standards, one for the spec) listed judgement calls, including the comment length limits written in two places and the comments route checking input itself. PR #7 (a pull request, or proposed change) fixed both. The shape check on posted data moved out of the route into `postComment`, and the limits moved into one file, `src/comments/limits.ts`. Now the route only speaks HTTP (the language of web requests), as its own comment says. More checking behind the same two functions is depth; one home for the limits is locality.

**The seam has a name in the plan.** The spec for the site's redesign calls the Lessons module "the one seam", tested through its public functions with small folders of fake Lessons.

**Not run on this site yet:** I've never typed `/improve-codebase-architecture` on this repo, so there's no report of mine to show you.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Is this module worth it? | Deletion test: does the complexity vanish, or spread to every caller? |
| Add a seam? | Only with two adapters, often the real one and a test one |
| Where tests go | At the interface; delete old tests on the parts inside |
| Shared words for one question | `/codebase-design` plus a question with an end |
| Don't know where it hurts | `/improve-codebase-architecture` (only you can start it) |
| Big build coming | Point the survey at the spec and ask how to make that change easy |
| Report open | Pick one candidate and grill it; one per session |
| After the grilling | `/to-spec` or `/grill-with-docs`; the Main flow builds it |
| How often | Every few days, or after a burst of features |

## Final test

```final-test scenario-grown-fast
Your team's app gained a dozen features in a month. Each new change now touches more files than it should, and nobody can say which part is the problem. Which Skill do you type?
- [ ] `/codebase-design`, and let it work through the repo
  > It's a reference with no process or end. Given the whole job, the agent invents a process and can run a long way before asking you anything.
- [ ] `/diagnosing-bugs`
  > That's for one specific thing that's broken or slow. Nothing is broken here; the code is getting hard to change.
- [x] `/improve-codebase-architecture`
  > Right. It's the survey: it looks where the code keeps changing, finds candidates to deepen and hands you a report.
- [ ] `/wayfinder`
  > That plans a huge, foggy new effort. You're not planning a build; you want to know where the existing code hurts.
```

```final-test scenario-unscoped-run
Next week you build a large feature from a finished spec. It reworks the checkout code, which nobody has touched in a year. Today you type `/improve-codebase-architecture` with nothing after it. What's the risk?
- [x] It looks first where code changed recently: not checkout.
  > Right. With no direction it looks at the hot spots in the history first. Point it at the spec and ask how to make that change easy.
- [ ] It will grill you on every candidate before it writes the report.
  > It writes the report first and grills only on the one you pick. The risk is where it looks.
- [ ] With no direction it won't run until you name a module.
  > It doesn't need one: it infers hot spots from the history. That's exactly why it may miss checkout.
- [ ] It skips `GLOSSARY.md` and the ADRs when no direction is given.
  > It reads the project's words and decisions either way. The problem is the scope it picks.
```

```final-test scenario-settle-words
Halfway through a `/tdd` session, you and the agent disagree about whether a new helper should be its own module. Which Skill gives you shared words to settle it, and how does it start?
- [ ] `/tdd` itself, since it already holds the deep-module words
  > `/tdd` leans on `/codebase-design` for those words; it isn't their source.
- [x] `/codebase-design`: you type it, or the agent loads it itself
  > Right. It's the model-invoked vocabulary reference, and `/tdd` already leans on it for the shape of an interface.
- [ ] `/grill-with-docs`, which the agent starts when terms come up
  > It's user-invoked, so only you can start it, and it's a whole interview about the project's terms. You need words for one question about shape.
- [ ] `/improve-codebase-architecture`, typed at the start of your next message
  > Typing it is right for a survey, but that scans a whole area and writes a report. You need shared words for one question.
```

```final-test spot-removed-seam
Kai deletes the app's `PaymentGateway` interface, calling it "a pass-through". The live app plugged Stripe (a payment service) into it, and the tests plugged in a fake that records charges without taking money. Spot the mistake.
- [ ] His call was right: with one adapter in the live app, it's just plumbing.
  > A test fake counts as an adapter. The live one plus the test one is the usual pair that makes a seam real.
- [ ] He was wrong, because code that handles money always needs a seam.
  > What the code handles doesn't make a seam real. The two adapters, Stripe and the test fake, do.
- [x] Two adapters filled it, so it was a real seam worth keeping.
  > Right. The real gateway and the test fake both plug in there. Without it, the tests need real Stripe.
- [ ] The deletion test backs him, because the live app still runs without it.
  > The deletion test asks where the complexity goes. Here it lands in every test, which now needs real Stripe or its own workaround.
```

```final-test spot-carried-on
Sam runs the survey and, after two rounds of grilling, agrees with the top candidate. The agent replies "Great, starting the refactor" and begins editing five files in the same session. What should Sam do?
- [ ] Let it finish, since agreeing with the candidate was approval to build.
  > Agreeing settles a design, not a go-ahead to build. The survey should end with a decision, not a code change.
- [x] Press Esc, and carry what was agreed into `/to-spec`.
  > Right. The Skill's job ends at the decision; building isn't one of its steps. A spec, then tickets, builds it.
- [ ] Ask it to do the other candidates too, while it has the report open.
  > One candidate per session. Several at once fill the context window with reports, grilling and edits.
- [ ] Let it go on, but ask it to run the tests after each file it edits.
  > Tests check the edits, but they're still a build nobody planned. The building comes later, through a spec and tickets.
```

```final-test spot-layered-tests
Priya deepened her cart code into one module with a small interface and wrote tests against it. She also kept every old test on the little functions inside, and now each internal tidy-up breaks dozens of them. What's the mistake?
- [ ] She should have kept the small functions as separate modules.
  > That undoes the deepening. Small parts are fine inside; tests just shouldn't target them.
- [ ] Her new interface is too small to test properly.
  > A small interface is the goal. Tests through it still exercise all the behaviour behind it.
- [ ] She needs a seam around every small function so each can be faked.
  > Internal seams are allowed, but they don't fix this: the old tests would still target the parts inside. Keep tests at the interface and delete the rest.
- [x] The old tests go past the interface; delete them.
  > Right. Replace, don't layer: once tests exist at the deeper interface, the old shallow tests are waste.
```

```final-test spot-all-speculative
Ana's survey report has four cards, every one badged `Speculative`. Feeling the run must produce something, she turns all four into tickets. What's her mistake?
- [ ] Four is too few; she should rerun it until a `Strong` card appears.
  > It exists to find things, so rerunning only pushes it to stretch. A thin report is a real answer.
- [ ] Only the Top recommendation should have become a ticket.
  > Even that card is `Speculative`. The Top recommendation is the best of what it found, not proof it's worth doing.
- [ ] Grilling all four in one session would have decided faster.
  > One candidate per session, and none of these has earned a grilling.
- [x] She treated `Speculative` cards as work; none was worth doing.
  > Right. An all-`Speculative` report means the survey found nothing worth the effort. Leaving the code alone is a fine outcome.
```

```final-test sequence-survey
In what order does `/improve-codebase-architecture` work when you name no direction?
- [ ] Ask you which module to explore → explore → report → grill
  > With no direction it doesn't ask first: it reads the history for hot spots. You choose after the report.
- [ ] Explore every folder evenly → write the report → pick its top card → grill it
  > It starts from the hot spots, and it grills only on the candidate you pick, not its own top card.
- [x] Find hot spots → explore → report → grill the one you pick
  > Right. Scope, explore, report and stop; the grilling runs only on the candidate you chose.
- [ ] Find hot spots → write the report → refactor the `Strong` cards → grill the rest
  > Building isn't one of its steps, and it grills only on the one candidate you pick.
```

```final-test predict-deletion
A `priceFor(cart)` function holds the tax rules, discounts and rounding. The cart page, checkout, invoices and receipt emails all call it. Run the deletion test on it. What's the verdict?
- [ ] It's a pass-through, so its code belongs inside each caller.
  > A pass-through's complexity vanishes when it's deleted. Delete this and the tax rules, discounts and rounding come back in four callers.
- [x] It's earning its keep and should stay.
  > Right. Complexity that reappears across callers means the module was concentrating it. That's depth doing its job.
- [ ] It's an adapter, so the deletion test doesn't apply to it.
  > An adapter fills a seam. Nothing is being swapped here, and the deletion test works on any module.
- [ ] It's a seam, since four callers plug into it.
  > Callers use a module through its front door; adapters are what plug in at a seam. Nothing is swapped behind `priceFor`.
```

```final-test why-locality
Before a deepening, fixing a rounding bug meant hunting through five files that each rounded prices their own way. Now there's one place to look and one place to change. Which term from the vocabulary names that gain?
- [x] Locality
  > Right. Change, bugs and checking now live in one place, so a fix there is a fix everywhere. It's what maintainers get.
- [ ] Leverage
  > Leverage is what callers get: more capability per thing they learn. This is about where a maintainer has to look and change.
- [ ] A real seam, since prices now pass through one spot
  > A seam is where adapters can be swapped. Nothing is being swapped here.
- [ ] Depth in the implementation, since more code sits inside
  > Depth is measured at the interface, not by how much code sits inside.
```

```sources
- [codebase-design SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/codebase-design/SKILL.md), with [DEEPENING.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/codebase-design/DEEPENING.md) and [DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/codebase-design/DESIGN-IT-TWICE.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [improve-codebase-architecture SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/improve-codebase-architecture/SKILL.md), with [HTML-REPORT.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/improve-codebase-architecture/HTML-REPORT.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [grilling SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/grilling/SKILL.md) (rounds, "yes" accepts, shared understanding): pinned to mattpocock-skills 1.3.1, read 2026-10-24.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) ("Codebase health", "Vocabulary underneath"): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) ("We Built A Ball Of Mud"; every few days) and [CHANGELOG](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/CHANGELOG.md) (hot-spot scoping in 1.2.0): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /improve-codebase-architecture Skill](https://www.aihero.dev/skills-improve-codebase-architecture) (a direction before a big build, the badges, its job ending at a decision, all-`Speculative` reports) and [The /codebase-design Skill](https://www.aihero.dev/skills-codebase-design) (reference, not a driver; folders vs depth), AI Hero docs, updated 2026-08-24, read 2026-10-24.
- [How To De-Slop A Codebase Ruined By AI (with one skill)](https://www.youtube.com/watch?v=3MP8D-mdheA), Matt Pocock, 2026-04-29 (entropy and the ball of mud 0:06–0:32, auto mode off 5:53, six candidates and the locality pick 6:28–7:06, a ticket for an unattended agent 7:47–7:54, answering thoughtfully 7:57–8:10, tactical vs strategic 9:16–9:56, every couple of days 9:57, legacy code 10:25–10:59).
- ["Software Fundamentals Matter More Than Ever"](https://www.youtube.com/watch?v=v4F1gFy-hqg), Matt Pocock, AI Engineer, 2026-04-23 (Ousterhout's complexity 2:40–3:01, better codebase, better feedback 12:15–12:35, shallow modules are hard for AI 13:18–13:52, grey boxes and not for finance 15:34–16:24, "Design the interface, delegate the implementation." 16:26, modules in the spec 16:45–16:55, tactical vs strategic 17:23–17:39).
- [5 Claude Code skills I use every single day](https://www.youtube.com/watch?v=EJyuu6zlQCg), Matt Pocock, 2026-03-16 (one candidate at a time, decisions need taste 14:09–14:25, weekly or after a burst 14:45–14:59).
- [Permission modes](https://code.claude.com/docs/en/permission-modes), Claude Code docs (what Manual mode asks before), read 2026-10-24.
- [Issue #449: /codebase-design gets run as a session driver](https://github.com/mattpocock/skills/issues/449), opened 2026-07-04, closed 2026-10-06.
- [Issue #274, on the survey after grilling was added](https://github.com/mattpocock/skills/issues/274), opened 2026-05-29, closed 2026-10-06.
- [Discussion #1247: A/B test of /improve-codebase-architecture vs a plain prompt](https://github.com/mattpocock/skills/discussions/1247), 2026-10-10.
- [PR #7: Fix code review findings](https://github.com/SiddharthMuramkar/idea-to-shipped/pull/7) and [ADR 0003: tests hit real Postgres](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/docs/adr/0003-tests-hit-real-postgres.md), this site's repo, merged 2026-10-21.
- [A Philosophy of Software Design, 2nd edition](https://web.stanford.edu/~ouster/cgi-bin/book.php), John Ousterhout, 2021, read 2026-10-23.
```
