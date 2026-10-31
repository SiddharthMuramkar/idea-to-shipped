# REMAINING: codebase-cleanup handoff (session of 2026-10-31)

The session that started this work stopped early because the weekly usage ran out. A new session continues from here. Everything it needs is in this file and the paths it lists.

## Where things stand

- **Production is fixed.** The user ran `vercel promote dpl_B4nQv7gMHp8mvEmy2EkbTQw46WvF --scope acme-ef4b`. Verified afterwards:
  - the live domains point at main's `d90c741` build
  - `autoAssignCustomDomains: true`
  - the rollback banner is gone
  - pages return 200
- **Branch `codebase-cleanup`** (pushed): 6 work commits on top of `d90c741`, plus this file. Every commit was checked:
  - lint, `next typegen` + `tsc`, and `npm run test:content` (453 tests, ~0.24 s) all pass
  - the UI-freeze check passes: all 22 routes render normalized HTML identical to the pre-branch build

  The commits:
  1. `8357059` Upgrade dependencies to latest stable (TypeScript held at 6.0.3 and @types/node at 24.x, see Follow-ups)
  2. `bb49897` Course layer: Lessons live in `content/<course>/` with a `course.md`
  3. `9408b9a` Docs: keep only what the code can't say
  4. `5bae812` Comments say why, not what (src outside app, config)
  5. `19e7bf7` App: drop dead CSS and stale comments
  6. `df6c3fe` CI: GitHub Actions for checks and the database tests
- **Not done:** the review/fix run was stopped before any reviewer finished, so it produced nothing. No PR is open yet.

## Next steps (in order)

1. Check out the branch: `git fetch && git switch codebase-cleanup` (or reuse the worktree at `.claude/worktrees/codebase-cleanup`).
2. Re-run the review and fix workflow. Its script is saved, so re-run it with the Workflow tool's `scriptPath` (see Session metadata). It runs:
   - three read-only reviewers: truth of every doc and comment; UI freeze (HTML + CSS + client components + comments API); scale probes in a temp copy (second Course, mid-Course insert, every error case, a 200-Lesson timing run, design review)
   - then one fixer that verifies each finding before fixing it

   Two items the fixer must do regardless:
   - **Security:** Lesson Markdown links and images with `javascript:` URLs still reach the page (marked renders `[x](javascript:alert(1))` as an href). Refuse them in `src/lessons/markdown.ts`, next to the raw-HTML refusal, with a clear message, a fixture and a test. Then ADR 0007's "content can't run code" is fully true.
   - `src/lessons/files.ts` (~line 37) and `src/lessons/lessons.test.ts` (~line 945) contain a literal invisible U+FEFF character. Write it as `﻿`.
3. Push, then open the PR with the `/pr` skill. Mention the follow-ups below in it.
4. On the Vercel preview, check two things:
   - its normalized HTML matches production (`ui-freeze/capture.sh` + `compare.sh`; previews are SSO-protected, so use `vercel curl` or a bypass)
   - `GET /api/comments?lesson=grilling` returns 200 with JSON. This proves the deployed function still finds the moved Lesson files: `next.config.ts` `outputFileTracingIncludes` is now `./content/**/*`.
5. The user merges. Afterwards, **ask** before turning on branch protection on `main` that requires the CI check named `checks`.
6. Optional user step: `gh secret set TEST_DATABASE_URL`, with the Neon `test` branch connection string only (not a `DATABASE_URL=` line). Until it's set, the CI `db` job is skipped.
7. After the merge, remove the worktree. The user's new rule puts worktrees at `~/Developer/<repo>-wt-<name>`; this one predates that rule.

## Decisions made with the user (don't reopen)

1. Undo the rollback by promoting main's build. Done.
2. The UI is frozen: no visual change in this PR, and photos stay.
3. The docs rule: keep only prose code can't hold. GLOSSARY.md holds domain words, docs/adr/ the why, docs/agents/ + CLAUDE.md/AGENTS.md the config, and a short README covers running the site. The Lesson format is defined by the lint messages plus the fixture `src/lessons/__fixtures__/complete-example/`.
4. Dependencies go to latest stable, majors included, unless a tool blocks one.
5. The site will hold several Courses on different topics. The first is "Idea to shipped" (slug `idea-to-shipped`).
6. New question features (Part/Course exams, a question bank, new formats, Answers/Attempts) are **out of scope**. The user is writing a SPEC.md for them in another session.
7. The swarm uses about 10 agents.
8. The Course layer is structure only: no Course list page yet.
9. Slugs are unique across all Courses (ADR 0008). No DB change, and `/learn/<slug>` URLs stay.
10. Domains are out of scope. The real live domain is `idead-to-shipped.app` (extra "d"); `idea-to-shipped.app` doesn't resolve.
11. Raw HTML in Lessons is refused (no Lesson used it).
12. The lint is split: rules for every Course, plus Idea-to-shipped house rules for that Course only.
13. Lesson order comes from `course.md`; files are `<slug>.md`, with no `order:`/`part:` headers.
14. Photos are optional for new Lessons.
15. CI is added now. Branch protection waits until after the merge, with the user's OK.
16. Docs describe only what's built. ADRs 0005/0006 are marked accepted but not built; that code is parked in tag `wip/pr-a-2026-10-23`.
17. Code uses glossary words: `Question.answer` became `correctOption`, and the fence `test` became `final-test`.
18. **`.scratch/` stays** as an archive: 11 Lessons cite it as the worked example. Only `writing-guide.md` moved, to `docs/writing-guide.md`.
19. **CLAUDE.md stays 17 lines**, because two Lessons (how-agents-work, retro) quote its length. The docs rule lives in `docs/agents/domain.md` instead.
20. No Lesson text changes in this PR.

