# Research: Lesson 16 `architecture` (/codebase-design + /improve-codebase-architecture)

Everything was read on 2026-10-23. "Local" means `/Users/siddharth/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/` (installed 2026-10-21).

## Source map

| ID | Source | Published / updated | What it covers | Timestamps used |
|---|---|---|---|---|
| A1 | Local `skills/engineering/codebase-design/SKILL.md` | 1.3.1 cache | Glossary (module, interface, implementation, depth, seam, adapter, leverage, locality); four principles; designing for testability; rejected framings | n/a |
| A2 | Local `codebase-design/DEEPENING.md` | 1.3.1 | Four dependency categories; seam discipline; "replace, don't layer" testing | n/a |
| A3 | Local `codebase-design/DESIGN-IT-TWICE.md` | 1.3.1 | Parallel sub-agents produce 3+ radically different interfaces, then a comparison | n/a |
| A4 | Local `skills/engineering/improve-codebase-architecture/SKILL.md` | 1.3.1 | Process: Explore (YAGNI scoping), HTML report, grilling loop | n/a |
| A5 | Local `improve-codebase-architecture/HTML-REPORT.md` | 1.3.1 | Report scaffold, card fields, badges, diagram patterns, tone | n/a |
| A6 | Local `CHANGELOG.md` + GitHub tag dates (v1.0.0 2026-06-17, v1.2.0 2026-08-05, v1.2.3 2026-08-06, v1.3.0 2026-09-29, v1.3.1 2026-10-04) | n/a | When each change landed | n/a |
| A7 | Local `README.md`, section "#4: We Built A Ball Of Mud" | 1.3.1 | Why design matters; how often to run the survey | n/a |
| A8 | Local `skills/engineering/ask-matt/SKILL.md` | 1.3.1 | "Codebase health", "Vocabulary underneath", diagnosing-bugs on-ramp | n/a |
| A9 | Local `skills/in-progress/setup-ts-deep-modules/SKILL.md` + `dependency-cruiser.config.cjs` + `in-progress/README.md` | 1.3.1 (beta) | Enforcing deep modules in TypeScript with dependency-cruiser | n/a |
| A10 | GitHub API diff, local vs `main` vs tag `v1.3.1` | checked 2026-10-23 | Newer-on-main check | n/a |
| A11 | https://www.aihero.dev/skills-codebase-design | updated 2026-08-24 | Docs page: what it does, when to use it, common questions, it's working if | n/a |
| A12 | https://www.aihero.dev/skills-improve-codebase-architecture | updated 2026-08-24 | Docs page: four situations, badges, common questions, it's working if | n/a |
| A13 | https://www.aihero.dev/how-to-make-codebases-ai-agents-love (Matt's article; no YouTube link found) | updated 2026-02-26 | The agent as a new starter with no memory, grey-box modules, navigability | n/a |
| A14 | YouTube "How To De-Slop A Codebase Ruined By AI (with one skill)", https://www.youtube.com/watch?v=3MP8D-mdheA | 2026-04-29 (11:18) | Vocabulary walk-through plus a live run on course-video-manager | 0:00, 0:35, 1:08, 1:41, 2:13, 2:47, 3:20, 3:53, 4:26, 5:33, 6:06, 7:13, 7:47, 8:53, 9:27, 9:59, 10:32 |
| A15 | YouTube "Software Fundamentals Matter More Than Ever" (AI Engineer channel), https://www.youtube.com/watch?v=v4F1gFy-hqg | 2026-04-23 (18:26) | Ousterhout, entropy, deep modules, "design the interface, delegate the implementation" | 2:18, 2:53, 3:25, 12:20, 12:54, 14:02, 14:35, 15:07, 16:13, 16:45, 17:18 |
| A16 | GitHub issue #449, https://github.com/mattpocock/skills/issues/449 | opened 2026-07-04, closed 2026-10-06 | `/codebase-design` run as a session driver | n/a |
| A17 | GitHub issue #232, https://github.com/mattpocock/skills/issues/232 | 2026-05-21 (closed) | The architecture skill carrying on into implementation; Matt calls it a harness failure | n/a |
| A18 | Ousterhout, *A Philosophy of Software Design*, 2nd ed. (2021): https://web.stanford.edu/~ouster/cgi-bin/book.php and the extract PDF https://web.stanford.edu/~ouster/cgi-bin/aposd2ndEdExtract.pdf; chapter summary https://gist.github.com/8ullyMaguire/764e7dc375d3f9d34cadb0d668bd518d (secondary) | 2021 | Deep modules, "design it twice" | n/a |
| A19 | Feathers, *Working Effectively with Legacy Code* (2004), https://www.oreilly.com/library/view/working-effectively-with/0131177052 | 2004 | Origin of "seam" (A1 credits Feathers; I didn't read the book text) | n/a |
| A20 | Repo: `src/lessons/lessons.ts`, `src/lessons/lessons.test.ts`, `src/comments/comments.ts`, `src/app/api/comments/route.ts`, `docs/adr/0001…`, `docs/adr/0003…`, `.scratch/main-flow-and-redesign/spec.md` (lines 64, 113), `.scratch/lesson-site/spec.md` (line 36) | n/a | The site's real modules and seams | n/a |
| A21 | The author's Claude Code session log, lines 3094–3101 (2026-10-21T09:39:48Z–09:40:05Z) and 3183–3223 (09:41–09:42Z) | 2026-10-21 | The author's real `/codebase-design` run; a Standards reviewer judgement call | n/a |
| A22 | git commit `1262b31` (PR #7) | 2026-10-21 | Validation moved from the route into the comments module | n/a |
| A23 | Scott Logic, "An honest review of Matt Pocock's Skills framework", https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html | 2026-10-19 | A user's mixed experience, including tests that mostly checked their own mocks | n/a |
| A24 | aihero AI Coding Dictionary entries `deep-module` and `seam` | returned 404 on 2026-10-23 | Not usable | n/a |

## Key facts (pinned to v1.3.1)

**Two Skills, two jobs.**
- `/codebase-design` is a **reference** (a vocabulary). It has no process. [A1, A11]
- `/improve-codebase-architecture` is a **survey**. It finds candidates, writes a report, then grills you on the one you pick. [A4, A12]
- In ask-matt's words, the survey finds the candidates and codebase-design is the bench you design the chosen one on. [A8]

**codebase-design**
- **Model-invoked.** The frontmatter has no `disable-model-invocation`, and the Codex file has no implicit-invocation block. [A1, local `agents/openai.yaml`]
- The agent can load it on its own when a design task fits, and you can type `/codebase-design` (namespaced form: `/mattpocock-skills:codebase-design`, the form seen in A21). [A11, A21]
- New in 1.0.0 (2026-06-17). The vocabulary used to live inside improve-codebase-architecture as `LANGUAGE.md`. [A6]
- The old `design-an-interface` Skill was removed in 1.2.0. Its "design it twice" technique now lives here as `DESIGN-IT-TWICE.md`. [A6]

The vocabulary (A1, paraphrased). Use these words exactly; the Skill bans "component", "service", "API" and "boundary".

- **Module**: anything with an interface and an implementation, at any scale (a function, a class, a package, a slice across tiers).
- **Interface**: everything a caller must know to use the module correctly. That's the type signature plus invariants, ordering rules, error modes, required config and performance traits.
- **Implementation**: the code inside the module.
- **Depth**: leverage at the interface, meaning how much behaviour a caller or test gets per unit of interface it has to learn. A module is deep when a lot sits behind a small interface, and shallow when the interface is nearly as complex as the implementation.
- **Seam** (Feathers): a place where you can change behaviour without editing in that place. It's where an interface lives, and choosing where it goes is its own decision.
- **Adapter**: a concrete thing that fills an interface at a seam. The word names a role, not what's inside.
- **Leverage**: what callers get from depth. One implementation pays back across many callers and tests.
- **Locality**: what maintainers get from depth. Changes, bugs and verification concentrate in one place.

Four principles [A1]:
1. Depth is a property of the interface, not the implementation. Internal seams are allowed.
2. **Deletion test**: imagine deleting the module. If the complexity vanishes, it was a pass-through. If it reappears across many callers, it was earning its keep.
3. **The interface is the test surface.** If you want to test past it, the module is the wrong shape.
4. **One adapter means a hypothetical seam; two adapters mean a real one.** Don't cut a seam until something actually varies across it.

Testability tips [A1]: accept dependencies rather than creating them; return results rather than causing side effects; keep the surface small.

Rejected framing [A1, A11]: the Skill deliberately doesn't use Ousterhout's "ratio of implementation lines to interface lines" definition of depth, because it rewards padding the implementation. It uses depth-as-leverage instead.

DEEPENING.md [A2]:
- Four dependency categories decide how a deepened module gets tested: **in-process**, **local-substitutable** (e.g. PGLite), **remote but owned** (ports and adapters), **true external** (mock).
- "Replace, don't layer": once tests exist at the deepened interface, delete the old shallow unit tests.

DESIGN-IT-TWICE.md [A3]:
- Frame the problem for the user, then spawn 3+ parallel sub-agents, each with a different constraint (minimal interface / maximum flexibility / easiest common caller / ports and adapters).
- Compare the results on depth, locality and seam placement, then give an opinionated recommendation.

**improve-codebase-architecture**
- **User-invoked** (`disable-model-invocation: true`). Only you can start it by typing `/improve-codebase-architecture`. [A4, A12]
- **Step 1, Explore.**
  - YAGNI scoping comes first. If you name a direction it takes it. Otherwise it walks back through `git log --oneline` to find hot spots, because a deepening in code nobody touches never pays back. This scoping was added in 1.2.0. [A4, A6]
  - It reads `GLOSSARY.md` and the relevant ADRs.
  - A sub-agent then explores and notes friction: concepts spread across many small modules, shallow modules, pure functions extracted only for testing, leaks across seams, code that's untested or hard to test.
  - The deletion test filters the candidates.
- **Step 2, HTML report.**
  - One self-contained file at `<tmpdir>/architecture-review-<timestamp>.html` (from `$TMPDIR`, falling back to `/tmp`). Nothing lands in the repo. It opens the file and prints the path.
  - Tailwind and Mermaid load from CDNs.
  - Each candidate card has: Files, Problem, Solution, Benefits (in terms of locality and leverage, plus how tests would improve), a side-by-side before/after diagram, and a badge: `Strong`, `Worth exploring` or `Speculative`.
  - The report ends with a **Top recommendation**.
  - It doesn't propose interfaces yet. It asks which candidate you want to explore. [A4, A5]
- **Step 3, grilling loop.**
  - It loads the `grilling` and `domain-modeling` Skills and walks the decision tree: constraints, dependencies, the module's shape, what sits behind the seam, which tests survive.
  - Along the way it can add terms to `GLOSSARY.md` (creating the file if needed).
  - If you reject a candidate for a lasting reason, it offers to record an ADR.
  - It can use design-it-twice for alternative interfaces. [A4]
- **ADR conflicts**: it only surfaces a candidate that contradicts an ADR when the friction is real, and marks the conflict on the card. [A4]
- **It never changes code.** The output of the whole run is a conversation and one HTML file. The refactor happens later, through the Main flow. [A12]

**Where it fits.**
- Off the Main flow, under "Codebase health". Run it whenever you have a spare moment. Picking a candidate produces an idea you take into `/grill-with-docs`. [A8]
- aihero also routes the decision into `/to-spec` → `/to-tickets` → `/implement`. [A12]
- Its end-of-flow counterpart is `/retro`: architecture improves the code, retro improves the environment. [A12]
- After `/diagnosing-bugs`, ask-matt sends you here when the real finding is that no good seam exists to lock the bug down. [A8]

**When not to use it.**
- To design a module you've already chosen: use codebase-design inside a driver Skill. [A11, A12]
- For an effort too big for one session: use `/wayfinder`. [A12]
- For "this one thing is broken": use `/diagnosing-bugs`. [A12]
- On dormant code. [A4]

**Matt's framing.**
- Agents speed up software entropy, so a codebase turns into a ball of mud faster. [A14 0:00; A15 2:53]
- Bad code is now the most expensive it has ever been. [A15 3:25]
- Ousterhout defines complexity as whatever makes a system hard to understand and change. [A15 2:18]
- Codebases full of shallow modules are hard for an agent to explore. [A15 12:54]
- Deep modules make testable codebases that reward TDD. [A15 12:20, 14:35]

**Enforcing deep modules in TypeScript** (an open question in the docs) [A9, A11]:
- The beta `setup-ts-deep-modules` Skill (in-progress, user-invoked, not in the plugin) wires dependency-cruiser so code outside a package can only import its root "entry point" files.
- Its config has four rules: entry-point boundary, intra-package freedom, tests through entry points, no cycles.
- It finishes by proving a deep import fails the lint.
- Matt has also said Effect is his preferred way to enforce boundaries. [A13; A11 citing #458]

### Newer on GitHub main
- **No differences.** All six files (codebase-design: SKILL, DEEPENING, DESIGN-IT-TWICE; improve-codebase-architecture: SKILL, HTML-REPORT) match both `main` and tag `v1.3.1` as of 2026-10-23. [A10]
- **Stale on aihero (A11, A12)**:
  - Both pages say the instructions name Claude Code's `Agent` tool or `subagent_type=Explore`. Version 1.2.3 (2026-08-06, PR #781) removed those names. The local text just says to spawn sub-agents. [A6, A1, A3, A4]
  - A11 calls issue #449 open. Matt closed it on 2026-10-06 and won't add a guard; naming a driver Skill is the official workaround. [A16]
  - The promo card in A13 says the Skill "audits and refactors". It doesn't refactor; it never changes code. [A12]
  - A12 says diagnosing-bugs sends you back here. Since 1.3.0 the diagnosing-bugs Skill itself no longer does that (its post-mortem hand-off was removed in #880). Only the ask-matt router suggests it now. [A6, A8]
- **Unreleased change on main affecting a neighbour**: a `tdd` changeset has tdd note what each proposed seam catches and misses. It's already in the installed cache. [A10, A21 line 1400]

## Day-to-day usage

**Matt**
- Runs it every couple of days, especially on fast-moving codebases. [A14 9:59]
  - The README says every few days. [A7]
  - ask-matt says whenever you have a spare moment. [A8]
- Turns off Claude Code's auto mode for this flow, because auto mode behaves oddly in human-in-the-loop flows. [A14 5:33]
- Picks the candidate himself. In the demo it found six; he chose one where the same concept had two parallel implementations with no single seam, so the win was locality. [A14 6:06]
- Grills on the chosen candidate. In the video he let it pick its recommended answers only to save time, and says that normally he'd answer each question thoughtfully. [A14 7:13, 7:47]
- Turns the result into an issue for an AFK agent. In the video he used the older to-PRD/to-issues Skills, which are now `/to-spec` and `/to-tickets`. [A14 7:47, 8:53; A6]
- Says the Skill demands a lot of you, the human. It isn't an AFK Skill. Agents are tactical programmers; you're the strategic one. [A14 8:53, 9:27; A15 17:18]
- Splits the work on purpose: you design and own the interfaces, and the agent can own the implementation behind them, verified by tests at the interface ("grey box" modules). He wouldn't do this for critical code such as finance. [A13; A15 14:02, 15:07]
  - Short quote, A15 at 16:13: "Design the interface, delegate the implementation."
- Names module changes and interfaces in his PRDs/specs. [A15 16:45]
- For legacy code, start with this Skill to find seams for a test harness before making changes. [A14 10:32]
- Before a big build, point it at the spec and ask "how can we make this change easy?" (aihero calls this the most effective prompt). [A12]

**Others** (aihero aggregates issue threads; plus community)
- Four uses: routine upkeep, before a big build, brownfield audit, legacy test work. [A12]
- One candidate per session. Carry the candidate forward, not the temp file, and turn the rest into tickets. [A12]
- Ask "don't grill me, just show the report" if you only want the survey. [A12]
- In a codebase with no shared vocabulary, run `/grill-with-docs` first. [A12]
- Results vary on very messy legacy code: one user saw it go in circles, while tidy repos give clean results. [A12]
- When resuming design work, name a driver Skill (`/grill-with-docs`, `/improve-codebase-architecture`, `/tdd`) with codebase-design underneath. [A16]

## Common mistakes
1. **Running `/codebase-design` as if it were a process.** With no stopping rule, the agent invents one: it re-explores the code, fires design-it-twice sub-agents, and in one report ran about 105k tokens before asking anything. Fix: run a driver Skill. [A11, A16]
2. **Letting the survey carry on into implementation.** One user saw agents start refactoring after they agreed with a proposal. Matt called it a harness failure, not the Skill's. The Skill should end with a decision, not a diff. [A17, A12]
3. **Working several candidates in one session.** The context window fills with report, grilling and edits. [A12]
4. **Tidying code nobody touches.** It never pays back; the scan is biased to hot spots for that reason. [A4, A6]
5. **Adding a seam with one adapter.** That's just indirection. [A1, A2]
6. **Using loose words** ("component", "service", "boundary", "API", "cleaner code"). The report style bans them. [A1, A5]
7. **Confusing folder structure with deep modules.** Matt keeps saying the two are separate concerns. [A11 citing #95, #458]
8. **Expecting to hear the code is fine.** It rarely says so. A report where every card is `Speculative` means it found nothing. [A12]
9. **Weaker models skip the report** and grill on their first idea. [A12]
10. **Opening the report offline or behind strict security**: CDN Tailwind/Mermaid fails silently. Ask for inline CSS and SVG instead. [A12, A5]
11. **Testing past the interface, or keeping old shallow unit tests** after deepening. [A1, A2]
    - Illustration from another user: the agent wrote CRUD tests for every entity around a ~15-line shared adapter, so the tests mostly checked their own mocks. [A23]
12. **Letting the AI design the interfaces too.** Matt keeps interface design for himself. [A15 14:02]

## Try it yourself (about 15–20 minutes, on this site's repo or any small repo)
1. Run `git switch -c try/architecture` so nothing you accept touches `main`. You need an internet connection; the report loads styles from a CDN.
2. **Spot a deep module (3 min).** Open `src/lessons/lessons.ts`. The interface is three functions: `listLessons`, `getLesson`, `lessonExists`. Behind them it hides reading files, parsing each header, sorting, Markdown to HTML, and the previous/next links. [A20]
3. **Deletion test by hand (2 min).** Imagine deleting `src/app/api/comments/route.ts`. It's an **adapter** that only turns HTTP into module calls. ADR 0001 keeps it thin on purpose, and its own comment says validation and SQL live in the comments module. [A20]
4. **Run the survey (10 min).** Type exactly:
   `/improve-codebase-architecture Focus on src/comments and src/lessons. Show me the report first, and don't start grilling until I pick a candidate.`
   - Read every card in the HTML file that opens.
   - Pick one and answer one or two grilling rounds, or reply: `Stop here. I'm not changing anything today.`
5. **Check (2 min).** Run `git status`.

It's working if:
- [ ] The only new file is `architecture-review-<timestamp>.html` in your temp folder, and `git status` shows nothing changed in `src/`.
- [ ] Cards use the site's own words (Lesson, Comment, Slug), not made-up class names.
- [ ] Cards use module / interface / seam / adapter / depth / leverage / locality, never component / service / boundary.
- [ ] Every card has Files, Problem, Solution, Benefits, a before/after diagram and a Strong / Worth exploring / Speculative badge, and the report ends with a Top recommendation.
- [ ] It stopped and asked which candidate you wanted.
- [ ] You can say in one sentence why `lessonsFrom(dir)` is a real seam: it has two adapters, the real `content/lessons` folder and the test fixture folders.
- [ ] If a card proposes a new seam, it names a second adapter (or you notice that it doesn't).

## Site story
**Real (sources A20–A22):**
- **The author's `/codebase-design` run.** At 2026-10-21T09:39Z, minutes after v1 shipped, the author typed `/mattpocock-skills:codebase-design` with no other instruction. [A21 line 3094]
  - The agent answered in one reply (09:40:05Z), treating the Skill as words to judge the code with: [A21 line 3101]
    - **Lessons**: deep (3 functions).
    - **Comments**: deep (2 functions), and deeper since the review fix because callers can pass it anything.
    - **Comments route**: an intentionally thin adapter (ADR 0001).
    - **Comment box (`<Discussion lesson=…/>`)**: deep for its size.
    - **`lessonsFrom(dir)`**: a real seam with two adapters (real folder plus fake test folder).
    - **Comments to the database**: only one adapter (real Neon, with tests on the `test` branch), so no seam should be added.
    - **Verdict**: change nothing.
  - It didn't spiral the way issue #449 describes. That makes it a useful contrast for the "reference, not a driver" point.
- **PR #7 was a deepening move.** Commit `1262b31` (2026-10-21) moved the "is it a JSON object?" check out of `route.ts` into `postComment`. The comments module now checks all input, and the route "only speaks HTTP". [A22, A20]
- **A real internal-seam candidate.** Reviewing PR #7, the Standards reviewer said `postComment` does two jobs (check untrusted input, then save) and suggested a `parseCommentInput` step. That would also remove a `fields.lesson as string` cast. [A21 lines 3183, 3223]
  - As of `d21fc2c` it hasn't been done; `src/comments/comments.ts` has no `parseCommentInput`. [A20]
  - The comments module still has no direct tests of its own (it's tested through the route tests), as the Spec reviewer noted. [A21 line 3213]
- **The spec already uses the vocabulary.** It calls the Lessons module "the one seam", tested through its public functions with fixture folders. [A20 `.scratch/main-flow-and-redesign/spec.md` lines 64, 113]

**Not yet done:** `/improve-codebase-architecture` has never been run on this repo (no log entries; checked every session log under `~/.claude/projects/*trying*`). Suggested worked example: run the exercise prompt above and write the "How I used it" box from what actually comes back. The PR #7 move and the open `parseCommentInput` judgement call are real, citable before/after material. Don't predict which cards the report will show.

## Candidate quiz questions
1. **You type `/codebase-design` in a fresh session and leave. When you return, the agent has re-explored the whole repo and spun up sub-agents to design interfaces. Why?**
   - A) codebase-design is a reference with no process; run a driver Skill (e.g. /improve-codebase-architecture) with it underneath ✔
   - B) You forgot `/setup-matt-pocock-skills`
   - C) codebase-design is user-invoked, so it ran incorrectly
   - D) Effort was set too low

   *Why:* with no stopping rule, the agent improvises a process. *Source:* A11, A16
2. **Which is the sign of a shallow module?**
   - A) Its interface is nearly as complex as its implementation ✔
   - B) It's over 200 lines
   - C) It lives in one file
   - D) It has no tests

   *Source:* A1
