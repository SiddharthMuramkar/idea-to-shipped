# Research: wizard (Lesson 15)

## Source map
All read on 2026-10-23.

| ID | Source | Date | Covers / used |
|---|---|---|---|
| W1 | Local `skills/engineering/wizard/SKILL.md` (same install, commit `49dd158`) | 2026-10-09 | The four-step process. Identical to main. |
| W2 | Same folder, `template.sh` | same | Library helpers, `run_wizard`, STAGES marker, example Stripe stage |
| W3 | Local `docs/engineering/wizard.md`, same as https://www.aihero.dev/skills-wizard | /posts lists it Aug 5, 2026; a search snippet shows Aug 24, 2026 | What it does; When; Prerequisites; Stages; destinations table; Ephemeral; Common questions; It's working if; Where it fits |
| W4 | Local `CHANGELOG.md` 1.2.0 (#680, graduated and made model-invoked) and 1.2.3 (#783, time estimate removed) | 2026-08-05 (v1.2) | History |
| W5 | GitHub main `.changeset/wizard-template-fixes.md` and `wizard-template-fixes-2.md` (merged 2026-10-07 and 2026-10-09) | unreleased | Template fixes, already in the local install |
| W6 | Local `ask-matt/SKILL.md`, "Standalone: /wizard" | 1.3.1 | Routing |
| W7 | Matt Pocock, "New Skills! v1.2 brings /wait-what, /writing-for-agents, and fixes /grill-me", https://www.youtube.com/watch?v=gaDdrDdczO4 | 2026-08-05 (11:37) | Wizard chapter 7:27–8:58. Transcript came back as an Arabic machine translation, so paraphrases are approximate. |
| W8 | GitHub issues: #1310 (open, 2026-10-20), #954 (closed not planned), #1111 (closed not planned), #1142, #741, #770, #852 | various | User reports |
| W9 | Author: `content/lessons/04-wizard.md`, `.scratch/lesson-site/issues/02-accounts-and-environments.md`, commit `c226730` (PR #1, 2026-10-21), `docs/adr/0002-neon-branch-per-environment.md`, `.gitignore` (`.env*`) | 2026-10-21 | Site story |

## Key facts (pinned to v1.3.1 + commit 49dd158)

**What it is.** A Skill that generates an interactive **bash script** walking a human through steps only they can do (W1, W3):
- provisioning infrastructure,
- credentials and CI secrets,
- unfamiliar third-party dashboards,
- one-off migrations or cutovers.

The script opens each URL, says what to click and copy, captures values, and writes them to `.env` or GitHub secrets and variables. It confirms before irreversible steps and shows stage progress (W1).

**Invocation.**
- Type `/wizard`, or just describe the setup you're stuck on.
- **Model-invoked** since v1.2.0 (#680). The agent reaches for it when it hits a wall only you can pass, instead of dumping numbered steps into chat (W1, W3, W4).
- Explicit non-trigger: don't use it for steps the agent can do itself (W1 description).

**Process** (W1):
1. **Scope the procedure.**
   - Read the repo first, not cold: `.env*`, `.env.example`, README, `docker-compose*`, framework config, and every `secrets.*` / `vars.*` in `.github/workflows/`. Each is a value the wizard must produce. For a migration: current state, target state, and the irreversible actions between them.
   - Show the ordered stage list and the values each produces, and confirm with the user.
   - Done when each value has a source, a destination (`.env`, secret, both, or nowhere) and is marked secret or public.
2. **Map each stage's journey** to concrete clicks, e.g. Dashboard → Developers → API keys. Where the agent doesn't know the current UI, it asks or checks the docs, and never invents steps.
3. **Author.**
   - Copy `template.sh` and write one `stage` per step, in dependency order, using `stage`, `say`/`step`, `open_url`, `ask`/`ask_secret`, `write_env`, `set_secret`/`set_var`, `pause`/`confirm`. Set `TOTAL_STAGES`.
   - Open the URL before asking for its value; use `ask_secret` for secrets; `confirm` before irreversible actions; one focused task per stage, since each stage clears the screen.
   - Never edit the library above the STAGES marker.
4. **Verify and hand off.**
   - `bash -n`, `shellcheck` if available, `chmod +x`.
   - Don't run it end to end: it opens browsers and waits for a human. Trace it statically: every value lands where step 1 said, and every `set_secret` name matches a `secrets.*` in CI.
   - Tell the user how to run it. Commit it and link it from the README only if it's a repeatable setup path.

**What the template already does** (W2, W3).
- Stage-by-stage progress ("Stage n/N") with confirmation gates.
- Cross-platform URL opening, including WSL.
- Hidden secret entry.
- Idempotent `.env` upserts, single-quoted and created with mode 0600.
- `gh secret` / `gh variable` writes that degrade to a warning if `gh` is missing or not signed in.
- On re-runs, saved values are offered back ("Enter keeps current").
- A closing summary listing what was written and what you must still do by hand.

**Where values go** (W3):

| Destination | When |
|---|---|
| `.env` only | Local dev needs it, CI doesn't |
| GitHub secret | CI reads it and it's sensitive |
| GitHub variable | CI reads it and it's public |
| Both | Local and CI need it |
| Nowhere | A pure action |

**Ephemeral by default.** Save it to a scratch or `scripts/` path, run it, delete it. Commit it only for a repeatable setup path (W1, W3).

**Secrets stay out of the model.** The agent writes the script but you run it. Values typed into it never reach the model's context; only values you paste into chat do (W3). Matt says the same at W7 8:25–8:30 (approximate wording).

**When not to use it.** For deciding what to build, use `/grill-with-docs` or `/to-spec` (W3).

**Main flow connection.** A standalone you can use anytime, not a chain step. The trigger is a manual step showing up: before the build, mid-build, or after ship. It pairs with `/implement` when a feature needs credentials, and is a neighbour of `/setup-matt-pocock-skills` (W3, W6).

### Newer on GitHub main / recently changed
- **Unreleased, already in the local template (W5):**
  - Readline in `ask`, so arrow keys work (#741)
  - Single-quoted `.env` values (#770)
  - An open-it-yourself warning when no browser opener exists (#774)
  - Writes through a symlinked `.env` (#811)
  - EOF no longer loops (#852)
  - Double-quoted values decoded on re-run (#1220)
  - Stages wrapped in `run_wizard`, so editing the script mid-run can't kill it (#1142)
  - `_clear` falls back to ANSI codes (#1081)
  - `write_env` sets the shell variable too (#1041)
- **1.2.3 (#783):** the time estimate was removed; progress counts stages only. The aihero page still says "progress with time remaining" (W3 vs W4).
- **Open:**
  - #1310: the template banner tells you Ctrl-C and re-run is safe because values are saved. That's false for stateful cutovers where state lives only in memory.
  - #963: Windows Git Bash `open_url`.
  - #1260: bash 3.2 apostrophe bug.
  - #1295: shellcheck SC1087.
- **Closed not planned:** PowerShell output for Windows (#954); combining the wizard with a browser extension so the agent clicks for you (#1111).

## Day-to-day usage

**Matt (W7, 2026-08-05; Arabic machine-translated track, so paraphrased loosely):**
- **7:27–7:43:** He held this Skill back for a while. It came from provisioning a lot of infrastructure and AWS configuration, which he hated doing.
- **7:43–8:01:** It generates an interactive bash wizard for the steps only the user can do. He could have had an agent drive AWS through computer use, but that felt uncomfortable. He wanted control, made as easy as possible.
- **8:02–8:24:** Demo, a wizard for moving to a remote machine setup: it asks if you're ready, sends you straight to the right page, has you sign in and change the exact setting.
- **8:24–8:42:** You paste API keys. It's a deterministic script, so nothing touches the agent or goes to Anthropic. It saves values to the files that need them, or to GitHub secrets, stage by stage.
- **8:42–8:56:** It turned provisioning from painful into oddly enjoyable for him. It had been in progress for months.

**Others:**
- A Codex user generated a real production-cleanup wizard (quarantine, verify, roll back or delete). The fixed "re-run later" banner was unsafe for that stateful flow (#1310).
- A team on company Windows laptops asked for PowerShell output; closed as not planned (#954).
- A user enjoyed it but found it sometimes overkill for an MVP. When the wizard got something wrong, restarting or getting the agent to fix it was annoying (#1111).
- In launch week a user asked for a way to go back and correct an entry. There is none: Ctrl-C and re-run (W3).

## Common mistakes
1. **Running it inside the Claude chat** (e.g. with `!`). It needs a real interactive terminal (W9).
2. **Wizard stages for things the agent can do.** The agent should do them itself (W1). In the site story, the agent did most setup first.
3. **Pasting secrets into chat while scoping.** They then sit in the model's context (W3).
4. **Hand-editing the library above the STAGES marker** (W1, W2).
5. **Expecting a back button.** Ctrl-C and re-run; saved values come back as defaults (W3).
6. **Stages that overflow the screen.** Each stage clears it (W1, W3).
7. **Trusting Ctrl-C-and-re-run for stateful cutovers** (#1310).
8. **Expecting it to check the third-party service.** It only knows what's in your repo and `.env` (W3).
9. **Committing a one-off wizard**, or forgetting `.env*` in `.gitignore` (W1; this repo ignores `.env*`).
10. **Treating it as a fixed Main flow step** after `/to-spec`. It's triggered by a manual step showing up (W3).

## Try it yourself (~15 min, safe practice values only)
In a fresh session, type:

```
/wizard I want to practise. Make a 3-stage wizard at .scratch/practice/wizard-practice.sh that writes only to .env.practice (no GitHub secrets or variables):
1. Open https://github.com/settings/profile and ask me for my GitHub username (public) -> PRACTICE_GITHUB_USER.
2. Open this repo's GitHub page and have me confirm I can see the README (a pure action, nothing saved).
3. Ask me for a made-up practice token with hidden input -> PRACTICE_TOKEN. Remind me to type a fake value.
Show me the stage list first and wait for my OK.
```

Then, in a **real terminal window** (not with `!` in Claude), run the command it gives you, e.g. `bash .scratch/practice/wizard-practice.sh`. Run it a second time, then delete the script and `.env.practice`.

**It's working if:**
- [ ] You see the ordered stages and their values, and are asked to confirm, before any script exists.
- [ ] It runs `bash -n` (and `shellcheck` if you have it) but does not run the wizard itself.
- [ ] Each stage clears the screen and shows "Stage n/3".
- [ ] The browser opens *before* each value is asked for.
- [ ] Your typing is invisible for the token.
- [ ] `.env.practice` holds the two values, single-quoted.
- [ ] On the second run, each prompt offers "[Enter keeps current]".
- [ ] The final screen lists what it wrote, plus anything left for you to do by hand.

## Site story (Lesson 4 and the repo)
- **What the author typed:** `/wizard`. Then, in Cursor's terminal, `bash .scratch/lesson-site/wizard-02.sh` (W9, Lesson 4 lines 24–32).
- **The ticket** was `.scratch/lesson-site/issues/02-accounts-and-environments.md`: steps only the author can do (logins, dashboards), with the agent generating a `/wizard` for them. Done when production shows the placeholder and the agent can `select 1` against `dev` and `test`.
- **What happened** (Lesson 4 lines 36–44):
  1. **The agent did most of the setup itself first.** The author was already signed in to GitHub and Vercel, so it created the public repo, the Vercel project, and a Neon project with a `test` branch. The site went live before the author clicked anything.
  2. **A guard rail blocked pushing straight to `main`**, so the change went through PR #1, the author's first PR.
  3. **The wizard had 4 stages:** connect Neon to Vercel (browser clicks), pull the laptop connection string (automatic), paste the test password (hidden input), merge PR #1.
  4. **The first run failed harmlessly.** It was run inside the Claude chat with `!`, which can't press Enter, so it raced through every question. Re-run in a real terminal.
  5. **A safety check refused the production password in the test slot.** This was stage logic the agent wrote, not part of the template library.
- **Reality changed the plan.** The Neon-managed Vercel integration created a branch named `vercel-dev`, not the planned `dev`. Commit `c226730` (2026-10-21, PR #1 "setup/neon-branch-names") updated the spec and ADR 0002 to match.
- **The script was never committed** (no git history for `wizard-02.sh`): ephemeral, as the Skill recommends.
- **New words the author learned:** connection string, `.env` files, `vercel-dev`.

## Candidate quiz questions
1. **Mid-build, the agent needs a Stripe secret key it can't create. What should it do?**
   - a) Paste six numbered steps into chat
   - **b) Generate a wizard script that walks you through it ✔**
   - c) Guess a key
   - d) Stop the build silently

   *Why:* model-invoked so it fires at walls only you can pass. (W3, W4)
2. **The agent could create the GitHub repo itself with `gh`. Should that be a wizard stage?**
   - a) Yes, wizards cover all setup
   - **b) No. If the agent can do it, it should; wizards are only for human-only steps ✔**
   - c) Only on Windows
   - d) Only if it's secret

   *Why:* the explicit non-trigger. (W1)
3. **Who runs the generated script?**
   - a) The agent, end to end
   - **b) You, in a real terminal; the agent only checks it statically ✔**
   - c) GitHub Actions
   - d) Vercel

   *Why:* it opens browsers and waits for a human. (W1, W3)
4. **You ran the wizard with `!` inside the Claude chat and it raced through every question. Fix?**
   - a) Add `sudo`
   - b) Reinstall `gh`
   - **c) Run it in a real interactive terminal ✔**
   - d) Edit the library

   *Why:* the chat can't press Enter or type for you. (W9)
5. **Does an API key typed into the wizard reach the model's context?**
   - **a) No. The script captures it with hidden entry and writes it to `.env` or a secret ✔**
   - b) Yes, always
   - c) Only on Claude Code
   - d) Only if it's long

   *Why:* the agent writes the script but isn't connected to it; pasting into chat is different. (W3)
