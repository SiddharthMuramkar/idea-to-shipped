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
- You'll be able to say what fills an agent's context window, and read `/context` to find what's taking the room.
- You'll be able to explain why an agent gets worse long before its window is full, and spot the signs that it has left the Smart zone.
- You'll be able to choose between continuing, `/clear`, `/handoff`, a subagent and `/compact` at a Phase boundary, in Matt's order.
- You'll be able to say when `/handoff` is the right move and what its file carries.
```

## Why it matters

You're two hours into one long conversation with Claude Code (Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal). Early on you told it "never edit the migrations folder" (the scripts that change your database). For an hour it did great work. Now it has edited a migration, re-broken a test it fixed earlier, and described a function that doesn't exist. No error, no crash. The agent just got worse.

The usual cause: the conversation got too long. Everything the agent knows about your work has to fit in one window of text, and the fuller that window, the worse it reasons.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, says the mistake he sees most often is ==not thinking about the context window==. (A Skill is a short instruction file the agent loads when you type its name, like `/handoff`, or when a task matches its description; see [Skills](/learn/skills).)

## The idea: tokens and the window

**Tokens.** Models (the AI behind the agent) read tokens, not words: small chunks of text, roughly three-quarters of an English word each, so 1,000 tokens is about 750 words. Everything is counted in tokens: what you pay, how fast it runs and how much fits. In token counts, k means thousand and M means million.

**The context window** is everything the model sees when it answers: its instructions, the whole conversation so far, and every result its tools (the actions Claude Code lets it take, like reading a file, searching or running a command) have handed back. If something isn't in the window, the model doesn't know it exists. A session (one Claude Code conversation, from starting `claude` until you clear it or quit) slowly fills the window, and the next session starts without any of that conversation. Matt compares agents to the man in *Memento* who wakes up with no memory of yesterday.

**What's in it before you type anything:**

- Claude Code's system prompt (its built-in instructions) and the list of tools it can use
- your `CLAUDE.md`, a file of standing instructions for the project
- notes Claude Code saved for itself in earlier sessions in this project (auto memory, on by default)
- the names and one-line descriptions of your Skills (a Skill's full text loads only when it's used, and Skills only you can start keep even their descriptions out)
- the names of tools from MCP servers, connectors that link the agent to other services (their full details load only when used)

**What fills it as you work:** every message, every file the agent reads, every command's output and the text of every Skill it loads. File reads are usually the biggest cost.

Type `/context` to see the breakdown. It's a Built-in command: it comes with Claude Code and isn't a Skill. It shows the total used, then a row per category. Here's an example from a long session with a 1M-token window and a heavy setup (over a hundred Skills, hundreds of MCP tools), rounded:

| Row | Tokens |
|---|---|
| Messages: the conversation, file reads and command output | 166k |
| System tools | 16k |
| Skills | 10k |
| System prompt | 4k |
| MCP tools (details loaded only when used) | 4k |
| Memory files (your `CLAUDE.md` and auto memory) | under 1k |
| Free space | 762k |
| Autocompact buffer (kept free for compacting) | 33k |

The total is about 205k of 1M, nearly all of it conversation. The system prompt and tools alone are about 20k, so even a plain setup starts there.

```checkpoint startup-tokens
You open a brand-new session in a project and type nothing. `/context` already shows about 20k tokens used. Where did they come from?
- [x] Instructions, tool lists and saved notes loaded at startup.
  > Right. The system prompt, tools, `CLAUDE.md`, any auto-memory notes and Skill descriptions are in the window before you type a word.
- [ ] Your whole last conversation, which Claude Code reloads so you don't start cold.
  > A new session starts without the previous conversation; only short auto-memory notes carry over. That's why handoffs and `CLAUDE.md` exist.
- [ ] Every file in the project, which the agent reads in advance.
  > Files enter the window only when the agent reads them, as you work.
- [ ] Your token usage so far this month.
  > `/context` shows what's in this session's window, not your bill.
