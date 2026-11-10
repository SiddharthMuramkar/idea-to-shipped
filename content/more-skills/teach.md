---
title: teach: learn a topic over many sessions
slug: teach
summary: How teach turns an empty folder into a workspace where an agent teaches you one topic over many sessions, and keeps your progress in files.
---

## What it's for

Say you keep copying migration commands into your FastAPI backend, the Python code behind your booking site. A migration is a script that changes a database's tables. You ask the agent to explain, the answer feels clear, and a week later it's gone. The next session starts from nothing.

**teach turns a folder into a teaching workspace: a folder where an agent teaches you one topic over many sessions.**

It's **stateful**: it keeps its state in files, so later sessions carry on. For example, here's a first session before building [Ticket](/learn/issues-and-keeping-track) #12's bookings table:

```
You:   /teach how to write and roll back SQL migrations

Agent: Why do you want to learn this?

You:   To build the bookings table without copying commands.

Agent: Saved that to MISSION.md.
       Saved trusted sources to RESOURCES.md.
       Wrote lessons/0001-what-a-migration-is.html.
```

```checkpoint quick-1
You close a teach session and open a fresh one tomorrow. How does the new session carry on?
- [x] It reads the state that teach keeps in its files.
- [ ] It reloads yesterday's conversation from memory.
- [ ] It asks you to paste in what you covered yesterday.
Why: teach is stateful. It keeps its state in files, so a later session can read them and carry on.
```

Your answer is your **mission**: the real reason you want to learn a topic.

Each later session reads those files. It writes one short lesson, and you practise. What you show you understand goes in a **learning record**, a short note the next session reads.

```diagram
type: cycle
caption: "What you show you understand goes in a learning record, a short note the next session reads."
steps: ["Each later session reads those files.", "It writes one short lesson", "you practise", "What you show you understand"]
```

The goal is **storage strength**: long-term memory. **Fluency strength**, recall in the moment, can give a false sense of mastery. So lessons make you recall from memory, because effortful recall builds storage strength.

```checkpoint quick-2
You reread a lesson, and today the commands feel easy. What should you make of that?
- [x] It may be fluency strength, which can give false mastery.
- [ ] It proves storage strength, so you can stop practising it.
- [ ] It means the goal is met, since recall today is what counts.
Why: Recall in the moment is fluency strength, and it can give a false sense of mastery. The goal is storage strength, which is long-term memory.
```

## When to use it

Use it when the learning itself is the project, not for one explanation in passing:

- You want to learn a new framework or language over weeks.
- You've joined an unfamiliar codebase, and you want to get oriented.

```checkpoint quick-3
You're midway through Ticket #13, and one idea confuses you. Is that a job for teach?
- [x] No. It's for when learning is the project, not one explanation.
- [ ] Yes. Every explanation belongs in a teaching workspace of its own.
- [ ] Yes. Start it on the Ticket's branch, and carry on from there.
Why: teach is for when the learning itself is the project. One explanation in passing doesn't need a workspace.
```

## When not to use it

- If you want one question answered with sources, use [research](/learn/research) instead, because it leaves one cited file, not lessons.
- If the agent's last message lost you, use [wait-what](/learn/wait-what) instead, because it re-explains that one message.
- If you've done the learning and now want to build a feature whose idea is still vague, go back to its repo and use [grill-with-docs](/learn/grill-with-docs) instead, because it interviews you to sharpen the idea and saves the words and decisions you settle.

```checkpoint quick-4
You want cited facts on connection pooling, and no lessons. Which fits?
- [x] research, which leaves one cited file.
- [ ] teach, which writes lessons in a folder.
- [ ] wait-what, which re-explains one message.
Why: You asked for one question answered with sources. research leaves one cited file, not lessons, and wait-what only re-explains the agent's last message.
```

## What it needs to start

An empty folder. teach expects one mission per workspace, so keep it out of the project you're working in.

```checkpoint quick-5
You want to learn SQL migrations for your booking site. Where do you run /teach?
- [x] In a separate empty folder, used for this one mission.
- [ ] In your booking site's repo, beside its migrations.
- [ ] In your home folder, shared with your other topics.
Why: teach expects an empty folder and one mission per workspace. So it stays out of the project you're working in.
```

If `MISSION.md` is empty, the agent's first job is to ask why you want to learn this.

