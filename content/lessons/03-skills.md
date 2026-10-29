---
title: Skills
slug: skills
order: 3
part: 1
---

A Skill is a small instruction file your coding agent (an AI that reads and changes your project for you) loads only when it's needed. Install Matt Pocock's set once, set up each project once, and learn which Skills only you can start.

```goals
- You'll be able to explain what a Skill is and how it stays out of the agent's working memory (its context window) until it's needed.
- You'll be able to tell a user-invoked Skill from a model-invoked one, and predict which ones the agent can start on its own.
- You'll be able to install Matt's Skills by one route, run `/setup-matt-pocock-skills` once per repo (a project folder tracked with Git), and say what it writes.
- You'll be able to use `/ask-matt` to find your next step, and reach a Skill whose short name is taken, like `/mattpocock-skills:code-review`.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Every session (one conversation, from typing `claude` until you quit or type `/clear`, a Built-in command that empties the conversation) starts from nothing. A Built-in command comes with Claude Code itself; it isn't a Skill. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, described agents in a March 2026 video as a fleet of decent engineers with no memory. So the way you like to work has to be written down somewhere they can read it.

You could paste your instructions into every session, but that's tedious and error-prone. Or you could put everything in `CLAUDE.md`, a file of standing instructions the agent reads at the start of every session (see [How coding agents work](/learn/how-agents-work)). That works for a few lines. But everything in it sits in the agent's ==context window== on every turn (each message you send and its reply), needed or not. The context window is the agent's working memory for one session, measured in tokens (small chunks of text, roughly three-quarters of a word each). As it fills, the model (the AI behind Claude Code) reasons less sharply; [The context window](/learn/context-window) explains why.

A Skill is the middle path: a process ==written once, loaded only when it's needed==. Matt's set holds his whole way of working, from interviewing you about an idea to reviewing and learning from the build, and most of it costs nothing until you use it.

## The idea: a folder with one file

A Skill is a folder with a file called `SKILL.md` inside. At the top, between two `---` lines, is the frontmatter: a few settings written as `key: value`. Below it is the body: instructions in Markdown, the simple formatting this page is written in. Here's a complete, working Skill for commit messages (a commit is a saved snapshot of your project in Git, the tool that tracks changes to its files):

```md
---
name: commit-style
description: House rules for commit messages. Use when writing or amending a commit.
---

Write the first line as an instruction ("Add comment box"), under 60 characters.
Leave a blank line, then explain why the change was needed.
```

- **`name`** is what you type after a `/` to start it: here, commit-style. Leave it out and the folder's name is used.
- **`description`** says what the Skill is for and when to reach for it. The agent reads it to decide whether a task fits, so lead with the trigger and keep it short.
- **The body** is the process itself. It can point at other files in the same folder.

What makes Skills cheap is ==progressive disclosure==: the agent gets each part only when it needs it.

1. **When a session starts,** the name and description of each Skill the agent is allowed to start go into the context window. A line or two each.
2. **When the Skill runs,** because you typed its name or the agent decided your request fits, the whole `SKILL.md` loads. It then stays in the conversation; it isn't re-read on every turn.
3. **Extra files in the folder** load only if the body sends the agent there. Matt's test-first Skill, `tdd`, keeps examples of good tests and other advice in two side files.

So a long body costs nothing until it runs, and many are short anyway: in that video, Matt stressed that a Skill needn't be long to make a difference. The body of his `/grill-me` is one line telling the agent to load another Skill.

You can keep Skills in three places.

| Where | Path | Who gets it |
|---|---|---|
| Personal | `~/.claude/skills/<name>/SKILL.md` | You, in every project on this computer |
| Project | `.claude/skills/<name>/SKILL.md` inside a repo | Everyone working in that repo, once you commit it |
| Plugin | Inside an installed plugin (a package of Skills; see below) | Wherever the plugin is switched on |

If a personal Skill and a project Skill share a name, the personal one wins. Claude Code notices when you edit a Skill, but if you create a Skills folder that didn't exist when the session started, type `/reload-skills`. To write your own well, Matt's guide is `/writing-for-agents` ([Retro](/learn/retro) covers it).

```scene flow
title: How the tdd Skill loads, level by level (illustrative)
node: start | Session starts
node: listing | Name and description loaded
node: body | Full SKILL.md loaded
node: extra | Side file opened
node: stays | Body stays for the session
# You start Claude Code. No Skill's body is in the window yet.
at: start
# Each Skill the agent may start adds one short entry. For `tdd`, a line about building features or fixing bugs test-first.
at: listing
# You write "let's add a length limit to the comment box, test-first". That matches the description, so the agent loads the whole Skill.
at: body
# The body points to `tests.md` for examples. The agent opens it only when it needs one.
at: extra
# From here the body sits in the conversation. It isn't fetched again on every turn.
at: stays
```

```checkpoint what-loads-early
You add a personal Skill for formatting recipes: a two-line description, a 300-line body and three example files in its folder. You don't add any extra settings to its frontmatter. In a new session where nobody has mentioned recipes, what part of it is in the context window?
- [ ] All of it, so the agent is ready the moment you need it.
  > Loading everything up front is exactly what progressive disclosure avoids. The body waits until the Skill runs.
