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

**Status:** ready-for-agent

- [ ] At 1440px each Section shows text beside its stage. The stage stays pinned while that Section scrolls and is pushed away by the next one, and a Section without a Scene shows its outline numeral
- [ ] At 390px it's one column, a Scene's stage pins only across its own captions, at least 55% of the viewport stays for text, and there's no sideways scrolling
- [ ] Goals, callouts (tip, watch-out, big-idea, each labelled with a word and an icon), try (with a working Copy button), site story and sources all render, checked with the full example from `docs/authoring-lessons.md` dropped temporarily into `content/lessons/` (never committed)
- [ ] All five Scene kinds render their final state on the server, every item in the HTML, with the title as a `<figcaption>`
- [ ] With JavaScript off, every Lesson is fully readable: Scenes are complete, Checkpoints show a "Show the answer" `<details>`, and the Final test shows its JavaScript note
- [ ] Headings are bold everywhere (home page, Lesson pages, credits, card titles, Discussion), and `--good` is at least 4.5:1 on white
- [ ] Discussion is a full-width band after the Final test and before Previous/Next, and posting and listing Comments work exactly as before
- [ ] The home page grid stays flat while any Lesson lacks a `part`, and groups under Part headings when every Lesson has one (checked with a fixture or a local edit). Flow steps link only to existing slugs
- [ ] The 12 old Lessons still look right (they have only prose)
- [ ] Existing tests, lint, `tsc --noEmit` and build pass. Screenshots of `grilling` (or the example page), one old Lesson and the home page at 390px and 1440px