It's **user-invoked**: only you can start the [Skill](/learn/skills), by typing its name. A setting in its `SKILL.md`, the file holding a Skill's instructions, stops the agent starting it.

```checkpoint quick-6
Partway through a Ticket, you're lost on a topic. Will the agent start teach for you?
- [x] No. Only you can start it, by typing its name.
- [ ] Yes. It starts teach whenever it sees you're lost.
- [ ] Yes. Its SKILL.md tells it to start when you're stuck.
Why: teach is user-invoked. A setting in its SKILL.md stops the agent starting it, so it runs only when you type its name.
```

## What it creates

Files in the folder you ran `/teach` in.

- `MISSION.md`: your mission.
- `RESOURCES.md`: trusted sources, split into Knowledge (sources to read) and Wisdom (communities to join).
- `lessons/0001-<name>.html`: one HTML file per lesson, to open in your browser, teaching one tightly-scoped thing tied to the mission.
- `reference/*.html`: cheat sheets and glossaries to look up later.
- `learning-records/0001-<name>.md`: written when, for example, you show you understand something non-trivial, or a misconception, a wrong belief, is fixed. Covering a topic isn't enough.
- `assets/`: reusable pieces shared by lessons, such as page styling and quiz code.
- `NOTES.md`: notes the Skill keeps on your preferences.

A glossary in `reference/` picks one word for each idea and lists the others as words to avoid. Once one exists, every lesson keeps to it, so each idea has one word.

```checkpoint quick-7
A month from now, you need the rollback command fast. Where in the workspace do you look?
- [x] reference/, with its cheat sheets to look up later.
- [ ] learning-records/, with its notes of what you showed.
- [ ] RESOURCES.md, with its list of the trusted sources.
Why: reference/ holds the cheat sheets and glossaries you look up later. Learning records note what you've shown, and RESOURCES.md lists the sources.
```

## Going deeper

### Why it exists

One explanation can't build on anything. The agent doesn't know where you've got to, or what you're ready for. A good teacher does.

Matt Pocock, who wrote the Skill, has taught for ten years, and he wanted to put what he knows inside a Skill, so that anyone could learn anything.

His first idea was a stateless Skill: you name a topic, it finds good sources, and it hands back one lesson. He dropped that, because "all the good teaching that I do is stateful". A teacher remembers where you've got to, what you've learned and what comes next. So teach saves its state to files.

```checkpoint quick-8
Why did Matt drop the idea of one lesson per topic, with nothing saved?
- [x] Good teaching remembers where you've got to, and what's next.
- [ ] Saving nothing made each lesson cost too many tokens to write.
- [ ] One lesson per topic came out too long to read in one go.
Why: In his words, "all the good teaching that I do is stateful". A teacher remembers where you've got to, so teach saves its state to files.
```

Stateful isn't better in itself. [grill-me](/learn/grill-me) saves nothing and [grill-with-docs](/learn/grill-with-docs) saves ADRs (short records of hard decisions) and glossaries, and Matt says each suits different situations.

The second problem is trust. teach treats what the model already knows, its **parametric knowledge**, as untrusted. So it finds high-trust sources first, records them in `RESOURCES.md`, and cites them inside every lesson.

```checkpoint quick-9
You run teach on a topic the model knows well. Where do its lessons get their facts?
- [x] From high-trust sources it finds first, then cites in each lesson.
- [ ] From what the model already knows, since it knows this topic well.
- [ ] From your own notes, which it asks you to paste in before it starts.
Why: teach treats what the model already knows as untrusted. So it finds high-trust sources first, records them in RESOURCES.md, and cites them inside every lesson.
```

### How it works underneath

**Two kinds of strength.** Storage strength is a term from the psychologists Elizabeth and Robert Bjork, who split what you know in two:

- **Retrieval strength** is how easy something is to recall right now.
- **Storage strength** is how deeply it's tied into what you already know.

How you perform in the moment shows only retrieval strength, not how well something is stored for the long term. So a lesson that felt easy can mislead you. If you mistake one strength for the other, the Bjorks warn, you start to prefer worse ways of studying. teach's `SKILL.md` calls the in-the-moment kind fluency strength.

**Difficulty that helps.** The Bjorks' cure is **desirable difficulties**: things that make study feel harder but make learning last. Examples are interleaving topics (mixing them, not grouping them), spacing sessions out, and using tests instead of presentations. A difficulty helps only if you have the background to meet it. Otherwise "they become undesirable difficulties".

