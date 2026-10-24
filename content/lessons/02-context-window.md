---
title: The context window
slug: context-window
order: 2
part: 1
image: /photos/context-window.jpg
imageAlt: Snow-capped mountains under low cloud, seen through a dark three-pane window.
imageCredit: Daniel Seßler
---

An agent can only think about what fits in one window of text, and it thinks best while that window is far from full. Here's how to keep it there.

```goals
- You'll be able to explain what tokens and the context window are, and read `/context` to see what's filling yours.
- You'll be able to explain why an agent gets worse long before its window is full, and spot the signs that it has left the Smart zone.
- You'll be able to choose between continuing, `/clear`, `/handoff`, a subagent and `/compact` at a Phase boundary, in Matt's order.
- You'll be able to say when `/handoff` is the right move and what its file carries.
```

## Why it matters

You're two hours into a session with Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal). Early on you told it "never edit the migrations folder". For an hour it did great work. Now it has edited a migration, re-broken a test it fixed earlier, and described a function that doesn't exist. No error, no crash. The agent just got worse.

The usual cause: the conversation got too long. Everything the agent knows about your work has to fit in one window of text, and the fuller that window, the worse it reasons.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, says the skill issue he sees most often is ==not thinking about the context window==. (A Skill is a short instruction file the agent loads when you type its name, like `/handoff`, or when a task matches its description; see [Skills](/learn/skills).) This Lesson covers what fills the window, where quality drops, and what to do when one piece of work ends.

## The idea: tokens and the window

**Tokens.** Models read tokens, not words: small chunks of text, roughly three-quarters of an English word each, so 1,000 tokens is about 750 words. Hashes, generated IDs and minified code split into many tokens. Everything is counted in tokens: what you pay, how fast it runs and how much fits.

**The context window** is everything the model sees when it answers: its instructions, the whole conversation so far, and every result its tools have handed back. If something isn't in the window, the model doesn't know it exists. It keeps nothing between requests: on every turn, Claude Code sends the whole window again. A session (one Claude Code conversation, from starting `claude` until you clear it or quit) slowly fills the window, and the next session starts empty. Matt compares agents to the man in *Memento* who wakes up with no memory of yesterday.

**What's in it before you type anything:**

- Claude Code's system prompt (its built-in instructions) and the list of tools it can use
- your `CLAUDE.md`, a file of standing instructions for the project
- the names and one-line descriptions of your Skills (a Skill's full text loads only when it's used, and Skills only you can start keep even their descriptions out)
- the names of tools from MCP servers, plug-ins that connect the agent to other services (their full details load only when used)

**What fills it as you work:** every message, every file the agent reads, every command's output and the text of every Skill it loads. File reads are usually the biggest cost.

Type `/context` to see the breakdown. It's a Built-in command: it comes with Claude Code and isn't a Skill. Here are the main rows it showed halfway through building this site, on a model with a 1M-token window:

| Row | Tokens |
|---|---|
| Total used | about 205k of 1M (20%) |
| Messages: the conversation, file reads and command output | 166k |
| System tools | 16k |
| Skills (122 installed) | 9.9k |
| System prompt | 4.3k |
| MCP tools (412 of them, details loaded on demand) | 4.3k |
| Free space | 762k |

The conversation is nearly everything; the fixed startup costs come to under 40k, and 412 plug-in tools cost only 4.3k because their details stay out until used.

```checkpoint startup-tokens
You open a brand-new session in a project and type nothing. `/context` already shows about 20k tokens used. Where did they come from?
- [x] Instructions and tool lists loaded at startup.
  > Right. The system prompt, tools, `CLAUDE.md` and Skill descriptions are in the window before you type a word.
- [ ] Your last session, which Claude Code carries over so you don't start cold.
  > Each session starts without the previous conversation. That's exactly why handoffs and `CLAUDE.md` exist.
- [ ] Every file in the project, which the agent reads in advance.
  > Files enter the window only when the agent reads them, as you work.
- [ ] Your token usage so far this month.
  > `/context` shows what's in this session's window, not your bill.
```

## The Smart zone: quality, not size

