# 06 — Comment box on Lesson pages

Status: ready-for-agent
Blocked by: 05

## What
Under each Lesson, show its Comments (newest first) and a form with name (optional) and body. The form posts to `POST /api/comments`, shows any error message, and refreshes the list when the post succeeds.

## Done when
- On `npm run dev`, posting a Comment on `/learn/grilling` shows it immediately and it's still there after a reload.
- An invalid post shows the API's error message.
- On a PR preview, the same flow works against the preview's own Neon branch, and `main` stays untouched.
- After merging, it works on the production URL. **v1 shipped.**

## Comments

**Prototype verdict (2026-10-21):** comments live in the sticky right-hand **Discussion panel** from layout C: heading "Discussion · N", compact form (name, comment, Post button) on top, scrollable newest-first list below, each Comment with a blue left rule. See the note on issue 03 and branch `prototype/lesson-page`.
