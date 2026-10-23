# Research note: `code-review` (Lesson 10)

## Source map
All read on 2026-10-23.

| ID | Source | Date | What it covers | Timestamps / sections used |
|---|---|---|---|---|
| L1 | Local `skills/engineering/code-review/SKILL.md` at `/Users/siddharth/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/` | plugin labelled 1.3.1 (matches main) | Process: pin the fixed point, find the spec, find the standards, smell baseline, two parallel subagents, report side by side | whole file |
| L2 | Same folder: `docs/engineering/code-review.md` | same | Axes table, name clash, recursion, same-session bias, convergence, "It's working if" | whole file |
| L3 | https://www.aihero.dev/skills-code-review | published 2026-07-07, updated 2026-08-24 | Public copy of L2 | "It's working if", "When to reach for it" |
| L4 | GitHub v1.3.1 tag vs main; changeset `code-review-standards-and-subagents` (#1065, #1073, #937) | 2026-10-07 | Newer-on-main changes | diff |
| L5 | Same folder: `.out-of-scope/harness-name-collisions.md` and `.out-of-scope/subagent-recursion.md` | main | Matt won't rename to dodge built-ins (use the namespaced name); recursion guards are the harness's job | whole files |
| L6 | GitHub release v1.1.0 (#464) | 2026-07-08 | The in-progress "review" Skill renamed `code-review` and promoted (model-invoked) | entry |
| L7 | GitHub issues: open #1215, #1268, #1270, #1277, #1279, #1284, #1299, #511, #984, #1044; closed #1065, #1073; prior name-clash #423, #483; recursion #573 | 2026-07 to 2026-10 | Known rough edges | issue titles/bodies |
| V1 | "Fixing the PR Bottleneck — Matt Pocock, AIHero", https://www.youtube.com/watch?v=LlgiOCmFG_w (auto-translated track) | 2026-09-25 | Three layers (automated checks, automated review, human review); don't load standards into the implementer; `CODING_STANDARDS.md`; reviewer should commit fixes; avoid generic third-party reviewers | 3:00–4:00, 11:00–13:00, 13:00–14:00, 14:00–15:00, 15:00–16:00 |
| V2 | "Can Cursor's HARDCORE Review Skill Stop The Slop?", https://www.youtube.com/watch?v=mh5XZ-L5SFQ | 2026-05-28 (13:23) | Automated review is high-impact; reviewers aren't ambitious enough; false positives are cheap to reject, missed ones are costly | 0:00–0:40, 2:00–3:00, 8:00, 12:00 |
| V3 | "mattpocock/skills: A complete AI Coding workflow, end-to-end", https://www.youtube.com/watch?v=M6mYodf0dJM (auto-translated track) | 2026-07-16 | Review inside `/implement`; two axes; Fowler fallback; why subagents | 14:30–16:30 |
| V4 | AI Engineer workshop, https://www.youtube.com/watch?v=-QFHIoCo-Ko | 2026-04-24 | Review in a fresh context (smart zone); standards pushed to the reviewer, pulled by the implementer; cheaper model implements, stronger model reviews | 1:05:00–1:06:00, 1:28:00, 1:32:00 |
| D1 | AI Coding Dictionary: https://www.aihero.dev/ai-coding-dictionary/human-review, /automated-review, /automated-check | human review 2026-09-24 | Layered review; definitions | entries |
| R1 | Repo: `content/lessons/10-code-review.md`; PR #7; `content/lessons/12-main-flow.md`; Claude Code's own `code-review` listed in this session's Skill list | 2026-10-21/22 | The author's two reviews | as cited |

## Key facts (pinned to v1.3.1)
- **What it is.** Reviews the diff between `HEAD` and a **fixed point** you name (a commit, branch, tag, `main`, `HEAD~5`) along **two axes** (L1):
  - **Standards:** does the code follow this repo's documented standards, plus a smell baseline?
  - **Spec:** does it faithfully do what the originating issue or spec asked?
- **How you start it.** `/code-review`. It is **model-invoked**, so the agent also reaches for it when you ask to review a branch, a PR, work in progress, or "since X" (L1, L2).
- **The name clash.** In Claude Code, the bare `/code-review` may be **Claude Code's own built-in review** (a Built-in command that hunts bugs), not Matt's Skill.
  - With the plugin, Matt's is always reachable as `/mattpocock-skills:code-review`.
  - With a plain skills.sh install, the local file wins.
  - Matt won't rename it (L2, L5). This session's own Skill list shows both.
- **Process** (L1):
  1. **Pin the fixed point.** Ask if none was given. Capture `git diff <fixed-point>...HEAD` (three dots = compare against the merge-base) and `git log <fixed-point>..HEAD`. Check the ref resolves and the diff isn't empty **before** starting any subagent.
  2. **Find the spec**, in this order: issue references in commit messages, fetched through the tracker doc; a path you passed; a spec under `docs/`, `specs/` or `.scratch/` matching the branch or feature; ask you. If there is none, skip the Spec axis and say "no spec available".
  3. **Find the standards.** Search for every file that documents how code is written. If `CODING_STANDARDS.md` or `CONTRIBUTING.md` exists, it must be on the list.
     - Plus the **smell baseline**: 12 code smells from Fowler's *Refactoring* chapter 3 (Mysterious Name, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Shotgun Surgery, Divergent Change, Speculative Generality, Message Chains, Middle Man, Refused Bequest).
     - The repo always overrides the baseline. Smells are always judgement calls ("possible Feature Envy"), never hard violations. Skip anything tooling already enforces.
  4. **Start both subagents together, in the foreground.**
     - Standards brief: cite the file and rule, or name the smell and quote the code; separate hard violations from judgement calls; under 400 words.
     - Spec brief: what's missing or partial; scope creep; what's implemented wrongly; quote the spec line for each finding; under 400 words.
  5. **Aggregate.** Present `## Standards` and `## Spec` separately. **Never merge or re-rank across axes.** End with a total per axis and the worst issue *per axis*, with no overall winner.
- **Why two axes** (L1): a change can pass one and fail the other. Right standards with the wrong feature passes Standards and fails Spec, and the reverse. Blending lets one hide the other.
- **What it produces:** a report. The Skill itself doesn't edit code.
  - Inside `/implement-spec`, a fixer subagent acts on the findings (step 7).
  - Inside `/implement`, nothing acts on them (implement docs).
  - Matt's talk argues a reviewer *should* commit its fixes rather than just comment (V1 15:00–16:00). That's his direction, not what this Skill's text does.
- **When to reach for it** (L2): a diff exists and you want to know it's built right *and* is the right thing.
- **When not to** (L2):
  - bug-hunting null paths and races → the built-in review;
  - nothing written yet → `/tdd`;
  - the whole codebase has drifted → `/improve-codebase-architecture`;
  - something is broken → `/diagnosing-bugs`.
- **Neighbours** (L2):
  - `/implement` calls it before committing; `/implement-spec` runs it once over the integration branch.
  - `/to-spec` and `/to-tickets` produce what the Spec axis checks, so a vague spec makes a vague review.
  - `/retro` tunes it by proposing checks or `CODING_STANDARDS.md` rules.
  - `/pr` writes the PR body once the reviewed work goes up.
- **History** (L6): the in-progress `review` Skill was renamed `code-review` and promoted in v1.1.0 (2026-07-08).

### Newer on GitHub main
- The local copy matches main. Compared with the **v1.3.1 tag**, main adds three things from one unreleased changeset (2026-10-07) (L4):
  - search the repo for every standards file, and always include `CODING_STANDARDS.md`/`CONTRIBUTING.md` (#1065);
  - start both subagents in the foreground and use the reports they return (#1073);
  - find the issue tracker through the provided tracker doc instead of a hard-coded `docs/agents/issue-tracker.md` (#937).
- **Out of scope by decision** (L5):
  - Recursion guards against subagents re-invoking `/code-review` (#573) are left to the harness.
  - Renaming to dodge Claude Code's built-in (#423, #483) won't happen.
- **Open** (L7):
  - #1215: `/implement` and `/implement-spec` call the bare name, which can run the built-in.
  - #1270: run reviewers at the most capable model.
  - #1279: findings are relayed without being checked.
  - #1284: standards discovery misses ignored or symlinked files.
  - #984: subagents should read the pasted diff.
  - #1044: gate findings that remove a guard.
  - #1268: a fresh-context review checkpoint.
  - #511 / #1277: uncommitted changes.

## Day-to-day usage
- **Why Matt cares.** Automated review is one of the highest-impact ways to raise agent code quality (V2 0:00–0:40).
- **Three layers** (V1 3:00–4:00; D1): automated checks (deterministic, cheap), then automated review (agents), then human review. The goal is to make human review faster by leaning on the first two.
- **Implement, then make it good.**
  - Don't load coding standards into the implementing agent: it's already busy exploring, changing and debugging, and does worse with more rules (V1 11:00–12:00).
  - The reviewer runs as a subagent with its own budget, so it can carry many standards (V1 12:00–13:00).
  - He frames it as implement (make it work) followed by review (make it good): red-green-refactor spread across two context windows (V1 13:00–14:00).
  - Put standards in `CODING_STANDARDS.md`, not `AGENTS.md` (V1 14:00).
  - Build your own standards rather than relying on generic third-party reviewers (V1 14:00–15:00).
- **Fresh context.** The authoring session is biased toward what it just wrote, and it's deep in its context. Subagents start clean and review better (V3 15:30–16:00; V4 1:05:00–1:06:00). He uses a stronger model for review than for implementation (V4 1:32:00).
- **Push vs pull.** Coding standards are *pushed* into the reviewer and *pulled* (as Skills) by the implementer (V4 1:28:00, 1:32:00).
- **Ambition.** Reviewers given a diff tend to treat it as their boundary and aren't ambitious enough. Ambitious reviews produce more false positives, but those are cheap to say no to; the improvements you never see are the costly ones (V2 2:00–3:00, 12:00). He wanted reviews to say more about tests and seams (V2 8:00).
- **Others** (L2):
  - One reader: a session reviewing its own code is confirmation bias, not review.
  - Users report it finds new things every run, with no guarantee it converges. Act on the findings that cite a rule, then stop.
  - One team reported a dozen breaking changes found that prose reviews had missed.
  - Field reports of subagent fan-out of more than 50 agents.

## Common mistakes
- Typing `/code-review` and getting Claude Code's built-in bug hunt. Use `/mattpocock-skills:code-review` (L2, L5).
- No fixed point, or a typo in the ref. It asks, or stops early (L1).
- Expecting it to review uncommitted work. It won't; commit first (L2).
- Reviewing in the same session that wrote the code (L2; V4 1:05:00).
- Re-running it until it comes back clean; it never will (L2).
- Trusting every finding. Check each citation; subagent output is a hypothesis (L2).
- Treating a smell as a hard violation, or ignoring a repo rule that overrides the baseline (L1).
- Having no spec, so the Spec axis is skipped. Or a vague spec, so the Spec axis is vague (L1, L2).
- Running it mid-way through `/implement-spec` (implement-spec docs).
- Letting it run unattended without watching the agent count (L2).

## Try it yourself (~15–20 min)
**Start from** the `try-implement` branch from the implement exercise.
1. Type:
```
Create .scratch/reading-time/spec.md with three requirements: (1) readingTime rounds up to whole minutes at 200 words per minute; (2) it never returns less than 1; (3) it ignores text inside Markdown code blocks. Commit it.
```
2. Try a bad fixed point first: `/mattpocock-skills:code-review Review since nope.` (With a skills.sh install, type `/code-review` instead.)
3. Now the real review:
```
/mattpocock-skills:code-review Review since main. The spec is .scratch/reading-time/spec.md.
```

**It's working if:**
- [ ] With `nope`, it stops before starting any subagents.
- [ ] The report has two separate blocks, `## Standards` and `## Spec`.
- [ ] The Spec block flags requirement (3) as missing and quotes the spec line.
- [ ] Each Standards finding cites a repo rule or names one of the 12 smells and quotes the code.
- [ ] The summary gives a worst issue per axis and no overall winner.
- [ ] Bonus: run it again without the spec path, after moving the spec out of `.scratch/`. It should say "no spec available" instead of inventing requirements.

## Site story (from the author's repo)
- **What he typed:** `/mattpocock-skills:code-review` with fixed point `4f849b9`, the very first commit, so it reviewed everything (R1: `10-code-review.md`). Using the namespaced name sidesteps Claude Code's built-in review. That's my inference; the Lesson doesn't say why.
- **Standards: 0 hard violations, 7 judgement calls.** The code followed all 4 ADRs and used Next.js correctly. Examples:
  - comment length limits written in two places (a Duplicated Code smell);
  - the endpoint validating input although the issue said endpoints only speak HTTP;
  - naming drift (`order` vs `number` vs "position").
- **Spec: 1 real bug plus small gaps.**
  - Sending a number instead of text crashed the API with a 500 instead of a clean 400. He confirmed it on the live site; his 19 tests had never tried a number.
  - The home page said "LESSON 1 / Grilling" instead of the spec's wording.
  - Unrequested extras (scope creep): dates on comments, "Loading…".
- **Fixes in one PR (#7):**
  - the crash, test-first (red: `.trim is not a function`);
  - all checks moved into the comments module;
  - limits in one shared file;
  - home page wording;
  - ADR 0004 wording.
- **Left alone on purpose:** renames, emoji counting as 2 characters, a repeated error line.
- **His lesson:** passing tests isn't the same as correct, and the two reviewers found *different kinds* of problems.
- **Second review (the Main flow build):** about 15 problems, e.g. the home page calling Skills "commands" (against the glossary), a focus ring too faint on the Lesson cards, and a wrong claim in Lesson 11 about Lesson 9. One fix-up agent fixed them all. An early review had run while ticket 05 was still building (R1: `12-main-flow.md`).

## Candidate quiz questions
**Q1 [scenario]** The code follows every repo rule but builds the wrong feature. What does the report show?
- A) Standards fails, Spec passes
- B) Standards passes, Spec fails **(correct)**
- C) Both fail
- D) One merged score of 50%

*Why:* Spec checks it's the right thing; Standards checks it's built right. *Source:* L1 "Why two axes".

**Q2 [scenario]** Why run Standards and Spec as two separate subagents?
- A) To use fewer tokens
- B) So neither axis's reasoning colours the other, and one can't hide the other **(correct)**
- C) Because one agent can't read a diff
- D) So it can rank all findings in one list

