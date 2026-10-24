# Research note: Lesson 5, Domain modeling (`/grill-with-docs`, GLOSSARY.md, ADRs, `/wait-what`)

Read on 2026-10-23. Facts are pinned to the installed plugin `1.3.1`, which is identical to GitHub `main` for these files.

## Source map

| # | Source | Published / updated | What it covers | Timestamps / sections used |
|---|---|---|---|---|
| D1 | Local `skills/engineering/grill-with-docs/SKILL.md` (plus `agents/openai.yaml`) | 1.3.1 | One-line wrapper, `disable-model-invocation: true` | full |
| D2 | Local `skills/engineering/domain-modeling/SKILL.md` | 1.3.1 | The active discipline, file layout, lazy creation, in-session moves, ADR gate | full |
| D3 | Local `skills/engineering/domain-modeling/GLOSSARY-FORMAT.md` | 1.3.1 | Glossary template and rules, single vs multi-context | full |
| D4 | Local `skills/engineering/domain-modeling/ADR-FORMAT.md` | 1.3.1 | ADR template, numbering, the three tests, what qualifies | full |
| D5 | Local `skills/productivity/wait-what/SKILL.md` (plus `agents/openai.yaml`) | 1.3.1 | Three-line corrective, user-invoked | full |
| D6 | Local `README.md` "#2 The Agent Is Way Too Verbose"; `CHANGELOG.md` #1120 (CONTEXT.md renamed to GLOSSARY.md), #848, #878, #751, #904, #752; `ask-matt/SKILL.md` "Vocabulary underneath", "Standalone" | 1.3.1 | Why shared language matters; history; routing | as named |
| D7 | https://www.aihero.dev/skills-grill-with-docs | updatedAt 2026-08-24 | Paper trail table, FAQ, It's working if, chain | all |
| D8 | https://www.aihero.dev/skills-domain-modeling | updatedAt 2026-08-24 | Two artifacts and two bars, cross-referencing limits, FAQ, It's working if | all |
| D9 | https://www.aihero.dev/skills-wait-what | updatedAt 2026-08-24 | Name as mechanism, It's working if | all |
| D10 | https://www.youtube.com/watch?v=6BB6exR8Zd8, "I stopped using /grill-me for coding..." (15:16) | 2026-05-14 | Origin of grill-with-docs, glossary, ADRs, live demo, benefits | 1:03, 2:06, 2:36, 3:07, 3:38, 4:39, 5:11, 5:42, 6:13, 6:45, 7:15, 7:46, 8:17, 8:48, 9:19, 10:55, 11:26, 11:57, 12:28, 12:59, 13:26 to 14:31 |
| D11 | https://www.aihero.dev/skills-changelog-ubiquitous-language-grill-with-docs | updatedAt 2026-04-30 | ubiquitous-language merged into grill-with-docs; ADR three conditions | sections |
| D12 | https://x.com/mattpocockuk/status/2049554929862283341 | 2026-04-29 | Matt's launch post for grill-with-docs | post (search excerpt) |
| D13 | https://www.youtube.com/watch?v=M6mYodf0dJM (Arabic auto-translated track) | 2026-07-16 | Setup asks single vs multi context; ask-matt says start with grill-with-docs | 5:54 to 6:15, 7:46 to 7:55 |
| D14 | https://www.youtube.com/watch?v=UzMNBN6xLLA | 2026-05-25 | Same failure modes apply to grill-with-docs | 0:00, 3:08 |
| D15 | Community: contextstudios.ai (2026-09-07), r/ClaudeCode thread (2026-05-05), HN item 49851420 | as listed | Usage | excerpts |
| D16 | Author: `content/lessons/02-domain-modeling.md`, `11-main-flow.md`, `GLOSSARY.md`, `docs/adr/0001` to `0004`, `docs/agents/domain.md`, git log (`4f849b9` 2026-10-21; `c226730` 2026-10-21; `1262b31` 2026-10-21; `d21fc2c` 2026-10-22) | as listed | Site story | whole files |

