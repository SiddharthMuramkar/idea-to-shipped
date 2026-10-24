# Community usage, Matt's writing, video catalogue, and changes after v1.3.1

Research agent report, read on 2026-10-23. Paraphrased and cited.

## 1. How real people use the Skills day to day

### A. Write-ups and videos that show real sessions

**Colin Eberhardt (CTO, Scott Logic), "An honest review of Matt Pocock's Skills framework"**
- https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html, 2026-10-19. HN thread: https://news.ycombinator.com/item?id=50165607
- **Skills covered:** ask-matt, grill-with-docs, to-spec, to-tickets, implement, tdd, code-review, wizard.
- **What he did:** rebuilt a real karting-tracker app from scratch.
  - He used /ask-matt to find a starting point, and it sent him to /grill-with-docs.
  - The grilling took about 5 minutes and produced a roughly 45-line glossary file plus one useful ADR (model chassis, engine and tyres as separate parts, not one "Kart" record).
  - /to-spec proposed a testing seam above the storage provider and wrote an 80-line spec. /to-tickets made 8 lightweight tickets.
  - /implement ran red-green TDD, then code-review. Both review axes caught real bugs.
- **Complaints:**
  - The spec used user-story syntax for basic CRUD work. He would have preferred a data model, and calls the user stories "AI theatre".
  - The generated tests mostly checked their own mocks. They tested the same 15-line adapter again for every entity.
  - /wizard broke down because the agent's memory of the Supabase dashboard was out of date, and the generated script has no way out when a step is wrong.
- **Verdict:** the practices are sound and the skills are refreshingly small, but they need tailoring and your own judgement. In his words, at times it felt like "simulating the rituals of software engineering".

**Nowshad Jawad, "The Two Matt Pocock Skills I Use in Almost Every AI Coding Session"** (Medium)
- https://medium.com/@anmjawad007/the-two-matt-pocock-skills-i-use-in-almost-every-ai-coding-session-57c468938145, 2026-05-29.
- **Skills:** grill-with-docs, handoff.
- His glossary entries later remind him why a term was chosen. ADRs record non-obvious choices, such as a database delete rule.
- In the middle of a grilling session he used /handoff to send an auth-naming refactor to a second session, then carried on with the feature.

**The Hype Kevin, "Ship like the best engineers: Matt Pocock's AI workflow"**
- https://www.youtube.com/watch?v=Q3uuE2adUT8, 2026-10-09.
- Follows one small feature (a Pause button for a coffee subscription) through the whole flow: grilling, glossary, spec, tickets, build, review in two parts, /pr, /retro, plus a real ten-ticket run from Matt's repo.

**The Gray Cat, "Matt Pocock vs Addy Osmani: I Tested Both Skill Packs"**
- https://www.youtube.com/watch?v=IDQs0VBL5UY, 2026-08-27.
- **Skill:** wayfinder.
- The Wayfinder route spent 34.9M tokens before any implementation. The full run used 107.7M tokens over 290 minutes, about $87 at API rates, and still missed a disabled button.
- The Osmani route cost about the same but spent its effort on review instead.

