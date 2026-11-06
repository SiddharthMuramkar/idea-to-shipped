---
title: Answers only other people have
slug: answers-from-other-people
summary: Tell an other-person question from the other two kinds, turn it into a questionnaire in one short session, and leave the map honestly waiting instead of quietly guessing.
---

Some tickets can’t be settled by you or by the agent, because the answer is in somebody else’s head. Don’t guess it. Write that person a questionnaire, make the wait visible on the map, and keep working.

```goals
- You’ll be able to tell an other-person question from the other two kinds, turn it into a questionnaire in one short session, and leave the map honestly waiting instead of quietly guessing.
```

## Three kinds of “I don’t know”

In Lesson 1 you learned that “I don’t know” is a fine answer while charting. That’s true, but it hides three different situations, and each one goes somewhere different. A fact you don’t know is the agent’s job: it looks it up, or it becomes a research ticket. A decision you haven’t made yet is yours, and a grilling ticket helps you make it. The third kind is the one this lesson is about: the answer exists, or should exist, but only in someone else’s head.

| Kind of unknown | Where it goes | Care4Mind example |
|---|---|---|
| A fact | The agent, or a research ticket | What web archives still hold of the old questionnaire app |
| A decision that is yours | A grilling ticket, settled with you live | Should WordPress stay on as the content back end? |
| Someone else’s knowledge or call | `/to-questionnaire`, this lesson | The result bands for the Triguna Profile Questionnaire; who pays for hosting after launch |

```callout remember
Every “I don’t know” is one of three kinds, and each goes somewhere different: a fact goes to the agent or a research ticket, a decision that’s yours goes to a grilling ticket, and someone else’s knowledge or call goes to `/to-questionnaire`.
```

```checkpoint check-1
Halfway through a grilling, the agent asks you for a fact it could look up itself. What does the grilling skill say about that?
- [ ] You should answer it from memory
- [ ] It becomes a decision for you
- [x] Finding it is the agent’s job
- [ ] It goes straight into a questionnaire
Why: The grilling skill says finding facts is the agent’s job, never yours: it looks the fact up, or the fact becomes a research ticket. Only decisions are put to you.
```

```checkpoint check-2
What makes the third kind of unknown different from a decision you haven’t made yet?
- [x] The answer lives in someone else’s head
- [ ] The agent can look it up online
- [ ] It matters less to the overall plan
- [ ] Only the agent can settle it live
Why: A decision is yours, and a grilling ticket helps you make it. The third kind exists, or should exist, only in someone else’s head, so neither you nor the agent can settle it. Looking things up is for facts.
```

## Who those people are on Care4Mind

Your brief already says whose call each kind of answer is. It names four roles, and three of them are still empty:

| Role | Who | Owns |
|---|---|---|
| Project owner | TBD (client) | Priorities, approvals, launch sign-off |
| Developer | You | Design, build, testing, deployment, documentation |
| Psychology expert | TBD (client) | Questionnaire scoring, interpretation and limitations |
| Research editor | TBD (client) | Source checking, References, taxonomy review |

Now look at what that means for the order of work. Several open questions are marked “(Client)”: who runs the site after launch, privacy and consent for Questionnaires, and who controls the domain. All of them go to the Project owner, but there is no Project owner yet. So before anyone can answer them, someone has to name the people. That is a real blocking chain, and it tells you what your first questionnaire should be: a short one to your contact at the client, asking who fills each role.

```callout remember
Every question marked “(Client)” goes to the Project owner, and nobody holds that role yet. So the first thing to ask the client isn’t those questions themselves, but who fills each role.
```

```checkpoint check-3
The brief marks “who controls the domain” as a “(Client)” question. Why can’t anyone answer it yet?
- [ ] The developer has to decide it first
- [ ] Domains are a fact for the agent
- [ ] The Research editor owns that one instead
- [x] No Project owner has been named yet
Why: “(Client)” questions go to the Project owner, and the Roles table still says TBD for that role. It isn’t yours to decide, and the Research editor owns sources and References, not the domain.
```

```checkpoint check-4
Someone needs to confirm that a source listed in Care4Mind’s References is accurate. By the Roles table, whose call is that?
- [ ] The Psychology expert
- [x] The Research editor
- [ ] The Project owner
- [ ] You, the developer
Why: The Research editor owns source checking, References and taxonomy review. The Psychology expert owns Questionnaire scoring and interpretation; the Project owner owns priorities, approvals and launch sign-off.
```

