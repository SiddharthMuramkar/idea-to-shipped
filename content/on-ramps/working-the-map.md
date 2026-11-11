---
title: Working the map
slug: working-the-map
summary: Find the next ticket yourself, run one working session from start to finish, and check the tracker to see whether it really ended where it should.
image: /images/lessons/working-the-map.jpg
imageAlt: Navigation dividers, a plotter, a pencil and a notebook of course notes spread across a nautical chart.
---

Charting, your [first wayfinder session](/learn/wayfinder-first-session), gave you a map full of open questions, and no obvious next move. Which ticket comes first, and how do you know a session did its job? Every session after charting is the same small loop: take one ticket, settle it properly, write the answer down, and stop.

```goals
- You'll be able to say why a session stops after one ticket, even when it's going well.
- You'll be able to find the frontier yourself, from the tracker, in under a minute.
- You'll be able to run one working session from start to finish, whatever the ticket's type.
- You'll be able to check the tracker afterwards to see whether the session really ended where it should.
```

## Why stop after one ticket?

Early in a session the agent is sharp: it remembers what you said, follows instructions closely, and makes few mistakes. Matt Pocock, who wrote the [wayfinder](/learn/wayfinder) Skill, calls that early stretch the _smart zone_. As the session grows, the same agent gets sloppier and more forgetful, the _dumb zone_, even though plenty of room is left in the context window (the amount of text the agent can hold at once). Quality falls off long before the session runs out of room.

**So plan around the smart zone, not the window: settle one ticket per session, then `/clear`.**

If you settle three tickets in one sitting, the third gets the tired end of the session. That's why wayfinder sizes every ticket to one session, about 100K [tokens](/learn/context-window) (chunks of text, each about three-quarters of a word) of work, and then stops. One ticket per session is a rule of the method, not a habit you can drop when a session is going well. The only exception is research: several research tickets can run at once in the background, because they're reading, not deciding with you.

Nothing turns into a [Spec](/learn/to-spec) (the written plan for one feature) or a build plan along the way, either. A settled ticket is one answered question, recorded on its ticket. `/to-spec` only comes once the whole map is clear, as [After the map is clear](/learn/after-the-map) shows.

Stopping feels wasteful only if the conversation is where the work lives. On a map it isn't: the ticket and the map hold everything the next session needs, so the old conversation is disposable. `/clear` empties the context window and starts you from nothing, which is what you want here. It isn't destructive either: the old session can still be resumed if you ever need to look back at how an answer was reached.

Don't reach for `/compact` instead. It squeezes the conversation into a summary but carries on in the same conversation, so the next ticket would still share this session, and on a map that summary is only noise.

```callout remember
Plan around the smart zone, not the context window: one ticket per session, then `/clear`. The ticket and the map hold everything the next session needs, so clearing costs you nothing.
```

```checkpoint check-1
Late in a long session, the agent starts forgetting what you told it earlier, yet plenty of room is left in its context window. What is going on?
- [ ] Another session has taken over its ticket
- [ ] The map has grown too long to read
- [x] It has drifted into the dumb zone
- [ ] Its ticket was never saved properly
Why: Quality falls off long before the window runs out of room: that sloppier, more forgetful stretch is the dumb zone. Nothing about the map or the ticket explains it; the session has gone on too long.
```

```checkpoint check-2
You're about to type `/clear` after settling a ticket. Why does the next session lose nothing it needs?
- [x] The ticket and the map hold it
- [ ] The agent saves a summary for later
- [ ] `/clear` keeps the session's last few answers
- [ ] The next session reads this chat first
Why: On a map the work lives on the tracker, not in the conversation, so the conversation is disposable. `/clear` empties the context window on purpose, and the next session starts from the map, not from this chat. The old session can still be resumed if you want to look back.
```

```checkpoint check-3
You settle the first ticket on a map, and the answer is clear and useful. When does `/to-spec` come in?
- [ ] Right away, while the answer is fresh
- [ ] When the next session first starts
- [ ] In this session, right before `/clear`
- [x] When the whole map is clear
Why: A settled ticket is one answered question, recorded on its ticket, and nothing more. Nothing turns into a Spec along the way, not straight after one answer and not at the next session: `/to-spec` comes once the whole map is clear.
```

