---
title: Full lesson
slug: full
order: 1
part: 2
---

```goals
- Start a session with `/grilling`.
- Read a ==round==.
- Answer fast.
```

Intro text.

## Chat

```scene chat
title: One grilling round
# You start with a **messy** idea.
you: /grilling a small course site
# The agent asks the whole frontier.
agent: Q1 Who is it for? Just *you*.
agent: Q2 Where do comments live?

# "Yes" accepts its recommendation.
you: yes, yes
```

Most bad output starts with an ==unmade decision==.

```checkpoint who-owns-details
The agent asks which CSS layout you want. Best reply?
- [ ] Research it yourself.
  > That spends your attention on a detail.
- [x] "You decide."
  > Right: you own the scope.
- [ ] Start coding.
  > Skipping a decision doesn't remove it.
```

## Terminal

```scene terminal
# Run the tests.
$ npm test
FAIL  src/lessons/lessons.test.ts
  1 failed
# Fix it and run them again.
$ npm test
PASS
```

```callout big-idea
You own the **architecture**.
```

```callout tip
A tip.
```

```callout watch-out
Careful.
```

## Flow

```scene flow
title: The main flow
node: grill | Grill the idea
node: spec | Spec + tickets | side
node: build | Implement
# Start by grilling.
at: grill
# Split it if it's big.
at: spec
# Then build.
at: build
```

```try
Run `npm test` and watch it fail.
```

## Files

```scene files
# The parser lands.
+ src/lessons/blocks.ts
~ src/lessons/lessons.ts
# Tests follow.
+ src/lessons/course.test.ts
```

````site-story
My first message:
```
/grilling a small site
```
Round one had 8 questions.
````

## Meter

```scene meter
title: Context window
zone: 40
# A fresh session.
fill: 5% | System prompt
# After a long grilling.
fill: 38% | Grilling transcript
fill: 62% | Spec and code
```

```sources
- [Video](https://example.com/v), Matt Pocock
- [Docs](https://example.com/d)
```

## Final test

```test scenario-frontier
What is the frontier?
- [x] The questions it can ask now.
  > Yes.
- [ ] Every question it will ever ask.
  > No: later ones wait on your answers.
- [ ] The last question.
  > No.
```

```test spot-the-gap
Which step is missing?
- [ ] Grill
  > It's there.
- [ ] Build
  > It's there.
- [x] Review
  > Yes.
```