```

## The Smart zone: quality, not size

Answers don't stay equally good until the window is full. Each new token has to be weighed against every token already there, so the more the window holds, the thinner the model's attention is spread. (Matt likens it to adding a team to a football league: each new team adds a match against every other.) Models also weigh the start and end of a long conversation more than the middle. Anthropic calls the result context rot.

Matt borrows a picture from Dex Horthy, who runs the company HumanLayer. Every session has a **Smart zone** at the start, where the model reasons sharply, and a dumb zone after it, where it gets sloppy, forgetful and confidently wrong. Same model, same tools, just more context.

Where's the line? Matt's `ask-matt` Skill (his guide to which of his Skills fits your situation) puts the Smart zone at about 150k tokens on today's best models, as a rule of thumb. He has said 100k, 120k and 140k at other times. Treat it as a budget, not a law.

The line has nothing to do with window size. Current Claude models run with 1M-token windows by default, and a session can slip into the dumb zone with over 80% of its window still free. At an April 2026 workshop, Matt's take on 1M windows was that Claude Code had "shipped a lot more dumb zone": good for finding facts in huge documents, less good for coding. ==The Smart zone is your budget; the window size isn't.==

**The signs** you've left it: the agent forgets an instruction from many turns ago, repeats a mistake it already fixed, or says something its own context contradicts. There's never an error message, so watch the count with `/context`, or with a status line (a line under the prompt box) showing tokens used, which Matt calls essential. To get one, type `/statusline` and describe what it should show.

**The fix is removing context, not adding it.** Pasting the ignored instruction again, in capitals, adds tokens to a window that already holds too many. What works is a smaller window, using the moves below.

```scene meter
title: One feature on a 1M window (illustrative)
zone: 15
# You start `claude`. Before you type, the system prompt, tools, `CLAUDE.md` and Skill descriptions are already loaded.
fill: 2% | Startup, about 20k
# `/grill-with-docs`: the agent interviews you about the feature. Helpers it sends to look up facts report back briefly, so their reading stays out of your window.
fill: 7% | Grilling, about 70k
# `/to-spec` and `/to-tickets` turn the decisions into a written plan and a list of small tasks (tickets), in the same window so they build on the same thinking.
fill: 10% | Spec and tickets, about 100k
# Planning is done and the decisions now live in files, so you type `/clear`. The window drops back to its startup cost.
fill: 2% | After clear, about 20k
# `/implement` builds ticket 1: file reads, test runs, edits.
fill: 9% | Ticket 1, about 90k
# You skip the `/clear` and start ticket 2 on top. Around 150k you leave the Smart zone, with 85% of the window still free. Nothing warns you.
fill: 16% | Ticket 2, about 160k
# Ticket 2 ends with the agent re-breaking a test it fixed in ticket 1. The fix was the `/clear` you skipped.
fill: 19% | End of ticket 2, about 190k
```

```checkpoint quality-not-size
`/context` says 17% of a 1M window is used. The agent has started ignoring a naming rule you set early on, and it has re-broken a test it fixed an hour ago. What's the best explanation?
- [ ] Past the Smart zone, Claude Code quietly drops your early messages.
  > With 83% of the window free, nothing has been cut. Your early messages are all still there.
- [x] It has drifted past the Smart zone; free space doesn't help.
  > Right. About 170k tokens is past Matt's rule of thumb, whatever the window size. Quality drops long before the window fills.
- [ ] It only reads your most recent message.
  > It reads the whole window on every turn. The trouble is how much is in there.
- [ ] Your rule was worded too loosely; reword it and it will stick.
  > It followed the rule early on, so the wording worked. What changed is how much is in the window.