- [x] Only its name and its two-line description.
  > Right. That's the first level. The body loads when the Skill runs, and the example files only when the body sends the agent to them.
- [ ] Nothing at all until you type its name.
  > Not with default settings. Its name and description load when the session starts, so the agent can spot when a request fits. The next section shows the one setting that hides even those.
- [ ] The body, but not the example files.
  > The body loads only when the Skill runs. Before that, only the name and description are there.
```

## Who can start a Skill

You can start any of Matt's Skills by typing `/` and its name. The frontmatter decides whether the agent can start it too, and Matt splits his Skills on that line:

- **Model-invoked** (the default): you can type it, and the agent can also load it on its own when your words match its description. The price: its description sits in the context window on every turn, which Matt calls context load.
- **User-invoked**: the frontmatter adds `disable-model-invocation: true`. Only you can start it. Its description is kept out of the agent's context, so it costs nothing until you type it. The price moves to you: you have to remember it exists, which Matt calls cognitive load. If the agent tries to start one on its own, Claude Code blocks it.

In Matt's design, ==user-invoked Skills orchestrate==: each runs a whole process, like turning a conversation into a spec (a written plan of what to build). Model-invoked Skills hold reusable discipline, like what makes a good test. A user-invoked Skill can call model-invoked ones, never another user-invoked one. And plain words can start a model-invoked Skill but never a user-invoked one: type its name yourself, at the start of your message.

Here are all 27 Skills in Matt's set, in the two folders he keeps them in:

| Folder | User-invoked: only you (16) | Model-invoked: you or the agent (11) |
|---|---|---|
| Engineering (code work) | `/ask-matt`, `/setup-matt-pocock-skills`, `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`, `/triage`, `/wayfinder`, `/improve-codebase-architecture`, `/retro` | `/prototype`, `/tdd`, `/code-review`, `/pr`, `/diagnosing-bugs`, `/research`, `/wizard`, `/domain-modeling`, `/codebase-design` |
| Productivity (any work) | `/grill-me`, `/handoff`, `/wait-what`, `/teach`, `/to-questionnaire` | `/grilling`, `/writing-for-agents` |

Making most of them user-invoked keeps the set light: in his July 2026 walkthrough, Matt's whole set came to about 660 tokens of context. The Built-in command `/context` shows what's filling your window.

One side effect: because user-invoked Skills are hidden from the agent, it doesn't know they exist. Mention to-spec in plain words and it may say that Skill isn't installed, or that you must type it yourself. Either way, it's there. Type `/to-spec`.

```checkpoint deploy-flag
You're writing a Skill that publishes your site to the internet. You want to run it yourself sometimes, but the agent must never decide to run it on its own. What do you add?
- [ ] "Only when the user asks" at the end of its description.
  > The description is what the agent reads to decide when a Skill fits. Wording can nudge it, but it isn't a lock.
- [ ] Nothing. Agents only run Skills you type.
  > That's only true of user-invoked Skills. By default, the agent may start a Skill whenever your words match its description.
- [x] `disable-model-invocation: true` in the frontmatter.
  > Right. It makes the Skill user-invoked: you can still type it, the agent can't start it, and its description stays out of the context window.
- [ ] Move it from `~/.claude/skills/` into the project's `.claude/skills/`.
  > Where a Skill lives decides which projects can see it, not who can start it.
