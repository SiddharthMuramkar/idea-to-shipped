---
title: The context window
slug: context-window
summary: An agent sees only what's in its context window, and it reasons best while that window is far from full. Learn to read it, clear it and compact it.
---

## What the agent can see

Say you're two hours into one long session with Claude Code. Early on you said "don't touch the `payments` folder", and for an hour the work was good. Now it has edited a payments file, re-broken a test it fixed earlier, and described a function that doesn't exist. Nothing crashed. The agent got worse.

**The agent knows only what's in its context window, and it reasons best while that window is far from full.**

The **context window** is everything the model sees when it answers. That's Claude Code's own instructions, the whole conversation so far, and every result its tools have handed back. If something isn't in the window, the agent doesn't know it exists. A new session starts with a fresh window, as [How coding agents work](/learn/how-agents-work) showed.

The window is measured in **tokens**: the small chunks of text a model reads and writes. A token is about three-quarters of an English word, so 1,000 tokens is roughly 750 words. Window size, cost and speed are all counted in tokens. In token counts, "k" means thousand, so 150k is 150,000 tokens.

```checkpoint quick-1
The agent reads a document of about 3,000 words. Roughly how many tokens does that add to the window?
- [x] About 4,000, since a token is about three-quarters of a word.
- [ ] About 3,000, since each word is exactly one token.
- [ ] About 750, since each token holds about four words.
Why: A token is about three-quarters of an English word, so 1,000 tokens is roughly 750 words. 3,000 words is about 4,000 tokens.
```

## What fills it

Some of the window is full before you type anything:

- Claude Code's built-in instructions, called the **system prompt**, and the list of tools it can use;
- your `CLAUDE.md` files and auto memory, the notes Claude Code keeps for itself (see [Instruction files](/learn/instruction-files));
- the name and short description of each Skill, a named set of instructions for one job, whose full text loads only when it's used;
- the tool names of any **MCP servers**, connectors that link the agent to other services.

Then everything you do adds to it: what you type, what the agent replies, and every tool result. File reads and command output are often the biggest part. One big file or a long test log can add thousands of tokens at once.

```checkpoint quick-2
You open a brand-new session and type nothing. Already, part of the window is used. Where did those tokens come from?
- [x] Instructions, the tool list, `CLAUDE.md`, notes and Skill descriptions.
- [ ] Your last conversation, which Claude Code reloads so you don't start cold.
- [ ] Every file in the project, which the agent reads before you ask anything.
Why: The system prompt, the tool list, your `CLAUDE.md` files, auto memory and Skill descriptions load before you type. Files enter the window only when the agent reads them.
```

Every request sends the whole window, not only the newest message. So a session that has piled up three unrelated tasks re-reads all three on every turn of the fourth. [Calling a model](/learn/calling-a-model) shows why: your code sends the whole list of messages with every call.

## Reading `/context`

Type `/context` to see what's filling the window. It's a **built-in command**: part of Claude Code itself, not a Skill. It shows the total used, and a row for each kind of content.

For example, a long session on a 1M-token window might show this (rounded, made-up numbers):

| Row | Tokens |
|---|---|
| System prompt | 4k |
| System tools | 16k |
| MCP tools | 4k |
| Memory files (`CLAUDE.md` and auto memory) | 1k |
| Skills | 10k |
| Messages (the conversation, file reads and command output) | 150k |
| Free space | 785k |
| Autocompact buffer (kept free for compacting) | 30k |

Nearly all of the used space is Messages. The startup rows are small, and much the same in every session. So when a window gets heavy, the conversation is usually what to shrink.

```checkpoint quick-3
`/context` shows Skills at 10k, System tools at 16k and Messages at 150k. Which row is usually the one to shrink?
- [x] Messages, the conversation itself.
- [ ] Skills, by removing most of them.
- [ ] System tools, by turning some off.
Why: The startup rows are small, and much the same in every session. The conversation is nearly all of the used space, so it's what to shrink.
```

## The smart zone

Answers don't stay equally good until the window is full. Anthropic's engineers call the effect **context rot**: as the tokens in a window grow, the model gets worse at recalling what's in them.

