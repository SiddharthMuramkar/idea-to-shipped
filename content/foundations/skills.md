---
title: What a Skill is
slug: skills
summary: What a Skill is, who can start one, how to install Matt Pocock's Skills, how to set up each repo once, and which Skill to ask when you're lost.
---

## What a Skill is

Say you've told your coding agent how you like commit messages three days running. Every session starts with an empty [context window](/learn/context-window), the agent's working memory, so tomorrow you'll explain it again. You could write the rules in your [instruction file](/learn/instruction-files), but that file loads in every session, even the ones that never make a commit.

**A Skill is a folder with a `SKILL.md` file inside: instructions for one kind of task, which the agent loads only when that task comes up.**

Claude Code, Anthropic's coding agent, reads Skills, and so do other agents such as Codex. A `SKILL.md` has two parts. At the top, between two `---` lines, is the **frontmatter**: a few settings written as `key: value`. Below it is the body, the instructions, written in Markdown (plain text with a few marks, like `#` for a heading).

For example, here's a whole Skill for commit messages. A **commit** is a saved snapshot of your project (see [commits and diffs](/learn/commits-and-diffs)).

```markdown
---
name: commit-style
description: House rules for commit messages. Use when writing or amending a commit.
---

Write the first line as an instruction ("Add the booking form"), under 60 characters.
Leave a blank line, then explain why the change was needed.
```

- **`name`** is what you type after a slash to start it: here, commit-style. Leave it out and the folder's name is used.
- **`description`** says what the Skill is for and when to use it. The agent reads it to decide whether your request fits, so put the use case first.
- **The body** is the process itself. It can point at other files in the same folder.

```checkpoint quick-1
Your Skill lives in a folder called `commit-style`, and its frontmatter has no `name` line. How do you start it?
- [x] Type a slash and commit-style, the folder's name.
- [ ] Type a slash and SKILL, the name of the file inside it.
- [ ] You can't, until you add a `name` line to the frontmatter.
Why: The `name` line sets what you type after the slash. Leave it out and the folder's name is used instead.
```

## How a Skill loads

A Skill costs almost nothing until it runs, because the agent gets it in stages:

1. **When a session starts,** each Skill's description goes into the context window, so the agent knows what's available. That's a line or two per Skill.
2. **When the Skill runs,** because you typed its name or the agent decided your request fits, the whole `SKILL.md` joins the conversation. It stays there for the rest of the session.
3. **Extra files** in the folder load only when the body sends the agent to them.

```diagram
type: chain
caption: "A Skill costs almost nothing until it runs"
steps:
  - label: "When a session starts"
    note: "each Skill's description goes into the context window"
  - label: "When the Skill runs"
    note: "the whole `SKILL.md` joins the conversation"
  - label: "Extra files"
    note: "load only when the body sends the agent to them"
```

Matt Pocock, a developer and teacher who publishes a popular free set of Skills, calls this **progressive disclosure**: "the agent pulls in knowledge only when needed."

```checkpoint quick-2
You add a Skill with a two-line description and a 300-line body. In a new session where nobody mentions its task, what's in the context window?
- [x] Only its description, so the agent knows it's there.
- [ ] All 300 lines, so the agent is ready the moment you need it.
- [ ] Nothing at all, until you type its name yourself.
Why: When a session starts, each Skill adds only its description. The body joins the conversation when the Skill runs.
```

You can keep a Skill in three places. `~` is shorthand for your home folder, and a **repo** is a project folder tracked with Git (see [what Git and GitHub are](/learn/what-git-and-github-are)).

| Where | Path | Who gets it |
|---|---|---|
| Personal | `~/.claude/skills/<name>/SKILL.md` | You, in every project on this computer |
| Project | `.claude/skills/<name>/SKILL.md` in a repo | Everyone working in that repo, once you commit it |
| Plugin | Inside an installed plugin (see below) | Wherever the plugin is turned on |

