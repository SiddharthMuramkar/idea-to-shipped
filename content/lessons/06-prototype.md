---
title: Prototype
slug: prototype
order: 6
part: 2
image: /photos/prototype.jpg
imageAlt: A hand with a pen points at hand-drawn mobile app wireframes spread across a table.
imageCredit: Amélie Mourichon
---

When talking can't settle a question, have the agent build a quick throwaway version you can click, then keep the answer and park the code.

```goals
- You'll be able to tell a question you can settle by talking from one that needs a prototype, and say when not to build one.
- You'll be able to predict what `/prototype` builds for a logic question and for a UI question.
- You'll be able to apply the six rules and capture a finished prototype: the decision into the real code, the prototype onto a `prototype/<name>` branch, the verdict on the ticket.
- You'll be able to run the prototype detour with `/handoff` out and back, and say when `/handoff` is the wrong move.
```

## Why it matters

You're planning a feature with Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal). The agent is interviewing you, and most answers are easy. Then it asks: "Should comments sit beside the Lesson or underneath it?" You can't picture either. You accept its recommendation, it builds, and a week later you're rebuilding a page that feels wrong.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, sees this constantly. (A Skill is a short instruction file the agent loads when you type its name, like `/prototype`, or when a task matches its description; [Skills](/learn/skills) covers installing them.) In his July 2026 video on prototyping, he complains that people pour everything into a detailed spec (a written description of what to build) and forget they can write code along the way.

He borrows the word ==fidelity== from Ryan Singer's book *Shape Up*. A low-fidelity question, like "which web address should this page use?", is settled in a sentence. A high-fidelity question, like "one long form or three short pages?", needs a working picture before anyone can answer honestly. Matt calls these ungrillable: no interview settles them ([Grilling](/learn/grilling) covers the interview). Producing code is now cheap, so ==build the thing you can't picture==, look at it, and answer in one line.

```callout big-idea
A prototype exists to answer one question. When it's done, the answer moves forward into the real code, and the prototype steps aside: kept for reference, never shipped.
```

## The idea: throwaway code that answers one question

Matt's prototype Skill defines a prototype as "throwaway code that answers a question". Two words do the work.

**Question.** The question comes first and decides what gets built. A prototype that answers the wrong question is wasted, so the question is always written where you'll see it.

