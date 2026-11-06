---
title: writing-for-agents: write documents agents read
slug: writing-for-agents
summary: How to write a document an agent reads, such as a Skill or CLAUDE.md, so it takes little room and the agent works the same each run.
---

## What it's for

Say you ask an agent to point your booking site's [`CLAUDE.md`](/learn/instruction-files) at your migration notes. It writes a paragraph explaining what a migration is (a script that changes a database's tables). The agent already knows that, so those words cost room and change nothing.

```checkpoint quick-1
An agent's draft of a `CLAUDE.md` line explains what a migration is. What's wrong with that?
- [x] The agent already knows it, so the words change nothing.
- [ ] The topic is too large for one paragraph of a file to cover.
- [ ] The file only accepts commands, so a paragraph gets ignored.
Why: The agent already knows what a migration is. So the paragraph costs room and changes nothing.
```

**writing-for-agents is a reference for writing any document an agent reads, so the agent works the same each run.**

Have the agent review that paragraph with this Skill, and you might get one line:

```
Before writing a SQL migration, read docs/migrations.md.
```

That line is a [context pointer](/learn/implement-spec): it stays in the agent's [context](/learn/context-window), names material kept elsewhere, and says when to reach for it. The pointer's wording, not its target, decides when the agent reaches the material.

```checkpoint quick-2
The agent keeps missing your migration notes. What do you change first?
- [x] The wording of the line that points at the notes.
- [ ] The name of the file that the notes are kept in.
- [ ] The folder that the file of notes is kept inside.
Why: The pointer's wording decides when the agent reaches the material. Its target doesn't, so renaming or moving the notes won't help.
```

Five more ideas:

- **Two loads**: context load is the room that text loaded every turn takes up in the agent's context. Cognitive load is what it costs you to remember which documents exist and when to use each.
- **Information hierarchy**: steps first (what the agent does), then reference (facts it looks up while working). What only some cases need goes in another file behind a pointer, or it buries the steps.
- **Completion criterion**: every step ends on a clear condition that tells the agent it's done.
- **Prompt the positive**: say what to do, not what not to do. A ban puts the banned idea in the agent's head.
- **Pruning**: say each thing once, and delete lines that change nothing. Leave out what a lookup finds, like config files, because a copy goes out of date.

```checkpoint quick-3
Your document has a long table that only some runs use. Where should it go?
- [x] In a separate file, behind a pointer.
- [ ] At the very top, above the agent's steps.
- [ ] In the middle, right beside the steps.
Why: What only some cases need moves out, behind a pointer. Left in the file, it buries the steps.
```

```diagram
type: layers
caption: "Information hierarchy"
mode: stacked
layers:
  - label: "steps"
    note: "what the agent does"
  - label: "reference"
    note: "facts it looks up while working"
  - label: "behind a pointer"
    note: "What only some cases need"
```

## When to use it

- You're creating or editing a [Skill](/learn/skills), or changing an instruction file such as `AGENTS.md` or `CLAUDE.md`.
- You're writing any other document an agent reads, such as a [Spec](/learn/issues-and-keeping-track).

```checkpoint quick-4
You're writing a Spec that agents will build from. Does writing-for-agents apply?
- [x] Yes, it covers any document an agent reads.
- [ ] No, it covers only Skills and instruction files.
- [ ] Only once the Spec has been split into Tickets.
Why: The Skill covers any document an agent reads, and a Spec is one of them.
```

## When not to use it

- If you want to know what to change in the agent's setup, use [retro](/learn/retro) instead, because it looks back over a session. This Skill then words the change.
- If you want to sharpen your project's own words, use [domain-modeling](/learn/domain-modeling) instead, because this Skill only controls how a document reads.

```checkpoint quick-5
After a build, how do retro and writing-for-agents share the work?
- [x] retro finds what to change, and writing-for-agents words it.
- [ ] writing-for-agents finds what to change, and retro words it.
- [ ] retro finds the change and words it, with no help needed.
Why: retro looks back over a session to find what to change. writing-for-agents then words the change.
```