```checkpoint quick-10
You've never seen a migration, and your first lesson mixes it with two other new topics. Does that help?
- [x] No. Without the background, it's an undesirable difficulty.
- [ ] Yes. Interleaving topics always beats grouping them together.
- [ ] Yes. Every difficulty makes learning last, however hard it is.
Why: A difficulty helps only if you have the background to meet it. Otherwise it turns into an undesirable one.
```

**Knowledge first, then skills.** teach adds a rule. For knowledge, difficulty is the enemy, because it eats the working memory you need to understand. That's the little you can hold in mind at once. For skills, difficulty is the tool, because effortful recall builds storage strength. So a lesson teaches the knowledge first. Then you practise in a feedback loop: quizzes and small tasks that tell you at once how you did.

```checkpoint quick-11
A lesson explains what a migration is, for the first time. Should that part feel hard?
- [x] No. Difficulty eats the working memory you need to understand.
- [ ] Yes. Difficulty builds storage strength for knowledge as well.
- [ ] Yes. Effortful recall works best before you understand a thing.
Why: For knowledge, difficulty is the enemy, because it eats your working memory. For skills, it's the tool, so the hard practice comes after the knowledge.
```

```diagram
type: compare
caption: "For knowledge, difficulty is the enemy"
columns: ["For knowledge", "For skills"]
rows:
  - label: "difficulty is"
    cells: ["the enemy", "the tool"]
  - label: "because"
    cells: ["it eats the working memory you need to understand", "effortful recall builds storage strength"]
```

**Hard enough, but not too hard.** To Matt, the **zone of proximal development** is where a lesson challenges you without scaring you off. The agent works out yours from your learning records, so they tell the next lesson where your edge is. For example, a record might say:

```
# Can roll back a migration

Rolled back the bookings table migration and explained what it undid.
The next lesson can skip rollback.
```

```checkpoint quick-12
Why do learning records matter to the next lesson?
- [x] They show where your edge is, so the lesson can aim there.
- [ ] They set each lesson's length, so it fits in one sitting.
- [ ] They list the topic's sources, so the lesson can cite them.
Why: The agent works out your zone of proximal development from your learning records. So they tell the next lesson where your edge is.
```

### A real example

In a June 2026 video, Matt shows his own course: solving a Rubik's Cube. Its `MISSION.md` said he wanted to solve a scrambled 3 by 3 Rubik's Cube "unaided at least once". Lesson one covered its anatomy, notation and the white cross, with diagrams and quizzes.

In a later session he ran `teach` and said he could solve everything except the corner cycle, one algorithm. The agent's [context](/learn/context-window), everything it can see at once, was empty, so the agent started by checking the state of the workspace. Then it wrote one new lesson on that algorithm alone, with an interactive tap-through of the moves.

```checkpoint quick-13
Matt's new session starts with an empty context. What does the agent do first?
- [x] It checks the state of the workspace, then writes one lesson.
- [ ] It restarts the course, since the context has nothing in it.
- [ ] It asks him to paste his earlier lessons back into the chat.
Why: The workspace's files hold what the context doesn't. The agent checked them first, then wrote one new lesson on the corner cycle alone.
```

That's what the files are for: since "everything has been saved to the file system", he can clear the context and carry on.

His written guide runs teach on French, with a `reference/glossary.html` cheat sheet and lessons with tap-to-hear audio buttons.

### Where it goes wrong

**The lessons assume things you don't know.** This is the most common complaint. teach has no assessment step: it infers your level from the mission and the learning records, and session one has no records. So state what you know and what you don't in your first message. When a lesson misses, correct the level out loud, because the correction becomes a learning record.

```checkpoint quick-14
You're about to start your first teach session. How do you stop lessons assuming too much?
- [x] Say what you know and what you don't in your first message.
- [ ] Run its level check, which comes with the very first session.
- [ ] Wait for the learning records it writes before the first lesson.
Why: teach has no assessment step, and session one has no learning records. So it has only your mission to go on, unless you say your level.
```

**The right quiz answer kept landing first.** One contributor's fix in the instructions still left it first 33 times out of 33. In October 2026, pull request #1183 added a rule to `SKILL.md`: "Vary which position holds the correct answer across questions." Matt's page, last updated in August 2026, before that pull request, still calls this unfixed. The pull request left out a shuffle in the quiz widget, calling the written rule the smallest fix. So nothing enforces it.

