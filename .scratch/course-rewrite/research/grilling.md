# Research note: Lesson 4, Grilling (`/grill-me` and the `/grilling` primitive)

Read on 2026-10-23. Facts are pinned to the installed Skills plugin, folder `1.3.1`, at `/Users/siddharth/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/`. That folder's Skill files are byte-identical to GitHub `main` as of 2026-10-23. See "Newer on GitHub main" for what this means.

## Source map

| # | Source | Published / updated | What it covers | Timestamps / sections used |
|---|---|---|---|---|
| S1 | Local `skills/productivity/grilling/SKILL.md` (plus `agents/openai.yaml`) | plugin 1.3.1 | The whole interview technique: design tree, rounds, frontier, question format, "yes" wording, facts vs decisions, when it ends | full file |
| S2 | Local `skills/productivity/grill-me/SKILL.md` (plus `agents/openai.yaml`) | 1.3.1 | One-line wrapper, `disable-model-invocation: true` | full file |
| S3 | Local `README.md` | 1.3.1 | Why grilling exists (misalignment), "use every time", user- vs model-invoked rule | "#1 The Agent Didn't Do What I Want", "Reference" |
| S4 | Local `CHANGELOG.md` | 1.0.0 to 1.3.1 | History: #464 confirmation gate and facts vs decisions, #593 rounds and frontier, #532 general wording, #878 "Call the Skill tool", #917 `---` separator, #752 retired skills | entries named |
| S5 | Local `skills/engineering/ask-matt/SKILL.md` (and `PHASE-BOUNDARIES.md`) | 1.3.1 | Where grill-me and grilling sit: Standalone vs the Main flow; context hygiene | "Main flow", "Standalone" |
| S6 | https://www.aihero.dev/skills-grilling, "The /grilling Skill" | updatedAt 2026-08-24 | Mechanism, wrappers table, frontier limit, FAQ, It's working if | all sections |
| S7 | https://www.aihero.dev/skills-grill-me, "The /grill-me Skill" | updatedAt 2026-08-24 | When to reach for it, plan mode off, passivity, grillable vs ungrillable, FAQ, It's working if | all sections |
| S8 | https://www.aihero.dev/my-grill-me-skill-has-gone-viral, "My 'Grill Me' Skill Went Viral" | updatedAt 2026-03-23 | The original grill-me text (one question at a time), recommended answer, ~45-minute sessions, non-code use | whole page (history only) |
| S9 | https://www.youtube.com/watch?v=UzMNBN6xLLA, "9 Things People Get Wrong With My /grill-* skills" (13:28). Written companion at https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs (updatedAt 2026-05-25) | 2026-05-25 | Failure modes: fidelity, scope, passive vs active, keeping the session, model choice, parallel grilling | 0:00, 1:28, 2:36, 3:08, 3:44, 4:40, 5:11, 5:41, 6:14, 6:54, 7:45, 8:40, 9:48, 10:24, 11:26 |
| S10 | https://www.youtube.com/watch?v=6BB6exR8Zd8, "I stopped using /grill-me for coding. Here's what I use instead" (15:16) | 2026-05-14 | Why grill-me fell short in repos; the rule of thumb for grill-me vs grill-with-docs | 0:00, 1:03, 2:36, 13:26 to 14:31 |
| S11 | https://www.youtube.com/watch?v=M6mYodf0dJM, "mattpocock/skills: A complete AI Coding workflow, end-to-end" (17:17). Transcript is the **Arabic auto-translated** caption track, so wording is paraphrased and timings are reliable | 2026-07-16 | A live grilling session inside the Main flow | 4:00 to 4:31, 8:27 to 10:08, 10:10 to 10:53 |
| S12 | https://www.aihero.dev/ai-coding-dictionary/grilling and /design-concept (index), /smart-zone | 2026-09-24 | Dictionary definitions. `/design-tree` returns 404 | definitions |
| S13 | Hacker News: https://news.ycombinator.com/item?id=49851420 (thread "Plan mode is dead"; the page shows only relative dates), https://news.ycombinator.com/item?id=49033959, https://news.ycombinator.com/item?id=47550391 | relative dates only | Community usage and skepticism | comments |
| S14 | https://www.contextstudios.ai/blog/pocock-workflow-grill-me-spec-tickets-subagent-review | 2026-09-07 | A third-party workflow write-up. It describes the **old** one-question rhythm | flow table, FAQ |
| S15 | Reddit: https://www.reddit.com/r/ClaudeCode/comments/1t49oka/ (2026-05-05) and https://www.reddit.com/r/SpecDrivenDevelopment/comments/1tv1ruy/grillme (2026-06-03) | as listed | Daily use; extending grill-me to save every Q&A | excerpts only |
| S16 | Author: `content/lessons/01-grilling.md`, `content/lessons/11-main-flow.md`, git log (`4f849b9` on 2026-10-21, `d21fc2c` on 2026-10-22) | 2026-10-21/22 | Site story | whole files |
| S17 | GitHub `main`: `.changeset/grilling-yes-accepts-recommendation.md`, commit "grilling: word questions so yes accepts the recommendation (#706) (#1193)" | 2026-10-07 | Unreleased change, already in the installed files | n/a |

