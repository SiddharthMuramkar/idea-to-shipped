# Spec: The main flow Lesson + a GE-style redesign

Status: ready-for-agent

Read first: `GLOSSARY.md` (use its terms exactly, including the new **Main flow** and **Built-in command**) and `docs/adr/0001`–`0004`. This spec replaces the "Look" section of `.scratch/lesson-site/spec.md`; everything else in that spec still holds.

## Problem Statement

I'm learning Matt Pocock's Skills, and the hardest part as a beginner is knowing **which command to type when**. My course teaches the order I happened to use while building v1 (`/grilling`, `/domain-modeling`, "write the spec", `/tdd` ×4, `/code-review`), but Matt's current Main flow is different (`/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement` or `/implement-spec`), and nothing on the site maps one to the other or explains the forks in the road ("is this big enough for a spec?", "when do I `/clear`?").

The site also looks like a plain v1: one narrow column, a solid blue band, no photos, no motion. I want it to look and feel like a Fortune 500 site, in the style of GE Aerospace and GE Vernova: big photos, big headings, sections that change as you scroll.

## Solution

1. A new last Lesson, **Lesson 11, "The main flow"**, slug `main-flow`. It's a which-command-when map for beginners, written as a journal of building this very PR with the Main flow. The old Lessons' text stays exactly as it is, and the new Lesson includes an "old way → new command" table that bridges them.
2. A full visual redesign, borrowing from GE Aerospace and GE Vernova:
   - big photos and big headings
   - light and dark bands that alternate down the page
   - a header that sits see-through over the top photo and turns solid as you scroll
   - headings, paragraphs, photos and cards that slide and fade in as you scroll
   - a brand logo that is also the browser-tab icon
3. Every Lesson gets its own photo, chosen to match its topic, shown big at the top of the Lesson page and on its card on the home page.

## User Stories

