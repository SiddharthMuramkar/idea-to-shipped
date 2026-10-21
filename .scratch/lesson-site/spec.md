# Spec: Lesson Site v1

Status: ready-for-agent

## Goal
A small personal course site that teaches Matt Pocock's Skills and agentic coding, written as a journal of building this site. v1 is **done** when the site is live on a `*.vercel.app` URL and a Visitor can post a Comment on a Lesson that persists in Neon.

Read first: `GLOSSARY.md` (use its terms exactly) and `docs/adr/0001`–`0004`.

## Users
- **The author**: writes Lessons as Markdown files and reviews the architecture.
- **Visitors**: anonymous readers who read Lessons and leave Comments.

## What v1 does

### Lessons
- 11 Lessons, read in order: Start here, Grilling, Domain modeling, Spec + issues, Wizard, Prototype, TDD, Code review, PR + ship, Diagnosing bugs, Models, effort & ultracode.
- Each Lesson is a Markdown file in `content/lessons/NN-<slug>.md` with frontmatter `title`, `slug`, `order`.
- Lessons are written one per Phase, as we go. v1 ships with whichever Lesson files exist. Missing Lessons simply don't appear.
- Each Lesson has the sections: What it is → When to use it → What I typed → What happened. Comments follow below.
- Home page `/`: the ordered list of Lessons ("Lesson 1 — Grilling").
- Lesson page `/learn/<slug>`: the rendered Lesson, with Previous/Next links at the bottom. An unknown slug returns 404.
- Lesson pages are static, built at deploy time.

### Comments
- Every Lesson page shows its Comments, newest first, and a form to post one.
- A Comment has a **body** (required, trimmed, 1–2000 characters) and an optional **name** (max 50 characters). An empty name displays as "Anonymous".
- Comments can't be edited, deleted, replied to, or moderated through the site.

### API (see ADR 0001)
| Method | Path | Success | Errors |
|---|---|---|---|
| `GET` | `/api/comments?lesson=<slug>` | `200` + `[{ id, name, body, createdAt }]`, newest first | `400` if the slug is missing or unknown |
| `POST` | `/api/comments` with body `{ lesson, name?, body }` | `201` + the created Comment | `400` + `{ error }` if invalid or the slug is unknown |

Layering: Route Handler (HTTP only) → comments module (validation, save, list) → Drizzle → Neon. The comments module rejects slugs that don't match an existing Lesson, because there's no foreign key (ADR 0004).

### Data
One table, `comments`: `id`, `lesson_slug`, `name` (nullable), `body`, `created_at`. Index on `(lesson_slug, created_at)`.

### Environments (see ADR 0002)
| Environment | Neon branch |
|---|---|
| Local `npm run dev` | `dev` |
| `npm test` | `test` |
| PR preview | auto-created per PR (setup to be verified in the docs) |
| Production | `main` |

Drizzle Kit migrations are committed to git and applied automatically during every Vercel build.

### Testing (see ADR 0003)
Vitest. Comments module and API tests run against the real Neon `test` branch. No database mocks.

### Look
One small plain CSS file, no Tailwind. White background, dark royal blue accents (`#1E3FCC`), black text, `border-radius: 0` everywhere, one clean sans-serif font, narrow reading column. Clean, not fancy.

## Out of scope for v1
Login or accounts, editing/deleting/moderating Comments, spam protection, replies, dark mode, search, sidebar, custom domain, Lessons in the database, a per-Lesson "built with" box.

## Issues
`issues/01` → `issues/06`, in order. See each file's `Blocked by:` line.
