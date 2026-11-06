---
title: grill-me: sharpen a plan, saving nothing
slug: grill-me
summary: How Matt Pocock's grill-me Skill has an agent interview you about an idea until you both see it the same way, with nothing saved.
---

## What it's for

Say you're wondering whether the yoga studio should charge for late cancellations. No code depends on the answer yet, so there's no [repo](/learn/what-git-and-github-are), a project folder that Git tracks, under this question. You keep turning it over, and it stays fuzzy.

**grill-me has an agent interview you about an idea until you both understand it the same way, and it saves nothing.**

It's the same interview that [grill before you build](/learn/grill-before-you-build) describes. Its [Skill](/learn/skills) file holds one line of instructions, which hands over to the [grilling](/learn/grilling) Skill. That Skill runs the interview.

```checkpoint quick-1
You type /grill-me. Which Skill runs the interview?
- [x] grilling, because grill-me's one line hands over to it.
- [ ] grill-me, because its one line holds all the interview's rules.
- [ ] grill-with-docs, because grill-me's one line hands over to it.
Why: grill-me's file has one line of instructions, which hands over to the grilling Skill. That Skill runs the interview.
```

For example, the first round might look like this:

```
You:   /grill-me Should the studio charge for late
       cancellations? I haven't thought it through.

Agent: ❓ Q1 - The aim: Is the aim to keep classes full?
       ➡️ Yes, the fee should stop empty places.

       ❓ Q2 - The rule: Should every member follow one rule?
       ➡️ Yes, one rule is easier to explain.

You:   Yes to Q1. No to Q2: new members get a free miss.
```

Reply "yes" to accept a recommended answer, or push back with your own. Your answers open up the next round. The interview ends when the questions run out and you confirm that you share an understanding.

```checkpoint quick-2
A recommended answer looks wrong to you. What do you do?
- [x] Push back with your own answer, and go on to the next round.
- [ ] Reply yes anyway, because a recommended answer can't be changed.
- [ ] Start the interview again, because each round allows only yes.
Why: The decision is yours. Reply "yes" to accept a recommended answer, or push back with your own, and your answers open up the next round.
```

## When to use it

Use grill-me when there's no repo under the thing you want to sharpen. For example:

- You have a plan, a design or a piece of writing to sharpen.
- You face a business decision, like that cancellation fee.
- You're working out what to do next, as Matt Pocock, the Skill's author, did when choosing what course to build.

```checkpoint quick-3
You're sharpening a talk about Docker, with no repo or code behind it. Does grill-me fit?
- [x] Yes, because there's no repo under the thing you're sharpening.
- [ ] No, because it only works on code that's already in a repo.
- [ ] No, because it needs a repo to keep its notes on your talk.
Why: grill-me is for when there's no repo under the thing you want to sharpen, and a talk is one of those things.
```

## When not to use it

- If you're working in a repo, use [grill-with-docs](/learn/grill-with-docs) instead, because it runs the same interview and also writes [`GLOSSARY.md`](/learn/one-shared-language) and ADRs (records of hard decisions). Matt calls it "strictly the better one" there.
- If the answers are in someone else's head, use [to-questionnaire](/learn/to-questionnaire) instead, because it writes questions for another person to answer.

```checkpoint quick-4
The answers you need are known only to the studio's accountant. Which Skill fits?
- [x] to-questionnaire, which writes questions for that person to answer.
- [ ] grill-me, which interviews you until the answers become clear.
- [ ] grill-with-docs, which writes `GLOSSARY.md` and ADRs as you go.
Why: An interview of you can't reach answers in someone else's head. to-questionnaire writes questions for that person to answer.
```

```diagram
type: compare
caption: "Use grill-me when there's no repo under the thing you want to sharpen."
columns: ["grill-me", "[grill-with-docs](/learn/grill-with-docs)", "[to-questionnaire](/learn/to-questionnaire)"]
rows:
  - cells: ["no repo under the thing you want to sharpen", "you're working in a repo", "the answers are in someone else's head"]
  - cells: ["nothing on disk", "also writes `GLOSSARY.md` and ADRs", "it writes questions for another person to answer"]
```

