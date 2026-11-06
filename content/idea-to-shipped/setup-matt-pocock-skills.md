---
title: setup-matt-pocock-skills
slug: setup-matt-pocock-skills
summary: setup-matt-pocock-skills (setup, for short) settles three facts about your repo once, and writes them down where the other Skills read them.
---

## What it's for

Say you ask to-spec (which writes Specs) for the "Booking API" Spec in a new repo. The agent tells you to run this Skill first: nobody has told it where the repo's [Issues](/learn/issues-and-keeping-track) live. You'd rather not explain that every session.

**setup-matt-pocock-skills (setup, for short) settles three facts about your repo once, and writes them down where the other Skills read them.**

```checkpoint quick-1
You've run setup in a repo. A new session starts a Skill there. What happens?
- [x] The Skill reads the three facts setup wrote down.
- [ ] The Skill asks you the three questions all over again.
- [ ] The Skill stops until you run setup in this session too.
Why: Setup settles the three facts once and writes them down where the other Skills read them. So a new session doesn't need telling again.
```

- **Issue tracker:** where Issues live. GitHub Issues is the default, and others work too.
- **Triage labels:** what the labels that sort Issues are called.
- **Domain docs:** where the project's glossary and ADRs go.

A run could go like this:

```
you:   /setup-matt-pocock-skills
agent: This repo is on GitHub. Use GitHub Issues? (recommended)
you:   yes
agent: Keep the default triage labels? (recommended: yes)
you:   yes
agent: Here's a draft of every file. Edit anything first?
```

You end up with a few Markdown files: your first [environment fix](/learn/fix-the-environment).

## When to use it

- You're about to start your first engineering [Flow](/learn/issues-and-keeping-track) in a repo. Run setup once per repo, before it.
- You've seen a Skill tell you to run it. to-spec, to-tickets (which splits a Spec into Tickets) and code-review (which reviews a branch) all do.
- You want to switch Issue trackers or start from scratch. For anything smaller, such as a renamed label, edit the files in `docs/agents/` yourself.

```checkpoint quick-2
You've renamed one triage label. What do you do?
- [x] Edit the files in docs/agents/ yourself, with no re-run.
- [ ] Run setup again, so it rewrites every file in docs/agents/.
- [ ] Edit the triage Skill's own files, so it uses the new name.
Why: A small change doesn't need a re-run. You run setup again only to switch Issue trackers or start from scratch.
```

## When not to use it

- If you want to settle the project's words or record a decision, use [domain-modeling](/learn/domain-modeling) instead, because setup never writes the glossary or ADRs.
- If you want to sort incoming Issues, use [triage](/learn/triage) instead, because setup only sets up the labels; it never applies them to Issues.

```checkpoint quick-3
You want incoming Issues sorted by what they need next. Which Skill fits?
- [x] triage, which uses the label names setup recorded.
- [ ] setup, which sorts Issues as soon as it names the labels.
- [ ] domain-modeling, which records each Issue's next step.
Why: Sorting Issues is triage's job. Setup only sets up the labels, and triage applies them.
```

## What it needs to start

It needs this Skill [installed](/learn/issues-and-keeping-track), a repo and, for GitHub Issues, `gh`. Only you can start it, by typing `/setup-matt-pocock-skills`. The agent never starts it on its own.

```checkpoint quick-4
You've never run setup in this repo. Can the agent start it on its own?
- [x] No. Only you can start it, by typing its name.
- [ ] Yes. Any Skill that needs it can start it for you.
- [ ] Yes, as soon as it sees the repo isn't set up yet.
Why: Only you can start setup, by typing `/setup-matt-pocock-skills`. The agent never starts it on its own.
```

It explores first, then asks, then writes. Exploring includes checking where the repo's **git remote** (the online copy of a repo you push to) points, and reading any [instruction file](/learn/instruction-files).

```checkpoint quick-5
You've started setup. What does it do before it asks you anything?
- [x] It reads the repo's git remote and any instruction file.
- [ ] It writes default files, for you to correct afterwards.
- [ ] It runs the other Skills, to see which facts they need.
Why: Setup explores first, then asks, then writes. Exploring includes reading the repo's git remote and any instruction file.
```