## Your tracker speaks a dialect

There's one wrinkle you'll trip over as soon as you read the Skill yourself: it's written in GitHub words. It talks about issues, labels and assigning, because GitHub is the tracker it was designed for. On GitHub Issues, as in [the practice project](/learn/issues-and-keeping-track), those words mean exactly what they say.

A project on a [local tracker](/learn/issues-and-keeping-track) keeps plain Markdown files under `.scratch/` instead. Its tracker document, `docs/agents/issue-tracker.md`, translates each GitHub word into a line in a file, in a part called "Wayfinding operations". Nothing about the method changes, only the spelling. When the Skill says "assign it to yourself", an agent on local files writes one line in a ticket file, and it means the same thing.

| The Skill says | On GitHub Issues | In local Markdown files |
|---|---|---|
| Map issue labelled `wayfinder:map` | One Issue with that label | `.scratch/<effort>/map.md` |
| Child issue | A sub-issue of the map | `.scratch/<effort>/issues/NN-<slug>.md` |
| `wayfinder:<type>` label | That label on the sub-issue | A `Type:` line near the top of the file |
| Assign it (claim) | You become its assignee | `Status: claimed` |
| Resolution comment | A comment on the Issue | An `## Answer` part in the file |
| Close the issue | The Issue is closed | `Status: resolved` |
| Native blocking | GitHub's blocked-by links | A `Blocked by: NN, NN` line |
| Context pointer on the map | One gist line plus a link under Decisions so far | The same line, in `map.md` |

Matt's write-up says GitHub has the best support: its sub-issues and blocked-by links show the frontier without opening the map. He doesn't recommend local files, because planning stored in your repo tends to stay there by accident. From here on, "claim" means you're set as the ticket's assignee, and "resolved" means a resolution comment plus a closed Issue.

