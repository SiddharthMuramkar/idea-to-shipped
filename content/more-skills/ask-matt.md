---
title: ask-matt
slug: ask-matt
summary: ask-matt is a router: one Skill that names the others and when to reach for each.
---

## What it's for

Say you have an idea for the Booking API, but you can't remember which Skill comes first or what follows. You don't remember every Skill, so you ask.

**ask-matt is a router: one Skill that names the others and when to reach for each.**

For example, you type:

```
/ask-matt I want to build the Booking API. Where do I start?
```

It might answer:

```
You're in a repo, so start at the top of the main flow.
Type /grill-with-docs. If the build spans sessions,
/to-spec and /to-tickets come next. Don't clear or
compact until /to-tickets has run.
```

It names what to type, then stops. A router can only hint, so you start the Skill yourself.

```checkpoint quick-1
ask-matt has told you to type /grill-with-docs. What happens next?
- [x] Nothing, until you type /grill-with-docs yourself.
- [ ] It starts /grill-with-docs for you once it has answered.
- [ ] The agent waits a moment, then starts it unless you say no.
Why: It names what to type, then stops. A router can only hint, so you start the Skill yourself.
```

Before it says what a Skill does, or that you can skip a step, it reads that Skill's own `SKILL.md`. Its summaries are only for orientation.

```checkpoint quick-2
You ask the router whether you can skip to-spec. What does it do before it answers?
- [x] It reads to-spec's own SKILL.md.
- [ ] It relies on its own summary.
- [ ] It asks you to paste in to-spec's SKILL.md.
Why: Its own summaries are only for orientation. So before it says a step can be skipped, it reads that Skill's own SKILL.md.
```

It covers the main flow, the on-ramps that merge onto it, codebase upkeep, vocabulary Skills such as [domain-modeling](/learn/domain-modeling), and the standalone Skills. On-ramps are starting points such as a bug. Upkeep Skills tend an existing codebase; vocabulary Skills fix shared terms. Standalone Skills sit outside the flow.

```checkpoint quick-3
You want a standalone Skill, not the main flow. Can ask-matt still help?
- [x] Yes: it covers the standalone Skills as well as the main flow.
- [ ] No: it covers the main flow, and nothing outside that.
- [ ] No: it covers only the main flow and the on-ramps that join it.
Why: It covers the main flow, the on-ramps, codebase upkeep, vocabulary Skills such as domain-modeling, and the standalone Skills.
```

It also helps at a [phase boundary](/learn/context-hygiene), the gap between two phases. Check your five options top to bottom; the first yes wins:

1. **Continue**, if the next phase needs this one as it happened, or fits in the smart zone left.
2. **`/clear`**, if nothing here matters to what's next.
3. **`/handoff`**, only for a new harness (another agent tool), a new folder or repo, a colleague, or a side job.
4. **A subagent**, if a tightly scoped job can run without you. This session stays untouched.
5. **`/compact`**, otherwise. It's the default, but the last to reach for, as the four above are cheaper or more precise.

```checkpoint quick-4
At a boundary, the next phase can use a summary but won't fit the room left. Some of this matters, nothing is moving, and you need to steer. Which option fits?
- [x] `/compact`, because the four options above it all said no.
- [ ] `/clear`, because it's the cheapest way to free up the window.
- [ ] `/handoff`, because it's the general way to move between sessions.
- [ ] A subagent, because it gives the next phase its own fresh window.
Why: A summary will do and there's no room, so Continue is out. /clear needs nothing to matter. /handoff is only for a new harness, folder, colleague or side job. A subagent needs a job that runs without you. That leaves /compact.
```

```diagram
type: chain
caption: "Check your five options top to bottom; the first yes wins"
steps:
  - "Continue"
  - "`/clear`"
  - "`/handoff`"
  - "A subagent"
  - label: "`/compact`"
    note: "the default"
groups:
  - from: 1
    to: 4
    label: "cheaper or more precise"
```

Mid-phase there's nothing to decide: continue, or split what's left into subagents. Compacting mid-phase loses the thread.

