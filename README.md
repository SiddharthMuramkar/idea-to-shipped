# Idea to Shipped

A free library of from-zero Courses on building software with coding agents: Git and GitHub, CI/CD, how coding agents work, and [Matt Pocock's Skills](https://github.com/mattpocock/skills) for Claude Code. Every Lesson has optional Quick checks and ends with a Final test; submitting it marks the Lesson Done. Visitors need no account: their progress stays in their browser, and they can leave a Comment on any Lesson.

Live at https://idea-to-shipped.vercel.app.

## Running it locally

You need Node.js 24 and, for the database, access to the site's Vercel and Neon projects.

```bash
npm ci
```

Two env files hold the database URLs. Git ignores them, so they never get committed.

| File | Neon branch | Read by | Where the values come from |
|---|---|---|---|
| `.env.local` | `vercel-dev` | `npm run dev`, `npm run db:migrate`, a local `npm run build` | Run `vercel link`, then `vercel env pull .env.local`. The Neon integration sets `DATABASE_URL` and `DATABASE_URL_UNPOOLED` for Vercel's Development environment. |
| `.env.test.local` | `test` | `npm test`, `npm run db:migrate:test` | Only `DATABASE_URL`, copied from the `test` branch in the Neon console. |

> [!WARNING]
> The database tests empty the `comments` table, so `.env.test.local` must point at the `test` branch, never at production. The tests take `DATABASE_URL` from that file and nowhere else.

Then:

```bash
npm run db:migrate        # bring the vercel-dev branch up to date
npm run db:migrate:test   # and the test branch
npm run dev               # http://localhost:3000
```

Only writing Lessons? You need no database and no env file: `npm ci`, then `npm run test:content`.

The pages are `/` (the Courses), `/courses/<course>`, `/learn/<slug>`, `/progress` and `/credits`. A Visitor's progress is kept in their browser's localStorage under `its-progress-v1`; to start over while you work, use "Reset my progress" on `/progress`.

| Command | What it does |
|---|---|
| `npm run dev` | Serves the site. Lessons need nothing else; Comments need `.env.local`. |
| `npm run test:content` | Checks every Course and Lesson in `content/`, renders every Lesson and the pages, and tests the progress store, shuffling and grading. Needs no database or env file. |
| `npm test` | Runs every test, the database tests included. |
| `npm run lint` | Runs ESLint. |
| `npx next typegen && npx tsc --noEmit` | Type-checks. `next typegen` writes the route types that `tsc` needs. |
| `npm run build` | Applies migrations, then builds the site. |
| `npm run db:generate` | Writes a migration after a change to `src/db/schema.ts`. |

## Content

Each Course is a folder in `content/`:

- a `course.md`, whose header gives the Course's `title`, `slug` and `description` (and optionally its `order` in the list of Courses, and an `image` with its `imageAlt`), then lists its Lessons by Slug in reading order, grouped into Parts if it has them;
- one `<slug>.md` per Lesson, whose header gives its `title`, `slug` and a one-sentence `summary` (and optionally an `image` with its `imageAlt`). Its text is Markdown plus typed blocks (goals, callouts, Scenes, flashcards, diagrams, quick-check questions, sources), and it ends with a `## Final test` of at least five questions.

Every image a header names is credited once, in `content/image-credits.json`, keyed by its path, and must be openly licensed (CC0, public domain, CC BY or CC BY-SA). A Course or Lesson without an image gets a navy picture in its Course's colour. The home page shows `public/images/home/hero.jpg` and `cta.jpg` once the manifest credits them, and Course images until then. `npm run test:content` checks every Course, and its messages say what to fix. For a complete example, copy the one-Lesson Course in `src/lessons/__fixtures__/complete-example/`, with its `image-credits.json`. How a Lesson should read is in [docs/writing-guide.md](docs/writing-guide.md).

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request and every push to `main`. Its `db` job needs a repository secret, `TEST_DATABASE_URL`, set to the Neon `test` branch's connection string. Until that secret exists, the job is skipped.

## Deploying

The site runs on Vercel with the Neon-managed integration, which gives each environment its own Neon branch and sets its `DATABASE_URL`.

| Environment | Neon branch |
|---|---|
| Production | `main` |
| Preview | `preview/<git-branch>`, one per Git branch |
| Development (what `vercel env pull` reads) | `vercel-dev` |
| Tests (not on Vercel) | `test` |

Vercel runs `npm run build`, so every deploy applies the migrations committed in `drizzle/` before it builds. A preview tries a migration on its own branch before production does.

The reasons behind these choices are in [docs/adr/](docs/adr/), and the words the code uses are in [GLOSSARY.md](GLOSSARY.md).
