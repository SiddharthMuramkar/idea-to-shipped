---
title: Models, effort and ultracode
slug: models-effort-ultracode
summary: How to pick the model that answers, set how hard it works with effort, read a bad result, run big jobs as ultracode workflows, and use fast mode.
---

## Two dials, two jobs

Say you ask Claude Code to fix a typo on the yoga-studio booking site. It works for several minutes and rewrites a paragraph you never mentioned. Another day, you hand a subtle bug to a small, fast model, and it gets it wrong three times. Both times, the prompt wasn't the problem: a dial was set wrong for the job.

**The model decides how capable Claude is; effort decides how much work it does on each turn.**

Claude Code, Anthropic's coding agent, gives you four dials in all. Each one spends **tokens**, the small chunks of text that use is counted and paid in (see [calling a model](/learn/calling-a-model)).

| Dial | What it decides | How you set it |
|---|---|---|
| Model | Which model answers, and how capable it is | `/model` |
| Effort | How much work it does on each turn | `/effort` |
| Ultracode | Whether big jobs run as a script of many helper agents | `/effort ultracode`, or the word `ultracode` in a prompt |
| Fast mode | The same Opus model, answering faster for a higher price | `/fast` |

Out of the box, Claude Code runs Claude Opus 5.5 at medium effort on most plans. Anthropic's advice is to leave the defaults alone until a task costs more time or tokens than it should.

```checkpoint quick-1
You want Claude to test more edge cases and check its work more before it answers. Which dial do you turn?
- [x] Effort, which sets how much work it does on each turn.
- [ ] The model, which sets how much work it does on each turn.
- [ ] Fast mode, which makes the same model check its work faster.
Why: The model decides how capable Claude is. Effort decides how much work it does on each turn, such as how much it checks before answering.
```

## Which model answers

A **model** is the AI that writes the replies. What it knows was fixed when it was trained. Your prompt and your files can steer it, but they can't add to what it knows. Switching models swaps in a different one.

You pick a model by its **alias**, a short name that points at the current version:

| Alias | What it's for |
|---|---|
| `opus` | Complex reasoning. It's the default on most plans, and it handles most coding well |
| `sonnet` | Daily coding, for less than Opus costs on routine work |
| `haiku` | Simple, quick tasks, and helper agents doing simple jobs |
| `fable` | Your hardest, longest work: root-cause hunts, outages, architecture. Never the default: you pick it |
| `opusplan` | Opus while Claude plans in [plan mode](/learn/how-agents-work), then Sonnet to carry out the plan |
| `default` | Clears your choice and goes back to your account's default |

Type `/model` to open a picker. **`/model` saves your choice as the default for new sessions.** Pressing Enter on a row, or typing a name such as `/model sonnet`, switches and saves.

To switch for this session only, open `/model` and press `s` on the row. Starting Claude Code with `claude --model haiku` also lasts for that one session. `/status` shows the model you're on.

```checkpoint quick-2
You need one quick rename, so you type `/model haiku`, do it, and quit. Which model does tomorrow's new session start on?
- [x] Haiku, because typing the name saved it as your default.
- [ ] Opus, because a switch you type lasts until you quit.
- [ ] Whichever model Claude Code judges best for the first task.
Why: `/model` saves your choice as the default for new sessions, and typing a name works like Enter. To switch for one session only, open the picker and press `s` on the row.
```

Which model for which job? Matt Pocock, a developer and teacher who publishes a popular set of Skills, splits it by what the step leans on. A grilling, where the agent interviews you about a plan ([grill before you build](/learn/grill-before-you-build)), leans on what the model learned in training. So it needs a big model. Building from a clear plan leans on what's in front of it, so a smaller model can do.

```checkpoint quick-3
You'll be interviewed about a fuzzy idea, then an agent will build from the finished plan. Following Matt, how do you split the models?
- [x] A big model for the interview, and a cheaper one to build.
- [ ] A cheaper model for the interview, and a big one to build.
- [ ] The same mid-sized model for both, so the two stay consistent.
Why: The interview leans on what the model learned in training, so it needs a big model. Building from a clear plan leans on what's in front of it, so a smaller model can do.
```

## How hard it works: effort

**Effort** is more than thinking time. It sets how much work Claude does before it replies: how long it thinks, how many files it reads, and how much it checks.

At a higher level, Claude tests more **edge cases**, the unusual inputs that tend to break code. It also verifies more of its work and makes more choices on its own. At a lower level, it gets you a starting point sooner, and would rather ask you than dig.