*Why:* Separate contexts; never merged or re-ranked. *Source:* L1.

**Q3 [scenario]** You type the Skill without saying what to compare against. What happens?
- A) It reviews the whole repo
- B) It guesses `main`
- C) It asks you for a fixed point **(correct)**
- D) It reviews only the last commit

*Why:* It needs a fixed point and asks rather than guessing. *Source:* L1 step 1.

**Q4 [scenario]** Your repo has no `CODING_STANDARDS.md` or similar. What does the Standards axis check?
- A) Nothing; it skips
- B) A baseline of 12 Fowler code smells, as judgement calls **(correct)**
- C) Google's style guide
- D) Only what the linter enforces

*Why:* The smell baseline applies even when the repo documents nothing. *Source:* L1 step 3.

**Q5 [spot-the-mistake]** An ADR says a thin wrapper module is deliberate. The review reports "HARD VIOLATION: Middle Man". What's wrong?
- A) Nothing; Middle Man is always a violation
- B) The repo's documented choice overrides the baseline, and smells are never hard violations **(correct)**
- C) Middle Man isn't one of the 12 smells
- D) It should have been reported under Spec

*Why:* The repo overrides, and smells are labelled heuristics. *Source:* L1 step 3.

**Q6 [scenario]** With the plugin installed, you type `/code-review` and get a bug hunt about null checks and race conditions, with no Standards or Spec sections. Why?
- A) The Skill is broken
- B) Claude Code's own built-in `/code-review` answered; type `/mattpocock-skills:code-review` **(correct)**
- C) You need a spec first
- D) The diff was empty

