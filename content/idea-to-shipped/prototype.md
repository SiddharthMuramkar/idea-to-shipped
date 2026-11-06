---
title: prototype: throwaway code for one question
slug: prototype
summary: How Matt Pocock's prototype Skill builds throwaway code to answer one design question, so you can try the answer instead of guessing.
---

## What it's for

Say a [grill-with-docs](/learn/grill-with-docs) interview reaches your yoga-studio site's waitlist: what happens when a member cancels late? The agent rephrases, you guess, and talk settles nothing.

**prototype builds throwaway code that answers one design question, so you can try the answer instead of guessing.**

For example, you type:

```
/prototype Does the waitlist hold up when a member cancels late?
```

The agent puts that question at the top of a demo. You press its buttons and see the full state (what the demo holds, like who is waitlisted) after every click. You end with a one-line answer.

```checkpoint quick-2
You've typed your question and the agent has built the demo. What do you do next?
- [x] Press its buttons, watch the full state, and reach a one-line answer.
- [ ] Read its code line by line, then write a long report on what you found.
- [ ] Merge it into your main branch, then see how the real site behaves.
Why: The demo exists so you can try the answer. You press its buttons, see the full state after every click, and end up with a one-line answer.
```

The question decides the shape:

- "Does this logic / state model feel right?" gets one **HTML** file (the language web pages are written in) that anyone can double-click, even a non-coder. Its buttons push the state through awkward cases.
- "What should this look like?" gets several radically different versions of a page on one route (one web address). A floating bar switches them, using **`?variant=`**, a setting in the address.

```checkpoint quick-1
You can't picture the new bookings page. What does prototype build for you?
- [x] Several radically different versions of the page, all on one route.
- [ ] One polished version of the page, ready to be merged into `main`.
- [ ] A separate new route for each version, each linked from a menu.
Why: A question about looks gets several radically different versions on one route, so you can compare them. A floating bar switches between them.
```

```diagram
type: compare
caption: "The question decides the shape"
columns: ["Does this logic / state model feel right?", "What should this look like?"]
rows:
  - cells: ["one HTML file", "several radically different versions of a page on one route"]
  - cells: ["Its buttons push the state through awkward cases", "A floating bar switches them"]
```

## When to use it

- You hit a question in a [grill-with-docs](/learn/grill-with-docs) interview that needs a runnable answer. That's the [main flow](/learn/main-flow)'s detour: a handoff out, the prototype, a handoff back. A handoff is a summary file for another agent; you'll meet it in [handoff](/learn/handoff).
- You can't tell whether a state model holds up.
- You can't picture a **UI** (user interface: the screens people see and click) until you see three versions.

```checkpoint quick-3
Your interview hits a question that needs a runnable answer. What does the main flow do?
- [x] It takes a detour: a handoff out, the prototype, then a handoff back.
- [ ] It ends the interview for good, and goes straight to writing the Spec.
- [ ] It builds the real feature first, then carries on with the interview.
Why: The interview pauses while a prototype answers the question. A handoff carries the work out to the prototype, and another brings the answer back.
```

## When not to use it

- If talking can settle it, stay in [grill-with-docs](/learn/grill-with-docs) instead.
- If the answer is in someone else's docs, use [research](/learn/research) instead, because it sends an agent to read and cite them.
- If you already know what to build, use [implement](/learn/implement) instead, because it builds the real thing, and a prototype gets no tests.

```checkpoint quick-4
Which fits? You need to know how a payment provider's refunds work, and it's all in their docs.
- [x] research, which sends an agent to read the docs and cite them.
- [ ] prototype, which builds a small demo of how refunds might work.
- [ ] grill-with-docs, which interviews you until the answer is settled.
Why: The answer is in someone else's docs, not in your own design. So nothing needs building or grilling. An agent only has to read the docs and cite them.
```

## What it needs to start

