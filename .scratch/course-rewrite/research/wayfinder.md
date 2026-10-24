# Research: Lesson 18 `wayfinder` (/wayfinder for huge, foggy efforts, plus /research and /to-questionnaire)

Everything was read on 2026-10-23.

## Source map

| ID | Source | Published / updated | What it covers | Timestamps used |
|---|---|---|---|---|
| W1 | Local `skills/engineering/wayfinder/SKILL.md` | 1.3.1 cache (= main; see Newer) | Map, tickets, types, fog, out of scope, the two modes | n/a |
| W2 | Local `skills/engineering/research/SKILL.md` | 1.3.1 | Background agent, primary sources, one cited file | n/a |
| W3 | Local `skills/productivity/to-questionnaire/SKILL.md` | 1.3.1 | "Grill the send", three steps, template | n/a |
| W4 | Local `CHANGELOG.md` + tag dates (v1.1.0 2026-07-08, v1.2.0 2026-08-05, v1.3.0 2026-09-29) | n/a | When wayfinder, research and to-questionnaire arrived and changed | n/a |
| W5 | Local `ask-matt/SKILL.md` (On-ramps; Standalone) | 1.3.1 | Routing, the two wayfinder mistakes | n/a |
| W6 | Repo `docs/agents/issue-tracker.md`, section "Wayfinding operations" | 2026-10-21 | How the map works on this repo's local-markdown tracker | n/a |
| W7 | GitHub API: tag `v1.3.1` vs local vs `main`; `.changeset/wayfinder-labels-refs-research-prs.md`; `.out-of-scope/subagent-recursion.md` (commit `4d04daa`, 2026-10-06) | checked 2026-10-23 | Newer-on-main check | n/a |
| W8 | https://www.aihero.dev/skills-wayfinder | updated 2026-08-24 | Docs page: types table, common questions, it's working if | n/a |
| W9 | https://www.aihero.dev/skills-research | updated 2026-08-24 | Docs page: common questions, it's working if | n/a |
| W10 | https://www.aihero.dev/skills-to-questionnaire | updated 2026-08-24 | Docs page: common questions, it's working if | n/a |
| W11 | YouTube "/wayfinder: Nothing is too big to plan anymore", https://www.youtube.com/watch?v=F3lL98Pj90o | 2026-07-30 (15:09) | Chapters: 0:00 problems, 2:10 maps, 4:30 issue tracker, 5:39 setup and working, 7:40 types and blocking, 9:44 specs, 11:38 when to use | 0:33, 1:06, 2:11, 2:44, 3:17, 3:51, 4:24, 4:58, 5:30, 6:02, 6:35, 7:08, 7:40, 8:13, 8:45, 9:18, 9:50, 10:23, 10:56, 11:30, 12:02, 12:33, 13:06, 13:41, 14:15 |
| W12 | Matt on X, wayfinder → /to-spec → /to-tickets → /implement, https://x.com/mattpocockuk/status/2075856898142740821 | 2026-07-11 | The correct hand-off | n/a |
| W13 | Matt on X, "My new skill /wayfinder…", https://x.com/mattpocockuk/status/2072716979195326905 | 2026-07-02 | About 100 sessions feeding one map (excerpt only) | n/a |
| W14 | Latent Space, "The /wayfinder Skill: Navigating the Fog of War of Planning", https://www.latent.space/p/wayfinder-skill | 2026-08-20 | Interview: course planning, the Warcraft III fog-of-war analogy, leading words | n/a |
| W15 | Gilles d'Andrea, "Matt Pocock's Wayfinder skill gives fog a place on the map", https://ai.plainenglish.io/matt-pococks-wayfinder-skill-gives-fog-a-place-on-the-map-1dc288523ecb | 2026-07-25 | A practitioner's report: fog as a first-class idea, contrasted with Spec Kit's assumptions | n/a |
| W16 | Unhandled Exception Podcast ep. 88 show notes, https://unhandledexceptionpodcast.com/posts/0088-mattpocock/ | 2026-07-31 | to-questionnaire described while still in-progress | n/a |
| W17 | Repo `.scratch/` layout, `CLAUDE.md` (the Issue tracker pointer), session logs (no wayfinder, research or to-questionnaire use) | 2026-10-23 | Site story | n/a |

