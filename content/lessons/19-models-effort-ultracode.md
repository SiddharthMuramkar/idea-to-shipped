---
title: Models, effort & ultracode
slug: models-effort-ultracode
order: 19
part: 4
---

Claude Code has four dials that decide how much brain, time and money go into each reply. Turning them all up rarely helps; here's how to set each one, and when to leave it alone.

```goals
- You'll be able to choose a model for a task and switch with `/model`, either as your new default or for one session only.
- You'll be able to set effort with `/effort`, say what it changes, and tell from a bad result whether to raise effort, pick a bigger model or fix the task.
- You'll be able to explain what ultracode does, why it isn't an effort level, and turn it on for one task or a whole session.
- You'll be able to decide when fast mode and `/code-review ultra` are worth paying for, and when to switch fast mode on.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. The AI underneath is a **model**, and you choose which one, and how hard it works on each turn. Every choice spends tokens, the small chunks of text that AI usage is measured and billed in. On a subscription they eat into your usage limits; if you pay per use, they cost money.

The tempting move is to turn everything up. Someone picks the strongest model and the highest effort "because the project matters". Then a one-line style fix to a comment box takes ten minutes, the weekly limit runs out by Wednesday, and the answers get worse, not better: the agent overthinks and changes things nobody asked for. The opposite mistake happens too: a small, fast model gets a subtle bug, fails confidently three times, and the prompt (what you typed) gets the blame.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code (short instruction files the agent loads when you type their name, or when a task fits; see [Skills](/learn/skills)), puts it bluntly: most people's ==effort level is too high==. Anthropic's own guidance is to use the default effort for most tasks, and when a result disappoints, to check what you gave Claude before touching a dial. This Lesson teaches no Skill. It teaches the dials every Skill runs on:

| Dial | What it decides | How you set it |
|---|---|---|
| Model | Which brain answers, and how capable it is | `/model` |
| Effort | How much work it does on each turn | `/effort` |
| Ultracode | Whether big tasks become scripts that run many helper agents | `/effort ultracode`, or the word `ultracode` in a prompt |
| Fast mode | The same Opus model, answering faster at a higher price | `/fast` |

## Models: which brain answers

A model's knowledge is fixed when it's trained. Nothing in your prompt makes it smarter; switching models swaps in a different brain. Bigger models know more and cope better with vague problems, but cost more per token and run slower.

You pick a model by **alias**, a short name that points at the newest version:

| Alias | Today it means | Reach for it when |
|---|---|---|
| `haiku` | Haiku 5.5 | Simple, quick tasks you can describe exactly |
| `sonnet` | Sonnet 5.5 | Everyday coding, cheaper than Opus |
| `opus` | Opus 5.5 | Complex reasoning. It's also what you get out of the box on paid plans |
| `fable` | Fable 5.1 | The hardest, longest work: root-cause hunts, outages, architecture |
| `opusplan` | Opus in plan mode (where it only reads and proposes until you approve), then Sonnet to carry out the plan | You plan first and want a cheaper builder |
| `best` | Fable where your account has it, otherwise Opus | You always want the top model |

Fable is never the out-of-the-box default: you pick it on purpose, and on some plans it bills to **usage credits** (paid usage on top of your plan), asking you first. Aliases move when new models ship; to pin one exact version, use its full name, like `claude-opus-5-5`.

**Switching.** Type `/model` to open the picker. The detail that catches people: ==`/model` saves your choice as the default for new sessions== (a session is one Claude Code conversation, from starting `claude` until you clear it or quit). Pressing Enter on a row, or typing `/model sonnet` directly, switches and saves. Press `s` on a row instead to switch for this session only. Starting Claude Code from your terminal with `claude --model haiku` applies to that one launch, and `/status` shows what you're on. To undo a saved pick, type `/model default`: it clears your choice and goes back to your account's default.

Matt's rule of thumb: grilling (an interview where the agent questions you about your plan; see [Grilling](/learn/grilling)) leans on what the model learned in training, so it deserves your strongest everyday model, usually `opus`. Building from a clear ticket (a short written description of one small piece of work, usually cut from a bigger plan) mostly follows what's already in front of the agent, so a cheaper model often does fine. The grilling Skill's own docs warn that on weaker models or low effort, the interview tends to shrink to a couple of questions and an outline. Anthropic adds subtle bugs, unfamiliar territory and architecture decisions to the big-model list.

```checkpoint model-saves-default
You need one quick rename, so you type `/model haiku`, do it, and quit. What model does tomorrow's new session start on?
- [ ] Opus 5.5, because a switch you type only lasts until you quit Claude Code.
  > That's what `s` in the picker does. Typing `/model haiku` works like Enter: it saves Haiku as your default.
