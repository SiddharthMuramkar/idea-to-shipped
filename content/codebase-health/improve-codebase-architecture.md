---
title: improve-codebase-architecture: find code worth reshaping
slug: improve-codebase-architecture
summary: improve-codebase-architecture surveys your code for the parts that are hard to change and reports how to reshape them, but changes no code itself.
---

## What it's for

Say your yoga-studio booking API works, but understanding one booking means opening five small files, and the tests are hard to write. You can't tell which part to reshape first.

**improve-codebase-architecture surveys a codebase for hard-to-change code and reports the refactors that would help, but it changes no code itself.** A [refactor](/learn/test-first) reshapes code without changing what it does.

```checkpoint quick-1
You run improve-codebase-architecture on your booking API. What happens to the code?
- [x] Nothing. The Skill reports the refactors, and changes no code itself.
- [ ] The Skill applies the refactor that would help most, then reports it.
- [ ] The Skill makes each refactor on a new branch, for you to review.
Why: It surveys the codebase and reports the refactors that would help. They stay suggestions, because it changes no code itself.
```

A **deep module** has a lot of behaviour behind a small [interface](/learn/test-first). A shallow module's interface is nearly as complex as the code behind it.

```checkpoint quick-2
One function is all a caller needs to learn, and a lot of behaviour sits behind it. Which kind of module is that?
- [x] Deep, because it has a lot of behaviour behind a small interface.
- [ ] Shallow, because its interface is as complex as the code behind it.
- [ ] Shallow, because that much behaviour can't sit behind one function.
Why: A deep module has a lot of behaviour behind a small interface. A shallow module's interface is nearly as complex as the code behind it.
```

The Skill looks for **deepening opportunities**: refactors that turn a shallow module into a deep one. That makes code easier to test, and easier for an agent to navigate.

You type `/improve-codebase-architecture`. The agent explores the code and opens an HTML report (a web page), with one panel per **candidate**: a refactor it suggests. For example:

```text
the Booking module                         Strong
Files:     five small modules in api/
Problem:   one booking means opening all five
Solution:  one Booking module with a small interface
```

The badge on the right, a small label, says how strong the case is: Strong, Worth exploring or Speculative.

Then the agent stops and asks which one you'd like to explore. You pick one, and it [grills](/learn/grilling) you on it.

## When to use it

It's upkeep, not feature work.

- You have a spare moment between [Specs](/learn/issues-and-keeping-track).
- You're about to start a big build, and want to make that change easy.
- You've fixed a bug, and [retro](/learn/retro) found no good [seam](/learn/test-first) (a place to test from) to guard against it coming back.

```checkpoint quick-3
Nothing is broken, and the next Spec isn't ready. Does this Skill fit right now?
- [x] Yes. A spare moment between Specs is one of the times it fits.
- [ ] No. It fits only when you're about to start a big build.
- [ ] No. It fits only after you've fixed a bug and run retro.
Why: It's upkeep, so a spare moment between Specs is a good time. A big build coming up and a missing seam after a bug fix are the other two.
```

## When not to use it

- If you've already chosen a module, use [codebase-design](/learn/codebase-design) instead, the Skill for designing code's shape. This Skill is the survey that finds the candidates; codebase-design is the bench where you design the chosen one.
- If something is broken right now, use [diagnosing-bugs](/learn/diagnosing-bugs) instead, because it finds the cause of one bug.

```checkpoint quick-4
You already know which module to reshape, and you want to design it. Which Skill fits?
- [x] codebase-design, the bench where you design the chosen one.
- [ ] improve-codebase-architecture, the survey that finds the candidates.
- [ ] diagnosing-bugs, which finds the cause of one broken thing.
Why: The survey is for finding candidates. Once you've chosen a module, codebase-design is where you design it.
```

## What it needs to start

Only you can start it, by typing its name.

```checkpoint quick-5
Your code keeps getting harder to change, but you've said nothing about it. Will the agent start this survey?
- [x] No. Only you can start it, by typing its name.
- [ ] Yes. It starts once the code is hard enough to change.
- [ ] Yes. It starts in any session that touches a module.
Why: Only you can start it, by typing its name, however messy the code gets.
```

You can name a direction: say, `/improve-codebase-architecture the booking module`. With no direction, the agent reads the recent commits and looks first at the files that keep coming up.

## What it creates

