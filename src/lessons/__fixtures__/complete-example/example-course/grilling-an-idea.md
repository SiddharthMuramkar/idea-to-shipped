---
title: Grilling an idea
slug: grilling-an-idea
summary: How to start a grilling session, steer its rounds of questions, and move on to a spec while the plan is fresh.
image: /images/lessons/grilling-an-idea.jpg
imageAlt: A woman in glasses takes notes while questioning a man across an office desk.
---

```goals
- Start a grilling session with `/grilling` and a messy idea.
- Read a round: numbered questions, each with a recommended answer.
- Steer it: you decide scope and architecture, the agent decides details.
- Know when it's done, and move on to a spec without a `/clear`.
```

Most bad agent output starts with an ==unmade decision==. You asked for "a small site", the agent guessed the rest, and now you're arguing with code instead of with a plan.

This Lesson teaches the Skill that fixes that. If you haven't met Skills yet, start with [Start here](/learn/start-here).

## Why it matters

Write the problem this Skill solves as a short story the reader recognises.

```scene chat
title: One grilling round
# You start with a messy idea. That's fine.
you: /grilling a small course site, royal blue, comments saved in Neon
# The agent asks a **round** of questions, each with a recommended answer.
agent: **Q1** Who is it for? *Recommended:* just you, as a learning journal.
agent: **Q2** Where do comments live? *Recommended:* Neon, behind a REST endpoint.
# "Yes" accepts the recommendations, and your answers unlock the next round.
you: yes, yes
agent: **Q3** One database branch per environment? *Recommended:* yes.
```

```callout tip
Answer in shorthand. "Yes", "yes, but no accounts" and "you decide" are all fine.
```

```checkpoint yes-accepts
In a grilling round, replying "yes" to a question accepts its recommended answer.
- [x] True
- [ ] False
Why: Each question comes with a recommended answer, and "yes" accepts it. Your answers then unlock the next round.
```

## The idea in plain words

Explain how the Skill works, defining each new term in **bold** the first time it appears.

```scene flow
title: Where grilling sits in the Main flow
node: idea | Messy idea
node: grill | Grill it
node: small | Small job? Build it now | side
node: spec | Write the spec
node: build | Implement
# Everything starts with an idea you haven't fully decided.
at: idea
# Grilling turns it into decisions.
at: grill
# A small job can go straight to building.
at: small
# A bigger one gets a spec first, and then gets built.
at: spec
at: build
```

```checkpoint who-owns-details
The agent asks which CSS file layout you want. You don't care.
What's the best reply?
- [ ] Research CSS layouts yourself first, since every decision is yours.
  > That spends your attention on a detail. Save it for scope and architecture.
- [x] "You decide, using best practice."
  > Right. You own the scope and the architecture; the agent owns the details.
- [ ] Stop grilling and start coding.
  > Skipping a decision doesn't remove it. The agent just guesses later.
```

## What you'll see in the terminal

Walk through starting the Skill for real.

```scene terminal
title: Starting a session
# Open Claude Code in your project's folder.
$ cd my-course-site
$ claude
Claude Code is ready. Type a message or a slash command.
# Then type the Skill's name and your idea as one message.
$ /grilling a small course site with comments
Q1 Who is the site for? Recommended: just you, as a learning journal.
```

## What it leaves in your repo

Show what the reader will find in their project afterwards.

```scene files
title: What the Main flow leaves in your repo
# Grilling writes no code. With `/grill-with-docs` it records the words you agreed on.
+ GLOSSARY.md
+ docs/adr/0001-rest-endpoints.md
# Writing the spec adds one file you can review.
+ .scratch/course-site/spec.md
# Later decisions change what's already there.
~ GLOSSARY.md
```

```checkpoint what-grilling-produces
What does a grilling session produce?
- [ ] A first draft of the code.
  > Grilling writes no code. It produces decisions.
- [x] Decisions you and the agent agree on.
  > Yes. The code comes later, built from those decisions.
- [ ] A list of bugs to fix.
  > That's what a review finds, once there's code to review.
```

## Watch the context window

Explain why this Skill fits inside one session.

```scene meter
title: Context window
zone: 40
# A fresh session starts nearly empty.
fill: 5% | Fresh session
# A long grilling fills it, but you're still in the Smart zone.
fill: 30% | After grilling
# Writing the spec straight away keeps you there.
fill: 38% | After the spec
# Building everything in the same session pushes past the line.
fill: 72% | After implementing
```