```callout remember
The Skill speaks GitHub, and the tracker document says how your repo spells each word. On GitHub Issues, "claim" means the ticket is assigned to you, and "resolved" means a resolution comment plus a closed Issue. On local files, they're `Status: claimed`, and an `## Answer` plus `Status: resolved`.
```

```checkpoint check-4
Your project keeps its tickets as local Markdown files. The wayfinder Skill tells the agent to "close the issue". What should change?
- [ ] The ticket file gets deleted
- [x] Its status line says resolved
- [ ] A GitHub Issue gets closed
- [ ] The map's line for it is removed
Why: A local tracker spells "close the issue" as `Status: resolved` in the ticket file, next to its `## Answer`. Nothing is deleted, and there are no GitHub Issues: the tickets are plain Markdown files.
```

```checkpoint check-5
On the practice project, which of these shows that a ticket is claimed?
- [x] Someone is set as its assignee
- [ ] A `Status: claimed` line in its body
- [ ] A `wayfinder:claimed` label on it
- [ ] A note under the map's Decisions so far
Why: On GitHub the assignee is the claim, so an open, unassigned ticket is unclaimed. `Status: claimed` is the local-file spelling, and the only `wayfinder:` labels are the map and the four ticket types.
```

## Find the frontier yourself

You met the **frontier** in [wayfinder](/learn/wayfinder): the tickets that are open, not blocked and not claimed, the ones a new session may take. You don't have to take the agent's word for which ticket that is. You can work it out from the tracker in under a minute, and doing it by hand a few times is the fastest way to trust the map.

Here is the made-up rebuild map from [Your first wayfinder session](/learn/wayfinder-first-session), a little later in its life:

```text
#20 Rebuild booking and payments                        wayfinder:map
├── #21 What do payment services charge and offer?          research · closed
├── #22 Who handles refunds after launch?                   task · closed
├── #23 Which payment service will take the studio's payments?
│                                                           grilling · assigned
├── #24 What should the checkout page look like?            prototype · blocked by #23
├── #25 What does the old booking tool's export hold?       research · open
└── #26 Which passes and memberships move across?           grilling · blocked by #25
```

Walk down the list and ask three questions of each ticket: is it still open, is everything blocking it closed, and has nobody claimed it?

- "What do payment services charge and offer?" and "Who handles refunds after launch?" are closed, so they're done and out of the running.
- "Which payment service…?" is unblocked, since both tickets it waited on are closed. But it has an assignee: another session is already working on it, so you skip it.
- The checkout prototype is blocked by that claimed ticket, so it waits.
- "What does the old booking tool's export hold?" is open, has no blockers, and nobody is assigned. That's the frontier, and it's the ticket your next session takes.
- "Which passes and memberships move across?" is blocked by it, so it stays put.

If two tickets are on the frontier at once, the first in map order goes first (with local files, the lower number). A ticket you name yourself always wins over that order. On GitHub you can often see the frontier at a glance: a blocked sub-issue shows a Blocked icon, and a claimed one shows its assignee.

```callout remember
Ask three questions of every ticket: is it open, is everything blocking it closed, and is it unclaimed? The tickets that pass all three are the frontier, and you can check that on the tracker yourself.
```

```checkpoint check-6
In the example, "Which payment service…?" is open, and both tickets it waited on are closed. Why doesn't your next session take it?
- [ ] Grilling tickets must wait for research
- [ ] Its prototype ticket has to go first
- [x] Another session has already claimed it
- [ ] Only a ticket you name can be taken
Why: It passes two of the three questions (open, unblocked) but fails the third: it has an assignee, so another session is already working on it. The prototype waits on it, not the other way round, and naming a ticket only overrides map order.
```

```checkpoint check-7
In the same example, the next session settles "What does the old booking tool's export hold?". Which ticket joins the frontier?
- [x] "Which passes and memberships move across?"
- [ ] "What should the checkout page look like?"
- [ ] "Which payment service will take the studio's payments?"
- [ ] None yet, until the claimed ticket closes
Why: "Which passes and memberships move across?" was blocked only by the export ticket, so once that closes, it's open, unblocked and unclaimed. The checkout prototype still waits on "Which payment service…?", and that one is still claimed by another session.
```

## One session, start to finish

Here is the whole loop as the agent runs it, in the practice project's GitHub spelling.

1. **Load the map only, first.** Type `/clear`, then `/wayfinder #20`, with your map's number.
   - It reads the map's body (the destination, the decisions so far and the fog), then lists the map's open sub-issues to find the frontier. That's enough to choose a ticket without opening every ticket in full.
   - It opens a ticket's full text only when the work needs it, so the session starts light.
2. **Choose and claim, next.** On GitHub the claim is `gh issue edit <n> --add-assignee @me`, the session's first write.
   - It takes the ticket you named, or else the first frontier ticket in map order.
   - It assigns that ticket before doing anything else.
3. **Settle it by its type, then.** It reads the ticket's `wayfinder:<type>` label.
   - It works the ticket the way that label says (next part).
   - It pulls in the full text of related or closed tickets only as needed.
4. **Record it, then tidy the map.** It runs `gh issue comment`, then `gh issue close`.
   - It posts the full answer as a resolution comment, then closes the Issue.
   - It adds exactly one gist line to the map's Decisions so far, naming the ticket by its title and linking to it.
   - It turns any fog the answer cleared into new tickets, and fixes anything else the answer changed (below).
5. **Stop and `/clear`, last.**
   - The session ends here, even if settling this ticket has unblocked the next one. That ticket gets its own fresh session.
   - Repeat, one ticket per session, until no tickets are left.

```diagram
type: cycle
caption: "Repeat, one ticket per session, until no tickets are left."
steps: ["Load the map only", "Choose and claim", "Settle it by its type", "Record it, then tidy the map"]
outside: "Stop and /clear"
```

Two details are easy to miss, and both matter. The claim is saved before any work starts, not once the work is going well: that assignee is the only thing stopping a second session from picking the same ticket. And the agent settles the ticket the way its label says, so it has to read the label. The question in the body never states the type, and a question that sounds like research can still be a grilling ticket.