- An HTML report in your computer's temp folder (a scratch space), so nothing lands in the repo. Each panel also has the benefits, a before-and-after diagram and a strength badge.
- A grilling session on the candidate you pick. It settles the new module's shape, so the report proposes no interfaces yet: the grilling decides them.
- New terms in `GLOSSARY.md`, your project's list of agreed words, added as decisions land.
- An [ADR](/learn/domain-modeling), a short record of one decision and why, offered if you reject a candidate for a lasting reason, so future surveys don't suggest it again.

```checkpoint quick-6
The report is open, and you haven't picked a candidate yet. You run `git status`. What do you see?
- [x] No new file, because the report is in your temp folder.
- [ ] One new HTML file, ready for you to commit to the repo.
- [ ] A new branch, holding the report and its diagrams.
Why: The report goes in your computer's temp folder, so nothing lands in the repo.
```

Once the grilling settles the new module's shape, take that decision into [to-spec](/learn/to-spec), which writes it up as a Spec. If you stop at the report instead, the candidate you want is an idea you can take into the [main flow](/learn/main-flow) at [grill-with-docs](/learn/grill-with-docs).

```checkpoint quick-7
You stop after the report, with one candidate you want to carry forward. Where does it go next?
- [x] Into the main flow, as an idea at grill-with-docs.
- [ ] Straight to implement, which refactors it at once.
- [ ] Into an ADR, so later surveys know you chose it.
Why: With no grilling yet, nothing is decided, so the candidate is still an idea. It enters the main flow at grill-with-docs.
```

```diagram
type: chain
caption: "You pick one, and it grills you on it"
steps:
  - "You type `/improve-codebase-architecture`"
  - label: "An HTML report"
    note: "so nothing lands in the repo"
  - label: "A grilling session on the candidate you pick"
    note: "It settles the new module's shape"
```

## Going deeper

### Why it exists

Matt Pocock, who wrote the Skill, starts from this: an agent forgets everything between sessions, so each one must work out your codebase from scratch. You know which modules belong together. The agent sees many modules that can all import from each other, with no groupings. Matt puts the problem this way: "AI is not a super-powered developer. It's a new starter with no memory."

```checkpoint quick-8
You and a fresh agent both open the same repo. What do you have that the agent doesn't?
- [x] You know which modules belong together, and it sees no groupings.
- [ ] You can read every module, and it only sees the ones you name.
- [ ] You see the imports, and it sees modules that can't import each other.
Why: The agent sees many modules that can all import from each other, with no groupings. Matt calls it a new starter with no memory.
```

So Matt argues your codebase shapes the agent's output more than your prompt or your `AGENTS.md` file does. A web of shallow modules is hard to navigate, hard to test and hard to keep in your head.

Reshaping a codebase like that is complicated, but it follows a set of steps you can repeat. So Matt made those steps a Skill.

### How it works underneath

Deep modules come from John Ousterhout's book _A Philosophy of Software Design_. Matt sums the idea up as "lots of implementation controlled by a simple interface."

Here's made-up booking code in both shapes:

```python
# Shallow: the caller must know every step, and their order.
check_class_exists(class_id)
check_class_not_full(class_id)
row = build_booking_row(class_id, member_id)
save_booking_row(row)

# Deep: the caller learns one function. The steps sit behind it.
booking = create_booking(class_id, member_id)
```

**The words come from codebase-design.** The Skill loads it for words like seam, which codebase-design credits to Michael Feathers. codebase-design also has its own measure of depth. It rejects a ratio of implementation lines to interface lines, which it credits to Ousterhout, because that "rewards padding the implementation." It asks instead how much behaviour a caller gets for each bit of interface they learn.

**Your project comes first.** The agent reads `GLOSSARY.md` and any ADRs in the area, if they exist, so candidates use your project's own words. A candidate can contradict an ADR only when the friction is real enough to revisit that decision, and its panel says so.

```checkpoint quick-9
An ADR in your repo already decides against a refactor. Will the survey bring that refactor up again?
- [x] Only if the friction is real enough to revisit that decision.
- [ ] Yes. It rechecks every ADR on each run, to see if it still holds.
- [ ] No. A decision recorded in an ADR can never come up again.
Why: A candidate can contradict an ADR only when the friction is real enough to revisit the decision, and its panel says so.
```

Two filters stop the report becoming generic cleanup advice.

**The deletion test.** Imagine deleting a module you suspect is shallow. If complexity vanishes, it was a pass-through: it only handed calls on. If complexity reappears across many callers, it was earning its keep. For a panel, the Skill asks: would deleting it concentrate the complexity behind a smaller interface, or only spread it across callers? It wants the first. Here, the four steps would concentrate behind `create_booking`.

