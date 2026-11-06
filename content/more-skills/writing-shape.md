---
title: writing-shape: turn a pile into an article
slug: writing-shape
summary: How writing-shape turns a messy notes file into a separate, organised article, one block at a time, with you agreeing each block's form.
---

## What it's for

Say you've pasted your yoga-studio booking notes into one Markdown file (plain text with light formatting). That's your pile: all you want to say, in no order. A new contributor couldn't follow it.

**writing-shape turns a pile like that into a separate article, one agreed block at a time.** A **block** is one piece of the article: a paragraph, a list, a table, a callout (a highlighted box), a quote or a code block.

Matt Pocock, who wrote the [Skill](/learn/skills), calls this **exploit**: the pile is fixed, so you commit to a structure and fill it. You stop gathering.

```checkpoint quick-1
You start writing-shape on your booking notes. What is the session's job?
- [x] To commit to a structure, and fill it from a pile that's fixed.
- [ ] To keep adding to the pile, until it holds enough for an article.
- [ ] To try out several rough structures, and leave the choice for later.
Why: Exploit means the pile is fixed. So the job is to commit to a structure and fill it, not to grow the pile or keep your options open.
```

A session runs like this:

1. You type `/writing-shape docs/notes/booking-pile.md`. The agent reads the whole pile.
2. You settle what the reader knows. A block may lean only on **grounded** concepts: ones the reader already knows, or met in an earlier block.
3. The agent drafts 2–3 candidate openings, each with a different angle. You pick one, or mix them.
4. It asks what the reader needs to hear next, and pulls the answer from the pile.
5. It argues the block's form out loud: whether the block should be prose, a list or a table. Each choice must be deliberate and defensible.
6. Each agreed block goes into the article file at once.

```checkpoint quick-2
You've typed `/writing-shape` with your notes file. What happens before any opening is drafted?
- [x] The agent reads the whole pile, and you settle what the reader knows.
- [ ] The agent outlines every heading, and you approve the outline first.
- [ ] The agent interviews you for new fragments, and adds them to the pile.
Why: Steps 1 and 2 come first. The agent reads the whole pile, then you settle what the reader knows. Only then does it draft 2–3 openings.
```

Steps 4 to 6 repeat until you decide the article is done.

```checkpoint quick-3
You're several blocks into a session. When does it end?
- [x] When you decide the article is done.
- [ ] When the pile is used up.
- [ ] When the agent judges the article is finished.
Why: The steps repeat until you decide. The agent doesn't end the session by itself, however much of the pile is left.
```

```diagram
type: cycle
caption: "Steps 4 to 6 repeat until you decide the article is done."
steps: ["what the reader needs to hear next", "pulls the answer from the pile", "argues the block's form out loud", "goes into the article file at once"]
outside: "you decide the article is done"
```

For example, one round:

```
agent: Next, how a booking gets made. Is this prose, or should it be a list?
you:   A list. The steps are parallel.
agent: Added to docs/booking.md. What does the reader need next?
```

## When to use it

- You have notes on how class booking works, and you want a clear page for new contributors.
- You have a rough first draft, perhaps from [writing-beats](/learn/writing-beats), and it needs headings and organisation.

```checkpoint quick-4
Which situation fits writing-shape?
- [x] You have notes on class booking, and you want a clear page from them.
- [ ] You have no notes on class booking yet, and you want to start some.
- [ ] You have notes on class booking, and you want them kept exactly as they are.
Why: writing-shape needs raw material that already exists, and it turns that material into something organised, such as a clear page for new contributors.
```

## When not to use it

- If you'd rather find the path one move at a time, use [writing-beats](/learn/writing-beats) instead, because it writes one beat, then offers 2–3 next beats. writing-shape commits to one opening first.
- If there's no pile yet, use [writing-fragments](/learn/writing-fragments) instead, because mining new fragments is out of writing-shape's scope.
- If an agent is the reader, use [writing-for-agents](/learn/writing-for-agents) instead, because it's for documents agents read.

```checkpoint quick-5
You have a pile, and you want to choose each next move as you go. Which fits?
- [x] writing-beats, because it writes one beat, then offers 2–3 next beats.
- [ ] writing-shape, because it commits to one opening first, then grows it.
- [ ] writing-fragments, because it mines new fragments when there's no pile.
Why: Finding the path one move at a time is what writing-beats is for. writing-shape commits to one opening first, and writing-fragments is for when there's no pile.
```

## What it needs to start

- A Markdown file of raw material, in any format, even a transcript.
- A path to save the article. If you don't give one, it asks once.