```checkpoint quick-3
You want a Skill that you and every teammate get in one repo. Where does it go?
- [x] In the repo's `.claude/skills/` folder, committed.
- [ ] In `~/.claude/skills/` on your own computer.
- [ ] In the repo's `CLAUDE.md`, as a few extra lines.
Why: A project Skill lives in the repo's `.claude/skills/` folder, and everyone working in the repo gets it once you commit it. A personal Skill reaches only you.
```

## Who can start a Skill

By default, both of you can. You type a slash and its name at the start of your message. The agent loads it by itself when your request matches its description.

One frontmatter line changes that: `disable-model-invocation: true`. Now only you can start the Skill. Its description stays out of the context window, so the agent doesn't know the Skill is there. If it tries to start it anyway, Claude Code blocks the call.

Matt names the two kinds by who can start them:

- **Model-invoked:** you or the agent (the model) can start it. Matt uses these for reusable discipline, like the rules of a good test.
- **User-invoked:** only you can. Matt uses these to run a whole process, like turning a conversation into a written plan.

A user-invoked Skill can call model-invoked ones, but never another user-invoked one.

```checkpoint quick-4
You're writing a Skill that publishes your site. You want to run it yourself, but the agent must never start it on its own. What do you add?
- [x] `disable-model-invocation: true` in its frontmatter.
- [ ] "Only when the user asks" at the end of its description.
- [ ] Nothing, because agents only run the Skills you type.
Why: That line makes the Skill user-invoked: you can still type it, the agent can't start it, and Claude Code blocks the call if it tries. Wording in the description is only a hint.
```

Matt's set has 27 Skills: 16 user-invoked and 11 model-invoked.

| Only you can start these (16) | You or the agent can start these (11) |
|---|---|
| `/ask-matt`, `/setup-matt-pocock-skills`, `/grill-with-docs`, `/grill-me`, `/handoff`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`, `/triage`, `/wayfinder`, `/improve-codebase-architecture`, `/retro`, `/wait-what`, `/teach`, `/to-questionnaire` | `/grilling`, `/domain-modeling`, `/prototype`, `/tdd`, `/code-review`, `/pr`, `/diagnosing-bugs`, `/research`, `/wizard`, `/codebase-design`, `/writing-for-agents` |

```checkpoint quick-5
You type `/implement`, and it runs `/tdd` while it builds. Could it also start `/retro` at the end?
- [x] No: both are user-invoked, and those never start each other.
- [ ] Yes: any Skill can start any other Skill in the same session.
- [ ] Yes, but only once you've given the agent permission to do so.
Why: A user-invoked Skill can call model-invoked ones, like `/tdd`, but never another user-invoked one. `/retro` is user-invoked, so you type it yourself.
```

## Installing Matt's Skills

A **plugin** is a package that installs a set of Skills, and other add-ons, in one go. It comes from a **marketplace**, a catalogue of plugins. Claude Code adds Anthropic's official one, `claude-plugins-official`, the first time you start it in a terminal, and Matt's Skills are in it.

Run this in your terminal, not inside Claude Code:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

The part before the `@` is the plugin, and the part after it is the marketplace. It installs for you, in every project on this computer, and it updates itself. If Claude Code was already open, type `/reload-plugins` there, or restart it.

Then type `/` in Claude Code to see the Skills. Each one answers to a short name, like `/grill-me`, and to a full name with the plugin in front, like `/mattpocock-skills:grill-me`.

The other route is the skills.sh installer:

```sh
npx skills@latest add mattpocock/skills
```

It needs Node.js, which provides `npx`. It works for other agents too, and it copies files you own: you can edit them, and you update them by hand. It asks which Skills you want (include `setup-matt-pocock-skills`), which agents, and whether to install for one project or your whole computer.

**Pick one route per agent: install both, and every Skill appears twice.**

The plugin carries the 27 Skills above. Matt's rarely used ones, such as `/setup-pre-commit`, don't ship in it.

```checkpoint quick-6
Claude Code is open in one terminal. In a second terminal you run the plugin install, and it works. Back in the open session, none of Matt's Skills show up. What do you do?
- [x] Type `/reload-plugins`, or quit and start Claude Code again.
- [ ] Run the skills.sh installer too, in case the plugin quietly failed.
- [ ] Type `/setup-matt-pocock-skills` to switch the Skills on.
Why: An open session hasn't loaded the new plugin yet. Reloading plugins, or a restart, picks it up. Running the other installer too would give you every Skill twice.
```

## Set up each repo once

Several of Matt's Skills need three facts about your repo:

- where its Issues live, the to-do items a project tracks (see [keeping track](/learn/issues-and-keeping-track));
- what its triage labels are called, the tags that sort incoming Issues;
- where its glossary and its decision records go.

`/setup-matt-pocock-skills` asks once and writes the answers down. Run it once per repo, before the other engineering Skills. It's user-invoked, so you type it. A run could go like this:

```text
you:   /setup-matt-pocock-skills
agent: This repo is on GitHub. Use GitHub Issues? (recommended)
you:   yes
agent: Keep the default triage labels? (recommended: yes)
you:   yes
agent: Here's a draft of every file. Edit anything first?
```

It writes `docs/agents/issue-tracker.md`, `docs/agents/domain.md` and, when the triage Skill is installed, `docs/agents/triage-labels.md`. It also adds an `## Agent skills` block that points at them, in your `CLAUDE.md`, or in `AGENTS.md` if that's the file you have. Commit those files, and everyone who clones the repo gets the same setup. [setup-matt-pocock-skills](/learn/setup-matt-pocock-skills) covers each question.