## Key facts (pinned to v1.3.1)

**/wayfinder**
- **User-invoked** (`disable-model-invocation: true`). [W1, W8]
- Graduated in 1.1.0 (2026-07-08), renamed from the in-progress `decision-mapping`. The unit was named a **decision ticket** in 1.2.0. [W4]
  - Matt was already posting about it on 2026-07-02. [W13]
- **What it is.** It plans an effort too big for one agent session: a known **destination**, with **fog** hiding the route. [W1]
  - It charts a shared **map** of **decision tickets** on the issue tracker and resolves them one at a time.
  - **Plan, don't do**: it produces decisions, not deliverables, unless the map's Notes explicitly override that.
- **The map.**
  - One issue labelled `wayfinder:map`, with tickets as child issues.
  - It's an **index, not a store**: one line per decision, linking to the ticket that holds the detail.
  - The body has four sections: `## Destination`, `## Notes`, `## Decisions so far`, `## Not yet specified` (fog), `## Out of scope`. Open tickets aren't listed; they're found by query.
  - Narration refers to tickets **by name**, never by a bare `#42`. [W1]
- **Tickets.**
  - The body is a `## Question`, sized to one roughly 100K-token session.
  - The only labels are `wayfinder:<type>`.
  - A session **claims** a ticket by assigning it before any work.
  - Blocking uses the tracker's native links.
  - The **frontier** is the open, unblocked, unclaimed tickets. [W1]
- **Four types** (every ticket is HITL, worked live with you, or AFK, the agent alone) [W1]:
  - `research` (AFK): resolved by a subagent running the `research` Skill.
  - `prototype` (HITL): resolved with the `prototype` Skill.
  - `grilling` (HITL, the default): resolved with `grilling` + `domain-modeling`.
  - `task` (either): manual work that unblocks a decision. It's the only type that *does* rather than decides.
  - A grilling agent that answers its own questions has broken HITL.
- **Fog or ticket?** The test is whether you can state the question precisely *now*, not whether you can answer it. A sharp but blocked question becomes a ticket. A vague one goes in Not yet specified. Out-of-scope work is closed and never graduates. [W1]
- **Two modes. Never resolve more than one ticket per session**, except research tickets. [W1]
  - **Chart the map**:
    1. Name the destination (grilling + domain-modeling).
    2. Do a breadth-first grilling round. **If no fog appears, stop and ask how to proceed.**
    3. Create the map.
    4. Create the tickets, then wire blocking edges and cross-references with real ids in a second pass.
    5. Fire a research subagent per research ticket, each on a throwaway `research/<name>` branch that is pushed but never PR'd.
    6. Stop.
  - **Work through the map** (`/wayfinder <map>`, ticket optional):
    1. Load the map at low resolution.
    2. Pick the named ticket or the first frontier ticket, and claim it.
    3. Resolve it as its label's type.
    4. Post the resolution, close the ticket, and append a pointer to Decisions so far.
    5. Graduate any fog that's now specifiable, and rule mis-scoped work out of scope.
- **On this repo's local-markdown tracker** [W6]:
  - The map is `.scratch/<effort>/map.md`.
  - Tickets are `.scratch/<effort>/issues/NN-<slug>.md`, with `Type:`, `Status:` (`claimed`/`resolved`) and `Blocked by: NN, NN` lines.
  - To claim, set `Status: claimed` and save first.
  - To resolve, add an `## Answer` heading, set `Status: resolved`, and add a gist plus link to the map's Decisions so far.
  - The Skill finds this doc through the `### Issue tracker` pointer in CLAUDE.md, not a hard-coded path (fixed in 1.1.0). [W4, W17]
