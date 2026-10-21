# 02 — Connect GitHub, Vercel and Neon

Status: resolved
Blocked by: 01

## What
The steps only the author can do (logins, dashboards). The agent generates a `/wizard` to walk through them.
- Create a GitHub repo and push.
- Create a Vercel project from the repo, and confirm the placeholder app deploys to a `*.vercel.app` URL (ship early).
- Add Neon through the Vercel Marketplace, and turn on a Neon branch per preview deployment (to be verified in the docs).
- Create Neon branches `dev` and `test`.
- Put connection strings in `.env.local` (`dev`) and `.env.test.local` (`test`). Never commit them.

## Done when
- The production URL shows the placeholder page.
- The agent can connect to `dev` and `test` from the laptop (checked with a `select 1`).