```

## Tools for a crowded window

Like `/context`, `/clear`, `/compact` and `/btw` are Built-in commands, not Skills.

**`/clear`** empties the working context and starts a fresh conversation. Your files and `CLAUDE.md` are untouched. The old conversation isn't deleted either: `/resume` lists it, and you can switch back to it as its own session. Nothing from it carries into the fresh one. It's instant and frees everything but the startup cost.

**`/compact`** replaces the conversation with a summary and carries on from there. You can steer what it keeps: `/compact focus on the API changes`. It can take a minute, it costs tokens, and it's lossy. In Matt's 2025 demo it shrank 77k tokens of messages to about 4k, keeping the intent and dropping the detail.

**Auto-compact** is Claude Code compacting for you, on by default. It fires only when the window is nearly full: far into the dumb zone, when the model is least able to judge what to keep, as Thariq Shihipar of Anthropic points out. (`/autocompact` sets when it fires.) Idle compaction is newer: a conversation of 200k tokens or more, left untouched in your terminal for nearly an hour with your computer awake, gets compacted and marked with a line starting "Compacted while idle". Either way, ==a rule you only said in chat may not survive==. Put lasting rules in your project's main `CLAUDE.md`, which is reloaded from disk after every compaction.

**`/btw`** asks a side question, like `/btw which file did we change first?`. It answers from what it knows and what's already in the conversation, without reading files or running commands, and the answer never joins the conversation.

**Subagents.** A subagent is a helper agent with its own fresh context window. It does a job, like searching thirty files, and hands back only a short report, so all that reading stays out of your window. Claude Code starts them on its own for big searches, and you can ask: "Use a subagent to find every file that calls `getLessonBySlug`." The catch: whatever the report leaves out, you never see. Thariq's test: will you need the raw output again, or just the conclusion?

```checkpoint side-question
Halfway through building a feature, you wonder what a regular-expression flag the agent just used means. You'll never need the answer for this feature. What do you type?
- [ ] `/clear`, then ask.
  > That throws away the feature work to ask one small question.
- [ ] `/compact`, then ask.
  > Compacting mid-task makes the agent lose the thread, and the answer still lands in the conversation.
- [x] `/btw`, then your question.
  > Right. A `/btw` answer is shown to you but never joins the conversation, so the feature work stays as it was.
- [ ] Your question, then `/compact` to tidy up afterwards.
  > The answer joins the conversation first, and then you pay for a lossy summary in the middle of the work.
```

## At a Phase boundary: Matt's order

When do you use which? Matt's answer is in his `ask-matt` Skill, in a file beside it called `PHASE-BOUNDARIES.md`.

A **Phase** is a chunk of work inside a session: the grilling (the agent interviewing you about your plan), the implementation, the QA (checking by hand that it works). It ends when you feel that piece is done. The gap before the next one is the Phase boundary, the ==only place to decide what happens to your context==. Mid-Phase, keep going or hand the rest to subagents; compacting mid-Phase makes the agent lose the thread. Forking a side task to another session with `/handoff` is fine mid-Phase too, because it leaves your own context as it is.

At the boundary, ask five questions in order. The first yes wins.

1. **Can you continue?** Yes if the next Phase needs this one firsthand, or if it fits in the Smart zone you have left (the zone ends around 150k tokens used). Grilling into implementation is the classic yes: the build wants the reasoning itself, not a summary of it. Continuing costs nothing and loses nothing, but only while the agent is still sharp: near the Smart zone's edge, the next Phase would run in the dumb zone.
2. **Is everything here irrelevant to what's next?** Then `/clear`. It's the cheapest move. But a mistake only goes one way: clear a context you still needed and the *why* behind your decisions is gone from the session you carry on in.
3. **Does the work need to travel?** Then `/handoff` (next section).
4. **Can the next task run without you?** Matt calls this AFK, away from keyboard. Send it to a subagent and leave your session untouched. Automated review of the diff (the changes you've made) is the usual case.
5. **Otherwise, `/compact`**, with an instruction such as `/compact we're going to QA this area`. Matt calls it "the default, not the first reach": the tree lands there often, but only after the cheaper or more precise options say no.

Every move except continuing means the next Phase works from something secondhand (a summary, a file or a helper's report), or from nothing at all after `/clear`, instead of the session as it happened. That's the price, and why continuing comes first.

Matt's Main flow, his path from idea to shipped (see [The main flow](/learn/main-flow)), turns this into fixed rules. Keep `/grill-with-docs` (grilling that also writes down the project's terms), `/to-spec` (turns the decisions into a spec, a written description of what to build) and `/to-tickets` (splits the spec into tickets, tasks small enough for one session) in one unbroken window; don't clear or compact until after `/to-tickets`. Then build each ticket with `/implement` and `/clear` between them, since each ticket stands on its own. If you near the Smart zone before `/to-tickets`, `/compact` at the nearest boundary. And run `/retro`, which reviews how the work went, in that session before you clear.