Only you can start it, by typing its name. The agent never loads it on its own.

```checkpoint quick-6
You tell the agent you'd like to write an article. Will it load writing-shape?
- [x] No. It loads only when you type its name yourself.
- [ ] Yes. It loads by itself whenever an article comes up.
- [ ] Yes. It loads by itself once your pile file is saved.
Why: Only you can start writing-shape, by typing its name. The agent never loads it on its own, whatever you mention.
```

## What it creates

One new file: the article, such as `docs/booking.md`, written block by block. Your raw material file is never edited: it's read-only to this Skill. writing-shape publishes nothing, and adds no front matter (a settings block at the top of the file) you didn't ask for.

```checkpoint quick-7
You've finished a session on `booking-pile.md`. What has happened to that file?
- [x] Nothing. It's read-only, and the article is a separate file.
- [ ] It now holds the article, rebuilt in place block by block.
- [ ] It's been cut down to the notes the article didn't use.
Why: The raw material file is read-only to this Skill. The article goes into one new file, written block by block.
```

## Going deeper

### Why it exists

A pile of notes isn't an article. It holds what you could say, but not what the article argues, or in what order the reader needs to hear it. So writing-shape makes you settle those questions, one block at a time.

It's one of Matt's three article-writing Skills. Matt gives each a job, in this order:

- writing-fragments generates fragments of text to be shaped.
- writing-beats generates a first draft by finding a path through the fragments.
- writing-shape does the "final shaping, headings and organization".

```checkpoint quick-8
You have a rough first draft that needs headings and organisation. Which of the three Skills does that job?
- [x] writing-shape, which does the final shaping.
- [ ] writing-beats, which finds a path through the fragments.
- [ ] writing-fragments, which generates text.
Why: writing-fragments generates the text and writing-beats finds a path for a first draft. The final shaping, headings and organisation are writing-shape's job.
```

```diagram
type: chain
caption: "Matt gives each a job, in this order"
steps:
  - label: "writing-fragments"
    note: "generates fragments of text to be shaped"
  - label: "writing-beats"
    note: "generates a first draft by finding a path through the fragments"
  - label: "writing-shape"
    note: "final shaping, headings and organization"
```

writing-shape is still in progress. It sits in Matt's folder of beta Skills, which "can change or disappear without warning". His **plugin**, a bundle of [Skills](/learn/skills) you can install together, leaves them out, so you install each one directly. They also get no docs pages, so aihero.dev, Matt's site, has no page for writing-shape.

```checkpoint quick-9
You look on aihero.dev for a page on writing-shape and find nothing. Why?
- [x] It's a beta Skill, and beta Skills get no docs pages.
- [ ] It was retired, and its docs page went with it.
- [ ] It ships in the plugin, which carries its own docs.
Why: writing-shape sits in Matt's folder of beta Skills. His plugin leaves them out, and they get no docs pages.
```

### How it works underneath

**Explore, then exploit.** The three Skills rest on one split. writing-fragments explores: it widens what could be written, and leaves structure to another Skill. writing-beats and writing-shape exploit: the exploring is done and the pile is fixed.

**A quarry, not a script.** The agent mines the pile rather than copying it. It reworks a fragment to fit its paragraph, and may split it or merge it with another. Don't expect your notes back word for word.

**Grounding.** Say your reader knows yoga classes but not FastAPI. A block that leans on FastAPI, with no explanation, loses that reader. So every concept has to be grounded before a block can lean on it. A concept gets grounded in one of two ways:

- **Prerequisite:** the reader brings it, and it's fixed before the opening. Here, yoga classes.
- **Introduced:** a block establishes it, and it's grounded from then on. Here, FastAPI, once a block explains it.

```checkpoint quick-10
Your reader doesn't know FastAPI, and a block explains it. How has FastAPI been grounded?
- [x] It's introduced: a block establishes it, and it's grounded from then on.
- [ ] It's a prerequisite: the reader brings it, fixed before the opening.
- [ ] It isn't grounded: only what the reader brings counts as grounded.
Why: A prerequisite is what the reader brings, such as yoga classes here. FastAPI is introduced, because a block establishes it, and later blocks can then lean on it.
```

The agent keeps a running list of what's grounded. When the next move needs a concept that isn't on the list, it grounds that concept first.

writing-beats, the other exploit Skill, rests on grounding too. Both settle what the reader knows before writing any of the article, in a step called "Establish the prerequisites".

