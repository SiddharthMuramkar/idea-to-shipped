---
title: research: get cited facts from primary sources
slug: research
summary: research sends a second agent to read the sources that own the answer while you keep working, then leaves one cited Markdown file in your repo.
---

## What it's for

Say you're planning [Ticket](/learn/issues-and-keeping-track) #13 of a yoga-studio booking site: the endpoint (the web address your app calls) that creates a booking. Two members could book the last seat at once, so you need a fact: what does Postgres, your database, do then? Reading its docs yourself stalls your own work. Asking in this session floods your agent's [context window](/learn/context-window), the text it can hold at once, with pages you won't need again, and the answer ends with the session.

**research sends a background agent to read the sources that own the answer, then leaves one cited Markdown file in your repo.**

A **background agent** is a second agent that works while you carry on.

```checkpoint quick-1
You start research, then go back to your own work. What is doing the reading?
- [x] A background agent, a second agent that works while you carry on.
- [ ] Your session's agent, which pauses your own work until it has read.
- [ ] A nightly job, which does the reading on a fixed schedule for you.
Why: A background agent is a second agent. It does the reading while you carry on, so your own work keeps going.
```

research is one of Matt Pocock's [Skills](/learn/skills): a set of instructions your coding agent loads for one kind of task.

For example, you type:

```text
You:   /research What does Postgres do when two requests
       update the same row at once? Use its official docs.

Agent: A background agent is on it.

       ...later...

Agent: The findings are in docs/notes/postgres-same-row.md.
```

