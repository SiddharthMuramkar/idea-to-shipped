---
title: Answers only other people have
slug: answers-from-other-people
summary: Tell an other-person question from the other kinds of "I don't know", turn it into a questionnaire, and leave the map honestly waiting instead of guessing.
---

Some tickets can't be settled by you or by the agent, because the answer is in somebody else's head. Say the rebuild needs the studio owner's refund rules, and they're busy all week. The tempting move is to let the agent fill in something sensible. Don't: write that person a questionnaire, make the wait visible on the map, and keep working.

```goals
- You'll be able to tell a question only another person can answer from a fact or a decision of your own.
- You'll be able to work out whom to ask first, when the people who hold the answers haven't been named yet.
- You'll be able to turn an other-person question into a questionnaire in one short session.
- You'll be able to leave the map honestly waiting on the answers instead of quietly guessing them.
```

## Three kinds of "I don't know"

In [Your first wayfinder session](/learn/wayfinder-first-session) you saw that "I don't know" is a fine answer while charting. That's true, but it hides three different situations.

**Every "I don't know" is one of three kinds, and each goes somewhere different: a fact to the agent, a decision of yours to a grilling ticket, and someone else's knowledge to `/to-questionnaire`.**

A fact you don't know is the agent's job: it looks it up, or it becomes a research ticket. A decision you haven't made yet is yours, and a grilling ticket helps you make it. The third kind is what's left: the answer exists, or should exist, but only in someone else's head.

| Kind of unknown | Where it goes | Example from the rebuild |
|---|---|---|
| A fact | The agent, or a research ticket | What the old booking tool's export holds |
| A decision that's yours | A grilling ticket, settled with you live | Should the old booking tool stay on for the teachers' timetables? |
| Someone else's knowledge or call | `/to-questionnaire` | How late a member can cancel and still get the class back; who pays the payment service's monthly fee |

```callout remember
Every "I don't know" is one of three kinds, and each goes somewhere different: a fact goes to the agent or a research ticket, a decision that's yours goes to a grilling ticket, and someone else's knowledge or call goes to `/to-questionnaire`.
```

```checkpoint check-1
Halfway through a grilling, the agent asks you for a fact it could look up itself. What does the grilling Skill say about that?
- [ ] You should answer it from memory
- [ ] It becomes a decision for you to make
- [x] Finding it is the agent's job
- [ ] It goes straight into a questionnaire
Why: The grilling Skill says finding facts is the agent's job, never yours: it looks the fact up, or the fact becomes a research ticket. Only decisions are put to you.
```

```checkpoint check-2
What makes the third kind of unknown different from a decision you haven't made yet?
- [x] The answer lives in someone else's head
- [ ] The agent can look it up online
- [ ] It matters less to the overall plan
- [ ] Only the agent can settle it live
Why: A decision is yours, and a grilling ticket helps you make it. The third kind exists, or should exist, only in someone else's head, so neither you nor the agent can settle it. Looking things up is for facts.
```

## Who those people are on the rebuild

Say your notes for the rebuild already say whose call each kind of answer is. They name four roles, and two of them are still empty:

| Role | Who | Owns |
|---|---|---|
| Studio owner | Named: the person who hired you | Prices, refund and cancellation rules, launch sign-off |
| Developer | You | Design, build, testing, deployment |
| Bookkeeper | Not named yet | Tax on passes, payouts, how refunds show in the accounts |
| Front-desk lead | Not named yet | How bookings, passes and cash work at the desk each day |

Now look at what that means for the order of work. Several open questions are marked "(Bookkeeper)": how tax applies to class passes, when the studio gets paid out, and how a refund shows up in the accounts. They all go to the bookkeeper, but nobody has said who that is.

So before anyone can answer them, someone has to name the people. That's a real blocking chain, and it tells you what your first questionnaire should be: a short one to the studio owner, asking who fills each empty role.

```callout remember
Every question marked "(Bookkeeper)" goes to the bookkeeper, and nobody holds that role yet. So the first thing to ask the studio owner isn't those questions themselves, but who fills each empty role.
```