## What it needs to start

You need an idea, and it can be loose: "a vague couple of sentences" is enough. You don't need a worked-out plan, because the session exists to produce one. You need no repo, files or Issues either.

```checkpoint quick-5
You have only a rough idea, and no plan yet. Can you start grill-me?
- [x] Yes, because a vague couple of sentences is enough to begin.
- [ ] No, because it needs a worked-out plan to test in the interview.
- [ ] No, because it needs a Spec in an Issue to work from.
Why: You don't need a worked-out plan, because the session exists to produce one.
```

Only you can start it, by typing `/grill-me`. The agent never starts it on its own. Start in a fresh conversation, not on top of a plan an agent already wrote.

```checkpoint quick-6
You're telling your agent about a fuzzy plan. Will it start grill-me for you?
- [x] No. It never starts on its own, so you type /grill-me.
- [ ] Yes. It starts once it notices your plan is fuzzy.
- [ ] Yes. It starts once a fresh conversation has been opened.
Why: Only you can start grill-me, by typing /grill-me. However fuzzy your plan looks, the agent never starts it on its own.
```

## What it creates

A shared understanding between you and the agent, and nothing on disk. grill-me is **stateless**: it saves nothing between sessions. It creates no files, Issues, branches or pull requests.

If you want the project's words and hard decisions written down, that's a sign you wanted grill-with-docs.

```checkpoint quick-7
Partway through grill-me, you want the project's words and hard decisions written down. What does that tell you?
- [x] That you really wanted grill-with-docs instead of grill-me.
- [ ] That you should ask grill-me to save a summary file at the end.
- [ ] That you should restart grill-me with a more detailed plan.
Why: grill-me leaves nothing on disk. Wanting the project's words and hard decisions written down is a sign you wanted the Skill that writes them, grill-with-docs.
```

## Going deeper

### Why it exists

Say you describe a fuzzy idea to an agent. It soon hands you a tidy plan, before the two of you have agreed what the idea is.

Matt saw this in **plan mode**, a Claude Code mode where the agent explores read-only and then presents a plan. Claude Code tends to plan really early there, he says, "creating a document before we've truly understood each other."

```checkpoint quick-8
You use plan mode to explore a fuzzy idea. What problem does Matt warn about?
- [x] It writes a plan document before you truly understand each other.
- [ ] It asks so many questions that no plan document ever gets written.
- [ ] It edits your files while you're still reading the plan it wrote.
Why: In plan mode the agent explores read-only, then presents a plan. Matt's complaint is that the plan comes too early, before you've truly understood each other.
```

So grill-me forces that conversation to happen first. The agent has to ask, and you have to answer, before it writes any plan.

The habit is older than AI. Developers called it **rubber ducking**: talking an idea through until you've found all its cases. With grill-me, the agent does the asking while you talk it through.

```checkpoint quick-9
What does grill-me change about the old habit of rubber ducking?
- [x] The agent does the asking while you talk the idea through.
- [ ] The agent talks the idea through alone, so you don't need to.
- [ ] The agent finds all the idea's cases, then reports back to you.
Why: Rubber ducking is talking an idea through until you've found all its cases. You still do the talking, but with grill-me the agent does the asking.
```

### How it works underneath

**One line.** This is the Skill's whole file:

```
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Call the Skill tool with "grilling".
```

The line `disable-model-invocation: true` is a Skill setting that stops the agent starting it by itself, which is why only you can start it. The last line loads grilling through the **Skill tool**, the tool an agent calls to load a Skill. So grilling holds all the rules, and grill-me does nothing unless grilling is installed too.

```checkpoint quick-10
What does `disable-model-invocation: true` do for grill-me?
- [x] It stops the agent starting the Skill, so you start it yourself.
- [ ] It stops the Skill loading grilling, so no interview can run.
- [ ] It stops the agent reading the file, so it runs as a fixed script.
Why: It's a Skill setting that stops the agent starting the Skill by itself. The last line still loads grilling, once you've typed /grill-me.
```

**Where the rules used to live.** In March 2026, grill-me held the interview itself. Its body began: "Interview me relentlessly about every aspect of this plan until we reach a shared understanding." Questions came one by one. By then Matt had added a line asking for a recommended answer to each question. It was for speed: you accept the recommendation with one word, instead of explaining everything.

