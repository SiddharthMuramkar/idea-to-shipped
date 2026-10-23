# Research: models-effort-ultracode (Lesson 19)

## Source map
All read on 2026-10-23. Local Claude Code version: 2.1.309 (published 2026-10-22).

| ID | Source | Date | Covers |
|---|---|---|---|
| M1 | Claude Code docs, "Model configuration", https://code.claude.com/docs/en/model-config.md (full page fetched) | undated; read 2026-10-23 | Aliases, the Fable section, `/model` behaviour, `default`, `opusplan`, effort levels, defaults, ultracode toggle, `ultrathink`, thinking, alias version history |
| M2 | Claude Code docs, "Orchestrate subagents at scale with dynamic workflows", https://code.claude.com/docs/en/workflows.md | undated | Workflows vs subagents/Skills/agent teams; the `ultracode` keyword; `/effort ultracode`; limits; cost; turning workflows off |
| M3 | Claude Code docs, "Speed up responses with fast mode", https://code.claude.com/docs/en/fast-mode.md | undated | `/fast`, models, pricing, mid-session cost, when to use |
| M4 | Claude Code docs, "Find bugs with ultrareview", https://code.claude.com/docs/en/ultrareview.md | undated | `/code-review ultra` |
| M5 | Claude Code CHANGELOG via Context7 `/anthropics/claude-code`, with npm publish dates from `npm view @anthropic-ai/claude-code time` | v2.1.160 = 2026-06-01; v2.1.203 = 2026-07-07; v2.1.257 = 2026-09-01; v2.1.280 = 2026-09-22; v2.1.284 = 2026-09-28; v2.1.293 = 2026-10-07 | Ultracode history, alias changes |
| M6 | Anthropic blog, "Choosing a Claude model and effort level in Claude Code", https://claude.com/blog/claude-model-and-effort-level-in-claude-code | 2026-08-20 | Model vs effort guidance; specialist/expert/generalist analogy |
| M7 | Thariq Shihipar, "Using Claude Code: Spending your effort", https://claude.dev/blog/spending-your-effort/ | 2026-09-25 | Effort experiments on Opus 5.5 and Fable 5.1; his daily loop |
| M8 | Matt Pocock short, "Your effort level is STILL TOO HIGH", https://www.youtube.com/watch?v=JgEsphDAXnY | 2026-10-13 (~1:15) | 0:00–1:15. Transcript came back as an Arabic machine translation, so paraphrased loosely. |
| M9 | Matt Pocock short, "Your effort level is TOO DAMN HIGH", https://www.youtube.com/shorts/iQb3F9UzBR4 | 2026-07-15 | Page transcript excerpt 0:00–0:36 (not a Firecrawl transcript) |
| M10 | Matt Pocock on X, https://x.com/mattpocockuk/status/2109973273924579720 | 2026-10-13 | List of "mistakes you might be making", led by "effort level too high" |
| M11 | AI Coding Dictionary, "Effort", https://www.aihero.dev/ai-coding-dictionary/effort | 2026-09-24 | Matt's effort ladder; match effort to the task, not the session |
| M12 | Local `ask-matt/SKILL.md` and `PHASE-BOUNDARIES.md` (Skills 1.3.1) | 1.3.1 | Smart zone ~150k tokens; subagents for AFK tasks |
| M13 | Author: `content/lessons/10-models-effort-ultracode.md`; commit trailers "Co-Authored-By: Claude Opus 5.5" | 2026-10-21 | Site story |

## Key facts (dated; Claude Code docs read 2026-10-23, version 2.1.309)

**Models and aliases (Anthropic API)** (M1).

| Alias | Resolves to | Use for |
|---|---|---|
| `opus` | Opus 5.5 (since v2.1.280, 2026-09-22) | complex reasoning |
| `sonnet` | Sonnet 5.5 (since v2.1.284, 2026-09-28) | daily coding |
| `haiku` | Haiku 5.5 (since v2.1.293, 2026-10-07) | simple tasks |
| `fable` | Fable 5.1 (since v2.1.257, 2026-09-01; Fable 5 by ID `claude-fable-5`) | hardest, longest tasks |
| `best` | the `fable` model where available, otherwise `opus` | |
| `opusplan` | Opus in plan mode, Sonnet for execution | the link between plan mode and models |
| `default` | clears overrides; Opus 5.5 on Pro, Max, Team, Enterprise and the API | |

Other providers lag; for example, Microsoft Foundry's `opus` is Opus 4.6.

**Fable** (M1).
- Never the default; select it explicitly.
- Suited to work bigger than one sitting: root-cause investigations, outage debugging, architecture.
- Describe the outcome, not the steps, and skip verification reminders.
- May bill to usage credits, with a consent prompt.