**Throwaway** describes how the code is *written*: no tests, no tidy structure, no real database, because none of that helps you learn the one thing you're after. It doesn't mean deleted. Since version 1.2.0, the answer goes into the real code and the prototype is parked to one side in Git (the tool that records a project's history) as evidence.

The question also picks one of the Skill's two paths, which it calls branches:

| The question | Branch | What you get |
|---|---|---|
| "Does this logic or state model feel right?" | Logic | One HTML file with buttons that push the rules through tricky cases |
| "What should this look like?" | UI | Several very different versions of a screen, with a bar to flip between them |

If the question is unclear and you're not around, the agent picks the branch that fits the nearby code (a backend module means logic, a page means UI) and writes that assumption at the top.

`/prototype` is a ==model-invoked Skill==: you can type it, and the agent can also reach for it when a task fits. Type `/prototype` followed by your question. A hidden Built-in command (one that ships with Claude Code itself) shares the name, so if `/prototype` says "unknown skill", type `/mattpocock-skills:prototype` instead.

**When not to reach for it.** Something already built is broken: that's `/diagnosing-bugs` ([Diagnosing bugs](/learn/diagnosing-bugs)). The design is settled: build it with `/implement`. "Prototype the whole app" isn't one question, and a prototype still being built a day later was answering too big a question; split it.

```checkpoint talk-or-build
You're grilling a class-booking app for a gym. Which question is the best candidate for a prototype?
- [ ] "Should the booking page live at the address /book, or at /classes instead?"
  > A low-fidelity question: one line answers it. Building something to decide it is wasted effort.
- [x] "Do the waitlist, cancellation and late-fee rules hold up together in odd cases?"
  > Right. Rules that interact in ways you can't hold in your head are a logic question. Push real cases through them and watch.
- [ ] "Should members have to create an account before they can book any class at all?"
  > That's a decision you can make by talking. Answer it in the interview.
- [ ] "Why does the Book button crash for some members on older phones since last week?"
  > Something already built is broken. That's a bug for `/diagnosing-bugs`, not a design question.
```

## The logic branch: one HTML file

Some rules look fine on paper and only feel wrong once real cases go through them: a loan you can renew twice but not once it's overdue, a refund after half an order has shipped. For these, the Skill builds ==a single HTML file== you open by double-clicking: plain HTML, CSS and JavaScript in one file, with no framework, build step or server. You could email it to someone who has never coded, and every label speaks the business's language ("Renew loan"), not the code's.

The page reads top to bottom:

1. **The question**, in a visible paragraph.
2. **The current state**, as labelled fields rather than raw data, redrawn after every click.
3. **Free-play buttons**, one per action and always available, for poking at the rules in any order.
4. **Guided walkthroughs**, one scenario per tab, each starting from the same reset state: the happy path, a tricky edge case, and one attempt at something that should be impossible.

The rules themselves live in one small `<script>` block that never touches the page. Once they're right, that block lifts straight into the real code; only the clickable shell is parked. Listen for "wait, that shouldn't be possible": each one is a bug in the *idea*, caught before real code depends on it.

## The UI branch: variants behind ?variant=

For "what should this look like?", the Skill builds several ==radically different versions== of one screen, called variants: three by default, five at most, because past five they stop being different and become noise. They share one route (one web address in your app), and a `?variant=` setting on the end of the address picks which one shows.

Variants must differ in structure: the layout, what's most prominent, the main control. Colours don't count. The UI instructions are blunt: "Three slightly-tweaked card grids isn't a UI prototype, it's wallpaper." If two come out alike, the agent redoes one with an explicit "don't use a card grid".

**Where they go.** The Skill strongly prefers the real page. If the screen exists, the variants render on its route with its real data, header and sidebar; only the part in question swaps. The same goes for something new that would naturally sit inside an existing page. Only when there's truly no home does it make a throwaway route with "prototype" in its name, because an empty page hides design problems.

**The switcher bar** floats at the bottom, styled so it's obviously not part of the design: a left arrow, a label like "B (Sidebar layout)", a right arrow. The arrows wrap around, and the ← → keys work too, except while you're typing. Each switch updates the address, so a variant survives a reload and can be shared. The bar hides itself on the live site.

The best feedback is a remix, like "the header from B with the sidebar from C", which the agent can build as a new variant.

```checkpoint existing-page-variants
Your app already has a settings page, and you want to see three new layouts for it. Where should the variants live?
- [ ] On a brand-new `/prototype/settings` route, so they can't disturb the real page.
  > That's the last resort, for screens with no home. An empty route hides problems the real page would expose.
- [ ] In a separate practice project, so the real one stays clean.
  > There they'd be judged with no real data, header or density around them, and they'd be harder to fold back in.
- [x] On the real settings route, picked by `?variant=`, with its data kept.
  > Right. The real page is the preferred home. Only the part in question swaps; the data, header and sidebar stay.
- [ ] As three screenshots the agent draws from its imagination.
  > The UI branch builds working variants you can click. A picture can't show how a layout behaves with real data.
```

## Six rules for both branches

1. **Throwaway, and clearly named.** It sits next to what it's for, but its name says "prototype". A throwaway route follows the project's existing conventions.
2. **Trivial to run.** One command for UI; a double-click for logic.
3. **No saving by default.** State lives in memory. If the database *is* the question, it uses a scratch one named "PROTOTYPE, wipe me".
4. **Skip the polish.** No tests, no error handling beyond what makes it run, no clever structure. Once it needs tests, it has stopped being a prototype.
5. **Show the full state** after every click or variant switch.
6. **Capture it when you're done.**

Rule 6 is where the value gets lost. A Git branch is a separate line of commits (saved snapshots of the project) beside `main`, the line your live site is built from. Capturing has three parts:

- **The decision goes into the real code.** The logic module lifts in; a winning variant is rewritten properly, with tests. Prototype code is never promoted as it is.
- **The prototype goes onto a branch** named `prototype/<name>`, never merged. All the variants and the switcher go there, not in the bin: runnable evidence a later Claude Code session can open.
- **The answer gets written down**: the verdict and the question it settled, on the ticket for building the real thing (a small task in the project's tracker), with a pointer to the branch. A commit message works too.

==`main` keeps only the decision==, none of the prototype.

```checkpoint winner-goes-where
A logic prototype for a parking app's pricing rules has done its job: the rules feel right. What happens to its two halves?
- [x] The rules module moves into the real code; the page goes onto a `prototype/<name>` branch.
  > Right. The pure module is the part worth keeping. The clickable shell is parked as evidence, out of main.
- [ ] Both halves are deleted, and only a one-line summary of the verdict stays on the ticket.
  > Deleting was the old advice. Since 1.2.0 the prototype is kept on a branch, and the module moves into the real code.
- [ ] Both halves are merged into main together, so the page can double as a handy admin tool.
  > The page was built under prototype rules: no tests, minimal error handling. It never goes into main.
- [ ] The HTML page stays on main as living documentation, and the module gets rewritten from scratch.
  > Backwards. The module was written pure so it could be lifted out; the page is the throwaway part.
```

## A session, step by step

Here's a UI prototype on this site, where every Lesson already has a page, so the variants go there too.

```scene chat
title: A UI prototype on this site's Lesson page (illustrative)
# You type the Skill and a question, not a solution.
you: `/prototype` What should the Final test results look like at the end of a Lesson? I can't picture it.
# It picks the UI branch and hosts the variants on the page that already exists.
agent: That's a "what should it look like" question, so the UI branch. Lesson pages already exist, so the variants render on the real Lesson route, picked by `?variant=`. Real Lessons, fake scores held in memory.
# Three variants that disagree about structure, started with one command.
agent: Run `npm run dev` and open any Lesson. **A** "Scorecard": one big score, then the missed questions. **B** "Review": every question in order, marked right or wrong. **C** "Next step": a slim score bar, then links to the sections to reread. Flip with the bar at the bottom, or ← →.
# You react and mix. That's the most useful feedback you can give.
you: B's marking is clear, but I want C's "reread this" link under each wrong answer.
# It adds the mix as a new variant instead of overwriting the others.
agent: Added **D**: B's list, with a reread link under each wrong answer.
# You call it, and the capture happens.
you: D wins. Capture it.
# The prototype parks on a branch; the verdict and its details go on the ticket.
agent: Committed all four variants and the switcher to `prototype/test-results`, never to be merged. On the ticket: the question, "D wins", what each part of D shows, and a link to the branch. Main keeps none of it; D gets rewritten properly, with tests, when the ticket is built.
```

Your part: name the question, react, ask for a mix and say when it's done. The agent does the rest.

## The detour: /handoff out and back

A prototype can be hungry. Tokens are the small chunks of text AI usage is measured in, and everything in a session (one Claude Code conversation) lives in the agent's context window, its working memory. As it fills, the model reasons less sharply; Matt calls the clear-thinking part the Smart zone, about 150k tokens on today's best models as a rule of thumb. In his May 2026 handoff video, one prototype session alone reached about 169k tokens. Pour that into your planning session and you push it out of the Smart zone just when the interview needs it sharp.

So Matt takes a detour, bridged by `/handoff`. That Skill writes a summary of the conversation to a markdown file (plain text with light formatting) in your computer's temp folder, not the project, so a fresh session can pick up the work. The file names the Skills the next agent should load, points at existing files instead of copying them, and leaves out secrets. `/handoff` is ==user-invoked==: the agent never starts it, so you type it, followed by what the next session is for.

```scene flow
title: The prototype detour (illustrative)
node: grill | Grilling, question 13
node: out | Handoff out
node: proto | Prototype in a fresh session
node: back | Handoff back
node: resume | Grilling resumes
node: spec | Write the spec
# You're grilling in session one when a question comes up that talking can't settle.
at: grill
# You type `/handoff` plus the purpose. It writes a short file to your temp folder, and session one stays open.
at: out
# In a fresh session you point the agent at that file. It loads `/prototype` from the suggested Skills and builds.
at: proto
# Once the answer is clear, a second `/handoff` writes only the verdict and the non-obvious lessons.
at: back
# Back in session one, you give it that file's path. None of the prototype's tokens ever landed here.
at: resume
# With every question settled, the same session goes on to `/to-spec` and writes the spec ([Spec + tickets](/learn/spec-and-issues)).
at: spec
```

You re-explain nothing, and the planning thread stays small. Matt calls it a do-it-yourself subagent (a helper agent with its own fresh memory that reports back). It's the first fork in his Main flow, the path most work takes from idea to shipped; [The main flow](/learn/main-flow) has the whole map.

**When `/handoff` is the wrong move.** It earns its place only when something has to travel: to another folder or project, another agent tool, a colleague, or a side task forked off mid-work. Matt's ordered checklist for a phase boundary, the gap between two chunks of work: carry on; `/clear` (empty the window) if nothing here matters any more; `/handoff` if something must travel; a subagent if the job can run unattended; otherwise `/compact`, a Built-in command that replaces the conversation with a summary you can steer. Going from planning straight to building, in the same place, with room left? Carry on: the build wants your reasoning word for word.

```checkpoint compact-or-handoff
Your UI variants are built and you're about to start a round of feedback on them. You're at about 140k tokens, in the same folder, and the design decisions so far matter. Which move fits?
- [ ] `/handoff` to a fresh session in this same folder, then carry on there with the file.
  > Nothing is travelling: same folder, same tool, same work. `/handoff` buys portability you don't need.
- [ ] `/clear`, then describe the variants to the agent again.
  > Clearing throws away the design decisions you just said matter.
- [ ] Keep going as you are; the window holds 1M tokens, so there's plenty of room left.
  > The limit that matters is quality, not size. Near the edge of the Smart zone, the model reasons less sharply even with most of the window free.
- [x] `/compact` with a note like "we're going to do more QA on this".
  > Right. Relevant context, same place, and you stay in the loop: that's where the checklist lands. Matt did exactly this at about 100k tokens.
```

## How Matt and others use it

**Matt Pocock**, from his videos:

- **He raises the fidelity.** In his July 2026 prototype video, he settles basic structure by talking and asks for a prototype the moment he needs to see or feel something working (1:31–2:53).
- **He reacts, then mixes.** For a search bar in his diagramming app, he flipped through A, B and C, liked A's search box and C's layout, and got a variant D combining them (4:01–7:36).
- **He prefers the live page**, as a more honest picture of how the code will work (7:13–7:32).
- **He compacts when nothing travels.** At about 100k tokens, staying put and needing the design decisions, he ran `/compact` noting that more QA (testing by hand) was coming (5:46–6:08).
- **He hands the result to an implementer**: an unattended agent plugs the winner in, removes the prototype code and checks it against the spec, with the branch as reference (8:03–8:39).
- **Not just screens.** Backend state models get logic prototypes too (8:53–9:50). His video shows a terminal app; since 1.2.0 that branch builds the HTML file instead.
- **The round trip.** In his May 2026 handoff video, at question 13 of a grilling session, he handed off to prototype the hard parts. That session grew to about 169k tokens; he handed the non-obvious lessons back, finished grilling and wrote the spec and tickets (7:20–9:13). He always tells `/handoff` what the next session is for (11:29–11:43).
- **Sometimes he skips it.** Building a feature in March 2026, he considered prototyping a crowded set of buttons but chose to get to code (18:56–19:37). During QA, seeing it built changed his mind; he fixed it in code, noting that a prototype phase could have settled it sooner (38:31–39:02). It's a judgement call.

**Other developers:**

- In a GitHub issue from October 2026, a team ran four rounds of UI prototypes, built 27 tickets with every check passing, and still found 16 visible differences from the approved prototype: only the verdicts had been written down.
- A September 2026 issue notes the flip side: kept prototype branches pile up, because tickets link to them and nobody can safely delete them.
- Nowshad Jawad (May 2026) uses `/handoff` mid-grilling to fork a side refactor into a second session, and a Reddit user (July 2026) runs it several times a day.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)), plus Git. The logic branch needs no web project.