- [x] Haiku, because typing the name saved it as your default.
  > Right. To switch for one session only, open `/model` and press `s` on the row.
- [ ] Whichever model Claude judges best for the first task.
  > Claude Code doesn't pick a model per task. It starts on your saved default.
```

## Effort: how much work each turn gets

Effort is more than thinking time (the reasoning a model does before it answers). It sets how much work Claude does before it comes back to you: how long it reasons, how many files it reads, whether it runs the tests (automated checks of the code) and double-checks. At low effort you get a starting point sooner, and Claude would rather ask you than dig on its own. At high effort it verifies more, tests more edge cases (unusual inputs that tend to break code) and makes more choices for you.

The levels are `low`, `medium`, `high`, `xhigh` and `max`. Opus, Sonnet and Haiku 5.5 start at **medium**; most other models start at high. Anthropic reports that Opus 5.5 on medium matches or beats Opus 5 on high, so if you're coming from Opus 5, don't carry your old level over.

| Level | Claude Code's docs suggest it for |
|---|---|
| `low` | Quick exchanges you review each time: a sketch, a rename |
| `medium` | Day-to-day work with a clear scope, like building a planned feature |
| `high` | Bugs in existing code, and work with likely edge cases |
| `xhigh` | Deeper reasoning, at a higher token spend |
| `max` | Hard problems Claude works through alone, like a security review |

`max`, the deepest level, lasts for the current session only, shows diminishing returns and tends to overthink. On the 5.5 and Fable models you can't switch thinking off; the model decides at each step how much to think, guided by effort.

For one turn that needs deeper reasoning, put the word `ultrathink` anywhere in your prompt: Claude reasons harder ==on that turn only==, and your effort setting doesn't change. It's still the same model, no smarter than before. Phrases like "think hard" are ordinary text, not keywords.

```scene terminal
title: Setting the dials in a session (illustrative)
# Start Claude Code from your terminal. The session header names your model and its effort: on Opus 5.5 you start at medium unless you've saved something else.
$ claude
Opus 5.5 with medium effort
# From here on you type at Claude Code's prompt, not the shell. Typing a level by name sets it and saves it as your default for new sessions too.
$ /effort low
Effort set to low (saved as your default)
# For this session only, open the slider instead, choose a level and press s.
$ /effort
# One tricky question? The keyword buys deeper reasoning for this turn, and your level stays put.
$ ultrathink: why does the comment form sometimes post twice?
# Clear your saved level, so the model's own default applies again.
$ /effort auto
# Models work the same way: in the picker, Enter saves your choice and s keeps it to this session. The arrow keys there set effort too.
$ /model
```

```checkpoint effort-low-means
You drop effort to low for a change to a recipe site. Compared with high, what should you expect?
- [x] A first version sooner, with less checking and more questions to you.
  > Right. Low effort reads and verifies less, and would rather ask you than dig on its own.
- [ ] The same work and checking, written up in shorter replies.
  > Effort changes how much work it does, not just how long the reply is.
- [ ] A smaller, cheaper model quietly answering instead of yours.
  > Effort never changes the model. That's `/model`.
- [ ] No thinking at all, because low effort switches thinking off on every step.
  > On the 5.5 models thinking can't be switched off. Low effort means it thinks less, and less often.
