---
title: handoff: a summary file that travels
slug: handoff
summary: How Matt Pocock's handoff Skill sums up your conversation in one Markdown file, so a fresh agent, tool or colleague can carry on from it.
---

## What it's for

Say you're building Ticket #13, one task on your yoga-studio booking site: the booking endpoint. You notice the `web/` site (your website's folder) is slow to build. Fixing it here leaves the session half on each job. A fresh agent would need everything explained again.

**handoff writes a handoff document: one Markdown file that sums up your conversation, so a fresh agent can carry on from it.** What it buys is portability: a file that travels.

For example, you type:

```
/handoff fix the slow web/ build in a fresh session
```

The agent writes the file. You open a fresh session, give it the path, and say: "Read this file, then continue." Your first session stays as it was.

```checkpoint quick-1
You've handed the slow build to a fresh session. What happens to your first session?
- [x] It stays as it was, while the fresh session reads the file.
- [ ] It ends there, because the file now carries all of its work.
- [ ] It gets compacted, because the file now holds its history.
Why: Handing off writes a file, and the fresh session reads it. Your first session stays as it was.
```

## When to use it

Use it only when the work has to travel, as [context hygiene](/learn/context-hygiene) said:

- You're swapping to a new harness, the agent tool you run: say, from Claude Code to **Codex**, another coding agent.
- You're moving to a new directory or repo.
- You're sending the work to a colleague.
- You've found a side task mid-phase, and you split it off to a second agent and keep working.

```checkpoint quick-2
Which of these is a case for handoff?
- [x] A colleague is taking over the work from you.
- [ ] You want a shorter history in this same session.
- [ ] Your next Ticket is in this repo, with this tool.
Why: The four cases are a new harness, a new directory or repo, a colleague, and a side task forked off mid-phase. In each one, the work has to leave this session.
```

The [main flow](/learn/main-flow)'s [prototype](/learn/prototype) detour needs it both ways, because a prototype's context doesn't belong in this session. You hand off out, build the prototype in a fresh session, then hand off back what you learned.

```checkpoint quick-3
You're grilling, and one question needs a prototype to settle it. How does handoff fit in?
- [x] You hand off out, build the prototype in a fresh session, then hand off back.
- [ ] You build the prototype in this session, then hand off once when it's finished.
- [ ] You hand off out once, and the prototype's session goes on to write the Spec.
Why: A prototype's context doesn't belong in this session, so the work crosses twice, out to a fresh session and back with what you learned.
```

```diagram
type: chain
caption: "The main flow's prototype detour needs it both ways"
steps:
  - label: "You hand off out"
    note: "a prototype's context doesn't belong in this session"
  - "build the prototype in a fresh session"
  - "hand off back what you learned"
```

## When not to use it

- If nothing is travelling, you don't need the file. Carry on here if you can, because a summary loses detail. That's why the grilling, the Spec and writing the Tickets share one session.
- If you need more room on the same task, use `/compact` at the next phase boundary instead, because handoff doesn't summarise any better.
- If you want the whole feature written down for the team, use [to-spec](/learn/to-spec) instead, because it publishes a Spec to the Issue tracker.

```checkpoint quick-4
You want the whole booking feature written down for the team. Which fits?
- [x] to-spec, because it publishes a Spec to the Issue tracker.
- [ ] handoff, because it publishes a summary to the Issue tracker.
- [ ] `/compact`, because it publishes a summary to the Issue tracker.
Why: Of these three, only to-spec publishes to the Issue tracker. A handoff document is a file for the next agent, and `/compact` only gives you more room.
```

`/compact` and `/handoff` give the next session a summary, a **secondary source**, not the session itself. So check first whether you can carry on.

```checkpoint quick-5
You could carry on in this session, but you're about to hand off anyway. What does that cost you?
- [x] The next session starts from a summary, not the session itself.
- [ ] Nothing, because the summary then becomes a new primary source.
- [ ] The next session starts from the session itself, not a summary.
Why: The session itself is the primary source. `/compact` and `/handoff` give the next session a summary, a secondary source, instead. That's why you check first whether you can carry on.
```

## What it needs to start

