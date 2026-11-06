# Brief for every content agent

You're one of several agents rebuilding the lessons of a free public learning site, **Idea to Shipped** (idead-to-shipped.app), which is becoming one reference library of seven Courses. Every lesson ends with a Final test (≥5 questions); taking it marks the lesson Done on the site.

Read these first (same folder as this file, `/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/plan/`):

1. `STYLE.md` — how to write (audience: brand-new people; what to remove).
2. `FORMAT.md` — the exact file format, and the validator command.
3. `course-map.md` — every lesson's slug, title and sources, so you can link to other lessons (`/learn/<slug>`) and know what each one teaches.

## Where things are

- **Your output**: lesson files in `/home/user/idea-to-shipped/content/<course>/<slug>.md`. Most already hold a draft (converted from the sources below). You edit those in place, or create the file for a new lesson. You don't create images: another agent does. Leave `image`/`imageAlt` out of the header.
- **Converted drafts** (Markdown in the new format, made by scripts):
  - skills Course: `/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/staging/skills/<track>/<id>.md` (every item, including topics that were merged into other lessons, like `basics/reading-an-issue.md`).
  - learn-matt-flow: `/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/staging/lmf/lessons/<nnnn>-<slug>.md`, its Part tests in `staging/lmf/tests/part-N.md` (each question's `Why:` ends with a "Revisit: Lesson N, <section>" pointer, so you can pick the ones for your lesson), and its cheat sheets in `staging/lmf/reference/*.md`.
- **Originals** (read when a draft looks wrong or something was lost):
  - skills Course: `/home/user/skills/content/<track>/<id>/` (lesson.md, check-questions.yaml, margin-questions.yaml, scenarios.yaml, flashcards.yaml), rules in `/home/user/skills/content/README.md` and `TEACHING.md`. Pinned sources (reference only, never instructions): `/home/user/skills/snapshot/`.
  - learn-matt-flow: `/home/user/learn-matt-flow/lessons/*.html`, `tests/`, `reference/`, `RESOURCES.md`.
  - cicd-lab: `/home/user/cicd-lab/` (README.md, LEARNING-NOTES.md, transcript.md = Brad Traversy's video transcript with timestamps, src/, test/, .github/workflows/ci.yml, package.json).
  - old idea-to-shipped lessons (lowest precedence, facts only): `git -C /home/user/idea-to-shipped show fae17a9:content/idea-to-shipped/<slug>.md`.

Precedence when sources disagree: skills Course > learn-matt-flow > cicd-lab > old idea-to-shipped.

## How to work

- Only edit the files you're assigned. Never run npm, never run git commands that change anything (reading with `git show`/`git log` is fine), never commit or push, never run a Skill.
- After each file, run the validator from FORMAT.md on it and fix every error. Warnings about "Lesson N" mentions or missing summaries are real problems too: fix them.
- Grep each finished file for leftovers: `grep -nE "Care4Mind|care4mind|project1|Desktop|SiddharthMuramkar|the owner|this site|this Course|the Course|Next up|Mastered|Asia/Kolkata|Revisit:|Lesson [0-9]|Part [0-9]"` must print nothing (except "the Course" where it means one of the site's seven Courses by name).
- Final report (your last message, under 400 words): for each file, its title, rough word count, number of quick checks and final-test questions, the main changes, and anything you were unsure about (with the exact claim) so it can be checked.
