# Research: diagnosing-bugs (Lesson 13)

## Source map
All read on 2026-10-23.

| ID | Source | Date | What it covers / used |
|---|---|---|---|
| S1 | Local `skills/engineering/diagnosing-bugs/SKILL.md` (plugin path `~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/`; install commit `49dd158`) | commit 2026-10-09 | The whole Skill: Redact, Phases 1–6. Identical to GitHub main. |
| S2 | Same folder, `scripts/hitl-loop.template.sh` | same | Human-in-the-loop repro script: `step` and `capture` helpers, KEY=VALUE output |
| S3 | Local `docs/engineering/diagnosing-bugs.md`, same as live https://www.aihero.dev/skills-diagnosing-bugs | undated page | What it does; When to reach for it; tight loop; phase gates; Common questions; It's working if; Where it fits |
| S4 | Local `README.md` (1.3.1), section "#3: The Code Doesn't Work" and the Reference list | 1.3.1 | Listed as model-invoked; the "disciplined loop, gated phase by phase" framing |
| S5 | Local `CHANGELOG.md` | 1.0.0–1.3.1 | Renamed from `/diagnose` (1.0.0). "Something's broken" on-ramp added (1.1.0, #406). Redaction (1.2.3, #779). Phase 6 hand-off removed (1.3.0, #880). ask-matt points to `/retro` (1.3.1, #1121) |
| S6 | GitHub main `.changeset/diagnosing-bugs-prove-mutation.md` (PR #1209, fixes #955) | merged 2026-10-07 | Phase 5 "diff a forced mutation against a pristine copy". Unreleased, but already in the local install |
| S7 | Local `skills/engineering/ask-matt/SKILL.md`, "On-ramps" | 1.3.1 | "Something's broken" leads to `/diagnosing-bugs`, then `/retro`; a missing seam leads to `/improve-codebase-architecture` |
| S8 | GitHub issues on mattpocock/skills: #578 (open, 2026-07-15), #124 (closed not planned 2026-10-06), #674 (closed completed 2026-10-06), #955 (closed), #1205 (open, 2026-10-07), #1149 (open) | various | Real user failure reports |
| S9 | Matt Pocock, "Burn through the backlog from hell with /triage", https://www.youtube.com/watch?v=MzWIIlx0Gpc | 2026-05-07 (10:16) | 5:02–7:57: Matt has the agent diagnose a bug inside a triage session. English auto-captions. |
| S10 | AI Coding Dictionary, "Human-in-the-loop", https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop | 2026-07-01 | HITL vs AFK |
| S11 | Author's material: `content/lessons/09-diagnosing-bugs.md`, `content/lessons/04-wizard.md` (line 42), `content/lessons/08-pr-and-ship.md` (lines 39–41), `.scratch/lesson-site/issues/03-lesson-pages.md` (line 12), `.scratch/main-flow-and-redesign/issues/02-lesson-pages-with-photos.md` (line 63), `"use cache"` in `src/app/{layout,page,credits/page,learn/[slug]/page}.tsx`, commit `1262b31` | 2026-10-21 | Site story |

No Matt video is dedicated to diagnosing-bugs. I checked the channel list, https://www.aihero.dev/videos, and searches. The old `/diagnose` is not among the chapters of "5 Claude Code skills I use every single day" (https://www.youtube.com/watch?v=EJyuu6zlQCg, 2026-03-16).

## Key facts (pinned to v1.3.1 + commit 49dd158)

**What it is.** A gated, six-phase discipline for hard bugs and performance regressions (S1, S3).
- It refuses to let the agent theorise until a *tight* feedback loop exists. That loop is one named command, already run once, that goes red on this bug and green when it is fixed (S1 Phase 1, S3).
- The Skill says the right loop gets you most of the way: "Build the right feedback loop, and the bug is 90% fixed." (S1)

**Invocation.**
- Type `/diagnosing-bugs`. In Claude Code you can also type `/mattpocock-skills:diagnosing-bugs`.
- **Model-invoked.** The front matter has no `disable-model-invocation`. The agent starts it on its own when you say "diagnose" or "debug this", or report something broken, throwing, failing or slow (S1 front matter, S3, S4).
- It needs no setup and keeps no state (S3 "Where it fits").
- The old name `/diagnose` was removed in v1.0.0 (S5).

**Before anything else: Redact (added in 1.2.3).** The agent writes `<REDACTED>` in place of any secret it shows. It builds loops against environment variables, so credentials never appear in what it shows. From captured artifacts it quotes only the lines that matter. If the redacted output isn't enough, it says so and asks you (S1, S5).

**Phase 1, build a feedback loop ("This is the skill").** Ways to build a loop, roughly in order of preference (S1):
1. A failing test at whatever seam reaches the bug
2. A curl or HTTP script against a running dev server
3. A CLI run on a fixture, diffed against a known-good snapshot
4. A headless browser script (Playwright or Puppeteer)
5. A replayed capture of a real request, payload or event log
6. A throwaway harness: a minimal subset of the system
7. A property or fuzz loop, for "sometimes wrong output"
8. A bisection harness for `git bisect run`
9. A differential loop: same input, old version against new
10. Last resort: a human-in-the-loop bash script, `scripts/hitl-loop.template.sh`

Then the agent tightens the loop: faster, a sharper signal, more deterministic. A 30-second flaky loop is barely better than none; a 2-second deterministic one is "tight" (S1).

For bugs that only happen sometimes, the goal is a higher reproduction rate, not a clean repro. Loop the trigger, parallelise, add stress or sleeps. A bug that fails 50% of the time is debuggable; 1% is not (S1).

If no loop is possible, the agent stops, lists what it tried, and asks for one of three things: access to the environment, a redacted captured artifact, or permission for temporary instrumentation. It does not go on to hypothesise (S1).

**Phase 1 gate.** One command, already run (invocation and output shown, redacted), that is all four of (S1 lines 59–66):
- red-capable: it asserts the user's exact symptom, not "didn't crash"
- deterministic
- fast
- runnable by the agent alone (a human only via the HITL script)

If the agent catches itself reading code to build a theory first, it must stop. No red-capable command, no Phase 2.

**Phase 2, reproduce and minimise** (S1).
- Confirm the loop shows the failure the *user* described, not a nearby one. Wrong bug means wrong fix.
- Confirm it reproduces across runs, and capture the exact symptom.
- Then cut inputs, callers, config, data and steps one at a time, re-running the loop after each cut.
- Done when every remaining element is load-bearing: removing any one makes the loop go green.

**Phase 3, hypothesise** (S1).
- 3–5 ranked hypotheses, each falsifiable in the form "If X is the cause, then changing Y will make it disappear."
- The ranked list is shown to the user before testing. This is the only human checkpoint, and the agent proceeds with its own ranking if you're away (S3).

**Phase 4, instrument** (S1).
- Each probe maps to one prediction; change one variable at a time.
- Prefer a debugger or REPL, then targeted logs. Never "log everything and grep".
- Tag every debug log with a unique prefix such as `[DEBUG-a4f2]`.
- Performance branch: measure a baseline first, then bisect.

**Phase 5, fix plus regression test** (S1, S6).
- The regression test comes before the fix, but only at a *correct seam*: one where the test exercises the real bug pattern at the call site.
- If no correct seam exists, that is itself the finding. The agent records it.
- Steps: turn the minimised repro into a failing test, watch it fail, fix, watch it pass, then re-run the original Phase 1 loop.
- New on main (#1209): if the red was forced by mutating code or a fixture, the agent diffs against a pristine copy to prove the mutation actually landed.

**Phase 6, cleanup checklist** (S1).
- The original repro no longer reproduces.
- The regression test passes, or the missing seam is documented.
- A grep for `[DEBUG-` comes back empty.
- Throwaway prototypes are deleted.
- The commit or PR message states which hypothesis was correct.

**HITL template** (S2).
- `step "<instruction>"` waits for Enter. `capture VAR "<question>"` reads your answer.
- The script prints `KEY=VALUE` lines for the agent to parse.
- `capture` echoes its value back to the terminal, so sign-in stays a `step`, never a `capture`.

**What it produces.**
- A shown, red-capable repro command and its output
- A minimised repro
- A ranked hypothesis list
- A fix with a regression test, or a documented missing seam
- A commit or PR message naming the correct hypothesis (S1, S3)

**When to reach for it, and when not** (S3 table).
- **Yes:** a specific defect you can describe as a symptom; a timing regression with a known before and after; an intermittent flake; a regression between two known-good states.
- **No:**
  - an audit like "where are the bottlenecks?" (no Skill does that; a proposal was closed)
  - a raw report from someone else (use `/triage` first)
  - a design question (`/prototype`)
  - planned behaviour built test-first (`/tdd`)
- It is slow on purpose, so it's wrong for a one-message answer.

**How it connects to the Main flow.**
- In ask-matt it is an *on-ramp* ("Something's broken") that merges onto the Main flow (S7).
- After the fix, run `/retro` in the same session to ask what would have prevented the bug (S5 1.3.1, S7).
- If the finding is a missing seam, `/improve-codebase-architecture` is next. That Skill is user-invoked, so you start it yourself (S3).
- `/triage` does a shallow version of Phases 1–2 for incoming reports (S3).

### Newer on GitHub main / recently changed
- **Unreleased but already installed:** Phase 5 "prove a forced mutation landed" (#1209, merged 2026-10-07; S6).
- **1.3.0 (#880):** Phase 6's post-mortem hand-off to `improve-codebase-architecture` was removed, because a model-invoked Skill can't call a user-invoked one. Phase 6 is now cleanup only (S5).
- **1.3.1 (#1121):** ask-matt now points to `/retro` after the fix (S5).
- **The aihero.dev page is out of date in three places** (S3 vs S1/S8):
  - It says no instruction tells the agent to sanitise output and calls #674 "open and unimplemented". In fact the Redact section shipped in 1.2.3 and #674 closed 2026-10-06.
  - It calls #124 (a checkpoint before the fix) "still open". It closed as not planned on 2026-10-06, for lacking an observed failure.
- **Open proposals:** #578 "start light and escalate", labelled `ready-for-human` (over-firing on quick questions, especially on GPT-5.6-Sol). #1205: load later phases only after the current gate is met, because an agent jumped from CI logs straight to a hypothesis. #1149: operational regression probes.

## Day-to-day usage

**Matt (S9, 2026-05-07; Skill then called `/diagnose`):**
- **5:02–5:20:** While triaging bug #477, Matt felt the agent was too credulous about the reporter's analysis. He told it to diagnose the bug itself, in the same session.
- **5:29–5:43:** He keeps a rough context budget of about 100K tokens per session. He was at 46.5K, so he judged there was room to diagnose and fix.
- **6:57–7:23:** The Skill built a feedback loop: a unit test asserting the generated prompt contains no unresolved task ID. Matt notes it works like his TDD Skill, with the regression test and loop first and the fix inside the loop.
- **7:29–7:37:** He fixed it right there in the triage session.
- **7:38–7:49:** He often runs two sessions side by side, one triaging and one fixing on main.
- **7:53–7:57:** He switched to auto mode once it was clearly on track.

**Matt's documented routing (S7):** after the fix, `/retro` in the same session; for a missing seam, `/improve-codebase-architecture`.

**Others:**
- Several users on GPT-5.6-Sol report it firing on plain problem descriptions, building mock repro scenarios, and slowing replies. The workaround is to say "just answer, don't diagnose", or turn off model invocation in your harness (S3, #578).
- One user saw an agent load the full Skill and still jump from CI logs straight to a root-cause theory (#1205).
- A user flagged that repro output could leak credentials. That report led to the Redact section (#674, 1.2.3).
- A user found "watch it fail" could trust a red that a silent no-op edit never produced. That led to the pristine-copy diff (#955, #1209).

## Common mistakes
1. **Using it for a quick question.** It is slow by design. Say "just answer" (S3, #578).
2. **Theory before loop.** That is the exact failure the Skill exists to stop (S1 line 66, #1205).
3. **A loop that isn't red-capable**, e.g. "the build passes" or "no crash". It must assert the user's symptom (S1).
4. **Reproducing a nearby bug** instead of the reported one (S1 Phase 2).
5. **Skipping minimisation.** More moving parts means more suspects (S1).
6. **One hypothesis, or unfalsifiable "vibes"** (S1 Phase 3).
7. **Untagged debug logs left in the code** (S1 Phase 4).
8. **A regression test at a too-shallow seam.** It gives false confidence; record the missing seam instead (S1 Phase 5).
9. **Pasting secrets, cookies or HAR files unredacted** (S1 Redact).
10. **Expecting the agent to pause before the fix.** It won't; if you want that gate, ask for it when you invoke (S3; #124 closed not planned).
11. **Running an interactive script with `!` in the Claude chat.** It can't press Enter for you, so the script races through every prompt (S11, Lesson 4 line 42).
12. **Using it on a raw report from someone else.** Run `/triage` first (S3).

## Try it yourself (~15–20 min)

**Option A, on this site's real bug** (needs the repo running with `npm run dev`). The site returns HTTP 200 for an unknown Lesson Slug instead of 404 (S11, issue 03 line 12). In a fresh session, type:

```
/diagnosing-bugs Visiting http://localhost:3000/learn/nope shows the not-found page, but the HTTP status is 200 instead of 404. I expected 404. Stop after you've shown me your ranked hypotheses. Don't change any code yet.
```

**Option B, standalone** (no repo needed).
1. In a fresh session, type:
   ```
   Create a folder bug-practice with a tiny Node script total.js that reads cart.json and prints the order total. Plant one realistic, subtle bug that makes the total wrong for some carts. Don't tell me the cause and don't leave hints in comments. At the end, tell me only the command to run, the wrong output I'll see, and the correct output.
   ```
2. Type the Built-in command `/clear`, so the agent forgets the plant.
3. Type:
   ```
   /diagnosing-bugs In bug-practice, `node total.js` prints <wrong output> but should print <correct output>.
   ```

**It's working if:**
- [ ] Before any theory, it shows one command it has already run, with red output matching your symptom (for A, something like a curl printing `200`).
- [ ] It confirms the failure is the one you reported, not a different one.
- [ ] It shrinks the repro and can say why each remaining piece is needed.
- [ ] It shows 3–5 ranked hypotheses, each with a prediction you could falsify, before testing any of them.
- [ ] Any debug logs carry a tag like `[DEBUG-xxxx]`, and a grep for the tag is empty at the end.
- [ ] (If you let it fix) The regression test goes red before the fix and green after, or it tells you no correct seam exists.
- [ ] (If you let it fix) The commit message names the correct hypothesis.
- [ ] Afterwards, try `/retro` in the same session.

## Site story
- **What the author typed:** nothing. Lesson 9 says v1 never invoked the Skill, and the agent handled problems "with the same loop" (S11, lines 20–22). For the rewrite: the repo shows no evidence of the Skill's gates (a red-capable command shown first, ranked hypotheses, tagged logs). Present these as everyday debugging, not as `/diagnosing-bugs` runs.
- **The five incidents** from the Lesson 9 table, with evidence in the repo:
  1. **The Wizard raced through every question.** It was run with `!` inside the chat, which can't press Enter. Fix: run it in a real terminal (Lesson 4 line 42).
  2. **Build error "uncached data during prerendering".** Fix: `"use cache"`, now present in four page/layout files.
  3. **`/learn/nope` returns 200, not 404.** With Cache Components the page streams, so the status is sent before `notFound()` runs. Next.js still adds `noindex`. Accepted for v1; a true 404 needs a Proxy check. Still unfixed: there is no `proxy.ts` in the repo (issue 03 line 12; Next.js 16.4.2). This is a ready-made Try-it bug.
  4. **A wait-loop never finished.** It read the wrong output stream (Lesson 9 only).
  5. **A preview Comment "showed up" on the real site.** It was two different Comments. Checking both databases showed they were separate (Lesson 8 lines 39–41).
- **Another unresolved warning:** the dev server logs "encountered URL data during prerendering" (`await params` outside `<Suspense>`). It was left alone because the build passes (main-flow issue 02, line 63). This is a second candidate exercise.
- **The author's own lesson** from Lesson 9 is to look at evidence (logs, actual database rows) before deciding what's wrong. It matches the Skill's "no theory without a loop".

## Candidate quiz questions
1. **You report "the export button throws on big files". With `/diagnosing-bugs`, what must the agent show you before it offers any theory?**
   - a) A ranked hypothesis list
   - **b) A command it has already run that goes red on your exact symptom ✔**
   - c) A merged regression test
   - d) A summary of every file in the export module

   *Why:* the Phase 1 gate: no red-capable command, no Phase 2. (S1)
2. **The agent's loop is "`npm run build` passes". Why doesn't that count?**
   - a) It's too slow
   - **b) It doesn't assert the user's symptom, so it can't go red on this bug ✔**
   - c) Agents can't run builds
   - d) Loops must be curl scripts

   *Why:* the loop must be red-capable, not "runs without erroring". (S1)
3. **A bug shows up about 1 run in 100. What does the Skill advise?**
   - a) Mark it needs-info and stop
   - **b) Raise the reproduction rate: loop the trigger, parallelise, add stress, until it's debuggable ✔**
   - c) Read the code carefully instead
   - d) Log everything and grep

   *Why:* for flaky bugs the goal is a higher repro rate. (S1)