Matt Pocock, who publishes a popular set of Skills, borrows a picture from Dex Horthy of the company HumanLayer. Early in a session, the agent is in the **smart zone**: sharp, focused, good at recall. As the session grows, it drifts into the **dumb zone**: sloppier, more forgetful, more confidently wrong. It's the same model with the same tools, only more context.

Where's the line? ask-matt, Matt's guide to which of his Skills fits, puts the smart zone at about 150k tokens on today's best models. He has given lower figures before, so treat it as a rule of thumb.

The line has nothing to do with the window's size. Most current Claude models have 1M-token windows, so a session can be deep in the dumb zone with most of its window still free. **Plan around the smart zone, not the window.**

```scene meter
title: Two tasks in one session, on a 1M window (illustrative)
zone: 15
# You start `claude`. Before you type, Claude Code's instructions, tools, `CLAUDE.md` and Skill descriptions are in the window.
fill: 2% | Startup, about 20k
# You build a search box for your recipe website: file reads, test runs, edits.
fill: 9% | First task, about 90k
# You start an unrelated task on top. Around 150k you leave the smart zone, with 85% of the window still free. Nothing warns you.
fill: 16% | Second task, about 160k
# The agent re-breaks a test it fixed in the first task. The fix was a `/clear` between the two tasks.
fill: 18% | End of the second task, about 180k
# You type `/clear` before the next task. The window drops back to its startup cost.
fill: 2% | After /clear, about 20k
```

```checkpoint quick-4
`/context` says 17% of a 1M window is used. The agent has started ignoring a rule you set early on, and it re-broke a test it had fixed. What's the best explanation?
- [x] It has drifted past the smart zone, and free space doesn't help.
- [ ] Claude Code has quietly deleted your early messages to save room.
- [ ] The agent only ever reads the newest message in the conversation.
Why: About 170k tokens is past the smart zone, whatever the window's size. Quality drops long before the window fills.
```

There's no error message when you leave it. Watch for the signs instead. The agent forgets an instruction from many turns ago, repeats a mistake it already fixed, or says something its own context contradicts. Matt keeps a token count on screen in a **status line**, the line under the prompt box. To set one up, type `/statusline` and describe what it should show.

The fix is less context, not more. Pasting the ignored instruction again, in capitals, adds tokens to a window that already holds too many.

```checkpoint quick-5
Deep into a session, the agent keeps ignoring a naming rule you set at the start. What helps most?
- [x] A smaller window, starting at the next good stopping point.
- [ ] The rule again, in capitals, so the agent can't miss it.
- [ ] A longer explanation of the rule, with three examples.
Why: The fix is less context, not more. Repeating or explaining the rule adds tokens to a window that already holds too many.
```

## Making room

Like `/context`, these are built-in commands:

- **`/clear`** starts a new conversation with an empty window. Your files and `CLAUDE.md` stay as they are. The old conversation isn't deleted: `/resume` lists it, so you can go back. It's instant and costs nothing.
- **`/compact`** replaces the conversation with a summary, then carries on from there. You can say what to keep: `/compact focus on the search changes`. It reads the whole conversation to write the summary, so it takes a while and costs tokens. And it's lossy: a summary keeps the gist and drops detail.
- **`/btw`** asks a side question, such as `/btw what was that file called?`. It answers from what's already in the conversation, without reading files or running commands. The question and its answer never join the conversation.

```checkpoint quick-6
Halfway through a task, you wonder what a word in the agent's last reply means. You won't need the answer for the task. What do you type?
- [x] `/btw`, then your question, so nothing joins the conversation.
- [ ] `/clear`, then your question, so the window is empty first.
- [ ] `/compact`, then your question, so there's room for the answer.
Why: A `/btw` question and its answer never join the conversation, so the task's window stays as it was. Clearing would throw the task away, and compacting mid-task loses detail.
```

Claude Code also compacts on its own as the window nears its limit. That's long past the smart zone, so it won't keep the agent sharp. And a summary can drop a rule you only said in chat. Put lasting rules in `CLAUDE.md` instead: Claude Code reads the project's main one again from disk after every compaction.

```checkpoint quick-7
Early on, you told the agent "don't touch the payments folder". Hours later, after the conversation was compacted, it edits a payments file. Where should the rule have gone?
- [x] In the project's `CLAUDE.md`, which is read again after compaction.
- [ ] In a `/btw` question, which keeps rules out of the summary.
- [ ] In the first message, written twice so the summary keeps it.
Why: A summary keeps the gist, not every line, so a rule said only in chat can be lost. The project's main `CLAUDE.md` is read again from disk after every compaction.
```

