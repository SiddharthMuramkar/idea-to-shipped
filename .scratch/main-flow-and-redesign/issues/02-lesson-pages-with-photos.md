# 02: Lesson pages with photos

**What to build:** Every Lesson opens with its own full-width photo.

- **Photo band:** the photo sits behind "Lesson N", the big title and a small "Photo: <name> / Unsplash" credit. A dark gradient keeps the white text readable on any photo.
- **Topic match:** the photo matches the Lesson's topic. For example: an interview or whiteboard for Grilling, a lab or measuring instruments for TDD, two people at one screen for Code review.
- **Data:** each photo, its alt text and its credit live in the Lesson's own header (`image`, `imageAlt`, `imageCredit`). The Lessons module requires all three and hands them to the home list and to Previous/Next.
- **Rest of the page:** Previous/Next become photo cards. The Discussion panel is restyled to match and behaves exactly as before.
- **Photo source:** Unsplash, saved into the repo, served through Next.js image optimisation.
- **Old Lessons:** the text of Lessons 0–10 is not edited; only their headers gain the photo fields.

Build the Lessons module change with `/tdd`.

**Blocked by:** 01 (Design foundation)

**Status:** resolved

- [x] Tests (Lessons module seam, fixture folders): the list, a single Lesson and its neighbours carry photo, alt text and credit; a Lesson file missing any photo field fails loudly, naming the file
- [x] All 11 existing Lessons (0–10) have a topic-matched Unsplash photo saved in the repo, with real alt text and the photographer's credit
- [x] A photo credits list (every photo, photographer, link to the Unsplash page) exists and the footer links to it
- [x] Lesson pages show the photo band with readable text and the credit, and the header sits see-through over it
- [x] Previous/Next show the neighbouring Lessons' photos; the Discussion panel looks new and still posts and lists Comments
- [x] Photos load at the right size for the screen (no full-size downloads on phones)
- [x] The text of Lessons 0–10 is unchanged apart from the three new header fields
- [x] Existing tests, lint and build pass; screenshots of two Lesson pages at phone and desktop widths

## Comments

**Built (ticket 02, branch `ticket/02`):**

- **Lessons module** (`src/lessons/lessons.ts`, built test-first): every Lesson header must have `image`, `imageAlt` and `imageCredit`, or it throws `<file>: missing <field>`, the same way a missing `title` does. `LessonSummary` (used by `listLessons()`, `previous` and `next`) now carries all three. The tests cover the list, a single Lesson, its neighbours, and one fixture folder per missing field (`__fixtures__/missing-image`, `missing-image-alt`, `missing-image-credit`). The valid fixtures gained the fields. There are 11 Lessons-module tests, and 24 tests in total.
- **Photos:** the 11 Lesson photos from the manifest are in `public/photos/<slug>.jpg`, unchanged (none swapped, manifest untouched). Each header says `image: /photos/<slug>.jpg`, with the manifest's alt text and photographer. The home photos (`home-hero`, `home-intro`, `home-cta`) and `main-flow.jpg` are **not** copied yet. Tickets 03 and 04 should copy them from `scratchpad/implement-spec/photos/`.
- **Lesson text:** `git diff main-flow-and-redesign -- content/` shows only `+image/+imageAlt/+imageCredit` lines.
- **Lesson page** (`src/app/learn/[slug]/page.tsx`): a `<header className="photo-band lesson-hero" data-hero>` holding `<HeaderOverlay />`, the photo (`fill`, `sizes="100vw"`, `loading="eager"` + `fetchPriority="high"`), then "Lesson N", the `h1` and "Photo: <name> / Unsplash". Below it, the reading column and Discussion are laid out as before. Previous/Next are photo cards, and Next always sits in the right-hand column.
- **Discussion:** CSS-only restyle (soft panel, display-font heading, white comment cards). `discussion.tsx` is untouched.
- **Tables:** `.prose table` is now `display:block; overflow-x:auto`, and its cells use `overflow-wrap: normal`. Wide tables scroll inside themselves, and words no longer break mid-word at 390px. This was the leftover from ticket 01.
- **Credits** (`/credits`): built from `listLessons()`, one row per Lesson photo with a small thumbnail, "Photo by <profile link> on <Unsplash photo page link>". The links live in `src/app/credits/unsplash.ts`, keyed by image path. A photo without an entry still shows the name, unlinked.

**Hooks for later tickets:**

- `.photo-band` is a reusable full-width photo band (home hero, call to action). Markup: `<section className="photo-band …" data-hero?>` → optional `<HeaderOverlay />` → `<div className="photo-band-photo"><Image fill sizes="100vw" …/></div>` → `<div className="photo-band-inner">text</div>`. The gradient is the band's `::before`, and the text sits bottom-left. Set the band's height on your own class (Lessons use `.lesson-hero { min-height: clamp(24rem, 64vh, 40rem) }`). Inside a band, `h1`/`h2` are white and `.eyebrow` is amber. `.photo-credit` is the small muted credit line.
- **Parallax (05):** move `.photo-band-photo`, not the `<img>`. It's an absolute box at `inset: 0` behind the gradient, and the band has `overflow: hidden`, so you can grow it (e.g. `inset: -10% 0`) and transform it.
- **`<LessonCard lesson label? sizes className? />`** (`src/app/lesson-card.tsx`) is a photo card: a 3:2 photo, then `.eyebrow` "Label · Lesson N" and `.lesson-card-title`. It has a shadow, and on hover the photo zooms a little. Ticket 03's home grid can reuse it, passing its own `sizes`, e.g. `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`.
- **Credits for 03/04:** add the home and main-flow photos to `src/app/credits/unsplash.ts`. Lesson 11 then shows up on `/credits` automatically. Home photos are not Lessons, so 03 needs a small "Home page photos" section on the credits page.

**Verification:**

- At a true 390px width (an iframe checker run once from `public/` and then deleted), `scrollWidth` was 390 on `/credits` and on all 11 Lessons.
- The Lesson photo's `currentSrc` at 390px was `/_next/image?url=…&w=640&q=75`, so phones get the 640w version, not the 2400px original.
- In the browser, the Discussion panel listed Comments ("Discussion · 1" on Grilling). I did **not** post a live comment, to keep test data out of the dev database. The posting code (`discussion.tsx`, the API) is unchanged, and the API tests pass against the Neon `test` branch.
- vitest (24 tests), eslint, `tsc --noEmit` and `next build` all pass.

**Screenshots** (in `/private/tmp/claude-501/-Users-siddharth-Developer-trying/8bf55acc-42cf-45d9-a9eb-b4943908248f/scratchpad/implement-spec/screenshots/`):
- `02-grilling-desktop.png`, `02-grilling-phone.png`, `02-grilling-phone-tall.png` (tables, cards, Discussion, footer)
- `02-prototype-desktop.png`, `02-prototype-phone.png` (a bright photo)
- `02-start-here-desktop.png` (a bright sky)
- `02-code-review-desktop-tall.png` (Previous/Next cards and the Discussion panel)
- `02-credits-desktop.png`, `02-credits-phone.png`

**Notes / not done:**

- No screenshot with reduce-motion on. This ticket adds no motion except the hover zoom, which the global reduce-motion block already turns off.
- The dev server logs `Route "/learn/[slug]": Next.js encountered URL data during prerendering` (`params` read outside `<Suspense>`). It comes from the `await params` line, which this ticket didn't change, so it was already there. The build passes. Lesson pages show as ◐ partial prerender for most slugs. I left it alone.
- In the 6000px-tall screenshot window, a Previous/Next card was flagged as the LCP image. That is an artefact of the tall window; at real sizes the band photo is the eager one.