```checkpoint quick-10
You imagine deleting `create_booking`, and its steps reappear in every caller. What does that tell you?
- [x] The function was earning its keep.
- [ ] The function was only a pass-through.
- [ ] The function was hiding too little.
Why: If complexity vanishes, the module was a pass-through. If it reappears across many callers, the module was earning its keep.
```

**Hot spots first.** A deepening in code nobody touches never pays back. So, unless you name a direction, the agent walks back through the commit history. It's looking for the hot spots: the files and areas that keep coming up.

```checkpoint quick-11
You give no direction. Why does the agent start from the files that keep coming up in commits?
- [x] A deepening in code nobody touches never pays back.
- [ ] Files that change often are the cheapest ones to scan.
- [ ] Files that nobody touches are already deep modules.
Why: A deepening pays back only in code that keeps changing, so the agent looks for the hot spots first.
```

**Where it leads.** Deep modules lead to what Matt calls **grey box modules**. You design the interface with care, and leave the code inside to the agent. Tests lock down the behaviour, so you don't need to look inside. In his words: "You own the interface. AI owns the implementation. Tests keep it honest."

```checkpoint quick-12
You're building a grey box module. Which part do you keep for yourself?
- [x] The interface, while the agent owns the code inside.
- [ ] The code inside, while the agent owns the interface.
- [ ] Both parts, while the agent only writes the tests.
Why: You design the interface with care and leave the code inside to the agent. Tests lock down the behaviour.
```

### A real example

In May 2026, a user opened issue #274 on Matt's repo. They had liked the first version's thorough analysis of improvements.

Then grilling was added to the Skill, and they called it "borderline unusable". A run now proposed one solution straight away, then grilled them on it.

They wanted the opposite: "to propose ideas in a shotgun blast so I can make the decision myself".

The Skill was reshaped after that, an AI-written triage note says. It now puts every candidate in the report and stops, and grilling starts only on the one you pick.

So the report comes first for a reason: the decision about what to work on stays yours.

```checkpoint quick-13
Why does the report come before any grilling?
- [x] So the decision about what to work on stays yours.
- [ ] So the agent can grill you on each candidate in turn.
- [ ] So the report can be committed before the grilling starts.
Why: Seeing every candidate first means you choose what to work on. Grilling then starts only on the one you picked.
```

### Where it goes wrong

**It grills you on one idea before you've seen any options.** This is the most common complaint. The Skill should stop after the report, but weaker models "skip straight to an interview about the first idea they had". The Skill has no documented no-grill mode. So tell it when you start it: ask for the report and no grilling.

**It nearly always finds something.** The Skill exists to output findings, so it rarely says the code is fine. Issue #390 raised this, and Matt's whole reply was: "So you feel your codebase can no longer be improved?" So read the badges. A Speculative candidate is there for completeness, and if every candidate is Speculative, the Skill found nothing.

**The report opens as raw, unstyled HTML.** The report loads two libraries from CDNs, outside servers that host files for web pages: Tailwind for styling and Mermaid for diagrams. A security hook, an offline machine or a network blocker can stop them, and the page breaks with no error. The agent can't see this, "because it never renders the page."

```checkpoint quick-14
Your report opens as raw, unstyled HTML, and the agent said nothing about it. Why not?
- [x] The agent never renders the page, so it sees no break.
- [ ] The agent hid the error, so the survey could carry on.
- [ ] The agent left styling out, to keep the report short.
Why: The styling and diagram libraries load from the web when you open the page. If they're blocked, the page breaks with no error, and the agent never renders the page.
```

Ask instead for inline CSS (styling written inside the page) and hand-built SVG diagrams (pictures drawn in its code).

**The session fills up after a few candidates.** Work through several, and the [context window](/learn/context-window) (everything the agent can see) fills with the report, the grilling, the glossary edits and any code changes you start, all at once. Use one candidate per session. Take that decision into [to-spec](/learn/to-spec), and turn the rest into [Tickets](/learn/issues-and-keeping-track): tasks you can each pick up in a later session.

```checkpoint quick-15
You've finished grilling one candidate, and you want to grill the next. What do you do?
- [x] Start a new session, since each candidate gets its own.
- [ ] Carry on here, while the report is still in context.
- [ ] Grill both here, then split up the code changes later.
Why: Several candidates in one session fill the context window with the report, the grilling, the edits and any code changes you start, all at once.
```