```callout watch-out
Don't `/clear` between grilling and the spec. The spec needs the grilling's reasoning in full, not a summary of it.
```

```checkpoint when-to-clear
You've just finished grilling and the plan is agreed. What do you type next?
- [ ] `/clear`, so the spec starts from a clean context.
- [x] `/to-spec`, in the same session.
- [ ] `/compact`, to make room before the spec.
- [ ] `/tdd`, to write the first failing test.
- [ ] `/code-review`, to check the plan.
- [ ] `/grill-with-docs`, to grill the idea again.
Why: The grilling is the spec's best source, so write the spec in the same session, before anything clears it or turns it into a summary.
```

```callout remember
Grilling and the spec share one session: don't `/clear` or `/compact` between them.
```

## Try it yourself

````try
Pick a small idea you've been putting off. Start Claude Code and type:

```
/grilling <your idea, as messy as you like>
```

It's working if every question comes with a recommended answer, and "yes" is a valid reply.
````

## Common mistakes

List the 3–5 mistakes beginners really make, each with the fix.

```callout big-idea
You own the **scope and the architecture**. The agent owns the **details**.
```

```diagram
type: compare
caption: "You own the scope and the architecture. The agent owns the details."
columns: ["You", "The agent"]
rows:
  - label: "decide"
    cells: ["the scope and the architecture", "the details"]
```

## How I used it building this site

````site-story
My first message was long and messy:

```
/grilling i want to built a small site simple white background with royal blue accents ...
```

Round one had 8 questions at once. I said "one or two at a time, please", and it adapted.
````

## Remember

```flashcards
Q: What does each question in a grilling round come with?
A: A recommended answer, which "yes" accepts.

Q: Who owns the scope and the architecture, and who owns the details?
A: You own the scope and the architecture; the agent owns the **details**.

Q: Grilling is done for a feature too big for one session. What comes next?
A: `/to-spec`, in the same session.
```

## Final test

```final-test scenario-new-feature
You want to add accounts to a site that has none. What do you start with?
- [x] `/grilling`, to decide what accounts are for before any code.
  > Yes. A change this big has decisions to make before code.
- [ ] `/tdd`, to write the first failing test.
  > Tests come after you know what you're building.
- [ ] `/code-review` on the current code.
  > A review checks code that exists. There's nothing to review yet.
```

```final-test spot-skipped-decision
Spot the mistake. Agent: "Q1 Who signs in? Recommended: anyone with an email."
You: "skip that, just build it". The agent starts writing code.
- [ ] The agent should have asked more questions first.
  > It asked the right one. The trouble is what happened next.
- [x] You skipped a decision, so the agent will guess it.
  > Right. Skipping a question doesn't remove the decision; it hands it to the agent.
- [ ] Nothing. Skipping slow questions saves time.
  > It saves a minute now and costs a rewrite later.
```

```final-test sequence-main-flow
Which order is right for a feature too big for one session?
- [ ] Spec, grill, implement, review.
- [x] Grill, spec, implement, review.
- [ ] Grill, implement, spec, review.
- [ ] Implement, grill, spec, review.
Why: Decisions come first, then the spec that records them, then the code built from the spec, then a review of that code.
```

```final-test who-decides-accounts
Mid-grilling, the agent asks whether the site needs accounts at all. Who should answer?
- [x] You, because accounts change the scope of the site.
- [ ] The agent, because it knows the best practice for accounts.
- [ ] Nobody yet, because the code will show whether accounts are needed.
Why: Accounts change what the site is, and you own the scope and the architecture. The agent owns the details, such as how the sign-in form is laid out.
```

```final-test round-reply
A round asks three questions, and you like every recommended answer. What's the quickest good reply?
- [ ] Rewrite each recommended answer in your own words.
- [x] "yes, yes, yes"
- [ ] Nothing: skip the round and let the agent carry on.
Why: "Yes" accepts a question's recommended answer, so shorthand is enough. Skipping a round leaves its decisions to the agent's guesses.
```

```sources
- [mattpocock/skills](https://github.com/mattpocock/skills), the `grilling` Skill, v1.3.1 (read 2026-10-23)
- [I stopped using /grill-me for coding](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock (2026-05-14)
- [Things people get wrong with /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), AI Hero
```