```scene flow
title: One feature, five decisions (illustrative)
node: continue | 1. Can you continue
node: clear | 2. Irrelevant? Clear
node: handoff | 3. Travelling? Hand off
node: subagent | 4. Runs AFK? Subagent
node: compact | 5. Otherwise compact
# Grilling a dark-mode toggle ends at about 50k tokens. The build needs that reasoning firsthand, so question 1 says yes: **continue**.
at: continue
# Mid-build you spot a messy settings file that's out of scope. Forking a side task is the one handoff that happens mid-Phase: you `/handoff` it to a second agent and keep building.
at: handoff
# The toggle works. A review of the diff should come from fresh eyes, not the tired end of the build, and needs no steering from you, so a **subagent** takes it.
at: subagent
# QA is next. It needs the gist of the build, not every word, and the window is near the Smart zone's edge, so question 1 says no. The context still matters (not 2), nothing is travelling (not 3), and QA needs you (not 4): `/compact we're going to QA dark mode`.
at: compact
# QA passes and you run `/retro`. The next task is an unrelated bug that nothing here helps with: `/clear`.
at: clear
```

```checkpoint continue-first
You've finished grilling a small change to a book-club site at about 35k tokens. Next you'll build it, in the same project folder, with you watching. What does Matt's tree say?
- [ ] `/compact`, since it's the default.
  > It's the default only after the four questions above it say no. Here the first one says yes.
- [ ] `/clear`, since the decisions are made.
  > The build needs the reasoning behind those decisions. Clearing drops the why from the session you build in.
- [ ] `/handoff`, so the build starts from a clean brief.
  > Nothing is travelling: same tool, same folder, same person.
- [x] Carry on, since the build needs the grilling.
  > Right. The next Phase needs this one firsthand, and there's plenty of Smart zone left. Continuing costs nothing.
```

## `/handoff`: when the work has to travel

`/handoff` is the one Skill this Lesson has you run. It's user-invoked: only you can start it, by typing `/handoff` at the start of a message, optionally followed by what the next session is for.

It summarises the conversation into one markdown file (plain text with light formatting) in your computer's temporary folder, not your project. The file:

- sums up the unfinished work: where it stands, the reasons behind it and the next steps, aimed at the purpose you gave
- includes a "suggested skills" section naming the Skills the next agent should load
- points to specs, plans, decision records, tickets, commits and diffs by path or link instead of copying them in
- has keys, passwords and personal details removed

Matt's docs say what it buys is "portability, not compression". So it's narrow, and there are only ==four reasons to reach for it==:

1. **Switching harness**, the program that drives the model: say, from Claude Code to Codex, OpenAI's coding agent. The new one can't see the old conversation.
2. **Moving to another folder or repo** (a project folder tracked by Git). A prototype folder is the usual case.
3. **Sending the work to a colleague.**
4. **Forking a side task you found mid-Phase**, while you carry on with the main one.

Anything else, like moving from grilling to building in the same folder, isn't a handoff: go back to the tree.

The fourth reason is the one people skip. You don't end your session; you hand a copy of what matters to a second agent and keep working. Matt's prototype detour works this way: `/handoff` out, `/prototype` (a quick throwaway build that answers one question) in a fresh session, then `/handoff` the answer back. See [Prototype](/learn/prototype).

Habits from Matt's docs: temporary folders get emptied, so if you won't open the next session soon, copy the file somewhere safe. Point the next session at the file's path; pasting the text into a terminal command can silently cut it short. Read it first and soften anything stated as fact that was only assumed; the next agent won't re-check. And if something will still be true next month, it belongs in `CLAUDE.md`, not a handoff.

```scene chat
title: Forking a side task mid-grilling (illustrative)
# Grilling a recipe site, you notice the ingredient parser needs a rewrite. It's out of scope, so you hand it off and say what the next session is for.
you: `/handoff` Next session: rewrite the ingredient parser. Out of scope for this feature.
# The agent writes one markdown file to your temporary folder, not your project.
agent: Wrote `/var/folders/…/T/handoff-ingredient-parser.md`. It covers what's broken and why, points to `src/parser.ts` by path instead of copying it, and suggests the `/tdd` Skill (Matt's test-first way of building).
# Your grilling carries on in the same session. Ruling the parser out even settles a question.
agent: With the parser out of scope, question 4 no longer applies. Question 5: should recipes show metric units only? I recommend yes.
# In a second terminal, you start a fresh session in the same repo and point it at the file.
you: Read /var/folders/…/T/handoff-ingredient-parser.md, then continue.
# The new agent picks up the work without asking you to explain it again. `/tdd` starts by agreeing with you what the tests should check.
agent: Loading `/tdd`, as the handoff suggests. Before any test: which parts should we test? I propose `parseQuantity()`, which reads amounts like "2 1/2 cups".
```

```checkpoint handoff-reason
Which of these is a job for `/handoff`?
- [ ] You'll keep building in the same folder and want a lighter context.
  > Nothing travels, so the tree goes on past question 3, usually to `/compact`.
