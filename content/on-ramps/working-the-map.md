---
title: Working the map
slug: working-the-map
summary: Find the next ticket yourself, run one working session from start to finish, and check the files afterwards to see whether the session really ended where it should.
---

Lesson 1 charted the map, and now you have a folder of open questions and no obvious next move. Every session after charting is the same small loop: take one ticket, settle it properly, write the answer down, and stop.

```goals
- You’ll be able to find the next ticket yourself, run one working session from start to finish, and check the files afterwards to see whether the session really ended where it should.
```

## Why stop after one ticket?

Early in a session the agent is sharp: it remembers what you said, follows instructions closely, and makes few mistakes. Matt calls that early stretch the **smart zone**. As the session grows, the same agent gets sloppier and more forgetful — the **dumb zone** — even though plenty of room is left in the context window (the amount of text the agent can hold at once). Quality falls off long before the session runs out of room, so the smart zone, not the window, is the budget you plan around. If you settle three tickets in one sitting, the third one gets the tired end of the session.

That is why wayfinder sizes every ticket to a single session and then asks you to stop. One ticket per session is a rule of the method, not a habit you can drop when a session is going well. The only exception is research: several research tickets can run at once in the background, because they are reading, not deciding with you. And nothing in this lesson turns into a specification or a build plan along the way — a settled ticket is one answered question, recorded in its file, and the `/to-spec` step only comes once the whole map is clear (Lesson 5).

Stopping feels wasteful only if the conversation is where the work lives. On a map it isn’t: the ticket and the map hold everything the next session needs, so the old conversation is disposable and `/clear` costs you nothing. `/clear` empties the agent’s working memory and starts you from nothing, which is exactly what you want. It is not destructive, either: the old session can still be resumed if you ever need to look back at how an answer was reached.

```callout remember
Plan around the smart zone, not the context window: one ticket per session, then `/clear`. The ticket and the map hold everything the next session needs, so clearing costs you nothing.
```

```checkpoint check-1
Late in a long session, the agent starts forgetting what you told it earlier, yet plenty of room is left in its context window. What is going on?
- [ ] Another session has taken over its ticket
- [ ] The map is too long to read
- [x] It has drifted into the dumb zone
- [ ] Its ticket file was never saved properly
Why: Quality falls off long before the window runs out of room: that sloppier, more forgetful stretch is the dumb zone. Nothing about the map or the ticket file explains it; the session has simply gone on too long.
```

```checkpoint check-2
You’re about to type `/clear` after settling a ticket. Why does the next session lose nothing it needs?
- [x] The ticket and the map hold it
- [ ] The agent saves a summary for later
- [ ] `/clear` keeps the session’s last few answers
- [ ] The next session reads this chat first
Why: On a map the work lives in files, not in the conversation, so the conversation is disposable. `/clear` empties the agent’s working memory on purpose, and the next session starts from the map, not from this chat. (The old session can still be resumed if you want to look back.)
```

```checkpoint check-3
You settle the first ticket on the Care4Mind map, and the answer is clear and useful. When does `/to-spec` come in?
- [ ] Right away, while it’s still fresh
- [ ] When the next session first starts
- [ ] In this session, just before `/clear`
- [x] When the whole map is clear
Why: A settled ticket is one answered question, recorded in its file, and nothing more. Nothing turns into a spec along the way, not straight after one answer and not at the next session: `/to-spec` comes once the whole map is clear (Lesson 5).
```

## Your tracker speaks a dialect

There is one wrinkle you will trip over as soon as you read the skill yourself: it is written in GitHub words. It talks about issues, labels and assigning, because that is the tracker it was written for. Your project uses plain Markdown files instead, and your tracker document translates each of those words into a line in a file. Nothing about the method changes — only the spelling. When the skill says “assign it to yourself”, your agent writes one line in a ticket file, and it means the same thing.