1. Make an empty practice repo (a project folder tracked by Git) and start Claude Code there. If it asks whether you trust the folder, choose Yes.

```sh
mkdir book-loans && cd book-loans && git init && git commit --allow-empty -m "start" && claude
```

2. Type a slash and the word prototype. If no prototype Skill appears, type `/exit`, install Matt's Skills, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. If you see "plan mode on" under the prompt box, press Shift+Tab until it changes. Then type this (if it says "unknown skill", swap the first word for `/mattpocock-skills:prototype`):

```text
/prototype Does this state model feel right? A library book is Available, On loan, Overdue or Returned. A loan can be renewed at most twice, but not once it's overdue. Returning an overdue book records a late fee. I want to press buttons and watch the state change.
```

4. Open the HTML file it made by double-clicking it, or ask the agent to open it.
5. Run every walkthrough tab, then try to break the rules with free play: renew three times, renew an overdue book. If something surprises you, ask for a new button or scenario.
6. Capture it:

```text
We're done. Commit the prototype to a prototype/book-loans branch that is never merged. Then, on main, write DECISION.md with the question, the verdict and a pointer to that branch.
```

7. If it asks permission for something you didn't ask for, choose No; Esc stops it mid-task. Type `/exit` when you're done.

**It's working if:**

- [ ] The question is in plain words at the top of the page.
- [ ] It opened by double-click: no install, no server.
- [ ] A labelled state panel, not raw data, changes after every click.
- [ ] There are free-play buttons and walkthrough tabs, and one tab tries something that should be impossible.
- [ ] The rules sit in their own `<script>` block that never mentions the page.
- [ ] You hit a "wait, that shouldn't be possible" moment, or convinced yourself there isn't one.
- [ ] `git branch` lists `prototype/book-loans`, and `main` holds `DECISION.md` but not the HTML file.