```

## Model or effort? Reading a bad result

When Claude gets something wrong, resist reaching for every dial. Anthropic's July 2026 guide says to look first at what you gave Claude, and only then ask whether it didn't try hard enough or didn't know enough. That gives three questions, ==asked in this order==:

- **Was the request vague, or did it lack a fact it couldn't find?** No dial fixes that. Fix the task: add the context, write the rule into `CLAUDE.md` (the file of standing instructions Claude reads every session), or grill a clear plan first.
- **Did it skip a file it could have found, skip the tests or stop halfway?** It didn't do the work. Raise effort.
- **Did it have what it needed, clearly try, and still get it wrong?** That's the model's ceiling. Pick a bigger model.

You can only blame the model once you know the task was clear and the work was done. Thariq Shihipar, writing on claude.dev, found something similar in his own tests: more effort fixed missed edge cases, not a wrong approach, and once Claude had a detailed spec (a written plan of what to build), the levels gave much closer results. Matt's docs for his implement Skill make the point from the task side: if one ticket keeps running long, split it rather than raising effort.

```scene flow
title: Which dial does this failure need?
node: miss | It got it wrong
node: context | Did it have what it needed?
node: task | No: fix the task, not a dial | side
node: work | Did it do the work?
node: effort | No: raise effort | side
node: model | Yes to both: pick a bigger model
# Something came back wrong. Before you touch a dial, ask why.
at: miss
# First: did it have the context? A vague request, or a key fact nobody gave it and it couldn't find, is a problem with the task.
at: context
# If not, no model or effort level fixes it. Add the context, write the rule down, or grill a clear plan.
at: task
# Second: did it do the work, or skip a file it could have found, skip the tests, stop halfway?
at: work
# If it cut corners, raise effort: effort sets how much Claude reads, runs and checks.
at: effort
# It had everything, clearly tried, and was still wrong. That's the model's ceiling: switch to a bigger one.
at: model
```

```checkpoint diagnose-ceiling
You're on Sonnet. Your request described a time-zone bug clearly, and Claude read the right files, ran the tests and checked its work. Both of its fixes take the same wrong approach. What do you change?
- [ ] Raise effort to max and ask again.
  > It already did the work. More effort catches skipped steps and missed edge cases, not a wrong approach.
- [ ] Add `ultrathink` to the same prompt.
  > That asks Sonnet for deeper reasoning on one turn, but it's still Sonnet. After real work, a wrong approach is its ceiling.
- [ ] Reword the prompt and send it again on Sonnet.
  > The task wasn't the problem: it was clear, and Claude did the work. Rewording won't raise Sonnet's ceiling.
- [x] Switch to a bigger model, like `opus`.
  > Right. It had what it needed and clearly tried. That's the model's ceiling, so pick a more capable one.
```

## Ultracode: many agents instead of one

Normally Claude works through a task turn by turn, and every result lands in its context window (its working memory for the conversation, measured in tokens; see [The context window](/learn/context-window)). A **dynamic workflow** works differently. Claude writes a short script (a small program), and the script runs many sub-agents (helper agents, each with its own fresh context window), up to hundreds, in the background. The script holds the plan and the in-between results, so only the final answer comes back to your conversation, and it can have agents check each other's findings first. It's built for jobs one conversation can't hold: auditing every file, a 500-file migration (updating every file to a new library).

**Ultracode** is how you opt in to workflows. It's ==a setting, not an effort level==: it runs at whatever effort you've set. Two ways to use it:

- **One task:** put the word `ultracode` in your prompt, or simply ask for "a workflow". Claude Code highlights the keyword (Option+W, or Alt+W, dismisses it).
- **The whole session:** type `/effort ultracode`, or open the `/effort` slider, press Tab to flip the Ultracode toggle, then Enter. Claude then decides which tasks deserve a workflow. Turn it off with `/effort ultracode off`. Starting from your terminal with `claude --effort ultracode` turns it on *and* sets effort to `xhigh`; the setting `"ultracode": true` in your settings file (`~/.claude/settings.json`) turns it on for every session.

With it on, one request can become several workflows in a row: one to understand the code, one to change it, one to check it. That's more tokens and more time on every task, so you reach your plan limits sooner. It also skips some safety checks, including the "Large workflow" warning (shown when a run plans many agents or tokens) and, in auto mode, the approval before your first workflow. Auto mode is the permission mode new sessions start in, where a second model reviews Claude's actions instead of asking you about each one. Turn ultracode on for the big job, then off. `/workflows` shows each run's agents and their tokens; `x` there stops whatever is selected, so select the run itself, not one agent, to stop it all. On a Pro plan, switch on Dynamic workflows in `/config` first. If the Ultracode toggle is missing, workflows are off or your model has no `xhigh` level.

```scene chat
title: One task as a workflow, on this site's Lessons (illustrative)
# You opt in for this one task by starting the prompt with the keyword. Claude Code highlights it.
you: ultracode: check every Lesson file for links to /learn/ pages that don't exist. Don't change anything.
# Instead of working turn by turn, Claude writes a workflow script and describes its plan.
agent: I'll run this as a workflow in three phases: **list** the Lesson files, **check** each file's links with one agent per file, then **verify** every broken link with a second agent before reporting.
# Claude Code shows the phases and asks before starting (in auto mode, only before your first workflow ever).
you: *Yes, run it* (picked from the approval menu)
# It runs in the background, so you keep working. The progress view lists each phase, its agents and their token use; x on the run stops it.
you: `/workflows`
# One report comes back. The per-file results stayed in the script, so your context window holds only the summary.
agent: Checked 20 Lesson files, and a second agent confirmed each finding. 2 broken links, listed below with line numbers. No files changed.
```

```checkpoint stop-whole-run
You started a workflow with the `ultracode` keyword to audit every Lesson file. In `/workflows`, its token count keeps climbing, and you want the whole run stopped now. What do you do?
- [ ] Select the agent using the most tokens and press `x`.
  > That stops one agent. The rest of the run keeps going.
