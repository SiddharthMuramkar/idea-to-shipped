# Research note: `pr-and-ship` (Lesson 11: `/pr`)

## Source map
All read on 2026-10-23.

| ID | Source | Date | What it covers | Timestamps / sections used |
|---|---|---|---|---|
| L1 | Local `skills/engineering/pr/SKILL.md` and `CREDITS.md` at `/Users/siddharth/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/` | 1.3.1 (identical to the tag and main) | Template: Summary, Evidence, Merge Danger; the six visual views; credit to Dex Horthy's show-me | whole files |
| L2 | Same folder: `docs/engineering/pr.md` | same | What it is and isn't; common questions; "It's working if" | whole file |
| L3 | https://www.aihero.dev/skills-pr | published 2026-10-05 | Public copy of L2 | "It's working if", "Where it fits" |
| L4 | Same folder: `CHANGELOG.md` 1.3.0 (#1120) | released 2026-10-04 | `pr` graduated as model-invoked | entry |
| L5 | https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md | 2026-10-05 | Why `/pr`; evidence; doors; reliably fires on Opus 5.5; the v1.3 release PR used it | "New: /pr" |
| L6 | Same folder: `skills/engineering/ask-matt/SKILL.md` | 1.3.1 | Where `/pr` sits: after review, model-invoked | main flow step 3 |
| V1 | "New Skills! v1.3 brings /pr, /implement-spec, and /retro", https://www.youtube.com/watch?v=BsJGo1wFTvQ | 2026-10-05 | `/pr` walkthrough and an example PR | 4:54–5:30, 5:28–5:40, 5:45–6:25, 6:25–7:05, 7:05–7:45, 7:45–8:05 |
| V2 | "Fixing the PR Bottleneck — Matt Pocock, AIHero", https://www.youtube.com/watch?v=LlgiOCmFG_w (auto-translated track) | 2026-09-25 | PRs as the bottleneck; one-way/two-way doors; blast radius; pseudocode summaries; review only the irreversible | 0:00–1:00, 16:00–17:00, 17:00–18:00, 18:00–19:00, 19:00–20:00, 22:00 |
| V3 | AI Engineer workshop, https://www.youtube.com/watch?v=-QFHIoCo-Ko | 2026-04-24 | More code review in the agent era; QA imposes taste; QA creates new tickets | 0:59:00–1:00:00, 1:12:00–1:13:00, 1:34:00 |
| D1 | AI Coding Dictionary: https://www.aihero.dev/ai-coding-dictionary/human-review, /afk | 2026-09-24 | Reading the diff counts, reading the summary doesn't; AFK runs should end in a PR, not merged changes | entries |
| C1 | developer.tenten.co v1.3 article | undated (after 2026-10-04) | Read Merge Danger first, then Evidence, then Summary; S-tier and A-tier evidence | `pr` section |
| C2 | Eric Tech, "Matt Pocock's 3 New Skills Close the AI Coding Loop", https://www.youtube.com/watch?v=1MNSJhCGMLY | 2026-10-20 | Community overview: `/pr` makes AI PRs quick to review with proof and risk (description only) | chapter list |
| R1 | Repo: `content/lessons/11-pr-and-ship.md`; PR bodies #2, #4, #7, #9 (`gh pr view`); `gh pr list --state merged` | 2026-10-21/22 | The author's shipping practice | as cited |

## Key facts (pinned to v1.3.1)
- **What it is.** A format reference for a pull request **body**, not a workflow. It doesn't push, open the PR, or decide what goes in (L1, L2).
- **How you start it.** You *can* type `/pr`, but it's **model-invoked**: the agent loads it whenever it writes a PR body (L1 frontmatter, L2).
  - It graduated into Engineering in **v1.3.0** (released 2026-10-04) (L4).
  - Matt says it fires reliably on its own, at least on Opus 5.5 (V1 7:45–8:05; L5).
- **The template** (L1). Three sections in this order. No preamble; keep prose brief; use `GLOSSARY.md` words.
  1. **Summary:** the *smallest view* that makes the key point clear. Six views: pseudocode, a call tree, a component tree, a shallow file tree, a Mermaid diagram, or a shaped `diff`; or a whole block when most of it is new. Place each visual next to the short text it supports. Usually one view, sometimes several, rarely all.
  2. **Evidence:** a **before** and an **after**. Screenshots are the strongest ("S-tier") when the change is visual and the setup can take one. Execution evidence ("A-tier") means test results or console output: show the exact test that failed and now passes, as pseudocode.
  3. **Merge Danger:**
     - **Door:** one-way or two-way. You can walk back through a two-way door; destructive or hard-to-reverse changes are one-way.
     - **Blast Radius:** one word, plus optional ramifications (e.g. layout shift, breakages for consumers, mobile responsiveness).
- **The main idea** (L2): the door call turns "is this safe to merge?" into a stated claim a reviewer can argue with, and tells them where to spend human review. Skim a two-way door with a small blast radius; read a one-way door slowly.
- **Credit** (L1): the Summary visuals are adapted, almost word for word, from Dex Horthy's `show-me` Skill (HumanLayer). They were copied in rather than depended on.
- **When to reach for it** (L2):
  - a branch is ready and needs a body a reviewer can scan;
  - if it hasn't been reviewed yet, run `/code-review` first.
- **What it doesn't do** (L2):
  - open the PR;
  - triage review comments;
  - keep the body up to date as the PR changes (ask for a rewrite);
  - follow your repo's own PR template (settle that in your agent docs);
  - add an "AI-written" disclosure (put that rule in the repo).
  - Exception: `/implement-spec` opens a **draft** PR only if your tracker closes work through PRs or you ask (L2).
- **Where it fits** (L2, L6): `… → /implement → /code-review → /pr → /retro` when the build ships as a PR. It also fires on its own whenever the agent writes a PR body.
- **"Ship" for a beginner** (R1, D1):
  - A branch, plus the PR's review and tests, then merge to `main`. On this site, merging deploys to production.
  - AFK runs should end in something reviewable (a PR), not changes already merged.

### Newer on GitHub main
- `pr/SKILL.md` is identical in the v1.3.1 tag, main, and the local copy. Its docs page is only reworded (no meaning change).
- Open user requests not shipped (L2): a Skill that opens PRs (`/to-pr`), using the repo's PR template, triaging comments.

## Day-to-day usage
- **Why Matt built it.** PRs are still the main bottleneck for work reaching `main`; the goal is to make human review as easy as possible (V1 5:28–5:40; V2 0:00–1:00). Agents make opening a PR trivial; making one worth reviewing is the hard part (V2 description).
- **Evidence builds trust.** Asking for evidence often makes the agent run an extra test or take a screenshot. Without it, agents are happy to say "probably works, I read the code". He's become obsessed with verification (V1 5:45–6:25).
- **Doors.**
  - Most PRs are two-way doors: you can revert them. That's an advantage software has over civil engineering (V2 17:00–18:00).
  - A tiny change can still be one-way, e.g. one that accidentally emails 60,000 people. Expensive migrations and data loss are one-way too (V2 17:00–18:00).
  - He puts Merge Danger at the bottom so it's the first or second thing a reviewer looks at (V1 6:25–7:05; V2 18:00–19:00).
  - His closing rule: you don't need to review every reversible decision, but you must review every irreversible one (V2 22:00).
- **His example PR** (V1 7:05–7:45): it merged two near-identical algorithms. The body showed files removed and added in context, the call structure, a before and after on a real record, and Merge Danger "two-way, small blast radius".
- **Summaries as pictures.** Pseudocode and small diagrams (from show-me) make the "why" fastest to grasp (V2 18:00–20:00).
- **More review is coming.** He expects humans to do more code review in the agent era, and doesn't love saying so (V3 0:59:00–1:00:00). Manual QA is where you impose taste, and QA feeds new tickets back to the board (V3 1:12:00–1:13:00, 1:34:00).
- **Others:**
  - Read Merge Danger first, then Evidence, then Summary (C1's reading order, not Matt's instruction).
  - Users' complaint about agent PRs: they want what changed, how it was checked, what could break, and whether it's safe (L2).
  - Users warn that rolling back a commit doesn't undo emails already sent, and that a flagged rollout stays two-way only until the first write in the new format (L2).

## Common mistakes
- Evidence that's a claim ("tests are green") instead of a before and after (L2).
- Trusting the agent's own door call, especially "two-way, small". Give it the ticket or spec, not just the diff, and list the changes your repo always treats as one-way (L2; L5).
- Expecting `/pr` to open, push, or update the PR (L2).
- A wall of diagrams; one small view is usually enough (L1, L2).
- Thinking Mermaid is broken because it shows as raw text in the terminal. GitHub renders it (L2).
- Merging before testing the preview on a database-changing PR, which is a one-way door (R1 author's mistake).
- Huge PRs: `/pr` won't split them for you (L2).

## Try it yourself (~15–20 min)
**Start from** the `try-implement` branch (or any branch with a small committed change).
1. Type:
```
Write the PR body for this branch against main. Show it to me here; don't push or open anything.
```
2. Read it as a reviewer. Is the door call right? What's the blast radius?
3. Optional, only if your repo has a GitHub remote and you want to: type `Push this branch and open the PR with that body.` Then open the PR in the browser and check that the Merge Danger section is easy to find.
4. Spot-it drill: open this site's PR #9 (`gh pr view 9`) and list what's missing compared with the template.

**It's working if:**
- [ ] The body starts at `## Summary`, with no intro paragraph.
- [ ] You can tell what changed from the Summary visual alone.
- [ ] Evidence shows a before and an after (e.g. the test that failed before and passes now), not just "tests pass".
- [ ] Merge Danger states a door and a blast radius, and you agree with them.
- [ ] Nothing was pushed or opened unless you asked.

## Site story (from the author's repo)
- **How he shipped v1** (R1: `11-pr-and-ship.md`):
  - Typed nothing special: the agent opened each PR with `gh pr create`, and he clicked **Squash and merge**. Six PRs built v1.
  - A rule on his machine **blocks pushing straight to `main`**.
- **Every PR came with three things:**
  - a git branch (e.g. `issue-06-comment-box`);
  - a Vercel preview site;
  - a Neon database copy (`preview/issue-06-comment-box`).
- **His testing routine:** open the PR → the Vercel bot's comment → **Visit Preview** → do the thing → try to break it → only then Squash and merge.
- **His mistake:** on the final PR he merged first and tested after. It worked, but on a PR that changes the database that order could damage real data. In `/pr` terms, that's a one-way door.
- **He proved the copies are separate:** a comment posted on the preview didn't appear on the real site. Migrations ship themselves: the preview build migrates the copy, and the merge migrates production.
- **Before `/pr` existed in his workflow** (PRs #2, #4, #7):
  - Bodies were bullet lists of what changed, plus "Try it on the preview" steps.
  - PR #7 had real evidence: a red test reproducing `.trim is not a function`, then 20 passing tests.
- **The PR Lesson 12 says `/pr` wrote** (PR #9):
  - Sections are "What changes", "Evidence", "How to check it", "Door: Two-way door…".
  - **No Summary visual**, **no Blast Radius**.
  - Its Evidence is a claim ("vitest (24), eslint, tsc and next build pass"), not a before and after.
  - Spot-the-mistake material, but treat whether `/pr` actually ran as uncertain (see open questions).

## Candidate quiz questions
**Q1 [scenario]** A PR adds a migration that drops a column. What door is it?
- A) Two-way, because you can revert the commit
- B) One-way **(correct)**
- C) No door; migrations are exempt
- D) Two-way, if the tests pass

