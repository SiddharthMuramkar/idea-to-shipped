---
title: PR + ship
slug: pr-and-ship
order: 8
---

## What it is

A **pull request (PR)** is how a change gets into the real site. The change lives on its own **branch**, gets reviewed and tested, then gets **merged** into `main`. Merging to `main` deploys to production automatically.

## When to use it

Always. A rule on my machine even **blocks pushing straight to `main`**, so every change has to go through a PR.

## What I typed

Nothing special. The agent opened each PR with `gh pr create`, and I clicked **Squash and merge** on GitHub. Six PRs in total built v1.

## What happened

**Every PR comes with three things:**

| Thing | Example | What it is |
|---|---|---|
| Git branch | `issue-06-comment-box` | The code change, kept off `main` |
| Preview website | `idea-to-shipped-xxxx.vercel.app` | A full copy of the site, built from that branch |
| Database copy | `preview/issue-06-comment-box` | A copy of the database just for that preview |

**How to test a PR (I didn't know this at first):**
1. Open the PR on GitHub.
2. Find the **Vercel bot's comment** and click **Visit Preview**.
3. Do the thing the PR is about (post a comment, click a page).
4. Try to break it (empty form, wrong URL, reload).
5. Only then: **Squash and merge**.

**My mistake:** on the final PR I merged first and tested after. It worked, but only because the risky parts were already tested. On a PR that changes the database, that order could damage real data.

**I proved the copies are separate:** I posted on the preview, then checked the real site. The comment wasn't there. Two databases, completely separate.

**Migrations ship themselves:** when a PR changes the database, the preview build migrates the *copy* first. Merging migrates production. Nobody has to remember `alembic upgrade head`.