## Key facts (pinned to v1.3.1)

### The three Skills

| Skill | Invocation | Who can start it | What it is |
|---|---|---|---|
| `grill-with-docs` | Type `/grill-with-docs` (plus your idea) | **User-invoked only** (`disable-model-invocation: true`; Codex `allow_implicit_invocation: false`) (D1) | Body: `Call the Skill tool twice, for "grilling" and "domain-modeling".` So it is grilling plus domain-modeling. Description: an interview that also creates docs (ADRs and glossary) as you go |
| `domain-modeling` | Type `/domain-modeling`, or the agent reaches for it | **Model-invoked** (D2). Triggers on discussing codebase terminology, or writing or editing a GLOSSARY.md or an ADR (#848) | The active discipline of building and sharpening the project's domain model |
| `wait-what` | Type `/wait-what` | **User-invoked only** (D5) | Three lines: the agent re-pitches what it said with a little context, in ASD-STE100 Simplified Technical English, using the `GLOSSARY.md` vocabulary (following `GLOSSARY-MAP.md` if there is one) |

### Where they sit (D6 ask-matt, D7)

- `/grill-with-docs` is **step 1 of the Main flow**. aihero's chain is `grill-with-docs → to-spec → to-tickets → implement → code-review → retro`.
- It is stateful: it retains what it learns in `GLOSSARY.md` and ADRs.
- `domain-modeling` sits in "Vocabulary underneath", next to `codebase-design`. It is driven by grill-with-docs, and also used by wayfinder, triage and improve-codebase-architecture (D8).
- `wait-what` is Standalone: an after-the-fact repair. grill-with-docs is the upfront cure.

### How domain-modeling works during a session (D2)

1. **Challenge against the glossary.** If you use a term that conflicts with `GLOSSARY.md`, it calls the conflict out immediately.
2. **Sharpen fuzzy language.** It proposes one precise canonical term for a vague or overloaded word (e.g. "account" could mean Customer or User).
3. **Discuss concrete scenarios.** It invents edge-case scenarios to pin down the boundaries between concepts.
4. **Cross-reference with code.** When you state how something works, it checks whether the code agrees and surfaces any contradiction.
5. **Update GLOSSARY.md inline.** It writes each term the moment it's resolved, not batched at the end.
6. **Offer ADRs sparingly.** Only when all three tests pass:
   - **hard to reverse**
   - **surprising without context**
   - **the result of a real trade-off**

   If any test fails, skip the ADR.
- Reading `GLOSSARY.md` for vocabulary is **not** this Skill. That's a habit any Skill has. This Skill is for changing the model.

### Files it creates

- **Lazy creation (D2, D3, D4).** Nothing is set up in advance. `GLOSSARY.md` is created at the repo root when the first term resolves. `docs/adr/` is created with the first ADR.
- **GLOSSARY.md format (D3):**
  - `# {Context Name}`, then a one- or two-sentence description, then `## Language`.
  - Each entry: `**Term**:`, a one- or two-sentence definition of what it **is**, then `_Avoid_: synonyms`.
  - Rules: be opinionated (pick one word, list the rest under `_Avoid_`); keep definitions tight; only project-specific terms, no general programming concepts; group under subheadings when clusters emerge.
  - It must contain **no implementation details**. It is not a spec or a scratch pad (D2).
- **Multi-context (D2, D3).** A `GLOSSARY-MAP.md` at the root lists the contexts (each with its own `GLOSSARY.md` and `docs/adr/`) and how they relate. If neither file exists, a root `GLOSSARY.md` is created lazily. In the July video, setup asks single vs multi context, and Matt says single fits about 99% of people (D13 5:54 to 6:15).
- **ADR format (D4):**
  - Lives at `docs/adr/NNNN-slug.md`, numbered sequentially. To get the next number, find the highest existing number and add one.
  - Template: a `# Short title` plus **1 to 3 sentences**: the context, the decision, and why. One paragraph is enough.
  - Optional sections, only when they add value: Status frontmatter (`proposed | accepted | deprecated | superseded by ADR-NNNN`), Considered Options, Consequences.
  - What qualifies: architectural shape; integration patterns between contexts; technology choices with lock-in; boundary and scope decisions (including explicit "no"s); deliberate deviations from the obvious path; constraints not visible in the code; non-obvious rejected alternatives.

### The paper trail (D7)

| What resolved | Where it lands |
|---|---|
| A term | `GLOSSARY.md`, inline |
| A three-test decision | An ADR |
| **Everything else** | **The conversation only.** Feed it straight to `/to-spec`; don't clear |

A session that produces a sharper glossary and zero ADRs is working as designed.

### wait-what details (D5, D9; CHANGELOG #751)

- The leading word "wait" names **your** state (you're lost), not the output. Output-focused commands like `/tldr` or "be concise" make the model clip words and lose you further.
- It re-pitches "that", and the agent decides how far back to go.
- It still works without a glossary; you just lose the vocabulary half.
- It is deliberately three lines, because long concision Skills make the model copy their length.

### Relationship summary

- `grill-with-docs` = `grilling` (the interview: rounds, frontier, recommendations, facts vs decisions, confirmation gate) plus `domain-modeling` (glossary and ADRs written inline).
- `grill-me` = `grilling` alone, stateless.
- Install all three, because a wrapper without its primitives does nothing (D7).

### Newer on GitHub main

- No differences. `grill-with-docs`, `domain-modeling` (SKILL, ADR-FORMAT, GLOSSARY-FORMAT), `wait-what` and `ask-matt` match `main` (checked 2026-10-23).
- No pending changeset touches them, except that grill-with-docs inherits the unreleased "yes accepts the recommendation" grilling change (see the grilling note).
- **Version caveat for teaching:**
  - 1.3.0 (#1120) renamed `CONTEXT.md`/`CONTEXT-MAP.md` to `GLOSSARY.md`/`GLOSSARY-MAP.md`. Anyone with an old `CONTEXT.md` must `git mv` it, because the Skills only look for the new name.
  - All three videos (D10, D13, D11) still say "context.md".
  - The aihero domain-modeling FAQ was garbled by the rename. Its heading now asks why the file is `GLOSSARY.md` and not `GLOSSARY.md`, so don't quote that FAQ.

## Day-to-day usage

### Matt's patterns

- **Why he built it (D10 1:03 to 3:07).** In repos, grill-me kept running into project jargon the agent didn't know. His example: a "standalone video" (one not attached to a lesson or course). The agent was verbose, and good shared terms weren't written down anywhere.
- **Origin (D10 3:38 to 4:39).** He first ran a separate ubiquitous-language Skill (from Eric Evans' DDD) mid-grill, then merged the two into grill-with-docs.
- **What the docs give him (D10 4:39 to 5:42).** grill-with-docs looks for the existing glossary, challenges your language against it, sharpens fuzzy words, runs scenarios, cross-checks code and updates the docs as it goes. Bounded contexts plus a map scale this to monorepos (D10 5:11).
- **Pointer from CLAUDE.md (D10 6:45 to 7:15).** He adds a pointer to the domain docs in the repo's CLAUDE.md. setup-matt-pocock-skills writes this as `docs/agents/domain.md`; this repo has one.
- **Live demo (D10 8:17 to 11:57).**
  - The agent first surfaced a clash with the existing glossary definition.
  - Then a cardinality question, which he accepted with one word.
  - Then a terminology collision, which also decided how the UI would be organised.
  - Then status values and delete behaviour.
  - He then asked it to save what they had into the glossary, and to grill him on anything still open first.
- **Stop bike-shedding (D10 11:57 to 12:28).** He calls "good enough" on naming and says language can be refactored later. He stresses that the glossary terms flow into variable and file names.
- **Benefits he reports (D10 12:28 to 13:26).** Shorter replies, fewer thinking tokens, and easier-to-navigate code, the same benefits DDD claims for human teams. The README calls shared language possibly the single coolest technique in the repo, with a before/after example (D6).
- **Launch post (D12, 2026-04-29).** Matt called grill-with-docs magical: it makes you define your project's jargon. He cites a user who, after 4 to 5 sessions, found Claude picking up the ADRs and context during grilling. The same feedback appears in D10 at 5:42 to 6:13.

### Recipes from the docs

- **Brownfield repo with no docs:** invoke grill-with-docs and ask it to document the repo (D7: "help me document my repo"). Ask explicitly for a scaffolded GLOSSARY.md. One user reported more than 50 questions (D8).
- **Bloated glossary:** `/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it` (D8). Only then consider `GLOSSARY-MAP.md`.
- **Skipped decision:** if domain-modeling didn't load, invoke `/domain-modeling` by name alongside the other Skill, or ask which Skills loaded (D8, D7).

### Others

- A Reddit user lists grill-with-docs as a daily Skill for writing and implementing plans, brainstorming and ADRs (D15, 2026-05-05).
- contextstudios.ai: grill-me is enough for one-off work, while in a team repo with history the docs variant pays off quickly (D15, 2026-09-07).
- On HN, a user recommends trying `/grill-with-docs` as the next step after `/grill-me` (D15).

## Common mistakes

1. **Treating GLOSSARY.md as a spec or scratch pad.** Implementation details, decisions and answers creep in, and the file balloons. This is the most-reported problem (D8; D2).
2. **ADR inflation,** writing one per choice. Each ADR needs all three tests, and most sessions produce none (D4; D8).
3. **Assuming every decision got saved.** Most live only in the conversation. Go to `/to-spec` in the same session and re-read the spec against your own answers (D7 "Where did all my other decisions go?").
4. **Dependencies not loading.** You see everything asked at once with no recommendations and no glossary mention. If only grilling loads, you get a good interview with no paper trail. Fix: ask which Skills loaded (D7; CHANGELOG #878).
5. **Expecting the agent to start `/grill-with-docs` from plain words.** It's user-invoked, so type it. The author hit exactly this (D16, Lesson 11).
6. **Running it inside another orchestration layer** (a spec-driven wrapper or multi-agent framework). The file-writing half can silently fail. Check the working directory (D7, known bug).
7. **Splitting a bloated glossary into a map before trimming it.** You just get several bloated files (D8).
8. **Using the right nouns without doing the modelling,** or expecting it to invent vocabulary you don't understand (D8).
9. **Leaving an old `CONTEXT.md` unrenamed** after 1.3.0 (D6 #1120).
10. **Endless bike-shedding** over names (D10 11:57).
11. **Fixing a lost-you message with "be concise"** instead of `/wait-what`, or using `/wait-what` as a substitute for building the glossary upfront (D9).
12. **An unreviewed, agent-written glossary.** It fills with confident claims later sessions trust. On a one-day build, skip it (D8).

## Try it yourself (about 15 minutes)

1. In a terminal, run `mkdir book-club && cd book-club && git init && claude`.
2. Type the following. It uses fuzzy words ("people", "members", "thoughts") on purpose:
   ```
   /grill-with-docs I want a small site for my book club. Each month we pick a book, people post their thoughts on it, and old books move to an archive. Members don't need accounts.
   ```
3. Answer 2 or 3 rounds by number. When it asks what to call something, pick one word and stick to it.
4. After a round or two, type `!cat GLOSSARY.md` to look at the file mid-session (`!` runs a shell command in Claude Code).
5. When a reply loses you, type `/wait-what`.
6. Ask: `Would any of our decisions earn an ADR? For each, say which of the three tests it passes or fails.`
7. Type `Let's stop here.` and look at `ls docs/adr` (it may not exist, which is fine).

**It's working if** (adapted from D7, D8, D9):
- [ ] `GLOSSARY.md` appeared **during** the session, after the first term was settled, and grew term by term.
- [ ] Each entry has a **bold term**, a one- or two-sentence definition of what it *is*, and an `_Avoid_:` line.
- [ ] No implementation details in the glossary: no tables, columns, endpoints or frameworks.
- [ ] It challenged a fuzzy word, for example asking whether "people" and "members" are the same thing.
- [ ] It invented at least one edge case, for example what happens to posts when a book moves to the archive.
- [ ] Zero or one ADR. For rejected candidates it named which of the three tests failed.
- [ ] Questions came in numbered rounds with `➡️` recommendations, which shows grilling loaded too.
- [ ] `/wait-what` gave a reply that was shorter **and** clearer, added the missing premise, and used your glossary words.
- [ ] Red flag: no glossary and no rounds. Ask "Did you load grilling and domain-modeling?"

## Site story ("How I used it building this site")

- **What the author typed** (`02-domain-modeling.md`): just `/domain-modeling`, right after the `/grilling` session, which already had the decisions in context. In v1.3.1 that is the two halves `/grill-with-docs` runs at once. Lesson 11's table says the same.
- **Glossary.** It wrote six terms (Lesson, Slug, Skill, Phase, Comment, Visitor), grouped under "Course" and "Discussion". It caught on its own that a Lesson isn't the same as a Skill, because "Start here" and "Models, effort & ultracode" don't teach one.
- **Four ADRs:**
  - 0001: REST endpoints in Next.js, not Server Actions or a separate FastAPI service
  - 0002: one Neon branch per environment, migrations on every build
  - 0003: tests hit real Postgres, no mocks
  - 0004: comments reference Lessons by a permanent slug, with no foreign key

  Each is one paragraph, matching the ADR-FORMAT template.
- **Scenario test.** It asked: what if you rename a Lesson? Comments store the slug, so they'd silently vanish. The author didn't get it at first, asked for a breakdown, then confused the slug with the endpoint. That was a natural `/wait-what` moment, though the Skill wasn't used. Decision: slugs never change, and numbers go in filenames, never in slugs.
- **Author's takeaway** (their words): a rule written down can be cheaper than extra machinery, and the ADR records why, so nobody "fixes" it later.
- **ADRs were maintained afterwards:**
  - `c226730` (2026-10-21) updated ADR 0002 for the `vercel-dev` branch name.
  - `1262b31` (PR #7, 2026-10-21): the code review found ADR 0004's wording didn't match the code (slug and order come from the file header), and the ADR was corrected.
- **Glossary grew later.** `d21fc2c` (PR #9, 2026-10-22) added **Main flow** and **Built-in command** during the "grilling with docs" session.
- **Points to correct in the rewrite:**
  - The current Lesson says domain modeling comes "right after grilling" and "saves" decisions. In v1.3.1 it runs **during** grilling, writing terms inline. It saves only terms and three-test decisions; the rest stays in the conversation (D2, D7, D8).
  - The glossary's **Phase** term ("one step of building this site, done with one Skill") collides with Matt's "phase" (a chunk of work inside a session, in ask-matt PHASE-BOUNDARIES). Worth resolving before the context-window and main-flow Lessons.

## Candidate quiz questions

**1.** You're in your project's repo and want to plan a change while leaving a paper trail. Which Skill?
- A) `/grill-me`
- **B) `/grill-with-docs`** ✓
- C) `/wayfinder`
- D) `/wait-what`

*Why:* Same interview, but stateful: it writes GLOSSARY.md and ADRs. wayfinder is for efforts too big for one session. *Source:* D6 ask-matt; D7.

**2.** Which decision deserves an ADR?
- A) Use date-fns instead of dayjs
- B) Make buttons royal blue
- **C) Comments reference Lessons by slug with no foreign key, protected by a never-rename rule** ✓
- D) Use TypeScript in a Next.js app

