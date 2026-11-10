---
title: writing-fragments: mine raw material before any outline
slug: writing-fragments
summary: How writing-fragments interviews you about a piece you want to write, and saves the raw lines in one file before you commit to any structure.
---

## What it's for

Say you want to write a post on why your yoga-studio booking endpoint was built [test-first](/learn/test-first). You have opinions and two stories, but nowhere to start.

**writing-fragments interviews you about what you want to write, and collects the raw text in one file.**

Matt calls this kind of relentless interview a **grilling** session ([grilling](/learn/grilling) covers it).

Each piece it saves is a **fragment**: a piece of text that might survive into the final piece. Even a half-thought counts: it only has to make sense to you, not to a cold reader (one with none of your context).

```checkpoint quick-1
You jot down a half-thought that a stranger couldn't follow. Does it count as a fragment?
- [x] Yes. It only has to make sense to you, not to a cold reader.
- [ ] No. A fragment has to make sense to a cold reader first.
- [ ] Not yet. It counts once you've polished it into a paragraph.
Why: A fragment is a piece of text that might survive into the final piece. A half-thought qualifies, because only you need to follow it for now.
```

A stretch of the interview might look like this:

```
You:   /writing-fragments docs/writing/test-first-fragments.md
       Why test-first for the booking endpoint?

Agent: What did tests written afterwards miss?

You:   They only proved what the code did.

Agent: Adding that. Which story shows it best?
```

That file becomes your **pile**: the raw notes and fragments an article is made from.

The most valuable fragment to land is a **leading word**: one term a whole piece of writing can hang on, such as [_tracer bullets_](/learn/small-end-to-end-tickets). Name the right one early, and it shapes the structure, the transitions and the title later.

```checkpoint quick-2
Why is a leading word the most valuable fragment to land?
- [x] The piece can hang on it, so it shapes the structure and the title.
- [ ] It's the shortest fragment, so the file stays small and quick to read.
- [ ] It's the one fragment a cold reader can follow without any help.
Why: A leading word is one term a whole piece of writing can hang on. Name the right one early, and it shapes the structure, the transitions and the title later.
```

## When to use it

- You're at the very start of a piece for people, before you know its shape.
- You have opinions and stories, but no outline or notes yet.

```checkpoint quick-3
Which of these is the moment for writing-fragments?
- [x] You have opinions for a post, but no outline and no notes file yet.
- [ ] You have a full notes file, and you want to commit to a structure now.
- [ ] You have a finished post, and you want its headings tidied up.
Why: It fits the very start of a piece, before you know its shape. Once you're ready to commit to a structure, its job is done.
```

## When not to use it

This [Skill](/learn/skills) does only **explore**: widening what could be written, without committing to structure. An outline is out of scope here.

```checkpoint quick-4
Ten minutes in, you ask the agent for an outline. What happens?
- [x] It shouldn't write one, because structure is out of scope here.
- [ ] It writes one at the very top of the file, above the fragments.
- [ ] It stops the interview and starts a draft from an outline.
Why: This Skill does only explore, which means widening what could be written without committing to structure. An outline would be a commitment.
```

