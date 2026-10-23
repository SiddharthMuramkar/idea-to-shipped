# Writing guide for the 20 Lessons

Read this with `contract-v1.md` (the block syntax and lint rules) and the pilot Lesson, `grilling`, which is the exemplar for voice, depth and structure. Facts come from `research/<slug>.md`, checked against the SKILL.md files.

## The course

| # | File | Slug | Title | Part | Teaches |
|---|---|---|---|---|---|
| 0 | `00-start-here.md` | start-here | Start here | 1 | What the course is, who it's for, what to install, how to read a Lesson, the 4 Parts, a `/teach` tip |
| 1 | `01-how-agents-work.md` | how-agents-work | How coding agents work | 1 | Model + harness, the agent loop, tools, permission modes, plan mode, CLAUDE.md, checkpoints |
| 2 | `02-context-window.md` | context-window | The context window | 1 | Tokens, what fills the window, Smart zone, `/context` `/clear` `/compact`, subagents, phase boundaries, `/handoff` |
| 3 | `03-skills.md` | skills | Skills | 1 | What a Skill is, user- vs model-invoked, installing Matt's Skills, `/setup-matt-pocock-skills`, `/ask-matt`, name clashes |
| 4 | `04-grilling.md` | grilling | Grilling | 2 | `/grill-me`, `/grilling` |
| 5 | `05-domain-modeling.md` | domain-modeling | Domain modeling | 2 | `/grill-with-docs`, `/domain-modeling`, GLOSSARY.md, ADRs, `/wait-what` |
| 6 | `06-prototype.md` | prototype | Prototype | 2 | `/prototype` (logic and UI branches), `/handoff` out and back |
| 7 | `07-spec-and-issues.md` | spec-and-issues | Spec + tickets | 2 | `/to-spec`, `/to-tickets`, tracer bullets, blocking edges, the local tracker |
| 8 | `08-tdd.md` | tdd | TDD | 2 | `/tdd`: seams, red → green, good and bad tests, mocking at boundaries |
| 9 | `09-implement.md` | implement | Implement | 2 | `/implement`, `/implement-spec`, human-in-the-loop vs AFK |
| 10 | `10-code-review.md` | code-review | Code review | 2 | `/code-review` (Standards + Spec), the Built-in `/code-review` clash |
| 11 | `11-pr-and-ship.md` | pr-and-ship | PR + ship | 2 | `/pr` (Summary, Evidence, Merge Danger), branch → preview → merge |
| 12 | `12-main-flow.md` | main-flow | The main flow | 2 | Capstone map: forks, context hygiene, who types what, on-ramps |
| 13 | `13-diagnosing-bugs.md` | diagnosing-bugs | Diagnosing bugs | 3 | `/diagnosing-bugs`: the tight feedback loop and its gated phases |
| 14 | `14-triage.md` | triage | Triage | 3 | `/triage`: roles, agent briefs, `.out-of-scope/` |
| 15 | `15-wizard.md` | wizard | Wizard | 3 | `/wizard`: bash wizards for human-only steps |
| 16 | `16-architecture.md` | architecture | Architecture | 4 | `/codebase-design` vocabulary, `/improve-codebase-architecture` survey |
| 17 | `17-retro.md` | retro | Retro | 4 | `/retro`, `/writing-for-agents`, steering files |
| 18 | `18-wayfinder.md` | wayfinder | Wayfinder | 4 | `/wayfinder`, `/research`, `/to-questionnaire` |
| 19 | `19-models-effort-ultracode.md` | models-effort-ultracode | Models, effort & ultracode | 4 | Models and aliases, effort levels, ultracode, fast mode, `/code-review ultra` |

Link to another Lesson by its title: `[The context window](/learn/context-window)`. Never write "Lesson 7" or "the next Lesson" by number. "Part 4" is fine.

## Voice

- Second person for the reader ("you"), plain words, short sentences, British spelling is fine but be consistent within a Lesson (the pilot uses "colours", "summarise").
- First person ("I") only inside the `site-story` box, where the author speaks.
- Teach from zero. Explain every term at or before first use, in a clause, not a footnote: "a sub-agent (a helper agent with its own fresh memory)". Earlier Lessons may be linked, but a reader landing here cold should still follow.
- Concrete over abstract: use this site (the comment box, Lessons, Slugs, Neon branches) as the running example wherever it fits.
- No hype, no filler intros ("In this Lesson we will…"). Open with the one-line promise.
- `==highlight==` 1–3 per section, on the phrase you'd want remembered.

## Shape (in this order, adjust headings to the topic)