**Stretch: the round trip.** In a longer conversation, type `/handoff prototype the late-fee rules and report back`, ask for the file's path, and have a fresh session read it. It's working if the file is short, points at files rather than copying them, and lists the prototype Skill under suggested Skills.
````

## Common mistakes

- **Prototyping what talking can settle**, like a web address or a button label.
- **Variants that differ only in colour.**
- **Hardening the prototype** with tests, the real database or "what if we need this later".
- **Merging it into main**, or shipping a variant as it is. Rewrite the winner; park the rest.
- **Deleting it**, the old advice. Park it on `prototype/<name>` and point at it from the ticket.
- **Recording a winner but not what it settled**: what each control does, what each panel holds.
- **Judging variants on an empty page** when a real one exists.
- **Prototyping inside a long planning session,** or using `/handoff` when nothing has to travel.

```site-story
I used it once, after the accounts work merged and before the Lesson page existed. I typed `/mattpocock-skills:prototype` with nothing after it, in the same session where I'd grilled the idea, written the spec and built the first two tickets.

**It named the question first:** "What should a lesson page with its comment box look like?" With no page to host variants, it used the last-resort shape: a throwaway route, `/prototype/lesson`, started by one command, `npm run proto`.

**It built three layouts,** using my grilling Lesson's real text and fake comments held in memory:

- **A, "Document"**: one column, comments at the end.
- **B, "Outline sidebar"**: a list of sections on the left.
- **C, "Side-by-side discussion"**: the Lesson on the left, a sticky discussion panel on the right.

**I picked C** ("c lets go with c"). Comments stay visible while you read, so it feels like a Lesson *with* a discussion, not one with a comment box bolted on. Picking by looking took minutes; picking by imagining could have taken a day.

**The capture.** One commit on `prototype/lesson-page`, "Prototype: three lesson page layouts (throwaway, never merge)", pushed and never merged. The verdict went onto issue 03 (the Lesson pages) and issue 06 (the comment box), each pointing at the branch and `VariantC`. The issue 03 note also recorded what C settled: the blue title band, the sticky panel, one column on narrow screens. The real page was then rebuilt properly, test-first.

**What I'd do differently.** I never used `/handoff`. Right after the prototype was built, `/context` showed about 205k of 1M tokens, well past the Smart zone, with plenty of building still ahead. Today I'd hand off out and back.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| A question you can't settle by talking | `/prototype <the question>` |
| It says "unknown skill" | `/mattpocock-skills:prototype` instead |
| Rules or state | Logic branch: one HTML file you double-click |
| A screen | UI branch: 3 to 5 variants, `?variant=`, a switcher bar |
| Variants look alike | "Redo one with no card grid" |
| Done | Decision into the real code, prototype onto `prototype/<name>`, verdict and details on the ticket |
| Mid-planning, and the prototype will be big | `/handoff` out, `/prototype` in a fresh session, `/handoff` back |
| Nothing has to travel | Carry on, or `/compact` |
| Design already settled | `/implement` |

## Final test

```test scenario-logic-question
Your question is "can a customer cancel a refund after part of the order has shipped?" You type `/prototype` with it. What should you expect it to build?
- [ ] Three layouts of the refunds page, switched by `?variant=` and a bar at the bottom.
  > That's the UI branch, for "what should this look like?". This question is about rules and state.
