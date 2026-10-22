---
title: Domain modeling
slug: domain-modeling
order: 2
image: /photos/domain-modeling.jpg
imageAlt: A thick dictionary with thumb-index tabs lies open on a pale wooden table against a dark wall.
imageCredit: Pisit Heng
---

## What it is

Domain modeling is a Matt Pocock skill that writes your decisions down so they outlive the conversation. It produces two kinds of files:

- **`GLOSSARY.md`**: one name and definition per concept, plus words to avoid. The agent reads it before working, so it never calls the same thing three different names.
- **ADRs** (Architecture Decision Records) in `docs/adr/`: one short file per big decision, saying *what* we decided and *why*.

It also tests your design by inventing awkward scenarios and asking what happens.

## When to use it

- Right after grilling. Grilling *makes* decisions, and domain modeling *saves* them.
- Whenever a new concept shows up and you're unsure what to call it.
- Whenever you make a decision a future reader would question ("why didn't they just…?").

Only write an ADR when the decision is **hard to reverse**, **surprising without context**, and **a real trade-off**. If any of the three is missing, skip it.

## What I typed

```
/domain-modeling
```

That's all. It already had the decisions from the grilling session.

## What happened

**1. It wrote the glossary.** Six terms: **Lesson, Slug, Skill, Phase, Comment, Visitor**. It caught one fuzzy idea on its own: a Lesson isn't the same as a Skill, because "Start here" and "Models, effort & ultracode" don't teach a Skill.

**2. It wrote four ADRs:**

| ADR | Decision |
|---|---|
| 0001 | Real REST endpoints inside Next.js, not Server Actions or a separate FastAPI service |
| 0002 | One Neon branch per environment, with migrations applied on every build |
| 0003 | Tests hit real Postgres, never mocks |
| 0004 | Comments point at lessons by a permanent slug, with no foreign key |

**3. It tested the design with a scenario.** *"What if you rename a lesson?"* Comments store the lesson's **slug** (like `grilling`). If the slug changes, the comments still exist in the database, but nothing points at them anymore, so they silently vanish from the site.

I didn't get this at first and asked for it to be broken down. Then I mixed up the slug and the API endpoint. The difference:

```
GET /api/comments?lesson=grilling
    └─── endpoint ──┘ └─ slug ─┘
     fixed forever      a value passed in, and stored in the database
```

**Decision:** slugs never change. Numbers go in filenames (`01-grilling.md`) and on the page, never in the slug, so I can reorder lessons safely.

**4. The lesson for me:** a rule written down ("never change a slug") can be cheaper than extra machinery (a lessons table plus a foreign key). The ADR records *why*, so nobody "fixes" it later.