```checkpoint quick-11
Why does each question come with a recommended answer?
- [x] For speed, because you can accept it instead of explaining everything.
- [ ] For safety, because the agent then can't decide anything by itself.
- [ ] For length, because every answer then fits on one short line.
Why: Matt added the recommended answer for speed. You accept it with one word, instead of explaining everything.
```

Today a reworded form of that text lives in grilling, and it asks in rounds. So old posts show the history, and the current files decide how it runs. You can still get one question at a time. Add `When grilling, ask one question at a time.` to the [`CLAUDE.md` in your home folder](/learn/instruction-files) (`~/.claude/CLAUDE.md`), which applies to every project.

**The design tree.** Grilling follows a [design tree](/learn/grill-before-you-build), an idea from a book: _The Design of Design_ by Frederick P. Brooks. Each decision opens the next ones. Matt's example is a search page, where you choose between advanced search and a text box. Choose advanced search, and now you must settle its filters and sorting. You keep walking the branches until you understand the whole design, before you commit to code.

```checkpoint quick-12
In Matt's search page, you choose advanced search. What happens next?
- [x] That choice opens new decisions, its filters and its sorting.
- [ ] The design is finished, because the one big decision is now made.
- [ ] The text box gets filters and sorting too, as it's on the same tree.
Why: Each decision opens the next ones. Choosing advanced search means you now have to settle its filters and sorting.
```

**The model's knowledge.** Grilling depends on what the model already knows about how systems break. So the model matters more here than for most Skills: use your best one.

**The same habit with no Skill.** Anthropic's Claude Code guide gives the bare version: when you don't know exactly what you want yet, ask Claude to interview you. Its example starts: "I want to add rate limiting to the public API but haven't thought it through yet." grill-me packs that habit, plus the design tree and the recommended answers, into one typed command.

### A real example

In a post from March 2026, Matt describes adding a feature to his course video editor with grill-me. Claude asked him 16 questions. He calls that a relatively short session. On really complex features, he's had 30, 40 or even 50 questions, lasting nearly half an hour.

So a long interview isn't a fault in itself. Today's Skill asks in rounds, so Matt now measures those instead: "Count rounds, not questions. Forty-six questions across four rounds is an ordinary session."

```checkpoint quick-13
Your session reached 46 questions across four rounds. What does that tell you?
- [x] Nothing's wrong, because you count rounds, and four is ordinary.
- [ ] The scope is too large, because rounds should hold fewer questions.
- [ ] The session ran too long, because four rounds is too many.
Why: A long interview isn't a fault in itself. Forty-six questions across four rounds is an ordinary session, so Matt measures rounds, not questions.
```

### Where it goes wrong

**You agreed to all forty questions.** Matt's main warning is **passivity**: you come out with "a plan the agent wrote and you nodded at". It feels productive because it was long. But you decided nothing, and the result looks more certain than it is.

The fix is to steer. Push back on a question, and answer "I don't know" when you don't. Say when the **scope**, how large a thing you're grilling, is drifting. A session with no pushback from you is a session you didn't need.

```checkpoint quick-14
You notice you've said yes to every question so far. What should you do?
- [x] Steer, by pushing back and saying when the scope is drifting.
- [ ] Keep agreeing, because a session with no pushback is the goal.
- [ ] Say nothing new, because the agent owns the scope of the session.
Why: Steering is the fix for passivity. Push back, say when the scope is drifting, and answer "I don't know" when you don't. A session with no pushback is one you didn't need.
```

**The agent asked 200 questions.** One user reported this from Codex, OpenAI's coding agent, and asked for a limit on questions. That request was closed as not planned. Usually the scope was too large. Ask the agent to break the work into smaller pieces first, then grill each one.

```checkpoint quick-15
Your session has reached 200 questions, with no end in sight. What do you do?
- [x] Ask the agent to break the work into smaller pieces, then grill each.
- [ ] Ask the Skill's author for a question limit, which is on its way.
- [ ] Keep going, because the Skill is built to ask at least 200.
Why: Two hundred questions usually means the scope was too large. Break the work into smaller pieces first, then grill each one.
```

