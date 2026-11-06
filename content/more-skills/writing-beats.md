---
title: writing-beats
slug: writing-beats
summary: writing-beats turns your pile into a first draft one beat at a time, and you pick each next move.
---

## What it's for

Say you have notes on how your yoga-studio site takes bookings, and you want a post for studio owners. You could ask an agent for a whole draft, but then the agent makes each choice, not you.

**writing-beats turns your [pile](/learn/writing-fragments) into a first draft one beat at a time, and you pick each next move.** A **beat** is one move in an article: it sets a scene, lands a point, asks a question, drops an aside or twists the angle. Then it stops.

```checkpoint quick-1
The agent offers you something to write next. Which of these counts as one beat?
- [x] One move, such as asking a question, and then it stops.
- [ ] A whole section, with several moves and its own subheadings.
- [ ] An outline that lists every move the article will make.
Why: A beat is one move: it sets a scene, lands a point, asks a question, drops an aside or twists the angle. Then it stops.
```

Matt calls this exploit: the exploring is done and the pile is fixed, so the agent commits to one path.

```checkpoint quick-2
You're about to run writing-beats. What should already be true of your pile?
- [x] The exploring is done, so the pile is fixed and the agent commits to a path.
- [ ] It's still growing, so the agent keeps mining you for fragments as it drafts.
- [ ] It's already in article order, so the agent only has to copy it across.
Why: Matt calls this exploit. The exploring is done and the pile is fixed, so the agent commits to one path through it.
```

Say you type:

```
/writing-beats docs/notes/booking-pile.md
```

Before any beats, you settle what the reader already knows walking in: say, classes but not APIs. Then the agent offers 2–3 starting beats from your pile, shortened here:

```
A. A scene: two members want the last place.
B. A point: a booking is a promise.
C. A question: what if a class is full?
```

You pick one. The agent writes only that beat to the article file, and stops. It re-reads the file. It offers 2–3 next beats, and you pick again. That loop repeats until the article's journey is complete.

```checkpoint quick-3
You pick a starting beat, then open the article file. What's in it?
- [x] Only that beat, because the agent writes it and then stops.
- [ ] A full draft that opens with that beat and runs to the end.
- [ ] All 2–3 starting beats, with a note beside the one you picked.
Why: The agent writes only the beat you picked, and stops. Then it re-reads the file and offers 2–3 next beats.
```

```diagram
type: cycle
caption: "That loop repeats until the article's journey is complete."
steps: ["You pick one", "The agent writes only that beat", "It re-reads the file", "It offers 2–3 next beats"]
outside: "you settle what the reader already knows"
```

## When to use it

- You have notes or fragments, and you want a first draft that reads as a journey.
- You want to choose each next move yourself, from 2–3 directions.

```checkpoint quick-4
Which situation fits writing-beats?
- [x] You have notes, and you want to steer a first draft one move at a time.
- [ ] You have no notes yet, and you want help working out what you think.
- [ ] You have a finished article, and you want it checked line by line.
Why: It starts from your notes or fragments, and it suits you when you want to choose each next move yourself.
```

## When not to use it

- If you want to argue each block's form, use [writing-shape](/learn/writing-shape) instead, because it argues that at every step. A block might be a list, a table or a **callout**, a highlighted box of text that stands out.
- If you have no pile yet, use [writing-fragments](/learn/writing-fragments) instead, because it mines one from you.
- If the reader is an agent, use [writing-for-agents](/learn/writing-for-agents) instead, because it's built for documents agents read.

```checkpoint quick-5
You have a pile, and you want to debate whether each block should be a list or a table. Which Skill fits?
- [x] writing-shape, because it argues the form of each block.
- [ ] writing-fragments, because it mines more raw text from you.
- [ ] writing-for-agents, because it's built for documents agents read.
Why: Arguing the form of each block as the article grows is writing-shape's job. writing-fragments is for when you have no pile, and writing-for-agents is for when the reader is an agent.
```