```

## Installing Matt's Skills

A plugin is a package that bundles Skills (and other add-ons) into one install. Plugins come from a marketplace, a catalogue of plugins. Anthropic's official one, `claude-plugins-official`, is added for you the first time you start Claude Code, and Matt's Skills are in it. Run this in your terminal, outside Claude Code:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

That's the whole install. The plugin goes in at user scope, for every project on your computer, and updates itself. Treat its files as read-only: each update replaces them, so any change you make there is lost. If Claude Code was already open, restart it or type `/reload-plugins`. Type `/` to see the Skills. Each answers to its full name, `/mattpocock-skills:grill-me`, and most to a short one, `/grill-me`. `/plugin` opens a panel where you can switch off or remove plugins.

The other route is `npx skills@latest add mattpocock/skills`. It needs Node.js (a free program for running JavaScript tools, which brings `npx`), works with other agents too, like Cursor, and copies editable files that you own and update by hand. It asks which Skills you want (include `/setup-matt-pocock-skills`), which agents, and whether to install for one project or your whole computer. Matt used it in his July 2026 walkthrough, before the plugin's release: he chose his whole computer, since he works solo, and advised project scope for teams, so everyone shares one set.

Pick one route. ==Install both and every Skill appears twice.==

The plugin carries exactly the 27 Skills above. Matt's misc folder (`/git-guardrails-claude-code`, `/setup-pre-commit`, `/migrate-to-shoehorn`, `/scaffold-exercises`) and his in-progress folder of beta Skills don't ship in it, and this course doesn't use them.

```checkpoint install-not-showing
Claude Code is open in one terminal. In a second terminal you run the plugin install, and it succeeds. Back in the open session, you type `/` and none of Matt's Skills are listed. What do you do?
- [x] Type `/reload-plugins`, or quit and start Claude Code again.
  > Right. A plugin installed from the shell loads on the next start, or when you reload plugins.
- [ ] Run the npx installer as well, in case the plugin install quietly failed.
  > The plugin didn't fail; the open session just hasn't loaded it. Both routes together give you every Skill twice.
- [ ] Type `/setup-matt-pocock-skills` to switch the Skills on.
  > Setup configures a repo for the Skills; it doesn't load them. And it's one of the Skills this session can't see yet.
- [ ] Reinstall the plugin at project scope instead.
  > Scope decides where the plugin is available, not when an open session notices it.
```

## Set up each repo once

Several of Matt's engineering Skills need three facts about your repo: where issues (tickets, small pieces of work to do) live; what the triage labels are called (the tags `/triage` puts on incoming bug reports as it sorts them); and where the glossary (the project's words and their meanings) and decision records (notes on why a hard-to-undo choice was made, called ADRs) go. `/setup-matt-pocock-skills` asks and writes the answers down. It's user-invoked, and you run it ==once per repo, before any other engineering Skill==, in an empty folder or an old project.

1. **Explore.** It checks for a Git remote (a copy of the repo on a site like GitHub), a `CLAUDE.md` or `AGENTS.md` (the name other agents use for that kind of file), a `GLOSSARY.md`, earlier setup files, a `.scratch/` folder, whether `/triage` is installed, and signs of a big multi-package repo.
2. **Ask, one section at a time,** leading with its recommendation so you can accept in a word:
   - **Issue tracker.** GitHub (needs `gh`, GitHub's terminal tool), GitLab (needs `glab`), local markdown (files under `.scratch/<feature>/`, no remote needed) or Other, where you describe Jira, Linear or anything else in a paragraph. If your remote points at GitHub or GitLab, it proposes that one.
   - **Triage labels.** Only if `/triage` is installed: keep the five default labels? On GitHub or GitLab it creates any that are missing.
   - **Domain docs.** Without asking, unless it sees a big multi-package repo, it records the single-context layout: one `GLOSSARY.md` plus one `docs/adr/` folder for the whole repo. It doesn't create them; they appear when a Skill like `/grill-with-docs` later settles a term or a decision.
3. **Confirm.** It shows you drafts and lets you edit them.
4. **Write.** `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, `docs/agents/triage-labels.md` if it asked about labels, and an `## Agent skills` block in `CLAUDE.md` that points at each file. With no `CLAUDE.md` it uses `AGENTS.md`; if neither exists, it asks which to create.
5. **Report.** It names the Skills that will read these files.

They're plain files, kept only in the repo: commit them, and everyone who clones the repo (downloads a copy with Git) gets the same setup. They don't hold your preferences: "Ask me one question at a time" belongs in your own `CLAUDE.md`, which loads in every session. Edit the `docs/agents/` files by hand later; run setup again to switch trackers, start over, or refresh them after a big update.

