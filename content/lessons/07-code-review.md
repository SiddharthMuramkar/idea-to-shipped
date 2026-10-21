---
title: Code review
slug: code-review
order: 7
---

## What it is

Code review checks the finished code before it's trusted. Matt Pocock's `/code-review` skill checks two things side by side:

- **Standards**: does the code follow this repo's documented rules?
- **Spec**: does the code do what the spec and issues asked for, no more and no less?

Claude Code also has its own built-in `/code-review`, which hunts for **bugs**.

## When to use it

- Before trusting a branch or a finished feature.
- After an agent wrote a lot of code you didn't read line by line, which is normal in agentic coding.

## What I typed

```
/code-review max
```

That was the built-in bug hunt, at maximum effort, running in the background. Then Matt's version, to check the code against the spec.

## What happened

*(To be written after the review finishes.)*
