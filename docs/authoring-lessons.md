# Writing a Lesson

This guide is for anyone writing a Lesson for Idea to Shipped, including agents. It's the **authoring contract, v1.1**: the exact rules the Lessons module (`src/lessons/`) follows when it reads a Lesson file, plus the course lint that holds every Lesson to the same bar.

You don't need to know React, Next.js or the database to write a Lesson. You need Markdown, this guide, and one command: `npm run test:content`.

> **Why this file isn't in `content/lessons/`:** every `.md` file in that folder is read as a Lesson, so a guide there would break the build.

Use the words in [`GLOSSARY.md`](../GLOSSARY.md) exactly: Lesson, Part, Skill, Scene, Checkpoint, Final test, Site story, Visitor. In anything a Visitor reads, write "Final test" in full, never just "Test" or "quiz".

## The short version

1. Copy the [complete example](#a-complete-example) at the bottom into `content/lessons/NN-<slug>.md`.
2. Fill in the header.
3. Write the body: goals, then Sections with Scenes, Checkpoints and callouts, then the Final test and sources.
4. Run `npm run test:content` and fix whatever it reports.
5. Run `npm run dev`, open `http://localhost:3000/learn/<slug>`, and scroll through it.

## 1. The file

- **Where:** `content/lessons/`.
- **Name:** `NN-<slug>.md`, where `NN` is the Lesson's `order` padded to two digits and `<slug>` is its slug. For example, `04-grilling.md` has `order: 4` and `slug: grilling`.
- **Format:** UTF-8 text with plain `\n` line endings.

## 2. The header

Every Lesson starts with a header between two `---` lines. Each line is `key: value`.

```markdown
---
title: Grilling
slug: grilling
order: 4
part: 2
image: /photos/grilling.jpg
imageAlt: A woman in glasses takes notes while questioning a man across an office desk.
imageCredit: Vitaly Gariev
---
```

| Key | Required | What it is |
|---|---|---|
| `title` | yes | The Lesson's title, shown big at the top of the page and on its card. |
| `slug` | yes | The Lesson's permanent id, used in its URL (`/learn/grilling`). Lowercase words joined by `-`. **Never change it once published** (see below). |
| `order` | yes | Its position in the course, a whole number. Must match the filename's `NN`. |
| `part` | yes for new Lessons | Which Part it belongs to: `1` Foundations, `2` The main flow, `3` When things go wrong, `4` Level up. Parts never go backwards as `order` goes up. |
| `image` | yes | The Lesson's photo, as a path under `public/` (e.g. `/photos/grilling.jpg`). The file must exist. |
| `imageAlt` | yes | One sentence describing the photo for screen readers. |
| `imageCredit` | yes | The photographer's name, shown as "Photo: <name> / Unsplash". |

**Rules:**

- **Any other key is an error.** A typo like `tilte:` fails the build instead of being silently ignored.
- **No two Lessons may share a `slug` or an `order`.** The error names both files.
- **The page title and position come from the header, not the filename.**
- **Never change a published slug.** Comments and Answers point at a Lesson by its slug, so renaming it cuts the Lesson off from them ([ADR 0004](adr/0004-comments-reference-lessons-by-permanent-slug.md)). A Lesson's title, `order` and `part` can change freely.

The reading time ("12 min") is worked out for you, at about 220 words a minute.

## 3. The body

After the header comes ordinary Markdown: paragraphs, lists, tables, links, **bold**, `inline code` and code blocks.

**Sections:**

- A `## ` heading starts a Section. Sections give the page its structure: each gets its own stage beside the text on wide screens, its own dot in the section bar, and its own anchor link, made from the heading text.
- **Everything before the first `## ` is the intro.** Put the `goals` block and a short opening there.
- **Don't use a `# ` heading in the body.** The title is the page's only top heading, so a `# ` heading is an error.
- Use `### ` for smaller headings inside a Section.

**Highlights:** wrap a key phrase in double equals signs, `==like this==`, and it becomes a highlighted phrase that sweeps in as the reader reaches it. The `==` must touch the words on the inside, so `a == b` and `===` stay plain text. Use one or two per Section at most.

**Links between Lessons:**

- Link by title, with the Lesson's URL: `[Grilling](/learn/grilling)`. Every `/learn/<slug>` link must point at a Lesson that exists.
- **Never refer to a Lesson by its number** ("Lesson 3", "see Lesson 10"). Numbers change when Lessons are reordered, so any "Lesson" followed by a number is an error.

**Skill and command names:** write them in backticks with their slash, like `/grilling` or `/clear`. Every backticked single-word slash name must be a real Skill or Built-in command. The full list is under [The course lint](#6-the-course-lint). This catches renamed Skills such as `/to-prd`, which is `/to-spec` now. Paths like `/learn/grilling` or `/api/comments` aren't checked by this rule.

## 4. Typed blocks

Special parts of a Lesson (goals, Scenes, questions, callouts and so on) are written as **fenced code blocks whose first word names the kind**. The parser turns each one into its own part of the page.

````markdown
```checkpoint who-owns-details
…
```
````

| Block | First line | What it makes | Where |
|---|---|---|---|
| goals | ` ```goals ` | The "By the end of this Lesson you can" card | Intro only |
| scene | ` ```scene chat ` (or `terminal`, `flow`, `files`, `meter`) | A Scene that builds step by step as the reader scrolls | At most one per Section |
| checkpoint | ` ```checkpoint <id> ` | One question with instant feedback. Never counts towards passing | Anywhere in a Section |
| test | ` ```test <id> ` | One Final test question. All of them together form the Final test | One unbroken run |
| callout | ` ```callout tip ` (or `watch-out`, `big-idea`) | A highlighted box | Anywhere |
| try | ` ```try ` | A "Your turn" exercise, with copy buttons on its code | Anywhere |
| site-story | ` ```site-story ` | The "How I used it building this site" box | Anywhere, usually near the end |
| sources | ` ```sources ` | Where the facts come from | Usually last |

**Rules for every block:**

- **The kind comes first,** then its argument if it has one, separated by a space.
- **Ordinary code blocks stay code.** A fence with no first word, or with a real language (` ```ts `, ` ```bash `, ` ```text `), is shown as code, exactly as today.
- **A near-miss is an error.** If the first word is close to a kind but not quite (`checkpiont`, `scnee`, `tset`), the build fails with "did you mean …?". These languages are exempt even though some look close: `ts`, `tsx`, `js`, `jsx`, `json`, `sh`, `bash`, `zsh`, `shell`, `text`, `txt`, `sql`, `diff`, `css`, `html`, `md`, `markdown`, `yaml`, `yml`, `env`, `ini`, `toml`, `mjs`, `cjs`, `py`, `python`, `console`. If a real language gets flagged, use a bare fence instead.
- **Nesting code:** if a block contains a code block of its own (common in `try` and `site-story`), open and close the outer block with **four** backticks, and keep the inner one at three:

`````markdown
````try
Type this:

```
/grilling a small course site
```
````
`````

### goals

````markdown
```goals
- Start a grilling session with `/grilling` and a messy idea.
- Read a round: numbered questions, each with a recommended answer.
- Steer it: you decide scope and architecture, the agent decides details.
- Know when it's done, and move on without a `/clear`.
```
````

- A Markdown list of **3–4 items**. Each item is inline Markdown, so `code` and **bold** work.
- Write each goal as something the reader will be able to *do*, starting with a verb ("Start…", "Spot…", "Choose…").
- **It must come before the first `## ` heading.** A goals block anywhere else is an error.
- When a Visitor passes the Final test, each goal gets ticked off.

### scene

A Scene is a small picture on the stage beside the text (or pinned above it on a phone) that builds up as the reader scrolls past its captions. Every kind is written the same way:

1. **Settings first** (optional, one per line): `title: …` for every kind, plus a few kind-specific ones.
2. **Then steps.** A line starting with `# ` starts a step, and the rest of that line is its **caption**: the sentence the reader sees in the text column. Captions are inline Markdown, so **bold** works.
3. **Under each caption, the items that step adds** to the picture, in the kind's own grammar.

**Rules:**

- **Blank lines are ignored.** Use them freely for readability.
- **Write a `title`.** It's optional, but the stage shows it as the Scene's heading, so it's worth having.
- **These are errors:**
  - an unknown setting
  - an item line that doesn't fit the kind's grammar
  - an item before the first `# ` caption
  - a Scene with no steps at all
  - a second Scene in the same Section
- **Keep it short.** Aim for 3–6 steps, and say in each caption what just changed.

#### chat

What you'd type, and what the agent says back.

| Line | Meaning |
|---|---|
| `you: …` | A message from you (inline Markdown) |
| `agent: …` | A message from the agent (inline Markdown) |

````markdown
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
````

On the page, your messages sit on the right in blue and the agent's on the left. Each one slides in when its step arrives.

#### terminal

Commands and what they print.

| Line | Meaning |
|---|---|
| `$ command` | A command, typed out on screen |
| any other non-empty line | Output |

Terminal text is plain text, not Markdown: what you write is exactly what shows.

````markdown
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
````

On the page, each command types itself out after a `$` prompt, and its output fades in once the typing ends.

#### flow

A map of steps, with the reader's position lit up.

| Line | Kind | Meaning |
|---|---|---|
| `node: <id> \| <label>` | setting | A step on the main path. `<id>` is a short name like `spec`; `<label>` is what shows. |
| `node: <id> \| <label> \| side` | setting | A side step (a fork), drawn to the right of the node declared just before it. |
| `at: <id>` | item | The reader is now at this node. It must be a declared node. |

````markdown
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
````

Main nodes stack top to bottom in the order you declare them. The current node (the last `at:` so far) fills blue, earlier ones get a tick, and the lines between them draw in.

#### files

Which files a step adds or changes.

| Line | Meaning |
|---|---|
| `+ path` | A file was added |
| `~ path` | A file was changed |

````markdown
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
````

Added files get a green "added" badge and changed files an amber "changed" badge. A `~` line for a file that's already shown updates that row instead of adding a second one.

#### meter

A gauge that fills up, usually the context window.

| Line | Kind | Meaning |
|---|---|---|
| `zone: <0-100>` | setting | Where the Smart zone ends, as a percentage. Optional. |
| `fill: <0-100>% \| <label>` | item | Fill the gauge to this percentage, with this label underneath. |

````markdown
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
````

Past the `zone`, the fill turns amber and a "Dumb zone" tag appears. (The numbers in this example are made up for illustration; don't teach them as facts.)

### checkpoint and test: questions

Checkpoints and Final test questions use the same grammar. **Each fence holds exactly one question.**

````markdown
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
````

**The grammar, in order:**

1. **The prompt:** one or more lines of inline Markdown, joined with a space. It can't be empty.
2. **3 or 4 options,** each starting `- [ ] ` (wrong) or `- [x] ` (right). **Exactly one** is `[x]`.
3. **Feedback under every option:** one or more lines starting with `> ` (indenting them is fine and reads better). Say *why* that option is right or wrong. Readers see the feedback for whatever they picked, so a wrong option's feedback is where most of the teaching happens.

**These are errors:**

- no `[x]`, or more than one
- fewer than 3 or more than 4 options
- an option with no `> ` feedback under it
- an empty prompt

**Question ids:**

- The id goes after the kind: `checkpoint who-owns-details`.
- Lowercase letters and digits, words joined by single dashes (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`), at most 40 characters.
- Unique within the Lesson. Checkpoints and Final test questions share one set of ids.
- **Option ids are positions:** the first option is `a`, then `b`, `c`, `d`.

**Question ids are permanent, like slugs** ([ADR 0005](adr/0005-answers-reference-questions-by-permanent-id.md)). Every Answer a Visitor gives is stored against (slug, question id, option position). Once a Lesson is published:

- **You may** reword a question's prompt, its options and its feedback.
- **Never** rename or reuse a question id, and never reorder, add or remove its options. That would mix up everyone's Answers and the crowd stats.
- **To change what a question asks, or which options it offers,** delete it and write a new one with a **new id**.
- **Fixing a wrong answer key** (moving the `[x]`) only affects Answers given from then on. Old Answers keep the grade they got.

**Writing good questions:**

- Test whether the reader can *use* the idea in a new situation, not whether they remember a sentence.
- Make every wrong option tempting, something a beginner might really believe.
- Avoid "all of the above", trick wording, and a right answer that gives itself away by being the longest.
- Spread the `[x]` across positions over the Lesson.

#### Checkpoints

- Put one straight after the idea it checks.
- A Lesson needs **3–5**.
- They never count towards passing, so readers can guess freely.

#### The Final test

- **Every `test` fence in a Lesson together forms its Final test.** They must sit in one unbroken run, with only blank lines between them. Anything else between two `test` fences (a paragraph, a heading, another block) is an error.
- **Put them under their own `## Final test` heading,** near the end.
- **A Visitor passes with 80% or more.** Their latest Attempt counts.
- **Size:** `start-here` has 5–6 questions, `main-flow` 8–15, and every other Lesson 8–10.
- **The mix,** by id prefix (every Lesson except `start-here`):
  - at least 3 `scenario-…`: "you're in this situation; what do you do / which Skill do you reach for?"
  - at least 2 `spot-…`: "here's a short transcript or plan; spot the mistake"
  - at least 1 `sequence-…`: "which order is right?", with the orderings as options
  - The rest can be anything that reads well, e.g. `why-…` or `predict-…`.

### callout

````markdown
```callout big-idea
You own the **scope and the architecture**. The agent owns the **details**.
```
````

- The argument is one of `tip`, `watch-out` or `big-idea`. Anything else is an error.
- The body is ordinary Markdown.
- On the page:
  - `tip` is a blue box labelled "Tip".
  - `watch-out` is an amber box labelled "Watch out".
  - `big-idea` is a large navy card labelled "Big idea".
- Keep callouts short, and use `big-idea` at most once or twice per Lesson.

### try

`````markdown
````try
Pick a small idea you've been putting off. Start Claude Code and type:

```
/grilling <your idea, as messy as you like>
```

It's working if every question comes with a recommended answer.
````
`````

- The body is ordinary Markdown, shown as a "Your turn" box.
- Every code block inside gets a Copy button.
- Give an exact thing to type, and say what "it's working" looks like.

### site-story

`````markdown
````site-story
My first message was long and messy:

```
/grilling i want to built a small site simple white background with royal blue accents ...
```

Round one had 8 questions at once. I said "one or two at a time, please", and it adapted.
````
`````

- The body is ordinary Markdown, shown in a box headed "How I used it building this site".
- It holds the author's real experience, kept apart from the teaching. **Never invent one.** If the Skill wasn't used on this site yet, say so and say where you'd use it.
- The 12 original Lessons must each have one: `start-here`, `grilling`, `domain-modeling`, `spec-and-issues`, `wizard`, `prototype`, `tdd`, `code-review`, `pr-and-ship`, `diagnosing-bugs`, `models-effort-ultracode` and `main-flow`. It's optional for new Lessons.

### sources

````markdown
```sources
- [mattpocock/skills](https://github.com/mattpocock/skills), the `grilling` Skill, v1.3.1 (read 2026-10-23)
- [I stopped using /grill-me for coding](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock (2026-05-14)
- [Things people get wrong with /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), AI Hero
```
````

- The body is a Markdown list.
- **It needs at least 3 items, and each item must contain a link.**
- Add the date you read it, especially for anything that changes, like Skill versions and Claude Code docs.

## 5. When something's wrong

The Lessons module checks every Lesson when you run `npm run test:content`, `npm run dev` or `npm run build`. **A broken Lesson fails the build**, so it can't reach the live site.

Error messages always name the file, the block kind and the id when there is one:

```text
grilling.md: checkpoint "who-owns-details": needs exactly one [x] option
```

Find the block, fix it, and run the command again.

## 6. The course lint

`src/lessons/course.test.ts` holds every Lesson to the course's quality bar. Run it with:

```bash
npm run test:content
```

It needs no database and no `.env` file, so it runs anywhere, in a fresh clone, a worktree or an agent's sandbox. (`npm test` runs it too, along with the database tests.)

**Checked on every Lesson:**

| Rule |
|---|
| Every file parses (all the rules in sections 2–4). |
| No two Lessons share a slug or an `order`. |
| The filename's `NN` equals `order`. |
| The 12 original slugs still exist (they're permanent). |
| The header's `image` exists under `public/`. |
| Once every Lesson has a `part`, `part` never goes down as `order` goes up. |

**Checked on rewritten Lessons only.** These rules skip any slug listed in `PENDING_REWRITE` at the top of `course.test.ts`. That list starts with all 12 original Lessons, and each slug is removed as its rewrite lands. When it's empty, every Lesson meets the full bar.

| Rule | Limit |
|---|---|
| `part` | present, 1–4 |
| `goals` | one block, 3–4 items |
| Scenes | at least 1 |
| Checkpoints | 3–5 |
| Final test size | `start-here` 5–6, `main-flow` 8–15, every other Lesson 8–10 |
| Final test mix (not `start-here`) | at least 3 `scenario-`, 2 `spot-` and 1 `sequence-` ids |
| `site-story` | required for the 12 original slugs, optional for new ones |
| `sources` | at least 3 list items, each with a link |
| Word count | 1,800–3,000 (`start-here`: 900–1,400) |
| "Lesson" + number | never in the body |
| `/learn/<slug>` links | every one points at an existing Lesson |
| Backticked `/names` | every one is a known Skill or Built-in command |

**What counts as a word:** the plain words of the prose, plus the bodies of `callout`, `try` and `site-story` blocks. Headings, code blocks, and the goals, Scenes, questions and sources don't count. The range keeps a Lesson deep enough to teach and short enough to finish in one sitting (about 8–14 minutes).

**Known slash names.** A backticked `/name` must be one of these.

The Skills (mattpocock-skills 1.3.1):

`/ask-matt` `/grill-with-docs` `/implement` `/implement-spec` `/improve-codebase-architecture` `/retro` `/setup-matt-pocock-skills` `/to-spec` `/to-tickets` `/triage` `/wayfinder` `/code-review` `/codebase-design` `/diagnosing-bugs` `/domain-modeling` `/pr` `/prototype` `/research` `/tdd` `/wizard` `/grill-me` `/handoff` `/teach` `/to-questionnaire` `/wait-what` `/grilling` `/writing-for-agents` `/git-guardrails-claude-code` `/setup-pre-commit` `/migrate-to-shoehorn` `/scaffold-exercises`

The Built-in commands:

`/clear` `/compact` `/context` `/model` `/effort` `/fast` `/rewind` `/init` `/help` `/config` `/permissions` `/plan` `/resume` `/agents` `/mcp` `/hooks` `/memory` `/cost` `/usage` `/status` `/doctor` `/login` `/logout` `/plugin` `/skills` `/ultrareview` `/review` `/add-dir` `/exit` `/export` `/terminal-setup` `/vim`

If you need a name that isn't here, check it's real first, then add it to the list in `course.test.ts` and to this guide in the same change.

## A complete example

This skeleton uses every block kind and every Scene kind. Copy it into `content/lessons/NN-<slug>.md` and replace the content. The notes after it explain each part.

It parses as it stands. It would still fail the course lint until you grow it into a real Lesson: it has 3 Final test questions instead of 8–10, and far fewer than 1,800 words.

``````markdown
---
title: Grilling an idea
slug: grilling-an-idea
order: 20
part: 4
image: /photos/grilling.jpg
imageAlt: A woman in glasses takes notes while questioning a man across an office desk.
imageCredit: Vitaly Gariev
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
You've just finished grilling and the plan is agreed. What next?
- [ ] `/clear`, so the spec starts from a clean context.
  > Clearing throws away the reasoning the spec needs.
- [x] Run `/to-spec` in the same session.
  > Right. The grilling is the spec's best source, so stay where it is.
- [ ] `/compact` first, to make room.
  > That turns the grilling into a lossy summary right when you need it in full.
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

## How I used it building this site

````site-story
My first message was long and messy:

```
/grilling i want to built a small site simple white background with royal blue accents ...
```

Round one had 8 questions at once. I said "one or two at a time, please", and it adapted.
````

## Final test

```test scenario-new-feature
You want to add accounts to a site that has none. What do you start with?
- [x] `/grilling`, to decide what accounts are for before any code.
  > Yes. A change this big has decisions to make before code.
- [ ] `/tdd`, to write the first failing test.
  > Tests come after you know what you're building.
- [ ] `/code-review` on the current code.
  > A review checks code that exists. There's nothing to review yet.
```

```test spot-skipped-decision
Spot the mistake. Agent: "Q1 Who signs in? Recommended: anyone with an email."
You: "skip that, just build it". The agent starts writing code.
- [ ] The agent should have asked more questions first.
  > It asked the right one. The trouble is what happened next.
- [x] You skipped a decision, so the agent will guess it.
  > Right. Skipping a question doesn't remove the decision; it hands it to the agent.
- [ ] Nothing. Skipping slow questions saves time.
  > It saves a minute now and costs a rewrite later.
```

```test sequence-main-flow
Which order is right for a feature too big for one session?
- [ ] Spec, grill, implement, review.
  > You can't write a spec before you've made the decisions in it.
- [x] Grill, spec, implement, review.
  > Yes. Decisions first, then the spec, then code, then a review.
- [ ] Grill, implement, spec, review.
  > The spec is what the implementation follows, so it comes first.
- [ ] Implement, grill, spec, review.
  > Grilling after the code means arguing with code instead of with a plan.
```

## Sources

```sources
- [mattpocock/skills](https://github.com/mattpocock/skills), the `grilling` Skill, v1.3.1 (read 2026-10-23)
- [I stopped using /grill-me for coding](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock (2026-05-14)
- [Things people get wrong with /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), AI Hero
```
``````

**Notes on the example:**

- **Header.** `order: 20` and `part: 4` are placeholders. Use the next free `order`, name the file to match (`20-grilling-an-idea.md`), and pick the Part the Lesson really belongs to. The slug must be new, and it's permanent from the moment it's published.
- **Intro.** The `goals` block and the opening paragraphs sit before the first `## `. The `==unmade decision==` highlight sweeps in as the reader reaches it, and the link uses `/learn/<slug>`, never a Lesson number.
- **One Scene per Section.** This example has five Sections with one Scene each, one of every kind. A real Lesson usually has 1–3 Scenes, and many Sections have none. A Section without a Scene shows its big number on the stage instead.
- **Checkpoints** sit right after the idea they check. This example has 3, the minimum.
- **Callouts:** one `tip`, one `watch-out` and one `big-idea`.
- **`try` and `site-story`** each contain a code block, so they open and close with four backticks.
- **The Final test** is three `test` fences in an unbroken run under their own heading, one each of `scenario-`, `spot-` and `sequence-`. A real Lesson needs 8–10, with at least 3 `scenario-`, 2 `spot-` and 1 `sequence-`.
- **Sources** come last, three linked items, each with a date.
- **The page adds the rest itself:** after the Final test come the Discussion band (Comments) and the Previous/Next cards. You don't write those.
