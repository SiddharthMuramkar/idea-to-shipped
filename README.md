# Idea to Shipped

A site of from-zero Courses. The first, **Idea to shipped**, teaches [Matt Pocock's Skills](https://github.com/mattpocock/skills) for Claude Code, using the building of this very site as its worked example. Visitors can leave a Comment on any Lesson, with no account.

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

| Command | What it does |
|---|---|
| `npm run dev` | Serves the site. Lessons need nothing else; Comments need `.env.local`. |
| `npm run test:content` | Checks every Course and Lesson in `content/` and renders every Lesson. Needs no database or env file. |
| `npm test` | Runs every test, the database tests included. |
| `npm run lint` | Runs ESLint. |
| `npx next typegen && npx tsc --noEmit` | Type-checks. `next typegen` writes the route types that `tsc` needs. |
| `npm run build` | Applies migrations, then builds the site. |
| `npm run db:generate` | Writes a migration after a change to `src/db/schema.ts`. |

## Content

Each Course is a folder in `content/`: a `course.md` that lists its Lessons by Slug in reading order, grouped into Parts if it has them, and one `<slug>.md` per Lesson. `npm run test:content` checks them, and its messages say what to fix. For a complete example, copy the one-Lesson Course in `src/lessons/__fixtures__/complete-example/`. How an Idea to shipped Lesson should read is in [docs/writing-guide.md](docs/writing-guide.md).

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