Two other Skills take over next, in **exploit** (explore's opposite): committing to one path through a fixed pile.

- A **beat** is one move in an article, such as landing a point. If your pile is ready, use [writing-beats](/learn/writing-beats) instead, because it drafts an article one beat at a time.
- If you want your pile shaped, use [writing-shape](/learn/writing-shape) instead, because it grows an article block by block.

```checkpoint quick-5
Your pile is ready, and you want to draft the article one move at a time. Which Skill fits?
- [x] writing-beats, which drafts an article one beat at a time.
- [ ] writing-shape, which drafts an article one fragment at a time.
- [ ] writing-fragments, which adds to your pile one fragment at a time.
Why: A beat is one move in an article, such as landing a point. writing-beats works in beats, while writing-shape grows an article block by block.
```

```diagram
type: compare
caption: "This Skill does only explore"
columns: ["explore", "exploit"]
rows:
  - cells: ["widening what could be written", "committing to one path through a fixed pile"]
  - cells: ["writing-fragments", "[writing-beats](/learn/writing-beats)"]
  - cells: ["", "[writing-shape](/learn/writing-shape)"]
```

If the reader is an agent, use [writing-for-agents](/learn/writing-for-agents) instead, because it has rules for documents agents read.

## What it needs to start

You need something to write about, and a path for the file. If you don't give a path, it asks once and remembers it.

Only you can start it, by typing `/writing-fragments`.

```checkpoint quick-6
You mention a post you want to write during an ordinary session. Will the agent start this Skill?
- [x] No. Only you can start it, by typing its name.
- [ ] Yes. It starts as soon as you mention some writing.
- [ ] Yes. It starts as soon as you name a path for a file.
Why: The agent never starts this Skill on its own. You start it by typing `/writing-fragments`.
```

## What it creates

One Markdown file (plain text with light formatting), which might look like this:

```markdown
# Why test-first

They only proved what the code did.

---

Tests feel like a contract? Work this out later.
```

It has a single `#` working title, then fragments split by `---` lines. There's no date, no headings, no tags and no order beyond when they were added.

```checkpoint quick-7
You open a fragments file for the first time. What do you see?
- [x] One working title, then fragments split by `---` rules.
- [ ] A title and a date, then fragments under topic headings.
- [ ] Fragments sorted by topic, with tags on each one of them.
Why: The file starts with a single `#` working title and nothing else. Fragments follow, with no headings, no tags and no order beyond when they were added.
```

Before every write, the agent re-reads the saved file, so your own edits survive. It only adds to the end of the file (it **appends**), unless you ask it to change a fragment.

```checkpoint quick-8
You reword a fragment by hand between turns. What happens at the agent's next write?
- [x] It re-reads the file, keeps your edit, then appends.
- [ ] It overwrites the file from its memory of the chat.
- [ ] It keeps its own version, and saves yours as a copy.
Why: Before every write, the agent re-reads the file from disk, so it sees your change. It never overwrites the file.
```

## Going deeper

### Why it exists

Say you start a post from an outline. You've committed to a structure before your ideas are developed. Matt Pocock wrote this Skill, and his first description of it said when to use it: when you want to "develop ideas before imposing structure".

So he splits one writing job into three steps, each with its own Skill:

- writing-fragments generates fragments of text to be shaped.
- writing-beats generates a first draft by finding a path through the fragments.
- writing-shape does the final shaping: headings and organisation.

```checkpoint quick-9
In Matt's three steps, which Skill produces the first draft?
- [x] writing-beats, by finding a path through the fragments.
- [ ] writing-fragments, by shaping each fragment as it lands.
- [ ] writing-shape, by adding headings to the raw fragments.
Why: writing-fragments generates the raw text, writing-beats turns it into a first draft, and writing-shape does the final shaping.
```

```diagram
type: chain
caption: "one writing job into three steps"
steps:
  - label: "writing-fragments"
    note: "generates fragments of text to be shaped"
  - label: "writing-beats"
    note: "generates a first draft by finding a path through the fragments"
  - label: "writing-shape"
    note: "does the final shaping: headings and organisation"
groups:
  - from: 2
    to: 3
    label: "exploit"
```

Matt keeps this Skill in his in-progress **bucket**, a folder of beta Skills. The bucket is left out of his **plugin**, a bundle of Skills you can install together, and this Skill gets no docs page. It can change or disappear without warning.

```checkpoint quick-10
You're about to build a habit around this Skill. What should you plan for?
- [x] It's beta, so it can change or disappear without warning.
- [ ] It's in Matt's plugin, so it updates along with the others.
- [ ] It's finished, so it stays as it is now for good.
Why: In progress means beta. The Skill is left out of Matt's plugin and has no docs page, and it can change or disappear without warning.
```

### How it works underneath

The idea underneath is a split between two modes of working. Think of it like choosing where to eat in a new town. First you try different places, and each one widens what you know. Then you pick the best and keep going back, and you stop looking. The first stretch is explore, and the second is exploit.

Writing splits the same way. In explore, you widen what could be written, and nothing is committed yet. In exploit, the pile is fixed, and you commit to one path through it. writing-beats starts where this Skill stops: "the exploring is done, the pile is fixed."

```checkpoint quick-11
You've stopped finding new fragments, and you want to commit to a path. Which mode is that?
- [x] Exploit, because the pile is fixed and you commit to a path.
- [ ] Explore, because you can still widen what could be written.
- [ ] Neither, because a fixed pile means the writing is all done.
Why: In explore, nothing is committed yet. Once the pile is fixed, you're in exploit, which is where writing-beats starts.
```

Matt built the split into the Skills' descriptions in June 2026, after some more writing. This Skill's description now carries the label explore, and the other two carry exploit. Before that, it began "Grilling session that mines the user for fragments", and you may still meet wording like that.

Two more ideas hold the Skill up.

**The novelist's diary.** The Skill's model is a novelist's diary: years of unstructured noticings that later get mined for raw material. So a fragment is a noticing. The bar is whether it's a piece of good writing, not whether it works as a self-contained argument.

```checkpoint quick-12
A stray line is good writing, but it fits no argument yet. Does it belong in the pile?
- [x] Yes. Good writing can wait there, to be mined later.
- [ ] No. A fragment has to work as a self-contained argument.
- [ ] No. A diary entry needs a date and a topic to count.
Why: The model is a novelist's diary. The bar is whether a fragment is a piece of good writing, not whether it works as an argument on its own.
```

**The leading word.** The Skill calls it "load-bearing": the right one shapes the structure, the transitions and the title later. Say you keep describing your tests as a promise the endpoint must keep. The agent pushes you to coin a word, and you land on _contract_. Your title and your transitions can now hang on that word.

```checkpoint quick-13
You keep describing your tests as a promise the endpoint must keep. What will the agent push you to do?
- [x] Coin one word for that idea, so the piece can hang on it.
- [ ] Drop the idea, because a repeated idea adds nothing new.
- [ ] Write out the full argument, because fragments must stand alone.
Why: When you keep circling one idea, the agent pushes you to coin a word for it. Your title and your transitions can then hang on that word.
```

[writing-for-agents](/learn/writing-for-agents) uses the same term for a concept an agent thinks with, and _tracer bullets_ is among its examples. Here the word serves a piece people will read.

While all this goes on, the saving stays out of your way. It captures fragments from your very first message, and it mentions each one only in passing, such as "adding that". A fragment can take whatever shape fits it, including lists, code or quotes. You can ask the agent to cut, rewrite or merge fragments at any time.

### Where it goes wrong

**The agent won't give you an outline.** That's the Skill working as designed, because this step only explores. Keep going until you've stopped finding new fragments. Then pass the file to [writing-beats](/learn/writing-beats).

```checkpoint quick-14
The agent keeps declining to give you an outline. What should you do?
- [x] Keep going until the fragments run out, then use writing-beats.
- [ ] Reinstall the Skill, because declining an outline is a bug.
- [ ] Add the outline to the file yourself, so the interview can end.
Why: Declining an outline is the Skill working as designed, because this step only explores. Committing to a path comes next, in writing-beats.
```

**A friend can't follow your fragments.** That's fine too. A fragment doesn't need to define its terms. The next Skill deals with that: writing-beats works by "grounding each term before a beat leans on it".

**The agent says the Skill isn't installed.** First run `npx skills list`, the skills.sh installer's list of the Skills installed in this project (add `-g` if you installed for your whole computer; [What a Skill is](/learn/skills) explains the installer): the plugin won't give you this Skill, so it may really be missing. If it's listed, the likely cause is that the agent can't see it. Only you can start this Skill, and Claude Code's docs say a Skill like that stays out of the agent's context. The agent then answers "that skill isn't installed". One report says Claude Code's desktop and web apps drop such Skills from the agent's list. The fix: use the `claude` command in a terminal, and type `/writing-fragments` yourself. A user who hit this there found that typing a hidden Skill's name still runs it.

**`npx skills` skipped the Skill.** For about three hours in August 2026, `npx skills` couldn't install writing-fragments. It reported "YAML parse error: Nested mappings are not allowed in compact mappings".

The cause was a tidy-up. Matt removed every em-dash (a long dash) from the repo's prose, so this Skill's description got a colon instead, with no quotes around it. The description sits in the **front matter**, the settings block at the top of the Skill's file, written in YAML. In YAML, an unquoted colon followed by a space breaks the value. That made the front matter invalid. So `npx skills`, the installer from skills.sh, skipped this Skill and five others.

```checkpoint quick-15
A Skill's description holds a colon and a space, with no quotes around it. What does `npx skills` do?
- [x] It can't read the front matter, so it skips that Skill.
- [ ] It adds the missing quotes for you, then installs the Skill.
- [ ] It reads the words after the colon as a second Skill's name.
Why: In YAML, an unquoted colon followed by a space breaks the value. That makes the front matter invalid, so the installer skips the Skill.
```

The fix, pull request #911, put all six descriptions in quotes, and this one is still quoted today. The issue that reported the bug, #907, also suggested a lasting fix: "Add a check that parses every `SKILL.md` front matter block". That's [fix the environment](/learn/fix-the-environment) thinking: a check would catch the next one too. So if your own Skill goes missing, look for an unquoted colon followed by a space in its description.

### Try it

Mine fragments for a short post on why the booking endpoint was built test-first. You'll need your practice project, the `yoga-studio` repo. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. In the `yoga-studio` repo, run `npx skills@latest add mattpocock/skills --skill writing-fragments`. The plugin won't give you this Skill.
2. Run `npx skills list`. You should see `writing-fragments` in the list.
3. In a terminal in that repo, start Claude Code: `claude`.
4. Type `/writing-fragments Why the booking endpoint was built test-first.` You should see it ask where to save.
5. Answer `docs/writing/test-first-fragments.md`. You should see its first question about your post.
6. Answer its questions for about fifteen minutes. You should see it mention what it adds as it goes.
7. Push for one leading word for the post.
8. Open a second terminal in the `yoga-studio` folder, and run `cat docs/writing/test-first-fragments.md`. You should see one `#` working title, then fragments split by `---` rules.
9. Edit one fragment yourself, and save the file.
10. Ask the agent to "rewrite that one sharper" about another fragment. You should see your own edit still there.

Keep the file. It's a pile you can pass to [writing-beats](/learn/writing-beats).

### Read more

- [Matt Pocock on X: improved my writing-* skills](https://x.com/mattpocockuk/status/2070099493073158190), Matt Pocock, 2026-06-25
- [Add prototype skill and related documentation for interactive design exploration (commit ff3ee1d)](https://github.com/mattpocock/skills/commit/ff3ee1dda50d636b4e25b1ba269d25d6d5784164), Matt Pocock, 2026-05-06
- [Updated writing-* skills (commit 78636f8)](https://github.com/mattpocock/skills/commit/78636f8e5c045d0d9e5731add3fdba3583e9b2af), Matt Pocock, 2026-06-25
- [In Progress: the bucket README](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock, 2026-10-29
- [Root cause for #366: Claude Code coordinator mode drops user-invoked skills (#693)](https://github.com/mattpocock/skills/issues/693), vali-mohammadi, 2026-07-29
- [skills.sh skips to-spec and five other skills because description front matter is invalid YAML (#907)](https://github.com/mattpocock/skills/issues/907), fermumen, 2026-08-19
- [Fix invalid YAML front matter in six SKILL.md files (#911)](https://github.com/mattpocock/skills/pull/911), Matt Pocock, 2026-08-19
- [mattpocock/skills CHANGELOG.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock, 2026-10-29

## Remember

```flashcards
Q: What does writing-fragments create?
A: One Markdown file. A single `#` working title, then fragments split by `---` rules, with no headings, tags or order beyond when they were added.

Q: In writing-fragments, what is a fragment?
A: Any piece of text that might survive into the final piece. You must be able to read it, but a cold reader needn't.

Q: Which fragment does writing-fragments call the most valuable to land?
A: A leading word, one term the whole piece can hang on, such as _tracer bullets_ for a whole pattern.

Q: Can the agent start writing-fragments on its own?
A: No. You start it yourself, by name.

Q: In Matt's labels since June 2026, which writing Skill is explore and which are exploit?
A: writing-fragments is explore. writing-beats and writing-shape are exploit.

Q: Why couldn't `npx skills` install writing-fragments for a few hours in August 2026?
A: An em-dash sweep left an unquoted colon in its description, so its front matter was invalid YAML and `npx skills` skipped it. #911 quoted it.

Q: What does writing-fragments name as the model for collecting fragments?
A: The novelist's diary, years of unstructured noticings later mined for raw material.
```

## Final test

```final-test writing-fragments-what-it-does
You start writing-fragments with a rough idea for a post. What does it do?
- [x] It grills you about your topic and appends fragments to one Markdown file.
- [ ] It picks a path through your notes and writes a first draft, one beat at a time.
- [ ] It reads your notes and shapes them into an article, paragraph by paragraph.
- [ ] It drafts an outline for your post, then fills in each section.
Why: This Skill only explores, so it won't draft or outline. It runs a grilling session about what you want to write. Each piece of text that might survive gets appended to one Markdown file, whether it came from you or from the agent.
```

```final-test writing-fragments-asks-for-outline
Halfway through, you ask writing-fragments for an outline. What happens?
- [x] It's out of scope: committing to a structure is a separate Skill's job.
- [ ] It adds the outline as a fragment, since any text can be a fragment.
- [ ] It writes the outline at the top of the file, under the working title.
- [ ] It stops the interview and writes the outline into a second file next to it.
Why: An outline is a commitment to a structure, and this Skill only explores: it widens what could be written. Committing is exploit, which is a separate Skill's job. So outlines are out of scope here.
```

```final-test writing-fragments-your-edits
You edited the fragments file between turns. What does writing-fragments do before it writes again?
- [x] Re-reads the file from disk, then only appends to it.
- [ ] Rewrites the whole file from its own memory of the conversation.
- [ ] Asks you to confirm each of your changes first.
- [ ] Saves a copy of your version, then writes its own next to it.
Why: You may have edited, reordered or deleted fragments, and writing from memory would wipe out those changes. So it re-reads the file from disk first, and it never overwrites the file. It only appends, unless you ask it to change a fragment.
```

```final-test writing-fragments-deeper-three-steps
In Matt's three writing steps, what is writing-fragments for?
- [x] Generating fragments of text to be shaped.
- [ ] Generating a first draft by finding a path through the fragments.
- [ ] Final shaping, headings and organisation.
- [ ] Checking a finished draft for terms the reader can't follow.
Why: The later steps need raw text to work on, so this step comes first and generates fragments of text to be shaped. writing-beats then finds a path through them to a first draft, and writing-shape does the final shaping.
```

```final-test writing-fragments-deeper-bucket
You're about to rely on Skills from Matt's in-progress bucket, like writing-fragments. What should you expect?
- [x] They're beta, left out of the plugin, and can change or disappear without warning.
- [ ] They're frozen tools he keeps around but rarely uses, so they no longer change.
- [ ] They ship in the plugin like the others, but get no docs pages until they're stable.
- [ ] They're stable and supported, but only work in Claude Code, not in other coding agents.
Why: The bucket is beta: Matt made these Skills public so people can try them and tell him what breaks. Until they graduate, they stay out of the plugin and get no docs pages. They can also change or disappear without warning, so nothing in there is promised to last.
```

```final-test writing-fragments-no-outline-yet
You want to write a blog post on why your yoga-studio booking endpoint was built test-first. You have strong opinions and two stories from the build, but no outline and no notes file yet. You want the raw material out of your head first. Which fits best?
- [x] Get grilled about the post, with each sharp line appended to one notes file.
  > Right: that's `/writing-fragments`.
- [ ] Have the agent offer starting beats from your notes, then write one at a time.
  > That's `/writing-beats`. That's exploit. It needs a markdown file of raw material to pick a path through, and you don't have one yet.
- [ ] Have the agent read your notes and shape them into the post, paragraph by paragraph.
  > That's `/writing-shape`. That's exploit too. It shapes raw material you already have, and here there's nothing on disk to shape.
- [ ] Use the reference for writing documents, as the post is a repo document.
  > That's `/writing-for-agents`. That reference is for documents an agent consumes, like a Skill or `CLAUDE.md`. The post is for people.
Why: You have no pile yet, so there's nothing to draft from or shape. A grilling session widens what could be written and appends fragments to one file, with no structure. That gives the next Skills something to work on.
```

```final-test writing-fragments-pile-is-done
After two grilling sessions, your file `docs/writing/test-first-fragments.md` holds thirty fragments under a working title, split by `---` rules. You've stopped finding new ones. You want a first draft next, picking a path through the pile. What comes next?
- [x] Pass the file to the Skill that offers starting beats and writes one beat at a time.
  > Right: that's `/writing-beats`.
- [ ] Run another fragments session on the same file to grow the pile some more.
  > That's `/writing-fragments`. Exploring is done once the pile is fixed. More mining won't give you a draft, and it refuses structure.
- [ ] Write a Skill file that tells an agent how to turn any pile of fragments into blog posts.
  > That's `/writing-for-agents`. That writes a document an agent consumes. You want a draft of a post for people, from this pile.
Why: You've stopped finding new fragments, so the exploring is done and the pile is fixed. A first draft needs a commitment now: pick a path through the pile, and mine it to fill each beat. That's exploit, not more explore.
```

```final-test writing-fragments-why-no-structure
Ten minutes into a fragments session about your booking API post, you ask for a rough outline. The agent declines and keeps asking about the stories behind your opinions. Why does the Skill hold off on structure?
- [x] It widens what could be written first. Committing to a structure is a later step.
- [ ] Outlines don't fit in the file, so the agent keeps them in its own memory.
  > Length isn't the point. Structure is out of scope because this step only explores.
- [ ] The agent can't write headings in that file, because the format bans any Markdown.
  > The file takes lists, code and quotes. It only bans headings inside the body, with no tags and no order beyond when fragments were added.
Why: An outline is a commitment, and this step exists to widen what could be written before anything is committed. Structure comes later, from a separate Skill. It's the same move as grilling before you build: the interview comes before the shape.
```

```final-test writing-fragments-why-leading-word
In a fragments session, you keep circling one idea: tests written first act like a contract for the endpoint. The agent pushes you to coin a single word for it. Why does it push for that?
- [x] One term the piece can hang on shapes its structure, transitions and title later.
- [ ] A single word is shorter, so the fragments file stays small and quick to read back later.
  > Size isn't the reason. The Skill calls a leading word load-bearing because it shapes the piece later.
- [ ] Every fragment must be one word, so a longer idea has to be cut down first.
  > Fragments are deliberately varied, from a sharp sentence to a vignette or a list.
Why: The right word does more than name an idea. Named during explore, it shapes the piece's structure, transitions and title later. That's why it's the most valuable fragment to land, and why the agent pushes when you keep circling one idea.
```

```final-test writing-fragments-deeper-yaml-check
In August 2026, an em-dash sweep left an unquoted colon in six Skills' descriptions, and `npx skills` skipped all six. Issue #907 suggested quoting them, and also adding a check that parses every SKILL.md front matter block. Why add the check too?
- [x] Quoting fixes these six. A check catches the next unquoted colon before it ships.
- [ ] Quoting alone can't make the six descriptions valid YAML, so only a parser check will fix them.
  > Quoting did fix them. The changelog records the six descriptions quoted, and all six parse today.
- [ ] A check rewrites each description without colons, so no one quotes by hand.
  > The suggested check parses front matter with the installer's parser. It reports a broken block; it rewrites nothing.
Why: An unquoted colon is a mechanical mistake, so a machine can spot it every time. Fixing the six files only fixes this time. A check that parses every front matter block fixes the environment, so the next one is caught too.
```

```sources
- [writing-fragments: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-fragments/SKILL.md), Matt Pocock's Skills
- [writing-beats: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-beats/SKILL.md), Matt Pocock's Skills
- [writing-shape: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/writing-shape/SKILL.md), Matt Pocock's Skills
- [writing-for-agents: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
- [Matt Pocock on X: improved my writing-* skills](https://x.com/mattpocockuk/status/2070099493073158190), Matt Pocock, 2026-06-25
- [skills/skills/in-progress/README.md at a496f55 · mattpocock/skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/in-progress/README.md), Matt Pocock
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [Add prototype skill and related documentation for interactive design exploration (commit ff3ee1d)](https://github.com/mattpocock/skills/commit/ff3ee1dda50d636b4e25b1ba269d25d6d5784164), Matt Pocock, 2026-05-06
- [Updated writing-* skills (commit 78636f8)](https://github.com/mattpocock/skills/commit/78636f8e5c045d0d9e5731add3fdba3583e9b2af), Matt Pocock, 2026-06-25
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [skills.sh skips to-spec and five other skills because description front matter is invalid YAML (#907)](https://github.com/mattpocock/skills/issues/907), fermumen, 2026-08-19
- [Remove all em-dashes from the repo](https://github.com/mattpocock/skills/pull/905), mattpocock, 2026-08-19
- [Fix invalid YAML front matter in six SKILL.md files](https://github.com/mattpocock/skills/pull/911), mattpocock, 2026-08-19
- [Root cause for #366: Claude Code coordinator mode drops user-invoked skills (upstream issue filed) #693](https://github.com/mattpocock/skills/issues/693), vali-mohammadi (comments by PaulSainsbury), 2026-07-29
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
```
