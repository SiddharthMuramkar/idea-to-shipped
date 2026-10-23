# Research: Lesson 3, `skills`

## Source map
All sources were read on 2026-10-23.

| # | Source | Published | Covers | Timestamps or sections used |
|---|---|---|---|---|
| K1 | Claude Code docs, "Extend Claude with skills", https://code.claude.com/docs/en/skills | Undated; checked with Claude Code 2.1.309 | SKILL.md, frontmatter, where Skills live, who can invoke them, lifecycle, troubleshooting | Frontmatter reference; Choose where skills load; Control who invokes a skill; Skill content lifecycle; Troubleshooting |
| K2 | Claude Code docs: Plugins overview https://code.claude.com/docs/en/plugins/overview; Install and manage https://code.claude.com/docs/en/discover-plugins; Plugin CLI reference https://code.claude.com/docs/en/plugins/cli-reference | Undated | Plugins, marketplaces, scopes, updates, `/plugin`, `/reload-plugins` | n/a |
| K3 | Claude Code docs, Commands, https://code.claude.com/docs/en/commands | Undated | Bundled `/code-review` (alias `/review`), `/skills`, `/reload-skills`, `/plugin` | n/a |
| K4 | Anthropic Engineering, "Equipping agents for the real world with Agent Skills", https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | 2025-10-16; open-standard update 2025-12-18 | Progressive disclosure in three levels | Anatomy; Skills and the context window |
| K5 | Context7 `/anthropics/claude-code` (CHANGELOG excerpts) | n/a | `user-invocable` default; `disable-model-invocation` refusal | n/a |
| M1 | Local v1.3.1: `README.md`, `CLAUDE.md`, `SCOPE.md`, `GLOSSARY.md`, `.claude-plugin/plugin.json` and `marketplace.json`, `.agents/install-block.md`, `.agents/invocation.md`, ADR 0001 and 0002, `CHANGELOG.md`, `.changeset/*`, `.out-of-scope/*` | Tag 2026-10-04; pinned 49dd158 | Install, invocation rule, plugin contents, name clashes | n/a |
| M2 | Local `skills/engineering/setup-matt-pocock-skills/` (SKILL.md, `issue-tracker-{github,gitlab,local}.md`, `triage-labels.md`, `domain.md`); `docs/engineering/setup-matt-pocock-skills.md` (= https://www.aihero.dev/skills-setup-matt-pocock-skills, dated 2026-08-24 per search) | n/a | What setup asks and writes | Whole files |
| M3 | Local `skills/engineering/ask-matt/SKILL.md`, `PHASE-BOUNDARIES.md`; `docs/engineering/ask-matt.md` (= https://www.aihero.dev/skills-ask-matt) | n/a | The router | Whole files |
| M4 | Local `skills/productivity/writing-for-agents/SKILL.md` and `SKILL-MECHANICS.md` | n/a | Context pointers, the two loads, progressive disclosure, router Skills | Whole files |
| M5 | Local bucket READMEs (`skills/*/README.md`) | n/a | The buckets | n/a |
| M6 | aihero post "v1.2 …", https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more | 2026-08-05 | Plugin launch; ask-matt phase boundaries; setup made friendlier | n/a |
| V1 | Video "mattpocock/skills: A complete AI Coding workflow, end-to-end", https://www.youtube.com/watch?v=M6mYodf0dJM | 2026-07-16 | Install, setup, ask-matt | 0:41, 1:24, 2:05, 2:47, 3:29, 4:11, 4:53, 5:35, 6:16, 6:58, 7:40 |
| V2 | Video "5 Claude Code skills I use every single day", https://www.youtube.com/watch?v=EJyuu6zlQCg | 2026-03-16 | What a Skill is to Matt; duplicate copies at two scopes | 0:00–0:42, 3:34, 4:18 |
| V3 | Video "Learn anything with the /teach skill", https://www.youtube.com/watch?v=s5T5oQJcJ6U | 2026-06-08 | Stateful vs stateless Skills | 0:32–2:12 |
| G1 | GitHub issues on mattpocock/skills (via `gh`): #812, #1176, #1201, #1202, #558, #693, #1052, #1019 (from `.out-of-scope`) | 2026-07 to 2026-10 | Community-reported pitfalls | n/a |
| C1 | Third-party skill directories: https://llmbase.ai/skills/mattpocock/ask-matt, https://mcpservers.org/agent-skills/mattpocock/ask-matt, https://www.skills.sh/mattpocock/skills/setup-matt-pocock-skills | Undated | Single-Skill install commands; install counts | n/a |
| A1 | The author's repo: `CLAUDE.md`, `AGENTS.md`, `GLOSSARY.md`, `docs/agents/*`, `.scratch/*`, `content/lessons/07-code-review.md`, `10-…`, `11-main-flow.md`, `git log` | 2026-10-21 to 2026-10-22 | Site story | n/a |
| A2 | The author's machine: `installed_plugins.json`, `claude plugin list`; this research session's own list of available Skills | Observed 2026-10-23 | Install facts; which Skills the model can see | n/a |

## Key facts

**What a Skill is (Claude Code, docs read 2026-10-23, K1, K4)**
- **The basics:**
  - A Skill is a folder containing a `SKILL.md` file. The file has YAML frontmatter between `---` lines, then markdown instructions.
  - Claude Code follows the open Agent Skills standard (agentskills.io), which Anthropic published on 2025-12-18.
  - Custom commands have been merged into Skills. `.claude/commands/x.md` still works, but Skills add supporting files and invocation control.
- **Frontmatter:**
  - Every field is optional. `description` is recommended.
  - `name` defaults to the folder name and becomes the `/command`.
  - Other fields: `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context: fork`, `agent`, `hooks`, `paths`, `shell`.
  - The combined `description` and `when_to_use` text is cut at 1,536 characters in the Skill listing.
  - If the YAML is broken, the body still loads with no metadata, so the agent can't match the description.
- **Progressive disclosure** (K4; K1 table):
  - Level 1: the name and description of every model-invocable Skill sit in context from the start.
  - Level 2: the full SKILL.md loads when the Skill is invoked.
  - Level 3: supporting files load only when needed.
  - The docs advise keeping SKILL.md under 500 lines.
- **Who can invoke a Skill (K1):**

  | Frontmatter | You can type it | Claude can start it on its own | Description in context? |
  |---|---|---|---|
  | Default | Yes | Yes | Always |
  | `disable-model-invocation: true` | Yes | No | No |
  | `user-invocable: false` | No (hidden from the `/` menu) | Yes | Always |

  If Claude tries to start a `disable-model-invocation` Skill, Claude Code blocks it and tells Claude to ask you to run it (K1, K5).
- **Where you type the name matters (K1).** `/name` at the start of a message runs the Skill. The same name later in a sentence only gives the agent permission to run it.
- **How long a Skill stays loaded (K1):**
  - The invoked SKILL.md enters the conversation as one message and stays there. It isn't re-read on later turns.
  - After compaction, each Skill's first 5,000 tokens are re-attached, with 25,000 tokens shared across all Skills. Put the important instructions near the top.
- **Size of the Skill listing (K1).** It gets 1% of the context window. Descriptions of the Skills you use least are dropped first. `/doctor`, `/context` and `/skill-doctor` show what it costs.
- **Where Skills live (K1):**

  | Location | Path | Loads in |
  |---|---|---|
  | Enterprise | Managed settings directory | Machines your organisation manages |
  | Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects on this machine |
  | Project | `.claude/skills/<name>/SKILL.md` (commit it to share) | That repo |
  | Nested | Subfolders | Sessions started in or below them |
  | `--add-dir` | Extra directories | That session |
  | Plugin | `<plugin>/skills/<name>/SKILL.md` | Wherever the plugin is enabled, as `/plugin-name:skill-name` |
  | claude.ai | Synced from your account | Cowork, cloud and signed-in sessions |

  - If the same name exists in several places: enterprise beats personal, and personal beats project.
  - Plugin Skills are namespaced, so they load alongside others with the same name.
  - Your own Skill with a bundled Skill's name replaces the bundled one.
- **Picking up changes (K1, K3).** Claude Code watches Skill folders for edits. If a top-level skills folder didn't exist when the session started, run `/reload-skills`. Plugin changes need `/reload-plugins`.
- **Bundled Skills (K1, K3).** Claude Code ships its own Skills: `/code-review` (alias `/review`), `/debug`, `/batch`, `/loop`, `/doctor`, `/claude-api`, `/run`, `/verify` and more.

**Plugins and marketplaces (K2)**
- **A plugin** is a directory of Skills, agents, hooks, MCP servers and other parts, installed as one unit.
- **A marketplace** is a catalog: a repo or folder with `.claude-plugin/marketplace.json`.
- **The official marketplace** (`claude-plugins-official`) is added the first time you start an interactive session. On a machine where no session has been opened yet, scripts add it with `claude plugin marketplace add anthropics/claude-plugins-official`.
- **Installing:**
  - `claude plugin install <name>@<marketplace>` installs at user scope by default. `--scope project` (committed `.claude/settings.json`) and `--scope local` also exist.
  - Typing `/plugin install …` inside a session opens the panel so you can review the plugin and pick a scope.
  - Plugins installed from the shell load on the next start, or after `/reload-plugins`.
- **Updates:** auto-update is on by default for `claude-plugins-official` and off for third-party marketplaces.
- **Managing:** `claude plugin list | disable | uninstall`, and the `/plugin` tabs Discover, Installed and Marketplaces.

**Matt's invocation rule (M1, M4)**
- User-invoked Skills set `disable-model-invocation: true`. Their job is to orchestrate. Model-invoked Skills hold reusable discipline that the agent can reach for on its own.
- A user-invoked Skill can call model-invoked Skills, but never another user-invoked one. The README's Reference section states this rule.
- Why most of his Skills are user-invoked:
  - User-invoked Skills cost no context, but you have to remember them (Matt calls this cognitive load).
  - Model-invoked Skills keep their description loaded on every turn (context load).
  - A **router Skill** (`ask-matt`) solves the cognitive-load problem: you remember one Skill instead of 16 (M4 SKILL-MECHANICS).
- When a Skill needs a user-invoked Skill first, it tells you to run it (for example, "run `/setup-matt-pocock-skills`") instead of calling it (M1 invocation.md; CHANGELOG #880).
- Stateful vs stateless: grill-me saves nothing, while grill-with-docs and teach write files and improve over time (V3 1:06–2:12).

**Installing Matt's Skills, v1.3.1 (M1)**
- **Plugin:** `claude plugin install mattpocock-skills@claude-plugins-official`.
  - It's read-only and updates itself. It ships exactly the 27 promoted Skills.
  - In Claude Code it lives at `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/<version>/`.
  - Each Skill is reachable as `/mattpocock-skills:<name>`, and also as `/<name>` unless another command already has that name.
- **skills.sh:** `npx skills@latest add mattpocock/skills` (add `-a <agent>` to preselect an agent).
  - It needs Node and copies editable files you own.
  - The interactive installer asks which Skills, which agents, project or global scope, and symlink or copy (V1 1:24–3:29).
  - Update with `npx skills@latest update`, and re-run `add` to pick up new Skills.
- **Pick one route.** Both together give you every Skill twice (M1 install-block, "The two routes are exclusive").
- **Name clashes are your harness's problem, not the Skills'.** Matt won't rename Skills to dodge built-ins. Use the namespaced name, for example `/mattpocock-skills:code-review` (M1 `.out-of-scope/harness-name-collisions.md`; prior clashes #423, #483, #857, #1019).

**`/setup-matt-pocock-skills` (M2)**
- **Who starts it:** user-invoked. It's prompt-driven: it explores, shows what it found, confirms with you, then writes.
- **1. Explore.** It looks at:
  - `git remote -v` and `.git/config`
  - root `AGENTS.md` and `CLAUDE.md` (and any existing `## Agent skills` block)
  - `GLOSSARY.md` and `GLOSSARY-MAP.md`
  - `docs/adr/` and `docs/agents/`
  - `.scratch/`
  - whether `triage` is installed
  - monorepo signals (`pnpm-workspace.yaml`, `workspaces`, `packages/*`)
- **2. Ask, one section at a time, leading with the recommended answer:**
  - **A) Issue tracker:**
    - It proposes GitHub if the remote is GitHub, and GitLab if it's GitLab.
    - Otherwise it offers GitHub (`gh`), GitLab (`glab`), Local markdown (`.scratch/<feature>/`) or Other (you describe it in a paragraph).
    - The "PRs as a request surface" flag stays off and isn't mentioned.
  - **B) Triage labels** (only if triage is installed):
    - One question: keep the defaults? The five defaults are `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
    - It collects your own label names only if you say no.
  - **C) Domain docs:**
    - Single-context is the default and is written without asking: one `GLOSSARY.md` plus `docs/adr/`.
    - Multi-context (`GLOSSARY-MAP.md`) is offered only when it sees monorepo signals.
- **3. Confirm.** It shows drafts of the `## Agent skills` block and each docs file, and lets you edit them.
- **4. Write:**
  - It edits `CLAUDE.md` if it exists, otherwise `AGENTS.md`. If neither exists, it asks which to create. It never creates one when the other exists.
  - An existing block is updated in place.
  - Files written: `docs/agents/issue-tracker.md` (from the GitHub, GitLab or local template, or your own prose for Other), `docs/agents/domain.md`, and `docs/agents/triage-labels.md` only if Section B ran.
  - On GitHub or GitLab, it creates any missing labels. This comes from an unreleased change included in the pinned build.
- **5. Done.** It tells you which Skills will read these files. You can edit `docs/agents/*.md` by hand later. Re-run setup only to switch trackers or start over.
- **What depends on it (ADR 0001):**
  - `to-spec`, `to-tickets` and `triage` need it outright and will tell you to run setup.
  - `implement-spec` also points you to it (CHANGELOG 1.3.0).
  - `wayfinder` reads the "Wayfinding operations" section of the tracker file.
  - `tdd`, `diagnosing-bugs` and `improve-codebase-architecture` just work a little less sharply without it.
- **What it doesn't do (docs page):** no settings for user preferences, and no user-level or global mode. Every repo carries its own `docs/agents/`.
- **Supported trackers:** GitHub, GitLab and local markdown get first-class templates. Everything else (Jira, Linear and so on) goes through Other (M1 `.out-of-scope/mainstream-issue-trackers-only.md`).

**`/ask-matt` (M3)**
- **Who starts it:** user-invoked. It's a hand-written map of Matt's Skills only. It recommends what to type and stops, without running anything.
- **It now reads a Skill's SKILL.md before describing it or suggesting you skip it** (M3 line 11; changeset ask-matt-read-skill-first).
- **What it routes:**
  - **Main flow:**
    - Starts with `/grill-with-docs`, or `/grill-me` if you're not in a working directory.
    - Fork 1: a question that needs runnable code goes to `/prototype`, with `/handoff` to get there and back.
    - Fork 2: a multi-session build goes `/to-spec` → `/to-tickets` → `/implement` per ticket (with `/clear` between tickets) or `/implement-spec`. A small build goes straight to `/implement`.
    - `/tdd` and `/code-review` run inside the build. `/pr` writes the PR description, and `/retro` comes last.
  - **Context hygiene:** keep steps 1–3 in one window. The smart zone is about 150k tokens.
  - **On-ramps:** `/triage` (only for issues other people filed), `/diagnosing-bugs`, `/wayfinder`.
  - **Codebase health:** `/improve-codebase-architecture`.
  - **Vocabulary underneath:** `/domain-modeling` and `/codebase-design`.
  - **Phase boundaries**, checked in this order: Continue → `/clear` → `/handoff` → subagent → `/compact` (PHASE-BOUNDARIES.md).
  - **Standalones:** grill-me, grilling, prototype, research, to-questionnaire, wizard, wait-what, teach, writing-for-agents.
  - **Precondition:** `/setup-matt-pocock-skills`.
- **Its docs page notes it often lands you on `/grill-with-docs` or `/triage`.** Where the router and a SKILL.md disagree, the SKILL.md wins.

**Matt's Skills by bucket in v1.3.1:** see the table in `start-here.md`. Engineering has 11 user-invoked and 9 model-invoked. Productivity has 5 user-invoked and 2 model-invoked. misc has 4 and in-progress has 7; neither is in the plugin. deprecated is empty.

### Newer on GitHub main (checked 2026-10-23)
- **Latest tag:** v1.3.1 (2026-10-04). The plugin pins 49dd158 (2026-10-09), so 16 unreleased changes are already in what users have installed.
- **Changes relevant here:**
  - setup creates missing labels and fixes its `glab` commands and its `--json` issue reads (#616, #635, #733, #801).
  - `ask-matt` reads SKILL.md first (#614).
  - `/teach` anchors its workspace and varies the right quiz answer's position.
- **The docs pages haven't caught up** on label creation, the ask-matt reading behaviour and teach quiz positions. Use the SKILL.md.
- **Only newer commit:** 5beb35b (2026-10-19), a change to `chief-of-staff` (in-progress).
- **Open issues to know about (G1):**
  - **#812:** on the plugin, setup's check for whether `triage` is installed can fail, because user-invoked Skills don't appear in the agent's list. Then `triage-labels.md` isn't written.
  - **#1176:** there's no upgrade step between versions. A repo set up before 1.3.0 still points at `CONTEXT.md`, which 1.3.x no longer reads.
  - **#558:** setup writes to `CLAUDE.md` even when the user runs Codex.
  - **#1201:** if you choose GitHub or GitLab in a folder with no remote, setup writes config for a tracker nothing can reach.
  - **#1202:** reported before the label-creation fix. It also notes the `wayfinder:*` labels are never created.
  - **#1300:** request to add Gitea.

## Day-to-day usage
**Matt's patterns**
- **Install once, then type `/` to see the Skills** (V1 3:29).
- **Run setup once per repo**, including old codebases or empty folders (V1 0:41, 4:11–6:16):
  - He chose local markdown and the default labels.
  - Single-context suits about 99% of people.
  - Setup then added pointer lines to `CLAUDE.md` for `docs/agents/*`.
  - For Jira, Linear or Beads, he says to tell the setup Skill which one you use (V1 4:53).
- **When you don't know what to do next, type `/ask-matt` and describe your situation in plain words.** He asked it how to start a code change (V1 6:58–7:40).
- **Keep most Skills user-invoked so the context stays light.** His whole set was about 660 tokens at the time (V1 4:11).
- **Be careful with copies of the same Skill at two scopes.** In the March video, he added a "user" suffix when typing a Skill so he'd get his user-level copy rather than a project-level copy of the same Skill (V2 4:18).
- **For team repos, choose project scope with skills.sh**, so everyone shares one set. Choose global if you work solo (V1 2:47).

**Other people's patterns (G1, C1, docs-page FAQs in M2 and M3)**
- People hook the Other tracker up to Jira over MCP, a Gitea CLI, or a hand-built dashboard (M2 docs page).
- Users report three things repeatedly:
  - Expecting setup to hold their preferences (it doesn't; use `CLAUDE.md`).
  - Expecting setup to create labels (fixed in the pinned build).
  - The router saying Skills are missing.
- Third-party directories advertise single-Skill installs such as `npx skills add mattpocock/skills --skill ask-matt` (C1). That gives you a router pointing at Skills you don't have.

## Common mistakes
1. **Installing the plugin and the npx copy.** Every Skill appears twice. Pick one (M1).
2. **Typing `/code-review` and getting Claude Code's own bug hunt.** Matt's two-axis review is `/mattpocock-skills:code-review` (K1, K3, M1; the author did exactly this in Lesson 7).
3. **Asking for a user-invoked Skill in a sentence.** For example, "please grill with docs". Claude can't start it, so type `/grill-with-docs` at the start of your message (K1; A1 Lesson 11).
4. **Believing the agent when it says a Skill isn't installed.** The 16 user-invoked Skills aren't in its list. Type them anyway, or check `plugin.json` (M3 docs page; A2 observation).
5. **Editing a SKILL.md inside the plugin cache.** It's read-only, and updates overwrite it. Put standing preferences in your `CLAUDE.md` (M3 docs page; M1 SCOPE).
6. **Expecting setup to change how grilling asks questions, or the tone.** It only records tracker, labels and docs layout. Preferences go in `CLAUDE.md` (M2 docs page).
7. **Choosing GitHub in a folder with no remote**, or forgetting `gh` (#1201; M2).
8. **Not re-running setup after a big update**, such as the 1.3.0 rename of `CONTEXT.md` to `GLOSSARY.md` (#1176; CHANGELOG 1.3.0).
9. **Installing only `ask-matt`.** It routes to Skills you don't have (M3 Prerequisites; C1).
10. **Using skills.sh and not selecting `setup-matt-pocock-skills`** (M1 README).
11. **Expecting plugin Skills right after a shell install in an open session.** Restart or run `/reload-plugins` (K2).
12. **Expecting a brand-new `.claude/skills/` folder to be picked up without `/reload-skills`** (K1).
13. **Writing a vague `description`.** The agent can't tell when to use the Skill. Put the key use first, and keep it under 1,536 characters (K1).

## Try it yourself (about 15 minutes)
Use `~/agent-practice` from Lesson 0: a git repo with no `CLAUDE.md`, plugin installed.

1. **Run setup (5 min).** Start `claude`, then type `/setup-matt-pocock-skills`. Answer:
   - **Issue tracker:** "Local markdown". There's no remote.
   - **Labels**, if asked: "yes, keep the defaults".
   - **File to create:** "CLAUDE.md".
   - Read the drafts before saying yes.
2. **Check what it wrote (1 min).** In your shell:
   ```bash
   ls docs/agents && cat CLAUDE.md
   ```
3. **Write your own Skill (4 min).**
   ```bash
   mkdir -p .claude/skills/repo-tour
   cat > .claude/skills/repo-tour/SKILL.md <<'EOF'
   ---
   description: Give a three-bullet tour of this repo. Use when the user asks what is in this repo or where things live.
   ---
   List the top-level files and folders. In three bullets, say what each one is for, and explain what docs/agents/ is for.
   EOF
   ```
   In Claude Code, run `/reload-skills`, then ask: `what's in this repo?` Then type `/repo-tour`.
4. **Make it user-invoked (3 min).** Add `disable-model-invocation: true` under the `description` line and save. Run `/clear`, ask `what's in this repo?` again, then type `/repo-tour`.
5. **Ask the router (2 min).** Type:
   ```
   /ask-matt I want to add a small "about" page to this repo. What do I type next?
   ```

**It's working if**
- [ ] `docs/agents/issue-tracker.md` says Local Markdown and `.scratch/<feature>/`, and `docs/agents/domain.md` exists.
- [ ] `CLAUDE.md` has an `## Agent skills` block with one line per docs file. If `triage-labels.md` is missing, that's the known #812 behaviour; note it and move on.
- [ ] Before the flag, asking "what's in this repo?" makes the agent load `repo-tour` on its own (a Skill call appears).
- [ ] After the flag, the same question doesn't load it, but `/repo-tour` still works.
- [ ] `/ask-matt` names the next Skill (probably `/grill-with-docs`) and stops without editing anything.
- [ ] No file under `~/.claude/plugins/cache/...` changed.

## Site story (from the author's files)
- **How he installed:** the plugin at user scope, 2026-10-21 05:18 UTC, v1.3.1, SHA 49dd158. No npx copies, so no duplicates (A2).
- **Setup's output**, committed in the first commit (2026-10-21 13:09 IST):
  - local markdown tracker (`.scratch/<feature>/`)
  - default triage labels
  - single-context domain docs
  - the `## Agent skills` block written into `CLAUDE.md`, above the Next.js section; `AGENTS.md` holds the Next.js-generated rules (A1)
  - **Inference, confirm with the author:** there was probably no GitHub remote yet. GitHub was connected later by `/wizard` (Lesson 0, step 4).
- **The local tracker in use:**
  - `.scratch/lesson-site/` has `spec.md` and 6 issues.
  - `.scratch/main-flow-and-redesign/` has `spec.md` and 5 issues.
  - Both follow the template: `issues/NN-slug.md` with `Status:` and `Blocked by:` lines.
- **`triage-labels.md` was written**, even though `/triage` was never used and #812 says it can be skipped on the plugin.
- **The glossary** defines Skill (with "command", "tool" and "plugin" as words to avoid) and Built-in command. The Main flow review later caught the home page calling Skills "commands" (Lesson 11, "What happened" #6).
- **Two `/code-review`s in Lesson 7 vs Lesson 10.** He typed `/mattpocock-skills:code-review` for Matt's two-axis review, starting from `4f849b9`. In Lesson 10 he typed `/code-review max` for Claude Code's own bug hunt. Same short name, two different Skills.
- **Lesson 11, user-invoked in practice:**
  - He asked for "grilling with docs" in plain words. The agent couldn't start the user-invoked `/grill-with-docs`, so it ran `/grilling` and `/domain-modeling` instead.
  - Lesson 11 then lists which Skills only he can start.
- **Seen during this research (2026-10-23, Claude Code 2.1.309):**
  - The model-facing Skill list in this session shows only the 11 model-invoked `mattpocock-skills:` Skills, plus Claude Code's own `code-review`.
  - All 16 user-invoked Skills are absent from that list, which matches K1's table.

## Candidate quiz questions
1. **You're writing a `/deploy` Skill and never want the agent to start it on its own. Which frontmatter do you add?**
   - A) `user-invocable: false`
   - B) `context: fork`
   - C) `disable-model-invocation: true`
   - D) Leave out the description

   Answer: **C.** It blocks Claude from starting the Skill, and you can still type it. Source: K1 "Control who invokes a skill".
2. **You want background notes only the agent uses, hidden from the `/` menu. Which do you set?**
   - A) `user-invocable: false`
   - B) `disable-model-invocation: true`
   - C) `paths: "*"`
   - D) `allowed-tools: Read`

   Answer: **A.** It hides the Skill from you, while the description stays in Claude's context. Source: K1.