**The tests pass, but the screen changed.** Issue #923 says this Skill and [implement](/learn/implement) never look at the app on screen. It describes a chain from this Skill through implement that deepened a module with types, tests and review all green, yet quietly changed the UI. Every step "inspects code, not pixels".

```checkpoint quick-16
Types, tests and review are all green after a refactor, but the page changed. Why did nothing catch it?
- [x] Every step inspects the code, and none inspects the pixels.
- [ ] The tests were skipped, so nothing ran against the change.
- [ ] The types had errors that the review chose to ignore.
Why: Types, tests and review were all green because they all look at code. None of them looks at the rendered app.
```

A part that looks shallow, such as code that shows something only under one condition, can be what matters on screen. So after refactoring website code, look at the page yourself.

### Try it

You'll need your practice project, the yoga-studio booking site, with some commits in `api/`. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first. If `api/` is missing, have your agent add it. Pick what you'll build next there: say, cancelling a booking.

1. In the `yoga-studio` folder, run `git status`, and commit anything it lists, so the working tree is clean.
2. Start Claude Code there: `claude`.
3. Type `/improve-codebase-architecture how can we make cancelling a booking easy?`

   You should see the report open, and the agent ask which candidate to explore.

4. Read the strength badges. If every candidate is Speculative, stop here: it found nothing.
5. In a second terminal, in the same folder, run `git status` again.

   You should see the same clean tree: the report sits in your temp folder.

6. Pick the report's top recommendation, and answer the grilling.

   You may see new terms land in `GLOSSARY.md`.

7. If you reject it for a reason that will still hold next month, accept the ADR it offers.

   You should see a new file in `docs/adr/`.

8. If you kept it, type `/to-spec` in this session. If it proposes seams, confirm them.

   You should see a new Spec on your Issue tracker.

### Read more