**Switching models** (M1).
- `/model <name>`, or Enter in the picker, switches *and saves your default*.
- Press `s` in the picker for this session only.
- `claude --model` applies only to that launch.
- Subagents that inherit the session model follow a switch.
- `/status` shows the current model.

**Effort levels** (M1).
- Opus, Sonnet and Haiku 5.5, Opus 5, and Fable have `low`, `medium`, `high`, `xhigh`, `max`.
- Opus 4.6 and Sonnet 4.6 have no `xhigh`.
- **Defaults:** `high` everywhere, except Opus, Sonnet and Haiku 5.5 default to `medium`, and Opus 4.7 to `xhigh`.
- In Anthropic's testing, Opus 5.5 at medium matches or beats Opus 5 at high. Don't carry over your Opus 5 level.
- `max` applies to the current session only (unless set by environment variable). It can overthink and shows diminishing returns.
- Levels are saved per model under `modelSettings`.

**How to set effort** (M1).
- `/effort` opens a slider; `/effort <level>` sets it; `/effort auto` clears your saved level.
- Left and right arrows in `/model`; `--effort`; `CLAUDE_CODE_EFFORT_LEVEL`.
- `effort` in Skill or subagent front matter.
- The session header shows "with … effort".

**Official guidance per level** (M1 table).

| Level | Use for |
|---|---|
| `low` | quick reviewed exchanges, renames |
| `medium` | day-to-day scoped feature work on 5.5 models |
| `high` | bug fixes in existing code, edge cases |
| `xhigh` | deeper reasoning at more cost |
| `max` | hard autonomous problems, e.g. security review |

**`ultrathink`** (M1).
- The word in a prompt requests deeper reasoning for that turn only. Claude Code adds an in-context instruction; the effort level sent to the API is unchanged.
- "think hard" and similar phrases are not keywords.

**Thinking** (M1). Thinking can't be turned off on the 5.5 or Fable models. They decide per step, guided by effort.

**Ultracode** (M1, M2).
- **A Claude Code setting, not an effort level.** With it on, Claude orchestrates *dynamic workflows* for substantive tasks, at whatever effort the session runs at.
- **Ways to turn it on:**
  - Session: `/effort ultracode` (off with `/effort ultracode off`), or Tab in the `/effort` slider.
  - Launch: `claude --effort ultracode`, which also sets `xhigh`.
  - Persistent: the setting `"ultracode": true`.
  - One task only: put the keyword `ultracode` in your prompt, or ask for "a workflow" in your own words. Option+W or Alt+W dismisses it; it can be turned off in `/config`. The keyword only works in prompts you type yourself, not `-p`, scheduled or webhook prompts.
- **Cost with it on:** a request may become several workflows in a row (understand, change, verify). That means more tokens and more time, and you reach plan limits sooner. The "Large workflow" warning and the subagent concurrency limit are skipped, and in auto mode the first-launch approval is skipped.
- **Unavailable when** workflows are turned off or the model lacks `xhigh`.
- **History** (M5):
  - v2.1.160 (2026-06-01): trigger word renamed from "workflow" to "ultracode".
  - v2.1.203 (2026-07-07): `--effort ultracode` accepted.
  - v2.1.284 (2026-09-28): became its own toggle; no longer forces `xhigh`.

**Workflows** (M2).
- A JavaScript script the runtime executes, using `agent()`, `pipeline()` and `parallel()`. Intermediate results stay in script variables, not in Claude's context.
- Scale: dozens to hundreds of agents.
- Up to 16 concurrent agents by default; at most 1,000 agents per run and 4,096 items per call.
- No user input mid-run.
- "Large workflow" warning above 25 agents or 1.5M projected tokens.
- `/workflows` shows progress and per-agent tokens. Saved scripts go in `.claude/workflows/`.
- Size guideline defaults to `medium` (`small` on Pro).
- Turn off with `/config`, `"disableWorkflows": true`, or `CLAUDE_CODE_DISABLE_WORKFLOWS=1`.

**Fast mode** (M3).
- Research preview. The same Opus model, up to 2.5x faster, at a higher price ($8/$40 per million tokens on Opus 5.5).
- Opus 5.5, Opus 5 and Opus 4.8 only.
- On subscription plans, billed to usage credits only.
- Toggle with `/fast`; a ↯ icon shows when it's on.
- The first time you enable it in a conversation, you pay the full uncached input price for the whole context once. Turn it on at the start.
- Good for live iteration and debugging; not for long autonomous runs, CI or cost-sensitive work. You can combine it with lower effort.

**`/code-review ultra` (ultrareview)** (M4).
- A cloud fleet of reviewer agents that verifies every finding. Takes about 15–25 minutes.
- 3 free runs on Pro or Max (one-time), then about $5–$25 in usage credits per review.
- Only starts when you type it.
- Separate from ultracode.

