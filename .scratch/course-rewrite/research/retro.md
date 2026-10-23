# Research: Lesson 17 `retro` (/retro + /writing-for-agents: improving the agent's environment)

Everything was read on 2026-10-23.

## Source map

| ID | Source | Published / updated | What it covers | Timestamps used |
|---|---|---|---|---|
| R1 | Local `skills/engineering/retro/SKILL.md` | 1.3.1 cache | Steps, seven categories, implementation vs review, which file is for what | n/a |
| R2 | Local `skills/productivity/writing-for-agents/SKILL.md` | 1.3.1 | Context pointers, the two loads, information hierarchy, completion criteria, leading words, negation, pruning | n/a |
| R3 | Local `writing-for-agents/SKILL-MECHANICS.md` | 1.3.1 | Model- vs user-invoked, splitting by invocation, router Skills | n/a |
| R4 | Local `CHANGELOG.md` + tag dates (v1.2.0 2026-08-05, v1.2.2 2026-08-05, v1.3.0 2026-09-29) | n/a | retro graduated in 1.3.0; writing-for-agents renamed in 1.2.0; Codex fix in 1.2.2 | n/a |
| R5 | Local `ask-matt/SKILL.md` (Main flow step 4, Context hygiene, diagnosing-bugs on-ramp) | 1.3.1 | Where retro sits; run it before `/clear` | n/a |
| R6 | GitHub `main`: `.out-of-scope/lazy-load-writing-for-agents.md` (commit `8267225`, 2026-10-09) + diff check | 2026-10-23 | retro always loads writing-for-agents | n/a |
| R7 | https://www.aihero.dev/skills-retro | updated 2026-10-05 | Docs page: findings table, common questions, it's working if | n/a |
| R8 | https://www.aihero.dev/skills-writing-for-agents | updated 2026-08-24 | Docs page: levers, common questions, it's working if | n/a |
| R9 | YouTube "Never Run claude /init", https://www.youtube.com/watch?v=9tmsq-Gvx6g | 2026-02-24 (10:37) | What belongs in CLAUDE.md/AGENTS.md | 0:00, 0:33, 1:06, 1:41, 2:13, 2:49, 3:22, 3:54, 4:27, 5:01, 5:36, 6:09, 7:15, 7:48, 8:21, 8:54, 9:27, 10:01 |
| R10 | Article "Never Run Claude /init", https://www.aihero.dev/never-run-claude-init | updated 2026-02-24 | Written version of R9 | n/a |
| R11 | Matt on X, "Prompt of the day" (/retro on the last 10 sessions), https://x.com/mattpocockuk/status/2105951409887949107 | 2026-10-02 | How Matt uses retro | n/a |
| R12 | aihero dictionary: Context pointer, AGENTS.md, Environment, https://www.aihero.dev/ai-coding-dictionary/context-pointer (also `/agents-md`, `/environment`) | 2026-09-24 | Definitions | n/a |
| R13 | BigGo Finance, report on Matt's talk "Building Great Agent Skills: The Missing Manual", http://finance.biggo.com/news/e88eeef727a29496 | 2026-06-29 | Secondary summary: trigger / structure / steering / pruning checklist | n/a |
| R14 | Repo: `CLAUDE.md`, `AGENTS.md`, `docs/agents/*.md`, `package.json`, `node_modules/next/dist/server/lib/generate-agent-files.js`; no `.github/` and no `.husky/` | n/a | The site's real steering files and guardrails | n/a |
| R15 | The author's Claude Code session log, lines 11 and 99 (2026-10-21T05:56–05:57Z) | 2026-10-21 | `/setup-matt-pocock-skills` writes CLAUDE.md and the docs/agents files | n/a |
| R16 | Session log `8230810b-…jsonl`, line 3176 (2026-10-21T09:41:44Z) | 2026-10-21 | Built-in `/code-review max` found 10 bugs in the one untested module | n/a |
| R17 | git: `4f849b9` (2026-10-21) created CLAUDE.md and AGENTS.md; no later edits | n/a | Steering file history | n/a |
| R18 | Gergely Orosz / Pragmatic Engineer, "AI Skills with Matt Pocock", https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock | 2026-09-17 | Leading words from classic books (background) | n/a |

