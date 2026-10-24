---
title: Models, effort & ultracode
slug: models-effort-ultracode
order: 19
part: 4
image: /photos/models-effort-ultracode.jpg
imageAlt: A black-and-white close-up of a jet engine's fan blades spiralling into the centre.
imageCredit: Joao
---

Claude Code has four dials that decide how much brain, time and money go into each reply. Turning them all up rarely helps; here's how to set each one, and when to leave it alone.

```goals
- You'll be able to choose a model for a task and switch with `/model`, either as your new default or for one session only.
- You'll be able to set effort with `/effort`, say what it changes, and tell from a bad result whether to raise effort, pick a bigger model or fix the task.
- You'll be able to explain what ultracode does, why it isn't an effort level, and turn it on for one task or a whole session.
- You'll be able to decide when fast mode and `/code-review ultra` are worth paying for, and when to switch fast mode on.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. The AI underneath is a **model**, and you choose which one, and how hard it works on each turn. Every choice spends tokens, the small chunks of text that AI usage is measured and billed in. On a subscription they eat into your usage limits; if you pay per use, they cost money; either way they cost time.

The tempting move is to turn everything up. Someone picks the strongest model and the highest effort "because the project matters". Then a one-line style fix to a comment box takes ten minutes, the weekly limit runs out by Wednesday, and the answers get worse, not better: the agent overthinks and changes things nobody asked for. The opposite mistake happens too: a small, fast model gets a subtle bug, fails confidently three times, and the prompt gets the blame.

Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code (short instruction files the agent loads when you type their name, or when a task fits; see [Skills](/learn/skills)), puts it bluntly: most people's ==effort level is too high==. Anthropic's own guidance is to use the default effort for most tasks, and to change a dial deliberately, not out of habit. This Lesson teaches no Skill. It teaches the dials every Skill runs on:

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
| `sonnet` | Sonnet 5.5 | Everyday coding |
| `opus` | Opus 5.5 | Complex reasoning. It's also what `default` gives you on paid plans |
| `fable` | Fable 5.1 | The hardest, longest work: root-cause hunts, outages, architecture |
| `opusplan` | Opus in plan mode, then Sonnet to carry out the plan | You plan first and want a cheaper builder |
| `best` | Fable where your account has it, otherwise Opus | You always want the top model |

Plan mode is the Claude Code mode where the agent only reads and proposes a plan until you approve it. Fable is never the out-of-the-box default: you pick it on purpose, and on some plans it bills to **usage credits** (paid usage on top of your plan), asking you first. Aliases move when new models ship, and other cloud providers can lag behind; to pin one exact version, use its full name, like `claude-opus-5-5`.

**Switching.** Type `/model` to open the picker. The detail that catches people: ==`/model` saves your choice as the default for new sessions== (a session is one Claude Code conversation, from starting `claude` until you clear it or quit). Pressing Enter on a row, or typing `/model sonnet` directly, switches and saves. Press `s` on a row instead to switch for this session only. `claude --model haiku` applies to that one launch, and `/status` shows what you're on. Helper agents that inherit your model follow the switch too.

Matt's rule of thumb: grilling (an interview where the agent questions you about your plan; see [Grilling](/learn/grilling)) leans on what the model learned in training, so it deserves the strongest model. Building from a clear ticket mostly follows what's already in front of the agent, so a cheaper model often does fine. Anthropic adds subtle bugs, unfamiliar territory and architecture decisions to the big-model list.

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

Effort is more than thinking time. It sets how much work Claude does before it comes back to you: how long it reasons, how many files it reads, whether it runs the tests (automated checks of the code) and double-checks. At low effort you get a starting point sooner, and Claude would rather ask you than dig on its own. At high effort it verifies more, tests more edge cases (unusual inputs that tend to break code) and makes more choices for you.

The levels are `low`, `medium`, `high`, `xhigh` and `max`. Opus, Sonnet and Haiku 5.5 start at **medium**; most other models start at high. Anthropic reports that Opus 5.5 on medium matches or beats Opus 5 on high, so if you're coming from Opus 5, don't carry your old level over.

| Level | Claude Code's docs suggest it for |
|---|---|
| `low` | Quick exchanges you review each time: a sketch, a rename |
| `medium` | Day-to-day work with a clear scope, like building a planned feature |
| `high` | Bugs in existing code, and work with likely edge cases |
| `xhigh` | Deeper reasoning, at a higher token spend |
| `max` | Hard problems Claude works through alone, like a security review |

`max` lasts for the current session only, shows diminishing returns and tends to overthink. On the 5.5 and Fable models you can't switch thinking off; the model decides at each step how much to think, guided by effort.

For one hard question, put the word `ultrathink` anywhere in your prompt: Claude reasons harder ==on that turn only==, and your setting doesn't change. Phrases like "think hard" are ordinary text, not keywords. Skills and helper agents can also carry their own `effort` setting, which applies while they run.

```scene terminal
title: Setting the dials in a session (illustrative)
# The session header names your model and its effort. On Opus 5.5 you start at medium unless you've saved something else.
$ claude
Opus 5.5 with medium effort
# Typing a level by name sets it and saves it for new sessions too. This is Claude Code's real reply.
$ /effort low
Set effort level to low (saved as your default for new sessions): Quick, straightforward implementation with minimal overhead
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