| The skill says | In your repo it is |
|---|---|
| Map issue labelled `wayfinder:map` | `.scratch/<effort>/map.md` |
| Child issue | `.scratch/<effort>/issues/NN-<slug>.md` |
| `wayfinder:<type>` label | A `Type:` line near the top of the ticket file |
| Assign it (claim) | `Status: claimed` |
| Resolution comment | An `## Answer` section in the ticket file |
| Close the issue | `Status: resolved` |
| Native blocking | A `Blocked by: NN, NN` line |
| Context pointer on the map | One gist line plus a link under _Decisions so far_ in `map.md` |

Keep this table in mind for the rest of the lesson. From here on, “claim” always means `Status: claimed` saved in the file, and “resolved” always means an `## Answer` plus `Status: resolved`. The full spelling is in docs/agents/issue-tracker.md, under “Wayfinding operations”.

```callout remember
The skill speaks GitHub; your tracker speaks Markdown files. The method doesn’t change, only the spelling: “claim” means `Status: claimed` saved in the ticket file, and “resolved” means an `## Answer` plus `Status: resolved`.
```

```checkpoint check-4
The wayfinder skill tells the agent to “close the issue”. What should change in your repo?
- [ ] The ticket file gets deleted
- [x] Its status line says resolved
- [ ] Its GitHub issue gets closed
- [ ] The map’s line gets removed
Why: Your tracker spells “close the issue” as `Status: resolved` in the ticket file, next to its `## Answer`. Nothing is deleted, and there are no GitHub issues: the tickets are plain Markdown files.
```

```checkpoint check-5
The skill talks about “native blocking”. Where would you look in your repo to see what a ticket is waiting for?
- [ ] A GitHub label on the ticket’s issue
- [ ] A note in the map’s fog section
- [ ] A `Type:` line at the file’s top
- [x] A `Blocked by:` line in its file
Why: Native blocking is spelt as a `Blocked by: NN, NN` line in the ticket file. The `Type:` line stands in for the `wayfinder:<type>` label, and there are no GitHub issues here at all.
```

## Find the frontier yourself

You met the **frontier** in Lesson 1: the tickets that are open, not blocked, and not claimed — the ones a new session is allowed to take. You do not have to take the agent’s word for which ticket that is. You can work it out from the folder in under a minute, and doing it by hand a few times is the fastest way to trust the map. Here is the shared Care4Mind map from Lesson 1, a little later in its life. As before, it is made up to show the shape; wayfinder picks its own folder name, and none of these files exists in your repo yet:

```text
.scratch/care4mind-rebuild/
├── map.md
└── issues/
    ├── 01-what-vercel-and-neon-offer.md      research · resolved
    ├── 02-who-runs-the-site-after-launch.md  task · resolved
    ├── 03-what-to-build-it-with.md           grilling · claimed
    ├── 04-topic-landing-page-look.md         prototype · blocked by 03
    ├── 05-public-questionnaire-scoring.md    research · open
    └── 06-which-questionnaires-are-in-scope.md grilling · blocked by 05
