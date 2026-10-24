# Research: how-agents-work (Lesson 1)

Everything below was read on 2026-10-23. The author's machine runs Claude Code v2.1.309 (from `claude --version`). Matt Pocock's Skills are pinned to v1.3.1. The installed copy at `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/` is identical to github main for every file I checked.

## Source map

| ID | Source | Published / updated | What it covers | Parts used |
|---|---|---|---|---|
| D1 | Claude Code docs, "How Claude Code works": https://code.claude.com/docs/en/how-claude-code-works | No date (read 2026-10-23) | The agent loop, the five tool categories, what Claude can access, sessions, checkpoints, a summary of permission modes, interrupting with Esc | Whole page |
| D2 | "Choose a permission mode": https://code.claude.com/docs/en/permission-modes | No date | Each mode, the Shift+Tab cycle, which mode a session starts in, plan mode, the plan-approval menu, protected paths | Most sections |
| D3 | "Tools reference": https://code.claude.com/docs/en/tools-reference | No date | Tool names, which tools need permission, WebSearch and WebFetch behaviour, Glob/Grep on macOS | Tool table and behaviour notes |
| D4 | "How Claude remembers your project" (memory): https://code.claude.com/docs/en/memory | No date | Where CLAUDE.md files live, `/init`, `/memory`, size advice, AGENTS.md, auto memory | Most sections |
| D5 | "Checkpointing": https://code.claude.com/docs/en/checkpointing | No date | How checkpoints are taken, the rewind menu, what it can't undo, how long snapshots are kept | Whole page |
| D6 | "Best practices": https://code.claude.com/docs/en/best-practices | No date | Explore → plan → code, a good CLAUDE.md, correcting course, common failure patterns | Several sections |
| D7 | "Interactive mode": https://code.claude.com/docs/en/interactive-mode | No date | Keyboard shortcuts (Esc, Esc Esc, Shift+Tab, Ctrl+O) | Shortcuts table |
| D8 | "Commands": https://code.claude.com/docs/en/commands | No date | `/plan`, `/init`, `/memory`, `/rewind` and its aliases, `/permissions` | Command list |
| D9 | Docs glossary, via Context7 `/websites/code_claude`: https://code.claude.com/docs/en/glossary | No date | "Agentic loop", "Tool", "Permission mode" | Definitions |
| D10 | Docs, desktop app page: https://code.claude.com/docs/en/desktop | No date | The desktop mode selector and its labels | Permission-mode table |
| D11 | Settings reference: https://code.claude.com/docs/en/settings-reference | No date | `permissions.defaultMode`, `useAutoModeDuringPlan`, `showClearContextOnPlanAccept`, `plansDirectory` | Those keys |
| D12 | "Create custom subagents": https://code.claude.com/docs/en/sub-agents | No date | Built-in Explore and Plan subagents | Built-ins section |
| B1 | Anthropic blog, Thariq Shihipar, "The new rules of context engineering for Claude 5 generation models": https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models | 2026-07-24 | CLAUDE.md advice; the `#` memory hotkey replaced by auto memory; more than 80% of the system prompt removed | CLAUDE.md and auto-memory parts |
| M1 | AI Coding Dictionary (Matt Pocock): /agent, /harness, /tool-call, /turn, /permission-request, /permission-mode, /agent-mode, /agents-md under https://www.aihero.dev/ai-coding-dictionary/ | 2026-09-24 (turn: 2026-07-01) | Plain-English definitions | Definitions and usage notes |
| M2 | aihero.dev, "Never Run Claude /init": https://www.aihero.dev/never-run-claude-init | Updated 2026-02-24 | Why Matt keeps CLAUDE.md almost empty | Whole post |
| V1 | YouTube, Matt Pocock, "I was an AI skeptic. Then I tried plan mode": https://www.youtube.com/watch?v=WNx-s-RxVxk | 2026-01-15 (12:21 long) | What plan mode is and how Matt used it | 0:00, 1:04, 1:37, 2:11, 2:45, 3:18, 3:50, 5:30, 6:02, 6:36, 8:14, 8:46, 9:20, 9:54 |
| X1 | Matt on X: https://x.com/mattpocockuk/status/2040054706928578851 | 2026-04-03 (quotes his 2026-04-02 post) | He stopped using plan mode | Whole post |
| S1 | Skills v1.3.1 `docs/engineering/ask-matt.md` and `README.md` (local) | v1.3.1 tag 2026-10-04 | ask-matt has no stance on plan mode; the README's "communication gap" theme | FAQ section |
| L | The author's repo: `content/lessons/00`, `10`, `11`; `CLAUDE.md`; `AGENTS.md`; `docs/agents/*`; `git log` | 2026-10-21 to 2026-10-22 | Site story | See Site story |
| LOG | The author's own Claude Code session logs, the author's Claude Code session logs | 2026-10-21 to 2026-10-22 | When plan mode was used, permission modes, the plan file | See Site story. Times are UTC; the author is on IST (+05:30) |