| Level | Use it for |
|---|---|
| `low` | Quick back-and-forth where you review each result: brainstorming, a first sketch, a rename |
| `medium` | Everyday work with a clear scope, like building a planned feature. The default on Opus, Sonnet and Haiku 5.5 |
| `high` | Work where checking matters or edge cases are likely, like a bug in code you didn't write |
| `xhigh` | Deeper reasoning, at a higher token spend |
| `max` | Hard problems Claude works through without you, like hunting for a security hole. Prone to overthinking |

Type `/effort` to open a slider. Pressing Enter, or typing a level such as `/effort high`, sets it and saves it as your default. Press `s` in the slider to set it for this session only. `max` lasts for the current session only, and `/effort auto` clears your saved level.

For one tricky question, put the word `ultrathink` anywhere in your prompt. Claude reasons harder on that turn only, and your effort setting doesn't change. Phrases like "think hard" are ordinary words, not settings.

Anthropic's guidance is to use the model's default effort for most tasks. Treat effort as a general preference, not a choice you make for every task.

```checkpoint quick-4
You drop effort to low for a small change. Compared with high, what should you expect?
- [x] A first version sooner, with less checking and more questions to you.
- [ ] The same work and checking, written up in shorter replies.
- [ ] A smaller, cheaper model quietly answering in place of yours.
Why: Effort sets how much work Claude does before it comes back to you. At a lower level it returns a starting point sooner, and would rather ask you than dig. It never changes the model.
```

## Model or effort? Reading a bad result

When Claude gets something wrong, don't reach for a dial first. Anthropic's guide says to look at what you gave it, then ask: did it not try hard enough, or did it not know enough? That makes three questions, in this order:

1. **Did it have what it needed?** A vague request, or a fact it couldn't find, is a problem with the task. Add the context, write the rule into your [instruction file](/learn/instruction-files), or scope the task better. No dial fixes this.
2. **Did it do the work?** If it skipped a file, didn't run the tests, or didn't double-check, raise effort.
3. **Did it have everything, clearly try, and still get it wrong?** That's the limit of what the model knows. Pick a bigger model.

```diagram
type: chain
caption: "three questions, in this order"
steps:
  - label: "Did it have what it needed?"
    note: "No: fix the task. No dial fixes this."
  - label: "Did it do the work?"
    note: "No: raise effort."
  - label: "Did it have everything, clearly try, and still get it wrong?"
    note: "Yes: pick a bigger model."
```

So you can blame the model only once you know the task was clear and the work was done. Matt makes the same point in [implement](/learn/implement): if one Ticket keeps running past a fresh session, split it rather than raise effort.

```checkpoint quick-5
You're on Sonnet. You described a time-zone bug clearly, and Claude read the right files, ran the tests and checked its work. Its fix takes the wrong approach twice. What do you change?
- [x] Switch to a bigger model, like `opus`.
- [ ] Raise effort to max and ask again.
- [ ] Reword the prompt and send it again on Sonnet.
Why: It had what it needed and clearly did the work, so effort and the task aren't the problem. A wrong approach after real work is the limit of what the model knows.
```

## Ultracode: many agents at once

Normally Claude works through a task turn by turn, and every result lands in its [context window](/learn/context-window), its working memory. A **dynamic workflow** works differently. Claude writes a short script, and the script runs many **subagents**: helper agents, each with its own fresh context window.

The script holds the plan and the results along the way, so only the final answer comes back to your conversation. That suits jobs one conversation can't hold, like a bug sweep across a whole codebase. Another is a 500-file migration: moving every file onto a new library.

**Ultracode** is how you hand big jobs to workflows. It's a setting, not an effort level: it runs at whatever effort you've set. You use it in one of two ways:

- **For one task:** put the word `ultracode` in your prompt, or ask for "a workflow" in your own words. Claude Code highlights the keyword.
- **For the whole session:** type `/effort ultracode`. Claude then decides which tasks deserve a workflow. Turn it off with `/effort ultracode off`.

For example:

```text
ultracode: check every page in web/ for links to pages that don't exist. Don't change anything.
```

Claude writes a script, shows you its planned phases, and asks before it runs. In auto mode, the [permission mode](/learn/how-agents-work) new sessions start in, it asks only before your first workflow. The run happens in the background, so you can keep working. Type `/workflows` to watch each phase, its agents and their token use.

