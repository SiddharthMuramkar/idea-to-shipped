---
title: Start here
slug: start-here
order: 0
image: /photos/start-here.jpg
imageAlt: A wooden desk with a brass lamp beside an open balcony door overlooking the sea at dawn.
imageCredit: Ruben Aster
---

## What it is

This site is a journal of the first full-stack app I ever shipped: this site. I built it with **agentic coding**: an AI agent (Claude Code) wrote the code, and I steered it with **Matt Pocock's skills**, a set of workflows you trigger by typing commands like `/grilling` or `/tdd`.

Each Lesson covers one step, in the order I actually did it.

## When to use it

Read this first. Then follow the Lessons in order. Each one says what the skill is, when to use it, what I typed, and what happened, including my mistakes.

## What I typed

The whole build, start to finish:

| # | I typed | What came out |
|---|---|---|
| 1 | `/grilling` | Decisions: scope, architecture, what's out |
| 2 | `/domain-modeling` | `GLOSSARY.md` + 4 decision records (ADRs) |
| 3 | `write the spec` | A one-page spec + 6 issues with "Done when" lists |
| 4 | `/wizard` | GitHub, Vercel and Neon connected; site live |
| 5 | `/prototype` | 3 layouts to compare; I picked one |
| 6 | `/tdd` ×4 | Lesson pages, database table, API, comment box |
| 7 | `/code-review` | The finished code checked against the spec |

## What happened

**The stack, in plain words:**
- **Next.js**: the website *and* the backend in one project. Folders are URLs.
- **Neon**: Postgres in the cloud, with **branches**: a separate database copy for my laptop, for tests, for every PR, and for production.
- **Drizzle**: talks to Postgres from code (like SQLAlchemy). Its migrations are like Alembic's.
- **Vercel**: hosts the site and deploys every PR as a private preview.

**The one rule I learned:** *I own the architecture and the scope. The agent owns the details.* My job was to decide, review, and check "Done when" lists, not to type code.
