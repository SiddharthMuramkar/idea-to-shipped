---
title: Reading a repository
slug: reading-a-repository
summary: What each common file and folder in a repository is for, a ten-minute route through any repo, and how to see its architecture without reading code.
---

Say an agent has built the first version of your recipe website, or you've opened someone else's project on GitHub. The file list shows a dozen names: `README.md`, `.gitignore`, `package.json`, `docs/adr/`, `CLAUDE.md`. Which ones matter, and which do you open first? This lesson gives each common file one plain job, and a ten-minute route through any repo.

```goals
- Name the job of each common file and folder: README, LICENSE, `.gitignore`, `package.json` or `pyproject.toml`, `src/`, `tests/`, `docs/`, `docs/adr/`, `.github/workflows/`, `CLAUDE.md`, `AGENTS.md` and `GLOSSARY.md`.
- Read a new repository in ten minutes, on github.com or in the terminal.
- See a project's architecture without reading its code, and check it when a change arrives.
- Ask an agent for a tour or a map, and check what it tells you.
```

## Every file has one job

A **repository**, or repo, is a project folder that Git tracks, history and all. If that's new, start with [What Git and GitHub are](/learn/what-git-and-github-are). Most repos are built from the same handful of files, because tools and people look for them by name.

**Every file in a repo has one job, so once you know the jobs, you know which file answers which question.**

For example, say the `recipes` repo looks like this. Each line ends with the file's job:

```text
recipes/
├── .github/
│   └── workflows/
│       └── ci.yml            the checks GitHub runs on each change
├── content/                  the recipes, one Markdown file each
├── docs/
│   ├── adr/
│   │   └── 0001-store-recipes-as-markdown.md   one decision, written down
│   └── architecture.md       how the main parts fit together
├── src/                      the website's code
├── tests/                    the checks for that code
├── .env.example              the settings the site needs, with no real values
├── .gitignore                what Git leaves out
├── AGENTS.md                 standing orders for coding agents
├── CLAUDE.md                 the same orders, for Claude Code
├── GLOSSARY.md               the project's agreed words
├── LICENSE                   what others may do with the code
├── README.md                 start here
├── package.json              what the site needs, and its commands
└── package-lock.json         the exact versions installed
```

Names that start with a dot, such as `.gitignore`, are hidden on your computer: `ls` doesn't list them, but `ls -a` does. GitHub's file list shows them. The `.git` folder, which holds the history, never shows in that list.

The files fall into five kinds. Know a file's kind, and you know which questions it can answer:

| Kind | Files | Answers |
|---|---|---|
| The front door | `README.md`, `LICENSE` | What is this, how do I run it, and what may I do with it? |
| Instructions for tools | `.gitignore`, `package.json` or `pyproject.toml`, the lockfile, `.github/workflows/`, `.env.example` | What does Git leave out, what does the project need, and what runs on each change? |
| The code and its checks | `src/`, `tests/` | What does it do, and what does it promise? |
| The project's knowledge | `docs/`, `docs/adr/`, `GLOSSARY.md` | How does it fit together, what was decided and why, and which words do we use? |
| Standing orders for agents | `CLAUDE.md`, `AGENTS.md` | What must an agent know before it changes anything? |

```checkpoint which-kind-answers
You want to know why the recipe site stores recipes as files, with no database. Which kind of file answers that?
- [x] The project's knowledge: a decision written down in `docs/adr/`.
- [ ] Instructions for tools: the packages listed in `package.json`.
- [ ] The front door: the commands at the top of `README.md`.
Why: Decisions, and the reasons for them, are the project's knowledge. In this repo, `docs/adr/0001-store-recipes-as-markdown.md` records that one.
```

## The front door: README and LICENSE

A **README** is the project's front page: a file, usually `README.md`, that says what the project is and how to start. It's written in **Markdown**, plain text with light formatting: `#` makes a heading and `**word**` makes a word bold. GitHub shows the README below the file list on the repo's page.