3. **For a default (model-invoked) Skill, what sits in the agent's context on every turn?**
   - A) The whole SKILL.md
   - B) Its supporting files
   - C) Its name and description
   - D) Nothing until you type it

   Answer: **C.** That's level 1 of progressive disclosure. The body loads only when the Skill runs. Source: K4, K1.
4. **The `/` menu shows every one of Matt's Skills twice. What happened?**
   - A) You installed both the plugin and the npx copies
   - B) The plugin auto-updated
   - C) You ran setup twice
   - D) Bundled Skills duplicate them

   Answer: **A.** The two install routes are exclusive. Source: M1 README and install-block.
5. **You type `/code-review` and get a single bug-hunt report, not Matt's Standards and Spec review. What do you type instead?**
   - A) `/review`
   - B) `/code-review max`
   - C) `/mattpocock-skills:code-review`
   - D) `/ask-matt code-review`

   Answer: **C.** Claude Code ships its own `/code-review`. Plugin Skills are reachable by their namespaced name. Source: K1, K3, A1 Lesson 7.
6. **You type "ok, now grill with docs please", and the agent runs `/grilling` and `/domain-modeling` instead. Why?**
   - A) `/grill-with-docs` isn't installed
   - B) `/grill-with-docs` is user-invoked, so only you typing it at the start of a message runs it
   - C) The agent ignored the Skill on purpose
   - D) Your session was compacted

   Answer: **B.** A name inside a sentence only gives permission, and user-invoked Skills block the agent. Source: K1; A1 Lesson 11.