```checkpoint check-3
Your notes mark "how tax applies to class passes" as a "(Bookkeeper)" question. Why can't anyone answer it yet?
- [ ] You, the developer, have to decide it first
- [ ] The front-desk lead owns that one instead
- [ ] The studio owner answers it instead
- [x] No bookkeeper has been named yet
Why: "(Bookkeeper)" questions go to the bookkeeper, and the Roles table still says that role isn't named. It isn't yours to decide, and by the table the front-desk lead owns the desk's daily work, while the studio owner owns prices and refund rules.
```

```checkpoint check-4
Someone needs to say how a refund should show up in the studio's accounts. By the Roles table, whose call is that?
- [ ] The studio owner
- [x] The bookkeeper
- [ ] The front-desk lead
- [ ] You, the developer
Why: The bookkeeper owns tax, payouts and how refunds show in the accounts. The studio owner owns the refund rules themselves, prices and launch sign-off; the front-desk lead owns how the desk works each day.
```

```checkpoint check-5
Given the blocking chain in your notes, which questionnaire should you write first?
- [ ] How tax applies to passes, to the bookkeeper
- [ ] How refunds work today, to the front-desk lead
- [x] Who fills each role, to the studio owner
- [ ] Which payment service to use, to the bookkeeper
Why: Neither empty role has been named yet, so questions meant for those people have nobody to go to. Which payment service to use is your own decision, a grilling ticket. The first questionnaire goes to the studio owner and asks who fills each role.
```

## Why not let the agent guess?

The tempting shortcut is to ask the agent for "sensible defaults" and move on. Wayfinder rules that out for anything a person has to speak for. A ticket worked with a human only resolves when that human answers. An agent that fills in the human's side has broken the ticket, however plausible its answer sounds.

The rebuild adds a second reason. A refund rule is a promise the studio makes to its members, and it costs money when it's wrong. Those rules belong to the studio owner, not to you and not to an agent. A guessed rule, such as "full refund up to two hours before class", would put words in the studio owner's mouth, on a page members pay through.

Say your notes even plan for a studio owner who never replies: the new system copies today's front-desk rules exactly, and nothing new is invented. Notice that this fallback still needs the rules to be written down somewhere. In the export example in [Working the map](/learn/working-the-map), refunds showed up only as notes on cash payments, so even the fallback depends on getting answers from people.

```callout remember
Never let the agent fill in a person's side of a question. However plausible its answer sounds, it breaks the ticket, and on the rebuild a guessed refund rule would put words in the studio owner's mouth, on a page members pay through.
```

```checkpoint check-6
Planning stalls on how late a member can cancel, so you ask the agent for "sensible defaults" and move on. What has happened to the ticket?
- [ ] It's resolved, with a reasonable placeholder for now
- [x] It's broken: the agent spoke for the studio owner
- [ ] It's fine until the studio owner objects to it
- [ ] It has quietly turned into a research ticket
Why: A ticket worked with a human resolves only when that human answers. An agent that fills in the human's side has broken it, however plausible the answer sounds. A cancellation rule isn't a fact to research either: it belongs to the studio owner.
```

```checkpoint check-7
If the studio owner never replies, your notes say the new system copies today's front-desk rules exactly. Why does even that fallback depend on answers from people?
- [ ] The agent may not copy rules from the old tool
- [ ] The fallback needs the studio owner to pay for it
- [ ] Only the bookkeeper may write the tests for it
- [x] Today's refund rules aren't written down anywhere
Why: The fallback copies the rules as they are, so they have to be written down somewhere. The export research found refunds recorded only as notes on cash payments, so someone who knows the rules still has to say what they are.
```

## The move: grill the send, not the subject

[to-questionnaire](/learn/to-questionnaire) is the inverse of a grilling. A grilling interviews you about the subject. This Skill can't, because you're the one who doesn't know the subject. Instead it asks you only two things you can always answer, and aims the questions in the document at the gap between what the other person knows and what you need.

1. **Start it.** You type `/to-questionnaire`, best in the same session where the question came up, so the agent already knows the background.
2. **Who is it going to?** One exchange: their role, their expertise, and how they relate to you. That sets the tone, and how much background the document has to carry.
3. **What do you need back?** One exchange: the specific decisions or facts you must walk away able to make. Every item you name here gets at least one question.
4. **One Markdown file.** It writes `to-questionnaire-<slug>.md` in the folder you're working in, tells you the path, and stops. Sending the file is up to you.