```

Walk down the list and ask three questions of each ticket: is it still open, is everything blocking it resolved, and has nobody claimed it? “What do Vercel and Neon offer?” and “Who runs the site after launch?” are resolved, so they are done and out of the running. “What to build it with?” is unblocked — both tickets it waited on are resolved — but it is _claimed_, which means another session is already working on it, so you skip it. The topic landing page prototype is blocked by that claimed ticket, so it waits. “What does each public Questionnaire page reveal about its scoring?” is open, has no blockers, and is unclaimed: that is the frontier, and it is the ticket your next session takes. “Which Questionnaires are in scope?” is blocked by it, so it stays put. If two tickets are on the frontier at once, the lower number goes first — unless you name a ticket yourself, which always overrides the number order.

```callout remember
Ask three questions of every ticket: is it open, is everything blocking it resolved, and is it unclaimed? The tickets that pass all three are the frontier, and you can check that from the folder yourself.
```

```checkpoint check-6
In the example folder, “What to build it with?” is open and both tickets it waited on are resolved. Why doesn’t your next session take it?
- [ ] Grilling tickets must wait for research
- [ ] Its prototype ticket must go first
- [x] Another session has already claimed it
- [ ] Only a ticket you name runs
Why: It passes two of the three questions (open, unblocked) but fails the third: it’s claimed, so another session is already working on it. The prototype waits on it, not the other way round, and naming a ticket only overrides number order.
```

```checkpoint check-7
In the same example, the next session settles “What does each public Questionnaire page reveal about its scoring?” (05). Which ticket joins the frontier?
- [x] 06, which Questionnaires are in scope
- [ ] 04, how topic landing pages look
- [ ] 03, what to build Care4Mind with
- [ ] None yet, until 03 is resolved
Why: “Which Questionnaires are in scope?” was blocked only by 05, so once 05 is resolved it’s open, unblocked and unclaimed. The landing page prototype still waits on 03, and 03 is still claimed by another session.
```

## One session, start to finish

Here is the whole loop as the agent runs it, in your tracker’s spelling. Two details are easy to miss and both matter. The claim is saved to disk _before_ any work starts, not when the work starts going well — that saved line is the only thing stopping a second session from picking the same ticket. And the agent settles the ticket the way its `Type:` line says, so it has to read that line: the question written in the body never states the type, and a question that sounds like research can still be a grilling ticket.

1. **Load the map only** (First): `/clear
/wayfinder .scratch/<name>/map.md`
   - Reads `map.md`: the destination, the decisions so far, and the fog. That low-resolution view is enough to choose a ticket.
   - Opens a ticket’s full text only when the work needs it, so the session starts light.
2. **Choose and claim** (Next): `Status: claimed`
   - Takes the ticket you named, or the first frontier ticket by number.
   - Sets `Status: claimed` in that ticket’s file and saves, before doing anything else.
3. **Settle it by its Type** (Then): `Type: research | grilling | prototype | task`
   - Reads the `Type:` line and works the ticket that way (next section).
   - Pulls in the full text of related or settled tickets only as needed.
4. **Record it, then tidy the map** (Then): `## Answer
Status: resolved`
   - Writes the full answer under `## Answer` and sets `Status: resolved`.
   - Adds exactly one gist line to the map’s _Decisions so far_, naming the ticket by its title and linking to it.
   - Turns any fog the answer cleared into new tickets, and fixes anything else the answer changed (the “tidy the map” section below).
5. **Stop and /clear** (Last): `/clear`
   - The session ends here, even if settling this ticket has just unblocked the next one. That next ticket gets its own fresh session.
   - Repeat, one ticket per session, until no tickets are left.

```callout remember
The claim is saved to disk before any work starts; that saved line is all that stops a second session taking the same ticket. Then the agent settles the ticket the way its `Type:` line says, not the way the question sounds.
```

```checkpoint check-8
Two sessions start on the same map a minute apart, and neither names a ticket. What stops both of them taking the same ticket?
- [ ] Wayfinder locks `map.md` while the first session runs
- [ ] The second session reads the first one’s chat
- [ ] It’s claimed once the work is going well
- [x] The first saves `Status: claimed` before any work
Why: The claim is saved to disk before any work, so a second session scanning the folder sees `Status: claimed` and skips the ticket. That saved line is the only thing stopping it: sessions don’t read each other’s chat, and a claim made later would come too late.
```

```checkpoint check-9
A ticket’s question sounds like research, but its file says `Type: grilling`. How does the agent settle it?
- [ ] It asks you to pick one
- [x] As grilling, because of the line
- [ ] As research, because of the wording
- [ ] As both, research first, then grilling
Why: The agent works the ticket the way its `Type:` line says. The question in the body never states the type, and one that sounds like research can still be a grilling ticket.
```

