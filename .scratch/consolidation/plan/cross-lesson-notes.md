# Cross-lesson issues reported by the review workflows (fix in the final consistency pass)

1. issues-and-keeping-track: the yoga-studio setup Try it (around `gh repo create yoga-studio --clone`) doesn't say where to run it; a reader still inside `recipes/` would clone it nested inside. merging-and-cleaning-up's new `cd yoga-studio` step assumes the reader runs it from the folder that holds `yoga-studio`.
2. undo-and-conflicts says rewrite only what is "not pushed" (Pro Git's rule); push-pull-and-remotes presents rebasing your own pushed branch then `git push --force-with-lease` as an option. Align the two (e.g. "never rewrite shared history; your own pushed branch is the exception, with --force-with-lease").
3. commits-and-diffs, pull-requests, and one table row in one-change-start-to-finish use `main..HEAD` as the check of "what my branch adds"; when local `main` is stale this gives a false alarm. working-with-an-agent-on-github now uses the fix (`git fetch` then `origin/main..HEAD`, or similar): make the others consistent.
4. start-here: the bold key sentence says "repository" before the word is defined.
5. foundations/skills Try it step 3: pressing Enter in the /skills list toggles a Skill's visibility; a reader who types "grill" then Enter could hide a Skill installed with skills.sh. Make the step say how to just look (Esc to close).
6. ci-cd/lab-gated-pipeline: checkpoint `vercel-entrypoint` Why says Vercel takes the file that imports express "and default-exports the app"; Vercel's Express docs say the file "must also export the application as a default export of the module or use a port listener". Make the Why accurate.
7. ci-cd/agents-in-github-actions: the Try it's claim that the latest claude-code-action release is tagged v1 is unverified.
8. Pinned memory.md (snapshot, 2026-10-29) says plain `/context` lists memory files; current docs say `/context all` (instruction-files was fixed). Check other lessons that mention `/context` for memory files.
9. what-git-and-github-are: Windows readers work in Git Bash, then the winget install command is shown; winget is documented for PowerShell/cmd and has had problems in Git Bash. Say "in PowerShell" on the winget line.
10. reading-a-repository.md (~line 280) says "Matt Pocock's Skills" without defining "Skill" there (check it links /learn/skills or glosses it).
11. issues-and-keeping-track: lt-agent-done right option and quick-11's Why simplify "how an Issue closes" (merged PR with Closes #N, or a person closes it) without mentioning that a commit with a closing keyword reaching main also closes it. OK in context; optional.
12. Vague pointer "do the Try it in [Issues: keeping track of work]" / "[keeping track]'s Try it step" in ~13 lessons (main-flow:273, instruction-files:246, context-hygiene, domain-modeling, grill-me, grill-with-docs, grilling, handoff, prototype, implement, implement-spec, tdd, ask-matt). Name the step: "Try it: set up the practice project" in /learn/issues-and-keeping-track. (idea-to-shipped-1 fixed main-flow/one-shared-language; ask-matt's planned fix wasn't applied.)
13. issues-and-keeping-track: the practice-project setup starts Claude Code at step 6 but never exits it before step 9's "Back in the terminal". Add the exit (Ctrl+C twice or /exit).
14. grill-before-you-build: "main flow" used at ~line 99 and in checkpoint quick-6 before its definition at ~line 111 (style rule 3).
15. "Skills this flow uses / in this flow" wording (flagged and fixed in grill-before-you-build) is still in fix-the-environment:148, context-hygiene:150, test-first:127.
16. grilling.md:235, :309, :407 say "your global CLAUDE.md" for ~/.claude/CLAUDE.md; grill-me now uses different wording (grill-me-5). Match it.
17. Optional: fix-the-environment step 12 "Commit and push step 10's change." has no command, and step 13's "Once green" has no watch command.
18. ask-matt SKILL.md:13 says "two on-ramps" but lists three; the lesson says three (correct). No change.