## Key facts (pinned to v1.3.1)

### What each Skill is

| Skill | Invocation | Who can start it | Body |
|---|---|---|---|
| `grill-me` | Type `/grill-me` (optionally followed by your idea on the same line) | **User-invoked only.** Frontmatter has `disable-model-invocation: true`; the Codex `openai.yaml` has `allow_implicit_invocation: false` (S2) | One line: `Call the Skill tool with "grilling".` |
| `grilling` | Type `/grilling`, or the agent reaches for it when a task fits (its description triggers on "grill" phrases and on stress-testing a plan) | **Model-invoked** (no `disable-model-invocation`) (S1). It is the only model-invoked Skill in the grilling family (S6) | The full technique (below) |

- README rule (S3): user-invoked Skills orchestrate, and model-invoked Skills hold the reusable discipline. A user-invoked Skill may call model-invoked ones, but never another user-invoked one.
- `grilling` is the reusable "primitive". It runs inside `grill-me`, `grill-with-docs`, `triage`, `wayfinder` and `improve-codebase-architecture` (S3 Reference, S5 Standalone).

### How grilling works, step by step (S1)

1. **Design tree.** The agent maps the subject as a tree. Every decision branches into the decisions that hang off it.
2. **Frontier.** The frontier is every decision whose prerequisites are already settled: the questions it can ask now without guessing at answers it hasn't heard.
3. **Rounds.** It asks the **whole frontier in one round**. Each question is numbered and carries a recommended answer. Then it waits.
4. **Fixed format.** Each question looks like `❓ **Q1** - **<title>**: <body, may include multiple choices>`, then `➡️ <recommended answer>` on its own line. A `---` line separates questions (the separator was added in #917, S4).
5. **"Yes" accepts the recommendation.** The Skill says: "Word each question so "yes" accepts your recommended answer." (S1). This line is newer than the 1.3.1 CHANGELOG; see below.
6. **Recompute.** Your answers settle decisions, so the frontier moves outward. A question that depends on another question still open in this round belongs to a **later** round.
7. **Facts vs decisions.** Finding facts is the agent's job, never yours. When a question needs a fact from the environment (files, tools), it dispatches a **sub-agent** instead of asking you. It doesn't block on that: only the questions downstream of the running lookup wait. **Decisions are yours.** It puts each one to you and waits.
8. **When it ends.** The session is done when the frontier is empty: every branch visited and nothing silently assumed. Then the **confirmation gate**: it must not act until you confirm you've reached a shared understanding.

Supporting points from the docs (S6):
- Thirteen questions typically land in about three rounds. This figure first appeared in CHANGELOG #593.
- The frontier is chosen by the agent's judgement, not computed from a graph. If two answers in one round turn out to interact, tell it, and it reopens that branch next round.
- An agent that answers its own decisions has broken the Skill.

From S7:
- Count rounds, not questions. 46 questions across 4 rounds is an ordinary session.
- There is no question cap, by design. To stop early, say so in plain words ("wrap up").

### grill-me specifics (S2, S7)

- **Stateless.** It writes no files. The only output is a clearer idea in your head (and in the conversation).
- Start it in a **fresh conversation**, not on top of a plan an agent already wrote.
- **Leave plan mode off.** Plan mode makes the agent rush to a plan.
- Use it on anything: a feature, a business call, writing. Vagueness is a reason to start, not to wait.
- If the idea turns out to be software, hand the **same conversation** to `/to-spec`.

### Which one to pick (S5, S6, S7)

| What's in front of you | Reach for |
|---|---|
| No working directory, or not code at all | `/grill-me` |
| A repo, and a change you can settle in one session | `/grill-with-docs` (Lesson 5). ask-matt calls it "strictly the better one" whenever a repo exists |
| Too big for one session | `/wayfinder` (Lesson 18) |
| A question talking can't settle (how it looks or feels) | `/prototype` (Lesson 6), then come back |
| Just the bare interview, or a Skill of your own that needs one | `/grilling` |
| Blocked on knowledge in someone else's head | `/to-questionnaire`, the inverse of grill-me |

Where it sits in the Main flow (S5): `grill-me` is listed under **Standalone**, off the Main flow. The Main flow starts with `/grill-with-docs`, and both run the same `grilling` primitive.

### Short history (for a "how it got here" box)

- **Original grill-me (S8, page updated 2026-03-23).** A few sentences asking for one question at a time down the design tree, exploring the codebase instead of asking where possible, with a recommended answer per question. Matt noted you can just say "yes" to a recommendation, and that sessions often ran about 45 minutes.
- **1.0.0.** `grilling` exposed as a model-invoked primitive behind grill-me and grill-with-docs.
- **1.1.0 (#464).** Added the confirmation gate and the facts-vs-decisions split.
- **1.2.0 (#593).** One-question-at-a-time replaced by rounds over the frontier. (#532) reworded for any plan, decision or idea, not just software.
- **1.3.0 (#878).** Wrappers now say `Call the Skill tool with "grilling"`, because naming a Skill in prose didn't reliably load it.
- **main, 2026-10-07 (#1193).** "Yes accepts the recommendation" wording.

### Newer on GitHub main

- The CHANGELOG on `main` still tops out at 1.3.1. However, `main` carries unreleased changesets, including `.changeset/grilling-yes-accepts-recommendation.md` (PR #1193, issue #706, merged 2026-10-07): grilling words each question so "yes" accepts the recommendation.
- **That line is already in the installed `1.3.1` folder.** Every Skill file I checked (grill-me, grilling, grill-with-docs, the three domain-modeling files, wait-what, ask-matt, README) is identical to `main`. So the plugin cache is newer than the 1.3.1 changelog.
- The aihero grilling page (updated 2026-08-24) still lists the old known problem, where agreeing with a recommendation could mean answering "no". The installed Skill fixes that. Teach the fixed behaviour, and maybe mention that older docs describe the bug.
- `ask-matt-read-skill-first.md` (PR #1194) is also already in the installed ask-matt.
- No other pending changeset touches grill-me or grilling.

## Day-to-day usage

### Matt's patterns

- He uses grilling every time he wants to make a change (S3 README: "Use them _every_ time you want to make a change.").
- He starts from a deliberately vague, dictated idea and lets the grill do the work. The agent explores the repo first, then asks (S11 8:39 to 9:23). He dictates with Whisper Flow (S11 8:30s; S10 9:50).
- His sessions usually run about 20 questions. The demo ended after about 6 (S11 9:36 to 9:47). The docs call 46 questions in 4 rounds ordinary (S7).
- He grills in auto mode, not plan mode (S11 10:02 to 10:08; S7).
- Once the agent reports the tree is walked and proposes the plan (S11 9:55 to 10:02), there is a fork:
  - If the work fits the remaining smart zone (he puts it around 140k tokens), go straight to `/implement` in the same session.
  - Otherwise go to `/to-spec` in the same session (S11 10:10 to 10:53).
- When a question is "ungrillable" (needs to be seen), he `/handoff`s to a prototype session and hands back the result: grill, then prototype, then grill again (S9 2:36 to 3:38).
- He breaks a big scope into smaller pieces before grilling (S9 5:11).
- He runs two grilling sessions in parallel, answering one while the other thinks, and three if one is busy with research (S9 10:24 to 11:21).
- He uses his best model for grilling, because grilling relies on the model's built-in (parametric) knowledge. A cheaper model is fine for implementation (S9 8:40 to 10:20; S7).
- He uses grill-me outside code: deciding what course to build next (S8). He also tells a viewer's story of using it to write a eulogy (S10 13:40).
- His rule of thumb: with a codebase use grill-with-docs, without one use grill-me. Even early in a project he'd pick grill-with-docs (S10 13:26 to 14:31).

### Others

- An HN commenter uses `/grill-me` instead of plan mode. They forked it to use Claude's built-in question tool for a nicer UX. Another commenter now uses `/wayfinder` for nearly everything, and a third replies with a suggestion to try `/grill-with-docs` (S13, item 49851420).
- Another HN user values that the Skills are user-invoked, so they cost little context just by being installed. They also feel the Skills keep the programmer thinking about the end result (S13, item 49033959).
- A skeptic argues that "be critical" gets similar results. Replies counter that "design tree" carries specific meaning, and that asking an LLM about itself isn't evidence (S13, item 47550391). This is useful for a balanced "does the wording matter?" sidebar.
- contextstudios.ai budgets 10 to 30 minutes for the alignment phase. It recommends grill-me alone as the highest-return starting point, but describes the outdated one-question rhythm (S14).
- One Reddit user extends grill-me so every question, answer and decision is saved to an MCP memory store. That reflects the "decisions only live in chat" worry (S15, 2026-06-03).

## Common mistakes

1. **Passivity.** Answering "agreed" to 40 questions gives you the agent's plan, not yours. S7 frames this as "It's a conversation, not an interview." Also S9 5:41 to 6:14.
2. **Over-grilling.** Grilling low-fidelity details forever instead of getting to code (S9 6:14 to 6:44; S7).
3. **Grilling an ungrillable question,** like how a form should feel or one page vs three. Prototype instead (S9 1:28 to 3:38; S7 "Grillable and ungrillable").
4. **Scope too big.** You get 200+ questions, hidden high-fidelity questions, and the session drifts into the dumb zone. Matt says about 120k tokens in May (S9 3:44 to 5:41). Fix: split first (S7 FAQ).
5. **Clearing before the spec.** This throws away the context full of decisions. Continue to `/to-spec` in the same session (S9 7:45 to 8:16; S7 FAQ; S5 context hygiene). In the video Matt says "to-PRD", the Skill's old name before it was renamed `/to-spec` (S4 #734).
6. **Too weak a model,** or low effort. Weak models compress "interview until shared understanding" into a couple of questions and an outline, then start building. Fix: a line in `CLAUDE.md`/`AGENTS.md` saying never to implement without permission (S6 FAQ; S9 8:40).
7. **Using plan mode,** or starting on top of an agent-written plan (S7).
8. **The agent answering its own decisions,** most often when another Skill runs grilling to resolve a ticket (S6; S4 #464).
9. **Installing `grill-me` without `grilling`.** grill-me does nothing on its own (S6 FAQ).
10. **Expecting grill-me to write files.** It is stateless (S7).
11. **Fighting the round format.** The supported opt-out is the line "When grilling, ask one question at a time." in your global `CLAUDE.md` (S6 FAQ). `/batch-grill-me` no longer exists.
12. **Typing the next Skill before answering the agent's open question.** The author's own example: the spec then got written on the agent's best guess (S16, Lesson 11).

## Try it yourself (about 15 minutes, no repo needed)

1. Start a **new** Claude Code session in any folder. Check that plan mode is off (the mode indicator under the prompt box; Shift+Tab cycles modes).
2. Type:
   ```
   /grill-me I want a one-page site for my book club where members can leave a comment on this month's book. Keep v1 small.
   ```
3. Answer round 1 **by number**. For example: `1 yes, 2 no: members stay anonymous, 3 I don't know yet`. Accept at least one recommendation with a plain "yes", and change at least one.
4. Push back once on scope, for example: `No moderation or editing in v1.`
5. After the second or third round, type: `Let's wrap up. Summarise what we decided and what is out of scope.`
6. Read the summary and correct anything wrong. Don't let it start building.

Optional: if a round felt overwhelming, add `When grilling, ask one question at a time.` to `~/.claude/CLAUDE.md` and try again.

**It's working if** (adapted from S6 and S7):
- [ ] Each round arrives as a numbered list (`❓ Q1`, `❓ Q2`...), each question with its own `➡️` recommendation, and you can answer the whole round by number.
- [ ] Nothing in a round needed another question in the same round answered first.
- [ ] Round 2 asked things round 1 couldn't have asked, because they build on your answers.
- [ ] Saying "yes" accepted the recommendation. You never had to say "no" to agree.
- [ ] You disagreed with at least one recommendation.
- [ ] At the end it asked you to confirm the shared understanding, instead of writing code or files.
- [ ] You could explain each decision, including what's out of scope, to someone who wasn't there.
- [ ] Red flag: everything was asked at once with no `➡️` lines. That means the `grilling` Skill didn't load. Ask "Did you load the grilling skill?" (S6 FAQ).

## Site story ("How I used it building this site")

- **What the author typed** (`01-grilling.md`, their own words):
  ```
  /grilling i want to built a small site simple white background with royal blue accents all over sharp layout ... one lesson per page, its for me, it teaches matt pococks skills and how to build end to end projects using agentic coding ... plus a comment box on each lesson saved in Neon.
  ```
  They called the first message "messy and long, and that's fine". They typed the model-invoked primitive `/grilling` directly. In today's Main flow, a repo means `/grill-with-docs` (S5). Lesson 11's old-to-new table makes the same mapping.
- **Round 1 had 8 questions,** which was the frontier working as designed, but the author found it overwhelming. They said "one or two at a time please", and the agent adapted. The supported opt-out is one-at-a-time via `CLAUDE.md` (S6); "one or two" is the author's own variant.
- **Steering.** The agent asked about details the author didn't care about yet (file formats, navigation, colours). The author said to grill them on the architecture and let the agent decide details using best practice. Their takeaway, quoted: "I own the architecture and the scope. The agent owns the details." It is a good example of being active rather than passive (S9 5:41).
- **Decisions made:**
  - 11 Lessons
  - no model/effort box
  - real REST `GET/POST /api/comments`
  - layers: endpoint → comments module → Drizzle → Neon (mapped to FastAPI → crud → SQLAlchemy → Postgres)
  - Neon branches per environment
  - migrations on every Vercel build
  - tests on a real Neon test branch
  - one plain CSS file
- **Out of scope:** login, editing or deleting comments, moderation, dark mode, search, custom domain.
- **It ended by checking agreement.** The author noted nothing gets built on a guess (the confirmation gate).
- **Repo evidence.** The grilling output landed as the spec, glossary, ADRs, issues and draft Lessons 1 to 3 in commit `4f849b9` (2026-10-21 13:09 +0530).
- **Later (PR #9, `d21fc2c`, 2026-10-22).** The author wrote "you can start grilling with docs" in plain words. `/grill-with-docs` is user-invoked, so the agent couldn't start it and ran `/grilling` then `/domain-modeling` instead (`11-main-flow.md`, "What happened" 1).

## Candidate quiz questions

**1.** You're deciding whether to take a new job offer. There's no code and no repo. Which Skill do you type?
- A) `/grill-with-docs`
- **B) `/grill-me`** ✓
- C) `/domain-modeling`
- D) `/to-spec`

*Why:* grill-me is the stateless interview for anything, anywhere. grill-with-docs is for working inside a repo. *Source:* S5 Standalone; S7.

**2.** The agent asks: "❓ Q2 - Comment names: Should the name field be optional? ➡️ Yes, show 'Anonymous' when it's empty." You agree. What's the shortest correct reply?
- A) "No"
- **B) "2 yes"** ✓
- C) Retype the full answer word for word
- D) `/clear`

*Why:* Questions are worded so "yes" accepts the recommendation, and rounds are answered by number. *Source:* S1; S6.

**3.** Round 1 includes "Do Visitors need to log in to comment?" Which question should **not** be in the same round?
- A) "What's the maximum comment length?"
- B) "Should the newest comments show first?"
- **C) "Which login provider should we use?"** ✓
- D) "Is dark mode in scope for v1?"