```checkpoint check-10
Why does a working session start by reading `map.md` rather than every ticket in full?
- [x] The map is enough to choose a ticket
- [ ] Ticket files can’t be read until they’re claimed
- [ ] The map already holds every ticket’s full answer
- [ ] Ticket files are only written at the end
Why: The map’s low-resolution view (the destination, the decisions so far, the fog) is enough to choose a ticket, so the session starts light and opens a ticket’s full text only when the work needs it. Full answers live in the tickets, not the map.
```

## What each type is like from your chair

The loop is the same for every ticket, but the middle step feels very different depending on the type. A grilling ticket is the interview you already know, with one useful habit to lean on: each round arrives as a numbered list, every question comes with the agent’s recommended answer, and the questions are worded so that “yes” accepts it. You can reply “yes to 1 and 3; 2: no, because…” and move on. A research ticket needs nothing from you at all.

| Type | What you do | What the agent does | What lands on disk |
|---|---|---|---|
| Grilling | Answer each round; “yes” accepts a recommendation | Asks every question it can ask now, looks facts up itself, and runs domain-modeling alongside | The decision in `## Answer`; new words in `GLOSSARY.md`; an ADR only if all three gates pass |
| Research | Nothing; carry on | A background agent reads primary sources and writes a cited Markdown file | The findings, summed up in `## Answer` with a link to that file |
| Prototype | React: which version, what’s wrong | Builds a rough, throwaway draft: one clickable HTML file for “how should it behave?”, or several very different versions of a page for “how should it look?” | The verdict in `## Answer`; the prototype kept on a throwaway branch and linked |
| Task | Follow its checklist, if it can’t do the work alone | Does the work itself where it can, otherwise hands you precise steps | What was done and any facts it produced (new URLs, where credentials live) in `## Answer` |

```callout remember
Only the middle step changes with the type. Grilling: answer each numbered round, where “yes” accepts the recommendation. Research: nothing. Prototype: react to rough, throwaway drafts. Task: follow its checklist, if the agent can’t do the work alone.
```

```checkpoint check-11
A grilling round arrives as a numbered list, and question 2 comes with the agent’s recommended answer. You reply “yes to 2”. What have you done?
- [ ] Skipped it until the next round
- [ ] Asked the agent for its reasoning
- [x] Taken the answer that it recommended
- [ ] Marked the whole ticket as resolved
Why: Each question is worded so that “yes” accepts the agent’s recommended answer, which is why you can answer a whole round in one line. Recording the decision and resolving the ticket happen later, in the files.
```

```checkpoint check-12
A prototype ticket asks how the Care4Mind topic landing page should look. What does the agent build?
- [ ] One polished page, ready to go live
- [ ] One clickable HTML file for its logic
- [ ] A cited Markdown file about page design
- [x] A few very different versions of it
Why: For “how should it look?” the agent builds several very different versions of a page; one clickable HTML file is for “how should it behave?”. Either way it’s a rough, throwaway draft kept on a throwaway branch, never a finished page.
```

```checkpoint check-13
A task ticket needs a step the agent can’t do alone. What does it hand you?
- [ ] A numbered round of questions
- [x] A precise checklist to follow
- [ ] Several drafts to react to
- [ ] A cited file of findings
Why: A task is done by the agent where it can; where it can’t, it hands you precise steps. Numbered rounds belong to grilling, drafts to prototypes, and a cited file to research.
```

## What “settled” looks like on disk

A ticket is not done when the conversation feels done. It is done when the files say so. Here is the session from the frontier example above, taking “What does each public Questionnaire page reveal about its scoring?”. Suppose it was added after charting, so nothing has run it yet. Green lines are added, red lines are removed. Unlike the rest of this map, the findings are real: they are what `current-site.md` recorded on 26 October 2026.