Two practical points from Matt's write-up. The most common moment to use it is in the middle of a grilling that stalls because part of what came up isn't yours to answer. Type `/to-questionnaire` right there, in the same session, so the draft can draw on everything already said. And it sends nothing: no email, no Slack message. You paste the file into an email or a ticket, share it on screen in a meeting, or print it.

```callout remember
Run `/to-questionnaire` in the session where the question came up. It asks only who the document is for and what you need back, aims its questions at the gap between what that person knows and what you need, writes one Markdown file, and stops.
```

```checkpoint check-8
A grilling on class passes stalls, because the refund rules aren't yours to settle. Why type `/to-questionnaire` right there, rather than in a fresh session?
- [x] The draft can use everything already said
- [ ] A fresh session can't run the Skill at all
- [ ] It sends sooner from a session that's busy
- [ ] The map allows only one session per ticket
Why: In the same session the agent already knows the background, so the draft draws on everything already said. Nothing stops a fresh session running it, and the Skill never sends anything itself.
```

```checkpoint check-9
Asked what you need back, you name three things: the cancellation deadline, the refund for an unused pass, and what happens when a membership is paused. What does that guarantee about the document?
- [ ] The studio owner will answer all three
- [ ] It is split into three separate files
- [x] Each item gets at least one question
- [ ] The agent researches all three first
Why: Every item you name as needed back gets at least one question. It's still one Markdown file, and nothing guarantees the studio owner answers; the questions are aimed at what only they know.
```

```checkpoint check-10
You tell the Skill the questionnaire is for the studio owner, who isn't technical. What does that answer shape?
- [ ] The order of the question themes
- [ ] Whether the Skill sends it itself
- [ ] The file's name and its folder
- [x] Its tone, and how much background
Why: Who it's going to (their role, their expertise, how they relate to you) sets the tone and how much background the document carries. The file always lands in the folder you're working in, and sending it is yours.
```

## What you send

The document always has the same shape, built for someone who wasn't in your head and may only read it once. Two habits make it work. The most important question goes first, because the person may answer only the top of it. And each question asks exactly one thing, because "Who signs off, and when?" invites an answer to half of it.

```text
# <Title>
**Purpose:** why it exists, and the decision riding on it
**From / To / How your answers will be used**
## Context          one paragraph, enough to answer well
## How to answer    deadline, effort; partial answers and "I don't know" are useful
## <Theme>          questions, most important first, one idea each
### <Question>
_Why this matters: …_   only where it could be misread or invite a throwaway answer
>                       an empty space to answer under
## Anything else?
```

Here is the shape filled in for the questionnaire you need first. It's an example written by hand, not the Skill's exact output:

```text
# Who looks after the money and the front desk

**Purpose:** to know who owns tax and payouts, and who runs the front
desk, so planning the new payments can continue.

**From:** you (the developer), **To:** the studio owner,
**How your answers will be used:** they fill the Roles table in the
rebuild notes.

## Context
The studio's bookings and payments are moving onto the new site.
Several decisions belong to people the plan hasn't named yet, and
planning is waiting on them.

## How to answer
By <date>, about ten minutes. Partial answers and "I don't know"
are useful.

## People
### Who will look after the studio's tax and payouts?
_Why this matters: every question marked "(Bookkeeper)" in the plan
goes to this person._
>

### Who will run the front desk day to day after launch?
>

### Does one person hold both of these roles?
>

## Anything else?
>
```

```callout remember
Write for someone who may read once, and maybe only the top: most important question first, one idea per question, and space to answer under each. Tell them that partial answers and "I don't know" are useful.
```

```checkpoint check-11
A draft question reads: "Who signs off the new prices, and by when?" What's wrong with it?
- [ ] It belongs under the Anything else heading
- [x] It asks two things in one question
- [ ] It needs a "Why this matters" note
- [ ] It's too short to be useful
Why: Each question should be one idea. A compound question invites an answer to half of it, so split it into two. A "Why this matters" line is only for a question that could be misread or invite a throwaway answer.
```