```callout remember
The claim is saved before any work starts; that assignee is all that stops a second session taking the same ticket. Then the agent settles the ticket the way its `wayfinder:` label says, not the way the question sounds.
```

```checkpoint check-8
Two sessions start on the same map a minute apart, and neither names a ticket. What stops both of them taking the same ticket?
- [ ] Wayfinder locks the map while the first one runs
- [ ] The second session reads the first one's chat
- [ ] The ticket is claimed once the work goes well
- [x] The first one assigns the ticket before any work
Why: The claim is the session's first write, so a second session querying the frontier sees the assignee and skips the ticket. That's the only thing stopping it: sessions don't read each other's chat, and a claim made later would come too late.
```

```checkpoint check-9
A ticket's question sounds like research, but its label says `wayfinder:grilling`. How does the agent settle it?
- [ ] It asks you to pick one of the two
- [x] As grilling, because of the label
- [ ] As research, because of the wording
- [ ] As both: research first, then grilling
Why: The agent works the ticket the way its `wayfinder:` label says. The question in the body never states the type, and one that sounds like research can still be a grilling ticket.
```

```checkpoint check-10
Why does a working session start by reading the map rather than every ticket in full?
- [x] The map and its open-ticket list are enough
- [ ] Tickets can't be read until they're claimed
- [ ] The map holds every ticket's full answer
- [ ] Ticket text is only written at the end
Why: The map's body orients the session and a list of its open sub-issues shows the frontier, so the session starts light and opens a ticket's full text only when the work needs it. Full answers live on the tickets, not the map.
```

## What each type is like from your chair

The loop is the same for every ticket, but the middle step feels very different depending on the type. A grilling ticket is the [grilling](/learn/grilling) interview you already know, with one useful habit to lean on. Each round arrives as a numbered list, every question comes with the agent's recommended answer, and the questions are worded so that "yes" accepts it. You can reply "yes to 1 and 3; 2: no, because…" and move on. A research ticket needs nothing from you at all.

| Type | What you do | What the agent does | What lands on the tracker |
|---|---|---|---|
| Grilling | Answer each round; "yes" accepts a recommendation | Asks every question it can ask now, looks facts up itself, and runs [domain-modeling](/learn/domain-modeling) alongside | The decision in the resolution comment; new words in `GLOSSARY.md`, the project's agreed dictionary; an ADR (architecture decision record: a short file on one big decision) only if all three tests pass |
| Research | Nothing; carry on | A background agent reads primary sources and writes a Markdown file that cites them | The findings, summed up in the resolution comment, with a link to that file |
| Prototype | React: which version, what's wrong | Builds a rough, throwaway draft: one clickable HTML file for "how should it behave?", or several very different versions of a page for "how should it look?" | The verdict in the resolution comment; the prototype kept on a throwaway branch and linked |
| Task | Follow its checklist, if it can't do the work alone | Does the work itself where it can, otherwise hands you precise steps | What was done, and any facts it produced (new URLs, where credentials live), in the resolution comment |

Two known gaps are worth watching. On a prototype ticket, one user's agent built three versions of a page, chose one itself and closed the ticket. That choice is yours, so say which version you want before anything is recorded. And the Skill has no review step before an AFK ticket (one the agent works alone, "away from keyboard", such as research) closes, so ask the agent up front to show you a research result before it resolves the ticket.

```callout remember
Only the middle step changes with the type. Grilling: answer each numbered round, where "yes" accepts the recommendation. Research: nothing. Prototype: react to rough, throwaway drafts, and make the choice yourself. Task: follow its checklist, if the agent can't do the work alone.
```

```checkpoint check-11
A grilling round arrives as a numbered list, and question 2 comes with the agent's recommended answer. You reply "yes to 2". What have you done?
- [ ] Skipped it until the next round
- [ ] Asked the agent for its reasoning
- [x] Taken the answer it recommended
- [ ] Marked the whole ticket as resolved
Why: Each question is worded so that "yes" accepts the agent's recommended answer, which is why you can answer a whole round in one line. Recording the decision and closing the ticket happen later, on the tracker.
```