1. As a beginner Visitor, I want one Lesson that tells me which command to type in which situation, so that I stop guessing.
2. As a beginner Visitor, I want the Main flow drawn as an ordered path with its forks, so that I can see where I am and what comes next.
3. As a beginner Visitor, I want to know when to use `/to-spec` + `/to-tickets` versus going straight to `/implement`, so that I pick the short road for small jobs.
4. As a beginner Visitor, I want to know the difference between `/implement` per ticket and `/implement-spec`, so that I can choose between driving each ticket and letting it run.
5. As a beginner Visitor, I want to know when to `/clear` and when not to, so that I don't throw away my grilling before the spec is written.
6. As a beginner Visitor, I want to know which commands only I can type (the user-invoked Skills) and which the agent picks up on its own, so that I'm not waiting for the agent to start `/to-spec`.
7. As a beginner Visitor, I want Built-in commands like `/clear` and `/compact` explained as separate from Skills, so that the vocabulary isn't confusing.
8. As a beginner Visitor, I want to know that `/ask-matt` exists, so that I can ask the router when I'm stuck instead of memorising the map.
9. As a Visitor who read Lessons 0–10, I want a table mapping what the old Lessons typed to today's commands, so that the older journal still makes sense.
10. As a Visitor, I want the new Lesson to show what was actually typed to build this PR, so that the map comes with a real example.
11. As a Visitor, I want the new Lesson to say what happened, mistakes included, like every other Lesson, so that it's honest.
12. As a Visitor, I want the home page to open on a big full-width photo with a big headline, so that the site feels professional from the first second.
13. As a Visitor, I want a clear first action on the home page (start the course, see the Main flow), so that I know where to click.
14. As a Visitor, I want the Lessons shown as photo cards with their number and title, so that the course looks inviting and scannable.
15. As a Visitor, I want the page to alternate light and dark sections as I scroll, so that it feels alive and structured, like GE's sites.
16. As a Visitor, I want headings, paragraphs, photos and cards to slide and fade in as they reach the screen, so that scrolling feels lively.
17. As a Visitor, I want each element to animate in only once and quickly, so that the motion never gets in the way of reading.
18. As a Visitor who has "reduce motion" turned on, I want no slide or parallax effects at all, so that the site is comfortable for me.
19. As a Visitor whose browser has JavaScript off or slow, I want all text and photos visible anyway, so that nothing is ever stuck invisible.
20. As a Visitor, I want the header to sit see-through over the top photo and turn solid with a shadow once I scroll, so that it's readable everywhere.
21. As a Visitor, I want a logo in the header and the same mark as the browser-tab icon, so that the site looks like a real brand.
22. As a Visitor, I want every Lesson page to open with its own full-width photo behind the "Lesson N" label and the title, so that each Lesson feels distinct.
23. As a Visitor, I want each Lesson's photo to match its topic (an interview for Grilling, a lab for TDD, two people at one screen for Code review), so that the photos teach rather than decorate.
24. As a Visitor, I want white text over photos to always be readable, so that a bright photo never hides the title.
25. As a Visitor, I want Previous/Next links at the bottom of a Lesson to show the neighbouring Lessons' photos, so that moving on is tempting.
26. As a Visitor, I want the Discussion panel restyled to match, with the same behaviour as today, so that Comments still work exactly as before.
27. As a Visitor on a phone, I want every section, photo and card to fit the screen with no sideways scrolling, so that the site works in my pocket.
28. As a Visitor, I want photos to load fast and sharp at my screen size, so that the photo-heavy design doesn't feel slow.
29. As a Visitor, I want a dark footer listing the Lessons and photo credits, so that the page ends like a professional site.
30. As a photographer whose work is used, I want my name credited next to my photo, so that the Unsplash credit convention is respected.
31. As a keyboard Visitor, I want visible focus outlines on links, buttons and form fields, so that I can navigate without a mouse.
32. As the author, I want each Lesson's photo, its alt text and its credit to live in that Lesson's own file header, so that adding a Lesson stays one file.
33. As the author, I want a Lesson file without a photo to fail loudly and name the file, so that I can't ship a Lesson with a blank band.
34. As the author, I want the old Lessons' text left untouched, so that my journal stays honest and I can rewrite it in my own words later.
35. As the author, I want the site to stay plain CSS with no new styling framework, so that there is less to learn and nothing new to install.

## Implementation Decisions

- **Lessons module (the one seam).** A Lesson's header gains three required fields: `image` (which photo), `imageAlt` (a text description for screen readers) and `imageCredit` (the photographer's name, as Unsplash asks). Missing any of them fails loudly with the file name, exactly like a missing `title` today. `LessonSummary` (used by the home list and by Previous/Next) carries the photo, its alt text and its credit, so every place that shows a Lesson can show its photo.
- **New Lesson.** Slug `main-flow`, title "The main flow", order 11, the same sections as every Lesson (What it is → When to use it → What I typed → What happened). It covers:
  - the Main flow as an ordered path with its forks
  - a "you're in this situation → type this" table
  - which Skills are user-invoked (`/ask-matt`, `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`)
  - the Built-in commands `/clear` and `/compact`, and the rule "don't clear until after `/to-tickets`" (the smart zone)
  - the old way → new command table
  - the real commands typed to build this PR
  
  Sources: Matt Pocock's video "mattpocock/skills: A complete AI Coding workflow, end-to-end" (2026-07-16) and the installed `ask-matt` Skill. "What happened" is finalised after the build, once the outcome is known.
- **Old Lessons.** Only their headers change, to add a photo. Their text is not edited.
- **Photos.**
  - Source: Unsplash, under its free licence.
  - Storage: downloaded into the repo, not loaded from Unsplash's servers, and served through Next.js image optimisation at sizes that fit the screen.
  - One photo per Lesson, chosen to match the Lesson's topic, plus photos for the home page sections.
  - Credits: each Lesson page shows a small "Photo: <name> / Unsplash" credit, and the footer links to a full credits list.
