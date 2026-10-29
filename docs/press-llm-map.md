# Press — LLM map (read this first)

One page. Every path below was checked on disk. Press is the editorial-journal presentation defined in [ADR 0008](adr/0008-press-editorial-journal-no-photos.md) and [GLOSSARY.md](../GLOSSARY.md) (`Press`); typed blocks and scroll effects are [ADR 0007](adr/0007-typed-markdown-blocks-and-css-scroll-effects.md). If this file and the code disagree, the code and its tests win — fix this file.

## Token table — `src/app/globals.css` `:root`

The whole look lives in this one file (2,046 lines). No component hard-codes a colour; everything reads these tokens. Exact values are pinned by `src/app/press-css.test.tsx` (`LIGHT_TABLE` / `DARK_TABLE`).

| Token | Light | Dark (`prefers-color-scheme: dark`) | Role |
|---|---|---|---|
| `--paper` | `#edeae3` | `#171614` | Page background. This site's own paper — not `#ffffff`, not `#fffef9`, not `#faf8f4` |
| `--wash` | `#f8f6f0` | `#22201d` | Raised surfaces: code, Scenes, cards |
| `--ink` | `#1c1b18` | `#e8e5dd` | Body text, headings, the one solid button |
| `--muted` | `#59564e` | `#a29f96` | Kickers, labels, secondary text |
| `--rule` | `#d6d0bf` | `#35332e` | Hairline rules instead of cards/bands |
| `--accent` | `#1d5d78` | `#86bdd7` | Links, focus ring, hover |
| `--good` / `--good-wash` | `#256b3f` / `#e6f2ea` | `#78c596` / `#1b2a20` | Correct-answer state |
| `--bad` / `--bad-wash` | `#9c3a28` / `#f8e8e4` | `#e9937f` / `#2f1f1b` | Wrong-answer state |

Other `:root` tokens (light block only; dark overrides colours only):

| Token | Value | Notes |
|---|---|---|
| `--serif` | `var(--font-source-serif), Georgia, "Times New Roman", serif` | All text. Source Serif 4 via `next/font` in `src/app/layout.tsx` |
| `--mono` | `var(--font-jetbrains-mono), ui-monospace, …` | Code, labels, aligned numerals only — never body copy |
| `--measure` | `680px` | The one reading column. Every reading surface uses it; `--page-max` must not return |
| `--header-h` | `3.5rem` | Sticky header height; `scroll-padding-top` derives from it |
| `--space-2xs … --space-2xl` | `0.25rem … 4rem` | Spacing scale (`2xs, xs, s, m, l, xl, 2xl`) |

Print (`@media print` in the same file) forces light: `color-scheme: light`, `--paper: #fff`, `--ink: #000`, and hides header/footer/nav/forms. The only literal hex allowed outside `globals.css` is `themeColor` in `src/app/layout.tsx` (`viewport` export), which must stay in sync with `--paper` — the file says so in a comment.

## File ownership per surface

Change a surface only in its owner file(s). CSS for every surface is in `src/app/globals.css` — there is no other stylesheet and no CSS module.

| Surface | Owner file(s) | Paired test |
|---|---|---|
| Shell: header, footer, fonts, `themeColor` | `src/app/layout.tsx`, `src/app/logo.tsx` | `src/app/press-shell.test.tsx` |
| Home index (Parts, Lesson cards, Main flow) | `src/app/page.tsx`, `src/app/lesson-card.tsx` | `src/app/press-home.test.tsx` |
| Lesson page chrome (kicker, title, prev/next) | `src/app/learn/[slug]/page.tsx` | `src/app/learn/[slug]/lesson-render.test.tsx` |
| Lesson article & Sections | `src/app/learn/[slug]/section.tsx` | `src/app/learn/[slug]/lesson-render.test.tsx` |
| Typed blocks (goals, callouts, try, site-story, sources) | `src/app/learn/[slug]/blocks.tsx` | `src/lessons/lessons.test.ts`, `src/lessons/course.test.ts` |
| Scenes (chat / terminal / flow / files / meter) | `src/app/learn/[slug]/scene.tsx`; parsing in `src/lessons/scenes.ts` | `src/app/learn/[slug]/lesson-render.test.tsx` |
| Checkpoint & Final test questions | `src/app/learn/[slug]/question.tsx`; parsing in `src/lessons/questions.ts` | `src/app/learn/[slug]/question.test.tsx` |
| Discussion band (Comment form + list UI) | `src/app/learn/[slug]/discussion.tsx` | `src/app/learn/[slug]/press-discussion.test.tsx` |
| Copy button, icons | `src/app/learn/[slug]/copy-button.tsx`, `src/app/learn/[slug]/icons.tsx` | — (covered via render tests) |
| All Press CSS (tokens, layout, Scenes, print, dark) | `src/app/globals.css` | `src/app/press-css.test.tsx` |
| Lesson files (content, not code) | `content/lessons/NN-<slug>.md` (20 files) | `npm run test:content` |
| Lesson parsing & course lint | `src/lessons/lessons.ts`, `src/lessons/blocks.ts`, `src/lessons/markdown.ts`, `src/lessons/course-lint.ts` | `src/lessons/*.test.ts` |
| Authoring contract for Lessons | `docs/authoring-lessons.md` | `src/lessons/course-lint.ts` enforces it |

