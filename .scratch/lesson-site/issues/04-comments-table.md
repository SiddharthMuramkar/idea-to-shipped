# 04 — Comments table and migrations-on-build

Status: resolved
Blocked by: 02

## What
Add Drizzle with `@neondatabase/serverless`, the `comments` table from the spec, and the first Drizzle Kit migration. Make the Vercel build apply migrations before `next build` (ADR 0002).

## Done when
- The migration file is committed under `drizzle/`.
- The `comments` table exists on the `dev` and `test` branches (checked through Neon).
- `npm run build` runs migrations and then builds.