*Why:* Only C is hard to reverse, surprising without context, and a real trade-off. *Source:* D4; D16 ADR 0004.

**3.** What's wrong with this entry? `**Comment**: A row in the comments table (id, lesson_slug, body); POST /api/comments checks 1–2000 chars. _Avoid_: Message, post`
- A) It's missing an `_Avoid_` line
- **B) It's full of implementation details** ✓
- C) Terms must be lowercase
- D) It should live in `docs/adr/`

*Why:* GLOSSARY.md defines what a thing *is*, with no implementation details. *Source:* D2; D3.

**4.** You typed "start grilling with docs" in plain words, and the agent ran `/grilling` and `/domain-modeling` separately. Why?
- A) grill-with-docs isn't installed
- **B) `/grill-with-docs` is user-invoked, so only you can start it** ✓
- C) Plan mode was on
- D) The glossary was empty

*Why:* It has `disable-model-invocation: true`. *Source:* D1; D16 Lesson 11.

**5.** A grill-with-docs session asked everything at once with no recommendations and never touched GLOSSARY.md. What's the most likely cause?
- A) Nothing qualified for the glossary
- **B) Its dependencies (`grilling`, `domain-modeling`) didn't load** ✓
- C) The repo has no ADRs yet
- D) You answered by number

*Why:* That's the most-reported failure. Ask which Skills loaded. *Source:* D7.

