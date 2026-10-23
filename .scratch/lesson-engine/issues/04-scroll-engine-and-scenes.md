# 04: Scroll engine, the five Scene kinds, section bar and tones

**What to build:** Reading a Lesson comes alive. Scenes build step by step as their captions scroll past, the section bar follows you, the background shifts between Sections, and headings and highlights move with the scroll. Every effect has a fallback.

- **`scene-stepper.tsx`:** one IntersectionObserver for every caption on the page, with the trigger line 55% down the viewport. It sets `data-step` on each Scene root and `data-on` / `data-new` on its items. Items move with transform and opacity only, forward and back.
- **The five Scene kinds animate as specified:**
  - chat: bubbles slide in, and the newest is ringed
  - terminal: commands type out with `clip-path` and `steps()`, then the output fades in
  - flow: nodes fill, earlier ones get ticks, and edges draw
  - files: rows fade in green or amber, and a repeat `~` re-badges its row
  - meter: the fill is `scaleX`, and past the zone it gets `data-zone="dumb"`
- **`lesson-nav.tsx`:** the section bar (Part and Lesson label, current Section, one dot-link per Section, one tick slot per Checkpoint, progress line). One IntersectionObserver sets `aria-current` and `data-tone` (`paper`, `soft`, `navy` for the Final test) on the `.lesson` wrapper. On phones the bar tucks away while a stage is pinned.
- **CSS scroll-driven effects:** the reading progress line (`scroll(root)`), heading rise (`view()`, `translateY` + `clip-path`), `==mark==` sweep, numeral parallax, and the `1ms` duration fix on the existing hero drift.
- **Fallbacks:**
  - The base style is the final state.
  - Every timeline rule sits inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: view())`.
  - With reduced motion, steps swap instantly.
  - Without scroll-driven animations, IntersectionObserver effects still work and Reveal handles headings.

See the spec's "Scroll experience" section in full.

**Blocked by:** 03 (Page layout, blocks, bold type and the Discussion band)

**Status:** ready-for-agent

- [ ] Each Scene kind (chat, terminal, flow, files, meter) steps forward and back as its captions cross the trigger line. Screenshots of each mid-Scene, using the example page or PR B's drafts
- [ ] A Scene shows the right step after a reload mid-page, and after navigating away and back (Activity re-show), with no scrolling needed
- [ ] Every query and observer is scoped to a root ref and disconnected in cleanup, and two mounted Lesson pages never interfere
- [ ] The section bar shows the label, the current Section (`aria-current="location"`), working dot links, Checkpoint tick slots and the progress line, and jumping to a Section never hides its heading under the bar
- [ ] Tones shift paper ↔ soft between Sections and to navy for the Final test, on the `.lesson` wrapper only, and text stays at least 4.5:1 in every tone
- [ ] Headings rise and un-clip, `==mark==` sweeps, numerals drift, and the hero drifts, with no heading also getting the Reveal fade where `view()` works
- [ ] With reduce motion on, nothing moves, Scenes still step (instantly), and tones change instantly
- [ ] With the `@supports` block switched off (the Firefox path), scroll-timeline effects rest at their final state, the progress line is hidden, and Scenes, tones, the bar and Reveal still work
- [ ] With JavaScript off, Scenes show their final state and the bar is plain links
- [ ] On a 390px phone, the stage pins only across its captions, the bar tucks away while it's pinned (progress line still visible), at least 55% of the viewport stays for text, and there's no sideways scroll
- [ ] No `scroll`, `resize` or `wheel` listeners. Continuous effects use transform and opacity only, plus the two named exceptions (heading `clip-path`, mark `background-size`). CLS reads 0
- [ ] The new client JavaScript is under 8 KB gzipped (from `next build` output against `main`), with no new dependencies
- [ ] Existing tests, lint, `tsc --noEmit` and build pass. Mid-scroll screenshots at 3 points on `grilling` (or the example page) at 390px and 1440px, with reduce motion off and on

## Comments

- 2026-10-23: **Deferred from the first release.** Scenes ship in their final state with no stepping. The markup contract that shipped is the one in the header comment of `src/app/learn/[slug]/scene.tsx` (ticket 03): items carry `data-step="<n>"`, and the stepper is to set `data-stepper="on"` and `data-active-step` on the figure. That differs from this ticket's wording (`data-on` / `data-new` on items); follow the shipped markup, or change both together.