## What it needs to start

- A Markdown file of raw material: your pile.
- A path for the article. If you give none, the agent asks once.
- The Skill. It isn't in Matt's **plugin**, a bundle of Skills you can install together. Install it with `npx skills@latest add mattpocock/skills --skill writing-beats`.

```checkpoint quick-6
You've installed Matt's plugin, but /writing-beats isn't there. Why not?
- [x] It isn't in the plugin, so it needs its own npx install.
- [ ] It's in the plugin, but it only runs once you've made a pile.
- [ ] It's in the plugin, but the agent has to start it the first time.
Why: writing-beats isn't in Matt's plugin, so you install it on its own with npx.
```

Only you can start it, by typing `/writing-beats`. The agent never starts it on its own.

## What it creates

One article file, written one beat at a time. Before every write the agent re-reads the file, and it keeps your edits. A big edit can change what it offers next.

```checkpoint quick-7
You reword a line in the article file between beats. What happens to your change?
- [x] It stays, because the agent re-reads the file before every write.
- [ ] It's overwritten, because the agent writes from its own saved copy.
- [ ] It moves to the pile, where a later beat might use it instead.
Why: Before every write the agent re-reads the article file from disk, and it keeps your edits.
```

A "beat" that needs five paragraphs and three subheadings is two beats glued together, so split it.

The article ends when the journey is complete, not when the pile is empty. So some of your pile probably won't make it in.

```checkpoint quick-8
The article feels finished, but some of your notes never got used. What now?
- [x] Stop, because the article ends when the journey is complete.
- [ ] Keep going, because every note in the pile must appear somewhere.
- [ ] Delete the unused notes, because the pile must end up empty.
Why: The article ends when the journey is complete, not when the pile is empty. It's expected that some of your pile won't make it in.
```

## Going deeper

### Why it exists

A pile has no structure, but a reader needs one. Matt's theory is "based on how authors keep journals of ideas that eventually work their way into stories."

So he split writing into three steps. You dictate fragments (ideas), then write beats (a path through the story), then do a final shaping pass, so the result doesn't sound AI-generated.

```diagram
type: chain
caption: "So he split writing into three steps."
steps:
  - "fragments (ideas)"
  - "beats (a path through the story)"
  - "a final shaping pass"
```

writing-beats is the middle step. Its job is to generate a first draft by finding a path through the fragments.

In practice the steps are looser. [writing-shape](/learn/writing-shape) starts from the raw pile too, so the two Skills are two ways to exploit the same pile. writing-beats offers different directions to go next. writing-shape argues about the form of the next block.

```checkpoint quick-9
You have a pile. Must you run writing-beats before writing-shape?
- [x] No. Both start from the pile, and differ in how they grow the article.
- [ ] Yes. writing-shape can only start from a first draft that's written.
- [ ] Yes. writing-shape is the explore step, so it only gathers new ideas.
Why: writing-shape starts from the raw pile too. writing-beats offers different directions to go next, and writing-shape argues about the form of the next block.
```

Matt keeps writing-beats in his **in-progress** bucket, the folder for his beta Skills. They're left out of the plugin and get no docs pages, and they can change or disappear without warning.

### How it works underneath

The idea underneath is **grounding**. It answers one question: does the reader already have what this beat leans on?

Say a beat in your post for studio owners reads: "So the member who tapped first can still lose the last place." There's no jargon in it. But it leans on an idea: the site saves bookings one at a time. A reader without that idea is lost.

A concept is **grounded** when the reader either walked in knowing it or met it in an earlier beat. That gives two ways in:

```checkpoint quick-10
No beat has landed an idea, and your reader didn't walk in knowing it. Is it grounded?
- [x] No. Those are the only two ways an idea gets grounded.
- [ ] Yes, as soon as the word for it appears in bold in a beat.
- [ ] Yes, as long as the pile holds at least one fragment about it.
Why: A concept is grounded when the reader either walked in knowing it or met it in an earlier beat. Neither has happened here.
```