- [ ] A ticket is done and the next one is fully written down.
  > The old context is disposable, so `/clear` is cheaper.
- [x] A teammate will finish the feature on her laptop tomorrow.
  > Right. Sending the work to a colleague is one of the four reasons: the work has to travel.
- [ ] You want the diff reviewed while you step away.
  > A tightly scoped job that needs no steering goes to a subagent.
```

## How Matt and others use it

**Matt Pocock:**

- **He'd rather clear.** In his October 2025 video on context windows, he said he'd start to worry with only about 50k of a 200k window left, and clear then; `/compact` was for keeping the gist. At his April 2026 workshop he went further: he dislikes compacting, because a cleared session always starts from the same known state.
- **He sizes work to the Smart zone.** In his July 2026 walkthrough, each ticket is sized to one Smart zone, and he clears between tickets.
- **He hands off most while grilling.** In his May 2026 video on the Skill, he forked an out-of-scope task mid-grilling, and handed off to a prototype session that grew to 169k tokens, far more than would have fitted beside the grilling. He always says what the next session is for.
- **Reviews get a fresh window** (April 2026 workshop), so the reviewer isn't stuck in the dumb zone at the end of the build.

**Others:**

- Thariq Shihipar (Anthropic's blog, April 2026) treats every finished turn as a decision point.
- Anthropic's help centre suggests: if your next prompt would make sense in a brand-new terminal, clear first.
- Nowshad Jawad (May 2026) used `/handoff` mid-grilling to send a naming refactor to a second session, then carried on.

## Try it yourself

````try
You need Claude Code installed and signed in. Step 1 uses Git, the tool that tracks and copies code projects (type `git --version` to check). If it isn't found, install it (see [Start here](/learn/start-here)), or skip step 1: on [the site's GitHub page](https://github.com/SiddharthMuramkar/idea-to-shipped) choose Code, then Download ZIP, and unzip it. In your terminal, type `cd` and a space, drag the folder with `src` inside onto the window, and press Enter.

1. In your terminal, copy this site's code and go into it:

```sh
git clone https://github.com/SiddharthMuramkar/idea-to-shipped
cd idea-to-shipped
```

2. Step 9 uses Matt's Skills, so install them if you haven't. Then start Claude Code, choosing Yes if it asks whether you trust this folder:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
claude
```

3. Type `/context`. Note the total used, the Messages row, and the biggest row of used tokens (not Free space or the buffer).
4. Fill the window on purpose. Type this, then `/context` again (if it asks permission to read files, choose Yes):

```text
Without using a subagent, read every .ts and .tsx file in src/app yourself and give me a one-line summary of each.
```

5. Type `/btw how many files did you just read?`. Read the answer, press Esc to close it, then type `/context`.
6. Type `/compact keep only the one-line summaries`, then `/context`. Then ask: "Without reading any files, which file handles the comments API?"
7. Type `/clear`, then `/context`. Type `/resume` to see the old conversation still listed, then press Esc to close the list.
8. Ask for the same reading through a helper, then `/context`:

```text
Use a subagent to read every .ts and .tsx file in src/app and report back only a one-line summary of each.
```

9. Optional: type `/handoff Next session: write a glossary of this repo's terms`. Ask for the file's path if it isn't shown. To read the file, open a second terminal, type `cat` and a space, paste the path and press Enter.

Press Esc to stop the agent at any point, and type `/exit` when you're done.

**It's working if:**

- [ ] You can name the biggest used row in your first `/context`.
- [ ] Messages grew clearly in step 4, and much less in step 8.
- [ ] `/btw` answered without Messages growing.
- [ ] After `/compact`, Messages dropped, and the agent named the comments file from its summary without reading anything.
- [ ] After `/clear`, Messages was near zero, but `/resume` still listed the old conversation.
- [ ] (Optional) The handoff file is short, points to files by path, has a suggested-skills section and holds no secrets.
````

