---
title: wait-what: re-pitch a message that lost you
slug: wait-what
summary: How to make the agent say its last message again, with the context you missed, in plain words and your project's own terms.
---

## What it's for

Say you're building [Ticket](/learn/issues-and-keeping-track) #13 of a yoga-studio booking site: the endpoint (the web address your app calls) that creates a booking. The agent reports that it "lifted the session factory behind a seam and inverted the dependency". That message didn't land: you read it, and you can't tell where the work has got to.

**wait-what tells the agent its message didn't land, so the agent re-pitches it: it says the same thing again, in a way you can follow.**

```checkpoint quick-1
You type `/wait-what` after a message that lost you. What does the agent do?
- [x] It says the same thing again, in a way you can follow.
- [ ] It drops that point and moves on to its next step.
- [ ] It asks you to rewrite your last request in plainer words.
Why: A re-pitch keeps the point and changes how it's said, so you can follow it.
```

For example, that exchange might go on like this:

```
You:   /wait-what

Agent: You asked for the endpoint that creates a Booking.
       It needs a database session: what it uses to talk
       to the database. It used to open its own session.
       Now it gets one passed in, so a test can pass in
       its own. That test is my next step.
```

The [Skill](/learn/skills)'s body, the instructions the agent loads, is one short message, as if you'd typed it. It opens: "Wait, I don't understand where you've got to here." Then it asks for three things:

- a little of the context you were missing;
- plain English, in a form called **ASD-STE100**: a controlled plain English with fixed rules and an approved dictionary;
- your project's own words, from its [glossary](/learn/one-shared-language), `GLOSSARY.md`. If the repo has more than one glossary, `GLOSSARY-MAP.md` points to the right one.

```checkpoint quick-2
Your repo has two glossaries, and you type `/wait-what`. How does the agent find the right words?
- [x] `GLOSSARY-MAP.md` points it to the right glossary.
- [ ] It merges both glossaries into one list of terms.
- [ ] It skips both glossaries and uses plain English only.
Why: The re-pitch uses your project's own words. If the repo has more than one glossary, `GLOSSARY-MAP.md` points to the right one.
```

## When to use it

Use it mid-conversation, inside any other Skill, the moment a message loses you. For example:

- You notice you're skimming the agent's report on Ticket #12.
- You see jargon the agent invented, or five acronyms in one sentence.
- You're partway through [wizard](/learn/wizard), and the agent explains a stage whose premise (the reason behind it) you never saw.

```checkpoint quick-3
You're running another Skill when one of its messages loses you. When do you type `/wait-what`?
- [x] Now, in the middle of that other Skill.
- [ ] Once that other Skill has finished its run.
- [ ] In a fresh session, after closing this one.
Why: Use it mid-conversation, inside any other Skill, the moment a message loses you.
```

## When not to use it

wait-what repairs one message, after the fact. It doesn't stop the next one.

```checkpoint quick-4
A re-pitch has fixed one message for you. What can you expect from the agent's next message?
- [x] It can lose you again, as only one message was repaired.
- [ ] It will stay plain, as the Skill stays on for the session.
- [ ] It will stay plain, as your words went into the glossary.
Why: wait-what repairs one message, after the fact. It doesn't stop the next one from losing you too.
```

- If the jargon keeps coming, use [grill-with-docs](/learn/grill-with-docs) instead, because it's the upfront cure: a shared language agreed early stops the jargon arriving.
- If you want to learn a new topic, use [teach](/learn/teach) instead, because it's the Skill where an agent teaches you a topic over many sessions.

```checkpoint quick-5
The same jargon keeps coming, message after message. Which fits?
- [x] grill-with-docs, the upfront cure for jargon.
- [ ] wait-what, typed again on each new message.
- [ ] teach, which covers a topic over many sessions.
Why: A shared language agreed early stops the jargon arriving. wait-what would only repair each message after the fact, and teach is for learning a new topic.
```