```checkpoint check-5
Given the blocking chain in the brief, which questionnaire should you write first?
- [ ] Each Questionnaire’s scoring rules, to the Psychology expert
- [ ] Who pays for hosting, to the Project owner
- [x] Who fills each role, to your client contact
- [ ] Who controls the domain, to the Research editor
Why: None of the three client roles has been named yet, so questions meant for those people have nobody to go to (and the domain is a “(Client)” question for the Project owner, not the Research editor). The first questionnaire goes to your contact at the client and asks who fills each role.
```

## Why not let the agent guess?

The tempting shortcut is to ask the agent for “sensible defaults” and move on. Wayfinder rules that out for anything a person has to speak for. A ticket worked with a human only resolves when that human actually answers, and an agent that fills in the human’s side has broken the ticket, however plausible its answer sounds.

Your brief adds a second reason, specific to Care4Mind. A Questionnaire’s result has to come from its _documented_ scoring rules, and those rules belong to the Psychology expert, not to you and not to an agent. A guessed cut-off between “High” and “Moderate” would put words in a psychologist’s mouth on a public website.

The brief even plans for the person who never turns up. If no Psychology expert is named in time, an in-scope Questionnaire is rebuilt to match its current scoring exactly, and the site says plainly that nobody has reviewed it. Notice that this fallback still needs the scoring to be documented. In Lesson 3’s example, the public pages turned out to give no cut-offs for most Questionnaires, so even the fallback depends on getting answers from people.

```callout remember
Never let the agent fill in a person’s side of a question. However plausible its answer sounds, it breaks the ticket, and on Care4Mind a guessed cut-off would put words in a psychologist’s mouth on a public website.
```

```checkpoint check-6
Planning stalls on the Triguna result bands, so you ask the agent for “sensible defaults” and move on. What has happened to the ticket?
- [ ] It’s resolved, with a reasonable placeholder for now
- [x] It’s broken: the agent spoke for the expert
- [ ] It’s fine until the expert objects to it
- [ ] It quietly turns into a research ticket instead
Why: A ticket worked with a human resolves only when that human answers. An agent that fills in the human’s side has broken it, however plausible the answer sounds. Result bands aren’t a fact to research either: they belong to the Psychology expert.
```

```checkpoint check-7
If no Psychology expert is named in time, a Questionnaire is rebuilt to match its current scoring. Why does even that fallback depend on answers from people?
- [ ] The agent may not rebuild a Questionnaire
- [ ] The fallback needs the client to pay
- [ ] Only experts are allowed to write tests
- [x] Most public pages don’t give the cut-offs
Why: The fallback rebuilds the scoring as documented, so the scoring has to be documented somewhere. Lesson 3 found the public pages give no cut-offs for most Questionnaires, so someone who knows them still has to say what they are.
```

## The move: grill the send, not the subject

`/to-questionnaire` is the inverse of a grilling. A grilling interviews you about the subject. This skill can’t do that, because you are the one who doesn’t know the subject. Instead it asks you only two things you can always answer, and aims the questions in the document at the gap between what the other person knows and what you need.

1. **Start it** (You type): `/to-questionnaire`
   - Best typed in the same session where the question came up, so the agent already knows the background.
2. **Who is it going to?** (One exchange)
   - Their role, their expertise, and how they relate to you. That sets the tone, and how much background the document has to carry.
3. **What do you need back?** (One exchange)
   - The specific decisions or facts you must walk away able to make. Every item you name here gets at least one question.
4. **One Markdown file** (It writes): `to-questionnaire-<slug>.md`
   - Saved in the folder you’re working in, and it tells you the path. Then it stops. Sending the file is up to you.

Two practical points from Matt’s write-up. The most common moment to use it is in the middle of a grilling that stalls because part of what came up isn’t yours to answer. Type `/to-questionnaire` right there, in the same session, so the draft can draw on everything already said. And it sends nothing: no email, no Slack message. You paste the file into an email, share it on screen in a meeting, or print it.

```callout remember
Run `/to-questionnaire` in the session where the question came up. It asks only who the document is for and what you need back, aims its questions at the gap between what that person knows and what you need, writes one Markdown file, and stops.
```