- **Where it fits.**
  - A **situational on-ramp** and the heaviest flow in the set, not the default front door. Use it only for an idea you can't hold in one session. A well-scoped feature goes to `/grill-with-docs`. [W5, W4]
  - When the map clears, **it hands off; it doesn't build**: `/to-spec` (which collapses the linked decisions into a buildable spec), then `/to-tickets`, then `/implement`. [W5, W12, W8]
  - Going straight to `/implement` is only for efforts that turned out small. [W5]

**/research**
- **Model-invoked**, added in 1.1.0. [W2, W4]
- It runs a **background agent** so you keep working. The agent investigates against **primary sources** (official docs, source code, specs, first-party APIs), follows each claim to the source that owns it, writes **one cited Markdown file**, and saves it where the repo keeps notes (or somewhere sensible, telling you where). [W2]
- It never answers in chat; the output is the file. [W9]
- The file feeds `/grill-with-docs`; research informs the thinking rather than replacing it. [W5]
- The line between research and grilling is shelf life: facts versus decisions you keep. [W9]

**/to-questionnaire**
- **User-invoked**. It graduated from in-progress in 1.2.0. [W3, W4, W16]
- **Grill the send, not the subject.** It asks you only who the recipient is and what you need back, in one exchange each, then drafts questions aimed at the **gap** between what they know and what you need. [W3]
- It writes `to-questionnaire-<slug>.md` in the current folder. [W3]
- The template has: Purpose; From / To / How your answers will be used; Context; How to answer (deadline, "I don't know" welcome); themed `##` sections with questions most-important-first, one idea each, an answer stub `>`, and a "why this matters" line only where needed; and "Anything else?". [W3]
- It's not branching and it's for one recipient per run. [W10]
- ask-matt calls it the inverse of `/grill-me`. What comes back feeds `/grill-with-docs` or `/to-spec`. [W5]

### Newer on GitHub main
- **The local "1.3.1" `wayfinder/SKILL.md` is not the tagged v1.3.1 file.** It matches `main`, which includes three lines from commit `8295b8e` (2026-10-07) that came after the tag. Those lines are not in any release yet (`main` `package.json` still says 1.3.1): [W7]
  - Never add triage labels (like `ready-for-agent`) to maps or tickets.
  - Write cross-references only with real ids, because a placeholder `#<n>` auto-links to an unrelated issue.
  - Push research branches but open no PR.
  - Resolve each ticket as the type its label names, since the body never states the type.