```diff
# .scratch/care4mind-rebuild/issues/05-public-questionnaire-scoring.md
# 05: What does each public Questionnaire page reveal about its scoring?
Type: research
-Status: claimed
+Status: resolved

## Question
For every page on care4mind.org that offers or describes a Questionnaire,
what does the public page show of its questions, scoring and results?

+## Answer
+Only part of the scoring is public.
+- KarmaYoga Scale: its 45 questions and an answer key are in the page HTML
+  (one option per question flagged correct); the results screen shows a
+  percentage. No result bands or interpretation text.
+- Sixteen description-only pages: High/Moderate/Low descriptions, but no
+  questions and no numeric cut-offs (/karta-2/ says each type “is scored on
+  a scale of 1 to 10”).
+- Dosha Survey: nothing public shows how it scores.
+- The separate questionnaire app refused connections on 2026-10-26.
```

```diff
# .scratch/care4mind-rebuild/map.md (only the changed lines)
## Decisions so far
+- [What does each public Questionnaire page reveal about its scoring?](issues/05-public-questionnaire-scoring.md):
+  only partly public; nothing public gives the cut-offs or the Dosha scoring.

## Not yet specified
- Where the missing scoring rules could come from.
```

Three things changed, and each has one home. The full findings live in the ticket. The map gained exactly one line, which names the ticket by its title, gives the gist, and links to it. It never copies the answer. If you ever find the same decision written in two places, treat it as a bug in the paperwork, because one copy will go stale. The third change is that a fog line disappeared, which is the next section.

```callout remember
A ticket is done when the files say so, not when the conversation feels done. Each change has one home, and the same decision written in two places is a bug, because one copy will go stale.
```