## Common mistakes

- **The kitchen-sink session.** Unrelated tasks in one session all spend the same Smart zone. New task, new session.
- **Pasting big files.** Give the path and let the agent read what it needs.
- **Everything else from this Lesson:** reading free space as headroom, re-explaining instead of shrinking the window, rules only in chat, letting auto-compact pick the moment, `/compact` first or mid-Phase, clearing before `/to-tickets`, and `/handoff` when nothing travels.

```site-story
**The Main flow kept the rule.** When I built [The main flow](/learn/main-flow), the grilling, `/to-spec` and `/to-tickets` all ran in one session, and I never typed `/clear`. Then `/implement-spec` sent a helper agent to each ready ticket, each in its own worktree (a separate checkout of the code), so the building ran in the helpers' own windows, not mine.

**A handoff, but not the Skill.** When the course work moved to a new computer, its handoff was a file committed to the repo, `.scratch/course-rewrite/HANDOFF.md`: where the branch and drafts are, the plan, and how I like to work. Like a `/handoff` file, it points to branches and review files instead of copying them, and leaves out the env files, which hold secrets. Unlike one, it's in the repo, so it travelled with the code.

**My prototype skipped the bridge.** I typed just `/prototype` and kept the throwaway code on its own Git branch (a separate line of work), `prototype/lesson-page`. Matt's flow would `/handoff` out to a prototype session and back.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| See what's filling the window | `/context` |
| A quick side question | `/btw <question>` |
| A big search where you only need the answer | Ask for a subagent |
| Phase over; the next one needs it firsthand or fits, well inside the Smart zone | Continue |
| Phase over; nothing here matters next | `/clear` |
| Another tool, folder or person, or a side task to fork | `/handoff <what the next session is for>` |
| The next task can run without you | A subagent |
| None of the above | `/compact <what to keep>` |
| A rule that must last | `CLAUDE.md`, not chat |
| Main flow | Grill, spec and tickets in one window; `/clear` between tickets |

## Final test

```test read-context-rows
An hour into a session, the agent contradicts a decision you made together earlier. `/context` shows Messages 150k, System tools 16k, Skills 10k, System prompt 4k and Free space 787k. Which row is the one to shrink, and how?
- [ ] Free space: use it up before reaching for `/clear`.
  > Free space isn't headroom. About 180k is used, past Matt's rule of thumb, and quality has already slipped.
- [ ] Skills: uninstall most of them at the next Phase boundary.
  > 10k is small, and it's the same in every session. The big row is elsewhere.
- [x] Messages: shrink it at the next Phase boundary.
  > Right. The conversation is nearly all of the total, and contradicting its own context is a classic sign. Let Matt's tree pick clear, hand off or compact.
- [ ] System tools: switch off the built-in ones.
  > That's a fixed startup cost, and the agent needs those tools to work.
```

```test scenario-mid-phase-reading
You're grilling a change to a recipe site. One question turns on whether any of about forty files rounds servings in a way that breaks with fractions, and checking means reading each one. Once you know, you won't look at those files again this Phase. What do you do?
- [ ] Ask the agent to read all forty here, so it knows them firsthand.
  > Forty files of raw code would eat your Smart zone, and you'll never need that text again.
- [x] Have a subagent read them and send back a short report.
  > Right. The reading happens in the helper's own window; only the conclusion lands in yours. Grilling does the same on its own when a question needs a fact.
- [ ] Type `/clear` first, so there's room for the reading.
  > That throws away the grilling to make room for work a helper could do elsewhere.
- [ ] Type `/compact` first, then do the reading.
  > Compacting mid-Phase loses the thread, and the forty reads still land in your window afterwards.
```

```test scenario-next-ticket
You've just finished `/implement` on ticket 2 of 5 for a book-club site. `/context` shows 90k tokens. What do you do before ticket 3?
- [x] `/clear` first, then run `/implement` on ticket 3.
  > Right. Matt's Main flow clears between tickets: ticket 3 starts fresh from its own write-up, and clearing is the cheapest move.