- [ ] Type `/effort ultracode off`.
  > The keyword opted in this one task, so there's no session setting to turn off, and the run is already going.
- [x] Select the run itself and press `x`.
  > Right. `x` stops whatever is selected, so select the run, not one agent, and it all stops.
- [ ] Type `/effort low`, so its agents use fewer tokens.
  > Effort sets how much work each turn gets. It doesn't stop a run that's already going.
```

## Fast mode, and a review called "ultra"

**Fast mode** (`/fast`) runs the same Opus model up to 2.5 times faster, at a higher price per token. Quality doesn't change. It works on Opus 5.5, Opus 5 and Opus 4.8 only; turning it on from another model switches you to Opus, and a ↯ icon shows it's on. On subscription plans it's paid from usage credits only, and it stays on for future sessions until you turn it off.

The catch is timing. The first time you turn it on in a conversation, you pay the full fast-mode price, once, for everything already in that conversation. So ==switch it on at the start==, for live debugging or quick back-and-forth where you wait on every reply, and leave it off for long runs you won't watch.

**`/code-review ultra`** sounds like ultracode but isn't. Claude Code's Built-in command `/code-review` (not a Skill) is a bug hunt you can run at an effort level, like `/code-review max`. Its `ultra` level uploads your project to an isolated machine in the cloud, where a fleet of reviewer agents hunts for bugs in the changes on your branch (your line of work in Git, the tool that tracks a project's history), and every finding is reproduced and verified before it's reported. It takes about 15–25 minutes, gives Pro and Max accounts three free runs (once, not monthly), then costs roughly $5–$25 in usage credits per review, and it only starts when you type it. It earns that price on a risky change just before you merge, not on every small edit. It isn't Matt's code-review Skill either, which you reach with `/mattpocock-skills:code-review` (see [Code review](/learn/code-review)).

## How Matt and others use it

**Matt Pocock:**

- **Medium effort, maybe lower.** In an October 2026 short he said he runs Opus 5.5 on medium, is weighing low, and that even high is more than most coding needs. The same day he put "Your effort level is too high" at the top of a list of common mistakes on X.
- **Exploring doesn't need effort.** In a July 2026 short he said most people get better value from a lower level, because opening files to explore a codebase doesn't need deep reasoning.
- **Effort per task, not per session.** His AI Coding Dictionary (September 2026) says to raise effort for the genuinely hard part and drop it for the routine work around it.
- **Grill on the stronger model.** In May 2026 he called too weak a model a common grilling failure, because grilling relies on what the model learned in training. At an April 2026 workshop he built with Sonnet and reviewed with Opus.
- **Below the default, even on older models.** In his June 2026 demo of his `/teach` Skill he ran Opus 4.8 at medium, one step under its default of high.

We found nothing from Matt on ultracode or fast mode as of October 2026.

**Others:**

- **Thariq Shihipar** (claude.dev, September 2026) has Claude interview him about a spec, implements on low, reviews the result, then verifies on high. In his tests, the same vaguely described app took 1.5 minutes on low and 67 minutes on max.
- **A Reddit user** in July 2026 grilled on Opus 5 at medium and implemented on Sonnet 5 at medium.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). No Skills are needed for this one.

1. Make a practice folder and start Claude Code in it. If it asks whether you trust the folder, choose Yes.

```sh
mkdir dials
cd dials
claude
```

2. Read the session header at the top: it names your model and its effort. Type `/status` to double-check the model, then press Esc to close it.
3. Type `/effort`. Look at the levels and, if you see it, the Ultracode toggle (on a Pro plan it only appears after the `/config` change in step 7). Move to `low` with the arrow keys and press `s` (this session only).
4. Send this, and notice how long Claude works before answering:

```text
In five bullets, plan a one-page site for a book club. Don't create any files.
```

5. Type `/effort` again, choose `high`, press `s`, and send the same prompt. If Claude Code warns about the cache, confirm. Claude can see its first answer, so compare how long it worked, not how long the reply is.
6. Now send:

```text
ultrathink: which of those bullets is the riskiest, and why?
```

7. Optional, and it uses noticeably more tokens. On a Pro plan, first turn on Dynamic workflows in `/config`. Then send the prompt below, and approve the plan if asked. Open `/workflows` to watch, and if its token count climbs past what you'd spend, select the run and press `x`.

```text
ultracode: write three different one-paragraph pitches for the book club site in parallel, then have another agent pick the best. Don't create any files.
```

8. Press Esc if a reply runs longer than you want (a workflow is stopped in `/workflows` instead). Type `/exit`, and if it asks about running tasks, choose to stop them. Run `claude` once more to check the last box, then `/exit` again.

**It's working if:**

- [ ] You could name your model and effort without guessing.
- [ ] The header said low effort after step 3, and high after step 5.
- [ ] The high run worked longer before answering. On a prompt this small the gap can be slight; effort shows most on work that reads files and runs tests.
- [ ] After the `ultrathink` answer, the header still said high effort.
- [ ] (Optional) The workflow appeared in `/workflows`, with its phases and their agents.
- [ ] The new `claude` session started at your old level, because you pressed `s` both times.

If your default ever changes by accident, `/effort auto` clears your saved level.
````

## Common mistakes

- **Max, or even high, for everything.** Slower, pricier and prone to overthinking. Start at the default and raise effort for the hard part only.
- **Typing `/model haiku` for one quick job,** then finding tomorrow's session on Haiku. Use `s` in the picker.
- **Raising effort to rescue a vague task.** Fix the task instead; see Model or effort? above.
- **Leaving ultracode on for routine work,** or thinking it's a level above max.
- **Turning on fast mode deep into a conversation,** or expecting it on Sonnet or Haiku.
- **Mixing up the "ultras" and the reviews:** `/code-review ultra` is a paid cloud bug hunt, ultracode is a setting, and Matt's review is `/mattpocock-skills:code-review`.

```site-story
This Lesson was in the plan from the first grilling. We agreed on 11 Lessons, one per Skill plus "Start here" and this one, and the site's first spec put "Models, effort & ultracode" last. In the same grilling I said no to a model-and-effort box on every Lesson: writing it down doesn't teach it, so one Lesson about the dials would do.