For a big search, ask for a **subagent**: a helper agent with its own fresh context window. It does the reading in its own window and hands back a short report, so only the report lands in yours. For example: "Use a subagent to find every file that mentions `recipe_id`." The catch is that what the report leaves out, you never see.

## When to start fresh

The first rule is simple: new task, new session. Type `/clear` when you switch to unrelated work. Anthropic's docs explain that an old conversation "crowds out the files you need next and costs tokens on every message."

The second rule is for corrections. Say you've corrected the agent twice on the same thing, and it's still wrong. Anthropic suggests `/clear`, then one better prompt that includes what you learned. A third correction mostly adds to a window that already holds two failed attempts.

```checkpoint quick-8
You've corrected the agent twice about how a page should look, and it's still wrong. What does Anthropic suggest?
- [x] `/clear`, then one better prompt that includes what you learned.
- [ ] A third correction, written in more detail than the first two.
- [ ] `/compact`, so the two failed attempts are summarised away.
Why: A third correction adds to a window that already holds two failed attempts. A fresh window with one better prompt works better almost every time.
```

Within one piece of work, the call is harder. Matt makes it at each **phase boundary**: the gap after a chunk of work, such as planning, building or checking. He asks five questions in order, and the first yes wins:

1. **Can you continue?** Yes, if the next chunk needs this conversation firsthand, or still fits in the smart zone. Continuing costs nothing and loses nothing.
2. **Is everything here irrelevant now?** Then `/clear`, the cheapest move.
3. **Does the work have to travel?** Then `/handoff`, below.
4. **Can the next job run without you?** Then send it to a subagent, and leave your session as it is.
5. **Otherwise, `/compact`**, with an instruction about what comes next.

Compacting in the middle of a chunk makes the agent lose the thread, so make these calls at a boundary. [Context hygiene](/learn/context-hygiene) explains each question. It also shows how Matt's main flow uses them. All the planning shares one window, then each Ticket, a small piece of the build, gets a fresh one.

```checkpoint quick-9
You've finished building a search box at about 60k tokens. Next you'll check it by hand with the agent, a short job. What do Matt's questions say?
- [x] Continue, because the check fits in the smart zone you have left.
- [ ] `/compact`, so the check starts from a cleaner summary.
- [ ] `/clear`, so the check starts with an empty window.
Why: The first question wins: the next chunk fits in the smart zone you have left, so you continue. Continuing costs nothing and keeps the build firsthand.
```

**`/handoff`** is one of Matt's Skills. It writes the state of the conversation into one Markdown file, for a fresh session to read. Use it only when the work has to travel. That means a move to another agent tool, folder or repo, a hand-over to a colleague, or a side task you split off for a second session. [handoff](/learn/handoff) covers it in full.

```checkpoint quick-10
Which of these is a job for `/handoff`?
- [x] A colleague will finish the feature on her own computer tomorrow.
- [ ] You'll keep working in the same folder, and want a lighter window.
- [ ] You want the agent's changes reviewed while you step away.
Why: Handing work to a colleague means it has to travel. A lighter window in the same folder is a job for `/compact`, and a review that runs without you fits a subagent.
```

## Going deeper

### Why it exists

If windows hold a million tokens, why manage them at all? Because two costs grow with every token. Answers get worse as context rot sets in. And every request sends the whole conversation, so a long one costs more on every turn.

Anthropic's own advice has relaxed. With 1M-token windows and automatic compaction, its docs say running out is now rare. They've dropped the old rule to manage the window aggressively. But they still advise `/clear` between tasks, "because a focused context gets you better answers and costs less."

Matt goes further. He sizes each task to fit in one smart zone, and starts the next in a fresh window. So both agree on the habit, even if they weigh it differently: give each window one job.

```checkpoint quick-11
Anthropic's docs say running out of context is now rare. Why do they still advise `/clear` between tasks?
- [x] A focused context gives better answers and costs less.
- [ ] Claude Code stops working once the window is half full.
- [ ] `/clear` saves the old conversation as a summary for later.
Why: Running out is rare with 1M-token windows, but a focused context still gets better answers, and it costs less on every request.
```