- [ ] `/compact`, so ticket 2's reasoning carries into ticket 3.
  > Ticket 3 works from its ticket and the spec, not ticket 2's reasoning. You'd pay for a summary of context it doesn't need.
- [ ] `/handoff` to a fresh session in the same folder.
  > Nothing is travelling. Same tool, same folder: no file needed.
- [ ] Keep going: 90k is well inside a 1M window.
  > The 1M window isn't the limit; the Smart zone is. Each ticket is sized to fill a fresh one, and ticket 2's 90k is only weight, so Matt clears between tickets.
```

```test scenario-near-zone
In a repo, you've finished `/grill-with-docs` and `/to-spec` for a multi-session build. `/context` shows 160k tokens, and you haven't run `/to-tickets` yet. What does `ask-matt` say to do?
- [ ] Keep going; most of the 1M window is still free.
  > Free space isn't the limit. At 160k you'd write the tickets in the dumb zone.
- [ ] `/clear`, then run `/to-tickets` in a fresh window.
  > No clearing until after `/to-tickets`, so the tickets build on the same thinking as the spec.
- [x] `/compact` here, saying what the tickets need.
  > Right. Near the Smart zone before `/to-tickets`, compact at the nearest Phase boundary and carry on.
- [ ] `/handoff` to a new session in this folder.
  > Nothing is travelling, so a handoff file buys nothing that `/compact` doesn't.
```

```test scenario-afk-review
You've finished building a CSV export for a book-club site, at about 140k tokens. Before QA, the diff should be checked against the spec, and you'll be at lunch while that runs. Which move does Matt's tree pick?
- [ ] `/compact`, then run the review in this session.
  > Question 4 comes before 5: a job that needs no steering can run in its own window and leave yours as it is.
- [ ] `/clear`, then run the review in this session.
  > QA still needs the build's reasoning, so this context isn't irrelevant. Clearing drops it.
- [ ] `/handoff` the review to a fresh session.
  > Nothing is travelling: same tool, same folder, same person.
- [x] A subagent, which reports back when done.
  > Right. At 140k you're near the Smart zone's edge, so you can't continue, and the context still matters. A review you needn't steer runs AFK in a fresh window, and your session stays as it was for QA.
```

```test spot-rule-in-chat
Early in a long session, Sam told the agent "don't touch anything in the payments folder". Hours later, after a line saying the conversation had been compacted, the agent edits a payments file. Spot the mistake.
- [ ] Sam should have typed the rule again every few messages to keep it fresh.
  > That fills the window faster, and the rule still lives only in the conversation.
- [ ] Sam should have turned auto-compact off for good.
  > Then the window shrinks only when you remember to `/clear` or `/compact`, and the rule still lives only in the conversation, so the next summary can drop it just the same. Where the rule lived was the problem.
- [x] Sam should have put the rule in `CLAUDE.md`.
  > Right. A summary keeps the gist, not every line. The project's `CLAUDE.md` is reloaded from disk after compacting, so the rule survives.
- [ ] Sam should have given the rule with `/btw`.
  > A `/btw` answer never enters the conversation, so a rule given that way wouldn't stick at all.
```

```test spot-louder-rule
Deep into a long session, Raj's agent keeps naming files the old way, though he set a new rule early on. So he pastes in the team's whole 40-page style guide, "so it can't miss it". Spot the mistake.
- [x] He should shrink the window at the next Phase boundary.
  > Right. Past the Smart zone, more tokens make it worse. Start a smaller window at a boundary, and put the rule in `CLAUDE.md`.
- [ ] He should switch to a bigger-window model at the next Phase boundary.
  > Window size isn't the limit; the Smart zone is. A bigger window just holds more dumb zone, whenever you switch.
- [ ] He should have the agent repeat the rule after every edit.
  > Still adding tokens. The model can see the rule; its attention is spread too thin to keep hold of it.
- [ ] He should let auto-compact run first, then paste it.
  > Auto-compact fires only when the window is nearly full, far into the dumb zone. Waiting for it means more work done badly.
```

```test spot-compact-before-qa
Ana finishes building a search box at 60k tokens. Next she'll check it by hand with the agent, a short job. She types `/compact` first, "to start QA clean". Spot the mistake.
- [ ] She should `/clear` instead, for a cleaner start.
  > QA still needs what the build did, and question 1 already says yes. Clearing drops the why from the session she tests in.
