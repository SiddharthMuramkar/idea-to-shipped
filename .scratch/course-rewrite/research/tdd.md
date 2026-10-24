# Research note: `tdd` (Lesson 8)

## Source map
All read on 2026-10-23.

| ID | Source | Date | What it covers | Timestamps / sections used |
|---|---|---|---|---|
| L1 | Local `skills/engineering/tdd/SKILL.md` at `/Users/siddharth/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/` | plugin labelled 1.3.1 (matches GitHub main, see "Newer on main") | The rules: good tests, seams, anti-patterns, rules of the loop | whole file |
| L2 | Same folder: `tdd/tests.md`, `tdd/mocking.md` | same | Good and bad test examples; mock only at boundaries; dependency injection; SDK-style interfaces | whole files |
| L3 | Same folder: `docs/engineering/tdd.md` (source of the aihero page) | same | What it does, when to use it, common questions, "It's working if" | whole file |
| L4 | https://www.aihero.dev/skills-tdd | published 2026-04-27, metadata updated 2026-08-24 (text matches main docs) | Public copy of L3 | "It's working if", "Common questions" |
| L5 | Same folder: `README.md`, "#3 The Code Doesn't Work" and the Reference list | 1.3.1 | Why TDD and feedback loops; `tdd` listed as model-invoked | sections named |
| L6 | GitHub release v1.1.0, https://github.com/mattpocock/skills/releases/tag/v1.1.0 | 2026-07-08 | `tdd` became a reference-only Skill; refactor step dropped; seams introduced; tautological anti-pattern added | entry #464 |
| L7 | GitHub v1.3.1 tag compared with main, plus `.changeset/tdd-seam-tradeoffs.md` (commit 3f59913) | tag 2026-10-04; changeset 2026-10-07 | Seam catch/miss note added on main, not in the tag | diff |
| L8 | GitHub issues #589 (open), #607 (closed completed 2026-10-07), #746 (closed not planned 2026-10-06), #129 (closed) | various | Description/body mismatch; seam-choice friction; "should this be tested at all?"; no view of sibling tickets | issue pages |
| V1 | Matt Pocock, "Red Green Refactor is OP With Claude Code", https://www.youtube.com/watch?v=hYZdIwFIy-c | 2026-02-23 (5:19) | Why red-green suits agents; one test at a time; feedback loops | 0:00–0:50, 0:55–1:50, 2:01–2:58, 3:18–4:12, 4:13–4:20, 4:25–5:02 |
| A1 | aihero post "My Skill Makes Claude Code GREAT At TDD", https://www.aihero.dev/skill-test-driven-development-claude-code | 2026-02-10 (Mux video 6:15) | Older TDD Skill: planning phase, vertical slices, refactor step | page text |
| V2 | AI Engineer workshop, "Full Walkthrough: Workflow for AI Coding — Matt Pocock", https://www.youtube.com/watch?v=-QFHIoCo-Ko | 2026-04-24 (1:36:30) | TDD in a live run; vertical slices; feedback loops as the quality ceiling; testable code | 0:43:00, 1:06:00–1:08:00, 1:09:00–1:11:00, 1:16:00 |
| V3 | AI Engineer Paris, "Fixing the PR Bottleneck — Matt Pocock, AIHero", https://www.youtube.com/watch?v=LlgiOCmFG_w | 2026-09-25 (22:34); transcript is an auto-translated track | Automated checks can lie: tautological tests, tests tied to file structure, tests that can't fail | 5:00–8:00, 8:00–11:00, 13:00–14:00 |
| A2 | aihero post "Essential AI Coding Feedback Loops For TypeScript Projects", https://www.aihero.dev/essential-ai-coding-feedback-loops-for-type-script-projects | updated 2026-01-16 | Typecheck script, tests, Husky pre-commit hook; agents don't mind retrying | sections 1–3 |
| L9 | Same folder: `skills/engineering/ask-matt/SKILL.md` | 1.3.1 | `tdd`'s place in the Main flow (inside `/implement`) | main flow step 3 |
| C1 | alexop.dev, "A Claude Code TDD Skill: Forcing Red-Green-Refactor Discipline", https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue | 2025-11-30 | A community approach: one subagent per phase to stop "context pollution"; skill fired about 20% of the time without hooks | whole post |
| R1 | Repo: `content/lessons/08-tdd.md`; PRs #2, #4, #7 (`gh pr view`); `.scratch/lesson-site/issues/03–06`; `.scratch/main-flow-and-redesign/spec.md` (Testing Decisions) and issues 02, 04; `docs/adr/0003-tests-hit-real-postgres.md` | 2026-10-21 to 22 | The author's real TDD runs | as cited |

