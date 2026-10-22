# 05: Scroll motion

**What to build:** The site comes alive as you scroll.

- **Reveal:** headings, paragraphs, lists, tables, photos and cards fade in and rise slightly as they reach the screen. This happens once, quickly (about 0.6s), and items that arrive together are slightly staggered. It applies to every block of a Lesson's text, so the Lesson builds up as you read.
- **Parallax:** photo bands (the home page opening photo, Lesson photo bands, the call-to-action) get a gentle parallax using CSS scroll-driven animation where the browser supports it, and stay still elsewhere.

One small piece of browser code handles reveal; there's no animation library.

**Blocked by:** 02 (Lesson pages with photos), 03 (Home page)

**Status:** ready-for-agent

- [ ] Reveal works on the home page and every Lesson page, including the Lesson text blocks and the Discussion panel
- [ ] Each element animates once; scrolling back up doesn't replay it; nothing flickers on page load
- [ ] With reduce-motion turned on there is no movement at all, and everything is simply visible
- [ ] With JavaScript off, all content is visible (content is hidden for reveal only once the browser code is running)
- [ ] Parallax runs where supported and is harmless where it isn't
- [ ] Scrolling stays smooth on a phone-sized screen; no sideways scrolling
- [ ] Existing tests, lint and build pass; screenshots mid-scroll at phone and desktop widths, and one with reduce-motion on