- [ ] A small terminal app you run from the command line to step through the refund rules.
  > That's what the logic branch built before 1.2.0. It now builds one HTML file anyone can open.
- [x] One HTML file with a state panel, free-play buttons and walkthrough tabs.
  > Right. A logic question gets a single double-click page that pushes the rules through tricky cases.
- [ ] A real refunds feature wired to the database, with tests, so the answer can be trusted.
  > Tests and a real database are exactly what a prototype skips. They come when the answer is built for real.
```

```test scenario-ui-question
Halfway through planning a dashboard for a dog-walking business, you still can't choose between showing today's walks as a calendar, a list or a map. You've described all three twice. What's the best move?
- [x] `/prototype`: three structurally different variants you flip between.
  > Right. "What should this look like?" is a UI question. Seeing all three beats describing them a third time.
- [ ] `/prototype`: one HTML file with buttons that walk through each view's rules.
  > That's the logic branch, for state and rules. Your question is about how the screen should look.
- [ ] Accept the agent's recommendation and move on; it's only a layout choice.
  > You'd be agreeing to something you can't evaluate. How a screen feels to use is a real product decision.
- [ ] Keep describing all three in more detail until one of them finally feels right.
  > Talking harder won't settle a question you need to see.
```

```test scenario-settled-design
Your tickets are written, every design question was settled while planning, and the agent suggests running `/prototype` before building. What do you do?
- [ ] Run it anyway, since a prototype is always the safest next step.
  > A prototype answers an open question. With none left, it only spends tokens.
