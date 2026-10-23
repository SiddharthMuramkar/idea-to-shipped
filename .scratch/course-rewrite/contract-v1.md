# Authoring contract v1 (frozen)

Sent by the engine session (PR A, branch `claude/lesson-content-scrolling-ux-2a9171`) on 2026-10-23. PR A's parser implements exactly this; any change arrives as a new message. Every Lesson file in `content/lessons/` follows it.

## Header

Between `---` lines, `key: value`, LF line endings. Keys: `title`, `slug`, `order`, `part`, `image`, `imageAlt`, `imageCredit`. Any other key is a BUILD ERROR. `part` is 1–4: 1 Foundations, 2 The main flow, 3 When things go wrong, 4 Level up.

## Typed blocks

Fenced code blocks whose info string is `<kind> [arg]`. Ordinary code fences keep working as code: use a real language (`ts`, `sh`, `text`, `md`…) or none. A block that contains a ``` fence must open and close with FOUR backticks.

- ` ```goals `: a Markdown list of 3–4 "You'll be able to <verb>…" items. Only before the first `##`.
- ` ```scene <chat|terminal|flow|files|meter> `: at most one per `##` section. Setting lines come first (`title: …`; flow also takes `node: <id> | <label> [| side]`; meter also takes `zone: <percent where the dumb zone starts>`). Then steps: a line `# <caption the reader sees>` starts a step, and the lines under it are what the picture ADDS at that step:
  - chat: `you: …` / `agent: …` (inline Markdown is fine)
  - terminal: `$ command` is a typed command; any other line is output
  - flow: `at: <node id>` highlights that node
  - files: `+ path` added / `~ path` changed
  - meter: `fill: 62% | label`
  Use 4–8 steps. Scenes must match how the Skill really behaves in 1.3.1; label invented sessions "illustrative" in the title.
- ` ```checkpoint <id> `: ONE question (grammar below). It never counts toward passing. Place it right after the section it checks.
- ` ```test <id> `: ONE question per fence. All test fences must be CONTIGUOUS, just before ` ```sources `; together they form the Final test. Pass mark: a score of at least 80% of the questions.
- ` ```callout <tip|watch-out|big-idea> `: Markdown.
- ` ```try `: a Markdown "Try it yourself" exercise; code inside gets a copy button. Include an "It's working if" checklist.
- ` ```site-story `: Markdown, "How I used it building this site". REQUIRED for the 12 original Slugs. OPTIONAL for the 8 new Slugs: never invent a journal; omit it or say "Not used on this site yet".
- ` ```sources `: a Markdown list of at least 3 items, each containing a link and a date. Cite a SKILL.md as a GitHub link to the file, then "Pinned to mattpocock-skills 1.3.1, read <date>".

## Question grammar (checkpoint and test)

````md
```checkpoint who-owns-details
The agent asks which CSS file layout you want. You don't care. Best reply?
- [ ] Research it yourself first.
  > Feedback explaining why this is wrong.
- [x] "You decide, using best practice."
  > Feedback explaining why this is right.
- [ ] Skip grilling and start coding.
  > Feedback.
```
````

- The prompt comes first (inline Markdown, may span lines).
- Then 3–4 options: `- [ ]` or `- [x]`, EXACTLY ONE `[x]`, and every option needs a `  > feedback` line under it.
- Question ids: kebab-case `[a-z0-9-]{1,40}`, unique within the Lesson, PERMANENT once published (they key the database). Options are identified by POSITION (a, b, c, d): after publishing you may reword an option, but never reorder or remove options; changing the meaning means a new id. Spread the right answer across positions.

## Inline

`==key phrase==` (no spaces just inside the `==`) is a highlighted phrase that sweeps in on scroll. Use it sparingly: 1–3 per section.

## Size and quality (enforced by `npm run test:content`, arriving with PR A)

- Prose: 1,800–3,000 words (Start here 900–1,400).
- Goals: 3–4.
- At least 1 scene.
- 3–5 Checkpoints.
- A Final test of 8–10 questions (Start here 5–6, The main flow up to 15), of mixed kinds: at least 3 scenario ("which Skill would you reach for…"), at least 2 spot-the-mistake, at least 1 sequence. No trivia, no "all of the above", and the right answer must not be the longest option.
- Never refer to "Lesson <number>" in the text (renumbering breaks it); link by title to `/learn/<slug>`.
- Every backticked `/name` must be a real 1.3.1 Skill or a Built-in command.
- Use GLOSSARY terms. New ones from PR A: Part, Checkpoint, Final test (reader-facing; never a bare "Test" or "quiz"), Scene, Site story, Answer, Attempt, User-invoked / Model-invoked Skill, Smart zone, and Phase redefined to Matt's meaning (a chunk of work inside a session; its boundaries are `/clear`, `/compact`, `/handoff`).

## Pilot handoff

1. Commit `grilling` FIRST as a standalone commit that only rewrites `content/lessons/01-grilling.md`: keep the filename and `order: 1`, add `part: 2`, and link ONLY to existing Slugs (the 8 new ones 404 in PR A).
2. Send the SHA to the engine session, which cherry-picks it into PR A.
3. Do the renumbering (`git mv` to `04-grilling.md`, `order: 4`, etc.) and the links to new Slugs in LATER commits. Don't edit the other 11 existing files' headers before the renumbering commit.

## Tests

Don't run `npm test` (it hits the shared Neon `test` branch, and PR A's suite empties tables). Once PR A's branch is pushed, merge it locally and run only `npm run test:content`.

## v1.1 (2026-10-23): two clarifications, both lint rules

1. **Word count**: plain words in prose (paragraphs, lists and tables between fences) plus the bodies of `callout`, `try` and `site-story`. Excluded: headings, code blocks (including code inside those blocks), `goals`, `scene`, `checkpoint`, `test` and `sources`. Range 1,800–3,000 (Start here 900–1,400).
2. **Final test kinds** come from `test` id prefixes: at least 3 `scenario-…`, at least 2 `spot-…`, at least 1 `sequence-…`. Any other id is a free kind (e.g. `predict-…`, `why-…`). Checkpoint ids are unconstrained. Ids are permanent, so pick the prefix carefully.
