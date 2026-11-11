---
title: to-questionnaire: questions only someone else can answer
slug: to-questionnaire
summary: How to turn the questions only someone else can answer into a document they fill in, then bring their answers back to your agent.
---

## What it's for

Say an agent is [grilling](/learn/grilling) you about your yoga-studio site's booking rules. It asks how late a member can cancel. You don't know: the studio owner sets that rule.

**to-questionnaire turns the questions you can't answer into a questionnaire: a Markdown document for the one person who can.**

```checkpoint quick-1
You have questions only the studio owner can answer. What does to-questionnaire give you?
- [x] A Markdown document of those questions, for the studio owner to fill in.
- [ ] A web form for the studio owner, with the answers saved to your database.
- [ ] A live interview in which the agent asks the studio owner each question.
Why: A questionnaire is a Markdown document for the one person who can answer what you can't. The agent makes no form, and it never questions the studio owner itself.
```

Markdown is plain text with light formatting. The person who can answer fills it in when they have time, or you go through it together in a meeting. A run:

```
You:   /to-questionnaire
Agent: Who is it going to?
You:   The studio owner. Not technical.
Agent: What do you need back?
You:   How late a member can cancel.
Agent: Wrote to-questionnaire-booking-rules.md
```

The agent never asked what the rules should be. That's the [Skill](/learn/skills)'s rule: grill the **send**, not the subject. The send is who it goes to and what you need back.

```checkpoint quick-2
You run to-questionnaire about a client's old database, and you know little about it. What does it ask you?
- [x] Who the document goes to, and the answers you need back.
- [ ] What you remember about the database, in round after round.
- [ ] How the database should work, once the client replies.
Why: It grills the send, not the subject. The send is who the document goes to and what you need back. The database is the subject.
```

## When to use it

- You're being grilled, and the session stalls on questions that aren't yours to answer.
- You're blocked on a decision, and the knowledge lives in one other person's head, such as a client's.

```checkpoint quick-3
Which moment fits to-questionnaire?
- [x] A grilling stalls on a question that only the studio owner can answer.
- [ ] A grilling stalls on a question you could settle with more thought.
- [ ] A decision is blocked on knowledge you already hold in your own head.
Why: It's for answers that aren't yours to give. If the knowledge is in your own head, the questions should come to you instead.
```

## When not to use it

- If the answers are in your own head, use [grill-me](/learn/grill-me) instead, or [grill-with-docs](/learn/grill-with-docs) in a repo, because each interviews you about the subject.
- If the facts are in official docs or code outside your repo, use [research](/learn/research) instead, because it sends an agent to read and cite them.

```checkpoint quick-4
You're sketching a plan with no repo, and every decision is yours. Which fits?
- [x] grill-me, because it interviews you about what's in your own head.
- [ ] to-questionnaire, because it writes your questions up for someone else.
- [ ] research, because it sends an agent to read and cite the docs.
Why: The answers are in your own head, so you want an interview of you. With a repo, you'd use grill-with-docs instead.
```

## What it needs to start

No setup. Only you can start it, by typing `/to-questionnaire`. If you're being grilled, run it in that same conversation, so the agent can draw on the session.

```checkpoint quick-5
A grilling stalls on a question for the studio owner. Will the agent start to-questionnaire by itself?
- [x] No. Only you can start it, by typing /to-questionnaire.
- [ ] Yes. It starts once a question isn't yours to answer.
- [ ] Yes. It starts once you've accepted its recommended answer.
Why: Only you can start it. Type /to-questionnaire in that same conversation, so the agent can draw on the session.
```

The agent then asks two things you can always answer:

1. Who is it going to? Their role, what they know and how they relate to you. That sets the tone and the background.
2. What do you need back? The decisions or facts you can't settle alone.

The document's questions then aim at the gap between what that person knows and what you need.

## What it creates

One file in the current folder: `to-questionnaire-<slug>.md`, named from the topic. It sends nothing and creates no [Issue](/learn/issues-and-keeping-track) or [branch](/learn/branches-and-worktrees).

The file has a fixed shape. A shortened example:

```
# Booking rules

**Purpose:** settle the rules before we build.
**From:** you, **To:** the studio owner

## Context
One short paragraph.

## How to answer
"I don't know" is useful.

## Cancellations
### How late can a member cancel?

>

## Anything else?
```

The questions come most important first, because the person answers on their own time and you may only get one pass. Each one holds one idea, with space to answer right beneath it: a line starting with `>`.

```checkpoint quick-6
The studio owner will answer on their own time. Which question goes first in the file?
- [x] The one that matters most, since you may only get one pass.
- [ ] The easiest one, so the studio owner warms up before the hard ones.
- [ ] The one the grilling raised first, to keep the same order.
Why: The person answers on their own time, and you may not get a second round with them. So the most important question goes first.
```

What comes back is material for the [main flow](/learn/main-flow), the plan-then-build routine, for example a [grill-with-docs](/learn/grill-with-docs) session.

```checkpoint quick-7
The studio owner's answers come back. What are they for?
- [x] Feeding the main flow, for example a grill-with-docs session.
- [ ] Building from straight away, since no more planning is needed.
- [ ] Sending back to the studio owner as a second set of questions.
Why: What comes back is material for the main flow. In a grill-with-docs session, for example, the answers go into your plan.
```

```diagram
type: chain
caption: "grill the send, not the subject"
steps:
  - "Who is it going to?"
  - "What do you need back?"
  - label: "`to-questionnaire-<slug>.md`"
    note: "in the current folder"
  - label: "That person fills it in when they have time"
    note: "or you go through it together in a meeting"
  - "What comes back is material for the main flow"
groups:
  - from: 1
    to: 2
    label: "two things you can always answer"
```

## Going deeper

### Why it exists

A grilling session can stall because some of its questions aren't yours to answer. They belong to someone else: a client, an exec who owns the business rules, or a colleague on a team you don't sit with. Asking you more can't help, because you'd keep saying you don't know. Matt Pocock, who wrote the Skill, puts the problem this way: "not knowing the topic is why you're writing to someone else." So you use the Skill to pull those decisions out of the session and into a document.

```checkpoint quick-8
Why doesn't the Skill interview you about the subject?
- [x] You'd keep saying you don't know, and that's why you're writing to someone.
- [ ] The agent already knows the subject from the files in your repo.
- [ ] An interview on the subject would take too long, so the Skill skips it.
Why: Not knowing the topic is the reason you're writing to someone else, so questions about it would get nothing from you.
```

You could ask an agent for such a document with no Skill at all, and plenty of people did. The Skill buys two things. The interview never drifts onto the subject, and the document comes out in a shape a non-technical person can fill in. If you already have a format that works, you don't need the Skill.

```checkpoint quick-9
You could ask an agent for this document with no Skill. What does the Skill add?
- [x] An interview that stays off the subject, and a shape non-technical people can fill in.
- [ ] A way to send the document to that person, and a record of who has replied to it.
- [ ] A check of the answers that come back, and a new Issue opened for each of them.
Why: The Skill buys two things. The interview never drifts onto the subject, and the document comes out in a shape a non-technical person can fill in.
```

The Skill began in the `in-progress/` folder of Matt's repo, where Skills wait for testing. Its behaviour needed testing on "a few real sends". It has since moved up into the Productivity group, his set of general Skills that aren't specific to code.

Matt doesn't see the Skill as permanent. He calls it "a skill that I hope someday to delete". It's a patch, because agents are still hard to work on together with other people. Some teams have the agent in Slack, a team chat app, where people can answer questions together. Many people aren't set up that way, so a document they can pass to someone is useful.

### How it works underneath

Matt sorts [grill-me](/learn/grill-me), [grill-with-docs](/learn/grill-with-docs), `to-questionnaire` and [prototype](/learn/prototype) by one question: where are the answers? In that order, the answers are in your own head, in the codebase, in someone else's head, or in nobody's head yet. In that last case, the question needs something to react to. So where the answers are tells you which Skill to reach for.