## Key facts (dated 2026-10-23; Skills pinned to v1.3.1)

### What a coding agent is
- **A model on its own can only produce text.** Matt describes the model as stateless: it takes text in and gives text out, and it can't read files or remember the last turn [M1 harness, agent].
- **The harness is everything around the model.** That means the tools, the system prompt, managing the context window, permissions and hooks. Claude Code is a harness. So is Claude.ai, which is why the same model behaves differently in the two [M1 harness]. The official docs say the same thing: Claude Code is the layer that supplies tools and manages what the model sees [D1].
- **The agent is model plus harness, taking turns with you.** It is the thing you are actually talking to [M1 agent].
- **Unlike an editor's inline helper, Claude Code can see your whole project** [D1]. That includes:
  - your files
  - your terminal (any command you could run)
  - your git state
  - your CLAUDE.md
  - auto memory
  - any extensions you add (MCP servers, Skills, subagents)

### The agent loop
- **Official version:** Claude works through three phases, which blend together and repeat until the task is done [D1, D9]:
  1. gather context
  2. take action
  3. verify results
- **Each tool result shapes the next step.** The docs' example for "fix the failing tests" [D1]:
  1. Run the test suite
  2. Read the errors
  3. Search for the relevant files
  4. Read those files
  5. Edit them
  6. Run the tests again
- **Matt's version (model, then tool call, then result, then repeat):** the harness runs the loop [M1 harness, tool-call].
  1. The model learns which tools exist from the system prompt.
  2. It writes a tool call: a tool name plus arguments, as plain structured text. Then it stops.
  3. The harness checks the call against the permission mode.
  4. The harness runs it if allowed.
  5. The harness sends the outcome back as a tool result in the next request.
- **A tool call is only text.** If the model describes running tests but never emits the call, nothing ran [M1 tool-call].
- **A turn** is one message from you plus everything the agent does until it hands control back. One turn can contain many tool calls [M1 turn].
- **You can steer mid-loop** [D1, D7]:
  - **Esc** stops Claude straight away and cancels the running tool call.
  - **Typing a message and pressing Enter while it works** queues the message. Claude reads it once the current tool calls finish.
  - **Ctrl+O** opens the transcript viewer, which shows every tool call.

### Tools
- **Five built-in categories** [D1]:
  - File operations: read, edit, create, rename
  - Search: find files by pattern, search contents
  - Execution: shell commands, servers, tests, git
  - Web: search the web, fetch pages
  - Code intelligence: type errors, jump to definition (needs a plugin)
- **There are also orchestration tools,** for example spawning subagents and asking you questions [D1].
- **Exact tool names** [D3]:
  - `Read`, `Edit`, `Write`
  - `Bash` (`PowerShell` on Windows)
  - `Glob`, `Grep`
  - `WebSearch`, `WebFetch`
  - `Agent` (spawns a subagent)
  - `AskUserQuestion`, `ExitPlanMode`, `TodoWrite` and the Task tools
- **Which ones ask first** [D3]:
  - `Read`, `Grep` and `Glob` don't need permission inside the working folder. They still ask for paths outside it.
  - `Edit` and `Write` need permission.
  - `Bash` needs permission, except for a built-in set of read-only commands.
  - Launching a subagent doesn't prompt, but each tool call the subagent makes is checked.
- **WebSearch returns titles and URLs only.** Claude follows up with WebFetch to read a page. WebFetch asks first in Manual and Accept edits modes, except for allowed domains and a preapproved list of documentation sites [D3].
- **Newer:** on macOS, Linux and WSL, `Glob` and `Grep` are left out by default. Claude searches with `find` and `grep` through Bash instead (embedded versions of `bfs` and `ugrep`) [D3].