Matt's reminder in that thread: you're the one in charge, so use the questions as a prompt to give more information. "It's a conversation, not an exam."

**You keep guessing, and the agent keeps rephrasing.** Some questions can't be settled by talk, such as "One long form or three pages?" Matt calls them **ungrillable**, because you need something to react to first. Stop grilling. Build the throwaway version with [prototype](/learn/prototype), look at it, then come back and answer in one line.

```diagram
type: chain
caption: "Stop grilling."
steps:
  - "Stop grilling."
  - "Build the throwaway version"
  - "look at it"
  - "then come back and answer in one line"
```

**The agent writes a plan instead of asking.** Plan mode may be on, and it "makes the agent hurry to produce a plan, when you want it to keep asking questions." Leave plan mode off. A weaker model can stop after a couple of questions.

**The questions come all at once, with no recommended answers.** grilling didn't load, so the agent is improvising. Ask whether it loaded grilling. With no Skill tool, tell it to read grilling's `SKILL.md`.

**You're about to clear the session before writing the Spec.** Don't. The value of the session is the context you built in it. If your idea turns out to be software, hand the same conversation straight to [to-spec](/learn/to-spec).

```checkpoint quick-16
The grilling is done, and your idea turned out to be software. What comes next?
- [x] Hand the same conversation to to-spec, with its context.
- [ ] Clear the session first, so that the Spec starts clean.
- [ ] Write the Spec yourself, using your notes of the session.
Why: The value of the session is the context you just built, so clearing it throws that away. Hand the same conversation straight to to-spec.
```

**The questions feel pointless.** Your model may be a weak fit. One user reports that GPT, OpenAI's model, run in Codex, takes the interview too literally and "asks a lot of BS questions". Claude felt smart to them. That's one user's report, not Matt's. Matt's own advice is to grill with your best model.

### Try it

You'll need your practice project, the yoga-studio booking site you build for real in your own repo, with Matt's Skills installed. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

You'll sharpen a business decision that no code depends on yet. You're in the repo because Matt's Skills are installed there. Being there also lets `git status` show you, at the end, that the session saved nothing.

1. Open the `yoga-studio` repo in Claude Code, in a fresh conversation, with plan mode off.
2. Type `/grill-me Should the studio charge for late cancellations? I haven't thought it through.` You should see numbered questions, each with a recommended answer.
3. Reply to each question. Type "yes" to accept a recommendation, and push back on at least one.
4. Read the next round. You should see questions opened up by your answers.
5. Keep answering until no questions are left. Confirm that you share an understanding, and tell it to build nothing.
6. In a second terminal, in the `yoga-studio` folder, run `git status --short`. You should see nothing new from the session.

Once the decision touches the site's code, that's a job for [grill-with-docs](/learn/grill-with-docs).

### Read more