**The first build ran on Opus 5.5 at the session's default effort,** and the commits credit Claude Opus 5.5 as co-author. At one point I opened `/effort`, looked at the slider, and cancelled: I was just looking. For review I ran Claude Code's Built-in `/code-review max` in the background, and separately Matt's `/mattpocock-skills:code-review` over everything since the first commit: a Built-in command and a Skill that share a short name.

My first version of this Lesson had a rule-of-thumb table that put grilling on high effort and the final review on max, more than Matt recommends today. The line I wrote under it still holds: higher isn't always better, so match the dial to how hard the problem is.
```

## Cheat sheet

| Situation | Dial |
|---|---|
| Everyday work | Leave the defaults (Opus 5.5 on medium), or `sonnet` to spend less |
| Routine edits you can describe exactly | `sonnet` or `haiku`, or `low` effort |
| Grilling, review, a subtle bug | Your strongest everyday model, usually `opus` |
| Huge, ambiguous, hours-long work | `fable`, picked on purpose |
| It skipped steps | Raise effort |
| One question needs deeper reasoning | `ultrathink` in that prompt |
| It clearly tried and was still wrong | A bigger model |
| The task was vague | Fix the task, not a dial |
| Switch for this session only | `/model` or `/effort`, then `s` |
| One big sweep as a workflow | Start the prompt with `ultracode` |
| A session of big sweeps | `/effort ultracode`, later `/effort ultracode off` |
| Live debugging where speed matters | `/fast`, at the start of the conversation |
| A risky change before merging | `/code-review ultra`: cloud, paid after 3 free runs |

## Final test

```test scenario-grill-then-build
You're about to grill a fuzzy idea for a recipe site, then hand the finished tickets to an agent to build one by one. Following Matt's habit, how do you split the models?
- [ ] A small, fast model to grill, and your strongest one for the tickets.
  > Backwards. Grilling leans on what the model learned in training to raise things you missed, so it gets the stronger model.
