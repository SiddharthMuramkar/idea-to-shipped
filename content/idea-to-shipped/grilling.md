---
title: grilling: the interview, in rounds of questions
slug: grilling
summary: How Matt Pocock's grilling Skill interviews you in rounds of questions until you and your coding agent share one understanding of a plan.
---

## What it's for

Say you're deciding how cancelling a yoga-studio booking should work. Asked everything at once, you'd hit questions resting on answers you haven't given. Asked one per turn, you'd crawl through the easy ones.

**grilling is the interview itself: the agent questions you in rounds until you both reach a shared understanding.** It's one of Matt Pocock's [Skills](/learn/skills): instructions an agent loads for one kind of task. [Grill before you build](/learn/grill-before-you-build) explains why it comes before any code.

The agent maps your plan as a **design tree**: a map of decisions, each branching into the ones depending on it. Each round asks the whole **frontier**: every decision whose prerequisites are already settled, so it can ask without guessing. A question that depends on one still open waits for a later round.

```checkpoint quick-1
Whether members can cancel at all is still open. When can the agent ask how late they can cancel?
- [x] In a later round, once the question it depends on is settled.
- [ ] In this round, numbered right after the question it depends on.
- [ ] Never, because a question that depends on another drops out.
Why: How late depends on whether members can cancel at all, and that's still open. A question that depends on one still open waits for a later round.
```

For example, type `/grilling How should cancelling work?`, and round one might be:

```
❓ Q1 - Who cancels: Can only the member who booked cancel?
➡️ Yes, only them.

❓ Q2 - Cut-off: Should cancelling close before class starts?
➡️ Yes, so the place can be refilled.
```

Each question is worded so `yes` accepts its recommended answer. You answer by number: `Q1 yes, Q2 yes`. Your answers settle decisions. So the agent works out the new frontier, and the next round asks how many hours before class.

Facts are the agent's job; decisions are yours. For a fact, such as which table holds bookings, it sends a subagent: a helper agent with its own fresh [context window](/learn/context-window). Only the questions that depend on that fact wait; it asks you the rest meanwhile.

```checkpoint quick-2
A subagent is off finding out which table holds bookings. What happens to the rest of the round?
- [x] The agent asks you the rest meanwhile; only dependent questions wait.
- [ ] The whole round has to wait until the subagent has reported back.
- [ ] The agent asks you for the fact, so that the round can carry on.
Why: Facts are the agent's job, and looking one up doesn't hold up the round. Only the questions that depend on that fact wait.
```

The session is done when the frontier is empty, with every branch of the tree visited. Even then, the agent doesn't act until you confirm you share an understanding.

```diagram
type: cycle
caption: "The session is done when the frontier is empty"
steps: ["Each round asks the whole frontier", "You answer by number", "Your answers settle decisions", "the agent works out the new frontier"]
outside: "Facts are the agent's job"
```

## When to use it

- You run [grill-me](/learn/grill-me) or [grill-with-docs](/learn/grill-with-docs), the two named ways in. They start it for you.
- You run [triage](/learn/triage), [wayfinder](/learn/wayfinder) or [improve-codebase-architecture](/learn/improve-codebase-architecture), which run it inside their own work.
- You want a plan stress-tested with no other Skill around the interview, so you type it.

```checkpoint quick-3
You run triage, and the agent starts asking numbered rounds. What's happening?
- [x] triage is running grilling inside its own work.
- [ ] triage has a separate interview of its own.
- [ ] You started grilling by mistake, so triage has stopped.
Why: You don't need to type grilling here. triage, wayfinder and improve-codebase-architecture each run it inside their own work.
```

## When not to use it

- If you're in a repo, use [grill-with-docs](/learn/grill-with-docs) instead, because it also writes [`GLOSSARY.md`](/learn/one-shared-language) and ADRs (decision records) as you go.
- If you have no repo, use [grill-me](/learn/grill-me) instead, because it's the same interview under a name the agent never starts by itself.
- If the answers are in someone else's head, use [to-questionnaire](/learn/to-questionnaire) instead, because it writes that person the questions.