When Claude gets something wrong, resist reaching for every dial. Anthropic's July 2026 guide gives a simple test:

- **It had what it needed, clearly tried, and was still wrong.** That's the model's ceiling. Pick a bigger model.
- **It skipped a file, didn't run the tests or gave up halfway.** It didn't do the work. Raise effort.
- **The request was vague, or the key file never came up.** No dial fixes that. Fix the task: add the context, write the rule into `CLAUDE.md` (the file of standing instructions Claude reads every session), or grill a clear plan first.

Thariq Shihipar, who works on Claude Code at Anthropic, found the same in his own tests: more effort fixed missed edge cases, not a wrong approach. Matt adds the flip side: ==better information lowers the effort you need==, so a well-grilled ticket can often run on medium, or even low.

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
# First: did it have the context? A vague request or a file it never opened is a problem with the task.
at: context
# If not, no model or effort level fixes it. Add the files, write the rule down, or grill a clear plan.
at: task
# Second: did it do the work, or skip a file, skip the tests, stop halfway?
at: work
# If it cut corners, raise effort, or put ultrathink in that one prompt.
at: effort
# It had everything, clearly tried, and was still wrong. That's the model's ceiling: switch to a bigger one.
at: model
```

```checkpoint diagnose-ceiling
You're on Sonnet. Claude read the right files, ran the tests and checked its work, but its fix for a time-zone bug is wrong for the second time. What do you change?
- [ ] Raise effort to max and ask again.
  > It already did the work. More effort fixes skipped steps, not a ceiling.
- [ ] Add `ultrathink` to the same prompt.
  > That's a one-turn effort boost, so it's the same fix as raising effort.
- [ ] Turn on fast mode so the retries come back quicker.
  > Fast mode only works on Opus, and it changes speed, not capability.
- [x] Switch to a bigger model, like `opus`.
  > Right. It had what it needed and clearly tried. That's the model's ceiling, so pick a more capable one.
