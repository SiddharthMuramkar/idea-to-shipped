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
