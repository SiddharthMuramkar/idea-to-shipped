---
title: Skills
slug: skills
order: 3
part: 1
image: /photos/skills.jpg
imageAlt: Wrenches, pliers and screwdrivers hang in neat rows on a dark pegboard.
imageCredit: Anton Savinov
---

A Skill is a small instruction file your agent loads only when it's needed. Install Matt Pocock's set once, set up each repo once, and learn which Skills only you can start.

```goals
- You'll be able to explain what a Skill is and how it stays out of the context window until it's needed.
- You'll be able to tell a user-invoked Skill from a model-invoked one, and predict which ones the agent can start on its own.
- You'll be able to install Matt's Skills by one route, run `/setup-matt-pocock-skills` once per repo, and say what it writes.
- You'll be able to use `/ask-matt` to find your next step, and reach a Skill whose short name is taken, like `/mattpocock-skills:code-review`.
```

## Why it matters

Claude Code is Anthropic's coding agent: an AI that reads your files, runs commands and writes code from your terminal. Every session (one conversation, from typing `claude` until you clear it or quit) starts from nothing. Matt Pocock, a developer and teacher who publishes a popular set of Skills for Claude Code, described agents in March 2026 as a fleet of decent engineers with no memory. Nothing they learned yesterday survives, so the way you like to work has to be written down somewhere they can read it.

There are two obvious places to write it, and both hurt. You can paste your instructions into every session, which is tedious and easy to get wrong. Or you can put everything in `CLAUDE.md`, a file of standing instructions the agent reads at the start of every session. That works for a few lines. But everything in it sits in the agent's ==context window== on every turn, whether today's work needs it or not. The context window is the agent's working memory for one session, measured in tokens (small chunks of text, roughly three-quarters of a word each). As it fills, the model reasons less sharply; [The context window](/learn/context-window) explains why.

A Skill is the middle path: a process ==written once, loaded only when it's needed==. Matt's set holds his whole way of working, from interviewing you about an idea to reviewing the finished code, and most of it costs nothing until you use it.

## The idea: a folder with one file

A Skill is a folder with a file called `SKILL.md` inside. The file has two parts. At the top, between two `---` lines, is the frontmatter: a few settings written as `key: value`. Below it is the body: instructions in plain Markdown, the simple formatting this page is written in. Here's a complete, working Skill:

```md
---
name: commit-style
description: House rules for commit messages. Use when writing or amending a commit.
---

Write the first line as an instruction ("Add comment box"), under 60 characters.
Leave a blank line, then explain why the change was needed.
```

- **`name`** is what you type after a `/` to start it: here, commit-style. Leave it out and the folder's name is used.
- **`description`** says what the Skill is for and when to reach for it. It's the line the agent reads to decide whether a task fits, so lead with the trigger and keep it short.
- **The body** is the process itself. It can point at other files in the same folder.

What makes Skills cheap is ==progressive disclosure==: the agent gets each part only when it needs it.

1. **When a session starts,** the name and description of each Skill the agent is allowed to start go into the context window. A line or two each, nothing more.
2. **When the Skill runs,** because you typed its name or the agent decided your request fits, the whole `SKILL.md` loads. It then stays in the conversation; it isn't re-read on every turn.
3. **Extra files in the folder** load only if the body sends the agent there. Matt's `tdd` Skill keeps its examples of good tests and its rules on mocking in two side files, opened only when needed.

So a long body costs nothing until the Skill runs, and many are short anyway. "Skills don't have to be long to be impactful," Matt said in that March video. The body of his `/grill-me` is a single line telling the agent to load another Skill.

You can keep Skills in three places:

| Where | Path | Who gets it |
|---|---|---|
| Personal | `~/.claude/skills/<name>/SKILL.md` | You, in every project on this computer |
| Project | `.claude/skills/<name>/SKILL.md` inside a repo | Everyone working in that repo, once you commit it |
| Plugin | Inside an installed plugin (see below) | Wherever the plugin is switched on |