```checkpoint check-12
A prototype ticket asks how the checkout page should look. What does the agent build?
- [ ] One polished page, ready to go live
- [ ] One clickable HTML file for its logic
- [ ] A cited Markdown file about page design
- [x] A few very different versions of it
Why: For "how should it look?" the agent builds several very different versions of a page; one clickable HTML file is for "how should it behave?". Either way it's a rough, throwaway draft kept on a throwaway branch, never a finished page.
```

```checkpoint check-13
A task ticket needs a step the agent can't do alone. What does it hand you?
- [ ] A numbered round of questions
- [x] A precise checklist to follow
- [ ] Several drafts to react to
- [ ] A cited file of findings
Why: A task is done by the agent where it can; where it can't, it hands you precise steps. Numbered rounds belong to grilling, drafts to prototypes, and a cited file to research.
```

## What "settled" looks like on the tracker

A ticket isn't done when the conversation feels done. It's done when the tracker says so. Here is the session from the frontier example above, taking "What does the old booking tool's export hold?". Say it was added after charting, so nothing has run it yet (research tickets made while charting start straight away). Like the rest of this map, the findings are made up:

```text
What does the old booking tool's export hold? #25        wayfinder:research

## Question
For the export file the old booking tool gives you, what does it hold
about members, bookings, class passes and refunds?

Resolution comment:
  Only part of what the rebuild needs is in the export.
  - Members and their past bookings: all there, back to 2023.
  - Class passes: each pass's type and start date, but not how many
    classes are left. The front desk tracks that on paper.
  - Refunds: no rules recorded anywhere; refunds show only as notes
    on cash payments.
  Findings, with sources: research/old-tool-export (link)

Closed as completed.
```

And here is the change to the map's body. Green lines are added, red lines are removed:

```diff
## Decisions so far
+- [What does the old booking tool's export hold?](link): members and
+  bookings are there; pass balances and refund rules aren't.

## Not yet specified
-Where the refund and cancellation rules could come from.
```

Three things changed, and each has one home. The full findings live on the ticket. The map gained exactly one line, which names the ticket by its title, gives the gist, and links to it. It never copies the answer: if you ever find the same decision written in two places, treat it as a bug in the paperwork, because one copy will go stale. The third change is that a fog line disappeared, which the next part explains.

```callout remember
A ticket is done when the tracker says so, not when the conversation feels done. Each change has one home, and the same decision written in two places is a bug, because one copy will go stale.
```

```checkpoint check-14
The agent tells you the ticket is settled. How do you find out whether it really is?
- [x] Read the ticket and the map on the tracker
- [ ] Ask the agent to confirm it once again
- [ ] Scroll back through this session's chat
- [ ] Wait for the next session to sum it up
Why: A ticket is done when the tracker says so, not when the conversation feels done: a resolution comment and a closed Issue, and its line on the map. The chat and the agent's word are not the record.
```

```checkpoint check-15
You notice the export findings written out in full on the ticket _and_ in the map's body. Why is that a problem?
- [ ] The map's link to the ticket breaks
- [ ] Wayfinder will refuse to load the map
- [x] One copy will go stale over time
- [ ] The ticket can no longer be closed
Why: A decision lives in exactly one place, its ticket; the map only gists it and links. Two full copies are a bug in the paperwork, because one of them will go stale. Nothing refuses to load, and the ticket's state isn't affected.
```

## Then tidy the map, in the same session

Before the session stops, the agent looks at what the answer changed beyond its own ticket. In the example, the fog line "Where the refund and cancellation rules could come from" is now sharp: the export doesn't hold them, so someone must supply them. That graduates into a new ticket, "Get the studio owner's refund and cancellation rules for each pass that moves across", a task blocked by "Which passes and memberships move across?". The fog line is deleted, so the question lives in one place. Getting answers from a person is [Answers only other people have](/learn/answers-from-other-people).