- [ ] `fable` for both, so neither step is short of brainpower.
  > Fable costs the most and may bill usage credits. Building from clear tickets doesn't need it.
- [x] A strong everyday model to grill, and a cheaper one to build.
  > Right. Grilling relies on the model's own knowledge; building from a clear ticket mostly uses what's already in context.
- [ ] One mid-sized model for both, so the two steps stay consistent.
  > The steps lean on different things: grilling on the model's own knowledge, building on the ticket.
```

```test scenario-outage-hunt
Checkout has failed for a small share of users for two days. Nobody knows where to look, and the investigation will run for hours across several services. Which model fits best?
- [x] `fable`, switched to for this investigation.
  > Right. Fable is aimed at the hardest, longest work, like root-cause investigations and outages. It's never the default, so you choose it.
- [ ] `haiku`, so each attempt comes back quickly.
  > Haiku is for simple tasks you can describe exactly. This is the opposite.
- [ ] `opusplan`, since the work needs a lot of planning.
  > `opusplan` just means Opus in plan mode and Sonnet afterwards. It splits planning from building; it isn't for the hardest problems.
- [ ] `sonnet`, with effort raised to high.
  > This is far from everyday work. More effort can't lift Sonnet past its ceiling on a problem this hard.
```

```test scenario-skipped-tests
You asked for a fix to the comment form's length limit. Claude changed one file, never opened the API route your prompt named, and didn't run the tests. You're on Opus 5.5 at low. What's the best change?
- [ ] Switch to Fable.
  > A bigger model helps when it tried and still failed. Here it didn't do the work.
- [x] Raise effort to medium or high.
  > Right. Skipping a file it was pointed at and not running the tests are signs it didn't try hard enough. Effort sets how much it reads and checks.
- [ ] Switch to `opusplan`, so Opus plans the fix first.
  > Planning on Opus doesn't make the build step read or check more. The problem was effort.
- [ ] Name the API route in the prompt again, and resend at low.
  > Your prompt already named it, so the context was there. It didn't do the work.
```

```test scenario-migration-day
Today you're migrating 400 files to a new API, and nearly every request will be a big sweep. You want Claude to plan workflows on its own all day. What do you do?
- [ ] Type `/effort max`.
  > That's how much work each turn gets. It doesn't create workflows.
- [ ] Start the first prompt with `ultracode`.
  > The keyword opts in that one task. The rest of the day would run turn by turn.
- [ ] Type `/model fable`.
  > A bigger model still works turn by turn. Workflows come from ultracode, not the model.