**Anthropic guidance** (M6, 2026-08-20).
- Use the model's default effort for most tasks, and treat effort as a general preference, not a per-task choice.
- If Claude had the context, clearly tried, and still got it wrong: pick a bigger model.
- If it skipped a file or didn't run the tests: raise effort.
- Analogy: Fable is a specialist, Opus an expert, Sonnet a strong generalist; effort decides how long each spends on your task.

**Thariq's take** (M7, 2026-09-25).
- Effort mostly changes how much verification and edge-case testing Claude does, and how many assumptions it makes on your behalf.
- His loop: interview, implement on low, review, verify on high.
- Higher effort fixes missed edge cases, not a wrong approach.
- Example timings: low took 1.5 minutes, max took 67 minutes.

### Newer / recently changed
- **2026-09-28 (v2.1.284):** ultracode became its own toggle. The author's Lesson 10 already matches this.
- **2026-10-07 (v2.1.293):** Haiku 5.5 became the `haiku` alias.
- Fast mode for Opus 4.7 was removed 2026-07-24.
- claude.com's site nav lists a "Mythos" model, but it's not in Claude Code's alias table. Don't teach it without a primary source.

## Day-to-day usage

**Matt:**
- **"STILL TOO HIGH" (M8, 2026-10-13):**
  - **0:00–0:27:** People crank effort because their project matters to them. He compares effort to detail in a painting or a Minecraft build.
  - **0:27–0:49:** For small edits or exploring a repo, extra effort just burns tokens and overthinks; exploration only needs to open files.
  - **0:49–1:09:** Even `high` is overkill for most coding and pushes the output away from what you want. Fewer tokens keep the model sharper and leave more context room.
  - **1:09–1:15:** He runs Opus 5.5 on medium and is considering low.
- **"TOO DAMN HIGH" (M9, 2026-07-15):**
  - **0:00–0:16:** Most people get better value from lower effort, because it spends fewer tokens on exploration, which doesn't need effort.
  - **0:16–0:36:** Higher effort pushes harder on things you didn't need; benchmark charts tempt people towards max.
- **X post (M10, 2026-10-13):** "Your effort level is too high" heads his list of common mistakes.
- **Dictionary (M11):** match effort to the task, not the session; raise it for the hard part, lower it for rote work.
- **Context (M12):** Matt treats roughly 150k tokens as the smart zone. In the triage video he budgets about 100K per session (T12 5:29–5:43).

**Others:**
- Thariq (Anthropic) implements on low and verifies on high (M7).
- Anthropic's own guidance prefers the default and changing model when the problem is too hard (M6).

## Common mistakes
1. **Max (or high) effort everywhere.** It costs more, takes longer, and overthinks (M1, M8, M9).
2. **Carrying your Opus 5 `high` setting over to Opus 5.5.** Start at medium (M1).
3. **Thinking ultracode is an effort level, or leaving it on for routine work.** It burns limits (M1, M2).
4. **Confusing `/code-review ultra` with ultracode** (M4, M2).
5. **Turning on fast mode mid-conversation.** It's a one-time full-context charge (M3).
6. **Expecting fast mode on Sonnet or Haiku**, or without usage credits (M3).
7. **Picking Fable for everything.** It costs the most and may bill usage credits; save it for ambiguous, long work (M1, M6).
8. **Not knowing `/model <name>` saves your default.** Press `s` in the picker for this session only (M1).
9. **Typing "think hard" expecting a keyword.** Only `ultrathink` is recognised (M1).
10. **Raising effort when the real problem is model capability, or the reverse** (M6).

## Try it yourself (~15–20 min)
In this repo, or any repo:

1. Type `/status`, then `/model`. Note your model and the effort shown in the session header.
2. Type `/effort` and look at the slider and the Ultracode toggle. Press `s` on `low` to apply it to this session only. Then type:
   ```
   In 5 bullets, explain what src/lessons does. Don't change any files.
   ```
   Note how long it took.
3. Type `/effort high` (this saves it as your default), then repeat the same prompt and compare. Afterwards, use `/effort auto` to go back to the default.
4. Type:
   ```
   ultrathink: which single file would you read first to understand how a Lesson page is built, and why?
   ```
   The keyword should be highlighted, and your effort setting should stay unchanged.
5. Optional, and it uses noticeably more tokens. Type:
   ```
   ultracode: count the words in every Lesson file under content/lessons and list them, read-only.
   ```
   Approve the plan if asked, watch `/workflows`, and stop it there if it grows.