```checkpoint quick-7
A friend clones your repo and types `/to-tickets`. It tells her to run setup first, though you ran it weeks ago. What's the likeliest reason?
- [x] You never committed the files setup wrote.
- [ ] Setup has to run again on every computer.
- [ ] Setup saves its answers inside the plugin.
Why: Setup's answers are plain files in the repo. Uncommitted, they stayed on your computer, so her clone has no `docs/agents/` files to read.
```

## Lost? Ask the router

Sixteen Skills that only you can start is a lot to remember. Matt's answer is a **router**: one user-invoked Skill, `/ask-matt`, that knows the others and when each fits. You remember one name instead of sixteen.

For example, you type your situation after its name:

```text
/ask-matt I want to add a cancel button to the booking page. Where do I start?
```

It might answer:

```text
You're in a repo, so start at the top of the main flow.
Type /grill-with-docs. If the build spans sessions,
/to-spec and /to-tickets come next.
```

It places you on a route: the [main flow](/learn/main-flow) from idea to shipped code, an on-ramp such as a bug, codebase upkeep, or a standalone Skill. It says what to type next and where to clear the session, then it stops. You type the Skill it names. [ask-matt](/learn/ask-matt) covers it in full.

```checkpoint quick-8
You describe a bug report to `/ask-matt`. It says `/triage` fits, explains why, and does nothing more. What's going on?
- [x] It recommends and stops: you type `/triage` yourself.
- [ ] It's running `/triage` quietly in the background.
- [ ] It's waiting for you to say "go ahead" before it runs it.
Why: The router never runs what it names. `/triage` is user-invoked, and one user-invoked Skill can't start another, so you type it.
```

## Going deeper

### Why it exists

Matt describes agents as "a fleet of middling to good engineers" with "a critical flaw: they have no memory." So the way you like to work has to be written down where they can read it.

An instruction file is read in every session, needed or not. A Skill is read only when its task comes up. So you can write down a whole process, and pay for it only when you use it.

Skills needn't be long, either. In Matt's words: "Skills don't have to be long to be impactful." His `/grill-me` Skill's body is a single line that hands over to another Skill:

```markdown
Call the Skill tool with "grilling".
```