```scene chat
title: Setting up a new practice repo with no remote (illustrative)
# You type the Skill's name. It needs nothing else.
you: `/setup-matt-pocock-skills`
# It explores first, then reports what's there and what's missing.
agent: No Git remote, no CLAUDE.md or AGENTS.md, no GLOSSARY.md, no earlier setup. One small project, so single-context docs.
# With no remote to match, it lists the options. GitHub is its default, so read before you accept.
agent: **Issue tracker.** No remote, so nothing to match. GitHub (the default), GitLab, **local markdown** (issues as files under `.scratch/<feature>/`, good with no remote), or describe your own?
you: Local markdown.
# `/triage` is installed, so it asks exactly one label question.
agent: Keep the default triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`)? Recommended: yes.
you: yes
# Neither instruction file exists, so it asks rather than picks, and shows its drafts.
agent: Neither CLAUDE.md nor AGENTS.md exists. Which should I create? Drafts of the Agent skills block and the three docs files are below.
you: CLAUDE.md. The drafts look right.
# It writes, then names the Skills that read the files.
agent: Done. Skills like `/to-spec`, `/to-tickets` and `/triage` will now read `docs/agents/`. Edit those files by hand any time.
```

```checkpoint tracker-other
You're setting up a work repo. It lives on GitHub, but your team tracks every task in Linear and nobody uses GitHub Issues. Setup recommends GitHub. Best answer?
- [ ] Accept GitHub; the Skills were designed for it.
  > They were built with GitHub in mind, and setup proposes it because of your remote. But your team works in Linear, so tickets would land where nobody looks.
- [ ] Local markdown, so tickets stay in the repo.
  > It needs no remote, but your team would never see tickets in `.scratch/`.
- [ ] Skip it: the Skills will find Linear on their own.
  > They read `docs/agents/issue-tracker.md`. With nothing there, they don't know where tickets go.
- [x] Other, and describe how your team uses Linear.
  > Right. Other is for any tracker setup doesn't list. It records your paragraph, and the other Skills follow it.
```

## Lost? Ask the router

Sixteen Skills only you can start is a lot to remember. Matt's answer is a ==router Skill==: one user-invoked Skill that knows the others and when each fits, so you remember one name. Type `/ask-matt` followed by your situation in plain words.

It places you on a route through the set: the Main flow from idea to shipped code (see [The main flow](/learn/main-flow)), an on-ramp like `/triage` for bug reports other people filed or `/diagnosing-bugs` for something broken, upkeep for a messy codebase, or a standalone Skill. Then it tells you what to type next, and where to clear the session or review the work, and stops. It never runs what it names: it's built to recommend, and most of what it names are user-invoked Skills only you can start.

Know its limits. It only knows Matt's 27 Skills, not ones you wrote or got elsewhere. It's a hand-written map, so where it and a `SKILL.md` disagree, the `SKILL.md` is right. Its instructions say to read a Skill's `SKILL.md` before describing it, but Matt's docs list an open bug: it often answers from its own one-line summaries. So before you act on its account of a Skill, like a tip to skip `/to-spec`, ask it to open that file. Installed on its own, it gives you a map of roads you don't have.

```scene chat
title: Asking the router where to start (illustrative)
# You describe your situation after the name, in plain words.
you: `/ask-matt` I want to add an About page to my site. It's in a repo. Where do I start?
# Its instructions say to read each Skill it will recommend or skip. Here it does.
agent: Reading `grill-with-docs`, `to-spec`, `to-tickets`, `implement` and `retro` first.
# It places you at the head of the Main flow.
agent: You're in a repo, so start with `/grill-with-docs`: it interviews you about the idea and writes agreed terms to GLOSSARY.md.
# It checks the fork: one session or several?
agent: An About page should fit in one session, so skip `/to-spec` and `/to-tickets`. When grilling ends, type `/implement` in the same window; it closes with `/code-review`.
# The Main flow doesn't end at the review.
agent: Then run `/retro` in that same session, before you clear, to learn from the build.
# It stops. You type the next Skill yourself.
you: `/grill-with-docs` An About page: who wrote this course, and why.
```

```checkpoint router-stops
You type `/ask-matt` and describe a bug report a friend filed. It answers that `/triage` fits, explains why, and then does nothing more. What's going on?
- [ ] It's waiting for you to run setup before it can continue.
  > Setup does need to come before triage, but that isn't why it stopped. It always stops after recommending.
- [x] It recommends and stops; you type `/triage` yourself.
  > Right. The router never runs what it names. `/triage` is user-invoked, and one user-invoked Skill can't start another.
- [ ] It ran `/triage` silently in the background.
  > It doesn't run anything. What you get back is the next thing to type.
- [ ] It's waiting for you to say "go ahead" before it runs `/triage`.
  > Saying yes won't help. It can't start a user-invoked Skill, so type `/triage` yourself.