```checkpoint check-8
A grilling on the Questionnaires stalls because the scoring isn’t yours to settle. Why type `/to-questionnaire` right there rather than in a fresh session?
- [x] The draft can use everything already said
- [ ] A fresh session can’t run the skill
- [ ] It sends sooner from a busy session
- [ ] The map allows one session per ticket
Why: In the same session the agent already knows the background, so the draft draws on everything already said. Nothing stops a fresh session running it, and the skill never sends anything itself.
```

```checkpoint check-9
Asked what you need back, you name three things: scoring rules, result bands and stated limitations. What does that guarantee about the document?
- [ ] The expert will answer all three items
- [ ] It is split into three separate files
- [x] Each item gets at least one question
- [ ] The agent researches all three items first
Why: Every item you name as needed back gets at least one question. It’s still one Markdown file, and nothing guarantees the expert answers; the questions are aimed at what only the expert knows.
```

```checkpoint check-10
You tell the skill the questionnaire is for a non-technical contact at the client. What does that answer shape?
- [ ] The order of the question themes
- [ ] Whether the skill sends it itself
- [ ] The file’s name and its folder
- [x] Its tone and how much background
Why: Who it’s going to (their role, their expertise, how they relate to you) sets the tone and how much background the document carries. The file always lands in the folder you’re working in, and sending it is yours.
```

## What you send

The document always has the same shape, built for someone who wasn’t in your head and may only read it once. Two habits make it work. The most important question goes first, because the person may answer only the top of it. And each question asks exactly one thing, because “Who signs off, and when?” invites an answer to half of it.

```text
# <Title>
**Purpose:** why it exists and the decision riding on it
**From / To / How your answers will be used**
## Context          one paragraph, enough to answer well
## How to answer    deadline, effort; partial answers and “I don’t know” are useful
## <Theme>          questions, most important first, one idea each
### <Question>
_Why this matters: …_   only where the question could be misread
>                       an empty space to answer under
## Anything else?
```

Here is the shape filled in for the questionnaire you need first. It’s an example written by hand, not the skill’s exact output:

```text
# Who decides what on the Care4Mind rebuild

**Purpose:** to know who approves the plan, who owns Questionnaire scoring and
who checks References, so planning can continue.

**From:** you (the developer), **To:** your contact at the client,
**How your answers will be used:** they fill the Roles table in the project brief.

## Context
Care4Mind.org is being rebuilt from scratch. Several decisions belong to people
the project hasn't named yet, and the planning is waiting on them.

## How to answer
By <date>, about ten minutes. Partial answers and "I don't know" are useful.

## People
### Who will approve priorities and sign off the launch?
_Why this matters: every question marked "(Client)" in the brief goes to this person._
>

### Who is responsible for each Questionnaire's scoring and interpretation?
>

### Who will check sources and the accuracy of References?
>

## Anything else?
>
```

```callout remember
Write for someone who may read once, and maybe only the top: most important question first, one idea per question, and space to answer under each. Tell them that partial answers and “I don’t know” are useful.
```

```checkpoint check-11
A draft question reads: “Who signs off the launch, and by when?” What’s wrong with it?
- [ ] It belongs under the Anything else heading
- [x] It asks two things in one question
- [ ] It needs a Why this matters note
- [ ] It is too short to be useful
Why: Each question should be one idea. A compound question invites an answer to half of it, so split it into two. A “Why this matters” line is only for a question that could be misread.
```

```checkpoint check-12
The Psychology expert may only read the top of your questionnaire, once. Which habit protects you most?
- [ ] Adding a why-note to every question
- [ ] Keeping every question under one theme
- [ ] Leaving the Context section out entirely
- [x] Putting the most important question first
Why: Async means you may only get one pass, so questions go most important first. Dropping the Context paragraph would leave the reader without enough background to answer well.
```

```checkpoint check-13
When does a question in the document get a “Why this matters” line?
- [x] Only where it could be misread
- [ ] On every question in the document
- [ ] Only on the very first question
- [ ] Only when the deadline is close
Why: The template adds it only where a question could be misread, as with the example’s first question about who signs off the launch. The other two questions in the example are clear without one.
```

## Make the wait visible on the map