- [The /improve-codebase-architecture Skill](https://www.aihero.dev/skills-improve-codebase-architecture), Matt Pocock, updated 2026-08-24
- [How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love), Matt Pocock, updated 2026-02-26
- ["Software Fundamentals Matter More Than Ever"](https://ai.engineer/talks/v4F1gFy-hqg-software-fundamentals-for-ai-coding), Matt Pocock, AI Engineer Europe, 2026-04-23
- [improve-codebase-architecture: scope the scan to where change is landing (YAGNI), pull request #533](https://github.com/mattpocock/skills/pull/533), Matt Pocock, 2026-07-13
- ["improve-codebase-architecture" skill is terrible after "grill-me" added to it, issue #274](https://github.com/mattpocock/skills/issues/274), fuzzyhope1502, 2026-05-29
- [improve-codebase-architecture creates problems when there are none, issue #390](https://github.com/mattpocock/skills/issues/390), timezyme, 2026-06-28
- [improve-codebase-architecture: CDN-loaded Tailwind/Mermaid silently breaks the HTML report (SRI hooks, offline envs), issue #651](https://github.com/mattpocock/skills/issues/651), sergical, 2026-07-23
- [improve-codebase-architecture can silently break the UI it's refactoring, issue #923](https://github.com/mattpocock/skills/issues/923), AutogenousEngine, 2026-08-21

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint improve-codebase-architecture-deeper-4
You deepened the class-list part of your practice project's TypeScript website after an architecture report. Types pass, tests pass and the review is clean. Then you notice the "No classes today" notice no longer shows on an empty day. Why did nothing catch it?
- [x] Every check looked at the code, and none at what the page shows.
- [ ] The deletion test only runs on the backend, never on website code.
  > The deletion test isn't limited to the backend. The gap is that no check looked at the rendered page.
- [ ] The report hid the change because it loads its styling from the web.
  > The report's styling problem only affects how the report looks, not the refactor that changed the page.
Why: Types, tests and review all look at code, and none of them looks at the page. So a refactor can change what the user sees and still pass everything. A part that looks shallow, like one that shows a notice only on an empty day, can matter on screen. Issue #923 suggests capturing the screen before the first edit, then comparing after: test-first for what the user sees.
```

## Remember

```flashcards
Q: What does improve-codebase-architecture create?
A: An HTML report of deepening candidates in the temp folder, then a grilling session on the one you pick. As decisions land, it keeps GLOSSARY.md current, and offers an ADR if you reject a candidate for a lasting reason.

Q: What are the three recommendation strengths a candidate can get in the report?
A: Strong, Worth exploring and Speculative.

Q: How does improve-codebase-architecture differ from codebase-design?
A: It's the survey that finds the candidates; codebase-design is the bench where you design the chosen one.

Q: Where does the candidate you pick go after improve-codebase-architecture?
A: Once its grilling settles the new module's shape, into to-spec. If you stopped at the report, into the main flow at grill-with-docs, as a new idea.

Q: What is the deletion test that improve-codebase-architecture applies?
A: Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across many callers, it was earning its keep.

Q: Why can the architecture report open as unstyled raw HTML, and what's the workaround?
A: It loads Tailwind and Mermaid from CDNs, which a security hook, an offline machine or a network blocker can stop, and the agent can't see it. Ask for inline CSS and hand-built SVG diagrams.

Q: What does Matt call a deep module whose inside you leave to the AI?
A: A grey box module. You own the interface, AI owns the implementation, and tests keep it honest.
```

## Final test

```final-test improve-codebase-architecture-where
Where does improve-codebase-architecture put its report?
- [x] In an HTML file in the temp folder, outside the repo.
- [ ] In a Markdown file under docs/, committed on a new branch.
- [ ] In a new Issue on the Issue tracker, one per candidate.
Why: The agent writes one HTML file to your computer's temp folder and opens it for you. Keeping it there means nothing lands in the repo, so the survey leaves you nothing to commit.
```

```final-test improve-codebase-architecture-where-it
You give no direction. Where does improve-codebase-architecture look first?
- [x] At the files that keep coming up in recent commits.
- [ ] At the oldest files, which nobody has changed in years.
- [ ] At the biggest files, where most of the code sits.
- [ ] At the app's entry points, starting from main.
Why: Deepening a module pays off by making future changes to it easier. So the agent looks where changes keep landing, not at old or big files. Only if the recent changes are scattered does it widen the net.
```

```final-test improve-codebase-architecture-after
What happens once the report is written?
- [x] It asks which one to explore, then grills you on it.
- [ ] It starts refactoring the top recommendation straight away.
- [ ] It proposes a new interface for each candidate to review.
Why: The agent stops and asks which candidate you'd like to explore, so the choice stays yours. It proposes no interfaces yet, because the grilling on your pick is what settles the new module's shape.
```

```final-test improve-codebase-architecture-deeper
Matt says the idea of a deep module isn't his. Where does he say it comes from?
- [x] John Ousterhout's book "A Philosophy of Software Design".
- [ ] Michael Feathers's seam, which codebase-design credits to him.
- [ ] The measure of depth that codebase-design uses in place of a line ratio.
Why: Matt writes that deep modules come from "A Philosophy of Software Design", John Ousterhout's book. Feathers gave us the word "seam", not the idea of depth. And codebase-design's measure is only its own way of judging depth, not where the idea started.
```

```final-test improve-codebase-architecture-deeper-2
Every candidate in your architecture report has the Speculative badge. What does that tell you?
- [x] The survey found nothing worth deepening right now.
- [ ] The candidates are worth doing, but need a longer grilling.
- [ ] The report broke, and should be run again with a direction.
Why: The Skill exists to output findings, so it rarely says the code is fine. A Speculative candidate is only there for completeness. So when every candidate is Speculative, the Skill found nothing worth doing.
```

```final-test improve-codebase-architecture-spare
Your FastAPI booking backend works and the next Spec isn't ready. Lately every change to bookings touches five small files, and the tests are hard to write. You have a free afternoon and want the agent to suggest where the code could be reshaped. Which fits best?
- [x] Survey the codebase and get a visual report of candidates.
  > Right: that's `/improve-codebase-architecture`.
- [ ] Design one module's interface with the deep-module vocabulary.
  > That's `/codebase-design`. You haven't picked a module yet. That's the bench for a chosen candidate, not the survey that finds candidates.
- [ ] Find the cause of the friction with a tight feedback loop.
  > That's `/diagnosing-bugs`. Nothing is broken. This is upkeep, not a bug.
Why: Nothing is broken and no module is chosen yet, so the job is to find where the code resists change. A survey does that. The friction here is the kind it looks for, with one idea spread across many small modules and tests that are hard to write.
```

```final-test improve-codebase-architecture-after-the
A job in your Dockerised Python worker kept retrying forever. You fixed it with a regression test, then ran a retro in the same session. The retro's finding: the retry code has no good seam to test it through, so the same kind of bug could come back. What comes next?
- [x] Survey for deepening opportunities, starting at the retry code.
  > Right: that's `/improve-codebase-architecture`.
- [ ] Start another bug hunt on the retry code with a tight feedback loop.
  > That's `/diagnosing-bugs`. The bug is already fixed, with a regression test. The missing seam is the remaining problem.
- [ ] Run the retro again, this time over the whole week's sessions.
  > That's `/retro`. The retro already found the cause. Acting on it is the next step.
Why: The bug is fixed, but tests live at seams and the retry code has no good one. That's a problem with the code's shape, not a new bug, and the same kind of bug could come back. So the next step is a survey for deepening opportunities, pointed at the retry code.
```

```final-test improve-codebase-architecture-picked-a
An architecture report on your website's backend is open in the browser. You pick its Strong candidate: merge four small pricing modules into one deep module. What should happen next?
- [x] Get grilled on the merge's constraints and shape.
  > Right: that's `/grilling`.
- [ ] Start writing the merged pricing module straight away.
  > That's `/implement`. Nothing is decided yet. Picking only starts the grilling, and that is where the shape is settled.
- [ ] Write a Spec for the merge from the report.
  > That's `/to-spec`. The report holds a problem and a rough solution, not decisions. The grilling makes those first.
Why: Picking a candidate only says which problem to work on, not how to solve it. So the grilling comes next. It settles the constraints and the module's shape before anything is built, and any alternative interfaces are worked out there too.
```

```final-test improve-codebase-architecture-no
An architecture survey of your FastAPI app lists five candidates, each with a before-and-after diagram. None of them says what the new module's functions should look like. Why does the survey stop there?
- [x] Interfaces come after your pick, shaped in its grilling.
- [ ] Five interfaces would make the report too long to read.
  > Length isn't the reason. The Skill holds interfaces back on purpose until you've picked a candidate.
- [ ] Interfaces are the agent's call, made later without asking.
  > The shape of the deepened module is one of the things the grilling settles with you.
Why: The survey's job is only to surface candidates. A new module's shape depends on constraints and dependencies, and you settle those together in the grilling on the one you pick. Any alternative interfaces are worked out there too.
```

```final-test improve-codebase-architecture-deeper-3
An architecture report on your FastAPI booking backend lists eight candidates. You picked one, finished its grilling and reached a decision. In the same session you now want to grill the next three candidates, and then start changing the code. Why is that a poor idea?
- [x] The window fills with the report, grilling, edits and code at once.
- [ ] The report file is deleted once you have picked the first candidate.
  > Nothing deletes the report when you pick. The real cost is what piles up in the context window.
- [ ] The Skill can only grill one candidate each time it is installed.
  > Nothing limits it to one candidate per install. The advice is about the context window, not the install.
Why: Several candidates in one session fill the context window with the report, the grilling, the glossary edits and the code changes all at once. So use one candidate per session. Take that one decision forward, and turn the rest into Tickets.
```

```sources
- [improve-codebase-architecture: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/improve-codebase-architecture/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love), Matt Pocock, Updated Feb 26, 2026
- ["Software Fundamentals Matter More Than Ever" — Matt Pocock](https://ai.engineer/talks/v4F1gFy-hqg-software-fundamentals-for-ai-coding), Matt Pocock (AI Engineer Europe 2026), 2026-04-23
- [codebase-design: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/codebase-design/SKILL.md), Matt Pocock's Skills
- [The /improve-codebase-architecture Skill](https://www.aihero.dev/skills-improve-codebase-architecture), Matt Pocock, 2026-08-24 (updated)
- [improve-codebase-architecture: scope the scan to where change is landing (YAGNI) (#533)](https://github.com/mattpocock/skills/pull/533), mattpocock, 2026-07-13
- ["improve-codebase-architecture" skill is terrible after "grill-me" added to it. (#274)](https://github.com/mattpocock/skills/issues/274), fuzzyhope1502, 2026-05-29
- [improve-codebase-architecture creates problems when there are none. (#390)](https://github.com/mattpocock/skills/issues/390), timezyme, 2026-06-28
- [improve-codebase-architecture: CDN-loaded Tailwind/Mermaid silently breaks the HTML report (SRI hooks, offline envs) (#651)](https://github.com/mattpocock/skills/issues/651), sergical, 2026-07-23
- [improve-codebase-architecture can silently break the UI it's refactoring (#923)](https://github.com/mattpocock/skills/issues/923), AutogenousEngine, 2026-08-21
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
```
