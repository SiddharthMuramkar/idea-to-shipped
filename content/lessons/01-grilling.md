---
title: Grilling
slug: grilling
order: 1
image: /photos/grilling.jpg
imageAlt: A woman in glasses takes notes while questioning a man across an office desk.
imageCredit: Vitaly Gariev
---

## What it is

Grilling is a Matt Pocock skill that interviews you about an idea until you and the agent agree on what you're building. It asks questions, gives a recommended answer for each one, and works through the decisions in order: each answer unlocks the next questions.

It writes no code. It produces **decisions**.

## When to use it

- At the very start, when you have an idea but haven't decided the scope yet.
- Before any big change, when you don't yet know what "done" looks like.
- Any time you catch yourself thinking "I'll figure that out later". That's a decision you haven't made yet.

## What I typed

```
/grilling i want to built a small site simple white background with royal blue
accents all over sharp layout ... one lesson per page, its for me, it teaches
matt pococks skills and how to build end to end projects using agentic coding
... plus a comment box on each lesson saved in Neon.
```

My first message was messy and long, and that's fine. Grilling's job is to turn a messy idea into clear decisions.

## What happened

**1. It started with too many questions at once.** The first round had 8 questions, which was overwhelming. I said "one or two at a time please", and it adapted.

**2. It asked about small details I didn't care about yet.** File formats, navigation, colors. I told it: *grill me on the architecture, and you decide the details using best practice.* This was the biggest lesson:

> In agentic coding, **I own the architecture and the scope. The agent owns the details.**

**3. The real decisions I made:**

| Decision | What I chose | Why |
|---|---|---|
| Lessons | 11, one per skill plus "Start here" and "Models, effort & ultracode" | Small enough to finish |
| Model/effort box on every lesson | No | Writing it down doesn't teach it. Lesson 10 does. |
| Backend | Real REST endpoints: `GET/POST /api/comments` | I want to learn APIs by seeing and `curl`ing them |
| Layers | endpoint → comments module → Drizzle → Neon | Same shape as FastAPI → crud → SQLAlchemy → Postgres |
| Databases | Neon branches: `dev` (laptop), `test` (tests), a preview branch per PR, `main` (prod) | Never touch real data while experimenting |
| Migrations | Run automatically on every Vercel build | Can't forget them, and the PR preview tests them first |
| Tests | Hit a real Neon test branch, no mocks | Passing tests should mean it actually works |
| Styling | One small plain CSS file: white, dark blue, sharp edges | Clean, nothing fancy |

**4. It also decided what's out.** No login, no editing or deleting comments, no moderation, no dark mode, no search, no custom domain. Saying "not now" is what makes v1 shippable.

**5. It ended by checking that we agreed.** Grilling isn't finished until you confirm the summary. Nothing gets built on a guess.