Sending a questionnaire settles nothing yet, so the map has to show that something is waiting, or a later session will quietly guess. The cleanest way is to make getting the answers its own **task** ticket. A task is the one type that does rather than decides, and collecting answers from a person is exactly that kind of work. Any decision that needs those answers is wired as blocked by the task.

Lesson 3 ended with exactly such a ticket: “Get the Psychology expert’s scoring rules for the in-scope Questionnaires”, blocked by “Which Questionnaires are in scope?”. Once that grilling is settled, the task reaches the frontier, and the session that claims it runs `/to-questionnaire`, links the file and notes the date. Then it stops, with the ticket still claimed:

```text
# 07: Get the Psychology expert's scoring rules for the in-scope Questionnaires
Type: task
Status: claimed
Blocked by: 06

## Question
For each Questionnaire chosen in "Which Questionnaires are in scope?", get its
scoring rules, result bands and stated limitations from the Psychology expert.

## Comments
- <date>: questionnaire sent to the Psychology expert; file linked here.
```

- **While you wait,** work the rest of the frontier as normal. A claimed ticket is skipped by every other session, and everything blocked by it simply waits.
- **When the answers come back,** start a session that names the task ticket. It records the facts under `## Answer`, sets `Status: resolved`, adds the map line, and stops. The answers are raw material, not a verdict: any decision built on them is settled in its own session, once its ticket reaches the frontier.
- **If a grilling ticket stalls halfway,** run `/to-questionnaire` in that session, ask the agent to add a task ticket for collecting the answers and block the stalled ticket on it, then remove the stalled ticket’s `Status: claimed` line so it comes back to the frontier when the answers do. That last step is my suggestion for your local tracker.

```callout remember
Sending a questionnaire settles nothing, so make collecting the answers its own task ticket. It stays claimed while you wait, and every decision that needs the answers is blocked by it, so no later session can quietly guess.
```

```checkpoint check-14
Why is collecting the Psychology expert’s answers a _task_ ticket rather than a grilling ticket?
- [ ] Grilling tickets can’t be blocked by anything
- [ ] Task tickets stay hidden from the map
- [x] A task does work rather than decides
- [ ] Only a task can link a file
Why: A task is the one ticket type that does rather than decides, and collecting answers from a person is work. The decision that needs those answers stays a separate ticket, blocked by the task.
```

```checkpoint check-15
Mid-grilling, part of a ticket turns out to be the Project owner’s call. You run `/to-questionnaire`. What should happen to the stalled ticket?
- [x] It’s blocked on a new task, and unclaimed
- [ ] It’s resolved now with the agent’s best guess
- [ ] It stays claimed by this session until answered
- [ ] It’s deleted, and a fresh one written later
Why: Have the agent add a task ticket for collecting the answers, block the stalled ticket on it, and remove its `Status: claimed` line, so it returns to the frontier when the answers do. That last step is this lesson’s suggestion for your local tracker; left claimed, every other session would skip it.
```