- `research/SKILL.md` and `to-questionnaire/SKILL.md`: no differences. [W7]
- **The /research nested-agent bug (#530)** is called an open bug on aihero. On 2026-10-06 main declared it **out of scope**: stopping runaway sub-agents is the harness's job, not the Skill's. [W9, W7]
- **Stale on aihero:** the /research page calls wayfinder's research subagents "unreleased changes since v1.1". They shipped in 1.2.0 (2026-08-05). [W9, W4]

## Day-to-day usage

**Matt**
- Built wayfinder because single-session planning (grill-me / grill-with-docs) limited how ambitious he could be. The smart zone forced him to pre-chop the work. [W11 0:00, 1:06]
- Starts with grilling on the destination. In his command-palette example he wanted a buildable spec; the agent asked what "done" looks like and recommended a spec. [W11 2:11, 5:30, 6:02]
- Charting produced 7 tickets, of which 3 were takeable. He then ran **one new session per ticket**, invoking wayfinder with the ticket name or URL (sometimes using a handoff Skill to spawn the session). [W11 6:35, 7:08]
- Lets research tickets run in a sub-agent without watching. Uses prototypes heavily so the planning doesn't turn into waterfall. [W11 7:40, 8:13]
- Watches the frontier move as tickets resolve; one map was 14 of 17 done. [W11 9:18]
- Runs `/to-spec` on the finished map; the draft was too big for GitHub's character limit. Then `/to-tickets`, implement, code review. [W11 9:50, 10:23]
  - wayfinder takes `/grill-with-docs`'s place in the Main flow. [W11 10:23]
  - The spec links back to the decision tickets, so agents can check the primary source. [W11 10:56]
- Treats specs as temporary: he closes the spec issue once the code exists. [W11 13:06, 13:41]
- Uses it beyond code: course planning and a garden office. [W11 12:02, 14:15; W14]
- For coding, he prefers handing the spec to an AFK agent over running the whole build inside the map. [W12]
- His answer to "too heavy": if one session can plan it, plan it in one session. [W11 11:30]

**Others**
- A practitioner says wayfinder treats fog as first-class: a named section, a rule for when fog becomes a ticket, and a query. Spec-driven tools instead write guesses down as "assumptions". [W15]
- Maps scoped to one bounded epic behave better than "implement V1"; one user's 27-ticket map went stale by ticket 13. Prototype aggressively. [W8]
- Work one ticket at a time, even though the frontier allows parallel work: parallel grilling sessions repeat questions. [W8]
- Lower reasoning effort, or a plain-language line in your global CLAUDE.md, to tame long questions. [W8]
- It's used on legacy codebases too, where the fog is often "what's already true here". [W8]
- /research: give it a narrow, answerable question. Follow two or three citations to check they land on official sources. Feed the file into the next step yourself. Many people archive research files rather than commit them. [W9]
- /to-questionnaire: run it in the same conversation as a stalled grilling session, so the context is there. Run it once per recipient. [W10]

## Common mistakes
1. **Using wayfinder for a well-scoped feature.** It's slower and denser; use /grill-with-docs. [W5, W8]
2. **Looping the cleared map straight into /implement**, which skips /to-spec and loses the linked detail. [W5, W12, W8]
3. **Product code written inside the map**, often through a mis-typed `task` ticket or an agent-written "this map carries execution" line in Notes. [W8]
4. **An agent answering its own grilling questions**, or choosing among prototype variations for you. [W1, W8]
5. **Pre-slicing fog into tickets**, or listing out-of-scope work as fog. [W1]
6. **Resolving more than one non-research ticket per session.** [W1]
7. **Trying to plan the whole product in one map.** [W8]
8. **Treating wayfinder tickets as implementation tickets** (triaging them, or labelling them `ready-for-agent`). [W1, W7]
9. **/research: a vague question**, so the agent goes too deep or misses the key detail. Also not watching for a duplicate background agent. [W9]
10. **/to-questionnaire: expecting one document for several people**, or starting it in a fresh session with no context. [W10]

## Try it yourself (about 20 minutes)
1. **No-fog check (5 min).** On a scratch branch, type `/wayfinder Change the footer background to a slightly darker shade.` and answer its questions briefly.
2. **Chart a real map (15 min).** Type exactly:
   `/wayfinder I want to add end-of-Lesson quizzes and a final scenario Test to this course. Destination: a spec I can hand to /to-spec. Chart the map only; don't resolve any ticket in this session.`
   - Answer the destination question and the first breadth-first round.
   - Then open `.scratch/<effort>/map.md` and `.scratch/<effort>/issues/`.
   - Note: if it creates a research ticket, a background agent will create and push a `research/<name>` branch. That's expected; it's never merged.
3. **Optional, next session.** Run `/wayfinder .scratch/<effort>/map.md` to work exactly one ticket.

It's working if:
- [ ] Step 1 ends without creating a map and asks how you'd like to proceed.
- [ ] `map.md` has a Destination written before any ticket exists.
- [ ] Every ticket reads as a question; none says "build X".
- [ ] Each ticket has a `Type:` line, and a `Blocked by:` line where it applies.
- [ ] Not yet specified and Out of scope are separate sections.
- [ ] No ticket was resolved, and `git diff src/` is empty.
- [ ] (Step 3) It sets `Status: claimed` before working, adds an `## Answer`, sets `Status: resolved`, adds one line to Decisions so far, and stops.

## Site story
**Not used:** `/wayfinder`, `/research` and `/to-questionnaire` were never run in this repo (no entries in any session log, no `map.md` under `.scratch/`). [W17]

**Real setup:** the repo is already wired for wayfinder. `/setup-matt-pocock-skills` wrote the local-markdown "Wayfinding operations" section on 2026-10-21. [W6]

**Suggested worked examples (nothing here happened yet):**
- **The 20-Lesson course rewrite itself is wayfinder's shape:** a known destination (the new course), a foggy route, more than one session. Matt uses wayfinder to plan courses. [W11 14:15; W12; W14] If the author charts it, the "How I used it" box can come from the real map.
- **/research:** a narrow question tied to ADR 0002 ("Neon branch per environment"), for example what Vercel's Neon integration does for preview branches, citing official docs only.
- **/to-questionnaire:** a questionnaire for one beginner tester (a Visitor who has never coded with an agent) about where the Lessons lost them.

**Context:** these research notes were produced by a research subagent launched from the author's planning session on 2026-10-23, not with the /research Skill.

## Candidate quiz questions
1. **You want a "copy link" button on every Lesson and could describe it fully in five minutes. Which Skill?**
   - A) /grill-with-docs ✔
   - B) /wayfinder
   - C) /to-questionnaire
   - D) /research

   *Why:* it fits in one session. *Source:* W5, W8