```checkpoint check-12
The studio owner may only read the top of your questionnaire, once. Which habit protects you most?
- [ ] Adding a why-note to every question
- [ ] Keeping every question under one theme
- [ ] Leaving the Context part out entirely
- [x] Putting the most important question first
Why: The person answers on their own time, so you may only get one pass, and the questions go most important first. Dropping the Context paragraph would leave the reader without enough background to answer well.
```

```checkpoint check-13
When does a question in the document get a "Why this matters" line?
- [x] Only where it could be misread or invite a throwaway answer
- [ ] On every question in the document, so nothing is unclear
- [ ] Only on the very first question, since it matters most
- [ ] Only when the deadline is close, to hurry the reply
Why: The template adds it only where a question could be misread or invite a throwaway answer, as with the example's first question about tax and payouts. The other two questions in the example are clear without one.
```

## Make the wait visible on the map

Sending a questionnaire settles nothing yet, so the map has to show that something is waiting, or a later session will quietly guess. The cleanest way is to make getting the answers its own **task** ticket. A task is the one type that does rather than decides, and collecting answers from a person is that kind of work. Any decision that needs those answers is wired as blocked by the task.

[Working the map](/learn/working-the-map) ended with such a ticket: "Get the studio owner's refund and cancellation rules for each pass that moves across", blocked by "Which passes and memberships move across?". Once that grilling is settled, the task reaches the frontier. In the session that claims it, you type `/to-questionnaire`, and the session links the file and notes the date. Then it stops, with the ticket still claimed:

```text
Get the studio owner's refund and cancellation rules for each
pass that moves across #27
Label:      wayfinder:task
Assignee:   you (the claim)
Blocked by: #26 (closed)

## Question
For each pass chosen in "Which passes and memberships move across?",
get its refund and cancellation rules from the studio owner.

Comment:
  <date>: questionnaire sent to the studio owner; file linked here.
```

- **While you wait,** work the rest of the frontier as normal. A claimed ticket is skipped by every other session, and everything blocked by it waits.
- **When the answers come back,** start a session that names the task ticket. It records the facts in a resolution comment, closes the ticket, adds the map line, and stops. The answers are material, not a verdict: any decision built on them is settled in its own session, once its ticket reaches the frontier.
- **If a grilling ticket stalls halfway,** type `/to-questionnaire` in that session. Ask the agent to add a task ticket for collecting the answers, and to block the stalled ticket on it. Then unassign the stalled ticket, so it comes back to the frontier when the answers do.

How these pieces fit together is a suggestion: neither Skill spells it out. Each piece comes from wayfinder's own rules. A task records what was done and the facts it produced, files made along the way are linked from the ticket rather than pasted in, and an open ticket with no assignee is unclaimed.

```callout remember
Sending a questionnaire settles nothing, so make collecting the answers its own task ticket. It stays claimed while you wait, and every decision that needs the answers is blocked by it, so no later session can quietly guess.
```

```checkpoint check-14
Why is collecting the studio owner's answers a _task_ ticket rather than a grilling ticket?
- [ ] Grilling tickets can't be blocked by anything
- [ ] Task tickets stay hidden from the map
- [x] A task does work rather than decides
- [ ] Only a task ticket can link to a file
Why: A task is the one ticket type that does rather than decides, and collecting answers from a person is work. The decision that needs those answers stays a separate ticket, blocked by the task.
```

```checkpoint check-15
Mid-grilling, part of a ticket turns out to be the studio owner's call. You run `/to-questionnaire`. What should happen to the stalled ticket?
- [x] It's blocked on a new task, and unassigned
- [ ] It's resolved now with the agent's best guess
- [ ] It stays assigned to this session until answered
- [ ] It's deleted, and a fresh one is written later
Why: Have the agent add a task ticket for collecting the answers, block the stalled ticket on it, and unassign it, so it returns to the frontier when the answers do. That last step is a suggestion, not part of either Skill; left claimed, every other session would skip it.
```

```checkpoint check-16
The session working the refund-rules task has written the questionnaire file. How does the file get onto the ticket?
- [ ] Pasted in full as its resolution comment
- [x] Linked from the ticket, with the date
- [ ] Copied into the map as one of its Notes
- [ ] Kept only in the agent's session memory
Why: Files made while resolving a ticket are linked from it, not pasted in. The session links the file, notes the date, and stops with the ticket still claimed. The resolution comment is for the facts, once they come back.
```