A repo is a project folder tracked with Git. If a personal Skill and a project Skill share a name, the personal one wins. Claude Code notices when you edit a Skill, but if you create a Skills folder that didn't exist when the session started, type `/reload-skills`. When you come to write your own, Matt's `/writing-for-agents` is his guide to doing it well ([Retro](/learn/retro) covers it).

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
# You write "let's build the comment length limit test-first". That matches the description, so the agent loads the whole Skill.
at: body
# The body points to `tests.md` for examples. The agent opens it only when it needs one.
at: extra
# From here the body sits in the conversation. It isn't fetched again on every turn.
at: stays
```

```checkpoint what-loads-early
You add a personal Skill for formatting recipes: a two-line description, a 300-line body and three example files in its folder. You leave the frontmatter at its defaults. In a new session where nobody has mentioned recipes, what part of it is in the context window?
- [ ] All of it, so the agent is ready the moment you need it.
  > Loading everything up front is exactly what progressive disclosure avoids. The body waits until the Skill runs.
- [x] Only its name and description.
  > Right. That's the first level. The body loads when the Skill runs, and the example files only when the body sends the agent to them.
- [ ] Nothing at all until you type its name.
  > That's true of a user-invoked Skill. This one is model-invoked by default, so its description is loaded to let the agent spot when it fits.
- [ ] The body, but not the example files.
  > The body loads only when the Skill runs. Before that, only the name and description are there.
```

## Who can start a Skill

You can start any of Matt's Skills by typing `/` and its name. The frontmatter decides whether the agent can start it too, and Matt splits his Skills on exactly that line:

- **Model-invoked** (the default): you can type it, and the agent can also load it on its own when your words match its description. The price is that the description sits in the context window on every turn. Matt calls this context load.
- **User-invoked**: the frontmatter adds `disable-model-invocation: true`. Only you can start it. Its description is kept out of the agent's context completely, so it costs nothing until you type it. The price moves to you: you have to remember it exists, which Matt calls cognitive load. If the agent tries to start one anyway, Claude Code stops it and tells it to ask you.

In Matt's design, ==user-invoked Skills orchestrate==: each runs a whole process, like turning a conversation into a spec. Model-invoked Skills hold reusable discipline, such as what makes a good test, that any process can pull in. A user-invoked Skill can call model-invoked ones, but never another user-invoked one. And plain words can start a model-invoked Skill but never a user-invoked one: for those, type the name yourself, at the start of your message.

Here are all 27 Skills in Matt's set, sorted into the two folders he keeps them in:

| Folder | User-invoked: only you (16) | Model-invoked: you or the agent (11) |
|---|---|---|
| Engineering (code work) | `/ask-matt`, `/setup-matt-pocock-skills`, `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`, `/triage`, `/wayfinder`, `/improve-codebase-architecture`, `/retro` | `/prototype`, `/tdd`, `/code-review`, `/pr`, `/diagnosing-bugs`, `/research`, `/wizard`, `/domain-modeling`, `/codebase-design` |
| Productivity (any work) | `/grill-me`, `/handoff`, `/wait-what`, `/teach`, `/to-questionnaire` | `/grilling`, `/writing-for-agents` |

Making most of them user-invoked keeps the set light. In his July 2026 walkthrough, Matt typed `/context`, a Built-in command (one that comes with Claude Code itself, not a Skill) that shows what's filling the window, and his whole set came to about 660 tokens.

There's one side effect to know. Because user-invoked Skills are hidden from the agent, it doesn't know they exist. Ask it about `/to-spec` and it may tell you that Skill isn't installed. It is. Type it.

```checkpoint deploy-flag
You're writing a Skill that publishes your site to the internet. You want to run it yourself sometimes, but the agent must never decide to run it on its own. What do you add?
- [ ] "Only when the user asks" at the end of its description.
  > The description is what the agent reads to decide when a Skill fits. Wording can nudge it, but it isn't a lock.
- [ ] Nothing. Agents only run Skills when you type them.
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