```checkpoint check-14
The agent tells you the ticket is settled. How do you find out whether it really is?
- [x] Read the ticket file and the map
- [ ] Ask the agent to confirm it again
- [ ] Scroll back through this session’s whole chat
- [ ] Wait for the next session to summarise
Why: A ticket is done when the files say so, not when the conversation feels done: an `## Answer` and `Status: resolved` in the ticket, and its line on the map. The chat and the agent’s word are not the record.
```

```checkpoint check-15
You notice the scoring findings written out in full in the ticket _and_ in `map.md`. Why is that a problem?
- [ ] The map grows too long to read
- [ ] Wayfinder will refuse to load the map
- [x] One copy will go stale over time
- [ ] The ticket can’t be marked as resolved
Why: A decision lives in exactly one place, its ticket; the map only gists it and links. Two full copies are a bug in the paperwork, because one of them will go stale. Nothing refuses to load, and the ticket’s status isn’t affected.
```

## Then tidy the map, in the same session

Before the session stops, the agent looks at what the answer changed beyond its own ticket. In the example, the fog line “Where the missing scoring rules could come from” is now sharp: the public pages don’t have them, so someone must supply them. That graduates into a new ticket, `07-psychology-expert-scoring-rules.md`, a task to get the Psychology expert’s scoring rules for the in-scope Questionnaires, blocked by “Which Questionnaires are in scope?”. The fog line is deleted so the question lives in one place. Getting answers from a person is [Lesson 4](/learn/answers-from-other-people).

- **Fog that cleared becomes tickets.** The test is “can I state the question precisely now?”, not “can I answer it now?”. One patch of fog can become several tickets, or none.
- **Anything past the destination is closed, not settled.** If a ticket like “Should the Questionnaires get a mobile app?” turned up, the brief already rules a mobile app out. The ticket gets closed with one line in Out of scope saying why, and never appears in Decisions so far.
- **Tickets the answer invalidates get fixed or deleted now.** If “What to build it with?” were to drop WordPress entirely, any ticket asking which WordPress plugins to keep would lose its premise, so it would be deleted in that same session.
- **Words and big decisions go where they always go:** a pinned-down term into `GLOSSARY.md` at once; an ADR only if the decision passes all three gates ([Lesson 1](/learn/wayfinder-first-session)).

```callout remember
Before it stops, the session fixes whatever the answer changed beyond its own ticket: cleared fog becomes tickets, anything past the destination is closed, invalidated tickets are fixed or deleted, and pinned-down words go into `GLOSSARY.md`.
```

```checkpoint check-16
After a session, a patch of fog is clearer but not answered. Which test decides whether it becomes a ticket?
- [ ] Could I answer the question right now?
- [x] Can I state the question precisely now?
- [ ] Has it sat longest in the fog?
- [ ] Does the agent recommend making it one?
Why: The test is whether you can state the question precisely now, not whether you can answer it now. Answering waits for the new ticket’s own session, and one patch of fog can become several tickets, or none.
```

```checkpoint check-17
“What to build it with?” is settled, and the answer drops WordPress entirely. Another ticket asks which WordPress plugins to keep. What happens to it?
- [ ] Left alone for its own fresh session
- [ ] Moved back into the map’s fog section
- [ ] Closed, then noted under Out of scope
- [x] Fixed or deleted now, in this session
Why: The answer took away that ticket’s premise, so it gets fixed or deleted in the same session, before the stop. Out of scope is for work past the destination, not for a ticket whose premise has gone.
```

```checkpoint check-18
This session pinned down exactly what a term means. When does it go into `GLOSSARY.md`?
- [x] At once, in this same session
- [ ] Only if it passes three gates
- [ ] When the whole map is clear
- [ ] When `/to-spec` writes the full spec
Why: A pinned-down term goes into `GLOSSARY.md` at once. The three gates decide whether a decision earns an ADR, not whether a word gets written down.
```

## Can I run two tickets at once?

You can: two frontier tickets in two terminals, each claimed first so they never collide. The claim is exactly what makes that safe on paper. In practice Matt recommends one at a time, because two sessions share nothing, so a second grilling session can ask you the very question you answered ten minutes ago in the first. The one comfortable exception is research, which runs in the background and needs nothing from you.

```callout remember
You can run two frontier tickets at once, each claimed first, but one at a time is the safer default: sessions share nothing, so two grilling sessions can ask you the same question. Research, which needs nothing from you, is the comfortable exception.
```

```checkpoint check-19
You start a grilling ticket in each of two terminals. What is most likely to go wrong?
- [ ] Both sessions claim the same ticket
- [ ] The map refuses a second session
- [x] You answer the same question twice
- [ ] Their answers overwrite each other’s files
Why: The two sessions share no context, so the second can ask you something you answered ten minutes ago in the first. Each claims its ticket first, so on paper they never collide.
```

```checkpoint check-20
A grilling session is running in one terminal. Which kind of ticket is the comfortable one to run alongside it?
- [ ] Another grilling ticket
- [x] A research ticket
- [ ] A prototype ticket
- [ ] A task ticket
Why: Research runs in the background and needs nothing from you. A second grilling ticket is exactly the case Matt warns about, and a prototype or a task can need you to react or follow steps.
```

## Practice

### Which ticket is next?

Each line is a map’s ticket folder. Pick the ticket a new session would take.

```checkpoint check-21
01 resolved · 02 claimed · 03 blocked by 02 · 04 open · 05 open. You don’t name a ticket.
- [ ] Ticket 02
- [ ] Ticket 03
- [x] Ticket 04
- [ ] Ticket 05
Why: 02 is claimed, and 03 waits on it. 04 and 05 are both on the frontier, and the lower number goes first.
```

```checkpoint check-22
01 resolved · 02 resolved · 03 blocked by 01, 02 · 04 blocked by 03.
- [x] Ticket 03
- [ ] Ticket 04
- [ ] No ticket
- [ ] Ticket 01
Why: Both of 03’s blockers are resolved, so it’s unblocked, open and unclaimed. 04 still waits on 03.
```

```checkpoint check-23
01 resolved · 03 and 04 are on the frontier · you name ticket 05, which is open and unblocked.
- [ ] Ticket 04
- [x] Ticket 05
- [ ] Ticket 03
- [ ] No ticket
Why: A ticket you name always wins over number order.
```

```checkpoint check-24
01 resolved · 02 claimed · 03 blocked by 02 · 04 blocked by 03.
- [ ] Ticket 02
- [ ] Ticket 03
- [ ] Ticket 04
- [x] No ticket
Why: Everything open is either claimed or blocked, so the frontier is empty. Let the session working on 02 finish first.
```

```checkpoint check-25
01 resolved · 02 open, blocked by 04 · 03 claimed · 04 open.
- [x] Ticket 04
- [ ] Ticket 02
- [ ] Ticket 03
- [ ] No ticket
Why: 02 is open but waits on 04, and 03 is claimed. 04 is the only frontier ticket, even though its number is higher.
```

### Check yourself

From memory, without scrolling up.

```final-test final-26
A ticket is settled. Where does the full answer go?
- [ ] In the map, under Decisions so far
- [x] Under `## Answer` in its ticket file
- [ ] In a new ADR for that ticket
- [ ] Only in the chat for that session
Why: The ticket holds the full answer. A decision lives in exactly one place.
```

```final-test final-27
And what does the map get?
- [ ] A full copy of the answer
- [ ] Nothing at all, it stays put
- [ ] A new section for the ticket
- [x] One gist line that links it
Why: The map is an index, not a store: one line naming the ticket by its title, with the gist and a link.
```

```final-test final-28
An answer makes a fog item sharp enough to state precisely. What happens?
- [ ] Leave it in the fog section
- [ ] Answer it now, in this session
- [x] New ticket; delete its fog line
- [ ] Put it under Out of scope
Why: It graduates into a new ticket with its blockers wired, and the fog line goes, so it lives in one place. Settling it waits for its own session.
```

```final-test final-29
A ticket turns out to sit past the destination. What happens?
- [x] Close it; add an Out-of-scope line
- [ ] Settle it anyway, since it exists
- [ ] Move it into Not yet specified
- [ ] Record it under Decisions so far
Why: Ruling something out of scope is a scoping act, not a step on the route: close it, leave one line saying why, and keep it out of Decisions so far.
```

```final-test final-30
You’ve just resolved a ticket, and that unblocked another one. What now?
- [ ] Settle the newly unblocked one too
- [ ] `/compact`, then settle the next one
- [x] Check the files, then type `/clear`
- [ ] Ask the agent for a summary
Why: One ticket per session. The next one gets a fresh session, and the files already hold everything it needs.
```

## Try it, after your chart session

Once your map exists ([Lesson 1’s first session](/learn/wayfinder-first-session)), every working session starts the same way. In your project folder:

```text
/clear
/wayfinder .scratch/<name>/map.md
```

To choose the ticket yourself instead of taking the first frontier one, add its path after the map’s path. Before you type `/clear` at the end, check four things in the files, not in the chat:

- The ticket has an `## Answer` and `Status: resolved`.
- The map has exactly one new line under Decisions so far, naming the ticket by its title.
- Cleared fog, out-of-scope tickets and invalidated tickets are dealt with, or there were none.
- Any word you pinned down is in `GLOSSARY.md`.

```callout watch-out
This lesson uses ticket numbers so the exercises stay short. In the real map, and when the agent talks to you, tickets should be called by their titles. If you see a wall of bare numbers, ask for names.
```

## Watch and read next

**Watch:** in Matt’s [wayfinder walkthrough](https://www.youtube.com/watch?v=F3lL98Pj90o), the chapters at 5:39 (setting up and working through maps) and 7:40 (ticket types and blocking) show this loop on a real map.

**Read:** [the wayfinder skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md), sections “Work through the map”, “Fog of war” and “Out of scope”, with your tracker’s translation open beside it: issue-tracker.md, “Wayfinding operations”. For the why behind stopping, Matt’s two-minute dictionary entries on the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) and [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) (checked 26 October 2026).

```sources
- [AI Coding Dictionary: smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)
- [wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md)
- [ask-matt/PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/PHASE-BOUNDARIES.md)
- [grilling/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md)
- [prototype/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md)
- [Matt’s /wayfinder article](https://www.aihero.dev/skills-wayfinder)
```