One clear question, because a prototype that answers the wrong question is wasted. Type `/prototype` with it, or the agent may start it on its own when it fits.

```checkpoint quick-5
You haven't typed anything, and the agent starts prototype because it fits the work. Is that allowed?
- [x] Yes. You can type it yourself, or the agent may start it on its own.
- [ ] No. Only you can start it, by typing its name in the session.
- [ ] No. It only ever starts as a detour from a grill-with-docs interview.
Why: Both ways are allowed. You can type `/prototype` with your question, or the agent may start it on its own when it fits.
```

State lives in memory. Only a database question gets a scratch database or local file (kept apart from your real data), clearly named for wiping.

```checkpoint quick-6
Your question is how the waitlist gets saved in the database. Where does the prototype keep its data?
- [x] In a scratch database, clearly named for wiping.
- [ ] In memory, the same as every other prototype.
- [ ] In your real database, so the answer is realistic.
Why: State normally lives in memory. A question about the database itself is the one exception, and even then it gets a scratch database or local file made to be wiped.
```

## What it creates

- The answer: the verdict (your one-line answer) and the question it settled, in the Issue for the real work or a commit.
- The decision, built into the real code. A logic prototype's **module** (a unit of code callers use) is written to move across.
- The prototype itself, kept out of `main` on a throwaway branch such as `prototype/waitlist`, with a pointer to it on that Issue. It's a **primary source**: the original thing itself, not a summary of it.

```checkpoint quick-7
Your prototype answered its question, and the decision is in the real code. What happens to the prototype?
- [x] It stays on a throwaway branch, kept out of main, with the Issue pointing to it.
- [ ] It merges into main, where it becomes the first version of the feature, ready to grow.
- [ ] It gets deleted, because the decision in the real code is all you need from it now.
Why: The prototype is a primary source: the original thing itself, not a summary of it. So you keep it, but on its own branch, and the Issue for the real work points there.
```

So "throwaway" describes how the code is written. It doesn't mean deleted.

## Going deeper

### Why it exists

[Grilling before you build](/learn/grill-before-you-build) can't settle every question. A state model can have more awkward cases than you can hold in your head. A screen can stay vague until you see three versions. Matt Pocock, who wrote this Skill, gives the way out: "Stop grilling, build the throwaway version, look at it, then answer in one line."

```checkpoint quick-8
Your grilling session keeps circling a state model you can't hold in your head. What's the way out?
- [x] Stop grilling, build the throwaway version, look at it, then answer.
- [ ] Keep grilling, and ask the agent to rephrase each question more simply.
- [ ] Split the model into Tickets, and build the real version of it now.
Why: More talk won't help when you can't hold the cases in your head. A throwaway version gives you something to look at, and then the answer takes one line.
```

So prototype gives you something to look at, and you go back to your work with the answer. You can also arrive here without choosing to: [wayfinder](/learn/wayfinder) can file a one-question ticket that you work with this Skill.

### How it works underneath

The idea is decades older than Matt's Skill. Andy Hunt and Dave Thomas, the authors of _The Pragmatic Programmer_, explained it in an interview. A prototype investigates one specific aspect: an interface, an algorithm or a performance problem. Hunt's summary: "Prototypes are for your learning."

Thomas adds that prototypes are designed to be thrown away. He compares one to a town in a western movie: "It's all facade. There's nothing behind it."

```checkpoint quick-9
Why is a prototype like a town in a western movie?
- [x] It's all facade with nothing behind it, because it's made to be thrown away.
- [ ] It goes up quickly, then people move in and it grows for many years.
- [ ] It runs end to end, with one thin road from the first street to the last.
Why: Thomas is saying a prototype isn't the real thing, any more than a movie town is a real town. It's built to teach you one thing, and it's designed to be thrown away.
```

_The Pragmatic Programmer_ has a second technique. **A tracer bullet** is a thin path through the whole system that you can see working. It starts as a skeleton application, one thin line of execution running end to end. Then you grow it, one feature at a time. So in their telling, a prototype is thrown away, and a tracer bullet is grown.

