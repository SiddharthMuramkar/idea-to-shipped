# 04: Lesson 11, "The main flow"

**What to build:** A new last Lesson: slug `main-flow`, title "The main flow", order 11, with its own topic-matched photo (a map, a route or a flow), using the same sections as every Lesson (What it is → When to use it → What I typed → What happened). It is a beginner's which-command-when map. Sources: Matt Pocock's video "mattpocock/skills: A complete AI Coding workflow, end-to-end" (2026-07-16, https://www.youtube.com/watch?v=M6mYodf0dJM) and the installed `ask-matt` Skill (read its SKILL.md). Use the glossary terms Main flow, Skill and Built-in command.

**Blocked by:** 02 (Lesson pages with photos)

**Status:** ready-for-agent

- [ ] Shows the Main flow as an ordered path with its two forks: "can every question be settled by talking?" (if not, `/prototype`) and "is this a multi-session build?" (`/to-spec` → `/to-tickets` → `/implement` per ticket or `/implement-spec`, versus `/implement` right away)
- [ ] A "you're in this situation → type this" table that includes `/ask-matt`, `/diagnosing-bugs`, `/triage`, `/pr` and `/retro`
- [ ] Says which Skills only the human can start (`/ask-matt`, `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`) and which the agent picks up on its own
- [ ] Explains the Built-in commands `/clear` and `/compact`, and the rule "keep grilling, spec and tickets in one session; `/clear` only after `/to-tickets`", in plain words (the smart zone)
- [ ] An "old way → new command" table mapping Lessons 0–10 (`/grilling` + `/domain-modeling` → `/grill-with-docs`; "write the spec" → `/to-spec` + `/to-tickets`; `/tdd` ×4 + `/code-review` → `/implement` or `/implement-spec`)
- [ ] "What I typed" lists the real steps used to build this PR (the grilling, `/to-spec`, `/to-tickets`, `/implement-spec`); "What happened" is drafted and marked to finish after the build
- [ ] The Lesson appears last on the home page and its Previous link goes to Lesson 10; Lessons 0–10's text is untouched