*Why:* Destructive changes can't be walked back by a revert. *Source:* L1 Merge Danger; V2 17:00–18:00.

**Q2 [scenario]** A PR changes one button's colour. How should a reviewer treat it?
- A) Two-way door, small blast radius: skim it **(correct)**
- B) One-way door: read every line
- C) Block it until there's a screenshot test suite
- D) Merge without opening it

*Why:* Spend review time where reversal is hard or impact is wide. *Source:* L2; V1 6:25–7:05.

**Q3 [spot-the-mistake]** The Evidence section says only "All 24 tests pass." What's missing?
- A) A Mermaid diagram
- B) A before and an after, such as the test that failed before and passes now **(correct)**
- C) The branch name
- D) Nothing; that's enough

*Why:* "Tests are green" is a claim, not evidence. *Source:* L1 Evidence; L2.

**Q4 [scenario]** The change is visual, and the agent can take screenshots. Best evidence?
- A) Console output
- B) Before and after screenshots **(correct)**
- C) The diff
- D) The commit message

*Why:* Screenshots are top-tier evidence for visual changes. *Source:* L1.

**Q5 [scenario]** Does `/pr` push your branch and open the pull request?
- A) Yes, always
- B) No; it only shapes the PR body **(correct)**
- C) Only when you type `/pr` yourself
- D) Only on GitHub Enterprise