- [x] Type `/effort ultracode`.
  > Right. It turns ultracode on for the session at your current effort, so Claude decides which tasks deserve a workflow. Turn it off before routine work.
```

```test scenario-live-debug
You're about to spend an hour live-debugging a flaky sign-up form with Claude on Opus 5.5, waiting on every reply. You have usage credits and want faster answers. When do you turn on `/fast`?
- [x] Now, before the conversation gets long.
  > Right. The first switch-on charges the whole conversation so far at the fast rate, once, so it's cheapest at the start.
- [ ] Halfway through, once you know you need the speed.
  > By then the one-time charge covers a long conversation. Decide at the start.
- [ ] Never, because fast mode trades away quality for speed.
  > It's the same model at the same quality; you pay more per token for speed.
- [ ] After switching to Sonnet, which fast mode is built for.
  > Fast mode only works on Opus models.
```

```test scenario-worth-paying
This week Claude will spend two hours overnight tidying the code while you sleep, and on Friday you'll merge a change that rewrites how every Comment is saved to the database. You have usage credits. Where is paying extra worth it?
- [ ] Fast mode for the overnight tidy-up, so it's done sooner.
  > Nobody is waiting on those replies, so you'd pay more per token for speed you never use.
- [ ] Fast mode for the Comments change, switched on halfway through.
  > Switching on halfway costs more than at the start, and speed doesn't make a big change safer.
- [ ] `/code-review ultra` after every small edit this week.
  > After the free runs each review costs roughly $5–$25 and takes 15–25 minutes. Save it for the big change.
- [x] `/code-review ultra` on the Comments change before Friday.
  > Right. A cloud review that verifies every finding earns its price on a change this big, just before you merge. Fast mode pays off only when you wait on every reply.
```

```test spot-max-everywhere
Ravi starts every session at max and runs every task on his book-club site at it: renaming a variable, fixing a typo, summarising one file. Each takes several minutes, he runs out of usage mid-week, and a typo fix comes back with a rewritten paragraph he didn't want. Spot the mistake.
- [ ] Ravi picked max when `xhigh` is the strongest level.
  > `max` is the deepest level; `xhigh` sits below it. Both are far more than routine edits need.
- [ ] Ravi left ultracode off, so the edits couldn't run in parallel.
  > Ultracode would add workflows and tokens on top. The overthinking comes from the level.
- [x] Ravi gave routine edits the deepest level, so it overthought them.
  > Right. Start at the default (medium on the 5.5 models) and raise effort only for the genuinely hard part.
- [ ] Ravi used too big a model; Haiku at max would handle these edits fine.
  > Haiku at max still overthinks routine edits and burns tokens. The level is the problem, not the model.
```

```test spot-ultracode-left-on
On Monday Priya put `"ultracode": true` in her settings for a big audit. By Thursday she has hit her weekly limit, mostly on everyday feature work. Spot the mistake.
- [ ] Ultracode set her effort to max, and max burned the tokens.
  > Ultracode is a setting, not an effort level. It runs at whatever effort you've set.
- [x] Ultracode stayed on, so everyday tasks became workflows.
  > Right. With it on, Claude plans workflows for substantive tasks, often several per request. Turn it on for the big job, then off.
- [ ] She should have used `/code-review ultra` for the audit instead.
  > That's a paid bug review of a change, not a way to run an audit, and it doesn't explain her limit.
- [ ] Workflows don't count toward plan limits, so something else used them up.
  > They do count, and a workflow can use far more tokens than doing the task in conversation.
```

```test sequence-reading-a-miss
Claude's fix to a book club's sign-up form came back wrong. Before you touch a dial, you ask three questions in turn. Which order lets each answer point to the right fix?
- [x] Was the task clear? → Did it do the work? → Is the model capable enough?
  > Right. Fix a vague task first, then check it did the work. Only a clear task, fully worked and still wrong, points to a bigger model.
- [ ] Did it do the work? → Was the task clear? → Is the model capable enough?
  > If the task was vague, more effort just digs harder in the wrong place. Check the task first.
- [ ] Is the model capable enough? → Did it do the work? → Was the task itself clear?
  > You can't call it the model's ceiling until you know it had what it needed and did the work.
