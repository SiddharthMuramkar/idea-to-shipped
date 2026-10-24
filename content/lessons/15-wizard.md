---
title: Wizard
slug: wizard
order: 15
part: 3
image: /photos/wizard.jpg
imageAlt: A man in a dark room carefully plugs a cable into a server rack.
imageCredit: ThisisEngineering
---

## What it is

Wizard is a Matt Pocock skill that writes a **step-by-step terminal script for the jobs only a human can do**: logging into dashboards, clicking through setup screens, copying passwords. The script opens each web page, tells you exactly what to click, saves what you paste, and checks each step worked before moving on.

## When to use it

- Connecting accounts and services (GitHub, Vercel, Neon, Stripe…).
- Anything with secrets you must copy from a dashboard.
- One-off setup you'd otherwise have to re-explain to an AI every time.

The rule: **if the agent can do a step itself, it should.** The wizard covers only the steps that genuinely need your hands.

## What I typed

```
/wizard
```

Then, in Cursor's own terminal:

```
bash .scratch/lesson-site/wizard-02.sh
```

## What happened

**1. The agent did most of the setup first.** I was already logged in to GitHub and Vercel on my laptop, so it created the public GitHub repo, the Vercel project, and the Neon project with a `test` branch by itself. The site went live before I'd clicked anything.

**2. It hit a guard rail.** A rule on my machine blocks pushing straight to `main`. That's good: the change went through **PR #1**, my first PR.

**3. The wizard had 4 stages for me:** connect Neon to Vercel (browser clicks), download my laptop password (automatic), paste the test password (hidden input), and merge PR #1.

**4. My first run failed, harmlessly.** I ran it inside the Claude chat with `!`, which can't press Enter, so it raced through every question. Lesson: **interactive scripts go in a real terminal.**

**5. Safety checks mattered.** The wizard refused to accept the production password where the test password belonged. Tests can never touch real data by accident.

**New words I learned:**
- **Connection string**: one line with the database's address, username and password.
- **`.env` files**: private files on my laptop that hold those strings. They never go to GitHub.
- **`vercel-dev`**: the database branch my laptop uses, created by the Neon ↔ Vercel connection.