*Why:* It's a format reference; the agent or `gh` opens the PR. *Source:* L2.

**Q6 [scenario]** Do you need to remember to type `/pr` before the agent writes a PR?
- A) Yes, or the agent writes no body
- B) No; it's model-invoked and loads whenever the agent writes a PR body **(correct)**
- C) Yes, but only for one-way doors
- D) No, because `/implement` opens PRs

*Why:* Model-invoked, and it fires reliably. *Source:* L1; V1 7:45–8:05.

**Q7 [scenario]** What should the Summary section be?
- A) Three paragraphs explaining the change
- B) The smallest visual that makes the point: pseudocode, a call tree, a file tree, Mermaid, or a shaped diff **(correct)**
- C) The full diff pasted in
- D) A list of every file touched

*Why:* A picture, not a paragraph. *Source:* L1 Summary.

**Q8 [sequence]** Put the author's PR testing routine in order:
1. open the PR on GitHub
2. click Visit Preview in the Vercel bot's comment
3. do the thing the PR is about
4. try to break it
5. Squash and merge

*Answer:* 1 → 2 → 3 → 4 → 5. *Source:* R1 `11-pr-and-ship.md`.

**Q9 [spot-the-mistake]** On a PR that changes the database, someone clicks Squash and merge and then tests the preview. Why is that risky?
- A) The preview gets deleted
- B) Merging migrates production first, which is a one-way door **(correct)**
- C) Vercel blocks the merge
- D) The tests won't run