```

## Ultracode: many agents instead of one

Normally Claude works through a task turn by turn, and every result lands in its context window (its working memory for the conversation, measured in tokens; see [The context window](/learn/context-window)). A **dynamic workflow** works differently. Claude writes a short script, and the script runs many sub-agents (helper agents, each with its own fresh context window), from a handful to hundreds, in the background. The script holds the plan and the in-between results, so only the final answer comes back to your conversation, and it can have agents check each other's findings first. It's built for jobs one conversation can't hold: auditing every file, a 500-file migration, research cross-checked across sources.

**Ultracode** is how you opt in to workflows. It's ==a setting, not an effort level==: it runs at whatever effort you've set. Two ways to use it:

- **One task:** put the word `ultracode` in your prompt, or simply ask for "a workflow". Claude Code highlights the keyword (Option+W, or Alt+W, dismisses it). It only counts in prompts you type yourself.
- **The whole session:** type `/effort ultracode`, or press Tab on the Ultracode toggle in the `/effort` slider. Claude then decides which tasks deserve a workflow. Turn it off with `/effort ultracode off`. Launching with `claude --effort ultracode` turns it on *and* sets effort to `xhigh`; the setting `"ultracode": true` turns it on for every session.

With it on, one request can become several workflows in a row: one to understand the code, one to change it, one to check it. That's more tokens and more time on every task, so you reach your plan limits sooner. It also skips the "Large workflow" warning, and in auto mode the approval before the first run. Turn it on for the big job, then off. Watch any run with `/workflows`, which shows each agent's tokens; press `x` there to stop it. On a Pro plan, switch on Dynamic workflows in `/config` first. If the Ultracode toggle is missing, workflows are off or your model has no `xhigh` level.

```scene chat
title: One task as a workflow, on this site's Lessons (illustrative)
# You opt in for this one task by starting the prompt with the keyword. Claude Code highlights it.
you: ultracode: check every Lesson file for links to /learn/ pages that don't exist. Don't change anything.
# Instead of working turn by turn, Claude writes a workflow script and describes its plan.
agent: I'll run this as a workflow in three phases: **list** the Lesson files, **check** each file's links with one agent per file, then **verify** every broken link with a second agent before reporting.
# Claude Code shows the phases and asks before starting (in auto mode, only before your first workflow ever).
you: *Yes, run it* (picked from the approval menu)
# It runs in the background, so you keep working. The progress view lists each phase, its agents and their token use; x there stops it.
you: `/workflows`
# One report comes back. The per-file results stayed in the script, so your context window holds only the summary.
agent: Checked 20 Lesson files, and a second agent confirmed each finding. 2 broken links, listed below with line numbers. No files changed.
```

```checkpoint ultracode-one-task
You want one audit of every API route to run as a workflow, without changing anything else about the session. What do you do?
- [ ] Type `/effort max`, then ask for the audit.
  > Effort is how much work each turn gets. It doesn't create workflows, and max is overkill for the rest of the session.
- [ ] Type `/effort ultracode`, then ask for the audit.
  > That works, but it changes the session: Claude keeps planning workflows for later tasks until you turn it off.
- [x] Start that one prompt with the word `ultracode`.
  > Right. The keyword opts one task in and leaves your settings alone.
- [ ] Type `/code-review ultra` to launch the audit.
  > That's a cloud bug review of your branch's changes, not a general workflow.