```

## When a short name is taken

Claude Code ships Built-in commands of its own, and a few share names with Matt's Skills. The one you'll meet is `/code-review`. Claude Code's version is a bug hunt you can run at different effort levels (how hard it thinks), like `/code-review max`, and it also answers to `/review`. Matt's is a two-part review, checking the code against your project's standards and against the spec, each part run by its own helper agent. With the plugin, the short name gets you Claude Code's. Even the agent, calling a bare `code-review` itself, can land on Claude Code's.

The fix is ==the full name==, which always reaches the plugin's Skill: `/mattpocock-skills:code-review`. A hidden part of Claude Code also answers to `/prototype`, so if that short name misbehaves, type `/mattpocock-skills:prototype`. Matt won't rename his Skills to dodge clashes: tools keep adding names. On the npx route, Matt's copy takes over `/code-review`, and Claude Code's answers only to `/review`.

## How Matt and others use it

**Matt Pocock**, in his July 2026 walkthrough of the whole set:

- **Install once, then type `/`** to browse the Skills.
- **Run setup on every repo,** new or old. He chose local markdown, kept the default labels and took single-context docs, which he said suits about 99% of people.
- **Other trackers just need telling.** People often ask him about Jira, Linear and Beads; his answer is to run setup and say which you use.
- **When unsure, ask the router.** Straight after setup he asked `/ask-matt` how to start a code change. It pointed him to `/grill-with-docs` and told him to walk down the Main flow from the top in one unbroken context window.

**Other developers:**

- Colin Eberhardt, CTO of Scott Logic, wrote up rebuilding a real app with the set in October 2026. He began with `/ask-matt`, which sent him to `/grill-with-docs`. His verdict: sound practices and refreshingly small Skills, but you still tailor them and bring your own judgement.
- In September 2026, a developer on the Skills' GitHub discussions went back through 173 unattended `/implement` sessions. When `/implement` called `code-review` by its short name, it reached Claude Code's review 36 times and Matt's only 18. His fix was to name Skills in full.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)), plus Git. If Claude Code asks permission to create or change a file this exercise names, choose Yes. If it starts something you didn't ask for, press Esc. `/exit` ends the session.

1. Make a practice repo and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir skills-practice
cd skills-practice
git init
claude
```

2. Type a slash and the word setup. If `setup-matt-pocock-skills` isn't in the list, clear the line, type `/exit`, and run:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
claude
```

3. Type `/setup-matt-pocock-skills`. Answer "Local markdown" for the tracker, "yes" to the default labels if it asks, and "CLAUDE.md" when it asks which file to create. Read the drafts before you agree.
4. Now make a Skill of your own. Paste this whole message:

```text
Create the file .claude/skills/repo-tour/SKILL.md with exactly this content:
---
description: Give a three-bullet tour of this repo. Use when the user asks what is in this repo or where things live.
---
List the top-level files and folders, then say in three bullets what each is for.
```

With no `name:` line, the folder's name, repo-tour, becomes its name. Type `/exit`, check what setup wrote, and restart Claude Code so it sees the new Skills folder:

```sh
cat CLAUDE.md
ls docs/agents
claude
```

5. Ask in plain words: "what's in this repo?" If the agent picks the Skill, a line naming repo-tour appears above its answer, then three bullets. If no such line appears, ask once more: "give me a tour of this repo". Then start it yourself:

```text
/repo-tour
```

6. Paste this:

```text
Add disable-model-invocation: true to the frontmatter of .claude/skills/repo-tour/SKILL.md, on a new line below the description.
```

Then type `/clear` and ask "what's in this repo?" again. The agent still answers, but no line names repo-tour. Type the Skill's name as in step 5: it still runs.

7. Ask the router:

```text
/ask-matt I want to add a README to this repo. What do I type next?
```

8. Read its answer. If it says a Skill isn't installed, ignore that: user-invoked Skills are hidden from it. Then type `/exit`.

**It's working if:**

- [ ] `docs/agents/issue-tracker.md` says Local Markdown and puts issues under `.scratch/`, and `docs/agents/domain.md` exists.
- [ ] `CLAUDE.md` has an `## Agent skills` block pointing at each docs file.
- [ ] Before the flag, a line naming repo-tour appeared after your plain question.
- [ ] After the flag, no line named repo-tour, but typing its name still ran it.
- [ ] `/ask-matt` named what to type next and stopped without changing any file.
- [ ] Your `/` menu shows each of Matt's Skills once.

If `docs/agents/triage-labels.md` is missing, setup skipped the label question: it can miss `/triage`, since user-invoked Skills are hidden from the agent. `/to-spec` and `/to-tickets` need the labels too, so start `claude` again and type `/setup-matt-pocock-skills triage is installed`.
````

## Common mistakes