```checkpoint quick-9
Why can a Skill hold a long process when an instruction file shouldn't?
- [x] A Skill is read only when its task comes up, not in every session.
- [ ] A Skill's body is compressed, so it takes up fewer tokens.
- [ ] An instruction file can only hold one line per rule.
Why: An instruction file is read in every session, needed or not. A Skill is read only when its task comes up, so you pay for it only when you use it.
```

### How it works underneath

**Two kinds of cost.** Matt's guide to writing Skills splits their cost in two. A model-invoked Skill pays **context load**: its description sits in the context window all the time, so the agent can find it. A user-invoked Skill pays **cognitive load**: nothing sits in the window, but "you are the index that must remember it exists".

A router cures piled-up cognitive load, as one Skill to remember instead of many. It can only hint, though, because nothing but you can start a user-invoked Skill.

```diagram
type: compare
caption: "Matt's guide to writing Skills splits their cost in two"
columns: ["A model-invoked Skill", "A user-invoked Skill"]
rows:
  - label: "pays"
    cells: ["context load", "cognitive load"]
  - label: "description always loaded"
    cells: ["yes", "no"]
footer: "A router cures piled-up cognitive load"
```

```checkpoint quick-10
You make a Skill user-invoked. What cost does it bring instead of context load?
- [x] Cognitive load: you must remember that it exists.
- [ ] A bigger body, since it has to explain itself to you.
- [ ] Both loads, because you and the agent each pay one.
Why: A user-invoked Skill keeps nothing in the context window, so the agent pays nothing. You pay instead: you are the index that must remember it exists.
```

**Why Matt's set is light.** Most of his Skills are user-invoked, so few descriptions sit in the window. In his walkthrough video, his whole set took up about 660 tokens (tokens are the small chunks of text a model reads). Type `/context` to see what fills yours.

**Where you type the name.** A Skill's name runs it only at the start of your message. Later in a sentence, as in `go ahead and /deploy to staging`, the name only gives the agent permission, and nothing runs directly. So type the name first.

**Which copy runs.** If a personal Skill and a project Skill share a name, the personal one runs. A plugin's Skills load alongside both, because their full names start with the plugin's name.

**Edits count straight away.** Claude Code watches the Skills folders, so an edit to a Skill takes effect within the session. A Skills folder that didn't exist when the session started needs `/reload-skills`.

```checkpoint quick-11
You write "go ahead and" followed by a Skill's name, in the middle of your message. What happens?
- [x] Nothing runs directly: the name only counts as permission.
- [ ] The Skill runs straight away, as if you'd typed it first.
- [ ] Claude Code rejects the message and asks you to retype it.
Why: A Skill's name runs it only at the start of your message. Later in a sentence, it only gives the agent permission, so type the name first.
```

### A real example

In a July 2026 video, Matt set his Skills up on one of his work repos, a command-line tool called the AI Hero CLI.

He installed them with the skills.sh installer, chose all the official Skills, and picked Claude Code. He installed them for his whole computer, since he works alone, and said project scope suits a team, so everyone uses the same set. Typing `/` listed the Skills, and `/context` showed the whole set at 660 tokens.

Next he ran `/setup-matt-pocock-skills`: local Markdown files for Issues, the default triage labels, and one glossary for the whole repo. Then he asked `/ask-matt` how to start a code change. It told him to start at the top of the main flow and walk down it "in one unbroken context window".

So the whole path took three steps: install, set up the repo, ask the router.

```checkpoint quick-12
You're setting up Matt's Skills for a team's repo with the skills.sh installer. Which scope did Matt suggest for a team?
- [x] Project scope, so everyone uses the same set.
- [ ] Your whole computer, so each person picks their own.
- [ ] Both scopes at once, so nobody misses a Skill.
Why: Matt installed for his whole computer because he works alone, and said project scope suits a team, so everyone uses the same set.
```

### Where it goes wrong

**The agent says a Skill isn't installed.** User-invoked Skills are kept out of the agent's list of Skills, so it decides they're missing. In one report, it sent the user to other Skills instead. Type the name yourself, at the start of your message: it loads fine.

