# Research: Lesson 0, `start-here`

## Source map
All sources were read on 2026-10-23.

| # | Source | Published | Covers | Timestamps or sections used |
|---|---|---|---|---|
| S1 | Matt's Skills v1.3.1, local `README.md` (`~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/`) | v1.3.1 tagged 2026-10-04; the install pins commit 49dd158 (2026-10-09) | Install commands for each agent, "pick one" rule, why the Skills exist, user-invoked vs model-invoked | Installation; Why these skills exist; Reference |
| S2 | Local `.agents/install-block.md`, `.agents/adr/0002-ship-as-a-claude-code-plugin.md`, `CHANGELOG.md` | ADR updates dated 2026-08-05, 2026-10-07, 2026-10-08 | Canonical install wording, plugin vs skills.sh, renames | "The two routes are exclusive"; ADR updates; CHANGELOG 1.0.0–1.3.1 |
| S3 | Local `skills/productivity/teach/SKILL.md` and `*-FORMAT.md`; `docs/productivity/teach.md` (= https://www.aihero.dev/skills-teach) | aihero page dated 2026-08-24 (search snippet) | `/teach` workspace, mission, lessons, records | Whole file |
| S4 | Claude Code docs: Quickstart https://code.claude.com/docs/en/quickstart and Advanced setup https://code.claude.com/docs/en/setup | Undated; checked against Claude Code 2.1.309 installed locally | Install commands, requirements, accounts, first commands | Install; Authenticate; Essential commands |
| S5 | Claude Code docs: Commands https://code.claude.com/docs/en/commands | Undated | `/clear`, `/compact`, `/help`, `/init`, `/plugin`, `/skills`, bundled `/code-review` | All commands table |
| S6 | Video "Learn anything with the /teach skill", https://www.youtube.com/watch?v=s5T5oQJcJ6U | 2026-06-08 (13:04) | `/teach` demo | 0:32, 1:40, 2:12, 2:47, 3:19, 4:27, 5:01, 5:34, 6:08, 6:41, 7:15, 8:20, 9:59 |
| S7 | Video "mattpocock/skills: A complete AI Coding workflow, end-to-end", https://www.youtube.com/watch?v=M6mYodf0dJM | 2026-07-16 (17:17) | npx install, setup, ask-matt | 0:41, 1:24, 2:47, 3:29, 4:11, 6:58, 7:40 |
| S8 | Video "5 Claude Code skills I use every single day", https://www.youtube.com/watch?v=EJyuu6zlQCg | 2026-03-16 (16:42) | Why process matters; old Skill names | 0:00–0:42, 3:34, 4:18 |
| S9 | aihero landing page https://www.aihero.dev/skills | Undated | Install widget, featured Skills (out of date) | Install section |
| S10 | aihero post "v1.2: /wait-what, /writing-for-agents, Claude Code Plugin…" https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more | 2026-08-05 | Plugin launch, docs site | Whole page |
| S11 | GitHub `mattpocock/skills` main: README, plugin.json, CHANGELOG, `.changeset/`, commits (via `gh api`) | main HEAD 5beb35b, 2026-10-19 | What is newer than 1.3.1 | n/a |
| S12 | The author's repo: `content/lessons/00-start-here.md`, `01-grilling.md`, `10-models-effort-ultracode.md`, `11-main-flow.md`, `README.md`, `GLOSSARY.md`, `git log` | Commits 2026-10-21 to 2026-10-22 | Site story | n/a |
| S13 | The author's machine: `~/.claude/plugins/installed_plugins.json`, `claude plugin list`, `claude --version` | Observed 2026-10-23 | How the Skills were installed | n/a |

## Key facts
Matt's Skills facts are pinned to v1.3.1. Claude Code facts come from docs read on 2026-10-23, with Claude Code 2.1.309 installed locally.

**What you need (Claude Code docs, S4)**
- **Operating system:** macOS 13+, Windows 10 (1809)+, Ubuntu 20.04+, Debian 10+, or Alpine 3.19+.
- **Machine:** 4 GB+ RAM, an internet connection, and a Bash, Zsh, PowerShell or CMD shell.
- **Account:** Pro, Max, Team, Enterprise or Console, or a cloud provider. The free claude.ai plan does not include Claude Code.
- **Install (native, recommended):**
  - macOS, Linux, WSL: `curl -fsSL https://claude.ai/install.sh | bash`
  - Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`
  - Windows CMD has its own command.
  - Alternatives: Homebrew `brew install --cask claude-code`, WinGet, apt/dnf/apk, or npm. npm needs Node 22+.
- **Native installs update themselves; Homebrew and WinGet installs don't.**
- **Check the install:** open a new terminal and run `claude --version`. If the shell says `claude` isn't found, the install folder isn't on your PATH yet.
- **Start a session:** `cd /path/to/project` then `claude`. You log in through the browser the first time.
- **First commands:** `/help`, `/clear`, `/exit`. Also `claude -c` to continue and `claude -r` to resume.
- **Windows:** Git for Windows is recommended, so Claude Code can use Bash. Without it, Claude Code falls back to PowerShell.
- **Node.js is not needed for Claude Code itself.** You only need it for the `npx skills…` install route, which runs Vercel's skills.sh installer (S7 0:41), or for running the site locally (the site's README says Node 24).

**Installing Matt's Skills, v1.3.1 (S1, S2)**
- **Claude Code:** `claude plugin install mattpocock-skills@claude-plugins-official`. It updates itself by default.
- **Any other agent, or if you want editable files:** `npx skills@latest add mattpocock/skills -a <agent>`. Updates are manual: run `npx skills@latest update`, and re-run `add` to pick up new Skills. If the installer asks which Skills to take, include `setup-matt-pocock-skills`.
- **Pick one route per agent.** The README warns that "installing both gives you every skill twice".
- **Step 2:** run `/setup-matt-pocock-skills` once per repo. It asks about the issue tracker, the triage labels and where docs go. Lesson 3 covers it.
- **Codex, Copilot and Gemini** have their own routes in the README, but they're out of scope for this course.

**`/teach` in brief (S3, S6)**
- **Who starts it:** you do, by typing `/teach`. Its argument hint asks what you'd like to learn.
- **It is stateful.** It treats the folder you run it in as a teaching workspace and writes:
  - `MISSION.md`: why you're learning this
  - `RESOURCES.md`: trusted sources, split into Knowledge and Wisdom (communities)
  - `lessons/0001-*.html`
  - `reference/*.html`: cheat sheets and glossaries
  - `learning-records/0001-*.md`
  - `assets/`: reusable parts, starting with a shared stylesheet
  - `NOTES.md`: your preferences
- **How it teaches:**
  - It starts by finding the mission. It doesn't trust what the model already knows, so it looks for sources first and cites them.
  - It aims for long-term retention ("storage strength") over the feeling of fluency.
  - It teaches in your zone of proximal development: hard enough to stretch you, not so hard you get lost.
  - Quiz answers are written to the same word count, and the right answer's position varies.
  - Questions that need real-world judgement get pointed to a community.
- **Run it in its own folder, not in your project.** Matt ran it in an empty folder (S6 2:12). The docs suggest a dedicated repo.
- **Resuming:** start a fresh session in the folder and say `/teach next lesson for <topic>`. The state lives in files, so `/clear` loses nothing (S3; S6 8:20).

**The full list of Skills in v1.3.1**
The plugin ships 27 Skills: 16 user-invoked and 11 model-invoked. Each one was checked against its SKILL.md `disable-model-invocation` setting.

| Bucket | User-invoked (only you can start it) | Model-invoked (you or the agent) |
|---|---|---|
| Engineering | ask-matt, grill-with-docs, triage, improve-codebase-architecture, setup-matt-pocock-skills, to-spec, to-tickets, implement, implement-spec, wayfinder, retro | prototype, diagnosing-bugs, research, tdd, domain-modeling, codebase-design, code-review, pr, wizard |
| Productivity | grill-me, handoff, teach, to-questionnaire, wait-what | grilling, writing-for-agents |
| misc (frozen, not in the plugin) | none | git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit |
| in-progress (beta, not in the plugin; install with `npx skills@latest add mattpocock/skills --skill=<name>`) | loop-me, writing-beats, writing-fragments, writing-shape, claude-handoff, setup-ts-deep-modules, chief-of-staff (in the folder but not listed in its README) | none |
| deprecated | Empty | none |

**Renames a beginner will meet in older videos (S2 CHANGELOG):**
- write-a-prd → to-prd → to-spec
- prd-to-issues → to-issues → to-tickets
- diagnose → diagnosing-bugs
- writing-great-skills → writing-for-agents (no alias)
- decision-mapping and pathfinder → wayfinder
- CONTEXT.md → GLOSSARY.md (in 1.3.0)

### Newer on GitHub main (checked 2026-10-23)
- **Latest tag:** v1.3.1, 2026-10-04. `plugin.json` on main still says 1.3.1. Main's README install section is identical to the local copy.
- **The plugin pins commit `49dd158` (2026-10-09), not the tag** (S13, S11). The 16 unreleased changes it includes, shown in `.changeset/`, are:
  - `/teach` now writes to the folder you ran it in (#377) and varies where the right quiz answer sits (#611).
  - `ask-matt` reads a Skill's SKILL.md before describing it.
  - setup creates missing triage labels.
- **Only commit on main after the pin:** 5beb35b (2026-10-19), a change to `chief-of-staff`, an in-progress Skill that isn't in the plugin.
- **A note dropped from the README:** the 2026-10-06 README said plugin updates arrive when Anthropic moves its pin, which can lag the repo by days or weeks. It also said to run `claude plugins marketplace update` if the plugin isn't found. Both lines were removed on 2026-10-08 (commit 542543a, then b0618bc).
- **The aihero.dev/skills landing page is out of date (S9).** It still calls `npx` "Recommended", shows `claude plugins install mattpocock-skills` without the `@claude-plugins-official` suffix, and features `/to-prd`, `/to-issues` and `/domain-model`.

## Day-to-day usage
**Matt's patterns**
- **Why Skills exist:** agents remember nothing between sessions, so they need strict, well-defined processes. Skills write that process down (S8 0:00–0:42).
- **Short Skills can do a lot.** Grill-me was three sentences at the time, and it still produced sessions of 30–50 questions (S8 3:34).
- **His npx install walkthrough** (S7, before the plugin existed):
  - Node is required, because npx comes from Node (0:41).
  - The installer listed 38 Skills in two groups, endorsed and experimental. He selected all the official ones (1:24–2:05).
  - Scope: project scope suits teams, global suits a solo developer like him. He picked symlink as the install method (2:47).
  - After installing, typing `/` in Claude Code shows the Skills (3:29).
- **Most of his Skills are user-invoked so they stay out of the agent's context.** In that video, his whole set added only about 660 tokens (S7 4:11).
- **When unsure, ask the router.** He calls `/ask-matt` "me as a skill" (paraphrase). He asked it how to start a code change, and it pointed to the top of the Main flow: `/grill-with-docs` in one unbroken context window (S7 6:58–7:40).
- **`/teach` habits:**
  - He tells it where he's stuck at the start of a session. It reads the workspace and designs the next lesson around that (S6 6:08–6:41).
  - He used Opus 4.8 at medium effort for the demo (S6 6:41).
  - He suggests using it to onboard people to a codebase (S6 9:59).
- **To keep up with changes:** the newsletter at aihero.dev/skills (S6 12:14).

**Other people's patterns**
- From the teach docs page's common questions (S3):
  - Most reported uses of `/teach` aren't coding: languages, music, certifications.
  - Within code, people get the most value from finding their way around an unfamiliar codebase.
  - Higher reasoning effort gives better lessons.
- skills.sh listing for `setup-matt-pocock-skills`: about 1.0M installs and 296.1K repo stars; first seen 2026-04-28 (https://www.skills.sh/mattpocock/skills/setup-matt-pocock-skills, read 2026-10-23).
- Hacker News threads mention Matt's Skills briefly and favourably (https://news.ycombinator.com/item?id=49033959, https://news.ycombinator.com/item?id=48739459). They're thin evidence.

## Common mistakes
1. **Trying to use the free claude.ai plan.** It doesn't include Claude Code (S4).
2. **`claude: command not found` right after installing.** Open a new terminal. If it's still missing, fix PATH (S4).
3. **Running the PowerShell install line in CMD, or the other way round, on Windows.** The prompt shows `PS C:\` in PowerShell (S4).
4. **Thinking Node.js is required for Claude Code.** It's only needed for the npx route (S4, S7 0:41).
5. **Installing both the plugin and the npx copies.** You get every Skill twice (S1, S2).
6. **Copying commands from older videos.** `npx` in the July video, old names in the March video, and the out-of-date landing page all differ from today. Check the CHANGELOG renames (S2, S7, S8, S9).
7. **Skipping `/setup-matt-pocock-skills`.** Then `/to-spec`, `/to-tickets` and `/triage` don't know where issues live (S1; ADR 0001).
8. **Waiting for the agent to start a user-invoked Skill.** It won't. Type it yourself (S1 Reference; S12 Lesson 11).
9. **Running `/teach` inside your project.** It takes over the folder. Use a separate folder or repo (S3).
10. **Trusting `/teach` lessons without checking them.** One user learning a 2x2 Rubik's cube got move sequences that don't work. Read the primary source each lesson recommends (S3).
11. **Starting `/teach` without saying what you already know.** There's no level check. State your prior knowledge and your gaps in the first message (S3).

## Try it yourself (about 15 minutes)
1. **Check your tools (2 min).** In a terminal, run `git --version` and `claude --version`. If `claude` is missing, install it with the native command for your system, then open a new terminal. `node --version` is optional.
2. **Make a practice repo (1 min):**
   ```bash
   mkdir -p ~/agent-practice && cd ~/agent-practice && git init
   ```
3. **Start Claude Code (2 min).** Run `claude`, log in if asked, then type `/help`. Ask: `What is in this folder?`
4. **Install Matt's Skills (3 min).** Type `/exit`, then:
   ```bash
   claude plugin install mattpocock-skills@claude-plugins-official
   claude
   ```
   Type `/ask` and look at what the menu suggests.
5. **Ask the router (3 min).** Type:
   ```
   /ask-matt I'm brand new to agentic coding. I have an empty git repo and want to build a tiny to-do page. What do I type first?
   ```
6. **Optional: start a `/teach` workspace (4 min).** In a new terminal:
   ```bash
   mkdir -p ~/learn-basics && cd ~/learn-basics && claude
   ```
   Then: `/teach the terminal and git basics I need for an agentic coding course. I've never used git.`

**It's working if**
- [ ] `claude --version` prints a version number.
- [ ] `/help` lists commands, and the agent tells you the folder is empty.
- [ ] Typing `/ask` shows `/ask-matt` (possibly as `/mattpocock-skills:ask-matt`).
- [ ] `/ask-matt` names what to type next (most likely `/grill-with-docs`, possibly with `/setup-matt-pocock-skills` as the first step) and stops without editing files. `git status` in `~/agent-practice` shows no new files.
- [ ] (Optional) `/teach` asks you why you want to learn this before showing any lesson, and `MISSION.md` appears in `~/learn-basics`, not in `~/agent-practice`.

## Site story (from the author's files)
- **What the current Lesson 0 says:**
  - The site is a journal of the author's first full-stack app, built with Claude Code and Matt's Skills.
  - A 7-step table of what he typed: `/grilling`, `/domain-modeling`, "write the spec", `/wizard`, `/prototype`, `/tdd` ×4, `/code-review`.
  - The stack in plain words.
  - His one rule: he owns the architecture and the scope, and the agent owns the details.
- **How he installed:**
  - The plugin, at user scope, on 2026-10-21 05:18 UTC (10:48 IST), version 1.3.1 (SHA 49dd158).
  - There are no npx copies in `~/.claude/skills`, so he never had duplicate Skills (S13).
- **Timeline:**
  - The first commit (2026-10-21 13:09 IST) already contains `CLAUDE.md`, `AGENTS.md`, `GLOSSARY.md`, `docs/agents/*`, four ADRs, the spec and 6 issues, and Lessons 1–3.
  - PRs #1–#8 all landed on 2026-10-21. PR #9 (the Main flow Lesson) landed on 2026-10-22 (S12).
- **Model:** the whole site was built on Opus 5.5 at default effort (Lesson 10).
- **Lesson 1:** the first grilling round asked 8 questions at once, which overwhelmed him. He asked for one or two at a time. He also told it to grill him on architecture and decide the details itself.
- **What's not in the record:** nothing shows he ran `/teach` or `/ask-matt`. Lesson 11 only recommends `/ask-matt`. Don't claim he used either.

## Candidate quiz questions
1. **You install Claude Code with the native installer, type `claude`, and see "command not found". What do you do first?**
   - A) Install Node.js 22
   - B) Open a new terminal window and run `claude --version`
   - C) Reinstall with npm
   - D) Run `/doctor`

   Answer: **B.** The installer adds `claude` to PATH, and a new terminal picks that up. `/doctor` needs Claude Code running. Source: S4 setup.
2. **A friend on the free claude.ai plan wants to follow the course in Claude Code. What do they need?**
   - A) Nothing extra
   - B) Just Node.js
   - C) A Pro, Max, Team, Enterprise or Console account (or a cloud provider)
   - D) A GitHub account

   Answer: **C.** The free plan doesn't include Claude Code. Source: S4 Authenticate.
3. **You use Claude Code and want Matt's Skills to update themselves. Which command do you run?**
   - A) `npx skills@latest add mattpocock/skills`
   - B) `claude plugin install mattpocock-skills@claude-plugins-official`
   - C) `npm install -g mattpocock-skills`
   - D) Both A and B

   Answer: **B.** The plugin updates itself. Installing both doubles every Skill. Source: S1.
4. **You've just installed the Skills in a new repo. Which Skill do you run once, before any other engineering Skill?**
   - A) `/grill-with-docs`
   - B) `/teach`
   - C) `/setup-matt-pocock-skills`
   - D) `/to-spec`

   Answer: **C.** It records the issue tracker, labels and docs layout the other Skills read. Source: S1 step 2.
5. **You're stuck and don't know which Skill fits. What's the best next step?**
   - A) Type `/ask-matt` and describe your situation
   - B) Ask the agent "what skills do you have?"
   - C) Type `/help`
   - D) Open the plugin cache folder

   Answer: **A.** `/ask-matt` is the router. The agent's own skill list leaves out the user-invoked Skills. Source: S7 6:58; ask-matt docs page.
6. **You want to learn git over the next week without cluttering the course repo. What do you do?**
   - A) Run `/teach git` inside the course repo
   - B) Make an empty folder and run `/teach git` there
   - C) Ask one question in your current session
   - D) Run `/grill-me git`

   Answer: **B.** `/teach` turns the folder it runs in into a workspace. Keep it out of your project. Source: S3 Prerequisites.
7. **An older video tells you to type `/write-a-prd`, but your plugin has no such Skill. Why?**
   - A) The plugin install is broken
   - B) It's an in-progress Skill
   - C) It was renamed. Today it's `/to-spec`
   - D) You need the npx copy too

   Answer: **C.** The CHANGELOG shows write-a-prd → to-prd → to-spec. Source: S2, S8 3:55.
8. **You installed Claude Code with the native installer. When will you actually need Node.js?**
   - A) Always, because Claude Code runs on Node
   - B) Only for the `npx skills…` route, or to run the site locally
   - C) To use the plugin install
   - D) To run `/teach`

   Answer: **B.** The native binary doesn't need Node. npx does. Source: S4, S7 0:41.
9. **During grilling, the agent asks you eight questions about fonts and file names. Following the author's rule, what do you say?**
   - A) Answer all eight in detail
   - B) Stop grilling and start coding
   - C) Tell it you own architecture and scope, and it should decide the details
   - D) Start a new session

   Answer: **C.** Lessons 0 and 1 give this rule. Source: S12.
10. **You run `/teach` for the first time in an empty folder. What should happen first?**
    - A) It shows Lesson 1 right away
    - B) It asks you why you want to learn the topic, to build `MISSION.md`
    - C) It asks for an API key
    - D) It installs packages

    Answer: **B.** The mission comes first and drives every lesson. Source: S3 "It's working if"; S6 2:47.

## Open questions / uncertain
- **Plugin or npx for beginners?** The README says the plugin for Claude Code. Matt's July video and the aihero landing page show npx. I recommend the plugin and a footnote mentioning npx.
- **What does "Node/git basics" mean on the course map?** Node isn't required for Claude Code. Decide whether to list it as optional.
- **Which surface to teach.** This research session ran in the Claude desktop app's Code view. The course says terminal. Confirm which surface the author wants, or mention both.
- **The end-to-end video transcript is a translated (Arabic) auto-caption track.** Timestamps are reliable. Paraphrases are made through that translation.
- **Prices and plans** weren't checked beyond which account types are eligible.
