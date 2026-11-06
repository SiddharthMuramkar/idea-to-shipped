---
title: grill-with-docs: the interview that writes things down
slug: grill-with-docs
summary: How Matt Pocock's grill-with-docs Skill interviews you about an idea in a repo, and writes down the words and hard decisions you settle.
---

## What it's for

Say you and your agent work out what a "hold" on a seat means for your yoga-studio booking site. The next session knows none of it, so you explain it all again.

**grill-with-docs interviews you about an idea, and writes down the words and the hard decisions you settle as you go.**

It calls two other [Skills](/learn/skills). [grilling](/learn/grilling) runs the interview that [grill before you build](/learn/grill-before-you-build) describes. [domain-modeling](/learn/domain-modeling) settles the project's words and records its hard decisions.

```checkpoint quick-1
You run grill-with-docs and the questions start. Which Skill is running the interview?
- [x] grilling, which grill-with-docs calls to ask the questions.
- [ ] domain-modeling, which also records your hard decisions.
- [ ] grill-with-docs alone, with no other Skill involved.
Why: grill-with-docs calls two other Skills. grilling runs the interview, and domain-modeling settles the project's words and records its hard decisions.
```

```diagram
type: tree
caption: "It calls two other Skills."
root:
  label: "grill-with-docs"
  note: "interviews you about an idea"
nodes:
  - label: "[grilling](/learn/grilling)"
    note: "runs the interview"
    children:
      - label: "your shared understanding of the idea"
        note: "stays in the conversation"
  - label: "[domain-modeling](/learn/domain-modeling)"
    note: "settles the project's words and records its hard decisions"
    children:
      - label: "`GLOSSARY.md`"
        note: "the project's agreed words"
      - label: "ADRs"
        note: "records of hard decisions, in `docs/adr/`"
```

One round on a waitlist might look like this:

```
You:   /grill-with-docs Add a waitlist so an account can
       queue for a full class.

Agent: ❓ Q1 - Account: "Account" could mean member or login.
       Should "Member" mean the person who pays?
       ➡️ Yes.

       ❓ Q2 - Freed seats: Should the first person waiting
       get a hold on a freed seat?
       ➡️ Yes.

You:   Yes to both.

Agent: Added "Member" and "Hold" to GLOSSARY.md. Next round...
```

The agent maps the idea as a [design tree](/learn/grill-before-you-build): a map of decisions, each branching into the ones depending on it. The interview ends when every branch is visited and nothing is left silently assumed. Even then, the agent doesn't act until you confirm you share an understanding.

```checkpoint quick-2
Every branch has been visited and nothing is assumed. What must happen before the agent acts?
- [x] You confirm that you share an understanding.
- [ ] It writes the code, then asks you to check it.
- [ ] It opens a Ticket for every decision you settled.
Why: The interview ends when nothing is left to ask. Even then, the agent waits until you confirm you share an understanding.
```

## When to use it

- You have an idea and a repo. grill-with-docs is the first step of the [main flow](/learn/main-flow).
- You're starting a change, like that waitlist, and its words aren't settled yet.

```checkpoint quick-3
You have an idea for the booking site, and a repo to work in. Which Skill do you start with?
- [x] grill-with-docs, the main flow's first step.
- [ ] to-spec, which writes the idea up as a Spec.
- [ ] to-tickets, which splits the idea into Tickets.
Why: You have an idea and a repo, so you start at the first step. grill-with-docs comes first because the Spec and Tickets need a sharpened idea to build on.
```

## When not to use it

- If you have no repo, only a plan or a piece of writing, use [grill-me](/learn/grill-me) instead, because it runs the same grilling and saves nothing. With a repo, grill-with-docs is better: it leaves files behind in the repo.
- If your effort is too big and foggy for one session, use [wayfinder](/learn/wayfinder), a planning Skill that charts the decisions first.
- If talk can't settle a question, detour through [prototype](/learn/prototype), then come back.