- **Installing both routes.** Every Skill shows up twice.
- **With the plugin, typing `/code-review` for Matt's review.** Type `/mattpocock-skills:code-review`.
- **Asking for a user-invoked Skill in words, or believing the agent when it says one isn't installed.** Type the name at the start of your message.
- **Editing the plugin's files, or expecting setup to hold preferences.** Standing rules go in your `CLAUDE.md`.
- **Choosing GitHub in a folder with no remote,** or without `gh` installed.
- **Installing only `/ask-matt`.** It routes you to Skills you don't have.
- **Writing a vague description** for your own Skill. The agent can't tell when to load it.

```site-story
I ran `/setup-matt-pocock-skills` early, and its output is in this repo's very first commit (`4f849b9`, 2026-10-21): `docs/agents/issue-tracker.md`, `domain.md` and `triage-labels.md`, plus the Agent skills block at the top of `CLAUDE.md`. The block still records my answers: local markdown issues under `.scratch/<feature>/`, the five default triage labels, and single-context docs. Because `triage-labels.md` is there, the label question did run for me. The same commit holds `.scratch/lesson-site/`, the first spec and its six tickets. Later plans went there too: the redesign, the Lesson engine and this course rewrite each have a folder in `.scratch/`.

My old journal Lessons record both reviews. To get Matt's two-part review, I typed `/mattpocock-skills:code-review`, reviewing everything since that first commit. Another time I typed `/code-review max`, which ran Claude Code's own bug hunt at maximum effort.

They also record one slip. Asking for the change that became the Main flow Lesson, I wrote "you can start grilling with docs" in plain words. The agent can't start a user-invoked Skill, so it ran `/grilling` and then `/domain-modeling`, the two halves `/grill-with-docs` is made of. Typing the name myself would have been one step.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Install for Claude Code | `claude plugin install mattpocock-skills@claude-plugins-official`, then restart |
| Other agents, or files you can edit | `npx skills@latest add mattpocock/skills` (never both routes) |
| New repo | `/setup-matt-pocock-skills`, once, then commit what it wrote |
| Not sure what's next | `/ask-matt` plus your situation |
| Matt's code review (plugin) | `/mattpocock-skills:code-review` |
| A user-invoked Skill, even one the agent calls missing | Type its name at the start of your message |
| A standing preference | A line in your `CLAUDE.md` |
| Your own Skill | `~/.claude/skills/<name>/SKILL.md` (you) or `.claude/skills/<name>/SKILL.md` (the repo) |
| The agent must never start it | `disable-model-invocation: true` |

## Final test

```test scenario-lost
Months from now, your site's code has grown tangled and you have a free afternoon to tidy it. You remember Matt has a Skill for this kind of upkeep, but not its name, and you don't want to scroll through all 27. What's the quickest reliable move?
- [ ] Ask the agent in plain words which of Matt's Skills handles this.
  > The agent can't see the 16 user-invoked Skills, and the one you need is among them. It may even say it isn't installed.
- [ ] Type `/code-review` and ask it to list what's messy.
  > Matt's review checks the changes since a starting point, not the whole codebase, and with the plugin the short name reaches Claude Code's own review anyway.
- [x] Type `/ask-matt`, then describe the tidy-up in plain words.
  > Right. The router knows every Skill in the set and names the one to type next, here `/improve-codebase-architecture`.
- [ ] Run `/setup-matt-pocock-skills` again so it lists your options.
  > Setup records the tracker, labels and docs layout. It doesn't route you anywhere.
```

```test scenario-review-clash
You installed Matt's Skills as the plugin. Your own Skill, finish-up, ends with the line "Then run code-review on the changes." Twice now, the review that came back was one list of possible bugs, with no Standards or Spec section. What do you change?
- [x] Write `mattpocock-skills:code-review` in that line.
  > Right. A bare code-review can land on Claude Code's own review, even when the agent makes the call. The full name always reaches Matt's.
- [ ] Add max after code-review, so the review runs harder.
  > That still reaches Claude Code's own bug hunt, just at maximum effort.
- [ ] Write `claude-plugins-official:code-review` in that line.
  > That's the marketplace's name, from the install line. A Skill's full name starts with its plugin's name, mattpocock-skills.
- [ ] Add `disable-model-invocation: true` to finish-up.
  > The flag only stops the agent starting finish-up on its own. It doesn't change which review a call to code-review reaches.
```

```test scenario-not-installed
You installed the plugin yesterday. Today, after a long build, you write "ok, now run retro on this session". The agent replies that it can't find a Skill called retro. Best move?
- [ ] Install the Skills again with npx so the agent can see them.
  > Now every Skill is installed twice, and `/retro` is still user-invoked, so the agent still can't see it.
- [ ] Ask the agent to install `/retro` for you.
  > It's already installed. The agent just can't see it.