That's the whole install. The plugin goes in at user scope, so every project on your computer gets it, and it updates itself. Its files are read-only: don't edit them, because the next update replaces them. If Claude Code was already open, restart it or type `/reload-plugins`. Then type `/` to see the Skills. Each one answers to its short name, like `/grill-me`, and to its full name, `/mattpocock-skills:grill-me`. `/plugin` opens a panel where you can see, switch off or remove plugins.

The other route is `npx skills@latest add mattpocock/skills`. It needs Node.js, works with other agents too (Cursor, Codex and more), and copies editable files that you own and update by hand. It asks which Skills you want (include `/setup-matt-pocock-skills`), which agents, and whether to install for one project or your whole computer. Matt's July 2026 walkthrough used this route, before the plugin existed. He chose his whole computer because he works solo, and said teams should pick project scope so everyone shares one set.

Pick one route. ==Install both and every Skill appears twice.==

The plugin carries exactly the 27 Skills above. Matt's misc folder (`/git-guardrails-claude-code`, `/setup-pre-commit`, `/migrate-to-shoehorn`, `/scaffold-exercises`) holds tools he keeps around but rarely uses, and an in-progress folder holds beta Skills that can change or vanish. Neither ships in the plugin, and this course doesn't use them.

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

Several of Matt's engineering Skills need three facts about your repo: where issues (tickets of work to do) live, what the triage labels are called, and where the project's glossary and decision records go. `/setup-matt-pocock-skills` asks and writes the answers down. It's user-invoked, and you run it ==once per repo, before any other engineering Skill==. It works in an empty folder or an old project.

It follows the same steps every time:

1. **Explore.** It checks for a Git remote (a copy of the repo on a site like GitHub), a `CLAUDE.md` or `AGENTS.md`, a `GLOSSARY.md`, earlier setup files, a `.scratch/` folder, whether `/triage` is installed, and signs of a very large multi-package repo.
2. **Ask, one section at a time,** leading with its recommendation so you can accept in a word:
   - **Issue tracker.** GitHub (needs the `gh` tool), GitLab (needs `glab`), local markdown (files under `.scratch/<feature>/`, no remote needed) or Other, where you describe Jira, Linear or anything else in a paragraph. If your remote points at GitHub or GitLab, it proposes that one.
   - **Triage labels.** Only if `/triage` is installed: keep the five default labels, yes or no? On GitHub or GitLab it creates any that are missing.
   - **Domain docs.** One `GLOSSARY.md` plus a `docs/adr/` folder at the root. It writes this without asking, unless it sees a big multi-package repo.
3. **Confirm.** It shows you drafts and lets you edit them.
4. **Write.** `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, `docs/agents/triage-labels.md` if it asked about labels, and an `## Agent skills` block in `CLAUDE.md`. With no `CLAUDE.md` it uses `AGENTS.md`; if neither exists, it asks which to create.
5. **Report.** It names the Skills that will read these files.

What it doesn't hold is your preferences. "Ask me one question at a time" belongs in your own `CLAUDE.md`, which every Skill reads. You can edit the `docs/agents/` files by hand later; run setup again only to switch trackers or start over.

```scene chat
title: Setting up a new practice repo with no remote (illustrative)
# You type the Skill's name. It needs nothing else.
you: `/setup-matt-pocock-skills`
# It explores first, then reports what's there and what's missing.
agent: No Git remote, no CLAUDE.md or AGENTS.md, no GLOSSARY.md, no earlier setup. One small project, so single-context docs.
# The tracker comes first, recommendation leading.
agent: **Issue tracker.** With no remote, I'd suggest **local markdown**: issues as files under `.scratch/<feature>/`. Or GitHub, GitLab, or describe your own.
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

```checkpoint tracker-choice
You're setting up a repo for a recipe app you're building alone. It has no remote, and you don't plan to put it on GitHub or GitLab yet. Setup asks where issues should live. Best answer?
- [ ] GitHub, because the Skills were designed for it.
  > GitHub Issues need a GitHub repo. With no remote, setup would record a tracker nothing can reach.
