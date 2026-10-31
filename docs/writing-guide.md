# Writing guide for the Idea to shipped Course

How an Idea to shipped Lesson should read. `npm run test:content` checks a Lesson's format and the Course's house rules, and its messages say how to fix what it finds. This guide covers what it can't check. The Grilling Lesson is the model for voice, depth and structure.

## Voice

- Write to the reader as "you", in plain words and short sentences. British spelling is fine, but keep to one spelling within a Lesson (Grilling uses "colours" and "summarises").
- Use "I" only in the Site story, where the author speaks.
- Teach from zero. Explain every term at or before its first use, in a clause rather than a footnote: "a subagent (a helper agent with its own fresh memory)". Link earlier Lessons, but a reader who lands on this one cold should still follow it.
- Every Lesson stands alone. Define Claude Code, agent, Skill, token, session, repo, spec, ticket, context window and any mode you mention at first use, even if an earlier Lesson defines them properly. Introduce Matt Pocock once: "a developer and teacher who publishes a popular set of Skills for Claude Code".
- Prefer the concrete. Use this site (the comment box, Lessons, Slugs, Neon branches) as the running example wherever it fits.
- No hype and no filler intros ("In this Lesson we will…"). Open with the one-line promise.
- Highlight one to three phrases per Section: the ones you'd want remembered.
- Don't call a Skill a "command": the glossary keeps that word for Built-in commands. Write "type its name" or "type `/name`", and don't backtick partial names like `/grill`.
- Name another Lesson by its title and link to it. Don't say "the next Lesson", since the order can change. "Part 4" is fine.

## Shape

In this order, with the headings adjusted to the topic:

1. A one-line promise, as the first paragraph, before the goals.
2. The goals, each one "You'll be able to <verb>…" and each one checked by the Final test.
3. **Why it matters**: the failure the Skill fixes, made concrete.
4. **The idea**: the mental model in plain words, ending with a Scene if it helps.
5. **A session, step by step** (or similar): a Scene of a real or illustrative session. Label an invented one "(illustrative)" in its title. It must match how the Skill behaves in 1.3.1.
6. Your part: how to steer it, and when to reach for it and when not.
7. **How Matt and others use it**: cited habits, saying when and where ("in his July 2026 walkthrough"), then other developers.
8. **Try it yourself**: the exact prompt to type, numbered steps, and an "It's working if:" checklist.
9. **Common mistakes**: bullets with a bold lead-in. Don't restate a whole earlier Section; point back to it in one line.
10. The Site story.
11. **Cheat sheet**: a short table or list.
12. **Final test**, then the sources.

Put each Checkpoint right after the Section it checks. Two or three Scenes are plenty.

### Worked examples and exercises

- Worked examples model the advice. Inside a repo, a Scene uses `/grill-with-docs`, not `/grill-me`. Two Scenes never contradict a rule, such as one treating storage as a decision and the other as a fact.
- Don't highlight a flow node whose caption says it never happens.
- Keep a session-length story consistent: one set of numbers, stated once.
- An exercise starts from zero, assuming only Claude Code, Matt's Skills and a terminal: `mkdir … && cd … && claude`, Yes at the trust prompt, the plugin install with `/exit` and a restart, how to check the mode ("if you see 'plan mode on', press Shift+Tab until it changes"), how to stop it (Esc, or No at a permission prompt) and `/exit`.

## Questions

- Checkpoints check the Section just read; the Final test checks the goals. Every goal gets at least one Final test question, and no Checkpoint repeats one.
- One unambiguous right answer, from what the Lesson teaches. Wrong options are real misconceptions. No trivia (numbers to memorise) and no wording tells.
- Test transfer, not recognition. Use a fresh situation (a book club, a recipe site), not the body's own example sentence. Don't restate the right answer's defining phrase in the prompt, and don't offer a wrong option about a retired Skill the Lesson never mentions.
- Spread the right answers across a, b, c and d.
- A wrong option's feedback says why it's wrong; the right one's says why it's right.
- Question ids are permanent once published (ADR 0005), so make them descriptive.

## Facts the whole Course agrees on

Use these exactly. If a source disagrees, it's older or about a different version: flag it rather than contradict it.