With ultracode on, one request can become several workflows in a row: one to understand the code, one to change it, and one to check it. So each request uses more tokens and takes longer, and you reach your plan's limits sooner. Turn it on for the big job, then off.

```checkpoint quick-6
You're on medium effort, and you type `/effort ultracode`. What happens to your effort level?
- [x] It stays at medium: ultracode is a setting, not a level.
- [ ] It jumps to max, the level that ultracode runs at.
- [ ] It drops to low, so each agent in the workflow costs less.
Why: Ultracode is a setting, not an effort level. It runs at whatever effort you've set, and Claude decides which tasks deserve a workflow.
```

## Fast mode

**Fast mode** runs the same Opus model up to 2.5 times faster, at a higher price per token. It isn't a different model, so the quality is the same. Type `/fast` to turn it on or off.

It works on Opus models only, not Sonnet or Haiku. Turning it on from another model switches you to Opus, and a ↯ icon shows while it's on. On a subscription plan, you pay for it from **usage credits**, paid use on top of your plan. It stays on for later sessions until you turn it off.

**The first time you turn it on in a conversation, you pay the full fast-mode price for everything already in that conversation.** So turn it on at the start, for work where you wait on every reply, like live debugging. Leave it off for long runs you won't watch.

Fast mode is not the same as lower effort. Lower effort means less thinking, which can lower the quality on hard tasks. Fast mode keeps the quality and costs more.

```checkpoint quick-7
You're about to spend an hour live-debugging the booking form with Claude, waiting on every reply. You have usage credits. When do you turn on `/fast`?
- [x] Now, before the conversation gets long.
- [ ] Halfway through, once you know you need the speed.
- [ ] Never, because fast mode trades quality for speed.
Why: The first time you turn it on in a conversation, you pay the full fast-mode price for everything already in it, so it's cheapest at the start. The quality is the same.
```

## Going deeper

### Why it exists

The tempting move is to turn every dial up, "because the project matters". It backfires. Anthropic says `max` tends to overthink ordinary tasks, so you pay more for an answer that may be no better than `high`. Handing a task to helper agents costs tokens too, and you get a fresh pair of eyes, not a smarter answer.

So Anthropic's advice is to start with the defaults, and change one dial when a result tells you why. Matt agrees: two of his short videos are called "Your effort level is TOO DAMN HIGH" and "Your effort level is STILL TOO HIGH".

```checkpoint quick-8
A friend runs every task at `max` "because the project matters". What does Anthropic say happens on ordinary tasks?
- [x] It tends to overthink, so they pay more for an answer that may be no better.
- [ ] It runs the tasks as workflows, so they finish sooner than at `high`.
- [ ] It switches to a bigger model, so the answers get a little smarter.
Why: `max` tends to overthink ordinary tasks. You pay more for an answer that may be no better than `high`, so start with the defaults.
```

### How it works underneath

**The model is fixed; your prompt steers it.** A model's knowledge lives in its **weights**: billions of numbers set during training, and read-only after that. Your prompt and your files steer what it predicts, but they don't teach it anything that lasts. So switching models is the only way to get more knowledge.

**Effort travels with your request.** The level is sent along with your message, and the model was trained to behave differently at each level. It decides step by step whether, and how much, to think. At a higher level it often makes a plan first. Then it drops the steps it no longer needs, like testing other theories once one has found the bug.

**An analogy.** Lydia Hallie, on the Claude Code team, compares the models to people: Fable is a specialist, Opus an expert, and Sonnet a really good generalist. Opus at low effort is like five minutes with an expert. Sonnet at high effort is like giving a generalist the whole afternoon. The model is roughly how capable; effort is roughly how thorough.

```checkpoint quick-9
You paste a new library's docs into your prompt. What changes about the model?
- [x] Nothing lasting: the docs steer this answer, but the weights stay the same.
- [ ] The model learns the library, so later sessions know it too.
- [ ] The model moves up to a bigger version that knows the library.
Why: A model's weights are set in training and read-only after that. Your prompt and files steer what it predicts, but they don't teach it anything that lasts.
```

**Who holds the plan.** With subagents or a Skill, Claude decides turn by turn what runs next, and every result goes into its context window. With a workflow, the script decides, the results stay in the script, and one run can use dozens to hundreds of agents.