## Key facts (pinned to v1.3.1)

**/retro**
- **User-invoked** (`disable-model-invocation: true`). Only you can start it by typing `/retro`. [R1, R7]
- The description is one line: run a retrospective on a coding session. [R1]
- Graduated from in-progress in 1.3.0 (2026-09-29). It's the **last step of the Main flow**, after `/code-review`. [R4, R5]

How it works [R1]:
1. Loads the `writing-for-agents` Skill as its style guide. It does this **every run**, even when it only reports, because it needs that Skill's definitions of a no-op and of a good Skill to judge steering files. A request to load it only when writing was turned down. [R6]
2. Reads the primary sources for the session you name, which may mean searching session logs on the machine. It defaults to the current session.
   - On this machine, Claude Code's logs are `~/.claude/projects/<encoded-path>/<session-id>.jsonl` (observed). [R15]
3. Looks for candidates in seven categories, each with a "use when":
   - **Navigation**: add a navigation pointer when finding information took too long.
   - **Automated checks**: lint, types, tests, filesystem linters. It reads the repo's existing check scripts and CI first, so a check that exists but isn't wired up is the finding. A repo with **no guardrail** (no pre-commit hook and no CI job running lint/typecheck/test) is a finding in itself.
   - **Coding standards**: should the reviewer agent get a new rule, or lose or clarify one? It sorts each violation first:
     - **Mechanical** (a fixed syntax pattern, a banned API, an import shape, a file-location rule) gets a deterministic check: a custom lint rule, a pre-commit hook or a CI job. The default is to build the check rather than write the rule.
     - **Judgement calls** go in `CODING_STANDARDS.md`.
   - **Global AGENTS.md**: move steering out into standards or checks when the file is large, in the repo or in your global scope.
   - **Tool economy**: expensive or token-hungry tool calls, CLIs or MCPs.
   - **No-ops**: steering lines that don't change behaviour.
   - **Information access**: e.g. tee the dev server log to a file, give read-only access to a service.
4. Presents the candidates **most severe first**.

It only proposes; nothing changes until you pick. [R7]

Reference ideas [R1]:
- **Implementation vs review.** The implementing agent has the most context pressure (exploring, coding, debugging). The reviewer gets a diff. So the **reviewer** enforces coding standards, not the implementer.
- **Which file is for what**:
  - `CLAUDE.md` / `AGENTS.md`: loaded into every agent's context, so use them very sparingly, usually only for navigation pointers.
  - `CODING_STANDARDS.md`: read during review. Add pointers to docs folders once it passes about 1,000 lines.
  - Docs: reference files that other files point to. Look for an existing doc first.
  - Skills: for docs (their description sits in context) or for user-invoked commands.

**Not to be confused with:**
- `/code-review` gives a verdict on the code. [R7]
- `/improve-codebase-architecture` improves the code; retro improves the environment around it, and its input is a session history. [R7]
- retro isn't a memory system: it changes the environment so the mistake can't happen again. [R7]
- No Skill ships `CODING_STANDARDS.md`. retro proposes creating it the first time it finds a judgement-call rule, and `/code-review` reads it afterwards. [R7]

**/writing-for-agents**
- **Model-invoked.** It fires when you create or edit a Skill or change AGENTS.md / CLAUDE.md, and you can type `/writing-for-agents`. [R2, R8]
- Renamed from `writing-great-skills` in 1.2.0 (2026-08-05), with no alias. It moved to the Model-invoked list in 1.2.2. [R4]

Core ideas (R2, paraphrased):
- **Context pointer**: a line held in context that names material outside it and says when to reach for it. A Skill's description is one; a line in AGENTS.md naming a doc is the same thing. **The wording decides how reliably the agent follows it, not the target.** Rules: put the key word first, one trigger per branch, cut identity the body already carries.
- **Two loads**:
  - *Context load* is the cost of always-loaded material on the agent's window.
  - *Cognitive load* is the cost on you of remembering what exists. You are the index; spend that load where your judgement matters.
- **Information hierarchy**: in-file step, then in-file reference, then disclosed reference behind a pointer.
  - **Progressive disclosure** moves material down that ladder.
  - **Co-location** keeps one concept's material together.
  - **Sprawl** is the failure: a document simply too long.
