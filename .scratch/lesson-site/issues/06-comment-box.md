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