- [ ] Other, so you can decide later.
  > Other is for a real tracker you describe, like Jira or Linear. "Decide later" leaves the other Skills nowhere to put tickets.
- [ ] Skip it; trackers only matter for teams.
  > `/to-spec` and `/to-tickets` need somewhere to write, even for one person.
- [x] Local markdown, under `.scratch/<feature>/`.
  > Right. It needs no remote and nothing extra installed. Specs and tickets become files in your repo.
```

## Lost? Ask the router

Sixteen Skills that only you can start is a lot to remember. Matt's answer is a ==router Skill==: one user-invoked Skill that knows the others and when each fits, so you remember one name instead of sixteen. Type `/ask-matt` followed by your situation in plain words.

It places you on a route through the set: the Main flow from idea to shipped code (see [The main flow](/learn/main-flow)), an on-ramp like `/triage` for bug reports other people filed or `/diagnosing-bugs` for something broken, upkeep for a messy codebase, or a standalone Skill. Before it describes a Skill or suggests skipping one, it reads that Skill's `SKILL.md`. Then it tells you what to type next, and where you should clear the session or review the work, and stops. It never runs what it names; as a user-invoked Skill, it can't.

Know its limits. It only knows Matt's 27 Skills, not ones you wrote or got elsewhere. It's a hand-written map, so where it and a `SKILL.md` disagree, the `SKILL.md` is right. And it assumes everything it names is installed, so installing it on its own gets you a map of roads you don't have.

```scene chat
title: Asking the router where to start (illustrative)
# You describe your situation after the name, in plain words.
you: `/ask-matt` I want to add an About page to my site. It's in a repo. Where do I start?
# It reads the Skills it's about to recommend, so it describes them accurately.
agent: Reading `grill-with-docs` and `implement` first.
# It places you at the head of the Main flow.
agent: You're in a repo, so start with `/grill-with-docs`: it interviews you about the idea and writes agreed terms to GLOSSARY.md.
# It checks the fork: one session or several?
agent: An About page should fit in one session, so skip `/to-spec` and `/to-tickets`. When grilling ends, type `/implement` in the same window; it closes with `/code-review`.
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
- [ ] It needs `/clear` before it can hand over.
  > Clearing would throw away its answer. Just type the Skill it named.
