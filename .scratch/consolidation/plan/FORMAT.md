# Lesson file format (the merged idea-to-shipped site)

Repo: `/home/user/idea-to-shipped`. Each Course is a folder `content/<course-slug>/` holding a `course.md` and one `<slug>.md` per Lesson. Slugs are kebab-case (a-z, 0-9, single dashes), unique across ALL courses, and the file is named after the slug. A Lesson's address is `/learn/<slug>`.

Validate any lesson file with:

```sh
node /tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/tools/validate-lesson.mjs content/<course>/<slug>.md [more files...]
```

(It knows every planned slug, so links to lessons that aren't written yet still pass.) Once the site's own parser is updated, `npm run test:content` in the repo is the final word.

## course.md

```markdown
---
title: GitHub from zero
slug: github-basics
description: One sentence saying who the course is for and what they'll be able to do.
order: 1
image: /images/courses/github-basics.jpg
imageAlt: What the image shows, for screen readers.
---

## Part title
- lesson-slug
- another-lesson-slug

## Another part
- third-lesson
```

## Lesson file

```markdown
---
title: Branches and worktrees
slug: branches-and-worktrees
summary: One plain sentence (max ~160 characters) saying what the lesson teaches. Shown on cards.
image: /images/lessons/branches-and-worktrees.jpg
imageAlt: What the image shows.
---

Optional intro paragraph(s), and optionally a goals block, before the first ## heading.

```goals
- You'll be able to ...
- You'll be able to ...
```

## First part

Text...
```

Header keys: `title` and `slug` are required; `summary` is required for new lessons; `image` and `imageAlt` are added by the image pass (leave them out if you have no image yet). No other keys.

### Markdown you may use

- `##` parts (each becomes a Section) and `###` sub-parts. No `#` heading (the title comes from the header) and nothing deeper than `###`.
- Paragraphs, lists (nested at most one level), **bold**, _italic_, `inline code`, links, code blocks with a language (```sh, ```yaml, ```ts, ```python, ```text, ```diff …), block quotes, `---` rules, and GFM pipe tables.
- **No raw HTML at all**, not even `<!-- comments -->`, `<br>`, `<kbd>` or `<details>`.
- **No images in the body.** The one image per lesson is the header `image`.
- Links: other lessons as `[text](/learn/<slug>)` (the slug must exist in the course map); outside pages as full `https://` URLs. No `http://`, relative or `#anchor` links.
- Don't write "Lesson 7" or "Part 2" in the text: numbers change. Link the lesson by its title instead.

### Typed blocks (fenced, always at the top level: never inside a list or quote)

- ```` ```goals ```` — intro only. A Markdown list, one line per goal.
- ```` ```callout tip ```` / `watch-out` / `big-idea` / `remember` — a boxed note. Body is Markdown. `remember` = the "what to remember from this part" box (one per part at most).
- ```` ```try ```` — a "Your turn" box: what you need, numbered steps, exact commands in code blocks (they get Copy buttons), and what you should see.
- ```` ```flashcards ```` — flip cards. Pairs of `Q:` and `A:` lines (inline Markdown), a blank line between pairs:

  ```text
  Q: What is tdd's loop?
  A: Red → green: write a failing test first, then only enough code to pass it.

  Q: In tdd, what is a seam?
  A: The public boundary you test at.
  ```
- ```` ```diagram ```` — a drawn diagram from a little YAML (types `chain`, `compare`, `tree`, `layers`, `git`, `cycle`), exactly as specified in `/home/user/skills/content/README.md`, section "Diagrams". Write every string in double quotes. Keep the converted skills diagrams as they are.
- ```` ```sources ```` — the lesson's sources: a Markdown list, one `- [Title](https://…), Author, date` per line. Goes last, after the final test.
- ```` ```scene chat|terminal|flow|files|meter ```` — an animated scene (one per Section, never in the intro). Syntax: see `src/lessons/__fixtures__/complete-example/example-course/grilling-an-idea.md` in the repo. Optional.
- ```` ```checkpoint <id> ```` — an optional quick-check question inside the text (see Questions).
- ```` ```final-test <id> ```` — one question of the lesson's Final test (see Final test).

### Questions (checkpoint and final-test share this shape)

````markdown
```checkpoint quick-2
You rewrite the insides of the booking code, and the endpoint behaves as before. What should a good test do?
- [x] Still pass, as it checks behaviour through a public interface.
- [ ] Fail, because it checks how the code works on its insides too.
  > Optional feedback shown when this option is picked.
- [ ] Fail, so that you know to rewrite the test along with the code.
Why: A good test checks behaviour through a public interface, not the code's insides.
```
````

- First the prompt: one paragraph of inline Markdown (no list, quote or code-fence lines in it).
- Then 2 to 6 options, each starting at the line start with `- [x] ` (exactly one) or `- [ ] `. Final-test questions should have 3 or 4.
- Under any option, optional feedback lines starting with two spaces and `> `.
- Then a `Why: ` line: the explanation shown after answering. Every question needs a `Why:` line, or feedback under every option.
- The id after the fence word: kebab-case, at most 40 characters, unique within the lesson.
- The site shuffles the options, so write them in any order. Make wrong options as specific and about as long as the right one. Never "all of the above" / "none of the above".

### Final test (required in every lesson)

- The lesson's last `##` part is `## Final test`, holding at least **5** (aim for 6 to 10) `final-test` blocks back to back (only blank lines between them). A `sources` block may follow them; nothing else.
- Taking the final test is what marks a lesson Done on the site, whatever the score.
- Mix recall questions with situation questions ("You're about to…; what do you do?", "Which fits?", "What comes next?", "Spot the mistake").
- Every final-test question must be answerable from this lesson's text alone.

### Quick checks while reading (checkpoint blocks)

Optional for the reader, but every lesson should have them: about one after each `##` part and `###` sub-part (not after Try it or Read more), placed right after the paragraph, list or table it tests, and answerable from that block alone.