- [ ] Was the task clear? → Is the model capable enough? → Did it do the work?
  > You only reach the model's ceiling once you know it did the work. A skipped file or test points to effort first.
```

```test predict-session-only
On Monday you type `/model sonnet`. On Tuesday, for one tricky afternoon, you open `/model`, highlight Fable and press `s`, then quit. What does Wednesday's new session start on?
- [ ] Fable, because it was the last model you picked.
  > `s` switches for one session only and leaves your saved default alone.
- [ ] Opus 5.5, because a session-only pick resets you to the plan default.
  > Nothing resets. `s` leaves your last saved choice in place, and Monday's typed switch saved Sonnet.
- [x] Sonnet, because Monday's typed switch is still your saved default.
  > Right. Typing `/model sonnet` saved Sonnet; `s` on Fable lasted for Tuesday only.
- [ ] Fable, as long as you still have usage credits.
  > Credits decide whether Fable bills extra, not whether it's saved.
```

```sources
- [Model configuration](https://code.claude.com/docs/en/model-config), Claude Code docs (aliases, `/model` saving your default, effort levels and defaults, the Ultracode toggle, `ultrathink`), read 2026-10-23 against Claude Code 2.1.309.
- [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows), Claude Code docs (the `ultracode` keyword, `/effort ultracode`, cost, approval per permission mode, `/workflows` keys, Pro setup), read 2026-10-23.
- [Choose a permission mode](https://code.claude.com/docs/en/permission-modes), Claude Code docs (auto mode and its classifier), read 2026-10-23.
- [Speed up responses with fast mode](https://code.claude.com/docs/en/fast-mode), Claude Code docs (models, usage credits, the one-time charge mid-conversation), read 2026-10-23.
- [Find bugs with ultrareview](https://code.claude.com/docs/en/ultrareview), Claude Code docs (`/code-review ultra`: duration, free runs, pricing), read 2026-10-23.
- [Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code), Anthropic blog, 2026-07-07 (check the context first, then model vs effort; what effort changes), read 2026-10-23.
- [Using Claude Code: Spending your effort](https://claude.dev/blog/spending-your-effort/), Thariq Shihipar, 2026-09-25 (his low-then-high loop, timings, edge cases vs wrong approach, detailed spec), read 2026-10-23.
- [grilling docs page](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/docs/productivity/grilling.md) ("It ran out of questions and started building") and [implement docs page](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/docs/engineering/implement.md) ("One ticket burned 150k tokens"): pinned to mattpocock-skills 1.3.1, read 2026-10-24.
- [Your effort level is STILL TOO HIGH](https://www.youtube.com/watch?v=JgEsphDAXnY), Matt Pocock, 2026-10-13 (even high is overkill for most coding, 0:49–1:09; Opus 5.5 on medium, weighing low, 1:09–1:15).
- [Matt Pocock on X: "Some mistakes you might be making"](https://x.com/mattpocockuk/status/2109973273924579720), 2026-10-13.
- [Your effort level is TOO DAMN HIGH](https://www.youtube.com/shorts/iQb3F9UzBR4), Matt Pocock, 2026-07-15 (lower effort is better value, exploring doesn't need it, benchmark charts, 0:00–0:36).
- [Effort](https://www.aihero.dev/ai-coding-dictionary/effort), Matt Pocock's AI Coding Dictionary, 2026-09-24, read 2026-10-23.
- [9 Things People Get Wrong With My /grill-* skills](https://www.youtube.com/watch?v=UzMNBN6xLLA), Matt Pocock, 2026-05-25 (too weak a model for grilling, a cheaper one for implementation, 8:41–10:23).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (Sonnet implements, Opus reviews, 1:32:33–1:32:40).
- [Learn anything with the /teach skill](https://www.youtube.com/watch?v=s5T5oQJcJ6U), Matt Pocock, 2026-06-08 (Opus 4.8 at medium effort, 7:06–7:08).
- [r/ClaudeCode: Matt Pocock tutorials thread](https://www.reddit.com/r/ClaudeCode/comments/1v90akt/), 2026-07-28 (Opus 5 medium to grill, Sonnet 5 medium to implement).
```