- **Fog that cleared becomes tickets.** The test is "can I state the question precisely now?", not "can I answer it now?". One patch of fog can become several tickets, or none.
- **Anything past the destination is closed, not settled.** Say a ticket like "Should members get a phone app?" turned up. The map's Out of scope already rules a phone app out, so the ticket gets closed with one line in Out of scope saying why, and it never appears in Decisions so far.
- **Tickets the answer invalidates get fixed or deleted now.** Say "Which payment service…?" settled on online payments only, with no card reader at the desk. A ticket asking which card reader to buy would lose its premise, so it would be deleted in that same session.
- **Words and big decisions go where they always go:** a pinned-down term into `GLOSSARY.md` at once, and an ADR only if the decision passes all three tests (hard to reverse, surprising, a real trade-off).

One case has no official rule: a decision you already closed turns out to be wrong. Left alone, the agent tends to design around the bad decision instead of challenging it. So tell wayfinder plainly what changed. It then updates the map, revises the affected tickets and comments on the closed ones.

```callout remember
Before it stops, the session fixes whatever the answer changed beyond its own ticket: cleared fog becomes tickets, anything past the destination is closed, invalidated tickets are fixed or deleted, and pinned-down words go into `GLOSSARY.md`.
```

```checkpoint check-16
After a session, a patch of fog is clearer but not answered. Which test decides whether it becomes a ticket?
- [ ] Could I answer the question right now?
- [x] Can I state the question precisely now?
- [ ] Has it sat longest in the fog?
- [ ] Does the agent recommend a ticket?
Why: The test is whether you can state the question precisely now, not whether you can answer it now. Answering waits for the new ticket's own session, and one patch of fog can become several tickets, or none.
```

```checkpoint check-17
"Which payment service…?" is settled, with no card reader at the desk. Another ticket asks which card reader to buy. What happens to it?
- [ ] It's left alone for its own fresh session
- [ ] It moves back into the map's fog part
- [ ] It's closed and noted under Out of scope
- [x] It's fixed or deleted now, in this session
Why: The answer took away that ticket's premise, so it gets fixed or deleted in the same session, before the stop. Out of scope is for work past the destination, not for a ticket whose premise has gone.
```

```checkpoint check-18
This session pinned down exactly what "class pass" means. When does that go into `GLOSSARY.md`?
- [x] At once, in this same session
- [ ] Only if it passes the three tests
- [ ] When the whole map is clear
- [ ] When `/to-spec` writes the Spec
Why: A pinned-down term goes into `GLOSSARY.md` at once. The three tests decide whether a decision earns an ADR, not whether a word gets written down.
```

## Can I run two tickets at once?

You can: two frontier tickets in two terminals, each claimed first so they never collide. The claim is what makes that safe on paper. In practice Matt recommends one at a time, because two sessions share no context: a second grilling session can ask you the very question you answered ten minutes ago in the first. If you do run two, check the blocking links yourself first. The one comfortable exception is research, which runs in the background and needs nothing from you.

```callout remember
You can run two frontier tickets at once, each claimed first, but one at a time is the safer default: sessions share nothing, so two grilling sessions can ask you the same question. Research, which needs nothing from you, is the comfortable exception.
```

```checkpoint check-19
You start a grilling ticket in each of two terminals. What is most likely to go wrong?
- [ ] Both sessions claim the same ticket
- [ ] The map refuses the second session
- [x] You answer the same question twice
- [ ] Their answers overwrite each other
Why: The two sessions share no context, so the second can ask you something you answered ten minutes ago in the first. Each claims its ticket first, so on paper they never collide.
```

```checkpoint check-20
A grilling session is running in one terminal. Which kind of ticket is the comfortable one to run alongside it?
- [ ] Another grilling ticket
- [x] A research ticket
- [ ] A prototype ticket
- [ ] A task ticket
Why: Research runs in the background and needs nothing from you. A second grilling ticket is the case Matt warns about, and a prototype or a task can need you to react or follow steps.
```

## Try it: one working session

````try
You'll need the map from your first session ([Your first wayfinder session](/learn/wayfinder-first-session)), with at least one ticket on the frontier.