6. **You mistyped a value at stage 3 of 5. What now?**
   - a) Press Back
   - **b) Ctrl-C and re-run; saved values are offered back, so press Enter through the good ones ✔**
   - c) Delete `.env` and start over
   - d) Ask the agent to edit `.env`

   *Why:* there's no back button; re-runs reuse saved values. (W3)
7. **A value CI reads that is sensitive goes where?**
   - a) `.env` only
   - **b) A GitHub secret via `set_secret` ✔**
   - c) A GitHub variable
   - d) Nowhere

   *Why:* the destinations table. (W3)
8. **Which part of the generated script may the agent edit?**
   - a) All of it
   - **b) Only the stages below the STAGES marker ✔**
   - c) Only the helpers
   - d) Nothing

   *Why:* the library is identical in every wizard and never hand-edited. (W1, W2)
9. **A wizard for a one-off migration has finished. What do you do with it?**
   - a) Commit it to main
   - **b) Delete it; commit only repeatable setup paths and link them from the README ✔**
   - c) Email it to the team
   - d) Convert it to a Skill

   *Why:* ephemeral by default. (W1, W3)
10. **`gh` isn't installed when a stage calls `set_secret`. What happens?**
    - a) The run crashes
    - **b) A warning, then the closing summary lists the secret to set by hand ✔**
    - c) It installs `gh`
    - d) It writes the secret to chat

    *Why:* graceful fallback. (W2, W3)

## Open questions / uncertain
- The W7 paraphrases come from an Arabic auto-translation. Re-check against the English captions before quoting Matt.
- The aihero wizard page date is either Aug 5 or Aug 24, 2026 (sources differ).
- Lesson 4's "download my laptop password (automatic)" stage isn't reproducible from the repo, because the script was deleted.
