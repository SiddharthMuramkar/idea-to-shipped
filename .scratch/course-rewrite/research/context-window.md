# Research: context-window (Lesson 2)

Everything below was read on 2026-10-23. The author runs Claude Code v2.1.309. Skills are pinned to v1.3.1; the installed copy matches github main as of 2026-10-23.

## Source map

| ID | Source | Published / updated | What it covers | Parts used |
|---|---|---|---|---|
| D1 | Docs, "How Claude Code works": https://code.claude.com/docs/en/how-claude-code-works | No date | What's in the window, what happens when it fills, Compact Instructions, Skills and subagents | Context-window sections |
| D13 | Docs, "Explore the context window": https://code.claude.com/docs/en/context-window | No date | What loads at startup, what survives compaction, acting before auto-compact | Whole page |
| D14 | Docs, "Model configuration": https://code.claude.com/docs/en/model-config | No date | Which models get 1M windows, default auto-compact thresholds, `/autocompact`, turning off 1M | Extended context and auto-compaction sections |
| D11 | Docs, settings reference: https://code.claude.com/docs/en/settings-reference | No date | `autoCompactEnabled`, `autoCompactWindow`, `idleCompaction` | Those keys |
| D15 | Docs, "Manage sessions": https://code.claude.com/docs/en/sessions | No date | `/clear` keeps the old session, `/resume`, `/compact`, `/context` | "Manage context within a session" |
| D8 | Docs, "Commands": https://code.claude.com/docs/en/commands | No date | `/clear`, `/compact`, `/context`, `/btw`, `/autocompact`, `/rewind`, `/branch`, `/fork`, `/subtask` | Command list |
| D6 | Docs, "Best practices": https://code.claude.com/docs/en/best-practices | No date | Managing context aggressively, subagents for investigation, failure patterns | Several sections |
| D12 | Docs, "Create custom subagents": https://code.claude.com/docs/en/sub-agents | No date | A subagent's own context window, forks, Explore and Plan, subagent auto-compaction | Several sections |
| D5 | Docs, "Checkpointing": https://code.claude.com/docs/en/checkpointing | No date | Summarize from here / up to here; going back past a `/clear` | Rewind section |
| B2 | Anthropic blog, Thariq Shihipar, "Using Claude Code: session management and 1M context": https://claude.com/blog/using-claude-code-session-management-and-1m-context | 2026-04-15 | Context rot, five choices after every turn, rewind vs correct, bad auto-compacts | Whole post |
| X2 | Thariq on X: https://x.com/trq212/status/2044548257058328723 | 2026-04-16 | Context rot around 300–400k tokens on 1M models | Not fetched; seen quoted in https://note.com/nobunosuke/n/n42a5b644f0f0 and https://wk-j.github.io/llm-wiki/sources/claude-code-session-management |
| H1 | Claude Help Center, "Models, usage, and limits in Claude Code": https://support.claude.com/en/articles/14552983 | No date | `/clear` per task, `/compact` mid-task, says `/clear` cannot be undone | Managing-context section |
| S1 | Skills v1.3.1 `skills/engineering/ask-matt/SKILL.md` and `PHASE-BOUNDARIES.md` (local; identical to main 2026-10-23) | v1.3.1 tag 2026-10-04 | Smart zone (~150k), keeping steps 1–3 in one session, the five options at a phase boundary | Context hygiene; the decision tree |
| S2 | Skills v1.3.1 `skills/productivity/handoff/SKILL.md` and `docs/productivity/handoff.md`; aihero page https://www.aihero.dev/skills-handoff | Page updated 2026-08-24 | The /handoff Skill | Whole files |
| S3 | `skills/in-progress/claude-handoff/SKILL.md` and `skills/in-progress/README.md` | v1.3.1 | Background-agent handoff (beta, not shipped) | Whole files |
| S4 | Skills `CHANGELOG.md`, v1.2.0 entry #763; GitHub commits `4f4e943`/`0f5e033` (handoff, 2026-10-06) and `954ee7f` (ask-matt, 2026-10-06) | 2026 | When things changed | Listed entries |
| M3 | AI Coding Dictionary: /smart-zone, /context-window, /token, /compaction, /autocompact, /clearing, /handoff, /subagent, /session, /attention-degradation under https://www.aihero.dev/ai-coding-dictionary/ | 2026-09-24 (token: 2026-07-01) | Matt's definitions. There is no separate dumb-zone page (`/dumb-zone` returns 404); it's covered on the smart-zone page | Definitions and usage notes |
| V2 | YouTube, Matt Pocock, "Most devs don't understand how context windows work": https://www.youtube.com/watch?v=-uW5-TaVXu4 | 2025-10-22 (9:33 long) | What the window is, limits, lost-in-the-middle, `/context`, clear vs compact, MCP bloat | 0:32, 1:04, 1:36, 2:10, 3:15, 3:49, 4:22, 4:56, 5:30, 6:02, 6:34, 7:06, 7:41, 8:14 |
| V3 | YouTube, Matt Pocock, "The 7 phases of AI-driven development": https://www.youtube.com/watch?v=Ah9p7v7nJWg; written version https://www.aihero.dev/my-7-phases-of-ai-development (updated 2026-03-16) | 2026-03-03 (~8:27 long) | Phases; agents work in fresh context windows, so cache research in a file | 1:36, 2:10, 6:00 |
| C1 | Community: awesomeclaude.ai tips page https://awesomeclaude.ai/claude-code-best-practices (quotes Dex Horthy at youtu.be/YwZR6tc7qYg?t=1541); Medium, "Managing Your Context Window: Clear vs. Compact" (2026-02-23); wmedia.es 1M-context tips (2026-03-16); getclaudekit guide (2026-08-24) | Various | Community habits | Cited where used |
| L / LOG | Author's lessons (`00`, `05`, `07`, `11`), `.scratch/main-flow-and-redesign/*`, `git log`; the author's Claude Code session logs | 2026-10-21 to 2026-10-22 | Site story | See Site story. Times UTC |