```

## Fast mode, and a review called "ultra"

**Fast mode** (`/fast`) runs the same Opus model up to 2.5 times faster, at a higher price per token. Quality doesn't change. It works on Opus 5.5, Opus 5 and Opus 4.8 only; turning it on from another model switches you to Opus, and a ↯ icon shows it's on. On subscription plans it's paid from usage credits only, and it stays on for future sessions until you turn it off.

The catch is timing. The first time you turn it on in a conversation, you pay the full fast-mode price, once, for everything already in that conversation. Two hours in, that's a lot. So ==switch it on at the start==, for live debugging or quick back-and-forth where you wait on every reply, and leave it off for long runs you won't watch.

**`/code-review ultra`** sounds related but isn't. Claude Code's Built-in `/code-review` (it ships with Claude Code; it isn't a Skill) is a bug hunt you can run at an effort level, like `/code-review max`. Its `ultra` level uploads the changes on your branch (your line of work in Git) to an isolated machine in the cloud, where a fleet of reviewer agents hunts for bugs, and every finding is reproduced and verified before it's reported. It takes about 15–25 minutes, gives Pro and Max accounts three free runs (once, not monthly), then costs roughly $5–$25 in usage credits per review, and it only starts when you type it. It isn't ultracode, and it isn't Matt's code-review Skill, which you reach with `/mattpocock-skills:code-review` (see [Code review](/learn/code-review)).

## How Matt and others use it

**Matt Pocock:**

- **Medium effort, maybe lower.** In an October 2026 interview with Nate Herk, he said he runs Opus 5.5 on medium, is thinking about low, and that most people use far too much effort. Three days earlier he put "Your effort level is too high" at the top of a list of common mistakes on X.
- **Start low, then climb.** In a July 2026 short he suggested starting Opus or Fable at the lowest effort you have and raising it only if needed: benchmark charts keep the task fixed, but you can make yours clearer. His advice: "just try a lower effort level. You'll be surprised by what you get." He repeated the message in a second short in October.
- **Effort per task, not per session.** His AI Coding Dictionary (September 2026) says to raise effort for the genuinely hard part and drop it for the routine work around it.
- **A big model to grill, a cheaper one to build.** In May 2026 he called too weak a model a common grilling failure, because grilling relies on what the model learned in training. At an April 2026 workshop he built with Sonnet and reviewed with Opus.
- **No fixed recipe.** In his July 2026 walkthrough he was on Opus 4.8 at medium effort, and told viewers they don't need to copy his setup.

We found nothing from Matt on ultracode or fast mode as of October 2026.

**Others:**

- **Thariq Shihipar** (Anthropic, September 2026) has Claude interview him about a spec, implements on low, reviews it, then verifies on high. In his tests, the same vaguely described app took 1.5 minutes on low and 67 minutes on max.
- **A Reddit user** in July 2026 grilled on Opus 5 at medium and implemented on Sonnet 5 at medium.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)). No Skills are needed for this one.

1. Make a practice folder and start Claude Code in it. If it asks whether you trust the folder, choose Yes.

```sh
mkdir dials && cd dials && claude
```

2. Read the session header at the top: it names your model and its effort. Type `/status` to double-check the model.
3. Type `/effort`. Look at the levels and the Ultracode toggle, move to `low` and press `s` (this session only).
4. Send this, and notice how long it takes:

```text
In five bullets, plan a one-page site for a book club. Don't create any files.
```

5. Type `/effort` again, choose `high`, press `s`, and send the same prompt. Compare the two answers.
6. Now send:

```text
ultrathink: which of those bullets is the riskiest, and why?
```

7. Optional, and it uses noticeably more tokens. On a Pro plan, first turn on Dynamic workflows in `/config`. Then send the prompt below, approve the plan, open `/workflows` to watch, and press `x` there if it grows.

```text
ultracode: write three different one-paragraph pitches for the book club site in parallel, then have another agent pick the best. Don't create any files.
```

8. Press Esc if anything runs longer than you want, then type `/exit`.

**It's working if:**

- [ ] You could name your model and effort without guessing.
- [ ] The header said low effort after step 3, and high after step 5.
- [ ] The low answer came back sooner and shorter than the high one.
- [ ] `ultrathink` was highlighted in your prompt, and the header still said high afterwards.
- [ ] (Optional) The workflow showed its phases before it ran, and appeared in `/workflows`.
- [ ] A new `claude` session starts at your old level, because you pressed `s` both times.

If your default ever changes by accident, `/effort auto` clears your saved level.
````

## Common mistakes

- **Max, or even high, for everything.** Slower, pricier and prone to overthinking. Start at the default and raise effort for the hard part only.
- **Bringing your Opus 5 level to Opus 5.5.** Start at medium.
- **Typing `/model haiku` for one quick job,** then finding tomorrow's session on Haiku. Use `s` in the picker.
- **Raising effort to rescue a vague task.** Fix the task instead; see Model or effort? above.
- **Leaving ultracode on for routine work,** or thinking it's a level above max.
- **Turning on fast mode deep into a conversation,** or expecting it on Sonnet or Haiku.
- **Writing "think hard"** and expecting a keyword. Only `ultrathink` counts.
- **Mixing up the "ultras" and the reviews:** `/code-review ultra` is a paid cloud bug hunt, ultracode is a setting, and Matt's review is `/mattpocock-skills:code-review`.

```site-story
This Lesson exists because I asked for it. My very first message to the agent, the long one that started the grilling for this site, carried this request near the end:

    it should also teach when to use what model for building and what effort
    should be used and when should ultra code be used and with which effort