### Permissions and permission modes
- **Two safety mechanisms:** checkpoints undo file changes, and permissions control what Claude can do without asking [D1].
- **The modes**, with what runs without asking [D2, D10, D11]:

| Mode (config value) | Label in the UI | Runs without asking | Best for |
|---|---|---|---|
| `default` | **Manual** (`manual` also works) | Reads only | Reviewing every action, sensitive work |
| `acceptEdits` | Accept edits / Edit automatically | Reads, file edits, and common file commands (`mkdir`, `touch`, `mv`, `cp`) | Iterating on code you'll review afterwards |
| `plan` | Plan | Reads, plus commands the classifier approves when auto mode is available | Exploring before changing anything |
| `auto` | Auto | Everything; a background classifier checks each action against your request and blocks risky ones | Long tasks, fewer prompts |
| `dontAsk` | CLI only | Reads and pre-approved tools; anything that would ask is refused | Locked-down CI and scripts |
| `bypassPermissions` | Bypass permissions | Everything | Isolated containers and VMs only |

- **Switching** [D2, D7]:
  - Press **Shift+Tab** to cycle modes.
  - From auto, the first press goes to Manual. The cycle then runs Manual → Accept edits → Plan, followed by optional modes (bypass, then auto).
  - The status bar shows the active mode, for example "manual mode on", "accept edits on", "plan mode on", "auto mode on".
  - In the desktop app, use the mode selector next to the send button. A mode you pick there is remembered per folder, except Plan, which lasts only for the current session [D10].
- **Starting in a mode:**
  - For one session: `claude --permission-mode plan` (or `default`, `acceptEdits`, `auto`). `--dangerously-skip-permissions` equals bypass [D2, D11].
  - By default: set `permissions.defaultMode` in settings. `auto` and `bypassPermissions` only take effect from `~/.claude/settings.json` [D11].
- **Rules sit on top of modes** [D2, D8]:
  - Add `allow`, `ask` and `deny` rules in settings, for example `Bash(npm run *)`, or use `/permissions`.
  - Deny rules block in every mode, including bypass.
  - Writes to protected paths (`.git`, `.claude`, `.vscode` and a few others) are never approved automatically, except in bypass.
- **Answering a permission prompt** [D7]:
  - Esc declines, the same as "No" without a comment.
  - Shift+Tab on a file prompt picks "allow for the rest of the session" when that option is offered.
- **Matt's framing** [M1 permission-request, permission-mode]:
  - When you deny a request, the model reads the denial as a tool result and changes course. A comment attached to the denial steers it.
  - Set the mode too tight and you approve on autopilot, which gives you the interruptions with none of the protection. Set it too loose and the agent does things you'd have wanted to see first.
  - Most people auto-approve reads and keep a human in the loop for anything that can't be undone.

### Plan mode
- **What it is:** Claude researches and proposes changes without making them. It reads files, may run exploratory shell commands, and writes a plan, but it doesn't edit your source. Edits stay blocked until you approve [D2].
  - Edge case: in interactive terminal sessions where bypass is in the cycle, the blocks aren't enforced [D2].
- **Two parts:** Matt explains that plan mode both gates writes and injects instructions telling the agent it is planning. So the agent reads, asks and proposes instead of pushing against the block [M1 agent-mode; V1 1:37].
- **Entering and leaving** [D2]:
  - Shift+Tab until "plan mode on".
  - Or start one prompt with `/plan`.
  - Or launch with `claude --permission-mode plan`.
  - Press Shift+Tab again to leave without approving.
- **During planning:** with auto mode available and `useAutoModeDuringPlan` on (the default), the classifier reviews shell commands instead of prompting you [D2, D11]. The built-in **Plan subagent** does the research in its own context window, keeping the main conversation read-only [D12].
- **The approval menu** [D2]:
  - **Yes, and use auto mode.** It reads "Yes, auto-accept edits" when auto mode isn't available.
  - **Yes, manually approve edits.**
  - **No, keep planning.**
  - Approving exits plan mode, switches to the mode you chose, and gives the session a title generated from the plan.
  - An optional first entry, "Yes, clear context and …", appears only if `showClearContextOnPlanAccept` is true. The default is false [D11].