## Key facts (dated 2026-10-23; Skills pinned to v1.3.1)

### What the context window is
- **It's everything the model can see on one request.** That's the system prompt, the conversation so far, and every tool result fed back in. If something isn't in the window, the model doesn't know it exists. Matt calls the window the model's only way of perceiving anything [M3 context-window].
- **In Matt's 2025 video:** input tokens plus output tokens make up the window, and each model has a hard limit set by its provider [V2 0:32–1:36].
- **What Claude Code puts in it** [D1]:
  - conversation history
  - file contents
  - command outputs
  - CLAUDE.md
  - auto memory
  - Skills you've loaded
  - system instructions
- **Matt says avoid calling it "memory".** It's working state and doesn't carry over to the next session [M3 context-window].
- **Session vs window:** if the window is the box, the session is the stuff slowly filling it [M3 session].

### Tokens
- **A token is the unit a model reads and writes.** It's roughly word-sized: about three-quarters of an English word, so 1,000 tokens is about 750 words [M3 token, 2026-07-01].
- **Unusual strings take more tokens.** Common code keywords are cheap, but hashes, generated IDs and minified code split into many tokens [M3 token].
- **Rough sizes:** a 1M-token window is about 750,000 words. Matt's ~150k smart zone is about 110,000 words (my arithmetic from M3).
- **Everything is counted in tokens:** cost, speed and window size [M3 token].

### What fills it
- **Before you type anything** [D13]:
  - CLAUDE.md (or AGENTS.md)
  - auto memory: the first 200 lines or 25KB of MEMORY.md
  - MCP tool names
  - Skill descriptions
  - the system prompt
- **As Claude works,** every file read, tool output and message adds more [D13, D6].
- **Full Skill text loads only when the Skill is used.** User-only Skills (`disable-model-invocation: true`) keep even their descriptions out of the window [D1].
- **MCP tool definitions are deferred by default.** Only names and server instructions count until a tool is actually used [D1].
- **A real example: the author's `/context` mid-build** (2026-10-21 08:15 UTC, Opus 5.5) [LOG]:

| Category | Tokens |
|---|---|
| **Total used** | 204.8k of 1M (20%) |
| Messages | 166.4k |
| System tools | 16k |
| Skills (122 Skills) | 9.9k |
| System prompt | 4.3k |
| MCP tools (412 tools, loaded on demand) | 4.3k |
| MCP server instructions | 3.4k |
| Memory files | 194 |
| Free space | 762.2k |
| Autocompact buffer | 33k |

  - The deferred MCP tools would have been 284.7k tokens if loaded; they weren't counted [LOG].
  - Note that 1M minus the 33k buffer is 967k, which matches the documented default threshold [D14].
  - The messages, at 166k, were already past Matt's ~150k smart zone.

### Window sizes (dated 2026-10-23)
- **These run with a 1M window by default:** Fable 5.1 and Fable 5, Sonnet 5 and later, Haiku 5.5, Opus 4.7 and later [D14].
- **Opus 4.6 and Sonnet 4.6 need a `[1m]` variant;** otherwise they get 200K. Access depends on your plan [D14].
- **To force 200K,** set `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` [D14].
- **No surcharge above 200K on the API,** except Haiku 5.5, which costs more on prompts over 100K tokens [D14].
- **Older numbers in Matt's material:** his 2025 video showed 95k used of 200k on Sonnet 4.5 [V2 4:56–5:30]. His dictionary's usage example still says 200k [M3 context-window]. Both are out of date for today's defaults.

### Smart zone vs dumb zone (Matt)
- **The idea:** early in a session the agent is sharp. As the session grows, it slides into a "dumb zone": sloppier, more forgetful, and it drifts from what's in its context. Same model, same harness, just more context [M3 smart-zone].
- **The cause is attention degradation.** Each token's attention is spread over more and more competing tokens [M3 attention-degradation].
- **How you can tell** [M3 smart-zone]:
  - it forgets an instruction from many turns ago
  - it repeats a mistake it had already fixed
  - it states something its own context contradicts
  - there's no error message
- **The window limit is not the quality limit.** A session can be deep in the dumb zone with most of the window still free. "Plan around the smart zone, not the window" [M3 smart-zone].
- **The smart zone is a budget.** Unrelated tasks spend it, so do one task per session [M3 smart-zone, session].
- **The fix is removing context, not adding it.** Re-pasting an ignored instruction helps only briefly. Clear, compact or hand off instead [M3 attention-degradation].
- **The numbers differ by source; teach it as a rule of thumb:**