```diagram
type: chain
caption: "It explores first, then asks, then writes"
steps:
  - "It explores first"
  - "then asks"
  - "then writes"
  - parallel:
      - "An `## Agent skills` block"
      - "the files in `docs/agents/`"
```

## What it creates

- An `## Agent skills` block pointing at these files, in whichever of `CLAUDE.md` or `AGENTS.md` already exists. Setup never creates the other. If neither exists, it asks you which to create.
- `docs/agents/issue-tracker.md` and `docs/agents/domain.md`.
- `docs/agents/triage-labels.md`, only when the triage Skill (which sorts Issues) is installed.

```checkpoint quick-6
Your repo has an AGENTS.md and no CLAUDE.md. Where does the Agent skills block go?
- [x] In the AGENTS.md that's already there.
- [ ] In a new CLAUDE.md, created beside it.
- [ ] In both files, so that every agent sees it.
Why: Setup puts the block in whichever of the two files already exists, and never creates the other.
```

When it writes that file, on GitHub, it also creates any triage label your repo lacks. The five defaults:

- `needs-triage`: someone still needs to look at it.
- `needs-info`: it's waiting on its reporter.
- `ready-for-agent`: an agent can build it.
- `ready-for-human`: a person has to build it.
- `wontfix`: it won't be done.

```checkpoint quick-7
An Issue can't move until the person who reported it replies. Which label fits?
- [x] `needs-info`
- [ ] `needs-triage`
- [ ] `wontfix`
Why: `needs-info` marks an Issue waiting on its reporter. `needs-triage` means someone still needs to look at it, and `wontfix` means it won't be done.
```

It doesn't create `GLOSSARY.md` or any ADRs. domain-modeling writes those later, once a term is settled.

```checkpoint quick-8
Setup has finished, and your repo has no GLOSSARY.md. What does that mean?
- [x] Nothing's wrong. It gets written once a term is settled.
- [ ] Setup failed part-way, so you should run it again now.
- [ ] You skipped a question, so you should write it by hand.
Why: Setup doesn't create GLOSSARY.md or any ADRs. domain-modeling writes those later, when a term or decision is settled.
```

## Going deeper

### Why it exists

Repos differ. One keeps its Issues on GitHub, another in local Markdown files, another in a different Issue tracker, such as Jira or Linear. Without a setup step, every Skill that touches Issues would need its own copy of the tracker instructions.

Matt puts all the differences in one place instead. The files setup writes "are the only thing that varies between repos. The skills themselves are identical everywhere."

```checkpoint quick-9
Your next repo tracks its Issues somewhere else. What changes in the Skills themselves?
- [x] Nothing. Only the files setup writes differ between repos.
- [ ] Each Skill that touches Issues gets its own edited copy.
- [ ] Each Skill's own file gets a new tracker written into it.
Why: The files setup writes are the only thing that varies between repos. The Skills themselves are identical everywhere.
```

So you never edit a Skill to point it at another tracker. You run setup and tell it which tracker you use. If setup edited a `SKILL.md`, the file holding a Skill's instructions, something went wrong.

### How it works underneath

The first idea is **indirection**: instead of holding an answer, you hold where to look it up. Think of it like `DATABASE_URL` in a FastAPI app. The code doesn't contain the database's address. It reads the environment variable when it runs, and each machine sets its own.

Setup gives the Skills the same trick: a Skill doesn't know where Issues live, only where to look it up.

When triage needs the Issue tracker, it reads the `## Agent skills` block in your instruction file. It follows its pointer to `docs/agents/issue-tracker.md` and does what that file says.

```checkpoint quick-10
triage needs your Issue tracker. Where does it look first?
- [x] Your instruction file, where the Agent skills block sits.
- [ ] Its own SKILL.md, where each repo's tracker gets written in.
- [ ] The chat, where it asks you which tracker this repo uses.
Why: triage reads the Agent skills block in your instruction file, follows its pointer to docs/agents/issue-tracker.md, and does what that file says.
```