**The lever.** What you make a prerequisite, and what you ground inside the article, is the choice Matt calls the lever. Demand too much up front and you shut readers out. Ground too much and "the opening drowns in definitions". You settle the balance with the agent at the start.

```checkpoint quick-11
You mark almost nothing as a prerequisite. What goes wrong?
- [x] You ground too much, so the opening drowns in definitions.
- [ ] You demand too much up front, and you shut readers out.
- [ ] You lose the lever, and the agent stops arguing each block.
Why: With few prerequisites, the article has to ground nearly everything itself. Demanding too much up front is the opposite mistake, and it shuts readers out.
```

**A [grilling](/learn/grilling) session, turned around.** Matt calls the session "a grilling session inverted". While you gathered material, the question was what you were noticing. Now it's what the article argues, and in what order. So the agent pushes back. It asks what a paragraph does that the one before didn't, and what breaks if you cut it.

```checkpoint quick-12
A paragraph in your article may not earn its place. What is the agent likely to ask?
- [x] What it does that the paragraph before didn't.
- [ ] What you were noticing when you gathered it.
- [ ] Which new fragments you should collect for it.
Why: While you gathered material, the question was what you were noticing. Now it's what the article argues and in what order, so the agent pushes back on each paragraph.
```

**Arguing the form.** The agent weighs each choice out loud, not silently. Two of its tests:

- **Prose or list?** Prose carries an argument, and a list carries parallel items.
- **Table or repeated structure?** If the same shape repeats three or more times with the same fields, use a table.

```checkpoint quick-13
Your next block is a few parallel steps. Which form fits?
- [x] A list, because a list carries parallel items.
- [ ] Prose, because prose carries parallel items best.
- [ ] A table, because a few items always make a table.
Why: Prose carries an argument, and a list carries parallel items. A table needs the same shape repeated three or more times, with the same fields.
```

**Your edits stay.** You may edit the article between turns, so the agent re-reads the file from disk before every write. Matt's rule is "Never overwrite blindly."

```checkpoint quick-14
You rewrite a paragraph between turns. Why isn't your edit lost?
- [x] The agent re-reads the file from disk before every write.
- [ ] The agent keeps your edits in a separate draft file.
- [ ] The agent locks the file, so your edit waits its turn.
Why: You may edit the article between turns, so the agent re-reads the file from disk before every write, and doesn't overwrite your change.
```

**Any pile will do.** Matt lists writing-shape last, but it has never needed a first draft. Since its first version, it has taken "anything from a tidy list of fragments to a wall of unstructured prose to a transcript". So a draft from writing-beats is optional.

```checkpoint quick-15
You have a transcript and no first draft. Can you use writing-shape?
- [x] Yes. It has always taken any pile, in any format.
- [ ] No. It needs a first draft from writing-beats first.
- [ ] Only once writing-fragments has reworked the transcript.
Why: Matt lists writing-shape last, but it has never needed a first draft. Since its first version it has taken any pile, transcripts included.
```

### A real example

In August 2026, a user ran `npx skills add mattpocock/skills`. It found 29 Skills, though the repo held 35 `SKILL.md` files. Six had gone missing, and writing-shape was one of them.

The cause was one colon. The Skill's description began `Writing, exploit: shape raw…`, with no quotes around it. In YAML, the format front matter is written in, the parser reads a colon and a space there as a nested mapping: a `key: value` pair inside another. So the front matter failed to load, and the Skill was skipped. writing-beats loaded fine, because its description has a semicolon in that spot.

```checkpoint quick-16
Why did `npx skills` skip writing-shape?
- [x] An unquoted colon and a space in its description broke the YAML.
- [ ] Its folder name clashed with writing-beats, so one was dropped.
- [ ] Its description was too long for the installer to list it.
Why: The parser read the colon and space as a nested mapping, so the front matter failed to load and the Skill was skipped.
```

The same-day fix quoted the description, as it is today.

So one stray colon can remove a Skill, and it's easy to miss: another report saw only a `Skipped` line during install. That's why this report also asked for a [CI](/learn/what-ci-cd-is) guard: a check that fails the build when a Skill's front matter doesn't load.

### Where it goes wrong

**The agent stops and asks you for an example.** The pile lacks something the article needs, and mining new fragments is out of writing-shape's scope. So it names the gap: "Give me one now or we cut this section." Give it one, or cut the section.

```checkpoint quick-17
Your article needs an example, and the pile has none. What happens?
- [x] The agent names the gap, and you give it one or cut the section.
- [ ] The agent makes up a likely example, and flags it for you to check.
- [ ] The agent starts mining new fragments, and adds them to your pile.
Why: Mining new fragments is out of writing-shape's scope. So the agent names the gap, and the choice is yours.
```