1. One-line promise (first paragraph, before `goals`).
2. `goals`: 3–4 "You'll be able to <verb>…" items, each checkable by the Final test.
3. `## Why it matters`: the failure the Skill fixes, made concrete.
4. `## The idea`: the mental model in plain words, ending with a Scene if it helps.
5. `## A session, step by step` (or similar): a Scene of a real or illustrative session. Label invented ones "(illustrative)" in the title. The Scene must match how the Skill behaves in 1.3.1.
6. Your part / how to steer it / when to reach for it and when not.
7. `## How Matt and others use it`: cited habits (say when and where: "in his July 2026 walkthrough"), then other developers.
8. `## Try it yourself`: a `try` block with the exact prompt in a fenced `text` block, numbered steps, and an "It's working if:" checklist. Use four backticks for the `try` fence whenever it contains a code fence. Assume only: Claude Code installed, Matt's Skills installed, a terminal. Give the install command where needed.
9. `## Common mistakes`: bullets, bold lead-in.
10. `site-story` block (required for the 12 original Slugs).
11. `## Cheat sheet`: a short table or list.
12. `## Final test` heading, then the contiguous `test` fences, then `sources`.

3–5 Checkpoints, each right after the section it checks. 1–3 Scenes (at most one per `##` section).

## Questions

- Checkpoints check the section just read; the Final test checks the goals. Don't reuse a Checkpoint as a Final test question.
- Final test: 8–10 questions (Start here 5–6, The main flow up to 15). Id prefixes: at least 3 `scenario-`, 2 `spot-`, 1 `sequence-` (Start here is exempt). Other ids (`why-…`, `predict-…`) are free.
- One unambiguous right answer from what the Lesson teaches. Distractors are real misconceptions. No "all/none of the above", no trivia (numbers to memorise), no wording tells.
- The right answer must not be the longest option (lint enforces it). Spread right answers across a/b/c/d.
- Every option has a `  > feedback` line. Wrong options say why they're wrong; the right one says why it's right.
- Ids are permanent once published: kebab-case, descriptive.

## Facts the whole course agrees on

Use these exactly; if your research note disagrees, the note is older or about a different version. Flag it rather than contradict.