```checkpoint check-16
The session working ticket 07 has written the questionnaire file. How does the file get onto the ticket?
- [ ] Pasted in full under the ticket’s Answer
- [x] Linked from the ticket in its Comments
- [ ] Copied into the map as a note
- [ ] Kept only in the agent’s session memory
Why: Assets created while resolving a ticket are linked from it, not pasted in. The session links the file, notes the date under `## Comments`, and stops with the ticket still claimed. `## Answer` is for the facts once they come back.
```

## Practice

### Who holds the answer?

For each Care4Mind question, pick who can settle it.

```checkpoint check-17
Do web archives still hold copies of the old questionnaire app?
- [x] Agent finds it
- [ ] You decide it
- [ ] Another person knows
Why: A fact the agent can look up on its own, as a research ticket.
```

```checkpoint check-18
What are the result bands and cut-offs for the Triguna Profile Questionnaire?
- [ ] Agent finds it
- [ ] You decide it
- [x] Another person knows
Why: The public page gives High/Moderate/Low descriptions but no cut-offs, and scoring belongs to the Psychology expert.
```

```checkpoint check-19
Should WordPress stay on as the content back end, or go entirely?
- [ ] Agent finds it
- [x] You decide it
- [ ] Another person knows
Why: Your decision as the developer, settled in a grilling ticket. It waits on who runs the site after launch, but the call itself is yours.
```

```checkpoint check-20
Who will pay for hosting after launch?
- [ ] Agent finds it
- [ ] You decide it
- [x] Another person knows
Why: The brief marks it “(Client)”, so the Project owner answers it, once someone is named.
```

```checkpoint check-21
Which plugins does the live site load on its public pages?
- [x] Agent finds it
- [ ] You decide it
- [ ] Another person knows
Why: A fact the agent can find from outside, and it’s already recorded in `current-site.md`.
```

```checkpoint check-22
What should a topic landing page look like?
- [ ] Agent finds it
- [x] You decide it
- [ ] Another person knows
Why: Yours to decide, best by reacting to a prototype the agent makes.
```

```checkpoint check-23
Do past responses on the current site need keeping?
- [ ] Agent finds it
- [ ] You decide it
- [x] Another person knows
Why: A client question in the brief, and only the client can export those responses.
```

### Check yourself

From memory, without scrolling up.

```final-test final-24
What does `/to-questionnaire` interview you about?
- [ ] The subject you don’t know about
- [x] Who it’s for, what you need
- [ ] Your answers to every open question
- [ ] Which tracker the answers should go
Why: It grills the send, not the subject: who the document goes to, and what you need back.
```

```final-test final-25
Does `/to-questionnaire` send the document to the person?
- [ ] Yes, by email to the address
- [ ] Yes, it posts it in Slack
- [x] No: it writes a file only
- [ ] Only if the map is clear
Why: It writes a Markdown file in the current folder and tells you the path. Delivery is yours.
```

```final-test final-26
You sent the Psychology expert a questionnaire and have heard nothing. What happens to the decision that needs it?
- [x] It stays blocked; other tickets continue
- [ ] The agent fills in plausible answers
- [ ] You settle it on educated guesses
- [ ] Every other ticket stops until then
Why: The decision waits on the task ticket, and the rest of the frontier carries on in its own sessions. Nobody guesses.
```

```final-test final-27
The answers come back. What next?
- [ ] Paste them into the map’s Notes
- [ ] Send a second questionnaire at once
- [ ] Turn them straight into an ADR
- [x] Record them in the task’s Answer
Why: A session that names the task records the facts and resolves it. Decisions built on those facts get their own sessions.
```

```final-test final-28
No Psychology expert is ever named. What does the brief say happens to an in-scope Questionnaire?
- [ ] It is quietly dropped before launch
- [ ] The developer writes new scoring rules
- [x] Rebuilt as documented, no validity claimed
- [ ] The agent researches valid scoring online
Why: It’s rebuilt to match its documented current scoring exactly, covered by tests, and the site makes no claim of validity.
```

## Try it: your first questionnaire

This one doesn’t need the map, so you can send it today. In your project folder, start Claude Code, type `/clear`, then:

```text
/to-questionnaire
```

When it asks **who it’s going to**, say something like: _my contact at the client who commissioned the rebuild; not technical; knows the organisation and who should own what._ When it asks **what you need back**, say: _the names and contact details of the Project owner, the Psychology expert and the Research editor (the Roles table in docs/project-brief.md), and whether one person holds more than one role._

The file lands at the top of your project folder. If you haven’t charted the map yet, mention at charting that this questionnaire is already out, so it becomes a claimed task ticket that the “(Client)” questions are blocked on. Once the map exists, link the file from that ticket.

```callout watch-out
One questionnaire goes to one person. If two people each hold part of an answer, write two, each aimed at what that person knows.
```

## Watch and read next

**Read:** [the to-questionnaire skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/to-questionnaire/SKILL.md), about 50 lines including the document template. Then Matt’s [/to-questionnaire article](https://www.aihero.dev/skills-to-questionnaire), especially “Common questions”, which explains why it isn’t just a batch version of grilling (checked 26 October 2026).

**Watch:** the chapter at 7:40 (ticket types and blocking) of Matt’s [wayfinder walkthrough](https://www.youtube.com/watch?v=F3lL98Pj90o), for how task tickets fit among the others.

```sources
- [grilling/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md)
- [wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md)
- [to-questionnaire/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/to-questionnaire/SKILL.md)
- [Matt’s /to-questionnaire article](https://www.aihero.dev/skills-to-questionnaire)
```