- [ ] Prototype the whole app first, so you can see everything before any real code exists.
  > "The whole app" isn't one question. A prototype that size never stops, and drifts into being the real thing.
- [ ] Go back to planning and look for something left to prototype.
  > You'd be inventing work. The design is settled.
- [x] Decline, and build the first ticket with `/implement`.
  > Right. Agents sometimes suggest the prototype Skill at the wrong moment. When nothing is left to decide, build.
```

```test scenario-detour
You're 40 minutes into a grilling session you want to keep. One question needs a runnable answer, and the prototype will be big. Which move fits?
- [ ] Build the prototype right here in the same conversation, then carry on grilling.
  > A big prototype would push your planning session out of the Smart zone, just when the rest of the interview needs it sharp.
- [x] `/handoff` out, `/prototype` in a fresh session, `/handoff` the answer back.
  > Right. The planning thread stays small, the prototype gets a fresh window, and only the answer comes back.
- [ ] `/clear`, build the prototype, then explain the earlier decisions all over again.
  > Clearing throws away the decisions you've already made in the interview.
- [ ] `/compact` the grilling now, then build the prototype in whatever room is left over.
  > Compacting mid-interview flattens your decisions into a summary, and the prototype still floods the same window.
```

```test spot-colour-variants
Sam asked for UI variants of a recipe page. All three are the same grid of recipe cards: one blue, one green, one with rounded corners. Spot the mistake.
- [ ] There should be at least ten variants to choose from.
  > Past five, variants stop being different and become noise. The number isn't the problem.