Here's the surprise: answers don't stay equally good until the window is full. Each new token has to be weighed against every token already there, so the more the window holds, the thinner the model's attention is spread. (Matt likens it to adding a team to a football league: each new team adds a match against every other.) Models also weigh the start and end of a long conversation more than the middle. Anthropic calls the result context rot.

Matt borrows a picture from Dex Horthy, who runs the company HumanLayer. Every session has a **Smart zone** at the start, where the model reasons sharply, and a dumb zone after it, where it gets sloppy, forgetful and confidently wrong. Same model, same tools, just more context.

Where's the line? Matt's `ask-matt` Skill puts the Smart zone at about 150k tokens on today's best models, as a rule of thumb. He has said 100k, 120k and 140k at other times. Treat it as a budget, not a law.

The line has nothing to do with window size. Current Claude models run with 1M-token windows by default, and a session can be deep in the dumb zone with 85% of its window free. Asked about 1M windows at an April 2026 workshop, Matt said Claude Code had "shipped a lot more dumb zone": great for finding facts in huge documents, not for coding. ==Plan around the Smart zone, not the window.==

**The signs** you've left it: the agent forgets an instruction from many turns ago, repeats a mistake it already fixed, or says something its own context contradicts. There's never an error message, so watch the count with `/context`, or with a status line (a line under the prompt box) showing tokens used, which Matt calls essential.

**The fix is removing context, not adding it.** Pasting the ignored instruction again, in capitals, adds tokens to a window that already holds too many. What works is a smaller window, using the moves below.

```scene meter
title: One feature on a 1M window (illustrative)
zone: 15
# You start `claude`. Before you type, the system prompt, tools, `CLAUDE.md` and Skill descriptions are already loaded.
fill: 2% | Startup, about 20k
# `/grill-with-docs`: questions, answers, and the agent reading files to look up facts.
fill: 7% | Grilling, about 70k
# `/to-spec` and `/to-tickets` in the same window, so they build on the same thinking.
fill: 10% | Spec and tickets, about 100k
# A Phase boundary. The decisions now live in files, so you type `/clear` and the window drops back to its startup cost.
fill: 2% | After clear, about 20k
# `/implement` on ticket 1: file reads, test runs, edits.
fill: 9% | Ticket 1, about 90k
# You skip the `/clear` and start ticket 2 on top. Around 150k you leave the Smart zone, with 85% of the window still free. Nothing warns you.
fill: 16% | Ticket 2, about 160k
# Ticket 2 ends with the agent re-breaking a test it fixed in ticket 1. The fix was the `/clear` you skipped.
fill: 19% | End of ticket 2, about 190k
```

```checkpoint quality-not-size
`/context` says 17% of a 1M window is used. The agent has started ignoring a naming rule you set early on, and it has re-broken a test it fixed an hour ago. What's the best explanation?
- [ ] The window is nearly full, so the oldest messages have been cut.
  > 83% of the window is free. Nothing has been cut.
- [x] It has drifted past the Smart zone; free space doesn't help.
  > Right. About 170k tokens is past Matt's rule of thumb, whatever the window size. Quality drops long before the window fills.
- [ ] It only reads your most recent message.
  > It reads the whole window on every turn. The trouble is how much is in there.
- [ ] Something is broken in Claude Code; reinstall it.
  > Nothing is broken. Every model behaves this way as its context grows.
```

## Tools for a crowded window

**`/clear`** empties the working context and starts a fresh conversation. Your files and `CLAUDE.md` are untouched, and the old conversation isn't deleted: `/resume` can reopen it. But it doesn't come back into the session you're in. It's instant and frees the whole window.

**`/compact`** replaces the conversation with a summary and carries on from there. You can steer what it keeps: `/compact focus on the API changes`. It takes a minute, costs tokens, and it's lossy. In Matt's 2025 demo it shrank 77k tokens of messages to about 4k, keeping the intent and dropping the detail. Which detail goes is the summariser's call, not yours.