```diagram
type: compare
caption: "Who holds the plan"
columns: ["Subagents or a Skill", "A workflow"]
rows:
  - label: "decides what runs next"
    cells: ["Claude, turn by turn", "the script"]
  - label: "the results go into"
    cells: ["Claude's context window", "the script"]
  - label: "agents in one run"
    cells: ["a few", "dozens to hundreds"]
```

### A real example

Thariq Shihipar, writing on the claude.dev blog in September 2026, ran the same builds at each effort level. One build took 1.5 minutes on low, 4 on medium, 11 on high and 67 on max.

Across his tests, more effort cut the failures that came from missed edge cases. It didn't fix the failures where the model took the wrong approach. That's the three questions at work: effort fixes skipped work, and a wrong approach after real work points to the model.

Matt runs below the defaults, not above them. In his July 2026 walkthrough, he ran his whole flow on Opus 4.8 at medium effort, one level under that model's default of high. He also told viewers "you really don't have to use the same setup as me."

```checkpoint quick-10
In Thariq's tests, what did more effort fix?
- [x] Failures from missed edge cases, but not a wrong approach.
- [ ] A wrong approach, but not failures from missed edge cases.
- [ ] Both kinds of failure, once effort reached `max`.
Why: More effort cut the failures that came from missed edge cases. It didn't fix the ones where the model took the wrong approach, which points to a bigger model instead.
```

### Where it goes wrong

**A one-line fix took minutes, and changed things you didn't ask for.** The effort was too high for routine work: `max` is prone to overthinking. Go back to the default. `/effort auto` clears a saved level.

**Tomorrow's session started on the wrong model.** You typed a model's name, which saved it as your default. For a one-off switch, open `/model` and press `s` on the row.

**The grilling shrank to a couple of questions and an outline.** Users report this most on weaker or lower-effort models, which rush the interview and start building. Grill on your strongest everyday model. If it still starts building, add a line to your `CLAUDE.md` telling the agent not to implement without permission.

```checkpoint quick-11
Your grilling stops after two questions, writes an outline and starts building. Which change fits first?
- [x] Grill on your strongest everyday model.
- [ ] Turn on fast mode, so the interview runs faster.
- [ ] Put the word ultracode in your first message.
Why: Users report this most on weaker or lower-effort models. Grilling leans on what the model learned in training, so it needs a strong model.
```

**Your weekly limit ran out mid-week.** Ultracode stayed on, so everyday tasks became workflows. `/effort ultracode` lasts one session, but `"ultracode": true` in your settings file turns it on for every session. Remove that line once the big job is done.

**A workflow kept spending, and you wanted it stopped.** In `/workflows`, the `x` key stops whatever is selected. Select the run itself, not one of its agents, and the whole run stops. On a Pro plan, you also have to turn on Dynamic workflows in `/config` before any workflow runs.

**You typed `/code-review ultra` and expected ultracode.** That's something else: Claude Code's own review, run in the cloud by a fleet of reviewer agents that check each finding before they report it. A review typically takes 5 to 15 minutes. Pro, Max and Ultra plans get three free runs, once. After that, each costs roughly $5 to $25 in usage credits, so save it for a risky change before you merge. It isn't Matt's [code-review](/learn/code-review) Skill either.

**Fast mode cost more than you expected.** You turned it on deep into a long conversation, so the first charge covered all of it. Turn it on at the start.

```checkpoint quick-12
A workflow's token count keeps climbing in `/workflows`, and you want the whole run stopped now. What do you do?
- [x] Select the run itself and press `x`.
- [ ] Select the agent using the most tokens and press `x`.
- [ ] Type `/effort low`, so its agents use fewer tokens.
Why: `x` stops whatever is selected. Selecting one agent stops only that agent, so select the run itself to stop it all.
```

### Try it

You'll need Claude Code installed and signed in (see [start here](/learn/start-here)). No Skills are needed. If Claude Code asks you to confirm a change, confirm it.

1. Make a practice folder: `mkdir dials && cd dials`.
2. Start Claude Code: `claude`. If it asks whether you trust the folder, choose Yes.
3. Read the session header at the top. You should see your model and its effort level.
4. Type `/status` to check the model, then press Esc to close it.
5. Type `/effort`. Move to `low` with the arrow keys and press `s`, for this session only.
6. Send `In five bullets, plan a one-page site for a yoga studio. Don't create any files.` Notice how long Claude works.
7. Type `/effort`, choose `high`, and press `s`. Send the same prompt, and compare how long it works.
8. Send `ultrathink: which of those bullets is the riskiest, and why?` Afterwards, the header should still say high effort.
9. Optional, and it uses noticeably more tokens: send `ultracode: write three one-paragraph pitches for the site in parallel, then have another agent pick the best. Don't create any files.` On a Pro plan, turn on Dynamic workflows in `/config` first.
10. If you ran step 9, approve the plan when asked, and type `/workflows` to watch. Select the run and press `x` if it spends more than you'd like.
11. Type `/exit`, then start `claude` again. You should be back at your old effort level, because you pressed `s` both times.