- **Prerequisite**: the reader brings it, and it's fixed before the first beat.
- **Introduced**: a beat lands it, and every later beat can lean on it.

So each beat does two jobs. It **requires** concepts that are already grounded, and it **grounds** new ones. The agent keeps a running list of what's grounded. It offers a beat only when everything the beat requires is on that list.

```checkpoint quick-11
A tempting beat requires a concept that isn't on the agent's list. What happens?
- [x] The agent doesn't offer that beat until the concept is grounded.
- [ ] The agent offers it anyway, then adds the concept to the list.
- [ ] The agent offers it, as long as the beat grounds a new concept.
Why: The agent keeps a running list of what's grounded, and offers a beat only when everything the beat requires is on that list.
```

For example, an offer might look like this:

```
Grounded so far: a class and its limit, how a member books one.

A. The site saves bookings one at a time.
   Grounds: the first to arrive wins.
   Unlocks: the member who tapped first can lose the last place.
B. A full class can keep a waitlist.
   Grounds: what a waitlist is.
   Unlocks: what a member sees when a class is full.
```

Pick A, and the beat that was waiting on that idea can now be offered. That's the choose-your-own-adventure part: your pick decides which paths open.

The unit is the concept, not the word. A beat can lose the reader with no jargon in sight, and bolding a word doesn't ground the idea. When a concept has a name, grounding it means landing the idea and the word together.

```checkpoint quick-12
Your next beat uses no jargon at all. Can it still lose the reader?
- [x] Yes, because it can lean on an idea the reader doesn't have.
- [ ] No, because only words the reader doesn't know can lose them.
- [ ] No, because plain words count as grounded from the very start.
Why: The unit is the concept, not the word. A beat can lose the reader with no jargon in sight.
```

**How it changed.** Matt added grounding in a June 2026 rewrite: the first step, settling what the reader already knows, and the limit on which beats get offered. It also made the Skill user-invoked, with one line in its front matter: `disable-model-invocation: true`. An older copy has none of this.

### A real example

In August 2026, a user ran `npx skills add mattpocock/skills`. It found 29 Skills, though the repo held 35. Six had gone missing, writing-shape and writing-fragments among them.

Each of the six had an unquoted colon and a space in its `description:` line. YAML doesn't read that as plain text, so the front matter failed to load and the Skill was skipped. writing-beats opens the same way as writing-shape, with a semicolon for the colon, and it loaded fine:

```checkpoint quick-13
Why did writing-beats load fine when writing-shape, with similar wording, was skipped?
- [x] Its description had a semicolon where writing-shape's had an unquoted colon.
- [ ] Its description had quotes around it, and writing-shape's had none at all.
- [ ] Its description was shorter, so it fitted within YAML's line limit.
Why: An unquoted colon and a space stops YAML reading a description as plain text. writing-beats had a semicolon there, so its front matter loaded.
```

```
description: Writing, exploit; assemble raw material…   # loaded fine
description: Writing, exploit: shape raw…               # skipped
```

Matt quoted the six descriptions that same day. So one punctuation mark decided whether a Skill could be installed, and the only warning another user saw was a `Skipped` line.

### Where it goes wrong

**The agent says writing-beats isn't installed.** You installed it, yet the agent says "that skill isn't installed" and may suggest a similar one. A July 2026 report traced this to Claude Code's **coordinator mode**, which runs on its desktop and web apps. In that mode, every Skill with `disable-model-invocation: true` is dropped from the agent's list, and writing-beats has that line.

```checkpoint quick-14
On Claude Code's desktop app, the agent says writing-beats isn't installed, but you installed it. What's most likely?
- [x] Coordinator mode dropped it from the agent's list because of its setting.
- [ ] Coordinator mode deleted its files because of the setting in its front matter.
- [ ] The desktop app reads only the Skills from Matt's plugin, never npx installs.
Why: In coordinator mode, every Skill with disable-model-invocation: true is dropped from the agent's list. So the agent can't see it, and says it isn't installed.
```