1. In the `yoga-studio` folder, open the map: `gh issue view <number> --web`, with its number. Find the frontier yourself: open sub-issues with no Blocked icon and no assignee.
2. Start Claude Code and type `/clear`.
3. Type `/wayfinder #20`, with your map's number. To choose the ticket yourself, name it in the same message.
4. Watch its first move. It should name a ticket by its title and assign it before doing anything else. You should see your name on that Issue.
5. Work the ticket the way its type says: answer a grilling round, react to a prototype, or carry on while research runs.
6. When it says the ticket is settled, check the tracker, not the chat:
   - the ticket has a resolution comment and is closed;
   - the map has exactly one new line under Decisions so far, naming the ticket by its title;
   - cleared fog, out-of-scope tickets and invalidated tickets are dealt with, or there were none;
   - any word you pinned down is in the project's `GLOSSARY.md`, in your `yoga-studio` folder (it stays a local change until you commit it; `git status` shows it).
7. Type `/clear`. The next ticket gets its own session.
````

```callout watch-out
The tickets here go by number so the exercises stay short. In the real map, and when the agent talks to you, tickets should be called by their titles. If you see a wall of bare numbers, ask for names.
```

In Matt's [wayfinder walkthrough](https://www.youtube.com/watch?v=F3lL98Pj90o), the chapters at 5:39 (working through maps) and 7:40 (ticket types and blocking) show this loop on a real map.

## Practice

### Which ticket is next?

Each line is a map's tickets, in map order. Pick the ticket a new session would take.

```checkpoint next-two-on-frontier
#31 closed · #32 assigned · #33 blocked by #32 · #34 open · #35 open. You don't name a ticket.
- [ ] #32
- [ ] #33
- [x] #34
- [ ] #35
Why: #32 is claimed, and #33 waits on it. #34 and #35 are both on the frontier, and the first in map order goes first.
```

```checkpoint next-both-blockers-closed
#31 closed · #32 closed · #33 blocked by #31 and #32 · #34 blocked by #33.
- [x] #33
- [ ] #34
- [ ] No ticket
- [ ] #31
Why: Both of #33's blockers are closed, so it's unblocked, open and unclaimed. #34 still waits on #33.
```

```checkpoint next-named-ticket
#31 closed · #33 and #34 are on the frontier · you name #35, which is open and unblocked.
- [ ] #34
- [x] #35
- [ ] #33
- [ ] No ticket
Why: A ticket you name always wins over map order.
```

```checkpoint next-empty-frontier
#31 closed · #32 assigned · #33 blocked by #32 · #34 blocked by #33.
- [ ] #32
- [ ] #33
- [ ] #34
- [x] No ticket
Why: Everything open is either claimed or blocked, so the frontier is empty. Let the session working on #32 finish first.
```

```checkpoint next-later-in-order
#31 closed · #32 open, blocked by #34 · #33 assigned · #34 open.
- [x] #34
- [ ] #32
- [ ] #33
- [ ] No ticket
Why: #32 is open but waits on #34, and #33 is claimed. #34 is the only frontier ticket, even though it comes later in map order.
```

## Remember

```flashcards
Q: Why does a wayfinder session stop after one ticket?
A: Quality falls off long before the context window fills (the dumb zone), so you plan around the smart zone. Each ticket is sized to one session; research is the only exception.

Q: Why does `/clear` cost nothing between tickets?
A: The ticket and the map hold everything the next session needs, so the conversation is disposable. The old session can still be resumed.

Q: On GitHub Issues, what does claiming a ticket look like? And with local files?
A: On GitHub, the ticket is assigned to you. With local files, it's a `Status: claimed` line. Either way, it's saved before any work.

Q: Which three questions find the frontier?
A: Is the ticket open? Is everything blocking it closed? Is it unclaimed? If two pass, the first in map order goes first, unless you name one.

Q: How does the agent know how to settle a ticket?
A: From its `wayfinder:<type>` label (a `Type:` line with local files). The question in the body never states the type.

Q: A ticket is settled. What changes on the tracker?
A: A resolution comment and a closed Issue, and exactly one gist line on the map, linking to it. The map never copies the answer.

Q: What does a session tidy before it stops?
A: Cleared fog becomes tickets, tickets past the destination are closed with an Out of scope line, invalidated tickets are fixed or deleted, and pinned-down words go into `GLOSSARY.md`.

Q: Can you run two tickets at once?
A: Yes, each claimed first, but one at a time is the safer default: two grilling sessions share no context, so they can ask you the same question. Research is the comfortable exception.
```