A conversation worth carrying on. Only you can start it, by typing `/handoff`; the agent won't on its own. Add a note on what the next session is for, and the document is shaped around that.

```checkpoint quick-6
You're deep in a long session, and a side task comes up. Will the agent start handoff for you?
- [x] No. Only you can start it, by typing /handoff.
- [ ] Yes. It starts once the session has grown long.
- [ ] Yes. It starts once it sees a side task come up.
Why: The agent never starts handoff on its own. You type /handoff, and you can add a note on what the next session is for.
```

## What it creates

One Markdown file, saved in your computer's temporary folder, not in the repo. It's a scratch space, named by `$TMPDIR` (or `/tmp` if that isn't set).

```checkpoint quick-7
You've run handoff on Linux, and `$TMPDIR` isn't set. Where does the file go?
- [x] `/tmp`, which is not in the repo.
- [ ] The repo's root, beside the README.
- [ ] The repo's `docs/` folder, to commit.
Why: The file never goes in the repo. `$TMPDIR` names your temporary folder, and without it the file goes to `/tmp`.
```

The file:

- sums up the conversation;
- has a "suggested skills" section, naming the Skills the next agent should load;
- points at anything already written down (the Spec, ADRs, Issues) by path or URL, instead of copying it;
- leaves out secrets: passwords, personal details and **API keys**, secret strings a program sends to prove who it is.

```checkpoint quick-8
Your session used a database password. What does the handoff document do with it?
- [x] Leaves it out, along with API keys and personal details.
- [ ] Keeps it, so that the next agent can reach the database.
- [ ] Keeps it, in a section that the next agent reads first.
Why: Secrets stay out of the document. That means passwords, personal details and API keys.
```

## Going deeper

### Why it exists

Say you spot a job that's out of scope, partway through a session. Carry on, and you end up half on each job. Matt Pocock, who wrote this Skill, calls that "diluted context". Compact, and Matt says you wipe out the progress you've made.

```checkpoint quick-9
You spot an out-of-scope job mid-session. Why not carry on here, or compact?
- [x] Carrying on leaves you half on each job, and Matt says compacting wipes out your progress.
- [ ] Carrying on is fine, but compacting needs a handoff.md file to work from before it starts.
- [ ] Compacting keeps all your progress, but it only works inside a fresh session.
Why: Carrying on leaves you half on each job, which Matt calls diluted context. He says compacting wipes out the progress you've made.
```

In his May 2026 video, Matt says what he wanted instead: "I wanted to compact into another session." So he kept asking the agent for a `handoff.md` to pass to another agent. He did that so often that he made it a Skill.

So handoff gives the side job its own session, and the two sessions run independently.

Matt has since narrowed the pitch. handoff used to read as the general bridge between context windows, and release 1.2.0 says it "was oversold". What it gives you is portability, not compression. You'll use it less often than the other four moves at a phase boundary.

```checkpoint quick-10
Say an old post calls handoff the general bridge between context windows. What should you go by now?
- [x] It's narrow: it gives you portability, not compression.
- [ ] It's general: use it each time you start a new session.
- [ ] It's for compression: use it once a session gets long.
Why: Release 1.2.0 says handoff was oversold. What it gives you is portability, and you'll use it less often than the other four moves.
```

### How it works underneath

A new harness can't see the old context window, but any agent tool can read a Markdown file. So you can start in Claude Code and pass it to Codex or Copilot CLI.

Say you handed off the slow `web/` build from the example above. The file might read:

```markdown
# Fix the slow web/ build

Spotted while building Ticket #13, which stays in the first session.
Nothing tried yet. Next: find out why it's slow.

Related: https://github.com/you/yoga-studio/issues/13

## Suggested skills

diagnosing-bugs
```

Each part of that file has a reason:

- **It's aimed at one job.** The agent needs to know what the next session will focus on. Matt says: "Every time I used handoff, I always describe the purpose".
- **It names the Skills,** so you don't have to work out which ones the next session needs.
- **It links instead of copying.** Matt often found these documents got really big, repeating what GitHub Issues already held. Links keep the file small, and settled detail stays in one place.
- **It sits in the temporary folder,** because it's disposable, not documentation to keep in your repo.

```checkpoint quick-11
Say your Spec already holds the decisions. Why does the document link to it, not copy it?
- [x] Links keep the file small, and settled detail stays in one place.
- [ ] Links let the next agent change the Spec without opening GitHub.
- [ ] Copies can't travel between harnesses, so only links reach the next agent.
Why: Matt often found these documents got really big, repeating what GitHub Issues already held. A link keeps the file small, and the detail stays in one place.
```

**The fork is the use people skip.** To fork is to split a second line of work off while the first carries on. "You **stay in your session** and hand a copy of the accumulated context to a second agent working in parallel." When you come back, your original session is unchanged.

Matt names two patterns. With _fire and forget_, you spin up an agent to fix a bug. With a _DIY sub-agent_, the second session hands back what it learned.

**A harness's own fork is different.** A flag such as Claude Code's `--fork-session` copies the context exactly. handoff's copy is instead a targeted summary, aimed at a stated next task, in a file. On the same machine, in the same harness and directory, a fork is less work. The file is for when the work must go somewhere a fork can't.

```checkpoint quick-12
Your second line of work stays on this machine, in this harness and directory. Which is less work?
- [x] A harness's own fork, which copies the context exactly.
- [ ] A handoff, which writes a targeted summary to a file.
- [ ] Neither, since a fork and a handoff cost the same here.
Why: On the same machine, in the same harness and directory, a fork is less work. The file is for when the work must go somewhere a fork can't.
```

Three commands are easy to mix up, but each one preserves something different. `/compact` preserves your intent, `/clear` preserves nothing, `/handoff` preserves the work's ability to move.

```diagram
type: compare
caption: "each one preserves something different"
columns: ["`/compact`", "`/clear`", "`/handoff`"]
rows:
  - cells: ["preserves your intent", "preserves nothing", "preserves the work's ability to move"]
```

The agent never starts handoff on its own. `SKILL.md`, the file holding the Skill's instructions, opens with front matter: a settings block at the top. There, `disable-model-invocation: true` stops the agent starting it. The Skill's Codex settings do the same with `allow_implicit_invocation: false`. You start it yourself: `/handoff` in Claude Code, `$handoff` in Codex.

### A real example

In that May 2026 video, Matt is grilling plans for Sandcastle, his library for running agents in automated loops, which he calls his software factory. At question 2, he says part of the design may move to a separate API: "let's hand off that task to a separate agent."

Saying it was out of scope sharpened the grilling too, and question 2 collapsed. The handoff file set the next session's focus, filing a GitHub Issue. Later, another agent did that from the file.

In another grilling, at question 13, he hands off to prototype the difficult bits. That prototype session grew to 169K tokens, "way bigger than would have fit inside the grilling". Then he asked for a handoff back, holding the learnings the prototype itself didn't capture. With those, he finished the grilling and wrote the Specs and Issues.

```checkpoint quick-13
Matt handed off to prototype the difficult bits. Why did that work need its own session?
- [x] It grew to 169K tokens, far more than the grilling could have held.
- [ ] It needed a different harness, which the grilling session couldn't run in.
- [ ] It stayed so small that it wasn't worth adding to the grilling.
Why: The prototype session grew to 169K tokens, way bigger than would have fit inside the grilling. A handoff back then carried its learnings home.
```

So the big job got its own context window, and the grilling got back only what it needed.

### Where it goes wrong

**You can't find the file.** It goes to the temporary folder, and Matt calls that "the most-reported problem with the skill". Agents used to guess where that folder was. One user saw 3-4 attempts on Windows, and another saw three runs write to three places on a Mac. Release 1.3.2 names the folder in SKILL.md: `$TMPDIR`, else `/tmp`, or `%TEMP%` on Windows. Even so, ask for the path back and keep it before you move on.

**The file has vanished.** Some environments clear the temporary folder between sessions (Codex is the reported case), and a reboot empties `/private/tmp`. If the next session is over an hour away, or in a different harness, copy the file somewhere durable as soon as it's written.

**The new agent missed the end of the plan.** You pasted the summary into your shell, as `claude "<summary>"`, and the shell mangled its backticks or `$(...)`: it runs what's inside them. The usual result is a summary cut short with no error, so nothing tells you. Open the fresh session and point it at the file's path instead.

**The new agent built on something false.** The session guessed something, such as that the bookings table isn't built, and the document stated it as fact. "The next agent trusts the document and does not re-check it". Read the document before you hand it over, and mark anything you only assumed as not checked.

```checkpoint quick-14
The session guessed that the bookings table isn't built. What do you do before handing over?
- [x] Mark the claim as not checked, since the next agent won't re-check it.
- [ ] Leave the claim as written, since the next agent re-checks each claim.
- [ ] Delete the document, since a guess can't be fixed once it's been written.
Why: The next agent trusts the document and doesn't re-check it, so a guess written as a fact gets built on. Read the document first, and mark anything you only assumed.
```

### Try it

Fork a side task off a working session. You need your practice project, the yoga-studio booking site, with Matt's Skills installed. If you haven't set it up, do the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) first.