- [ ] Run `/setup-matt-pocock-skills` again, then repeat the request.
  > Setup is about your tracker and docs. It doesn't change which Skills the agent can see.
- [x] Type `/retro` yourself, at the start of a message.
  > Right. User-invoked Skills are kept out of the agent's list, so it thinks they're missing. Typing the name runs it.
```

```test scenario-write-own
You keep pasting the same five rules for changelog entries into every session. You want the agent to follow them whenever it updates a changelog (the file listing what changed in each release), in every project, without you having to remember. What do you make?
- [ ] A Skill in the project's `.claude/skills/` with a clear description.
  > The agent would load it at the right moments, but only in this one repo.
- [x] A Skill in `~/.claude/skills/` with a clear description.
  > Right. A personal, model-invoked Skill reaches every project, and its description tells the agent when to load it.
- [ ] A Skill in `~/.claude/skills/` with `disable-model-invocation: true`.
  > It would reach every project, but that flag means only you can start it, so you'd still have to remember.
- [ ] A line in the project's `CLAUDE.md`.
  > That reaches only this repo, and it sits in the context window on every turn, needed or not.
```

```test spot-both-routes
Sam has signed in to Claude Code on his new laptop. Then he (1) runs `claude plugin install mattpocock-skills@claude-plugins-official`; (2) runs `npx skills@latest add mattpocock/skills` for his whole computer too, in case the plugin missed any Skills; (3) starts Claude Code in his repo and types `/setup-matt-pocock-skills`; (4) types `/grill-with-docs` to start his first feature. Spot the mistake.
- [ ] Step 1, the plugin install
  > The plugin is a complete route on its own: it carries all 27 Skills and updates itself.
- [x] Step 2, the npx install
  > Right. The plugin missed nothing, and the two routes are alternatives. With both, every Skill appears twice in his `/` menu.
- [ ] Step 3, running setup
  > Setup belongs here: once per repo, before the engineering Skills.
- [ ] Step 4, starting with `/grill-with-docs`
  > In a repo, `/grill-with-docs` is the head of the Main flow.
```

```test spot-chained-skills
Kai, a plugin user, writes a personal Skill, ship-it, with `disable-model-invocation: true`. Its body says: run `/to-spec`, then `/to-tickets`, then build with `/tdd`. He types its name. The agent builds with `/tdd` fine but never starts `/to-spec` or `/to-tickets`. Spot the mistake.
- [ ] The flag on ship-it stops it from starting any other Skill.
  > The flag only stops the agent from starting ship-it itself. A user-invoked Skill can still pull in model-invoked ones, which is why `/tdd` ran.
- [ ] He needed the full names, like `/mattpocock-skills:to-spec`.
  > Full names get you past a name clash. They don't change who is allowed to start a Skill.
- [ ] A personal Skill can't reach plugin Skills.
  > Where a Skill lives decides who gets it, not what it can call. `/tdd` came from the plugin and ran fine.
- [x] It chains user-invoked Skills, which only Kai can start.
  > Right. A Skill can call model-invoked ones like `/tdd`, never a user-invoked one. Kai has to type `/to-spec` and `/to-tickets` himself.
```

```test spot-edited-cache
Lee wanted `/implement` to close each ticket when it finished. He opened the plugin's copy of its SKILL.md and added a line. It worked, then a week later it silently stopped. Spot the mistake.
- [ ] He should have put the line in the Skill's description instead.
  > The description decides when a Skill loads, not what it does. And it lives in the same replaced file.
- [ ] He should have re-run `/setup-matt-pocock-skills` afterwards.
  > Setup records the tracker, labels and docs layout. It doesn't protect edits to Skill files.
- [x] He should have put the line in his own `CLAUDE.md`.
  > Right. Plugin files aren't his: the plugin updates itself, and each update brings fresh copies, so the edit was lost. A line in his own `CLAUDE.md` survives every update.
- [ ] He needed the plugin at project scope.
  > Scope changes where the plugin is available. An update still replaces its files.
```

```test sequence-new-repo
Claude Code is installed and you've signed in once. You want to use Matt's Skills on a brand-new project. Which order is right?
- [ ] `/setup-matt-pocock-skills` → install the plugin → start Claude Code in the project → `/grill-with-docs`
  > Setup is one of Matt's Skills, so it can't run before they're installed.
- [ ] Install the plugin → start Claude Code in the project → `/grill-with-docs` → `/setup-matt-pocock-skills`
  > Setup comes first: the engineering Skills assume the repo is already configured.
- [ ] Install the plugin and the npx copies → start Claude Code in the project → `/setup-matt-pocock-skills` → `/grill-with-docs`
  > Two routes give you every Skill twice. Pick one.