4. **Reproducing the bug needs a human to sign in and click. What does the Skill use?**
   - a) It asks you to paste your password into chat
   - **b) `hitl-loop.template.sh`: the agent runs it, you follow the prompts, your answers come back as KEY=VALUE ✔**
   - c) It skips Phase 1
   - d) `/wizard`

   *Why:* the HITL script is the last-resort loop, and sign-in stays a `step`. (S2)
5. **When is minimising done?**
   - a) After three cuts
   - **b) When removing any remaining element makes the loop go green ✔**
   - c) When the repro fits on one screen
   - d) When the test runs in under a second

   *Why:* every remaining element must be load-bearing. (S1)
6. **What does a good Phase 3 look like?**
   - a) One best guess, tested at once
   - **b) 3–5 ranked hypotheses, each stating a falsifiable prediction, shown to you before testing ✔**
   - c) Ten hypotheses ranked by file size
   - d) No hypotheses; go straight to logging

   *Why:* a single hypothesis anchors; a prediction makes it testable. (S1)
7. **The only available test is a unit test that can't recreate the chain of callers that triggered the bug. What should the agent do?**
   - a) Write that unit test anyway
   - **b) Say no correct seam exists and record that as a finding ✔**
   - c) Skip the fix
   - d) Delete the extra callers

   *Why:* a shallow test gives false confidence; a missing seam is a finding for `/improve-codebase-architecture`, which you start. (S1, S3)