```

## When a short name is taken

Claude Code ships Built-in commands and Skills of its own, and a few share names with Matt's. The one you'll meet is `/code-review`. Claude Code's version is a bug hunt you can run at different effort levels, like `/code-review max`, and it also answers to `/review`. Matt's is a two-part review, checking the code against your project's standards and against the spec, with each part run by its own helper agent. Type the short name and you may get Claude Code's.

The fix is ==the full name==, which always reaches the plugin's Skill: `/mattpocock-skills:code-review`. The same goes for `/prototype`, which a hidden Built-in can shadow; if the short name misbehaves, type `/mattpocock-skills:prototype`. Matt won't rename his Skills to dodge clashes, because tools add new names all the time. If you used the npx route, the files are yours, so you can rename the folder and its `name:` line.

## How Matt and others use it

**Matt Pocock**, in his July 2026 walkthrough of the whole set:

- **Install once, then type `/`** to browse the Skills.
- **Run setup on every repo,** new or old. He chose local markdown, kept the default labels and took single-context docs, which he said suits about 99% of people.
- **Other trackers just need telling.** People ask him all the time about Jira, Linear and Beads; his answer is to run setup and say which one you use.
- **When unsure, ask the router.** Straight after setup he asked `/ask-matt` how to start a code change. It pointed him to `/grill-with-docs` and told him to keep the planning steps in one unbroken context window.

**Other developers:**

- Colin Eberhardt, CTO of Scott Logic, wrote up rebuilding a real app with the set in October 2026. He began with `/ask-matt`, which sent him to `/grill-with-docs`. His verdict: sound practices and refreshingly small Skills, but you still need to tailor them and bring your own judgement.
- A developer who shared an unattended build loop on the Skills' GitHub discussions in September 2026 checked 173 session logs. A bare `code-review` had reached Claude Code's review 36 times and Matt's only 18. His fix was to use full names everywhere.
- A GitHub discussion in October 2026 about using the Skills across several repos landed on installing the plugin at user scope and adding the other folders to a session with `/add-dir`.
- On Reddit in July 2026, one developer described keeping editable copies of the Skills in a Git-tracked `~/.claude` folder and tweaking them. That takes the npx route or a fork, since plugin files are read-only.

## Try it yourself

````try
You need Claude Code installed and signed in (see [Start here](/learn/start-here)), plus Git.

1. Make a practice repo and start Claude Code in it. If it asks whether you trust this folder, choose Yes.

```sh
mkdir skills-practice && cd skills-practice && git init && claude
```

2. Type a slash and the word setup. If `setup-matt-pocock-skills` isn't in the list, type `/exit`, install the plugin, then run `claude` again:

```sh
claude plugin install mattpocock-skills@claude-plugins-official
```

3. Type `/setup-matt-pocock-skills`. Answer "Local markdown" for the tracker, "yes" to the default labels if it asks, and "CLAUDE.md" when it asks which file to create. Read the drafts before you agree.
4. Type `/exit`. Check what it wrote, then add a Skill of your own and restart:

```sh
cat CLAUDE.md && ls docs/agents
mkdir -p .claude/skills/repo-tour
cat > .claude/skills/repo-tour/SKILL.md <<'EOF'
---
description: Give a three-bullet tour of this repo. Use when the user asks what is in this repo or where things live.
---
List the top-level files and folders, then say in three bullets what each is for.
EOF
claude
```

5. Ask in plain words: "what's in this repo?" Watch for the agent loading repo-tour on its own. Then start it yourself:

```text
/repo-tour
```

6. Ask the agent to add `disable-model-invocation: true` to the frontmatter of `.claude/skills/repo-tour/SKILL.md`, and choose Yes if it asks permission to edit. Type `/clear`, ask "what's in this repo?" again, then type the Skill's name as in step 5.
7. Ask the router:

```text
/ask-matt I want to add a README to this repo. What do I type next?
```

8. Read its answer, then type `/exit`. If anything starts editing files you didn't ask for, press Esc to stop it.

**It's working if:**

- [ ] `docs/agents/issue-tracker.md` mentions `.scratch/<feature>/`, and `docs/agents/domain.md` exists.
- [ ] `CLAUDE.md` has an `## Agent skills` block pointing at each docs file.
- [ ] Before the flag, a plain question made the agent load repo-tour by itself.
- [ ] After the flag, the same question didn't load it, but typing its name still worked.
- [ ] `/ask-matt` named what to type next and stopped without touching any file.
- [ ] Your `/` menu shows each of Matt's Skills once.

If `docs/agents/triage-labels.md` is missing, setup skipped the label question. That's a known quirk on the plugin, and harmless until you use `/triage`.
````

## Common mistakes

- **Installing both routes.** Every Skill shows up twice. Pick the plugin or npx.
- **Typing `/code-review` and expecting Matt's review.** Type `/mattpocock-skills:code-review`.
- **Asking for a user-invoked Skill in a sentence.** "Now write the spec" won't start `/to-spec`. Type the name at the start of your message.
- **Believing "that Skill isn't installed".** The agent can't see user-invoked Skills. Type the name anyway.
- **Editing the plugin's files.** They're read-only and replaced on every update. Put standing rules in your `CLAUDE.md`.
- **Expecting setup to hold preferences.** It records the tracker, the labels and the docs layout, nothing else.
- **Choosing GitHub in a folder with no remote,** or without the `gh` tool installed.
- **Installing only `/ask-matt`.** It routes you to Skills you don't have.
- **Writing a vague description** for your own Skill. The agent can't tell when to load it.