*Why:* The login provider depends on an answer still open in this round, so it belongs to a later round. The others are independent. *Source:* S1.

**4.** During a grilling session, which of these should the agent find out for itself rather than ask you?
- A) "Should comments be moderated?"
- B) "Is search in scope for v1?"
- **C) "Which Next.js version does package.json use?"** ✓
- D) "REST endpoints or Server Actions?"

*Why:* Facts from the environment are the agent's job (via a sub-agent). Decisions are yours. *Source:* S1.

**5.** When is a grilling session finished?
- A) After 20 questions
- B) When the context window is full
- **C) When the frontier is empty and you confirm you share an understanding** ✓
- D) As soon as the agent writes a plan

*Why:* Empty frontier plus the confirmation gate. There is no question cap. *Source:* S1; S6.

**6.** Sam answered "agreed" to all 40 questions and got a long, confident plan. What went wrong?
- A) Sam should have used plan mode
- **B) Sam was passive, so the plan is the agent's, not Sam's** ✓
- C) 40 questions is too few
- D) Sam should have used `/wait-what`

*Why:* You own the scope. Push back, steer, and say "I don't know" when it's true. *Source:* S7; S9 5:41.

**7.** Mid-grill, you hit "Should sign-up be one long form or three pages?" What's the best move?
- A) Guess and move on
- B) Let the agent decide
- **C) Treat it as ungrillable: prototype it (handoff out, build, hand back), then answer** ✓
- D) Keep rephrasing until an answer feels right