## Key facts (pinned to v1.3.1)
- **What it is.** A reference Skill for the red → green loop. It holds the standards that make the loop produce tests worth keeping: what a good test is, where tests go (seams), the anti-patterns, and the loop's rules (L1). The docs call it "a reference, not a driver": something else runs the session (you, or `/implement`) (L3).
- **How you start it.** Type `/tdd`; with the plugin it's also reachable as `/mattpocock-skills:tdd`. It is **model-invoked** (no `disable-model-invocation`), so the agent also reaches for it when you build or fix something test-first, say "red-green-refactor", or ask for integration tests (L1 frontmatter, L5 Reference).
- **It reads the project's language.** It reads `GLOSSARY.md` so test names use the domain words, and it respects ADRs in the area being changed (L1).
- **How it works, step by step** (L1):
  1. **Agree the seams first.** A seam is the public boundary where you observe behaviour without reaching inside. Before any test exists it asks what the public interface is and which seams to test, then waits. No test goes at an unconfirmed seam. *(On main and in the local copy only: each proposed seam comes with a one-line note on what it catches and what it misses; see "Newer on main".)*
  2. **Red.** Write one failing test. The first one is a "tracer bullet" that proves one path works end to end.
  3. **Green.** Write only enough code to pass it. Don't anticipate future tests or add speculative features.
  4. **Repeat** one slice at a time: one seam, one test, one minimal implementation.
  5. **No refactor step.** Refactoring belongs to the review stage (`code-review`), not the loop.
- **What a good test is** (L1, L2): it checks behaviour through public interfaces, reads like a specification ("user can checkout with valid cart"), survives refactors, and makes one logical assertion.
- **Three anti-patterns** (L1, L2):
  - **Implementation-coupled:** mocks internal parts, tests private methods, or checks through a side channel such as querying the database directly. The tell: it breaks on a refactor even though behaviour didn't change.
  - **Tautological:** the expected value is computed the same way the code computes it (or a constant is asserted equal to itself), so it passes by construction. Expected values must come from an independent source: a known literal, a worked example, the spec.
  - **Horizontal slicing:** all the tests first, then all the code. That tests imagined behaviour and locks in a test structure too early.
- **Mocking** (L2): fake only at system boundaries: outside APIs, time and randomness, sometimes the database (a test database is preferred) and the filesystem. Never fake your own modules. To make boundaries easy to fake, pass dependencies in (dependency injection) and give each outside operation its own function (SDK-style).
- **What it produces:** tests plus code. It's stateless and writes no files of its own (L3).
- **When to reach for it** (L3): a concrete behaviour with inputs and an observable output (business logic, a request/response contract, a transformation, validation).
- **When not to:**
  - The behaviour isn't pinned down yet → `/to-spec`.
  - The real question is the interface's shape → `codebase-design`.
  - You want a whole spec built → `/implement`.
  - Config, glue, type annotations, plain CRUD: nothing decides whether these deserve the loop, so a test there tends to restate the code. Issue #746 asked for that check and was closed "not planned", so it stays your call (L3, L8).
  - Don't write browser/end-to-end tests first: the loop gets too slow to pay off. Say so in `CLAUDE.md` (L3).