```checkpoint quick-4
You're in the yoga-studio repo, and you want the interview to leave files behind. Which Skill fits?
- [x] grill-with-docs, which also writes GLOSSARY.md and ADRs.
- [ ] grilling, typed directly, with no other Skill around it.
- [ ] grill-me, the same interview under a name only you start.
Why: In a repo, use grill-with-docs. It runs the same interview, and it also writes `GLOSSARY.md` and ADRs as you go.
```

## What it needs to start

A plan, a decision or an idea, and you, ready to answer: every decision is put to you, and the agent waits.

```checkpoint quick-5
You start a grilling, then leave for lunch. What happens to the round's decisions?
- [x] They wait for you, because each decision is put to you.
- [ ] The agent settles them itself, using its recommended answers.
- [ ] A subagent looks them up in the repo while you're away.
Why: The interview needs you there, ready to answer. The agent puts every decision to you and waits, so nothing gets settled while you're away.
```

You can type `/grilling`, or the agent may start it on its own when a task fits.

```checkpoint quick-6
You never typed `/grilling`, but a task fits it. Can the interview still start?
- [x] Yes. The agent may start it on its own when a task fits.
- [ ] No. Only you can start it, by typing its name yourself.
- [ ] No. It only runs when grill-me or grill-with-docs calls it.
Why: You can type `/grilling`, but you don't have to. The agent may also start it on its own when a task fits.
```

## What it creates

A shared understanding, with nothing left silently assumed, and nothing on disk.

```checkpoint quick-7
A grilling you typed directly has finished. What has it written to your repo?
- [x] Nothing. It leaves a shared understanding and no files.
- [ ] GLOSSARY.md and ADRs, with an entry for each decision.
- [ ] A Spec, the written plan for a feature, saved at the end.
Why: What it leaves is the understanding itself. You and the agent share one, with nothing silently assumed, and there's nothing on disk.
```

## Going deeper

### Why it exists

A grilling stops an agent building on its own guesses, as [grill before you build](/learn/grill-before-you-build) showed. But many Skills need that same interview. If each kept its own copy, every fix would be made several times.

So the interview lives in one Skill. Matt Pocock, who wrote it, calls grilling a **primitive**: a small building block that other Skills call. He describes it as "kept in one place so every skill that needs an interview reaches for it instead of inventing one."

One home means the fix reaches them all. When rounds moved into grilling, grill-me, grill-with-docs, triage and wayfinder all got them at once.

```checkpoint quick-8
A bug in the interview's rules gets fixed in grilling. What happens to grill-me and grill-with-docs?
- [x] They get the fix too, because the interview has one home.
- [ ] They keep the old rules until each one is edited as well.
- [ ] They stop working until each one is changed to match it.
Why: One home means the fix reaches them all. When rounds moved into grilling, grill-me, grill-with-docs, triage and wayfinder all got them at once.
```

### How it works underneath

**Matt took the design tree from Fred Brooks.** It's in his 2010 book _The Design of Design_. For original design, Brooks says a designer "can rarely sit down and a priori map out the design tree". A priori means in advance. Instead, designers discover the tree as they work: each decision opens and closes the alternatives for the next one.

Say you choose a cut-off for cancelling. Only then does _how many hours before class?_ exist. Without one, it never comes up. That's why the agent can't ask everything up front: your answers grow the tree.

```checkpoint quick-9
You choose no cut-off for cancelling. What happens to the question about how many hours before class?
- [x] It never comes up, because your answers grow the tree.
- [ ] It still gets asked, but only in the session's last round.
- [ ] The agent answers it for you, with its own recommendation.
Why: That question only exists if you choose a cut-off. Your answers grow the tree, so the agent can't ask everything up front.
```

**Why rounds, not one question at a time.** The interview used to ask one question per turn. Near the end of a session the hard part is done, but the easy questions still arrive one by one. Matt's verdict: "This is incredibly frustrating and it feels dead slow."

His way out was to treat the questions as a **graph**: things joined by links, so one critical question can open up many others. So each round asks only the questions that are open now. The same 13 questions then land in about 3 rounds instead of 13 turns.

```checkpoint quick-10
The interview moved from one question per turn to rounds. What changed for the same 13 questions?
- [x] They land in about 3 rounds instead of 13 turns.
- [ ] The agent cuts them down to about 3 questions in total.
- [ ] They all arrive at once, in one long round of 13.
Why: The 13 questions still get asked. Each round asks only the questions that are open now, so they take far fewer turns.
```