- **Where plans go:** plan files are saved under `~/.claude/plans/` (change it with `plansDirectory`) [D2, D11]. Typing `/plan` on its own showed the author the current plan and its file path [LOG].
- **Official workflow:** explore, then plan, then code. Start complex tasks in Plan, then switch to Accept edits or Manual to carry it out [D6, D10].

### CLAUDE.md as memory and steering
- **CLAUDE.md is a file you write.** Claude reads it at the start of every session [D4, D6]. Locations, broadest first [D4]:
  - **Managed policy:** set by an organization.
  - **User:** `~/.claude/CLAUDE.md`, for all your projects.
  - **Project:** `./CLAUDE.md` or `./.claude/CLAUDE.md`, shared through git.
  - **Local:** `./CLAUDE.local.md`, personal; add it to `.gitignore`.
- **AGENTS.md** loads when there is no CLAUDE.md (the default setting). It is the cross-tool convention; CLAUDE.md is Claude Code's own version [D4; M1 agents-md].
- **Commands** [D4, D8]:
  - `/init` generates a starter CLAUDE.md, or suggests improvements to an existing one.
  - `/memory` lists the memory files that load, opens them, and turns auto memory on or off.
- **Size** [D4, D6]:
  - Aim for under 200 lines. Longer files cost more context and get followed less reliably.
  - Files are loaded whole, up to 4 MiB.
  - Test each line: would removing it cause Claude to make mistakes? If not, cut it.
  - Include commands Claude can't guess, style rules that differ from defaults, test instructions, repo etiquette, environment quirks and gotchas.
  - Leave out anything Claude can learn by reading the code.
- **It survives compaction.** The project-root CLAUDE.md is re-loaded from disk after compaction. Instructions given only in chat may be lost. You can add a "Compact Instructions" section to CLAUDE.md [D1].
- **Auto memory is separate.** Claude writes it, not you. It lives at `~/.claude/projects/<project>/memory/MEMORY.md` plus topic files. The first 200 lines or 25KB load each session. It is shared across worktrees of the same repo and stays on your machine [D4, D1].
- **Matt's position, which conflicts with the docs:**
  - Never run `/init`. Trust the agent's explore step. Put steering in Skills. Keep CLAUDE.md "nearly empty". His own file is one line saying he is on WSL [M2, 2026-02-24].
  - The bar is information the agent can't discover and that applies to every session [M2].
  - If you've corrected the agent on the same thing twice, that correction is a candidate line [M1 agents-md].
  - In January he recommended two CLAUDE.md lines for better plans: make plans very concise, and end each plan with a list of open questions [V1 8:14, 8:46]. He added that fewer instructions leave the model more "instruction budget" [V1 9:20].
- **Anthropic's current advice:** keep CLAUDE.md lightweight. Spend most of it on the codebase's gotchas, and move occasional instructions into Skills (progressive disclosure) [B1, 2026-07-24].

### Checkpoints and rewind
- **When they're taken:** before each prompt you send that starts a turn, Claude Code records the state of your code. It keeps the 100 most recent checkpoints per session. They are saved with the conversation, so they survive a resume. Snapshots are deleted about 30 days after the session last saved one [D5].
- **Opening the menu:** press **Esc twice** with an empty prompt, or run `/rewind` (aliases `/checkpoint`, `/undo`) [D5, D8]. If the prompt has text, Esc Esc clears it instead [D5]. You can also just ask Claude to undo its changes [D1].
- **Menu options** [D5]:
  - Restore code and conversation
  - Restore conversation
  - Restore code
  - Summarize from here
  - Summarize up to here
  - Never mind
- **What it can't undo** [D5, D1]:
  - Changes made by Bash commands (`rm`, `mv`, `cp`)
  - Changes made outside Claude Code
  - Most subagent edits
  - Anything on remote systems (databases, APIs, deployments)
- **Checkpoints are not version control.** Keep using git [D5].