- **Completion criteria**: each step needs a clear, demanding "done" condition, to resist **premature completion**.
- **When to split**: by sequence, or (for Skills) by invocation.
- **Leading words**: a compact concept the model already knows (*tight*, *red*, *fog of war*, *tracer bullet*) that anchors behaviour in very few tokens.
  - **Negation** backfires: a ban puts the forbidden idea in front of the model. State the behaviour you want instead.
- **Pruning**:
  - Keep a single source of truth.
  - Restating the environment (package.json scripts, config files, `--help` output) is a **cache**. Only cache what the agent can't find by looking: unwritten conventions, the reason behind a choice, gotchas.
  - Check every line for relevance, or stale layers pile up as **sediment**.
  - Hunt **no-ops** sentence by sentence: does this line change behaviour compared with the default? If not, delete the whole sentence.

SKILL-MECHANICS (R3):
- A model-invoked Skill keeps a description, a permanent context load that buys discoverability. Other Skills can reach it, and you can still type it.
- A user-invoked Skill has `disable-model-invocation: true` and costs no context load, but only you can start it and no other Skill can call it.
- Pick model-invocation only when the agent or another Skill has to reach the Skill on its own.
- A **router Skill** (like `/ask-matt`) cures the pile-up of user-invoked Skills you'd otherwise have to remember. It can only hint, never fire them.

**Matt on steering files** [R9, R10]:
- **Never run `/init`** (a Built-in command). Delete auto-generated CLAUDE.md/AGENTS.md files: they burn tokens, distract the agent and go stale. [R9 0:00]
- He cites a paper finding that unnecessary context-file requirements make tasks harder (arXiv 2602.11988). [R9 0:33; R10]
- The context window splits into phases: system prompt (fixed at the start, and it includes CLAUDE.md), exploration, implementation, testing. Only the system prompt can't flex. [R9 1:41, 2:13, 2:49]
- **Globality problem**: a rule added for frontend sessions costs every backend or docs session too. [R9 3:22, 3:54]
- What `/init` generates is trivially discoverable or goes stale: command lists (read package.json), architecture notes (read the config), file and service references (rot as soon as you rename). The file system is the documentation. [R9 4:27, 5:01, 5:36, 6:09]
- **Instruction budget**: roughly 300–400 instructions, at most about 500 on bigger models. [R9 7:15, 7:48]
- General steering preferences belong in Skills. [R9 8:21]
- His only CLAUDE.md line says he's on WSL on Windows, which is undiscoverable and globally relevant. [R9 8:54]
- Trust the agent's explore step. [R9 10:01]
- Short quote, R10: "Keep CLAUDE.md nearly empty."

**Main flow link**
- ask-matt step 4: `/retro` closes the loop after a build, especially one that went sideways. Mechanical mistakes become checks; judgement calls become coding standards. [R5]
- Run it in the session it's looking back on, before `/clear`. After clearing, point it at that session's log. [R5]
- After `/diagnosing-bugs` fixes a bug, run `/retro` in the same session to ask what would have prevented it. [R5]

**When not to use it**
- After a smooth session: little to learn. [R7]
- For a verdict on code: use `/code-review`. [R7]
- When you just want a repeat mistake remembered: that's a check or a standard, not a CLAUDE.md line. [R7]

### Newer on GitHub main
- **No differences.** `retro/SKILL.md`, `writing-for-agents/SKILL.md` and `SKILL-MECHANICS.md` match both `main` and tag `v1.3.1`. [R6]
- **New on main since 1.3.1 (a scope document, not a code change):** "retro always loads writing-for-agents" is now formally settled (2026-10-09). [R6]
- **Relevant unreleased changeset:** `/code-review` will search the repo for standards files and always hand `CODING_STANDARDS.md` / `CONTRIBUTING.md` to the Standards reviewer. That's the reviewer retro most often tunes. Not yet in a release. [GitHub `main` `.changeset/code-review-standards-and-subagents.md`, read 2026-10-23]
- **aihero vs Skill tension**:
  - The dictionary's AGENTS.md entry says build and test commands are suitable content. [R12]
  - Matt's `/init` video says command lists are trivially discoverable. [R9 4:27]
  - writing-for-agents settles it: restating the environment is a cache, worth keeping only when the lookup is expensive. [R2]