```diagram
type: chain
caption: "Why rounds, not one question at a time."
steps:
  - "one question per turn"
  - "it feels dead slow"
  - "treat the questions as a graph"
  - "each round asks only the questions that are open now"
```

**What a round can lose.** A round only contains questions that don't depend on each other, so no answer should change another question in it. Your answers still shape what comes next, because the agent works out each next round from scratch. You still lose something, if the agent misjudges a pair.

**Two rules came from bugs.** Version 1.1 of the Skills fixed both:

- **The wait for your confirmation.** Many people reported sessions that ended, and then the model jumped straight into building.
- **Facts versus decisions.** In some odd situations the model "would grill itself", exploring the code and answering with no human input. So Matt named the two kinds of information: facts you find by exploring, and decisions the user makes.

```checkpoint quick-11
Which rule came from the model exploring the code and answering with no human input?
- [x] Facts versus decisions, who finds out and who decides.
- [ ] The wait for your confirmation, before any building starts.
- [ ] The limit of one question per turn, for every interview.
Why: The model was grilling itself, so Matt named two kinds of information. The wait for your confirmation fixed a different bug, the jump straight into building.
```

### A real example

In his August 2026 video for version 1.2, Matt shows a real session. Round one is on screen: Q1 with its recommendation underneath, then Q2, and so on. He's using **dictation**, speaking his answers instead of typing them. He agrees to the first two out loud: "Okay, Q1, I agree. Q2, I agree."

Then he says Q3 and Q4 need changing, and round two arrives in the same shape. That's what the numbers are for: you can answer a whole round by number, without quoting any question back.

```checkpoint quick-12
Why does a round number its questions?
- [x] So you can answer the whole round by number.
- [ ] So the agent can ask them one at a time, in order.
- [ ] So you can see how many rounds are still to come.
Why: Numbers let you answer a whole round without quoting any question back. Matt does it out loud, one number after another.
```

You may still read older posts that describe one question at a time. In March 2026 the interview was a few lines inside grill-me. Before version 1.1, the guidance warned that asking several questions at once was bewildering. Models sometimes did it anyway, so version 1.1 spelled out why. Version 1.2 then switched to rounds, and that's what today's Skill does.

### Where it goes wrong

**The agent starts building as soon as the questions run out.** It skipped the wait for your confirmation. Weaker and faster models "still skip the gate", the point where they should stop for you. The reliable fix is a line in your own `AGENTS.md` or `CLAUDE.md`, the [instruction file](/learn/instruction-files) your agent reads at the start of every session, telling it not to implement without permission. When a repo has a `CLAUDE.md`, as the practice project does, Claude Code reads it instead of `AGENTS.md` by default. So put the line in `CLAUDE.md`.

```checkpoint quick-13
Your model keeps starting to build as soon as the questions run out. What's the reliable fix?
- [x] A line in AGENTS.md or CLAUDE.md saying not to implement without permission.
- [ ] A switch to a faster model, which stops more reliably for your answer.
- [ ] A second run of the interview, so that it has more questions to ask.
Why: Weaker and faster models can skip the wait for your confirmation. A line in your own `AGENTS.md` or `CLAUDE.md` is the reliable fix.
```

**Two questions in one round depend on each other.** The agent chooses the frontier by judgement; it doesn't compute it from a graph. So a linked pair can slip into one round, and one answer should have changed the other. The only guard is to tell the agent. That reopens the affected branch in the next round.

**The questions keep coming.** You can't set a limit: "No, and a cap is out of scope on purpose." Some plans need three questions and some need fifty. A very long session usually means the work was too big. So tell the agent to wrap up, or break the work up and grill the pieces.

```checkpoint quick-14
A session has run very long, and the questions keep coming. What do you do?
- [x] Tell the agent to wrap up, or break the work up.
- [ ] Set a cap on the number of questions it may ask.
- [ ] Widen the plan, so all the questions get asked together.
Why: You can't set a limit on the questions. A very long session usually means the work was too big, so wrap up or grill smaller pieces.
```

**The agent answers its own questions.** This happens most when another Skill runs grilling to resolve a ticket, such as a [wayfinder](/learn/wayfinder) decision ticket: an [Issue](/learn/issues-and-keeping-track) that asks one question. The agent takes that task as permission to keep moving. A session nobody answers "has produced the agent's opinion rather than yours." That's also why grilling has no mode that runs without you. So answer those decisions yourself.