In that same grilling I opened `/effort`, looked at the slider, and cancelled. The agent then suggested a small "Built with: Opus 5.5 · effort high · ultracode off" box on every Lesson. I said no: noting it down wouldn't teach me anything, so one Lesson about the dials would do.

**The first build ran on Opus 5.5 at the default effort,** and the commits credit Claude Opus 5.5 as co-author. Near the end of that build I ran Claude Code's Built-in `/code-review max` in the background, then Matt's `/mattpocock-skills:code-review`: two different tools that share a short name.

**The next day, for the redesign and the Main flow Lesson, ultracode was on.** So when I typed `/mattpocock-skills:implement-spec`, the build ran as a workflow I could watch in `/workflows`, and I asked whether it could "expedite the process by spinning more subagents in the dynamic workflow". Partway through I set `/effort` to medium, and as the code review finished I dropped it to low. Both times Claude Code said the level was saved as my default for new sessions.

My first version of this Lesson had a rule-of-thumb table that put grilling on high and the final review on max. A day later I was the one turning effort down. The line I wrote back then: higher isn't always better, so match the dial to how hard the problem is.
```

## Cheat sheet

| Situation | Dial |
|---|---|
| Everyday work | Leave the defaults: Opus 5.5 on medium |
| Routine edits you can describe exactly | `sonnet` or `haiku`, or `low` effort |
| Grilling, review, a strange bug | Your strongest everyday model |
| Huge, ambiguous, hours-long work | `fable`, picked on purpose |
| It skipped steps | Raise effort, or `ultrathink` for one turn |
| It clearly tried and was still wrong | A bigger model |
| The task was vague | Fix the task, not a dial |
| Switch for this session only | `/model` or `/effort`, then `s` |
| One big sweep as a workflow | Start the prompt with `ultracode` |
| A session of big sweeps | `/effort ultracode`, later `/effort ultracode off` |
| Live debugging where speed matters | `/fast`, at the start of the conversation |
| A deep bug review before merging | `/code-review ultra`: cloud, paid after 3 free runs |

## Final test

```test scenario-grill-then-build
You're about to grill a fuzzy idea for a recipe site, then hand the finished tickets to an agent to build one by one. Following Matt's habit, how do you split the models?
- [ ] Haiku to grill, since it's only conversation, and Opus to build the tickets.
  > Backwards. Grilling leans on what the model learned in training to raise things you missed, so it needs the strongest model.
- [ ] Fable for both, because the strongest model can never be the wrong choice.
  > Fable costs the most and may bill usage credits. Building from clear tickets doesn't need it.
- [x] Your strongest model to grill, and a cheaper one to build.
  > Right. Grilling relies on the model's own knowledge; building from a clear ticket mostly uses what's already in context.
- [ ] The same model for both, since models only differ in speed.
  > Models differ in capability, not just speed. That's why the choice matters at all.
```

```test scenario-outage-hunt
Checkout has failed for a small share of users for two days. Nobody knows where to look, and the investigation will run for hours across several services. Which model fits best?
- [x] `fable`, picked on purpose.
  > Right. Fable is aimed at the hardest, longest work, like root-cause investigations and outages. It's never the default, so you choose it.
- [ ] `haiku`, so each attempt comes back quickly.
  > Haiku is for simple tasks you can describe exactly. This is the opposite.