```diagram
type: chain
caption: "a Skill doesn't know where Issues live, only where to look it up"
steps:
  - "[triage](/learn/triage)"
  - "the `## Agent skills` block in your instruction file"
  - "`docs/agents/issue-tracker.md`"
  - "does what that file says"
```

That file is what makes one Skill behave differently in two repos. In a repo set up for GitHub, it says:

```markdown
## When a skill says "publish to the issue tracker"

Create a GitHub issue.
```

In a repo set up for local Markdown, the same heading says to create a new file under `.scratch/`.

Going through the pointer matters. wayfinder, the Skill that plans a huge, foggy effort as a map of decisions, once used a fixed path instead. So in a repo that kept its agent docs elsewhere, "it silently fell back to the local-markdown tracker". It now follows the pointer too.

The second idea is that only you can start setup. Its `SKILL.md` sets `disable-model-invocation: true`, a setting that stops the agent starting a Skill by itself. That makes setup **user-invoked**: only you can start it, by typing its name.

```checkpoint quick-11
A Skill's file sets disable-model-invocation to true. Who can start that Skill?
- [x] Only you, by typing its name.
- [ ] Only the agent, on its own.
- [ ] You, the agent, or any other Skill.
Why: That setting stops the agent starting the Skill by itself, which makes it user-invoked. Only you can start it, by typing its name.
```

So no other Skill can call it, whether that Skill is user-invoked or **model-invoked** (the agent reaches for it by itself). When one finds no tracker or label names, it tells you to run setup.

### A real example

In a July 2026 tutorial video, Matt sets up his Skills for the first time on one of his work repos. It's a command-line tool called the AI Hero CLI. Each question gets a quick answer:

- **Issue tracker:** local Markdown.
- **Triage labels:** the defaults, since they don't matter much for this repo.
- **Domain docs:** single-context, meaning one glossary and one `docs/adr/` at the repo root. His reason: "for 99% of people, a single context is going to be fine."

Setup then adds a few short links to his `CLAUDE.md`, pointing at those three docs. So a few quick answers leave the repo ready for the other Skills.

The video is older than the current Skill. Matt says "a context .md file", which version 1.3.0 renamed to `GLOSSARY.md`. And today's setup asks about single-context only when it finds signs of a **monorepo**: one repo holding several separate projects.

```checkpoint quick-12
An old video of setup mentions a context .md file. What does today's setup call that file?
- [x] GLOSSARY.md, the name version 1.3.0 gave it.
- [ ] CONTEXT.md, since the name has never changed.
- [ ] AGENTS.md, which took over that file's job.
Why: The video is older than the current Skill. Version 1.3.0 renamed the context file convention to GLOSSARY.md.
```

### Where it goes wrong

**`gh issue edit` says a label doesn't exist.** One user's command failed with "'ready-for-human' not found", even after setup ran. Back then, setup wrote the label names down but never created the labels. Issue #616 reported it in July 2026, and pull request #1197 closed it in October 2026.

Today's setup creates each configured label the tracker lacks, on GitHub or GitLab (a service like GitHub that hosts repos and Issues). So if your repo was set up earlier, run setup again. Matt's page still says setup doesn't create them. When the two disagree, the current `SKILL.md` decides.

```checkpoint quick-13
You run setup today on a fresh GitHub repo and keep the default labels. What happens to them?
- [x] Setup creates each one the tracker lacks.
- [ ] You have to create all five by hand.
- [ ] Each one appears when a Skill first uses it.
Why: Today's setup creates each configured label the tracker lacks, on GitHub or GitLab. You don't need to make them yourself.
```

**`gh issue create` fails on a `wayfinder:` label.** Setup creates only the triage labels, and `gh issue create --label <missing>` fails instead of creating the label. So create `wayfinder:map` and `wayfinder:<type>` (`<type>` is `research`, `prototype`, `grilling` or `task`) by hand before your first wayfinder run on a GitHub repo.

```checkpoint quick-14
You're about to run wayfinder for the first time on a GitHub repo. What do you do first?
- [x] Create its wayfinder labels by hand.
- [ ] Run setup again, so it creates them.
- [ ] Nothing, since gh makes a missing label.
Why: Setup creates only the triage labels, and gh issue create fails on a missing label instead of creating it. So create wayfinder's by hand first.
```

**A Skill does something different from what the docs describe.** Your `docs/agents/` files may be stale: setup writes them from templates, and the templates change between versions. So run setup again. `SKILL.md` says a re-run is only for switching trackers or starting from scratch, but the 1.3.2 release notes ask for one. Matt calls both views defensible, and a re-run is cheap.

```checkpoint quick-15
You updated the Skills, and one now does something different from what the docs describe. What's the fix?
- [x] Run setup again, to refresh docs/agents/.
- [ ] Edit that Skill's own file to match the docs.
- [ ] Wait, since docs/agents/ updates itself in time.
Why: Setup writes those files from templates, and the templates change between versions. So your files can go stale, and a re-run brings them up to date.
```

**Setup ran, but Codex doesn't know about it.** Codex, another coding agent, reads `AGENTS.md`. Setup edits `CLAUDE.md` if it exists, because it checks which file exists, not which agent you're running. This gap, Issue #558, is still open. You can move the block to `AGENTS.md` by hand, or make `CLAUDE.md` a one-line pointer to `AGENTS.md`.

```checkpoint quick-16
Your repo has a CLAUDE.md, and you run setup from Codex. Where does the block go?
- [x] In CLAUDE.md, even though Codex reads AGENTS.md.
- [ ] In a new AGENTS.md, since Codex reads that.
- [ ] In both files, so that either agent finds it.
Why: Setup checks which file exists, not which agent you're running. So it edits CLAUDE.md, while Codex reads AGENTS.md.
```

**Issues land in someone else's repo.** A **fork** is your own GitHub copy of someone else's repo. Agents working in a clone or fork of Matt's repo filed their Specs and Tickets into `mattpocock/skills` itself: Issues #541 to #550. In a fork, `gh` can default to the parent repo. So the GitHub template now says: "File issues only into the user's own repo." It also tells the agent to check the target with `gh repo view --json nameWithOwner` before the first `gh issue create` of a session.

```checkpoint quick-17
An agent is working in a fork. What should it check before the session's first gh issue create?
- [x] The target repo, with gh repo view --json nameWithOwner.
- [ ] The repo's labels, with gh label list, in case any are missing.
- [ ] The repo's open Issues, with gh issue list, in case of duplicates.
Why: In a fork, gh can default to the parent repo. So the GitHub template tells the agent to check the target first, and to file only into your own repo.
```

### Try it

You'll need your practice project, the yoga-studio booking site. [keeping-track](/learn/issues-and-keeping-track)'s Try it creates it and runs setup once, so do that first if you haven't. This is a deliberate re-run, which refreshes your `docs/agents/` files.

1. Open the `yoga-studio` repo's root in Claude Code.
2. Type `/setup-matt-pocock-skills`. Typing it is the only way to start it.
3. When it proposes GitHub as the Issue tracker, accept.
4. If it asks about triage labels, keep the defaults.
5. Expect no question about domain docs.
6. Read the drafts it shows you, then let it write.
7. Open `CLAUDE.md`, or `AGENTS.md` if that's your file. You should see one `## Agent skills` block, not a second one.
8. If it asked about triage labels, run `gh label list`. You should see all five.
9. Run `gh repo view --json nameWithOwner`. You should see your own repo's name.
10. Commit any files that changed on a branch, and merge it through a pull request. If nothing changed, you're done.