*Why:* High-fidelity questions need something to look at. *Source:* S9 1:28 to 3:38; S7.

**8.** Round 1 arrives with 8 questions and it overwhelms you. What's the supported fix?
- A) Install `/batch-grill-me`
- B) Set a question cap
- **C) Add "When grilling, ask one question at a time." to your global CLAUDE.md** ✓
- D) Switch to plan mode

*Why:* That line is the documented opt-out. `/batch-grill-me` no longer exists and there's no cap setting. *Source:* S6 FAQ.

**9.** Grilling is done, and you want a spec for a multi-session build. What's next?
- A) `/clear`, then `/to-spec`
- **B) `/to-spec` in the same conversation** ✓
- C) Open a fresh session and re-explain
- D) `/compact`, then `/to-spec`

*Why:* The conversation full of decisions is the input. Clearing throws it away. *Source:* S7 FAQ; S9 7:45; S5 context hygiene.

**10.** Which grilling-family Skill can the agent start on its own, without you typing it?
- A) `/grill-me`
- **B) `/grilling`** ✓
- C) `/grill-with-docs`
- D) None of them

*Why:* Only `grilling` lacks `disable-model-invocation: true`. *Source:* S1, S2; S6.

**11.** You have limited budget for models. Where should the strongest one go?
- **A) Grilling** ✓
- B) Implementation
- C) Code formatting
- D) It doesn't matter

*Why:* Grilling draws on the model's built-in knowledge of how systems break, while implementation mostly follows context. *Source:* S9 8:40; S7.

## Open questions / uncertain

- Smart-zone size differs by source: about 120k (S9, May 2026), about 140k (S11, July 2026), about 150k (ask-matt), 125k to 150k "debated" (S12, Sept 2026). Suggest quoting ask-matt's ~150k and calling it a rule of thumb.
- The AI coding dictionary's "Grilling" entry still says the agent asks one decision at a time, which contradicts round-based v1.3.1 (S12). The `/design-tree` dictionary page doesn't exist (404).
- The "yes accepts the recommendation" line isn't in any released CHANGELOG version yet, though it is in the installed files.
- The 9 Things video doesn't enumerate nine numbered items. Its chapters cover about six failure areas.
- M6mYodf0dJM wording is paraphrased from an Arabic auto-translated track. The model name came out garbled, so I didn't use it.
- HN comments show only relative dates.
- `https://www.aihero.dev/grill-with-docs` ("Align Before You Build", 15:16, updated 2026-05-05) looks like the companion page of video 6BB6exR8Zd8 (same length). That is my inference.