```checkpoint quick-13
You write "now run retro on this session", and the agent says it can't find a Skill called retro. What do you do?
- [x] Type `/retro` yourself, at the start of a message.
- [ ] Install the Skills again, so the agent can see them.
- [ ] Run setup again, then repeat the request in plain words.
Why: `/retro` is user-invoked, so it's kept out of the agent's list and the agent thinks it's missing. Typing the name at the start of your message runs it.
```

**Every Skill shows up twice in the `/` menu.** You installed both routes. Keep one. To drop the plugin, run `claude plugin uninstall mattpocock-skills@claude-plugins-official` in your terminal.

**`/code-review` came back as one list of possible bugs.** Claude Code ships its own `/code-review`, which hunts for bugs. With the plugin, the short name reaches that one, not Matt's review against your standards and your plan. Type the full name, `/mattpocock-skills:code-review`.

The clash can hit inside Skills too: one user reported that a Skill calling code-review by its short name got Claude Code's review. Matt won't rename his Skills to dodge clashes, because tools keep adding names. A hidden Claude Code Skill also takes `/prototype`, and `/mattpocock-skills:prototype` always works. On the skills.sh route, your copy takes `/code-review`, and Claude Code's stays reachable as `/review`.

```checkpoint quick-14
You installed the plugin. Your own Skill ends with "Then run code-review", and the review keeps coming back as a plain bug list. What do you change?
- [x] Write mattpocock-skills:code-review in that line.
- [ ] Add max after code-review, so it runs harder.
- [ ] Write claude-plugins-official:code-review instead.
Why: A short code-review can reach Claude Code's own review, even when a Skill makes the call. The full name, which starts with the plugin's name, always reaches Matt's.
```

**A change you made to a Skill vanished.** A plugin's files are replaced when it updates, and `npx skills@latest update` overwrites copied ones. Put standing rules in your own `CLAUDE.md` instead, which no update touches.

**The agent never picks your own Skill.** Its description is too vague to match your requests. Put the use case first, in the words you'd type, such as "Use when the user asks what changed".

### Try it

You'll need Claude Code installed and signed in (see [start here](/learn/start-here)), plus Git. If Claude Code asks permission to create or change a file this exercise names, choose Yes.

1. Make a practice repo: `mkdir skills-practice && cd skills-practice && git init`.
2. Start Claude Code: `claude`. If it asks whether you trust the folder, choose Yes.
3. Type `/skills`, then type `grill` to filter the list. You should see Matt's grill Skills. If not, type `/exit`, run the plugin install from above, and start `claude` again.
4. Type `/setup-matt-pocock-skills`. Answer "local markdown" for the Issue tracker, and keep the default labels if it asks.
5. If it asks which file to create, choose `CLAUDE.md`. You should see drafts before it writes anything.
6. Paste this message, to make a Skill of your own:

```text
Create .claude/skills/repo-tour/SKILL.md with exactly this content:
---
description: Give a short tour of this repo. Use when the user asks what is in this repo or where things live.
---
Start your answer with "Repo tour:". Then list the top-level files and folders, one line each.
```

7. Type `/reload-skills`, since the Skills folder is new. You should see how many Skills it added.
8. Ask in plain words: `what's in this repo?` You should see an answer that starts with "Repo tour:". If not, ask once more.
9. Paste: `Add the line disable-model-invocation: true to the frontmatter of .claude/skills/repo-tour/SKILL.md, below the description.`
10. Type `/clear`, then ask `what's in this repo?` again. The answer shouldn't start with "Repo tour:" now, because the agent can't start the Skill.
11. Start it yourself: type a slash and repo-tour. You should see "Repo tour:" again.
12. Ask the router: `/ask-matt I want to add a README to this repo. What do I type next?` You should see it name a Skill to type, then stop.
13. Check what setup wrote: open `CLAUDE.md`, and look in `docs/agents/`. Then type `/exit`.

### Read more

- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [Install and manage plugins](https://code.claude.com/docs/en/plugins/install), Anthropic
- [Skills For Real Engineers (README)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, updated 2026-08-24

## Remember

```flashcards
Q: What is a Skill?
A: A folder with a `SKILL.md` file: instructions for one kind of task, which the agent loads only when that task comes up.

Q: What does a Skill put in the context window before it runs?
A: Only its description, unless it's user-invoked, in which case nothing at all.

Q: Which frontmatter line makes a Skill user-invoked?
A: `disable-model-invocation: true`. Then only you can start it, by typing its name.

Q: Can one user-invoked Skill start another?
A: No. A user-invoked Skill can call model-invoked ones, never another user-invoked one.

Q: What's the install command for Matt's Skills in Claude Code?
A: `claude plugin install mattpocock-skills@claude-plugins-official`, run in your terminal. The other route is `npx skills@latest add mattpocock/skills`. Never both.

Q: When do you run `/setup-matt-pocock-skills`?
A: Once per repo, before the other engineering Skills. Then commit the files it writes.

Q: With the plugin, how do you reach Matt's review rather than Claude Code's own?
A: By its full name, `/mattpocock-skills:code-review`.
```

## Final test

```final-test skills-scenario-lost
Months from now, your site's code has grown tangled, and you have a free afternoon to tidy it. You remember Matt has a Skill for this upkeep, but not its name. What's the quickest reliable move?
- [x] Type `/ask-matt`, then describe the tidy-up in plain words.
- [ ] Ask the agent in plain words which of Matt's Skills does this.
- [ ] Type `/code-review` and ask it to list what's messy.
- [ ] Run `/setup-matt-pocock-skills` again so it lists your options.
Why: The router knows every Skill in the set, codebase upkeep included, and names the one to type next. The agent can't see user-invoked Skills, so asking it in plain words may get you "not installed".
```

```final-test skills-spot-both-routes
Sam signs in to Claude Code on a new laptop. He (1) runs the plugin install, (2) runs the skills.sh installer for his whole computer too, "in case the plugin missed some", (3) runs setup in his repo, then (4) types `/grill-with-docs`. Spot the mistake.
- [x] Step 2: the two routes are alternatives, so now every Skill appears twice.
- [ ] Step 1: the plugin doesn't carry the Skills he needs for a repo.
- [ ] Step 3: setup should run only after the first grilling session.
- [ ] Step 4: `/grill-with-docs` can't run until a Spec exists.
Why: The plugin is a complete route on its own. Pick one route per agent, because installing both gives you every Skill twice. Setup belongs once per repo, before the other engineering Skills.
```

```final-test skills-spot-chained
Kai writes a Skill, ship-it, with `disable-model-invocation: true`. Its body says to run `/to-spec`, then `/to-tickets`, then build with `/tdd`. He types its name. `/tdd` runs fine, but `/to-spec` and `/to-tickets` never start. Spot the mistake.
- [x] It chains user-invoked Skills, which only Kai can start.
- [ ] The flag on ship-it stops it from starting any other Skill.
- [ ] A personal Skill can't reach Skills that came from a plugin.
- [ ] He needed the full names, like `/mattpocock-skills:to-spec`.
Why: A Skill can call model-invoked ones like `/tdd`, never a user-invoked one. `/to-spec` and `/to-tickets` are user-invoked, so Kai has to type them himself. Full names get past a name clash; they don't change who may start a Skill.
```

```final-test skills-spot-edited-plugin
Lee wanted `/implement` to close each Ticket when it finished. He opened the plugin's copy of its `SKILL.md` and added a line. It worked, then a week later it stopped. Spot the mistake.
- [x] The line belonged in his own `CLAUDE.md`, which no update replaces.
- [ ] The line belonged in the Skill's description, not in its body.
- [ ] He should have run setup again after he edited the file.
- [ ] He needed to install the plugin for one project, not his computer.
Why: A plugin's files are replaced when it updates, so the edit was lost. Standing rules go in your own `CLAUDE.md`.
```

```final-test skills-sequence-new-repo
Claude Code is installed and signed in. You want Matt's Skills on a brand-new project. Which order is right?
- [x] Install the plugin, start Claude Code in the project, run setup, then `/grill-with-docs`.
- [ ] Run setup, install the plugin, start Claude Code in the project, then `/grill-with-docs`.
- [ ] Install the plugin, start Claude Code in the project, `/grill-with-docs`, then run setup.
- [ ] Install the plugin and the skills.sh copies, start Claude Code, run setup, then `/grill-with-docs`.
Why: Setup is one of Matt's Skills, so it can't run before they're installed, and it comes before the other engineering Skills. Two install routes give you every Skill twice.
```

```final-test skills-why-light
A friend won't install Matt's 27 Skills: "That much text will fill my context window before I type a word." What's the best reply?
- [x] Until one runs, a Skill adds only its description, and user-invoked ones add nothing.
- [ ] They load in full, but a big context window has plenty of room to spare.
- [ ] Skills stay on disk, so they never touch the context window at all.
- [ ] Only the Skills you type ever load, because the agent never starts one.
Why: Model-invoked Skills keep only their descriptions loaded until they run, and user-invoked ones keep even that out. Matt's whole set measured about 660 tokens. Once a Skill runs, its body does join the conversation.
```

```final-test skills-write-own
You paste the same five rules for changelog entries (a file listing what changed) into every session. You want the agent to follow them whenever it updates a changelog, in every project, without you remembering. What do you make?
- [x] A Skill in `~/.claude/skills/` with a clear description.
- [ ] A Skill in one repo's `.claude/skills/` with a clear description.
- [ ] A Skill in `~/.claude/skills/` with `disable-model-invocation: true`.
- [ ] A line in one repo's `CLAUDE.md` that lists the five rules.
Why: A personal Skill reaches every project on your computer, and a model-invoked one lets the agent load it when its description fits. The flag would leave starting it to you, and a project Skill or `CLAUDE.md` line reaches one repo only.
```

```final-test skills-review-clash
You installed the plugin, and you type `/code-review` to get Matt's review of your branch against your standards and your plan. You get back one list of possible bugs. What happened?
- [x] The short name reached Claude Code's own review, not Matt's.
- [ ] Matt's review found no problems with your standards or plan.
- [ ] The review ran at too low an effort level to reach those parts.
- [ ] You need to run setup before Matt's review can check standards.
Why: Claude Code ships its own `/code-review`, which hunts for bugs, and with the plugin the short name reaches that one. The full name, `/mattpocock-skills:code-review`, always reaches Matt's.
```

```sources
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Anthropic
- [Commands](https://code.claude.com/docs/en/commands), Anthropic
- [Install and manage plugins](https://code.claude.com/docs/en/plugins/install), Anthropic
- [Skills For Real Engineers (README)](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/README.md), Matt Pocock
- [writing-for-agents: SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/writing-for-agents/SKILL-MECHANICS.md), Matt Pocock's Skills
- [setup-matt-pocock-skills: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/SKILL.md), Matt Pocock's Skills
- [ask-matt: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/SKILL.md), Matt Pocock's Skills
- [grill-me: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grill-me/SKILL.md), Matt Pocock's Skills
- [Renaming skills to dodge harness built-in commands](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/harness-name-collisions.md), Matt Pocock, 2026-10-06
- [Changes to misc/ skills](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/.out-of-scope/frozen-misc-skills.md), Matt Pocock
- [/code-review name clash with Claude Code built-in (#483)](https://github.com/mattpocock/skills/issues/483), N0tS0Lucky and others, 2026-07-09
- [ask-matt names five skills the agent cannot see, so it reports them as not installed (#740)](https://github.com/mattpocock/skills/issues/740), drormeir, 2026-08-04
- [A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md), Matt Pocock, updated 2026-01-18
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day), Matt Pocock, 2026-03-16
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16
- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills), Matt Pocock, updated 2026-08-24
- [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), Matt Pocock, updated 2026-08-24
```