```checkpoint quick-10
Nobody can answer until they have something to react to. Which Skill fits?
- [x] prototype, since the answers are in nobody's head yet.
- [ ] to-questionnaire, since the answers are in someone else's head.
- [ ] grill-me, since the answers are in your own head already.
Why: Where the answers are tells you which Skill to reach for. A question that needs something to react to has its answers in nobody's head yet.
```

```diagram
type: compare
caption: "where are the answers?"
columns: ["where are the answers?", "reach for"]
rows:
  - cells: ["your own head", "[grill-me](/learn/grill-me)"]
  - cells: ["the codebase", "[grill-with-docs](/learn/grill-with-docs)"]
  - cells: ["someone else's head", "`to-questionnaire`"]
  - cells: ["nobody's head yet", "[prototype](/learn/prototype)"]
```

So to-questionnaire is the opposite of grill-me, not grill-me with every question asked at once. grill-me already asks in rounds, and each round asks every question it can ask now, without guessing at answers it hasn't heard yet (what [grilling](/learn/grilling) calls the frontier). Matt's point is that the difference is "about whose head the answers are in, not how the questions are delivered."

```checkpoint quick-11
How does to-questionnaire differ from grill-me?
- [x] The answers come from someone else's head, not from yours.
- [ ] The questions come all at once, not one small batch at a time.
- [ ] The questions come from the codebase, not from the agent itself.
Why: grill-me already asks every question it can ask now, in each round. The difference is whose head the answers are in.
```

**The questions are a flat list,** grouped under headings by theme once there are more than a handful. It isn't a tree that skips a section because of an earlier answer. Grilling recomputes its next round from your answers. A branching document would have to plan every question before any answer comes back. That design was explored and did not ship. The fair objection to it: a model "that plans more than two or three questions ahead of a real answer plans badly".

Say the studio owner's first answer makes a later question pointless. That question still stays, because the file is static: it doesn't change as answers come in.

```checkpoint quick-12
The studio owner's first answer makes a later question pointless. What happens to that question?
- [x] It stays there, because the file doesn't change as answers come in.
- [ ] It's skipped, because the file hides sections as answers come in.
- [ ] It's removed, because the agent rewrites the file after each answer.
Why: The file is static, so it doesn't change as answers come in. Nothing skips a question because of an earlier answer.
```

**The document tells people to say when they don't know,** and it accepts partial answers. A flagged doubt is worth more than a guess. In Matt's words, "a vague answer and a confidently wrong one look identical once they're back in your context."

```checkpoint quick-13
The studio owner isn't sure how late a member should be able to cancel. What should they write?
- [x] That they don't know, since a guess would read like a firm answer later.
- [ ] Their best guess, since a firm answer is worth more than a flagged doubt.
- [ ] Nothing at all, since a blank makes the agent ask them once more.
Why: A flagged doubt is worth more than a guess. Back in your context, you can't tell a vague answer from a confidently wrong one.
```

### A real example

Matt built the Skill for himself. He was in a [wayfinder](/learn/wayfinder) session about building a garden office in his back garden. The agent was grilling him, "but the person to ask was my wife." She would use the room too, so they had to design it together.

```checkpoint quick-14
Why did Matt need a document during his garden office session?
- [x] The agent was grilling him, but the person to ask was his wife.
- [ ] The agent had run out of questions, so he needed a fresh list of them.
- [ ] His wife wanted a written report on what the agent had built so far.
Why: His wife would use the room too, so the decisions weren't his alone. The agent's questions had to reach her.
```

He had the agent turn what it was going to ask into a Markdown document. He put that into a Google Doc, and they went through it together. Then they "pulled the answers back in to the agent".

So the questions left the session, a person answered them, and the answers came back. That round trip is what the Skill is for.

### Where it goes wrong

**The document misses the questions your grilling raised.** You ran it in a fresh session. The Skill has no step that reads past sessions, so it knows nothing about the grilling. Run it in that same conversation, where the session is already in the [context window](/learn/context-window). If you can't, give the topic again when it asks what you need back.