- [x] Install the plugin → start Claude Code in the project → `/setup-matt-pocock-skills` → `/grill-with-docs`
  > Right. Get the Skills, open the project, configure the repo once, then start the Main flow.
```

```test why-light-context
A friend refuses to install Matt's 27 Skills: "That much text will fill my context window before I've typed a word." What's the strongest reply?
- [x] "Until one runs, a Skill adds a line; user-invoked ones add none."
  > Right. Model-invoked Skills keep only their descriptions loaded until they run, and user-invoked ones keep even that out. Matt's whole set measured about 660 tokens.
- [ ] "They load in full, but a 1M-token window has room to spare."
  > They don't load in full. And a fuller window means a less sharp model, whatever its size.
- [ ] "Skills live on disk, so they never touch the context window."
  > They do once they run: the body joins the conversation and stays there.
- [ ] "Only Skills you type ever load; the agent never starts one by itself."
  > The 11 model-invoked Skills can be started by the agent, and their descriptions are always loaded.
```

```test why-clone-needs-setup
A friend clones your repo, installs Matt's Skills and types `/to-tickets`. It tells her to run `/setup-matt-pocock-skills` first, though you ran it weeks ago and chose local markdown. What's the likeliest reason?
- [ ] Setup saved its answers in your plugin folder.
  > Setup writes nothing into the plugin. Its answers are plain files in the repo.
- [ ] Setup has to run once per computer, as well as once per repo.
  > It runs once per repo. Once committed, its files reach every clone.
- [x] You never committed the files setup wrote into the repo.
  > Right. `/to-tickets` finds the tracker through `docs/agents/` and the Agent skills block in `CLAUDE.md`. Uncommitted, those files stayed on your computer.
- [ ] `/to-tickets` is user-invoked, so it can't read setup's files.
  > Being user-invoked limits who can start a Skill, not which files it reads.
```

```sources
- [setup-matt-pocock-skills SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/SKILL.md) and its templates (`issue-tracker-local.md`, `triage-labels.md`, `domain.md`): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md) and [PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/PHASE-BOUNDARIES.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [writing-for-agents SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/writing-for-agents/SKILL.md) and [SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/writing-for-agents/SKILL-MECHANICS.md) (context load, cognitive load, router Skills): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) (Installation; Reference: user-invoked vs model-invoked) and the bucket READMEs for [engineering](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/README.md), [productivity](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/productivity/README.md), [misc](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/misc/README.md) and [in-progress](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/in-progress/README.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [Renaming skills to dodge harness built-in commands](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/.out-of-scope/harness-name-collisions.md), mattpocock/skills `.out-of-scope/`: pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Claude Code docs (frontmatter, where Skills live, who can invoke them, where you write a Skill's name, loading, plugin command names), read 2026-10-23 with Claude Code 2.1.309.
- [Discover and install plugins](https://code.claude.com/docs/en/discover-plugins) and [Commands](https://code.claude.com/docs/en/commands), Claude Code docs (marketplaces, scopes, updates, `/plugin`, `/reload-plugins`, the bundled `/code-review` and its `/review` alias), read 2026-10-23.
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills), Anthropic Engineering, 2025-10-16 (progressive disclosure).
- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills) and [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), AI Hero docs, read 2026-10-23.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (empty or old repos 0:41–0:52, npx install and scopes 0:55–3:44, the `/` menu and 660 tokens 3:55–4:31, setup choices 4:35–6:50, `/ask-matt` 6:58–7:57).
- [5 Claude Code skills I use every single day](https://www.youtube.com/watch?v=EJyuu6zlQCg), Matt Pocock, 2026-03-16 (engineers with no memory 0:08–0:23, short Skills 3:41–3:46).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [implement loses two of its five beats on unattended runs](https://github.com/mattpocock/skills/discussions/1091), GitHub Discussion #1091 (the 173-session count, comment of 2026-09-29), about the loop in [afk.sh: chaining /implement over ready-for-agent tickets overnight](https://github.com/mattpocock/skills/discussions/1136), GitHub Discussion #1136, 2026-09-28.
- This site's repo: [CLAUDE.md](https://github.com/SiddharthMuramkar/idea-to-shipped/blob/main/CLAUDE.md) and [docs/agents/](https://github.com/SiddharthMuramkar/idea-to-shipped/tree/main/docs/agents), read 2026-10-24, first added in commit `4f849b9` (2026-10-21); the journal Lessons `07-code-review.md`, `10-models-effort-ultracode.md` and `11-main-flow.md` at commit `d21fc2c` (2026-10-22).
```