**The article drifts from its opening.** The opening defines what the rest must do, and later blocks can wander from it. Bring the article back to what the opening promised, or change the opening.

**The agent says the Skill isn't installed.** Its front matter sets `disable-model-invocation: true`, so only you can start it. One user's report says Claude Code's desktop and web versions drop such Skills from the agent's list. A later comment saw the same in plain `claude`. So the agent answers "that skill isn't installed". In plain `claude`, a typed name still ran. In a terminal, start plain `claude` and type `/writing-shape` yourself.

```checkpoint quick-18
The desktop version says writing-shape isn't installed, though you installed it. What do you try?
- [x] Start plain `claude` in a terminal, and type `/writing-shape` yourself.
- [ ] Install the Skill again, since that message means a broken install.
- [ ] Wait for the agent to load the Skill by itself, once it sees a pile.
Why: Your install is fine, because that version leaves the Skill out of the agent's list, so the agent can't see it. Typing its name in plain `claude` starts it.
```

### Try it

Shape your booking notes into a page. You'll need your practice project, with its booking Spec and Tickets. If you haven't set it up, do the part "Try it: set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. In the project, install the Skill: `npx skills@latest add mattpocock/skills --skill writing-shape`. If it asks which agent, choose Claude Code. You should see it finish with no errors.
2. Create `docs/notes/booking-pile.md`, or reuse the pile from [writing-beats](/learn/writing-beats)'s Try it.
3. Paste in rough notes on a class booking: lines from the Spec, Ticket titles, and a test name if your project has one. Don't tidy them.
4. Commit the pile: `git add docs/notes/booking-pile.md && git commit -m "Add booking notes"`. You should see `1 file changed`.
5. In a terminal, start a fresh session: `claude`.
6. Type `/writing-shape docs/notes/booking-pile.md`. You should see the agent ask where to save the article.
7. Answer `docs/booking.md`.
8. When it asks what the reader knows, say they know yoga classes, but not FastAPI. You should see 2–3 openings, each with a different angle.
9. Pick one of the openings.
10. Answer the agent's question about the next block's form. You should see the agreed block appear in `docs/booking.md`.
11. Between two turns, rewrite one paragraph in `docs/booking.md` yourself. You should see your edit still there after the next block.
12. Read `docs/booking.md`. If FastAPI comes up, you should see it explained before any block leans on it.
13. Tell the agent the article is done.
14. Run `git status --short docs/notes/booking-pile.md`. You should see no output, because the pile wasn't edited.

### Read more