```site-story
I installed the plugin at user scope, so every project on my laptop gets the same 27 Skills. I never ran the npx installer, so nothing shows up twice. Mid-build, `/context` counted 122 Skills in total, costing 9.9k tokens of my 1M window.

I ran `/setup-matt-pocock-skills` early in this repo. I chose local markdown issues, the default triage labels and single-context docs. It wrote `docs/agents/` and put the Agent skills block into this repo's `CLAUDE.md`, and all of it went into the very first commit. Since then every spec and ticket for the site has been a file: `.scratch/lesson-site/` holds the first spec and its six tickets, and this course rewrite is tracked in `.scratch/course-rewrite/`.

Two short names taught me the clash. To get Matt's two-part review I typed `/mattpocock-skills:code-review`. Another time I typed `/code-review max` on purpose, to get Claude Code's own bug hunt. Same short name, two different things.

And one slip. Planning the redesign, I wrote "you can start grilling with docs" in plain words. The agent can't start a user-invoked Skill, so it ran `/grilling` and then `/domain-modeling`, the two halves `/grill-with-docs` is made of. If I'd typed the name myself, it would have been one step.
```

## Cheat sheet

| Moment | What to do |
|---|---|
| Install for Claude Code | `claude plugin install mattpocock-skills@claude-plugins-official`, then restart |
| Other agents, or files you can edit | `npx skills@latest add mattpocock/skills` (never both routes) |
| New repo | `/setup-matt-pocock-skills`, once |
| Not sure what's next | `/ask-matt` plus your situation |
| Matt's code review | `/mattpocock-skills:code-review` |
| Start a user-invoked Skill | Type its name at the start of your message |
| Agent says a Skill is missing | Type it anyway |
| A standing preference | A line in your `CLAUDE.md` |
| Your own Skill | `~/.claude/skills/<name>/SKILL.md` (you) or `.claude/skills/<name>/SKILL.md` (the repo) |
| The agent must never start it | `disable-model-invocation: true` |

## Final test

```test scenario-lost
Months from now, bug reports from friends are piling up in your tracker. You remember Matt has a Skill for this, but not its name, and you don't want to scroll through all 27. What's the quickest reliable move?
- [ ] Ask the agent in plain words which of Matt's Skills handles this.
  > The agent can't see the 16 user-invoked Skills, and the one you need is among them. It may even say it isn't installed.
- [ ] Type `/grill-with-docs` and describe the bug reports.
  > That's the start of the Main flow, for your own ideas. Reports other people filed have their own on-ramp.
- [x] Type `/ask-matt` and describe the situation.
  > Right. The router knows every Skill in the set and names the one to type next, here `/triage`.
- [ ] Run `/setup-matt-pocock-skills` again so it lists your options.
  > Setup records the tracker, labels and docs layout. It doesn't route you anywhere.
```

```test scenario-review-clash
You've finished a feature on a branch and type `/code-review`. You get back one list of possible bugs, with no Standards section and no Spec section. What do you type to get Matt's review?
- [x] `/mattpocock-skills:code-review`
  > Right. The short name reached Claude Code's own review. The full plugin name always reaches Matt's.
- [ ] `/code-review max`, so it reviews harder
  > That's Claude Code's own bug hunt again, just at maximum effort.
- [ ] `/review`
  > That's another name for Claude Code's own review, not Matt's.
- [ ] `/ask-matt` and tell it to run the review
  > The router would tell you about the Skill, but it never runs anything.
```

```test scenario-not-installed
You installed the plugin yesterday. Today, after a grilling session, you write "ok, turn this into a spec". The agent replies that `/to-spec` doesn't seem to be installed. Best move?
- [ ] Install the Skills again with npx so the agent can see them.
  > Now every Skill is installed twice, and `/to-spec` is still user-invoked, so the agent still can't see it.
- [ ] Ask the agent to install `/to-spec` for you.
  > It's already installed. The agent just can't see it.
- [ ] Run `/setup-matt-pocock-skills` again, then repeat the request.
  > Setup is about your tracker and docs. It doesn't change which Skills the agent can see.
- [x] Type `/to-spec` yourself, at the start of a message.
  > Right. User-invoked Skills are kept out of the agent's list, so it thinks they're missing. Typing the name runs it.
```