- **Neighbours on the Main flow** (L3, L9):
  - `/to-spec` agrees the seams up front.
  - `/implement` drives `tdd` per ticket; each `/implement-spec` implementer calls it.
  - `/code-review` checks afterwards that only agreed seams were used, and does the refactoring.
  - `codebase-design` supplies the shared words: seam, deep module, interface.
- **History** (L6, L3, A1, V1):
  - **Before v1.1** (February 2026 post and video): the Skill had a planning phase and a refactor step done once all tests pass.
  - **v1.0** (2026-06-17): the deep-module and interface notes moved to `codebase-design`.
  - **v1.1.0** (2026-07-08): rewritten as reference-only. Refactor dropped (the docs date this to June 2026) because agents almost never did it and implementation and review work better as separate sessions. "Seam" introduced; tautological anti-pattern added.
  - The description still says "red-green-refactor". That mismatch is #589, still open; the phrase keeps triggering the Skill (L3, L8).

### Newer on GitHub main
- **The local "1.3.1" folder matches GitHub main** (commit 5beb35b, 2026-10-19) for every `tdd` file. Compared with the **v1.3.1 tag** (2026-10-04), `SKILL.md` has one extra sentence: each proposed seam gets a note on what it catches and misses. That comes from the unreleased changeset `tdd-seam-tradeoffs` (2026-10-07, fixes #607). Plugin users already get this text (L7).
- **The docs/aihero page lags the Skill:** it still says no fix has shipped for #607 and still lists #746 as open (L3, L4, L8).
- No other differences.

## Day-to-day usage
- **Matt watches the red then the green instead of reading every test.** When he sees a test fail, then an implementation that doesn't touch the test turns it green, he trusts the test and just skims the titles. He QAs the committed work by hand afterwards to catch anything the tests missed (V1 2:01–2:58).
- **One test at a time is the rule he cares most about.** Agents like to write a huge batch of tests (his example: 90 at once) and then try to pass them all in one go, which produces poor tests (V1 3:18–4:12; L1 horizontal slicing).
- **TDD is his default for logic, in live runs too.** In the workshop his AFK prompt says to explore the repo, use TDD, then run the feedback loops. He points out the agent confirming red before green, and calls TDD essential wherever you can pull it off (V2 1:06:00–1:08:00).
- **Feedback loops set the ceiling** on how good an agent's code can be: types, tests, and a codebase that's easy to test (V2 1:09:00–1:10:00, 1:16:00; V1 4:25–5:02). His basic setup: a `typecheck` script, a test runner, and a pre-commit hook that runs lint, typecheck and tests, so the agent gets an error and retries (A2).
- **When he reviews TDD output, he reads the tests first, then the code** (V2 1:11:00).
- **Bad tests he has caught agents writing** (V3 5:00–8:00):
  - a test that asserts a character-limit constant equals its own value (tautological);
  - a test that reads a source file to check the order of two UI parts (tied to file structure);
  - a heavily faked browser audio API that can never fail.
  - His fixes are deep modules tested only through their small interface (V3 8:00–11:00), and enforcing standards in review rather than during implementation (V3 13:00–14:00).
- **Others:**
  - One builder found that a single-context TDD flow lets the implementation leak into the tests, so they split red, green and refactor into separate subagents. Without hooks, the skill fired only about 20% of the time (C1; their own skill, not Matt's).
  - Users report the agent writing code before the test even after reading the Skill. Matt's docs accept this, since no instruction gets 100% compliance; if strictness matters for a slice, watch the run (L3).

## Common mistakes
- Writing many tests first, then the code (horizontal slicing) (L1, V1 3:18–4:12).
- Tautological expected values, such as recomputing the answer or asserting a constant (L1, L2, V3 5:00–6:00).
- Checking through a side channel, such as querying the database, instead of the interface (L2).
- Faking your own modules; fake only outside boundaries (L2, V3 7:00–8:00).
- Picking a seam blind. Ask for the trade-offs first; main now gives them (L3, L7).
- Expecting a refactor step. There isn't one; refactoring happens in `/code-review` (L1, L3).
- Writing a browser test first (L3).
- Testing config or glue that has no independent source of truth (L3, L8).
- Expecting `tdd` to know about sibling tickets. It doesn't; pass the spec too or right-size the tickets (L3, #129).

## Try it yourself (~15–20 min)
**Setup:** an empty folder with Claude Code open in it, and the Skills installed.

**Type:**
```
/tdd In this empty folder, set up a tiny TypeScript project with Vitest, then build readingTime(text) for a Lesson page: it returns whole minutes at 200 words per minute, rounds up, and never returns less than 1. Before writing any test, tell me which seam you want to test at, what it catches and what it misses, and wait for my OK.
```
Answer "yes, test the public function `readingTime`".

**Behaviours to suggest if it asks:** empty text → 1; exactly 200 words → 1; 201 words → 2.

**It's working if:**
- [ ] It names the seam and waits before any test file exists.
- [ ] Exactly one test appears, you see it **fail**, then just enough code makes it pass, and only then does the next test appear.
- [ ] Test names describe behaviour ("201 words takes 2 minutes"), not internals.
- [ ] Expected values are plain numbers you could work out by hand (2), not recomputed with the same formula.
- [ ] Nothing is mocked.
- [ ] Afterwards, ask it to rename an internal helper: no test breaks.

## Site story (from the author's repo)
- **What he typed:** `/tdd`, four times, once per issue (03–06) (R1: `08-tdd.md`, "What I typed").
- **Issue 03, Lesson pages:** tests went on the lesson reader (list, get, exists) using fake lesson files. 7 tests; the pages themselves were checked by eye (R1; PR #2 says the module was built test-first against fixture files).
- **Issue 04, Comments table:** no tests, by agreement, because there was no public entry point yet. He checked the table exists on every database branch instead (R1).
- **Issue 05, Comments API:** tests on `GET`/`POST /api/comments` against the real Neon `test` database. 12 tests, including 2000 vs 2001 characters and broken JSON (R1; PR #4).
  - PR #4 added a safety check: `src/test/setup-env.ts` refuses to run unless the database URL comes from `.env.test.local`. That matters because the tests empty a table.
  - ADR 0003 says tests use real Postgres, never a faked database. That fits the Skill's "prefer a test database".
- **Issue 06, Comment box:** no tests, by agreement; the logic lives in the tested API. Checked by eye on the preview (R1).
- **His lessons learned** (R1):
  - A test that's green from the start is fine if you say so and don't pretend it went red.
  - Tests can be dangerous.
  - Deciding *where* to test matters more than testing everything.
- **Later:** code review found a crash none of his 19 tests had tried (a number sent instead of text). He fixed it test-first: a red test reproduced `.trim is not a function`, then all input checks moved into the comments module and it went green. That made 20 tests (PR #7; `10-code-review.md`).
- **In the Main flow redesign:**
  - The spec's Testing Decisions named **one seam: the Lessons module**, tested through its public functions with small fixture folders. The look was checked with screenshots, not tests (R1: main-flow spec).
  - Ticket 02 said "Build the Lessons module change with `/tdd`" and ended with 11 Lessons-module tests.
  - Ticket 04 added one test (the last Lesson is `main-flow`) that "went red before the file existed and green after".

## Candidate quiz questions
**Q1 [scenario]** You type `/tdd` to add comment-length validation. Before writing anything, the agent lists two places it could test and waits. What is it doing?
- A) Stalling because it can't find a test runner
- B) Agreeing the seams before any test exists **(correct)**
- C) Asking you to write the tests yourself
- D) Planning its refactor step

*Why:* No test goes at an unconfirmed seam. *Source:* L1 "Seams".

**Q2 [spot-the-mistake]** The code has `MAX_BODY = 2000`, and the test is `expect(MAX_BODY).toBe(2000)`. What's wrong?
- A) It's horizontal slicing
- B) It mocks an internal module
- C) It's tautological: it restates the code and can't disagree with it **(correct)**
- D) Nothing; constants should be tested

