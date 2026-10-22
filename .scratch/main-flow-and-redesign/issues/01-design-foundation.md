# 01: Design foundation

**What to build:** Every existing page instantly wears the new brand.

- **Colours:** royal blue `#1E3FCC`, a deep navy for dark bands, and one warm amber accent used sparingly.
- **Type and buttons:** large lighter-weight display headings over Inter body text, and GE-style pill buttons with an arrow.
- **Header:** stays at the top of the page and holds the logo mark, the "Idea to Shipped" wordmark, and links to Lessons and The main flow. It is see-through with white text over a top photo, and turns solid white with dark text and a soft shadow once you scroll past it. On pages without a top photo it starts solid.
- **Footer:** dark, lists the Lessons, and has a place for photo credits.
- **Logo:** the logo mark is also the browser-tab icon and replaces the default favicon.
- **Corners:** the v1 rule forcing square corners on everything is removed. Photos and cards stay square-edged.

Plain CSS only. See the spec's Colours, Type, Shape, Header and Logo decisions.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Colour, type and spacing live as named design tokens in the one stylesheet, and the old square-corners rule is gone
- [x] The header holds the logo, wordmark and two links. It stays at the top while scrolling, switches from see-through to solid after you scroll past a top photo, and starts solid on pages without one
- [x] A simple vector logo mark shows in the header and as the tab icon, and the default favicon is gone
- [x] The dark footer lists every Lesson, links to the credits list, and works at phone width
- [x] Links, buttons and form fields show a visible focus outline
- [x] No sideways scrolling at about 390px wide; existing tests, lint and build pass
- [x] Screenshots of the home page and a Lesson page at phone and desktop widths

## Comments

**Built (ticket 01, branch `ticket/01`):**

- `src/app/globals.css`: every colour, font, size and gap is a token on `:root`. Colours: `--blue`, `--blue-dark`, `--navy`, `--navy-raised`, `--amber`, `--ink`, `--text`, `--muted`, `--line`, `--bg`, `--bg-soft`, `--on-dark`, `--on-dark-muted`, `--error`. Type: `--font-body`, `--font-heading` (Inter Tight, weight 300), `--display-1/2/3`, `--text-sm`, `--text-lg`. Spacing: `--space-2xs` … `--space-3xl`, `--gutter`, `--page-max` (1240px), `--read-max` (720px). Shape: `--radius-pill`, `--shadow-soft`, `--header-h` (4.5rem, 3.75rem under 560px). The `border-radius: 0 !important` rule is gone.
- Fonts: `layout.tsx` loads Inter (`--font-inter`) and Inter Tight (`--font-display`, the next/font variable). Use the CSS token `--font-heading`, not `--font-display`: a token with that name would point at itself.
- Logo: `src/app/logo.tsx` exports `<LogoMark className />` (inline SVG, a blue square with an amber dot and a white arrow). `src/app/icon.svg` is the same drawing, plus `src/app/apple-icon.png` (180px). `favicon.ico` is deleted.
- Header (in `layout.tsx`): `.site-header` is sticky, with `.brand`, `.brand-mark`, `.brand-word` and `.site-nav`. Its links are `/#lessons` and `/learn/main-flow`. The second one 404s until ticket 04 adds that Lesson.
- Footer (in `layout.tsx`): `.site-footer` lists every Lesson from `listLessons()` and links to `/credits`.
- `/credits`: `src/app/credits/page.tsx` is a **stub** ("No photos yet."). Ticket 02 should fill it with the real list.
- Buttons: `.button` is a blue pill with an arrow. `.button-light` is white, for photos and dark bands. `.button-outline` is the quieter outline, and goes white inside `.band-dark`. A plain `<button>` is a pill without the arrow.
- Bands: `.band-light` and `.band-dark` (navy, and its headings and links turn white). `.eyebrow` is the small uppercase "Lesson N" label.
- Focus: one global `:focus-visible` ring, amber outside and navy inside, so it shows on white, on navy and on photos.
- Reduce motion: a global `prefers-reduced-motion: reduce` block turns off all transitions and animations. Ticket 05 can count on it.
- Fixed the Lesson page scrolling sideways at 390px (`minmax(0, 1fr)` in the 860px media query). The Discussion panel's sticky `top` and `max-height` now leave room for the header.

**Hooks for 02 and 03 (the top photo band):**

1. Put `data-hero` on the band, the first thing in the page's `<main>`. CSS gives it `margin-top: calc(-1 * var(--header-h))`, so it slides up under the header. Pad the band's own content by at least `var(--header-h)` so the title clears the header.
2. Render `<HeaderOverlay />` (from `src/app/header-overlay.tsx`) as a direct child of that band. It sets `<html data-header="clear|solid">`: see-through while the band is under the header, solid once you scroll past. It resets to solid when the page is left or hidden. It needs no `usePathname`, so there's no Suspense trap for unknown slugs.
3. Before the page's code runs, `html:not([data-header]):has([data-hero])` already shows the see-through header, so it doesn't flash. A `<noscript>` style keeps it solid when JavaScript is off.

The see-through header's background is a dark top gradient. Text over a bright photo still needs the band's own gradient (spec: "Text over photos sits on a dark gradient").

**Verification:** I checked the see-through and solid states on a temporary test page with a bright gradient band. It was deleted and not committed, because no real page has a photo yet. `scrollWidth` at a true 390px viewport was 390 on `/`, `/credits` and all 11 Lessons. vitest (20 tests), eslint, `tsc --noEmit` and `next build` all pass.

**Screenshots** (all in `/private/tmp/claude-501/-Users-siddharth-Developer-trying/8bf55acc-42cf-45d9-a9eb-b4943908248f/scratchpad/implement-spec/screenshots/`):
- `01-home-desktop.png`, `01-home-phone.png`, `01-lesson-desktop.png`, `01-lesson-phone.png`, `01-lesson-desktop-tall.png` (shows the footer)
- `01-headercheck-top-desktop.png`, `01-headercheck-top-phone.png`, `01-headercheck-scrolled-desktop.png`, `01-focus-check.png`

**Screenshot gotcha (for later tickets):** headless Chrome's window is never narrower than 500px, so `shot.sh … 390 …` lays the page out at 500px and crops it. That makes pages look cut off. Use `scratchpad/implement-spec/phone-shot.sh <url> <out> 390 <h> [flags]` instead: it loads the page in an iframe of the exact width. It also gives correct anchor-scrolled shots (`url#id`); plain `shot.sh` with an anchor renders sticky elements wrong or blank. `scratchpad/implement-spec/dom.sh <url>` prints the DOM after scripts run, which is useful for reading values back.

**Not done / notes:**
- I couldn't take a screenshot with JavaScript off: headless Chrome takes none when scripts are disabled. The noscript override is in the HTML; I checked that with curl.
- Prose tables still break short words mid-word at phone width (v1's `overflow-wrap: anywhere`). Relaxing it made 4 Lessons scroll sideways, so I left it for 02 (for example, by wrapping tables so they scroll on their own).
- The photo manifest (`scratchpad/implement-spec/photos/manifest.md`) didn't exist yet. Ticket 01 needs no photos.