So work in a terminal: run the plain `claude` CLI and type `/writing-beats` yourself. Claude Code's docs say that line hides a Skill from the agent there too, as one user saw, but typing its name still runs it.

On desktop and web, typing the name may not help. The workaround is to delete the `disable-model-invocation: true` line from your local copy. The Skill shows up at once, and the agent can then start it too. But "any skill update re-copying from source will undo" that.

The lasting fix "belongs in the harness", meaning Claude Code, not the Skill. These reports cover versions 2.1.220 to 2.1.247, so newer ones may differ.

**A beat leaves the reader lost.** The beat leans on a concept nothing has grounded, which the Skill calls "the one move the journey can't make". Add a grounding beat before it, or make the concept a prerequisite.

```checkpoint quick-15
A beat leans on a concept nothing has grounded. What are your two fixes?
- [x] Add a grounding beat before it, or make the concept a prerequisite.
- [ ] Put the concept's name in bold, or define it in a glossary at the end.
- [ ] Cut every later beat from the article, or start with a new pile.
Why: Either an earlier beat lands the concept, or the reader brings it as a prerequisite. Both put it on the grounded list before the beat needs it.
```

**Readers get shut out, or the opening is all definitions.** The prerequisite list is set wrong. Ask for too much up front, and you shut out readers who don't have it. Ground too much inside, and the early beats fill up with definitions. Settle the list at the start, and revisit it when a tempting beat needs a concept nothing has grounded yet.

```checkpoint quick-16
You make nearly every concept a prerequisite. What's the risk?
- [x] You shut out readers who don't already have those concepts.
- [ ] The early beats fill up with definitions of those concepts.
- [ ] The agent runs out of beats it can offer you from the pile.
Why: Asking for too much up front shuts out readers who don't have it. The early beats filling up with definitions is the opposite mistake, grounding too much inside.
```

**One beat keeps growing.** Several paragraphs are fine when the beat is one self-contained scene, argument or example. If it makes more than one move, split it.

**The steps changed after you reinstalled.** writing-beats is a beta Skill outside the plugin, so its steps can change between installs, as they did in June 2026. Read its `SKILL.md` again after you update it.

### Try it

Draft the first beats of a post on bookings for studio owners. You'll need your practice project, the `yoga-studio` repo. If you haven't set it up, do [keeping-track](/learn/issues-and-keeping-track)'s Try it step first.

1. In the `yoga-studio` repo, install the Skill: `npx skills@latest add mattpocock/skills --skill writing-beats`.
2. Make a pile: paste your booking Spec, notes and any fragments into `docs/notes/booking-pile.md`.
3. In a terminal, start the plain CLI: `claude`.
4. Type `/writing-beats docs/notes/booking-pile.md`. You should see it ask where to save the article.
5. Answer `docs/booking-post.md`.
6. Tell it the reader runs a yoga studio and knows nothing about FastAPI. You should see 2–3 starting beats.
7. Read what each one says it grounds, then pick one.
8. Open `docs/booking-post.md`. You should see only that beat.
9. Reword one sentence of the beat, and save the file.
10. Pick one of the next beats it offers.
11. Open the file again. You should see your reworded sentence, with the new beat below it.

### Read more