```checkpoint quick-10
You want early code that you'll keep and grow into the real system. Which fits?
- [x] A tracer bullet, a thin path through the whole system, grown feature by feature.
- [ ] A prototype, written for one specific aspect, then grown feature by feature into the system.
- [ ] Neither, since both are written to answer one question and then thrown away.
Why: A tracer bullet starts as a skeleton application, and you grow it one feature at a time. In Hunt and Thomas's telling, a prototype is thrown away.
```

```diagram
type: compare
caption: "So in their telling, a prototype is thrown away, and a tracer bullet is grown."
columns: ["A prototype", "A tracer bullet"]
rows:
  - cells: ["investigates one specific aspect", "a thin path through the whole system"]
  - cells: ["is thrown away", "is grown"]
```

Matt's Skill differs in one part: it keeps the code. "Throwaway is a constraint on how the code is _written_, not a promise to destroy it." Once you harden a prototype, by adding a test, wiring the real database or generalising for a case you might want later, you've stopped prototyping.

```checkpoint quick-11
You're about to add a test to your prototype and wire it to the real database. What's happening?
- [x] You've stopped prototyping, because you're now hardening the code.
- [ ] You're still prototyping, as long as the code stays out of main.
- [ ] You're still prototyping, since the code gets thrown away later.
Why: Throwaway is about how the code is written, not where it ends up. Adding a test or wiring the real database means you're no longer writing it that way.
```

A logic prototype has a fixed layout. For example, your waitlist demo would show, top to bottom:

- the question it explores;
- the current state, redrawn after every click;
- free-play buttons, to press in any order;
- guided walkthroughs, with one awkward case per tab.

Unlike a movie town, this page has real logic behind it: a small module with no page code in it. So the checked logic can move into the real code, and the page stays behind. A winning UI version moves differently: you rewrite it properly, because it was written with no tests.

```checkpoint quick-12
Why can the checked logic move into the real code while the page stays behind?
- [x] The logic is a small module with no page code in it.
- [ ] The page was written with no tests, and the logic has them.
- [ ] The page needs a server to run, and the logic doesn't.
Why: The logic and the page are kept apart. So the module can move across by itself, and the page stays out of the real code.
```

If a question could be either shape and you're away, the agent picks the one matching the surrounding code, and says so at the top.

### A real example

In July 2026, a product person posted in the Skills repo's Discussions. They had refined a prototype until it felt right, then took it through a Spec and Tickets. What got built "kind of ignored the prototype", as if rebuilt from prose. Each written step had lost detail.

```checkpoint quick-13
You refine a prototype, then build only from a Spec and Tickets written about it. What's the risk?
- [x] What gets built ignores the prototype, because each written step lost detail.
- [ ] What gets built copies the prototype's code straight into production, bugs and all.
- [ ] Nothing gets built, because Tickets can't be split from a prototype's code or design.
Why: The Spec and the Tickets are written descriptions, and each one lost detail. The build worked from that prose, so it was as if the prototype had never been looked at.
```

Within a week, Matt's PR #488 changed the rule. A prototype used to be deleted once it had answered its question. Now it stays on a `prototype/<name>` branch, never merged, so whoever picks up the work next can re-run it. His reason: "A prose summary of a prototype loses the thing that made it convincing." Nothing shows the post caused the change.

In August 2026, version 1.2 changed logic prototypes too. They had been terminal apps, and a terminal app needs the repo cloned and a runtime (the program that runs the code) installed. That shuts out the people a prototype needs: the designer, the product manager (PM) and the domain expert, who knows the subject. So a logic prototype became one HTML file that opens by double-click. The logic module underneath stayed the same.