GitHub suggests a README covers what the project does, why it's useful, how to get started, where to get help and who maintains it. For example, the start of the recipe site's README:

```markdown
# Recipes

A small website for sharing family recipes.

## Run it on your computer

1. Install the packages: `npm install`
2. Start the site: `npm run dev`
3. Open `localhost:3000` in your browser.
```

A **license** says what other people may do with your code. Without one, default copyright applies: you keep all rights, and nobody may copy, share or build on your work. So a public repo with no license can be read, but not reused.

The license text usually sits in a `LICENSE` file at the top of the repo. GitHub names a license it recognises on the repo's page. When you create a repo on github.com, you can pick one from a list. Later, you add the file yourself. choosealicense.com, made by GitHub, helps you choose.

```checkpoint no-license
You find a public repo with useful code, and it has no LICENSE file. Can you copy its code into your own project?
- [x] No: without a license, default copyright applies, so you have no permission to reuse it.
- [ ] Yes: anything in a public repo may be reused, with or without a license.
- [ ] Yes, as long as you keep the code in a private repo of your own.
Why: Without a license, the author keeps all rights. People can read a public repo, but may not copy, share or build on the code.
```

## Instructions for tools

These files aren't the app. They tell tools how to treat it: what Git should leave out, what to install, and what to run on every change.

### `.gitignore`: what Git leaves out

`.gitignore` lists patterns for files Git should leave out of commits. They're files a tool can make again, or files that must stay private. An ignored file never shows up as a new file, so it can't be committed by accident.

This is the `.gitignore` in Brad Traversy's starter repo for his CI/CD crash course:

```gitignore
node_modules/
dist/
.env
.env*
!.env.example
*.log
.DS_Store
```

`node_modules/` holds installed packages, `dist/` holds build output, and `.env` files hold secrets such as API keys. A line starting with `!` makes an exception, so `.env.example` can still be committed. [Commits and diffs](/learn/commits-and-diffs) covers what belongs in a commit in depth.

That's what `.env.example` is for. It lists the names of the settings the app reads, with no real values. The real `.env` file, with the secrets in it, stays on your computer.

```checkpoint gitignore-exception
A repo's `.gitignore` has the lines `.env*` and `!.env.example`. Which of these files can be committed?
- [x] `.env.example`, because the `!` line makes it an exception.
- [ ] `.env.local`, because only `.env` itself matches the patterns.
- [ ] Neither, because `.env*` matches both files and nothing undoes it.
Why: `.env*` leaves out every file whose name starts with `.env`. The `!` line makes one exception: `.env.example`, which holds no real values.
```

### `package.json` or `pyproject.toml`, and the lockfile

A JavaScript or TypeScript project has a `package.json`. It names the packages the project needs: `dependencies` for the app, and `devDependencies` for tools used only while building and testing. Its **scripts** are named shortcuts: `npm run dev` runs whatever command is saved under `dev`.

For example, these are the scripts in Brad Traversy's starter repo:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "typecheck": "tsc --noEmit",
  "test": "node --import tsx --test test/app.test.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

So `npm run dev` starts the app on your computer, and `npm test` runs its tests. You don't need to read the commands on the right. The names on the left tell you what you can do.

A Python project keeps the same kind of facts in `pyproject.toml`. Its `[project]` table names the project and its `dependencies`, and `[tool.…]` tables hold settings for tools such as pytest:

```toml
[project]
name = "recipes"
version = "0.1.0"
dependencies = ["fastapi", "jinja2"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

Beside either file sits a **lockfile**: `package-lock.json` for npm, or `uv.lock` or `poetry.lock` for Python tools. It records the exact version of every package installed, so every computer installs the same thing. A tool writes it, and it's committed anyway.

```checkpoint which-script
You open a new repo's `package.json` and want to run its tests. Where do you look?
- [x] The `scripts` section, for an entry named `test`, which `npm test` runs.
- [ ] The `dependencies` section, for a package whose name contains "test".
- [ ] The lockfile, which lists the exact commands each package runs.
Why: Scripts are named shortcuts in `package.json`. `npm test` runs the command saved under `test`.
```

### `.github/workflows/`: what runs on each change

**GitHub Actions** is GitHub's built-in automation. A **workflow** is one automated process, written as a YAML file in `.github/workflows/`. YAML is a plain-text settings format, where indentation shows what belongs inside what.

A workflow says when to run, such as on every pull request, and what to do, such as install the packages and run the tests. So if a repo has one, it tells you which checks guard `main`. [Reading a GitHub Actions workflow](/learn/reading-a-workflow) walks through one line by line.

```checkpoint which-checks-guard-main
You want to know which checks run every time someone opens a pull request in a repo. Where do you look?
- [x] In `.github/workflows/`, where each YAML file says when to run and what to do.
- [ ] In `README.md`, which lists the checks GitHub runs on pull requests.
- [ ] In `.gitignore`, which lists the files the checks will skip.
Why: Workflows live in `.github/workflows/`. Each one says when it runs, such as on every pull request, and what it does.
```

## The code and its checks: `src/` and `tests/`

`src/`, short for source, holds the app's own code. Names vary: some projects use `app/`, `lib/`, or one folder per part, such as `web/` and `api/`. The folder names inside are often the project's main parts, such as `src/search/` and `src/recipes/`.

**Tests** are code that runs the app's code and checks the result. They live in `tests/` or `test/`, or beside the code, in files named like `search.test.ts` or `test_search.py`. A test run lists each test by name.

Test names tell you what the code promises, without reading the code. For example, a run of the recipe site's search tests might print:

```text
✓ tests/search.test.ts (3)
  ✓ finds a recipe by one ingredient
  ✓ ignores capital letters in the search
  ✓ shows "No recipes found" when nothing matches
```

Each line is a promise the code keeps. If something that matters to you has no test, that's worth asking about.

```checkpoint promise-without-code
You want to know whether the recipe search ignores capital letters. You don't read code. Where do you look first?
- [x] At the test names, which say what the code promises.
- [ ] At `package.json`, which lists what the search does.
- [ ] At the lockfile, which records how the search was built.
Why: A test's name says what the code promises. A test named "ignores capital letters in the search" answers the question without reading any code.
```

## The project's knowledge: `docs/`, ADRs and the glossary

`docs/` holds longer documents: guides, and often an architecture note on how the main parts fit together. Two kinds of file in it, and one beside it, deserve a closer look.

### ADRs: one decision each

An **ADR**, an architecture decision record, is a short note that records one big decision: what was decided, and why. ADRs live in `docs/adr/`, numbered in order: `0001-store-recipes-as-markdown.md`, then `0002-…`. For example:

```markdown
# Store recipes as Markdown files

Each recipe is a Markdown file in `content/`, not a row in a database.
Cooks change recipes through pull requests, so the site needs no admin
login, and every change has a history.
```

Only rare decisions get one. Matt Pocock's rule asks for all three at once: hard to reverse, surprising without context, and the result of a real trade-off. Most decisions fail at least one, so most never become an ADR.

When a decision changes, nobody edits the old ADR. A new ADR replaces it, and the old one is marked as superseded, so its reasoning stays on record. The idea comes from a short 2011 post by Michael Nygard.

```checkpoint no-adr-needed
You pick the colour of links on the recipe site. It's easy to change, and nobody would wonder why. Does it get an ADR?
- [x] No, because an ADR needs all three: hard to reverse, surprising and a real trade-off.
- [ ] Yes, because every decision about the site belongs in `docs/adr/`.
- [ ] Yes, once the colour has been used on the site for a while.
Why: An ADR is for a decision that is hard to reverse, surprising without context and a real trade-off, all three at once. A link colour fails the first two.
```

### `GLOSSARY.md`: the agreed words

A **glossary** is a short dictionary for one project. It picks one word for each thing, says what it means, and names the tempting wrong words to avoid. So one thing isn't called three names by three people, or by an agent on three different days.

For example, two entries from the recipe site's `GLOSSARY.md`:

```markdown
**Recipe**:
A dish with its ingredients, steps and number of servings.
_Avoid_: dish, meal