3. **You imagine deleting a `formatDate()` wrapper that just calls one built-in method from a single place. Nothing gets harder. What does the deletion test say?**
   - A) It was a pass-through; complexity vanishes with it ✔
   - B) It's deep and earning its keep
   - C) It's a seam
   - D) It needs a second adapter

   *Source:* A1
4. **`lessonsFrom(dir)` gets `content/lessons` in production and fixture folders in tests. How many adapters, and is the seam real?**
   - A) Two adapters, so the seam is real ✔
   - B) One adapter, so it's hypothetical
   - C) Zero; it's implementation
   - D) Seams only exist across a network

   *Source:* A1, A20, A21
5. **The report suggests replacing the real test database with an in-memory fake, but ADR 0003 says tests hit real Postgres. What should the report do?**
   - A) Show it only if the friction is real enough to reopen the ADR, marked as contradicting ADR-0003, with the reason ✔
   - B) Implement it, because the Skill outranks ADRs
   - C) Delete ADR 0003
   - D) List every refactor any ADR forbids

   *Source:* A4
6. **Where does the architecture report go?**
   - A) The OS temp folder, as `architecture-review-<timestamp>.html`; nothing in the repo ✔
   - B) `docs/architecture.md`
   - C) `.scratch/<feature>/report.html`
   - D) A new GitHub issue

   *Source:* A4