If answers keep landing in one slot, ask for a quiz component in `assets/` that shuffles them. Answer order is a [mechanical mistake](/learn/fix-the-environment), so code can fix it, and wording hasn't. The agent reads `assets/` before writing a lesson and builds from what's there.

```checkpoint quick-15
Your quizzes keep putting the right answer first. What fixes that for later lessons?
- [x] A quiz component in assets/ that shuffles the answers.
- [ ] A firmer sentence in MISSION.md about the answer order.
- [ ] A note in NOTES.md asking for answers in varied positions.
Why: Answer order is a mechanical mistake, so code fixes it and wording hasn't. The agent reads assets/ before writing a lesson and builds from what's there.
```

**A lesson teaches something false.** One user learning a 2x2 Rubik's Cube got move sequences that don't solve it. Matt's verdict: "`teach` is not reliable enough to trust unchecked, and no skill built on an LLM is." An LLM is the kind of AI model behind these agents. The sources, the citations and each lesson's one recommended primary source make a lesson cheap to check. They don't remove the need to check.

**There's no review schedule.** The lessons are designed around spacing, but "nothing schedules a review". teach won't switch from new material to review on its own, so ask when you want it.

```checkpoint quick-16
teach's lessons are designed around spacing, and you want to review. What do you do?
- [x] Ask for it, because teach won't switch to review on its own.
- [ ] Wait, because teach schedules a review when one comes due.
- [ ] Open a learning record, because each one sets a review date.
Why: The lessons are designed around spacing, but "nothing schedules a review". teach won't switch from new material on its own, so you ask.
```

**The lessons come out thin.** Results vary by model, [harness](/learn/how-agents-work) and [effort level](/learn/models-effort-ultracode). One user got "a single 30-line HTML card" through the Copilot CLI harness with one of OpenAI's Codex models. Change one of those before you rewrite your prompt.

### Try it

You'll need your practice project, the yoga-studio booking site. If you haven't set it up, do "Try it: set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first. teach stays out of that repo, so you'll make a second one beside it.

Your first message will say this, with its last two sentences changed to fit you:

```
/teach SQL migrations. My mission: write and roll back the bookings table migration without copying commands. I know Python backends. I don't know how a migration gets undone.
```

1. From the folder holding `yoga-studio`, create the repo: `gh repo create yoga-studio-learning --private --clone`. You should see a new folder.
2. Go into it: `cd yoga-studio-learning`.
3. If you installed Matt's Skills with the plugin, or for your whole computer, skip this step: teach is already here. Otherwise install it for this folder: `npx skills@latest add mattpocock/skills --skill teach`, choosing Claude Code if asked.
4. Start Claude Code: `claude`.
5. Send the message above, and answer any questions it asks. You should see `MISSION.md`, then `RESOURCES.md`, then a file in `lessons/`.
6. Open `RESOURCES.md`. You should see its sources listed under Knowledge and Wisdom.
7. Open the lesson in your browser and work through it. You should see it name one primary source.
8. The next day, start a fresh session in that folder: `claude`.
9. Type `/teach next lesson for SQL migrations`. You should see the course continue, not restart.

### Read more