*Why:* A constant asserted equal to itself passes by construction. Test behaviour instead: posting 2001 characters is rejected. *Source:* L1 anti-patterns; V3 5:00–6:00.

**Q3 [scenario]** The agent writes 15 tests in one go, then all the code. What should it have done?
- A) Written the code first, then the tests
- B) One test, then just enough code to pass, then the next test **(correct)**
- C) Written 15 tests but run them one by one
- D) Asked you to choose which 15 tests to keep

*Why:* Tests written in bulk check imagined behaviour; vertical slices respond to what each cycle teaches. *Source:* L1; V1 3:18–4:12.

**Q4 [scenario]** Posting a Comment also sends an email through an outside email service. In your test, what may you fake?
- A) Your own comments module
- B) The function that validates the comment body
- C) The outside email service **(correct)**
- D) The Route Handler

*Why:* Fake only at system boundaries, never code you control. *Source:* L2 `mocking.md`.

**Q5 [scenario]** The Skill's description says "red-green-refactor", but after green the agent moves to the next test without tidying up. Is something broken?
- A) Yes; reinstall the Skills
- B) Yes; the model ignored the Skill
- C) No; the refactor step was removed, and refactoring now happens in `/code-review` **(correct)**
- D) No; you're meant to type `/refactor`

*Why:* Since v1.1 the loop is red → green; the description just wasn't updated (#589). *Source:* L1; L3; L6.