### Newer or recently changed
- **Auto mode is now the starting mode** for interactive terminal and VS Code sessions, since v2.1.283. Earlier it was only on Pro, Max and Team [D1, D2]. The author runs v2.1.309. Beginners won't see permission prompts unless they Shift+Tab to Manual.
- **"default" is now labelled Manual.** Earlier desktop labels were "Ask permissions", "Auto accept edits" and "Plan mode" [D2, D10]. The course map's "default/ask" should say "Manual (`default`)".
- **The `#` hotkey for writing to CLAUDE.md has been superseded by auto memory** [B1, 2026-07-24].
- **Anthropic removed more than 80% of Claude Code's system prompt for Claude 5 models,** with no measurable loss on its coding evaluations [B1].
- **Matt changed his mind on plan mode.** In January 2026 he said he planned every change in plan mode [V1 0:00–0:32]. On 2026-04-02/03 he posted "I don't use plan mode". He said it plans too eagerly and asks almost no questions, and he plans with grilling Skills instead [X1]. Those Skills (`/grill-me`, `/write-a-prd`, `/prd-to-issues`) are now `/grill-with-docs`, `/to-spec`, `/to-tickets` in v1.3.1 [S1 README].
- **ask-matt doesn't cover plan mode.** Its docs page says an answer about plan mode is the model's own guess, not something written in the Skill [S1 ask-matt.md].

## Day-to-day usage

**Matt's patterns**
- **January 2026 loop:** plan in plan mode, have the AI carry out the plan, test together (unit tests, type checks, manual QA), commit, repeat [V1 0:00–0:32].
- **Getting there:** Shift+Tab until plan mode [V1 2:11].
- **Why planning helps the agent:** think of a colleague who forgets the repo after every commit. You'd have them explore first [V1 2:45].
  - The research runs in an Explore subagent on a cheaper, faster model, which sends back a summary [V1 2:45–3:18].
  - In his demo it used about 40k tokens on Haiku 4.5 [V1 5:30].
- **Why planning helps you:** quoting The Pragmatic Programmer, nobody knows exactly what they want. Planning is rubber-ducking with an AI that can read the codebase [V1 3:50].
  - Plans are saved as files [V1 6:02].
  - The agent asked him clarifying questions before finishing [V1 6:36].
- **When to skip it:** Matt concedes you can be faster yourself on a codebase you know inside out [V1 9:54].
- **April 2026 onwards:** he doesn't use plan mode; he grills instead [X1].
- **Changing modes as trust grows** [M1 agent-mode]:
  1. Plan mode while the approach is taking shape
  2. Manual for the first delicate edits
  3. Accept edits once the agent has shown it understands
  4. Bypass only for unattended runs inside a sandbox
  - Switching modes doesn't reset the conversation.
- **Pre-approve safe tools** so prompts only fire on risky calls [M1 permission-request].

**Others**
- **Anthropic's best practices** [D6]:
  - Explore, plan, then code.
  - Course-correct early with Esc, Esc Esc or "undo that".
  - Use `/clear` between unrelated tasks.
  - After two failed corrections, start fresh with a better prompt.
- **Anthropic's session-management guide:** rewind instead of correcting [https://claude.com/blog/using-claude-code-session-management-and-1m-context, 2026-04-15].

## Common mistakes
- **Rubber-stamping permission prompts:** clicking approve without reading [M1 permission-mode].
- **Using bypass on your own machine.** The docs say containers and VMs only [D2, D10].
- **Assuming rewind undoes everything.** Bash-command changes and remote side effects aren't covered, and checkpoints don't replace git [D5, D1].
- **Expecting Claude to remember yesterday.** Each session starts with an empty context window; only CLAUDE.md and auto memory carry over [D1; M1 session].
- **An over-stuffed CLAUDE.md,** including one dumped by `/init`. Claude ends up ignoring half of it [D6, M2].
- **Correcting over and over.** Failed attempts pile up in the context; clear or rewind instead [D6, B-session].
- **"It looks right" without checking.** Always give Claude a way to verify its work (tests, scripts, screenshots) [D6].
- **Trusting a claim that a tool ran** when no tool call happened [M1 tool-call].
- **Not reading the plan,** or accepting a plan that asked you nothing. This is Matt's complaint about plan mode [X1].
- **Asking for a user-only Skill in plain words.** The agent can't start Skills like `/grill-with-docs`; you have to type them [L 11-main-flow.md, point 1]. (This also belongs to the skills Lesson.)

## Try it yourself (about 15 minutes)