**Auto-compact** is Claude Code compacting for you. It's on by default and fires only when the window is nearly full: far into the dumb zone, when the model is least sharp, as Thariq Shihipar of Anthropic points out. A bad moment to choose what to keep. (`/autocompact` changes when it fires.) Newer: if a long conversation (200k tokens or more) sits idle for nearly an hour, Claude Code compacts it while you're away and leaves a line starting "Compacted while idle". Either way, ==a rule you only said in chat may not survive==. Put lasting rules in `CLAUDE.md`, which is reloaded from disk after every compaction.

**`/btw`** asks a side question, like `/btw what does this regex flag do?`, whose answer never enters the conversation: handy for lookups the main work doesn't need.

**Subagents.** A subagent is a helper agent with its own fresh context window. It does a job, like searching thirty files, and hands back only a short report, so all that reading stays out of your window. Claude Code starts them on its own for big searches, and you can ask: "Use a subagent to find every file that calls `getLessonBySlug`." Matt's code-review Skill runs its two reviewers in subagents so they judge the code with fresh eyes. The catch: whatever the report leaves out, you never see. Thariq's test: will you need the raw output again, or just the conclusion?

```checkpoint side-question
Halfway through implementing a feature, you want to know what a regular-expression flag means. The answer won't matter to the work, and you don't want it cluttering the conversation. What do you type?
- [ ] `/clear`, then ask.
  > That throws away the feature work to ask one small question.
- [ ] `/compact`, then ask.
  > Compacting mid-task makes the agent lose the thread, and the answer still lands in the conversation.
- [x] `/btw`, then your question.
  > Right. A `/btw` answer never enters the conversation history.
- [ ] Your question, then `/compact` to tidy up afterwards.
  > The answer joins the conversation first, and then you pay for a lossy summary in the middle of the work.
```

## At a Phase boundary: Matt's order

So when do you use which? Matt's answer is in his `ask-matt` Skill (a guide to which of his Skills fits your situation), in `PHASE-BOUNDARIES.md`.

A **Phase** is a chunk of work inside a session: the grilling, the implementation, the QA (checking by hand that it works). It ends when you feel that piece is done. The gap before the next one is the Phase boundary, the ==only place to decide what happens to the context==. Mid-Phase, keep going or hand the rest to subagents; compacting mid-Phase makes the agent lose the thread.

At the boundary, ask five questions in order. The first yes wins.