The background agent works from **primary sources**: the original thing itself, not a summary of it. That means official docs, source code, specs (written standards that say how a thing must work) and first-party APIs (a service's own API). It follows every claim back to the source that owns it.

```checkpoint quick-2
Which fits? You want a fact about a Python library. What counts as a primary source?
- [x] The library's official docs, or its source code.
- [ ] A popular blog post that sums up the library's docs.
- [ ] A video tutorial where someone explains the library.
Why: A primary source is the original thing itself. A blog post or a tutorial is a summary of it, so the agent follows each claim back to the source that owns it.
```

## When to use it

- You need a fact from outside your repo before you decide, such as what a database host's free plan includes.
- You need to know how a tool behaves, such as how a library retries a failed request.
- You face reading that would take a while, and you'd rather keep working.

```checkpoint quick-3
You're about to choose a database host, and you need to know what its free plan includes. Which fits?
- [x] Send research to read the host's official docs.
- [ ] Start an interview so the agent can question you.
- [ ] Build a throwaway demo to try out the free plan.
Why: That's a fact from outside your repo, and you need it before you decide. research reads it from the source while you keep working.
```

## When not to use it

- If you need a decision, not a fact, use [grill-with-docs](/learn/grill-with-docs) instead, because its interview settles decisions.
- If an interview needs one fact from your own repo, stay in [grilling](/learn/grilling), because it sends a subagent, a helper agent, to look it up.
- If the answer is only in someone's head, use [to-questionnaire](/learn/to-questionnaire) instead, because it writes them questions to fill in.

```checkpoint quick-4
You need to know how an old database was moved, and only the admin who did it knows. Which fits?
- [x] to-questionnaire, which writes questions for someone.
- [ ] research, which sends an agent to read the sources for it.
- [ ] grilling, which sends a subagent to look the fact up.
Why: research and grilling's subagent look facts up, and this one can't be looked up. It's only in someone's head, so you write that person questions to fill in.
```

## What it needs to start

One clear question, the narrower the better, a repo to save the findings in, and sources the background agent can reach, such as the web.

Type `/research` with your question, or your agent may start it on its own when a job turns into reading.

```checkpoint quick-5
You haven't typed `/research`, but your agent's job has turned into reading. What can happen?
- [x] Your agent may start research on its own for that reading.
- [ ] Nothing, because only you can start research.
- [ ] Your agent refuses to read until you type the Skill's name.
Why: You can type `/research` with your question. Your agent may also start it on its own when a job turns into reading.
```

## What it creates

One cited Markdown file in the repo: every claim carries a link to its source. The agent saves it where the repo already keeps such notes. If there's no such place, it picks a sensible one and tells you where. On its own, it creates no Issues, branches or pull requests.

```checkpoint quick-6
Your repo has no place for notes yet, and you're about to run research. What happens to the file?
- [x] The agent picks a sensible place, and tells you where.
- [ ] The agent stops, and asks you to make a notes folder first.
- [ ] The agent keeps it out of the repo, in your home folder.
Why: It saves the file where the repo already keeps such notes. If there's no such place, it picks a sensible one and tells you where.
```

Take the file into the [main flow](/learn/main-flow) at [grill-with-docs](/learn/grill-with-docs), "since research feeds the thinking rather than replacing it." The file can say what Postgres does with the second request. How Ticket #13 protects the last seat is still your decision.

```checkpoint quick-7
The file says what Postgres does with the second request. What's left for you to do?
- [x] Take it into grill-with-docs, and decide what Ticket #13 does.
- [ ] Nothing, because the file has settled what Ticket #13 does.
- [ ] Run research again, until it makes the decision for you.
Why: research feeds the thinking rather than replacing it. The file gives you the facts, and you make the decision.
```

```diagram
type: chain
caption: "research feeds the thinking rather than replacing it"
steps:
  - "One clear question"
  - label: "a background agent"
    note: "read the sources that own the answer"
  - "One cited Markdown file in the repo"
  - "[grill-with-docs](/learn/grill-with-docs)"
```

## Going deeper

### Why it exists

You can always ask an agent to go and read the docs. In fact, "a two-line prompt saying exactly that was the practice this skill replaced." But the reading fills your session's context window, and what you get depends on how you phrased the request.

So research changes two things:

- It runs in the background, so your session's context stays clean.
- The primary-source rule and the cited file are the same on every run, whatever words you used to ask.

```checkpoint quick-8
You could type a two-line prompt instead. What does research add?
- [x] It runs in the background, and its source rule and cited file never vary.
- [ ] It runs on a bigger model than your session, so the reading goes faster.
- [ ] It files its findings as an Issue, so your whole team can comment on them.
Why: Running in the background keeps your session's context clean. The primary-source rule and the cited file stay the same on every run, whatever words you used to ask.
```

For a small question, Matt advises the two-line prompt.

### How it works underneath

Matt kept the Skill "Deliberately tiny". This is its whole body:

```markdown
Spin up a **background agent** to do the research, so you
keep working while it reads. Start it with a fresh context
window.

Its job:

1. Investigate the question against **primary sources**
   (official docs, source code, specs, first-party APIs),
   not a secondary write-up of them. Follow every claim
   back to the source that owns it.
2. Write the findings to a single Markdown file, citing
   each claim's source.
3. Save it where the repo already keeps such notes; match
   the existing convention, and if there is none, put it
   somewhere sensible and say where.
```

**Why it can be so short.** The two phrases wrapped in `**` (Markdown's mark for bold), "background agent" and "primary sources", are **leading words**: compact ideas already in the model's training. The model already knows both, so a few words are enough.

```checkpoint quick-9
How can research's Skill file stay only a few lines long?
- [x] Two leading words pull in ideas the model already knows.
- [ ] It links out to a long guide that the agent reads first.
- [ ] It leaves out the method, so each run invents its own.
Why: The two phrases marked bold, "background agent" and "primary sources", are leading words, compact ideas already in the model's training. The model already knows both, so a few words are enough.
```

**Why a background agent.** In Claude Code it runs as a background subagent, with its own context window. So the pages it reads never fill yours.

**Why a fresh context window.** Matt added that sentence in October 2026. Some models in Codex, another coding agent, **fork** when they start a subagent: it begins with a copy of the whole conversation. That fork "throws away the reason for using a subagent: a clean context that sees only its brief." Claude Code can start forks on its own too.

```checkpoint quick-10
You're about to start a subagent on a model that forks. What does that subagent begin with?
- [x] A copy of the whole conversation, not a clean context.
- [ ] A clean context that sees only the brief it was given.
- [ ] Nothing at all, until you paste the conversation in.
Why: A fork begins with a copy of the whole conversation. That throws away the reason for using a subagent, which is a clean context that sees only its brief.
```

**Who else runs it.** [wayfinder](/learn/wayfinder) is the one Skill that calls research itself, once per research ticket. It keeps the findings on a throwaway `research/<name>` branch that's never merged.

```checkpoint quick-11
wayfinder runs research for one of its research tickets. Where do the findings go?
- [x] On a throwaway branch that's never merged.
- [ ] On `main`, merged as soon as research ends.
- [ ] In the ticket's comments, with no branch at all.
Why: wayfinder keeps the findings on a throwaway `research/<name>` branch, and that branch is never merged.
```

### A real example

In August 2026 a user reported a bad research run on Matt's repo, with numbers. They had started two runs at once. One went cleanly and cost 188k [tokens](/learn/context-hygiene). The other went wrong in three steps:

1. The background agent did no research. It started a nested worker, an agent of its own, then reported that research had been launched: 31k tokens.
2. The user saw no file and told it to stop delegating. It then did a full pass itself: 171k tokens.
3. About half an hour later, the nested worker finished the same research again: 248k tokens. It found the file already there and merged into it, so nothing looked wrong.

```checkpoint quick-12
A duplicate research agent finishes, and finds the findings file already there. What did it do in this run?
- [x] It merged into the file, so nothing looked wrong.
- [ ] It stopped with an error, so the user saw the duplicate.
- [ ] It overwrote the file, so the full pass's work was lost.
Why: The nested worker merged into the existing file. With no error to see, the merge gave no sign that a duplicate had run.
```

That came to about 450k tokens across three runs, for one question. The reporter wrote that the scariest part wasn't the cost: the third run "ran entirely out of view". So look for a duplicate yourself: this one gave no sign until it finished.

```diagram
type: chain
caption: "about 450k tokens across three runs"
steps:
  - label: "The background agent did no research."
    note: "31k tokens"
  - label: "a full pass itself"
    note: "171k tokens"
  - label: "the nested worker finished the same research again"
    note: "248k tokens"
```

### Where it goes wrong

**Two background tasks appear, with near-identical names.** The Skill tells its caller to "spin up a background agent". The agent it starts reads the same line, and can take it as meant for itself. Claude Code lets subagents nest up to three layers below your conversation, so it can do that. Stop the duplicate: a working run shows exactly one new background task.

```checkpoint quick-13
You've started research, and two background tasks with near-identical names appear. What do you do?
- [x] Stop the duplicate, since a working run shows exactly one.
- [ ] Leave both running, since they share the reading between them.
- [ ] Stop both, since the Skill has to be installed again first.
Why: The agent can take the Skill's line as meant for itself, and start another agent. A working run shows exactly one new background task, so you stop the duplicate.
```

Matt's Skill page still calls it an open bug, but the bug report was closed as not planned in October 2026. Matt treats stopping this as the job of the [harness](/learn/how-agents-work), the agent tool you run. The harness decides which tools a subagent can reach and how deep nesting goes, so a limit set there holds for every Skill. A line in one Skill's text covers only that Skill, costs tokens on every run and still depends on the model obeying it.

**A citation lands on a blog post.** The model decides which sources count as high-trust: the Skill only names the kinds. There's no list of approved sites, and nothing re-checks the sources afterwards. "Your only protection is the citation on each claim", so follow two or three. If they land on a summary of the thing, the run failed.

```checkpoint quick-14
You want to know whether a research file can be trusted. What do you do?
- [x] Follow two or three of its citations, and see where they land.
- [ ] Trust the Skill, because it checks each site against a list.
- [ ] Trust the agent, because it re-checks each source at the end.
Why: There's no list of approved sites, and nothing re-checks the sources. The citation on each claim is your only protection. If citations land on a summary, the run failed.
```

**The agent reads for ages, or misses the one detail you needed.** The Skill has no stopping rule. So agents go far too deep, or cover a topic broadly and miss the detail that mattered. Set the scope yourself: one API, one behaviour or one version claim comes back far better than "research X".

```checkpoint quick-15
You're about to start research. Which question comes back best?
- [x] What does Postgres do when two requests update the same row?
- [ ] Research Postgres, and tell me everything I should know.
- [ ] Research every database, and tell me which one is the best.
Why: The Skill has no stopping rule, so you set the scope. One API, one behaviour or one version claim comes back far better than a broad request.
```

**The run stops, and nothing is on disk.** One reporter's research agents, started with hand-written briefs, were interrupted with everything they'd found still in context. The Skill says what to write and where, but not when. So tell the agent to create the file in its first few tool calls, and to update it after each source. A tool call is the agent asking to run a tool. After that change, their next run was killed twice and kept its first two sections.

```checkpoint quick-16
You're about to run research, and agents have lost work when stopped. What do you add to your request?
- [x] Create the file in your first few tool calls, and update it after each source.
- [ ] Hold every finding in context, and write the whole file at the very end.
- [ ] Skip the file this time, and report every finding back to me in the chat.
Why: The Skill doesn't say when to start writing, so you tell the agent. After that change, one reporter's run was killed twice and kept its first two sections.
```

**Nothing happens, and nobody tells you.** Your own global instructions may forbid an agent from handing work on. Then the background agent declines the task, "and the skill does nothing without telling you." So if no file appears, look for that rule in `~/.claude/CLAUDE.md`.

**A later session doesn't know about the file, or trusts a stale one.** Nothing loads a past research file automatically, so feed it into the next step yourself. It also records only what was true on the day it was written. The community view is to keep ADRs, short records of decisions and why, not research files.

### Try it

You'll need your practice project, the yoga-studio booking site. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. Start Claude Code in your `yoga-studio` folder: `claude`.
2. Type this as one message: `/research What does Postgres do when two requests update the same row at once? Use its official docs. Create the file in your first few tool calls, and update it after each source.`
3. Run `/tasks`. You should see exactly one new background task. Tell Claude to stop any near-identical second one.
4. Carry on with something else while it reads. You should see your own session keep going.
5. When the agent reports back, open the file at the path it gives. You should see one new Markdown file, with a link on each claim.
6. Open two of its links, picked at random. You should land on Postgres's own docs or source, not a write-up of them.
7. Read the file through. You should be able to decide how your booking endpoint protects the last seat without going back to the sources yourself.
8. Take the file into [grill-with-docs](/learn/grill-with-docs), and make that decision there.

### Read more

- [The /research Skill](https://www.aihero.dev/skills-research), Matt Pocock, updated 2026-08-24
- [Add the research skill (#409)](https://github.com/mattpocock/skills/pull/409), Matt Pocock, 2026-07-01
- [Start subagents with a fresh context window, not a fork (#1341)](https://github.com/mattpocock/skills/pull/1341), Matt Pocock, 2026-10-29
- [research skill: spawned background agent can recursively re-spawn another agent (#530)](https://github.com/mattpocock/skills/issues/530), marcoscale and others, 2026-07-13 to 2026-10-06
- [Guards against sub-agents recursing into skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/subagent-recursion.md), mattpocock/skills, 2026-10-06
- [research: nothing says when to start writing the findings file (#1272)](https://github.com/mattpocock/skills/issues/1272), QuantaOverflow, 2026-10-14
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic's Claude Code docs

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint research-deeper-second-agent
You start research in your yoga-studio repo, and two background tasks with near-identical names appear. A friend says to add a line to the Skill file telling the agent never to start another agent. Matt's repo turns that kind of line down. Why?
- [x] The harness sets which tools a subagent can reach, so a limit there covers every Skill.
- [ ] The Skill file already has that line, so adding it a second time would change nothing.
  > The Skill has no such line. Matt's repo lists lines like it as out of scope.
- [ ] Claude Code never lets a subagent start another one, so the second task does no harm.
  > Claude Code lets subagents nest up to three layers below the main conversation, so the duplicate is real and does the work again.
- [ ] The fresh context window added in October 2026 already stops the background agent nesting.
  > That change asks for a clean subagent, not a fork of the parent conversation. It says nothing about one agent starting another.
Why: A line in one Skill's text covers only that Skill, costs tokens on every run and still depends on the model obeying it. The harness decides which tools a subagent gets and how deep nesting goes, so a limit set there holds for every Skill. Meanwhile, you stop the duplicate yourself.
```

```checkpoint research-deeper-interrupted-run
You ask research what Postgres does when two requests update the same row at once. The connection drops after 25 minutes of reading, and no findings file exists. Before the next run, you tell the agent to create the file in its first few tool calls. Why?
- [x] Findings held only in the agent's context can be lost when it stops; a file on disk keeps them.
- [ ] The Skill says to write the file first, and this agent skipped that step by mistake.
  > The Skill never says when to start writing. That gap is exactly what issue #1272 reports.
- [ ] An early file lets the next research run load the old findings and carry on from them.
  > Nothing loads a past research file automatically. It sits in the repo until someone points at it.
Why: An agent's context window is everything it can see, and until a finding is written down, an interruption can lose it. The Skill never says when to start writing, so you do. One reporter's agents lost their findings this way. Once their briefs said to create the file early, a run killed twice kept its first two sections.
```

## Remember

```flashcards
Q: What does research create?
A: One Markdown file in the repo, citing each claim's source.

Q: In research, what counts as a primary source?
A: Official docs, source code, specs and first-party APIs. Not a write-up of them.

Q: In research, who does the reading?
A: A background agent, so you keep working while it reads.

Q: Which Skill do you take a research file into next?
A: grill-with-docs, because research feeds the thinking rather than replacing it.

Q: What sentence did research's Skill file gain in October 2026, and why?
A: "Start it with a fresh context window." Some Codex models fork the parent conversation, which throws away the clean context a subagent exists for.

Q: Which two leading words keep research's Skill file so short?
A: "primary sources" and "background agent". Each is an idea the model already knows, so the file needs only a few words for it.

Q: research has no stopping rule. What kind of question comes back best?
A: A narrow, answerable one, such as one API, one behaviour or one version claim, not "research X".
```

## Final test

```final-test research-which-sources
Which sources does research's background agent work from?
- [x] Official docs, source code, specs and first-party APIs.
- [ ] Well-known blog posts and tutorials that sum up the docs.
- [ ] What the agent already knows from training, to save time.
Why: These are primary sources: the original thing itself, not a secondary write-up of it. The agent follows every claim back to the source that owns it, so a blog post's account of the docs isn't enough.
```

```final-test research-what-it-creates
What does research create?
- [x] One Markdown file in the repo that cites its sources.
- [ ] A Spec in the Issue tracker, built from what it read.
- [ ] Nothing on disk, only a shared understanding.
- [ ] A throwaway program on its own prototype branch.
Why: You want an answer that outlasts the session, so it goes in a file, not the conversation. The background agent writes one Markdown file, citing each claim's source, and saves it where the repo keeps such notes.
```

```final-test research-what-next
Once the research file is in the repo, where does it go next?
- [x] Into grill-with-docs, as material for the interview.
- [ ] Straight into implement, because the facts are settled.
- [ ] Into triage, to be labelled and made ready for an agent.
Why: The file only gathers facts. The decisions are still yours, and the interview is where you make them. So you take the file into grill-with-docs: research feeds the thinking rather than replacing it.
```

```final-test research-deeper-who-gates-sources
In research, what decides which sources count as high-trust?
- [x] The model, with no approved list, so you check by following a few citations.
- [ ] A built-in list of approved domains that the Skill checks each source against.
- [ ] A verification pass that re-reads every cited page before the file is saved.
Why: The Skill only names the kinds of source that qualify. There's no list of approved sites, and nothing re-checks the sources afterwards. So the model judges, and your only protection is the citation on each claim. Follow two or three.
```

```final-test research-deeper-nesting-closed
research's background agent can start a second agent. What became of the bug report about that?
- [x] Closed as not planned, since stopping nested agents is the harness's job.
- [ ] Fixed by a line telling the background agent never to start another agent.
- [ ] Fixed by starting each background agent with a fresh context window.
Why: Matt's repo closed it as not planned in October 2026. The harness decides how deep agents can nest, so a limit set there holds for every Skill, and a line in one Skill can't do that. The fresh context window is about a different problem: forking, not nesting.
```

```final-test research-webhook-facts
Before you plan payments for your booking website, you need to know exactly how your payment provider retries webhooks (the requests it sends to your API), taken from its official docs. You want the findings kept in the repo with their sources, and you want to keep working on the frontend while someone reads. Which fits best?
- [x] Send a background agent to read the docs and write a cited file.
  > Right: that's `/research`.
- [ ] Get interviewed on payments while a GLOSSARY.md and ADRs are written.
  > That's `/grill-with-docs`. The interview settles decisions. These are facts to gather first, and they then feed the interview.
- [ ] Write a questionnaire for the payment provider's support team.
  > That's `/to-questionnaire`. The facts are in public docs, not in someone's head.
Why: These are facts in public docs, and you want them kept with their sources while you carry on working. research does exactly that: a background agent reads the primary sources and leaves a cited file. The interview comes after, once you have the facts.
```

```final-test research-file-landed
A background agent has finished reading. A cited Markdown file on how three Python task queues handle retries is now in your FastAPI repo. You want to add background jobs to the app, and nothing about them is decided yet. What comes next?
- [x] Take the file into an interview about the background jobs.
  > Right: that's `/grill-with-docs`.
- [ ] Turn the file straight into a Spec for the new jobs.
  > That's `/to-spec`. The findings feed the thinking; they don't replace the interview that settles the decisions.
- [ ] Start building the background jobs from the findings.
  > That's `/implement`. Nothing is decided yet, so there is nothing clear to build.
Why: The file says how each task queue handles retries. It doesn't decide what your background jobs should do. That's for the interview, so the file goes into the main flow there: it feeds the thinking rather than replacing it.
```

```final-test research-only-in-a-head
You need to know how your company's old billing database was moved to Postgres last year. Nothing was written down, and only the database admin who did it knows the details. Which fits best?
- [x] Write a questionnaire for the database admin to fill in.
  > Right: that's `/to-questionnaire`.
- [ ] Send a background agent to read primary sources and write a cited file.
  > That's `/research`. It reads docs and code, but this knowledge isn't written anywhere.
- [ ] Get interviewed about the old migration, with nothing saved.
  > That's `/grill-me`. It interviews you, but you don't hold these answers.
Why: Nothing was written down, so an agent has nothing to read, and you don't hold the answers yourself. The blocker is in someone else's head, so you write that person a questionnaire to fill in.
```

```final-test research-fact-mid-interview
An agent is interviewing you, round by round, about the Docker setup for your AI agent. One of its questions needs to know which base image your Dockerfile already uses. Which fits best?
- [x] Let the interview send a subagent while you answer the rest.
  > Right: that's `/grilling`.
- [ ] Send a background agent to write a cited file on the base image.
  > That's `/research`. One fact from your own repo doesn't need a cited file. The interview looks it up itself.
- [ ] Write a questionnaire for the teammate who wrote the Dockerfile.
  > That's `/to-questionnaire`. The fact is in the repo, so the agent can look it up.
Why: One fact from your own repo doesn't need a cited file. In an interview, finding facts is already the agent's job. It sends a subagent, and only the questions that depend on that fact wait.
```

```final-test research-why-still-interview
A background agent has written a cited Markdown file comparing ways to do full-text search in Postgres, for your website's search box. A friend says you can skip the interview now, because the file has the answers. Why do you still take the file into an interview?
- [x] The file gathers facts; the decisions are still yours to make.
- [ ] The interview checks each claim in the file against its source.
  > Following each claim back to its source is the research agent's job. The interview settles decisions.
- [ ] The interview turns each source in the file into a Glossary entry.
  > The interview is about settling decisions, not filing the sources.
Why: The file says what's true about each way to search. Which way to use is a decision, and the interview is where decisions get made. So the findings feed the thinking rather than replace it.
```

```sources
- [research: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/research/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
- [Add the research skill #409](https://github.com/mattpocock/skills/pull/409), mattpocock, 2026-07-01
- [The /research Skill](https://www.aihero.dev/skills-research), Matt Pocock, 2026-08-24
- [writing-for-agents: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents), Anthropic (Claude Code Docs)
- [research skill: spawned background agent can recursively re-spawn another agent (uncontrolled nesting) #530](https://github.com/mattpocock/skills/issues/530), marcoscale, 2026-07-13
- [Start subagents with a fresh context window, not a fork #1341](https://github.com/mattpocock/skills/pull/1341), mattpocock, 2026-10-29
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [Guards against sub-agents recursing into skills (.out-of-scope/subagent-recursion.md)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/subagent-recursion.md), Matt Pocock (mattpocock/skills), 2026-10-06
- [research: nothing says when to start writing the findings file, so an interrupted agent leaves nothing on disk #1272](https://github.com/mattpocock/skills/issues/1272), QuantaOverflow, 2026-10-14
```