```diagram
type: compare
caption: "wait-what repairs one message, after the fact."
columns: ["wait-what", "[grill-with-docs](/learn/grill-with-docs)"]
rows:
  - cells: ["after the fact", "the upfront cure"]
  - cells: ["repairs one message", "a shared language agreed early"]
```

## What it needs to start

A message that didn't land, in any conversation with an agent, code or not. Only you can start it, by typing `/wait-what`. The agent never starts it on its own, because only you know when you stopped following.

```checkpoint quick-6
The agent can see your replies getting confused. Will it start wait-what by itself?
- [x] No. Only you can start it, by typing `/wait-what`.
- [ ] Yes. It starts as soon as any one message runs long.
- [ ] Yes. It starts once the repo has a glossary.
Why: Only you know when you stopped following, so the agent never starts it on its own.
```

A `GLOSSARY.md` helps, since that's where the agent finds your project's words. Without one, the Skill still works, and you lose only those words.

## What it creates

Nothing on disk: no file, no Issue, no branch. You get a clearer re-pitch of the agent's last message, and you carry on.

```checkpoint quick-7
You use wait-what three times during a Ticket. What has it added to the repo?
- [x] Nothing: no file, no Issue and no branch.
- [ ] A glossary entry for each word it explained.
- [ ] An Issue listing the messages that lost you.
Why: It leaves nothing on disk. You get a clearer re-pitch of the agent's last message, and you carry on.
```

## Going deeper

### Why it exists

Some agent messages use too many words and still tell you little. That's **verbosity**. Matt Pocock, the Skill's author, hit it with Opus, the model he was using. He called its messages "incredibly verbose", and they went right over his head.

He tried all sorts of fixes, such as adding rules to his [instruction file](/learn/instruction-files). What he needed in the end was a Skill to say: wait, what did you say?

So wait-what doesn't try to make every message shorter. You reach for it once one message has lost you. The image for it is a fire extinguisher, not a sprinkler: you grab it once there's a fire. Stopping the fire before it starts is the job of [grill-with-docs](/learn/grill-with-docs).

```checkpoint quick-8
Why does a fire extinguisher fit wait-what better than a sprinkler?
- [x] You reach for it once a message has lost you.
- [ ] It stops confusing messages being written at all.
- [ ] It watches every message and steps in by itself.
Why: You grab an extinguisher once there's a fire. Stopping the fire before it starts is the job of grill-with-docs.
```

### How it works underneath

Here's the Skill's whole body:

```
Wait, I don't understand where you've got to here. Re-pitch
that: give me a little bit of context, talk in ASD-STE100
Simplified Technical English, and use the ubiquitous language
from `GLOSSARY.md` (follow `GLOSSARY-MAP.md` to the right one
if the repo has more than one).
```

The body runs on **leading words**: compact terms the model already knows and thinks with. A few of them can steer a lot of behaviour.

**_Wait_ names your state.** A rule like _be concise_ names the output, so the model clips words and loses you further. But _Wait_ says you stopped understanding here, so the agent backs up and explains.

```checkpoint quick-9
You add a rule that says "be concise". What does the model tend to do?
- [x] Clip words, which loses you further.
- [ ] Back up and explain what you missed.
- [ ] Ask which of its words you didn't follow.
Why: _Be concise_ names the output, so the model clips words. _Wait_ names your state, so the agent backs up and explains.
```

```diagram
type: compare
caption: "_Wait_ names your state."
columns: ["_be concise_", "_Wait_"]
rows:
  - label: "names"
    cells: ["the output", "your state"]
  - cells: ["the model clips words", "the agent backs up and explains"]
```

Popular fixes named after the output, such as `/tldr` and `/no-fluff`, give text that's "shorter and no clearer".

**The body is short on purpose.** Skills against verbosity usually fail by growing, "because the model copies the length of the skill, not its request." One user installed a 400-line Skill that asked for short answers, and the model still wasn't concise.

```checkpoint quick-10
You're about to write a 400-line Skill that asks for short answers. What's likely?
- [x] The model copies its length and stays wordy.
- [ ] The model follows its rules and gets concise.
- [ ] The model refuses it for being over a limit.
Why: Skills against verbosity usually fail by growing, because the model copies the Skill's length and not its request.
```