2. **You want to rebuild the site as a 20-Lesson course with quizzes. You know where you're going but not how, and it won't fit in one session. Which Skill?**
   - A) /wayfinder ✔
   - B) /implement
   - C) /tdd
   - D) /pr

   *Source:* W5, W11 11:30
3. **What is a wayfinder ticket?**
   - A) A question whose answer is a decision ✔
   - B) A slice of the build to code
   - C) A bug report
   - D) A pull request

   *Source:* W1, W4
4. **The map is cleared. What comes next?**
   - A) /to-spec on the map, then /to-tickets, then /implement ✔
   - B) /implement each decision ticket
   - C) /triage the decision tickets
   - D) Delete the map and start coding

   *Source:* W5, W12, W11 9:50
5. **"Should quiz answers live in Markdown or in the database?" is a sharp question, but it's blocked by an unfinished research ticket. Where does it go?**
   - A) A ticket now, marked blocked ✔
   - B) Not yet specified
   - C) Out of scope
   - D) Decisions so far

   *Why:* the test is whether you can state it precisely now, not answer it. *Source:* W1
6. **In a grilling ticket, the agent answers its own questions and closes the ticket. What went wrong?**
   - A) Grilling is HITL and only resolves in a live exchange with you ✔
   - B) Nothing
   - C) It should have been labelled research
   - D) It should have used /to-questionnaire

   *Source:* W1
7. **You start /wayfinder on a small, clear task and the first breadth-first round finds no fog. What should happen?**
   - A) It stops and asks how you'd like to proceed, with no map ✔
   - B) It makes a one-ticket map
   - C) It charts ten tickets anyway
   - D) It starts coding

   *Source:* W1, W8
8. **On this repo's local-markdown tracker, how does a session claim a ticket?**
   - A) It sets `Status: claimed` in the ticket file and saves before any work ✔
   - B) It adds a `ready-for-agent` label
   - C) It moves the file to `done/`
   - D) It comments on GitHub

   *Source:* W6
9. **The answer you need lives in a non-technical co-author's head. Which Skill, and what will it ask you?**
   - A) /to-questionnaire; only who it's for and what you need back ✔
   - B) /research; your favourite sources
   - C) /grill-me; every detail of the subject
   - D) /grill-with-docs; your domain terms

   *Source:* W3, W10
10. **What does /research hand you?**
    - A) One cited Markdown file saved where the repo keeps notes, written by a background agent from primary sources ✔
    - B) An answer in the chat
    - C) A GitHub issue
    - D) A pull request

    *Source:* W2, W9

## Open questions / uncertain
- I didn't fetch "LIVE: The /wayfinder Demo" or the Pragmatic Engineer podcast (wayfinder at 45:02).
- W13 is a search excerpt only.
- Whether pushing `research/<name>` branches is a problem on a local-markdown setup isn't covered. The aihero page notes that deleting the branch breaks the ticket pointers. [W9]
- W11's transcript is auto-generated: "detonation" means "destination", "spectrum development" means "spec-driven development".