## What it needs to start

A document to write or edit. For a Skill, `AGENTS.md` or `CLAUDE.md`, the agent reaches for it on its own: it's [model-invoked](/learn/pr). For anything else, type `/writing-for-agents`.

```checkpoint quick-6
You ask the agent to edit your `CLAUDE.md`. Must you start writing-for-agents yourself?
- [x] No, it's model-invoked, so the agent reaches for it.
- [ ] Yes, it runs only when you type its name yourself.
- [ ] Yes, unless the document you're editing is a Skill.
Why: It's model-invoked, so for a Skill, `AGENTS.md` or `CLAUDE.md` the agent reaches for it on its own. For other documents, you type its name.
```

For a Skill, the agent also reads `SKILL-MECHANICS.md`. It explains how a Skill starts, and its **front matter**: the settings block at the top of a Markdown file.

If a Skill only ever runs by hand, set `disable-model-invocation: true` there. It's then [user-invoked](/learn/teach): only you can start it, and it costs no context load. The file also covers **router** Skills: one Skill that names the others and when to use each.

```checkpoint quick-7
Why set `disable-model-invocation: true` on a Skill that only ever runs by hand?
- [x] Only you can start it, and it costs no context load.
- [ ] The agent can start it, and it loads on every turn.
- [ ] It becomes a router, and names all the other Skills.
Why: That setting makes the Skill user-invoked. Only you can start it, and it costs no context load.
```

## What it creates

Nothing of its own. It shapes the document you're writing.

```checkpoint quick-8
You've reworded a `CLAUDE.md` line with writing-for-agents. What does the Skill leave behind?
- [x] Nothing of its own, only the document you were writing.
- [ ] A new Issue that lists the lines to change next time.
- [ ] A pull request that holds your newly reworded document.
Why: It creates nothing of its own. It shapes the document you're writing.
```

## Going deeper

### Why it exists

Ask an agent to write instructions for another agent, and it spends most of its words on what the model already knows. Each of those lines is a **no-op**: it costs context and changes no behaviour. So the Skill's default fix is to delete, not to explain.

```checkpoint quick-9
A line explains what the model already knows. What's the Skill's default fix?
- [x] Delete it, since it costs context and changes no behaviour.
- [ ] Explain it further, so the agent is sure to follow it.
- [ ] Move it to the top, so the agent reads it first of all.
Why: A line like that is a no-op. It costs context and changes no behaviour, so the default fix is to delete, not to explain.
```

The Skill started out narrower. In v1.0.0 of his Skills, Matt Pocock replaced `write-a-skill` with `writing-great-skills`, a reference for writing and editing Skills well. Then he spotted a wider use:

> I noticed that I was using it for stuff other than skills.

He was using it for anything an agent read. So v1.2.0 renamed it `writing-for-agents`. The rename was a breaking change with no alias: the old name is gone, and you reinstall under the new one.

```checkpoint quick-10
You installed `writing-great-skills` before v1.2.0. What do you do now?
- [x] Reinstall under the new name, because there's no alias.
- [ ] Nothing, because the old name still works as an alias.
- [ ] Rename its folder yourself, and keep your old install.
Why: The rename was a breaking change with no alias. The old name is gone, so you reinstall under the new one.
```

Matt names one use of the wider scope: pulling an overloaded `AGENTS.md` apart into Skills, so less loads up front.

### How it works underneath

The idea underneath is a budget. An agent can attend to only so much, and every [token](/learn/context-hygiene) in its context spends some of that attention. Anthropic calls this an "attention budget".

Every token in your root `AGENTS.md` loads on every single request, whether or not it's relevant.

The cure is **progressive disclosure**: give the agent only what it needs right now, and point it to other resources when needed. Material behind a pointer costs only the pointer's own line until the agent reaches for it. writing-for-agents applies this to every document an agent reads.

