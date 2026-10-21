---
title: TDD
slug: tdd
order: 6
---

## What it is

TDD (test-driven development) is a Matt Pocock skill for building code **test first**, in a loop:

1. 🔴 **Red**: write one small test and watch it **fail**. That proves the test checks something.
2. 🟢 **Green**: write just enough code to make it pass.
3. Repeat, one slice at a time.

## When to use it

- Building any feature with logic: rules, validation, ordering, database reads and writes.
- Before each slice, agree on **where** tests go: the public "front door" of the code (the skill calls it a **seam**). Tests knock on the front door and never poke at internals.

## What I typed

```
/tdd
```

Four times, once per issue.

## What happened

| Issue | Where the tests went | Result |
|---|---|---|
| 03 Lesson pages | The lesson reader (list, get, exists), using **fake lesson files** | 7 tests. Pages checked by eye. |
| 04 Comments table | No tests, by agreement: no front door yet | Checked the table exists on every database branch |
| 05 Comments API | `GET`/`POST /api/comments`, against the **real test database** | 12 tests, including edge cases (2000 vs 2001 characters, broken JSON) |
| 06 Comment box | No tests, by agreement: the logic lives in the tested API | Checked by eye on the preview |

**Things I learned:**
- A test that's green from the start is fine, as long as you **say so** and don't pretend it went red.
- Tests can be **dangerous**: mine empty a table. A safety check makes them refuse to run anywhere except the `test` database.
- **Not everything needs an automated test.** Deciding *where* to test matters more than testing everything.