- [ ] `opusplan`, since the work needs a lot of planning.
  > `opusplan` just means Opus in plan mode and Sonnet afterwards. It splits planning from building; it isn't for the hardest problems.
- [ ] Your current model, with fast mode switched on.
  > Fast mode makes Opus answer faster, not think better.
```

```test scenario-skipped-tests
You asked for a fix to the comment form's length limit. Claude changed one file, never opened the API route that also checks the length, and didn't run the tests. You're on Opus 5.5 at low. What's the best change?
- [ ] Switch to Fable.
  > A bigger model helps when it tried and still failed. Here it didn't do the work.
- [x] Raise effort to medium or high.
  > Right. Skipping a file and not running the tests are signs it didn't try hard enough. Effort sets how much it reads and checks.
- [ ] Turn on fast mode.
  > Faster answers, same amount of work.
- [ ] Switch to Haiku, which follows short instructions more literally.
  > A smaller model won't read or check more. The problem was effort, not instructions.
```

```test scenario-migration-day
Today you're migrating 400 files to a new API, and nearly every request will be a big sweep. You want Claude to plan workflows on its own all day. What do you type?
- [ ] `/effort max`
  > That's how much work each turn gets. It doesn't create workflows.
- [ ] `/code-review ultra`
  > That's a cloud bug review of your changes, not a way of working.
- [ ] `/fast`
  > Fast mode is about speed and price, not many agents.
- [x] `/effort ultracode`
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

```test spot-max-everywhere
Jo sets effort to max in every session "because this project matters". Replies take ages, the weekly limit runs out early, and simple edits come back with extra changes nobody asked for. What's the mistake?
- [ ] Max should have been paired with fast mode to make it quick.
  > That costs even more, and the work is still overthought.
- [ ] Jo should have used `xhigh`, which is always better than max.
  > It isn't always better, and it's still far more than everyday work needs.
- [x] Max on everyday work makes it overthink and burn tokens.
  > Right. Start at the default (medium on the 5.5 models) and raise effort only for the genuinely hard part.
- [ ] Jo should have switched to Haiku, since effort only matters on big models.
  > Effort applies to Haiku 5.5 too, and a smaller model doesn't fix the overthinking.
```

```test spot-ultracode-left-on
On Monday Priya put `"ultracode": true` in her settings for a big audit. By Thursday she has hit her weekly limit, mostly on everyday feature work. Spot the mistake.
- [ ] Ultracode set her effort to max, and max burned the tokens.
  > Ultracode is a setting, not an effort level. It runs at whatever effort you've set.
- [x] Ultracode stayed on, so everyday tasks became workflows.
  > Right. With it on, Claude plans workflows for substantive tasks, often several per request. Turn it on for the big job, then off.
- [ ] She should have used `/code-review ultra` for the audit instead.
  > That's a paid bug review of a change, not an audit tool, and it doesn't explain her limit.
- [ ] Workflows don't count toward plan limits, so something else used them up.
  > They do count, and a workflow can use far more tokens than doing the task in conversation.
```

```test spot-ultra-names
Sam wants a big audit done by many agents, so he types `/code-review ultra`. A dialog asks him to confirm a cloud review and shows his free runs. What went wrong?
- [ ] Nothing; that's how you turn ultracode on.
  > Ultracode is turned on with `/effort ultracode`, or with the keyword in a prompt.
- [ ] He needed `/code-review max` instead, which runs workflows locally.
  > That's the same bug hunt at max effort, still a review of his changes.
- [ ] He needed `/mattpocock-skills:code-review` instead.
  > Matt's Skill reviews a change against standards and a spec. It isn't a way to run many agents on an audit.
- [x] He launched a cloud bug review, which isn't ultracode.
  > Right. `/code-review ultra` reviews his branch in the cloud and can cost credits. For a workflow, put `ultracode` in the prompt.
```