| Source | Date | Number |
|---|---|---|
| ask-matt | v1.3.1 | ~150k tokens on state-of-the-art models [S1]. Raised from ~120k in v1.2.0 [S4 #763] |
| Matt's dictionary | 2026-09-24 | The dumb zone commonly begins around 125K–150K, "though this is debated" [M3 smart-zone] |
| Thariq Shihipar (Anthropic) | 2026-04-16 | Some context rot around 300–400k tokens on 1M models; depends heavily on the task [X2, via secondary quotes] |
| Dex Horthy (HumanLayer) | Not confirmed | Results degrade around 40% of the context; newcomers should stay under 40% [C1, secondhand] |
| Matt's 2025 video | 2025-10-22 | He gets nervous with only ~50k left of a 200k window, then clears [V2 5:30] |

- **Anthropic's term for the same effect is "context rot".** They say it happens because attention is spread across more tokens and old, irrelevant content distracts from the current task [B2].
- **Lost in the middle:** models give the most weight to the start and end of a long conversation and less to the middle. Shorter, focused context means fewer of these problems [V2 3:15–4:56].

### Built-in commands (not Skills)
- **`/context`** shows what's using the window as a coloured grid, with suggestions. `/context all` expands it [D8, D15].
- **`/clear [name]`** starts a new conversation with an empty context [D8, D15, D5, H1].
  - Aliases: `/reset`, `/new`.
  - The old conversation is saved. Reopen it with `/resume`, or from the rewind menu's previous-session entry while the same Claude Code process is still running.
  - CLAUDE.md and project files are unaffected.
- **`/compact [instructions]`** replaces the history with a summary, focused on whatever you specify. Example: `/compact focus on the API changes` [D8, D15].
  - In Matt's 2025 demo it took about a minute, cost tokens, and shrank messages from ~77k to ~4k [V2 6:02–6:34].
- **Auto-compact** [D1, D14, D11, D13]:
  - Claude Code first clears old tool outputs, then summarizes.
  - It's on by default (`autoCompactEnabled`). Turn it off in `/config` or with `DISABLE_AUTO_COMPACT`. Manual `/compact` still works.
  - **Default thresholds:** native-1M models compact at about 967K tokens. Sonnet 4.6 and Opus 4.6 without extended context compact at 200K.
  - **Change the threshold** with `/autocompact 500k` (v2.1.221 or later), the `autoCompactWindow` setting, `--autocompact`, or `CLAUDE_CODE_AUTO_COMPACT_WINDOW`. Values go from 100K to 1M.
  - If one huge file or output refills the window right after each summary, it stops after a few tries and shows a thrashing error.
- **Idle compaction (new)** [D11]:
  - Claude Code compacts a long conversation you've stepped away from, shortly before the prompt cache expires. Your next message then sends a summary instead of the whole history.
  - It applies by default when the context is at least 200,000 tokens and about 54 minutes have passed.
  - You'll see a line starting "Compacted while idle…".
  - Turn it off with `"idleCompaction": false`. Change the threshold with `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` (minimum 100000).
- **`/btw`** asks a side question whose answer never enters the conversation history [D6, D8].
- **Partial compaction:** Esc Esc or `/rewind`, then **Summarize from here** or **Summarize up to here**. You can type guidance for the summary [D5].

### What survives compaction [D13]
- **Re-loaded from disk:** system prompt, output style, project-root CLAUDE.md and unscoped rules, auto memory, and the plan-mode plan.
- **Skill descriptions** are rebuilt (needs v2.1.304 or later).
- **Files:** up to five recently edited or read files are re-read. Files over 5,000 tokens come back as a path only.
- **Invoked Skill text** is re-injected, capped at 5,000 tokens per Skill and 25,000 in total; the oldest is dropped first.
- **Path-scoped rules and nested CLAUDE.md files** reload only on demand.
- **Instructions given only in chat may be lost.** Put lasting rules in CLAUDE.md, or add a "Compact Instructions" section [D1].

### Subagents as a way to keep context clean
- **A subagent works in its own fresh context window** with its own tools. It returns only a summary, so its file reads and searches stay out of your window [D12, D1].
- **A fork is the exception:** it starts with a copy of your conversation [D12, D1].
- **Usage counts the same:** subagent requests count toward the same usage limits [D12].
- **Built-in subagents** [D12]:
  - **Explore:** fast and read-only; Claude picks how thorough it should be (quick, medium, very thorough). Starts without CLAUDE.md.
  - **Plan:** used in plan mode. Also starts without CLAUDE.md.
  - **General-purpose.**
- **How to ask:** "Use subagents to investigate X" [D6].
- **Matt's version:** a subagent is spawned by a tool call, reports back one tool result, and can't spawn further subagents. It exists to isolate context [M3 subagent].
  - The report is a secondhand account, so anything it leaves out is invisible to the parent [M3 subagent].
- **Thariq's test:** will I need this tool output again, or just the conclusion? If just the conclusion, use a subagent [B2; C1].

### Matt's /handoff Skill (v1.3.1) [S2]
- **What it does:** turns the current conversation into one markdown handoff file in your OS temp folder, not the workspace. It checks `$TMPDIR`, then `/tmp`, or `%TEMP%` on Windows.
- **What's in the file:**
  - a "suggested skills" section for the next agent
  - specs, plans, ADRs, issues, commits and diffs referenced by path or URL, never copied in
  - secrets, passwords and personal details redacted
- **Who starts it:** only you, by typing `/handoff`. The agent can't fire it (`disable-model-invocation: true`). An optional argument says what the next session is for.
- **What it buys is portability, not compression.** Use it in four situations only:
  1. switching tools (Claude to Codex)
  2. moving to another folder or repo (a prototype folder is the usual case)
  3. sending the work to a colleague
  4. forking a side task you found mid-phase while you keep working
  - Otherwise use `/compact`.
- **The fork case is the one people skip.** You stay in your session and hand a copy of the context to a second agent. That's how the prototype detour goes out and comes back.
- **Practical tips** [S2]:
  - **Temp folders aren't permanent.** If the next session isn't starting within the hour, copy the file somewhere safe.
  - **Passing it on:** open a fresh session and point it at the file path. Don't paste the summary into a shell command; backticks and `$(...)` can silently cut it short.
  - **CLAUDE.md or handoff?** If it will still be true next month, it belongs in CLAUDE.md. Unfinished work belongs in a handoff.
  - **Check it before passing it on.** Downgrade any assumption written as a fact, because the next agent won't re-check it.
- **"It's working if" (from the docs page)** [S2]:
  - the file is small and points to things by path
  - you can read it cold and know what to do
  - the new agent starts working without asking you to re-explain
  - in the fork case, your original session is unchanged
  - it contains no secrets
- **Beta, not shipped: `/claude-handoff`.** It writes the summary and launches a background agent with `claude --bg --name "<name>" -- "$(cat <file>)"`. You manage it with `claude agents`. It's excluded from the plugin; install it with `npx skills@latest add mattpocock/skills --skill=claude-handoff` [S3].

### Phase boundaries: Matt's decision tree [S1 PHASE-BOUNDARIES.md]
- **A phase is a chunk of work inside a session:** grilling, implementation, QA. Decide what to do with the context only at the boundary between phases. Mid-phase, just continue or split the rest into subagents. Compacting mid-phase makes the agent lose the thread.
- **Work top to bottom; the first "yes" wins:**
  1. **Continue?** Yes if the next phase needs this one firsthand, or if about 150k of smart zone is left. Grilling into implementation is the standard yes.
  2. **Is the context irrelevant to what's next?** Then `/clear`. It's the cheapest move and the old session can still be resumed. Getting it wrong costs the "why", for good.
  3. **Is something travelling?** Then `/handoff`.
  4. **Can it run unattended?** Then send it to a subagent. Automated review is the usual case.
  5. **Otherwise `/compact`,** with an instruction such as `/compact we're going to QA this area`. In Matt's words, "`/compact` is the default, not the first reach."
- **Every move except Continue loses detail.** The session as it happened (a firsthand source) gets replaced by a summary (a secondhand one).
- **Main flow rule:** keep `/grill-with-docs` → `/to-spec` → `/to-tickets` in one unbroken window. Don't clear or compact until after `/to-tickets`. Then `/clear` between each `/implement`. Run `/retro` in the session it reviews, before you clear [S1 SKILL.md].
- **If you near the smart zone before `/to-tickets`:** don't push on degraded. `/compact` at the nearest phase boundary [S1].

### Newer or recently changed
- **1M windows are now the default** on current models [D14]. Matt's 2025 video and dictionary use 200k figures.
- **Default auto-compact threshold is about 967K** on native-1M models, and `/autocompact` exists (v2.1.221+) [D14, D8].
- **Idle compaction is new**, with a 200k threshold and about 54 minutes idle [D11].
- **MCP tool definitions are deferred by default** [D1]. Matt's 2025 warning about MCP bloat [V2 7:06] is weaker now: the author's 412 MCP tools cost 4.3k tokens [LOG].
- **Skill descriptions are rebuilt after compaction** (v2.1.304+) [D13].
- **New commands:** `/btw`, `/branch`, `/fork` and `/subtask` [D8]. `/subtask` sends a side task to a subagent and brings the result back into this conversation. That overlaps with /handoff's fourth trigger (forking a side task) when everything stays in the same tool and folder.
- **Skills changes:**
  - v1.2.0 (#763): ask-matt's smart zone went from ~120k to ~150k. `/handoff` was narrowed to the four triggers. `/compact` became the default at the bottom of the tree. "Continue" and "subagent" were added [S4].
  - 2026-10-06, after the v1.3.1 tag: handoff's temp-folder lookup was clarified (`4f4e943`, trimmed in `0f5e033`). ask-matt was told to read a Skill's SKILL.md before making claims about it (`954ee7f`). Both are in the installed copy [S4].
- **A conflict to flag:** Matt's dictionary says auto-compact fires "often around 80%" [M3 autocompact]. That's a generic figure; Claude Code's current default is about 967K of 1M (~97%) [D14].

## Day-to-day usage

**Matt's patterns**
- **2025:**
  - Clear chats regularly to refresh the agent [V2 4:56].
  - Make `/clear` your default. Use `/compact` when you want to keep the gist of a conversation [V2 6:34].
  - Run `/context` to see where tokens go [V2 4:56–5:30].
  - Be cautious about MCP servers and big rules files [V2 7:06–7:41].
- **2026 (Skills):**
  - Use the phase-boundary tree, in order, at the boundary [S1].
  - Clear between tickets [S1].
  - Hand off only when something travels [S2].
  - One task per session [M3 smart-zone].
  - Compact at a phase boundary, with instructions about what to keep [M3 compaction].
  - Don't let auto-compact fire at a random moment. Watch the indicator, or write decisions to a file on disk [M3 autocompact].
  - Agents often start fresh, so cache hard-won research in a file (`research.md`) [V3 2:10].

**Anthropic**
- **Every finished turn is a decision point** with five choices: continue, `/rewind`, `/clear` with a brief you write, compact, or a subagent [B2].
- **New task, new session** [B2, H1].
- **Rewind instead of correcting** [B2].
- **Compact before auto-compact does.** The model is at its least sharp when it compacts automatically [B2].
- **Help Center test:** if your next prompt would make sense in a brand-new terminal, clear first [H1].
- **Reference files by path instead of pasting them** [H1].
- **Track usage with a custom status line** [D6].

**Community**
- **A Medium write-up (2026-02-23) restates Matt's video:** default to clear; compact when continuity matters [C1].
- **Dex Horthy (via aggregator):** experienced users stay below about 30%; push to 60% only on simple tasks [C1].
- **wmedia.es (2026-03-16):** watch `/context` and compact before Claude does [C1].
- **getclaudekit (2026-08-24):** check `/context` when answers start to feel vague [C1].

## Common mistakes
- **The kitchen-sink session:** unrelated tasks in one session [D6].
- **Pushing through the dumb zone and re-explaining,** which adds more context [M3 smart-zone, attention-degradation].
- **Treating free window space as headroom for quality** [M3 smart-zone; B2].
- **Using `/clear` before `/to-spec` or `/to-tickets`.** The "why" behind your answers is gone [S1; L 11-main-flow.md].
- **Reaching for `/compact` first, or compacting mid-phase** [S1].
- **Using `/handoff` when nothing is travelling** [S2].
- **Letting auto-compact fire mid-task.** The summary can drop a constraint, and the agent carries on confidently without it [M3 autocompact; B2].
- **Keeping a rule only in chat.** It may not survive compaction; put it in CLAUDE.md [D1, D13].
- **Unscoped "investigate this" requests** that fill the window [D6].
- **Pasting large files** instead of naming paths [H1].
- **Losing the handoff file** in a temp folder that gets wiped [S2].
- **Handoff notes that state guesses as facts** [S2].

## Try it yourself (about 15 minutes)

Work in the site repo: `git clone https://github.com/SiddharthMuramkar/idea-to-shipped && cd idea-to-shipped && claude`

1. **Read your starting point.** Type `/context`. Write down Total used, Messages, Skills, System tools, Memory files, and Free space.
2. **Fill it on purpose.** Type: `Read every file under content/lessons and give me a one-line summary of each.` Then `/context` again. Note how much Messages grew.
3. **Ask a side question.** Type `/btw how many Lessons are there?` Then `/context`. Messages shouldn't change.
4. **Clear.** Type `/clear`, then `/context`; Messages should be near zero. Type `/resume` to see that the old session is still listed, then press Esc.
5. **Use a subagent.** Type: `Use a subagent to read every file under content/lessons and report back only a one-line summary of each.` Then `/context`. Compare the growth with step 2.
6. **Compact.** Type `Which Lesson mentions the smart zone? Quote the sentence.` Then `/compact keep only what we learned about the smart zone`. Then `/context`. Finally ask: `What did we learn about the smart zone?`
7. **Optional, needs Matt's Skills:** `/handoff Next session: write 3 quiz questions about the smart zone`. Ask for the file path if it isn't shown, open the file, then copy it out of the temp folder.

**It's working if:**
- [ ] You can name the biggest category in your `/context`.
- [ ] Messages grew clearly in step 2, and much less in step 5.
- [ ] `/btw` didn't change Messages.
- [ ] After `/clear`, Messages was near zero, but the old session still appeared in `/resume`.
- [ ] After `/compact`, Messages dropped and Claude still answered the smart-zone question.
- [ ] (Optional) The handoff file is short, points to files by path, has a "suggested skills" section, and contains no secrets.

## Site story (only what happened)
- **Before the build: `/clear` between unrelated tasks.** On 2026-10-21 (UTC) [LOG]:
  - 05:56: `/setup-matt-pocock-skills`
  - 05:57: `/clear`, then a session about OpenSpec vs Matt's Skills (the author removed OpenSpec)
  - 06:18: `/clear`, then the v1 build session at 06:20
- **The v1 build ran in one unbroken session,** from 06:20 to 09:42 UTC [LOG 8230810b]:
  - The order was `/grilling` → `/domain-modeling` → `/wizard` → `/prototype` → `/tdd` ×4 → `/code-review` → `/codebase-design` → `/code-review`.
  - `/context` at 08:15 showed 204.8k of 1M (breakdown in Key facts).
  - Usage fields at the end show about 380k tokens: past every smart-zone figure, never cleared or compacted. This is computed from the log's usage numbers, so it's approximate.
- **After the build,** at 09:43 UTC the author ran `/clear` and started a fresh session for the README [LOG 34cd3201]. That became commit `7c38157`, "Add README with badges…".
- **The Main flow session (2026-10-22, UTC)** [LOG 8bf55acc; L 11-main-flow.md]:
  - `/to-spec` at 07:05:09, `/to-tickets` at 07:05:55, `/implement-spec` at 07:09, all in the grilling session, as Lesson 11 says.
  - Context peaked at ~246k tokens (08:53).
  - At 09:48, after about 54 minutes idle, Claude Code idle-compacted it from 247,240 to 31,025 tokens, logged as "Compacted while idle, before the prompt cache expired".
  - That was after `/to-tickets`, consistent with Matt's rule. Lesson 11 doesn't mention it.
- **Subagents in practice:**
  - `/implement-spec` ran a helper agent per ready ticket, each in its own worktree [L 11-main-flow.md].
  - `/code-review` runs two reviewers in parallel subagents [L 07-code-review.md].
- **Prototype without a handoff:** the author ran `/prototype` in the same session and kept the throwaway code on branch `prototype/lesson-page` [L 05-prototype.md; LOG]. Matt's Main flow would use `/handoff` for that detour.
- **Never used:** no manual `/compact` and no `/handoff` appear in the command logs [LOG].
- **Lesson 11 already teaches** the "don't `/clear` or `/compact` until after `/to-tickets`" rule and the ~150k smart zone [L 11-main-flow.md].

## Candidate quiz questions (one right answer each, marked ✔)

1. **You've finished `/grill-with-docs` and `/to-spec`. `/context` shows ~170k tokens, and you haven't run `/to-tickets`. What does ask-matt say to do?**
   - A ✔ `/compact` now, at this phase boundary, saying what `/to-tickets` needs; then run `/to-tickets`.
   - B `/clear` and run `/to-tickets` in a fresh session.
   - C Keep going; the 1M window has plenty of room.
   - D `/handoff` to a new session in the same folder.
   - *Why:* you're past the ~150k smart zone before `/to-tickets`. Don't push on degraded; compact at the nearest boundary. `/handoff` is only for when something travels. *Source:* S1 Context hygiene; S2.

2. **You've just finished `/implement` on ticket 03. Ticket 04 stands alone and is fully written down. Next?**
   - A ✔ `/clear`, then `/implement` ticket 04.
   - B `/compact` so ticket 03's reasoning carries over.
   - C `/handoff`.
   - D Carry on in the same session.
   - *Why:* each ticket is self-contained, so the last one's context can be thrown away. *Source:* S1 main flow step 3.

3. **Grilling is done at ~60k tokens. You'll implement in the same repo. Best move?**
   - A ✔ Continue.
   - B `/clear`
   - C `/compact`
   - D `/handoff`
   - *Why:* implementation wants the grilling's reasoning firsthand, and you have smart zone left. *Source:* S1 PHASE-BOUNDARIES, question 1.

4. **You're moving the work from Claude Code to Codex. Which fits?**
   - A ✔ `/handoff`
   - B `/compact`
   - C `/clear`
   - D A subagent
   - *Why:* switching tools is one of /handoff's four triggers. *Source:* S2.

5. **You need every file that calls `getLessonBySlug`, without 30 file reads clogging your conversation. What do you do?**
   - A ✔ Ask Claude to use a subagent to search and report back only the file paths.
   - B Paste every file into chat.
   - C `/compact` first, then search.
   - D Switch to plan mode.
   - *Source:* D6; D12; M3 subagent.

6. **`/context` says 15% of a 1M window is used, yet Claude now ignores an earlier instruction and repeats a fixed mistake. Best explanation?**
   - A ✔ Quality drops long before the window is full (smart zone / context rot).
   - B The window is broken; restart.
   - C Claude only reads your last message.
   - D Plan mode is on.
   - *Source:* M3 smart-zone; B2.

7. **You come back after an hour to "Compacted while idle, before the prompt cache expired". What happened?**
   - A ✔ Claude Code summarized your long conversation (200k+ tokens) after about 54 idle minutes, so your next message doesn't resend everything. Check your key decisions survived.
   - B Your session was deleted.
   - C Someone ran `/clear`.
   - D Your usage limit reset.
   - *Source:* D11 idleCompaction; LOG.

8. **You're about to start QA in the same session and the context is heavy. Which command best keeps what QA needs?**
   - A ✔ `/compact we're going to QA this area`
   - B `/clear`
   - C `/context`
   - D `/btw what should QA cover?`
   - *Source:* S1 PHASE-BOUNDARIES, question 5; D13.

9. **You've corrected Claude three times on the same bug and it's still wrong. What do the official best practices say?**
   - A ✔ `/clear` (or rewind) and start again with a more specific prompt that includes what you learned.
   - B Correct it a fourth time, in capitals.
   - C `/compact` and continue.
   - D Switch to bypass permissions.
   - *Source:* D6; B2.

10. **A rule you typed only in chat ("never touch the migrations folder") seems forgotten after an auto-compact. How do you make it survive?**
    - A ✔ Put it in the project-root CLAUDE.md, which is re-loaded from disk after compaction.
    - B Repeat it in every message.
    - C Turn off checkpoints.
    - D Save it in a `/handoff` file in `/tmp`.
    - *Source:* D1; D13.

## Open questions / uncertain
- **Can `/clear` be undone?** The docs say the old session is saved and can be resumed [D15, D8]. The Help Center says `/clear` cannot be undone [H1]. Matt says both "you cannot undo it" (ask-matt docs page) and "the old session stays resumable" (PHASE-BOUNDARIES). Suggested wording: the transcript can be reopened with `/resume`, but the cleared working context doesn't come back into your current session.
- **Thariq's 300–400k figure** comes from secondhand copies of his X post; I didn't fetch the post itself. **Dex Horthy's ~40%** comes from an aggregator; the source video wasn't checked.
- **`/btw` and `/resume`** may not behave the same in the desktop app; I didn't check.
- **The ~380k peak** for the v1 session is my calculation from the log's usage fields (main thread only), not a `/context` reading.
- **I used the author's session logs for the site story.** Confirm they're happy to publish these details.
- **Matt's handoff docs page mentions a "built-in `/handoff`"** in some tool. Claude Code's command list (D8) has no `/handoff`, so it's unclear which tool he means.
