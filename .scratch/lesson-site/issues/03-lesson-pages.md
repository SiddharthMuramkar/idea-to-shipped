# 03 — Lesson pages from Markdown

Status: ready-for-agent
Blocked by: 01

## What
Load Lessons from `content/lessons/*.md` (frontmatter `title`, `slug`, `order`), and render the home list and `/learn/<slug>` statically, with Previous/Next links. An unknown slug returns 404. Expose a lookup the comments module can use: "does this slug exist?"

## Done when
- The home page lists the existing Lessons in order as "Lesson N — Title".
- `/learn/grilling` and `/learn/domain-modeling` render, with working Previous/Next links.
- `/learn/nope` returns 404.
- Tests cover loading, ordering, and the slug lookup.

## Comments

**Prototype verdict (2026-10-21):** layout **C, "side-by-side discussion"**, won. The Lesson sits in the left column under a solid royal-blue title band ("Lesson N" + title), and a sticky Discussion panel on the right holds the comment form and list. It stacks to one column under ~860px wide. The page needs a wider container than the 720px reading column. Built for issue 03: the two-column frame and the blue band, with an empty Discussion panel placeholder. Issue 06 fills the panel.
Prototype source (throwaway, never merge): branch `prototype/lesson-page`, file `src/app/prototype/lesson/variants.tsx` (`VariantC`).