7. **The agent says "`/to-spec` isn't installed", but you installed the plugin. What's the best response?**
   - A) Reinstall with npx
   - B) Type `/to-spec` yourself, or check `plugin.json`
   - C) Run setup again
   - D) Ask the agent to install it

   Answer: **B.** User-invoked Skills are left out of the agent's Skill list. Source: M3 docs page.
8. **You run `/setup-matt-pocock-skills` in a repo that has a `CLAUDE.md` and no `AGENTS.md`. Where does the `## Agent skills` block go?**
   - A) A new `AGENTS.md`
   - B) Both files
   - C) `CLAUDE.md`
   - D) `~/.claude/CLAUDE.md`

   Answer: **C.** It edits whichever of the two already exists and never creates the other. Source: M2 SKILL.md step 4.
9. **You want grilling to always ask one question at a time, in every repo. Where do you put that?**
   - A) In `docs/agents/issue-tracker.md` via setup
   - B) By editing the plugin's `grilling/SKILL.md`
   - C) As a line in your `CLAUDE.md`
   - D) In `.claude-plugin/plugin.json`

   Answer: **C.** Setup holds no preferences, and plugin files are read-only and get overwritten. Source: M2 docs page; M3 docs page; CHANGELOG 1.2.0.
10. **You type `/ask-matt I have an idea and a repo, where do I start?` What should it do?**
    - A) Start grilling you straight away
    - B) Name `/grill-with-docs` as the next thing to type, and stop
    - C) Write a spec
    - D) Install missing Skills

    Answer: **B.** The router recommends and stops. You type the next Skill. Source: M3 docs page.

## Open questions / uncertain
- **The docs pages vs the pinned SKILL.md** (labels, ask-matt reading, teach quizzes). The notes follow the SKILL.md. Re-check if a new plugin pin lands before the Lesson ships.
- **#812:** setup's Section B may be skipped on the plugin, yet the author's run wrote `triage-labels.md`. The behaviour seems to depend on the model. Tell learners to check for the file.
- **Does `/skills` list user-invoked Skills?** Not verified. The `/` menu does (V1 3:29; `user-invocable` defaults to true).
- **Where skills.sh puts files** (with symlinks, `.agents/skills` vs `.claude/skills`) isn't verified. Matt only says symlink is the recommended method (V1 2:47).
- **#693:** "coordinator mode" on desktop and web surfaces drops user-invoked Skills. It was closed as a Claude Code issue. The author's desktop sessions ran user-invoked Skills fine (Lesson 11), so it's probably not the default.
- **#1052 (open)** reports grill-me failing with a Skill-tool error. It isn't reproduced here. It belongs to the grilling Lesson.
- **"About 660 tokens" for the whole set** is from July 2026. Verify with `/context` before quoting.