8. **The fix is in. What does ask-matt suggest next, in the same session?**
   - a) `/triage`
   - **b) `/retro`, to ask what would have prevented the bug ✔**
   - c) `/compact`
   - d) `/wizard`

   *Why:* 1.3.1 routes "Something's broken" to `/retro` once the fix lands. (S5, S7)
9. **The repro output includes an `Authorization:` header. What should the agent do?**
   - a) Paste it in full for accuracy
   - **b) Show `<REDACTED>` in its place and build loops on environment variables ✔**
   - c) Refuse to debug
   - d) Commit it to a debug folder

   *Why:* Redact comes first, before any output is shown. (S1, S5 1.2.3)
10. **You write "the page is broken" without typing any slash command, and the agent starts `/diagnosing-bugs` itself. Is that expected?**
    - **a) Yes. It's model-invoked, so the agent can start it when you report something broken ✔**
    - b) No, only you can start Skills
    - c) Only after `/triage`
    - d) Only in plan mode

    *Why:* the description triggers on broken, throwing, failing or slow. (S1, S3, S4)

## Open questions / uncertain
- Did any v1 incident actually run under the Skill? The repo has no transcript evidence. The author should confirm before the rewrite claims so.
- Option A needs the reader to run the site locally (database env vars may be needed for the Discussion panel, though not for the 404 check). Decide whether the course assumes readers have cloned the repo.
- The "wait-loop read the wrong stream" incident has no other trace in the repo.