```checkpoint quick-15
You grilled yesterday, and you start to-questionnaire in a fresh session today. What happens?
- [x] It knows nothing about the grilling, so you give the topic again.
- [ ] It finds yesterday's session, and pulls the open questions from it.
- [ ] It refuses to run until you've reopened yesterday's session.
Why: It has no step that reads past sessions. It can draw on a grilling only when you run it in that same conversation.
```

**The agent starts asking how your rules should work.** It should ask about the recipient (the person it's going to) and what you need back, then stop. If it asks about the subject itself, "the skill has gone wrong". Steer it back to those two questions.

**The questions read like your own notes.** Your open questions were copied down as they were, not aimed at what the recipient knows. In a run that's working, the answers that come back are "usable input for a new grilling round, rather than a fresh set of questions." Ask the agent to redraft the questions.

**You have three people to ask and one document.** One run makes one document for one person. The first step asks for the recipient, singular, and the whole document is pitched at them. So run it three times, once per person. A document that routes questions by role "did not ship".

```checkpoint quick-16
Three people each hold part of the answers. What do you do?
- [x] Run it three times, since one run makes one document for one person.
- [ ] Run it once, since it routes each question to the right person by role.
- [ ] Run it once, then send the same document to all three of them.
Why: The whole document is pitched at one recipient, so three people means three runs. A document that routes questions by role did not ship.
```

**The document never reached anyone.** The Skill sends nothing. It writes the file and tells you the path. Delivery is yours. Paste it into an Issue, drop it in a Slack thread, attach it to an email, or open it on a shared screen.

### Try it

Take the studio owner's questions out of your booking plan, and bring the answers back. You'll need your practice project, and a friend to play the studio owner. If you haven't set the project up, do the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. Open the `yoga-studio` repo in Claude Code.
2. Type `/grill-with-docs Plan the class booking rules.` You should see numbered questions.
3. Answer what you can, and note each question only the studio owner can answer, such as late cancellations.
4. In that same conversation, type `/to-questionnaire`. You should see it ask who the document is going to.
5. Describe the studio owner: not technical, and sets the rules. You should see it ask what you need back.
6. Name the two or three rules you can't decide, and say when you need the answers. You should see it report the file's path.
7. In a second terminal, in the `yoga-studio` folder, run `ls to-questionnaire-*.md`. You should see the new file.
8. Open the file, and check that every rule you named has a question.
9. Check that someone outside the conversation would know why they got it, and by when to reply.
10. Send the file to your friend, and ask them to fill it in.
11. If you closed Claude Code while you waited, start it again in the `yoga-studio` folder, type `/resume`, and pick the grilling conversation. ([The context window](/learn/context-window) covers `/resume`.)
12. Paste their answers into that conversation. You should see the agent carry on from them.

### Read more

- [The /to-questionnaire Skill](https://www.aihero.dev/skills-to-questionnaire), Matt Pocock, aihero.dev, updated 2026-08-24
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, aihero.dev, 2026-08-05
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, YouTube, 2026-08-05
- [Add to-questionnaire skill (in-progress) #572](https://github.com/mattpocock/skills/pull/572), Matt Pocock, GitHub, 2026-07-14

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint to-questionnaire-deeper-fresh-session
You grilled the booking rules for a yoga studio's site, closed that session, and the next day asked for a document of questions for the studio owner. The document misses the questions the grilling raised. Why?
- [x] It has no step that reads past sessions. It sees the grilling only if run in that same conversation.
- [ ] It only asks about the subject when you name each question, and you named none of them yesterday.
  > It never asks you about the subject. It asks who the document is for and what you need back.
- [ ] The document holds a handful of questions at most, so it dropped the ones the grilling raised.
  > There's no such cap. It groups the questions under headings by theme once there are more than a handful.
Why: The Skill has no step that reads past sessions. It can draw on a grilling only when you run it in that same conversation, where the session is already in the context window. In a fresh session, you give the topic again yourself.
```

```checkpoint to-questionnaire-deeper-two-people
Some of your open questions are for the studio owner, and others are for the payment provider's account manager. You ask for one document that sends each question to the right person, and the agent says it makes one document for one person. Why?
- [x] Step one asks for the recipient, singular, and the tone and context of the whole document are pitched at them.
- [ ] The agent can't tell which questions belong to which person until both have answered the first round.
  > It doesn't wait for rounds of answers. It asks you who the document is for before it writes anything.
- [ ] Questions for a payment provider belong in a background research task, never in a document of questions.
  > The account manager holds knowledge you lack, which is exactly what a questionnaire is for.
Why: The tone and context of the whole document are pitched at one person. So one run makes one document for one person, and if several people hold parts of the answer, you run it once per person. A document that routes questions by role was asked for but did not ship.
```

## Remember

```flashcards
Q: What does to-questionnaire create?
A: One Markdown file, `to-questionnaire-<slug>.md`, in the current folder.

Q: to-questionnaire grills the send, not the subject. What two things does it ask you?
A: Who the document is going to, and what you need back.

Q: When do you use to-questionnaire instead of grill-me?
A: When the knowledge you need is in someone else's head, not yours.

Q: Where did Matt first need to-questionnaire?
A: In a wayfinder session about a garden office. The agent was grilling him, but the person to ask was his wife.

Q: Matt sorts grill-me, grill-with-docs, to-questionnaire and prototype by one question. What is it?
A: Where are the answers? Your own head, the codebase, someone else's head, or nobody's head yet.

Q: Why does to-questionnaire's document ask for "I don't know" answers?
A: A vague answer and a confidently wrong one look identical once they're back in your context.
```

## Final test

```final-test to-questionnaire-what-it-asks
Before it writes anything, what does to-questionnaire ask you about?
- [x] Who the document is going to, and what you need back.
- [ ] The topic itself, round after round, until every question is settled.
- [ ] Which issue tracker the questions should be posted to.
Why: It grills the send, not the subject. Not knowing the subject is why you're writing to someone else, but you can always say who the document is for and what you need from them.
```

```final-test to-questionnaire-output
What does to-questionnaire create?
- [x] One Markdown file of questions, saved in the current folder.
- [ ] A GitHub Issue of questions, assigned to the person who will answer.
- [ ] A pull request that adds the questions to the repo's docs folder.
- [ ] A shared web form that collects each answer in a table.
Why: It writes one Markdown file in the current folder and tells you the path. It sends nothing anywhere, so getting the file to the person is up to you.
```

```final-test to-questionnaire-most-important-first
Why are the questions ordered most important first?
- [x] The person answers on their own time, so you may only get one pass.
- [ ] So the agent can finish interviewing you sooner and write the file.
- [ ] So the person can stop once they reach a question they can't answer.
Why: The person answers when they have time, and you may not get a second round with them. So the questions that matter most go first.
```

```final-test to-questionnaire-deeper-no-branching
Why are to-questionnaire's questions a flat list, with no section skipped because of an earlier answer?
- [x] A model plans badly more than two or three questions ahead, and a branching document must plan them all.
- [ ] Markdown files can't hold links between sections, so a branching document would break in a Google Doc.
- [ ] Matt wants the recipient to answer every question, so the agent can check that nothing was left blank.
Why: A document that skips sections has to plan every question before any answer comes back. A model that plans more than two or three questions ahead of a real answer plans badly. That's the fair objection to that design, which was explored and did not ship.
```

```final-test to-questionnaire-deeper-subject-warning
You run to-questionnaire, and it starts asking how your booking rules should handle late cancellations. What does that tell you?
- [x] The Skill has gone wrong. It should ask only about the recipient and what you need back, then stop asking.
- [ ] It's working. It collects your own view of each rule first, so the document can show it to the recipient.
- [ ] It's working. It checks which rules you can settle yourself, so only the rest go into the document.
Why: A good run asks about the recipient and about what you need back, then stops asking. You're writing to someone else because you can't answer for the subject, so a question about it means the Skill has gone wrong.
```

```final-test to-questionnaire-client-domain
You're moving a client's website to a new host next month. Only the client's IT lead knows how the domain, the email and the old server are set up. They're busy this week, but they've said they'll reply in writing when they can. Which fits best?
- [x] Write the IT lead a document of questions to fill in when they have time.
  > Right: that's `/to-questionnaire`.
- [ ] Get interviewed yourself about the move until every decision on it is settled.
  > That's `/grill-me`. It interviews you, and you can't answer these questions. The IT lead holds the facts.
- [ ] Send a background agent to read primary sources and write up the facts.
  > That's `/research`. The setup isn't written in any docs or code you can read. It's in the IT lead's head.
Why: The facts you need are in the IT lead's head, and they'll reply later in writing. So you want a document that one person fills in on their own time, and that's what a questionnaire is.
```

```final-test to-questionnaire-own-plan
You're sketching a plan for a FastAPI backend for a small booking site. There's no repo yet, and nobody else is involved: every choice is yours. You haven't thought the choices through yet. Which fits best?
- [x] Get interviewed about the plan, with nothing saved, until it's clear.
  > Right: that's `/grill-me`.
- [ ] Write a document of questions for someone to fill in later.
  > That's `/to-questionnaire`. It's for knowledge someone else holds. Here every decision is yours to make.
- [ ] Send a background agent to read primary sources and write up the facts.
  > That's `/research`. You don't need facts from docs. You need to make your own decisions.
Why: The decisions are yours, so the questions should come to you. There's no repo to save anything in, so an interview about the plan that saves nothing is the fit.
```

```final-test to-questionnaire-pooler-docs
Your Dockerised FastAPI app needs a Postgres connection pooler. Nobody on the team knows the options well, but each option has official docs. You want the facts written up, with sources, while you keep coding. Which fits best?
- [x] Send a background agent to read the docs and write up what it finds.
  > Right: that's `/research`.
- [ ] Write a teammate a document of questions to fill in about the poolers.
  > That's `/to-questionnaire`. Nobody on the team holds this knowledge. It's in the docs.
- [ ] Get interviewed about the pooler choice now, until it's settled.
  > That's `/grill-me`. It saves nothing, so you get no write-up with sources, and it stops to wait for your answers while you're trying to code.
Why: Nobody needs to be asked, because the facts are written down in official docs. A background agent can read them and leave a cited file while you carry on, and that file then feeds your thinking.
```

```final-test to-questionnaire-why-the-send
You want questions for a client about their old SQL database. The agent asks you only two things: who the document is for, and what you need back. It asks nothing about the database itself. Why?
- [x] You can always answer those two, and they aim the questions at the gap the client can fill.
- [ ] The agent already knows enough about the database, so it doesn't need your help with it.
  > It doesn't. The client holds that knowledge, which is why the document exists.
- [ ] To keep this first round short. The questions about the database come to you in a later round.
  > This interview is two exchanges, and then it stops. The database questions go to the client, in the document.
Why: The Skill grills the send, not the subject. You may not know the database, but you always know who the document is for and what you need. That's enough to aim the questions at what the client can fill in.
```

```final-test to-questionnaire-answers-back
Your client's ops lead has filled in and returned the document of questions you sent about their backups. You're working in the project's repo. What comes next?
- [x] Bring the answers to an interview that sharpens the plan and records its terms.
  > Right: that's `/grill-with-docs`.
- [ ] Have the agent build the backup feature straight from the answers, test-first, in one pass.
  > That's `/implement`. The answers aren't a plan or [Tickets](/learn/to-tickets) yet. They're material for planning, not a build order.
- [ ] Write the ops lead a second document of follow-up questions about their backups.
  > That's `/to-questionnaire`. You already have the answers you needed. Now they need to feed the plan.
Why: The answers unblock you, but they aren't a plan yet. So they're material for the main flow, and in a repo that flow starts with grill-with-docs.
```

```sources
- [to-questionnaire: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/to-questionnaire/SKILL.md), Matt Pocock's Skills
- [The /to-questionnaire Skill](https://www.aihero.dev/skills-to-questionnaire), Matt Pocock, 2026-08-05
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [mattpocock/skills README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock, 2026-10-29
- [Add to-questionnaire skill (in-progress) #572](https://github.com/mattpocock/skills/pull/572), Matt Pocock (mattpocock), 2026-07-14
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [research: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/research/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
```