```checkpoint quick-5
You're halfway through building, and you wonder whether to compact now. What do you do?
- [x] Carry on, or split what's left into subagents.
- [ ] Compact now, to give the phase more room.
- [ ] Clear now, and have the agent reread the diff to catch up.
Why: Mid-phase there's nothing to decide: continue, or split what's left into subagents. Compacting mid-phase makes the agent lose the thread.
```

## When to use it

- You can't remember which Skill fits, or what comes next in a Flow.
- You have two Skills that look alike, and you want the line between them.
- You're at a phase boundary and unsure which option fits.

```checkpoint quick-6
You've finished grilling, and you don't know whether to clear or compact. Does ask-matt fit?
- [x] Yes: being unsure at a phase boundary is one of its uses.
- [ ] No: it names Skills, so choices about the session are out of scope.
- [ ] No: it only helps before you've started any phase of the work.
Why: Being at a phase boundary, and unsure which option fits, is one of the three situations ask-matt is for.
```

## When not to use it

- If an effort is too big and foggy for one session, use [wayfinder](/learn/wayfinder) instead, because it charts a map of decision tickets. ask-matt can only point you at it.
- If you've already picked a Skill, type it yourself.

```checkpoint quick-7
A whole new product is too foggy to plan in one session. Which Skill do you use?
- [x] wayfinder, because it charts a map of decision tickets.
- [ ] ask-matt, because its answer charts that map for you.
- [ ] ask-matt, because it's the one Skill you need to remember.
Why: wayfinder charts the map of decision tickets. ask-matt only names what to type next, so it isn't the Skill that does that work.
```

## What it needs to start

Your situation, in your own words, and Matt's Skills installed. Only you can start it, by typing `/ask-matt`.

```checkpoint quick-8
You're stuck on your project, and you haven't typed anything. Will the agent start ask-matt for you?
- [x] No: only you can start it, by typing /ask-matt.
- [ ] Yes: the agent starts it whenever you seem stuck.
- [ ] Yes: it runs by itself at the start of every session.
Why: ask-matt needs your situation in your own words, and only you can start it.
```

## What it creates

An answer in the conversation: which Skill or Flow fits, and why. Nothing on disk, and no Issues, branches or pull requests.

```checkpoint quick-9
ask-matt has answered you. You go looking for what it left behind. What do you find?
- [x] Nothing on disk: the answer stays in the conversation.
- [ ] A new Issue on the tracker for the Skill it recommended.
- [ ] A branch with the first step of the route already done.
Why: You get an answer in the conversation. There's nothing on disk, and no Issues, branches or pull requests.
```

## Going deeper

### Why it exists

People kept asking Matt for one list of the Skills in the right order. A fixed list can't do that job, because the right next step depends on your situation.

Matt's reasoning: a static table would "be wrong for most situations". The parts that matter are the branches. Is there a codebase? Does the build span sessions? Can talking settle the question?

```checkpoint quick-10
Someone proposes replacing ask-matt with one fixed table of Skills in order. What's wrong with that?
- [x] It would be wrong for most situations, because the branches matter.
- [ ] It would be right in most situations, but far too slow to read.
- [ ] Nothing's wrong, since one fixed table is all that ask-matt is.
Why: A static table would be wrong for most situations. The parts that matter are the branches: is there a codebase, does the build span sessions, can talking settle the question?
```

So ask-matt is that list, with the branches kept in. It shipped in version 1.0.0 of Matt's repo, as a router you start yourself.

### How it works underneath

**It places you on a Flow.** A keyword match would hand you one Skill. ask-matt does something different: "the router places you at a step on a flow." Most work travels the main flow, from idea to shipped: grill-with-docs, an optional prototype detour, to-spec, to-tickets, implement or implement-spec, then retro. If the build fits one session, you skip to-spec and to-tickets and run implement right there. implement-spec only works from a Spec's Tickets.

```checkpoint quick-11
You describe your situation to ask-matt. What kind of answer should you expect?
- [x] A place at a step on a Flow, with the route from there.
- [ ] The one Skill whose description best matches your keywords.
- [ ] The one Skill you used most recently for similar work.
Why: A keyword match would hand you one Skill. ask-matt places you at a step on a Flow, such as the main flow.
```

