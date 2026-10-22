---
title: Diagnosing bugs
slug: diagnosing-bugs
order: 9
image: /photos/diagnosing-bugs.jpg
imageAlt: A mechanic in a workshop studies and works on a motorcycle engine.
imageCredit: Aaron Huber
---

## What it is

Diagnosing bugs is a Matt Pocock skill for hard bugs: a disciplined loop of **reproduce → form a hypothesis → test it → fix**, instead of guessing.

## When to use it

- When something is broken and the cause isn't obvious.
- When a fix "should have worked" but didn't.
- When something works locally but not on the live site.

## What I typed

Nothing yet. v1 didn't need the full skill. But the agent hit real problems along the way and handled them with the same loop.

## What happened

| Symptom | Diagnosis | Fix |
|---|---|---|
| Wizard raced through every question | Run inside the chat with `!`, which can't press Enter | Run it in a real terminal |
| Build failed: "uncached data during prerendering" | Next.js 16 needs file reads marked as cacheable | Added `"use cache"` |
| `/learn/nope` returned status 200, not 404 | Page streams, and the status is sent before "not found" is known | Documented it and accepted it for v1 |
| A wait-loop never finished | It read the wrong output stream | Fixed the command |
| Preview comment "showed up" on the real site | Two *different* comments looked alike | Checked both databases: they were separate |

**The lesson:** look at evidence (logs, the actual database rows) before deciding what's wrong. The last one wasn't a bug at all.