- **Version.** Facts about Skills are pinned to `mattpocock-skills` 1.3.1, as installed (the plugin build already carries a few unreleased fixes from GitHub main, such as grilling's "yes accepts the recommendation"). Claude Code facts are as of 2026-10-23 (Claude Code 2.1.309). Matt's older videos use old Skill names (write-a-prd → `/to-spec`, prd-to-issues → `/to-tickets`, CONTEXT.md → GLOSSARY.md); translate them.
- **User-invoked Skills** (16; only you can start them): ask-matt, setup-matt-pocock-skills, grill-with-docs, grill-me, handoff, to-spec, to-tickets, implement, implement-spec, retro, triage, wayfinder, improve-codebase-architecture, wait-what, teach, to-questionnaire.
- **Model-invoked Skills** (11; you or the agent): grilling, domain-modeling, prototype, tdd, code-review, pr, diagnosing-bugs, research, wizard, codebase-design, writing-for-agents.
- A user-invoked Skill can call model-invoked ones, never another user-invoked one. Plain words can start a model-invoked Skill, never a user-invoked one: type its name at the start of your message.
- **Name clashes.** Claude Code has its own Built-in `/code-review` (a bug hunt with effort levels, plus `/code-review ultra`). Matt's Skill is always reachable as `/mattpocock-skills:code-review`. A hidden Built-in also shadows `/prototype`; use `/mattpocock-skills:prototype` if the short name fails.
- **Smart zone.** About 150k tokens on today's best models, per ask-matt, as a rule of thumb. Matt has said 100k–140k at other times. The limit is about quality, not window size: current models have 1M-token windows, and a session can be in the dumb zone with most of the window free.
- **Context hygiene.** Keep `/grill-with-docs` → `/to-spec` → `/to-tickets` in one unbroken window; don't `/clear` or `/compact` until after `/to-tickets`. `/clear` between `/implement` tickets. Run `/retro` in the session it reviews, before `/clear`.
- **Phase** (Matt's meaning): a chunk of work inside a session (grilling, implementing, QA). At a boundary, ask in order: continue? `/clear`? `/handoff`? A subagent? Otherwise `/compact` (the default, not the first reach).
- **`/clear`** empties the working context; the old conversation can still be reopened with `/resume`, but it doesn't come back into the current session. **`/compact`** replaces the history with a summary you can steer ("`/compact` focus on X"). Both are Built-in commands, not Skills.
- **Claude Code modes** (2026-10-23): new sessions start in **auto** mode; Shift+Tab cycles Manual (`default`) → Accept edits → Plan → (Bypass / Auto when available). Plan mode only reads and proposes until you approve.
- **Matt on plan mode:** he grills in auto mode, not plan mode, and said in April 2026 that he stopped using plan mode because it rushes to a plan and asks little.
- **Matt's Main flow:** `/grill-with-docs` → (a prototype detour via `/handoff`) → small: `/implement` here; multi-session: `/to-spec` → `/to-tickets` → `/implement` per ticket (clearing between) or `/implement-spec` → `/tdd` inside, `/code-review` to close → `/pr` writes the PR body → `/retro`. Run `/setup-matt-pocock-skills` once per repo first. On-ramps: `/triage`, `/diagnosing-bugs`, `/wayfinder` (which hands off at `/to-spec`).
- **`/grill-with-docs` or `/wayfinder`:** the split is whether you can *plan* the work in one sitting, not whether *building* it takes one session. A multi-session build still starts with `/grill-with-docs` and goes `/to-spec` → `/to-tickets`.
- **What a Skill saves.** Don't over-claim. `/grill-with-docs` writes terms to `GLOSSARY.md` and offers an ADR only for rare hard-to-reverse decisions; most decisions live in the conversation until `/to-spec`.
- **Install:** `claude plugin install mattpocock-skills@claude-plugins-official` (it updates itself). The other route, `npx skills@latest add mattpocock/skills`, copies editable files; never use both.

## Site story

- Cite only facts the repo holds: commits, PRs and files. Cut any claim that only a session log could back up. Look in the git log, PR bodies (`gh pr view`), the old Lesson files (`git show d21fc2c:content/lessons/<old-file>.md`) and the specs and tickets that used to be in `.scratch/` (`git log --all -- .scratch`). Never use the author's memory notes, global CLAUDE.md or settings, or clock times.
- Write in the first person, in the author's voice, and keep it short. Quote the author's own prompts freely: they're the author's material.
- The author owns decisions. Write "we agreed" or "I decided" for scope, not "it decided".
- A Lesson the site didn't launch with gets a Site story only from real material. Otherwise leave it out, or write "Not used on this site yet" and one honest line. Never invent a session or predict an outcome.

## Sources

- Give every source a date.
- Pin Matt's SKILL.md files to the commit that 1.3.1 matches: `[name SKILL.md](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/<bucket>/<name>/SKILL.md): pinned to mattpocock-skills 1.3.1, read <date>.`
- Videos: the title, URL, publish date and the timestamps you used. Docs pages: the title, URL, updated date if shown, and the date you read it.
- Check every claim about what Matt did against the transcript, not a paraphrase of it, and cite the timestamps that cover it. A draft once said Matt went straight to `/implement` in his July video; he said he normally would, then demoed `/to-spec`.

## Copyright

Lesson text is in your own words, SKILL.md files included. At most one direct quote per source, under 15 words, in quotation marks with attribution. Never paste transcript passages or docs paragraphs.

## Before you hand back

Run `npm run test:content` until it passes, then read the Lesson as a Visitor would with `npm run dev`, at `http://localhost:3000/learn/<slug>`.