```test scenario-write-own
You keep pasting the same five rules for commit messages into every session. You want the agent to follow them whenever it writes a commit, in every project, without you having to remember. What do you make?
- [ ] A Skill in the project's `.claude/skills/` with `disable-model-invocation: true`.
  > That flag means only you can start it, so you'd still have to remember. And a project Skill reaches only one repo.
- [x] A Skill in `~/.claude/skills/` with a clear description.
  > Right. A personal, model-invoked Skill reaches every project, and its description tells the agent when to load it.
- [ ] A section in `docs/agents/`, written by setup.
  > Setup writes the tracker, labels and docs layout. It doesn't take rules of your own.
- [ ] An extra line in the plugin's copy of `/pr`.
  > Plugin files are read-only and replaced on update. And `/pr` shapes pull request descriptions, not commits.
```

```test spot-both-routes
Sam's `/` menu lists grill-me twice, and the same goes for every one of Matt's Skills. Spot the mistake.
- [ ] Sam ran `/setup-matt-pocock-skills` twice in the same repo.
  > Setup writes config files into the repo. It doesn't add Skills.
- [x] Sam installed the plugin and also ran the npx installer.
  > Right. The two routes are alternatives. Together they give you every Skill twice, so pick one.
- [ ] A Claude Code Built-in shares each of those names.
  > Only a few names clash, like `/code-review`. Every Skill doubled means two installs.
- [ ] The plugin updated itself and kept the old version as well.
  > Updates replace the old version; they don't leave a second copy behind.
```

```test spot-asked-agent
Ana finishes a grilling session and writes: "Great, run to-spec for me now." The agent answers that she has to type it herself. Spot the mistake.
- [x] `/to-spec` is user-invoked: only Ana can start it.
  > Right. User-invoked Skills start only when you type the name at the start of your message. The agent is blocked from starting them.
- [ ] Ana should have asked `/ask-matt` to start `/to-spec` for her.
  > The router recommends and stops. It can't start a user-invoked Skill either.
- [ ] The agent is misbehaving; she should reinstall the plugin.
  > Nothing's broken. The agent is following the rule for user-invoked Skills.
- [ ] She needed to `/clear` first so the spec starts clean.
  > Clearing would throw away the grilling that `/to-spec` writes from.
```

```test spot-edited-cache
Lee wanted `/implement` to close each ticket when it finished. He opened the plugin's copy of its SKILL.md and added a line. It worked, then a week later it silently stopped. Spot the mistake.
- [ ] He should have put the line in the Skill's description instead.
  > The description decides when a Skill loads, not what it does. And it lives in the same replaced file.
- [ ] He should have re-run `/setup-matt-pocock-skills` afterwards.
  > Setup records the tracker, labels and docs layout. It doesn't protect edits to Skill files.
- [x] Updates replace plugin files; the rule belongs in `CLAUDE.md`.
  > Right. The plugin is read-only and updates itself. Your own `CLAUDE.md` survives every update.
- [ ] He needed to install the plugin at project scope.
  > Scope changes where the plugin is available. An update still replaces its files.
```

```test sequence-new-repo
You've just installed Claude Code and want to use Matt's Skills on a brand-new project. Which order is right?
- [ ] `/setup-matt-pocock-skills` → install the plugin → restart Claude Code → `/grill-with-docs`
  > Setup is one of Matt's Skills, so it can't run before they're installed.
- [ ] Install the plugin → restart Claude Code → `/grill-with-docs` → `/setup-matt-pocock-skills`
  > Setup comes first: the engineering Skills assume the repo is already configured.
- [ ] Install the plugin and the npx copies → restart Claude Code → `/setup-matt-pocock-skills` → `/grill-with-docs`
  > Two routes give you every Skill twice. Pick one.
- [x] Install the plugin → restart Claude Code → `/setup-matt-pocock-skills` → `/grill-with-docs`
  > Right. Get the Skills, load them, configure the repo once, then start the Main flow.
```