## Try it: your first questionnaire

````try
This one doesn't need the map, so you can send it today. You'll need the `yoga-studio` practice project, and a friend to play the studio owner.

1. In the `yoga-studio` folder, start Claude Code and type `/clear`.
2. Type `/to-questionnaire`. You should see it ask who the document is going to.
3. Describe the recipient, for example: _the studio owner, who hired me; not technical; knows the studio and who should own what._ You should see it ask what you need back.
4. Name what you need, for example: _the names and contact details of the bookkeeper and the front-desk lead, and whether one person holds both roles._ You should see it report the file's path.
5. In a second terminal, in the same folder, run `ls to-questionnaire-*.md`. You should see the new file.
6. Open it. Check that every item you named has a question, most important first, and that someone outside the conversation would know why they got it and by when to reply.
7. Send it to your friend, and ask them to fill it in.
8. If your map exists, add a task ticket for collecting the answers, assign it to yourself, link the file from it, and block the "(Bookkeeper)" questions on it. If it doesn't exist yet, mention at charting that this questionnaire is already out.
````

```callout watch-out
One questionnaire goes to one person. If two people each hold part of an answer, write two, each aimed at what that person knows.
```

For how task tickets fit among the others, watch the chapter at 7:40 (ticket types and blocking) of Matt's [wayfinder walkthrough](https://www.youtube.com/watch?v=F3lL98Pj90o).

## Practice

### Who holds the answer?

For each question about the rebuild, pick who can settle it.

```checkpoint holds-export-help
What do the old booking tool's help pages say about exporting past bookings?
- [x] The agent finds it
- [ ] You decide it
- [ ] Another person knows
Why: A fact the agent can look up on its own, as a research ticket.
```

```checkpoint holds-cancel-deadline
How late can a member cancel and still get the class back?
- [ ] The agent finds it
- [ ] You decide it
- [x] Another person knows
Why: A business rule the studio owner sets. Nothing public or in the repo records it, so it goes in a questionnaire.
```

```checkpoint holds-old-tool
Should the old booking tool stay on for the teachers' timetables, or go entirely?
- [ ] The agent finds it
- [x] You decide it
- [ ] Another person knows
Why: Your decision as the developer, settled in a grilling ticket. It waits on who handles refunds after launch, but the call itself is yours.
```

```checkpoint holds-monthly-fee
Who will pay the payment service's monthly fee after launch?
- [ ] The agent finds it
- [ ] You decide it
- [x] Another person knows
Why: The studio owner owns prices and approvals, so it's theirs to answer.
```

```checkpoint holds-booking-form
What does the current booking page ask a member to fill in?
- [x] The agent finds it
- [ ] You decide it
- [ ] Another person knows
Why: A fact the agent can find for itself, by looking at the live page.
```

```checkpoint holds-checkout-look
What should the checkout page look like on a phone?
- [ ] The agent finds it
- [x] You decide it
- [ ] Another person knows
Why: Yours to decide, best by reacting to a prototype the agent makes.
```

```checkpoint holds-refunds-accounts
How must refunds show up in the studio's accounts?
- [ ] The agent finds it
- [ ] You decide it
- [x] Another person knows
Why: The bookkeeper owns how refunds show in the accounts, so it waits until the studio owner names one.
```

## Remember

```flashcards
Q: What are the three kinds of "I don't know", and where does each go?
A: A fact goes to the agent or a research ticket. A decision that's yours goes to a grilling ticket. Someone else's knowledge or call goes to `/to-questionnaire`.

Q: The people who hold some answers haven't been named. What do you ask first?
A: Who fills each role, sent to the person who can name them. The questions meant for those people wait on that answer.

Q: Why must the agent never fill in a person's side of a ticket?
A: A HITL ticket only resolves when that human answers. An agent that speaks for them has broken the ticket, however plausible its answer sounds.

Q: to-questionnaire grills the send, not the subject. What does it ask you?
A: Who the document is going to, and what you need back. Then it writes one Markdown file in the current folder, and stops. It sends nothing.

Q: What two habits make a questionnaire work for someone who reads it once?
A: The most important question goes first, and every question asks exactly one thing.

Q: How do you keep the map honest while the answers are out?
A: Make collecting them a task ticket, claimed and linked to the file. Every decision that needs the answers is blocked by it, and the rest of the frontier carries on.
```