- [The /grill-me Skill](https://www.aihero.dev/skills-grill-me), Matt Pocock, updated 2026-08-24
- [My 'Grill Me' Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral), Matt Pocock, 2026-03-23
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16
- [Codex just asked me 200 questions (issue #44)](https://github.com/mattpocock/skills/issues/44), opened by DoozyDoz on mattpocock/skills, 2026-04-19
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint grill-me-deeper-said-agreed
A friend ran a grill-me session about a class waitlist. They answered "agreed" to all forty questions and say the plan must be solid because the session was so long. Why is that the wrong conclusion?
- [x] They decided nothing, so it's the agent's plan and only looks certain.
- [ ] Forty questions is too few, since a real session needs at least two hundred.
  > Two hundred questions is a sign the scope was too large, not a target.
- [ ] Agreeing is fine, but a stateless session forgets the plan once it ends.
  > Length and memory aren't the problem. Passivity is: nodding along means they decided nothing.
Why: A long session feels productive, but length proves nothing. With no pushback, they decided nothing: it's a plan the agent wrote and they nodded at, and it looks more certain than it is.
```

## Remember

```flashcards
Q: What does grill-me create?
A: A shared understanding, and nothing on disk.

Q: Which Skill does grill-me call?
A: grilling, which runs the interview.

Q: When do you use grill-me instead of grill-with-docs?
A: When there is no repo under the thing you want to sharpen. In a repo, use grill-with-docs.

Q: Where does the "design tree" in grill-me come from?
A: Frederick P. Brooks's book The Design of Design.

Q: A grill-me session asks you 200 questions. What usually went wrong, and what's the fix?
A: The scope was too large. Ask the agent to split the work into smaller pieces first, then grill each one.

Q: After a grill-me session about software, do you start a fresh session before writing the Spec?
A: No. The value is the context you just built, so hand the same conversation straight to to-spec.

Q: Why does Matt say to leave plan mode off for grill-me?
A: Plan mode makes the agent hurry to produce a plan, when you want it to keep asking questions.
```

## Final test

```final-test grill-me-what-it-does
What does grill-me do?
- [x] It hands over to the grilling Skill.
- [ ] It writes a Spec from your plan.
- [ ] It builds a throwaway version of your idea.
Why: Its whole body is one line that calls grilling, and grilling runs the interview. It writes no Spec and builds nothing, because all it leaves you with is a shared understanding.
```

```final-test grill-me-in-a-repo
You are working in a repo and want to be interviewed about a plan. Which Skill should you use?
- [x] grill-with-docs
- [ ] grill-me
- [ ] to-questionnaire
Why: grill-with-docs and grill-me run the same interview, but in a repo grill-with-docs also leaves a paper trail. That makes it the better one, and grill-me is for when there is no repo under the plan. to-questionnaire is for answers you don't hold, and here they're yours.
```

```final-test grill-me-what-it-saves
What does grill-me save to disk?
- [x] Nothing.
- [ ] A GLOSSARY.md and ADRs.
- [ ] A Markdown file of findings.
- [ ] A Spec in the Issue tracker.
Why: grill-me is stateless: it saves nothing locally and builds no GLOSSARY.md. The only result is a clearer idea in your head, which is why it needs no repo.
```

```final-test grill-me-deeper-passivity
Which failure does Matt name as the main risk of a grill-me session?
- [x] Passivity, agreeing to forty questions and leaving with a plan the agent wrote.
- [ ] Asking too few questions, so the agent starts building after only one round.
- [ ] Saving the answers to disk, so later sessions read an out-of-date plan.
Why: Matt calls it passivity: answering "agreed, agreed, agreed" for forty questions. It feels productive because it was long, but you decided nothing, so the result looks more certain than it is.
```

```final-test grill-me-deeper-ungrillable
Mid-session you're asked "One long form or three pages?" and can't answer by talking. What does Matt advise?
- [x] Stop grilling, build a throwaway version, look at it, then answer in one line.
- [ ] Keep answering in later rounds until the agent rephrases it into a clearer question.
- [ ] Clear the context and start a new grill-me session focused on that one question.
Why: More talk can't settle a question like this, because you need something to react to first. Matt calls it ungrillable. So stop, build the throwaway version with prototype, look at it, then come back and answer in one line.
```

```final-test grill-me-no-repo-yet
You want to choose where to host a FastAPI side project. Nothing is written down and there is no repo yet. You want an agent to question you hard until the plan is clear. Which fits best?
- [x] Get interviewed about the plan, with nothing saved.
  > Right: that's `/grill-me`.
- [ ] Get interviewed while a GLOSSARY.md and ADRs are written.
  > That's `/grill-with-docs`. There is no repo to keep a GLOSSARY.md or ADRs in.
- [ ] Write a questionnaire for someone else to fill in.
  > That's `/to-questionnaire`. The answers are in your head, so you can be interviewed directly.
- [ ] Build a throwaway program to try out the idea first.
  > That's `/prototype`. There is no single design question yet that throwaway code would answer.
Why: Nothing is written down and no repo exists, so an interview that saves nothing is all you need. grill-with-docs has nowhere to keep its files yet, and a prototype needs a clear question first.
```

```final-test grill-me-repo-is-open
You have the repo for your Next.js website open. You want an agent to interview you about a plan to add a booking form, one round of questions at a time. Which fits best?
- [x] Get interviewed while a GLOSSARY.md and ADRs are written.
  > Right: that's `/grill-with-docs`.
- [ ] Get interviewed one round at a time, with nothing saved.
  > That's `/grill-me`. It runs the same interview but saves nothing. In a repo, the version that leaves a paper trail is strictly better.
- [ ] Write a questionnaire for someone else to fill in.
  > That's `/to-questionnaire`. You hold the answers yourself.
Why: Both run the same interview, so you give nothing up. With a repo open, the words and hard decisions you settle can be kept in it, so the one that leaves a paper trail wins.
```

```final-test grill-me-answers-elsewhere
You are planning a Docker setup for a client's web app. There is no repo yet. The memory and disk limits of the client's server are known only to their operations lead, and you can't answer them yourself. Which fits best?
- [x] Write questions for the operations lead to answer.
  > Right: that's `/to-questionnaire`.
- [ ] Get interviewed about the server limits, with nothing saved.
  > That's `/grill-me`. It interviews you about the subject, but you don't hold these answers.
- [ ] Get interviewed while a GLOSSARY.md and ADRs are written.
  > That's `/grill-with-docs`. There is no repo, and the answers aren't yours to give.
Why: An interview only draws out what you know, and the operations lead holds these answers. A questionnaire takes the questions to the person who can answer them.
```

```final-test grill-me-why-talk-first
You have an idea for an AI agent that answers questions about a client's SQL database. There is no repo yet. Before anyone writes code, you spend half an hour answering an agent's questions about the idea. A friend says this wastes time. Why do the questions come first?
- [x] So you and the agent share one understanding before any code.
- [ ] So the agent can save the plan as a GLOSSARY.md and ADRs.
  > With no repo, this interview is stateless and saves nothing locally. The point is the shared understanding.
- [ ] So the agent can choose the database and the framework for you.
  > The decisions are yours. The agent puts each one to you and waits.
Why: The questions bring out what would otherwise stay silently assumed. So the interview goes on until you reach a shared understanding, and the agent doesn't act until you confirm it.
```

```final-test grill-me-deeper-one-form-or-three
In a fresh grill-me conversation, you're being interviewed about a sign-up flow for a yoga studio. Round three asks "One long form or three pages?" You keep guessing, the agent keeps rephrasing, and the scope grows with every answer. What do you do next?
- [x] Pause the interview and build a throwaway version to look at.
  > Right: that's `/prototype`.
- [ ] Keep answering in the same stateless interview until no questions are left.
  > That's `/grill-me`. This is an ungrillable question. Talking it through is what makes sessions grow too long.
- [ ] Move the interview into a repo so the answers are saved as ADRs.
  > That's `/grill-with-docs`. Saving answers doesn't help. You still need something to react to before you can answer.
Why: You can't settle a form's layout by talk, because you need something to react to. That's why the guessing and rephrasing keep going. So stop grilling, build the throwaway version with prototype, look at it, then come back and answer in one line.
```

```sources
- [grill-me: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grill-me/SKILL.md), Matt Pocock's Skills
- [grill-me: agents/openai.yaml](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grill-me/agents/openai.yaml), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [to-questionnaire: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/to-questionnaire/SKILL.md), Matt Pocock's Skills
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05 (updated)
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic (Claude Code Docs)
- [My 'Grill Me' Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral), Matt Pocock, 2026-03-23
- [The /grill-me Skill](https://www.aihero.dev/skills-grill-me), Matt Pocock, 2026-08-24
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices), Anthropic
- [9 Things People Get Wrong With /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs), Matt Pocock, 2026-05-25
- [Codex just asked me 200 questions · Issue #44 · mattpocock/skills](https://github.com/mattpocock/skills/issues/44), DoozyDoz, 2026-04-19
- [The /grilling Skill](https://www.aihero.dev/skills-grilling), Matt Pocock
- [Remove the harness-specific Skill tool dependency from grill-me and grill-with-docs · Issue #1123 · mattpocock/skills](https://github.com/mattpocock/skills/issues/1123), gfucci, 2026-09-24
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), Matt Pocock
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [prototype: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md), Matt Pocock's Skills
```
