# 03: Home page

**What to build:** The home page becomes a GE-style landing page, top to bottom:

1. A full-screen photo with the big headline, a short line under it, and two pill buttons, "Start with Lesson 0" and "See the main flow".
2. A light intro band.
3. The Lessons as a grid of photo cards, each showing "Lesson N", the title and that Lesson's photo.
4. A dark navy band teasing the Main flow's steps.
5. A full-width photo call-to-action.
6. The dark footer.

The header sits see-through over the opening photo. The home page photos are topic-relevant Unsplash photos (people building software, planning, shipping), saved in the repo and added to the credits list.

**Blocked by:** 01 (Design foundation), 02 (Lesson pages with photos)

**Status:** resolved

- [x] The opening photo fills the first screen with readable white text and two working buttons
- [x] Light and dark bands alternate down the page
- [x] Every Lesson appears as a photo card in order, linking to its page; the grid becomes one column on phones
- [x] The Main flow band lists the flow's steps and links to the Main flow Lesson (`/learn/main-flow`)
- [x] The home page photos are credited in the credits list
- [x] The opening photo loads first (it's what you see first) and the rest load as you scroll
- [x] No sideways scrolling at about 390px wide; existing tests, lint and build pass; screenshots at phone and desktop widths

## Comments

**Built (ticket 03, branch `ticket/03`):**

- **Home page** (`src/app/page.tsx`), top to bottom. Each section has an anchor id:
  1. `section.photo-band.home-hero[data-hero]`, holding `<HeaderOverlay />`. A full-screen photo (`min-height: 100svh`) with the eyebrow, `h1`, `.home-hero-lead`, a `.button-row` with "Start with Lesson 0" (`.button-light`) and "See the main flow" (`.button-outline`, linking to `/learn/main-flow`), and the photo credit. The gradient is the band's own `::before`, darkest at the bottom-left behind the text. The photo is `loading="eager"` + `fetchPriority="high"`, `sizes="100vw"`.
  2. `#about.band-light`: "A journal, not a manual", with text on the left and the intro photo on the right (`.home-intro`, one column under 860px). The photo has a small `.figure-credit` caption.
  3. `#lessons.home-section`: every Lesson from `listLessons()` as a `<LessonCard>` in `ol.lesson-grid`. Three columns, two under 1024px, one under 640px, `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"`. Lesson 11 shows up last on its own once ticket 04 adds it, and the "N Lessons" count follows `all.length`.
  4. `#flow.band-dark`: "The main flow", four `.flow-step` items, each an amber `.flow-step-number`, an `h3`, its command(s) in `.flow-step-commands` (kept whole with `nowrap`) and one line of text: `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` or `/implement-spec`. Then a `.flow-note` for the short road ("go from grilling straight to `/implement`") and a `.button-light` to `/learn/main-flow`. The steps live in a `FLOW_STEPS` array at the top of `page.tsx`. If ticket 04's wording differs, change it there.
  5. `#start.photo-band.home-cta`: the closing photo, with "Got an idea? Ship it." and "Start with Lesson 0".
  6. The dark footer (from the layout, unchanged).
- **Home photos:** `public/photos/home-hero.jpg`, `home-intro.jpg` and `home-cta.jpg`, copied unchanged from the manifest (none swapped). Their alt text, photographer and label live in `src/app/home-photos.ts` (`homePhotos.hero/intro/cta`). Their Unsplash links are in `src/app/credits/unsplash.ts`.
- **Credits:** `/credits` has a new "Home page photos" section. The "Photo by <profile> on <Unsplash page>" line is now a small `PhotoBy` helper, shared by both lists.
- **CSS** (`globals.css`, "Home" block): `.home-section` (page-width section with `--space-3xl` padding), `.section-lead`, `.button-row`, `.home-hero`, `.home-hero-lead`, `.home-intro*`, `.figure-credit`, `.lesson-grid`, `.flow-steps`/`.flow-step*`, `.flow-note`, `.home-cta`. `.band-dark .eyebrow` is amber, and `.band-dark :not(pre) > code` is a dark chip, so inline code reads on navy. The old v1 `.lesson-list` styles are gone.

**Hooks for 05 (scroll motion):**

- Parallax targets: `.home-hero .photo-band-photo` and `.home-cta .photo-band-photo`, as on the Lesson band. Both bands have `overflow: hidden`. The hero image has `object-position: 70% 50%`, and the CTA's is `60% 15%` (it keeps the rocket's arc in frame).
- Reveal targets: the section eyebrows, `h2`s and `.section-lead`s; the intro text block and `.home-intro-figure`; each `.lesson-grid > li`; each `.flow-step`; and the hero and CTA `.photo-band-inner` children. Nothing has `data-reveal` yet.
- The hero is `100svh`, so in a tall headless window it grows to the window's height. Use anchor shots (`/#about`, `/#lessons`, `/#flow`, `/#start`) with `phone-shot.sh` for the lower sections.

**Verification:**

- `scrollWidth` at a true 390px (an iframe checker in `public/`, deleted afterwards) was 390 on `/`, `/credits`, `/learn/start-here` and `/learn/grilling`.
- In the HTML, only the hero `<img>` is `loading="eager" fetchPriority="high"`. The intro photo, all Lesson cards and the CTA photo are `loading="lazy"`.
- vitest (24 tests), eslint, `tsc --noEmit` and `next build` all pass (`/` is static).
- No new Lessons-module tests: this ticket needs nothing new from the seam (`listLessons()` already carries each photo).

**Screenshots** (in `/private/tmp/claude-501/-Users-siddharth-Developer-trying/8bf55acc-42cf-45d9-a9eb-b4943908248f/scratchpad/implement-spec/screenshots/`):
- `03-home-desktop.png`, `03-home-phone.png`, `03-home-phone-reduced.png` (first screen)
- `03-home-desktop-tall.png`, `03-home-phone-tall.png` (intro to CTA, reduce-motion on)
- `03-home-lessons-desktop.png`, `03-home-flow-desktop.png`, `03-home-flow-desktop-reduced.png`, `03-home-flow-phone.png`, `03-home-cta-desktop.png`
- `03-credits-phone.png`

**Notes / not done:**

- In anchor-scrolled shots taken without `--force-prefers-reduced-motion`, the solid header shows washed-out white text. Headless Chrome catches the first frame of the header's 0.3s colour transition after the jump. With transitions off (`03-home-flow-desktop-reduced.png`) the solid header is correct. That header code is ticket 01's and is unchanged here.
- "See the main flow" and the flow band's button link to `/learn/main-flow`, which 404s until ticket 04 lands.
