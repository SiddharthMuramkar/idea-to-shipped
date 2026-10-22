# 05: Scroll motion

**What to build:** The site comes alive as you scroll.

- **Reveal:** headings, paragraphs, lists, tables, photos and cards fade in and rise slightly as they reach the screen. This happens once, quickly (about 0.6s), and items that arrive together are slightly staggered. It applies to every block of a Lesson's text, so the Lesson builds up as you read.
- **Parallax:** photo bands (the home page opening photo, Lesson photo bands, the call-to-action) get a gentle parallax using CSS scroll-driven animation where the browser supports it, and stay still elsewhere.

One small piece of browser code handles reveal; there's no animation library.

**Blocked by:** 02 (Lesson pages with photos), 03 (Home page)

**Status:** resolved

- [x] Reveal works on the home page and every Lesson page, including the Lesson text blocks and the Discussion panel
- [x] Each element animates once; scrolling back up doesn't replay it; nothing flickers on page load
- [x] With reduce-motion turned on there is no movement at all, and everything is simply visible
- [x] With JavaScript off, all content is visible (content is hidden for reveal only once the browser code is running)
- [x] Parallax runs where supported and is harmless where it isn't
- [x] Scrolling stays smooth on a phone-sized screen; no sideways scrolling
- [x] Existing tests, lint and build pass; screenshots mid-scroll at phone and desktop widths, and one with reduce-motion on

## Comments

**Built (ticket 05, branch `ticket/05`):**

- **Reveal** (`src/app/reveal.tsx`, a `"use client"` `<Reveal />` that renders nothing). It is rendered once at the top of the home page and of `learn/[slug]/page.tsx`, so it runs on every page mount and every Activity re-show. Targets:
  - anything marked `data-reveal`
  - each child of a container marked `data-reveal-children`. A child that's a container itself passes the reveal on to its own children, so the groups never animate twice.

  In a layout effect (before paint) it does three things:
  - marks targets already on screen `data-reveal-state="shown"`, with no fade
  - marks the rest `hidden` and watches them with one IntersectionObserver (`rootMargin` −8% at the bottom)
  - flips each one to `shown` once and stops watching it. Items arriving in the same callback get `--reveal-i` 0…5 for an 80ms stagger.

  It skips elements that aren't drawn (pages that Activity keeps hidden after navigation), disconnects on cleanup, and returns early with reduce-motion on. No `<html>` class is involved, so Strict Mode can't strip it, and with no JavaScript nothing is ever hidden.
- **Markers:**
  - home: the hero and CTA `.photo-band-inner`, `.home-intro` and its text block, the `#lessons` section, `.lesson-grid`, the `#flow` `.home-section` and `.flow-steps`
  - Lesson page: the band's `.photo-band-inner`, `.prose` (so every block of a Lesson's text), `.prev-next`, and `data-reveal` on the Discussion `<aside>`. That one attribute is the only change in `discussion.tsx`.
- **CSS** (`globals.css`, the "Scroll motion" block before the reduce-motion block, all inside `prefers-reduced-motion: no-preference`):
  - `[data-reveal-state="hidden"]` is `opacity: 0` and `translateY(1.5rem)`. `[data-reveal-state="shown"]` carries the 0.6s transition and its stagger delay.
  - Parallax sits inside `@supports (animation-timeline: view())`. `.photo-band` declares `view-timeline: --band block`, and `.photo-band-photo` animates on `--band`:
    - `[data-hero]` bands (home hero, Lesson band) use `band-drift`, 0 → `translateY(30%)` over `exit 0% exit 100%`
    - `.home-cta` grows its photo box to `inset: -12% 0` and uses `band-glide`, −9% → 9% over `cover`.
  - **Gotcha:** `animation-timeline: view()` on the photo itself doesn't work. The band's `overflow: hidden` makes the band the photo's scroll container, so the timeline never moved. That's why the band names its own timeline.

**Hooks for later work:**
- To reveal something new, add `data-reveal` (one item) or `data-reveal-children` (each child) in JSX. On a page without `<Reveal />` (e.g. `/credits`), render it once there too.
- Any new `.photo-band` with `data-hero` gets the drift for free. A band lower down can copy the `.home-cta` rule.

**Verification:**
- Driven through Chrome's DevTools protocol with a real scroll, using the new scratchpad script `/private/tmp/claude-501/-Users-siddharth-Developer-trying/8bf55acc-42cf-45d9-a9eb-b4943908248f/scratchpad/implement-spec/scroll-shot.mjs <url> <out> <w> <h> <scrollY|fraction> [reduce]`. It sets an exact viewport, so 390px is a true 390, scrolls in steps, screenshots, and prints the reveal counts, `scrollWidth` and the photos' transforms. Use it for real mid-scroll shots.
- `scrollWidth` was 390 at 390px on the home page and on all 12 Lessons, scrolled halfway. With reduce-motion on, no element got a reveal state and the photo transforms were `none`. The server HTML has no `data-reveal-state` at all, so content shows without JavaScript.
- Client navigation home → `/learn/tdd` → back (`nav-check.mjs` in the same folder): no hidden item was left on screen at any step, and on going back, home's scroll position and its revealed items were kept.
- vitest (25), eslint, `tsc --noEmit` and `next build` all pass. No new tests: nothing in the Lessons module changed, and the spec checks the look with screenshots.

**Screenshots** (`/private/tmp/claude-501/-Users-siddharth-Developer-trying/8bf55acc-42cf-45d9-a9eb-b4943908248f/scratchpad/implement-spec/screenshots/`):
- `05-home-desktop.png` (scrolled to the Lessons), `05-home-desktop-hero-scrolled.png` (the hero photo drifting), `05-home-desktop-mid-reveal.png` (caught mid-fade, with the stagger visible), `05-home-phone.png`
- `05-grilling-desktop.png`, `05-grilling-phone.png`
- `05-main-flow-phone-reduced.png`, `05-home-desktop-reduced.png` (reduce-motion on)

**Notes / not done:**
- No screenshot with JavaScript off: headless Chrome takes none with scripts disabled. It was checked from the HTML instead (see above).
- I couldn't check Firefox (no scroll-driven animations): the `@supports` block simply doesn't apply there.
- The dev server still logs the earlier `params` outside `<Suspense>` warning for `/learn/[slug]` (noted in ticket 02). Its LCP warning for `home-intro.jpg` came from the scripted scroll, which doesn't count as user input.
