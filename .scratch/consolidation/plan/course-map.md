# Course map for the merged idea-to-shipped site

Source abbreviations:
- `S:<track>/<id>` = /home/user/skills/content/<track>/<id>/ (lesson.md + check-questions.yaml + margin-questions.yaml + scenarios.yaml + flashcards.yaml). HIGHEST precedence.
- `L:<nnnn>` = /home/user/learn-matt-flow/lessons/<nnnn>-*.html (also tests/part-N.html, reference/*.html cheat sheets). HIGH precedence.
- `C:` = /home/user/cicd-lab (README.md, LEARNING-NOTES.md, transcript.md = Brad Traversy's video transcript with timestamps, src/, test/, .github/workflows/ci.yml). Medium.
- `I:<slug>` = /home/user/idea-to-shipped/content/idea-to-shipped/<slug>.md (OLD content; LOW precedence: use only for facts the higher sources lack).

Every lesson lives at `/learn/<slug>`; slugs are unique across ALL courses. Folder: `content/<course-slug>/<slug>.md`.

Old idea-to-shipped slugs that are NOT kept redirect permanently:
- `spec-and-issues` -> `to-spec`
- `pr-and-ship` -> `pr`
- `architecture` -> `improve-codebase-architecture`

`start-here` and `grilling` MUST keep their slugs (they have visitor Comments in production).

## 1. `github-basics` — GitHub from zero (order 1)
Generalized for brand-new people: no owner-specific repos, Specs, Tickets, issue numbers or private projects. Use a neutral running example (e.g. "a small recipe website" repo).

Part "Git and repositories"
- `what-git-and-github-are` — What Git and GitHub are. NEW. Sources: C:LEARNING-NOTES.md (repository, commit, remote, origin/upstream, push), L:0007, S:basics/keeping-track.
- `reading-a-repository` — Reading a repository. L:0002 (generalize) + reference/repo-files-cheatsheet.html + S:basics/seeing-the-architecture.
- `commits-and-diffs` — Commits and diffs. L:0007 + reference/commits-and-prs-cheatsheet.html.
- `branches-and-worktrees` — Branches and worktrees. S:basics/branches-and-worktrees + S:basics/starting-work + L:0006 + reference/branches-cheatsheet.html.
- `push-pull-and-remotes` — Push, pull and remotes. NEW. C:LEARNING-NOTES.md, C:README.md ("Start your own repository"), L:0006/0007/0017.

Part "Pull requests"
- `issues-and-keeping-track` — Issues: keeping track of work. S:basics/keeping-track + S:basics/reading-an-issue.
- `pull-requests` — Opening a pull request. L:0008 + S:basics/opening-a-pull-request + S:basics/pull-requests-and-merging.
- `checking-a-pr` — Checking a pull request before you merge. S:basics/checking-a-pr.
- `merging-and-cleaning-up` — Merging and cleaning up. S:basics/merging-and-cleaning-up + S:basics/pull-requests-and-merging (merge methods, auto-merge).
- `undo-and-conflicts` — Undo and merge conflicts. L:0009 + S:basics/when-it-goes-wrong.

Part "Working the GitHub way"
- `one-change-start-to-finish` — One change, start to finish. S:basics/one-change-start-to-finish + L:0017.
- `working-with-an-agent-on-github` — Working with a coding agent on GitHub. S:basics/your-flow-on-github + S:basics/two-sessions-at-once.
- `how-teams-do-it` — How teams protect main. S:basics/how-teams-do-it.

## 2. `ci-cd` — CI/CD: ship safely (order 2)
Part "Pipelines"
- `what-ci-cd-is` — What CI/CD is. L:0010 + S:basics/ci-cd + C:LEARNING-NOTES.md.
- `reading-a-workflow` — Reading a GitHub Actions workflow. L:0011 + C:.github/workflows/ci.yml + reference/ci-cd-cheatsheet.html.
- `gates` — Gates: checks that block. L:0012.
Part "Hands on"
- `lab-gated-pipeline` — Lab: a gated pipeline with GitHub Actions and Vercel. L:0013 + C: (whole repo; follow Brad Traversy's CI/CD crash course with Vercel instead of Render; cite video timestamps from transcript.md; NEVER paste the transcript, summarize).
- `agents-in-github-actions` — Agents in GitHub Actions. L:0015.
- `your-projects-pipeline` — Setting up your own project's pipeline. L:0016 (generalize away from Care4Mind) + reference/agentic-shipping-cheatsheet.html.

## 3. `foundations` — Coding agents: the foundations (order 3)
- `start-here` — Start here (KEEP SLUG). Rewrite as the library's front door: what the site is, the courses, how a lesson works (read, quick checks, final test -> Done), what you need. I:start-here for facts only.
- `how-agents-work` — How coding agents work (KEEP SLUG). I:how-agents-work rewritten in the S: style (model in a harness, tools, permission modes, plan mode, CLAUDE.md, rewind).
- `calling-a-model` — Calling a model: what's underneath. S:basics/calling-a-model.
- `context-window` — The context window (KEEP SLUG). I:context-window rewritten in the S: style; link to context-hygiene.
- `instruction-files` — Instruction files. S:basics/instruction-files.
- `skills` — What a Skill is (KEEP SLUG). I:skills rewritten in the S: style.
- `models-effort-ultracode` — Models, effort and ultracode (KEEP SLUG). I:models-effort-ultracode rewritten in the S: style.

## 4. `idea-to-shipped` — Idea to shipped: the main flow (order 4; KEEP COURSE SLUG)
Part "Before you build"
- `main-flow` — The main flow (KEEP SLUG). Overview map of the flow; built from S: Main flow track + S:skills/ask-matt + I:main-flow facts.
- `one-shared-language` — S:principles/one-shared-language
- `fix-the-environment` — S:principles/fix-the-environment
- `setup-matt-pocock-skills` — S:skills/setup-matt-pocock-skills
Part "Grill the idea"
- `grill-before-you-build` — S:principles/grill-before-you-build
- `grilling` — S:skills/grilling (KEEP SLUG; I:grilling for facts only)
- `grill-me` — S:skills/grill-me
- `grill-with-docs` — S:skills/grill-with-docs
- `domain-modeling` — S:skills/domain-modeling
- `prototype` — S:skills/prototype
Part "Plan the work"
- `context-hygiene` — S:principles/context-hygiene
- `handoff` — S:skills/handoff
- `test-first` — S:principles/test-first
- `to-spec` — S:skills/to-spec
- `small-end-to-end-tickets` — S:principles/small-end-to-end-tickets
- `to-tickets` — S:skills/to-tickets
Part "Build, review, ship"
- `review-spec-and-standards` — S:principles/review-spec-and-standards
- `implement` — S:skills/implement
- `implement-spec` — S:skills/implement-spec
- `tdd` — S:skills/tdd
- `code-review` — S:skills/code-review
- `pr` — S:skills/pr
- `spec-driven-build-loop` — The build loop in practice. L:0014 (generalize)
- `retro` — S:skills/retro

## 5. `on-ramps` — When things go wrong, and big foggy work (order 5)
Part "When things go wrong"
- `triage` — S:skills/triage
- `diagnosing-bugs` — S:skills/diagnosing-bugs
- `wizard` — S:skills/wizard
Part "Big, foggy work"
- `wayfinder` — S:skills/wayfinder
- `wayfinder-first-session` — Your first wayfinder session. L:0001 (generalize)
- `working-the-map` — Working the map. L:0003
- `answers-from-other-people` — Answers only other people have. L:0004
- `after-the-map` — After the map is clear. L:0005

## 6. `codebase-health` — Codebase health and guardrails (order 6)
Part "Codebase health"
- `improve-codebase-architecture` — S:skills/improve-codebase-architecture (+ I:architecture facts)
- `codebase-design` — S:skills/codebase-design
- `setup-ts-deep-modules` — S:skills/setup-ts-deep-modules
- `migrate-to-shoehorn` — S:skills/migrate-to-shoehorn
Part "Guardrails"
- `setup-pre-commit` — S:skills/setup-pre-commit
- `git-guardrails-claude-code` — S:skills/git-guardrails-claude-code

## 7. `more-skills` — More Skills: thinking, writing, running agents (order 7)
Part "Thinking tools"
- `ask-matt` — S:skills/ask-matt
- `research` — S:skills/research
- `to-questionnaire` — S:skills/to-questionnaire
- `wait-what` — S:skills/wait-what
- `teach` — S:skills/teach
Part "Writing"
- `writing-for-agents` — S:skills/writing-for-agents
- `writing-fragments` — S:skills/writing-fragments
- `writing-beats` — S:skills/writing-beats
- `writing-shape` — S:skills/writing-shape
- `scaffold-exercises` — S:skills/scaffold-exercises
Part "Running agents"
- `claude-handoff` — S:skills/claude-handoff
- `orca-cli` — S:skills/orca-cli
- `chief-of-staff` — S:skills/chief-of-staff
- `loop-me` — S:skills/loop-me
- `orchestration` — S:skills/orchestration

## Link map for converted S: items (item links -> /learn/<slug>)
Every `skill:<id>`, `principle:<id>` and `basics:<id>` link maps to `/learn/<id>`, EXCEPT these merged basics ids:
- basics:starting-work -> /learn/branches-and-worktrees
- basics:reading-an-issue -> /learn/issues-and-keeping-track
- basics:keeping-track -> /learn/issues-and-keeping-track
- basics:opening-a-pull-request -> /learn/pull-requests
- basics:pull-requests-and-merging -> /learn/merging-and-cleaning-up
- basics:your-flow-on-github -> /learn/working-with-an-agent-on-github
- basics:two-sessions-at-once -> /learn/working-with-an-agent-on-github
- basics:when-it-goes-wrong -> /learn/undo-and-conflicts
- basics:seeing-the-architecture -> /learn/reading-a-repository
- basics:ci-cd -> /learn/what-ci-cd-is