*Why:* Name clash with a Built-in command; the plugin's namespaced name always reaches Matt's Skill. *Source:* L2; L5.

**Q7 [scenario]** You haven't committed your changes, and the review says the diff is empty. Why?
- A) The three-dot diff against `HEAD` only sees committed work **(correct)**
- B) The Skill only reviews pushed branches
- C) You need to stage the files
- D) The spec is missing

*Why:* Staged and working-tree changes are excluded; commit first. *Source:* L2 common questions.

**Q8 [scenario]** The Spec axis reports "dates shown on comments: not asked for". Which category is that?
- A) Missing requirement
- B) Scope creep **(correct)**
- C) Standards violation
- D) Wrongly implemented requirement

*Why:* Behaviour nobody asked for is scope creep. *Source:* L1 Spec brief; R1.

**Q9 [scenario]** After fixing the findings, you re-run the review and it finds new things. What should you do?
- A) Keep looping until it reports nothing
- B) Act on the findings that cite a rule or spec line, then stop **(correct)**
- C) Switch to a different reviewer
- D) Delete `CODING_STANDARDS.md`

*Why:* There's no convergence guarantee; treat a pass as leads. *Source:* L2.

**Q10 [scenario]** In the author's first review, what did the Spec axis find that his 19 tests missed?
- A) A slow page
- B) Sending a number instead of text crashed the API with a 500 **(correct)**
- C) A missing database table
- D) A typo in the glossary

*Why:* No test had tried a non-text comment. He fixed it test-first in PR #7. *Source:* R1.

**Q11 [scenario]** Why does Matt want review done in a fresh context window rather than by the session that wrote the code?
- A) The writing session is biased toward its own code and deep in its context window **(correct)**
- B) Fresh windows are cheaper
- C) Subagents can push to GitHub
- D) The writing session can't run git

*Why:* A fresh reviewer works in the smart zone, without the author's assumptions. *Source:* V4 1:05:00–1:06:00; V3 15:30–16:00; L2.

## Open questions / uncertain
- **Reviewer commits fixes?** The talk's "reviewer should commit fixes" (V1 15:00–16:00) doesn't match the Skill text, which only reports. Teach the Skill as written and mention Matt's direction as an opinion.
- **Arabic transcripts.** V1 and V3 came from auto-translated Arabic tracks. The meaning is clear, but don't quote them word for word.