1. In the practice project, start a session with `claude`.
2. Say: "Read the Ticket for the booking endpoint, then plan it."
3. Type `/handoff add a README section on how Tickets are tracked, in a fresh session`. You should see the agent write one file.
4. Say: "What's the path of that file?" You should see a path in your temporary folder.
5. Open the file. You should see a suggested skills section and no secrets. If it mentions the Ticket, that's a link, not a copy.
6. Change any claim the session never checked to "not checked".
7. Copy the file somewhere durable: `mkdir -p ~/handoffs && cp <path> ~/handoffs/`.
8. Open a second terminal in the project, and run `claude`.
9. Say: "Read this file, then continue", with the file's new path. You should see it start on the README without asking you to re-explain the setup.
10. Go back to the first terminal. You should see the first session unchanged, still on the booking endpoint.

### Read more

- [The /handoff Skill](https://www.aihero.dev/skills-handoff), Matt Pocock, updated 2026-08-24
- [/handoff is my new favourite skill](https://www.youtube.com/watch?v=dtAJ2dOd3ko), Matt Pocock, 2026-05-21
- [Skills Changelog: /handoff, /prototype, /review and /writing](https://www.aihero.dev/skills/skills-changelog-handoff-prototype-review-and-writing), Matt Pocock, 2026-05-11
- [/handoff and temp location issues on windows (#272)](https://github.com/mattpocock/skills/issues/272), hades200082, 2026-05-29
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock, 2026-10-29

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint handoff-deeper-guess-as-fact
Your handoff document says "the bookings table isn't built yet". The session never checked; it was a guess. The next agent builds a second bookings table and a migration that clashes with the real one. Why did it go wrong?
- [x] The next agent trusts the document and doesn't re-check it, so the unchecked guess became its starting fact.
- [ ] The document copied an old migration file in full, and the next agent built from that out-of-date copy.
  > A handoff document references specs, issues, commits and diffs by path or URL instead of copying them. The trouble was a guess written as a fact.
- [ ] The suggested skills section told the next agent to start the database work again from scratch.
  > That section names the Skills to load. It was the unchecked claim that misled the next agent.
Why: The next agent starts from the document and doesn't re-check it, so a guess written as a fact becomes something it builds on. That's why you read the document before you hand it over, and mark anything you only assumed as not checked.
```

## Remember

```flashcards
Q: What does handoff create?
A: One Markdown file in the computer's temporary folder: a summary of the conversation, with a "suggested skills" section, for a fresh agent to carry on from.

Q: What are the four cases that need handoff?
A: A new harness, a new directory or repo, a colleague, or a side task forked off mid-phase.

Q: What does handoff buy you?
A: Portability. A file that travels.

Q: What does a handoff document leave out?
A: Secrets such as API keys, passwords and personal details, and copies of anything already written elsewhere, which it points at instead.

Q: Why did Matt build handoff, as he tells it in his May 2026 video?
A: He wanted to compact into another session. Compacting would wipe out his session's progress, so he kept asking for a handoff.md to pass to another agent, often enough to make it a Skill.

Q: Why does an agent never start handoff on its own?
A: Its SKILL.md front matter sets disable-model-invocation: true, and its Codex settings set allow_implicit_invocation: false. You start it yourself: /handoff in Claude Code, $handoff in Codex.

Q: The next session won't start for a day. What should you do with the handoff file?
A: Copy it somewhere durable as soon as it's written. Temp can be cleared between sessions (Codex is the reported case), and a reboot empties /private/tmp.
```

## Final test

```final-test handoff-where-saved
Where does handoff save its document?
- [x] In the computer's temporary folder, not in the repo.
- [ ] In the repo's docs/ folder, committed with the code.
- [ ] As a new Issue on the issue tracker.
- [ ] In the repo's GLOSSARY.md, under a new heading.
Why: A handoff file is on its way to the next session, not something to keep. So it goes in your computer's temporary folder ($TMPDIR, else /tmp), and stays out of the repo.
```

```final-test handoff-when
When do you need handoff?
- [x] When work travels: a new harness, directory, colleague or side task.
- [ ] At each phase boundary, before the next phase starts.
- [ ] Between the interview and the Spec, so the Spec starts from a summary.
Why: What handoff buys is a file that can move somewhere this session can't. So you need it only when work travels. Reaching a phase boundary isn't travel, and neither is moving from the interview to the Spec.
```

```final-test handoff-already-written
The Spec and two ADRs already cover most of the decisions. What does the handoff document do with them?
- [x] Points at them by path or URL, so their content isn't duplicated.
- [ ] Copies them in full, so the next agent has one file to read.
- [ ] Leaves them out without a mention, since the next agent can find them.
Why: A copy makes the file bigger, and leaves two versions that can drift apart. A path or URL keeps the file small, and the next agent reads the real thing.
```

```final-test handoff-deeper-temp-guessing
Before the fix in version 1.3.2, what went wrong with where handoff saved its file?
- [x] Agents guessed at the temp folder, with several tries on Windows and a new place each run on a Mac.
- [ ] Agents saved it inside the repo instead of temp, so handoff files ended up committed to the codebase by accident.
- [ ] Agents saved it in temp, but redacted so much of it that the next agent had too little to go on.
- [ ] Agents saved it in temp under one fixed name, so each new handoff overwrote the one before it.
Why: SKILL.md didn't say where the temp folder was, so agents guessed. One user saw 3-4 attempts on Windows, and another saw three runs write to three places on a Mac. Version 1.3.2 names the folder ($TMPDIR, else /tmp; %TEMP% on Windows), so agents stop guessing.
```

```final-test handoff-deeper-fork
Matt calls the fork the use people skip. In the fork case, what happens to the session you're in?
- [x] You stay in it, and a second agent works in parallel from a copy of the context you built.
- [ ] It ends there, and a second agent picks up the same task from the file in a fresh window.
- [ ] It's compacted first, so that you and a second agent can share the one smaller context window.
Why: Forking doesn't end your session. You stay in it, and a second agent works from the file's copy of the context you built. So when you come back, your session is unchanged.
```

```final-test handoff-out-to-the-prototype
Interviewing about a refund feature for your FastAPI booking backend, you reach a question talk can't settle: whether the refund state model holds up. You'll answer it with throwaway code in its own directory, in a fresh session. What do you do first?
- [x] Write a portable summary, so the new session knows the thread.
  > Right: that's `/handoff`.
- [ ] Start the throwaway code right here, in the interview session.
  > That's `/prototype`. The prototype runs in a fresh session. The summary out comes first, so that session knows the thread.
- [ ] Write the refund Spec now, so the prototype has a Spec to follow.
  > That's `/to-spec`. The question is still open. The Spec comes after the detour, once it's settled.
Why: The prototype gets a fresh session, and that session can't see this interview. A portable file carries the thread across, and a second one brings the answer back.
```

```final-test handoff-new-harness
You've spent the afternoon planning a rate limiter for your Python backend in Claude Code. Tomorrow you want to carry on in Codex, a different agent tool, and it should pick up where you left off. Which fits best?
- [x] Write a portable summary of the session, so Codex has the context.
  > Right: that's `/handoff`.
- [ ] Publish the rate limiter idea as a Spec on the issue tracker.
  > That's `/to-spec`. A Spec describes the feature to build. It isn't a way to carry this session's state to another agent tool.
- [ ] Get interviewed about the plan again tomorrow, from scratch, in Codex.
  > That's `/grill-with-docs`. That throws away a whole afternoon of thinking instead of carrying it over.
Why: Codex can't see what happened in Claude Code. A portable summary is how the afternoon's thinking gets across, and a new harness is one of the few cases that need one.
```

```final-test handoff-side-task-for-a-colleague
Halfway through a Ticket on your Python backend, you notice the Docker image takes ten minutes to build. You want a colleague to pick that up in their own session, without derailing the Ticket you're on. Which fits best?
- [x] Write a portable summary of the slow build for your colleague.
  > Right: that's `/handoff`.
- [ ] Stop and get interviewed about how to speed up the Docker build.
  > That's `/grill-with-docs`. That derails the Ticket you're on, and the work is going to your colleague anyway.
- [ ] Write a Spec for a faster Docker build and send it to your colleague.
  > That's `/to-spec`. A Spec describes a whole feature. Here you only need to pass a side task on.
Why: Your colleague can't see your session, so they need something they can read. A portable summary gives them that, and you keep working on your Ticket.
```

```final-test handoff-nothing-travelling
You've just finished an interview about a SQL migration plan. Next is writing the Spec, in the same directory, with the same agent tool and plenty of room left in the session. The agent offers to write a portable summary file and start the Spec in a fresh session. Why is staying in this session the better move?
- [x] Nothing is travelling, and a summary would lose the interview's detail.
- [ ] A fresh session would have less room for the Spec than this one.
  > A fresh session has more room, not less. The cost of a summary is lost detail.
- [ ] The Spec can't be written from a summary file, only from the interview itself.
  > It could be, but a summary is lossy. The interview itself is the better source.
Why: Same directory, same tool, plenty of room: nothing has to travel. The Spec builds best on the interview as it happened, and a summary would lose detail. So you check first whether you can carry on, and here you can.
```

```final-test handoff-deeper-pasted-summary
A handoff document holds your plan for the yoga-studio booking API, with code in backticks. To start the next agent, you paste the whole summary into your shell as `claude "<summary>"`. No error shows, but the new agent seems to have missed the end of the plan. Why?
- [x] The shell mangled the summary's backticks and `$(...)`, and cut it short without any error.
- [ ] The summary was longer than the new agent's context window, so the model dropped its end.
  > A handoff document is a small fraction of the conversation it sums up. The shell, not the model, cut it short.
- [ ] handoff had redacted the end of the plan, because it named the database's connection string.
  > Redaction strips secrets such as keys and passwords. It doesn't cut off the plan, and it happens before you paste.
Why: Inside `claude "<summary>"`, the shell mangles backticks and `$(...)`. The usual result is a summary cut short with no error, so nothing tells you. Open the fresh session and point it at the file's path instead, so the summary never goes through the shell.
```

```sources
- [handoff: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [The /prototype Skill](https://www.aihero.dev/skills-prototype), Matt Pocock
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [/handoff is my new favourite skill](https://www.youtube.com/watch?v=dtAJ2dOd3ko), Matt Pocock, 2026-05-21
- [Skills Changelog: /handoff, /prototype, /review and /writing](https://www.aihero.dev/skills/skills-changelog-handoff-prototype-review-and-writing), Matt Pocock, 2026-05-11
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [The /handoff Skill](https://www.aihero.dev/skills-handoff), Matt Pocock, 2026-08-24
- [Manage multiple agents with agent view - Claude Code Docs](https://code.claude.com/docs/en/agent-view), Anthropic
- [handoff: agents/openai.yaml](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/handoff/agents/openai.yaml), Matt Pocock's Skills
- [Full Walkthrough: Workflow for AI Coding — Matt Pocock](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock (AI Engineer channel), 2026-04-24
- [/handoff and temp location issues on windows (#272)](https://github.com/mattpocock/skills/issues/272), hades200082, 2026-05-29
- [Feedback from using claude-handoff #562](https://github.com/mattpocock/skills/issues/562), shihyuho, 2026-07-14
- [diagnosing-bugs: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/diagnosing-bugs/SKILL.md), Matt Pocock's Skills
```