**_That_ can reach further back.** The body says re-pitch _that_, which is wider than _that last message_. What lost you is usually bigger than one paragraph, so the agent decides how far back to go.

**The body reuses words the agent already has.** ASD-STE100 sets the register: the plain style of the sentences. The ubiquitous language, the project's shared words, supplies the nouns. Matt's global `CLAUDE.md`, the [instruction file](/learn/instruction-files) in his home folder (`~/.claude/CLAUDE.md`) that Claude Code reads in every project, uses those same terms. Where your own files use them too, typing `/wait-what` "is not a new instruction". It's a reminder.

```checkpoint quick-11
Your instruction file and glossary already use the body's terms. What is typing `/wait-what` then?
- [x] A reminder of what the agent has already been told.
- [ ] A new rule that replaces what's in your instruction file.
- [ ] A request to add those terms to your own files.
Why: Where your own files use the same terms, typing it gives no new instruction. It's a reminder.
```

**Only you can start the Skill.** The setting behind that is `disable-model-invocation: true`.

**What ASD-STE100 really is.** ASD-STE100 Simplified Technical English, or STE, isn't a loose name for plain English. It's a controlled natural language: English held to fixed rules and a fixed word list. Work on it began in the late 1970s, so that people could understand aircraft maintenance documents.

STE has two parts: 53 writing rules, and a controlled dictionary of about 900 approved words. In general, each word has one meaning and one part of speech. Where English has synonyms, it keeps one: _start_, not _begin_ or _commence_. Its maintainers call it "a precise and structured writing standard, not a simplified or childish version of English".

```checkpoint quick-12
English offers start, begin and commence. What does STE do with them?
- [x] It keeps one, start, and leaves out the others.
- [ ] It approves all three, each with its own meaning.
- [ ] It lets a writer pick any one and stick with it.
Why: Each word has one meaning in general, and where English has synonyms, STE keeps one. So it says start, not begin or commence.
```

**Your glossary fills a slot STE leaves open.** The dictionary doesn't list a field's own words. STE lets writers add them, as _technical nouns_ and _technical verbs_, and these can come from company glossaries. That's the slot `GLOSSARY.md` fills: STE gives the plain general words, and your glossary gives the project's nouns.

```checkpoint quick-13
Your glossary defines Waitlist, and STE's dictionary doesn't list it. Can a re-pitch still say it?
- [x] Yes. STE lets a field add its own technical nouns.
- [ ] No. STE allows only the words in its own dictionary.
- [ ] Only once STE's dictionary has added that word.
Why: STE gives the plain general words. A field may add its own technical nouns and verbs, and your glossary supplies them.
```

**Your words matter most.** Matt treats the standard as a leading word for plain sentences. The real cure, he says, is telling the agent to "use your language, the stuff that you have come up with in Grill with Docs."

### A real example

In the August 2026 video that announced wait-what, Matt says Opus goes right over his head. Then he reads out the kind of message he means. In the video's auto-captions, part of it goes:

> The honest options are to accept it and reword the AC or to persist the digest along the export.

A sentence later, he asks: "What does that mean?"

Even if you know most of those words, you may still miss the premise: which digest, which export, and why those are the options. So a fix that only cut words wouldn't help. A re-pitch has to add "the premise you were missing".

```checkpoint quick-14
Why wouldn't a shorter version of Matt's example message help you?
- [x] The premise is missing, and cutting words can't add it.
- [ ] It's already too short, so cutting would lose more.
- [ ] It only needs plainer words, and cutting gives it those.
Why: Even if you know the words, you may not know which digest, which export, or why those are the options. A re-pitch has to add that premise.
```

### Where it goes wrong

**You type `/wait-what` all day.** Each re-pitch repairs one message, and it doesn't prevent the next one. The project has no shared language yet. Build one with [grill-with-docs](/learn/grill-with-docs), which records the words you both use in your `GLOSSARY.md`.