*Why:* Test before merging when the change can't be walked back. *Source:* R1; L1.

**Q10 [scenario]** Your Mermaid diagram looks like raw text in the terminal. What's going on?
- A) The Skill is broken
- B) Terminals don't render Mermaid; GitHub does **(correct)**
- C) Mermaid isn't allowed in PRs
- D) You need an HTML PR body

*Why:* The body is Markdown, rendered on GitHub or GitLab. *Source:* L2.

**Q11 [scenario]** Your repo already has `.github/pull_request_template.md`. Which template does `/pr` use?
- A) The repo's, automatically
- B) Its own; it doesn't look for yours, so settle the conflict in your agent docs **(correct)**
- C) It merges both automatically
- D) Neither; it refuses to run

*Why:* `pr` has its own template and doesn't look for the repo's. *Source:* L2.

## Open questions / uncertain
- **Did `/pr` write PR #9?** Lesson 12 says it did, but the body doesn't match the template: no Summary visual, no Blast Radius, and claim-style evidence. Either the agent loaded `/pr` and adapted it (maybe because of the global CLAUDE.md PR conventions), or it didn't load. Check the session log before teaching it as a `/pr` example.
- **The Lesson also covers "ship".** This Lesson teaches both `/pr` and shipping (branch → preview → merge). Shipping facts come only from the author's repo (Vercel/Neon setup); no Matt source covers them.