- [Skills Changelog: /handoff, /prototype, /review and /writing](https://www.aihero.dev/skills/skills-changelog-handoff-prototype-review-and-writing), Matt Pocock, 2026-05-11
- [Matt Pocock on X: improved my writing-* skills](https://x.com/mattpocockuk/status/2070099493073158190), Matt Pocock, 2026-06-25
- [Updated writing-* skills (commit 78636f8)](https://github.com/mattpocock/skills/commit/78636f8e5c045d0d9e5731add3fdba3583e9b2af), Matt Pocock, 2026-06-25
- [skills/in-progress/README.md at the pin commit](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock, 2026-10-29
- [Root cause for #366: Claude Code coordinator mode drops user-invoked skills (#693)](https://github.com/mattpocock/skills/issues/693), vali-mohammadi, 2026-07-29
- [Six skills are silently unreachable through the CLI (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint writing-beats-deeper-not-installed
In Claude Code you ask the agent to start Matt's beat-by-beat writing Skill on your booking notes. It replies that the Skill isn't installed and suggests a similar writing Skill instead. You installed it yesterday. What's most likely going on? What's the reason behind this step?
- [x] Skills marked user-invoked can be dropped from the agent's list, so it can't see this one at all.
- [ ] Its description has an unquoted colon that breaks the YAML, so the installer skipped it entirely.
  > That bug hit writing-shape and writing-fragments. writing-beats uses a semicolon, and a report noted it loads fine.
- [ ] Matt removed it from his in-progress bucket overnight, so your install now points at nothing.
  > It's still listed in Matt's in-progress bucket. Beta Skills can change, but nothing shows it was removed.
- [ ] The agent needs your raw material file open in the editor before it's allowed to list the Skill.
  > Nothing ties the Skill's visibility to an open file. The flag on the Skill is what hides it.
Why: Claude Code's docs say `disable-model-invocation: true` hides a Skill from the agent, so it can't see the Skill and says it isn't installed. A July 2026 report saw this in coordinator mode. writing-beats has that setting. The lasting fix belongs in Claude Code, not the Skill. In one user's test the CLI still ran a hidden Skill typed by name. On desktop and web, you can delete that line locally, but a Skill update undoes it.
```

## Remember

```flashcards
Q: In writing-beats, what is a beat?
A: One move in an article. It does one thing (sets a scene, lands a point, asks a question, drops an aside, twists the angle), then stops.

Q: What does writing-beats create?
A: One article file, written one beat at a time. It re-reads the file before every write and keeps your edits.

Q: When does a writing-beats article end?
A: When the journey is complete, not when the pile is empty. Leftover fragments are expected.

Q: In writing-beats, a "beat" needs five paragraphs and three subheadings. What do you do with it?
A: Split it. It's not a beat. It's two beats glued together.

Q: In writing-beats, what are the two ways a concept gets grounded?
A: As a prerequisite, which the reader brings before the first beat, or introduced by a beat, after which every later beat can lean on it.

Q: What did Matt's June 2026 rewrite of writing-beats add?
A: Grounding: settling what the reader already knows, and only offering beats whose concepts are grounded. It also made the Skill user-invoked.

Q: Which of Matt's buckets is writing-beats in, and what does that mean?
A: In-progress, his beta bucket. It's left out of the plugin, gets no docs page, and can change or disappear without warning.
```

## Final test

```final-test writing-beats-one-beat
You picked a starting beat. What does writing-beats do next?
- [x] Writes only that beat to the article file, then stops.
- [ ] Writes the whole first draft, then asks you which beats to cut.
- [ ] Writes an outline of every beat, then fills each one in turn.
- [ ] Rewrites your raw material file so its order matches the beat.
Why: It writes only the beat you chose and stops, so you stay in charge of the path. Then it re-reads the article file and offers 2–3 next beats.
```

```final-test writing-beats-first-step
Before any beats, what does writing-beats settle with you?
- [x] What the reader already knows walking in.
- [ ] The article's headings, in order, from top to bottom.
- [ ] How many words the finished article should run to.
- [ ] Which parts of the raw material must be cut first.
Why: A beat can only lean on what the reader already has. So the agent first settles what readers know walking in, and anything else needs a beat to land it before a later beat can use it.
```

```final-test writing-beats-how-started
How does writing-beats start?
- [x] You type /writing-beats, since the agent never starts it on its own.
- [ ] The agent starts it on its own whenever you mention an article.
- [ ] It runs after every writing-fragments session, without asking you.
- [ ] A CI job starts it when a Markdown file is added to the repo.
Why: Only you can start it, by typing its name. A setting in its Skill file stops the agent starting it by itself, however much you talk about articles.
```

```final-test writing-beats-deeper-grounded
In writing-beats, when is a concept grounded?
- [x] When the reader walked in knowing it, or met it in an earlier beat.
- [ ] When its term is in bold the first time any beat uses it.
- [ ] When the raw material file has at least one fragment about it.
- [ ] When the agent has defined it in a glossary at the article's end.
Why: The reader brought it, or an earlier beat landed it. Those are the only two ways. Bolding a term doesn't ground it, because what counts is the idea, not the word.
```

```final-test writing-beats-deeper-trio
In Matt's three-step split of writing, where does writing-beats sit?
- [x] In the middle, finding a path through the fragments to a draft.
- [ ] First, mining you for fragments before any structure exists.
- [ ] Last, doing the final shaping, headings and organisation.
- [ ] Outside the three, as the reference for writing agent documents.
Why: Matt lists fragments, then beats ("generate a first draft by finding a path through the fragments"), then shape. In practice the line is looser, because writing-shape can start from the raw pile too.
```

```final-test writing-beats-pile-no-draft
Your yoga-studio repo has a Markdown file full of notes on how a class gets booked. There's no draft yet. You want a first draft of a post for studio owners, built one move at a time, with a few different directions to choose from after every move. Which fits best?
- [x] Assemble the pile into a journey, beat by beat, choosing each next one.
  > Right: that's `/writing-beats`.
- [ ] Shape the pile into an article block by block, arguing each block's format.
  > That's `/writing-shape`. It also starts from the pile, but after the opening it argues each block's form, instead of offering 2–3 directions to pick from after every move.
- [ ] Run a grilling session that mines you for more fragments of writing.
  > That's `/writing-fragments`. The exploring is done. You already have the pile and now want to commit to a path through it.
- [ ] Use the reference for writing documents that an agent will read.
  > That's `/writing-for-agents`. Your readers are studio owners, not agents. That reference is for Skills and files like CLAUDE.md.
Why: The pile is ready, so the exploring is done and it's time to commit to a path. You want a say after every move, and the beat-by-beat Skill gives you that. It offers 2–3 next beats after each one lands, each a different direction.
```

```final-test writing-beats-after-fragments
You finished a long session where the agent interviewed you about the booking site and appended raw fragments to notes/booking.md. No structure yet. Next you want a draft that grows as a journey, where after each move the agent offers a few directions and you choose one. What comes next? What comes next?
- [x] Pick a starting beat from the fragments, then grow the draft beat by beat.
  > Right: that's `/writing-beats`.
- [ ] Pick one opening angle, then argue headings, lists and tables block by block.
  > That's `/writing-shape`. It can start from the same pile, but after the opening it argues each block's form, instead of offering 2–3 directions to pick from after every move.
- [ ] Run another fragments session and keep mining before anything gets drafted.
  > That's `/writing-fragments`. That's still explore. The fragments are in, and the next step commits to a path through them.
Why: The fragments are in, so the next step commits to a path through them. Both exploit Skills can start from that pile. You asked for a choice of directions after each move, and only the beat-by-beat one offers that.
```

```final-test writing-beats-why-one-beat
The agent writes the opening beat of your post about class bookings and then stops. It re-reads the article file and offers three next beats, instead of drafting the rest. Why work this way? What's the reason behind this step?
- [x] Each next beat should respond to where the article now stands, your edits included.
- [ ] The agent's context window can only hold one beat of the article at a time.
  > Nothing in the Skill is about window size. It re-reads the whole file so that the next offers fit the article as it now stands.
- [ ] The raw material file can only be read once per beat, so it must stop to reload.
  > The Skill re-reads the article file, not the pile, and it does so to keep your edits.
- [ ] It's waiting for CI to check each beat before the next one is written.
  > No CI is involved. It stops so you can pick, and edit, before the journey pivots.
Why: It adds one beat at a time and never writes ahead, because each pick changes where the article can go. It re-reads the file before every write, so your edits stay and a big edit can change what comes next. Like a grilling round, it waits for your choice.
```

```final-test writing-beats-why-prerequisites
Before writing a single beat of your post about class bookings, the agent asks you what studio owners already know walking in. You want it to start writing now. Why does it ask first? What's the reason behind this step?
- [x] Every later beat may only lean on concepts the reader already has, so that list comes first.
- [ ] It needs that list to pick a word count and a reading level before it drafts the whole post.
  > The list isn't about length or level. It fixes what the reader already has before the first beat.
- [ ] It's checking that you've read the raw material yourself before it starts mining the pile.
  > The question is about the audience, not about you. It settles what readers bring with them.
- [ ] The list becomes the article's glossary, printed at the top of the post before the first beat.
  > Nothing is printed. The list is a running record the agent keeps of what the reader has so far.
Why: A beat can only lean on what the reader already has. So the agent starts by settling that list, and anything else needs an earlier beat to land it. One agreed set of words works the same way: settled early, it stops jargon arriving later.
```

```final-test writing-beats-deeper-ungrounded-beat
Your post for studio owners has grounded what a class is and how booking works. A tempting next beat explains waitlist promotion, which leans on class capacity, a concept no beat has landed yet. The agent says it can't offer that beat yet. Why not? What's the reason behind this step?
- [x] A beat that leans on an ungrounded concept loses the reader, so capacity must be grounded first.
- [ ] The beat runs too long, and every beat must fit in one short paragraph, so it has to be split.
  > A beat can be several paragraphs if it's one self-contained scene. Length isn't what blocks this one.
- [ ] Waitlists aren't in the raw material file, so the agent has nothing to mine for that beat at all.
  > The beat is in the pile. What's missing is a concept the reader needs first.
- [ ] The word "capacity" never appeared, so the agent must first add it in bold to an earlier beat.
  > The unit is the concept, not the word. Bolding a term doesn't land the idea.
Why: A reader can't follow a beat that leans on an idea they don't have. So the agent offers a beat only when everything it requires is grounded. The fix is an earlier beat about capacity, or making capacity a prerequisite.
```

```sources
- [writing-beats: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-beats/SKILL.md), Matt Pocock's Skills
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [writing-shape: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-shape/SKILL.md), Matt Pocock's Skills
- [writing-fragments: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-fragments/SKILL.md), Matt Pocock's Skills
- [writing-for-agents: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
- [skills/skills/in-progress/README.md at a496f55 · mattpocock/skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [Skills Changelog: /handoff, /prototype, /review and /writing](https://www.aihero.dev/skills/skills-changelog-handoff-prototype-review-and-writing), Matt Pocock, 2026-05-11
- [Matt Pocock on X: improved my writing-* skills](https://x.com/mattpocockuk/status/2070099493073158190), Matt Pocock, 2026-06-25
- [Updated writing-* skills (commit 78636f8)](https://github.com/mattpocock/skills/commit/78636f8e5c045d0d9e5731add3fdba3583e9b2af), Matt Pocock, 2026-06-25
- [Fix invalid YAML front matter in six SKILL.md files](https://github.com/mattpocock/skills/pull/911), mattpocock, 2026-08-19
- [skills.sh skips to-spec and five other skills because description front matter is invalid YAML (#907)](https://github.com/mattpocock/skills/issues/907), fermumen, 2026-08-19
- [Root cause for #366: Claude Code coordinator mode drops user-invoked skills (upstream issue filed) #693](https://github.com/mattpocock/skills/issues/693), vali-mohammadi (comments by PaulSainsbury), 2026-07-29
```
