# 03: Page layout, blocks, bold type and the Discussion band

**What to build:** A Lesson page lays out each Section as text beside a stage, renders every block in its final state, and wears the new bold type. There's no motion yet.

- **Layout:**
  - At 1080px and wider, each Section is a grid of text (`minmax(0, 44rem)`) beside a sticky stage that pins only within its own Section. The Lesson page is up to about 1440px wide.
  - Below 1080px it's one column, and a Scene's stage pins only across its own captions.
  - Wrappers use `overflow: clip`, never `hidden`.
- **Blocks rendered on the server:**
  - prose, goals, the three callouts, try (with `copy-button.tsx`), site story and sources
  - each Scene's markup with every step and item up front, so with no JavaScript it shows its final state
  - Checkpoints and the Final test as static markup, with the no-JS fallbacks (a "Show the answer" `<details>`, and "The Final test needs JavaScript to check your answers")
- **Bold type, site-wide:** h1–h3 in Inter Tight at 750–800 with `-0.035em` tracking, and `strong` at 700. Includes card titles, the credits page and the Discussion headings. New `--good: #0f7a3d` token.
- **Discussion:** a full-width band after the Final test, no longer sticky, behaving exactly as before.
- **Home page:** the Lesson grid is grouped by Part once every Lesson has a `part` (flat until then). Each `FLOW_STEPS` step links to its Lesson only if the slug exists.

See the spec's "Scroll experience" (Layout, Bold type, Block by block) and the "Discussion moves" and "Home page" decisions.

**Blocked by:** 01 (Lesson format, parser and course lint)

**Status:** resolved

- [ ] At 1440px each Section shows text beside its stage. The stage stays pinned while that Section scrolls and is pushed away by the next one, and a Section without a Scene shows its outline numeral
- [ ] At 390px it's one column, a Scene's stage pins only across its own captions, at least 55% of the viewport stays for text, and there's no sideways scrolling
- [ ] Goals, callouts (tip, watch-out, big-idea, each labelled with a word and an icon), try (with a working Copy button), site story and sources all render, checked with the full example from `docs/authoring-lessons.md` dropped temporarily into `content/lessons/` (never committed)
- [x] All five Scene kinds render their final state on the server, every item in the HTML, with the title as a `<figcaption>`
- [ ] With JavaScript off, every Lesson is fully readable: Scenes are complete, Checkpoints show a "Show the answer" `<details>`, and the Final test shows its JavaScript note
- [x] Headings are bold everywhere (home page, Lesson pages, credits, card titles, Discussion), and `--good` is at least 4.5:1 on white
- [x] Discussion is a full-width band after the Final test and before Previous/Next, and posting and listing Comments work exactly as before
- [x] The home page grid stays flat while any Lesson lacks a `part`, and groups under Part headings when every Lesson has one (checked with a fixture or a local edit). Flow steps link only to existing slugs
- [x] The 12 old Lessons still look right (they have only prose)
- [x] Existing tests, lint, `tsc --noEmit` and build pass. Screenshots of `grilling` (or the example page), one old Lesson and the home page at 390px and 1440px

## Comments

- 2026-10-23: Shipped in the first release (branch `lesson-page-v2`), without tickets 02, 04 and 05. tsc, lint, `npm run test:content` (140 tests, no env), `npm test` (153 tests incl. the Neon test lane) and `npm run build` all pass on the branch. Two-axis `mattpocock-skills:code-review` (Standards + Spec, fixed point d21fc2c): every Standards breach and the Spec defects fixed (9a759e0, f314488); bug hunt round 1 (5 lenses, 2 skeptics per finding): 9 confirmed, all fixed; round 2 stopped early at the user's call to ship.
- **Changed by the scope decision (no grading yet):** every Checkpoint and Final test question shows a visible "Show the answer" box, with or without JavaScript; there's no Check button, score card or "needs JavaScript" note. Box 5 stays open as written for that reason.
- **Changed by a review finding:** a pinned, fixed-height Scene stage only ever showed the start of its final state (on a phone, 1 of 9 chat bubbles). Until the stepper runs (ticket 04, `data-stepper="on"`), a Scene's stage takes its full height and scrolls with the page; numeral stages still pin. Boxes 1 and 2 stay open until ticket 04 brings the pinning back.
- **Kept on purpose:** "Checkpoint N of M" in the heading, the big-idea callout on a numeral stage, the goals card headed "By the end of this Lesson", ids from `questionIds()` rather than `useId()`.
- Checked in the browser at 390px, 1280px and 1440px: no sideways scrolling on any page, all Scene items visible, answer boxes open. Box 3 (the full example page) was not run.