- [Matt Pocock on X: "improved my writing-* skills"](https://x.com/mattpocockuk/status/2070099493073158190), Matt Pocock, 2026-06-25
- [skills/in-progress/README.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock, 2026-10-29
- [writing-shape SKILL.md as first added](https://github.com/mattpocock/skills/blob/ff3ee1dda50d636b4e25b1ba269d25d6d5784164/skills/in-progress/writing-shape/SKILL.md), Matt Pocock, 2026-05-06
- [Six skills are silently unreachable through the CLI (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [Root cause for #366: Claude Code coordinator mode drops user-invoked skills (#693)](https://github.com/mattpocock/skills/issues/693), vali-mohammadi, 2026-07-29
- [CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock, 2026-10-29
- [CLAUDE.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CLAUDE.md), Matt Pocock, 2026-10-29

## Remember

```flashcards
Q: What does writing-shape create?
A: A separate article file, written block by block as each one is agreed. The raw material file is never edited.

Q: What does writing-shape need to start?
A: A Markdown file of raw material, in any format, and a path to save the article. If you give no path, it asks once.

Q: How does writing-shape differ from writing-beats?
A: writing-shape commits to one of 2–3 openings, then grows the article block by block. writing-beats writes one beat, then offers 2–3 next beats.

Q: What does writing-shape argue about for each new block?
A: Its form, out loud with you. A paragraph, a list, a table, a callout, a quote or a code block, each choice deliberate and defensible.

Q: In writing-shape, what are the two ways a concept gets grounded?
A: Prerequisite, which the reader brings and is fixed before the opening. Introduced, which a block lands, grounded from then on.

Q: What is "the lever" in writing-shape, and what goes wrong at each end?
A: What you make a prerequisite versus ground inside the article. Too much up front shuts readers out; too much inside drowns the opening in definitions.

Q: What job does writing-shape do among Matt's three Skills for writing an article?
A: "Final shaping, headings and organization", after writing-fragments and writing-beats.
```

## Final test

```final-test writing-shape-what-it-does
What does writing-shape do with your file of raw material?
- [x] Reads it as a fixed pile and builds a separate article from it, block by block.
- [ ] Rewrites that same file in place, block by block, until it reads as an article.
- [ ] Interviews you for new fragments and appends each one to that same file.
- [ ] Writes the whole article from it in one pass, then asks you to review the result.
Why: The pile is raw material to mine, so the agent only reads that file. It writes to a separate article instead, adding each block as soon as you agree it.
```

```final-test writing-shape-openings
What does writing-shape show you before the article's first paragraph is grown?
- [x] 2–3 candidate openings, each with a different angle, for you to pick or mix.
- [ ] An outline of every heading in the article, for you to approve before writing.
- [ ] 2–3 candidate next beats, for you to pick one at a time as the article goes.
- [ ] A table of every fragment in the pile, sorted by topic, for you to rank.
Why: Each opening implies a different angle, and the one you choose decides what the rest of the article must do. That choice is yours, so the agent shows you all of them and makes you pick one or mix them.
```

```final-test writing-shape-how-it-starts
How does a writing-shape session start?
- [x] You type its name yourself. The agent never loads it on its own.
- [ ] The agent loads it on its own whenever you mention writing an article.
- [ ] It runs on its own right after a writing-fragments session finishes.
- [ ] It starts on its own when you save a new Markdown file in the repo.
Why: writing-shape is user-invoked, so only you can start it, by typing its name. A setting in its front matter stops the agent loading it by itself.
```

```final-test writing-shape-deeper-shared-step
Besides writing-shape, which of Matt's writing Skills is also labelled exploit, and which step do the two share?
- [x] writing-beats. It also has an "Establish the prerequisites" step, settling what the reader already knows.
- [ ] writing-fragments. It also has an "Establish the prerequisites" step, settling the audience before any fragment.
- [ ] writing-fragments. It also treats the raw material file as read-only and never appends anything to it.
- [ ] writing-beats. It also drafts a whole outline of headings first, then fills every section in one pass.
Why: writing-beats and writing-shape are both exploit Skills, so both work from a fixed pile. Both also settle what the reader knows before writing anything, because every later part of the article may lean only on grounded concepts. writing-fragments is explore: it appends fragments to a file as they emerge.
```

```final-test writing-shape-deeper-order
Matt lists writing-shape after writing-beats. Does writing-shape need a writing-beats draft first?
- [x] No. It takes any pile of raw material, from a list of fragments to a transcript.
- [ ] Yes. It refuses to start unless the file it's given was written by writing-beats.
- [ ] Yes. It reads the writing-beats article file and the fragments file side by side.
- [ ] No. It runs writing-beats on its own first, then shapes whatever draft that writes.
Why: Matt's list shows one order, with writing-shape doing the final shaping. But the Skill only asks for a pile, in any format, and it has done since its first version. So notes or a transcript are enough, with no first draft.
```

```final-test writing-shape-transcript-to-article
You recorded a talk about how the yoga-studio site handles class bookings, and the transcript sits in one Markdown file. You want a finished article from it: commit to one angle up front, then argue the form of each paragraph as it's added. Which fits best?
- [x] Pick one of a few openings, then grow the article block by block from the pile.
  > Right: that's `/writing-shape`.
- [ ] Pick a starting beat, then choose among 2–3 next beats after each one is written.
  > That's `/writing-beats`. That finds a path one beat at a time. You want to commit to one angle first and argue each block's form.
- [ ] Get interviewed about the talk, with every new fragment added to one file.
  > That's `/writing-fragments`. That's explore, with no structure yet. The transcript already is the raw material.
Why: The transcript is your pile, and you want to commit to it. writing-shape fits because it drafts 2–3 openings with different angles, then grows the article block by block, arguing each block's form.
```

```final-test writing-shape-no-pile-yet
You want to write a post about the yoga studio's new waitlist feature. You have opinions and a few stories in your head, but nothing is written down yet, not even rough notes. Which fits best?
- [x] Get interviewed hard about the waitlist, with every fragment saved to one file.
  > Right: that's `/writing-fragments`.
- [ ] Pick one of a few openings, then grow the post block by block from your notes.
  > That's `/writing-shape`. It needs a pile to mine, and mining new fragments is out of its scope.
- [ ] Pick a starting beat, then choose among 2–3 next beats after each one is written.
  > That's `/writing-beats`. It also starts from a file of raw material, which you don't have yet.
Why: Nothing is written down, so there's no pile to commit to yet. Explore comes first: writing-fragments interviews you and collects the fragments. Committing to a structure is a later Skill's job.
```

```final-test writing-shape-path-as-you-go
You have a file of fragments about Docker on the yoga-studio project. You don't want to fix an angle yet. You'd rather write one move, then see 2–3 directions the piece could pivot to next, and choose as you go. Which fits best?
- [x] Write one beat at a time, choosing the next direction after each beat.
  > Right: that's `/writing-beats`.
- [ ] Pick one of a few openings, then grow the piece block by block from the pile.
  > That's `/writing-shape`. It asks you to commit to one opening and angle first, which you don't want yet.
- [ ] Get interviewed about Docker, with every new fragment added to one file.
  > That's `/writing-fragments`. You already have the fragments. Now you want to turn them into a piece.
Why: You want to choose as you go, without fixing an angle yet. writing-beats fits because it writes only one beat, then offers 2–3 next beats, so the piece finds its path one move at a time.
```

```final-test writing-shape-why-prerequisites
You start a session on your booking notes. Before drafting any opening, the agent asks what your readers already know when they walk in: yoga classes? FastAPI? Postgres? You'd rather skip straight to writing. Why does it ask first?
- [x] It sets which concepts start grounded, since a block may only lean on grounded ones.
- [ ] It needs the answer to choose which file the finished article gets saved to at the end.
  > The save path is a separate question, asked once if you didn't give one.
- [ ] It uses the answer to decide which fragments to delete from the raw material file first.
  > The raw material file is read-only to this Skill. It never deletes from it.
- [ ] It's a politeness step, and it would draft the very same openings whatever you said.
  > The openings and every later block may only lean on grounded concepts, so the answer changes them.
Why: A block that reaches for a concept the reader hasn't got loses them. So the agent settles first which concepts start grounded. Everything else must be grounded by a block, idea and term together, before a later block leans on it.
```

```final-test writing-shape-deeper-not-found
In August 2026 a user ran `npx skills add mattpocock/skills` and got 29 Skills, though the repo held 35 SKILL.md files. writing-shape was missing, while writing-beats, with a description of the same shape, loaded fine. Why was writing-shape skipped?
- [x] Its description held an unquoted colon, so the YAML front matter failed to load.
- [ ] In-progress Skills are left out of the plugin, so the installer skipped all of them.
  > writing-beats is in-progress too and loaded fine. Only the six with an unquoted colon were dropped.
- [ ] It was model-invoked by mistake, and the installer skips Skills that load on their own.
  > Its front matter disables model invocation. The cause was the YAML in its description.
- [ ] The folder was being renamed that week, so the installer couldn't find its SKILL.md.
  > The file was in place. The parser read the description as a nested mapping and failed to load it.
Why: The colon and space in "Writing, exploit: shape raw…" made YAML read the line as a nested mapping. So the front matter failed to load, and the Skill was skipped. writing-beats has a semicolon there, so it loaded. Quoting the description fixed it. The user's report called the failure silent, which is why it also asked for a CI guard.
```

```sources
- [writing-shape: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-shape/SKILL.md), Matt Pocock's Skills
- [writing-beats: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-beats/SKILL.md), Matt Pocock's Skills
- [writing-fragments: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-fragments/SKILL.md), Matt Pocock's Skills
- [writing-for-agents: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
- [writing-shape SKILL.md as first added (commit ff3ee1d)](https://github.com/mattpocock/skills/blob/ff3ee1dda50d636b4e25b1ba269d25d6d5784164/skills/in-progress/writing-shape/SKILL.md), Matt Pocock, 2026-05-06
- [Matt Pocock on X: improved my writing-* skills](https://x.com/mattpocockuk/status/2070099493073158190), Matt Pocock, 2026-06-25
- [skills/skills/in-progress/README.md at a496f55 · mattpocock/skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [mattpocock/skills CLAUDE.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CLAUDE.md), Matt Pocock, 2026-10-29
- [skills.sh skips to-spec and five other skills because description front matter is invalid YAML (#907)](https://github.com/mattpocock/skills/issues/907), fermumen, 2026-08-19
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [Root cause for #366: Claude Code coordinator mode drops user-invoked skills (upstream issue filed) #693](https://github.com/mattpocock/skills/issues/693), vali-mohammadi (comments by PaulSainsbury), 2026-07-29
```