```checkpoint quick-15
Another Skill ran grilling, and the agent answered its own questions. What have you got?
- [x] The agent's opinion, which still needs your decisions.
- [ ] A settled plan, since the interview reached its end.
- [ ] Your decisions, worked out for you from the repo.
Why: A session nobody answers has produced the agent's opinion rather than yours. So answer those decisions yourself.
```

**A whole round at once feels like too much.** One question at a time works better for some people: those who read slowly, work in a second language, or need it to focus. One user called rounds "completely unusable", because some questions relied on answers they hadn't given yet. The way back is one line in your global [`CLAUDE.md`](/learn/instruction-files) (`~/.claude/CLAUDE.md`):

```
When grilling, ask one question at a time.
```

Matt calls that "a supported setting, not a workaround."

**Agreeing with a recommendation means answering no.** Older versions could word a question so that its recommendation argued against it. In October 2026, version 1.3.2 fixed that: each question is now worded so `yes` accepts the recommendation. If you still see it, answer the recommendation and say so.

### Try it

You'll need your practice project, the yoga-studio booking site, with Matt's Skills installed. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

You'll type `/grilling` here to see the bare interview on its own, in a real repo where the agent can look facts up. For real work in a repo, [grill-with-docs](/learn/grill-with-docs) is the better choice, because it also writes `GLOSSARY.md` and ADRs as you go.

1. Open the `yoga-studio` repo in Claude Code.
2. Type `/grilling How should cancelling a class booking work?`
3. Read the first round. You should see numbered questions, each with its recommendation on its own `➡️` line.
4. Check that no question in the round needs another one answered first.
5. Answer the whole round by number, such as `Q1 yes, Q2 yes, Q3 no`, with your reason for each no.
6. Read the next round. You should see questions the first round couldn't have asked.
7. Watch for a fact it needs, such as whether `api/` has tables. It should look that up, not ask you.
8. Keep answering until the questions run out. You should see it ask you to confirm, instead of starting work.
9. Tell it you share an understanding, and that you don't want anything built yet.

If a check fails, tell the agent which one, and note what changes in the next round.

### Read more