## Final test

```final-test where-full-answer-goes
A ticket is settled. Where does the full answer go?
- [ ] In the map, under Decisions so far
- [x] In a resolution comment on its ticket
- [ ] In a new ADR made for that ticket
- [ ] Only in the chat for that session
Why: The ticket holds the full answer. A decision lives in exactly one place.
```

```final-test what-map-gets
A ticket is settled. What does the map get?
- [ ] A full copy of the answer
- [ ] Nothing at all; it stays as it was
- [ ] A new part of its own for the ticket
- [x] One gist line that links to the ticket
Why: The map is an index, not a store: one line naming the ticket by its title, with the gist and a link.
```

```final-test fog-gets-sharp
An answer makes a fog item sharp enough to state precisely. What happens?
- [ ] It stays in the fog part for now
- [ ] It's answered now, in this session
- [x] It becomes a new ticket; its fog line goes
- [ ] It moves under Out of scope
Why: It graduates into a new ticket with its blockers wired, and the fog line goes, so it lives in one place. Settling it waits for its own session.
```

```final-test past-the-destination
A ticket turns out to sit past the destination. What happens?
- [x] Close it, and add an Out of scope line
- [ ] Settle it anyway, since it exists
- [ ] Move it into Not yet specified
- [ ] Record it under Decisions so far
Why: Ruling something out of scope is a scoping act, not a step on the route: close it, leave one line saying why, and keep it out of Decisions so far.
```

```final-test after-unblocking
You've resolved a ticket, and that unblocked another one. What now?
- [ ] Settle the newly unblocked one too
- [ ] `/compact`, then settle the next one
- [x] Check the tracker, then type `/clear`
- [ ] Ask the agent for a summary first
Why: One ticket per session. The next one gets a fresh session, and the tracker already holds everything it needs.
```

```final-test pick-from-folder
A map's tickets read, in map order: #31 closed · #32 assigned · #33 blocked by #31 · #34 blocked by #32 · #35 open. You start a session without naming a ticket. Which one does it take?
- [ ] #32
- [x] #33
- [ ] #34
- [ ] #35
Why: #32 is claimed, so another session has it, and #34 waits on #32. #33's only blocker is closed, so #33 and #35 are both open, unblocked and unclaimed, and the first in map order goes first.
```

```final-test half-window-left
Your session has resolved "Which passes and memberships move across?", which unblocks the task to get the studio owner's rules. The agent offers to start that task too, since less than half its context window is used. What do you do?
- [ ] Agree, since half the window is still free
- [ ] Run `/compact` first, then let it go on
- [ ] Copy the full answer into the map first
- [x] Check the ticket and the map, then `/clear`
Why: One ticket per session, research excepted, and the budget is the smart zone, not the window: quality falls off long before the window fills. The answer already lives on the ticket and the map, so clearing costs nothing and the task gets a fresh session. A full copy in the map would be a second copy that goes stale.
```


```sources
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-local.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md), Matt Pocock's Skills
- [The /wayfinder Skill](https://www.aihero.dev/skills-wayfinder), Matt Pocock, updated 2026-08-24
- [/wayfinder: Nothing is too big to plan anymore](https://www.youtube.com/watch?v=F3lL98Pj90o), Matt Pocock, 2026-07-30
- [Smart zone (AI Coding Dictionary)](https://www.aihero.dev/ai-coding-dictionary/smart-zone), Matt Pocock
- [Clearing (AI Coding Dictionary)](https://www.aihero.dev/ai-coding-dictionary/clearing), Matt Pocock
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
- [research: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/research/SKILL.md), Matt Pocock's Skills
- [wayfinder/research: unclear who runs git for research agents, and no review gate before closing AFK tickets (#1241)](https://github.com/mattpocock/skills/issues/1241), sant3e, 2026-10-09
```