```checkpoint quick-11
Your `AGENTS.md` is overloaded. What does progressive disclosure tell you to do?
- [x] Keep what the agent needs right now, and point to the rest.
- [ ] Keep all of it loaded, in case some of it turns out relevant.
- [ ] Split all of it into smaller files, and load each at the start.
Why: Progressive disclosure gives the agent only what it needs right now, and points it to other resources when needed.
```

Progressive disclosure isn't mainly about saving tokens. It protects the information hierarchy, so reference doesn't bury the steps.

A Skill's description says when to use it, so it's a context pointer too, and Claude Code shows the trade in its own docs. By default, a Skill's description is always in context, and the full Skill loads when invoked. With `disable-model-invocation: true`, the description is not in context. So a description is context load you pay every turn, in exchange for the agent being able to find the Skill.

```checkpoint quick-12
By default, what does a Skill's description cost, and what does it buy?
- [x] Context load every turn, so the agent can find the Skill.
- [ ] Nothing until invoked, since only then is it put in context.
- [ ] Context load once, on the day the Skill is first installed.
Why: By default the description is always in context, and the full Skill loads when invoked. You pay context load every turn, and the agent can find the Skill.
```

```diagram
type: compare
caption: "Claude Code shows the trade in its own docs."
columns: ["By default", "With `disable-model-invocation: true`"]
rows:
  - label: "the description"
    cells: ["is always in context", "is not in context"]
  - label: "the full Skill"
    cells: ["loads when invoked", "loads when invoked"]
```

To find what to cut, use the **no-op test**: delete the line and ask whether the agent's behaviour changed. The answer depends on the model, not on the reader. If two people disagree, settle it by running the document, not by arguing.

```checkpoint quick-13
You and a colleague disagree about whether a line is a no-op. How do you settle it?
- [x] Run the document, and see whether the agent's behaviour changes.
- [ ] Ask whoever wrote the line what they meant it to do for the reader.
- [ ] Keep the line if either of you learned something from reading it.
Why: The answer depends on the model, not on the reader. So you settle it by running the document, not by arguing.
```

Keep a ban only as a hard guardrail you can't phrase positively, and say what to do instead.

Say your booking site's `CLAUDE.md` has these three lines:

```
Migrations change the tables in a database.
The frontend scripts are dev, build and test.
Booking times stay in the studio's local time, because teachers enter them that way.
```

- The first is a no-op. The agent already knows it, so delete it.
- The second is a **cache**: a copy of something the agent can look up, here in `web/package.json`. It goes stale, so delete it.
- The third stays. It gives the reason behind a choice, and the agent can't find that by looking.

```checkpoint quick-14
Which of these lines earns its place in your `CLAUDE.md`?
- [x] The reason behind a choice, which the agent can't look up.
- [ ] A list of scripts the agent can read in `web/package.json`.
- [ ] A note on what a migration is, which the agent already knows.
Why: The reason behind a choice stays, because the agent can't find it by looking. A copy of `web/package.json` goes stale, and a no-op changes nothing.
```

### A real example

The Skill follows its own rules. After the rename, its scope was any document an agent reads, but some of its advice still applied only to Skills. So that advice moved to a new `SKILL-MECHANICS.md`. A line of `SKILL.md` now points to it:

> When the document you're writing is a skill, read `SKILL-MECHANICS.md` for frontmatter, invocation choice, and router skills.

An agent editing a `CLAUDE.md` never needs to open that file.

The same release merged the Skill's old `GLOSSARY.md` into `SKILL.md`, so each term has one authoritative treatment. That's the **single source of truth** rule applied to itself: keep each meaning in one place, so changing it is a one-place edit.

```checkpoint quick-15
Why merge the Skill's old `GLOSSARY.md` into its `SKILL.md`?
- [x] So each term has one place, and a change is a one-place edit.
- [ ] So the agent reads the terms only after it has finished a step.
- [ ] So each term appears twice, and the agent gives it more weight.
Why: That's the single source of truth rule. Each term has one authoritative treatment, so changing it is a one-place edit.
```

### Where it goes wrong