```checkpoint quick-15
You keep typing `/wait-what` all day on one project. What's the fix?
- [x] Build a shared language with grill-with-docs.
- [ ] Add a be-concise rule to your instruction file.
- [ ] Type `/wait-what` before each request you send.
Why: Each re-pitch repairs one message and doesn't prevent the next. grill-with-docs records the words you both use, which is what the project lacks.
```

**The re-pitch is shorter, but you're still lost.** It only deleted words. A good one is "shorter and clearer, not shorter and blunter". It adds the premise you were missing, and your glossary's terms come back. If this one did neither, try `/wait-what` again. When it's working, you can use it twice in a row, and it doesn't degrade into terseness.

```checkpoint quick-16
A re-pitch came back shorter, but you're still lost. What do you do?
- [x] Try `/wait-what` again, as it can take a second use.
- [ ] Stop, as a second use turns it into fragments.
- [ ] Accept it, as a shorter message counts as clearer.
Why: A good re-pitch is shorter and clearer, not shorter and blunter. When it's working, you can use it twice in a row, and it doesn't degrade into terseness.
```

**The re-pitch uses none of your project's words.** First check that the repo has a `GLOSSARY.md`. With none, the Skill still works, and you lose only that half. Repos with several glossaries hit this too, until August 2026. The body named one root file, then called `CONTEXT.md`, and knew nothing of the map file, `CONTEXT-MAP.md`. So it "fell silent on vocabulary instead of following the map." One added clause fixed it, so check that your copy is up to date. An up-to-date copy reads only `GLOSSARY.md` and `GLOSSARY-MAP.md`, the names version 1.3 gave these files. If your repo still has a `CONTEXT.md` or `CONTEXT-MAP.md`, rename them: `git mv CONTEXT.md GLOSSARY.md` and `git mv CONTEXT-MAP.md GLOSSARY-MAP.md`.

```checkpoint quick-17
Before the fix, what did the Skill do in a repo with only a map file and no root glossary?
- [x] It left out the project's words, and ignored the map.
- [ ] It refused to run until a root glossary file was created.
- [ ] It merged every glossary that the map pointed to.
Why: The body named one root file and knew nothing of the map, so it fell silent on vocabulary. One added clause fixed it.
```

**`npx skills` skipped it.** For about three hours in August 2026, `npx skills`, the installer for Matt's Skills, couldn't list or install wait-what. A repo-wide punctuation sweep had left an unquoted colon in the `description` setting of six Skills. The colon made those settings invalid YAML, the format a Skill's settings block is written in. The fix put the lines in quotes, as in today's `description: "Stop. That last message did not land: re-pitch it."`. So if a Skill of your own goes missing from the installer's list, check its `description` for a bare colon followed by a space.

### Try it

Get one long answer re-pitched, twice. You'll need your practice project, with Matt's Skills installed. If you haven't set it up, do the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. In the project folder, run `cat GLOSSARY.md`. You should see at least one entry.
2. If the file is missing, do the Try it step in [one shared language](/learn/one-shared-language) first.
3. If you skipped this Skill when installing, run `npx skills@latest add mattpocock/skills --skill wait-what`.
4. Start Claude Code: `claude`.
5. Say: "Read the Booking API Spec. Explain in full technical detail how you'd build it."
6. Read the answer until you notice you're skimming.
7. Type `/wait-what`. You should see added context, plain sentences and your glossary's words.
8. Type `/wait-what` again. You should see plain sentences still, not clipped fragments.

### Read more