**Warshoow, "afk.sh"** (GitHub Discussion #1136)
- https://github.com/mattpocock/skills/discussions/1136, 2026-09-28.
- **Skills:** triage, implement, tdd, code-review.
- A plain bash outer loop runs /implement once per `ready-for-agent` ticket, each in a fresh headless session and its own worktree. Its own test command decides pass or fail. One run did 10 tickets in 62 minutes for $20.40.
- **Key finding:** he checked 173 session transcripts. `tdd` was never called. Bare `code-review` resolved to Claude Code's built-in review 36 times, against 18 runs of the plugin's version. His fix was to name the skills in full (`mattpocock-skills:tdd`).

**jinhuang712, A/B test** (Discussion #1247)
- https://github.com/mattpocock/skills/discussions/1247, 2026-10-10.
- /improve-codebase-architecture against a plain prompt on Opus 5.5, on a 20k-line Go service. A blind judge preferred the plain prompt. The skill runs were cheaper and faster. Only 2 runs per arm.

**PitifulRice6719, r/hermesagent**
- https://www.reddit.com/r/hermesagent/comments/1sz4px1/, 2026-04-29.
- Ran grill-me/grill-with-docs, then to-prd, then to-issues. Then had Hermes start one sub-agent per issue, stopping at any human-in-the-loop ticket. This replaces Matt's Sandcastle tool with Hermes's built-in sub-agents.

### B. Reddit

- **r/ClaudeCode, "Matt Pocock Tutorials … GOLDMINE"** (des369), https://www.reddit.com/r/ClaudeCode/comments/1v90akt/, 2026-07-28.
  - The skills people call essential are codebase-architecture and grill-with-docs. One commenter says grill-with-docs stopped Claude inventing features.
  - One person uses handoff several times a day.
  - **Adaptations:** grill-me changed to speak in domain language and look things up in the code instead of asking; grill-me turned into a looser "ask-me" skill; a separate ui-mockups skill.
  - One setup: Opus 5 at medium effort for grilling, Sonnet 5 at medium for implementing.
  - **Criticism:** wayfinder feels half-baked; skills depend on each other too much. One user dropped the set for OpenSpec.
- **r/AskVibecoders, "This 176k+ Starred GitHub Repo changed How I write claude.md"**, https://www.reddit.com/r/AskVibecoders/comments/1uzzmkh/, 2026-07-18.
  - The author grills before anything touching more than two files; on a small refactor it caught two wrong data-flow assumptions.
  - Replies: one user modified grill-with-docs to ask 3 questions at a time; tdd is expensive but worth it for tickets that need heavy validation; another uses /tdd on almost everything.
- **r/ClaudeCode, orchestration-layer thread**, https://www.reddit.com/r/ClaudeCode/comments/1u6vh4c/, 2026-06-15. A user grills requirements into a long-lived spec plus separate ADRs, then grills the plan as well, and only then codes and QAs.
- **r/ClaudeCode, "what are you using…"**, https://reddit.com/r/ClaudeCode/comments/1un4qn2/, 2026-07-04. One user keeps forked copies of the skills in a git-tracked `~/.claude` and tweaks them. Another says grill-me plus codebase exploration is enough with frontier models.
- **r/ClaudeCode, "game changer" thread**, https://www.reddit.com/r/ClaudeCode/comments/1vgtqpy/, 2026-08-06.
  - Opus plans a batch of cheap bug-hunting sub-agents, then Matt's skills triage the results into issues.
  - Another user runs /improve-codebase-architecture scoped to just-written code after each build.
  - Another keeps the old grill-me because it is simpler.
- **r/ClaudeCode, Wayfinder pivots**, https://www.reddit.com/r/ClaudeCode/comments/1vjijgx/, 2026-08-09.
  - **Positive:** one user split a project into about 20 GitHub issues, each a clean agent run.
  - **Negative:** some call it waterfall in the style of the BMAD framework, and prefer running grill-me on pieces instead.
- **r/vibecoding**, https://www.reddit.com/r/vibecoding/comments/1v0zm6n/, 2026-07-19. Adopted the workflow after a Matt talk. They put the quality drop at about 100k tokens. Mis-specified builds mostly stopped.
- **r/codex**, https://www.reddit.com/r/codex/comments/1szqu7w/, 2026-04-30. Grill-me grouped with Superpowers and GSD as a "trifecta". Some combine Superpowers with grill-me.
- **r/ClaudeCode**, https://reddit.com/r/ClaudeCode/comments/1v3grll/, 2026-07-22. Describes Matt's chain as "a toolkit you work in", as opposed to a fixed-format plugin.

### C. Hacker News
- fowlie, https://news.ycombinator.com/item?id=48419097, 2026-06-05: the chain is grill-with-docs, to-prd, to-issue, tdd.
- pbowyer, https://news.ycombinator.com/item?id=48012581, 2026-05-04: grill-me plus grill-with-docs plus the Plannotator tool. Coding is maybe 2x faster, but working out what's needed is about 5x faster.
- gregwebs, https://news.ycombinator.com/item?id=49297440, 2026-08-14: a thorough spec from grill-with-docs, /code-review against the spec, and an extra detailed plan written by a pricier model.
- gregwebs, https://news.ycombinator.com/item?id=49948336, 2026-10-03: ADRs plus CONTRIBUTING.md and CODING_STANDARDS.md. No documentation written only for agents.
- istjohn, https://news.ycombinator.com/item?id=49948197, 2026-10-03: changes grilling to use AskUserQuestion. Matt has ruled this out of scope (see section 4).
- cg-enterprise, https://news.ycombinator.com/item?id=49737218, 2026-09-17: ADRs go stale.
- ElijahLynn, https://news.ycombinator.com/item?id=48770626, 2026-07-03: Matt now recommends grill-with-docs over grill-me for coding.
- Show HN "barbequeue" (run the skills in bulk while away from the keyboard), https://news.ycombinator.com/item?id=49314342, 2026-08-15.

### D. GitHub Discussions and issues (recurring complaints)
- **Grill-me rounds:** after v1.2, grilling asks several questions per round. Users find it tiring, prefer one at a time, and dislike questions being rephrased mid-round. Discussion #771 (2026-08-05, https://github.com/mattpocock/skills/discussions/771), issue #831 ("old grill-me back", 35 reactions), #895 (dependent questions asked together).
- **Model-specific grilling problems:**
  - #44 "Codex just asked me 200 questions" (2026-04-19).
  - #240: GPT 5.5 starts implementing straight after /grill-me. The reporter's fix is a line saying to wait for permission (2026-05-22).
  - #130: GPT 5.5 uses the glossary file as a running plan (2026-05-04).
  - #578: GPT-5.6-Sol triggers diagnosing-bugs on quick questions (2026-07-15).
- **Gaps in the flow:**
  - #508: /implement never marks tickets done (open, 23 reactions).
  - #835: /implement does not own branches or PRs; it commits to whatever branch you are on (2026-08-11).
  - #217: what happens to a PRD after the work is done. Consensus: throw it away; the glossary and ADRs are the lasting record (2026-05-17).
  - #341: decisions from grilling are not traceable through to the code (open).
  - #847, #822: ADRs that conflict need a lifecycle.
- **Naming and installs:**
  - #483: /code-review clashes with Claude Code's built-in command (43 reactions).
  - #1164 and Discussion #1239: the official plugin was stuck on 1.2.3.
- **Customisation:**
  - #1248: multi-repo setups; install the plugin at user scope and use `/add-dir`.
  - #1296: /implement's full-test-suite run burns through usage limits.

### E. Other third-party YouTube (titles, dates and descriptions only)
| Date | Creator | Title | URL | What it adds |
|---|---|---|---|---|
| 2026-04-11 | AI Coding Daily | I Tried "grill-me" Skill for Plan Mode | https://www.youtube.com/watch?v=rLNLa2dcjG8 | grill-me compared with plan mode |
| 2026-05-27 | AI Coding Daily | I Tried /grill-with-docs | https://www.youtube.com/watch?v=lLiHLkIU_5M | run on a real client brief |
| 2026-05-28 | Ben Holmes | /handoff is the best skill of all time | https://www.youtube.com/watch?v=_WXc3gA8K6E | handoff |
| 2026-06-04 | Chase AI | I Updated /grill-me… | https://www.youtube.com/watch?v=ENCRw5-uJBA | adaptation: a "grill-me-codex" fork where a second model checks the plan |
| 2026-06-13 | The Gray Cat | grill-me + Codex | https://www.youtube.com/watch?v=lpkoIwY612I | Codex reviews the plan from grilling, round after round |
| 2026-06-15 | Kacper Rutkiewicz | I Tried /teach… | https://www.youtube.com/watch?v=lw6Ld1ZgpV8 | /teach used for self-study |
| 2026-07-23 | Branden Immerzeel | …Are They Actually Good? | https://www.youtube.com/watch?v=YebLlHXLWcM | review |
| 2026-08-05 | AI Coding Daily | NEW /grill-me v1.2 | https://www.youtube.com/watch?v=puRP9UmF0nw | v1.2 grilling compared with plan mode |
| 2026-08-12 | Cole Medin | Every Claude Code Skill I Use… | https://www.youtube.com/watch?v=MbiMwgbGdxw | see note below |
| 2026-08-18 | Theo (t3.gg) | So I tried Matt's skills... | https://www.youtube.com/watch?v=0oXOOlqVu5M | covers grill-me/grill-with-docs, wizard, writing-for-agents and wait-what alongside another skill pack (pstack). Tip: try a skill by pasting its markdown before installing (per the summary at https://youtubesummary.com/summary/0oXOOlqVu5M) |
| 2026-09-27 | Seb Moska | Matt Pocock Skills vs Superpowers | https://www.youtube.com/watch?v=RkWlEkPkxXo | Superpowers is always on; Matt's skills mostly wait to be called |
| 2026-10-06 | AI Coding Daily | I Tried /wayfinder | https://www.youtube.com/watch?v=l_WQx_XUsRY | also a members-only /retro video |
| 2026-10-20 | Eric Tech | Matt Pocock's 3 New Skills Close the AI Coding Loop | https://www.youtube.com/watch?v=1MNSJhCGMLY | implement-spec, pr, retro |

**Cole Medin note:** his video is about his own 35-skill set (https://github.com/coleam00/skills, created 2026-08-04), built around a prime, plan, implement, validate, review, commit, PR loop. It does not mention Matt in its README. It is still useful for contrast: a PRD skill that interviews you, a separate spec skill, epics sliced into tickets with a dependency graph, a planning skill where the agent interviews you, and a "why not a framework" stance close to Matt's.

### F. Adaptations people made (summary)
- grill-me/grill-with-docs changed to ask 2–3 questions per round, or one at a time.
- Grilling routed through AskUserQuestion via the user's own CLAUDE.md.
- A one-line "don't implement after grilling" guard.
- A second model (Codex) checks the plan from grilling.
- A looser "ask-me" variant.
- A ui-mockups skill used before writing the spec.
- An outer bash loop that runs /implement per ticket (afk.sh, barbequeue, Hermes sub-agents).
- /improve-codebase-architecture run, scoped, after each build.
- Skills renamed or namespaced to avoid clashes.
- Personal git-tracked copies kept in `~/.claude`.
- A `HANDOFF.md` / "alleyoop.md" file for resuming after clearing context (r/ClaudeAI, https://www.reddit.com/r/ClaudeAI/comments/1uli8as/, 2026-07-02).

---

## 2. Matt's own written material (aihero.dev; posts have `.md` versions)

| Date | Title / URL | Points relevant to teaching |
|---|---|---|
| 2026-10-05 | v1.3 changelog, https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md | Three ways to work through tickets: you looping by hand, a script (recommended, e.g. Sandcastle), or an agent looping (/implement-spec). Known rough edges: the result is one big branch, and worktrees only move collisions to merge time. /pr has three parts: a summary picture, before/after evidence, and merge danger (one-way or two-way door, plus blast radius). /retro: rule-like problems get a lint, hook or CI check, while CODING_STANDARDS.md is kept for judgement calls; don't automate retro. CONTEXT.md becomes GLOSSARY.md (rename it with `git mv` in one team commit). resolving-merge-conflicts removed. Skills now say "call the Skill tool" to invoke each other. |
| 2026-08-05 | v1.2, https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more | Ships as a Claude Code plugin, adds Codex metadata, launches the docs site. Main flow: grill-with-docs → to-spec → to-tickets → implement → code-review. writing-great-skills renamed writing-for-agents, and it now triggers on its own. |
| 2026-07-08 | v1.1, https://www.aihero.dev/skills/skills-changelog-v1-1-wayfinder-to-spec-to-tickets-grilling-improvements | to-prd becomes to-spec ("spec" is now the term used throughout). to-plan and to-issues merge into to-tickets: vertical-slice tickets with blocking edges. Adds wayfinder. |
| 2026-06-18 | v1, https://www.aihero.dev/skills/skills-changelog-v1-announcement | Hiding user-invoked skills from the model's list cut skill-description tokens by 63%. The shared interview loop was pulled out into /grilling. |
| 2026-05-11 | handoff/prototype changelog, https://www.aihero.dev/skills/skills-changelog-handoff-prototype-review-and-writing | Two handoff patterns: fire-and-forget, and a do-it-yourself sub-agent you hand back to. |
| 2026-04-30 | Ubiquitous Language → grill-with-docs, https://www.aihero.dev/skills-changelog-ubiquitous-language-grill-with-docs | Repo split into buckets. grill-with-docs replaces the old ubiquitous-language skill. |
| 2026-05-25 | 9 Things People Get Wrong…, https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs | Low-detail questions can be grilled; questions that need a prototype to answer cannot (grill, then prototype, then grill again via handoff). Keep the scope small; quality drops around 120k tokens. Steer the conversation actively. Never clear context before writing the spec. Grill with big models. Run two grilling sessions in parallel. |
| 2026-03-23 | My 'Grill Me' Skill Went Viral, https://www.aihero.dev/my-grill-me-skill-has-gone-viral | Three sentences plus "give your recommended answer", so you can just say yes. Sessions often run about 45 minutes. Also useful outside coding. |
| 2026-03-16 | 5 Agent Skills I Use Every Day, https://www.aihero.dev/5-agent-skills-i-use-every-day | Agents are capable engineers with no memory, so you need strict process. TDD is the most consistent quality lever. Run architecture review weekly or after a burst of work. |
| 2026-03-16 | My 7 Phases…, https://www.aihero.dev/my-7-phases-of-ai-development | Idea → research → prototype → PRD → kanban board → execution (can run unattended) → QA, looping through the last three. |
| 2026-03-20 | Real-world feature build, https://www.aihero.dev/real-world-feature-build-with-claude-code | Unscripted build on a repo with 1,200+ commits: grill, PRD, issues, Ralph loops, QA loops. |
| 2026-02-26 | How To Make Codebases AI Agents Love, https://www.aihero.dev/how-to-make-codebases-ai-agents-love | The codebase matters more than the prompt. Deep, "grey box" modules. |
| 2026-02-24 | Never Run Claude /init, https://www.aihero.dev/never-run-claude-init | The system prompt is fixed at the start of every session; LLMs have an instruction budget; delete auto-generated CLAUDE.md files. |
| 2026-02-10 | My Skill Makes Claude Code GREAT At TDD, https://www.aihero.dev/skill-test-driven-development-claude-code | Writing all tests first and then all code is the wrong slicing. Tests written in bulk test imagined behaviour. |
| 2026-01-22 | Tracer Bullets, https://www.aihero.dev/tracer-bullets | Small end-to-end slices instead of finished layers. |
| 2026-01-22 | Why the Anthropic Ralph plugin sucks, https://www.aihero.dev/why-the-anthropic-ralph-plugin-sucks | Use a bash loop with fresh context each pass, so the agent stays in the smart zone. |
| 2026-01-18 | A Complete Guide To AGENTS.md, https://www.aihero.dev/a-complete-guide-to-agents-md | AGENTS.md tends to bloat; symlink it to CLAUDE.md. |
| 2026-01-16 | Essential AI Coding Feedback Loops (TypeScript), https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects | Type checking, Vitest, Husky pre-commit hooks, lint-staged with Prettier. |
| 2026-01-09 (with later note) | An Introduction To Plan Mode, https://www.aihero.dev/plan-mode-introduction | A later note at the top says Matt no longer uses plan mode (too few questions, oversized plans) and uses /grill-with-docs instead. |
| 2026-07-07 | How To Kill The Bloat In Claude Code's System Prompt, https://www.aihero.dev/how-to-kill-the-bloat-in-claude-codes-system-prompt | Measure with /context, log requests through a proxy, trim tools and skills. |
| 2026-06-08 | Learn Anything With My /teach Skill, https://www.aihero.dev/learn-anything-with-my-teach-skill | Step-by-step setup for /teach. |
| 2026-09-24 | AI Coding Dictionary, https://www.aihero.dev/ai-coding-dictionary | Smart zone (the "dumb zone" often starts around 125–150K tokens; clear or compact when it does). Also: attention degradation, clearing, handoff, compaction, context pointer, grilling, AFK, human-in-the-loop, design concept, effort, model and harness. |
| 2026-04-25 | X post "Night Shift", https://x.com/mattpocockuk/status/2048159313357598989 (from a search excerpt; page not extractable) | A planner agent picks tickets that are ready, starts sandboxed implementer agents (Sandcastle), then runs one reviewer agent per implementation. |
| 2026-10-06 | SCOPE.md and .out-of-scope/ (in the repo) | Matt's stated policy: no new skills; customise through your own CLAUDE.md or a fork. |

Each skill also has its own docs page (`https://www.aihero.dev/skills-<name>`, mostly 2026-07-07, plus implement-spec, pr and retro on 2026-10-05). Other agents are covering those. I found no public archive of the newsletter.

Two stale spots on aihero:
- https://www.aihero.dev/skills.md still shows `claude plugins install mattpocock-skills` and the old names /to-prd, /to-issues and /domain-model.
- Its "Getting Started" and "The Main Flow" guide links return 404.

---

## 3. Matt's video catalogue (exact publish dates from YouTube metadata)

**Main channel (@mattpocockuk)**
| Date | Title | URL |
|---|---|---|
| 2025-09-19 | Most devs don't understand how LLM tokens work | https://www.youtube.com/watch?v=nKSk_TiR8YA |
| 2025-10-08 | Most devs don't understand what agents are | https://www.youtube.com/watch?v=AtYtuVTZCQU |
| 2025-10-22 | Most devs don't understand how context windows work | https://www.youtube.com/watch?v=-uW5-TaVXu4 |
| 2025-10-27 | How I use Claude Code for real engineering | https://www.youtube.com/watch?v=kZ-zzHVUrO4 |
| 2026-01-05 | Ship working code while you sleep with the Ralph Wiggum technique | https://www.youtube.com/watch?v=_IK18goX4X8 |
| 2026-01-12 | Frontend is HARDER for AI than backend | https://www.youtube.com/watch?v=pSritFeoYFo |
| 2026-01-15 | I was an AI skeptic. Then I tried plan mode | https://www.youtube.com/watch?v=WNx-s-RxVxk |
| 2026-02-21 | I'm using claude --worktree for everything now | https://www.youtube.com/watch?v=yv8VZpov8bk |
| 2026-02-23 | Red Green Refactor is OP With Claude Code (probably the video for "My Skill Makes Claude Code GREAT At TDD") | https://www.youtube.com/watch?v=hYZdIwFIy-c |
| 2026-02-24 | Never Run claude /init | https://www.youtube.com/watch?v=9tmsq-Gvx6g |
| 2026-02-25 | How to actually force Claude Code to use the right CLI | https://www.youtube.com/watch?v=3CSi8QAoN-s |
| 2026-02-26 | Your codebase is NOT ready for AI (same piece as "How To Make Codebases AI Agents Love") | https://www.youtube.com/watch?v=uC44zFz7JSM |
| 2026-03-03 | The 7 phases of AI-driven development (same as "My 7 Phases") | https://www.youtube.com/watch?v=Ah9p7v7nJWg |
| 2026-03-16 | 5 Claude Code skills I use every single day | https://www.youtube.com/watch?v=EJyuu6zlQCg |
| 2026-03-18 | Building a REAL feature with Claude Code: every step explained | https://www.youtube.com/watch?v=hX7yG1KVYhI |
| 2026-03-23 | Claude Code tried to improve /init... | https://www.youtube.com/watch?v=llwTBpPqo9A |
| 2026-03-27 | Never Trust An LLM | https://www.youtube.com/watch?v=9VNG0h4pLh0 |
| 2026-04-29 | How To De-Slop A Codebase Ruined By AI (with one skill) | https://www.youtube.com/watch?v=3MP8D-mdheA |
| 2026-04-30 | I Open-Sourced My Own AFK Software Factory (Sandcastle) | https://www.youtube.com/watch?v=E5-QK3CDVQM |
| 2026-05-07 | Burn through the backlog from hell with /triage (same as "triage: Turn Backlog Mess…") | https://www.youtube.com/watch?v=MzWIIlx0Gpc |
| 2026-05-12 | New Skills! /handoff, /prototype, /review and /writing-* | https://www.youtube.com/watch?v=DNqsMXH6Eog |
| 2026-05-14 | I stopped using /grill-me for coding. Here's what I use instead | https://www.youtube.com/watch?v=6BB6exR8Zd8 |
| 2026-05-21 | /handoff is my new favourite skill | https://www.youtube.com/watch?v=dtAJ2dOd3ko |
| 2026-05-25 | 9 Things People Get Wrong With My /grill-* skills | https://www.youtube.com/watch?v=UzMNBN6xLLA |
| 2026-05-28 | Can Cursor's HARDCORE Review Skill Stop The Slop? | https://www.youtube.com/watch?v=mh5XZ-L5SFQ |
| 2026-06-08 | Learn anything with the /teach skill | https://www.youtube.com/watch?v=s5T5oQJcJ6U |
| 2026-07-08 | New Skills! v1.1 brings /wayfinder, /research, /implement, /to-spec, /to-tickets | https://www.youtube.com/watch?v=A8mokin_YOs |
| 2026-07-16 | mattpocock/skills: A complete AI Coding workflow, end-to-end (has an "Ask Matt" chapter at 6:52) | https://www.youtube.com/watch?v=M6mYodf0dJM |
| 2026-07-23 | Don't waste time on specs: /prototype instead | https://www.youtube.com/watch?v=n0VhIVtviC0 |
| 2026-07-30 | /wayfinder: Nothing is too big to plan anymore | https://www.youtube.com/watch?v=F3lL98Pj90o |
| 2026-08-05 | New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me (includes /wizard) | https://www.youtube.com/watch?v=gaDdrDdczO4 |
| 2026-10-05 | New Skills! v1.3 brings /pr, /implement-spec, and /retro | https://www.youtube.com/watch?v=BsJGo1wFTvQ |

**Livestreams**
- 2026-01-16, Chat with Dex Horthy: https://www.youtube.com/watch?v=NKu3T9FUjmU
- 2026-04-17, Watch me build a brand-new project from scratch: https://www.youtube.com/watch?v=K-mA3MZ_EzU
- 2026-07-13, The /wayfinder Demo: https://www.youtube.com/watch?v=251hsWgoTPM
- 2026-08-19, Uncle Bob on Software Fundamentals: https://www.youtube.com/watch?v=zcLPGC-tvgk
- 2026-10-02, Poteto (pstack) on shipping thousands of PRs: https://www.youtube.com/watch?v=MN9dGgmLyso

**Talks and guest appearances**
- 2026-04-23, "Software Fundamentals Matter More Than Ever" (AI Engineer): https://www.youtube.com/watch?v=v4F1gFy-hqg
- 2026-04-24, "Full Walkthrough: Workflow for AI Coding" (AI Engineer channel, 96 min): https://www.youtube.com/watch?v=-QFHIoCo-Ko
- 2026-06-18, David Ondrej podcast: https://www.youtube.com/watch?v=nQwJVHCtDDY
- 2026-06-29, "Building Great Agent Skills: The Missing Manual" (AI Engineer): https://www.youtube.com/watch?v=UNzCG3lw6O0
- 2026-08-17, The Next New Thing (Andrew Warner): https://www.youtube.com/watch?v=LMpMmOWTtVk
- 2026-09-17, Pragmatic Engineer "AI Skills with Matt Pocock": https://www.youtube.com/watch?v=4DhcSPkEbwI (chapters include smart zone vs dumb zone at 40:46, wayfinder at 45:02, "leading words" at 50:54, TDD and agents at 1:18:13). Shorts on 2026-09-18 (https://www.youtube.com/watch?v=OIulx_R3TLY) and 2026-09-22 (https://www.youtube.com/watch?v=CgQCi8qQ3Fw).
- 2026-09-25, "Fixing the PR Bottleneck" (AI Engineer Paris): https://www.youtube.com/watch?v=LlgiOCmFG_w
- 2026-10-16, Nate Herk interview: https://www.youtube.com/watch?v=Z8lf5oWKfj0 (the description says Matt runs Opus 5.5 on medium effort)

**On aihero only (no YouTube copy found):** "My 'Grill Me' Skill Went Viral" (2026-03-23), "Essential AI Coding Feedback Loops For TypeScript Projects" (2026-01-16), "9 Ways AI Coding Has Rewired My Brain" (2026-03-11).

**No dedicated video found for** /retro, /implement, /diagnosing-bugs, /wizard, /research, /to-questionnaire or /ask-matt. Where they are covered:
- implement and research: the v1.1 video
- wizard: the v1.2 video (to-questionnaire probably too, not confirmed)
- retro: the v1.3 video
- ask-matt: a chapter of M6mYodf0dJM

---

## 4. What changed after v1.3.1

**Baseline:**
- The v1.3.1 tag is commit `24fe0ef`, 2026-10-04.
- `main` is 47 commits ahead, with no new release. The release PR #1161 is waiting to publish these as **1.3.2**, a patch.
- Your local cache equals `main@49dd158` (2026-10-09), apart from one in-progress commit, `5beb35b`.
- The official marketplace was moved to `49dd158` on 2026-10-16 by anthropics/claude-plugins-official#6491. Before that it was stuck on 1.2.3: issue #1164 and https://github.com/mattpocock/skills/discussions/1239.
- No shipped skill was added, renamed or removed; `plugin.json` is unchanged.

**Material changes (all already in your local copy):**

| Change | PR / commit, date | Lessons affected |
|---|---|---|
| Install section rewritten around installs that update themselves. Claude Code is now `claude plugin install mattpocock-skills@claude-plugins-official`; also routes for Codex, Copilot, VS Code and Gemini; skills.sh `-a <agent>`. Setup now offers GitHub, GitLab, local files or anything else. | #1195 `dd400c3` (10-07); #1218 `b0618bc` (10-08) | 3 |
| ask-matt reads a skill's SKILL.md before describing it or suggesting a step be skipped | #1194 `5da500e` (10-07) | 3 |
| setup-matt-pocock-skills: fixes the GitHub external-PR listing; creates missing triage labels; fixes GitLab `glab` commands; reads issues with `--json`. You need to re-run setup to refresh `docs/agents/`. | #1187 (10-06), #1197 `5b7cade` (10-07) | 3, 14 |
| grilling words each question so that "yes" accepts the recommendation | #1193 `95249b0` (10-07) | 4, 5, 18 |
| handoff names the temp directory explicitly (`$TMPDIR`, then `/tmp`, `%TEMP%` on Windows) | #1184 (10-06) | 6 |
| to-tickets makes each ticket a sub-issue of the source issue; drops "Blocked by" when the tracker has native blocking links | #1188 (10-06) | 7, 14 |
| tdd gives each proposed seam a one-line note on what it catches and what it misses | #1192 `3f59913` (10-07) | 8 |
| implement calls tdd and code-review through the Skill tool, and fetches a passed ticket and states its title | #1189 (10-06), #1196 `6d6a5b9` (10-07) | 9 |
| code-review searches the repo for standards files, runs both sub-agents in the foreground, and finds the tracker through the tracker doc | #1208 `3da8c01` (10-07) | 10 (and 9) |
| diagnosing-bugs must diff a forced mutation against a clean copy before trusting a failing test | #1209 `f3fc563` (10-07) | 13 (and 8) |
| wayfinder: no `ready-for-agent` labels, only real issue ids, no PRs from research branches, each ticket resolved by its label type | #1181 `8295b8e` (10-07) | 18 |
| wizard script-template fixes (two batches: input handling, `.env` quoting and symlinks, end-of-input, fallbacks) | #1198 (10-07), #1237 `49dd158` (10-09) | 15 |
| teach writes its workspace to the current directory; quiz answers vary position | #1183 `ad5400b` (10-07) | not in course map |
| SCOPE.md plus `.out-of-scope/` records. Ruled out: new skills, routing grilling through native question tools, renaming to avoid built-in commands (use `/mattpocock-skills:code-review`), guards against sub-agent recursion, lazy-loading writing-for-agents in retro. `misc/` frozen. | #1179 (10-06), #1190, #1240 (10-09) | 3, 4, 10, 17 |
| Every docs page rewritten in plainer English (so quotes from the docs may differ from the tag's text) | #1168 `f6abdeb` (10-05) | all |
| `in-progress/chief-of-staff` added (not shipped in the plugin): long-running goal, sub-agents, wiki memory | `e47c149` (10-05), #1304 `5beb35b` (10-19, not in your copy) | none (19 at most) |

**Still open (not merged), worth watching:**
- #1224 grilling numbers questions across the whole conversation
- #1221 tdd: a bug fix's failing test must reproduce the bug
- #1236 wayfinder
- #1228 setup handles a leftover CONTEXT.md
- #1226 to-tickets
- #1258 improve-codebase-architecture
- #1316 new in-progress `software-factory` skill (2026-10-21)
- Draft #807, which would flatten `skills/`, remove the buckets and change every path

**What the course map misses in v1.3.1:**
- **`teach`** is a promoted productivity skill that ships in the plugin but appears in no Lesson.
- `grill-me` versus `grilling`: Lesson 4 should say grill-me is a thin wrapper that calls grilling. (Discussion #1252 asks why grill-me exists at all.)
- Lesson 11 should note that `resolving-merge-conflicts` was removed in v1.3.0.
- Not shipped and not in the map:
  - `misc/` (git-guardrails-claude-code, setup-pre-commit, migrate-to-shoehorn, scaffold-exercises). These are frozen, but relate to Matt's posts on dangerous git commands and feedback loops.
  - `in-progress/` (chief-of-staff, claude-handoff, loop-me, setup-ts-deep-modules, writing-beats, writing-fragments, writing-shape).

---

## === PER LESSON ===

**0 start-here**
- Scott Logic says the skills suit engineers without structured habits, but don't remove the need for judgement (https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html, 2026-10-19).
- Reddit commenters recommend his videos to beginners, but advise treating the skills as a base and reshaping them (https://www.reddit.com/r/ClaudeCode/comments/1v90akt/, 2026-07-28).
- Matt's framing: agents are memoryless engineers, so process matters (https://www.aihero.dev/5-agent-skills-i-use-every-day, 2026-03-16).
- The most-installed skills generate no features; they enforce discipline (https://dev.to/skillselion/matt-pocock-now-owns-all-8-of-this-weeks-fastest-growing-claude-code-skills-2ae5, 2026-07-26).
- A beginner was confused about branches and PRs after /implement (Discussion #835, 2026-08-11).

**1 how-agents-work**
- Matt's dictionary: the model is stateless and the harness makes it agentic; AFK versus human-in-the-loop (https://www.aihero.dev/ai-coding-dictionary, 2026-09-24).
- Videos: "Most devs don't understand what agents are" (2025-10-08) and "Never Trust An LLM" (2026-03-27).
- Scott Logic frames the implement/review loop as "sensors" that feed back into the agent's work (2026-10-19).
- Little community material is specific to this lesson.

**2 context-window**
- Smart zone: the decline often starts around 125–150K tokens; clear or compact when it does (dictionary, 2026-09-24). The 9-things post says about 120k (2026-05-25). A Reddit user puts it near 100k (https://www.reddit.com/r/vibecoding/comments/1v0zm6n/, 2026-07-19).
- Never run /init: the system prompt is fixed at the start and there is an instruction budget (2026-02-24). Trim bloat with /context and a logging proxy (2026-07-07).
- v1 hid user-invoked skills from the model's list for a 63% token saving (2026-06-18). A user worries that nested skills cost extra round-trips (Discussion #382, 2026-06-26).
- Jawad: quality drops even with million-token windows, so use handoff (2026-05-29).
- Pragmatic Engineer chapter on the smart zone (https://www.youtube.com/watch?v=4DhcSPkEbwI, 2026-09-17).

**3 skills (install, /setup-matt-pocock-skills, /ask-matt)**
- Install wording changed after v1.3.1 (#1195, #1218). The official plugin was stuck on 1.2.3 (#1164; Discussion #1239) until the 2026-10-16 bump.
- Scott Logic used /ask-matt to choose a first step (2026-10-19). ask-matt sometimes reports skills the agent can't see as not installed (#740). After v1.3.1 it reads SKILL.md first.
- Customise through your own CLAUDE.md or a fork; fix name clashes with `/mattpocock-skills:<name>` (SCOPE.md, `.out-of-scope/harness-name-collisions.md`, 2026-10-06).
- Multi-repo: install the plugin at user scope and use `/add-dir` (Discussion #1248, 2026-10-10).
- Theo's tip: try a skill by pasting its markdown before installing (2026-08-18). Keep personal copies in a git-tracked `~/.claude` (Reddit 1un4qn2, 2026-07-04).
- Building Great Agent Skills talk (https://www.youtube.com/watch?v=UNzCG3lw6O0, 2026-06-29).

**4 grilling**
- Matt: grill-me is three sentences plus a recommended answer per question; sessions run 16–50 questions and about 45 minutes (2026-03-16, 2026-03-23).
- 9 things: grill only low-detail questions; keep scope small; steer actively; use big models; run sessions in parallel (2026-05-25).
- Plan mode was replaced by grilling (note on https://www.aihero.dev/plan-mode-introduction).
- The v1.2 multi-question rounds drew a backlash (Discussion #771; #831). People changed it to 1–3 questions per round (r/AskVibecoders 1uzzmkh, 2026-07-18). The "yes accepts the recommendation" fix came after v1.3.1.
- Model problems: Codex asked 200 questions (#44); GPT 5.5 started implementing after grilling, fixed with a guard line (#240).
- Users ask for AskUserQuestion (#850; HN 49948197). Matt rules it out because multiple-choice pickers undermine open answers.
- One user grills anything touching more than two files (r/AskVibecoders, 2026-07-18).

**5 domain-modeling (/grill-with-docs, /wait-what)**
- Scott Logic's run gave a short glossary plus one useful ADR (2026-10-19). Jawad's glossary records why terms were chosen (2026-05-29).
- CONTEXT.md became GLOSSARY.md: rename in one team commit (v1.3, 2026-10-05).
- Conflicting ADRs: make the status line mandatory and put it at the top; supersede rather than edit (Discussion #847, 2026-08-13; #822).
- GPT 5.5 treats the glossary as a running plan (#130). grill-with-docs sometimes failed to load its sub-skills, fixed by "call the Skill tool" (#426).
- For jargon, add a simplified-English instruction (Discussion #994, 2026-08-28). This is the same idea as wait-what (v1.2, 2026-08-05).

**6 prototype (+/handoff)**
- Questions that need a prototype to answer go through handoff: grill, prototype, grill again (2026-05-25). "Don't waste time on specs: /prototype instead" (2026-07-23). v1.2 keeps prototypes as a single HTML file on a `prototype/<name>` branch.
- Handoff patterns: fire-and-forget, and a sub-agent you hand back to (changelog 2026-05-11); handoff versus /compact (https://www.youtube.com/watch?v=dtAJ2dOd3ko, 2026-05-21).
- A Reddit user runs handoff several times a day (1v90akt). Jawad hands off parallel refactors (2026-05-29).
- Earlier temp-file bugs on macOS and Windows (#175, #272) are fixed after v1.3.1. Prototypes used to lose their visuals once deleted (#337).
- Community variants: a HANDOFF.md / "alleyoop.md" resume file (r/ClaudeAI 1uli8as, 2026-07-02); a ui-mockups skill (1v90akt).

**7 spec-and-issues (/to-spec, /to-tickets)**
- Matt: to-spec does not interview; it writes up the conversation with user stories. Tickets are vertical slices with blocking edges (2026-03-16; v1.1 renames, 2026-07-08).
- Scott Logic: user stories for CRUD felt like theatre; he would prefer a data model (2026-10-19).
- to-spec fits product work, not implementation-heavy design (#362). Treat the PRD as throwaway (Discussion #217). Decisions are not traceable end to end (#341).
- Very large specs can get truncated (Discussion #1151). Sub-issue support arrived after v1.3.1 (#1188). Specs made from wayfinder don't link back to the map (Discussion #1278).
- One user calls ticket references left in code comments "slop" (Discussion #217).

**8 tdd**
- Matt: writing all tests first tests imagined behaviour; tests should come one slice at a time (2026-02-10); TDD is the most consistent quality lever (2026-03-16). Seam notes added after v1.3.1.
- Scott Logic: the tests mostly checked mocks and repeated themselves (2026-10-19).
- Expensive but effective, so some save it for tickets that need heavy validation (r/AskVibecoders, 2026-07-18).
- Headless runs never called tdd until the skill was named in full (Discussions #1091 and #1136).
- The full-suite run burns usage (Discussion #1296).

**9 implement (/implement, /implement-spec)**
- Matt's three loops; the script-driven loop is recommended; one-big-branch caveat (v1.3, 2026-10-05). Night Shift planner/implementer/reviewer setup (X, 2026-04-25).
- Gaps: no step that closes the ticket (#508); review runs before the commit and skills are called by bare names (#1091); branches and PRs are left to you (#835).
- One user found sub-agents orchestrated around /implement beat /implement-spec (Discussion #1289, 2026-10-16).
- Outer loops: afk.sh did 10 tickets for $20.40 (Discussion #1136); barbequeue (HN 49314342); Hermes sub-agents (r/hermesagent, 2026-04-29).
- One setup plans with Opus and implements with Sonnet (1v90akt).

**10 code-review**
- Two axes, Standards and Spec, with a baseline of classic code smells. Both caught bugs in Scott Logic's run (2026-10-19).
- Name clash with the built-in command (#483, 43 reactions). Use the namespaced name. In afk.sh's sessions the built-in ran twice as often as the plugin's (Discussion #1136).
- After v1.3.1: searches for standards files and runs sub-agents in the foreground (#1208). implement and code-review disagree about uncommitted changes (#511).
- Review code against the spec, and post the plan's context on the PR (HN 49297440, 2026-08-14).
- Matt reviewed Cursor's hardcore review skill (https://www.youtube.com/watch?v=mh5XZ-L5SFQ, 2026-05-28).

**11 pr-and-ship (/pr)**
- /pr has summary, evidence and merge-danger sections; Matt says it loads reliably on Opus 5.5 (v1.3, 2026-10-05).
- PR Bottleneck talk: treat agent experience (AX) with the rigour developer experience (DX) got (https://www.youtube.com/watch?v=LlgiOCmFG_w, 2026-09-25).
- /pr only writes the PR body; it does not push or open the PR (Discussion #835 reply, 2026-10-06). A proposed /to-pr skill was closed (#938).
- resolving-merge-conflicts was removed in v1.3.0 because conflicts are the harness's job.
- Eric Tech video on implement-spec, pr and retro (2026-10-20).

**12 main-flow**
- How the flow evolved: 7 phases (2026-03-16) → v1.2 main flow → v1.3 back half of implement-spec, pr and retro.
- Real-world build with Ralph loops and QA loops (https://www.youtube.com/watch?v=hX7yG1KVYhI, 2026-03-18). Full workshop (https://www.youtube.com/watch?v=-QFHIoCo-Ko, 2026-04-24).
- Community chains match: grill, then spec, then tickets, then TDD, then review (https://knightli.com/en/2026/05/15/matt-pocock-skills-ai-engineering-workflow, 2026-05-15; HN 48419097).
- One Reddit user adds ADRs and a grilled plan (1u6vh4c).
- The flow remains an open question for some users (#23). The Hype Kevin walks it end to end (2026-10-09).

**13 diagnosing-bugs**
- Over-triggers on quick questions with some models (#578). The docs page acknowledges this.
- After v1.3.1, a forced mutation must be proven with a diff (#1209). v1.2.3 added redacting secrets. v1.3.1 points to /retro after a fix.
- Bug-hunting sub-agents, then triage into issues (Reddit 1vgtqpy, 2026-08-06).
- A review highlights it as the skill that most reflects real work (https://dev.to/yimtheppariyapol/mattpocockskills-review-a-real-engineers-claude-160k-stars-4d3f, July 2026).

**14 triage**
- Matt's triage video: a state machine driven by labels (https://www.youtube.com/watch?v=MzWIIlx0Gpc, 2026-05-07). Matt's own repo uses a `needs-info` label and closes after 14 days (SCOPE.md).
- Community: issues turned into `ready-for-agent`, then an AFK loop (Discussion #1136); batches of sub-agent bug reports, then triage (1vgtqpy).
- Missing labels (#616) are created by setup after v1.3.1. Users asked for a "blocked" state (#139) and for a place to park dormant defects (#289).

**15 wizard**
- Scott Logic: the script fell apart on an outdated Supabase dashboard and had no escape hatch (2026-10-19).
- A user asked for PowerShell output (#954). Many template bugs were fixed after v1.3.1 (#1198, #1237). The time estimate was removed in v1.2.3.
- Covered in Theo's video (2026-08-18) and Matt's v1.2 video.

**16 architecture (/codebase-design, /improve-codebase-architecture)**
- Matt: deep modules (2026-02-26); de-slop video (2026-04-29); run weekly; "garbage codebase, garbage output" (2026-03-16). "Software Fundamentals" talk (2026-04-23).
- Community: a key skill (1v90akt); run scoped after each build (1vgtqpy).
- Counter-evidence: an A/B test showed no gain over a plain prompt (Discussion #1247).
- The docs page reports complaints that grilling crowds out the report, and that the report breaks offline because it loads from CDNs.
- codebase-design gets run as if it were a session driver rather than a reference (#449).

**17 retro (+/writing-for-agents)**
- Matt: retro checks seven places; rule-like problems get a check; don't automate retro; AGENTS.md should shrink over time (v1.3, 2026-10-05). The skills talk covers pruning no-ops and "leading words" (2026-06-29). Related: Never run /init (2026-02-24) and the AGENTS.md guide (2026-01-18).
- Community: retro forgets to commit its changes (#1311); request to store already-reviewed sessions (Discussion #1286). Lazy-loading writing-for-agents was ruled out (#1240).
- Pruning no-ops discussed in the Andrew Warner interview (2026-08-17). Write post-mortems into files the next session loads (r/ClaudeAI 1uli8as).

**18 wayfinder (+/research, /to-questionnaire)**
- Matt: wayfinder video (2026-07-30) and live demo (2026-07-13); "decision tickets"; research tickets burned down by parallel sub-agents (v1.2).
- Cost evidence: 107.7M tokens and about $87 for one run (The Gray Cat, 2026-08-27).
- Mixed reception: awkward and needs babysitting (Discussion #484); a beautiful planner that is unclear afterwards; pivots handled by superseding tickets (Discussion #821; Reddit 1vjijgx).
- Bugs: tasks bypassed the implement flow (#931); wayfinder skips domain-modeling (#556). Fixes landed after v1.3.1 (#1181).
- research: over-triggers (#995); agents spawning agents without limit (#530), now ruled the harness's problem.
- to-questionnaire: nothing found beyond a closed proposal for an HTML questionnaire mode (#1152).

**19 models-effort-ultracode**
- Matt runs Opus 5.5 at medium effort (Nate Herk interview, https://www.youtube.com/watch?v=Z8lf5oWKfj0, 2026-10-16). Use big models for grilling (2026-05-25). Dictionary entries on effort and model tiers (2026-09-24).
- One user's split: Opus 5 at medium for grilling, Sonnet 5 at medium for implementing (1v90akt). In the A/B test, sub-agents chose Sonnet 5.5 for exploration on their own (Discussion #1247).
- Model-specific failures: #44 (Codex), #240 and #130 (GPT 5.5), #578 (GPT-5.6-Sol). Weaker models skip the architecture report and go straight to grilling (docs page). Someone asked to retune wording written for older models (Discussion #1212).
- "Ultracode": nothing from Matt. An HN commenter uses it alongside grill-with-docs (https://news.ycombinator.com/item?id=48769855, 2026-07-03).

**teach (not in the course map)**
- Matt's post (2026-06-08) and video (2026-06-08). Kacper Rutkiewicz used it to learn about open models (2026-06-15).
- The quiz "longest answer is right" giveaway (#316) and the wrong-directory bug (#377) were fixed; more fixes after v1.3.1.