```checkpoint quick-14
The studio owner, who doesn't code, needs to try your waitlist model. Why not hand over a terminal app?
- [x] It needs the repo cloned and a runtime installed, which shuts them out.
- [ ] It can't hold the state model, so there'd be no state to push around.
- [ ] It can't run the logic module, so nothing could move into the real code.
Why: A terminal app needs a cloned repo and a runtime, and a person who doesn't code won't have either. One HTML file opens by double-click.
```

So both changes let the people who need the prototype run it.

### Where it goes wrong

**The agent suggests a prototype when you should be building.** An agent that doesn't know the [main flow](/learn/main-flow) reads `prototype` as the obvious next step once Tickets exist. If you already know what to build, the next step is [implement](/learn/implement), per Ticket.

```checkpoint quick-15
Tickets exist and you know what to build, but the agent suggests a prototype. What do you do?
- [x] Run implement per Ticket, because you already know what to build.
- [ ] Run prototype on each Ticket first, to check that its design holds up.
- [ ] Run prototype on the whole app, so every Ticket is covered at once.
Why: The word sounds like the obvious next step, which is why agents suggest it. A prototype only helps when there's a question left to answer, and here there isn't one.
```

**You're still building the prototype a day later.** The question was too big. Split it, so each prototype is answered in one sitting.

```checkpoint quick-16
You started a prototype yesterday, and you're still building it. What does that tell you?
- [x] The question was too big, so split it into smaller ones.
- [ ] The prototype needs tests before you can go any further.
- [ ] The agent needs more time, so leave it running overnight.
Why: A prototype should be answered in one sitting. If it isn't, it's trying to answer too much, so split the question.
```

**The prototype has become the app.** You prototyped the whole app, which has no natural stopping point, so it "drifts into being the production app". Code with no tests or error handling then ends up in front of users. Cut it down to one question.

**You can't choose between the versions.** They differ only in colour, which answers nothing, or they sit on an empty page, where every version looks fine. Put them on an existing page with real data, and make them disagree about structure.

```checkpoint quick-17
You have three versions on an empty page, and every one looks fine. What do you change?
- [x] Put them on an existing page with real data, so their differences show.
- [ ] Add a few more versions to the empty page, until one of them stands out.
- [ ] Change their colours on the empty page, so they're easier to tell apart.
Why: On an empty page every version looks fine, and versions that differ only in colour answer nothing. Real data on an existing page shows which structure works.
```

**Old prototype branches pile up.** An Issue links to each one, so deleting it breaks the link. Issue #1020 suggests keeping prototypes in folders on `main` instead. That was still open in October 2026, so follow the Skill's branch for now.

**`/prototype` answers "unknown skill".** Issue #1019 reports that since version 2.1.221, Claude Code bundles a hidden built-in Skill with the same name, which breaks the short name. If you installed Matt's Skills as a plugin, a bundle you install together, type `/mattpocock-skills:prototype` instead. With a plain install, your copy replaces it; rerun the install. The report was closed as not planned.

### Try it

Settle one logic question before you write the booking endpoint. You'll need your practice project, the yoga-studio booking site. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. Find the Issue for the real work, the waitlist Spec from [grill-with-docs](/learn/grill-with-docs)'s Try it. Without one, run `gh issue create --title "Add a waitlist to bookings" --body "First: does the waitlist survive a late cancel?"`. Note its number.
2. In a fresh session, type `/prototype Does the waitlist survive a late cancel?`
3. Find the new HTML file. You should see it, probably in or near `api/`, named as a prototype.
4. Double-click it. You should see the question at the top, then the state and the buttons.
5. Run every walkthrough tab. Write down each "wait, that shouldn't be possible".
6. Record the question and verdict on the Issue: `gh issue comment <number> --body "<question and verdict>"`.
7. Put the file on its own branch: `git switch -c prototype/waitlist`, then `git add <file>` and `git commit -m "Keep the waitlist prototype"`.
8. Push it, and never merge it: `git push -u origin prototype/waitlist`.
9. Point the Issue at the branch: `gh issue comment <number> --body "Prototype: prototype/waitlist"`.
10. Run `git switch main`. You should see the file gone from your folder.