- **Colours.**
  - The royal blue `#1E3FCC` stays as the brand colour.
  - A deep navy is added for dark bands and the footer.
  - One bright warm amber accent is added, used sparingly: small highlights, step numbers, focus rings.
  - Text over photos sits on a dark gradient so it always meets contrast guidelines.
- **Type.** Inter stays for body text. Headings become large and lighter-weight, in the GE Aerospace style, using a matching display face loaded the same way as Inter.
- **Shape.** The v1 rule that forces square corners on everything is removed. Photos and cards stay square-edged, and buttons become GE-style pills with an arrow.
- **Header.**
  - Contents: the logo mark, the wordmark "Idea to Shipped", and links to Lessons and to The main flow.
  - Behaviour: it stays at the top while you scroll. It is see-through with white text over a top photo, and turns solid white with dark text and a soft shadow after you scroll past the photo.
- **Logo + tab icon.** One simple vector logo mark, used in the header and as the site's app/tab icon. It replaces the default Next.js favicon.
- **Home page**, top to bottom:
  1. A full-screen photo with the big headline and two buttons, "Start with Lesson 0" and "See the main flow".
  2. A light intro band.
  3. The Lessons as a grid of photo cards ("Lesson N" + title).
  4. A dark band teasing the Main flow's steps.
  5. A full-width photo call-to-action.
  6. The dark footer.
- **Lesson page.**
  - A full-width photo band with "Lesson N", the big title and the photo credit, with a gentle parallax.
  - Below it, the reading column and the Discussion panel, laid out as today.
  - Previous/Next become photo cards.
  - The Discussion panel is restyled only; it behaves exactly as before.
- **Scroll motion.**
  - **Reveal.** One small piece of browser code marks elements as they enter the screen. They then fade in and rise slightly, once, quickly (about 0.6s), with consecutive items staggered slightly. This applies to headings, paragraphs, lists, tables, photos and cards, including each block of a Lesson's text.
  - **Parallax.** Photo bands use CSS scroll-driven animation where the browser supports it, and simply don't move where it doesn't.
  - **Reduced motion.** With reduce-motion on, every effect is off and content just appears.
  - **No JavaScript.** Content is hidden for reveal only once the browser code is running, so with no JavaScript everything is visible.
- **No new styling framework.** The whole look stays in plain CSS. No Tailwind, no animation library.
- **No change** to Comments, the API, the database, environments or deployment.

## Testing Decisions

- **One seam: the Lessons module**, read through its public functions (list Lessons, get a Lesson, does a Slug exist), with small fixture Lesson folders. That is the existing seam.
- **Good tests** check what the module returns, not how it parses.
- **New tests:**
  - the list carries each Lesson's photo, alt text and credit
  - a single Lesson and its Previous/Next neighbours carry them too
  - a Lesson file missing a photo field fails loudly, naming the file
- **Fixtures:** the existing fixtures gain the three fields, and a new broken fixture covers the missing photo.
- **Prior art:** the existing Lessons module tests, including the "broken Lesson files" test.
- **The look is checked by screenshots, not tests**, at phone (about 390px) and desktop (about 1440px) widths:
  - on the home page, a Lesson page and the new Lesson
  - first locally, then on the Vercel preview
  - with reduce-motion both off and on
  - checking that text over photos is readable and nothing scrolls sideways
- **Existing tests keep passing**, including the Comments tests against the Neon `test` branch.

## Out of Scope

- Rewriting the text of Lessons 0–10.
- Dark mode, search, a sidebar, and a custom domain.
- Any change to Comments, the API, the database or environments.
- Tailwind or any styling or animation library.
- Video backgrounds.
- Automated visual or screenshot regression tests.
- Moving Lessons into a database or CMS.

## Further Notes

- This PR is built with the Main flow itself: grilling (this conversation), `/to-spec`, `/to-tickets`, then `/implement-spec` on the integration branch `main-flow-and-redesign`, ending in one PR.
- This worktree has no installed dependencies and no `.env.local` / `.env.test.local`. Copy them from the main checkout before running the app or the tests.