- **Version.** Facts about Skills are pinned to `mattpocock-skills` 1.3.1, as installed (the plugin build already carries a few unreleased fixes from GitHub main, e.g. grilling's "yes accepts the recommendation"). Claude Code facts are as of 2026-10-23 (Claude Code 2.1.309). Matt's older videos use old Skill names (write-a-prd → `/to-spec`, prd-to-issues → `/to-tickets`, CONTEXT.md → GLOSSARY.md); translate them.
- **User-invoked Skills (16, only you can start them):** ask-matt, setup-matt-pocock-skills, grill-with-docs, grill-me, handoff, to-spec, to-tickets, implement, implement-spec, retro, triage, wayfinder, improve-codebase-architecture, wait-what, teach, to-questionnaire.
- **Model-invoked Skills (11, you or the agent):** grilling, domain-modeling, prototype, tdd, code-review, pr, diagnosing-bugs, research, wizard, codebase-design, writing-for-agents.
- A user-invoked Skill can call model-invoked ones, never another user-invoked one. Plain words can start a model-invoked Skill, never a user-invoked one: type the command at the start of your message.
- **Name clashes.** Claude Code has its own Built-in `/code-review` (a bug hunt with effort levels, plus `/code-review ultra`). Matt's Skill is always reachable as `/mattpocock-skills:code-review`. A hidden Built-in also shadows `/prototype`; use `/mattpocock-skills:prototype` if the short name fails.
- **Smart zone.** About 150k tokens on today's best models, per ask-matt, as a rule of thumb. Matt has said 100k–140k at other times. The limit is about quality, not window size: current models have 1M-token windows, and a session can be in the dumb zone with most of the window free.
- **Context hygiene.** Keep `/grill-with-docs` → `/to-spec` → `/to-tickets` in one unbroken window; don't `/clear` or `/compact` until after `/to-tickets`. `/clear` between `/implement` tickets. Run `/retro` in the session it reviews, before `/clear`.
- **Phase** (Matt's meaning): a chunk of work inside a session (grilling, implementing, QA). At a boundary, ask in order: continue? `/clear`? `/handoff`? subagent? otherwise `/compact` (the default, not the first reach).
- **`/clear`** empties the working context; the old conversation can still be reopened with `/resume`, but it doesn't come back into the current session. **`/compact`** replaces the history with a summary you can steer ("`/compact` focus on X"). Both are Built-in commands, not Skills.
- **Claude Code modes** (2026-10-23): new sessions start in **auto** mode; Shift+Tab cycles Manual (`default`) → Accept edits → Plan → (Bypass / Auto when available). Plan mode only reads and proposes until you approve.
- **Matt on plan mode:** he grills in auto mode, not plan mode, and said in April 2026 that he stopped using plan mode because it rushes to a plan and asks little.
- **Matt's Main flow:** `/grill-with-docs` → (prototype detour via `/handoff`) → small: `/implement` here; multi-session: `/to-spec` → `/to-tickets` → `/implement` per ticket (clear between) or `/implement-spec` → `/tdd` inside, `/code-review` to close → `/pr` writes the PR body → `/retro`. `/setup-matt-pocock-skills` once per repo first. On-ramps: `/triage`, `/diagnosing-bugs`, `/wayfinder` (hands off at `/to-spec`).
- **Install:** `claude plugin install mattpocock-skills@claude-plugins-official` (updates itself). The other route, `npx skills@latest add mattpocock/skills`, copies editable files; never both.

## Site story rules

- Only what the author actually did, from the old Lesson files (`git show d21fc2c:content/lessons/<old-file>.md`), the repo (`.scratch/`, `docs/`, git log, PR bodies via `gh pr view`), and the research notes' site-story sections.
- Facts from the author's session logs are allowed (commands typed, token counts, what the agent did). Not allowed: the author's memory notes, global CLAUDE.md or settings, or clock times.
- First person, the author's voice, short. Quote the author's own prompts freely (it's their material).
- New Slugs: include a box only with real material; otherwise omit it or write "Not used on this site yet" plus one honest line. Never invent a session or predict an outcome.

## Sources

- At least 3 items, each with a link and a date. SKILL.md files: `[name SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/<bucket>/<name>/SKILL.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.`
- Videos: title, URL, publish date, and the timestamps you used. Docs pages: title, URL, updated date if shown, read 2026-10-23.

## Copyright

Lesson text is in your own words. At most one direct quote per source, under 15 words, in quotation marks with attribution. Never paste transcript passages or docs paragraphs.

## Before you hand back

Run the local lint: `node <scratchpad>/tools/lint-lesson.mjs <file>` until it prints no ERROR lines. Check every backticked `/name` against the lists above.

## Lessons from the pilot review (grilling, 2026-10-23)

Three reviewers found these problems in the first draft of `grilling`. Avoid them from the start.

- **Every Lesson must stand alone for a cold reader.** Define Claude Code, agent, Skill, token, session, repo, spec, ticket, context window and any mode you mention at first use, in a clause, even if an earlier Lesson defines them properly. Introduce Matt Pocock once ("a developer and teacher who publishes a popular set of Skills for Claude Code").
- **Don't call a Skill a "command".** The glossary keeps "command" for Built-in commands. Say "type its name" or "type `/name`", not "type the command".
- **Check every claim about what Matt did against the transcript**, not the research note's paraphrase. (The draft said Matt went straight to `/implement` in his July video; he said he normally would, then demoed `/to-spec`.) Cite the timestamps that cover the claim.
- **Don't over-claim what a Skill saves or does.** `/grill-with-docs` writes terms to `GLOSSARY.md` and offers an ADR only for rare hard-to-reverse decisions; most decisions live in the conversation until `/to-spec`.
- **`/grill-with-docs` vs `/wayfinder`**: the split is whether you can *plan* it in one sitting, not whether *building* takes one session. A multi-session build still starts with `/grill-with-docs` and goes `/to-spec` → `/to-tickets`.
- **Worked examples must model the advice.** Inside a repo, a Scene should use `/grill-with-docs`, not `/grill-me`. Two Scenes must not contradict a rule (e.g. one treating storage as a decision, the other as a fact).
- **Don't highlight a flow node whose caption says it never happens.**
- **Paraphrase SKILL.md.** Don't copy a sentence of 15+ words without quotation marks.
- **Try blocks start from zero:** `mkdir … && cd … && claude`, say Yes to the trust prompt, the plugin install with `/exit` and restart, how to check the mode ("if you see 'plan mode on', press Shift+Tab until it changes"), how to stop it (Esc, or choose No at a permission prompt) and `/exit`. Don't backtick partial names like `/grill`.
- **Questions test transfer, not recognition.** Use a fresh situation (a book club, a recipe site), not the body's own example sentence. Don't restate the defining phrase of the right answer in the prompt. No distractor about a retired Skill the Lesson never mentions.
- **Every goal gets at least one Final test question**, and no Checkpoint duplicates a Final test question.
- **Place each Checkpoint right after the section it checks.**
- **Keep the session-length story consistent** (one set of numbers, stated once).
- **Word budget:** aim for 2,300–2,800 words (lint range 1,800–3,000) to leave margin; `try`, `callout` and `site-story` bodies count. Cut repetition (Common mistakes shouldn't restate a whole earlier section; point back to it in one line).
- **Site story wording:** the author owns decisions. Write "we agreed" or "I decided", not "it decided", for scope.