On a prompt this small, the gap between low and high can be slight. Effort shows most on work that reads files and runs tests.

### Read more

- [Model configuration](https://code.claude.com/docs/en/model-config), Anthropic
- [Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code), Lydia Hallie, Anthropic, 2026-07-07
- [Using Claude Code: Spending your effort](https://claude.dev/blog/spending-your-effort/), Thariq Shihipar, 2026-09-25
- [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows), Anthropic
- [Speed up responses with fast mode](https://code.claude.com/docs/en/fast-mode), Anthropic
- [Find bugs with ultrareview](https://code.claude.com/docs/en/ultrareview), Anthropic
- [9 Things People Get Wrong With /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), Matt Pocock, 2026-05-25

## Remember

```flashcards
Q: What does the model decide, and what does effort decide?
A: The model decides how capable Claude is. Effort decides how much work it does on each turn: how long it thinks, how much it reads and how much it checks.

Q: What does typing `/model sonnet` do besides switching?
A: It saves Sonnet as your default for new sessions. To switch for one session only, open `/model` and press `s` on the row.

Q: What are the effort levels, and the default on Opus, Sonnet and Haiku 5.5?
A: `low`, `medium`, `high`, `xhigh` and `max`. The default is `medium`.

Q: How do you get deeper reasoning on one turn without changing your effort setting?
A: Put the word `ultrathink` in that prompt.

Q: When Claude gets something wrong, what are the three questions, in order?
A: Did it have what it needed (if not, fix the task)? Did it do the work (if not, raise effort)? Did it clearly try and still fail (then pick a bigger model)?

Q: Is ultracode an effort level?
A: No. It's a setting that runs big jobs as workflows of many subagents, at whatever effort you've set.

Q: When should you turn on fast mode?
A: At the start of a conversation where you wait on every reply. The first switch-on charges everything already in the conversation at the fast rate.
```

## Final test

```final-test models-outage-hunt
Booking has failed for a few users for two days. Nobody knows where to look, and the hunt will run for hours across several parts of the system. Which model fits best?
- [x] `fable`, picked on purpose for this hunt.
- [ ] `haiku`, so each attempt comes back quickly.
- [ ] `opusplan`, since the work needs a lot of planning.
- [ ] `sonnet`, with effort raised to high.
Why: Fable is for your hardest, longest work, like root-cause hunts and outages. It's never the default, so you pick it. Haiku is for simple tasks, and more effort can't lift Sonnet past what it knows.
```

```final-test models-skipped-tests
You asked for a fix to the booking form's length limit. Claude changed one file, never opened the API file your prompt named, and didn't run the tests. You're on Opus at low effort. What's the best change?
- [x] Raise effort to medium or high.
- [ ] Switch to Fable for this task.
- [ ] Name the API file again and resend at low.
- [ ] Switch to `opusplan`, so Opus plans the fix first.
Why: Skipping a file it was pointed at and not running the tests mean it didn't do the work. Effort sets how much it reads and checks. Your prompt already named the file, so the task wasn't the problem.
```

```final-test models-sequence-miss
Claude's fix to the booking form came back wrong. Before you touch a dial, you ask three questions in turn. Which order lets each answer point to the right fix?
- [x] Did it have what it needed? Did it do the work? Is the model capable enough?
- [ ] Did it do the work? Did it have what it needed? Is the model capable enough?
- [ ] Is the model capable enough? Did it do the work? Did it have what it needed?
- [ ] Did it have what it needed? Is the model capable enough? Did it do the work?
Why: Fix a vague task first, because no dial fixes that. Then check it did the work, because effort fixes skipped steps. Only a clear task, fully worked and still wrong, points to a bigger model.
```

```final-test models-predict-session-only
On Monday you type `/model sonnet`. On Tuesday you open `/model`, highlight Fable and press `s`, then quit. Which model does Wednesday's new session start on?
- [x] Sonnet, because Monday's typed switch is still your saved default.
- [ ] Fable, because it was the last model you picked.
- [ ] Opus, because a session-only pick resets you to the account default.
Why: Typing `/model sonnet` saved Sonnet as your default. Pressing `s` on Fable switched for Tuesday's session only and left that default alone.
```

```final-test models-migration-day
Today you're moving 400 files onto a new library, and nearly every request will be a big sweep. You want Claude to plan workflows on its own all day. What do you do?
- [x] Type `/effort ultracode`.
- [ ] Type `/effort max`.
- [ ] Start the first prompt with the word ultracode.
- [ ] Type `/model fable`.
Why: `/effort ultracode` turns ultracode on for the session, so Claude decides which tasks deserve a workflow. The keyword in one prompt covers that task only, `max` is how hard each turn works, and a bigger model still works turn by turn.
```

```final-test models-spot-ultracode-left-on
On Monday, Priya put `"ultracode": true` in her settings file for a big audit. By Thursday she has hit her weekly limit, mostly on everyday feature work. Spot the mistake.
- [x] Ultracode stayed on, so everyday tasks became workflows.
- [ ] Ultracode set her effort to max, and max burned the tokens.
- [ ] Workflows don't count toward limits, so something else used them up.
- [ ] She should have run the audit with `/code-review ultra` instead.
Why: With ultracode on, one request can become several workflows, each using more tokens. The setting turns it on for every session, so remove it once the big job is done. It runs at whatever effort you've set.
```

```final-test models-spot-max-everywhere
Ravi runs every task at `max`: renaming a variable, fixing a typo, summarising one file. Each takes minutes, and a typo fix comes back with a paragraph rewritten. Spot the mistake.
- [x] He gave routine edits the deepest level, so it overthought them.
- [ ] He picked `max` when `xhigh` is the deepest level there is.
- [ ] He left ultracode off, so the edits couldn't run in parallel.
- [ ] He needed a bigger model, since `max` only works on Fable.
Why: `max` is the deepest level and prone to overthinking ordinary tasks. Start at the default and raise effort only for hard work, like a bug in code you didn't write.
```

```final-test models-worth-paying
This week, Claude will tidy code overnight while you sleep, and on Friday you'll merge a risky change to how bookings are saved. You have usage credits. Where is paying extra worth it?
- [x] `/code-review ultra` on the bookings change, before Friday's merge.
- [ ] Fast mode for the overnight tidy-up, so it finishes sooner.
- [ ] Fast mode for the bookings change, turned on halfway through.
- [ ] `/code-review ultra` after every small edit this week.
Why: A cloud review that checks each finding earns its price on a risky change before you merge. Fast mode pays off only when you wait on every reply, and it's cheapest switched on at the start.
```

```final-test models-fast-not-effort
You want faster replies but the same quality on hard questions. Which fits, fast mode or lower effort?
- [x] Fast mode: the same model and quality, at a higher price per token.
- [ ] Lower effort: the same quality, because it only shortens the replies.
- [ ] Either one: they are two names for the same speed setting.
Why: Fast mode runs the same Opus model faster, so the quality is the same and you pay more. Lower effort means less thinking, which can lower the quality on hard tasks.
```

```sources
- [Model configuration](https://code.claude.com/docs/en/model-config), Anthropic
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [Commands](https://code.claude.com/docs/en/commands), Anthropic
- [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows), Anthropic
- [Speed up responses with fast mode](https://code.claude.com/docs/en/fast-mode), Anthropic
- [Find bugs with ultrareview](https://code.claude.com/docs/en/ultrareview), Anthropic
- [Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code), Lydia Hallie, Anthropic, 2026-07-07
- [Using Claude Code: Spending your effort](https://claude.dev/blog/spending-your-effort/), Thariq Shihipar, 2026-09-25
- [9 Things People Get Wrong With /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), Matt Pocock, 2026-05-25
- [The /grilling Skill](https://www.aihero.dev/skills-grilling), Matt Pocock
- [The /implement Skill](https://www.aihero.dev/skills-implement), Matt Pocock
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [Your effort level is TOO DAMN HIGH](https://www.youtube.com/watch?v=iQb3F9UzBR4), Matt Pocock, 2026-07-15
- [Your effort level is STILL TOO HIGH](https://www.youtube.com/watch?v=JgEsphDAXnY), Matt Pocock, 2026-10-13
```