- [x] The variants differ in colour, not structure.
  > Right. Variants must disagree about layout, hierarchy or the main control. Ask for one redone with "no card grid".
- [ ] The variants needed tests before Sam looked at them.
  > Prototypes skip tests. These fail for a different reason: they ask nothing.
- [ ] They should have been built on a separate new route.
  > Where they live isn't the problem. Three recoloured grids answer nothing wherever they sit.
```

```test spot-merged-prototype
Ana's UI prototype is done and variant B won. She merged the prototype branch into main, switcher and all, and shipped it. Spot the mistake.
- [ ] She should have deleted the prototype entirely once B won.
  > That was the old advice. The prototype stays, on a branch, as evidence.
- [ ] She should have kept all the variants live so visitors could pick one.
  > Variants and the switcher are for deciding, not for visitors. The switcher hides itself on the live site for a reason.
- [ ] She should have picked the variant with the nicest colours instead.
  > How she picked isn't the problem. What she did with the code afterwards is.
- [x] Prototype code went into main; B should be rewritten properly.
  > Right. Prototype code skips tests and error handling. Rewrite the winner into the real code, and park the rest on a never-merged branch.
```

```test spot-handoff-misuse
Lee finished grilling a small change, with plenty of room left in the session: same folder, same tool. Lee types `/handoff`, opens a new session and starts building there. Spot the mistake.
- [x] Nothing had to travel, so Lee should have carried on in the same session.
  > Right. The build wants the grilling word for word, and there was room. `/handoff` is for work that has to move somewhere.
- [ ] Lee should have typed `/clear` first, so the brand-new session started out emptier.
  > Clearing would throw the decisions away entirely. The fix is not to leave the session at all.
- [ ] Lee should have asked the agent to run `/handoff` instead of typing it.
  > `/handoff` is user-invoked, so only you can start it. And here it wasn't needed anyway.
- [ ] Lee should have prototyped the change before building it.
  > Nothing was left to decide by looking. The mistake was leaving a session that still had room.
```

```test sequence-detour
You're in a repo, planning a feature, and one question needs a UI prototype. Which order is right?
- [ ] `/grill-with-docs` → `/prototype` in the same session → `/to-spec` → `/handoff`
  > The prototype would flood the planning session, and a handoff at the very end carries nothing back.
- [ ] `/handoff` → `/grill-with-docs` → `/prototype` → `/to-spec`
  > There's nothing to hand off before the interview starts, and the answer never comes back.
- [x] `/grill-with-docs` → `/handoff` → `/prototype` in a fresh session → `/handoff` back → `/to-spec`
  > Right. Grill until you hit the question, detour out and back, finish grilling, then write the spec from the same planning session.
- [ ] `/grill-with-docs` → finish grilling → `/to-spec` → `/to-tickets` → `/handoff` → `/prototype` in a fresh session
  > The spec and tickets would be written before the open question was answered.
```

```test why-no-tests
A friend building a logic prototype wants to add tests "to be safe". What's the strongest reply?
- [ ] "Good idea: tests make the verdict trustworthy enough to merge the prototype."
  > The prototype never merges, tested or not. The answer moves into the real code, which gets its own tests.
- [x] "Once it needs tests, it isn't a prototype. Tests come with the real code."
  > Right. A prototype exists to learn one thing fast. The validated rules get tested when they move into the real code.