Why no domain docs question? Your `web/` folder can have its own `package.json`, but that isn't a monorepo signal. Setup looks for a `pnpm-workspace.yaml`, a `workspaces` field in `package.json`, or a populated `packages/*` with its own `src/`.

### Read more

- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills), Matt Pocock, updated 24 August 2026
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, video, 16 July 2026
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock, as of 29 October 2026 (the Course's pin commit)
- [Triage labels missing, Issue #616](https://github.com/mattpocock/skills/issues/616), mentelm, 18 July 2026
- [Make setup-matt-pocock-skills harness-aware when choosing AGENTS.md or CLAUDE.md, Issue #558](https://github.com/mattpocock/skills/issues/558), wushijie-ai, 14 July 2026

## Practice scenarios

Optional practice: more situations like the ones in the final test.

```checkpoint setup-matt-pocock-skills-deeper-codex
Your repo has a CLAUDE.md left from Claude Code, but you now work in Codex. Setup ran and finished cleanly, yet Codex sessions still ask where Issues live. Why? What's the reason behind this step?
- [x] Setup edited the CLAUDE.md that existed, and Codex reads AGENTS.md, so it never sees the pointer block.
- [ ] Setup only writes its pointer block when it runs inside Claude Code, so under Codex it wrote nothing.
  > Setup did write its block. The rule picks the file that exists, not the harness that's running.
- [ ] Codex can't read files under docs/agents/, so the tracker doc has to be pasted into every prompt.
  > The tracker doc is fine. Codex never reaches it, because the pointer to it sits in a file Codex doesn't read.
Why: Setup picks the file that exists, not the one your agent reads, so it edited CLAUDE.md. Codex reads AGENTS.md, so it never reaches the pointer. Issue #558 reports this gap, and it's still open. You can move the block to AGENTS.md by hand, or make CLAUDE.md a one-line pointer at AGENTS.md.
```

## Remember

```flashcards
Q: What does setup-matt-pocock-skills create?
A: An "Agent skills" block in CLAUDE.md (or AGENTS.md), plus docs/agents/issue-tracker.md, docs/agents/domain.md, and docs/agents/triage-labels.md when the triage Skill is installed.

Q: What three things does setup-matt-pocock-skills configure?
A: The issue tracker, the triage labels, and the domain doc layout.

Q: What are the five default triage labels?
A: needs-triage, needs-info, ready-for-agent, ready-for-human and wontfix.

Q: When do you need to run setup-matt-pocock-skills again?
A: Normally only to switch issue trackers or start from scratch. Smaller changes go straight into docs/agents/.

Q: Why does switching the issue tracker never mean editing a Skill's own files?
A: Setup's docs/agents/ files are the only thing that varies between repos. The Skills are identical everywhere and read the tracker doc at run time. If setup edited a SKILL.md, something went wrong.

Q: What does the GitHub tracker template now tell agents to check before the first gh issue create of a session?
A: The target repo, with gh repo view --json nameWithOwner. Agents in a clone or fork had filed their Specs and Tickets into mattpocock/skills itself.

Q: Which labels does setup still not create for you on GitHub?
A: wayfinder's wayfinder:map and wayfinder:<type> labels. Setup creates only the triage labels, so make wayfinder's by hand before its first run.
```

## Final test

```final-test setup-matt-pocock-skills-when
When do you run setup-matt-pocock-skills?
- [x] Once per repo, before your first engineering Flow.
- [ ] At the start of each Ticket, before any code is written.
- [ ] After each pull request is merged, to refresh the config.
- [ ] Whenever a new term is settled and added to the Glossary.
Why: The other Skills assume setup's answers, so it has to come before your first Flow. The answers then stay in the repo, so you normally run it again only to switch Issue trackers or start from scratch.
```

```final-test setup-matt-pocock-skills-which-file
Your repo has a CLAUDE.md but no AGENTS.md. Where does setup put its "Agent skills" block?
- [x] In the CLAUDE.md that's already there.
- [ ] In a new AGENTS.md at the repo root.
- [ ] In both files, so every agent sees it.
- [ ] In a new README inside docs/agents/.
Why: Setup looks for the instruction file that already exists and edits that one. It never creates AGENTS.md when CLAUDE.md is already there, so the block stays in the one file you have.
```

```final-test setup-matt-pocock-skills-no-glossary
Does setup-matt-pocock-skills write the project's GLOSSARY.md?
- [x] No. It records where the Glossary goes; domain-modeling writes it later.
- [ ] Yes. It reads the code and writes a starter Glossary of its terms.
- [ ] Yes, but only in a repo of several projects, writing one Glossary per project.
Why: Setup records where the Glossary and ADRs go and how to read them, but it doesn't write them. They get written later, when a term or decision is settled, so a repo with no Glossary right after setup is normal.
```

```final-test setup-matt-pocock-skills-deeper-why
When to-spec finds no Issue tracker, why does it tell you to run setup instead of running setup itself?
- [x] Setup is user-invoked only, so no other Skill, user- or model-invoked, can call it.
- [ ] Setup needs an API key for the tracker, which only you can type into the session.
- [ ] Calling another Skill mid-run would overflow to-spec's context window with setup's files.
- [ ] to-spec runs read-only, so it may not write the files that setup creates in docs/agents/.
Why: Setup's SKILL.md sets disable-model-invocation, which stops the agent starting it on its own. That makes it user-invoked: only you can start it, so no other Skill can call it. All to-spec can do is tell you to run it.
```

```final-test setup-matt-pocock-skills-deeper-labels
Matt's page says setup doesn't create triage labels, but the current SKILL.md says it does. Which does the Course follow, and why?
- [x] The SKILL.md, since PR #1197 closed #616 in October 2026, and when the two disagree, the current SKILL.md decides.
- [ ] Matt's page, because his own prose explains the design intent, while the SKILL.md is only the agent's instructions.
- [ ] Neither, because the two disagree, so the Course tells you to create all five triage labels by hand every time.
- [ ] Matt's page, because it was updated in August, after the SKILL.md change that first added label creation to setup.
Why: Issue #616 reported the missing labels, and pull request #1197 closed it in October 2026. So the current SKILL.md creates missing triage labels on GitHub or GitLab, while Matt's page still says it doesn't. When the two disagree, the current SKILL.md decides.
```

```final-test setup-matt-pocock-skills-fresh-docker
You've just created a GitHub repo for an AI agent that runs in Docker, and you have a rough idea for its first feature. No agent has been told where this repo's Issues live, what its triage labels are called, or where its domain docs go. What comes first? What comes next?
- [x] Set up the repo once, so every later Skill knows its conventions.
  > Right: that's `/setup-matt-pocock-skills`.
- [ ] Start the interview about the first feature, writing terms down as they settle.
  > That's `/grill-with-docs`. That's the next step. The precondition comes first, so the Skills after the interview know where Issues live.
- [ ] Split the rough idea into small Tickets on the repo's GitHub Issues.
  > That's `/to-tickets`. The idea isn't sharpened yet, and to-tickets would tell you to run setup first.
Why: Later Skills need to know where Issues live, what the labels are called and where the domain docs go. Setup records all three once, before your first Flow, so none of those Skills has to send you back.
```

```final-test setup-matt-pocock-skills-spec-stalls
You grilled a plan for a new endpoint in your FastAPI backend, then asked the agent to turn it into a Spec. It stopped instead: nobody has told it where this repo's Issues live. You'd rather not explain that again in every session. Which fits best?
- [x] Record the repo's issue tracker once, in files every Skill reads.
  > Right: that's `/setup-matt-pocock-skills`.
- [ ] Sharpen the endpoint's terms and write them into the repo's Glossary.
  > That's `/domain-modeling`. That changes the project's words. The gap here is where Issues live, which domain-modeling doesn't record.
- [ ] Get interviewed about the plan again, in more depth.
  > That's `/grill-with-docs`. The plan is already sharp. Another interview won't tell to-spec where the issue tracker is.
Why: to-spec needs to know where Issues live, and it tells you to run setup when nobody has told it. Setup records the answer once, in docs/agents/issue-tracker.md, so no later session needs telling.
```

```final-test setup-matt-pocock-skills-labels-and
You want the agents working on your Python backend to know three things: its Issues live in GitHub Issues, which label marks an Issue as ready for an agent, and where the project's glossary and decision records will go. Which fits best?
- [x] Record the tracker, the label names and the doc layout, once per repo.
  > Right: that's `/setup-matt-pocock-skills`.
- [ ] Sort the open GitHub Issues and label each one ready for an agent or not.
  > That's `/triage`. Triage applies the labels, but it expects the label names to have been provided already. It doesn't set them, or say where Issues live.
- [ ] Challenge fuzzy terms and write them into the Glossary and decision records.
  > That's `/domain-modeling`. That fills in the Glossary and ADRs. It doesn't record where Issues live or what the labels are called.
Why: These three facts are exactly what setup records, and the other Skills assume them. triage applies the labels and domain-modeling fills in the Glossary and ADRs, but neither one records these facts.
```

```final-test setup-matt-pocock-skills-glossary-words
Setup wrote `docs/agents/domain.md` for your booking website's repo. From now on, every engineering Skill reads `GLOSSARY.md` before exploring, and names things in Issue titles and test names with the Glossary's terms. Why does that matter? What's the reason behind this step?
- [x] You and every agent use one word per thing, so synonyms don't creep in.
- [ ] The agent can read the Glossary instead of exploring the code each time.
  > The Glossary is read before exploring the code, not instead of it.
- [ ] The Glossary can stand in for the Spec, so Tickets come straight from it.
  > The Glossary holds the project's words. The Spec still describes the feature.
Why: docs/agents/domain.md tells every Skill to use the Glossary's terms and not drift to synonyms it avoids. So you and every agent keep to one word per thing, in Issue titles and test names alike.
```

```final-test setup-matt-pocock-skills-deeper-stale
You set up your yoga-studio repo's Skills months ago and have just updated them. The new release notes say the GitHub template now puts Blocking into its Conventions, with the native gh flags. Your docs/agents/issue-tracker.md hasn't changed since the first setup and has no Blocking convention like the one the release notes describe. Which fits best?
- [x] Run the repo setup again, so docs/agents/ is rewritten from the current tracker templates.
  > Right: that's `/setup-matt-pocock-skills`.
- [ ] Split the Spec into Tickets again, hoping the new run picks up the release's Blocking convention.
  > That's `/to-tickets`. How to-tickets publishes depends on the tracker that setup configured. A second run reads the same old tracker doc.
- [ ] Sort the new Tickets and label each one ready for an agent or for a human.
  > That's `/triage`. Labels don't change the tracker doc. The gap is the out-of-date docs/agents/ file that every Skill reads.
Why: The Skills read docs/agents/issue-tracker.md when they run, and that file doesn't change when you update the Skills. So the new Blocking convention doesn't reach you until that file changes, and re-running setup rewrites it. The SKILL.md's closing message says a re-run is only for switching trackers or starting from scratch, but the 1.3.2 release notes ask for one. Matt calls both views defensible, and a re-run is cheap.
```

```sources
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [triage: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/triage/SKILL.md), Matt Pocock's Skills
- [to-spec: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-spec/SKILL.md), Matt Pocock's Skills
- [to-tickets: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/to-tickets/SKILL.md), Matt Pocock's Skills
- [code-review: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/code-review/SKILL.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: domain.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/domain.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: issue-tracker-github.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: triage-labels.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/triage-labels.md), Matt Pocock's Skills
- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills), Matt Pocock, 2026-08-24
- [wayfinder: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md), Matt Pocock's Skills
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [mattpocock/skills CHANGELOG.md at a496f55](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/CHANGELOG.md), Matt Pocock
- [setup-matt-pocock-skills: issue-tracker-local.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md), Matt Pocock's Skills
- [Triage labels missing #616](https://github.com/mattpocock/skills/issues/616), mentelm (comments by mattpocock and others), 2026-07-18
- [Make setup-matt-pocock-skills harness-aware when choosing AGENTS.md or CLAUDE.md (#558)](https://github.com/mattpocock/skills/issues/558), 2026-07-14
```