```diagram
type: chain
caption: "the main flow, from idea to shipped"
steps:
  - label: "[grill-with-docs](/learn/grill-with-docs)"
    note: "an optional [prototype](/learn/prototype) detour"
  - "[to-spec](/learn/to-spec)"
  - "[to-tickets](/learn/to-tickets)"
  - "[implement](/learn/implement) or [implement-spec](/learn/implement-spec)"
  - "[retro](/learn/retro)"
groups:
  - from: 2
    to: 3
    label: "If the build spans sessions"
```

Its answer comes back as prose, because prose can carry the branches: where you decide, and where to clear or compact.

**Why a router has to exist.** A Skill's **description** is the short line at the top of its `SKILL.md` that says what it's for or when to use it. Every Skill pays one of two costs for it, the two loads from [writing-for-agents](/learn/writing-for-agents). A model-invoked Skill pays context load: its description stays loaded at all times, so the agent can find it.

A user-invoked Skill pays cognitive load: "you are the index that must remember it exists". With `disable-model-invocation: true`, you can invoke the Skill, but Claude can't invoke it on its own. Its description isn't in context.

```checkpoint quick-12
You're about to add a user-invoked Skill to your repo. What cost does it bring?
- [x] Cognitive load: you must remember that it exists.
- [ ] Context load: the agent always has its description loaded.
- [ ] Both loads: it costs the agent and you.
Why: A user-invoked Skill's description isn't in context, so it costs the agent nothing there. You pay instead, because you are the index that must remember it exists.
```

When user-invoked Skills pile up past what you can remember, a router Skill cures the piled-up cognitive load. You remember one Skill instead of many.

```diagram
type: compare
caption: "Every Skill pays one of two costs"
columns: ["A model-invoked Skill", "A user-invoked Skill"]
rows:
  - label: "pays"
    cells: ["context load", "cognitive load"]
  - label: "its description stays loaded"
    cells: ["yes", "no"]
footer: "a router Skill cures the piled-up cognitive load."
```

**A map kept by hand.** It isn't a scan of what you installed. It's Matt's "hand-written map" of the Skills in his repo, so it won't route you over your own Skills or another author's. It also knows only the Skills his plugin ships, so it won't name setup-pre-commit. The price is that it lags behind the repo. Version 1.1.0 had to add five Skills it was missing. That release also added a rule to the repo's `CLAUDE.md`: adding, renaming or removing a Skill, or changing a flow, triggers a re-check of ask-matt.

```checkpoint quick-13
You wrote your own Skill and installed it. You ask the router which Skill fits. What happens?
- [x] It won't route you there, because its map covers Matt's repo.
- [ ] It can route you there, because it scans what you installed.
- [ ] It can route you there, once a re-check of its map has run.
Why: It's Matt's hand-written map of the Skills in his repo, so it won't route you over your own Skills or another author's.
```

**A secondary source.** So the router is a secondary source: a summary of the Skills, not the Skills themselves. Where the router and a `SKILL.md` disagree, the `SKILL.md` is right.

### A real example

In his July 2026 tutorial, Matt has finished setting up a repo and wants to make some code changes. He calls ask-matt "essentially me as a skill". Then he asks it how to get started, and what the main flow is.

The answer tells him to start at the top of the main flow and walk down it in "one unbroken context window." Its first named step is grill-with-docs.

```checkpoint quick-14
You have a codebase, and you ask the router where to start. What does it say about your session?
- [x] Start at the top of the main flow, and stay in one unbroken context window.
- [ ] Clear the context window before each step of the main flow, so every step starts fresh.
- [ ] Compact the context window after each step, to keep each summary short.
Why: It says to start at the top of the main flow and walk down it in one unbroken context window. Its first named step is grill-with-docs. Today's SKILL.md keeps that window until after to-tickets; each implement then starts fresh.
```

Matt's comment shows what the router adds: it's "really telling you how to use your sessions as well." A list of names wouldn't do that.

One detail has aged. In the video, grill-with-docs records what it learns in `context.md`. Version 1.3.0 renamed that file to `GLOSSARY.md`, so today's `SKILL.md` says `GLOSSARY.md`.

### Where it goes wrong

**It says half the Skills aren't installed.** The harness, here Claude Code, leaves user-invoked Skills out of the skill list it gives the agent. Most of the Skills ask-matt routes you through are left out that way, including grill-with-docs, to-spec, to-tickets, implement and wayfinder. The agent reads its list as complete and "concludes they are not installed". In one session, it sent the user to `/grilling` and `/tdd` on their own instead.