- [The /grilling Skill](https://www.aihero.dev/skills-grilling), Matt Pocock, aihero.dev, updated 2026-08-24
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4) (video), Matt Pocock, 2026-08-05
- [v1.1: /wayfinder, /to-spec, /to-tickets, /grilling improvements, and much more](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements), Matt Pocock, 2026-07-08
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16
- [The Design of Design (publisher preview)](https://api.pageplace.de/preview/DT0400.9780321702043_A23552532/preview-9780321702043_A23552532.pdf), Frederick P. Brooks, Jr., 2010
- [Release v1.3.2](https://github.com/mattpocock/skills/releases/tag/v1.3.2), Matt Pocock, mattpocock/skills, 2026-10-29
- [Grill-me go back to a single question at a time (#1167)](https://github.com/mattpocock/skills/issues/1167), Yamahari, with Matt Pocock's reply, 2026-10-05

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint grilling-deeper-linked-pair
In round two, the agent asks Q1, whether yoga classes can be booked as a block of ten, and Q2, how refunds work for a single cancelled class. You see that your answer to Q1 changes Q2. What should you do, and why?
- [x] Tell the agent, because it picks the frontier by judgement and can miss a link.
- [ ] Answer both now, because the agent computes the frontier, so Q2 can't depend on Q1.
  > The agent chooses the frontier by judgement; it does not compute it from a graph, so a linked pair can slip into one round.
- [ ] Answer only Q1 and skip Q2, because the agent always asks a skipped question again.
  > Matt's guard is to tell the agent. Saying so is what reopens the affected branch in the next round.
- [ ] Start a new session, because a round with a linked pair means the design tree is lost.
  > Nothing is lost. Telling the agent reopens the affected branch in the next round of the same session.
Why: The agent chooses the frontier by judgement rather than computing it, so two linked questions can share a round. The only guard is to tell it, and that reopens the affected branch in the next round.
```

## Remember

```flashcards
Q: In grilling, what is the frontier?
A: Every decision whose prerequisites are already settled: the questions that can be asked now without guessing.

Q: In grilling, whose job are the facts, and whose are the decisions?
A: Facts are the agent's job (it sends a subagent with a fresh context window to look them up). Decisions are yours.

Q: When is a grilling session done?
A: When the frontier is empty, with every branch of the design tree visited. Even then, the agent doesn't act until you confirm you share an understanding.

Q: What are the two named ways in to grilling?
A: grill-me (no repo) and grill-with-docs (in a repo).

Q: Where does grilling's "design tree" come from?
A: Fred Brooks's The Design of Design (2010). Designers discover the design tree as they work: each decision opens and closes the alternatives for the next one.

Q: How do you make grilling ask one question at a time again?
A: Add "When grilling, ask one question at a time." to your global CLAUDE.md. Matt calls it a supported setting, not a workaround.

Q: Can you cap how many questions grilling asks?
A: No, a cap is out of scope on purpose. Tell it to wrap up, or, if sessions run very long, break the work up and grill the pieces.
```

## Final test

```final-test grilling-what-is-the-frontier
In grilling, what is the frontier?
- [x] Every decision whose prerequisites are already settled.
- [ ] Every question in the design tree that is still unasked.
- [ ] The one decision in the plan that the others depend on.
- [ ] The facts a subagent still has to look up in the repo.
Why: The frontier is what the agent can ask right now, because nothing those decisions depend on is still open. So it isn't guessing at answers it hasn't heard. Each round asks the whole frontier.
```

```final-test grilling-needs-a-fact
Mid-interview, the agent needs to know which Python version your Dockerfile uses. What does it do?
- [x] It sends a subagent to look it up, and asks you the rest meanwhile.
- [ ] It asks you, as a numbered question with a recommended answer.
- [ ] It sends a subagent and pauses the interview until it reports.
Why: Finding facts is the agent's job, never yours, so it doesn't ask you. It doesn't pause either: only the questions that depend on the fact wait for the subagent.
```

```final-test grilling-when-done
When is a grilling session done?
- [x] When the frontier is empty and every branch is visited.
- [ ] After three rounds of numbered questions and answers.
- [ ] When the agent has turned your answers into a Spec.
Why: The session ends when there's nothing left to ask, however many rounds that takes, and it doesn't depend on any Spec. Even then, the agent doesn't act until you confirm.
```

```final-test grilling-deeper-why-rounds
In version 1.2, grilling stopped asking one question per turn. What problem did Matt name?
- [x] Late in a session, the easy questions came one per turn, which felt dead slow.
- [ ] The model kept asking several questions at once, even when told this was bewildering.
- [ ] Sessions ended and the model went straight into building without your confirmation.
- [ ] The model grilled itself, exploring the code and answering without any human input.
Why: Near the end the hard part is done, so answering easy questions one per turn felt dead slow. Rounds fix that. The other three were real problems too, but version 1.1 dealt with them, before rounds arrived.
```

```final-test grilling-deeper-design-tree-source
grilling's design tree comes from Fred Brooks. What does Brooks say about the tree?
- [x] Designers discover it as they work, as each decision opens and closes the next ones.
- [ ] A good designer maps out the whole tree first, before making the first decision.
- [ ] Each branch should be settled one by one, in the order the designer first wrote it.
- [ ] The tree is fixed for each kind of project, so it can be copied from earlier work.
Why: In original design, a designer can rarely map out the whole tree in advance. Instead, the tree is discovered as you go: each decision opens and closes the next ones. grilling works the same way, working out the frontier again after each round.
```

```final-test grilling-repo-paper-trail
You are in the repo of your FastAPI backend. You want an agent to interview you about a plan to add rate limiting, and you'd like the terms and hard decisions you settle to be written down. Which fits best?
- [x] Run the interview while a GLOSSARY.md and ADRs are written.
  > Right: that's `/grill-with-docs`.
- [ ] Run the bare interview on its own, with no other Skill around it.
  > That's `/grilling`. It runs the same interview but writes nothing down.
- [ ] Run the interview that saves nothing, meant for plans with no repo.
  > That's `/grill-me`. It saves nothing locally, and there is a repo here to leave a paper trail in.
Why: All three run the same interview, so the choice comes down to what gets left behind. In a repo, grill-with-docs is the better one: it also writes `GLOSSARY.md` and ADRs, the project's words and its hard decisions.
```

```final-test grilling-next-round
An agent is interviewing you about the Docker setup for your AI agent project. You have just answered its second round of numbered questions. Some decisions are now settled, but parts of the design tree are still unvisited. What comes next?
- [x] The agent works out the new frontier and asks the next round.
  > Right: that's `/grilling`.
- [ ] The agent writes a Spec from the decisions settled so far.
  > That's `/to-spec`. The session isn't done while branches of the design tree are still unvisited.
- [ ] The agent starts building the settled parts, one test at a time.
  > That's `/tdd`. The agent doesn't act until you confirm you share an understanding.
Why: Your answers settled some decisions, and that opens up the ones depending on them. So the interview isn't over: the agent works out the new frontier and asks again, until the frontier is empty.
```

```final-test grilling-why-look-it-up
An agent is interviewing you about a new SQL migration for your FastAPI app. It needs to know which migration tool the repo already uses. Instead of asking you, it sends a subagent to find out, and asks you its other questions meanwhile. Why?
- [x] Finding facts is never your job; your answers are kept for decisions.
- [ ] The agent doesn't trust what you remember about the repo's tools.
  > The rule is about whose job it is, not about trust.
- [ ] Questions about tools wait until the last round of the interview.
  > Only the questions that depend on the fact wait for the subagent. The rest of the frontier is asked now.
Why: If the agent can look something up, it doesn't ask you, because finding facts is never your job. Your answers are kept for the decisions, which only you can make.
```

```final-test grilling-why-later-round
An agent is interviewing you about login for your website. In this round it asks whether users sign in with a password or with an email link. It holds back its question about password reset emails. Why?
- [x] Its answer depends on a question still open in this round.
- [ ] The agent asks only one numbered question in each round.
  > Each round asks the whole frontier, so a round can hold many questions.
- [ ] Password reset is a fact a subagent can look up in the repo.
  > Whether you need password resets depends on your decision, not on a fact in the repo.
Why: If you choose email links, there are no passwords to reset. So the reset question depends on an answer the agent hasn't heard yet. Asking it now would mean guessing, so it waits for a later round.
```

```final-test grilling-deeper-skipped-gate
You use a faster, lower-effort model to interview you about the cancellation rules for your yoga-studio API. The frontier empties, and before you say anything the agent starts writing the cancellation endpoint. Which fix does Matt give, and why?
- [x] Add a line to your AGENTS.md or CLAUDE.md saying not to implement without permission.
- [ ] Ask for a cap on the number of questions, so the session ends before it can build.
  > A cap is out of scope on purpose, and the trouble is the skipped confirmation, not the number of questions.
- [ ] Add "When grilling, ask one question at a time." to your global CLAUDE.md file.
  > That line only changes how questions are asked. It does nothing about the agent skipping the wait for your confirmation.
- [ ] Run the interview from inside another Skill, so that Skill holds back the code.
  > Agents answer their own questions most when another Skill runs grilling to resolve a ticket: they take that task as permission to keep moving.
Why: With the frontier empty, the agent should still wait until you say you share an understanding, but weaker and faster models can skip that wait. So you make the rule permanent: a line in your own AGENTS.md or CLAUDE.md telling the agent not to implement without permission.
```

```sources
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), Matt Pocock
- [The /grilling Skill](https://www.aihero.dev/skills-grilling), Matt Pocock
- [v1.1: /wayfinder, /to-spec, /to-tickets, /grilling improvements, and much more](https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements), Matt Pocock, 2026-07-08
- [Release v1.1.0 · mattpocock/skills](https://github.com/mattpocock/skills/releases/tag/v1.1.0), github-actions[bot], 2026-07-08
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16
- [The Design of Design: Essays from a Computer Scientist (publisher preview)](https://api.pageplace.de/preview/DT0400.9780321702043_A23552532/preview-9780321702043_A23552532.pdf), Frederick P. Brooks, Jr., 2010
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [My 'Grill Me' Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral), Matt Pocock, 2026-03-23
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [Release v1.3.2 · mattpocock/skills](https://github.com/mattpocock/skills/releases/tag/v1.3.2), Matt Pocock, 2026-10-29
- [Grill-me go back to a single question at a time #1167](https://github.com/mattpocock/skills/issues/1167), Yamahari (issue); mattpocock (reply), 2026-10-05
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
```