```checkpoint quick-4
You want to sharpen a plan, and there's no repo under it. Which Skill fits?
- [x] grill-me, which runs the same grilling and saves nothing.
- [ ] grill-with-docs, which leaves a paper trail in the repo.
- [ ] wayfinder, which charts the decisions before anything else.
Why: With no repo, there's nowhere to leave a paper trail, so grill-me fits. With a repo, grill-with-docs is the better of the two.
```

## What it needs to start

You need an idea and a **working directory**: the folder your agent works in, usually a repo. [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) should already have run. `GLOSSARY.md` and `docs/adr/` don't need to exist yet.

```checkpoint quick-5
Your repo has no GLOSSARY.md and no docs/adr/ folder. Can you start grill-with-docs?
- [x] Yes. With setup run, neither one needs to exist yet.
- [ ] No. You have to create an empty GLOSSARY.md first.
- [ ] No. setup-matt-pocock-skills has to create both first.
Why: You need an idea and a working directory, with setup already run. The files themselves can wait until there's something to write in them.
```

Only you can start it, by typing `/grill-with-docs`.

## What it creates

It creates two kinds of file, each only when there's something to write.

`GLOSSARY.md` holds [the project's agreed words](/learn/one-shared-language). The agent writes each one the moment it's settled, with no implementation details: how the code works, like which endpoint (the web address your app calls) returns what. For example:

```
**Hold**:
A seat kept for the first member waiting.
_Avoid_: reservation
```

```checkpoint quick-6
During the interview you settle which endpoint returns a 409, the error code for a conflict, like a booking for a full class. Does that go in GLOSSARY.md?
- [x] No. It holds the project's words, with no implementation details.
- [ ] Yes. It holds every answer you give at any point in the interview.
- [ ] Yes, as long as the entry stays short enough to read in one go.
Why: GLOSSARY.md is for the project's agreed words. Which endpoint returns what is an implementation detail, so it doesn't belong there.
```

ADRs (architectural decision records) go in `docs/adr/`: short files, each recording one hard decision. The agent offers one only when a decision is hard to reverse, surprising without context and the result of a real trade-off.

```checkpoint quick-7
You pick between two libraries, and swapping later would be easy. Will the agent offer an ADR?
- [x] No. A decision has to be hard to reverse, among other things.
- [ ] Yes. Every decision in the whole interview gets its own ADR.
- [ ] Yes. Any choice between two options counts as a trade-off.
Why: All three must be true. The decision must be hard to reverse, surprising without context and the result of a real trade-off.
```

Everything else you decide stays in the conversation, along with your shared understanding of the idea. So keep working in that same session through the Spec and Tickets, the written plan and its small tasks. If the build fits in what's left of the session, skip those and go straight to [implement](/learn/implement).

## Going deeper

### Why it exists

A grilling settles a lot, but on its own it leaves nothing behind. Matt Pocock, who wrote these Skills, hit this when he used grill-me for coding. He puts the gap this way: "we would actually land on some really good shared language and then that wasn't documented anywhere." So each new session, he re-explained the code and the problem before any real work.

```checkpoint quick-8
What sent Matt looking for more than grill-me when he was coding?
- [x] Good words weren't written down, so he re-explained things each session.
- [ ] The interview asked too few questions to settle a design properly each time.
- [ ] The agent wrote too many planning files into each of his repos as it went.
Why: He and the agent would land on good shared language, but nothing kept it. So he had to explain the code and the problem all over again.
```

He went looking for the smallest layer of documentation that would give the agent a head start. His first answer was a separate Skill, the ubiquitous language skill. He ran it beside grill-me, then combined the two. So grill-with-docs is the same interview, with the words kept in the repo. In April 2026 the old Skill was merged into it, and its job now sits in domain-modeling.

```checkpoint quick-9
Which two Skills did Matt combine to make grill-with-docs?
- [x] grill-me and the ubiquitous language skill.
- [ ] grill-me and a Skill that writes the Spec.
- [ ] wayfinder and the ubiquitous language skill.
Why: His first answer was a separate Skill, the ubiquitous language skill. He ran it beside grill-me, then combined the two into grill-with-docs.
```

Later, version 1.3 of the Skills renamed the glossary file: `CONTEXT.md` became `GLOSSARY.md`. To rename an old file, run `git mv CONTEXT.md GLOSSARY.md`.

```diagram
type: chain
caption: "He ran it beside grill-me, then combined the two."
steps:
  - parallel: ["grill-me", "the ubiquitous language skill"]
  - "grill-with-docs"
  - "`CONTEXT.md` became `GLOSSARY.md`"
```

### How it works underneath

The idea is older than AI agents. **Ubiquitous Language** is Eric Evans's term, from his book _Domain-Driven Design_. It means developers and the people they build for share one precise set of words. It has to be precise, as Martin Fowler explains, "since software doesn't cope well with ambiguity".

Matt applies the idea to agents. The code, the developers and the **domain experts** (people who know what you're building, but not how) should all use the same words. Say the studio owner tells you a hold looks wrong. You know what they mean, and the code uses the same word.

Matt names three payoffs:

- The agent's replies get shorter.
- It uses fewer **tokens** (small pieces of text, roughly part of a word) when it thinks.
- The code gets easier to navigate, because it uses the same words.

```checkpoint quick-10
Your project has a shared language. Which payoff should you expect?
- [x] The agent uses fewer tokens when it thinks.
- [ ] The agent writes longer, more careful replies.
- [ ] The words stay out of the code the agent writes.
Why: Matt names three payoffs. Replies get shorter, the agent uses fewer tokens when it thinks, and the code gets easier to navigate because it uses the same words.
```

The words reach the code, so they're worth getting right. Matt warns: "this is going to affect every part of the code that's generated." ADRs do the same job for decisions: a written record stops the agent suggesting the same bad idea again.

This is the Skill's whole file:

```
---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

Call the Skill tool twice, for "grilling" and "domain-modeling".
```

The line `disable-model-invocation: true` is why only you can start it. The last line loads the two Skills through the **Skill tool**, the tool an agent calls to load a Skill. So installing grill-with-docs alone gets you a Skill that doesn't work.

```checkpoint quick-11
You see `disable-model-invocation: true` in a Skill's file. What does it mean for you?
- [x] Only you can start the Skill; the agent won't.
- [ ] Only the agent can start the Skill; you can't.
- [ ] The Skill can't load any other Skill when it runs.
Why: That line is why only you can start grill-with-docs. The Skill can still load others, which is what its last line does.
```

The glossary file's name matters too. Matt renamed it because `CONTEXT.md` "was too vague. It did not make the agent pull the file in at the right moments".

```checkpoint quick-12
Why did Matt rename CONTEXT.md to GLOSSARY.md?
- [x] The old name didn't make the agent pull the file in at the right moments.
- [ ] The old name clashed with a file that Claude Code reads in every session.
- [ ] The old file had grown too long for an agent to read all in one go.
Why: Matt found the old name too vague. A name that says what the file is helps the agent pull it in at the right moments.
```

Not everyone agrees a glossary improves how the agent works. The strongest objection is that a term and its plain-English expansion may get the same result. Matt's own page on the Skill concludes: "On that view the glossary is still valuable, but the value goes to the humans."

### A real example

In a May 2026 video, Matt plans "pitches" for his course app of courses, lessons and videos. A pitch is the packaging for a video: its title and description.

He runs grill-with-docs. First, the agent reads the existing glossary, where "Standalone video is already defined". It raises a clash with pitches before going further.

```checkpoint quick-13
You're adding a new word to a repo that has a glossary. What does the agent do before going further?
- [x] It reads the glossary and raises any clash with the new word.
- [ ] It skips the glossary, since a new word can't be in it yet.
- [ ] It writes the code first, and sorts the names out afterwards.
Why: In Matt's run, the agent read the glossary first, found standalone video already defined, and raised the clash with pitches before going further.
```

Then come the questions, each settled before the next. Matt agrees that one pitch can hold many standalone videos. A pitch's status can be idle, scheduled or shipped. A pitch can exist with zero videos. For deletes, he chooses `on delete restrict`: the database refuses to delete a record while other records still point to it.

Then he asks the agent to save what they have so far. The file gains entries for the pitch and its status. (Today it asks in rounds and writes terms as they settle.) That file is called `GLOSSARY.md` today. One new term reads awkwardly, but he stops anyway: "I'm going to say that's good enough."

The agent settles the words before the implementation details, and those words reach as far as how deletes work.

### Where it goes wrong

**Every question comes at once, with no recommendations, and `GLOSSARY.md` never appears.** The two Skills didn't load, the most-reported problem with this Skill. An agent that misses them guesses at what grilling means. If only grilling loads, you get a good interview with no paper trail.

```checkpoint quick-14
The agent asks everything at once, with no recommendations. What's the likely cause?
- [x] The two Skills it relies on didn't load.
- [ ] GLOSSARY.md doesn't exist yet in the repo.
- [ ] You typed your idea after the Skill's name.
Why: The file's body is one line that loads two Skills. An agent that misses them guesses at what grilling means, so the rounds and recommendations disappear.
```

Version 1.3 tackled the cause: "A skill that names another skill in prose does not reliably load it." So the file now says to call the Skill tool. But Codex, another coding agent, reports that it has none.

Ask the agent which Skills it loaded. If it skipped one, name it. With no Skill tool, tell it to read both `SKILL.md` files.

**Most of what you decided isn't in any file.** Matt calls this "the most serious open complaint about the skill". The glossary isn't a Spec and most answers don't earn an ADR, so they stay in the conversation. Keep the session and hand it to [to-spec](/learn/to-spec). Then check the Spec against your own answers.

```checkpoint quick-15
Your grill-with-docs session is ending. Where do most of your decisions live?
- [x] In the conversation, until you hand it to to-spec.
- [ ] In GLOSSARY.md, with one entry for each decision.
- [ ] In docs/adr/, with one ADR for each decision.
Why: The glossary isn't a Spec and most answers don't earn an ADR. So keep the session, hand it to to-spec, and check the Spec against your answers.
```

**`GLOSSARY.md` fills up with plans.** An agent can write every answer into it, in the shape of a term. Several users saw this, not only with Codex. The file should hold words only. Matt's fix, with today's file name, is to say `/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it`.

```checkpoint quick-16
Your GLOSSARY.md now says which endpoint returns a 409. What do you tell grill-with-docs?
- [x] Make it more concise and remove any implementation details.
- [ ] Move each of those answers out into an ADR of its own.
- [ ] Delete the file and run the whole interview from scratch.
Why: The file should hold words only. Matt's fix is to ask the Skill to make it more concise and remove any implementation details.
```

**The session ran, but no files appeared.** Nothing may have qualified: a change with no new words has no term to write, and most decisions don't earn an ADR. There's also a real bug. When the Skill runs as a step inside another tool, users report that the interview runs but the file-writing half silently doesn't. In that setup, check the working directory before you trust the result.

### Try it

You'll need your practice project, the yoga-studio booking site, with setup already run. If you haven't set it up, do "Try it: set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. In the `yoga-studio` folder, start Claude Code: `claude`.
2. Type `/grill-with-docs Add a waitlist for full yoga classes.` You should see numbered questions, each with a recommended answer.
3. Answer the round. Type "yes" to accept a recommendation, or say what you'd change.
4. In a second terminal, in the `yoga-studio` folder, run `git status --short`. Once a term is settled, you should see `GLOSSARY.md` listed: `??` if the file is new, `M` if it was already there.
5. Run `cat GLOSSARY.md`. You should see each term with one or two sentences and no implementation detail.
6. Keep answering until the questions run out. Then confirm you share an understanding.
7. In the same session, run `/to-spec`. If it asks about seams (where tests watch the feature), say yes. You should see a new Spec on your Issue tracker.
8. Check the Spec against the answers you gave.

If the questions come with no recommended answers, or `git status --short` never lists `GLOSSARY.md`, ask the agent which Skills it loaded.

### Read more

- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), Matt Pocock, updated 2026-08-24
- [I stopped using /grill-me for coding. Here's what I use instead](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock, video, 2026-05-14
- [Skills Changelog: Ubiquitous Language -> /grill-with-docs](https://www.aihero.dev/skills/skills-changelog-ubiquitous-language-grill-with-docs), Matt Pocock, 2026-04-30
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, updated 2026-10-05
- [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html), Martin Fowler, 2006-10-31
- [grill-with-docs: GLOSSARY.md (formerly CONTEXT.md) gets used as a plan and churns mid-round (#130)](https://github.com/mattpocock/skills/issues/130), AKuederle, 2026-05-04
- [Remove the harness-specific Skill tool dependency from grill-me and grill-with-docs (#1123)](https://github.com/mattpocock/skills/issues/1123), gfucci, 2026-09-24

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint grill-with-docs-deeper-no-skill-tool
In Codex CLI you start the interview that keeps a glossary, to plan a waitlist for your booking API. The agent lists fifteen questions, gives no recommended answer for any of them and never mentions GLOSSARY.md. Why?
- [x] Its one-line SKILL.md loads grilling and domain-modeling through a Skill tool, and Codex has none.
- [ ] Codex can't show numbered rounds, so the agent falls back to listing every question in one message.
  > Nothing reports that. Missing recommended answers mean grilling never loaded; a healthy round asks many questions at once, each with a recommendation.
- [ ] No GLOSSARY.md exists yet, and the interview needs one before it can give recommended answers.
  > The glossary is created lazily, when the first term settles. A missing file at the start is normal.
Why: The Skill is one line that loads two others through a Skill tool. Codex has none, so neither loads, and the agent guesses at what grilling means. You get every question at once, with no recommendations and no glossary. The workaround is to tell the agent to read both SKILL.md files and follow them.
```

## Remember

```flashcards
Q: What does grill-with-docs create?
A: A shared understanding of the idea, plus GLOSSARY.md entries as terms settle, and an ADR only for a decision that is hard to reverse, surprising and a real trade-off.

Q: Which two Skills does grill-with-docs call?
A: grilling (the interview) and domain-modeling (the Glossary and ADRs).

Q: When do you use grill-me instead of grill-with-docs?
A: When there's no working directory (no repo) to leave a paper trail in.

Q: When is a grilling interview done?
A: When every branch of the design tree has been visited, nothing is silently assumed, and you confirm you share an understanding.

Q: Which Skill was merged into grill-with-docs in April 2026?
A: Matt's ubiquitous language skill. He had been running it beside grill-me, so he combined the two. Its job now sits in domain-modeling.

Q: What was GLOSSARY.md called before version 1.3 of the Skills, and why was it renamed?
A: CONTEXT.md. Matt found the name too vague. It didn't make the agent pull the file in at the right moments.

Q: Will an agent start grill-with-docs on its own?
A: No. Its SKILL.md sets `disable-model-invocation: true`, so you type `/grill-with-docs` yourself.
```

## Final test

```final-test grill-with-docs-two-skills
Which two Skills does grill-with-docs call?
- [x] grilling and domain-modeling.
- [ ] grill-me and to-spec.
- [ ] grilling and prototype.
- [ ] wayfinder and domain-modeling.
Why: Its body is one line that calls both. grilling runs the interview, and domain-modeling settles the words and records the hard decisions. That's how one Skill can question you and write files too.
```

```final-test grill-with-docs-vs-grill-me
What does grill-with-docs do that grill-me doesn't?
- [x] It keeps what it learns in the repo's Glossary and ADRs.
- [ ] It runs a shorter interview, ending once the key terms are set.
- [ ] It writes the code once the interview has settled the plan.
- [ ] It works without a repo, so you can use it for any plan.
Why: Both run the same grilling. The difference is what's left afterwards. grill-me saves nothing, while grill-with-docs writes the words and the hard decisions into the repo for later sessions.
```

```final-test grill-with-docs-adr-when
When does grill-with-docs offer to write an ADR?
- [x] When a decision is hard to reverse, surprising, and a real trade-off.
- [ ] For each decision the interview settles, so none is lost later.
- [ ] Once, at the end, as a single record of the whole interview's decisions.
Why: All three must be true, which keeps ADRs rare. If a decision is easy to reverse, you can swap it later, so it isn't worth a record. If any of the three is missing, the ADR is skipped.
```

```final-test grill-with-docs-deeper-origin
Why did Matt build grill-with-docs on top of grill-me?
- [x] Good shared language from the interviews wasn't written down, so he re-explained the domain each time.
- [ ] grill-me asked too many questions per round, so he wanted shorter rounds once a repo was there.
- [ ] grill-me couldn't read the code, so he wanted an interview that looks facts up in the repo first.
- [ ] grill-me wrote too many planning files, so he wanted an interview that keeps only one glossary.
Why: Matt and the agent would land on good words, but nothing kept them, so each session he re-explained the code and the problem. Combining grill-me with his ubiquitous language skill put the interview and the writing-down in one Skill.
```

```final-test grill-with-docs-deeper-skill-tool
What did version 1.3 of the Skills change to tackle the most-reported problem with grill-with-docs?
- [x] Its SKILL.md calls the Skill tool for grilling and domain-modeling, instead of naming them in prose.
- [ ] The agent now starts grill-with-docs on its own whenever you describe a plan or a design in your repo.
- [ ] grilling and domain-modeling were copied into one SKILL.md file, so no other file has to load.
- [ ] The interview now asks one question at a time, so it can't dump every question on you at once.
Why: A Skill that only names another Skill in prose doesn't reliably load it, and that caused the problem. So the file now says "Call the Skill tool twice". On an agent with no Skill tool, like Codex, it can still fail.
```

```final-test grill-with-docs-waitlist-words
You want to add waitlists to the FastAPI backend of your class-booking website. The idea fits in one session, but it's still vague, and you want the words you settle on, like what a "hold" on a seat is, kept in the repo for later sessions. Which fits best?
- [x] Get interviewed about the idea, with settled terms saved in the repo.
  > Right: that's `/grill-with-docs`.
- [ ] Get interviewed about the idea, keeping the answers in this chat.
  > That's `/grill-me`. It's the same interview, but stateless. You're in a repo that could keep the words, so you'd lose them for nothing.
- [ ] Chart the waitlist decisions as a shared map of decision tickets on the tracker.
  > That's `/wayfinder`. That's for an effort too big and foggy for one session. This idea fits in one.
Why: You're in a repo and the idea fits in one session, so the interview that leaves a paper trail is the better one. Settled terms go into GLOSSARY.md, so later sessions start with the same words.
```

```final-test grill-with-docs-email-agent
You want your AI agent to sort incoming support emails. You're in its repo, no code is written yet, and you haven't yet decided what it should do with an email that is half refund request, half bug report, or what "resolved" means. Which fits best?
- [x] Get interviewed until every question is settled, with terms saved.
  > Right: that's `/grill-with-docs`.
- [ ] Build throwaway code to see how the agent handles a mixed email.
  > That's `/prototype`. These are decisions for you to make, and you can settle them by talking. A prototype is the detour for a question that needs a runnable answer.
- [ ] Write the email-sorting idea up as a Spec on the issue tracker now.
  > That's `/to-spec`. to-spec turns the conversation into a Spec, and nothing is settled yet to turn.
Why: Nothing is settled yet, and each open question is a decision you can make by talking. So an interview comes first. A prototype is only for a question talk can't settle, and the Spec comes once there's a conversation to turn into one.
```

```final-test grill-with-docs-account-term
Midway through an interview about a SQL migration for your Python backend, the agent points out that you've used "account" for both the paying customer and the login. It asks which one you mean, then writes the settled term into GLOSSARY.md straight away. Why does that matter?
- [x] From now on, you, the agent and later sessions use one word for one thing.
- [ ] The Glossary then holds the migration's decisions, so it can serve as its Spec.
  > The Glossary is a glossary and nothing else, never a Spec or a place for implementation decisions.
- [ ] With the term written down, the agent can end the interview right there.
  > The interview goes on until every branch is visited. Settling a term only removes one source of confusion.
Why: With one word for two things, you and the agent can't tell which is meant. Settling it and writing it down straight away gives you, the agent and later sessions one word for one thing.
```

```final-test grill-with-docs-after-setup
The repo for your Docker-packaged AI agent is configured: docs/agents/ says where Issues live and where the Glossary goes. You have a rough idea for the agent's next feature. What comes next?
- [x] Get interviewed about the idea, writing terms down as they settle.
  > Right: that's `/grill-with-docs`.
- [ ] Split the feature idea into small Tickets on the issue tracker.
  > That's `/to-tickets`. In the Main flow, Tickets come from a Spec, and the Spec from a sharpened idea. Neither exists yet.
- [ ] Run the repo configuration again, so this time it writes the Glossary.
  > That's `/setup-matt-pocock-skills`. Setup never writes the Glossary, and re-running it is only for switching issue trackers or starting over.
- [ ] Build throwaway code to see how the agent's new feature behaves.
  > That's `/prototype`. There's no single question yet that needs a runnable answer. Sharpen the idea first.
Why: Setup only configures the repo, so the idea is still rough. The main flow starts by sharpening it by interview, because the Spec and Tickets build on what that interview settles.
```

```final-test grill-with-docs-deeper-bloated-glossary
After a few interview sessions on your yoga-studio booking API, GLOSSARY.md is over 500 lines. It now records which endpoint returns a 409 and how the waitlist table is indexed. You ask the Skill that wrote it to make GLOSSARY.md more concise and remove every implementation detail. Why?
- [x] The glossary should hold the project's words only. Other decisions go to the Spec through to-spec.
- [ ] A shorter file is cheaper, and the agent rereads GLOSSARY.md before every command it runs.
  > Matt's fix does trim it, but the rule is that GLOSSARY.md holds no implementation details at all, whatever its size.
- [ ] Once it's trimmed, the glossary can stand in for the Spec, so the to-spec step can be skipped.
  > The glossary is never a spec. Decisions that aren't terms live in the conversation, which goes to to-spec.
Why: GLOSSARY.md is a glossary and nothing else, so it should hold no implementation details at any size. Asking for it to be made more concise, with those details removed, puts it back to words only. Decisions that aren't terms stay in the conversation, which goes to to-spec.
```

```sources
- [grill-with-docs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md), Matt Pocock's Skills
- [The /grill-with-docs Skill](https://www.aihero.dev/skills-grill-with-docs), Matt Pocock
- [domain-modeling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [domain-modeling: GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md), Matt Pocock's Skills
- [domain-modeling: ADR-FORMAT.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/ADR-FORMAT.md), Matt Pocock's Skills
- [I stopped using /grill-me for coding. Here’s what I use instead:](https://www.youtube.com/watch?v=6BB6exR8Zd8), Matt Pocock, 2026-05-14
- [Skills Changelog: Ubiquitous Language -> /grill-with-docs](https://www.aihero.dev/skills/skills-changelog-ubiquitous-language-grill-with-docs), Matt Pocock, 2026-04-30
- [The /domain-modeling Skill](https://www.aihero.dev/skills-domain-modeling), Matt Pocock, 2026-08-24
- [v1.3: /implement-spec, /pr, /retro, and GLOSSARY.md](https://www.aihero.dev/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md), Matt Pocock, 2026-10-05 (updated)
- [Ubiquitous Language](https://martinfowler.com/bliki/UbiquitousLanguage.html), Martin Fowler, 2006-10-31
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [grill-with-docs: GLOSSARY.md (formerly CONTEXT.md) gets used as a plan and churns mid-round · Issue #130 · mattpocock/skills](https://github.com/mattpocock/skills/issues/130), AKuederle, 2026-05-04
- [Remove the harness-specific Skill tool dependency from grill-me and grill-with-docs · Issue #1123 · mattpocock/skills](https://github.com/mattpocock/skills/issues/1123), gfucci, 2026-09-24
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
```