Use the course site as the playground. Everything you change here gets rewound.

1. **Get the site and start Claude Code:**
   `git clone https://github.com/SiddharthMuramkar/idea-to-shipped && cd idea-to-shipped && claude`
   (The repo is public; checked 2026-10-23.)
2. **Switch to Manual.** Look at the status bar. On recent versions it starts in auto mode. Press **Shift+Tab** until it says **manual mode on**.
3. **Watch the loop, read-only.** Type:
   `Without changing anything, find where Lesson pages are loaded from Markdown and explain the flow in 5 bullets. Before each step, say which tool you are about to use.`
   Press **Ctrl+O** to see every tool call. Reads and searches run without asking.
4. **Plan mode.** Press **Shift+Tab** until **plan mode on**. Type:
   `Plan how to show an estimated reading time under each Lesson title. Don't write code. Ask me anything you're unsure about.`
   Answer its questions. When the menu appears, pick **Yes, manually approve edits**.
5. **Permission prompts.** Approve the first file edit. If it asks to run a command, decide yes or no.
6. **Rewind.** When it stops, clear the prompt and press **Esc Esc**. Pick the prompt from step 4, then **Restore code**. Type `!git status` to run git yourself.
7. **Steering with CLAUDE.md.**
   - Type `/memory` and look at which CLAUDE.md files load. The site has a project one.
   - In your shell (not through Claude), create `CLAUDE.local.md` containing one line:
     `End every answer with: (read CLAUDE.local.md)`
   - Run `/clear`, then ask: `What is in src/lib?`
   - Delete `CLAUDE.local.md` when you're done.

**It's working if:**
- [ ] The status bar showed "manual mode on", and later "plan mode on".
- [ ] In step 3, Claude chained several reads and searches before answering, without asking permission.
- [ ] In plan mode, `!git status` stayed clean until you approved.
- [ ] You saw at least one permission prompt and chose an answer.
- [ ] After **Restore code**, `!git status` shows no edits from Claude's file tool. If something remains, a shell command changed it; ask Claude to undo it, or use git.
- [ ] After `/clear`, the new session's answer ended with "(read CLAUDE.local.md)".
- [ ] `/memory` listed the project's `CLAUDE.md`.

## Site story (only what happened)
- **The first build session began in plan mode.** On 2026-10-21 at 06:20 UTC (11:50 IST), the author described the site idea in plan mode [LOG session 8230810b].
  1. Claude asked multiple-choice questions.
  2. It wrote a plan file. That plan sets the guiding rule "smallest thing that works", the stack decisions, and the "each phase = one skill = one lesson page" table [LOG].
  3. The author typed `/plan` to see the current plan and where it was stored, then told Claude to keep asking questions (06:22–06:23) [LOG].
  4. The plan was approved through ExitPlanMode around 06:24–06:28.
  5. The session switched to auto mode, and at 06:32 the author typed `/grilling` [LOG].
- **The rest of the build ran in auto mode.** The logs show 233 auto-mode entries against 12 plan-mode entries, all of the plan ones at the start [LOG].
- **The project CLAUDE.md is 17 lines.** It covers:
  - Agent skills: the issue tracker at `.scratch/`, triage labels, and domain docs (`GLOSSARY.md` + `docs/adr/`). This section came from `/setup-matt-pocock-skills`, run at 05:56 UTC [LOG session f24267a8].
  - A Next.js note pointing to `AGENTS.md`. `AGENTS.md` itself is written by `next dev`.
  - It was committed in `4f849b9`, "Scaffold Next.js app…" (2026-10-21) [L].
- **From the Lessons:**
  - The author's rule: "I own the architecture and the scope. The agent owns the details" [L 00-start-here.md].
  - Lesson 11, point 1: the author typed "grilling with docs" in plain words, so the agent ran `/grilling` + `/domain-modeling` instead [L 11-main-flow.md].
- **Not found:** no `/rewind` or Esc Esc use appears in the command logs. Don't claim the author used checkpoints.

## Candidate quiz questions (one right answer each, marked ✔)

1. **You type "fix the failing tests". What happens next?**
   - A ✔ The model writes a tool call (run the tests), Claude Code runs it and feeds back the output, the model picks the next step, and this repeats until it's done.
   - B The model loads the whole repo into memory once and answers.
   - C The model edits files from memory without running anything.
   - D Claude Code runs every test, then sends the model one summary at the end.
   - *Why:* that is the agent loop. Each tool result informs the next step. *Source:* D1; M1 tool-call.

