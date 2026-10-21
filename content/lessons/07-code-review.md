---
title: Code review
slug: code-review
order: 7
---

## What it is

Code review checks finished code before you trust it. Matt Pocock's `/code-review` skill runs **two separate reviewers in parallel**:

- **Standards**: does the code follow this repo's own rules (glossary, decision records, framework docs) and avoid common code smells?
- **Spec**: does the code do exactly what the spec and issues asked, with nothing missing and nothing extra?

They're kept apart on purpose. Code can follow every rule and still build the wrong thing, or build the right thing while breaking the rules. One combined score would hide one problem behind the other.

## When to use it

- Before trusting a finished feature or branch.
- Especially in agentic coding, where an agent wrote code you didn't read line by line.
- Give it a **starting point** to review from: a commit, a branch, or `main`.

## What I typed

```
/mattpocock-skills:code-review
```

Starting point: `4f849b9`, the first commit, so it reviewed everything.

## What happened

**Standards: 0 hard violations, 7 judgement calls.** The code followed all 4 decision records and used Next.js correctly. The judgement calls were things like:
- the comment length limits written in two places (change one, forget the other)
- the endpoint checking input itself, when the issue said endpoints only speak HTTP
- small naming drift (`order` vs `number` vs "position")

**Spec: 1 real bug, plus small gaps.**
- 🔴 **Sending a number instead of text crashed the API** (`500`) instead of giving a clean `400`. I confirmed it on the live site. My 19 tests never tried a *number* as a comment.
- The home page said "LESSON 1 / Grilling" instead of the spec's "Lesson 1 — Grilling".
- Some harmless extras nobody asked for (dates on comments, "Loading…").

**What I fixed (one last PR):**
1. The crash, **test-first**: a red test showed `.trim is not a function`. Then all input checks moved into the comments module, and the test went green.
2. The length limits now live in one shared file.
3. The home page wording.
4. The decision-record wording, so it matches what the code does.

**What I left alone, on purpose:** renames, emoji counting as 2 characters, and a repeated error line. They're polish, not problems.

**The lesson:** passing tests isn't the same as correct. The review found a bug no test had thought to try. Two separate reviewers also found *different* kinds of problems, which is why they're kept apart.