## Day-to-day usage

**Matt**
- Prompt of the day (2026-10-02): run `/retro` across his last 10 sessions, looking for where agents took too long to find information or relied on out-of-date docs. He calls better navigation an underrated token saver. [R11]
- Keeps CLAUDE.md to one line, uses Skills for steering, and trusts the explore step. [R9 8:21, 8:54, 10:01]
- Runs retro in the same session before clearing. [R5]
- Hunts for "leading words" in classic engineering books (tracer bullet and so on). [R18]

**Others** [R7, R8]
- Some users run retro after every implementation run. aihero says a smooth session mostly produces rules nobody needed.
- Throw out any candidate you can't trace to a specific moment, and treat the severity order as a first draft.
- Prune checks yourself: retro doesn't audit the lint rules it proposed last month. A rule that fires constantly on good code is the sign to remove it.
- Try a proposed check against the repo before letting it block merges. There's no dry-run mode.
- With writing-for-agents: let the agent draft, then use the reference to review. Most of the value is in the review pass.
- Generalise a Skill on purpose, rather than writing it up from a single run.

## Common mistakes
1. **Adding a CLAUDE.md line every time the agent repeats a mistake.** retro pushes back on this more than anything: use a check for mechanical mistakes and a standard for judgement calls. [R7, R1]
2. **Running `/init`**, or keeping an auto-generated CLAUDE.md. [R9, R10]
3. **Accepting generic advice.** One user noticed that after a session the AI forgets the middle struggles and invents generic tips to fill the categories. Every candidate must come from the session record. [R7]
4. **Running it after `/clear`** without pointing it at the old log. The struggles are gone. [R5, R7]
5. **Inventing a check that already exists** but isn't wired up. Wire the existing one. [R1, R7]
6. **Expecting retro to prune checks.** It only sees one session. [R7]
7. **Asking an agent to "streamline" a doc.** It optimises for length and cuts behaviour. Use the no-op test instead. [R8]
8. **Steering by prohibition** ("don't X"), which makes X more likely. [R2]
9. **Weak pointer wording**, so the agent never follows the pointer to material it needed. [R2, R12]
10. **Making a Skill model-invoked** when only you ever start it. That pays context load for nothing. [R3]

## Try it yourself (about 15–20 minutes)
**Part A, read the steering files like an agent (5 min).** Type exactly:
`Using the writing-for-agents Skill, review CLAUDE.md and AGENTS.md in this repo. For each line, tell me whether it's a context pointer, a no-op, or something else. Don't edit anything.`

**Part B, run a retro (10–15 min).**
- At the end of any real session (for example, right after the Lesson 16 exercise, before `/clear`), type `/retro`.
- Or, in a new session, adapt Matt's prompt: `/retro read my last session in this repo and find where the agent took too long to find information, or made a mistake an automated check could have caught.`
- Pick at most one candidate, and build it later on its own branch through the Main flow.

It's working if:
- [ ] Part A labels most CLAUDE.md lines as pointers to `docs/agents/*.md`, and says the AGENTS.md block is written by `next dev` (so deleting it just brings it back).
- [ ] Part A changed no files.
- [ ] Every retro candidate points to a specific moment in the session.
- [ ] Candidates are ordered most severe first, and nothing changed until you chose.
- [ ] A mechanical mistake is offered as a check that fails, not as a new CLAUDE.md line.
- [ ] If it applies, it mentions that this repo has no CI job or pre-commit hook running `npm run lint` / `npm test` (there's no `.github/` or `.husky/`). That's the "no guardrail" finding.
- [ ] Nothing it suggests makes CLAUDE.md longer.

## Site story
**Real:**
- **Who wrote the steering files.** `CLAUDE.md` was written by `/setup-matt-pocock-skills` at 2026-10-21T05:57Z. It holds the "Agent skills" block pointing to `docs/agents/issue-tracker.md`, `triage-labels.md` and `domain.md`. A two-line Next.js pointer was added before the scaffold commit `4f849b9`. [R15, R17, R14]
  - It's 17 lines and almost all pointers, which is the shape retro recommends. Neither file has changed since `4f849b9`.
  - `AGENTS.md` is a Next.js-managed block that `next dev` writes and re-adds, as `generate-agent-files.js` confirms. [R14]
- **No guardrail.** There's no CI workflow or pre-commit hook. `package.json` has `lint` and `test` scripts, but nothing runs them automatically. [R14]
- **Real friction a retro could have caught.** On 2026-10-21 the built-in `/code-review max` found 10 user-facing bugs in the comment box (`discussion.tsx`). The agent pointed out that this was the one part left untested, by agreement during `/tdd`. [R16]

**Not used:** `/retro` and `/writing-for-agents` were never run in this repo (no log entries). Suggested worked example:
- Run `/retro` pointed at the v1 build session `8230810b-…` or the PR #9 session, and write the "How I used it" box from the real output.
- Alternatively, run the Part A prompt on CLAUDE.md.


## Candidate quiz questions
1. **Across three sessions the agent ran `npm install` in a repo that uses pnpm. What would /retro most likely propose?**
   - A) An automated check that fails on the wrong package manager ✔
   - B) A line in CLAUDE.md
   - C) A rule in CODING_STANDARDS.md
   - D) A memory note

   *Why:* mechanical mistakes get deterministic checks. *Source:* R1, R7