**6.** Your GLOSSARY.md is 1,000 lines. What's the first fix?
- A) Split it with GLOSSARY-MAP.md
- B) Delete it
- **C) Ask grill-with-docs to make it concise and strip implementation details** ✓
- D) Move it into ADRs

*Why:* Size is a symptom of non-glossary content. Splitting a bloated file gives you several bloated files. *Source:* D8.

**7.** Mid-session, the agent's reply is full of jargon and you're lost. What do you type?
- A) `/clear`
- B) "be concise"
- **C) `/wait-what`** ✓
- D) `/compact`

*Why:* It re-pitches with the missing context and glossary words. "Be concise" just clips words. *Source:* D9; D5.

**8.** When does domain-modeling create GLOSSARY.md?
- A) During `/setup-matt-pocock-skills`
- B) In one batch at the end of the session
- **C) Lazily, when the first term is resolved** ✓
- D) When the first ADR is written

*Why:* Files are created only when there's something to write. *Source:* D2; D3.

**9.** You say "users can comment", but GLOSSARY.md defines **Visitor** with `_Avoid_: User`. What should a working session do?
- A) Silently change your sentence
- **B) Call out the conflict and ask which you mean** ✓
- C) Add "User" as a new term
- D) Write an ADR

*Why:* "Challenge against the glossary." *Source:* D2.

**10.** `docs/adr/` holds files 0001 to 0004. What's the next ADR called, and what's its minimum content?
- **A) `0005-<slug>.md`, with a title and 1 to 3 sentences (context, decision, why)** ✓
- B) `ADR-5.md`, with Status, Options and Consequences sections
- C) `0001-<slug>.md`, overwriting the oldest
- D) `0005.md`, with the full spec

*Why:* Sequential numbering; one paragraph is enough, and the sections are optional. *Source:* D4.

## Open questions / uncertain

- How reliably `domain-modeling` auto-loads under grill-with-docs depends on the model and effort (D7, D8). There's no hard data.
- The open bug about file-writing being skipped inside orchestration layers has no issue number on the page.
- There is an open suggestion to rename `grill-with-docs` to `grill-domain-model` (D7). If it lands, the URL changes.
- The aihero domain-modeling FAQ heading garbled by the rename (noted above).
- D11's changelog page has no YouTube URL. Treat it as a written changelog dated 2026-04-30.
- Whether the course should teach the author's two-step (`/grilling` then `/domain-modeling`) as history and `/grill-with-docs` as today's way. I recommend that.