**It's working if:**
- [ ] You can name your current model and effort without guessing.
- [ ] The header changes to "with low effort" after step 2.
- [ ] The low run answers sooner and more briefly than the high run.
- [ ] `ultrathink` is recognised without changing your saved level.
- [ ] (Optional) `ultracode` launches a workflow you can watch in `/workflows`.
- [ ] You end with effort back where you want it (`/effort auto`).

## Site story
- **The whole site was built on Opus 5.5.** Every commit carries "Co-Authored-By: Claude Opus 5.5", and Lesson 10 says the session ran at the default effort (M13).
- **What the author typed** (Lesson 10, "What I typed"):
  - `/effort`: opened, then cancelled, just looking.
  - `/code-review max`: Claude Code's Built-in command bug hunt at max effort. This is *not* Matt's `/code-review` Skill.
- **Lesson 10's facts check out** against M1–M4 on 2026-10-23:
  - default `high`, but `medium` on 5.5 models
  - ultracode is a setting; `--effort ultracode` sets `xhigh`
  - `/code-review ultra` takes about 15–25 minutes, with free runs first
  - fast mode: Opus only, up to 2.5x, usage credits, one-time charge when switched on mid-conversation
- **The author's rule-of-thumb table** (Lesson 10) is personal guidance, not official. Notably it uses "opus, high" for grilling and specs, which is more effort than Matt recommends (M8). The rewrite could show both views.
- **Uncertain:** which effort level the author used while building the site. Lesson 10 says the default; confirm before stating a level.

## Candidate quiz questions
1. **You start Claude Code on Opus 5.5 and change nothing. What's the effort?**
   - a) high
   - **b) medium ✔**
   - c) xhigh
   - d) max

   *Why:* the 5.5 models default to medium. (M1)
2. **Is "ultracode" an effort level?**
   - a) Yes, above max
   - **b) No. It's a setting that makes Claude plan multi-agent workflows at any effort level ✔**
   - c) Yes, between high and max
   - d) It's a model

   *Why:* the docs call it a setting, not a level. (M1, M2)
3. **You want one big audit run as a workflow without changing session settings. What do you do?**
   - a) `/effort max`
   - **b) Put the keyword `ultracode` in that prompt ✔**
   - c) `/code-review ultra`
   - d) `/model opusplan`

   *Why:* the keyword opts a single task in. (M2)
4. **You'll be live-debugging for an hour and want the same quality, faster. When should you turn on `/fast`?**
   - a) Halfway through
   - **b) At the start, since enabling it later charges the whole context once at the fast rate ✔**
   - c) Never; it lowers quality
   - d) Only on Sonnet

   *Why:* the cost tradeoff in the fast mode docs. (M3)
5. **Claude had all the context, clearly tried, and still got it wrong. What should you change?**
   - **a) Pick a more capable model ✔**
   - b) Lower the effort
   - c) Turn on fast mode
   - d) `/clear`

   *Why:* Anthropic's model-versus-effort rule. (M6)
6. **Claude skipped running the tests and missed a relevant file. What should you change?**
   - a) Switch to Haiku
   - **b) Raise the effort level ✔**
   - c) Turn on fast mode
   - d) Use opusplan

   *Why:* effort controls how much it reads and verifies. (M6)
7. **When does Fable fit best?**
   - a) Quick renames
   - **b) Ambiguous, long work like root-cause investigations, outages and architecture ✔**
   - c) Every session, by default
   - d) Only with fast mode

   *Why:* Fable is never the default and is aimed at the hardest work. (M1)
8. **You typed `/model sonnet` today. What does tomorrow's new session start on?**
   - **a) Sonnet, because `/model <name>` saves your default ✔**
   - b) Opus
   - c) Haiku
   - d) Whatever the last workflow used

   *Why:* press `s` in the picker for a session-only switch. (M1)
9. **What does `opusplan` do?**
   - a) Opus for everything
   - **b) Opus in plan mode, then Sonnet for execution ✔**
   - c) Plans with Fable
   - d) Turns on ultracode

   *Why:* the special alias. (M1)
10. **How is `/code-review ultra` different from ultracode?**
    - **a) It's a cloud multi-agent bug review (~15–25 min, 3 free runs, then credits) that only starts when you type it ✔**
    - b) They're the same thing
    - c) It's an effort level
    - d) It runs locally in seconds

    *Why:* the ultrareview docs. (M4)

## Open questions / uncertain
- The Claude Code docs pages carry no publish dates, so I cite version numbers plus npm publish dates.
- The M8 wording comes from an Arabic auto-translation; re-check the English before quoting.
- I found Matt's "Don't know which model to choose? *taps the graph*" short in his uploads list but have no URL or transcript for it.
- Switching model or effort mid-conversation can trigger a prompt-cache warning (M1 links to prompt-caching docs). I didn't read that page.
- The author's effort level while building the site (see Site story).