- [ ] "Only the switcher bar needs tests, since visitors will see it."
  > The switcher hides itself on the live site, and a logic prototype doesn't have one.
- [ ] "Tests are fine as long as they run against the real database."
  > A prototype keeps its state in memory. A real database is another thing it skips.
```

```test spot-verdict-only
After four rounds of UI prototypes, a team wrote "we picked C" on the ticket and moved on. The finished build missed half of what C's panels held. Spot the mistake.
- [ ] They should have deleted the prototype so nobody copied from it.
  > Deleting removes the only place the details lived.
- [ ] They ran too many rounds; one round of variants is the limit.
  > There's no limit on rounds. Prototypes evolve as you react to them.
- [ ] They should have built every variant for real and compared them in production.
  > That's building three features to choose one. The prototype exists so you don't have to.
- [x] Only the verdict was written down, not the details C settled.
  > Right. A prototype settles more than a winner: what each control does, what each panel holds. Write those down too, and point at the branch.
```

```sources
- [prototype SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md), with [LOGIC.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/LOGIC.md) and [UI.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/UI.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [handoff SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/handoff/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md) and [PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/PHASE-BOUNDARIES.md) (the prototype detour, the five options at a phase boundary, the Smart zone): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills CHANGELOG](https://github.com/mattpocock/skills/blob/main/CHANGELOG.md) (1.1.0 makes prototype model-invoked; 1.2.0, #763, the HTML file and the `prototype/<name>` branch): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /prototype Skill](https://www.aihero.dev/skills-prototype), AI Hero docs, undated, read 2026-10-23.
- [The /handoff Skill](https://www.aihero.dev/skills-handoff), AI Hero docs, updated 2026-08-24, read 2026-10-23.
- [Don't waste time on specs: /prototype instead](https://www.youtube.com/watch?v=n0VhIVtviC0), Matt Pocock, 2026-07-23 (specs vs code 0:00–0:55, fidelity 1:31–2:53, variants and remix 4:01–7:36, compact at ~100k 5:46–6:08, live page 7:13–7:32, implementer 8:03–8:39, logic prototypes 8:53–9:50, Shape Up 10:25).
- [/handoff is my new favourite skill](https://www.youtube.com/watch?v=dtAJ2dOd3ko), Matt Pocock, 2026-05-21 (compact vs handoff 3:21–5:46, the prototype round trip 7:20–9:13, other harnesses 9:23–9:41, the purpose 11:29–11:43).
- [9 Things People Get Wrong With My /grill-* skills](https://www.youtube.com/watch?v=UzMNBN6xLLA), Matt Pocock, 2026-05-25 (high- and low-fidelity questions, the prototyping handoff, 1:28–3:43).
- [Building a REAL feature with Claude Code: every step explained](https://www.youtube.com/watch?v=hX7yG1KVYhI), Matt Pocock, 2026-03-18 (choosing not to prototype 18:56–19:37, the QA finding 38:31–39:02).
- [Issue #1306: a UI prototype's settled details never reach the implementers](https://github.com/mattpocock/skills/issues/1306), opened 2026-10-20, read 2026-10-23.
- [Issue #1020: throwaway research and prototype branches can never be deleted](https://github.com/mattpocock/skills/issues/1020), opened 2026-09-03, read 2026-10-23.
- [Issue #1019: shorthand /prototype conflicts with a hidden Claude Code built-in](https://github.com/mattpocock/skills/issues/1019), opened 2026-09-03, closed, read 2026-10-23.
- [The Two Matt Pocock Skills I Use in Almost Every AI Coding Session](https://medium.com/@anmjawad007/the-two-matt-pocock-skills-i-use-in-almost-every-ai-coding-session-57c468938145), Nowshad Jawad, 2026-05-29.
- [r/ClaudeCode: Matt Pocock tutorials thread](https://www.reddit.com/r/ClaudeCode/comments/1v90akt/), 2026-07-28.
```