```test sequence-reading-a-miss
Claude's fix came back wrong. You work through the possible causes in order, and each one points to a different fix. Which order of fixes is right?
- [ ] bigger model → more effort → fix the task
  > Backwards. A bigger model can't rescue a vague task, and it's the priciest change, so it comes last.
- [ ] more effort → fix the task → bigger model
  > Raising effort first spends tokens before you know whether the task itself was the problem.
- [x] fix the task → more effort → bigger model
  > Right. Did it have what it needed? If not, fix the task. Did it do the work? If not, raise effort. Only then is it the model's ceiling.
- [ ] fix the task → bigger model → more effort
  > If it skipped steps, a cheaper effort change comes before a bigger model.
```

```test predict-ultrathink
You're on medium effort and start one prompt with `ultrathink`. Claude reasons longer on that answer. What effort does your next, ordinary prompt get?
- [x] Medium, as before.
  > Right. `ultrathink` applies to one turn and doesn't change your effort setting.
- [ ] High, because ultrathink raised the level by one step.
  > It never changes the level; it adds an instruction for that turn only.
- [ ] Max, until you type `/effort auto` to clear it.
  > Nothing was saved, so there's nothing to clear.
- [ ] It depends on whether you also wrote "think hard".
  > "think hard" is ordinary text, not a keyword.
```

```sources
- [Model configuration](https://code.claude.com/docs/en/model-config), Claude Code docs (aliases, `/model` saving your default, effort levels and defaults, `ultrathink`, the ultracode setting), read 2026-10-23 against Claude Code 2.1.309.
- [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows), Claude Code docs (the `ultracode` keyword, `/effort ultracode`, cost, `/workflows`, limits), read 2026-10-23.
- [Speed up responses with fast mode](https://code.claude.com/docs/en/fast-mode), Claude Code docs (models, usage credits, the one-time charge mid-conversation), read 2026-10-23.
- [Find bugs with ultrareview](https://code.claude.com/docs/en/ultrareview), Claude Code docs (`/code-review ultra`: duration, free runs, pricing), read 2026-10-23.
- [Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code), Anthropic blog, 2026-07-07 (model vs effort, read 2026-10-23).
- [Using Claude Code: Spending your effort](https://claude.dev/blog/spending-your-effort/), Thariq Shihipar, 2026-09-25 (his low-then-high loop and timings).
- [Your effort level is TOO DAMN HIGH](https://www.youtube.com/shorts/iQb3F9UzBR4), Matt Pocock, 2026-07-15 (start low and climb, 0:57–1:05; benchmarks keep tasks fixed, 0:38–0:56; quote at 1:12–1:17).
- [Your effort level is STILL TOO HIGH](https://www.youtube.com/watch?v=JgEsphDAXnY), Matt Pocock, 2026-10-13.
- [Matt Pocock on X: "Some mistakes you might be making"](https://x.com/mattpocockuk/status/2109973273924579720), 2026-10-13.
- [Matt Pocock: The Most Valuable Skill to Learn in the Age of AI](https://www.youtube.com/watch?v=Z8lf5oWKfj0), Nate Herk interview, 2026-10-16 (Opus 5.5 on medium, considering low, 32:03–32:30).
- [Effort](https://www.aihero.dev/ai-coding-dictionary/effort), Matt Pocock's AI Coding Dictionary, 2026-09-24, read 2026-10-23.
- [9 Things People Get Wrong With My /grill-* skills](https://www.youtube.com/watch?v=UzMNBN6xLLA), Matt Pocock, 2026-05-25 (too weak a model for grilling, a cheaper one for implementation, 8:41–10:23).
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock at AI Engineer, 2026-04-24 (Sonnet implements, Opus reviews, 1:32:33–1:32:40).
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (Opus 4.8 on medium, no need to copy his setup, 9:03–9:14).
- [r/ClaudeCode: Matt Pocock tutorials thread](https://www.reddit.com/r/ClaudeCode/comments/1v90akt/), 2026-07-28 (Opus 5 medium to grill, Sonnet 5 medium to implement).
```