If step 2 answers "unknown skill", see Where it goes wrong.

The checked logic is JavaScript, the language web browsers run, and your API is Python. So your Python version must match it.

### Read more

- [The /prototype Skill](https://www.aihero.dev/skills-prototype), Matt Pocock, updated 2026-08-24
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [prototype: keep the prototype as a primary source (PR #488)](https://github.com/mattpocock/skills/pull/488), Matt Pocock, 2026-07-09
- [Tracer Bullets and Prototypes: A Conversation with Andy Hunt and Dave Thomas, Part VIII](https://www.artima.com/articles/tracer-bullets-and-prototypes), Bill Venners, 2003-04-21
- [How to keep the fidelity of prototypes when moving to prd and issues (#446)](https://github.com/mattpocock/skills/discussions/446), fauns-ai, 2026-07-03
- [prototype/wayfinder: "throwaway" research and prototype branches can never actually be deleted — and they keep piling up (#1020)](https://github.com/mattpocock/skills/issues/1020), Astral100, 2026-09-03
- [Shorthand /prototype conflicts with hidden new Claude Code built-in skill /prototype (#1019)](https://github.com/mattpocock/skills/issues/1019), KingMob, 2026-09-03

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint prototype-deeper-keep-the-branch
Your waitlist prototype for the yoga studio answered its question, and the checked rules are now in the real code. The agent records the verdict on the Issue, then commits the prototype to a prototype/waitlist branch that will never be merged, and links that branch from the Issue. Why not delete it?
- [x] Whoever picks the work up next can re-run it. A prose summary loses what made it convincing.
- [ ] So it can be merged into main later, once tests and error handling have been added to it.
  > It never merges into main. Hardening a prototype with tests means you've stopped prototyping.
- [ ] So CI keeps checking the prototype on every push, in case the real code drifts away from it.
  > It's kept so the next person can find and re-run it, not as something checked on every push.
Why: A written summary loses the thing that made the prototype convincing. So the branch keeps the prototype itself, and whoever picks up the work next can re-run it. Main keeps only the decision, which keeps it clean.
```

## Remember

```flashcards
Q: What does prototype create?
A: An answer to one design question, the validated decision folded into the real code, and the prototype itself kept on a throwaway branch out of main.

Q: What shape does a prototype take for a logic question, and for a look question?
A: Logic: one HTML file with buttons that anyone can double-click. Look: several very different variants of a page on one route, switched with ?variant= and a floating bar.

Q: Where does prototype sit in the Main flow?
A: It's a detour from the interview, for a question that needs a runnable answer, with a handoff out and a handoff back.

Q: Where does a prototype keep its state?
A: In memory. Only a database question gets a scratch database or local file, clearly named for wiping.

Q: What's the sign that you've stopped prototyping?
A: You start hardening it: adding a test, wiring the real database, or generalising for a case you might want later.

Q: You're still building a prototype a day later. What does that mean?
A: The question was too big. Split it, so each prototype is answered in one sitting.

Q: Why shouldn't you prototype the whole app?
A: A full-app prototype has no natural stopping point, so it drifts into being the production app, and code with no tests or error handling ends up in front of users.
```

## Final test

```final-test prototype-two-questions
Which two kinds of question does a prototype answer?
- [x] Does this logic or state model feel right, and what should this look like?
- [ ] Is this code fast enough under load, and does it pass all its tests?
- [ ] Which library fits this feature best, and what do its docs say about it?
- [ ] Who should own this feature, and how long will it take to build?
Why: Each kind of question needs a different thing to try. A logic question needs state you can push around, so it gets a clickable HTML file. A question about looks needs pages you can compare, so it gets several versions on one route.
```

```final-test prototype-when-done
A prototype has answered its question. What happens to it?
- [x] Its decision goes into the real code; the prototype is kept on a branch.
- [ ] It's deleted once its decision is in the real code, since it was throwaway.
- [ ] It's merged into main as it is, as the feature's first version.
Why: "Throwaway" describes how the code is written, not what happens to it afterwards. The decision goes into the real code. The prototype stays on its own branch, out of main, because it's the original thing and a summary would lose what made it convincing.
```

```final-test prototype-tests
Does a prototype get tests?
- [x] No. A prototype that needs tests is no longer a prototype.
- [ ] Yes, written first, one red-green slice at a time, like real code.
- [ ] Yes, but only for the logic module that gets lifted into real code.
Why: A prototype is there to teach you one thing fast, and tests don't help with that. So it skips tests, polish and abstractions. If you find it needs tests, it has stopped being a prototype.
```

```final-test prototype-deeper-why-html-file
In version 1.2, the logic prototype became one HTML file instead of a terminal app. Why?
- [x] A terminal app needs the repo cloned and a runtime installed, which shuts out the designer, PM and domain expert.
- [ ] A terminal app couldn't keep its state in memory, so every run had to start again from a scratch database.
- [ ] A terminal app couldn't be committed to a branch out of main, so it was lost once its question was answered.
- [ ] A terminal app couldn't hold a pure logic module, so nothing it checked could be lifted into the real code.
Why: It comes down to who can run it. The designer, PM and domain expert are the people whose opinion the prototype needs, and a terminal app asks them for a cloned repo and a runtime. One file opens by double-click, so anyone can drive it. The logic module underneath didn't change.
```

```final-test prototype-deeper-tracer-bullet
Hunt and Thomas split early code into prototypes and tracer bullets. Which one is grown, feature by feature?
- [x] The tracer bullet, a skeleton app with one thin line of execution end to end, grown one feature at a time.
- [ ] The prototype, an ugly script for one specific aspect, which is cleaned up and grown into the real system.
- [ ] Neither of them. Both are written to investigate one question, and both are thrown away once it's answered.
Why: A tracer bullet starts as a skeleton application that you keep and grow, one feature at a time. A prototype looks into one specific aspect, and it's designed to be thrown away: "It's all facade." So only the tracer bullet turns into the real system.
```

```final-test prototype-gym-waitlist-states
In your FastAPI gym booking API, a class booking can be booked, waitlisted, cancelled or a no-show. On paper the rules look fine, but nobody can say what happens when a waitlisted member is moved up after the class has started. You want the gym manager, who doesn't code, to click through the awkward cases. Which fits best?
- [x] Build a throwaway, clickable demo of the booking states.
  > Right: that's `/prototype`.
- [ ] Keep being interviewed about the booking rules until they're clear.
  > That's `/grill-with-docs`. Talking hasn't settled it. This question needs a runnable answer, with state you can push through cases.
- [ ] Send a background agent to read up on booking systems.
  > That's `/research`. The answer isn't in anyone's docs. It's in your own state model.
Why: On paper the rules look fine, and only real cases can show whether they hold. That's a logic question, so a prototype fits. It gives the manager, who doesn't code, one file to open and click through.
```

```final-test prototype-timetable-page-layouts
Your yoga-studio site needs a better class timetable page. You've talked it through, but you can't picture the layout, and describing it in words keeps going in circles. You want to see it on the real site, not in words. Which fits best?
- [x] Build several radically different versions of the page on one route.
  > Right: that's `/prototype`.
- [ ] Keep being interviewed about what the page should show and why.
  > That's `/grill-with-docs`. More questions won't settle it. This is a UI you have to see.
- [ ] Write the Spec for the new timetable page now, from the talk so far.
  > That's `/to-spec`. An open question that talk can't settle comes first, through the detour. The Spec comes after.
Why: Words keep going in circles because this is a UI you have to see. A prototype gives you several different versions of the page on one route, and a floating bar flips between them, so you can judge them by looking.
```

```final-test prototype-after-the-note-out
Interviewing about refunds for your booking backend, you hit a question talk can't settle: does the refund state model hold up when a class is cancelled after a partial refund? You've written a portable note of the thread and opened a fresh session with it. What comes next?
- [x] Answer the question with throwaway code.
  > Right: that's `/prototype`.
- [ ] Write another portable note of the session.
  > That's `/handoff`. The note out is done. The next one comes after the prototype, to carry back what you learned.
- [ ] Write the Spec for refunds from the thread.
  > That's `/to-spec`. The question is still open. Settle it before the Spec.
- [ ] Go back to the interview in the first session.
  > That's `/grill-with-docs`. Talking already failed to settle this. It needs a runnable answer.
Why: The detour has three steps: a note out, the prototype, a note back. You've written the note out and opened a fresh session, and the question is still open. So the prototype comes next, to answer it with throwaway code.
```

```final-test prototype-question-first
Before writing any code for a clickable demo of the retry rules in your Docker job queue, the agent writes one paragraph at the top of the demo: the state model, and the exact question it's checking. Why?
- [x] So it answers the right question, which anyone can check later.
- [ ] So the paragraph can later be pasted into the Spec's Solution.
  > The paragraph states the prototype's question. It isn't written for the Spec.
- [ ] Because the demo's code reads its state model from that paragraph.
  > It's for the people reading the demo, not for the code.
Why: A prototype that answers the wrong question is wasted work. Writing the question down first, where readers can see it, means anyone can check later that the demo answers the right thing.
```

```final-test prototype-deeper-naming-trap
The yoga studio's booking endpoint has a Spec and three Tickets, each with its blocking edges. Every design question was settled in the interview, and you know what to build. The agent now suggests "prototype the booking flow" as the next step. Which fits best?
- [x] Take the first unblocked Ticket and build it for real, test-first where it can.
  > Right: that's `/implement`.
- [ ] Build a throwaway clickable demo of the booking flow first, as suggested.
  > That's `/prototype`. Nothing is open. Matt calls this a known naming problem: agents read "prototype" as the obvious next step once Tickets exist.
- [ ] Go back to being interviewed about the booking flow before any code.
  > That's `/grill-with-docs`. The interview already settled every question. There's nothing left to grill.
Why: Nothing is left to find out, and a prototype only helps with an open design question that talk can't settle. When you already know what to build, the next step is /implement, one Ticket at a time. Agents suggest prototype because the word sounds like the obvious next step.
```

```sources
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
- [prototype: LOGIC.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/LOGIC.md), Matt Pocock's Skills
- [prototype: UI.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/UI.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [The /prototype Skill](https://www.aihero.dev/skills-prototype), Matt Pocock
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [Tracer Bullets and Prototypes: A Conversation with Andy Hunt and Dave Thomas, Part VIII](https://www.artima.com/articles/tracer-bullets-and-prototypes), Bill Venners, 2003-04-21
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [Renaming skills to dodge harness built-in commands (.out-of-scope/harness-name-collisions.md)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/harness-name-collisions.md), Matt Pocock, 2026-10-06
- [How to keep the fidelity of prototypes when moving to prd and issues (#446)](https://github.com/mattpocock/skills/discussions/446), fauns-ai, 2026-07-03
- [prototype: keep the prototype as a primary source (PR #488)](https://github.com/mattpocock/skills/pull/488), mattpocock, 2026-07-09
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [prototype/wayfinder: throwaway research and prototype branches can never actually be deleted (#1020)](https://github.com/mattpocock/skills/issues/1020), Astral100, 2026-09-03
- [Shorthand /prototype conflicts with hidden new Claude Code built-in skill /prototype (#1019)](https://github.com/mattpocock/skills/issues/1019), KingMob, 2026-09-03
- [implement: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement/SKILL.md), Matt Pocock's Skills
- [handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/SKILL.md), Matt Pocock's Skills
```