```test why-light-context
A friend refuses to install Matt's 27 Skills: "That much text will fill my context window before I've typed a word." What's the strongest reply?
- [x] "Unused Skills cost a description at most; 16 cost nothing."
  > Right. Model-invoked Skills keep only their descriptions loaded until they run, and user-invoked ones keep even that out. Matt's whole set measured about 660 tokens.
- [ ] "They load in full, but a 1M-token window has room to spare."
  > They don't load in full. And a fuller window means a less sharp model, whatever its size.
- [ ] "Skills live on disk, so they never touch the context window."
  > They do once they run: the body joins the conversation and stays there.
- [ ] "Only Skills you type ever load; the agent never starts one by itself."
  > The 11 model-invoked Skills can be started by the agent, and their descriptions are always loaded.
```

```sources
- [setup-matt-pocock-skills SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md) and its templates (`issue-tracker-local.md`, `triage-labels.md`, `domain.md`): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [ask-matt SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/SKILL.md) and [PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/ask-matt/PHASE-BOUNDARIES.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [writing-for-agents SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md) and [SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL-MECHANICS.md) (context load, cognitive load, router Skills): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [mattpocock/skills README](https://github.com/mattpocock/skills/blob/main/README.md) (Installation; Reference: user-invoked vs model-invoked) and the bucket READMEs for [engineering](https://github.com/mattpocock/skills/blob/main/skills/engineering/README.md), [productivity](https://github.com/mattpocock/skills/blob/main/skills/productivity/README.md), [misc](https://github.com/mattpocock/skills/blob/main/skills/misc/README.md) and [in-progress](https://github.com/mattpocock/skills/blob/main/skills/in-progress/README.md): pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [Renaming skills to dodge harness built-in commands](https://github.com/mattpocock/skills/blob/main/.out-of-scope/harness-name-collisions.md), mattpocock/skills `.out-of-scope/`: pinned to mattpocock-skills 1.3.1, read 2026-10-23.
- [Extend Claude with skills](https://code.claude.com/docs/en/skills), Claude Code docs (frontmatter, where Skills live, who can invoke them, loading), read 2026-10-23 with Claude Code 2.1.309.
- [Discover and install plugins](https://code.claude.com/docs/en/discover-plugins), Claude Code docs (marketplaces, scopes, updates, `/plugin`, `/reload-plugins`), read 2026-10-23.
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills), Anthropic Engineering, 2025-10-16 (progressive disclosure).
- [The /setup-matt-pocock-skills Skill](https://www.aihero.dev/skills-setup-matt-pocock-skills) and [The /ask-matt Skill](https://www.aihero.dev/skills-ask-matt), AI Hero docs, read 2026-10-23.
- [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM), Matt Pocock, 2026-07-16 (empty or old repos 0:41–0:52, npx install and scopes 0:55–3:44, the `/` menu and 660 tokens 3:55–4:31, setup choices 4:35–6:50, `/ask-matt` 6:58–7:57).
- [5 Claude Code skills I use every single day](https://www.youtube.com/watch?v=EJyuu6zlQCg), Matt Pocock, 2026-03-16 (engineers with no memory 0:08–0:23, short Skills 3:41–3:46).
- [An honest review of Matt Pocock's Skills framework](https://blog.scottlogic.com/2026/10/19/an-honest-review-of-matt-pococks-skills.html), Colin Eberhardt, Scott Logic, 2026-10-19.
- [afk.sh: an unattended loop over the Skills](https://github.com/mattpocock/skills/discussions/1136), GitHub Discussion #1136, 2026-09-28; [multi-repo setups](https://github.com/mattpocock/skills/discussions/1248), GitHub Discussion #1248, 2026-10-10.
- [r/ClaudeCode: what are you using](https://reddit.com/r/ClaudeCode/comments/1un4qn2/), 2026-07-04.
```
