# 05 — Comments API

Status: ready-for-agent
Blocked by: 03, 04

## What
Build the comments module (validate, save, list) and the Route Handlers for `GET` and `POST /api/comments`, exactly as in the spec's API table. Build it test-first against the Neon `test` branch (ADR 0003).

## Done when
- Tests pass for: a valid post, an empty body, a body that's too long, a name that's too long, an unknown slug, a missing slug, newest-first ordering, and "Anonymous" for an empty name.
- `curl` against `npm run dev` creates and lists a Comment.
- Route Handlers contain no validation or SQL. That logic lives in the comments module.