**The agent's draft is long and explains the obvious.** Left alone, the model does that. Use this reference to review the draft. Most of the Skill's value comes from that review pass.

**You asked an agent to trim a document, and it cut what the document did.** Agents told to "streamline" optimise for length, because length is the thing they can see. The no-op test checks behaviour instead, so run it on one line at a time.

```checkpoint quick-16
You tell an agent to streamline a document, and it cuts something the document needed. Why?
- [x] It optimises for length, because that's what it can see.
- [ ] It optimises for behaviour, so the length comes second.
- [ ] It cuts lines at random, as they all look equally useful.
Why: Agents told to streamline optimise for length, because length is the thing they can see. The no-op test checks behaviour instead.
```

**The agent skips a doc it needs.** A weakly worded pointer makes the agent reach the doc unreliably. Sharpen the pointer's wording first, and paste the material into the file only if that fails.

```checkpoint quick-17
The agent skips a doc it needs. What do you try first?
- [x] Sharpen the wording of the pointer to the doc.
- [ ] Paste the whole doc into the main file at once.
- [ ] Rename the doc so that it sorts to the top.
Why: A weakly worded pointer makes the agent reach the doc unreliably. Sharpen its wording first, and paste the material in only if that fails.
```

**The agent ends a step before it's really done.** A vague completion criterion, such as "understanding reached", invites that. Sharpen the wording first, so the agent can tell done from not done.

**Your Skill only works on the one job you built it from.** The usual method is to do the work once, then have the agent write it up as a Skill. That fits one run too closely, and the examples come out too specific. Keep the run as evidence. Then strip what belonged to that repo and those files, and "write for the class of task."

```checkpoint quick-18
Your Skill only works on the one job you built it from. What's the fix?
- [x] Strip what belonged to that repo, and write for the class of task.
- [ ] Run the job a second time, and add that run's examples as well.
- [ ] Keep every example from the run, so the agent sees a real case.
Why: Written up from one run, a Skill fits that run too closely. Keep the run as evidence, then strip what belonged to that repo and those files.
```

**A model-invoked Skill only starts when you name it.** writing-for-agents hit this in Codex, another coding agent, right after the rename. Since v1.2, each of Matt's Skills has a second file beside it, `agents/openai.yaml`, with its settings for Codex. The rename moved that file without updating its contents. So it still said `allow_implicit_invocation: false`, Codex's version of `disable-model-invocation: true`.

```checkpoint quick-19
Why did a model-invoked Skill start only by name in Codex?
- [x] Its `agents/openai.yaml` still said `allow_implicit_invocation: false`.
- [ ] Its `SKILL.md` gained a new `disable-model-invocation: true` line.
- [ ] Its `agents/openai.yaml` got lost when the rename moved the Skill.
Why: The rename moved `agents/openai.yaml` without updating its contents. It kept Codex's version of `disable-model-invocation: true`.
```

The description could never trigger it, and only a literal `$writing-for-agents` mention worked. The choice of who starts a Skill lived in two files, and only one changed. The fix shipped in v1.2.2. So when you change who can start a Skill that has both files, check both files.

### Try it

You'll need your practice project (the Try it in [Issues: keeping track of work](/learn/issues-and-keeping-track) creates it), with its root `CLAUDE.md`, a booking model in `api/`, and `web/`. If anything is missing, ask your agent to set it up. Commit everything first.

1. Add the three example lines above to your root `CLAUDE.md`.
2. Open a fresh session at the repo root.
3. Type `/writing-for-agents List every no-op in my root CLAUDE.md, and every copy of something you can look up.`

   You should see a list of lines.

4. Delete one whole listed line, not a few of its words.
5. Open a fresh session, so the agent starts without that line.
6. Type one small request the line would affect, such as `Add a phone field to the booking model`.
7. Check the agent's work. You should see nothing the line would have prevented. If you do, put it back.
8. Undo the agent's change, keeping your `CLAUDE.md` edit: `git restore api web`.
9. Delete any new files the agent made.
10. Repeat from step 4 for each line on the list.