The fix, in a terminal: type the slash command anyway. Another user, on version 1.2.0, found that "Running /grill-with-docs myself loaded it fine." It's a known bug, and issue #740 was still open in October 2026.

```checkpoint quick-15
In a terminal, ask-matt says to-spec isn't installed, but you know you installed it. What do you do?
- [x] Type /to-spec yourself: it's a known bug, and the Skill still loads.
- [ ] Install to-spec again: the message means your install has failed.
- [ ] Follow its other route: a Skill reported missing can't be loaded.
Why: This is a known bug, so the fix in a terminal is to type the slash command anyway. Another user found that running /grill-with-docs by hand loaded it fine.
```

**It told you to skip a step, and the step mattered.** It used to answer from its own summaries. In issue #614, it judged to-spec from a "one-line gloss in the router's own document", and never opened to-spec's `SKILL.md`. The user skipped to-spec and ran to-tickets, which made 12 Tickets. One Ticket named two places to change in an 885-line file, which had at least 7. That undercount began in the grilling, but to-spec would very likely have caught it.

The fix: pull request #1194 added the rule to read first, and version 1.3.2 shipped it in October 2026. Matt's page still calls this bug "not fixed", but today's `SKILL.md` has the rule, so the `SKILL.md` decides. The page's habit is still worth keeping: before you act on a claim about another Skill, ask it to open that `SKILL.md` first.

```checkpoint quick-16
ask-matt tells you to skip to-spec, and you're about to act on that. What's the habit worth keeping?
- [x] Ask it to open to-spec's SKILL.md, to check its claim.
- [ ] Go by Matt's page, which outranks the SKILL.md.
- [ ] Skip to-spec, since version 1.3.2 made every answer right.
Why: Version 1.3.2 added the rule to read first, but the habit is still worth keeping. Before you act on a claim about another Skill, ask it to open that SKILL.md first.
```

**It told you to edit a `SKILL.md`.** Someone asked how to make implement close Tickets, and it said to add a line to the Skill. That advice is often correct, but the edit rarely lasts. `npx skills update`, the command that refreshes your installed Skills, overwrites the file. A plugin install, a bundle of Skills you install together, is read-only. So put standing behaviour in your own `CLAUDE.md` or `AGENTS.md`.

```checkpoint quick-17
You want implement to close Tickets on every future run. Where does that line go?
- [x] In your own CLAUDE.md or AGENTS.md, as standing behaviour.
- [ ] In implement's SKILL.md, added back after each update.
- [ ] In ask-matt's SKILL.md, so that the router can tell implement.
Why: `npx skills update` overwrites a Skill's file, and a plugin install is read-only. So standing behaviour goes in your own CLAUDE.md or AGENTS.md.
```

**It sent you to a Skill your repo isn't set up for.** Routes that need the Issue tracker (triage, to-spec, to-tickets, implement) assume [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) has run. The router recommends them even before that. So run setup-matt-pocock-skills first.

### Try it

Ask the router about a real next step, then check its answer. You'll need your practice project, the yoga-studio booking site, with Matt's Skills installed. If you haven't set it up, do keeping-track's Try it step first.

1. In a terminal, go to the project's root: `cd yoga-studio`.
2. Start Claude Code: `claude`.
3. Type `/ask-matt I want to add an endpoint in api/ that cancels a booking. Where do I start?` You should see an answer that names the Skill to type next.
4. Check the answer against Matt's signs that it's working:
   - It ends by naming what to type, and stops there.
   - It says where to clear or compact context, not only which Skills.
   - Any claim about another Skill shows up as it reading that Skill's `SKILL.md`.
5. Type `I've finished grilling, and building comes next. Do I continue, clear or compact?` You should see it start with Continue, because grilling to building is the standard yes.

If it says a Skill isn't installed, that's the known bug from Where it goes wrong, so ignore it here. Don't start the work it names yet. This step is only about reading the route.

### Read more

- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, updated 2026-08-24
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [ask-matt should verify the relevant SKILL.md before asserting or skipping workflow steps (#614)](https://github.com/mattpocock/skills/issues/614), maximumaliens, 2026-07-18
- [ask-matt names five skills the agent cannot see, so it reports them as not installed (#740)](https://github.com/mattpocock/skills/issues/740), drormeir, 2026-08-04
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic, fetched 2026-10-30
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock, fetched 2026-10-30

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint ask-matt-deeper-skip-to-spec
In your yoga-studio repo you describe a booking feature to /ask-matt. It says to skip to-spec, since that only turns the thread into a spec, and go straight to to-tickets. You're about to act on it. Why ask it to open to-spec's SKILL.md first? What's the reason behind this step?
- [x] Its one-line summaries are for orientation only, so a skip needs the Skill's own file behind it.
- [ ] Opening the file is what installs to-spec, since the router can't name a Skill it hasn't loaded.
  > Opening a file installs nothing. The rule is that the router's summaries are for orientation only, so a skip needs that Skill's own SKILL.md behind it.
- [ ] Reading to-spec's file makes the router run to-spec for you, so you don't have to type it.
  > It recommends and stops; it never fires the Skill it names. Reading the file only checks the claim behind the skip.
- [ ] to-spec can't run until its SKILL.md is open in the session, so the skip would fail anyway.
  > Typing /to-spec loads it. Opening the file is only about checking the claim behind the skip.
Why: A one-line summary can't show what a step really does, so a skip needs the Skill's own file behind it. In issue #614, to-spec was skipped on its summary. One of the 12 Tickets made afterwards named two places in an 885-line file that had at least 7. to-spec's seam step would very likely have caught that undercount, and that's how a Ticket stays sized to its real work.
```

```checkpoint ask-matt-deeper-edit-skill-file
/ask-matt tells you to make implement close Tickets by adding a line to implement's SKILL.md. You want the change to stick in your yoga-studio repo for every future run. Why put it in the repo's own CLAUDE.md instead? What's the reason behind this step?
- [x] npx skills update overwrites the Skill's file, so standing behaviour belongs in your own CLAUDE.md.
- [ ] Claude Code refuses to load a SKILL.md that's been edited by hand, so the Skill would stop working.
  > No source says that. The real problem is that npx skills update overwrites the file, and the plugin install is read-only.
- [ ] A line in implement's SKILL.md would only change the router's map, not what implement itself does.
  > A line in implement's SKILL.md would change implement. It just doesn't last: npx skills update overwrites the file.
- [ ] CLAUDE.md is read after every Skill, so its line always wins over whatever the Skill's file says.
  > That isn't the reason Matt gives. He points at updates: npx skills update overwrites a SKILL.md, so standing behaviour goes in your own CLAUDE.md or AGENTS.md.
Why: Editing the Skill's file is often correct, but the edit rarely lasts: npx skills update overwrites the file, and the plugin install is read-only. So standing behaviour goes in your own CLAUDE.md or AGENTS.md, part of the agent's environment that you own.
```

## Remember

```flashcards
Q: What does ask-matt create?
A: An answer in the conversation about which Skill or Flow fits. As a router it can only hint; you start the Skill yourself.

Q: At a phase boundary, what are the five options, in the order you check them?
A: Continue, /clear, /handoff, a subagent, then /compact. The first yes wins.

Q: When is /handoff the right move at a phase boundary?
A: Only for a new harness, a new folder or repo, a colleague, or a side job you found mid-phase.

Q: What are your options in the middle of a phase, not at a boundary?
A: Continue, or split the rest of the work into subagents. Compacting mid-phase makes the agent lose the thread.

Q: When ask-matt and a Skill's SKILL.md disagree, which one is right?
A: The SKILL.md. The router is a secondary source: a map kept by hand, which lags behind the repo.

Q: Can ask-matt route you over Skills you wrote yourself, or another author's?
A: No. It's a hand-written map of the Skills in Matt's repo, not a scan of what you have installed.

Q: Which load does a user-invoked Skill spend, and what cures it when they pile up?
A: Cognitive load: you must remember it exists, since its description isn't in context. A router Skill cures it, as one Skill to remember.
```

## Final test

```final-test ask-matt-what-it-is
What kind of Skill is ask-matt?
- [x] A router that names each Skill and when to use it, but can't start one.
- [ ] An interview that asks one question at a time until your plan is clear.
- [ ] A shared map of decision tickets for a huge, foggy new project.
- [ ] A runner that starts the right Skills for you, one after another.
Why: A router names the other Skills and when to use each, so you have one Skill to remember. It can only hint, so you start the Skill it names yourself.
```

```final-test ask-matt-reads-first
Before ask-matt tells you what a Skill does, or that you can skip a step, what does it read?
- [ ] Your GLOSSARY.md.
- [x] That Skill's own SKILL.md.
- [ ] The last pull request in the repo.
Why: Its own summaries are only for orientation. So before it says what a Skill does, or that a step can be skipped, it reads that Skill's own SKILL.md.
```

```final-test ask-matt-compact-place
At a phase boundary, where does /compact sit among the five options?
- [ ] First. It's the default, so you reach for it before the others.
- [ ] Third, as the move for a new harness, directory or colleague.
- [x] Last. It's the default once the four questions above it say no.
- [ ] Second, right after Continue, as the cheap way to free the window.
Why: You check the options top to bottom, and the first yes wins. /compact sits at the bottom as the default, because the four options above it are cheaper or more precise.
```

```final-test ask-matt-deeper-which-source-decides
Matt's page calls the summaries bug "not fixed", but the current SKILL.md tells ask-matt to read a Skill's SKILL.md first. Which do you trust?
- [x] The SKILL.md, because it has the rule, and the changelog says version 1.3.2 shipped it.
- [ ] Matt's page, because it's his own explainer and the SKILL.md is only the agent's summary of it.
- [ ] Issue #614, because a user's bug report outranks both the page and the file.
- [ ] Version 1.0.0's release note, because the first release fixes how the router is meant to behave.
Why: The file itself has the rule, and the changelog says version 1.3.2 shipped it. The release page dates that version to October 2026. So the "not fixed" on Matt's page is out of date.
```

```final-test ask-matt-deeper-not-installed
Right after /ask-matt, the agent says to-spec and to-tickets aren't installed. What's the likely cause?
- [x] They're user-invoked, so the harness leaves their descriptions out of the agent's skill list.
- [ ] The router scans your local skills folder, and it found no copy of either Skill in there.
- [ ] Both only load once setup-matt-pocock-skills has configured an Issue tracker for the repo.
- [ ] They were retired into other Skills, and the router's map still names their old entries.
Why: The harness leaves user-invoked Skills out of the skill list it gives the agent. The agent reads that list as complete, so it reports them missing. They are installed, so in a terminal, type the slash command anyway.
```

```final-test ask-matt-where-to-start
You have an idea for a new endpoint in your FastAPI backend. You've forgotten which Skill the work starts with and what follows it, and you want the map of the Skills before you begin. Which fits best?
- [x] Ask the router that names each Skill and when to reach for it.
  > Right: that's `/ask-matt`.
- [ ] Chart a shared map of decision tickets on the Issue tracker.
  > That's `/wayfinder`. That's for a huge, foggy effort too big for one session, never a well-scoped feature like one endpoint.
- [ ] Get interviewed about the endpoint idea, with nothing saved to disk.
  > That's `/grill-me`. You're in a working directory, and an interview doesn't show you the map of what comes after it.
- [ ] Read the reference for writing Skills and the documents agents use.
  > That's `/writing-for-agents`. That's about writing Skills and instruction files, not about which Skill fits your work.
Why: You can't remember which Skill comes first, so you ask the router. For an idea like this, it points you at the top of the main flow, where you grill the idea before anything is built.
```

```final-test ask-matt-continue-after-grilling
In one session you've just finished grilling the plan for a booking API in FastAPI, and there's plenty of room left in the context window. The next phase is building it. Why carry on in this same session instead of compacting first? What's the reason behind this step?
- [x] The build wants the grilling's reasoning as it happened, not a summary of it.
- [ ] Compacting deletes this session, so you couldn't come back to it later.
  > That's not the reason. The cost of compacting is that the summary is lossy.
- [ ] Grilling and building have to share one session, however full it gets.
  > Room in the window matters. Near the limit, you'd compact at the boundary instead.
- [ ] Moving on would need a handoff file first, and writing a good one takes too long.
  > Compacting seeds a fresh session by itself, with no file. Its real cost is a lossy summary.
Why: Continue is the first option to rule out at a boundary, and grilling to building is the standard yes. The build wants your reasoning as it happened. `/compact` and `/handoff` swap that primary source for a summary, which loses detail, and `/clear` keeps nothing.
```

```final-test ask-matt-new-harness
You've finished grilling a change to your Docker setup with Claude, and you want to build it with Codex, a different agent tool, which can't see this session. You need the decisions to travel with you. Which fits best?
- [x] Write the session into a portable file and start the new tool from it.
  > Right: that's `/handoff`.
- [ ] Have a background agent write a cited Markdown file from primary sources.
  > That's `/research`. That reads outside sources. It doesn't carry this session's decisions anywhere.
- [ ] Generate an interactive script for steps only a human can take.
  > That's `/wizard`. That's for things like setting up credentials, not for moving a session to another tool.
- [ ] Get interviewed again in the new tool, so it learns the decisions.
  > That's `/grill-me`. That starts the thinking over. It doesn't carry this session's decisions to the new tool.
Why: A new harness, the agent tool you run, is one of the few cases that need a handoff. What handoff buys is portability, a file that travels to the new tool with your decisions in it.
```

```final-test ask-matt-afk-review
At a phase boundary, the next job is an automated review of the diff for your SQL migration. It needs no steering from you. Why send it to a subagent instead of running it here? What's the reason behind this step?
- [x] It runs without you in its own window, and this session stays untouched.
- [ ] A subagent gets a larger context window, so it can hold the whole diff at once.
  > Window size isn't the point. What matters is that it runs without you, and this session stays untouched.
- [ ] A subagent's review is more thorough than one done in this session.
  > Thoroughness isn't the reason. It's that the work runs on its own, away from this window.
- [ ] A subagent can pass its report straight to a colleague, unlike this session.
  > Sending work to a colleague is a hand-off's job. A subagent reports back to you, and this session stays untouched.
Why: The review needs no steering, so it can run AFK, with you away from the keyboard. A subagent does it in its own window and reports back, so this session stays untouched. Automated review is the standard case.
```

```final-test ask-matt-after-tickets
On a multi-session build of the booking feature for your website, you've just split the Spec into Tickets, each with its blocking edges. You want to drive each Ticket yourself rather than orchestrate the whole build. What comes next? What comes next?
- [x] Build one Ticket whose blockers are done, then clear context before the next.
  > Right: that's `/implement`.
- [ ] Run the whole Spec in one go, with subagents on the ready Tickets in parallel.
  > That's `/implement-spec`. That's for when you'd rather orchestrate the build than drive each Ticket yourself.
- [ ] Move the new Tickets through triage so they become agent-ready.
  > That's `/triage`. Tickets from the split are already agent-ready. Triage is only for Issues you didn't create.
- [ ] Turn the thread into a Spec, so the Tickets have a source to follow.
  > That's `/to-spec`. That's already done. The Tickets came from the Spec.
Why: Each Ticket is self-contained, which makes the last one's context disposable. So you build one Ticket whose blockers are done, clear the context, and take the next.
```

```sources
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [writing-for-agents: SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL-MECHANICS.md), Matt Pocock's Skills
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, 2026-08-24
- [implement-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/implement-spec/SKILL.md), Matt Pocock's Skills
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [mattpocock/skills CLAUDE.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CLAUDE.md), Matt Pocock, 2026-10-29
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [ask-matt names five skills the agent cannot see, so it reports them as not installed #740](https://github.com/mattpocock/skills/issues/740), drormeir, 2026-08-04
- [Root cause for #366: Claude Code coordinator mode drops user-invoked skills (upstream issue filed) #693](https://github.com/mattpocock/skills/issues/693), vali-mohammadi (comments by PaulSainsbury), 2026-07-29
- [ask-matt should verify the relevant SKILL.md before asserting or skipping workflow steps #614](https://github.com/mattpocock/skills/issues/614), maximumaliens, 2026-07-18
- [Release v1.3.2 · mattpocock/skills](https://github.com/mattpocock/skills/releases/tag/v1.3.2), Matt Pocock, 2026-10-29
```