### How it works underneath

**Why more tokens means worse answers.** Models are built so that every token attends to, or weighs, every other token. That makes n² pairs for n tokens: double the tokens, and you get four times the pairs. Anthropic describes an "attention budget" that every new token draws on. Matt's picture is a football league, where each new team adds a match against every other team.

```checkpoint quick-12
You double the number of tokens in a window. What happens to the number of token pairs the model weighs?
- [x] It grows to four times as many.
- [ ] It doubles, along with the tokens.
- [ ] It stays the same as before.
Why: n tokens make n² pairs, so twice the tokens means four times the pairs. Every new token draws on the model's attention budget.
```

**What comes back after a compaction.** When Claude Code compacts, it summarises the conversation, then puts some things back:

- the project's main `CLAUDE.md`, and auto memory, read again from disk;
- your Skills' descriptions, and the Skills you used, each cut to fit a budget;
- the plan, if you wrote one in plan mode;
- up to five of the files it read or edited most recently.

Everything else lives on only in the summary, if at all. Instructions you gave only in chat are the usual casualty.

**Compaction can happen while you're away.** On a Claude subscription, a session past about 200k tokens that sits idle for about an hour gets compacted. So after lunch, you may carry on from a summary. To choose how full the window gets before Claude Code compacts by itself, use `/autocompact`, as in `/autocompact 500k`.

```checkpoint quick-13
A long session compacts. Which of these does Claude Code read again from disk afterwards?
- [x] The project's main `CLAUDE.md`, and auto memory.
- [ ] Every instruction you typed during the session.
- [ ] Every file the agent read during the session.
Why: The project's main `CLAUDE.md` and auto memory are read again from disk. Instructions said only in chat live on only in the summary, and at most five recent files are read again.
```

### A real example

At an April 2026 workshop, someone asked Matt whether the new 1M-token window was worth using. He had recorded his Claude Code course on a 200k window, and the 1M window was announced on the day he launched it.

His take was that Claude Code had "shipped a lot more dumb zone." A huge window is good for retrieval, such as finding one fact in a pile of long documents. It's less good for coding. He put the smart zone at about 100k then, and said he expected it to grow.

So the window grew five times over, and the smart zone grew far less. That's why you plan by the smart zone. Today, ask-matt puts it at about 150k.

```checkpoint quick-14
Your model's window grows from 200k to 1M tokens. By Matt's account, what is a huge window good for?
- [x] Retrieval, such as finding one fact in a pile of long documents.
- [ ] Coding, since the agent now stays sharp for five times as long.
- [ ] Nothing at all, since the extra room is never used by the model.
Why: Matt said the bigger window shipped "a lot more dumb zone": good for retrieval, less good for coding. The smart zone grew far less than the window did.
```

### Where it goes wrong

**The agent ignores a rule you gave early on.** It may be past the smart zone, or a compaction may have dropped the rule. Shrink the window at the next boundary, and move the rule into `CLAUDE.md`.

**Saying it again, louder, made it worse.** Every repeat adds tokens. Anthropic adds that piling on emphasis mostly makes Claude over-apply a rule. Remove context instead.

**A fresh session is sure about a decision you never made.** A summary flattened it. Matt calls this the failure mode of reaching for `/compact` first. Give `/compact` a focus, or continue if the next chunk fits.

```checkpoint quick-15
After a `/compact`, the agent is confidently wrong about a decision you made earlier. What happened, and what helps next time?
- [x] The summary flattened it, so give `/compact` a focus.
- [ ] The agent read an old file, so delete the file first.
- [ ] Compaction lost your files, so restore them from Git.
Why: A summary keeps the gist and drops detail, and a decision can get flattened. A focus instruction tells the summary what the next chunk needs.
```

**You cleared too soon, and lost the why.** Reading back the changes won't tell you why they were made. But `/clear` isn't final: `/resume` reopens the old conversation.

**One session holds every task.** Unrelated tasks spend the same smart zone, and every request re-reads them all. New task, new session.

### Try it

You'll need Claude Code installed and signed in, and Git ([Start here](/learn/start-here) covers both). You'll fill a window on purpose, then shrink it, in a copy of Matt Pocock's public Skills repository.

1. Copy the repository and go into it:

```sh
git clone https://github.com/mattpocock/skills
cd skills
```

2. Start Claude Code. If it asks whether you trust this folder, choose Yes.

```sh
claude
```

3. Type `/context`. Note the total used, and the Messages row.
4. Fill the window. Type this, then `/context` again. If it asks permission to read files, choose Yes.

```text
Without using a subagent, read every SKILL.md file in this repo yourself, and give me a one-line summary of each.
```

5. Type `/btw how many files did you read?`. Read the answer, press Esc to close it, then type `/context`.
6. Type `/compact keep only the one-line summaries`, then `/context`.
7. Ask: "Without reading any files, which Skill is about test-driven development?"
8. Type `/clear`, then `/context`. Type `/resume` to see the old conversation listed, then press Esc.
9. Ask for the same reading through a helper, then type `/context`:

```text
Use a subagent to read every SKILL.md file in this repo, and report back only a one-line summary of each.
```

10. Type `/exit` when you're done.

You should see:

- Messages grow a lot in step 4, and much less in step 9.
- No growth in Messages from the `/btw` question in step 5.
- Messages drop after `/compact`, and the agent name the Skill in step 7 without reading anything.
- Messages near zero after `/clear`, with the old conversation still listed in `/resume`.

### Read more

- [Explore the context window](https://code.claude.com/docs/en/context-window), Anthropic
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), Anthropic, 2025-09-29
- [Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), AI Coding Dictionary, Matt Pocock
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock, AI Engineer, 2026-04-24
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills

## Remember

```flashcards
Q: What is a token, roughly?
A: A small chunk of text, about three-quarters of an English word. 1,000 tokens is roughly 750 words.

Q: What's in the context window before you type anything?
A: The system prompt and tool list, your `CLAUDE.md` files and auto memory, Skill descriptions, and MCP tool names.

Q: What is the smart zone, and how big is it?
A: The part of a session where the model still reasons sharply. Matt's ask-matt puts it at about 150k tokens on today's best models, whatever the window's size.

Q: What's the difference between `/clear` and `/compact`?
A: `/clear` empties the window (the old conversation stays in `/resume`). `/compact` replaces the conversation with a summary, which is lossy.

Q: What does `/btw` do?
A: It answers a side question from what's already in the conversation, without tools. Neither the question nor the answer joins the conversation.

Q: Which instructions survive a compaction?
A: The project's main `CLAUDE.md`, which Claude Code reads again from disk. A rule you only said in chat may not survive.

Q: When do you need `/handoff`?
A: When the work has to travel: to another agent tool, folder or repo, to a colleague, or as a side task for a second session.
```

## Final test

```final-test read-context-rows
An hour into a session, the agent contradicts a decision you made together earlier. `/context` shows Messages 150k, System tools 16k, Skills 10k, System prompt 4k and Free space 785k. Which row do you shrink, and when?
- [x] Messages, at the next phase boundary.
- [ ] Free space, by using it up before you do anything else.
- [ ] Skills, by uninstalling most of them right away.
- [ ] System tools, by switching off the built-in tools.
Why: The conversation is nearly all of the used space, and contradicting its own context is a classic sign of the dumb zone. Shrink it at the next boundary. The startup rows are small, and the agent needs its tools.
```

```final-test quality-not-size
Your model has a 1M-token window. You reason that you can work until about 900k tokens before quality drops. What's wrong with that plan?
- [x] Quality drops past the smart zone, about 150k, whatever the window's size.
- [ ] Claude Code deletes the oldest messages once the window is a quarter full.
- [ ] Nothing, since quality holds steady until the window is completely full.
Why: The smart zone has nothing to do with the window's size. A session can be deep in the dumb zone with most of its window still free, so plan around the smart zone.
```

```final-test side-question
Halfway through building a feature, you wonder what an unusual setting in the agent's last command does. You'll never need the answer for this feature. What do you type?
- [x] `/btw`, then your question.
- [ ] `/clear`, then your question.
- [ ] `/compact`, then your question.
- [ ] Your question, then `/compact` to tidy up.
Why: A `/btw` answer never joins the conversation, so the feature's window stays as it was. The other moves either throw the work away or pay for a lossy summary mid-task.
```