**Q6 [spot-the-mistake]** A test called "createUser saves to database" creates a user, then runs SQL against the table to check the row exists. What's the problem?
- A) It's tautological
- B) It checks through a side channel instead of the public interface **(correct)**
- C) It should mock the database
- D) It has two assertions

*Why:* Check through the interface, e.g. `getUser(id)` returns the user. *Source:* L2 `tests.md`.

**Q7 [scenario]** Why does the loop insist you see the test fail before writing code?
- A) A failing run proves the test really checks something **(correct)**
- B) A failing test makes CI faster
- C) The test runner needs a red run to cache results
- D) So the agent can delete the test later

*Why:* If the test goes red and then green without the test changing, it's hard to fake. *Source:* V1 2:01–2:58; R1 `08-tdd.md`.

**Q8 [scenario]** Which test name fits the Skill best?
- A) "postComment calls db.insert once"
- B) "empty name is saved as Anonymous" **(correct)**
- C) "test 3"
- D) "validateBody private helper returns true"

*Why:* Good names describe a capability, not internals. *Source:* L1; L3 "It's working if".

**Q9 [scenario]** You're moving a hard-coded colour into a CSS variable. Should you run `/tdd`?
- A) Yes, every change needs the loop
- B) Yes, with mocks for the stylesheet
- C) Probably not: nothing has an independent expected value, so a test would just restate the code **(correct)**
- D) Yes, but write a browser test first

*Why:* The Skill decides where seams go, not whether a change deserves the loop; that's your call. *Source:* L3 table; L8 #746.

**Q10 [sequence]** Put the loop in order:
1. confirm the seam
2. write one failing test
3. write just enough code to pass
4. write the next failing test

*Answer:* 1 → 2 → 3 → 4. *Source:* L1.

## Open questions / uncertain
- **Which video?** The title you gave, "My Skill Makes Claude Code GREAT At TDD", is an aihero post with a Mux-hosted 6:15 video (2026-02-10). I found no YouTube upload with that title. I used the closest YouTube video, "Red Green Refactor is OP With Claude Code" (5:19, 2026-02-23), whose description links to the TDD Skill. Both show the **older** Skill with a refactor step, so don't present their refactor advice as current.
- **"Green from the start."** The author's Lesson says a test that's green from the start is acceptable if you say so. The Skill says red before green. A Lesson should frame his point as "be honest, then make sure the test can fail", not as an exception to the rule.
- **Seam catch/miss note.** It's on main and in the local copy but not in the v1.3.1 tag. If a reader installs from the v1.3.1 tag via skills.sh, they won't see it.