## Invariants (do not break)

- **One column, one measure.** Reading surfaces are `max-width: var(--measure)` (680px) on `--paper`. No wider fixed measure, no `--page-max`, no hero/photo bands/cards (ADR 0008).
- **No photos in Lessons.** No photo header keys, no `public/photos/` (deleted), no credits page. `/credits` permanently redirects to `/` in `next.config.ts`. Re-adding photos means reversing ADR 0008's contract, not flipping a setting.
- **Tokens only.** Components use `var(--…)`; never lighten `--paper` toward white to fix contrast — darken the foreground instead (comment in `globals.css`).
- **System colour scheme, no toggle.** `:root { color-scheme: light dark; }`; dark is a token remap only. Print is always light.
- **Static final state.** Base style is the final state: nothing is hidden until JS runs and nothing moves (header comment in `globals.css`). No-JS and no-`IntersectionObserver` readers see the complete page.
- **Permanent identifiers.** A Lesson's `slug` and a question's `id` never change once published ([ADR 0004](adr/0004-comments-reference-lessons-by-permanent-slug.md), [ADR 0005](adr/0005-answers-reference-questions-by-permanent-id.md)). Titles, `order`, `part` may change.
- **Vocabulary.** Use `GLOSSARY.md` words exactly: Lesson, Part, Scene, Checkpoint, Final test (in full), Site story, Visitor, Press.

## Gate commands

Run from the repo root. `test:content` needs no database or env file; the full `test` run does (Neon `test` branch, [ADR 0003](adr/0003-tests-hit-real-postgres.md)).

| Command | What it gates |
|---|---|
| `npm run test:content` | **The Press/content gate.** Lesson parsing, course lint, and page render tests (`--project content --project render` in `package.json`; projects defined in `vitest.config.mts`). Run this for any Press or Lesson change |
| `npm test` | Everything, including DB tests against the Neon `test` branch (`.env.test.local`). Never point it at production — DB tests empty the `comments` table |
| `npm run lint` | ESLint (`eslint.config.mjs`) |
| `npm run build` | `drizzle-kit migrate && next build`. A broken Lesson fails the build. This is what Vercel runs |
| `npm run dev` | Local server at `http://localhost:3000`; read a Lesson at `/learn/<slug>` |

## Where NOT to edit

These layers have one job each (see `README.md` "How it works"). A Press change never needs them; touching them for a visual fix is the wrong layer.

| Do not edit for Press work | Why / where the real logic lives |
|---|---|
| `src/db/schema.ts`, `src/db/index.ts`, `drizzle/` | Drizzle schema, Neon client, migrations. Schema changes go through `npm run db:generate`, never by hand-editing migrations |
| `src/comments/comments.ts`, `src/comments/limits.ts` | Comment validation, save, list (`MAX_BODY = 2000`, `MAX_NAME = 50`). The Discussion UI in `discussion.tsx` imports the limits; it does not redefine them |
| `src/app/api/comments/route.ts` | HTTP only: status codes and JSON. Validation and SQL live in `src/comments/comments.ts`. Contract: `GET /api/comments?lesson=<slug>`, `POST /api/comments { lesson, name?, body }` |
| `content/lessons/*.md` headers' `slug` values | Permanent (ADR 0004). Also: no new header keys — an unknown key is a build error by design |

## Deferred: the Scene stepper (not shipped)

Scenes render **static, in their final state**: every step's items visible at once, steps as numbered captions below (`src/app/learn/[slug]/scene.tsx`, `GLOSSARY.md` "Scene"). The scroll stepper that builds a Scene step by step is **deferred future work** under ADR 0007 (CSS scroll-driven animations + one small `IntersectionObserver` per effect; no animation library) — it is not shipped behaviour, so do not describe or build it as if it exists.

The hooks for it are already in place and must be preserved: items carry `data-step="<n>"` (last step also `data-new`), captions are `<li data-step>` in `.scene-steps`, and a future stepper may set `data-stepper="on"` / `data-active-step` on the figure. No current CSS hides items by step and nothing pins — keep it that way until that work is explicitly commissioned.