```final-test spot-rule-in-chat
Early in a long session, Sam told the agent "don't touch anything in the payments folder". Hours later, after a line saying the conversation was compacted, the agent edits a payments file. Spot the mistake.
- [x] Sam should have put the rule in the project's `CLAUDE.md`.
- [ ] Sam should have typed the rule again every few messages.
- [ ] Sam should have given the rule as a `/btw` question.
- [ ] Sam should have turned automatic compaction off for good.
Why: A summary keeps the gist, not every line. The project's `CLAUDE.md` is read again from disk after compaction, so the rule survives. A `/btw` question never joins the conversation, and repeating the rule fills the window faster.
```

```final-test spot-louder-rule
Deep into a long session, Raj's agent keeps naming files the old way, though he set a new rule early on. So he pastes in the team's whole 40-page style guide, "so it can't miss it". Spot the mistake.
- [x] He's adding context when the window needs less.
- [ ] He should have pasted the guide in capitals instead.
- [ ] He should switch to a model with a bigger window.
Why: Past the smart zone, more tokens make it worse. He should shrink the window at the next boundary, and put the rule in `CLAUDE.md`. A bigger window only holds more dumb zone.
```

```final-test big-reading
To settle one question, the agent must read about forty files of your recipe website. Once you know the answer, you won't need those files again this session. What do you do?
- [x] Have a subagent read them and send back a short report.
- [ ] Have the agent read all forty here, so it knows them firsthand.
- [ ] Type `/clear` first, so there's room for all the reading.
Why: The reading happens in the subagent's own window, and only the report lands in yours. Forty files read here would spend your smart zone on text you'll never need again.
```

```final-test spot-compact-before-check
Ana finishes building a search box at 60k tokens. Next she'll check it by hand with the agent, a short job. She types `/compact` first, "to start clean". Spot the mistake.
- [x] She should carry on in this session, as the check fits in the smart zone.
- [ ] She should `/clear` instead, because a clean start is always cheaper.
- [ ] She should have compacted halfway through the build, before it got heavy.
- [ ] She should `/handoff` instead, so that nothing from the build is lost.
Why: The first of Matt's questions says continue: the check fits in the smart zone left at 60k. Continuing costs nothing and keeps the build firsthand. Nothing is travelling, and compacting mid-build loses the thread.
```

```final-test handoff-colleague
Your teammate will finish a half-built feature on her own computer tomorrow. Which move fits?
- [x] `/handoff`, because the work has to travel to a colleague.
- [ ] `/compact`, because the summary is saved for her to read.
- [ ] `/clear`, because she'll start her own session anyway.
Why: A colleague is one of the four reasons the work has to travel, and `/handoff` writes a file another session can read. A compacted summary stays in your session, and `/clear` keeps nothing for her.
```

```final-test two-corrections
You've told the agent twice that the recipe page's photos should sit on the left. Its third try still puts them on the right. What's the best next move?
- [x] `/clear`, then one better prompt that includes what you've learned.
- [ ] A third correction, written in capitals so it stands out.
- [ ] `/btw`, asking it why it keeps getting the photos wrong.
Why: A third correction adds to a window that already holds two failed attempts. Anthropic suggests a fresh window and one better prompt instead.
```

```final-test deeper-after-compaction
After a long session compacts, which of these does Claude Code read again from disk?
- [x] The project's main `CLAUDE.md`, and auto memory.
- [ ] Every instruction you typed in the conversation.
- [ ] Every `/btw` question and answer from the session.
Why: The project's main `CLAUDE.md` and auto memory are read again from disk. Instructions said only in chat live on only in the summary, and `/btw` exchanges never joined the conversation.
```

```sources
- [Explore the context window](https://code.claude.com/docs/en/context-window), Anthropic
- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works), Anthropic
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [Commands](https://code.claude.com/docs/en/commands), Anthropic
- [Interactive mode](https://code.claude.com/docs/en/interactive-mode), Anthropic
- [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop), Anthropic
- [How Claude remembers your project](https://code.claude.com/docs/en/memory), Anthropic
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), Anthropic Applied AI team, 2025-09-29
- [Token](https://www.aihero.dev/ai-coding-dictionary/token), AI Coding Dictionary, Matt Pocock
- [Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), AI Coding Dictionary, Matt Pocock
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock (AI Engineer channel), 2026-04-24
```
