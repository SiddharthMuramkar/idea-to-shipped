---
title: Spec + issues
slug: spec-and-issues
order: 7
part: 2
image: /photos/spec-and-issues.jpg
imageAlt: A person drafts on a large sheet with a scale ruler and a rolled blueprint on a wooden table.
imageCredit: Daniel McCullough
---

## What it is

A **spec** is one page describing what v1 is: what it does, what it doesn't, and how you'll know it's done. **Issues** are small tickets that split the spec into pieces an agent can build and check one at a time.

This is where you **steer** the agent. You don't tell it "build comments". You give it a ticket that says exactly what "done" means.

## When to use it

- After grilling and domain modeling, before any code.
- Whenever a piece of work is too big to describe in one sentence. Split it into tickets.

## What I typed

```
write the spec
```

The agent followed my repo's own rules in `docs/agents/issue-tracker.md`: the spec lives in `.scratch/lesson-site/spec.md`, with one file per ticket in `issues/`.

## What happened

**1. It wrote a one-page spec** from the grilling decisions, the glossary and the ADRs. It includes the API as a table (method, path, success, errors), the data, the environments, the look, and an **Out of scope** list.

**2. It split the work into 6 issues, in build order:**

```
01 Scaffold ──┬──► 03 Lesson pages ──────────┐
              └──► 02 Accounts (me) ──► 04 Table ┴──► 05 API ──► 06 Comment box ──► v1
```

Every issue has:
- **Status**: `ready-for-agent` (the agent can do it alone) or `ready-for-human` (only I can, e.g. logging into Vercel).
- **Blocked by**: which tickets must be finished first.
- **Done when**: a checklist. This is the most important part. It's how I'll judge the agent's work without reading every line.

**3. It flagged three things it added that I hadn't decided:** length limits on comments, rejecting unknown slugs, and deploying the empty app early. A good agent tells you what it assumed instead of hiding it. I approved all three.

**4. The lesson for me:** my job isn't writing code. It's writing (or approving) good **"Done when"** lists, then checking them.