- [The /wait-what Skill](https://www.aihero.dev/skills-wait-what), Matt Pocock, updated 2026-08-24
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05 (video)
- [feat: add wait-what, the verbosity fire extinguisher](https://github.com/mattpocock/skills/pull/751), mattpocock, 2026-08-05
- [wait-what: follow CONTEXT-MAP.md to the right CONTEXT.md](https://github.com/mattpocock/skills/pull/904), mattpocock, 2026-08-19
- [skills.sh skips to-spec and five other skills because description front matter is invalid YAML](https://github.com/mattpocock/skills/issues/907), fermumen, 2026-08-19
- [About ASD-STE100](https://www.asd-ste100.org/about_STE.html), ASD Simplified Technical English Maintenance Group (STEMG), describes Issue 9 (January 2025)
- [Frequently Asked Questions](https://www.asd-ste100.org/STE_faq.html), ASD Simplified Technical English Maintenance Group (STEMG)

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint wait-what-deeper-map-silent
Before the August 2026 fix, a repo had a `CONTEXT-MAP.md` pointing to several `CONTEXT.md` files and no root `CONTEXT.md`. You typed the re-pitch command there, and the answer came back with none of the project's nouns. Why did the Skill drop them?
- [x] Its body named only a single root `CONTEXT.md`, and had no clause telling it to follow the map file.
- [ ] The map file made its YAML front matter invalid, so the Skill never loaded in that repo at all.
  > That YAML bug was real, but it came from an unquoted colon in the `description` line, and it stopped `npx skills` installing the Skill at all.
- [ ] STE's dictionary has no room for project words, so the re-pitch drops them on purpose in every repo.
  > STE allows a field's own words as technical nouns and verbs. In a one-glossary repo the nouns came back.
Why: At that point the body knew nothing of `CONTEXT-MAP.md`. So in a repo with only the map, the Skill fell silent on vocabulary instead of following it. One added clause fixed that. Today the body says to follow `GLOSSARY-MAP.md` to the right `GLOSSARY.md`.
```

## Remember

```flashcards
Q: What does wait-what create?
A: Nothing on disk. Only a clearer re-pitch of the agent's last message.

Q: When do you use wait-what?
A: Mid-conversation, inside any Skill, when the agent's last message didn't land.

Q: wait-what fixes jargon after the fact. Which Skill is the upfront cure?
A: grill-with-docs, because a shared language agreed early stops the jargon arriving.

Q: Whose words does the agent use when it re-pitches?
A: The project's, from `GLOSSARY.md`.

Q: Why is wait-what's body so short?
A: Skills against verbosity fail by growing: the model copies the length of the Skill, not its request.

Q: In STE, where do a project's own words like Booking or Waitlist fit?
A: As technical nouns and technical verbs, which may come from company glossaries. That's the slot `GLOSSARY.md` fills.

Q: How can you tell a wait-what re-pitch is working?
A: It's shorter and clearer, not blunter. It adds the missing premise, brings back your glossary words, and survives a second use in a row.

Q: Before the August 2026 fix, what went wrong for wait-what in a repo with several glossaries and a map file?
A: It fell silent on vocabulary instead of following the map (then called `CONTEXT-MAP.md`, pointing to several `CONTEXT.md` files). A fix added the map clause to its body.
```

## Final test

```final-test wait-what-what-it-does
What does wait-what ask the agent to do?
- [x] Re-pitch its last message in plain English, with the glossary's words.
- [ ] Start the whole conversation again, this time in plain English.
- [ ] Write a summary file in plain words so that a fresh agent can take over.
- [ ] Add the terms it used to `GLOSSARY.md`, each with a plain definition.
Why: The Skill's one message asks the agent to say again what it just said, with a little context, in plain English and your project's words from `GLOSSARY.md`. Nothing in it restarts the conversation, writes a file or changes the glossary.
```

```final-test wait-what-vs-grill-with-docs
How do wait-what and grill-with-docs differ?
- [x] wait-what repairs one message after the fact. grill-with-docs stops the jargon up front.
- [ ] They do the same job, but grill-with-docs also writes the terms to `GLOSSARY.md`.
- [ ] wait-what adds new terms to `GLOSSARY.md`, and grill-with-docs only reads the file.
Why: wait-what repairs a message that has already lost you. grill-with-docs comes earlier, because a shared language agreed early is what stops the jargon arriving at all. So one is the repair and the other is the prevention.
```

```final-test wait-what-deeper-ste-is
In wait-what's body, what is ASD-STE100 Simplified Technical English?
- [x] A controlled language with fixed writing rules and a dictionary of approved words, each with one meaning.
- [ ] Matt's own short style guide for agents, kept in his global `CLAUDE.md` and copied into each Skill body.
- [ ] Another name for plain English, a loose style with no fixed rules, word list or official standard behind it.
- [ ] A rule that the agent may only use the words listed in your project's `GLOSSARY.md`, and no others at all.
Why: STE is a real standard, first made so that people could understand aircraft maintenance documents. It has 53 writing rules and a controlled dictionary of about 900 approved words, so it isn't a loose style. In wait-what it sets the plain style, and your glossary supplies the nouns.
```

```final-test wait-what-deeper-why-wait
Why is the Skill's leading word "wait", and not something like "be concise"?
- [x] "Wait" names your state, so the agent backs up and explains instead of clipping words.
- [ ] "Wait" is shorter to type, and the agent treats every short command as more urgent.
- [ ] "Be concise" is banned by the STE dictionary, so the Skill can't use that phrase.
- [ ] "Wait" makes the agent stop work, throw its last message away and start over.
Why: "Be concise" names the output, so the model obeys by clipping words, and that loses you further. "Wait" names your state: you stopped understanding here. So the agent backs up and adds the context you were missing.
```

```final-test wait-what-lost-mid-ticket
Halfway through a Ticket on your FastAPI backend, the agent writes: "I've lifted the session factory behind a seam and inverted the dependency." You can't tell where the work has got to, and you want to follow before it goes on. Which fits best?
- [x] Tell it that didn't land, and have it say it again in the project's words.
  > Right: that's `/wait-what`.
- [ ] Start an interview that agrees the project's terms and writes them down.
  > That's `/grill-with-docs`. That's the upfront cure, before building. Right now you only need one message said again, mid-conversation.
- [ ] Have the agent write a handoff document, then start a fresh session from it.
  > That's `/handoff`. A handoff is for a new harness, directory, colleague or side task. It won't explain the message you missed.
Why: One message lost you, partway through a Ticket, and you want to follow it before the agent goes on. A re-pitch gives you that message again, with the context you were missing, in plain English and your project's words.
```

```final-test wait-what-jargon-everywhere
You're about to start the next feature on your Docker project, in its repo. On the last one, nearly every agent message used terms you didn't know, and you kept asking it to say things again. You want that to stop. Which fits best?
- [x] Get interviewed about the feature first, and write down the terms you agree.
  > Right: that's `/grill-with-docs`.
- [ ] Ask the agent to re-pitch each message that loses you, as soon as it happens.
  > That's `/wait-what`. That works after the fact, one message at a time. It doesn't stop the jargon arriving.
- [ ] Get interviewed about the feature first, with nothing saved to the repo.
  > That's `/grill-me`. It builds no `GLOSSARY.md`, so the terms you agree aren't kept for the next session.
Why: A re-pitch repairs one message after the fact, and you want the jargon to stop arriving at all. A shared language agreed early is what does that. In a repo, the interview that writes those words down is grill-with-docs.
```

```final-test wait-what-why-glossary-words
You ask the agent to re-explain a message you didn't follow. Its new version uses the words from your project's `GLOSSARY.md`, like "Booking" and "Waitlist", instead of its own. Why does that matter?
- [x] You and the agent mean the same thing by each word, so no new jargon comes in.
- [ ] So the agent can add its own terms to `GLOSSARY.md` while it explains.
  > The re-pitch writes nothing. It only says the last message again, in words you've already agreed.
- [ ] Because those words are shorter, so the new version is quicker to read.
  > Length isn't the point. The re-pitch adds context, and uses words you share.
Why: `GLOSSARY.md` holds the words you and the agent have agreed. When the re-pitch uses them, you both mean the same thing, and no new jargon comes in.
```

```final-test wait-what-mid-setup-script
The agent is planning a step-by-step setup script for your project's CI secrets. It shows you the stages and says: "Stage 3 upserts the DSN idempotently, then mirrors it as a repo secret." You're lost, and it's waiting for you to confirm the stages. What do you do next?
- [x] Ask it to re-pitch that line, then confirm the stages once you follow them.
  > Right: that's `/wait-what`.
- [ ] Confirm the stages as they are, and work out stage 3 later, when the script runs.
  > That's `/wizard`. You'd be agreeing to stages you don't understand. The confirm step is your chance to add, drop or reorder them.
- [ ] Stop and start over with an interview that records the project's terms.
  > That's `/grill-with-docs`. You don't need to start over. A re-pitch works mid-conversation, inside any other Skill.
Why: You can repair a message that lost you right there, inside whatever Skill is running, so you don't need to start over. You also shouldn't agree to what you can't follow. Once the line makes sense, you can confirm the stages knowing what they do.
```

```final-test wait-what-deeper-concise-rules-failed
You added "be concise" to your instruction file and installed a long concision Skill. The agent still sends messages you skim, full of phrases you can't follow. You want this message fixed now. Which fits best?
- [x] Type a short command that says you're lost, and get the message said again with the missing context.
  > Right: that's `/wait-what`.
- [ ] Start an interview that agrees the project's terms one by one and writes them into `GLOSSARY.md`.
  > That's `/grill-with-docs`. An agreed glossary keeps jargon out of later messages. This one has already lost you.
- [ ] Start a learning session on the topic, with a plan that runs over several sessions and keeps state.
  > That's `/teach`. That's for learning a topic over several sessions. You only need one message said again.
Why: Matt tried rules in his instruction file too, and long Skills that ask for short answers fail because the model copies their length. What he shipped is a tiny Skill you type the moment you stop following. It repairs this message now.
```

```final-test wait-what-deeper-why-your-words
You learn that ASD-STE100 has a controlled dictionary of about 900 approved words. Your yoga-studio repo's `GLOSSARY.md` defines Booking, Class and Waitlist. A teammate fears the Skill's STE instruction will stop the re-pitch saying "Waitlist". Why doesn't it?
- [x] STE sets the plain register, and lets a field add its own technical nouns, such as words from company glossaries.
- [ ] The Skill tells the agent to drop STE's dictionary whenever a `GLOSSARY.md` exists, so only your words count.
  > The body asks for both at once. STE sets the register, and the glossary supplies the nouns.
- [ ] STE's approved dictionary already lists everyday business nouns like Waitlist and Booking, so no glossary is needed.
  > The dictionary doesn't list technical nouns. They come from the field, for example company glossaries.
Why: The body asks for both at once. STE sets the plain style, and your glossary supplies the nouns. STE leaves room for that: a field may add its own technical nouns and verbs, which may come from company glossaries. So "Waitlist" stays.
```

```sources
- [wait-what: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/wait-what/SKILL.md), Matt Pocock's Skills
- [writing-for-agents: SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL-MECHANICS.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [teach: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/teach/SKILL.md), Matt Pocock's Skills
- [The /wait-what Skill](https://www.aihero.dev/skills-wait-what), Matt Pocock, 2026-08-05 (page says "Updated Aug 24, 2026")
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05
- [feat: add wait-what, the verbosity fire extinguisher](https://github.com/mattpocock/skills/pull/751), mattpocock, 2026-08-05
- [writing-for-agents: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [About ASD-STE100](https://www.asd-ste100.org/about_STE.html), ASD Simplified Technical English Maintenance Group (STEMG)
- [Frequently Asked Questions (ASD-STE100)](https://www.asd-ste100.org/STE_faq.html), ASD Simplified Technical English Maintenance Group (STEMG)
- [wait-what: follow CONTEXT-MAP.md to the right CONTEXT.md](https://github.com/mattpocock/skills/pull/904), mattpocock, 2026-08-19
- [Fix invalid YAML front matter in six SKILL.md files](https://github.com/mattpocock/skills/pull/911), mattpocock, 2026-08-19
- [Remove all em-dashes from the repo](https://github.com/mattpocock/skills/pull/905), mattpocock, 2026-08-19
- [skills.sh skips to-spec and five other skills because description front matter is invalid YAML (#907)](https://github.com/mattpocock/skills/issues/907), fermumen, 2026-08-19
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [wizard: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wizard/SKILL.md), Matt Pocock's Skills
```