## Follow-ups to list in the PR (not blockers)

- **TypeScript 7 held back:** typescript-eslint (via eslint-config-next 16.4.3) doesn't support TS 7 yet (typescript-eslint#10940). tsc, next build and Vitest already work on 7.0.2.
- **ESLint 10 peer warnings:** eslint-plugin-react, -import and -jsx-a11y don't list ESLint 10 yet. npm prints 3 ERESOLVE warnings and `npm ls` exits non-zero. Installs work.
- **npm audit:** 19 moderate advisories, all in dev tooling (the minimatch chain, and esbuild via drizzle-kit's @esbuild-kit). No runtime packages are affected.
- **Pre-existing `next dev` warning:** "encountered URL data during prerendering" at `await params` in `src/app/learn/[slug]/page.tsx`. Fixing it needs a Suspense boundary, which is a UI change.
- **Lessons without a photo are unstyled:** the card has no tick slot (`.lesson-card-tick` sits inside `.lesson-card-photo`), and the header shows plain navy. This is for a future UI PR.
- **Credits page:** it labels Lessons "Lesson N", counted per Course. That becomes ambiguous once a second Course has photos.
- **Home page copy:** it says "journal", which is an avoid-word in the glossary. It's visible text, so it's the user's call.
- **Leftover markup:** the frozen HTML still carries unused attributes and classes from features that were never built (`data-step`, `data-steps`, `--chars`, …).
- **`getQuestions`** in `src/lessons/lessons.ts` is used only by tests.
- **Loader rule:** every `.md` file in a Course folder must be listed in its `course.md`, or the build fails. Keep drafts outside `content/`.
- **Lesson memo:** it's off under `next dev` (`NODE_ENV=development`), so edits show up on a hard reload.
- **Lessons with an existing wrong claim:** spec-and-issues.md:270 calls a Slug "one-word". Fix this in future content work.
- **CI build cache:** CI could cache `.next/cache`; see `node_modules/next/dist/docs/01-app/02-guides/ci-build-caching.md`.

## UI-freeze method (reuse it)

Normalized HTML diff:
- Strip `<script>`, `<link>`, Vercel `data-dpl-id` and `&dpl=` params, and hashed `/_next/static` paths.
- Then diff each page tag by tag against a baseline built from `d90c741`. Production and a local build of the same code diff to nothing.
- Build locally with `DATABASE_URL=postgresql://build:build@localhost:5432/build npx next build`. The pages are static; only the API route imports the db.

The scripts are in `.scratch/codebase-cleanup/ui-freeze/` in this repo: `normalize.mjs`, `compare.sh`, `capture.sh`, `ui-check.sh`. They expect the baseline at `../baseline/local/`. A ready copy with baselines lives in the private handoff folder below. Run it from there:

```
bash <handoff>/ui-freeze/ui-check.sh <repo-dir> <port>
```

## Session metadata

- Session id: `bcd457ba-a444-42e3-b166-831f6106bb3d`
- Transcripts:
  - `~/.claude/projects/-Users-siddharth-Developer-idea-to-shipped/bcd457ba-a444-42e3-b166-831f6106bb3d.jsonl` (before entering the worktree)
  - `~/.claude/projects/-Users-siddharth-Developer-idea-to-shipped--claude-worktrees-codebase-cleanup/bcd457ba-a444-42e3-b166-831f6106bb3d.jsonl` (after)
- Approved plan: `~/.claude/plans/cheeky-hopping-map.md`
- Audit reports:
  - docs vs code: `~/.claude/plans/cheeky-hopping-map-agent-a4032e2dec3edfee3.md`
  - scaling and sibling sites: `~/.claude/plans/cheeky-hopping-map-agent-a338e69e2c721e70c.md`
- **Private handoff folder (everything from the scratchpad):** `~/.claude/projects/-Users-siddharth-Developer-idea-to-shipped/handoff-2026-10-31-codebase-cleanup/`. It holds:
  - the baselines (prod/local HTML, CSS) and the ui-freeze scripts
  - every agent's gate logs, dry runs (TS 7, ESLint 10) and commit messages
  - `tasks/workflow1-result.json`: the full return value of every build-phase agent, with their follow-ups
- Workflow 1 (build, finished, 6/6 green), run `wf_3b962a2e-650`:
  - script: `~/.claude/projects/-Users-siddharth-Developer-idea-to-shipped--claude-worktrees-codebase-cleanup/bcd457ba-a444-42e3-b166-831f6106bb3d/workflows/scripts/codebase-cleanup-build-wf_3b962a2e-650.js`
  - journal: `.../subagents/workflows/wf_3b962a2e-650/journal.jsonl`
- Workflow 2 (review + fix, STOPPED, no results), run `wf_6875c95d-05c`:
  - script: `.../workflows/scripts/codebase-cleanup-review-wf_6875c95d-05c.js`
  - It hard-codes the old scratchpad path `/private/tmp/claude-501/...`; point `S` at the handoff folder before re-running.
- Memory files: `~/.claude/projects/-Users-siddharth-Developer-idea-to-shipped/memory/` (quiz SPEC, docs rule, several Courses, Vercel facts).
- Vercel: team `acme-ef4b` (`team_bKBdYXJTLJh3OlFwRrKjbL2c`), project `prj_lAqBHj7C39rKJq3uB5jxa7TmQYki`. Auto mode blocks production promotes, so the user runs those.