You should see `CLAUDE.md` get shorter while the agent behaves the same.

### Read more

- [The /writing-for-agents Skill](https://www.aihero.dev/skills-writing-for-agents), Matt Pocock, updated 2026-08-24
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, video, 2026-08-05
- [A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md), Matt Pocock, updated 2026-01-18
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), Anthropic Applied AI team, 2025-09-29
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic, Claude Code docs
- [writing-for-agents: OpenAI metadata still disables model invocation after rename](https://github.com/mattpocock/skills/issues/748), myxvisual, GitHub issue, 2026-08-05
- [fix: make writing-for-agents model-invokable in Codex](https://github.com/mattpocock/skills/pull/766), Matt Pocock, pull request, 2026-08-05

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint writing-for-agents-deeper-one-run
You booked a class end to end in your yoga-studio API, then had the agent write the session up as a Skill. The next week the Skill fails on a different endpoint, because its steps name the exact files and the one booking from that run. You're told to strip those out and write it for the whole class of task. Why?
- [x] A Skill written up from one run fits that run too closely, with examples too specific.
- [ ] Skills can't name files at all, so any path in one stops the agent from loading it.
  > Naming a file isn't banned. The trouble is that the steps belong to one run, not the class of task.
- [ ] The Skill's description grew too long, so the agent never picked it for the new endpoint.
  > The Skill did run. It failed because its steps were fitted to the first run's files.
- [ ] A Skill should be rewritten from scratch each week, so it matches the latest code.
  > Matt keeps the run as evidence and generalises it on purpose. Weekly rewrites aren't the fix.
Why: Write-ups from one run carry that run's details, so they fit it too closely and fail on the next job. Keep the run as evidence. Then strip what belonged to that repo and those files, and write for the class of task.
```

## Remember

```flashcards
Q: In writing-for-agents, what are the two loads?
A: Context load, what always-loaded text costs the agent on every turn, and cognitive load, what it costs you to remember which documents exist and when to use each.

Q: What does `disable-model-invocation: true` do to a Skill?
A: It makes the Skill user-invoked. Only you, typing its name, can start it, and it costs no context load.

Q: In writing-for-agents, what is a completion criterion?
A: The condition at the end of a step that tells the agent the work is done.

Q: When does the agent reach for writing-for-agents?
A: When it creates or edits a Skill, or changes AGENTS.md or CLAUDE.md.

Q: What was writing-for-agents called before v1.2.0, and what did it replace in v1.0.0?
A: It was writing-great-skills, which replaced `write-a-skill` in v1.0.0. v1.2.0 renamed it, with no alias.

Q: How does writing-for-agents test whether a line is a no-op?
A: Delete it and ask whether the agent's behaviour changed. If people disagree, settle it by running the document, not by arguing.

Q: What is writing-for-agents' default fix for a document?
A: To delete, not to explain. An agent writing for another agent spends most of its words on what the model already knows.
```

## Final test

```final-test writing-for-agents-context-pointer
In writing-for-agents, what is a context pointer?
- [x] A line in context that names material kept elsewhere, and when to read it.
- [ ] A copy of the material it needs, pasted inline so the agent has it to hand.
- [ ] The spot in the context window where the agent's attention is right now.
- [ ] A code comment that tells a human reader which file to open next.
Why: A context pointer stays in the agent's context so the material itself doesn't have to. It names what's kept elsewhere and says when to reach for it. A Skill's description is one, and so is a line in `AGENTS.md` that names a doc.
```

```final-test writing-for-agents-hand-only
You're writing a Skill that should only ever run when you type its name. What should you do?
- [ ] Write a description that lists every trigger word you type.
- [x] Make it user-invoked: set `disable-model-invocation: true`.
- [ ] Move its steps into AGENTS.md so they load on every turn.
- [ ] Keep it model-invoked, with 'only when asked' in its description.
Why: If a Skill only ever runs by hand, the agent has no need to find it. So make it user-invoked. The agent then never sees its description, and the Skill costs no context load.
```

```final-test writing-for-agents-positive
Your CLAUDE.md says "Never use print() for logging." How should you reword it?
- [ ] Write it as NEVER use print(), in capitals, so it stands out.
- [ ] Move the ban into its own file, behind a pointer in CLAUDE.md.
- [ ] Soften it to "Please try not to use print() for logging."
- [x] Say what to do instead, like "Log with the logging module."
Why: A ban puts the banned behaviour in the agent's context, which makes it easier to reach for, not harder. So say what you want instead. The banned behaviour then never gets mentioned.
```

```final-test writing-for-agents-deeper-rename
Why did Matt rename writing-great-skills to writing-for-agents in v1.2.0?
- [x] He found he was using it for anything an agent reads, not only for Skills.
- [ ] Codex refused Skill names with "great" in them, so it needed a plainer name.
- [ ] It was merged with a second Skill that wrote AGENTS.md files from scratch.
- [ ] He wanted it user-invoked, so only a human typing its new name could start it.
Why: Matt noticed he was using the Skill on more than Skills, on anything an agent read. The name no longer matched the use. So v1.2.0 renamed it, and it now covers any document an agent reads.
```

```final-test writing-for-agents-deeper-codex
Right after the rename, writing-for-agents broke in Codex. What was wrong?
- [x] Its `agents/openai.yaml` still kept it from the agent, so only `$writing-for-agents` worked.
- [ ] Its SKILL.md still had `disable-model-invocation: true`, so Claude Code hid its description.
- [ ] Its SKILL-MECHANICS.md was missing, so Codex failed to load the Skill's front matter.
- [ ] Its description was over Codex's length limit, so Codex cut it off before the triggers.
Why: The rename moved `agents/openai.yaml` without updating what was in it. The file still told Codex to keep the Skill away from the agent. So the description could never trigger it, and only a literal mention worked.
```

```final-test writing-for-agents-migration-pointer
You're adding a line to your FastAPI repo's CLAUDE.md that points agents at docs/migrations.md. You want to word it so the agent reads that file exactly when it writes a SQL migration, and not otherwise. Which fits best?
- [x] Use the reference for writing documents that agents read.
  > Right: that's `/writing-for-agents`.
- [ ] Look back over the last session and suggest changes to the agent's setup.
  > That's `/retro`. You already know the change you want. What you need now is how to word it.
- [ ] Sharpen the project's domain language in GLOSSARY.md.
  > That's `/domain-modeling`. That's about your project's own words, not about how agents reach a doc.
- [ ] Design the shape of a code module with the deep-module vocabulary.
  > That's `/codebase-design`. That's for the shape of code, not for a line in CLAUDE.md.
Why: A line in CLAUDE.md that names a doc is a context pointer. Its wording, not the doc it names, decides when the agent reads the doc. So you need the reference that covers how to write pointers.
```

```final-test writing-for-agents-after-retro
A build of your Docker setup went sideways. Before clearing the session, you had the agent look back over it, and it suggested adding a line to AGENTS.md about where the compose file lives. What comes next?
- [x] Write that AGENTS.md line with the reference for documents agents read.
  > Right: that's `/writing-for-agents`.
- [ ] Start the next Ticket straight away and leave AGENTS.md as it is.
  > That's `/implement`. The suggestion is what makes the next build start from a better setup. Skipping it leaves the next build with the same setup.
- [ ] Run a two-axis review of the Docker diff against your standards.
  > That's `/code-review`. That reviews the code. The suggestion is about the agent's setup, not the code.
- [ ] Open the suggestion as an Issue and move it through triage before writing it.
  > That's `/triage`. Triage is for raw incoming Issues, such as bug reports. This is a change you already decided to make.
Why: The look-back only suggests the change to the agent's environment. You still have to write the line well, and that's the job of the reference for documents agents read. The next build then starts from a better environment.
```

```final-test writing-for-agents-npm-scripts
Your website's CLAUDE.md lists every npm script and what it does. The same scripts are in package.json. You're told to cut the list from CLAUDE.md. Why?
- [x] It copies package.json and goes stale. Leave one-file lookups to the agent.
- [ ] Agents read package.json more reliably than Markdown, so the list confuses them.
  > The format isn't the problem. The list is a copy of package.json, and a copy goes stale.
- [ ] CLAUDE.md has a hard cap on lines, and a long script list fills it up fast.
  > A line count isn't the reason. The list is a copy of package.json, and a copy goes stale.
- [ ] Scripts belong in a separate doc behind a pointer, read only when needed.
  > A separate doc is still a copy that goes stale. Leave the lookup to package.json itself.
Why: The scripts already live in package.json, where the agent can look them up. A list in CLAUDE.md is only a copy, and a copy goes stale. Keep what the agent can't find by looking, like an unwritten convention or the reason behind a choice.
```

```final-test writing-for-agents-flag-table
You're writing a Skill that walks an agent through deploying your Python backend. One step needs a long table of Docker flags that only some deployments use. You move the table into its own file, with a line in the Skill saying when to read it. Why?
- [x] What only some runs need, left inline, buries the steps the agent must follow.
- [ ] A SKILL.md can't hold tables, so any table has to live in its own file.
  > It can. The table moves out because only some runs need it.
- [ ] It's mainly to save tokens, since the long flag table no longer loads on every run.
  > Saving tokens isn't the main point. Reference left in the file buries the steps, so the agent may not attend to them.
- [ ] So humans reading the Skill don't have to scroll past the long table.
  > The point is the agent, not a human reader. Reference left in the file buries the steps the agent follows.
Why: Keep in the file what every run needs, and move out what only some runs need. Left in the file, the table buries the steps. Whether the agent attends to them then becomes a coin-flip.
```

```final-test writing-for-agents-deeper-streamline
You asked an agent to streamline your yoga-studio repo's CLAUDE.md. It came back half as long, and now agents forget to write an Alembic migration when they change a model. You're told to redo it by deleting one line at a time and checking the agent's behaviour after each. Why?
- [x] Told to streamline, an agent cuts for length, which it can see. Only behaviour shows a no-op.
- [ ] Short files load faster, so the redo is only about how fast the agent starts each session.
  > Speed isn't the point. The trim cut a line that changed behaviour, and only checking behaviour finds the real no-ops.
- [ ] Agents ignore any CLAUDE.md under a set length, so the file has to keep its old size to work.
  > Nothing sets such a floor. Matt's sign that it's working is that the document gets shorter as it gets better.
- [ ] Deleting one line at a time keeps the git diff small, so a reviewer can follow every change.
  > A small diff is a side effect. The reason is that the no-op test checks behaviour, not length or style.
Why: An agent told to "streamline" cuts for length, because length is what it can see. Length says nothing about which lines do real work. Only deleting a line and checking the agent's behaviour shows that.
```

```sources
- [writing-for-agents: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL.md), Matt Pocock's Skills
- [writing-for-agents: SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL-MECHANICS.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me](https://www.youtube.com/watch?v=gaDdrDdczO4), Matt Pocock, 2026-08-05
- [v1.2: /wait-what, /writing-for-agents, Claude Code Plugin, and more](https://www.aihero.dev/skills/skills-changelog-v12-wait-what-writing-for-agents-claude-code-plugin-and-more), Matt Pocock, 2026-08-05
- [The /writing-for-agents Skill](https://www.aihero.dev/skills-writing-for-agents), Matt Pocock, 2026-08-24
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), Anthropic Applied AI team, 2025-09-29
- [A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md), Matt Pocock, 2026-01-18 (updated)
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [writing-for-agents: OpenAI metadata still disables model invocation after rename](https://github.com/mattpocock/skills/issues/748), myxvisual, 2026-08-05
- [fix: make writing-for-agents model-invokable in Codex](https://github.com/mattpocock/skills/pull/766), mattpocock, 2026-08-05
- [The /retro Skill](https://www.aihero.dev/skills-retro), Matt Pocock, 2026-10-05
```