- [The /teach Skill](https://www.aihero.dev/skills-teach), Matt Pocock, updated 2026-08-24
- [Learn anything with the /teach skill](https://www.youtube.com/watch?v=s5T5oQJcJ6U), Matt Pocock, video, 2026-06-08
- [Learn Anything With My /teach Skill](https://www.aihero.dev/learn-anything-with-my-teach-skill), Matt Pocock, 2026-06-08
- [teach: anchor workspace paths, vary quiz answer position](https://github.com/mattpocock/skills/pull/1183), Matt Pocock, merged 2026-10-07
- [Making Things Hard on Yourself, But in a Good Way: Creating Desirable Difficulties to Enhance Learning](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf), Elizabeth L. Bjork and Robert A. Bjork, 2011

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint teach-deeper-quiz-shuffle
Your learning workspace on SQL migrations keeps putting the right quiz answer first, even though its Skill file now says to vary the position. You want this gone for every future lesson, not just the next one. Why ask for a quiz component in assets/ that shuffles the answers, rather than a stronger instruction?
- [x] Answer order is a mechanical problem, so code that shuffles can fix it; wording hasn't.
- [ ] Lessons are rarely revisited, so only files in assets/ get read again by later sessions.
  > Reference documents get revisited too, and assets/ is read before every lesson. The reason is that a fixed pattern gets a mechanical fix, and an instruction-level fix already failed.
- [ ] Instructions in SKILL.md only reach Claude models, while a component works in every harness.
  > Nothing limits the rule to Claude. The problem was confirmed on Sonnet, Opus and GLM alike, and one instruction-level fix still failed 33 times out of 33.
- [ ] A stronger instruction means editing MISSION.md, which needs your OK before it changes.
  > Changing the mission does need your OK, but quiz order isn't part of the mission. A mechanical problem belongs in code.
Why: Answer order is a mechanical mistake: a fixed pattern a program could spot. Wording has already failed, with one contributor's instruction-level fix leaving the right answer in slot A 33 times out of 33, and the newer rule in SKILL.md is still only words. A component in assets/ that shuffles fixes the pattern itself, and later lessons can build from it, since the agent reads assets/ first.
```

```checkpoint teach-deeper-state-your-level
You start a learning workspace on Docker networking for your FastAPI app. You know Python backends well but have never set up a Docker network. In your very first message you list what you already know and what you don't. Why does that matter most in session one?
- [x] It has no level check and no learning records yet, so without you it would guess your level.
- [ ] MISSION.md is only written after the first lesson, so your level must come from the chat.
  > The mission comes first, before any lesson. The gap is that nothing records your level yet, and there's no assessment step.
- [ ] Later sessions read only NOTES.md, so the first message is the one thing that is ever saved.
  > Later sessions read the whole workspace, and corrections become learning records. Session one just has no records to go on.
- [ ] The first lesson's level is locked in and reused, so it can't change for the rest of the course.
  > Nothing is locked: the next lesson is picked from the learning records as they grow. Session one is simply the one with none.
Why: teach works out your level from the mission and the learning records, and in session one there are no records. It has no assessment step, so it can assume things you don't know. Saying what you know and don't up front gives it what it would otherwise have to guess.
```

## Remember

```flashcards
Q: What does teach create?
A: Files in the current folder. MISSION.md, RESOURCES.md and NOTES.md, plus the folders lessons/, reference/, learning-records/ and assets/.

Q: In teach, what's the agent's first job when MISSION.md is empty?
A: To ask you why you want to learn the topic.

Q: In teach, what is one lesson?
A: One self-contained HTML file that teaches one tightly-scoped thing tied to the mission.

Q: In teach, which matters more, fluency strength or storage strength?
A: Storage strength, which is long-term memory. Fluency, recall in the moment, can give a false sense of mastery.

Q: In teach, when is difficulty the enemy, and when is it the tool?
A: The enemy while acquiring knowledge, because it eats the working memory you need to understand. The tool for skills, because effortful recall builds storage strength.

Q: Why did Matt make teach a stateful Skill rather than a stateless one?
A: Because, in his words, all the good teaching he does is stateful. A teacher remembers where you've got to, what you've learned and what comes next.

Q: Can you trust a teach lesson without checking it?
A: No. Matt says no Skill built on an LLM is reliable enough. The lesson's citations and its one recommended primary source make checking cheap, not unneeded.
```

## Final test

```final-test teach-where-state-lives
Where does teach keep the state of your learning between sessions?
- [x] In files in the folder you ran it in.
- [ ] In the agent's memory, which carries over on its own.
- [ ] In Issues on the Issue tracker.
- [ ] Nowhere. Each session starts from scratch.
Why: The folder you run it in becomes the teaching workspace. Your mission, lessons and learning records are files there, so a fresh session can read them and carry on.
```

```final-test teach-first-job
You start teach in a new, empty folder, and there's no MISSION.md yet. What does the agent do first?
- [ ] It writes the first short HTML lesson on the topic.
- [x] It asks you why you want to learn the topic.
- [ ] It searches the web for good resources to read.
- [ ] It writes a learning record of what you know.
Why: The mission grounds every lesson, so with none written down the agent's first job is to ask why you want to learn this. Without it, lessons feel too abstract and the agent can't judge what to teach next.
```

```final-test teach-learning-record
When does teach write a learning record?
- [ ] At the end of each session, logging every topic the lesson covered with you.
- [ ] When it adds a new resource to RESOURCES.md, to note what you should read next.
- [x] When you show you understand something non-trivial, or a misconception is fixed.
Why: A learning record marks something that steers later sessions, like a decision in an ADR: what you've shown, or what you've told it you already know. Material merely covered doesn't count, because coverage isn't learning. That's why it isn't a session log.
```

```final-test teach-deeper-retrieval-vs-storage
In the Bjorks' terms, why can a lesson that felt easy mislead you about how much you've learned?
- [x] Easy recall right now shows retrieval strength, not how well it is stored for the long term.
- [ ] Easy lessons skip their citations, so you can't check whether the claims in them are true.
- [ ] Easy recall means the topic is outside your zone of proximal development, so it is wasted.
- [ ] Easy lessons are never written to learning records, so the next session forgets them.
Why: How you perform in the moment shows only retrieval strength, how easy something is to recall right now. If you mistake that for storage strength, you start to prefer worse ways of studying. teach's SKILL.md calls the in-the-moment kind fluency strength, and aims for storage strength.
```

```final-test teach-deeper-quiz-position-now
You read that teach's right quiz answer always lands first. What does SKILL.md ask for now?
- [x] It asks lessons to vary which position holds the right answer, as a written rule only.
- [ ] It says nothing about position, so the right answer still lands first, as Matt's page reports.
- [ ] It ships a quiz widget in assets/ that shuffles every answer list when a lesson loads.
- [ ] It drops quizzes from lessons, so the position of the right answer no longer matters.
Why: A pull request in October 2026 added "Vary which position holds the correct answer across questions." to SKILL.md, and Matt's page, last updated in August 2026, before that pull request, still calls the problem unfixed. The pull request left out a mechanical shuffle in the quiz widget, so the rule is only words and nothing enforces it.
```

```final-test teach-learn-sql-migrations
You keep copying SQL migration commands into your FastAPI backend without understanding them. Over the next few weeks you want to learn how migrations really work, in short sessions that build on each other. Which fits best?
- [x] Start a workspace folder that holds a mission, lessons and learning records.
  > Right: that's `/teach`.
- [ ] Send a background agent to read primary sources and leave one cited Markdown file.
  > That's `/research`. That answers one question in one file. It doesn't run lessons and practice over many sessions.
- [ ] Ask the agent to say its last message again in plain words, with the missing context.
  > That's `/wait-what`. It fixes one message that didn't land. Nothing was just said here; you want to learn a whole topic.
- [ ] Get interviewed about your migration plan until every decision is clear.
  > That's `/grill-me`. That sharpens a plan. You don't have a plan to sharpen; you want to learn something.
Why: You want to learn a whole topic over weeks, so you need sessions that build on each other. A teaching workspace keeps your progress in files, so each session carries on from the last. It starts by asking why you want to learn, so every lesson ties back to that goal.
```

```final-test teach-pooling-facts
Next week you'll plan connection pooling for your FastAPI app's Postgres database. You don't want lessons. You want the facts, from primary sources and cited, in a file you can bring to the planning, and you want to keep working while it's gathered. Which fits best?
- [x] Have a background agent read up and leave a sourced Markdown file in the repo.
  > Right: that's `/research`.
- [ ] Start a workspace folder with a mission and short lessons on connection pooling.
  > That's `/teach`. That's for learning a topic over many sessions. You asked for one cited file, not lessons.
- [ ] Get interviewed about the pooling plan now, before the planning meeting.
  > That's `/grill-me`. The facts aren't in your head yet. Gather them first, then take them into the interview.
Why: You asked for facts, not lessons, and you want to keep working meanwhile. A background agent reading primary sources does that, and leaves one cited file. Bring that file to the planning, because it feeds your thinking rather than replacing it.
```

```final-test teach-learned-now-build
For three weeks you've had short lessons on SQL migrations in a learning workspace folder, and they've stuck. Now you want to add a waitlist table to your FastAPI backend's repo, but the feature itself is still a vague idea. What comes next?
- [x] Get interviewed about the waitlist in the repo, saving terms and decisions.
  > Right: that's `/grill-with-docs`.
- [ ] Ask the learning workspace for a new lesson on building the waitlist.
  > That's `/teach`. The workspace is for learning a topic over many sessions. Building a feature in your repo starts on the main flow, with the interview that sharpens the idea.
- [ ] Send a background agent to read up on waitlists and leave a cited file.
  > That's `/research`. Missing facts aren't the gap here. The idea itself is vague, and an interview is what sharpens it.
- [ ] Write the waitlist up as a Spec now and publish it to the tracker.
  > That's `/to-spec`. Nothing about the waitlist has been settled yet, and to-spec only writes up what was already discussed.
Why: You've done the learning, and now you want to build something in a repo. That puts you on the main flow, not in the workspace. The idea is still vague, so the next step is grill-with-docs, the interview that sharpens it and saves the words and decisions you settle.
```

```final-test teach-glossary-word
Your learning workspace on testing FastAPI apps already has a glossary in reference/. It says "test double", and lists "mock" as a word to avoid. A new lesson draft says "mock" throughout. Why should the lesson use "test double"?
- [x] Once a glossary exists, every lesson keeps to it, so each idea has one word.
- [ ] The glossary uses the field's official terms, and lessons must match the textbooks.
  > Matching the field isn't the point. The glossary picks the best of several words, and the lessons keep to that pick.
- [ ] HTML lessons can't contain any word that the glossary marks as one to avoid.
  > Nothing stops a lesson from using them. The agent keeps to the glossary on purpose.
- [ ] Reference documents get reread more than lessons, so lessons copy their wording.
  > They do get reread more, but that isn't why. Every lesson keeps to the glossary so each idea has one word.
Why: A glossary picks one word for each idea and lists the rest as words to avoid. Once it exists, every lesson keeps to it. That's how the language compresses, and with one word per idea, complex terms get easier to grasp later.
```

```final-test teach-lost-the-thread
You're planning the Docker setup for your website with an agent. Its last message was full of terms you don't know, and you lost the thread. You just want that message said again, in plain words, with the context you were missing. Which fits best?
- [x] Have the agent re-pitch its last message using your glossary's words.
  > Right: that's `/wait-what`.
- [ ] Start a workspace folder and work through short lessons on Docker terms.
  > That's `/teach`. That's a multi-session study of a whole topic. You only need one message explained, right now.
- [ ] Send a background agent to read up on those Docker terms and cite sources.
  > That's `/research`. That produces a cited file later. It doesn't explain the message you just missed.
- [ ] Get interviewed until you and the agent agree on shared Docker words.
  > That's `/grill-with-docs`. That's the upfront cure that stops jargon arriving. The message has already missed, so it needs a re-pitch after the fact.
Why: One message lost you, so you need it said again now, in plain English, with the context you were missing and your glossary's words. Lessons or a cited file would come too late. A shared language agreed early is what stops the jargon arriving at all.
```

```sources
- [The /teach Skill](https://www.aihero.dev/skills-teach), Matt Pocock, 2026-08-24
- [teach: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/teach/SKILL.md), Matt Pocock's Skills
- [Learn anything with the /teach skill](https://www.youtube.com/watch?v=s5T5oQJcJ6U), Matt Pocock, 2026-06-08
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [teach: MISSION-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/teach/MISSION-FORMAT.md), Matt Pocock's Skills
- [writing-for-agents: SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL-MECHANICS.md), Matt Pocock's Skills
- [Making Things Hard on Yourself, But in a Good Way: Creating Desirable Difficulties to Enhance Learning](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf), Elizabeth L. Bjork and Robert A. Bjork, 2011
- [teach: RESOURCES-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/teach/RESOURCES-FORMAT.md), Matt Pocock's Skills
- [teach: LEARNING-RECORD-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/teach/LEARNING-RECORD-FORMAT.md), Matt Pocock's Skills
- [Learn Anything With My /teach Skill](https://www.aihero.dev/learn-anything-with-my-teach-skill), Matt Pocock, 2026-06-08
- [teach: anchor workspace paths, vary quiz answer position](https://github.com/mattpocock/skills/pull/1183), mattpocock, 2026-10-06
- [Six skills are silently unreachable through the CLI: unquoted `: ` in `description:` frontmatter (#908)](https://github.com/mattpocock/skills/issues/908), mnaimfaizy, 2026-08-19
- [AI Skills for Real Engineers](https://www.aihero.dev/skills), Matt Pocock
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [teach: GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/teach/GLOSSARY-FORMAT.md), Matt Pocock's Skills
```