2. **Claude says "I ran the tests, they pass", but no test output appears anywhere. Most likely cause?**
   - A ✔ It described running them but never emitted a tool call, so nothing ran.
   - B The tests passed too fast to show.
   - C Plan mode hides test output.
   - D A full context window threw the output away.
   - *Why:* a tool call is only text that the harness must run; no call means no run. *Source:* M1 tool-call.

3. **You want Claude to research an unfamiliar codebase and propose an approach without changing any files. What do you do?**
   - A ✔ Shift+Tab to "plan mode on", or start with `claude --permission-mode plan`.
   - B Switch to Accept edits.
   - C Start with `--dangerously-skip-permissions` so it explores faster.
   - D Run `/clear` first.
   - *Why:* plan mode blocks edits until you approve a plan. *Source:* D2, D6.

4. **Claude has finished a plan. You want to review each edit as it happens. Which option?**
   - A ✔ Yes, manually approve edits
   - B Yes, and use auto mode
   - C No, keep planning
   - D Press Esc twice
   - *Why:* this approves the plan and switches to reviewing each edit. *Source:* D2.

5. **You're tweaking CSS and will review the changes with git diff afterwards. You're tired of approving every edit, but still want to be asked before other commands. Which mode?**
   - A ✔ Accept edits (`acceptEdits`)
   - B Bypass permissions
   - C Plan
   - D `dontAsk`
   - *Why:* it approves file edits automatically but still asks before most shell commands. *Source:* D2.

6. **A friend tells you to run bypass permissions on your laptop to go faster. What do the docs say?**
   - A ✔ Use it only in isolated containers or VMs; it runs everything without asking.
   - B It's the recommended mode for beginners.
   - C It still asks before every file edit.
   - D It's plan mode, but faster.
   - *Source:* D2, D10.

7. **Claude used its file-editing tool to change three files and you dislike the result. Fastest way back?**
   - A ✔ Press Esc twice (or `/rewind`), pick the earlier prompt, choose Restore code.
   - B Run `/clear`; it reverts files.
   - C Run `/compact`.
   - D Delete the session file in `~/.claude/projects`.
   - *Source:* D5.

8. **Claude deleted `notes.txt` by running `rm notes.txt` in Bash. Will Restore code bring it back?**
   - A ✔ No. Checkpoints only track edits made by Claude's file tools; use git or a backup.
   - B Yes, every change is checkpointed.
   - C Yes, but only within 30 days.
   - D Only if you were in plan mode.
   - *Source:* D5 limitations.

9. **For the third session running, you've told Claude "run tests with `npm run test:unit`, not `npm test`". Where should that fact live?**
   - A ✔ One short line in the project's CLAUDE.md.
   - B Pasted at the top of every prompt.
   - C A `/handoff` document.
   - D A long architecture overview generated by `/init`.
   - *Why:* CLAUDE.md loads every session; a repeated correction is a good candidate; keep it short. *Source:* D4; M1 agents-md; M2.

10. **You open a new session and Claude doesn't remember yesterday's conversation about naming. Why?**
    - A ✔ Each new session starts with an empty context window; only things like CLAUDE.md and auto memory load automatically.
    - B Claude Code deletes transcripts at midnight.
    - C The model was retrained overnight.
    - D You were in plan mode yesterday.
    - *Source:* D1.

## Open questions / uncertain
- **The Explore subagent's model today.** Matt said Haiku 4.5 in January 2026 [V1 2:45, 5:30]. I didn't confirm the current default in the docs.
- **The plan-approval menu wording** varies by surface and by whether auto or bypass is available. The exercise wording may differ slightly in the desktop app.
- **The course map's mode names** need updating to the current labels (Manual, Accept edits, Plan, Auto, Bypass permissions).
- **Plan mode with Matt's Skills.** Should the Lesson teach plan mode as the beginner tool and grilling as Matt's preference? This is an editorial decision. Note that ask-matt doesn't take a position.
- **I used the author's session logs for the site story.** Confirm the author is happy to publish details from them (times, the plan file name).