**Collection**:
A named list of recipes that one cook saves.
_Avoid_: folder, board
```

An Avoid word in an agent's output is yours to catch, such as a pull request titled "Add saved folders". Here, that's a Collection. [One shared language](/learn/one-shared-language) explains why the words matter so much with agents.

```checkpoint avoid-word
An agent opens a pull request titled "Let cooks share a meal by link". What does the glossary tell you?
- [x] "Meal" is an Avoid word: the title should say Recipe.
- [ ] Nothing, because a title may use any word that's clear.
- [ ] "Meal" means a Collection, so the title should say that.
Why: The glossary lists "meal" under Avoid for Recipe. A word on an Avoid list in an agent's output is yours to catch.
```

## Standing orders for agents: `CLAUDE.md` and `AGENTS.md`

An **instruction file** is a plain-text file a coding agent reads at the start of every session. It says how to run and test the project, which rules to follow, and where things live. Claude Code reads `CLAUDE.md`. Many other agents read `AGENTS.md`, and Claude Code reads it too when a repo has no `CLAUDE.md`.

For example, the recipe site's `CLAUDE.md` might say:

```markdown
# recipes

- Start the site with `npm run dev`. Run the tests with `npm test`.
- Recipes live in `content/` as Markdown. Never add a database.
- Read GLOSSARY.md and docs/adr/ before changing how recipes are stored.
```

A repo that serves several agents often keeps one text. `CLAUDE.md` holds the line `@AGENTS.md`, which pulls in `AGENTS.md`, or it's a shortcut (a symlink) to that file. Either way, you edit `AGENTS.md`.

These files are context, not locks. An agent usually follows them, but nothing forces it to. [Instruction files](/learn/instruction-files) covers how to write a good one. A repo set up for Matt Pocock's Skills also has `docs/agents/`, the settings those Skills read, such as where Issues live.

```checkpoint which-instruction-file
A repo's `CLAUDE.md` contains one line, `@AGENTS.md`. You want to add a rule for every agent. Which file do you edit?
- [x] `AGENTS.md`, because `CLAUDE.md` pulls that file in.
- [ ] `CLAUDE.md`, under the `@AGENTS.md` line, for Claude only.
- [ ] Both, so that the two files say the same thing.
Why: The `@AGENTS.md` line pulls `AGENTS.md` into `CLAUDE.md`. So there's one text to keep right, and it lives in `AGENTS.md`.
```

## Read a repo in ten minutes

You don't read a repo top to bottom. You read it in an order that answers the big questions first:

1. The README: what it is, and how to run it.
2. `package.json` or `pyproject.toml`: what it's built with, and its commands.
3. The top-level folders: the main parts.
4. The test names: what it promises.
5. `docs/adr/` and `GLOSSARY.md`: what was decided, and which words to use.
6. `CLAUDE.md` or `AGENTS.md`: what agents are told.
7. `.github/workflows/`: which checks run on each change.
8. The history and open work: the last ten commits, and the open Issues and pull requests.

On github.com, the README sits under the file list. The About box on the right gives the description and the license. Above the file list, a link with the number of commits opens the history. The Go to file button finds a file by name, and the Issues and Pull requests tabs show the open work.

In the terminal, inside the repo's folder, the same route takes a few commands:

```sh
ls -a                   # every file and folder, hidden ones too
cat README.md           # the front door
git log --oneline -10   # the last ten commits
gh repo view            # the description and the README
gh issue list           # open Issues
gh pr list              # open pull requests
```

```checkpoint ten-minute-route
You have ten minutes with a repo you've never seen. What do you open first?
- [x] The README, for what the project is and how to run it.
- [ ] The biggest file in `src/`, for how the code works.
- [ ] The lockfile, for every package the project installs.
Why: The README is the front door. Start there, then the package file, the folders, the test names and the decisions.
```

## Seeing the architecture without reading code

Say someone asks where your recipe site keeps its recipes. An agent built it, and you can't answer. You don't need to read the code to fix that.

**The architecture** is four things you can see without reading code: the main parts, how they connect, where data lives, and what's hard to change. For the recipe site, a map might read:

- Main parts: the pages (`src/pages/`), the recipe loader (`src/recipes/`) and the search (`src/search/`).
- How they connect: the pages ask the loader for recipes, and the search for matches.
- Where data lives: Markdown files in `content/`, one per recipe, as the ADR decided.
- What's hard to change: the recipe file format, because every recipe file and the loader depend on it.

No architecture note in the repo? Ask the agent to draw the map, then check one folder it names with `ls`. Drawings can be wrong, so trust the files over the drawing.

You decide the architecture when you plan a change, and check it when the change arrives as a pull request. `gh pr diff` with `--name-only` lists the files a pull request changed. A new folder your plan never named, or a change to the recipe format, is worth a question before you merge.

A list of files shows where a change went, not what it does. So it doesn't replace reading the change itself, which [Checking a pull request before you merge](/learn/checking-a-pr) covers.

```checkpoint unplanned-folder
Your plan for a pull request changes the search only. Its changed files include a new `src/db/` folder. What do you do?
- [x] Ask the agent why it's there, before you merge.
- [ ] Merge, because a new folder can't change anything else.
- [ ] Delete the folder yourself on the pull request's branch.
Why: You check the architecture at pull request time, against your plan. A new folder the plan never named is worth a question first.
```

### Grey boxes, and why review stays

An **interface** is what a caller must know to use a part correctly, such as what the search takes in and gives back. A **grey box** is a part you judge from outside. You design its interface, tests check it, and you skip the code inside. Matt Pocock puts it this way: "You own the interface. AI owns the implementation. Tests keep it honest."

A grey box needs a true map: you can say what the part is for and how it fits. Critical parts need more than that, such as code that handles money, logins or deleting data. Read those.

And review doesn't go away. On the Claude Code team, every pull request gets an AI review first. When an agent wrote it, the person who ran the agent is always one of the reviewers.

```checkpoint grey-box-fit
You want to stop reading the inside of one part of the recipe site. Which part fits a grey box?
- [x] The search: tests cover its interface, and you can say what it's for.
- [ ] The part that takes payments: tests cover its interface too.
- [ ] A part with no tests yet, which you can say what it's for.
Why: A grey box needs tests at its interface and a true map of what it's for. Code that handles money is critical, so it needs more attention.
```

## Tell your agent

Two requests cover most first visits to a repo. Both change nothing. The first asks for a tour:

> Give me a tour of this repo. For each top-level file and folder, write one line on its job. Then tell me, from the README and `package.json`, how to run the site and its tests. Change no files.

The second asks for the map:

> Draw my project's main parts in text: how they connect, where data lives, and what's hard to change. Name each part's folder. Change no files.

Then check. Run `ls -a` and compare the tour with what's there. Open the README and see that the run commands match. Pick one folder from the map and run `ls` on it.

If the folder isn't there, tell the agent what `ls` printed, and ask it to draw that part again from the files. Ask for at most eight parts: a map that shows every file can't fit in your head.

```checkpoint drawing-wrong
The agent's map names a `src/billing/` folder. You run `ls src/billing`, and it says there's no such folder. What do you do?
- [x] Tell the agent what `ls` printed, and ask it to draw that part again from the files.
- [ ] Trust the map, because the agent has read all the code and `ls` sees only part of it.
- [ ] Ask the agent to create a `src/billing/` folder, so the project matches the map.
Why: A drawing can be wrong, and `ls` shows what's really there. So tell the agent what you saw, and have it redraw that part from the files.
```

## Try it

````try
You need a web browser. For the last steps, you also need Git or `gh` (see [What Git and GitHub are](/learn/what-git-and-github-are)). You'll read a real, small public repo: Brad Traversy's starter app for his CI/CD crash course.

1. Open the repo in your browser: [github.com/bradtraversy/cicd-lab-starter](https://github.com/bradtraversy/cicd-lab-starter).
2. Scroll below the file list and read the README. Find the commands it gives to get started.
3. Click `package.json` and find `scripts`. Find the one that runs the tests.
4. Go back and click `.gitignore`. Find the line that keeps `.env` files out, and its one exception.
5. Open the `test` folder, then the file in it. Find the test's name: the text in quotes after `test(`.

   You should see one test, promising that `/api/health` returns a healthy response.
6. Compare the file list with the five kinds in this lesson. Note which kinds the repo has, and which it doesn't.
7. Above the file list, click the link with the number of commits. You should see the repo's short history, newest first.
8. In a terminal, download a copy of the repo:

   ```sh
   git clone https://github.com/bradtraversy/cicd-lab-starter.git
   ```

9. Go into it and list every file, hidden ones too:

   ```sh
   cd cicd-lab-starter && ls -a
   ```

   You should see `.git` and `.gitignore` as well as the files GitHub showed.
10. List the history:

    ```sh
    git log --oneline
    ```

    You should see the same commits as on GitHub, one per line.
````

## Remember

```flashcards
Q: What are the five kinds of file in a typical repo?
A: The front door (README, LICENSE), instructions for tools (`.gitignore`, `package.json` or `pyproject.toml`, lockfile, workflows), the code and its checks (`src/`, `tests/`), the project's knowledge (`docs/`, ADRs, glossary), and standing orders for agents (`CLAUDE.md`, `AGENTS.md`).

Q: What happens to a public repo with no license?
A: Default copyright applies: people can read it, but may not copy, share or build on the code.

Q: What does `.gitignore` do?
A: It lists files Git leaves out of commits, such as installed packages, build output and `.env` secrets. A `!` line makes an exception.

Q: What are `package.json` scripts?
A: Named shortcuts: `npm run dev` runs the command saved under `dev`, and `npm test` runs the one under `test`.

Q: Where do GitHub Actions workflows live, and what do they tell you?
A: In `.github/workflows/`, as YAML files. They say when checks run and what they do, so they tell you which checks guard `main`.

Q: What is an ADR, and when does a decision get one?
A: A short note recording one big decision and why. Only when it's hard to reverse, surprising without context and a real trade-off, all three.

Q: What are `CLAUDE.md` and `AGENTS.md`?
A: Instruction files: plain text an agent reads at the start of every session, with commands, rules and where things live. They're context, not locks.

Q: What four things make up a project's architecture?
A: The main parts, how they connect, where data lives, and what's hard to change. You can see all four without reading code.

Q: What does `gh pr diff --name-only` tell you, and what can't it?
A: Which files a pull request changed, so where the change went. Not what the change does.
```

## Final test

```final-test file-for-question
How do you start the recipe site on your own computer? Which file do you open first to find out?
- [x] `README.md`, the front door, which says how to run it.
- [ ] `GLOSSARY.md`, which lists the project's agreed words.
- [ ] `.gitignore`, which lists the files Git leaves out.
- [ ] `docs/adr/0001-store-recipes-as-markdown.md`, a decision.
Why: The README says what the project is and how to start. The glossary holds words, `.gitignore` holds patterns, and an ADR holds one decision.
```

```final-test secret-in-repo
An agent wants to commit `.env` "so the next person has the settings". The repo has a `.env.example`. What's the better move?
- [x] Keep `.env` out of Git, and add the setting's name, with no value, to `.env.example`.
- [ ] Commit `.env`, because a private repo can't leak its secrets.
- [ ] Rename `.env` to `.env.example`, so `.gitignore` lets it through.
Why: `.env` holds secrets and stays out of Git. `.env.example` lists the names of the settings, with no real values, so it can be committed.
```

```final-test changed-decision
Months later, the recipe site moves its recipes into a database after all. What happens to `docs/adr/0001-store-recipes-as-markdown.md`?
- [x] A new ADR records the change, and the old one is marked as superseded.
- [ ] Someone edits the old ADR, so it describes the database instead.
- [ ] Someone deletes the old ADR, because it's no longer true.
- [ ] Nothing, because ADRs can't be replaced once accepted.
Why: Nobody edits an old ADR. A new one replaces it, and the old one is marked as superseded, so its reasoning stays on record.
```

```final-test edit-the-right-file
`CLAUDE.md` is a shortcut (a symlink) to `AGENTS.md`. You want to change the agents' standing orders. Which file do you edit?
- [x] `AGENTS.md`, because `CLAUDE.md` only points to it.
- [ ] `CLAUDE.md`, because Claude Code reads that one first.
- [ ] Both, one after the other, so they stay in step.
- [ ] `GLOSSARY.md`, where the standing orders are kept.
Why: A shortcut is one text with two names. You edit the real file, `AGENTS.md`, and every agent reads the same orders.
```

```final-test what-tests-tell-you
You never read code. Which part of a repo tells you best what the code promises to do?
- [x] The test names, such as "finds a recipe by one ingredient".
- [ ] The lockfile, which lists every package and its exact version.
- [ ] The `.gitignore` file, which lists what Git leaves out.
- [ ] The commit count shown above the file list on GitHub.
Why: Each test's name is a promise the code keeps. You can read the names without reading the code itself.
```

```final-test architecture-four
Which list is a project's architecture, in the sense this lesson uses?
- [x] The main parts, how they connect, where data lives, and what's hard to change.
- [ ] The main parts, how each function is written, and how each line of code reads.
- [ ] The README, the LICENSE, the lockfile and the `.gitignore` file.
- [ ] Every file in `src/`, listed one by one, with what each one does.
Why: The architecture is four things you can see without reading code. A map of every file is too big to carry in your head.
```

```final-test check-at-pr-time
A pull request was meant to change the search only. Which command shows, without reading code, whether it touched anything else?
- [x] `gh pr diff` with `--name-only`, which lists the files it changed.
- [ ] `gh repo view`, which shows the repo's description and README.
- [ ] `git log --oneline -10`, which lists the last ten commits on `main`.
- [ ] `ls -a`, which lists every file in your current folder.
Why: `gh pr diff --name-only` lists the files the pull request changed. Compare that list with the plan, and ask about anything unexpected.
```

```final-test grey-box-limit
A friend says: "Agents write all my code now, so I only look at the architecture and merge." What do you tell them?
- [x] Half right: line-by-line reading is fading, but review stays, and critical parts need reading.
- [ ] Right: once tests pass, a person no longer needs to review an agent's pull request.
- [ ] Wrong: every line an agent writes must be read by a person, or it can't be merged.
Why: A grey box is judged by its interface and tests, but critical parts need more. And review stays: whoever ran the agent reviews its pull request.
```

```sources
- [About the repository README file](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes), GitHub Docs
- [Quickstart for repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories), GitHub Docs
- [Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository), GitHub Docs
- [Ignoring files](https://docs.github.com/en/get-started/git-basics/ignoring-files), GitHub Docs
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions), GitHub Docs
- [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json), npm Docs
- [Writing your pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/), Python Packaging User Guide
- [cicd-lab-starter](https://github.com/bradtraversy/cicd-lab-starter), Brad Traversy
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), Michael Nygard, 2011-11-15
- [domain-modeling: ADR-FORMAT.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md), Matt Pocock's Skills
- [domain-modeling: GLOSSARY-FORMAT.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md), Matt Pocock's Skills
- [How Claude remembers your project](https://code.claude.com/docs/en/memory), Anthropic (Claude Code Docs)
- [How To Make Codebases AI Agents Love](https://www.aihero.dev/how-to-make-codebases-ai-agents-love), Matt Pocock, 2026-02-26
- [How the Claude Code team does code review](https://x.com/addyosmani/article/2114604912520921136), Addy Osmani, 2026-10-26
- [gh repo view](https://cli.github.com/manual/gh_repo_view), GitHub CLI manual
- [gh pr diff](https://cli.github.com/manual/gh_pr_diff), GitHub CLI manual
```