- [ ] She should have compacted mid-build, before it got heavy.
  > Compacting mid-Phase makes the agent lose the thread, and 60k was never heavy.
- [ ] She should `/handoff` instead, so nothing is lost.
  > Nothing is travelling, and a handoff file is a summary too.
- [x] She should carry on in this session and start QA now.
  > Right. A short QA fits easily in the Smart zone left at 60k, so question 1 says yes. Continuing costs nothing and keeps the build firsthand.
```

```test spot-handoff-file
Before sending a half-built feature to a colleague, Dev reads the file `/handoff` wrote, as Matt advises. It has a summary of where the work stands and why, a suggested-skills section, `[removed]` where an API key was, and the whole 300-line spec from the repo pasted in. Spot the mistake.
- [ ] The suggested-skills section: the colleague can pick their own Skills.
  > That section is part of every handoff file: it tells the next agent which Skills to load.
- [x] The pasted spec: the colleague needs only a path or link to it.
  > Right. A handoff file refers to specs, tickets and commits by path or link instead of copying them, so it stays short.
- [ ] The removed key: the colleague will need it to run the code.
  > Keys, passwords and personal details are taken out on purpose. The colleague gets their own key another way.
- [ ] The summary of the work: the colleague can read the diff instead.
  > Where the work stands, why, and what comes next are the core of the file. A diff doesn't carry the why.
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

```sources
- [handoff SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/handoff/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) (the Smart zone, context hygiene in the Main flow) and [PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/PHASE-BOUNDARIES.md) (the five ordered questions): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [tdd SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/SKILL.md) (agree what to test first) and [grilling SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/grilling/SKILL.md) (facts looked up by a sub-agent): pinned to mattpocock-skills 1.3.1, read 2026-10-24.
- [The /handoff Skill](https://www.aihero.dev/skills-handoff), AI Hero docs (the four reasons, the fork case, practical habits), updated 2026-08-24, read 2026-10-23.
- [AI Coding Dictionary: Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) and [Token](https://www.aihero.dev/ai-coding-dictionary/token), Matt Pocock, updated 2026-09-24 and 2026-07-01, read 2026-10-23.
- [Most devs don't understand how context windows work](https://www.youtube.com/watch?v=-uW5-TaVXu4), Matt Pocock, 2025-10-22 (the most common mistake 0:17, lost in the middle 3:45–4:52, `/context` and when he'd clear (50k left) 5:10–5:54, the compact demo 5:56–6:57).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (Smart zone and dumb zone, credited to Dex Horthy 3:12–4:17; the *Memento* framing 7:27–7:35; status line 9:38–10:05; dislikes compacting 10:36–10:56; 1M windows 37:24–38:31; review in a fresh window 65:47–66:24).
- [/handoff is my new favourite skill](https://www.youtube.com/watch?v=dtAJ2dOd3ko), Matt Pocock, 2026-05-21 (dumb zone around 120k 2:02–3:06, forking an out-of-scope task 4:56–7:16, the prototype round trip and 169k session 7:20–9:13, always stating the purpose 11:29–11:40).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (the Smart zone at 140k 10:28–10:58, one ticket per Smart zone 12:25–12:37, clearing between tickets 13:53–14:39).
- [Explore the context window](https://code.claude.com/docs/en/context-window), [Commands](https://code.claude.com/docs/en/commands), [Interactive mode](https://code.claude.com/docs/en/interactive-mode) (`/btw`), [Settings](https://code.claude.com/docs/en/settings-reference) (auto-compact and idle compaction) and [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Claude Code docs, read 2026-10-23 (Claude Code 2.1.309).
- [Using Claude Code: session management and 1M context](https://claude.com/blog/using-claude-code-session-management-and-1m-context), Thariq Shihipar, Anthropic blog, 2026-04-15.
- [Models, usage, and limits in Claude Code](https://support.claude.com/en/articles/14552983), Claude Help Center, read 2026-10-23.
- [The Two Matt Pocock Skills I Use in Almost Every AI Coding Session](https://medium.com/@anmjawad007/the-two-matt-pocock-skills-i-use-in-almost-every-ai-coding-session-57c468938145), Nowshad Jawad, 2026-05-29.
```