## Final test

```final-test what-it-asks-you
What does `/to-questionnaire` interview you about?
- [ ] The subject you don't know about
- [x] Who it's for, and what you need back
- [ ] Your own answer to every open question
- [ ] Which tracker the answers should go to
Why: It grills the send, not the subject: who the document goes to, and what you need back.
```

```final-test does-it-send
Does `/to-questionnaire` send the document to the person?
- [ ] Yes, by email, to an address you give it
- [ ] Yes, it posts it in a Slack thread
- [x] No: it only writes a file
- [ ] Only once the map is clear
Why: It writes a Markdown file in the current folder and tells you the path. Delivery is yours.
```

```final-test heard-nothing
You sent the studio owner a questionnaire and have heard nothing. What happens to the decision that needs it?
- [x] It stays blocked, and other tickets carry on
- [ ] The agent fills in plausible answers for now
- [ ] You settle it yourself on educated guesses
- [ ] Every other ticket stops until they reply
Why: The decision waits on the task ticket, and the rest of the frontier carries on in its own sessions. Nobody guesses.
```

```final-test answers-come-back
The studio owner's answers come back. What happens next?
- [ ] Paste them into the map's Notes
- [ ] Send a second questionnaire at once
- [ ] Turn them straight into an ADR
- [x] A session records them on the task ticket and closes it
Why: A session that names the task records the facts and closes it. Decisions built on those facts get their own sessions.
```

```final-test owner-never-replies
Your notes plan for a studio owner who never replies. What happens to the rules for passes and refunds then?
- [ ] They're quietly dropped before launch
- [ ] You, the developer, write new ones
- [x] Today's rules are copied exactly, with nothing invented
- [ ] The agent looks up typical studio rules online
Why: The fallback copies the rules as they are today, so nothing is guessed. It still needs those rules to be written down somewhere, which is why even the fallback depends on asking people.
```

```final-test sort-refund-rules
While charting, this comes up: get the studio owner's refund rules for 10-class passes. Where does it go?
- [ ] A research ticket
- [ ] A grilling ticket
- [x] A task ticket
- [ ] The Out of scope part
Why: Only a person knows them. Collecting answers from a person is work rather than a decision, so it's a task: you send a `/to-questionnaire`, and any decision that needs the rules is blocked by the task.
```

```final-test agent-offers-default
In the grilling ticket on which passes move across, the agent says: "I'll pick a sensible cancellation deadline, two hours before class, so we can move on." What should happen?
- [ ] Accept it, so the ticket resolves today
- [ ] Keep it, recorded in a new ADR
- [x] Refuse, and ask the studio owner for it
- [ ] Hand it to a research ticket instead
Why: Cancellation rules belong to the studio owner, and an agent that fills in a person's side breaks the ticket, however plausible its rule sounds. The deadline isn't a fact to look up, and an ADR doesn't make a guess right. Collecting it is a task, with `/to-questionnaire`.
```

```final-test frontier-while-waiting
Your map reads: #21 and #24 closed · #22 task, claimed, its questionnaire out to the studio owner · #23 grilling, blocked by #22 · #25 grilling, open · #26 prototype, open. You start a session without naming a ticket. What happens?
- [ ] It waits until the studio owner's answers arrive
- [ ] It settles #23 with the agent's best guess
- [x] It takes #25, the first ticket on the frontier
- [ ] It takes #22 and chases the studio owner
Why: A claimed ticket is skipped by every other session, and everything blocked by it waits, but the rest of the frontier carries on as normal. #25 and #26 are both open, unblocked and unclaimed, so the first in map order goes first. Nobody guesses #23's answer.
```

```sources
- [to-questionnaire: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/to-questionnaire/SKILL.md), Matt Pocock's Skills
- [The /to-questionnaire Skill](https://www.aihero.dev/skills-to-questionnaire), Matt Pocock
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [The /wayfinder Skill](https://www.aihero.dev/skills-wayfinder), Matt Pocock, updated 2026-08-24
- [/wayfinder: Nothing is too big to plan anymore](https://www.youtube.com/watch?v=F3lL98Pj90o), Matt Pocock, 2026-07-30
```