2. **The agent needed 20 tool calls to find where Lesson photos are credited. Which fix fits?**
   - A) A navigation pointer from a file it already reads ✔
   - B) A bigger model
   - C) A coding-standards rule
   - D) Deleting CLAUDE.md

   *Source:* R1, R7
3. **Where does a judgement-call rule like "match the surrounding Lesson style" belong?**
   - A) CODING_STANDARDS.md, read by the reviewer during /code-review ✔
   - B) CLAUDE.md
   - C) A pre-commit hook
   - D) GLOSSARY.md

   *Source:* R1, R7
4. **Why should the reviewer enforce standards rather than the implementer?**
   - A) The implementer has the most context pressure; the reviewer only gets a diff ✔
   - B) The reviewer is always a smarter model
   - C) The implementer can't read files
   - D) Standards must stay hidden from the implementer

   *Source:* R1
5. **When does /retro work best?**
   - A) In the session it's looking back on, before /clear (or pointed at that session's log afterwards) ✔
   - B) At the start of a new project
   - C) Only after /compact
   - D) Before grilling

   *Source:* R5, R7
6. **Your package.json has `lint` and `test`, but no CI job or pre-commit hook runs them. What does /retro say?**
   - A) The missing guardrail is a finding; wire up the existing checks ✔
   - B) It's a neutral default
   - C) Delete the scripts
   - D) Add the commands to CLAUDE.md

   *Source:* R1, R7
7. **Who can start /retro?**
   - A) Only you, by typing it ✔
   - B) The agent, at the end of every session
   - C) /code-review
   - D) /implement

   *Why:* `disable-model-invocation: true`. *Source:* R1, R3
8. **What does /retro always load first, even when it only reports?**
   - A) writing-for-agents, its yardstick for judging steering files ✔
   - B) GLOSSARY.md
   - C) codebase-design
   - D) The issue-tracker doc

   *Source:* R1, R6
9. **CLAUDE.md contains "Write clean, readable code." What does writing-for-agents tell you to do?**
   - A) Apply the no-op test; if the line doesn't change behaviour, delete the whole sentence ✔
   - B) Make it bold
   - C) Move it to the top
   - D) Repeat it in AGENTS.md for emphasis

   *Source:* R2
10. **What's Matt's advice about Claude Code's `/init` Built-in command?**
    - A) Don't run it; keep CLAUDE.md to lines that are undiscoverable and globally relevant ✔
    - B) Run it once and never edit the result
    - C) Run it every session
    - D) Run it and copy the output into AGENTS.md

    *Source:* R9 0:00, 8:54

## Open questions / uncertain
- I didn't fetch "Building Great Agent Skills: The Missing Manual" (AI Engineer) or "New Skills! v1.2 brings /wait-what, /writing-for-agents…"; R13 is only a secondary summary of the talk.
- The arXiv paper cited in R9/R10 wasn't read.
- The 300–500 instruction budget is Matt's estimate, not a published measurement.
- R9's transcript is auto-generated: "claw.md" means CLAUDE.md.
- In Claude Code, whether `/retro` can find the logs of a different worktree's session isn't documented; I only observed the log location.