1. **Can you continue?** Yes if the next Phase needs this one firsthand, or if there's enough Smart zone left (about 150k) for it to fit. Grilling into implementation is the classic yes: the build wants the reasoning itself, not a summary of it. Continuing costs nothing and loses nothing.
2. **Is everything here irrelevant to what's next?** Then `/clear`. It's the cheapest move. But a mistake only goes one way: clear a context you still needed and the *why* behind your decisions is gone for good.
3. **Does the work need to travel?** Then `/handoff` (next section).
4. **Can the next task run without you?** Matt calls this AFK, away from keyboard. Send it to a subagent and leave your session untouched. Automated review of the diff (the changes you've made) is the usual case.
5. **Otherwise, `/compact`**, with an instruction such as `/compact we're going to QA this area`. Matt calls it "the default, not the first reach": the tree lands there often, but only after the cheaper or more precise options say no.

Every move except continuing swaps the session as it happened for a summary of it. That's the price, and why continuing comes first.

Matt's Main flow, his path from idea to shipped (see [The main flow](/learn/main-flow)), turns this into fixed rules. Keep `/grill-with-docs`, `/to-spec` (decisions into a spec) and `/to-tickets` (the spec into tickets, tasks small enough for one session) in one unbroken window; don't clear or compact until after `/to-tickets`. Then `/clear` between `/implement` tickets, since each stands on its own. If you near the Smart zone before `/to-tickets`, `/compact` at the nearest boundary. And run `/retro` in the session it looks back on, before you clear.

```scene flow
title: One feature, five decisions (illustrative)
node: continue | 1. Can you continue
node: clear | 2. Irrelevant? Clear
node: handoff | 3. Travelling? Hand off
node: subagent | 4. Runs AFK? Subagent
node: compact | 5. Otherwise compact
# Grilling a dark-mode toggle ends at about 50k tokens. The build needs that reasoning firsthand, so question 1 says yes: **continue**.
at: continue
# Mid-build you spot a messy settings file that's out of scope. You fork it to a second agent with `/handoff` and keep building.
at: handoff
# The toggle works. A review of the diff should come from fresh eyes and needs no steering from you, so a **subagent** takes it.
at: subagent
# QA is next. The window is near the Smart zone's edge, the build's context matters, nothing is travelling, and QA needs you: `/compact we're going to QA dark mode`.
at: compact
# QA passes and you run `/retro`. The next task is an unrelated bug that nothing here helps with: `/clear`.
at: clear
```

```checkpoint continue-first
You've finished grilling a small change to a book-club site at about 50k tokens. Next you'll build it, in the same repo, with you watching. What does Matt's tree say?
- [ ] `/compact`, since it's the default.
  > It's the default only after the four questions above it say no. Here the first one says yes.
- [ ] `/clear`, since the decisions are made.
  > The build needs the reasoning behind those decisions. Clearing loses the why for good.
- [ ] `/handoff`, so the build starts from a clean brief.
  > Nothing is travelling: same tool, same folder, same person.
- [x] Carry on in this session.
  > Right. The next Phase needs this one firsthand, and there's plenty of Smart zone left. Continuing costs nothing.
```

## `/handoff`: when the work has to travel

`/handoff` is the one Skill in this Lesson. It's user-invoked: only you can start it, by typing `/handoff` at the start of a message, optionally followed by what the next session is for.

It writes the conversation into one markdown file in your computer's temporary folder, not your project. The file:

- carries what's in flight, why, and what's next, aimed at the purpose you gave
- includes a "suggested skills" section naming the Skills the next agent should load
- points to specs, plans, decision records, tickets, commits and diffs by path or link instead of copying them in
- has keys, passwords and personal details removed

Matt's docs say what it buys is "portability, not compression". So it's narrow, and there are only ==four reasons to reach for it==:

1. **Switching harness**, the program that drives the model: say, from Claude Code to Codex, OpenAI's coding agent. The new one can't see the old conversation.
2. **Moving to another folder or repo.** A prototype folder is the usual case.
3. **Sending the work to a colleague.**
4. **Forking a side task you found mid-Phase**, while you carry on with the main one.

Anything else, like moving from grilling to building in the same folder, isn't a handoff: go back to the tree.

The fourth reason is the one people skip. You don't end your session; you hand a copy of what matters to a second agent and keep working. Matt's prototype detour works this way: `/handoff` out, `/prototype` (a quick throwaway build that answers one question) in a fresh session, then `/handoff` the answer back. See [Prototype](/learn/prototype).

Habits from Matt's docs: temporary folders get emptied, so if the next session isn't starting within the hour, copy the file somewhere safe. Point the next session at the file's path; pasting its text into a shell command can silently cut it short. Read it first and soften anything stated as fact that was only assumed; the next agent won't re-check. And if something will still be true next month, it belongs in `CLAUDE.md`, not a handoff.

```scene chat
title: Forking a side task mid-grilling (illustrative)
# Grilling a recipe site, you notice the ingredient parser needs a rewrite. It's out of scope, so you hand it off and say what the next session is for.
you: `/handoff` Next session: rewrite the ingredient parser. Out of scope for this feature.
# The agent writes one markdown file to your temporary folder, not your project.
agent: Wrote `/var/folders/…/T/handoff-ingredient-parser.md`. It covers what's broken and why, points to `src/parser.ts` and the spec by path instead of copying them, and suggests the `/tdd` Skill.
# Your grilling carries on in the same session. Ruling the parser out even settles a question.
agent: With the parser out of scope, Q4 no longer applies. ❓ **Q5** - **Units**: Should recipes show metric only? ➡️ Yes.
# In a second terminal, you start a fresh session in the same repo and point it at the file.
you: Read /var/folders/…/T/handoff-ingredient-parser.md, then continue.
# The new agent picks up the work without asking you to explain it again.
agent: Loading `/tdd`, as the handoff suggests. First slice: a failing test for "2 1/2 cups".
```

```checkpoint handoff-reason
Which of these is a job for `/handoff`?
- [ ] You'll keep building in the same folder and want a lighter context.
  > Nothing travels. That's `/compact`, at a Phase boundary.
- [ ] A ticket is done and the next one is fully written down.
  > The old context is disposable, so `/clear` is cheaper.
- [x] A teammate will finish the feature on her laptop tomorrow.
  > Right. Sending the work to a colleague is one of the four reasons: the work has to travel.
- [ ] You want the diff reviewed while you step away.
  > A tightly scoped job that needs no steering goes to a subagent.
```

## How Matt and others use it

**Matt Pocock:**

- **Clearing is his default.** In his October 2025 video on context windows, he got nervous with about 50k tokens left in a 200k window, and cleared; `/compact` was for keeping the gist. At his April 2026 workshop he went further: he dislikes compacting, because a cleared session always starts from the same known state.
- **He watches the count.** At that workshop he showed a status line with his exact token count. In 2025 he was already wary of anything that bloats every session: extra MCP servers and long rules files.
- **He sizes work to the Smart zone.** In his July 2026 walkthrough he judged about 100k tokens of budget plenty for a small cleanup, and showed `/to-spec` squeezing a 46.1k-token grilling into a spec. Each ticket is sized to one Smart zone, and he clears between tickets.
- **He hands off most while grilling.** In his May 2026 video on the Skill, he forked an out-of-scope task to a second agent mid-grilling, and handed off to a prototype session that grew to 169k tokens, far more than would have fitted beside the grilling. He always says what the next session is for.
- **Reviews get a fresh window**, so the reviewer works in the Smart zone, not at the tired end of the build (April 2026 workshop).

**Others:**

- Thariq Shihipar, on Anthropic's blog in April 2026, treats every finished turn as a decision point, and advises compacting yourself, with a steer, before auto-compact does.
- Anthropic's help centre suggests: if your next prompt would make sense in a brand-new terminal, clear first.
- Nowshad Jawad (May 2026) used `/handoff` mid-grilling to send a naming refactor to a second session, then carried on.
- On Reddit in July 2026, one developer put their quality drop at about 100k tokens, and another runs `/handoff` several times a day.

## Try it yourself

````try
You need Claude Code installed and signed in, and Git (see [Start here](/learn/start-here)).

1. In your terminal, copy this site's code and go into it:

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped
cd idea-to-shipped
```

2. The last step uses Matt's Skills. If you haven't installed them, do it now. Then start Claude Code, and choose Yes if it asks whether you trust this folder:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
claude
```

3. Type `/context`. Note Total used, Messages and Free space, and which row is biggest.
4. Fill the window on purpose. Type this, then `/context` again (if it asks permission to read files, choose Yes):

```text
Read every .ts and .tsx file in src/app and give me a one-line summary of each.
```

5. Type `/btw how many files did you just read?`, then `/context`.
6. Type `/clear`, then `/context`. Type `/resume` to see the old conversation still listed, then press Esc to close the list.
7. Ask for the same reading through a helper, then `/context`:

```text
Use a subagent to read every .ts and .tsx file in src/app and report back only a one-line summary of each.
```

8. Type `/compact keep only the one-line summaries`, then `/context`. Then ask: "Which file handles the comments API?"
9. Optional: type `/handoff Next session: write a glossary of this repo's terms`. Ask for the file's path if it isn't shown, and open it.

Press Esc to stop the agent at any point, and type `/exit` when you're done.

**It's working if:**

- [ ] You can name the biggest row in your first `/context`.
- [ ] Messages grew clearly in step 4, and much less in step 7.
- [ ] `/btw` answered without Messages growing.
- [ ] After `/clear`, Messages was near zero, but `/resume` still listed the old conversation.
- [ ] After `/compact`, Messages dropped and the agent could still answer from the summary.
- [ ] (Optional) The handoff file is short, points to files by path, has a suggested-skills section and holds no secrets.
````

## Common mistakes

- **The kitchen-sink session.** Unrelated tasks in one session all spend the same Smart zone. New task, new session.
- **Reading free space as headroom.** "80% free" says nothing about how sharp the agent is.
- **Pasting big files.** Give the path and let the agent read what it needs.
- **Letting auto-compact pick the moment.** It fires when the agent is least sharp, often mid-task. Choose your own boundary.
- **Everything else from this Lesson:** re-explaining instead of shrinking the window, rules only in chat, `/compact` first or mid-Phase, clearing before `/to-tickets`, and `/handoff` when nothing travels.

```site-story
**Clearing between unrelated jobs.** Before the build, I ran `/setup-matt-pocock-skills`, typed `/clear`, compared OpenSpec with Matt's Skills in a separate conversation, typed `/clear` again, and only then started building. None of those conversations needed the others.

**Then one very long session.** The whole first version of this site was built in one unbroken session: `/grilling`, `/domain-modeling`, `/wizard`, `/prototype`, four rounds of `/tdd` and two code reviews, covering all six tickets. The `/context` reading above comes from the middle of it: about 205k of 1M, the conversation alone at 166k, already past Matt's rule of thumb. It ended at around 380k tokens. I never cleared or compacted.

**The Main flow session kept the rule.** When I built [The main flow](/learn/main-flow), `/to-spec`, `/to-tickets` and `/implement-spec` all ran in the grilling session, which grew to about 247k. After I'd been away for about an hour, Claude Code idle-compacted it to 31k. That was well after `/to-tickets`, when the spec and tickets were already files.

**Not used yet:** I've never typed `/compact` or `/handoff` myself. My prototype ran inside the build session, kept on a `prototype/lesson-page` branch, where Matt's flow would bridge the detour with `/handoff`.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| See what's filling the window | `/context` |
| A quick side question | `/btw <question>` |
| A big search where you only need the answer | Ask for a subagent |
| Phase over; the next one needs it firsthand and fits | Continue |
| Phase over; nothing here matters next | `/clear` |
| Another tool, folder or person, or a side task to fork | `/handoff <what the next session is for>` |
| The next task can run without you | A subagent |
| None of the above | `/compact <what to keep>` |
| A rule that must last | `CLAUDE.md`, not chat |
| Main flow | Grill, spec and tickets in one window; `/clear` between tickets |

## Final test

```test scenario-find-callers
You're grilling a change to a recipe site and need the list of files that call `formatServings`. You don't want forty file reads piling into the conversation you're grilling in. What do you do?
- [ ] Ask the agent to read them all here, so it knows them firsthand.
  > Forty files of raw text would eat your Smart zone, and you only need the list.
- [x] Have a subagent search and report back only the paths.
  > Right. The reading happens in the helper's own window; only the short report lands in yours.
- [ ] Type `/clear` first, so there's room for the search.
  > That throws away the grilling to make room for work a helper could do elsewhere.
- [ ] Type `/compact` first, then search.
  > Compacting mid-Phase loses the thread, and the forty reads still land in your window afterwards.
```

```test scenario-switch-harness
You've spent the morning in Claude Code on a photo-gallery site. This afternoon you want to finish the feature in Codex, a different coding agent. What carries the work across?
- [ ] `/compact`, then open Codex.
  > A compacted summary lives inside the Claude Code session. Codex can't see it.
- [ ] A subagent, told to finish it in Codex.
  > A subagent runs inside Claude Code and reports back there. It doesn't move your work to another tool.
- [ ] Nothing: Codex can read Claude Code's conversation.
  > Each harness sees only its own sessions. That's why a file is needed.
- [x] `/handoff`, then point Codex at the file.
  > Right. Switching harness is one of the four reasons. The markdown file travels where a summary can't.
```

```test scenario-next-ticket
You've just finished `/implement` on ticket 2 of 5 for a book-club site. Ticket 3 stands on its own, and everything it needs is written in the ticket and the spec. `/context` shows 90k tokens. What's next?
- [x] `/clear`, then `/implement` ticket 3.
  > Right. Each ticket is self-contained, so the last one's context is disposable, and clearing is the cheapest move.
- [ ] `/compact`, so ticket 2's reasoning carries into ticket 3.
  > Ticket 3 doesn't need it. You'd pay for a summary of context that's now irrelevant.
- [ ] `/handoff` to a fresh session in the same folder.
  > Nothing is travelling. Same tool, same folder: no file needed.
- [ ] Keep going: 90k is well inside a 1M window.
  > Ticket 3 would start at 90k and likely end past the Smart zone. Window size isn't the limit.
```

```test scenario-near-zone
In a repo, you've finished `/grill-with-docs` and `/to-spec` for a multi-session build. `/context` shows 160k tokens, and you haven't run `/to-tickets` yet. What does `ask-matt` say to do?
- [ ] Keep going; most of the 1M window is still free.
  > Free space isn't the limit. At 160k you'd write the tickets in the dumb zone.
- [ ] `/clear`, then run `/to-tickets` in a fresh window.
  > No clearing until after `/to-tickets`, so the tickets build on the same thinking as the spec.
- [x] `/compact` here, saying what the tickets need.
  > Right. Near the Smart zone before `/to-tickets`, compact at the nearest Phase boundary and carry on.
- [ ] `/handoff` to a new session in the same folder.
  > Nothing is travelling, so a handoff file buys nothing that `/compact` doesn't.
```

```test spot-rule-in-chat
Early in a long session, Sam told the agent "never edit the migrations folder". Hours later, after a line saying the conversation had been compacted, the agent edits a migration. Spot the mistake.
- [ ] Sam should have typed the rule again every few messages to keep it fresh.
  > That fills the window faster, and the rule still lives only in the conversation.
- [ ] Sam should have turned auto-compact off for good.
  > Then the window just keeps filling, deeper into the dumb zone. Where the rule lived was the problem.
- [x] The rule lived only in chat, where a summary can drop it.
  > Right. A summary keeps the gist, not every line. Lasting rules belong in `CLAUDE.md`, which is reloaded from disk after compacting.
- [ ] Sam should have given the rule with `/btw`.
  > A `/btw` answer never enters the conversation, so a rule given that way wouldn't stick at all.
```

```test spot-compact-first
Ana ends every Phase with `/compact`, even when the next task has nothing to do with the last one. Spot the mistake.
- [ ] She should use `/handoff` instead, so nothing is lost.
  > A handoff is for work that travels, and it's a summary too.
- [ ] She should compact mid-Phase, before the context gets heavy.
  > Compacting mid-Phase makes the agent lose the thread. Decide at the boundary.
- [ ] She should never compact; it always wrecks the session.
  > `/compact` sits at the bottom of Matt's tree as the default, and the tree lands there often.
- [x] When the context is irrelevant, `/clear` is the move.
  > Right. Question 2 comes before question 5. Clearing is cheaper, and she loses nothing she needs.
```

```test spot-louder-rule
Deep into a long session, Raj's agent keeps ignoring his rule about naming files. He pastes the rule again, in capitals, three times in a row. Spot the mistake.
- [x] He's adding context when the fix is removing it.
  > Right. Past the Smart zone, more tokens make it worse. Start a smaller window at a boundary, and put the rule in `CLAUDE.md`.
- [ ] He should have used bold instead of capitals.
  > Formatting isn't the problem. The window holds too much.
- [ ] He should ask a subagent to remember the rule for him.
  > A subagent has its own window and reports back once. It can't hold rules for your session.
- [ ] He should paste it a fourth time, at the very start of his message.
  > Still adding. The model can see the rule; its attention is spread too thin to keep hold of it.
```

```test sequence-prototype-detour
Grilling a sign-up flow, you hit a question you can only answer by seeing it: one long form, or three short pages? The prototype will live in its own folder. Which order does Matt's detour follow?
- [ ] `/prototype` here → `/compact` → back to grilling
  > Building in the grilling session spends its Smart zone on throwaway code, and the summary flattens the thread.
- [x] `/handoff` → `/prototype` in a fresh session there → `/handoff` back
  > Right. The work travels out to the prototype folder and the answer travels back, while your grilling session stays as it was.
- [ ] `/clear` → `/prototype` → describe the answer from memory
  > Clearing throws away the grilling you still need when you come back.
- [ ] `/handoff` → `/prototype` in a fresh session → `/clear` the grilling session
  > The grilling still needs the answer. Hand it back; don't clear the session you're returning to.
```

```test predict-context-growth
You run `/context`, then ask the agent to read every file under `docs/` and summarise each one. You run `/context` again. Which row grew the most?
- [ ] Skills
  > Skill text loads only when a Skill is used. Reading files doesn't load one.
- [ ] System prompt
  > The system prompt is fixed at startup and doesn't grow as you work.
- [x] Messages
  > Right. File contents and the agent's replies land in the conversation, which is usually the biggest row.
- [ ] Memory files
  > Those are standing notes loaded at startup. Reading `docs/` doesn't change them.
```

```test why-big-window
A friend says: "My model has a 1M-token window, so I never need to clear." What's the strongest reply?
- [ ] "True: clearing was only needed on the old 200k models."
  > Window size was never the limit that matters. Quality drops long before either size fills.
- [x] "Its reasoning slips long before the window is full."
  > Right. The Smart zone is about 150k tokens as a rule of thumb, whatever the window size. Plan around the Smart zone, not the window.
- [ ] "Claude Code deletes your oldest messages after 200k."
  > It doesn't. It keeps everything until auto-compact summarises it, near the end of the window.
- [ ] "Big windows cost far more per token, so clear to save money."
  > Mostly they don't, and even when money is no object, a long session reasons worse.
```

```sources
- [handoff SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/handoff/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the Smart zone, context hygiene in the Main flow) and [PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/PHASE-BOUNDARIES.md) (the five ordered questions): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [The /handoff Skill](https://www.aihero.dev/skills-handoff), AI Hero docs (the four reasons, the fork case, practical habits), updated 2026-08-24, read 2026-10-23.
- [AI Coding Dictionary: Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) and [Token](https://www.aihero.dev/ai-coding-dictionary/token), Matt Pocock, updated 2026-09-24 and 2026-07-01, read 2026-10-23.
- [Most devs don't understand how context windows work](https://www.youtube.com/watch?v=-uW5-TaVXu4), Matt Pocock, 2025-10-22 (the most common skill issue 0:17, lost in the middle 3:45–4:52, `/context` and clearing at 50k left 5:10–5:54, the compact demo 5:56–6:57, MCP servers and rules files 7:06–7:48).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (Smart zone and dumb zone, credited to Dex Horthy 3:12–4:17; the *Memento* framing 7:27–7:35; status line 9:38–10:05; dislikes compacting 10:36–10:56; 1M windows 37:24–38:31; review in a fresh window 65:47–66:24).
- [/handoff is my new favourite skill](https://www.youtube.com/watch?v=dtAJ2dOd3ko), Matt Pocock, 2026-05-21 (dumb zone around 120k 2:02–3:06, forking an out-of-scope task 4:56–7:16, the prototype round trip and 169k session 7:20–9:13, always stating the purpose 11:29–11:40).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (140k and a 100k budget 10:28–10:58, `/to-spec` compressing 46.1k tokens 11:23–11:34, one ticket per Smart zone 12:25–12:37, clearing between tickets 13:53–14:39).
- [Explore the context window](https://code.claude.com/docs/en/context-window), [Commands](https://code.claude.com/docs/en/commands), [Settings](https://code.claude.com/docs/en/settings-reference) (auto-compact and idle compaction) and [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Claude Code docs, read 2026-10-23 (Claude Code 2.1.309).
- [Using Claude Code: session management and 1M context](https://claude.com/blog/using-claude-code-session-management-and-1m-context), Thariq Shihipar, Anthropic blog, 2026-04-15.
- [Models, usage, and limits in Claude Code](https://support.claude.com/en/articles/14552983), Claude Help Center, read 2026-10-23.
- [The Two Matt Pocock Skills I Use in Almost Every AI Coding Session](https://medium.com/@anmjawad007/the-two-matt-pocock-skills-i-use-in-almost-every-ai-coding-session-57c468938145), Nowshad Jawad, 2026-05-29.
- [r/vibecoding: adopting Matt's workflow](https://www.reddit.com/r/vibecoding/comments/1v0zm6n/), 2026-07-19, and [r/ClaudeCode: Matt Pocock tutorials](https://www.reddit.com/r/ClaudeCode/comments/1v90akt/), 2026-07-28.
```