7. **The report lists nine candidates. Best next step?**
   - A) Pick one, grill it, and take the decision into the Main flow (/grill-with-docs or /to-spec); leave the rest for later ✔
   - B) Have it implement all nine now
   - C) Commit the HTML report
   - D) Run /codebase-design on each one

   *Source:* A12, A8
8. **If you name no direction, how does it decide where to look first?**
   - A) It reads recent commit history to find hot spots ✔
   - B) Biggest files first
   - C) Alphabetical order
   - D) Only untested files

   *Source:* A4, A6
9. **You reject a candidate because Lessons are Markdown files on purpose, so adding one stays a single file. What should the Skill offer?**
   - A) To record an ADR so future reviews don't suggest it again ✔
   - B) To remove "Lesson" from GLOSSARY.md
   - C) To open a PR anyway
   - D) Nothing; rejections aren't recorded

   *Source:* A4
10. **In Matt's deep-module workflow, what's your job?**
    - A) Design the interfaces; the agent can own the implementation behind them, checked by tests at the interface ✔
    - B) Write the implementations while the agent designs the interfaces
    - C) Review every line the agent writes
    - D) Let the agent choose module boundaries

    *Source:* A15 16:13, A13

## Open questions / uncertain
- The dictionary entries for "deep module" and "seam" return 404, so there's no dictionary citation for those terms. [A24]
- The Ousterhout chapter titles ("Modules Should Be Deep", "Design it Twice") come from a secondary summary and the extract PDF. I didn't check them against the book.
- I didn't read Feathers' text; the definition of seam is from A1.
- A12's claim that the Skill "rarely" says the code is fine is opinion, not measured.
- Badge colours and diagram types vary from run to run, so screenshots in the Lesson should come from a real run.
